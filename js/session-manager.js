/**
 * Session Manager for Catalyst HR System
 * Handles session persistence across page navigation
 */

import { getUserData, isAuthenticated, logout } from './roles.js';
import { updateAuthUI } from './auth.js';

// Session configuration
const SESSION_CONFIG = {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    warningTime: 5 * 60 * 1000,  // 5 minutes before expiry
    checkInterval: 60 * 1000     // Check every minute
};

let sessionCheckInterval = null;
let warningShown = false;

/**
 * Initialize session management
 */
export const initSessionManager = () => {
    // Check session validity on page load
    if (!validateSession()) {
        clearSession();
        return false;
    }
    
    // Update last activity
    updateLastActivity();
    
    // Start periodic session checks
    startSessionMonitoring();
    
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for user activity
    addActivityListeners();
    
    return true;
};

/**
 * Validate current session
 */
const validateSession = () => {
    const sessionStart = localStorage.getItem('sessionStart');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const userData = getUserData();
    
    if (!isAuth || !sessionStart || !userData.id) {
        return false;
    }
    
    const sessionAge = Date.now() - parseInt(sessionStart);
    
    if (sessionAge > SESSION_CONFIG.maxAge) {
        console.log('Session expired due to age');
        return false;
    }
    
    return true;
};

/**
 * Update last activity timestamp
 */
const updateLastActivity = () => {
    const userData = getUserData();
    if (userData.id) {
        userData.lastActivity = Date.now();
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('lastActivity', Date.now().toString());
    }
};

/**
 * Clear session data
 */
const clearSession = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('sessionStart');
    localStorage.removeItem('lastActivity');
    
    if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
        sessionCheckInterval = null;
    }
};

/**
 * Start monitoring session validity
 */
const startSessionMonitoring = () => {
    if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
    }
    
    sessionCheckInterval = setInterval(() => {
        if (!validateSession()) {
            handleSessionExpiry();
            return;
        }
        
        // Check if session is close to expiry
        const sessionStart = parseInt(localStorage.getItem('sessionStart'));
        const sessionAge = Date.now() - sessionStart;
        const timeLeft = SESSION_CONFIG.maxAge - sessionAge;
        
        if (timeLeft <= SESSION_CONFIG.warningTime && !warningShown) {
            showSessionWarning(Math.floor(timeLeft / 60000)); // minutes left
        }
    }, SESSION_CONFIG.checkInterval);
};

/**
 * Handle session expiry
 */
const handleSessionExpiry = () => {
    clearSession();
    
    // Show expiry message
    if (typeof showToast === 'function') {
        showToast('Your session has expired. Please log in again.', 'warning');
    } else {
        alert('Your session has expired. Please log in again.');
    }
    
    // Update UI
    updateAuthUI();
    
    // Redirect to home if on protected page
    const protectedPages = [
        'perfil.html', 'admin-dashboard.html', 'hiring-dashboard.html',
        'job-management.html', 'user-management.html', 'reports.html',
        'metrics.html', 'kanban.html', 'resume-database.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
        setTimeout(() => {
            const isInPages = window.location.pathname.includes('/pages/');
            window.location.href = isInPages ? '../index.html' : 'index.html';
        }, 2000);
    }
};

/**
 * Show session warning before expiry
 */
const showSessionWarning = (minutesLeft) => {
    warningShown = true;
    
    const message = `Your session will expire in ${minutesLeft} minutes. Click to extend your session.`;
    
    if (typeof showToast === 'function') {
        showToast(message, 'warning', 10000);
    } else {
        const extend = confirm(message + ' Do you want to extend your session?');
        if (extend) {
            extendSession();
        }
    }
};

/**
 * Extend current session
 */
export const extendSession = () => {
    const userData = getUserData();
    if (userData.id) {
        localStorage.setItem('sessionStart', Date.now().toString());
        updateLastActivity();
        warningShown = false;
        
        if (typeof showToast === 'function') {
            showToast('Session extended successfully!', 'success');
        }
    }
};

/**
 * Handle page visibility changes
 */
const handleVisibilityChange = () => {
    if (!document.hidden && isAuthenticated()) {
        // Page became visible, check session and update activity
        if (validateSession()) {
            updateLastActivity();
        } else {
            handleSessionExpiry();
        }
    }
};

/**
 * Add activity listeners to track user interactions
 */
const addActivityListeners = () => {
    const activityEvents = ['click', 'keypress', 'scroll', 'mousemove'];
    let lastActivityUpdate = 0;
    
    const throttledUpdate = () => {
        const now = Date.now();
        if (now - lastActivityUpdate > 30000) { // Update max once per 30 seconds
            updateLastActivity();
            lastActivityUpdate = now;
        }
    };
    
    activityEvents.forEach(event => {
        document.addEventListener(event, throttledUpdate, { passive: true });
    });
};

/**
 * Manual logout with cleanup
 */
export const performLogout = () => {
    clearSession();
    
    if (typeof showToast === 'function') {
        showToast('You have been logged out successfully.', 'info');
    }
    
    // Update UI
    updateAuthUI();
    
    // Redirect to home
    setTimeout(() => {
        const isInPages = window.location.pathname.includes('/pages/');
        window.location.href = isInPages ? '../index.html' : 'index.html';
    }, 1000);
};

/**
 * Get session info
 */
export const getSessionInfo = () => {
    const sessionStart = localStorage.getItem('sessionStart');
    const lastActivity = localStorage.getItem('lastActivity');
    
    if (!sessionStart) return null;
    
    const sessionAge = Date.now() - parseInt(sessionStart);
    const timeLeft = SESSION_CONFIG.maxAge - sessionAge;
    
    return {
        sessionAge,
        timeLeft,
        lastActivity: lastActivity ? new Date(parseInt(lastActivity)) : null,
        isValid: timeLeft > 0
    };
};

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (isAuthenticated()) {
            initSessionManager();
        }
    });
}
