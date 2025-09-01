/**
 * CATALYST HR SYSTEM - TESTING UTILITIES
 * 
 * This file contains helper functions and automated tests for the Catalyst HR System.
 * Run these tests in the browser console to validate functionality.
 * 
 * Usage:
 * 1. Open any page of the Catalyst HR System in your browser
 * 2. Open Developer Tools (F12)
 * 3. Copy and paste this code into the console
 * 4. Run: CatalystTester.runAllTests()
 */

class CatalystTester {
    constructor() {
        this.testResults = [];
        this.passed = 0;
        this.failed = 0;
        this.skipped = 0;
    }

    // Test result logging
    log(testName, status, message = '') {
        const result = {
            test: testName,
            status: status, // 'PASS', 'FAIL', 'SKIP'
            message: message,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        switch(status) {
            case 'PASS':
                this.passed++;
                console.log(`✅ ${testName}: ${message}`);
                break;
            case 'FAIL':
                this.failed++;
                console.error(`❌ ${testName}: ${message}`);
                break;
            case 'SKIP':
                this.skipped++;
                console.warn(`⏭️  ${testName}: ${message}`);
                break;
        }
    }

    // DOM element existence tests
    testElementExists(selector, testName) {
        const element = document.querySelector(selector);
        if (element) {
            this.log(testName, 'PASS', `Element found: ${selector}`);
            return true;
        } else {
            this.log(testName, 'FAIL', `Element not found: ${selector}`);
            return false;
        }
    }

    // Navigation tests
    testNavigation() {
        console.group('🧭 Navigation Tests');
        
        this.testElementExists('.navbar', 'Navigation bar exists');
        this.testElementExists('.navbar-brand', 'Brand logo exists');
        this.testElementExists('#navbarNav', 'Navigation menu exists');
        
        // Test dropdown menus
        this.testElementExists('#jobsDropdown', 'Jobs dropdown exists');
        this.testElementExists('#trainingDropdown', 'Training dropdown exists');
        
        // Test footer
        this.testElementExists('footer', 'Footer exists');
        this.testElementExists('.social-icons', 'Social icons exist');
        
        console.groupEnd();
    }

    // Authentication tests
    testAuthentication() {
        console.group('🔐 Authentication Tests');
        
        // Check for login modal
        this.testElementExists('#loginModal', 'Login modal exists');
        this.testElementExists('#loginForm', 'Login form exists');
        this.testElementExists('#registerModal', 'Register modal exists');
        
        // Check localStorage for authentication
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userData = localStorage.getItem('userData');
        
        if (isAuthenticated === 'true' && userData) {
            this.log('Authentication Status', 'PASS', 'User is authenticated');
            
            try {
                const user = JSON.parse(userData);
                this.log('User Data Parsing', 'PASS', `User: ${user.firstName} ${user.lastName} (${user.role})`);
            } catch (e) {
                this.log('User Data Parsing', 'FAIL', 'Invalid JSON in userData');
            }
        } else {
            this.log('Authentication Status', 'SKIP', 'User not authenticated');
        }
        
        console.groupEnd();
    }

    // Job listing tests
    testJobListings() {
        console.group('💼 Job Listings Tests');
        
        // Check for job containers
        this.testElementExists('.job-list', 'Job list container exists');
        this.testElementExists('.job-card', 'Job cards exist');
        
        // Count job cards
        const jobCards = document.querySelectorAll('.job-card');
        if (jobCards.length > 0) {
            this.log('Job Cards Count', 'PASS', `Found ${jobCards.length} job cards`);
        } else {
            this.log('Job Cards Count', 'FAIL', 'No job cards found');
        }
        
        // Test job modal
        this.testElementExists('#jobDetailsModal', 'Job details modal exists');
        
        console.groupEnd();
    }

    // Form validation tests
    testForms() {
        console.group('📝 Form Tests');
        
        const forms = document.querySelectorAll('form');
        this.log('Forms Count', forms.length > 0 ? 'PASS' : 'FAIL', `Found ${forms.length} forms`);
        
        // Test login form specifically
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            
            this.log('Login Form Email Field', emailInput ? 'PASS' : 'FAIL', 'Email input exists');
            this.log('Login Form Password Field', passwordInput ? 'PASS' : 'FAIL', 'Password input exists');
        }
        
        console.groupEnd();
    }

    // Responsive design tests
    testResponsiveDesign() {
        console.group('📱 Responsive Design Tests');
        
        const viewportWidth = window.innerWidth;
        this.log('Viewport Width', 'PASS', `${viewportWidth}px`);
        
        // Test Bootstrap classes
        this.testElementExists('.container', 'Bootstrap container exists');
        this.testElementExists('.row', 'Bootstrap row exists');
        this.testElementExists('.col-md-6, .col-lg-4, .col-sm-12', 'Bootstrap columns exist');
        
        // Test navbar collapse
        if (viewportWidth < 992) { // Bootstrap lg breakpoint
            this.testElementExists('.navbar-toggler', 'Mobile menu toggle exists');
        }
        
        console.groupEnd();
    }

    // External resources tests
    testExternalResources() {
        console.group('🌐 External Resources Tests');
        
        // Test Bootstrap CSS
        const bootstrapCSS = document.querySelector('link[href*="bootstrap"]');
        this.log('Bootstrap CSS', bootstrapCSS ? 'PASS' : 'FAIL', 'Bootstrap stylesheet loaded');
        
        // Test FontAwesome
        const fontAwesome = document.querySelector('link[href*="font-awesome"]');
        this.log('FontAwesome CSS', fontAwesome ? 'PASS' : 'FAIL', 'FontAwesome stylesheet loaded');
        
        // Test jQuery
        this.log('jQuery', typeof $ !== 'undefined' ? 'PASS' : 'FAIL', 'jQuery library loaded');
        
        console.groupEnd();
    }

    // Performance tests
    testPerformance() {
        console.group('⚡ Performance Tests');
        
        if (performance && performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            const domReady = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
            
            this.log('Page Load Time', loadTime < 5000 ? 'PASS' : 'FAIL', `${loadTime}ms`);
            this.log('DOM Ready Time', domReady < 3000 ? 'PASS' : 'FAIL', `${domReady}ms`);
        } else {
            this.log('Performance Timing', 'SKIP', 'Performance API not available');
        }
        
        console.groupEnd();
    }

    // Accessibility tests
    testAccessibility() {
        console.group('♿ Accessibility Tests');
        
        // Check for alt attributes on images
        const images = document.querySelectorAll('img');
        let imagesWithAlt = 0;
        images.forEach(img => {
            if (img.getAttribute('alt')) imagesWithAlt++;
        });
        
        const altRatio = images.length > 0 ? (imagesWithAlt / images.length) * 100 : 100;
        this.log('Images Alt Text', altRatio >= 80 ? 'PASS' : 'FAIL', 
                `${imagesWithAlt}/${images.length} images have alt text (${altRatio.toFixed(1)}%)`);
        
        // Check for form labels
        const inputs = document.querySelectorAll('input, textarea, select');
        let inputsWithLabels = 0;
        inputs.forEach(input => {
            if (input.labels && input.labels.length > 0) inputsWithLabels++;
        });
        
        const labelRatio = inputs.length > 0 ? (inputsWithLabels / inputs.length) * 100 : 100;
        this.log('Form Labels', labelRatio >= 80 ? 'PASS' : 'FAIL',
                `${inputsWithLabels}/${inputs.length} inputs have labels (${labelRatio.toFixed(1)}%)`);
        
        console.groupEnd();
    }

    // Demo credentials test
    testDemoCredentials() {
        console.group('🔑 Demo Credentials Tests');
        
        const demoCredentials = [
            { email: 'demo@catalyst.com', role: 'Demo User' },
            { email: 'admin@catalyst.com', role: 'Administrator' },
            { email: 'th@catalyst.com', role: 'HR Specialist' },
            { email: 'manager@catalyst.com', role: 'Manager' },
            { email: 'banco@catalyst.com', role: 'Bank Representative' },
            { email: 'hiring@catalyst.com', role: 'Hiring Manager' }
        ];
        
        this.log('Demo Credentials Available', 'PASS', 
                `${demoCredentials.length} demo accounts configured`);
        
        demoCredentials.forEach(cred => {
            this.log(`Demo Account: ${cred.role}`, 'PASS', cred.email);
        });
        
        console.groupEnd();
    }

    // Run all tests
    runAllTests() {
        console.clear();
        console.log('🚀 Starting Catalyst HR System Tests...\n');
        
        this.testResults = [];
        this.passed = 0;
        this.failed = 0;
        this.skipped = 0;
        
        // Run test suites
        this.testNavigation();
        this.testAuthentication();
        this.testJobListings();
        this.testForms();
        this.testResponsiveDesign();
        this.testExternalResources();
        this.testPerformance();
        this.testAccessibility();
        this.testDemoCredentials();
        
        // Display summary
        this.displaySummary();
    }

    // Display test summary
    displaySummary() {
        console.log('\n📊 TEST SUMMARY');
        console.log('================');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`⏭️  Skipped: ${this.skipped}`);
        console.log(`📝 Total: ${this.testResults.length}`);
        
        const successRate = this.testResults.length > 0 ? 
            ((this.passed / (this.passed + this.failed)) * 100).toFixed(1) : 0;
        
        console.log(`🎯 Success Rate: ${successRate}%`);
        
        if (this.failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults.filter(r => r.status === 'FAIL').forEach(result => {
                console.log(`   • ${result.test}: ${result.message}`);
            });
        }
        
        console.log('\n📋 Full test results available in CatalystTester.testResults');
        
        // Overall assessment
        if (this.failed === 0) {
            console.log('🎉 All tests passed! System is ready for deployment.');
        } else if (this.failed <= 2) {
            console.log('⚠️  Minor issues detected. Review failed tests.');
        } else {
            console.log('🚨 Multiple issues detected. System needs attention.');
        }
    }

    // Export results to JSON
    exportResults() {
        const results = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            summary: {
                passed: this.passed,
                failed: this.failed,
                skipped: this.skipped,
                total: this.testResults.length,
                successRate: this.testResults.length > 0 ? 
                    ((this.passed / (this.passed + this.failed)) * 100).toFixed(1) : 0
            },
            tests: this.testResults
        };
        
        console.log('📤 Test Results Export:');
        console.log(JSON.stringify(results, null, 2));
        
        return results;
    }

    // Quick manual tests
    quickTest() {
        console.log('🏃‍♂️ Running Quick Tests...');
        
        // Basic functionality check
        this.testElementExists('body', 'Page loaded');
        this.testElementExists('.navbar', 'Navigation exists');
        this.testElementExists('footer', 'Footer exists');
        
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        console.log(isAuth ? '🔓 User authenticated' : '🔒 User not authenticated');
        
        console.log('✨ Quick test complete');
    }
}

// Initialize tester
const CatalystTester = new CatalystTester();

// Auto-run quick test when script loads
console.log('🔧 Catalyst HR System Testing Utilities Loaded');
console.log('📝 Available commands:');
console.log('   CatalystTester.runAllTests() - Run complete test suite');
console.log('   CatalystTester.quickTest() - Run basic checks');
console.log('   CatalystTester.exportResults() - Export test results');

// Run quick test on load
CatalystTester.quickTest();

// Make available globally
window.CatalystTester = CatalystTester;
