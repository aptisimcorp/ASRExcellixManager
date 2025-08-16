// utils/date.js

/**
 * Returns a Date object representing the current time in IST (Asia/Kolkata).
 */
function getISTDate() {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
}

/**
 * Converts any Date object to an IST ISO string (YYYY-MM-DDTHH:mm:ss+05:30)
 */
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

module.exports = { getISTDate, toISTISOString };
