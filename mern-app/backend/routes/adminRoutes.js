import express from "express";
import { loginAdmin ,sendInterviewEmails} from "../controller/adminController.js";

const router = express.Router();

// POST /api/admin/login

router.post("/login", (req, res, next) => {
    console.log("➡️ Reached /api/admin/login route"); next();  }, loginAdmin);
  
router.post("/send-interview-email", sendInterviewEmails);  
export default router;

// backend/routes/adminRoutes.js




