/**
 * og/card.html -> og.png at 1200x630.
 *
 *   node og/render.mjs
 *
 * Rendered at 2x and told to keep the window exactly 1200x630, because every
 * platform that shows a link preview crops to that ratio. Anything else and
 * LinkedIn takes a centre slice of it.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, '..')

const CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
]
const browser = CANDIDATES.find(p => fs.existsSync(p))
if (!browser) {
  console.error('No Edge or Chrome found. Add its path to CANDIDATES.')
  process.exit(1)
}

const out = path.join(ROOT, 'og.png')
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'))

execFileSync(browser, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--user-data-dir=${profile}`,
  '--window-size=1200,630',
  '--force-device-scale-factor=2',
  '--virtual-time-budget=6000',
  `--screenshot=${out}`,
  'file:///' + path.join(HERE, 'card.html').split(path.sep).join('/'),
], { stdio: 'ignore' })

try { fs.rmSync(profile, { recursive: true, force: true }) } catch {}

const kb = (fs.statSync(out).size / 1024).toFixed(0)
console.log(`\u2713 og.png  ${kb} KB  (1200x630 at 2x)`)
console.log('  Remember to publish it: it is referenced as /og.png by the meta tags.')
