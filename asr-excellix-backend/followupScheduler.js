const mongoose = require("mongoose");
const Candidate = require("./models/Candidate");
const Employee = require("./models/Employee");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const normalizePhone = (phone) => {
  // Add +91 by default if no + is present
  if (!phone.startsWith("+")) {
    return `+91${phone}`;
  }
  return phone;
};

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

    // Find the employee by name
    const employee = await Employee.findOne({ name: nextConv.employeeName });
    const toNumber = `whatsapp:${normalizePhone(employee.phone)}`;
    // Optionally, still send to candidate as before
    // await client.messages.create({
    //   messagingServiceSid: "MGd6c4f9dcd0135ff259615c0e9c19dae3",
    //   contentSid: process.env.TWILIO_CONTENT_SID,
    //   contentVariables: JSON.stringify({
    //     1: ` ${candidate.name}`,
    //     2: `${candidate.phone}`,
    //     3: new Date(nextConv.date).toLocaleString(),
    //   }),
    //   to: toNumber,
    // });

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        from: "whatsapp:+14155238886",
        contentSid: process.env.TWILIO_CONTENT_SID2,
        //contentVariables: '{"1":"12/1","2":"3pm"}',
        contentVariables: JSON.stringify({
          1: ` ${candidate.name}`,
          2: `${candidate.phone}`,
          3: new Date(nextConv.date).toLocaleString(),
        }),
        to: "whatsapp:+919616647311",
      })
      .then((message) => console.log(message.sid));

    console.log(
      `WhatsApp sent to ${candidate.name}, ${employee.phone} for follow-up at ${nextConv.date}`
    );
  }
}

module.exports = function startFollowupScheduler() {
  // Run every 15 minutes
  sendWhatsAppReminders();
  setInterval(sendWhatsAppReminders, 15 * 60 * 1000);
};
