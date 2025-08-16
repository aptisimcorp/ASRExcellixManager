const cron = require("node-cron");
const sendWhatsAppReminders = require("./followupScheduler");

// Schedule the job to run every 1 minute
cron.schedule("* * * * *", () => {
  console.log(
    "[Scheduler] Running scheduled WhatsApp reminders job at",
    new Date().toLocaleString()
  );
  sendWhatsAppReminders();
  (async () => {
    try {
      await fetch(`${process.env.API_BASE_URL}/wakeup`);

      console.log("Wakeup API call succeeded");
    } catch (err) {
      console.error("Wakeup API call failed:", err);
    }
  })();
});
