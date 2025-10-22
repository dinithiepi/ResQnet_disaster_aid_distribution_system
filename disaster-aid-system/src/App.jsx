import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Inventory from "./pages/inventory";
import Donors from "./pages/donors";
import Donate from "./pages/donate";
import Map from "./pages/map";
import About from "./pages/about";
import AdminDashboard from "./pages/admindashboard";
import Header from "./components/Header";

export default function App() {
  return (
    <Router>
      

  <Header />
  <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/map" element={<Map />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      {/* Footer strip with images from public/images */}
      <div className="footer-strip" role="contentinfo" aria-label="Donation images" />
    </Router>
  );
}
