/**
 * Enhanced Role-Based Guards System for Catalyst HR System
 * Provides comprehensive access control and authentication guards
 */

import { ROLES } from './roles.js';
import { showToast } from './ui.js';

// Enhanced role hierarchy system
export const ROLE_HIERARCHY = {
    [ROLES.ADMIN]: {
        level: 100,
        inherits: [ROLES.RECRUITER, ROLES.HIRING_MANAGER, ROLES.MANAGER, ROLES.USER, ROLES.CANDIDATE]
    },
    [ROLES.MANAGER]: {
        level: 80,
        inherits: [ROLES.RECRUITER, ROLES.HIRING_MANAGER, ROLES.USER, ROLES.CANDIDATE]
    },
    [ROLES.RECRUITER]: {
        level: 60,
        inherits: [ROLES.HIRING_MANAGER, ROLES.USER, ROLES.CANDIDATE]
    },
    [ROLES.HIRING_MANAGER]: {
        level: 50,
        inherits: [ROLES.USER, ROLES.CANDIDATE]
    },
    [ROLES.BANK_REPRESENTATIVE]: {
        level: 40,
        inherits: [ROLES.USER]
    },
    [ROLES.USER]: {
        level: 20,
        inherits: [ROLES.CANDIDATE]
    },
    [ROLES.CANDIDATE]: {
        level: 10,
        inherits: []
    }
};

// Feature access permissions
export const FEATURE_PERMISSIONS = {
    'create_job': [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER],
    'manage_users': [ROLES.ADMIN],
    'view_reports': [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECRUITER],
    'manage_candidates': [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER],
    'view_metrics': [ROLES.ADMIN, ROLES.MANAGER, ROLES.BANK_REPRESENTATIVE],
    'edit_profile': [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER, ROLES.USER, ROLES.CANDIDATE],
    'apply_jobs': [ROLES.USER, ROLES.CANDIDATE],
    'view_salary_info': [ROLES.ADMIN, ROLES.MANAGER, ROLES.BANK_REPRESENTATIVE]
};

// Page access configuration
export const PAGE_ACCESS = {
    // Public pages - accessible to everyone
    PUBLIC: [
        'index.html',
        'empleos.html',
        'empresas.html',
        'capacitaciones.html',
        'clanes.html',
        'login.html',
        'register.html',
        'detalles-empleo.html',
        'detalles-curso.html',
        'terminos.html',
        'privacidad.html',
        'cookies.html'
    ],
    
    // Authentication required - any logged-in user
    AUTH_REQUIRED: [
        'perfil.html',
        'mis-cursos.html',
        'certificados.html',
        'favoritos.html',
        'alertas.html',
        'publicar-cv.html'
    ],
    
    // Role-specific access
    ROLE_SPECIFIC: {
        [ROLES.ADMIN]: [
            'admin-dashboard.html',
            'gestion-usuarios.html',
            'user-management.html',
            'roles.html',
            'role-management.html',
            'metrics.html',
            'reports.html',
            'hiring-dashboard.html',
            'kanban.html',
            'resume-database.html',
            'job-management.html',
            'job-management-enhanced.html'
        ],
        [ROLES.RECRUITER]: [
            'hiring-dashboard.html',
            'kanban.html',
            'resume-database.html',
            'job-management.html',
            'job-management-enhanced.html',
            'reports.html'
        ],
        [ROLES.HIRING_MANAGER]: [
            'hiring-dashboard.html',
            'kanban.html',
            'resume-database.html',
            'job-management.html',
            'job-management-enhanced.html',
            'reports.html'
        ],
        [ROLES.MANAGER]: [
            'metrics.html',
            'reports.html',
            'resume-database.html'
        ],
        [ROLES.BANK_REPRESENTATIVE]: [
            'metrics.html',
            'reports.html'
        ],
        [ROLES.USER]: [
            // Only basic authenticated pages
        ]
    }
};

/**
 * Get current user data from localStorage
 * @returns {Object|null} User data or null if not authenticated
 */
export function getCurrentUser() {
    try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        // Check both userData and currentUser for compatibility
        let userData = localStorage.getItem('userData') || localStorage.getItem('currentUser');
        
        if (!isAuthenticated || !userData) {
            return null;
        }
        
        return JSON.parse(userData);
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 * @returns {boolean} Whether user is authenticated
 */
export function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} Whether user has the role
 */
export function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

/**
 * Check if user has any of the specified roles
 * @param {Array} roles - Array of roles to check
 * @returns {boolean} Whether user has any of the roles
 */
export function hasAnyRole(roles) {
    const user = getCurrentUser();
    if (!user) return false;
    
    return roles.includes(user.role);
}

/**
 * Check if user can access a specific page
 * @param {string} pageName - Name of the page to check
 * @returns {boolean} Whether user can access the page
 */
export function canAccessPage(pageName) {
    const user = getCurrentUser();
    
    // Public pages - always accessible
    if (PAGE_ACCESS.PUBLIC.includes(pageName)) {
        return true;
    }
    
    // If not authenticated, can only access public pages
    if (!user) {
        return false;
    }
    
    // Auth required pages - accessible to any authenticated user
    if (PAGE_ACCESS.AUTH_REQUIRED.includes(pageName)) {
        return true;
    }
    
    // Role-specific pages
    const userRolePages = PAGE_ACCESS.ROLE_SPECIFIC[user.role] || [];
    return userRolePages.includes(pageName);
}

/**
 * Redirect to appropriate page based on user state
 * @param {string} targetPage - Target page name
 * @param {Object} options - Redirect options
 */
export function redirectWithAuth(targetPage, options = {}) {
    const user = getCurrentUser();
    const basePath = options.basePath || '';
    
    if (!user) {
        // Not authenticated - redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `${basePath}pages/login.html?returnUrl=${returnUrl}`;
        return;
    }
    
    if (!canAccessPage(targetPage)) {
        // User doesn't have access - redirect to appropriate dashboard
        showToast('No tienes permisos para acceder a esta página', 'error');
        
        // Redirect to role-appropriate dashboard
        switch (user.role) {
            case ROLES.ADMIN:
                window.location.href = `${basePath}pages/admin-dashboard.html`;
                break;
            case ROLES.RECRUITER:
            case ROLES.HIRING_MANAGER:
                window.location.href = `${basePath}pages/hiring-dashboard.html`;
                break;
            default:
                window.location.href = `${basePath}index.html`;
        }
        return;
    }
    
    // User has access - proceed to page
    window.location.href = `${basePath}pages/${targetPage}`;
}

/**
 * Initialize guards for current page
 * @param {string} currentPage - Current page name
 * @param {Object} options - Guard options
 */
export function initializeGuards(currentPage, options = {}) {
    const { 
        redirectOnFail = true, 
        showError = true,
        basePath = ''
    } = options;
    
    // Skip guard check for public pages
    if (PAGE_ACCESS.PUBLIC.includes(currentPage)) {
        return true;
    }
    
    const user = getCurrentUser();
    
    // Check authentication for auth-required pages
    if (PAGE_ACCESS.AUTH_REQUIRED.includes(currentPage) && !user) {
        if (showError) {
            showToast('Debes iniciar sesión para acceder a esta página', 'warning');
        }
        
        if (redirectOnFail) {
            const returnUrl = encodeURIComponent(window.location.href);
            setTimeout(() => {
                window.location.href = `${basePath}pages/login.html?returnUrl=${returnUrl}`;
            }, 1000);
        }
        return false;
    }
    
    // Check role-specific access
    if (!canAccessPage(currentPage)) {
        if (showError) {
            showToast('No tienes permisos para acceder a esta página', 'error');
        }
        
        if (redirectOnFail) {
            setTimeout(() => {
                if (!user) {
                    window.location.href = `${basePath}index.html`;
                } else {
                    // Redirect to role-appropriate dashboard
                    switch (user.role) {
                        case ROLES.ADMIN:
                            window.location.href = `${basePath}pages/admin-dashboard.html`;
                            break;
                        case ROLES.RECRUITER:
                        case ROLES.HIRING_MANAGER:
                            window.location.href = `${basePath}pages/hiring-dashboard.html`;
                            break;
                        default:
                            window.location.href = `${basePath}index.html`;
                    }
                }
            }, 1000);
        }
        return false;
    }
    
    return true;
}

/**
 * Guard specific elements based on roles
 * @param {string} selector - CSS selector for elements to guard
 * @param {Array} allowedRoles - Roles that can see the elements
 */
export function guardElements(selector, allowedRoles) {
    const user = getCurrentUser();
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        if (!user || !allowedRoles.includes(user.role)) {
            element.style.display = 'none';
        } else {
            element.style.display = '';
        }
    });
}

/**
 * Guard navigation items based on user role
 */
export function guardNavigation() {
    const user = getCurrentUser();
    
    // Guard role-specific navigation items
    document.querySelectorAll('[data-role]').forEach(element => {
        const requiredRoles = element.getAttribute('data-role').split(',').map(r => r.trim());
        
        if (!user || !requiredRoles.includes(user.role)) {
            element.style.display = 'none';
            element.classList.add('role-hidden');
        } else {
            element.style.display = '';
            element.classList.remove('role-hidden');
        }
    });
    
    // Guard auth-required items
    document.querySelectorAll('[data-auth="required"]').forEach(element => {
        if (!user) {
            element.style.display = 'none';
            element.classList.add('auth-hidden');
        } else {
            element.style.display = '';
            element.classList.remove('auth-hidden');
        }
    });
    
    // Guard HR-specific content (recruiter, hiring_manager, admin only)
    guardHRContent(user);
    
    // Guard personal information visibility
    guardPersonalInformation(user);
}

/**
 * Guard HR-specific content
 * @param {Object} user - Current user object
 */
export function guardHRContent(user) {
    const hrRoles = [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER];
    const hasHRAccess = user && hrRoles.includes(user.role);
    
    // Guard HR dropdown in navigation
    const hrDropdown = document.querySelector('#hrDropdown');
    const hrDropdownParent = hrDropdown?.closest('.nav-item.dropdown');
    
    if (hrDropdownParent) {
        if (!hasHRAccess) {
            hrDropdownParent.style.display = 'none';
            hrDropdownParent.classList.add('hr-hidden');
        } else {
            hrDropdownParent.style.display = '';
            hrDropdownParent.classList.remove('hr-hidden');
        }
    }
    
    // Guard all HR-specific elements
    document.querySelectorAll('.hr-only, [data-hr-only]').forEach(element => {
        if (!hasHRAccess) {
            element.style.display = 'none';
            element.classList.add('hr-hidden');
        } else {
            element.style.display = '';
            element.classList.remove('hr-hidden');
        }
    });
}

/**
 * Guard personal information visibility
 * @param {Object} user - Current user object
 */
export function guardPersonalInformation(user) {
    const privilegedRoles = [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER, ROLES.MANAGER];
    const canSeePersonalInfo = user && privilegedRoles.includes(user.role);
    
    // Guard personal information elements
    document.querySelectorAll('.personal-info, [data-personal-info]').forEach(element => {
        if (!canSeePersonalInfo) {
            // Replace with placeholder or hide completely
            if (element.hasAttribute('data-hide-content')) {
                element.style.display = 'none';
            } else {
                // Mask personal information
                const originalContent = element.getAttribute('data-original-content') || element.textContent;
                element.setAttribute('data-original-content', originalContent);
                element.textContent = '***';
                element.classList.add('personal-info-masked');
            }
        } else if (element.hasAttribute('data-original-content')) {
            // Restore original content for privileged users
            element.textContent = element.getAttribute('data-original-content');
            element.classList.remove('personal-info-masked');
        }
    });
    
    // Guard contact information
    document.querySelectorAll('.contact-info, [data-contact-info]').forEach(element => {
        if (!canSeePersonalInfo) {
            element.style.display = 'none';
            element.classList.add('contact-hidden');
        } else {
            element.style.display = '';
            element.classList.remove('contact-hidden');
        }
    });
}

/**
 * Create access denied page content
 * @param {string} reason - Reason for access denial
 * @returns {string} HTML content for access denied
 */
export function createAccessDeniedContent(reason = 'No tienes permisos para acceder a esta página') {
    return `
        <div class="container mt-5 pt-5">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body text-center py-5">
                            <div class="mb-4">
                                <i class="fas fa-shield-alt text-warning" style="font-size: 4rem;"></i>
                            </div>
                            <h3 class="text-danger mb-3">Acceso Denegado</h3>
                            <p class="text-muted mb-4">${reason}</p>
                            <div class="d-flex gap-3 justify-content-center">
                                <button onclick="history.back()" class="btn btn-outline-secondary">
                                    <i class="fas fa-arrow-left me-2"></i> Volver
                                </button>
                                <a href="../index.html" class="btn btn-primary">
                                    <i class="fas fa-home me-2"></i> Ir al Inicio
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show loading screen while checking permissions
 */
export function showAuthLoading() {
    const loadingHTML = `
        <div id="auth-loading" class="d-flex justify-content-center align-items-center" style="min-height: 100vh; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.9); z-index: 9999;">
            <div class="text-center">
                <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="text-muted">Verificando permisos...</p>
            </div>
        </div>
    `;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = loadingHTML;
    document.body.appendChild(loadingDiv);
}

/**
 * Hide loading screen
 */
export function hideAuthLoading() {
    const loading = document.getElementById('auth-loading');
    if (loading) {
        loading.remove();
    }
}

/**
 * Initialize complete guard system
 * @param {string} currentPage - Current page name
 * @param {Object} options - Guard options
 */
export function initializeCompleteGuardSystem(currentPage, options = {}) {
    // Show loading while checking
    if (options.showLoading !== false) {
        showAuthLoading();
    }
    
    // Small delay to show loading effect
    setTimeout(() => {
        const hasAccess = initializeGuards(currentPage, {
            ...options,
            redirectOnFail: false // Handle redirect manually
        });
        
        if (!hasAccess) {
            // Replace page content with access denied
            document.body.innerHTML = createAccessDeniedContent();
        } else {
            // Initialize role-based UI elements
            guardNavigation();
            
            // Custom element guards if specified
            if (options.customGuards) {
                options.customGuards.forEach(guard => {
                    guardElements(guard.selector, guard.allowedRoles);
                });
            }
        }
        
        // Hide loading
        hideAuthLoading();
    }, 300);
}

/**
 * Logout user and redirect
 * @param {string} redirectTo - Where to redirect after logout
 */
export function logout(redirectTo = '../index.html') {
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    showToast('Has cerrado sesión correctamente');
    
    setTimeout(() => {
        window.location.href = redirectTo;
    }, 1000);
}

/**
 * Handle login redirect after successful authentication
 */
export function handleLoginRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');
    
    if (returnUrl) {
        try {
            const decodedUrl = decodeURIComponent(returnUrl);
            window.location.href = decodedUrl;
        } catch (error) {
            console.error('Error redirecting after login:', error);
            window.location.href = '../index.html';
        }
    } else {
        // Redirect to role-appropriate dashboard
        const user = getCurrentUser();
        if (user) {
            switch (user.role) {
                case ROLES.ADMIN:
                    window.location.href = 'admin-dashboard.html';
                    break;
                case ROLES.RECRUITER:
                case ROLES.HIRING_MANAGER:
                    window.location.href = 'hiring-dashboard.html';
                    break;
                default:
                    window.location.href = '../index.html';
            }
        } else {
            window.location.href = '../index.html';
        }
    }
}

/**
 * Create role badge for user
 * @param {string} role - User role
 * @returns {string} HTML for role badge
 */
export function createRoleBadge(role) {
    const roleConfig = {
        [ROLES.ADMIN]: { 
            label: 'Admin', 
            class: 'bg-danger',
            icon: 'fas fa-crown'
        },
        [ROLES.RECRUITER]: { 
            label: 'Recruiter', 
            class: 'bg-warning',
            icon: 'fas fa-user-tie'
        },
        [ROLES.HIRING_MANAGER]: { 
            label: 'Hiring Manager', 
            class: 'bg-info',
            icon: 'fas fa-users-cog'
        },
        [ROLES.MANAGER]: { 
            label: 'Manager', 
            class: 'bg-success',
            icon: 'fas fa-user-shield'
        },
        [ROLES.BANK_REPRESENTATIVE]: { 
            label: 'Bank Rep', 
            class: 'bg-primary',
            icon: 'fas fa-university'
        },
        [ROLES.USER]: { 
            label: 'Usuario', 
            class: 'bg-secondary',
            icon: 'fas fa-user'
        }
    };
    
    const config = roleConfig[role] || roleConfig[ROLES.USER];
    
    return `<span class="badge ${config.class} ms-2">
        <i class="${config.icon} me-1"></i>${config.label}
    </span>`;
}

/**
 * Guard form submissions based on roles
 * @param {string} formId - Form ID to guard
 * @param {Array} allowedRoles - Roles that can submit
 */
export function guardForm(formId, allowedRoles) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const user = getCurrentUser();
    
    if (!user || !allowedRoles.includes(user.role)) {
        // Disable form
        const inputs = form.querySelectorAll('input, textarea, select, button');
        inputs.forEach(input => {
            input.disabled = true;
        });
        
        // Add warning message
        const warning = document.createElement('div');
        warning.className = 'alert alert-warning mt-3';
        warning.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            No tienes permisos para realizar esta acción.
        `;
        form.appendChild(warning);
    }
}

/**
 * Initialize page with comprehensive guards
 * @param {Object} config - Page configuration
 */
export function initPageWithGuards(config) {
    const {
        pageName,
        requiredRoles = null,
        authRequired = false,
        customGuards = [],
        basePath = '',
        onAccessDenied = null,
        onAccessGranted = null
    } = config;
    
    document.addEventListener('DOMContentLoaded', () => {
        const user = getCurrentUser();
        let hasAccess = false;
        
        // Check access based on configuration
        if (!authRequired && !requiredRoles) {
            // Public page
            hasAccess = true;
        } else if (authRequired && !requiredRoles) {
            // Auth required only
            hasAccess = !!user;
        } else if (requiredRoles) {
            // Role-specific access
            hasAccess = user && requiredRoles.includes(user.role);
        }
        
        if (!hasAccess) {
            if (onAccessDenied) {
                onAccessDenied();
            } else {
                // Default access denied handling
                document.body.innerHTML = createAccessDeniedContent();
            }
            return;
        }
        
        // Access granted
        if (onAccessGranted) {
            onAccessGranted(user);
        }
        
        // Apply custom guards
        customGuards.forEach(guard => {
            guardElements(guard.selector, guard.allowedRoles);
        });
        
        // Guard navigation
        guardNavigation();
        
        // Guard forms if specified
        if (config.guardedForms) {
            config.guardedForms.forEach(formConfig => {
                guardForm(formConfig.formId, formConfig.allowedRoles);
            });
        }
    });
}

// Utility function to check admin access
export const requireAdmin = () => hasRole(ROLES.ADMIN);
export const requireRecruiter = () => hasAnyRole([ROLES.RECRUITER, ROLES.ADMIN]);
export const requireHiringManager = () => hasAnyRole([ROLES.HIRING_MANAGER, ROLES.ADMIN, ROLES.RECRUITER]);
export const requireManager = () => hasAnyRole([ROLES.MANAGER, ROLES.ADMIN]);
export const requireAuth = () => isAuthenticated();
