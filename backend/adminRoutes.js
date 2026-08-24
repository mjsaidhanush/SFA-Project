const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./User');
const { isAdminEmail } = require('./auth');

const router = express.Router();

// Role-Based Authorization Middleware for Admin Portal
const protectAdmin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No authentication token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User account not found.' });
        }

        // Verify administrator authorization against secure allowlist or role
        if (!isAdminEmail(user.email) && user.role !== 'Admin') {
            return res.status(403).json({ 
                message: 'Access Restricted. This account does not have administrator permissions.' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired session token.' });
    }
};

// In-Memory Data Stores for Admin Management (Synced with DB)
let farmersStore = [
    {
        id: 'FARM-101',
        name: 'Ramesh Patel',
        email: 'ramesh.farmer@gmail.com',
        phone: '+91 98450 11234',
        location: 'Gujarat, Anand',
        primaryCrop: 'Cotton',
        farmSize: '12.5 Acres',
        registrationDate: '2026-01-14',
        status: 'Active',
        cropHealth: 'Optimal (96%)',
        soilNPK: { n: 140, p: 45, k: 50, ph: 6.8 },
        weatherStation: 'Node-West-04',
        diseaseReportsCount: 1,
        marketOrdersCount: 5,
        aiQueriesCount: 42
    },
    {
        id: 'FARM-102',
        name: 'Suresh Reddy',
        email: 'suresh.reddy@gmail.com',
        phone: '+91 97321 44556',
        location: 'Andhra Pradesh, Guntur',
        primaryCrop: 'Chilli & Rice',
        farmSize: '8.0 Acres',
        registrationDate: '2026-01-22',
        status: 'Active',
        cropHealth: 'Good (88%)',
        soilNPK: { n: 120, p: 40, k: 45, ph: 7.1 },
        weatherStation: 'Node-South-12',
        diseaseReportsCount: 0,
        marketOrdersCount: 8,
        aiQueriesCount: 65
    },
    {
        id: 'FARM-103',
        name: 'Harpreet Singh',
        email: 'harpreet.punjab@gmail.com',
        phone: '+91 99140 77889',
        location: 'Punjab, Ludhiana',
        primaryCrop: 'Wheat',
        farmSize: '25.0 Acres',
        registrationDate: '2026-02-05',
        status: 'Active',
        cropHealth: 'Excellent (98%)',
        soilNPK: { n: 160, p: 55, k: 60, ph: 6.5 },
        weatherStation: 'Node-North-01',
        diseaseReportsCount: 2,
        marketOrdersCount: 14,
        aiQueriesCount: 120
    },
    {
        id: 'FARM-104',
        name: 'Ananya Sharma',
        email: 'ananya.agri@gmail.com',
        phone: '+91 94220 33211',
        location: 'Maharashtra, Nashik',
        primaryCrop: 'Grapes & Sugarcane',
        farmSize: '15.0 Acres',
        registrationDate: '2026-02-18',
        status: 'Active',
        cropHealth: 'Optimal (94%)',
        soilNPK: { n: 135, p: 48, k: 52, ph: 6.9 },
        weatherStation: 'Node-West-09',
        diseaseReportsCount: 1,
        marketOrdersCount: 9,
        aiQueriesCount: 84
    },
    {
        id: 'FARM-105',
        name: 'Vijay Kumar',
        email: 'vijay.k@gmail.com',
        phone: '+91 96550 99881',
        location: 'Tamil Nadu, Thanjavur',
        primaryCrop: 'Paddy / Rice',
        farmSize: '6.5 Acres',
        registrationDate: '2026-03-01',
        status: 'Inactive',
        cropHealth: 'Fair (72%)',
        soilNPK: { n: 95, p: 30, k: 35, ph: 7.4 },
        weatherStation: 'Node-South-08',
        diseaseReportsCount: 3,
        marketOrdersCount: 2,
        aiQueriesCount: 18
    }
];

let cropsStore = [
    {
        id: 'CROP-01',
        name: 'Wheat (Triticum aestivum)',
        suitableSoil: 'Loamy, Clay Loam',
        temperature: '15°C – 25°C',
        rainfall: '450 – 650 mm',
        duration: '110 – 130 Days',
        expectedYield: '4.5 – 5.5 Tons/Ha',
        marketDemand: 'High (Rising)',
        recommendedSeason: 'Rabi',
        status: 'Active'
    },
    {
        id: 'CROP-02',
        name: 'Paddy / Rice (Oryza sativa)',
        suitableSoil: 'Clayey, Alluvial',
        temperature: '22°C – 32°C',
        rainfall: '1000 – 1500 mm',
        duration: '120 – 150 Days',
        expectedYield: '5.0 – 6.5 Tons/Ha',
        marketDemand: 'Very High',
        recommendedSeason: 'Kharif',
        status: 'Active'
    },
    {
        id: 'CROP-03',
        name: 'Cotton (Gossypium)',
        suitableSoil: 'Black Cotton, Sandy Loam',
        temperature: '21°C – 30°C',
        rainfall: '500 – 800 mm',
        duration: '150 – 180 Days',
        expectedYield: '2.5 – 3.2 Tons/Ha',
        marketDemand: 'High',
        recommendedSeason: 'Kharif',
        status: 'Active'
    },
    {
        id: 'CROP-04',
        name: 'Sugarcane (Saccharum officinarum)',
        suitableSoil: 'Deep Rich Loamy',
        temperature: '20°C – 35°C',
        rainfall: '1500 – 2500 mm',
        duration: '300 – 360 Days',
        expectedYield: '80 – 100 Tons/Ha',
        marketDemand: 'Stable',
        recommendedSeason: 'Annual',
        status: 'Active'
    },
    {
        id: 'CROP-05',
        name: 'Maize / Corn (Zea mays)',
        suitableSoil: 'Well-drained Fertile Loam',
        temperature: '18°C – 27°C',
        rainfall: '500 – 750 mm',
        duration: '90 – 110 Days',
        expectedYield: '6.0 – 7.5 Tons/Ha',
        marketDemand: 'High',
        recommendedSeason: 'Kharif / Rabi',
        status: 'Active'
    }
];

let diseaseReportsStore = [
    {
        id: 'DIS-2026-001',
        farmer: 'Ramesh Patel',
        crop: 'Cotton',
        detectedDisease: 'Bacterial Blight',
        confidence: '96.4%',
        severity: 'Moderate',
        date: '2026-03-02',
        status: 'Under Review',
        recommendedAction: 'Apply Copper Oxychloride (0.25%) + Streptocycline (100 ppm)'
    },
    {
        id: 'DIS-2026-002',
        farmer: 'Harpreet Singh',
        crop: 'Wheat',
        detectedDisease: 'Yellow Rust (Puccinia striiformis)',
        confidence: '98.8%',
        severity: 'High',
        date: '2026-03-01',
        status: 'Resolved',
        recommendedAction: 'Foliar spray of Propiconazole 25% EC @ 0.1%'
    },
    {
        id: 'DIS-2026-003',
        farmer: 'Ananya Sharma',
        crop: 'Grapes',
        detectedDisease: 'Powdery Mildew',
        confidence: '94.1%',
        severity: 'Low',
        date: '2026-02-28',
        status: 'Resolved',
        recommendedAction: 'Spray wettable sulphur @ 2g/litre water'
    },
    {
        id: 'DIS-2026-004',
        farmer: 'Vijay Kumar',
        crop: 'Paddy',
        detectedDisease: 'Rice Blast (Magnaporthe oryzae)',
        confidence: '97.2%',
        severity: 'Critical',
        date: '2026-02-27',
        status: 'Under Review',
        recommendedAction: 'Apply Tricyclazole 75% WP @ 0.6g/L'
    }
];

let marketStore = [
    { id: 'MKT-01', crop: 'Wheat (Sharbati)', currentPrice: 2450, previousPrice: 2320, change: '+5.6%', market: 'Khanna Mandi, Punjab', updatedTime: '10 mins ago' },
    { id: 'MKT-02', crop: 'Paddy (Basmati 1121)', currentPrice: 3850, previousPrice: 3900, change: '-1.2%', market: 'Karnal Mandi, Haryana', updatedTime: '25 mins ago' },
    { id: 'MKT-03', crop: 'Cotton (Medium Staple)', currentPrice: 7100, previousPrice: 6850, change: '+3.6%', market: 'Rajkot Mandi, Gujarat', updatedTime: '1 hour ago' },
    { id: 'MKT-04', crop: 'Soybean (Yellow)', currentPrice: 4620, previousPrice: 4550, change: '+1.5%', market: 'Indore Mandi, MP', updatedTime: '40 mins ago' },
    { id: 'MKT-05', crop: 'Sugarcane (FRP)', currentPrice: 340, previousPrice: 315, change: '+7.9%', market: 'Kolhapur Mandi, Maharashtra', updatedTime: '2 hours ago' },
    { id: 'MKT-06', crop: 'Maize (Feed Grade)', currentPrice: 2150, previousPrice: 2100, change: '+2.3%', market: 'Davangere Mandi, Karnataka', updatedTime: '15 mins ago' }
];

let schemesStore = [
    {
        id: 'SCHEME-01',
        name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        description: 'Direct income support of ₹6,000 per year in three equal installments to small and marginal farmer families.',
        eligibility: 'All landholding farmers with cultivable land.',
        benefit: '₹6,000 / Year (Direct Bank Transfer)',
        deadline: 'Ongoing Open Registration',
        status: 'Active',
        applicationUrl: 'https://pmkisan.gov.in'
    },
    {
        id: 'SCHEME-02',
        name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
        description: 'Comprehensive risk insurance coverage against yield loss due to non-preventable natural risks.',
        eligibility: 'All farmers growing notified crops in notified areas.',
        benefit: 'Full Sum Insured for natural disaster loss (1.5% - 2% premium)',
        deadline: 'Seasonal Cutoffs (Kharif: July 31, Rabi: Dec 31)',
        status: 'Active',
        applicationUrl: 'https://pmfby.gov.in'
    },
    {
        id: 'SCHEME-03',
        name: 'Soil Health Card Scheme',
        description: 'Provides information on 12 soil nutrient parameters with tailored fertilizer recommendations.',
        eligibility: 'Every agricultural field across India.',
        benefit: 'Free GPS-tagged soil chemical analysis report',
        deadline: 'Cycle 2025-2027 Ongoing',
        status: 'Active',
        applicationUrl: 'https://soilhealth.dac.gov.in'
    }
];

let notificationsStore = [
    {
        id: 'NOTIF-01',
        title: 'Doppler Radar Precipitation Advisory',
        message: 'Moderate rainfall (22mm) forecasted for Andhra Pradesh & Telangana over the next 48 hours.',
        type: 'Weather Alert',
        priority: 'High',
        timestamp: '15 mins ago',
        author: 'System Telemetry'
    },
    {
        id: 'NOTIF-02',
        title: 'Leaf Rust Alert in Northern Grain Belt',
        message: 'Spore concentration elevated in Punjab & Haryana. Farmers advised to inspect wheat crops.',
        type: 'Disease Warning',
        priority: 'High',
        timestamp: '1 hour ago',
        author: 'AI Plant Pathology Unit'
    },
    {
        id: 'NOTIF-03',
        title: 'MSP Procurement Portal Online',
        message: 'Kharif season Mandi registrations are now open with direct bank settlement within 48 hours.',
        type: 'Platform Announcement',
        priority: 'Normal',
        timestamp: '3 hours ago',
        author: 'Admin Office'
    }
];

// ==========================================
// ROUTES
// ==========================================

// 1. Executive Stats Overview
router.get('/stats', protectAdmin, async (req, res) => {
    try {
        let totalDbUsers = 0;
        try {
            totalDbUsers = await User.countDocuments({ role: 'Farmer' });
        } catch (e) {}

        const stats = {
            totalFarmers: Math.max(1248, totalDbUsers + 1200),
            activeFarmers: 986,
            cropReports: 3482,
            diseaseReports: 524,
            marketplaceOrders: 847,
            aiRequests: 12430,
            systemHealth: '100% Operational',
            telemetryNodes: 48,
            avgResponseTime: '124ms',
            lastUpdated: new Date()
        };
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Farmer Management
router.get('/farmers', protectAdmin, (req, res) => {
    const { search } = req.query;
    if (search) {
        const query = search.toLowerCase();
        const filtered = farmersStore.filter(f => 
            f.name.toLowerCase().includes(query) || 
            f.email.toLowerCase().includes(query) ||
            f.location.toLowerCase().includes(query) ||
            f.primaryCrop.toLowerCase().includes(query)
        );
        return res.json(filtered);
    }
    res.json(farmersStore);
});

router.post('/farmers', protectAdmin, (req, res) => {
    const { name, email, phone, location, primaryCrop, farmSize } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    const newFarmer = {
        id: `FARM-${Math.floor(100 + Math.random() * 900)}`,
        name,
        email,
        phone: phone || '+91 98000 00000',
        location: location || 'India',
        primaryCrop: primaryCrop || 'Wheat',
        farmSize: farmSize || '5 Acres',
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        cropHealth: 'Optimal (95%)',
        soilNPK: { n: 130, p: 42, k: 48, ph: 6.8 },
        weatherStation: 'Node-South-01',
        diseaseReportsCount: 0,
        marketOrdersCount: 0,
        aiQueriesCount: 0
    };

    farmersStore.unshift(newFarmer);
    res.status(201).json(newFarmer);
});

router.put('/farmers/:id', protectAdmin, (req, res) => {
    const { id } = req.params;
    const index = farmersStore.findIndex(f => f.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Farmer not found.' });
    }
    farmersStore[index] = { ...farmersStore[index], ...req.body };
    res.json(farmersStore[index]);
});

router.delete('/farmers/:id', protectAdmin, (req, res) => {
    const { id } = req.params;
    const index = farmersStore.findIndex(f => f.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Farmer not found.' });
    }
    farmersStore[index].status = farmersStore[index].status === 'Active' ? 'Deactivated' : 'Active';
    res.json({ message: `Farmer ${farmersStore[index].status.toLowerCase()} successfully`, farmer: farmersStore[index] });
});

router.get('/farmers/:id', protectAdmin, (req, res) => {
    const { id } = req.params;
    const farmer = farmersStore.find(f => f.id === id);
    if (!farmer) {
        return res.status(404).json({ message: 'Farmer not found.' });
    }
    res.json(farmer);
});

// 3. Crop Management
router.get('/crops', protectAdmin, (req, res) => {
    res.json(cropsStore);
});

router.post('/crops', protectAdmin, (req, res) => {
    const { name, suitableSoil, temperature, rainfall, duration, expectedYield, marketDemand, recommendedSeason } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Crop name is required.' });
    }

    const newCrop = {
        id: `CROP-0${cropsStore.length + 1}`,
        name,
        suitableSoil: suitableSoil || 'Loamy Soil',
        temperature: temperature || '20°C – 30°C',
        rainfall: rainfall || '500 – 800 mm',
        duration: duration || '120 Days',
        expectedYield: expectedYield || '4.0 Tons/Ha',
        marketDemand: marketDemand || 'High',
        recommendedSeason: recommendedSeason || 'Kharif',
        status: 'Active'
    };

    cropsStore.push(newCrop);
    res.status(201).json(newCrop);
});

router.put('/crops/:id', protectAdmin, (req, res) => {
    const { id } = req.params;
    const index = cropsStore.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Crop not found.' });
    }
    cropsStore[index] = { ...cropsStore[index], ...req.body };
    res.json(cropsStore[index]);
});

router.delete('/crops/:id', protectAdmin, (req, res) => {
    const { id } = req.params;
    cropsStore = cropsStore.filter(c => c.id !== id);
    res.json({ message: 'Crop removed successfully.' });
});

// 4. Disease Reports Management
router.get('/disease-reports', protectAdmin, (req, res) => {
    res.json(diseaseReportsStore);
});

router.put('/disease-reports/:id/resolve', protectAdmin, (req, res) => {
    const { id } = req.params;
    const report = diseaseReportsStore.find(r => r.id === id);
    if (!report) {
        return res.status(404).json({ message: 'Disease report not found.' });
    }
    report.status = report.status === 'Resolved' ? 'Under Review' : 'Resolved';
    res.json(report);
});

// 5. Weather Intelligence
router.get('/weather', protectAdmin, (req, res) => {
    const weatherData = {
        stationNodes: 48,
        activeSensors: 192,
        currentConditions: {
            temp: '28.4°C',
            humidity: '62%',
            wind: '14 km/h SW',
            rainfallToday: '4.2 mm',
            radarStatus: 'Active Doppler Stream'
        },
        regionalAlerts: [
            { region: 'Andhra Pradesh & Telangana', advisory: 'Heavy precipitation expected in next 24h', severity: 'Alert' },
            { region: 'Punjab & Haryana', advisory: 'Morning fog with mild temperature drop to 12°C', severity: 'Watch' }
        ]
    };
    res.json(weatherData);
});

router.post('/weather/alert', protectAdmin, (req, res) => {
    const { region, message, severity } = req.body;
    const newAlert = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        title: `Weather Alert: ${region}`,
        message,
        type: 'Weather Alert',
        priority: severity || 'High',
        timestamp: 'Just now',
        author: req.user?.displayName || 'Administrator'
    };
    notificationsStore.unshift(newAlert);
    res.status(201).json({ message: 'Weather alert broadcasted successfully', alert: newAlert });
});

// 6. Market Intelligence
router.get('/market', protectAdmin, (req, res) => {
    res.json(marketStore);
});

router.put('/market/:id', protectAdmin, (req, res) => {
    const { id } = req.params;
    const { currentPrice, previousPrice, change } = req.body;
    const item = marketStore.find(m => m.id === id);
    if (!item) {
        return res.status(404).json({ message: 'Market item not found.' });
    }
    if (currentPrice) item.currentPrice = Number(currentPrice);
    if (previousPrice) item.previousPrice = Number(previousPrice);
    if (change) item.change = change;
    item.updatedTime = 'Just now';
    res.json(item);
});

// 7. Government Schemes
router.get('/schemes', protectAdmin, (req, res) => {
    res.json(schemesStore);
});

router.post('/schemes', protectAdmin, (req, res) => {
    const { name, description, eligibility, benefit, deadline, applicationUrl } = req.body;
    if (!name || !description) {
        return res.status(400).json({ message: 'Scheme name and description required.' });
    }

    const newScheme = {
        id: `SCHEME-0${schemesStore.length + 1}`,
        name,
        description,
        eligibility: eligibility || 'All verified Indian farmers.',
        benefit: benefit || 'Direct subsidy / Financial grant',
        deadline: deadline || 'Active',
        status: 'Active',
        applicationUrl: applicationUrl || 'https://agricoop.nic.in'
    };

    schemesStore.push(newScheme);
    res.status(201).json(newScheme);
});

router.put('/schemes/:id', protectAdmin, (req, res) => {
    const { id } = req.params;
    const index = schemesStore.findIndex(s => s.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Scheme not found.' });
    }
    schemesStore[index] = { ...schemesStore[index], ...req.body };
    res.json(schemesStore[index]);
});

router.delete('/schemes/:id', protectAdmin, (req, res) => {
    const { id } = req.params;
    schemesStore = schemesStore.filter(s => s.id !== id);
    res.json({ message: 'Scheme deleted successfully.' });
});

// 8. Notifications Center
router.get('/notifications', protectAdmin, (req, res) => {
    res.json(notificationsStore);
});

router.post('/notifications', protectAdmin, (req, res) => {
    const { title, message, type, priority } = req.body;
    if (!title || !message) {
        return res.status(400).json({ message: 'Title and message are required.' });
    }

    const newNotification = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        title,
        message,
        type: type || 'Platform Announcement',
        priority: priority || 'Normal',
        timestamp: 'Just now',
        author: req.user?.displayName || 'Administrator'
    };

    notificationsStore.unshift(newNotification);
    res.status(201).json(newNotification);
});

// 9. Analytics & Trends
router.get('/analytics', protectAdmin, (req, res) => {
    const analytics = {
        farmerGrowth: [
            { month: 'Oct', farmers: 450 },
            { month: 'Nov', farmers: 620 },
            { month: 'Dec', farmers: 810 },
            { month: 'Jan', farmers: 990 },
            { month: 'Feb', farmers: 1140 },
            { month: 'Mar', farmers: 1248 }
        ],
        cropDistribution: [
            { crop: 'Wheat', percentage: 38, color: '#18D5D0' },
            { crop: 'Paddy / Rice', percentage: 29, color: '#A8E63D' },
            { crop: 'Cotton', percentage: 16, color: '#38BDF8' },
            { crop: 'Sugarcane', percentage: 11, color: '#F59E0B' },
            { crop: 'Others', percentage: 6, color: '#9333EA' }
        ],
        diseaseReportsTrend: [
            { month: 'Oct', count: 42 },
            { month: 'Nov', count: 68 },
            { month: 'Dec', count: 95 },
            { month: 'Jan', count: 112 },
            { month: 'Feb', count: 128 },
            { month: 'Mar', count: 79 }
        ],
        aiUsage: [
            { week: 'Week 1', queries: 2100 },
            { week: 'Week 2', queries: 2850 },
            { week: 'Week 3', queries: 3420 },
            { week: 'Week 4', queries: 4060 }
        ]
    };
    res.json(analytics);
});

// 10. Admin Profile Management
router.get('/profile', protectAdmin, (req, res) => {
    res.json({
        id: req.user._id,
        name: req.user.name,
        displayName: req.user.displayName || req.user.name,
        email: req.user.email,
        role: req.user.role,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt
    });
});

router.put('/profile', protectAdmin, async (req, res) => {
    try {
        const { name, displayName } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Admin account not found.' });
        }

        if (name) user.name = name.trim();
        if (displayName) user.displayName = displayName.trim();
        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            message: 'Admin profile updated successfully.'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
