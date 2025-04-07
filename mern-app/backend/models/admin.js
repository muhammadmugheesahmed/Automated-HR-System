import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
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

export default mongoose.model("Admin", AdminSchema);
