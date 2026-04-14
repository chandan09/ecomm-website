import products from './data.js?v=2';

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
    this.isLoggedIn = false;
    this.isLoginMode = true;
    this.activeProfileTab = 'personal';
    this.discount = 0;
    this.appliedCoupon = '';
    this.wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    this.init();
    this.initMobileMenu();
  }

  initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
       menuBtn.addEventListener('click', () => {
          navLinks.classList.toggle('active');
       });
       // Close menu when clicking a link
       navLinks.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => navLinks.classList.remove('active'));
       });
    }
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
      btn.addEventListener('click', () => {
        if (this.isLoggedIn) {
          window.location.hash = '/profile';
        } else {
          this.toggleUser(true);
        }
      });
    });
    const userForm = document.getElementById('userForm');
    if (userForm) {
      userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.isLoggedIn = true;
        const nameInput = document.getElementById('signupName');
        const emailInput = document.getElementById('authEmail');
        const name = nameInput ? nameInput.value : 'User';
        const email = emailInput ? emailInput.value : 'user@example.com';
        
        if (!this.isLoginMode) {
          localStorage.setItem('currentUser', JSON.stringify({ name, email, phone: '', address: '' }));
          this.showToast('Account created successfully!');
        } else {
          this.showToast('Login successful!');
        }
        
        this.toggleUser(false);
        this.updateUserNav();
        if (window.location.hash === '#/checkout') this.renderCheckout();
      });
    }

    this.initAuthToggle();

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

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        this.showToast(`Thank you for joining, ${email}!`);
        newsletterForm.reset();
      });
    }

    this.updateCartUI();
    this.handleRoute(); // Initial Load
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    window.scrollTo(0, 0);
    
    if (hash === '/') {
      this.renderHome();
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
    } else if (hash === '/profile') {
      this.renderProfile();
    } else {
      this.root.innerHTML = `<div class="container section text-center"><h2>Page Not Found</h2></div>`;
    }
  }

  // --- RENDERING ---

  renderHome() {
    const featuredHTML = products.map(p => this.createProductCard(p)).join('');
    const newArrivalsHTML = products.filter(p => p.isNew).map(p => this.createProductCard(p)).join('');
    
    this.root.innerHTML = `
      <section class="hero video-hero animate-fade-in" style="position: relative; min-height: 80vh; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center;">
        <video autoplay muted loop playsinline poster="assets/images/hero.png" class="hero-video" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2;">
          <source src="assets/videos/hero.mp4" type="video/mp4">
          <img src="assets/images/hero.png" alt="Fashion Hero" style="width: 100%; height: 100%; object-fit: cover;">
        </video>
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: -1;"></div>
        <div class="container hero-content text-center" style="position: relative; z-index: 1; padding: 2rem; width: 100%;">
          <span class="text-overline animate-fade-in" style="color: #fff; opacity: 0.9; margin-bottom: 2rem; letter-spacing: 4px; display: block;">Exclusive Collection</span>
          <h1 class="hero-title animate-fade-in animate-delay-1" style="color: white; font-size: clamp(2.5rem, 6vw, 5.5rem); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.5rem; font-family: serif; line-height: 1.1;">Step Into<br>The Season</h1>
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
        </div>
      </section>

      <section class="section" style="background: #fdfdfd; padding: 7rem 0; text-align: center;">
        <div class="container">
          <span class="text-overline" style="color: var(--color-accent); letter-spacing: 5px;">Testimonials</span>
          <h2 style="margin: 1.5rem 0 4.5rem; text-transform: uppercase; letter-spacing: 3px; font-weight: 300; font-size: 2.2rem;">Customer Voice</h2>
          
          <div class="carousel-container" style="max-width: 900px; margin: 0 auto; overflow: hidden; position: relative;">
            <div id="testimonialCarousel" style="display: flex; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); will-change: transform;">
              <div class="testimonial-slide" style="min-width: 100%; padding: 0 2rem;">
                  <div style="color: #f5b301; font-size: 1.3rem; margin-bottom: 2rem;">★★★★★</div>
                  <p style="font-style: italic; color: #444; margin-bottom: 2.5rem; line-height: 2; font-size: 1.3rem; font-family: 'Times New Roman', serif; max-width: 750px; margin-left: auto; margin-right: auto;">"The attention to detail is remarkable. Every piece feels custom-made, echoing a very modern yet timeless energy that truly stands out in the ethnic fashion world."</p>
                  <h4 style="font-size: 1rem; text-transform: uppercase; letter-spacing: 3px; color: #1a1a1a; font-weight: 600;">– Vogue Insider</h4>
              </div>
              <div class="testimonial-slide" style="min-width: 100%; padding: 0 2rem;">
                  <div style="color: #f5b301; font-size: 1.3rem; margin-bottom: 2rem;">★★★★★</div>
                  <p style="font-style: italic; color: #444; margin-bottom: 2.5rem; line-height: 2; font-size: 1.3rem; font-family: 'Times New Roman', serif; max-width: 750px; margin-left: auto; margin-right: auto;">"A true masterclass in minimal luxury. The fabrics drape perfectly and carry an undeniable premium feel that is rare to find. Every collection is a masterpiece."</p>
                  <h4 style="font-size: 1rem; text-transform: uppercase; letter-spacing: 3px; color: #1a1a1a; font-weight: 600;">– GQ Magazine</h4>
              </div>
              <div class="testimonial-slide" style="min-width: 100%; padding: 0 2rem;">
                  <div style="color: #f5b301; font-size: 1.3rem; margin-bottom: 2rem;">★★★★★</div>
                  <p style="font-style: italic; color: #444; margin-bottom: 2.5rem; line-height: 2; font-size: 1.3rem; font-family: 'Times New Roman', serif; max-width: 750px; margin-left: auto; margin-right: auto;">"Absolutely in love with my silk dress. The shipping was extremely fast and the packaging was luxurious. It felt like receiving a gift from a high-end Parisian boutique."</p>
                  <h4 style="font-size: 1rem; text-transform: uppercase; letter-spacing: 3px; color: #1a1a1a; font-weight: 600;">– Sarah L.</h4>
              </div>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 15px; margin-top: 4rem;">
               <button class="carousel-dot active" data-index="0" style="width: 12px; height: 12px; border-radius: 50%; border: 1px solid #d4af37; background: #d4af37; cursor: pointer; transition: all 0.3s;"></button>
               <button class="carousel-dot" data-index="1" style="width: 12px; height: 12px; border-radius: 50%; border: 1px solid #ccc; background: #ccc; cursor: pointer; transition: all 0.3s;"></button>
               <button class="carousel-dot" data-index="2" style="width: 12px; height: 12px; border-radius: 50%; border: 1px solid #ccc; background: #ccc; cursor: pointer; transition: all 0.3s;"></button>
            </div>
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
    this.initHomeCarousel();
  }

  // --- UPDATE NAV ---
  updateUserNav() {
    const userBtn = document.querySelector('.open-user');
    if (userBtn) {
      if (this.isLoggedIn) {
        userBtn.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `;
      } else {
        userBtn.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `;
      }
    }
  }

  // --- AUTH TOGGLE ---
  initAuthToggle() {
    const toggleAuth = document.getElementById('toggleAuth');
    if (!toggleAuth) return;

    toggleAuth.addEventListener('click', (e) => {
      e.preventDefault();
      this.isLoginMode = !this.isLoginMode;
      
      const authTitle = document.getElementById('authTitle');
      const authSubtitle = document.getElementById('authSubtitle');
      const nameGroup = document.getElementById('nameGroup');
      const authSubmitBtn = document.getElementById('authSubmitBtn');
      const authToggleText = document.getElementById('authToggleText');

      if (this.isLoginMode) {
        authTitle.innerText = 'Welcome Back';
        authSubtitle.innerText = 'Log in to access your orders and saved items.';
        nameGroup.style.display = 'none';
        authSubmitBtn.innerText = 'Sign In';
        authToggleText.innerHTML = `Don't have an account? <a href="javascript:void(0)" id="toggleAuth" style="color: var(--color-accent); font-weight: 600; text-decoration: underline; margin-left: 5px;">Sign up</a>`;
      } else {
        authTitle.innerText = 'Create Account';
        authSubtitle.innerText = 'Join La Benediction for a premium shopping experience.';
        nameGroup.style.display = 'block';
        authSubmitBtn.innerText = 'Sign Up';
        authToggleText.innerHTML = `Already have an account? <a href="javascript:void(0)" id="toggleAuth" style="color: var(--color-accent); font-weight: 600; text-decoration: underline; margin-left: 5px;">Login</a>`;
      }
      // Re-initialize listener for the new anchor
      this.initAuthToggle();
    });
  }

  renderProfile() {
    if (!this.isLoggedIn) {
      window.location.hash = '/';
      this.toggleUser(true);
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{"name": "Guest User", "email": "user@example.com", "phone": "", "address": ""}');
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');

    this.root.innerHTML = `
      <div class="page-header" style="background: #fff; padding-bottom: 0;">
        <div class="container">
          <h1 style="text-transform: uppercase; letter-spacing: 4px; font-weight: 200; font-size: 2.2rem; color: #1a1a1a;">Account Profile</h1>
          <p style="color: #888; letter-spacing: 1px; margin-top: 10px;">View and update your boutique membership details.</p>
        </div>
      </div>
      <div class="container section" style="padding-top: 4rem;">
        <div class="profile-wrapper">
          <!-- Profile Sidebar -->
          <div class="profile-sidebar">
            <div style="width: 80px; height: 80px; background: #f5f5f5; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #d4af37; font-weight: 600; margin-bottom: 2rem; border: 1px solid #eee;">
              ${savedUser.name.charAt(0).toUpperCase()}
            </div>
            <nav id="profileTabs" style="display: flex; flex-direction: column; gap: 1.5rem;">
              <a href="javascript:void(0)" data-tab="personal" style="color: ${this.activeProfileTab === 'personal' ? '#1a1a1a' : '#888'}; font-weight: ${this.activeProfileTab === 'personal' ? '600' : '400'}; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Personal Info</a>
              <a href="javascript:void(0)" data-tab="orders" style="color: ${this.activeProfileTab === 'orders' ? '#1a1a1a' : '#888'}; font-weight: ${this.activeProfileTab === 'orders' ? '600' : '400'}; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">My Orders</a>
              <a href="javascript:void(0)" data-tab="wishlist" style="color: ${this.activeProfileTab === 'wishlist' ? '#1a1a1a' : '#888'}; font-weight: ${this.activeProfileTab === 'wishlist' ? '600' : '400'}; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Wishlist</a>
              <button id="logoutBtn" style="background: none; border: none; text-align: left; color: #e74c3c; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-top: 2rem; cursor: pointer; padding: 0;">Sign Out</button>
            </nav>
          </div>

          <!-- Content Area -->
          <div style="background: #fff; padding: 0.5rem 0;">
             ${this.activeProfileTab === 'personal' ? `
               <form id="profileForm">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-bottom: 2.5rem;">
                     <div class="form-group">
                        <label style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; color: #999; display: block; margin-bottom: 0.8rem;">Full Name</label>
                        <input type="text" id="profName" class="form-control" value="${savedUser.name}" style="border: none; border-bottom: 1px solid #eee; padding: 0.8rem 0; background: transparent; border-radius: 0; font-size: 1.1rem; width: 100%;">
                     </div>
                     <div class="form-group">
                        <label style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; color: #999; display: block; margin-bottom: 0.8rem;">Email Address</label>
                        <input type="email" value="${savedUser.email}" disabled style="border: none; border-bottom: 1px solid #eee; padding: 0.8rem 0; background: transparent; border-radius: 0; font-size: 1.1rem; opacity: 0.5; width: 100%;">
                     </div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-bottom: 2.5rem;">
                     <div class="form-group">
                        <label style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; color: #999; display: block; margin-bottom: 0.8rem;">Contact Number</label>
                        <input type="text" id="profPhone" class="form-control" placeholder="+91 00000 00000" value="${savedUser.phone}" style="border: none; border-bottom: 1px solid #eee; padding: 0.8rem 0; background: transparent; border-radius: 0; font-size: 1.1rem; width: 100%;">
                   </div>
                   <div class="form-group">
                      <label style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; color: #999; display: block; margin-bottom: 0.8rem;">Shipping City</label>
                      <input type="text" id="profAddress" class="form-control" placeholder="Ranchi, Jharkhand" value="${savedUser.address}" style="border: none; border-bottom: 1px solid #eee; padding: 0.8rem 0; background: transparent; border-radius: 0; font-size: 1.1rem; width: 100%;">
                   </div>
                </div>
                
                <div style="margin-top: 4rem;">
                   <button type="submit" class="btn btn-primary" style="padding: 1.2rem 4rem; background: #1a1a1a; color: white; border: none; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; font-size: 0.9rem;">Save Changes</button>
                </div>
               </form>

             ` : this.activeProfileTab === 'orders' ? `
               <div>
                  <h3 style="text-transform: uppercase; letter-spacing: 2px; font-weight: 400; font-size: 1.2rem; margin-bottom: 2rem;">Order History</h3>
                  ${orderHistory.length === 0 ? `
                    <p style="color: #888;">No orders found yet. Start your journey with one of our collections.</p>
                  ` : orderHistory.map(order => `
                    <div style="border: 1px solid #eee; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
                       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #f9f9f9; padding-bottom: 1rem;">
                          <div>
                             <span style="font-size: 0.7rem; text-transform: uppercase; color: #aaa; letter-spacing: 1px;">Order ID</span>
                             <div style="font-weight: 600; font-size: 0.9rem;">#${order.id}</div>
                          </div>
                          <div style="text-align: right;">
                             <span style="font-size: 0.7rem; text-transform: uppercase; color: #aaa; letter-spacing: 1px;">Date</span>
                             <div style="font-weight: 500; font-size: 0.9rem;">${order.date}</div>
                          </div>
                       </div>
                       <div style="margin-bottom: 1.5rem;">
                          ${order.items.map(it => `
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem; color: #555;">
                               <span>${it.name} (x${it.quantity})</span>
                               <span>₹${(it.price * it.quantity).toFixed(2)}</span>
                            </div>
                          `).join('')}
                       </div>
                       <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #f9f9f9;">
                          <div>
                             <span style="font-size: 0.7rem; text-transform: uppercase; color: #aaa; letter-spacing: 1px; display: block;">Status</span>
                             <span style="background: #fff8e1; color: #f39c12; font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">${order.status}</span>
                          </div>
                          <div style="text-align: right;">
                             <span style="font-size: 0.7rem; text-transform: uppercase; color: #aaa; letter-spacing: 1px;">Total</span>
                             <div style="font-size: 1.2rem; font-weight: 600; color: #1a1a1a;">₹${order.total.toFixed(2)}</div>
                          </div>
                       </div>
                    </div>
                  `).join('')}
               </div>
             ` : `
               <div>
                  <h3 style="text-transform: uppercase; letter-spacing: 2px; font-weight: 400; font-size: 1.2rem; margin-bottom: 2rem;">My Wishlist</h3>
                  ${this.wishlist.length === 0 ? `
                    <p style="color: #888;">Your wishlist is currently empty. Shop our curated collections to add your favorites!</p>
                  ` : `
                    <div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
                       ${this.wishlist.map(wid => {
                         const wp = products.find(prod => prod.id === wid);
                         return wp ? this.createProductCard(wp) : '';
                       }).join('')}
                    </div>
                  `}
               </div>
             `}
          </div>
        </div>
      </div>
    `;

    // Handle Tabs
    document.querySelectorAll('#profileTabs a[data-tab]').forEach(link => {
       link.addEventListener('click', (e) => {
          this.activeProfileTab = e.target.getAttribute('data-tab');
          this.renderProfile();
       });
    });

    if (this.activeProfileTab === 'personal') {
      document.getElementById('profileForm').addEventListener('submit', (e) => {
         e.preventDefault();
         const updated = {
            name: document.getElementById('profName').value,
            email: savedUser.email,
            phone: document.getElementById('profPhone').value,
            address: document.getElementById('profAddress').value
         };
         localStorage.setItem('currentUser', JSON.stringify(updated));
         this.showToast('Profile updated successfully!');
         this.renderProfile();
      });
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
       this.isLoggedIn = false;
       this.showToast('Signed out successfully');
       window.location.hash = '/';
       this.updateUserNav();
    });

    this.attachProductEvents();
  }


  initHomeCarousel() {
    const track = document.getElementById('testimonialCarousel');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!track || dots.length === 0) return;

    let currentIndex = 0;
    const updateCarousel = (index) => {
      currentIndex = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.style.background = i === index ? '#d4af37' : '#ccc';
        dot.style.borderColor = i === index ? '#d4af37' : '#ccc';
      });
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => updateCarousel(i));
    });

    // Auto slide every 5 seconds
    setInterval(() => {
      let nextIndex = (currentIndex + 1) % dots.length;
      updateCarousel(nextIndex);
    }, 5000);
  }

  renderCategory(category, title) {
    const filtered = products.filter(p => p.category === category);
    
    this.root.innerHTML = `
      <div class="page-header animate-fade-in">
        <div class="container">
          <h1 style="text-transform: uppercase; letter-spacing: 3px; font-weight: 400;">${title}</h1>
          <p style="color: #888;">Explore our latest arrivals in ${title.toLowerCase()}</p>
        </div>
      </div>
      
      <div class="container section" style="padding-top: 0">
        <div class="view-toggles" style="display: flex; gap: 1.5rem; justify-content: flex-start; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 1.2rem 0; margin-bottom: 2.5rem; align-items: center;">
            <button class="view-btn active" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; color: #121212;"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg></button>
            <button class="view-btn" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; color: #bbb;"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"/></svg></button>
            <button class="view-btn" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; color: #bbb;"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v3H4V4zm0 5h16v3H4V9zm0 5h16v3H4v-3zm0 5h16v3H4v-3z"/></svg></button>
        </div>

        <div class="category-layout">
          <!-- Sidebar -->
          <aside class="sidebar">
            
            <div class="filter-group" style="border-bottom: 1px solid #eee; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
               <div class="filter-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                  <span style="font-weight: 500; letter-spacing: 1.2px; font-size: 0.95rem; color: #121212;">AVAILABILITY</span>
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
               </div>
               <div class="filter-content" style="margin-top: 1.2rem;">
                  <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer; font-size: 0.95rem; color: #444;">
                    <input type="checkbox" class="stock-filter" style="width: 18px; height: 18px; accent-color: var(--color-accent); cursor: pointer;"> In Stock Only
                  </label>
               </div>
            </div>

            <div class="filter-group" style="border-bottom: 1px solid #eee; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
               <div class="filter-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                  <span style="font-weight: 500; letter-spacing: 1.2px; font-size: 0.95rem; color: #121212;">PRICE</span>
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg></span>
               </div>
               <div class="filter-content" style="margin-top: 1.2rem; display: flex; flex-direction: column; gap: 0.8rem;">
                  <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer; font-size: 0.95rem; color: #444;">
                    <input type="checkbox" class="price-filter" value="0-1000" style="width: 18px; height: 18px; accent-color: var(--color-accent); cursor: pointer;"> Under ₹1,000
                  </label>
                  <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer; font-size: 0.95rem; color: #444;">
                    <input type="checkbox" class="price-filter" value="1000-2000" style="width: 18px; height: 18px; accent-color: var(--color-accent); cursor: pointer;"> ₹1,000 - ₹2,000
                  </label>
                   <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer; font-size: 0.95rem; color: #444;">
                    <input type="checkbox" class="price-filter" value="2000+" style="width: 18px; height: 18px; accent-color: var(--color-accent); cursor: pointer;"> Above ₹2,000
                  </label>
               </div>
            </div>

             <div class="filter-group" style="border-bottom: 1px solid #eee; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
               <div class="filter-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                  <span style="font-weight: 500; letter-spacing: 1.2px; font-size: 0.95rem; color: #121212;">CATEGORY</span>
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg></span>
               </div>
               <div class="filter-content" style="margin-top: 1.2rem; display: flex; flex-direction: column; gap: 1rem;">
                  ${['All', 'Blouse', 'Dresses'].map(sub => `
                    <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer; font-size: 0.95rem; color: #444;">
                      <input type="radio" name="subCategory" value="${sub}" ${sub === 'All' ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--color-accent); cursor: pointer;"> ${sub}
                    </label>
                  `).join('')}
               </div>
            </div>

            <div class="filter-group" style="border-bottom: 1px solid #eee; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
               <div class="filter-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                  <span style="font-weight: 500; letter-spacing: 1.2px; font-size: 0.95rem; color: #121212;">SLEEVES</span>
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
               </div>
               <div class="filter-content" style="margin-top: 1.2rem; display: flex; flex-direction: column; gap: 0.8rem;">
                  ${['Sleeveless', 'Half Sleeve', 'Full Sleeve'].map(type => `
                    <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer; font-size: 0.95rem; color: #444;">
                      <input type="checkbox" class="sleeve-filter" value="${type}" style="width: 18px; height: 18px; accent-color: var(--color-accent); cursor: pointer;"> ${type}
                    </label>
                  `).join('')}
               </div>
            </div>

             <div class="filter-group" style="border-bottom: 1px solid #eee; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
               <div class="filter-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                  <span style="font-weight: 500; letter-spacing: 1.2px; font-size: 0.95rem; color: #121212;">MATERIAL</span>
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
               </div>
               <div class="filter-content" style="margin-top: 1.2rem; display: flex; flex-direction: column; gap: 0.8rem;">
                  ${['Silk', 'Velvet', 'Satin', 'Brocade'].map(mat => `
                    <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer; font-size: 0.95rem; color: #444;">
                      <input type="checkbox" class="material-filter" value="${mat}" style="width: 18px; height: 18px; accent-color: var(--color-accent); cursor: pointer;"> ${mat}
                    </label>
                  `).join('')}
               </div>
            </div>
          </aside>

          <!-- Main Grid -->
          <div style="flex: 1;">
            <div class="product-grid animate-fade-in animate-delay-1" id="categoryProductGrid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
              ${filtered.map(p => this.createProductCard(p)).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachProductEvents();
    this.attachFilterEvents(filtered);
  }

  attachFilterEvents(originalList) {
    const grid = document.getElementById('categoryProductGrid');
    const stockCheck = document.querySelector('.stock-filter');
    const priceChecks = document.querySelectorAll('.price-filter');
    const sleeveChecks = document.querySelectorAll('.sleeve-filter');
    const materialChecks = document.querySelectorAll('.material-filter');
    const subRadios = document.querySelectorAll('input[name="subCategory"]');

    const runFilters = () => {
      let result = originalList;

      // Subcategory filter
      const selectedSub = Array.from(subRadios).find(r => r.checked).value;
      if (selectedSub !== 'All') {
        result = result.filter(p => p.subCategory === selectedSub);
      }

      // Stock filter
      if (stockCheck.checked) {
        result = result.filter(p => p.quantity > 0);
      }

      // Price filter
      const activePrices = Array.from(priceChecks).filter(c => c.checked).map(c => c.value);
      if (activePrices.length > 0) {
        result = result.filter(p => {
          return activePrices.some(range => {
            if (range === '0-1000') return p.price < 1000;
            if (range === '1000-2000') return p.price >= 1000 && p.price <= 2000;
            if (range === '2000+') return p.price > 2000;
            return false;
          });
        });
      }

      // Sleeve filter
      const activeSleeves = Array.from(sleeveChecks).filter(c => c.checked).map(c => c.value);
      if (activeSleeves.length > 0) {
        result = result.filter(p => {
          return activeSleeves.some(type => p.specification && p.specification.includes(type));
        });
      }

      // Material filter
      const activeMats = Array.from(materialChecks).filter(c => c.checked).map(c => c.value);
      if (activeMats.length > 0) {
        result = result.filter(p => {
          return activeMats.some(mat => p.specification && p.specification.toLowerCase().includes(mat.toLowerCase()));
        });
      }

      grid.innerHTML = result.length > 0 
        ? result.map(p => this.createProductCard(p)).join('') 
        : `<div style="text-align: center; grid-column: 1/-1; padding: 4rem 0;">No products found matching your filters.</div>`;
      
      this.attachProductEvents();
    };

    stockCheck.addEventListener('change', runFilters);
    priceChecks.forEach(c => c.addEventListener('change', runFilters));
    sleeveChecks.forEach(c => c.addEventListener('change', runFilters));
    materialChecks.forEach(c => c.addEventListener('change', runFilters));
    subRadios.forEach(r => r.addEventListener('change', runFilters));

    // Accordion Toggle
    document.querySelectorAll('.filter-header').forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('svg path');
        if (content.style.display === 'none') {
           content.style.display = 'flex';
           if (content.classList.contains('filter-content')) content.style.flexDirection = 'column';
           icon.setAttribute('d', 'M18 15l-6-6-6 6'); // up
        } else {
           content.style.display = 'none';
           icon.setAttribute('d', 'M6 9l6 6 6-6'); // down
        }
      });
    });

    // View Toggles
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.style.color = '#bbb');
        btn.style.color = '#121212';
        
        if (idx === 0) grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        if (idx === 1) grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(400px, 1fr))';
        if (idx === 2) grid.style.gridTemplateColumns = '1fr';
      });
    });
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
          grid-template-columns: 55% 45%;
          gap: 4rem;
          align-items: start;
        }
        .aachho-gallery {
          display: flex;
          gap: 1.5rem;
          align-items: start;
        }
        .thumbnails-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 80px;
          flex-shrink: 0;
        }
        .thumbnail-img {
          width: 100%;
          border-radius: var(--border-radius);
          cursor: pointer;
          border: 1px solid transparent;
          transition: border 0.2s;
          object-fit: cover;
        }
        .thumbnail-img.active { border-color: var(--color-accent); }
        .main-image-container { flex: 1; }
        .main-image {
          width: 100%;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          object-fit: cover;
        }
        .product-info-detail {
          padding-right: 15px;
          padding-bottom: 2rem;
        }
        @media (max-width: 768px) {
          .aachho-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .aachho-gallery {
            flex-direction: column-reverse;
          }
          .thumbnails-container {
            flex-direction: row;
            width: 100%;
            overflow-x: auto;
          }
          .thumbnail-img {
            width: 80px;
          }
        }
      </style>
      <div class="container section animate-fade-in" style="padding-top: 1.5rem;">
        <div class="breadcrumb" style="font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 1px;">
          <a href="#/" style="color: inherit; text-decoration: none;">Home</a> / <a href="#/${product.category}" style="color: inherit; text-decoration: none;">${product.category === 'men' ? 'Menswear' : 'Womenswear'}</a> / ${product.name}
        </div>

        <div class="aachho-layout">
          <div class="aachho-gallery">
            ${product.images ? `
              <div class="thumbnails-container">
                ${product.images.map((img, i) => `<img src="${img}" data-src="${img}" class="thumbnail-img ${i === 0 ? 'active' : ''}" alt="${product.name} thumbnail ${i+1}">`).join('')}
              </div>
              <div class="main-image-container">
                <img src="${product.images[0]}" class="main-image" id="mainImage" alt="${product.name}">
              </div>
            ` : `
              <div class="main-image-container" style="width: 100%;">
                <img src="${product.image}" class="main-image" id="mainImage" alt="${product.name}">
              </div>
            `}
          </div>
          
          <div class="product-info-detail">
            <div style="font-size: 0.8rem; letter-spacing: 4px; color: var(--color-text-secondary); margin-bottom: 0.5rem; text-transform: uppercase;">L B</div>
            <h1 style="font-family: 'Times New Roman', Times, serif; font-size: 2.2rem; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; color: #333; margin-bottom: 0.5rem; line-height: 1.2;">
              ${product.name}
            </h1>
            
            <div style="display: flex; align-items: center; gap: 0.5rem; color: #f5b301; font-size: 1.1rem; margin-bottom: 1.5rem;">
              ★★★★★ <span style="color: var(--color-text-secondary); font-size: 0.9rem; margin-left: 0.2rem;">${Math.floor(product.rating * 5)} reviews</span>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.3rem;">
                <span style="font-size: 1.5rem; font-weight: 500; color: #333;">₹${product.price.toFixed(2)}</span>
              </div>
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
              <button class="wishlist-btn-detail ${this.wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}" style="border: 1px solid #ddd; background: ${this.wishlist.includes(product.id) ? '#fdf5f5' : 'transparent'}; padding: 0 1.2rem; font-size: 1.5rem; border-radius: 4px; color: ${this.wishlist.includes(product.id) ? '#e74c3c' : '#666'}; line-height: 1; transition: all 0.2s; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="${this.wishlist.includes(product.id) ? '#e74c3c' : 'none'}" stroke="currentColor" stroke-width="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <button id="btn-add-cart" data-id="${product.id}" style="background: #cc6b6b; color: white; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; flex: 1; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">
                ADD TO CART
              </button>
              <input type="hidden" class="qty-input" value="1" id="qty-val">
            </div>
            

            <div class="product-accordion" style="border-top: 1px solid var(--color-border); padding: 1.2rem 0; cursor: pointer;">
              <h3 class="accordion-header" style="font-size: 1rem; font-weight: 600; margin: 0; color: #333; display: flex; justify-content: space-between;">
                Product Description <span class="accordion-icon" style="font-weight: 400; color: var(--color-text-secondary); font-size: 1.4rem; line-height: 1;">-</span>
              </h3>
              <div class="accordion-content" style="display: block; margin-top: 1rem;">
                <p style="color: var(--color-text-secondary); line-height: 1.6; font-size: 0.9rem; white-space: pre-line;">${product.description}</p>
              </div>
            </div>
            ${product.keyFeatures ? `
            <div class="product-accordion" style="border-top: 1px solid var(--color-border); padding: 1.2rem 0; cursor: pointer;">
              <h3 class="accordion-header" style="font-size: 1rem; font-weight: 600; margin: 0; color: #333; display: flex; justify-content: space-between;">
                Key Features <span class="accordion-icon" style="font-weight: 400; color: var(--color-text-secondary); font-size: 1.4rem; line-height: 1;">+</span>
              </h3>
              <div class="accordion-content" style="display: none; margin-top: 1rem;">
                <div style="font-size: 0.9rem;">${
                  '<ul style="list-style-type: none; padding: 0; margin: 0;">' + 
                  product.keyFeatures.split('\n').filter(l=>l.trim()).map(l => {
                    const idx = l.indexOf(':');
                    if(idx > -1) {
                      return `<li style="padding-bottom: 0.8rem; border-bottom: 1px solid #f0f0f0; margin-bottom: 0.8rem;"><span style="font-weight: 600; color: #333; display: inline-block; min-width: 130px;">${l.substring(0, idx)}</span> <span style="color: var(--color-text-secondary); line-height: 1.5; display: inline-block; vertical-align: top; max-width: calc(100% - 140px);">${l.substring(idx + 1).trim()}</span></li>`;
                    }
                    return `<li style="padding-bottom: 0.8rem; color: var(--color-text-secondary); border-bottom: 1px solid #f0f0f0; margin-bottom: 0.8rem;">${l}</li>`;
                  }).join('') + '</ul>'
                }</div>
              </div>
            </div>
            ` : ''}
            ${product.specification ? `
            <div class="product-accordion" style="border-top: 1px solid var(--color-border); padding: 1.2rem 0; cursor: pointer;">
              <h3 class="accordion-header" style="font-size: 1rem; font-weight: 600; margin: 0; color: #333; display: flex; justify-content: space-between;">
                Specification <span class="accordion-icon" style="font-weight: 400; color: var(--color-text-secondary); font-size: 1.4rem; line-height: 1;">+</span>
              </h3>
              <div class="accordion-content" style="display: none; margin-top: 1rem;">
                <div style="font-size: 0.9rem;">${
                  '<ul style="list-style-type: none; padding: 0; margin: 0;">' + 
                  product.specification.split('\n').filter(l=>l.trim()).map(l => {
                    const idx = l.indexOf(':');
                    if(idx > -1) {
                      return `<li style="padding-bottom: 0.8rem; border-bottom: 1px solid #f0f0f0; margin-bottom: 0.8rem;"><span style="font-weight: 600; color: #333; display: inline-block; min-width: 140px;">${l.substring(0, idx)}</span> <span style="color: var(--color-text-secondary);">${l.substring(idx + 1).trim()}</span></li>`;
                    }
                    return `<li style="padding-bottom: 0.8rem; color: var(--color-text-secondary); border-bottom: 1px solid #f0f0f0; margin-bottom: 0.8rem;">${l}</li>`;
                  }).join('') + '</ul>'
                }</div>
              </div>
            </div>
            ` : ''}
            <div class="product-accordion" style="border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 1.2rem 0; cursor: pointer;">
             <h3 class="accordion-header" style="font-size: 1rem; font-weight: 600; margin: 0; color: #333; display: flex; justify-content: space-between;">
                Shipping Information <span class="accordion-icon" style="font-weight: 400; color: var(--color-text-secondary); font-size: 1.4rem; line-height: 1;">+</span>
              </h3>
              <div class="accordion-content" style="display: none; margin-top: 1rem;">
                <p style="color: var(--color-text-secondary); line-height: 1.6; font-size: 0.9rem;">
                  Free premium express shipping on all orders. Dispatch within 24 hours. Returns and exchanges available within 30 days of delivery for unworn items.
                </p>
              </div>
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

    // Accordions
    document.querySelectorAll('.product-accordion').forEach(accordion => {
      const header = accordion.querySelector('.accordion-header');
      if (header) {
        header.addEventListener('click', () => {
          const content = accordion.querySelector('.accordion-content');
          const icon = accordion.querySelector('.accordion-icon');
          const isExpanded = content.style.display === 'block';

          document.querySelectorAll('.accordion-content').forEach(c => c.style.display = 'none');
          document.querySelectorAll('.accordion-icon').forEach(i => i.textContent = '+');

          if (!isExpanded) {
            content.style.display = 'block';
            if(icon) icon.textContent = '-';
          }
        });
      }
    });

    // Gallery Thumbnails
    document.querySelectorAll('.thumbnail-img').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const src = e.target.getAttribute('data-src');
        if (src) {
          document.getElementById('mainImage').src = src;
          document.querySelectorAll('.thumbnail-img').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
        }
      });
    });

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
    if (!this.isLoggedIn) {
      this.toggleUser(true);
      this.root.innerHTML = `
        <div class="container section text-center">
          <h2>Please Sign In to Checkout</h2>
          <p class="mb-4">You need to be logged in to complete your purchase safely.</p>
          <button class="btn btn-primary open-user" onclick="document.querySelector('.open-user').click()">Sign In Now</button>
        </div>
      `;
      return;
    }

    if (this.cart.length === 0) {
      this.root.innerHTML = `
        <div class="container section text-center">
          <h2>Your cart is empty</h2>
          <a href="#/" class="btn btn-primary mt-3">Continue Shopping</a>
        </div>
      `;
      return;
    }

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0;
    let total = subtotal + shipping - this.discount;

    this.root.innerHTML = `
      <div class="page-header">
        <div class="container">
          <h1 style="text-transform: uppercase; letter-spacing: 2px; font-weight: 300;">Checkout</h1>
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
                  <input type="text" class="form-control" placeholder="Chandan" required>
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" class="form-control" placeholder="Kumar" required>
                </div>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" placeholder="chandan@example.com" required>
              </div>
              <div class="form-group">
                <label>Address</label>
                <input type="text" class="form-control" placeholder="Ranchi, Jharkhand" required>
              </div>
              
              <h3 class="mt-5 mb-3">Payment Method</h3>
              <div class="payment-options" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                <label style="display: flex; align-items: center; gap: 1rem; padding: 1.2rem; border: 1px solid #eee; border-radius: 8px; cursor: pointer; transition: border-color 0.3s;">
                  <input type="radio" name="payment" value="card" checked style="width: 20px; height: 20px; accent-color: #d4af37;">
                  <div style="display: flex; align-items: center; gap: 1rem; width: 100%;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    <span>Credit Card / Debit Card</span>
                  </div>
                </label>
                <label style="display: flex; align-items: center; gap: 1rem; padding: 1.2rem; border: 1px solid #eee; border-radius: 8px; cursor: pointer; transition: border-color 0.3s;">
                  <input type="radio" name="payment" value="upi" style="width: 20px; height: 20px; accent-color: #d4af37;">
                  <div style="display: flex; align-items: center; gap: 1rem; width: 100%;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span>UPI Payment (PhonePe, GPay, Paytm)</span>
                  </div>
                </label>
                <label style="display: flex; align-items: center; gap: 1rem; padding: 1.2rem; border: 1px solid #eee; border-radius: 8px; cursor: pointer; transition: border-color 0.3s;">
                  <input type="radio" name="payment" value="cod" style="width: 20px; height: 20px; accent-color: #d4af37;">
                  <div style="display: flex; align-items: center; gap: 1rem; width: 100%;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20m10-10H2"/></svg>
                    <span>Cash On Delivery (COD)</span>
                  </div>
                </label>
              </div>

              <!-- Card Details (Hidden if UPI or COD) -->
              <div id="cardDetails" class="form-group animate-fade-in">
                <label>Card Number</label>
                <input type="text" class="form-control" placeholder="0000 0000 0000 0000">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                   <input type="text" class="form-control" placeholder="MM/YY">
                   <input type="password" class="form-control" placeholder="CVV">
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-full mt-5" style="padding: 1.2rem; font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Complete Order</button>
            </form>
          </div>
          <div>
            <div style="background: #fafafa; padding: 2.5rem; border-radius: 12px; position: sticky; top: 120px;">
              <h3 class="mb-4" style="text-transform: uppercase; letter-spacing: 1px; font-size: 1.1rem;">Order Summary</h3>
              ${this.cart.map(item => `
                <div class="flex-between mb-3" style="font-size: 0.95rem;">
                  <span style="color: #444;">${item.name} (x${item.quantity})</span>
                  <span style="font-weight: 500;">₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              
              <div class="coupon-section mt-4 mb-4" style="padding: 1.5rem 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" id="couponCode" class="form-control" placeholder="Coupon Code" style="flex: 1; text-transform: uppercase;" value="${this.appliedCoupon}">
                  <button id="applyCoupon" class="btn" style="background: #1a1a1a; color: white; padding: 0 1.5rem; font-size: 0.8rem; text-transform: uppercase;">Apply</button>
                </div>
                ${this.discount > 0 ? `<div style="color: var(--color-success); font-size: 0.8rem; margin-top: 0.5rem;">Code ${this.appliedCoupon} applied successfully!</div>` : ''}
              </div>

              <div class="flex-between mb-2">
                <span style="color: #666;">Subtotal</span>
                <span>₹${subtotal.toFixed(2)}</span>
              </div>
              <div class="flex-between mb-2">
                <span style="color: #666;">Shipping</span>
                <span style="color: var(--color-success);">FREE</span>
              </div>
              ${this.discount > 0 ? `
                <div class="flex-between mb-2" style="color: var(--color-accent);">
                  <span>Discount</span>
                  <span>-₹${this.discount.toFixed(2)}</span>
                </div>
              ` : ''}
              <hr style="margin: 1.5rem 0; border: 0; border-top: 1px solid #eee;" />
              <div class="flex-between" style="font-size: 1.4rem; font-weight: 600; color: #1a1a1a;">
                <span>Total</span>
                <span>₹${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Handle Payment Method Toggles
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('cardDetails');
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        cardDetails.style.display = e.target.value === 'card' ? 'block' : 'none';
        // Highlight chosen option
        document.querySelectorAll('.payment-options label').forEach(l => l.style.borderColor = '#eee');
        radio.parentElement.style.borderColor = '#d4af37';
      });
    });

    // Handle Coupon
    document.getElementById('applyCoupon').addEventListener('click', () => {
      const code = document.getElementById('couponCode').value.trim().toUpperCase();
      if (code === 'FIRST20') {
        this.discount = subtotal * 0.2;
        this.appliedCoupon = code;
        this.showToast('20% discount applied!');
        this.renderCheckout();
      } else if (code === 'LB10') {
        this.discount = subtotal * 0.1;
        this.appliedCoupon = code;
        this.showToast('10% discount applied!');
        this.renderCheckout();
      } else {
        this.showToast('Invalid coupon code');
      }
    });

    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
      const paymentLabel = paymentMethod === 'cod' ? 'Cash on Delivery' : (paymentMethod === 'upi' ? 'UPI' : 'Card');
      
      // Save to order history
      const order = {
        id: 'LB-' + Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        items: [...this.cart],
        total: total,
        payment: paymentLabel,
        status: 'Processing'
      };
      const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orders.unshift(order);
      localStorage.setItem('orderHistory', JSON.stringify(orders));

      this.cart = [];
      this.discount = 0;
      this.appliedCoupon = '';
      this.saveCart();
      this.updateCartUI();
      window.scrollTo(0,0);
      this.root.innerHTML = `
        <div class="container section text-center animate-fade-in" style="padding: 10rem 0;">
          <div style="font-size: 5rem; color: #d4af37; margin-bottom: 2rem;">✷</div>
          <h2 style="text-transform: uppercase; letter-spacing: 4px; font-weight: 300;">Order Confirmed</h2>
          <p class="mb-5" style="color: #666; font-size: 1.1rem;">Thank you, Your payment via <strong>${paymentLabel}</strong> was successful.<br>A confirmation has been sent to your email.</p>
          <a href="#/" class="btn btn-primary" style="padding: 1.2rem 4rem;">Return to Boutique</a>
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
            At La Benediction, we take pride in the exceptional quality and craftsmanship of our apparel. If you are not completely satisfied with your purchase, we accept returns and exchanges within 30 days of the delivery date. Items must be unworn, unwashed, and have original tags attached.
          </p>

          <h3 class="mb-2">How to Request a Return or Exchange</h3>
          <ol class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8; padding-left: 1.2rem;">
            <li class="mb-2">Sign in to your La Benediction account and visit the <strong>Orders</strong> section.</li>
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
            <a href="mailto:support@labenediction.dummy" class="btn btn-primary">Contact Support</a>
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
            <p style="color: var(--color-text-secondary); line-height: 1.8;">Once your order is shipped, you will receive an email with a tracking link. You can also view your order status in the "Orders" section of your La Benediction account.</p>
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
            <a href="mailto:support@labenediction.dummy" class="btn btn-primary">Contact Us</a>
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
          <p>The story behind La Benediction.</p>
        </div>
      </div>
      <div class="container section animate-fade-in animate-delay-1" style="padding-top: 0; max-width: 800px; margin: 0 auto;">
        <div>
          <img src="assets/images/hero.png" alt="La Benediction Studio" style="width: 100%; border-radius: var(--border-radius); margin-bottom: 2.5rem; height: 350px; object-fit: cover;">
          
          <h3 class="mb-2">Our Vision</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            La Benediction was born from a simple idea: that premium fashion shouldn't be defined by exorbitant logos, but by exceptional fit, superior fabrics, and timeless design. We set out to create a modern wardrobe for the confident individual.
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
            We use the information we collect to provide, maintain, and improve our services, process transactions, send related information including confirmations and receipts, and communicate with you about products, services, offers, and events offered by La Benediction.
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
          <p>Rules and guidelines for using La Benediction.</p>
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
            The website and its original content, features, and functionality are owned by La Benediction and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          
          <h3 class="mb-2">3. User Accounts</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          
          <h3 class="mb-2">4. Limitation of Liability</h3>
          <p class="mb-4" style="color: var(--color-text-secondary); line-height: 1.8;">
            In no event shall La Benediction, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </div>
      </div>
    `;
  }

  // --- HELPERS ---

  createProductCard(product) {
    const inWishlist = this.wishlist.includes(product.id);
    return `
      <div class="product-card">
        <div class="product-img-wrapper">
          <div class="product-badges">
            ${product.isNew ? `<span class="badge">New</span>` : ''}
            <button class="wishlist-heart ${inWishlist ? 'active' : ''}" data-id="${product.id}" style="background: white; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.3s;">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="${inWishlist ? '#e74c3c' : 'none'}" stroke="${inWishlist ? '#e74c3c' : '#333'}" stroke-width="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
               </svg>
            </button>
          </div>
          <img src="${product.image}" class="product-img" alt="${product.name}" onclick="window.location.hash='/product/${product.id}'">
          <div class="product-actions-overlay">
            <button class="product-quick-add add-to-cart-btn" data-id="${product.id}">Quick Add</button>
          </div>
        </div>
        <div class="product-info" onclick="window.location.hash='/product/${product.id}'">
          <h3 class="product-name">${product.name}</h3>
          <span class="product-price">₹${product.price.toFixed(2)}</span>
        </div>
      </div>
    `;
  }

  attachProductEvents() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(e.target.dataset.id);
        this.addToCart(id, 1, 'M'); 
      });
    });

    document.querySelectorAll('.wishlist-heart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Handle SVG path click
        const target = e.target.closest('.wishlist-heart');
        const id = parseInt(target.dataset.id);
        this.toggleWishlist(id);
      });
    });
  }

  toggleWishlist(id) {
    const index = this.wishlist.indexOf(id);
    if (index === -1) {
      this.wishlist.push(id);
      this.showToast('Added to Wishlist');
    } else {
      this.wishlist.splice(index, 1);
      this.showToast('Removed from Wishlist');
    }
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    this.renderCurrentView(); // Re-render to update heart icons
  }

  renderCurrentView() {
    const hash = window.location.hash.slice(1) || '/';
    if (hash === '/') this.renderHome();
    else if (hash === '/women') this.renderCategory('women', 'Women');
    else if (hash === '/profile') this.renderProfile();
    else if (hash.startsWith('/product/')) this.renderProduct(parseInt(hash.split('/')[2]));
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
      this.cartTotalElement.innerText = '₹0.00';
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
            <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
            <button class="cart-item-remove" data-id="${item.id}" data-size="${item.size}">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    this.cartTotalElement.innerText = `₹${total.toFixed(2)}`;

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
