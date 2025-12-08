import { useState, useEffect } from "react";
import "../../styles.css";

export default function DonationManagement() {
  const [pendingDonations, setPendingDonations] = useState([]);
  const [allDonations, setAllDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, [activeTab]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'pending' 
        ? 'http://localhost:4000/inventory/donations/pending'
        : 'http://localhost:4000/inventory/donations';
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (activeTab === 'pending') {
        setPendingDonations(data);
      } else {
        setAllDonations(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donations:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId, newStatus, adminNotes = '') => {
    try {
      const response = await fetch(`http://localhost:4000/inventory/donations/${donationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes })
      });

      if (response.ok) {
        alert(`Donation status updated to '${newStatus}'`);
        fetchDonations();
      } else {
        alert('Error updating donation status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error connecting to server');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-badge-pending', label: '⏳ Pending' },
      contacted: { class: 'status-badge-contacted', label: '📞 Contacted' },
      scheduled: { class: 'status-badge-scheduled', label: '📅 Scheduled' },
      received: { class: 'status-badge-received', label: '✅ Received' },
      rejected: { class: 'status-badge-rejected', label: '❌ Rejected' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  const donations = activeTab === 'pending' ? pendingDonations : allDonations;

  return (
    <div className="donation-management">
      <h2>📦 Donation Management</h2>
      <p className="section-description">Review and manage donation requests from volunteers</p>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Requests ({pendingDonations.length})
        </button>
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          📋 All Donations
        </button>
      </div>

      {/* Donations List */}
      {loading ? (
        <div className="loading">Loading donations...</div>
      ) : donations.length === 0 ? (
        <div className="no-data">No donations found</div>
      ) : (
        <div className="donations-grid">
          {donations.map((donation) => (
            <div key={donation.donationid} className="donation-card">
              <div className="donation-header">
                <h3>{donation.volunteername}</h3>
                {getStatusBadge(donation.status)}
              </div>

              <div className="donation-details">
                <div className="detail-row">
                  <span className="label">📦 Item:</span>
                  <span className="value">{donation.itemcategory}</span>
                </div>
                <div className="detail-row">
                  <span className="label">🔢 Quantity:</span>
                  <span className="value">{donation.quantity}</span>
                </div>
                <div className="detail-row">
                  <span className="label">📧 Email:</span>
                  <span className="value">{donation.volunteeremail}</span>
                </div>
                <div className="detail-row">
                  <span className="label">📞 Phone:</span>
                  <span className="value">{donation.volunteerphoneno}</span>
                </div>
                <div className="detail-row">
                  <span className="label">📍 Address:</span>
                  <span className="value">{donation.volunteeraddress}</span>
                </div>
                {donation.notes && (
                  <div className="detail-row">
                    <span className="label">📝 Notes:</span>
                    <span className="value">{donation.notes}</span>
                  </div>
                )}
                {donation.submitteddate && (
                  <div className="detail-row">
                    <span className="label">📅 Submitted:</span>
                    <span className="value">{new Date(donation.submitteddate).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {donation.status === 'pending' && (
                <div className="donation-actions">
                  <button 
                    className="btn-action btn-contact"
                    onClick={() => handleStatusUpdate(donation.donationid, 'contacted', 'Volunteer contacted via phone')}
                  >
                    📞 Mark as Contacted
                  </button>
                  <button 
                    className="btn-action btn-schedule"
                    onClick={() => handleStatusUpdate(donation.donationid, 'scheduled', 'Pickup scheduled')}
                  >
                    📅 Schedule Pickup
                  </button>
                  <button 
                    className="btn-action btn-receive"
                    onClick={() => handleStatusUpdate(donation.donationid, 'received', 'Donation received and added to inventory')}
                  >
                    ✅ Mark as Received
                  </button>
                  <button 
                    className="btn-action btn-reject"
                    onClick={() => {
                      const reason = prompt('Enter rejection reason:');
                      if (reason) handleStatusUpdate(donation.donationid, 'rejected', reason);
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}

              {donation.status === 'contacted' && (
                <div className="donation-actions">
                  <button 
                    className="btn-action btn-schedule"
                    onClick={() => handleStatusUpdate(donation.donationid, 'scheduled')}
                  >
                    📅 Schedule Pickup
                  </button>
                  <button 
                    className="btn-action btn-receive"
                    onClick={() => handleStatusUpdate(donation.donationid, 'received')}
                  >
                    ✅ Mark as Received
                  </button>
                </div>
              )}

              {donation.status === 'scheduled' && (
                <div className="donation-actions">
                  <button 
                    className="btn-action btn-receive"
                    onClick={() => handleStatusUpdate(donation.donationid, 'received')}
                  >
                    ✅ Mark as Received
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
