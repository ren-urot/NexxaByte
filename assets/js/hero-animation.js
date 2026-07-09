(function () {
  'use strict';

  function initHeroVideo() {
    var video = document.querySelector('.hero-video-bg');
    if (!video) return;

    var desktop = window.matchMedia('(min-width: 861px)');
    var started = false;

    function sync() {
      if (desktop.matches) {
        if (!started) {
          video.load();
          started = true;
        }
        video.playbackRate = 0.25;
        video.play().catch(function () {
          /* Autoplay can be blocked by the browser; the dark gradient
             background and scrim already look correct without video. */
        });
      } else {
        video.pause();
      }
    }

    video.addEventListener('loadedmetadata', function () {
      video.playbackRate = 0.25;
    });

    sync();
    desktop.addEventListener('change', sync);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeroVideo();
  });
})();
