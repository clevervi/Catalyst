/**
 * Database Simulation System for Catalyst HR System
 * Uses localStorage to simulate a persistent database
 */

import { ROLES, DEPARTMENTS } from './roles.js';

// Database keys
export const DB_KEYS = {
    USERS: 'catalyst_users',
    PROFILES: 'catalyst_profiles', 
    EXPERIENCES: 'catalyst_experiences',
    EDUCATION: 'catalyst_education',
    SKILLS: 'catalyst_skills',
    APPLICATIONS: 'catalyst_applications',
    JOBS: 'catalyst_jobs',
    COURSES: 'catalyst_courses',
    COMPANIES: 'catalyst_companies',
    SETTINGS: 'catalyst_settings'
};

/**
 * Database initialization with default data
 */
export function initDatabase() {
    // Initialize empty collections if they don't exist
    Object.values(DB_KEYS).forEach(key => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify({}));
        }
    });
    
    // Initialize default demo users if they don't exist
    const users = getCollection(DB_KEYS.USERS);
    if (Object.keys(users).length === 0) {
        createDefaultUsers();
    }
    
    console.log('Database initialized successfully');
    console.log('Available users:', Object.keys(users).length);
    console.log('User emails:', Object.values(users).map(u => u.email));
}

/**
 * Reset database (for development/testing)
 */
export function resetDatabase() {
    Object.values(DB_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    initDatabase();
    console.log('Database reset complete');
}

/**
 * Get a collection from localStorage
 */
export function getCollection(collectionKey) {
    try {
        return JSON.parse(localStorage.getItem(collectionKey) || '{}');
    } catch (error) {
        console.error(`Error getting collection ${collectionKey}:`, error);
        return {};
    }
}

/**
 * Set a collection in localStorage
 */
export function setCollection(collectionKey, data) {
    try {
        localStorage.setItem(collectionKey, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error setting collection ${collectionKey}:`, error);
        return false;
    }
}

/**
 * Generate unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create or update a user profile
 */
export function createUserProfile(userId, profileData) {
    const profiles = getCollection(DB_KEYS.PROFILES);
    
    // Default profile structure
    const defaultProfile = {
        id: userId,
        personalInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            location: '',
            birthdate: '',
            gender: '',
            photo: '../img/ft carlos.jpeg'
        },
        professionalInfo: {
            title: '',
            summary: '',
            currentCompany: '',
            yearsExperience: 0,
            salary: {
                current: 0,
                desired: 0
            }
        },
        skills: [],
        languages: [],
        certifications: [],
        preferences: {
            jobType: [], // 'remote', 'hybrid', 'onsite'
            locations: [],
            salaryRange: { min: 0, max: 0 },
            workSchedule: '', // 'full-time', 'part-time', 'contract'
            notifications: {
                emailJobs: true,
                emailNews: true,
                smsAlerts: false
            }
        },
        roleSpecific: {},
        privacy: {
            profileVisibility: 'public', // 'public', 'registered', 'private'
            contactVisibility: 'registered'
        },
        metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profileCompletion: 0
        }
    };
    
    // Merge with existing data if available
    const existingProfile = profiles[userId] || {};
    const updatedProfile = deepMerge(defaultProfile, existingProfile, profileData || {});
    
    profiles[userId] = updatedProfile;
    setCollection(DB_KEYS.PROFILES, profiles);
    
    return updatedProfile;
}

/**
 * Get user profile by ID
 */
export function getUserProfile(userId) {
    const profiles = getCollection(DB_KEYS.PROFILES);
    return profiles[userId] || null;
}

/**
 * Update user profile
 */
export function updateUserProfile(userId, updates) {
    const profiles = getCollection(DB_KEYS.PROFILES);
    
    if (!profiles[userId]) {
        // Create profile if it doesn't exist
        return createUserProfile(userId, updates);
    }
    
    // Update metadata
    updates.metadata = {
        ...profiles[userId].metadata,
        updatedAt: new Date().toISOString()
    };
    
    profiles[userId] = deepMerge(profiles[userId], updates);
    setCollection(DB_KEYS.PROFILES, profiles);
    
    return profiles[userId];
}

/**
 * Add work experience
 */
export function addExperience(userId, experienceData) {
    const experiences = getCollection(DB_KEYS.EXPERIENCES);
    
    if (!experiences[userId]) {
        experiences[userId] = [];
    }
    
    const newExperience = {
        id: generateId(),
        ...experienceData,
        createdAt: new Date().toISOString()
    };
    
    experiences[userId].push(newExperience);
    setCollection(DB_KEYS.EXPERIENCES, experiences);
    
    return newExperience;
}

/**
 * Update work experience
 */
export function updateExperience(userId, experienceId, updates) {
    const experiences = getCollection(DB_KEYS.EXPERIENCES);
    
    if (!experiences[userId]) {
        return null;
    }
    
    const index = experiences[userId].findIndex(exp => exp.id === experienceId);
    if (index === -1) {
        return null;
    }
    
    experiences[userId][index] = { ...experiences[userId][index], ...updates };
    setCollection(DB_KEYS.EXPERIENCES, experiences);
    
    return experiences[userId][index];
}

/**
 * Get user experiences
 */
export function getUserExperiences(userId) {
    const experiences = getCollection(DB_KEYS.EXPERIENCES);
    return experiences[userId] || [];
}

/**
 * Add education
 */
export function addEducation(userId, educationData) {
    const education = getCollection(DB_KEYS.EDUCATION);
    
    if (!education[userId]) {
        education[userId] = [];
    }
    
    const newEducation = {
        id: generateId(),
        ...educationData,
        createdAt: new Date().toISOString()
    };
    
    education[userId].push(newEducation);
    setCollection(DB_KEYS.EDUCATION, education);
    
    return newEducation;
}

/**
 * Get user education
 */
export function getUserEducation(userId) {
    const education = getCollection(DB_KEYS.EDUCATION);
    return education[userId] || [];
}

/**
 * Add or update user skills
 */
export function updateUserSkills(userId, skills) {
    const skillsData = getCollection(DB_KEYS.SKILLS);
    
    skillsData[userId] = {
        skills: skills,
        updatedAt: new Date().toISOString()
    };
    
    setCollection(DB_KEYS.SKILLS, skillsData);
    return skillsData[userId];
}

/**
 * Get user skills
 */
export function getUserSkills(userId) {
    const skillsData = getCollection(DB_KEYS.SKILLS);
    return skillsData[userId]?.skills || [];
}

/**
 * Create default demo users
 */
function createDefaultUsers() {
    const users = {};
    const profiles = {};
    
    // Demo users with different roles - matching auth.js credentials exactly
    const defaultUsers = [
        {
            id: 'admin_user',
            email: 'admin@catalyst.com',
            password: 'demo123',
            name: 'Admin Sistema',
            firstName: 'Admin',
            lastName: 'Sistema',
            role: ROLES.ADMIN,
            department: DEPARTMENTS.MANAGEMENT
        },
        {
            id: 'hr_user',
            email: 'th@catalyst.com',
            password: 'demo123',
            name: 'Recursos Humanos',
            firstName: 'Recursos',
            lastName: 'Humanos',
            role: ROLES.RECRUITER,
            department: DEPARTMENTS.HR
        },
        {
            id: 'hiring_user',
            email: 'hiring@catalyst.com',
            password: 'demo123',
            name: 'Hiring Manager',
            firstName: 'Hiring',
            lastName: 'Manager',
            role: ROLES.HIRING_MANAGER,
            department: DEPARTMENTS.TECHNOLOGY
        },
        {
            id: 'manager_user',
            email: 'manager@catalyst.com',
            password: 'demo123',
            name: 'Gerente General',
            firstName: 'Gerente',
            lastName: 'General',
            role: ROLES.MANAGER,
            department: DEPARTMENTS.MANAGEMENT
        },
        {
            id: 'bank_user',
            email: 'banco@catalyst.com',
            password: 'demo123',
            name: 'Representante Bancario',
            firstName: 'Representante',
            lastName: 'Bancario',
            role: ROLES.BANK_REPRESENTATIVE,
            department: DEPARTMENTS.BANKING
        },
        {
            id: 'demo_user',
            email: 'demo@catalyst.com',
            password: 'demo123',
            name: 'Usuario Demo',
            firstName: 'Usuario',
            lastName: 'Demo',
            role: ROLES.USER,
            department: DEPARTMENTS.TECHNOLOGY
        }
    ];
    
    // Create users and their profiles
    defaultUsers.forEach(userData => {
        users[userData.id] = {
            ...userData,
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        // Create initial profile for each user
        profiles[userData.id] = createInitialProfileForRole(userData.id, userData.role, userData);
    });
    
    setCollection(DB_KEYS.USERS, users);
    setCollection(DB_KEYS.PROFILES, profiles);
}

/**
 * Create initial profile based on role
 */
function createInitialProfileForRole(userId, role, userData) {
    const baseProfile = {
        id: userId,
        personalInfo: {
            firstName: userData.name.split(' ')[0] || '',
            lastName: userData.name.split(' ').slice(1).join(' ') || '',
            email: userData.email,
            phone: '',
            location: '',
            birthdate: '',
            gender: '',
            photo: '../img/ft carlos.jpeg'
        },
        professionalInfo: {
            title: getRoleDefaultTitle(role),
            summary: '',
            currentCompany: role === ROLES.CANDIDATE ? '' : 'Catalyst HR System',
            yearsExperience: 0,
            salary: { current: 0, desired: 0 }
        },
        skills: getRoleDefaultSkills(role),
        languages: [{ language: 'Español', level: 'Nativo' }],
        certifications: [],
        preferences: {
            jobType: ['remote', 'hybrid'],
            locations: ['Bogotá', 'Colombia'],
            salaryRange: { min: 2000000, max: 8000000 },
            workSchedule: 'full-time',
            notifications: {
                emailJobs: true,
                emailNews: true,
                smsAlerts: false
            }
        },
        roleSpecific: getRoleSpecificFields(role),
        privacy: {
            profileVisibility: role === ROLES.USER ? 'public' : 'registered',
            contactVisibility: 'registered'
        },
        metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profileCompletion: role === ROLES.USER ? 20 : 60
        }
    };
    
    return baseProfile;
}

/**
 * Get default title for role
 */
function getRoleDefaultTitle(role) {
    const titles = {
        [ROLES.ADMIN]: 'Administrador del Sistema',
        [ROLES.RECRUITER]: 'Especialista en Recursos Humanos',
        [ROLES.HIRING_MANAGER]: 'Gerente de Contratación',
        [ROLES.MANAGER]: 'Gerente de Departamento',
        [ROLES.BANK_REPRESENTATIVE]: 'Representante Bancario',
        [ROLES.USER]: 'Usuario',
        [ROLES.CANDIDATE]: 'Candidato'
    };
    return titles[role] || '';
}

/**
 * Get default skills for role
 */
function getRoleDefaultSkills(role) {
    const skills = {
        [ROLES.ADMIN]: ['Administración de Sistemas', 'Gestión de Usuarios', 'Seguridad'],
        [ROLES.RECRUITER]: ['Reclutamiento', 'Selección de Personal', 'Entrevistas', 'RRHH'],
        [ROLES.HIRING_MANAGER]: ['Gestión de Equipos', 'Entrevistas Técnicas', 'Liderazgo'],
        [ROLES.MANAGER]: ['Liderazgo', 'Gestión de Proyectos', 'Toma de Decisiones'],
        [ROLES.BANK_REPRESENTATIVE]: ['Servicios Bancarios', 'Atención al Cliente', 'Finanzas'],
        [ROLES.USER]: ['Informática', 'Comunicación', 'Trabajo en equipo'],
        [ROLES.CANDIDATE]: []
    };
    return skills[role] || [];
}

/**
 * Get role-specific fields
 */
function getRoleSpecificFields(role) {
    const fields = {
        [ROLES.ADMIN]: {
            systemPermissions: ['user_management', 'system_config', 'reports'],
            adminLevel: 'super_admin'
        },
        [ROLES.RECRUITER]: {
            specializations: ['tech_recruitment'],
            activeJobs: [],
            candidatesManaged: 0
        },
        [ROLES.HIRING_MANAGER]: {
            department: DEPARTMENTS.TECHNOLOGY,
            teamSize: 0,
            openPositions: []
        },
        [ROLES.MANAGER]: {
            department: '',
            teamSize: 0,
            budget: 0
        },
        [ROLES.BANK_REPRESENTATIVE]: {
            bankName: '',
            services: [],
            clientPortfolio: 0
        },
        [ROLES.USER]: {
            preferences: {
                jobAlerts: true,
                profileVisibility: 'public'
            }
        },
        [ROLES.CANDIDATE]: {
            applicationStatus: 'active',
            appliedJobs: [],
            interviewHistory: []
        }
    };
    return fields[role] || {};
}

/**
 * Deep merge objects
 */
function deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * User Management Functions
 */

/**
 * Create new user with profile
 */
export function createUser(userData) {
    const users = getCollection(DB_KEYS.USERS);
    const userId = generateId();
    
    // Check if email already exists
    const existingUser = Object.values(users).find(user => user.email === userData.email);
    if (existingUser) {
        throw new Error('Email already exists');
    }
    
    const newUser = {
        id: userId,
        email: userData.email,
        password: userData.password, // In real app, hash this
        name: `${userData.firstName} ${userData.lastName}`,
        role: userData.role || ROLES.USER,
        department: userData.department || '',
        isActive: true,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
    users[userId] = newUser;
    setCollection(DB_KEYS.USERS, users);
    
    // Create initial profile
    const profile = createUserProfile(userId, {
        personalInfo: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        }
    });
    
    return { user: newUser, profile };
}

/**
 * Authenticate user
 */
export function authenticateUser(email, password) {
    const users = getCollection(DB_KEYS.USERS);
    
    console.log(`🔍 Attempting authentication for: ${email}`);
    console.log(`🔍 Available users:`, Object.values(users).map(u => ({ email: u.email, role: u.role, active: u.isActive })));
    
    const user = Object.values(users).find(u => 
        u.email === email && u.password === password && u.isActive
    );
    
    if (!user) {
        console.log(`❌ Authentication failed for: ${email}`);
        // Check if email exists but wrong password
        const emailExists = Object.values(users).find(u => u.email === email);
        if (emailExists) {
            console.log(`🔴 Email found but password mismatch or user inactive`);
            console.log(`🔴 User status:`, { active: emailExists.isActive, role: emailExists.role });
        } else {
            console.log(`🔴 Email not found in database`);
        }
        return null;
    }
    
    console.log(`✅ Authentication successful for: ${email} (${user.role})`);
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    users[user.id] = user;
    setCollection(DB_KEYS.USERS, users);
    
    return user;
}

/**
 * Get user by ID
 */
export function getUser(userId) {
    const users = getCollection(DB_KEYS.USERS);
    return users[userId] || null;
}

/**
 * Update user basic info
 */
export function updateUser(userId, updates) {
    const users = getCollection(DB_KEYS.USERS);
    
    if (!users[userId]) {
        return null;
    }
    
    users[userId] = { ...users[userId], ...updates };
    setCollection(DB_KEYS.USERS, users);
    
    return users[userId];
}

/**
 * Profile Management Functions
 */

/**
 * Calculate profile completion percentage
 */
export function calculateProfileCompletion(profile) {
    let completed = 0;
    const total = 10;
    
    // Personal info (4 points)
    if (profile.personalInfo.firstName) completed++;
    if (profile.personalInfo.lastName) completed++;
    if (profile.personalInfo.phone) completed++;
    if (profile.personalInfo.location) completed++;
    
    // Professional info (3 points)
    if (profile.professionalInfo.title) completed++;
    if (profile.professionalInfo.summary) completed++;
    if (profile.professionalInfo.yearsExperience > 0) completed++;
    
    // Skills and additional (3 points)
    if (profile.skills.length > 0) completed++;
    if (profile.languages.length > 1) completed++; // More than just Spanish
    if (profile.preferences.salaryRange.min > 0) completed++;
    
    return Math.round((completed / total) * 100);
}

/**
 * Search profiles by criteria
 */
export function searchProfiles(criteria) {
    const profiles = getCollection(DB_KEYS.PROFILES);
    const users = getCollection(DB_KEYS.USERS);
    
    let results = Object.values(profiles);
    
    // Filter by search term
    if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase();
        results = results.filter(profile => 
            profile.personalInfo.firstName.toLowerCase().includes(term) ||
            profile.personalInfo.lastName.toLowerCase().includes(term) ||
            profile.professionalInfo.title.toLowerCase().includes(term) ||
            profile.skills.some(skill => skill.toLowerCase().includes(term))
        );
    }
    
    // Filter by role
    if (criteria.role) {
        results = results.filter(profile => {
            const user = users[profile.id];
            return user && user.role === criteria.role;
        });
    }
    
    // Filter by department
    if (criteria.department) {
        results = results.filter(profile => {
            const user = users[profile.id];
            return user && user.department === criteria.department;
        });
    }
    
    // Filter by experience level
    if (criteria.experienceLevel) {
        results = results.filter(profile => {
            const years = profile.professionalInfo.yearsExperience;
            switch (criteria.experienceLevel) {
                case 'junior': return years <= 2;
                case 'semi-senior': return years > 2 && years <= 5;
                case 'senior': return years > 5;
                default: return true;
            }
        });
    }
    
    // Filter by skills
    if (criteria.skills && criteria.skills.length > 0) {
        results = results.filter(profile => 
            criteria.skills.some(skill => 
                profile.skills.some(userSkill => 
                    userSkill.toLowerCase().includes(skill.toLowerCase())
                )
            )
        );
    }
    
    return results.map(profile => ({
        ...profile,
        user: users[profile.id]
    }));
}

/**
 * Get profile statistics
 */
export function getProfileStatistics() {
    const profiles = getCollection(DB_KEYS.PROFILES);
    const users = getCollection(DB_KEYS.USERS);
    
    const stats = {
        totalProfiles: Object.keys(profiles).length,
        roleDistribution: {},
        departmentDistribution: {},
        averageCompletion: 0,
        activeUsers: 0
    };
    
    let totalCompletion = 0;
    
    Object.values(profiles).forEach(profile => {
        const user = users[profile.id];
        if (!user) return;
        
        // Role distribution
        stats.roleDistribution[user.role] = (stats.roleDistribution[user.role] || 0) + 1;
        
        // Department distribution
        if (user.department) {
            stats.departmentDistribution[user.department] = (stats.departmentDistribution[user.department] || 0) + 1;
        }
        
        // Profile completion
        const completion = calculateProfileCompletion(profile);
        totalCompletion += completion;
        profile.metadata.profileCompletion = completion;
        
        // Active users
        if (user.isActive) {
            stats.activeUsers++;
        }
    });
    
    stats.averageCompletion = Math.round(totalCompletion / Object.keys(profiles).length);
    
    // Update profiles with new completion percentages
    setCollection(DB_KEYS.PROFILES, profiles);
    
    return stats;
}

/**
 * Export user data (GDPR compliance)
 */
export function exportUserData(userId) {
    const user = getUser(userId);
    const profile = getUserProfile(userId);
    const experiences = getUserExperiences(userId);
    const education = getUserEducation(userId);
    const skills = getUserSkills(userId);
    
    return {
        user,
        profile,
        experiences,
        education,
        skills,
        exportDate: new Date().toISOString()
    };
}

/**
 * Delete user account and all related data
 */
export function deleteUserAccount(userId) {
    // Get all collections
    const users = getCollection(DB_KEYS.USERS);
    const profiles = getCollection(DB_KEYS.PROFILES);
    const experiences = getCollection(DB_KEYS.EXPERIENCES);
    const education = getCollection(DB_KEYS.EDUCATION);
    const skills = getCollection(DB_KEYS.SKILLS);
    const applications = getCollection(DB_KEYS.APPLICATIONS);
    
    // Delete user data from all collections
    delete users[userId];
    delete profiles[userId];
    delete experiences[userId];
    delete education[userId];
    delete skills[userId];
    delete applications[userId];
    
    // Save all collections
    setCollection(DB_KEYS.USERS, users);
    setCollection(DB_KEYS.PROFILES, profiles);
    setCollection(DB_KEYS.EXPERIENCES, experiences);
    setCollection(DB_KEYS.EDUCATION, education);
    setCollection(DB_KEYS.SKILLS, skills);
    setCollection(DB_KEYS.APPLICATIONS, applications);
    
    return true;
}

// Initialize database on module load
initDatabase();
