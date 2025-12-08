import React, { useState, useEffect } from 'react';
import '../../styles.css';

function ItemRequestManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvedQuantity, setApprovedQuantity] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchItemRequests();
  }, []);

  const fetchItemRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:4000/admin/item-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Fetch requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (!approvedQuantity || approvedQuantity <= 0) {
      alert('Please enter a valid approved quantity');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:4000/admin/item-requests/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          requestId, 
          approvedQuantity: parseInt(approvedQuantity),
          remarks 
        })
      });

      if (response.ok) {
        alert('Item request approved successfully!');
        setSelectedRequest(null);
        setApprovedQuantity('');
        setRemarks('');
        fetchItemRequests();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:4000/admin/item-requests/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, remarks: reason })
      });

      if (response.ok) {
        alert('Item request rejected');
        fetchItemRequests();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject request');
    }
  };

  const openApprovalModal = (request) => {
    setSelectedRequest(request);
    setApprovedQuantity(request.requestedquantity.toString());
    setRemarks('');
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

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

  if (loading) {
    return <div className="loading">Loading item requests...</div>;
  }

  return (
    <div className="item-requests-page">
      <div className="page-header">
        <h1>Item Request Management</h1>
        <p className="page-subtitle">Review and approve manager item requests</p>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({requests.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button 
          className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved ({requests.filter(r => r.status === 'approved').length})
        </button>
        <button 
          className={`filter-tab ${filter === 'received' ? 'active' : ''}`}
          onClick={() => setFilter('received')}
        >
          Received ({requests.filter(r => r.status === 'received').length})
        </button>
        <button 
          className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({requests.filter(r => r.status === 'rejected').length})
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">📦</div>
          <h3>No {filter !== 'all' ? filter : ''} requests</h3>
          <p>There are no item requests to display</p>
        </div>
      ) : (
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Manager</th>
                <th>Aid Center</th>
                <th>Item Category</th>
                <th>Requested Qty</th>
                <th>Approved Qty</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.requestid}>
                  <td>#{request.requestid}</td>
                  <td>
                    <div>
                      <div className="manager-name">{request.manager_name}</div>
                      <div className="manager-email">{request.manager_email}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>{request.center_location}</div>
                      <div className="text-muted">{request.center_district}</div>
                    </div>
                  </td>
                  <td className="item-category">{request.itemcategory}</td>
                  <td className="text-center">{request.requestedquantity}</td>
                  <td className="text-center">
                    {request.approvedquantity || '-'}
                  </td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>{new Date(request.requestedat).toLocaleDateString()}</td>
                  <td>
                    {request.status === 'pending' && (
                      <div className="action-buttons">
                        <button
                          className="btn-approve-sm"
                          onClick={() => openApprovalModal(request)}
                          title="Approve"
                        >
                          ✓
                        </button>
                        <button
                          className="btn-reject-sm"
                          onClick={() => handleReject(request.requestid)}
                          title="Reject"
                        >
                          ✗
                        </button>
                      </div>
                    )}
                    {request.remarks && (
                      <div className="remarks-tooltip" title={request.remarks}>
                        💬
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest && (
        <div className="approval-modal" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content-approval" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Approve Item Request</h2>
              <button className="modal-close" onClick={() => setSelectedRequest(null)}>
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="request-details">
                <div className="detail-item">
                  <span className="label">Manager:</span>
                  <span className="value">{selectedRequest.manager_name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Aid Center:</span>
                  <span className="value">{selectedRequest.center_location}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Item Category:</span>
                  <span className="value">{selectedRequest.itemcategory}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Requested Quantity:</span>
                  <span className="value">{selectedRequest.requestedquantity}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Approved Quantity *</label>
                <input
                  type="number"
                  className="form-control"
                  value={approvedQuantity}
                  onChange={(e) => setApprovedQuantity(e.target.value)}
                  min="1"
                  max={selectedRequest.requestedquantity}
                />
              </div>

              <div className="form-group">
                <label>Remarks (Optional)</label>
                <textarea
                  className="form-control"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="3"
                  placeholder="Add any notes or comments..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setSelectedRequest(null)}
              >
                Cancel
              </button>
              <button 
                className="btn-approve"
                onClick={() => handleApprove(selectedRequest.requestid)}
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemRequestManagement;
