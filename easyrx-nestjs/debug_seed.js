const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});

async function run() {
    console.log('Connecting to:', process.env.DATABASE_NAME);
    const client = await pool.connect();
    try {
        const filePath = path.join(__dirname, 'src/database/seeds/001_initial_seed.sql');
        let sql = fs.readFileSync(filePath, 'utf8');

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('admin123', salt);
        sql = sql.replace('$2a$10$g.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.1.2.3.4.5.6.7.8.9.0', hash);

        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log('✓ Seeded successfully');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('FAILED:', err.message);
        if (err.detail) console.error('DETAIL:', err.detail);
        if (err.where) console.error('WHERE:', err.where);
    } finally {
        client.release();
        await pool.end();
    }
}

run();
