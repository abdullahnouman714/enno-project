// Init swiper sliders (Testimonials carousel)
function initSwiper() {
  document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
    const config = {
      loop: true,
      speed: 600,
      autoplay: {
        delay: 5000
      },
      slidesPerView: "auto",
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 40
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    };

    new Swiper(swiperElement, config);
  });
}
window.addEventListener("load", initSwiper);

// Initialize AOS (Animate On Scroll) 
window.addEventListener('load', () => {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
});

// Initiate glightbox (portfolio image preview)
// Wrapped in try/catch so a GLightbox load failure doesn't block Isotope below
try {
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  } else {
    console.error('GLightbox library failed to load - check the CDN <script> tag for glightbox.min.js');
  }
} catch (err) {
  console.error('GLightbox init error:', err);
}

// Portfolio Filtering
(function () {
  function initPortfolioFilter() {
    if (typeof jQuery === 'undefined') {
      console.error('jQuery failed to load - check the <script> tag for jquery.min.js');
      return;
    }
    var $ = jQuery;

    $('.isotope-layout').each(function () {
      var $layout = $(this);
      var $items = $layout.find('.isotope-item');

      $layout.find('.isotope-filters li').on('click', function () {
        var $btn = $(this);
        var filterValue = $btn.attr('data-filter'); // e.g. "*", ".filter-app"

        // toggle active class on filter buttons
        $layout.find('.isotope-filters li').removeClass('filter-active');
        $btn.addClass('filter-active');

        if (filterValue === '*' || !filterValue) {
          // show all items
          $items.fadeOut(150, function () {
            $(this).fadeIn(300);
          });
        } else {
          var filterClass = filterValue.replace('.', ''); // "filter-app"
          $items.each(function () {
            var $item = $(this);
            if ($item.hasClass(filterClass)) {
              $item.fadeOut(0, function () {
                $(this).fadeIn(300);
              });
            } else {
              $item.fadeOut(200);
            }
          });
        }

        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      });
    });
  }

  if (typeof jQuery !== 'undefined') {
    jQuery(initPortfolioFilter);
  } else {
    window.addEventListener('load', initPortfolioFilter);
  }
})();

// Custom animated counter 
(function () {
  const counters = document.querySelectorAll('.purecounter');
  let started = false;

  function animateCounter(el) {
    const start = parseInt(el.getAttribute('data-purecounter-start'), 10) || 0;
    const end = parseInt(el.getAttribute('data-purecounter-end'), 10) || 0;
    const duration = (parseFloat(el.getAttribute('data-purecounter-duration')) || 1) * 1000;
    const stepTime = 16; // ~60fps
    const totalSteps = Math.max(Math.round(duration / stepTime), 1);
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      const value = Math.round(start + (end - start) * progress);
      el.textContent = value;
      if (currentStep >= totalSteps) {
        el.textContent = end;
        clearInterval(timer);
      }
    }, stepTime);
  }

  function startCounters() {
    if (started) return;
    started = true;
    counters.forEach(animateCounter);
  }

  const statsSection = document.querySelector('#stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  } else {
    // Fallback if IntersectionObserver isn't available
    startCounters();
  }
})();

(function () {
  "use strict";

  // Apply .scrolled class to body as page scrolls
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') &&
        !selectHeader.classList.contains('sticky-top') &&
        !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }
  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  // Scroll top button
  let scrollTopBtn = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTopBtn) {
      window.scrollY > 100 ? scrollTopBtn.classList.add('active') : scrollTopBtn.classList.remove('active');
    }
  }
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  // Mobile nav toggle
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  // Hide mobile nav on same-page/hash links
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  // Toggle mobile nav dropdowns
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });
})();

/**
 * PHP Email Form Validation (Contact form)*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);
      php_email_form_submit(thisForm, action, formData);
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
      })
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.trim() == 'OK') {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
