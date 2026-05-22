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
    const container = document.getElementById('myItemsContainer');
    
    if (!container) return;
    
    function escapeHtml(text) {
      if (!text) return '';
      return text.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
    }
    
    if (myItems.length === 0) {
      container.innerHTML = `
        <div class="card-glass text-center p-5">
          <i class="bi bi-box-seam" style="font-size: 64px; color: #2D6A4F; opacity: 0.5;"></i>
          <h4 class="mt-3">Você ainda não anunciou nenhum item</h4>
          <p class="text-muted">Comece agora e ajude o planeta!</p>
          <a href="novo-item.html" class="btn btn-primary-renova mt-2">Anunciar primeiro item</a>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="row g-4">
          ${myItems.map(function(item) {
            return `
              <div class="col-md-6 col-lg-4">
                <div class="item-card p-3" onclick="window.location.href='detalhe-item.html?id=${item.id}'" style="cursor: pointer;">
                  <div class="d-flex justify-content-between align-items-start">
                    <h5 class="fw-bold" style="color: #2D6A4F;">${escapeHtml(item.title)}</h5>
                    <span class="category-badge">${escapeHtml(item.category)}</span>
                  </div>
                  <p class="small text-muted mt-2">${escapeHtml(item.description.substring(0, 80))}${item.description.length > 80 ? '...' : ''}</p>
                  <div class="d-flex justify-content-between mt-3">
                    <small><i class="bi bi-clock"></i> ${item.duration} dias restantes</small>
                    <small><i class="bi bi-chat-dots"></i> ${item.bids ? item.bids.length : 0} lances</small>
                  </div>
                  <div class="progress mt-2" style="height: 4px;">
                    <div class="progress-bar bg-success" style="width: ${Math.min(100, (item.duration / 30) * 100)}%"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  });
})();