/* ============================================================
   js/app.js — Application Bootstrap & Global Event Wiring
   Author: Afzalun Shaik

   Module load order (defined in index.html):
     data.js → store.js → components.js → pages.js → router.js → app.js
============================================================ */

const App = (() => {

  /* ---- Init ---- */
  function init() {
    Store.init();
    wirePersistentUI();
    Router.init();
    Store.subscribe('cart:updated', onCartUpdated);
    Store.subscribe('toast', onToast);
    updateBadge();
  }

  /* ---- Subscribe to Store events ---- */
  function onCartUpdated() {
    Components.updateCartBadge();
    // Re-render cart if it's open
    if (!document.getElementById('cartOverlay').hasAttribute('hidden')) {
      Components.renderCart();
    }
  }

  function onToast({ msg, type }) {
    Components.Toast.show(msg, type);
  }

  /* ---- Persistent UI (nav, search, cart) ---- */
  function wirePersistentUI() {
    // Theme toggle
    document.getElementById('themeBtn').addEventListener('click', () => {
      Store.toggleTheme();
    });

    // Hamburger
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      mobileMenu.setAttribute('aria-hidden', !open);
    });

    // Cart
    document.getElementById('cartBtn').addEventListener('click', Components.openCart);
    document.getElementById('cartClose').addEventListener('click', Components.closeCart);

    // Cart delegated events (qty, remove)
    document.getElementById('cartItems').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id     = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'qty-inc')     Store.updateQty(id, getItemQty(id) + 1);
      if (action === 'qty-dec')     Store.updateQty(id, getItemQty(id) - 1);
      if (action === 'remove-cart') Store.removeFromCart(id);
    });

    // Backdrop click closes overlays
    document.getElementById('backdrop').addEventListener('click', () => {
      Components.closeCart();
    });

    // Search
    document.getElementById('navSearchBtn').addEventListener('click', Components.openSearch);
    document.getElementById('searchClose').addEventListener('click', Components.closeSearch);

    const searchInput = document.getElementById('globalSearch');
    searchInput.addEventListener('input', debounce((e) => {
      const results = ProductData.search(e.target.value);
      renderSearchResults(results);
    }, 220));

    // Search result click
    document.getElementById('searchResults').addEventListener('click', (e) => {
      const item = e.target.closest('[data-action="nav-product"]');
      if (!item) return;
      Components.closeSearch();
      Router.navigate(`/product/${item.dataset.id}`);
    });

    // Keyboard: Escape closes overlays, '/' opens search
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        Components.closeCart();
        Components.closeSearch();
      }
      if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        Components.openSearch();
      }
    });
  }

  /* ---- Search render ---- */
  function renderSearchResults(results) {
    const el = document.getElementById('searchResults');
    if (!results.length) {
      el.innerHTML = `<div style="padding:var(--space-6);text-align:center;color:var(--text-3);font-size:0.875rem">No products found</div>`;
      return;
    }
    el.innerHTML = results.slice(0, 8).map(Components.searchResult).join('');
  }

  /* ---- Helpers ---- */
  function getItemQty(id) {
    return Store.getCart().find(i => i.id === id)?.qty || 0;
  }

  function updateBadge() {
    Components.updateCartBadge();
  }

  function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').setAttribute('aria-expanded', false);
    document.getElementById('mobileMenu').setAttribute('aria-hidden', true);
  }

  /* ---- Debounce utility ---- */
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  /* ---- Public API ---- */
  return { init, closeMobileMenu };
})();

/* ---- Bootstrap on DOM ready ---- */
document.addEventListener('DOMContentLoaded', App.init);
