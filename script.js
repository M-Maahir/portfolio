document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTypingEffect();
  initScrollReveal();
  initCounterAnimation();
  initCursorGlow();
  initContactForm();
  initBackToTop();
  initActiveNavLink();
});

function setActiveNavLink(id) {
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    link.classList.toggle('active', href === `#${id.toLowerCase()}`);
  });
}

function initNavigation() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      const id = href.startsWith('#') ? href.slice(1) : '';
      const target = id
        ? document.getElementById(id) || document.getElementById(id.toLowerCase())
        : null;

      navToggle.classList.remove('open');
      navLinks.classList.remove('open');

      if (!target) return;

      e.preventDefault();
      setActiveNavLink(target.id);
      lockNavHighlight();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${target.id}`);
    });
  });
}

function initTypingEffect() {
  const el = document.getElementById('typedText');
  const phrases = [
    'computer vision pipelines',
    'RAG-powered assistants',
    'deep learning models',
    'scalable AI systems',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 200);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-value');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach(counter => animateCounter(counter));
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const start = performance.now();

    function updateMaahir(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = isDecimal
        ? current.toFixed(3) + suffix
        : Math.floor(current) + suffix;

      if (progress < 1) requestAnimationFrame(updateMaahir);
    }

    requestAnimationFrame(updateMaahir);
  }
}

function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');

  if (window.matchMedia('(pointer: coarse)').matches) {
    glow.style.display = 'none';
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animate);
  }

  animate();
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:maahir.m27@gmail.com?subject=${subject}&body=${body}`;

    note.textContent = 'Opening your email client...';
    form.reset();

    setTimeout(() => {
      note.textContent = '';
    }, 4000);
  });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

let navHighlightLockedUntil = 0;

function lockNavHighlight(ms = 1000) {
  navHighlightLockedUntil = Date.now() + ms;
}

function initActiveNavLink() {
  const sections = [...document.querySelectorAll('section[id], header[id]')];
  const navOffset = () => {
    const nav = document.getElementById('nav');
    return (nav ? nav.offsetHeight : 80) + 8;
  };

  function sectionDocumentTop(section) {
    return section.getBoundingClientRect().top + window.scrollY;
  }

  function updateActiveFromScroll() {
    if (Date.now() < navHighlightLockedUntil) return;

    const y = window.scrollY + Math.max(navOffset(), window.innerHeight * 0.33);
    let current = sections[0];

    sections.forEach(section => {
      if (sectionDocumentTop(section) <= y) current = section;
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }

    if (current) setActiveNavLink(current.id);
  }

  window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
  updateActiveFromScroll();
}

