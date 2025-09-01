/**
 * Job Management Module
 * Responsible for CRUD operations on job listings
 */
import { dataManager } from './data-manager.js';
import { showToast, confirmDialog } from './ui.js';

const JobManagement = {
    jobs: [],
    filteredJobs: [],
    filterCriteria: {
        status: 'all',
        department: 'all',
        search: ''
    },
    
    /**
     * Initialize the job management module
     */
    init: function() {
        console.log('🔄 Initializing Job Management module...');
        this.loadJobs();
        this.setupEventListeners();
        this.loadFilterOptions();
    },
    
    /**
     * Set up all event listeners for job management
     */
    setupEventListeners: function() {
        // Job creation and editing
        document.getElementById('new-job-form')?.addEventListener('submit', this.handleJobSubmit.bind(this));
        document.getElementById('job-image-upload')?.addEventListener('change', this.handleImageUpload.bind(this));
        
        // Filtering
        document.getElementById('job-status-filter')?.addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('job-department-filter')?.addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('job-search')?.addEventListener('input', this.handleSearchInput.bind(this));
        
        // Bulk actions
        document.getElementById('job-export-btn')?.addEventListener('click', this.exportJobs.bind(this));
        document.getElementById('job-import-btn')?.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('job-import-modal'));
            modal.show();
        });
        
        // Import form
        document.getElementById('job-import-form')?.addEventListener('submit', this.handleImportSubmit.bind(this));
        
        // Job actions delegate (for edit, delete, duplicate buttons)
        document.getElementById('job-table')?.addEventListener('click', this.handleJobActions.bind(this));
    },
    
    /**
     * Load jobs from data manager
     */
    loadJobs: function() {
        try {
            this.jobs = dataManager.getJobs();
            this.applyFilters();
            this.renderJobs();
        } catch (error) {
            console.error('Error loading jobs:', error);
            showToast('Error al cargar las vacantes', 'error');
        }
    },
    
    /**
     * Apply current filters to the jobs list
     */
    applyFilters: function() {
        this.filteredJobs = this.jobs.filter(job => {
            // Status filter
            if (this.filterCriteria.status !== 'all' && job.status !== this.filterCriteria.status) {
                return false;
            }
            
            // Department filter
            if (this.filterCriteria.department !== 'all' && job.department !== this.filterCriteria.department) {
                return false;
            }
            
            // Search filter
            if (this.filterCriteria.search && this.filterCriteria.search.trim() !== '') {
                const searchLower = this.filterCriteria.search.toLowerCase();
                return (
                    job.title.toLowerCase().includes(searchLower) ||
                    job.description.toLowerCase().includes(searchLower) ||
                    job.location.toLowerCase().includes(searchLower)
                );
            }
            
            return true;
        });
    },
    
    /**
     * Render the job listings in the table
     */
    renderJobs: function() {
        const tableBody = document.getElementById('job-table-body');
        if (!tableBody) return;
        
        // Update counter
        const counter = document.getElementById('job-count');
        if (counter) {
            counter.textContent = `${this.filteredJobs.length} vacante${this.filteredJobs.length !== 1 ? 's' : ''}`;
        }
        
        // Clear the table
        tableBody.innerHTML = '';
        
        if (this.filteredJobs.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="text-muted">
                            <i class="fas fa-search fa-2x mb-3"></i>
                            <p>No se encontraron vacantes que coincidan con los criterios de búsqueda.</p>
                            <button class="btn btn-sm btn-outline-primary" id="reset-filters-btn">
                                <i class="fas fa-undo me-1"></i> Restablecer filtros
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            document.getElementById('reset-filters-btn')?.addEventListener('click', this.resetFilters.bind(this));
            return;
        }
        
        // Add rows for each job
        this.filteredJobs.forEach(job => {
            const applicationsCount = dataManager.getApplicationsForJob(job.id).length;
            const row = document.createElement('tr');
            row.setAttribute('data-job-id', job.id);
            
            row.innerHTML = `
                <td class="align-middle">
                    <div class="d-flex align-items-center">
                        <div class="job-image me-3">
                            <img src="${job.image || 'assets/img/job-placeholder.png'}" alt="${job.title}" class="img-fluid rounded" style="width: 50px; height: 50px; object-fit: cover;">
                        </div>
                        <div>
                            <h6 class="mb-0">${job.title}</h6>
                            <small class="text-muted">${job.location}</small>
                        </div>
                    </div>
                </td>
                <td class="align-middle">${job.department}</td>
                <td class="align-middle">${job.type}</td>
                <td class="align-middle">
                    <span class="badge bg-${this.getStatusColor(job.status)}">${this.getStatusText(job.status)}</span>
                </td>
                <td class="align-middle">${this.formatDate(job.publishDate)}</td>
                <td class="align-middle">
                    <a href="kanban.html?job=${job.id}" class="text-decoration-none">
                        <span class="badge rounded-pill bg-primary">${applicationsCount}</span>
                    </a>
                </td>
                <td class="align-middle text-end">
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-light job-view-btn" data-job-id="${job.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-light job-edit-btn" data-job-id="${job.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-light job-duplicate-btn" data-job-id="${job.id}">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-light job-delete-btn" data-job-id="${job.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    /**
     * Get color class for job status
     */
    getStatusColor: function(status) {
        const statusColors = {
            'active': 'success',
            'draft': 'secondary',
            'closed': 'danger',
            'paused': 'warning'
        };
        return statusColors[status] || 'secondary';
    },
    
    /**
     * Get human-readable status text
     */
    getStatusText: function(status) {
        const statusTexts = {
            'active': 'Activa',
            'draft': 'Borrador',
            'closed': 'Cerrada',
            'paused': 'Pausada'
        };
        return statusTexts[status] || status;
    },
    
    /**
     * Format date for display
     */
    formatDate: function(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },
    
    /**
     * Load filter options (departments, etc.)
     */
    loadFilterOptions: function() {
        const departmentFilter = document.getElementById('job-department-filter');
        if (!departmentFilter) return;
        
        // Get unique departments
        const departments = [...new Set(this.jobs.map(job => job.department))];
        
        // Clear existing options except the first one
        while (departmentFilter.options.length > 1) {
            departmentFilter.remove(1);
        }
        
        // Add department options
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department;
            option.textContent = department;
            departmentFilter.appendChild(option);
        });
    },
    
    /**
     * Handle filter changes
     */
    handleFilterChange: function(event) {
        const { id, value } = event.target;
        
        if (id === 'job-status-filter') {
            this.filterCriteria.status = value;
        } else if (id === 'job-department-filter') {
            this.filterCriteria.department = value;
        }
        
        this.applyFilters();
        this.renderJobs();
    },
    
    /**
     * Handle search input
     */
    handleSearchInput: function(event) {
        this.filterCriteria.search = event.target.value;
        this.applyFilters();
        this.renderJobs();
    },
    
    /**
     * Reset all filters
     */
    resetFilters: function() {
        this.filterCriteria = {
            status: 'all',
            department: 'all',
            search: ''
        };
        
        // Reset form elements
        document.getElementById('job-status-filter').value = 'all';
        document.getElementById('job-department-filter').value = 'all';
        document.getElementById('job-search').value = '';
        
        this.applyFilters();
        this.renderJobs();
    },
    
    /**
     * Handle job form submission (create/update)
     */
    handleJobSubmit: function(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const jobData = {
            title: formData.get('job-title'),
            department: formData.get('job-department'),
            location: formData.get('job-location'),
            type: formData.get('job-type'),
            status: formData.get('job-status'),
            description: formData.get('job-description'),
            requirements: formData.get('job-requirements'),
            salary: formData.get('job-salary'),
            publishDate: formData.get('job-publish-date'),
            closingDate: formData.get('job-closing-date'),
            skills: formData.getAll('job-skills'),
            benefits: formData.getAll('job-benefits')
        };
        
        // Get the job image from preview or default
        const imagePreview = document.getElementById('job-image-preview');
        if (imagePreview && imagePreview.src) {
            jobData.image = imagePreview.src;
        }
        
        const jobId = form.getAttribute('data-job-id');
        
        try {
            if (jobId) {
                // Update existing job
                this.updateJob(parseInt(jobId), jobData);
                showToast('Vacante actualizada correctamente');
            } else {
                // Create new job
                this.createJob(jobData);
                showToast('Nueva vacante creada correctamente');
            }
            
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('job-modal'));
            if (modal) {
                modal.hide();
            }
            
            // Reset the form
            form.reset();
            form.removeAttribute('data-job-id');
        } catch (error) {
            console.error('Error saving job:', error);
            showToast('Error al guardar la vacante', 'error');
        }
    },
    
    /**
     * Handle image upload
     */
    handleImageUpload: function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('job-image-preview');
                if (preview) {
                    preview.src = e.target.result;
                    preview.classList.remove('d-none');
                }
            };
            reader.readAsDataURL(file);
        }
    },
    
    /**
     * Handle job action buttons (view, edit, delete, duplicate)
     */
    handleJobActions: function(event) {
        const target = event.target.closest('.job-view-btn, .job-edit-btn, .job-delete-btn, .job-duplicate-btn');
        if (!target) return;
        
        const jobId = parseInt(target.getAttribute('data-job-id'));
        const job = this.jobs.find(j => j.id === jobId);
        
        if (!job) {
            showToast('Vacante no encontrada', 'error');
            return;
        }
        
        if (target.classList.contains('job-view-btn')) {
            this.viewJob(job);
        } else if (target.classList.contains('job-edit-btn')) {
            this.editJob(job);
        } else if (target.classList.contains('job-delete-btn')) {
            this.confirmDeleteJob(jobId);
        } else if (target.classList.contains('job-duplicate-btn')) {
            this.duplicateJob(job);
        }
    },
    
    /**
     * Open modal to view job details
     */
    viewJob: function(job) {
        // Create a job detail modal
        const modalHTML = `
            <div class="modal fade" id="job-detail-modal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${job.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-4">
                                    <img src="${job.image || 'assets/img/job-placeholder.png'}" class="img-fluid rounded" alt="${job.title}">
                                </div>
                                <div class="col-md-8">
                                    <div class="d-flex justify-content-between mb-3">
                                        <div>
                                            <h5>${job.title}</h5>
                                            <p class="text-muted mb-0">${job.department} · ${job.location}</p>
                                        </div>
                                        <span class="badge bg-${this.getStatusColor(job.status)}">${this.getStatusText(job.status)}</span>
                                    </div>
                                    <div class="mb-3">
                                        <small class="text-muted">Tipo de contrato:</small>
                                        <p>${job.type}</p>
                                    </div>
                                    <div class="mb-3">
                                        <small class="text-muted">Salario:</small>
                                        <p>${job.salary || 'No especificado'}</p>
                                    </div>
                                    <div class="mb-3">
                                        <small class="text-muted">Fecha de publicación:</small>
                                        <p>${this.formatDate(job.publishDate)}</p>
                                    </div>
                                    <div>
                                        <small class="text-muted">Fecha de cierre:</small>
                                        <p>${this.formatDate(job.closingDate) || 'No especificada'}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6>Descripción</h6>
                                    <div>${job.description}</div>
                                </div>
                            </div>
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6>Requisitos</h6>
                                    <div>${job.requirements}</div>
                                </div>
                            </div>
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h6>Habilidades requeridas</h6>
                                    <div>
                                        ${job.skills?.map(skill => `<span class="badge bg-light text-dark me-2 mb-2">${skill}</span>`).join('') || 'No especificadas'}
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h6>Beneficios</h6>
                                    <div>
                                        ${job.benefits?.map(benefit => `<span class="badge bg-light text-dark me-2 mb-2">${benefit}</span>`).join('') || 'No especificados'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="view-applicants-btn">Ver candidatos</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('job-detail-modal'));
        modal.show();
        
        // Add event listener for view applicants button
        document.getElementById('view-applicants-btn')?.addEventListener('click', () => {
            modal.hide();
            window.location.href = `kanban.html?job=${job.id}`;
        });
        
        // Remove modal from DOM when hidden
        document.getElementById('job-detail-modal')?.addEventListener('hidden.bs.modal', function () {
            this.remove();
        });
    },
    
    /**
     * Open modal to edit a job
     */
    editJob: function(job) {
        const form = document.getElementById('new-job-form');
        if (!form) return;
        
        // Set form action to update
        form.setAttribute('data-job-id', job.id);
        
        // Fill form fields
        document.getElementById('job-title').value = job.title;
        document.getElementById('job-department').value = job.department;
        document.getElementById('job-location').value = job.location;
        document.getElementById('job-type').value = job.type;
        document.getElementById('job-status').value = job.status;
        document.getElementById('job-description').value = job.description;
        document.getElementById('job-requirements').value = job.requirements;
        document.getElementById('job-salary').value = job.salary || '';
        document.getElementById('job-publish-date').value = job.publishDate || '';
        document.getElementById('job-closing-date').value = job.closingDate || '';
        
        // Update image preview
        const imagePreview = document.getElementById('job-image-preview');
        if (imagePreview) {
            imagePreview.src = job.image || 'assets/img/job-placeholder.png';
            imagePreview.classList.remove('d-none');
        }
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('job-modal'));
        modal.show();
    },
    
    /**
     * Show confirmation dialog before deleting a job
     */
    confirmDeleteJob: function(jobId) {
        confirmDialog(
            '¿Estás seguro de eliminar esta vacante?',
            'Esta acción no se puede deshacer. Los candidatos asociados serán desvinculados.',
            () => this.deleteJob(jobId)
        );
    },
    
    /**
     * Create a new job
     */
    createJob: function(jobData) {
        const newJob = {
            ...jobData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            applications: 0
        };
        
        this.jobs.push(newJob);
        dataManager.saveJobs(this.jobs);
        this.loadJobs();
    },
    
    /**
     * Update an existing job
     */
    updateJob: function(jobId, jobData) {
        const index = this.jobs.findIndex(job => job.id === jobId);
        if (index === -1) {
            throw new Error('Job not found');
        }
        
        this.jobs[index] = {
            ...this.jobs[index],
            ...jobData,
            updatedAt: new Date().toISOString()
        };
        
        dataManager.saveJobs(this.jobs);
        this.loadJobs();
    },
    
    /**
     * Delete a job
     */
    deleteJob: function(jobId) {
        this.jobs = this.jobs.filter(job => job.id !== jobId);
        dataManager.saveJobs(this.jobs);
        
        // Also update applications to remove references to this job
        const applications = dataManager.getApplications();
        const updatedApplications = applications.map(app => {
            if (app.jobId === jobId) {
                return { ...app, jobId: null, status: 'orphaned' };
            }
            return app;
        });
        dataManager.saveApplications(updatedApplications);
        
        this.loadJobs();
        showToast('Vacante eliminada correctamente');
    },
    
    /**
     * Duplicate a job
     */
    duplicateJob: function(job) {
        const newJob = {
            ...job,
            id: Date.now(),
            title: `${job.title} (Copia)`,
            status: 'draft',
            createdAt: new Date().toISOString(),
            applications: 0
        };
        
        delete newJob.updatedAt;
        
        this.jobs.push(newJob);
        dataManager.saveJobs(this.jobs);
        this.loadJobs();
        showToast('Vacante duplicada correctamente');
    },
    
    /**
     * Handle job import form submission
     */
    handleImportSubmit: function(event) {
        event.preventDefault();
        const fileInput = document.getElementById('job-import-file');
        
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            showToast('Por favor selecciona un archivo', 'error');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const importedJobs = JSON.parse(e.target.result);
                if (!Array.isArray(importedJobs)) {
                    throw new Error('El archivo no contiene un formato válido');
                }
                
                // Add imported jobs
                const newJobs = importedJobs.map(job => ({
                    ...job,
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    createdAt: new Date().toISOString(),
                    status: 'draft'
                }));
                
                this.jobs = [...this.jobs, ...newJobs];
                dataManager.saveJobs(this.jobs);
                this.loadJobs();
                
                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('job-import-modal'));
                if (modal) {
                    modal.hide();
                }
                
                showToast(`${newJobs.length} vacantes importadas correctamente`);
            } catch (error) {
                console.error('Error importing jobs:', error);
                showToast('Error al importar las vacantes. Verifica el formato del archivo.', 'error');
            }
        };
        
        reader.readAsText(file);
    },
    
    /**
     * Export jobs to JSON or CSV
     */
    exportJobs: function() {
        const exportFormat = document.querySelector('input[name="export-format"]:checked')?.value || 'json';
        let data, filename, mimeType;
        
        if (exportFormat === 'csv') {
            // Convert jobs to CSV
            const headers = ['id', 'title', 'department', 'location', 'type', 'status', 'publishDate', 'closingDate'];
            const csvRows = [
                headers.join(','),
                ...this.filteredJobs.map(job => {
                    return headers.map(header => {
                        const value = job[header];
                        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
                    }).join(',');
                })
            ];
            data = csvRows.join('\n');
            filename = 'vacantes_catalyst_hr.csv';
            mimeType = 'text/csv';
        } else {
            // Export as JSON
            data = JSON.stringify(this.filteredJobs, null, 2);
            filename = 'vacantes_catalyst_hr.json';
            mimeType = 'application/json';
        }
        
        // Create download link
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`Vacantes exportadas correctamente en formato ${exportFormat.toUpperCase()}`);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    JobManagement.init();
});

export default JobManagement;

