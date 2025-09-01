/**
 * Catalyst HR System - Authentication Module
 * 
 * Handles user authentication, session management, and login/registration
 * processes for the Catalyst HR platform. Provides both demo user authentication
 * and integration with the backend API for production use.
 * 
 * @author Catalyst HR Team
 * @version 1.0.0
 */

// Import required modules
import { showToast } from './ui.js';                     // UI notification system
import { apiRequest, authenticateUser, registerUser } from './api-simple.js'; // API communication
import { ROLES, DEPARTMENTS, updateAuthUI } from './roles.js';         // Role and department constants
import { createRoleBadge, handleLoginRedirect } from './guards.js'; // Security guards
import { getGamificationEngine } from './gamification-stub.js'; // Gamification tracking

/**
 * Email Validation Function
 * 
 * Validates email addresses using a regular expression pattern.
 * Ensures proper email format before authentication attempts.
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Password Strength Validation
 * 
 * Validates password meets minimum security requirements.
 * Currently requires minimum 8 characters.
 * 
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets strength requirements
 */
const isStrongPassword = (password) => {
    return password.length >= 8; // Minimum 8 characters
};

/**
 * Generate Unique Session ID
 * 
 * Creates a unique session identifier for tracking user sessions.
 * Combines timestamp with random string for uniqueness.
 * 
 * @returns {string} Unique session identifier
 */
const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Check Session Validity
 * 
 * Verifies if the current user session is still valid based on:
 * - Session start timestamp exists
 * - User has valid session ID
 * - Session hasn't exceeded 24-hour limit
 * 
 * @returns {boolean} True if session is valid and not expired
 */
export const isSessionValid = () => {
    const sessionStart = localStorage.getItem('sessionStart');
    const userData = getUserData();
    
    if (!sessionStart || !userData.sessionId) {
        return false;
    }
    
    // Session expires after 24 hours for security
    const sessionAge = Date.now() - parseInt(sessionStart);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    return sessionAge < maxAge;
};

/**
 * Update User Activity Timestamp
 * 
 * Updates the last activity timestamp for the current user.
 * Used for session management and activity tracking.
 */
export const updateActivity = () => {
    const userData = getUserData();
    if (userData.id) {
        userData.lastActivity = Date.now();
        localStorage.setItem('userData', JSON.stringify(userData));
    }
};

/**
 * Get User Data Safely
 * 
 * Safely retrieves user data from localStorage with error handling.
 * Returns empty object if data is corrupted or doesn't exist.
 * 
 * @returns {Object} User data object or empty object if invalid
 */
const getUserData = () => {
    try {
        return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch (error) {
        console.error('Error parsing user data:', error);
        return {};
    }
};


/**
 * Clean up old authentication system data
 * 
 * Removes any leftover localStorage keys from the old modules/auth system
 * to prevent conflicts with the main authentication system.
 */
const cleanupOldAuthData = () => {
    // Remove old auth system keys that conflict with main system
    localStorage.removeItem('currentUser');
};

/**
 * Main Authentication Handler
 * 
 * Sets up event listeners for login and registration forms.
 * Handles both demo user authentication and production API integration.
 * Includes real-time form validation and session management.
 */
export const handleAuth = () => {
    // Clean up any old auth data on initialization
    cleanupOldAuthData();
    // ==========================================
    // LOGIN FORM HANDLER
    // ==========================================
    
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            // Client-side validation before attempting authentication
            if (!isValidEmail(email)) {
                showToast("Please enter a valid email", "error");
                return;
            }

            if (!password) {
                showToast("Please enter your password", "error");
                return;
            }

            /**
             * Demo User Accounts
             * 
             * Pre-configured demo accounts for testing different role functionalities.
             * Each demo user has specific permissions and access levels.
             * Default password: '123456' for all demo accounts.
             */
            const demoUsers = {
                "demo@catalyst.com": {
                    id: "999",
                    email: "demo@catalyst.com",
                    firstName: "Demo",
                    lastName: "User",
                    title: "Full Stack Developer",
                    role: ROLES.USER,                    // Regular user - job search and applications
                    department: DEPARTMENTS.TECHNOLOGY,
                    sessionId: generateSessionId()
                },
                "admin@catalyst.com": {
                    id: "998",
                    email: "admin@catalyst.com",
                    firstName: "System",
                    lastName: "Administrator",
                    title: "System Administrator",
                    role: ROLES.ADMIN,                   // Full system access
                    department: DEPARTMENTS.MANAGEMENT,
                    sessionId: generateSessionId()
                },
                "th@catalyst.com": {
                    id: "997",
                    email: "th@catalyst.com",
                    firstName: "Human",
                    lastName: "Resources",
                    title: "HR Specialist",
                    role: ROLES.RECRUITER,               // HR operations access
                    department: DEPARTMENTS.HR,
                    sessionId: generateSessionId()
                },
                "manager@catalyst.com": {
                    id: "996",
                    email: "manager@catalyst.com",
                    firstName: "General",
                    lastName: "Manager",
                    title: "General Manager",
                    role: ROLES.MANAGER,                 // Management dashboard access
                    department: DEPARTMENTS.MANAGEMENT,
                    sessionId: generateSessionId()
                },
                "banco@catalyst.com": {
                    id: "995",
                    email: "banco@catalyst.com",
                    firstName: "Bank",
                    lastName: "Representative",
                    title: "Banking Services Representative",
                    role: ROLES.BANK_REPRESENTATIVE,     // Financial metrics access
                    department: DEPARTMENTS.BANKING,
                    sessionId: generateSessionId()
                },
                "hiring@catalyst.com": {
                    id: "994",
                    email: "hiring@catalyst.com",
                    firstName: "Hiring",
                    lastName: "Manager",
                    title: "Hiring Manager",
                    role: ROLES.HIRING_MANAGER,          // Job posting and candidate review
                    department: DEPARTMENTS.TECHNOLOGY,
                    sessionId: generateSessionId()
                },
                // Multiple Juan accounts with different roles
                "juan@catalyst.com-admin": {
                    id: "993",
                    email: "juan@catalyst.com",
                    firstName: "Juan",
                    lastName: "Martínez",
                    title: "System Administrator",
                    role: ROLES.ADMIN,
                    department: DEPARTMENTS.MANAGEMENT,
                    sessionId: generateSessionId()
                },
                "juan@catalyst.com-hr": {
                    id: "992",
                    email: "juan@catalyst.com",
                    firstName: "Juan",
                    lastName: "Silva",
                    title: "HR Specialist",
                    role: ROLES.RECRUITER,
                    department: DEPARTMENTS.HR,
                    sessionId: generateSessionId()
                },
                "juan@catalyst.com-manager": {
                    id: "991",
                    email: "juan@catalyst.com",
                    firstName: "Juan",
                    lastName: "Torres",
                    title: "Hiring Manager",
                    role: ROLES.HIRING_MANAGER,
                    department: DEPARTMENTS.TECHNOLOGY,
                    sessionId: generateSessionId()
                },
                "juan@catalyst.com-employee": {
                    id: "990",
                    email: "juan@catalyst.com",
                    firstName: "Juan",
                    lastName: "Gómez",
                    title: "Senior Developer",
                    role: ROLES.USER,
                    department: DEPARTMENTS.TECHNOLOGY,
                    sessionId: generateSessionId()
                },
                "juan@catalyst.com-candidate": {
                    id: "989",
                    email: "juan@catalyst.com",
                    firstName: "Juan",
                    lastName: "Herrera",
                    title: "Job Seeker",
                    role: ROLES.USER,
                    department: null,
                    sessionId: generateSessionId()
                }
            };

            // Special handling for Juan accounts with multiple roles
            let selectedUser = null;
            if (email === "juan@catalyst.com" && password === "123456") {
                // Show role selection modal for Juan
                const roles = [
                    { key: "juan@catalyst.com-admin", label: "Administrator", role: ROLES.ADMIN },
                    { key: "juan@catalyst.com-hr", label: "HR Specialist", role: ROLES.RECRUITER },
                    { key: "juan@catalyst.com-manager", label: "Hiring Manager", role: ROLES.HIRING_MANAGER },
                    { key: "juan@catalyst.com-employee", label: "Employee", role: ROLES.USER },
                    { key: "juan@catalyst.com-candidate", label: "Candidate", role: ROLES.USER }
                ];
                
                // Create role selection modal
                const modalHtml = `
                    <div class="modal fade" id="roleSelectionModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Select Your Role</h5>
                                </div>
                                <div class="modal-body">
                                    <p>Multiple accounts found for juan@catalyst.com. Please select your role:</p>
                                    <div class="list-group">
                                        ${roles.map(role => `
                                            <button type="button" class="list-group-item list-group-item-action role-option" data-role="${role.key}">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <span>${role.label}</span>
                                                    <span class="badge bg-primary">${role.role}</span>
                                                </div>
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Remove existing modal if it exists
                const existingModal = document.getElementById('roleSelectionModal');
                if (existingModal) {
                    existingModal.remove();
                }
                
                // Add modal to page
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                
                // Show modal
                const roleModal = new bootstrap.Modal(document.getElementById('roleSelectionModal'));
                roleModal.show();
                
                // Handle role selection
                document.querySelectorAll('.role-option').forEach(button => {
                    button.addEventListener('click', () => {
                        const selectedRoleKey = button.getAttribute('data-role');
                        selectedUser = { ...demoUsers[selectedRoleKey] };
                        
                        // Set session management timestamps
                        selectedUser.loginTime = Date.now();
                        selectedUser.lastActivity = Date.now();
                        
                        // Store authentication data in localStorage
                        localStorage.setItem("userData", JSON.stringify(selectedUser));
                        localStorage.setItem("isAuthenticated", "true");
                        localStorage.setItem("sessionStart", Date.now().toString());
                        
                        // Close modals
                        roleModal.hide();
                        const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
                        if (loginModal) loginModal.hide();
                        
                        // Show success message with user's name
                        showToast(`Welcome ${selectedUser.firstName}! Login successful as ${selectedUser.title}.`);
                        
                        // Update navigation UI and handle redirect
                        updateAuthUI();
                        
                        // Check if we're on the login page to handle appropriate redirect
                        const isLoginPage = window.location.pathname.includes('login.html');
                        
                        if (isLoginPage) {
                            // Redirect to role-specific dashboard from login page
                            setTimeout(() => {
                                handleLoginRedirect();
                            }, 500);
                        } else {
                            // Just reload the current page if logging in from modal
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        }
                    });
                });
                
                return;
            }
            
            // Check if credentials match other demo user accounts
            if (demoUsers[email] && password === "123456") {
                const demoUser = demoUsers[email];
                
                // Set session management timestamps
                demoUser.loginTime = Date.now();
                demoUser.lastActivity = Date.now();
                
                // Store authentication data in localStorage
                localStorage.setItem("userData", JSON.stringify(demoUser));
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("sessionStart", Date.now().toString());
                
                // Close login modal
                const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
                if (loginModal) loginModal.hide();
                
                // Show success message with user's name
                showToast(`Welcome ${demoUser.firstName}! Login successful.`);
                
                // Update navigation UI and handle redirect
                updateAuthUI();
                
                // Check if we're on the login page to handle appropriate redirect
                const isLoginPage = window.location.pathname.includes('login.html');
                
                if (isLoginPage) {
                    // Redirect to role-specific dashboard from login page
                    setTimeout(() => {
                        handleLoginRedirect();
                    }, 500);
                } else {
                    // Just reload the current page if logging in from modal
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
                return;
            }

            // Attempt authentication with production API or db.json fallback
            try {
                const user = await authenticateUser(email, password);
                
                if (user) {
                    // Add session management data
                    user.loginTime = Date.now();
                    user.lastActivity = Date.now();
                    user.sessionId = generateSessionId();
                    
                    // Store authentication data
                    localStorage.setItem("userData", JSON.stringify(user));
                    localStorage.setItem("isAuthenticated", "true");
                    localStorage.setItem("sessionStart", Date.now().toString());
                    
                    // Update UI and trigger gamification system
                    updateAuthUI();
                    showToast("Welcome! You have successfully logged in.");
                    try { 
                        getGamificationEngine().trackAction('login'); 
                    } catch { 
                        // Gamification is optional, fail silently
                    }
                    
                    // Close modal and reset form
                    const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
                    if (loginModal) loginModal.hide();
                    loginForm.reset();
                    
                    // Reload page to apply authentication changes
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                } else {
                    showToast("Invalid credentials. Use demo@catalyst.com / 123456 or juan@catalyst.com / 123456", "error");
                }
            } catch (error) {
                console.error('Authentication error:', error);
                showToast("Authentication error. Please try demo credentials.", "error");
            }
        });
    }

    // Registro
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;

            // Validations
            if (!isValidEmail(email)) {
                showToast("Please enter a valid email", "error");
                return;
            }

            if (!isStrongPassword(password)) {
                showToast("Password must be at least 8 characters", "error");
                return;
            }

            if (password !== confirmPassword) {
                showToast("Passwords do not match", "error");
                return;
            }

            if (!firstName || !lastName) {
                showToast("First and last name are required", "error");
                return;
            }

            try {
                // 1. Check if user already exists
                const users = await apiRequest('/users');
                if (users.find(u => u.email === email)) {
                    showToast("This email is already registered", "error");
                    return;
                }

                // 2. Create new user object
                const newUser = {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                };
                
                // 3. Register user through API
                const createdUser = await registerUser(newUser);

                // 4. Save to localStorage and update UI with session management
                createdUser.loginTime = Date.now();
                createdUser.lastActivity = Date.now();
                createdUser.sessionId = generateSessionId();
                
                localStorage.setItem("userData", JSON.stringify(createdUser));
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("sessionStart", Date.now().toString());
                
                updateAuthUI();
                showToast("Account created successfully!");
                try { getGamificationEngine().trackAction('profile-update', { completeness: 100 }); } catch {}
                const registerModal = bootstrap.Modal.getInstance(document.getElementById("registerModal"));
                if (registerModal) registerModal.hide();
                registerForm.reset();
            } catch (error) {
                showToast("Registration error: " + error.message, "error");
            }
        });

        // Add real-time validation for fields
        const registerEmail = document.getElementById("registerEmail");
        const registerPassword = document.getElementById("registerPassword");
        const confirmPassword = document.getElementById("confirmPassword");
        const firstName = document.getElementById("firstName");
        const lastName = document.getElementById("lastName");

        if (registerEmail) {
            registerEmail.addEventListener("blur", () => {
                if (registerEmail.value && !isValidEmail(registerEmail.value)) {
                    registerEmail.classList.add("is-invalid");
                } else {
                    registerEmail.classList.remove("is-invalid");
                }
            });
        }

        if (registerPassword) {
            registerPassword.addEventListener("blur", () => {
                if (registerPassword.value && !isStrongPassword(registerPassword.value)) {
                    registerPassword.classList.add("is-invalid");
                } else {
                    registerPassword.classList.remove("is-invalid");
                }
            });
        }

        if (confirmPassword) {
            confirmPassword.addEventListener("blur", () => {
                if (confirmPassword.value && confirmPassword.value !== registerPassword.value) {
                    confirmPassword.classList.add("is-invalid");
                } else {
                    confirmPassword.classList.remove("is-invalid");
                }
            });
        }

        if (firstName) {
            firstName.addEventListener("blur", () => {
                if (!firstName.value) {
                    firstName.classList.add("is-invalid");
                } else {
                    firstName.classList.remove("is-invalid");
                }
            });
        }

        if (lastName) {
            lastName.addEventListener("blur", () => {
                if (!lastName.value) {
                    lastName.classList.add("is-invalid");
                } else {
                    lastName.classList.remove("is-invalid");
                }
            });
        }
    }
};
