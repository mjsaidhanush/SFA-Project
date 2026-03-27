const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Smart Farm Backend is running' });
});

// Mock routes based on requirements
app.use('/api/auth', require('./routes/auth'));

app.get('/api/marketplace/products', (req, res) => {
    res.json([{ id: 1, name: 'Tractor', price: 500000 }, { id: 2, name: 'Fertilizer', price: 1200 }]);
});

app.get('/api/govt-schemes', (req, res) => {
    res.json([{ id: 1, name: 'PM-KISAN', benefit: 'Rs. 6000/year' }]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
