import React, { useState, useEffect } from 'react';
import '../../styles.css';

function DisasterAreaManagement() {
  const [areas, setAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState({
    areaname: '',
    location: '',
    severity: 'moderate',
    affectedpopulation: '',
    description: ''
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/disaster-areas');
      const data = await response.json();
      setAreas(data);
    } catch (error) {
      console.error('Error fetching disaster areas:', error);
      // Demo data for testing
      setAreas([
        {
          areaid: 1,
          areaname: 'Northern Flood Zone',
          location: 'Northern Province',
          severity: 'high',
          affectedpopulation: 15000,
          description: 'Severe flooding affecting multiple villages'
        },
        {
          areaid: 2,
          areaname: 'Eastern Earthquake Zone',
          location: 'Eastern Province',
          severity: 'critical',
          affectedpopulation: 25000,
          description: 'Major earthquake with building collapses'
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
      const url = editingArea
        ? `http://localhost:4000/api/disaster-areas/${editingArea.areaid}`
        : 'http://localhost:4000/api/disaster-areas';
      
      const method = editingArea ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchAreas();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving disaster area:', error);
      alert('Failed to save disaster area');
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setFormData({
      areaname: area.areaname,
      location: area.location,
      severity: area.severity,
      affectedpopulation: area.affectedpopulation,
      description: area.description
    });
    setShowModal(true);
  };

  const handleDelete = async (areaid) => {
    if (!window.confirm('Are you sure you want to delete this disaster area?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/disaster-areas/${areaid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAreas();
      }
    } catch (error) {
      console.error('Error deleting disaster area:', error);
      alert('Failed to delete disaster area');
    }
  };

  const openNewModal = () => {
    setEditingArea(null);
    setFormData({
      areaname: '',
      location: '',
      severity: 'moderate',
      affectedpopulation: '',
      description: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingArea(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'moderate': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="disaster-area-management">
      <div className="page-header">
        <h1>Disaster Area Management</h1>
        <button onClick={openNewModal} className="add-button">
          + Add New Area
        </button>
      </div>

      <div className="areas-grid">
        {areas.map(area => (
          <div key={area.areaid} className="area-card">
            <div className="area-header">
              <h3>{area.areaname}</h3>
              <span 
                className="severity-badge"
                style={{ backgroundColor: getSeverityColor(area.severity) }}
              >
                {area.severity}
              </span>
            </div>
            <div className="area-details">
              <p><strong>Location:</strong> {area.location}</p>
              <p><strong>Affected Population:</strong> {area.affectedpopulation?.toLocaleString()}</p>
              <p><strong>Description:</strong> {area.description}</p>
            </div>
            <div className="area-actions">
              <button onClick={() => handleEdit(area)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(area.areaid)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingArea ? 'Edit Disaster Area' : 'Add New Disaster Area'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Area Name</label>
                <input
                  type="text"
                  name="areaname"
                  value={formData.areaname}
                  onChange={handleInputChange}
                  required
                />
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
                <label>Severity</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  required
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label>Affected Population</label>
                <input
                  type="number"
                  name="affectedpopulation"
                  value={formData.affectedpopulation}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingArea ? 'Update' : 'Create'}
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

export default DisasterAreaManagement;
