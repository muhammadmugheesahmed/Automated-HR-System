// backend/routes/candidateRoutes.js

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import { createCandidate,shortlistCandidates,rankResumes } from "../controller/candidateController.js";  // ✅ Controller Import

const router = express.Router();

// Ensure 'uploads/resumes' folder exists
const uploadPath = "uploads/resumes/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // ✅ Save uploaded file with original name
  }
});

// File filter to accept only PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    //"application/pdf"
    "application/msword"
    //"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only DOCX files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Route: Form Submission + Resume Upload
router.post("/form", upload.single("resume"), createCandidate);
router.post("/shortlist", shortlistCandidates);
router.post("/rank", rankResumes);

export default router;
