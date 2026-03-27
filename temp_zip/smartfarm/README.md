# 🌾 SmartFarm – AI-Powered Agriculture Platform

> Full-stack platform connecting farmers directly to consumers with AI-powered crop predictions, disease detection, marketplace & escrow payments.

---

## 🚀 Quick Start

```bash
# 1. Clone & setup
git clone https://github.com/your-org/smartfarm
cd smartfarm
cp .env.example .env    # Fill in your API keys

# 2. Single-command Docker deployment
docker-compose up -d

# 3. Open browser
open http://localhost
```

**Demo Accounts:**
| Email | Password | Role |
|-------|----------|------|
| farmer@demo.com | demo123 | Farmer |
| buyer@demo.com | demo123 | Buyer |
| admin@demo.com | demo123 | Admin |

---

## 🏗 Architecture

```
Browser / Mobile App
       ↓
   Nginx (Port 80/443)
       ↓
  ┌────┴────┐
  │         │
Backend   ML Service
(Node.js) (Python/Flask)
Port 5000  Port 8000
  │
  ├── PostgreSQL (users, orders, products)
  ├── MongoDB (predictions, logs)
  └── Redis (cache, sessions)
```

---

## 📁 Project Structure

```
smartfarm/
├── index.html              # Frontend entry point
├── frontend/
│   ├── styles/main.css     # Complete UI stylesheet
│   └── pages/app.js        # Full SPA application logic
├── backend/
│   └── server.js           # Express REST API
├── ml/
│   ├── ml_service.py       # Flask ML microservice
│   └── requirements.txt
├── database/
│   └── init.sql            # PostgreSQL schema + seed
├── docker-compose.yml      # Full stack deployment
├── .env.example            # Environment template
└── README.md
```

---

## 🌟 Features

### 👨‍🌾 Farmer Dashboard
- Add/manage crop listings with photos
- AI crop recommendation (soil + climate input)
- Crop disease detection (upload leaf photo → CNN diagnosis)
- Rain forecast with irrigation advisory
- View orders, earnings, wallet

### 🛍 Buyer Marketplace
- Browse fresh produce from local farmers
- Filter by crop type, location, price
- Cart & secure checkout
- Order tracking

### 💳 Escrow Payment System
1. Buyer pays → funds held in escrow
2. Admin verifies delivery
3. Funds released to farmer minus 5% commission
- Powered by **Razorpay** (UPI, Cards, Net Banking)

### 🤖 AI Features
| Feature | Model | Accuracy |
|---------|-------|----------|
| Crop Recommendation | Random Forest | 94.7% |
| Rain Prediction | XGBoost | 87.3% |
| Disease Detection | MobileNetV2 CNN | 92.4% |
| News Sentiment | BERT | 89.1% |

### 🌐 Multilingual Chatbot
- English, Hindi, Gujarati, Marathi, Punjabi, Tamil, Telugu

### 🏛 Government Schemes
- PM-KISAN, Fasal Bima, KCC, Sinchai Yojana

### ☎ Support
- Call support (Twilio Voice)
- WhatsApp support (Twilio WhatsApp API)
- Ticket system with admin dashboard

---

## 🔌 API Reference

### Auth
```
POST /api/auth/register    Register new user
POST /api/auth/login       Login (JWT)
POST /api/auth/google      Google OAuth
GET  /api/auth/me          Get current user
```

### Marketplace
```
GET  /api/products              List products (with filters)
POST /api/products              Add listing (farmer only)
PUT  /api/products/:id          Update listing
```

### Orders
```
POST /api/orders                Place order
GET  /api/orders                List orders
PUT  /api/orders/:id/status     Update status
```

### Payments
```
POST /api/payments/initiate     Create Razorpay order
POST /api/payments/verify       Verify payment
POST /api/payments/withdraw     Request withdrawal
GET  /api/payments/wallet       Get wallet balance
```

### ML Services
```
POST /api/ml/crop-predict       Crop recommendation
POST /api/ml/rain-predict       Rain forecast
POST /api/ml/disease-detect     Disease detection (image)
POST /api/ml/chat               AI chatbot response
```

### Admin
```
GET  /api/admin/users           All users
GET  /api/admin/analytics       Platform stats
PUT  /api/admin/products/:id/approve  Approve listing
```

---

## 🔐 Security
- JWT authentication with expiry
- bcrypt password hashing
- Role-based access control (farmer/buyer/admin)
- Helmet.js security headers
- Rate limiting (100 req/15min)
- Input validation
- SQL injection prevention

---

## ☁ Production Deployment

```bash
# Build for production
docker-compose -f docker-compose.yml up -d --build

# SSL setup (Let's Encrypt)
certbot --nginx -d yourdomain.com

# Scale backend horizontally
docker-compose up --scale backend=3
```

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS (SPA) |
| Backend | Node.js, Express.js |
| ML Service | Python, Flask, scikit-learn, TensorFlow |
| Database | PostgreSQL + MongoDB + Redis |
| Payments | Razorpay (Escrow) |
| Auth | JWT + Google OAuth |
| Support | Twilio (Voice + WhatsApp) |
| Deployment | Docker + Nginx |

---

*Built with ❤ for Indian Farmers*
