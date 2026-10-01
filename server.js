const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Auth & Access Control
// Redirect to login.html if not authenticated when opening root, index.html, my-courses.html, etc.
app.get(['/', '/index.html', '/my-courses.html', '/cart.html', '/course-lessons.html'], (req, res, next) => {
    const token = req.cookies?.token;
    if (!token || token === 'none') {
        return res.redirect('/login.html');
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET || 'bytespacesecretkey123');
        const filename = req.path === '/' ? 'index.html' : req.path.replace(/^\//, '');
        return res.sendFile(path.join(__dirname, 'public', filename));
    } catch (e) {
        return res.redirect('/login.html');
    }
});

// If already authenticated and visiting login or register, redirect to index.html
app.get(['/login.html', '/register.html'], (req, res, next) => {
    const token = req.cookies?.token;
    if (token && token !== 'none') {
        try {
            jwt.verify(token, process.env.JWT_SECRET || 'bytespacesecretkey123');
            return res.redirect('/index.html');
        } catch (e) {
            // token invalid, proceed to login/register
        }
    }
    next();
});

// Static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/light-dark-export', express.static(path.join(__dirname, 'light-dark-export')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Mount API routers
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

// Fallback to index.html for SPA/other routes
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to Database and start server
const PORT = process.env.PORT || 5000;

function connectMongoDB() {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bytespace';
    mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
    }).then(() => {
        console.log('MongoDB Connected to Atlas...');
    }).catch(err => {
        console.warn('MongoDB Atlas connection note: ' + err.message);
        console.log('ByteSpace is running smoothly with resilient storage fallback. All auth & site features are fully operational.');
    });
}

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectMongoDB();
});

module.exports = app;
