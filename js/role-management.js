/**
 * Comprehensive Role Management System
 * Handles authentication, authorization, navigation, and UI consistency
 */

// Role definitions and permissions
export const ROLES = {
    ADMIN: 'administrador',
    RECRUITER: 'talentos_humanos',
    HIRING_MANAGER: 'hiring_manager',
    MANAGER: 'manager',
    BANK_REPRESENTATIVE: 'representante_banco',
    USER: 'usuario',
    CANDIDATE: 'candidato'
};

export const DEPARTMENTS = {
    TECHNOLOGY: 'Tecnología',
    MARKETING: 'Marketing', 
    SALES: 'Ventas',
    HR: 'Recursos Humanos',
    FINANCE: 'Finanzas',
    OPERATIONS: 'Operaciones',
    DESIGN: 'Diseño'
};

// Page access permissions by role
export const PAGE_PERMISSIONS = {
    'index.html': ['*'], // Public access
    'pages/login.html': ['*'], // Public access
    'pages/register.html': ['*'], // Public access
    
    // HR Management System
    'pages/resume-database.html': [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER],
    'pages/hiring-dashboard.html': [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER],
    'pages/reports.html': [ROLES.ADMIN, ROLES.RECRUITER],
    'pages/kanban.html': [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER],
    'pages/job-management.html': [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER],
    'pages/user-management.html': [ROLES.ADMIN, ROLES.RECRUITER],
    'pages/admin-dashboard.html': [ROLES.ADMIN],
    
    // Job Portal Pages
    'pages/empleos.html': ['*'], // Public job listings
    'pages/detalle-empleo.html': ['*'], // Public job details
    'pages/capacitaciones.html': ['*'], // Public training courses
    'pages/perfil.html': [ROLES.ADMIN, ROLES.RECRUITER, ROLES.HIRING_MANAGER, ROLES.USER, ROLES.CANDIDATE],
    'pages/empresas.html': [ROLES.ADMIN, ROLES.RECRUITER],
    'pages/gestion-usuarios.html': [ROLES.ADMIN]
};

// Navigation menu configuration by role
export const NAVIGATION_MENUS = {
    [ROLES.ADMIN]: {
        brand: 'Catalyst Admin',
        items: [
            { href: '/index.html', icon: 'fa-home', text: 'Inicio' },
            { 
                text: 'Gestión de RRHH', 
                icon: 'fa-users-cog',
                dropdown: [
                    { href: '/pages/resume-database.html', icon: 'fa-file-alt', text: 'Base de Datos CV' },
                    { href: '/pages/hiring-dashboard.html', icon: 'fa-chart-line', text: 'Dashboard Contratación' },
                    { href: '/pages/kanban.html', icon: 'fa-columns', text: 'Pipeline Candidatos' },
                    { href: '/pages/reports.html', icon: 'fa-chart-pie', text: 'Reportes y Analytics' }
                ]
            },
            {
                text: 'Administración',
                icon: 'fa-cogs',
                dropdown: [
                    { href: '/pages/job-management.html', icon: 'fa-briefcase', text: 'Gestión de Empleos' },
                    { href: '/pages/user-management.html', icon: 'fa-users', text: 'Gestión de Usuarios' },
                    { href: '/pages/empresas.html', icon: 'fa-building', text: 'Empresas' },
                    { href: '/pages/admin-dashboard.html', icon: 'fa-tachometer-alt', text: 'Panel Admin' }
                ]
            },
            { href: '/pages/empleos.html', icon: 'fa-search', text: 'Ver Empleos Públicos' }
        ]
    },
    
    [ROLES.RECRUITER]: {
        brand: 'Catalyst HR',
        items: [
            { href: '/index.html', icon: 'fa-home', text: 'Inicio' },
            { 
                text: 'Recursos Humanos', 
                icon: 'fa-users',
                dropdown: [
                    { href: '/pages/resume-database.html', icon: 'fa-file-alt', text: 'Base de Datos CV' },
                    { href: '/pages/hiring-dashboard.html', icon: 'fa-chart-line', text: 'Dashboard Contratación' },
                    { href: '/pages/kanban.html', icon: 'fa-columns', text: 'Pipeline Candidatos' },
                    { href: '/pages/reports.html', icon: 'fa-chart-pie', text: 'Reportes' }
                ]
            },
            { href: '/pages/job-management.html', icon: 'fa-briefcase', text: 'Gestión de Empleos' },
            { href: '/pages/user-management.html', icon: 'fa-users-cog', text: 'Usuarios' },
            { href: '/pages/empleos.html', icon: 'fa-search', text: 'Portal de Empleos' }
        ]
    },
    
    [ROLES.USER]: {
        brand: 'Catalyst',
        items: [
            { href: '/index.html', icon: 'fa-home', text: 'Inicio' },
            { href: '/pages/empleos.html', icon: 'fa-briefcase', text: 'Empleos' },
            { href: '/pages/capacitaciones.html', icon: 'fa-graduation-cap', text: 'Capacitaciones' },
            { href: '/pages/perfil.html', icon: 'fa-user', text: 'Mi Perfil' }
        ]
    },
    
    [ROLES.HIRING_MANAGER]: {
        brand: 'Catalyst Manager',
        items: [
            { href: '/index.html', icon: 'fa-home', text: 'Inicio' },
            { href: '/pages/hiring-dashboard.html', icon: 'fa-chart-line', text: 'Dashboard Contratación' },
            { href: '/pages/kanban.html', icon: 'fa-columns', text: 'Candidatos' },
            { href: '/pages/job-management.html', icon: 'fa-briefcase', text: 'Mis Empleos' },
            { href: '/pages/empleos.html', icon: 'fa-search', text: 'Portal de Empleos' }
        ]
    },
    
    
    [ROLES.BANK_REPRESENTATIVE]: {
        brand: 'Catalyst Bank',
        items: [
            { href: '/index.html', icon: 'fa-home', text: 'Inicio' },
            { 
                text: 'Servicios Bancarios', 
                icon: 'fa-university',
                dropdown: [
                    { href: '/pages/financial-services.html', icon: 'fa-credit-card', text: 'Servicios Financieros' },
                    { href: '/pages/loan-management.html', icon: 'fa-hand-holding-usd', text: 'Gestión de Préstamos' },
                    { href: '/pages/account-services.html', icon: 'fa-piggy-bank', text: 'Servicios de Cuenta' },
                    { href: '/pages/banking-reports.html', icon: 'fa-chart-bar', text: 'Reportes Bancarios' }
                ]
            },
            { href: '/pages/empleos.html', icon: 'fa-search', text: 'Portal de Empleos' },
            { href: '/pages/perfil.html', icon: 'fa-user', text: 'Mi Perfil' }
        ]
    },
    
    [ROLES.CANDIDATE]: {
        brand: 'Catalyst',
        items: [
            { href: '/index.html', icon: 'fa-home', text: 'Inicio' },
            { href: '/pages/empleos.html', icon: 'fa-briefcase', text: 'Empleos' },
            { href: '/pages/capacitaciones.html', icon: 'fa-graduation-cap', text: 'Capacitaciones' }
        ]
    }
};

// Default navigation for non-authenticated users
export const PUBLIC_NAVIGATION = {
    brand: 'Catalyst',
    items: [
        { href: '/index.html', icon: 'fa-home', text: 'Inicio' },
        { href: '/pages/empleos.html', icon: 'fa-briefcase', text: 'Empleos' },
        { href: '/pages/capacitaciones.html', icon: 'fa-graduation-cap', text: 'Capacitaciones' }
    ]
};

// User management functions
export const UserManager = {
    // Get user data from localStorage
    getUserData() {
        try {
            return JSON.parse(localStorage.getItem('userData') || '{}');
        } catch (error) {
            console.error('Error getting user data:', error);
            return {};
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true' && 
               Object.keys(this.getUserData()).length > 0;
    },

    // Save user data
    saveUserData(userData) {
        try {
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    },

    // Login user
    login(email, password) {
        // Demo users for testing
        const demoUsers = {
            'admin@catalyst.com': {
                id: 1,
                name: 'Juan Administrador',
                email: 'admin@catalyst.com',
                role: ROLES.ADMIN,
                department: DEPARTMENTS.HR,
                avatar: '/img/default-avatar.svg'
            },
            'hr@catalyst.com': {
                id: 2,
                name: 'María Talentos Humanos',
                email: 'hr@catalyst.com',
                role: ROLES.RECRUITER,
                department: DEPARTMENTS.HR,
                avatar: '/img/default-avatar.svg'
            },
            'recruiter@catalyst.com': {
                id: 3,
                name: 'Carlos Reclutador',
                email: 'recruiter@catalyst.com',
                role: ROLES.RECRUITER,
                department: DEPARTMENTS.HR,
                avatar: '/img/default-avatar.svg'
            },
            'manager@catalyst.com': {
                id: 4,
                name: 'Ana Hiring Manager',
                email: 'manager@catalyst.com',
                role: ROLES.HIRING_MANAGER,
                department: DEPARTMENTS.TECHNOLOGY,
                avatar: '/img/default-avatar.svg'
            },
            'bank@catalyst.com': {
                id: 5,
                name: 'Roberto Representante Bancario',
                email: 'bank@catalyst.com',
                role: ROLES.BANK_REPRESENTATIVE,
                department: DEPARTMENTS.FINANCE,
                avatar: '/img/default-avatar.svg'
            },
            'user@catalyst.com': {
                id: 6,
                name: 'Luis Usuario',
                email: 'user@catalyst.com',
                role: ROLES.USER,
                department: DEPARTMENTS.TECHNOLOGY,
                avatar: '/img/default-avatar.svg'
            }
        };

        const user = demoUsers[email];
        if (user && password === 'demo123') {
            this.saveUserData(user);
            return { success: true, user };
        }

        return { success: false, message: 'Credenciales inválidas' };
    },

    // Logout user
    logout() {
        localStorage.removeItem('userData');
        localStorage.setItem('isAuthenticated', 'false');
        window.location.href = '/index.html';
    },

    // Check if user has permission for a role
    hasRole(role) {
        const userData = this.getUserData();
        return userData.role === role;
    },

    // Check if user has permission for specific page
    hasPageAccess(pagePath) {
        const permissions = PAGE_PERMISSIONS[pagePath];
        if (!permissions || permissions.includes('*')) return true;
        
        const userData = this.getUserData();
        return permissions.includes(userData.role);
    },

    // Get navigation menu for current user
    getNavigationMenu() {
        if (!this.isAuthenticated()) {
            return PUBLIC_NAVIGATION;
        }
        
        const userData = this.getUserData();
        return NAVIGATION_MENUS[userData.role] || PUBLIC_NAVIGATION;
    }
};

// Navigation and UI management
export const UIManager = {
    // Generate navigation HTML
    generateNavigation() {
        const menu = UserManager.getNavigationMenu();
        const userData = UserManager.getUserData();
        const isAuth = UserManager.isAuthenticated();

        let navItems = '';
        menu.items.forEach(item => {
            if (item.dropdown) {
                navItems += `
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas ${item.icon} me-1"></i> ${item.text}
                        </a>
                        <ul class="dropdown-menu">
                            ${item.dropdown.map(subItem => `
                                <li><a class="dropdown-item" href="${subItem.href}">
                                    <i class="fas ${subItem.icon} me-2"></i> ${subItem.text}
                                </a></li>
                            `).join('')}
                        </ul>
                    </li>
                `;
            } else {
                const isActive = window.location.pathname.includes(item.href.replace('/', '')) ? 'active' : '';
                navItems += `
                    <li class="nav-item">
                        <a class="nav-link ${isActive}" href="${item.href}">
                            <i class="fas ${item.icon} me-1"></i> ${item.text}
                        </a>
                    </li>
                `;
            }
        });

        // Auth buttons
        let authButtons = '';
        if (isAuth && userData.name) {
            authButtons = `
                <div class="dropdown">
                    <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                        <img src="${userData.avatar || '/img/default-avatar.svg'}" alt="Avatar" class="rounded-circle me-2" width="24" height="24">
                        <span class="d-none d-md-inline">${userData.name}</span>
                        <span class="badge bg-primary ms-2">${this.getRoleLabel(userData.role)}</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li class="dropdown-header">
                            <small>Conectado como</small><br>
                            <strong>${userData.name}</strong><br>
                            <small class="text-muted">${userData.department || 'Sin departamento'}</small>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="/pages/perfil.html"><i class="fas fa-user me-2"></i> Mi perfil</a></li>
                        <li><a class="dropdown-item" href="/pages/configuracion.html"><i class="fas fa-cog me-2"></i> Configuración</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" onclick="UserManager.logout()"><i class="fas fa-sign-out-alt me-2"></i> Cerrar sesión</a></li>
                    </ul>
                </div>
            `;
        } else {
            authButtons = `
                <a href="/pages/login.html" class="btn btn-outline-light me-2">
                    <i class="fas fa-sign-in-alt me-1"></i> Iniciar sesión
                </a>
                <a href="/pages/register.html" class="btn btn-accent">
                    <i class="fas fa-user-plus me-1"></i> Registrarse
                </a>
            `;
        }

        return `
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary-dark fixed-top">
                <div class="container">
                    <a class="navbar-brand d-flex align-items-center" href="/index.html">
                        <img src="/img/image.png" alt="Catalyst" height="32" class="me-2">
                        ${menu.brand}
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            ${navItems}
                        </ul>
                        <div class="d-flex align-items-center">
                            ${authButtons}
                        </div>
                    </div>
                </div>
            </nav>
        `;
    },

    // Get role display label
    getRoleLabel(role) {
        const labels = {
            [ROLES.ADMIN]: 'Admin',
            [ROLES.RECRUITER]: 'HR Recruiter',
            [ROLES.HIRING_MANAGER]: 'Hiring Mgr',
            [ROLES.MANAGER]: 'Manager',
            [ROLES.BANK_REPRESENTATIVE]: 'Bank Rep',
            [ROLES.USER]: 'User',
            [ROLES.CANDIDATE]: 'Candidate'
        };
        return labels[role] || 'User';
    },

    // Initialize page
    initializePage() {
        // Add padding top for fixed navbar
        document.body.style.paddingTop = '80px';

        // Insert navigation if container exists
        const navContainer = document.getElementById('navigation-container') || 
                           document.querySelector('nav') || 
                           document.body;
        
        if (navContainer.tagName === 'BODY') {
            navContainer.insertAdjacentHTML('afterbegin', this.generateNavigation());
        } else {
            navContainer.outerHTML = this.generateNavigation();
        }

        // Add role-based styling
        this.addRoleBasedStyling();
        
        // Show role indicator in footer
        this.addRoleIndicator();
    },

    // Add role-based styling
    addRoleBasedStyling() {
        if (UserManager.isAuthenticated()) {
            const userData = UserManager.getUserData();
            document.body.classList.add(`role-${userData.role}`);
            document.body.classList.add(`dept-${userData.department?.toLowerCase().replace(/\s+/g, '-')}`);
        }
    },

    // Add role indicator
    addRoleIndicator() {
        if (UserManager.isAuthenticated()) {
            const userData = UserManager.getUserData();
            const indicator = document.createElement('div');
            indicator.className = 'role-indicator position-fixed bottom-0 end-0 m-3';
            indicator.innerHTML = `
                <div class="badge bg-secondary">
                    <i class="fas fa-user-tag me-1"></i>
                    ${this.getRoleLabel(userData.role)} - ${userData.department}
                </div>
            `;
            indicator.style.zIndex = '1050';
            document.body.appendChild(indicator);
        }
    },

    // Show access denied message
    showAccessDenied() {
        document.body.innerHTML = `
            <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
                <div class="text-center">
                    <div class="text-danger mb-4">
                        <i class="fas fa-lock fa-4x"></i>
                    </div>
                    <h1 class="display-4 text-danger">Acceso Denegado</h1>
                    <p class="lead">No tienes permisos para acceder a esta página.</p>
                    <div class="mt-4">
                        <a href="/index.html" class="btn btn-primary me-2">
                            <i class="fas fa-home me-1"></i> Ir al Inicio
                        </a>
                        <a href="/pages/login.html" class="btn btn-outline-primary">
                            <i class="fas fa-sign-in-alt me-1"></i> Iniciar Sesión
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
};

// Route guard function
export const routeGuard = (requiredRole = null, redirectPath = '/pages/login.html') => {
    const currentPath = window.location.pathname;
    
    // Check if page requires authentication
    if (!UserManager.hasPageAccess(currentPath)) {
        if (!UserManager.isAuthenticated()) {
            window.location.href = redirectPath;
            return false;
        } else {
            UIManager.showAccessDenied();
            return false;
        }
    }

    // Check specific role requirement
    if (requiredRole && !UserManager.hasRole(requiredRole)) {
        UIManager.showAccessDenied();
        return false;
    }

    return true;
};

// Initialize system when DOM is loaded
export const initializeRoleSystem = () => {
    // Check page access
    const currentPath = window.location.pathname;
    
    if (!routeGuard()) {
        return; // Access denied, don't continue initialization
    }

    // Initialize UI
    UIManager.initializePage();
    
    // Add event listeners
    document.addEventListener('DOMContentLoaded', () => {
        // Update any auth-dependent elements
        const authElements = document.querySelectorAll('[data-auth]');
        authElements.forEach(element => {
            const requiredRole = element.dataset.auth;
            if (requiredRole && !UserManager.hasRole(requiredRole)) {
                element.style.display = 'none';
            }
        });

        // Update role-specific content
        const roleElements = document.querySelectorAll('[data-role]');
        roleElements.forEach(element => {
            const allowedRoles = element.dataset.role.split(',');
            const userData = UserManager.getUserData();
            if (!allowedRoles.includes(userData.role) && !allowedRoles.includes('*')) {
                element.style.display = 'none';
            }
        });
    });

    console.log('✅ Role management system initialized');
};

// Auto-initialize if this script is loaded
if (typeof window !== 'undefined') {
    // Make functions globally available
    window.UserManager = UserManager;
    window.UIManager = UIManager;
    window.routeGuard = routeGuard;
    window.initializeRoleSystem = initializeRoleSystem;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRoleSystem);
    } else {
        initializeRoleSystem();
    }
}
