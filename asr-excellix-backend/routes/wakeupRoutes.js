const express = require("express");
const router = express.Router();
const WakeupLog = require("../models/WakeupLog");
const { getISTDate, toISTISOString } = require("../utils/date");

// GET /api/wakeup - Scheduler keep-alive endpoint
router.get("/", async (req, res) => {
  try {
    await WakeupLog.create({ message: "I am alive", timestamp: getISTDate() });
    res.json({ status: "alive", time: toISTISOString(getISTDate()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
