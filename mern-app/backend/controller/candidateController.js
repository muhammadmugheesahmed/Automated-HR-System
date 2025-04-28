import Candidate from "../models/candidateschema.js";
import { exec } from 'child_process';
import path from 'path';


// Your existing createCandidate function (UNCHANGED)
export const createCandidate = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    console.log("Uploaded File:", req.file);

    const { name, email, qualification, gender, position } = req.body;

    if (!name || !email || !qualification || !gender || !position) {
      return res.status(400).json({ success: false, error: "All fields are required!" });
    }

    if (!req.file || !req.file.originalname) {
      return res.status(400).json({ success: false, error: "Resume file is required!" });
    }

    const resumeFilename = req.file.originalname; // ✅ Save user's original file name

    const candidate = new Candidate({
      name,
      email,
      qualification,
      gender,
      position,
      resume: resumeFilename
    });

    await candidate.save();

    res.status(201).json({ success: true, candidate });
  } catch (error) {
    console.error("Error creating candidate:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
// Shortlist Candidates Controller
// Shortlist Candidates Controller
export const shortlistCandidates = (req, res) => {
  const { jobDescription, topN } = req.body;
  const scriptPath = path.join(process.cwd(), 'score_resumes.py');

  // Escape any double-quotes in the job description
  const escapedJD = jobDescription.replace(/"/g, '\\"');
  const n         = parseInt(topN, 10) || 1;

  const cmd = `python3 ${scriptPath} "${escapedJD}" ${n}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running Python script: ${error.message}`);
      return res
        .status(500)
        .json({ success: false, message: 'Shortlisting failed!' });
    }
    if (stderr) {
      console.error(`Python stderr: ${stderr}`);
      return res
        .status(500)
        .json({ success: false, message: 'Shortlisting failed!' });
    }
    try {
      const candidates = JSON.parse(stdout);
      return res.status(200).json(candidates);
    } catch (parseError) {
      console.error(`Error parsing Python output: ${parseError.message}`);
      return res
        .status(500)
        .json({ success: false, message: 'Failed to parse results!' });
    }
  });
};
