import React, { useState, useEffect } from "react";

// Simple client-side admin register/login/dashboard
// Data is stored in localStorage under 'admins' (array) and 'currentAdmin'

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

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", identity: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    // initialize session from localStorage
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

  function handleRegister(e) {
    e.preventDefault();
    setError("");
  const { name, email, password, phone, identity } = form;
  if (!name || !email || !password || !phone || !identity) return setError("All fields are required.");

  if (admins.find((a) => a.email === email)) return setError("Admin with this email already exists.");

  const newAdmin = { id: Date.now(), name, email, password, phone, identity };
    const next = [...admins, newAdmin];
    setAdmins(next);
    // auto-login after register
    localStorage.setItem(
      "currentAdmin",
      JSON.stringify({ id: newAdmin.id, name: newAdmin.name, email: newAdmin.email, phone: newAdmin.phone, identity: newAdmin.identity })
    );
    localStorage.setItem("role", "admin");
    setCurrentAdmin({ id: newAdmin.id, name: newAdmin.name, email: newAdmin.email, phone: newAdmin.phone, identity: newAdmin.identity });
    setForm({ name: "", email: "", password: "" });
    setMode("dashboard");
  }

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    const { email, password } = form;
    if (!email || !password) return setError("Email and password required.");
    const found = admins.find((a) => a.email === email && a.password === password);
    if (!found) return setError("Invalid credentials.");
    localStorage.setItem(
      "currentAdmin",
      JSON.stringify({ id: found.id, name: found.name, email: found.email, phone: found.phone, identity: found.identity })
    );
    localStorage.setItem("role", "admin");
    setCurrentAdmin({ id: found.id, name: found.name, email: found.email, phone: found.phone, identity: found.identity });
    setForm({ name: "", email: "", password: "" });
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
      <div>
        <h2>Admin Dashboard</h2>
        <p>Welcome, {currentAdmin?.name} ({currentAdmin?.email})</p>
        <button onClick={handleLogout}>Sign out</button>

        <h3>Management</h3>
        <ul>
          <li>Disaster Zones</li>
          <li>Relief Centers</li>
          <li>Inventory Updates</li>
          <li>Analytics</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="donor-page">
      <div className="donor-container">
        {mode === "dashboard" && currentAdmin ? (
          <div>
            <h2>Admin Dashboard</h2>
            <p style={{ color: "#555" }}>Welcome, <strong>{currentAdmin?.name}</strong> ({currentAdmin?.email})</p>
            <div style={{ marginTop: 12, marginBottom: 18 }}>
              <button className="button-green" onClick={handleLogout}>Sign out</button>
            </div>

            <h3 style={{ color: "#007b7f" }}>Management</h3>
            <ul>
              <li>Disaster Zones</li>
              <li>Relief Centers</li>
              <li>Inventory Updates</li>
              <li>Analytics</li>
            </ul>
          </div>
        ) : (
          <div>
            <h2 style={{ color: "#007b7f" }}>{mode === "login" ? "Admin Login" : "Register Admin"}</h2>
            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
            <form className="donor-form" onSubmit={mode === "login" ? handleLogin : handleRegister}>
                  {mode === "register" && (
                    <label>
                      Name
                      <input name="name" value={form.name} onChange={handleChange} />
                    </label>
                  )}

                  <label>
                    Email
                    <input name="email" type="email" value={form.email} onChange={handleChange} />
                  </label>

                  <label>
                    Password
                    <input name="password" type="password" value={form.password} onChange={handleChange} />
                  </label>

                  {mode === "register" && (
                    <>
                      <label>
                        Phone number
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. +94 77 123 4567" />
                      </label>
                      <label>
                        Identity number
                        <input name="identity" value={form.identity} onChange={handleChange} placeholder="NIC / ID" />
                      </label>
                    </>
                  )}

              <div style={{ marginTop: 8 }}>
                <button className="button-green" type="submit">{mode === "login" ? "Sign in" : "Register"}</button>
              </div>
            </form>

            <div style={{ marginTop: 12 }}>
              {mode === "login" ? (
                <>
                  <span style={{ color: "#555" }}>Don't have an admin account?</span>{" "}
                  <button onClick={() => setMode("register")}>Register</button>
                </>
              ) : (
                <>
                  <span style={{ color: "#555" }}>Already have an account?</span>{" "}
                  <button onClick={() => setMode("login")}>Sign in</button>
                </>
              )}
            </div>

            <div style={{ marginTop: 18 }}>
              <h4 style={{ marginBottom: 8 }}>Existing admins</h4>
              <ul>
                {admins.length === 0 ? (
                  <li style={{ color: '#666' }}>No admins registered</li>
                ) : (
                  admins.map((a) => (
                    <li key={a.id}>{a.name} — {a.email} — {a.phone || 'no phone'} — {a.identity || 'no id'}</li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

