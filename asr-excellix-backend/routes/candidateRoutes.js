const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

// Convert date to IST ISO string
function toISTISOString(date) {
  const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  const pad = (n) => (n < 10 ? "0" + n : n);
  return (
    istDate.getFullYear() +
    "-" +
    pad(istDate.getMonth() + 1) +
    "-" +
    pad(istDate.getDate()) +
    "T" +
    pad(istDate.getHours()) +
    ":" +
    pad(istDate.getMinutes()) +
    ":" +
    pad(istDate.getSeconds()) +
    "+05:30"
  );
}

// ✅ Mark Candidate as Complete/Closed
router.patch("/:id/complete", async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➕ Create Candidate
router.post("/", async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get All Candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get One Candidate
router.get("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    res.json(candidate);
  } catch (err) {
    res.status(404).json({ error: "Candidate not found" });
  }
});

// ✏️ Update Candidate
router.put("/:id", async (req, res) => {
  try {
    const updated = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🗨️ Get Conversation History for a Candidate
router.get("/:id/conversations", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found" });
    res.json(candidate.conversationHistory || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add a Conversation to a Candidate
router.post("/:id/conversations", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found" });
    // Convert date to IST ISO string before saving
    if (req.body.date) {
      req.body.date = toISTISOString(new Date(req.body.date));
    }
    candidate.conversationHistory.push(req.body);
    await candidate.save();
    res.status(201).json(candidate.conversationHistory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✏️ Update a Conversation in a Candidate's History
router.put("/:id/conversations/:convId", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found" });
    const conv = candidate.conversationHistory.id(req.params.convId);
    if (!conv) return res.status(404).json({ error: "Conversation not found" });
    conv.employeeName = req.body.employeeName;
    conv.discussion = req.body.discussion;
    if (req.body.date) {
      conv.date = toISTISOString(new Date(req.body.date));
    }
    await candidate.save();
    res.json(conv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🕒 Get Candidates with Pending Follow-up for Today
router.get("/followups/today", async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    // Find candidates with at least one followup today
    let candidates = await Candidate.find({
      conversationHistory: {
        $elemMatch: {
          date: { $gte: start, $lte: end },
        },
      },
    }).lean();
    // For each candidate, find the soonest followup today
    candidates = candidates.map((c) => {
      const todayConvs = (c.conversationHistory || []).filter(
        (conv) => conv.date >= start && conv.date <= end
      );
      todayConvs.sort((a, b) => new Date(a.date) - new Date(b.date));
      return {
        ...c,
        nextFollowup: todayConvs.length ? todayConvs[0].date : null,
      };
    });
    // Sort candidates by nextFollowup ascending
    candidates.sort(
      (a, b) => new Date(a.nextFollowup) - new Date(b.nextFollowup)
    );
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
