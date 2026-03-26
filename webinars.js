/* ============================================================
   CORBINSOFT — WEBINAR PAGES SCRIPTS
   ============================================================ */

// ------ Nav scroll state ------
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
}

// ------ Mobile Nav ------
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const [b1, b2, b3] = toggle.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    b1.style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
    b2.style.opacity   = isOpen ? '0' : '';
    b3.style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
  });

  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.querySelectorAll('span').forEach(b => {
        b.style.transform = '';
        b.style.opacity = '';
      });
    });
  });
}

// ------ Intersection Observer — Reveal ------
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ------ Webinar Filter (webinars.html) ------
const filterPills = document.querySelectorAll('.filter-pill');
const webinarCards = document.querySelectorAll('.webinar-card');
const noResults = document.getElementById('noResults');

if (filterPills.length && webinarCards.length) {
  let activeFilter = 'all';

  function applyFilter(category) {
    activeFilter = category;

    // Update pill states
    filterPills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.filter === category);
    });

    // Show/hide cards
    let visibleCount = 0;
    webinarCards.forEach(card => {
      const cardCategory = card.dataset.category;
      const show = category === 'all' || cardCategory === category;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    // Show no-results message
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      applyFilter(pill.dataset.filter);
    });
  });

  // No-results reset button
  const resetBtn = document.getElementById('resetFilter');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => applyFilter('all'));
  }
}

// ------ Seats Progress Bar Animation (upcoming-webinars.html) ------
const progressBars = document.querySelectorAll('.seats-bar__fill');

if (progressBars.length) {
  // Capture the target widths from inline styles, then reset to 0 for animation
  progressBars.forEach(bar => {
    const target = bar.style.width || '0%';
    bar.dataset.targetWidth = target;
    bar.style.width = '0%';
  });

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        setTimeout(() => { fill.style.width = fill.dataset.targetWidth; }, 200);
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  progressBars.forEach(bar => barObserver.observe(bar));
}

// ------ Register Buttons → Pre-select session (upcoming-webinars.html) ------
const registerBtns = document.querySelectorAll('[data-session]');
const regForm = document.getElementById('registrationForm');

if (registerBtns.length && regForm) {
  registerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sessionId = btn.dataset.session;

      // Uncheck all session checkboxes first
      regForm.querySelectorAll('input[name="sessions"]').forEach(cb => {
        cb.checked = false;
      });

      // Check the matching one
      const target = regForm.querySelector(`input[name="sessions"][value="${sessionId}"]`);
      if (target) target.checked = true;

      // Smooth scroll to form
      const formSection = document.getElementById('register');
      if (formSection) {
        const top = formSection.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ------ Registration Form Submit (upcoming-webinars.html) ------
const WEB3FORMS_KEY_REG = '66cabd36-4bf0-487c-8b6b-f03e851a6ead'; // ← same key from web3forms.com

const registrationForm = document.getElementById('registrationForm');
const formSuccess = document.getElementById('regSuccess');

if (registrationForm) {
  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation
    const checkedSessions = registrationForm.querySelectorAll('input[name="sessions"]:checked');
    const consentChecked  = registrationForm.querySelector('input[name="consent"]')?.checked;

    if (checkedSessions.length === 0) {
      showFormError('Please select at least one session to register for.');
      return;
    }
    if (!consentChecked) {
      showFormError('Please agree to receive communications to complete your registration.');
      return;
    }

    const submitBtn = registrationForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Submitting…';
      submitBtn.disabled    = true;
    }

    // Collect session labels for the email
    const sessionLabels = Array.from(checkedSessions).map(cb => {
      const labelEl = cb.closest('label')?.querySelector('.check-label strong');
      return labelEl ? labelEl.textContent.trim() : cb.value;
    }).join('\n  • ');

    const fname    = registrationForm.querySelector('#reg-fname')?.value.trim()    || '';
    const lname    = registrationForm.querySelector('#reg-lname')?.value.trim()    || '';
    const emailVal = registrationForm.querySelector('#reg-email')?.value.trim()    || '';
    const phone    = registrationForm.querySelector('#reg-phone')?.value.trim()    || '(not provided)';
    const company  = registrationForm.querySelector('#reg-company')?.value.trim()  || '';
    const jobtitle = registrationForm.querySelector('#reg-jobtitle')?.value.trim() || '(not provided)';
    const industry = registrationForm.querySelector('#reg-industry')?.value        || '(not selected)';

    const payload = {
      access_key: WEB3FORMS_KEY_REG,
      subject:    `Webinar Registration — ${fname} ${lname} (${company})`,
      from_name:  'Corbinsoft Webinars',
      replyto:    emailVal,
      name:       `${fname} ${lname}`,
      email:      emailVal,
      phone,
      company,
      job_title:  jobtitle,
      industry,
      sessions:   `• ${sessionLabels}`,
    };

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        registrationForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Registration form error:', err);
      if (submitBtn) {
        submitBtn.textContent = 'Failed — Please try again';
        submitBtn.disabled    = false;
      }
      showFormError('Something went wrong. Please try again or email us directly.');
    }
  });
}

function showFormError(message) {
  // Remove any existing error
  const existing = document.querySelector('.form__error-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.className = 'form__error-banner';
  banner.textContent = message;

  const firstField = registrationForm.querySelector('.form__row, .form__group');
  if (firstField) {
    registrationForm.insertBefore(banner, firstField);
  } else {
    registrationForm.prepend(banner);
  }

  banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-dismiss
  setTimeout(() => banner.remove(), 5000);
}

// ------ Smooth scroll for anchor links ------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
