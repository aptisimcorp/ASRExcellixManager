const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  discussion: { type: String },
  date: { type: Date, default: Date.now },
  FollowUpSent: { type: Boolean, default: false },
});

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  skills: [String],
  location: { type: String },
  status: { type: String, default: "Looking" }, // e.g. Looking, Placed, Not Interested
  resumeLink: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  conversationHistory: [conversationSchema],
  completed: { type: Boolean, default: false }, // true if candidate is marked complete/closed
});

module.exports = mongoose.model("Candidate", candidateSchema);
