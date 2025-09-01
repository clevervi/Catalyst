import { ROLES } from './roles.js';

// Sistema simple que funciona con db.json local
let dbData = null;

// Cargar datos desde db.json
const loadData = async () => {
    if (dbData === null) {
        try {
            const response = await fetch('./db.json');
            if (response.ok) {
                dbData = await response.json();
            } else {
                throw new Error('No se pudo cargar db.json');
            }
        } catch (error) {
            console.warn('Usando datos por defecto');
            dbData = {
                jobs: [],
                users: [],
                applications: [],
                categories: []
            };
        }
    }
    return dbData;
};

// Autenticación simple
export const authenticateUser = async (email, password) => {
    try {
        const data = await loadData();
        const user = data.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                title: user.title || 'Usuario',
                role: user.role || ROLES.USER,
                department: user.department
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error en autenticación:', error);
        return null;
    }
};

// Obtener trabajos
export const fetchJobs = async (filters = {}) => {
    try {
        const data = await loadData();
        let jobs = data.jobs || [];
        
        // Aplicar filtros
        if (filters.query) {
            const query = filters.query.toLowerCase();
            jobs = jobs.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.company?.name?.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query)
            );
        }
        
        if (filters.featured) {
            jobs = jobs.filter(job => job.featured);
        }
        
        return jobs;
    } catch (error) {
        console.error('Error al cargar trabajos:', error);
        return [];
    }
};

// Obtener trabajos filtrados
export const fetchFilteredJobs = fetchJobs;

// Obtener detalles de trabajo
export const fetchJobDetails = async (jobId) => {
    try {
        const data = await loadData();
        const job = data.jobs.find(j => j.id == jobId);
        return job || null;
    } catch (error) {
        console.error('Error al cargar detalles del trabajo:', error);
        return null;
    }
};

// Aplicar a trabajo (simulado)
export const applyToJob = async (jobId) => {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!userData.id) {
            throw new Error('Debes iniciar sesión para aplicar');
        }
        
        // Simular aplicación exitosa
        const data = await loadData();
        if (!data.applications) data.applications = [];
        
        // Verificar si ya aplicó
        const existingApp = data.applications.find(app => 
            app.job_id == jobId && app.user_id == userData.id
        );
        
        if (existingApp) {
            throw new Error('Ya has aplicado a este empleo');
        }
        
        // Agregar aplicación
        data.applications.push({
            id: Date.now(),
            job_id: jobId,
            user_id: userData.id,
            status: 'applied',
            applied_date: new Date().toISOString()
        });
        
        // Guardar en localStorage como persistencia temporal
        localStorage.setItem('localApplications', JSON.stringify(data.applications));
        
        return { success: true, message: 'Aplicación enviada correctamente' };
    } catch (error) {
        console.error('Error al aplicar:', error);
        throw error;
    }
};

// Funciones de usuario
export const fetchUserProfile = async () => {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData.id) {
            throw new Error('Usuario no encontrado');
        }
        
        const data = await loadData();
        const user = data.users.find(u => u.id == userData.id);
        
        return user || userData;
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData.id) {
            throw new Error('Usuario no encontrado');
        }
        
        // Actualizar datos locales
        const updatedUser = { ...userData, ...profileData };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        return { success: true };
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        throw error;
    }
};

// Registrar usuario
export const registerUser = async (userData) => {
    try {
        const data = await loadData();
        
        // Verificar si el email ya existe
        const existingUser = data.users.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('Este correo ya está registrado');
        }
        
        // Crear nuevo usuario
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            role: userData.role || ROLES.USER,
            registrationDate: new Date().toISOString()
        };
        
        // Agregar a datos locales
        data.users.push(newUser);
        
        return newUser;
    } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
};

// API Request genérico (simplificado)
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        if (endpoint === '/jobs') return await fetchJobs();
        if (endpoint.startsWith('/jobs/')) {
            const jobId = endpoint.split('/')[2];
            return await fetchJobDetails(jobId);
        }
        
        // Para otros endpoints, devolver datos por defecto
        console.warn(`Endpoint no implementado: ${endpoint}`);
        return null;
    } catch (error) {
        console.error('Error en API request:', error);
        throw error;
    }
};

// Funciones de compatibilidad
export const fetchUsers = async () => {
    const data = await loadData();
    return data.users || [];
};

export const fetchJobApplications = async (jobId) => {
    const data = await loadData();
    return data.applications?.filter(app => app.job_id == jobId) || [];
};

export const updateApplicationStatus = async (applicationId, newStatus) => {
    // Simulado
    return { success: true };
};

export const getDepartmentJobs = async (department) => {
    const jobs = await fetchJobs();
    return jobs.filter(job => job.department === department);
};

export const getJobApplications = fetchJobApplications;
