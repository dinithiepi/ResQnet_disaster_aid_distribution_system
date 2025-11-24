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
    <div className="home-page">
      {/* Hero Section with Slideshow */}
      <section className="hero-section">
        <div className="slideshow">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`slide-${index}`}
              className={`slide ${index === currentIndex ? "active" : ""}`}
            />
          ))}
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">ResQNet</h1>
              <p className="hero-subtitle">Disaster Resource Allocation & Tracking System</p>
              <p className="hero-description">
                Coordinate aid, track supplies, and help communities recover faster
              </p>
              <div className="hero-buttons">
                <a href="/donate" className="btn btn-primary">Donate Now</a>
                <a href="/about" className="btn btn-secondary">Learn More</a>
                <a href="/manager/login" className="btn btn-accent">Manager Portal</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Our Key Features</h2>
          <p className="section-subtitle">Comprehensive tools for efficient disaster relief management</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Interactive Map</h3>
              <p>Real-time visualization of affected areas and active relief centers across Sri Lanka</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Inventory Tracking</h3>
              <p>Monitor supplies, donations, and essential items with live stock updates</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Donation Management</h3>
              <p>Track and verify donations from volunteers and organizations transparently</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Data-driven insights for better decision-making and resource allocation</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Relief Center Management</h3>
              <p>Register and manage relief centers with centralized coordination</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-Time Updates</h3>
              <p>Instant notifications and live data synchronization across all platforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Relief Centers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Donations Tracked</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">People Helped</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <h2 className="section-title">How ResQNet Works</h2>
          <p className="section-subtitle">Simple steps to make a difference</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Register</h3>
              <p>Create an account as a donor, volunteer, or relief center manager</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Track Resources</h3>
              <p>View real-time inventory and identify areas in need of supplies</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Contribute</h3>
              <p>Donate resources, volunteer time, or provide logistical support</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Monitor Impact</h3>
              <p>Track your contribution and see how it helps affected communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About ResQNet</h2>
              <p>
                ResQNet is an intelligent Disaster Resource Allocation & Tracking System designed to enhance 
                the efficiency of disaster relief operations. Our mission is to connect donors, relief centers, 
                volunteers, and affected communities through a unified digital platform.
              </p>
              <p>
                During disasters, managing resources can be chaotic — supplies may be delayed, duplicated, 
                or misplaced. ResQNet solves this by providing real-time data tracking, smart resource 
                allocation, and centralized management tools for administrators and relief coordinators.
              </p>
              <p>
                ResQNet aims to build a more coordinated, transparent, and data-driven disaster response 
                network, empowering organizations to save more lives and deliver aid where it's needed most.
              </p>
            </div>
            <div className="about-image">
              <img src="/images/aid1.jpg" alt="Disaster relief efforts" />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="section-container">
          <h2 className="cta-title">Ready to Make a Difference?</h2>
          <p className="cta-subtitle">Join thousands of volunteers and donors helping communities recover</p>
          <div className="cta-buttons">
            <a href="/donate" className="btn btn-primary btn-large">Start Donating</a>
            <a href="/map" className="btn btn-secondary btn-large">View Active Relief Centers</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>ResQNet</h3>
              <p>Disaster Resource Allocation & Tracking System</p>
            </div>
            
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/donate">Donate</a></li>
                <li><a href="/inventory">Inventory</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="/map">Relief Centers</a></li>
                <li><a href="/admin/login">Admin Login</a></li>
                <li><a href="/manager/login">Manager Login</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Contact</h4>
              <p>Email: info@resqnet.lk</p>
              <p>Phone: +94 11 234 5678</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 ResQNet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
