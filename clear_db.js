const { Client } = require('pg');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'qlljvr9ly',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'apple',
};

async function clearDb() {
  console.log('Connecting to PostgreSQL to clean up dummy data...');
  const client = new Client(dbConfig);
  try {
    await client.connect();
    
    // Truncate tables with CASCADE
    console.log('Clearing all tables...');
    await client.query(
      'TRUNCATE TABLE assignment_products, assignments, damages, repairs, products, employees, categories, history RESTART IDENTITY CASCADE'
    );
    console.log('All dummy data cleared and database tables are now empty!');
  } catch (err) {
    console.error('Error clearing database:', err.message);
  } finally {
    await client.end();
  }
}

clearDb();
