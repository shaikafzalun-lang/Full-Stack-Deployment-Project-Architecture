/* ============================================================
   js/store.js — State Management Module (Cart + Wishlist)
   Author: Afzalun Shaik
============================================================ */

const Store = (() => {

  /* ---- State ---- */
  let state = {
    cart:      [],
    wishlist:  [],
    theme:     localStorage.getItem('sf_theme') || 'dark',
  };

  /* ---- Subscribers (pub/sub) ---- */
  const subscribers = {};

  function subscribe(event, fn) {
    if (!subscribers[event]) subscribers[event] = [];
    subscribers[event].push(fn);
  }

  function emit(event, data) {
    (subscribers[event] || []).forEach(fn => fn(data));
  }

  /* ---- Persistence ---- */
  function persist() {
    localStorage.setItem('sf_cart',     JSON.stringify(state.cart));
    localStorage.setItem('sf_wishlist', JSON.stringify(state.wishlist));
  }

  function hydrate() {
    try {
      const cart = localStorage.getItem('sf_cart');
      const wish = localStorage.getItem('sf_wishlist');
      if (cart) state.cart     = JSON.parse(cart);
      if (wish) state.wishlist = JSON.parse(wish);
    } catch { /* ignore corrupted data */ }
  }

  /* ---- Cart Actions ---- */
  function addToCart(product, qty = 1) {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({ ...product, qty });
    }
    persist();
    emit('cart:updated', state.cart);
    emit('toast', { msg: `${product.name} added to cart`, type: 'success' });
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    persist();
    emit('cart:updated', state.cart);
  }

  function updateQty(productId, qty) {
    if (qty <= 0) { removeFromCart(productId); return; }
    const item = state.cart.find(i => i.id === productId);
    if (item) item.qty = qty;
    persist();
    emit('cart:updated', state.cart);
  }

  function clearCart() {
    state.cart = [];
    persist();
    emit('cart:updated', state.cart);
  }

  function getCart()      { return [...state.cart]; }
  function getCartCount() { return state.cart.reduce((acc, i) => acc + i.qty, 0); }
  function getCartTotal() { return state.cart.reduce((acc, i) => acc + i.price * i.qty, 0); }

  /* ---- Wishlist Actions ---- */
  function toggleWishlist(product) {
    const idx = state.wishlist.findIndex(i => i.id === product.id);
    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
      emit('toast', { msg: `Removed from wishlist`, type: 'info' });
    } else {
      state.wishlist.push({ id: product.id, name: product.name });
      emit('toast', { msg: `${product.name} wishlisted ❤️`, type: 'success' });
    }
    persist();
    emit('wishlist:updated', state.wishlist);
  }

  function isWishlisted(id) { return state.wishlist.some(i => i.id === id); }

  /* ---- Theme ---- */
  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sf_theme', theme);
    const btn = document.getElementById('themeBtn');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function toggleTheme() {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  function getTheme() { return state.theme; }

  /* ---- Init ---- */
  function init() {
    hydrate();
    setTheme(state.theme);
  }

  return {
    init,
    subscribe, emit,
    addToCart, removeFromCart, updateQty, clearCart,
    getCart, getCartCount, getCartTotal,
    toggleWishlist, isWishlisted,
    setTheme, toggleTheme, getTheme,
  };
})();
