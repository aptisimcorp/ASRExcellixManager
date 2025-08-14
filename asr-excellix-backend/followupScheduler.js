const mongoose = require("mongoose");
const Candidate = require("./models/Candidate");
const Employee = require("./models/Employee");
const EmailLog = require("./models/EmailLog");
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

// Use node-fetch in CommonJS (v3+) with dynamic import
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function sendWhatsAppReminders() {
  const now = new Date();

  // Get current IST time
  const istOffset = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(now.getTime() + istOffset);
  const in15IST = new Date(nowIST.getTime() + 15 * 60000);
  const candidates = await Candidate.find({
    conversationHistory: {
      $elemMatch: {
        date: { $gte: nowIST, $lte: in15IST },
      },
    },
  });

  for (const candidate of candidates) {
    const nextConv = candidate.conversationHistory.find((c) => {
      const convDateIST = new Date(new Date(c.date).getTime() + istOffset);
      return convDateIST >= nowIST && convDateIST <= in15IST && !c.FollowUpSent;
    });
    if (!nextConv) continue;

    // Find the employee by name
    const employee = await Employee.findOne({ name: nextConv.employeeName });
    //const toNumber = `whatsapp:${normalizePhone(employee.phone)}`;
    const toEmail = `whatsapp:${normalizePhone(employee.email)}`;

    let followupSent = false;
    // Log attempt to send email
    await EmailLog.create({
      candidateName: candidate.name,
      candidatePhone: candidate.phone,
      employeeName: employee.name,
      employeeEmail: employee.email,
      followUpDate: nextConv.date,
      status: "attempt",
      error: "",
    });
    // Send email using Azure Communication Services with external HTML template
    try {
      const { EmailClient } = require("@azure/communication-email");
      const fs = require("fs");
      const path = require("path");
      const connectionString =
        process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
      if (!connectionString) {
        throw new Error(
          "AZURE_COMMUNICATION_CONNECTION_STRING is not set in environment variables."
        );
      }
      const emailClient = new EmailClient(connectionString);

      // Read and fill the HTML template
      const templatePath = path.join(__dirname, "emailTemplate.html");
      let htmlTemplate = fs.readFileSync(templatePath, "utf8");
      // Format followUpDate in IST
      const followUpDateIST = new Date(
        new Date(nextConv.date).getTime() + istOffset
      ).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      htmlTemplate = htmlTemplate
        .replace(/{{candidateName}}/g, candidate.name)
        .replace(/{{candidatePhone}}/g, candidate.phone)
        .replace(/{{followUpDate}}/g, followUpDateIST);
      const emailMessage = {
        senderAddress:
          "DoNotReply@5086a98d-0c75-4bc7-8628-2e2cf90dca53.azurecomm.net",
        content: {
          subject: "Alert: Follow Up",
          plainText: `Alert: Follow-up call with ${candidate.name} (${candidate.phone}) is scheduled on ${followUpDateIST}. Please take appropriate action.\n\nTeam ASR Excellix`,
          html: htmlTemplate,
        },
        recipients: {
          to: [{ address: employee.email }],
        },
      };

      const poller = await emailClient.beginSend(emailMessage);
      const result = await poller.pollUntilDone();
      if (result.status === "Succeeded") {
        console.log(
          `Email sent to ${employee.email} for follow-up at ${nextConv.date}`
        );
        followupSent = true;
        await EmailLog.create({
          candidateName: candidate.name,
          candidatePhone: candidate.phone,
          employeeName: employee.name,
          employeeEmail: employee.email,
          followUpDate: nextConv.date,
          status: "sent",
          error: "",
        });
      } else {
        console.error(
          `Failed to send email to ${employee.email}:`,
          result.error
        );
        await EmailLog.create({
          candidateName: candidate.name,
          candidatePhone: candidate.phone,
          employeeName: employee.name,
          employeeEmail: employee.email,
          followUpDate: nextConv.date,
          status: "error",
          error: result.error ? JSON.stringify(result.error) : "Unknown error",
        });
      }
    } catch (err) {
      console.error(
        "Error sending email via Azure Communication Services:",
        err
      );
      await EmailLog.create({
        candidateName: candidate.name,
        candidatePhone: candidate.phone,
        employeeName: employee.name,
        employeeEmail: employee.email,
        followUpDate: nextConv.date,
        status: "error",
        error: err.message || JSON.stringify(err),
      });
    }
    // Send WhatsApp message via bulkwhatsapp.net API (outside email try/catch)
    try {
      const employeeMobile = employee.phone.replace(/^\+?91/, ""); // Remove +91 if present
      const followUpMsg = encodeURIComponent(
        `Alert: Follow-up call with ${candidate.name} (${candidate.phone}) is scheduled on ${followUpDateIST}. Please take appropriate action.\n\nTeam ASR Excellix`
      );
      const apiUrl = `https://api.bulkwhatsapp.net/wapp/api/send?apikey=e1b31e8d433c42eebe3d9229a911e981&mobile=91${employeeMobile}&msg=${followUpMsg}`;
      const resp = await fetch(apiUrl);
      const respText = await resp.text();
      console.log(`WhatsApp API response for ${employee.phone}:`, respText);
      followupSent = true;
    } catch (werr) {
      console.error(
        "Error sending WhatsApp message via bulkwhatsapp.net:",
        werr
      );
    }

    // Update FollowUpSent flag in conversationHistory if alert was sent
    if (followupSent) {
      nextConv.FollowUpSent = true;
      await candidate.save();
    }
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

    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const client = require("twilio")(accountSid, authToken);

    // client.messages
    //   .create({
    //     from: "whatsapp:+14155238886",
    //     contentSid: process.env.TWILIO_CONTENT_SID2,
    //     //contentVariables: '{"1":"12/1","2":"3pm"}',
    //     contentVariables: JSON.stringify({
    //       1: ` ${candidate.name}`,
    //       2: `${candidate.phone}`,
    //       3: new Date(nextConv.date).toLocaleString(),
    //     }),
    //     to: "whatsapp:+919616647311",
    //   })
    //   .then((message) => console.log(message.sid));

    // console.log(
    //   `WhatsApp sent to ${candidate.name}, ${employee.phone} for follow-up at ${nextConv.date}`
    // );
  }
}

module.exports = function startFollowupScheduler() {
  // Run every 15 minutes
  sendWhatsAppReminders();
  // setInterval(sendWhatsAppReminders, 15 * 60 * 1000);
};
