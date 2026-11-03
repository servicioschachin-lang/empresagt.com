/* Gestión de la galería de plantillas */
import { CONFIG } from './config.js';
import { $, escapeHtml } from './utils.js';

const ICON_MAP = {
  cap: 'graduation-cap',
  barber: 'scissors',
  washer: 'washing-machine',
  seedling: 'seedling',
  glasses: 'wine',
  paw: 'paw-print',
  leaf: 'leaf',
  flask: 'flask',
  truck: 'truck',
  droplet: 'droplet',
  bug: 'bug',
  farm: 'farm',
  store: 'store',
  'shopping-cart': 'shopping-cart',
  package: 'package',
  tag: 'tag',
  box: 'box',
  target: 'target',
  'shopping-bag': 'shopping-bag',
  heart: 'heart',
  utensils: 'utensils'
};

export class Gallery {
  constructor(onViewTemplate) {
    this.onViewTemplate = onViewTemplate;
    this.filtro = '';
    this.index = 0;
    this.autoPlay = null;
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    const q = (this.filtro || '').toLowerCase().trim();
    const lista = q
      ? CONFIG.TEMPLATES.filter(t => (t.nombre || '').toLowerCase().includes(q))
      : CONFIG.TEMPLATES;
    this.lista = lista;

    $('#grid').innerHTML = lista.map((t, i) => {
      const ok = !!t.url;
      const iconName = ICON_MAP[t.icon] || t.icon || 'circle';
      return `<div class="portfolio-card" data-nombre="${escapeHtml(t.nombre)}">
        <article class="neu h-100 d-flex flex-column pb-3">
          <div class="preview neu-in">
            ${ok
              ? `<iframe data-src="${escapeHtml(t.url)}" loading="lazy" tabindex="-1" title="Vista previa de ${escapeHtml(t.nombre)}"></iframe>`
              : `<div class="empty">Sin enlace disponible</div>`
            }
            ${ok ? `<button class="neu-btn btn-float" data-ver="${i}" style="padding:.4rem .8rem;font-size:.85rem">Ver</button>` : ''}
          </div>
           <div class="text-center px-3 mt-3">
             <h3 class="h6 fw-bold m-0">${escapeHtml(t.nombre)} <i data-lucide="${escapeHtml(iconName)}" style="width:16px;height:16px;vertical-align:middle"></i></h3>
           </div>
        </article>
      </div>`;
    }).join('');

    // Carga diferida de iframes para evitar recargas constantes
    const iframes = $('#grid').querySelectorAll('iframe[data-src]');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const f = e.target;
            if (!f.src && f.dataset.src) {
              f.src = f.dataset.src;
            }
            io.unobserve(f);
          }
        });
      }, { rootMargin: '200px' });
      iframes.forEach(f => io.observe(f));
    } else {
      iframes.forEach(f => { if (f.dataset.src) f.src = f.dataset.src; });
    }

    const create = () => {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    };
    create();
    if (!window.lucide) {
      setTimeout(create, 200);
    }
    this.index = 0;
    this.setupCarousel();
  }

  attachEvents() {
    $('#grid').addEventListener('click', (e) => {
      const viewBtn = e.target.closest('[data-ver]');
      if (viewBtn) {
        this.onViewTemplate(this.lista[+viewBtn.dataset.ver]);
      }
    });
    $('#carouselPrev').addEventListener('click', () => this.move(-1));
    $('#carouselNext').addEventListener('click', () => this.move(1));
    const viewport = $('#grid').closest('.carousel-viewport');
    let scrollFrame = null;
    viewport.addEventListener('scroll', () => {
      if (window.innerWidth >= 640) return;
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => this.syncMobileIndex(viewport));
    }, { passive: true });
    window.addEventListener('resize', () => this.updateCarousel());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stopAutoPlay();
      else this.startAutoPlay();
    });
  }

  visibleCards() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  }

  maxIndex() {
    return Math.max(0, this.lista.length - this.visibleCards());
  }

  move(direction) {
    const step = direction > 0 ? 1 : -1;
    const next = this.index + step;
    this.index = next < 0 ? this.maxIndex() : next > this.maxIndex() ? 0 : next;
    this.updateCarousel();
    this.restartAutoPlay();
  }

  setupCarousel() {
    this.updateCarousel();
    this.startAutoPlay();
    requestAnimationFrame(() => this.updateCarousel());
  }

  updateCarousel() {
    const track = $('#grid');
    const cards = [...track.children];
    if (!cards.length) return;

    if (this.index > this.maxIndex()) this.index = this.maxIndex();
    const card = cards[this.index];
    const offset = card.offsetLeft;
    if (window.innerWidth < 640) {
      track.style.transform = 'none';
      const viewport = track.closest('.carousel-viewport');
      viewport.scrollTo({ left: offset, behavior: 'auto' });
    } else {
      track.style.transform = `translate3d(-${offset}px, 0, 0)`;
    }

    cards.forEach((card, i) => {
      const distance = Math.abs(i - this.index);
      card.classList.toggle('carousel-active', i >= this.index && distance < this.visibleCards());
      card.style.setProperty('--card-delay', `${distance * 70}ms`);
    });

    const progress = $('#carouselProgress');
    progress.innerHTML = Array.from({ length: this.maxIndex() + 1 }, (_, i) =>
      `<button type="button" class="${i === this.index ? 'active' : ''}" data-slide="${i}" aria-label="Ir al proyecto ${i + 1}"></button>`
    ).join('');
    progress.querySelectorAll('[data-slide]').forEach(button => {
      button.addEventListener('click', () => {
        this.index = Number(button.dataset.slide);
        this.updateCarousel();
        this.restartAutoPlay();
      });
    });
  }

  syncMobileIndex(viewport) {
    const cards = [...$('#grid').children];
    if (!cards.length) return;
    const closest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft - viewport.scrollLeft);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    if (closest.index !== this.index) {
      this.index = closest.index;
      this.updateCarousel();
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    if (window.innerWidth >= 640 && !document.hidden && this.lista.length > this.visibleCards()) {
      this.autoPlay = window.setInterval(() => this.move(1), 9000);
    }

  }

  stopAutoPlay() {
    if (this.autoPlay) window.clearInterval(this.autoPlay);
    this.autoPlay = null;
  }

  restartAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  filtrar(q) {
    this.filtro = q || '';
    this.render();
  }

  showContinueBox(templateName) {
    const box = $('#continuarBox');
    if (box) box.style.display = 'block';
    const nm = $('#continuarNombre');
    if (nm) nm.textContent = templateName;
  }

  hideContinueBox() {
    const box = $('#continuarBox');
    if (box) box.style.display = 'none';
  }

  show() {
    $('#galeria').style.display = 'block';
  }

  hide() {
    $('#galeria').style.display = 'none';
  }
}
