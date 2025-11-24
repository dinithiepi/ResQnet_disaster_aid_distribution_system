const pool = require('../../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;

// Manager Registration
exports.register = async (req, res) => {
  try {
    const { fname, lname, email, password, phoneno, district } = req.body;

    if (!fname || !lname || !email || !password || !district) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Village officer certificate is required' });
    }

    // Check if manager exists
    const checkQuery = 'SELECT * FROM aidcentermanager WHERE email = $1';
    const existing = await pool.query(checkQuery, [email]);

    if (existing.rows.length > 0) {
      await fs.unlink(req.file.path).catch(console.error);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const certificatePath = `/uploads/${req.file.filename}`;

    // Insert manager
    const insertQuery = `
      INSERT INTO aidcentermanager 
      (fname, lname, email, password, phoneno, district, certificatepath, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING managerid, fname, lname, email, district, status
    `;
    
    const result = await pool.query(insertQuery, [
      fname, lname, email, hashedPassword, phoneno, district, certificatePath
    ]);

    res.status(201).json({
      message: 'Registration submitted. Awaiting admin approval.',
      manager: result.rows[0]
    });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(console.error);
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Manager Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = 'SELECT * FROM aidcentermanager WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const manager = result.rows[0];

    if (manager.status !== 'approved') {
      return res.status(403).json({ 
        message: `Account status: ${manager.status}. Please wait for admin approval.`
      });
    }

    const isValid = await bcrypt.compare(password, manager.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { managerid: manager.managerid, email: manager.email, role: 'manager' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...managerData } = manager;
    res.json({ message: 'Login successful', token, manager: managerData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Get Manager Profile
exports.getProfile = async (req, res) => {
  try {
    const query = `
      SELECT m.*, c.location, c.district as center_district
      FROM aidcentermanager m
      LEFT JOIN aidcenter c ON m.centerid = c.centerid
      WHERE m.managerid = $1
    `;
    const result = await pool.query(query, [req.manager.managerid]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    const { password, ...manager } = result.rows[0];
    res.json({ manager });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};
