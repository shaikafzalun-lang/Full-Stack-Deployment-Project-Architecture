/* ============================================================
   js/data.js — Product Catalog Data Module
   Author: Afzalun Shaik
============================================================ */

const ProductData = (() => {

  const PRODUCTS = [
    {
      id: 'p001', name: 'ProMax Studio Headphones',
      category: 'Audio', emoji: '🎧',
      price: 34999, originalPrice: 44999,
      rating: 4.8, reviews: 2140,
      badge: 'best-seller', badgeLabel: 'Best Seller',
      description: 'Studio-grade 40mm drivers with active noise cancellation. 30-hour battery, Bluetooth 5.3, and a foldable design built for creators on the move.',
      specs: { Driver: '40mm Dynamic', 'Frequency Response': '20Hz–20kHz', 'Battery Life': '30 hours', Connectivity: 'Bluetooth 5.3 + 3.5mm', Weight: '250g', 'Noise Cancellation': 'Active (Hybrid)' },
      tags: ['wireless', 'anc', 'studio'], inStock: true, qty: 0
    },
    {
      id: 'p002', name: 'UltraSlim Mechanical Keyboard',
      category: 'Peripherals', emoji: '⌨️',
      price: 12999, originalPrice: 16999,
      rating: 4.6, reviews: 890,
      badge: 'sale', badgeLabel: 'Sale',
      description: 'Low-profile mechanical keyboard with custom linear switches. RGB per-key lighting, hot-swappable, and wireless tri-mode connectivity.',
      specs: { Switches: 'Linear Red (Low-profile)', Layout: 'TKL (87-key)', Connectivity: 'USB-C / 2.4GHz / BT 5.0', Backlight: 'Per-key RGB', 'Battery Life': '40 hours', 'Polling Rate': '1000Hz' },
      tags: ['wireless', 'rgb', 'mechanical'], inStock: true, qty: 0
    },
    {
      id: 'p003', name: 'HoloPro Webcam 4K',
      category: 'Accessories', emoji: '📷',
      price: 9499, originalPrice: 11999,
      rating: 4.5, reviews: 540,
      badge: 'new', badgeLabel: 'New',
      description: 'Broadcast-quality 4K/30fps webcam with Sony sensor, AI background removal, and auto-framing. Plug-and-play with any OS.',
      specs: { Resolution: '4K 30fps / 1080p 60fps', Sensor: 'Sony CMOS 1/2.8"', 'Field of View': '90° (adjustable)', 'AI Features': 'Background blur, auto-frame', Microphone: 'Dual stereo with noise reduction', Interface: 'USB-C 3.2' },
      tags: ['4k', 'streaming', 'remote-work'], inStock: true, qty: 0
    },
    {
      id: 'p004', name: 'Quantum Wireless Mouse',
      category: 'Peripherals', emoji: '🖱️',
      price: 6999, originalPrice: null,
      rating: 4.7, reviews: 1280,
      badge: 'hot', badgeLabel: 'Hot',
      description: 'Ultra-lightweight 58g gaming mouse. 26,000 DPI optical sensor, 90-hour battery via tri-mode wireless. Zero latency at 2.4GHz.',
      specs: { Sensor: '26K DPI Optical', Weight: '58g', Connectivity: '2.4GHz / Bluetooth / USB-C', 'Battery Life': '90 hours', 'Click Lifecycle': '100M clicks', Polling: '1000Hz (wired)' },
      tags: ['gaming', 'lightweight', 'wireless'], inStock: true, qty: 0
    },
    {
      id: 'p005', name: 'ImmersiveX 27" Monitor',
      category: 'Displays', emoji: '🖥️',
      price: 52999, originalPrice: 62999,
      rating: 4.9, reviews: 340,
      badge: null, badgeLabel: null,
      description: '27-inch QHD IPS monitor with 165Hz refresh, 1ms GTG response, and factory-calibrated 99% sRGB. Ideal for both gaming and professional work.',
      specs: { Panel: 'IPS, 27"', Resolution: '2560×1440 QHD', 'Refresh Rate': '165Hz', 'Response Time': '1ms GTG', 'Color Coverage': '99% sRGB, 95% DCI-P3', Ports: 'HDMI 2.1 ×2, DP 1.4, USB-C 65W' },
      tags: ['qhd', '165hz', 'ips'], inStock: false, qty: 0
    },
    {
      id: 'p006', name: 'CloudPad Pro Tablet',
      category: 'Tablets', emoji: '📱',
      price: 41999, originalPrice: 49999,
      rating: 4.4, reviews: 720,
      badge: 'sale', badgeLabel: 'Sale',
      description: 'AMOLED 11-inch tablet with a 120Hz refresh rate, octa-core processor, and 10,000mAh battery. Supports stylus and keyboard folio accessories.',
      specs: { Display: '11" AMOLED, 120Hz', Processor: 'Octa-core 3.2GHz', RAM: '8GB LPDDR5', Storage: '256GB UFS 3.1', Battery: '10,000mAh, 45W charging', Camera: '13MP rear + 12MP front' },
      tags: ['amoled', 'stylus', 'portable'], inStock: true, qty: 0
    },
    {
      id: 'p007', name: 'NovaDock USB-C Hub 12-in-1',
      category: 'Accessories', emoji: '🔌',
      price: 4299, originalPrice: 5999,
      rating: 4.3, reviews: 490,
      badge: 'sale', badgeLabel: 'Sale',
      description: 'One cable, twelve ports. Dual 4K HDMI, 100W PD, 10Gbps USB-A ×4, SD/microSD, Ethernet 1Gbps, and 3.5mm audio.',
      specs: { Ports: 'HDMI ×2, USB-A ×4, USB-C ×2, SD, microSD, RJ45, 3.5mm', 'Max Power': '100W PD passthrough', 'HDMI Output': '4K@60Hz dual', 'Data Transfer': '10Gbps USB 3.2', Ethernet: '1Gbps', Dimensions: '130×60×18mm' },
      tags: ['usb-c', 'hub', 'productivity'], inStock: true, qty: 0
    },
    {
      id: 'p008', name: 'SonicBoom Desk Speaker',
      category: 'Audio', emoji: '🔊',
      price: 14999, originalPrice: 18999,
      rating: 4.6, reviews: 215,
      badge: 'new', badgeLabel: 'New',
      description: 'Stereo desktop speaker with 60W peak output, built-in DAC, Bluetooth 5.2, and optical input. Walnut wood cabinet for acoustic warmth.',
      specs: { Output: '2×30W Class-D amplifier', 'Driver Size': '3.5" woofer + 1" tweeter', Connectivity: 'Bluetooth 5.2, Optical, 3.5mm, USB-B', 'Frequency Response': '50Hz–20kHz', Cabinet: 'Walnut wood + aluminum', DAC: 'Built-in 24-bit/192kHz' },
      tags: ['hi-fi', 'desktop', 'bluetooth'], inStock: true, qty: 0
    },
    {
      id: 'p009', name: 'ArcLink Wristwatch 3 Pro',
      category: 'Wearables', emoji: '⌚',
      price: 22999, originalPrice: 27999,
      rating: 4.5, reviews: 1680,
      badge: 'hot', badgeLabel: 'Hot',
      description: 'Health-first smartwatch with ECG, blood oxygen, stress index, and 7-day battery. AMOLED always-on display and IP68 waterproofing.',
      specs: { Display: '1.5" AMOLED, 480×480', Battery: '7 days typical', Health: 'ECG, SpO2, HRV, Stress, Temp', GPS: 'Multi-band + GLONASS', 'Water Resistance': 'IP68 (50m)', Compatibility: 'Android 8+ / iOS 14+' },
      tags: ['health', 'gps', 'amoled'], inStock: true, qty: 0
    },
    {
      id: 'p010', name: 'KeyLight Studio Ring',
      category: 'Accessories', emoji: '💡',
      price: 3799, originalPrice: 4999,
      rating: 4.2, reviews: 380,
      badge: null, badgeLabel: null,
      description: '18-inch bi-color LED ring light with phone mount, tripod stand, and remote. 3200–5600K adjustable, CRI 95+, silent dimming.',
      specs: { Size: '18 inches', 'Color Temp': '3200K–5600K', CRI: '95+', Power: '55W', 'Dimming Range': '10%–100%', Includes: 'Tripod, phone mount, remote' },
      tags: ['lighting', 'streaming', 'content'], inStock: true, qty: 0
    },
    {
      id: 'p011', name: 'HyperCharge 240W GaN Charger',
      category: 'Accessories', emoji: '⚡',
      price: 5499, originalPrice: 6999,
      rating: 4.7, reviews: 890,
      badge: 'best-seller', badgeLabel: 'Best Seller',
      description: 'Charge four devices simultaneously at full speed. 240W total via GaN III technology. Ultra-compact form factor — smaller than a deck of cards.',
      specs: { 'Total Output': '240W', Ports: 'USB-C ×3 (140W each), USB-A ×1', 'Technology': 'GaN III', 'Port 1 Max': '140W USB-C PD 3.1', Compatibility: 'MacBook Pro, laptops, phones', Size: '72×62×30mm' },
      tags: ['gan', 'fast-charge', 'travel'], inStock: true, qty: 0
    },
  ];

  const CATEGORIES = ['All', ...new Set(PRODUCTS.map(p => p.category))];

  return {
    getAll: () => PRODUCTS,
    getById: (id) => PRODUCTS.find(p => p.id === id),
    getByCategory: (cat) => cat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat),
    getCategories: () => CATEGORIES,
    getFeatured: () => PRODUCTS.slice(0, 5),
    getRelated: (id, count = 4) => PRODUCTS.filter(p => p.id !== id).slice(0, count),
    search: (query) => {
      const q = query.toLowerCase().trim();
      if (!q) return [];
      return PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    },
    getCategoryEmojis: () => ({
      'All': '🛍️', 'Audio': '🎧', 'Peripherals': '⌨️',
      'Accessories': '🔌', 'Displays': '🖥️', 'Tablets': '📱',
      'Wearables': '⌚'
    })
  };
})();
