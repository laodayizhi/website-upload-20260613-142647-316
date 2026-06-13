import { H as Hls } from './hls-vendor.js';

const selectAll = (query, root = document) => Array.from(root.querySelectorAll(query));

function setupMobileNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

function setupHeroCarousel() {
  const carousel = document.querySelector('[data-hero-carousel]');
  if (!carousel) return;
  const slides = selectAll('[data-hero-slide]', carousel);
  const thumbs = selectAll('[data-hero-to]', carousel);
  const prev = carousel.querySelector('[data-hero-prev]');
  const next = carousel.querySelector('[data-hero-next]');
  if (!slides.length) return;
  let index = 0;
  const activate = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, pos) => slide.classList.toggle('is-active', pos === index));
    thumbs.forEach((thumb, pos) => thumb.classList.toggle('is-active', pos === index));
  };
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => activate(Number(thumb.dataset.heroTo || 0)));
  });
  if (prev) prev.addEventListener('click', () => activate(index - 1));
  if (next) next.addEventListener('click', () => activate(index + 1));
  window.setInterval(() => activate(index + 1), 6500);
}

function setupSearch() {
  const input = document.querySelector('[data-search]');
  if (!input) return;
  const cards = selectAll('[data-card]');
  const run = () => {
    const keyword = input.value.trim().toLowerCase();
    cards.forEach((card) => {
      const text = (card.dataset.searchText || card.textContent || '').toLowerCase();
      card.classList.toggle('is-hidden', keyword && !text.includes(keyword));
    });
  };
  input.addEventListener('input', run);
}

function setupChipFilter() {
  const wrap = document.querySelector('[data-chip-filter]');
  if (!wrap) return;
  const buttons = selectAll('[data-chip]', wrap);
  const cards = selectAll('[data-card]');
  let active = '';
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.chip || '';
      active = active === value ? '' : value;
      buttons.forEach((item) => item.classList.toggle('is-active', item.dataset.chip === active));
      cards.forEach((card) => {
        const text = card.dataset.searchText || card.textContent || '';
        card.classList.toggle('is-hidden', active && !text.includes(active));
      });
    });
  });
}

function setupPlayers() {
  selectAll('[data-player]').forEach((shell) => {
    const video = shell.querySelector('video');
    const trigger = shell.querySelector('[data-play-trigger]');
    if (!video || !trigger) return;
    const src = trigger.dataset.video;
    let hls = null;
    let loaded = false;
    const start = () => {
      shell.classList.add('is-playing');
      if (!loaded) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else if (Hls && Hls.isSupported()) {
          hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(src);
          hls.attachMedia(video);
          if (Hls.Events && Hls.Events.MANIFEST_PARSED) {
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              video.play().catch(() => {});
            });
          }
        } else {
          video.src = src;
        }
        loaded = true;
      }
      video.play().catch(() => {});
    };
    trigger.addEventListener('click', start);
    video.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    });
    window.addEventListener('beforeunload', () => {
      if (hls) hls.destroy();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupHeroCarousel();
  setupSearch();
  setupChipFilter();
  setupPlayers();
});
