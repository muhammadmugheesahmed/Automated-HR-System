#!/home/aetisam/miniconda3/bin/python3
import Candidate from "../models/candidateschema.js";
import { exec,spawn } from 'child_process';
import path from 'path';
import { cwd } from "process";


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

// Shortlist Candidates Controller on Job Description
export const shortlistCandidates = (req, res) => {
  const { jobDescription, topN } = req.body;
  const scriptPath = path.join(process.cwd(), 'score_resumes.py');

  // Escape any double-quotes in the job description
  const escapedJD = jobDescription.replace(/"/g, '\\"');
  const n         = parseInt(topN, 10) || 1;

  const cmd = `python3 ${scriptPath} "${escapedJD}" ${n}`;
  console.log("Executing --> ",cmd);

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


// Shortlist Candidates Controller on Category
export const rankResumes = (req, res) => {
  const { category, topN } = req.body;
  const scriptPath = path.join(process.cwd(), 'rank_resumes.py');
  const resumeDir="./uploads/resumes"

  // Escape any double-quotes in the job description
  const escapedcat = category.replace(/"/g, '\\"');
  const n         = parseInt(topN, 10) || 1;

  
  const cmd = `python3 ${scriptPath} "${escapedcat}" ${n} ${resumeDir}`;


  console.log("Executing --> ", cmd);
    
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

// Shortlist Candidates Controller on Category

/*export const rankResumes = async (req, res) => {
  const { category, topN } = req.body;

  // Use the same name you run in shell:
  // either "rank_resumes.py" or "rank_resumes"
  
  const resumeDir  = "./uploads/resumes";
  const backendDir = path.resolve("backend");

  // Build the exact command you type in terminal
  const cmd = `python3 rank_resumes.py ${category} ${topN} ${resumeDir}`;
  console.log("Executing in backend/:", cmd);

  exec(cmd, {
    cwd: backendDir,   // run from backend folder
    shell: true,       // let bash/zsh/etc. resolve python3
    env: process.env   // inherit your login PATH
  }, (err, stdout, stderr) => {
    if (err) {
      console.error("Execution failed:", err);
      return res.status(500).json({ error: err.message });
    }

    // log non-fatal warnings
    if (stderr) console.warn("Python warnings:", stderr.trim());

    try {
      const data = JSON.parse(stdout);
      return res.json(data);
    } catch (parseErr) {
      console.error("JSON parse failed:", stdout);
      return res.status(500).json({ error: "Bad JSON", raw: stdout });
    }
  });
};*/
