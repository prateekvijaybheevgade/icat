/* ========================================
   iCat Infotech — Interactive Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Navigation ──
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navOverlay.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Navbar Scroll Effect ──
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ── Scroll Animations (Intersection Observer) ──
  const fadeElements = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // ── Contact Form with EmailJS ──
  const contactForm = document.getElementById('contactForm');

  // Initialize EmailJS with your public key
  // ⚠️ SETUP REQUIRED: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
  if (typeof emailjs !== 'undefined') {
    emailjs.init('YOUR_PUBLIC_KEY');
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.textContent;

      // Collect form data
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      // Animate button — dispatching
      submitBtn.textContent = 'DISPATCHING...';
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;

      // Email template parameters
      const templateParams = {
        from_name: fullName,
        from_email: email,
        subject: subject,
        message: message,
        to_email: 'prateek.vijay.bheevgade@gmail.com',
        cc_email: 'sunilbhivgade@gmail.com'
      };

      // ⚠️ SETUP REQUIRED: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID'
      //    with your actual EmailJS service ID and template ID.
      //    See the setup guide in emailjs-setup.md
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(() => {
          // Success
          submitBtn.textContent = '✓ MESSAGE SENT';
          submitBtn.style.opacity = '1';
          submitBtn.style.background = '#22c55e';
          contactForm.reset();

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        })
        .catch((error) => {
          // Error
          console.error('EmailJS Error:', error);
          submitBtn.textContent = '✗ SEND FAILED';
          submitBtn.style.opacity = '1';
          submitBtn.style.background = '#ef4444';

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        });
    });
  }

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Counter Animation for Stats ──
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number, .stat-value');
    counters.forEach(counter => {
      const text = counter.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;

      const target = parseInt(match[0]);
      const suffix = text.replace(match[0], '');
      let current = 0;
      const increment = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = current + suffix;
      }, 30);
    });
  };

  // Trigger counter animation when stat elements come into view
  const statElements = document.querySelectorAll('.beyond-stat, .stat-card');
  if (statElements.length > 0 && 'IntersectionObserver' in window) {
    let animated = false;
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters();
          statObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    statElements.forEach(el => statObserver.observe(el));
  }

  // ── Parallax-like effect on cards ──
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // ── Certification card hover glow ──
  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 8px 32px rgba(255, 106, 0, 0.15)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
  });

});
