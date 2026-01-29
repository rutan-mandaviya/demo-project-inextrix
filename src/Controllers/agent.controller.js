import {agentModel} from "../models/agent.model.js"
import  bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../services/mailer.service.js";
export const registerAgent = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const isExist = await agentModel.findOne({ email });
    if (isExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = await agentModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Agent registered successfully",
      agent
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const loginAgent = async (req, res) => {
  const { email } = req.body;

  const agent = await agentModel.findOne({ email });
  if (!agent) return res.status(404).json({ message: "Agent not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  agent.otp = otp;
  agent.otpExpires = Date.now() + 5 * 60 * 1000;
  await agent.save();

  await transporter.sendMail({
    to: email,
    subject: "Your Login OTP",
    text: `Your OTP is ${otp}`
  });

  res.status(200).json({ message: "OTP sent" });
};

// Controllers/agent.controller.js



export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const agent = await agentModel.findOne({ email });
  if (!agent) return res.status(404).json({ message: "Agent not found" });

  if (agent.otp !== otp || agent.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }


  
const accessToken = jwt.sign(
  { agentId: agent._id },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);

const refreshToken = jwt.sign(
  { agentId: agent._id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: "7d" }
);

  agent.otp = null;
  agent.otpExpires = null;
  agent.refreshToken = refreshToken;
  await agent.save();
res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 15 * 60 * 1000
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

  res.status(200).json({ message: "Login successful", accessToken });
};
export const logoutAgent = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const agent = await agentModel.findOne({ refreshToken });
      if (agent) {
        agent.refreshToken = null; // remove from DB
        await agent.save();
      }
    }

    // Clear cookies from browser
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict"
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict"
    });

    res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const agent = await agentModel.findById(decoded.agentId);
    if (!agent || agent.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { agentId: agent._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({ message: "Access token refreshed" });

  } catch (err) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};

export const getMe = async (req, res) => {
  try {
    let agent = req.agent;
    if (!agent) return res.status(401).json({ message: "Not authenticated" });

    // If middleware attached only the id (string or ObjectId), fetch full agent
  
    const fullAgent = await agentModel.findById(agent._id).select("-password -otp -otpExpires -refreshToken");
    
  

    res.status(200).json({ message: "Agent details fetched", agent: fullAgent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




