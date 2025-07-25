const cron = require("node-cron");
const sendWhatsAppReminders = require("./followupScheduler");

// Schedule the job to run every 10 minute
cron.schedule("*/10 * * * *", () => {
  console.log(
    "[Scheduler] Running scheduled WhatsApp reminders job at",
    new Date().toLocaleString()
  );
  sendWhatsAppReminders();
});
