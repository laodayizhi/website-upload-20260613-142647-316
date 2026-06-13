(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  function initHero(hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 6200);
    }
  }

  document.querySelectorAll('[data-hero]').forEach(initHero);

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function initFilters(root) {
    var container = root.parentElement;
    var list = container.querySelector('[data-filter-list]');
    if (!list) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-filter-card]'));
    var queryInput = root.querySelector('[data-filter-query]');
    var yearSelect = root.querySelector('[data-filter-year]');
    var regionSelect = root.querySelector('[data-filter-region]');
    var typeSelect = root.querySelector('[data-filter-type]');
    var clearButton = root.querySelector('[data-filter-clear]');
    var empty = container.querySelector('[data-filter-empty]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (queryInput && initialQuery) {
      queryInput.value = initialQuery;
    }

    function apply() {
      var query = normalize(queryInput && queryInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var region = normalize(regionSelect && regionSelect.value);
      var type = normalize(typeSelect && typeSelect.value);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardRegion = normalize(card.getAttribute('data-region'));
        var cardType = normalize(card.getAttribute('data-type'));
        var visible = true;

        if (query && haystack.indexOf(query) === -1) {
          visible = false;
        }
        if (year && cardYear !== year) {
          visible = false;
        }
        if (region && cardRegion !== region) {
          visible = false;
        }
        if (type && cardType !== type) {
          visible = false;
        }

        card.style.display = visible ? '' : 'none';
        if (visible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visibleCount === 0);
      }
    }

    [queryInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        if (queryInput) {
          queryInput.value = '';
        }
        if (yearSelect) {
          yearSelect.value = '';
        }
        if (regionSelect) {
          regionSelect.value = '';
        }
        if (typeSelect) {
          typeSelect.value = '';
        }
        apply();
      });
    }

    apply();
  }

  document.querySelectorAll('[data-filter-root]').forEach(initFilters);

  function initPlayer(player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var stream = player.getAttribute('data-stream');
    var hlsInstance = null;

    if (!video || !stream) {
      return;
    }

    function bindMedia() {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (video.getAttribute('src') !== stream) {
          video.setAttribute('src', stream);
        }
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new window.Hls({
            lowLatencyMode: true,
            backBufferLength: 60
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        }
        return Promise.resolve();
      }

      if (video.getAttribute('src') !== stream) {
        video.setAttribute('src', stream);
      }
      return Promise.resolve();
    }

    function play() {
      bindMedia().then(function () {
        player.classList.add('is-playing');
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            player.classList.remove('is-playing');
          });
        }
      });
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      player.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (video.currentTime === 0 || video.ended) {
        player.classList.remove('is-playing');
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(initPlayer);
})();
