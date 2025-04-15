import Employee from "../models/Employee.js";

export const loginEmployee = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the employee by email (Done)
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
// CREATE Employee
export const createEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await Employee.findOne({ email });
    if (existing) return res.status(400).json({ error: "Employee already exists" });

    const newEmployee = new Employee({ email, password });
    await newEmployee.save();
    res.status(201).json({ message: "Employee created", newEmployee });
  } catch (error) {
    res.status(500).json({ error: "Error creating employee" });
  }
};

// READ All Employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Error fetching employees" });
  }
};

// UPDATE Employee Password
export const updateEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const updated = await Employee.findOneAndUpdate(
      { email },
      { password },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Employee not found" });
    res.status(200).json({ message: "Password updated", updated });
  } catch (error) {
    res.status(500).json({ error: "Error updating employee" });
  }
};

// DELETE Employee by Email
export const deleteEmployee = async (req, res) => {
  try {
    const { email } = req.body;
    const deleted = await Employee.findOneAndDelete({ email });
    if (!deleted) return res.status(404).json({ error: "Employee not found" });
    res.status(200).json({ message: "Employee deleted", deleted });
  } catch (error) {
    res.status(500).json({ error: "Error deleting employee" });
  }
};
