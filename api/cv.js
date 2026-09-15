/**
 * Which CV a visitor gets, decided by where they are.
 *
 * Vercel puts the caller's country on every request as `x-vercel-ip-country`
 * (a two-letter ISO code, or XX when it cannot tell). This function reads it
 * and redirects to the right PDF — so one link on the page serves both
 * markets, and the file that lands in the recruiter's downloads folder is
 * already named for theirs.
 *
 * It only runs on Vercel. Everywhere else the button's own href is used, which
 * is why that href points at a real file rather than at this route.
 */

// Exactly the UAE, as asked. To cover the rest of the Gulf — the UAE CV is the
// one written for a candidate who needs sponsorship — make this:
//   ['AE', 'SA', 'QA', 'KW', 'OM', 'BH']
const UAE_CV_COUNTRIES = ['AE']

// Same filename, different folder, on purpose: whichever one a visitor is sent,
// the file that lands in their downloads folder is called the same thing. The
// market is the directory, which only this code ever reads.
const UAE_CV = '/cv/uae/Mehrban-Ali-AI-Automation-Engineer-CV.pdf'
const PAKISTAN_CV = '/cv/pakistan/Mehrban-Ali-AI-Automation-Engineer-CV.pdf'

export default function handler(req, res) {
  const country = String(req.headers['x-vercel-ip-country'] || '').toUpperCase()
  const target = UAE_CV_COUNTRIES.includes(country) ? UAE_CV : PAKISTAN_CV

  // Never cache the decision. A CDN that caches one visitor's redirect would
  // hand the next country the wrong CV, and the mistake would be invisible.
  res.setHeader('Cache-Control', 'no-store, must-revalidate')
  res.setHeader('Location', target)
  // 307, not 301: the browser must ask again next time rather than remember
  // this answer for a visitor who may be somewhere else entirely.
  res.statusCode = 307
  res.end()
}
