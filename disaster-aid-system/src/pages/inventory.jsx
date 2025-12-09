import { useState, useEffect } from "react";
import API_BASE_URL from '../config/api';
import "../styles.css";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch inventory data
    Promise.all([
      fetch(`${API_BASE_URL}/inventory`).then(res => res.json()),
      fetch(`${API_BASE_URL}/inventory/donations`).then(res => res.json())
    ])
      .then(([inventoryData, donationsData]) => {
        setInventory(inventoryData);
        setDonations(donationsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="inventory-page">
      <div className="inventory-container">
        {loading ? (
          <p className="loading-text">Loading data...</p>
        ) : (
          <>
            {/* Current Inventory Table */}
            <div className="table-section">
              <h2>Current Inventory</h2>
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Item Category</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.length > 0 ? (
                    inventory.map((item) => (
                      <tr
                        key={item.itemid}
                        className={item.quantity < 50 ? "low-stock" : ""}
                      >
                        <td>{item.itemcategory}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {item.quantity < 50 ? (
                            <span className="low">Low Stock</span>
                          ) : (
                            <span className="ok">In Stock</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center' }}>No inventory data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Donations Table */}
            <div className="table-section">
              <h2>Donations</h2>
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Volunteer Name</th>
                    <th>Item Category</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.length > 0 ? (
                    donations.map((donation) => (
                      <tr key={donation.donationid}>
                        <td>{donation.volunteername}</td>
                        <td>{donation.itemcategory}</td>
                        <td>{donation.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center' }}>No donation data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
