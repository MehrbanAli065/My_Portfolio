/**
 * The CV link that was handed out before 30 Oct 2026 (LinkedIn, old CVs)
 * points here, so the route stays — it now always sends the Pakistan CV.
 *
 * It used to read `x-vercel-ip-country` and send the UAE CV inside the UAE.
 * That was removed at his request when the portfolio stopped offering the UAE
 * CV; the UAE copy is no longer deployed (see .vercelignore).
 */

const CV = '/cv/pakistan/Mehrban-Ali-AI-Automation-Engineer-CV.pdf'

export default function handler(req, res) {
  // Kept no-store so the old country-dependent redirect, if any CDN still
  // holds it, is not what a visitor gets.
  res.setHeader('Cache-Control', 'no-store, must-revalidate')
  res.setHeader('Location', CV)
  res.statusCode = 307
  res.end()
}
