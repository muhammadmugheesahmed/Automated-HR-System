import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import employeeRoutes from "./routes/employeeRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import cors from "cors";
import axios from "axios"; // Import axios for API requests
dotenv.config({path:"./config/config.env"});

const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Connect to Mongo Atlas using your connection string from the .env file
const CHATBOT_API_URL = "http://127.0.0.1:5000/chatbot"; // Flask API URL

// Chatbot API Endpoint in MERN Backend
app.post("/api/chatbot", async (req, res) => {
  try {
    const userQuery = req.body.query;
    const response = await axios.post(CHATBOT_API_URL, { query: userQuery });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Chatbot service unavailable." });
  }
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/webapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mount employee routes under /api/employee
app.use("/api/employee", employeeRoutes);
// Mount candidate routes under /api/candidates
app.use("/api/candidates", candidateRoutes);

// If you're storing resume files, serve them as static assets
import path from "path";
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Global error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🔥 MERN backend running on http://127.0.0.1:${PORT}`));
