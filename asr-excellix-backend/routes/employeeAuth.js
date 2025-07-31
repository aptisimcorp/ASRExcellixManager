// EmailErrorLog model for saving email errors
const mongoose = require("mongoose");
const emailErrorLogSchema = new mongoose.Schema({
  route: String,
  email: String,
  error: String,
  createdAt: { type: Date, default: Date.now },
});
const EmailErrorLog =
  mongoose.models.EmailErrorLog ||
  mongoose.model("EmailErrorLog", emailErrorLogSchema);
const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const { EmailClient } = require("@azure/communication-email");
const fs = require("fs");
const path = require("path");

// POST /api/employees/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  const employee = await Employee.findOne({ email });
  if (!employee) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  res.json({
    message: "Login successful!",
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
    },
  });
});

// POST /api/employees/change-password
router.post("/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const employee = await Employee.findOne({ email });
  if (!employee)
    return res.status(404).json({ message: "Employee not found." });
  const isMatch = await bcrypt.compare(oldPassword, employee.password);
  if (!isMatch)
    return res.status(401).json({ message: "Old password incorrect." });
  employee.password = await bcrypt.hash(newPassword, 10);
  await employee.save();
  res.json({ message: "Password updated successfully." });
});

// POST /api/employees/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const employee = await Employee.findOne({ email });
  if (!employee)
    return res.status(404).json({ message: "Employee not found." });

  // Generate new random password
  const newPassword = Math.random().toString(36).slice(-8);
  employee.password = await bcrypt.hash(newPassword, 10);
  await employee.save();

  // Send email with new password
  try {
    const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
    const emailClient = new EmailClient(connectionString);
    const templatePath = path.join(__dirname, "../forgotPasswordTemplate.html");

    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    htmlTemplate = htmlTemplate
      .replace(/{{name}}/g, employee.name)
      .replace(/{{email}}/g, employee.email)
      .replace(/{{newPassword}}/g, newPassword);

    const emailMessage = {
      senderAddress:
        "DoNotReply@5086a98d-0c75-4bc7-8628-2e2cf90dca53.azurecomm.net",
      content: {
        subject: "ASR Excellix: Password Reset",
        plainText: `Your password has been reset.\nEmail: ${email}\nNew Password: ${newPassword}`,
        html: htmlTemplate,
      },
      recipients: {
        to: [{ address: email }],
      },
    };
    await emailClient.beginSend(emailMessage);
    res.json({ message: "Password reset. Please check your email." });
  } catch (err) {
    console.error("Forgot password email error:", err);
    // Save error to MongoDB
    await EmailErrorLog.create({
      route: "/api/employees/forgot-password",
      email,
      error: err.message || err.toString(),
    });
    res
      .status(500)
      .json({
        message: "Failed to send reset email.",
        error: err.message || err.toString(),
      });
  }
});

module.exports = router;
