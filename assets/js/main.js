/* ============================================================
   CC Computação — JavaScript Principal
   ============================================================ */

'use strict';

// ============================================================
// Navbar: scroll e menu mobile
// ============================================================

const navbar       = document.getElementById('navbar');
const menuToggle   = document.getElementById('menu-toggle');
const mobileMenu   = document.getElementById('mobile-menu');
const mobileLinks  = document.querySelectorAll('.mobile-nav-link');

// Adiciona classe "scrolled" ao navbar quando a página é rolada
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Toggle do menu hamburger
menuToggle.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');

  if (isOpen) {
    fecharMenuMobile();
  } else {
    abrirMenuMobile();
  }
});

function abrirMenuMobile() {
  mobileMenu.classList.remove('hidden');
  menuToggle.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
}

function fecharMenuMobile() {
  mobileMenu.classList.add('hidden');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

// Fecha o menu mobile ao clicar num link
mobileLinks.forEach(link => {
  link.addEventListener('click', fecharMenuMobile);
});

// Fecha o menu mobile ao clicar fora dele
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    fecharMenuMobile();
  }
});

// ============================================================
// Destaque do link ativo na navegação por scroll
// ============================================================

const secoes     = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-link');

const observadorNavegacao = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  rootMargin: '-40% 0px -55% 0px',
  threshold: 0
});

secoes.forEach(secao => observadorNavegacao.observe(secao));

// ============================================================
// Animações de entrada por scroll (IntersectionObserver)
// ============================================================

const observadorAnimacao = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      // Para de observar depois de animar para poupar recursos
      observadorAnimacao.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observadorAnimacao.observe(el);
});

// ============================================================
// Contadores animados
// ============================================================

function animarContador(elemento, valorFinal, duracao = 1500) {
  const inicio = performance.now();

  function atualizar(timestamp) {
    const progresso = Math.min((timestamp - inicio) / duracao, 1);
    // Easing: ease-out
    const eased    = 1 - Math.pow(1 - progresso, 3);
    const valorAtual = Math.round(eased * valorFinal);

    elemento.textContent = valorAtual;

    if (progresso < 1) {
      requestAnimationFrame(atualizar);
    } else {
      elemento.textContent = valorFinal;
    }
  }

  requestAnimationFrame(atualizar);
}

// Observador para os contadores — anima quando ficam visíveis
const contadores = document.querySelectorAll('.counter-number');

const observadorContador = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target, 10);
      animarContador(entry.target, target);
      observadorContador.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

contadores.forEach(contador => observadorContador.observe(contador));

// ============================================================
// Filtro de portfólio
// ============================================================

const filtroBtns    = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filtroBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filtro = btn.dataset.filter;

    // Actualiza botão activo
    filtroBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Mostra/esconde itens com transição suave
    portfolioItems.forEach(item => {
      const categoria = item.dataset.category;
      const visivel   = filtro === 'all' || categoria === filtro;

      if (visivel) {
        item.style.removeProperty('display');
        // Força reflow antes de adicionar classe para a transição funcionar
        requestAnimationFrame(() => {
          item.style.opacity = '1';
          item.style.transform = '';
        });
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  });
});

// ============================================================
// Banner de cookies
// ============================================================

const cookieBanner  = document.getElementById('cookie-banner');
const cookieAccept  = document.getElementById('cookie-accept');
const cookieReject  = document.getElementById('cookie-reject');

const COOKIE_KEY = 'cc_cookie_consent';

function mostrarBannerCookies() {
  const consentimento = localStorage.getItem(COOKIE_KEY);
  if (!consentimento) {
    cookieBanner.hidden = false;
  }
}

function guardarConsentimento(valor) {
  localStorage.setItem(COOKIE_KEY, valor);
  cookieBanner.hidden = true;
}

cookieAccept.addEventListener('click', () => {
  guardarConsentimento('all');
  // Aqui pode activar Google Analytics / Google Ads tags quando necessário
});

cookieReject.addEventListener('click', () => {
  guardarConsentimento('essential');
});

// Mostra o banner com um pequeno delay para não bloquear o carregamento visual
setTimeout(mostrarBannerCookies, 800);
// ============================================================

const formulario  = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-btn');
const btnText     = document.getElementById('btn-text');
const btnLoading  = document.getElementById('btn-loading');
const formSuccess = document.getElementById('form-success');

/**
 * Valida um campo e actualiza a mensagem de erro.
 * @param {HTMLInputElement|HTMLTextAreaElement} campo
 * @returns {boolean} se é válido
 */
function validarCampo(campo) {
  const erroEl = document.getElementById(`${campo.id}-error`);
  const valor  = campo.value.trim();
  let mensagem = '';

  if (!valor) {
    mensagem = 'Este campo é obrigatório.';
  } else if (campo.type === 'email') {
    // Validação de email básica com regex
    const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!reEmail.test(valor)) {
      mensagem = 'Introduza um endereço de email válido.';
    }
  } else if (valor.length < 2) {
    mensagem = 'Mínimo de 2 caracteres.';
  }

  if (erroEl) {
    erroEl.textContent = mensagem;
  }

  campo.classList.toggle('error', !!mensagem);
  return !mensagem;
}

// Valida em tempo real ao sair do campo
formulario.querySelectorAll('[required]').forEach(campo => {
  campo.addEventListener('blur', () => validarCampo(campo));
  campo.addEventListener('input', () => {
    if (campo.classList.contains('error')) {
      validarCampo(campo);
    }
  });
});

// Submit
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Valida todos os campos
  const campos   = formulario.querySelectorAll('[required]');
  let formularioValido = true;

  campos.forEach(campo => {
    if (!validarCampo(campo)) {
      formularioValido = false;
    }
  });

  if (!formularioValido) return;

  // Estado de loading
  btnText.classList.add('hidden');
  btnLoading.classList.remove('hidden');
  submitBtn.disabled = true;

  try {
    // Simula envio (substituir por fetch real quando necessário)
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Sucesso
    formulario.reset();
    formSuccess.classList.remove('hidden');
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Oculta mensagem de sucesso após 6 segundos
    setTimeout(() => {
      formSuccess.classList.add('hidden');
    }, 6000);

  } catch (erro) {
    console.error('Erro ao enviar formulário:', erro);
  } finally {
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    submitBtn.disabled = false;
  }
});
