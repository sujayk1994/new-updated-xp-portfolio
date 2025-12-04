import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

async function setupDatabase() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log('Setting up database tables...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('  - admin_users table ready');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS admin_files (
                id VARCHAR(255) PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                storage_type VARCHAR(50) NOT NULL,
                url TEXT,
                ext VARCHAR(50),
                parent VARCHAR(255),
                size INTEGER DEFAULT 0,
                children TEXT DEFAULT '[]',
                basename VARCHAR(255),
                icon TEXT,
                date_created BIGINT,
                date_modified BIGINT,
                sort_option INTEGER DEFAULT 0,
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('  - admin_files table ready');

        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminPassword) {
            const existingAdmin = await pool.query(
                'SELECT id FROM admin_users WHERE username = $1',
                [adminUsername]
            );

            if (existingAdmin.rows.length === 0) {
                const passwordHash = await bcrypt.hash(adminPassword, 10);
                await pool.query(
                    'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
                    [adminUsername, passwordHash]
                );
                console.log(`  - Admin user '${adminUsername}' created`);
            } else {
                console.log(`  - Admin user '${adminUsername}' already exists`);
            }
        } else {
            console.log('  - No ADMIN_PASSWORD set, skipping admin user creation');
        }

        console.log('Database setup complete!');
    } catch (error) {
        console.error('Database setup failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase();
