const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Observador de intersecção para animações de entrada
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove('is-active'));
    button.classList.add('is-active');

    portfolioItems.forEach((item) => {
      const itemCategory = item.dataset.category;
      const shouldShow = selectedFilter === 'all' || itemCategory === selectedFilter;
      item.style.display = shouldShow ? 'block' : 'none';
    });
  });
});

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const counter = entry.target;
    const target = Number(counter.dataset.target);
    let current = 0;
    // Divide em ~45 passos para manter a animação fluida e curta.
    const increment = Math.max(1, Math.ceil(target / 45));

    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = String(target);
        return;
      }

      counter.textContent = String(current);
      requestAnimationFrame(updateCounter);
    };

    requestAnimationFrame(updateCounter);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.6 });

counters.forEach((counter) => counterObserver.observe(counter));

const contactForm = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-btn');
const feedback = document.getElementById('form-feedback');
const emailInput = document.getElementById('email');

if (contactForm && submitButton && feedback && emailInput) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const nome = String(formData.get('nome') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const assunto = String(formData.get('assunto') || '').trim();
    const mensagem = String(formData.get('mensagem') || '').trim();

    if (!nome || !email || !assunto || !mensagem) {
      feedback.textContent = 'Por favor, preencha todos os campos.';
      return;
    }

    if (!emailInput.checkValidity()) {
      feedback.textContent = 'Por favor, introduza um email válido.';
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'A enviar...';
    feedback.textContent = '';

    // Simulação de envio; substituir por integração real (API/email) no backend.
    setTimeout(() => {
      feedback.textContent = 'Mensagem enviada com sucesso. Obrigado pelo contacto!';
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar mensagem';
      contactForm.reset();
    }, 800);
  });
}
