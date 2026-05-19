// ── Day config ────────────────────────────────────────────
export const DAYS       = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
export const DAY_LABELS = { MON:"Monday",TUE:"Tuesday",WED:"Wednesday",THU:"Thursday",FRI:"Friday",SAT:"Saturday",SUN:"Sunday" };
export const DAY_SHORT  = { MON:"Mon",TUE:"Tue",WED:"Wed",THU:"Thu",FRI:"Fri",SAT:"Sat",SUN:"Sun" };
export const WORK_DAYS  = new Set(["MON","FRI","SAT"]);
export const OFF_DAYS   = new Set(["TUE","WED","THU","SUN"]);
export const WEIGH_DAYS = new Set(["MON","WED","SAT"]);
export const WORKOUT_DAY_KEYS = ["TUE","THU","SUN"];

// ── Category palette ──────────────────────────────────────
export const CAT = {
  morning: { label: "Morning Routine",    color: "#fde68a", bg: "rgba(253,230,138,0.07)" },
  health:  { label: "Health & Fitness",   color: "#4ade80", bg: "rgba(74,222,128,0.07)"  },
  work:    { label: "Work",               color: "#fbbf24", bg: "rgba(251,191,36,0.07)"  },
  home:    { label: "Home & Cleanliness", color: "#fb923c", bg: "rgba(251,146,60,0.07)"  },
  workout: { label: "Workout",            color: "#38bdf8", bg: "rgba(56,189,248,0.07)"  },
  reflect: { label: "Weekly Reset",       color: "#34d399", bg: "rgba(52,211,153,0.07)"  },
  night:   { label: "Nightly Routine",    color: "#c084fc", bg: "rgba(192,132,252,0.07)" },
  weigh:   { label: "Weigh In",           color: "#f9a8d4", bg: "rgba(249,168,212,0.07)" },
};

// ── Goal ─────────────────────────────────────────────────
export const GOAL_WEIGHT = 210;

// ── Workout data — Phase 1 ────────────────────────────────
export const WORKOUTS = {
  TUE: {
    title: "Push — chest, shoulders, triceps",
    day: "TUE",
    duration: "~30 min",
    rest: "90 sec",
    note: "Straight sets — same weight every set. Rest exactly 90 seconds between sets. Last 2 reps should be hard.",
    exercises: [
      { id:"tue_e1", name: "Dumbbell bench press",      tip: "Flat bench · 2 sec descent · 3 sets × 12–15" },
      { id:"tue_e2", name: "Incline dumbbell press",    tip: "Bench ~45° · upper chest focus · 3 sets × 12–15" },
      { id:"tue_e3", name: "Seated shoulder press",     tip: "Don't arch your lower back · 3 sets × 12–15" },
      { id:"tue_e4", name: "Lateral raises",            tip: "Light weight · lead with elbows · 3 sets × 15" },
      { id:"tue_e5", name: "Overhead tricep extension", tip: "One DB held with both hands · 3 sets × 15" },
    ],
  },
  THU: {
    title: "Pull — back, biceps, rear delts",
    day: "THU",
    duration: "~30 min",
    rest: "90 sec",
    note: "Straight sets — same weight every set. Balances Tuesday's push. Focus on pulling from the back, not the arms.",
    exercises: [
      { id:"thu_e1", name: "Dumbbell bent-over row",    tip: "Both arms · flat back, brace core · 3 sets × 12–15" },
      { id:"thu_e2", name: "Single-arm dumbbell row",   tip: "Brace on bench · pull elbow to hip · 3 sets × 12–15 each" },
      { id:"thu_e3", name: "Dumbbell reverse fly",      tip: "Hinged forward · light weight, rear delts · 3 sets × 15" },
      { id:"thu_e4", name: "Alternating dumbbell curl", tip: "Full range · no swinging · 3 sets × 12–15" },
      { id:"thu_e5", name: "Dumbbell shrug",            tip: "Straight arms · hold 1 sec at top · 3 sets × 15" },
    ],
  },
  SUN: {
    title: "Legs + core — quads, hamstrings, glutes",
    day: "SUN",
    duration: "~30 min",
    rest: "90 sec",
    note: "Straight sets — same weight every set. Legs are your biggest muscle group — biggest calorie burn of the week.",
    exercises: [
      { id:"sun_e1", name: "Goblet squat",      tip: "Hold one heavy DB at chest · full depth · 3 sets × 15" },
      { id:"sun_e2", name: "Romanian deadlift",  tip: "Both DBs · hinge at hips, soft knees · 3 sets × 12–15" },
      { id:"sun_e3", name: "Dumbbell step-up",   tip: "Use bench · drive through heel · 3 sets × 12 each" },
      { id:"sun_e4", name: "Sumo squat",         tip: "Wide stance · one DB between legs · 3 sets × 15" },
      { id:"sun_e5", name: "Plank",              tip: "Elbows on floor · neutral spine · 3 sets × 30 sec" },
    ],
  },
};

// ── Daily checklist items ─────────────────────────────────
export const MORNING_ALWAYS = [
  { id:"m1", category:"morning", label:"Brush your teeth",           icon:"🪥" },
  { id:"m2", category:"morning", label:"Wash your face",             icon:"🧴" },
  { id:"m3", category:"morning", label:"Eat a nutritious breakfast", icon:"🥗" },
];

export const HEALTH_ALWAYS = [
  { id:"d1", category:"health", label:"Drink 8 glasses of water",   icon:"💧" },
  { id:"d2", category:"health", label:"Avoid late-night snacking",   icon:"🌙" },
  { id:"d3", category:"health", label:"In bed by a consistent time", icon:"🛌" },
];

export const CARDIO_ITEM = { id:"d4", category:"health", label:"10,000 steps (Oura ring)", icon:"🚶" };

export const WORK_ITEM = { id:"w1", category:"work", label:"Log & track tips for today", icon:"💰" };

export const HOME_ALWAYS = [
  { id:"h1", category:"home", label:"Make your bed",                         icon:"🛏️" },
  { id:"h2", category:"home", label:"Wash any dishes used today",            icon:"🍽️" },
  { id:"h3", category:"home", label:"Quick 10-min tidy of main living area", icon:"🧹" },
];

export const EXTRA_HOME = {
  MON: [],
  TUE: [
    { id:"h_tue1", category:"home", label:"Vacuum & sweep floors",              icon:"🧽" },
    { id:"h_tue2", category:"home", label:"Wipe down bathroom surfaces",        icon:"🚿" },
  ],
  WED: [
    { id:"h_wed1", category:"home", label:"Do laundry (wash, dry & put away)", icon:"👕" },
    { id:"h_wed2", category:"home", label:"Clear & wipe kitchen counters",      icon:"🍳" },
  ],
  THU: [
    { id:"h_thu1", category:"home", label:"Take out trash & recycling",         icon:"🗑️" },
    { id:"h_thu2", category:"home", label:"Tidy bedroom / put things away",     icon:"📦" },
  ],
  FRI: [],
  SAT: [],
  SUN: [
    { id:"h_sun1", category:"home", label:"Wipe down all surfaces (reset week)", icon:"🧼" },
  ],
};

export const TUE_REFLECT = [
  { id:"r1", category:"reflect", label:"Weigh in — same time, before eating",          icon:"⚖️" },
  { id:"r2", category:"reflect", label:"Review last week — what did you hit or miss?", icon:"📋" },
  { id:"r3", category:"reflect", label:"Set your focus & intentions for this week",    icon:"🎯" },
];

export const NIGHTLY_ALWAYS = [
  { id:"n1", category:"night", label:"Shower",                      icon:"🚿" },
  { id:"n2", category:"night", label:"Brush your teeth",            icon:"🪥" },
  { id:"n3", category:"night", label:"Take your meds",              icon:"💊" },
  { id:"n4", category:"night", label:"Tidy your gaming area",       icon:"🎮" },
  { id:"n5", category:"night", label:"Lay out tomorrow's clothes",  icon:"👕" },
  { id:"n6", category:"night", label:"Double check your backpack",  icon:"🎒" },
];

// ── Weekly errands ────────────────────────────────────────
export const DEFAULT_ERRANDS = [
  { id:"e1",  label:"Grocery shop",                          icon:"🛒" },
  { id:"e2",  label:"Meal prep for the week",                icon:"🥦" },
  { id:"e3",  label:"Call Dad",                              icon:"📞" },
  { id:"e4",  label:"Check & respond to HoA communications", icon:"🏘️" },
  { id:"e5",  label:"Pay any bills due this week",           icon:"💳" },
  { id:"e6",  label:"Go to the bank",                        icon:"🏦" },
  { id:"e7",  label:"Review & tidy your budget/finances",    icon:"📊" },
  { id:"e8",  label:"Schedule any upcoming appointments",    icon:"📅" },
  { id:"e9",  label:"Car — fuel up / check if wash needed",  icon:"🚗" },
  { id:"e10", label:"Reply to any outstanding messages",     icon:"💬" },
];
