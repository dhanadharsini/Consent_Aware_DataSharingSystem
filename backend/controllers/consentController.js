import { db } from "../config/db.js";

// Create Consent Request (Hospital)
export const createConsent = (req, res) => {
  const { patientId, purpose, startTime, endTime } = req.body;
  const requesterId = req.user.id;

  const query = "INSERT INTO consents (patient_id, requester_id, purpose, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, 'PENDING')";
  db.query(query, [patientId, requesterId, purpose, startTime, endTime], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Consent request created" });
  });
};

// Get consents for hospital
export const getHospitalConsents = (req, res) => {
  const query = `
    SELECT c.id, u.name as patient_name, c.purpose, c.status
    FROM consents c
    JOIN users u ON c.patient_id = u.id
    WHERE c.requester_id = ?
  `;
  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Get consents for patient
export const getPatientConsents = (req, res) => {
  const query = `
    SELECT c.id, u.name as requester_name, c.purpose, c.status
    FROM consents c
    JOIN users u ON c.requester_id = u.id
    WHERE c.patient_id = ?
  `;
  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Approve consent
export const approveConsent = (req, res) => {
  const query = "UPDATE consents SET status = 'APPROVED' WHERE id = ? AND patient_id = ?";
  db.query(query, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Consent approved" });
  });
};

// Reject consent
export const rejectConsent = (req, res) => {
  const query = "UPDATE consents SET status = 'REJECTED' WHERE id = ? AND patient_id = ?";
  db.query(query, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Consent rejected" });
  });
};
