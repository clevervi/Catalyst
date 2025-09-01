/**
 * Course Management Validation Middleware for Catalyst HR System
 * 
 * This module provides server-side validation rules for the training and
 * course management system. It ensures proper course enrollment, listing
 * queries, and data integrity for the educational component of the platform.
 * 
 * Validation scope:
 * - Course listing queries with pagination controls
 * - Course enrollment validation with ID verification
 * - Parameter sanitization for route security
 * - Performance protection against excessive requests
 * 
 * Security features:
 * - Input type validation for database integrity
 * - Parameter limits to prevent denial-of-service attacks
 * - Course ID validation to prevent invalid enrollments
 * - Query parameter sanitization for safe database operations
 * 
 * Integration:
 * - Works with the training platform for skill development
 * - Supports the gamification system for learning achievements
 * - Integrates with user profile for course progress tracking
 * 
 * @fileoverview Course and training validation rules
 * @version 2.0.0
 * @author Catalyst Development Team
 */

// Import express-validator components for input validation
const { param, query } = require('express-validator');

/**
 * Validation rules for course listing query endpoint
 * 
 * This validation chain ensures course listing requests use appropriate
 * pagination parameters and prevents excessive data requests that could
 * impact system performance or enable abuse.
 * 
 * Performance protections:
 * - Limit validation (1-100 courses per request)
 * - Offset validation for proper pagination
 * - Optional parameter handling for flexible queries
 * 
 * Security measures:
 * - Type validation to prevent injection attacks
 * - Range limits to prevent resource exhaustion
 * - Parameter sanitization for safe database queries
 */
const getCoursesValidation = [
    // Limit parameter validation - prevents excessive course requests
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be an integer between 1 and 100'),
    
    // Offset parameter validation - ensures valid pagination
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a non-negative integer'),
];

/**
 * Validation rules for course enrollment endpoint
 * 
 * This validation chain ensures course enrollment requests reference
 * valid course IDs and prevents enrollment attempts with malformed
 * or malicious course references.
 * 
 * Security considerations:
 * - Course ID type validation for database integrity
 * - Positive integer requirement to prevent invalid references
 * - Parameter sanitization to prevent injection attacks
 */
const enrollCourseValidation = [
    // Course ID parameter validation - ensures valid course reference
    param('courseId')
        .isInt()
        .withMessage('Course ID must be an integer')
        .custom(value => value > 0)
        .withMessage('Course ID must be a positive integer'),
];

// Export validation middleware for use in Express course management routes
module.exports = {
    getCoursesValidation,
    enrollCourseValidation,
};
