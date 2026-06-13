import { H as Hls } from './hls-vendor-dru42stk.js';

function attachPlayer(video) {
  if (!video) {
    return;
  }

  var source = video.getAttribute('data-src');
  if (!source) {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    return;
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    video._hlsInstance = hls;
  } else {
    video.src = source;
  }
}

function setupPlayButtons() {
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-play-target]'));
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var targetId = button.getAttribute('data-play-target');
      var video = document.getElementById(targetId);
      if (!video) {
        return;
      }
      if (!video.getAttribute('src') && !video._hlsInstance) {
        attachPlayer(video);
      }
      button.classList.add('hidden');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          button.classList.remove('hidden');
        });
      }
    });
  });
}

function preloadVisiblePlayers() {
  var videos = Array.prototype.slice.call(document.querySelectorAll('video[data-src]'));
  videos.forEach(function (video) {
    video.addEventListener('play', function () {
      if (!video.getAttribute('src') && !video._hlsInstance) {
        attachPlayer(video);
      }
    }, { once: true });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    setupPlayButtons();
    preloadVisiblePlayers();
  });
} else {
  setupPlayButtons();
  preloadVisiblePlayers();
}
