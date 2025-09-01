/**
 * Job Management Validation Middleware for Catalyst HR System
 * 
 * This module provides comprehensive server-side validation rules for all
 * job-related API endpoints including job creation, application submission,
 * and job listing queries. It ensures data integrity and prevents malicious
 * input from compromising the job management system.
 * 
 * Validation scope:
 * - Job posting creation with complete data validation
 * - Job application submissions with required fields
 * - Job listing queries with pagination and filtering
 * - Parameter validation for route security
 * 
 * Security features:
 * - Input sanitization to prevent injection attacks
 * - Type validation for database integrity
 * - Enumerated value validation for controlled choices
 * - Length limits to prevent buffer overflow
 * - Required field enforcement for complete job data
 * 
 * @fileoverview Job management input validation and security rules
 * @version 2.0.0
 * @author Catalyst Development Team
 */

// Import express-validator components for comprehensive input validation
const { body, param, query } = require('express-validator');

/**
 * Validation rules for job posting creation endpoint
 * 
 * This validation chain ensures all job posting data meets quality standards
 * and security requirements. It validates company associations, job details,
 * work arrangements, and location information for complete job listings.
 * 
 * Data validation:
 * - Company and category associations (foreign key integrity)
 * - Essential job information (title, description, requirements)
 * - Work arrangement validation (type, mode, experience level)
 * - Location requirements for candidate matching
 * 
 * Security measures:
 * - Type validation to prevent injection attacks
 * - Enumerated values to prevent invalid job data
 * - Required field enforcement for complete listings
 * - Input sanitization for safe database storage
 */
const createJobValidation = [
    // Company ID validation - ensures valid company association
    body('companyId')
        .isInt()
        .withMessage('Company ID must be an integer')
        .custom(value => value > 0)
        .withMessage('Company ID must be a positive integer'),
    
    // Category ID validation - ensures proper job categorization
    body('categoryId')
        .isInt()
        .withMessage('Category ID must be an integer')
        .custom(value => value > 0)
        .withMessage('Category ID must be a positive integer'),
    
    // Job title validation - required for job identification
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    
    // Job description validation - essential for candidate understanding
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .trim()
        .isLength({ min: 50, max: 5000 })
        .withMessage('Description must be between 50 and 5000 characters'),
    
    // Requirements validation - critical for candidate qualification
    body('requirements')
        .notEmpty()
        .withMessage('Requirements are required')
        .trim()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Requirements must be between 20 and 2000 characters'),
    
    // Work type validation - ensures valid employment types
    body('workType')
        .isIn(['full-time', 'part-time', 'contract', 'internship'])
        .withMessage('Invalid work type'),
    
    // Work mode validation - ensures valid work arrangements
    body('workMode')
        .isIn(['on-site', 'remote', 'hybrid'])
        .withMessage('Invalid work mode'),
    
    // Experience level validation - ensures valid skill requirements
    body('experienceLevel')
        .isIn(['entry-level', 'mid-level', 'senior-level'])
        .withMessage('Invalid experience level'),
    
    // Location validation - required for job matching
    body('location')
        .notEmpty()
        .withMessage('Location is required')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters'),
];

/**
 * Validation rules for job application submission endpoint
 * 
 * This validation chain ensures job applications contain all required
 * information and reference valid job postings. It validates both the
 * job reference and application content for complete submissions.
 * 
 * Security considerations:
 * - Job ID validation to prevent invalid references
 * - Cover letter requirements for quality applications
 * - Input sanitization for safe database storage
 */
const applyJobValidation = [
    // Job ID parameter validation - ensures valid job reference
    param('jobId')
        .isInt()
        .withMessage('Job ID must be an integer')
        .custom(value => value > 0)
        .withMessage('Job ID must be a positive integer'),
    
    // Cover letter validation - required for application quality
    body('coverLetter')
        .notEmpty()
        .withMessage('Cover letter is required')
        .trim()
        .isLength({ min: 100, max: 2000 })
        .withMessage('Cover letter must be between 100 and 2000 characters'),
];

/**
 * Validation rules for job listing query endpoint
 * 
 * This validation chain ensures job listing requests use valid pagination
 * parameters and prevents excessive data requests that could impact
 * performance or enable denial-of-service attacks.
 * 
 * Performance protections:
 * - Limit parameter validation (1-100 jobs per request)
 * - Offset parameter validation for pagination
 * - Optional parameter handling for flexible queries
 */
const getJobsValidation = [
    // Limit parameter validation - prevents excessive data requests
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

// Export validation middleware for use in Express job management routes
module.exports = {
    createJobValidation,
    applyJobValidation,
    getJobsValidation,
};
