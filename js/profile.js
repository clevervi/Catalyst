/**
 * Profile Management System for Catalyst HR System
 * Handles all profile CRUD operations and UI updates
 */

import { 
    getUserProfile, 
    updateUserProfile, 
    addExperience, 
    updateExperience,
    getUserExperiences,
    addEducation,
    getUserEducation,
    calculateProfileCompletion,
    getUser
} from './database.js';
import { getCurrentUser, ROLES } from './roles.js';

/**
 * Initialize profile page
 */
export function initProfilePage() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    loadUserProfile();
    initEventListeners();
    loadExperience();
    loadEducation();
    loadSkills();
    createProfileModals();
    
    console.log('Profile page initialized for user:', currentUser.name);
}

/**
 * Load user profile data into the UI
 */
function loadUserProfile() {
    const currentUser = getCurrentUser();
    let profile = getUserProfile(currentUser.id);
    
    if (!profile) {
        // Create profile if it doesn't exist
        profile = createUserProfile(currentUser.id);
    }
    
    // Update profile completion
    const completion = calculateProfileCompletion(profile);
    updateProfileCompletion(completion);
    
    // Load personal information
    loadPersonalInfo(profile);
    
    // Load professional information
    loadProfessionalInfo(profile);
    
    // Load role-specific sections
    loadRoleSpecificSections(profile, currentUser.role);
    
    console.log('Profile loaded successfully:', profile);
}

/**
 * Load personal information section
 */
function loadPersonalInfo(profile) {
    const currentUser = getCurrentUser();
    
    // Update profile header
    const profileName = document.getElementById('profile-name');
    const profileTitle = document.getElementById('profile-title');
    const profilePicture = document.getElementById('profile-picture');
    
    if (profileName) {
        profileName.textContent = `${profile.firstName || currentUser.name} ${profile.lastName || ''}`;
    }
    
    if (profileTitle) {
        profileTitle.textContent = profile.title || currentUser.role;
    }
    
    if (profilePicture && profile.profilePicture) {
        profilePicture.src = profile.profilePicture;
    }
    
    // Update personal info fields
    const fields = {
        'profile-email': profile.email || currentUser.email,
        'profile-phone': profile.phone || 'No especificado',
        'profile-location': profile.location || 'No especificado',
        'profile-birthdate': formatDate(profile.birthdate) || 'No especificado',
        'profile-gender': getGenderText(profile.gender) || 'No especificado'
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

/**
 * Load professional information section
 */
function loadProfessionalInfo(profile) {
    const bioElement = document.getElementById('profile-bio');
    if (bioElement) {
        bioElement.textContent = profile.bio || 'No hay descripción profesional';
    }
}

/**
 * Load role-specific sections based on user role
 */
function loadRoleSpecificSections(profile, userRole) {
    // Show/hide sections based on role
    const roleSpecificSections = {
        [ROLES.ADMIN]: ['admin-tools', 'system-settings'],
        [ROLES.RECRUITER]: ['recruitment-stats', 'candidate-management'],
        [ROLES.EMPLOYEE]: ['employee-benefits', 'time-tracking']
    };
    
    const sectionsToShow = roleSpecificSections[userRole] || [];
    
    sectionsToShow.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    });
    
    // Add role info badge
    displayRoleInfo();
}

/**
 * Load user experience data
 */
function loadExperience() {
    const currentUser = getCurrentUser();
    const experiences = getUserExperiences(currentUser.id);
    const container = document.getElementById('experience-container');
    
    if (!container) return;
    
    if (experiences && experiences.length > 0) {
        container.innerHTML = '';
        experiences.forEach(exp => {
            const expElement = createExperienceElement(exp);
            container.appendChild(expElement);
        });
    } else {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-briefcase fa-3x text-muted mb-3"></i>
                <p class="text-muted">No hay experiencia laboral registrada</p>
                <button class="btn btn-accent btn-sm" data-bs-toggle="modal" data-bs-target="#experienceModal">
                    <i class="fas fa-plus me-1"></i> Añadir experiencia
                </button>
            </div>
        `;
    }
}

/**
 * Load user education data
 */
function loadEducation() {
    const currentUser = getCurrentUser();
    const education = getUserEducation(currentUser.id);
    const container = document.getElementById('education-container');
    
    if (!container) return;
    
    if (education && education.length > 0) {
        container.innerHTML = '';
        education.forEach(edu => {
            const eduElement = createEducationElement(edu);
            container.appendChild(eduElement);
        });
    } else {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-graduation-cap fa-3x text-muted mb-3"></i>
                <p class="text-muted">No hay educación registrada</p>
                <button class="btn btn-accent btn-sm" data-bs-toggle="modal" data-bs-target="#educationModal">
                    <i class="fas fa-plus me-1"></i> Añadir educación
                </button>
            </div>
        `;
    }
}

/**
 * Load user skills data
 */
function loadSkills() {
    const currentUser = getCurrentUser();
    const profile = getUserProfile(currentUser.id);
    const container = document.getElementById('skills-container');
    
    if (!container) return;
    
    if (profile && profile.skills && profile.skills.length > 0) {
        container.innerHTML = '';
        profile.skills.forEach(skill => {
            const skillBadge = document.createElement('span');
            skillBadge.className = 'badge bg-primary me-1 mb-1';
            skillBadge.textContent = skill;
            container.appendChild(skillBadge);
        });
    } else {
        container.innerHTML = '<span class="text-muted">No hay habilidades añadidas</span>';
    }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Save profile button
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }
    
    // Add skill button
    const addSkillBtn = document.getElementById('addSkillBtn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', addSkill);
    }
    
    // Skills input enter key
    const skillInput = document.getElementById('skillInput');
    if (skillInput) {
        skillInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }
    
    // Change profile picture
    const changePictureBtn = document.getElementById('change-picture-btn');
    if (changePictureBtn) {
        changePictureBtn.addEventListener('click', changeProfilePicture);
    }
    
    // Form validation on input
    const inputs = document.querySelectorAll('#editProfileForm input, #editProfileForm select, #editProfileForm textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });
}

/**
 * Create profile modals if they don't exist
 */
function createProfileModals() {
    // This will be called to ensure modals exist in the DOM
    console.log('Profile modals initialized');
}

/**
 * Open edit profile modal with current data
 */
function openEditProfileModal() {
    const currentUser = getCurrentUser();
    const profile = getUserProfile(currentUser.id);
    
    if (profile) {
        // Populate form fields
        const fields = {
            'edit-first-name': profile.firstName || '',
            'edit-last-name': profile.lastName || '',
            'edit-email': profile.email || currentUser.email,
            'edit-phone': profile.phone || '',
            'edit-location': profile.location || '',
            'edit-birthdate': profile.birthdate || '',
            'edit-gender': profile.gender || '',
            'edit-title': profile.title || '',
            'edit-bio': profile.bio || ''
        };
        
        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    modal.show();
}

/**
 * Save experience data
 */
function saveExperience() {
    const currentUser = getCurrentUser();
    const formData = {
        position: document.getElementById('exp-position').value,
        company: document.getElementById('exp-company').value,
        location: document.getElementById('exp-location').value,
        startDate: document.getElementById('exp-start-date').value,
        endDate: document.getElementById('exp-end-date').value,
        current: document.getElementById('exp-current').checked,
        description: document.getElementById('exp-description').value
    };
    
    if (!formData.position || !formData.company) {
        showToast('Por favor completa los campos requeridos', 'error');
        return;
    }
    
    try {
        addExperience(currentUser.id, formData);
        loadExperience();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('experienceModal'));
        if (modal) modal.hide();
        
        showToast('Experiencia agregada correctamente');
    } catch (error) {
        console.error('Error saving experience:', error);
        showToast('Error al guardar la experiencia', 'error');
    }
}

/**
 * Save education data
 */
function saveEducation() {
    const currentUser = getCurrentUser();
    const formData = {
        degree: document.getElementById('edu-degree').value,
        institution: document.getElementById('edu-institution').value,
        location: document.getElementById('edu-location').value,
        startDate: document.getElementById('edu-start-date').value,
        endDate: document.getElementById('edu-end-date').value,
        description: document.getElementById('edu-description').value
    };
    
    if (!formData.degree || !formData.institution) {
        showToast('Por favor completa los campos requeridos', 'error');
        return;
    }
    
    try {
        addEducation(currentUser.id, formData);
        loadEducation();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('educationModal'));
        if (modal) modal.hide();
        
        showToast('Educación agregada correctamente');
    } catch (error) {
        console.error('Error saving education:', error);
        showToast('Error al guardar la educación', 'error');
    }
}

/**
 * Update profile completion percentage
 */
function updateProfileCompletion(percentage) {
    const progressBar = document.getElementById('profile-completion-bar');
    const progressText = document.getElementById('profile-completion-text');
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
    }
    
    if (progressText) {
        progressText.textContent = `${percentage}% completado`;
    }
}

/**
 * Create user profile if it doesn't exist
 */
function createUserProfile(userId) {
    const currentUser = getCurrentUser();
    
    const defaultProfile = {
        userId: userId,
        firstName: currentUser.name || '',
        lastName: '',
        email: currentUser.email || '',
        phone: '',
        location: '',
        birthdate: '',
        gender: '',
        title: '',
        bio: '',
        skills: [],
        profilePicture: null
    };
    
    updateUserProfile(userId, defaultProfile);
    return defaultProfile;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    // Create toast element if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = `toast-${Date.now()}`;
    const toastClass = type === 'error' ? 'text-bg-danger' : 'text-bg-success';
    
    const toastHTML = `
        <div id="${toastId}" class="toast ${toastClass}" role="alert">
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

/**
 * Save profile updates
 */
function saveProfile() {
    const currentUser = getCurrentUser();
    
    // Get form data using correct IDs from HTML
    const formData = {
        personalInfo: {
            firstName: document.getElementById('editFirstName')?.value || '',
            lastName: document.getElementById('editLastName')?.value || '',
            email: document.getElementById('editEmail')?.value || '',
            phone: document.getElementById('editPhone')?.value || '',
            location: document.getElementById('editLocation')?.value || '',
            birthdate: document.getElementById('editBirthdate')?.value || '',
            gender: document.getElementById('editGender')?.value || ''
        },
        professionalInfo: {
            title: document.getElementById('editTitle')?.value || '',
            summary: document.getElementById('editBio')?.value || ''
        }
    };
    
    // Validate required fields
    if (!formData.personalInfo.firstName || !formData.personalInfo.lastName) {
        showToast('Nombre y apellido son campos obligatorios', 'error');
        return;
    }
    
    if (formData.personalInfo.email && !isValidEmail(formData.personalInfo.email)) {
        showToast('Por favor ingresa un email válido', 'error');
        return;
    }
    
    try {
        updateUserProfile(currentUser.id, formData);
        
        // Update localStorage userData as well
        const updatedUserData = {
            ...currentUser,
            firstName: formData.personalInfo.firstName,
            lastName: formData.personalInfo.lastName,
            name: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
            email: formData.personalInfo.email
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        loadUserProfile(); // Reload profile data
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        if (modal) modal.hide();
        
        showToast('Perfil actualizado correctamente');
    } catch (error) {
        console.error('Error saving profile:', error);
        showToast('Error al guardar el perfil', 'error');
    }
}

/**
 * Validate form field
 */
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove previous validation states
    field.classList.remove('is-valid', 'is-invalid');
    
    // Email validation
    if (field.type === 'email' && value) {
        if (isValidEmail(value)) {
            field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
        }
    }
    
    // Required field validation
    if (field.hasAttribute('required')) {
        if (value) {
            field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
        }
    }
}

/**
 * Clear field validation
 */
function clearValidation(event) {
    const field = event.target;
    field.classList.remove('is-valid', 'is-invalid');
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Add new skill to profile
 */
function addSkill() {
    const skillInput = document.getElementById('skillInput');
    if (!skillInput) return;
    
    const skill = skillInput.value.trim();
    
    if (skill) {
        const currentUser = getCurrentUser();
        const profile = getUserProfile(currentUser.id);
        
        if (!profile.skills) profile.skills = [];
        
        if (!profile.skills.includes(skill)) {
            profile.skills.push(skill);
            updateUserProfile(currentUser.id, { skills: profile.skills });
            loadSkills(); // Reload skills display
            
            // Update skills in modal too
            const skillsList = document.getElementById('skills-list');
            if (skillsList) {
                const skillBadge = document.createElement('span');
                skillBadge.className = 'badge bg-primary me-1 mb-1';
                skillBadge.innerHTML = `${skill} <button type="button" class="btn-close btn-close-white ms-1" onclick="removeSkill('${skill}')"></button>`;
                skillsList.appendChild(skillBadge);
            }
            
            skillInput.value = '';
            showToast('Habilidad añadida correctamente');
        } else {
            showToast('Esta habilidad ya existe', 'error');
        }
    }
}

/**
 * Remove skill from profile
 */
function removeSkill(skill) {
    const currentUser = getCurrentUser();
    const profile = getUserProfile(currentUser.id);
    
    if (profile.skills) {
        profile.skills = profile.skills.filter(s => s !== skill);
        updateUserProfile(currentUser.id, { skills: profile.skills });
        loadSkills();
        
        // Update modal skills list
        updateModalSkillsList();
        
        showToast('Habilidad eliminada');
    }
}

/**
 * Update skills list in modal
 */
function updateModalSkillsList() {
    const currentUser = getCurrentUser();
    const profile = getUserProfile(currentUser.id);
    const skillsList = document.getElementById('skills-list');
    
    if (!skillsList) return;
    
    skillsList.innerHTML = '';
    
    if (profile && profile.skills) {
        profile.skills.forEach(skill => {
            const skillBadge = document.createElement('span');
            skillBadge.className = 'badge bg-primary me-1 mb-1';
            skillBadge.innerHTML = `${skill} <button type="button" class="btn-close btn-close-white ms-1" onclick="removeSkill('${skill}')"></button>`;
            skillsList.appendChild(skillBadge);
        });
    }
}

/**
 * Change profile picture
 */
function changeProfilePicture() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const profilePicture = document.getElementById('profile-picture');
                if (profilePicture) {
                    profilePicture.src = e.target.result;
                }
                
                // Save to profile
                const currentUser = getCurrentUser();
                const profile = getUserProfile(currentUser.id);
                profile.profilePicture = e.target.result;
                updateUserProfile(currentUser.id, profile);
                
                showToast('Foto de perfil actualizada');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

/**
 * Display role information badge
 */
function displayRoleInfo() {
    const currentUser = getCurrentUser();
    const roleInfo = document.getElementById('role-info');
    
    if (!roleInfo) return;
    
    let roleText = '';
    let roleClass = '';
    
    switch(currentUser.role) {
        case ROLES.ADMIN:
            roleText = 'Administrador';
            roleClass = 'bg-danger';
            break;
        case ROLES.RECRUITER:
            roleText = 'Reclutador';
            roleClass = 'bg-warning';
            break;
        case ROLES.EMPLOYEE:
            roleText = 'Empleado';
            roleClass = 'bg-info';
            break;
        default:
            roleText = 'Usuario';
            roleClass = 'bg-secondary';
    }
    
    roleInfo.innerHTML = `<span class="badge ${roleClass}">${roleText}</span>`;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Get gender text for display
 */
function getGenderText(gender) {
    const genders = {
        'male': 'Masculino',
        'female': 'Femenino',
        'other': 'Otro',
        'prefer_not_to_say': 'Prefiero no decir'
    };
    return genders[gender] || 'No especificado';
}

/**
 * Create experience element for display
 */
function createExperienceElement(exp) {
    const element = document.createElement('div');
    element.className = 'experience-item mb-4 p-3 border rounded';
    
    const dateText = exp.current 
        ? `${formatDate(exp.startDate)} - Presente` 
        : `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`;
    
    element.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div>
                <h6 class="mb-1">${exp.position}</h6>
                <p class="text-muted mb-1">${exp.company}</p>
                <p class="text-muted small mb-2">${dateText} • ${exp.location}</p>
                <p class="mb-0">${exp.description}</p>
            </div>
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#" onclick="editExperience('${exp.id}')"><i class="fas fa-edit me-2"></i> Editar</a></li>
                    <li><a class="dropdown-item" href="#" onclick="deleteExperience('${exp.id}')"><i class="fas fa-trash me-2"></i> Eliminar</a></li>
                </ul>
            </div>
        </div>
    `;
    
    return element;
}

/**
 * Create education element for display
 */
function createEducationElement(edu) {
    const element = document.createElement('div');
    element.className = 'education-item mb-4 p-3 border rounded';
    
    element.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div>
                <h6 class="mb-1">${edu.degree}</h6>
                <p class="text-muted mb-1">${edu.institution}</p>
                <p class="text-muted small mb-2">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)} • ${edu.location}</p>
                ${edu.description ? `<p class="mb-0">${edu.description}</p>` : ''}
            </div>
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#" onclick="editEducation('${edu.id}')"><i class="fas fa-edit me-2"></i> Editar</a></li>
                    <li><a class="dropdown-item" href="#" onclick="deleteEducation('${edu.id}')"><i class="fas fa-trash me-2"></i> Eliminar</a></li>
                </ul>
            </div>
        </div>
    `;
    
    return element;
}

/**
 * Create document element for display
 */
function createDocumentElement(doc) {
    const element = document.createElement('div');
    element.className = 'document-item mb-3';
    
    const fileIcon = getFileIcon(doc.type);
    
    element.innerHTML = `
        <div class="d-flex justify-content-between align-items-center bg-light p-3 rounded">
            <div class="d-flex align-items-center">
                <i class="${fileIcon} me-2"></i>
                <div>
                    <span class="fw-medium">${doc.name}</span>
                    <small class="text-muted d-block">${doc.size || 'Tamaño desconocido'}</small>
                </div>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="downloadDocument('${doc.id}')">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteDocument('${doc.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return element;
}

/**
 * Get appropriate file icon based on file type
 */
function getFileIcon(fileType) {
    const iconMap = {
        'pdf': 'fas fa-file-pdf text-danger',
        'doc': 'fas fa-file-word text-primary',
        'docx': 'fas fa-file-word text-primary',
        'xls': 'fas fa-file-excel text-success',
        'xlsx': 'fas fa-file-excel text-success',
        'jpg': 'fas fa-file-image text-warning',
        'jpeg': 'fas fa-file-image text-warning',
        'png': 'fas fa-file-image text-warning',
        'gif': 'fas fa-file-image text-warning'
    };
    
    return iconMap[fileType?.toLowerCase()] || 'fas fa-file text-secondary';
}

// Make functions available globally for event handlers
window.profileModule = {
    initProfilePage,
    loadUserProfile,
    saveProfile,
    addSkill,
    changeProfilePicture,
    saveExperience,
    saveEducation
};

// Export functions that might be called from HTML
window.editExperience = (id) => console.log('Edit experience:', id);
window.deleteExperience = (id) => console.log('Delete experience:', id);
window.editEducation = (id) => console.log('Edit education:', id);
window.deleteEducation = (id) => console.log('Delete education:', id);
window.downloadDocument = (id) => console.log('Download document:', id);
window.deleteDocument = (id) => console.log('Delete document:', id);

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initProfilePage);
