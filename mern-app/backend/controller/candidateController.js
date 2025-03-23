import Candidate from "../models/candidateschema.js";


export const createCandidate = async (req, res) => {
    try {
      console.log("Received Data:", req.body);
      console.log("Uploaded File:", req.file);  // 🔍 Debugging log
  
      const { name, email, qualification, gender, position } = req.body;
      if (!name || !email || !qualification || !gender || !position) {
        return res.status(400).json({ success: false, error: "All fields are required!" });
      }
  
      let resumePath = req.file ? req.file.path : "";  // Check if req.file exists
  
      const candidate = new Candidate({
        name,
        email,
        qualification,
        gender,
        position,
        resume: resumePath
      });
  
      await candidate.save();
  
      res.status(201).json({ success: true, candidate });
    } catch (error) {
      console.error("Error creating candidate:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
  