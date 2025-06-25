const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const candidateRoutes = require("./routes/candidateRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const employeeAuthRoutes = require("./routes/employeeAuth");
require("./scheduler"); // Start the scheduler with logging

const app = express();
app.use(cors());
app.use(
  cors({
    origin: [
      "https://asr-excellix-manager.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/candidates", candidateRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employees", employeeAuthRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// Base Route
app.get("/", (req, res) => {
  res.send("🔗 ASR Excellix API is live");
});

// Port Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ASR Excellix backend running on port ${PORT}`);
});
