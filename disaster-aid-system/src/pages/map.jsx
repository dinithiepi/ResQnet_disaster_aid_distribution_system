import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import "../styles.css";

// Fix missing default marker icons in Leaflet build tools
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Sri Lankan district coordinates mapping
const SRI_LANKA_DISTRICTS = {
  'colombo': [6.9271, 79.8612],
  'gampaha': [7.0840, 80.0098],
  'kalutara': [6.5854, 79.9607],
  'kandy': [7.2906, 80.6337],
  'matale': [7.4675, 80.6234],
  'nuwara eliya': [6.9497, 80.7891],
  'galle': [6.0535, 80.2210],
  'matara': [5.9549, 80.5550],
  'hambantota': [6.1429, 81.1212],
  'jaffna': [9.6615, 80.0255],
  'kilinochchi': [9.3806, 80.3978],
  'mannar': [8.9810, 79.9044],
  'vavuniya': [8.7542, 80.4982],
  'mullaitivu': [9.2671, 80.8142],
  'batticaloa': [7.7310, 81.6747],
  'ampara': [7.2918, 81.6747],
  'trincomalee': [8.5874, 81.2152],
  'kurunegala': [7.4818, 80.3609],
  'puttalam': [8.0362, 79.8283],
  'anuradhapura': [8.3114, 80.4037],
  'polonnaruwa': [7.9403, 81.0188],
  'badulla': [6.9934, 81.0550],
  'monaragala': [6.8728, 81.3507],
  'ratnapura': [6.7056, 80.3847],
  'kegalle': [7.2513, 80.3464]
};

export default function MapPage() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisasterAreas();
  }, []);

  const fetchDisasterAreas = async () => {
    try {
      console.log('🔍 Attempting to fetch disaster areas from http://localhost:4000/api/disaster-areas');
      const response = await fetch('http://localhost:4000/api/disaster-areas');
      console.log('✅ Fetch response status:', response.status, response.statusText);
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Disaster areas raw data:', data);
        
        // The API returns an array directly, not wrapped in an object
        const areas = Array.isArray(data) ? data : [];
        console.log('📊 Number of areas found:', areas.length);
        
        if (areas.length === 0) {
          console.warn('⚠️ No disaster areas found in database. Admin needs to add disaster areas.');
        }
        
        // Map disaster areas to coordinates
        const mappedDisasters = areas.map(area => {
          const district = (area.location || area.district || '').toLowerCase().trim();
          const coords = SRI_LANKA_DISTRICTS[district] || [7.8731, 80.7718]; // Default to center of SL
          console.log(`📍 Mapping "${area.areaname}" in ${area.location || area.district} (${district}) to`, coords);
          return {
            id: area.areaid,
            name: area.areaname || `${area.location} Disaster Area`,
            district: area.location || area.district,
            severity: area.severity,
            affectedPopulation: area.affectedpopulation,
            description: area.description,
            position: coords,
            type: 'disaster'
          };
        });
        console.log('✅ Successfully mapped disasters:', mappedDisasters);
        setDisasters(mappedDisasters);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch disaster areas:', response.status, errorText);
        alert(`Failed to load disaster areas. Status: ${response.status}. Make sure gateway service is running on port 4000.`);
      }
    } catch (error) {
      console.error('❌ Error fetching disaster areas:', error);
      alert(`Cannot connect to gateway service. Please ensure the backend service is running on port 4000.\n\nError: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-root">
        <header className="top-bar">
          <div className="brand">ResQNet</div>
          <nav className="top-nav" aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/donate">Donate</a>
            <a href="/inventory">Inventory</a>
            <a href="/about">About</a>
          </nav>
        </header>
        <main className="container">
          <div className="loading">Loading map data...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-root">
      {/* 🔹 Top Navigation Bar */}
      <header className="top-bar">
        <div className="brand">ResQNet</div>
        <nav className="top-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/donate">Donate</a>
          <a href="/inventory">Inventory</a>
          <a href="/about">About</a>
        </nav>
      </header>

      {/* 🔹 Map Content */}
      <main className="container map-page">
        <h2>Disaster Areas Map - Sri Lanka</h2>
        <p>
          View real-time locations of affected disaster areas across Sri Lanka.
          {disasters.length > 0 && ` Currently tracking ${disasters.length} active disaster area(s).`}
        </p>

        <MapContainer
          center={[7.8731, 80.7718]} // Center of Sri Lanka
          zoom={7}
          style={{ height: "75vh", width: "90%", margin: "20px auto", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
          />

          {/* Disaster markers in red */}
          {disasters.map((loc) => (
            <Marker
              key={`disaster-${loc.id}`}
              position={loc.position}
              icon={L.icon({
                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>
                <b>{loc.name}</b>
                <br />
                District: {loc.district}
                <br />
                Severity: {loc.severity}
                {loc.affectedPopulation > 0 && (
                  <>
                    <br />
                    Affected Population: {loc.affectedPopulation}
                  </>
                )}
                {loc.description && (
                  <>
                    <br />
                    {loc.description}
                  </>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="map-legend">
          <h4>Legend</h4>
          <p>
            <img
              src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
              alt="Disaster"
              width="15"
              height="24"
            />{" "}
            Disaster Area ({disasters.length})
          </p>
        </div>
      </main>
    </div>
  );
}
