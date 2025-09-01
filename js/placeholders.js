// Placeholder Images and Avatars Management System
class PlaceholderManager {
    constructor() {
        this.colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
            '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
        ];
        this.gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            'linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)',
            'linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)',
            'linear-gradient(135deg, #667db6 0%, #0082c8 100%)'
        ];
        this.companyLogos = {
            'TechCorp': this.generateCompanyLogo('TC', '#3b82f6'),
            'InnovaSoft': this.generateCompanyLogo('IS', '#10b981'),
            'DataSystems': this.generateCompanyLogo('DS', '#f59e0b'),
            'CloudTech': this.generateCompanyLogo('CT', '#8b5cf6'),
            'DigitalFlow': this.generateCompanyLogo('DF', '#ef4444'),
            'SmartSolutions': this.generateCompanyLogo('SS', '#06b6d4'),
            'CodeFactory': this.generateCompanyLogo('CF', '#84cc16'),
            'ByteWorks': this.generateCompanyLogo('BW', '#f97316'),
            'NexGen': this.generateCompanyLogo('NG', '#ec4899'),
            'AlphaTech': this.generateCompanyLogo('AT', '#6366f1')
        };
    }

    // Generate user avatar with initials
    generateUserAvatar(name, size = 40, backgroundColor = null) {
        const initials = this.getInitials(name);
        const bgColor = backgroundColor || this.getRandomColor();
        const textColor = this.getContrastColor(bgColor);
        
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=${bgColor.replace('#', '')}&color=${textColor.replace('#', '')}&bold=true`;
    }

    // Generate company logo placeholder
    generateCompanyLogo(companyName, backgroundColor = null, size = 200) {
        const initials = this.getInitials(companyName);
        const bgColor = backgroundColor || this.getRandomColor();
        
        return `https://via.placeholder.com/${size}x${size}/${bgColor.replace('#', '')}/ffffff?text=${encodeURIComponent(initials)}`;
    }

    // Generate job/course image placeholder
    generateImagePlaceholder(title, width = 400, height = 250, useGradient = false) {
        if (useGradient) {
            return this.generateGradientPlaceholder(title, width, height);
        }
        
        const color = this.getRandomColor();
        const shortTitle = this.getShortTitle(title);
        
        return `https://via.placeholder.com/${width}x${height}/${color.replace('#', '')}/ffffff?text=${encodeURIComponent(shortTitle)}`;
    }

    // Generate gradient placeholder (simulated)
    generateGradientPlaceholder(title, width = 400, height = 250) {
        const gradient = this.getRandomGradient();
        const shortTitle = this.getShortTitle(title);
        
        // Since we can't create real gradients in URLs, we'll use a solid color
        // In a real implementation, this would generate an actual image with gradient
        const fallbackColor = this.getRandomColor();
        return `https://via.placeholder.com/${width}x${height}/${fallbackColor.replace('#', '')}/ffffff?text=${encodeURIComponent(shortTitle)}`;
    }

    // Generate profile picture placeholder
    generateProfilePicture(name, size = 150, style = 'circular') {
        const avatarStyles = {
            'circular': 'circle',
            'rounded': 'rounded',
            'square': 'square'
        };
        
        const selectedStyle = avatarStyles[style] || 'circle';
        return this.generateUserAvatar(name, size);
    }

    // Generate icon placeholder for categories/skills
    generateIconPlaceholder(category, size = 32) {
        const icons = {
            'technology': '💻',
            'design': '🎨',
            'management': '👥',
            'soft skills': '🗣️',
            'marketing': '📈',
            'sales': '💰',
            'development': '⚡',
            'data': '📊',
            'security': '🔒',
            'mobile': '📱',
            'web': '🌐',
            'ai': '🤖',
            'cloud': '☁️',
            'database': '🗄️',
            'networking': '🔗',
            'devops': '⚙️',
            'testing': '🧪',
            'ui/ux': '✨',
            'finance': '💳',
            'hr': '👤'
        };
        
        const icon = icons[category.toLowerCase()] || '📋';
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><text y="50%" x="50%" dy="0.35em" text-anchor="middle" font-size="${size * 0.7}">${icon}</text></svg>`;
    }

    // Generate document/file placeholder
    generateDocumentPlaceholder(filename, type = 'pdf') {
        const typeIcons = {
            'pdf': '📄',
            'doc': '📝',
            'xls': '📊',
            'ppt': '📑',
            'img': '🖼️',
            'zip': '📦',
            'txt': '📃'
        };
        
        const icon = typeIcons[type.toLowerCase()] || '📄';
        const shortName = filename.length > 10 ? filename.substring(0, 10) + '...' : filename;
        
        return `https://via.placeholder.com/100x120/f8fafc/6b7280?text=${encodeURIComponent(icon + '\n' + shortName)}`;
    }

    // Generate certificate placeholder
    generateCertificatePlaceholder(courseName, recipientName) {
        const shortCourse = this.getShortTitle(courseName);
        const shortName = this.getInitials(recipientName);
        
        return `https://via.placeholder.com/400x300/f8fafc/6b7280?text=${encodeURIComponent('🎓\n' + shortCourse + '\n' + shortName)}`;
    }

    // Utility methods
    getInitials(name) {
        if (!name) return 'NA';
        
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }
        
        return words.map(word => word.charAt(0)).join('').substring(0, 3).toUpperCase();
    }

    getShortTitle(title) {
        if (!title) return 'Sin Título';
        
        const words = title.trim().split(' ');
        if (title.length <= 15) return title;
        
        // Take first significant words
        let shortTitle = '';
        for (let word of words) {
            if ((shortTitle + word).length > 15) break;
            shortTitle += (shortTitle ? ' ' : '') + word;
        }
        
        return shortTitle || title.substring(0, 15) + '...';
    }

    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    getRandomGradient() {
        return this.gradients[Math.floor(Math.random() * this.gradients.length)];
    }

    getContrastColor(backgroundColor) {
        // Simple contrast calculation
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }

    // Pre-defined avatar sets for consistency
    generateAvatarSet(users) {
        const avatars = {};
        const usedColors = [];
        
        users.forEach((user, index) => {
            let color = this.colors[index % this.colors.length];
            
            // Avoid using same colors consecutively
            while (usedColors.includes(color) && usedColors.length < this.colors.length) {
                color = this.getRandomColor();
            }
            
            usedColors.push(color);
            if (usedColors.length > 3) usedColors.shift(); // Keep last 3 colors
            
            avatars[user.id || index] = this.generateUserAvatar(user.name || `Usuario ${index + 1}`, 40, color);
        });
        
        return avatars;
    }

    // Generate complete placeholder package for a job posting
    generateJobPlaceholders(job) {
        return {
            companyLogo: this.generateCompanyLogo(job.company),
            jobImage: this.generateImagePlaceholder(job.title, 400, 200, true),
            categoryIcon: this.generateIconPlaceholder(job.category || 'technology'),
            requiredDocuments: ['CV', 'Cover Letter', 'Portfolio'].map(doc => ({
                name: doc,
                placeholder: this.generateDocumentPlaceholder(doc, 'pdf')
            }))
        };
    }

    // Generate complete placeholder package for a course
    generateCoursePlaceholders(course) {
        return {
            courseImage: this.generateImagePlaceholder(course.title, 400, 250, true),
            instructorAvatar: this.generateUserAvatar(course.instructor),
            categoryIcon: this.generateIconPlaceholder(course.category || 'technology'),
            certificate: this.generateCertificatePlaceholder(course.title, 'Nombre del Estudiante'),
            skillIcons: (course.skills || []).slice(0, 5).map(skill => ({
                skill: skill,
                icon: this.generateIconPlaceholder(skill.toLowerCase())
            }))
        };
    }

    // Generate placeholder data with images for testing
    generateSampleData() {
        return {
            users: [
                { name: 'Ana García', avatar: this.generateUserAvatar('Ana García') },
                { name: 'Carlos López', avatar: this.generateUserAvatar('Carlos López') },
                { name: 'María Rodríguez', avatar: this.generateUserAvatar('María Rodríguez') },
                { name: 'Juan Pérez', avatar: this.generateUserAvatar('Juan Pérez') },
                { name: 'Sofia Martínez', avatar: this.generateUserAvatar('Sofia Martínez') }
            ],
            companies: Object.keys(this.companyLogos).map(company => ({
                name: company,
                logo: this.companyLogos[company]
            })),
            categories: [
                { name: 'Technology', icon: this.generateIconPlaceholder('technology') },
                { name: 'Design', icon: this.generateIconPlaceholder('design') },
                { name: 'Management', icon: this.generateIconPlaceholder('management') },
                { name: 'Marketing', icon: this.generateIconPlaceholder('marketing') },
                { name: 'Sales', icon: this.generateIconPlaceholder('sales') }
            ]
        };
    }

    // Apply placeholders to existing data
    enhanceDataWithPlaceholders(data, type) {
        if (!data || !Array.isArray(data)) return data;
        
        return data.map(item => {
            const enhanced = { ...item };
            
            switch (type) {
                case 'jobs':
                    enhanced.placeholders = this.generateJobPlaceholders(item);
                    break;
                    
                case 'courses':
                    enhanced.placeholders = this.generateCoursePlaceholders(item);
                    break;
                    
                case 'users':
                    enhanced.avatar = enhanced.avatar || this.generateUserAvatar(item.name || item.full_name || 'Usuario');
                    break;
                    
                case 'candidates':
                    enhanced.avatar = enhanced.avatar || this.generateUserAvatar(item.name || 'Candidato');
                    enhanced.resume = enhanced.resume || this.generateDocumentPlaceholder('CV_' + (item.name || 'candidato'), 'pdf');
                    break;
                    
                default:
                    if (item.name) {
                        enhanced.avatar = this.generateUserAvatar(item.name);
                    }
                    break;
            }
            
            return enhanced;
        });
    }
}

// Export as singleton
const placeholderManager = new PlaceholderManager();

// Export for ES6 modules
export { placeholderManager, PlaceholderManager };

// Global availability for legacy scripts
if (typeof window !== 'undefined') {
    window.placeholderManager = placeholderManager;
    window.PlaceholderManager = PlaceholderManager;
}
