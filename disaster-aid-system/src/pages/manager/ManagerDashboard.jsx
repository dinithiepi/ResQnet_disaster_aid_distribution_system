import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles.css';

function ManagerDashboard() {
  const navigate = useNavigate();
  const [manager, setManager] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [itemCategory, setItemCategory] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState('');

  useEffect(() => {
    const managerData = localStorage.getItem('managerData');
    const token = localStorage.getItem('managerToken');
    
    if (!token) {
      navigate('/manager/login');
      return;
    }

    if (managerData) {
      setManager(JSON.parse(managerData));
      fetchProfile(); // Fetch fresh profile data
      fetchData();
    }
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/manager/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setManager(data.manager);
        localStorage.setItem('managerData', JSON.stringify(data.manager));
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  };

  const fetchData = () => {
    fetchInventory();
    fetchRequests();
  };

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/manager/inventory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInventory(data.inventory);
      }
    } catch (error) {
      console.error('Fetch inventory error:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/manager/item-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Fetch requests error:', error);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!itemCategory || !requestedQuantity) {
      alert('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/manager/item-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          itemcategory: itemCategory, 
          requestedquantity: parseInt(requestedQuantity) 
        })
      });

      if (response.ok) {
        alert('Item request submitted successfully!');
        setItemCategory('');
        setRequestedQuantity('');
        fetchRequests();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Submit request error:', error);
      alert('Failed to submit request');
    }
  };

  const handleMarkReceived = async (requestId) => {
    if (!confirm('Mark this item as received?')) return;

    try {
      const token = localStorage.getItem('managerToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/manager/item-requests/received`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId })
      });

      if (response.ok) {
        alert('Item marked as received!');
        fetchRequests();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to mark as received');
      }
    } catch (error) {
      console.error('Mark received error:', error);
      alert('Failed to mark as received');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('managerToken');
    localStorage.removeItem('managerData');
    navigate('/manager/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending', className: 'status-badge-pending' },
      approved: { text: 'Approved', className: 'status-badge-approved' },
      rejected: { text: 'Rejected', className: 'status-badge-rejected' },
      received: { text: 'Received', className: 'status-badge-received' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.className}`}>{badge.text}</span>;
  };

  if (!manager) return <div className="loading">Loading...</div>;

  return (
    <div className="manager-dashboard">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <h2>Aid Center Manager Portal</h2>
        </div>
        <div className="navbar-user">
          <span className="user-name">{manager.fname} {manager.lname}</span>
          <span className="user-district">{manager.district}</span>
          {manager.centerid ? (
            <span className="aid-center-badge">Center ID: {manager.centerid}</span>
          ) : (
            <span className="aid-center-badge not-assigned">No Center Assigned</span>
          )}
          <button onClick={fetchProfile} className="btn-refresh" title="Refresh profile">🔄</button>
          <button onClick={() => navigate('/')} className="btn-home">🏠 Home</button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              📋 Item Requests
            </button>
            
            <button 
              className={`menu-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              📦 Aid Center Inventory
            </button>
          </div>
        </aside>

        <main className="dashboard-content">
          {activeTab === 'requests' && (
            <div className="requests-section">
              <div className="section-header">
                <h2>Request Items from Admin</h2>
              </div>

              {!manager.centerid ? (
                <div className="alert alert-warning">
                  <strong>⚠️ Not Assigned to Aid Center</strong>
                  <p>You need to be assigned to an aid center by an admin before you can submit item requests.</p>
                  <p>Click the refresh button (🔄) in the top right to check if you've been assigned.</p>
                </div>
              ) : (
                <div className="request-form-card">
                  <h3>Submit New Request</h3>
                  <form onSubmit={handleSubmitRequest} className="request-form">
                  <div className="form-group">
                    <label>Item Category *</label>
                    <select
                      className="form-control"
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      required
                    >
                      <option value="">Select item category</option>
                      <option value="Food">Food</option>
                      <option value="Water">Water</option>
                      <option value="Medicine">Medicine</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Blankets">Blankets</option>
                      <option value="Tents">Tents</option>
                      <option value="Hygiene Kits">Hygiene Kits</option>
                      <option value="First Aid">First Aid</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Requested Quantity *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={requestedQuantity}
                      onChange={(e) => setRequestedQuantity(e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-submit">
                    Submit Request
                  </button>
                </form>
              </div>
              )}

              <div className="section-header">
                <h2>My Requests</h2>
              </div>

              {requests.length === 0 ? (
                <div className="empty-state-card">
                  <div className="empty-icon">📦</div>
                  <h3>No requests yet</h3>
                  <p>Submit your first item request above</p>
                </div>
              ) : (
                <div className="requests-table-container">
                  <table className="requests-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Item Category</th>
                        <th>Requested Qty</th>
                        <th>Approved Qty</th>
                        <th>Status</th>
                        <th>Requested Date</th>
                        <th>Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(request => (
                        <tr key={request.requestid}>
                          <td>#{request.requestid}</td>
                          <td>{request.itemcategory}</td>
                          <td className="text-center">{request.requestedquantity}</td>
                          <td className="text-center">
                            {request.approvedquantity || '-'}
                          </td>
                          <td>{getStatusBadge(request.status)}</td>
                          <td>{new Date(request.requestedat).toLocaleDateString()}</td>
                          <td>{request.remarks || '-'}</td>
                          <td>
                            {request.status === 'approved' && (
                              <button
                                className="btn-receive"
                                onClick={() => handleMarkReceived(request.requestid)}
                              >
                                Mark Received
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="inventory-section">
              <div className="section-header">
                <h2>Aid Center Inventory</h2>
              </div>

              {inventory.length === 0 ? (
                <div className="empty-state-card">
                  <div className="empty-icon">📦</div>
                  <h3>No inventory items</h3>
                  <p>Your aid center inventory will appear here</p>
                </div>
              ) : (
                <div className="inventory-grid">
                  {inventory.map(item => (
                    <div key={item.inventoryid} className="inventory-card">
                      <h3>{item.itemcategory}</h3>
                      <div className="inventory-quantity">
                        <span className="quantity-label">Quantity:</span>
                        <span className="quantity-value">{item.quantity}</span>
                      </div>
                      <div className="inventory-meta">
                        <small>Last updated: {new Date(item.lastupdated).toLocaleString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ManagerDashboard;
