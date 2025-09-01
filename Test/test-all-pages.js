const fs = require('fs');
const path = require('path');

console.log('🧪 Testing All HTML Pages for Production Readiness\n');

const testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    pages: []
};

// Get all HTML files
const getAllHtmlFiles = () => {
    const htmlFiles = [];
    
    // Main HTML file
    if (fs.existsSync('index.html')) {
        htmlFiles.push('index.html');
    }
    
    // Pages directory
    const pagesDir = 'pages';
    if (fs.existsSync(pagesDir)) {
        const pageFiles = fs.readdirSync(pagesDir)
            .filter(file => file.endsWith('.html'))
            .map(file => path.join(pagesDir, file));
        htmlFiles.push(...pageFiles);
    }
    
    return htmlFiles;
};

// Test individual HTML page
const testHtmlPage = (filePath) => {
    const pageResult = {
        name: filePath,
        issues: [],
        warnings: [],
        passed: true
    };
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for required elements
        const requiredElements = [
            { pattern: /<title>/i, name: 'Title tag' },
            { pattern: /<meta.*charset/i, name: 'Charset meta tag' },
            { pattern: /<meta.*viewport/i, name: 'Viewport meta tag' },
            { pattern: /bootstrap.*css/i, name: 'Bootstrap CSS' },
            { pattern: /bootstrap.*js/i, name: 'Bootstrap JS' },
            { pattern: /font-awesome/i, name: 'FontAwesome icons' }
        ];
        
        requiredElements.forEach(element => {
            if (!element.pattern.test(content)) {
                pageResult.issues.push(`Missing ${element.name}`);
                pageResult.passed = false;
            }
        });
        
        // Check for potential issues
        const potentialIssues = [
            { pattern: /href="(?!#|http|mailto)([^"]*\.(css|js|html|png|jpg|jpeg|gif|svg))"/, name: 'Local file references' },
            { pattern: /src="(?!http)([^"]*\.(js|png|jpg|jpeg|gif|svg))"/, name: 'Local asset references' }
        ];
        
        potentialIssues.forEach(issue => {
            const matches = content.match(new RegExp(issue.pattern, 'g'));
            if (matches) {
                matches.forEach(match => {
                    const filePath = match.match(/(?:href|src)="([^"]+)"/)[1];
                    // Check if file exists (accounting for relative paths)
                    let fullPath = filePath;
                    if (filePath.startsWith('../')) {
                        fullPath = filePath.substring(3);
                    }
                    
                    if (!fs.existsSync(fullPath)) {
                        pageResult.warnings.push(`Missing file: ${filePath}`);
                    }
                });
            }
        });
        
        // Check for English content requirement
        if (content.includes('Iniciar Sesión') || content.includes('Cerrar sesión') || 
            content.includes('Registro') || content.includes('Contraseña')) {
            pageResult.warnings.push('Contains Spanish text - convert to English for production');
        }
        
        // Check for proper script module loading
        if (!content.includes('type="module"') && content.includes('import ')) {
            pageResult.issues.push('ES6 imports without module type');
            pageResult.passed = false;
        }
        
    } catch (error) {
        pageResult.issues.push(`Failed to read file: ${error.message}`);
        pageResult.passed = false;
    }
    
    return pageResult;
};

// Run tests on all HTML files
const htmlFiles = getAllHtmlFiles();

if (htmlFiles.length === 0) {
    console.log('❌ No HTML files found!');
    process.exit(1);
}

console.log(`Found ${htmlFiles.length} HTML files to test:\n`);

htmlFiles.forEach(file => {
    console.log(`📄 Testing: ${file}`);
    const result = testHtmlPage(file);
    
    if (result.passed) {
        console.log(`   ✅ Passed`);
        testResults.passed++;
    } else {
        console.log(`   ❌ Failed`);
        testResults.failed++;
    }
    
    if (result.issues.length > 0) {
        result.issues.forEach(issue => {
            console.log(`      🚨 Issue: ${issue}`);
        });
    }
    
    if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
            console.log(`      ⚠️ Warning: ${warning}`);
            testResults.warnings++;
        });
    }
    
    testResults.pages.push(result);
    console.log('');
});

// Summary
console.log('📊 TESTING SUMMARY');
console.log(`✅ Pages Passed: ${testResults.passed}`);
console.log(`❌ Pages Failed: ${testResults.failed}`);
console.log(`⚠️ Total Warnings: ${testResults.warnings}`);
console.log(`📈 Success Rate: ${((testResults.passed / htmlFiles.length) * 100).toFixed(1)}%`);

// Save results
fs.writeFileSync('page-test-results.json', JSON.stringify(testResults, null, 2));
console.log('\n💾 Results saved to: page-test-results.json');

if (testResults.failed > 0) {
    console.log('\n🔧 ISSUES TO FIX:');
    testResults.pages.filter(p => !p.passed).forEach(page => {
        console.log(`\n${page.name}:`);
        page.issues.forEach(issue => console.log(`  - ${issue}`));
    });
}

process.exit(testResults.failed > 0 ? 1 : 0);
