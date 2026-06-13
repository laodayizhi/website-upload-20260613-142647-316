(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    setupMobileMenu();
    setupHeroCarousel();
    setupFilters();
    setupQuerySearch();
  });

  function setupMobileMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function setupHeroCarousel() {
    var carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupQuerySearch() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (!q) {
      return;
    }
    var input = document.querySelector('[data-filter-keyword]');
    if (input) {
      input.value = q;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
      var section = panel.parentElement || document;
      var cards = Array.prototype.slice.call(section.querySelectorAll('.search-scope .movie-card'));
      var keyword = panel.querySelector('[data-filter-keyword]');
      var type = panel.querySelector('[data-filter-type]');
      var region = panel.querySelector('[data-filter-region]');
      var year = panel.querySelector('[data-filter-year]');
      var reset = panel.querySelector('[data-filter-reset]');
      var count = panel.querySelector('[data-filter-count]');

      function valueOf(element) {
        return element ? String(element.value || '').trim().toLowerCase() : '';
      }

      function apply() {
        var keywordValue = valueOf(keyword);
        var typeValue = valueOf(type);
        var regionValue = valueOf(region);
        var yearValue = valueOf(year);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = String(card.getAttribute('data-tags') || '').toLowerCase();
          var cardType = String(card.getAttribute('data-type') || '').toLowerCase();
          var cardRegion = String(card.getAttribute('data-region') || '').toLowerCase();
          var cardYear = String(card.getAttribute('data-year') || '').toLowerCase();
          var matched = true;

          if (keywordValue && haystack.indexOf(keywordValue) === -1) {
            matched = false;
          }
          if (typeValue && cardType.indexOf(typeValue) === -1) {
            matched = false;
          }
          if (regionValue && cardRegion.indexOf(regionValue) === -1) {
            matched = false;
          }
          if (yearValue && cardYear.indexOf(yearValue) === -1) {
            matched = false;
          }

          card.classList.toggle('hidden-by-filter', !matched);
          if (matched) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '当前显示 ' + visible + ' / ' + cards.length + ' 部';
        }
      }

      [keyword, type, region, year].forEach(function (input) {
        if (input) {
          input.addEventListener('input', apply);
          input.addEventListener('change', apply);
        }
      });

      if (reset) {
        reset.addEventListener('click', function () {
          [keyword, type, region, year].forEach(function (input) {
            if (input) {
              input.value = '';
            }
          });
          apply();
        });
      }

      apply();
    });
  }
})();
