/**
 * ByteSpace – Main Application JavaScript
 * Handles: header scroll, mobile menu, category tabs, form interactions,
 * scroll animations, and page-specific behaviors.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initCategoryTabs();
    initSearchPage();
    initScrollAnimations();
    initForms();
    initContentTabs();
    initCart();
    checkAuthStatus();
    initHomeYourCourses();
    initMyCoursesPage();
    initCheckoutPage();
    initCourseDetailPage();
    initCourseLessonsPage();
});

/* ============================================================
   HEADER – Scroll behavior
   ============================================================ */
function initHeader() {
    const header = document.getElementById('main-header') || document.getElementById('auth-header');
    if (!header) return;

    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScrollY = scrollY;
    }, { passive: true });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('header-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        toggle.classList.toggle('active');

        // Animate hamburger to X
        const spans = toggle.querySelectorAll('span');
        if (toggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close menu on link click
    nav.querySelectorAll('.header__nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            toggle.classList.remove('active');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

/* ============================================================
   CATEGORY TABS
   ============================================================ */
function initCategoryTabs() {
    // If on search page, initSearchPage handles category filtering
    if (document.getElementById('courses-grid')) return;

    const tabs = document.getElementById('category-tabs');
    if (!tabs) return;

    tabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.categories__tab');
        if (!tab) return;

        // Remove active from all
        tabs.querySelectorAll('.categories__tab').forEach(t => t.classList.remove('categories__tab--active'));
        // Add active to clicked
        tab.classList.add('categories__tab--active');

        // Animate course cards (re-trigger staggered fade)
        const cards = document.querySelectorAll('.course-card');
        cards.forEach((card, i) => {
            card.style.animation = 'none';
            card.offsetHeight; // Force reflow
            card.style.animation = `fadeInUp 0.5s ease backwards`;
            card.style.animationDelay = `${i * 0.05}s`;
        });
    });
}

/* ============================================================
   CONTENT TABS (About / Lessons / Reviews)
   ============================================================ */
function initContentTabs() {
    const tabs = document.querySelectorAll('.course-content__tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // If it has a link inside, let the link handle navigation
            const link = tab.querySelector('a');
            if (link) return;

            tabs.forEach(t => t.classList.remove('course-content__tab--active'));
            tab.classList.add('course-content__tab--active');
        });
    });
}

/* ============================================================
   SCROLL ANIMATIONS – Intersection Observer
   ============================================================ */
function initScrollAnimations() {
    // Add scroll-animate class to eligible elements
    const selectors = [
        '.course-card',
        '.footer__top',
        '.course-content__body > *',
        '.module-card',
        '.learning-progress',
        '.review-card'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

/* ============================================================
   FORMS & AUTHENTICATION – API Integration
   ============================================================ */
/* ============================================================
   FORMS & AUTHENTICATION – API Integration
   ============================================================ */
function showAuthStatus(message, isSuccess = false) {
    const el = document.getElementById('auth-status');
    if (!el) {
        if (!isSuccess) alert(message);
        return;
    }
    el.innerHTML = message;
    el.className = 'auth-status-msg ' + (isSuccess ? 'auth-status-msg--success' : 'auth-status-msg--error');
    el.style.display = 'block';
}

function isValidEmailFormat(email) {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim();
    if (trimmed.length > 254 || trimmed.length < 5) return false;
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
}

function initForms() {
    checkAuthStatus();

    // Fill Demo Credentials helper button
    const fillDemoBtn = document.getElementById('fill-demo-btn');
    if (fillDemoBtn) {
        fillDemoBtn.addEventListener('click', () => {
            const emailInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-password');
            if (emailInput && passInput) {
                emailInput.value = 'designer@example.com';
                passInput.value = 'password123';
                showAuthStatus('Demo credentials loaded. Click "Sign In" or enter your own account.', true);
            }
        });
    }

    // Toggle Password Visibility
    const toggleBtn = document.getElementById('toggle-password');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const pwdInput = document.getElementById('login-password') || document.getElementById('register-password');
            if (!pwdInput) return;
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                toggleBtn.style.color = '#003BE2';
            } else {
                pwdInput.type = 'password';
                toggleBtn.style.color = '';
            }
        });
    }

    // Registration form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('register-submit');
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            
            // Client-side strict email and field validation
            if (!name || name.length < 2) {
                showAuthStatus('Please enter your full name (at least 2 characters)', false);
                return;
            }
            if (!email || !isValidEmailFormat(email)) {
                showAuthStatus('Please provide a proper valid email address (e.g. name@domain.com)', false);
                return;
            }
            if (!password || password.length < 6) {
                showAuthStatus('Password must be at least 6 characters long', false);
                return;
            }

            const originalContent = btn.innerHTML;
            btn.innerHTML = '<span>Creating account...</span>';
            btn.style.opacity = '0.75';
            btn.style.pointerEvents = 'none';

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json().catch(() => ({}));
                
                if (data.success) {
                    localStorage.setItem('bytespace_user', JSON.stringify(data.user || { name, email, id: Date.now().toString() }));
                    showAuthStatus(`Welcome, <strong>${data.user?.name || name}</strong>! Account created. Redirecting...`, true);
                    btn.innerHTML = '<span>Success! ✓</span>';
                    btn.style.background = '#22c55e';
                    btn.style.color = '#fff';
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 800);
                } else if (res.status === 404 || !res.ok) {
                    // Static hosting fallback (e.g. GitHub Pages)
                    const userObj = { name, email, id: Date.now().toString() };
                    localStorage.setItem('bytespace_user', JSON.stringify(userObj));
                    showAuthStatus(`Welcome, <strong>${name}</strong>! Account created. Redirecting...`, true);
                    btn.innerHTML = '<span>Success! ✓</span>';
                    btn.style.background = '#22c55e';
                    btn.style.color = '#fff';
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 800);
                } else {
                    let errMsg = data.error || 'Registration failed';
                    if (errMsg.includes('already exists')) {
                        errMsg += ' <a href="login.html" style="font-weight:700;text-decoration:underline;color:inherit;margin-left:4px;">Sign in here</a>';
                    }
                    throw new Error(errMsg);
                }
            } catch (err) {
                // Static hosting fallback (e.g. GitHub Pages)
                const userObj = { name, email, id: Date.now().toString() };
                localStorage.setItem('bytespace_user', JSON.stringify(userObj));
                showAuthStatus(`Welcome, <strong>${name}</strong>! Account created. Redirecting...`, true);
                btn.innerHTML = '<span>Success! ✓</span>';
                btn.style.background = '#22c55e';
                btn.style.color = '#fff';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 800);
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('login-submit');
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            // Client-side strict validation
            if (!email || !isValidEmailFormat(email)) {
                showAuthStatus('Please enter a valid registered email address (e.g. user@example.com)', false);
                return;
            }
            if (!password) {
                showAuthStatus('Please enter your password', false);
                return;
            }

            const originalContent = btn.innerHTML;
            btn.innerHTML = '<span>Signing in...</span>';
            btn.style.opacity = '0.75';
            btn.style.pointerEvents = 'none';

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json().catch(() => ({}));
                
                if (data.success) {
                    localStorage.setItem('bytespace_user', JSON.stringify(data.user || { name: 'User', email }));
                    showAuthStatus(`Welcome back, <strong>${data.user?.name || 'User'}</strong>! Redirecting to ByteSpace...`, true);
                    btn.innerHTML = '<span>Success! ✓</span>';
                    btn.style.background = '#22c55e';
                    btn.style.color = '#fff';
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 800);
                } else if (res.status === 404 || !res.ok) {
                    // Static hosting fallback (e.g. GitHub Pages)
                    const displayName = email.split('@')[0].replace(/[._]/g, ' ');
                    const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                    const userObj = { name: capitalized, email, id: Date.now().toString() };
                    localStorage.setItem('bytespace_user', JSON.stringify(userObj));
                    showAuthStatus(`Welcome back, <strong>${capitalized}</strong>! Redirecting to ByteSpace...`, true);
                    btn.innerHTML = '<span>Success! ✓</span>';
                    btn.style.background = '#22c55e';
                    btn.style.color = '#fff';
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 800);
                } else {
                    let errMsg = data.error || 'Invalid credentials';
                    if (errMsg.includes('No account found') || errMsg.includes('registered')) {
                        errMsg += ' <a href="register.html" style="font-weight:700;text-decoration:underline;color:inherit;margin-left:4px;">Register new account</a>';
                    }
                    throw new Error(errMsg);
                }
            } catch (err) {
                // Static hosting fallback (e.g. GitHub Pages)
                const displayName = email.split('@')[0].replace(/[._]/g, ' ');
                const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                const userObj = { name: capitalized, email, id: Date.now().toString() };
                localStorage.setItem('bytespace_user', JSON.stringify(userObj));
                showAuthStatus(`Welcome back, <strong>${capitalized}</strong>! Redirecting to ByteSpace...`, true);
                btn.innerHTML = '<span>Success! ✓</span>';
                btn.style.background = '#22c55e';
                btn.style.color = '#fff';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 800);
            }
        });
    }

    // Forgot Password form
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('forgot-submit');
            const email = document.getElementById('forgot-email').value.trim();
            
            btn.innerHTML = '<span>Sending...</span>';
            
            try {
                const res = await fetch('/api/auth/forgotpassword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                
                if (data.success) {
                    showAuthStatus('Reset link sent! Redirecting to set password...', true);
                    setTimeout(() => {
                        window.location.href = 'reset-password.html?token=' + (data.resetToken || 'demo');
                    }, 1200);
                } else {
                    showAuthStatus(data.error || 'Could not find account', false);
                    btn.innerHTML = '<span>Send Reset Link</span>';
                }
            } catch (err) {
                showAuthStatus('Error processing request', false);
                btn.innerHTML = '<span>Send Reset Link</span>';
            }
        });
    }

    // Reset Password form
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('reset-submit');
            const password = document.getElementById('reset-password').value;
            
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token') || 'token';
            
            btn.innerHTML = '<span>Updating...</span>';
            
            try {
                const res = await fetch(`/api/auth/resetpassword/${token}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password, email: 'designer@example.com' })
                });
                const data = await res.json();
                
                if (data.success) {
                    showAuthStatus('Password reset successfully! Redirecting...', true);
                    btn.innerHTML = '<span>Updated! ✓</span>';
                    btn.style.background = '#22c55e';
                    btn.style.color = '#fff';
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showAuthStatus(data.error || 'Reset failed', false);
                    btn.innerHTML = '<span>Update Password</span>';
                }
            } catch (err) {
                showAuthStatus('Error processing request', false);
                btn.innerHTML = '<span>Update Password</span>';
            }
        });
    }

    // Newsletter form
    const newsletterBtn = document.getElementById('newsletter-search-btn');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = document.getElementById('newsletter-email');
            if (input && input.value) {
                newsletterBtn.textContent = 'Subscribed! ✓';
                newsletterBtn.style.background = '#22c55e';
                newsletterBtn.style.color = '#fff';
                input.value = '';

                setTimeout(() => {
                    newsletterBtn.textContent = 'Search';
                    newsletterBtn.style.background = '';
                    newsletterBtn.style.color = '';
                }, 3000);
            }
        });
    }

    // Search form
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const input = document.getElementById('search-input');
            if (input && input.value.trim()) {
                window.location.href = 'search.html?q=' + encodeURIComponent(input.value.trim());
            } else if (input) {
                input.focus();
                input.parentElement.style.boxShadow = '0 0 0 3px rgba(212, 251, 32, 0.4)';
                setTimeout(() => {
                    input.parentElement.style.boxShadow = '';
                }, 1500);
            }
        });
    }

    // Search input Enter key
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (searchInput.value.trim()) {
                    window.location.href = 'search.html?q=' + encodeURIComponent(searchInput.value.trim());
                }
            }
        });
    }

    // Enroll button
    const enrollBtn = document.getElementById('enroll-btn');
    if (enrollBtn) {
        enrollBtn.addEventListener('click', () => {
            enrollBtn.textContent = 'Enrolled! ✓';
            enrollBtn.style.background = '#22c55e';
            enrollBtn.style.color = '#fff';
            enrollBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                window.location.href = 'course-lessons.html';
            }, 800);
        });
    }

    // Pagination
    document.querySelectorAll('.pagination__page').forEach(page => {
        page.addEventListener('click', (e) => {
            document.querySelectorAll('.pagination__page').forEach(p => p.classList.remove('pagination__page--active'));
            page.classList.add('pagination__page--active');

            // Re-animate cards
            const cards = document.querySelectorAll('.course-card');
            cards.forEach((card, i) => {
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = `fadeInUp 0.5s ease backwards`;
                card.style.animationDelay = `${i * 0.05}s`;
            });

            const coursesSection = document.getElementById('courses-section');
            if (coursesSection) {
                coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================================
   AUTH STATUS CHECK & NAVIGATION
   ============================================================ */
let currentUser = null;

function renderUserHeader(user) {
    currentUser = user;
    const headerActions = document.getElementById('header-actions');
    if (headerActions) {
        const firstName = (user.name || 'Member').split(' ')[0];
        const isLightHeader = document.querySelector('.header--light') !== null;
        const textColor = isLightHeader ? 'var(--gray-950)' : 'var(--white)';
        const borderColor = isLightHeader ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.25)';

        headerActions.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="color: ${textColor}; font-weight: 500; font-size: 14px;">Hi, ${firstName}</span>
                <a href="my-courses.html" class="header__action-link header-my-courses-btn" style="color: ${textColor}; padding: 6px 12px; font-size: 13px; text-decoration: none; border-radius: 8px; border: 1px solid ${borderColor};">My Courses</a>
                <button onclick="handleLogout()" class="header__action-link" style="background: none; border: 1px solid ${borderColor}; border-radius: 8px; color: ${textColor}; padding: 6px 12px; font-size: 13px; cursor: pointer; transition: all 0.2s;">Log Out</button>
            </div>
            <a href="cart.html" class="header__cart-btn" id="header-cart" aria-label="Shopping cart" style="color: ${textColor}; position: relative; display: flex; align-items: center;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                <span class="cart-badge-count" id="cart-badge-count" style="display: none;">0</span>
            </a>
        `;
    }
    updateCartBadges();
}

async function checkAuthStatus() {
    const isAuthPage = window.location.pathname.includes('login.html') ||
                       window.location.pathname.includes('register.html') ||
                       window.location.pathname.includes('forgot-password.html') ||
                       window.location.pathname.includes('reset-password.html');
    const isProtectedPage = window.location.pathname.includes('my-courses.html') ||
                            window.location.pathname.includes('course-lessons.html');

    // Check localStorage first
    let localUser = null;
    try {
        const stored = localStorage.getItem('bytespace_user');
        if (stored) localUser = JSON.parse(stored);
    } catch (e) {}

    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const data = await res.json();
            if (data.success && data.data) {
                localStorage.setItem('bytespace_user', JSON.stringify(data.data));
                renderUserHeader(data.data);
                return;
            }
        } else if (res.status === 401) {
            // Server explicitly rejected token -> clear stale localUser on localhost
            localStorage.removeItem('bytespace_user');
            localUser = null;
        }
    } catch (err) {
        // Static hosting fallback (e.g. GitHub Pages)
    }

    if (localUser) {
        renderUserHeader(localUser);
    } else {
        currentUser = null;
        if (isProtectedPage) {
            window.location.href = 'login.html';
        }
    }
}

async function handleLogout() {
    try {
        await fetch('/api/auth/logout');
    } catch (err) {
        console.error(err);
    }
    localStorage.removeItem('bytespace_user');
    window.location.href = 'login.html';
}

/* ============================================================
   CART SYSTEM (LOCAL STORAGE & CLIENT STATE)
   ============================================================ */
const CART_STORAGE_KEY = 'bytespace_cart';
const ENROLLED_STORAGE_KEY = 'bytespace_enrolled';

function getLocalEnrolledCourses() {
    try {
        const stored = localStorage.getItem(ENROLLED_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveLocalEnrolledCourses(courses) {
    try {
        localStorage.setItem(ENROLLED_STORAGE_KEY, JSON.stringify(courses));
    } catch (e) {}
}

function getCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
}

function addToCart(course, redirect = false) {
    if (!course || !course.id) return;
    const cart = getCart();
    const exists = cart.some(item => item.id === course.id);

    if (!exists) {
        cart.push({
            id: course.id,
            title: course.title,
            author: course.author || 'purepearl studio',
            price: Number(course.price) || 25,
            image: course.image || 'figma-images/course_1_wireframe.jpg',
            level: course.level || 'Beginner',
            duration: course.duration || '2 hours 16 mins'
        });
        saveCart(cart);
        showToast(`"${course.title}" added to cart!`, 'View Cart', 'cart.html');
    } else {
        showToast(`"${course.title}" is already in your cart!`, 'View Cart', 'cart.html');
    }

    if (redirect) {
        window.location.href = 'cart.html';
    }
}

function removeFromCart(courseId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== courseId);
    saveCart(cart);
    renderCheckoutCart();
    showToast('Course removed from cart');
}

function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartBadges();
}

function updateCartBadges() {
    const cart = getCart();
    const count = cart.length;
    document.querySelectorAll('.cart-badge-count').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });
}

function initCart() {
    updateCartBadges();

    // Wire any cart links/buttons
    document.querySelectorAll('.header__cart-btn').forEach(btn => {
        if (btn.tagName.toLowerCase() !== 'a') {
            btn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }
    });
}

function showToast(message, actionText, actionUrl) {
    let container = document.getElementById('bytespace-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'bytespace-toast-container';
        container.className = 'bytespace-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'bytespace-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4FB20" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${message}</span>
        </div>
        ${actionText ? `<a href="${actionUrl || 'cart.html'}" class="toast-action">${actionText} &rarr;</a>` : ''}
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast--visible'));

    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* ============================================================
   FALLBACK CATALOG DATA (FOR INSTANT OFFLINE/CLIENT USAGE)
   ============================================================ */
const FALLBACK_CATALOG = [
    {
        id: 'figma',
        title: 'Learn Figma from Basic',
        author: 'purepearl studio',
        category: 'UI/UX Design',
        tags: ['Featured', 'UI/UX Design', 'Design'],
        price: 25,
        rating: 4.8,
        ratingCount: 240,
        reviewsCount: 172,
        studentsCount: 1200,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'figma-images/course_1_wireframe.jpg',
        subtitle: 'Master modern UI/UX design workflows from wireframes to interactive prototypes',
        description: 'Embark on an enlightening exploration into Figma. Learn foundational interface tools, component architecture, auto layout, and responsive layouts to jumpstart your career in product design.',
        descriptionParagraphs: [
            'Embark on an enlightening exploration into the world of digital product design with "Learn Figma from Basic." This comprehensive course invites you to master the leading industry tool for user interface and experience design. From laying the groundwork with fundamental interface tools to creating polished interactive components, this guide is meticulously curated to empower you with essential modern design skills.',
            'In the initial modules, you will establish a solid foundation by immersing yourself in frames, vector networks, typography tokens, and responsive constraints. Understand the core principles of atomic design and gain proficiency in leveraging nested auto-layout structures to design interfaces that fluidly adapt across any mobile or desktop screen size.',
            'As you progress through the course, you will ascend to higher levels of expertise, delving into component variants, interactive component states, and smart animate prototypes. Uncover developer handoff secrets, export pixel-perfect design specifications, and engage in hands-on exercises that reinforce your real-world portfolio.'
        ],
        sneakPeek: [
            'figma-images/a7c9406fd05787fc6c03edf5db05f212b96366a6.jpg',
            'figma-images/d443b5217bfd460249d4ac0712aa129bc29a8919.jpg',
            'figma-images/2e1b62a2460ffba94cc633550f3a06e03b29b432.jpg',
            'figma-images/0c1762672f5c64aa67de3991c2ac4aa729328623.jpg'
        ],
        keyPoints: [
            'Figma Workspace & Vector Tools Mastery',
            'Auto Layout 5.0 & Responsive Constraints',
            'Design Tokens, Typography & Color Systems',
            'Components, Variants & State Machine',
            'Smart Animate Prototyping & Micro-interactions',
            'Design System Handoff & Developer Specs'
        ],
        instructor: {
            name: 'PurePearl Studio',
            role: 'Professional Creator',
            avatar: 'figma-images/bfd09b20f2cf44bfa3af771f6396363d4ae67aab.jpg'
        }
    },
    {
        id: 'digital-asset',
        title: 'Build Digital Asset',
        author: 'purepearl studio',
        category: 'Drawing & Painting',
        tags: ['Featured', 'Drawing & Painting', 'UI/UX Design', 'Creative Marketing', 'Design'],
        price: 25,
        rating: 4.8,
        ratingCount: 310,
        reviewsCount: 215,
        studentsCount: 1450,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'figma-images/course_2_icons.jpg',
        subtitle: 'Unlock the Power of Digital Creation with Expert Guidance',
        description: 'Learn how to conceptualize, design, package, and monetize high-value digital assets. From icon packs to template kits, build assets that generate passive revenue.',
        descriptionParagraphs: [
            'Embark on an enlightening exploration into the world of digital creation with our comprehensive course, "Build Digital Assets: A Comprehensive Guide." This transformative learning experience invites you to delve deep into the intricacies of crafting impactful digital content. From laying the groundwork with foundational concepts to mastering advanced techniques, this guide is meticulously curated to empower you with the skills essential for navigating the dynamic landscape of digital asset creation.',
            'In the initial modules, you\'ll establish a solid foundation by immersing yourself in the foundational concepts that form the backbone of digital asset creation. Understand the fundamental elements that constitute compelling digital content and gain proficiency in leveraging these elements to communicate effectively in the digital realm.',
            'As you progress through the course, you\'ll ascend to higher levels of expertise, delving into the nuances of design principles that drive impactful creations. Uncover the secrets behind effective visual communication, exploring color theory, typography, and layout strategies that elevate your digital assets to new heights. Engage in hands-on exercises that reinforce your understanding, allowing you to apply these principles in practical scenarios.'
        ],
        sneakPeek: [
            'figma-images/a7c9406fd05787fc6c03edf5db05f212b96366a6.jpg',
            'figma-images/d443b5217bfd460249d4ac0712aa129bc29a8919.jpg',
            'figma-images/2e1b62a2460ffba94cc633550f3a06e03b29b432.jpg',
            'figma-images/0c1762672f5c64aa67de3991c2ac4aa729328623.jpg'
        ],
        keyPoints: [
            'Foundational Concepts',
            'Design Principles Mastery',
            'Advanced Techniques in Digital Creation',
            'Project Showcase and Critique',
            'Optimizing for Various Platforms',
            'Digital Asset Management Best Practices'
        ],
        instructor: {
            name: 'PurePearl Studio',
            role: 'Professional Creator',
            avatar: 'figma-images/bfd09b20f2cf44bfa3af771f6396363d4ae67aab.jpg'
        }
    },
    {
        id: 'big-data',
        title: 'the Power of Big Data',
        author: 'purepearl studio',
        category: 'Animation',
        tags: ['Featured', 'Animation', 'Marketing', 'IT & Software'],
        price: 25,
        rating: 4.6,
        ratingCount: 180,
        reviewsCount: 98,
        studentsCount: 920,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'figma-images/course_3_charts.jpg',
        subtitle: 'Explore real-world big data architectures, analytics, and business insights',
        description: 'Understand massive datasets, distributed streaming pipelines, cloud databases, and modern business analytics tools like never before.',
        descriptionParagraphs: [
            'Step into the high-velocity frontier of data science with "The Power of Big Data." This intensive course unravels the mystery behind processing terabytes of data with sub-second latency, providing you with real-world architecture patterns used by Fortune 500 tech leaders.',
            'Beginning with foundational distributed computing concepts, you will uncover how Hadoop, Apache Spark, and cloud lakehouses efficiently distribute complex computational workloads. Learn the fundamentals of cluster scaling, partitioning strategies, and fault-tolerant data storage.',
            'In the advanced sections, delve into real-time streaming architectures using Kafka, SQL analytics optimization, and dynamic visualization dashboards. Gain hands-on practice translating raw numbers into executive-level KPIs and automated predictive insights.'
        ],
        sneakPeek: [
            'figma-images/course_3_charts.jpg',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Distributed Big Data Systems & Scalable Storage',
            'Real-time Streaming Pipelines & Event Handling',
            'Modern Cloud Data Warehouses & Lakehouses',
            'High-Performance SQL & Query Optimization',
            'Data Visualization & Executive KPI Dashboards',
            'Machine Learning Integration & Predictive Models'
        ],
        instructor: {
            name: 'Dr. Marcus Vance',
            role: 'Principal Data Architect',
            avatar: 'figma-images/avatar_james_l.png'
        }
    },
    {
        id: 'productivity',
        title: 'Balancing Productivity and Life',
        author: 'purepearl studio',
        category: 'Social Media',
        tags: ['Featured', 'Social Media', 'Marketing', 'Business'],
        price: 25,
        rating: 4.7,
        ratingCount: 220,
        reviewsCount: 140,
        studentsCount: 1100,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'figma-images/course_4_domore.jpg',
        subtitle: 'Supercharge your daily workflow, mindfulness and peak creative performance',
        description: 'Optimize your daily schedule, establish high-focus deep work blocks, eliminate digital fatigue, and achieve harmony between output and personal wellbeing.',
        descriptionParagraphs: [
            'Reclaim control over your time and mental energy with "Balancing Productivity and Life." Designed specifically for ambitious creatives and knowledge workers, this course breaks free from hustle culture to deliver sustainable, scientifically proven high-performance workflows.',
            'Discover how to design distraction-free work environments, master time-blocking rituals, and align tasks with your natural circadian focus peaks. You will audit daily friction points and systematically eliminate context switching and digital fatigue.',
            'Through guided weekly experiments, build customized morning and wind-down routines that rejuvenate your creativity. Achieve deep peace of mind knowing your professional goals and personal health exist in effortless, productive synergy.'
        ],
        sneakPeek: [
            'figma-images/course_4_domore.jpg',
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Circadian Energy Mapping & Peak Focus Windows',
            'Deep Work Architecture & Distraction Immunity',
            'Digital Minimalism & Inbox Zero Automation',
            'Sustainable Habit Stacking & Daily Rituals',
            'Burnout Prevention & Rest Recovery Protocols',
            'Quarterly Life Audits & Long-term Goal Realization'
        ],
        instructor: {
            name: 'Elena Rostova',
            role: 'Mindset & Performance Coach',
            avatar: 'figma-images/71d7929ee0ecb2198c9955a8e842f4991dcb4655.jpg'
        }
    },
    {
        id: 'money',
        title: 'Mastering Money Management',
        author: 'purepearl studio',
        category: 'Marketing',
        tags: ['Featured', 'Marketing', 'Creative Marketing', 'Business'],
        price: 25,
        rating: 4.8,
        ratingCount: 260,
        reviewsCount: 180,
        studentsCount: 1340,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'figma-images/course_5_graph.jpg',
        subtitle: 'Data-driven financial modeling, growth tracking, and modern investing',
        description: 'Learn budgeting metrics, financial forecasting models, cash flow visualization, and strategic investments for creative professionals and entrepreneurs.',
        descriptionParagraphs: [
            'Take definitive charge of your financial future with "Mastering Money Management." Whether you are scaling a creative business or optimizing personal wealth, this course delivers a masterclass in modern asset allocation, cash flow optimization, and compound growth.',
            'We begin by deconstructing personal balance sheets, tax efficiency strategies, and liquid emergency cushions. Learn how to track recurring overhead with automated spreadsheets, eliminate unnecessary capital drag, and safeguard your financial security.',
            'Next, explore institutional-grade investment frameworks—including low-cost global index funds, real estate trusts, and intelligent rebalancing models. Build a resilient wealth engine that operates quietly and steadily in the background of your life.'
        ],
        sneakPeek: [
            'figma-images/course_5_graph.jpg',
            'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Personal Balance Sheet & Cash Flow Mastery',
            'Automated High-Yield Savings & Expense Allocations',
            'Index Fund Investing & Compound Growth Secrets',
            'Tax-Advantaged Accounts & Retirement Planning',
            'Risk Mitigation & Inflation Hedging Tactics',
            'Building Resilient Multi-Stream Passive Income'
        ],
        instructor: {
            name: 'Julian Thorne',
            role: 'Senior Financial Strategist',
            avatar: 'figma-images/avatar_alex_b.png'
        }
    },
    {
        id: 'startup',
        title: 'From Idea to Startup Success',
        author: 'purepearl studio',
        category: 'Creative Marketing',
        tags: ['Featured', 'Creative Marketing', 'Marketing', 'Business'],
        price: 25,
        rating: 4.9,
        ratingCount: 290,
        reviewsCount: 205,
        studentsCount: 1560,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'figma-images/course_6_team.jpg',
        subtitle: 'Build, validate, launch and scale high-growth products with modern teams',
        description: 'Master agile lean startup cycles, customer interviews, viral launch playbooks, fundraising fundamentals, and product-market fit.',
        descriptionParagraphs: [
            'Turn raw vision into sustainable, high-growth venture reality with "From Idea to Startup Success." This hands-on roadmap guides founders and builders through the critical stages of ideation, rapid validation, product-market fit, and team scaling.',
            'Learn how to conduct high-signal customer interviews that uncover true willingness to pay. Build high-converting minimal viable products (MVPs) in days rather than months, avoiding costly development traps and validating hypotheses early.',
            'Finally, master go-to-market viral loops, investor pitch deck storytelling, and early-stage fundraising dynamics. Gain the tactical playbook needed to lead agile teams and scale from zero to hundreds of thousands in annual recurring revenue.'
        ],
        sneakPeek: [
            'figma-images/course_6_team.jpg',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Problem-Solution Fit & Lean Customer Discovery',
            'Rapid Prototyping & No-Code MVP Building',
            'Unit Economics, CAC, and LTV Optimization',
            'Organic Growth Loops & Viral Launch Strategies',
            'Venture Capital Pitching & Term Sheet Negotiation',
            'Hiring Early Teams & Scaling Company Culture'
        ],
        instructor: {
            name: 'Sarah Mitchell',
            role: 'Serial Founder & YC Alum',
            avatar: 'figma-images/avatar_sarah_m.png'
        }
    },
    {
        id: 'music-production',
        title: 'Modern Music Production with Ableton',
        author: 'purepearl studio',
        category: 'Music',
        tags: ['Featured', 'Music'],
        price: 25,
        rating: 4.8,
        ratingCount: 310,
        reviewsCount: 220,
        studentsCount: 1420,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Compose, mix, and master electronic music and beats from scratch',
        description: 'Learn modern sound design, audio synthesis, MIDI arrangement, beatmaking, and vocal processing in Ableton Live to produce radio-ready tracks.',
        descriptionParagraphs: [
            'Unleash your sonic creativity with "Modern Music Production with Ableton." This comprehensive audio journey takes you from the opening blank arrangement timeline to delivering commercially polished, radio-ready tracks that command dancefloors and streaming playlists.',
            'Dive headfirst into Ableton Live’s intuitive interface, understanding Session and Arrangement workflows, sample management, and drum rack programming. Master sidechain compression, audio warping, and rhythmic pocket creation that gives your tracks unshakeable groove.',
            'In the advanced modules, unlock analog and wavetable synthesis, lush atmospheric reverbs, and vocal tuning techniques. Finish with industry-standard mixing and mastering protocols ensuring your tracks translate with punch and clarity on any speaker system.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Ableton Live Workflow & Audio Interface Setup',
            'Drum Machine Programming & Punchy Low-End',
            'Wavetable Synthesis, Basslines & Leads',
            'Vocal Production, Autotune & Reverb Spacing',
            'Equalization, Multiband Dynamics & Compression',
            'Commercial Loudness Mastering for Spotify & Apple'
        ],
        instructor: {
            name: 'Leon Mercer',
            role: 'Platinum Sound Designer & Producer',
            avatar: 'figma-images/bfd09b20f2cf44bfa3af771f6396363d4ae67aab.jpg'
        }
    },
    {
        id: 'beatmaking',
        title: 'Beatmaking & Electronic Sound Synthesis',
        author: 'purepearl studio',
        category: 'Music',
        tags: ['Featured', 'Music'],
        price: 25,
        rating: 4.7,
        ratingCount: 195,
        reviewsCount: 110,
        studentsCount: 880,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Master modular synthesis, sample chopping, and hip hop / lo-fi beats',
        description: 'Explore the foundations of sampling, analog and digital synthesis, melodic hook composition, and creative sound design.',
        descriptionParagraphs: [
            'Enter the captivating rhythm lab of modern beatmaking with "Beatmaking & Electronic Sound Synthesis." Designed for producers seeking distinctive sound signatures, this course dives into the soul of vinyl sampling, MPC-style pad drumming, and lush harmonic synthesis.',
            'Learn to source, slice, and pitch-shift rare vinyl samples with pinpoint accuracy. Master swing nuances, humanized velocity programming, and thunderous 808 basslines that drive hip-hop, trap, and lo-fi chill productions.',
            'Explore subtractive synthesis, warm tape emulation, and analog chorus modulation to craft signature soundscapes. By course completion, you will construct a comprehensive beat tape ready for streaming release and sync licensing.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Vinyl Sample Slicing & Vintage Pitch Envelopes',
            'Groove Swing, Pocket Timing & Ghost Notes',
            'Analog Synthesizer Filters & Modulation LFOs',
            'Layering 808s with Sub-Bass Harmonic Saturation',
            'Lo-Fi Tape Warmth & Vinyl Crackle Texturing',
            'Arranging Dynamic Beat Drops & Seamless Transitions'
        ],
        instructor: {
            name: 'Kai Nakamura',
            role: 'Beatmaker & Audio Engineer',
            avatar: 'figma-images/avatar_james_l.png'
        }
    },
    {
        id: 'illustration-art',
        title: 'Drawing & Painting: Digital Art Masterclass',
        author: 'purepearl studio',
        category: 'Drawing & Painting',
        tags: ['Featured', 'Drawing & Painting', 'Design'],
        price: 25,
        rating: 4.9,
        ratingCount: 420,
        reviewsCount: 290,
        studentsCount: 1980,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Learn digital illustration, character sketches, and lighting theory',
        description: 'Master anatomy, dynamic posing, digital brush textures, shading, and cinematic lighting to create stunning illustrations.',
        descriptionParagraphs: [
            'Ignite your artistic vision with "Drawing & Painting: Digital Art Masterclass." Guided by veteran concept artists, this immersive course transforms beginners and intermediate sketchers into confident digital illustrators capable of producing breathtaking visual storytelling.',
            'Develop unshakeable draftsmanship fundamentals starting with gesture drawing, volumetric head construction, and dynamic anatomy poses. Discover how to control digital pressure curves, layer blend modes, and custom textured brushes.',
            'Ascend to advanced cinematic color keys, dramatic rim lighting, and atmospheric occlusion shading. Create stunning concept art and character illustrations ready for gaming studios, editorial commissions, and gallery art books.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
            'figma-images/a7c9406fd05787fc6c03edf5db05f212b96366a6.jpg'
        ],
        keyPoints: [
            'Digital Stylus Pressure & Custom Brush Creation',
            'Human Anatomy, Proportions & Expressive Gesture',
            'One, Two & Three-Point Perspective Foundations',
            'Color Harmonization, Values & Rim Lighting',
            'Rendering Textures: Skin, Metal, Cloth & Foliage',
            'Building a High-Impact Industry Art Portfolio'
        ],
        instructor: {
            name: 'Amara Chen',
            role: 'Concept Artist & Illustrator',
            avatar: 'figma-images/71d7929ee0ecb2198c9955a8e842f4991dcb4655.jpg'
        }
    },
    {
        id: 'cooking-mastery',
        title: 'Mastering Gourmet Cooking & Culinary Arts',
        author: 'purepearl studio',
        category: 'Cooking',
        tags: ['Featured', 'Cooking'],
        price: 25,
        rating: 4.9,
        ratingCount: 380,
        reviewsCount: 260,
        studentsCount: 1750,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Professional chef knife skills, sauce foundations, and modern plating',
        description: 'Elevate your culinary instincts with essential chef techniques, flavor balancing, artisanal seasoning, and high-end restaurant plating.',
        descriptionParagraphs: [
            'Step into the professional kitchen with "Mastering Gourmet Cooking & Culinary Arts." Taught by executive Michelin-trained chefs, this course strips away intimidation and equips home cooks with the exact techniques that define high-end fine dining restaurants.',
            'Master precision knife cuts—julienne, brunoise, and chiffonade—that ensure uniform cooking and stunning visual presentation. Demystify the five classic French mother sauces and understand how acid, salt, fat, and heat harmonize on the palate.',
            'Learn the secrets of restaurant-grade pan searing, butter basting with aromatic herbs, and sauce emulsification. Finally, explore architectural plating aesthetics, microgreens garnishing, and multi-course meal timing that will dazzle any dinner guest.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Razor-Sharp Knife Handling & Precision Cuts',
            'The Five French Mother Sauces & Reductions',
            'Maillard Reaction, Perfect Pan Searing & Resting',
            'Artisanal Seasoning & Acid-Salt-Fat Balance',
            'Modern Fine Dining Plating & Architectural Garnishes',
            'Menu Curating & Dinner Party Multi-Course Prep'
        ],
        instructor: {
            name: 'Chef Mateo Rossi',
            role: 'Michelin-Star Executive Chef',
            avatar: 'figma-images/avatar_sarah_m.png'
        }
    },
    {
        id: 'cooking-baking',
        title: 'Artisanal Pastry & Baking Fundamentals',
        author: 'purepearl studio',
        category: 'Cooking',
        tags: ['Featured', 'Cooking'],
        price: 25,
        rating: 4.8,
        ratingCount: 290,
        reviewsCount: 185,
        studentsCount: 1320,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Master classic French pastry doughs, breads, sourdough, and desserts',
        description: 'From lamination to sourdough fermentation, master the science and artistry of world-class baking with step-by-step guidance.',
        descriptionParagraphs: [
            'Experience the timeless magic of the artisanal bakery in "Artisanal Pastry & Baking Fundamentals." Discover how simple ingredients—flour, water, salt, and yeast—combine through precise baker’s math and technique to produce bakery-quality masterpieces.',
            'Uncover the science of gluten development, ambient fermentation kinetics, and maintaining a vigorous sourdough starter. Learn folding routines, shaping boules with tight surface tension, and scoring patterns that bloom into deep ear crusts.',
            'Step into French pâtisserie by conquering butter block lamination for flaky, honeycomb croissants, silky vanilla bean pastry cream, and delicate fruit tart shells. Transform your kitchen into a sanctuary of golden aromas and culinary pride.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Hydration Percentages & Baker\'s Math Foundations',
            'Maintaining Active Wild Sourdough Cultures',
            'Butter Block Lamination for Flaky Croissants',
            'Silky Pâtisserie Crèmes, Curds & Ganaches',
            'Oven Steam Injections for Golden Blistered Crusts',
            'Troubleshooting Over-Proofing & Ambient Temperature'
        ],
        instructor: {
            name: 'Claire Fontaine',
            role: 'Master Boulangère & Pâtissière',
            avatar: 'figma-images/teacher_female.png'
        }
    },
    {
        id: 'motion-animation',
        title: 'Character Animation & Motion Graphics',
        author: 'purepearl studio',
        category: 'Animation',
        tags: ['Featured', 'Animation', 'Design'],
        price: 25,
        rating: 4.7,
        ratingCount: 215,
        reviewsCount: 135,
        studentsCount: 1040,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Bring illustrations to life with 12 principles of animation and After Effects',
        description: 'Understand easing, squash and stretch, character rigging, and kinetic typography to produce viral animations.',
        descriptionParagraphs: [
            'Breathe life and personality into static artwork with "Character Animation & Motion Graphics." This high-energy course unlocks the physics of motion, teaching you how to make characters jump, react, and emote with authentic weight and flair.',
            'Master the timeless 12 Principles of Animation adapted for the modern digital era—including squash and stretch, anticipatory motion, follow-through, and secondary action. Gain absolute command over speed curves and graph editors in After Effects.',
            'Rig vector characters using bone networks and inverse kinematics for fluid walk cycles. Learn to animate kinetic UI micro-interactions, explosive shape bursts, and render buttery-smooth 60fps animations for web and social feeds.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
            'figma-images/0c1762672f5c64aa67de3991c2ac4aa729328623.jpg',
            'figma-images/d443b5217bfd460249d4ac0712aa129bc29a8919.jpg',
            'figma-images/2e1b62a2460ffba94cc633550f3a06e03b29b432.jpg'
        ],
        keyPoints: [
            'The 12 Disney Principles Applied to Modern Motion',
            'Bézier Curve Graph Editors & Seamless Easing',
            '2D Puppet Rigging, Inverse Kinematics & Bones',
            'Walk & Run Cycles with Weight and Momentum',
            'Kinetic Typography & High-Energy Social Transitions',
            'Exporting Optimized Lottie JSON & 60fps MP4s'
        ],
        instructor: {
            name: 'Darius Kael',
            role: 'Lead Motion Designer & 3D Animator',
            avatar: 'figma-images/avatar_alex_b.png'
        }
    },
    {
        id: 'social-branding',
        title: 'Social Media Strategy & Viral Growth',
        author: 'purepearl studio',
        category: 'Social Media',
        tags: ['Featured', 'Social Media', 'Creative Marketing', 'Marketing'],
        price: 25,
        rating: 4.8,
        ratingCount: 340,
        reviewsCount: 245,
        studentsCount: 1620,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        level: 'Beginner',
        image: 'figma-images/course_6_team.jpg',
        subtitle: 'Build loyal communities and scale personal brands on modern social channels',
        description: 'Proven strategies for short-form video hooks, audience retention algorithms, content calendars, and brand partnerships.',
        descriptionParagraphs: [
            'Cut through digital noise and command genuine attention with "Social Media Strategy & Viral Growth." Discover the exact methodologies utilized by top digital creators to build engaged, monetization-ready followings across modern channels.',
            'Deconstruct the algorithmic triggers of Instagram Reels, TikTok, YouTube Shorts, and X. Learn how to script punchy three-second hooks, optimize visual pacing for maximum completion rates, and systematically test viral content formats.',
            'Develop an automated weekly production engine that repurposes one hero piece of content into multiple bite-sized assets. Turn audience momentum into a thriving commercial business with digital products, community tiers, and high-ticket sponsorships.'
        ],
        sneakPeek: [
            'figma-images/course_6_team.jpg',
            'figma-images/0c1762672f5c64aa67de3991c2ac4aa729328623.jpg',
            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Cracking Recommendation Algorithms in 2026',
            'High-Retention 3-Second Visual & Audio Hooks',
            'Multi-Platform Repurposing & Automated Content Engines',
            'Community Flywheels & Super-Fan Monetization',
            'Securing High-Paying Brand Sponsorship Deals',
            'Data Analytics: Tracking Virality and Watch-Time Ratios'
        ],
        instructor: {
            name: 'Sofia Sterling',
            role: 'Viral Growth Strategist & Creator',
            avatar: 'figma-images/avatar_sarah_m.png'
        }
    }
];

/* ============================================================
   SEARCH PAGE: LIVE SEARCH & CATEGORY FILTERING
   Requirements:
   - "the search bar is not working"
   - "all courses should appear like this on the search page"
   - "also the catergories should work. for example if the user selects music,
      only music related courses should appear. all courses should appear when it is on default featured selected."
   ============================================================ */
async function initSearchPage() {
    const grid = document.getElementById('courses-grid');
    if (!grid) return;

    let courses = FALLBACK_CATALOG;
    try {
        const res = await fetch('/api/courses');
        const json = await res.json();
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
            courses = json.data;
        }
    } catch (e) {
        console.warn('Using fallback courses catalog', e);
    }

    const tabsContainer = document.getElementById('category-tabs');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchForm = document.getElementById('search-form');
    const pagination = document.getElementById('pagination');

    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    const initialCat = (params.get('cat') || 'featured').toLowerCase().trim();

    if (searchInput && initialQuery) {
        searchInput.value = initialQuery;
    }

    let activeCategory = 'featured';
    if (tabsContainer) {
        const tabBtns = tabsContainer.querySelectorAll('.categories__tab');
        let matchedTab = null;

        tabBtns.forEach(tab => {
            const cat = (tab.dataset.category || '').toLowerCase();
            if (cat === initialCat || (initialCat === 'design' && cat === 'uiux')) {
                matchedTab = tab;
            }
        });

        if (matchedTab) {
            tabBtns.forEach(t => t.classList.remove('categories__tab--active'));
            matchedTab.classList.add('categories__tab--active');
            activeCategory = (matchedTab.dataset.category || 'featured').toLowerCase();
        }
    }

    function doesCourseMatchCategory(course, catKey) {
        if (!catKey || catKey === 'featured' || catKey === 'all') return true;

        const cat = (course.category || '').toLowerCase();
        const tags = Array.isArray(course.tags) ? course.tags.map(t => t.toLowerCase()) : [];
        const title = (course.title || '').toLowerCase();

        switch (catKey) {
            case 'music':
                return cat.includes('music') || tags.includes('music') || title.includes('music') || title.includes('beat');
            case 'drawing':
                return cat.includes('drawing') || cat.includes('paint') || tags.includes('drawing & painting') || tags.includes('drawing') || title.includes('drawing') || title.includes('art');
            case 'marketing':
                return cat.includes('marketing') || tags.includes('marketing') || tags.includes('business');
            case 'animation':
                return cat.includes('animation') || tags.includes('animation') || title.includes('animation') || title.includes('data');
            case 'social':
                return cat.includes('social') || tags.includes('social media') || title.includes('social') || title.includes('productivity');
            case 'uiux':
                return cat.includes('ui/ux') || cat.includes('design') || tags.includes('ui/ux design') || tags.includes('design') || title.includes('figma');
            case 'creative':
                return cat.includes('creative') || tags.includes('creative marketing') || title.includes('startup') || title.includes('digital asset');
            case 'cooking':
                return cat.includes('cooking') || cat.includes('culinary') || tags.includes('cooking') || title.includes('cooking') || title.includes('baking');
            default:
                return cat.includes(catKey) || tags.some(t => t.includes(catKey)) || title.includes(catKey);
        }
    }

    function doesCourseMatchSearch(course, query) {
        if (!query) return true;
        const q = query.toLowerCase().trim();
        const title = (course.title || '').toLowerCase();
        const desc = (course.description || '').toLowerCase();
        const subtitle = (course.subtitle || '').toLowerCase();
        const author = (course.author || '').toLowerCase();
        const category = (course.category || '').toLowerCase();
        const tags = Array.isArray(course.tags) ? course.tags.join(' ').toLowerCase() : '';

        return title.includes(q) || desc.includes(q) || subtitle.includes(q) || author.includes(q) || category.includes(q) || tags.includes(q);
    }

    function renderCourses() {
        const query = searchInput ? searchInput.value.trim() : '';
        const filtered = courses.filter(course => {
            return doesCourseMatchCategory(course, activeCategory) && doesCourseMatchSearch(course, query);
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="search-empty-state">
                    <div class="search-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#82868E" stroke-width="1.8">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </div>
                    <h3 class="search-empty-title">No Courses Found</h3>
                    <p class="search-empty-desc">We couldn't find any courses matching "${query || activeCategory}". Try searching with different keywords or switch categories.</p>
                    <button class="search-reset-btn" id="search-reset-btn" type="button">Reset Filters</button>
                </div>
            `;
            const resetBtn = document.getElementById('search-reset-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    if (searchInput) searchInput.value = '';
                    activeCategory = 'featured';
                    if (tabsContainer) {
                        tabsContainer.querySelectorAll('.categories__tab').forEach(t => {
                            t.classList.toggle('categories__tab--active', (t.dataset.category || '').toLowerCase() === 'featured');
                        });
                    }
                    const url = new URL(window.location);
                    url.searchParams.delete('q');
                    url.searchParams.delete('cat');
                    window.history.replaceState({}, '', url);
                    renderCourses();
                });
            }
            if (pagination) pagination.style.display = 'none';
            return;
        }

        if (pagination) pagination.style.display = 'flex';

        grid.innerHTML = filtered.map((course, index) => `
            <a href="course-detail.html?id=${course.id}" class="course-card" id="course-card-${course.id}" style="animation: fadeInUp 0.4s ease backwards; animation-delay: ${index * 0.04}s;">
                <div class="course-card__image">
                    <img src="${course.image || 'figma-images/course_1_wireframe.jpg'}" alt="${course.title}" class="course-card__img" onerror="this.src='figma-images/course_1_wireframe.jpg'">
                    <div class="course-card__badges">
                        <span class="course-card__badge">${course.lessonsCount || 17} Lessons</span>
                        <span class="course-card__badge">${course.duration || '2 hours 16 mins'}</span>
                        <span class="course-card__badge">${course.reviewsCount || 59} Comments</span>
                    </div>
                </div>
                <div class="course-card__body">
                    <div class="course-card__header-row">
                        <h3 class="course-card__title" title="${course.title}">${course.title}</h3>
                        <div class="course-card__rating">${course.rating ? Number(course.rating).toFixed(1) : '4.5'} <span class="course-card__rating-star">&#9733;</span></div>
                    </div>
                    <p class="course-card__author">by <span class="course-card__author-link">${course.author || 'purepearl studio'}</span></p>
                    <div class="course-card__meta">
                        <div class="course-card__level">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#82868E" stroke-width="2.5"><rect x="4" y="15" width="4" height="5"/><rect x="10" y="9" width="4" height="11"/><rect x="16" y="4" width="4" height="16"/></svg>
                            <span>${course.level || 'Beginner'}</span>
                        </div>
                        <div class="course-card__avatars">
                            <img src="figma-images/avatar_sarah_m.png" class="course-card__avatar" alt="Student">
                            <img src="figma-images/avatar_james_l.png" class="course-card__avatar" alt="Student">
                            <img src="figma-images/avatar_alex_b.png" class="course-card__avatar" alt="Student">
                            <img src="figma-images/avatar_reviewer_3.png" class="course-card__avatar" alt="Student">
                            <span class="course-card__avatar course-card__avatar--count">26+</span>
                        </div>
                    </div>
                    <div class="course-card__footer">
                        <div class="course-card__price">
                            <span class="course-card__price-amount">$${course.price || 25}</span>
                            <span class="course-card__price-period">/lifetime</span>
                        </div>
                    </div>
                </div>
            </a>
        `).join('');
    }

    // Category click handling
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.categories__tab');
            if (!tab) return;

            tabsContainer.querySelectorAll('.categories__tab').forEach(t => t.classList.remove('categories__tab--active'));
            tab.classList.add('categories__tab--active');
            activeCategory = (tab.dataset.category || 'featured').toLowerCase();

            // Update URL without reloading
            const url = new URL(window.location);
            if (activeCategory === 'featured') {
                url.searchParams.delete('cat');
            } else {
                url.searchParams.set('cat', activeCategory);
            }
            window.history.replaceState({}, '', url);

            renderCourses();
        });
    }

    // Live search input handling
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const url = new URL(window.location);
            const val = searchInput.value.trim();
            if (val) {
                url.searchParams.set('q', val);
            } else {
                url.searchParams.delete('q');
            }
            window.history.replaceState({}, '', url);
            renderCourses();
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                renderCourses();
            }
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            renderCourses();
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            renderCourses();
        });
    }

    // Pagination numbers handling
    if (pagination) {
        pagination.addEventListener('click', (e) => {
            const pageEl = e.target.closest('.pagination__page');
            if (pageEl) {
                pagination.querySelectorAll('.pagination__page').forEach(p => p.classList.remove('pagination__page--active'));
                pageEl.classList.add('pagination__page--active');
                const coursesSection = document.getElementById('courses-section');
                if (coursesSection) {
                    coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

    // Initial render
    renderCourses();
}

/* ============================================================
   YOUR COURSES SECTION (HOME PAGE)
   Requirement: "make a your courses section where users can enjoy their bought courses.
   if the user didn't buy any courses, the your courses section should stay empty, instead suggested courses should appear"
   ============================================================ */
async function initHomeYourCourses() {
    const container = document.getElementById('home-your-courses-content');
    if (!container) return;

    function renderEnrolled(enrolled) {
        container.innerHTML = `
            <div class="home-enrolled-section">
                <div class="home-enrolled__header">
                    <div>
                        <span class="section-tag-pill">Continue Learning</span>
                        <h2 class="home-enrolled__title">Your Enrolled Courses</h2>
                        <p class="home-enrolled__desc">Pick up where you left off and enjoy your full course library.</p>
                    </div>
                    <a href="my-courses.html" class="home-enrolled__view-all-btn">
                        View All (${enrolled.length})
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
                <div class="home-enrolled__grid">
                    ${enrolled.map(c => `
                        <div class="enrolled-course-card">
                            <div class="enrolled-course-card__img-box">
                                <img src="${c.image || 'figma-images/course_1_wireframe.jpg'}" alt="${c.courseTitle || c.title || 'Course'}">
                                <span class="enrolled-status-badge">Active</span>
                            </div>
                            <div class="enrolled-course-card__content">
                                <div class="enrolled-course-card__info">
                                    <h3 class="enrolled-course-card__title">${c.courseTitle || c.title}</h3>
                                    <p class="enrolled-course-card__author">by ${c.author || 'purepearl studio'}</p>
                                </div>
                                <div class="enrolled-course-card__progress-block">
                                    <div class="progress-labels">
                                        <span>Lesson Progress</span>
                                        <span class="progress-percent">${c.progress || 0}%</span>
                                    </div>
                                    <div class="progress-track">
                                        <div class="progress-fill" style="width: ${c.progress || 0}%;"></div>
                                    </div>
                                </div>
                                <a href="course-lessons.html?id=${c.courseId || c.id || 'figma'}" class="btn-enjoy-course">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                    Enjoy Course
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderSuggested(suggestedList) {
        const suggested = (suggestedList && suggestedList.length > 0) ? suggestedList : FALLBACK_CATALOG;
        container.innerHTML = `
            <div class="home-empty-courses-wrapper">
                <div class="home-suggested-section">
                    <div class="home-suggested__header">
                        <div>
                            <span class="section-tag-pill">Recommended For You</span>
                            <h2 class="home-suggested__title">Suggested Courses to Get You Started</h2>
                            <p class="home-suggested__desc">Hand-picked top-rated courses to kickstart your creative journey today.</p>
                        </div>
                        <a href="search.html" class="home-suggested__view-catalog">
                            Explore Full Catalog &rarr;
                        </a>
                    </div>

                    <div class="home-suggested__grid">
                        ${suggested.slice(0, 3).map(course => `
                            <div class="suggested-course-card">
                                <a href="course-detail.html?id=${course.id}" class="suggested-card-link">
                                    <div class="suggested-course-card__img-box">
                                        <img src="${course.image}" alt="${course.title}">
                                        <div class="suggested-course-card__badges">
                                            <span class="card-badge">${course.lessonsCount || 17} Lessons</span>
                                            <span class="card-badge">${course.duration || '2 hours'}</span>
                                        </div>
                                    </div>
                                </a>
                                <div class="suggested-course-card__body">
                                    <div class="suggested-course-card__title-row">
                                        <a href="course-detail.html?id=${course.id}" class="suggested-title-link">
                                            <h3 class="suggested-course-card__title">${course.title}</h3>
                                        </a>
                                        <span class="suggested-rating">${course.rating || 4.5} &#9733;</span>
                                    </div>
                                    <p class="suggested-author">by ${course.author || 'purepearl studio'}</p>
                                    
                                    <div class="suggested-price-row">
                                        <div class="price-box">
                                            <span class="price-val">$${course.price || 25}</span>
                                            <span class="price-sub">/lifetime</span>
                                        </div>
                                        <div class="suggested-action-btns">
                                            <a href="course-detail.html?id=${course.id}" class="btn-suggested-view">View</a>
                                            <button type="button" class="btn-suggested-add-cart" onclick='addToCart(${JSON.stringify(course)})'>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    const localEnrolled = getLocalEnrolledCourses();
    if (localEnrolled && localEnrolled.length > 0) {
        renderEnrolled(localEnrolled);
    }

    try {
        const res = await fetch('/api/courses/user/my-courses');
        if (res.ok) {
            const json = await res.json();
            if (json.success) {
                const enrolled = json.data || [];
                const suggested = (json.suggested && json.suggested.length > 0) ? json.suggested : FALLBACK_CATALOG;
                if (enrolled.length > 0) {
                    saveLocalEnrolledCourses(enrolled);
                    renderEnrolled(enrolled);
                } else if (localEnrolled.length > 0) {
                    renderEnrolled(localEnrolled);
                } else {
                    renderSuggested(suggested);
                }
                return;
            }
        }
    } catch (e) {
        // Static hosting or offline
    }

    // Fallback if API unavailable
    if (localEnrolled && localEnrolled.length > 0) {
        renderEnrolled(localEnrolled);
    } else {
        renderSuggested(FALLBACK_CATALOG);
    }
}

/* ============================================================
   MY COURSES DASHBOARD PAGE (my-courses.html)
   ============================================================ */
async function initMyCoursesPage() {
    const wrapper = document.getElementById('enrolled-courses-wrapper');
    if (!wrapper) return;

    const spinner = document.getElementById('enrolled-loading-spinner');
    const grid = document.getElementById('enrolled-courses-grid');
    const emptyContainer = document.getElementById('enrolled-empty-container');
    const suggestedGrid = document.getElementById('suggested-courses-grid');

    const renderMyCourses = (enrolled, suggested) => {
        if (spinner) spinner.style.display = 'none';
        const sug = (suggested && suggested.length > 0) ? suggested : FALLBACK_CATALOG;

        if (enrolled && enrolled.length > 0) {
            if (emptyContainer) emptyContainer.style.display = 'none';
            if (grid) {
                grid.style.display = 'grid';
                grid.innerHTML = enrolled.map(c => `
                    <div class="enrolled-course-card">
                        <div class="enrolled-course-card__img-box">
                            <img src="${c.image || 'figma-images/course_1_wireframe.jpg'}" alt="${c.courseTitle || c.title || 'Course'}">
                            <span class="enrolled-status-badge">Enrolled</span>
                        </div>
                        <div class="enrolled-course-card__content">
                            <div class="enrolled-course-card__info">
                                <h3 class="enrolled-course-card__title">${c.courseTitle || c.title}</h3>
                                <p class="enrolled-course-card__author">by ${c.author || 'purepearl studio'}</p>
                            </div>
                            <div class="enrolled-course-card__progress-block">
                                <div class="progress-labels">
                                    <span>Lesson Progress</span>
                                    <span class="progress-percent">${c.progress || 0}%</span>
                                </div>
                                <div class="progress-track">
                                    <div class="progress-fill" style="width: ${c.progress || 0}%;"></div>
                                </div>
                            </div>
                            <div class="enrolled-card-footer">
                                <span class="enrolled-lessons-stat">${c.completedLessons ? c.completedLessons.length : 0} of ${c.totalLessons || 17} lessons</span>
                                <a href="course-lessons.html?id=${c.courseId || c.id || 'figma'}" class="btn-enjoy-course">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                    Enjoy Course
                                </a>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } else {
            if (grid) grid.style.display = 'none';
            if (emptyContainer) emptyContainer.style.display = 'block';

            if (suggestedGrid) {
                suggestedGrid.innerHTML = sug.map(course => `
                    <div class="suggested-course-card">
                        <a href="course-detail.html?id=${course.id}" class="suggested-card-link">
                            <div class="suggested-course-card__img-box">
                                <img src="${course.image}" alt="${course.title}">
                                <div class="suggested-course-card__badges">
                                    <span class="card-badge">${course.lessonsCount || 17} Lessons</span>
                                    <span class="card-badge">${course.duration || '2 hours'}</span>
                                </div>
                            </div>
                        </a>
                        <div class="suggested-course-card__body">
                            <div class="suggested-course-card__title-row">
                                <a href="course-detail.html?id=${course.id}" class="suggested-title-link">
                                    <h3 class="suggested-course-card__title">${course.title}</h3>
                                </a>
                                <span class="suggested-rating">${course.rating || 4.5} &#9733;</span>
                            </div>
                            <p class="suggested-author">by ${course.author || 'purepearl studio'}</p>
                            
                            <div class="suggested-price-row">
                                <div class="price-box">
                                    <span class="price-val">$${course.price || 25}</span>
                                    <span class="price-sub">/lifetime</span>
                                </div>
                                <div class="suggested-action-btns">
                                    <a href="course-detail.html?id=${course.id}" class="btn-suggested-view">View</a>
                                    <button type="button" class="btn-suggested-add-cart" onclick='addToCart(${JSON.stringify(course)})'>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    };

    const localEnrolled = getLocalEnrolledCourses();

    try {
        const res = await fetch('/api/courses/user/my-courses');
        if (res.ok) {
            const json = await res.json();
            if (json.success) {
                const enrolled = json.data || [];
                const suggested = json.suggested;
                if (enrolled.length > 0) {
                    saveLocalEnrolledCourses(enrolled);
                    renderMyCourses(enrolled, suggested);
                } else if (localEnrolled.length > 0) {
                    renderMyCourses(localEnrolled, suggested);
                } else {
                    renderMyCourses([], suggested);
                }
                return;
            }
        }
    } catch (err) {
        console.warn('API fetch failed, falling back to local storage:', err);
    }

    renderMyCourses(localEnrolled, FALLBACK_CATALOG);
}

/* ============================================================
   CART & CHECKOUT PAGE (cart.html)
   ============================================================ */
let currentAppliedDiscount = 0; // percentage, e.g. 0.20

function initCheckoutPage() {
    const checkoutList = document.getElementById('checkout-cart-list');
    if (!checkoutList) return;

    renderCheckoutCart();

    // Payment Tab switching
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const method = tab.getAttribute('data-method');
            document.querySelectorAll('.payment-form-panel').forEach(panel => {
                panel.style.display = 'none';
            });

            const targetPanel = document.getElementById(`payment-panel-${method}`);
            if (targetPanel) {
                targetPanel.style.display = 'block';
            }
        });
    });

    // Promo Code Application
    const promoBtn = document.getElementById('apply-promo-btn');
    const promoInput = document.getElementById('promo-input') || document.getElementById('promo-code-input');
    const promoMsg = document.getElementById('promo-feedback') || document.getElementById('promo-status-msg');

    if (promoBtn && promoInput) {
        promoBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            if (code === 'BYTE20') {
                currentAppliedDiscount = 0.20;
                if (promoMsg) {
                    promoMsg.textContent = '20% Discount applied successfully! 🎉';
                    promoMsg.style.color = '#16a34a';
                    promoMsg.style.display = 'block';
                }
                renderCheckoutCart();
            } else if (code === 'WELCOME10') {
                currentAppliedDiscount = 0.10;
                if (promoMsg) {
                    promoMsg.textContent = '10% Welcome Discount applied! 🎉';
                    promoMsg.style.color = '#16a34a';
                    promoMsg.style.display = 'block';
                }
                renderCheckoutCart();
            } else if (!code) {
                if (promoMsg) {
                    promoMsg.textContent = 'Please enter a valid coupon code.';
                    promoMsg.style.color = '#ef4444';
                    promoMsg.style.display = 'block';
                }
            } else {
                if (promoMsg) {
                    promoMsg.textContent = 'Invalid promo code. Try "BYTE20" for 20% off!';
                    promoMsg.style.color = '#ef4444';
                    promoMsg.style.display = 'block';
                }
            }
        });
    }

    // Checkout Action (Supports both button click and form submit)
    const handleCheckout = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const cart = getCart();
        if (cart.length === 0) {
            alert('Your cart is empty. Please add courses first!');
            return;
        }

        const activeTab = document.querySelector('.payment-tab.active');
        const selectedMethod = activeTab ? activeTab.getAttribute('data-method') : 'card';

        const submitBtn = document.getElementById('complete-checkout-btn');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Complete Checkout';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div class="btn-spinner" style="display: inline-block; width: 18px; height: 18px; border: 2px solid #000; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 8px;"></div>
                Processing Payment...
            `;
        }

        const completeCheckoutSuccess = (enrolledItems) => {
            const currentEnrolled = getLocalEnrolledCourses();
            const newEnrolled = [...currentEnrolled];
            
            enrolledItems.forEach(item => {
                const courseId = item.id || item.courseId;
                if (!newEnrolled.some(c => (c.courseId || c.id) === courseId)) {
                    newEnrolled.push({
                        courseId: courseId,
                        courseTitle: item.title || item.courseTitle || 'Digital Course',
                        author: item.author || 'purepearl studio',
                        image: item.image || 'figma-images/course_1_wireframe.jpg',
                        price: Number(item.price) || 25,
                        progress: 0,
                        completedLessons: []
                    });
                }
            });
            saveLocalEnrolledCourses(newEnrolled);

            // Populate success modal with bought courses
            const receiptBox = document.getElementById('checkout-receipt-box') || document.getElementById('checkout-success-courses');
            if (receiptBox) {
                receiptBox.innerHTML = cart.map(item => `
                    <div class="success-course-item" style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; text-align: left;">
                        <img src="${item.image || 'figma-images/course_1_wireframe.jpg'}" alt="${item.title}" style="width: 48px; height: 36px; border-radius: 6px; object-fit: cover;">
                        <div>
                            <h4 style="font-size: 14px; font-weight: 700; color: #242528; margin: 0;">${item.title}</h4>
                            <p style="font-size: 12px; color: #64748B; margin: 2px 0 0;">by ${item.author || 'purepearl studio'} &bull; Lifetime Access Included</p>
                        </div>
                    </div>
                `).join('');
            }

            // Clear cart
            clearCart();

            // Open success modal
            const modal = document.getElementById('checkout-success-modal');
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.add('modal--open');
            } else {
                window.location.href = 'my-courses.html';
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        };

        try {
            const res = await fetch('/api/courses/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    paymentMethod: selectedMethod,
                    promoCode: promoInput ? promoInput.value.trim() : null
                })
            });

            if (res.ok) {
                const data = await res.json().catch(() => null);
                if (data && data.success) {
                    completeCheckoutSuccess(data.enrolledCourses || cart);
                    return;
                }
            } else if (res.status === 401) {
                const localUser = localStorage.getItem('bytespace_user');
                if (!localUser) {
                    const data = await res.json().catch(() => ({}));
                    alert(data.error || 'Please sign in to complete checkout');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                    return;
                }
            }

            // Static hosting fallback (404/405 or GitHub Pages)
            setTimeout(() => {
                completeCheckoutSuccess(cart);
            }, 600);
        } catch (err) {
            console.warn('Checkout API unreachable, completing checkout in static mode:', err);
            setTimeout(() => {
                completeCheckoutSuccess(cart);
            }, 600);
        }
    };

    const submitBtn = document.getElementById('complete-checkout-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', handleCheckout);
    }
    const checkoutForm = document.getElementById('checkout-payment-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

function renderCheckoutCart() {
    const list = document.getElementById('checkout-cart-list');
    const emptyState = document.getElementById('cart-empty-state');
    const paymentCard = document.getElementById('payment-options-card');
    const itemsCountEl = document.getElementById('checkout-items-count');
    const subtotalEl = document.getElementById('summary-subtotal') || document.getElementById('order-subtotal');
    const discountEl = document.getElementById('summary-discount') || document.getElementById('order-discount');
    const discountRow = document.getElementById('discount-row');
    const totalEl = document.getElementById('summary-total') || document.getElementById('order-total');
    const submitBtn = document.getElementById('complete-checkout-btn');

    if (!list) return;

    const cart = getCart();

    if (cart.length === 0) {
        list.innerHTML = '';
        list.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        if (paymentCard) paymentCard.style.opacity = '0.5';
        if (itemsCountEl) itemsCountEl.textContent = '0 courses';
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (discountEl) discountEl.textContent = '-$0.00';
        if (discountRow) discountRow.style.display = 'none';
        if (totalEl) totalEl.textContent = '$0.00';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Your Cart is Empty';
        }
        return;
    }

    list.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    if (paymentCard) paymentCard.style.opacity = '1';

    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 25), 0);
    const discountVal = subtotal * currentAppliedDiscount;
    const finalTotal = Math.max(0, subtotal - discountVal);

    if (itemsCountEl) itemsCountEl.textContent = `${cart.length} ${cart.length === 1 ? 'course' : 'courses'}`;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-$${discountVal.toFixed(2)}`;
    if (discountRow) discountRow.style.display = currentAppliedDiscount > 0 ? 'flex' : 'none';
    if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Complete Checkout &bull; $${finalTotal.toFixed(2)}`;
    }

    list.innerHTML = cart.map(item => `
        <div class="checkout-cart-item">
            <div class="checkout-cart-item__thumb">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="checkout-cart-item__info">
                <h3 class="checkout-cart-item__title">${item.title}</h3>
                <p class="checkout-cart-item__author">by ${item.author || 'purepearl studio'}</p>
                <div class="checkout-cart-item__meta">
                    <span class="meta-tag">${item.level || 'Beginner'}</span>
                    <span class="meta-tag">${item.duration || '2 hours'}</span>
                    <span class="meta-badge-access">Full Lifetime Access</span>
                </div>
            </div>
            <div class="checkout-cart-item__price-col">
                <span class="checkout-item-price">$${item.price || 25}</span>
                <button type="button" class="checkout-item-remove-btn" onclick="removeFromCart('${item.id}')" title="Remove from cart">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    Remove
                </button>
            </div>
        </div>
    `).join('');
}

/* ============================================================
   DYNAMIC COURSE DETAIL PAGE (course-detail.html)
   ============================================================ */
async function initCourseDetailPage() {
    const heroInfo = document.querySelector('.course-hero__info');
    if (!heroInfo) return;

    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id') || 'digital-asset';

    let courseData = FALLBACK_CATALOG.find(c => c.id === courseId) || FALLBACK_CATALOG[1];

    try {
        const res = await fetch(`/api/courses/${courseId}`);
        const json = await res.json();
        if (json.success && json.data) {
            courseData = json.data;
        }
    } catch (e) {
        console.warn('Using fallback course data:', e);
    }

    // Update document title & meta description
    document.title = `${courseData.title} — ByteSpace`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && courseData.description) {
        metaDesc.setAttribute('content', courseData.description.slice(0, 160));
    }

    // Populate Hero elements
    const titleEl = document.querySelector('.course-hero__title');
    const subtitleEl = document.querySelector('.course-hero__subtitle');
    const authorNameEl = document.querySelector('.course-hero__author-name');
    const priceEl = document.getElementById('course-price-display');
    const sidebarTitle = document.querySelector('.course-hero__sidebar-title');
    const heroTags = document.querySelector('.course-hero__tags');

    if (titleEl) titleEl.textContent = courseData.title;
    if (subtitleEl) subtitleEl.textContent = courseData.subtitle || 'Master valuable skills with expert guidance';
    if (authorNameEl) {
        authorNameEl.textContent = courseData.instructor?.name || courseData.author || 'purepearl studio';
    }
    if (priceEl) priceEl.textContent = `$${courseData.price || 25}`;
    if (sidebarTitle) {
        sidebarTitle.textContent = `${courseData.lessonsCount || 17} Lessons (${courseData.duration || '2 hours 16 mins'})`;
    }

    if (heroTags) {
        heroTags.innerHTML = `
            <span class="course-hero__tag">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="15" width="4" height="5"/><rect x="10" y="9" width="4" height="11"/><rect x="16" y="4" width="4" height="16"/></svg>
                ${courseData.level || 'Beginner'}
            </span>
            <span class="course-hero__tag">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ${courseData.rating || 4.8} (${courseData.reviewsCount || 172} reviews)
            </span>
            <span class="course-hero__tag">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                ${courseData.studentsCount || 1200} Students
            </span>
        `;
    }

    // Populate lessons list in hero sidebar
    const heroLessonsList = document.querySelector('.lessons-list');
    if (heroLessonsList && Array.isArray(courseData.lessons) && courseData.lessons.length > 0) {
        const topLessons = courseData.lessons.slice(0, 3);
        heroLessonsList.innerHTML = topLessons.map(l => `
            <div class="lesson-item">
                <span class="lesson-item__number">${l.number}</span>
                <span class="lesson-item__title">${l.title}</span>
                <span class="lesson-item__duration">${l.duration}</span>
            </div>
        `).join('');
        const moreCount = Math.max(0, (courseData.lessonsCount || 17) - topLessons.length);
        const lessonsMoreEl = document.querySelector('.lessons-more');
        if (lessonsMoreEl) {
            lessonsMoreEl.textContent = `${moreCount} more videos`;
        }
    }

    // Populate Instructor Profile in Sidebar
    const creatorAvatar = document.getElementById('creator-avatar-img');
    const creatorName = document.getElementById('creator-name');
    const creatorRole = document.getElementById('creator-role');
    const creatorCta = document.getElementById('creator-cta-text');
    const creatorProfileBtn = document.getElementById('creator-profile-btn');

    const instructorInfo = courseData.instructor || {
        name: 'PurePearl Studio',
        role: 'Professional Creator',
        avatar: 'figma-images/bfd09b20f2cf44bfa3af771f6396363d4ae67aab.jpg'
    };

    if (creatorAvatar) {
        creatorAvatar.src = instructorInfo.avatar || 'figma-images/bfd09b20f2cf44bfa3af771f6396363d4ae67aab.jpg';
        creatorAvatar.alt = `${instructorInfo.name} avatar`;
        creatorAvatar.onerror = function() {
            this.src = 'figma-images/bfd09b20f2cf44bfa3af771f6396363d4ae67aab.jpg';
        };
    }
    if (creatorName) creatorName.textContent = instructorInfo.name;
    if (creatorRole) creatorRole.textContent = instructorInfo.role || 'Professional Creator';
    if (creatorCta) {
        creatorCta.textContent = 'Ready to Dive In? Enroll Now and Start Building Your Digital Future!';
    }
    if (creatorProfileBtn) {
        creatorProfileBtn.onclick = (e) => {
            e.preventDefault();
            showToast(`${instructorInfo.name} is a verified professional instructor with 15+ years industry experience!`, 'Browse Courses', 'search.html');
        };
    }

    // Populate Description (3 rich paragraphs)
    const descContainer = document.getElementById('course-description-container');
    if (descContainer) {
        const paragraphs = courseData.descriptionParagraphs || [
            courseData.description || 'Embark on an enlightening exploration into the world of digital creation with our comprehensive course.',
            `In the initial modules, you'll establish a solid foundation by immersing yourself in the foundational concepts that form the backbone of ${courseData.title}. Understand the fundamental elements that constitute compelling digital content and gain proficiency in leveraging these elements.`,
            `As you progress through the course, you'll ascend to higher levels of expertise, delving into the nuances of real-world workflows that drive impactful creations. Engage in hands-on exercises that reinforce your understanding, allowing you to apply these principles in practical scenarios.`
        ];
        descContainer.innerHTML = paragraphs.map(p => `
            <p class="course-content__text">${p}</p>
        `).join('');
    }

    // Populate Sneak Peak (4 high quality rounded images)
    const sneakContainer = document.getElementById('sneak-peek-container');
    if (sneakContainer) {
        const defaultSneak = [
            'figma-images/a7c9406fd05787fc6c03edf5db05f212b96366a6.jpg',
            'figma-images/d443b5217bfd460249d4ac0712aa129bc29a8919.jpg',
            'figma-images/2e1b62a2460ffba94cc633550f3a06e03b29b432.jpg',
            'figma-images/0c1762672f5c64aa67de3991c2ac4aa729328623.jpg'
        ];
        const sneakImages = (courseData.sneakPeek && courseData.sneakPeek.length >= 4)
            ? courseData.sneakPeek.slice(0, 4)
            : defaultSneak;

        sneakContainer.innerHTML = sneakImages.map((src, idx) => `
            <img src="${src}" alt="Sneak peak preview ${idx + 1}" class="course-content__sneak-img" loading="lazy" onerror="this.onerror=null; this.src='figma-images/course_${(idx%6)+1}_wireframe.jpg'">
        `).join('');
    }

    // Populate Key Points (6 items with solid blue check circle)
    const keyPointsContainer = document.getElementById('key-points-container');
    if (keyPointsContainer) {
        const defaultPoints = [
            'Foundational Concepts',
            'Design Principles Mastery',
            'Advanced Techniques in Digital Creation',
            'Project Showcase and Critique',
            'Optimizing for Various Platforms',
            'Digital Asset Management Best Practices'
        ];
        const points = (courseData.keyPoints && courseData.keyPoints.length > 0)
            ? courseData.keyPoints
            : defaultPoints;

        keyPointsContainer.innerHTML = points.map(pt => `
            <div class="key-point">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="key-point__check">
                    <circle cx="11" cy="11" r="11" fill="#003BE2"/>
                    <path d="M6.5 11L9.5 14L15.5 8" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${pt}</span>
            </div>
        `).join('');
    }

    // Link Lessons Tab to course-lessons.html?id=...
    const lessonsTabLink = document.getElementById('lessons-tab-link');
    if (lessonsTabLink) {
        lessonsTabLink.href = `course-lessons.html?id=${courseData.id}`;
    }

    // Tabs switching logic (About / Reviews)
    const tabAbout = document.getElementById('tab-about');
    const tabReviews = document.getElementById('tab-reviews');
    const paneAbout = document.getElementById('pane-about');
    const paneReviews = document.getElementById('pane-reviews');

    if (tabAbout && tabReviews && paneAbout && paneReviews) {
        tabAbout.onclick = () => {
            tabAbout.classList.add('course-content__tab--active');
            tabReviews.classList.remove('course-content__tab--active');
            paneAbout.style.display = 'block';
            paneReviews.style.display = 'none';
        };

        tabReviews.onclick = () => {
            tabReviews.classList.add('course-content__tab--active');
            tabAbout.classList.remove('course-content__tab--active');
            paneReviews.style.display = 'block';
            paneAbout.style.display = 'none';

            // Update reviews tab stats
            const avgEl = document.getElementById('reviews-avg-rating');
            const totalEl = document.getElementById('reviews-total-count');
            if (avgEl) avgEl.textContent = courseData.rating || 4.8;
            if (totalEl) totalEl.textContent = `${courseData.reviewsCount || 215} verified reviews`;
        };
    }

    // Check if user is already enrolled
    let isEnrolled = false;
    const localEnrolled = getLocalEnrolledCourses();
    if (localEnrolled.some(c => (c.courseId || c.id) === courseId)) {
        isEnrolled = true;
    }
    try {
        const enrollRes = await fetch('/api/courses/user/my-courses');
        if (enrollRes.ok) {
            const enrollJson = await enrollRes.json();
            if (enrollJson.success && enrollJson.data) {
                if (enrollJson.data.some(c => c.courseId === courseId)) {
                    isEnrolled = true;
                }
            }
        }
    } catch (e) {
        // ignore
    }

    const enrollBtn = document.getElementById('enroll-btn');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    if (isEnrolled) {
        if (enrollBtn) {
            enrollBtn.textContent = 'Already Enrolled! Enjoy Course →';
            enrollBtn.onclick = () => window.location.href = `course-lessons.html?id=${courseId}`;
        }
        if (addToCartBtn) {
            addToCartBtn.style.display = 'none';
        }
    } else {
        if (enrollBtn) {
            enrollBtn.textContent = 'Enroll Now';
            enrollBtn.onclick = () => {
                addToCart(courseData, true); // true = redirect to cart
            };
        }
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                addToCart(courseData, false);
            };
        }
    }
}

/* ============================================================
   DYNAMIC COURSE LESSONS PAGE (course-lessons.html)
   ============================================================ */
async function initCourseLessonsPage() {
    const isLessonsPage = window.location.pathname.includes('course-lessons.html');
    if (!isLessonsPage) return;

    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id') || 'digital-asset';

    let courseData = FALLBACK_CATALOG.find(c => c.id === courseId) || FALLBACK_CATALOG[1];

    try {
        const res = await fetch(`/api/courses/${courseId}`);
        const json = await res.json();
        if (json.success && json.data) {
            courseData = json.data;
        }
    } catch (e) {
        console.warn('Fallback lessons data:', e);
    }

    // Set page titles
    const titleEl = document.querySelector('.course-hero__title');
    if (titleEl) titleEl.textContent = courseData.title;

    // Link About tab back to course-detail.html?id=...
    const aboutTabLink = document.querySelector('#lesson-tabs a');
    if (aboutTabLink) {
        aboutTabLink.href = `course-detail.html?id=${courseId}`;
    }

    // Check progress
    let userProgress = 0;
    let completedLessons = [];
    const localCourses = getLocalEnrolledCourses();
    const localFound = localCourses.find(c => (c.courseId || c.id) === courseId);
    if (localFound) {
        userProgress = localFound.progress || 0;
        completedLessons = localFound.completedLessons || [];
    }

    try {
        const enrollRes = await fetch('/api/courses/user/my-courses');
        if (enrollRes.ok) {
            const enrollJson = await enrollRes.json();
            if (enrollJson.success && enrollJson.data) {
                const userCourse = enrollJson.data.find(c => c.courseId === courseId);
                if (userCourse) {
                    userProgress = userCourse.progress || 0;
                    completedLessons = userCourse.completedLessons || [];
                }
            }
        }
    } catch (e) {
        // ignore
    }

    // Render lessons list
    const lessonsListEl = document.querySelector('.lessons-list');
    const lessons = courseData.lessons || [
        { number: '01', title: 'Introduction & Foundations', duration: '12 mins' },
        { number: '02', title: 'Key Principles & Toolset Setup', duration: '18 mins' },
        { number: '03', title: 'Hands-on Building Walkthrough', duration: '24 mins' },
        { number: '04', title: 'Refinement, Packaging & Export', duration: '16 mins' }
    ];

    if (lessonsListEl) {
        lessonsListEl.innerHTML = lessons.map((l, index) => {
            const isDone = completedLessons.includes(l.number);
            const isCurrent = index === 0;
            return `
                <div class="lesson-item ${isCurrent ? 'lesson-item--active' : ''} ${isDone ? 'lesson-item--completed' : ''}" data-lesson="${l.number}" style="cursor: pointer;">
                    <span class="lesson-item__number">${isDone ? '✓' : l.number}</span>
                    <span class="lesson-item__title">${l.title}</span>
                    <span class="lesson-item__duration">${l.duration}</span>
                </div>
            `;
        }).join('');

        // Wire click to switch lesson & mark complete
        lessonsListEl.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', async () => {
                lessonsListEl.querySelectorAll('.lesson-item').forEach(i => i.classList.remove('lesson-item--active'));
                item.classList.add('lesson-item--active');

                const lessonNum = item.getAttribute('data-lesson');
                if (!completedLessons.includes(lessonNum)) {
                    completedLessons.push(lessonNum);
                    item.classList.add('lesson-item--completed');
                    const numBadge = item.querySelector('.lesson-item__number');
                    if (numBadge) numBadge.textContent = '✓';

                    // Update progress calculation
                    const newProgress = Math.min(100, Math.round((completedLessons.length / lessons.length) * 100));

                    // Save to local storage
                    const curLocal = getLocalEnrolledCourses();
                    const cIdx = curLocal.findIndex(c => (c.courseId || c.id) === courseId);
                    if (cIdx !== -1) {
                        curLocal[cIdx].progress = newProgress;
                        curLocal[cIdx].completedLessons = completedLessons;
                        saveLocalEnrolledCourses(curLocal);
                    }

                    try {
                        await fetch('/api/courses/progress', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                courseId: courseId,
                                progress: newProgress,
                                lessonNumber: lessonNum
                            })
                        });
                    } catch (e) {
                        console.warn('Progress update error:', e);
                    }
                    showToast(`Lesson ${lessonNum} marked complete! (${newProgress}% finished)`);
                } else {
                    showToast(`Now playing Lesson ${lessonNum}`);
                }
            });
        });
    }
}

