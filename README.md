# Portfolio

The public portfolio page. One source file, two outputs, one set of facts shared with
the CV.

## Files

| File | What it is |
|---|---|
| `portfolio.html` | **The page. This is the file you edit.** No `<!doctype>`, `<html>`, `<head>` or `<body>` — the Artifact host supplies those. |
| `build.mjs` | Wraps `portfolio.html` in a full HTML document. |
| `index.html` | **Generated. Never edit.** Opens by double-clicking; deploys to GitHub Pages, Vercel or Netlify unchanged. |
| `photo.svg` | Portrait placeholder. Replace it — see below. |

```bash
node build.mjs
```

Editing `index.html` by hand puts it out of step with `portfolio.html`, which is the
same failure that produced two CVs disagreeing about employment dates. Edit the source
and rebuild.

## Putting your own photo in

The placeholder is a plain file, so swapping it is a one-line change:

1. Save your photo into this folder as `photo.jpg`. **Portrait, 5:6** (e.g. 800 × 960)
   — the frame crops to that ratio, so a landscape shot loses its sides.
2. In `portfolio.html`, change the one `src` in the `<figure class="photo">` block from
   `photo.svg` to `photo.jpg`, and delete the `<figcaption>Photo to follow</figcaption>`
   line.
3. `node build.mjs`
4. Ask Claude to republish, passing `photo.jpg` as a file.

Keeping the name `photo.svg` and just overwriting that file also works and skips steps 2
and 3 — but only if your replacement is genuinely an SVG.

## Diagram walkthrough

There are no demo videos, and no placeholder pretending there will be. Instead each
architecture diagram carries a **Play walkthrough** button under it. Pressing it steps
through the flow: one stage at a time, the relevant boxes light green and a caption
below names what is happening at that point. It runs five stages, then resets.

The stages live on the figure itself, so the copy sits next to the thing it describes:

```html
<figure class="diagram" data-wt='[{"n":[0,1],"t":"The queue is loaded..."}, ...]'>
```

`n` is a list of indexes into that diagram's `rect.dnode` elements, in document order;
`t` is the caption. The controller at the bottom of the `<script>` block reads the
attribute, so adding a stage means editing only the JSON. Nothing else to touch.

Highlighting is a single class, `.dnode.is-on`, using `--spine` (green) so it reads as
progress rather than as another accent. Under `prefers-reduced-motion` the button is
still there and still steps, it just does not auto-advance.

**Why not a real video embed.** A published artifact runs under a content policy that
blocks iframes and video from every outside host, so a YouTube or Loom embed renders as
an empty box with no error. A plain link in a new tab would work, and so would an embed
on your own domain (`index.html` on Vercel/Netlify/Pages) if you record demos later.

## Problem / Approach / Outcome

Every project leads with a three-column strip before its diagram, because that is the
order a hiring manager reads in: what was wrong, what you did about it, what came of it.

The three rules above the columns step from neutral to a soft cobalt to full cobalt as
you move along, so the arc is visible before a word is read. Markup:

```html
<div class="pao">
  <div class="pao-item pao--problem">  <h4>Problem</h4>  <p>...</p> </div>
  <div class="pao-item pao--approach"> <h4>Approach</h4> <p>...</p> </div>
  <div class="pao-item pao--outcome">  <h4>Outcome</h4>  <p>...</p> </div>
</div>
```

Keep each block to roughly **40-55 words**. They sit in three columns at about 46
characters a line; longer and one column runs away from the other two, which is what
makes a strip like this look untidy. `<strong>` is the emphasis — it picks up the
column's own colour, full cobalt inside the outcome.

Rules for the writing, so this stays useful rather than decorative:

- **Problem** is the client's situation before you arrived, not a description of your
  software. Name the volume or the cost if you know it.
- **Approach** is the decision you made, not the tool list. "Fed by queue items rather
  than a list to walk through" is an approach; "built with UiPath" is not — the stack
  line at the bottom already covers that.
- **Outcome** must be checkable. Every figure in an outcome block traces to the table
  further down this file, except the operational volumes, which are marked as such.

## Architecture diagrams

Every project carries one, hand-authored inline SVG — no library, no images, and they
re-colour with the theme because every stroke and fill reads a CSS variable.

Each one is drawn to make a single point, which its caption states:

| Project | What the diagram shows |
|---|---|
| Clinic robots | the retry arrow back into the queue — one failed appointment, not a failed batch |
| AI agent suite | four channels converging on one agent and **one** knowledge base |
| Shopify tracker | two callers, one PostgreSQL function, so the paths cannot drift |
| AI Scoping Pipeline | a PM review gate between every AI stage, and the mapping table that makes re-runs safe |
| Legal intake | the phase split, and the retry scope around the one step that fails intermittently |

To edit one, the shapes use shared classes — `.dnode`, `.dnode--key` (the emphasised
box), `.dlabel`, `.dsub`, `.dedge`, `.dedge--flow` (animated), `.dtag`, `.spark`.

**Set text alignment with `.dtag--start` / `.dtag--end`, never a `text-anchor`
attribute.** The class rules define `text-anchor`, and a class beats a presentation
attribute — an attribute is silently ignored, which centres the label and clips it off
the edge of the drawing.

## Palette — from the LinkedIn banner

The page takes its colours from the **07-cobalt** banner, so the banner, the CV and the
portfolio read as one identity.

| Token | Light | Dark | Where |
|---|---|---|---|
| `--paper` / `--surface` | `#FFFFFF` | `#0A0D12` / `#10141B` | page and card grounds |
| `--sunken` | `#F5F6F8` | `#171C25` | insets, diagram panels, pills |
| `--ink` / `--deep` | `#0B0F16` | `#E8EAEE` | body text and every heading |
| **`--accent`** | **`#1D4ED8`** | `#7BA6F5` | links, diagram edges, the highlighted rule |
| `--signal` | `#1D4ED8` | `#7BA6F5` | measured figures |
| `--muted` | `#454D5C` | `#A7AFBD` | supporting text, captions |
| `--faint` | `#5A6270` | `#8D95A4` | stack lines, colophon |
| `--rule` / `--hairline` | `#E4E6EA` / `#EDEEF1` | `#2A313D` / `#1B212B` | borders and dividers |

A banner needs five colours; a page needs eleven. `deep`, `signal`, `faint` and
`hairline` are **derived** from the banner's five — never borrowed from another family.
Both themes were re-validated after the swap: **worst case 5.67:1**, comfortably past AA.

### One consequence worth knowing

The banner has a single accent, so `--signal` and `--accent` are now the same blue. That
collapsed the Problem → Approach → Outcome progression, which used to run neutral →
accent → copper.

It is encoded by **strength** instead of hue now: grey, then cobalt mixed back toward the
rule, then cobalt at full. Same colour, three steps. If you ever want the three-colour
version back, give `--signal` its own hex and the original rule returns.

## Theme switch

Three states, top right: **Light · Auto · Dark**. Auto follows the viewer's device.

A choice is remembered in that browser only, and only after it is used — on a first
visit the page does not override the theme the viewer is already reading in. It falls
back silently if the browser blocks storage, so it works in a private window too.

## Motion

All of it is on-load or on-hover; nothing waits for a scroll, so the whole page is
readable the moment it opens.

- **Every diagram runs continuously.** Connectors are drawn as flowing dashes, and a
  token travels each hop on a 2.6s cycle, staggered along the chain — so each drawing
  shows work moving through it rather than sitting still. That is the main motion on the
  page and it is on-subject: it is what these systems actually do.
- The masthead settles in on load, staggered, finished within ~0.9s.
- The availability dot pulses.
- Hovering a project lifts the box, gives it an accent edge, and brightens its domain
  label.
- Everything above is disabled under `prefers-reduced-motion: reduce`.

The token motion is SVG `<animateMotion>`; the dashes and fades are CSS. Both are set to
the same 2.6s cycle — if you change one, change the other or the dot fades out of step
with its travel.

## Live

Published at:

```
https://claude.ai/code/artifact/1c661c4f-7750-4154-ad71-9cdeecaeed5d
```

It is **private until shared** — open the page's share menu to give it a public link
before putting it on LinkedIn or a CV.

To republish after an edit: `node build.mjs`, then ask Claude to publish
`portfolio.html` to that URL. Publishing without the URL creates a *second* artifact
rather than updating this one.

## Deploying to Vercel through GitHub

**This folder is its own Git repository.** That is deliberate: `git push` from here can
only ever send `Mehrban/Portfolio`. Nothing above it — the CV project, the banner
images, the project archives — is reachable by the repo, so it cannot be pushed by
accident.

### One-time setup

1. **Create an empty repo on GitHub.** No README, no .gitignore, no licence — this
   folder already has a history. Private is fine; Vercel deploys private repos.
2. **Point this folder at it and push:**

   ```bash
   cd E:/Portfolio/Mehrban/Portfolio
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. **Import it on Vercel** — vercel.com → *Add New…* → *Project* → pick the repo.
   Framework preset **Other**. Leave Build Command and Output Directory **empty**; the
   site is already built. Deploy.
4. Vercel now watches `main`. Every push deploys automatically, and every pull request
   gets its own preview URL.

### Every change after that

```bash
node deploy.mjs "what changed"
```

Which rebuilds `index.html` from `portfolio.html`, runs the contrast gate, commits, and
pushes. Vercel does the rest. **The gate runs before the commit on purpose** — a
contrast failure discovered after the push is a broken page that is already live. If
anything fails, nothing is pushed.

Edit `portfolio.html`, never `index.html`.

### Why both files are called the same thing

`Mehrban-Ali-AI-Automation-Engineer-CV.pdf` — in `cv/uae/` and in `cv/pakistan/`, and
in `CV/Cvs/UAE/` and `CV/Cvs/Pakistan/`.

The name is built for a recruiter's downloads folder: **his name first**, so it sorts
and is findable among twenty attachments; **the role** he is applying for, which is what
someone scanning an attachment list is looking for; then **CV**, so the file says what
it is before anyone opens it. "CV" rather than "Resume" — that is the word used in both
the UAE and Pakistan.

The market is the **folder**, never the filename. A recruiter only ever receives one of
the two, so a `-UAE` or `-Pakistan` suffix tells them nothing they need, and invites the
one question you do not want in an inbox: *why does he have a different CV for me?*
Two directories with one filename means the geo route can send either version and the
file that arrives is named identically.

### Which CV a visitor gets

`api/cv.js` is a Vercel function. It reads `x-vercel-ip-country` from the request and
redirects: **the UAE CV inside the UAE, the Pakistan CV everywhere else.** The country
list is one array at the top of the file — the comment there shows how to cover the
rest of the Gulf.

The hero button's `href` in the markup is a real file, not that route, because the
route only exists on Vercel. A few lines at the foot of the page swap it for `/api/cv`
when the page is being served over http(s) outside the Claude artifact. On the
artifact, and from a local file, the static href is used. Verified all three ways.

The footer still names both CVs explicitly, so nobody has to be in the right country to
get the other one.

The redirect is sent `no-store`: a CDN that cached one visitor's answer would hand the
next country the wrong CV, and the mistake would be invisible.

### The two published copies

The site now lives in two places and they are updated separately:

| | Updated by |
|---|---|
| Vercel | `node deploy.mjs "…"` |
| Claude artifact | asking Claude to publish, passing the `files` map for the PDFs |

They serve the same `index.html`. Only the CV button differs, and only because
`/api/cv` does not exist on the artifact.

## The CV

`cv/` holds the two PDFs the page serves — `cv/uae/` and `cv/pakistan/`, copied from `CV/Cvs/`. They are published **as
supporting files of the artifact**, so they sit next to `index.html` at its own
origin and cost nothing until someone asks for one.

The hero button offers the UAE CV; the footer offers both.

**Two routes, deliberately.** A published artifact cannot start a download on its own —
the sandbox makes `<a download>` inert, data: and blob: hrefs included. So:

1. **The anchor itself** is an ordinary `href` to the PDF with `target="_blank"`. With
   no script at all, clicking opens the CV in a new tab, where the browser's own PDF
   viewer has a save button. This is the floor and it works everywhere.
2. **The `downloads` capability** upgrades that click where the viewer's client grants
   it: the script fetches the PDF sitting beside the page and calls
   `downloads.save({filename, data})`, which shows the viewer a normal save prompt with
   the right filename. Declared at publish time as `capabilities: {downloads: true}`.

Every failure falls back to route 1. `declined` — the viewer saying no to the prompt —
is left alone rather than retried.

**After rebuilding a CV**, copy it over and republish *with the files map*:

```bash
cp CV/Cvs/UAE/Mehrban-Ali-AI-Automation-Engineer-CV.pdf       Portfolio/cv/uae/
cp CV/Cvs/Pakistan/Mehrban-Ali-AI-Automation-Engineer-CV.pdf  Portfolio/cv/pakistan/
```

then ask Claude to publish passing `files` with both `cv/...pdf` paths. A publish that
omits `files` keeps whatever is already served, so the old PDF would stay.

## Navigation

Three routes, because the page is roughly 11,000px tall:

- **The bar.** Sticky, opaque. Below 680px the name gives up its space — the avatar
  identifies the page on its own — and the links become a horizontally scrolling strip
  with a fade on the right edge. Before this they were simply `display: none` on a
  phone, which left a very long page with no way to jump.
- **The project index.** Five pills under the *Featured projects* heading, one per
  project, linking to `#p1`…`#p5`. It also scrolls sideways rather than stacking.
- **`scroll-margin-top: 70px`** on every section and project, so an anchor jump does
  not park the heading underneath the sticky bar.

## Scrolling performance

Three things were making a long page expensive, all fixed:

1. **The sticky bar had `backdrop-filter: blur(12px)`.** That re-blurs a window-wide
   strip on every scroll frame and is the single most expensive thing a sticky header
   can do on a phone. It is now an opaque background. It reads the same.
2. **51 infinite animations** — 31 flowing edges and 20 sparks across six diagrams —
   ran whether or not you could see them. An `IntersectionObserver` now adds `.is-idle`
   to offscreen figures (which pauses the CSS dash flow) and calls
   `svg.pauseAnimations()` on each one (which stops its SMIL timeline). Both resume
   200px before the figure reaches the viewport. Measured: five of six paused at rest.
3. **`content-visibility: auto`** on `#experience`, `#capabilities` and
   `#certifications` — about 3,700px the browser no longer styles or paints on first
   load. `contain-intrinsic-size: auto <height>` means the real height is remembered
   after the first pass, so the scrollbar does not jump.

`prefers-reduced-motion` also turns off `scroll-behavior: smooth`.

## How a build actually goes

Four numbered steps under the credential tiles, describing the method every project on
the page followed: map the real process, build on a queue, harden before handover, hand
it over properly. Written from what is in the XAML and the runbooks — it is not a
methodology diagram, and every claim in it is visible in the projects below.

## The five projects, and where each one came from

Ordered by how much they carry. Client names are withheld throughout — see
`../CV/Update_BY_Claude/HANDOVER.md` §7.

| On the page | Source | Described as |
|---|---|---|
| Clinic Booking & Scheduling Robots | `Projects/Project_6_ShiftGrit/` | a multi-site mental-health clinic group, Canada |
| Multi-Channel AI Agent Suite | `Projects/Project_4_Retell_AI_Agent/` | the same clinic group |
| Competitor Price & Stock Tracker | `Projects/Shopify_Stores/` | e-commerce competitor intelligence |
| AI Scoping Pipeline | `Projects/Project_2_*/` | an internal delivery platform |
| Legal Case Intake Automation | `Projects/St luice__Automation_Project (2).zip` | a US county |

## Every figure on the page, and what it was counted from

The constraint carried over from the CV: **nothing is estimated.** Each number below was
counted in the project itself and can be recounted.

| Figure | Counted from |
|---|---|
| 4 robots, 12 workflow files | `Project_6_ShiftGrit/` — four `project.json` files, twelve non-test `.xaml` |
| 26 try/catch blocks | `grep -c '<TryCatch[ >]'` across those twelve files |
| 108 log messages | same, `<ui:LogMessage` |
| 4 channels, 216 prompt revisions | the four Retell agent JSON exports; `response_engine.version` on the inbound agent |
| 65 KB knowledge base | `Knowledge_Base/` — four documents, 65,162 bytes |
| 240+ stores | `Shopify_Stores/README.md` states 242 |
| 1.8%, 7,558 → 136 rows | measured on a real ingest day, recorded in `tracker/README.md` |
| 5.5M vs ~180M rows a year | calculated from that rate |
| 10 tables | `CREATE TABLE` count in `tracker/db/*.sql` |
| 23,769 lines, 137 files | `git ls-files` + `wc -l` in `Project_2_*` |
| 15 tables | `CREATE TABLE` count in `apps/api/src/db/*.sql` |
| 8 certifications, 100% score | `../CV/Ceritificates/` |

## Type scale and heading structure

**Every font-size, line-height and tracking value on the page comes from a token in
`:root`.** Nothing is set ad hoc. Before this, the page had drifted to 28 distinct font
sizes — including eight between `.70rem` and `.755rem` all doing the same job — and 17
letter-spacing values. That is what made the rhythm break as you scrolled: nothing was
wrong on any single line, but no two small labels agreed.

### The steps

| Token | Size | Used for |
|---|---|---|
| `--fs-1` | clamp 2.9 → 4.6rem | the name |
| `--fs-2` | 1.75rem | section titles, big credential numbers |
| `--fs-3` | 1.375rem | project titles, the deck under the name |
| `--fs-4` | 1.125rem | role titles, degree |
| `--fs-5` | 0.9375rem | capability titles, nav mark |
| `--fs-stat` | 1.25rem | the measured figures inside a project |
| `--fs-lede` | 1.1875rem | section opening paragraphs |
| `--fs-body` | 1.0625rem | body prose |
| `--fs-sm` | 0.9375rem | Problem/Approach/Outcome text, certificate names |
| `--fs-mono` | 0.8125rem | contact line, keywords, footer links |
| `--fs-mono-sm` | 0.75rem | captions, stack, figures, rails |
| `--fs-label` | 0.6875rem | every uppercase label |

Line heights: `--lh-hero` `--lh-tight` `--lh-snug` `--lh-body` `--lh-loose`.
Tracking: `--ls-1` … `--ls-4` for headings (tighter as they get bigger), and one
`--ls-label` (`.15em`) shared by **every** uppercase label on the page.

**A step is a visual size, not a heading level.** A capability title is an `<h3>` for
document structure and `--fs-5` for its place inside a card. Never reach for a heading
tag to get a size, or a size to get a level.

The only sizes not on the scale are the two `px` values inside the SVG diagrams, which
are correct: they scale with the `viewBox`, not with the page.

### The outline

```
h1  Mehrban Ali
├── h2  Five systems, and how each one actually runs
│   └── h3  <project title>  ×5
│       └── h4  Problem / Approach / Outcome  ×3
├── h2  Two years, three roles
│   └── h3  <role title>  ×3
├── h2  What I work with
│   └── h3  <capability>  ×6
├── h2  Eight UiPath certifications
└── h2  Open to RPA and Automation Engineer roles in the UAE   (footer)
```

One `h1`, no skipped levels, every tag closed. The capability titles used to be `h4`
directly under an `h2`, which skipped a level — bad for screen readers and for anything
that builds an outline from the page.

### Colour roles

Applied by role, not by taste:

| Role | Token |
|---|---|
| Every heading | `--deep` |
| Body prose | `--ink` |
| Supporting text, captions | `--muted` |
| Tertiary — stack lines, colophon | `--faint` |
| Links, structure, diagram edges | `--accent` |
| Measured figures, the outcome payoff | `--signal` |

The one deliberate exception is the Problem/Approach/Outcome labels, which take
neutral → soft cobalt → full cobalt to encode the sequence.

## The premium pass — what actually makes it read that way

Aimed at recruiters and engineering managers in the **UAE and Pakistan**. Premium here
means restraint and craft, not decoration — the register that reads as expensive to a
hiring manager is space, type and material, in that order.

**Palette — white and cobalt.** Taken from the LinkedIn banner so all three surfaces
match; see the palette table above. It replaced a deep-navy-and-brass scheme, which was
warmer but did not tie to anything else he sends out.

**Type — Newsreader over Figtree.** Newsreader is an *optical* serif: it holds its shape
at 5rem and stays readable at 1rem, which is what lets the name carry the page without
needing a graphic. Figtree keeps the prose quiet underneath. Display weights dropped from
700/800 to 500/600 — at that size a serif gets heavier-looking, not stronger, and 500
reads richer than 700.

**Material — two shadows, not one.** Cards carry a tight contact shadow *and* a wide soft
one. A single blur reads as a sticker; the pair reads as a card sitting on paper. Borders
dropped from `--rule` to `--hairline`, so the edge is felt rather than drawn.

**Space.** Sections 68px → 92px, card padding 30px → 38px, project gaps 26px → 30px. Most
of the perceived difference is this.

**Detail.** A cobalt hairline across the very top of the page, domain labels prefixed with
a short rule, tabular numerals everywhere numbers are read as data, and a cobalt tick above
the credential tile that matters.

Contrast was re-validated after all of it — see below.

## Certifications

Each row carries the UiPath mark, and the one credential with a public verification
page carries a **Verify** link out to it. Only that one — the other seven have no
public URL, and a link that goes nowhere is worse than no link.

## Contrast

Light and dark are both checked against WCAG AA for small text (4.5:1) on every ground
a colour actually sits on — page, card and inset. **Worst case is 5.67:1** after the
move to cobalt.

The brass first came out at `#8A6A2F`, which passed on paper and card but hit **4.48:1**
on the inset panels — a miss by 0.02. It was darkened to `#7E5F28` before shipping.

The previous light palette failed this: `--faint` sat at **3.08:1**, which is what made
the mono captions look washed out. If you change a colour, re-check it — the greys are
the ones that slip.

**Two counts on this page come from Mehrban, not from a file here:**

- **`25+` client automation projects** at Automaxion. Set to `40+` on 14 September 2026
  and revised down to `25+` the next day, replacing `ten projects in nine months` from
  the August handover. The time framing was dropped deliberately — a rate invites
  arithmetic nobody wants a recruiter doing.
- **`45+` in the credential strip** is the career total: 25+ at Automaxion plus 20+ at
  SYBROS. That strip is career-level (8 certifications, 5 industries, two years), so a
  single-employer figure there would have contradicted the experience section below it.
- **`20+` UiPath automations** at SYBROS TECH, revised up from `8` on 15 September 2026.
  The `8` was evidence-based: eight project archives exist in `CV/*.zip`. **The files
  still only show eight**, so this figure now rests on his word, and the archives back
  up fewer than it claims.

Figures that rest on Mehrban's word rather than a file — **100+ bookings a day**, **100+
students a day**, **25+ projects**, **20+ automations** — are Mehrban's own counts. They are marked as such in the page's closing note, and he should be
ready to answer on them in an interview.

## Kept in step with

- `../CV/Update_BY_Claude/cv/cv-content.mjs` — same five projects, same order, same numbers
- `../CV/Update_BY_Claude/HANDOVER.md` — employment dates, certifications, decisions
- `linkedin.com/in/mehrban-ali` — headline leads on **AI Automation Engineer**, as the page and CV title now do

Change a fact in one of these and change it in all of them.
