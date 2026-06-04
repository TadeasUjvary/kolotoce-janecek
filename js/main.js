/* Kolotoče Janeček — interakce webu */
(function () {
  "use strict";

  /* ---- Header: stín po odscrollování ---- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 30);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobilní menu ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Reveal při scrollu ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Lightbox galerie ---- */
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lb]"));
  if (triggers.length) {
    // seskupení podle data-group
    var groups = {};
    triggers.forEach(function (el) {
      var g = el.getAttribute("data-group") || "default";
      (groups[g] = groups[g] || []).push(el);
    });

    var lb = document.createElement("div");
    lb.className = "lb";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Prohlížeč fotografií");
    lb.innerHTML =
      '<div class="lb__count"></div>' +
      '<button class="lb__btn lb__close" aria-label="Zavřít (Esc)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lb__btn lb__prev" aria-label="Předchozí"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button class="lb__btn lb__next" aria-label="Další"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<img class="lb__img" alt="">' +
      '<div class="lb__cap"></div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector(".lb__img");
    var lbCap = lb.querySelector(".lb__cap");
    var lbCount = lb.querySelector(".lb__count");
    var current = []; // aktuální skupina (pole elementů)
    var idx = 0;
    var lastFocus = null;

    function srcOf(el) { var i = el.querySelector("img"); return el.getAttribute("data-full") || (i ? i.currentSrc || i.src : ""); }
    function capOf(el) { var i = el.querySelector("img"); return el.getAttribute("data-cap") || (i ? i.alt : ""); }

    function show(i) {
      idx = (i + current.length) % current.length;
      var el = current[idx];
      lbImg.src = srcOf(el);
      lbImg.alt = capOf(el);
      lbCap.textContent = capOf(el);
      lbCount.textContent = (idx + 1) + " / " + current.length;
      var multi = current.length > 1;
      lb.querySelector(".lb__prev").style.display = multi ? "" : "none";
      lb.querySelector(".lb__next").style.display = multi ? "" : "none";
    }
    function open(group, i) {
      current = groups[group] || [];
      if (!current.length) return;
      lastFocus = document.activeElement;
      show(i);
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      lb.querySelector(".lb__close").focus();
    }
    function close() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
      lbImg.src = "";
      if (lastFocus) lastFocus.focus();
    }

    triggers.forEach(function (el) {
      el.style.cursor = "zoom-in";
      var g = el.getAttribute("data-group") || "default";
      var openHandler = function (e) {
        e.preventDefault();
        open(g, groups[g].indexOf(el));
      };
      el.addEventListener("click", openHandler);
      // přístupnost z klávesnice
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") openHandler(e);
      });
    });

    lb.querySelector(".lb__close").addEventListener("click", close);
    lb.querySelector(".lb__next").addEventListener("click", function () { show(idx + 1); });
    lb.querySelector(".lb__prev").addEventListener("click", function () { show(idx - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(idx + 1);
      else if (e.key === "ArrowLeft") show(idx - 1);
    });

    // swipe na mobilu
    var sx = 0;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---- Rok v patičce ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
