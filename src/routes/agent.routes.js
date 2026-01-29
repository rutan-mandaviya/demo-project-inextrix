import express from "express";
const router = express.Router();
import { registerAgentValidator, loginAgentValidator } from "../middleware/validtor.middleware.js";
import { verifyOtp, registerAgent, loginAgent, logoutAgent, refreshAccessToken, getMe } from "../Controllers/agent.controller.js";
import { protectAgent } from "../middleware/auth.middleware.js";


/**
 * @swagger
 * tags:
 *   name: Agent Auth
 *   description: Agent authentication APIs
 */


/**
 * @swagger
 * /auth/agent/register:
 *   post:
 *     summary: Register new agent
 *     tags: [Agent Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agent registered successfully
 */
router.post("/register", registerAgentValidator, registerAgent);


/**
 * @swagger
 * /auth/agent/login:
 *   post:
 *     summary: Agent login
 *     tags: [Agent Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", loginAgentValidator, loginAgent);


/**
 * @swagger
 * /auth/agent/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Agent Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post("/verify-otp", verifyOtp);


/**
 * @swagger
 * /auth/agent/logout:
 *   get:
 *     summary: Logout agent
 *     tags: [Agent Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.get("/logout", protectAgent, logoutAgent);


/**
 * @swagger
 * /auth/agent/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Agent Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post("/refresh-token", refreshAccessToken);
/**
 * @swagger
 * /auth/agent/me:
 *   get:
 *     summary: Get current authenticated agent
 *     tags: [Agent Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agent details retrieved
 */
router.get("/me", protectAgent, getMe);

export default router;
