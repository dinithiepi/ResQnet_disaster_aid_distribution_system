import React from "react";
import "../styles.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>About ResQNet</h1>
      <p className="about-intro">
        ResQNet is a disaster resource allocation and tracking system dedicated
        to connecting donors, volunteers, and relief centers during times of
        crisis. Our goal is to ensure that aid reaches those in need efficiently
        and transparently.
      </p>

      <div className="about-sections">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            To create a fast and reliable platform that streamlines disaster
            response operations, helping communities recover faster through
            technology and collaboration.
          </p>
        </div>

        <div className="about-card">
          <h2>What We Do</h2>
          <p>
            ResQNet manages donor contributions, volunteer coordination, and
            real-time updates from relief centers. Our interactive map displays
            affected areas and available resources to support smarter decisions.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Vision</h2>
          <p>
            To build a resilient world where disaster aid is never delayed — a
            connected network of hope, efficiency, and action.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
