const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema({
  candidateName: String,
  candidatePhone: String,
  employeeName: String,
  employeeEmail: String,
  followUpDate: Date,
  status: String, // "sent" or "error"
  error: String, // error message if any
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EmailLog", emailLogSchema);
