const pool = require('../db');

// Get Aid Center Inventory
exports.getInventory = async (req, res) => {
  try {
    // Get manager's center
    const managerQuery = 'SELECT centerid FROM aidcentermanager WHERE managerid = $1';
    const managerResult = await pool.query(managerQuery, [req.manager.managerid]);
    
    if (!managerResult.rows[0] || !managerResult.rows[0].centerid) {
      return res.status(404).json({ message: 'No aid center assigned to this manager' });
    }

    const centerId = managerResult.rows[0].centerid;

    const query = `
      SELECT * FROM aidcenterinventory 
      WHERE centerid = $1 
      ORDER BY itemcategory
    `;
    const result = await pool.query(query, [centerId]);

    res.json({ inventory: result.rows });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
};

// Update Inventory Item
exports.updateInventory = async (req, res) => {
  try {
    const { itemcategory, quantity } = req.body;
    
    const managerQuery = 'SELECT centerid FROM aidcentermanager WHERE managerid = $1';
    const managerResult = await pool.query(managerQuery, [req.manager.managerid]);
    
    if (!managerResult.rows[0] || !managerResult.rows[0].centerid) {
      return res.status(404).json({ message: 'No aid center assigned' });
    }

    const centerId = managerResult.rows[0].centerid;

    const query = `
      INSERT INTO aidcenterinventory (centerid, itemcategory, quantity, updatedby)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (centerid, itemcategory) 
      DO UPDATE SET quantity = $3, lastupdated = CURRENT_TIMESTAMP, updatedby = $4
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      centerId, itemcategory, quantity, req.manager.managerid
    ]);

    res.json({ message: 'Inventory updated', item: result.rows[0] });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Failed to update inventory' });
  }
};
