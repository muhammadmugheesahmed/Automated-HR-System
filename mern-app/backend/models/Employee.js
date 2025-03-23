import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { // In production, store a hashed password!
    type: String,
    required: true
  }
});

export default mongoose.model("Employee", EmployeeSchema);
