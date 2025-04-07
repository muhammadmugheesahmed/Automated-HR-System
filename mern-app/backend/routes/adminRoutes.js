import express from "express";
import { loginAdmin } from "../controller/adminController.js";

const router = express.Router();

// POST /api/admin/login

router.post("/login", (req, res, next) => {
    console.log("➡️ Reached /api/admin/login route");
    next();
  }, loginAdmin);
  
export default router;
