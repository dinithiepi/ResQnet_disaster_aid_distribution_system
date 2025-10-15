import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Donate() {
  const navigate = useNavigate();

  return (
    <div className="page-root">
      {/* 🔹 Top Navigation Bar */}
      <header className="top-bar">
        <div className="brand">ResQNet</div>
        <nav className="top-nav" aria-label="Main navigation">
          <a href="/home">Home</a>
          <a href="/inventory">Inventory</a>
          <a href="/map">Map</a>
          <a href="/about">About</a>
        </nav>
      </header>

      {/* 🔹 Donate Content */}
      <main className="container donate-page">
        <div className="donate-hero">
          <h1>Together, We Can Make a Difference</h1>
          <p>
            Your small act of kindness can bring hope to those affected by disasters.
            Join hands with <b>ResQNet</b> and help us provide food, medicine, and shelter
            to those in need.
          </p>
          <button className="donate-button" onClick={() => navigate("/donors")}>
            Donate Now
          </button>
        </div>

        <div className="donate-gallery">
          <div className="donate-card">
            <img src="/images/food-donation.jpg" alt="Essential supplies donation" />
            <p>Provide essential supplies to families affected by disasters.</p>
          </div>

          <div className="donate-card">
            <img src="/images/medical-supplies.jpg" alt="Medical supplies" />
            <p>Support emergency medical teams with essential supplies.</p>
          </div>

          <div className="donate-card">
            <img src="/images/shelter.jpg" alt="Shelter aid" />
            <p>Help rebuild temporary shelters for disaster victims.</p>
          </div>
        </div>

        <div className="donate-info">
          <h2>Why Donate?</h2>
          <p>
            Each donation helps us reach affected areas faster. Whether it’s a single
            blanket or a truck of supplies, your contribution matters. ResQNet ensures
            every donation is tracked, transparent, and delivered responsibly.
          </p>
        </div>
      </main>
    </div>
  );
}
