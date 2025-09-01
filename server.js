/**
 * Catalyst HR System - Main Server Application
 * 
 * A comprehensive Node.js server for the Catalyst HR platform that handles:
 * - User authentication and authorization
 * - Job management and applications
 * - Training course delivery
 * - File uploads and document management
 * - Role-based access control
 * - Activity logging and analytics
 * 
 * @author Catalyst HR Team
 * @version 1.0.0
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required Node.js modules
const express = require('express');           // Web framework for Node.js
const mysql = require('mysql2/promise');      // MySQL database driver with Promise support
const bcrypt = require('bcrypt');             // Password hashing library
const jwt = require('jsonwebtoken');          // JSON Web Token library for authentication
const cors = require('cors');                 // Cross-Origin Resource Sharing middleware
const multer = require('multer');             // File upload handling middleware
const path = require('path');                 // Node.js path utilities
const fs = require('fs').promises;            // File system operations with Promises
const { validationResult } = require('express-validator'); // Input validation utilities

// Import custom validation rules
const { registerValidation, loginValidation } = require('./validators/authValidator');
const { createJobValidation, applyJobValidation, getJobsValidation } = require('./validators/jobValidator');
const { getCoursesValidation, enrollCourseValidation } = require('./validators/courseValidator');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;        // Server port from environment or default
const JWT_SECRET = "catalyst-hr-secret-key-2024"; // JWT secret for token signing

// =========================================
// MIDDLEWARE SETUP
// =========================================

/**
 * CORS (Cross-Origin Resource Sharing) configuration
 * Allows the frontend to make requests to the backend from different origins
 * Essential for local development and testing
 */
app.use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:5500'],
    credentials: true  // Allow cookies and credentials to be sent
}));

/**
 * Body parsing middleware
 * - JSON parser with 10MB limit for API requests
 * - URL-encoded parser for form submissions
 * - Static file serving for frontend assets
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

/**
 * File upload configuration using Multer
 * Handles resume uploads, profile pictures, and other documents
 * Implements security checks and file type validation
 */
const storage = multer.diskStorage({
    // Specify upload destination directory
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
    // Generate unique filenames to prevent conflicts
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

/**
 * Multer upload configuration with security restrictions
 * - 10MB file size limit
 * - Allowed file types: images, PDFs, Word documents
 * - File type validation using both extension and MIME type
 */
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit to prevent abuse
    },
    fileFilter: (req, file, cb) => {
        // Define allowed file types for security
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);  // File is valid
        } else {
            cb(new Error('Invalid file type')); // Reject invalid files
        }
    }
});

// =========================================
// DATABASE CONNECTION
// =========================================

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    authPlugins: {
        mysql_native_password: () => () => Buffer.alloc(0)
    }
};

const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}

// =========================================
// AUTHENTICATION MIDDLEWARE
// =========================================

/**
 * JWT Token Authentication Middleware
 * 
 * Validates JWT tokens from the Authorization header and attaches
 * user information to the request object for use in protected routes.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object 
 * @param {Function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
    // Extract token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Return error if no token provided
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    // Verify the JWT token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        // Attach user information to request for use in route handlers
        req.user = user;
        next();
    });
};

/**
 * Role-Based Authorization Middleware
 * 
 * Creates middleware function that checks if the authenticated user
 * has one of the required roles to access a specific resource.
 * 
 * @param {...string} roles - List of allowed roles for the route
 * @returns {Function} Express middleware function
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Ensure user is authenticated first
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        // Check if user's role is in the allowed roles list
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        next(); // User has required role, proceed to route handler
    };
};

/**
 * Input Validation Middleware
 * 
 * Runs express-validator validation rules and returns validation
 * errors if any fields fail validation. This provides security
 * against malformed or malicious input data.
 * 
 * @param {Array} validations - Array of validation rules to run
 * @returns {Function} Express middleware function
 */
const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validation rules in parallel
        await Promise.all(validations.map(validation => validation.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next(); // No errors, proceed to route handler
        }

        // Return validation errors to client
        res.status(400).json({ errors: errors.array() });
    };
};

/**
 * USER REGISTRATION ENDPOINT
 * 
 * Creates a new user account with role-based access control.
 * Validates input data, hashes passwords, and generates authentication tokens.
 * 
 * @route POST /api/auth/register
 * @access Public (but creates different access levels based on roleId)
 * @param {string} email - User's email address (must be unique)
 * @param {string} password - User's password (will be hashed)
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} phone - User's phone number
 * @param {number} roleId - Role ID (defaults to 6 for regular user)
 */
app.post('/api/auth/register', registerValidation, validate(registerValidation), async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, roleId = 6 } = req.body;
        
        // Check if user already exists to prevent duplicate accounts
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password using bcrypt with salt rounds = 10 for security
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Insert new user into database with secure password hash
        const [result] = await pool.execute(
            `INSERT INTO users (email, password_hash, first_name, last_name, phone, role_id, status, email_verified) 
             VALUES (?, ?, ?, ?, ?, ?, 'active', FALSE)`,
            [email, passwordHash, firstName, lastName, phone, roleId]
        );
        
        // Retrieve complete user data including role information
        const [userData] = await pool.execute(
            `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.department, 
                    r.name as role_name, r.display_name as role_display_name
             FROM users u
             JOIN roles r ON u.role_id = r.id
             WHERE u.id = ?`,
            [result.insertId]
        );
        
        // Generate JWT token with user information and role
        const token = jwt.sign(
            { 
                userId: userData[0].id, 
                email: userData[0].email, 
                role: userData[0].role_name 
            },
            JWT_SECRET,
            { expiresIn: '24h' }  // Token expires in 24 hours
        );
        
        // Log user registration activity for audit trail
        await pool.execute(
            'INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)',
            [userData[0].id, 'register', 'User registered successfully', req.ip]
        );
        
        // Send success response with user data and token
        res.status(201).json({
            message: 'User registered successfully',
            user: userData[0],
            token
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

/**
 * USER LOGIN ENDPOINT
 * 
 * Authenticates users and provides JWT tokens for subsequent API calls.
 * Verifies credentials, updates login timestamps, and logs activity.
 * 
 * @route POST /api/auth/login
 * @access Public
 * @param {string} email - User's email address
 * @param {string} password - User's password (plain text, verified against hash)
 */
app.post('/api/auth/login', loginValidation, validate(loginValidation), async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Retrieve user data with role and permissions
        const [users] = await pool.execute(
            `SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, 
                    u.phone, u.department, u.status, u.profile_image,
                    r.name as role_name, r.display_name as role_display_name, r.permissions
             FROM users u
             JOIN roles r ON u.role_id = r.id
             WHERE u.email = ? AND u.status = 'active'`,
            [email]
        );
        
        // Check if user exists and is active
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // Verify password against stored hash using bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate JWT token with user info, role, and permissions
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role_name,
                permissions: user.permissions
            },
            JWT_SECRET,
            { expiresIn: '24h' }  // Token valid for 24 hours
        );
        
        // Update last login timestamp for analytics and security
        await pool.execute(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );
        
        // Log successful login activity for audit trail
        await pool.execute(
            'INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)',
            [user.id, 'login', 'User logged in successfully', req.ip]
        );
        
        // Remove password hash from response for security
        delete user.password_hash;
        
        // Send success response with user data and authentication token
        res.json({
            message: 'Login successful',
            user,
            token
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * GET CURRENT USER PROFILE ENDPOINT
 * 
 * Retrieves comprehensive profile information for the authenticated user.
 * Includes user details, role information, and extended profile data.
 * 
 * @route GET /api/auth/me
 * @access Private (requires valid JWT token)
 * @returns {Object} Complete user profile with role and preferences
 */
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        // Fetch comprehensive user profile data with role and profile extensions
        const [users] = await pool.execute(
            `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, 
                    u.department, u.profile_image, u.date_of_birth,
                    r.name as role_name, r.display_name as role_display_name,
                    p.bio, p.linkedin_url, p.github_url, p.portfolio_url,
                    p.city, p.country, p.work_preference, p.availability
             FROM users u
             JOIN roles r ON u.role_id = r.id
             LEFT JOIN user_profiles p ON u.id = p.user_id
             WHERE u.id = ?`,
            [req.user.userId]
        );
        
        // Verify user still exists (could be deleted while token is valid)
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Return complete user profile data
        res.json({ user: users[0] });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

// =========================================
// JOBS MANAGEMENT ROUTES
// =========================================

const buildFilteredQuery = (baseQuery, queryParams, filterConfig) => {
    let query = baseQuery;
    const params = [];

    filterConfig.forEach(filter => {
        if (queryParams[filter.queryParam]) {
            query += ` AND ${filter.dbField} ${filter.operator || '='} ?`;
            params.push(filter.value ? filter.value(queryParams[filter.queryParam]) : queryParams[filter.queryParam]);
        }
    });

    if (queryParams.search) {
        const searchFields = filterConfig.filter(f => f.isSearchable).map(f => `${f.dbField} LIKE ?`).join(' OR ');
        if (searchFields) {
            query += ` AND (${searchFields})`;
            filterConfig.filter(f => f.isSearchable).forEach(() => params.push(`%${queryParams.search}%`));
        }
    }

    return { query, params };
};

// Get all jobs with filters
app.get('/api/jobs', getJobsValidation, validate(getJobsValidation), async (req, res) => {
    try {
        const { 
            limit = 20, 
            offset = 0, 
            category, 
            workType, 
            workMode, 
            experienceLevel, 
            location, 
            search 
        } = req.query;
        
        const baseQuery = `
            SELECT j.id, j.title, j.slug, j.description, j.work_type, j.work_mode, 
                   j.experience_level, j.location, j.department, j.urgent, j.featured,
                   j.applications_count, j.views_count, j.created_at, j.application_deadline,
                   c.name as company_name, c.slug as company_slug, c.logo_url,
                   cat.display_name as category_name, cat.icon as category_icon
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            JOIN job_categories cat ON j.category_id = cat.id
            WHERE j.status = 'active'
        `;
        
        const filterConfig = [
            { queryParam: 'category', dbField: 'cat.name' },
            { queryParam: 'workType', dbField: 'j.work_type' },
            { queryParam: 'workMode', dbField: 'j.work_mode' },
            { queryParam: 'experienceLevel', dbField: 'j.experience_level' },
            { queryParam: 'location', dbField: 'j.location', isSearchable: true },
            { queryParam: 'search', dbField: 'j.title', isSearchable: true },
            { queryParam: 'search', dbField: 'j.description', isSearchable: true },
            { queryParam: 'search', dbField: 'c.name', isSearchable: true },
        ];
        
        const { query: filteredQuery, params: filteredParams } = buildFilteredQuery(baseQuery, req.query, filterConfig);
        
        // Get total count for pagination
        const countQuery = `SELECT COUNT(*) as total ${filteredQuery.substring(filteredQuery.indexOf('FROM'))}`;
        const [countResult] = await pool.execute(countQuery, filteredParams);
        
        // Get paginated results
        const finalQuery = `${filteredQuery} ORDER BY j.featured DESC, j.created_at DESC LIMIT ? OFFSET ?`;
        const finalParams = [...filteredParams, parseInt(limit), parseInt(offset)];
        
        const [jobs] = await pool.execute(finalQuery, finalParams);
        
        res.json({
            jobs,
            total: countResult[0].total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// Get single job by ID or slug
app.get('/api/jobs/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        const isNumeric = /^\d+$/.test(identifier);
        
        const query = `
            SELECT j.*, 
                   c.name as company_name, c.slug as company_slug, c.logo_url,
                   c.description as company_description, c.website as company_website,
                   c.industry, c.company_size, c.headquarters, c.verified as company_verified,
                   cat.display_name as category_name, cat.icon as category_icon,
                   CONCAT(u.first_name, ' ', u.last_name) as created_by_name
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            JOIN job_categories cat ON j.category_id = cat.id
            JOIN users u ON j.created_by = u.id
            WHERE ${isNumeric ? 'j.id = ?' : 'j.slug = ?'} AND j.status = 'active'
        `;
        
        const [jobs] = await pool.execute(query, [identifier]);
        
        if (jobs.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        
        const job = jobs[0];
        
        // Get job skills
        const [skills] = await pool.execute(
            'SELECT skill_name, is_required, proficiency_level FROM job_skills WHERE job_id = ?',
            [job.id]
        );
        job.skills = skills;
        
        // Update views count
        await pool.execute(
            'UPDATE jobs SET views_count = views_count + 1 WHERE id = ?',
            [job.id]
        );
        
        res.json({ job });
        
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({ error: 'Failed to fetch job' });
    }
});

// Create new job (HR Team, Hiring Managers, Admins only)
app.post('/api/jobs', authenticateToken, authorizeRoles('administrador', 'talentos_humanos', 'hiring_manager'), createJobValidation, validate(createJobValidation), async (req, res) => {
    try {
        const {
            companyId, categoryId, title, description, requirements,
            niceToHave, responsibilities, workType, workMode, experienceLevel,
            location, department, urgent = false, featured = false,
            applicationDeadline, skills = []
        } = req.body;
        
        // Create slug from title
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        
        // Insert job
        const [result] = await pool.execute(
            `INSERT INTO jobs (company_id, category_id, title, slug, description, requirements,
                              nice_to_have, responsibilities, work_type, work_mode, experience_level,
                              location, department, urgent, featured, application_deadline,
                              created_by, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
            [companyId, categoryId, title, slug, description, requirements,
             niceToHave, responsibilities, workType, workMode, experienceLevel,
             location, department, urgent, featured, applicationDeadline, req.user.userId]
        );
        
        const jobId = result.insertId;
        
        // Insert job skills
        for (const skill of skills) {
            await pool.execute(
                'INSERT INTO job_skills (job_id, skill_name, is_required, proficiency_level) VALUES (?, ?, ?, ?)',
                [jobId, skill.name, skill.required, skill.level]
            );
        }
        
        // Log activity
        await pool.execute(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?)',
            [req.user.userId, 'create_job', 'job', jobId, `Created job: ${title}`]
        );
        
        res.status(201).json({ 
            message: 'Job created successfully',
            jobId 
        });
        
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ error: 'Failed to create job' });
    }
});

// Apply to job
app.post('/api/jobs/:jobId/apply', authenticateToken, applyJobValidation, validate(applyJobValidation), upload.single('resume'), async (req, res) => {
    try {
        const { jobId } = req.params;
        const { coverLetter } = req.body;
        const userId = req.user.userId;
        
        // Check if job exists and is active
        const [jobs] = await pool.execute(
            'SELECT id, title FROM jobs WHERE id = ? AND status = "active"',
            [jobId]
        );
        
        if (jobs.length === 0) {
            return res.status(404).json({ error: 'Job not found or inactive' });
        }
        
        // Check if user already applied
        const [existingApplication] = await pool.execute(
            'SELECT id FROM job_applications WHERE job_id = ? AND user_id = ?',
            [jobId, userId]
        );
        
        if (existingApplication.length > 0) {
            return res.status(400).json({ error: 'You have already applied to this job' });
        }
        
        const resumeFile = req.file ? req.file.filename : null;
        
        // Insert application
        const [result] = await pool.execute(
            'INSERT INTO job_applications (job_id, user_id, cover_letter, resume_file) VALUES (?, ?, ?, ?)',
            [jobId, userId, coverLetter, resumeFile]
        );
        
        // Log activity
        await pool.execute(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?)',
            [userId, 'apply_job', 'job_application', result.insertId, `Applied to job: ${jobs[0].title}`]
        );
        
        res.status(201).json({ 
            message: 'Application submitted successfully',
            applicationId: result.insertId
        });
        
    } catch (error) {
        console.error('Apply job error:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// =========================================
// TRAINING COURSES ROUTES
// =========================================

// Get all courses with filters (NO PRICE INFORMATION)
app.get('/api/courses', getCoursesValidation, validate(getCoursesValidation), async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const baseQuery = `
            SELECT c.id, c.title, c.slug, c.description, c.short_description,
                   c.thumbnail_url, c.difficulty_level, c.duration_hours, c.language,
                   c.featured, c.certificate_available, c.enrollment_count,
                   c.rating, c.review_count, c.created_at,
                   cat.display_name as category_name, cat.icon as category_icon, cat.color as category_color,
                   CONCAT(u.first_name, ' ', u.last_name) as instructor_name
            FROM training_courses c
            JOIN training_categories cat ON c.category_id = cat.id
            JOIN users u ON c.instructor_id = u.id
            WHERE c.status = 'active'
        `;

        const filterConfig = [
            { queryParam: 'category', dbField: 'cat.name' },
            { queryParam: 'difficulty_level', dbField: 'c.difficulty_level' },
            { queryParam: 'featured', dbField: 'c.featured', value: (val) => val === 'true' },
            { queryParam: 'search', dbField: 'c.title', isSearchable: true },
            { queryParam: 'search', dbField: 'c.description', isSearchable: true },
        ];

        const { query: filteredQuery, params: filteredParams } = buildFilteredQuery(baseQuery, req.query, filterConfig);

        const finalQuery = `${filteredQuery} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
        const finalParams = [...filteredParams, parseInt(limit), parseInt(offset)];

        const [courses] = await pool.execute(finalQuery, finalParams);

        res.json({ courses });

    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Get single course by ID or slug
app.get('/api/courses/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        const isNumeric = /^\d+$/.test(identifier);
        
        const query = `
            SELECT c.*,
                   cat.display_name as category_name, cat.icon as category_icon, cat.color as category_color,
                   CONCAT(u.first_name, ' ', u.last_name) as instructor_name,
                   u.profile_image as instructor_image
            FROM training_courses c
            JOIN training_categories cat ON c.category_id = cat.id
            JOIN users u ON c.instructor_id = u.id
            WHERE ${isNumeric ? 'c.id = ?' : 'c.slug = ?'} AND c.status = 'active'
        `;
        
        const [courses] = await pool.execute(query, [identifier]);
        
        if (courses.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        const course = courses[0];
        
        // Get course modules and lessons
        const [modules] = await pool.execute(
            `SELECT m.id, m.title, m.description, m.sort_order, m.duration_minutes, m.is_free,
                    COUNT(l.id) as lesson_count
             FROM course_modules m
             LEFT JOIN course_lessons l ON m.id = l.module_id
             WHERE m.course_id = ?
             GROUP BY m.id
             ORDER BY m.sort_order`,
            [course.id]
        );
        
        course.modules = modules;
        
        res.json({ course });
        
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

// Enroll in course
app.post('/api/courses/:courseId/enroll', authenticateToken, enrollCourseValidation, validate(enrollCourseValidation), async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.userId;
        
        // Check if course exists
        const [courses] = await pool.execute(
            'SELECT id, title FROM training_courses WHERE id = ? AND status = "active"',
            [courseId]
        );
        
        if (courses.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        // Check if already enrolled
        const [existingEnrollment] = await pool.execute(
            'SELECT id FROM course_enrollments WHERE course_id = ? AND user_id = ?',
            [courseId, userId]
        );
        
        if (existingEnrollment.length > 0) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }
        
        // Insert enrollment
        const [result] = await pool.execute(
            'INSERT INTO course_enrollments (user_id, course_id) VALUES (?, ?)',
            [userId, courseId]
        );
        
        // Log activity
        await pool.execute(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?)',
            [userId, 'enroll_course', 'course_enrollment', result.insertId, `Enrolled in course: ${courses[0].title}`]
        );
        
        res.status(201).json({ 
            message: 'Enrolled successfully',
            enrollmentId: result.insertId
        });
        
    } catch (error) {
        console.error('Course enrollment error:', error);
        res.status(500).json({ error: 'Failed to enroll in course' });
    }
});

// =========================================
// USER MANAGEMENT ROUTES
// =========================================

// Get all users (Admin and HR only)
app.get('/api/users', authenticateToken, authorizeRoles('administrador', 'talentos_humanos'), async (req, res) => {
    try {
        const { role, department, status, limit = 50, offset = 0 } = req.query;
        
        let query = `
            SELECT u.id, u.email, u.first_name, u.last_name, u.phone, 
                   u.department, u.employee_id, u.status, u.last_login, u.created_at,
                   r.display_name as role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (role) {
            query += ' AND r.name = ?';
            params.push(role);
        }
        
        if (department) {
            query += ' AND u.department = ?';
            params.push(department);
        }
        
        if (status) {
            query += ' AND u.status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const [users] = await pool.execute(query, params);
        
        res.json({ users });
        
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// =========================================
// STATISTICS AND REPORTS ROUTES
// =========================================

// Get dashboard statistics
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const stats = {};
        
        // Job statistics
        const [jobStats] = await pool.execute(`
            SELECT 
                COUNT(*) as total_jobs,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_jobs,
                COUNT(CASE WHEN featured = TRUE THEN 1 END) as featured_jobs,
                SUM(applications_count) as total_applications
            FROM jobs
        `);
        
        // User statistics  
        const [userStats] = await pool.execute(`
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
                COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as recent_users
            FROM users
        `);
        
        // Course statistics
        const [courseStats] = await pool.execute(`
            SELECT 
                COUNT(*) as total_courses,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_courses,
                SUM(enrollment_count) as total_enrollments
            FROM training_courses
        `);
        
        // Application statistics
        const [applicationStats] = await pool.execute(`
            SELECT 
                COUNT(*) as total_applications,
                COUNT(CASE WHEN status = 'hired' THEN 1 END) as hired_count,
                COUNT(CASE WHEN status IN ('applied', 'screening', 'interview') THEN 1 END) as pending_count
            FROM job_applications
        `);
        
        stats.jobs = jobStats[0];
        stats.users = userStats[0];
        stats.courses = courseStats[0];
        stats.applications = applicationStats[0];
        
        res.json({ stats });
        
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get job applications (HR Team, Hiring Managers, Admins only)
app.get('/api/jobs/:jobId/applications', authenticateToken, authorizeRoles('administrador', 'talentos_humanos', 'hiring_manager'), async (req, res) => {
    try {
        const { jobId } = req.params;
        const { status, limit = 50, offset = 0 } = req.query;
        
        let query = `
            SELECT ja.id, ja.status, ja.applied_at, ja.cover_letter, ja.resume_file,
                   CONCAT(u.first_name, ' ', u.last_name) as candidate_name,
                   u.email as candidate_email, u.phone as candidate_phone,
                   j.title as job_title
            FROM job_applications ja
            JOIN users u ON ja.user_id = u.id
            JOIN jobs j ON ja.job_id = j.id
            WHERE ja.job_id = ?
        `;
        
        const params = [jobId];
        
        if (status) {
            query += ' AND ja.status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY ja.applied_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const [applications] = await pool.execute(query, params);
        
        res.json({ applications });
        
    } catch (error) {
        console.error('Get job applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// Update application status (HR Team, Hiring Managers, Admins only)
app.patch('/api/applications/:applicationId', authenticateToken, authorizeRoles('administrador', 'talentos_humanos', 'hiring_manager'), async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, notes } = req.body;
        
        // Update application status
        await pool.execute(
            'UPDATE job_applications SET status = ?, last_updated = CURRENT_TIMESTAMP, reviewed_by = ? WHERE id = ?',
            [status, req.user.userId, applicationId]
        );
        
        // Log activity
        await pool.execute(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?)',
            [req.user.userId, 'update_application', 'job_application', applicationId, `Updated application status to: ${status}`]
        );
        
        res.json({ message: 'Application status updated successfully' });
        
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({ error: 'Failed to update application' });
    }
});

// Get job categories
app.get('/api/job-categories', async (req, res) => {
    try {
        const [categories] = await pool.execute(
            'SELECT id, name, display_name, description, icon FROM job_categories WHERE active = TRUE ORDER BY display_name'
        );
        
        res.json({ categories });
        
    } catch (error) {
        console.error('Get job categories error:', error);
        res.status(500).json({ error: 'Failed to fetch job categories' });
    }
});

// Get training categories
app.get('/api/training-categories', async (req, res) => {
    try {
        const [categories] = await pool.execute(
            'SELECT id, name, display_name, description, icon, color FROM training_categories WHERE active = TRUE ORDER BY sort_order, display_name'
        );
        
        res.json({ categories });
        
    } catch (error) {
        console.error('Get training categories error:', error);
        res.status(500).json({ error: 'Failed to fetch training categories' });
    }
});

// Get companies
app.get('/api/companies', async (req, res) => {
    try {
        const { verified, limit = 20, offset = 0 } = req.query;
        
        let query = `
            SELECT id, name, slug, description, logo_url, website, industry, 
                   company_size, headquarters, verified, status
            FROM companies
            WHERE status = 'active'
        `;
        
        const params = [];
        
        if (verified !== undefined) {
            query += ' AND verified = ?';
            params.push(verified === 'true');
        }
        
        query += ' ORDER BY verified DESC, name ASC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const [companies] = await pool.execute(query, params);
        
        res.json({ companies });
        
    } catch (error) {
        console.error('Get companies error:', error);
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
});

// =========================================
// STATIC FILE SERVING
// =========================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    res.sendFile(filepath);
});

// =========================================
// ERROR HANDLING
// =========================================

app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    
    res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// =========================================
// SERVER STARTUP
// =========================================

async function startServer() {
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
        console.error('FATAL ERROR: Database connection details are not fully defined in the environment variables.');
        process.exit(1);
    }
    try {
        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, 'uploads');
        try {
            await fs.access(uploadsDir);
        } catch {
            await fs.mkdir(uploadsDir, { recursive: true });
        }
        
        // Test database connection
        await testConnection();
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Catalyst HR System running on http://localhost:${PORT}`);
            console.log(`📂 Static files served from: ${__dirname}`);
            console.log(`📁 File uploads directory: ${uploadsDir}`);
        });
        
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();