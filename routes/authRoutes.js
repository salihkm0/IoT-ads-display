import express from "express";
import { registerUser } from "../controllers/authControllers/registerUser.js";
import { loginUser } from "../controllers/authControllers/loginUser.js";
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/authControllers/userProfile.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/profile", protect, getUserProfile);

export default authRoutes;
