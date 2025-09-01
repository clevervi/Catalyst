import { apiRequest } from './api.js';
import { calculateJobMetrics } from './kanban.js';
import { showToast } from './ui.js';

export const initMetricsDashboard = async () => {
    try {
        const [jobs, applications] = await Promise.all([
            apiRequest('/jobs'),
            apiRequest('/applications')
        ]);
        
        const metrics = calculateGeneralMetrics(jobs, applications);
        renderMetricsDashboard(metrics, jobs);
        
        // Cargar las métricas de la tabla de forma asíncrona
        renderJobMetricsRows(jobs);

    } catch (error) {
        console.error('Error inicializando dashboard de métricas:', error);
        showToast('Error al cargar el dashboard de métricas', 'error');
    }
};

const calculateGeneralMetrics = (jobs, applications) => {
    const totalJobs = jobs.length;
    const totalApplications = applications.length;
    const openJobs = jobs.filter(job => !job.closed).length; // Suponiendo que hay un campo 'closed'
    
    const hiredApplications = applications.filter(app => app.status === 'offer').length;
    const conversionRate = totalApplications > 0 ? Math.round((hiredApplications / totalApplications) * 100) : 0;
    
    const hiredAppsWithDates = applications.filter(app => app.status === 'offer' && app.appliedDate && app.statusUpdatedDate);
    
    let avgHiringTime = 'N/A';
    if (hiredAppsWithDates.length > 0) {
        const totalTime = hiredAppsWithDates.reduce((sum, app) => {
            return sum + (new Date(app.statusUpdatedDate) - new Date(app.appliedDate));
        }, 0);
        avgHiringTime = Math.round(totalTime / hiredAppsWithDates.length / (1000 * 60 * 60 * 24));
    }
    
    return { totalJobs, totalApplications, openJobs, conversionRate, avgHiringTime, hiredApplications };
};

const renderMetricsDashboard = (metrics, jobs) => {
    const dashboardContainer = document.getElementById('metrics-dashboard');
    if (!dashboardContainer) return;
    
    dashboardContainer.innerHTML = `
        <div class="row mb-4">
            <!-- Tarjetas de métricas -->
            <div class="col-md-3 mb-3"><div class="card text-center"><div class="card-body"><h6>Total Vacantes</h6><h3>${metrics.totalJobs}</h3></div></div></div>
            <div class="col-md-3 mb-3"><div class="card text-center"><div class="card-body"><h6>Total Candidatos</h6><h3>${metrics.totalApplications}</h3></div></div></div>
            <div class="col-md-3 mb-3"><div class="card text-center"><div class="card-body"><h6>Tasa de Conversión</h6><h3>${metrics.conversionRate}%</h3></div></div></div>
            <div class="col-md-3 mb-3"><div class="card text-center"><div class="card-body"><h6>Tiempo Promedio Cont.</h6><h3>${metrics.avgHiringTime} días</h3></div></div></div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card"><div class="card-header"><h5>Métricas por Vacante</h5></div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-sm">
                                <thead><tr><th>Vacante</th><th>Candidatos</th><th>Contratados</th><th>Tasa</th><th>Tiempo (días)</th></tr></thead>
                                <tbody id="job-metrics-tbody">
                                    <tr><td colspan="5" class="text-center">Cargando métricas...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderJobMetricsRows = async (jobs) => {
    const tbody = document.getElementById('job-metrics-tbody');
    if (!tbody) return;

    // ADVERTENCIA DE RENDIMIENTO: Este enfoque puede causar muchas llamadas a la API (N+1).
    // En una aplicación real, sería mejor tener un endpoint de API que calcule y devuelva
    // estas métricas de forma masiva.
    const metricsPromises = jobs.slice(0, 10).map(job => calculateJobMetrics(job.id).catch(e => null)); // Limitar y manejar errores
    const allMetrics = await Promise.all(metricsPromises);

    let rowsHTML = '';
    allMetrics.forEach((metrics, index) => {
        if (metrics) {
            const job = jobs[index];
            rowsHTML += `
                <tr>
                    <td>${job.title}</td>
                    <td>${metrics.totalApplications || 0}</td>
                    <td>${metrics.hiredCount || 0}</td>
                    <td>${metrics.hireEffectiveness || 0}%</td>
                    <td>${metrics.avgTimeToClose || 'N/A'}</td>
                </tr>
            `;
        }
    });

    tbody.innerHTML = rowsHTML || '<tr><td colspan="5" class="text-center">No hay datos disponibles.</td></tr>';
};