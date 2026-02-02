const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});

async function inspect() {
    await client.connect();
    const res = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    console.log('Tables:', res.rows.map(r => r.tablename));

    const views = await client.query("SELECT viewname FROM pg_catalog.pg_views WHERE schemaname = 'public'");
    console.log('Views:', views.rows.map(v => v.viewname));

    await client.end();
}

inspect().catch(console.error);
