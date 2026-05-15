(() => {
  const stage = document.getElementById('stage');
  const tabs = document.querySelectorAll('.tab');
  const valid = ['home','M','MA','MB','MC','MD','MQ','MG','MI','MJ','MP','PS','PX','M2','MG2','MG3','MG3M','MG3C','MG3CD','MG3CC','MG3CP','MG3CN','MG3K','MG3P','MG3PA','MB2','MV','MV3'];

  const setupPXCarousel = () => {
    const carousel = document.getElementById('px-carousel');
    const pages = document.getElementById('px-pages');
    if (!carousel || !pages) return;
    const cards = carousel.querySelectorAll('.px-card');
    const total = cards.length;
    const update = () => {
      const idx = Math.round(carousel.scrollLeft / (carousel.clientWidth - 40)) + 1;
      pages.textContent = `${Math.min(idx, total)} / ${total}`;
    };
    carousel.addEventListener('scroll', update, { passive: true });
  };

  const setupMG3MTabs = () => {
    const phone = document.querySelector('.phone--MG3M');
    if (!phone) return;
    const tabBtns = phone.querySelectorAll('.mg3m-tab');
    const cards = phone.querySelectorAll('.mg3m-card');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.mg3mFilter || 'all';
        tabBtns.forEach(b => b.classList.toggle('is-on', b === btn));
        cards.forEach(c => {
          const state = c.dataset.mg3mState;
          c.hidden = !(filter === 'all' || state === filter);
        });
      });
    });
  };

  const setupMEThemeToggle = () => {
    const phone = document.querySelector('.phone--ME');
    if (!phone) return;
    const btns = phone.querySelectorAll('.me-theme__btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        phone.dataset.theme = mode;
        btns.forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
      });
    });
  };

const navSelectors = '.m-nav, .ma-nav, .mb-nav, .mc-nav, .md-nav, .mg-nav, .mi-nav, .mj-nav, .mp-nav, .me-nav, .phone__nav, .px-bottom';

const render = (key) => {
    const tpl = document.getElementById(`${key}-template`);
    if (!tpl) return;
    stage.innerHTML = '';
    const dockNav = document.getElementById('dock-nav-slot');
    if (dockNav) {
      dockNav.innerHTML = '';
      dockNav.className = 'dock__nav';
    }
    stage.appendChild(tpl.content.cloneNode(true));
    const phoneSection = stage.querySelector('.phone');
    const phoneNav = stage.querySelector(navSelectors);
    if (phoneNav && dockNav) {
      if (phoneSection) {
        phoneSection.classList.forEach(c => {
          if (c.startsWith('phone--')) dockNav.classList.add(c);
        });
      }
      dockNav.appendChild(phoneNav);
    }
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.tab === key ? 'true' : 'false'));
    if (location.hash !== `#${key}`) history.replaceState(null, '', `#${key}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
    const dockNavLive = document.getElementById('dock-nav-slot');
    [stage, dockNavLive].forEach(root => {
      if (!root) return;
      root.querySelectorAll('[data-tab]').forEach(el => {
        el.addEventListener('click', () => render(el.dataset.tab));
      });
    });
    if (key === 'PX') setupPXCarousel();
    if (key === 'ME' || key === 'MQ') setupMEThemeToggle();
    if (key === 'MG3M') setupMG3MTabs();
    const updateMvCta = () => {
      const phone = stage.querySelector('.phone--MV3');
      if (!phone) return;
      const cta = phone.querySelector('.mv-cta');
      if (!cta) return;
      const wantOn = phone.querySelector('.mv-want__item.is-on');
      const row = phone.querySelector('.mv-pick__row');
      const rowOn = row ? row.querySelector('.mv-chip.is-on') : null;
      const enabled = !!(wantOn && rowOn);
      cta.disabled = !enabled;
      cta.textContent = enabled ? '지금 매칭하기 →' : '모임을 선택해주세요';
    };
    stage.querySelectorAll('.m-ai-tag, .mv-chip, .mv-want__item').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.toggle('is-on');
        updateMvCta();
      });
    });
    updateMvCta();
    stage.querySelectorAll('[data-open-sheet]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const name = btn.dataset.openSheet;
        const sheet = stage.querySelector(`.mg3cd-sheet[data-sheet="${name}"]`);
        if (sheet) { sheet.hidden = false; requestAnimationFrame(() => sheet.classList.add('is-open')); }
      });
    });
    stage.querySelectorAll('[data-close-sheet]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const sheet = el.closest('.mg3cd-sheet');
        if (!sheet) return;
        sheet.classList.remove('is-open');
        setTimeout(() => { sheet.hidden = true; }, 220);
      });
    });
  };

  tabs.forEach(t => t.addEventListener('click', () => render(t.dataset.tab)));
  const initial = (location.hash || '#home').slice(1);
  render(valid.includes(initial) ? initial : 'home');

  const dock = document.getElementById('dock');
  if (dock && 'ResizeObserver' in window) {
    const setDockHeight = () => {
      document.documentElement.style.setProperty('--dock-h', dock.offsetHeight + 'px');
    };
    setDockHeight();
    new ResizeObserver(setDockHeight).observe(dock);
  }
})();
