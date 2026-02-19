import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function checkColumns() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Property'
    `);
        console.log('Columns in Property table:');
        res.rows.forEach(row => {
            console.log(`- ${row.column_name}: ${row.data_type}`);
        });
    } catch (err) {
        console.error('Error checking columns:', err);
    } finally {
        await pool.end();
    }
}

checkColumns();
