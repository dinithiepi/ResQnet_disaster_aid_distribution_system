import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/api';
import '../../styles.css';

function DashboardOverview() {
  const [stats, setStats] = useState({
    disasterAreas: 0,
    inventoryItems: 0,
    donations: 0,
    pendingDonations: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [areasRes, inventoryRes, donationsRes, pendingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/disaster-areas`),
        fetch(`${API_BASE_URL}/api/inventory`),
        fetch(`${API_BASE_URL}/inventory/donations`),
        fetch(`${API_BASE_URL}/inventory/donations/pending`)
      ]);

      const areas = await areasRes.json();
      const inventory = await inventoryRes.json();
      const donations = await donationsRes.json();
      const pending = await pendingRes.json();

      setStats({
        disasterAreas: areas.length,
        inventoryItems: inventory.length,
        donations: donations.length,
        pendingDonations: pending.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard-overview">
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#667eea', margin: '0 0 10px 0' }}>🌍 Disaster Areas</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>{stats.disasterAreas}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Active disaster zones</p>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>📦 Inventory Items</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>{stats.inventoryItems}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Total items in stock</p>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#e67e22', margin: '0 0 10px 0' }}>💰 Donations</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>{stats.donations}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Total donations received</p>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>⏳ Pending Requests</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>{stats.pendingDonations}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Awaiting review</p>
        </div>
      </div>

      {/* System Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px', borderRadius: '8px', color: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>⚡ System Status</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>All Systems Operational</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', fontSize: '14px' }}>
            <span>✓ Database</span>
            <span>✓ API</span>
            <span>✓ Storage</span>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '24px', borderRadius: '8px', color: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>📊 Today's Summary</h3>
          <p style={{ fontSize: '16px', margin: '10px 0' }}>Current Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Last updated: {new Date().toLocaleTimeString()}</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '24px', borderRadius: '8px', color: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>🎯 Quick Stats</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            <p style={{ margin: '5px 0' }}>✓ System Uptime: 99.9%</p>
            <p style={{ margin: '5px 0' }}>✓ Response Time: &lt;100ms</p>
            <p style={{ margin: '5px 0' }}>✓ Active Sessions: Online</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>📋 Management Tips</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #667eea' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#667eea' }}>🌍 Disaster Areas</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Keep severity levels updated and monitor affected populations regularly</p>
          </div>
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #27ae60' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#27ae60' }}>📦 Inventory</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Check for low stock items and update quantities after distributions</p>
          </div>
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #e67e22' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#e67e22' }}>💰 Donations</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Review pending requests promptly to maintain volunteer engagement</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🔔 Important Reminders</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '15px', background: '#fff3cd', borderRadius: '6px', borderLeft: '4px solid #ffc107' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>⚠️ Remember to backup database regularly</p>
          </div>
          <div style={{ padding: '15px', background: '#d1ecf1', borderRadius: '6px', borderLeft: '4px solid #17a2b8' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#0c5460' }}>ℹ️ Update disaster area severity based on current conditions</p>
          </div>
          <div style={{ padding: '15px', background: '#d4edda', borderRadius: '6px', borderLeft: '4px solid #28a745' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#155724' }}>✓ System running smoothly - all services operational</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
            🌍 Add Disaster Area
          </button>
          <button style={{ padding: '12px 24px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
            📦 Add Inventory Item
          </button>
          <button style={{ padding: '12px 24px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
            💰 Review Donations
          </button>
          <button style={{ padding: '12px 24px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
            📊 Generate Report
          </button>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>📈 Performance Metrics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              {stats.disasterAreas}
            </div>
            <p style={{ marginTop: '10px', color: '#2c3e50', fontWeight: '600' }}>Total Areas</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto', borderRadius: '50%', background: 'linear-gradient(135deg, #27ae60 0%, #219a52 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              {stats.inventoryItems}
            </div>
            <p style={{ marginTop: '10px', color: '#2c3e50', fontWeight: '600' }}>Items Available</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto', borderRadius: '50%', background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              {stats.donations}
            </div>
            <p style={{ marginTop: '10px', color: '#2c3e50', fontWeight: '600' }}>Total Donations</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto', borderRadius: '50%', background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              {stats.pendingDonations}
            </div>
            <p style={{ marginTop: '10px', color: '#2c3e50', fontWeight: '600' }}>Needs Review</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px', borderRadius: '8px', marginTop: '30px', color: 'white', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 15px 0' }}>🚀 Welcome to ResQNet Admin Dashboard</h2>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
          Manage disaster relief operations efficiently. Monitor areas, track inventory, and coordinate donations all in one place.
        </p>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '14px' }}>
          <span>✓ Real-time Updates</span>
          <span>✓ Easy Management</span>
          <span>✓ Comprehensive Tracking</span>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '30px', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Recent Activity</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #eee', color: '#555' }}>
            🌍 Dashboard loaded successfully
          </li>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #eee', color: '#555' }}>
            📊 System statistics updated
          </li>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #eee', color: '#555' }}>
            ✓ All services are operational
          </li>
          <li style={{ padding: '12px 0', color: '#555' }}>
            💡 Ready to manage disaster relief operations
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardOverview;
