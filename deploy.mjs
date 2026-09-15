/**
 * One command from an edit to a live site.
 *
 *   node deploy.mjs "what changed"
 *
 * Rebuilds index.html from portfolio.html, refuses to go any further if the
 * contrast gate fails, then commits and pushes. Vercel is watching the GitHub
 * repo, so the push is the deploy — there is no second command.
 *
 * The gate runs BEFORE the commit on purpose. A failing contrast check that
 * only shows up after the push is a broken site that is already live.
 */
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const message = process.argv.slice(2).join(' ').trim()

if (!message) {
  console.error('\n  Give the change a message:\n\n    node deploy.mjs "shortened the hero blurb"\n')
  process.exit(1)
}

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: HERE, stdio: 'inherit', shell: false, ...opts })

const quiet = (cmd, args) =>
  execFileSync(cmd, args, { cwd: HERE, encoding: 'utf8' }).trim()

try {
  console.log('\n1/4  build')
  run(process.execPath, ['build.mjs'])

  console.log('\n2/4  contrast gate')
  run(process.execPath, ['check-contrast.mjs'])

  console.log('\n3/4  commit')
  if (!quiet('git', ['status', '--porcelain'])) {
    console.log('     nothing changed — no commit, no deploy')
    process.exit(0)
  }
  run('git', ['add', '-A'])
  run('git', ['commit', '-m', message])

  console.log('\n4/4  push')
  run('git', ['push'])

  const url = quiet('git', ['config', '--get', 'remote.origin.url'])
  console.log(`\n  pushed to ${url}`)
  console.log('  Vercel builds on the push — check the deployment there in ~20s.\n')
} catch (err) {
  console.error('\n  stopped: ' + (err.message || err))
  console.error('  nothing was pushed.\n')
  process.exit(1)
}
