/**
 * User Interface Management System for Catalyst HR Platform
 * 
 * This module provides comprehensive UI functionality including mobile navigation,
 * modal management, filtering interfaces, scroll effects, tooltips, and form
 * enhancements. It ensures a smooth and accessible user experience across all
 * devices and screen sizes.
 * 
 * Key features:
 * - Responsive mobile navigation with accessibility support
 * - Bootstrap modal management and lifecycle handling
 * - Advanced filtering interfaces with click-outside dismissal
 * - Dynamic scroll effects for improved UX
 * - Comprehensive tooltip initialization
 * - Secure password input toggles
 * - Toast notification system
 * - Loading state management
 * - Utility functions for formatting and performance
 * 
 * @fileoverview UI management and interaction system
 * @version 2.0.0
 * @author Catalyst Development Team
 */

// Import API functions for job data integration in UI components
import { fetchJobs } from './api.js';

/**
 * Initialize all UI functionality and interactive components
 * 
 * This is the main initialization function that sets up all UI systems
 * in the correct order to ensure proper functionality and avoid race conditions.
 * 
 * Initialization order:
 * 1. Mobile navigation for responsive design
 * 2. Modal management for dialog systems
 * 3. Filter interfaces for job search
 * 4. Scroll effects for dynamic headers
 * 5. Tooltips for enhanced user guidance
 * 6. Password toggles for secure form inputs
 */
export const initUIFunctions = () => {
    initMobileMenu();     // Set up mobile navigation toggle
    initModals();         // Configure Bootstrap modal behavior
    initFilters();        // Initialize filter panel interactions
    initScrollEffects();  // Set up dynamic scroll-based styling
    initTooltips();       // Initialize all Bootstrap tooltips
    initPasswordToggle(); // Set up password visibility toggles
};

/**
 * Initialize mobile navigation menu with accessibility features
 * 
 * This function sets up the mobile navigation toggle functionality,
 * ensuring proper accessibility attributes and smooth operation on
 * touch devices and small screens.
 */
const initMobileMenu = () => {
    // Find mobile navigation elements
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Set up toggle functionality if elements exist
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            // Toggle menu visibility
            mobileMenu.classList.toggle('show');
            
            // Update accessibility attribute for screen readers
            menuToggle.setAttribute('aria-expanded', mobileMenu.classList.contains('show'));
        });
    }
};

/**
 * Initialize Bootstrap modal management with custom behaviors
 * 
 * This function enhances Bootstrap modals with additional functionality
 * including body scroll management and custom lifecycle hooks for
 * improved user experience and proper state management.
 */
const initModals = () => {
    // Find all modal elements in the page
    const modals = document.querySelectorAll('.modal');
    
    // Set up lifecycle event handlers for each modal
    modals.forEach(modal => {
        // Handle modal opening - prevent body scroll
        modal.addEventListener('show.bs.modal', () => {
            document.body.classList.add('modal-open');
        });
        
        // Handle modal closing - restore body scroll
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.classList.remove('modal-open');
        });
    });
};

/**
 * Initialize filter panel with click-outside dismissal
 * 
 * This function sets up the job filter panel functionality,
 * including toggle behavior and automatic dismissal when
 * clicking outside the panel area.
 */
const initFilters = () => {
    // Find filter panel elements
    const filterBtn = document.getElementById('filterBtn');
    const filterPanel = document.getElementById('filterPanel');
    
    if (filterBtn && filterPanel) {
        // Set up filter toggle button
        filterBtn.addEventListener('click', () => {
            filterPanel.classList.toggle('show');
        });
        
        // Set up click-outside dismissal
        document.addEventListener('click', (e) => {
            // Close panel if click is outside panel and not on toggle button
            if (!filterPanel.contains(e.target) && e.target !== filterBtn) {
                filterPanel.classList.remove('show');
            }
        });
    }
};

/**
 * Initialize dynamic scroll effects for header styling
 * 
 * This function adds scroll-based styling to the header element,
 * creating a modern scrolled effect when users scroll down the page.
 * This improves visual hierarchy and navigation clarity.
 */
const initScrollEffects = () => {
    // Find the main header element
    const header = document.querySelector('.header');
    
    if (header) {
        // Set up scroll event listener with performance optimization
        window.addEventListener('scroll', () => {
            // Add/remove scrolled class based on scroll position
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
};

/**
 * Initialize Bootstrap tooltips for enhanced user guidance
 * 
 * This function finds all elements with tooltip data attributes
 * and initializes Bootstrap tooltip functionality for improved
 * user experience and interface guidance.
 */
const initTooltips = () => {
    // Find all elements with tooltip attributes
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    
    // Initialize Bootstrap tooltip for each element
    tooltipTriggerList.map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
};

/**
 * Initialize password visibility toggle functionality
 * 
 * This function sets up password input toggles that allow users
 * to show/hide password text for better usability while maintaining
 * security. It includes proper icon updates and accessibility support.
 */
const initPasswordToggle = () => {
    // Find all password toggle buttons
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    // Set up toggle functionality for each password field
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Prevent form submission when clicking toggle
            e.preventDefault();
            
            // Find associated input field and icon
            const input = toggle.previousElementSibling;
            const icon = toggle.querySelector('i');
            
            // Toggle between password and text input types
            if (input.type === 'password') {
                input.type = 'text';  // Show password text
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password'; // Hide password text
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
};

/**
 * Display toast notification messages to users
 * 
 * This function creates and displays Bootstrap toast notifications for user
 * feedback. It supports different message types (success, error, warning)
 * with appropriate styling and automatic cleanup.
 * 
 * Features:
 * - Automatic cleanup of existing toasts to prevent overlap
 * - Customizable message types with appropriate styling
 * - Accessibility support with ARIA attributes
 * - Auto-hide functionality with configurable delay
 * - Proper z-index management for modal compatibility
 * - DOM cleanup after toast dismissal
 * 
 * @param {string} message - Message text to display in the toast
 * @param {string} type - Toast type ('success', 'error', 'warning')
 */
export const showToast = (message, type = 'success') => {
    // Remove any existing toast notifications to prevent stacking
    const existingToasts = document.querySelectorAll('.toast-container');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast container with fixed positioning
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999'; // Ensure visibility above modals
    
    // Generate unique ID for this toast instance
    const toastId = 'liveToast-' + Date.now();
    
    // Create toast HTML with appropriate styling based on type
    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${type === 'error' ? 'bg-danger text-white' : 'bg-success text-white'}">
                <strong class="me-auto">${type === 'error' ? 'Error' : 'Éxito'}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    // Insert toast into container and add to DOM
    toastContainer.innerHTML = toastHTML;
    document.body.appendChild(toastContainer);
    
    // Initialize Bootstrap toast with auto-hide configuration
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,   // Automatically hide after delay
        delay: 5000       // 5 second display duration
    });
    
    // Show the toast notification
    toast.show();
    
    // Clean up DOM after toast is hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
    });
};

/**
 * Display loading spinner in a specified element
 * 
 * This function replaces the content of an element with a loading spinner,
 * storing the original content for restoration. It also disables the element
 * to prevent user interaction during loading states.
 * 
 * @param {HTMLElement} element - Target element to show loading state in
 */
export const showLoading = (element) => {
    // Validate element exists
    if (!element) return;
    
    // Store original content for later restoration
    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;
    
    // Replace content with Bootstrap loading spinner
    element.innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="min-height: 100px;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    // Disable element to prevent interaction
    element.disabled = true;
};

/**
 * Hide loading spinner and restore original content
 * 
 * This function restores the original content of an element after a loading
 * operation completes, re-enabling user interaction.
 * 
 * @param {HTMLElement} element - Target element to restore from loading state
 */
export const hideLoading = (element) => {
    // Validate element exists and has stored content
    if (!element || !element.dataset.originalContent) return;
    
    // Restore original content
    element.innerHTML = element.dataset.originalContent;
    
    // Re-enable element interaction
    element.disabled = false;
    
    // Clean up stored data
    delete element.dataset.originalContent;
};

/**
 * Format date strings for localized display
 * 
 * This function converts date strings into human-readable format
 * using Spanish locale settings for consistent date presentation
 * throughout the application.
 * 
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date string in Spanish locale
 */
export const formatDate = (dateString) => {
    // Handle empty or null date strings
    if (!dateString) return 'Fecha no disponible';
    
    try {
        // Parse and format date with Spanish locale
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        // Handle invalid date strings gracefully
        console.warn('Date formatting error:', error);
        return 'Fecha inválida';
    }
};

/**
 * Format currency amounts with proper localization
 * 
 * This function formats numeric amounts as currency strings using
 * Spanish locale conventions for consistent monetary display.
 * 
 * @param {number} amount - Numeric amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

/**
 * Create debounced function for performance optimization
 * 
 * This utility function creates a debounced version of any function,
 * preventing excessive calls during rapid user interactions (like typing
 * in search fields). This improves performance and reduces API calls.
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds before function execution
 * @returns {Function} Debounced version of the input function
 */
export const debounce = (func, wait) => {
    let timeout;
    
    // Return wrapped function that implements debouncing
    return function executedFunction(...args) {
        // Define delayed execution function
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        // Clear existing timeout and set new one
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
