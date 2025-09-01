-- =========================================
-- CATALYST HR MANAGEMENT SYSTEM - ENHANCED DATABASE
-- Complete schema for job portal with role-based access
-- =========================================

DROP DATABASE IF EXISTS catalyst_hr_system;
CREATE DATABASE catalyst_hr_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE catalyst_hr_system;

-- =========================================
-- USER MANAGEMENT TABLES
-- =========================================

-- Roles table for system permissions
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table with enhanced authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(500),
    date_of_birth DATE,
    role_id INT NOT NULL,
    department VARCHAR(100),
    hire_date DATE,
    employee_id VARCHAR(50) UNIQUE,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- User profiles for extended information
CREATE TABLE user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    bio TEXT,
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    resume_file VARCHAR(500),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    salary_expectation DECIMAL(12,2),
    availability ENUM('immediate', '2weeks', '1month', 'negotiable') DEFAULT 'negotiable',
    work_preference ENUM('remote', 'onsite', 'hybrid') DEFAULT 'hybrid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User skills and proficiencies
CREATE TABLE user_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
    years_experience INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_skill (user_id, skill_name)
);

-- User work experience
CREATE TABLE user_experience (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    technologies TEXT, -- JSON array of technologies used
    achievements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User education
CREATE TABLE user_education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    gpa DECIMAL(3,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- COMPANY MANAGEMENT TABLES
-- =========================================

-- Companies table
CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(500),
    industry VARCHAR(100),
    company_size ENUM('startup', 'small', 'medium', 'large', 'enterprise') DEFAULT 'medium',
    founded_year YEAR,
    headquarters VARCHAR(255),
    culture_description TEXT,
    benefits TEXT, -- JSON array of benefits
    verified BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Company locations
CREATE TABLE company_locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    is_headquarters BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- =========================================
-- JOB MANAGEMENT TABLES
-- =========================================

-- Job categories
CREATE TABLE job_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table (NO SALARY/PRICE INFORMATION as requested)
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    nice_to_have TEXT,
    responsibilities TEXT,
    work_type ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance') DEFAULT 'full_time',
    work_mode ENUM('remote', 'onsite', 'hybrid') DEFAULT 'hybrid',
    experience_level ENUM('entry', 'junior', 'mid', 'senior', 'lead', 'executive') DEFAULT 'mid',
    location VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    urgent BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    application_deadline DATE,
    status ENUM('draft', 'active', 'paused', 'closed', 'expired') DEFAULT 'draft',
    views_count INT DEFAULT 0,
    applications_count INT DEFAULT 0,
    created_by INT NOT NULL,
    assigned_recruiter INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (category_id) REFERENCES job_categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_recruiter) REFERENCES users(id),
    INDEX idx_job_status (status),
    INDEX idx_job_location (location),
    INDEX idx_job_category (category_id)
);

-- Job skills requirements
CREATE TABLE job_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_job_skill (job_id, skill_name)
);

-- Job applications
CREATE TABLE job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    cover_letter TEXT,
    resume_file VARCHAR(500),
    status ENUM('applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected', 'withdrawn') DEFAULT 'applied',
    application_source VARCHAR(100) DEFAULT 'website',
    notes TEXT, -- For recruiter notes
    interview_date DATETIME,
    feedback TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reviewed_by INT,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    UNIQUE KEY unique_application (job_id, user_id),
    INDEX idx_application_status (status),
    INDEX idx_application_date (applied_at)
);

-- Application timeline/history
CREATE TABLE application_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by INT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- =========================================
-- TRAINING/COURSES SYSTEM (NO PRICES as requested)
-- =========================================

-- Training categories
CREATE TABLE training_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7) DEFAULT '#3B82F6',
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training courses (NO PRICE INFORMATION)
CREATE TABLE training_courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    thumbnail_url VARCHAR(500),
    video_intro_url VARCHAR(500),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    duration_hours INT NOT NULL,
    language VARCHAR(10) DEFAULT 'es',
    prerequisites TEXT,
    learning_objectives TEXT, -- JSON array of objectives
    what_you_learn TEXT, -- JSON array of topics
    status ENUM('draft', 'active', 'inactive') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    certificate_available BOOLEAN DEFAULT TRUE,
    enrollment_count INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    instructor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES training_categories(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id),
    INDEX idx_course_status (status),
    INDEX idx_course_level (difficulty_level)
);

-- Course modules/chapters
CREATE TABLE course_modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT NOT NULL,
    duration_minutes INT,
    is_free BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE,
    INDEX idx_module_order (course_id, sort_order)
);

-- Course lessons
CREATE TABLE course_lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url VARCHAR(500),
    duration_minutes INT,
    sort_order INT NOT NULL,
    is_free BOOLEAN DEFAULT FALSE,
    resources TEXT, -- JSON array of downloadable resources
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE,
    INDEX idx_lesson_order (module_id, sort_order)
);

-- User course enrollments
CREATE TABLE course_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    certificate_issued_at TIMESTAMP NULL,
    certificate_url VARCHAR(500),
    status ENUM('enrolled', 'in_progress', 'completed', 'dropped') DEFAULT 'enrolled',
    last_accessed TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, course_id),
    INDEX idx_enrollment_status (status)
);

-- User lesson progress
CREATE TABLE lesson_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    enrollment_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    watch_time_minutes INT DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES course_enrollments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_lesson_progress (user_id, lesson_id),
    INDEX idx_progress_completion (completed_at)
);

-- Course reviews and ratings
CREATE TABLE course_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    enrollment_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES course_enrollments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_review (course_id, user_id)
);

-- =========================================
-- SYSTEM TABLES
-- =========================================

-- System settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    data_type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Activity logs
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_activity_user (user_id),
    INDEX idx_activity_date (created_at),
    INDEX idx_activity_action (action)
);

-- Notifications system
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    category ENUM('application', 'job', 'course', 'system', 'promotion') DEFAULT 'system',
    read_at TIMESTAMP NULL,
    action_url VARCHAR(500),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notification_user (user_id),
    INDEX idx_notification_read (read_at)
);

-- =========================================
-- INITIAL DATA INSERTION
-- =========================================

-- Insert system roles
INSERT INTO roles (name, display_name, description, permissions) VALUES
('administrator', 'Administrador', 'Acceso completo al sistema', JSON_ARRAY('all')),
('talent_human_team', 'Equipo de Talento Humano', 'Gestión completa de RRHH y reclutamiento', JSON_ARRAY('manage_jobs', 'manage_users', 'view_applications', 'manage_courses', 'view_reports')),
('hiring_manager', 'Gerente de Contratación', 'Gestión de contratación por departamento', JSON_ARRAY('manage_department_jobs', 'view_applications', 'interview_candidates')),
('instructor', 'Instructor', 'Gestión de cursos y capacitaciones', JSON_ARRAY('manage_own_courses', 'view_enrollments')),
('employee', 'Empleado', 'Acceso a empleos internos y capacitaciones', JSON_ARRAY('apply_internal_jobs', 'access_courses')),
('candidate', 'Candidato', 'Acceso básico para aplicar a empleos', JSON_ARRAY('apply_jobs', 'view_courses'));

-- Insert job categories
INSERT INTO job_categories (name, display_name, description, icon) VALUES
('frontend', 'Desarrollo Frontend', 'Desarrollo de interfaces de usuario', 'fas fa-desktop'),
('backend', 'Desarrollo Backend', 'Desarrollo de servicios y APIs', 'fas fa-server'),
('fullstack', 'Desarrollo Full Stack', 'Desarrollo frontend y backend', 'fas fa-code'),
('mobile', 'Desarrollo Móvil', 'Desarrollo de aplicaciones móviles', 'fas fa-mobile-alt'),
('devops', 'DevOps', 'Operaciones y desarrollo', 'fas fa-cogs'),
('data_science', 'Ciencia de Datos', 'Análisis y ciencia de datos', 'fas fa-chart-line'),
('ui_ux', 'Diseño UI/UX', 'Diseño de experiencia de usuario', 'fas fa-paint-brush'),
('qa', 'Aseguramiento de Calidad', 'Testing y QA', 'fas fa-bug'),
('project_management', 'Gestión de Proyectos', 'Administración de proyectos tech', 'fas fa-tasks'),
('cybersecurity', 'Ciberseguridad', 'Seguridad informática', 'fas fa-shield-alt');

-- Insert training categories
INSERT INTO training_categories (name, display_name, description, icon, color) VALUES
('programming', 'Programación', 'Lenguajes y frameworks de programación', 'fas fa-code', '#3B82F6'),
('web_development', 'Desarrollo Web', 'Tecnologías para desarrollo web', 'fas fa-globe', '#10B981'),
('mobile_development', 'Desarrollo Móvil', 'Desarrollo de apps móviles', 'fas fa-mobile-alt', '#8B5CF6'),
('data_science', 'Ciencia de Datos', 'Analytics, ML e IA', 'fas fa-chart-bar', '#F59E0B'),
('cloud_computing', 'Computación en la Nube', 'Tecnologías cloud', 'fas fa-cloud', '#06B6D4'),
('cybersecurity', 'Ciberseguridad', 'Seguridad informática', 'fas fa-lock', '#EF4444'),
('design', 'Diseño', 'UI/UX y diseño digital', 'fas fa-palette', '#EC4899'),
('soft_skills', 'Habilidades Blandas', 'Liderazgo, comunicación, trabajo en equipo', 'fas fa-users', '#84CC16'),
('project_management', 'Gestión de Proyectos', 'Metodologías ágiles y gestión', 'fas fa-project-diagram', '#F97316'),
('business', 'Negocios', 'Estrategia empresarial y emprendimiento', 'fas fa-briefcase', '#6366F1');

-- Insert demo companies
INSERT INTO companies (name, slug, description, website, industry, company_size, headquarters, verified) VALUES
('Catalyst Technologies', 'catalyst-tech', 'Empresa líder en desarrollo de software y transformación digital', 'https://catalyst.tech', 'Tecnología', 'large', 'Bogotá, Colombia', TRUE),
('InnovateCore Solutions', 'innovatecore', 'Consultora especializada en soluciones empresariales', 'https://innovatecore.com', 'Consultoría', 'medium', 'Medellín, Colombia', TRUE),
('DataVision Analytics', 'datavision', 'Empresa de análisis de datos e inteligencia artificial', 'https://datavision.ai', 'Analytics', 'startup', 'Cali, Colombia', TRUE),
('CloudFirst Systems', 'cloudfirst', 'Servicios de infraestructura en la nube', 'https://cloudfirst.co', 'Cloud Services', 'medium', 'Barranquilla, Colombia', FALSE);

-- Insert demo users (with bcrypt hashes for 'demo123')
INSERT INTO users (email, password_hash, first_name, last_name, role_id, department, employee_id, status, email_verified) VALUES
('admin@catalyst.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'García', 1, 'Administración', 'ADMIN001', 'active', TRUE),
('hr@catalyst.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Rodríguez', 2, 'Recursos Humanos', 'HR001', 'active', TRUE),
('hiring@catalyst.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María', 'López', 3, 'Tecnología', 'HM001', 'active', TRUE),
('instructor@catalyst.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'David', 'Martínez', 4, 'Educación', 'INST001', 'active', TRUE),
('demo@catalyst.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan', 'Pérez', 6, NULL, NULL, 'active', TRUE);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, data_type, description) VALUES
('site_name', 'Catalyst HR System', 'string', 'Nombre del sitio web'),
('site_description', 'Plataforma integral de gestión de talento humano y empleos', 'string', 'Descripción del sitio'),
('max_file_upload_size', '10485760', 'integer', 'Tamaño máximo de archivo en bytes (10MB)'),
('email_notifications_enabled', 'true', 'boolean', 'Habilitar notificaciones por email'),
('job_application_deadline_days', '30', 'integer', 'Días por defecto para deadline de aplicaciones'),
('course_certificate_template', 'default', 'string', 'Plantilla por defecto para certificados');

-- =========================================
-- DATABASE VIEWS FOR REPORTING
-- =========================================

-- View for job statistics
CREATE VIEW job_statistics AS
SELECT 
    c.name as category_name,
    COUNT(j.id) as total_jobs,
    COUNT(CASE WHEN j.status = 'active' THEN 1 END) as active_jobs,
    AVG(j.applications_count) as avg_applications,
    SUM(j.views_count) as total_views
FROM jobs j
JOIN job_categories c ON j.category_id = c.id
GROUP BY c.id, c.name;

-- View for user application summary
CREATE VIEW user_application_summary AS
SELECT 
    u.id as user_id,
    CONCAT(u.first_name, ' ', u.last_name) as full_name,
    COUNT(ja.id) as total_applications,
    COUNT(CASE WHEN ja.status = 'hired' THEN 1 END) as hired_count,
    COUNT(CASE WHEN ja.status IN ('applied', 'screening', 'interview') THEN 1 END) as pending_count
FROM users u
LEFT JOIN job_applications ja ON u.id = ja.user_id
GROUP BY u.id, u.first_name, u.last_name;

-- View for course enrollment statistics
CREATE VIEW course_enrollment_stats AS
SELECT 
    c.id as course_id,
    c.title,
    c.enrollment_count,
    AVG(e.completion_percentage) as avg_completion,
    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_enrollments,
    c.rating,
    c.review_count
FROM training_courses c
LEFT JOIN course_enrollments e ON c.id = e.course_id
GROUP BY c.id, c.title, c.enrollment_count, c.rating, c.review_count;

-- =========================================
-- INDEXES FOR PERFORMANCE
-- =========================================

-- Additional indexes for better performance
CREATE INDEX idx_users_role_status ON users(role_id, status);
CREATE INDEX idx_jobs_company_status ON jobs(company_id, status);
CREATE INDEX idx_applications_job_status ON job_applications(job_id, status);
CREATE INDEX idx_enrollments_user_status ON course_enrollments(user_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read_at);
CREATE INDEX idx_activity_logs_date_user ON activity_logs(created_at, user_id);

-- =========================================
-- TRIGGERS FOR AUTOMATED UPDATES
-- =========================================

-- Update job applications count when new application is created
DELIMITER //
CREATE TRIGGER update_job_applications_count 
AFTER INSERT ON job_applications
FOR EACH ROW
BEGIN
    UPDATE jobs 
    SET applications_count = applications_count + 1 
    WHERE id = NEW.job_id;
END//

-- Update course enrollment count
CREATE TRIGGER update_course_enrollment_count 
AFTER INSERT ON course_enrollments
FOR EACH ROW
BEGIN
    UPDATE training_courses 
    SET enrollment_count = enrollment_count + 1 
    WHERE id = NEW.course_id;
END//

-- Log application status changes
CREATE TRIGGER log_application_status_change 
AFTER UPDATE ON job_applications
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO application_history (application_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.reviewed_by);
    END IF;
END//

DELIMITER ;

-- =========================================
-- INITIAL DEMO DATA
-- =========================================

-- Demo jobs (without salary information as requested)
INSERT INTO jobs (company_id, category_id, title, slug, description, requirements, work_type, work_mode, experience_level, location, department, featured, created_by, status) VALUES
(1, 1, 'Desarrollador Frontend React Senior', 'desarrollador-frontend-react-senior', 
'Buscamos un desarrollador Frontend Senior con experiencia en React para unirse a nuestro equipo de producto. Trabajarás en aplicaciones web modernas y colaborarás con equipos multidisciplinarios.',
'• 4+ años de experiencia con React\n• Dominio de JavaScript/TypeScript\n• Experiencia con Redux o Zustand\n• Conocimiento de CSS3 y preprocesadores\n• Experiencia con testing (Jest, React Testing Library)',
'full_time', 'hybrid', 'senior', 'Bogotá, Colombia', 'Tecnología', TRUE, 2, 'active'),

(2, 2, 'Desarrollador Backend Node.js', 'desarrollador-backend-nodejs',
'Desarrollador Backend con experiencia en Node.js para crear APIs robustas y escalables. Trabajarás con tecnologías modernas y metodologías ágiles.',
'• 3+ años de experiencia con Node.js\n• Experiencia con Express.js o Fastify\n• Conocimiento de bases de datos SQL y NoSQL\n• Experiencia con Docker y AWS\n• Conocimiento de patrones de diseño',
'full_time', 'remote', 'mid', 'Medellín, Colombia', 'Tecnología', FALSE, 2, 'active'),

(3, 6, 'Data Scientist', 'data-scientist',
'Científico de datos para desarrollar modelos de machine learning e insights de negocio. Trabajarás con grandes volúmenes de datos y tecnologías de IA.',
'• Maestría en Estadística, Matemáticas o afines\n• 3+ años de experiencia en Python/R\n• Experiencia con TensorFlow o PyTorch\n• Conocimiento de SQL y bases de datos\n• Experiencia en visualización de datos',
'full_time', 'hybrid', 'senior', 'Cali, Colombia', 'Data Science', TRUE, 2, 'active');

-- Demo training courses (without prices as requested)
INSERT INTO training_courses (category_id, title, slug, description, short_description, difficulty_level, duration_hours, instructor_id, status, featured) VALUES
(1, 'Fundamentos de JavaScript Moderno', 'javascript-moderno-fundamentos',
'Curso completo de JavaScript moderno desde cero. Aprende ES6+, programación asíncrona, DOM manipulation y mejores prácticas de desarrollo.',
'Domina JavaScript moderno con ES6+ y programación asíncrona',
'beginner', 40, 4, 'active', TRUE),

(2, 'React: De Principiante a Experto', 'react-principiante-experto',
'Curso integral de React que cubre desde conceptos básicos hasta patrones avanzados. Incluye hooks, context, testing y optimización de performance.',
'Conviértete en experto en React con este curso completo',
'intermediate', 60, 4, 'active', TRUE),

(4, 'Machine Learning con Python', 'machine-learning-python',
'Introducción práctica al Machine Learning usando Python, scikit-learn y TensorFlow. Proyectos reales y casos de uso empresariales.',
'Aprende Machine Learning desde cero con proyectos prácticos',
'intermediate', 80, 4, 'active', FALSE);

COMMIT;
