(function () {
    "use strict";

    var root = document.documentElement;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Theme toggle */
    var toggle = document.querySelector(".theme-toggle");

    function currentTheme() {
        return root.dataset.theme ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }

    function syncToggle() {
        if (!toggle) return;
        var dark = currentTheme() === "dark";
        var icon = toggle.querySelector("i");
        toggle.setAttribute("aria-pressed", String(dark));
        toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        if (icon) icon.className = dark ? "fas fa-sun" : "fas fa-moon";
    }

    if (toggle) {
        syncToggle();
        toggle.addEventListener("click", function () {
            var next = currentTheme() === "dark" ? "light" : "dark";
            root.dataset.theme = next;
            try {
                localStorage.setItem("theme", next);
            } catch (e) { /* storage unavailable */ }
            syncToggle();
        });
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (!root.dataset.theme) syncToggle();
    });

    /* Active section in nav */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
    var sections = navLinks
        .map(function (link) { return document.querySelector(link.getAttribute("href")); })
        .filter(Boolean);

    if (sections.length && "IntersectionObserver" in window) {
        var activeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (link) {
                    if (link.getAttribute("href") === "#" + entry.target.id) {
                        link.setAttribute("aria-current", "true");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        sections.forEach(function (section) { activeObserver.observe(section); });
    }

    /* Scroll reveal */
    var revealables = document.querySelectorAll("[data-reveal]");

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealables.forEach(function (el) { el.classList.add("is-visible"); });
        return;
    }

    var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
})();
