document.getElementById('year').textContent = new Date().getFullYear();

// Menu mobile
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', false);
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// Carrossel "Atendemos" (loop infinito)
const carousel = document.getElementById('carousel');
const track = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('carouselDots');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

const realSlides = Array.from(track.children);
const total = realSlides.length;

// Clona o primeiro e o último slide para criar o efeito de loop infinito
const firstClone = realSlides[0].cloneNode(true);
const lastClone = realSlides[total - 1].cloneNode(true);
track.appendChild(firstClone);
track.insertBefore(lastClone, realSlides[0]);

const slides = Array.from(track.children); // [lastClone, ...real, firstClone]
let activeIndex = 1; // começa no primeiro slide real
let autoplayId = null;
let isJumping = false;

realSlides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot';
  dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
  dot.addEventListener('click', () => { goTo(i + 1); restartAutoplay(); });
  dotsWrap.appendChild(dot);
});

const dots = Array.from(dotsWrap.children);

function render(withTransition = true) {
  track.style.transition = withTransition ? 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)' : 'none';

  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === activeIndex));
  const realIndex = (activeIndex - 1 + total) % total;
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === realIndex));

  const slide = slides[activeIndex];
  const viewportWidth = track.parentElement.offsetWidth;
  const offset = slide.offsetLeft - (viewportWidth - slide.offsetWidth) / 2;
  track.style.transform = `translateX(${-offset}px)`;
}

function goTo(index) {
  if (isJumping) return;
  activeIndex = index;
  render(true);
}

function next() { goTo(activeIndex + 1); }
function prev() { goTo(activeIndex - 1); }

track.addEventListener('transitionend', () => {
  if (activeIndex === slides.length - 1) {
    isJumping = true;
    activeIndex = 1;
    render(false);
    requestAnimationFrame(() => { isJumping = false; });
  } else if (activeIndex === 0) {
    isJumping = true;
    activeIndex = total;
    render(false);
    requestAnimationFrame(() => { isJumping = false; });
  }
});

function startAutoplay() {
  stopAutoplay();
  autoplayId = setInterval(next, 4000);
}

function stopAutoplay() {
  if (autoplayId) clearInterval(autoplayId);
}

function restartAutoplay() { startAutoplay(); }

nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });
carousel.addEventListener('mouseenter', stopAutoplay);
carousel.addEventListener('mouseleave', startAutoplay);
window.addEventListener('resize', () => render(false));

// Arrastar/deslizar (swipe) no carrossel de fotos
const viewport = track.parentElement;
let dragging = false;
let dragStartX = 0;
let dragBaseX = 0;

function currentTranslateX() {
  const matrix = new DOMMatrixReadOnly(window.getComputedStyle(track).transform);
  return matrix.m41;
}

viewport.addEventListener('pointerdown', (e) => {
  dragging = true;
  dragStartX = e.clientX;
  dragBaseX = currentTranslateX();
  stopAutoplay();
  track.style.transition = 'none';
  track.classList.add('is-dragging');
  viewport.setPointerCapture(e.pointerId);
});

viewport.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const delta = e.clientX - dragStartX;
  track.style.transform = `translateX(${dragBaseX + delta}px)`;
});

function endDrag(e) {
  if (!dragging) return;
  dragging = false;
  track.classList.remove('is-dragging');
  const delta = e.clientX - dragStartX;
  if (Math.abs(delta) > 40) {
    delta < 0 ? next() : prev();
  } else {
    render(true);
  }
  startAutoplay();
}

viewport.addEventListener('pointerup', endDrag);
viewport.addEventListener('pointercancel', endDrag);

render(false);
startAutoplay();

// Carrosséis de cards (Diferenciais e Preços) com setas + arraste nativo
document.querySelectorAll('.carousel-cards').forEach((el) => {
  const scrollTrack = el.querySelector('.carousel-track-scroll');
  const prev = el.querySelector('.carousel-prev');
  const next = el.querySelector('.carousel-next');

  function scrollAmount() {
    const card = scrollTrack.firstElementChild;
    const gap = parseFloat(window.getComputedStyle(scrollTrack).gap) || 20;
    return card.getBoundingClientRect().width + gap;
  }

  prev.addEventListener('click', () => scrollTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  next.addEventListener('click', () => scrollTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
});

// Formulário -> WhatsApp
const contatoForm = document.getElementById('contatoForm');
contatoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = contatoForm.nome.value.trim();
  const telefone = contatoForm.telefone.value.trim();
  const mensagem = contatoForm.mensagem.value.trim();

  const texto = `Olá! Meu nome é ${nome} (tel: ${telefone}).\n${mensagem}`;
  const url = `https://wa.me/552433713199?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
});
