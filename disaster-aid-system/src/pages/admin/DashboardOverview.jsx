import React from 'react';
import '../../styles.css';

function DashboardOverview() {
  return (
    <div className="dashboard-overview">
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#667eea', margin: '0 0 10px 0' }}>🌍 Disaster Areas</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>12</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Active disaster zones</p>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>📦 Inventory Items</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>342</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Total items in stock</p>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#e67e22', margin: '0 0 10px 0' }}>💰 Donations</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>1,234</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Total donations received</p>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>👥 Active Users</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>89</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Online right now</p>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Add Disaster Area
          </button>
          <button style={{ padding: '12px 24px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Add Inventory Item
          </button>
          <button style={{ padding: '12px 24px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            View Reports
          </button>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Recent Activity</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #eee', color: '#555' }}>
            🌍 New disaster area added: Northern Flood Zone
          </li>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #eee', color: '#555' }}>
            📦 Inventory updated: 500 water bottles added
          </li>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #eee', color: '#555' }}>
            💰 New donation received: $5,000 from John Doe
          </li>
          <li style={{ padding: '12px 0', color: '#555' }}>
            👤 New volunteer registered: Jane Smith
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardOverview;
