import { dataManager } from './data-manager.js';
import { showToast } from './ui.js';

// Default pipeline stages
const DEFAULT_STAGES = [
    {
        id: 'new',
        name: 'Nuevos',
        color: 'primary',
        description: 'Candidatos recién aplicados',
        order: 1
    },
    {
        id: 'screening',
        name: 'Screening',
        color: 'info',
        description: 'Revisión inicial de perfiles',
        order: 2
    },
    {
        id: 'interview',
        name: 'Entrevista',
        color: 'warning',
        description: 'Proceso de entrevistas',
        order: 3
    },
    {
        id: 'technical',
        name: 'Evaluación Técnica',
        color: 'secondary',
        description: 'Pruebas técnicas y evaluaciones',
        order: 4
    },
    {
        id: 'final',
        name: 'Entrevista Final',
        color: 'dark',
        description: 'Entrevista con gerencia',
        order: 5
    },
    {
        id: 'offer',
        name: 'Oferta',
        color: 'success',
        description: 'Oferta enviada',
        order: 6
    },
    {
        id: 'hired',
        name: 'Contratado',
        color: 'success',
        description: 'Candidato contratado',
        order: 7
    },
    {
        id: 'rejected',
        name: 'Rechazado',
        color: 'danger',
        description: 'Candidatos no seleccionados',
        order: 8
    }
];

// Sample candidate data
const SAMPLE_CANDIDATES = [
    {
        id: 1,
        name: 'Ana María González',
        email: 'ana.gonzalez@email.com',
        phone: '+57 300 123 4567',
        position: 'Desarrollador Frontend React',
        jobId: 1,
        stage: 'new',
        avatar: 'https://i.pravatar.cc/150?img=1',
        experience: '3 años',
        skills: ['React', 'JavaScript', 'CSS', 'HTML'],
        appliedDate: '2024-01-15',
        notes: [],
        documents: ['CV_Ana_Gonzalez.pdf'],
        source: 'LinkedIn'
    },
    {
        id: 2,
        name: 'Carlos Eduardo Ruiz',
        email: 'carlos.ruiz@email.com', 
        phone: '+57 301 234 5678',
        position: 'Desarrollador Backend Node.js',
        jobId: 2,
        stage: 'screening',
        avatar: 'https://i.pravatar.cc/150?img=2',
        experience: '5 años',
        skills: ['Node.js', 'Express', 'MongoDB', 'AWS'],
        appliedDate: '2024-01-14',
        notes: [
            { date: '2024-01-16', author: 'HR', text: 'Perfil muy prometedor, experiencia sólida' }
        ],
        documents: ['CV_Carlos_Ruiz.pdf', 'Portafolio.pdf'],
        source: 'Portal Web'
    },
    {
        id: 3,
        name: 'María Isabella Fernández',
        email: 'maria.fernandez@email.com',
        phone: '+57 302 345 6789',
        position: 'Diseñador UX/UI',
        jobId: 3,
        stage: 'interview',
        avatar: 'https://i.pravatar.cc/150?img=3',
        experience: '4 años',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
        appliedDate: '2024-01-12',
        notes: [
            { date: '2024-01-14', author: 'HR', text: 'Excelente portafolio' },
            { date: '2024-01-16', author: 'Manager', text: 'Programar entrevista técnica' }
        ],
        documents: ['CV_Maria_Fernandez.pdf', 'Portfolio_UX.pdf'],
        source: 'Referido',
        interview: {
            date: '2024-01-20',
            time: '10:00',
            type: 'video',
            interviewer: 'Ana López'
        }
    },
    {
        id: 4,
        name: 'Luis Fernando Torres',
        email: 'luis.torres@email.com',
        phone: '+57 303 456 7890',
        position: 'DevOps Engineer',
        jobId: 4,
        stage: 'technical',
        avatar: 'https://i.pravatar.cc/150?img=4',
        experience: '6 años',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
        appliedDate: '2024-01-10',
        notes: [
            { date: '2024-01-12', author: 'HR', text: 'Candidato senior con experiencia relevante' },
            { date: '2024-01-15', author: 'Tech Lead', text: 'Pasó primera entrevista técnica' }
        ],
        documents: ['CV_Luis_Torres.pdf'],
        source: 'LinkedIn'
    },
    {
        id: 5,
        name: 'Sofia Alejandra Vargas',
        email: 'sofia.vargas@email.com',
        phone: '+57 304 567 8901',
        position: 'Data Scientist',
        jobId: 5,
        stage: 'offer',
        avatar: 'https://i.pravatar.cc/150?img=5',
        experience: '4 años',
        skills: ['Python', 'TensorFlow', 'SQL', 'Power BI'],
        appliedDate: '2024-01-08',
        notes: [
            { date: '2024-01-10', author: 'HR', text: 'Perfil excepcional' },
            { date: '2024-01-12', author: 'Data Lead', text: 'Excelente en evaluación técnica' },
            { date: '2024-01-17', author: 'Manager', text: 'Aprobar oferta salarial' }
        ],
        documents: ['CV_Sofia_Vargas.pdf', 'Certificaciones.pdf'],
        source: 'Universidad',
        offer: {
            salary: '$4,500,000',
            benefits: ['Seguro médico', 'Trabajo remoto', 'Bonos anuales'],
            startDate: '2024-02-01'
        }
    }
];

// Global variables
let currentStages = [...DEFAULT_STAGES];
let currentCandidates = [...SAMPLE_CANDIDATES];
let currentJobFilter = null;
let draggedCard = null;

export const initKanban = async (jobId = null) => {
    try {
        console.log('🔄 Initializing Kanban Board...', jobId ? `for job ${jobId}` : 'for all jobs');
        
        currentJobFilter = jobId;
        
        // Load stages and candidates
        loadStages();
        loadCandidates();
        
        // Render the kanban board
        renderKanbanBoard();
        
        // Load job filter options
        loadJobFilterOptions();
        
        // Update statistics
        updateKanbanStats();
        
        // Initialize event listeners
        initKanbanEventListeners();
        
        console.log('✅ Kanban Board initialized successfully');
    } catch (error) {
        console.error('Error inicializando Kanban:', error);
        showToast('Error al cargar el tablero Kanban', 'error');
    }
};

/**
 * Load Stages Configuration
 * Loads pipeline stages from localStorage or uses defaults
 */
function loadStages() {
    const savedStages = localStorage.getItem('kanban_stages');
    if (savedStages) {
        try {
            currentStages = JSON.parse(savedStages);
        } catch (error) {
            console.warn('Error loading saved stages, using defaults');
            currentStages = [...DEFAULT_STAGES];
        }
    } else {
        currentStages = [...DEFAULT_STAGES];
    }
}

/**
 * Load Candidates Data
 * Loads candidates from data manager and filters by job if needed
 */
function loadCandidates() {
    try {
        // Try to get real candidates from data manager
        const applications = dataManager.getApplications();
        const jobs = dataManager.getJobs();
        const users = dataManager.getUsers();
        
        if (applications.length > 0) {
            // Convert applications to kanban candidates
            currentCandidates = applications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                const user = users.find(u => u.id === app.userId);
                
                return {
                    id: app.id,
                    name: user ? `${user.firstName} ${user.lastName}` : app.candidateName || 'Candidato',
                    email: user?.email || app.email || 'email@example.com',
                    phone: user?.phone || '+57 300 000 0000',
                    position: job?.title || 'Posición',
                    jobId: app.jobId,
                    stage: app.status || 'new',
                    avatar: user?.avatar || `https://i.pravatar.cc/150?img=${app.id}`,
                    experience: user?.experience || '2-3 años',
                    skills: job?.skills || ['Skill 1', 'Skill 2'],
                    appliedDate: app.appliedDate || new Date().toISOString().split('T')[0],
                    notes: app.notes || [],
                    documents: app.documents || ['CV.pdf'],
                    source: app.source || 'Portal Web'
                };
            });
        } else {
            // Use sample data if no real applications exist
            currentCandidates = [...SAMPLE_CANDIDATES];
        }
        
        // Filter by job if specified
        if (currentJobFilter) {
            currentCandidates = currentCandidates.filter(candidate => 
                candidate.jobId == currentJobFilter
            );
        }
    } catch (error) {
        console.warn('Error loading candidates data, using sample data:', error);
        currentCandidates = [...SAMPLE_CANDIDATES];
    }
}

/**
 * Render Kanban Board
 * Creates the visual kanban board with all stages and candidates
 */
function renderKanbanBoard() {
    const container = document.getElementById('kanban-container');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create stages
    currentStages.forEach(stage => {
        const stageColumn = createStageColumn(stage);
        container.appendChild(stageColumn);
    });
    
    // Add candidates to appropriate stages
    currentCandidates.forEach(candidate => {
        const stageColumn = container.querySelector(`[data-stage="${candidate.stage}"]`);
        if (stageColumn) {
            const candidateCard = createCandidateCard(candidate);
            const cardContainer = stageColumn.querySelector('.kanban-cards');
            cardContainer.appendChild(candidateCard);
        }
    });
}

/**
 * Create Stage Column
 * Creates a single stage column for the kanban board
 */
function createStageColumn(stage) {
    const stageCount = currentCandidates.filter(c => c.stage === stage.id).length;
    
    const column = document.createElement('div');
    column.className = 'kanban-stage';
    column.setAttribute('data-stage', stage.id);
    column.innerHTML = `
        <div class="kanban-stage-header bg-${stage.color}">
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0 text-white">
                    <i class="fas fa-circle me-2" style="font-size: 0.7rem;"></i>
                    ${stage.name}
                </h6>
                <span class="badge bg-white text-${stage.color}">${stageCount}</span>
            </div>
            <small class="text-white opacity-75">${stage.description}</small>
        </div>
        <div class="kanban-cards" data-stage="${stage.id}">
            <!-- Candidate cards will be added here -->
        </div>
    `;
    
    // Add drop functionality
    const cardsContainer = column.querySelector('.kanban-cards');
    cardsContainer.addEventListener('dragover', handleDragOver);
    cardsContainer.addEventListener('drop', handleDrop);
    
    return column;
}

/**
 * Create Candidate Card
 * Creates a draggable candidate card for the kanban board
 */
function createCandidateCard(candidate) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.setAttribute('data-candidate-id', candidate.id);
    
    // Calculate days since application
    const daysSinceApplication = Math.floor(
        (new Date() - new Date(candidate.appliedDate)) / (1000 * 60 * 60 * 24)
    );
    
    card.innerHTML = `
        <div class="candidate-avatar">
            <img src="${candidate.avatar}" alt="${candidate.name}" class="rounded-circle">
        </div>
        <div class="candidate-info">
            <h6 class="candidate-name">${candidate.name}</h6>
            <p class="candidate-position">${candidate.position}</p>
            <div class="candidate-details">
                <small class="text-muted">
                    <i class="fas fa-clock me-1"></i>
                    Hace ${daysSinceApplication} días
                </small>
                <small class="text-muted">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    ${candidate.source}
                </small>
            </div>
            <div class="candidate-skills">
                ${candidate.skills.slice(0, 3).map(skill => 
                    `<span class="skill-tag">${skill}</span>`
                ).join('')}
                ${candidate.skills.length > 3 ? 
                    `<span class="skill-tag">+${candidate.skills.length - 3}</span>` : ''
                }
            </div>
            <div class="candidate-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="viewCandidateDetails(${candidate.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="advanceCandidate(${candidate.id})">
                    <i class="fas fa-arrow-right"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" onclick="addCandidateNote(${candidate.id})">
                    <i class="fas fa-sticky-note"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add drag functionality
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    // Add click functionality for card details
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.candidate-actions')) {
            viewCandidateDetails(candidate.id);
        }
    });
    
    return card;
}

const setupDragAndDrop = () => {
    const draggables = document.querySelectorAll('.draggable');
    const stages = document.querySelectorAll('.stage-candidates');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });
        
        draggable.addEventListener('dragend', async (e) => {
            draggable.classList.remove('dragging');
            const destinationStage = draggable.closest('.stage-candidates');
            if (destinationStage) {
                const candidateId = draggable.dataset.candidateId;
                const newStatus = destinationStage.dataset.stage;
                
                try {
                    await updateApplicationStatus(candidateId, newStatus);
                    showToast('Estado actualizado correctamente');
                } catch (error) {
                    showToast('Error al actualizar el estado', 'error');
                }
            }
        });
    });
    
    stages.forEach(stage => {
        stage.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(stage, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (draggable) {
                 if (afterElement == null) {
                    stage.appendChild(draggable);
                } else {
                    stage.insertBefore(draggable, afterElement);
                }
            }
        });
    });
};

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

const showJobMetrics = async (jobId) => {
    try {
        const metrics = await calculateJobMetrics(jobId);
        
        // Remover modal existente si lo hay para evitar duplicados
        document.getElementById('metricsModal')?.remove();

        const modalHTML = `
            <div class="modal fade" id="metricsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Métricas de la Vacante</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-3"><div class="card bg-light"><div class="card-body text-center">
                                    <h6>Tiempo Promedio de Cierre</h6><h3>${metrics.avgTimeToClose} días</h3>
                                </div></div></div>
                                <div class="col-md-6 mb-3"><div class="card bg-light"><div class="card-body text-center">
                                    <h6>Efectividad de Contratación</h6><h3>${metrics.hireEffectiveness}%</h3>
                                </div></div></div>
                            </div>
                            <div class="mt-4">
                                <h6>Distribución de Candidatos por Etapa</h6>
                                <canvas id="stageDistributionChart" height="150"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const metricsModalEl = document.getElementById('metricsModal');
        const metricsModal = new bootstrap.Modal(metricsModalEl);
        metricsModal.show();
        
        metricsModalEl.addEventListener('hidden.bs.modal', () => {
            metricsModalEl.remove();
        });
        
    } catch (error) {
        console.error('Error mostrando métricas:', error);
        showToast('Error al cargar las métricas', 'error');
    }
};

/**
 * Load Job Filter Options
 * Populates the job filter dropdown with available jobs
 */
function loadJobFilterOptions() {
    const jobFilter = document.getElementById('job-filter');
    if (!jobFilter) return;
    
    try {
        const jobs = dataManager.getJobs();
        
        // Clear existing options except "All Jobs"
        while (jobFilter.options.length > 1) {
            jobFilter.remove(1);
        }
        
        // Add job options
        jobs.forEach(job => {
            const option = document.createElement('option');
            option.value = job.id;
            option.textContent = job.title;
            if (currentJobFilter == job.id) {
                option.selected = true;
            }
            jobFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading job filter options:', error);
    }
}

/**
 * Update Kanban Statistics
 * Updates the summary statistics shown above the kanban board
 */
function updateKanbanStats() {
    const totalCandidates = currentCandidates.length;
    const activeCandidates = currentCandidates.filter(c => !['hired', 'rejected'].includes(c.stage)).length;
    const hiredCandidates = currentCandidates.filter(c => c.stage === 'hired').length;
    const rejectedCandidates = currentCandidates.filter(c => c.stage === 'rejected').length;
    
    // Update stat cards
    document.getElementById('total-candidates')?.setAttribute('data-count', totalCandidates);
    document.getElementById('active-candidates')?.setAttribute('data-count', activeCandidates);
    document.getElementById('hired-candidates')?.setAttribute('data-count', hiredCandidates);
    document.getElementById('rejected-candidates')?.setAttribute('data-count', rejectedCandidates);
    
    // Calculate conversion rate
    const conversionRate = totalCandidates > 0 ? Math.round((hiredCandidates / totalCandidates) * 100) : 0;
    document.getElementById('conversion-rate')?.setAttribute('data-count', `${conversionRate}%`);
}

/**
 * Initialize Event Listeners
 * Sets up all event listeners for kanban functionality
 */
function initKanbanEventListeners() {
    // Job filter change
    document.getElementById('job-filter')?.addEventListener('change', (e) => {
        currentJobFilter = e.target.value === 'all' ? null : parseInt(e.target.value);
        loadCandidates();
        renderKanbanBoard();
        updateKanbanStats();
    });
    
    // Customize stages button
    document.getElementById('customize-stages-btn')?.addEventListener('click', showCustomizeStagesModal);
    
    // Schedule interview button
    document.getElementById('schedule-interview-btn')?.addEventListener('click', showScheduleInterviewModal);
    
    // Refresh board button
    document.getElementById('refresh-board-btn')?.addEventListener('click', () => {
        loadCandidates();
        renderKanbanBoard();
        updateKanbanStats();
        showToast('Tablero actualizado');
    });
}

/**
 * Drag and Drop Handlers
 */
function handleDragStart(e) {
    draggedCard = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedCard = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(e.currentTarget, e.clientY);
    const dragging = document.querySelector('.dragging');
    
    if (dragging && e.currentTarget.contains(dragging) === false) {
        if (afterElement == null) {
            e.currentTarget.appendChild(dragging);
        } else {
            e.currentTarget.insertBefore(dragging, afterElement);
        }
    }
}

function handleDrop(e) {
    e.preventDefault();
    
    if (!draggedCard) return;
    
    const newStage = e.currentTarget.getAttribute('data-stage');
    const candidateId = parseInt(draggedCard.getAttribute('data-candidate-id'));
    
    // Update candidate stage
    updateCandidateStage(candidateId, newStage);
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.kanban-card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/**
 * Update Candidate Stage
 * Updates a candidate's stage and saves to data manager
 */
function updateCandidateStage(candidateId, newStage) {
    try {
        // Find and update candidate
        const candidateIndex = currentCandidates.findIndex(c => c.id === candidateId);
        if (candidateIndex === -1) {
            throw new Error('Candidate not found');
        }
        
        const oldStage = currentCandidates[candidateIndex].stage;
        currentCandidates[candidateIndex].stage = newStage;
        
        // Update in data manager if it's a real application
        const applications = dataManager.getApplications();
        const appIndex = applications.findIndex(app => app.id === candidateId);
        if (appIndex !== -1) {
            applications[appIndex].status = newStage;
            applications[appIndex].statusUpdatedDate = new Date().toISOString();
            dataManager.saveApplications(applications);
        }
        
        // Update statistics
        updateKanbanStats();
        
        // Show success message
        const stageName = currentStages.find(s => s.id === newStage)?.name || newStage;
        showToast(`Candidato movido a ${stageName}`);
        
    } catch (error) {
        console.error('Error updating candidate stage:', error);
        showToast('Error al actualizar el estado del candidato', 'error');
        
        // Reload board to revert visual changes
        renderKanbanBoard();
    }
}

/**
 * Global Functions for Candidate Actions
 * These are called from the HTML event handlers
 */
window.viewCandidateDetails = function(candidateId) {
    const candidate = currentCandidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    // Create candidate detail modal
    const modalHTML = `
        <div class="modal fade" id="candidate-detail-modal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <img src="${candidate.avatar}" alt="${candidate.name}" class="rounded-circle me-2" style="width: 40px; height: 40px;">
                            ${candidate.name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h6>Información de Contacto</h6>
                                <p><i class="fas fa-envelope me-2"></i> ${candidate.email}</p>
                                <p><i class="fas fa-phone me-2"></i> ${candidate.phone}</p>
                                <p><i class="fas fa-briefcase me-2"></i> ${candidate.position}</p>
                                <p><i class="fas fa-calendar me-2"></i> Aplicó el ${candidate.appliedDate}</p>
                                <p><i class="fas fa-clock me-2"></i> ${candidate.experience}</p>
                                <p><i class="fas fa-map-marker-alt me-2"></i> ${candidate.source}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Habilidades</h6>
                                <div>
                                    ${candidate.skills.map(skill => 
                                        `<span class="badge bg-primary me-2 mb-2">${skill}</span>`
                                    ).join('')}
                                </div>
                                <h6 class="mt-3">Documentos</h6>
                                <div>
                                    ${candidate.documents.map(doc => 
                                        `<a href="#" class="btn btn-sm btn-outline-secondary me-2 mb-2">
                                            <i class="fas fa-file-pdf me-1"></i> ${doc}
                                        </a>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <h6>Notas del Proceso</h6>
                                <div id="candidate-notes-list">
                                    ${candidate.notes.length > 0 ? 
                                        candidate.notes.map(note => 
                                            `<div class="alert alert-light small">
                                                <div class="d-flex justify-content-between">
                                                    <strong>${note.author}</strong>
                                                    <small class="text-muted">${note.date}</small>
                                                </div>
                                                <p class="mb-0">${note.text}</p>
                                            </div>`
                                        ).join('') : 
                                        '<p class="text-muted">No hay notas registradas</p>'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="addCandidateNote(${candidateId})">Agregar Nota</button>
                        <button type="button" class="btn btn-success" onclick="advanceCandidate(${candidateId})">Avanzar Etapa</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('candidate-detail-modal'));
    modal.show();
    
    // Remove modal from DOM when hidden
    document.getElementById('candidate-detail-modal')?.addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
};

window.advanceCandidate = function(candidateId) {
    const candidate = currentCandidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    // Find next stage
    const currentStageIndex = currentStages.findIndex(s => s.id === candidate.stage);
    if (currentStageIndex === -1 || currentStageIndex >= currentStages.length - 1) {
        showToast('El candidato ya está en la última etapa', 'warning');
        return;
    }
    
    const nextStage = currentStages[currentStageIndex + 1];
    updateCandidateStage(candidateId, nextStage.id);
    
    // Re-render the kanban board
    renderKanbanBoard();
};

window.addCandidateNote = function(candidateId) {
    const candidate = currentCandidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    // Create note input modal
    const noteModalHTML = `
        <div class="modal fade" id="candidate-note-modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Agregar Nota - ${candidate.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="candidate-note-form">
                            <div class="mb-3">
                                <label for="note-text" class="form-label">Nota</label>
                                <textarea class="form-control" id="note-text" rows="4" required placeholder="Escribe tu nota aquí..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="save-note-btn">Guardar Nota</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', noteModalHTML);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('candidate-note-modal'));
    modal.show();
    
    // Handle save note
    document.getElementById('save-note-btn')?.addEventListener('click', () => {
        const noteText = document.getElementById('note-text').value.trim();
        if (!noteText) {
            showToast('Por favor escribe una nota', 'error');
            return;
        }
        
        // Add note to candidate
        const note = {
            date: new Date().toLocaleDateString('es-ES'),
            author: 'HR',
            text: noteText
        };
        
        candidate.notes.push(note);
        
        // Update in data manager if it's a real application
        const applications = dataManager.getApplications();
        const appIndex = applications.findIndex(app => app.id === candidateId);
        if (appIndex !== -1) {
            applications[appIndex].notes = candidate.notes;
            dataManager.saveApplications(applications);
        }
        
        modal.hide();
        showToast('Nota agregada correctamente');
    });
    
    // Remove modal from DOM when hidden
    document.getElementById('candidate-note-modal')?.addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
};

/**
 * Show Customize Stages Modal
 */
function showCustomizeStagesModal() {
    const modalHTML = `
        <div class="modal fade" id="customize-stages-modal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Personalizar Etapas del Pipeline</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Puedes reordenar las etapas arrastrándolas y personalizar sus nombres y colores.
                        </div>
                        <div id="stages-list">
                            ${currentStages.map((stage, index) => `
                                <div class="stage-item card mb-2" data-stage-id="${stage.id}">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="d-flex align-items-center">
                                                <i class="fas fa-grip-vertical text-muted me-3"></i>
                                                <div class="flex-grow-1">
                                                    <input type="text" class="form-control form-control-sm stage-name" value="${stage.name}">
                                                    <small class="text-muted">${stage.description}</small>
                                                </div>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <select class="form-select form-select-sm stage-color me-2" style="width: auto;">
                                                    <option value="primary" ${stage.color === 'primary' ? 'selected' : ''}>Azul</option>
                                                    <option value="success" ${stage.color === 'success' ? 'selected' : ''}>Verde</option>
                                                    <option value="warning" ${stage.color === 'warning' ? 'selected' : ''}>Amarillo</option>
                                                    <option value="danger" ${stage.color === 'danger' ? 'selected' : ''}>Rojo</option>
                                                    <option value="info" ${stage.color === 'info' ? 'selected' : ''}>Cian</option>
                                                    <option value="secondary" ${stage.color === 'secondary' ? 'selected' : ''}>Gris</option>
                                                    <option value="dark" ${stage.color === 'dark' ? 'selected' : ''}>Negro</option>
                                                </select>
                                                <button type="button" class="btn btn-sm btn-outline-danger delete-stage-btn" data-stage-id="${stage.id}">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button type="button" class="btn btn-outline-primary" id="add-stage-btn">
                            <i class="fas fa-plus me-2"></i> Agregar Etapa
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="save-stages-btn">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('customize-stages-modal'));
    modal.show();
    
    // Add event listeners
    document.getElementById('save-stages-btn')?.addEventListener('click', saveStagesConfiguration);
    
    // Remove modal from DOM when hidden
    document.getElementById('customize-stages-modal')?.addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

/**
 * Save Stages Configuration
 */
function saveStagesConfiguration() {
    try {
        const stageItems = document.querySelectorAll('.stage-item');
        const updatedStages = [];
        
        stageItems.forEach((item, index) => {
            const stageId = item.getAttribute('data-stage-id');
            const stageName = item.querySelector('.stage-name').value;
            const stageColor = item.querySelector('.stage-color').value;
            const originalStage = currentStages.find(s => s.id === stageId);
            
            if (originalStage) {
                updatedStages.push({
                    ...originalStage,
                    name: stageName,
                    color: stageColor,
                    order: index + 1
                });
            }
        });
        
        currentStages = updatedStages;
        localStorage.setItem('kanban_stages', JSON.stringify(currentStages));
        
        // Close modal and re-render board
        const modal = bootstrap.Modal.getInstance(document.getElementById('customize-stages-modal'));
        if (modal) {
            modal.hide();
        }
        
        renderKanbanBoard();
        showToast('Configuración de etapas guardada correctamente');
        
    } catch (error) {
        console.error('Error saving stages configuration:', error);
        showToast('Error al guardar la configuración', 'error');
    }
}

/**
 * Show Schedule Interview Modal
 */
function showScheduleInterviewModal() {
    const interviewCandidates = currentCandidates.filter(c => c.stage === 'interview');
    
    if (interviewCandidates.length === 0) {
        showToast('No hay candidatos en etapa de entrevista', 'warning');
        return;
    }
    
    const modalHTML = `
        <div class="modal fade" id="schedule-interview-modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Programar Entrevista</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="schedule-interview-form">
                            <div class="mb-3">
                                <label for="interview-candidate" class="form-label">Candidato</label>
                                <select class="form-select" id="interview-candidate" required>
                                    <option value="">Seleccionar candidato...</option>
                                    ${interviewCandidates.map(candidate => 
                                        `<option value="${candidate.id}">${candidate.name} - ${candidate.position}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="interview-date" class="form-label">Fecha</label>
                                <input type="date" class="form-control" id="interview-date" required>
                            </div>
                            <div class="mb-3">
                                <label for="interview-time" class="form-label">Hora</label>
                                <input type="time" class="form-control" id="interview-time" required>
                            </div>
                            <div class="mb-3">
                                <label for="interview-type" class="form-label">Tipo de Entrevista</label>
                                <select class="form-select" id="interview-type" required>
                                    <option value="">Seleccionar tipo...</option>
                                    <option value="video">Video llamada</option>
                                    <option value="presencial">Presencial</option>
                                    <option value="telefonica">Telefónica</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="interview-interviewer" class="form-label">Entrevistador</label>
                                <input type="text" class="form-control" id="interview-interviewer" required placeholder="Nombre del entrevistador">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="save-interview-btn">Programar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('schedule-interview-modal'));
    modal.show();
    
    // Handle save interview
    document.getElementById('save-interview-btn')?.addEventListener('click', () => {
        const candidateId = parseInt(document.getElementById('interview-candidate').value);
        const date = document.getElementById('interview-date').value;
        const time = document.getElementById('interview-time').value;
        const type = document.getElementById('interview-type').value;
        const interviewer = document.getElementById('interview-interviewer').value;
        
        if (!candidateId || !date || !time || !type || !interviewer) {
            showToast('Por favor completa todos los campos', 'error');
            return;
        }
        
        // Find candidate and add interview info
        const candidate = currentCandidates.find(c => c.id === candidateId);
        if (candidate) {
            candidate.interview = { date, time, type, interviewer };
            
            // Add note about the scheduled interview
            const note = {
                date: new Date().toLocaleDateString('es-ES'),
                author: 'HR',
                text: `Entrevista ${type} programada para ${date} a las ${time} con ${interviewer}`
            };
            candidate.notes.push(note);
            
            // Update in data manager
            const applications = dataManager.getApplications();
            const appIndex = applications.findIndex(app => app.id === candidateId);
            if (appIndex !== -1) {
                applications[appIndex].interview = candidate.interview;
                applications[appIndex].notes = candidate.notes;
                dataManager.saveApplications(applications);
            }
        }
        
        modal.hide();
        showToast('Entrevista programada correctamente');
        renderKanbanBoard();
    });
    
    // Remove modal from DOM when hidden
    document.getElementById('schedule-interview-modal')?.addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

export const calculateJobMetrics = async (jobId) => {
    try {
        const applications = dataManager.getApplicationsForJob(jobId);
        
        const closedApplications = applications.filter(app => 
            (app.status === 'rejected' || app.status === 'hired') && 
            app.appliedDate && app.statusUpdatedDate
        );
        
        let avgTimeToClose = 'N/A';
        if (closedApplications.length > 0) {
            const totalTime = closedApplications.reduce((sum, app) => {
                const appliedDate = new Date(app.appliedDate);
                const closedDate = new Date(app.statusUpdatedDate);
                return sum + (closedDate - appliedDate);
            }, 0);
            avgTimeToClose = Math.round(totalTime / closedApplications.length / (1000 * 60 * 60 * 24));
        }
        
        const hiredCount = applications.filter(app => app.status === 'hired').length;
        const totalApplications = applications.length;
        const hireEffectiveness = totalApplications > 0 ? Math.round((hiredCount / totalApplications) * 100) : 0;
        
        const stageDistribution = {
            new: applications.filter(app => app.status === 'new').length,
            screening: applications.filter(app => app.status === 'screening').length,
            interview: applications.filter(app => app.status === 'interview').length,
            technical: applications.filter(app => app.status === 'technical').length,
            final: applications.filter(app => app.status === 'final').length,
            offer: applications.filter(app => app.status === 'offer').length,
            hired: hiredCount,
            rejected: applications.filter(app => app.status === 'rejected').length
        };
        
        return { avgTimeToClose, hireEffectiveness, stageDistribution, totalApplications, hiredCount };
    } catch (error) {
        console.error('Error calculando métricas:', error);
        throw new Error('No se pudieron calcular las métricas');
    }
};
