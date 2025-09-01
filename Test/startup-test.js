#!/usr/bin/env node

/**
 * Catalyst HR Management System - Startup Test
 * This script checks system requirements and runs basic functionality tests
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StartupTest {
    constructor() {
        this.testResults = [];
        this.serverInstance = null;
        this.testPort = 3001; // Use different port for testing
    }

    async runAllTests() {
        console.log('\n🚀 Catalyst HR System - Startup Test');
        console.log('=====================================\n');

        try {
            await this.checkSystemRequirements();
            await this.checkFileStructure();
            await this.validateJavaScriptModules();
            await this.testStaticServer();
            await this.runFunctionalTests();
            
            this.displayResults();
            
        } catch (error) {
            console.error('❌ Critical error during startup test:', error.message);
            process.exit(1);
        } finally {
            await this.cleanup();
        }
    }

    async checkSystemRequirements() {
        console.log('🔍 Checking System Requirements...\n');
        
        // Check Node.js version
        const nodeVersion = process.version;
        console.log(`   Node.js version: ${nodeVersion}`);
        this.addTestResult('Node.js', nodeVersion >= 'v16', `Version ${nodeVersion} detected`);

        // Check package.json
        try {
            const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
            console.log(`   Project: ${packageJson.name} v${packageJson.version}`);
            this.addTestResult('Package.json', true, 'Valid configuration found');
        } catch (error) {
            this.addTestResult('Package.json', false, 'Not found or invalid');
        }

        // Check dependencies
        try {
            await import('express');
            this.addTestResult('Express.js', true, 'Module available');
        } catch (error) {
            this.addTestResult('Express.js', false, 'Module not found - run npm install');
        }

        console.log('');
    }

    async checkFileStructure() {
        console.log('📁 Checking File Structure...\n');
        
        const requiredFiles = [
            { path: 'index.html', type: 'Main entry point' },
            { path: 'server.js', type: 'Server configuration' },
            { path: 'css/styles.css', type: 'Main stylesheet' },
            { path: 'js/resume-database.js', type: 'Resume database module' },
            { path: 'js/hiring-dashboard.js', type: 'Hiring dashboard module' },
            { path: 'js/reports.js', type: 'Reports module' },
            { path: 'pages/resume-database.html', type: 'Resume database page' },
            { path: 'pages/hiring-dashboard.html', type: 'Hiring dashboard page' },
            { path: 'pages/reports.html', type: 'Reports page' },
            { path: 'pages/kanban.html', type: 'Kanban board page' }
        ];

        for (const file of requiredFiles) {
            try {
                await fs.access(file.path);
                console.log(`   ✅ ${file.path} - ${file.type}`);
                this.addTestResult(`File: ${file.path}`, true, 'Found');
            } catch (error) {
                console.log(`   ❌ ${file.path} - ${file.type} (Missing)`);
                this.addTestResult(`File: ${file.path}`, false, 'Not found');
            }
        }

        console.log('');
    }

    async validateJavaScriptModules() {
        console.log('🧪 Validating JavaScript Modules...\n');

        const jsModules = [
            { path: 'js/resume-database.js', className: 'ResumeDatabase' },
            { path: 'js/hiring-dashboard.js', className: 'HiringDashboard' },
            { path: 'js/reports.js', className: 'Reports' }
        ];

        for (const module of jsModules) {
            try {
                const content = await fs.readFile(module.path, 'utf8');
                
                // Check if class is defined
                const hasClass = content.includes(`class ${module.className}`);
                const hasConstructor = content.includes('constructor()');
                const hasDOMReady = content.includes('DOMContentLoaded');
                
                if (hasClass && hasConstructor && hasDOMReady) {
                    console.log(`   ✅ ${module.path} - Valid module structure`);
                    this.addTestResult(`Module: ${module.className}`, true, 'Valid structure');
                } else {
                    console.log(`   ⚠️  ${module.path} - Structure issues detected`);
                    this.addTestResult(`Module: ${module.className}`, false, 'Structure issues');
                }
                
            } catch (error) {
                console.log(`   ❌ ${module.path} - Cannot read file`);
                this.addTestResult(`Module: ${module.className}`, false, 'File not readable');
            }
        }

        console.log('');
    }

    async testStaticServer() {
        console.log('🌐 Testing Static Server...\n');

        try {
            const app = express();
            app.use(express.static('.'));
            
            this.serverInstance = app.listen(this.testPort, () => {
                console.log(`   ✅ Static server started on port ${this.testPort}`);
                this.addTestResult('Static Server', true, `Running on port ${this.testPort}`);
            });

            // Wait a bit for server to start
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Test if main page loads
            try {
                const response = await fetch(`http://localhost:${this.testPort}/`);
                if (response.ok) {
                    console.log(`   ✅ Main page accessible (${response.status})`);
                    this.addTestResult('Main Page Access', true, `HTTP ${response.status}`);
                } else {
                    console.log(`   ❌ Main page returned ${response.status}`);
                    this.addTestResult('Main Page Access', false, `HTTP ${response.status}`);
                }
            } catch (fetchError) {
                console.log(`   ❌ Cannot access main page: ${fetchError.message}`);
                this.addTestResult('Main Page Access', false, 'Connection failed');
            }

        } catch (error) {
            console.log(`   ❌ Server startup failed: ${error.message}`);
            this.addTestResult('Static Server', false, error.message);
        }

        console.log('');
    }

    async runFunctionalTests() {
        console.log('⚙️ Running Functional Tests...\n');

        // Test CSS loading
        try {
            const cssContent = await fs.readFile('css/styles.css', 'utf8');
            const hasBootstrapIntegration = cssContent.includes('Bootstrap') || cssContent.includes('bootstrap');
            const hasCustomStyles = cssContent.includes('candidate-card') || cssContent.includes('resume-card');
            
            if (hasCustomStyles) {
                console.log('   ✅ CSS includes HR-specific styles');
                this.addTestResult('Custom CSS', true, 'HR styles found');
            } else {
                console.log('   ⚠️  CSS missing HR-specific styles');
                this.addTestResult('Custom CSS', false, 'HR styles not found');
            }
        } catch (error) {
            this.addTestResult('Custom CSS', false, 'CSS file not accessible');
        }

        // Test HTML page structure
        const htmlPages = [
            'pages/resume-database.html',
            'pages/hiring-dashboard.html', 
            'pages/reports.html'
        ];

        for (const page of htmlPages) {
            try {
                const content = await fs.readFile(page, 'utf8');
                const hasBootstrap = content.includes('bootstrap');
                const hasScriptTag = content.includes('<script');
                const hasModals = content.includes('modal');
                
                if (hasBootstrap && hasScriptTag) {
                    console.log(`   ✅ ${page} - Properly structured`);
                    this.addTestResult(`Page: ${page}`, true, 'Valid structure');
                } else {
                    console.log(`   ⚠️  ${page} - Missing components`);
                    this.addTestResult(`Page: ${page}`, false, 'Missing components');
                }
            } catch (error) {
                console.log(`   ❌ ${page} - Not accessible`);
                this.addTestResult(`Page: ${page}`, false, 'File not accessible');
            }
        }

        console.log('');
    }

    addTestResult(test, passed, details = '') {
        this.testResults.push({
            test,
            passed,
            details
        });
    }

    displayResults() {
        console.log('📊 Test Results Summary');
        console.log('=======================\n');

        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        const percentage = Math.round((passed / total) * 100);

        // Color coding for results
        const getStatusIcon = (passed) => passed ? '✅' : '❌';
        const getStatusColor = (passed) => passed ? '\x1b[32m' : '\x1b[31m'; // Green or Red
        const resetColor = '\x1b[0m';

        this.testResults.forEach(result => {
            const color = getStatusColor(result.passed);
            console.log(`${getStatusIcon(result.passed)} ${color}${result.test}${resetColor} - ${result.details}`);
        });

        console.log('\n' + '='.repeat(50));
        
        if (percentage >= 80) {
            console.log(`\x1b[32m🎉 SYSTEM READY: ${passed}/${total} tests passed (${percentage}%)\x1b[0m`);
            console.log('\x1b[32m✅ Your HR Management System is ready to use!\x1b[0m\n');
            
            console.log('🚀 Next Steps:');
            console.log('1. Run: npm start (to start the main server)');
            console.log('2. Open: http://localhost:3000');
            console.log('3. Navigate to: pages/resume-database.html');
            console.log('4. Navigate to: pages/hiring-dashboard.html');
            console.log('5. Navigate to: pages/reports.html\n');
            
        } else if (percentage >= 60) {
            console.log(`\x1b[33m⚠️  SYSTEM PARTIALLY READY: ${passed}/${total} tests passed (${percentage}%)\x1b[0m`);
            console.log('\x1b[33m⚠️  Some issues detected, but system should work with limitations\x1b[0m\n');
            
        } else {
            console.log(`\x1b[31m❌ SYSTEM NOT READY: ${passed}/${total} tests passed (${percentage}%)\x1b[0m`);
            console.log('\x1b[31m❌ Critical issues detected. Please fix the failing tests.\x1b[0m\n');
        }

        // Show specific recommendations
        if (percentage < 100) {
            console.log('💡 Recommendations:');
            this.testResults.filter(r => !r.passed).forEach(result => {
                console.log(`   - Fix: ${result.test} (${result.details})`);
            });
            console.log('');
        }
    }

    async cleanup() {
        if (this.serverInstance) {
            console.log('🧹 Cleaning up test server...\n');
            this.serverInstance.close();
        }
    }
}

// Create test instance and run
const startupTest = new StartupTest();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n\n⚠️  Test interrupted by user');
    await startupTest.cleanup();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n\n⚠️  Test terminated');
    await startupTest.cleanup();
    process.exit(0);
});

// Run the tests
startupTest.runAllTests().catch(error => {
    console.error('\n❌ Startup test failed:', error.message);
    process.exit(1);
});
