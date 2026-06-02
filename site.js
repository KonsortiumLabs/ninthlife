/* Ninth Life - site interactions */
(function () {
  "use strict";

  /* ---- mobile drawer ---- */
  function initDrawer() {
    var toggle = document.querySelector(".nav-toggle");
    var drawer = document.querySelector(".drawer");
    if (!toggle || !drawer) return;
    var closeEls = drawer.querySelectorAll("[data-close], .drawer-scrim, .drawer-nav a");
    function open() { drawer.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { drawer.classList.remove("open"); document.body.style.overflow = ""; }
    toggle.addEventListener("click", open);
    closeEls.forEach(function (el) { el.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---- interest chips (multi-select) ---- */
  function initChips() {
    document.querySelectorAll(".chip-set").forEach(function (set) {
      set.addEventListener("click", function (e) {
        var chip = e.target.closest(".chip");
        if (!chip) return;
        e.preventDefault();
        if (set.dataset.single === "true") {
          set.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("on"); });
          chip.classList.add("on");
        } else {
          chip.classList.toggle("on");
        }
      });
    });
  }

  /* ---- contact intent from internal links ---- */
  function initContactIntent() {
    var form = document.querySelector("form[aria-label='Waitlist form']");
    if (!form || !window.URLSearchParams) return;
    var params = new URLSearchParams(window.location.search);
    var interest = (params.get("interest") || "").replace(/-/g, " ").toLowerCase();
    var type = params.get("type") || params.get("tier") || "";
    if (!interest && !type) return;

    var aliases = {
      "visit": "visit waitlist",
      "visit waitlist": "join visit waitlist",
      "join visit waitlist": "join visit waitlist",
      "visiting": "join visit waitlist",
      "cafe": "cafe updates",
      "cafe updates": "cafe updates",
      "sponsoring": "sponsor a resident",
      "sponsor": "sponsor a resident",
      "sponsor a resident": "sponsor a resident",
      "sponsor ninth life live": "sponsor ninth life live",
      "local partnership": "bakery partnership",
      "partnership": "bakery partnership",
      "bakery partnership": "bakery partnership",
      "rescue partnership": "rescue/care partner",
      "rescue care partner": "rescue/care partner",
      "helping operate": "help operate",
      "help operate": "help operate",
      "sponsor window seat live": "sponsor the window seat live",
      "sponsor the window seat": "sponsor the window seat live",
      "sponsor the window seat live": "sponsor ninth life live",
      "livestream updates": "general updates",
      "founding breeder partnership": "discuss a founding breeder partnership",
      "breeder partnership": "discuss a founding breeder partnership",
      "breeder partnerships": "discuss a founding breeder partnership",
      "discuss a founding breeder partnership": "discuss a founding breeder partnership",
      "maine coon breeder inquiry": "maine coon breeder inquiry",
      "private visit": "join visit waitlist",
      "schedule a private visit": "join visit waitlist",
      "general updates": "general updates"
    };
    var normalized = aliases[interest] || interest;
    var typeAliases = {
      "bakery": "bakery partnership",
      "drink": "bakery partnership",
      "downtown": "property / space conversation",
      "business": "sponsor a resident",
      "standard": "join visit waitlist",
      "kids": "join visit waitlist",
      "private": "join visit waitlist",
      "founding-supporter": "sponsor a resident"
    };
    var normalizedType = typeAliases[type] || "";

    form.querySelectorAll(".chip").forEach(function (chip) {
      var label = chip.textContent.trim().toLowerCase();
      if (normalized && (label === normalized || label.indexOf(normalized) !== -1 || normalized.indexOf(label) !== -1)) {
        chip.classList.add("on");
      }
      if (normalizedType && label === normalizedType) chip.classList.add("on");
      if (interest === "visit" && label === "join visit waitlist") chip.classList.add("on");
      if (interest === "private visit" && label === "join visit waitlist") chip.classList.add("on");
    });

    var note = form.querySelector("#note");
    if (note && type) {
      note.value = "I am interested in: " + type.replace(/-/g, " ") + ".";
    }
  }

  /* ---- form submit ---- */
  function initForms() {
    document.querySelectorAll("form[data-demo]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = form.querySelector(".form-success");
        if (ok) {
          ok.classList.add("show");
          form.querySelectorAll("input, textarea, select").forEach(function (f) {
            if (f.type !== "submit") f.disabled = true;
          });
          var btn = form.querySelector('button[type="submit"]');
          if (btn) { btn.textContent = btn.getAttribute("data-success-label") || "Added to the list"; btn.disabled = true; btn.style.opacity = ".7"; }
        }
      });
    });
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", function () {
        var open = item.classList.toggle("open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
        a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
      });
    });
    window.addEventListener("resize", function () {
      document.querySelectorAll(".faq-item.open .faq-a").forEach(function (a) {
        a.style.maxHeight = a.scrollHeight + "px";
      });
    }, { passive: true });
  }

  /* ---- reveal on scroll ---- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    function showInView() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      els.forEach(function (el) {
        if (el.classList.contains("in")) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("in");
      });
    }

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });

    // Reveal whatever is on screen right away (covers IO not firing on initial paint)
    showInView();
    window.addEventListener("scroll", showInView, { passive: true });
    window.addEventListener("load", showInView);
    // Safety net: never leave content hidden
    setTimeout(function () { els.forEach(function (el) { el.classList.add("in"); }); }, 1600);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDrawer(); initChips(); initContactIntent(); initForms(); initFaq(); initReveal();
  });
})();
