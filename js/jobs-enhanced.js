/**
 * Enhanced Jobs Module - Handles job listings, filtering, and navigation
 */

// Sample job data - would normally come from API
const sampleJobs = [
    {
        id: 1,
        title: "Full Stack Developer Senior",
        company: "TechCorp Colombia",
        location: "Bogotá, Colombia",
        type: "Tiempo Completo",
        modality: "Híbrido",
        salary: "$4,500,000 - $6,500,000 COP",
        experience: "3-5 años",
        category: "fullstack",
        level: "senior",
        contractType: "permanent",
        description: "Desarrollador Full Stack con experiencia en React, Node.js y PostgreSQL para proyectos innovadores.",
        skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "Git", "Docker"],
        posted: "2025-08-29",
        deadline: "2025-09-30",
        applicants: 47,
        views: 234,
        urgent: false,
        featured: true
    },
    {
        id: 2,
        title: "Data Scientist",
        company: "Data Analytics Inc",
        location: "Medellín, Colombia",
        type: "Tiempo Completo",
        modality: "Remoto",
        salary: "$5,000,000 - $7,000,000 COP",
        experience: "2-4 años",
        category: "dataScience",
        level: "semi-senior",
        contractType: "permanent",
        description: "Data Scientist para desarrollar modelos predictivos y análisis avanzados con Python.",
        skills: ["Python", "Machine Learning", "SQL", "Tableau", "Statistics"],
        posted: "2025-08-28",
        deadline: "2025-09-25",
        applicants: 32,
        views: 156,
        urgent: true,
        featured: false
    },
    {
        id: 3,
        title: "Frontend Developer React",
        company: "StartupTech",
        location: "Cali, Colombia",
        type: "Tiempo Completo",
        modality: "Presencial",
        salary: "$3,000,000 - $4,500,000 COP",
        experience: "1-3 años",
        category: "frontend",
        level: "junior",
        contractType: "fixed-term",
        description: "Desarrollador Frontend especializado en React.js para aplicaciones web modernas.",
        skills: ["React", "JavaScript", "CSS", "HTML", "Git"],
        posted: "2025-08-27",
        deadline: "2025-09-15",
        applicants: 23,
        views: 189,
        urgent: false,
        featured: false
    },
    {
        id: 4,
        title: "DevOps Engineer",
        company: "CloudSolutions",
        location: "Barranquilla, Colombia",
        type: "Tiempo Completo",
        modality: "Híbrido",
        salary: "$5,500,000 - $7,500,000 COP",
        experience: "4-6 años",
        category: "devops",
        level: "senior",
        contractType: "permanent",
        description: "DevOps Engineer para implementar y mantener infraestructura cloud escalable.",
        skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Python", "Terraform"],
        posted: "2025-08-26",
        deadline: "2025-09-20",
        applicants: 18,
        views: 145,
        urgent: false,
        featured: true
    },
    {
        id: 5,
        title: "UX/UI Designer",
        company: "Design Studio",
        location: "Remoto",
        type: "Medio Tiempo",
        modality: "Remoto",
        salary: "$2,500,000 - $3,500,000 COP",
        experience: "2-4 años",
        category: "uxui",
        level: "semi-senior",
        contractType: "freelance",
        description: "Diseñador UX/UI para crear experiencias digitales excepcionales.",
        skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
        posted: "2025-08-25",
        deadline: "2025-09-10",
        applicants: 15,
        views: 98,
        urgent: false,
        featured: false
    }
];

/**
 * Fetch filtered jobs based on criteria
 */
export async function fetchFilteredJobs(filters = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredJobs = [...sampleJobs];
    
    // Apply text search filter
    if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query) ||
            job.skills.some(skill => skill.toLowerCase().includes(query))
        );
    }
    
    // Apply location filter
    if (filters.location) {
        filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
    }
    
    // Apply category filters
    if (filters.categories && filters.categories.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
            filters.categories.includes(job.category)
        );
    }
    
    // Apply level filters
    if (filters.levels && filters.levels.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
            filters.levels.includes(job.level)
        );
    }
    
    // Apply modality filters
    if (filters.modalities && filters.modalities.length > 0) {
        const modalityMap = {
            'remote': 'Remoto',
            'onsite': 'Presencial',
            'hybrid': 'Híbrido'
        };
        
        filteredJobs = filteredJobs.filter(job => 
            filters.modalities.some(mod => 
                job.modality.includes(modalityMap[mod] || mod)
            )
        );
    }
    
    // Apply contract type filters
    if (filters.contractTypes && filters.contractTypes.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
            filters.contractTypes.includes(job.contractType)
        );
    }
    
    // Apply sorting
    if (filters.sort) {
        switch (filters.sort) {
            case 'recent':
                filteredJobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));
                break;
            case 'salary':
                filteredJobs.sort((a, b) => {
                    const aSalary = extractSalaryNumber(a.salary);
                    const bSalary = extractSalaryNumber(b.salary);
                    return bSalary - aSalary;
                });
                break;
            case 'relevant':
                // Sort by featured first, then by applicant count
                filteredJobs.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return b.applicants - a.applicants;
                });
                break;
        }
    }
    
    return filteredJobs;
}

/**
 * Extract numeric value from salary string for sorting
 */
function extractSalaryNumber(salaryString) {
    const numbers = salaryString.match(/\d+/g);
    if (numbers && numbers.length > 0) {
        return parseInt(numbers[numbers.length - 1].replace(/,/g, ''));
    }
    return 0;
}

/**
 * Render job list in specified container
 */
export function renderJobList(jobs, containerSelector) {
    const container = document.querySelector(containerSelector);
    
    if (!container) {
        console.error('Container not found:', containerSelector);
        return;
    }
    
    if (!jobs || jobs.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No se encontraron empleos</h4>
                <p class="text-muted">Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jobs.map(job => createJobCard(job)).join('');
}

/**
 * Create HTML for individual job card
 */
function createJobCard(job) {
    const postedDaysAgo = getDaysAgo(job.posted);
    const urgentBadge = job.urgent ? '<span class="badge bg-danger ms-2">Urgente</span>' : '';
    const featuredBadge = job.featured ? '<span class="badge bg-warning text-dark ms-2">Destacado</span>' : '';
    
    return `
        <div class="job-card card mb-3 h-100 ${job.featured ? 'border-warning' : ''}" data-job-id="${job.id}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <h5 class="card-title mb-0">
                                <a href="job-detail.html?id=${job.id}" class="text-decoration-none job-title-link">
                                    ${job.title}
                                </a>
                            </h5>
                            ${urgentBadge}
                            ${featuredBadge}
                        </div>
                        <div class="company-info mb-2">
                            <a href="#" class="text-muted text-decoration-none company-link">
                                <i class="fas fa-building me-1"></i>${job.company}
                            </a>
                            <span class="text-muted mx-2">•</span>
                            <span class="text-muted">
                                <i class="fas fa-map-marker-alt me-1"></i>${job.location}
                            </span>
                        </div>
                    </div>
                    <div class="text-end">
                        <div class="salary-range fw-bold text-success mb-1">
                            ${job.salary}
                        </div>
                        <small class="text-muted">Por mes</small>
                    </div>
                </div>
                
                <p class="job-description text-muted mb-3">
                    ${job.description}
                </p>
                
                <div class="job-tags mb-3">
                    <div class="d-flex flex-wrap gap-1 mb-2">
                        <span class="badge bg-primary">${job.type}</span>
                        <span class="badge bg-info">${job.modality}</span>
                        <span class="badge bg-secondary">${job.experience}</span>
                    </div>
                    <div class="skills-tags">
                        ${job.skills.slice(0, 5).map(skill => 
                            `<span class="badge bg-light text-dark me-1 mb-1">${skill}</span>`
                        ).join('')}
                        ${job.skills.length > 5 ? `<span class="badge bg-light text-muted">+${job.skills.length - 5} más</span>` : ''}
                    </div>
                </div>
                
                <div class="job-footer d-flex justify-content-between align-items-center">
                    <div class="job-stats text-muted small">
                        <span class="me-3">
                            <i class="fas fa-eye me-1"></i>${job.views} vistas
                        </span>
                        <span class="me-3">
                            <i class="fas fa-users me-1"></i>${job.applicants} aplicantes
                        </span>
                        <span>
                            <i class="fas fa-clock me-1"></i>Hace ${postedDaysAgo} día${postedDaysAgo !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div class="job-actions">
                        <button class="btn btn-outline-primary btn-sm me-2 save-job-btn" data-job-id="${job.id}">
                            <i class="fas fa-heart me-1"></i>Guardar
                        </button>
                        <a href="job-detail.html?id=${job.id}" class="btn btn-primary btn-sm">
                            Ver Detalles
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Calculate days ago from date string
 */
function getDaysAgo(dateString) {
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Initialize job search functionality
 */
export function initJobSearch() {
    // Handle save job buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.save-job-btn')) {
            e.preventDefault();
            const jobId = e.target.closest('.save-job-btn').dataset.jobId;
            toggleSaveJob(e.target.closest('.save-job-btn'), jobId);
        }
    });
    
    // Handle company links
    document.addEventListener('click', (e) => {
        if (e.target.closest('.company-link')) {
            e.preventDefault();
            const companyName = e.target.closest('.company-link').textContent.trim();
            searchJobsByCompany(companyName);
        }
    });
}

/**
 * Toggle save job status
 */
function toggleSaveJob(button, jobId) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        if (confirm('Necesitas iniciar sesión para guardar empleos. ¿Deseas ir a la página de login?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    // Get saved jobs from localStorage
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isCurrentlySaved = savedJobs.includes(parseInt(jobId));
    
    if (isCurrentlySaved) {
        // Remove from saved jobs
        savedJobs = savedJobs.filter(id => id !== parseInt(jobId));
        button.innerHTML = '<i class="fas fa-heart me-1"></i>Guardar';
        button.classList.remove('btn-danger');
        button.classList.add('btn-outline-primary');
        showToast('Empleo removido de favoritos', 'info');
    } else {
        // Add to saved jobs
        savedJobs.push(parseInt(jobId));
        button.innerHTML = '<i class="fas fa-heart me-1"></i>Guardado';
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-danger');
        showToast('Empleo guardado en favoritos', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
}

/**
 * Search jobs by company
 */
function searchJobsByCompany(companyName) {
    const searchInput = document.querySelector('input[name="query"]');
    if (searchInput) {
        searchInput.value = companyName;
        // Trigger search
        const event = new Event('submit');
        document.getElementById('job-filters').dispatchEvent(event);
    }
}

/**
 * Handle job details modal (legacy support)
 */
export function handleJobDetails() {
    // This function is kept for backward compatibility
    // New implementation uses direct navigation to job-detail.html
    console.log('Job details handling initialized');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

/**
 * Update saved job buttons state on page load
 */
export function updateSavedJobsUI() {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const saveButtons = document.querySelectorAll('.save-job-btn');
    
    saveButtons.forEach(button => {
        const jobId = parseInt(button.dataset.jobId);
        if (savedJobs.includes(jobId)) {
            button.innerHTML = '<i class="fas fa-heart me-1"></i>Guardado';
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-danger');
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateSavedJobsUI();
});
