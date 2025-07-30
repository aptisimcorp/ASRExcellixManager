const cron = require("node-cron");
const sendWhatsAppReminders = require("./followupScheduler");

// Schedule the job to run every 1 minute
cron.schedule("* * * * *", () => {
  console.log(
    "[Scheduler] Running scheduled WhatsApp reminders job at",
    new Date().toLocaleString()
  );
  sendWhatsAppReminders();
});
