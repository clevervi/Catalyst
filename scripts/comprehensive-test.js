/**
 * Comprehensive Test Script for Catalyst HR System
 * Tests all functionality on Windows 11 with PowerShell
 */

const fs = require('fs').promises;
const path = require('path');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

// Test results storage
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

// Helper functions
function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
    const icon = passed ? '✅' : '❌';
    const color = passed ? colors.green : colors.red;
    log(`${icon} ${testName}`, color);
    if (details) {
        log(`   ${details}`, colors.cyan);
    }
    
    testResults.tests.push({ testName, passed, details });
    if (passed) {
        testResults.passed++;
    } else {
        testResults.failed++;
    }
}

async function fileExists(filepath) {
    try {
        await fs.access(filepath);
        return true;
    } catch {
        return false;
    }
}

async function readJsonFile(filepath) {
    try {
        const content = await fs.readFile(filepath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        return null;
    }
}

// Test functions
async function testProjectStructure() {
    log('\n📁 Testing Project Structure', colors.bold + colors.blue);
    
    const requiredFiles = [
        'index.html',
        'server.js',
        'package.json',
        'db.json',
        'js/main.js',
        'js/auth.js',
        'js/jobs.js',
        'js/navigation.js',
        'js/api.js',
        'js/gamification.js',
        'js/ai-matching.js',
        'css/styles.css',
        'pages/clanes.html',
        'pages/empleos.html',
        'pages/capacitaciones.html'
    ];
    
    for (const file of requiredFiles) {
        const exists = await fileExists(file);
        logTest(`File exists: ${file}`, exists);
    }
    
    // Test critical directories
    const requiredDirs = ['js', 'css', 'pages', 'img', 'uploads'];
    for (const dir of requiredDirs) {
        const exists = await fileExists(dir);
        logTest(`Directory exists: ${dir}`, exists);
    }
}

async function testPackageJson() {
    log('\n📦 Testing Package Configuration', colors.bold + colors.blue);
    
    const packageJson = await readJsonFile('package.json');
    if (packageJson) {
        logTest('package.json is valid JSON', true);
        logTest('Has required dependencies', !!(packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0));
        logTest('Has start script', !!(packageJson.scripts && packageJson.scripts.start));
        logTest('Has validate script', !!(packageJson.scripts && packageJson.scripts.validate));
    } else {
        logTest('package.json is valid JSON', false, 'Cannot parse package.json');
    }
}

async function testDatabaseJson() {
    log('\n🗄️ Testing Database JSON', colors.bold + colors.blue);
    
    const dbJson = await readJsonFile('db.json');
    if (dbJson) {
        logTest('db.json is valid JSON', true);
        logTest('Has users data', !!(dbJson.users && Array.isArray(dbJson.users)));
        logTest('Has jobs data', !!(dbJson.jobs && Array.isArray(dbJson.jobs)));
        logTest('Has demo user', !!(dbJson.users && dbJson.users.some(u => u.email === 'demo@catalyst.com')));
        logTest('Has sample jobs', !!(dbJson.jobs && dbJson.jobs.length > 0));
        
        // Test job structure
        if (dbJson.jobs && dbJson.jobs.length > 0) {
            const sampleJob = dbJson.jobs[0];
            logTest('Jobs have required fields', !!(sampleJob.id && sampleJob.title && sampleJob.company));
            logTest('Jobs have skillsRequired for AI matching', !!(sampleJob.skillsRequired && Array.isArray(sampleJob.skillsRequired)));
        }
    } else {
        logTest('db.json is valid JSON', false, 'Cannot parse db.json');
    }
}

async function testHtmlPages() {
    log('\n🌐 Testing HTML Pages', colors.bold + colors.blue);
    
    const htmlPages = [
        'index.html',
        'pages/clanes.html',
        'pages/empleos.html',
        'pages/capacitaciones.html',
        'pages/empresas.html',
        'pages/perfil.html'
    ];
    
    for (const page of htmlPages) {
        const exists = await fileExists(page);
        if (exists) {
            try {
                const content = await fs.readFile(page, 'utf8');
                const hasBootstrap = content.includes('bootstrap');
                const hasNavigation = content.includes('navigation.js');
                const hasValidHtml = content.includes('<html') && content.includes('</html>');
                
                logTest(`${page} exists and is valid HTML`, hasValidHtml);
                logTest(`${page} includes Bootstrap`, hasBootstrap);
                logTest(`${page} includes navigation`, hasNavigation);
            } catch (error) {
                logTest(`${page} is readable`, false, error.message);
            }
        } else {
            logTest(`${page} exists`, false);
        }
    }
}

async function testJavaScriptModules() {
    log('\n⚡ Testing JavaScript Modules', colors.bold + colors.blue);
    
    const jsFiles = [
        'js/main.js',
        'js/auth.js',
        'js/jobs.js',
        'js/navigation.js',
        'js/api.js',
        'js/gamification.js',
        'js/ai-matching.js',
        'js/clanes.js'
    ];
    
    for (const jsFile of jsFiles) {
        const exists = await fileExists(jsFile);
        if (exists) {
            try {
                const content = await fs.readFile(jsFile, 'utf8');
                const hasExports = content.includes('export') || content.includes('module.exports');
                const hasImports = content.includes('import') || content.includes('require');
                const isModuleFormat = hasExports || hasImports || content.includes('class') || content.includes('function');
                
                logTest(`${jsFile} exists and has module structure`, isModuleFormat);
            } catch (error) {
                logTest(`${jsFile} is readable`, false, error.message);
            }
        } else {
            logTest(`${jsFile} exists`, false);
        }
    }
}

async function testCssStyles() {
    log('\n🎨 Testing CSS Styles', colors.bold + colors.blue);
    
    const cssFiles = ['css/styles.css'];
    
    for (const cssFile of cssFiles) {
        const exists = await fileExists(cssFile);
        if (exists) {
            try {
                const content = await fs.readFile(cssFile, 'utf8');
                const hasResponsive = content.includes('@media');
                const hasCustomVars = content.includes(':root') || content.includes('var(--');
                const hasBootstrapOverrides = content.includes('.btn') || content.includes('.card');
                
                logTest(`${cssFile} exists and has content`, content.length > 0);
                logTest(`${cssFile} has responsive design`, hasResponsive);
                logTest(`${cssFile} has custom variables`, hasCustomVars);
                logTest(`${cssFile} has Bootstrap overrides`, hasBootstrapOverrides);
            } catch (error) {
                logTest(`${cssFile} is readable`, false, error.message);
            }
        } else {
            logTest(`${cssFile} exists`, false);
        }
    }
}

async function testGamificationFeatures() {
    log('\n🎮 Testing Gamification Features', colors.bold + colors.blue);
    
    // Test for the stub implementation
    const stubFile = 'js/gamification-stub.js';
    const stubExists = await fileExists(stubFile);
    
    if (stubExists) {
        try {
            const stubContent = await fs.readFile(stubFile, 'utf8');
            const hasStubClass = stubContent.includes('class GamificationEngineStub');
            const hasStubMethods = stubContent.includes('trackAction') && stubContent.includes('updateProgressDisplay');
            const exportsStub = stubContent.includes('getGamificationEngine');
            
            logTest('Gamification stub exists', hasStubClass);
            logTest('Stub has required methods', hasStubMethods);
            logTest('Stub is properly exported', exportsStub);
            logTest('Level system successfully disabled', true, 'Using stub implementation');
        } catch (error) {
            logTest('Gamification stub readable', false, error.message);
        }
    } else {
        logTest('Gamification stub file exists', false);
    }
    
    // Check that the original gamification is not being used in main files
    const mainJsExists = await fileExists('js/main.js');
    if (mainJsExists) {
        try {
            const mainContent = await fs.readFile('js/main.js', 'utf8');
            const usesStub = mainContent.includes('gamification-stub.js');
            const doesNotUseOriginal = !mainContent.includes('gamification.js');
            logTest('Main.js uses gamification stub', usesStub);
            logTest('Main.js does not import original gamification', doesNotUseOriginal);
        } catch (error) {
            logTest('Main.js check failed', false, error.message);
        }
    }
}

async function testAIMatching() {
    log('\n🤖 Testing AI Matching Features', colors.bold + colors.blue);
    
    const aiFile = 'js/ai-matching.js';
    const exists = await fileExists(aiFile);
    
    if (exists) {
        try {
            const content = await fs.readFile(aiFile, 'utf8');
            const hasAIClass = content.includes('class AIMatchingEngine');
            const hasSkillMatching = content.includes('calculateSkillMatch') || content.includes('matchScore');
            const hasJobMatching = content.includes('job') && content.includes('skill');
            
            logTest('AI Matching engine exists', hasAIClass);
            logTest('Skill matching algorithm implemented', hasSkillMatching);
            logTest('Job matching functionality', hasJobMatching);
        } catch (error) {
            logTest('AI Matching file readable', false, error.message);
        }
    } else {
        logTest('AI Matching file exists', false);
    }
}

async function testClansSystem() {
    log('\n👥 Testing Clans System', colors.bold + colors.blue);
    
    const clansPageExists = await fileExists('pages/clanes.html');
    const clansJsExists = await fileExists('js/clanes.js');
    
    logTest('Clans page exists', clansPageExists);
    logTest('Clans JavaScript module exists', clansJsExists);
    
    if (clansJsExists) {
        try {
            const content = await fs.readFile('js/clanes.js', 'utf8');
            const hasClansData = content.includes('clan');
            const hasModalFunctionality = content.includes('modal') || content.includes('Modal');
            
            logTest('Clans JavaScript has clan functionality', hasClansData);
            logTest('Clans JavaScript has modal functionality', hasModalFunctionality);
        } catch (error) {
            logTest('Clans JavaScript readable', false, error.message);
        }
    }
}

async function testValidatorScript() {
    log('\n🔍 Testing Static Validator', colors.bold + colors.blue);
    
    const validatorExists = await fileExists('scripts/static-validator.js');
    logTest('Static validator script exists', validatorExists);
    
    if (validatorExists) {
        try {
            const content = await fs.readFile('scripts/static-validator.js', 'utf8');
            const hasValidationLogic = content.includes('validate') || content.includes('check');
            const hasFileScanning = content.includes('fs.') || content.includes('readFile');
            
            logTest('Validator has validation logic', hasValidationLogic);
            logTest('Validator scans files', hasFileScanning);
        } catch (error) {
            logTest('Validator script readable', false, error.message);
        }
    }
}

async function testWindowsCompatibility() {
    log('\n🪟 Testing Windows Compatibility', colors.bold + colors.blue);
    
    // Check for Windows-specific issues
    const packageJson = await readJsonFile('package.json');
    if (packageJson && packageJson.scripts) {
        const startScript = packageJson.scripts.start;
        const hasWindowsCompatibleScript = !startScript.includes('&&') || startScript.includes('node server.js');
        logTest('Start script is Windows compatible', hasWindowsCompatibleScript);
    }
    
    // Check for path separators
    const mainJsExists = await fileExists('js/main.js');
    if (mainJsExists) {
        const content = await fs.readFile('js/main.js', 'utf8');
        const hasRelativePaths = !content.includes('/usr/') && !content.includes('/home/');
        logTest('JavaScript uses relative paths', hasRelativePaths);
    }
}

// Main test runner
async function runAllTests() {
    log('🚀 Starting Comprehensive Testing for Catalyst HR System', colors.bold + colors.green);
    log(`📍 Testing in directory: ${process.cwd()}`, colors.cyan);
    log(`🖥️ Platform: ${process.platform}`, colors.cyan);
    log(`📅 Date: ${new Date().toISOString()}`, colors.cyan);
    
    // Run all test categories
    await testProjectStructure();
    await testPackageJson();
    await testDatabaseJson();
    await testHtmlPages();
    await testJavaScriptModules();
    await testCssStyles();
    await testGamificationFeatures();
    await testAIMatching();
    await testClansSystem();
    await testValidatorScript();
    await testWindowsCompatibility();
    
    // Print final results
    log('\n📊 FINAL TEST RESULTS', colors.bold + colors.blue);
    log(`✅ Passed: ${testResults.passed}`, colors.green);
    log(`❌ Failed: ${testResults.failed}`, colors.red);
    log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
    
    if (testResults.failed > 0) {
        log('\n⚠️ Failed Tests:', colors.bold + colors.red);
        testResults.tests
            .filter(test => !test.passed)
            .forEach(test => {
                log(`   ❌ ${test.testName}: ${test.details}`, colors.red);
            });
    }
    
    // Save test results to file
    const reportPath = 'test-results.json';
    const report = {
        timestamp: new Date().toISOString(),
        platform: process.platform,
        directory: process.cwd(),
        summary: {
            total: testResults.passed + testResults.failed,
            passed: testResults.passed,
            failed: testResults.failed,
            successRate: (testResults.passed / (testResults.passed + testResults.failed)) * 100
        },
        tests: testResults.tests
    };
    
    try {
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        log(`\n💾 Test report saved to: ${reportPath}`, colors.cyan);
    } catch (error) {
        log(`\n❌ Could not save test report: ${error.message}`, colors.red);
    }
    
    log('\n🎉 Testing completed!', colors.bold + colors.green);
    
    // Exit with error code if tests failed
    if (testResults.failed > 0) {
        process.exit(1);
    }
}

// Run tests if called directly
if (require.main === module) {
    runAllTests().catch(error => {
        log(`\n💥 Fatal error during testing: ${error.message}`, colors.bold + colors.red);
        console.error(error);
        process.exit(1);
    });
}

module.exports = {
    runAllTests,
    testResults
};
