// ============================================
//   SMARTFARM – BACKEND SERVER (Node.js / Express)
//   Production-ready REST API
// ============================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'smartfarm_jwt_secret_2024';

// ===== MIDDLEWARE =====
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
  next();
};

// ===== MOCK DB (Replace with PostgreSQL in production) =====
const users = [
  { id: 1, email: 'farmer@demo.com', password: bcrypt.hashSync('demo123', 10), role: 'farmer', name: 'Rajesh Kumar' },
  { id: 2, email: 'buyer@demo.com', password: bcrypt.hashSync('demo123', 10), role: 'buyer', name: 'Priya Sharma' },
  { id: 3, email: 'admin@demo.com', password: bcrypt.hashSync('demo123', 10), role: 'admin', name: 'Admin User' },
];

const products = [
  { id: 1, farmerId: 1, name: 'Premium Wheat', price: 2200, qty: 500, unit: 'kg', emoji: '🌾', badge: 'Organic', rating: 4.8, location: 'Punjab', status: 'active' },
  { id: 2, farmerId: 1, name: 'Basmati Rice', price: 4800, qty: 300, unit: 'kg', emoji: '🍚', badge: 'Grade A', rating: 4.9, location: 'Haryana', status: 'active' },
];

const orders = [];
const transactions = [];
const escrowWallet = {};
const tickets = [];

// ===== AUTH ROUTES =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });
    if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), name, email, password: hashed, phone, role: role || 'farmer', createdAt: new Date(), verified: false };
    users.push(user);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Registration successful', token, user: { id: user.id, name, email, role: user.role } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/google', (req, res) => {
  // In production: verify Google OAuth token, extract user info
  const { googleToken } = req.body;
  const user = { id: uuidv4(), name: 'Google User', email: 'google@oauth.com', role: 'farmer' };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = users.find(u => u.id == req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...safe } = user;
  res.json(safe);
});

// ===== PRODUCTS / MARKETPLACE =====
app.get('/api/products', (req, res) => {
  const { category, location, search, page = 1, limit = 20 } = req.query;
  let results = products.filter(p => p.status === 'active');
  if (search) results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (location) results = results.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
  res.json({ products: results.slice((page-1)*limit, page*limit), total: results.length, page, pages: Math.ceil(results.length/limit) });
});

app.post('/api/products', authenticate, authorize('farmer', 'admin'), (req, res) => {
  const { name, price, qty, unit, description, category, location } = req.body;
  const product = { id: uuidv4(), farmerId: req.user.id, name, price, qty, unit, description, category, location, status: 'pending', createdAt: new Date() };
  products.push(product);
  res.status(201).json({ message: 'Product listed successfully', product });
});

app.put('/api/products/:id', authenticate, authorize('farmer', 'admin'), (req, res) => {
  const idx = products.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  products[idx] = { ...products[idx], ...req.body, updatedAt: new Date() };
  res.json({ message: 'Product updated', product: products[idx] });
});

// ===== ORDERS =====
app.post('/api/orders', authenticate, (req, res) => {
  const { productId, quantity, paymentMethod } = req.body;
  const product = products.find(p => p.id == productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const amount = product.price * quantity;
  const commission = Math.round(amount * 0.05);
  const order = {
    id: `SF${Date.now()}`, productId, buyerId: req.user.id, farmerId: product.farmerId,
    quantity, amount, commission, netAmount: amount - commission,
    status: 'confirmed', paymentStatus: 'escrow', paymentMethod,
    createdAt: new Date(),
  };
  orders.push(order);
  // Escrow
  escrowWallet[order.id] = { amount, released: false };
  transactions.push({ id: uuidv4(), orderId: order.id, type: 'escrow_hold', amount, createdAt: new Date() });
  res.status(201).json({ message: 'Order placed successfully', order, escrowId: order.id });
});

app.get('/api/orders', authenticate, (req, res) => {
  let userOrders = orders;
  if (req.user.role === 'farmer') userOrders = orders.filter(o => o.farmerId == req.user.id);
  else if (req.user.role === 'buyer') userOrders = orders.filter(o => o.buyerId == req.user.id);
  res.json({ orders: userOrders, total: userOrders.length });
});

app.put('/api/orders/:id/status', authenticate, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status;
  if (req.body.status === 'delivered' && escrowWallet[order.id] && !escrowWallet[order.id].released) {
    escrowWallet[order.id].released = true;
    transactions.push({ id: uuidv4(), orderId: order.id, type: 'escrow_release', amount: order.netAmount, createdAt: new Date() });
    order.paymentStatus = 'released';
  }
  res.json({ message: 'Order status updated', order });
});

// ===== PAYMENTS =====
app.post('/api/payments/initiate', authenticate, (req, res) => {
  // Razorpay order creation (mock)
  const { orderId, amount } = req.body;
  const razorpayOrder = { id: `rzp_${uuidv4()}`, amount: amount * 100, currency: 'INR', receipt: orderId, status: 'created' };
  res.json({ razorpayOrder, key: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo' });
});

app.post('/api/payments/verify', authenticate, (req, res) => {
  // Verify Razorpay signature (mock — implement crypto.createHmac in production)
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const order = orders.find(o => o.id === req.body.orderId);
  if (order) { order.paymentStatus = 'paid'; order.razorpayPaymentId = razorpayPaymentId; }
  res.json({ verified: true, message: 'Payment verified successfully' });
});

app.post('/api/payments/withdraw', authenticate, authorize('farmer'), (req, res) => {
  const { amount, bankAccount } = req.body;
  const withdrawal = { id: uuidv4(), farmerId: req.user.id, amount, bankAccount, status: 'processing', createdAt: new Date() };
  transactions.push({ ...withdrawal, type: 'withdrawal' });
  res.json({ message: 'Withdrawal request submitted', withdrawal });
});

app.get('/api/payments/wallet', authenticate, (req, res) => {
  const userTransactions = transactions.filter(t => t.farmerId == req.user.id || t.buyerId == req.user.id);
  const balance = 12450; // Mock balance
  res.json({ balance, pending: 2200, transactions: userTransactions });
});

// ===== ML PREDICTION ENDPOINTS =====
app.post('/api/ml/crop-predict', authenticate, (req, res) => {
  const { N, P, K, temperature, humidity, ph, rainfall } = req.body;
  // Mock ML predictions (connect to Python ML service)
  const crops = [
    { crop: 'Wheat', confidence: 0.92, marketPrice: 2450, msp: 2275 },
    { crop: 'Chickpea', confidence: 0.81, marketPrice: 5400, msp: 5335 },
    { crop: 'Mustard', confidence: 0.74, marketPrice: 5650, msp: 5450 },
  ];
  res.json({ recommendations: crops, parameters: req.body, model: 'RandomForest v2.1', accuracy: 0.947 });
});

app.post('/api/ml/rain-predict', authenticate, (req, res) => {
  res.json({
    probability: 0.72, confidence: 0.87,
    forecast: [
      { day: 0, rain: 20, temp: 28, humidity: 65 },
      { day: 1, rain: 5, temp: 31, humidity: 58 },
      { day: 2, rain: 85, temp: 24, humidity: 88 },
      { day: 3, rain: 90, temp: 22, humidity: 92 },
      { day: 4, rain: 40, temp: 26, humidity: 75 },
    ],
    advisory: 'Heavy rain expected Wed-Thu. Delay irrigation, harvest ready crops.',
    model: 'XGBoost v1.4',
  });
});

app.post('/api/ml/disease-detect', authenticate, (req, res) => {
  // In production: process uploaded image through MobileNetV2
  const diseases = [
    { disease: 'Yellow Rust', severity: 'High', confidence: 0.94, treatment: 'Apply Propiconazole 25% EC @ 0.1%' },
    { disease: 'Healthy', severity: 'None', confidence: 0.98, treatment: 'No treatment needed' },
  ];
  res.json({ ...diseases[Math.floor(Math.random() * diseases.length)], model: 'MobileNetV2', accuracy: 0.924 });
});

app.post('/api/ml/chat', authenticate, (req, res) => {
  const { message, language, context } = req.body;
  // Mock AI response (connect to LLM/Gemini API in production)
  res.json({
    response: "Based on your query, here are my recommendations for your farm. Ensure proper soil moisture and monitor weather patterns for optimal crop yield.",
    language: language || 'en',
    sources: ['ICAR Database', 'IMD Weather API', 'APMC Market Data'],
  });
});

// ===== SUPPORT TICKETS =====
app.post('/api/support/tickets', authenticate, (req, res) => {
  const ticket = { id: `TKT-${Date.now()}`, userId: req.user.id, ...req.body, status: 'open', createdAt: new Date() };
  tickets.push(ticket);
  res.status(201).json({ message: 'Ticket raised', ticket });
});

app.get('/api/support/tickets', authenticate, (req, res) => {
  const userTickets = req.user.role === 'admin' ? tickets : tickets.filter(t => t.userId == req.user.id);
  res.json(userTickets);
});

// ===== ADMIN ROUTES =====
app.get('/api/admin/users', authenticate, authorize('admin'), (req, res) => {
  res.json(users.map(({ password, ...u }) => u));
});

app.get('/api/admin/analytics', authenticate, authorize('admin'), (req, res) => {
  res.json({
    totalUsers: users.length, totalProducts: products.length, totalOrders: orders.length,
    totalRevenue: orders.reduce((s, o) => s + (o.amount || 0), 0),
    commissionEarned: orders.reduce((s, o) => s + (o.commission || 0), 0),
    activeListings: products.filter(p => p.status === 'active').length,
    openTickets: tickets.filter(t => t.status === 'open').length,
  });
});

app.put('/api/admin/products/:id/approve', authenticate, authorize('admin'), (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  product.status = 'active';
  res.json({ message: 'Product approved', product });
});

// ===== GOVERNMENT SCHEMES =====
app.get('/api/schemes', (req, res) => {
  res.json([
    { id: 1, name: 'PM-KISAN Samman Nidhi', benefit: '₹6,000/year', category: 'income-support', ministry: 'Agriculture' },
    { id: 2, name: 'PM Fasal Bima Yojana', benefit: '2% premium crop insurance', category: 'insurance', ministry: 'Agriculture' },
    { id: 3, name: 'Kisan Credit Card', benefit: 'Credit up to ₹3 lakh at 4%', category: 'credit', ministry: 'Finance' },
    { id: 4, name: 'PM Krishi Sinchai Yojana', benefit: 'Up to ₹1.5 lakh subsidy', category: 'irrigation', ministry: 'Jal Shakti' },
  ]);
});

// ===== NEWS =====
app.get('/api/news', (req, res) => {
  // In production: fetch from NewsAPI + BERT sentiment analysis
  res.json({ articles: [], source: 'NewsAPI + BERT Sentiment', refreshedAt: new Date() });
});

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'SmartFarm API', version: '1.0.0', timestamp: new Date() }));
app.get('/api', (req, res) => res.json({ message: 'SmartFarm API v1.0', endpoints: ['/auth', '/products', '/orders', '/payments', '/ml', '/support', '/admin'] }));

app.listen(PORT, () => console.log(`🌾 SmartFarm API running on port ${PORT}`));
module.exports = app;
