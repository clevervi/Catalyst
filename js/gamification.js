/**
 * Gamification System for Catalyst HR
 * Adds engaging elements like achievements, skill progress, career milestones, and rewards
 */

class GamificationEngine {
    constructor() {
        this.userProgress = this.loadUserProgress();
        this.achievements = this.initializeAchievements();
        this.skillTree = this.initializeSkillTree();
        this.badges = this.initializeBadges();
        this.init();
    }

    init() {
        this.updateProgressDisplay();
        this.checkForNewAchievements();
        this.initializeNotifications();
    }

    loadUserProgress() {
        try {
            const savedProgress = localStorage.getItem('catalystUserProgress');
            return savedProgress ? JSON.parse(savedProgress) : this.getDefaultProgress();
        } catch (error) {
            console.warn('Error loading user progress:', error);
            return this.getDefaultProgress();
        }
    }

    getDefaultProgress() {
        return {
            level: 1,
            xp: 0,
            xpToNextLevel: 1000,
            profileCompleteness: 20,
            applicationsSubmitted: 0,
            skillsLearned: 0,
            coursesCompleted: 0,
            connectionsMade: 0,
            interviewsCompleted: 0,
            jobsViewed: 0,
            streakDays: 0,
            lastActivityDate: new Date().toDateString(),
            achievements: [],
            badges: [],
            milestones: {},
            preferences: {
                notifications: true,
                achievements: true,
                publicProfile: false
            }
        };
    }

    initializeAchievements() {
        return {
            // Profile & Setup Achievements
            'profile-starter': {
                id: 'profile-starter',
                name: 'Primer Paso',
                description: 'Completa tu perfil básico',
                icon: '👤',
                xp: 100,
                condition: (progress) => progress.profileCompleteness >= 50,
                unlocked: false
            },
            'profile-master': {
                id: 'profile-master',
                name: 'Perfil Completo',
                description: 'Completa tu perfil al 100%',
                icon: '🌟',
                xp: 300,
                condition: (progress) => progress.profileCompleteness >= 100,
                unlocked: false
            },

            // Application Achievements
            'first-application': {
                id: 'first-application',
                name: 'Primera Aplicación',
                description: 'Aplica a tu primer empleo',
                icon: '📝',
                xp: 200,
                condition: (progress) => progress.applicationsSubmitted >= 1,
                unlocked: false
            },
            'application-warrior': {
                id: 'application-warrior',
                name: 'Guerrero de Aplicaciones',
                description: 'Aplica a 10 empleos',
                icon: '⚔️',
                xp: 500,
                condition: (progress) => progress.applicationsSubmitted >= 10,
                unlocked: false
            },
            'application-master': {
                id: 'application-master',
                name: 'Maestro de Aplicaciones',
                description: 'Aplica a 50 empleos',
                icon: '🏆',
                xp: 1000,
                condition: (progress) => progress.applicationsSubmitted >= 50,
                unlocked: false
            },

            // Learning Achievements
            'skill-seeker': {
                id: 'skill-seeker',
                name: 'Buscador de Habilidades',
                description: 'Aprende 3 habilidades nuevas',
                icon: '🎯',
                xp: 300,
                condition: (progress) => progress.skillsLearned >= 3,
                unlocked: false
            },
            'knowledge-collector': {
                id: 'knowledge-collector',
                name: 'Coleccionista de Conocimiento',
                description: 'Completa 5 cursos',
                icon: '📚',
                xp: 400,
                condition: (progress) => progress.coursesCompleted >= 5,
                unlocked: false
            },
            'lifelong-learner': {
                id: 'lifelong-learner',
                name: 'Aprendiz de por Vida',
                description: 'Completa 20 cursos',
                icon: '🎓',
                xp: 800,
                condition: (progress) => progress.coursesCompleted >= 20,
                unlocked: false
            },

            // Networking Achievements
'network-starter': {
                id: 'network-starter',
                name: 'Primer Contacto',
                description: 'Haz tu primera conexión profesional',
                icon: '🤝',
                xp: 150,
                condition: (progress) => progress.connectionsMade >= 1,
                unlocked: false
            },
            'social-butterfly': {
                id: 'social-butterfly',
                name: 'Mariposa Social',
                description: 'Conecta con 25 profesionales',
                icon: '🦋',
                xp: 600,
                condition: (progress) => progress.connectionsMade >= 25,
                unlocked: false
            },

            // Engagement Achievements
            'explorer': {
                id: 'explorer',
                name: 'Explorador',
                description: 'Visualiza 50 ofertas de trabajo',
                icon: '🔍',
                xp: 200,
                condition: (progress) => progress.jobsViewed >= 50,
                unlocked: false
            },
            'consistency-champion': {
                id: 'consistency-champion',
                name: 'Campeón de Constancia',
                description: 'Mantén una racha de 7 días activos',
                icon: '🔥',
                xp: 400,
                condition: (progress) => progress.streakDays >= 7,
                unlocked: false
            },
            'dedication-master': {
                id: 'dedication-master',
                name: 'Maestro de la Dedicación',
                description: 'Mantén una racha de 30 días activos',
                icon: '💎',
                xp: 1000,
                condition: (progress) => progress.streakDays >= 30,
                unlocked: false
            },

            // Interview Achievements
            'interview-ready': {
                id: 'interview-ready',
                name: 'Listo para Entrevista',
                description: 'Completa tu primera entrevista',
                icon: '💼',
                xp: 500,
                condition: (progress) => progress.interviewsCompleted >= 1,
                unlocked: false
            },
            'interview-pro': {
                id: 'interview-pro',
                name: 'Pro de Entrevistas',
                description: 'Completa 5 entrevistas',
                icon: '👑',
                xp: 800,
                condition: (progress) => progress.interviewsCompleted >= 5,
                unlocked: false
            }
        };
    }

    initializeSkillTree() {
        return {
            'frontend': {
                name: 'Desarrollo Frontend',
                icon: '🎨',
                skills: {
                    'html-css': { name: 'HTML/CSS', level: 0, maxLevel: 5, xp: 0, xpRequired: 100 },
                    'javascript': { name: 'JavaScript', level: 0, maxLevel: 5, xp: 0, xpRequired: 150 },
                    'react': { name: 'React', level: 0, maxLevel: 5, xp: 0, xpRequired: 200, prereq: ['javascript'] },
                    'vue': { name: 'Vue.js', level: 0, maxLevel: 5, xp: 0, xpRequired: 200, prereq: ['javascript'] },
                    'typescript': { name: 'TypeScript', level: 0, maxLevel: 5, xp: 0, xpRequired: 250, prereq: ['javascript'] }
                }
            },
            'backend': {
                name: 'Desarrollo Backend',
                icon: '⚙️',
                skills: {
                    'nodejs': { name: 'Node.js', level: 0, maxLevel: 5, xp: 0, xpRequired: 200 },
                    'python': { name: 'Python', level: 0, maxLevel: 5, xp: 0, xpRequired: 180 },
                    'java': { name: 'Java', level: 0, maxLevel: 5, xp: 0, xpRequired: 220 },
                    'apis': { name: 'APIs REST', level: 0, maxLevel: 5, xp: 0, xpRequired: 150 },
                    'databases': { name: 'Bases de Datos', level: 0, maxLevel: 5, xp: 0, xpRequired: 200 }
                }
            },
            'data': {
                name: 'Ciencia de Datos',
                icon: '📊',
                skills: {
                    'sql': { name: 'SQL', level: 0, maxLevel: 5, xp: 0, xpRequired: 120 },
                    'python-data': { name: 'Python para Datos', level: 0, maxLevel: 5, xp: 0, xpRequired: 200 },
                    'machine-learning': { name: 'Machine Learning', level: 0, maxLevel: 5, xp: 0, xpRequired: 300, prereq: ['python-data'] },
                    'statistics': { name: 'Estadística', level: 0, maxLevel: 5, xp: 0, xpRequired: 180 },
                    'visualization': { name: 'Visualización', level: 0, maxLevel: 5, xp: 0, xpRequired: 150 }
                }
            },
            'soft-skills': {
                name: 'Habilidades Blandas',
                icon: '🧠',
                skills: {
                    'communication': { name: 'Comunicación', level: 0, maxLevel: 5, xp: 0, xpRequired: 100 },
                    'leadership': { name: 'Liderazgo', level: 0, maxLevel: 5, xp: 0, xpRequired: 200 },
                    'teamwork': { name: 'Trabajo en Equipo', level: 0, maxLevel: 5, xp: 0, xpRequired: 150 },
                    'problem-solving': { name: 'Resolución de Problemas', level: 0, maxLevel: 5, xp: 0, xpRequired: 180 },
                    'time-management': { name: 'Gestión del Tiempo', level: 0, maxLevel: 5, xp: 0, xpRequired: 120 }
                }
            }
        };
    }

    initializeBadges() {
        return {
            'early-adopter': { name: 'Adoptador Temprano', icon: '🚀', description: 'Uno de los primeros en usar Catalyst' },
            'mentor': { name: 'Mentor', icon: '👨‍🏫', description: 'Ayuda a otros usuarios' },
            'top-performer': { name: 'Alto Rendimiento', icon: '⭐', description: 'Consistentemente en el top 10%' },
            'innovator': { name: 'Innovador', icon: '💡', description: 'Sugiere mejoras implementadas' },
            'community-champion': { name: 'Campeón de la Comunidad', icon: '🏅', description: 'Activo en la comunidad' },
            'skill-expert': { name: 'Experto en Habilidades', icon: '🎯', description: 'Domina múltiples skill trees' },
            'interview-ace': { name: 'As de Entrevistas', icon: '💫', description: 'Excelente en entrevistas' },
            'career-climber': { name: 'Escalador de Carrera', icon: '🧗‍♂️', description: 'Progreso constante en carrera' }
        };
    }

    // XP and Level Management
    addXP(amount, source = 'general') {
        const oldLevel = this.userProgress.level;
        this.userProgress.xp += amount;

        // Check for level up
        while (this.userProgress.xp >= this.userProgress.xpToNextLevel) {
            this.levelUp();
        }

        // Update activity streak
        this.updateActivityStreak();

        // Save progress
        this.saveProgress();

        // Show notification
        this.showXPNotification(amount, source);

        // Check for new achievements
        this.checkForNewAchievements();

        // Show level up notification if leveled up
        if (this.userProgress.level > oldLevel) {
            this.showLevelUpNotification();
        }

        return this.userProgress.level > oldLevel;
    }

    levelUp() {
        this.userProgress.xp -= this.userProgress.xpToNextLevel;
        this.userProgress.level += 1;
        this.userProgress.xpToNextLevel = this.calculateXPForNextLevel();
        
        // Award bonus XP for level up
        const levelUpBonus = this.userProgress.level * 50;
        this.userProgress.xp += levelUpBonus;
    }

    calculateXPForNextLevel() {
        // Exponential curve: each level requires more XP
        return Math.floor(1000 * Math.pow(1.2, this.userProgress.level - 1));
    }

    updateActivityStreak() {
        const today = new Date().toDateString();
        const lastActivity = this.userProgress.lastActivityDate;
        
        if (lastActivity === today) {
            return; // Already counted today
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity === yesterday.toDateString()) {
            // Continue streak
            this.userProgress.streakDays += 1;
        } else {
            // Reset streak
            this.userProgress.streakDays = 1;
        }

        this.userProgress.lastActivityDate = today;
    }

    // Achievement System
    checkForNewAchievements() {
        const newAchievements = [];

        Object.values(this.achievements).forEach(achievement => {
            if (!achievement.unlocked && !this.userProgress.achievements.includes(achievement.id)) {
                if (achievement.condition(this.userProgress)) {
                    this.unlockAchievement(achievement.id);
                    newAchievements.push(achievement);
                }
            }
        });

        if (newAchievements.length > 0) {
            this.showAchievementNotifications(newAchievements);
        }

        return newAchievements;
    }

    unlockAchievement(achievementId) {
        if (!this.userProgress.achievements.includes(achievementId)) {
            this.userProgress.achievements.push(achievementId);
            this.achievements[achievementId].unlocked = true;
            
            // Award XP for achievement
            const achievement = this.achievements[achievementId];
            this.userProgress.xp += achievement.xp;
            
            this.saveProgress();
            return true;
        }
        return false;
    }

    // Skill Tree System
    addSkillXP(skillCategory, skillName, xp) {
        const skill = this.skillTree[skillCategory]?.skills[skillName];
        if (!skill) return false;

        skill.xp += xp;
        
        // Check for skill level up
        while (skill.xp >= skill.xpRequired && skill.level < skill.maxLevel) {
            skill.level += 1;
            skill.xp -= skill.xpRequired;
            skill.xpRequired = Math.floor(skill.xpRequired * 1.5); // Exponential growth
            
            // Award overall XP for skill level up
            this.addXP(100, `skill-${skillName}`);
            
            this.showSkillLevelUpNotification(skillCategory, skillName, skill.level);
        }

        this.saveProgress();
        return true;
    }

    canLearnSkill(skillCategory, skillName) {
        const skill = this.skillTree[skillCategory]?.skills[skillName];
        if (!skill || !skill.prereq) return true;

        return skill.prereq.every(prereqSkill => {
            const prereq = this.skillTree[skillCategory]?.skills[prereqSkill];
            return prereq && prereq.level > 0;
        });
    }

    getSkillProgress(skillCategory, skillName) {
        const skill = this.skillTree[skillCategory]?.skills[skillName];
        if (!skill) return null;

        return {
            level: skill.level,
            maxLevel: skill.maxLevel,
            xp: skill.xp,
            xpRequired: skill.xpRequired,
            progress: skill.level < skill.maxLevel ? (skill.xp / skill.xpRequired) * 100 : 100,
            canLevel: skill.level < skill.maxLevel
        };
    }

    // Progress Tracking
    trackAction(actionType, metadata = {}) {
        const xpRewards = {
            'profile-update': 50,
            'job-application': 100,
            'job-view': 10,
            'course-complete': 200,
            'skill-practice': 25,
            'interview-complete': 300,
            'connection-made': 75,
            'login': 25
        };

        switch (actionType) {
            case 'profile-update':
                this.userProgress.profileCompleteness = metadata.completeness || this.userProgress.profileCompleteness;
                break;
            case 'job-application':
                this.userProgress.applicationsSubmitted += 1;
                break;
            case 'job-view':
                this.userProgress.jobsViewed += 1;
                break;
            case 'course-complete':
                this.userProgress.coursesCompleted += 1;
                if (metadata.skills) {
                    metadata.skills.forEach(skill => {
                        this.addSkillXP(skill.category, skill.name, skill.xp || 50);
                    });
                }
                break;
            case 'skill-practice':
                this.userProgress.skillsLearned += 1;
                if (metadata.skill) {
                    this.addSkillXP(metadata.skill.category, metadata.skill.name, metadata.skill.xp || 25);
                }
                break;
            case 'interview-complete':
                this.userProgress.interviewsCompleted += 1;
                break;
            case 'connection-made':
                this.userProgress.connectionsMade += 1;
                break;
        }

        const xpReward = xpRewards[actionType] || 10;
        this.addXP(xpReward, actionType);
    }

    // Notification System
    showXPNotification(xp, source) {
        if (!this.userProgress.preferences.notifications) return;

        const sourceNames = {
            'general': 'Actividad general',
            'job-application': 'Aplicación enviada',
            'course-complete': 'Curso completado',
            'skill-practice': 'Práctica de habilidad',
            'profile-update': 'Perfil actualizado'
        };

        this.createNotification({
            type: 'xp',
            title: `+${xp} XP`,
            message: sourceNames[source] || 'Buena acción',
            icon: '⭐',
            duration: 3000
        });
    }

    showLevelUpNotification() {
        this.createNotification({
            type: 'level-up',
            title: `¡Nivel ${this.userProgress.level}!`,
            message: '¡Felicidades! Has subido de nivel',
            icon: '🎉',
            duration: 5000,
            special: true
        });
    }

    showAchievementNotifications(achievements) {
        if (!this.userProgress.preferences.achievements) return;

        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.createNotification({
                    type: 'achievement',
                    title: 'Logro Desbloqueado!',
                    message: `${achievement.icon} ${achievement.name}`,
                    description: achievement.description,
                    icon: achievement.icon,
                    duration: 6000,
                    special: true
                });
            }, index * 1000); // Stagger notifications
        });
    }

    showSkillLevelUpNotification(category, skillName, level) {
        const skill = this.skillTree[category].skills[skillName];
        this.createNotification({
            type: 'skill-level',
            title: 'Habilidad Mejorada!',
            message: `${skill.name} - Nivel ${level}`,
            icon: this.skillTree[category].icon,
            duration: 4000
        });
    }

    createNotification(notification) {
        // Create notification element
        const notificationEl = document.createElement('div');
        notificationEl.className = `gamification-notification ${notification.type} ${notification.special ? 'special' : ''}`;
        
        notificationEl.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${notification.icon}</div>
                <div class="notification-text">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    ${notification.description ? `<div class="notification-description">${notification.description}</div>` : ''}
                </div>
            </div>
        `;

        // Add to container
        let container = document.getElementById('gamification-notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'gamification-notifications';
            container.className = 'gamification-notifications-container';
            document.body.appendChild(container);
        }

        container.appendChild(notificationEl);

        // Animate in
        setTimeout(() => notificationEl.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            notificationEl.classList.remove('show');
            setTimeout(() => container.removeChild(notificationEl), 300);
        }, notification.duration || 4000);
    }

    // UI Updates
    updateProgressDisplay() {
        this.updateLevelDisplay();
        this.updateXPBar();
        this.updateAchievementsList();
        this.updateSkillTrees();
    }

    updateLevelDisplay() {
        const levelElements = document.querySelectorAll('.user-level');
        levelElements.forEach(el => {
            el.textContent = this.userProgress.level;
        });
    }

    updateXPBar() {
        const xpBars = document.querySelectorAll('.xp-progress-bar');
        const xpProgress = (this.userProgress.xp / this.userProgress.xpToNextLevel) * 100;
        
        xpBars.forEach(bar => {
            bar.style.width = `${Math.min(100, xpProgress)}%`;
        });

        const xpTexts = document.querySelectorAll('.xp-text');
        xpTexts.forEach(text => {
            text.textContent = `${this.userProgress.xp} / ${this.userProgress.xpToNextLevel} XP`;
        });
    }

    updateAchievementsList() {
        const container = document.getElementById('achievements-list');
        if (!container) return;

        const unlockedAchievements = this.userProgress.achievements.map(id => this.achievements[id]);
        const totalAchievements = Object.keys(this.achievements).length;

        container.innerHTML = `
            <div class="achievements-header">
                <h3>Logros (${unlockedAchievements.length}/${totalAchievements})</h3>
            </div>
            <div class="achievements-grid">
                ${Object.values(this.achievements).map(achievement => `
                    <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-info">
                            <div class="achievement-name">${achievement.name}</div>
                            <div class="achievement-description">${achievement.description}</div>
                            <div class="achievement-xp">+${achievement.xp} XP</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateSkillTrees() {
        const container = document.getElementById('skill-trees');
        if (!container) return;

        container.innerHTML = Object.entries(this.skillTree).map(([categoryId, category]) => `
            <div class="skill-category">
                <div class="category-header">
                    <span class="category-icon">${category.icon}</span>
                    <h4>${category.name}</h4>
                </div>
                <div class="skills-grid">
                    ${Object.entries(category.skills).map(([skillId, skill]) => {
                        const progress = this.getSkillProgress(categoryId, skillId);
                        const canLearn = this.canLearnSkill(categoryId, skillId);
                        
                        return `
                            <div class="skill-card ${skill.level > 0 ? 'learned' : ''} ${!canLearn ? 'locked' : ''}">
                                <div class="skill-name">${skill.name}</div>
                                <div class="skill-level">Nivel ${skill.level}/${skill.maxLevel}</div>
                                <div class="skill-progress">
                                    <div class="skill-progress-bar" style="width: ${progress.progress}%"></div>
                                </div>
                                <div class="skill-xp">${skill.xp}/${skill.xpRequired} XP</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    }

    // Data persistence
    saveProgress() {
        try {
            localStorage.setItem('catalystUserProgress', JSON.stringify(this.userProgress));
            localStorage.setItem('catalystSkillTree', JSON.stringify(this.skillTree));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    initializeNotifications() {
        // Add CSS for notifications
        if (!document.getElementById('gamification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'gamification-styles';
            styles.textContent = `
                .gamification-notifications-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 300px;
                }

                .gamification-notification {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    transform: translateX(350px);
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .gamification-notification.special {
                    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                    color: #333;
                    transform: scale(0.8) translateX(350px);
                }

                .gamification-notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }

                .gamification-notification.special.show {
                    transform: scale(1) translateX(0);
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .notification-icon {
                    font-size: 24px;
                }

                .notification-title {
                    font-weight: bold;
                    font-size: 14px;
                }

                .notification-message {
                    font-size: 13px;
                    opacity: 0.9;
                }

                .notification-description {
                    font-size: 11px;
                    opacity: 0.7;
                    margin-top: 2px;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Public API methods
    getProgressSummary() {
        return {
            level: this.userProgress.level,
            xp: this.userProgress.xp,
            xpToNext: this.userProgress.xpToNextLevel,
            achievements: this.userProgress.achievements.length,
            totalAchievements: Object.keys(this.achievements).length,
            streak: this.userProgress.streakDays,
            profileCompleteness: this.userProgress.profileCompleteness
        };
    }

    getUserBadges() {
        return this.userProgress.badges.map(badgeId => this.badges[badgeId]);
    }

    getRecentAchievements(limit = 5) {
        return this.userProgress.achievements
            .slice(-limit)
            .map(id => this.achievements[id]);
    }
}

// Singleton instance
let gamificationEngine = null;

export function getGamificationEngine() {
    if (!gamificationEngine) {
        gamificationEngine = new GamificationEngine();
    }
    return gamificationEngine;
}

export { GamificationEngine };
