const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const errorMiddleware = require("./middleware/errormiddleware.js");
const candidateRoutes = require("./routes/candidateRoutes");

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/webapp", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected to Localhost"))
    .catch(err => console.log(err));

app.use("/api/candidates", candidateRoutes);
app.use(errorMiddleware);

module.exports = app;