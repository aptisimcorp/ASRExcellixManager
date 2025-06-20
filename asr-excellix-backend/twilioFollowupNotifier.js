require("dotenv").config();
const mongoose = require("mongoose");
const Candidate = require("./models/Candidate");
// Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function sendWhatsAppReminders() {
  const now = new Date();
  const in15 = new Date(now.getTime() + 15 * 60000);
  // Find candidates with a conversation scheduled in the next 15 minutes
  const candidates = await Candidate.find({
    conversationHistory: {
      $elemMatch: {
        date: { $gte: now, $lte: in15 },
      },
    },
  });

  for (const candidate of candidates) {
    // Find the soonest conversation in the next 15 min
    const nextConv = candidate.conversationHistory.find(
      (c) => c.date >= now && c.date <= in15
    );
    if (!nextConv) continue;
    // Send WhatsApp message
    alert("Sending WhatsApp reminder to candidate:", candidate.name);
    await client.messages.create({
      from: "whatsapp:+14155238886",
      contentSid: "HX350d429d32e64a552466cafecbe95f3c",
      contentVariables: JSON.stringify({
        1: `${candidate.name} (${candidate.phone})`,
        2: new Date(nextConv.date).toLocaleString(),
      }),
      to: `whatsapp:${candidate.phone}`, // Make sure phone is in E.164 format
    });
    console.log(
      `WhatsApp sent to ${candidate.name} for follow-up at ${nextConv.date}`
    );
  }
}

sendWhatsAppReminders().then(() => mongoose.disconnect());
