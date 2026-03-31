import products from './data.js';

class App {
  constructor() {
    this.root = document.getElementById('root');
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // UI Elements
    this.cartCountElements = document.querySelectorAll('.cart-count');
    this.cartOverlay = document.getElementById('cartOverlay');
    this.cartItemsContainer = document.getElementById('cartItems');
    this.cartTotalElement = document.getElementById('cartTotal');
    this.userOverlay = document.getElementById('userOverlay');
    this.toastElement = document.getElementById('toast');
    
    this.init();
  }

  init() {
    // Event Listeners for Nav
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Cart Events
    document.querySelectorAll('.open-cart').forEach(btn => {
      btn.addEventListener('click', () => this.toggleCart(true));
    });
    document.querySelectorAll('.close-cart').forEach(btn => {
      btn.addEventListener('click', () => this.toggleCart(false));
    });

    // User Events
    document.querySelectorAll('.open-user').forEach(btn => {
      btn.addEventListener('click', () => this.toggleUser(true));
    });
    document.querySelectorAll('.close-user').forEach(btn => {
      btn.addEventListener('click', () => this.toggleUser(false));
    });
    const userForm = document.getElementById('userForm');
    if (userForm) {
      userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.showToast('Login successful!');
        this.toggleUser(false);
      });
    }

    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if(mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
    
    // Close nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });

    this.updateCartUI();
    this.handleRoute(); // Initial Load
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    window.scrollTo(0, 0);
    
    if (hash === '/') {
      this.renderHome();
    } else if (hash === '/men') {
      this.renderCategory('men', 'Men\'s Collection');
    } else if (hash === '/women') {
      this.renderCategory('women', 'Women\'s Collection');
    } else if (hash.startsWith('/product/')) {
      const id = parseInt(hash.split('/')[2]);
      this.renderProduct(id);
    } else if (hash === '/checkout') {
      this.renderCheckout();
    } else if (hash === '/returns') {
      this.renderReturns();
    } else if (hash === '/help') {
      this.renderHelp();
    } else if (hash === '/about') {
      this.renderAbout();
    } else if (hash === '/privacy') {
      this.renderPrivacy();
    } else if (hash === '/terms') {
      this.renderTerms();
    } else {
      this.root.innerHTML = `<div class="container section text-center"><h2>Page Not Found</h2></div>`;
    }
  }

  // --- RENDERING ---

  renderHome() {
    const featuredHTML = products.map(p => this.createProductCard(p)).join('');
    const newArrivalsHTML = products.filter(p => p.isNew).map(p => this.createProductCard(p)).join('');
    
    this.root.innerHTML = `
      <section class="hero video-hero animate-fade-in" style="position: relative; min-height: calc(100vh - 110px); overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center;">
        <video autoplay muted loop playsinline poster="assets/images/hero.png" class="hero-video" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2;">
          <source src="assets/videos/hero.mp4" type="video/mp4">
          <!-- Fallback if there's no video: -->
          <img src="assets/images/hero.png" alt="Fashion Hero" style="width: 100%; height: 100%; object-fit: cover;">
        </video>
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: -1;"></div>
        <div class="container hero-content text-center" style="position: relative; z-index: 1; padding: 2rem; width: 100%;">
          <span class="text-overline animate-fade-in" style="color: #fff; opacity: 0.9; margin-bottom: 2rem; letter-spacing: 4px; display: block;">Exclusive Collection</span>
          <h1 class="hero-title animate-fade-in animate-delay-1" style="color: white; font-size: clamp(3rem, 6vw, 5.5rem); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.5rem; font-family: serif; line-height: 1.1;">Step Into<br>The Season</h1>
          <p class="hero-subtitle animate-fade-in animate-delay-1" style="color: #f1f1f1; max-width: 600px; margin: 0 auto 2.5rem; font-size: 1.1rem; line-height: 1.6;">Discover premium pieces crafted for the modern era. Experience aesthetics and supreme comfort.</p>
          <a href="#/women" class="btn btn-primary animate-fade-in animate-delay-2" style="background: white; color: black; border: none; padding: 1.2rem 3.5rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; font-size: 0.9rem;">Shop Now</a>
        </div>
      </section>

      <section class="section container">
        <div class="flex-between mb-3">
          <div>
            <span class="text-overline">Fresh Drops</span>
            <h2>Latest Arrivals</h2>
          </div>
          <a href="#/" class="btn btn-secondary">View All</a>
        </div>
        <div class="product-grid">
          ${newArrivalsHTML}
        </div>
      </section>

      <section class="promo-section animate-fade-in">
        <div class="promo-bg">
          <img src="assets/images/promo.png" alt="Special Offer">
        </div>
        <div class="promo-content container">
          <span class="text-overline" style="color: white; opacity: 0.8;">Limited Time</span>
          <h2 style="color: white; font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -1px;">MID-SEASON<br>LUXURY</h2>
          <p style="color: white; font-size: 1.1rem; margin-bottom: 2rem; max-width: 450px; opacity: 0.9;">Redefine your wardrobe. Experience exclusive tailoring and premium materials at up to 40% off.</p>
          <a href="#/" class="btn btn-outline" style="border-width: 1px; padding: 1rem 2.5rem;">Explore The Edit</a>
        </div>
      </section>

      <section class="section container">
        <div class="text-center mb-4">
          <span class="text-overline">Discover</span>
          <h2>Shop by Category</h2>
        </div>
        <div class="categories-grid">
          <a href="#/women" class="category-card">
            <img src="assets/images/women_dress.png" alt="Women">
            <div class="category-overlay">
              <h3 class="category-title">Women</h3>
            </div>
          </a>
          <a href="#/men" class="category-card">
            <img src="assets/images/men_jacket.png" alt="Men">
            <div class="category-overlay">
              <h3 class="category-title">Men</h3>
            </div>
          </a>
        </div>
      </section>

      <section class="section container">
        <div class="text-center mb-4">
          <span class="text-overline">Voices</span>
          <h2>The AURA Experience</h2>
        </div>
        <div class="testimonials-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div class="testimonial-card" style="text-align: center; padding: 2.5rem 1.5rem; background: var(--color-bg-secondary); border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);">
            <div style="color: #f5b301; font-size: 1.2rem; margin-bottom: 1rem;">★★★★★</div>
            <p style="font-style: italic; color: var(--color-text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">"The attention to detail is remarkable. Every piece feels custom-made, echoing a very modern yet timeless energy."</p>
            <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">– Vogue Insider</h4>
          </div>
          <div class="testimonial-card" style="text-align: center; padding: 2.5rem 1.5rem; background: var(--color-bg-secondary); border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);">
            <div style="color: #f5b301; font-size: 1.2rem; margin-bottom: 1rem;">★★★★★</div>
            <p style="font-style: italic; color: var(--color-text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">"A true masterclass in minimal luxury. The fabrics drape perfectly and carry an undeniable premium aura."</p>
            <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">– GQ Magazine</h4>
          </div>
          <div class="testimonial-card" style="text-align: center; padding: 2.5rem 1.5rem; background: var(--color-bg-secondary); border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);">
            <div style="color: #f5b301; font-size: 1.2rem; margin-bottom: 1rem;">★★★★★</div>
            <p style="font-style: italic; color: var(--color-text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">"Absolutely in love with my silk dress. The shipping was extremely fast and the packaging was luxurious."</p>
            <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">– Sarah L.</h4>
          </div>
          <div class="testimonial-card" style="text-align: center; padding: 2.5rem 1.5rem; background: var(--color-bg-secondary); border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);">
            <div style="color: #f5b301; font-size: 1.2rem; margin-bottom: 1rem;">★★★★★</div>
            <p style="font-style: italic; color: var(--color-text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">"The modern cuts and minimalist designs are exactly what I've been looking for. My new favorite brand."</p>
            <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">– Emily R.</h4>
          </div>
          <div class="testimonial-card" style="text-align: center; padding: 2.5rem 1.5rem; background: var(--color-bg-secondary); border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);">
            <div style="color: #f5b301; font-size: 1.2rem; margin-bottom: 1rem;">★★★★★</div>
            <p style="font-style: italic; color: var(--color-text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">"Incredible quality that rivals designers three times the price point. Highly recommend trying the suit sets."</p>
            <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">– Jessica M.</h4>
          </div>
        </div>
      </section>

      <section class="section container">
        <div class="flex-between mb-3">
          <h2>Trending Now</h2>
        </div>
        <div class="product-grid">
          ${featuredHTML}
        </div>
      </section>
    `;
    this.attachProductEvents();
  }

  renderCategory(category, title) {
    const filtered = products.filter(p => p.category === category);
    
    let filterHTML = '';
    if (category === 'women') {
      filterHTML = `
        <div class="category-filters-wrapper mb-4 text-center">
          <ul class="category-filters" style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; list-style: none;">
            <li><button class="btn btn-secondary filter-btn active" data-filter="All" style="padding: 0.5rem 1.5rem; font-size: 0.8rem; border-radius: 30px;">All</button></li>
            <li><button class="btn btn-secondary filter-btn" data-filter="Blouse" style="padding: 0.5rem 1.5rem; font-size: 0.8rem; border-radius: 30px; border-color: transparent;">Blouse</button></li>
            <li><button class="btn btn-secondary filter-btn" data-filter="Suit Set" style="padding: 0.5rem 1.5rem; font-size: 0.8rem; border-radius: 30px; border-color: transparent;">Suit Set</button></li>
            <li><button class="btn btn-secondary filter-btn" data-filter="Dresses" style="padding: 0.5rem 1.5rem; font-size: 0.8rem; border-radius: 30px; border-color: transparent;">Dresses</button></li>
            <li><button class="btn btn-secondary filter-btn" data-filter="Kurta Set" style="padding: 0.5rem 1.5rem; font-size: 0.8rem; border-radius: 30px; border-color: transparent;">Kurta Set</button></li>
          </ul>
        </div>
      `;
    }

    const html = filtered.map(p => this.createProductCard(p)).join('');
    
    this.root.innerHTML = `
      <div class="page-header animate-fade-in">
        <div class="container">
          <h1>${title}</h1>
          <p>Explore our latest arrivals in ${title.toLowerCase()}</p>
        </div>
      </div>
      <div class="container section" style="padding-top: 0">
        ${filterHTML}
        <div class="product-grid animate-fade-in animate-delay-1" id="categoryProductGrid">
          ${html}
        </div>
      </div>
    `;
    this.attachProductEvents();

    if (category === 'women') {
      const activeBtn = document.querySelector('.filter-btn.active');
      if (activeBtn) activeBtn.style.borderColor = 'var(--color-accent)';

      const filterBtns = document.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          filterBtns.forEach(b => {
             b.classList.remove('active');
             b.style.borderColor = 'transparent';
          });
          e.target.classList.add('active');
          e.target.style.borderColor = 'var(--color-accent)';

          const targetSub = e.target.dataset.filter;
          let newProducts = filtered;
          if (targetSub !== 'All') {
            newProducts = filtered.filter(p => p.subCategory === targetSub);
          }
          document.getElementById('categoryProductGrid').innerHTML = newProducts.map(p => this.createProductCard(p)).join('');
          this.attachProductEvents();
        });
      });
    }
  }

  renderProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) {
      this.root.innerHTML = `<div class="container section">Product not found.</div>`;
      return;
    }

    let recommended = products.filter(p => p.category === product.category && p.id !== product.id);
    if (recommended.length === 0) {
      recommended = products.filter(p => p.id !== product.id);
    }
    const recommendedHTML = recommended.slice(0, 4).map(p => this.createProductCard(p)).join('');

    this.root.innerHTML = `
      <style>
        .aachho-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .aachho-gallery {
          position: sticky;
          top: 140px;
        }
        @media (max-width: 768px) {
          .aachho-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .aachho-gallery {
            position: relative;
            top: 0;
          }
        }
      </style>
      <div class="container section animate-fade-in" style="padding-top: 1.5rem;">
        <div class="breadcrumb" style="font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 1px;">
          <a href="#/" style="color: inherit; text-decoration: none;">Home</a> / <a href="#/${product.category}" style="color: inherit; text-decoration: none;">${product.category === 'men' ? 'Menswear' : 'Womenswear'}</a> / ${product.name}
        </div>

        <div class="aachho-layout">
          <div class="aachho-gallery">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: var(--border-radius); box-shadow: 0 4px 20px rgba(0,0,0,0.05); object-fit: cover;">
          </div>
          
          <div class="product-info-detail">
            <div style="font-size: 0.8rem; letter-spacing: 4px; color: var(--color-text-secondary); margin-bottom: 0.5rem; text-transform: uppercase;">A A C H H O</div>
            <h1 style="font-family: 'Times New Roman', Times, serif; font-size: 2.2rem; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; color: #333; margin-bottom: 0.5rem; line-height: 1.2;">
              ${product.name}
            </h1>
            
            <div style="display: flex; align-items: center; gap: 0.5rem; color: #f5b301; font-size: 1.1rem; margin-bottom: 1.5rem;">
              ★★★★★ <span style="color: var(--color-text-secondary); font-size: 0.9rem; margin-left: 0.2rem;">${Math.floor(product.rating * 5)} reviews</span>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.3rem;">
                <span style="font-size: 1.5rem; font-weight: 500; color: #333;">$${product.price.toFixed(2)}</span>
                <span style="text-decoration: line-through; color: var(--color-text-secondary); font-size: 1.1rem;">$${(product.price * 1.3).toFixed(2)}</span>
                <span style="background: #cc6b6b; color: white; padding: 3px 8px; font-size: 0.8rem; font-weight: 600;">30% off</span>
              </div>
              <div style="color: #cc6b6b; font-size: 0.9rem; margin-bottom: 0.2rem;">Save $${(product.price * 0.3).toFixed(2)}</div>
              <div style="color: var(--color-text-secondary); font-size: 0.8rem;">Inclusive of all taxes</div>
            </div>
            
            <div style="border: 1px solid #ddd; border-radius: 4px; padding: 0.4rem 0.8rem; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 600; font-style: italic; margin-bottom: 2rem;">
              <span style="color: #cc6b6b; font-size: 1rem;">✓</span> SHIPS IN 24 HOURS
            </div>
            
            <div class="size-selector" style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span style="font-size: 0.9rem; letter-spacing: 2px;">SIZE</span>
                <span style="color: #cc6b6b; font-size: 0.9rem; cursor: pointer; border-bottom: 1px solid #cc6b6b;">Size chart &rarr;</span>
              </div>
              <div class="size-options" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="size-btn">XS ⚡</button>
                <button class="size-btn selected" style="border-color: #cc6b6b; color: #cc6b6b;">S ⚡</button>
                <button class="size-btn">M ⚡</button>
                <button class="size-btn">L</button>
                <button class="size-btn">XL</button>
                <button class="size-btn">2XL ⚡</button>
              </div>
            </div>

            <div style="background: #fdf5f5; padding: 1rem; border-radius: 4px; margin-bottom: 2rem; border-left: 3px solid #cc6b6b;">
              <div style="font-weight: 600; font-size: 0.9rem; color: #333; margin-bottom: 0.2rem;">⚡ READY TO SHIP - FAST DELIVERY</div>
              <div style="font-size: 0.85rem; color: var(--color-text-secondary);">Ships within 24 hours on selected sizes</div>
            </div>
            
            <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
              700K+ Happy Customers | 1 Million+ Followers
            </div>

            <div class="add-to-cart-wrapper" style="display: flex; gap: 1rem; margin-bottom: 2.5rem; height: 50px;">
              <button style="border: 1px solid #ddd; background: transparent; padding: 0 1.2rem; font-size: 1.5rem; border-radius: 4px; color: var(--color-text-secondary); line-height: 1; transition: all 0.2s; cursor: pointer;">♡</button>
              <button id="btn-add-cart" data-id="${product.id}" style="background: #cc6b6b; color: white; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; flex: 1; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">
                ADD TO CART
              </button>
              <input type="hidden" class="qty-input" value="1" id="qty-val">
            </div>
            
            <div class="additional-offers" style="margin-bottom: 2.5rem;">
              <h3 style="font-size: 1.2rem; font-weight: 400; margin-bottom: 1rem; color: #333;">Additional Offers</h3>
              
              <div style="border: 1px dashed #ddd; padding: 1rem; border-radius: 4px; margin-bottom: 0.8rem; position: relative; background: #fafafa;">
                <div style="font-weight: 600; font-size: 0.9rem; color: #333;">Flat 50% OFF</div>
                <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">Flat 50% OFF</div>
                <div style="font-size: 0.85rem; color: #333;">Use Coupon Code : <strong>FLAT50</strong></div>
                <div style="position: absolute; right: 1rem; bottom: 1rem; border: 1px dashed #cc6b6b; color: #cc6b6b; padding: 4px 10px; font-size: 0.8rem; font-weight: 600; cursor: pointer;">Copy Code</div>
              </div>
              
              <div style="border: 1px dashed #ddd; padding: 1rem; border-radius: 4px; margin-bottom: 0.8rem; background: #fafafa;">
                <div style="font-weight: 600; font-size: 0.9rem; color: #333;">FLAT 15% OFF</div>
                <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">FLAT 15% OFF</div>
                <div style="font-size: 0.85rem; color: #333;">Automatic Applied on Checkout</div>
              </div>
            </div>

            <div style="border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 1.2rem 0; cursor: pointer;">
              <h3 style="font-size: 1rem; font-weight: 600; margin: 0; color: #333; display: flex; justify-content: space-between;">
                Product Description <span style="font-weight: 400; color: var(--color-text-secondary);">+</span>
              </h3>
              <p style="color: var(--color-text-secondary); line-height: 1.6; font-size: 0.9rem; margin-top: 1rem;">
                ${product.description} A meticulously detailed masterpiece meant for those who appreciate high-end craft.
              </p>
            </div>
            <div style="border-bottom: 1px solid var(--color-border); padding: 1.2rem 0; cursor: pointer;">
             <h3 style="font-size: 1rem; font-weight: 600; margin: 0; color: #333; display: flex; justify-content: space-between;">
                Shipping Information <span style="font-weight: 400; color: var(--color-text-secondary);">+</span>
              </h3>
            </div>

          </div>
        </div>
      </div>

      ${recommendedHTML ? `
      <section class="section container" style="border-top: 1px solid var(--color-border); padding-top: var(--spacing-lg); margin-top: var(--spacing-md);">
        <div class="text-center mb-4">
          <span class="text-overline">Recommended</span>
          <h2>You May Also Like</h2>
        </div>
        <div class="product-grid">
          ${recommendedHTML}
        </div>
      </section>
      ` : ''}
    `;

    this.attachProductEvents();

    // Size Selection
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.size-btn').forEach(b => {
          b.classList.remove('selected');
          b.style.borderColor = 'var(--color-border)';
          b.style.color = 'var(--color-text-primary)';
        });
        e.target.classList.add('selected');
        e.target.style.borderColor = '#cc6b6b';
        e.target.style.color = '#cc6b6b';
      });
    });

    // Quantity hidden logic
    const qtyInput = document.getElementById('qty-val');

    // Add to cart
    document.getElementById('btn-add-cart').addEventListener('click', () => {
      const qty = parseInt(qtyInput.value);
      const sizeStr = document.querySelector('.size-btn.selected').innerText;
      this.addToCart(product.id, qty, sizeStr);
    });
  }

  renderCheckout() {
    if (this.cart.length === 0) {
      this.root.innerHTML = `
        <div class="container section text-center">
          <h2>Your cart is empty</h2>
          <a href="#/" class="btn btn-primary mt-3">Continue Shopping</a>
        </div>
      `;
      return;
    }

    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    this.root.innerHTML = `
      <div class="page-header">
        <div class="container">
          <h1>Checkout</h1>
        </div>
      </div>
      <div class="container section" style="padding-top: 0">
        <div class="checkout-grid">
          <div>
            <h3>Shipping Details</h3>
            <form id="checkoutForm" class="mt-3">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" class="form-control" required>
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" class="form-control" required>
                </div>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" required>
              </div>
              <div class="form-group">
                <label>Address</label>
                <input type="text" class="form-control" required>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label>City</label>
                  <input type="text" class="form-control" required>
                </div>
                <div class="form-group">
                  <label>Postal Code</label>
                  <input type="text" class="form-control" required>
                </div>
              </div>
              <h3 class="mt-4 mb-3">Payment</h3>
              <div class="form-group">
                <label>Card Number</label>
                <input type="text" class="form-control" placeholder="0000 0000 0000 0000" required>
              </div>
              <button type="submit" class="btn btn-primary btn-full mt-3" style="padding: 1rem; font-size: 1.1rem;">Place Order</button>
            </form>
          </div>
          <div>
            <div style="background: var(--color-bg-secondary); padding: 1.5rem; border-radius: var(--border-radius);">
              <h3 class="mb-3">Order Summary</h3>
              ${this.cart.map(item => `
                <div class="flex-between mb-2" style="font-size: 0.9rem;">
                  <span>${item.name} (x${item.quantity}) - Size: ${item.size}</span>
                  <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              <hr style="margin: 1rem 0; border: 0; border-top: 1px solid var(--color-border);" />
              <div class="flex-between mb-2">
                <span>Subtotal</span>
                <span>$${total.toFixed(2)}</span>
              </div>
              <div class="flex-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr style="margin: 1rem 0; border: 0; border-top: 1px solid var(--color-border);" />
              <div class="flex-between font-bold" style="font-size: 1.2rem; font-weight: 600;">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.cart = [];
      this.saveCart();
      this.updateCartUI();
      window.scrollTo(0,0);
      this.root.innerHTML = `
        <div class="container section text-center animate-fade-in">
          <div style="font-size: 4rem; color: var(--color-success); margin-bottom: 1rem;">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p class="mb-4">Thank you for your purchase. Your premium items will be shipped soon.</p>
          <a href="#/" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
    });
  }

  renderReturns() {
    this.root.innerHTML = `
      <div class="page-header animate-fade-in">
        <div class="container">
          <h1>Returns & Exchanges</h1>
          <p>Everything you need to know about our return policy.</p>
        </div>
      </div>
      <div class="container section animate-fade-in animate-delay-1" style="padding-top: 0; max-width: 800px; margin: 0 auto;">
        <div>
          <h3 class="mb-2">Our Return Policy</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            At AURA, we take pride in the exceptional quality and craftsmanship of our apparel. If you are not completely satisfied with your purchase, we accept returns and exchanges within 30 days of the delivery date. Items must be unworn, unwashed, and have original tags attached.
          </p>

          <h3 class="mb-2">How to Request a Return or Exchange</h3>
          <ol class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8; padding-left: 1.2rem;">
            <li class="mb-2">Sign in to your AURA account and visit the <strong>Orders</strong> section.</li>
            <li class="mb-2">Select the item(s) you wish to return or exchange and state the reason.</li>
            <li class="mb-2">You will receive a pre-paid shipping label via email.</li>
            <li>Pack your item(s) securely and drop them off at any authorized shipping center.</li>
          </ol>

          <h3 class="mb-2">Refund Processing</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            Once your return is received and inspected at our facility, an email notification will be sent. Approved refunds will be processed and a credit will automatically be applied to your original method of payment within 5-7 business days.
          </p>

          <h3 class="mb-2">Non-Returnable Items</h3>
          <ul class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8; padding-left: 1.2rem; list-style-type: disc;">
            <li>Gift cards</li>
            <li>Customized, monogrammed, or personalized items</li>
            <li>Intimates and swimwear (for hygiene reasons)</li>
            <li>Final sale items</li>
          </ul>

          <div style="background: var(--color-bg-secondary); padding: 2.5rem 2rem; border-radius: var(--border-radius); text-align: center; margin-top: var(--spacing-lg);">
            <h4 class="mb-2">Need further assistance?</h4>
            <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">Our premium support team is available 24/7 to help you.</p>
            <a href="mailto:support@aurafashion.dummy" class="btn btn-primary">Contact Support</a>
          </div>
        </div>
      </div>
    `;
  }

  renderHelp() {
    this.root.innerHTML = `
      <div class="page-header animate-fade-in">
        <div class="container">
          <h1>Help Center</h1>
          <p>We're here to assist you.</p>
        </div>
      </div>
      <div class="container section animate-fade-in animate-delay-1" style="padding-top: 0; max-width: 800px; margin: 0 auto;">
        <div>
          <h3 class="mb-2">Frequently Asked Questions</h3>
          <div style="margin-bottom: 2rem;">
            <h4 style="margin-bottom: 0.5rem; font-size: 1.1rem;">How can I track my order?</h4>
            <p style="color: var(--color-text-secondary); line-height: 1.8;">Once your order is shipped, you will receive an email with a tracking link. You can also view your order status in the "Orders" section of your AURA account.</p>
          </div>
          <div style="margin-bottom: 2rem;">
            <h4 style="margin-bottom: 0.5rem; font-size: 1.1rem;">Do you ship internationally?</h4>
            <p style="color: var(--color-text-secondary); line-height: 1.8;">Yes, we offer worldwide shipping. International shipping rates and delivery times vary depending on the destination and the shipping method selected at checkout.</p>
          </div>
          <div style="margin-bottom: 2rem;">
            <h4 style="margin-bottom: 0.5rem; font-size: 1.1rem;">What payment methods do you accept?</h4>
            <p style="color: var(--color-text-secondary); line-height: 1.8;">We accept all major credit cards including Visa, MasterCard, and American Express. We also support seamless checkout with PayPal and Apple Pay.</p>
          </div>

          <div style="background: var(--color-bg-secondary); padding: 2.5rem 2rem; border-radius: var(--border-radius); text-align: center; margin-top: var(--spacing-lg);">
            <h4 class="mb-2">Still need help?</h4>
            <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">Our customer service team is available Monday to Friday from 9 AM to 6 PM (EST).</p>
            <a href="mailto:support@aurafashion.dummy" class="btn btn-primary">Contact Us</a>
          </div>
        </div>
      </div>
    `;
  }

  renderAbout() {
    this.root.innerHTML = `
      <div class="page-header animate-fade-in">
        <div class="container">
          <h1>About Us</h1>
          <p>The story behind AURA.</p>
        </div>
      </div>
      <div class="container section animate-fade-in animate-delay-1" style="padding-top: 0; max-width: 800px; margin: 0 auto;">
        <div>
          <img src="assets/images/hero.png" alt="AURA Studio" style="width: 100%; border-radius: var(--border-radius); margin-bottom: 2.5rem; height: 350px; object-fit: cover;">
          
          <h3 class="mb-2">Our Vision</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            AURA was born from a simple idea: that premium fashion shouldn't be defined by exorbitant logos, but by exceptional fit, superior fabrics, and timeless design. We set out to create a modern wardrobe for the confident individual.
          </p>

          <h3 class="mb-2">Craftsmanship</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            Every piece we produce is meticulously crafted. We partner directly with family-run factories and premium mills across the world to ensure that the materials used are ethically sourced and of the highest caliber.
          </p>

          <h3 class="mb-2">Sustainability</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            We believe in fewer, better things. Our collections are designed to outlast fast fashion cycles, reducing waste and promoting a more sustainable approach to dressing well.
          </p>
        </div>
      </div>
    `;
  }

  renderPrivacy() {
    this.root.innerHTML = `
      <div class="page-header animate-fade-in">
        <div class="container">
          <h1>Privacy Policy</h1>
          <p>How we protect your data.</p>
        </div>
      </div>
      <div class="container section animate-fade-in animate-delay-1" style="padding-top: 0; max-width: 800px; margin: 0 auto;">
        <div>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">Last Updated: March 2026</p>
          
          <h3 class="mb-2">1. Information We Collect</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, postal address, phone number, and payment information.
          </p>
          
          <h3 class="mb-2">2. How We Use Your Information</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            We use the information we collect to provide, maintain, and improve our services, process transactions, send related information including confirmations and receipts, and communicate with you about products, services, offers, and events offered by AURA.
          </p>
          
          <h3 class="mb-2">3. Information Sharing</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            We do not share your personal information with third parties except as necessary to provide our services (such as shipping partners or payment processors), or when required by law.
          </p>
          
          <h3 class="mb-2">4. Your Choices</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            You can access and update your account information at any time. You may also opt-out of receiving promotional communications from us by following the instructions in those messages.
          </p>
        </div>
      </div>
    `;
  }

  renderTerms() {
    this.root.innerHTML = `
      <div class="page-header animate-fade-in">
        <div class="container">
          <h1>Terms of Service</h1>
          <p>Rules and guidelines for using AURA.</p>
        </div>
      </div>
      <div class="container section animate-fade-in animate-delay-1" style="padding-top: 0; max-width: 800px; margin: 0 auto;">
        <div>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">Last Updated: March 2026</p>
          
          <h3 class="mb-2">1. Agreement to Terms</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the service.
          </p>
          
          <h3 class="mb-2">2. Intellectual Property</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            The website and its original content, features, and functionality are owned by AURA and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          
          <h3 class="mb-2">3. User Accounts</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          
          <h3 class="mb-2">4. Limitation of Liability</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            In no event shall AURA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </div>
      </div>
    `;
  }

  // --- HELPERS ---

  createProductCard(product) {
    return `
      <div class="product-card">
        <div class="product-img-wrapper" onclick="window.location.hash='/product/${product.id}'">
          ${product.isNew ? `<div class="product-badges"><span class="badge">New</span></div>` : ''}
          <img src="${product.image}" class="product-img" alt="${product.name}">
          <div class="product-actions-overlay">
            <button class="product-quick-add add-to-cart-btn" data-id="${product.id}">Quick Add</button>
          </div>
        </div>
        <div class="product-info" onclick="window.location.hash='/product/${product.id}'">
          <h3 class="product-name">${product.name}</h3>
          <span class="product-price">$${product.price.toFixed(2)}</span>
        </div>
      </div>
    `;
  }

  attachProductEvents() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(e.target.dataset.id);
        this.addToCart(id, 1, 'M'); // Default size M for quick add
      });
    });
  }

  // --- CART LOGIC ---

  addToCart(id, quantity, size) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = this.cart.find(item => item.id === id && item.size === size);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity, size });
    }

    this.saveCart();
    this.updateCartUI();
    this.toggleCart(true);
    this.showToast('Added to cart!');
  }

  removeFromCart(id, size) {
    this.cart = this.cart.filter(item => !(item.id === id && item.size === size));
    this.saveCart();
    this.updateCartUI();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  updateCartUI() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountElements.forEach(el => el.innerText = totalItems);

    if (this.cart.length === 0) {
      this.cartItemsContainer.innerHTML = '<p class="text-center" style="color: var(--color-text-secondary); margin-top: 2rem;">Your cart is empty.</p>';
      this.cartTotalElement.innerText = '$0.00';
      return;
    }

    let total = 0;
    this.cartItemsContainer.innerHTML = this.cart.map(item => {
      total += item.price * item.quantity;
      return `
        <div class="cart-item">
          <img src="${item.image}" class="cart-item-img" alt="${item.name}">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div style="font-size: 0.8rem; color: #777;">Size: ${item.size} | Qty: ${item.quantity}</div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="cart-item-remove" data-id="${item.id}" data-size="${item.size}">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    this.cartTotalElement.innerText = `$${total.toFixed(2)}`;

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.removeFromCart(parseInt(e.target.dataset.id), e.target.dataset.size);
      });
    });
  }

  toggleCart(show) {
    if (show) {
      this.cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      this.cartOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  toggleUser(show) {
    if (show) {
      this.userOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      this.userOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  showToast(msg) {
    this.toastElement.innerText = msg;
    this.toastElement.classList.add('show');
    setTimeout(() => {
      this.toastElement.classList.remove('show');
    }, 3000);
  }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
