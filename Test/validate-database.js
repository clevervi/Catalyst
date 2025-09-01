/**
 * JSON Database Validation Script
 * Validates data integrity and structure of db.json
 */

const fs = require('fs');

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

const validationResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
};

function logTest(testName, status, details = '') {
    let icon, color;
    switch (status) {
        case 'pass':
            icon = '✅';
            color = colors.green;
            validationResults.passed++;
            break;
        case 'fail':
            icon = '❌';
            color = colors.red;
            validationResults.failed++;
            break;
        case 'warning':
            icon = '⚠️';
            color = colors.yellow;
            validationResults.warnings++;
            break;
    }
    
    log(`${icon} ${testName}`, color);
    if (details) {
        log(`   ${details}`, colors.blue);
    }
    
    validationResults.tests.push({ testName, status, details });
}

function validateJobStructure(job, index) {
    log(`\n📋 Validating Job ${index + 1}: ${job.title || 'Untitled'}`, colors.bold);
    
    // Required fields
    const requiredFields = ['id', 'title', 'company', 'description'];
    requiredFields.forEach(field => {
        if (job[field]) {
            logTest(`Has required field: ${field}`, 'pass');
        } else {
            logTest(`Missing required field: ${field}`, 'fail');
        }
    });
    
    // Company structure validation
    if (job.company && typeof job.company === 'object') {
        logTest('Company is object', 'pass');
        const companyFields = ['name', 'industry'];
        companyFields.forEach(field => {
            if (job.company[field]) {
                logTest(`Company has ${field}`, 'pass');
            } else {
                logTest(`Company missing ${field}`, 'warning');
            }
        });
    } else {
        logTest('Company structure', 'fail', 'Company should be an object');
    }
    
    // Skills array validation
    if (job.skillsRequired && Array.isArray(job.skillsRequired)) {
        logTest('Skills required is array', 'pass', `${job.skillsRequired.length} skills`);
        if (job.skillsRequired.length === 0) {
            logTest('Skills count', 'warning', 'No skills specified');
        }
    } else {
        logTest('Skills required structure', 'warning', 'Should be an array');
    }
    
    // Date validation
    if (job.postedDate) {
        const dateValid = !isNaN(Date.parse(job.postedDate));
        logTest('Posted date format', dateValid ? 'pass' : 'fail', job.postedDate);
    }
    
    // Level validation
    const validLevels = ['Junior', 'Semi-Senior', 'Senior', 'Lead', 'Principal'];
    if (job.level && validLevels.includes(job.level)) {
        logTest('Valid experience level', 'pass', job.level);
    } else if (job.level) {
        logTest('Experience level', 'warning', `"${job.level}" - recommend using standard levels`);
    }
}

function validateUserStructure(user, index) {
    log(`\n👤 Validating User ${index + 1}: ${user.firstName || 'Unknown'} ${user.lastName || ''}`, colors.bold);
    
    // Required fields
    const requiredFields = ['id', 'email'];
    requiredFields.forEach(field => {
        if (user[field]) {
            logTest(`Has required field: ${field}`, 'pass');
        } else {
            logTest(`Missing required field: ${field}`, 'fail');
        }
    });
    
    // Email format validation
    if (user.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        logTest('Email format', emailRegex.test(user.email) ? 'pass' : 'fail', user.email);
    }
    
    // Skills array validation
    if (user.skills && Array.isArray(user.skills)) {
        logTest('Skills is array', 'pass', `${user.skills.length} skills`);
    } else if (user.skills) {
        logTest('Skills structure', 'fail', 'Should be an array');
    }
    
    // Experience array validation
    if (user.experience && Array.isArray(user.experience)) {
        logTest('Experience is array', 'pass', `${user.experience.length} positions`);
        user.experience.forEach((exp, expIndex) => {
            if (exp.startDate) {
                const dateValid = !isNaN(Date.parse(exp.startDate));
                logTest(`Experience ${expIndex + 1} start date`, dateValid ? 'pass' : 'warning');
            }
        });
    } else if (user.experience) {
        logTest('Experience structure', 'warning', 'Should be an array');
    }
}

function validateDatabaseStructure(data) {
    log('\n🗄️ Validating Database Structure', colors.bold + colors.blue);
    
    // Check main collections
    if (data.users && Array.isArray(data.users)) {
        logTest('Users collection exists', 'pass', `${data.users.length} users`);
    } else {
        logTest('Users collection', 'fail', 'Missing or not an array');
    }
    
    if (data.jobs && Array.isArray(data.jobs)) {
        logTest('Jobs collection exists', 'pass', `${data.jobs.length} jobs`);
    } else {
        logTest('Jobs collection', 'fail', 'Missing or not an array');
    }
    
    // Check for duplicates
    if (data.users) {
        const userIds = data.users.map(u => u.id).filter(id => id);
        const uniqueIds = new Set(userIds);
        if (userIds.length === uniqueIds.size) {
            logTest('User ID uniqueness', 'pass');
        } else {
            logTest('User ID uniqueness', 'fail', 'Duplicate IDs found');
        }
        
        const emails = data.users.map(u => u.email).filter(email => email);
        const uniqueEmails = new Set(emails);
        if (emails.length === uniqueEmails.size) {
            logTest('User email uniqueness', 'pass');
        } else {
            logTest('User email uniqueness', 'fail', 'Duplicate emails found');
        }
    }
    
    if (data.jobs) {
        const jobIds = data.jobs.map(j => j.id).filter(id => id);
        const uniqueJobIds = new Set(jobIds);
        if (jobIds.length === uniqueJobIds.size) {
            logTest('Job ID uniqueness', 'pass');
        } else {
            logTest('Job ID uniqueness', 'fail', 'Duplicate job IDs found');
        }
    }
}

function checkDataConsistency(data) {
    log('\n🔍 Checking Data Consistency', colors.bold + colors.blue);
    
    // Check for AI matching compatibility
    const jobsWithSkills = data.jobs?.filter(job => job.skillsRequired && job.skillsRequired.length > 0) || [];
    logTest('Jobs with skills for AI matching', 'pass', `${jobsWithSkills.length}/${data.jobs?.length || 0} jobs`);
    
    // Check for complete user profiles
    const completeUsers = data.users?.filter(user => 
        user.skills && user.experience && user.skills.length > 0
    ) || [];
    logTest('Users with complete profiles', 'pass', `${completeUsers.length}/${data.users?.length || 0} users`);
    
    // Check for demo data
    const demoUser = data.users?.find(user => user.email === 'demo@catalyst.com');
    if (demoUser) {
        logTest('Demo user exists', 'pass', 'demo@catalyst.com found');
        if (demoUser.skills && demoUser.skills.length > 0) {
            logTest('Demo user has skills', 'pass', `${demoUser.skills.length} skills`);
        }
    } else {
        logTest('Demo user exists', 'warning', 'No demo user found');
    }
    
    // Check for featured jobs
    const featuredJobs = data.jobs?.filter(job => job.featured) || [];
    logTest('Featured jobs available', featuredJobs.length > 0 ? 'pass' : 'warning', 
           `${featuredJobs.length} featured jobs`);
}

async function validateDatabase() {
    log('🔍 Starting Database Validation', colors.bold + colors.green);
    log(`📅 Date: ${new Date().toISOString()}`, colors.blue);
    
    try {
        // Read and parse database
        const dbContent = fs.readFileSync('db.json', 'utf8');
        let data;
        
        try {
            data = JSON.parse(dbContent);
            logTest('JSON parsing', 'pass', 'Database file is valid JSON');
        } catch (parseError) {
            logTest('JSON parsing', 'fail', parseError.message);
            return;
        }
        
        // Validate overall structure
        validateDatabaseStructure(data);
        
        // Validate each job
        if (data.jobs && Array.isArray(data.jobs)) {
            data.jobs.forEach((job, index) => validateJobStructure(job, index));
        }
        
        // Validate each user
        if (data.users && Array.isArray(data.users)) {
            data.users.forEach((user, index) => validateUserStructure(user, index));
        }
        
        // Check data consistency
        checkDataConsistency(data);
        
    } catch (error) {
        logTest('Database file access', 'fail', error.message);
    }
    
    // Print final results
    log('\n📊 VALIDATION RESULTS', colors.bold + colors.blue);
    log(`✅ Passed: ${validationResults.passed}`, colors.green);
    log(`❌ Failed: ${validationResults.failed}`, colors.red);
    log(`⚠️ Warnings: ${validationResults.warnings}`, colors.yellow);
    
    const total = validationResults.passed + validationResults.failed + validationResults.warnings;
    const successRate = total > 0 ? ((validationResults.passed / total) * 100).toFixed(1) : '0.0';
    log(`📈 Success Rate: ${successRate}%`);
    
    // Save validation report
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            total,
            passed: validationResults.passed,
            failed: validationResults.failed,
            warnings: validationResults.warnings,
            successRate: parseFloat(successRate)
        },
        tests: validationResults.tests
    };
    
    fs.writeFileSync('database-validation-results.json', JSON.stringify(report, null, 2));
    log(`\n💾 Results saved to: database-validation-results.json`, colors.blue);
    
    if (validationResults.failed === 0) {
        log('\n🎉 Database validation completed successfully!', colors.bold + colors.green);
    } else {
        log('\n⚠️ Database validation completed with issues that need attention.', colors.bold + colors.yellow);
    }
}

validateDatabase();
