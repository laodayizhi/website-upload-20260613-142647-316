(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    function normalize(value) {
        return (value || "").toString().toLowerCase().replace(/\s+/g, "");
    }

    function setupMobileMenu() {
        var button = document.querySelector("[data-mobile-menu-button]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function applyFilter(value) {
        var keyword = normalize(value);
        var containers = document.querySelectorAll("[data-filterable]");
        containers.forEach(function (container) {
            var cards = container.querySelectorAll("[data-card]");
            var visible = 0;
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var matched = !keyword || text.indexOf(keyword) !== -1;
                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });
            var empty = container.parentElement.querySelector(".filter-empty");
            if (empty) {
                empty.hidden = visible !== 0;
            }
        });
    }

    function setupFilters() {
        var inputs = document.querySelectorAll(".js-card-filter");
        if (!inputs.length) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        inputs.forEach(function (input) {
            if (initial) {
                input.value = initial;
            }
            input.addEventListener("input", function () {
                applyFilter(input.value);
            });
        });
        if (initial) {
            applyFilter(initial);
        }
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5800);
    }

    ready(function () {
        setupMobileMenu();
        setupFilters();
        setupHero();
    });
}());
