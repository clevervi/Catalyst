/**
 * Location-based Portfolio Navigation System
 * Handles display and navigation for different office locations
 */

class LocationManager {
    constructor() {
        this.locations = [
            {
                id: 1,
                name: 'Sede Barranquilla',
                status: 'active',
                description: 'Explora los portfolios de profesionales de nuestra sede principal',
                icon: 'fas fa-map-marker-alt',
                color: '#007bff',
                portfolioUrl: './portfolio-barranquilla.html'
            },
            {
                id: 2,
                name: 'Sede Medellín',
                status: 'coming-soon',
                description: 'Próximamente disponible',
                icon: 'fas fa-clock',
                color: '#6c757d',
                portfolioUrl: null
            }
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderLocations();
    }

    // Setup event listeners for location cards
    setupEventListeners() {
        // Location navigation event listeners will be set up after rendering
    }

    // Render all locations
    renderLocations() {
        const container = document.getElementById('clan-list');
        if (!container) {
            console.error('Locations container not found');
            return;
        }

        // Show loading state
        container.innerHTML = this.getLoadingState();

        // Simulate loading delay for better UX
        setTimeout(() => {
            const locationsHTML = this.locations.map(location => this.createLocationCard(location)).join('');
            container.innerHTML = locationsHTML;
            
            // Initialize location event listeners
            this.initializeLocationListeners();
        }, 500);
    }

    // Create individual location card matching reference page structure
    createLocationCard(location) {
        const isActive = location.status === 'active';
        const locationImage = location.id === 1 ? 
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop' : 
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=150&h=150&fit=crop';
        
        const statusBadge = location.status === 'coming-soon' ? 
            '<span class="status-badge status-coming-soon">Próximamente</span>' : 
            '<span class="status-badge status-available">Disponible</span>';

        return `
            <article class="clan-card" data-location-id="${location.id}" style="position: relative;">
                ${statusBadge}
                <a class="clan-card__link" href="${location.portfolioUrl || '#'}" ${!isActive ? 'onclick="showComingSoonMessage(); return false;"' : ''}>
                    <img class="clan-card__img" src="${locationImage}" alt="${location.name}" />
                    <h2 class="clan-card__name">${location.name}</h2>
                </a>
            </article>
        `;
    }

    // Initialize location event listeners
    initializeLocationListeners() {
        // Location navigation buttons
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const locationId = parseInt(btn.dataset.locationId);
                const url = btn.dataset.url;
                this.navigateToLocation(locationId, url);
            });
        });

        // Card hover effects
        document.querySelectorAll('.location-card-inner.card-active').forEach(card => {
            const locationId = parseInt(card.closest('.location-card').dataset.locationId);
            const location = this.locations.find(l => l.id === locationId);
            
            if (location && location.portfolioUrl) {
                card.addEventListener('click', () => {
                    this.navigateToLocation(locationId, location.portfolioUrl);
                });

                // Add hover effect
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-5px)';
                    card.style.transition = 'all 0.3s ease';
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                });
            }
        });
    }

    // Navigate to location portfolio
    navigateToLocation(locationId, url) {
        const location = this.locations.find(l => l.id === locationId);
        
        if (!location || !url) {
            this.showError('Esta sede no está disponible aún');
            return;
        }

        // Show loading feedback
        const btn = document.querySelector(`[data-location-id="${locationId}"]`);
        if (btn) {
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Cargando...';
            btn.disabled = true;

            setTimeout(() => {
                window.location.href = url;
            }, 500);
        } else {
            window.location.href = url;
        }
    }



    // Animate cards on load
    animateCards() {
        const cards = document.querySelectorAll('.location-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Utility: Adjust color brightness
    adjustBrightness(color, percent) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        
        let r = (num >> 16) + percent;
        let g = (num >> 8 & 0x00FF) + percent;
        let b = (num & 0x0000FF) + percent;
        
        r = r > 255 ? 255 : r < 0 ? 0 : r;
        g = g > 255 ? 255 : g < 0 ? 0 : g;
        b = b > 255 ? 255 : b < 0 ? 0 : b;
        
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }

    // Loading state
    getLoadingState() {
        return `
            <article class="clan-card">
                <div class="clan-card__link" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px;">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="text-muted">Cargando sedes...</p>
                </div>
            </article>
        `;
    }

    // Empty state
    getEmptyState() {
        return `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-users-slash text-muted fa-4x mb-3"></i>
                    <h4 class="text-muted">No hay clanes disponibles</h4>
                    <p class="text-muted">Los clanes se mostrarán aquí cuando estén disponibles.</p>
                </div>
            </div>
        `;
    }

    // Show error message
    showError(message) {
        const container = document.getElementById('clans-container');
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger d-flex align-items-center" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <div>${message}</div>
                    </div>
                </div>
            `;
        } else {
            console.error(message);
        }
    }

    // Modal functionality
    showModal(title, content) {
        // Check if modal exists, if not create it
        let modal = document.getElementById('locationModal');
        if (!modal) {
            modal = this.createModal();
            document.body.appendChild(modal);
        }
        
        // Update modal content
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.innerHTML = content;
        
        // Show modal using Bootstrap
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        } else {
            // Fallback for when Bootstrap is not available
            modal.style.display = 'block';
            modal.classList.add('show');
        }
    }
    
    createModal() {
        const modalHTML = `
            <div class="modal fade" id="locationModal" tabindex="-1" aria-labelledby="locationModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="locationModalLabel">Información de Sede</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Content will be populated dynamically -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHTML;
        return modalElement.firstElementChild;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Location Manager...');
    window.locationManager = new LocationManager();
});

export default LocationManager;
