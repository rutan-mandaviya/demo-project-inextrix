// models/Agent.js
import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  firstName: {
    type:String,
    required:true
  },
  lastName: {
    type:String,
    required:true
  },
  email: { type: String, unique: true },
  password: {
    type:String,
    required:true

  },
  otp: {type:String},
  otpExpires: Date,
  refreshToken: String,


  status: { type: String, default: "active",enum: ['active', 'inactive'] }
}, { timestamps: true });


export const agentModel=mongoose.model("Agent", agentSchema);
