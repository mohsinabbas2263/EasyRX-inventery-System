require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is installed

const pool = new Pool({
    user: process.env.DATABASE_USER || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    database: process.env.DATABASE_NAME || 'easyrx',
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
});

async function runSeeds() {
    const seedsDir = path.join(__dirname, 'src/database/seeds');

    // Read and sort seed files
    let seedFiles = [];
    try {
        if (fs.existsSync(seedsDir)) {
            seedFiles = fs.readdirSync(seedsDir)
                .filter(file => file.endsWith('.sql'))
                .sort((a, b) => a.localeCompare(b));
        } else {
            console.log('Seeds directory not found.');
            return;
        }
    } catch (err) {
        console.error(`Error reading seeds directory: ${err.message}`);
        process.exit(1);
    }

    if (seedFiles.length === 0) {
        console.log('No seed files found.');
        return;
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Generate real hash for admin123
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('admin123', salt);

        for (const file of seedFiles) {
            console.log(`Running seed: ${file}`);
            const filePath = path.join(seedsDir, file);
            let sql = fs.readFileSync(filePath, 'utf8');

            if (file.includes('initial_seed')) {
                // Determine the correct replace string based on what's in the file
                // I put a placeholder in the file creation step.
                // Let's replace the placeholder with the real hash
                sql = sql.replace(/'\$2a\$10\$g\.k\.l\.m\.n\.o\.p\.q\.r\.s\.t\.u\.v\.w\.x\.y\.z\.1\.2\.3\.4\.5\.6\.7\.8\.9\.0'/, `'${hash}'`);
            }

            if (sql.trim().length === 0) continue;

            await client.query(sql);
            console.log(`✓ Seeded: ${file}`);
        }
        await client.query('COMMIT');
        console.log('✓ All seeds applied successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('✗ Seeding failed:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runSeeds().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
