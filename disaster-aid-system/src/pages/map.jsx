import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
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

export default function MapPage() {
  // Example static data (can be replaced with data from your database)
  const [disasters] = useState([
    { id: 1, name: "Flood - Galle", position: [6.0535, 80.221], type: "disaster" },
    { id: 2, name: "Landslide - Kandy", position: [7.2936, 80.635], type: "disaster" },
  ]);

  const [aidCenters] = useState([
    { id: 1, name: "Aid Center - Colombo", position: [6.9271, 79.8612], type: "aid" },
    { id: 2, name: "Aid Center - Jaffna", position: [9.6615, 80.0255], type: "aid" },
  ]);

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
        <h2>Disaster & Aid Center Map - Sri Lanka</h2>
        <p>
          View real-time locations of affected disaster areas and active aid centers across Sri Lanka.
          Each marker represents a disaster location or a registered relief center.
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
              key={loc.id}
              position={loc.position}
              icon={L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535239.png",
                iconSize: [30, 30],
              })}
            >
              <Popup>
                <b>{loc.name}</b>
                <br />
                Status: Disaster Location
              </Popup>
            </Marker>
          ))}

          {/* Aid center markers in green */}
          {aidCenters.map((center) => (
            <Marker
              key={center.id}
              position={center.position}
              icon={L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                iconSize: [30, 30],
              })}
            >
              <Popup>
                <b>{center.name}</b>
                <br />
                Type: Aid Center
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="map-legend">
          <h4>Legend</h4>
          <p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/535/535239.png"
              alt="Disaster"
              width="18"
            />{" "}
            Disaster Location
          </p>
          <p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
              alt="Aid Center"
              width="18"
            />{" "}
            Aid Center
          </p>
        </div>
      </main>
    </div>
  );
}
