const mongoose = require("mongoose");
const wakeupLog = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WakeupLog", wakeupLog);
