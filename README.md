# 🌾🤖 Smart Farm Assistant (SFA)

[**Live Demo**](#) | [**API Documentation**](/architecture_and_api.md) | [**Guidelines Report**](./Project_Guidelines_Report.md)

Welcome to the **Smart Farm Assistant**, a feature-rich, scalable, AI-powered agricultural intellect platform natively bringing intelligence to farmers across India. SFA is a microservices-based full-stack solution empowering user growth through technological advancements like **Marketplace Ecommerce**, **Weather & Rain Predicition**, **Crop Suitability Analysis**, and **Govt Scheme** distributions.

## ✨ Key Features
- 🌤 **Live Rain Forecast & Weather Tracking:** Uses advanced machine learning Python frameworks, utilizing Random Forest & external forecast APIs, mapped uniquely to localized cities and states for precise rainfall confidence scoring.
- 🌱 **AI Crop Recommendation Engine:** Given live soil factors (N, P, K, pH) and weather observation parameters, recommends optimal crop variants using Pickled ML models (`FastAPI / Flask`).
- 🏬 **Smart Farm Marketplace (E-Commerce):** A dynamic interface for land leasing, equipment purchasing, crop selling, and worker hiring. Secure JWT-based backend gateways manage data logic seamlessly.
- 🎓 **Role-Based Auth & Access Control:** Farmer, Buyer/Vendor, User, and Super Admin functionalities allowing tailored modular control of resources internally.
- 💬 **Government Schemes Discovery:** Displays relevant PM-KISAN & related benefits logic.

## 🏗 System Architecture & Technologies
This platform handles traffic using decoupled, scalable pipelines:

**Frontend (Client)**
- React 18 / Next.js
- Tailwind CSS / ShadCN UI / Framer Motion
- State Management (Redux Toolkit / Context API)

**Backend (API Server)**
- Node.js & Express.js (Runs heavily on `:8080` & `:5000` context paths)
- JWT Authentication / Stripe & Razorpay (Placeholder/Implementations)
- RESTful Microservices routing

**AI/ML Services Microservice**
- Python 3.x / Scikit-Learn / FastAPI or Flask
- Pickle Models (`.pkl` imports like `model.pkl`, `rain_model.pkl`)
- Real-time endpoints tracking location dimensions (`location_dimension.csv`)

**Databases & Memory**
- PostgreSQL (Primary Source of truth) / MongoDB (Chat Logs and RAG architecture)
- Docker & Docker Compose configuration out of the box.

## 🚀 Getting Started & Local Setup

### ⚙ Prerequisites
- NodeJS (v18+)
- Python (v3.9+)
- Docker & Docker Compose (Optional for full-container workflows)

### 💻 Fast Native Windows Startup
If running on Windows locally, SFA ships with an auto-startup CLI script initializing the Front-end app, Express API gateway, and Python ML uvicorn services seamlessly.
Simply run the following enclosed `.bat` file:
```bash
# In the repository root:
.\Start_Smart_Farm.bat
```
*(This triggers Node APIs, activates Python virtual environments `.venv`, and starts `npm run dev` sequentially in pop-up CMD windows).*

### 🐳 Running via Docker (Full Cluster)
To deploy all integrated scalable components (Express, Python Services, PostgreSQL, MongoDB, Redis, and NextJS UI):
```bash
docker-compose up --build -d
```
## 🔌 Standardized Ports
Ensure you have the proper `.env` configuration for ports:
- **Next.js Web Client UI:** `http://localhost:3000` (or `3001` depending on start params)
- **Node.js Gateway:** `http://localhost:8080` or `http://localhost:5000`
- **Python ML Inference Server:** `http://localhost:8000`

## 🧠 Model Integrations Explained
All Models operate natively offline or via third-party hooks utilizing pre-built datasets (`weather_observations.csv`, `location_encoder.pkl`).
- **Endpoint `POST /api/crop/predict`**: Accepts soil payload JSON -> Responses dynamically generated optimal crop label.
- **Endpoint `GET /api/rain/predict?location={city}`**: ML logic parses state/district bounds predicting a Boolean / probability for sunny or stormy results.

## 🤝 Contribution Details
Please review our [`Project_Guidelines_Report.md`](./Project_Guidelines_Report.md) natively stored or exported as an artifact within our tracking modules. Ensure branch management (`main`, `dev`, `feature/*`) is utilized correctly with structured semantic commits.

---

> *"Empowering the Agricultural economy, one byte at a time."*
