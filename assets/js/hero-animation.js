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

  function initHeroTitleScramble() {
    var lines = document.querySelectorAll('.hero-title .line');
    if (!lines.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (var i = 0; i < lines.length; i++) {
        lines[i].textContent = lines[i].getAttribute('data-text');
      }
      return;
    }

    var glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01#$%&*+=<>/\\';
    var frameInterval = 40;

    function scrambleLine(line, startDelay) {
      var target = line.getAttribute('data-text');
      var totalFrames = Math.round(target.length * 1.8) + 12;
      var frame = 0;

      setTimeout(function () {
        var timer = setInterval(function () {
          var revealed = Math.floor((frame / totalFrames) * target.length);
          var output = '';

          for (var i = 0; i < target.length; i++) {
            if (target.charAt(i) === ' ') {
              output += ' ';
            } else if (i < revealed) {
              output += target.charAt(i);
            } else {
              output += glyphs.charAt(Math.floor(Math.random() * glyphs.length));
            }
          }

          line.textContent = output;
          frame++;

          if (revealed >= target.length) {
            line.textContent = target;
            clearInterval(timer);
          }
        }, frameInterval);
      }, startDelay);
    }

    for (var i = 0; i < lines.length; i++) {
      scrambleLine(lines[i], i * 350 + 150);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeroVideo();
    initHeroTitleScramble();
  });
})();
