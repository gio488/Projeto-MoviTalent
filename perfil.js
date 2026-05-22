(function() {
  document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof window.checkAuthAndRedirect === 'function') {
      if (!window.checkAuthAndRedirect()) return;
    }
    
    if (typeof window.updateNavbarUI === 'function') {
      window.updateNavbarUI();
    }
    
    const user = typeof window.getCurrentUser === 'function' ? window.getCurrentUser() : null;
    
    if (!user) {
      window.location.href = 'detalhes.html';
      return;
    }
    
    const myItems = typeof window.getUserItems === 'function' ? window.getUserItems(user.id) : [];
    const totalBids = myItems.reduce(function(sum, item) {
      return sum + (item.bids ? item.bids.length : 0);
    }, 0);

    const ultimosItens = myItems.slice(0, 2);
   
    function escapeHtml(text) {
      if (!text) return '';
      return text.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
    }
    
    const container = document.getElementById('profileContainer');
    
    let ultimosItensHtml = '';
    
    if (ultimosItens.length > 0) {
      ultimosItensHtml = `
        <div class="mt-4">
          <h5 class="fw-bold"><i class="bi bi-box-seam me-2" style="color: #2D6A4F;"></i>Meus últimos anúncios</h5>
          <div class="row g-3 mt-2">
            ${ultimosItens.map(function(item) {
              return `
                <div class="col-md-6">
                  <div class="border rounded-4 p-3" style="cursor: pointer;" onclick="window.location.href='detalhe-item.html?id=${item.id}'">
                    <div class="d-flex justify-content-between">
                      <span class="category-badge">${escapeHtml(item.category)}</span>
                      <small class="text-muted"><i class="bi bi-clock"></i> ${item.duration} dias</small>
                    </div>
                    <h6 class="mt-2 fw-bold">${escapeHtml(item.title)}</h6>
                    <p class="small text-muted mb-0">${item.bids ? item.bids.length : 0} lances</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="text-center mt-3">
            <a href="meus-itens.html" class="btn btn-outline-renova btn-sm">Ver todos os meus itens →</a>
          </div>
        </div>
      `;
    } else {
      ultimosItensHtml = `
        <div class="text-center mt-4 p-4 bg-white rounded-4">
          <i class="bi bi-box-seam" style="font-size: 48px; color: #ccc;"></i>
          <p class="mt-2">Você ainda não anunciou nenhum item</p>
          <a href="novo-item.html" class="btn btn-primary-renova btn-sm">Anunciar primeiro item</a>
        </div>
      `;
    }
    
    container.innerHTML = `
      <div class="text-center mb-4">
        <div class="avatar-bg mx-auto" style="width: 100px; height: 100px; font-size: 3rem; border-radius: 60px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #2D6A4F, #E76F51); color: white; font-weight: bold;">${escapeHtml(user.avatar || user.name.charAt(0))}</div>
        <h2 class="fw-bold mt-3" style="color: #2D6A4F;">${escapeHtml(user.name)}</h2>
        <p class="text-muted"><i class="bi bi-envelope-fill me-1"></i> ${escapeHtml(user.email)}</p>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <div class="p-3 bg-white rounded-4 shadow-sm text-center">
            <i class="bi bi-box-seam" style="font-size: 32px; color: #2D6A4F;"></i>
            <h3 class="fw-bold mt-2" style="color: #2D6A4F;">${myItems.length}</h3>
            <p class="text-muted mb-0">Itens anunciados</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-3 bg-white rounded-4 shadow-sm text-center">
            <i class="bi bi-chat-dots" style="font-size: 32px; color: #E76F51;"></i>
            <h3 class="fw-bold mt-2" style="color: #E76F51;">${totalBids}</h3>
            <p class="text-muted mb-0">Lances recebidos</p>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-sm-6">
          <div class="d-flex align-items-center gap-3 p-3 bg-white rounded-4">
            <i class="bi bi-geo-alt-fill" style="font-size: 24px; color: #2D6A4F;"></i>
            <div><small class="text-muted">Cidade</small><br><strong>${escapeHtml(user.city) || 'Não informado'}</strong></div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="d-flex align-items-center gap-3 p-3 bg-white rounded-4">
            <i class="bi bi-telephone-fill" style="font-size: 24px; color: #2D6A4F;"></i>
            <div><small class="text-muted">Telefone</small><br><strong>${escapeHtml(user.phone) || 'Não informado'}</strong></div>
          </div>
        </div>
      </div>

      ${ultimosItensHtml}

      <div class="d-flex gap-3 justify-content-center flex-wrap mt-4 pt-3">
        <a href="dashboard.html" class="btn btn-primary-renova px-4"><i class="bi bi-grid-3x3-gap-fill me-2"></i>Explorar itens</a>
        <a href="meus-itens.html" class="btn btn-outline-renova px-4"><i class="bi bi-box-seam me-2"></i>Meus itens</a>
        <button onclick="if(typeof window.logout === 'function') window.logout();" class="btn btn-outline-danger px-4"><i class="bi bi-box-arrow-right me-2"></i>Sair</button>
      </div>
    `;
    
  });
})();