import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function HospitalDashboard() {
  const [patients, setPatients] = useState([]);
  const [consents, setConsents] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patientId: "",
    purpose: "",
    startTime: "",
    endTime: "",
  });

  const loadData = async () => {
    const { data: users } = await API.get("/users/patients");
    const { data: req } = await API.get("/consents/hospital");
    setPatients(users);
    setConsents(req);
  };

  const createConsent = async () => {
    await API.post("/consents/create", form);
    alert("Consent Request Created");
    loadData();
  };

  // 🔴 ONLY NEW CODE (LOGOUT)
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container">
      {/* 🔹 LOGOUT BUTTON ONLY */}
      <div style={{ textAlign: "right" }}>
        <button
          onClick={logout}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "6px 12px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Logout
        </button>
      </div>

      <h2 className="hospital-dashboard">Hospital Dashboard</h2>

      <h3>Create Consent</h3>

      <select onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
        <option>Select Patient</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Purpose"
        onChange={(e) => setForm({ ...form, purpose: e.target.value })}
      />

      <input
        type="datetime-local"
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />

      <input
        type="datetime-local"
        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
      />

      <button onClick={createConsent}>Create</button>

      <h3>Requests</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Purpose</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {consents.map((c) => (
            <tr key={c.id}>
              <td>{c.patient_name}</td>
              <td>{c.purpose}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HospitalDashboard;
