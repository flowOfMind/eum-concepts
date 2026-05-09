(() => {
  const stage = document.getElementById('stage');
  const tabs = document.querySelectorAll('.tab');
  const valid = ['home','M','MA','MB','MC','MD','MQ','MG','MI','MJ','MP','PS','PX','MD2','M2','MG2','MA2','MD6'];

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
    stage.querySelectorAll('[data-tab]').forEach(el => {
      el.addEventListener('click', () => render(el.dataset.tab));
    });
    if (key === 'PX') setupPXCarousel();
    if (key === 'ME' || key === 'MQ') setupMEThemeToggle();
    stage.querySelectorAll('.m-ai-tag').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.toggle('is-on');
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
