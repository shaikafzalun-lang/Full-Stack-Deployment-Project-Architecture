/* ============================================================
   js/components.js — Reusable UI Component Renderers
   Author: Afzalun Shaik
============================================================ */

const Components = (() => {

  /* ---- UTILS ---- */
  const fmt = (price) => `₹${price.toLocaleString('en-IN')}`;

  function stars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  function discount(original, current) {
    if (!original) return null;
    return Math.round(((original - current) / original) * 100);
  }

  /* ---- PRODUCT CARD ---- */
  function productCard(product, opts = {}) {
    const { compact = false } = opts;
    const disc = discount(product.originalPrice, product.price);
    const wishlisted = Store.isWishlisted(product.id);

    return `
      <article
        class="product-card"
        data-id="${product.id}"
        role="article"
        aria-label="${product.name}"
      >
        <div class="product-card__img-wrap">
          <span class="product-card__emoji" aria-hidden="true">${product.emoji}</span>
          ${product.badge ? `<span class="product-card__badge ${product.badge}">${product.badgeLabel}</span>` : ''}
          ${disc ? `<span class="product-card__badge sale" style="left:auto;right:var(--space-3);${product.badge ? 'top:calc(var(--space-3) + 28px)' : ''}">-${disc}%</span>` : ''}
          <button
            class="product-card__wishlist${wishlisted ? ' active' : ''}"
            data-action="wishlist"
            data-id="${product.id}"
            aria-label="${wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
          >${wishlisted ? '❤️' : '🤍'}</button>
        </div>
        <div class="product-card__body">
          <div class="product-card__category">${product.category}</div>
          <div class="product-card__name">${product.name}</div>
          <div class="product-card__rating" aria-label="Rating: ${product.rating} out of 5">
            <span class="product-card__stars" aria-hidden="true">${stars(product.rating)}</span>
            <span>${product.rating}</span>
            <span>(${product.reviews.toLocaleString()})</span>
          </div>
          <div class="product-card__footer">
            <div class="product-card__price">
              <span class="product-card__price-now">${fmt(product.price)}</span>
              ${product.originalPrice ? `<span class="product-card__price-was">${fmt(product.originalPrice)}</span>` : ''}
            </div>
            ${product.inStock
              ? `<button class="product-card__add" data-action="add-cart" data-id="${product.id}" aria-label="Add ${product.name} to cart">+</button>`
              : `<span style="font-size:0.72rem;color:var(--danger);font-weight:600;">Out of stock</span>`
            }
          </div>
        </div>
      </article>
    `;
  }

  /* ---- CART ITEM ---- */
  function cartItem(item) {
    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__emoji" aria-hidden="true">${item.emoji}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__price">${fmt(item.price)} each</div>
        </div>
        <div class="cart-item__qty" role="group" aria-label="Quantity for ${item.name}">
          <button class="cart-item__qty-btn" data-action="qty-dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="cart-item__qty-num">${item.qty}</span>
          <button class="cart-item__qty-btn" data-action="qty-inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <button class="cart-item__remove" data-action="remove-cart" data-id="${item.id}" aria-label="Remove ${item.name}">✕</button>
      </div>
    `;
  }

  /* ---- CART SIDEBAR ---- */
  function renderCart() {
    const items    = Store.getCart();
    const total    = Store.getCartTotal();
    const count    = Store.getCartCount();
    const itemsEl  = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');

    if (!items.length) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty__icon">🛒</div>
          <div class="cart-empty__text">Your cart is empty.<br>Start adding products!</div>
        </div>`;
      footerEl.innerHTML = '';
      return;
    }

    itemsEl.innerHTML = items.map(cartItem).join('');
    footerEl.innerHTML = `
      <div class="cart-total">
        <span class="cart-total__label">Total (${count} item${count !== 1 ? 's' : ''})</span>
        <span class="cart-total__val">${fmt(total)}</span>
      </div>
      <button class="btn btn--primary btn--full" id="checkoutBtn">Checkout →</button>
      <button class="btn btn--ghost btn--full btn--sm" id="clearCartBtn">Clear cart</button>
    `;

    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
      closeCart();
      Toast.show('🎉 Order placed! (Demo)', 'success');
      Store.clearCart();
    });

    document.getElementById('clearCartBtn')?.addEventListener('click', () => {
      Store.clearCart();
    });
  }

  /* ---- CART BADGE ---- */
  function updateCartBadge() {
    const count = Store.getCartCount();
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }

  /* ---- SEARCH RESULTS ---- */
  function searchResult(product) {
    return `
      <div class="search-result-item" data-action="nav-product" data-id="${product.id}" role="option" tabindex="0" aria-label="${product.name}">
        <div class="search-result-item__icon" aria-hidden="true">${product.emoji}</div>
        <div class="search-result-item__info">
          <div class="search-result-item__name">${product.name}</div>
          <div class="search-result-item__cat">${product.category}</div>
        </div>
        <div class="search-result-item__price">${fmt(product.price)}</div>
      </div>
    `;
  }

  /* ---- TOAST ---- */
  const Toast = {
    show(msg, type = 'info') {
      const container = document.getElementById('toastContainer');
      const el = document.createElement('div');
      el.className = `toast ${type}`;
      const icons = { success: '✅', error: '❌', info: 'ℹ️' };
      el.innerHTML = `<span aria-hidden="true">${icons[type] || ''}</span> ${msg}`;
      container.appendChild(el);
      setTimeout(() => el.remove(), 3200);
    }
  };

  /* ---- OVERLAY (cart / search) ---- */
  function openCart() {
    document.getElementById('cartOverlay').removeAttribute('hidden');
    document.getElementById('backdrop').classList.add('visible');
    document.body.style.overflow = 'hidden';
    renderCart();
  }

  function closeCart() {
    document.getElementById('cartOverlay').setAttribute('hidden', '');
    document.getElementById('backdrop').classList.remove('visible');
    document.body.style.overflow = '';
  }

  function openSearch() {
    document.getElementById('searchOverlay').removeAttribute('hidden');
    requestAnimationFrame(() => document.getElementById('globalSearch').focus());
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    document.getElementById('searchOverlay').setAttribute('hidden', '');
    document.body.style.overflow = '';
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('globalSearch').value = '';
  }

  /* ---- SECTION LABEL ---- */
  function sectionLabel(text) {
    return `<div class="section-label">
      <div class="section-label__line"></div>
      <div class="section-label__text">${text}</div>
      <div class="section-label__line"></div>
    </div>`;
  }

  /* ---- BREADCRUMB ---- */
  function breadcrumb(crumbs) {
    return `<nav class="breadcrumb" aria-label="Breadcrumb">
      ${crumbs.map((c, i) =>
        i < crumbs.length - 1
          ? `<a href="${c.href}">${c.label}</a><span class="breadcrumb__sep" aria-hidden="true">/</span>`
          : `<span aria-current="page">${c.label}</span>`
      ).join('')}
    </nav>`;
  }

  return {
    productCard, cartItem, renderCart, updateCartBadge,
    searchResult, sectionLabel, breadcrumb,
    openCart, closeCart, openSearch, closeSearch,
    Toast, fmt, stars, discount
  };
})();
