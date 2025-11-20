import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Inventory from "./pages/inventory";
import Donors from "./pages/donors";
import Donate from "./pages/donate";
import Map from "./pages/map";
import About from "./pages/about";
import MainLayout from "./components/MainLayout";

// Import new admin components
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboardLayout from "./pages/admin/AdminDashboard";
import DashboardOverview from "./pages/admin/DashboardOverview";
import LiveChat from "./pages/admin/LiveChat";
import DisasterAreaManagement from "./pages/admin/DisasterAreaManagement";
import InventoryManagement from "./pages/admin/InventoryManagement";
import DonationManagement from "./pages/admin/DonationManagement";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main site routes with header and container */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/map" element={<Map />} />
          <Route path="/about" element={<About />} />
        </Route>
        
        {/* Admin Routes (no main layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboardLayout />
            </ProtectedRoute>
          } 
        >
          {/* Nested routes - default to overview */}
          <Route index element={<DashboardOverview />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="live-chat" element={<LiveChat />} />
          <Route path="disaster-areas" element={<DisasterAreaManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="donations" element={<DonationManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}
