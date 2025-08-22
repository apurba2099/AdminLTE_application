import express from "express";
import { register, login } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getProfile } from "../controller/authController.js";

const router = express.Router();

//---Public routes (no auth required)----//
//POST /api/auth/register
router.post("/register", register);
//POST /api/auth/login
router.post("/login", login);

//---Protected route (auth required)---//
router.get("/profile", authMiddleware, getProfile);
export default router;
