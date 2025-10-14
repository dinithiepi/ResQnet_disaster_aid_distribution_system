import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Inventory from "./pages/inventory";
import Donors from "./pages/donors";
import AdminDashboard from "./pages/admindashboard";

export default function App() {
  return (
    <Router>
      

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
