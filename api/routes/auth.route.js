import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { getOrders } from "../controllers/order.controller.js";
import { getGigs } from "../controllers/gig.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.get("/orders", authenticate, getOrders);
router.get("/mygigs", authenticate, getGigs);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;





   