/**
 * Reports Module for Catalyst HR System
 * Enhanced reporting and analytics functionality
 */
import { dataManager } from './data-manager.js';
import { showToast } from './ui.js';

// Reports and Analytics Management
class Reports {
    constructor() {
        this.currentPeriod = 'last30';
        this.charts = {};
        this.reportData = this.generateReportData();
        
        this.initializeEventListeners();
        this.loadData();
    }

    generateReportData() {
        // Generate sample data for reports
        const departments = ['Desarrollo', 'Diseño', 'Marketing', 'Ventas', 'RRHH'];
        const sources = ['LinkedIn', 'Indeed', 'Web Corporativa', 'Referidos', 'Universidad'];
        
        // Applications over time (last 30 days)
        const applicationsOverTime = Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
            applications: Math.floor(Math.random() * 20) + 5,
            hires: Math.floor(Math.random() * 3)
        }));

        // Applications by department
        const applicationsByDepartment = departments.map(dept => ({
            department: dept,
            applications: Math.floor(Math.random() * 100) + 20,
            hires: Math.floor(Math.random() * 10) + 2,
            avgTimeToHire: Math.floor(Math.random() * 30) + 15
        }));

        // Source effectiveness
        const sourceEffectiveness = sources.map(source => ({
            source: source,
            applications: Math.floor(Math.random() * 150) + 50,
            qualified: Math.floor(Math.random() * 50) + 10,
            hires: Math.floor(Math.random() * 15) + 2,
            cost: Math.floor(Math.random() * 500000) + 100000
        }));

        // Hiring funnel data
        const totalApplications = 450;
        const funnelData = {
            applications: totalApplications,
            screening: Math.floor(totalApplications * 0.7),
            interview: Math.floor(totalApplications * 0.3),
            offer: Math.floor(totalApplications * 0.1),
            hired: Math.floor(totalApplications * 0.08)
        };

        // Performance metrics
        const performanceMetrics = [
            { name: 'Tiempo promedio de contratación', value: 25, unit: 'días', target: 30, status: 'good' },
            { name: 'Tasa de conversión', value: 8.5, unit: '%', target: 10, status: 'warning' },
            { name: 'Calidad de candidatos', value: 85, unit: '%', target: 80, status: 'excellent' },
            { name: 'Satisfacción de managers', value: 92, unit: '%', target: 85, status: 'excellent' },
            { name: 'Costo por contratación', value: 1250000, unit: 'COP', target: 1500000, status: 'good' },
            { name: 'Retención a 6 meses', value: 88, unit: '%', target: 85, status: 'good' }
        ];

        return {
            applicationsOverTime,
            applicationsByDepartment,
            sourceEffectiveness,
            funnelData,
            performanceMetrics
        };
    }

    initializeEventListeners() {
        // Period filter dropdown items
        document.querySelectorAll('[data-period]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const period = e.target.getAttribute('data-period');
                
                if (period === 'custom') {
                    new bootstrap.Modal(document.getElementById('customPeriodModal')).show();
                } else {
                    this.currentPeriod = period;
                    this.loadData();
                    showToast(`Período actualizado: últimos ${period} días`, 'success');
                }
            });
        });

        // Export buttons
        const exportReport = document.getElementById('export-report');
        if (exportReport) {
            exportReport.addEventListener('click', () => {
                this.exportReport('pdf');
            });
        }
        
        const exportPdf = document.getElementById('export-pdf');
        if (exportPdf) {
            exportPdf.addEventListener('click', () => {
                this.exportReport('pdf');
            });
        }

        const exportExcel = document.getElementById('export-excel');
        if (exportExcel) {
            exportExcel.addEventListener('click', () => {
                this.exportReport('excel');
            });
        }

        const exportCsv = document.getElementById('export-csv');
        if (exportCsv) {
            exportCsv.addEventListener('click', () => {
                this.exportReport('csv');
            });
        }
        
        const exportPowerpoint = document.getElementById('export-powerpoint');
        if (exportPowerpoint) {
            exportPowerpoint.addEventListener('click', () => {
                this.exportReport('powerpoint');
            });
        }

        // Apply custom period
        const applyCustom = document.getElementById('apply-custom-period');
        if (applyCustom) {
            applyCustom.addEventListener('click', () => {
                this.applyCustomPeriod();
            });
        }
        
        // Toggle cost details
        const toggleCost = document.getElementById('toggle-cost-details');
        if (toggleCost) {
            toggleCost.addEventListener('click', () => {
                this.toggleCostBreakdown();
            });
        }
        
        // Timeline view buttons
        document.querySelectorAll('input[name="timeline-view"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    this.updateTimelineView(radio.id);
                }
            });
        });
    }

    loadData() {
        this.updateKeyMetrics();
        this.renderCharts();
        this.updateTopPositions();
        this.updateRecruiterPerformance();
        this.updateLastUpdate();
    }

    updateKeyMetrics() {
        const metrics = {
            totalApplications: this.reportData.applicationsOverTime.reduce((sum, item) => sum + item.applications, 0),
            totalHires: this.reportData.applicationsOverTime.reduce((sum, item) => sum + item.hires, 0),
            avgTimeToHire: this.reportData.performanceMetrics.find(m => m.name === 'Tiempo promedio de contratación').value,
            conversionRate: this.reportData.performanceMetrics.find(m => m.name === 'Tasa de conversión').value,
            costPerHire: this.reportData.performanceMetrics.find(m => m.name === 'Costo por contratación').value,
            activeVacancies: Math.floor(Math.random() * 25) + 15
        };

        document.getElementById('total-applications').textContent = metrics.totalApplications.toLocaleString();
        document.getElementById('total-hires').textContent = metrics.totalHires;
        document.getElementById('avg-time-to-hire').textContent = `${metrics.avgTimeToHire} días`;
        document.getElementById('conversion-rate').textContent = `${metrics.conversionRate}%`;
        document.getElementById('cost-per-hire').textContent = `$${metrics.costPerHire.toLocaleString()}`;
        document.getElementById('active-vacancies-metric').textContent = metrics.activeVacancies;
    }

    renderCharts() {
        this.renderApplicationsChart();
        this.renderFunnelChart();
        this.renderDepartmentChart();
        this.renderSourceChart();
    }

    renderApplicationsChart() {
        const ctx = document.getElementById('applicationsChart').getContext('2d');
        
        if (this.charts.applications) {
            this.charts.applications.destroy();
        }

        const data = this.reportData.applicationsOverTime;
        
        this.charts.applications = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => this.formatChartDate(item.date)),
                datasets: [{
                    label: 'Aplicaciones',
                    data: data.map(item => item.applications),
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    tension: 0.3,
                    fill: true
                }, {
                    label: 'Contrataciones',
                    data: data.map(item => item.hires),
                    borderColor: '#198754',
                    backgroundColor: 'rgba(25, 135, 84, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Aplicaciones y Contrataciones en el Tiempo'
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Cantidad'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderFunnelChart() {
        const ctx = document.getElementById('funnelChart').getContext('2d');
        
        if (this.charts.funnel) {
            this.charts.funnel.destroy();
        }

        const data = this.reportData.funnelData;
        
        this.charts.funnel = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Aplicaciones', 'Screening', 'Entrevista', 'Oferta', 'Contratado'],
                datasets: [{
                    label: 'Candidatos',
                    data: [data.applications, data.screening, data.interview, data.offer, data.hired],
                    backgroundColor: [
                        '#0d6efd',
                        '#6f42c1',
                        '#e83e8c',
                        '#fd7e14',
                        '#198754'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Funnel de Contratación'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: true
                    },
                    y: {
                        display: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderDepartmentChart() {
        const ctx = document.getElementById('departmentChart').getContext('2d');
        
        if (this.charts.department) {
            this.charts.department.destroy();
        }

        const data = this.reportData.applicationsByDepartment;
        
        this.charts.department = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(item => item.department),
                datasets: [{
                    data: data.map(item => item.applications),
                    backgroundColor: [
                        '#0d6efd',
                        '#198754',
                        '#fd7e14',
                        '#e83e8c',
                        '#6f42c1'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Aplicaciones por Departamento'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderSourceChart() {
        const ctx = document.getElementById('sourceChart').getContext('2d');
        
        if (this.charts.source) {
            this.charts.source.destroy();
        }

        const data = this.reportData.sourceEffectiveness;
        
        this.charts.source = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.source),
                datasets: [{
                    label: 'Aplicaciones',
                    data: data.map(item => item.applications),
                    backgroundColor: 'rgba(13, 110, 253, 0.7)',
                    yAxisID: 'y'
                }, {
                    label: 'Contrataciones',
                    data: data.map(item => item.hires),
                    backgroundColor: 'rgba(25, 135, 84, 0.7)',
                    yAxisID: 'y'
                }, {
                    label: 'Efectividad (%)',
                    data: data.map(item => ((item.hires / item.applications) * 100).toFixed(1)),
                    type: 'line',
                    borderColor: '#e83e8c',
                    backgroundColor: 'rgba(232, 62, 140, 0.1)',
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Efectividad de Fuentes de Reclutamiento'
                    }
                },
                scales: {
                    x: {
                        display: true
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Cantidad'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Efectividad (%)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    renderPerformanceMetrics() {
        const container = document.getElementById('performance-metrics');
        container.innerHTML = this.reportData.performanceMetrics.map(metric => {
            const percentage = metric.unit === '%' ? metric.value : 
                ((metric.value / metric.target) * 100);
            const statusClass = this.getStatusClass(metric.status);
            
            return `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card performance-card h-100">
                        <div class="card-body">
                            <h6 class="card-title">${metric.name}</h6>
                            <div class="metric-value ${statusClass}">
                                ${metric.unit === 'COP' ? '$' + metric.value.toLocaleString() : metric.value + ' ' + metric.unit}
                            </div>
                            <div class="progress mb-2" style="height: 6px;">
                                <div class="progress-bar bg-${this.getStatusColor(metric.status)}" 
                                     style="width: ${Math.min(percentage, 100)}%"></div>
                            </div>
                            <small class="text-muted">
                                Objetivo: ${metric.unit === 'COP' ? '$' + metric.target.toLocaleString() : metric.target + ' ' + metric.unit}
                                <span class="float-end ${statusClass}">
                                    <i class="fas fa-${this.getStatusIcon(metric.status)}"></i>
                                </span>
                            </small>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCostAnalysis() {
        const container = document.getElementById('cost-analysis');
        const totalCost = this.reportData.sourceEffectiveness.reduce((sum, source) => sum + source.cost, 0);
        
        container.innerHTML = this.reportData.sourceEffectiveness.map(source => {
            const effectivenessRate = (source.hires / source.applications * 100).toFixed(1);
            const costPerHire = source.hires > 0 ? Math.floor(source.cost / source.hires) : 0;
            const percentage = (source.cost / totalCost * 100).toFixed(1);
            
            return `
                <div class="cost-item">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong>${source.source}</strong>
                        <span class="badge bg-primary">${effectivenessRate}% efectividad</span>
                    </div>
                    <div class="row text-center mb-2">
                        <div class="col-3">
                            <small class="text-muted">Costo total</small>
                            <div class="fw-bold">$${source.cost.toLocaleString()}</div>
                        </div>
                        <div class="col-3">
                            <small class="text-muted">Contrataciones</small>
                            <div class="fw-bold text-success">${source.hires}</div>
                        </div>
                        <div class="col-3">
                            <small class="text-muted">Costo/Contratación</small>
                            <div class="fw-bold text-info">$${costPerHire.toLocaleString()}</div>
                        </div>
                        <div class="col-3">
                            <small class="text-muted">% del total</small>
                            <div class="fw-bold text-warning">${percentage}%</div>
                        </div>
                    </div>
                    <div class="progress" style="height: 4px;">
                        <div class="progress-bar" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    applyCustomPeriod() {
        const startDate = document.getElementById('custom-start-date').value;
        const endDate = document.getElementById('custom-end-date').value;
        
        if (!startDate || !endDate) {
            this.showToast('Por favor selecciona ambas fechas', 'error');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            this.showToast('La fecha de inicio debe ser anterior a la fecha final', 'error');
            return;
        }

        // Update period display
        document.getElementById('current-period').textContent = 
            `${this.formatDate(new Date(startDate))} - ${this.formatDate(new Date(endDate))}`;
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('customPeriodModal')).hide();
        
        // In a real app, this would reload data for the custom period
        this.showToast('Período personalizado aplicado', 'success');
    }

    exportReport(format) {
        // Show export modal
        const modal = new bootstrap.Modal(document.getElementById('exportProgressModal'));
        modal.show();
        
        // Simulate export progress
        let progress = 0;
        const progressBar = document.querySelector('#exportProgressModal .progress-bar');
        const progressText = document.getElementById('export-status');
        
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = progress + '%';
            progressText.textContent = progress < 100 ? 
                'Generando reporte...' : 
                'Reporte generado exitosamente';
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    modal.hide();
                    this.downloadReport(format);
                }, 1000);
            }
        }, 200);
    }

    downloadReport(format) {
        // In a real app, this would generate and download the actual report
        const fileName = `reporte_rrhh_${new Date().toISOString().split('T')[0]}.${format}`;
        
        if (format === 'csv') {
            this.downloadCSV(this.prepareCSVData(), fileName);
        } else {
            // For PDF and Excel, show success message
            this.showToast(`Reporte ${format.toUpperCase()} descargado: ${fileName}`, 'success');
        }
    }

    prepareCSVData() {
        const data = [];
        
        // Add key metrics
        data.push(['Métricas Clave', '', '', '']);
        data.push(['Aplicaciones totales', this.reportData.applicationsOverTime.reduce((sum, item) => sum + item.applications, 0)]);
        data.push(['Contrataciones totales', this.reportData.applicationsOverTime.reduce((sum, item) => sum + item.hires, 0)]);
        data.push(['']);
        
        // Add department data
        data.push(['Departamento', 'Aplicaciones', 'Contrataciones', 'Tiempo promedio']);
        this.reportData.applicationsByDepartment.forEach(dept => {
            data.push([dept.department, dept.applications, dept.hires, dept.avgTimeToHire + ' días']);
        });
        
        return data;
    }

    downloadCSV(data, filename) {
        const csvContent = data.map(row => 
            Array.isArray(row) ? 
            row.map(cell => `"${cell}"`).join(',') : 
            `"${row}"`
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    refreshData() {
        // Show loading state
        const refreshBtn = document.getElementById('refresh-data');
        const originalHTML = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        refreshBtn.disabled = true;

        // Simulate data refresh
        setTimeout(() => {
            this.reportData = this.generateReportData();
            this.loadData();
            
            refreshBtn.innerHTML = originalHTML;
            refreshBtn.disabled = false;
            
            this.showToast('Datos actualizados exitosamente', 'success');
        }, 2000);
    }

    updateTopPositions() {
        // Generate sample top positions data
        const positions = [
            { title: 'Desarrollador Frontend React', applications: 89, hired: 4, rate: 4.5 },
            { title: 'Desarrollador Backend Node.js', applications: 76, hired: 3, rate: 3.9 },
            { title: 'Diseñador UX/UI', applications: 65, hired: 5, rate: 7.7 },
            { title: 'Data Scientist', applications: 54, hired: 2, rate: 3.7 },
            { title: 'DevOps Engineer', applications: 43, hired: 3, rate: 7.0 }
        ];
        
        const tableBody = document.getElementById('top-positions');
        if (tableBody) {
            tableBody.innerHTML = positions.map(pos => `
                <tr>
                    <td>${pos.title}</td>
                    <td><span class="badge bg-primary">${pos.applications}</span></td>
                    <td><span class="badge bg-success">${pos.hired}</span></td>
                    <td><span class="badge bg-info">${pos.rate}%</span></td>
                </tr>
            `).join('');
        }
    }
    
    updateRecruiterPerformance() {
        // Generate sample recruiter performance data
        const recruiters = [
            { name: 'María García', vacancies: 8, hires: 12, avgTime: 18 },
            { name: 'Carlos Rodríguez', vacancies: 6, hires: 9, avgTime: 22 },
            { name: 'Ana López', vacancies: 5, hires: 7, avgTime: 16 },
            { name: 'Luis Martínez', vacancies: 4, hires: 5, avgTime: 25 },
            { name: 'Sofia Herrera', vacancies: 3, hires: 4, avgTime: 19 }
        ];
        
        const tableBody = document.getElementById('recruiter-performance');
        if (tableBody) {
            tableBody.innerHTML = recruiters.map(recruiter => `
                <tr>
                    <td>${recruiter.name}</td>
                    <td><span class="badge bg-primary">${recruiter.vacancies}</span></td>
                    <td><span class="badge bg-success">${recruiter.hires}</span></td>
                    <td><span class="badge bg-info">${recruiter.avgTime} días</span></td>
                </tr>
            `).join('');
        }
    }
    
    toggleCostBreakdown() {
        const breakdown = document.getElementById('cost-breakdown');
        const button = document.getElementById('toggle-cost-details');
        
        if (breakdown && button) {
            if (breakdown.classList.contains('d-none')) {
                breakdown.classList.remove('d-none');
                button.textContent = 'Ocultar Detalles';
                
                // Initialize cost breakdown chart if not already done
                if (!this.charts.costBreakdown) {
                    this.renderCostBreakdownChart();
                }
            } else {
                breakdown.classList.add('d-none');
                button.textContent = 'Ver Detalles';
            }
        }
    }
    
    renderCostBreakdownChart() {
        const ctx = document.getElementById('costBreakdownChart')?.getContext('2d');
        if (!ctx) return;
        
        this.charts.costBreakdown = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Publicación de Vacantes', 'Proceso de Entrevistas', 'Evaluaciones Técnicas', 'Administración', 'Capacitación'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        'rgb(59, 130, 246)',
                        'rgb(34, 197, 94)',
                        'rgb(249, 115, 22)',
                        'rgb(168, 85, 247)',
                        'rgb(239, 68, 68)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    title: {
                        display: true,
                        text: 'Desglose de Costos por Categoría'
                    }
                }
            }
        });
    }
    
    updateTimelineView(viewType) {
        // Update the applications chart based on selected timeline view
        let newData;
        
        switch (viewType) {
            case 'daily':
                newData = this.generateDailyData();
                break;
            case 'weekly':
                newData = this.generateWeeklyData();
                break;
            case 'monthly':
                newData = this.generateMonthlyData();
                break;
            default:
                newData = this.reportData.applicationsOverTime;
        }
        
        // Update the applications chart with new data
        if (this.charts.applications) {
            this.charts.applications.data.labels = newData.map(item => this.formatChartDate(item.date));
            this.charts.applications.data.datasets[0].data = newData.map(item => item.applications);
            this.charts.applications.data.datasets[1].data = newData.map(item => item.hires);
            this.charts.applications.update();
        }
        
        showToast(`Vista actualizada: ${viewType}`, 'success');
    }
    
    generateDailyData() {
        return Array.from({ length: 14 }, (_, i) => ({
            date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
            applications: Math.floor(Math.random() * 15) + 3,
            hires: Math.floor(Math.random() * 2)
        }));
    }
    
    generateWeeklyData() {
        return Array.from({ length: 12 }, (_, i) => ({
            date: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000),
            applications: Math.floor(Math.random() * 80) + 20,
            hires: Math.floor(Math.random() * 8) + 1
        }));
    }
    
    generateMonthlyData() {
        return Array.from({ length: 6 }, (_, i) => ({
            date: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000),
            applications: Math.floor(Math.random() * 300) + 100,
            hires: Math.floor(Math.random() * 25) + 5
        }));
    }

    updateLastUpdate() {
        const now = new Date();
        const lastUpdate = document.getElementById('last-update');
        if (lastUpdate) {
            lastUpdate.textContent = `Última actualización: ${this.formatDateTime(now)}`;
        }
    }

    getStatusClass(status) {
        const classes = {
            excellent: 'text-success',
            good: 'text-info',
            warning: 'text-warning',
            danger: 'text-danger'
        };
        return classes[status] || 'text-muted';
    }

    getStatusColor(status) {
        const colors = {
            excellent: 'success',
            good: 'info',
            warning: 'warning',
            danger: 'danger'
        };
        return colors[status] || 'secondary';
    }

    getStatusIcon(status) {
        const icons = {
            excellent: 'check-circle',
            good: 'check',
            warning: 'exclamation-triangle',
            danger: 'times-circle'
        };
        return icons[status] || 'minus-circle';
    }

    formatChartDate(date) {
        return new Intl.DateTimeFormat('es-ES', {
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    formatDateTime(date) {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    showToast(message, type = 'info') {
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
    new Reports();
});
