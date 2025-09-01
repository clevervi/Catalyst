/**
 * Hiring Dashboard Module
 * Handles dashboard metrics, charts, and candidate progress tracking
 */
import { dataManager } from './data-manager.js';
import { showToast } from './ui.js';

class HiringDashboard {
    constructor() {
        this.metrics = {};
        this.charts = {};
        this.currentView = 'list';
        this.currentVacancyId = null;
        this.currentCandidateId = null;
        this.currentInterviewCandidateId = null;
        
        this.initializeEventListeners();
        this.loadData();
    }

    /**
     * Load dashboard metrics from data manager
     */
    loadMetrics() {
        try {
            const jobs = dataManager.getJobs();
            const applications = dataManager.getApplications();
            const users = dataManager.getUsers();
            
            // Basic metrics
            this.metrics = {
                totalJobs: jobs.length,
                activeJobs: jobs.filter(j => j.status === 'active').length,
                totalApplications: applications.length,
                pendingApplications: applications.filter(a => ['new', 'screening', 'interview'].includes(a.status)).length,
                hiredCandidates: applications.filter(a => a.status === 'hired').length,
                rejectedCandidates: applications.filter(a => a.status === 'rejected').length,
                averageTimeToHire: this.calculateAverageTimeToHire(applications),
                conversionRate: this.calculateConversionRate(applications)
            };
            
            // Department metrics
            this.metrics.departmentStats = this.calculateDepartmentStats(jobs, applications);
            
            // Monthly trends
            this.metrics.monthlyTrends = this.calculateMonthlyTrends(applications);
            
            // Load jobs with application counts
            this.vacancies = jobs.map(job => {
                const jobApplications = applications.filter(app => app.jobId === job.id);
                return {
                    ...job,
                    applications: jobApplications.length,
                    shortlisted: jobApplications.filter(app => app.status === 'screening').length,
                    interviewed: jobApplications.filter(app => app.status === 'interview').length,
                    statusLabel: this.getStatusLabel(job.status),
                    priorityLabel: this.getPriorityLabel(job.priority || 'medium')
                };
            });
            
        } catch (error) {
            console.error('Error loading dashboard metrics:', error);
            showToast('Error al cargar las métricas del dashboard', 'error');
            // Fallback to generated data
            this.vacancies = this.generateVacancyData();
        }
    },
    
    /**
     * Load candidates from data manager
     */
    loadCandidatesData() {
        try {
            const applications = dataManager.getApplications();
            const jobs = dataManager.getJobs();
            const users = dataManager.getUsers();
            
            this.candidates = applications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                const user = users.find(u => u.id === app.userId);
                
                return {
                    id: app.id,
                    name: user ? `${user.firstName} ${user.lastName}` : app.candidateName || 'Candidato',
                    email: user?.email || app.email || 'email@example.com',
                    position: job?.title || 'Posición',
                    vacancyId: app.jobId,
                    status: app.status || 'applied',
                    statusLabel: this.getStatusLabel(app.status || 'applied'),
                    appliedDate: new Date(app.appliedDate || Date.now()),
                    rating: app.rating || Math.floor(Math.random() * 5) + 1,
                    experience: user?.experience || Math.floor(Math.random() * 10) + 1,
                    salary: app.expectedSalary || Math.floor(Math.random() * 5000000) + 3000000,
                    skills: job?.skills || ['JavaScript', 'React'],
                    lastActivity: new Date(app.statusUpdatedDate || app.appliedDate || Date.now()),
                    notes: app.notes || [],
                    interview: app.interview
                };
            });
            
            // Generate activity data from applications
            this.recentActivity = this.generateActivityFromApplications(applications, jobs);
            
        } catch (error) {
            console.error('Error loading candidates data:', error);
            this.candidates = this.generateCandidateData();
            this.recentActivity = this.generateActivityData();
        }
    },
    
    generateVacancyData() {
        const departments = ['Desarrollo', 'Diseño', 'Marketing', 'Ventas', 'RRHH'];
        const positions = {
            'Desarrollo': ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'DevOps Engineer', 'QA Engineer'],
            'Diseño': ['UI/UX Designer', 'Graphic Designer', 'Product Designer'],
            'Marketing': ['Marketing Manager', 'Content Manager', 'Digital Marketing Specialist'],
            'Ventas': ['Sales Manager', 'Account Executive', 'Business Developer'],
            'RRHH': ['HR Manager', 'Recruiter', 'HR Business Partner']
        };
        const statuses = ['active', 'paused', 'closed', 'draft'];
        const statusLabels = { active: 'Activa', paused: 'Pausada', closed: 'Cerrada', draft: 'Borrador' };
        const priorities = ['high', 'medium', 'low'];
        const priorityLabels = { high: 'Alta', medium: 'Media', low: 'Baja' };

        return Array.from({ length: 15 }, (_, i) => {
            const dept = departments[Math.floor(Math.random() * departments.length)];
            const position = positions[dept][Math.floor(Math.random() * positions[dept].length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const priority = priorities[Math.floor(Math.random() * priorities.length)];
            
            return {
                id: i + 1,
                title: position,
                department: dept,
                location: Math.random() > 0.7 ? 'Remoto' : 'Bogotá, Colombia',
                type: Math.random() > 0.3 ? 'Tiempo completo' : 'Medio tiempo',
                status: status,
                statusLabel: statusLabels[status],
                priority: priority,
                priorityLabel: priorityLabels[priority],
                applications: Math.floor(Math.random() * 50) + 5,
                shortlisted: Math.floor(Math.random() * 10) + 1,
                interviewed: Math.floor(Math.random() * 5) + 1,
                budget: Math.floor(Math.random() * 8000000) + 2000000,
                publishDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
                deadline: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
                description: `Buscamos un ${position} para unirse a nuestro equipo de ${dept}. Responsabilidades incluyen...`,
                requirements: [
                    'Experiencia mínima de 3 años',
                    'Conocimientos en tecnologías relevantes',
                    'Trabajo en equipo',
                    'Comunicación efectiva'
                ],
                benefits: [
                    'Seguro médico',
                    'Trabajo flexible',
                    'Capacitaciones',
                    'Bonos por desempeño'
                ]
            };
        });
    }

    generateCandidateData() {
        const names = ['Carlos Rodríguez', 'Ana García', 'Luis Martínez', 'Sofia López', 'Diego Torres', 'María Fernández', 'Andrés Silva', 'Carmen Ruiz', 'Pablo Morales', 'Isabel Castro'];
        const statuses = ['applied', 'reviewing', 'shortlisted', 'interviewed', 'offer', 'rejected'];
        const statusLabels = { applied: 'Aplicado', reviewing: 'En revisión', shortlisted: 'Preseleccionado', interviewed: 'Entrevistado', offer: 'Oferta enviada', rejected: 'Rechazado' };

        return Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: names[Math.floor(Math.random() * names.length)],
            email: `candidate${i + 1}@example.com`,
            position: this.vacancies[Math.floor(Math.random() * this.vacancies.length)].title,
            vacancyId: Math.floor(Math.random() * this.vacancies.length) + 1,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            statusLabel: statusLabels[statuses[Math.floor(Math.random() * statuses.length)]],
            appliedDate: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000),
            rating: Math.floor(Math.random() * 5) + 1,
            experience: Math.floor(Math.random() * 10) + 1,
            salary: Math.floor(Math.random() * 5000000) + 3000000,
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].sort(() => 0.5 - Math.random()).slice(0, 3),
            lastActivity: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
            notes: []
        }));
    }

    generateActivityData() {
        const activities = [
            'Nueva aplicación recibida',
            'Candidato preseleccionado',
            'Entrevista programada',
            'Comentario agregado',
            'Estado actualizado',
            'Vacante publicada',
            'Vacante pausada'
        ];

        return Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            type: activities[Math.floor(Math.random() * activities.length)],
            description: `${activities[Math.floor(Math.random() * activities.length)]} - ${this.candidates[Math.floor(Math.random() * 10)].name}`,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 48) * 60 * 60 * 1000),
            user: 'Manager Actual'
        }));
    }

    initializeEventListeners() {
        // View mode toggles
        document.querySelectorAll('input[name="vacancy-view"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentView = e.target.id === 'vacancy-list-view' ? 'list' : 'card';
                this.renderVacancies();
            });
        });

        // Filter dropdowns
        ['department-filter', 'status-filter', 'priority-filter'].forEach(filterId => {
            document.getElementById(filterId).addEventListener('change', () => {
                this.filterVacancies();
            });
        });

        // Search functionality
        document.getElementById('search-vacancies').addEventListener('input', () => {
            this.filterVacancies();
        });

        // Clear filters
        document.getElementById('clear-vacancy-filters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Create vacancy form
        document.getElementById('save-vacancy').addEventListener('click', () => {
            this.saveNewVacancy();
        });

        // Schedule interview form
        document.getElementById('save-interview').addEventListener('click', () => {
            this.saveInterview();
        });

        // Candidate actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-vacancy')) {
                const vacancyId = parseInt(e.target.closest('.view-vacancy').dataset.vacancyId);
                this.openVacancyDetail(vacancyId);
            }

            if (e.target.closest('.edit-vacancy')) {
                const vacancyId = parseInt(e.target.closest('.edit-vacancy').dataset.vacancyId);
                this.editVacancy(vacancyId);
            }

            if (e.target.closest('.view-candidate')) {
                const candidateId = parseInt(e.target.closest('.view-candidate').dataset.candidateId);
                this.openCandidateDetail(candidateId);
            }

            if (e.target.closest('.schedule-interview-btn')) {
                const candidateId = parseInt(e.target.closest('.schedule-interview-btn').dataset.candidateId);
                this.openScheduleInterview(candidateId);
            }

            if (e.target.closest('.candidate-action')) {
                const action = e.target.closest('.candidate-action').dataset.action;
                const candidateId = parseInt(e.target.closest('.candidate-action').dataset.candidateId);
                this.performCandidateAction(action, candidateId);
            }
        });

        // Add candidate comment
        document.getElementById('add-candidate-comment').addEventListener('click', () => {
            this.addCandidateComment();
        });
    }

    loadData() {
        this.loadMetrics();
        this.loadCandidatesData();
        this.updateStatistics();
        this.renderVacancies();
        this.renderCandidates();
        this.renderRecentActivity();
    }

    updateStatistics() {
        const stats = {
            activeVacancies: this.vacancies.filter(v => v.status === 'open').length,
            totalApplications: this.vacancies.reduce((sum, v) => sum + v.applications, 0),
            shortlistedCandidates: this.vacancies.reduce((sum, v) => sum + v.shortlisted, 0),
            interviewsScheduled: this.candidates.filter(c => c.status === 'interviewed').length
        };

        document.getElementById('active-vacancies').textContent = stats.activeVacancies;
        document.getElementById('total-applications').textContent = stats.totalApplications.toLocaleString();
        document.getElementById('shortlisted-candidates').textContent = stats.shortlistedCandidates;
        document.getElementById('interviews-scheduled').textContent = stats.interviewsScheduled;
    }

    filterVacancies() {
        const searchTerm = document.getElementById('search-vacancies').value.toLowerCase();
        const departmentFilter = document.getElementById('department-filter').value;
        const statusFilter = document.getElementById('status-filter').value;
        const priorityFilter = document.getElementById('priority-filter').value;

        this.filteredVacancies = this.vacancies.filter(vacancy => {
            const matchesSearch = !searchTerm || 
                vacancy.title.toLowerCase().includes(searchTerm) ||
                vacancy.department.toLowerCase().includes(searchTerm);
            const matchesDepartment = !departmentFilter || vacancy.department === departmentFilter;
            const matchesStatus = !statusFilter || vacancy.status === statusFilter;
            const matchesPriority = !priorityFilter || vacancy.priority === priorityFilter;

            return matchesSearch && matchesDepartment && matchesStatus && matchesPriority;
        });

        this.renderVacancies();
    }

    renderVacancies() {
        const vacancies = this.filteredVacancies || this.vacancies;

        if (this.currentView === 'list') {
            this.renderVacancyList(vacancies);
        } else {
            this.renderVacancyCards(vacancies);
        }
    }

    renderVacancyList(vacancies) {
        const tbody = document.getElementById('vacancies-tbody');
        tbody.innerHTML = vacancies.map(vacancy => `
            <tr>
                <td>
                    <div class="fw-bold">${vacancy.title}</div>
                    <small class="text-muted">${vacancy.department}</small>
                </td>
                <td>
                    <span class="badge bg-${this.getStatusBadgeColor(vacancy.status)}">${vacancy.statusLabel}</span>
                </td>
                <td>
                    <span class="badge bg-${this.getPriorityBadgeColor(vacancy.priority)}">${vacancy.priorityLabel}</span>
                </td>
                <td>${vacancy.applications}</td>
                <td>${vacancy.shortlisted}</td>
                <td>${vacancy.interviewed}</td>
                <td>
                    <small>${this.formatDate(vacancy.publishDate)}</small>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline-primary view-vacancy" data-vacancy-id="${vacancy.id}" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success edit-vacancy" data-vacancy-id="${vacancy.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${vacancy.status === 'open' ? `
                            <button class="btn btn-sm btn-outline-warning" onclick="this.pauseVacancy(${vacancy.id})" title="Pausar">
                                <i class="fas fa-pause"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');

        document.getElementById('vacancy-list-container').classList.remove('d-none');
        document.getElementById('vacancy-card-container').classList.add('d-none');
    }

    renderVacancyCards(vacancies) {
        const container = document.getElementById('vacancy-card-container');
        container.innerHTML = vacancies.map(vacancy => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card vacancy-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h6 class="card-title mb-0">${vacancy.title}</h6>
                            <span class="badge bg-${this.getStatusBadgeColor(vacancy.status)}">${vacancy.statusLabel}</span>
                        </div>
                        
                        <p class="text-muted small mb-2">
                            <i class="fas fa-building me-1"></i> ${vacancy.department}
                        </p>
                        <p class="text-muted small mb-2">
                            <i class="fas fa-map-marker-alt me-1"></i> ${vacancy.location}
                        </p>
                        <p class="text-muted small mb-3">
                            <i class="fas fa-clock me-1"></i> ${vacancy.type}
                        </p>
                        
                        <div class="row text-center mb-3">
                            <div class="col-4">
                                <div class="fw-bold text-primary">${vacancy.applications}</div>
                                <small class="text-muted">Aplicaciones</small>
                            </div>
                            <div class="col-4">
                                <div class="fw-bold text-success">${vacancy.shortlisted}</div>
                                <small class="text-muted">Preseleccionados</small>
                            </div>
                            <div class="col-4">
                                <div class="fw-bold text-info">${vacancy.interviewed}</div>
                                <small class="text-muted">Entrevistados</small>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-${this.getPriorityBadgeColor(vacancy.priority)}">${vacancy.priorityLabel}</span>
                            <small class="text-muted">${this.formatDate(vacancy.publishDate)}</small>
                        </div>
                    </div>
                    
                    <div class="card-footer">
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-outline-primary view-vacancy flex-fill" data-vacancy-id="${vacancy.id}">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                            <button class="btn btn-sm btn-outline-success edit-vacancy" data-vacancy-id="${vacancy.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('vacancy-list-container').classList.add('d-none');
        document.getElementById('vacancy-card-container').classList.remove('d-none');
    }

    renderCandidates() {
        const recentCandidates = this.candidates.slice(0, 8);
        const container = document.getElementById('recent-candidates');
        
        container.innerHTML = recentCandidates.map(candidate => `
            <div class="col-md-6 col-lg-3 mb-3">
                <div class="card candidate-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <img src="../img/default-avatar.svg" alt="${candidate.name}" class="candidate-avatar">
                            <span class="badge status-badge status-${candidate.status}">${candidate.statusLabel}</span>
                        </div>
                        
                        <h6 class="mb-1">${candidate.name}</h6>
                        <small class="text-muted d-block mb-2">${candidate.position}</small>
                        
                        <div class="rating-stars mb-2">
                            ${Array.from({length: 5}, (_, i) => `<i class="fa${i < candidate.rating ? 's' : 'r'} fa-star"></i>`).join('')}
                        </div>
                        
                        <div class="candidate-skills mb-2">
                            ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                        
                        <small class="text-muted">Aplicó ${this.getTimeAgo(candidate.appliedDate)}</small>
                    </div>
                    
                    <div class="card-footer">
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-outline-primary view-candidate flex-fill" data-candidate-id="${candidate.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info schedule-interview-btn" data-candidate-id="${candidate.id}">
                                <i class="fas fa-calendar"></i>
                            </button>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item candidate-action" data-action="shortlist" data-candidate-id="${candidate.id}">
                                        <i class="fas fa-star me-1"></i> Preseleccionar
                                    </a></li>
                                    <li><a class="dropdown-item candidate-action" data-action="reject" data-candidate-id="${candidate.id}">
                                        <i class="fas fa-times me-1"></i> Rechazar
                                    </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderRecentActivity() {
        const container = document.getElementById('recent-activity');
        container.innerHTML = this.recentActivity.slice(0, 10).map(activity => `
            <div class="d-flex align-items-start mb-3">
                <div class="activity-icon bg-primary">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                    <div class="fw-bold small">${activity.type}</div>
                    <div class="text-muted small">${activity.description}</div>
                    <div class="text-muted small">${this.getTimeAgo(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    openVacancyDetail(vacancyId) {
        const vacancy = this.vacancies.find(v => v.id === vacancyId);
        if (!vacancy) return;

        // Update modal content
        document.getElementById('modal-vacancy-title').textContent = vacancy.title;
        
        // Load vacancy details
        document.getElementById('vacancy-detail-content').innerHTML = `
            <div class="row mb-4">
                <div class="col-md-6">
                    <table class="table table-sm">
                        <tr><th>Departamento:</th><td>${vacancy.department}</td></tr>
                        <tr><th>Ubicación:</th><td>${vacancy.location}</td></tr>
                        <tr><th>Tipo:</th><td>${vacancy.type}</td></tr>
                        <tr><th>Estado:</th><td><span class="badge bg-${this.getStatusBadgeColor(vacancy.status)}">${vacancy.statusLabel}</span></td></tr>
                        <tr><th>Prioridad:</th><td><span class="badge bg-${this.getPriorityBadgeColor(vacancy.priority)}">${vacancy.priorityLabel}</span></td></tr>
                        <tr><th>Presupuesto:</th><td>$${vacancy.budget.toLocaleString()}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <div class="row text-center">
                        <div class="col-3">
                            <div class="metric-card">
                                <div class="metric-value text-primary">${vacancy.applications}</div>
                                <div class="metric-label">Aplicaciones</div>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="metric-card">
                                <div class="metric-value text-success">${vacancy.shortlisted}</div>
                                <div class="metric-label">Preseleccionados</div>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="metric-card">
                                <div class="metric-value text-info">${vacancy.interviewed}</div>
                                <div class="metric-label">Entrevistados</div>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="metric-card">
                                <div class="metric-value text-warning">2</div>
                                <div class="metric-label">Ofertas</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mb-4">
                <h6>Descripción</h6>
                <p>${vacancy.description}</p>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <h6>Requisitos</h6>
                    <ul>
                        ${vacancy.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>Beneficios</h6>
                    <ul>
                        ${vacancy.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        // Show modal
        new bootstrap.Modal(document.getElementById('vacancyDetailModal')).show();
    }

    openCandidateDetail(candidateId) {
        const candidate = this.candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        // Update modal content
        document.getElementById('modal-candidate-name').textContent = candidate.name;
        document.getElementById('modal-candidate-position').textContent = candidate.position;

        // Load candidate info
        document.getElementById('candidate-detail-info').innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <table class="table table-sm">
                        <tr><th width="100">Email:</th><td>${candidate.email}</td></tr>
                        <tr><th>Posición:</th><td>${candidate.position}</td></tr>
                        <tr><th>Estado:</th><td><span class="badge status-badge status-${candidate.status}">${candidate.statusLabel}</span></td></tr>
                        <tr><th>Experiencia:</th><td>${candidate.experience} años</td></tr>
                        <tr><th>Salario deseado:</th><td>$${candidate.salary.toLocaleString()}</td></tr>
                        <tr><th>Aplicó:</th><td>${this.formatDate(candidate.appliedDate)}</td></tr>
                    </table>
                </div>
                <div class="col-md-4 text-center">
                    <img src="../img/default-avatar.svg" alt="${candidate.name}" class="candidate-avatar mb-3" style="width: 80px; height: 80px;">
                    <div class="rating-stars">
                        ${Array.from({length: 5}, (_, i) => `<i class="fa${i < candidate.rating ? 's' : 'r'} fa-star"></i>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="mt-3">
                <h6>Skills</h6>
                ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        `;

        // Load comments
        this.loadCandidateComments(candidate);

        // Store current candidate ID
        this.currentCandidateId = candidateId;

        // Show modal
        new bootstrap.Modal(document.getElementById('candidateDetailModal')).show();
    }

    loadCandidateComments(candidate) {
        const container = document.getElementById('candidate-comments');
        container.innerHTML = candidate.notes.length ? 
            candidate.notes.map(note => `
                <div class="border-bottom pb-2 mb-2">
                    <div class="d-flex justify-content-between align-items-start">
                        <small class="fw-bold text-primary">${note.author}</small>
                        <small class="text-muted">${this.formatDate(note.date)}</small>
                    </div>
                    <p class="mb-0 mt-1">${note.content}</p>
                </div>
            `).join('') : 
            '<p class="text-muted">No hay comentarios aún</p>';
    }

    addCandidateComment() {
        const commentText = document.getElementById('new-comment').value.trim();
        if (!commentText || !this.currentCandidateId) return;

        const candidate = this.candidates.find(c => c.id === this.currentCandidateId);
        if (candidate) {
            candidate.notes.unshift({
                date: new Date(),
                author: 'Manager Actual',
                content: commentText
            });
            
            this.loadCandidateComments(candidate);
            document.getElementById('new-comment').value = '';
            
            this.showToast('Comentario agregado exitosamente', 'success');
        }
    }

    openScheduleInterview(candidateId) {
        const candidate = this.candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        document.getElementById('interview-candidate-name').value = candidate.name;
        this.currentInterviewCandidateId = candidateId;

        new bootstrap.Modal(document.getElementById('scheduleInterviewModal')).show();
    }

    saveInterview() {
        const formData = {
            candidateId: this.currentInterviewCandidateId,
            date: document.getElementById('interview-date').value,
            time: document.getElementById('interview-time').value,
            type: document.getElementById('interview-type').value,
            interviewer: document.getElementById('interviewer').value,
            notes: document.getElementById('interview-notes').value
        };

        // In a real app, this would save to backend
        console.log('Saving interview:', formData);

        // Update candidate status
        const candidate = this.candidates.find(c => c.id === this.currentInterviewCandidateId);
        if (candidate) {
            candidate.status = 'interviewed';
            candidate.statusLabel = 'Entrevistado';
        }

        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('scheduleInterviewModal')).hide();
        document.getElementById('schedule-interview-form').reset();

        this.renderCandidates();
        this.updateStatistics();
        this.showToast('Entrevista programada exitosamente', 'success');
    }

    saveNewVacancy() {
        const form = document.getElementById('create-vacancy-form');
        const formData = new FormData(form);
        
        const newVacancy = {
            id: this.vacancies.length + 1,
            title: document.getElementById('vacancy-title').value,
            department: document.getElementById('vacancy-department').value,
            location: document.getElementById('vacancy-location').value,
            type: document.getElementById('vacancy-type').value,
            status: 'draft',
            statusLabel: 'Borrador',
            priority: document.getElementById('vacancy-priority').value,
            priorityLabel: document.getElementById('vacancy-priority').selectedOptions[0].textContent,
            applications: 0,
            shortlisted: 0,
            interviewed: 0,
            budget: parseInt(document.getElementById('vacancy-budget').value),
            publishDate: new Date(),
            deadline: new Date(document.getElementById('vacancy-deadline').value),
            description: document.getElementById('vacancy-description').value,
            requirements: document.getElementById('vacancy-requirements').value.split('\n').filter(r => r.trim()),
            benefits: document.getElementById('vacancy-benefits').value.split('\n').filter(b => b.trim())
        };

        this.vacancies.unshift(newVacancy);
        this.filterVacancies();
        this.updateStatistics();
        
        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('createVacancyModal')).hide();
        form.reset();
        
        this.showToast('Vacante creada exitosamente', 'success');
    }

    performCandidateAction(action, candidateId) {
        const candidate = this.candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        switch (action) {
            case 'shortlist':
                candidate.status = 'shortlisted';
                candidate.statusLabel = 'Preseleccionado';
                this.showToast(`${candidate.name} ha sido preseleccionado`, 'success');
                break;
            case 'reject':
                if (confirm(`¿Estás seguro de rechazar a ${candidate.name}?`)) {
                    candidate.status = 'rejected';
                    candidate.statusLabel = 'Rechazado';
                    this.showToast(`${candidate.name} ha sido rechazado`, 'warning');
                }
                break;
        }

        this.renderCandidates();
        this.updateStatistics();
    }

    clearFilters() {
        document.getElementById('search-vacancies').value = '';
        document.getElementById('department-filter').value = '';
        document.getElementById('status-filter').value = '';
        document.getElementById('priority-filter').value = '';
        this.filterVacancies();
    }

    getStatusBadgeColor(status) {
        const colors = { open: 'success', paused: 'warning', closed: 'danger', draft: 'secondary' };
        return colors[status] || 'secondary';
    }

    getPriorityBadgeColor(priority) {
        const colors = { high: 'danger', medium: 'warning', low: 'info' };
        return colors[priority] || 'secondary';
    }

    getActivityIcon(type) {
        const icons = {
            'Nueva aplicación recibida': 'user-plus',
            'Candidato preseleccionado': 'star',
            'Entrevista programada': 'calendar',
            'Comentario agregado': 'comment',
            'Estado actualizado': 'sync',
            'Vacante publicada': 'briefcase',
            'Vacante pausada': 'pause'
        };
        return icons[type] || 'bell';
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Hace menos de una hora';
        if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
        
        const diffInWeeks = Math.floor(diffInDays / 7);
        return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
    }

    showToast(message, type = 'info') {
        showToast(message, type);
    },
    
    /**
     * Helper methods for data processing
     */
    calculateAverageTimeToHire(applications) {
        const hiredApplications = applications.filter(app => 
            app.status === 'hired' && app.appliedDate && app.statusUpdatedDate
        );
        
        if (hiredApplications.length === 0) return 0;
        
        const totalTime = hiredApplications.reduce((sum, app) => {
            const appliedDate = new Date(app.appliedDate);
            const hiredDate = new Date(app.statusUpdatedDate);
            return sum + (hiredDate - appliedDate);
        }, 0);
        
        return Math.round(totalTime / hiredApplications.length / (1000 * 60 * 60 * 24));
    },
    
    calculateConversionRate(applications) {
        if (applications.length === 0) return 0;
        const hiredCount = applications.filter(a => a.status === 'hired').length;
        return Math.round((hiredCount / applications.length) * 100);
    },
    
    calculateDepartmentStats(jobs, applications) {
        const stats = {};
        
        jobs.forEach(job => {
            if (!stats[job.department]) {
                stats[job.department] = {
                    jobs: 0,
                    applications: 0,
                    hired: 0
                };
            }
            
            stats[job.department].jobs++;
            const jobApplications = applications.filter(a => a.jobId === job.id);
            stats[job.department].applications += jobApplications.length;
            stats[job.department].hired += jobApplications.filter(a => a.status === 'hired').length;
        });
        
        return stats;
    },
    
    calculateMonthlyTrends(applications) {
        const trends = {};
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        
        // Initialize months with zero values
        months.forEach(month => {
            trends[month] = { applications: 0, hires: 0 };
        });
        
        // Count applications and hires by month
        applications.forEach(app => {
            const date = new Date(app.appliedDate);
            const monthIndex = date.getMonth();
            if (monthIndex < months.length) {
                const monthName = months[monthIndex];
                trends[monthName].applications++;
                if (app.status === 'hired') {
                    trends[monthName].hires++;
                }
            }
        });
        
        return trends;
    },
    
    generateActivityFromApplications(applications, jobs) {
        return applications
            .filter(app => app.statusUpdatedDate)
            .sort((a, b) => new Date(b.statusUpdatedDate) - new Date(a.statusUpdatedDate))
            .slice(0, 20)
            .map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return {
                    id: app.id,
                    type: this.getActivityTypeFromStatus(app.status),
                    description: `${this.getActivityTypeFromStatus(app.status)} - ${app.candidateName} para ${job?.title || 'Posición'}`,
                    timestamp: new Date(app.statusUpdatedDate),
                    user: 'Sistema'
                };
            });
    },
    
    getActivityTypeFromStatus(status) {
        const statusMap = {
            'new': 'Nueva aplicación recibida',
            'screening': 'Candidato en revisión',
            'interview': 'Entrevista programada',
            'technical': 'Evaluación técnica',
            'final': 'Entrevista final',
            'offer': 'Oferta enviada',
            'hired': 'Candidato contratado',
            'rejected': 'Candidato rechazado'
        };
        return statusMap[status] || 'Estado actualizado';
    },
    
    getStatusLabel(status) {
        const statusLabels = {
            'active': 'Activa',
            'draft': 'Borrador',
            'closed': 'Cerrada',
            'paused': 'Pausada',
            'new': 'Nuevo',
            'screening': 'En revisión',
            'interview': 'Entrevista',
            'technical': 'Técnica',
            'final': 'Final',
            'offer': 'Oferta',
            'hired': 'Contratado',
            'rejected': 'Rechazado',
            'applied': 'Aplicado',
            'reviewing': 'En revisión',
            'shortlisted': 'Preseleccionado',
            'interviewed': 'Entrevistado'
        };
        return statusLabels[status] || status;
    },
    
    getPriorityLabel(priority) {
        const priorityLabels = {
            'high': 'Alta',
            'medium': 'Media',
            'low': 'Baja'
        };
        return priorityLabels[priority] || priority;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HiringDashboard();
});
