/* ===========================================================
   K P Packaging - App logic
   =========================================================== */

/* ---------- Icons (inline SVG) ---------- */
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
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"/></svg>'
};

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const productBySlug = (slug) => PRODUCTS.find(p => p.slug === slug);
const industryBySlug = (slug) => INDUSTRIES.find(i => i.slug === slug);

/* ---------- Header ---------- */
function renderHeader(active) {
  const links = [
    ["index.html", "Home", "home"],
    ["about.html", "About", "about"],
    ["products.html", "Products", "products"],
    ["industries.html", "Industries", "industries"],
    ["capabilities.html", "Capabilities", "capabilities"],
    ["contact.html", "Contact", "contact"]
  ];
  const navHTML = links.map(([href, label, key]) =>
    `<a href="${href}" class="${key === active ? "active" : ""}">${label}</a>`
  ).join("");

  const el = $("#site-header");
  el.className = "site-header";
  el.innerHTML = `
    <div class="container nav">
      <a href="index.html" class="brand">
        <span class="mark">KP</span>
        <span>K P Packaging<small>Coated Paper · Mumbai</small></span>
      </a>
      <nav class="nav-links">
        ${navHTML}
        <button class="btn btn--primary" data-quote>Request a Quote</button>
      </nav>
      <div class="nav-cta">
        <button class="btn btn--primary" data-quote>Request a Quote</button>
        <button class="nav-toggle" aria-label="Menu" data-toggle>${ICON.menu}</button>
      </div>
    </div>`;

  $("[data-toggle]", el).addEventListener("click", () => el.classList.toggle("menu-open"));
  // close menu on link click (mobile)
  $$(".nav-links a", el).forEach(a => a.addEventListener("click", () => el.classList.remove("menu-open")));

  // scroll shadow
  const onScroll = () => el.classList.toggle("scrolled", window.scrollY > 8);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Footer ---------- */
function renderFooter() {
  const o = COMPANY.offices;
  const prodLinks = PRODUCTS.slice(0, 6).map(p =>
    `<a href="product.html?p=${p.slug}">${p.name}</a>`).join("");
  $("#site-footer").outerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="index.html" class="brand"><span class="mark">KP</span><span>K P Packaging</span></a>
          <p>A three-decade family business converting and distributing coated papers and flexible packaging for pharma, food and FMCG - in India and 20+ countries.</p>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <a href="about.html">About Us</a>
          <a href="products.html">Products</a>
          <a href="industries.html">Industries</a>
          <a href="capabilities.html">Capabilities</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Products</h4>
          ${prodLinks}
          <a href="products.html">View all &rsaquo;</a>
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
        <span>© <span id="year"></span> K P Packaging Ltd. All rights reserved.</span>
        <span>Mumbai · Silvassa · India</span>
      </div>
    </div>
  </footer>`;
  $("#year").textContent = new Date().getFullYear();
}

/* ---------- Quote Modal ---------- */
function renderModal() {
  const wrap = document.createElement("div");
  wrap.className = "modal-overlay";
  wrap.id = "quote-modal";
  wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-head">
        <div>
          <h3>Request a Quote</h3>
          <p>Tell us what you need - our team replies within one business day.</p>
        </div>
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
              <select name="product" id="modal-product">
                <option value="">General enquiry</option>
                ${PRODUCTS.map(p => `<option value="${p.name}">${p.name}</option>`).join("")}
              </select>
            </div>
            <div class="field"><label>Country</label><input name="country" placeholder="Country"></div>
          </div>
          <div class="field"><label>Message</label><textarea name="message" placeholder="Quantity, specifications, timeline..."></textarea></div>
          <button type="submit" class="btn btn--primary btn--lg" style="width:100%;justify-content:center">Send Inquiry ${ICON.arrow}</button>
          <p class="form-note">By submitting you agree to be contacted about your enquiry.</p>
        </form>
        <div class="form-success" data-success>✓ Thank you - your inquiry has been received. We'll be in touch shortly.</div>
      </div>
    </div>`;
  document.body.appendChild(wrap);

  const close = () => wrap.classList.remove("open");
  wrap.addEventListener("click", e => { if (e.target === wrap || e.target.closest("[data-close]")) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

  const form = $("[data-form]", wrap);
  form.addEventListener("submit", e => {
    e.preventDefault();
    form.style.display = "none";
    $("[data-success]", wrap).style.display = "block";
    setTimeout(() => { close(); form.reset(); form.style.display = "block"; $("[data-success]", wrap).style.display = "none"; }, 2600);
  });
}

function openQuote(product) {
  const m = $("#quote-modal");
  if (product) { const sel = $("#modal-product"); if (sel) sel.value = product; }
  m.classList.add("open");
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-quote]");
  if (t) { e.preventDefault(); openQuote(t.dataset.product || ""); }
});

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));
}

/* ---------- Product card markup ---------- */
function productCard(p) {
  const inds = p.industries.map(s => industryBySlug(s)?.name).filter(Boolean).slice(0, 2);
  return `
  <a class="pcard reveal" href="product.html?p=${p.slug}">
    <div class="pcard-media ${p.art} roll-art">
      <span class="tag">${p.arm === "Distributed" ? "Distributed" : "Manufactured"}</span>
    </div>
    <div class="pcard-body">
      <h3>${p.name}</h3>
      <div class="aka">${p.aka}</div>
      <p>${p.tagline}</p>
      <div class="chips">${inds.map(i => `<span class="chip">${i}</span>`).join("")}</div>
      <span class="link-arrow">View product ${ICON.arrow}</span>
    </div>
  </a>`;
}

/* ---------- Renderers for specific pages ---------- */
function renderFeatured(targetSel, limit) {
  const t = $(targetSel); if (!t) return;
  t.innerHTML = PRODUCTS.filter(p => p.featured).slice(0, limit || 6).map(productCard).join("");
}

function renderClients(targetSel) {
  const t = $(targetSel); if (!t) return;
  t.innerHTML = COMPANY.clients.map(c => `<span>${c}</span>`).join("");
}

/* ---------- Catalogue page ---------- */
function initCatalog() {
  const grid = $("#catalog-grid"); if (!grid) return;
  const state = { industry: null, construction: null, coating: null, fn: null };

  // build filter groups
  const fbox = $("#filters");
  const groupTitles = { industry: "Industry", construction: "Construction", coating: "Coating", fn: "Function" };
  fbox.innerHTML = Object.keys(FILTERS).map(g => `
    <div class="filter-group" data-group="${g}">
      <h4>${groupTitles[g]}</h4>
      <button class="filter-btn active" data-key="">All</button>
      ${FILTERS[g].map(f => `<button class="filter-btn" data-key="${f.key}">${f.label}</button>`).join("")}
    </div>`).join("");

  function matches(p) {
    if (state.industry && !p.industries.includes(state.industry)) return false;
    if (state.construction && p.cats.construction !== state.construction) return false;
    if (state.coating && p.cats.coating !== state.coating) return false;
    if (state.fn && !p.cats.fn.includes(state.fn)) return false;
    return true;
  }
  function draw() {
    const list = PRODUCTS.filter(matches);
    grid.innerHTML = list.map(productCard).join("");
    $("#catalog-count").textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;
    initReveal();
  }

  fbox.addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn"); if (!btn) return;
    const group = btn.closest("[data-group]").dataset.group;
    state[group] = btn.dataset.key || null;
    $$(`[data-group="${group}"] .filter-btn`).forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    draw();
  });

  // pre-filter via ?industry=
  const qp = new URLSearchParams(location.search).get("industry");
  if (qp && FILTERS.industry.some(f => f.key === qp)) {
    state.industry = qp;
    const b = $(`[data-group="industry"] .filter-btn[data-key="${qp}"]`);
    if (b) { $$(`[data-group="industry"] .filter-btn`).forEach(x => x.classList.remove("active")); b.classList.add("active"); }
  }

  // mobile toggle
  const mt = $("#filter-toggle");
  if (mt) mt.addEventListener("click", () => fbox.classList.toggle("open"));

  draw();
}

/* ---------- Product detail page ---------- */
function initProductDetail() {
  const root = $("#product-detail"); if (!root) return;
  const slug = new URLSearchParams(location.search).get("p");
  const p = productBySlug(slug);
  if (!p) { root.innerHTML = `<div class="container section"><h1>Product not found</h1><p class="lead">Browse our <a href="products.html" class="link-arrow">full catalogue</a>.</p></div>`; return; }

  document.title = `${p.name} - K P Packaging`;
  const inds = p.industries.map(s => industryBySlug(s)).filter(Boolean);
  const related = PRODUCTS.filter(x => x.slug !== p.slug && x.industries.some(i => p.industries.includes(i))).slice(0, 3);
  const relFallback = related.length ? related : PRODUCTS.filter(x => x.slug !== p.slug).slice(0, 3);

  const specRows = Object.entries(p.specs || {}).map(([k, v]) =>
    `<tr><td>${k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</td><td>${v}</td></tr>`).join("");

  root.innerHTML = `
    <div class="container">
      <nav class="breadcrumb"><a href="index.html">Home</a> / <a href="products.html">Products</a> / <span>${p.name}</span></nav>
      <div class="pdetail">
        <div class="pdetail-media">
          <div class="pdetail-hero ${p.art} roll-art"></div>
          <div class="pdetail-thumbs">
            <div class="th ${p.art} roll-art"></div>
            <div class="th roll-art"></div>
            <div class="th roll-art--kraft"></div>
          </div>
        </div>
        <div class="pdetail-info">
          <div class="badges">
            <span class="badge badge--green">${p.arm}</span>
            ${p.certs.map(c => `<span class="badge badge--cert">${c}</span>`).join("")}
          </div>
          <h1>${p.name}</h1>
          <div class="aka">${p.aka}</div>
          <p class="desc">${p.desc}</p>
          ${p.construction ? `<div class="construction">🧩&nbsp; Construction: <strong>${p.construction}</strong></div>` : ""}
          <div class="pdetail-actions">
            <button class="btn btn--primary btn--lg" data-quote data-product="${p.name}">Request a Quote ${ICON.arrow}</button>
            <a class="btn btn--ghost btn--lg" href="contact.html">Talk to our team</a>
          </div>

          <div class="spec-block">
            <div class="two-col">
              <div>
                <h3>Applications</h3>
                <ul class="checklist">${p.applications.map(a => `<li>${ICON.check}<span>${a}</span></li>`).join("")}</ul>
              </div>
              <div>
                <h3>Key Properties</h3>
                <ul class="checklist">${p.properties.map(a => `<li>${ICON.check}<span>${a}</span></li>`).join("")}</ul>
              </div>
            </div>
          </div>

          ${specRows ? `<div class="spec-block"><h3>Specifications</h3><table class="spec-table">${specRows}</table></div>` : ""}

          ${(p.variants && p.variants.length) ? `<div class="spec-block"><h3>Variants &amp; Coatings</h3>
            <div class="taglist">${[...p.variants, ...p.coatings].filter(v => v && v !== " - ").map(v => `<span class="chip chip--kraft">${v}</span>`).join("")}</div></div>` : ""}

          ${inds.length ? `<div class="spec-block"><h3>Industries Served</h3>
            <div class="taglist">${inds.map(i => `<a class="chip" href="products.html?industry=${i.slug}">${i.name}</a>`).join("")}</div></div>` : ""}
        </div>
      </div>
    </div>

    <section class="section bg-cream2" style="margin-top:clamp(48px,6vw,90px)">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Related</span><h2>You may also need</h2></div>
        <div class="grid grid-3">${relFallback.map(productCard).join("")}</div>
      </div>
    </section>`;

  initReveal();
}

/* ---------- Industries page ---------- */
function renderIndustries(targetSel) {
  const t = $(targetSel); if (!t) return;
  t.innerHTML = INDUSTRIES.map(i => `
    <a class="industry-card reveal" href="products.html?industry=${i.slug}">
      <div class="ic-media ${i.art} roll-art"></div>
      <div class="ic-body">
        <h3>${i.name}</h3>
        <p>${i.blurb}</p>
      </div>
    </a>`).join("");
}
function renderIndustriesDetailed(targetSel) {
  const t = $(targetSel); if (!t) return;
  t.innerHTML = INDUSTRIES.map((i, idx) => {
    const prods = i.products.map(productBySlug).filter(Boolean);
    return `
    <div class="split ${idx % 2 ? "split--rev" : ""} reveal" style="margin-bottom:clamp(48px,7vw,96px)">
      <div class="split-media ${i.art} roll-art"></div>
      <div class="split-body">
        <span class="eyebrow">${i.name}</span>
        <h2 style="margin-top:1rem">${i.name}</h2>
        <p>${i.detail}</p>
        <div class="taglist" style="margin-bottom:1.4rem">
          ${prods.map(p => `<a class="chip chip--kraft" href="product.html?p=${p.slug}">${p.name}</a>`).join("")}
        </div>
        <a class="btn btn--primary" href="products.html?industry=${i.slug}">View products ${ICON.arrow}</a>
      </div>
    </div>`;
  }).join("");
}

/* ---------- Capabilities page ---------- */
function renderCapabilities(targetSel, detailed) {
  const t = $(targetSel); if (!t) return;
  t.innerHTML = CAPABILITIES.map(c => `
    <div class="fcard reveal">
      <div class="ic">${ICON[c.icon] || ICON.layers}</div>
      <h3>${c.title}</h3>
      <p>${detailed ? c.detail : c.blurb}</p>
    </div>`).join("");
}

/* ---------- Stats ---------- */
function renderStats(targetSel) {
  const t = $(targetSel); if (!t) return;
  t.innerHTML = COMPANY.stats.map(s => `<div class="s"><strong>${s.value}</strong><span>${s.label}</span></div>`).join("");
}

/* ---------- Team ---------- */
function renderTeam(targetSel) {
  const t = $(targetSel); if (!t) return;
  t.innerHTML = COMPANY.team.map(m => `
    <div class="team-card reveal">
      <div class="avatar ${m.art}"></div>
      <h3>${m.name}</h3>
      <div class="role">${m.role}</div>
    </div>`).join("");
}

/* ---------- Certs ---------- */
function renderCerts(targetSel) {
  const t = $(targetSel); if (!t) return;
  t.innerHTML = COMPANY.certs.map(c => `<div class="cert-pill"><span class="dot"></span>${c}</div>`).join("");
}

/* ---------- Contact ---------- */
function renderOffices(targetSel) {
  const t = $(targetSel); if (!t) return;
  t.innerHTML = COMPANY.offices.map(o => `
    <div class="office-card">
      <span class="tag">${o.tag}</span>
      <h3>${o.city}</h3>
      <div class="row">${ICON.pin}<span>${o.address}</span></div>
      <div class="row">${ICON.phone}<a href="tel:${o.phoneRaw}">${o.phone}</a></div>
      <div class="row">${ICON.mail}<a href="mailto:${o.email}">${o.email}</a></div>
    </div>`).join("");
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "";
  if ($("#site-header")) renderHeader(page);
  if ($("#site-footer")) renderFooter();
  renderModal();

  // per-page hooks (each renderer no-ops if its target is absent)
  renderFeatured("#featured-products");
  renderClients("#client-logos");
  renderStats("#stats-strip");
  renderTeam("#team-grid");
  renderCerts("#cert-row");
  renderIndustries("#industries-grid");
  renderIndustriesDetailed("#industries-detailed");
  renderCapabilities("#capabilities-grid", document.body.dataset.page === "capabilities");
  renderOffices("#offices");
  initCatalog();
  initProductDetail();

  // contact form (page)
  const cf = $("#contact-form");
  if (cf) cf.addEventListener("submit", e => {
    e.preventDefault();
    cf.style.display = "none";
    $("#contact-success").style.display = "block";
  });

  initReveal();
});
