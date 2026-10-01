# ByteSpace — Online Learning & Course Platform

ByteSpace is a modern, responsive online learning and course platform built with high-fidelity UI design, course discovery, interactive lessons, user authentication, and shopping cart checkout.

---

## 📋 Submission Overview

### 1. What was built / completed

- **Home Page (`index.html`)**:
  - Hero section with search bar and decorative 3D vector graphics.
  - Partner logos and social proof badges.
  - Dynamic **Your Courses** section (displays active enrolled courses with progress bars when courses are owned, or recommended courses catalog when none have been bought yet).
  - Featured course categories with interactive category filter tabs.
  - Course cards with ratings, instructor information, lesson counts, duration, and pricing.
  - Top creator spotlight card and community testimonials.
  - Footer with newsletter subscription and navigation columns.

- **Course Catalog & Search (`search.html`)**:
  - Live keyword search across course titles, topics, and authors.
  - Category filtering (Design, Development, Business, IT, etc.).
  - Course cards with direct links to details and cart.

- **Course Detail Page (`course-detail.html`)**:
  - Complete course overview, syllabus, duration, and difficulty level.
  - Interactive tabs switching between Course Overview ("About") and Verified Student Reviews.
  - Sneak peek 4-image preview grid.
  - Key learning outcomes checklist.
  - Instructor profile badge and direct enrollment / "Add to Cart" actions.

- **Course Lessons Player (`course-lessons.html`)**:
  - Active lesson player interface with structured module curriculum.
  - Interactive lesson syllabus allowing users to switch lessons and mark them completed.
  - Real-time progress bar calculation synced with user enrollment data.

- **My Courses Dashboard (`my-courses.html`)**:
  - Dedicated student learning dashboard showing all enrolled courses.
  - Lesson progress percentage indicators and completed lessons counter.
  - "Enjoy Course" action links that open lessons directly.
  - Empty state with suggested courses if the user has not yet enrolled.

- **Cart & Order Checkout (`cart.html`)**:
  - Course cart review with dynamic item listing, price calculation, and item removal.
  - Promo code support (e.g. `BYTE20` for 20% discount).
  - Multi-tab payment options (Credit Card, PayPal, Apple Pay).
  - Order checkout flow with processing feedback and a "Payment Successful" celebration modal detailing order receipt.

- **Creator Profiles (`creators.html` & `creator.html`)**:
  - Instructor profile with bio, specialties, ratings, student counts, and published courses showcase.

- **Authentication System (`login.html`, `register.html`, `forgot-password.html`, `reset-password.html`)**:
  - User registration and login validation.
  - Password visibility toggle.
  - Quick "Fill Demo Credentials" button for testing.

---

### 2. Technologies used

- **Frontend**:
  - **HTML5**: Semantic markup for layout and accessibility.
  - **CSS3**: Custom design system, CSS custom properties (variables), modern typography (Poppins & DM Sans), responsive flexbox and grid layouts, micro-animations.
  - **JavaScript (ES6+)**: DOM manipulation, asynchronous operations, event handling, and `localStorage` persistence.
- **Backend (Localhost)**:
  - **Node.js & Express.js**: REST API routes for authentication (`/api/auth/*`) and course management (`/api/courses/*`).
  - **MongoDB & Mongoose**: Database modeling with file-based fallback storage.
- **Security & Authentication**:
  - **bcryptjs**: Password hashing.
  - **JSON Web Tokens (JWT)**: Authentication tokens with HTTP-only cookie support.
  - **cookie-parser** & **dotenv**: Cookie parsing and environment variable configuration.
- **Deployment**:
  - **GitHub Pages**: Static live deployment via `gh-pages` branch.

---

### 3. Special instructions to review your work

#### Live GitHub Pages Link
- **Site URL**: [https://atiar11.github.io/ByteSpace/](https://atiar11.github.io/ByteSpace/)
- **Cart & Checkout**: [https://atiar11.github.io/ByteSpace/cart.html](https://atiar11.github.io/ByteSpace/cart.html)
- **My Courses**: [https://atiar11.github.io/ByteSpace/my-courses.html](https://atiar11.github.io/ByteSpace/my-courses.html)

#### Running Locally (Full-Stack Mode)
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Atiar11/ByteSpace.git
   cd ByteSpace
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```
4. **Start the server**:
   ```bash
   npm start
   # or
   node server.js
   ```
5. Open `http://localhost:5000` in your web browser.

#### Demo Credentials & Test Data
- **Demo Email**: `designer@example.com`
- **Demo Password**: `password123`
  *(On the login page, you can also click the **"Fill Demo Credentials"** button)*
- **Promo Discount Code**: Enter `BYTE20` at checkout for 20% off.

#### Dual-Mode Architecture (GitHub Pages vs Localhost)
- **On GitHub Pages (Static Mode)**: All interactive functionality—including adding to cart, checkout, enrollment, course lessons, and progress tracking—works client-side using `localStorage`. No server installation is required.
- **On Localhost (Full-Stack Mode)**: Full REST API endpoints and backend routes are active with MongoDB and Express.

---

### 4. Additional notes

- **Zero Heavy Dependencies on Frontend**: Built with pure vanilla HTML, CSS, and JavaScript for maximum rendering speed, zero bundle overhead, and cross-browser reliability.
- **Local Asset Packaging**: All course preview graphics, avatars, badges, and 3D icons are packaged locally in `figma-images/` to prevent external CDN link breakage.
- **Responsive Design**: Designed and tested for mobile, tablet, and desktop viewports with a collapsible mobile navigation drawer.

---

## 📂 Project Structure

```
ByteSpace/
├── public/                 # Static frontend client files
│   ├── index.html          # Main landing homepage
│   ├── search.html         # Course catalog & search
│   ├── course-detail.html  # Course overview, syllabus & reviews
│   ├── course-lessons.html # Interactive video lessons player
│   ├── my-courses.html     # Enrolled student dashboard
│   ├── cart.html           # Cart review & checkout
│   ├── creators.html       # Creators directory
│   ├── creator.html        # Individual creator profile
│   ├── login.html          # User sign-in
│   ├── register.html       # User registration
│   ├── forgot-password.html# Password recovery request
│   ├── reset-password.html # Password reset form
│   ├── styles.css          # Design system & responsive styles
│   ├── app.js              # Application logic, cart & state handling
│   └── figma-images/       # Local images and graphic assets
├── routes/                 # Express API routes (backend)
│   ├── auth.js             # Authentication endpoints
│   └── courses.js          # Course catalog, checkout & progress endpoints
├── models/                 # Mongoose schema models
├── services/               # User state and data management services
├── data/                   # JSON data fallbacks
├── server.js               # Node.js Express server entry point
├── package.json            # Project dependencies & scripts
└── README.md               # Project documentation
```

## 📄 License
ISC
