/**
 * API Testing Script for Catalyst HR System
 * Tests core functionality without database requirements
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

// Test results
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

function logTest(testName, passed, details = '') {
    const icon = passed ? '✅' : '❌';
    const color = passed ? colors.green : colors.red;
    log(`${icon} ${testName}`, color);
    if (details) {
        log(`   ${details}`, colors.blue);
    }
    
    testResults.tests.push({ testName, passed, details });
    if (passed) {
        testResults.passed++;
    } else {
        testResults.failed++;
    }
}

// Make HTTP request
function makeRequest(options) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data,
                    headers: res.headers
                });
            });
        });
        
        req.on('error', (err) => {
            reject(err);
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

// Test functions
async function testServerRunning() {
    log('\n🚀 Testing Server Status', colors.bold + colors.blue);
    
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/',
            method: 'GET'
        });
        
        logTest('Server is running', response.statusCode === 200, `Status: ${response.statusCode}`);
        logTest('Server returns HTML', response.headers['content-type']?.includes('text/html'), 'Content-Type check');
    } catch (error) {
        logTest('Server is running', false, error.message);
    }
}

async function testAPIEndpoints() {
    log('\n🌐 Testing API Endpoints', colors.bold + colors.blue);
    
    // Test JSON database jobs endpoint
    try {
        const dbData = JSON.parse(fs.readFileSync('db.json', 'utf8'));
        logTest('JSON database file exists', true, `${dbData.jobs?.length || 0} jobs found`);
    } catch (error) {
        logTest('JSON database file exists', false, error.message);
    }
}

async function testStaticFiles() {
    log('\n📁 Testing Static Files', colors.bold + colors.blue);
    
    const staticFiles = [
        '/js/main.js',
        '/js/auth.js',
        '/css/styles.css',
        '/img/image.png'
    ];
    
    for (const file of staticFiles) {
        try {
            const response = await makeRequest({
                hostname: 'localhost',
                port: 3001,
                path: file,
                method: 'GET'
            });
            
            logTest(`Static file: ${file}`, response.statusCode === 200, `Status: ${response.statusCode}`);
        } catch (error) {
            logTest(`Static file: ${file}`, false, error.message);
        }
    }
}

async function testPageRoutes() {
    log('\n📄 Testing Page Routes', colors.bold + colors.blue);
    
    const pages = [
        '/pages/empleos.html',
        '/pages/capacitaciones.html',
        '/pages/perfil.html'
    ];
    
    for (const page of pages) {
        try {
            const response = await makeRequest({
                hostname: 'localhost',
                port: 3001,
                path: page,
                method: 'GET'
            });
            
            logTest(`Page route: ${page}`, response.statusCode === 200, `Status: ${response.statusCode}`);
        } catch (error) {
            logTest(`Page route: ${page}`, false, error.message);
        }
    }
}

async function testJavaScriptModules() {
    log('\n⚡ Testing JavaScript Module Structure', colors.bold + colors.blue);
    
    const jsFiles = [
        'js/main.js',
        'js/auth.js',
        'js/gamification-stub.js',
        'js/ai-matching.js'
    ];
    
    for (const file of jsFiles) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const hasImports = content.includes('import') || content.includes('export');
            const hasClasses = content.includes('class') || content.includes('function');
            
            logTest(`${file} module structure`, hasImports || hasClasses, 
                    `Imports: ${hasImports}, Functions: ${hasClasses}`);
        } catch (error) {
            logTest(`${file} module structure`, false, error.message);
        }
    }
}

// Main test runner
async function runTests() {
    log('🧪 Starting Catalyst HR System API Tests', colors.bold + colors.green);
    log(`📍 Testing server on http://localhost:3001`, colors.blue);
    log(`📅 Date: ${new Date().toISOString()}`, colors.blue);
    
    await testServerRunning();
    await testAPIEndpoints();
    await testStaticFiles();
    await testPageRoutes();
    await testJavaScriptModules();
    
    // Print results
    log('\n📊 TEST RESULTS', colors.bold + colors.blue);
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
    
    // Save results
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            total: testResults.passed + testResults.failed,
            passed: testResults.passed,
            failed: testResults.failed,
            successRate: (testResults.passed / (testResults.passed + testResults.failed)) * 100
        },
        tests: testResults.tests
    };
    
    fs.writeFileSync('api-test-results.json', JSON.stringify(report, null, 2));
    log(`\n💾 Results saved to: api-test-results.json`, colors.blue);
    
    log('\n🎉 Testing completed!', colors.bold + colors.green);
}

// Wait for server to be ready, then run tests
setTimeout(runTests, 2000);
