import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { modifyInfo } from "../controllers/info.controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Specify the folder where uploaded images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

// Route to modify user information
router.put("/", verifyToken, modifyInfo);
router.put("/modify-info", upload.single("img"), modifyInfo);

export default router;
