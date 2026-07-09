(function () {
  'use strict';

  function initPathDrawing() {
    var paths = document.querySelectorAll('#hero-scene .draw-path');
    for (var i = 0; i < paths.length; i++) {
      var length = paths[i].getTotalLength();
      paths[i].style.setProperty('--path-length', length);
      paths[i].style.strokeDasharray = length;
      paths[i].style.strokeDashoffset = length;
    }
  }

  function initReducedMotion() {
    var visual = document.querySelector('.hero-visual');
    if (!visual) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      visual.classList.add('reduced-motion');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPathDrawing();
    initReducedMotion();
  });
})();
