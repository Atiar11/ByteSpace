const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userService = require('../services/userService');

// Generate JWT
const getSignedJwtToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'bytespacesecretkey123', {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// Send Token in cookie and JSON
const sendTokenResponse = (user, statusCode, res) => {
    const token = getSignedJwtToken(user._id || user.id);
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        path: '/'
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user: {
            id: user._id || user.id,
            name: user.name,
            email: user.email
        }
    });
};

// Strict RFC-compliant email verification
const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim();
    if (trimmed.length > 254 || trimmed.length < 5) return false;
    // Standard email structure: name@domain.tld
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(trimmed)) return false;
    if (trimmed.includes('..')) return false;
    const parts = trimmed.split('@');
    if (parts.length !== 2) return false;
    const [local, domain] = parts;
    if (!local || !domain || local.length > 64) return false;
    const domainParts = domain.split('.');
    if (domainParts.some(p => p.length === 0 || p.startsWith('-') || p.endsWith('-'))) return false;
    return true;
};

// @desc    Register user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, error: 'Please enter your full name' });
        }
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide a valid email address (e.g. user@example.com)' 
            });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                error: 'Password must be at least 6 characters long' 
            });
        }

        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: 'An account with this email address already exists. Please sign in instead.' 
            });
        }

        const user = await userService.createUser({ 
            name: name.trim(), 
            email: email.trim().toLowerCase(), 
            password 
        });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message || 'Registration failed' });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please enter a valid registered email address (e.g. user@example.com)' 
            });
        }
        if (!password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please enter your password' 
            });
        }

        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                error: 'No account found with this email. Only registered users can sign in. Please register first!' 
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                error: 'Incorrect password. Please verify your credentials and try again.' 
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message || 'Login failed' });
    }
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
router.get('/logout', (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
        path: '/'
    });
    res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        let token;
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token || token === 'none') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bytespacesecretkey123');
        const user = await userService.findUserById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id || user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(401).json({ success: false, error: 'Not authorized' });
    }
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
router.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, error: 'There is no user with that email' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        res.status(200).json({
            success: true,
            data: 'Password reset link sent (mocked)',
            resetToken
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
router.put('/resetpassword/:resettoken', async (req, res) => {
    try {
        const { password, email } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
        }

        if (email) {
            await userService.updatePassword(email, password);
            const user = await userService.findUserByEmail(email);
            if (user) {
                return sendTokenResponse(user, 200, res);
            }
        }

        res.status(200).json({ success: true, data: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Database / System status
// @route   GET /api/auth/status
router.get('/status', (req, res) => {
    res.json({
        success: true,
        database: {
            connected: userService.isMongoConnected(),
            provider: userService.isMongoConnected() ? 'MongoDB Atlas' : 'Local Fallback'
        }
    });
});

module.exports = router;
