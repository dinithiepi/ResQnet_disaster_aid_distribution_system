import React, { useState, useEffect } from 'react';
import '../../styles.css';

function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    itemname: '',
    category: 'food',
    quantity: '',
    unit: 'units',
    location: '',
    expirydate: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inventory`);
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // Demo data for testing
      setInventory([
        {
          itemid: 1,
          itemname: 'Rice',
          category: 'food',
          quantity: 500,
          unit: 'kg',
          location: 'Warehouse A',
          expirydate: '2025-12-31'
        },
        {
          itemid: 2,
          itemname: 'Water Bottles',
          category: 'water',
          quantity: 1000,
          unit: 'bottles',
          location: 'Warehouse B',
          expirydate: '2026-06-30'
        },
        {
          itemid: 3,
          itemname: 'Medical Kits',
          category: 'medical',
          quantity: 150,
          unit: 'kits',
          location: 'Medical Center',
          expirydate: '2025-03-15'
        }
      ]);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingItem
        ? `${import.meta.env.VITE_API_URL}/api/inventory/${editingItem.itemid}`
        : `${import.meta.env.VITE_API_URL}/api/inventory`;
      
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchInventory();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving inventory item:', error);
      alert('Failed to save inventory item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      itemname: item.itemname,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      location: item.location,
      expirydate: item.expirydate ? item.expirydate.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (itemid) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inventory/${itemid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInventory();
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      alert('Failed to delete inventory item');
    }
  };

  const openNewModal = () => {
    setEditingItem(null);
    setFormData({
      itemname: '',
      category: 'food',
      quantity: '',
      unit: 'units',
      location: '',
      expirydate: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return '🍚';
      case 'water': return '💧';
      case 'medical': return '⚕️';
      case 'shelter': return '🏠';
      case 'clothing': return '👕';
      default: return '📦';
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', color: '#dc3545' };
    if (quantity < 50) return { text: 'Low Stock', color: '#ffc107' };
    return { text: 'In Stock', color: '#28a745' };
  };

  return (
    <div className="inventory-management">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <button onClick={openNewModal} className="add-button">
          + Add New Item
        </button>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const status = getStockStatus(item.quantity);
              return (
                <tr key={item.itemid}>
                  <td>
                    <span className="category-badge">
                      {getCategoryIcon(item.category)} {item.category}
                    </span>
                  </td>
                  <td><strong>{item.itemname}</strong></td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>{item.location}</td>
                  <td>
                    {item.expirydate 
                      ? new Date(item.expirydate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <span 
                      className="stock-status"
                      style={{ backgroundColor: status.color }}
                    >
                      {status.text}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(item)} className="edit-btn-small">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(item.itemid)} className="delete-btn-small">
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  name="itemname"
                  value={formData.itemname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="food">Food</option>
                  <option value="water">Water</option>
                  <option value="medical">Medical</option>
                  <option value="shelter">Shelter</option>
                  <option value="clothing">Clothing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="units">Units</option>
                    <option value="kg">Kilograms</option>
                    <option value="liters">Liters</option>
                    <option value="bottles">Bottles</option>
                    <option value="boxes">Boxes</option>
                    <option value="kits">Kits</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Expiry Date (if applicable)</label>
                <input
                  type="date"
                  name="expirydate"
                  value={formData.expirydate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement;
