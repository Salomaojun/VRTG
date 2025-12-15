// ============================================================
// VRTIGO - SCRIPT COMPLETO COM FORMSPREE FUNCIONAL
// ============================================================

// ============================================================
// VARIÁVEIS GLOBAIS
// ============================================================
const WHATSAPP_NUMBER = "918897319841";
let viewMoreButton = null;
let showingAllProducts = false;
let resizeTimeout = null;

// Função para gerar placeholders coloridos por categoria
function getPlaceholderImage(productName, category) {
  const colorMap = {
    'basica': '333333',
    'logo': '6A0DAD',
    'minimal': 'FFFFFF',
    'colorida': '2196F3',
    'urbana': '9E9E9E',
    'militar': '4CAF50',
    'exclusiva': 'FF9800'
  };
  
  const color = colorMap[category] || '673AB7';
  const textColor = category === 'basica' || category === 'militar' ? 'FFFFFF' : '000000';
  const shortName = productName.replace('Camiseta ', '').substring(0, 15);
  
  return `https://via.placeholder.com/400x500/${color}/${textColor}?text=${encodeURIComponent(shortName)}`;
}

// ============================================================
// DADOS DOS PRODUTOS
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

// ============================================================
// UTILITÁRIOS
// ============================================================
function safeParseLocalStorage(key, defaultValue = []) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Erro ao parsear localStorage item "${key}":`, e);
    return defaultValue;
  }
}

function safeGetElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`⚠️ Elemento #${id} não encontrado no DOM`);
  }
  return element;
}

function debounce(func, wait) {
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(resizeTimeout);
      func(...args);
    };
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(later, wait);
  };
}

// ============================================================
// SISTEMA DE FAVORITOS (SAVES)
// ============================================================
let savedProducts = safeParseLocalStorage("vrtigoSaves", []);

function saveToLocalStorage() {
  try {
    localStorage.setItem("vrtigoSaves", JSON.stringify(savedProducts));
    console.log(`💾 Favoritos salvos: ${savedProducts.length} itens`);
    return true;
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
    return false;
  }
}

function toggleSaveProduct(productId) {
  const productIndex = savedProducts.findIndex(p => p.id === productId);
  
  if (productIndex !== -1) {
    savedProducts.splice(productIndex, 1);
    console.log(`❌ Produto ${productId} removido dos favoritos`);
    return false;
  } else {
    const product = produtosVRTIGO.find(p => p.id === productId);
    if (product) {
      savedProducts.push({
        id: product.id,
        name: product.name,
        price: product.price,
        desc: product.desc,
        img: product.img,
        placeholder: product.placeholder,
        category: product.category
      });
      console.log(`✅ Produto ${productId} adicionado aos favoritos`);
      return true;
    }
  }
  return null;
}

function updateSaveButton(button, productId) {
  const isSaved = savedProducts.some(p => p.id === productId);
  const icon = button.querySelector("i");
  
  if (icon) {
    if (isSaved) {
      icon.className = "fas fa-heart";
      button.classList.add("active");
    } else {
      icon.className = "far fa-heart";
      button.classList.remove("active");
    }
  }
}

function updateSavesCount() {
  const savesCount = document.querySelector('.saves-count');
  if (savesCount) {
    savesCount.textContent = `${savedProducts.length} ${savedProducts.length === 1 ? 'item' : 'itens'}`;
  }
}

// ============================================================
// SISTEMA "VER MAIS"
// ============================================================
function getInitialProductCount() {
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
  
  if (count > 0 && !showingAllProducts) {
    countSpan.textContent = `+${count}`;
    viewMoreButton.style.display = 'flex';
  } else {
    viewMoreButton.style.display = 'none';
  }
}

function handleViewMoreClick() {
  showingAllProducts = true;
  loadStoreProducts();
  if (viewMoreButton) {
    viewMoreButton.style.display = 'none';
  }
}

// ============================================================
// GERADOR DE CARDS DE PRODUTO
// ============================================================
function generateProductCard(product) {
  const isSaved = savedProducts.some(p => p.id === product.id);
  const heartClass = isSaved ? "fas" : "far";
  const btnClass = isSaved ? "active" : "";
  
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
        <button class="save-btn ${btnClass}" data-id="${product.id}" type="button">
          <i class="${heartClass} fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-desc">${product.shortDesc}</p>
        <div class="product-footer">
          <span class="price">R$ ${product.price}</span>
          <button class="buy-btn" type="button">Comprar</button>
        </div>
      </div>
    </div>
  `;
}

function loadProductsToGrid(productsArray, gridElement) {
  if (!gridElement) return;
  
  let productsToShow;
  if (showingAllProducts || gridElement.id === 'saves-grid') {
    productsToShow = productsArray;
  } else {
    const initialCount = getInitialProductCount();
    productsToShow = productsArray.slice(0, initialCount);
  }
  
  const fragment = document.createDocumentFragment();
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = productsToShow.map(generateProductCard).join('');
  
  while (tempDiv.firstChild) {
    fragment.appendChild(tempDiv.firstChild);
  }
  
  gridElement.innerHTML = '';
  gridElement.appendChild(fragment);
  
  initSaveButtons(gridElement);
  initBuyButtons(gridElement);
}

// ============================================================
// CARREGAR PRODUTOS NA LOJA
// ============================================================
function loadStoreProducts() {
  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) {
    console.warn('⚠️ Grid de produtos não encontrada');
    return;
  }
  
  loadProductsToGrid(produtosVRTIGO, productsGrid);
  
  if (!showingAllProducts && getRemainingProductsCount() > 0) {
    const viewMoreBtn = createViewMoreButton();
    
    if (!productsGrid.nextElementSibling?.classList?.contains('view-more-btn')) {
      productsGrid.parentNode.insertBefore(viewMoreBtn, productsGrid.nextSibling);
    }
    
    updateViewMoreButton();
  } else if (viewMoreButton) {
    viewMoreButton.style.display = 'none';
  }
}

// ============================================================
// SISTEMA DE NAVEGAÇÃO
// ============================================================
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-item, .bottom-nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        scrollToSection(targetId);
      }
    });
  });

  window.addEventListener('scroll', updateActiveNav);
  
  const debouncedResize = debounce(() => {
    if (!showingAllProducts) {
      loadStoreProducts();
    }
  }, 250);
  
  window.addEventListener('resize', debouncedResize);
}

function scrollToSection(sectionId) {
  const section = document.querySelector(sectionId);
  if (section) {
    const offsetTop = section.offsetTop - 80;
    
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, offsetTop);
    }
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

// ============================================================
// SISTEMA DE SAVE (PRODUTOS FAVORITOS)
// ============================================================
function initSaveButtons(scope = document) {
  const buttons = scope.querySelectorAll(".save-btn");
  
  buttons.forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (isNaN(id)) return;
    
    updateSaveButton(btn, id);
    
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productId = parseInt(this.dataset.id);
      const wasSaved = toggleSaveProduct(productId);
      
      if (wasSaved !== null) {
        updateSaveButton(this, productId);
        
        if (saveToLocalStorage()) {
          updateSavesCount();
          
          const savesSection = safeGetElement('saves');
          if (savesSection && isElementInViewport(savesSection)) {
            loadSavedProducts();
          }
        }
      }
    });
  });
}

function isElementInViewport(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ============================================================
// SEÇÃO SAVES - CARREGAR PRODUTOS SALVOS
// ============================================================
function loadSavedProducts() {
  const savesGrid = safeGetElement("saves-grid");
  const noSaves = safeGetElement("no-saves");

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
// MODAL DE PRODUTO
// ============================================================
function openProductModal(product) {
  const modal = safeGetElement("productModal");
  if (!modal) {
    console.error('❌ Modal não encontrado');
    return;
  }
  
  const modalBody = modal.querySelector(".modal-body");
  if (!modalBody) return;

  const modalSaveBtn = modal.querySelector(".modal-save-btn");
  if (modalSaveBtn) {
    modalSaveBtn.dataset.id = product.id;
    const isSaved = savedProducts.some(p => p.id === product.id);
    const icon = modalSaveBtn.querySelector('i');
    
    if (icon) {
      icon.className = isSaved ? "fas fa-heart" : "far fa-heart";
      if (isSaved) {
        modalSaveBtn.classList.add("active");
      } else {
        modalSaveBtn.classList.remove("active");
      }
    }
    
    const newSaveBtn = modalSaveBtn.cloneNode(true);
    modalSaveBtn.parentNode.replaceChild(newSaveBtn, modalSaveBtn);
    
    newSaveBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productId = parseInt(this.dataset.id);
      const wasSaved = toggleSaveProduct(productId);
      
      if (wasSaved !== null) {
        const icon = this.querySelector('i');
        if (icon) {
          if (wasSaved) {
            icon.className = "fas fa-heart";
            this.classList.add("active");
          } else {
            icon.className = "far fa-heart";
            this.classList.remove("active");
          }
        }
        
        if (saveToLocalStorage()) {
          updateSavesCount();
          
          initSaveButtons();
          
          const savesSection = safeGetElement('saves');
          if (savesSection && isElementInViewport(savesSection)) {
            loadSavedProducts();
          }
        }
      }
    });
  }
  
  modalBody.innerHTML = `
    <div class="modal-product-image">
      <img src="${product.img}" 
           alt="${product.name}" 
           onerror="this.onerror=null; this.src='${product.placeholder}'">
    </div>
    <div class="modal-info">
      <h2>${product.name}</h2>
      <p class="modal-desc">${product.desc}</p>
      <div class="modal-price-row">
        <span class="modal-price">R$ ${product.price}</span>
      </div>
      <button class="modal-buy-btn" type="button">Comprar</button>
    </div>
  `;
  
  const modalBuyBtn = modalBody.querySelector('.modal-buy-btn');
  if (modalBuyBtn) {
    modalBuyBtn.addEventListener('click', function() {
      const whatsappText = `Olá! Gostaria de comprar: ${product.name} (R$ ${product.price})`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`, '_blank');
    });
  }
  
  modal.classList.add("open");
  document.body.style.overflow = 'hidden';
}

function initProductModal() {
  const modal = safeGetElement("productModal");
  if (!modal) {
    console.warn('⚠️ Modal de produto não encontrado');
    return;
  }
  
  const closeBtn = modal.querySelector(".modal-close");
  if (!closeBtn) {
    console.warn('⚠️ Botão de fechar modal não encontrado');
    return;
  }

  document.addEventListener("click", function(e) {
    const productCard = e.target.closest(".product-card");
    if (productCard) {
      if (e.target.closest('.save-btn') || e.target.closest('.buy-btn')) {
        return;
      }
      
      const productId = parseInt(productCard.dataset.id);
      const product = produtosVRTIGO.find(p => p.id === productId);
      
      if (product) {
        e.preventDefault();
        openProductModal(product);
      }
    }
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    document.body.style.overflow = 'auto';
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
      document.body.style.overflow = 'auto';
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      modal.classList.remove("open");
      document.body.style.overflow = 'auto';
    }
  });
}

// ============================================================
// BOTÕES DE COMPRA
// ============================================================
function initBuyButtons(scope = document) {
  const buyButtons = scope.querySelectorAll(".buy-btn");
  
  buyButtons.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productCard = this.closest(".product-card");
      if (!productCard) return;
      
      const productId = parseInt(productCard.dataset.id);
      const product = produtosVRTIGO.find(p => p.id === productId);
      
      if (product) {
        const whatsappText = `Olá! Gostaria de comprar: ${product.name} (R$ ${product.price})`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`, '_blank');
      }
    });
  });
}

// ============================================================
// MODAL FAQ
// ============================================================
function initFAQModal() {
  const faqModal = safeGetElement("faqModal");
  const contactModal = safeGetElement("contactModal");
  
  if (!faqModal) {
    console.warn('⚠️ Modal FAQ não encontrado');
    return;
  }

  const faqButtons = document.querySelectorAll(".faq-btn");
  
  faqButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      faqModal.classList.add("open");
      document.body.style.overflow = 'hidden';
    });
  });

  const closeFAQModal = () => {
    faqModal.classList.remove("open");
    document.body.style.overflow = 'auto';
  };

  faqModal.addEventListener("click", (e) => {
    if (e.target === faqModal || e.target.classList.contains('modal-close')) {
      closeFAQModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && faqModal.classList.contains("open")) {
      closeFAQModal();
    }
  });

  if (contactModal) {
    const closeContactModal = () => {
      contactModal.classList.remove("open");
      document.body.style.overflow = 'auto';
    };
    
    contactModal.addEventListener("click", (e) => {
      if (e.target === contactModal || e.target.classList.contains('modal-close') || e.target.classList.contains('close-modal-btn')) {
        closeContactModal();
      }
    });
    
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && contactModal.classList.contains("open")) {
        closeContactModal();
      }
    });
  }
}

// ============================================================
// FORMULÁRIO DE CONTATO - FORMSPREE SEM ABRIR NOVA ABA
// ============================================================
function initContactForm() {
  const form = document.getElementById("contactForm");
  const contactModal = safeGetElement("contactModal");
  
  if (!form) {
    console.warn('⚠️ Formulário de contato não encontrado');
    return;
  }

  // 1. REMOVER atributos que causam redirecionamento
  form.removeAttribute('action');
  form.removeAttribute('method');
  form.removeAttribute('target');
  
  form.addEventListener("submit", async function(e) {
    e.preventDefault(); // AGORA USA preventDefault para BLOQUEAR redirecionamento
    e.stopPropagation();
    
    const submitBtn = form.querySelector('.submit-btn');
    if (!submitBtn) return;
    
    // Feedback visual
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    try {
      // Coletar dados do formulário
      const formData = new FormData(form);
      
      // Debug: ver dados enviados
      console.log('📤 Enviando para Formspree...');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      // 2. Enviar via AJAX/Fetch (NÃO redireciona a página)
      const response = await fetch('https://formspree.io/f/xovkranj', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('📬 Resposta do Formspree:', response.status);
      
      if (response.ok) {
        // SUCESSO - mostrar modal LOCAL (sem abrir nova aba)
        console.log('✅ Email enviado via Formspree com sucesso!');
        
        // Mostrar modal de confirmação
        if (contactModal) {
          contactModal.classList.add("open");
          document.body.style.overflow = 'hidden';
        }
        
        // Limpar formulário
        form.reset();
        
        // Feedback visual adicional
        showFormMessage('✅ Mensagem enviada com sucesso!', 'success');
        
      } else {
        // ERRO - mostrar mensagem de erro LOCAL
        const errorText = await response.text();
        console.error('❌ Erro do Formspree:', errorText);
        showFormMessage('❌ Erro ao enviar. Tente novamente.', 'error');
      }
      
    } catch (error) {
      // ERRO DE REDE
      console.error('❌ Erro de rede:', error);
      showFormMessage('❌ Erro de conexão. Verifique sua internet.', 'error');
      
    } finally {
      // Restaurar botão
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
  
  // 3. Adicionar validação básica para melhor UX
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  inputs.forEach(input => {
    input.addEventListener('invalid', function(e) {
      e.preventDefault();
      this.style.borderColor = 'var(--accent)';
      showFormMessage('❌ Por favor, preencha todos os campos obrigatórios.', 'error');
    });
    
    input.addEventListener('input', function() {
      if (this.value.trim()) {
        this.style.borderColor = '';
      }
    });
  });
}

// Função auxiliar para mostrar mensagens
function showFormMessage(message, type) {
  // Remover mensagens anteriores
  const oldMessages = document.querySelectorAll('.form-message');
  oldMessages.forEach(msg => msg.remove());
  
  // Criar nova mensagem
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    animation: fadeIn 0.3s ease;
    margin: 1rem 0;
    padding: 12px 16px;
    border-radius: 8px;
    text-align: center;
    font-weight: 500;
    font-size: 0.9rem;
    ${type === 'success' ? 
      'color: #00eaff; background-color: rgba(0, 234, 255, 0.1); border: 1px solid rgba(0, 234, 255, 0.3);' : 
      'color: #ff5050; background-color: rgba(255, 80, 80, 0.1); border: 1px solid rgba(255, 80, 80, 0.3);'}
  `;
  
  const form = document.getElementById("contactForm");
  if (form) {
    // Inserir mensagem antes do botão de submit
    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn && submitBtn.parentNode) {
      submitBtn.parentNode.insertBefore(messageDiv, submitBtn);
      
      // Auto-remover após 5 segundos
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.style.opacity = '0';
          messageDiv.style.transition = 'opacity 0.3s ease';
          setTimeout(() => {
            if (messageDiv.parentNode) messageDiv.remove();
          }, 300);
        }
      }, 5000);
    }
  }
}

// Adicionar estilos CSS para as mensagens (se não existirem)
if (!document.querySelector('#form-message-styles')) {
  const style = document.createElement('style');
  style.id = 'form-message-styles';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .form-message {
      animation: fadeIn 0.3s ease !important;
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// INTERAÇÕES DE UI
// ============================================================
function initUIInteractions() {
  const ctaButtons = document.querySelectorAll('.cta-btn');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('primary') && !btn.classList.contains('faq-btn')) {
        scrollToSection('#loja');
      } else if (btn.classList.contains('secondary') && !btn.classList.contains('faq-btn')) {
        scrollToSection('#sobre');
      }
    });
  });

  const exploreBtn = document.querySelector('#no-saves .cta-btn.primary');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      scrollToSection('#loja');
    });
  }
}

// ============================================================
// LIGHT/DARK THEME TOGGLE
// ============================================================
function initThemeToggle() {
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  if (!themeToggleBtn) {
    console.warn('⚠️ Botão de tema não encontrado');
    return;
  }
  
  const themeIcon = themeToggleBtn.querySelector('i');
  if (!themeIcon) {
    console.warn('⚠️ Ícone do tema não encontrado');
    return;
  }
  
  const savedTheme = localStorage.getItem('vrtigoTheme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('vrtigoTheme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('vrtigoTheme', 'light');
    }
    
    themeIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
      themeIcon.style.transform = 'scale(1)';
    }, 200);
  });
}

// ============================================================
// INICIALIZAÇÃO COMPLETA
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
  console.log("🚀 VRTIGO - Sistema carregado!");
  console.log(`📊 Total de produtos: ${produtosVRTIGO.length}`);
  console.log(`💾 Produtos salvos: ${savedProducts.length}`);
  
  try {
    initNavigation();
    loadStoreProducts();
    initProductModal();
    initFAQModal();
    initContactForm(); // ← FORMSPREE FUNCIONAL
    initUIInteractions();
    initThemeToggle();
    updateSavesCount();
    initSaveButtons();
    
    const savesSection = safeGetElement('saves');
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
    
    console.log("✅ Sistema VRTIGO inicializado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro durante inicialização:", error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'system-error';
    errorDiv.innerHTML = `
      <p>Ocorreu um erro ao carregar a loja. Por favor, recarregue a página.</p>
      <button onclick="location.reload()">Recarregar</button>
    `;
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 9999;
      text-align: center;
    `;
    document.body.appendChild(errorDiv);
  }
});

console.log("✅ Script VRTIGO com Formspree funcional!");
