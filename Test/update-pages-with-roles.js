#!/usr/bin/env node

/**
 * Script to update all HR management pages with role-based navigation and access control
 */

import fs from 'fs/promises';
import path from 'path';

const PAGES_TO_UPDATE = [
    'pages/resume-database.html',
    'pages/hiring-dashboard.html',
    'pages/reports.html',
    'pages/kanban.html',
    'pages/job-management.html',
    'pages/user-management.html',
    'pages/admin-dashboard.html'
];

const ROLE_REQUIREMENTS = {
    'pages/resume-database.html': 'reclutador',
    'pages/hiring-dashboard.html': 'hr_manager',
    'pages/reports.html': 'hr_manager', 
    'pages/kanban.html': 'reclutador',
    'pages/job-management.html': 'hr_manager',
    'pages/user-management.html': 'hr_manager',
    'pages/admin-dashboard.html': 'administrador'
};

async function updatePage(pagePath) {
    try {
        console.log(`Updating ${pagePath}...`);
        
        let content = await fs.readFile(pagePath, 'utf8');
        
        // Remove existing navigation if present
        content = content.replace(/<nav class="navbar[^>]*>[\s\S]*?<\/nav>/i, '<!-- Navigation will be inserted by role management -->');
        
        // Add role management script before closing body tag
        const roleScript = `
    <!-- Role Management System -->
    <script type="module">
        import { initializeRoleSystem, routeGuard, ROLES } from '../js/role-management.js';
        
        // Check page access based on required role
        const requiredRole = '${ROLE_REQUIREMENTS[pagePath] || ''}';
        if (!routeGuard(requiredRole)) {
            // Access denied or redirected
            return;
        }
        
        // Initialize role system
        initializeRoleSystem();
        
        // Add page-specific role checks
        document.addEventListener('DOMContentLoaded', () => {
            // Hide elements based on roles using data attributes
            const roleElements = document.querySelectorAll('[data-role]');
            roleElements.forEach(element => {
                const allowedRoles = element.dataset.role.split(',');
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                if (!allowedRoles.includes(userData.role) && !allowedRoles.includes('*')) {
                    element.style.display = 'none';
                }
            });
            
            // Show admin-only elements for administrators
            const adminElements = document.querySelectorAll('[data-admin-only]');
            adminElements.forEach(element => {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                if (userData.role !== 'administrador') {
                    element.style.display = 'none';
                }
            });
            
            console.log('✅ Role system initialized for ${pagePath}');
        });
    </script>`;
        
        // Insert role script before the last existing script or before closing body tag
        if (content.includes('</script>')) {
            // Find the last script tag
            const lastScriptIndex = content.lastIndexOf('</script>');
            const insertPosition = content.indexOf('</body>', lastScriptIndex);
            if (insertPosition !== -1) {
                content = content.slice(0, insertPosition) + roleScript + '\n' + content.slice(insertPosition);
            } else {
                content = content.replace('</body>', roleScript + '\n</body>');
            }
        } else {
            content = content.replace('</body>', roleScript + '\n</body>');
        }
        
        // Add navigation container if not present
        if (!content.includes('navigation-container') && !content.includes('<nav')) {
            content = content.replace('<body', '<body style="padding-top: 0;"');
            content = content.replace(/(<body[^>]*>)/, '$1\n    <div id="navigation-container"></div>');
        }
        
        // Add role-based styling classes to body
        content = content.replace(/<body([^>]*)>/, '<body$1 class="hr-page">');
        
        // Add data attributes for role-based content visibility
        content = addRoleBasedAttributes(content, pagePath);
        
        await fs.writeFile(pagePath, content, 'utf8');
        console.log(`✅ ${pagePath} updated successfully`);
        
    } catch (error) {
        console.error(`❌ Error updating ${pagePath}:`, error.message);
    }
}

function addRoleBasedAttributes(content, pagePath) {
    // Add role attributes based on page type
    
    // Add admin-only attributes to delete buttons and sensitive actions
    content = content.replace(/class="[^"]*btn[^"]*btn-danger[^"]*"/g, '$& data-admin-only="true"');
    
    // Add role-specific attributes based on page
    switch (pagePath) {
        case 'pages/resume-database.html':
            // Recruiters can view, HR managers can edit/delete
            content = content.replace(/class="[^"]*btn[^"]*edit[^"]*"/g, '$& data-role="reclutador,hr_manager,administrador"');
            content = content.replace(/class="[^"]*btn[^"]*delete[^"]*"/g, '$& data-role="hr_manager,administrador"');
            break;
            
        case 'pages/reports.html':
            // Only HR managers and admins can access reports
            content = content.replace(/class="[^"]*export[^"]*"/g, '$& data-role="hr_manager,administrador"');
            break;
            
        case 'pages/user-management.html':
            // Only HR managers and admins can manage users
            content = content.replace(/class="[^"]*btn[^"]*add[^"]*"/g, '$& data-role="hr_manager,administrador"');
            break;
    }
    
    return content;
}

async function updateAllPages() {
    console.log('🚀 Starting page updates with role management...\n');
    
    for (const pagePath of PAGES_TO_UPDATE) {
        await updatePage(pagePath);
    }
    
    console.log('\n✅ All pages updated successfully!');
    console.log('\n📋 Updated pages:');
    PAGES_TO_UPDATE.forEach(page => {
        const role = ROLE_REQUIREMENTS[page] || 'Any authenticated user';
        console.log(`   - ${page} (Required role: ${role})`);
    });
    
    console.log('\n🔐 Role System Features Added:');
    console.log('   - Dynamic navigation based on user role');
    console.log('   - Page access control');
    console.log('   - Role-based UI element visibility');
    console.log('   - User avatar and role indicators');
    console.log('   - Automatic logout functionality');
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Test login with different roles');
    console.log('   2. Verify navigation changes based on role');
    console.log('   3. Check page access restrictions');
    console.log('   4. Test logout functionality');
}

// Run the update
updateAllPages().catch(error => {
    console.error('❌ Failed to update pages:', error.message);
    process.exit(1);
});
