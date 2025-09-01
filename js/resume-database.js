// Resume Database Management
class ResumeDatabase {
    constructor() {
        this.resumes = this.generateSampleData();
        this.filteredResumes = [...this.resumes];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.currentView = 'list';
        this.selectedResumes = new Set();
        
        this.initializeEventListeners();
        this.loadData();
    }

    generateSampleData() {
        const names = ['Carlos Rodríguez', 'Ana García', 'Luis Martínez', 'Sofia López', 'Diego Torres', 'María Fernández', 'Andrés Silva', 'Carmen Ruiz', 'Pablo Morales', 'Isabel Castro', 'Javier Mendoza', 'Lucía Vargas', 'Roberto Herrera', 'Valentina Cruz', 'Fernando Reyes'];
        const positions = ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'UI/UX Designer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'QA Engineer', 'Product Manager', 'Business Analyst'];
        const statuses = ['new', 'reviewed', 'shortlisted', 'interviewed', 'rejected'];
        const statusLabels = { new: 'Nuevo', reviewed: 'Revisado', shortlisted: 'Preseleccionado', interviewed: 'Entrevistado', rejected: 'Rechazado' };
        const experiences = ['junior', 'semi-senior', 'senior'];
        const experienceLabels = { junior: 'Junior (0-2 años)', 'semi-senior': 'Semi-Senior (2-5 años)', senior: 'Senior (5+ años)' };
        const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'Angular', 'Vue.js', 'TypeScript', 'PHP', 'C#', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes'];

        return Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            name: names[Math.floor(Math.random() * names.length)],
            email: `candidate${i + 1}@example.com`,
            phone: `+57 30${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
            position: positions[Math.floor(Math.random() * positions.length)],
            experience: experiences[Math.floor(Math.random() * experiences.length)],
            experienceLabel: experienceLabels[experiences[Math.floor(Math.random() * experiences.length)]],
            skills: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => skills[Math.floor(Math.random() * skills.length)]).filter((v, i, a) => a.indexOf(v) === i),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            statusLabel: statusLabels[statuses[Math.floor(Math.random() * statuses.length)]],
            uploadDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
            rating: Math.floor(Math.random() * 5) + 1,
            notes: [
                { date: new Date(), author: 'Sistema', content: 'CV cargado automáticamente' },
                ...(Math.random() > 0.5 ? [{ date: new Date(), author: 'Ana García', content: 'Candidato prometedor para el equipo de desarrollo' }] : [])
            ],
            documents: [
                { name: 'CV_Principal.pdf', type: 'pdf', uploadDate: new Date(), size: '245 KB' },
                ...(Math.random() > 0.7 ? [{ name: 'Carta_Presentacion.pdf', type: 'pdf', uploadDate: new Date(), size: '123 KB' }] : [])
            ]
        }));
    }

    initializeEventListeners() {
        // Search functionality
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterResumes();
        });

        // Filter dropdowns
        ['department-filter', 'experience-filter', 'status-filter'].forEach(filterId => {
            document.getElementById(filterId).addEventListener('change', () => {
                this.filterResumes();
            });
        });

        // Clear filters
        document.getElementById('clear-filters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Sort dropdown
        document.getElementById('sort-select').addEventListener('change', (e) => {
            this.sortResumes(e.target.value);
        });

        // View mode toggles
        document.querySelectorAll('input[name="view-mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentView = e.target.id === 'list-view' ? 'list' : 'card';
                this.renderResumes();
            });
        });

        // Items per page
        document.getElementById('items-per-page').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderResumes();
        });

        // Select all checkbox
        document.getElementById('select-all').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Upload resume form
        document.getElementById('save-resume').addEventListener('click', () => {
            this.saveNewResume();
        });

        // Export data
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        // Resume actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-resume')) {
                const resumeId = parseInt(e.target.closest('.view-resume').dataset.resumeId);
                this.openResumeDetail(resumeId);
            }
            
            if (e.target.closest('.quick-action')) {
                const action = e.target.closest('.quick-action').dataset.action;
                const resumeId = parseInt(e.target.closest('.quick-action').dataset.resumeId);
                this.performQuickAction(action, resumeId);
            }
        });

        // Notes functionality
        document.getElementById('add-note').addEventListener('click', () => {
            this.addNote();
        });
    }

    loadData() {
        this.updateStatistics();
        this.renderResumes();
    }

    updateStatistics() {
        const stats = {
            total: this.resumes.length,
            recent: this.resumes.filter(r => (new Date() - r.uploadDate) < 7 * 24 * 60 * 60 * 1000).length,
            reviewed: this.resumes.filter(r => r.status !== 'new').length,
            shortlisted: this.resumes.filter(r => r.status === 'shortlisted').length
        };

        document.getElementById('total-resumes').textContent = stats.total.toLocaleString();
        document.getElementById('recent-uploads').textContent = stats.recent;
        document.getElementById('reviewed-today').textContent = stats.reviewed;
        document.getElementById('shortlisted').textContent = stats.shortlisted;
    }

    filterResumes() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const departmentFilter = document.getElementById('department-filter').value;
        const experienceFilter = document.getElementById('experience-filter').value;
        const statusFilter = document.getElementById('status-filter').value;

        this.filteredResumes = this.resumes.filter(resume => {
            const matchesSearch = !searchTerm || 
                resume.name.toLowerCase().includes(searchTerm) ||
                resume.position.toLowerCase().includes(searchTerm) ||
                resume.skills.some(skill => skill.toLowerCase().includes(searchTerm));

            const matchesDepartment = !departmentFilter || resume.position.toLowerCase().includes(departmentFilter);
            const matchesExperience = !experienceFilter || resume.experience === experienceFilter;
            const matchesStatus = !statusFilter || resume.status === statusFilter;

            return matchesSearch && matchesDepartment && matchesExperience && matchesStatus;
        });

        this.currentPage = 1;
        this.renderResumes();
        this.updateResultsCount();
    }

    sortResumes(sortBy) {
        const [field, direction] = sortBy.split('-');
        
        this.filteredResumes.sort((a, b) => {
            let valueA, valueB;
            
            switch (field) {
                case 'date':
                    valueA = a.uploadDate;
                    valueB = b.uploadDate;
                    break;
                case 'name':
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
                case 'experience':
                    const expOrder = { junior: 1, 'semi-senior': 2, senior: 3 };
                    valueA = expOrder[a.experience];
                    valueB = expOrder[b.experience];
                    break;
                case 'rating':
                    valueA = a.rating;
                    valueB = b.rating;
                    break;
                default:
                    return 0;
            }

            if (direction === 'asc') {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
        });

        this.renderResumes();
    }

    renderResumes() {
        if (this.currentView === 'list') {
            this.renderListView();
        } else {
            this.renderCardView();
        }
        
        this.renderPagination();
        this.updateResultsCount();
    }

    renderListView() {
        const tbody = document.getElementById('resumes-tbody');
        const startIdx = (this.currentPage - 1) * this.itemsPerPage;
        const endIdx = startIdx + this.itemsPerPage;
        const pageResumes = this.filteredResumes.slice(startIdx, endIdx);

        tbody.innerHTML = pageResumes.map(resume => `
            <tr>
                <td>
                    <input type="checkbox" class="form-check-input resume-checkbox" data-resume-id="${resume.id}" ${this.selectedResumes.has(resume.id) ? 'checked' : ''}>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="../img/default-avatar.svg" alt="${resume.name}" class="candidate-avatar me-2">
                        <div>
                            <div class="fw-bold">${resume.name}</div>
                            <small class="text-muted">${resume.email}</small>
                        </div>
                    </div>
                </td>
                <td>${resume.position}</td>
                <td>
                    <span class="badge bg-${this.getExperienceBadgeColor(resume.experience)}">${resume.experienceLabel}</span>
                </td>
                <td>
                    ${resume.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    ${resume.skills.length > 3 ? `<small class="text-muted">+${resume.skills.length - 3} más</small>` : ''}
                </td>
                <td>
                    <span class="badge status-badge status-${resume.status}">${resume.statusLabel}</span>
                </td>
                <td>
                    <small>${this.formatDate(resume.uploadDate)}</small>
                </td>
                <td>
                    <div class="rating-stars">
                        ${Array.from({length: 5}, (_, i) => `<i class="fa${i < resume.rating ? 's' : 'r'} fa-star"></i>`).join('')}
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline-primary view-resume" data-resume-id="${resume.id}" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success quick-action" data-action="shortlist" data-resume-id="${resume.id}" title="Preseleccionar">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info quick-action" data-action="interview" data-resume-id="${resume.id}" title="Entrevista">
                            <i class="fas fa-calendar"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger quick-action" data-action="reject" data-resume-id="${resume.id}" title="Rechazar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Show list view
        document.getElementById('list-container').classList.remove('d-none');
        document.getElementById('card-container').classList.add('d-none');

        // Add event listeners for checkboxes
        document.querySelectorAll('.resume-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const resumeId = parseInt(e.target.dataset.resumeId);
                if (e.target.checked) {
                    this.selectedResumes.add(resumeId);
                } else {
                    this.selectedResumes.delete(resumeId);
                }
                this.updateBulkActions();
            });
        });
    }

    renderCardView() {
        const container = document.getElementById('card-container');
        const startIdx = (this.currentPage - 1) * this.itemsPerPage;
        const endIdx = startIdx + this.itemsPerPage;
        const pageResumes = this.filteredResumes.slice(startIdx, endIdx);

        container.innerHTML = pageResumes.map(resume => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card resume-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input resume-checkbox" data-resume-id="${resume.id}" ${this.selectedResumes.has(resume.id) ? 'checked' : ''}>
                            </div>
                            <span class="badge status-badge status-${resume.status}">${resume.statusLabel}</span>
                        </div>
                        
                        <div class="text-center mb-3">
                            <img src="../img/default-avatar.svg" alt="${resume.name}" class="candidate-avatar mb-2" style="width: 60px; height: 60px;">
                            <h6 class="mb-1">${resume.name}</h6>
                            <small class="text-muted">${resume.position}</small>
                        </div>
                        
                        <div class="mb-3">
                            <small class="text-muted d-block">Experiencia:</small>
                            <span class="badge bg-${this.getExperienceBadgeColor(resume.experience)}">${resume.experienceLabel}</span>
                        </div>
                        
                        <div class="mb-3">
                            <small class="text-muted d-block mb-1">Skills principales:</small>
                            ${resume.skills.slice(0, 4).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="rating-stars">
                                ${Array.from({length: 5}, (_, i) => `<i class="fa${i < resume.rating ? 's' : 'r'} fa-star"></i>`).join('')}
                            </div>
                            <small class="text-muted">${this.formatDate(resume.uploadDate)}</small>
                        </div>
                    </div>
                    
                    <div class="card-footer">
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-outline-primary view-resume flex-fill" data-resume-id="${resume.id}">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                            <button class="btn btn-sm btn-outline-success quick-action" data-action="shortlist" data-resume-id="${resume.id}">
                                <i class="fas fa-star"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info quick-action" data-action="interview" data-resume-id="${resume.id}">
                                <i class="fas fa-calendar"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Show card view
        document.getElementById('list-container').classList.add('d-none');
        document.getElementById('card-container').classList.remove('d-none');

        // Add event listeners for checkboxes
        document.querySelectorAll('.resume-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const resumeId = parseInt(e.target.dataset.resumeId);
                if (e.target.checked) {
                    this.selectedResumes.add(resumeId);
                } else {
                    this.selectedResumes.delete(resumeId);
                }
                this.updateBulkActions();
            });
        });
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredResumes.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
            if (startPage > 2) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }

        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;

        // Add pagination event listeners
        pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page || e.target.closest('a').dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderResumes();
                }
            });
        });
    }

    openResumeDetail(resumeId) {
        const resume = this.resumes.find(r => r.id === resumeId);
        if (!resume) return;

        // Update modal content
        document.getElementById('modal-candidate-name').textContent = resume.name;
        document.getElementById('modal-candidate-position').textContent = resume.position;

        // Load candidate info
        document.getElementById('candidate-info').innerHTML = `
            <table class="table table-sm">
                <tr><th width="80">Email:</th><td>${resume.email}</td></tr>
                <tr><th>Teléfono:</th><td>${resume.phone}</td></tr>
                <tr><th>Experiencia:</th><td>${resume.experienceLabel}</td></tr>
                <tr><th>Estado:</th><td><span class="badge status-badge status-${resume.status}">${resume.statusLabel}</span></td></tr>
                <tr><th>Calificación:</th><td>
                    <div class="rating-stars">
                        ${Array.from({length: 5}, (_, i) => `<i class="fa${i < resume.rating ? 's' : 'r'} fa-star"></i>`).join('')}
                    </div>
                </td></tr>
            </table>
        `;

        // Load resume content preview
        document.getElementById('resume-content').innerHTML = `
            <div class="border rounded p-3 mb-3">
                <h6>Skills y Competencias</h6>
                ${resume.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <div class="border rounded p-3 mb-3">
                <h6>Documentos</h6>
                ${resume.documents.map(doc => `
                    <div class="d-flex justify-content-between align-items-center py-1">
                        <span><i class="fas fa-file-${doc.type} me-1"></i> ${doc.name}</span>
                        <small class="text-muted">${doc.size}</small>
                    </div>
                `).join('')}
            </div>
        `;

        // Load notes
        this.loadNotes(resume);

        // Store current resume ID
        this.currentResumeId = resumeId;

        // Show modal
        new bootstrap.Modal(document.getElementById('resumeDetailModal')).show();
    }

    loadNotes(resume) {
        const notesContainer = document.getElementById('internal-notes');
        notesContainer.innerHTML = resume.notes.map(note => `
            <div class="border-bottom pb-2 mb-2">
                <div class="d-flex justify-content-between align-items-start">
                    <small class="fw-bold text-primary">${note.author}</small>
                    <small class="text-muted">${this.formatDate(note.date)}</small>
                </div>
                <p class="mb-0 mt-1">${note.content}</p>
            </div>
        `).join('');
    }

    addNote() {
        const noteText = document.getElementById('new-note').value.trim();
        if (!noteText || !this.currentResumeId) return;

        const resume = this.resumes.find(r => r.id === this.currentResumeId);
        if (resume) {
            resume.notes.unshift({
                date: new Date(),
                author: 'Usuario Actual', // In real app, get from session
                content: noteText
            });
            
            this.loadNotes(resume);
            document.getElementById('new-note').value = '';
            
            // Show success message
            this.showToast('Nota agregada exitosamente', 'success');
        }
    }

    clearFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('department-filter').value = '';
        document.getElementById('experience-filter').value = '';
        document.getElementById('status-filter').value = '';
        this.filterResumes();
    }

    toggleSelectAll(checked) {
        const startIdx = (this.currentPage - 1) * this.itemsPerPage;
        const endIdx = startIdx + this.itemsPerPage;
        const pageResumes = this.filteredResumes.slice(startIdx, endIdx);

        if (checked) {
            pageResumes.forEach(resume => this.selectedResumes.add(resume.id));
        } else {
            pageResumes.forEach(resume => this.selectedResumes.delete(resume.id));
        }

        this.renderResumes();
        this.updateBulkActions();
    }

    updateBulkActions() {
        const selectedCount = this.selectedResumes.size;
        document.getElementById('selected-count').textContent = selectedCount;
        
        // Enable/disable bulk actions button if needed
        const bulkBtn = document.querySelector('[data-bs-target="#bulkActionsModal"]');
        if (bulkBtn) {
            bulkBtn.disabled = selectedCount === 0;
        }
    }

    performQuickAction(action, resumeId) {
        const resume = this.resumes.find(r => r.id === resumeId);
        if (!resume) return;

        switch (action) {
            case 'shortlist':
                resume.status = 'shortlisted';
                resume.statusLabel = 'Preseleccionado';
                this.showToast(`${resume.name} ha sido preseleccionado`, 'success');
                break;
            case 'interview':
                this.scheduleInterview(resume);
                return;
            case 'reject':
                if (confirm(`¿Estás seguro de rechazar a ${resume.name}?`)) {
                    resume.status = 'rejected';
                    resume.statusLabel = 'Rechazado';
                    this.showToast(`${resume.name} ha sido rechazado`, 'warning');
                }
                break;
        }

        this.renderResumes();
        this.updateStatistics();
    }

    scheduleInterview(resume) {
        // This would open an interview scheduling modal
        alert(`Funcionalidad de programar entrevista para ${resume.name} - Por implementar`);
    }

    saveNewResume() {
        const form = document.getElementById('upload-resume-form');
        const formData = new FormData(form);
        
        const newResume = {
            id: this.resumes.length + 1,
            name: document.getElementById('candidate-name').value,
            email: document.getElementById('candidate-email').value,
            phone: document.getElementById('candidate-phone').value,
            position: document.getElementById('position-applied').value,
            experience: document.getElementById('experience-level').value,
            experienceLabel: document.getElementById('experience-level').selectedOptions[0].textContent,
            skills: ['JavaScript', 'React', 'Node.js'], // In real app, extract from CV
            status: 'new',
            statusLabel: 'Nuevo',
            uploadDate: new Date(),
            rating: 0,
            notes: document.getElementById('initial-notes').value ? 
                [{ date: new Date(), author: 'Usuario Actual', content: document.getElementById('initial-notes').value }] : 
                [],
            documents: [{ name: 'CV_Principal.pdf', type: 'pdf', uploadDate: new Date(), size: '245 KB' }]
        };

        this.resumes.unshift(newResume);
        this.filterResumes();
        this.updateStatistics();
        
        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('uploadResumeModal')).hide();
        form.reset();
        
        this.showToast('CV cargado exitosamente', 'success');
    }

    exportData() {
        const data = this.filteredResumes.map(resume => ({
            Nombre: resume.name,
            Email: resume.email,
            Teléfono: resume.phone,
            Posición: resume.position,
            Experiencia: resume.experienceLabel,
            Skills: resume.skills.join(', '),
            Estado: resume.statusLabel,
            Fecha: this.formatDate(resume.uploadDate),
            Calificación: resume.rating
        }));

        this.downloadCSV(data, 'base_datos_cvs.csv');
        this.showToast('Datos exportados exitosamente', 'success');
    }

    downloadCSV(data, filename) {
        const csvContent = this.convertToCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header];
                return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    }

    getExperienceBadgeColor(experience) {
        const colors = { junior: 'info', 'semi-senior': 'warning', senior: 'success' };
        return colors[experience] || 'secondary';
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    updateResultsCount() {
        const startIdx = (this.currentPage - 1) * this.itemsPerPage;
        const endIdx = Math.min(startIdx + this.itemsPerPage, this.filteredResumes.length);
        const total = this.filteredResumes.length;
        
        document.getElementById('results-count').textContent = 
            `Mostrando ${startIdx + 1}-${endIdx} de ${total.toLocaleString()} resultados`;
    }

    showToast(message, type = 'info') {
        // Simple toast notification - in real app you'd use a proper toast library
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumeDatabase();
});
