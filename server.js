const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

function formatDateLocal(d) {
  if (!d) return '';
  const date = (d instanceof Date) ? d : new Date(d);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Verify/update database schema dynamically
pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(100)')
  .then(() => pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20)'))
  .then(() => pool.query("UPDATE users SET status = 'approved' WHERE status IS NULL"))
  .then(() => pool.query("ALTER TABLE users ALTER COLUMN status SET DEFAULT 'pending'"))
  .then(() => pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS requested_at BIGINT'))
  .then(() => pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at BIGINT'))
  .then(() => pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS rejected_at BIGINT'))
  .then(() => pool.query('UPDATE users SET requested_at = updated_at WHERE requested_at IS NULL'))
  .then(() => pool.query("UPDATE users SET approved_at = updated_at WHERE status = 'approved' AND approved_at IS NULL"))
  .then(() => console.log('Database users schema verified (email, status & timeline timestamp columns).'))
  .catch(err => console.error('Database migration error:', err.message));

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

// Rate limiting configuration for auth endpoints (20 requests per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// In-memory OTP store (keys: exact case username, values: { otp, expires })
const otpStore = new Map();
const signupOtpStore = new Map();

// Configure SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// Input Validation Functions
const validateUsername = (username) => {
  const regex = /^(?![0-9]+$)[a-zA-Z0-9_]{4,}$/;
  return regex.test(username);
};

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  const regex = /^(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$/;
  return regex.test(password);
};

// Endpoint for admin login
app.post('/api/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (!validateUsername(username.trim())) {
    return res.status(400).json({ error: 'Invalid username' });
  }

  try {
    const userRes = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username.trim()]
    );

    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      let match = false;
      let needsUpgrade = false;

      // Check if it's hashed using bcrypt
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        match = await bcrypt.compare(password, user.password);
      } else {
        // Plain text fallback matching (for legacy seeded credentials)
        match = (user.password === password);
        if (match) {
          needsUpgrade = true;
        }
      }

      if (match) {
        // Check approval status
        if (user.status === 'pending') {
          return res.status(403).json({ error: 'Your admin account is pending approval by the super admin.' });
        }
        if (user.status === 'rejected') {
          return res.status(403).json({ error: 'Your admin account registration request was rejected.' });
        }

        if (needsUpgrade) {
          const hashed = await bcrypt.hash(password, 10);
          await pool.query(
            'UPDATE users SET password = $1 WHERE id = $2',
            [hashed, user.id]
          );
          console.log(`[SECURITY] Upgraded password hashing to bcrypt for user: ${user.username}`);
        }
        res.json({ success: true, token: AUTH_TOKEN, role: user.role, username: user.username });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } else {
      // Safe fallback static checks for default setup if DB is uninitialized/empty
      if (username.trim() === 'admin' && (password === 'roriri' || password === 'password')) {
        const hashed = await bcrypt.hash(password, 10);
        await pool.query(
          "INSERT INTO users (username, password, role, updated_at, email, status) VALUES ($1, $2, $3, $4, $5, 'approved') ON CONFLICT DO NOTHING",
          ['admin', hashed, 'admin', Date.now(), 'roririsoftpvtltd@gmail.com']
        );
        res.json({ success: true, token: AUTH_TOKEN, role: 'admin', username: 'admin' });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Endpoint for admin signup
app.post('/api/signup', authLimiter, async (req, res) => {
  // Check if signup is disabled via environment variable
  if (process.env.ENABLE_SIGNUP === 'false') {
    return res.status(403).json({ error: 'Registration is currently disabled.' });
  }

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Validate username, email, and password complexity
  if (!validateUsername(cleanUsername)) {
    return res.status(400).json({
      error: 'Username must be at least 4 characters long and contain only letters, numbers, or underscores.'
    });
  }

  if (!validateEmail(cleanEmail)) {
    return res.status(400).json({
      error: 'Please enter a valid Gmail address (@gmail.com).'
    });
  }

  if (!validatePassword(cleanPassword)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and contain at least one number and one special character (@$!%*#?&).'
    });
  }

  try {
    // Check if username already exists
    const checkRes = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [cleanUsername]
    );
    if (checkRes.rows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const checkEmailRes = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [cleanEmail]
    );
    if (checkEmailRes.rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Generate a 6-digit OTP code for registration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 1 * 60 * 1000; // 1 minute expiration for signup code

    // Store signup data in signupOtpStore
    signupOtpStore.set(cleanUsername, {
      email: cleanEmail,
      password: cleanPassword, // We store the plain password temporarily, hash it during verification
      otp,
      expires
    });

    console.log(`\n==============================================`);
    console.log(`[SIGNUP SERVICE] OTP for ${cleanUsername}: ${otp}`);
    console.log(`[SIGNUP SERVICE] Email destination: ${cleanEmail}`);
    console.log(`==============================================\n`);

    // Send actual email using SMTP transporter
    const mailOptions = {
      from: process.env.SMTP_FROM || `"Roriri IT Park" <${process.env.SMTP_USER || 'noreply@roriri.com'}>`,
      to: cleanEmail,
      subject: 'Registration Verification Code - Roriri IT Park',
      text: `Hello ${cleanUsername},\n\nYour registration verification code is: ${otp}\n\nThis code is valid for 5 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nRoriri System Administration`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #6C3EFF; text-align: center;">Roriri IT Park</h2>
          <p>Hello <strong>${cleanUsername}</strong>,</p>
          <p>Thank you for registering. Use the verification code below to complete your registration request:</p>
          <div style="background-color: #f4f5f8; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #00D4FF; border-radius: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #555;">This code is valid for <strong>5 minutes</strong>. If you did not initiate this registration, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Roriri IT Park. All rights reserved.</p>
        </div>
      `
    };

    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log(`[SIGNUP EMAIL SUCCESS] Verification email sent to ${cleanEmail}`);
      } else {
        console.warn(`[SIGNUP EMAIL WARNING] SMTP credentials not set in .env. Email not sent. OTP is logged above.`);
      }
    } catch (mailErr) {
      console.error(`[SIGNUP EMAIL ERROR] Failed to send email to ${cleanEmail}:`, mailErr.message);
    }

    res.json({ success: true, message: 'Verification code sent to your email', email: cleanEmail });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Endpoint to verify signup OTP and create user
app.post('/api/signup/verify', authLimiter, async (req, res) => {
  const { username, otp } = req.body;
  if (!username || !otp) {
    return res.status(400).json({ error: 'Username and verification code are required' });
  }

  const cleanUsername = username.trim();
  const record = signupOtpStore.get(cleanUsername);

  if (!record) {
    return res.status(400).json({ error: 'No active registration session found. Please register again.' });
  }

  if (Date.now() > record.expires) {
    signupOtpStore.delete(cleanUsername);
    return res.status(400).json({ error: 'Verification code has expired. Please register again.' });
  }

  if (record.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  try {
    // Hash password
    const hashed = await bcrypt.hash(record.password, 10);

    // Insert user with status 'pending'
    const now = Date.now();
    await pool.query(
      "INSERT INTO users (username, email, password, role, updated_at, status, requested_at) VALUES ($1, $2, $3, $4, $5, 'pending', $6)",
      [cleanUsername, record.email, hashed, 'admin', now, now]
    );

    signupOtpStore.delete(cleanUsername);
    res.json({ success: true, message: 'Admin registration request submitted successfully. Waiting for super admin approval.' });
  } catch (err) {
    console.error('Signup verification error:', err.message);
    res.status(500).json({ error: 'Server error during registration completion' });
  }
});

// Endpoint to request password reset (Send OTP)
app.post('/api/forgot-password', authLimiter, async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (!validateUsername(username.trim())) {
    return res.status(400).json({ error: 'Invalid username' });
  }

  try {
    const userRes = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username.trim()]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid username' });
    }

    const user = userRes.rows[0];
    const email = user.email || `${user.username}@roriri.com`;

    // Generate a 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 1 * 60 * 1000; // 1 minute expiration

    otpStore.set(username.trim(), { otp, expires });

    console.log(`\n==============================================`);
    console.log(`[OTP SERVICE] OTP for ${user.username}: ${otp}`);
    console.log(`[OTP SERVICE] Email destination: ${email}`);
    console.log(`==============================================\n`);

    // Send actual email using SMTP transporter
    const mailOptions = {
      from: process.env.SMTP_FROM || `"Roriri IT Park" <${process.env.SMTP_USER || 'noreply@roriri.com'}>`,
      to: email,
      subject: 'Verification Code - Roriri IT Park',
      text: `Hello ${user.username},\n\nYour password reset verification code is: ${otp}\n\nThis code is valid for 5 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nRoriri System Administration`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #6C3EFF; text-align: center;">Roriri IT Park</h2>
          <p>Hello <strong>${user.username}</strong>,</p>
          <p>We received a request to reset your password. Use the verification code below to proceed:</p>
          <div style="background-color: #f4f5f8; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #00D4FF; border-radius: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #555;">This code is valid for <strong>5 minutes</strong>. If you did not initiate this request, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Roriri IT Park. All rights reserved.</p>
        </div>
      `
    };

    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] Verification email sent to ${email}`);
      } else {
        console.warn(`[EMAIL WARNING] SMTP credentials not set in .env. Email not sent. OTP is logged above.`);
      }
    } catch (mailErr) {
      console.error(`[EMAIL ERROR] Failed to send email to ${email}:`, mailErr.message);
    }

    // Mask the email for user response (e.g. a****n@roriri.com)
    const atIndex = email.indexOf('@');
    let maskedEmail = email;
    if (atIndex > 2) {
      maskedEmail = email.substring(0, 1) + '*'.repeat(atIndex - 2) + email.substring(atIndex - 1);
    }

    res.json({ success: true, message: 'Verification code generated', email: maskedEmail });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ error: 'Server error during password reset request' });
  }
});

// Endpoint to verify OTP and reset password
app.post('/api/verify-reset', authLimiter, async (req, res) => {
  const { username, otp, password } = req.body;
  if (!username || !otp || !password) {
    return res.status(400).json({ error: 'Username, verification code, and new password are required' });
  }

  const cleanUsername = username.trim();
  const cleanPassword = password.trim();

  // Validate password complexity
  if (!validatePassword(cleanPassword)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and contain at least one number and one special character (@$!%*#?&).'
    });
  }

  const record = otpStore.get(cleanUsername);
  if (!record) {
    return res.status(400).json({ error: 'No verification code found for this user. Please request one.' });
  }

  // Only enforce expiration if the verification step was not already completed
  if (!record.verified) {
    if (Date.now() > record.expires) {
      otpStore.delete(cleanUsername);
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }
  }

  if (record.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  try {
    const hashed = await bcrypt.hash(cleanPassword, 10);
    const updateRes = await pool.query(
      'UPDATE users SET password = $1, updated_at = $2 WHERE username = $3 RETURNING *',
      [hashed, Date.now(), cleanUsername]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    otpStore.delete(cleanUsername);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error('Password reset verification error:', err.message);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// Endpoint to verify OTP only (Step 2)
app.post('/api/verify-otp', authLimiter, async (req, res) => {
  const { username, otp } = req.body;
  if (!username || !otp) {
    return res.status(400).json({ error: 'Username and verification code are required' });
  }

  const cleanUsername = username.trim();
  const record = otpStore.get(cleanUsername);

  if (!record) {
    return res.status(400).json({ error: 'No verification code found for this user. Please request one.' });
  }

  if (Date.now() > record.expires) {
    otpStore.delete(cleanUsername);
    return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
  }

  if (record.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  // Mark the code as successfully verified so that the next step (verify-reset) bypasses expiration
  record.verified = true;
  otpStore.set(cleanUsername, record);

  res.json({ success: true, message: 'Verification code verified successfully' });
});

// Middleware to authenticate /api requests
const authenticateAPI = (req, res, next) => {
  const whitelisted = [
    '/api/login',
    '/api/signup',
    '/api/signup/verify',
    '/api/forgot-password',
    '/api/verify-otp',
    '/api/verify-reset'
  ];
  if (whitelisted.includes(req.path)) {
    return next();
  }
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader === `Bearer ${AUTH_TOKEN}`) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Please login.' });
};

app.use('/api', authenticateAPI);

// Helper middleware to check if requester is the super admin 'admin'
const checkSuperAdmin = (req, res, next) => {
  const usernameHeader = req.headers['x-admin-username'];
  if (usernameHeader === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden. Only the primary administrator can access this resource.' });
};

// Admin requests management endpoints
app.get('/api/admin-requests', checkSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, status, updated_at, requested_at, approved_at, rejected_at FROM users WHERE username != 'admin' ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admin requests:', err.message);
    res.status(500).json({ error: 'Server error fetching admin requests' });
  }
});

app.post('/api/admin-requests/:id/approve', checkSuperAdmin, async (req, res) => {
  const { id } = req.params;
  const now = Date.now();
  try {
    const result = await pool.query(
      "UPDATE users SET status = 'approved', updated_at = $1, approved_at = $1, rejected_at = NULL WHERE id = $2 RETURNING *",
      [now, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Error approving user:', err.message);
    res.status(500).json({ error: 'Server error approving user' });
  }
});

app.post('/api/admin-requests/:id/reject', checkSuperAdmin, async (req, res) => {
  const { id } = req.params;
  const now = Date.now();
  try {
    const result = await pool.query(
      "UPDATE users SET status = 'rejected', updated_at = $1, rejected_at = $1, approved_at = NULL WHERE id = $2 RETURNING *",
      [now, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Error rejecting user:', err.message);
    res.status(500).json({ error: 'Server error rejecting user' });
  }
});

app.post('/api/admin-requests/:id/delete', checkSuperAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Server error deleting user' });
  }
});

// ==========================================
// 1. GET FULL DATABASE STATE (GET /api/db)
// ==========================================
app.get('/api/db', async (req, res) => {
  try {
    const employees = await pool.query('SELECT * FROM employees ORDER BY id');
    const categories = await pool.query('SELECT * FROM categories ORDER BY id');
    const products = await pool.query('SELECT * FROM products ORDER BY id');
    const assignments = await pool.query(`
      SELECT a.*, e.name AS employee_name, e.dept
      FROM assignments a
      LEFT JOIN employees e ON a.employee_id = e.id
      ORDER BY a.id
    `);
    const damages = await pool.query(`
      SELECT d.*, p.code AS product_code, p.name AS product_name
      FROM damages d
      LEFT JOIN products p ON d.product_id = p.id
      ORDER BY d.id
    `);
    const repairs = await pool.query(`
      SELECT r.*, p.code AS product_code, p.name AS product_name
      FROM repairs r
      LEFT JOIN products p ON r.product_id = p.id
      ORDER BY r.id
    `);
    const history = await pool.query('SELECT * FROM history ORDER BY id DESC');

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
        assignedDate: formatDateLocal(a.assigned_date),
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
      purchaseDate: formatDateLocal(p.purchase_date),
      qty: p.qty,
      status: p.status,
      updatedAt: parseInt(p.updated_at)
    }));

    const employeesList = employees.rows.map(e => ({
      id: e.id,
      code: e.code,
      name: e.name,
      dept: e.dept || '',
      role: e.role || '',
      email: e.email || '',
      phone: e.phone || '',
      blood: e.blood || '',
      status: e.status || 'Active',
      joinDate: formatDateLocal(e.join_date),
      resignDate: formatDateLocal(e.resign_date),
      address: e.address || '',
      updatedAt: parseInt(e.updated_at)
    }));

    const damagesList = damages.rows.map(d => ({
      id: d.id,
      productId: d.product_id,
      productCode: d.product_code || '—',
      productName: d.product_name || '—',
      status: d.status,
      date: formatDateLocal(d.date),
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
      dateSent: formatDateLocal(r.date_sent),
      expectedDate: formatDateLocal(r.expected_date),
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
// CHECK IF EMAIL BELONGS TO APPROVED USER ACCOUNT
// ==========================================
app.post('/api/check-employee-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ valid: false, error: 'Email is required.' });
  }
  const cleanEmail = email.trim().toLowerCase();
  try {
    const result = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1 AND status = 'approved'",
      [cleanEmail]
    );
    if (result.rows.length > 0) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false, error: 'This email does not belong to any approved admin account. Only registered account emails can be used.' });
    }
  } catch (err) {
    console.error('Email check error:', err.message);
    return res.status(500).json({ valid: false, error: 'Server error during email check.' });
  }
});

// ==========================================
// 2. EMPLOYEES CRUD
// ==========================================
app.post('/api/employees', async (req, res) => {
  const { name, dept, role, email, phone, blood, status, joinDate, resignDate, address } = req.body;
  if (!name || !joinDate || !address || !dept || !role || !email || !blood || !status) {
    return res.status(400).json({ error: 'Name, Department, Role, Email, Blood Group, Status, Joining Date, and Address are required.' });
  }

  // Validate Joining Date is not in the future
  const todayStr = new Date().toISOString().split('T')[0];
  if (joinDate > todayStr) {
    return res.status(400).json({ error: 'Joining Date cannot be in the future.' });
  }

  // Validate Resignation Date is not in the future
  if (status === 'Inactive' && resignDate && resignDate > todayStr) {
    return res.status(400).json({ error: 'Resignation Date cannot be in the future.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Uniqueness check for email
    if (email) {
      const emailCheck = await client.query('SELECT id FROM employees WHERE LOWER(email) = LOWER($1)', [email.trim()]);
      if (emailCheck.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Email address is already registered to another employee.' });
      }
    }

    // Uniqueness check for phone
    if (phone) {
      const phoneCheck = await client.query('SELECT id FROM employees WHERE phone = $1', [phone.trim()]);
      if (phoneCheck.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Mobile number is already registered to another employee.' });
      }
    }

    const seqRes = await client.query("SELECT nextval('employees_id_seq')");
    const nextId = parseInt(seqRes.rows[0].nextval);
    const nextCode = 'EMP' + String(nextId).padStart(3, '0');

    const result = await client.query(
      `INSERT INTO employees (id, code, name, dept, role, email, phone, blood, status, join_date, resign_date, address, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [
        nextId,
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
    res.json({ success: true, id: result.rows[0].id });
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
  if (!name || !joinDate || !address || !dept || !role || !email || !blood || !status) {
    return res.status(400).json({ error: 'Name, Department, Role, Email, Blood Group, Status, Joining Date, and Address are required.' });
  }

  // Validate Joining Date is not in the future
  const todayStr = new Date().toISOString().split('T')[0];
  if (joinDate > todayStr) {
    return res.status(400).json({ error: 'Joining Date cannot be in the future.' });
  }

  // Validate Resignation Date is not in the future
  if (status === 'Inactive' && resignDate && resignDate > todayStr) {
    return res.status(400).json({ error: 'Resignation Date cannot be in the future.' });
  }

  try {
    // Uniqueness check for email
    if (email) {
      const emailCheck = await pool.query('SELECT id FROM employees WHERE LOWER(email) = LOWER($1) AND id != $2', [email.trim(), id]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email address is already registered to another employee.' });
      }
    }

    // Uniqueness check for phone
    if (phone) {
      const phoneCheck = await pool.query('SELECT id FROM employees WHERE phone = $1 AND id != $2', [phone.trim(), id]);
      if (phoneCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Mobile number is already registered to another employee.' });
      }
    }

    await pool.query(
      `UPDATE employees 
       SET code = $1, name = $2, dept = $3, role = $4, email = $5, phone = $6, blood = $7, status = $8, join_date = $9, resign_date = $10, address = $11, updated_at = $12 
       WHERE id = $13`,
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
    await pool.query('DELETE FROM employees WHERE id = $1', [id]);
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
  const charRegex = /^[a-zA-Z\s]+$/;
  if (!name || !charRegex.test(name)) {
    return res.status(400).json({ error: 'Category name is required and must contain only letters and spaces.' });
  }
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
  const charRegex = /^[a-zA-Z\s]+$/;
  if (!name || !charRegex.test(name)) {
    return res.status(400).json({ error: 'Category name is required and must contain only letters and spaces.' });
  }
  try {
    if (name !== oldName) {
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
  if (!qty) {
    return res.status(400).json({ error: 'Quantity is required.' });
  }
  const insertQty = parseInt(qty);
  if (isNaN(insertQty) || insertQty < 1) {
    return res.status(400).json({ error: 'Quantity must be a positive number.' });
  }
  if (!purchaseDate) {
    return res.status(400).json({ error: 'Purchase Date is required.' });
  }
  const todayStr = new Date().toISOString().split('T')[0];
  if (purchaseDate > todayStr) {
    return res.status(400).json({ error: 'Purchase Date cannot be in the future.' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

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
  if (!qty) {
    return res.status(400).json({ error: 'Quantity is required.' });
  }
  const updateQty = parseInt(qty);
  if (isNaN(updateQty) || updateQty < 1) {
    return res.status(400).json({ error: 'Quantity must be a positive number.' });
  }
  if (!purchaseDate) {
    return res.status(400).json({ error: 'Purchase Date is required.' });
  }
  const todayStr = new Date().toISOString().split('T')[0];
  if (purchaseDate > todayStr) {
    return res.status(400).json({ error: 'Purchase Date cannot be in the future.' });
  }
  try {
    await pool.query(
      `UPDATE products 
       SET code = $1, name = $2, cat = $3, purchase_date = $4, qty = $5, status = $6, updated_at = $7 
       WHERE id = $8`,
      [code, name, cat, purchaseDate || null, updateQty, status, Date.now(), id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const adminName = req.headers['x-admin-username'] || 'admin';
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get product details before deleting
    const prodRes = await client.query('SELECT code, name FROM products WHERE id = $1', [id]);
    if (prodRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Product not found' });
    }
    const prod = prodRes.rows[0];

    // 2. Insert deletion log into history
    await client.query(
      `INSERT INTO history (product_code, product_name, action, employee, date, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [prod.code, prod.name, 'Deleted', '—', new Date(), `Product deleted from inventory by ${adminName}`, Date.now()]
    );

    // 3. Delete the product from database
    await client.query('DELETE FROM products WHERE id = $1', [id]);

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

app.post('/api/accessories', async (req, res) => {
  const { name, cat, itemType, brand, qty, date, status } = req.body;
  if (date) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (date > todayStr) {
      return res.status(400).json({ error: 'Purchase Date cannot be in the future.' });
    }
  }
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
  if (assignedDate) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (assignedDate > todayStr) {
      return res.status(400).json({ error: 'Assigned Date cannot be in the future.' });
    }
  }
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
  if (assignedDate) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (assignedDate > todayStr) {
      return res.status(400).json({ error: 'Assigned Date cannot be in the future.' });
    }
  }
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
       LEFT JOIN employees e ON a.employee_id = e.id 
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
  if (date) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (date > todayStr) {
      return res.status(400).json({ error: 'Date Reported cannot be in the future.' });
    }
  }
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
  if (!center || !takenBy) {
    return res.status(400).json({ error: 'Repair Center and Taken By Person are required.' });
  }
  if (!dateSent) {
    return res.status(400).json({ error: 'Date Sent is required.' });
  }
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
    // 0. Create users table and seed default admin if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        updated_at BIGINT NOT NULL
      )
    `);
    console.log('Successfully verified/created users table.');

    const usersRes = await pool.query('SELECT 1 FROM users WHERE username = $1', ['admin']);
    if (usersRes.rowCount === 0) {
      await pool.query(
        `INSERT INTO users (username, password, role, updated_at) 
         VALUES ($1, $2, $3, $4)`,
        ['admin', 'admin', 'admin', Date.now()]
      );
      console.log('Default admin seeded.');
    }
  } catch (err) {
    console.error('Error initializing users table:', err.message);
  }

  try {
    // 1. Create the sequence if it does not exist
    await pool.query("CREATE SEQUENCE IF NOT EXISTS employees_code_seq START WITH 1");
    console.log("Successfully verified/created employees_code_seq sequence.");

    // 2. Query all existing employees to check and migrate their codes to EMPxxx format
    const empsRes = await pool.query("SELECT code FROM employees ORDER BY code");
    const updates = [];
    const usedInts = new Set();

    // First pass: identify existing numeric values from EMPxxx or clean numeric formats
    for (const row of empsRes.rows) {
      const trimmed = (row.code || '').trim();
      const match = trimmed.match(/^EMP0*(\d+)$/i);
      if (match) {
        const val = parseInt(match[1], 10);
        usedInts.add(val);
      } else {
        const val = parseInt(trimmed, 10);
        if (!isNaN(val) && String(val) === trimmed) {
          usedInts.add(val);
        }
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

    // Second pass: migrate codes that are not in the correct EMPxxx format
    for (const row of empsRes.rows) {
      const trimmed = (row.code || '').trim();
      const isCorrectFormat = /^EMP\d{3,}$/.test(trimmed);
      if (isCorrectFormat) {
        continue;
      }

      let valInt;
      const match = trimmed.match(/^EMP0*(\d+)$/i);
      if (match) {
        valInt = parseInt(match[1], 10);
      } else {
        const parsed = parseInt(trimmed, 10);
        if (!isNaN(parsed) && String(parsed) === trimmed) {
          valInt = parsed;
        } else {
          valInt = getNextInt();
        }
      }

      const newCode = 'EMP' + String(valInt).padStart(3, '0');
      updates.push({ oldCode: row.code, newCode: newCode });
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
        console.log(`Successfully migrated ${updates.length} employee codes to EMPxxx format.`);
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
      const trimmed = (row.code || '').trim();
      const match = trimmed.match(/^EMP0*(\d+)$/i);
      if (match) {
        const val = parseInt(match[1], 10);
        if (val > maxVal) {
          maxVal = val;
        }
      }
    }
    if (maxVal > 0) {
      await pool.query(`SELECT setval('employees_code_seq', ${maxVal})`);
    }
    console.log(`Employee code sequence synced. Next code will be EMP${String(maxVal + 1).padStart(3, '0')}`);
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
