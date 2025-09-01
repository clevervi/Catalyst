/**
 * Simplified Authentication Module for Catalyst HR System
 * Handles user authentication and role management
 */

// User roles
export const ROLES = {
    ADMIN: 'administrador',
    HR_MANAGER: 'talentos_humanos', 
    HIRING_MANAGER: 'hiring_manager',
    MANAGER: 'manager',
    BANK_REPRESENTATIVE: 'bank_representative',
    USER: 'user'
};

// Sample users for testing
const sampleUsers = [
    {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan.perez@catalyst.com',
        role: ROLES.ADMIN,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: 2,
        name: 'María García',
        email: 'maria.garcia@catalyst.com',
        role: ROLES.HR_MANAGER,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: 3,
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@bank.com',
        role: ROLES.BANK_REPRESENTATIVE,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: 4,
        name: 'Ana López',
        email: 'ana.lopez@catalyst.com',
        role: ROLES.USER,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
];

/**
 * Get current authenticated user
 * @returns {Object|null} User object or null if not authenticated
 */
export function getCurrentUser() {
    try {
        const userData = localStorage.getItem('currentUser');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (userData && isAuthenticated === 'true') {
            return JSON.parse(userData);
        }
    } catch (error) {
        console.error('Error getting current user:', error);
    }
    return null;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true' && getCurrentUser() !== null;
}

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
export function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

/**
 * Check if user has any of the specified roles
 * @param {Array} roles - Array of roles to check
 * @returns {boolean} True if user has any of the roles
 */
export function hasAnyRole(roles) {
    const user = getCurrentUser();
    return user && roles.includes(user.role);
}

/**
 * Simulate user login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login result
 */
export async function login(email, password) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const user = sampleUsers.find(u => u.email === email);
    
    if (user && password === '123456') { // Simple password for demo
        // Store user data\n        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        return {
            success: true,
            user: user,
            message: 'Login successful'
        };
    } else {
        return {
            success: false,
            message: 'Invalid credentials. Use email from sample users and password: 123456'
        };
    }
}

/**
 * Log out current user
 */
export function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    
    // Redirect to home page
    const isInSubfolder = window.location.pathname.includes('/pages/');
    const indexPath = isInSubfolder ? '../index.html' : 'index.html';
    window.location.href = indexPath;
}

/**
 * Register new user (simplified)
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration result
 */
export async function register(userData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const existingUser = sampleUsers.find(u => u.email === userData.email);
    
    if (existingUser) {
        return {
            success: false,
            message: 'Email already registered'
        };
    }
    
    // Create new user
    const newUser = {
        id: sampleUsers.length + 1,
        name: userData.name,
        email: userData.email,
        role: ROLES.USER,
        avatar: 'https://images.unsplash.com/photo-1522075469751-3847036bdf28?w=150&h=150&fit=crop&crop=face'
    };
    
    // Add to sample users (in real app, this would be saved to database)
    sampleUsers.push(newUser);
    
    // Auto-login the user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    return {
        success: true,
        user: newUser,
        message: 'Registration successful'
    };
}

/**
 * Update authentication UI across the application
 */
export function updateAuthUI() {
    const user = getCurrentUser();
    const authenticated = isAuthenticated();
    
    // Update navigation auth buttons
    import('./navigation.js').then(({ updateNavigationAuth }) => {
        updateNavigationAuth(user, authenticated);
    }).catch(err => {
        console.warn('Could not update navigation auth:', err);
    });
    
    // Show/hide role-based content
    updateRoleBasedVisibility(user);
}

/**
 * Update visibility of role-based content
 * @param {Object} user - Current user object
 */
function updateRoleBasedVisibility(user) {
    // Show/hide elements based on data-role attribute
    document.querySelectorAll('[data-role]').forEach(element => {
        const requiredRoles = element.getAttribute('data-role').split(',');
        const userHasAccess = user && requiredRoles.includes(user.role);
        
        if (userHasAccess) {
            element.classList.remove('role-hidden');
            element.style.display = '';
        } else {
            element.classList.add('role-hidden');
            element.style.display = 'none';
        }
    });
    
    // Show/hide elements based on data-auth attribute
    document.querySelectorAll('[data-auth=\"required\"]').forEach(element => {
        if (isAuthenticated()) {
            element.classList.remove('auth-hidden');
            element.style.display = '';
        } else {
            element.classList.add('auth-hidden');
            element.style.display = 'none';
        }
    });
}

/**
 * Initialize authentication system
 */
export function initAuth() {
    // Check authentication status on page load
    updateAuthUI();
    
    // Add role-based CSS classes
    if (!document.getElementById('auth-styles')) {
        const styles = document.createElement('style');
        styles.id = 'auth-styles';
        styles.textContent = `
            .role-hidden,
            .auth-hidden {
                display: none !important;
            }
            
            .role-badge {
                font-size: 0.7rem;
                padding: 0.2rem 0.5rem;
                border-radius: 10px;
                text-transform: uppercase;
                font-weight: 600;
            }
            
            .role-badge.administrador {
                background: #dc3545;
                color: white;
            }
            
            .role-badge.talentos_humanos {
                background: #198754;
                color: white;
            }
            
            .role-badge.bank_representative {
                background: #0d6efd;
                color: white;
            }
            
            .role-badge.user {
                background: #6c757d;
                color: white;
            }
        `;
        document.head.appendChild(styles);
    }
}

// Auto-initialize auth system
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initAuth();
    });
}
