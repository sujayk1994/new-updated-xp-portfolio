import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

async function setupDatabase() {
    if (!process.env.DATABASE_URL) {
        console.log('No DATABASE_URL found. Skipping database setup.');
        console.log('The app will work but admin features will be unavailable.');
        return;
    }

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
                basename VARCHAR(255) NOT NULL,
                ext VARCHAR(50) DEFAULT '',
                parent VARCHAR(255) NOT NULL,
                icon VARCHAR(255),
                storage_type VARCHAR(50) DEFAULT 'admin',
                url TEXT,
                size INTEGER DEFAULT 0,
                children TEXT DEFAULT '[]',
                date_created BIGINT NOT NULL,
                date_modified BIGINT NOT NULL,
                sort_option INTEGER DEFAULT 0,
                sort_order INTEGER DEFAULT 0,
                starting_point BOOLEAN DEFAULT FALSE,
                executable BOOLEAN DEFAULT FALSE,
                file_data BYTEA,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('  - admin_files table ready');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS admin_videos (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                youtube_id VARCHAR(50) NOT NULL,
                channel VARCHAR(255) DEFAULT 'Portfolio Channel',
                description TEXT,
                duration VARCHAR(20) DEFAULT '0:00',
                views VARCHAR(50) DEFAULT '0 views',
                thumbnail_url TEXT,
                is_public BOOLEAN DEFAULT TRUE,
                display_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('  - admin_videos table ready (for Stube video portfolio)');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS about_me_content (
                id SERIAL PRIMARY KEY,
                content JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('  - about_me_content table ready (for profile info)');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS boot_screen_settings (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50) DEFAULT 'default',
                custom_gif TEXT,
                show_logo BOOLEAN DEFAULT TRUE,
                show_progress BOOLEAN DEFAULT TRUE,
                show_copyright BOOLEAN DEFAULT TRUE,
                background_color VARCHAR(20) DEFAULT '#000000',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('  - boot_screen_settings table ready (for boot screen customization)');

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
            console.log('    (Set ADMIN_PASSWORD environment variable to create an admin)');
        }

        console.log('');
        console.log('Database setup complete!');
    } catch (error) {
        console.error('Database setup failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase();
