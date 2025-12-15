import express from "express";
import { register, login, getPatients } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/patients", authenticate, getPatients);

export default router;
