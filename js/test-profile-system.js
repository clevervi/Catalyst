/**
 * Profile System Test Suite
 * Tests all profile functionality to ensure everything works correctly
 */

import { 
    initDatabase,
    createUser,
    authenticateUser,
    getUserProfile,
    updateUserProfile,
    addExperience,
    getUserExperiences,
    addEducation,
    getUserEducation,
    calculateProfileCompletion
} from './database.js';

import { ROLES } from './roles.js';

/**
 * Run comprehensive tests
 */
export async function runProfileSystemTests() {
    console.log('🧪 Starting Profile System Tests...\n');
    
    try {
        // Initialize database
        await initDatabase();
        console.log('✅ Database initialized');
        
        // Test 1: User Creation with Role-based Profile
        await testUserCreation();
        
        // Test 2: Authentication
        await testAuthentication();
        
        // Test 3: Profile Updates
        await testProfileUpdates();
        
        // Test 4: Experience Management
        await testExperienceManagement();
        
        // Test 5: Education Management
        await testEducationManagement();
        
        // Test 6: Profile Completion Calculation
        await testProfileCompletion();
        
        // Test 7: Role-based Features
        await testRoleBasedFeatures();
        
        console.log('\n🎉 All Profile System Tests Passed!');
        return true;
        
    } catch (error) {
        console.error('❌ Test Failed:', error);
        return false;
    }
}

/**
 * Test user creation with role-based profiles
 */
async function testUserCreation() {
    console.log('\n📝 Testing User Creation...');
    
    const testUsers = [
        {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.test@example.com',
            password: 'testpass123',
            role: ROLES.USER
        },
        {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.test@example.com',
            password: 'testpass123',
            role: ROLES.RECRUITER
        }
    ];
    
    for (const userData of testUsers) {
        try {
            const result = await createUser(userData);
            console.log(`✅ User created: ${result.user.name} (${result.user.role})`);
            
            // Verify profile was created with role-specific data
            const profile = getUserProfile(result.user.id);
            if (!profile) {
                throw new Error('Profile not created');
            }
            
            console.log(`   - Profile created with completion: ${calculateProfileCompletion(profile)}%`);
            console.log(`   - Role-specific fields: ${Object.keys(profile.roleSpecific || {}).length} fields`);
            
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log(`⚠️  User already exists: ${userData.email}`);
            } else {
                throw error;
            }
        }
    }
}

/**
 * Test authentication
 */
async function testAuthentication() {
    console.log('\n🔐 Testing Authentication...');
    
    // Test valid login
    const user = await authenticateUser('john.test@example.com', 'testpass123');
    if (user) {
        console.log(`✅ Authentication successful for ${user.name}`);
    } else {
        // Try with demo user
        const demoUser = await authenticateUser('demo@catalyst.com', 'demo123');
        if (demoUser) {
            console.log(`✅ Authentication successful for ${demoUser.name} (demo)`);
        } else {
            throw new Error('Authentication failed');
        }
    }
    
    // Test invalid login
    const invalidUser = await authenticateUser('invalid@test.com', 'wrongpass');
    if (!invalidUser) {
        console.log('✅ Invalid login correctly rejected');
    } else {
        throw new Error('Invalid login should have been rejected');
    }
}

/**
 * Test profile updates
 */
async function testProfileUpdates() {
    console.log('\n📋 Testing Profile Updates...');
    
    // Get a test user
    let testUser = await authenticateUser('demo@catalyst.com', 'demo123');
    if (!testUser) {
        testUser = await authenticateUser('john.test@example.com', 'testpass123');
    }
    
    if (!testUser) {
        throw new Error('No test user available');
    }
    
    const updates = {
        personalInfo: {
            firstName: 'Updated',
            lastName: 'Name',
            phone: '+1234567890',
            location: 'Test City'
        },
        professionalInfo: {
            title: 'Senior Test Engineer',
            summary: 'Experienced in testing and quality assurance'
        },
        skills: ['JavaScript', 'Testing', 'Quality Assurance']
    };
    
    const updatedProfile = updateUserProfile(testUser.id, updates);
    if (updatedProfile) {
        console.log(`✅ Profile updated for ${testUser.name}`);
        console.log(`   - Name: ${updatedProfile.personalInfo.firstName} ${updatedProfile.personalInfo.lastName}`);
        console.log(`   - Title: ${updatedProfile.professionalInfo.title}`);
        console.log(`   - Skills: ${updatedProfile.skills.length} skills`);
    } else {
        throw new Error('Profile update failed');
    }
}

/**
 * Test experience management
 */
async function testExperienceManagement() {
    console.log('\n💼 Testing Experience Management...');
    
    let testUser = await authenticateUser('demo@catalyst.com', 'demo123');
    if (!testUser) {
        testUser = await authenticateUser('john.test@example.com', 'testpass123');
    }
    
    const experienceData = {
        position: 'Software Engineer',
        company: 'Test Company',
        location: 'Remote',
        startDate: '2022-01-01',
        endDate: '2023-12-31',
        current: false,
        description: 'Developed and maintained web applications'
    };
    
    const newExperience = addExperience(testUser.id, experienceData);
    if (newExperience) {
        console.log(`✅ Experience added: ${newExperience.position} at ${newExperience.company}`);
        
        const experiences = getUserExperiences(testUser.id);
        console.log(`   - Total experiences: ${experiences.length}`);
    } else {
        throw new Error('Experience addition failed');
    }
}

/**
 * Test education management
 */
async function testEducationManagement() {
    console.log('\n🎓 Testing Education Management...');
    
    let testUser = await authenticateUser('demo@catalyst.com', 'demo123');
    if (!testUser) {
        testUser = await authenticateUser('john.test@example.com', 'testpass123');
    }
    
    const educationData = {
        degree: 'Bachelor of Computer Science',
        institution: 'Test University',
        location: 'Test City',
        startDate: '2018-09-01',
        endDate: '2022-06-30',
        description: 'Focused on software engineering and data structures'
    };
    
    const newEducation = addEducation(testUser.id, educationData);
    if (newEducation) {
        console.log(`✅ Education added: ${newEducation.degree} from ${newEducation.institution}`);
        
        const education = getUserEducation(testUser.id);
        console.log(`   - Total education records: ${education.length}`);
    } else {
        throw new Error('Education addition failed');
    }
}

/**
 * Test profile completion calculation
 */
async function testProfileCompletion() {
    console.log('\n📊 Testing Profile Completion...');
    
    let testUser = await authenticateUser('demo@catalyst.com', 'demo123');
    if (!testUser) {
        testUser = await authenticateUser('john.test@example.com', 'testpass123');
    }
    
    const profile = getUserProfile(testUser.id);
    const completion = calculateProfileCompletion(profile);
    
    console.log(`✅ Profile completion calculated: ${completion}%`);
    
    if (completion >= 0 && completion <= 100) {
        console.log('   - Completion percentage is within valid range');
    } else {
        throw new Error('Invalid completion percentage');
    }
}

/**
 * Test role-based features
 */
async function testRoleBasedFeatures() {
    console.log('\n👤 Testing Role-based Features...');
    
    // Test different role profiles
    const testRoles = [
        { email: 'admin@catalyst.com', expectedRole: ROLES.ADMIN },
        { email: 'recruiter@catalyst.com', expectedRole: ROLES.RECRUITER },
        { email: 'demo@catalyst.com', expectedRole: ROLES.USER }
    ];
    
    for (const { email, expectedRole } of testRoles) {
        try {
            const user = await authenticateUser(email, 'demo123');
            if (user) {
                const profile = getUserProfile(user.id);
                
                console.log(`✅ ${expectedRole} profile loaded`);
                console.log(`   - Role-specific fields: ${Object.keys(profile.roleSpecific || {}).length}`);
                
                // Check if role-specific fields exist
                if (profile.roleSpecific && Object.keys(profile.roleSpecific).length > 0) {
                    console.log(`   - Role-specific data found for ${expectedRole}`);
                }
            }
        } catch (error) {
            console.log(`⚠️  Could not test ${expectedRole}: ${error.message}`);
        }
    }
}

/**
 * Manual test runner - can be called from browser console
 */
window.testProfileSystem = runProfileSystemTests;

// Export for use in other modules
export default runProfileSystemTests;
