import React, { useEffect, useState } from "react";
import API from "../api";

function HospitalDashboard() {
  const [patients, setPatients] = useState([]);
  const [consents, setConsents] = useState([]);
  const [form, setForm] = useState({
    patientId: "",
    purpose: "",
    startTime: "",
    endTime: ""
  });

  const loadData = async () => {
    // Get all patients
    const { data: users } = await API.get("/users/patients");
    setPatients(users);

    // Get hospital-created requests
    const { data: req } = await API.get("/consents/hospital");
    setConsents(req);
  };

  const createConsent = async () => {
    await API.post("/consents/create", form);
    alert("Consent request created!");
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container">
      <h2>Hospital Dashboard</h2>

      <h3>Create Consent Request</h3>

      <select onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
        <option>Select Patient</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <input
        type="text"
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

      <h3>Your Requests</h3>

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
