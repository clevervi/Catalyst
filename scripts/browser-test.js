/**
 * Browser-based Frontend Testing Script
 * Run this in the browser console to test all frontend functionality
 */

(function() {
    'use strict';

    console.log('🧪 Starting Browser-based Frontend Testing...');
    
    const testResults = {
        passed: 0,
        failed: 0,
        tests: []
    };

    function logTest(name, passed, details = '') {
        const icon = passed ? '✅' : '❌';
        console.log(`${icon} ${name}${details ? ': ' + details : ''}`);
        testResults.tests.push({ name, passed, details });
        if (passed) testResults.passed++;
        else testResults.failed++;
    }

    // Test 1: Basic page loading
    function testBasicLoading() {
        console.log('\n📄 Testing Basic Page Loading');
        
        logTest('Document loaded', document.readyState === 'complete');
        logTest('Title is set', document.title.length > 0);
        logTest('Bootstrap CSS loaded', !!document.querySelector('link[href*="bootstrap"]'));
        logTest('FontAwesome loaded', !!document.querySelector('link[href*="fontawesome"]') || !!document.querySelector('link[href*="font-awesome"]'));
        logTest('Custom CSS loaded', !!document.querySelector('link[href*="styles.css"]'));
    }

    // Test 2: Navigation functionality
    function testNavigation() {
        console.log('\n🧭 Testing Navigation');
        
        const navbar = document.querySelector('.navbar') || document.querySelector('nav');
        logTest('Navigation bar exists', !!navbar);
        
        const navLinks = document.querySelectorAll('a[href*=".html"], a[href^="pages/"]');
        logTest('Navigation links exist', navLinks.length > 0);
        
        // Test modals
        const loginModal = document.querySelector('#loginModal');
        const registerModal = document.querySelector('#registerModal');
        logTest('Login modal exists', !!loginModal);
        logTest('Register modal exists', !!registerModal);
    }

    // Test 3: JavaScript modules loading
    function testJavaScriptModules() {
        console.log('\n⚡ Testing JavaScript Modules');
        
        // Check if global objects exist
        logTest('Window.catalyst exists', typeof window.catalyst !== 'undefined');
        
        if (window.catalyst) {
            logTest('Auth system loaded', typeof window.catalyst.auth !== 'undefined');
            logTest('Gamification stub loaded', typeof window.catalyst.game !== 'undefined');
            logTest('AI matching loaded', typeof window.catalyst.ai !== 'undefined');
        }
        
        // Check for specific functions
        logTest('LocalStorage available', typeof localStorage !== 'undefined');
        logTest('Fetch API available', typeof fetch !== 'undefined');
    }

    // Test 4: Form validation
    function testFormValidation() {
        console.log('\n📝 Testing Form Validation');
        
        const loginForm = document.querySelector('#loginForm');
        const registerForm = document.querySelector('#registerForm');
        
        logTest('Login form exists', !!loginForm);
        logTest('Register form exists', !!registerForm);
        
        if (loginForm) {
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            logTest('Login form has email input', !!emailInput);
            logTest('Login form has password input', !!passwordInput);
        }
        
        if (registerForm) {
            const inputs = registerForm.querySelectorAll('input');
            logTest('Register form has multiple inputs', inputs.length >= 4);
        }
    }

    // Test 5: Responsive design elements
    function testResponsiveDesign() {
        console.log('\n📱 Testing Responsive Design');
        
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        logTest('Viewport meta tag exists', !!viewportMeta);
        
        const containers = document.querySelectorAll('.container, .container-fluid');
        logTest('Bootstrap containers exist', containers.length > 0);
        
        const responsiveElements = document.querySelectorAll('.col-md-*, .col-lg-*, .col-sm-*, .d-md-*, .d-lg-*');
        logTest('Responsive classes used', responsiveElements.length > 0);
    }

    // Test 6: Accessibility
    function testAccessibility() {
        console.log('\n♿ Testing Accessibility');
        
        const altImages = Array.from(document.querySelectorAll('img')).filter(img => img.alt);
        const totalImages = document.querySelectorAll('img').length;
        logTest('Images have alt text', totalImages === 0 || altImages.length === totalImages);
        
        const ariaLabels = document.querySelectorAll('[aria-label]');
        logTest('ARIA labels used', ariaLabels.length > 0);
        
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        logTest('Proper heading structure', headings.length > 0);
    }

    // Test 7: Performance checks
    function testPerformance() {
        console.log('\n🚀 Testing Performance');
        
        if (typeof performance !== 'undefined' && performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            logTest('Page load time reasonable', loadTime < 10000, `${loadTime}ms`);
        }
        
        const scripts = document.querySelectorAll('script');
        const externalScripts = Array.from(scripts).filter(s => s.src);
        logTest('External scripts loading', externalScripts.length > 0);
    }

    // Test 8: Local storage and data persistence
    function testDataPersistence() {
        console.log('\n💾 Testing Data Persistence');
        
        try {
            localStorage.setItem('test', 'value');
            const retrieved = localStorage.getItem('test');
            localStorage.removeItem('test');
            logTest('LocalStorage works', retrieved === 'value');
        } catch (e) {
            logTest('LocalStorage works', false, e.message);
        }
        
        // Check for existing gamification data
        const gamificationData = localStorage.getItem('catalyst_gamification_progress');
        logTest('Gamification data structure', !gamificationData || gamificationData.startsWith('{'));
    }

    // Test 9: Bootstrap components
    function testBootstrapComponents() {
        console.log('\n🎨 Testing Bootstrap Components');
        
        const modals = document.querySelectorAll('.modal');
        logTest('Bootstrap modals exist', modals.length > 0);
        
        const buttons = document.querySelectorAll('.btn');
        logTest('Bootstrap buttons exist', buttons.length > 0);
        
        const cards = document.querySelectorAll('.card');
        logTest('Bootstrap cards exist', cards.length > 0);
    }

    // Test 10: Error handling
    function testErrorHandling() {
        console.log('\n⚠️ Testing Error Handling');
        
        const consoleErrors = [];
        const originalError = console.error;
        console.error = function(...args) {
            consoleErrors.push(args);
            originalError.apply(console, args);
        };
        
        setTimeout(() => {
            console.error = originalError;
            logTest('No critical console errors', consoleErrors.length === 0, 
                   consoleErrors.length > 0 ? `${consoleErrors.length} errors found` : '');
        }, 1000);
    }

    // Test 11: Demo credentials functionality
    function testDemoCredentials() {
        console.log('\n🔑 Testing Demo Credentials');
        
        const demoButton = document.querySelector('[data-bs-target="#demoCredentials"]');
        logTest('Demo credentials button exists', !!demoButton);
        
        const demoCredentialsDiv = document.querySelector('#demoCredentials');
        logTest('Demo credentials panel exists', !!demoCredentialsDiv);
        
        if (demoCredentialsDiv) {
            const credentialsText = demoCredentialsDiv.textContent;
            logTest('Contains demo email', credentialsText.includes('demo@catalyst.com'));
            logTest('Contains admin email', credentialsText.includes('admin@catalyst.com'));
        }
    }

    // Main test runner
    function runAllTests() {
        console.log('🚀 Starting comprehensive browser tests...\n');
        
        // Run all tests
        testBasicLoading();
        testNavigation();
        testJavaScriptModules();
        testFormValidation();
        testResponsiveDesign();
        testAccessibility();
        testPerformance();
        testDataPersistence();
        testBootstrapComponents();
        testErrorHandling();
        testDemoCredentials();
        
        // Wait a bit for async tests
        setTimeout(() => {
            // Print results
            console.log('\n📊 BROWSER TEST RESULTS');
            console.log(`✅ Passed: ${testResults.passed}`);
            console.log(`❌ Failed: ${testResults.failed}`);
            console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
            
            if (testResults.failed > 0) {
                console.log('\n⚠️ Failed Tests:');
                testResults.tests.filter(t => !t.passed).forEach(test => {
                    console.log(`   ❌ ${test.name}: ${test.details}`);
                });
            }
            
            // Store results for debugging
            window.browserTestResults = testResults;
            console.log('\n💾 Results stored in window.browserTestResults');
        }, 2000);
    }

    // Auto-run tests when script is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }

    // Export for manual testing
    window.runBrowserTests = runAllTests;
    console.log('💡 You can also run tests manually with: runBrowserTests()');
})();
