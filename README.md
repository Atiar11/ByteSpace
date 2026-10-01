# ByteSpace - Online Learning & Course Platform

ByteSpace is a modern, full-featured online learning management platform designed with responsive web design, interactive course navigation, user authentication, creator profiles, search & filter capabilities, and shopping cart functionality.

## ✨ Features

- **Authentication & Security:** User registration, login with JWT cookies, password hashing with bcrypt, session persistence, and protected routes.
- **Course Discovery & Filters:** Search courses by keywords, filter by category (Design, Development, Business, Data Science, etc.), difficulty levels, and price.
- **Rich Course Detail Pages:** Comprehensive course overview, curriculum accordions, instructor bios, student reviews, and interactive enrollment.
- **Course Lessons & Video Player:** Interactive lecture curriculum with video player, lecture notes, downloadable resources, and progress tracking.
- **Creator Profiles:** Dedicated instructor profile pages highlighting bio, stats, published courses, and creator badges.
- **Cart & Checkout Experience:** Dynamic cart management with real-time total calculations and checkout handling.
- **Responsive & Modern UI:** Crafted with dark/light themes, sleek glassmorphism, micro-animations, and fluid responsive typography.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB / Mongoose (with resilient fallback storage)
- **Frontend:** Vanilla HTML5, CSS3 (Custom Design System & Modern CSS Variables), Vanilla JavaScript (ES6+)
- **Security & Utilities:** JSON Web Tokens (JWT), bcryptjs, cookie-parser, dotenv

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Atiar11/ByteSpace.git
cd ByteSpace
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_jwt_key
JWT_EXPIRE=30d
```

### 4. Run the application
```bash
npm start
# or
node server.js
```
The server will start at `http://localhost:5000`.

## 📂 Project Structure
```
ByteSpace/
├── public/                 # Client-side web pages & static assets
│   ├── index.html          # Main homepage
│   ├── login.html          # Sign-in page
│   ├── register.html       # Sign-up page
│   ├── course-detail.html  # Course details & syllabus
│   ├── course-lessons.html # Video lessons player
│   ├── creator.html        # Instructor profile
│   ├── cart.html           # Shopping cart
│   ├── styles.css          # Design system & styles
│   └── app.js              # Frontend logic & interactions
├── routes/                 # Express API routes
│   ├── auth.js             # Auth endpoints
│   └── courses.js          # Course data endpoints
├── models/                 # Mongoose database models
├── services/               # User & data services
├── server.js               # Express application entrypoint
└── package.json            # Project dependencies & scripts
```

## 📄 License
ISC
