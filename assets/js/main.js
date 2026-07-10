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

  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function sync() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    window.addEventListener('scroll', sync, { passive: true });
    sync();
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

    var sentParam = new URLSearchParams(window.location.search).get('sent');
    if (sentParam === '1') {
      status.textContent = 'Thanks! Your message has been sent — we\'ll be in touch soon.';
      status.className = 'form-status success';
      form.reset();
    } else if (sentParam === '0') {
      status.textContent = 'Something went wrong sending your message. Please try again or email us directly.';
      status.className = 'form-status error';
    }
    if (sentParam !== null) {
      history.replaceState(null, '', window.location.pathname);
    }

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

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initHeaderScroll();
    initScrollReveal();
    initContactForm();
  });
})();
