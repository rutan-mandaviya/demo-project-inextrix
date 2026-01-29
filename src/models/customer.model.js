// models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  fullName: String,
  dateOfBirth: Date,
  email: String,
  panCard: String,
  photo: String,
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  kycStatus: { type: String, default: "pending",enum:['pending',"approved",'rejected'] },
  status: { type: String, default: "active" ,enum:['active','blocked']},
  kycStatusUpdatedAt: Date,
  kycApprovedAt: Date,
  kycRejectedAt: Date,
  kycRejectedReason: String,


}, { timestamps: true });

export const customerModel= mongoose.model("Customer", customerSchema);

