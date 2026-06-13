(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    function setupPlayer(box) {
        var video = box.querySelector("video[data-video]");
        var overlay = box.querySelector(".player-overlay");
        if (!video || !overlay) {
            return;
        }
        var mediaUrl = video.getAttribute("data-video");
        var loaded = false;
        var hlsInstance = null;

        function bindMedia() {
            if (loaded || !mediaUrl) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = mediaUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(mediaUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = mediaUrl;
            }
            loaded = true;
        }

        function playVideo() {
            bindMedia();
            overlay.classList.add("is-hidden");
            video.controls = true;
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        overlay.addEventListener("click", playVideo);
        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    ready(function () {
        document.querySelectorAll("[data-player]").forEach(setupPlayer);
    });
}());
