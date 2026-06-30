const pool = require('./db');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  let logContent = '=== DATABASE DIAGNOSTICS ===\n';
  logContent += `Timestamp: ${new Date().toISOString()}\n\n`;

  try {
    logContent += 'Testing connection to database...\n';
    const timeRes = await pool.query('SELECT NOW()');
    logContent += `Success! Database Time: ${timeRes.rows[0].now}\n\n`;

    logContent += 'Querying categories table...\n';
    const cats = await pool.query('SELECT * FROM categories');
    logContent += `Categories count: ${cats.rowCount}\n`;
    logContent += JSON.stringify(cats.rows, null, 2) + '\n\n';

    logContent += 'Querying products table...\n';
    const prods = await pool.query('SELECT * FROM products');
    logContent += `Products count: ${prods.rowCount}\n`;
    logContent += JSON.stringify(prods.rows, null, 2) + '\n\n';

    logContent += 'Querying assignments table...\n';
    const assigns = await pool.query('SELECT * FROM assignments');
    logContent += `Assignments count: ${assigns.rowCount}\n`;
    logContent += JSON.stringify(assigns.rows, null, 2) + '\n\n';

    logContent += 'Querying assignment_products table...\n';
    const junction = await pool.query('SELECT * FROM assignment_products');
    logContent += `Junction rows count: ${junction.rowCount}\n`;
    logContent += JSON.stringify(junction.rows, null, 2) + '\n\n';

  } catch (err) {
    logContent += `\nERROR OCCURRED: ${err.message}\n`;
    logContent += `Stack Trace:\n${err.stack}\n`;
  } finally {
    fs.writeFileSync(path.join(__dirname, 'db_diagnostics.log'), logContent, 'utf8');
    console.log('Diagnostics completed! Log written to db_diagnostics.log');
    await pool.end();
  }
}

testConnection();
