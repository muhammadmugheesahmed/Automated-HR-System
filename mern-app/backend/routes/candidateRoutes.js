import express from "express";
import multer from "multer";
import path from "path";
import { createCandidate } from "../controller/candidateController.js";  // ✅ Named Import

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  }
});

// File filter to accept only PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only PDF and DOC files are allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ✅ Use function directly in route
router.post("/form", upload.single("resume"), createCandidate); 

export default router;
