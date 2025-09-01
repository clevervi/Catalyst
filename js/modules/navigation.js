/**
 * Navigation Module for Catalyst HR System
 * Provides unified navigation bar and footer functionality
 */

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
                        <li><a class="dropdown-item" href="__PAGES_PATH__jobs.html" data-page="jobs"><i class="fas fa-briefcase me-1"></i> Job Board</a></li>
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
                        <li><a class="dropdown-item" href="__PAGES_PATH__capacitaciones.html" data-page="capacitaciones"><i class="fas fa-book me-1"></i> Browse Courses</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__mis-cursos.html" data-auth="required"><i class="fas fa-user-graduate me-1"></i> My Courses</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__certificados.html" data-auth="required"><i class="fas fa-certificate me-1"></i> Certificates</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="__PAGES_PATH__clanes.html?fromNav=true" data-page="clanes">
                        <i class="fas fa-users-cog me-1"></i> Portfolios
                    </a>
                </li>
                <li class="nav-item dropdown" data-role="bank_representative">
                    <a class="nav-link dropdown-toggle" href="#" id="bankDropdown" role="button" data-bs-toggle="dropdown">
                        <i class="fas fa-university me-1"></i> Banking Services
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="__PAGES_PATH__financial-services.html" data-page="financial-services"><i class="fas fa-chart-line me-1"></i> Financial Services</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__banking-dashboard.html" data-page="banking-dashboard"><i class="fas fa-tachometer-alt me-1"></i> Banking Dashboard</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__loan-applications.html" data-page="loan-applications"><i class="fas fa-file-invoice-dollar me-1"></i> Loan Applications</a></li>
                    </ul>
                </li>
                <li class="nav-item dropdown" data-role="talentos_humanos,administrador">
                    <a class="nav-link dropdown-toggle" href="#" id="hrDropdown" role="button" data-bs-toggle="dropdown">
                        <i class="fas fa-users me-1"></i> HR Management
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="__PAGES_PATH__hiring-dashboard.html" data-page="hiring-dashboard"><i class="fas fa-chart-line me-1"></i> Dashboard</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__admin-dashboard.html" data-page="admin-dashboard"><i class="fas fa-tasks me-1"></i> Admin Panel</a></li>
                        <li><a class="dropdown-item" href="__PAGES_PATH__gestion-usuarios.html" data-page="gestion-usuarios"><i class="fas fa-user-cog me-1"></i> User Management</a></li>
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
                </ul>
            </div>
            <div class="col-md-4 col-lg-2 mb-4 mb-md-0">
                <h5 class="footer-title">For Companies</h5>
                <ul class="footer-links">
                    <li><a href="__PAGES_PATH__hiring-dashboard.html">Post Jobs</a></li>
                    <li><a href="__PAGES_PATH__admin-dashboard.html" data-role="talentos_humanos,administrador">Search Candidates</a></li>
                    <li><a href="__PAGES_PATH__empresas.html">Corporate Solutions</a></li>
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
                <a href="__PAGES_PATH__cookies.html" class="text-white small">Cookies Policy</a>
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
    
    // Update auth UI with simple logic since guards might not be available
    updateNavigationAuth();
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
                // Show success notification
                showToast('¡Gracias por suscribirte! Te enviaremos las últimas noticias.', 'success');
                emailInput.value = '';
            }
        });
    }
    
    // Handle navigation clicks
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
        if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', (e) => {
                // Add loading state
                const href = e.target.getAttribute('href');
                if (href) {
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
    // Try to get user data from localStorage if not provided
    if (!userData && !isAuthenticated) {
        const storedUser = localStorage.getItem('currentUser');
        const storedAuth = localStorage.getItem('isAuthenticated');
        
        if (storedUser && storedAuth === 'true') {
            try {
                userData = JSON.parse(storedUser);
                isAuthenticated = true;
            } catch (e) {
                console.warn('Error parsing stored user data:', e);
            }
        }
    }
    
    const authButtonsContainer = document.getElementById('auth-buttons');
    if (!authButtonsContainer) return;
    
    // Determine if we're in a subfolder
    const isInSubfolder = window.location.pathname.includes('/pages/');
    const pagesPath = isInSubfolder ? '' : 'pages/';
    const indexPath = isInSubfolder ? '../index.html' : 'index.html';
    
    if (isAuthenticated && userData) {
        // User is logged in
        const roleBadge = userData.role ? `<span class="role-badge ${userData.role} ms-2">${userData.role}</span>` : '';
        
        authButtonsContainer.innerHTML = `
            <div class="dropdown me-2">
                <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-2"></i>
                    <span>${userData.name || 'User'}</span>
                    ${roleBadge}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="${pagesPath}perfil.html"><i class="fas fa-user me-2"></i> My Profile</a></li>
                    <li><a class="dropdown-item" href="${pagesPath}mis-cursos.html"><i class="fas fa-graduation-cap me-2"></i> My Courses</a></li>
                    <li><a class="dropdown-item" href="${pagesPath}favoritos.html"><i class="fas fa-heart me-2"></i> Favorites</a></li>
                    <li><a class="dropdown-item" href="${pagesPath}configuracion.html"><i class="fas fa-cog me-2"></i> Settings</a></li>
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
                // Clear authentication data
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isAuthenticated');
                showToast('Sesión cerrada exitosamente', 'info');
                setTimeout(() => {
                    window.location.href = indexPath;
                }, 1000);
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
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info, warning)
 */
export function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div class="toast" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-${type} text-white">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' :
                    'fa-info-circle'
                } me-2"></i>
                <strong class="me-auto">Notification</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Initialize and show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
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
        
        .navbar .nav-link.active {
            position: relative;
        }
        
        .navbar .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 1rem;
            right: 1rem;
            height: 2px;
            background-color: var(--accent);
            border-radius: 2px;
        }
    `;
    
    document.head.appendChild(styles);
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        addNavigationStyles();
    });
}
