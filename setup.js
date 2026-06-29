const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'qlljvr9ly',
  port: parseInt(process.env.DB_PORT || '5432'),
};

async function setup() {
  console.log('Connecting to PostgreSQL server to verify/create database...');
  const client = new Client({ ...dbConfig, database: 'postgres' });
  try {
    await client.connect();
    
    const dbName = process.env.DB_NAME || 'apple';
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating it...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('Error verifying/creating database:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }

  console.log('Connecting to target database to run schema migrations...');
  const targetClient = new Client({ ...dbConfig, database: process.env.DB_NAME || 'apple' });
  try {
    await targetClient.connect();
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Running DDL from schema.sql...');
    await targetClient.query(schemaSql);
    console.log('Schema configured successfully.');

    console.log('DDL schema setup is complete. No dummy data seeded.');
  } catch (err) {
    console.error('Error migrating/seeding database:', err.message);
    process.exit(1);
  } finally {
    await targetClient.end();
  }
}

setup();
