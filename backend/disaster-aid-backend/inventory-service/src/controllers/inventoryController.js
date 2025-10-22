const pool = require("../db"); // path to your db.js

// Get all inventory items
exports.getInventory = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Inventory ORDER BY ItemID");
    const items = result.rows.map(item => ({
      id: item.itemid,
      name: item.itemcategory,
      count: item.quantity
    }));
    res.json(items);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

// Get all donations
exports.getDonations = async (req, res) => {
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
};
