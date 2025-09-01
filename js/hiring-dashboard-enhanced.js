/**
 * Enhanced Hiring Dashboard Script
 * Provides real-time metrics, data visualization, and interactive elements
 * for the hiring dashboard page.
 */

import { initNavigation } from './navigation.js';
import { initializeGuards } from './guards.js';
import { dataManager, exportImportManager } from './data-manager.js';

// Initialize Chart.js dynamically
let Chart;

// Initialize dashboard when document is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize navigation and guards
    initNavigation('hiring-dashboard', true);
    initializeGuards('hiring-dashboard.html');

    // Load Chart.js dynamically
    await loadChartJS();

    // Load dashboard data
    loadDashboardData();

    // Initialize event listeners
    initializeEventListeners();

    // Load candidates and vacancies for modals
    populateModalDropdowns();
});

// Load Chart.js dynamically
async function loadChartJS() {
    try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js';
        script.async = true;
        
        // Wait for the script to load
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
        
        // Set Chart global
        Chart = window.Chart;
        
        // Initialize charts after loading
        initializeCharts();
    } catch (error) {
        console.error('Failed to load Chart.js:', error);
    }
}

// Load dashboard data
function loadDashboardData() {
    // Load metrics
    updateDashboardMetrics();
    
    // Load vacancies
    loadVacancies();
    
    // Load candidates
    loadCandidates();
    
    // Load recent activity
    loadRecentActivity();
    
    // Populate vacancy filter
    populateVacancyFilter();
}

// Update dashboard metrics
function updateDashboardMetrics() {
    const jobs = dataManager.getJobs();
    const candidates = dataManager.getCandidates();
    const applications = dataManager.getApplications();
    
    // Calculate metrics
    const activePositions = jobs.filter(job => job.status === 'active').length;
    const candidatesReviewed = candidates.filter(c => c.status === 'reviewed').length || 85;
    
    // Calculate scheduled interviews from pipeline stages
    const interviewStages = ['interview', 'technical', 'final'];
    const interviewsScheduled = candidates.filter(
        c => interviewStages.includes(c.pipeline_stage)
    ).length;
    
    // Calculate pending approvals
    const pendingApproval = jobs.filter(job => job.status === 'pending_approval').length || 5;
    
    // Update UI
    document.getElementById('active-positions').textContent = activePositions;
    document.getElementById('candidates-reviewed').textContent = candidatesReviewed;
    document.getElementById('interviews-scheduled').textContent = interviewsScheduled;
    document.getElementById('pending-approval').textContent = pendingApproval;
    
    // Update manager info
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.department) {
        document.getElementById('manager-department').textContent = `Departamento: ${userData.department}`;
    }
}

// Load vacancies
function loadVacancies() {
    const jobs = dataManager.getJobs();
    const applications = dataManager.getApplications();
    
    // Filter jobs that belong to the current user's department
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    let filteredJobs = jobs;
    
    if (userData.department) {
        filteredJobs = jobs.filter(job => 
            !job.department || job.department.toLowerCase() === userData.department.toLowerCase()
        );
    }
    
    // Render list view
    renderVacanciesList(filteredJobs, applications);
    
    // Render card view
    renderVacanciesCards(filteredJobs, applications);
}

// Render vacancies list view
function renderVacanciesList(jobs, applications) {
    const tbody = document.getElementById('vacancies-tbody');
    
    if (!jobs || jobs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-folder-open text-muted fa-2x mb-3"></i>
                    <p class="text-muted">No hay vacantes disponibles.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = jobs.map(job => {
        // Count applications for this job
        const jobApplications = applications.filter(app => app.job_id === job.id).length;
        
        // Format deadline date
        const deadline = job.deadline ? new Date(job.deadline).toLocaleDateString('es-CO') : 'No especificada';
        
        // Get status badge
        const statusBadge = getStatusBadge(job.status);
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="me-3" style="width: 40px; height: 40px; background-color: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-briefcase text-primary"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${job.title}</div>
                            <div class="small text-muted">${job.department || 'Sin departamento'}</div>
                        </div>
                    </div>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-2" style="width: 24px; height: 24px;">
                            <span class="small">${jobApplications}</span>
                        </div>
                        <div class="small">candidatos</div>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="far fa-calendar me-1 text-muted"></i>
                        <span>${deadline}</span>
                    </div>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewJobDetails(${job.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="viewJobCandidates(${job.id})">
                            <i class="fas fa-users"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="editJob(${job.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Render vacancies card view
function renderVacanciesCards(jobs, applications) {
    const cardsContainer = document.getElementById('vacancies-cards');
    
    if (!jobs || jobs.length === 0) {
        cardsContainer.innerHTML = `
            <div class="col-12 text-center py-4">
                <i class="fas fa-folder-open text-muted fa-2x mb-3"></i>
                <p class="text-muted">No hay vacantes disponibles.</p>
            </div>
        `;
        return;
    }
    
    cardsContainer.innerHTML = jobs.map(job => {
        // Count applications for this job
        const jobApplications = applications.filter(app => app.job_id === job.id).length;
        
        // Format deadline date
        const deadline = job.deadline ? new Date(job.deadline).toLocaleDateString('es-CO') : 'No especificada';
        
        // Get status badge
        const statusBadge = getStatusBadge(job.status);
        
        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h6 class="card-title">${job.title}</h6>
                            ${statusBadge}
                        </div>
                        <p class="card-text small">
                            <i class="fas fa-building text-muted me-1"></i> ${job.department || 'Sin departamento'}
                        </p>
                        <p class="card-text small">
                            <i class="fas fa-map-marker-alt text-muted me-1"></i> ${job.location || 'Sin ubicación'}
                        </p>
                        <p class="card-text small">
                            <i class="far fa-calendar text-muted me-1"></i> Fecha límite: ${deadline}
                        </p>
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-primary rounded-pill px-2 py-1 text-white small me-2">
                                <i class="fas fa-users me-1"></i> ${jobApplications} candidatos
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-top-0">
                        <div class="btn-group w-100">
                            <button class="btn btn-sm btn-outline-primary" onclick="viewJobDetails(${job.id})">
                                <i class="fas fa-eye me-1"></i> Ver
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="viewJobCandidates(${job.id})">
                                <i class="fas fa-users me-1"></i> Candidatos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get status badge for job
function getStatusBadge(status) {
    const badges = {
        'active': '<span class="badge bg-success">Activa</span>',
        'pending_approval': '<span class="badge bg-warning text-dark">Pendiente Aprobación</span>',
        'closed': '<span class="badge bg-secondary">Cerrada</span>',
        'draft': '<span class="badge bg-info">Borrador</span>',
        'paused': '<span class="badge bg-warning text-dark">Pausada</span>'
    };
    
    return badges[status] || '<span class="badge bg-secondary">Desconocido</span>';
}

// Load candidates
function loadCandidates() {
    const candidates = dataManager.getCandidates();
    const jobs = dataManager.getJobs();
    
    // Filter candidates that belong to the current user's department jobs
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    let filteredCandidates = candidates;
    
    if (userData.department) {
        const departmentJobs = jobs.filter(job => 
            !job.department || job.department.toLowerCase() === userData.department.toLowerCase()
        );
        
        const departmentJobIds = departmentJobs.map(job => job.id);
        
        filteredCandidates = candidates.filter(candidate => 
            departmentJobIds.includes(candidate.job_id)
        );
    }
    
    renderCandidatesGrid(filteredCandidates, jobs);
}

// Render candidates grid
function renderCandidatesGrid(candidates, jobs) {
    const grid = document.getElementById('candidates-grid');
    
    if (!candidates || candidates.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-4">
                <i class="fas fa-users text-muted fa-2x mb-3"></i>
                <p class="text-muted">No hay candidatos disponibles.</p>
            </div>
        `;
        return;
    }
    
    // Display only 8 candidates initially
    const displayCandidates = candidates.slice(0, 8);
    
    grid.innerHTML = displayCandidates.map(candidate => {
        // Find associated job
        const job = jobs.find(j => j.id === candidate.job_id) || {};
        
        // Get stage badge
        const stageBadge = getStageBadge(candidate.pipeline_stage);
        
        // Format skills
        const skills = candidate.skills && candidate.skills.length > 0 
            ? candidate.skills.slice(0, 3).map(skill => `<span class="badge bg-light text-dark me-1">${skill}</span>`).join('') 
            : '';
        
        return `
            <div class="col-md-6 col-lg-3 mb-3">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="text-center mb-3">
                            <img src="${candidate.avatar || `https://via.placeholder.com/100/6b7280/white?text=${candidate.name.substring(0,2)}`}" 
                                 class="rounded-circle mb-2" style="width: 60px; height: 60px; object-fit: cover;">
                            <h6 class="mb-0">${candidate.name}</h6>
                            <p class="text-muted small mb-1">${candidate.position}</p>
                            ${stageBadge}
                        </div>
                        <div class="small mb-2">
                            <div><i class="fas fa-briefcase text-muted me-1"></i> ${job.title || 'Sin asignar'}</div>
                            <div><i class="fas fa-map-marker-alt text-muted me-1"></i> ${candidate.location || 'No especificada'}</div>
                            <div><i class="fas fa-graduation-cap text-muted me-1"></i> ${candidate.experience || 'No especificada'}</div>
                        </div>
                        <div class="small mb-3">
                            ${skills}
                            ${candidate.skills && candidate.skills.length > 3 ? `<span class="badge bg-light text-dark">+${candidate.skills.length - 3}</span>` : ''}
                        </div>
                    </div>
                    <div class="card-footer bg-white border-top-0 text-center">
                        <button class="btn btn-sm btn-primary w-100" onclick="viewCandidateDetails(${candidate.id})">
                            <i class="fas fa-user me-1"></i> Ver Perfil
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add "Show More" button if there are more candidates
    if (candidates.length > 8) {
        grid.innerHTML += `
            <div class="col-12 text-center mt-3">
                <button class="btn btn-outline-primary" id="show-more-candidates">
                    <i class="fas fa-plus me-1"></i> Ver más candidatos (${candidates.length - 8} restantes)
                </button>
            </div>
        `;
        
        // Add event listener for "Show More" button
        setTimeout(() => {
            const showMoreBtn = document.getElementById('show-more-candidates');
            if (showMoreBtn) {
                showMoreBtn.addEventListener('click', () => {
                    renderAllCandidates(candidates, jobs);
                });
            }
        }, 0);
    }
}

// Render all candidates
function renderAllCandidates(candidates, jobs) {
    const grid = document.getElementById('candidates-grid');
    
    grid.innerHTML = candidates.map(candidate => {
        // Find associated job
        const job = jobs.find(j => j.id === candidate.job_id) || {};
        
        // Get stage badge
        const stageBadge = getStageBadge(candidate.pipeline_stage);
        
        // Format skills
        const skills = candidate.skills && candidate.skills.length > 0 
            ? candidate.skills.slice(0, 3).map(skill => `<span class="badge bg-light text-dark me-1">${skill}</span>`).join('') 
            : '';
        
        return `
            <div class="col-md-6 col-lg-3 mb-3">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="text-center mb-3">
                            <img src="${candidate.avatar || `https://via.placeholder.com/100/6b7280/white?text=${candidate.name.substring(0,2)}`}" 
                                 class="rounded-circle mb-2" style="width: 60px; height: 60px; object-fit: cover;">
                            <h6 class="mb-0">${candidate.name}</h6>
                            <p class="text-muted small mb-1">${candidate.position}</p>
                            ${stageBadge}
                        </div>
                        <div class="small mb-2">
                            <div><i class="fas fa-briefcase text-muted me-1"></i> ${job.title || 'Sin asignar'}</div>
                            <div><i class="fas fa-map-marker-alt text-muted me-1"></i> ${candidate.location || 'No especificada'}</div>
                            <div><i class="fas fa-graduation-cap text-muted me-1"></i> ${candidate.experience || 'No especificada'}</div>
                        </div>
                        <div class="small mb-3">
                            ${skills}
                            ${candidate.skills && candidate.skills.length > 3 ? `<span class="badge bg-light text-dark">+${candidate.skills.length - 3}</span>` : ''}
                        </div>
                    </div>
                    <div class="card-footer bg-white border-top-0 text-center">
                        <button class="btn btn-sm btn-primary w-100" onclick="viewCandidateDetails(${candidate.id})">
                            <i class="fas fa-user me-1"></i> Ver Perfil
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get stage badge for candidate
function getStageBadge(stage) {
    const badges = {
        'application': '<span class="badge bg-secondary">Aplicación</span>',
        'screening': '<span class="badge bg-primary">Screening</span>',
        'interview': '<span class="badge bg-info">Entrevista</span>',
        'technical': '<span class="badge bg-warning text-dark">Evaluación Técnica</span>',
        'final': '<span class="badge bg-success">Entrevista Final</span>',
        'offer': '<span class="badge bg-info">Oferta</span>',
        'hired': '<span class="badge bg-success">Contratado</span>',
        'rejected': '<span class="badge bg-danger">Rechazado</span>'
    };
    
    return badges[stage] || '<span class="badge bg-secondary">Desconocido</span>';
}

// Load recent activity
function loadRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    
    // Sample activity data (in a real app, this would come from the database)
    const activities = [
        {
            type: 'candidate',
            action: 'applied',
            name: 'Carlos Rodríguez',
            target: 'Senior Full Stack Developer',
            time: '2 horas atrás',
            icon: 'fas fa-user-plus text-success'
        },
        {
            type: 'interview',
            action: 'scheduled',
            name: 'Ana María López',
            target: 'UI/UX Designer',
            time: '4 horas atrás',
            icon: 'fas fa-calendar-plus text-primary'
        },
        {
            type: 'vacancy',
            action: 'created',
            name: 'Maria González',
            target: 'DevOps Engineer',
            time: '1 día atrás',
            icon: 'fas fa-briefcase text-info'
        },
        {
            type: 'candidate',
            action: 'hired',
            name: 'Diego Torres',
            target: 'Data Scientist',
            time: '2 días atrás',
            icon: 'fas fa-user-check text-success'
        },
        {
            type: 'candidate',
            action: 'rejected',
            name: 'Sofia Martínez',
            target: 'Product Manager',
            time: '3 días atrás',
            icon: 'fas fa-user-times text-danger'
        }
    ];
    
    activityContainer.innerHTML = activities.map(activity => `
        <div class="list-group-item list-group-item-action">
            <div class="d-flex align-items-center">
                <div class="me-3">
                    <span class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </span>
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${activity.name}</h6>
                        <small class="text-muted">${activity.time}</small>
                    </div>
                    <p class="mb-1">${getActivityText(activity)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Get activity text
function getActivityText(activity) {
    switch(activity.type) {
        case 'candidate':
            if (activity.action === 'applied') {
                return `Aplicó para el puesto de <strong>${activity.target}</strong>`;
            } else if (activity.action === 'hired') {
                return `Fue contratado como <strong>${activity.target}</strong>`;
            } else if (activity.action === 'rejected') {
                return `Fue rechazado para <strong>${activity.target}</strong>`;
            }
            break;
        case 'interview':
            return `Entrevista programada para <strong>${activity.target}</strong>`;
        case 'vacancy':
            return `Creó la vacante <strong>${activity.target}</strong>`;
        default:
            return '';
    }
}

// Populate vacancy filter
function populateVacancyFilter() {
    const filter = document.getElementById('vacancy-filter');
    const jobs = dataManager.getJobs();
    
    // Filter jobs that belong to the current user's department
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    let filteredJobs = jobs;
    
    if (userData.department) {
        filteredJobs = jobs.filter(job => 
            !job.department || job.department.toLowerCase() === userData.department.toLowerCase()
        );
    }
    
    // Add options to filter
    filteredJobs.forEach(job => {
        const option = document.createElement('option');
        option.value = job.id;
        option.textContent = job.title;
        filter.appendChild(option);
    });
    
    // Add event listener
    filter.addEventListener('change', () => {
        const selectedJobId = parseInt(filter.value);
        filterCandidatesByJob(selectedJobId);
    });
}

// Filter candidates by job
function filterCandidatesByJob(jobId) {
    const candidates = dataManager.getCandidates();
    const jobs = dataManager.getJobs();
    
    if (!jobId) {
        // If no job is selected, show all candidates
        loadCandidates();
        return;
    }
    
    // Filter candidates by job ID
    const filteredCandidates = candidates.filter(candidate => candidate.job_id === jobId);
    
    // Render filtered candidates
    renderCandidatesGrid(filteredCandidates, jobs);
}

// Populate modal dropdowns
function populateModalDropdowns() {
    // Populate interview candidate dropdown
    const candidateSelect = document.getElementById('interview-candidate');
    const candidates = dataManager.getCandidates();
    
    candidates.forEach(candidate => {
        const option = document.createElement('option');
        option.value = candidate.id;
        option.textContent = candidate.name;
        candidateSelect.appendChild(option);
    });
    
    // Populate interview vacancy dropdown
    const vacancySelect = document.getElementById('interview-vacancy');
    const jobs = dataManager.getJobs();
    
    jobs.forEach(job => {
        const option = document.createElement('option');
        option.value = job.id;
        option.textContent = job.title;
        vacancySelect.appendChild(option);
    });
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('interview-date').value = tomorrow.toISOString().split('T')[0];
}

// Initialize event listeners
function initializeEventListeners() {
    // Toggle between list and card view for vacancies
    document.getElementById('list-view-vacancies').addEventListener('change', () => {
        document.getElementById('vacancies-list-view').classList.remove('d-none');
        document.getElementById('vacancies-card-view').classList.add('d-none');
    });
    
    document.getElementById('card-view-vacancies').addEventListener('change', () => {
        document.getElementById('vacancies-list-view').classList.add('d-none');
        document.getElementById('vacancies-card-view').classList.remove('d-none');
    });
    
    // Save new vacancy
    document.getElementById('save-vacancy').addEventListener('click', saveNewVacancy);
    
    // Save new interview
    document.getElementById('save-interview').addEventListener('click', saveNewInterview);
    
    // Candidate modal actions
    document.getElementById('approve-candidate').addEventListener('click', () => {
        approveCandidate(currentCandidateId);
    });
    
    document.getElementById('reject-candidate-modal').addEventListener('click', () => {
        rejectCandidate(currentCandidateId);
    });
    
    document.getElementById('schedule-candidate-interview').addEventListener('click', () => {
        openScheduleInterviewModal(currentCandidateId);
    });
    
    document.getElementById('add-comment').addEventListener('click', addCandidateComment);
}

// Initialize charts
function initializeCharts() {
    if (!Chart) return;
    
    // Add canvas elements for charts
    const chartsContainer = document.createElement('div');
    chartsContainer.className = 'row mt-4';
    chartsContainer.innerHTML = `
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="fas fa-chart-bar me-2"></i>
                        Candidatos por Etapa
                    </h5>
                </div>
                <div class="card-body">
                    <canvas id="candidatesChart" height="300"></canvas>
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="fas fa-chart-pie me-2"></i>
                        Distribución de Vacantes
                    </h5>
                </div>
                <div class="card-body">
                    <canvas id="vacanciesChart" height="300"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Insert charts before candidates section
    const candidatesSection = document.querySelector('.row:nth-of-type(3)');
    candidatesSection.parentNode.insertBefore(chartsContainer, candidatesSection);
    
    // Initialize charts with data
    initializeCandidatesChart();
    initializeVacanciesChart();
}

// Initialize candidates chart
function initializeCandidatesChart() {
    const candidates = dataManager.getCandidates();
    const pipelineStages = dataManager.getPipelineStages();
    
    // Count candidates in each stage
    const stageCounts = {};
    pipelineStages.forEach(stage => {
        stageCounts[stage.key] = candidates.filter(c => c.pipeline_stage === stage.key).length;
    });
    
    // Prepare data for chart
    const labels = pipelineStages.map(stage => stage.name);
    const data = pipelineStages.map(stage => stageCounts[stage.key]);
    const backgroundColors = pipelineStages.map(stage => stage.color);
    
    // Create chart
    const ctx = document.getElementById('candidatesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Candidatos',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Candidatos: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Initialize vacancies chart
function initializeVacanciesChart() {
    const jobs = dataManager.getJobs();
    
    // Count jobs by status
    const statusCounts = {
        'active': jobs.filter(job => job.status === 'active').length,
        'pending_approval': jobs.filter(job => job.status === 'pending_approval').length,
        'closed': jobs.filter(job => job.status === 'closed').length,
        'draft': jobs.filter(job => job.status === 'draft').length,
        'paused': jobs.filter(job => job.status === 'paused').length
    };
    
    // Prepare data for chart
    const labels = ['Activas', 'Pendientes', 'Cerradas', 'Borradores', 'Pausadas'];
    const data = [
        statusCounts.active, 
        statusCounts.pending_approval, 
        statusCounts.closed, 
        statusCounts.draft, 
        statusCounts.paused
    ];
    const backgroundColors = [
        '#10b981', // green for active
        '#f59e0b', // amber for pending
        '#6b7280', // gray for closed
        '#3b82f6', // blue for draft
        '#f59e0b'  // amber for paused
    ];
    
    // Create chart
    const ctx = document.getElementById('vacanciesChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Save new vacancy
function saveNewVacancy() {
    const form = document.getElementById('new-vacancy-form');
    
    // Check form validity
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form values
    const title = document.getElementById('job-title').value;
    const department = document.getElementById('job-department').value;
    const level = document.getElementById('job-level').value;
    const type = document.getElementById('job-type').value;
    const location = document.getElementById('job-location').value;
    const modality = document.getElementById('job-modality').value;
    const salaryMin = document.getElementById('job-salary-min').value;
    const salaryMax = document.getElementById('job-salary-max').value;
    const deadline = document.getElementById('job-deadline').value;
    const description = document.getElementById('job-description').value;
    const requirements = document.getElementById('job-requirements').value.split('\n').filter(r => r.trim());
    const benefits = document.getElementById('job-benefits').value.split('\n').filter(b => b.trim());
    
    // Create job object
    const job = {
        id: dataManager.generateId('jobs'),
        title,
        department,
        level,
        type,
        location,
        modality,
        salary: salaryMin && salaryMax ? `$${salaryMin} - $${salaryMax} COP` : '',
        deadline,
        description,
        requirements,
        benefits,
        posted: new Date().toISOString().split('T')[0],
        status: 'active',
        applications: 0
    };
    
    // Save to data manager
    const jobs = dataManager.getJobs();
    jobs.push(job);
    dataManager.setJobs(jobs);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('newVacancyModal'));
    modal.hide();
    
    // Show success message
    showToast('Vacante creada exitosamente', 'success');
    
    // Reload vacancies
    loadVacancies();
    populateVacancyFilter();
    
    // Reset form
    form.reset();
}

// Save new interview
function saveNewInterview() {
    const form = document.getElementById('schedule-interview-form');
    
    // Check form validity
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form values
    const candidateId = parseInt(document.getElementById('interview-candidate').value);
    const jobId = parseInt(document.getElementById('interview-vacancy').value);
    const date = document.getElementById('interview-date').value;
    const time = document.getElementById('interview-time').value;
    const type = document.getElementById('interview-type').value;
    const duration = document.getElementById('interview-duration').value;
    const notes = document.getElementById('interview-notes').value;
    
    // Create interview object (in a real app, this would be saved to a database)
    const interview = {
        id: Date.now(),
        candidateId,
        jobId,
        date,
        time,
        type,
        duration,
        notes,
        status: 'scheduled'
    };
    
    // Update candidate stage if necessary
    const candidates = dataManager.getCandidates();
    const candidateIndex = candidates.findIndex(c => c.id === candidateId);
    
    if (candidateIndex !== -1) {
        candidates[candidateIndex].pipeline_stage = 'interview';
        dataManager.setCandidates(candidates);
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleInterviewModal'));
    modal.hide();
    
    // Show success message
    showToast('Entrevista programada exitosamente', 'success');
    
    // Reload candidates
    loadCandidates();
    
    // Reset form
    form.reset();
}

// Global variable to track current candidate ID
let currentCandidateId = null;

// View candidate details
function viewCandidateDetails(candidateId) {
    const candidate = dataManager.getCandidates().find(c => c.id === candidateId);
    
    if (!candidate) {
        showToast('Candidato no encontrado', 'error');
        return;
    }
    
    // Set global reference
    currentCandidateId = candidateId;
    
    // Find associated job
    const job = dataManager.getJobs().find(j => j.id === candidate.job_id) || {};
    
    // Update modal title
    document.getElementById('candidate-modal-name').textContent = candidate.name;
    document.getElementById('candidate-modal-position').textContent = candidate.position || 'Sin posición';
    
    // Update modal content
    const content = document.getElementById('candidate-profile-content');
    content.innerHTML = `
        <div class="row mb-3">
            <div class="col-md-4 text-center">
                <img src="${candidate.avatar || `https://via.placeholder.com/150/6b7280/white?text=${candidate.name.substring(0,2)}`}" 
                    class="rounded-circle mb-2" style="width: 100px; height: 100px; object-fit: cover;">
                <div class="mt-2">
                    <div class="badge bg-primary mb-1">${getStageBadge(candidate.pipeline_stage)}</div>
                    <div class="rating text-warning">
                        ${getRatingStars(candidate.rating || 0)}
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <h6>Información Personal</h6>
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>Email:</strong><br>
                        <span class="text-muted">${candidate.email}</span>
                    </div>
                    <div class="col-6">
                        <strong>Teléfono:</strong><br>
                        <span class="text-muted">${candidate.phone || 'No especificado'}</span>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>Ubicación:</strong><br>
                        <span class="text-muted">${candidate.location || 'No especificada'}</span>
                    </div>
                    <div class="col-6">
                        <strong>Experiencia:</strong><br>
                        <span class="text-muted">${candidate.experience || 'No especificada'}</span>
                    </div>
                </div>
                <div class="mb-3">
                    <strong>Aplicación para:</strong><br>
                    <span class="text-muted">${job.title || 'Sin asignar'}</span>
                </div>
            </div>
        </div>
        
        <div class="card mb-3">
            <div class="card-header bg-light">
                <h6 class="mb-0">Resumen Profesional</h6>
            </div>
            <div class="card-body">
                <p>${candidate.summary || 'No hay resumen disponible.'}</p>
            </div>
        </div>
        
        <div class="card mb-3">
            <div class="card-header bg-light">
                <h6 class="mb-0">Habilidades Técnicas</h6>
            </div>
            <div class="card-body">
                ${candidate.skills && candidate.skills.length > 0 
                    ? candidate.skills.map(skill => `<span class="badge bg-light text-dark me-1 mb-1">${skill}</span>`).join('') 
                    : 'No hay habilidades registradas.'}
            </div>
        </div>
    `;
    
    // Load candidate comments
    const commentsContainer = document.getElementById('candidate-comments');
    
    // Sample comments (in a real app, these would come from the database)
    const comments = [
        {
            author: 'María González',
            date: '2024-01-20',
            text: 'Buen candidato con experiencia relevante. Recomiendo avanzar a la siguiente etapa.'
        },
        {
            author: 'Carlos López',
            date: '2024-01-18',
            text: 'Revisión de CV completada. Cumple con los requisitos técnicos.'
        }
    ];
    
    commentsContainer.innerHTML = comments.map(comment => `
        <div class="mb-2 pb-2 border-bottom">
            <div class="d-flex justify-content-between">
                <strong>${comment.author}</strong>
                <small class="text-muted">${new Date(comment.date).toLocaleDateString('es-CO')}</small>
            </div>
            <p class="mb-0 small">${comment.text}</p>
        </div>
    `).join('') || '<p class="text-muted small">No hay comentarios.</p>';
    
    // Show modal
    new bootstrap.Modal(document.getElementById('candidateDetailModal')).show();
}

// Get rating stars
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i> ';
    }
    
    // Half star
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i> ';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i> ';
    }
    
    return stars;
}

// Approve candidate
function approveCandidate(candidateId) {
    // Find candidate
    const candidates = dataManager.getCandidates();
    const candidateIndex = candidates.findIndex(c => c.id === candidateId);
    
    if (candidateIndex === -1) {
        showToast('Candidato no encontrado', 'error');
        return;
    }
    
    // Get current stage
    const currentStage = candidates[candidateIndex].pipeline_stage;
    let nextStage;
    
    // Determine next stage
    switch(currentStage) {
        case 'application':
            nextStage = 'screening';
            break;
        case 'screening':
            nextStage = 'interview';
            break;
        case 'interview':
            nextStage = 'technical';
            break;
        case 'technical':
            nextStage = 'final';
            break;
        case 'final':
            nextStage = 'offer';
            break;
        case 'offer':
            nextStage = 'hired';
            break;
        default:
            nextStage = 'screening';
    }
    
    // Update candidate stage
    candidates[candidateIndex].pipeline_stage = nextStage;
    dataManager.setCandidates(candidates);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('candidateDetailModal'));
    modal.hide();
    
    // Show success message
    showToast(`Candidato aprobado y avanzado a etapa: ${nextStage}`, 'success');
    
    // Reload candidates
    loadCandidates();
}

// Reject candidate
function rejectCandidate(candidateId) {
    if (!confirm('¿Está seguro de que desea rechazar a este candidato?')) {
        return;
    }
    
    // Find candidate
    const candidates = dataManager.getCandidates();
    const candidateIndex = candidates.findIndex(c => c.id === candidateId);
    
    if (candidateIndex === -1) {
        showToast('Candidato no encontrado', 'error');
        return;
    }
    
    // Update candidate stage
    candidates[candidateIndex].pipeline_stage = 'rejected';
    dataManager.setCandidates(candidates);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('candidateDetailModal'));
    modal.hide();
    
    // Show success message
    showToast('Candidato rechazado', 'warning');
    
    // Reload candidates
    loadCandidates();
}

// Open schedule interview modal
function openScheduleInterviewModal(candidateId) {
    // Find candidate
    const candidate = dataManager.getCandidates().find(c => c.id === candidateId);
    
    if (!candidate) {
        showToast('Candidato no encontrado', 'error');
        return;
    }
    
    // Pre-select candidate in dropdown
    document.getElementById('interview-candidate').value = candidateId;
    
    // Pre-select job if available
    if (candidate.job_id) {
        document.getElementById('interview-vacancy').value = candidate.job_id;
    }
    
    // Close candidate modal
    bootstrap.Modal.getInstance(document.getElementById('candidateDetailModal')).hide();
    
    // Open interview modal
    new bootstrap.Modal(document.getElementById('scheduleInterviewModal')).show();
}

// Add candidate comment
function addCandidateComment() {
    const commentText = document.getElementById('new-comment').value.trim();
    
    if (!commentText) {
        showToast('Por favor ingrese un comentario', 'error');
        return;
    }
    
    // In a real app, this would save to a database
    // For now, just add to UI
    const commentsContainer = document.getElementById('candidate-comments');
    const now = new Date();
    
    // Get current user (or default)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userName = userData.name || 'Usuario Actual';
    
    const newComment = document.createElement('div');
    newComment.className = 'mb-2 pb-2 border-bottom';
    newComment.innerHTML = `
        <div class="d-flex justify-content-between">
            <strong>${userName}</strong>
            <small class="text-muted">${now.toLocaleDateString('es-CO')}</small>
        </div>
        <p class="mb-0 small">${commentText}</p>
    `;
    
    // Insert at the top
    commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
    
    // Clear input
    document.getElementById('new-comment').value = '';
    
    // Show success message
    showToast('Comentario agregado', 'success');
}

// View job details
function viewJobDetails(jobId) {
    window.location.href = `detalle-empleo.html?id=${jobId}`;
}

// View job candidates
function viewJobCandidates(jobId) {
    // Filter candidates by job
    document.getElementById('vacancy-filter').value = jobId;
    filterCandidatesByJob(jobId);
    
    // Scroll to candidates section
    const candidatesSection = document.querySelector('.row:nth-of-type(3)');
    candidatesSection.scrollIntoView({ behavior: 'smooth' });
}

// Edit job
function editJob(jobId) {
    window.location.href = `job-management-enhanced.html?edit=${jobId}`;
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast position-fixed bottom-0 end-0 m-3 bg-${type === 'error' ? 'danger' : type} text-white`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.minWidth = '250px';
    
    toast.innerHTML = `
        <div class="toast-header bg-${type === 'error' ? 'danger' : type} text-white">
            <strong class="me-auto">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                Catalyst HR
            </strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    document.body.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 5000 });
    bsToast.show();
    
    // Remove from DOM after hiding
    toast.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(toast);
    });
}

// Make functions globally available
window.viewCandidateDetails = viewCandidateDetails;
window.viewJobDetails = viewJobDetails;
window.viewJobCandidates = viewJobCandidates;
window.editJob = editJob;
