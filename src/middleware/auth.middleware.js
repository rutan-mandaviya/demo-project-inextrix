// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { agentModel } from "../models/agent.model.js";

export const protectAgent = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie or Authorization header
    const token = req.cookies.accessToken || req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized, token missing" });

    // 2️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Access token expired, use refresh token" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    // 3️⃣ Fetch agent from DB
    const agent = await agentModel.findById(decoded.agentId);
    if (!agent) return res.status(401).json({ message: "Agent not found" });

    // 4️⃣ Attach agent to request
    req.agent = agent;
    next();

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
