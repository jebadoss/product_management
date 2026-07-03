const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// Authentication configuration
const AUTH_TOKEN = 'pms-secret-auth-token-value-9988';

// Endpoint for admin login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && (password === 'admin' || password === 'password')) {
    res.json({ success: true, token: AUTH_TOKEN, role: 'admin' });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Middleware to authenticate /api requests
const authenticateAPI = (req, res, next) => {
  if (req.path === '/api/login') {
    return next();
  }
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader === `Bearer ${AUTH_TOKEN}`) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Please login.' });
};

app.use('/api', authenticateAPI);
// ==========================================
// 1. GET FULL DATABASE STATE (GET /api/db)
// ==========================================
app.get('/api/db', async (req, res) => {
  try {
    const employees = await pool.query('SELECT * FROM employees');
    const categories = await pool.query('SELECT * FROM categories');
    const products = await pool.query('SELECT * FROM products');
    const assignments = await pool.query(`
      SELECT a.*, e.name AS employee_name, e.dept
      FROM assignments a
      LEFT JOIN employees e ON a.employee_id = e.code
    `);
    const damages = await pool.query(`
      SELECT d.*, p.code AS product_code, p.name AS product_name
      FROM damages d
      LEFT JOIN products p ON d.product_id = p.id
    `);
    const repairs = await pool.query(`
      SELECT r.*, p.code AS product_code, p.name AS product_name
      FROM repairs r
      LEFT JOIN products p ON r.product_id = p.id
    `);
    const history = await pool.query('SELECT * FROM history');
    
    // Map assignments with productIds array from junction table
    const assignProducts = await pool.query('SELECT * FROM assignment_products');
    const assignProductsMap = {};
    assignProducts.rows.forEach(ap => {
      if (!assignProductsMap[ap.assignment_id]) {
        assignProductsMap[ap.assignment_id] = [];
      }
      assignProductsMap[ap.assignment_id].push(ap.product_id);
    });

    const productsMap = {};
    products.rows.forEach(p => {
      productsMap[p.id] = { name: p.name, code: p.code };
    });

    const assignmentsList = assignments.rows.map(a => {
      const pIds = assignProductsMap[a.id] || [];
      const assignedProducts = pIds.map(id => productsMap[id]).filter(Boolean);
      const prodNames = assignedProducts.map(p => p.name).join(', ');
      const prodCodes = assignedProducts.map(p => p.code).join(', ');

      return {
        id: a.id,
        employeeId: a.employee_id,
        employeeName: a.employee_name || '—',
        dept: a.dept || '',
        assignedDate: a.assigned_date ? a.assigned_date.toISOString().split('T')[0] : '',
        returnDate: a.return_date || '',
        units: a.units,
        updatedAt: parseInt(a.updated_at),
        productId: pIds[0] || null,
        productIds: pIds,
        productName: prodNames,
        productCode: prodCodes
      };
    });

    const categoriesList = categories.rows.map(c => ({
      name: c.name,
      updatedAt: parseInt(c.updated_at)
    }));

    const productsList = products.rows.map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,
      cat: p.cat,
      purchaseDate: p.purchase_date ? p.purchase_date.toISOString().split('T')[0] : '',
      qty: p.qty,
      status: p.status,
      updatedAt: parseInt(p.updated_at)
    }));

    const employeesList = employees.rows.map(e => ({
      id: e.code,
      code: e.code,
      name: e.name,
      dept: e.dept || '',
      role: e.role || '',
      email: e.email || '',
      phone: e.phone || '',
      blood: e.blood || '',
      status: e.status || 'Active',
      joinDate: e.join_date ? e.join_date.toISOString().split('T')[0] : '',
      resignDate: e.resign_date ? e.resign_date.toISOString().split('T')[0] : '',
      address: e.address || '',
      updatedAt: parseInt(e.updated_at)
    }));

    const damagesList = damages.rows.map(d => ({
      id: d.id,
      productId: d.product_id,
      productCode: d.product_code || '—',
      productName: d.product_name || '—',
      status: d.status,
      date: d.date ? d.date.toISOString().split('T')[0] : '',
      by: d.by,
      notes: d.notes || '',
      updatedAt: parseInt(d.updated_at)
    }));

    const repairsList = repairs.rows.map(r => ({
      id: r.id,
      productId: r.product_id,
      productCode: r.product_code || '—',
      productName: r.product_name || '—',
      center: r.center || '',
      contact: r.contact || '',
      takenBy: r.taken_by || '',
      dateSent: r.date_sent ? r.date_sent.toISOString().split('T')[0] : '',
      expectedDate: r.expected_date ? r.expected_date.toISOString().split('T')[0] : '',
      status: r.status || 'Pending',
      completedDate: r.completed_date ? r.completed_date.toISOString() : null,
      notes: r.notes || '',
      updatedAt: parseInt(r.updated_at)
    }));

    const historyList = history.rows.map(h => ({
      id: h.id,
      productCode: h.product_code,
      productName: h.product_name,
      action: h.action,
      employee: h.employee || '—',
      date: h.date ? h.date.toISOString() : '',
      returnDate: h.return_date ? h.return_date.toISOString() : null,
      notes: h.notes || '',
      updatedAt: parseInt(h.updated_at)
    }));

    res.json({
      employees: employeesList,
      categories: categoriesList,
      products: productsList,
      assignments: assignmentsList,
      damages: damagesList,
      repairs: repairsList,
      history: historyList
    });
  } catch (err) {
    console.error('Error fetching DB state:', err);
    res.status(500).json({ error: 'Database error fetching system state' });
  }
});

// ==========================================
// 2. EMPLOYEES CRUD
// ==========================================
app.post('/api/employees', async (req, res) => {
  const { name, dept, role, email, phone, blood, status, joinDate, resignDate, address } = req.body;
  if (!name || !joinDate) {
    return res.status(400).json({ error: 'Name and Joining Date are required.' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const seqRes = await client.query("SELECT nextval('employees_code_seq')");
    const nextCode = String(seqRes.rows[0].nextval);

    const result = await client.query(
      `INSERT INTO employees (code, name, dept, role, email, phone, blood, status, join_date, resign_date, address, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING code`,
      [
        nextCode, 
        name, 
        dept || null, 
        role || null, 
        email || null, 
        phone || null, 
        blood || null, 
        status || 'Active', 
        joinDate || null, 
        (resignDate === '') ? null : (resignDate || null), 
        address || null, 
        Date.now()
      ]
    );
    await client.query('COMMIT');
    res.json({ success: true, id: result.rows[0].code });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { code, name, dept, role, email, phone, blood, status, joinDate, resignDate, address } = req.body;
  if (!name || !joinDate) {
    return res.status(400).json({ error: 'Name and Joining Date are required.' });
  }
  try {
    await pool.query(
      `UPDATE employees 
       SET code = $1, name = $2, dept = $3, role = $4, email = $5, phone = $6, blood = $7, status = $8, join_date = $9, resign_date = $10, address = $11, updated_at = $12 
       WHERE code = $13`,
      [
        code, 
        name, 
        dept || null, 
        role || null, 
        email || null, 
        phone || null, 
        blood || null, 
        status, 
        joinDate || null, 
        (resignDate === '') ? null : (resignDate || null), 
        address || null, 
        Date.now(), 
        id
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM employees WHERE code = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. CATEGORIES CRUD
// ==========================================
app.post('/api/categories', async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO categories (name, updated_at) VALUES ($1, $2)', [name, Date.now()]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:name', async (req, res) => {
  const oldName = req.params.name;
  const { name } = req.body;
  try {
    if (name && name !== oldName) {
      await pool.query(
        'UPDATE categories SET name = $1, updated_at = $2 WHERE name = $3',
        [name, Date.now(), oldName]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:name', async (req, res) => {
  const { name } = req.params;
  try {
    await pool.query('DELETE FROM categories WHERE name = $1', [name]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. PRODUCTS CRUD
// ==========================================
app.post('/api/products', async (req, res) => {
  const { code, name, cat, purchaseDate, qty, status } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const insertQty = parseInt(qty) || 1;
    
    // Helper function to parse and generate sequential codes
    const generateSequentialCodes = (startCode, count) => {
      const match = startCode.match(/^(.*?)(\d+)$/);
      if (!match) {
        const codes = [];
        for (let i = 0; i < count; i++) {
          codes.push(count === 1 ? startCode : `${startCode}-${i + 1}`);
        }
        return codes;
      }
      const prefix = match[1];
      const numStr = match[2];
      const startNum = parseInt(numStr, 10);
      const width = numStr.length;
      
      const codes = [];
      for (let i = 0; i < count; i++) {
        const currentNum = startNum + i;
        const currentNumStr = String(currentNum).padStart(width, '0');
        codes.push(prefix + currentNumStr);
      }
      return codes;
    };
    
    const codes = generateSequentialCodes(code, insertQty);
    let lastInsertedId = null;
    
    for (const currentCode of codes) {
      const prodResult = await client.query(
        `INSERT INTO products (code, name, cat, purchase_date, qty, status, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [currentCode, name, cat, purchaseDate || null, 1, status || 'Available', Date.now()]
      );
      lastInsertedId = prodResult.rows[0].id;
      
      await client.query(
        `INSERT INTO history (product_code, product_name, action, employee, date, notes, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [currentCode, name, 'Added', '—', new Date(), 'Product added to inventory', Date.now()]
      );
    }
    
    await client.query('COMMIT');
    res.json({ success: true, id: lastInsertedId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { code, name, cat, purchaseDate, qty, status } = req.body;
  try {
    await pool.query(
      `UPDATE products 
       SET code = $1, name = $2, cat = $3, purchase_date = $4, qty = $5, status = $6, updated_at = $7 
       WHERE id = $8`,
      [code, name, cat, purchaseDate || null, qty || 1, status, Date.now(), id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/accessories', async (req, res) => {
  const { name, cat, itemType, brand, qty, date, status } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const seqRes = await client.query("SELECT nextval('products_id_seq')");
    const nextId = seqRes.rows[0].nextval;
    const code = 'ACC' + String(nextId).padStart(3, '0');
    
    await client.query(
      `INSERT INTO products (id, code, name, cat, purchase_date, qty, status, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [nextId, code, name, cat, date || null, qty || 1, status || 'Available', Date.now()]
    );
    
    await client.query(
      `INSERT INTO history (product_code, product_name, action, employee, date, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [code, name, 'Added', '—', date ? new Date(date) : new Date(), `Accessory item (${itemType || 'Unknown'}) added to inventory`, Date.now()]
    );
    
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ==========================================
// 5. ASSIGNMENTS CRUD
// ==========================================
app.post('/api/assignments', async (req, res) => {
  const { employeeId, employeeName, dept, category, productIds, productNames, productCodes, assignedDate } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const assignRes = await client.query(
      `INSERT INTO assignments (employee_id, assigned_date, return_date, units, updated_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [employeeId, assignedDate, '', productIds.length, Date.now()]
    );
    const assignId = assignRes.rows[0].id;
    
    for (const pId of productIds) {
      await client.query(
        'INSERT INTO assignment_products (assignment_id, product_id) VALUES ($1, $2)',
        [assignId, pId]
      );
      
      const prodRes = await client.query('UPDATE products SET status = $1, updated_at = $2 WHERE id = $3 RETURNING code, name', ['Assigned', Date.now(), pId]);
      const prod = prodRes.rows[0];
      
      await client.query(
        `INSERT INTO history (product_code, product_name, action, employee, date, notes, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [prod.code, prod.name, 'Assigned', employeeName, new Date(assignedDate), `Assigned to ${employeeName}`, Date.now()]
      );
    }
    
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/assignments/:id', async (req, res) => {
  const { id } = req.params;
  const { employeeId, employeeName, dept, productIds, assignedDate } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const oldProdsRes = await client.query('SELECT product_id FROM assignment_products WHERE assignment_id = $1', [id]);
    const oldProductIds = oldProdsRes.rows.map(r => r.product_id);
    
    const removedProductIds = oldProductIds.filter(pId => !productIds.includes(pId));
    for (const pId of removedProductIds) {
      await client.query('DELETE FROM assignment_products WHERE assignment_id = $1 AND product_id = $2', [id, pId]);
      const prodRes = await client.query("UPDATE products SET status = 'Available', updated_at = $2 WHERE id = $1 RETURNING code, name", [pId, Date.now()]);
      const prod = prodRes.rows[0];
      
      await client.query(
        `INSERT INTO history (product_code, product_name, action, employee, date, notes, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [prod.code, prod.name, 'Removed', employeeName, new Date(), `Removed from edited assignment to ${employeeName}`, Date.now()]
      );
    }
    
    const addedProductIds = productIds.filter(pId => !oldProductIds.includes(pId));
    for (const pId of addedProductIds) {
      await client.query('INSERT INTO assignment_products (assignment_id, product_id) VALUES ($1, $2)', [id, pId]);
      const prodRes = await client.query("UPDATE products SET status = 'Assigned', updated_at = $2 WHERE id = $1 RETURNING code, name", [pId, Date.now()]);
      const prod = prodRes.rows[0];
      
      await client.query(
        `INSERT INTO history (product_code, product_name, action, employee, date, notes, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [prod.code, prod.name, 'Assigned', employeeName, new Date(assignedDate), `Assigned in edited assignment to ${employeeName}`, Date.now()]
      );
    }
    
    await client.query(
      `UPDATE assignments 
       SET employee_id = $1, assigned_date = $2, units = $3, updated_at = $4
       WHERE id = $5`,
      [employeeId, assignedDate, productIds.length, Date.now(), id]
    );
    
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/assignments/:id/return', async (req, res) => {
  const { id } = req.params;
  const { returnDate } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const assignRes = await client.query(
      `SELECT e.name AS employee_name 
       FROM assignments a
       LEFT JOIN employees e ON a.employee_id = e.code 
       WHERE a.id = $1`, 
      [id]
    );
    const employeeName = assignRes.rowCount > 0 && assignRes.rows[0].employee_name ? assignRes.rows[0].employee_name : '—';
    
    const prodsRes = await client.query('SELECT product_id FROM assignment_products WHERE assignment_id = $1', [id]);
    for (const row of prodsRes.rows) {
      const pId = row.product_id;
      const prodRes = await client.query("UPDATE products SET status = 'Available', updated_at = $2 WHERE id = $1 RETURNING code, name", [pId, Date.now()]);
      const prod = prodRes.rows[0];
      
      await client.query(
        `INSERT INTO history (product_code, product_name, action, employee, date, return_date, notes, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [prod.code, prod.name, 'Returned', employeeName, new Date(), new Date(), 'Product returned from bundle', Date.now()]
      );
    }
    
    await client.query(
      'UPDATE assignments SET return_date = $1, updated_at = $2 WHERE id = $3',
      [returnDate, Date.now(), id]
    );
    
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/assignments/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const assignRes = await client.query('SELECT return_date FROM assignments WHERE id = $1', [id]);
    if (assignRes.rowCount > 0 && !assignRes.rows[0].return_date) {
      const prodsRes = await client.query('SELECT product_id FROM assignment_products WHERE assignment_id = $1', [id]);
      for (const row of prodsRes.rows) {
        await client.query("UPDATE products SET status = 'Available', updated_at = $2 WHERE id = $1", [row.product_id, Date.now()]);
      }
    }
    
    await client.query('DELETE FROM assignments WHERE id = $1', [id]);
    
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ==========================================
// 6. DAMAGES CRUD
// ==========================================
app.post('/api/damages', async (req, res) => {
  const { productId, status, date, by, notes } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const prodRes = await client.query('SELECT code, name FROM products WHERE id = $1', [productId]);
    const prod = prodRes.rows[0];
    
    await client.query(
      `INSERT INTO damages (product_id, status, date, "by", notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [productId, status, date, by, notes, Date.now()]
    );
    
    const finalStatus = status === 'Damaged' ? 'Damaged' : 'Replaced';
    await client.query('UPDATE products SET status = $1, updated_at = $2 WHERE id = $3', [finalStatus, Date.now(), productId]);
    
    await client.query(
      `INSERT INTO history (product_code, product_name, action, employee, date, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [prod.code, prod.name, finalStatus, '—', new Date(date), notes, Date.now()]
    );
    
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/damages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM damages WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. REPAIRS CRUD
// ==========================================
app.post('/api/repairs', async (req, res) => {
  const { productId, center, contact, takenBy, dateSent, expectedDate, status, notes } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const prodRes = await client.query('SELECT code, name FROM products WHERE id = $1', [productId]);
    const prod = prodRes.rows[0];
    
    const completedDate = status === 'Completed' ? new Date() : null;
    await client.query(
      `INSERT INTO repairs (product_id, center, contact, taken_by, date_sent, expected_date, status, completed_date, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [productId, center, contact, takenBy, dateSent, expectedDate || null, status, completedDate, notes, Date.now()]
    );
    
    const prodStatus = status === 'Completed' ? 'Available' : 'Repair';
    await client.query("UPDATE products SET status = $1, updated_at = $2 WHERE id = $3", [prodStatus, Date.now(), productId]);
    
    if (status === 'Completed') {
      await client.query(
        `INSERT INTO history (product_code, product_name, action, employee, date, return_date, notes, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [prod.code, prod.name, 'Repaired', '—', new Date(), new Date(), 'Repair completed, returned to inventory', Date.now()]
      );
    } else {
      await client.query(
        `INSERT INTO history (product_code, product_name, action, employee, date, notes, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [prod.code, prod.name, 'Repair', '—', new Date(dateSent), `Sent to ${center}`, Date.now()]
      );
    }
    
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/repairs/:id/complete', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const repairRes = await client.query(
      `SELECT r.product_id, p.code AS product_code, p.name AS product_name 
       FROM repairs r
       LEFT JOIN products p ON r.product_id = p.id
       WHERE r.id = $1`, 
      [id]
    );
    const r = repairRes.rows[0];
    
    await client.query("UPDATE repairs SET status = 'Completed', completed_date = $2, updated_at = $3 WHERE id = $1", [id, new Date(), Date.now()]);
    await client.query("UPDATE products SET status = 'Available', updated_at = $2 WHERE id = $1", [r.product_id, Date.now()]);
    
    await client.query(
      `INSERT INTO history (product_code, product_name, action, employee, date, return_date, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [r.product_code, r.product_name, 'Repaired', '—', new Date(), new Date(), 'Repair completed, returned to inventory', Date.now()]
    );
    
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/repairs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM repairs WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} - [v2 - Mapped Products]`);
  try {
    // 1. Create the sequence if it does not exist
    await pool.query("CREATE SEQUENCE IF NOT EXISTS employees_code_seq START WITH 1");
    console.log("Successfully verified/created employees_code_seq sequence.");

    // 2. Query all existing employees to check and migrate their codes
    const empsRes = await pool.query("SELECT code FROM employees ORDER BY code");
    const updates = [];
    const usedInts = new Set();
    
    // First pass: identify already numeric codes
    for (const row of empsRes.rows) {
      const trimmed = (row.code || '').trim();
      const val = parseInt(trimmed, 10);
      if (!isNaN(val) && String(val) === trimmed) {
        usedInts.add(val);
      }
    }
    
    // Helper to get next available integer starting from 1
    let nextAvailableInt = 1;
    const getNextInt = () => {
      while (usedInts.has(nextAvailableInt)) {
        nextAvailableInt++;
      }
      usedInts.add(nextAvailableInt);
      return nextAvailableInt;
    };
    
    // Second pass: migrate non-numeric codes
    for (const row of empsRes.rows) {
      const trimmed = (row.code || '').trim();
      const val = parseInt(trimmed, 10);
      
      // If it's already a clean numeric string, keep it
      if (!isNaN(val) && String(val) === trimmed) {
        continue;
      }
      
      // Try parsing from standard formats like EMP001
      const match = trimmed.match(/^EMP0*(\d+)$/i);
      let newInt;
      if (match) {
        newInt = parseInt(match[1], 10);
        if (usedInts.has(newInt)) {
          newInt = getNextInt();
        } else {
          usedInts.add(newInt);
        }
      } else {
        newInt = getNextInt();
      }
      
      updates.push({ oldCode: row.code, newCode: String(newInt) });
    }
    
    // Run updates in a transaction so foreign key updates cascade atomically
    if (updates.length > 0) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const update of updates) {
          console.log(`Migrating employee code: ${update.oldCode} -> ${update.newCode}`);
          await client.query('UPDATE employees SET code = $1 WHERE code = $2', [update.newCode, update.oldCode]);
        }
        await client.query('COMMIT');
        console.log(`Successfully migrated ${updates.length} employee codes to numeric format.`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error migrating employee codes in transaction:', err);
      } finally {
        client.release();
      }
    }

    // 3. Sync the sequence with the max numeric value in the DB
    const finalEmpsRes = await pool.query("SELECT code FROM employees");
    let maxVal = 0;
    for (const row of finalEmpsRes.rows) {
      const val = parseInt(row.code, 10);
      if (!isNaN(val) && val > maxVal) {
        maxVal = val;
      }
    }
    if (maxVal > 0) {
      await pool.query(`SELECT setval('employees_code_seq', ${maxVal})`);
    }
    console.log(`Employee code sequence synced. Next code will be ${maxVal + 1}`);
  } catch (err) {
    console.error('Error initializing/migrating employee codes on server startup:', err.message);
  }

  try {
    await pool.query('UPDATE employees SET join_date = CURRENT_DATE WHERE join_date IS NULL');
    await pool.query('ALTER TABLE employees ALTER COLUMN join_date SET NOT NULL');
    console.log('Successfully verified/altered employees.join_date to NOT NULL.');
  } catch (err) {
    console.error('Error altering employees.join_date to NOT NULL:', err.message);
  }

  try {
    await pool.query('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_code_key');
    console.log('Successfully dropped/verified unique constraint on product code.');
  } catch (err) {
    console.error('Error dropping unique constraint on product code:', err.message);
  }
  try {
    await pool.query('ALTER TABLE repairs ADD COLUMN IF NOT EXISTS completed_date TIMESTAMP');
    console.log('Successfully verified/added completed_date column to repairs.');
  } catch (err) {
    console.error('Error verifying/adding completed_date column to repairs:', err.message);
  }
  try {
    await pool.query('ALTER TABLE history ALTER COLUMN date TYPE TIMESTAMP');
    console.log('Successfully verified/altered history.date to TIMESTAMP.');
  } catch (err) {
    console.error('Error altering history.date to TIMESTAMP:', err.message);
  }
  try {
    await pool.query('ALTER TABLE history ALTER COLUMN return_date TYPE TIMESTAMP');
    console.log('Successfully verified/altered history.return_date to TIMESTAMP.');
  } catch (err) {
    console.error('Error altering history.return_date to TIMESTAMP:', err.message);
  }
});
