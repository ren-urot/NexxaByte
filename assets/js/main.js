(function () {
  'use strict';

  function initNavToggle() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add('is-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    for (var j = 0; j < items.length; j++) {
      observer.observe(items[j]);
    }
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var status = document.getElementById('form-status');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(group, hasError) {
      group.classList.toggle('has-error', hasError);
    }

    form.addEventListener('submit', function (event) {
      var valid = true;
      var requiredFields = form.querySelectorAll('[required]');

      for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        var group = field.closest('.form-group');
        var fieldValid = field.value.trim().length > 0;

        if (field.type === 'email' && fieldValid) {
          fieldValid = emailPattern.test(field.value.trim());
        }

        setError(group, !fieldValid);
        if (!fieldValid) valid = false;
      }

      if (!valid) {
        event.preventDefault();
        status.textContent = 'Please fix the highlighted fields.';
        status.className = 'form-status error';
      } else {
        status.textContent = 'Sending...';
        status.className = 'form-status';
      }
    });
  }

  function initParallax() {
    var hosts = document.querySelectorAll('.parallax-hero, .section-shapes-host');
    var heroVideo = document.querySelector('.hero-video-bg');
    if (!hosts.length && !heroVideo) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var ticking = false;

    function offsetFor(rect) {
      return Math.max(-50, Math.min(50, rect.top * 0.1));
    }

    function update() {
      for (var i = 0; i < hosts.length; i++) {
        hosts[i].style.setProperty('--pattern-offset', offsetFor(hosts[i].getBoundingClientRect()) + 'px');
      }
      if (heroVideo) {
        // Measure the untransformed hero section, not the video itself —
        // the video already carries this same transform, so measuring its
        // own (post-transform) rect would feed back into itself each frame.
        var heroSection = heroVideo.closest('.hero-loop');
        if (heroSection) {
          heroVideo.style.setProperty('--pattern-offset', offsetFor(heroSection.getBoundingClientRect()) + 'px');
        }
      }
      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initScrollReveal();
    initContactForm();
    initParallax();
  });
})();
