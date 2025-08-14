const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// ➕ Create Employee (with random password, send email)
const bcrypt = require("bcryptjs");
const { EmailClient } = require("@azure/communication-email");
const fs = require("fs");
const path = require("path");

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, address, qualification, dateOfJoining, role } =
      req.body;
    // Generate random password
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const employee = new Employee({
      name,
      phone,
      email,
      address,
      qualification,
      dateOfJoining,
      password: hashedPassword,
      role: role || "employee",
    });
    await employee.save();

    // Send user creation email using employeeRegistrationTemplate.html
    const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
    const emailClient = new EmailClient(connectionString);
    const templatePath = path.join(
      __dirname,
      "../employeeRegistrationTemplate.html"
    );
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    htmlTemplate = htmlTemplate
      .replace(/{{name}}/g, name)
      .replace(/{{email}}/g, email)
      .replace(/{{password}}/g, randomPassword);

    const emailMessage = {
      senderAddress:
        "DoNotReply@5086a98d-0c75-4bc7-8628-2e2cf90dca53.azurecomm.net",
      content: {
        subject: "ASR Excellix: Your Employee Account Created",
        plainText: `Your account has been created.\nEmail: ${email}\nPassword: ${randomPassword}`,
        html: htmlTemplate,
      },
      recipients: {
        to: [{ address: email }],
      },
    };
    await emailClient.beginSend(emailMessage);

    res.status(201).json({ ...employee.toObject(), password: undefined });
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

// � Update Employee Role Only
router.patch("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!["employee", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role value" });
    }
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// �📄 Get One Employee
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

// 🔄 Update Employee Role Only
router.patch("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!["employee", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role value" });
    }
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
