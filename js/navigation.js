/**
 * Navigation Module for Catalyst HR System
 * Provides unified navigation bar and footer functionality
 */

import { getCurrentUser, guardNavigation, createRoleBadge } from './guards.js';
import { ROLES } from './roles.js';

// Navigation HTML template
export const navigationHTML = `
<nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background: linear-gradient(135deg, var(--primary-dark), var(--primary));">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="__INDEX_PATH__">
            <img src="__IMG_PATH__image.png" alt="Catalyst HR System" height="32" class="me-2" loading="lazy">
            <span class="fw-bold">Catalyst</span>
            <small class="ms-2 opacity-75">HR System</small>
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
            <!-- Main Navigation -->
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="__INDEX_PATH__" data-page="index">
                        <i class="fas fa-home me-1"></i> Home
                    </a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="jobsDropdown" role="button" data-bs-toggle="dropdown">
                        <i class="fas fa-briefcase me-1"></i> Jobs
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="__PAGES_PATH__empleos.html" data-page="empleos"><i class="fas fa-search me-1"></i> Search Jobs</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__empresas.html" data-page="empresas"><i class="fas fa-building me-1"></i> Companies</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__job-management.html" data-role="hiring_manager,talentos_humanos,administrador"><i class="fas fa-plus me-1"></i> Post Job</a></li>
                    </ul>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="trainingDropdown" role="button" data-bs-toggle="dropdown">
                        <i class="fas fa-graduation-cap me-1"></i> Training
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="__PAGES_PATH__training-enhanced.html?fromNav=true" data-page="training"><i class="fas fa-graduation-cap me-1"></i> Training Platform</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__capacitaciones.html" data-page="capacitaciones"><i class="fas fa-book me-1"></i> Browse Courses</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__mis-cursos.html" data-auth="required"><i class="fas fa-user-graduate me-1"></i> My Courses</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__certificados.html" data-auth="required"><i class="fas fa-certificate me-1"></i> Certificates</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="__PAGES_PATH__clanes.html" data-page="clanes">
                        <i class="fas fa-users-cog me-1"></i> Teams
                    </a>
                </li>
                <li class="nav-item dropdown" data-role="talentos_humanos,administrador">
                    <a class="nav-link dropdown-toggle" href="#" id="hrDropdown" role="button" data-bs-toggle="dropdown">
                        <i class="fas fa-users me-1"></i> Human Resources
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="__PAGES_PATH__resume-database.html" data-page="resume-database"><i class="fas fa-database me-1"></i> Resume Database</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__hiring-dashboard.html" data-page="hiring-dashboard"><i class="fas fa-chart-line me-1"></i> Dashboard</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__kanban.html" data-page="kanban"><i class="fas fa-tasks me-1"></i> Candidate Pipeline</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__reports.html" data-page="reports"><i class="fas fa-chart-bar me-1"></i> Reports</a></li>
                    </ul>
                </li>
            </ul>
            
            <!-- Authentication Buttons -->
            <div class="d-flex align-items-center" id="auth-buttons">
                <!-- Dynamic content loaded by JavaScript -->
            </div>
        </div>
    </div>
</nav>
`;

// Footer HTML template
export const footerHTML = `
<footer class="footer py-5 bg-primary-dark text-white">
    <div class="container">
        <div class="row">
            <div class="col-lg-4 mb-5 mb-lg-0">
                <div class="footer-brand mb-4">
                    <img src="__IMG_PATH__image.png" alt="Catalyst" height="40" loading="lazy">
                </div>
                <p class="mb-4">
                    Catalyst is the leading platform in Colombia to connect technology professionals with the best job opportunities.
                </p>
                <div class="social-icons">
                    <a href="#" class="social-icon" aria-label="Facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="social-icon" aria-label="Twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" class="social-icon" aria-label="LinkedIn">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" class="social-icon" aria-label="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-4 mb-md-0">
                <h5 class="footer-title">For Professionals</h5>
                <ul class="footer-links">
                    <li><a href="__PAGES_PATH__empleos.html">Search Jobs</a></li>
                    <li><a href="__PAGES_PATH__perfil.html">My Profile</a></li>
                    <li><a href="__PAGES_PATH__alertas.html">Job Alerts</a></li>
                    <li><a href="__PAGES_PATH__capacitaciones.html">Training</a></li>
                    <li><a href="__PAGES_PATH__recursos.html">Resources</a></li>
                </ul>
            </div>
            <div class="col-md-4 col-lg-2 mb-4 mb-md-0">
                <h5 class="footer-title">For Companies</h5>
                <ul class="footer-links">
                    <li><a href="__PAGES_PATH__job-management.html">Post Jobs</a></li>
                    <li><a href="__PAGES_PATH__resume-database.html" data-role="talentos_humanos,administrador">Search Candidates</a></li>
                    <li><a href="__PAGES_PATH__empresas.html">Corporate Solutions</a></li>
                    <li><a href="__PAGES_PATH__metrics.html" data-role="administrador,manager">Metrics</a></li>
                </ul>
            </div>
            <div class="col-md-4 col-lg-4">
                <h5 class="footer-title">Subscribe to our Newsletter</h5>
                <p class="mb-3">Get the latest job offers and tech industry news directly in your email.</p>
                <form class="mb-3" id="newsletter-form">
                    <div class="input-group">
                        <input type="email" class="form-control" placeholder="Your email address" aria-label="Email" required>
                        <button class="btn btn-accent" type="submit">Subscribe</button>
                    </div>
                </form>
            </div>
        </div>
        <hr class="my-4 bg-primary-light">
        <div class="row">
            <div class="col-md-6">
                <p class="mb-0 small">&copy; 2024 Catalyst. All rights reserved.</p>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="__PAGES_PATH__terminos.html" class="text-white small me-3">Terms & Conditions</a>
                <a href="__PAGES_PATH__privacidad.html" class="text-white small me-3">Privacy Policy</a>
                <a href="__PAGES_PATH__cookies.html" class="text-white small">Cookies</a>
            </div>
        </div>
    </div>
</footer>
`;

/**
 * Initialize navigation for a specific page
 * @param {string} currentPage - Current page identifier
 * @param {boolean} isInSubfolder - Whether the page is in a subfolder
 */
export function initNavigation(currentPage = '', isInSubfolder = false) {
    // Determine paths based on location
    const indexPath = isInSubfolder ? '../index.html' : 'index.html';
    const pagesPath = isInSubfolder ? '' : 'pages/';
    const imgPath = isInSubfolder ? '../img/' : 'img/';
    
    // Create navigation container
    let navContainer = document.getElementById('navigation-container');
    if (!navContainer) {
        navContainer = document.createElement('div');
        navContainer.id = 'navigation-container';
        document.body.insertBefore(navContainer, document.body.firstChild);
    }
    
    // Insert navigation HTML with correct paths
    navContainer.innerHTML = navigationHTML
        .replace(/__INDEX_PATH__/g, indexPath)
        .replace(/__PAGES_PATH__/g, pagesPath)
        .replace(/__IMG_PATH__/g, imgPath);
    
    // Create footer container
    let footerContainer = document.getElementById('footer-container');
    if (!footerContainer) {
        footerContainer = document.createElement('div');
        footerContainer.id = 'footer-container';
        document.body.appendChild(footerContainer);
    }
    
    // Insert footer HTML with correct paths
    footerContainer.innerHTML = footerHTML
        .replace(/__PAGES_PATH__/g, pagesPath)
        .replace(/__IMG_PATH__/g, imgPath);
    
    // Set active navigation item
    if (currentPage) {
        const activeNavItem = document.querySelector(`[data-page="${currentPage}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }
    
    // Initialize navigation behaviors
    initNavigationBehaviors();
    
    // Apply role-based guards to navigation
    setTimeout(() => {
        guardNavigation();
        
        // Update auth UI
        const user = getCurrentUser();
        const isAuthenticated = !!user;
        
        if (isAuthenticated && user) {
            updateNavigationAuth(user, isAuthenticated);
        } else {
            updateNavigationAuth(null, false);
        }
    }, 100);
}

/**
 * Initialize navigation behaviors and event listeners
 */
function initNavigationBehaviors() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = e.target.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert('Thank you for subscribing! We\'ll send you the latest news.');
                emailInput.value = '';
            }
        });
    }
    
    // Handle navigation clicks for SPA behavior (optional)
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
        if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', (e) => {
                // Add loading state or transition effects here if needed
                const href = e.target.getAttribute('href');
                if (href) {
                    // Optional: Add page transition effects
                    document.body.classList.add('page-transitioning');
                }
            });
        }
    });
}

/**
 * Update authentication buttons in navigation
 * @param {Object} userData - User data object
 * @param {boolean} isAuthenticated - Whether user is authenticated
 */
export function updateNavigationAuth(userData = null, isAuthenticated = false) {
    const authButtonsContainer = document.getElementById('auth-buttons');
    if (!authButtonsContainer) return;
    
    // Determine if we're in a subfolder
    const isInSubfolder = window.location.pathname.includes('/pages/');
    const pagesPath = isInSubfolder ? '' : 'pages/';
    const indexPath = isInSubfolder ? '../index.html' : 'index.html';
    
    if (isAuthenticated && userData) {
        // Get role information for display
        const userName = userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}` 
            : userData.name || 'User';
        
        const roleBadge = createRoleBadge(userData.role);
        
        // User is logged in
        authButtonsContainer.innerHTML = `
            <div class="dropdown me-2">
                <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-2"></i>
                    <span>${userName}</span>
                    ${roleBadge}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li class="dropdown-header">
                        <small class="text-muted">${userData.email}</small><br>
                        <small class="text-muted">${userData.title || userData.role}</small>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="${pagesPath}perfil.html"><i class="fas fa-user me-2"></i> My Profile</a></li>
                    <li><a class="dropdown-item" href="${pagesPath}mis-cursos.html"><i class="fas fa-graduation-cap me-2"></i> My Courses</a></li>
                    <li><a class="dropdown-item" href="${pagesPath}favoritos.html"><i class="fas fa-heart me-2"></i> Favorites</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logout-btn"><i class="fas fa-sign-out-alt me-2"></i> Sign Out</a></li>
                </ul>
            </div>
        `;
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Call logout function if available
                if (typeof logout === 'function') {
                    logout();
                } else {
                    localStorage.removeItem('userData');
                    localStorage.removeItem('isAuthenticated');
                    window.location.href = indexPath;
                }
            });
        }
    } else {
        // User is not logged in
        authButtonsContainer.innerHTML = `
            <a href="${pagesPath}login.html" class="btn btn-outline-light me-2">
                <i class="fas fa-sign-in-alt me-1"></i> Sign In
            </a>
            <a href="${pagesPath}register.html" class="btn btn-accent">
                <i class="fas fa-user-plus me-1"></i> Register
            </a>
        `;
    }
}

/**
 * Add page-specific styles for navigation
 */
export function addNavigationStyles() {
    if (document.getElementById('navigation-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'navigation-styles';
    styles.textContent = `
        /* Navigation additional styles */
        .page-transitioning {
            opacity: 0.9;
            transition: opacity 0.2s ease;
        }
        
        .navbar.scrolled {
            padding: 0.5rem 0;
            box-shadow: var(--shadow-sm);
            background-color: rgba(30, 64, 175, 0.95) !important;
            backdrop-filter: blur(10px);
        }
        
        .navbar .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 1rem;
            right: 1rem;
            height: 2px;
            background-color: var(--accent);
            border-radius: 2px;
        }
        
        /* Footer social icons */
        .social-icons {
            display: flex;
            gap: 1rem;
        }
        
        .social-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            background-color: var(--accent);
            color: white;
            transform: translateY(-2px);
        }
        
        .footer-links {
            list-style: none;
            padding: 0;
        }
        
        .footer-links li {
            margin-bottom: 0.5rem;
        }
        
        .footer-links a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: var(--accent-light);
        }
        
        .footer-title {
            color: white;
            font-weight: 600;
            margin-bottom: 1.5rem;
        }
    `;
    
    document.head.appendChild(styles);
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    // Add styles when module loads
    document.addEventListener('DOMContentLoaded', () => {
        addNavigationStyles();
    });
}
