/**
 * Routing System for Catalyst HR System
 * Handles page navigation with role-based access control
 */

import { ROLES } from './roles.js';
import { 
    getCurrentUser, 
    canAccessPage, 
    redirectWithAuth,
    createAccessDeniedContent,
    showAuthLoading,
    hideAuthLoading
} from './guards.js';
import { showToast } from './ui.js';

// Route configuration with access control
export const ROUTES = {
    // Public routes
    '/': { 
        page: 'index.html', 
        title: 'Catalyst HR System', 
        access: 'public' 
    },
    '/empleos': { 
        page: 'empleos.html', 
        title: 'Buscar Empleos', 
        access: 'public' 
    },
    '/empresas': { 
        page: 'empresas.html', 
        title: 'Empresas', 
        access: 'public' 
    },
    '/capacitaciones': { 
        page: 'capacitaciones.html', 
        title: 'Capacitaciones', 
        access: 'public' 
    },
    '/login': { 
        page: 'login.html', 
        title: 'Iniciar Sesión', 
        access: 'public' 
    },
    '/register': { 
        page: 'register.html', 
        title: 'Registrarse', 
        access: 'public' 
    },
    '/detalles-empleo': { 
        page: 'detalles-empleo.html', 
        title: 'Detalles del Empleo', 
        access: 'public' 
    },
    '/detalles-curso': { 
        page: 'detalles-curso.html', 
        title: 'Detalles del Curso', 
        access: 'public' 
    },
    
    // Authentication required routes
    '/perfil': { 
        page: 'perfil.html', 
        title: 'Mi Perfil', 
        access: 'auth' 
    },
    '/mis-cursos': { 
        page: 'mis-cursos.html', 
        title: 'Mis Cursos', 
        access: 'auth' 
    },
    '/certificados': { 
        page: 'certificados.html', 
        title: 'Mis Certificados', 
        access: 'auth' 
    },
    '/favoritos': { 
        page: 'favoritos.html', 
        title: 'Empleos Favoritos', 
        access: 'auth' 
    },
    '/alertas': { 
        page: 'alertas.html', 
        title: 'Alertas de Empleo', 
        access: 'auth' 
    },
    '/publicar-cv': { 
        page: 'publicar-cv.html', 
        title: 'Publicar CV', 
        access: 'auth' 
    },
    
    // Admin routes
    '/admin': { 
        page: 'admin-dashboard.html', 
        title: 'Panel Administrativo', 
        access: 'role',
        roles: [ROLES.ADMIN]
    },
    '/admin-dashboard': { 
        page: 'admin-dashboard.html', 
        title: 'Dashboard Admin', 
        access: 'role',
        roles: [ROLES.ADMIN]
    },
    '/gestion-usuarios': { 
        page: 'gestion-usuarios.html', 
        title: 'Gestión de Usuarios', 
        access: 'role',
        roles: [ROLES.ADMIN]
    },
    '/user-management': { 
        page: 'user-management.html', 
        title: 'Gestión de Usuarios', 
        access: 'role',
        roles: [ROLES.ADMIN]
    },
    '/roles': { 
        page: 'roles.html', 
        title: 'Gestión de Roles', 
        access: 'role',
        roles: [ROLES.ADMIN]
    },
    
    // HR & Recruitment routes
    '/hiring-dashboard': { 
        page: 'hiring-dashboard.html', 
        title: 'Dashboard de Contratación', 
        access: 'role',
        roles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER]
    },
    '/kanban': { 
        page: 'kanban.html', 
        title: 'Pipeline de Candidatos', 
        access: 'role',
        roles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER]
    },
    '/resume-database': { 
        page: 'resume-database.html', 
        title: 'Base de Datos CV', 
        access: 'role',
        roles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER, ROLES.MANAGER]
    },
    '/job-management': { 
        page: 'job-management.html', 
        title: 'Gestión de Empleos', 
        access: 'role',
        roles: [ROLES.ADMIN, ROLES.RECRUITER]
    },
    
    // Metrics & Reports routes
    '/metrics': { 
        page: 'metrics.html', 
        title: 'Métricas', 
        access: 'role',
        roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BANK_REPRESENTATIVE]
    },
    '/reports': { 
        page: 'reports.html', 
        title: 'Reportes', 
        access: 'role',
        roles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER, ROLES.MANAGER, ROLES.BANK_REPRESENTATIVE]
    },
    
    // Information pages
    '/recursos': { 
        page: 'recursos.html', 
        title: 'Recursos', 
        access: 'public' 
    },
    '/soluciones': { 
        page: 'soluciones.html', 
        title: 'Soluciones Corporativas', 
        access: 'public' 
    },
    '/precios': { 
        page: 'precios.html', 
        title: 'Precios', 
        access: 'public' 
    },
    '/terminos': { 
        page: 'terminos.html', 
        title: 'Términos y Condiciones', 
        access: 'public' 
    },
    '/privacidad': { 
        page: 'privacidad.html', 
        title: 'Política de Privacidad', 
        access: 'public' 
    },
    '/cookies': { 
        page: 'cookies.html', 
        title: 'Política de Cookies', 
        access: 'public' 
    }
};

/**
 * Navigate to a route with access control
 * @param {string} route - Route to navigate to
 * @param {Object} options - Navigation options
 */
export function navigateTo(route, options = {}) {
    const routeConfig = ROUTES[route];
    
    if (!routeConfig) {
        console.error(`Route ${route} not found`);
        showToast('Página no encontrada', 'error');
        return;
    }
    
    const user = getCurrentUser();
    const { page, access, roles = [] } = routeConfig;
    
    // Check access permissions
    let hasAccess = false;
    
    switch (access) {
        case 'public':
            hasAccess = true;
            break;
        case 'auth':
            hasAccess = !!user;
            break;
        case 'role':
            hasAccess = user && roles.includes(user.role);
            break;
        default:
            hasAccess = false;
    }
    
    if (!hasAccess) {
        if (!user && access !== 'public') {
            // Redirect to login with return URL
            const returnUrl = encodeURIComponent(window.location.href);
            window.location.href = `pages/login.html?returnUrl=${returnUrl}`;
        } else {
            showToast('No tienes permisos para acceder a esta página', 'error');
        }
        return;
    }
    
    // Navigate to page
    const targetUrl = options.basePath ? `${options.basePath}pages/${page}` : `pages/${page}`;
    window.location.href = targetUrl;
}

/**
 * Get current page name from URL
 * @returns {string} Current page name
 */
export function getCurrentPageName() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop();
    return pageName || 'index.html';
}

/**
 * Check if current user can access current page
 * @returns {boolean} Whether user has access
 */
export function validateCurrentPageAccess() {
    const currentPage = getCurrentPageName();
    return canAccessPage(currentPage);
}

/**
 * Initialize routing for the application
 * @param {Object} options - Routing options
 */
export function initializeRouting(options = {}) {
    const currentPage = getCurrentPageName();
    const user = getCurrentUser();
    
    // Set page title based on route
    const route = Object.values(ROUTES).find(r => r.page === currentPage);
    if (route) {
        document.title = `${route.title} - Catalyst HR System`;
    }
    
    // Validate access to current page
    if (!validateCurrentPageAccess()) {
        handleUnauthorizedAccess(currentPage, user, options);
        return;
    }
    
    // Initialize navigation guards
    initializeNavigationGuards();
    
    // Handle authenticated user redirects
    if (currentPage === 'login.html' && user) {
        // Already logged in, redirect to appropriate dashboard
        setTimeout(() => {
            redirectToUserDashboard(user);
        }, 1000);
    }
}

/**
 * Handle unauthorized access attempt
 * @param {string} currentPage - Current page name
 * @param {Object} user - User object
 * @param {Object} options - Routing options
 */
function handleUnauthorizedAccess(currentPage, user, options) {
    const isInSubfolder = window.location.pathname.includes('/pages/');
    const basePath = isInSubfolder ? '../' : '';
    
    if (!user) {
        // Not authenticated
        showToast('Debes iniciar sesión para acceder a esta página', 'warning');
        const returnUrl = encodeURIComponent(window.location.href);
        setTimeout(() => {
            window.location.href = `${basePath}pages/login.html?returnUrl=${returnUrl}`;
        }, 1500);
    } else {
        // Authenticated but no permissions
        showToast('No tienes permisos para acceder a esta página', 'error');
        setTimeout(() => {
            redirectToUserDashboard(user, basePath);
        }, 1500);
    }
}

/**
 * Redirect user to their appropriate dashboard
 * @param {Object} user - User object
 * @param {string} basePath - Base path for URLs
 */
function redirectToUserDashboard(user, basePath = '') {
    switch (user.role) {
        case ROLES.ADMIN:
            window.location.href = `${basePath}pages/admin-dashboard.html`;
            break;
        case ROLES.RECRUITER:
        case ROLES.HIRING_MANAGER:
            window.location.href = `${basePath}pages/hiring-dashboard.html`;
            break;
        case ROLES.MANAGER:
            window.location.href = `${basePath}pages/metrics.html`;
            break;
        default:
            window.location.href = `${basePath}index.html`;
    }
}

/**
 * Initialize navigation guards for links
 */
function initializeNavigationGuards() {
    // Guard all navigation links with role requirements
    document.querySelectorAll('a[data-role]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const requiredRoles = link.getAttribute('data-role').split(',').map(r => r.trim());
            const user = getCurrentUser();
            
            if (!user || !requiredRoles.includes(user.role)) {
                showToast('No tienes permisos para acceder a esta sección', 'error');
                return;
            }
            
            // Allow navigation
            window.location.href = link.getAttribute('href');
        });
    });
    
    // Guard auth-required links
    document.querySelectorAll('a[data-auth="required"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const user = getCurrentUser();
            
            if (!user) {
                showToast('Debes iniciar sesión para acceder a esta sección', 'warning');
                const returnUrl = encodeURIComponent(window.location.href);
                setTimeout(() => {
                    window.location.href = `pages/login.html?returnUrl=${returnUrl}`;
                }, 1000);
                return;
            }
            
            // Allow navigation
            window.location.href = link.getAttribute('href');
        });
    });
}

/**
 * Create breadcrumb navigation
 * @param {Array} items - Breadcrumb items
 * @returns {string} HTML for breadcrumb
 */
export function createBreadcrumb(items) {
    const breadcrumbItems = items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        if (isLast) {
            return `<li class="breadcrumb-item active" aria-current="page">${item.title}</li>`;
        } else {
            return `<li class="breadcrumb-item">
                <a href="${item.href}" class="text-decoration-none">${item.title}</a>
            </li>`;
        }
    }).join('');
    
    return `
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                ${breadcrumbItems}
            </ol>
        </nav>
    `;
}

/**
 * Get breadcrumb for current page
 * @param {string} currentPage - Current page name
 * @returns {Array} Breadcrumb items
 */
export function getBreadcrumbForPage(currentPage) {
    const baseBreadcrumb = [{ title: 'Inicio', href: '../index.html' }];
    
    const breadcrumbMap = {
        'empleos.html': [...baseBreadcrumb, { title: 'Empleos' }],
        'detalles-empleo.html': [...baseBreadcrumb, 
            { title: 'Empleos', href: 'empleos.html' },
            { title: 'Detalles del Empleo' }
        ],
        'empresas.html': [...baseBreadcrumb, { title: 'Empresas' }],
        'capacitaciones.html': [...baseBreadcrumb, { title: 'Capacitaciones' }],
        'detalles-curso.html': [...baseBreadcrumb, 
            { title: 'Capacitaciones', href: 'capacitaciones.html' },
            { title: 'Detalles del Curso' }
        ],
        'perfil.html': [...baseBreadcrumb, { title: 'Mi Perfil' }],
        'mis-cursos.html': [...baseBreadcrumb, { title: 'Mis Cursos' }],
        'certificados.html': [...baseBreadcrumb, { title: 'Mis Certificados' }],
        'favoritos.html': [...baseBreadcrumb, { title: 'Empleos Favoritos' }],
        'alertas.html': [...baseBreadcrumb, { title: 'Alertas de Empleo' }],
        
        // Admin pages
        'admin-dashboard.html': [...baseBreadcrumb, { title: 'Panel Admin' }],
        'gestion-usuarios.html': [...baseBreadcrumb, 
            { title: 'Panel Admin', href: 'admin-dashboard.html' },
            { title: 'Gestión de Usuarios' }
        ],
        'roles.html': [...baseBreadcrumb, 
            { title: 'Panel Admin', href: 'admin-dashboard.html' },
            { title: 'Gestión de Roles' }
        ],
        
        // HR pages
        'hiring-dashboard.html': [...baseBreadcrumb, { title: 'Dashboard RH' }],
        'kanban.html': [...baseBreadcrumb, 
            { title: 'Dashboard RH', href: 'hiring-dashboard.html' },
            { title: 'Pipeline de Candidatos' }
        ],
        'resume-database.html': [...baseBreadcrumb, { title: 'Base de Datos CV' }],
        'job-management.html': [...baseBreadcrumb, { title: 'Gestión de Empleos' }],
        'reports.html': [...baseBreadcrumb, { title: 'Reportes' }],
        'metrics.html': [...baseBreadcrumb, { title: 'Métricas' }]
    };
    
    return breadcrumbMap[currentPage] || baseBreadcrumb;
}

/**
 * Initialize page routing and guards
 * @param {string} currentPage - Current page name
 * @param {Object} options - Initialization options
 */
export function initPageRouting(currentPage, options = {}) {
    const {
        showBreadcrumb = false,
        breadcrumbContainer = '.breadcrumb-container',
        customBreadcrumb = null
    } = options;
    
    // Initialize routing
    initializeRouting(options);
    
    // Add breadcrumb if requested
    if (showBreadcrumb) {
        const breadcrumbItems = customBreadcrumb || getBreadcrumbForPage(currentPage);
        const breadcrumbHTML = createBreadcrumb(breadcrumbItems);
        
        const container = document.querySelector(breadcrumbContainer);
        if (container) {
            container.innerHTML = breadcrumbHTML;
        } else {
            // Create breadcrumb container after main content
            const mainContent = document.querySelector('.main-content') || document.querySelector('.container');
            if (mainContent) {
                const breadcrumbDiv = document.createElement('div');
                breadcrumbDiv.className = 'container mt-4';
                breadcrumbDiv.innerHTML = breadcrumbHTML;
                mainContent.parentNode.insertBefore(breadcrumbDiv, mainContent);
            }
        }
    }
}

/**
 * Handle SPA-style navigation (optional)
 * @param {string} route - Route to navigate to
 * @param {Object} options - Navigation options
 */
export function handleSPANavigation(route, options = {}) {
    const routeConfig = ROUTES[route];
    
    if (!routeConfig) {
        console.error(`Route ${route} not found`);
        return;
    }
    
    // Check access
    const user = getCurrentUser();
    let hasAccess = false;
    
    switch (routeConfig.access) {
        case 'public':
            hasAccess = true;
            break;
        case 'auth':
            hasAccess = !!user;
            break;
        case 'role':
            hasAccess = user && routeConfig.roles.includes(user.role);
            break;
    }
    
    if (!hasAccess) {
        handleUnauthorizedAccess(routeConfig.page, user, options);
        return;
    }
    
    // Update URL and title
    if (options.updateHistory !== false) {
        history.pushState({ route }, routeConfig.title, route);
        document.title = `${routeConfig.title} - Catalyst HR System`;
    }
    
    // Load page content (if implementing SPA)
    if (options.loadContent && typeof options.loadContent === 'function') {
        showAuthLoading();
        options.loadContent(routeConfig.page).then(() => {
            hideAuthLoading();
        });
    } else {
        // Traditional navigation
        window.location.href = `pages/${routeConfig.page}`;
    }
}

/**
 * Get user's default landing page based on role
 * @param {Object} user - User object
 * @returns {string} Default page for user role
 */
export function getUserDefaultPage(user) {
    if (!user) return 'index.html';
    
    switch (user.role) {
        case ROLES.ADMIN:
            return 'admin-dashboard.html';
        case ROLES.RECRUITER:
        case ROLES.HIRING_MANAGER:
            return 'hiring-dashboard.html';
        case ROLES.MANAGER:
            return 'metrics.html';
        case ROLES.BANK_REPRESENTATIVE:
            return 'reports.html';
        default:
            return 'perfil.html';
    }
}

/**
 * Get navigation menu items for user role
 * @param {Object} user - User object
 * @returns {Array} Menu items for user
 */
export function getMenuItemsForUser(user) {
    const baseItems = [
        { title: 'Inicio', href: '../index.html', icon: 'fas fa-home' },
        { title: 'Empleos', href: 'empleos.html', icon: 'fas fa-briefcase' },
        { title: 'Empresas', href: 'empresas.html', icon: 'fas fa-building' },
        { title: 'Capacitaciones', href: 'capacitaciones.html', icon: 'fas fa-graduation-cap' }
    ];
    
    if (!user) return baseItems;
    
    const authItems = [
        ...baseItems,
        { title: 'Mi Perfil', href: 'perfil.html', icon: 'fas fa-user' },
        { title: 'Mis Cursos', href: 'mis-cursos.html', icon: 'fas fa-book' },
        { title: 'Favoritos', href: 'favoritos.html', icon: 'fas fa-heart' }
    ];
    
    const roleSpecificItems = {
        [ROLES.ADMIN]: [
            { title: 'Panel Admin', href: 'admin-dashboard.html', icon: 'fas fa-cog' },
            { title: 'Usuarios', href: 'gestion-usuarios.html', icon: 'fas fa-users' },
            { title: 'Roles', href: 'roles.html', icon: 'fas fa-user-shield' },
            { title: 'Métricas', href: 'metrics.html', icon: 'fas fa-chart-bar' }
        ],
        [ROLES.RECRUITER]: [
            { title: 'Dashboard RH', href: 'hiring-dashboard.html', icon: 'fas fa-chart-line' },
            { title: 'Gestión Empleos', href: 'job-management.html', icon: 'fas fa-briefcase' },
            { title: 'Pipeline', href: 'kanban.html', icon: 'fas fa-tasks' },
            { title: 'Base CV', href: 'resume-database.html', icon: 'fas fa-database' }
        ],
        [ROLES.HIRING_MANAGER]: [
            { title: 'Dashboard RH', href: 'hiring-dashboard.html', icon: 'fas fa-chart-line' },
            { title: 'Pipeline', href: 'kanban.html', icon: 'fas fa-tasks' },
            { title: 'Base CV', href: 'resume-database.html', icon: 'fas fa-database' }
        ],
        [ROLES.MANAGER]: [
            { title: 'Métricas', href: 'metrics.html', icon: 'fas fa-chart-bar' },
            { title: 'Reportes', href: 'reports.html', icon: 'fas fa-file-alt' }
        ],
        [ROLES.BANK_REPRESENTATIVE]: [
            { title: 'Métricas', href: 'metrics.html', icon: 'fas fa-chart-bar' },
            { title: 'Reportes', href: 'reports.html', icon: 'fas fa-file-alt' }
        ]
    };
    
    const userRoleItems = roleSpecificItems[user.role] || [];
    return [...authItems, ...userRoleItems];
}

// Auto-initialize routing when module loads
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initializeRouting();
    });
}
