import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent, confirm, submitMission } from "../controllers/order.controller.js";


const router = express.Router();

// router.post("/:missionId", verifyToken, createOrder);
router.get("/:id", getOrders);
router.post("/submit-mission/:id", verifyToken, submitMission);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.put("/", verifyToken, confirm);

export default router;
