import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../../styles.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [adminInfo] = useState(() => {
    const info = localStorage.getItem('adminInfo');
    return info ? JSON.parse(info) : { name: 'Admin' };
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-brand">
          <h2>ResQNet Admin</h2>
        </div>
        <div className="admin-user-info">
          <span>Welcome, {adminInfo.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="nav-item"
            >
              📊 Dashboard Overview
            </button>
            <button 
              onClick={() => navigate('/admin/dashboard/disaster-areas')}
              className="nav-item"
            >
              🌍 Disaster Areas
            </button>
            <button 
              onClick={() => navigate('/admin/dashboard/inventory')}
              className="nav-item"
            >
              📦 Inventory Management
            </button>
            <button 
              onClick={() => navigate('/admin/dashboard/donations')}
              className="nav-item"
            >
              💝 Donation Requests
            </button>
            <button 
              onClick={() => navigate('/admin/dashboard/manager-approval')}
              className="nav-item"
            >
              👤 Manager Approval
            </button>
            <button 
              onClick={() => navigate('/admin/dashboard/item-requests')}
              className="nav-item"
            >
              📋 Item Requests
            </button>
            <button 
              onClick={() => navigate('/')}
              className="nav-item home-btn"
            >
              🏠 Back to Home
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
