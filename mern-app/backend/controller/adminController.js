import Admin from "../models/admin.js";

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

