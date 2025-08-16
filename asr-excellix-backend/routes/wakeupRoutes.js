const express = require("express");
const router = express.Router();
const WakeupLog = require("../models/WakeupLog");

// GET /api/wakeup - Scheduler keep-alive endpoint
router.get("/", async (req, res) => {
  try {
    await WakeupLog.create({ message: "I am alive", timestamp: new Date() });
    res.json({ status: "alive", time: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
