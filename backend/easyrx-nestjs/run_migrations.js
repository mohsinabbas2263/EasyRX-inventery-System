require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    user: process.env.DATABASE_USER || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    database: process.env.DATABASE_NAME || 'easyrx',
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
});

async function runMigrations() {
    const migrationsDir = path.join(__dirname, 'src/database/migrations');
    
    // Read and sort migration files
    let migrationFiles = [];
    try {
        migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort((a, b) => a.localeCompare(b)); // Ensure numeric order 001, 002...
    } catch (err) {
        console.error(`Error reading migrations directory: ${err.message}`);
        process.exit(1);
    }

    if (migrationFiles.length === 0) {
        console.log('No migration files found.');
        return;
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Ensure migrations table exists (optional, simply running all for now as per previous logic)
        // Ideally we should track which migrations ran. 
        // For 'Prod Prep' implies setting up fresh or ensuring consistency. 
        // We will just run them. If using idempotent SQL (IF NOT EXISTS), it's fine.
        
        for (const file of migrationFiles) {
            console.log(`Running migration: ${file}`);
            const filePath = path.join(migrationsDir, file);
            
            const sql = fs.readFileSync(filePath, 'utf8');
            if (sql.trim().length === 0) {
                console.warn(`⚠ Skipping empty migration: ${file}`);
                continue;
            }
            
            try {
                await client.query(sql);
                console.log(`✓ Completed: ${file}`);
            } catch (queryErr) {
                console.error(`Error executing ${file}: ${queryErr.message}`);
                throw queryErr;
            }
        }
        await client.query('COMMIT');
        console.log('✓ All migrations applied successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('✗ Migration failed:', err.message);
        console.error('Detail:', err.detail);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
