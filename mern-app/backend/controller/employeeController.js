import Employee from "../models/Employee.js";

export const loginEmployee = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the employee by email
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ error: "Employee not found" });
    }

    // Compare passwords (plain text for demonstration purposes)
    if (employee.password !== password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Successful login – you might return a JWT token in production.
    res.status(200).json({ message: "Login successful", employee });
  } catch (error) {
    next(error);
  }
};
