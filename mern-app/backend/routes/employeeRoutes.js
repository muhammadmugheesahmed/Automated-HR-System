import express from "express";
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
} from "../controller/employeeController.js";

const router = express.Router();

router.post("/login", loginEmployee);
router.post("/create", createEmployee);
router.get("/all", getAllEmployees);
router.put("/update", updateEmployee);
router.delete("/delete", deleteEmployee);

export default router;
