/**
 * One source, two outputs.
 *
 *   portfolio.html  — the page content. THIS IS THE FILE YOU EDIT.
 *                     No <!doctype>, <html>, <head> or <body>: the Artifact host
 *                     supplies those when it publishes.
 *   index.html      — generated. The same page wrapped in a full HTML document
 *                     so it opens by double-clicking, and deploys to GitHub
 *                     Pages / Vercel / Netlify unchanged.
 *
 *   node build.mjs
 *
 * The wrapper below reproduces the small reset the Artifact host injects, so the
 * local file and the published page render identically. Editing index.html by
 * hand puts the two out of step — the same failure that produced two CVs
 * disagreeing about employment dates. Edit portfolio.html and rebuild.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(HERE, 'portfolio.html')
const OUT = path.join(HERE, 'index.html')

const content = fs.readFileSync(SRC, 'utf8')

// Pulled out of the content so it can sit in <head> where a browser expects it;
// leaving a <title> in the body works, but only by error recovery.
const title = (content.match(/<title>([^<]*)<\/title>/) || [, 'Mehrban Ali'])[1]
const body = content.replace(/<title>[^<]*<\/title>\s*/, '')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="AI Automation Engineer — RPA, UiPath certified, agentic and voice AI. Five systems, and how each one actually runs.">
<meta name="author" content="Mehrban Ali">
<meta property="og:title" content="${title} — AI Automation Engineer">
<meta property="og:description" content="RPA, UiPath certified, agentic and voice AI. Five systems, and how each one actually runs.">
<meta property="og:type" content="profile">
<meta property="og:url" content="https://mehrban-ali.vercel.app/">
<!-- Without og:image every link preview - LinkedIn Featured, WhatsApp, Slack -
     renders as a bare grey box. 1200x630 is the ratio they all crop to.
     Absolute URL, because a relative one is not resolved by a scraper.
     Regenerate the picture with: node og/render.mjs -->
<meta property="og:image" content="https://mehrban-ali.vercel.app/og.png">
<!-- The real pixel dimensions, not the CSS ones. The card is authored at
     1200x630 and rendered at 2x for high-density screens; declaring the
     smaller pair made the tags disagree with the file, which is the sort of
     thing a scraper checks before it trusts an image. -->
<meta property="og:image:width" content="2400">
<meta property="og:image:height" content="1260">
<meta property="og:image:alt" content="Mehrban Ali - AI Automation Engineer. 45+ automation projects delivered, 240+ Shopify stores tracked daily, 11 UiPath and Make credentials.">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='5' fill='%230F3D56'/%3E%3Ctext x='16' y='22' font-family='Helvetica,Arial,sans-serif' font-size='16' font-weight='700' fill='%23F6F8F9' text-anchor='middle'%3EM%3C/text%3E%3C/svg%3E">
<style>
  /* The reset the Artifact host injects, reproduced so both copies match. */
  :root { color-scheme: light dark; }
  body { margin: 0; font: 14px system-ui, -apple-system, "Segoe UI", sans-serif; background: #fafaf9; }
  img { max-width: 100%; }
  [hidden] { display: none !important; }
</style>
</head>
<body>
${body.trim()}
</body>
</html>
`

fs.writeFileSync(OUT, html, 'utf8')

const kb = n => `${(n / 1024).toFixed(1)} KB`
console.log(`✓ portfolio.html  ${kb(content.length)}  → index.html  ${kb(html.length)}`)
console.log(`  title: ${title}`)
