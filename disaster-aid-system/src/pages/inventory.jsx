import { useState, useEffect } from "react";
import "../styles.css";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching inventory:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="inventory-page">
      <div className="inventory-container">
        {loading ? (
          <p className="loading-text">Loading inventory...</p>
        ) : (
          <>
            <h2>Inventory</h2>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className={item.count < 50 ? "low-stock" : ""}
                  >
                    <td>{item.name}</td>
                    <td>{item.count}</td>
                    <td>
                      {item.count < 50 ? (
                        <span className="low">Low Stock</span>
                      ) : (
                        <span className="ok">In Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
