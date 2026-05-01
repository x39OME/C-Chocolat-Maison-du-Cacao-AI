/* =============================================================
   CHOCOLAT — interactions
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('gone'), 1400);
  });
  // safety
  setTimeout(() => loader && loader.classList.add('gone'), 2500);

  /* ---------- custom cursor ---------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    const animate = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(animate);
    };
    animate();

    // hover state for interactive elements
    const hoverSelectors = 'a, button, .card, .step, .day-card, .journal-card, .filter, .hero__dot, .cart-item, .cart-qty button, .toast__view';
    document.querySelectorAll(hoverSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('hover');
        dot.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('hover');
        dot.classList.remove('hover');
      });
    });

    // text input state
    document.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('text');
        dot.classList.add('text');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('text');
        dot.classList.remove('text');
      });
    });

    // dark sections — switch cursor color
    const darkSections = document.querySelectorAll('.hero, .ticker, .day, .newsletter, .footer');
    const checkDark = () => {
      const cy = my;
      let onDark = false;
      darkSections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (cy >= r.top && cy <= r.bottom) onDark = true;
      });
      ring.classList.toggle('dark', onDark);
      dot.classList.toggle('dark', onDark);
    };
    document.addEventListener('mousemove', checkDark);
    window.addEventListener('scroll', checkDark);
  }

  /* ---------- nav scroll ---------- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  /* ---------- scroll to top ---------- */
  const scrollTop = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 800) scrollTop.classList.add('visible');
    else scrollTop.classList.remove('visible');
  });
  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- collection filter ---------- */
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.card[data-cat]');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(c => {
        if (cat === 'all' || c.dataset.cat === cat) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });

  /* ---------- process slider ---------- */
  const track = document.getElementById('processTrack');
  const prevBtn = document.getElementById('prevStep');
  const nextBtn = document.getElementById('nextStep');
  const progress = document.getElementById('processProgress');

  if (track && prevBtn && nextBtn) {
    const updateProgress = () => {
      const max = track.scrollWidth - track.clientWidth;
      const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
      progress.style.width = `${Math.max(14, pct)}%`;
    };
    const stepWidth = () => {
      const first = track.querySelector('.step');
      if (!first) return 300;
      return first.getBoundingClientRect().width + 30;
    };
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: stepWidth(), behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -stepWidth(), behavior: 'smooth' });
    });
    track.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(
    '.story__copy, .story__visual, .card, .step, .day-card, .journal-card, .press__quote, .visit__copy, .visit__visual, .loc, .display, .section-label'
  );
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 80}ms`;
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- hero carousel ---------- */
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  const heroLead = document.getElementById('heroLead');

  if (slides.length > 0) {
    // rotating lead lines — all about Milano · Italy / The art of & cacao
    const leads = [
      'A Milanese atelier where bean meets craft. Every gelato, every praline, every bar — handmade since 2002 by the same obsessive hands.',
      'Born in Milano, raised on cacao. The art of la dolce vita, poured into every spoon.',
      'Where Italian craft meets single-origin cacao. The art of & cacao, handcrafted in the heart of Milano.',
      'From the ateliers of Milano to the world. Two decades of obsession with one ingredient: cacao.',
      'The art of & cacao — where Milanese patience meets the noblest of beans.',
      'Milano, Italy. The home of la dolce vita. The home of Chocolat.'
    ];

    let current = 0;
    const total = slides.length;

    const goTo = (i) => {
      // fade out lead
      if (heroLead) {
        heroLead.classList.add('is-changing');
        setTimeout(() => {
          heroLead.textContent = leads[i % leads.length];
          heroLead.classList.remove('is-changing');
        }, 500);
      }
      // swap slides
      slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
      current = i;
    };

    // dots click
    dots.forEach((d, i) => {
      d.addEventListener('click', () => {
        goTo(i);
        resetTimer();
      });
    });

    // auto-advance every 2 seconds
    let timer = setInterval(() => goTo((current + 1) % total), 3000);
    const resetTimer = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo((current + 1) % total), 3000);
    };

    // pause when tab not visible (saves CPU)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        timer = setInterval(() => goTo((current + 1) % total), 3000);
      }
    });
  }


  /* ---------- shopping cart ---------- */
  const cart = {
    items: [], // { id, name, cat, price, image, qty }
    el: document.getElementById('cart'),
    overlay: document.getElementById('cartOverlay'),
    countEl: document.getElementById('cartCount'),
    bodyEmpty: document.getElementById('cartEmpty'),
    itemsEl: document.getElementById('cartItems'),
    footEl: document.getElementById('cartFoot'),
    subtotalEl: document.getElementById('cartSubtotal'),
    navBtn: document.getElementById('navCart'),

    fmt(n) {
      return '€ ' + n.toFixed(2).replace('.', ',');
    },

    open() {
      this.el?.classList.add('open');
      this.overlay?.classList.add('open');
      this.el?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    },
    close() {
      this.el?.classList.remove('open');
      this.overlay?.classList.remove('open');
      this.el?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    },

    add(item) {
      const existing = this.items.find(i => i.id === item.id);
      if (existing) {
        existing.qty += 1;
      } else {
        this.items.push({ ...item, qty: 1 });
      }
      this.render();
      this.bumpNav();
    },

    remove(id) {
      this.items = this.items.filter(i => i.id !== id);
      this.render();
    },

    setQty(id, qty) {
      const it = this.items.find(i => i.id === id);
      if (!it) return;
      it.qty = Math.max(0, qty);
      if (it.qty === 0) this.remove(id);
      else this.render();
    },

    bumpNav() {
      if (!this.navBtn) return;
      this.navBtn.classList.remove('bump');
      void this.navBtn.offsetWidth;
      this.navBtn.classList.add('bump');
    },

    totalCount() {
      return this.items.reduce((s, i) => s + i.qty, 0);
    },
    totalPrice() {
      return this.items.reduce((s, i) => s + i.price * i.qty, 0);
    },

    render() {
      const count = this.totalCount();

      if (this.countEl) {
        this.countEl.textContent = count;
        this.countEl.classList.toggle('has-items', count > 0);
      }

      if (count === 0) {
        this.bodyEmpty?.classList.remove('is-hidden');
        this.itemsEl?.classList.add('is-hidden');
        this.footEl?.classList.add('is-hidden');
      } else {
        this.bodyEmpty?.classList.add('is-hidden');
        this.itemsEl?.classList.remove('is-hidden');
        this.footEl?.classList.remove('is-hidden');
      }

      if (this.itemsEl) {
        this.itemsEl.innerHTML = this.items.map(it => `
          <li class="cart-item" data-id="${it.id}">
            <div class="cart-item__img">
              <img src="${it.image}" alt="${it.name}" loading="lazy"/>
            </div>
            <div class="cart-item__info">
              <span class="cart-item__cat">${it.cat}</span>
              <span class="cart-item__name">${it.name}</span>
              <div class="cart-item__bottom">
                <div class="cart-qty">
                  <button class="js-qty-dec" aria-label="Decrease"><i class="fa-solid fa-minus"></i></button>
                  <span>${it.qty}</span>
                  <button class="js-qty-inc" aria-label="Increase"><i class="fa-solid fa-plus"></i></button>
                </div>
                <div>
                  <span class="cart-item__price">${this.fmt(it.price * it.qty)}</span>
                  <button class="cart-item__remove js-remove">remove</button>
                </div>
              </div>
            </div>
          </li>
        `).join('');

        this.itemsEl.querySelectorAll('.cart-item').forEach(li => {
          const id = li.dataset.id;
          li.querySelector('.js-qty-inc')?.addEventListener('click', () => {
            const it = this.items.find(i => i.id === id);
            if (it) this.setQty(id, it.qty + 1);
          });
          li.querySelector('.js-qty-dec')?.addEventListener('click', () => {
            const it = this.items.find(i => i.id === id);
            if (it) this.setQty(id, it.qty - 1);
          });
          li.querySelector('.js-remove')?.addEventListener('click', () => this.remove(id));
        });
      }

      if (this.subtotalEl) {
        this.subtotalEl.textContent = this.fmt(this.totalPrice());
      }
    },
  };

  cart.render();

  document.getElementById('navCart')?.addEventListener('click', () => cart.open());
  document.getElementById('cartClose')?.addEventListener('click', () => cart.close());
  document.getElementById('cartOverlay')?.addEventListener('click', () => cart.close());
  document.getElementById('cartGoShop')?.addEventListener('click', () => {
    cart.close();
    setTimeout(() => {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && cart.el?.classList.contains('open')) cart.close();
  });

  // toast
  const toast = document.getElementById('toast');
  const toastName = document.getElementById('toastName');
  const toastView = document.getElementById('toastView');
  let toastTimer;

  const showToast = (name) => {
    if (!toast) return;
    if (toastName) toastName.textContent = name;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  };

  toastView?.addEventListener('click', () => {
    toast.classList.remove('show');
    cart.open();
  });

  // wire up + buttons on each product card
  document.querySelectorAll('.collection .card').forEach(card => {
    const btn = card.querySelector('.card__btn');
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.preventDefault();
      const name = card.dataset.name;
      const priceStr = card.dataset.price;
      const image = card.dataset.image;
      const cat = card.querySelector('.card__cat')?.textContent.trim() || '';
      if (!name || !priceStr) return;

      const price = parseFloat(priceStr);
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      btn.classList.remove('is-clicked');
      void btn.offsetWidth;
      btn.classList.add('is-clicked');
      setTimeout(() => btn.classList.remove('is-clicked'), 600);

      cart.add({ id, name, cat, price, image });
      showToast(name);
    });
  });


  const burger = document.getElementById('burger');
  if (burger) {
    // build menu overlay once
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu';
    overlay.innerHTML = `
      <button class="mobile-menu__close" aria-label="Close menu">
        <span></span><span></span>
      </button>
      <div class="mobile-menu__inner">
        <a href="#story" data-num="01">Story</a>
        <a href="#collection" data-num="02">Collection</a>
        <a href="#atelier" data-num="03">Atelier</a>
        <a href="#journal" data-num="04">Journal</a>
        <a href="#visit" data-num="05">Visit</a>
        <div class="mobile-menu__foot">
          <span>Milano · Singapore · Jeddah</span>
          <span>Maison du Cacao — est. 2002</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = () => {
      burger.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      overlay.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    overlay.querySelector('.mobile-menu__close').addEventListener('click', close);
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    // ESC key closes the menu
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
  }

});
