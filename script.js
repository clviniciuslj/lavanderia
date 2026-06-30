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
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// Formulário -> WhatsApp
const contatoForm = document.getElementById('contatoForm');
contatoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = contatoForm.nome.value.trim();
  const telefone = contatoForm.telefone.value.trim();
  const mensagem = contatoForm.mensagem.value.trim();

  const texto = `Olá! Meu nome é ${nome} (tel: ${telefone}).\n${mensagem}`;
  const url = `https://wa.me/5524337133199?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
});
