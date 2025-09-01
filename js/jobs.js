/**
 * Job Management System for Catalyst HR Platform
 * 
 * This module handles all job-related functionality including job search,
 * filtering, display, and detailed job information management. It integrates
 * with the AI matching engine for intelligent job recommendations and provides
 * a seamless user experience for job discovery and application.
 * 
 * Key features:
 * - Advanced job search with multiple filter criteria
 * - AI-powered job matching and scoring
 * - Dynamic job listing rendering with responsive design
 * - Interactive job detail modals with company information
 * - Integration with gamification system for engagement tracking
 * - Comprehensive error handling and user feedback
 * 
 * @fileoverview Job search, display, and management functionality
 * @version 2.0.0
 * @author Catalyst Development Team
 */

// Import API functions for backend job data communication
import { fetchJobs, fetchJobDetails } from './api.js';

// Import UI utilities for user feedback and notifications
import { showToast } from './ui.js';

// Import AI matching engine for intelligent job recommendations
import { getAIMatchingEngine } from './ai-matching.js';

/**
 * Initialize job search functionality with form handling and filters
 * 
 * This function sets up the job search interface, enabling users to search
 * for jobs using various criteria including keywords, location, and other
 * filters. It handles form submission, data validation, and result rendering.
 * 
 * Features:
 * - Form submission handling with validation
 * - Dynamic filter extraction from form data
 * - API integration for job fetching
 * - Error handling with user feedback
 * - Real-time search result updates
 */
export const initJobSearch = () => {
    // Find the search form in the current page
    const searchForm = document.querySelector('.search-box form');
    
    if (searchForm) {
        // Set up form submission handler for job search
        searchForm.addEventListener('submit', async (e) => {
            // Prevent default form submission to handle with JavaScript
            e.preventDefault();
            
            // Extract search criteria from form fields
            const formData = new FormData(searchForm);
            const filters = {
                query: formData.get('query'),        // Text search query
                location: formData.get('location'),  // Location filter
            };
            
            try {
                // Fetch jobs matching the search criteria
                const jobs = await fetchJobs(filters);
                
                // Update the UI with search results
                renderJobList(jobs);
                
            } catch (error) {
                // Display error message to user if search fails
                showToast(error.message, 'error');
            }
        });
    }
};

/**
 * Set up event handlers for job detail viewing
 * 
 * This function establishes event delegation for job detail buttons,
 * enabling users to view comprehensive information about specific jobs
 * in a modal dialog. It uses event delegation for optimal performance
 * with dynamically rendered job listings.
 */
export const handleJobDetails = () => {
    // Use event delegation for dynamically added job detail buttons
    document.addEventListener('click', async (e) => {
        // Check if clicked element is a job detail button
        if (e.target.closest('.view-details-btn')) {
            // Extract job ID from button data attribute
            const jobId = e.target.closest('.view-details-btn').dataset.jobId;
            
            // Show detailed job information in modal
            await showJobDetailsModal(jobId);
        }
    });
};

/**
 * Format relative time display for job posting dates
 * 
 * This function converts database timestamps into user-friendly relative time
 * strings (e.g., "2 days ago", "1 week ago"). It handles both MySQL datetime
 * format and JavaScript Date objects with comprehensive error handling.
 * 
 * Supported formats:
 * - MySQL datetime: YYYY-MM-DD HH:MM:SS
 * - ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ
 * - JavaScript Date objects
 * 
 * @param {string|Date} dateString - Date to format (MySQL datetime or ISO string)
 * @returns {string} Human-readable relative time string in Spanish
 */
const formatRelativeTime = (dateString) => {
    // Handle null, undefined, or empty date strings
    if (!dateString) return 'Fecha no disponible';
    
    try {
        // Parse date string - supports MySQL datetime format and ISO strings
        const date = new Date(dateString);
        
        // Validate parsed date object
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
        
        // Calculate time difference from current date
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Return appropriate relative time string
        if (diffDays <= 0) return 'hoy';
        if (diffDays === 1) return 'hace 1 día';
        if (diffDays < 7) return `hace ${diffDays} días`;
        if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
        return `hace ${Math.floor(diffDays / 30)} meses`;
        
    } catch (error) {
        // Handle any date parsing errors gracefully
        console.warn('Date parsing error:', error);
        return 'Fecha inválida';
    }
};

/**
 * Render job listings with security checks and AI scoring
 * 
 * This function generates HTML for job listing cards with comprehensive data
 * validation, AI-powered matching scores, and responsive design. It includes
 * security checks for missing data and integrates with the gamification system.
 * 
 * Features:
 * - Comprehensive data validation and fallback values
 * - AI-powered job matching scores with visual indicators
 * - Responsive card layout with Bootstrap styling
 * - Company verification badges and featured job highlighting
 * - Interactive tooltips and accessibility features
 * - Integration with job detail modal system
 * 
 * @param {Array} jobs - Array of job objects to render
 * @param {string} containerSelector - CSS selector for the container element
 */
export const renderJobList = (jobs, containerSelector = '.job-list') => {
    // Find the target container for job listings
    const container = document.querySelector(containerSelector);
    if (!container) return; // Exit if container not found
    
    // Handle empty job list with user-friendly message
    if (!jobs || jobs.length === 0) {
        container.innerHTML = `<div class="col-12"><p class="text-center text-muted">No se encontraron ofertas de empleo.</p></div>`;
        return;
    }

    // Generate HTML for each job using secure data extraction and AI scoring
    container.innerHTML = jobs.map(job => {
        // Secure data extraction with fallback values for missing company data
        const companyName = job.company ? job.company.name : 'Empresa no especificada';
        const companyLogo = job.company && job.company.logo ? job.company.logo : 'img/image.png';
        const companyVerified = job.company ? job.company.verified : false;
        
        // Truncate job description for card display (120 characters)
        const description = job.description ? job.description.substring(0, 120) + '...' : 'Descripción no disponible';
        
        // Calculate AI matching score for personalized job recommendations
        const normalized = {
            requiredSkills: job.skillsRequired || job.requirements || [],
            experienceLevel: (job.level || '').toLowerCase(),
            location: job.location || '',
            salaryRange: job.salary || null,
            industry: job.category || (job.company && job.company.industry ? job.company.industry : 'technology')
        };
        
        // Get AI matching score with fallback for missing AI engine
        let aiScore = 0;
        try {
            aiScore = getAIMatchingEngine().calculateJobMatch(normalized).score;
        } catch (aiError) {
            // Silent fail for AI engine - don't block job display
            aiScore = 0;
        }
        
        // Create AI matching badge with tooltip
        const aiBadge = `<span class="badge bg-secondary ms-2" data-bs-toggle="tooltip" title="Coincidencia AI"><i class=\"fas fa-robot me-1\"></i> ${aiScore}%</span>`;
        
        // Generate responsive job card HTML with Bootstrap styling
        return `
        <div class="col-md-4 mb-4">
            <div class="job-card h-100 position-relative" data-job-id="${job.id}">
                ${job.featured ? '<span class="featured-badge">Destacado</span>' : ''}
                ${job.isNew ? '<span class="new-badge">NUEVO</span>' : ''}
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h3 class="job-title">${job.title || 'Título no disponible'} ${aiBadge}</h3>
                            <div class="d-flex align-items-center mb-2">
                                <img src="${companyLogo}" alt="${companyName}" class="rounded-circle me-2" width="24" loading="lazy">
                                <p class="company-name mb-0">${companyName}</p>
                                ${companyVerified ? `
                                <span class="verified-badge ms-2" data-bs-toggle="tooltip" title="Empresa verificada">
                                    <i class="fas fa-check-circle text-primary"></i>
                                </span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="job-meta mb-3">
                        <span class="badge bg-primary-light text-primary me-2">
                            <i class="fas ${getModalityIcon(job.modality)} me-1"></i> ${job.modality || 'No especificado'}
                        </span>
                        <span class="badge bg-success-light text-success me-2">
                            <i class="fas ${getLevelIcon(job.level)} me-1"></i> ${job.level || 'No especificado'}
                        </span>
                        <span class="badge bg-info-light text-info">
                            <i class="fas fa-clock me-1"></i> ${job.contractType || 'No especificado'}
                        </span>
                    </div>
                    
                    <p class="job-description">${description}</p>
                    
                    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mt-auto">
                        <div class="mb-2 mb-sm-0">
                            <span class="text-muted small">
                                <i class="fas fa-map-marker-alt me-1"></i> ${job.location || 'Ubicación no especificada'}
                            </span>
                            ${job.salary ? `
                            <span class="text-muted small ms-2">
                                <i class="fas fa-money-bill-wave me-1"></i> ${formatSalary(job.salary)}
                            </span>
                            ` : ''}
                        </div>
                        <button class="btn btn-sm btn-accent view-details-btn" data-job-id="${job.id}" aria-label="Ver detalles del empleo ${job.title || ''}">Ver detalles</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join(''); // Join all job cards into single HTML string
    
    // Initialize Bootstrap tooltips for all tooltip elements in the job listings
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
};

/**
 * Display detailed job information in a modal dialog
 * 
 * This function fetches comprehensive job details and displays them in a
 * Bootstrap modal with company information, AI matching scores, and all
 * relevant job data. It includes security validation and error handling.
 * 
 * Features:
 * - Comprehensive job data fetching and validation
 * - AI-powered matching score calculation and display
 * - Company information with verification status
 * - Responsive modal layout with structured information
 * - Integration with job application system
 * - Error handling with user feedback
 * 
 * @param {string|number} jobId - Unique identifier for the job to display
 * @async
 */
export const showJobDetailsModal = async (jobId) => {
    try {
        // Fetch detailed job information from API
        const job = await fetchJobDetails(jobId);
        
        // Validate job data exists
        if (!job) {
            showToast('No se encontraron detalles para este empleo.', 'error');
            return;
        }

        // Find modal elements in the DOM
        const modalTitle = document.getElementById('jobDetailsModalLabel');
        const modalBody = document.getElementById('jobDetailsModalBody');
        if (!modalTitle || !modalBody) return; // Exit if modal elements not found

        // Set modal title with job name
        modalTitle.textContent = job.title || 'Detalles del empleo';
        
        // Extract company information with security checks and fallback values
        const companyName = job.company ? job.company.name : 'Empresa no especificada';
        const companyLogo = job.company && job.company.logo ? job.company.logo : '../img/image.png';
        const companyIndustry = job.company ? job.company.industry : 'Tecnología';
        const companyDescription = job.company ? job.company.description : 'Descripción no disponible';
        const companySize = job.company ? job.company.size : 'Tamaño no especificado';
        const companyFounded = job.company ? job.company.founded : 'Fecha no disponible';
        const companyWebsite = job.company ? job.company.website : '#';

        // Calculate AI matching score for detailed view
        const normalized = {
            requiredSkills: job.skillsRequired || job.requirements || [],
            experienceLevel: (job.level || '').toLowerCase(),
            location: job.location || '',
            salaryRange: job.salary || null,
            industry: job.category || (job.company && job.company.industry ? job.company.industry : 'technology')
        };
        
        // Get AI matching score with error handling
        let aiScore = 0;
        try {
            aiScore = getAIMatchingEngine().calculateJobMatch(normalized).score;
        } catch (aiError) {
            // Silent fail for AI matching - don't block job detail display
            console.warn('AI matching calculation failed:', aiError);
            aiScore = 0;
        }

        // Generate comprehensive modal content with structured job information
        modalBody.innerHTML = `
            <div class="d-flex align-items-center mb-3">
                <img src="${companyLogo}" alt="${companyName}" class="rounded-circle me-3" width="50">
                <div>
                    <h5 class="mb-0">${companyName}</h5>
                    <p class="text-muted mb-0">${companyIndustry}</p>
                </div>
            </div>
            <p class="text-muted small mb-3">Publicado: ${formatRelativeTime(job.postedDate)}</p>
            
            <div class="job-meta mb-3">
                <span class="badge bg-primary-light text-primary me-2"><i class="fas ${getModalityIcon(job.modality)} me-1"></i> ${job.modality || 'No especificado'}</span>
                <span class="badge bg-success-light text-success me-2"><i class="fas ${getLevelIcon(job.level)} me-1"></i> ${job.level || 'No especificado'}</span>
                <span class="badge bg-info-light text-info me-2"><i class="fas fa-clock me-1"></i> ${job.contractType || 'No especificado'}</span>
                <span class="badge bg-secondary"><i class="fas fa-robot me-1"></i> AI ${aiScore}%</span>
            </div>

            <p><strong>Ubicación:</strong> ${job.location || 'No especificada'}</p>
            <p><strong>Salario:</strong> ${formatSalary(job.salary)}</p>

            <h6>Descripción del Empleo:</h6>
            <p>${job.description || 'Descripción no disponible'}</p>

            <h6>Requisitos:</h6>
            ${formatList(job.requirements)}

            <h6>Responsabilidades:</h6>
            ${formatList(job.responsibilities)}

            <h6>Beneficios:</h6>
            ${formatList(job.benefits)}

            <hr>
            <h6>Acerca de la Empresa:</h6>
            <p>${companyDescription}</p>
            <p>Tamaño: ${companySize}</p>
            <p>Fundada: ${companyFounded}</p>
            <p><a href="${companyWebsite}" target="_blank" rel="noopener noreferrer">Visitar sitio web</a></p>
        `;

        // Configure apply button with job ID for application functionality
        const applyBtn = document.getElementById('applyJobBtn');
        if (applyBtn) {
            applyBtn.dataset.jobId = jobId;
        }

        // Show the modal with job details
        const jobDetailsModal = new bootstrap.Modal(document.getElementById('jobDetailsModal'));
        jobDetailsModal.show();

    } catch (error) {
        // Handle errors gracefully with user feedback
        console.error('Error loading job details:', error);
        showToast('Error al cargar los detalles del empleo.', 'error');
    }
};

/**
 * Get appropriate FontAwesome icon for job work modality
 * 
 * This helper function maps work modality types to their corresponding
 * FontAwesome icons for consistent visual representation across the UI.
 * 
 * @param {string} modality - Work modality (Remoto, Presencial, Híbrido)
 * @returns {string} FontAwesome icon class name
 */
const getModalityIcon = (modality) => {
    const modalityIcons = {
        'Remoto': 'fa-laptop-house',    // Remote work icon
        'Presencial': 'fa-building',    // Office/in-person work icon
        'Híbrido': 'fa-laptop-house'    // Hybrid work icon
    };
    return modalityIcons[modality] || 'fa-briefcase'; // Default briefcase icon
};

/**
 * Get appropriate FontAwesome icon for job experience level
 * 
 * This helper function maps experience levels to their corresponding
 * FontAwesome icons to provide visual hierarchy and quick recognition.
 * 
 * @param {string} level - Experience level (Trainee, Junior, Semi-Senior, Senior, Architect)
 * @returns {string} FontAwesome icon class name
 */
const getLevelIcon = (level) => {
    const levelIcons = {
        'Trainee': 'fa-seedling',      // Entry level/growing icon
        'Junior': 'fa-graduation-cap', // Junior/learning icon
        'Semi-Senior': 'fa-star-half-alt', // Mid-level icon
        'Senior': 'fa-star',           // Senior level icon
        'Architect': 'fa-crown'        // Architect/lead level icon
    };
    return levelIcons[level] || 'fa-user'; // Default user icon
};

/**
 * Format salary range for display with proper localization
 * 
 * This function formats salary data into user-friendly strings with
 * proper number formatting and fallback for missing salary information.
 * 
 * @param {Object} salary - Salary object with min and max values
 * @param {number} salary.min - Minimum salary amount
 * @param {number} salary.max - Maximum salary amount
 * @returns {string} Formatted salary range string
 */
const formatSalary = (salary) => {
    // Check if salary data exists and has min/max values
    if (salary && (salary.min || salary.max)) {
        // Format numbers with locale-specific separators (commas)
        return `$${salary.min?.toLocaleString() || ''} - $${salary.max?.toLocaleString() || ''}`;
    }
    // Return default message for negotiable salary
    return 'Salario a convenir';
};

/**
 * Format array of items into HTML list with validation
 * 
 * This utility function converts arrays of strings (requirements, responsibilities,
 * benefits) into properly formatted HTML lists with comprehensive validation.
 * 
 * @param {Array} items - Array of strings to format as list
 * @returns {string} HTML unordered list or fallback message
 */
const formatList = (items) => {
    // Validate input is a non-empty array
    if (!items || !Array.isArray(items) || items.length === 0) {
        return '<p>No especificado</p>'; // Fallback for empty/invalid data
    }
    
    // Generate HTML unordered list from array items
    return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
};
