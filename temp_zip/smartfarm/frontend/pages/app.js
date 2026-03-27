// ============================================
//   SMARTFARM – FULL STACK APP (Frontend JS)
//   Simulates: Auth, Routing, API calls, State
// ============================================

// ===== APP STATE =====
const AppState = {
  currentUser: null,
  currentPage: 'dashboard',
  cart: [],
  notifications: 3,
};

// ===== MOCK DATABASE =====
const DB = {
  users: [
    { id:1, email:'farmer@demo.com', password:'demo123', role:'farmer', name:'Rajesh Kumar', avatar:'R' },
    { id:2, email:'buyer@demo.com', password:'demo123', role:'buyer', name:'Priya Sharma', avatar:'P' },
    { id:3, email:'admin@demo.com', password:'demo123', role:'admin', name:'Admin User', avatar:'A' },
  ],
  products: [
    { id:1, name:'Premium Wheat', farmer:'Rajesh Kumar', price:2200, unit:'per quintal', qty:'500 kg', emoji:'🌾', badge:'Organic', rating:4.8, reviews:124, location:'Punjab' },
    { id:2, name:'Basmati Rice', farmer:'Suresh Patel', price:4800, unit:'per quintal', qty:'300 kg', emoji:'🍚', badge:'Grade A', rating:4.9, reviews:89, location:'Haryana' },
    { id:3, name:'Fresh Tomatoes', farmer:'Meena Devi', price:35, unit:'per kg', qty:'200 kg', emoji:'🍅', badge:'Farm Fresh', rating:4.7, reviews:56, location:'Maharashtra' },
    { id:4, name:'Green Chilli', farmer:'Arun Singh', price:80, unit:'per kg', qty:'150 kg', emoji:'🌶', badge:'Spicy', rating:4.6, reviews:43, location:'Andhra Pradesh' },
    { id:5, name:'Alphonso Mangoes', farmer:'Vijay Patil', price:350, unit:'per dozen', qty:'800 dozens', emoji:'🥭', badge:'Export Quality', rating:5.0, reviews:201, location:'Ratnagiri' },
    { id:6, name:'Onions', farmer:'Ram Yadav', price:25, unit:'per kg', qty:'1000 kg', emoji:'🧅', badge:'Fresh', rating:4.5, reviews:78, location:'Nashik' },
    { id:7, name:'Garlic', farmer:'Kiran Sharma', price:180, unit:'per kg', qty:'200 kg', emoji:'🧄', badge:'Organic', rating:4.8, reviews:62, location:'Madhya Pradesh' },
    { id:8, name:'Soybean', farmer:'Mohan Gupta', price:4200, unit:'per quintal', qty:'2000 kg', emoji:'🫘', badge:'Non-GMO', rating:4.7, reviews:45, location:'Vidarbha' },
  ],
  orders: [
    { id:'SF2024-089', product:'Basmati Rice', qty:'50 kg', total:'₹2,400', status:'Delivered', date:'2024-01-15', buyer:'Priya Sharma' },
    { id:'SF2024-088', product:'Fresh Tomatoes', qty:'20 kg', total:'₹700', status:'In Transit', date:'2024-01-14', buyer:'Ankit Joshi' },
    { id:'SF2024-087', product:'Premium Wheat', qty:'100 kg', total:'₹2,200', status:'Processing', date:'2024-01-13', buyer:'Suman Verma' },
    { id:'SF2024-086', product:'Green Chilli', qty:'10 kg', total:'₹800', status:'Delivered', date:'2024-01-10', buyer:'Radha Mehta' },
  ],
  schemes: [
    { icon:'🌱', name:'PM-KISAN Samman Nidhi', desc:'Direct income support of ₹6,000/year to farmer families in 3 equal installments.', benefit:'₹6,000/year', link:'#' },
    { icon:'💧', name:'PM Krishi Sinchai Yojana', desc:'Ensuring access to irrigation at farm level. Har Khet Ko Pani, More Crop Per Drop.', benefit:'Up to ₹1.5 lakh subsidy', link:'#' },
    { icon:'🛡', name:'PM Fasal Bima Yojana', desc:'Crop insurance scheme providing financial support to farmers suffering crop loss.', benefit:'Premium: 2% for Kharif', link:'#' },
    { icon:'🚜', name:'Kisan Credit Card (KCC)', desc:'Institutional credit facility for agriculture, allied activities and non-farm activities.', benefit:'Credit up to ₹3 lakh', link:'#' },
    { icon:'🏦', name:'Agriculture Infrastructure Fund', desc:'Medium-long term financing facility for post harvest management infrastructure.', benefit:'3% interest subvention', link:'#' },
    { icon:'🌾', name:'MSP Support Price', desc:'Minimum Support Price for 23 crops notified by GoI ensuring fair price to farmers.', benefit:'Price Guarantee', link:'#' },
  ],
  news: [
    { cat:'Market', title:'Wheat prices surge 12% amid strong export demand from Europe', date:'Jan 15, 2024', sentiment:'pos', emoji:'📈' },
    { cat:'Weather', title:'IMD forecasts above-normal monsoon in 2024 – Good news for Kharif crops', date:'Jan 14, 2024', sentiment:'pos', emoji:'🌧' },
    { cat:'Policy', title:'Government raises MSP for Rabi crops by 7%, highest increase in 5 years', date:'Jan 13, 2024', sentiment:'pos', emoji:'🏛' },
    { cat:'Disease', title:'Alert: New strain of rice blast fungus detected in eastern states', date:'Jan 12, 2024', sentiment:'neg', emoji:'⚠' },
    { cat:'Technology', title:'AI-powered drones to be deployed in 5 states for precision agriculture', date:'Jan 11, 2024', sentiment:'pos', emoji:'🤖' },
    { cat:'Export', title:'India agri exports decline 4% in Q3 due to global commodity slowdown', date:'Jan 10, 2024', sentiment:'neg', emoji:'📉' },
  ],
  videos: [
    { title:'Modern Drip Irrigation Techniques for Water Conservation', channel:'AgriTech India', views:'2.4M', duration:'18:32', emoji:'💧' },
    { title:'Organic Farming – Complete Guide for Beginners', channel:'Krishak Channel', views:'1.8M', duration:'45:20', emoji:'🌿' },
    { title:'AI in Agriculture – Future of Farming in India', channel:'TechFarm', views:'890K', duration:'22:15', emoji:'🤖' },
    { title:'Soil Health Card – How to Use and Improve Soil Quality', channel:'ICAR Official', views:'1.2M', duration:'12:45', emoji:'🌱' },
    { title:'PM-KISAN Scheme – Complete Application Process 2024', channel:'GovSchemes', views:'3.1M', duration:'8:50', emoji:'📋' },
    { title:'Pesticide-Free Farming – Natural Pest Control Methods', channel:'OrganicFarm', views:'560K', duration:'31:10', emoji:'🪲' },
  ],
  transactions: [
    { id:'TXN-001', type:'Credit', desc:'Order SF2024-088 received', amount:'+₹700', date:'Jan 15', status:'Completed' },
    { id:'TXN-002', type:'Debit', desc:'Platform commission (5%)', amount:'-₹35', date:'Jan 15', status:'Completed' },
    { id:'TXN-003', type:'Credit', desc:'Order SF2024-087 escrow released', amount:'+₹2,200', date:'Jan 13', status:'Completed' },
    { id:'TXN-004', type:'Withdrawal', desc:'Bank transfer to HDFC *4521', amount:'-₹5,000', date:'Jan 12', status:'Processing' },
  ],
};

// ===== AUTH FUNCTIONS =====
function showTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById(`${tab}-form`).classList.add('active');
  document.querySelectorAll('.tab-btn')[tab === 'login' ? 0 : 1].classList.add('active');
}

function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const user = DB.users.find(u => u.email === email && u.password === password);
  if (!user) {
    // Demo: auto-match partial for easier testing
    const demoUser = DB.users.find(u => u.email.includes('farmer'));
    loginUser(demoUser);
    showToast('🎉 Logged in as Demo Farmer');
    return;
  }
  loginUser(user);
  showToast(`👋 Welcome back, ${user.name}!`);
}

function handleGoogleAuth() {
  const demoUser = { id:99, email:'google@demo.com', role:'farmer', name:'Google User', avatar:'G' };
  loginUser(demoUser);
  showToast('✅ Signed in with Google');
}

function handleRegister() {
  const demoUser = DB.users[0];
  loginUser(demoUser);
  showToast('🌾 Account created! Welcome to SmartFarm');
}

function loginUser(user) {
  AppState.currentUser = user;
  localStorage.setItem('sf_user', JSON.stringify(user));
  document.getElementById('auth-overlay').classList.remove('active');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('nav-avatar').textContent = user.avatar;
  document.getElementById('nav-name').textContent = user.name;
  document.getElementById('nav-role').textContent = capitalize(user.role);
  document.getElementById('topbar-avatar').textContent = user.avatar;
  if (user.role === 'admin') document.querySelector('.admin-only').classList.remove('hidden');
  navigate('dashboard');
}

function handleLogout() {
  AppState.currentUser = null;
  localStorage.removeItem('sf_user');
  document.getElementById('auth-overlay').classList.add('active');
  document.getElementById('main-app').classList.add('hidden');
}

// ===== ROUTING =====
function navigate(page) {
  AppState.currentPage = page;
  document.querySelectorAll('.nav-item').forEach(i => {
    i.classList.toggle('active', i.getAttribute('onclick')?.includes(page));
  });
  document.getElementById('page-title').textContent = pageTitles[page] || 'SmartFarm';
  renderPage(page);
  if (window.innerWidth < 640) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

const pageTitles = {
  dashboard: 'Dashboard', marketplace: 'Marketplace', 'crop-prediction': 'Crop Prediction',
  'rain-forecast': 'Rain Forecast', 'disease-detection': 'Disease Detection', chatbot: 'AI Chatbot',
  schemes: 'Government Schemes', news: 'Agriculture News', videos: 'Video Learning',
  orders: 'My Orders', payments: 'Payments & Wallet', support: 'Support Center', admin: 'Admin Panel',
};

function renderPage(page) {
  const content = document.getElementById('page-content');
  const renderers = {
    dashboard: renderDashboard, marketplace: renderMarketplace,
    'crop-prediction': renderCropPrediction, 'rain-forecast': renderRainForecast,
    'disease-detection': renderDiseaseDetection, chatbot: renderChatbot,
    schemes: renderSchemes, news: renderNews, videos: renderVideos,
    orders: renderOrders, payments: renderPayments, support: renderSupport, admin: renderAdmin,
  };
  content.innerHTML = renderers[page] ? renderers[page]() : `<div class="section-header"><h1 class="section-title">${page}</h1></div><p>Coming soon...</p>`;
  afterRender(page);
}

// ===== PAGE RENDERERS =====

function renderDashboard() {
  const user = AppState.currentUser;
  const isFarmer = user?.role === 'farmer';
  return `
  <div class="dashboard-header">
    <div class="dashboard-greeting">Good morning, ${user?.name?.split(' ')[0] || 'Farmer'} 🌤</div>
    <div class="dashboard-sub">Here's what's happening on your farm today — ${new Date().toLocaleDateString('en-IN', {weekday:'long',day:'numeric',month:'long'})}</div>
  </div>
  <div class="stats-grid">
    <div class="stat-card green">
      <div class="stat-icon">🌾</div>
      <div class="stat-value">${isFarmer ? '8' : '12'}</div>
      <div class="stat-label">${isFarmer ? 'Active Listings' : 'Orders Placed'}</div>
      <div class="stat-change up">↑ 2 this week</div>
    </div>
    <div class="stat-card amber">
      <div class="stat-icon">💰</div>
      <div class="stat-value">${isFarmer ? '₹24K' : '₹8.2K'}</div>
      <div class="stat-label">${isFarmer ? 'Earnings This Month' : 'Total Spent'}</div>
      <div class="stat-change up">↑ 18% vs last month</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-icon">📦</div>
      <div class="stat-value">${isFarmer ? '34' : '3'}</div>
      <div class="stat-label">${isFarmer ? 'Orders Received' : 'Pending Deliveries'}</div>
      <div class="stat-change up">↑ 5 new today</div>
    </div>
    <div class="stat-card red">
      <div class="stat-icon">🌧</div>
      <div class="stat-value">72%</div>
      <div class="stat-label">Rain Probability (2 days)</div>
      <div class="stat-change down">⚠ Plan irrigation</div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-header">
        <div class="card-title">📊 Monthly Revenue</div>
        <a class="card-action" onclick="navigate('payments')">View details →</a>
      </div>
      <div class="card-body">
        <div class="chart-bar-group" id="revenue-chart">
          ${['Aug','Sep','Oct','Nov','Dec','Jan'].map((m,i) => {
            const h = [55,70,45,85,60,90][i];
            return `<div class="chart-bar-wrap">
              <div class="chart-bar" style="height:0%" data-h="${h}%" title="${m}: ₹${h*300}"></div>
              <div class="chart-label">${m}</div>
            </div>`;
          }).join('')}
        </div>
        <div class="text-muted mt-8">Revenue in ₹ thousands — Animated on load</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">☀ Today's Weather</div>
        <a class="card-action" onclick="navigate('rain-forecast')">Full forecast →</a>
      </div>
      <div class="card-body">
        <div class="weather-widget">
          <div class="weather-main">
            <div class="weather-icon">⛅</div>
            <div>
              <div class="weather-temp">28°C</div>
              <div class="weather-desc">Partly Cloudy — Vadodara, GJ</div>
            </div>
          </div>
          <div class="weather-details">
            <div class="weather-detail"><div class="weather-detail-label">Humidity</div><div class="weather-detail-value">65%</div></div>
            <div class="weather-detail"><div class="weather-detail-label">Wind</div><div class="weather-detail-value">14 km/h</div></div>
            <div class="weather-detail"><div class="weather-detail-label">UV Index</div><div class="weather-detail-value">High</div></div>
            <div class="weather-detail"><div class="weather-detail-label">Rainfall</div><div class="weather-detail-value">0 mm</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="grid-3">
    <div class="card">
      <div class="card-header"><div class="card-title">📦 Recent Orders</div><a class="card-action" onclick="navigate('orders')">All orders →</a></div>
      <div class="card-body">
        <div class="activity-list">
          ${DB.orders.slice(0,3).map(o => `
          <div class="activity-item">
            <div class="activity-dot"></div>
            <div>
              <div class="activity-text"><strong>${o.id}</strong> — ${o.product}</div>
              <div class="activity-time">${o.total} · <span class="badge ${o.status==='Delivered'?'badge-green':o.status==='In Transit'?'badge-amber':'badge-blue'}">${o.status}</span></div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🌾 Crop Recommendations</div><a class="card-action" onclick="navigate('crop-prediction')">AI Predict →</a></div>
      <div class="card-body">
        <div class="activity-list">
          ${[['Wheat','Ideal for current conditions — Rabi season'],['Mustard','High demand, good price outlook'],['Chickpea','Drought resistant — suits your soil']].map(([crop,desc])=>`
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--amber-500)"></div>
            <div>
              <div class="activity-text"><strong>${crop}</strong></div>
              <div class="activity-time">${desc}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🔔 Alerts & Notifications</div></div>
      <div class="card-body">
        <div class="activity-list">
          ${[['🌧','Heavy rain expected Thursday – Pause irrigation'],['🦠','Pest activity reported 5 km away – Monitor crops'],['💰','Payment of ₹4,500 released from escrow']].map(([icon,msg])=>`
          <div class="activity-item">
            <div style="font-size:1.2rem">${icon}</div>
            <div class="activity-text">${msg}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function renderMarketplace() {
  const role = AppState.currentUser?.role;
  return `
  <div class="section-header">
    <div class="section-title">🛒 Farmer-to-Customer Marketplace</div>
    <div class="section-sub">Fresh produce directly from farmers — no middlemen</div>
  </div>
  ${role === 'farmer' ? `
  <div class="card" style="margin-bottom:20px">
    <div class="card-body" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <div style="flex:1;min-width:200px">
        <div style="font-weight:700;margin-bottom:4px">Your Listings</div>
        <div class="text-muted">3 active listings · 8 orders pending</div>
      </div>
      <button class="primary-btn" style="width:auto;padding:10px 24px" onclick="showAddProductModal()">+ Add New Product</button>
    </div>
  </div>` : ''}
  <div class="marketplace-toolbar">
    <input class="search-input" placeholder="🔍 Search crops, vegetables, fruits..." oninput="filterProducts(this.value)" />
    <button class="filter-btn active" onclick="filterCategory('all',this)">All</button>
    <button class="filter-btn" onclick="filterCategory('grains',this)">Grains</button>
    <button class="filter-btn" onclick="filterCategory('vegetables',this)">Vegetables</button>
    <button class="filter-btn" onclick="filterCategory('fruits',this)">Fruits</button>
    <button class="filter-btn" onclick="filterCategory('spices',this)">Spices</button>
    ${AppState.cart.length > 0 ? `<button class="primary-btn" style="width:auto;padding:9px 20px" onclick="openCart()">🛒 Cart (${AppState.cart.length})</button>` : ''}
  </div>
  <div class="products-grid" id="products-grid">
    ${DB.products.map(p => `
    <div class="product-card">
      <div class="product-img">
        <span style="font-size:5rem">${p.emoji}</span>
        <div class="product-badge">${p.badge}</div>
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-farmer">👨‍🌾 ${p.farmer} · 📍 ${p.location}</div>
        <div class="product-rating">★★★★${p.rating >= 5 ? '★' : '☆'} ${p.rating} (${p.reviews} reviews)</div>
        <div class="product-meta">
          <div class="product-price">₹${p.price}</div>
          <div class="product-qty">Available: ${p.qty}</div>
        </div>
        <div class="text-muted mt-4" style="font-size:.72rem">${p.unit}</div>
        <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>`).join('')}
  </div>
  <!-- CART MODAL -->
  <div class="modal-overlay" id="cart-modal">
    <div class="modal-box">
      <div class="modal-title">🛒 Your Cart</div>
      <div id="cart-items"></div>
      <div class="modal-actions">
        <button class="btn-outline" onclick="closeCart()">Continue Shopping</button>
        <button class="btn-primary" onclick="openCheckout()">Proceed to Pay</button>
      </div>
    </div>
  </div>
  <!-- CHECKOUT MODAL -->
  <div class="modal-overlay" id="checkout-modal">
    <div class="modal-box">
      <div class="modal-title">💳 Secure Checkout</div>
      <div style="margin-bottom:12px">
        <div style="font-size:.8rem;font-weight:700;color:var(--text-muted);margin-bottom:8px">SELECT PAYMENT METHOD</div>
        <div class="payment-methods">
          <div class="payment-method selected" onclick="selectPayment(this,'upi')">📱 UPI</div>
          <div class="payment-method" onclick="selectPayment(this,'card')">💳 Card</div>
          <div class="payment-method" onclick="selectPayment(this,'netbanking')">🏦 Net Banking</div>
          <div class="payment-method" onclick="selectPayment(this,'wallet')">👛 Wallet</div>
        </div>
      </div>
      <div style="background:var(--green-100);border-radius:var(--radius);padding:14px;margin-bottom:12px">
        <div style="font-size:.8rem;font-weight:700;margin-bottom:8px">ESCROW PAYMENT FLOW</div>
        <div class="escrow-flow">
          <div class="escrow-step">
            <div class="escrow-dot done">✓</div>
            <div class="escrow-label">Order</div>
          </div>
          <div class="escrow-step">
            <div class="escrow-dot active">⏳</div>
            <div class="escrow-label">Escrow</div>
          </div>
          <div class="escrow-step">
            <div class="escrow-dot">📦</div>
            <div class="escrow-label">Deliver</div>
          </div>
          <div class="escrow-step">
            <div class="escrow-dot">✓</div>
            <div class="escrow-label">Release</div>
          </div>
        </div>
        <div class="text-muted" style="margin-top:8px">Your payment is held safely until delivery is confirmed</div>
      </div>
      <div id="checkout-summary"></div>
      <div class="modal-actions">
        <button class="btn-outline" onclick="closeCheckout()">Cancel</button>
        <button class="btn-primary" onclick="confirmPayment()">Pay Now (Razorpay)</button>
      </div>
    </div>
  </div>`;
}

function renderCropPrediction() {
  return `
  <div class="section-header">
    <div class="section-title">🌾 AI Crop Recommendation</div>
    <div class="section-sub">ML-powered crop prediction using Random Forest algorithm</div>
  </div>
  <div class="prediction-layout">
    <div class="form-card">
      <div class="form-card-title">🧪 Enter Soil & Climate Parameters</div>
      <div class="form-group"><label>Nitrogen (N) — kg/ha</label><input type="number" id="cp-n" placeholder="e.g. 90" value="90" /></div>
      <div class="form-group"><label>Phosphorus (P) — kg/ha</label><input type="number" id="cp-p" placeholder="e.g. 42" value="42" /></div>
      <div class="form-group"><label>Potassium (K) — kg/ha</label><input type="number" id="cp-k" placeholder="e.g. 43" value="43" /></div>
      <div class="form-row">
        <div class="form-group"><label>Temperature (°C)</label><input type="number" id="cp-temp" placeholder="e.g. 22" value="22" /></div>
        <div class="form-group"><label>Humidity (%)</label><input type="number" id="cp-humidity" placeholder="e.g. 82" value="82" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Soil pH</label><input type="number" id="cp-ph" placeholder="e.g. 6.5" step="0.1" value="6.5" /></div>
        <div class="form-group"><label>Rainfall (mm)</label><input type="number" id="cp-rain" placeholder="e.g. 200" value="200" /></div>
      </div>
      <div class="form-group">
        <label>State / Region</label>
        <select id="cp-state">
          <option>Gujarat</option><option>Maharashtra</option><option>Punjab</option>
          <option>Haryana</option><option>Madhya Pradesh</option><option>Uttar Pradesh</option>
        </select>
      </div>
      <div class="form-group">
        <label>Current Season</label>
        <select>
          <option>Rabi (Winter)</option><option>Kharif (Monsoon)</option><option>Zaid (Summer)</option>
        </select>
      </div>
      <button class="primary-btn" onclick="predictCrop()">🤖 Predict Best Crops</button>
    </div>
    <div id="crop-result" style="display:flex;flex-direction:column;gap:16px">
      <div style="background:var(--green-100);border-radius:var(--radius-lg);padding:32px;text-align:center;color:var(--text-muted)">
        <div style="font-size:3rem">🌾</div>
        <div style="margin-top:8px">Fill parameters and click Predict to get AI recommendations</div>
      </div>
    </div>
  </div>`;
}

function renderRainForecast() {
  const days = [
    { day:'Today', icon:'⛅', high:28, low:18, rain:20, desc:'Partly Cloudy' },
    { day:'Tue', icon:'🌤', high:31, low:20, rain:5, desc:'Mostly Sunny' },
    { day:'Wed', icon:'🌧', high:24, low:17, rain:85, desc:'Heavy Rain' },
    { day:'Thu', icon:'⛈', high:22, low:16, rain:90, desc:'Thunderstorm' },
    { day:'Fri', icon:'🌦', high:26, low:18, rain:40, desc:'Showers' },
    { day:'Sat', icon:'☀', high:30, low:19, rain:5, desc:'Sunny' },
    { day:'Sun', icon:'☀', high:32, low:21, rain:0, desc:'Clear Sky' },
  ];
  return `
  <div class="section-header">
    <div class="section-title">🌧 Rain & Weather Forecast</div>
    <div class="section-sub">XGBoost ML model + IMD weather data integration</div>
  </div>
  <div class="grid-2" style="margin-bottom:20px">
    <div class="result-card" style="background:linear-gradient(135deg,#1e3a5f,#2563eb)">
      <div class="result-label">Rain Probability Next 48 Hours</div>
      <div class="result-value">72%</div>
      <div class="result-confidence">
        <div>High</div>
        <div class="confidence-bar"><div class="confidence-fill" style="width:72%"></div></div>
        <div>Confidence: 87%</div>
      </div>
      <div class="recommendation-list">
        <div class="recommendation-item">⚠ Delay irrigation for the next 3 days</div>
        <div class="recommendation-item">💡 Harvest ready crops before Wednesday</div>
        <div class="recommendation-item">🧪 Avoid pesticide application before rain</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📍 Your Location</div></div>
      <div class="card-body">
        <div class="form-group"><label>Select District</label>
          <select onchange="updateWeather(this.value)">
            <option>Vadodara, Gujarat</option><option>Surat, Gujarat</option><option>Ahmedabad, Gujarat</option>
            <option>Pune, Maharashtra</option><option>Nashik, Maharashtra</option>
          </select>
        </div>
        <div style="background:var(--amber-100);border-radius:var(--radius);padding:12px;margin-top:12px">
          <div style="font-weight:700;color:var(--amber-600);font-size:.85rem">⚠ Weather Advisory</div>
          <div style="font-size:.8rem;margin-top:4px;color:var(--earth-700)">Heavy rainfall warning issued for your district. Expected 35-50mm over 2 days. Ensure proper field drainage.</div>
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header"><div class="card-title">📅 7-Day Forecast</div></div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px">
        ${days.map((d,i) => `
        <div style="text-align:center;padding:12px 8px;border-radius:var(--radius);background:${i===2||i===3?'rgba(37,99,235,.08)':'var(--cream)'}">
          <div style="font-size:.75rem;font-weight:600;color:var(--text-muted)">${d.day}</div>
          <div style="font-size:2rem;margin:8px 0">${d.icon}</div>
          <div style="font-size:.75rem;font-weight:700">${d.high}°/${d.low}°</div>
          <div style="font-size:.68rem;color:${d.rain>70?'#3b82f6':'var(--text-muted)'};margin-top:3px">💧 ${d.rain}%</div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderDiseaseDetection() {
  return `
  <div class="section-header">
    <div class="section-title">🔬 Crop Disease Detection</div>
    <div class="section-sub">MobileNetV2 CNN model — Upload a leaf photo for instant diagnosis</div>
  </div>
  <div class="prediction-layout">
    <div class="form-card">
      <div class="form-card-title">📸 Upload Crop Photo</div>
      <div class="upload-zone" id="upload-zone" onclick="document.getElementById('file-input').click()" ondragover="event.preventDefault();this.classList.add('dragover')" ondragleave="this.classList.remove('dragover')" ondrop="handleDrop(event)">
        <div class="upload-icon" id="upload-preview">🍃</div>
        <div class="upload-text">Click to upload or drag & drop</div>
        <div class="upload-sub">JPG, PNG up to 10MB · Best results with clear leaf photos</div>
      </div>
      <input type="file" id="file-input" accept="image/*" style="display:none" onchange="handleFileUpload(event)" />
      <div class="form-group" style="margin-top:16px">
        <label>Crop Type</label>
        <select id="crop-type">
          <option>Wheat</option><option>Rice</option><option>Tomato</option>
          <option>Corn / Maize</option><option>Cotton</option><option>Soybean</option><option>Potato</option>
        </select>
      </div>
      <button class="primary-btn" onclick="detectDisease()" style="margin-top:12px">🔍 Analyze Disease</button>
    </div>
    <div id="disease-result-panel">
      <div style="background:var(--green-100);border-radius:var(--radius-lg);padding:32px;text-align:center;color:var(--text-muted)">
        <div style="font-size:3rem">🔬</div>
        <div style="margin-top:8px">Upload a leaf/plant photo to detect diseases instantly using AI</div>
        <div style="margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${['✓ Leaf Blight','✓ Rust Fungus','✓ Powdery Mildew','✓ Root Rot','✓ Mosaic Virus','✓ Bacterial Wilt'].map(d => `<div style="font-size:.78rem;background:var(--white);padding:6px 10px;border-radius:8px">${d}</div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function renderChatbot() {
  const languages = ['English', 'Hindi', 'Gujarati', 'Marathi', 'Punjabi', 'Tamil', 'Telugu'];
  return `
  <div class="section-header">
    <div class="section-title">🤖 AI Farm Assistant</div>
    <div class="section-sub">Multilingual agricultural chatbot — Ask anything about farming</div>
  </div>
  <div class="lang-selector">
    ${languages.map((l,i) => `<div class="lang-chip ${i===0?'active':''}" onclick="selectLang(this,'${l}')">${l}</div>`).join('')}
  </div>
  <div class="chatbot-container">
    <div class="chat-messages" id="chat-messages">
      <div class="chat-msg bot">👋 <strong>Namaste!</strong> I'm your Smart Farm AI assistant.<br><br>I can help with:<br>• Crop recommendations & planting schedules<br>• Disease identification & treatment<br>• Weather-based farming advice<br>• Government schemes & subsidies<br>• Market prices & selling tips<br><br>What would you like to know today?</div>
      <div class="chat-msg bot">💡 <strong>Quick questions you can ask:</strong><br>"What crops should I grow this Rabi season?"<br>"How to treat wheat rust disease?"<br>"What is the MSP for wheat in 2024?"</div>
    </div>
    <div class="chat-input-row">
      <input class="chat-input" id="chat-input" placeholder="Ask anything about farming..." onkeypress="if(event.key==='Enter')sendChat()" />
      <button class="chat-send-btn" onclick="sendChat()">Send ➤</button>
    </div>
  </div>`;
}

function renderSchemes() {
  return `
  <div class="section-header">
    <div class="section-title">🏛 Government Schemes Portal</div>
    <div class="section-sub">Central & State government schemes for farmers — Apply online</div>
  </div>
  <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
    <input class="search-input" style="max-width:320px" placeholder="🔍 Search schemes..." />
    <button class="filter-btn active">All Schemes</button>
    <button class="filter-btn">Central Govt</button>
    <button class="filter-btn">State Govt</button>
    <button class="filter-btn">Insurance</button>
    <button class="filter-btn">Credit</button>
  </div>
  <div class="schemes-grid">
    ${DB.schemes.map(s => `
    <div class="scheme-card">
      <div class="scheme-icon">${s.icon}</div>
      <div class="scheme-name">${s.name}</div>
      <div class="scheme-desc">${s.desc}</div>
      <div class="scheme-benefit">💰 ${s.benefit}</div>
      <a class="scheme-link" href="${s.link}">Apply / Learn More →</a>
    </div>`).join('')}
  </div>`;
}

function renderNews() {
  return `
  <div class="section-header">
    <div class="section-title">📰 Agriculture News</div>
    <div class="section-sub">AI-analyzed news with BERT sentiment analysis</div>
  </div>
  <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
    <button class="filter-btn active">All News</button>
    <button class="filter-btn">Market</button>
    <button class="filter-btn">Weather</button>
    <button class="filter-btn">Policy</button>
    <button class="filter-btn">Disease Alert</button>
    <button class="filter-btn">Technology</button>
  </div>
  <div class="news-grid">
    ${DB.news.map(n => `
    <div class="news-card">
      <div class="news-img">${n.emoji}</div>
      <div class="news-body">
        <div class="news-category">${n.cat}</div>
        <div class="news-title">${n.title}</div>
        <div class="news-meta">
          <div class="news-date">${n.date}</div>
          <div class="sentiment-badge sentiment-${n.sentiment}">${n.sentiment==='pos'?'Positive':n.sentiment==='neg'?'Negative':'Neutral'}</div>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

function renderVideos() {
  return `
  <div class="section-header">
    <div class="section-title">🎥 Video Learning Platform</div>
    <div class="section-sub">Curated agricultural training videos from experts</div>
  </div>
  <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
    <input class="search-input" style="max-width:280px" placeholder="🔍 Search videos..." />
    <button class="filter-btn active">All Topics</button>
    <button class="filter-btn">Irrigation</button>
    <button class="filter-btn">Organic Farming</button>
    <button class="filter-btn">Technology</button>
    <button class="filter-btn">Government Schemes</button>
  </div>
  <div class="video-grid">
    ${DB.videos.map(v => `
    <div class="video-card" onclick="playVideo('${v.title}')">
      <div class="video-thumb">
        <div class="play-btn">▶</div>
        <div class="video-duration">${v.duration}</div>
      </div>
      <div class="video-body">
        <div class="video-title">${v.title}</div>
        <div class="video-channel">📺 ${v.channel}</div>
        <div class="video-views">👁 ${v.views} views</div>
      </div>
    </div>`).join('')}
  </div>`;
}

function renderOrders() {
  const role = AppState.currentUser?.role;
  return `
  <div class="section-header">
    <div class="section-title">📦 ${role === 'buyer' ? 'My Orders' : 'Orders Received'}</div>
    <div class="section-sub">Track all your orders and delivery status</div>
  </div>
  <div class="card">
    <div class="card-body" style="padding:0">
      <div class="orders-table-wrap">
        <table class="orders-table">
          <thead>
            <tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Total</th><th>${role==='buyer'?'Farmer':'Buyer'}</th><th>Date</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            ${DB.orders.map(o => `
            <tr>
              <td><span class="font-bold">${o.id}</span></td>
              <td>${o.product}</td>
              <td>${o.qty}</td>
              <td class="font-bold">${o.total}</td>
              <td>${o.buyer}</td>
              <td>${o.date}</td>
              <td><span class="badge ${o.status==='Delivered'?'badge-green':o.status==='In Transit'?'badge-amber':o.status==='Processing'?'badge-blue':'badge-red'}">${o.status}</span></td>
              <td><a style="color:var(--green-600);font-size:.8rem;cursor:pointer" onclick="viewOrder('${o.id}')">View ↗</a></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function renderPayments() {
  return `
  <div class="section-header">
    <div class="section-title">💳 Payments & Wallet</div>
    <div class="section-sub">Escrow-secured transactions — powered by Razorpay</div>
  </div>
  <div class="payment-layout">
    <div>
      <div class="wallet-card">
        <div class="wallet-label">AVAILABLE BALANCE</div>
        <div class="wallet-amount">₹12,450</div>
        <div style="font-size:.8rem;opacity:.6;margin-top:4px">+₹2,200 pending escrow release</div>
        <div class="wallet-actions">
          <button class="wallet-action-btn" onclick="withdrawFunds()">Withdraw</button>
          <button class="wallet-action-btn" onclick="showToast('📥 Add Money coming soon')">Add Money</button>
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="card-header"><div class="card-title">📊 Payment Stats</div></div>
        <div class="card-body">
          ${[['Total Earned','₹45,200','↑ this month'],['Platform Commission (5%)','₹2,260','Auto-deducted'],['Pending Release','₹2,200','2 orders'],['Withdrawn','₹30,490','To HDFC bank']].map(([l,v,s])=>`
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:.85rem">
            <div style="color:var(--text-secondary)">${l}</div>
            <div style="font-weight:700">${v} <span class="text-muted">${s}</span></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📋 Transaction History</div></div>
      <div class="card-body" style="padding:0">
        <div class="orders-table-wrap">
          <table class="orders-table">
            <thead><tr><th>ID</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${DB.transactions.map(t => `
              <tr>
                <td style="font-family:var(--font-mono);font-size:.75rem">${t.id}</td>
                <td>${t.desc}</td>
                <td class="font-bold" style="color:${t.amount.startsWith('+')?'var(--green-700)':'#ef4444'}">${t.amount}</td>
                <td>${t.date}</td>
                <td><span class="badge ${t.status==='Completed'?'badge-green':'badge-amber'}">${t.status}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}

function renderSupport() {
  return `
  <div class="section-header">
    <div class="section-title">☎ Support Center</div>
    <div class="section-sub">24/7 farmer support via call, WhatsApp, or ticket</div>
  </div>
  <div class="support-options">
    <div class="support-option" onclick="callSupport()">
      <div class="support-option-icon">📞</div>
      <div class="support-option-title">Call Support</div>
      <div class="support-option-sub">Mon–Sat 9AM–6PM<br>+91 1800-180-1551</div>
    </div>
    <div class="support-option" onclick="whatsappSupport()">
      <div class="support-option-icon">💬</div>
      <div class="support-option-title">WhatsApp Support</div>
      <div class="support-option-sub">24/7 available<br>Quick auto-replies</div>
    </div>
    <div class="support-option" onclick="showTicketForm()">
      <div class="support-option-icon">🎫</div>
      <div class="support-option-title">Raise Ticket</div>
      <div class="support-option-sub">Avg response: 4 hours<br>Track ticket status</div>
    </div>
  </div>
  <div class="card" id="ticket-form-card" style="display:none;margin-bottom:20px">
    <div class="card-header"><div class="card-title">🎫 New Support Ticket</div></div>
    <div class="card-body">
      <div class="form-group"><label>Issue Category</label>
        <select><option>Payment Issue</option><option>Order Problem</option><option>App Bug</option><option>Crop Advice</option><option>Other</option></select>
      </div>
      <div class="form-group"><label>Subject</label><input type="text" placeholder="Brief description of your issue" /></div>
      <div class="form-group"><label>Description</label><textarea style="width:100%;padding:10px;border:1.5px solid var(--border);border-radius:var(--radius);font-family:var(--font-body);resize:vertical;min-height:100px" placeholder="Describe your issue in detail..."></textarea></div>
      <button class="primary-btn" onclick="submitTicket()">Submit Ticket</button>
    </div>
  </div>
  <div class="card">
    <div class="card-header"><div class="card-title">🎫 My Tickets</div></div>
    <div class="card-body">
      ${[['TKT-001','Payment delayed for order SF2024-086','Resolved','Jan 12'],['TKT-002','Disease identification help needed','Open','Jan 15']].map(([id,sub,status,date])=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:.85rem">
        <div><div style="font-weight:700">${id}</div><div class="text-muted">${sub}</div></div>
        <div style="text-align:right"><span class="badge ${status==='Resolved'?'badge-green':'badge-amber'}">${status}</span><div class="text-muted mt-4">${date}</div></div>
      </div>`).join('')}
    </div>
  </div>`;
}

function renderAdmin() {
  if (AppState.currentUser?.role !== 'admin') return '<div class="section-header"><div class="section-title">⛔ Access Denied</div></div>';
  return `
  <div class="section-header">
    <div class="section-title">⚙ Admin Panel</div>
    <div class="section-sub">Platform management and analytics</div>
  </div>
  <div class="stats-grid" style="margin-bottom:20px">
    ${[['👥','1,248','Registered Users','↑ 24 today'],['🌾','348','Active Listings','↑ 12 new'],['💰','₹2.4L','Today\'s GMV','↑ 18%'],['🎫','23','Open Tickets','↓ 5 resolved']].map(([icon,val,label,change])=>`
    <div class="stat-card green">
      <div class="stat-icon">${icon}</div>
      <div class="stat-value">${val}</div>
      <div class="stat-label">${label}</div>
      <div class="stat-change up">${change}</div>
    </div>`).join('')}
  </div>
  <div class="admin-tabs">
    ${['Users','Products','Orders','Payments','Commissions','ML Models','Tickets','Fraud Alerts'].map((t,i)=>`<button class="admin-tab ${i===0?'active':''}" onclick="adminTab(this,'${t}')">${t}</button>`).join('')}
  </div>
  <div id="admin-tab-content">
    <div class="card">
      <div class="card-header"><div class="card-title">👥 User Management</div><button class="filter-btn" onclick="showToast('Export CSV downloaded')">Export CSV</button></div>
      <div class="card-body" style="padding:0">
        <div class="orders-table-wrap">
          <table class="orders-table">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${DB.users.map(u => `
              <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td><span class="badge ${u.role==='admin'?'badge-red':u.role==='farmer'?'badge-green':'badge-blue'}">${u.role}</span></td>
                <td>Jan 2024</td>
                <td><span class="badge badge-green">Active</span></td>
                <td><a style="color:var(--green-600);font-size:.8rem;cursor:pointer">Edit</a></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><div class="card-title">💸 Commission Settings</div></div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <div><div style="font-size:.8rem;color:var(--text-muted)">Platform Commission</div><div style="font-size:1.5rem;font-weight:700">5%</div></div>
          <div><div style="font-size:.8rem;color:var(--text-muted)">Total Collected (Jan)</div><div style="font-size:1.5rem;font-weight:700">₹18,400</div></div>
          <div style="flex:1"></div>
          <button class="filter-btn" onclick="showToast('Commission rate updated')">Update Rate</button>
        </div>
      </div>
    </div>
  </div>`;
}

// ===== INTERACTIVE LOGIC =====

function afterRender(page) {
  if (page === 'dashboard') {
    setTimeout(() => {
      document.querySelectorAll('.chart-bar').forEach(bar => {
        bar.style.height = bar.getAttribute('data-h');
      });
    }, 100);
  }
  if (page === 'chatbot') {
    document.getElementById('chat-input')?.focus();
  }
}

function predictCrop() {
  const n = document.getElementById('cp-n').value;
  const crops = [
    { name:'Wheat', confidence:92, icon:'🌾' },
    { name:'Chickpea', confidence:81, icon:'🫘' },
    { name:'Mustard', confidence:74, icon:'🌼' },
  ];
  document.getElementById('crop-result').innerHTML = `
  <div class="result-card">
    <div class="result-label">Top Recommended Crop</div>
    <div class="result-value">${crops[0].icon} ${crops[0].name}</div>
    <div class="result-confidence">
      <div>Confidence</div>
      <div class="confidence-bar"><div class="confidence-fill" style="width:0%" id="conf-bar"></div></div>
      <div id="conf-val">0%</div>
    </div>
    <div class="recommendation-list">
      ${crops.map(c => `<div class="recommendation-item">${c.icon} ${c.name} — ${c.confidence}% match</div>`).join('')}
      <div class="recommendation-item">🕐 Best planting window: Nov 15 – Dec 15</div>
      <div class="recommendation-item">💧 Water requirement: 450-650mm</div>
      <div class="recommendation-item">📈 Expected yield: 40-50 quintal/hectare</div>
    </div>
  </div>
  <div class="form-card">
    <div class="form-card-title">💰 Market Price Outlook</div>
    <div style="font-size:.85rem;color:var(--text-secondary);line-height:1.6">
      <div>Current MSP: <strong>₹2,275/quintal</strong></div>
      <div>Market Price: <strong>₹2,450/quintal</strong></div>
      <div>Forecast (3 months): <strong style="color:var(--green-700)">↑ ₹2,600/quintal</strong></div>
    </div>
  </div>`;
  setTimeout(() => {
    const bar = document.getElementById('conf-bar');
    const val = document.getElementById('conf-val');
    if (bar) { bar.style.transition = 'width 1.2s ease'; bar.style.width = '92%'; }
    if (val) val.textContent = '92%';
  }, 100);
  showToast('🌾 AI Prediction complete! Wheat recommended.');
}

function detectDisease() {
  const diseases = [
    { name:'Wheat Rust (Yellow Rust)', severity:'High', treatment:'Apply Propiconazole 25% EC @ 0.1% solution. Spray every 10-14 days.' },
    { name:'Healthy Crop', severity:'None', treatment:'No treatment needed. Continue regular monitoring.' },
    { name:'Leaf Blight', severity:'Medium', treatment:'Remove infected leaves. Apply copper-based fungicide.' },
  ];
  const d = diseases[Math.floor(Math.random() * diseases.length)];
  document.getElementById('disease-result-panel').innerHTML = `
  <div class="disease-result">
    <div style="font-weight:700;margin-bottom:8px">🔬 Analysis Complete</div>
    <div class="disease-name">${d.name}</div>
    <div class="disease-severity severity-${d.severity==='High'?'high':d.severity==='Medium'?'medium':'low'}">${d.severity} Severity</div>
    <div style="margin-top:12px;font-size:.85rem;color:var(--text-secondary)"><strong>Recommended Treatment:</strong><br>${d.treatment}</div>
    <div style="margin-top:12px;background:var(--green-100);border-radius:8px;padding:10px;font-size:.8rem">
      <strong>Prevention:</strong><br>• Rotate crops regularly<br>• Use certified disease-free seeds<br>• Maintain proper spacing for air circulation
    </div>
    <button class="primary-btn" style="margin-top:12px" onclick="navigate('chatbot')">💬 Ask AI for more help</button>
  </div>`;
  showToast('🔬 Disease analysis complete!');
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const zone = document.getElementById('upload-zone');
    const preview = document.getElementById('upload-preview');
    preview.textContent = '📸';
    zone.style.background = 'var(--green-100)';
    zone.style.borderColor = 'var(--green-500)';
    showToast(`📸 ${file.name} uploaded. Click Analyze.`);
  }
}

function handleDrop(event) {
  event.preventDefault();
  document.getElementById('upload-zone').classList.remove('dragover');
  showToast('📸 Image dropped. Click Analyze.');
}

const chatResponses = {
  wheat: "🌾 For Wheat cultivation:\n• Best planting time: Nov-Dec (Rabi season)\n• Water 6-8 times during growth\n• Apply NPK 120:60:40 kg/ha\n• Current MSP: ₹2,275/quintal",
  rain: "🌧 Based on IMD data, moderate to heavy rainfall expected in next 48 hours. Recommendation:\n• Delay sowing for 3 days\n• Ensure field drainage\n• Harvest ready crops today",
  disease: "🔬 Common diseases to watch:\n• Wheat Rust – Apply Propiconazole\n• Rice Blast – Use Tricyclazole\n• Tomato Blight – Copper fungicide\n\nUse our Disease Detection tool for specific diagnosis!",
  scheme: "🏛 Key schemes for you:\n• PM-KISAN: ₹6,000/year direct benefit\n• Fasal Bima: 2% premium crop insurance\n• KCC: Loans up to ₹3 lakh at 4% interest\n\nCheck the Schemes section for details!",
  price: "📈 Today's Market Prices:\n• Wheat: ₹2,450/quintal\n• Rice (Basmati): ₹4,800/quintal\n• Tomato: ₹35/kg\n• Onion: ₹25/kg\n\nPrices updated from APMC daily.",
  default: "🤖 Great question! Based on current agricultural data and AI analysis, here's my recommendation:\n\n• Monitor soil moisture levels daily\n• Check weather forecast before applying pesticides\n• Consider crop rotation for next season\n\nWould you like more specific advice on any topic?"
};

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  const messages = document.getElementById('chat-messages');
  messages.innerHTML += `<div class="chat-msg user">${msg}</div>`;
  messages.innerHTML += `<div class="chat-msg bot typing"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  input.value = '';
  messages.scrollTop = messages.scrollHeight;
  setTimeout(() => {
    const typing = messages.querySelector('.typing');
    const lc = msg.toLowerCase();
    let response = chatResponses.default;
    if (lc.includes('wheat') || lc.includes('crop')) response = chatResponses.wheat;
    else if (lc.includes('rain') || lc.includes('weather')) response = chatResponses.rain;
    else if (lc.includes('disease') || lc.includes('pest')) response = chatResponses.disease;
    else if (lc.includes('scheme') || lc.includes('subsid') || lc.includes('kisan')) response = chatResponses.scheme;
    else if (lc.includes('price') || lc.includes('msp') || lc.includes('market')) response = chatResponses.price;
    if (typing) typing.outerHTML = `<div class="chat-msg bot">${response.replace(/\n/g, '<br>')}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 1200);
}

function selectLang(el, lang) {
  document.querySelectorAll('.lang-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  showToast(`🌐 Language: ${lang}`);
}

function addToCart(productId) {
  const product = DB.products.find(p => p.id === productId);
  const existing = AppState.cart.find(c => c.id === productId);
  if (existing) existing.qty = (existing.qty || 1) + 1;
  else AppState.cart.push({ ...product, qty: 1 });
  showToast(`✅ ${product.name} added to cart!`);
  navigate('marketplace');
}

function openCart() {
  const modal = document.getElementById('cart-modal');
  const items = document.getElementById('cart-items');
  if (!modal || !items) return;
  if (AppState.cart.length === 0) { showToast('🛒 Cart is empty'); return; }
  let total = 0;
  items.innerHTML = AppState.cart.map(item => {
    const subtotal = item.price * (item.qty || 1);
    total += subtotal;
    return `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:2rem">${item.emoji}</div>
      <div style="flex:1"><div style="font-weight:700">${item.name}</div><div class="text-muted">₹${item.price} × ${item.qty || 1}</div></div>
      <div style="font-weight:700">₹${subtotal}</div>
    </div>`;
  }).join('') + `<div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:1.1rem"><div>Total</div><div>₹${total}</div></div>`;
  modal.classList.add('open');
}

function closeCart() { document.getElementById('cart-modal')?.classList.remove('open'); }
function closeCheckout() { document.getElementById('checkout-modal')?.classList.remove('open'); }

function openCheckout() {
  closeCart();
  const modal = document.getElementById('checkout-modal');
  const summary = document.getElementById('checkout-summary');
  if (!modal || !summary) return;
  let total = AppState.cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const commission = Math.round(total * 0.05);
  summary.innerHTML = `<div style="background:var(--cream);border-radius:var(--radius);padding:12px">
    <div style="display:flex;justify-content:space-between;font-size:.85rem;padding:4px 0"><span>Subtotal</span><span>₹${total}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:.85rem;padding:4px 0"><span>Platform fee (5%)</span><span>₹${commission}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:.85rem;padding:4px 0"><span>Delivery</span><span style="color:var(--green-700)">Free</span></div>
    <div style="display:flex;justify-content:space-between;font-weight:700;padding:8px 0;border-top:1px solid var(--border);margin-top:4px"><span>Total</span><span>₹${total + commission}</span></div>
  </div>`;
  modal.classList.add('open');
}

function selectPayment(el, method) {
  document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
}

function confirmPayment() {
  closeCheckout();
  AppState.cart = [];
  showToast('🎉 Payment successful! Order placed via Razorpay escrow.');
  setTimeout(() => navigate('orders'), 1500);
}

function showAddProductModal() { showToast('📦 Add Product form — Connect to backend API'); }
function filterProducts(q) { showToast(`🔍 Filtering: "${q}"`); }
function filterCategory(cat, el) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  showToast(`Filtered: ${cat}`);
}

function withdrawFunds() { showToast('💸 Withdrawal request submitted — 1-2 business days'); }
function viewOrder(id) { showToast(`📦 Order ${id} details — Full view in production`); }
function callSupport() { showToast('📞 Calling +91 1800-180-1551...'); }
function whatsappSupport() { window.open('https://wa.me/919999999999?text=Hello+SmartFarm+Support', '_blank'); showToast('💬 Opening WhatsApp...'); }
function showTicketForm() {
  const card = document.getElementById('ticket-form-card');
  if (card) card.style.display = card.style.display === 'none' ? 'block' : 'none';
}
function submitTicket() { showToast('✅ Ticket raised! You\'ll hear back within 4 hours.'); showTicketForm(); }
function playVideo(title) { showToast(`▶ Playing: ${title.substring(0,40)}...`); }
function adminTab(el, tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  showToast(`Admin: ${tab} section`);
}
function updateWeather(loc) { showToast(`📍 Weather updated for ${loc}`); }

// ===== UI HELPERS =====
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth < 640) {
    sidebar.classList.toggle('open');
  } else {
    sidebar.classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('expanded');
  }
}

function toggleNotifications() {
  const panel = document.getElementById('notif-panel');
  panel.classList.remove('hidden');
  panel.classList.toggle('open');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.classList.add('hidden'), 300); }, 3000);
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

// ===== OTP AUTO-TAB =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.otp-box').forEach((box, i, boxes) => {
    box.addEventListener('input', () => { if (box.value && i < boxes.length - 1) boxes[i + 1].focus(); });
    box.addEventListener('keydown', e => { if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus(); });
  });

  // Check persisted session
  const saved = localStorage.getItem('sf_user');
  if (saved) {
    try { loginUser(JSON.parse(saved)); } catch(e) {}
  }
});
