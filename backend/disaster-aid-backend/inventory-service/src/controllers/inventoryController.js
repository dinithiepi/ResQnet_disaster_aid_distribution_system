const express = require('express');
const router = express.Router();
const pool = require('../../../db/db.js');

// ==============================
// GET ALL INVENTORY ITEMS
// ==============================
const getInventory = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM Inventory ORDER BY ItemID`);
    // Map database fields to frontend expected fields
    const inventory = result.rows.map(item => ({
      itemid: item.itemid,
      itemcategory: item.itemcategory, // For normal inventory page
      itemname: item.itemcategory,
      category: item.itemcategory,
      quantity: item.quantity,
      unit: 'units', // Default value since not in DB
      location: 'Main Warehouse', // Default value since not in DB
      expirydate: null // Not tracked in current DB
    }));
    res.json(inventory);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// Get all donations
/*exports.getDonations = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Donation ORDER BY DonationID");
    const donations = result.rows.map(donation => ({
      id: donation.donationid,
      itemId: donation.itemid,
      itemName: donation.itemcategory,
      quantity: donation.quantity,
      volunteerName: donation.volunteername,
      volunteerPhone: donation.volunteerphoneno,
      adminId: donation.adminid
    }));
    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};*/

const getdonations = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM donation ORDER BY donationid
     `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// SUBMIT NEW DONATION (Pending Status)
// ==============================
const submitDonation = async (req, res) => {
  try {
    const { volunteername, volunteeremail, volunteerphoneno, volunteeraddress, itemcategory, quantity, notes } = req.body;

    // Validate required fields
    if (!volunteername || !volunteeremail || !volunteerphoneno || !volunteeraddress || !itemcategory || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Insert donation with 'pending' status (no ItemID yet, admin will process)
    const donationResult = await pool.query(
      `INSERT INTO Donation (ItemCategory, Quantity, VolunteerName, VolunteerPhoneNo, VolunteerEmail, VolunteerAddress, Notes, Status, SubmittedDate) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', CURRENT_TIMESTAMP) RETURNING *`,
      [itemcategory, parseInt(quantity), volunteername, volunteerphoneno, volunteeremail, volunteeraddress, notes || null]
    );

    res.status(201).json({
      message: 'Donation submitted successfully! Admin will contact you shortly.',
      donation: donationResult.rows[0]
    });
  } catch (err) {
    console.error('Error submitting donation:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// GET PENDING DONATIONS (For Admin)
// ==============================
const getPendingDonations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM Donation WHERE Status = 'pending' ORDER BY SubmittedDate DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pending donations:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// UPDATE DONATION STATUS (Admin Action)
// ==============================
const updateDonationStatus = async (req, res) => {
  try {
    const { donationid } = req.params;
    const { status, adminNotes } = req.body;

    // Valid statuses: 'pending', 'contacted', 'scheduled', 'received', 'rejected'
    const validStatuses = ['pending', 'contacted', 'scheduled', 'received', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let updateQuery = `UPDATE Donation SET Status = $1`;
    let params = [status];
    let paramCount = 2;

    // If status is 'received', add to inventory and set ReceivedDate
    if (status === 'received') {
      const donation = await pool.query('SELECT * FROM Donation WHERE DonationID = $1', [donationid]);
      if (donation.rows.length === 0) {
        return res.status(404).json({ message: 'Donation not found' });
      }

      const { itemcategory, quantity } = donation.rows[0];

      // Check if inventory item exists
      const inventoryResult = await pool.query(
        `SELECT ItemID FROM Inventory WHERE LOWER(ItemCategory) = LOWER($1) LIMIT 1`,
        [itemcategory]
      );

      let itemId;
      if (inventoryResult.rows.length > 0) {
        itemId = inventoryResult.rows[0].itemid;
        // Update inventory quantity
        await pool.query(
          `UPDATE Inventory SET Quantity = Quantity + $1 WHERE ItemID = $2`,
          [parseInt(quantity), itemId]
        );
      } else {
        // Create new inventory item
        const newInventoryResult = await pool.query(
          `INSERT INTO Inventory (ItemCategory, Quantity, AdminID) 
           VALUES ($1, $2, 1) RETURNING ItemID`,
          [itemcategory, parseInt(quantity)]
        );
        itemId = newInventoryResult.rows[0].itemid;
      }

      // Update donation with ItemID and ReceivedDate
      updateQuery += `, ItemID = $${paramCount}, ReceivedDate = CURRENT_TIMESTAMP`;
      params.push(itemId);
      paramCount++;
    }

    if (adminNotes) {
      updateQuery += `, Notes = COALESCE(Notes, '') || '\n[Admin: ' || $${paramCount} || ']'`;
      params.push(adminNotes);
      paramCount++;
    }

    updateQuery += ` WHERE DonationID = $${paramCount} RETURNING *`;
    params.push(donationid);

    const result = await pool.query(updateQuery, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({
      message: `Donation status updated to '${status}'`,
      donation: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating donation status:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// CREATE NEW INVENTORY ITEM
// ==============================
const createInventoryItem = async (req, res) => {
  try {
    const { itemcategory, quantity, itemname, category, unit, location, expirydate } = req.body;

    // Validate required fields
    const finalCategory = itemcategory || category || itemname;
    if (!finalCategory || !quantity) {
      return res.status(400).json({ message: 'Item category and quantity are required' });
    }

    const result = await pool.query(
      `INSERT INTO Inventory (ItemCategory, Quantity, AdminID) 
       VALUES ($1, $2, 1) RETURNING *`,
      [finalCategory, parseInt(quantity)]
    );

    res.status(201).json({
      message: 'Inventory item created successfully',
      item: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating inventory item:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// UPDATE INVENTORY ITEM
// ==============================
const updateInventoryItem = async (req, res) => {
  try {
    const { itemid } = req.params;
    const { itemcategory, quantity, itemname, category } = req.body;

    const finalCategory = itemcategory || category || itemname;
    
    if (!finalCategory && !quantity) {
      return res.status(400).json({ message: 'At least one field is required to update' });
    }

    let updateQuery = 'UPDATE Inventory SET ';
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (finalCategory) {
      updates.push(`ItemCategory = $${paramCount}`);
      params.push(finalCategory);
      paramCount++;
    }

    if (quantity !== undefined) {
      updates.push(`Quantity = $${paramCount}`);
      params.push(parseInt(quantity));
      paramCount++;
    }

    updateQuery += updates.join(', ');
    updateQuery += ` WHERE ItemID = $${paramCount} RETURNING *`;
    params.push(itemid);

    const result = await pool.query(updateQuery, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({
      message: 'Inventory item updated successfully',
      item: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating inventory item:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// DELETE INVENTORY ITEM
// ==============================
const deleteInventoryItem = async (req, res) => {
  try {
    const { itemid } = req.params;

    const result = await pool.query(
      'DELETE FROM Inventory WHERE ItemID = $1 RETURNING *',
      [itemid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({
      message: 'Inventory item deleted successfully',
      item: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting inventory item:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// Export all functions at the end
module.exports = {
  getInventory,
  getdonations,
  submitDonation,
  getPendingDonations,
  updateDonationStatus,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
};
