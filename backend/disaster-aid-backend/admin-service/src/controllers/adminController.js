const pool = require('../../../db/db');
const bcrypt = require('bcrypt');

// Admin Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneno } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if admin already exists
    const checkQuery = 'SELECT * FROM admin WHERE email = $1';
    const existingAdmin = await pool.query(checkQuery, [email]);

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new admin
    const insertQuery = `
      INSERT INTO admin (name, email, password, phoneno)
      VALUES ($1, $2, $3, $4)
      RETURNING adminid, name, email, phoneno
    `;
    const result = await pool.query(insertQuery, [name, email, hashedPassword, phoneno || null]);

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: result.rows[0]
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin by email
    const query = 'SELECT * FROM admin WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${admin.adminid}:${admin.email}:${Date.now()}`).toString('base64');

    res.status(200).json({
      message: 'Login successful',
      token: token,
      admin: {
        adminid: admin.adminid,
        name: admin.name,
        email: admin.email,
        phoneno: admin.phoneno
      }
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
