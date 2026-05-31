/* The Ninth Life — site interactions */
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

  /* ---- placeholder form submit ---- */
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
    initDrawer(); initChips(); initForms(); initReveal();
  });
})();
