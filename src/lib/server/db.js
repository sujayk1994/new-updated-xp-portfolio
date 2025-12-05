import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

export async function initializeDatabase() {
    if (!process.env.DATABASE_URL) {
        console.log('No DATABASE_URL configured, skipping database initialization');
        return;
    }
    
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
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

        await client.query(`
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

        await client.query(`
            CREATE TABLE IF NOT EXISTS about_me_content (
                id SERIAL PRIMARY KEY,
                content JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    } finally {
        client.release();
    }
}

export async function query(text, params) {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
}

export default pool;
