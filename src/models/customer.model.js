// models/Customer.js
import mongoose from "mongoose";
import { KYC_STATUS, CUSTOMER_STATUS } from "../constants/customerStatus.js";

const customerSchema = new mongoose.Schema({
  fullName: String,
  dateOfBirth: Date,
  email: String,
  panCard: String,
  photo: String,
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  kycStatus: { 
    type: String, 
    default: KYC_STATUS.PENDING,
    enum: Object.values(KYC_STATUS) 
  },
  status: { 
    type: String, 
    default: CUSTOMER_STATUS.ACTIVE,
    enum: Object.values(CUSTOMER_STATUS)
  },
  kycStatusUpdatedAt: Date,
  kycApprovedAt: Date,
  kycRejectedAt: Date,
  kycRejectedReason: String,


}, { timestamps: true });

export const customerModel= mongoose.model("Customer", customerSchema);

