import { Router } from "express";
import { signup, login, refreshToken, logout } from "../controllers/authController";

const router = Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;