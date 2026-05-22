const urlParams = new URLSearchParams(window.location.search);
const itemId = parseInt(urlParams.get('id'));

function renderDetail() {
  if (typeof checkAuthAndRedirect === 'function') {
    if (!checkAuthAndRedirect()) return;
  }
  
  if (typeof updateNavbarUI === 'function') updateNavbarUI();
  
  const item = typeof getItemById === 'function' ? getItemById(itemId) : null;
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  
  if (!item) {
    document.getElementById('detailContent').innerHTML = `<div class="alert alert-danger text-center py-5">Item não encontrado</div>`;
    return;
  }
  
  const isOwner = currentUser && item.userId === currentUser.id;
  const isActive = item.status === 'active';
  
  let bidsHtml = '';
  if (item.bids && item.bids.length > 0) {
    bidsHtml = item.bids.map(b => `
      <div class="bid-card">
        <div class="d-flex justify-content-between align-items-start">
          <strong><i class="bi bi-person-circle me-1"></i> ${b.userName}</strong>
          <small class="text-muted">${b.createdAt}</small>
        </div>
        <div class="mt-1">
          ${b.type === 'pay' ? `<span class="badge" style="background: #2D6A4F;">💰 Paga R$ ${b.value}</span>` : b.type === 'free' ? '<span class="badge" style="background: #E76F51;">🎁 Retirada gratuita</span>' : `<span class="badge" style="background: #E76F51;">🚚 Cobra R$ ${b.value}</span>`}
        </div>
        <p class="small mt-2 mb-0">"${b.message.substring(0, 100)}"</p>
      </div>
    `).join('');
  } else {
    bidsHtml = '<p class="text-muted text-center py-3">Nenhum lance ainda. Seja o primeiro!</p>';
  }
  
  document.getElementById('detailContent').innerHTML = `
    <div class="row">
      <div class="col-lg-7">
        <div class="card-glass p-4 mb-4">
          <div class="item-img-placeholder" style="height: 250px; background: linear-gradient(135deg, #ddebe0, #cde0d4); display: flex; align-items: center; justify-content: center; font-size: 64px; border-radius: 20px;">
            ${item.images && item.images[0] ? item.images[0] : '📦'}
          </div>
          <div class="mt-4">
            <div class="d-flex justify-content-between align-items-start">
              <h2 class="fw-bold" style="color: #2D6A4F;">${item.title}</h2>
              <span class="category-badge">${item.category}</span>
            </div>
            ${item.status !== 'active' ? `<div class="alert alert-warning mt-2">Status: ${item.status === 'negociado' ? '✅ NEGOCIADO' : '❌ CANCELADO'}</div>` : ''}
            <div class="row mt-3">
              <div class="col-6"><p><i class="bi bi-box-seam"></i> <strong>Quantidade:</strong><br>${item.quantity}</p></div>
              <div class="col-6"><p><i class="bi bi-clock"></i> <strong>Prazo:</strong><br>${item.duration} dias restantes</p></div>
            </div>
            <p><i class="bi bi-file-text"></i> <strong>Descrição:</strong><br>${item.description}</p>
            <p><i class="bi bi-geo-alt-fill"></i> <strong>Localização:</strong><br>${item.address}</p>
            <p><i class="bi bi-person-circle"></i> <strong>Anunciante:</strong><br>${item.userName || 'Usuário'}</p>
            
            ${isOwner && isActive ? `
              <div class="mt-3">
                <button onclick="cancelarAnuncio(${item.id})" class="btn btn-outline-danger w-100">
                  <i class="bi bi-x-circle"></i> Cancelar este anúncio
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        ${!isOwner && isActive ? `
          <div class="card-glass p-4 mb-4">
            <h4 class="fw-bold mb-3"><i class="bi bi-gavel me-2"></i>Dar um lance</h4>
            <form id="bidForm">
              <select id="bidType" class="form-select mb-3" required>
                <option value="pay"> Tenho interesse e PAGO R$</option>
                <option value="free"> Tenho interesse e RETIRO GRÁTIS</option>
                <option value="charge"> COBRO R$ para retirar e destinar</option>
              </select>
              <div id="valueField" class="mb-3"><input type="number" id="bidValue" class="form-control form-control-custom" placeholder="Valor em R$"></div>
              <textarea id="bidMessage" class="form-control mb-3" rows="2" placeholder="Mensagem para o anunciante..."></textarea>
              <button type="submit" class="btn btn-primary-renova w-100 py-2">Enviar lance</button>
            </form>
          </div>
        ` : isOwner ? `
          <div class="card-glass p-4 mb-4 text-center">
            <i class="bi bi-info-circle" style="font-size: 48px; color: #2D6A4F;"></i>
            <h5 class="mt-2">Este é seu item</h5>
            <p class="text-muted">Você não pode dar lances nos seus próprios anúncios</p>
            <a href="dashboard.html" class="btn btn-outline-renova mt-2">Voltar para itens</a>
          </div>
        ` : ''}
        <div class="card-glass p-4">
          <h5 class="fw-bold"><i class="bi bi-chat-dots-fill me-2"></i>Lances recebidos (${item.bids ? item.bids.length : 0})</h5>
          <div style="max-height: 400px; overflow-y: auto;">
            ${bidsHtml}
          </div>
        </div>
      </div>
    </div>
  `;
  
  const bidForm = document.getElementById('bidForm');
  if (bidForm) {
    const bidType = document.getElementById('bidType');
    const valueField = document.getElementById('valueField');
    
    bidType.addEventListener('change', function() {
      valueField.style.display = bidType.value === 'free' ? 'none' : 'block';
    });
    
    bidForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const type = bidType.value;
      let value = 0;
      if (type !== 'free') {
        value = parseInt(document.getElementById('bidValue').value) || 0;
        if (value <= 0) {
          alert("Por favor, insira um valor válido");
          return;
        }
      }
      const message = document.getElementById('bidMessage').value || "Tenho interesse neste item!";
      if (typeof placeBid === 'function' && placeBid(itemId, type, value, message)) {
        setTimeout(() => renderDetail(), 500);
      }
    });
  }
}

window.cancelarAnuncio = function(id) {
  if (confirm('Tem certeza que deseja cancelar este anúncio?')) {
    if (typeof deleteItem === 'function') {
      deleteItem(id);
    } else {
      alert('Função de cancelar não disponível');
    }
  }
};

renderDetail();