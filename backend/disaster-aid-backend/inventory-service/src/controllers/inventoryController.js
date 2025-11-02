const express = require('express');
const router = express.Router();
const pool = require('../../../db/db.js');

// ==============================
// GET ALL INVENTORY ITEMS
// ==============================
const getInventory = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM Inventory ORDER BY ItemID
     `);
    res.json(result.rows);
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

// Export functions
module.exports = {
  getInventory,
  getdonations

};
