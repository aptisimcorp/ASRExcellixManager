const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// ➕ Create Employee
router.post("/", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get All Employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get One Employee
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.json(employee);
  } catch (err) {
    res.status(404).json({ error: "Employee not found" });
  }
});

// ✏️ Update Employee
router.put("/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete Employee
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get All Employee Names (Ascending)
router.get("/names/all", async (req, res) => {
  try {
    const employees = await Employee.find({}, { name: 1, _id: 0 }).sort({
      name: 1,
    });
    res.json(employees.map((e) => e.name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
