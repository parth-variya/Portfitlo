/* Premium Portfolio JS */

(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Loader
  const loader = $('#loader');
  if(loader){
    document.body.style.overflow = 'hidden';
  }
  window.addEventListener('load', () => {
    if(!loader) return;
    // Ensure a short premium-feel minimum loading time
    setTimeout(() => {
      loader.classList.add('loader--hide');
      document.body.style.overflow = '';
    }, 700);
  });

  // Fade-in page content (premium feel)
  const pageFade = $('#pageFade');
  if(pageFade){
    requestAnimationFrame(() => pageFade.classList.add('show'));
  }


  // Theme
  const themeBtn = $('#themeBtn');
  const THEME_KEY = 'portfolio-theme';

  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    if(themeBtn){
      themeBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }

  function initTheme(){
    const saved = localStorage.getItem(THEME_KEY);
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = saved || (prefersLight ? 'light' : 'dark');
    applyTheme(theme);
  }

  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  initTheme();

  // Mobile nav
  const ham = $('#hamburgerBtn');
  const drawer = $('#mobileDrawer');
  const closeDrawer = $('#closeDrawer');

  function openDrawer(){ if(drawer) drawer.classList.add('open'); }
  function closeDrawerFn(){ if(drawer) drawer.classList.remove('open'); }

  if(ham && drawer){
    ham.addEventListener('click', openDrawer);
  }
  if(closeDrawer && drawer){
    closeDrawer.addEventListener('click', closeDrawerFn);
  }
  if(drawer){
    drawer.addEventListener('click', (e) => {
      if(e.target === drawer) closeDrawerFn();
    });
  }

  // Back to top
  const backToTop = $('#backToTop');
  function onScroll(){
    if(!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if(backToTop){
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Scroll reveal
  const revealEls = $$('.reveal');
  if(revealEls.length){
    const io = new IntersectionObserver((entries) => {
      for(const e of entries){
        if(e.isIntersecting){
          e.target.classList.add('show');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12 });

    revealEls.forEach(el => io.observe(el));
  }

  // Typing (Home)
  const typingEl = $('#typingText');
  const typingWords = typingEl ? ($('body').dataset.typingWords || '').split('|').filter(Boolean) : [];
  const typingCaret = $('#typingCaret');

  function startTyping(){
    if(!typingEl || !typingWords.length) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeSpeed = 65;
    const deleteSpeed = 35;
    const holdTime = 900;

    const tick = () => {
      const word = typingWords[wordIndex % typingWords.length];
      const current = deleting ? word.slice(0, charIndex - 1) : word.slice(0, charIndex);
      typingEl.textContent = current;

      if(!deleting){
        if(charIndex < word.length){
          charIndex++;
          setTimeout(tick, typeSpeed);
        }else{
          setTimeout(() => { deleting = true; setTimeout(tick, deleteSpeed); }, holdTime);
        }
      }else{
        if(charIndex > 0){
          charIndex--;
          setTimeout(tick, deleteSpeed);
        }else{
          deleting = false;
          wordIndex++;
          setTimeout(tick, 220);
        }
      }
    };

    setTimeout(tick, 450);
  }

  startTyping();

  // Stats counters (Home)
  const counterEls = $$('.stat .num[data-count]');
  if(counterEls.length){
    const io2 = new IntersectionObserver((entries)=>{
      for(const e of entries){
        if(!e.isIntersecting) continue;
        const el = e.target;
        const target = Number(el.getAttribute('data-count') || '0');
        const dur = Number(el.getAttribute('data-duration') || '1200');
        const start = performance.now();

        const animate = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const value = Math.floor(target * t);
          el.textContent = value;
          if(t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        io2.unobserve(el);
      }
    }, { threshold: 0.35 });

    counterEls.forEach(el => io2.observe(el));
  }

  // Projects filter
  const filterWrap = $('#projectFilters');
  const projectCards = $$('.project-card[data-category]');

  if(filterWrap && projectCards.length){
    filterWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if(!btn) return;

      const category = btn.getAttribute('data-filter');

      $$('#projectFilters [data-filter]').forEach(b => b.classList.toggle('active', b === btn));

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        const match = category === 'all' || cardCat === category;
        card.style.display = match ? '' : 'none';
      });
    });
  }

  // Circular progress bars
  const progressBars = $$('.progress .bar[data-percent]');
  if(progressBars.length){
    progressBars.forEach(bar => {
      const percent = Number(bar.getAttribute('data-percent') || '0');
      const r = Number(bar.getAttribute('data-radius') || '45');
      const c = 2 * Math.PI * r;
      bar.parentElement?.setAttribute('data-percent', percent);
      bar.style.strokeDasharray = String(c);
      bar.style.strokeDashoffset = String(c - (c * percent / 100));
    });
  }

  // Skill card hover glow tracking
  $$('.skill-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--x', x + '%');
      card.style.setProperty('--y', y + '%');
    });
  });

  // Profile photo zoom modal (Home)
  const profileBtn = document.querySelector('.profile-photo-btn');
  if(profileBtn){
    const img = profileBtn.querySelector('img');
    const imgSrc = img?.getAttribute('src') || '';

    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="photo-modal__backdrop" data-close></div>
      <div class="photo-modal__content">
        <button class="photo-modal__close" type="button" aria-label="Close">✕</button>
        <img class="photo-modal__img" src="${imgSrc}" alt="Profile photo" />
      </div>
    `;

    document.body.appendChild(modal);

    const open = () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    profileBtn.addEventListener('click', open);
    modal.addEventListener('click', (e) => {
      if(e.target?.closest('[data-close]') || e.target?.closest('.photo-modal__close')) close();
    });
    window.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && modal.classList.contains('open')) close();
    });
  }

  // Custom Cursor
  const cursor = $('#cursor');
  const cursorDot = $('#cursorDot');


  if(cursor && cursorDot){
    let x=0, y=0, dx=0, dy=0;
    const speed = 0.18;

    function move(){
      dx += (x - dx) * speed;
      dy += (y - dy) * speed;
      cursor.style.left = dx + 'px';
      cursor.style.top = dy + 'px';
      cursorDot.style.left = x + 'px';
      cursorDot.style.top = y + 'px';
      requestAnimationFrame(move);
    }
    window.addEventListener('mousemove', (e)=>{
      x = e.clientX;
      y = e.clientY;
      cursor.classList.remove('cursor--hidden');
      cursorDot.classList.remove('cursor--hidden');
    }, { passive:true });

    // Hover states
    const hoverTargets = $$('a, button, .filter-btn, input, textarea, .project-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor--hover');
        cursorDot.classList.add('cursor-dot--hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor--hover');
        cursorDot.classList.remove('cursor-dot--hover');
      });
    });

    move();
  }
})();

