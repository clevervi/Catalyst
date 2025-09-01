-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS catalyst_db;
USE catalyst_db;

-- Tabla de usuarios simplificada
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'recruiter', 'user') DEFAULT 'user',
    department VARCHAR(100),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de habilidades de usuarios simplificada
CREATE TABLE user_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill VARCHAR(100) NOT NULL,
    proficiency ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'intermediate',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de experiencia laboral simplificada
CREATE TABLE user_experience (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    position VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    current BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de empresas simplificada
CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de trabajos/empleos simplificada
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    modality ENUM('Remoto', 'Presencial', 'Híbrido') DEFAULT 'Presencial',
    location VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabla de aplicaciones a empleos simplificada
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('applied', 'review', 'interview', 'offer', 'rejected') DEFAULT 'applied',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, user_id)
);

-- Insertar datos iniciales

-- Insertar empresas de ejemplo
INSERT INTO companies (name, description, industry, website) VALUES
('Catalyst Tech', 'Empresa líder en desarrollo de software', 'Tecnología', 'https://catalyst-tech.com'),
('Innovate Solutions', 'Consultora especializada en transformación digital', 'Tecnología', 'https://innovatesolutions.com'),
('Future Dynamics', 'Startup enfocada en inteligencia artificial', 'Tecnología', 'https://futuredynamics.ai');

-- Insertar usuarios de demostración
INSERT INTO users (email, password, first_name, last_name, role, department) VALUES
('demo@catalyst.com', 'demo123', 'Usuario', 'Demo', 'user', NULL),
('hiring@catalyst.com', 'demo123', 'Gerente', 'Contratación', 'recruiter', 'Tecnología'),
('admin@catalyst.com', 'admin123', 'Administrador', 'Sistema', 'admin', 'Tecnología'),
('recruiter@catalyst.com', 'recruiter123', 'Reclutador', 'Talento', 'recruiter', 'Recursos Humanos');

-- Insertar trabajos de ejemplo
INSERT INTO jobs (company_id, title, description, requirements, modality, location, department, salary_min, salary_max, created_by) VALUES
(1, 'Desarrollador Frontend React', 'Buscamos un desarrollador Frontend con experiencia en React para unirse a nuestro equipo de producto.', 
'Experiencia con React, HTML5, CSS3 y JavaScript', 'Remoto', 'Buenos Aires, Argentina', 'Tecnología', 150000, 250000, 3),

(1, 'Backend Developer Node.js', 'Desarrollador Backend con experiencia en Node.js y bases de datos para APIs de alto rendimiento.', 
'Experiencia con Node.js, Express y bases de datos', 'Híbrido', 'Córdoba, Argentina', 'Tecnología', 200000, 350000, 3),

(2, 'Diseñador UX/UI', 'Diseñador con experiencia en interfaces de usuario y experiencia de usuario para aplicaciones web y móviles.', 
'Portfolio demostrable y experiencia con Figma', 'Remoto', 'Mendoza, Argentina', 'Tecnología', 120000, 180000, 3),

(3, 'Data Scientist', 'Especialista en datos para desarrollar modelos predictivos y análisis avanzados para nuestros productos.', 
'Experiencia con Python y machine learning', 'Presencial', 'Rosario, Argentina', 'Tecnología', 250000, 400000, 3);