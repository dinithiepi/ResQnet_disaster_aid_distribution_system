const pool = require('../db');

// ==============================
// GET ALL DISASTER AREAS
// ==============================
const getDisasterAreas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DisasterNo as areaid, AreaName as areaname, Location as location, 
              Severity as severity, AffectedPopulation as affectedpopulation, 
              Description as description, District as district, CreatedDate as createddate
       FROM DisasterArea 
       ORDER BY CreatedDate DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching disaster areas:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// CREATE NEW DISASTER AREA
// ==============================
const createDisasterArea = async (req, res) => {
  try {
    const { areaname, location, severity, affectedpopulation, description, district } = req.body;

    // Validate required fields
    if (!areaname || !location) {
      return res.status(400).json({ message: 'Area name and location are required' });
    }

    // Validate severity
    const validSeverities = ['low', 'moderate', 'high', 'critical'];
    const finalSeverity = severity && validSeverities.includes(severity.toLowerCase()) 
      ? severity.toLowerCase() 
      : 'moderate';

    const result = await pool.query(
      `INSERT INTO DisasterArea (AreaName, Location, Severity, AffectedPopulation, Description, District, CreatedDate) 
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *`,
      [
        areaname, 
        location, 
        finalSeverity, 
        affectedpopulation ? parseInt(affectedpopulation) : 0, 
        description || null,
        district || location
      ]
    );

    res.status(201).json({
      message: 'Disaster area created successfully',
      area: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating disaster area:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// UPDATE DISASTER AREA
// ==============================
const updateDisasterArea = async (req, res) => {
  try {
    const { areaid } = req.params;
    const { areaname, location, severity, affectedpopulation, description, district } = req.body;

    // Build dynamic update query
    let updateQuery = 'UPDATE DisasterArea SET ';
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (areaname) {
      updates.push(`AreaName = $${paramCount}`);
      params.push(areaname);
      paramCount++;
    }

    if (location) {
      updates.push(`Location = $${paramCount}`);
      params.push(location);
      paramCount++;
    }

    if (severity) {
      const validSeverities = ['low', 'moderate', 'high', 'critical'];
      const finalSeverity = validSeverities.includes(severity.toLowerCase()) 
        ? severity.toLowerCase() 
        : 'moderate';
      updates.push(`Severity = $${paramCount}`);
      params.push(finalSeverity);
      paramCount++;
    }

    if (affectedpopulation !== undefined) {
      updates.push(`AffectedPopulation = $${paramCount}`);
      params.push(parseInt(affectedpopulation));
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`Description = $${paramCount}`);
      params.push(description);
      paramCount++;
    }

    if (district) {
      updates.push(`District = $${paramCount}`);
      params.push(district);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updates.push(`UpdatedDate = CURRENT_TIMESTAMP`);
    updateQuery += updates.join(', ');
    updateQuery += ` WHERE DisasterNo = $${paramCount} RETURNING *`;
    params.push(areaid);

    const result = await pool.query(updateQuery, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Disaster area not found' });
    }

    res.json({
      message: 'Disaster area updated successfully',
      area: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating disaster area:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// DELETE DISASTER AREA
// ==============================
const deleteDisasterArea = async (req, res) => {
  try {
    const { areaid } = req.params;

    const result = await pool.query(
      'DELETE FROM DisasterArea WHERE DisasterNo = $1 RETURNING *',
      [areaid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Disaster area not found' });
    }

    res.json({
      message: 'Disaster area deleted successfully',
      area: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting disaster area:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// GET DISASTER AREA BY ID
// ==============================
const getDisasterAreaById = async (req, res) => {
  try {
    const { areaid } = req.params;

    const result = await pool.query(
      `SELECT DisasterNo as areaid, AreaName as areaname, Location as location, 
              Severity as severity, AffectedPopulation as affectedpopulation, 
              Description as description, District as district, CreatedDate as createddate
       FROM DisasterArea 
       WHERE DisasterNo = $1`,
      [areaid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Disaster area not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching disaster area:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

module.exports = {
  getDisasterAreas,
  createDisasterArea,
  updateDisasterArea,
  deleteDisasterArea,
  getDisasterAreaById
};
