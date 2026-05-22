let usersDB = [
  { id: 1, name: "Marcos Silva", email: "marcos@renova.com", password: "123456", city: "São Paulo - Zona Sul", avatar: "MS", phone: "(11) 99999-1111" },
  { id: 2, name: "Maria Oliveira", email: "maria@renova.com", password: "123456", city: "São Paulo - Zona Norte", avatar: "MO", phone: "(11) 98888-2222" },
  { id: 3, name: "DeBoa Ltda", email: "deboa@recicla.com", password: "123456", city: "São Paulo - Zona Leste", avatar: "DB", phone: "(11) 97777-3333" }
];

let itemsDB = [
  { 
    id: 1, userId: 1, title: "Telhas Romanas (100m²)", category: "Materiais de Construção",
    description: "Telhas romanas em bom estado, usadas por apenas 3 anos. Foram trocadas por telhado termoacústico. Aproximadamente 100 metros quadrados.",
    quantity: "100m²", city: "São Paulo - Zona Sul", address: "R. das Acácias, 123",
    images: ["🏠"], duration: 15, status: "active", createdAt: "2026-05-10",
    bids: [
      { id: 1, userId: 2, userName: "Maria Oliveira", type: "pay", value: 200, message: "Tenho interesse e pago R$ 200", createdAt: "2026-05-15" },
      { id: 2, userId: 3, userName: "DeBoa Ltda", type: "charge", value: 200, message: "Cobramos R$ 200 para retirar", createdAt: "2026-05-16" }
    ]
  },
  { 
    id: 2, userId: 2, title: "Sofá 3 lugares - seminovo", category: "Móveis",
    description: "Sofá bege claro, tecido nobre, pouquíssimo uso. Medidas: 2,10m de largura.",
    quantity: "1 unidade", city: "São Paulo - Zona Norte", address: "Av. Paulista, 1000",
    images: ["🛋️"], duration: 7, status: "active", createdAt: "2026-05-18", 
    bids: []
  },
  { 
    id: 3, userId: 1, title: "Entulho de obra (2 toneladas)", category: "Entulho/Sucata",
    description: "Restos de demolição: tijolos, concreto, areia. Retirar em até 7 dias.",
    quantity: "2 toneladas", city: "São Paulo - Zona Leste", address: "Rua dos Operários, 500",
    images: ["🚛"], duration: 5, status: "active", createdAt: "2026-05-20",
    bids: [
      { id: 3, userId: 3, userName: "DeBoa Ltda", type: "charge", value: 300, message: "Cobramos R$ 300 para destinar", createdAt: "2026-05-21" }
    ]
  },
  { 
    id: 4, userId: 2, title: "Geladeira Frost Free", category: "Eletrônicos",
    description: "Geladeira em bom estado, funcionando perfeitamente. Cor prata, 400L.",
    quantity: "1 unidade", city: "São Paulo - Zona Oeste", address: "R. das Flores, 200",
    images: ["❄️"], duration: 20, status: "active", createdAt: "2026-05-22",
    bids: []
  }
];

let currentUser = null;

function showToast(message, type) {
  var toastEl = document.getElementById('liveToast');
  if (!toastEl) return;
  document.getElementById('toastMessage').innerText = message;
  toastEl.classList.remove('bg-success', 'bg-danger');
  toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
  var bsToast = new bootstrap.Toast(toastEl);
  bsToast.show();
}

function saveSession(user) {
  currentUser = user;
  sessionStorage.setItem('renova_user', JSON.stringify(user));
}

function loadSession() {
  var stored = sessionStorage.getItem('renova_user');
  currentUser = stored ? JSON.parse(stored) : null;
  return currentUser;
}

function getCurrentUser() {
  if (!currentUser) loadSession();
  return currentUser;
}

// JavaScript para a tela de login - RENOVA (com validação própria)

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      // Validação local (funciona mesmo sem app.js)
      const emailCorreto = "marcos@renova.com";
      const senhaCorreta = "123456";
      
      if (email === emailCorreto && password === senhaCorreta) {
        // Login sucesso
        if (typeof showToast === 'function') {
          showToast("Bem-vindo(a) à RENOVA! ♻️", "success");
        } else {
          alert("Bem-vindo(a) à RENOVA!");
        }
        
        // Salvar sessão manualmente
        const user = { id: 1, name: "Marcos Silva", email: email, avatar: "MS" };
        sessionStorage.setItem('renova_user', JSON.stringify(user));
        
        setTimeout(function() {
          window.location.href = 'dashboard.html';
        }, 500);
      } else {
        // ERRO - mensagem vermelha
        if (typeof showToast === 'function') {
          showToast("❌ E-mail ou senha incorretos", "error");
        } else {
          alert("❌ E-mail ou senha incorretos!");
        }
      }
    });
  }
});

// Função showToast caso não exista no app.js
if (typeof showToast !== 'function') {
  window.showToast = function(message, type) {
    const toastEl = document.getElementById('liveToast');
    if (!toastEl) {
      // Se não tem toast, usa alert mesmo
      alert(message);
      return;
    }
    const toastMsg = document.getElementById('toastMessage');
    if (toastMsg) toastMsg.innerText = message;
    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
    const bsToast = new bootstrap.Toast(toastEl);
    bsToast.show();
  };
}

function handleRegister(name, email, password, city, phone) {
  if (usersDB.find(function(u) { return u.email === email; })) {
    showToast("E-mail já cadastrado", "error");
    return false;
  }
  var newId = usersDB.length + 1;
  var avatar = name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0,2);
  usersDB.push({ id: newId, name: name, email: email, password: password, city: city, phone: phone, avatar: avatar });
  saveSession({ id: newId, name: name, email: email, city: city, phone: phone, avatar: avatar });
  showToast('Conta criada! 🌱', 'success');
  return true;
}

function logout() {
  sessionStorage.removeItem('renova_user');
  currentUser = null;
  window.location.href = 'index.html';
}

function getAllItems() { return itemsDB.filter(function(i) { return i.status === 'active'; }); }
function getUserItems(userId) { return itemsDB.filter(function(i) { return i.userId === userId; }); }
function getItemById(id) { return itemsDB.find(function(i) { return i.id === id; }); }

function addNewItem(title, category, description, quantity, city, address, duration) {
  var newId = itemsDB.length + 1;
  itemsDB.push({
    id: newId, userId: currentUser.id, title: title, category: category, description: description,
    quantity: quantity, city: city, address: address, images: ["📦"], duration: parseInt(duration),
    status: "active", createdAt: new Date().toISOString().slice(0,10), bids: []
  });
  showToast('Item anunciado! ♻️', 'success');
  return true;
}

function placeBid(itemId, type, value, message) {
  var item = getItemById(itemId);
  if (!item) return false;
  if (item.userId === currentUser.id) {
    showToast("Você não pode dar lance no seu próprio item", "error");
    return false;
  }
  item.bids.push({
    id: item.bids.length + 1, userId: currentUser.id, userName: currentUser.name,
    type: type, value: type === 'free' ? 0 : value, message: message,
    createdAt: new Date().toISOString().slice(0,10)
  });
  showToast('Lance realizado!', 'success');
  return true;
}

function updateNavbarUI() {
  var navArea = document.getElementById('navUserArea');
  if (!navArea) return;
  
  var user = getCurrentUser();
  
  if (user) {
    navArea.innerHTML = `
      <div class="dropdown">
        <button class="btn d-flex align-items-center gap-2 dropdown-toggle" type="button" data-bs-toggle="dropdown" style="background:transparent; border:none;">
          <div style="width: 38px; height: 38px; background: linear-gradient(135deg, #2D6A4F, #E76F51); border-radius: 30px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${user.avatar}</div>
          <span class="d-none d-md-inline fw-semibold" style="color:#2D6A4F;">${user.name.split(' ')[0]}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="perfil.html"><i class="bi bi-person-circle me-2"></i> Meu Perfil</a></li>
          <li><a class="dropdown-item" href="meus-itens.html"><i class="bi bi-box-seam me-2"></i> Meus Itens</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" onclick="logout(); return false;"><i class="bi bi-box-arrow-right me-2"></i> Sair</a></li>
        </ul>
      </div>
      <button class="btn btn-primary-renova btn-sm ms-2" onclick="window.location.href='novo-item.html'" style="background: #2D6A4F; border: none; border-radius: 50px; padding: 8px 18px; color: white;">
        <i class="bi bi-plus-lg"></i> Anunciar
      </button>
    `;
  } else {
    navArea.innerHTML = '<button class="btn btn-outline-renova" onclick="window.location.href=\'detalhes.html\'" style="border: 2px solid #E76F51; color: #E76F51; border-radius: 50px; padding: 8px 20px;"><i class="bi bi-person"></i> Entrar</button>';
  }
}

function checkAuthAndRedirect() {
  loadSession();
  var publicPages = ['index.html', 'cadastrar.html', 'detalhes.html'];
  var currentPage = window.location.pathname.split('/').pop();
  if (!currentUser && !publicPages.includes(currentPage)) {
    window.location.href = 'detalhes.html';
    return false;
  }
  return true;
}

function finalizarLeiloes() {
  const hoje = new Date();
  const dataLimite = new Date();
  
  itemsDB.forEach(function(item) {
    if (item.status !== 'active') return;
    
    const dataCriacao = new Date(item.createdAt);
    const dataExpiracao = new Date(dataCriacao);
    dataExpiracao.setDate(dataExpiracao.getDate() + item.duration);
    
    if (hoje >= dataExpiracao && item.bids.length > 0) {
      
      var melhorLance = item.bids[0];
      for (var i = 1; i < item.bids.length; i++) {
        var lance = item.bids[i];
        if (lance.type === 'pay' && melhorLance.type === 'pay' && lance.value > melhorLance.value) {
          melhorLance = lance;
        } else if (lance.type === 'free' && melhorLance.type !== 'free') {
          melhorLance = lance;
        } else if (lance.type === 'charge' && melhorLance.type === 'charge' && lance.value < melhorLance.value) {
          melhorLance = lance;
        }
      }
      
      console.log(`🔔 ITEM FINALIZADO: ${item.title}`);
      console.log(`   Vencedor: ${melhorLance.userName}`);
      console.log(`   Tipo: ${melhorLance.type} Valor: ${melhorLance.value}`);
      
      item.status = 'negociado';
      item.winnerBid = melhorLance;
      
      showToast(`Leilão finalizado! "${item.title}" - Vencedor: ${melhorLance.userName}`, 'success');
    } else if (hoje >= dataExpiracao && item.bids.length === 0) {
      item.status = 'cancelado';
      showToast(`Ninguém deu lance em "${item.title}". Anúncio cancelado.`, 'warning');
    }
  });
  
  sessionStorage.setItem('renova_items', JSON.stringify(itemsDB));
}

finalizarLeiloes();

function cancelarAnuncio(itemId) {
  const item = getItemById(itemId);
  if (item && item.userId === currentUser.id) {
    item.status = 'cancelado';
    showToast(`Anúncio "${item.title}" cancelado.`, 'warning');
    setTimeout(function() {
      window.location.href = 'dashboard.html';
    }, 1500);
  }
}
window.cancelarAnuncio = cancelarAnuncio;

window.showToast = showToast;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.getCurrentUser = getCurrentUser;
window.getAllItems = getAllItems;
window.getUserItems = getUserItems;
window.getItemById = getItemById;
window.addNewItem = addNewItem;
window.placeBid = placeBid;
window.logout = logout;
window.updateNavbarUI = updateNavbarUI;
window.checkAuthAndRedirect = checkAuthAndRedirect;

loadSession();

document.addEventListener('DOMContentLoaded', function() {
  updateNavbarUI();
});