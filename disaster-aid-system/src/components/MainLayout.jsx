import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

function MainLayout() {
  return (
    <>
      <Header />
      <div className="container">
        <Outlet />
      </div>
      {/* Footer strip with images from public/images */}
      <div className="footer-strip" role="contentinfo" aria-label="Donation images" />
    </>
  );
}

export default MainLayout;
