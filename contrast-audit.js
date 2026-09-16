/* Contrast audit run inside the real page.
 *
 * Walks every element that renders text, resolves the colour it is actually
 * painted in (after color-mix and inherited opacity) and the first opaque
 * background behind it, then measures the ratio. SVG text is included via
 * `fill`, because the diagram labels are text too.
 *
 * Output is appended as a PRE element with id AUDIT so --dump-dom can carry
 * it out. The tag is not written literally here: this comment ships inside the
 * page, and an extractor looking for that tag would match the comment first.
 */
(function () {
  function parse (c) {
    var m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    var p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number)
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }
  }
  function lin (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
  function lum (c) { return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b) }
  function ratio (a, b) {
    var la = lum(a), lb = lum(b)
    var hi = Math.max(la, lb), lo = Math.min(la, lb)
    return (hi + 0.05) / (lo + 0.05)
  }
  function over (fg, bg) {            // composite fg (with alpha) onto bg
    var a = fg.a
    return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 }
  }
  // SVG text sits on a SIBLING shape, not an ancestor background. Without this
  // the TypeScript mark reported white-on-white at 1.00:1, which was a fault in
  // the audit rather than in the page.
  // Only for ICON svgs (a 24 or 48 unit viewBox), where the mark is one shape
  // with a label on top and "first filled shape" is the right answer.
  //
  // NOT for the architecture diagrams: there the first filled shape is an
  // arrowhead marker, and comparing every node label against it produced 74
  // false failures. Diagram text falls through to the panel background behind
  // it, which is what it is actually read against.
  function svgBg (el) {
    var svg = el.ownerSVGElement
    if (!svg || !svg.viewBox || !svg.viewBox.baseVal) return null
    if (svg.viewBox.baseVal.width > 64) return null
    var shapes = svg.querySelectorAll('rect, circle, ellipse, polygon')
    for (var k = 0; k < shapes.length; k++) {
      var f = getComputedStyle(shapes[k]).fill
      var c = parse(f)
      if (c && c.a > 0.5 && f !== 'none') return c
    }
    return null
  }
  function bgOf (el) {
    var sv = svgBg(el)
    if (sv) return { c: sv, grad: false }
    var node = el, acc = null
    while (node && node.nodeType === 1) {
      var cs = getComputedStyle(node)
      var c = parse(cs.backgroundColor)
      if (c && c.a > 0) {
        acc = acc ? over(acc, c) : c
        if (c.a === 1) return { c: acc, grad: cs.backgroundImage !== 'none' }
      }
      node = node.parentElement
    }
    return { c: acc || { r: 255, g: 255, b: 255, a: 1 }, grad: false }
  }
  function effOpacity (el) {
    var o = 1, n = el
    while (n && n.nodeType === 1) { o *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement }
    return o
  }

  var rows = []
  // A closed <dialog> is display:none, so nothing inside it would be walked and
  // its colours would ship unmeasured. Open every one non-modally first: show()
  // makes the content visible without a backdrop or an inert page behind it.
  document.querySelectorAll('dialog').forEach(function (d) {
    try { if (!d.open) d.show() } catch (e) {}
  })

  var all = document.querySelectorAll('*')
  for (var i = 0; i < all.length; i++) {
    var el = all[i]
    // only elements with their own visible text
    var own = ''
    for (var j = 0; j < el.childNodes.length; j++) {
      if (el.childNodes[j].nodeType === 3) own += el.childNodes[j].nodeValue
    }
    own = own.replace(/\s+/g, ' ').trim()
    if (!own) continue

    var cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') continue

    var isSvg = el.ownerSVGElement != null || el.tagName.toLowerCase() === 'text'
    var fgRaw = isSvg ? cs.fill : cs.color
    var fg = parse(fgRaw)
    if (!fg) continue

    var op = effOpacity(el)
    if (op < 0.06) continue
    fg = { r: fg.r, g: fg.g, b: fg.b, a: fg.a * op }

    var b = bgOf(el)
    var painted = fg.a < 1 ? over(fg, b.c) : fg
    var r = ratio(painted, b.c)

    var size = parseFloat(cs.fontSize)
    var weight = parseInt(cs.fontWeight, 10) || 400
    if (isSvg) size = size * (el.ownerSVGElement ? (el.ownerSVGElement.getBoundingClientRect().width / (el.ownerSVGElement.viewBox.baseVal.width || 1)) : 1)
    var large = size >= 24 || (size >= 18.66 && weight >= 700)
    var need = large ? 3.0 : 4.5

    if (r < need) {
      rows.push([
        r.toFixed(2), need.toFixed(1),
        el.tagName.toLowerCase() + (el.className && el.className.baseVal === undefined && typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : ''),
        Math.round(size) + 'px/' + weight,
        own.slice(0, 46)
      ].join('  |  '))
    }
  }

  var pre = document.createElement('pre')
  pre.id = 'AUDIT'
  pre.textContent = 'CHECKED ' + all.length + ' elements\nFAILURES ' + rows.length + '\n' + rows.join('\n')
  document.body.appendChild(pre)
})()
