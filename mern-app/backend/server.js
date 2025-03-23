import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import employeeRoutes from "./routes/employeeRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import cors from "cors";
dotenv.config({path:"./config/config.env"});

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Connect to Mongo Atlas using your connection string from the .env file
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
