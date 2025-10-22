import React, { useState, useEffect } from "react";

// Admin registration/login page (client-side demo)
// Register requires: name, nic, email, password
// Admins stored in localStorage under 'admins'

function getAdmins() {
  try {
    const raw = localStorage.getItem("admins");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveAdmins(admins) {
  localStorage.setItem("admins", JSON.stringify(admins));
}

export default function AdminDashboard() {
  const [mode, setMode] = useState("login"); // 'login' | 'register' | 'dashboard'
  const [admins, setAdmins] = useState(getAdmins());
  const [currentAdmin, setCurrentAdmin] = useState(null);

  const [form, setForm] = useState({ name: "", nic: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentAdmin");
      if (raw) {
        setCurrentAdmin(JSON.parse(raw));
        setMode("dashboard");
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    saveAdmins(admins);
  }, [admins]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateNic(nic) {
    // Basic NIC format check (adjust pattern to your country's NIC rules)
    if (!nic) return false;
    return nic.length >= 6; // minimal length check
  }

  function handleRegister(e) {
    e.preventDefault();
    setError("");
    const { name, nic, email, password } = form;
    if (!name || !nic || !email || !password) return setError("All fields are required.");
    if (!validateNic(nic)) return setError("NIC appears invalid.");
    if (admins.find((a) => a.email === email)) return setError("An admin with this email already exists.");
    if (admins.find((a) => a.nic === nic)) return setError("An admin with this NIC already exists.");

    const newAdmin = { id: Date.now(), name: name.trim(), nic: nic.trim(), email: email.trim().toLowerCase(), password };
    const next = [...admins, newAdmin];
    setAdmins(next);
    localStorage.setItem("currentAdmin", JSON.stringify({ id: newAdmin.id, name: newAdmin.name, email: newAdmin.email, nic: newAdmin.nic }));
    localStorage.setItem("role", "admin");
    setCurrentAdmin({ id: newAdmin.id, name: newAdmin.name, email: newAdmin.email, nic: newAdmin.nic });
    setForm({ name: "", nic: "", email: "", password: "" });
    setMode("dashboard");
  }

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    const { email, password } = form;
    if (!email || !password) return setError("Email and password required.");
    const found = admins.find((a) => a.email === email.trim().toLowerCase() && a.password === password);
    if (!found) return setError("Invalid credentials.");
    localStorage.setItem("currentAdmin", JSON.stringify({ id: found.id, name: found.name, email: found.email, nic: found.nic }));
    localStorage.setItem("role", "admin");
    setCurrentAdmin({ id: found.id, name: found.name, email: found.email, nic: found.nic });
    setForm({ name: "", nic: "", email: "", password: "" });
    setMode("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("currentAdmin");
    localStorage.removeItem("role");
    setCurrentAdmin(null);
    setMode("login");
  }

  function AdminView() {
    return (
      <div style={{
        maxWidth: 520,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <h2 style={{ marginBottom: 8 }}>Admin Dashboard</h2>
        <p style={{ marginBottom: 12 }}>Welcome, <strong>{currentAdmin?.name}</strong> (NIC: {currentAdmin?.nic})</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <button onClick={handleLogout} style={{
            background: "#c82333",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: 6,
            cursor: "pointer"
          }}>Sign out</button>
        </div>

        <section>
          <h3 style={{ marginTop: 8 }}>Management</h3>
          <ul>
            <li>Disaster Zones</li>
            <li>Relief Centers</li>
            <li>Inventory Updates</li>
            <li>Analytics</li>
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f5f7" }}>
      {mode === "dashboard" && currentAdmin ? (
        <AdminView />
      ) : (
        <div style={{
          width: "100%",
          maxWidth: 520,
          margin: "40px",
          padding: 24,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: 12 }}>{mode === "login" ? "Admin Login" : "Register Admin"}</h2>
          {error && <div style={{ color: "#b02a37", marginBottom: 12, textAlign: "center" }}>{error}</div>}
          <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
            {mode === "register" && (
              <>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 6 }}>Full name</label>
                  <input name="name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 6 }}>NIC</label>
                  <input name="nic" value={form.nic} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
                </div>
              </>
            )}

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
            </div>

            <div style={{ textAlign: "center" }}>
              <button type="submit" style={{ background: "#0d6efd", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 6, cursor: "pointer" }}>{mode === "login" ? "Sign in" : "Register"}</button>
            </div>
          </form>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            {mode === "login" ? (
              <>
                <span>Don't have an admin account?</span>{" "}
                <button onClick={() => setMode("register")} style={{ background: "none", color: "#0d6efd", border: "none", cursor: "pointer", textDecoration: "underline" }}>Register</button>
              </>
            ) : (
              <>
                <span>Already have an account?</span>{" "}
                <button onClick={() => setMode("login")} style={{ background: "none", color: "#0d6efd", border: "none", cursor: "pointer", textDecoration: "underline" }}>Sign in</button>
              </>
            )}
          </div>

          <div style={{ marginTop: 20 }}>
            <h4 style={{ marginBottom: 8 }}>Existing admins</h4>
            <ul style={{ paddingLeft: 18 }}>
              {admins.map((a) => (
                <li key={a.id}>{a.name} — {a.nic} — {a.email}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
