import express from "express";
//import { verifyToken } from "../middleware/jwt.js";
import { modifyInfo } from "../controllers/info.controller.js";

const router = express.Router();

// Route to modify user information
router.put("/modify-info", modifyInfo);

export default router;
