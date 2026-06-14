# ShopForge — E-Commerce Product Catalog
### Internship Capstone Project · Afzalun Shaik · 2026

A **production-ready**, **framework-free** single-page e-commerce catalog demonstrating modular front-end architecture, client-side routing, state management, and deployment best practices.

---

## 🚀 Live Demo

Deploy in 2 minutes → **[Netlify Instructions Below](#deployment)**

---

## ✨ Features

| Feature | Implementation |
|---|---|
| Client-side routing | Hash-based SPA router (`#/`, `#/catalog`, `#/product/:id`, `#/about`) |
| State management | Pub/Sub store module with localStorage persistence |
| Shopping cart | Full add / remove / qty update / checkout flow |
| Wishlist | Per-product toggle, persisted across reloads |
| Product catalog | Category filters, price range, rating filter, sort, grid/list view |
| Global search | Debounced live search across all 12 products |
| Dark / Light mode | CSS custom properties toggle, preference saved |
| Responsive design | Mobile-first, works on 320px → 4K |
| Accessibility | ARIA labels, keyboard navigation, focus-visible, reduced-motion |
| Performance | Zero dependencies, CSS split into 6 modules, font preloading |

---

## 📁 Project Architecture

```
shopforge/
├── index.html           # SPA shell — single entry point
├── netlify.toml         # Netlify deployment + headers config
│
├── css/
│   ├── tokens.css       # Design tokens (colors, spacing, fonts)
│   ├── base.css         # Reset + typography
│   ├── components.css   # Reusable UI components (nav, cards, cart, toast)
│   ├── layout.css       # Page-level grid layouts
│   ├── pages.css        # Page-specific styles
│   └── responsive.css   # Media queries (mobile-first)
│
└── js/
    ├── data.js          # Product catalog data module
    ├── store.js         # State management (pub/sub + localStorage)
    ├── components.js    # Reusable render functions
    ├── pages.js         # Page view functions (home, catalog, product, about)
    ├── router.js        # Hash-based SPA router
    └── app.js           # Bootstrap + global event wiring
```

---

## 🏗 Architecture Decisions

### Client-Side Routing
Uses the `hashchange` event (`#/path`) so the app works on any static host without server config. Pattern-matched routes dispatch to page render functions.

### State Management (Pub/Sub)
`store.js` implements a lightweight publish/subscribe pattern. Components subscribe to events (`cart:updated`, `toast`) rather than tightly coupling to each other.

### Modular CSS
Six CSS files, each with a single responsibility. CSS custom properties (variables) handle theming — switching dark/light requires changing one attribute on `<html>`.

### Zero Dependencies
No React, Vue, Tailwind, or bundler. Ships as-is to a CDN. Total size: ~40KB uncompressed.

---

## 🌐 Deployment

### Option 1: Netlify (Recommended — 2 minutes)
1. Zip the `shopforge/` folder
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the zip → instant live URL

Or via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

### Option 2: Vercel
```bash
npm install -g vercel
cd shopforge
vercel --prod
```

### Option 3: GitHub Pages
1. Push `shopforge/` contents to a GitHub repo
2. Settings → Pages → Deploy from branch (main, / root)
3. Live at `https://username.github.io/repo-name`

---

## 🛠 Development

No build step required. Just open `index.html` in a browser. For best results use a local server:

```bash
# Python
python -m http.server 3000

# Node
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

---

## 📋 Internship Task Coverage

| Task | Module |
|---|---|
| CSS Grid layouts | `layout.css`, hero bento grid, catalog, product detail |
| Flexbox alignment | `components.css`, nav, cards, cart |
| CSS Variables / Dark mode | `tokens.css` + theme toggle in `store.js` |
| Mobile-first responsive | `pages.css` responsive section |
| DOM manipulation | `components.js`, `pages.js` |
| Event delegation | `router.js` `handleClick()`, `app.js` cart events |
| localStorage persistence | `store.js` `persist()` / `hydrate()` |
| CRUD operations | Cart: add, read, update qty, delete |
| Filtering + search | Catalog filters in `router.js` + `data.js` search |
| Async patterns | Debounced search in `app.js` |
| Client-side routing | `router.js` full hash router |
| Modular architecture | 6 CSS + 6 JS modules, each single-responsibility |
| Deployment | `netlify.toml` with headers + redirect config |

---

**Built with ❤️ by Afzalun Shaik · Internship Capstone 2025**
