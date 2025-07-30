const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  qualification: { type: String },
  dateOfJoining: { type: Date },
  password: { type: String, required: true }, // hashed password
  role: { type: String, default: "employee" }, // admin/employee
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);
