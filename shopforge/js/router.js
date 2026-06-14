/* ============================================================
   js/router.js — Client-Side Hash Router
   Author: Afzalun Shaik

   Routes:
     #/          → Home
     #/catalog   → Catalog (with optional query params)
     #/product/:id → Product detail
     #/about     → About
     *           → 404
============================================================ */

const Router = (() => {

  /* ---- Route definitions ---- */
  const routes = [
    { pattern: /^\/$|^$/, handler: routeHome },
    { pattern: /^\/catalog/, handler: routeCatalog },
    { pattern: /^\/product\/(.+)/, handler: routeProduct },
    { pattern: /^\/about$/, handler: routeAbout },
  ];

  /* ---- Current catalog filter state (persisted during session) ---- */
  let catalogState = {
    cat:      'All',
    sort:     'rating',
    maxPrice: 60000,
    minRating: 0,
    view:     'grid',
  };

  /* ---- Route Handlers ---- */
  function routeHome()           { render(Pages.home()); }
  function routeAbout()          { render(Pages.about()); }
  function routeProduct([,id])   { render(Pages.product(id)); window.scrollTo(0, 0); }
  function routeCatalog()        { render(Pages.catalog(catalogState)); bindCatalogEvents(); }

  function routeNotFound()       { render(Pages.notFound()); }

  /* ---- Core render ---- */
  function render(html) {
    const root = document.getElementById('appRoot');
    root.innerHTML = html;
    root.classList.remove('page-enter');
    void root.offsetHeight; // force reflow
    root.classList.add('page-enter');
    updateNavLinks();
    bindGlobalClickEvents();
    bindProductDetailEvents();
  }

  /* ---- Navigate ---- */
  function navigate(path) {
    window.location.hash = path;
  }

  /* ---- Parse current hash ---- */
  function parsePath() {
    const hash = window.location.hash.replace(/^#/, '') || '/';
    return hash;
  }

  /* ---- Dispatch route ---- */
  function dispatch() {
    const path  = parsePath();
    let matched = false;
    for (const route of routes) {
      const m = path.match(route.pattern);
      if (m) { route.handler(m); matched = true; break; }
    }
    if (!matched) routeNotFound();
  }

  /* ---- Update active nav link ---- */
  function updateNavLinks() {
    const path = parsePath();
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href').replace(/^#/, '');
      const isActive = href === '/' ? path === '/' || path === '' : path.startsWith(href);
      link.classList.toggle('active', isActive);
    });
  }

  /* ---- Delegated global click handler ---- */
  function bindGlobalClickEvents() {
    document.getElementById('appRoot').addEventListener('click', handleClick);
    document.getElementById('appRoot').addEventListener('keydown', handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target.closest('[data-action]');
      if (target) { e.preventDefault(); handleAction(target); }
    }
  }

  function handleClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    e.preventDefault();
    handleAction(target);
  }

  function handleAction(el) {
    const action = el.dataset.action;
    const id     = el.dataset.id;
    const cat    = el.dataset.cat;

    switch (action) {
      case 'nav-product':
        navigate(`/product/${id}`);
        break;

      case 'add-cart': {
        const product = ProductData.getById(id);
        if (product) Store.addToCart(product);
        // Animate the button
        el.textContent = '✓';
        el.style.background = 'var(--success)';
        setTimeout(() => { el.textContent = '+'; el.style.background = ''; }, 800);
        break;
      }

      case 'wishlist': {
        const product = ProductData.getById(id);
        if (product) {
          Store.toggleWishlist(product);
          el.textContent = Store.isWishlisted(id) ? '❤️' : '🤍';
          el.classList.toggle('active', Store.isWishlisted(id));
        }
        break;
      }

      case 'go-catalog':
        if (cat) catalogState.cat = cat;
        navigate('/catalog');
        break;

      case 'filter-cat':
        catalogState.cat = cat;
        navigate('/catalog');
        break;

      case 'filter-rating':
        catalogState.minRating = parseFloat(el.dataset.rating);
        navigate('/catalog');
        break;

      case 'filter-reset':
        catalogState = { cat: 'All', sort: 'rating', maxPrice: 60000, minRating: 0, view: 'grid' };
        navigate('/catalog');
        break;

      case 'set-view':
        catalogState.view = el.dataset.view;
        navigate('/catalog');
        break;
    }
  }

  /* ---- Catalog-specific events (sort, price range) ---- */
  function bindCatalogEvents() {
    const sortSel = document.getElementById('sortSelect');
    if (sortSel) {
      sortSel.addEventListener('change', (e) => {
        catalogState.sort = e.target.value;
        navigate('/catalog');
      });
    }

    const priceRange = document.getElementById('priceRange');
    const priceLabel = document.getElementById('priceLabel');
    if (priceRange) {
      priceRange.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        priceLabel.textContent = `Up to ₹${val.toLocaleString('en-IN')}`;
      });
      priceRange.addEventListener('change', (e) => {
        catalogState.maxPrice = parseInt(e.target.value);
        navigate('/catalog');
      });
    }
  }

  /* ---- Product detail events (qty, add-to-cart, wishlist) ---- */
  function bindProductDetailEvents() {
    let qty = 1;

    const qtyNum = document.getElementById('qtyNum');
    const qtyDec = document.getElementById('qtyDec');
    const qtyInc = document.getElementById('qtyInc');
    const addBtn = document.getElementById('detailAddCart');
    const wishBtn = document.getElementById('detailWishlist');

    if (qtyDec) {
      qtyDec.addEventListener('click', () => {
        if (qty > 1) { qty--; qtyNum.textContent = qty; }
      });
    }
    if (qtyInc) {
      qtyInc.addEventListener('click', () => {
        qty++;
        qtyNum.textContent = qty;
      });
    }
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const product = ProductData.getById(addBtn.dataset.id);
        if (product) {
          Store.addToCart(product, qty);
          addBtn.textContent = `✓ Added ${qty}`;
          addBtn.style.background = 'var(--success)';
          setTimeout(() => {
            addBtn.textContent = 'Add to cart';
            addBtn.style.background = '';
            qty = 1;
            if (qtyNum) qtyNum.textContent = 1;
          }, 1200);
        }
      });
    }
    if (wishBtn) {
      wishBtn.addEventListener('click', () => {
        const product = ProductData.getById(wishBtn.dataset.id);
        if (product) {
          Store.toggleWishlist(product);
          const isW = Store.isWishlisted(product.id);
          wishBtn.textContent = isW ? '❤️' : '🤍';
          wishBtn.style.background = isW ? 'rgba(239,68,68,0.1)' : 'var(--surface)';
          wishBtn.style.borderColor = isW ? 'rgba(239,68,68,0.3)' : 'var(--border)';
        }
      });
    }
  }

  /* ---- Init ---- */
  function init() {
    window.addEventListener('hashchange', dispatch);
    dispatch(); // Handle initial load
  }

  return { init, navigate };
})();
