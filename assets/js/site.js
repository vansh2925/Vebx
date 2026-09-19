(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Mobile navigation ----- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ----- Scroll reveal ----- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ----- Factory video: play only while visible ----- */
  var video = document.querySelector('video[data-lazy-play]');
  if (video && 'IntersectionObserver' in window) {
    if (reduceMotion) {
      video.removeAttribute('autoplay');
    } else {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.2 });
      vio.observe(video);
    }
  }

  /* ----- Catalogue gallery thumbnails ----- */
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var main = gallery.querySelector('[data-gallery-main]');
    var thumbs = gallery.querySelectorAll('.thumb');
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var img = thumb.querySelector('img');
        if (!img || !main) return;
        main.src = img.getAttribute('data-full') || img.src;
        main.alt = img.alt;
        thumbs.forEach(function (t) { t.removeAttribute('aria-current'); });
        thumb.setAttribute('aria-current', 'true');
      });
    });
  });

  /* ----- Product preselect from ?product= deep link ----- */
  var productSelect = document.getElementById('inquiry-product');
  if (productSelect) {
    /* Option values double as the EmailJS template payload, so match by label. */
    var PRODUCT_LABELS = {
      'pg-metric-cable-glands': 'PG & Metric Cable Glands',
      'precision-components': 'Precision Components',
      'automotive-components': 'Automotive Components',
      'electrical-components': 'Electrical Components',
      'other': 'Other / Custom Requirement'
    };
    var slug = new URLSearchParams(window.location.search).get('product');
    if (slug && PRODUCT_LABELS[slug]) {
      productSelect.value = PRODUCT_LABELS[slug];
    }
  }

  /* ----- Footer year ----- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ----- EmailJS inquiry form ----- */
  var form = document.getElementById('inquiry-form');
  if (!form || typeof window.emailjs === 'undefined') return;

  window.emailjs.init('2O8nrGkXaZijvX7Ke');

  var EMAILJS_CONFIG = {
    serviceId: 'service_9slhjzg',
    adminTemplateId: 'template_kv73bvo',
    autoReplyTemplateId: 'template_iwsg4yf'
  };

  var submitBtn = document.getElementById('inquiry-submit-btn');
  var btnText = document.getElementById('btn-text');
  var formStatus = document.getElementById('form-status');

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + (type === 'success' ? 'ok' : 'err');
    if (type === 'success') {
      setTimeout(function () {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 8000);
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    window.emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.adminTemplateId, form)
      .then(function () {
        return window.emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.autoReplyTemplateId, form);
      })
      .then(function () {
        showStatus('Inquiry sent successfully. We will get back to you shortly.', 'success');
        form.reset();
      })
      .catch(function () {
        showStatus('Failed to send inquiry. Please try again or email us directly.', 'error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        btnText.textContent = 'Submit Enquiry';
      });
  });
})();
