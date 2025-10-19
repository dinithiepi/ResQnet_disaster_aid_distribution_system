import React, { useEffect, useState } from "react";
import "../styles.css";

const images = [
  "/images/aid1.jpg",
  "/images/aid2.jpg",
  "/images/aid4.jpg"
  
];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-root">
      <header className="top-bar">
        <div className="brand">ResQnet</div>
        <nav className="top-nav" aria-label="Main navigation">
          <a href="/donate">Donate</a>
          <a href="/inventory">Inventory</a>
          <a href="/map">Map</a>
          <a href="/about">About</a>
        </nav>
      </header>

      <main className="container">
        <div className="main-topic" role="banner">
          <h1>Disaster Resource Allocation Tracker</h1>
          <p className="subtitle">Coordinate aid, track supplies, and help communities recover.</p>
        </div>

        <div className="slideshow" aria-hidden="true">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`slide-${index}`}
              className={`slide ${index === currentIndex ? "active" : ""}`}
            />
          ))}
        </div>

        
          <section className="slideshow-description" aria-label="Slideshow description">
            <h2>🧭 About ResQNet</h2>
            <p>
              ResQNet is an intelligent Disaster Resource Allocation & Tracking System designed to enhance the efficiency of disaster relief operations. Our mission is to connect donors, relief centers, volunteers, and affected communities through a unified digital platform that ensures transparency, speed, and accuracy in aid distribution.
            </p>

            <p>
              During disasters, managing resources can be chaotic — supplies may be delayed, duplicated, or misplaced. ResQNet solves this by providing real-time data tracking, smart resource allocation, and centralized management tools for administrators and relief coordinators.
            </p>

            <p>With features such as:</p>

            <ul className="description-list">
              <li>🌍 Interactive Map showing affected areas and active relief centers</li>
              <li>🏥 Relief Center Registration & Management</li>
              <li>💰 Donor Management System to track and verify donations</li>
              <li>📦 Inventory Monitoring for supplies and essential items</li>
              <li>📊 Analytics Dashboard for insights and decision-making</li>
            </ul>

            <p>
              ResQNet aims to build a more coordinated, transparent, and data-driven disaster response network, empowering organizations to save more lives and deliver aid where it’s needed most.
            </p>
          </section>
      </main>
    </div>
  );
}

export default Home;
