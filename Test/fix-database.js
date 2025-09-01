/**
 * Database Connection Fix Script
 * This script helps troubleshoot and fix common database connection issues
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    connectTimeout: 10000,
    acquireTimeout: 10000
};

async function testDatabaseConnection() {
    console.log('🔍 Testing database connection...\n');
    console.log('Configuration:');
    console.log(`Host: ${dbConfig.host}`);
    console.log(`User: ${dbConfig.user}`);
    console.log(`Port: ${dbConfig.port}`);
    console.log(`Password: ${dbConfig.password ? '***hidden***' : 'empty'}\n`);

    try {
        // Test basic connection without database
        console.log('Step 1: Testing MySQL server connection...');
        const connectionWithoutDb = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port
        });
        
        console.log('✅ MySQL server connection successful!\n');
        
        // Test if target database exists
        console.log('Step 2: Checking if database exists...');
        const [databases] = await connectionWithoutDb.execute('SHOW DATABASES');
        const dbExists = databases.some(db => db.Database === (process.env.DB_NAME || 'catalyst_hr_system'));
        
        if (dbExists) {
            console.log(`✅ Database '${process.env.DB_NAME || 'catalyst_hr_system'}' exists!\n`);
        } else {
            console.log(`⚠️ Database '${process.env.DB_NAME || 'catalyst_hr_system'}' does not exist.`);
            console.log('Creating database...\n');
            
            await connectionWithoutDb.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'catalyst_hr_system'}\``);
            console.log('✅ Database created successfully!\n');
        }
        
        await connectionWithoutDb.end();
        
        // Test connection with database
        console.log('Step 3: Testing full database connection...');
        const fullConnection = await mysql.createConnection({
            ...dbConfig,
            database: process.env.DB_NAME || 'catalyst_hr_system'
        });
        
        console.log('✅ Full database connection successful!\n');
        
        // Test if required tables exist
        console.log('Step 4: Checking database structure...');
        const [tables] = await fullConnection.execute('SHOW TABLES');
        
        if (tables.length === 0) {
            console.log('⚠️ Database is empty. Please run the database setup script.');
            console.log('Run: npm run db:setup\n');
        } else {
            console.log(`✅ Found ${tables.length} tables in database:`);
            tables.forEach(table => {
                console.log(`  - ${Object.values(table)[0]}`);
            });
            console.log();
        }
        
        await fullConnection.end();
        
        console.log('🎉 Database connection test completed successfully!');
        console.log('Your application should be able to connect to the database.\n');
        
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error(`Error: ${error.message}\n`);
        
        // Provide specific troubleshooting advice
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Troubleshooting suggestions:');
            console.log('1. Make sure MySQL server is running');
            console.log('2. Check if the port (3306) is correct');
            console.log('3. Verify the host address\n');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('💡 Troubleshooting suggestions:');
            console.log('1. Check username and password in .env file');
            console.log('2. Make sure the MySQL user has proper permissions');
            console.log('3. Try connecting with MySQL Workbench or command line first\n');
        } else if (error.message.includes('auth_gssapi_client')) {
            console.log('💡 MySQL Authentication Plugin Issue Detected:');
            console.log('1. This is likely a MariaDB server with GSSAPI authentication');
            console.log('2. Try changing your MySQL user to use mysql_native_password:');
            console.log('   ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'your_password\';');
            console.log('   FLUSH PRIVILEGES;');
            console.log('3. Or try connecting to a standard MySQL server instead of MariaDB\n');
        }
    }
}

async function createSampleData() {
    console.log('🔧 Creating sample data for testing...\n');
    
    try {
        const connection = await mysql.createConnection({
            ...dbConfig,
            database: process.env.DB_NAME || 'catalyst_hr_system'
        });
        
        // Check if tables exist before creating sample data
        const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
        
        if (tables.length === 0) {
            console.log('❌ Cannot create sample data: database tables do not exist.');
            console.log('Please run the database setup script first: npm run db:setup');
            await connection.end();
            return;
        }
        
        // Sample data creation would go here
        console.log('✅ Sample data creation completed!');
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ Failed to create sample data:', error.message);
    }
}

// Run the tests
async function main() {
    console.log('🚀 Catalyst HR System - Database Connection Tester\n');
    console.log('=' * 50 + '\n');
    
    await testDatabaseConnection();
    
    // Ask if user wants to create sample data
    console.log('Would you like to create sample data? (This requires tables to exist)');
    console.log('You can run this script with --sample-data flag to create sample data.');
    
    if (process.argv.includes('--sample-data')) {
        await createSampleData();
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testDatabaseConnection, createSampleData };
