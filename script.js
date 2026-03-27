/* ============================================================
   CORBINSOFT — SCRIPTS
   ============================================================ */

// ------ Typed Text ------
const typedEl = document.getElementById('typedText');
if (typedEl) {
  const phrases = [
    'for Design Control',
    'for Requirements Management',
    'for Traceability',
    'for ISO 26262',
    'for Test Management',
    'for CSV / CSA',
    'for Risk Analysis',
  ];
  let phraseIndex = 0, charIndex = 0, isDeleting = false, typedPause = false;

  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  typedEl.after(cursor);

  function type() {
    if (typedPause) return;
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, 38);
    } else {
      typedEl.textContent = current.substring(0, charIndex++);
      if (charIndex > current.length) {
        typedPause = true;
        setTimeout(() => { isDeleting = true; typedPause = false; type(); }, 2200);
        return;
      }
      setTimeout(type, 68);
    }
  }
  type();
}

// ------ Hero Canvas — High-Tech Data Network ------
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ── Brand colours ──
  const C_BLUE  = [29,  159, 213];
  const C_TEAL  = [0,   196, 180];
  const C_SLATE = [61,  90,  128];

  // ── Colour wash orbs — parallax with mouse ──
  const orbs = [
    { xFrac: 0.12, yFrac: 0.10, r: 520, hue: 199, sat: 72, lit: 62, alpha: 0.09 },
    { xFrac: 0.88, yFrac: 0.55, r: 400, hue: 174, sat: 68, lit: 58, alpha: 0.07 },
    { xFrac: 0.50, yFrac: 0.90, r: 340, hue: 210, sat: 60, lit: 65, alpha: 0.06 },
  ];

  // ── Mouse tracking ──
  let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
  let targetMX = mouseX, targetMY = mouseY;
  document.addEventListener('mousemove', e => { targetMX = e.clientX; targetMY = e.clientY; });
  function lerp(a, b, t) { return a + (b - a) * t; }

  // ── Engineering grid ──
  const GRID  = 80;   // cell size px
  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(29,159,213,0.045)';
    ctx.lineWidth = 0.6;
    for (let x = 0; x < canvas.width + GRID; x += GRID) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height + GRID; y += GRID) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    // Crosshair dots at intersections
    ctx.fillStyle = 'rgba(29,159,213,0.08)';
    for (let x = 0; x < canvas.width + GRID; x += GRID) {
      for (let y = 0; y < canvas.height + GRID; y += GRID) {
        ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  // ── Scanner sweep line ──
  let sweepY = -60;
  function drawSweep() {
    sweepY += 0.9;
    if (sweepY > canvas.height + 60) sweepY = -60;
    const g = ctx.createLinearGradient(0, sweepY - 60, 0, sweepY + 60);
    g.addColorStop(0,   'rgba(29,159,213,0)');
    g.addColorStop(0.45,'rgba(29,159,213,0.025)');
    g.addColorStop(0.5, 'rgba(0,196,180,0.05)');
    g.addColorStop(0.55,'rgba(29,159,213,0.025)');
    g.addColorStop(1,   'rgba(29,159,213,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, sweepY - 60, canvas.width, 120);
  }

  // ── Orbs ──
  function drawOrbs() {
    orbs.forEach((orb, i) => {
      const px = orb.xFrac * canvas.width  + (mouseX - canvas.width  / 2) * 0.022 * (i + 1);
      const py = orb.yFrac * canvas.height + (mouseY - canvas.height / 2) * 0.018 * (i + 1);
      const g = ctx.createRadialGradient(px, py, 0, px, py, orb.r);
      g.addColorStop(0, `hsla(${orb.hue},${orb.sat}%,${orb.lit}%,${orb.alpha})`);
      g.addColorStop(1, `hsla(${orb.hue},${orb.sat}%,${orb.lit}%,0)`);
      ctx.beginPath();
      ctx.arc(px, py, orb.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
  }

  // ── Node class ──
  const MAX_DIST      = 160;
  const MOUSE_RADIUS  = 200;
  const MOUSE_REPEL   = 0.045;

  class Node {
    constructor(initial = false) { this.init(initial); this.pingRadius = 0; this.pinging = false; }

    init(initial = false) {
      this.x  = initial ? Math.random() * canvas.width  : (Math.random() < 0.5 ? -8 : canvas.width  + 8);
      this.y  = initial ? Math.random() * canvas.height : Math.random() * canvas.height;
      const angle = Math.random() * Math.PI * 2;
      const spd   = Math.random() * 0.18 + 0.04;
      this.vx = Math.cos(angle) * spd;
      this.vy = Math.sin(angle) * spd;
      this.r  = Math.random() * 2.2 + 0.9;
      this.baseOpacity = Math.random() * 0.28 + 0.12;
      this.opacity     = this.baseOpacity;
      this.colorArr    = Math.random() > 0.55 ? C_BLUE : (Math.random() > 0.5 ? C_TEAL : C_SLATE);
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.pulseSpeed  = Math.random() * 0.018 + 0.007;
    }

    ping() { this.pinging = true; this.pingRadius = 0; }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulseOffset += this.pulseSpeed;

      // Mouse repulsion
      const dmx  = this.x - mouseX;
      const dmy  = this.y - mouseY;
      const md   = Math.sqrt(dmx * dmx + dmy * dmy);
      if (md < MOUSE_RADIUS && md > 0) {
        const strength = (1 - md / MOUSE_RADIUS) * MOUSE_REPEL;
        this.x += (dmx / md) * strength;
        this.y += (dmy / md) * strength;
        this.opacity = Math.min(0.55, this.baseOpacity + (1 - md / MOUSE_RADIUS) * 0.25);
      } else {
        this.opacity += (this.baseOpacity - this.opacity) * 0.05;
      }

      // Ping ring
      if (this.pinging) {
        this.pingRadius += 1.8;
        if (this.pingRadius > 72) { this.pinging = false; this.pingRadius = 0; }
      }

      const pad = 24;
      if (this.x < -pad || this.x > canvas.width + pad || this.y < -pad || this.y > canvas.height + pad) {
        this.init(false);
      }
    }

    draw() {
      const pulse = 1 + 0.38 * Math.sin(this.pulseOffset);
      const r     = this.r * pulse;
      const [rv, gv, bv] = this.colorArr;

      // Soft glow halo
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 5);
      grd.addColorStop(0, `rgba(${rv},${gv},${bv},${this.opacity * 0.35})`);
      grd.addColorStop(1, `rgba(${rv},${gv},${bv},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, r * 5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rv},${gv},${bv},${this.opacity})`;
      ctx.fill();

      // Ping ring
      if (this.pinging) {
        const po = Math.max(0, 0.28 * (1 - this.pingRadius / 72));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.pingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rv},${gv},${bv},${po})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // ── Data packet traveling along an edge ──
  class Packet {
    constructor(a, b) {
      this.a = a; this.b = b;
      this.t = 0;
      this.speed  = 0.0032 + Math.random() * 0.0028;
      this.active = true;
      this.col    = Math.random() > 0.45 ? C_BLUE : C_TEAL;
    }

    update() {
      this.t += this.speed;
      if (this.t >= 1) { this.active = false; this.b.ping(); }
    }

    draw() {
      if (!this.active) return;
      const x  = this.a.x + (this.b.x - this.a.x) * this.t;
      const y  = this.a.y + (this.b.y - this.a.y) * this.t;
      const ts = Math.max(0, this.t - 0.10);
      const tx = this.a.x + (this.b.x - this.a.x) * ts;
      const ty = this.a.y + (this.b.y - this.a.y) * ts;
      const [rv, gv, bv] = this.col;

      // Trail gradient
      const grd = ctx.createLinearGradient(tx, ty, x, y);
      grd.addColorStop(0, `rgba(${rv},${gv},${bv},0)`);
      grd.addColorStop(1, `rgba(${rv},${gv},${bv},0.75)`);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(x, y);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Bright tip
      ctx.beginPath();
      ctx.arc(x, y, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rv},${gv},${bv},0.95)`;
      ctx.fill();

      // Tip glow
      const tgrd = ctx.createRadialGradient(x, y, 0, x, y, 8);
      tgrd.addColorStop(0, `rgba(${rv},${gv},${bv},0.3)`);
      tgrd.addColorStop(1, `rgba(${rv},${gv},${bv},0)`);
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = tgrd;
      ctx.fill();
    }
  }

  // ── Initialise nodes and packets ──
  const nodes   = Array.from({ length: 95 }, () => new Node(true));
  let   packets = [];
  let   liveEdges = [];     // rebuilt each frame
  let   lastPacketSpawn = 0;
  const PACKET_INTERVAL  = 480;   // ms between spawns
  const MAX_PACKETS      = 28;

  // ── Edge drawing — builds liveEdges list for packet spawning ──
  function drawEdges() {
    liveEdges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          liveEdges.push([i, j]);
          const t     = 1 - dist / MAX_DIST;
          const alpha = t * t * 0.12;  // quadratic falloff — denser clusters glow more

          // Gradient edge: blue→teal
          const [ix, iy] = [nodes[i].x, nodes[i].y];
          const [jx, jy] = [nodes[j].x, nodes[j].y];
          const grd = ctx.createLinearGradient(ix, iy, jx, jy);
          grd.addColorStop(0, `rgba(29,159,213,${alpha})`);
          grd.addColorStop(1, `rgba(0,196,180,${alpha})`);
          ctx.beginPath();
          ctx.moveTo(ix, iy);
          ctx.lineTo(jx, jy);
          ctx.strokeStyle = grd;
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  // ── Spawn packets on live edges ──
  function spawnPackets(now) {
    if (now - lastPacketSpawn < PACKET_INTERVAL) return;
    if (packets.length >= MAX_PACKETS || liveEdges.length === 0) return;
    const [i, j] = liveEdges[Math.floor(Math.random() * liveEdges.length)];
    const [a, b] = Math.random() > 0.5 ? [nodes[i], nodes[j]] : [nodes[j], nodes[i]];
    packets.push(new Packet(a, b));
    // Occasionally spawn a second packet on a different edge for burstiness
    if (Math.random() < 0.3 && liveEdges.length > 1 && packets.length < MAX_PACKETS) {
      const [i2, j2] = liveEdges[Math.floor(Math.random() * liveEdges.length)];
      const [a2, b2] = Math.random() > 0.5 ? [nodes[i2], nodes[j2]] : [nodes[j2], nodes[i2]];
      packets.push(new Packet(a2, b2));
    }
    lastPacketSpawn = now;
  }

  // ── Main animation loop ──
  function animate(now = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    mouseX = lerp(mouseX, targetMX, 0.04);
    mouseY = lerp(mouseY, targetMY, 0.04);

    // Layer 1: Grid
    drawGrid();

    // Layer 2: Scanner sweep
    drawSweep();

    // Layer 3: Orbs
    drawOrbs();

    // Layer 4: Edges (builds liveEdges)
    drawEdges();

    // Layer 5: Packets
    spawnPackets(now);
    packets = packets.filter(p => p.active);
    packets.forEach(p => { p.update(); p.draw(); });

    // Layer 6: Nodes (on top of everything)
    nodes.forEach(n => { n.update(); n.draw(); });

    requestAnimationFrame(animate);
  }
  animate();
}

// ------ Nav scroll state ------
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
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

// ------ Counter Animation ------
function animateCounter(el) {
  const target   = parseInt(el.dataset.target);
  const duration = 1800;
  const start    = performance.now();
  function tick(now) {
    const t    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('.stat__num');
if (counterEls.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));
}

// ------ Testimonial Carousel ------
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.testimonials__dots .dot');
if (testimonialCards.length) {
  let currentSlide = 0;
  let autoplay;

  function showSlide(index) {
    testimonialCards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }
  function startAutoplay() {
    autoplay = setInterval(() => {
      showSlide((currentSlide + 1) % testimonialCards.length);
    }, 5500);
  }
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoplay);
      showSlide(parseInt(dot.dataset.index));
      startAutoplay();
    });
  });
  showSlide(0);
  startAutoplay();
}

// ------ Mobile Nav ------
const toggle   = document.getElementById('navToggle');
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
      toggle.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });
}

// ------ Smooth scroll ------
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

// ------ Service card 3-D tilt ------
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -8;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transition = 'box-shadow 0.3s, border-color 0.3s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = '';
  });
});

// ------ Contact form submit ------
const WEB3FORMS_KEY = '66cabd36-4bf0-487c-8b6b-f03e851a6ead'; // ← replace with key from web3forms.com

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;

    // Client-side validation
    const nameVal    = form.querySelector('#name')?.value.trim();
    const emailVal   = form.querySelector('#email')?.value.trim();
    const messageVal = form.querySelector('#message')?.value.trim();
    if (!nameVal || !emailVal || !messageVal) {
      showContactError(form, 'Please fill in your name, email and message.');
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled    = true;

    const payload = {
      access_key:  WEB3FORMS_KEY,
      subject:     `New Corbinsoft Enquiry from ${nameVal}`,
      from_name:   'Corbinsoft Website',
      replyto:     emailVal,
      name:        nameVal,
      email:       emailVal,
      service:     form.querySelector('#service')?.value  || '(not selected)',
      industry:    form.querySelector('#industry')?.value || '(not selected)',
      message:     messageVal,
    };

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        btn.textContent   = '✓ Message Sent';
        btn.style.background = 'linear-gradient(135deg, #0ea5a0, #059669)';
        form.reset();
        setTimeout(() => {
          btn.textContent      = orig;
          btn.disabled         = false;
          btn.style.background = '';
        }, 3500);
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      btn.textContent      = 'Failed — Please try again';
      btn.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
      setTimeout(() => {
        btn.textContent      = orig;
        btn.disabled         = false;
        btn.style.background = '';
      }, 3500);
    }
  });
}

function showContactError(form, msg) {
  let banner = form.querySelector('.contact-error-banner');
  if (!banner) {
    banner = document.createElement('p');
    banner.className = 'contact-error-banner';
    banner.style.cssText = 'color:#f87171;font-size:.875rem;margin-bottom:1rem;';
    form.prepend(banner);
  }
  banner.textContent = msg;
  setTimeout(() => banner.remove(), 5000);
}
