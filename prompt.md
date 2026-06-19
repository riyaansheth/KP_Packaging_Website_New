# K P Packaging — Website Rebuild Brief & Prompt

> Source site audited: **https://kppackaging.com/** (Webflow-built, ~2021).
> Purpose of this document: a complete, build-ready brief to rebuild the site in a better way.
> Contains: (1) full content audit of the existing site, (2) rebuild blueprint — sitemap, IA, wireframes, standardized product schema, content fix-list.

---

# PART A — FULL AUDIT OF EXISTING SITE

## 1. Company Overview
- **Company:** K P Packaging Ltd. — 3-decade-old, generational family-owned primary packaging company.
- **Origin:** Pioneer in the PVC Leather Cloth industry; now focused on flexible packaging + coated papers.
- **Two business arms:**
  1. **Manufacturing** — Extrusion coated laminates / poly coating (PE) on printed & unprinted Paper / Board / PET / BOPP / Aluminium Foil / Fabric, plus Rotogravure printing.
  2. **Distribution** — Authorized distributor for multiple Indian paper mills.
- **Positioning themes:** "Pioneer in PVC Leather Cloth," "flexible packaging solutions," "leading poly coated Kraft Paper manufacturer."
- **Stated goal:** Take K P Packaging international (driven by Prem Vira).

## 2. Existing Site Structure (Sitemap)
| Page | URL |
|---|---|
| Home | `/` |
| About Us | `/about-us` |
| Products (collection) | `/collection` |
| Contact | (no dedicated page — links go to `/#` and trigger inquiry popup) |
| 15 product pages | (see §6) |

**Notes:** Built on **Webflow**. Leftover template placeholder metadata ("Client: Webflow / Year: 2021 / Service: Construction") appears on several product pages. "Contact" and "Request a Quote" point to `/#` (broken) and open a popup form instead.

## 3. Global Elements (every page)
**Top nav:** Logo · HOME · About Us · PRODUCTS · CONTACT · (Request a Quote button)

**Inquiry popup form** ("Send Inquiry" / "Send Message"): Name, Email Address, Phone, Message → Submit.

**Footer:**
- **Corporate Office:** A to Z Industrial Estate, Western Wing, Office No 138, Ganpat Rao Kadam Marg, Lower Parel – 400013 · ☎ +91 85916 56966 · ✉ prem@kppackaging.com
- **Manufacturing Plant:** No 7, 8 & 9, Sr No 245/3, Sankeshwar Industrial Estate, Behind Prince Pipe, Silvassa, Dadra and Nagar Haveli – 396230 · ☎ +91 85916 94328 · ✉ sales@kppackaging.com
- CTA: "Get in touch"

**Known bugs / template junk:**
- Placeholder email `contact@constructo.com` (About nav block).
- Stray `tel:3740213301` and `mailto:contact@constructo.com` on homepage.
- Malformed `tel:6:+918591694328`.
- "Webflow / Construction / 2021" placeholders on product pages.

## 4. Homepage Content
1. Nav + hero (pioneer in PVC Leather Cloth over 3 decades; now flexible packaging & coated papers).
2. Who We Are.
3. Areas of Expertise: Extrusion Coating & Lamination · Rotogravure Printing · Paper Distribution.
4. Featured products (6): Glassine, MG Poster, Chromo, Cupstock, 4 Ply, MG Kraft → "VIEW ALL PRODUCTS".
5. Accomplishments: 30+ years · 20+ countries · 425+ clients.
6. Partners/clients: Wockhardt, Cipla, Dr. Reddy's, Godrej, Wipro, Zydus, Amul, Parksons Packaging, Intas.
7. Footer + CTA.

⚠️ Homepage "4 Ply Paper" card links to `/3-ply-paper` (wrong target).

## 5. About Us Page Content
- **Hero "Who we are":** Promoted by **Mr. Ketan Vira**; son **Mr. Prem Vira** driving international expansion. Image: jumbo rolls.
- **Manufacturing arm:** Extrusion coated laminates, PE poly coating on Paper/Board/PET/BOPP/Al.Foil/Fabric; "State of the Art" Korean Extrusion Lamination & Coating plant, Rotogravure printing machine, multiple slitting & rewinding machines.
- **Distribution arm:** Authorized distributor for Indian paper mills — MG Poster, Maplitho, Cupstock, MG/MF Kraft, Grease Proof (OGR), Chromo (C1S & C2S), Glassine, OLB, Bible, Stiffener, Tissue, Duplex, Folding Box Board (FBB), Solid Bleached Sulphate (SBS), Backtite, LWC, Bleach Kraft, etc.
- **Accomplishments:** 30+ years · 20+ countries · 425+ clients ("veteran-owned full-service Primary Packing Company").
- **Areas of Expertise:** Converters of all paper, paperboard & flexible packaging films. Coat/laminate on Paper, Paperboards, Cupstock, Polyester film, BOPP film, Aluminium Foils, Fabrics. Products pack: medicines, gloves, yeast, sugar, salt, pepper, paper cups, boxes, tea. Aluminium foil (plain & printed) for Blister/Strip packaging, Condom Laminates, Surgical Suture Laminates, ORS Salts. Flexible packaging for chips, tea, coffee, salt, noodles, chocolates, detergents, soaps, oil, snacks.
- **Certifications carousel:** ISO 15001 (verify — likely 9001/14001), custom cert, Make in India, MSME, CE, IAF.
- **Team:** Madhukant Vira (Chairman), Ketan Vira (CEO), Prem Vira (Director) — each with IG/LinkedIn/Twitter/FB (likely dummy links).
- **Meta title:** "Expert Coated Paper Manufacturers and Exporters | K P Packaging"

## 6. Products / Collection Page
Heading "Our Products" — 15 cards:
1. Glassine Paper — `/glassine-paper`
2. MG Poster Paper — `/mg-poster-paper`
3. 4 Ply Paper (paper + PE + foil + PE) — `/4-ply-paper`
4. Cupstock Paper — `/cupstock-paper`
5. 3 Ply Paper (Paper + PE + Foil) — `/3-ply-paper`
6. MG Kraft Paper — `/mg-kraft`
7. Chromo Paper — `/chromo-paper`
8. Folding Box Board Paper — `/folding-box-board`
9. Non Tearable Paper — `/non-tearable-paper`
10. Polyethylene Coated Stiffener Paper — `/polyethylene-coated-stiffener-paper`
11. Greaseproof Paper — `/greaseproof-paper`
12. Duplex Board Paper — `/duplex-board`
13. Maplitho Paper — `/maplitho-paper`
14. Tissue Paper — `/tissue-paper`
15. Other Specialised Paper — `/other-specialised-paper`

**Meta title:** "Poly Coated Paper Manufacturers | Call KP Packaging"

## 7. Individual Product Pages — Full Detail

**1. Glassine Paper** — Smooth super-calendered glossy paper resistant to air, water, grease; pharma packaging. "Niche paper made by only one paper mill in India." Uses: ORS sachets, strip packing of tablets, primary medicine packaging (Saridon, Decdan, Practin). Variants: pure glassine, poly-coated, VMCH/HSL-coated, plain or printed reels. Certs: FSC, FDA.

**2. MG Poster Paper** (Machine Glazed / "Sandwich Paper") — Best-seller, primary packaging. LDPE coated; glossy, smooth, high tensile strength, stiff; affordable alternative to chromo. Uses: heat-sealable wrapping, pouches, carton inner lining, food/apparel/glass packaging, sugar & salt, band-aids, glove pouches. Variants: coated & uncoated.

**3. 4 Ply Paper** (Paper + PE + Foil + PE) — Extra polymer over 3-ply; pharma (tablet strips, ORS powders e.g. Electral), Pan Masala. Blocks moisture, preserves potency, temperature protection. Variants: Glassine / Chromo / Kraft 4 Ply.

**4. Cupstock Paper** — Food-safe, hot & cold; 2–3 plies. Uses: paper cups, noodle/soup bowls, food wrappers, grocery bags, tray mats, meal boxes, fast-food containers, dairy packaging. Coatings: PE (one/both sides), polylactic acid, water-based. Variants: bleached/unbleached, single/double-sided PE. Mentions Scott Bond.

**5. 3 Ply Paper** (Paper + Polymer + Aluminium Foil) — Sustainable, lightweight, durable, recyclable, leak-proof; thermal conductivity, grease resistance. Uses: foil bags, green tea sachets, meat packaging.

**6. MG Kraft Paper** — Machine-glazed coated kraft, high tensile strength, natural brown, high-gloss top, eco-friendly; optional polymer coating. Uses: food packaging, paper bags, envelopes, boxes. Quality by bursting factor (BF).

**7. Chromo Paper** (Poly Coated) — Water-resistant, durable; inorganic coating adds ink absorbency, gloss, smoothness; extrusion-coated polymers add strength. Uses: tobacco sachets, magazine paper, labels, green tea, gutka/pan masala.

**8. Folding Box Board (FBB)** — Mechanical pulp between chemical pulp; low-density, high stiffness; printable bleached surface, yellowish centre, bleached inner. Uses: health & beauty, frozen foods, confectionery, pharma, cigarettes. Recyclable, eco-friendly, good for foil stamping.

**9. Non Tearable Paper** — High-density spun-bound polyethylene fibres, fully synthetic; combines paper/film/fabric. Lightweight, breathable, water/tear resistant, bacterial barrier, gamma & ethylene-oxide sterilizable, 100% recyclable. Uses: medical/pharma packaging, protective apparel, construction protection, postal envelopes, lab sterilization. Can be coated, embossed, foil-stamped, laminated, perforated, stitched, welded, heat-sealed.

**10. Polyethylene Coated Stiffener Paper** — ⚠️ Page text mistakenly duplicates 3 Ply Paper copy. Needs rewriting. Stated: leak-proof, thermal protection, grease-resistant; uses: salt, pepper, tea, meat, tea preservation.

**11. Greaseproof Paper** (butter/bakery paper) — Non-stick, cellulose-based, heat resistant up to 220°C, breathable, food-safe, low water absorption. Uses: butter/margarine wrapping, food wrapping, lining cake tins/baking.

**12. Duplex Board Paper** (Grey Back / White Back) — Two-ply cardboard, shiny coat one side, great for printing; High/Low Weight Coating variants; water/moisture-resistant, anti-curl, rigid. Uses: packaging, food (food-grade), pharma. Recyclable.

**13. Maplitho Paper** — Eco-friendly, wood-free, "surface size-paper." Uses: computer stationery, bills/invoices/cashbooks, leaflets, calendars, writing pads, labels, Braille printing; laser/inkjet/photocopy compatible. Embossable both sides, multiple sizes, two shades.

**14. Tissue Paper** — Lightweight, recycled pulp; hygienic. Uses: facial tissues, napkins, towels, bathroom/toilet tissue, wrapping, cushioning fragile items, wound/glasses cleaning, infection control. Customizable branding. (Trivia: introduced 1920s; "200 tissues/person/year in Western Europe.")

**15. Other Specialised Paper** — Two products:
- **Bactite Paper** — Free from optical brighteners, heat-sealable, steam-sterilizable with colour indication, fluid-repellent, bacterial barrier; for medical gloves. High dry/wet strength, lint-free, tear-resistant, kraft & polymer reinforced.
- **Grid Lacquer Paper** — Medical-grade, extrusion-coated; for surgical gloves, syringes, catheters, needles. Self-sealing (no PE needed), high adhesive strength, superior printing surface.

---

# PART B — REBUILD BLUEPRINT

## 1. Proposed Sitemap
```
Home  /
├── About  /about
│     ├─ Our Story / History
│     ├─ Two Arms (Manufacturing + Distribution)
│     ├─ Infrastructure & Machinery
│     ├─ Certifications
│     └─ Leadership / Team
├── Products  /products            ← filterable catalogue
│     └─ /products/[slug]          ← 1 standardized template, 16 entries
│         (glassine, mg-poster, chromo, cupstock, mg-kraft,
│          3-ply, 4-ply, folding-box-board, duplex-board,
│          non-tearable, pe-coated-stiffener, greaseproof,
│          maplitho, tissue, bactite, grid-lacquer)
├── Industries  /industries        ← NEW
│     ├─ /industries/pharmaceutical
│     ├─ /industries/food-beverage
│     ├─ /industries/fmcg
│     └─ /industries/medical-surgical
├── Capabilities  /capabilities    ← NEW
│     ├─ Extrusion Coating & Lamination
│     ├─ Rotogravure Printing
│     ├─ Slitting & Rewinding
│     └─ Paper Distribution
├── Sustainability  /sustainability   ← NEW
├── Clients  /clients                 ← logos + testimonials/case studies
├── Contact  /contact                 ← REAL page (currently missing)
└── Quote  /quote  (or global modal)
```
Secondary/utility: Blog/Resources (optional), Careers (optional), Privacy Policy, 404, XML sitemap, robots.txt.

## 2. IA Decisions
| Decision | Current | Rebuild |
|---|---|---|
| Contact | Dead `/#` + popup only | Dedicated `/contact` + working modal |
| Products | Flat list of 15 | Filterable catalogue, 16 items (split "Other Specialised" into Bactite + Grid Lacquer) |
| Entry points | Product-only | Add Industries + Capabilities (navigate by need) |
| Specs | Inconsistent | One enforced product schema (§3) |
| Template junk | Webflow/Construction/2021 everywhere | Removed |

## 3. Standardized Product Data Schema
```yaml
product:
  slug:            string
  name:            string
  also_known_as:   [string]
  short_tagline:   string
  hero_image:      image
  gallery:         [image]
  description:     rich_text
  construction:    string            # "Paper + PE + Foil + PE"
  business_arm:    enum              # Manufactured | Distributed | Both
  applications:    [string]
  industries:      [ref→industry]
  key_properties:  [string]
  variants:        [string]
  coating_options: [string]
  specifications:
    gsm_range:        string
    coating_type:     string
    heat_resistance:  string
    finish:           string
    sizes_reels:      string
    other:            [key:value]
  certifications:  [enum]            # FSC, FDA, ISO, food-safe...
  printable:       boolean
  related_products: [ref→product]
  cta:             "Request a Quote" (prefills product name)
```

### Product page wireframe (single template)
```
HEADER (logo · nav · Request Quote)
Breadcrumb: Home / Products / {name}
[ Image gallery ] | [ name · also_known_as · tagline · Request Quote · arm badge · cert badges ]
Description (rich text)
Applications (icon list) | Key Properties
Specifications table (only filled rows)
Variants / Coating options
Industries served (linked chips)
Related products (3 cards)
CTA band: "Need this product? Get a quote"
FOOTER (both offices, contacts, nav)
```

## 4. Catalogue Filtering Model
- **By Industry:** Pharmaceutical · Food & Beverage · FMCG · Medical/Surgical · Printing & Stationery
- **By Construction:** Single-ply · 3-Ply · 4-Ply · Board
- **By Coating:** PE coated · Uncoated · Foil laminate · Specialty (VMCH/HSL)
- **By Function:** Grease-resistant · Heat-sealable · Moisture barrier · Sterilizable · Printable

**Catalogue mapping (16 products):**
| Product | Arm | Industry tags |
|---|---|---|
| Glassine | Distributed/Coated | Pharma |
| MG Poster | Manufactured | Food, FMCG |
| Chromo | Manufactured | FMCG, Tobacco |
| Cupstock | Both | Food & Bev |
| MG Kraft | Both | Food, FMCG |
| 3 Ply | Manufactured | Food, Tea |
| 4 Ply | Manufactured | Pharma |
| Folding Box Board | Distributed | Pharma, Food, FMCG |
| Duplex Board | Distributed | Packaging, Pharma, Food |
| Non Tearable | Distributed | Medical, Industrial |
| PE Coated Stiffener | Manufactured | Food |
| Greaseproof | Both | Food, Bakery |
| Maplitho | Distributed | Printing/Stationery |
| Tissue | Distributed | Hygiene/Consumer |
| Bactite | Manufactured | Medical/Surgical |
| Grid Lacquer | Manufactured | Medical/Surgical |

## 5. Page Wireframe Outlines

**Home `/`**
1. Hero (value prop, jumbo rolls bg, dual CTA: Explore Products + Request a Quote)
2. Trust bar (30+ years · 20+ countries · 425+ clients · certs)
3. What we do (4 capability cards)
4. Shop by Industry (4 tiles)
5. Featured products (6 → View all)
6. Why K P Packaging (Korean plant, two arms, QC)
7. Certifications strip
8. Client logos (Wockhardt, Cipla, Dr. Reddy's, Godrej, Wipro, Zydus, Amul, Parksons, Intas)
9. CTA band → Quote
10. Footer

**About `/about`** — Story (Vira family) → Two arms → Infrastructure/machinery → Certifications → Leadership (Madhukant=Chairman, Ketan=CEO, Prem=Director) → CTA.

**Industries `/industries/[x]`** — Intro → pain points → relevant products (by tag) → relevant certs → case examples → CTA.

**Capabilities `/capabilities`** — Per capability: description, machinery, substrates (Paper/Board/PET/BOPP/Al Foil/Fabric), output examples, photos.

**Contact `/contact`** — Two office cards (Mumbai corporate + Silvassa plant) with correct phones/emails, map(s), enquiry form, business hours, export note.

**Quote modal/page** — Name · Company · Email · Phone · Country · Product of interest (prefilled) · Quantity · Message → real submission + success state.

## 6. Content Fix-List (carry into rebuild)
**Critical:**
1. Build a real Contact page; remove all `/#` dead links.
2. Delete placeholder `contact@constructo.com`; use prem@ / sales@kppackaging.com.
3. Fix malformed phone links (`tel:3740213301`, `tel:6:+918591694328`).
4. Fix homepage "4 Ply Paper" linking to `/3-ply-paper`.
5. Rewrite PE Coated Stiffener page (currently duplicates 3 Ply copy).
6. Remove "Client: Webflow / Year: 2021 / Service: Construction" placeholders.

**Quality:**
7. Write unique, complete copy for every product to fill the §3 schema.
8. Verify or remove dummy team social links.
9. Standardize meta titles/descriptions.
10. Confirm correct cert name (site shows "ISO 15001" — likely ISO 9001/14001).

**Enhancements:**
11. Downloadable spec sheets / brochure PDFs per product.
12. Sustainability page.
13. Clients/testimonials page.
14. Export / "International Enquiries" emphasis (20+ countries; international growth is a stated goal).

## 7. Suggested Build Stack
- **CMS-driven** so 16 products + industries are editable without code (the §3 schema becomes a CMS collection). Options: Webflow CMS (familiar) or Next.js + headless CMS (Sanity/Payload) for better SEO/performance/control.
- **Forms:** real backend (email + CRM/lead capture).
- **SEO:** per-page meta, schema.org Product + Organization markup, XML sitemap.

---

# PART C — KEY REFERENCE DATA

**Corporate Office:** A to Z Industrial Estate, Western Wing, Office No 138, Ganpat Rao Kadam Marg, Lower Parel, Mumbai – 400013 · +91 85916 56966 · prem@kppackaging.com
**Manufacturing Plant:** No 7, 8 & 9, Sr No 245/3, Sankeshwar Industrial Estate, Behind Prince Pipe, Silvassa, Dadra and Nagar Haveli – 396230 · +91 85916 94328 · sales@kppackaging.com
**Leadership:** Madhukant Vira (Chairman) · Ketan Vira (CEO) · Prem Vira (Director)
**Stats:** 30+ years · 20+ countries · 425+ clients
**Clients:** Wockhardt, Cipla, Dr. Reddy's, Godrej, Wipro, Zydus, Amul, Parksons Packaging, Intas
**Certs (verify):** ISO (15001?), Make in India, MSME, CE, IAF, FSC, FDA
