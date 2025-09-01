/**
 * Main Application Controller for Catalyst HR System
 * 
 * This module serves as the central entry point and orchestrator for the entire
 * Catalyst HR platform. It coordinates authentication, routing, security guards,
 * gamification, and page-specific functionality to provide a seamless user experience.
 * 
 * Key responsibilities:
 * - Application initialization and bootstrap
 * - Security guard setup and route protection
 * - Event listener management for global interactions
 * - Dynamic loading of page-specific modules
 * - Session management and user state persistence
 * - Integration with gamification and achievement systems
 * 
 * @fileoverview Main application controller and initialization logic
 * @version 2.0.0
 * @author Catalyst Development Team
 */

// Import authentication system for login/logout functionality and UI updates
import { handleAuth, updateAuthUI } from './auth.js';

// Import job search functionality for displaying and filtering job listings
import { initJobSearch, renderJobList, handleJobDetails } from './jobs.js';

// Import UI utilities for user interface interactions and notifications
import { initUIFunctions, showToast } from './ui.js';

// Import API layer for backend communication and data fetching
import { fetchJobs, applyToJob, fetchFilteredJobs } from './api-simple.js';

// Import role management system for user permissions and access control
import { ROLES, isAuthenticated, checkRole } from './roles.js';

// Import gamification engine for XP, achievements, and engagement features
import { getGamificationEngine } from './gamification-stub.js';

// Import security guard system for route protection and access control
import { 
    initializeGuards, 
    guardNavigation, 
    getCurrentUser,
    canAccessPage
} from './guards.js';

// Import session management for user state persistence and security
import { initSessionManager } from './session-manager.js';

/**
 * Set up security route guards for page access control
 * 
 * This function implements the core security layer by validating user permissions
 * for the current page. It leverages the guards system to ensure only authorized
 * users can access protected pages based on their roles.
 * 
 * Security features:
 * - Automatic page identification from URL path
 * - Role-based access validation using the guards system
 * - Automatic redirection for unauthorized access attempts
 * - User-friendly error messages for access denials
 * - Navigation guard application for menu items
 * 
 * @returns {boolean} True if user has access to current page, false otherwise
 */
const setupRouteGuards = () => {
    // Extract current page name from URL path, defaulting to index.html for root
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Initialize security guards with comprehensive protection settings
    const hasAccess = initializeGuards(currentPage, {
        redirectOnFail: true,    // Automatically redirect unauthorized users
        showError: true,         // Display user-friendly error messages
        basePath: window.location.pathname.includes('pages/') ? '../' : '' // Adjust paths for subfolder navigation
    });
    
    // If user has access, apply additional navigation guards to menu items
    if (hasAccess) {
        guardNavigation(); // Hide/show navigation items based on user roles
    }
    
    return hasAccess;
};

/**
 * Set up global event listeners for application-wide interactions
 * 
 * This function establishes event delegation for all interactive elements
 * across the application, providing centralized event handling for:
 * - Job application submissions with authentication checks
 * - Gamification tracking for user engagement metrics
 * - Modal management for job details and login flows
 * - User activity tracking for session management
 * 
 * Security considerations:
 * - Authentication validation before sensitive actions
 * - Input validation for job IDs and user data
 * - Error handling with user-friendly feedback
 * - Integration with gamification system for engagement
 */
const setupEventListeners = () => {
    // Global click event handler using event delegation for performance
    document.addEventListener('click', async (e) => {
        
        // Handle job application button clicks with authentication and gamification
        if (e.target.id === 'applyJobBtn' || e.target.closest('#applyJobBtn')) {
            // Extract job ID from button data attributes (supports nested elements)
            const jobId = e.target.dataset.jobId || e.target.closest('#applyJobBtn').dataset.jobId;
            if (!jobId) return; // Exit early if no job ID found

            // Enforce authentication requirement for job applications
            if (!isAuthenticated()) {
                showToast('Debes iniciar sesión para aplicar', 'error');
                // Show login modal to prompt user authentication
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
                return;
            }

            try {
                // Submit job application through API
                await applyToJob(jobId);
                
                // Provide success feedback to user
                showToast('¡Has aplicado exitosamente a este empleo!');
                
                // Close job details modal after successful application
                const jobDetailsModal = bootstrap.Modal.getInstance(document.getElementById('jobDetailsModal'));
                if (jobDetailsModal) jobDetailsModal.hide();
                
                // Track successful job application for gamification system
                try { 
                    getGamificationEngine().trackAction('job-application'); 
                } catch (gamificationError) {
                    // Silent fail for gamification to prevent blocking core functionality
                    console.warn('Gamification tracking failed:', gamificationError);
                }
            } catch (error) {
                // Handle application errors with user-friendly messages
                showToast(error.message || 'Error al aplicar al empleo', 'error');
            }
        }

        // Track job detail views for engagement analytics and recommendations
        if (e.target.closest && e.target.closest('.view-details-btn')) {
            try { 
                getGamificationEngine().trackAction('job-view');
            } catch (gamificationError) {
                // Silent fail to prevent blocking job detail functionality
                console.warn('Job view tracking failed:', gamificationError);
            }
        }
    });
};

/**
 * Load page-specific JavaScript modules dynamically
 * 
 * This function implements dynamic module loading to optimize performance by only
 * loading the JavaScript modules needed for the current page. This reduces initial
 * page load time and memory usage while providing specialized functionality.
 * 
 * Features:
 * - Dynamic ES6 module imports for performance optimization
 * - Page detection based on URL pathname
 * - Error handling for failed module loads
 * - Role-specific dashboard initialization
 * - Lazy loading strategy for improved performance
 * 
 * Supported pages:
 * - Admin Dashboard: Full system administration tools
 * - Job Management: Recruiter and hiring manager tools
 * - Candidate Management: Application and interview tracking
 * - User Profile: Personal profile management and settings
 */
const loadPageSpecificScripts = () => {
    // Extract current page name from URL for module selection
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        // Administrator dashboard with full system control
        case 'admin-dashboard.html':
            import('./admin.js').then(module => {
                module.initAdminDashboard();
            }).catch(error => {
                console.error('Error loading admin.js module:', error);
            });
            break;
            
        // Recruiter dashboard for job management
        case 'gestion-empleos.html':
            import('./recruiter.js').then(module => {
                module.initRecruiterDashboard();
            }).catch(error => {
                console.error('Error loading recruiter.js module:', error);
            });
            break;
            
        // Hiring manager dashboard for candidate management
        case 'gestion-candidatos.html':
            import('./hiring-manager.js').then(module => {
                module.initHiringManagerDashboard();
            }).catch(error => {
                console.error('Error loading hiring-manager.js module:', error);
            });
            break;
            
        // User profile page for personal information management
        case 'perfil.html':
            import('./profile.js').then(module => {
                module.initProfilePage();
            }).catch(error => {
                console.error('Error loading profile.js module:', error);
            });
            break;
    }
};

/**
 * Initialize the home page with featured jobs and search functionality
 * 
 * This function handles the initialization of the main landing page, providing
 * users with an engaging interface for job discovery. It supports both direct
 * job browsing and filtered searches based on URL parameters.
 * 
 * Features:
 * - URL parameter parsing for search queries and category filters
 * - Dynamic job loading based on search criteria
 * - Featured job highlighting for improved user engagement
 * - Integration with job search and detail viewing functionality
 * - Error handling with user feedback for failed operations
 * 
 * URL parameter support:
 * - ?search=query: Filter jobs by search terms
 * - ?category=name: Filter jobs by category
 * - Combined parameters for advanced filtering
 * 
 * @async
 * @function initHomePage
 */
const initHomePage = async () => {
    // Check if current page is the home/index page (supports various URL formats)
    if (window.location.pathname.includes('../index.html') || 
        window.location.pathname === '/' || 
        window.location.pathname.endsWith('/')) {
        
        try {
            // Parse URL parameters for job filtering (search queries and categories)
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('search');
            const category = urlParams.get('category');
            
            let jobs;
            
            // Load jobs based on URL parameters (filtered search vs featured jobs)
            if (searchQuery || category) {
                // Build filter object from URL parameters
                const filters = {};
                if (searchQuery) filters.query = searchQuery;
                if (category) filters.category = category;
                
                // Fetch jobs matching the specified filters
                jobs = await fetchFilteredJobs(filters);
            } else {
                // Load featured jobs for the main homepage display
                jobs = await fetchJobs();
                // Filter to show only featured jobs, limit to 6 for optimal performance
                jobs = jobs.filter(job => job.featured).slice(0, 6);
            }
            
            // Render job listings in the UI
            renderJobList(jobs);
            
            // Initialize job search functionality (search bar, filters, etc.)
            initJobSearch();
            
            // Set up job detail modal and interaction handlers
            handleJobDetails();
            
        } catch (error) {
            // Handle errors gracefully with logging and user notification
            console.error('Error initializing home page:', error);
            showToast('Error al cargar los empleos', 'error');
        }
    }
};

/**
 * Main application initialization - Entry point for the entire Catalyst HR System
 * 
 * This is the primary initialization function that orchestrates the startup sequence
 * for the entire application. It ensures proper order of initialization to prevent
 * race conditions and provides a robust foundation for all platform functionality.
 * 
 * Initialization sequence:
 * 1. Session management setup for authenticated users
 * 2. Authentication system initialization
 * 3. UI component initialization
 * 4. Global event listener setup
 * 5. Gamification system startup
 * 6. Security guard validation
 * 7. Page-specific module loading
 * 8. Home page content initialization
 * 
 * Error handling:
 * - Graceful degradation for failed subsystems
 * - Logging for debugging and monitoring
 * - User feedback for critical failures
 * - Fallback mechanisms for offline scenarios
 */
document.addEventListener('DOMContentLoaded', () => {
    // Step 1: Initialize session management for authenticated users first
    // This ensures user state is properly restored before other systems start
    if (isAuthenticated()) {
        initSessionManager();
    }
    
    // Step 2: Initialize authentication system (login/logout handlers)
    handleAuth();
    
    // Step 3: Update authentication UI elements (login buttons, user menus)
    updateAuthUI();
    
    // Step 4: Initialize general UI functions (modals, tooltips, etc.)
    initUIFunctions();
    
    // Step 5: Set up global event listeners for user interactions
    setupEventListeners();

    // Step 6: Initialize gamification UI elements and progress displays
    try { 
        getGamificationEngine().updateProgressDisplay(); 
    } catch (gamificationError) {
        // Gamification is non-critical, continue with startup if it fails
        console.warn('Gamification system initialization failed:', gamificationError);
    }
    
    // Step 7: Validate security guards - only proceed if user has page access
    if (setupRouteGuards()) {
        // Step 8: Load specialized scripts for the current page
        loadPageSpecificScripts();
        
        // Step 9: Initialize home page content if on main page
        initHomePage();
    }
    // Note: If route guards fail, the user is automatically redirected
    // and subsequent initialization steps are skipped for security
});
