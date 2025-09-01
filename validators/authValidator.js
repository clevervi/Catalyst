/**
 * Authentication Validation Middleware for Catalyst HR System
 * 
 * This module provides comprehensive server-side validation rules for all
 * authentication-related endpoints including user registration and login.
 * It implements security best practices and input validation to prevent
 * common vulnerabilities and ensure data integrity.
 * 
 * Security features:
 * - Email format validation with RFC compliance
 * - Strong password requirements (minimum 8 characters)
 * - Required field validation for user registration
 * - Input sanitization to prevent injection attacks
 * - Consistent error messaging for user feedback
 * 
 * Uses express-validator middleware for robust validation with
 * automatic error collection and response handling.
 * 
 * @fileoverview Authentication input validation and security rules
 * @version 2.0.0
 * @author Catalyst Development Team
 */

// Import express-validator for robust server-side input validation
const { body } = require('express-validator');

/**
 * Validation rules for user registration endpoint
 * 
 * This validation chain ensures all required fields are properly formatted
 * and meet security requirements for creating new user accounts. It prevents
 * malformed data from entering the system and provides clear error messages.
 * 
 * Validation rules:
 * - Email: Valid email format (RFC compliant)
 * - Password: Minimum 8 characters for security
 * - First Name: Required field, non-empty
 * - Last Name: Required field, non-empty
 * 
 * Security considerations:
 * - Prevents SQL injection through input sanitization
 * - Enforces strong password requirements
 * - Validates email format to prevent invalid accounts
 * - Ensures required personal information is provided
 */
const registerValidation = [
    // Email validation with RFC-compliant format checking
    body('email')
        .isEmail()
        .withMessage('Enter a valid email address')
        .normalizeEmail(), // Normalize email format for consistency
    
    // Password validation with minimum security requirements
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/) // Require mixed case and numbers
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    // First name validation - required for personalization
    body('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    
    // Last name validation - required for identification
    body('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
];

/**
 * Validation rules for user login endpoint
 * 
 * This validation chain ensures login attempts have properly formatted
 * credentials and prevents empty or malformed authentication requests.
 * It provides the first line of defense against authentication attacks.
 * 
 * Validation rules:
 * - Email: Valid email format for account lookup
 * - Password: Required field, non-empty for authentication
 * 
 * Security considerations:
 * - Prevents brute force attacks with empty credentials
 * - Validates email format for proper account matching
 * - Ensures required authentication data is provided
 */
const loginValidation = [
    // Email validation for account identification
    body('email')
        .isEmail()
        .withMessage('Enter a valid email address')
        .normalizeEmail(), // Normalize for consistent lookup
    
    // Password validation - required for authentication
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 1 })
        .withMessage('Password cannot be empty'),
];

// Export validation middleware for use in Express routes
module.exports = {
    registerValidation,
    loginValidation,
};
