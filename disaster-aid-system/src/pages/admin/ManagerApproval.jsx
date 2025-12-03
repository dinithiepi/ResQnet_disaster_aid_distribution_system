import React, { useState, useEffect } from 'react';
import '../../styles.css';

function ManagerApproval() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetchPendingManagers();
  }, []);

  const fetchPendingManagers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // Direct call to admin service to avoid gateway issues
      const response = await fetch('http://localhost:4002/api/admin/managers/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setManagers(data.managers || []);
      } else {
        console.error('Failed to fetch managers:', response.status, response.statusText);
        // Optional: alert('Failed to load pending managers');
      }
    } catch (error) {
      console.error('Fetch managers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (managerId) => {
    if (!confirm('Approve this manager? A new aid center will be automatically created.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:4002/api/admin/managers/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ managerId })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Manager approved! Assigned to Aid Center ID: ${data.center.centerid}`);
        fetchPendingManagers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to approve manager');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve manager');
    }
  };

  const handleReject = async (managerId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:4002/api/admin/managers/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ managerId })
      });

      if (response.ok) {
        alert('Manager rejected');
        fetchPendingManagers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reject manager');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject manager');
    }
  };

  const viewCertificate = (certificatePath) => {
    const baseUrl = 'http://localhost:4003';
    const normalizedPath = certificatePath.startsWith('/') ? certificatePath : `/${certificatePath}`;
    setSelectedCertificate(`${baseUrl}${normalizedPath}`);
  };

  if (loading) {
    return <div className="loading">Loading pending managers...</div>;
  }

  return (
    <div className="manager-approval-page">
      <div className="page-header">
        <h1>Manager Approval</h1>
        <p className="page-subtitle">Review and approve village officer registrations</p>
      </div>

      {managers.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">✓</div>
          <h3>No Pending Approvals</h3>
          <p>All manager registrations have been processed</p>
        </div>
      ) : (
        <div className="managers-grid">
          {managers.map(manager => (
            <div key={manager.managerid} className="manager-card">
              <div className="manager-card-header">
                <div className="manager-avatar">
                  {manager.fname?.charAt(0)}{manager.lname?.charAt(0)}
                </div>
                <div className="manager-info">
                  <h3>{manager.name}</h3>
                  <p className="manager-email">{manager.email}</p>
                </div>
              </div>

              <div className="manager-details">
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{manager.phoneno}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">District:</span>
                  <span className="detail-value">{manager.district}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Registered:</span>
                  <span className="detail-value">
                    {new Date(manager.createdat).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Aid Center:</span>
                  <span className="detail-value">
                    <span className="badge badge-info">Auto-assigned on approval</span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Certificate:</span>
                  <button
                    className="btn-view-cert"
                    onClick={() => viewCertificate(manager.certificatepath)}
                  >
                    View Document
                  </button>
                </div>
              </div>

              <div className="manager-actions">
                <button
                  className="btn-approve"
                  onClick={() => handleApprove(manager.managerid)}
                >
                  ✓ Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleReject(manager.managerid)}
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCertificate && (
        <div className="certificate-modal" onClick={() => setSelectedCertificate(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCertificate(null)}>
              ✕
            </button>
            {selectedCertificate.match(/\.(jpeg|jpg|gif|png)$/i) ? (
              <img 
                src={selectedCertificate} 
                alt="Certificate" 
                className="certificate-viewer"
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} 
              />
            ) : (
              <iframe
                src={selectedCertificate}
                title="Certificate"
                className="certificate-viewer"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerApproval;
