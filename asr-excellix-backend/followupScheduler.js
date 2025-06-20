const mongoose = require("mongoose");
const Candidate = require("./models/Candidate");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function sendWhatsAppReminders() {
  const now = new Date();
  const in15 = new Date(now.getTime() + 15 * 60000);
  const candidates = await Candidate.find({
    conversationHistory: {
      $elemMatch: {
        date: { $gte: now, $lte: in15 },
      },
    },
  });

  for (const candidate of candidates) {
    const nextConv = candidate.conversationHistory.find(
      (c) => c.date >= now && c.date <= in15
    );
    if (!nextConv) continue;
    await client.messages.create({
      from: "whatsapp:+14155238886",
      contentSid: process.env.TWILIO_CONTENT_SID,
      contentVariables: JSON.stringify({
        1: `${candidate.name} (${candidate.phone})`,
        2: new Date(nextConv.date).toLocaleString(),
      }),
      to: `whatsapp:${candidate.phone}`,
    });
    console.log(
      `WhatsApp sent to ${candidate.name} for follow-up at ${nextConv.date}`
    );
  }
}

module.exports = function startFollowupScheduler() {
  // Run every 15 minutes
  sendWhatsAppReminders();
  setInterval(sendWhatsAppReminders, 15 * 60 * 1000);
};
