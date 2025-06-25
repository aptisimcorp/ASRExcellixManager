const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// POST /api/employees/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  // For first time, password is always 'password'
  if (password !== "password") {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  const employee = await Employee.findOne({ email });
  if (!employee) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  // You can add JWT or session logic here for real auth
  res.json({
    message: "Login successful!",
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
    },
  });
});

module.exports = router;
