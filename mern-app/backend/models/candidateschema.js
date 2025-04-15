import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    qualification: {
      type: String,
      required:true
    },
    gender: {
      type: String,
      required:true
    },
    position: {
      type: String,
      required: true
    },
    // Save resume file path
    resume: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate; // ✅ Use ES module export
