import express from "express";
import {
  createMission,
  deleteMission,
  getMission,
  getMissions
} from "../controllers/mission.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createMission);
router.delete("/:id", verifyToken, deleteMission);
router.get("/single/:id", getMission);
router.get("/", getMissions);


export default router;
