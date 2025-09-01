/**
 * Centralized Data Management System
 * Handles all data persistence and retrieval for the Catalyst HR System
 */

class DataManager {
    constructor() {
        this.initializeData();
    }

    // Initialize default data structures
    initializeData() {
        // Jobs data
        if (!localStorage.getItem('catalyst_jobs')) {
            const defaultJobs = this.generateDefaultJobs();
            localStorage.setItem('catalyst_jobs', JSON.stringify(defaultJobs));
        }

        // Users data
        if (!localStorage.getItem('catalyst_users')) {
            const defaultUsers = this.generateDefaultUsers();
            localStorage.setItem('catalyst_users', JSON.stringify(defaultUsers));
        }

        // Candidates data
        if (!localStorage.getItem('catalyst_candidates')) {
            const defaultCandidates = this.generateDefaultCandidates();
            localStorage.setItem('catalyst_candidates', JSON.stringify(defaultCandidates));
        }

        // Applications data
        if (!localStorage.getItem('catalyst_applications')) {
            const defaultApplications = this.generateDefaultApplications();
            localStorage.setItem('catalyst_applications', JSON.stringify(defaultApplications));
        }

        // Training courses data
        if (!localStorage.getItem('catalyst_courses')) {
            const defaultCourses = this.generateDefaultCourses();
            localStorage.setItem('catalyst_courses', JSON.stringify(defaultCourses));
        }

        // Company profiles data
        if (!localStorage.getItem('catalyst_companies')) {
            const defaultCompanies = this.generateDefaultCompanies();
            localStorage.setItem('catalyst_companies', JSON.stringify(defaultCompanies));
        }

        // Pipeline stages
        if (!localStorage.getItem('catalyst_pipeline_stages')) {
            const defaultStages = this.generateDefaultPipelineStages();
            localStorage.setItem('catalyst_pipeline_stages', JSON.stringify(defaultStages));
        }

        // Clans data
        if (!localStorage.getItem('catalyst_clans')) {
            const defaultClans = this.generateDefaultClans();
            localStorage.setItem('catalyst_clans', JSON.stringify(defaultClans));
        }
    }

    // Generate default jobs
    generateDefaultJobs() {
        return [
            {
                id: 1,
                title: "Senior Full Stack Developer",
                company: "TechCorp Solutions",
                location: "Bogotá, Colombia",
                type: "Tiempo Completo",
                level: "Senior",
                salary: "$4,500,000 - $6,000,000 COP",
                description: "Buscamos un desarrollador Full Stack experimentado para unirse a nuestro equipo de desarrollo de productos innovadores.",
                requirements: [
                    "5+ años de experiencia en desarrollo web",
                    "Experiencia con React, Node.js, y bases de datos",
                    "Conocimiento en arquitecturas de microservicios",
                    "Experiencia con metodologías ágiles"
                ],
                benefits: [
                    "Salario competitivo",
                    "Trabajo remoto flexible",
                    "Seguro médico completo",
                    "Días de vacaciones adicionales"
                ],
                skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "Docker"],
                posted: "2024-01-15",
                deadline: "2024-02-15",
                status: "active",
                applications: 24,
                image: "https://via.placeholder.com/600x300/4f46e5/white?text=Senior+Full+Stack+Developer"
            },
            {
                id: 2,
                title: "UI/UX Designer",
                company: "Design Studio Pro",
                location: "Medellín, Colombia",
                type: "Tiempo Completo",
                level: "Mid-Level",
                salary: "$3,200,000 - $4,500,000 COP",
                description: "Únete a nuestro equipo creativo para diseñar experiencias de usuario excepcionales.",
                requirements: [
                    "3+ años de experiencia en diseño UI/UX",
                    "Dominio de Figma, Sketch, y Adobe Creative Suite",
                    "Experiencia en diseño responsive",
                    "Portfolio sólido de proyectos"
                ],
                benefits: [
                    "Ambiente creativo",
                    "Horarios flexibles",
                    "Capacitaciones constantes",
                    "Equipos Mac"
                ],
                skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research"],
                posted: "2024-01-18",
                deadline: "2024-02-18",
                status: "active",
                applications: 18,
                image: "https://via.placeholder.com/600x300/06b6d4/white?text=UI/UX+Designer"
            },
            {
                id: 3,
                title: "DevOps Engineer",
                company: "CloudTech Solutions",
                location: "Remoto",
                type: "Tiempo Completo",
                level: "Senior",
                salary: "$5,000,000 - $7,000,000 COP",
                description: "Buscamos un ingeniero DevOps para optimizar nuestros procesos de desarrollo y despliegue.",
                requirements: [
                    "4+ años de experiencia en DevOps",
                    "Experiencia con AWS/Azure",
                    "Conocimiento en Docker y Kubernetes",
                    "Experiencia con CI/CD pipelines"
                ],
                benefits: [
                    "100% remoto",
                    "Bonos por productividad",
                    "Certificaciones pagadas",
                    "Equipos de última tecnología"
                ],
                skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
                posted: "2024-01-20",
                deadline: "2024-02-20",
                status: "active",
                applications: 31,
                image: "https://via.placeholder.com/600x300/10b981/white?text=DevOps+Engineer"
            },
            {
                id: 4,
                title: "Product Manager",
                company: "InnovaTech",
                location: "Cali, Colombia",
                type: "Tiempo Completo",
                level: "Senior",
                salary: "$4,800,000 - $6,500,000 COP",
                description: "Lidera el desarrollo de productos tecnológicos innovadores en un ambiente dinámico.",
                requirements: [
                    "5+ años de experiencia como Product Manager",
                    "MBA o experiencia equivalente",
                    "Experiencia con metodologías ágiles",
                    "Habilidades de liderazgo excepcionales"
                ],
                benefits: [
                    "Liderazgo de equipos",
                    "Stock options",
                    "Viajes internacionales",
                    "Plan de carrera estructurado"
                ],
                skills: ["Product Strategy", "Agile", "Analytics", "Leadership", "Market Research"],
                posted: "2024-01-22",
                deadline: "2024-02-22",
                status: "active",
                applications: 15,
                image: "https://via.placeholder.com/600x300/8b5cf6/white?text=Product+Manager"
            },
            {
                id: 5,
                title: "Data Scientist",
                company: "DataCorp Analytics",
                location: "Bogotá, Colombia",
                type: "Tiempo Completo",
                level: "Mid-Level",
                salary: "$4,000,000 - $5,500,000 COP",
                description: "Únete a nuestro equipo de ciencia de datos para crear modelos predictivos innovadores.",
                requirements: [
                    "3+ años de experiencia en ciencia de datos",
                    "Dominio de Python, R, y SQL",
                    "Experiencia con machine learning",
                    "Conocimientos de estadística avanzada"
                ],
                benefits: [
                    "Proyectos desafiantes",
                    "Conferencias internacionales",
                    "Investigación y desarrollo",
                    "Team building regular"
                ],
                skills: ["Python", "R", "SQL", "Machine Learning", "TensorFlow"],
                posted: "2024-01-25",
                deadline: "2024-02-25",
                status: "active",
                applications: 22,
                image: "https://via.placeholder.com/600x300/f59e0b/white?text=Data+Scientist"
            }
        ];
    }

    // Generate default users
    generateDefaultUsers() {
        return [
            {
                id: 1,
                email: "admin@catalyst.com",
                name: "María González",
                role: "admin",
                avatar: "https://via.placeholder.com/150/4f46e5/white?text=MG",
                position: "HR Director",
                department: "Human Resources",
                phone: "+57 300 123 4567",
                location: "Bogotá, Colombia",
                joinDate: "2022-01-15",
                status: "active",
                permissions: ["all"]
            },
            {
                id: 2,
                email: "recruiter@catalyst.com",
                name: "Carlos López",
                role: "recruiter",
                avatar: "https://via.placeholder.com/150/10b981/white?text=CL",
                position: "Senior Recruiter",
                department: "Human Resources",
                phone: "+57 300 234 5678",
                location: "Medellín, Colombia",
                joinDate: "2022-03-10",
                status: "active",
                permissions: ["jobs", "candidates", "interviews"]
            },
            {
                id: 3,
                email: "manager@catalyst.com",
                name: "Ana Rodríguez",
                role: "hiring_manager",
                avatar: "https://via.placeholder.com/150/8b5cf6/white?text=AR",
                position: "Engineering Manager",
                department: "Technology",
                phone: "+57 300 345 6789",
                location: "Cali, Colombia",
                joinDate: "2021-11-20",
                status: "active",
                permissions: ["interviews", "evaluations"]
            },
            {
                id: 4,
                email: "candidate@example.com",
                name: "Luis Martínez",
                role: "candidate",
                avatar: "https://via.placeholder.com/150/06b6d4/white?text=LM",
                position: "Software Developer",
                department: "",
                phone: "+57 300 456 7890",
                location: "Barranquilla, Colombia",
                joinDate: "2024-01-01",
                status: "active",
                permissions: ["profile", "applications"]
            }
        ];
    }

    // Generate default candidates
    generateDefaultCandidates() {
        return [
            {
                id: 1,
                name: "Carlos Rodríguez",
                email: "carlos.rodriguez@email.com",
                phone: "+57 300 111 2222",
                position: "Full Stack Developer",
                experience: "5 años",
                skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "Docker"],
                location: "Bogotá, Colombia",
                salary_expectation: "$5,000,000 COP",
                availability: "Inmediata",
                work_modality: "Remoto",
                languages: ["Español (Nativo)", "Inglés (B2)"],
                education: "Ingeniería de Sistemas - Universidad Nacional",
                summary: "Desarrollador Full Stack con 5 años de experiencia en tecnologías web modernas. Especializado en React y Node.js con experiencia en arquitecturas escalables.",
                avatar: "https://via.placeholder.com/150/4f46e5/white?text=CR",
                resume_url: "https://example.com/resume/carlos-rodriguez.pdf",
                status: "active",
                rating: 4.5,
                created_at: "2024-01-10",
                pipeline_stage: "screening"
            },
            {
                id: 2,
                name: "Ana María López",
                email: "ana.lopez@email.com",
                phone: "+57 300 222 3333",
                position: "UI/UX Designer",
                experience: "3 años",
                skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research"],
                location: "Medellín, Colombia",
                salary_expectation: "$3,800,000 COP",
                availability: "2 semanas",
                work_modality: "Híbrido",
                languages: ["Español (Nativo)", "Inglés (B1)"],
                education: "Diseño Gráfico - Universidad Pontificia Bolivariana",
                summary: "Diseñadora UI/UX apasionada por crear experiencias de usuario excepcionales. Experiencia en investigación de usuarios y prototipado.",
                avatar: "https://via.placeholder.com/150/06b6d4/white?text=AL",
                resume_url: "https://example.com/resume/ana-lopez.pdf",
                status: "active",
                rating: 4.2,
                created_at: "2024-01-12",
                pipeline_stage: "interview"
            },
            {
                id: 3,
                name: "Luis Fernando Silva",
                email: "luis.silva@email.com",
                phone: "+57 300 333 4444",
                position: "DevOps Engineer",
                experience: "4 años",
                skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
                location: "Cali, Colombia",
                salary_expectation: "$5,500,000 COP",
                availability: "1 mes",
                work_modality: "Remoto",
                languages: ["Español (Nativo)", "Inglés (C1)", "Portugués (A2)"],
                education: "Ingeniería de Sistemas - Universidad del Valle",
                summary: "Ingeniero DevOps con sólida experiencia en cloud computing y automatización. Certificado en AWS con experiencia en implementación de CI/CD.",
                avatar: "https://via.placeholder.com/150/10b981/white?text=LS",
                resume_url: "https://example.com/resume/luis-silva.pdf",
                status: "active",
                rating: 4.7,
                created_at: "2024-01-15",
                pipeline_stage: "technical"
            },
            {
                id: 4,
                name: "María José García",
                email: "maria.garcia@email.com",
                phone: "+57 300 444 5555",
                position: "Product Manager",
                experience: "6 años",
                skills: ["Product Strategy", "Agile", "Analytics", "Leadership", "Market Research"],
                location: "Bogotá, Colombia",
                salary_expectation: "$6,000,000 COP",
                availability: "Inmediata",
                work_modality: "Presencial",
                languages: ["Español (Nativo)", "Inglés (C2)", "Francés (B1)"],
                education: "MBA - Universidad de los Andes",
                summary: "Product Manager experimentada con historial comprobado en el lanzamiento de productos exitosos. Liderazgo de equipos multidisciplinarios.",
                avatar: "https://via.placeholder.com/150/8b5cf6/white?text=MG",
                resume_url: "https://example.com/resume/maria-garcia.pdf",
                status: "active",
                rating: 4.8,
                created_at: "2024-01-18",
                pipeline_stage: "offer"
            },
            {
                id: 5,
                name: "Diego Torres",
                email: "diego.torres@email.com",
                phone: "+57 300 555 6666",
                position: "Data Scientist",
                experience: "3 años",
                skills: ["Python", "R", "SQL", "Machine Learning", "TensorFlow"],
                location: "Medellín, Colombia",
                salary_expectation: "$4,200,000 COP",
                availability: "3 semanas",
                work_modality: "Híbrido",
                languages: ["Español (Nativo)", "Inglés (B2)"],
                education: "Matemáticas Aplicadas - Universidad EAFIT",
                summary: "Data Scientist con pasión por descubrir insights valiosos en los datos. Experiencia en modelos predictivos y análisis estadístico avanzado.",
                avatar: "https://via.placeholder.com/150/f59e0b/white?text=DT",
                resume_url: "https://example.com/resume/diego-torres.pdf",
                status: "active",
                rating: 4.3,
                created_at: "2024-01-20",
                pipeline_stage: "screening"
            }
        ];
    }

    // Generate default applications
    generateDefaultApplications() {
        return [
            { id: 1, job_id: 1, candidate_id: 1, status: "pending", applied_date: "2024-01-15", cover_letter: "Estimados señores, me dirijo a ustedes con el fin de postularme para la posición..." },
            { id: 2, job_id: 2, candidate_id: 2, status: "interview", applied_date: "2024-01-16", cover_letter: "Me complace postularme para la posición de UI/UX Designer..." },
            { id: 3, job_id: 3, candidate_id: 3, status: "technical", applied_date: "2024-01-17", cover_letter: "Con gran interés me postulo para la posición de DevOps Engineer..." },
            { id: 4, job_id: 4, candidate_id: 4, status: "offer", applied_date: "2024-01-18", cover_letter: "Es un placer postularme como Product Manager..." },
            { id: 5, job_id: 5, candidate_id: 5, status: "screening", applied_date: "2024-01-19", cover_letter: "Me dirijo a ustedes para expresar mi interés en la posición de Data Scientist..." }
        ];
    }

    // Generate default courses
    generateDefaultCourses() {
        return [
            {
                id: 1,
                title: "Desarrollo Web Fullstack con React y Node.js",
                instructor: "Carlos Mendoza",
                duration: "40 horas",
                level: "Intermedio",
                price: "$299,000 COP",
                description: "Aprende a desarrollar aplicaciones web completas desde cero utilizando las tecnologías más demandadas del mercado. Este curso cubre tanto el frontend con React como el backend con Node.js, incluyendo autenticación, bases de datos y despliegue en la nube.",
                skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "JWT", "Git"],
                objectives: "• Dominar JavaScript moderno (ES6+) y sus características avanzadas\n• Crear interfaces interactivas y responsivas con React\n• Desarrollar APIs RESTful robustas con Node.js y Express\n• Integrar bases de datos MongoDB y realizar operaciones CRUD\n• Implementar sistemas de autenticación y autorización seguros\n• Aplicar mejores prácticas de desarrollo y testing",
                prerequisites: "Conocimientos básicos de HTML, CSS y JavaScript. Familiaridad con programación orientada a objetos.",
                startDate: "2024-08-15",
                endDate: "2024-10-15",
                status: "active",
                category: "Technology",
                maxStudents: 30,
                certification: true,
                mandatory: false,
                created_date: "2024-01-10",
                students: 18,
                rating: 4.7,
                image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
            },
            {
                id: 2,
                title: "Diseño UI/UX Avanzado: De la Investigación al Prototipo",
                instructor: "Laura Gómez",
                duration: "32 horas",
                level: "Avanzado",
                price: "$349,000 COP",
                description: "Perfecciona tus habilidades de diseño UI/UX con técnicas avanzadas de investigación de usuarios, metodologías de trabajo profesionales y las últimas tendencias del diseño digital. Incluye proyectos reales y mentorías personalizadas.",
                skills: ["Figma", "Adobe XD", "Design Thinking", "Prototyping", "User Research", "Design Systems", "Usability Testing"],
                objectives: "• Aplicar metodologías avanzadas de investigación de usuarios\n• Crear sistemas de diseño escalables y consistentes\n• Implementar prototipos interactivos de alta fidelidad\n• Realizar pruebas de usabilidad efectivas y analizar resultados\n• Optimizar flujos de trabajo en equipos de diseño multidisciplinarios\n• Dominar herramientas profesionales de diseño",
                prerequisites: "Experiencia básica en diseño de interfaces, conocimiento de herramientas de diseño (Figma o Sketch) y comprensión de principios básicos de UX.",
                startDate: "2024-09-01",
                endDate: "2024-10-30",
                status: "active",
                category: "Design",
                maxStudents: 25,
                certification: true,
                mandatory: false,
                created_date: "2024-01-15",
                students: 12,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
            },
            {
                id: 3,
                title: "Liderazgo Transformacional y Gestión de Equipos",
                instructor: "Dr. Javier Ramírez",
                duration: "24 horas",
                level: "Principiante",
                price: "$259,000 COP",
                description: "Desarrolla las habilidades necesarias para liderar equipos de manera efectiva en la era digital. Aprende a gestionar conflictos, motivar equipos diversos y crear culturas de alto rendimiento en entornos profesionales modernos.",
                skills: ["Liderazgo", "Comunicación", "Gestión de Conflictos", "Motivación", "Delegación", "Coaching", "Team Building"],
                objectives: "• Identificar y aplicar diferentes estilos de liderazgo según el contexto\n• Desarrollar habilidades de comunicación asertiva y empática\n• Implementar técnicas avanzadas de resolución de conflictos\n• Crear estrategias de motivación personalizadas para cada miembro del equipo\n• Establecer sistemas de retroalimentación constructiva y continua\n• Fomentar la innovación y creatividad en equipos",
                prerequisites: "No requiere conocimientos previos específicos. Ideal para supervisores, coordinadores o profesionales que aspiran a roles de liderazgo.",
                startDate: "2024-09-15",
                endDate: "2024-10-15",
                status: "upcoming",
                category: "Management",
                maxStudents: 20,
                certification: true,
                mandatory: true,
                created_date: "2024-01-20",
                students: 0,
                rating: 0,
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
            },
            {
                id: 4,
                title: "Machine Learning y Deep Learning con Python",
                instructor: "Dr. Ana Patricia Silva",
                duration: "50 horas",
                level: "Avanzado",
                price: "$449,000 COP",
                description: "Domina los conceptos y técnicas fundamentales del machine learning y deep learning utilizando Python. Desde algoritmos básicos hasta redes neuronales avanzadas, con proyectos prácticos en datasets reales.",
                skills: ["Python", "Scikit-learn", "TensorFlow", "Keras", "Data Analysis", "Deep Learning", "Computer Vision", "NLP"],
                objectives: "• Implementar algoritmos de machine learning desde cero\n• Analizar y preparar datasets complejos para modelado\n• Crear modelos predictivos robustos y precisos\n• Evaluar y optimizar modelos usando técnicas avanzadas\n• Aplicar técnicas de deep learning para problemas complejos\n• Desarrollar aplicaciones de computer vision y procesamiento de lenguaje natural",
                prerequisites: "Conocimiento sólido de Python, estadística básica y álgebra lineal. Experiencia con pandas y numpy es recomendable.",
                startDate: "2024-10-01",
                endDate: "2024-12-15",
                status: "upcoming",
                category: "Technology",
                maxStudents: 15,
                certification: true,
                mandatory: false,
                created_date: "2024-01-25",
                students: 0,
                rating: 0,
                image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
            },
            {
                id: 5,
                title: "Marketing Digital y Growth Hacking",
                instructor: "Camila Torres",
                duration: "35 horas",
                level: "Intermedio",
                price: "$289,000 COP",
                description: "Aprende las estrategias más efectivas de marketing digital y técnicas de growth hacking. Domina herramientas de analytics, SEO/SEM, redes sociales y automatización para hacer crecer cualquier negocio digitalmente.",
                skills: ["Google Analytics", "SEO", "SEM", "Social Media", "Content Marketing", "Email Marketing", "Growth Hacking", "A/B Testing"],
                objectives: "• Crear estrategias de marketing digital integral y medible\n• Implementar campañas de SEO y SEM altamente efectivas\n• Analizar métricas avanzadas y KPIs para toma de decisiones\n• Optimizar conversiones y maximizar ROI\n• Gestionar presencia profesional en redes sociales\n• Aplicar técnicas de growth hacking para crecimiento acelerado",
                prerequisites: "Conocimientos básicos de marketing, uso avanzado de internet y redes sociales. Experiencia con herramientas de oficina.",
                startDate: "2024-08-20",
                endDate: "2024-10-05",
                status: "active",
                category: "Marketing",
                maxStudents: 35,
                certification: true,
                mandatory: false,
                created_date: "2024-01-30",
                students: 22,
                rating: 4.6,
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
            },
            {
                id: 6,
                title: "Gestión Ágil de Proyectos - Scrum Master Certificado",
                instructor: "Roberto Jiménez",
                duration: "28 horas",
                level: "Intermedio",
                price: "Gratis",
                description: "Conviértete en un Scrum Master certificado y lidera equipos ágiles hacia el éxito. Curso oficial preparatorio para la certificación PSM I con simulacros de examen y proyectos prácticos.",
                skills: ["Scrum", "Agile", "Facilitation", "Team Management", "Sprint Planning", "Kanban", "Lean"],
                objectives: "• Dominar el framework Scrum y sus roles completamente\n• Facilitar ceremonias ágiles de manera efectiva\n• Resolver impedimentos y gestionar conflictos en equipos\n• Aplicar técnicas de coaching para equipos de desarrollo\n• Prepararse exitosamente para la certificación PSM I\n• Implementar métricas ágiles para mejora continua",
                prerequisites: "Experiencia básica en gestión de proyectos o desarrollo de software. Conocimiento de metodologías tradicionales es útil pero no necesario.",
                startDate: "2024-09-10",
                endDate: "2024-10-20",
                status: "active",
                category: "Management",
                maxStudents: 25,
                certification: true,
                mandatory: true,
                created_date: "2024-02-05",
                students: 8,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
            },
            {
                id: 7,
                title: "Inteligencia Artificial para Negocios",
                instructor: "Dr. Miguel Ángel Rojas",
                duration: "30 horas",
                level: "Principiante",
                price: "$199,000 COP",
                description: "Descubre cómo la inteligencia artificial puede transformar tu negocio. Curso práctico para profesionales no técnicos que quieren entender y aplicar IA en sus organizaciones.",
                skills: ["IA Strategy", "ChatGPT", "Automation", "Business Intelligence", "No-Code AI", "Data Visualization"],
                objectives: "• Comprender los fundamentos de la inteligencia artificial\n• Identificar oportunidades de IA en diferentes industrias\n• Implementar soluciones de IA sin programación\n• Crear estrategias de adopción de IA empresarial\n• Evaluar proveedores y herramientas de IA\n• Gestionar proyectos de transformación digital",
                prerequisites: "No requiere conocimientos técnicos. Ideal para gerentes, directores y profesionales de negocios.",
                startDate: "2024-09-05",
                endDate: "2024-10-10",
                status: "active",
                category: "Technology",
                maxStudents: 40,
                certification: true,
                mandatory: false,
                created_date: "2024-02-10",
                students: 15,
                rating: 4.5,
                image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
            },
            {
                id: 8,
                title: "Ciberseguridad y Protección de Datos",
                instructor: "Ing. Sandra Morales",
                duration: "36 horas",
                level: "Intermedio",
                price: "$399,000 COP",
                description: "Aprende a proteger sistemas y datos en un mundo digital cada vez más vulnerable. Curso práctico que cubre desde fundamentos de seguridad hasta implementación de medidas de protección avanzadas.",
                skills: ["Cybersecurity", "Ethical Hacking", "Network Security", "Encryption", "Risk Assessment", "GDPR", "Incident Response"],
                objectives: "• Identificar vulnerabilidades comunes en sistemas\n• Implementar medidas de seguridad preventivas\n• Realizar auditorías de seguridad básicas\n• Crear políticas de protección de datos\n• Responder efectivamente a incidentes de seguridad\n• Cumplir con regulaciones de protección de datos",
                prerequisites: "Conocimientos básicos de redes e informática. Experiencia administrando sistemas es recomendable.",
                startDate: "2024-09-20",
                endDate: "2024-11-15",
                status: "upcoming",
                category: "Technology",
                maxStudents: 20,
                certification: true,
                mandatory: false,
                created_date: "2024-02-15",
                students: 0,
                rating: 0,
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
            },
            {
                id: 9,
                title: "Comunicación Efectiva y Presentaciones Impactantes",
                instructor: "Patricia Herrera",
                duration: "20 horas",
                level: "Principiante",
                price: "$189,000 COP",
                description: "Desarrolla habilidades de comunicación que te permitan presentar ideas con claridad y persuasión. Incluye técnicas de oratoria, storytelling y manejo de herramientas digitales para presentaciones.",
                skills: ["Public Speaking", "Storytelling", "PowerPoint", "Body Language", "Persuasion", "Presentation Design"],
                objectives: "• Superar el miedo escénico y ganar confianza al hablar\n• Estructurar presentaciones persuasivas y memorables\n• Aplicar técnicas de storytelling para conectar con la audiencia\n• Dominar el lenguaje corporal y la comunicación no verbal\n• Crear slides visuales impactantes y profesionales\n• Manejar preguntas difíciles y situaciones imprevistas",
                prerequisites: "No requiere experiencia previa. Abierto a todos los profesionales que deseen mejorar sus habilidades de comunicación.",
                startDate: "2024-08-25",
                endDate: "2024-09-25",
                status: "active",
                category: "Soft Skills",
                maxStudents: 30,
                certification: true,
                mandatory: false,
                created_date: "2024-02-20",
                students: 25,
                rating: 4.7,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
            }
        ];
    }

    // Generate default companies
    generateDefaultCompanies() {
        return [
            {
                id: 1,
                name: "TechCorp Solutions",
                description: "Empresa líder en desarrollo de software empresarial con más de 10 años de experiencia.",
                industry: "Tecnología",
                size: "201-500 empleados",
                location: "Bogotá, Colombia",
                website: "https://techcorp.com",
                logo: "https://via.placeholder.com/200x200/4f46e5/white?text=TC",
                jobs_posted: 8,
                rating: 4.5,
                benefits: ["Seguro médico", "Trabajo remoto", "Capacitaciones", "Bonos"],
                culture: "Innovadora, colaborativa, orientada a resultados"
            },
            {
                id: 2,
                name: "Design Studio Pro",
                description: "Estudio de diseño especializado en experiencias digitales excepcionales.",
                industry: "Diseño y Marketing",
                size: "51-100 empleados",
                location: "Medellín, Colombia",
                website: "https://designstudiopro.com",
                logo: "https://via.placeholder.com/200x200/06b6d4/white?text=DS",
                jobs_posted: 5,
                rating: 4.3,
                benefits: ["Horarios flexibles", "Ambiente creativo", "Equipos Mac", "Días libres"],
                culture: "Creativa, flexible, enfocada en el usuario"
            }
        ];
    }

    // Generate default pipeline stages
    generateDefaultPipelineStages() {
        return [
            { id: 1, name: "Aplicación Recibida", key: "application", color: "#6b7280", order: 1 },
            { id: 2, name: "Screening Inicial", key: "screening", color: "#3b82f6", order: 2 },
            { id: 3, name: "Entrevista HR", key: "interview", color: "#8b5cf6", order: 3 },
            { id: 4, name: "Evaluación Técnica", key: "technical", color: "#f59e0b", order: 4 },
            { id: 5, name: "Entrevista Final", key: "final", color: "#10b981", order: 5 },
            { id: 6, name: "Oferta Enviada", key: "offer", color: "#06b6d4", order: 6 },
            { id: 7, name: "Contratado", key: "hired", color: "#10b981", order: 7 },
            { id: 8, name: "Rechazado", key: "rejected", color: "#ef4444", order: 8 }
        ];
    }

    // Generate default clans
    generateDefaultClans() {
        return [
            {
                id: 1,
                name: "Macondo",
                description: "Clan de innovadores y visionarios que lideran el cambio tecnológico en la organización.",
                color: "#4f46e5",
                icon: "fas fa-lightbulb",
                members: [
                    {
                        id: 1,
                        name: "Gabriel Márquez",
                        position: "Tech Lead",
                        description: "Líder tecnológico con visión estratégica para proyectos de alta complejidad.",
                        avatar: "https://via.placeholder.com/150/4f46e5/white?text=GM",
                        skills: ["JavaScript", "Python", "Cloud Architecture", "Team Leadership"],
                        experience: "8 años",
                        email: "gabriel.marquez@catalyst.com",
                        portfolio: {
                            projects: [
                                {
                                    name: "Sistema de Gestión Empresarial",
                                    description: "Plataforma completa de gestión con microservicios y arquitectura escalable.",
                                    technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
                                    image: "https://via.placeholder.com/300x200/4f46e5/white?text=ERP+System",
                                    link: "#"
                                },
                                {
                                    name: "App Móvil de Productividad",
                                    description: "Aplicación móvil híbrida para gestión de tareas y proyectos.",
                                    technologies: ["React Native", "Firebase", "Redux"],
                                    image: "https://via.placeholder.com/300x200/4f46e5/white?text=Mobile+App",
                                    link: "#"
                                }
                            ],
                            achievements: [
                                "Certificación AWS Solutions Architect",
                                "Líder de equipo de 12 desarrolladores",
                                "Implementación de CI/CD en 15 proyectos"
                            ]
                        }
                    },
                    {
                        id: 2,
                        name: "Remedios Buendía",
                        position: "Senior Full Stack Developer",
                        description: "Desarrolladora full stack especializada en soluciones web innovadoras.",
                        avatar: "https://via.placeholder.com/150/4f46e5/white?text=RB",
                        skills: ["Vue.js", "Django", "PostgreSQL", "AWS"],
                        experience: "6 años",
                        email: "remedios.buendia@catalyst.com",
                        portfolio: {
                            projects: [
                                {
                                    name: "E-commerce B2B",
                                    description: "Plataforma de comercio electrónico para empresas con integración de pagos.",
                                    technologies: ["Vue.js", "Django", "Stripe API", "Redis"],
                                    image: "https://via.placeholder.com/300x200/4f46e5/white?text=E-commerce",
                                    link: "#"
                                }
                            ],
                            achievements: [
                                "Optimización de rendimiento 40%",
                                "Mentora de 5 desarrolladores junior",
                                "Especialista en UX/UI funcional"
                            ]
                        }
                    }
                ]
            },
            {
                id: 2,
                name: "Manglar",
                description: "Especialistas en infraestructura y DevOps que mantienen la estabilidad de nuestros sistemas.",
                color: "#059669",
                icon: "fas fa-server",
                members: [
                    {
                        id: 3,
                        name: "Florentino Ariza",
                        position: "DevOps Engineer",
                        description: "Especialista en automatización y despliegue continuo con experiencia en cloud.",
                        avatar: "https://via.placeholder.com/150/059669/white?text=FA",
                        skills: ["Kubernetes", "Terraform", "AWS", "Jenkins"],
                        experience: "5 años",
                        email: "florentino.ariza@catalyst.com",
                        portfolio: {
                            projects: [
                                {
                                    name: "Infraestructura como Código",
                                    description: "Implementación de IaC usando Terraform para múltiples entornos.",
                                    technologies: ["Terraform", "AWS", "Kubernetes", "Helm"],
                                    image: "https://via.placeholder.com/300x200/059669/white?text=IaC",
                                    link: "#"
                                }
                            ],
                            achievements: [
                                "Reducción de downtime en 95%",
                                "Automatización de 20 procesos",
                                "Certificación Kubernetes Administrator"
                            ]
                        }
                    },
                    {
                        id: 4,
                        name: "Fermina Daza",
                        position: "Site Reliability Engineer",
                        description: "Ingeniera SRE enfocada en la confiabilidad y monitoreo de sistemas críticos.",
                        avatar: "https://via.placeholder.com/150/059669/white?text=FD",
                        skills: ["Prometheus", "Grafana", "Docker", "Python"],
                        experience: "4 años",
                        email: "fermina.daza@catalyst.com",
                        portfolio: {
                            projects: [
                                {
                                    name: "Sistema de Monitoreo Integral",
                                    description: "Plataforma de observabilidad con alertas inteligentes y dashboards.",
                                    technologies: ["Prometheus", "Grafana", "AlertManager", "ELK Stack"],
                                    image: "https://via.placeholder.com/300x200/059669/white?text=Monitoring",
                                    link: "#"
                                }
                            ],
                            achievements: [
                                "SLA del 99.9% en servicios críticos",
                                "Implementación de chaos engineering",
                                "Reducción de MTTR en 60%"
                            ]
                        }
                    }
                ]
            },
            {
                id: 3,
                name: "Cayena",
                description: "Expertos en datos y inteligencia artificial que extraen valor de la información.",
                color: "#dc2626",
                icon: "fas fa-chart-line",
                members: [
                    {
                        id: 5,
                        name: "Aureliano Babilonia",
                        position: "Data Scientist",
                        description: "Científico de datos especializado en machine learning y análisis predictivo.",
                        avatar: "https://via.placeholder.com/150/dc2626/white?text=AB",
                        skills: ["Python", "TensorFlow", "Pandas", "SQL"],
                        experience: "5 años",
                        email: "aureliano.babilonia@catalyst.com",
                        portfolio: {
                            projects: [
                                {
                                    name: "Motor de Recomendaciones IA",
                                    description: "Sistema de recomendaciones basado en deep learning para e-commerce.",
                                    technologies: ["TensorFlow", "Python", "Apache Spark", "Kafka"],
                                    image: "https://via.placeholder.com/300x200/dc2626/white?text=AI+Engine",
                                    link: "#"
                                }
                            ],
                            achievements: [
                                "Modelo predictivo con 92% de precisión",
                                "Procesamiento de 10M+ registros diarios",
                                "Certificación TensorFlow Developer"
                            ]
                        }
                    },
                    {
                        id: 6,
                        name: "Amaranta Úrsula",
                        position: "Data Engineer",
                        description: "Ingeniera de datos enfocada en pipelines y arquitecturas de big data.",
                        avatar: "https://via.placeholder.com/150/dc2626/white?text=AU",
                        skills: ["Apache Spark", "Kafka", "Airflow", "Snowflake"],
                        experience: "4 años",
                        email: "amaranta.ursula@catalyst.com",
                        portfolio: {
                            projects: [
                                {
                                    name: "Pipeline de Datos en Tiempo Real",
                                    description: "Arquitectura de streaming para procesamiento de datos en tiempo real.",
                                    technologies: ["Kafka", "Spark Streaming", "Delta Lake", "Airflow"],
                                    image: "https://via.placeholder.com/300x200/dc2626/white?text=Data+Pipeline",
                                    link: "#"
                                }
                            ],
                            achievements: [
                                "Pipeline procesando 50TB diarios",
                                "Reducción de latencia en 80%",
                                "Arquitectura event-driven escalable"
                            ]
                        }
                    }
                ]
            },
            {
                id: 4,
                name: "Tayrona",
                description: "Diseñadores y especialistas en experiencia de usuario que crean interfaces excepcionales.",
                color: "#8b5cf6",
                icon: "fas fa-palette",
                members: [
                    {
                        id: 7,
                        name: "Petra Cotes",
                        position: "UX/UI Designer",
                        description: "Diseñadora UX/UI especializada en investigación de usuarios y diseño centrado en el usuario.",
                        avatar: "https://via.placeholder.com/150/8b5cf6/white?text=PC",
                        skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
                        experience: "6 años",
                        email: "petra.cotes@catalyst.com",
                        portfolio: {
                            projects: [
                                {
                                    name: "Sistema de Design System",
                                    description: "Design system completo con componentes reutilizables y guías de estilo.",
                                    technologies: ["Figma", "Storybook", "Tokens Studio", "React"],
                                    image: "https://via.placeholder.com/300x200/8b5cf6/white?text=Design+System",
                                    link: "#"
                                }
                            ],
                            achievements: [
                                "Incremento de 40% en satisfacción del usuario",
                                "Design system adoptado en 25 productos",
                                "Certificación Google UX Design"
                            ]
                        }
                    },
                    {
                        id: 8,
                        name: "Rodrigo Rosario",
                        position: "Frontend Developer",
                        description: "Desarrollador frontend especializado en React y animaciones web avanzadas.",
                        avatar: "https://via.placeholder.com/150/8b5cf6/white?text=RR",
                        skills: ["React", "TypeScript", "Three.js", "GSAP"],
                        experience: "4 años",
                        email: "rodrigo.rosario@catalyst.com",
                        portfolio: {
                            projects: [
                                {
                                    name: "Portfolio Interactivo 3D",
                                    description: "Sitio web con experiencias 3D inmersivas usando WebGL.",
                                    technologies: ["Three.js", "React", "WebGL", "GSAP"],
                                    image: "https://via.placeholder.com/300x200/8b5cf6/white?text=3D+Portfolio",
                                    link: "#"
                                }
                            ],
                            achievements: [
                                "Optimización de performance en 50%",
                                "Creación de 15+ componentes reutilizables",
                                "Experto en animaciones web modernas"
                            ]
                        }
                    }
                ]
            }
        ];
    }

    // Generic CRUD operations
    getData(key) {
        try {
            const data = localStorage.getItem(`catalyst_${key}`);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error getting data for key: ${key}`, error);
            return [];
        }
    }

    setData(key, data) {
        try {
            localStorage.setItem(`catalyst_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error setting data for key: ${key}`, error);
            return false;
        }
    }

    // Specific data operations
    getJobs() { return this.getData('jobs'); }
    setJobs(jobs) { return this.setData('jobs', jobs); }

    getUsers() { return this.getData('users'); }
    setUsers(users) { return this.setData('users', users); }

    getCandidates() { return this.getData('candidates'); }
    setCandidates(candidates) { return this.setData('candidates', candidates); }

    getApplications() { return this.getData('applications'); }
    setApplications(applications) { return this.setData('applications', applications); }

    getCourses() { return this.getData('courses'); }
    setCourses(courses) { return this.setData('courses', courses); }

    getCompanies() { return this.getData('companies'); }
    setCompanies(companies) { return this.setData('companies', companies); }

    getPipelineStages() { return this.getData('pipeline_stages'); }
    setPipelineStages(stages) { return this.setData('pipeline_stages', stages); }

    getClans() { return this.getData('clans'); }
    setClans(clans) { return this.setData('clans', clans); }

    // Export data
    exportData(type = 'all') {
        const exportData = {};
        
        if (type === 'all' || type === 'jobs') exportData.jobs = this.getJobs();
        if (type === 'all' || type === 'users') exportData.users = this.getUsers();
        if (type === 'all' || type === 'candidates') exportData.candidates = this.getCandidates();
        if (type === 'all' || type === 'applications') exportData.applications = this.getApplications();
        if (type === 'all' || type === 'courses') exportData.courses = this.getCourses();
        if (type === 'all' || type === 'companies') exportData.companies = this.getCompanies();

        return exportData;
    }

    // Import data
    importData(data) {
        try {
            if (data.jobs) this.setJobs(data.jobs);
            if (data.users) this.setUsers(data.users);
            if (data.candidates) this.setCandidates(data.candidates);
            if (data.applications) this.setApplications(data.applications);
            if (data.courses) this.setCourses(data.courses);
            if (data.companies) this.setCompanies(data.companies);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Utility functions
    generateId(type) {
        const data = this.getData(type);
        return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    }

    findById(type, id) {
        const data = this.getData(type);
        return data.find(item => item.id === parseInt(id));
    }

    updateById(type, id, updates) {
        const data = this.getData(type);
        const index = data.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            return this.setData(type, data);
        }
        return false;
    }

    deleteById(type, id) {
        const data = this.getData(type);
        const filtered = data.filter(item => item.id !== parseInt(id));
        return this.setData(type, filtered);
    }

    // Search and filter functions
    searchItems(type, query, fields = ['name', 'title']) {
        const data = this.getData(type);
        if (!query) return data;
        
        return data.filter(item => 
            fields.some(field => 
                item[field] && item[field].toLowerCase().includes(query.toLowerCase())
            )
        );
    }

    filterItems(type, filters) {
        const data = this.getData(type);
        return data.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                return item[key] && item[key].toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }
}

// Export/Import utilities
export class ExportImportManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    // Export to JSON file
    exportToFile(data, filename = 'catalyst_data.json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Export to CSV
    exportToCSV(data, filename = 'catalyst_data.csv') {
        if (!Array.isArray(data) || data.length === 0) return;
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import from file
    importFromFile(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const success = this.dataManager.importData(data);
                callback(success, data);
            } catch (error) {
                callback(false, null, error);
            }
        };
        reader.readAsText(file);
    }
}

// Global instance
export const dataManager = new DataManager();
export const exportImportManager = new ExportImportManager(dataManager);

// Make available globally for backward compatibility
window.dataManager = dataManager;
window.exportImportManager = exportImportManager;
