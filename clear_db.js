const { Client } = require('pg');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'qlljvr9ly',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'orange',
};

async function clearDb() {
  console.log('Connecting to PostgreSQL to clean up dummy data...');
  const client = new Client(dbConfig);
  try {
    await client.connect();

    // Truncate tables with CASCADE
    console.log('Clearing all tables...');
    await client.query(
      'TRUNCATE TABLE assignment_products, assignments, damages, repairs, products, employees, categories, history, users RESTART IDENTITY CASCADE'
    );
    await client.query(
      `INSERT INTO users (username, password, role, updated_at) 
       VALUES ('admin', 'admin', 'admin', $1)`,
      [Date.now()]
    );
    await client.query('ALTER SEQUENCE IF EXISTS employees_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE IF EXISTS employees_code_seq RESTART WITH 1');
    console.log('All dummy data cleared and database tables are now empty!');
  } catch (err) {
    console.error('Error clearing database:', err.message);
  } finally {
    await client.end();
  }
}

clearDb();
