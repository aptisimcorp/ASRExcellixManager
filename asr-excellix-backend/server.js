// Test email endpoint for debugging Render.com email issues
const { EmailClient } = require("@azure/communication-email");
const fs = require("fs");
const path = require("path");

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

app.post("/api/test-email", async (req, res) => {
  try {
    const to = req.body.email || process.env.TEST_EMAIL_TO;
    if (!to)
      return res.status(400).json({ error: "No recipient email provided." });
    const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
    const emailClient = new EmailClient(connectionString);
    const templatePath = path.join(__dirname, "./forgotPasswordTemplate.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    htmlTemplate = htmlTemplate
      .replace(/{{name}}/g, "Test User")
      .replace(/{{email}}/g, to)
      .replace(/{{newPassword}}/g, "test1234");
    const emailMessage = {
      senderAddress:
        "DoNotReply@5086a98d-0c75-4bc7-8628-2e2cf90dca53.azurecomm.net",
      content: {
        subject: "ASR Excellix: Test Email",
        plainText: `This is a test email to ${to}`,
        html: htmlTemplate,
      },
      recipients: {
        to: [{ address: to }],
      },
    };
    const poller = await emailClient.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    console.log("Test email result:", result);
    res.json({ message: "Test email sent.", result });
  } catch (err) {
    console.error("Test email error:", err);
    res.status(500).json({ error: err.message || err.toString() });
  }
});
