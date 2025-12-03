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

// Create item request
exports.createItemRequest = async (req, res) => {
  try {
    const { itemcategory, requestedquantity } = req.body;
    const managerId = req.manager.managerid;

    if (!itemcategory || !requestedquantity) {
      return res.status(400).json({ message: 'Item category and quantity are required' });
    }

    // Get manager's center ID
    const managerQuery = 'SELECT centerid FROM aidcentermanager WHERE managerid = $1';
    const managerResult = await pool.query(managerQuery, [managerId]);

    if (managerResult.rows.length === 0 || !managerResult.rows[0].centerid) {
      return res.status(400).json({ message: 'Manager not assigned to an aid center' });
    }

    const centerid = managerResult.rows[0].centerid;

    const insertQuery = `
      INSERT INTO itemrequest (managerid, centerid, itemcategory, requestedquantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [managerId, centerid, itemcategory, requestedquantity]);

    res.status(201).json({
      message: 'Item request submitted successfully',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Create item request error:', error);
    res.status(500).json({ message: 'Failed to create item request' });
  }
};

// Get manager's item requests
exports.getItemRequests = async (req, res) => {
  try {
    const managerId = req.manager.managerid;

    const query = `
      SELECT 
        ir.*,
        ac.location as center_location,
        ac.district as center_district
      FROM itemrequest ir
      JOIN aidcenter ac ON ir.centerid = ac.centerid
      WHERE ir.managerid = $1
      ORDER BY ir.requestedat DESC
    `;
    const result = await pool.query(query, [managerId]);

    res.json({ requests: result.rows });
  } catch (error) {
    console.error('Get item requests error:', error);
    res.status(500).json({ message: 'Failed to fetch item requests' });
  }
};

// Mark item as received
exports.markItemReceived = async (req, res) => {
  try {
    const { requestId } = req.body;
    const managerId = req.manager.managerid;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    const query = `
      UPDATE itemrequest
      SET status = 'received', receivedat = NOW()
      WHERE requestid = $1 AND managerid = $2 AND status = 'approved'
      RETURNING *
    `;
    const result = await pool.query(query, [requestId, managerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found or not approved' });
    }

    res.json({
      message: 'Item marked as received',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Mark item received error:', error);
    res.status(500).json({ message: 'Failed to mark item as received' });
  }
};

