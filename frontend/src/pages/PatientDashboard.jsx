import React, { useState, useEffect } from "react";
import API from "../api";

function PatientDashboard() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    const { data } = await API.get("/consents/patient");
    setRequests(data);
  };

  const approve = async (id) => {
    await API.put(`/consents/approve/${id}`);
    loadRequests();
  };

  const reject = async (id) => {
    await API.put(`/consents/reject/${id}`);
    loadRequests();
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="container">
      <h2>Patient Dashboard</h2>

      <h3>Your Consent Requests</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Requester</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.requester_name}</td>
              <td>{r.purpose}</td>
              <td>{r.status}</td>
              <td>
                {r.status === "PENDING" && (
                  <>
                    <button onClick={() => approve(r.id)}>Approve</button>
                    <button onClick={() => reject(r.id)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientDashboard;
