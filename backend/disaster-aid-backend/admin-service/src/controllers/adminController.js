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

// Get pending managers
exports.getPendingManagers = async (req, res) => {
  try {
    // Use concatenation for name to be safe if the generated column is missing
    const query = `
      SELECT managerid, fname, lname, (fname || ' ' || lname) as name, email, phoneno, district, 
             certificatepath, createdat, status
      FROM aidcentermanager
      WHERE status = 'pending'
      ORDER BY createdat DESC
    `;
    const result = await pool.query(query);

    res.status(200).json({
      managers: result.rows
    });
  } catch (error) {
    console.error('Error fetching pending managers:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Approve manager
exports.approveManager = async (req, res) => {
  try {
    const { managerId } = req.body;
    const adminId = req.adminId; // From auth middleware

    if (!managerId) {
      return res.status(400).json({ error: 'Manager ID is required' });
    }

    console.log('Approving manager:', { managerId, adminId });

    // Get manager details to get their district
    const managerQuery = 'SELECT * FROM aidcentermanager WHERE managerid = $1';
    const managerResult = await pool.query(managerQuery, [managerId]);
    
    if (managerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    const manager = managerResult.rows[0];
    console.log('Manager found:', manager);

    // Auto-create new aid center for this manager
    // Since every manager has a center, we create one automatically
    const createCenterQuery = `
      INSERT INTO aidcenter (district, location)
      VALUES ($1, $2)
      RETURNING centerid, district, location
    `;
    
    // Generate a location name, e.g., "Colombo Aid Center"
    // We can append a timestamp or random string if needed to ensure uniqueness in name, 
    // but for now "District Aid Center" is fine, or we can let the ID distinguish them in the UI.
    // Let's use "District Aid Center" and rely on the unique ID.
    const locationName = `${manager.district} Aid Center`;
    
    const centerResult = await pool.query(createCenterQuery, [manager.district, locationName]);
    const newCenter = centerResult.rows[0];
    const newCenterId = newCenter.centerid;
    
    console.log('Auto-created Aid Center:', newCenter);

    // Approve manager and assign to the new center
    const updateQuery = `
      UPDATE aidcentermanager
      SET status = 'approved', approvedby = $1, approvedat = NOW(), centerid = $3, adminid = $1
      WHERE managerid = $2 AND status = 'pending'
      RETURNING managerid, fname, lname, name, email, centerid, status, district
    `;
    const result = await pool.query(updateQuery, [adminId, managerId, newCenterId]);

    if (result.rows.length === 0) {
      console.log('Manager not found or already approved');
      return res.status(404).json({ error: 'Manager not found or already processed' });
    }

    console.log('Manager approved successfully:', result.rows[0]);

    res.status(200).json({
      message: 'Manager approved and assigned to new aid center successfully',
      manager: result.rows[0],
      center: newCenter
    });
  } catch (error) {
    console.error('Error approving manager:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// Reject manager
exports.rejectManager = async (req, res) => {
  try {
    const { managerId } = req.body;
    const adminId = req.adminId;

    if (!managerId) {
      return res.status(400).json({ error: 'Manager ID is required' });
    }

    const query = `
      UPDATE aidcentermanager
      SET status = 'rejected', approvedby = $1, approvedat = NOW()
      WHERE managerid = $2 AND status = 'pending'
      RETURNING managerid, name, email
    `;
    const result = await pool.query(query, [adminId, managerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Manager not found or already processed' });
    }

    res.status(200).json({
      message: 'Manager rejected',
      manager: result.rows[0]
    });
  } catch (error) {
    console.error('Error rejecting manager:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all aid centers
exports.getAidCenters = async (req, res) => {
  try {
    const query = 'SELECT * FROM aidcenter ORDER BY district, location';
    const result = await pool.query(query);
    res.status(200).json({ centers: result.rows });
  } catch (error) {
    console.error('Error fetching aid centers:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all item requests
exports.getItemRequests = async (req, res) => {
  try {
    const query = `
      SELECT 
        ir.*,
        m.name as manager_name,
        m.email as manager_email,
        m.district as manager_district,
        ac.location as center_location,
        ac.district as center_district
      FROM itemrequest ir
      JOIN aidcentermanager m ON ir.managerid = m.managerid
      JOIN aidcenter ac ON ir.centerid = ac.centerid
      ORDER BY 
        CASE ir.status 
          WHEN 'pending' THEN 1 
          WHEN 'approved' THEN 2 
          WHEN 'received' THEN 3 
          WHEN 'rejected' THEN 4 
        END,
        ir.requestedat DESC
    `;
    const result = await pool.query(query);
    res.status(200).json({ requests: result.rows });
  } catch (error) {
    console.error('Error fetching item requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Approve item request
exports.approveItemRequest = async (req, res) => {
  try {
    const { requestId, approvedQuantity, remarks } = req.body;
    const adminId = req.adminId;

    if (!requestId || !approvedQuantity) {
      return res.status(400).json({ error: 'Request ID and approved quantity are required' });
    }

    const query = `
      UPDATE itemrequest
      SET status = 'approved', 
          approvedquantity = $1, 
          remarks = $2,
          reviewedby = $3, 
          reviewedat = NOW()
      WHERE requestid = $4 AND status = 'pending'
      RETURNING *
    `;
    const result = await pool.query(query, [approvedQuantity, remarks, adminId, requestId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found or already processed' });
    }

    res.status(200).json({
      message: 'Item request approved successfully',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error approving item request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reject item request
exports.rejectItemRequest = async (req, res) => {
  try {
    const { requestId, remarks } = req.body;
    const adminId = req.adminId;

    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    const query = `
      UPDATE itemrequest
      SET status = 'rejected', 
          remarks = $1,
          reviewedby = $2, 
          reviewedat = NOW()
      WHERE requestid = $3 AND status = 'pending'
      RETURNING *
    `;
    const result = await pool.query(query, [remarks, adminId, requestId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found or already processed' });
    }

    res.status(200).json({
      message: 'Item request rejected',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error rejecting item request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

