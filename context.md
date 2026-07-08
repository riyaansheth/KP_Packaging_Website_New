# KP Packaging Website — LLM Handoff Context

Self-contained briefing for any AI assistant (or developer) continuing work on this project. Read this fully before making changes.

## What this is
Marketing website for **KP Packaging** (kppackaging.com), a Mumbai-based manufacturer + distributor of coated papers and flexible packaging (est. ~1990, plant in Silvassa). Complete rebuild of their old Webflow site, optimized for SEO + AEO/GEO (being recommended/cited by AI engines like ChatGPT/Perplexity/Gemini).

- **Repo:** github.com/riyaansheth/KP_Packaging_Website_New, branch `main` (push directly to main, no PRs)
- **Hosting:** Netlify (auto-deploys on push; build command `node build.js`, publish dir `dist/` — see `netlify.toml`)
- **Local dir:** `/Users/riyaansheth/kp`

## Architecture (static site generator, zero dependencies)
```
js/data.js      ← SINGLE SOURCE OF TRUTH: company info, stats, clients, certs, team,
                  offices, FAQ, why-boxes, CAPABILITIES, INFRASTRUCTURE, INDUSTRIES (4),
                  PRODUCTS (16), FILTERS. CommonJS export guard at bottom.
build.js        ← generator: templates + JSON-LD builders + post-processors → writes dist/
js/app.js       ← browser JS, interactions ONLY (no content injection): mobile nav, quote
                  modal, faceted product filters, product drawer, Lenis smooth scroll,
                  reveals, count-up stats, magnetic buttons, parallax
css/styles.css  ← full design system (CSS custom properties)
assets/         ← images (mostly WebP), logos/, certs/, team/, products/, industries/
dist/           ← generated output — COMMITTED to git and deployed. Never edit by hand.
docs/           ← project-log.md (day-wise log), kp-packaging-website-changes.md
                  (client-feedback checklist w/ pending items), aeo-geo-prompts.md
prompt.md       ← original site audit + rebuild brief
```

**Workflow for ANY change:** edit `js/data.js` (content) or `build.js` (templates) or `css/styles.css` → run `node build.js` → verify in `dist/` → `git add -A && git commit && git push origin main`.

## Build-time post-processors (in `pageShell()`, applied in order — don't fight them)
1. `stripDashesInText()` — removes hyphens/dashes from all visible text (between `>` and `<`), skipping script/style. Site-wide rule: **no em/en dashes or " - " in copy, ever** (owner requirement).
2. `applyHeadingTitleCase()` — Title Case for all h1–h4 (minor words the/of/for/us stay lowercase; acronyms FMCG/MG/CE preserved) + **strips trailing full stops from headings**.
3. `versionAssets()` — appends `?v=<md5-8>` content hash to every `/assets/*` URL. **Critical:** `/assets/*` is served with `Cache-Control: immutable, 1yr`; replacing an image under the same filename is fine because the hash changes automatically. Never remove this.

Write copy in sentence case with normal punctuation; the pipeline handles heading case/periods.

## Hard content rules (owner-mandated, do not regress)
- Brand is **"KP Packaging"** — never "K P Packaging Ltd." / "Limited"
- Spelling: **"inquiry"**, never "enquiry"
- Stats: **30+ years, 25+ countries, 500+ clients, 25+ grades** (prose: "around 500 clients across about 25 countries")
- Machines: **Korean + Chinese + American** — never "Korean" alone; spell **"United States of America"**, not "America"
- Section is **"Two verticals, one promise"** + tagline "Packaging you can rely on" (not "Two arms")
- Extrusion capability: "Poly **(LDPE)** coating on printed and unprinted paper, board and aluminium foil" (no PET/BOPP/fabric in the homepage bubble; About page keeps the full substrate list)
- Printing: "8-colour" in description only, not in the title
- Hero: "…engineered for **sealing**, barrier, strength and print"
- No eyebrow sub-labels above headings (all removed); headings have no trailing periods; box/card titles centered
- Form: minimal; only Name/Phone/Email required; quote modal defaults to Glassine Paper; has Coating (with PE/without PE) field; stiffener option displays "Stiffener Paper"
- Git commits: **no "Claude"/AI attribution anywhere** (no Co-Authored-By lines)

## Company facts (also in js/data.js)
- Corporate office: A to Z Industrial Estate, Western Wing, Office No **143**, Ganpat Rao Kadam Marg, Lower Parel, Mumbai 400013 · +91 85916 56966 · prem@kppackaging.com
- Plant: **792, Apple Insulated, Nr Crown Tapes, Vaibhav Laxmi, Silvassa, India 396193** · +91 85916 94328 · sales@kppackaging.com
- Leadership: Madhukant Vira (Chairman), Ketan Vira (CEO), Prem Vira (Director)
- Clients shown (color-coordinated marquee order): Cipla, Parksons, Reliance Polymers, Dr. Reddy's, Godrej, Wipro, Zydus, Amul, Intas, Dow Chemicals, Wockhardt
- Certs: ISO, AEO Indian Customs, Make in India, MSME, CE, IAF
- Infrastructure: 3 extrusion lamination machines (Korean/Chinese/American), 1 Indian 8-colour rotogravure, 3 Italian Bimec + 1 German + 2 Indian slitters, 1 Indian sheet-cutter
- Best-selling trio on homepage: 4-Ply, MG Poster, Glassine

## SEO / AEO / GEO layer (do not break)
- All content server-rendered in HTML (AI crawlers don't run JS)
- JSON-LD on every page (~150 blocks): Organization (+hasOfferCatalog, hasCredential), WebSite, WebPage w/ dateModified, Product ×16, FAQPage, LocalBusiness ×2, BreadcrumbList, ItemList, Person, Service
- `robots.txt` explicitly allows GPTBot/ClaudeBot/PerplexityBot/etc; `sitemap.xml`; `llms.txt` + `llms-full.txt` (auto-generated from data.js)
- `netlify.toml`: build config, www→apex 301s, **301 redirects from ALL old Webflow URLs** (e.g. /glassine-paper → /products/glassine-paper/) — preserves legacy SEO, never remove
- Meta titles ≤60 chars; descriptions ≤160; PNG OG image (1200×630, `assets/og-cover.png`); geo meta (IN-MH); security headers
- Forms wired to **Netlify Forms** (names: `contact`, `quote`; AJAX + honeypot). Owner must set notification emails in Netlify dashboard → Forms.

## Image pipeline
- Photos are WebP (PIL/Pillow available via `python3`, installed with `--break-system-packages`)
- AI images generated via Pollinations Flux URL API: `https://image.pollinations.ai/prompt/<urlencoded>?width=1280&height=800&model=flux&nologo=true&seed=N` — **rate limit: 1 request per IP at a time** (sequential, sleep 4s between; parallel = "Queue full" JSON error)
- Industry tiles display at **16:10** (`object-fit: cover`) — generate/crop images to 16:10 natively or they crop badly
- House style for generated images: "bright airy natural light, soft cream white background, premium editorial commercial photography, no text no watermark"
- ALWAYS visually verify downloaded/generated images before shipping (Read the file); reject watermarked/competitor-branded/dark images

## Verification habits (match previous quality bar)
- `node -c build.js && node build.js` after edits; grep `dist/` to confirm changes landed
- JSON-LD validity check: parse every `<script type="application/ld+json">` block across dist
- Filter/drawer logic testable headlessly with jsdom (`npm i jsdom --no-save`)
- NOTE: plain `grep` (ugrep) is flaky on this machine for some patterns — prefer `perl -ne 'print if /…/'`

## Automation
- Cloud routine "KP Packaging — daily project log (5 PM IST)" appends the day's commits to `docs/project-log.md` and pushes (id: trig_01MJWhWr8qN1uaEb7kTurUE7)

## Pending / blocked items (see docs/kp-packaging-website-changes.md for the full checklist)
- 🖼 Owner assets needed: 3 team photos (PaperX shoot), PaperX factory photo (crop left side, use in infrastructure), Borkar Packaging + DCPL logos (Borkar site returns 503), FSC + PaperX + Food Grade cert logos, replacement hero/facility photo
- 🖼 Network section: India domestic map + ~25-country export map (design/assets needed)
- Data to confirm from owner: exact founding year (currently "1990" estimate), social profile URLs for schema `sameAs` (currently empty), FAQ product terms "Bactite/Grid Lacquer" (mapped from garbled recording audio — confirm)
- AI tile images are v1 (Pollinations) — owner may want art-directed replacements (branded strips collage, Amul pack, ER-poster-style surgeon)
- Optional backlog: count-up/marquee etc. are done; remaining GEO work is OFF-site (Google Business Profile both locations, Search Console + Bing sitemap submission, directory/social profiles)
