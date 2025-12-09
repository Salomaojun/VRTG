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
// SISTEMA DE SAVE (PRODUTOS FAVORITOS) - CORRIGIDO
// ============================================================
function initSaveButtons(scope = document) {
  const buttons = scope.querySelectorAll(".save-btn");
  
  buttons.forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (isNaN(id)) return;
    
    const icon = btn.querySelector("i");
    if (!icon) return;
    
    // Verificar estado atual
    const isCurrentlySaved = savedProducts.some(p => p.id === id);
    
    // Atualizar visual inicialmente
    if (isCurrentlySaved) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
      btn.classList.add("active");
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
      btn.classList.remove("active");
    }
    
    // Adicionar evento de clique
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const product = produtosVRTIGO.find(p => p.id === id);
      if (!product) return;
      
      const index = savedProducts.findIndex(p => p.id === id);
      const isSaved = index !== -1;
      
      if (isSaved) {
        // Remover dos favoritos
        savedProducts.splice(index, 1);
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        btn.classList.remove("active");
        console.log(`❌ Produto ${id} removido dos favoritos`);
      } else {
        // Adicionar aos favoritos
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
        console.log(`✅ Produto ${id} adicionado aos favoritos`);
      }
      
      // Salvar no localStorage
      try {
        localStorage.setItem("vrtigoSaves", JSON.stringify(savedProducts));
        console.log(`💾 Favoritos salvos: ${savedProducts.length} itens`);
        updateSavesCount();
        
        // Se estiver na seção SAVES, recarregar
        if (document.getElementById('saves')?.checkVisibility?.()) {
          loadSavedProducts();
        }
      } catch (error) {
        console.error("Erro ao salvar no localStorage:", error);
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

  // Verificar se o produto está salvo
  const isSaved = savedProducts.some(p => p.id === product.id);
  const heartClass = isSaved ? "fa-solid" : "fa-regular";
  
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
        <button class="save-btn modal-save-btn ${isSaved ? 'active' : ''}" data-id="${product.id}">
          <i class="${heartClass} fa-heart"></i>
        </button>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Olá!%20Gostaria%20de%20comprar:%20${encodeURIComponent(product.name)}%20-%20R$%20${product.price}%20(${encodeURIComponent(product.desc)})" 
           class="whatsapp-btn modal-whatsapp-btn" 
           target="_blank">
          <i class="fab fa-whatsapp"></i> Comprar no WhatsApp
        </a>
      </div>
    </div>
  `;

  // Inicializar botão de salvar no modal
  const modalSaveBtn = modal.querySelector('.modal-save-btn');
  if (modalSaveBtn) {
    modalSaveBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const icon = this.querySelector('i');
      const id = parseInt(this.dataset.id);
      const product = produtosVRTIGO.find(p => p.id === id);
      
      if (!product) return;

      const index = savedProducts.findIndex(p => p.id === id);
      const isSaved = index !== -1;

      if (isSaved) {
        savedProducts.splice(index, 1);
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        this.classList.remove("active");
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
        this.classList.add("active");
      }

      localStorage.setItem("vrtigoSaves", JSON.stringify(savedProducts));
      updateSavesCount();
      
      // Atualizar botão no grid
      const gridSaveBtn = document.querySelector(`.save-btn[data-id="${id}"]`);
      if (gridSaveBtn) {
        const gridIcon = gridSaveBtn.querySelector('i');
        if (isSaved) {
          gridIcon.classList.remove("fa-solid");
          gridIcon.classList.add("fa-regular");
          gridSaveBtn.classList.remove("active");
        } else {
          gridIcon.classList.remove("fa-regular");
          gridIcon.classList.add("fa-solid");
          gridSaveBtn.classList.add("active");
        }
      }
    });
  }

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
  const contactModal = document.getElementById("contactModal");
  const faqButtons = document.querySelectorAll(".faq-btn");

  if (!faqModal) return;

  faqButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      faqModal.classList.add("active");
      document.body.style.overflow = 'hidden';
    });
  });

  // Fechar FAQ modal
  const closeFAQModal = () => {
    faqModal.classList.remove("active");
    document.body.style.overflow = 'auto';
  };

  faqModal.addEventListener("click", (e) => {
    if (e.target === faqModal || e.target.classList.contains('modal-close')) {
      closeFAQModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && faqModal.classList.contains("active")) {
      closeFAQModal();
    }
  });

  // Contact modal
  if (contactModal) {
    contactModal.addEventListener("click", (e) => {
      if (e.target === contactModal || e.target.classList.contains('modal-close') || e.target.classList.contains('close-modal-btn')) {
        contactModal.classList.remove("active");
        document.body.style.overflow = 'auto';
      }
    });
  }
}

// ============================================================
// FORMULÁRIO DE CONTATO
// ============================================================
function initContactForm() {
  const form = document.getElementById("contactForm");
  const contactModal = document.getElementById("contactModal");
  
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
      // Simular envio (remova este setTimeout em produção)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em produção, use:
      // const response = await fetch('https://formspree.io/f/xovkranj', {
      //   method: 'POST',
      //   body: formData,
      //   headers: { 'Accept': 'application/json' }
      // });
      
      // if (response.ok) {
        showFormMessage('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        form.reset();
        
        // Mostrar modal de confirmação
        if (contactModal) {
          contactModal.classList.add("active");
          document.body.style.overflow = 'hidden';
        }
      // } else {
      //   showFormMessage('❌ Erro ao enviar. Tente novamente.', 'error');
      // }
      
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
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  
  const form = document.getElementById("contactForm");
  if (form) {
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.parentNode.insertBefore(messageDiv, submitBtn.nextSibling);
    
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

  // Botão "Explorar Loja" na seção de favoritos vazios
  const exploreBtn = document.querySelector('#no-saves .cta-btn.primary');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      scrollToSection('#loja');
    });
  }
}

// ============================================================
// LIGHT/DARK THEME TOGGLE - FUNÇÃO ADICIONADA
// ============================================================
function initThemeToggle() {
  console.log('🔄 Inicializando tema...');
  
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  if (!themeToggleBtn) {
    console.error('❌ Botão de tema não encontrado!');
    return;
  }
  
  const themeIcon = themeToggleBtn.querySelector('i');
  if (!themeIcon) {
    console.error('❌ Ícone do tema não encontrado!');
    return;
  }
  
  console.log('✅ Elementos do tema encontrados');
  
  // Verificar tema salvo ou preferência do sistema
  const savedTheme = localStorage.getItem('vrtigoTheme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  console.log(`🌗 Tema salvo: "${savedTheme}", Sistema prefere escuro: ${systemPrefersDark}`);
  
  // Definir tema inicial
  if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
    console.log('🌞 Aplicando tema claro inicial');
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    console.log('🌙 Mantendo tema escuro');
  }
  
  // Alternar tema
  themeToggleBtn.addEventListener('click', () => {
    console.log('🎯 Botão de tema clicado!');
    
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
      // Mudar para dark
      document.documentElement.removeAttribute('data-theme');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('vrtigoTheme', 'dark');
      console.log('🌙 Mudado para tema escuro');
    } else {
      // Mudar para light
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('vrtigoTheme', 'light');
      console.log('🌞 Mudado para tema claro');
    }
    
    // Animação do ícone
    themeIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
      themeIcon.style.transform = 'scale(1)';
    }, 200);
  });
  
  console.log('✅ Tema inicializado com sucesso!');
}

// ============================================================
// INICIALIZAÇÃO COMPLETA - ATUALIZADA COM TEMA
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
  console.log("🚀 VRTIGO - Sistema carregado!");
  console.log(`📊 Total de produtos: ${produtosVRTIGO.length}`);
  console.log(`💾 Produtos salvos: ${savedProducts.length}`);
  
  // Inicializar tudo (na ordem correta)
  initNavigation();
  loadStoreProducts();
  initFAQModal();
  initContactForm();
  initUIInteractions();
  initThemeToggle();
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
  
  // Debug: verificar todos os produtos
  console.log(`✅ ${produtosVRTIGO.length} produtos configurados`);
  console.log(`📱 Mostrando inicialmente: ${getInitialProductCount()} produtos`);
  console.log(`📦 Produtos IDs: ${produtosVRTIGO.map(p => p.id).join(', ')}`);
});

// Debug final
console.log("✅ Script VRTIGO com sistema de favoritos corrigido!");
