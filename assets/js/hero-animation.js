(function () {
  'use strict';

  function initHeroVideo() {
    var video = document.querySelector('.hero-video-bg');
    if (!video) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var desktop = window.matchMedia('(min-width: 861px)');
    var started = false;

    function shouldPlay() {
      return desktop.matches && !reducedMotion.matches;
    }

    function sync() {
      if (shouldPlay()) {
        if (!started) {
          video.load();
          started = true;
        }
        video.play().catch(function () {
          /* Autoplay can be blocked by the browser; the dark gradient
             background and scrim already look correct without video. */
        });
      } else {
        video.pause();
      }
    }

    sync();
    desktop.addEventListener('change', sync);
    reducedMotion.addEventListener('change', sync);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeroVideo();
  });
})();
