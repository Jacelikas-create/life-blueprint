export function getWeekKey() {
  const d = new Date(), jan1 = new Date(d.getFullYear(), 0, 1);
  return `${d.getFullYear()}-W${Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)}`;
}

export function getTodayCode() {
  return ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()];
}

export function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function isToday(dayCode) {
  return dayCode === getTodayCode();
}

// Returns YYYY-MM-DD for the most recent occurrence of a given day code
export function getLastDateForDay(dayCode) {
  const dayIndex = ["SUN","MON","TUE","WED","THU","FRI","SAT"].indexOf(dayCode);
  const today = new Date();
  const diff = (today.getDay() - dayIndex + 7) % 7;
  const date = new Date(today);
  date.setDate(today.getDate() - diff);
  return date.toISOString().slice(0, 10);
}

// Linear regression over [{x, y}] points
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

// Days between two YYYY-MM-DD strings
export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

// Add days to a date string
export function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateLong(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
