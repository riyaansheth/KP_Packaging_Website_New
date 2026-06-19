#!/usr/bin/env node
/* ===========================================================
   K P Packaging, static site generator (GEO/AEO optimized)
   Reads js/data.js and emits a fully crawlable site into dist/.
   Run:  node build.js
   =========================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const { COMPANY, CAPABILITIES, INDUSTRIES, PRODUCTS, FILTERS } = require("./js/data.js");

const ROOT = __dirname;
const OUT = path.join(ROOT, "dist");
const BASE = COMPANY.url.replace(/\/$/, "");
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const BUILD_VER = Date.now().toString(36); // cache-bust assets each build

/* ---------- helpers ---------- */
const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");
const productBySlug = (slug) => PRODUCTS.find((p) => p.slug === slug);
const industryBySlug = (slug) => INDUSTRIES.find((i) => i.slug === slug);
const productUrl = (p) => `/products/${p.slug}/`;
const industryUrl = (i) => `/industries/${i.slug}/`;
const titleCase = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function writePage(relDir, html) {
  const dir = path.join(OUT, relDir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}
function writeFile(rel, content) {
  const full = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

/* ---------- icons ---------- */
const ICON = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  scissors: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>'
};
const CHECK = ICON.check;

/* ===========================================================
   STRUCTURED DATA (JSON-LD)
   =========================================================== */
const ORG_ID = BASE + "/#organization";
const SITE_ID = BASE + "/#website";

function postalAddress(o) {
  return { "@type": "PostalAddress", streetAddress: o.street, addressLocality: o.locality, addressRegion: o.region, postalCode: o.postal, addressCountry: o.country };
}
function orgLd() {
  return {
    "@context": "https://schema.org", "@type": "Organization", "@id": ORG_ID,
    name: COMPANY.legal, alternateName: COMPANY.name, url: BASE + "/",
    logo: BASE + COMPANY.logo, image: BASE + COMPANY.ogImage,
    description: COMPANY.summary, foundingDate: COMPANY.founded,
    slogan: COMPANY.tagline,
    sameAs: COMPANY.sameAs && COMPANY.sameAs.length ? COMPANY.sameAs : undefined,
    knowsAbout: ["Coated paper", "Flexible packaging", "Extrusion coating & lamination", "Rotogravure printing", "Pharmaceutical packaging", "Food packaging"],
    areaServed: { "@type": "Place", name: "Worldwide (20+ countries)" },
    contactPoint: COMPANY.offices.map((o) => ({
      "@type": "ContactPoint", contactType: "sales", telephone: o.phoneRaw, email: o.email, areaServed: "Worldwide", availableLanguage: ["en"]
    })),
    location: COMPANY.offices.map((o) => ({ "@type": "Place", name: COMPANY.name + ", " + o.tag, address: postalAddress(o) }))
  };
}
function websiteLd() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": SITE_ID, url: BASE + "/", name: COMPANY.name, publisher: { "@id": ORG_ID }, inLanguage: "en" };
}
function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: BASE + it.path }))
  };
}
function faqLd(faqs) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
  };
}
function productLd(p, url) {
  const props = Object.entries(p.specs || {}).map(([k, v]) => ({ "@type": "PropertyValue", name: titleCase(k), value: String(v) }));
  return {
    "@context": "https://schema.org", "@type": "Product",
    name: p.name, alternateName: p.aka, description: p.desc,
    category: "Coated paper / Packaging material",
    image: BASE + (p.image || COMPANY.ogImage), url: BASE + url,
    brand: { "@type": "Brand", name: COMPANY.name },
    manufacturer: { "@id": ORG_ID },
    material: p.construction || undefined,
    additionalProperty: props.length ? props : undefined,
    isRelatedTo: p.applications.slice(0, 6).map((a) => ({ "@type": "Thing", name: a }))
  };
}
function itemListLd(list) {
  return {
    "@context": "https://schema.org", "@type": "ItemList", name: "K P Packaging Products",
    itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: BASE + productUrl(p) }))
  };
}
function localBusinessLd(o) {
  return {
    "@context": "https://schema.org", "@type": ["LocalBusiness", "Manufacturer"],
    "@id": BASE + "/contact/#" + o.locality.toLowerCase(),
    name: COMPANY.name + ", " + o.tag, image: BASE + COMPANY.ogImage, url: BASE + "/contact/",
    telephone: o.phoneRaw, email: o.email, address: postalAddress(o),
    parentOrganization: { "@id": ORG_ID }, areaServed: "Worldwide", priceRange: "$$"
  };
}
function personLd(m) {
  return { "@context": "https://schema.org", "@type": "Person", name: m.name, jobTitle: m.role, worksFor: { "@id": ORG_ID } };
}
function serviceLd(i) {
  return {
    "@context": "https://schema.org", "@type": "Service",
    name: i.name + " Packaging", serviceType: i.name + " packaging materials",
    description: i.detail, provider: { "@id": ORG_ID }, areaServed: "Worldwide"
  };
}

/* ---------- generated FAQs (accurate, from data) ---------- */
function productFaqs(p) {
  const apps = p.applications.map((a) => a.toLowerCase());
  const out = [
    { q: `What is ${p.name} used for?`, a: `${p.name} is used for ${apps.slice(0, 5).join(", ")}.` },
    { q: `Does K P Packaging manufacture or distribute ${p.name}?`, a: p.arm === "Distributed" ? `K P Packaging is an authorized distributor of ${p.name}, sourced from leading Indian paper mills.` : p.arm === "Both" ? `K P Packaging both manufactures and distributes ${p.name}.` : `K P Packaging manufactures ${p.name} in-house at its Silvassa plant using extrusion coating and lamination.` }
  ];
  if (p.certs && p.certs.length) out.push({ q: `Is ${p.name} certified?`, a: `Yes, ${p.name} is ${p.certs.join(", ")}.` });
  out.push({ q: `What are the key features of ${p.name}?`, a: `${p.properties.slice(0, 4).join("; ")}.` });
  return out;
}
function industryFaqs(i) {
  const prods = i.products.map(productBySlug).filter(Boolean);
  return [
    { q: `Who is a good ${i.name.toLowerCase()} packaging supplier in India?`, a: `K P Packaging is a Mumbai-based manufacturer and distributor supplying ${i.name.toLowerCase()} packaging, including ${prods.map((p) => p.name).slice(0, 4).join(", ")}, to clients across 20+ countries.` },
    { q: `What packaging materials does the ${i.name.toLowerCase()} industry use?`, a: `${i.detail}` },
    { q: `Can K P Packaging supply ${i.name.toLowerCase()} packaging for export?`, a: `Yes. K P Packaging serves 425+ clients across more than 20 countries, including ${i.name.toLowerCase()} customers.` }
  ];
}

/* ===========================================================
   LAYOUT: head / header / footer / modal
   =========================================================== */
function head(meta) {
  const url = BASE + meta.path;
  const ld = (meta.jsonld || []).filter(Boolean).map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n  ");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${esc(meta.title)}</title>
  <meta name="description" content="${escAttr(meta.desc)}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="theme-color" content="#2E2C7E">
  <meta name="author" content="${escAttr(COMPANY.legal)}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:site_name" content="${escAttr(COMPANY.name)}">
  <meta property="og:title" content="${escAttr(meta.title)}">
  <meta property="og:description" content="${escAttr(meta.desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${BASE + COMPANY.ogImage}">
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(meta.title)}">
  <meta name="twitter:description" content="${escAttr(meta.desc)}">
  <meta name="twitter:image" content="${BASE + COMPANY.ogImage}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="K P Packaging">
  <meta name="format-detection" content="telephone=no">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css?v=${BUILD_VER}">
  ${ld}
</head>
<body data-page="${meta.page || ""}">`;
}

function header(active) {
  const links = [["/", "Home", "home"], ["/about/", "About", "about"], ["/products/", "Products", "products"], ["/industries/", "Industries", "industries"], ["/contact/", "Contact", "contact"]];
  const nav = links.map(([href, label, key]) => `<a href="${href}"${key === active ? ' class="active"' : ""}>${label}</a>`).join("\n        ");
  return `
  <header class="site-header">
    <div class="container nav">
      <a href="/" class="brand" aria-label="K P Packaging Ltd. home">
        <img src="/assets/kp-logo.png" alt="K P Packaging Ltd." class="brand-logo" width="224" height="122">
      </a>
      <nav class="nav-links" aria-label="Primary">
        ${nav}
        <button class="btn btn--primary" data-quote>Request a Quote</button>
      </nav>
      <div class="nav-cta">
        <button class="btn btn--primary" data-quote>Request a Quote</button>
        <button class="nav-toggle" aria-label="Toggle menu" data-toggle>${ICON.menu}</button>
      </div>
    </div>
  </header>`;
}

function footer() {
  const o = COMPANY.offices;
  const prodLinks = PRODUCTS.slice(0, 3).map((p) => `<a href="${productUrl(p)}">${esc(p.name)}</a>`).join("\n          ");
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="/" class="brand"><span class="mark">KP</span><span>K P Packaging</span></a>
          <p>A three-decade-old family business converting and distributing coated papers and flexible packaging for pharma, food and FMCG, in India and 20+ countries.</p>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <a href="/about/">About Us</a>
          <a href="/products/">Products</a>
          <a href="/industries/">Industries</a>
          <a href="/contact/">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Products</h4>
          ${prodLinks}
          <a href="/products/">View all &rsaquo;</a>
        </div>
        <div class="footer-col">
          <h4>Get in touch</h4>
          <p class="muted">${o[0].tag}</p>
          <a href="tel:${o[0].phoneRaw}">${o[0].phone}</a>
          <a href="mailto:${o[0].email}">${o[0].email}</a>
          <p class="muted" style="margin-top:.6rem">${o[1].tag}</p>
          <a href="tel:${o[1].phoneRaw}">${o[1].phone}</a>
          <a href="mailto:${o[1].email}">${o[1].email}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${esc(COMPANY.legal)} All rights reserved.</span>
        <span>Mumbai · Silvassa · India</span>
      </div>
    </div>
  </footer>`;
}

function quoteModal() {
  const opts = PRODUCTS.map((p) => `<option value="${escAttr(p.name)}">${esc(p.name)}</option>`).join("");
  return `
  <div class="modal-overlay" id="quote-modal">
    <div class="modal" role="dialog" aria-modal="true" aria-label="Request a quote" data-lenis-prevent>
      <div class="modal-head">
        <div><h3>Request a Quote</h3><p>Tell us what you need, our team replies within one business day.</p></div>
        <button class="modal-close" data-close aria-label="Close">${ICON.close}</button>
      </div>
      <div class="modal-body">
        <form data-form>
          <div class="field-row">
            <div class="field"><label>Name</label><input name="name" required placeholder="Your name"></div>
            <div class="field"><label>Company</label><input name="company" placeholder="Company name"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Email</label><input type="email" name="email" required placeholder="you@company.com"></div>
            <div class="field"><label>Phone</label><input name="phone" placeholder="+91 ..."></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Product of interest</label>
              <select name="product" id="modal-product"><option value="">General enquiry</option>${opts}</select>
            </div>
            <div class="field"><label>Country</label><input name="country" placeholder="Country"></div>
          </div>
          <div class="field"><label>Message</label><textarea name="message" placeholder="Quantity, specifications, timeline..."></textarea></div>
          <button type="submit" class="btn btn--primary btn--lg" style="width:100%;justify-content:center">Send Inquiry ${ICON.arrow}</button>
          <p class="form-note">By submitting you agree to be contacted about your enquiry.</p>
        </form>
        <div class="form-success" data-success>✓ Thank you, your inquiry has been received. We'll be in touch shortly.</div>
      </div>
    </div>
  </div>`;
}

// Remove hyphens/dashes from VISIBLE text only (between > and <), leaving tags,
// attributes, URLs, class names and JSON-LD/script blocks untouched.
function stripDashesInText(html) {
  const blocks = [];
  html = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (m) => {
    blocks.push(m);
    return ` ${blocks.length - 1} `;
  });
  html = html.replace(/>([^<]+)</g, (m, txt) => ">" + txt.replace(/[-‐-―]/g, " ").replace(/ {2,}/g, " ") + "<");
  html = html.replace(/ (\d+) /g, (m, i) => blocks[+i]);
  return html;
}

function pageShell(meta, body) {
  return stripDashesInText(head(meta) + header(meta.page) + body + footer() + quoteModal() + `
  <script src="/js/lenis.min.js?v=${BUILD_VER}" defer></script>
  <script src="/js/app.js?v=${BUILD_VER}" defer></script>
</body>
</html>`);
}

/* ---------- shared components ---------- */
function productCard(p) {
  const inds = p.industries.map((s) => (industryBySlug(s) || {}).name).filter(Boolean).slice(0, 2);
  const data = `data-industry="${p.industries.join(" ")}" data-construction="${p.cats.construction}" data-coating="${p.cats.coating}" data-fn="${p.cats.fn.join(" ")}"`;
  const media = p.image
    ? `<div class="pcard-media has-img"><img src="${p.image}" alt="${escAttr(p.name)}, ${escAttr(p.aka)}" loading="lazy" decoding="async"></div>`
    : `<div class="pcard-media ${p.art} roll-art"></div>`;
  return `
      <a class="pcard reveal" href="${productUrl(p)}" data-slug="${p.slug}" ${data}>
        ${media}
        <div class="pcard-body">
          <h3>${esc(p.name)}</h3>
          <div class="aka">${esc(p.aka)}</div>
          <p>${esc(p.tagline)}</p>
          <span class="link-arrow">View product ${ICON.arrow}</span>
        </div>
      </a>`;
}
function faqSection(faqs, heading) {
  return `
  <section class="section${heading.bg ? " bg-cream2" : ""}">
    <div class="container">
      <div class="section-head reveal center"><span class="eyebrow">FAQ</span><h2 style="margin-top:1rem">${esc(heading.title)}</h2></div>
      <div class="faq" style="max-width:780px;margin-inline:auto">
        ${faqs.map((f) => `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-a">${esc(f.a)}</div></details>`).join("\n        ")}
      </div>
    </div>
  </section>`;
}
function ctaBand(title, text) {
  return `
  <section class="section">
    <div class="container">
      <div class="cta-band">
        <h2>${esc(title)}</h2>
        <p>${esc(text)}</p>
        <div class="btn-row">
          <button class="btn btn--light btn--lg" data-quote>Request a Quote</button>
          <a href="/contact/" class="btn btn--ghost btn--lg" style="color:#fff;border-color:rgba(255,255,255,.4)">Contact us</a>
        </div>
      </div>
    </div>
  </section>`;
}
function capCards(detailed) {
  return CAPABILITIES.map((c) => `
      <div class="fcard reveal">
        <div class="ic">${ICON[c.icon] || ICON.layers}</div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(detailed ? c.detail : c.blurb)}</p>
      </div>`).join("");
}
function statStrip() {
  return COMPANY.stats.map((s) => `<div class="s"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("");
}

/* ===========================================================
   PAGE BODIES
   =========================================================== */
function homeBody() {
  const clients = COMPANY.clients.map((c) => `<span class="tb-logo"><img src="${c.logo}" alt="${escAttr(c.name)} logo" loading="lazy" decoding="async"></span>`).join("");
  const industries = INDUSTRIES.map((i) => `
        <a class="industry-card reveal" href="${industryUrl(i)}">
          <div class="ic-media${i.image ? "" : " " + i.art + " roll-art"}">${i.image ? `<img src="${i.image}" alt="${escAttr(i.name)} packaging" loading="lazy">` : ""}</div>
          <div class="ic-body"><h3>${esc(i.name)}</h3><p>${esc(i.blurb)}</p></div>
        </a>`).join("");
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 3).map(productCard).join("");
  const why = COMPANY.why.map((w) => `
        <div class="fcard reveal"><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></div>`).join("");
  return `
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-copy reveal in">
        <span class="eyebrow">Coated Paper · Flexible Packaging · Since ${esc(COMPANY.founded)}</span>
        <h1 style="margin-top:1.2rem">Packaging that <em>protects</em> what matters.</h1>
        <p class="lead">A three-decade family business converting and distributing coated papers and flexible laminates for pharmaceuticals, food and FMCG, engineered for barrier, strength and print.</p>
        <div class="hero-actions">
          <a href="/products/" class="btn btn--primary btn--lg">Explore Products</a>
          <button class="btn btn--ghost btn--lg" data-quote>Request a Quote</button>
        </div>
        <div class="hero-stats">
          <div class="stat"><strong>30+</strong><span>Years of expertise</span></div>
          <div class="stat"><strong>20+</strong><span>Countries served</span></div>
          <div class="stat"><strong>425+</strong><span>Clients worldwide</span></div>
        </div>
      </div>
      <div class="hero-visual reveal in" data-tilt>
        <img class="hero-img" src="/assets/hero.jpg" alt="Jumbo paper roll on the extrusion coating and lamination line at K P Packaging's plant" fetchpriority="high" width="2560" height="1709">
      </div>
    </div>
  </section>

  <section class="trustbar">
    <div class="container">
      <span class="tb-label">Trusted by leading brands</span>
      <div class="marquee">
        <div class="marquee-track">
          <div class="marquee-set">${clients}</div>
          <div class="marquee-set" aria-hidden="true">${clients}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section--tight">
    <div class="container overview-split">
      <div class="overview-head reveal reveal--left">
        <span class="eyebrow">Company overview</span>
        <h2 style="margin-top:1rem">Coated paper &amp; flexible packaging, made in India.</h2>
        <p class="lead" style="margin-top:1.3rem">${esc(COMPANY.summary)}</p>
      </div>
      <div class="overview-body reveal reveal--right">
        <div class="overview-facts">
          <div class="fact"><strong>Two arms</strong><span>In-house manufacturing + authorized mill distribution</span></div>
          <div class="fact"><strong>16 grades</strong><span>Coated papers, boards &amp; foil laminates</span></div>
          <div class="fact"><strong>Korean line</strong><span>State-of-the-art extrusion coating &amp; lamination</span></div>
          <div class="fact"><strong>Certified</strong><span>FSC, FDA &amp; ISO-aligned quality</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal center"><span class="eyebrow">What we do</span><h2 style="margin-top:1rem">Two arms, one promise: dependable packaging.</h2><p>We manufacture extrusion-coated laminates and distribute a broad range of mill-grade papers, so you can source coating, printing and substrate from a single partner.</p></div>
      <div class="grid grid-4">${capCards(false)}</div>
    </div>
  </section>

  <section class="section bg-cream2">
    <div class="container">
      <div class="section-head reveal center"><span class="eyebrow">Shop by industry</span><h2 style="margin-top:1rem">Solutions for the sectors we serve.</h2><p>From moisture barriers for medicine to food-safe cupstock, find the right material by where it's used.</p></div>
      <div class="grid grid-4">${industries}</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal center"><span class="eyebrow">Our products</span><h2 style="margin-top:1rem">Coated papers, boards & laminates.</h2><p>A snapshot of our best-selling grades, explore the full catalogue for specs and applications.</p></div>
      <div class="grid grid-3">${featured}</div>
      <div class="center" style="margin-top:1.4rem"><a href="/products/" class="btn btn--primary btn--lg">View all products</a></div>
    </div>
  </section>

  <section class="section hide-mobile">
    <div class="container">
      <div class="section-head reveal center"><span class="eyebrow">Why K P Packaging</span><h2 style="margin-top:1rem">Why companies choose us.</h2></div>
      <div class="grid grid-3">${why}</div>
    </div>
  </section>

  <section class="section--tight">
    <div class="container"><div class="section-head reveal center"><span class="eyebrow">Certified & compliant</span></div><div class="cert-logos">${COMPANY.certs.map((c) => `<div class="cert-logo"><img src="${c.logo}" alt="${escAttr(c.name)} certification" loading="lazy"></div>`).join("")}</div></div>
  </section>

  ${faqSection(COMPANY.faq, { title: "Frequently asked questions", bg: true })}

  ${ctaBand("Let's create your perfect pack.", "Tell us your substrate, barrier and print needs, we'll recommend the right grade and get you a quote within a business day.")}`;
}

function aboutBody() {
  const team = COMPANY.team.map((m) => `
        <div class="team-card reveal"><div class="avatar"><img src="${m.photo}" alt="${escAttr(m.name)}, ${escAttr(m.role)}" loading="lazy"></div><h3>${esc(m.name)}</h3><div class="role">${esc(m.role)}</div></div>`).join("");
  return `
  <section class="page-hero">
    <div class="container page-hero-split">
      <div class="page-hero-copy">
        <span class="eyebrow">Who we are</span>
        <h1>Three decades of packaging, run by one family.</h1>
        <p>From pioneers in the PVC leather cloth industry to a modern coated-paper and flexible-packaging house, K P Packaging has grown across generations while keeping quality and relationships at its core.</p>
      </div>
      <div class="page-hero-media"><img src="/assets/about-hero.jpg" alt="Wrapped paper jumbo rolls at K P Packaging" loading="lazy" width="1100" height="884"></div>
    </div>
  </section>

  <section class="section--tight">
    <div class="container">
      <div class="split reveal">
        <div class="split-media"><img src="/assets/our-story.jpg" alt="Paper-making machine reflecting K P Packaging's decades of converting heritage" loading="lazy"></div>
        <div class="split-body">
          <span class="eyebrow">Our story</span>
          <h2 style="margin-top:1rem">A generational business</h2>
          <p>With over three decades of history, K P Packaging is a generational family business. The company is promoted by <strong>Mr. Ketan Vira</strong>, who, with rich experience in the packaging industry, has grown the business exponentially. Alongside him, his son <strong>Mr. Prem Vira</strong> has taken it upon himself to take K P Packaging international.</p>
          <p>Today we operate across two complementary arms: in-house manufacturing of extrusion-coated laminates, and authorized distribution for leading Indian paper mills.</p>
          <p>From our state-of-the-art coating and lamination plant in Silvassa to a distribution network spanning India's leading paper mills, we supply pharmaceutical, food, FMCG and medical customers in over 20 countries, the same care across every grade we make and move.</p>
          <p>What hasn't changed in three decades is how we work: dependable quality, honest pricing, and long-term relationships with the people we package for.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section bg-cream2">
    <div class="container">
      <div class="grid grid-2">
        <div class="fcard reveal"><h3>Manufacturing</h3><p>We manufacture extrusion-coated laminates, poly-coating (PE) on printed and unprinted Paper, Board, PET, BOPP, Aluminium Foil, Fabric and other substrates. Our "State of the Art" extrusion lamination and coating plant is imported from Korea, supported by a rotogravure printing machine and multiple slitting and rewinding machines.</p></div>
        <div class="fcard reveal"><h3>Distribution</h3><p>We are authorized distributors for multiple Indian paper mills, supplying MG Poster, Maplitho, Cupstock, MG/MF Kraft, Greaseproof (OGR), Chromo (C1S &amp; C2S), Glassine, OLB, Bible, Stiffener, Tissue, Duplex, Folding Box Board (FBB), Solid Bleached Sulphate (SBS), Backtite, LWC, Bleach Kraft and more.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal center"><span class="eyebrow">Areas of expertise</span><h2 style="margin-top:1rem">Converters of paper, board & flexible films.</h2><p>We coat and laminate on various grades of paper, paperboard, cupstock, polyester film, BOPP film, aluminium foils and fabrics. Our products pack medicines, gloves, yeast, sugar, salt, pepper, paper cups, boxes and tea. Our aluminium foil, plain and printed, pairs with rigid and flexible PVC films for blister & strip packing, condom laminates, surgical suture laminates and ORS salts. We also produce a full range of flexible packaging for chips, tea, coffee, salt, noodles, chocolates, detergents, soaps, oils and snacks.</p></div>
      <div class="grid grid-4">${capCards(false)}</div>
    </div>
  </section>

  <section class="section--tight">
    <div class="container"><div class="section-head reveal center"><span class="eyebrow">We are certified with</span></div><div class="cert-logos">${COMPANY.certs.map((c) => `<div class="cert-logo"><img src="${c.logo}" alt="${escAttr(c.name)} certification" loading="lazy"></div>`).join("")}</div></div>
  </section>

  <section class="section bg-cream2">
    <div class="container">
      <div class="section-head reveal center"><span class="eyebrow">Leadership</span><h2 style="margin-top:1rem">Meet the team</h2></div>
      <div class="grid grid-3">${team}</div>
    </div>
  </section>`;
}

function drawerContent(p) {
  const inds = p.industries.map(industryBySlug).filter(Boolean);
  const specRows = Object.entries(p.specs || {}).map(([k, v]) => `<tr><td>${esc(titleCase(k))}</td><td>${esc(v)}</td></tr>`).join("");
  const media = p.image
    ? `<div class="drawer-media"><img src="${p.image}" alt="${escAttr(p.name)}, ${escAttr(p.aka)}" loading="lazy"></div>`
    : `<div class="drawer-media ${p.art} roll-art"></div>`;
  return `<div class="drawer-inner">
    <button class="drawer-close" data-drawer-close aria-label="Close details">${ICON.close}</button>
    ${media}
    <div class="drawer-body">
      <h3>${esc(p.name)}</h3>
      <div class="aka">${esc(p.aka)}</div>
      <p class="desc">${esc(p.desc)}</p>
      <h4>Applications</h4>
      <ul class="checklist">${p.applications.map((a) => `<li>${CHECK}<span>${esc(a)}</span></li>`).join("")}</ul>
      <h4>Key properties</h4>
      <ul class="checklist">${p.properties.map((a) => `<li>${CHECK}<span>${esc(a)}</span></li>`).join("")}</ul>
      ${specRows ? `<h4>Specifications</h4><table class="spec-table">${specRows}</table>` : ""}
      ${(p.variants && p.variants.length) ? `<h4>Variants &amp; coatings</h4><div class="taglist">${[...p.variants, ...p.coatings].filter((v) => v && v !== "-").map((v) => `<span class="chip chip--kraft">${esc(v)}</span>`).join("")}</div>` : ""}
      <div class="drawer-actions">
        <button class="btn btn--primary" data-quote data-product="${escAttr(p.name)}">Request a Quote ${ICON.arrow}</button>
        <a class="btn btn--ghost" href="${productUrl(p)}">Open full page ${ICON.arrow}</a>
      </div>
    </div>
  </div>`;
}

function productsBody() {
  const groupTitles = { industry: "Industry", construction: "Construction", coating: "Coating", fn: "Function" };
  const filters = Object.keys(FILTERS).map((g) => `
        <div class="filter-group" data-group="${g}">
          <h4>${groupTitles[g]}</h4>
          <button class="filter-btn active" data-key="">All</button>
          ${FILTERS[g].map((f) => `<button class="filter-btn" data-key="${f.key}">${esc(f.label)}</button>`).join("\n          ")}
        </div>`).join("");
  const cards = PRODUCTS.map(productCard).join("");
  const templates = PRODUCTS.map((p) => `<template id="pd-${p.slug}">${drawerContent(p)}</template>`).join("");
  return `
  <section class="page-hero">
    <div class="container">
      <span class="eyebrow">Our products</span>
      <h1>Coated papers, boards & laminates.</h1>
      <p>Sixteen grades engineered for barrier, strength and print, from pharmaceutical glassine to food-safe cupstock. Click any product for instant details, or filter to find your match.</p>
    </div>
  </section>

  <section class="section--tight">
    <div class="container">
      <div class="filters-mobile"><button class="btn btn--ghost" id="filter-toggle">Filters</button></div>
      <div class="catalog-wrap" id="catalog-wrap">
        <div class="catalog">
          <aside class="filters" id="filters">${filters}</aside>
          <div>
            <div class="catalog-count" id="catalog-count">${PRODUCTS.length} products</div>
            <div class="grid grid-3" id="catalog-grid">${cards}</div>
          </div>
        </div>
        <aside class="product-drawer" id="product-drawer" aria-hidden="true" aria-label="Product details" data-lenis-prevent></aside>
      </div>
    </div>
  </section>

  <div class="drawer-backdrop" data-drawer-close hidden></div>
  <div id="drawer-templates" hidden>${templates}</div>

  `;
}

function productBody(p) {
  const inds = p.industries.map(industryBySlug).filter(Boolean);
  let related = PRODUCTS.filter((x) => x.slug !== p.slug && x.industries.some((i) => p.industries.includes(i))).slice(0, 3);
  if (!related.length) related = PRODUCTS.filter((x) => x.slug !== p.slug).slice(0, 3);
  const specRows = Object.entries(p.specs || {}).map(([k, v]) => `<tr><td>${esc(titleCase(k))}</td><td>${esc(v)}</td></tr>`).join("");
  const faqs = productFaqs(p);
  return `
  <main id="product-detail">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/products/">Products</a> / <span>${esc(p.name)}</span></nav>
      <div class="pdetail">
        <div class="pdetail-media">
          ${p.image
      ? `<div class="pdetail-hero has-img"><img src="${p.image}" alt="${escAttr(p.name)}, ${escAttr(p.aka)}"></div>`
      : `<div class="pdetail-hero ${p.art} roll-art"></div>
          <div class="pdetail-thumbs"><div class="th ${p.art} roll-art"></div><div class="th roll-art"></div><div class="th roll-art--kraft"></div></div>`}
        </div>
        <div class="pdetail-info">
          <h1>${esc(p.name)}</h1>
          <div class="aka">${esc(p.aka)}</div>
          <p class="desc">${esc(p.desc)}</p>
          <div class="pdetail-actions">
            <button class="btn btn--primary btn--lg" data-quote data-product="${escAttr(p.name)}">Request a Quote ${ICON.arrow}</button>
            <a class="btn btn--ghost btn--lg" href="/contact/">Talk to our team</a>
          </div>
          <div class="spec-block">
            <div class="two-col">
              <div><h3>Applications</h3><ul class="checklist">${p.applications.map((a) => `<li>${CHECK}<span>${esc(a)}</span></li>`).join("")}</ul></div>
              <div><h3>Key Properties</h3><ul class="checklist">${p.properties.map((a) => `<li>${CHECK}<span>${esc(a)}</span></li>`).join("")}</ul></div>
            </div>
          </div>
          ${specRows ? `<div class="spec-block"><h3>Specifications</h3><table class="spec-table">${specRows}</table></div>` : ""}
          ${(p.variants && p.variants.length) ? `<div class="spec-block"><h3>Variants &amp; Coatings</h3><div class="taglist">${[...p.variants, ...p.coatings].filter((v) => v && v !== ", ").map((v) => `<span class="chip chip--kraft">${esc(v)}</span>`).join("")}</div></div>` : ""}
        </div>
      </div>
    </div>

    <section class="section bg-cream2" style="margin-top:clamp(24px,3vw,44px)">
      <div class="container">
        <div class="section-head reveal center"><span class="eyebrow">FAQ</span><h2 style="margin-top:1rem">${esc(p.name)}, questions answered</h2></div>
        <div class="faq" style="max-width:780px;margin-inline:auto">
          ${faqs.map((f) => `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-a">${esc(f.a)}</div></details>`).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal"><span class="eyebrow">Related</span><h2 style="margin-top:1rem">You may also need</h2></div>
        <div class="grid grid-3">${related.map(productCard).join("")}</div>
      </div>
    </section>
  </main>`;
}

function industriesBody() {
  const blocks = INDUSTRIES.map((i, idx) => {
    const prods = i.products.map(productBySlug).filter(Boolean);
    return `
      <div class="split ${idx % 2 ? "split--rev" : ""} reveal" style="margin-bottom:clamp(48px,7vw,96px)">
        <a class="split-media${i.image ? "" : " " + i.art + " roll-art"}" href="${industryUrl(i)}" aria-label="${escAttr(i.name)}">${i.image ? `<img src="${i.image}" alt="${escAttr(i.name)} packaging" loading="lazy">` : ""}</a>
        <div class="split-body">
          <span class="eyebrow">${esc(i.name)}</span>
          <h2 style="margin-top:1rem"><a href="${industryUrl(i)}">${esc(i.name)}</a></h2>
          <p>${esc(i.detail)}</p>
          <a class="btn btn--primary" href="${industryUrl(i)}">Explore ${esc(i.name)} ${ICON.arrow}</a>
        </div>
      </div>`;
  }).join("");
  return `
  <section class="page-hero center">
    <div class="container">
      <span class="eyebrow">Industries</span>
      <h1>Built for the sectors that depend on packaging.</h1>
      <p>The same converting expertise, tuned to four very different worlds, from sterile medical disposables to food-contact cups and shelf-ready retail cartons.</p>
    </div>
  </section>
  <section class="section--tight"><div class="container">${blocks}</div></section>
  `;
}

function industryBody(i) {
  const prods = i.products.map(productBySlug).filter(Boolean);
  const faqs = industryFaqs(i);
  return `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb" style="padding-top:0;margin-bottom:1rem"><a href="/">Home</a> / <a href="/industries/">Industries</a> / <span>${esc(i.name)}</span></nav>
      <span class="eyebrow">${esc(i.name)} packaging</span>
      <h1>${esc(i.name)} packaging solutions.</h1>
      <p>${esc(i.detail)}</p>
    </div>
  </section>

  <section class="section--tight">
    <div class="container">
      <div class="section-head reveal"><span class="eyebrow">Recommended products</span><h2 style="margin-top:1rem">Materials for ${esc(i.name.toLowerCase())} packaging</h2></div>
      <div class="grid grid-3">${prods.map(productCard).join("")}</div>
      <div style="margin-top:2rem"><a class="btn btn--ghost btn--lg" href="/products/?industry=${i.slug}">Filter all ${esc(i.name)} products ${ICON.arrow}</a></div>
    </div>
  </section>

  ${faqSection(faqs, { title: esc(i.name) + " packaging, FAQ", bg: true })}
  `;
}

function capabilitiesBody() {
  return `
  <section class="page-hero">
    <div class="container">
      <span class="eyebrow">Capabilities</span>
      <h1>From substrate to finished reel, in-house.</h1>
      <p>A Korean-built coating line, rotogravure printing and precision slitting let us control quality end to end, backed by a distribution network across India's leading mills.</p>
    </div>
  </section>

  <section class="section--tight"><div class="container"><div class="grid grid-2">${capCards(true)}</div></div></section>

  <section class="section bg-cream2">
    <div class="container">
      <div class="split reveal">
        <div class="split-body">
          <span class="eyebrow">Substrates we handle</span>
          <h2 style="margin-top:1rem">One coating line, many materials.</h2>
          <p>We poly-coat and laminate across a broad substrate range, letting you consolidate barrier, print and structure with one partner.</p>
          <ul class="checklist">
            <li>${CHECK}<span>Paper &amp; paperboard (all grades)</span></li>
            <li>${CHECK}<span>Cupstock paper</span></li>
            <li>${CHECK}<span>Polyester (PET) &amp; BOPP film</span></li>
            <li>${CHECK}<span>Aluminium foils, plain &amp; printed</span></li>
            <li>${CHECK}<span>Fabrics &amp; specialty substrates</span></li>
          </ul>
        </div>
        <div class="split-media"><img src="/assets/substrates.jpg" alt="Paper rolls feeding a coating and converting line" loading="lazy"></div>
      </div>
    </div>
  </section>

  <section class="section bg-green">
    <div class="container">
      <div class="section-head reveal center"><span class="eyebrow" style="color:#B9B8E0">Capacity & reach</span><h2 style="margin-top:1rem">Scaled for serious volume.</h2></div>
      <div class="statstrip">${statStrip()}</div>
    </div>
  </section>

  ${ctaBand("Need a custom coated laminate?", "Share your structure and barrier requirements, we'll engineer the right build.")}`;
}

function contactBody() {
  const offices = COMPANY.offices.map((o) => `
        <div class="office-card">
          <span class="tag">${esc(o.tag)}</span>
          <h3>${esc(o.city)}</h3>
          <div class="row">${ICON.pin}<span>${esc(o.address)}</span></div>
          <div class="row">${ICON.phone}<a href="tel:${o.phoneRaw}">${esc(o.phone)}</a></div>
          <div class="row">${ICON.mail}<a href="mailto:${o.email}">${esc(o.email)}</a></div>
          <div class="row">${ICON.pin}<a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}">View on Google Maps ${ICON.arrow}</a></div>
        </div>`).join("");
  const opts = PRODUCTS.map((p) => `<option value="${escAttr(p.name)}">${esc(p.name)}</option>`).join("");
  return `
  <section class="page-hero">
    <div class="container">
      <span class="eyebrow">Contact</span>
      <h1>Let's talk packaging.</h1>
      <p>Reach our corporate office in Mumbai or our manufacturing plant in Silvassa, or send an enquiry and we'll reply within one business day.</p>
    </div>
  </section>

  <section class="section--tight">
    <div class="container">
      <div class="contact-grid">
        <div>${offices}</div>
        <div>
          <form class="form" id="contact-form">
            <h3 style="margin-bottom:1.2rem">Send us an enquiry</h3>
            <div class="field-row">
              <div class="field"><label>Name</label><input name="name" required placeholder="Your name"></div>
              <div class="field"><label>Company</label><input name="company" placeholder="Company name"></div>
            </div>
            <div class="field-row">
              <div class="field"><label>Email</label><input type="email" name="email" required placeholder="you@company.com"></div>
              <div class="field"><label>Phone</label><input name="phone" placeholder="+91 ..."></div>
            </div>
            <div class="field-row">
              <div class="field"><label>Product of interest</label><select name="product"><option value="">General enquiry</option>${opts}</select></div>
              <div class="field"><label>Country</label><input name="country" placeholder="Country"></div>
            </div>
            <div class="field"><label>Message</label><textarea name="message" placeholder="Quantity, specifications, timeline..."></textarea></div>
            <button type="submit" class="btn btn--primary btn--lg" style="width:100%;justify-content:center">Send Enquiry</button>
            <p class="form-note">By submitting you agree to be contacted about your enquiry.</p>
          </form>
          <div class="form-success" id="contact-success">✓ Thank you, your enquiry has been received. We'll be in touch shortly.</div>
        </div>
      </div>
    </div>
  </section>`;
}

/* ===========================================================
   ASSETS (placeholder logo / og / favicon as SVG)
   =========================================================== */
function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="64" viewBox="0 0 240 64"><rect width="64" height="64" rx="14" fill="#2E2C7E"/><text x="32" y="42" font-family="Inter,Arial,sans-serif" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">KP</text><text x="78" y="34" font-family="Georgia,serif" font-size="22" font-weight="600" fill="#1B1B2A">K P Packaging</text><text x="79" y="50" font-family="Inter,Arial,sans-serif" font-size="9" letter-spacing="2" fill="#6F7073">COATED PAPER · MUMBAI</text></svg>`;
}
function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2E2C7E"/><text x="32" y="43" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="700" fill="#fff" text-anchor="middle">KP</text></svg>`;
}
function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#F7F7FB"/><rect width="1200" height="630" fill="url(#g)" opacity="0.08"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E2C7E"/><stop offset="1" stop-color="#6F7073"/></linearGradient></defs><rect x="80" y="86" width="92" height="92" rx="20" fill="#2E2C7E"/><text x="126" y="148" font-family="Inter,Arial,sans-serif" font-size="40" font-weight="700" fill="#fff" text-anchor="middle">KP</text><text x="80" y="320" font-family="Georgia,serif" font-size="76" font-weight="600" fill="#1B1B2A">K P Packaging</text><text x="80" y="392" font-family="Inter,Arial,sans-serif" font-size="34" fill="#5C5D69">Coated paper &amp; flexible packaging · 30+ years</text><text x="80" y="452" font-family="Inter,Arial,sans-serif" font-size="26" fill="#6F7073">Pharma · Food &amp; Beverage · FMCG · Medical, 20+ countries</text></svg>`;
}

/* ===========================================================
   TECHNICAL FILES
   =========================================================== */
function robotsTxt() {
  const allow = ["Googlebot", "Bingbot", "DuckDuckBot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "anthropic-ai", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot", "Applebot-Extended", "Amazonbot", "Bytespider", "CCBot", "Meta-ExternalAgent"];
  let out = "# K P Packaging, crawler policy\n# Search and AI assistants are welcome to index and cite this site.\n\n";
  for (const ua of allow) out += `User-agent: ${ua}\nAllow: /\n\n`;
  out += "User-agent: *\nAllow: /\n\n";
  out += `Sitemap: ${BASE}/sitemap.xml\n`;
  return out;
}
function sitemapXml(urls) {
  const body = urls.map((u) => `  <url>\n    <loc>${BASE}${u.path}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
function llmsTxt() {
  let s = `# K P Packaging\n\n> ${COMPANY.summary}\n\n`;
  s += `Founded: ${COMPANY.founded}. Head office: ${COMPANY.offices[0].address}. Plant: ${COMPANY.offices[1].address}.\nContact: ${COMPANY.offices[0].email} / ${COMPANY.offices[0].phone}.\n\n`;
  s += `## Key pages\n- [Home](${BASE}/): overview\n- [About](${BASE}/about/): history, team, certifications\n- [Products](${BASE}/products/): full catalogue\n- [Industries](${BASE}/industries/): pharma, food & beverage, FMCG, medical\n- [Contact](${BASE}/contact/): offices & enquiry\n\n`;
  s += `## Products\n` + PRODUCTS.map((p) => `- [${p.name}](${BASE}${productUrl(p)}): ${p.tagline}`).join("\n") + "\n";
  return s;
}

/* ===========================================================
   BUILD
   =========================================================== */
function build() {
  // clean dist
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  // static assets
  copyDir(path.join(ROOT, "css"), path.join(OUT, "css"));
  fs.mkdirSync(path.join(OUT, "js"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "js", "app.js"), path.join(OUT, "js", "app.js"));
  fs.copyFileSync(path.join(ROOT, "js", "lenis.min.js"), path.join(OUT, "js", "lenis.min.js"));
  if (fs.existsSync(path.join(ROOT, "assets"))) copyDir(path.join(ROOT, "assets"), path.join(OUT, "assets"));
  writeFile("assets/logo.svg", logoSvg());
  writeFile("assets/favicon.svg", faviconSvg());
  writeFile("assets/og-cover.svg", ogSvg());

  const baseLd = [orgLd(), websiteLd()];

  // HOME
  writePage(".", pageShell({
    title: "K P Packaging, Coated Paper & Flexible Packaging Manufacturer, Mumbai",
    desc: "K P Packaging is a 30+ year Mumbai-based manufacturer & distributor of coated papers and flexible packaging for pharma, food and FMCG, serving 425+ clients across 20+ countries.",
    path: "/", page: "home",
    jsonld: [...baseLd, faqLd(COMPANY.faq), breadcrumbLd([{ name: "Home", path: "/" }])]
  }, homeBody()));

  // ABOUT
  writePage("about", pageShell({
    title: "About K P Packaging, Coated Paper Manufacturers & Exporters",
    desc: "K P Packaging is a generational family business with 30+ years in coated paper and flexible packaging, manufacturing extrusion laminates and distributing mill-grade papers from Mumbai & Silvassa, India.",
    path: "/about/", page: "about", ogType: "website",
    jsonld: [...baseLd, { "@context": "https://schema.org", "@type": "AboutPage", url: BASE + "/about/", about: { "@id": ORG_ID } }, ...COMPANY.team.map(personLd), breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about/" }])]
  }, aboutBody()));

  // PRODUCTS listing
  writePage("products", pageShell({
    title: "Products, Coated Papers, Boards & Foil Laminates | K P Packaging",
    desc: "Browse 16 grades of coated paper, board and foil laminates from K P Packaging, glassine, MG poster, chromo, cupstock, kraft, 3/4-ply foil and more. Filter by industry, construction and coating.",
    path: "/products/", page: "products",
    jsonld: [...baseLd, itemListLd(PRODUCTS), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products/" }])]
  }, productsBody()));

  // PRODUCT pages
  for (const p of PRODUCTS) {
    const url = productUrl(p);
    writePage("products/" + p.slug, pageShell({
      title: `${p.name} Manufacturer & Supplier | K P Packaging`,
      desc: `${p.name} (${p.aka}) from K P Packaging, ${p.tagline} ${p.desc}`.slice(0, 300),
      path: url, page: "products", ogType: "product",
      jsonld: [...baseLd, productLd(p, url), faqLd(productFaqs(p)), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products/" }, { name: p.name, path: url }])]
    }, productBody(p)));
  }

  // INDUSTRIES overview
  writePage("industries", pageShell({
    title: "Industries We Serve, Pharma, Food, FMCG, Medical | K P Packaging",
    desc: "Packaging solutions for the pharmaceutical, food & beverage, FMCG and medical/surgical industries from K P Packaging, barrier papers, foil laminates, cupstock and sterilizable medical papers.",
    path: "/industries/", page: "industries",
    jsonld: [...baseLd, breadcrumbLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries/" }])]
  }, industriesBody()));

  // INDUSTRY pages
  for (const i of INDUSTRIES) {
    const url = industryUrl(i);
    writePage("industries/" + i.slug, pageShell({
      title: `${i.name} Packaging Supplier in India | K P Packaging`,
      desc: `${i.name} packaging from K P Packaging, ${i.blurb} Serving 425+ clients across 20+ countries.`,
      path: url, page: "industries",
      jsonld: [...baseLd, serviceLd(i), faqLd(industryFaqs(i)), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries/" }, { name: i.name, path: url }])]
    }, industryBody(i)));
  }

  // CAPABILITIES
  // CONTACT
  writePage("contact", pageShell({
    title: "Contact K P Packaging, Mumbai Office & Silvassa Plant",
    desc: "Contact K P Packaging, corporate office in Lower Parel, Mumbai and manufacturing plant in Silvassa, India. Phone, email and enquiry form for quotes.",
    path: "/contact/", page: "contact",
    jsonld: [...baseLd, ...COMPANY.offices.map(localBusinessLd), { "@context": "https://schema.org", "@type": "ContactPage", url: BASE + "/contact/", about: { "@id": ORG_ID } }, breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }])]
  }, contactBody()));

  // technical files
  const urls = [
    { path: "/", freq: "weekly", pri: "1.0" },
    { path: "/about/", freq: "monthly", pri: "0.8" },
    { path: "/products/", freq: "weekly", pri: "0.9" },
    { path: "/industries/", freq: "monthly", pri: "0.8" },
    { path: "/contact/", freq: "monthly", pri: "0.7" },
    ...PRODUCTS.map((p) => ({ path: productUrl(p), freq: "monthly", pri: "0.8" })),
    ...INDUSTRIES.map((i) => ({ path: industryUrl(i), freq: "monthly", pri: "0.7" }))
  ];
  writeFile("robots.txt", robotsTxt());
  writeFile("sitemap.xml", sitemapXml(urls));
  writeFile("llms.txt", llmsTxt());
  writeFile("manifest.webmanifest", JSON.stringify({
    name: COMPANY.legal,
    short_name: "K P Packaging",
    description: COMPANY.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F7FB",
    theme_color: "#2E2C7E",
    icons: [
      { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
    ]
  }, null, 2));

  const pageCount = 5 + PRODUCTS.length + INDUSTRIES.length;
  console.log(`✓ Built ${pageCount} pages + robots.txt, sitemap.xml (${urls.length} urls), llms.txt → ${path.relative(ROOT, OUT)}/`);
}

build();
