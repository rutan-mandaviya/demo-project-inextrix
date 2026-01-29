import fs from "fs";
import path from "path";
import { customerModel } from "../models/customer.model.js";


// ================= CREATE CUSTOMER =================
export const createCustomer = async (req, res) => {
  try {
    const { fullName, dateOfBirth, email } = req.body;
    const agentId = req.agent._id;

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const photoPath = req.files?.photo
      ? `${baseUrl}/${req.files.photo[0].path.replace(/\\/g, "/")}`
      : "";

    let panBase64 = null;
    if (req.files?.panCard) {
      const panFile = req.files.panCard[0];
      const fileData = fs.readFileSync(panFile.path);
      panBase64 = `data:${panFile.mimetype};base64,${fileData.toString("base64")}`;
    }

    const customer = await customerModel.create({
      fullName,
      dateOfBirth,
      email,
      photo: photoPath,
      panCard: panBase64,
      agentId
    });

    res.status(201).json({ message: "Customer created", customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= DELETE CUSTOMER =================
export const deleteCustomer = async (req, res) => {
  try {
    const { customerID } = req.params;

    const customer = await customerModel.findOne({
      _id: customerID,
      agentId: req.agent._id
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Helper to delete file safely
    const deleteFile = async (filePath) => {
      if (!filePath) return;

      // Agar full URL stored hai to usse relative path nikalo
      const relativePath = filePath.includes("http")
        ? filePath.split(req.get("host") + "/")[1]
        : filePath;

      const absolutePath = path.join(process.cwd(), relativePath);

      try {
        await fs.promises.access(absolutePath);
        await fs.promises.unlink(absolutePath);
        console.log("Deleted:", absolutePath);
      } catch (err) {
        console.log("File not found or already deleted:", absolutePath);
      }
    };

    // Delete photo
    await deleteFile(customer.photo);

    // Delete PAN file (if you store path instead of base64)
    await deleteFile(customer.panCard);

    await customer.deleteOne();

    res.json({ message: "Customer and files deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= GET ALL CUSTOMERS =================
export const getallCustomers = async (req, res) => {
  const allCustomer = await customerModel.find({ agentId: req.agent._id });
  res.status(200).json({ msg: "fetch all customers", allCustomer });
};


// ================= GET SINGLE CUSTOMER =================
export const getsingleCustomer = async (req, res) => {
  const { id } = req.params;

  const customer = await customerModel.findOne({
    _id: id,
    agentId: req.agent._id
  });

  if (!customer) return res.status(404).json({ message: "Not found" });

  res.json(customer);
};


// ================= GET PENDING KYC =================
export const getpendingkyc = async (req, res) => {
  const pendingKYC = await customerModel.find({
    kycStatus: "pending",
    agentId: req.agent._id
  });

  if (pendingKYC.length === 0)
    return res.status(404).json({ message: "No pending KYC" });

  res.status(200).json({ pendingKYC });
};


// ================= APPROVE KYC =================
export const approveKyc = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.agent)
    const customer = await customerModel.findOne({
      _id: id,
      agentId: req.agent._id
    });
    console.log(customer)

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    if (customer.kycStatus === "approved")
      return res.status(400).json({ message: "Already approved" });

    const now = new Date();

    customer.kycStatus = "approved";
    customer.kycApprovedAt = now;
    customer.kycStatusUpdatedAt = now;
  

    await customer.save();

    res.json({ message: "KYC Approved", customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= REJECT KYC =================
export const rejectKyc = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason)
      return res.status(400).json({ message: "Reason required" });

    const customer = await customerModel.findOne({
      _id: id,
      agentId: req.agent._id
    });

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const now = new Date();

    customer.kycStatus = "rejected";
    customer.kycRejectedAt = now;
    customer.kycRejectedReason = reason;
    customer.kycStatusUpdatedAt = now;
  

    await customer.save();

    res.json({ message: "KYC Rejected", customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= BLOCK CUSTOMER =================
export const blockCustomer = async (req, res) => {
  const { id } = req.params;
console.log("first",req.agent)
  const customer = await customerModel.findOne({
    _id: id,
    agentId: req.agent._id
  });

  if (!customer)
    return res.status(404).json({ message: "Customer not found" });

  customer.status = "blocked";
  await customer.save();

  res.json({ message: "Customer blocked", customer });
};


// ================= ACTIVATE CUSTOMER =================
export const activeCustomer = async (req, res) => {
  const { id } = req.params;

  const customer = await customerModel.findOne({
    _id: id,
    agentId: req.agent._id
  });

  if (!customer)
    return res.status(404).json({ message: "Customer not found" });

  customer.status = "active";
  await customer.save();

  res.json({ message: "Customer activated", customer });
};
