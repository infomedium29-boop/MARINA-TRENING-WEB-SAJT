(() => {
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  const intro = qs('.intro');
  if (intro) {
    const seen = sessionStorage.getItem('equilibriumIntroSeen');
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      intro.remove();
    } else {
      sessionStorage.setItem('equilibriumIntroSeen', '1');
      setTimeout(() => intro.classList.add('hidden'), 2250);
      setTimeout(() => intro.remove(), 3100);
    }
  }

  const header = qs('.site-header');
  const mobileSticky = qs('.mobile-sticky');
  const setScrollUi = () => {
    header?.classList.toggle('scrolled', scrollY > 20);
    const menuOpen = document.body.classList.contains('menu-open');
    mobileSticky?.classList.toggle('visible', scrollY > 360 && !menuOpen);
  };
  setScrollUi();
  addEventListener('scroll', setScrollUi, { passive: true });

  const toggle = qs('.nav-toggle');
  const mobileMenu = qs('.mobile-menu');
  const menuLabel = document.documentElement.lang === 'en'
    ? { open: 'Open menu', close: 'Close menu' }
    : { open: 'Otvori izbornik', close: 'Zatvori izbornik' };
  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', menuLabel.open);
    setScrollUi();
  };
  toggle?.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? menuLabel.close : menuLabel.open);
    setScrollUi();
  });
  qsa('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const animatedTargets = qsa('.reveal, .mask-reveal');
  animatedTargets.forEach(el => el.classList.add('will-reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .13 });
  animatedTargets.forEach(el => observer.observe(el));

  qsa('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = qs('.faq-answer', item);
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      answer.style.maxHeight = open ? `${answer.scrollHeight}px` : '0px';
    });
  });

  const cookie = qs('.cookie-banner');
  if (cookie && !localStorage.getItem('equilibriumCookieChoice')) {
    setTimeout(() => cookie.classList.add('show'), 900);
  }
  qsa('[data-cookie-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('equilibriumCookieChoice', btn.dataset.cookieChoice);
      cookie?.classList.remove('show');
    });
  });


  qsa('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
