# KP Packaging Website Handoff

This file is a practical handoff for continuing the KP Packaging website project.
Read it before making any code, content, design, or deployment changes.

## Project Summary

This repo is the production website for KP Packaging, a Mumbai based manufacturer
and distributor of coated papers and flexible packaging with a plant in Silvassa.
The site is a static rebuild of the old Webflow website and is optimized for SEO,
AEO, and GEO, meaning all important content is server rendered and available to
search engines and AI crawlers.

- Local repo: `/Users/riyaansheth/kp`
- GitHub repo: `github.com/riyaansheth/KP_Packaging_Website_New`
- Branch: `main`
- Hosting: Netlify
- Build command: `node build.js`
- Publish directory: `dist/`
- Production domain: `kppackaging.com`

Push directly to `main`. Netlify deploys automatically after push.

## User Preferences

- Make reasonable product and engineering decisions independently.
- Do not stop for optional mid-task permission questions.
- After completing requested changes, commit and push automatically.
- Keep `context.md` updated whenever project files change.
- Do not add AI attribution or co-author lines to commits.

Important nuance: this file is named `claude.md` because the owner requested a
handoff file. Do not interpret that as permission to add AI attribution to git
commits.

## Repository Structure

```text
js/data.js
  Main source of truth for company info, stats, clients, certificates, team,
  offices, FAQ, capabilities, infrastructure, industries, products and filters.

build.js
  Static site generator. It builds HTML, JSON-LD, sitemap, robots.txt,
  llms.txt and llms-full.txt into dist/.

js/app.js
  Browser interactions only: mobile nav, quote modal, product filters, product
  drawer, smooth scroll, reveals, counters and parallax.

css/styles.css
  Full visual system and layout CSS.

assets/
  Images, logos, certificate assets and product photos. Most photos are WebP.

dist/
  Generated production output. This directory is committed to git and deployed.
  Never edit it directly. Regenerate it with node build.js.

docs/
  Project log, client feedback checklist and AEO/GEO prompt notes.

context.md
  Ongoing AI handoff memory. Update it after every project change.
```

## Standard Workflow

1. Edit source files, usually `js/data.js`, `build.js`, `css/styles.css`,
   `js/app.js`, assets, docs, or `context.md`.
2. If source affects the site, run:

```bash
node -c js/data.js
node -c build.js
node -c js/app.js
node build.js
```

3. Verify generated output under `dist/`.
4. Commit and push:

```bash
git add -A
git commit -m "Clear concise message"
git push origin main
```

There may be a post-commit hook that automatically pushes to `origin/main`.
If it does, do not push a second time unless status shows the branch is behind.

## Build-Time Postprocessors

`pageShell()` in `build.js` applies these transformations:

1. `stripDashesInText()` removes hyphens and dashes from visible text between
   HTML tags, excluding scripts and styles.
2. `applyHeadingTitleCase()` title-cases h1 to h4 headings and strips trailing
   full stops from headings.
3. `versionAssets()` appends `?v=<md5-8>` to `/assets/*` URLs.

Write natural sentence case in source. The build pipeline handles headings and
asset cache busting.

Do not remove `versionAssets()`. Assets are served with one-year immutable cache
headers, so replacing an image under the same filename is safe only because the
hash changes.

## Hard Content Rules

- Brand name: `KP Packaging`
- Do not use `K P Packaging`, `K P Packaging Ltd.` or `Limited` in visible copy.
- Use `inquiry`, never `enquiry`.
- Stats: 30+ years, 25+ countries, 500+ clients, 25+ grades.
- Prose phrasing: `around 500 clients across about 25 countries`.
- Machines: Korean, Chinese and American.
- Spell `United States of America`, not just `America`.
- Use `medical or surgical` in prose, not `medical/surgical`.
- Section title: `Two verticals, one promise`.
- Tagline: `Packaging you can rely on`.
- Extrusion homepage copy: `Poly (LDPE) coating on printed and unprinted paper,
  board and aluminium foil`.
- Printing: `8-colour` belongs in description only, not as a title.
- Hero wording includes `engineered for sealing, barrier, strength and print`.
- No eyebrow labels above headings.
- Headings have no trailing full stops.
- Box and card titles are centered.
- All visible text and subtext should be centre-aligned across pages.
- Header and top nav use translucent glass styling.
- Form should stay minimal: Name, Phone and Email are required.
- Quote modal defaults to Glassine Paper.
- Quote modal has a Coating field with PE and without PE choices.
- Stiffener option displays as `Stiffener Paper`.

## Company Facts

- Corporate office: A to Z Industrial Estate, Western Wing, Office No 143,
  Ganpat Rao Kadam Marg, Lower Parel, Mumbai 400013
- Corporate phone: +91 85916 56966
- Corporate email: prem@kppackaging.com
- Plant: 792, Apple Insulated, Nr Crown Tapes, Vaibhav Laxmi, Silvassa,
  India 396193
- Plant phone: +91 85916 94328
- Plant email: sales@kppackaging.com
- Leadership: Madhukant Vira, Chairman; Ketan Vira, CEO; Prem Vira, Director
- Clients shown: Cipla, Parksons, Reliance Polymers, Dr. Reddy's, Godrej,
  Wipro, Zydus, Amul, Intas, Dow Chemicals, Wockhardt
- Certifications shown: ISO, AEO Indian Customs, Make in India, MSME, CE, IAF
- Infrastructure: 3 extrusion lamination machines from Korea, China and the
  United States of America; 1 Indian 8-colour rotogravure; 3 Italian Bimec,
  1 German and 2 Indian slitters; 1 Indian sheet-cutter
- Homepage best-selling trio: 4-Ply, MG Poster, Glassine

## Current Product Catalogue

Current product count: 23.

Products:

- Glassine Paper
- MG Poster Paper
- Chromo Paper
- Cupstock Paper
- 3 Ply Paper
- 4 Ply Paper
- MG Kraft Paper
- MF Craft Paper
- Folding Box Board
- Duplex Board
- Non-Woven / Non-Tearable Paper
- PE Stiffener Paper
- Greaseproof Paper
- Paper Lid
- Anti-Skid Paper
- Liquid Packaging Board
- Butcher Paper
- Medical Grade Paper
- Butter Packaging
- Maplitho Paper
- Tissue Paper
- Bactide Paper
- Grid Coated Paper

Slug stability notes:

- `bactite` slug is kept, but visible product name is `Bactide Paper`.
- `grid-lacquer` slug is kept, but visible product name is `Grid Coated Paper`
  and subtopic is `Grid Lacquer`.
- `pe-coated-stiffener-paper` slug is kept, but visible product name is
  `PE Stiffener Paper`.

Recent catalogue additions and product images:

- MF Craft Paper uses existing MG Kraft image.
- Paper Lid uses `assets/products/paper-lid.webp`.
- Anti-Skid Paper uses `assets/products/anti-skid-paper.webp`.
- Liquid Packaging Board uses `assets/products/liquid-packaging-board.webp`.
- Butcher Paper uses `assets/products/butcher-paper.webp`.
- Medical Grade Paper uses `assets/products/medical-grade-paper.webp`.
- Butter Packaging uses `assets/products/butter-packaging.webp`.
- Non-Woven / Non-Tearable Paper image was replaced at
  `assets/products/non-tearable-paper.webp`.

## Industries

The site has 4 industry pages:

- Pharmaceutical
- Food & Beverage
- FMCG
- Medical or Surgical

Industry product arrays live in `js/data.js`. Keep them in sync when adding or
renaming products.

## SEO, AEO and GEO

Do not weaken the structured-data layer.

The generated site includes:

- Server-rendered HTML on every page.
- Organization, WebSite, WebPage, Product, FAQPage, LocalBusiness,
  BreadcrumbList, ItemList, Person and Service JSON-LD.
- `robots.txt` with explicit allowances for major AI crawlers.
- `sitemap.xml`.
- `llms.txt` and `llms-full.txt`, generated from `js/data.js`.
- Legacy Webflow redirects in `netlify.toml`.
- PNG Open Graph image at `assets/og-cover.png`.
- Geo metadata for India and Maharashtra.
- Security headers in `netlify.toml`.

After content or template changes, parse JSON-LD across `dist/` before shipping.

Useful check:

```bash
node -e "const fs=require('fs'),path=require('path');let files=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name==='index.html')files.push(p)}}walk('dist');let blocks=0;for(const f of files){const h=fs.readFileSync(f,'utf8');const re=/<script type=\"application\\/ld\\+json\">([\\s\\S]*?)<\\/script>/g;let m;while((m=re.exec(h))){JSON.parse(m[1]);blocks++}}console.log(files.length+' html files, '+blocks+' JSON-LD blocks parsed')"
```

## Forms and Email

Forms are wired to Netlify Forms:

- `contact`
- `quote`

AJAX submission and honeypot handling live in the frontend.

Inquiry email sending is also implemented through:

```text
netlify/functions/send-inquiry.js
```

It uses Resend. Required Netlify environment variables:

- `RESEND_API_KEY`
- `INQUIRY_FROM_EMAIL`, a verified sender such as
  `KP Packaging <website@kppackaging.com>`

Optional:

- `INQUIRY_TO_EMAILS`, defaults to `prem@kppackaging.com,sales@kppackaging.com`

The visitor email must be used as `Reply-To`, not literal `From`, otherwise
SPF/DMARC will fail.

## Image Pipeline

- Product and page photos are mostly WebP.
- Pillow is available through `python3` on this machine.
- Use 16:10 for industry tile images.
- House style for generated images: bright airy natural light, soft cream white
  background, premium editorial commercial photography, no text and no
  watermark.
- Always visually verify downloaded or generated images before committing.
- Reject images that are dark, watermarked, competitor branded, illegible or
  badly cropped.

About page image facts:

- `assets/about-hero.webp` comes from old original site image `jumbo-rolls.jpg`.
- `assets/our-story.webp` comes from old original site image
  `PHOTO-2023-01-24-11-36-54.jpg`.
- They were sourced from original `kppackaging.com/about-us` via image proxy
  because the legacy custom domain timed out locally.

## Recommended Verification

For most changes:

```bash
node -c js/data.js
node -c build.js
node -c js/app.js
node -c netlify/functions/send-inquiry.js
node build.js
```

Then verify:

```bash
find dist/products -mindepth 2 -maxdepth 2 -type f -name index.html | wc -l
git status --short
git diff --stat
```

Use `rg` for searching. On this machine, plain `grep` can be flaky for some
patterns, so `perl -ne 'print if /pattern/'` is a reliable fallback.

## Current Pending Items

See `docs/kp-packaging-website-changes.md` for the full checklist.

Known pending or blocked items:

- Owner assets needed: 3 team photos, PaperX factory photo, Borkar Packaging
  logo, DCPL logo, FSC logo, PaperX logo, Food Grade cert logo and replacement
  hero or facility photo.
- Network section still needs India domestic map and around 25-country export
  map.
- Netlify env vars for Resend still need to be added before inquiry emails send.
- Confirm exact founding year. It is currently estimated as 1990.
- Confirm schema `sameAs` social profile URLs. They are currently empty.
- AI tile images are v1 and may need art-directed replacements.
- Remaining GEO work is off-site: Google Business Profile for both locations,
  Search Console and Bing sitemap submission, directory and social profiles.

## Last Known Good State

As of August 18, 2026:

- Latest pushed product-catalogue commit before this handoff:
  `9b8a2cd Update product catalogue`
- Build output after that commit:
  `Built 32 pages + robots.txt, sitemap.xml (32 urls), llms.txt -> dist/`
- Product page count:
  `23`
- JSON-LD validation:
  `32 html files, 191 JSON-LD blocks parsed`
- Follow-up cleanup after the catalogue commit removed stale `K P Packaging`
  brand output, made the contact page phone field required, and removed literal
  NUL marker bytes from `build.js`.
