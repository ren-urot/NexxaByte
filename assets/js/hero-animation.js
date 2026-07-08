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

  document.addEventListener('DOMContentLoaded', function () {
    initPathDrawing();
  });
})();
