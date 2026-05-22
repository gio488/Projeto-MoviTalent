(function() {
  
  setTimeout(function() {
    if (typeof window.updateNavbarUI === 'function') {
      window.updateNavbarUI();
    }
  }, 100);
  
  const form = document.getElementById('newItemForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const title = document.getElementById('itemTitle').value;
      const category = document.getElementById('itemCategory').value;
      const desc = document.getElementById('itemDesc').value;
      const qty = document.getElementById('itemQuantity').value;
      const addr = document.getElementById('itemAddress').value;
      const duration = document.getElementById('itemDuration').value;
      
      if (!title || !category || !desc || !qty || !addr) {
        alert("Preencha todos os campos!");
        return;
      }
      
      const city = addr.split(',')[0];
      if (window.addNewItem(title, category, desc, qty, city, addr, duration)) {
        window.location.href = 'dashboard.html';
      }
    });
  }
})();