// routes/customer.routes.js
import express from "express";
const router = express.Router();
import { createCustomer,deleteCustomer,getallCustomers ,getsingleCustomer,getpendingkyc,approveKyc,rejectKyc,activeCustomer,blockCustomer} from "../Controllers/customer.controller.js";
import { protectAgent } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";


/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management & KYC APIs
 */


/**
 * @swagger
 * /customers/create:
 *   post:
 *     summary: Create new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *             properties:
 *               fullName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *               panCard:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Customer created successfully
 */

router.post(
  "/create",
  protectAgent,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "panCard", maxCount: 1 }
  ]),
  createCustomer
);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers of logged-in agent
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 */

router.get('/',protectAgent,getallCustomers)
/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get single customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details
 */

router.get('/:id',protectAgent,getsingleCustomer)
/**
 * @swagger
 * /customers/kyc/pending:
 *   get:
 *     summary: Get pending KYC customers
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending KYC list
 */

router.get('/kyc/pending',protectAgent,getpendingkyc)
/**
 * @swagger
 * /customers/{id}/kyc/approve:
 *   patch:
 *     summary: Approve customer KYC
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KYC approved
 */



router.patch('/:id/kyc/approve',protectAgent,approveKyc,)
/**
 * @swagger
 * /customers/{id}/kyc/reject:
 *   patch:
 *     summary: Reject customer KYC
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KYC rejected
 */

router.patch('/:id/kyc/reject',protectAgent,rejectKyc,)

/**
 * @swagger
 * /customers/{id}/block:
 *   patch:
 *     summary: Block customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer blocked
 */

 /**
 * @swagger
 * /customers/{id}/activate:
 *   patch:
 *     summary: Activate customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer activate
 */



router.patch("/:id/block", protectAgent, blockCustomer);


router.patch("/:id/activate", protectAgent, activeCustomer);
/**
 * @swagger
 * /customers/delete/{customerID}:
 *   delete:
 *     summary: Delete customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerID   # ✅ SAME NAME AS ROUTE
 *         required: true
 *         schema:
 *           type: string
 *         example: 68cbd69c37b7f12ee580f1a0
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       400:
 *         description: Invalid Customer ID
 *       404:
 *         description: Customer not found
 */

router.delete('/delete/:customerID',protectAgent,deleteCustomer)
export default router;
