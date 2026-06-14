/* ============================================================
   js/pages.js — Page Render Functions (SPA Views)
   Author: Afzalun Shaik
============================================================ */

const Pages = (() => {

  const fmt = (p) => `₹${p.toLocaleString('en-IN')}`;

  /* ============================================================
     HOME PAGE
  ============================================================ */
  function home() {
    const featured  = ProductData.getFeatured();
    const products  = ProductData.getAll();
    const catEmojis = ProductData.getCategoryEmojis();
    const cats      = ProductData.getCategories().filter(c => c !== 'All');

    const heroProducts = products.slice(0, 4);
    const newArrivals  = products.filter(p => p.badge === 'new' || p.badge === 'hot').slice(0, 4);
    const bestSellers  = products.filter(p => p.rating >= 4.6).slice(0, 4);

    return `
      <!-- HERO -->
      <section class="hero" aria-label="Hero">
        <div class="hero__inner">
          <div class="hero__left">
            <div class="hero__eyebrow">Free shipping above ₹2,000</div>
            <h1 class="hero__title">
              Tech that fits<br>your <em>workflow</em>.
            </h1>
            <p class="hero__desc">
              Curated hardware and accessories for creators, engineers, and power users.
              Hand-picked for quality, priced for real budgets.
            </p>
            <div class="hero__actions">
              <a href="#/catalog" class="btn btn--primary btn--lg">Shop Now →</a>
              <a href="#/about" class="btn btn--ghost btn--lg">Our story</a>
            </div>
          </div>
          <div class="hero__visual" aria-hidden="true">
            ${heroProducts.map(p => `
              <div class="hero__product-preview">
                <div class="hero__preview-emoji">${p.emoji}</div>
                <div class="hero__preview-name">${p.name.split(' ').slice(0,2).join(' ')}</div>
                <div class="hero__preview-price">${fmt(p.price)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- STATS -->
      <div class="hero-stats" aria-label="Stats">
        <div class="hero-stats__inner">
          <div>
            <div class="hero-stat__val"><span>12</span>K+</div>
            <div class="hero-stat__label">Happy customers</div>
          </div>
          <div>
            <div class="hero-stat__val"><span>${products.length}</span></div>
            <div class="hero-stat__label">Products in catalog</div>
          </div>
          <div>
            <div class="hero-stat__val"><span>4.7</span>★</div>
            <div class="hero-stat__label">Average rating</div>
          </div>
          <div>
            <div class="hero-stat__val"><span>24h</span></div>
            <div class="hero-stat__label">Express delivery</div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="section">
        <div class="container">

          <!-- CATEGORIES -->
          ${Components.sectionLabel('Browse by category')}
          <div class="categories-row" role="list">
            ${cats.map(c => `
              <div class="category-pill" role="listitem" data-action="go-catalog" data-cat="${c}" tabindex="0" aria-label="Browse ${c}">
                <div class="category-pill__icon" aria-hidden="true">${catEmojis[c] || '📦'}</div>
                <div class="category-pill__name">${c}</div>
              </div>
            `).join('')}
          </div>

          <!-- FEATURED BENTO GRID -->
          ${Components.sectionLabel('Featured this week')}
          <div class="featured-grid" aria-label="Featured products">
            ${featured.map(p => `
              <div class="featured-card" data-action="nav-product" data-id="${p.id}" tabindex="0" role="article" aria-label="${p.name}">
                <div class="featured-card__glow" aria-hidden="true"></div>
                <div class="featured-card__emoji" aria-hidden="true">${p.emoji}</div>
                <div class="featured-card__cat">${p.category}</div>
                <div class="featured-card__name">${p.name}</div>
                <div class="featured-card__price">${fmt(p.price)}</div>
              </div>
            `).join('')}
          </div>

          <!-- PROMO BANNER -->
          <div class="promo-banner" aria-label="Promotion">
            <div>
              <div class="promo-banner__title">Flash Sale: Up to 30% off</div>
              <div class="promo-banner__sub">Limited time on selected peripherals and accessories</div>
            </div>
            <a href="#/catalog" class="btn btn--ghost btn--lg" style="background:rgba(255,255,255,0.15);color:#fff;border-color:rgba(255,255,255,0.3)">
              View deals →
            </a>
          </div>

          <!-- NEW ARRIVALS -->
          ${Components.sectionLabel('New &amp; trending')}
          <div class="product-grid" style="margin-bottom:var(--space-16)" aria-label="New arrivals">
            ${newArrivals.map(p => Components.productCard(p)).join('')}
          </div>

          <!-- BEST SELLERS -->
          ${Components.sectionLabel('Best sellers')}
          <div class="product-grid" aria-label="Best sellers">
            ${bestSellers.map(p => Components.productCard(p)).join('')}
          </div>

        </div>
      </div>
    `;
  }

  /* ============================================================
     CATALOG PAGE
  ============================================================ */
  function catalog(opts = {}) {
    const { cat = 'All', sort = 'rating', maxPrice = 60000, minRating = 0, view = 'grid' } = opts;
    let products = ProductData.getByCategory(cat);
    products = products.filter(p => p.price <= maxPrice && p.rating >= minRating);
    if (sort === 'price-asc')  products = [...products].sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') products = [...products].sort((a,b) => b.price - a.price);
    if (sort === 'rating')     products = [...products].sort((a,b) => b.rating - a.rating);
    if (sort === 'newest')     products = [...products].sort((a,b) => b.id.localeCompare(a.id));

    const cats    = ProductData.getCategories();
    const catEmojis = ProductData.getCategoryEmojis();

    return `
      <div class="section">
        <div class="container">
          <h1 style="margin-bottom:var(--space-8)">Catalog</h1>
          <div class="catalog-layout">

            <!-- SIDEBAR -->
            <aside class="catalog-sidebar" aria-label="Filter options">

              <div class="sidebar-section">
                <div class="sidebar-section__title">Category</div>
                ${cats.map(c => `
                  <div class="filter-option${cat === c ? ' active' : ''}" data-action="filter-cat" data-cat="${c}" role="button" tabindex="0" aria-pressed="${cat === c}">
                    <span aria-hidden="true">${catEmojis[c] || '📦'}</span> ${c}
                    <span class="filter-option__count">${ProductData.getByCategory(c).length}</span>
                  </div>
                `).join('')}
              </div>

              <div class="sidebar-section">
                <div class="sidebar-section__title">Max price</div>
                <div class="price-range-track">
                  <input type="range" id="priceRange" min="1000" max="60000" step="1000" value="${maxPrice}" aria-label="Max price filter" />
                </div>
                <div class="price-labels">
                  <span>₹1,000</span>
                  <span id="priceLabel">Up to ${fmt(maxPrice)}</span>
                </div>
              </div>

              <div class="sidebar-section">
                <div class="sidebar-section__title">Min rating</div>
                <div class="rating-filter" role="group" aria-label="Minimum rating">
                  ${[0,4,4.5,4.8].map(r => `
                    <div class="rating-option${minRating === r ? ' active' : ''}" data-action="filter-rating" data-rating="${r}" role="button" tabindex="0" aria-pressed="${minRating === r}">
                      ${r === 0 ? 'Any rating' : `${r}+ ★`}
                    </div>
                  `).join('')}
                </div>
              </div>

              <button class="btn btn--ghost btn--sm btn--full" data-action="filter-reset" style="margin-top:var(--space-4)">Reset filters</button>
            </aside>

            <!-- MAIN -->
            <div>
              <div class="catalog-toolbar">
                <div class="catalog-toolbar__left">
                  <span class="catalog-toolbar__count">${products.length} product${products.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="catalog-toolbar__right">
                  <select class="sort-select" id="sortSelect" aria-label="Sort products">
                    <option value="rating"     ${sort === 'rating'     ? 'selected' : ''}>Top rated</option>
                    <option value="price-asc"  ${sort === 'price-asc'  ? 'selected' : ''}>Price: Low → High</option>
                    <option value="price-desc" ${sort === 'price-desc' ? 'selected' : ''}>Price: High → Low</option>
                    <option value="newest"     ${sort === 'newest'     ? 'selected' : ''}>Newest</option>
                  </select>
                  <div class="view-toggle" role="group" aria-label="View mode">
                    <button class="view-toggle-btn${view === 'grid' ? ' active' : ''}" data-action="set-view" data-view="grid" aria-label="Grid view" aria-pressed="${view === 'grid'}">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="0" y="0" width="6" height="6" rx="1"/><rect x="10" y="0" width="6" height="6" rx="1"/><rect x="0" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/></svg>
                    </button>
                    <button class="view-toggle-btn${view === 'list' ? ' active' : ''}" data-action="set-view" data-view="list" aria-label="List view" aria-pressed="${view === 'list'}">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="0" y="0" width="16" height="4" rx="1"/><rect x="0" y="6" width="16" height="4" rx="1"/><rect x="0" y="12" width="16" height="4" rx="1"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              ${products.length
                ? `<div class="product-grid${view === 'list' ? ' list-view' : ''}" aria-label="Product listings">
                    ${products.map(p => Components.productCard(p)).join('')}
                  </div>`
                : `<div style="text-align:center;padding:var(--space-20) 0;color:var(--text-3)">
                    <div style="font-size:3rem;margin-bottom:var(--space-4)">🔍</div>
                    <p>No products match your filters.</p>
                    <button class="btn btn--ghost btn--sm" data-action="filter-reset" style="margin-top:var(--space-4)">Reset filters</button>
                  </div>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ============================================================
     PRODUCT DETAIL PAGE
  ============================================================ */
  function product(id) {
    const p = ProductData.getById(id);
    if (!p) return notFound();

    const related = ProductData.getRelated(id, 4);
    const disc    = Components.discount(p.originalPrice, p.price);
    const wishlisted = Store.isWishlisted(p.id);

    return `
      <div class="section">
        <div class="container">

          ${Components.breadcrumb([
            { href: '#/', label: 'Home' },
            { href: '#/catalog', label: 'Catalog' },
            { href: '#/catalog', label: p.category },
            { href: '#', label: p.name }
          ])}

          <div class="product-detail-grid">

            <!-- IMAGE -->
            <div class="product-detail-img" aria-label="${p.name} product image">
              <span role="img" aria-label="${p.name}" style="font-size:9rem">${p.emoji}</span>
              ${p.badge ? `<span class="product-card__badge ${p.badge}" style="position:absolute;top:var(--space-5);left:var(--space-5)">${p.badgeLabel}</span>` : ''}
            </div>

            <!-- INFO -->
            <div class="product-detail-info">
              <div>
                <div class="product-card__category" style="font-size:0.8rem;margin-bottom:var(--space-3)">${p.category}</div>
                <h1 style="font-size:clamp(1.6rem,3vw,2.4rem);margin-bottom:var(--space-4)">${p.name}</h1>
                <div class="product-card__rating" style="font-size:0.9rem;margin-bottom:var(--space-5)">
                  <span class="product-card__stars">${Components.stars(p.rating)}</span>
                  <span>${p.rating}</span>
                  <span>(${p.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>

              <div class="product-detail-price">
                <div class="product-detail-price__now">${fmt(p.price)}</div>
                ${p.originalPrice ? `<div class="product-detail-price__was">${fmt(p.originalPrice)}</div>` : ''}
                ${disc ? `<div class="product-detail-price__save">Save ${disc}%</div>` : ''}
              </div>

              <p style="color:var(--text-2);line-height:1.75">${p.description}</p>

              <div style="display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap">
                <div class="qty-selector" aria-label="Quantity">
                  <button class="qty-selector__btn" id="qtyDec" aria-label="Decrease">−</button>
                  <span class="qty-selector__num" id="qtyNum">1</span>
                  <button class="qty-selector__btn" id="qtyInc" aria-label="Increase">+</button>
                </div>
                ${p.inStock
                  ? `<button class="btn btn--primary btn--lg" id="detailAddCart" data-id="${p.id}" style="flex:1" aria-label="Add ${p.name} to cart">Add to cart</button>`
                  : `<button class="btn btn--ghost btn--lg" disabled style="flex:1">Out of stock</button>`
                }
                <button
                  class="icon-btn${wishlisted ? '' : ''}"
                  id="detailWishlist"
                  data-id="${p.id}"
                  aria-label="${wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
                  style="background:${wishlisted ? 'rgba(239,68,68,0.1)' : 'var(--surface)'};border-color:${wishlisted ? 'rgba(239,68,68,0.3)' : 'var(--border)'}"
                >${wishlisted ? '❤️' : '🤍'}</button>
              </div>

              <div style="display:flex;gap:var(--space-3);flex-wrap:wrap">
                <span class="tag">✅ Genuine product</span>
                <span class="tag">📦 Free delivery</span>
                <span class="tag">🔄 30-day returns</span>
              </div>

              <div>
                <h3 style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-4)">Specifications</h3>
                <div class="spec-table" role="table" aria-label="Product specifications">
                  ${Object.entries(p.specs).map(([k,v]) =>
                    `<div class="spec-row" role="row">
                      <div class="spec-row__key" role="rowheader">${k}</div>
                      <div class="spec-row__val" role="cell">${v}</div>
                    </div>`
                  ).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- RELATED PRODUCTS -->
          <div style="margin-top:var(--space-20)">
            ${Components.sectionLabel('You might also like')}
            <div class="related-grid">
              ${related.map(p => Components.productCard(p)).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  }

  /* ============================================================
     ABOUT PAGE
  ============================================================ */
  function about() {
    return `
      <div class="section">
        <div class="container">
          <div class="about-hero">
            <div class="hero__eyebrow" style="display:inline-flex;margin-bottom:var(--space-5)">Est. 2025 · Hyderabad</div>
            <h1>Built by a developer,<br><em>for developers.</em></h1>
            <p class="about-hero__subtitle">ShopForge started as an internship capstone project and grew into a full demonstration of modern front-end engineering — from responsive CSS to client-side routing.</p>
          </div>

          <div class="about-grid">
            <div class="about-card">
              <div class="about-card__icon">🏗</div>
              <div class="about-card__title">Modular Architecture</div>
              <p class="about-card__desc">Six CSS modules, five JS modules, a hash router, a pub/sub state store — built without any framework, just clean vanilla JavaScript.</p>
            </div>
            <div class="about-card">
              <div class="about-card__icon">⚡</div>
              <div class="about-card__title">Performance First</div>
              <p class="about-card__desc">Zero runtime dependencies. Google Fonts with display=swap. CSS custom properties for instant theme switching. Lazy animations.</p>
            </div>
            <div class="about-card">
              <div class="about-card__icon">♿</div>
              <div class="about-card__title">Accessible by Default</div>
              <p class="about-card__desc">ARIA labels throughout, keyboard navigation, focus-visible rings, reduced-motion support, and semantic HTML on every page.</p>
            </div>
          </div>

          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:var(--space-12);max-width:760px;margin:0 auto">
            <h2 style="font-family:var(--font-display);font-size:1.8rem;margin-bottom:var(--space-6)">About the developer</h2>
            <div style="display:flex;gap:var(--space-8);align-items:flex-start;flex-wrap:wrap">
              <div style="width:100px;height:100px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:2rem;color:#fff;flex-shrink:0;">AS</div>
              <div style="flex:1;min-width:200px">
                <h3 style="font-family:var(--font-body);font-size:1.2rem;font-weight:600;margin-bottom:var(--space-2)">Afzalun Shaik</h3>
                <p style="color:var(--accent-2);font-size:0.85rem;font-weight:600;margin-bottom:var(--space-4)">Frontend Engineering Intern · TechNova Labs, Hyderabad</p>
                <p style="margin-bottom:var(--space-4)">This capstone project demonstrates proficiency in responsive CSS architecture, SPA routing, state management, async data fetching, and production deployment — all without a framework.</p>
                <div style="display:flex;gap:var(--space-3);flex-wrap:wrap">
                  <span class="tag">HTML5</span><span class="tag">CSS Grid</span><span class="tag">Flexbox</span>
                  <span class="tag">Vanilla JS</span><span class="tag">SPA Router</span><span class="tag">localStorage</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  /* ============================================================
     404 PAGE
  ============================================================ */
  function notFound() {
    return `
      <div class="section">
        <div class="container">
          <div class="not-found">
            <div class="not-found__code" aria-hidden="true">404</div>
            <h2>Page not found</h2>
            <p style="margin:var(--space-4) 0 var(--space-8)">The page you're looking for doesn't exist.</p>
            <a href="#/" class="btn btn--primary btn--lg">Back to home</a>
          </div>
        </div>
      </div>
    `;
  }

  return { home, catalog, product, about, notFound };
})();
