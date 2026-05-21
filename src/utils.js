export function getWeekKey() {
  const d = new Date(), jan1 = new Date(d.getFullYear(), 0, 1);
  return `${d.getFullYear()}-W${Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)}`;
}

export function getTodayCode() {
  return ["SUN","MON","TUE","WED","THU","FRI","SAT"][new Date().getDay()];
}

export function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

// Water day key — resets at 4am EST, handles DST correctly via Intl API
export function getWaterDayKey() {
  const now = new Date();

  // Get current time in EST/EDT using Intl (handles DST automatically)
  const estParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", hour12: false,
  }).formatToParts(now);

  const get = type => estParts.find(p => p.type === type)?.value;
  const year  = parseInt(get("year"));
  const month = parseInt(get("month")) - 1;
  const day   = parseInt(get("day"));
  const hour  = parseInt(get("hour"));

  // If before 4am EST, the water "day" is still yesterday
  const estDate = new Date(year, month, day);
  if (hour < 4) {
    estDate.setDate(estDate.getDate() - 1);
  }

  // Return as YYYY-MM-DD
  const y = estDate.getFullYear();
  const m = String(estDate.getMonth() + 1).padStart(2, "0");
  const d2 = String(estDate.getDate()).padStart(2, "0");
  return `${y}-${m}-${d2}`;
}

export function linearRegression(points) {
  const n = points.length;
  if (n < 2) return null;
  const sumX  = points.reduce((a, p) => a + p.x, 0);
  const sumY  = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumXX = points.reduce((a, p) => a + p.x * p.x, 0);
  const slope     = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDate(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month:"short", day:"numeric" });
}

export function formatDateLong(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}
