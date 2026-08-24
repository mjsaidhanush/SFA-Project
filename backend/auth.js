const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./User');

const router = express.Router();

// Approved Administrator Allowlist
const ADMIN_EMAILS = [
    'mjsaidhanush@gmail.com',
    'purush361@gmail.com'
];

// Helper to check if email is an authorized administrator
const isAdminEmail = (email) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret123', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone, location, farmSize, primaryCrop, displayName } = req.body;

        const userExists = await User.findOne({ email: email.trim().toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Determine role securely from admin allowlist
        const resolvedRole = isAdminEmail(email) ? 'Admin' : 'Farmer';

        const user = await User.create({
            name,
            displayName: displayName || (name ? name.split(' ')[0] : ''),
            email: email.trim().toLowerCase(),
            password,
            role: resolvedRole,
            phone: phone || '',
            location: location || '',
            farmSize: farmSize || '',
            primaryCrop: primaryCrop || '',
            lastLogin: new Date(),
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                displayName: user.displayName || user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.role === 'Admin',
                phone: user.phone,
                location: user.location,
                farmSize: user.farmSize,
                primaryCrop: user.primaryCrop,
                lastLogin: user.lastLogin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email ? email.trim().toLowerCase() : '';

        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await user.matchPassword(password))) {
            // Re-verify and sync admin role against current allowlist
            if (isAdminEmail(normalizedEmail) && user.role !== 'Admin') {
                user.role = 'Admin';
            }
            user.lastLogin = new Date();
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                displayName: user.displayName || user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.role === 'Admin',
                phone: user.phone || '',
                location: user.location || '',
                farmSize: user.farmSize || '',
                primaryCrop: user.primaryCrop || '',
                lastLogin: user.lastLogin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
    try {
        const { email, name, googleId } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const resolvedRole = isAdminEmail(normalizedEmail) ? 'Admin' : 'Farmer';

        let user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            user = await User.create({
                name: name || normalizedEmail.split('@')[0],
                displayName: name ? name.split(' ')[0] : normalizedEmail.split('@')[0],
                email: normalizedEmail,
                password: 'GOOGLE_OAUTH_' + (googleId || Math.random().toString(36)),
                role: resolvedRole,
                lastLogin: new Date(),
            });
        } else {
            if (isAdminEmail(normalizedEmail) && user.role !== 'Admin') {
                user.role = 'Admin';
            }
            user.lastLogin = new Date();
            await user.save();
        }

        res.json({
            _id: user._id,
            name: user.name,
            displayName: user.displayName || user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.role === 'Admin',
            phone: user.phone || '',
            location: user.location || '',
            farmSize: user.farmSize || '',
            primaryCrop: user.primaryCrop || '',
            lastLogin: user.lastLogin,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/me
// @access  Protected
router.get('/me', async (req, res) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isAdmin = isAdminEmail(user.email) || user.role === 'Admin';

        res.json({
            _id: user._id,
            name: user.name,
            displayName: user.displayName || user.name,
            email: user.email,
            role: isAdmin ? 'Admin' : 'Farmer',
            isAdmin,
            phone: user.phone,
            location: user.location,
            farmSize: user.farmSize,
            primaryCrop: user.primaryCrop,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});

module.exports = { router, ADMIN_EMAILS, isAdminEmail };

