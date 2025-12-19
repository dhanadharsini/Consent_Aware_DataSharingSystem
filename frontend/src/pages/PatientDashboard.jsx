import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

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

  const revoke = async (id) => {
    await API.put(`/consents/revoke/${id}`);
    loadRequests();
  };

  const cancel = async (id) => {
    await API.put(`/consents/cancel/${id}`);
    loadRequests();
  };

  // 🔴 ONLY NEW CODE (LOGOUT)
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    loadRequests();
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

      <h2>Patient Dashboard</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Hospital</th>
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
                    <button onClick={() => approve(r.id)} className="approve">Approve</button>
                    <button onClick={() => reject(r.id)} className="reject">Reject</button>
                  </>
                )}

                {r.status === "APPROVED" && (
                  <button onClick={() => cancel(r.id)} className="cancel">Cancel</button>
                )}

                {r.status === "EXPIRED" && (
                  <button onClick={() => revoke(r.id)} className="revoke">Revoke</button>
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
