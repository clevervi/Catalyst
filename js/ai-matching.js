/**
 * AI-Powered Matching System for Catalyst HR
 * Provides intelligent job recommendations, skill analysis, and career path suggestions
 */

class AIMatchingEngine {
    constructor() {
        this.userProfile = null;
        this.jobDatabase = [];
        this.skillsDatabase = this.initializeSkillsDatabase();
        this.matchingWeights = {
            skills: 0.4,
            experience: 0.25,
            location: 0.15,
            salary: 0.1,
            industry: 0.1
        };
        this.init();
    }

    init() {
        this.loadUserProfile();
        this.initializeRecommendationEngine();
    }

    /**
     * Initialize comprehensive skills database for matching
     */
    initializeSkillsDatabase() {
        return {
            frontend: {
                primary: ['React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript'],
                secondary: ['HTML5', 'CSS3', 'Sass', 'Webpack', 'Redux'],
                emerging: ['Svelte', 'Next.js', 'Nuxt.js', 'Web Components']
            },
            backend: {
                primary: ['Node.js', 'Python', 'Java', 'C#', 'PHP'],
                secondary: ['Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel'],
                emerging: ['Rust', 'Go', 'Deno', 'GraphQL']
            },
            database: {
                primary: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
                secondary: ['Oracle', 'SQL Server', 'Elasticsearch'],
                emerging: ['Neo4j', 'CockroachDB', 'Supabase']
            },
            cloud: {
                primary: ['AWS', 'Azure', 'Google Cloud'],
                secondary: ['Docker', 'Kubernetes', 'Terraform'],
                emerging: ['Serverless', 'Edge Computing', 'Microservices']
            },
            dataScience: {
                primary: ['Python', 'R', 'SQL', 'Machine Learning'],
                secondary: ['Pandas', 'NumPy', 'TensorFlow', 'PyTorch'],
                emerging: ['AutoML', 'MLOps', 'Computer Vision', 'NLP']
            },
            mobile: {
                primary: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
                secondary: ['Xamarin', 'Ionic', 'Cordova'],
                emerging: ['SwiftUI', 'Jetpack Compose']
            }
        };
    }

    /**
     * Load user profile from localStorage or API
     */
    loadUserProfile() {
        try {
            const userData = JSON.parse(localStorage.getItem('userProfile') || '{}');
            this.userProfile = {
                skills: userData.skills || [],
                experience: userData.experience || 0,
                preferredLocation: userData.preferredLocation || 'Colombia',
                salaryRange: userData.salaryRange || { min: 0, max: 10000000 },
                industry: userData.industry || 'technology',
                careerLevel: userData.careerLevel || 'junior',
                interests: userData.interests || [],
                strengths: userData.strengths || [],
                careerGoals: userData.careerGoals || []
            };
        } catch (error) {
            console.warn('Error loading user profile, using defaults:', error);
            this.userProfile = this.getDefaultProfile();
        }
    }

    getDefaultProfile() {
        return {
            skills: ['JavaScript', 'HTML5', 'CSS3'],
            experience: 1,
            preferredLocation: 'Colombia',
            salaryRange: { min: 2000000, max: 6000000 },
            industry: 'technology',
            careerLevel: 'junior',
            interests: ['frontend'],
            strengths: ['problem-solving'],
            careerGoals: ['senior-developer']
        };
    }

    /**
     * Calculate job match percentage based on multiple factors
     */
    calculateJobMatch(job) {
        let matchScore = 0;
        const factors = {};

        // Skills matching (40% weight)
        factors.skillsMatch = this.calculateSkillsMatch(job.requiredSkills, this.userProfile.skills);
        matchScore += factors.skillsMatch * this.matchingWeights.skills;

        // Experience matching (25% weight)
        factors.experienceMatch = this.calculateExperienceMatch(job.experienceLevel, this.userProfile.experience);
        matchScore += factors.experienceMatch * this.matchingWeights.experience;

        // Location matching (15% weight)
        factors.locationMatch = this.calculateLocationMatch(job.location, this.userProfile.preferredLocation);
        matchScore += factors.locationMatch * this.matchingWeights.location;

        // Salary matching (10% weight)
        factors.salaryMatch = this.calculateSalaryMatch(job.salaryRange, this.userProfile.salaryRange);
        matchScore += factors.salaryMatch * this.matchingWeights.salary;

        // Industry matching (10% weight)
        factors.industryMatch = this.calculateIndustryMatch(job.industry, this.userProfile.industry);
        matchScore += factors.industryMatch * this.matchingWeights.industry;

        return {
            score: Math.round(matchScore * 100),
            factors: factors,
            recommendations: this.generateJobRecommendations(factors, job)
        };
    }

    calculateSkillsMatch(requiredSkills, userSkills) {
        if (!requiredSkills || requiredSkills.length === 0) return 0.7; // Default decent match
        if (!userSkills || userSkills.length === 0) return 0.1; // Low match if no skills

        const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()));
        const userSet = new Set(userSkills.map(s => s.toLowerCase()));
        
        let matchedSkills = 0;
        let partialMatches = 0;

        requiredSet.forEach(skill => {
            if (userSet.has(skill)) {
                matchedSkills++;
            } else {
                // Check for related skills
                if (this.isRelatedSkill(skill, Array.from(userSet))) {
                    partialMatches++;
                }
            }
        });

        const exactMatch = matchedSkills / requiredSkills.length;
        const partialMatch = (partialMatches * 0.3) / requiredSkills.length;
        
        return Math.min(1, exactMatch + partialMatch);
    }

    isRelatedSkill(targetSkill, userSkills) {
        // Check if any user skill is related to the target skill
        for (const category in this.skillsDatabase) {
            const skillGroups = this.skillsDatabase[category];
            for (const group in skillGroups) {
                const skills = skillGroups[group].map(s => s.toLowerCase());
                if (skills.includes(targetSkill.toLowerCase())) {
                    // Check if user has any skill from the same group
                    return userSkills.some(userSkill => 
                        skills.includes(userSkill.toLowerCase())
                    );
                }
            }
        }
        return false;
    }

    calculateExperienceMatch(jobLevel, userExperience) {
        const levelMapping = {
            'trainee': 0, 'junior': 1, 'semi-senior': 3, 
            'senior': 5, 'lead': 7, 'architect': 10
        };

        const jobExp = levelMapping[jobLevel.toLowerCase()] || 0;
        const userExp = userExperience;

        if (userExp >= jobExp) {
            // Perfect or overqualified
            return userExp <= jobExp + 2 ? 1 : 0.8; // Slight penalty for being overqualified
        } else {
            // Underqualified
            const gap = jobExp - userExp;
            return Math.max(0.1, 1 - (gap * 0.2));
        }
    }

    calculateLocationMatch(jobLocation, preferredLocation) {
        if (!jobLocation || !preferredLocation) return 0.5;
        
        const jobLoc = jobLocation.toLowerCase();
        const prefLoc = preferredLocation.toLowerCase();

        if (jobLoc.includes('remoto') || jobLoc.includes('remote')) return 1;
        if (jobLoc.includes(prefLoc) || prefLoc.includes(jobLoc)) return 1;
        if (jobLoc.includes('colombia') && prefLoc.includes('colombia')) return 0.8;
        
        return 0.3; // Different location penalty
    }

    calculateSalaryMatch(jobSalary, userRange) {
        if (!jobSalary || !userRange) return 0.7;

        const jobMin = jobSalary.min || 0;
        const jobMax = jobSalary.max || jobMin * 1.3;
        const userMin = userRange.min || 0;
        const userMax = userRange.max || Infinity;

        // Check for overlap
        const overlapStart = Math.max(jobMin, userMin);
        const overlapEnd = Math.min(jobMax, userMax);

        if (overlapEnd > overlapStart) {
            const overlapSize = overlapEnd - overlapStart;
            const userRangeSize = userMax - userMin;
            return Math.min(1, overlapSize / userRangeSize);
        }

        return 0.1; // No overlap penalty
    }

    calculateIndustryMatch(jobIndustry, userIndustry) {
        if (!jobIndustry || !userIndustry) return 0.7;
        
        if (jobIndustry.toLowerCase() === userIndustry.toLowerCase()) return 1;
        
        // Related industries
        const relatedIndustries = {
            'technology': ['fintech', 'healthtech', 'edtech', 'software'],
            'fintech': ['technology', 'banking', 'finance'],
            'healthtech': ['technology', 'healthcare', 'medical'],
            'edtech': ['technology', 'education', 'training']
        };

        const related = relatedIndustries[userIndustry.toLowerCase()] || [];
        return related.includes(jobIndustry.toLowerCase()) ? 0.8 : 0.4;
    }

    generateJobRecommendations(factors, job) {
        const recommendations = [];

        if (factors.skillsMatch < 0.7) {
            const missingSkills = this.findMissingSkills(job.requiredSkills, this.userProfile.skills);
            recommendations.push({
                type: 'skill-development',
                message: `Considera desarrollar estas habilidades: ${missingSkills.slice(0, 3).join(', ')}`,
                priority: 'high',
                action: 'training'
            });
        }

        if (factors.experienceMatch < 0.6) {
            recommendations.push({
                type: 'experience-gap',
                message: 'Este puesto requiere más experiencia. Considera aplicar a roles similares de menor nivel.',
                priority: 'medium',
                action: 'alternative-jobs'
            });
        }

        if (factors.locationMatch < 0.5) {
            recommendations.push({
                type: 'location-mismatch',
                message: 'Ubicación diferente a tu preferencia. ¿Estarías dispuesto a reubicarte?',
                priority: 'low',
                action: 'location-settings'
            });
        }

        return recommendations;
    }

    findMissingSkills(requiredSkills, userSkills) {
        if (!requiredSkills) return [];
        
        const userSet = new Set(userSkills.map(s => s.toLowerCase()));
        return requiredSkills.filter(skill => 
            !userSet.has(skill.toLowerCase()) && 
            !this.isRelatedSkill(skill, userSkills)
        );
    }

    /**
     * Get personalized job recommendations
     */
    getJobRecommendations(jobs, limit = 10) {
        const jobsWithScores = jobs.map(job => ({
            ...job,
            aiMatch: this.calculateJobMatch(job)
        }));

        return jobsWithScores
            .sort((a, b) => b.aiMatch.score - a.aiMatch.score)
            .slice(0, limit);
    }

    /**
     * Generate career path suggestions
     */
    generateCareerPath(currentRole, targetRole) {
        const paths = {
            'junior-developer': {
                'senior-developer': [
                    { step: 1, title: 'Dominar tecnologías principales', duration: '6-12 meses' },
                    { step: 2, title: 'Liderar proyectos pequeños', duration: '6-12 meses' },
                    { step: 3, title: 'Mentoría a junior developers', duration: '6-12 meses' },
                    { step: 4, title: 'Especialización técnica', duration: '6-12 meses' }
                ],
                'tech-lead': [
                    { step: 1, title: 'Convertirse en Senior Developer', duration: '2-3 años' },
                    { step: 2, title: 'Experiencia en arquitectura', duration: '1-2 años' },
                    { step: 3, title: 'Habilidades de liderazgo', duration: '6-12 meses' },
                    { step: 4, title: 'Gestión de equipos técnicos', duration: '1 año' }
                ]
            }
        };

        return paths[currentRole]?.[targetRole] || [];
    }

    /**
     * Skill gap analysis
     */
    analyzeSkillGaps(targetJob) {
        const analysis = {
            strengths: [],
            gaps: [],
            recommendations: []
        };

        const requiredSkills = targetJob.requiredSkills || [];
        const userSkills = this.userProfile.skills || [];

        // Identify strengths
        analysis.strengths = requiredSkills.filter(skill => 
            userSkills.some(userSkill => 
                userSkill.toLowerCase() === skill.toLowerCase()
            )
        );

        // Identify gaps
        analysis.gaps = this.findMissingSkills(requiredSkills, userSkills);

        // Generate learning recommendations
        analysis.recommendations = analysis.gaps.map(skill => ({
            skill: skill,
            priority: this.getSkillPriority(skill, targetJob),
            estimatedLearningTime: this.getEstimatedLearningTime(skill),
            resources: this.getSkillResources(skill)
        }));

        return analysis;
    }

    getSkillPriority(skill, job) {
        // Core technologies get high priority
        const coreSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL'];
        if (coreSkills.includes(skill)) return 'high';
        
        // Framework/library skills get medium priority
        const frameworkSkills = ['Express', 'Django', 'Vue.js', 'Angular'];
        if (frameworkSkills.includes(skill)) return 'medium';
        
        return 'low';
    }

    getEstimatedLearningTime(skill) {
        const timeEstimates = {
            'JavaScript': '2-3 meses',
            'React': '1-2 meses',
            'Node.js': '1-2 meses',
            'Python': '2-3 meses',
            'SQL': '1 mes',
            'Docker': '2-3 semanas',
            'AWS': '2-3 meses'
        };

        return timeEstimates[skill] || '1-2 meses';
    }

    getSkillResources(skill) {
        return {
            online_courses: [`Curso de ${skill} en Catalyst Training`],
            documentation: [`Documentación oficial de ${skill}`],
            practice: [`Proyectos prácticos con ${skill}`]
        };
    }

    /**
     * Update user profile for better matching
     */
    updateUserProfile(profileData) {
        this.userProfile = { ...this.userProfile, ...profileData };
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
        
        // Trigger re-analysis of job matches
        this.initializeRecommendationEngine();
    }

    initializeRecommendationEngine() {
        // This would connect to a backend service in production
        console.log('AI Matching Engine initialized for user:', this.userProfile);
    }
}

// Singleton instance
let aiMatchingEngine = null;

export function getAIMatchingEngine() {
    if (!aiMatchingEngine) {
        aiMatchingEngine = new AIMatchingEngine();
    }
    return aiMatchingEngine;
}

export { AIMatchingEngine };
