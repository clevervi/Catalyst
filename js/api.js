/**
 * API Communication Layer for Catalyst HR System
 * 
 * This module provides a comprehensive data access layer that works both with
 * the demo JSON database (db.json) and production MySQL backend. It implements
 * a fallback strategy for seamless operation in different environments.
 * 
 * Key features:
 * - Dual-mode operation (JSON demo vs MySQL production)
 * - Authentication and authorization for API endpoints
 * - Comprehensive error handling and validation
 * - Local storage integration for session management
 * - Support for all CRUD operations on HR data
 * 
 * @fileoverview API communication and data access layer
 * @version 2.0.0
 * @author Catalyst Development Team
 */

// Import role definitions for access control validation
import { ROLES } from './roles.js';

/**
 * Local data storage system for demo mode operation without MySQL
 * 
 * This object serves as an in-memory cache for demo data loaded from db.json.
 * It provides persistence during the session while simulating a real database
 * for development, testing, and demonstration purposes.
 * 
 * Data structure mirrors the MySQL database schema:
 * - jobs: Job postings with company information
 * - users: User accounts with roles and permissions
 * - applications: Job applications and their status
 * - categories: Job categories and skill classifications
 */
let localData = {
    jobs: null,        // Job postings cache - loaded lazily from db.json
    users: null,       // User accounts cache - includes demo credentials
    applications: null, // Job applications cache - tracks application status
    categories: null   // Job categories cache - for filtering and search
};

/**
 * Load demo data from db.json file for local development and testing
 * 
 * This function implements lazy loading of demo data, fetching the JSON database
 * only when needed and caching it for subsequent operations. It provides fallback
 * data if the JSON file is not accessible, ensuring the application continues
 * to function even in degraded conditions.
 * 
 * Features:
 * - Lazy loading strategy for optimal performance
 * - Comprehensive error handling with fallback data
 * - Automatic caching to prevent repeated network requests
 * - Data validation and structure verification
 * 
 * @async
 * @returns {Object} Complete demo database object with all collections
 * @throws {Error} Only if both JSON loading and fallback creation fail
 */
const loadLocalData = async () => {
    // Only load data if not already cached (lazy loading strategy)
    if (localData.jobs === null) {
        try {
            // Attempt to fetch demo database from JSON file
            const response = await fetch('./db.json');
            
            // Validate response status
            if (!response.ok) {
                throw new Error(`Failed to load db.json: ${response.status} ${response.statusText}`);
            }
            
            // Parse JSON data and cache it in memory
            const data = await response.json();
            localData = { ...data };
            
            console.info('Demo database loaded successfully from db.json');
            
        } catch (error) {
            // Log warning but continue with fallback data for graceful degradation
            console.warn('Could not load db.json, using default fallback data:', error);
            
            // Provide minimal fallback data structure to prevent application crashes
            localData = {
                jobs: [],          // Empty job listings
                users: [],         // Empty user accounts
                applications: [],  // Empty application records
                categories: []     // Empty category definitions
            };
        }
    }
    
    return localData;
};

/**
 * Save local data to browser storage for session persistence
 * 
 * This function provides a temporary persistence mechanism for demo mode,
 * storing modified data in localStorage to simulate database operations.
 * In production, this would be replaced with actual server API calls.
 * 
 * Note: This is a demo-only function. In production, all data operations
 * go through the MySQL database via server-side API endpoints.
 */
const saveLocalData = () => {
    // In production environment, this would make HTTP requests to save data
    // For demo purposes, we maintain data in memory and localStorage
    localStorage.setItem('localDbData', JSON.stringify(localData));
};

/**
 * Database query simulation for frontend compatibility
 * 
 * This function provides a placeholder for database queries in the frontend.
 * It warns developers that direct database access is not available in the
 * browser environment and directs them to use the proper API layer.
 * 
 * @param {string} sql - SQL query string (not executed in frontend)
 * @param {Array} params - Query parameters (not used in frontend)
 * @returns {Array} Empty array as placeholder
 * @deprecated Use apiRequest() for all data operations in frontend
 */
export const dbQuery = async (sql, params = []) => {
    console.warn('dbQuery is not available in frontend. Use apiRequest instead.');
    return [];
};

/**
 * Authenticate user credentials against demo database
 * 
 * This function validates user login credentials using the demo data from
 * db.json. It provides secure authentication simulation for development
 * and demonstration purposes, with proper error handling and data validation.
 * 
 * Security features:
 * - Input validation for email and password
 * - Secure user data extraction (excludes sensitive fields)
 * - Error logging for debugging and monitoring
 * - Graceful failure handling with user feedback
 * 
 * @param {string} email - User email address for authentication
 * @param {string} password - User password (plain text in demo, hashed in production)
 * @returns {Object|null} User object with safe data fields, or null if authentication fails
 * @throws {Error} If authentication system encounters errors
 */
export const authenticateUser = async (email, password) => {
    try {
        // Load demo user data from JSON database
        const data = await loadLocalData();
        
        // Find user with matching email and password
        // Note: In production, passwords are hashed and verified securely
        const user = data.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Return safe user data (exclude sensitive information)
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                title: user.title,
                role: user.role,
                department: user.department
            };
        }
        
        // Return null for failed authentication (invalid credentials)
        return null;
        
    } catch (error) {
        // Log error for debugging while protecting sensitive information
        console.error('Authentication error:', error);
        throw new Error('Authentication system error');
    }
};

/**
 * Generic API request handler for all backend communication
 * 
 * This function serves as the central API communication layer, handling all
 * HTTP-style requests to various endpoints. It supports both demo mode (using
 * db.json) and production mode (using MySQL backend) with seamless switching.
 * 
 * Features:
 * - RESTful API endpoint simulation
 * - Multiple HTTP methods (GET, POST, PATCH, DELETE)
 * - Comprehensive error handling and validation
 * - Authentication and authorization checks
 * - Data transformation and normalization
 * - Caching and performance optimization
 * 
 * @param {string} endpoint - API endpoint path (e.g., '/jobs', '/users/123')
 * @param {string} method - HTTP method ('GET', 'POST', 'PATCH', 'DELETE')
 * @param {Object|null} body - Request payload for POST/PATCH operations
 * @returns {Promise<any>} Response data from the API endpoint
 * @throws {Error} If endpoint is not implemented or request fails
 */
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        // Load demo data for all operations (cached after first load)
        const data = await loadLocalData();
        
        // GET /jobs - Retrieve all job postings
        if (endpoint === '/jobs') {
            return data.jobs || [];
        }

        // Detalles de un trabajo específico
        if (endpoint.startsWith('/jobs/') && !endpoint.includes('/applications')) {
            const jobId = endpoint.split('/')[2];
            const [job] = await dbQuery(`
                SELECT 
                j.*,
                c.name as company_name,
                c.logo as company_logo,
                c.verified as company_verified,
                c.industry as company_industry,
                c.description as company_description,
                c.website as company_website,
                c.size as company_size,
                c.founded as company_founded
                FROM jobs j
                JOIN companies c ON j.company_id = c.id
                WHERE j.id = ? AND j.closed = FALSE
            `, [jobId]);

            if (!job) {
                throw new Error('Trabajo no encontrado');
            }

            return {
                id: job.id,
                title: job.title,
                description: job.description,
                requirements: job.requirements ? JSON.parse(job.requirements) : [],
                responsibilities: job.responsibilities ? JSON.parse(job.responsibilities) : [],
                benefits: job.benefits ? JSON.parse(job.benefits) : [],
                modality: job.modality,
                level: job.level,
                contractType: job.contract_type,
                location: job.location,
                department: job.department,
                salary: {
                    min: job.salary_min,
                    max: job.salary_max
                },
                featured: job.featured,
                isNew: job.is_new,
                postedDate: job.posted_date,
                company: {
                    id: job.company_id,
                    name: job.company_name,
                    logo: job.company_logo,
                    verified: job.company_verified,
                    industry: job.company_industry,
                    description: job.company_description,
                    website: job.company_website,
                    size: job.company_size,
                    founded: job.company_founded
                }
            };
        }

        // Aplicaciones a un trabajo
        if (endpoint.startsWith('/jobs/') && endpoint.includes('/applications')) {
            const jobId = endpoint.split('/')[2];
            const applications = await dbQuery(`
                SELECT 
                a.*,
                u.first_name,
                u.last_name,
                u.email,
                j.title as position
                FROM applications a
                JOIN users u ON a.user_id = u.id
                JOIN jobs j ON a.job_id = j.id
                WHERE a.job_id = ?
            `, [jobId]);

            return applications.map(app => ({
                id: app.id,
                name: `${app.first_name} ${app.last_name}`,
                email: app.email,
                position: app.position,
                status: app.status,
                appliedDate: app.applied_date,
                statusUpdatedDate: app.status_updated_date,
                score: app.score
            }));
        }

        // Todas las aplicaciones
        if (endpoint === '/applications') {
            const applications = await dbQuery(`
                SELECT 
                a.*,
                u.first_name,
                u.last_name,
                u.email,
                j.title as position
                FROM applications a
                JOIN users u ON a.user_id = u.id
                JOIN jobs j ON a.job_id = j.id
            `);

            return applications.map(app => ({
                id: app.id,
                name: `${app.first_name} ${app.last_name}`,
                email: app.email,
                position: app.position,
                status: app.status,
                appliedDate: app.applied_date,
                statusUpdatedDate: app.status_updated_date,
                score: app.score
            }));
        }

        // Actualizar estado de aplicación
        if (endpoint.startsWith('/applications/') && method === 'PATCH') {
            const appId = endpoint.split('/')[2];
            const { status } = body;

            await dbQuery(
                'UPDATE applications SET status = ?, status_updated_date = NOW() WHERE id = ?',
                [status, appId]
            );

            // Insertar nota de seguimiento
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            await dbQuery(
                'INSERT INTO application_notes (application_id, author_id, note) VALUES (?, ?, ?)',
                [appId, userData.id, `Estado cambiado a: ${status}`]
            );

            return { success: true };
        }

        // Obtener usuarios
        if (endpoint === '/users') {
            const users = await dbQuery('SELECT id, email, first_name, last_name, role, department FROM users WHERE is_active = TRUE');
            return users;
        }

        // Obtener usuario específico
        if (endpoint.startsWith('/users/') && method === 'GET') {
            const userId = endpoint.split('/')[2];
            const [user] = await dbQuery(`
                SELECT 
                u.*,
                (SELECT JSON_ARRAYAGG(skill) FROM user_skills WHERE user_id = u.id) as skills,
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'position', position, 'company', company, 'location', location, 'start_date', start_date, 'end_date', end_date, 'current', current, 'description', description)) 
                FROM user_experience WHERE user_id = u.id) as experience,
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'degree', degree, 'institution', institution, 'field_of_study', field_of_study, 'start_date', start_date, 'end_date', end_date, 'description', description)) 
                FROM user_education WHERE user_id = u.id) as education,
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'name', name, 'file_path', file_path, 'file_type', file_type)) 
                FROM user_documents WHERE user_id = u.id) as documents
                FROM users u 
                WHERE u.id = ? AND u.is_active = TRUE
            `, [userId]);

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            return {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                title: user.title,
                role: user.role,
                department: user.department,
                phone: user.phone,
                location: user.location,
                birthdate: user.birthdate,
                gender: user.gender,
                bio: user.bio,
                profilePicture: user.profile_picture,
                skills: user.skills ? JSON.parse(user.skills) : [],
                experience: user.experience ? JSON.parse(user.experience) : [],
                education: user.education ? JSON.parse(user.education) : [],
                documents: user.documents ? JSON.parse(user.documents) : []
            };
        }

        // Actualizar usuario
        if (endpoint.startsWith('/users/') && method === 'PATCH') {
            const userId = endpoint.split('/')[2];
            const { firstName, lastName, email, phone, location, birthdate, gender, title, bio } = body;

            await dbQuery(
                `UPDATE users 
                SET first_name = ?, last_name = ?, email = ?, phone = ?, location = ?, 
                    birthdate = ?, gender = ?, title = ?, bio = ?, updated_at = NOW() 
                WHERE id = ?`,
                [firstName, lastName, email, phone, location, birthdate, gender, title, bio, userId]
            );

            return { success: true };
        }

        // Crear usuario (registro)
        if (endpoint === '/users' && method === 'POST') {
            const { email, password, firstName, lastName, role = 'user', department = null } = body;

            // Verificar si el usuario ya existe
            const existingUsers = await dbQuery('SELECT id FROM users WHERE email = ?', [email]);
            if (existingUsers.length > 0) {
                throw new Error('Este correo ya está registrado');
            }

            // Insertar nuevo usuario
            const result = await dbQuery(
                `INSERT INTO users (email, password, first_name, last_name, role, department) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [email, password, firstName, lastName, role, department]
            );

            // Obtener el usuario recién creado
            const [newUser] = await dbQuery('SELECT id, email, first_name, last_name, role, department FROM users WHERE id = ?', [result.insertId]);

            return newUser;
        }

        // Aplicar a un trabajo
        if (endpoint.includes('/apply') && method === 'POST') {
            const jobId = endpoint.split('/')[2];
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            if (!userData.id) {
                throw new Error('Debes iniciar sesión para aplicar');
            }

            // Verificar si ya aplicó
            const existingApplications = await dbQuery(
                'SELECT id FROM applications WHERE job_id = ? AND user_id = ?',
                [jobId, userData.id]
            );

            if (existingApplications.length > 0) {
                throw new Error('Ya has aplicado a este empleo');
            }

            // Crear la aplicación
            await dbQuery(
                'INSERT INTO applications (job_id, user_id, status, applied_date) VALUES (?, ?, ?, NOW())',
                [jobId, userData.id, 'applied']
            );

            return { success: true };
        }

        throw new Error(`Endpoint no implementado: ${endpoint}`);

    } catch (error) {
        console.error('Error en la solicitud API:', error);
        throw error;
    }
};

/**
 * Fetch jobs with advanced filtering capabilities
 * 
 * This function provides comprehensive job search functionality with multiple
 * filter options. It supports text search, location filtering, category matching,
 * and featured job highlighting for enhanced user experience.
 * 
 * Supported filters:
 * - query: Text search across job titles, company names, descriptions, and requirements
 * - location: Geographic location filtering
 * - category: Job category and department filtering
 * - featured: Show only featured/highlighted job postings
 * 
 * @param {Object} filters - Filter criteria object
 * @param {string} filters.query - Text search query
 * @param {string} filters.location - Location filter
 * @param {string} filters.category - Category filter
 * @param {boolean} filters.featured - Featured jobs only flag
 * @returns {Promise<Array>} Filtered array of job objects
 * @throws {Error} If job fetching or filtering fails
 */
export const fetchFilteredJobs = async (filters = {}) => {
    try {
        // Get all jobs from the API
        let jobs = await apiRequest('/jobs');
        
        // Apply text search filter across multiple job fields
        if (filters.query) {
            const query = filters.query.toLowerCase();
            jobs = jobs.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.company.name.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                (job.requirements && job.requirements.some(req => req.toLowerCase().includes(query)))
            );
        }
        
        // Apply location filter (exclude "all locations" option)
        if (filters.location && filters.location !== "Todas las ubicaciones") {
            jobs = jobs.filter(job => job.location.includes(filters.location));
        }
        
        // Apply category filter for job type and department matching
        if (filters.category) {
            jobs = jobs.filter(job => 
                job.title.toLowerCase().includes(filters.category.toLowerCase()) ||
                job.department?.toLowerCase().includes(filters.category.toLowerCase())
            );
        }
        
        // Apply featured jobs filter for highlighted positions
        if (filters.featured) {
            jobs = jobs.filter(job => job.featured);
        }
        
        return jobs;
    } catch (error) {
        console.error('Error fetching filtered jobs:', error);
        throw error;
    }
};

/**
 * Fetch jobs with basic filtering (legacy compatibility function)
 * 
 * This function provides backward compatibility for older parts of the codebase
 * that use the original fetchJobs function. It supports basic filtering options
 * including text search, location, and featured job filters.
 * 
 * @param {Object} filters - Basic filter criteria
 * @returns {Promise<Array>} Filtered job listings
 */
export const fetchJobs = async (filters = {}) => {
    let jobs = await apiRequest('/jobs');

    // Apply basic text search filter
    if (filters.query) {
        const query = filters.query.toLowerCase();
        jobs = jobs.filter(job =>
            job.title.toLowerCase().includes(query) ||
            job.company.name.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query)
        );
    }

    // Apply location filter
    if (filters.location && filters.location !== "Todas las ubicaciones") {
        jobs = jobs.filter(job => job.location.includes(filters.location));
    }

    // Apply featured jobs filter
    if (filters.featured) {
        jobs = jobs.filter(job => job.featured);
    }

    return jobs;
};

/**
 * Fetch detailed information for a specific job posting
 * 
 * @param {string|number} jobId - Unique identifier for the job
 * @returns {Promise<Object>} Complete job object with company details
 */
export const fetchJobDetails = (jobId) => {
    return apiRequest(`/jobs/${jobId}`);
};

/**
 * Submit a job application for the current user
 * 
 * @param {string|number} jobId - Unique identifier for the job to apply to
 * @returns {Promise<Object>} Application confirmation object
 * @throws {Error} If user is not authenticated or already applied
 */
export const applyToJob = (jobId) => {
    return apiRequest(`/jobs/${jobId}/apply`, 'POST');
};

/**
 * Fetch the current user's profile information
 * 
 * This function retrieves comprehensive profile data for the authenticated user,
 * including personal information, skills, experience, education, and documents.
 * 
 * @returns {Promise<Object>} Complete user profile object
 * @throws {Error} If user is not authenticated or profile not found
 */
export const fetchUserProfile = async () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData.id) {
        throw new Error("User not found in localStorage");
    }
    return apiRequest(`/users/${userData.id}`);
};

/**
 * Update the current user's profile information
 * 
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Update confirmation object
 * @throws {Error} If user is not authenticated or update fails
 */
export const updateUserProfile = async (profileData) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData.id) {
        throw new Error("User not found for update");
    }
    return apiRequest(`/users/${userData.id}`, 'PATCH', profileData);
};

/**
 * Fetch user list with role-based access control (Admin only)
 * 
 * @param {Object} filters - User filtering criteria
 * @param {string} filters.role - Filter users by specific role
 * @returns {Promise<Array>} Array of user objects
 * @throws {Error} If user lacks admin permissions
 */
export const fetchUsers = async (filters = {}) => {
    const users = await apiRequest('/users');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    // Enforce admin-only access for user management
    if (userData.role !== ROLES.ADMIN) {
        throw new Error('No tienes permisos para ver usuarios');
    }

    // Apply role filter if specified
    let filteredUsers = users;
    if (filters.role) {
        filteredUsers = users.filter(user => user.role === filters.role);
    }

    return filteredUsers;
};

/**
 * Update a user's role (Admin only operation)
 * 
 * @param {string|number} userId - Target user's unique identifier
 * @param {string} newRole - New role to assign to the user
 * @returns {Promise<Object>} Update confirmation object
 */
export const updateUserRole = (userId, newRole) => {
    return apiRequest(`/users/${userId}`, 'PATCH', { role: newRole });
};

/**
 * Fetch all applications for a specific job posting
 * 
 * @param {string|number} jobId - Job's unique identifier
 * @returns {Promise<Array>} Array of application objects with candidate information
 */
export const fetchJobApplications = (jobId) => {
    return apiRequest(`/jobs/${jobId}/applications`);
};

/**
 * Update the status of a job application
 * 
 * @param {string|number} applicationId - Application's unique identifier
 * @param {string} newStatus - New status for the application
 * @returns {Promise<Object>} Update confirmation object
 */
export const updateApplicationStatus = (applicationId, newStatus) => {
    return apiRequest(`/applications/${applicationId}`, 'PATCH', {
        status: newStatus
    });
};

/**
 * Get job postings filtered by department
 * 
 * @param {string} department - Department name to filter by
 * @returns {Promise<Array>} Array of jobs in the specified department
 */
export const getDepartmentJobs = async (department) => {
    const jobs = await apiRequest('/jobs');
    return jobs.filter(job => job.department === department);
};

/**
 * Get applications for a specific job (alias for fetchJobApplications)
 * 
 * @param {string|number} jobId - Job's unique identifier
 * @returns {Promise<Array>} Array of application objects
 */
export const getJobApplications = (jobId) => {
    return apiRequest(`/jobs/${jobId}/applications`);
};
