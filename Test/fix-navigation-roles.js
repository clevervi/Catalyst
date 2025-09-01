/**
 * Script to fix navigation role attributes to match ROLES constants
 */

import fs from 'fs';
import path from 'path';

const ROLE_MAPPINGS = {
    'talent_human_team': 'recruiter',
    'administrator': 'admin',
    'hiring_manager': 'hiring_manager'
};

function fixNavigationFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix role attributes in navigation
    content = content.replace(/data-role="talent_human_team,administrator"/g, 'data-role="recruiter,admin"');
    content = content.replace(/data-role="hiring_manager,talent_human_team,administrator"/g, 'data-role="hiring_manager,recruiter,admin"');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed roles in ${filePath}`);
}

// Fix navigation.js
const navPath = './js/navigation.js';
if (fs.existsSync(navPath)) {
    fixNavigationFile(navPath);
}

// Fix index.html
const indexPath = './index.html';
if (fs.existsSync(indexPath)) {
    fixNavigationFile(indexPath);
}

console.log('Navigation role attributes have been updated to match ROLES constants');
