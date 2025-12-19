import { db } from "../config/db.js";

/* --------------------------------------------------
   AUTO EXPIRE CONSENTS
-------------------------------------------------- */
const autoExpire = () => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE consents
      SET status = 'EXPIRED'
      WHERE status = 'APPROVED' AND end_time < NOW()
    `;
    db.query(query, (err, result) => {
      if (err) {
        console.error("Auto-expire error:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

/* --------------------------------------------------
   CREATE CONSENT
-------------------------------------------------- */
export const createConsent = (req, res) => {
  const { patientId, purpose, startTime, endTime } = req.body;
  const requesterId = req.user.id;

  const start = startTime.replace("T", " ");
  const end = endTime.replace("T", " ");

  const query = `
    INSERT INTO consents 
    (patient_id, requester_id, purpose, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, 'PENDING')
  `;

  db.query(query, [patientId, requesterId, purpose, start, end], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Consent request created successfully" });
  });
};

export const getHospitalConsents = async (req, res) => {
  try {
    await autoExpire(); // update expired consents first

    const query = `
      SELECT c.id,
             u.name AS patient_name,
             c.purpose,
             c.status,
             c.end_time
      FROM consents c
      JOIN users u ON c.patient_id = u.id
      WHERE c.requester_id = ?
    `;

    db.query(query, [req.user.id], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hospital consents", error: err });
  }
};


/* --------------------------------------------------
   GET CONSENTS FOR PATIENT
-------------------------------------------------- */
export const getPatientConsents = async (req, res) => {
  try {
    await autoExpire();

    const query = `
      SELECT c.id,
             u.name AS requester_name,
             c.purpose,
             c.status,
             c.end_time
      FROM consents c
      JOIN users u ON c.requester_id = u.id
      WHERE c.patient_id = ?
    `;

    db.query(query, [req.user.id], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ message: "Auto-expire failed", error: err });
  }
};

/* --------------------------------------------------
   APPROVE CONSENT
-------------------------------------------------- */
export const approveConsent = (req, res) => {
  const query = `
    UPDATE consents
    SET status = 'APPROVED'
    WHERE id = ? AND patient_id = ? AND status = 'PENDING'
  `;
  db.query(query, [req.params.id, req.user.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Consent approved" });
  });
};

/* --------------------------------------------------
   REJECT CONSENT
-------------------------------------------------- */
export const rejectConsent = (req, res) => {
  const query = `
    UPDATE consents
    SET status = 'REJECTED'
    WHERE id = ? AND patient_id = ? AND status = 'PENDING'
  `;
  db.query(query, [req.params.id, req.user.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Consent rejected" });
  });
};

export const cancelConsent = async (req, res) => {
  try {
    await autoExpire(); // make sure expired consents are updated

    const query = `
      UPDATE consents
      SET status = 'REJECTED'
      WHERE id = ? AND patient_id = ? AND status = 'APPROVED' AND end_time > NOW()
    `;

    db.query(query, [req.params.id, req.user.id], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res.status(400).json({ message: "Cannot cancel: consent expired or invalid" });
      res.json({ message: "Consent cancelled before expiry" });
    });
  } catch (err) {
    res.status(500).json({ message: "Cancel failed", error: err });
  }
};

export const revokeConsent = (req, res) => {
  const query = `
    UPDATE consents
    SET 
      status = 'APPROVED',
      end_time = DATE_ADD(NOW(), INTERVAL 1 DAY)
    WHERE id = ?
      AND patient_id = ?
      AND status = 'EXPIRED'
  `;

  db.query(query, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Revoke not allowed" });
    }

    res.json({ message: "Consent reactivated" });
  });
};
