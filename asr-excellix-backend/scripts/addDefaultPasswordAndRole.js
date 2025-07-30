// Script to update existing Employee records with default password and role
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Employee = require("../models/Employee");

async function updateEmployees() {
  await mongoose.connect(process.env.MONGO_URI);
  const employees = await Employee.find({});
  const defaultPassword = "123456";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  let updatedCount = 0;
  for (const emp of employees) {
    let changed = false;
    if (!emp.password) {
      emp.password = hashedPassword;
      changed = true;
    }
    if (!emp.role) {
      emp.role = "employee";
      changed = true;
    }
    if (changed) {
      await emp.save();
      updatedCount++;
    }
  }
  console.log(
    `Updated ${updatedCount} employee records with default password and role.`
  );
  mongoose.disconnect();
}

updateEmployees();
