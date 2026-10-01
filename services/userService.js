const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

// Ensure data file exists with default user
function initLocalStore() {
    if (!fs.existsSync(DATA_FILE)) {
        const defaultHashedPassword = bcrypt.hashSync('password123', 10);
        const initialUsers = [
            {
                id: '1',
                _id: '1',
                name: 'Jamie Davis',
                email: 'designer@example.com',
                password: defaultHashedPassword,
                createdAt: new Date().toISOString()
            }
        ];
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialUsers, null, 2));
    }
}

initLocalStore();

function readLocalUsers() {
    try {
        initLocalStore();
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading local users file:', err.message);
        return [];
    }
}

function writeLocalUsers(users) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error writing local users file:', err.message);
    }
}

// Check if MongoDB is connected and ready
function isMongoConnected() {
    return mongoose.connection && mongoose.connection.readyState === 1;
}

// Create User
async function createUser({ name, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    // If MongoDB is connected, use Mongoose
    if (isMongoConnected()) {
        try {
            const user = await User.create({ name, email: normalizedEmail, password });
            // Also mirror to local storage
            const localUsers = readLocalUsers();
            if (!localUsers.some(u => u.email === normalizedEmail)) {
                localUsers.push({
                    id: user._id.toString(),
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    createdAt: user.createdAt
                });
                writeLocalUsers(localUsers);
            }
            return user;
        } catch (err) {
            if (err.name === 'ValidationError' || err.code === 11000) {
                throw err;
            }
            console.warn('MongoDB create failed, falling back to local store:', err.message);
        }
    }

    // Local fallback
    const localUsers = readLocalUsers();
    if (localUsers.some(u => u.email === normalizedEmail)) {
        throw new Error('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now().toString(),
        _id: Date.now().toString(),
        name,
        email: normalizedEmail,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };

    localUsers.push(newUser);
    writeLocalUsers(localUsers);

    return {
        _id: newUser.id,
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        matchPassword: async (pwd) => bcrypt.compare(pwd, newUser.password)
    };
}

// Find User by Email
async function findUserByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
        try {
            const user = await User.findOne({ email: normalizedEmail }).select('+password');
            if (user) return user;
        } catch (err) {
            console.warn('MongoDB find failed, falling back to local store:', err.message);
        }
    }

    // Local fallback
    const localUsers = readLocalUsers();
    const localUser = localUsers.find(u => u.email === normalizedEmail);
    if (!localUser) return null;

    return {
        _id: localUser.id || localUser._id,
        id: localUser.id || localUser._id,
        name: localUser.name,
        email: localUser.email,
        password: localUser.password,
        matchPassword: async (pwd) => bcrypt.compare(pwd, localUser.password)
    };
}

// Find User by ID
async function findUserById(id) {
    if (isMongoConnected()) {
        try {
            const user = await User.findById(id);
            if (user) return user;
        } catch (err) {
            console.warn('MongoDB findById failed, falling back to local store:', err.message);
        }
    }

    const localUsers = readLocalUsers();
    const localUser = localUsers.find(u => u.id === id || u._id === id);
    if (!localUser) return null;

    return {
        _id: localUser.id || localUser._id,
        id: localUser.id || localUser._id,
        name: localUser.name,
        email: localUser.email,
        createdAt: localUser.createdAt
    };
}

// Update password
async function updatePassword(userIdOrEmail, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (isMongoConnected()) {
        try {
            const user = await User.findById(userIdOrEmail) || await User.findOne({ email: userIdOrEmail });
            if (user) {
                user.password = newPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save();
            }
        } catch (err) {
            console.warn('MongoDB updatePassword error:', err.message);
        }
    }

    const localUsers = readLocalUsers();
    const idx = localUsers.findIndex(u => u.id === userIdOrEmail || u._id === userIdOrEmail || u.email === userIdOrEmail);
    if (idx !== -1) {
        localUsers[idx].password = hashedPassword;
        localUsers[idx].resetPasswordToken = undefined;
        localUsers[idx].resetPasswordExpire = undefined;
        writeLocalUsers(localUsers);
    }
}

// Get Enrolled Courses
async function getEnrolledCourses(userId) {
    if (isMongoConnected()) {
        try {
            const user = await User.findById(userId);
            if (user && user.enrolledCourses) {
                return user.enrolledCourses;
            }
        } catch (err) {
            console.warn('MongoDB getEnrolledCourses failed, checking local:', err.message);
        }
    }

    const localUsers = readLocalUsers();
    const localUser = localUsers.find(u => u.id === userId || u._id === userId);
    return (localUser && localUser.enrolledCourses) ? localUser.enrolledCourses : [];
}

// Enroll courses (after checkout)
async function enrollCourses(userId, courseItems) {
    const coursesToAdd = courseItems.map(item => ({
        courseId: item.courseId || item.id,
        courseTitle: item.courseTitle || item.title,
        author: item.author || 'purepearl studio',
        image: item.image || '/figma-images/course_1_wireframe.jpg',
        price: Number(item.price) || 25,
        progress: item.progress || 0,
        completedLessons: [],
        enrolledAt: new Date().toISOString()
    }));

    if (isMongoConnected()) {
        try {
            const user = await User.findById(userId);
            if (user) {
                user.enrolledCourses = user.enrolledCourses || [];
                coursesToAdd.forEach(newC => {
                    if (!user.enrolledCourses.some(c => c.courseId === newC.courseId)) {
                        user.enrolledCourses.push(newC);
                    }
                });
                await user.save();
            }
        } catch (err) {
            console.warn('MongoDB enrollCourses error:', err.message);
        }
    }

    const localUsers = readLocalUsers();
    const idx = localUsers.findIndex(u => u.id === userId || u._id === userId);
    if (idx !== -1) {
        localUsers[idx].enrolledCourses = localUsers[idx].enrolledCourses || [];
        coursesToAdd.forEach(newC => {
            if (!localUsers[idx].enrolledCourses.some(c => c.courseId === newC.courseId)) {
                localUsers[idx].enrolledCourses.push(newC);
            }
        });
        writeLocalUsers(localUsers);
        return localUsers[idx].enrolledCourses;
    }

    return coursesToAdd;
}

// Update course progress
async function updateCourseProgress(userId, courseId, progress, lessonNumber) {
    if (isMongoConnected()) {
        try {
            const user = await User.findById(userId);
            if (user && user.enrolledCourses) {
                const c = user.enrolledCourses.find(c => c.courseId === courseId);
                if (c) {
                    if (progress !== undefined) c.progress = progress;
                    c.completedLessons = c.completedLessons || [];
                    if (lessonNumber && !c.completedLessons.includes(lessonNumber)) {
                        c.completedLessons.push(lessonNumber);
                    }
                    await user.save();
                }
            }
        } catch (err) {
            console.warn('MongoDB updateCourseProgress error:', err.message);
        }
    }

    const localUsers = readLocalUsers();
    const idx = localUsers.findIndex(u => u.id === userId || u._id === userId);
    if (idx !== -1 && localUsers[idx].enrolledCourses) {
        const c = localUsers[idx].enrolledCourses.find(c => c.courseId === courseId);
        if (c) {
            if (progress !== undefined) c.progress = progress;
            c.completedLessons = c.completedLessons || [];
            if (lessonNumber && !c.completedLessons.includes(lessonNumber)) {
                c.completedLessons.push(lessonNumber);
            }
            writeLocalUsers(localUsers);
            return c;
        }
    }
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updatePassword,
    getEnrolledCourses,
    enrollCourses,
    updateCourseProgress,
    isMongoConnected
};
