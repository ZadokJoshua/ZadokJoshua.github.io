(function () {
    "use strict";

    var root = document.documentElement;
    var toggle = document.querySelector(".theme-toggle");

    /* Theme toggle */
    function currentTheme() {
        return root.dataset.theme || "dark";
    }

    function syncToggle() {
        var theme = currentTheme();
        toggle.dataset.mode = theme;
        toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }

    toggle.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try {
            localStorage.setItem("theme", next);
        } catch (e) { /* storage unavailable */ }
        syncToggle();
    });

    syncToggle();
    toggle.hidden = false;
})();
