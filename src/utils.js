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

// Water log key — resets at 4am EST
// Returns a string like "2026-05-19" but rolls over at 4am EST
export function getWaterDayKey() {
  const now = new Date();
  // Convert to EST (UTC-5) or EDT (UTC-4) — use UTC-5 as conservative
  const estOffset = -5 * 60; // minutes
  const utcOffset = now.getTimezoneOffset(); // local UTC offset in minutes
  const estNow = new Date(now.getTime() + (utcOffset + estOffset) * 60000);
  // If before 4am EST, use previous day
  if (estNow.getHours() < 4) {
    estNow.setDate(estNow.getDate() - 1);
  }
  return estNow.toISOString().slice(0, 10);
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
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDate(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month:"short", day:"numeric" });
}

export function formatDateLong(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}
