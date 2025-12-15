import express from "express";
import { authenticate } from "../middleware/auth.js";
import { createConsent, getHospitalConsents, getPatientConsents, approveConsent, rejectConsent } from "../controllers/consentController.js";

const router = express.Router();

router.post("/create", authenticate, createConsent);
router.get("/hospital", authenticate, getHospitalConsents);
router.get("/patient", authenticate, getPatientConsents);
router.put("/approve/:id", authenticate, approveConsent);
router.put("/reject/:id", authenticate, rejectConsent);

export default router;
