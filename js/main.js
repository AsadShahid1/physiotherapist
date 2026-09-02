/**
 * Lahore Spine Care - Dr. Shiza Khan
 * Main JavaScript Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Modals & Drawers Setup
  const bookingModal = document.getElementById('booking-modal');
  const searchModal = document.getElementById('search-modal');
  const portalModal = document.getElementById('portal-modal');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');

  // Trigger Open Buttons
  document.querySelectorAll('[data-open-modal]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = button.getAttribute('data-open-modal');
      
      if (modalType === 'booking') {
        openModal(bookingModal);
        const selectedPkg = button.getAttribute('data-package');
        if (selectedPkg && document.getElementById('modal-package-select')) {
          document.getElementById('modal-package-select').value = selectedPkg;
        }
      } else if (modalType === 'search') {
        openModal(searchModal);
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      } else if (modalType === 'portal') {
        openModal(portalModal);
      } else if (modalType === 'cart') {
        openCartDrawer();
      }
    });
  });

  // Close buttons
  document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => {
      closeModal(bookingModal);
      closeModal(searchModal);
      closeModal(portalModal);
      closeCartDrawer();
    });
  });

  // Backdrop clicks
  [bookingModal, searchModal, portalModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', closeCartDrawer);
  }

  function openModal(modal) {
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function openCartDrawer() {
    if (cartDrawer && cartBackdrop) {
      cartBackdrop.classList.remove('hidden');
      cartDrawer.classList.remove('translate-x-full');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartBackdrop) {
      cartBackdrop.classList.add('hidden');
      cartDrawer.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');
    }
  }

  // Booking Form Submission Handler
  const bookingForm = document.getElementById('physio-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMessage = document.getElementById('booking-success');
      const formFields = document.getElementById('booking-form-fields');
      if (successMessage && formFields) {
        formFields.classList.add('hidden');
        successMessage.classList.remove('hidden');
      }
    });
  }

  // Cart Management
  let cartItems = [
    { id: 'pkg-1', name: 'Low Back & Sciatica Care Package', price: 35000, quantity: 1 }
  ];

  function updateCartUI() {
    const cartList = document.getElementById('cart-items-list');
    const cartCount = document.getElementById('cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');

    if (cartCount) cartCount.textContent = cartItems.reduce((acc, item) => acc + item.quantity, 0).toString();

    if (cartList) {
      if (cartItems.length === 0) {
        cartList.innerHTML = `<div class="text-center py-8 text-slate-500">Your cart is empty.</div>`;
      } else {
        cartList.innerHTML = cartItems.map((item, index) => `
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="space-y-1">
              <div class="font-semibold text-slate-900 text-sm">${item.name}</div>
              <div class="text-xs text-teal-600 font-medium">Rs. ${item.price.toLocaleString()}</div>
            </div>
            <div class="flex items-center space-x-2">
              <button onclick="removeCartItem(${index})" class="p-1 text-slate-400 hover:text-red-500 rounded transition-colors">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `).join('');
        if (window.lucide) window.lucide.createIcons();
      }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = `Rs. ${subtotal.toLocaleString()}`;
    if (cartTotal) cartTotal.textContent = `Rs. ${subtotal.toLocaleString()}`;
  }

  window.removeCartItem = function(index) {
    cartItems.splice(index, 1);
    updateCartUI();
  };

  window.addToCart = function(id, name, price) {
    const existing = cartItems.find(item => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
    openCartDrawer();
  };

  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id') || 'pkg-custom';
      const name = btn.getAttribute('data-name') || 'Spine Care Package';
      const price = parseInt(btn.getAttribute('data-price') || '25000', 10);
      window.addToCart(id, name, price);
    });
  });

  updateCartUI();

  // Search Filter Handler
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (searchInput && searchResults) {
    const searchableItems = [
      { title: 'Dr. Shiza Khan - Chiropractor & Physiotherapist', category: 'Founder/CEO', link: 'about.html' },
      { title: 'Chiropractic Spine Adjustment', category: 'Service', link: 'chiropractic.html' },
      { title: 'Non-Surgical Sciatica Treatment', category: 'Service', link: 'services.html' },
      { title: 'Slipped & Herniated Disc Relief', category: 'Service', link: 'services.html' },
      { title: 'Posture Correction & Ergonomics', category: 'Service', link: 'chiropractic.html' },
      { title: 'Sports & Gym Back Injury Rehabilitation', category: 'Service', link: 'services.html' },
      { title: 'General Musculoskeletal Pain Management', category: 'Service', link: 'services.html' },
      { title: 'Initial Consultation (Starting at Rs. 2,000)', category: 'Pricing', link: 'book-appointment.html' },
      { title: 'Low Back & Sciatica Reversal Package', category: 'Package', link: 'packages.html' },
      { title: 'In-Home Domiciliary Care', category: 'Service', link: 'home-care.html' },
      { title: 'Plantar Fasciitis Recovery Guide', category: 'Blog', link: 'article-detail.html' }
    ];

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        searchResults.innerHTML = `<p class="text-sm text-slate-400 text-center py-4">Type to search services, packages, Dr. Shiza Khan, or articles...</p>`;
        return;
      }

      const matches = searchableItems.filter(item => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
      if (matches.length === 0) {
        searchResults.innerHTML = `<p class="text-sm text-slate-500 text-center py-4">No results found for "${query}"</p>`;
      } else {
        searchResults.innerHTML = matches.map(item => `
          <a href="${item.link}" class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors border-b border-slate-100 last:border-0">
            <span class="font-medium text-slate-800">${item.title}</span>
            <span class="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full font-medium">${item.category}</span>
          </a>
        `).join('');
      }
    });
  }
});
