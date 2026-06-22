/* ===========================================================
   K P Packaging - interactions only (content is pre-rendered)
   =========================================================== */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Header: mobile menu + scroll shadow ---------- */
  var header = $(".site-header");
  if (header) {
    var toggle = $("[data-toggle]", header);
    if (toggle) toggle.addEventListener("click", function () { header.classList.toggle("menu-open"); });
    $$(".nav-links a", header).forEach(function (a) {
      a.addEventListener("click", function () { header.classList.remove("menu-open"); });
    });
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Quote modal ---------- */
  var modal = $("#quote-modal");
  function openQuote(product) {
    if (!modal) return;
    if (product) { var sel = $("#modal-product", modal); if (sel) sel.value = product; }
    modal.classList.add("open");
  }
  function closeQuote() { if (modal) modal.classList.remove("open"); }

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-quote]") : null;
    if (t) { e.preventDefault(); openQuote(t.getAttribute("data-product") || ""); }
  });
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal || (e.target.closest && e.target.closest("[data-close]"))) closeQuote();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeQuote(); });
    var mform = $("[data-form]", modal);
    if (mform) mform.addEventListener("submit", function (e) {
      e.preventDefault();
      submitForm(mform).then(function () {
        mform.style.display = "none";
        var ok = $("[data-success]", modal); if (ok) ok.style.display = "block";
        setTimeout(function () {
          closeQuote(); mform.reset(); mform.style.display = "block";
          if (ok) ok.style.display = "none";
        }, 2600);
      });
    });
  }

  /* ---------- Contact page form ---------- */
  var cf = $("#contact-form");
  if (cf) cf.addEventListener("submit", function (e) {
    e.preventDefault();
    submitForm(cf).then(function () {
      cf.style.display = "none";
      var ok = $("#contact-success"); if (ok) ok.style.display = "block";
    });
  });

  /* POST form data to Netlify Forms (always resolves so the UI still confirms) */
  function submitForm(form) {
    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function () {}).catch(function () {});
  }

  /* ---------- Catalogue filtering (pre-rendered cards) ---------- */
  var filters = $("#filters");
  var grid = $("#catalog-grid");
  if (filters && grid) {
    var state = { industry: "", construction: "", coating: "", fn: "" };
    var countEl = $("#catalog-count");

    // empty-state message
    var emptyEl = document.createElement("p");
    emptyEl.className = "catalog-empty";
    emptyEl.textContent = "No products match these filters.";
    emptyEl.hidden = true;
    grid.parentNode.insertBefore(emptyEl, grid.nextSibling);

    function tokens(card, group) { return (card.getAttribute("data-" + group) || "").split(" ").filter(Boolean); }
    function matches(card) {
      for (var g in state) {
        if (!state[g]) continue;
        if (tokens(card, g).indexOf(state[g]) === -1) return false;
      }
      return true;
    }
    var allCards = $$(".pcard", grid);
    // how many products match the current filters from every group EXCEPT `group`, plus `key` in `group`
    function optionCount(group, key) {
      return allCards.filter(function (card) {
        for (var g in state) {
          if (g === group || !state[g]) continue;
          if (tokens(card, g).indexOf(state[g]) === -1) return false;
        }
        return tokens(card, group).indexOf(key) !== -1;
      }).length;
    }
    // hide filter options that would give zero results
    function updateFacets() {
      $$(".filter-group", filters).forEach(function (fg) {
        var group = fg.getAttribute("data-group");
        $$(".filter-btn", fg).forEach(function (btn) {
          var key = btn.getAttribute("data-key");
          if (!key) return; // always keep "All"
          btn.hidden = optionCount(group, key) === 0;
        });
      });
    }
    function draw() {
      var shown = 0;
      allCards.forEach(function (card) {
        var ok = matches(card);
        card.hidden = !ok;
        if (ok) { card.classList.add("in"); shown++; } // ensure filtered-in cards are visible (not stuck at reveal opacity:0)
      });
      if (countEl) countEl.textContent = shown + (shown === 1 ? " product" : " products");
      emptyEl.hidden = shown !== 0;
      updateFacets();
    }

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn"); if (!btn) return;
      var group = btn.closest("[data-group]").getAttribute("data-group");
      state[group] = btn.getAttribute("data-key") || "";
      $$('[data-group="' + group + '"] .filter-btn', filters).forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      // auto-close any open product drawer when the filter changes
      var cw = document.getElementById("catalog-wrap");
      if (cw && cw.classList.contains("drawer-open")) {
        cw.classList.remove("drawer-open");
        document.documentElement.classList.remove("drawer-lock");
        var bd = document.querySelector(".drawer-backdrop"); if (bd) bd.hidden = true;
        $$("#catalog-grid .pcard.is-active").forEach(function (c) { c.classList.remove("is-active"); });
      }
      draw();
    });

    // pre-filter via ?industry=
    var qp = new URLSearchParams(location.search).get("industry");
    if (qp) {
      var b = $('[data-group="industry"] .filter-btn[data-key="' + qp + '"]', filters);
      if (b) {
        state.industry = qp;
        $$('[data-group="industry"] .filter-btn', filters).forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
      }
    }

    var mt = $("#filter-toggle");
    if (mt) mt.addEventListener("click", function () { filters.classList.toggle("open"); });

    draw();
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Smooth momentum scrolling (Lenis) ---------- */
  if (window.Lenis && !reduceMotion && !(window.matchMedia && window.matchMedia("(hover: none)").matches)) {
    var lenis = new window.Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    function rafLoop(time) { lenis.raf(time); requestAnimationFrame(rafLoop); }
    requestAnimationFrame(rafLoop);
    // keep anchor links smooth via Lenis
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (a && a.getAttribute("href").length > 1) {
        var tgt = document.querySelector(a.getAttribute("href"));
        if (tgt) { e.preventDefault(); lenis.scrollTo(tgt, { offset: -80 }); }
      }
    });
  }

  /* ---------- Reveal on scroll (with stagger) ---------- */
  var reveals = $$(".reveal");
  // stagger siblings within the same parent for a cascade effect
  reveals.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.classList && c.classList.contains("reveal");
    });
    var idx = sibs.indexOf(el);
    if (idx > 0) el.style.transitionDelay = Math.min(idx, 7) * 70 + "ms";
  });
  if (reveals.length && "IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Scroll progress bar ---------- */
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  function progress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
  }
  progress();
  window.addEventListener("scroll", progress, { passive: true });
  window.addEventListener("resize", progress, { passive: true });

  /* ---------- Product slide-in drawer (squeezes the grid) ---------- */
  var cwrap = $("#catalog-wrap");
  var drawer = $("#product-drawer");
  var cgrid = $("#catalog-grid");
  if (cwrap && drawer && cgrid) {
    var backdrop = $(".drawer-backdrop");
    function setActive(slug) {
      $$("#catalog-grid .pcard").forEach(function (c) {
        c.classList.toggle("is-active", c.getAttribute("data-slug") === slug);
      });
    }
    function openDrawer(slug) {
      var tpl = document.getElementById("pd-" + slug);
      if (!tpl) return false;
      drawer.innerHTML = "";
      drawer.appendChild(tpl.content.cloneNode(true));
      cwrap.classList.add("drawer-open");
      document.documentElement.classList.add("drawer-lock");
      drawer.setAttribute("aria-hidden", "false");
      if (backdrop) backdrop.hidden = false;
      drawer.scrollTop = 0;
      setActive(slug);
      return true;
    }
    function closeDrawer() {
      cwrap.classList.remove("drawer-open");
      document.documentElement.classList.remove("drawer-lock");
      drawer.setAttribute("aria-hidden", "true");
      if (backdrop) backdrop.hidden = true;
      setActive(null);
    }
    cgrid.addEventListener("click", function (e) {
      var card = e.target.closest(".pcard");
      if (!card) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // allow open-in-new-tab
      e.preventDefault();
      openDrawer(card.getAttribute("data-slug"));
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("[data-drawer-close]")) closeDrawer();
    });
    if (backdrop) backdrop.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
  }

  /* ---------- "Flex window" tilt on mouse move ---------- */
  if (!reduceMotion && !(window.matchMedia && window.matchMedia("(hover: none)").matches)) {
    $$("[data-tilt]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(1000px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg)";
        el.style.boxShadow = "0 28px 60px rgba(28,28,43,.20)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; el.style.boxShadow = ""; });
    });
  }
})();
