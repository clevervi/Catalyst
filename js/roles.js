/**
 * Catalyst HR System - Role Management Module
 * 
 * This module defines user roles, permissions, and authentication utilities
 * for the Catalyst HR platform. It handles role-based access control,
 * session management, and UI updates based on user authorization levels.
 * 
 * @author Catalyst HR Team
 * @version 1.0.0
 */

/**
 * User Role Constants
 * 
 * Defines all available user roles in the system with their corresponding
 * backend role identifiers. These roles control access to different
 * parts of the application and API endpoints.
 */
export const ROLES = {
    ADMIN: 'administrador',              // Full system access
    RECRUITER: 'talentos_humanos',       // HR operations and candidate management
    HIRING_MANAGER: 'hiring_manager',    // Job posting and application review
    MANAGER: 'manager',                  // Team and project management
    BANK_REPRESENTATIVE: 'representante_banco', // Financial partnerships
    USER: 'usuario',                     // Basic user with job search capabilities
    CANDIDATE: 'candidato'               // Job seeker with application abilities
};

/**
 * Department Constants
 * 
 * Organizational departments available in the system for user assignment
 * and job categorization. Used for filtering and organizational structure.
 */
export const DEPARTMENTS = {
    TECHNOLOGY: 'Tecnología',
    MARKETING: 'Marketing',
    SALES: 'Ventas',
    HR: 'Recursos Humanos',
    FINANCE: 'Finanzas',
    OPERATIONS: 'Operaciones',
    BANKING: 'Servicios Bancarios',
    MANAGEMENT: 'Gerencia'
};

/**
 * Get User Data from Local Storage
 * 
 * Safely retrieves and parses user data from localStorage.
 * Returns empty object if data is invalid or doesn't exist.
 * 
 * @returns {Object} User data object or empty object if invalid
 */
export const getUserData = () => {
    try {
        return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return {};
    }
};

/**
 * Check User Authentication Status
 * 
 * Verifies if user is currently authenticated by checking:
 * - Authentication flag in localStorage
 * - Valid user data with ID
 * - Session hasn't expired (24 hour limit)
 * - Updates last activity timestamp
 * 
 * @returns {boolean} True if user is authenticated and session is valid
 */
export const isAuthenticated = () => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = getUserData();
    const sessionStart = localStorage.getItem('sessionStart');
    
    // Check if all required authentication data exists
    if (authStatus !== 'true' || !userData.id || !sessionStart) {
        return false;
    }
    
    // Check session validity (24 hours max)
    const sessionAge = Date.now() - parseInt(sessionStart);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (sessionAge > maxAge) {
        // Session expired, clear auth data and logout
        logout();
        return false;
    }
    
    // Update last activity timestamp for session management
    userData.lastActivity = Date.now();
    localStorage.setItem('userData', JSON.stringify(userData));
    
    return true;
};

/**
 * Check Role-Based Permissions
 * 
 * Verifies if the current user has permission to access resources
 * that require a specific role. Uses role hierarchy where higher
 * roles inherit permissions from lower roles.
 * 
 * @param {string} requiredRole - The role required for access
 * @returns {boolean} True if user has the required role or higher
 */
export const hasPermission = (requiredRole) => {
    if (!requiredRole) return true; // No role requirement
    
    const userData = getUserData();
    
    // Role hierarchy: higher roles inherit lower role permissions
    const roleHierarchy = {
        [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER, ROLES.USER, ROLES.CANDIDATE],
        [ROLES.RECRUITER]: [ROLES.RECRUITER, ROLES.HIRING_MANAGER, ROLES.USER, ROLES.CANDIDATE],
        [ROLES.HIRING_MANAGER]: [ROLES.HIRING_MANAGER, ROLES.USER, ROLES.CANDIDATE],
        [ROLES.USER]: [ROLES.USER, ROLES.CANDIDATE],
        [ROLES.CANDIDATE]: [ROLES.CANDIDATE]
    };

    if (!userData.role) return false;
    
    return roleHierarchy[userData.role]?.includes(requiredRole) || false;
};

/**
 * Route Guard Function
 * 
 * Protects routes by checking authentication and role permissions.
 * Redirects users to appropriate pages if access is denied.
 * 
 * @param {string} requiredRole - Role required for access (optional)
 * @param {string} redirectPath - Where to redirect if access denied
 * @returns {boolean} True if access is granted
 */
export const routeGuard = (requiredRole, redirectPath = '/index.html') => {
    // Check authentication first
    if (!isAuthenticated()) {
        window.location.href = redirectPath;
        return false;
    }

    // Check role permissions if required
    if (requiredRole && !hasPermission(requiredRole)) {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = redirectPath;
        return false;
    }

    return true; // Access granted
};

/**
 * User Logout Function
 * 
 * Clears all authentication data from localStorage, shows logout message,
 * and redirects to the home page. Handles both main site and pages subdirectory.
 */
export const logout = () => {
    // Clear all authentication-related data
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('sessionStart');
    
    // Determine correct path based on current location
    const inPages = /\/pages\//.test(location.pathname);
    const indexPath = inPages ? '../index.html' : 'index.html';
    
    // Show logout confirmation message if toast function is available
    if (typeof showToast === 'function') {
        showToast('Has cerrado sesión correctamente');
    }
    
    // Redirect to home page after brief delay
    setTimeout(() => {
        window.location.href = indexPath;
    }, 1000);
};

/**
 * Update Authentication UI
 * 
 * Updates the navigation authentication buttons based on user login status.
 * Shows different menu items and options depending on user role and authentication state.
 * Handles both authenticated and non-authenticated states.
 */
export const updateAuthUI = () => {
    const authButtons = document.getElementById('auth-buttons');
    const isAuth = isAuthenticated();
    const userData = getUserData();

    if (authButtons) {
        // Determine correct path prefixes based on current location
        const inPages = /\/pages\//.test(location.pathname);
        const loginHref = inPages ? 'login.html' : 'pages/login.html';
        const registerHref = inPages ? 'register.html' : 'pages/register.html';
        const profileHref = inPages ? 'perfil.html' : 'pages/perfil.html';
        const favoritosHref = inPages ? 'favoritos.html' : 'pages/favoritos.html';
        const misCursosHref = inPages ? 'mis-cursos.html' : 'pages/mis-cursos.html';
        const alertasHref = inPages ? 'alertas.html' : 'pages/alertas.html';
        const adminHref = inPages ? 'admin-dashboard.html' : 'pages/admin-dashboard.html';
        const hiringHref = inPages ? 'hiring-dashboard.html' : 'pages/hiring-dashboard.html';
        const metricsHref = inPages ? 'metrics.html' : 'pages/metrics.html';

        if (isAuth && userData.role) {
            // Build role-specific menu items
            let roleSpecificItems = '';
            
            // Admin items
            if (userData.role === ROLES.ADMIN) {
                roleSpecificItems += `
                    <li><a class="dropdown-item" href="${adminHref}"><i class="fas fa-cog me-2"></i> Panel Admin</a></li>
                    <li><a class="dropdown-item" href="${hiringHref}"><i class="fas fa-chart-line me-2"></i> Dashboard HR</a></li>
                    <li><a class="dropdown-item" href="${metricsHref}"><i class="fas fa-chart-bar me-2"></i> Métricas</a></li>
                    <li><hr class="dropdown-divider"></li>
                `;
            }
            
            // Recruiter items
            if (userData.role === ROLES.RECRUITER || userData.role === ROLES.ADMIN) {
                roleSpecificItems += `
                    <li><a class="dropdown-item" href="${hiringHref}"><i class="fas fa-users me-2"></i> Dashboard HR</a></li>
                    <li><hr class="dropdown-divider"></li>
                `;
            }
            
            // Hiring Manager items
            if (userData.role === ROLES.HIRING_MANAGER || userData.role === ROLES.ADMIN) {
                roleSpecificItems += `
                    <li><a class="dropdown-item" href="${hiringHref}"><i class="fas fa-clipboard-list me-2"></i> Gestión Candidatos</a></li>
                    <li><hr class="dropdown-divider"></li>
                `;
            }
            
            // Manager items
            if (userData.role === ROLES.MANAGER || userData.role === ROLES.ADMIN) {
                roleSpecificItems += `
                    <li><a class="dropdown-item" href="${metricsHref}"><i class="fas fa-chart-pie me-2"></i> Reportes</a></li>
                    <li><hr class="dropdown-divider"></li>
                `;
            }
            
            // Create role badge
            let roleBadge = '';
            switch(userData.role) {
                case ROLES.ADMIN:
                    roleBadge = ' <span class="badge bg-danger">Admin</span>';
                    break;
                case ROLES.RECRUITER:
                    roleBadge = ' <span class="badge bg-warning">RH</span>';
                    break;
                case ROLES.HIRING_MANAGER:
                    roleBadge = ' <span class="badge bg-info">HM</span>';
                    break;
                case ROLES.MANAGER:
                    roleBadge = ' <span class="badge bg-success">Mgr</span>';
                    break;
                case ROLES.BANK_REPRESENTATIVE:
                    roleBadge = ' <span class="badge bg-primary">Bank</span>';
                    break;
            }

            authButtons.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                        <i class="fas fa-user-circle me-1"></i> ${userData.firstName || userData.name || 'Usuario'}${roleBadge}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        ${roleSpecificItems}
                        <li><a class="dropdown-item" href="${profileHref}"><i class="fas fa-user me-2"></i> Mi perfil</a></li>
                        <li><a class="dropdown-item" href="${misCursosHref}"><i class="fas fa-graduation-cap me-2"></i> Mis Cursos</a></li>
                        <li><a class="dropdown-item" href="${favoritosHref}"><i class="fas fa-heart me-2"></i> Favoritos</a></li>
                        <li><a class="dropdown-item" href="${alertasHref}"><i class="fas fa-bell me-2"></i> Alertas</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i> Cerrar sesión</a></li>
                    </ul>
                </div>
            `;
            
            // Añadir evento de logout
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        } else {
            authButtons.innerHTML = `
                <a href="${loginHref}" class="btn btn-outline-light me-2">
                    <i class="fas fa-sign-in-alt me-1"></i> Iniciar sesión
                </a>
                <a href="${registerHref}" class="btn btn-accent">
                    <i class="fas fa-user-plus me-1"></i> Registrarse
                </a>
            `;
        }
    }
};

// Función para verificar si el usuario es manager de un departamento
export const getDepartmentManager = (department) => {
    const userData = getUserData();
    return userData.department === department || userData.role === ROLES.ADMIN;
};

// Función para verificar un rol específico
export const checkRole = (requiredRole) => {
    const userData = getUserData();
    return userData.role === requiredRole;
};

// Función para obtener el usuario actual
export const getCurrentUser = () => {
    return getUserData();
};