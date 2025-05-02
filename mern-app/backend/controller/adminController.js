import Admin from "../models/admin.js";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' });

export const loginAdmin = async (req, res, next) => {
  try {
    console.log("🔥 Inside loginAdmin handler");
    const { email, password } = req.body;
    console.log("📨 Received credentials:", email, password);

    const admin = await Admin.findOne({ email });
    console.log("🔍 Admin found:", admin);

    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", admin });
  } catch (error) {
    console.log("❌ Error in loginAdmin:", error);
    next(error);
  }
};
// backend/controller/adminController.js
 
export const sendInterviewEmails = async (req, res) => {
  try {

    console.log('Email:', process.env.EMAIL);
    console.log('Pass:', process.env.EMAIL_PASS ? 'Present' : 'Missing');


    const candidates = req.body.candidates; // array of objects: { name, email }

    const flattened = candidates.map(c => {
      return c.candidate_name
        ? {
            name: c.candidate_name.candidate_name,
            email: c.candidate_name.email,
          }
        : c;
    });

    if (!candidates || candidates.length === 0) {
      return res.status(400).json({ error: 'No candidates provided' });
    }

    console.log("Received candidates:", candidates);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const candidate of flattened) {

      console.log("Sending email to:", candidate.name, candidate.email);

      if (!candidate.email) {
        console.warn(`Skipping candidate with missing email:`, candidate); 
        continue;
      }
      const mailOptions = {
        from: process.env.EMAIL,
        to: candidate.email,
        subject: 'Interview Invitation',
        text: `Dear ${candidate.name},\n\nYou have been shortlisted for an interview. Please reply to schedule a time.\n\nBest regards,\nHR Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${candidate.email}`);
    }

    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send emails', error });
  }
};

