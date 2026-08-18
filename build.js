#!/usr/bin/env node
/* ===========================================================
   KP Packaging, static site generator (GEO/AEO optimized)
   Reads js/data.js and emits a fully crawlable site into dist/.
   Run:  node build.js
   =========================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const { COMPANY, CAPABILITIES, INDUSTRIES, INFRASTRUCTURE, PRODUCTS, FILTERS } = require("./js/data.js");

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
    if (e.name === ".DS_Store") continue;
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

const IMAGE_DIMS = new Map();
function imageSize(sitePath) {
  if (!sitePath || !sitePath.startsWith("/assets/")) return null;
  if (!IMAGE_DIMS.has(sitePath)) {
    try {
      const buf = fs.readFileSync(path.join(ROOT, sitePath.replace(/^\//, "")));
      if (buf.slice(0, 4).toString("hex") === "89504e47") {
        IMAGE_DIMS.set(sitePath, { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) });
      } else if (buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP") {
        const type = buf.slice(12, 16).toString("ascii");
        if (type === "VP8X") IMAGE_DIMS.set(sitePath, { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) });
        else if (type === "VP8 ") IMAGE_DIMS.set(sitePath, { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff });
        else if (type === "VP8L") {
          const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
          IMAGE_DIMS.set(sitePath, { width: 1 + (((b1 & 0x3f) << 8) | b0), height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)) });
        } else IMAGE_DIMS.set(sitePath, null);
      } else IMAGE_DIMS.set(sitePath, null);
    } catch (e) {
      IMAGE_DIMS.set(sitePath, null);
    }
  }
  return IMAGE_DIMS.get(sitePath);
}
function cdnImage(src, width, opts = {}) {
  if (!src || !src.startsWith("/assets/") || src.endsWith(".svg")) return src;
  const q = opts.quality || 78;
  const params = [`url=${encodeURIComponent(src)}`, `w=${width}`, `q=${q}`];
  if (opts.height) params.push(`h=${opts.height}`);
  if (opts.fit) params.push(`fit=${opts.fit}`);
  if (opts.position) params.push(`position=${opts.position}`);
  return `/.netlify/images?${params.join("&")}`;
}
function imgTag(src, alt, opts = {}) {
  const dims = imageSize(src);
  const width = opts.width || (dims && dims.width) || 800;
  const height = opts.height || (dims && dims.height ? Math.round(width * dims.height / dims.width) : undefined);
  const widths = (opts.widths || [400, 800, 1200]).filter((w) => w <= Math.max(width, 400));
  if (!widths.includes(width)) widths.push(width);
  const attrs = [
    `src="${cdnImage(src, Math.min(width, Math.max(...widths)), opts)}"`,
    `alt="${escAttr(alt)}"`,
    `width="${width}"`,
    height ? `height="${height}"` : "",
    widths.length > 1 ? `srcset="${widths.sort((a, b) => a - b).map((w) => `${cdnImage(src, w, opts)} ${w}w`).join(", ")}"` : "",
    opts.sizes ? `sizes="${escAttr(opts.sizes)}"` : "",
    opts.loading ? `loading="${opts.loading}"` : "",
    opts.decoding ? `decoding="${opts.decoding}"` : `decoding="async"`,
    opts.fetchpriority ? `fetchpriority="${opts.fetchpriority}"` : "",
    opts.className ? `class="${escAttr(opts.className)}"` : "",
    opts.extra || ""
  ].filter(Boolean);
  return `<img ${attrs.join(" ")}>`;
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
    name: COMPANY.legal, alternateName: COMPANY.name !== COMPANY.legal ? COMPANY.name : undefined, url: BASE + "/",
    logo: BASE + COMPANY.logo, image: BASE + COMPANY.ogImage,
    description: COMPANY.summary, foundingDate: COMPANY.founded,
    slogan: COMPANY.tagline,
    sameAs: COMPANY.sameAs && COMPANY.sameAs.length ? COMPANY.sameAs : undefined,
    knowsAbout: ["Coated paper", "Flexible packaging", "Extrusion coating & lamination", "Rotogravure printing", "Pharmaceutical packaging", "Food packaging"],
    areaServed: { "@type": "Place", name: "Worldwide (25+ countries)" },
    foundingLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressRegion: "Maharashtra", addressCountry: "IN" } },
    hasCredential: COMPANY.certs.map((c) => ({ "@type": "EducationalOccupationalCredential", credentialCategory: "certification", name: c.name })),
    hasOfferCatalog: {
      "@type": "OfferCatalog", name: "Coated Papers, Boards & Laminates",
      itemListElement: PRODUCTS.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: p.name, url: BASE + productUrl(p) } }))
    },
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
    countryOfOrigin: { "@type": "Country", name: "India" },
    keywords: p.applications.slice(0, 6).join(", "),
    audience: { "@type": "BusinessAudience", name: "Packaging buyers and converters" },
    isRelatedTo: p.applications.slice(0, 6).map((a) => ({ "@type": "Thing", name: a }))
  };
}
function itemListLd(list) {
  return {
    "@context": "https://schema.org", "@type": "ItemList", name: "KP Packaging Products",
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
    { q: `Does KP Packaging manufacture or distribute ${p.name}?`, a: p.arm === "Distributed" ? `KP Packaging is an authorized distributor of ${p.name}, sourced from leading Indian paper mills.` : p.arm === "Both" ? `KP Packaging both manufactures and distributes ${p.name}.` : `KP Packaging manufactures ${p.name} in-house at its Silvassa plant using extrusion coating and lamination.` }
  ];
  if (p.certs && p.certs.length) out.push({ q: `Is ${p.name} certified?`, a: `Yes, ${p.name} is ${p.certs.join(", ")}.` });
  out.push({ q: `What are the key features of ${p.name}?`, a: `${p.properties.slice(0, 4).join("; ")}.` });
  return out;
}
function industryFaqs(i) {
  const prods = i.products.map(productBySlug).filter(Boolean);
  return [
    { q: `Who is a good ${i.name.toLowerCase()} packaging supplier in India?`, a: `KP Packaging is a Mumbai-based manufacturer and distributor supplying ${i.name.toLowerCase()} packaging, including ${prods.map((p) => p.name).slice(0, 4).join(", ")}, to clients across 25+ countries.` },
    { q: `What packaging materials does the ${i.name.toLowerCase()} industry use?`, a: `${i.detail}` },
    { q: `Can KP Packaging supply ${i.name.toLowerCase()} packaging for export?`, a: `Yes. KP Packaging serves 500+ clients across 25+ countries, including ${i.name.toLowerCase()} customers.` }
  ];
}

/* ===========================================================
   LAYOUT: head / header / footer / modal
   =========================================================== */
function head(meta) {
  const url = BASE + meta.path;
  // every page carries a WebPage node with dateModified (freshness signal for search + AI)
  const webpageLd = {
    "@context": "https://schema.org", "@type": meta.pageType || "WebPage",
    "@id": url + "#webpage", url, name: meta.title, description: meta.desc,
    isPartOf: { "@id": SITE_ID }, about: { "@id": ORG_ID },
    inLanguage: "en", dateModified: BUILD_DATE,
    primaryImageOfPage: { "@type": "ImageObject", contentUrl: BASE + COMPANY.ogImage }
  };
  const ld = (meta.jsonld || []).concat([webpageLd]).filter(Boolean).map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n  ");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${esc(meta.title)}</title>
  <meta name="description" content="${escAttr(meta.desc)}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="${meta.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"}">
  <meta name="theme-color" content="#2E2C7E">
  <meta name="author" content="${escAttr(COMPANY.legal)}">
  <meta name="geo.region" content="IN-MH">
  <meta name="geo.placename" content="Mumbai, Maharashtra, India">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:site_name" content="${escAttr(COMPANY.name)}">
  <meta property="og:title" content="${escAttr(meta.title)}">
  <meta property="og:description" content="${escAttr(meta.desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${BASE + COMPANY.ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="KP Packaging, coated paper and flexible packaging">
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
  <meta name="apple-mobile-web-app-title" content="KP Packaging">
  <meta name="format-detection" content="telephone=no">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap"></noscript>
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
      <a href="/" class="brand" aria-label="KP Packaging home">
        ${imgTag("/assets/kp-logo.png", "KP Packaging", { className: "brand-logo", width: 224, height: 122, widths: [224], loading: "eager" })}
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
          <a href="/" class="brand"><span class="mark">KP</span><span>KP Packaging</span></a>
          <p>A three-decade-old family business converting and distributing coated papers and flexible packaging for pharma, food and FMCG, in India and 25+ countries.</p>
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
  // default selection: Glassine Paper
  const opts = PRODUCTS.map((p) => {
    const label = p.slug === "pe-coated-stiffener-paper" ? "Stiffener Paper" : p.name;
    const sel = p.slug === "glassine-paper" ? " selected" : "";
    return `<option value="${escAttr(label)}"${sel}>${esc(label)}</option>`;
  }).join("");
  return `
  <div class="modal-overlay" id="quote-modal">
    <div class="modal" role="dialog" aria-modal="true" aria-label="Request a quote" data-lenis-prevent>
      <div class="modal-head">
        <div><h3>Request a Quote</h3><p>Tell us what you need, our team replies within one business day.</p></div>
        <button class="modal-close" data-close aria-label="Close">${ICON.close}</button>
      </div>
      <div class="modal-body">
        <form data-form name="quote" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="quote">
          <p hidden><label>Leave blank: <input name="bot-field"></label></p>
          <div class="field-row">
            <div class="field"><label>Name</label><input name="name" required placeholder="Your name"></div>
            <div class="field"><label>Company</label><input name="company" placeholder="Company name"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Email</label><input type="email" name="email" required placeholder="you@company.com"></div>
            <div class="field"><label>Phone</label><input name="phone" required placeholder="+91 ..."></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Product of interest</label>
              <select name="product" id="modal-product"><option value="">General inquiry</option>${opts}</select>
            </div>
            <div class="field"><label>Coating</label>
              <select name="coating"><option value="">Not sure</option><option>Coated (with PE)</option><option>Uncoated (without PE)</option></select>
            </div>
            <div class="field"><label>Country</label><input name="country" placeholder="Country"></div>
          </div>
          <div class="field"><label>Message</label><textarea name="message" placeholder="Quantity, specifications, timeline..."></textarea></div>
          <button type="submit" class="btn btn--primary btn--lg" style="width:100%;justify-content:center">Send Inquiry ${ICON.arrow}</button>
          <p class="form-note">By submitting you agree to be contacted about your inquiry.</p>
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
    return `__KP_BLOCK_${blocks.length - 1}__`;
  });
  html = html.replace(/>([^<]+)</g, (m, txt) => ">" + txt.replace(/[-‐-―]/g, " ").replace(/ {2,}/g, " ") + "<");
  html = html.replace(/__KP_BLOCK_(\d+)__/g, (m, i) => blocks[+i]);
  return html;
}

// Proper Title Case for headings: capitalise each word but keep minor words
// (the, of, and, for, us...) lowercase, except the first word. Acronyms (FMCG, MG) kept.
const MINOR_WORDS = new Set("a an and as at but by en for from if in into nor of off on onto or over per so the to up us via vs with yet".split(" "));
function titleCaseText(text, ctx) {
  const ents = [];
  text = text.replace(/&[a-z]+;/gi, (e) => { ents.push(e); return "\u0000" + (ents.length - 1) + "\u0000"; });
  text = text.replace(/[A-Za-z][A-Za-z'\u2019\u2018]*/g, (w) => {
    const i = ctx.n++;
    if (w.length > 1 && w === w.toUpperCase()) return w; // keep acronyms (FMCG, MG, CE)
    const lower = w.toLowerCase();
    if (i > 0 && MINOR_WORDS.has(lower)) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
  return text.replace(/\u0000(\d+)\u0000/g, (m, i) => ents[+i]);
}

function applyHeadingTitleCase(html) {
  return html.replace(/<h([1-4])([^>]*)>([\s\S]*?)<\/h\1>/g, (m, n, attr, inner) => {
    const ctx = { n: 0 };
    let cased = inner.replace(/(<[^>]+>)|([^<]+)/g, (mm, tag, txt) => tag ? tag : titleCaseText(txt, ctx));
    // no trailing full stops in headings
    cased = cased.replace(/\.\s*((?:<\/[a-z]+>)*)\s*$/i, "$1");
    return `<h${n}${attr}>${cased}</h${n}>`;
  });
}

// Version every /assets/ URL with a short content hash so replacing an image
// (same filename) still busts the year-long immutable browser/CDN cache.
const crypto = require("crypto");
const ASSET_VER = {};
function assetVer(sitePath) {
  if (!(sitePath in ASSET_VER)) {
    try {
      const buf = fs.readFileSync(path.join(ROOT, sitePath.replace(/^\//, "")));
      ASSET_VER[sitePath] = crypto.createHash("md5").update(buf).digest("hex").slice(0, 8);
    } catch (e) {
      ASSET_VER[sitePath] = BUILD_VER;
    }
  }
  return ASSET_VER[sitePath];
}
function versionAssets(html) {
  return html.replace(/((?:https:\/\/kppackaging\.com)?\/assets\/[A-Za-z0-9._/-]+\.(?:webp|png|jpe?g|svg))(?!\?)/g, (m, url) => {
    const sitePath = url.replace(/^https:\/\/kppackaging\.com/, "");
    return url + "?v=" + assetVer(sitePath);
  });
}

function pageShell(meta, body) {
  return versionAssets(applyHeadingTitleCase(stripDashesInText(head(meta) + header(meta.page) + body + footer() + quoteModal() + `
  <script src="/js/lenis.min.js?v=${BUILD_VER}" defer></script>
  <script src="/js/app.js?v=${BUILD_VER}" defer></script>
</body>
</html>`)));
}

/* ---------- shared components ---------- */
function productCard(p) {
  const inds = p.industries.map((s) => (industryBySlug(s) || {}).name).filter(Boolean).slice(0, 2);
  const data = `data-industry="${p.industries.join(" ")}" data-construction="${p.cats.construction}" data-coating="${p.cats.coating}" data-fn="${p.cats.fn.join(" ")}"`;
  const media = p.image
    ? `<div class="pcard-media has-img">${imgTag(p.image, `${p.name}, ${p.aka}`, { width: 520, widths: [320, 520, 720], sizes: "(max-width: 700px) 90vw, 33vw", loading: "lazy" })}</div>`
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
function faqMaps() {
  return `<div class="faq-maps">${COMPANY.offices.map((o) => `<figure><iframe src="https://www.google.com/maps?q=${encodeURIComponent(o.address)}&output=embed" loading="lazy" title="${escAttr(COMPANY.name + " " + o.tag)} map" referrerpolicy="no-referrer-when-downgrade"></iframe><figcaption>${esc(o.tag)}, ${esc(o.city)}</figcaption></figure>`).join("")}</div>`;
}

function faqSection(faqs, heading) {
  return `
  <section class="section${heading.bg ? " bg-cream2" : ""}">
    <div class="container">
      <div class="section-head reveal center"><h2 style="margin-top:1rem">${esc(heading.title)}</h2></div>
      <div class="faq" style="max-width:780px;margin-inline:auto">
        ${faqs.map((f) => `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-a">${esc(f.a)}${/located/i.test(f.q) ? faqMaps() : ""}</div></details>`).join("\n        ")}
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

/* ===========================================================
   PAGE BODIES
   =========================================================== */
function homeBody() {
  const clients = COMPANY.clients.map((c) => `<span class="tb-logo">${imgTag(c.logo, `${c.name} logo`, { width: 190, height: 50, widths: [190], loading: "eager" })}</span>`).join("");
  // decorative repeat copies (empty alt) so the loop never runs out of content on wide screens
  const clientsDup = COMPANY.clients.map((c) => `<span class="tb-logo">${imgTag(c.logo, "", { width: 190, height: 50, widths: [190], loading: "eager" })}</span>`).join("");
  const industries = INDUSTRIES.map((i) => `
        <a class="industry-card reveal" href="${industryUrl(i)}">
          <div class="ic-media${i.image ? "" : " " + i.art + " roll-art"}">${i.image ? imgTag(i.image, `${i.name} packaging`, { width: 640, widths: [360, 640, 900], sizes: "(max-width: 700px) 90vw, 25vw", loading: "lazy", fit: "cover" }) : ""}</div>
          <div class="ic-body"><h3>${esc(i.name)}</h3><p>${esc(i.blurb)}</p></div>
        </a>`).join("");
  const featured = ["4-ply-paper", "mg-poster-paper", "glassine-paper"].map(productBySlug).map(productCard).join("");
  const why = COMPANY.why.map((w) => `
        <div class="fcard reveal"><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></div>`).join("");
  return `
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-copy reveal in">
        <h1>Packaging that <em>protects</em> what matters.</h1>
        <p class="lead">A three-decade-old family business converting and distributing coated papers and flexible laminates for pharmaceuticals, food and FMCG, engineered for sealing, barrier, strength and print.</p>
        <div class="hero-stats">
          <div class="stat"><strong>30+</strong><span>Years of expertise</span></div>
          <div class="stat"><strong>25+</strong><span>Countries served</span></div>
          <div class="stat"><strong>500+</strong><span>Clients worldwide</span></div>
        </div>
      </div>
      <div class="hero-visual reveal in" data-tilt>
        ${imgTag("/assets/hero.webp", "Jumbo paper roll on the extrusion coating and lamination line at KP Packaging's plant", { className: "hero-img", width: 1200, widths: [640, 960, 1200, 1600], sizes: "(max-width: 900px) 100vw, 50vw", loading: "eager", fetchpriority: "high" })}
      </div>
    </div>
  </section>

  <section class="trustbar">
    <div class="container">
      <span class="tb-label">Trusted by leading brands</span>
      <div class="marquee">
        <div class="marquee-track">
          <div class="marquee-set">${clients}${clientsDup}</div>
          <div class="marquee-set" aria-hidden="true">${clientsDup}${clientsDup}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section--tight">
    <div class="container overview-split">
      <div class="overview-head reveal reveal--left">
                <h2 style="margin-top:1rem">Coated paper &amp; flexible packaging, made in India.</h2>
        <p class="lead" style="margin-top:1.3rem">${esc(COMPANY.summary)}</p>
      </div>
      <div class="overview-body reveal reveal--right">
        <div class="overview-facts">
          <div class="fact"><strong>Two verticals</strong><span>In-house manufacturing + authorized mill distribution</span></div>
          <div class="fact"><strong>25+ grades</strong><span>Coated papers, boards &amp; foil laminates</span></div>
          <div class="fact"><strong>Global machinery</strong><span>Korean, Chinese &amp; American extrusion coating lines</span></div>
          <div class="fact"><strong>Certified</strong><span>FSC, FDA &amp; ISO-aligned quality</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal center"><h2 style="margin-top:1rem">Two verticals, one promise</h2><p class="tagline">Packaging you can rely on</p></div>
      <div class="expertise-card reveal">
        <h3>Areas of Expertise</h3>
        <p>We coat and laminate on various grades of paper, paperboard, cupstock, polyester film, BOPP film, aluminium foils and fabrics. Our products pack medicines, gloves, yeast, sugar, salt, pepper, paper cups, boxes and tea. Our aluminium foil, plain and printed, pairs with rigid and flexible PVC films for blister and strip packing, condom laminates, surgical suture laminates and ORS salts. We also produce a full range of flexible packaging for chips, tea, coffee, salt, noodles, chocolates, detergents, soaps, oils and snacks.</p>
      </div>
      <div class="grid grid-4">${capCards(false)}</div>
    </div>
  </section>

  <section class="section bg-cream2">
    <div class="container">
      <div class="section-head reveal center"><h2 style="margin-top:1rem">Solutions for the industries we serve</h2><p>From moisture barriers for medicine to food-safe cupstock, find the right material by where it's used.</p></div>
      <div class="grid grid-4">${industries}</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal center"><h2 style="margin-top:1rem">Coated papers, boards & laminates.</h2><p>A snapshot of our best-selling grades, explore the full catalogue for specs and applications.</p></div>
      <div class="grid grid-3">${featured}</div>
      <div class="center" style="margin-top:1.4rem"><a href="/products/" class="btn btn--primary btn--lg">View all products</a></div>
    </div>
  </section>

  <section class="section hide-mobile">
    <div class="container">
      <div class="section-head reveal center"><h2 style="margin-top:1rem">Why companies choose us.</h2></div>
      <div class="grid grid-3">${why}</div>
    </div>
  </section>

  <section class="section bg-cream2">
    <div class="container">
      <div class="section-head reveal center"><h2 style="margin-top:1rem">Our infrastructure</h2><p>Eleven machines across extrusion lamination, printing and converting, sourced from the world's best builders.</p></div>
      <div class="infra-grid">
        ${INFRASTRUCTURE.map((m) => `<div class="infra-card reveal"><strong>${m.count}</strong><h3>${esc(m.name)}</h3><span>${esc(m.origin)}</span></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section--tight">
    <div class="container"><div class="section-head reveal center"><span class="eyebrow">Globally certified</span></div><div class="cert-logos">${COMPANY.certs.map((c) => `<div class="cert-logo">${imgTag(c.logo, `${c.name} certification`, { width: 240, widths: [160, 240], sizes: "160px", loading: "lazy" })}</div>`).join("")}</div></div>
  </section>

  ${faqSection(COMPANY.faq, { title: "Frequently asked questions", bg: true })}

  ${ctaBand("Let's create your perfect pack.", "Tell us your substrate, barrier and print needs, we'll recommend the right grade and get you a quote within a business day.")}`;
}

function aboutBody() {
  const team = COMPANY.team.map((m) => `
        <div class="team-card reveal"><div class="avatar">${imgTag(m.photo, `${m.name}, ${m.role}`, { width: 360, widths: [220, 360], sizes: "180px", loading: "lazy", fit: "cover" })}</div><h3>${esc(m.name)}</h3><div class="role">${esc(m.role)}</div></div>`).join("");
  return `
  <section class="page-hero">
    <div class="container page-hero-split">
      <div class="page-hero-copy">
        
        <h1>Three decades of packaging, run by one family.</h1>
        <p>From pioneers in the PVC leather cloth industry to a modern coated-paper and flexible-packaging house, KP Packaging has grown across generations while keeping quality and relationships at its core.</p>
      </div>
      <div class="page-hero-media">${imgTag("/assets/about-hero.webp", "Wrapped paper jumbo rolls at KP Packaging", { width: 900, widths: [480, 720, 900, 1200], sizes: "(max-width: 900px) 100vw, 46vw", loading: "eager", fetchpriority: "high", extra: 'data-parallax="0.08"' })}</div>
    </div>
  </section>

  <section class="section--tight">
    <div class="container">
      <div class="split reveal">
        <div class="split-media">${imgTag("/assets/our-story.webp", "Paper-making machine reflecting KP Packaging's decades of converting heritage", { width: 820, widths: [480, 720, 900, 1200], sizes: "(max-width: 900px) 100vw, 46vw", loading: "lazy", extra: 'data-parallax="0.08"' })}</div>
        <div class="split-body">
          
          <h2 style="margin-top:1rem">A generational business</h2>
          <p>With over three decades of history, KP Packaging is a generational family business. The company is promoted by <strong>Mr. Ketan Vira</strong>, who, with rich experience in the packaging industry, has grown the business exponentially. Alongside him, his son <strong>Mr. Prem Vira</strong> has taken it upon himself to take KP Packaging international.</p>
          <p>Today we operate across two complementary verticals: in-house manufacturing of extrusion-coated laminates, and authorized distribution for leading Indian paper mills.</p>
          <p>From our state-of-the-art coating and lamination plant in Silvassa to a distribution network spanning India's leading paper mills, we supply pharmaceutical, food, FMCG and medical customers across about 25 countries, the same care across every grade we make and move.</p>
          <p>What hasn't changed in three decades is how we work: dependable quality, honest pricing, and long-term relationships with the people we package for.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section bg-cream2">
    <div class="container">
      <div class="grid grid-2">
        <div class="fcard fcard--dark reveal"><h3>Manufacturing</h3><p>We manufacture extrusion coated laminates by poly (LDPE) coating printed and unprinted paper, board, aluminium foil, PET, BOPP, fabric and other substrates. Our three state-of-the-art extrusion lamination machines, imported from Korea, China and the United States of America, are supported by an 8-colour rotogravure printing machine and multiple slitting, sheeting and rewinding machines.</p></div>
        <div class="fcard fcard--dark reveal"><h3>Distribution</h3><p>We are authorized distributors for multiple Indian paper mills, supplying MG Poster, Maplitho, Cupstock, MG/MF Kraft, Greaseproof (OGR), Chromo (C1S &amp; C2S), Glassine, OLB, Bible, Stiffener, Tissue, Duplex, Folding Box Board (FBB), Solid Bleached Sulphate (SBS), Backtite, LWC, Bleach Kraft and more.</p></div>
      </div>
    </div>
  </section>


  <section class="section bg-cream2">
    <div class="container">
      <div class="section-head reveal center"><h2 style="margin-top:1rem">Meet the team</h2></div>
      <div class="grid grid-3">${team}</div>
    </div>
  </section>`;
}

function drawerContent(p) {
  const inds = p.industries.map(industryBySlug).filter(Boolean);
  const specRows = Object.entries(p.specs || {}).map(([k, v]) => `<tr><td>${esc(titleCase(k))}</td><td>${esc(v)}</td></tr>`).join("");
  const media = p.image
    ? `<div class="drawer-media">${imgTag(p.image, `${p.name}, ${p.aka}`, { width: 780, widths: [480, 780, 1100], sizes: "(max-width: 700px) 100vw, 48vw", loading: "lazy" })}</div>`
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
  const filters = Object.keys(FILTERS).filter((g) => g !== "industry").map((g) => `
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
      
      <h1>Coated papers, boards & laminates.</h1>
      <p>25+ grades engineered for sealing, barrier, strength and print, from pharmaceutical glassine to food-safe cupstock. Click any product for instant details, or filter to find your match.</p>
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
  const productImage = p.image ? imgTag(p.image, `${p.name}, ${p.aka}`, { width: 920, widths: [480, 720, 920, 1200], sizes: "(max-width: 900px) 100vw, 48vw", loading: "eager", fetchpriority: "high" }) : "";
  return `
  <main id="product-detail">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/products/">Products</a> / <span>${esc(p.name)}</span></nav>
      <div class="pdetail">
        <div class="pdetail-media">
          ${p.image
      ? `<div class="pdetail-hero has-img">${productImage}</div>`
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
        <div class="section-head reveal center"><h2 style="margin-top:1rem">${esc(p.name)}, questions answered</h2></div>
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
        <a class="split-media${i.image ? "" : " " + i.art + " roll-art"}" href="${industryUrl(i)}" aria-label="${escAttr(i.name)}">${i.image ? imgTag(i.image, `${i.name} packaging`, { width: 900, widths: [480, 720, 900, 1200], sizes: "(max-width: 900px) 100vw, 48vw", loading: idx === 0 ? "eager" : "lazy", fetchpriority: idx === 0 ? "high" : "" }) : ""}</a>
        <div class="split-body">
          <h2><a href="${industryUrl(i)}">${esc(i.name)}</a></h2>
          <p>${esc(i.detail)}</p>
          <div style="text-align:center"><a class="btn btn--primary" href="${industryUrl(i)}">Explore ${esc(i.name)} ${ICON.arrow}</a></div>
        </div>
      </div>`;
  }).join("");
  return `
  <section class="page-hero center page-hero--compact">
    <div class="container">

      <h1>Built for the industries that depend on packaging.</h1>
      <p>The same converting expertise tuned to multiple different worlds. From sterile medical disposables to food contact cups.</p>
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
      <div style="margin-top:2rem"><a class="btn btn--ghost btn--lg" href="/products/">Browse all products ${ICON.arrow}</a></div>
    </div>
  </section>

  ${faqSection(faqs, { title: esc(i.name) + " packaging, FAQ", bg: true })}
  `;
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
  const opts = PRODUCTS.map((p) => {
    const label = p.slug === "pe-coated-stiffener-paper" ? "Stiffener Paper" : p.name;
    return `<option value="${escAttr(label)}">${esc(label)}</option>`;
  }).join("");
  return `
  <section class="page-hero">
    <div class="container">
      
      <h1>Let's talk packaging.</h1>
      <p>Reach our corporate office in Mumbai or our manufacturing plant in Silvassa, or send an inquiry and we'll reply within one business day.</p>
    </div>
  </section>

  <section class="section--tight">
    <div class="container">
      <div class="contact-grid">
        <div>${offices}</div>
        <div>
          <form class="form" id="contact-form" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="contact">
            <p hidden><label>Leave blank: <input name="bot-field"></label></p>
            <h3 style="margin-bottom:1.2rem">Send us an inquiry</h3>
            <div class="field-row">
              <div class="field"><label>Name</label><input name="name" required placeholder="Your name"></div>
              <div class="field"><label>Company</label><input name="company" placeholder="Company name"></div>
            </div>
            <div class="field-row">
              <div class="field"><label>Email</label><input type="email" name="email" required placeholder="you@company.com"></div>
              <div class="field"><label>Phone</label><input name="phone" required placeholder="+91 ..."></div>
            </div>
            <div class="field-row">
              <div class="field"><label>Product of interest</label><select name="product"><option value="">General inquiry</option>${opts}</select></div>
              <div class="field"><label>Country</label><input name="country" placeholder="Country"></div>
            </div>
            <div class="field"><label>Coating</label><select name="coating"><option value="">Not sure</option><option>Coated (with PE)</option><option>Uncoated (without PE)</option></select></div>
            <div class="field"><label>Message <span class="opt">(optional)</span></label><textarea name="message" placeholder="Quantity, specifications, timeline..."></textarea></div>
            <button type="submit" class="btn btn--primary btn--lg" style="width:100%;justify-content:center">Send Inquiry</button>
            <p class="form-note">By submitting you agree to be contacted about your inquiry.</p>
          </form>
          <div class="form-success" id="contact-success">✓ Thank you, your inquiry has been received. We'll be in touch shortly.</div>
        </div>
      </div>
    </div>
  </section>`;
}

/* ===========================================================
   ASSETS (placeholder logo / og / favicon as SVG)
   =========================================================== */
function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="64" viewBox="0 0 240 64"><rect width="64" height="64" rx="14" fill="#2E2C7E"/><text x="32" y="42" font-family="Inter,Arial,sans-serif" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">KP</text><text x="78" y="34" font-family="Georgia,serif" font-size="22" font-weight="600" fill="#1B1B2A">KP Packaging</text><text x="79" y="50" font-family="Inter,Arial,sans-serif" font-size="9" letter-spacing="2" fill="#6F7073">COATED PAPER · MUMBAI</text></svg>`;
}
function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2E2C7E"/><text x="32" y="43" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="700" fill="#fff" text-anchor="middle">KP</text></svg>`;
}
function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#F7F7FB"/><rect width="1200" height="630" fill="url(#g)" opacity="0.08"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E2C7E"/><stop offset="1" stop-color="#6F7073"/></linearGradient></defs><rect x="80" y="86" width="92" height="92" rx="20" fill="#2E2C7E"/><text x="126" y="148" font-family="Inter,Arial,sans-serif" font-size="40" font-weight="700" fill="#fff" text-anchor="middle">KP</text><text x="80" y="320" font-family="Georgia,serif" font-size="76" font-weight="600" fill="#1B1B2A">KP Packaging</text><text x="80" y="392" font-family="Inter,Arial,sans-serif" font-size="34" fill="#5C5D69">Coated paper &amp; flexible packaging · 30+ years</text><text x="80" y="452" font-family="Inter,Arial,sans-serif" font-size="26" fill="#6F7073">Pharma · Food &amp; Beverage · FMCG · Medical, 25+ countries</text></svg>`;
}

/* ===========================================================
   TECHNICAL FILES
   =========================================================== */
function robotsTxt() {
  const allow = ["Googlebot", "Bingbot", "DuckDuckBot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "anthropic-ai", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot", "Applebot-Extended", "Amazonbot", "Bytespider", "CCBot", "Meta-ExternalAgent"];
  let out = "# KP Packaging, crawler policy\n# Search and AI assistants are welcome to index and cite this site.\n\n";
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
  let s = `# KP Packaging\n\n> ${COMPANY.summary}\n\n`;
  s += `Founded: ${COMPANY.founded}. Head office: ${COMPANY.offices[0].address}. Plant: ${COMPANY.offices[1].address}.\nContact: ${COMPANY.offices[0].email} / ${COMPANY.offices[0].phone}.\n\n`;
  s += `## Key pages\n- [Home](${BASE}/): overview\n- [About](${BASE}/about/): history, team, certifications\n- [Products](${BASE}/products/): full catalogue\n- [Industries](${BASE}/industries/): pharma, food & beverage, FMCG, medical\n- [Contact](${BASE}/contact/): offices & inquiry\n\n`;
  s += `## Products\n` + PRODUCTS.map((p) => `- [${p.name}](${BASE}${productUrl(p)}): ${p.tagline}`).join("\n") + "\n";
  s += `\n## Full content\nFor complete product and company details see [llms-full.txt](${BASE}/llms-full.txt).\n`;
  return s;
}

// llms-full.txt: complete content dump so LLMs can ingest everything in one fetch
function llmsFullTxt() {
  let s = `# KP Packaging, Full Reference\n\n> ${COMPANY.summary}\n\n`;
  s += `Founded: ${COMPANY.founded}\nCorporate office: ${COMPANY.offices[0].address} | ${COMPANY.offices[0].phone} | ${COMPANY.offices[0].email}\n`;
  s += `Manufacturing plant: ${COMPANY.offices[1].address} | ${COMPANY.offices[1].phone} | ${COMPANY.offices[1].email}\n`;
  s += `Certifications: ${COMPANY.certs.map((c) => c.name).join(", ")}\n`;
  s += `Clients include: ${COMPANY.clients.map((c) => c.name).join(", ")}\n`;
  s += `Leadership: ${COMPANY.team.map((m) => m.name + " (" + m.role + ")").join(", ")}\n\n`;
  s += `## Why KP Packaging\n` + COMPANY.why.map((w) => `- ${w.title}: ${w.text}`).join("\n") + "\n\n";
  s += `## Capabilities\n` + CAPABILITIES.map((c) => `### ${c.title}\n${c.detail}`).join("\n\n") + "\n\n";
  s += `## Industries\n` + INDUSTRIES.map((i) => `### ${i.name} (${BASE}${industryUrl(i)})\n${i.detail}`).join("\n\n") + "\n\n";
  s += `## Products\n\n` + PRODUCTS.map((p) => {
    let t = `### ${p.name} (${BASE}${productUrl(p)})\nAlso known as: ${p.aka}\n${p.desc}\n`;
    t += `Applications: ${p.applications.join("; ")}\n`;
    t += `Key properties: ${p.properties.join("; ")}\n`;
    if (p.variants && p.variants.length) t += `Variants: ${p.variants.join("; ")}\n`;
    if (p.certs && p.certs.length) t += `Certifications: ${p.certs.join(", ")}\n`;
    return t;
  }).join("\n") + "\n";
  s += `## Frequently asked questions\n\n` + COMPANY.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n") + "\n";
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
    title: "KP Packaging | Coated Paper & Flexible Packaging",
    desc: "KP Packaging is a 30+ year Mumbai-based manufacturer & distributor of coated papers and flexible packaging for pharma, food and FMCG, serving 500+ clients across 25+ countries.",
    path: "/", page: "home",
    jsonld: [...baseLd, faqLd(COMPANY.faq), breadcrumbLd([{ name: "Home", path: "/" }])]
  }, homeBody()));

  // ABOUT
  writePage("about", pageShell({
    title: "About KP Packaging | Coated Paper Manufacturer",
    desc: "KP Packaging is a generational family business with 30+ years in coated paper and flexible packaging, manufacturing extrusion laminates and distributing mill-grade papers from Mumbai & Silvassa, India.",
    path: "/about/", page: "about", ogType: "website",
    jsonld: [...baseLd, { "@context": "https://schema.org", "@type": "AboutPage", url: BASE + "/about/", about: { "@id": ORG_ID } }, ...COMPANY.team.map(personLd), breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about/" }])]
  }, aboutBody()));

  // PRODUCTS listing
  writePage("products", pageShell({
    title: "Coated Paper & Board Products | KP Packaging",
    desc: "Browse 25+ grades of coated paper, board and foil laminates from KP Packaging, glassine, MG poster, chromo, cupstock, kraft, 3/4-ply foil and more. Filter by industry, construction and coating.",
    path: "/products/", page: "products",
    jsonld: [...baseLd, itemListLd(PRODUCTS), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products/" }])]
  }, productsBody()));

  // PRODUCT pages
  for (const p of PRODUCTS) {
    const url = productUrl(p);
    writePage("products/" + p.slug, pageShell({
      title: `${p.name} | KP Packaging`,
      desc: (`${p.name} (${p.aka}) from KP Packaging. ${p.tagline}`.length <= 160
        ? `${p.name} (${p.aka}) from KP Packaging. ${p.tagline}`
        : `${p.name} from KP Packaging. ${p.tagline}`).slice(0, 160),
      path: url, page: "products", ogType: "product",
      jsonld: [...baseLd, productLd(p, url), faqLd(productFaqs(p)), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products/" }, { name: p.name, path: url }])]
    }, productBody(p)));
  }

  // INDUSTRIES overview
  writePage("industries", pageShell({
    title: "Industries We Serve | KP Packaging",
    desc: "Packaging solutions for the pharmaceutical, food & beverage, FMCG and medical or surgical industries from KP Packaging, barrier papers, foil laminates, cupstock and sterilizable medical papers.",
    path: "/industries/", page: "industries",
    jsonld: [...baseLd, breadcrumbLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries/" }])]
  }, industriesBody()));

  // INDUSTRY pages
  for (const i of INDUSTRIES) {
    const url = industryUrl(i);
    writePage("industries/" + i.slug, pageShell({
      title: `${i.name} Packaging | KP Packaging`,
      desc: `${i.name} packaging from KP Packaging, ${i.blurb} Serving 500+ clients across 25+ countries.`,
      path: url, page: "industries",
      jsonld: [...baseLd, serviceLd(i), faqLd(industryFaqs(i)), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries/" }, { name: i.name, path: url }])]
    }, industryBody(i)));
  }

  // CAPABILITIES
  // CONTACT
  writePage("contact", pageShell({
    title: "Contact KP Packaging | Mumbai & Silvassa",
    desc: "Contact KP Packaging, corporate office in Lower Parel, Mumbai and manufacturing plant in Silvassa, India. Phone, email and inquiry form for quotes.",
    path: "/contact/", page: "contact",
    jsonld: [...baseLd, ...COMPANY.offices.map(localBusinessLd), { "@context": "https://schema.org", "@type": "ContactPage", url: BASE + "/contact/", about: { "@id": ORG_ID } }, breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }])]
  }, contactBody()));

  // custom 404 (Netlify serves /404.html for unknown paths)
  const notFoundBody = `
  <section class="page-hero center" style="min-height:calc(100svh - 92px);display:flex;align-items:center">
    <div class="container">
      <p style="font-family:var(--font-display);font-size:clamp(3.5rem,12vw,7rem);color:var(--green);line-height:1;margin-bottom:1rem">404</p>
      <h1>This page could not be found.</h1>
      <p style="margin-top:1rem">The page you're looking for may have moved or no longer exists.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary btn--lg" href="/">Back to home ${ICON.arrow}</a>
        <a class="btn btn--ghost btn--lg" href="/products/">Browse products</a>
      </div>
    </div>
  </section>`;
  writeFile("404.html", pageShell({
    title: "Page Not Found, KP Packaging",
    desc: "The page you are looking for could not be found.",
    path: "/404/", page: "", noindex: true
  }, notFoundBody));

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
  writeFile("llms-full.txt", llmsFullTxt());
  writeFile("manifest.webmanifest", JSON.stringify({
    name: COMPANY.legal,
    short_name: "KP Packaging",
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
