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
  const setHeader = () => header?.classList.toggle('scrolled', scrollY > 20);
  setHeader();
  addEventListener('scroll', setHeader, { passive: true });

  const toggle = qs('.nav-toggle');
  const mobileMenu = qs('.mobile-menu');
  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  toggle?.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
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

  const form = qs('#contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const status = qs('.form-status', form);
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      status.style.display = 'block';
      status.textContent = 'Hvala na upitu. Ovo je ogledna verzija forme; prije objave potrebno je unijeti Web3Forms pristupni ključ i stvarnu e-mail adresu vlasnika.';
      form.reset();
    });
  }

  qsa('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
