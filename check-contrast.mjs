/**
 * Measure the contrast of every piece of text on the built page, in both themes.
 *
 *   node build.mjs && node check-contrast.mjs
 *
 * Not a token table — the real rendered colours. It injects contrast-audit.js
 * into index.html, loads it in a headless browser, and reads back what each
 * element is ACTUALLY painted in after color-mix(), inherited opacity and
 * alpha compositing. Those three are exactly what a palette spreadsheet misses:
 * the keyword separators were sitting at 1.25:1 and no token check saw it,
 * because --rule is a legitimate value for a border and a terrible one for text.
 *
 * Exits non-zero if anything fails, so it can gate a publish.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))

function findBrowser () {
  const candidates = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  ]
  for (const exe of candidates) if (fs.existsSync(exe)) return exe
  return null
}

const browser = findBrowser()
if (!browser) { console.error('No Chromium-based browser found.'); process.exit(1) }

const page = fs.readFileSync(path.join(HERE, 'index.html'), 'utf8')
const js = fs.readFileSync(path.join(HERE, 'contrast-audit.js'), 'utf8')

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'contrast-'))
// the portrait has to come along or the page renders a broken image
fs.copyFileSync(path.join(HERE, 'photo.jpg'), path.join(tmp, 'photo.jpg'))

let failed = 0

for (const theme of ['light', 'dark']) {
  const html = page
    .replace('<html lang="en">', `<html lang="en" data-theme="${theme}">`)
    .replace('</body>', `<script>${js}</scr` + `ipt></body>`)
  const file = path.join(tmp, `${theme}.html`)
  fs.writeFileSync(file, html)

  const dom = execFileSync(browser, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--virtual-time-budget=4000',
    `--user-data-dir=${path.join(tmp, 'u-' + theme)}`,
    '--dump-dom', pathToFileURL(file).href,
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] })

  const m = dom.match(/<pre id="AUDIT">(CHECKED[\s\S]*?)<\/pre>/)
  if (!m) { console.error(`${theme}: audit block not found`); process.exit(1) }

  const text = m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  const lines = text.trim().split('\n')
  const checked = lines[0]
  const rows = lines.slice(2).filter(Boolean)

  // WCAG 1.4.3 exempts logotypes. The TypeScript mark is white on its own
  // brand blue at 3.51:1 — reproducing it correctly matters more, and the word
  // "TypeScript" sits beside it in full contrast.
  const real = rows.filter(r => !/\|\s*TS\s*$/.test(r))

  console.log(`\n${theme.toUpperCase()}  ${checked}`)
  if (!real.length) {
    console.log('  no failures' + (rows.length ? `  (${rows.length} logotype exemption)` : ''))
  } else {
    failed += real.length
    console.log(`  ${real.length} FAILURES`)
    for (const r of real) console.log('    ' + r)
  }
}

try { fs.rmSync(tmp, { recursive: true, force: true }) } catch {}

console.log()
if (failed) { console.log(`${failed} contrast failures`); process.exit(1) }
console.log('all text passes WCAG AA in both themes')
