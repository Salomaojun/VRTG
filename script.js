// ============================================================
// VRTIGO - SCRIPT COMPLETO COM SISTEMA "VER MAIS" - CORRIGIDO
// ============================================================

// ============================================================
// VARIÁVEIS GLOBAIS
// ============================================================
const WHATSAPP_NUMBER = "918897319841";
let viewMoreButton = null;
let showingAllProducts = false;

// Função para gerar placeholders coloridos por categoria
function getPlaceholderImage(productName, category) {
  const colorMap = {
    'basica': '333333',      // Preto
    'logo': '6A0DAD',        // Roxo
    'minimal': 'FFFFFF',     // Branco  
    'colorida': '2196F3',    // Azul
    'urbana': '9E9E9E',      // Cinza
    'militar': '4CAF50',     // Verde
    'exclusiva': 'FF9800'    // Laranja
  };
  
  const color = colorMap[category] || '673AB7';
  const textColor = category === 'basica' || category === 'militar' ? 'FFFFFF' : '000000';
  const shortName = productName.replace('Camiseta ', '').substring(0, 15);
  
  return `https://via.placeholder.com/400x500/${color}/${textColor}?text=${encodeURIComponent(shortName)}`;
}

// ============================================================
// DADOS DOS PRODUTOS (10 PRODUTOS COM PLACEHOLDERS)
// ============================================================
const produtosVRTIGO = [
  {
    id: 1,
    name: "Camiseta Preta Básica",
    price: "129",
    img: "imagens/preta.jpg",
    placeholder: getPlaceholderImage("Camiseta Preta Básica", "basica"),
    desc: "Camiseta preta oversized básica, 100% algodão premium. Versátil para qualquer ocasião.",
    shortDesc: "Essencial no guarda-roupa",
    category: "basica"
  },
  {
    id: 2,
    name: "Camiseta Preta Logo VRTIGO",
    price: "139",
    img: "imagens/NHATSAVE.png",
    placeholder: getPlaceholderImage("Camiseta Preta Logo", "logo"),
    desc: "Camiseta preta oversized com logo bordado VRTIGO. Estilo streetwear com identidade.",
    shortDesc: "Logo bordado premium",
    category: "logo"
  },
  {
    id: 3,
    name: "Camiseta Branca Premium",
    price: "125",
    img: "imagens/branca.png",
    placeholder: getPlaceholderImage("Camiseta Branca", "minimal"),
    desc: "Camiseta branca oversized premium, tecido leve e respiravel. Perfeita para dias quentes.",
    shortDesc: "Fresh & clean style",
    category: "basica"
  },
  {
    id: 4,
    name: "Camiseta Branca Minimal",
    price: "135",
    img: "imagens/foto.png",
    placeholder: getPlaceholderImage("Camiseta Branca Minimal", "minimal"),
    desc: "Camiseta branca oversized com detalhe minimalista. Elegância no simplismo.",
    shortDesc: "Minimalista e elegante",
    category: "minimal"
  },
  {
    id: 5,
    name: "Camiseta Azul Vibrante",
    price: "135",
    img: "imagens/azul.png",
    placeholder: getPlaceholderImage("Camiseta Azul", "colorida"),
    desc: "Camiseta azul oversized vibrante. Destaque-se com essa cor que chama atenção.",
    shortDesc: "Cor que impressiona",
    category: "colorida"
  },
  {
    id: 6,
    name: "Camiseta Cinza Urbana",
    price: "130",
    img: "imagens/cinzenta.png",
    placeholder: getPlaceholderImage("Camiseta Cinza", "urbana"),
    desc: "Camiseta cinza oversized urbana. O tom perfeito para looks casuais e estilosos.",
    shortDesc: "Urbana e moderna",
    category: "urbana"
  },
  {
    id: 7,
    name: "Camiseta Verde Militar",
    price: "140",
    img: "imagens/cor-da-terra.png",
    placeholder: getPlaceholderImage("Camiseta Verde Militar", "militar"),
    desc: "Camiseta verde militar oversized. Tendência streetwear com atitude.",
    shortDesc: "Estilo militar chic",
    category: "militar"
  },
  {
    id: 8,
    name: "Camiseta Vermelha Ousada",
    price: "145",
    img: "imagens/VIRTIGo.png",
    placeholder: getPlaceholderImage("Camiseta Vermelha", "colorida"),
    desc: "Camiseta vermelha oversized ousada. Para quem não tem medo de se destacar.",
    shortDesc: "Ousadia e personalidade",
    category: "colorida"
  },
  {
    id: 9,
    name: "Camiseta Amarela Solar",
    price: "140",
    img: "imagens/amarela.jpg",
    placeholder: getPlaceholderImage("Camiseta Amarela", "colorida"),
    desc: "Camiseta amarela oversized solar. Energia e positividade em forma de roupa.",
    shortDesc: "Energia e estilo",
    category: "colorida"
  },
  {
    id: 10,
    name: "Camiseta Color Block",
    price: "150",
    img: "imagens/color-block.jpg",
    placeholder: getPlaceholderImage("Camiseta Color Block", "exclusiva"),
    desc: "Camiseta oversized color block com combinação exclusiva. Design único VRTIGO.",
    shortDesc: "Design exclusivo",
    category: "exclusiva"
  }
];

let savedProducts = (() => {
  try {
    return JSON.parse(localStorage.getItem("vrtigoSaves")) || [];
  } catch (e) {
    console.error("Erro ao carregar dados do localStorage:", e);
    return [];
  }
})();

// ============================================================
// SISTEMA "VER MAIS" RESPONSIVO
// ============================================================
function getInitialProductCount() {
  // Mobile: 6 produtos (2 colunas × 3 linhas)
  // Desktop: 8 produtos (4 colunas × 2 linhas)
  return window.innerWidth >= 1024 ? 8 : 6;
}

function getRemainingProductsCount() {
  const total = produtosVRTIGO.length;
  const initial = getInitialProductCount();
  return Math.max(0, total - initial);
}

function createViewMoreButton() {
  if (viewMoreButton) return viewMoreButton;
  
  const button = document.createElement('button');
  button.className = 'view-more-btn';
  button.innerHTML = `
    <span>Ver mais produtos</span>
    <i class="fas fa-chevron-down"></i>
    <span class="count">+${getRemainingProductsCount()}</span>
  `;
  
  button.addEventListener('click', handleViewMoreClick);
  viewMoreButton = button;
  return button;
}

function updateViewMoreButton() {
  if (!viewMoreButton) return;
  
  const count = getRemainingProductsCount();
  const countSpan = viewMoreButton.querySelector('.count');
  
  if (count > 0) {
    countSpan.textContent = `+${count}`;
    viewMoreButton.style.display = 'flex';
  } else {
    viewMoreButton.style.display = 'none';
  }
}

function handleViewMoreClick() {
  showingAllProducts = true;
  loadStoreProducts(); // Recarrega com todos os produtos
  viewMoreButton.style.display = 'none';
}

// ============================================================
// GERADOR DE CARDS DE PRODUTO (ATUALIZADO COM FALLBACK)
// ============================================================
function generateProductCard(product) {
  const isSaved = savedProducts.some(p => p.id === product.id);
  const heartClass = isSaved ? "fa-solid" : "fa-regular";
  const btnClass = isSaved ? "active" : "";
  
  // Usar placeholder se a imagem real não carregar
  const imgSrc = product.img;
  const placeholderSrc = product.placeholder || getPlaceholderImage(product.name, product.category);
  
  return `
    <div class="product-card" 
         data-id="${product.id}"
         data-name="${product.name}"
         data-price="${product.price}"
         data-img="${imgSrc}"
         data-desc="${product.desc}"
         data-category="${product.category}">
      <div class="product-image">
        <img src="${imgSrc}" alt="${product.name}" 
             onerror="this.onerror=null; this.src='${placeholderSrc}'">
        <button class="save-btn ${btnClass}" data-id="${product.id}">
          <i class="${heartClass} fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-desc">${product.shortDesc}</p>
        <div class="product-footer">
          <span class="price">R$ ${product.price}</span>
          <button class="buy-btn">Comprar</button>
        </div>
      </div>
    </div>
  `;
}

function loadProductsToGrid(productsArray, gridElement) {
  if (!gridElement) return;
  
  // Determinar quantos produtos mostrar
  let productsToShow;
  if (showingAllProducts || gridElement.id === 'saves-grid') {
    productsToShow = productsArray; // Mostrar todos
  } else {
    const initialCount = getInitialProductCount();
    productsToShow = productsArray.slice(0, initialCount);
  }
  
  gridElement.innerHTML = productsToShow.map(generateProductCard).join('');
  
  // Re-inicializar eventos
  initSaveButtons(gridElement);
  initProductModal();
}

// ============================================================
// CARREGAR PRODUTOS NA LOJA (ATUALIZADO)
// ============================================================
function loadStoreProducts() {
  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) return;
  
  // Carregar produtos (com limite se não estiver mostrando todos)
  loadProductsToGrid(produtosVRTIGO, productsGrid);
  
  // Adicionar ou atualizar botão "Ver mais"
  if (!showingAllProducts && getRemainingProductsCount() > 0) {
    const viewMoreBtn = createViewMoreButton();
    
    // Verificar se o botão já está no DOM
    if (!productsGrid.nextElementSibling?.classList?.contains('view-more-btn')) {
      productsGrid.parentNode.insertBefore(viewMoreBtn, productsGrid.nextSibling);
    }
    
    updateViewMoreButton();
  } else if (viewMoreButton) {
    viewMoreButton.style.display = 'none';
  }
}

// ============================================================
// SISTEMA DE NAVEGAÇÃO VERTICAL
// ============================================================
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-item, .bottom-nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      scrollToSection(targetId);
    });
  });

  window.addEventListener('scroll', updateActiveNav);
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Recalcular "Ver mais" quando redimensionar janela
  window.addEventListener('resize', () => {
    if (!showingAllProducts) {
      loadStoreProducts();
    }
  });
}

function scrollToSection(sectionId) {
  const section = document.querySelector(sectionId);
  if (section) {
    const offsetTop = section.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

function updateActiveNav() {
  const sections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('.nav-item');
  
  let currentSection = '';
  const scrollPosition = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.id;
    }
  });
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${currentSection}`) {
      item.classList.add('active');
    }
  });
}

function handleKeyboardNavigation(e) {
  switch(e.key) {
    case 'Home':
      e.preventDefault();
      scrollToSection('#loja');
      break;
    case 'End':
      e.preventDefault();
      scrollToSection('#contato');
      break;
  }
}

// ============================================================
// SISTEMA DE SAVE (PRODUTOS FAVORITOS)
// ============================================================
function initSaveButtons(scope = document) {
  if (!scope) return;

  const buttons = scope.querySelectorAll(".save-btn");

  buttons.forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (isNaN(id)) return;

    const icon = btn.querySelector("i");
    if (!icon) return;

    btn.addEventListener("click", e => {
      e.stopPropagation();
      
      const product = produtosVRTIGO.find(p => p.id === id) || 
                     savedProducts.find(p => p.id === id);
      
      if (!product) return;

      const index = savedProducts.findIndex(p => p.id === id);
      const isSaved = index !== -1;

      if (isSaved) {
        savedProducts.splice(index, 1);
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        btn.classList.remove("active");
      } else {
        savedProducts.push({
          id: product.id,
          name: product.name,
          price: product.price,
          desc: product.desc,
          img: product.img,
          placeholder: product.placeholder,
          category: product.category
        });
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        btn.classList.add("active");
      }

      try {
        localStorage.setItem("vrtigoSaves", JSON.stringify(savedProducts));
        updateSavesCount();
        
        // Atualizar se estiver na seção SAVES
        if (document.getElementById('saves')?.checkVisibility()) {
          loadSavedProducts();
        }
      } catch (e) {
        console.error("Erro ao salvar no localStorage:", e);
      }
    });
  });
}

function updateSavesCount() {
  const savesCount = document.querySelector('.saves-count');
  if (savesCount) {
    savesCount.textContent = `${savedProducts.length} ${savedProducts.length === 1 ? 'item' : 'itens'}`;
  }
}

// ============================================================
// SEÇÃO SAVES - CARREGAR PRODUTOS SALVOS
// ============================================================
function loadSavedProducts() {
  const savesGrid = document.getElementById("saves-grid");
  const noSaves = document.getElementById("no-saves");

  if (!savesGrid || !noSaves) return;

  if (savedProducts.length === 0) {
    savesGrid.style.display = "none";
    noSaves.style.display = "block";
    return;
  }

  savesGrid.style.display = "grid";
  noSaves.style.display = "none";
  
  loadProductsToGrid(savedProducts, savesGrid);
}

// ============================================================
// MODAL DE PRODUTO (ATUALIZADO COM FALLBACK)
// ============================================================
function initProductModal() {
  const modal = document.getElementById("productModal");
  const productCards = document.querySelectorAll(".product-card");
  const buyButtons = document.querySelectorAll(".buy-btn");

  if (!modal) return;

  productCards.forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".save-btn")) return;
      
      const id = parseInt(card.dataset.id);
      if (isNaN(id)) return;

      const name = card.dataset.name || "Nome indisponível";
      const desc = card.dataset.desc || "Descrição indisponível";
      const price = card.dataset.price || "0.00";
      const img = card.dataset.img || "";
      const product = produtosVRTIGO.find(p => p.id === id);

      openProductModal({ 
        id, 
        name, 
        desc, 
        price, 
        img,
        placeholder: product?.placeholder || getPlaceholderImage(name, product?.category || 'basica')
      });
    });
  });

  buyButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".product-card");
      const id = parseInt(card.dataset.id);
      if (isNaN(id)) return;

      const name = card.dataset.name || "Nome indisponível";
      const desc = card.dataset.desc || "Descrição indisponível";
      const price = card.dataset.price || "0.00";
      const img = card.dataset.img || "";
      const product = produtosVRTIGO.find(p => p.id === id);

      openProductModal({ 
        id, 
        name, 
        desc, 
        price, 
        img,
        placeholder: product?.placeholder || getPlaceholderImage(name, product?.category || 'basica')
      });
    });
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains('modal-close')) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

function openProductModal(product) {
  const modal = document.getElementById("productModal");
  const modalBody = modal.querySelector(".modal-body");

  modalBody.innerHTML = `
    <div class="modal-product-image">
      <img src="${product.img}" alt="${product.name}" 
           onerror="this.onerror=null; this.src='${product.placeholder}'">
    </div>
    <div class="modal-product-info">
      <h2>${product.name}</h2>
      <p class="modal-product-desc">${product.desc}</p>
      <p class="modal-product-price">R$ ${product.price}</p>
      <div class="modal-actions">
        <button class="save-btn modal-save-btn" data-id="${product.id}">
          <i class="fa-regular fa-heart"></i> Favoritar
        </button>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de comprar: ${encodeURIComponent(product.name)} - R$ ${product.price} (${encodeURIComponent(product.desc)})" 
           class="whatsapp-btn modal-whatsapp-btn" 
           target="_blank">
          <i class="fab fa-whatsapp"></i> Comprar no WhatsApp
        </a>
      </div>
    </div>
  `;

  initSaveButtons(modal);
  modal.classList.add("active");
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById("productModal");
  modal.classList.remove("active");
  document.body.style.overflow = 'auto';
}

// ============================================================
// MODAL FAQ
// ============================================================
function initFAQModal() {
  const faqModal = document.getElementById("faqModal");
  const faqButtons = document.querySelectorAll(".faq-btn");

  if (!faqModal) return;

  faqButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      faqModal.classList.add("active");
      document.body.style.overflow = 'hidden';
    });
  });

  faqModal.addEventListener("click", (e) => {
    if (e.target === faqModal || e.target.classList.contains('modal-close')) {
      faqModal.classList.remove("active");
      document.body.style.overflow = 'auto';
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && faqModal.classList.contains("active")) {
      faqModal.classList.remove("active");
      document.body.style.overflow = 'auto';
    }
  });
}

// ============================================================
// FORMULÁRIO DE CONTATO
// ============================================================
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    
    try {
      const response = await fetch('https://formspree.io/f/xovkranj', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        showFormMessage('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        form.reset();
      } else {
        showFormMessage('❌ Erro ao enviar. Tente novamente.', 'error');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      showFormMessage('❌ Erro de conexão. Verifique sua internet.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
    
    return false;
  });
}

function showFormMessage(message, type) {
  const oldMessage = document.querySelector('.form-message');
  if (oldMessage) oldMessage.remove();
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'form-message';
  messageDiv.textContent = message;
  
  messageDiv.style.color = type === 'success' ? '#00eaff' : '#ff5050';
  messageDiv.style.marginTop = '1rem';
  messageDiv.style.padding = '12px';
  messageDiv.style.borderRadius = '8px';
  messageDiv.style.textAlign = 'center';
  messageDiv.style.fontWeight = '500';
  messageDiv.style.backgroundColor = type === 'success' ? 'rgba(0, 234, 255, 0.1)' : 'rgba(255, 80, 80, 0.1)';
  messageDiv.style.border = type === 'success' ? '1px solid rgba(0, 234, 255, 0.3)' : '1px solid rgba(255, 80, 80, 0.3)';
  messageDiv.style.animation = 'fadeIn 0.3s ease';
  
  const submitBtn = document.querySelector('.submit-btn');
  submitBtn.parentNode.insertBefore(messageDiv, submitBtn.nextSibling);
  
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        if (messageDiv.parentNode) messageDiv.remove();
      }, 300);
    }
  }, 5000);
}

// ============================================================
// INTERAÇÕES DE UI
// ============================================================
function initUIInteractions() {
  const ctaButtons = document.querySelectorAll('.cta-btn');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('primary')) {
        scrollToSection('#loja');
      } else if (btn.classList.contains('secondary') && !btn.classList.contains('faq-btn')) {
        scrollToSection('#sobre');
      }
    });
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Futuro: implementar filtros reais
    });
  });
}

// ============================================================
// INICIALIZAÇÃO COMPLETA
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
  console.log("🚀 VRTIGO - Sistema 'Ver mais' carregado!");
  
  initNavigation();
  loadStoreProducts(); // ← Agora com sistema "Ver mais"
  initFAQModal();
  initContactForm();
  initUIInteractions();
  
  updateSavesCount();
  
  // Observer para seção SAVES
  const savesSection = document.getElementById('saves');
  if (savesSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadSavedProducts();
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(savesSection);
  }
  
  console.log(`✅ ${produtosVRTIGO.length} produtos configurados`);
  console.log(`📱 Mostrando inicialmente: ${getInitialProductCount()} produtos`);
});

// ============================================================
// CSS DINÂMICO PARA "VER MAIS" E ANIMAÇÕES
// ============================================================
const style = document.createElement('style');
style.textContent = `
  @keyframes heartPulse {
    0% { transform: scale(1); }
    25% { transform: scale(1.3); }
    50% { transform: scale(1.1); }
    75% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  /* Botão "Ver mais" */
  .view-more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 2.5rem auto;
    padding: 1rem 2rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 234, 255, 0.2);
    animation: bounce 2s infinite;
  }
  
  .view-more-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 234, 255, 0.3);
    animation: none;
  }
  
  .view-more-btn .count {
    background: white;
    color: var(--primary);
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 700;
  }
  
  .view-more-btn i {
    transition: transform 0.3s ease;
  }
  
  .view-more-btn:hover i {
    transform: translateY(3px);
  }
  
  .save-btn.active i {
    animation: heartPulse 0.6s ease;
    color: #ff5050 !important;
  }
  
  .modal-product-image {
    width: 100%;
    height: 300px;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }
  
  .modal-product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .modal-product-info h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--text);
  }
  
  .modal-product-desc {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  .modal-product-price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 2rem;
  }
  
  .modal-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-save-btn {
    background: var(--surface-light);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
  }
  
  .modal-save-btn:hover {
    border-color: var(--primary);
  }
  
  .modal-save-btn.active {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
  }
  
  .modal-whatsapp-btn {
    background: #25D366;
    color: white;
    padding: 1rem;
    border-radius: 12px;
    text-decoration: none;
    text-align: center;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .modal-whatsapp-btn:hover {
    background: #128C7E;
    transform: translateY(-2px);
  }
  
  .form-message {
    animation: fadeIn 0.3s ease;
  }
  
  @media (max-width: 768px) {
    .modal-actions {
      flex-direction: column;
    }
    
    .view-more-btn {
      width: 90%;
      margin: 2rem auto;
      padding: 0.9rem 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .view-more-btn {
      font-size: 0.9rem;
      padding: 0.8rem 1.2rem;
    }
    
    .view-more-btn .count {
      font-size: 0.8rem;
      padding: 1px 6px;
    }
  }
`;
document.head.appendChild(style);

// Debug
console.log("✅ Script VRTIGO com 'Ver mais' e fallback de imagens carregado!");