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
  morning: { label:"Morning Routine",    color:"#fde68a", bg:"rgba(253,230,138,0.07)" },
  health:  { label:"Health & Fitness",   color:"#4ade80", bg:"rgba(74,222,128,0.07)"  },
  work:    { label:"Work",               color:"#fbbf24", bg:"rgba(251,191,36,0.07)"  },
  kiki:    { label:"Kiki 🐱",            color:"#f472b6", bg:"rgba(244,114,182,0.07)" },
  home:    { label:"Home & Cleanliness", color:"#fb923c", bg:"rgba(251,146,60,0.07)"  },
  workout: { label:"Workout",            color:"#38bdf8", bg:"rgba(56,189,248,0.07)"  },
  reflect: { label:"Weekly Reset",       color:"#34d399", bg:"rgba(52,211,153,0.07)"  },
  night:   { label:"Nightly Routine",    color:"#c084fc", bg:"rgba(192,132,252,0.07)" },
  weigh:   { label:"Weigh In",           color:"#f9a8d4", bg:"rgba(249,168,212,0.07)" },
};

// ── Goals ─────────────────────────────────────────────────
export const GOAL_WEIGHT    = 210;
export const CALORIE_TARGET = 2150;
export const PROTEIN_TARGET = 185;
export const WATER_GOAL     = 8;

// ── Workout data — Phase 1 ────────────────────────────────
export const WORKOUTS = {
  TUE: {
    title:"Push — chest, shoulders, triceps", day:"TUE", duration:"~30 min", rest:"90 sec",
    note:"Straight sets — same weight every set. Rest exactly 90 seconds between sets. Last 2 reps should be hard.",
    exercises:[
      { id:"tue_e1", name:"Dumbbell bench press",      tip:"Flat bench · 2 sec descent · 3 sets × 12–15" },
      { id:"tue_e2", name:"Incline dumbbell press",    tip:"Bench ~45° · upper chest focus · 3 sets × 12–15" },
      { id:"tue_e3", name:"Seated shoulder press",     tip:"Don't arch your lower back · 3 sets × 12–15" },
      { id:"tue_e4", name:"Lateral raises",            tip:"Light weight · lead with elbows · 3 sets × 15" },
      { id:"tue_e5", name:"Overhead tricep extension", tip:"One DB held with both hands · 3 sets × 15" },
    ],
  },
  THU: {
    title:"Pull — back, biceps, rear delts", day:"THU", duration:"~30 min", rest:"90 sec",
    note:"Straight sets — same weight every set. Bent-over row builds raw strength, chest-supported row isolates the back completely with zero momentum.",
    exercises:[
      { id:"thu_e1", name:"Dumbbell bent-over row",      tip:"Both arms · flat back, brace core · 3 sets × 12–15" },
      { id:"thu_e2", name:"Chest-supported dumbbell row", tip:"Lie chest-down on incline bench · pure back isolation · 3 sets × 12–15" },
      { id:"thu_e3", name:"Dumbbell reverse fly",         tip:"Hinged forward · light weight, rear delts · 3 sets × 15" },
      { id:"thu_e4", name:"Alternating dumbbell curl",    tip:"Full range · no swinging · 3 sets × 12–15" },
      { id:"thu_e5", name:"Dumbbell shrug",               tip:"Straight arms · hold 1 sec at top · 3 sets × 15" },
    ],
  },
  SUN: {
    title:"Legs + core — quads, hamstrings, glutes", day:"SUN", duration:"~30 min", rest:"90 sec",
    note:"Straight sets — same weight every set. Legs are your biggest muscle group — biggest calorie burn of the week.",
    exercises:[
      { id:"sun_e1", name:"Goblet squat",     tip:"Hold one heavy DB at chest · full depth · 3 sets × 15" },
      { id:"sun_e2", name:"Romanian deadlift", tip:"Both DBs · hinge at hips, soft knees · 3 sets × 12–15" },
      { id:"sun_e3", name:"Dumbbell step-up",  tip:"Use bench · drive through heel · 3 sets × 12 each" },
      { id:"sun_e4", name:"Sumo squat",        tip:"Wide stance · one DB between legs · 3 sets × 15" },
      { id:"sun_e5", name:"Plank",             tip:"Elbows on floor · neutral spine · 3 sets × 30 sec" },
    ],
  },
};

// ── Cleaning sessions — expandable modal per room ─────────
export const CLEANING_SESSIONS = {
  TUE: {
    id:"clean_tue", title:"Kitchen & Dining Room", icon:"🍳", duration:"~20 min",
    note:"Wipe everything down top to bottom — counters first, floors last.",
    tasks:[
      "Wipe down all counters & stovetop",
      "Clean the sink",
      "Wipe down microwave inside & out",
      "Wipe down dining table & chairs",
      "Sweep & mop kitchen floor",
    ],
  },
  WED: {
    id:"clean_wed", title:"Upstairs Bathroom", icon:"🚿", duration:"~20 min",
    note:"Scrub everything — toilet, sink, shower, mirror, then floor last.",
    tasks:[
      "Scrub the toilet inside & out",
      "Wipe down sink & clean mirror",
      "Clean shower or tub",
      "Wipe down all surfaces & shelves",
      "Sweep & mop the floor",
    ],
  },
  THU: {
    id:"clean_thu", title:"Bedroom", icon:"🛏️", duration:"~15 min",
    note:"Reset your space — a tidy bedroom makes for better sleep.",
    tasks:[
      "Change bed sheets",
      "Dust surfaces & nightstand",
      "Tidy & organize — put everything in its place",
      "Vacuum floor",
    ],
  },
};

// ── Daily checklist items ─────────────────────────────────
export const MORNING_ALWAYS = [
  { id:"m1", category:"morning", label:"Brush your teeth",         icon:"🪥" },
  { id:"m2", category:"morning", label:"Wash your face",           icon:"🧴" },
  { id:"m3", category:"morning", label:"Protein shake & creatine", icon:"🥤" },
];
export const HEALTH_ALWAYS = [
  { id:"d1", category:"health", label:"Drink 8 glasses of water", icon:"💧" },
  { id:"d2", category:"health", label:"Avoid late-night snacking", icon:"🌙" },
];
export const CARDIO_ITEM = { id:"d4", category:"health", label:"10,000 steps (Oura ring)", icon:"🚶" };
export const WORK_ITEM   = { id:"w1", category:"work",   label:"Log & track tips for today", icon:"💰" };

// ── Kiki — every day ──────────────────────────────────────
export const KIKI_ALWAYS = [
  { id:"k1", category:"kiki", label:"Morning feeding — dry food",  icon:"🐱" },
  { id:"k2", category:"kiki", label:"Evening feeding — dry food",  icon:"🐱" },
  { id:"k3", category:"kiki", label:"Fill up Kiki's water",        icon:"💧" },
  { id:"k4", category:"kiki", label:"Scoop litter box",            icon:"🪣" },
];

export const HOME_ALWAYS = [
  { id:"h1", category:"home", label:"Make your bed",                         icon:"🛏️" },
  { id:"h2", category:"home", label:"Wash any dishes used today",            icon:"🍽️" },
  { id:"h3", category:"home", label:"Quick 10-min tidy of main living area", icon:"🧹" },
];
export const EXTRA_HOME = {
  MON:[
    { id:"h_mon1", category:"home", label:"Take out trash & recycling", icon:"🗑️" },
  ],
  TUE:[
    { id:"h_tue1", category:"home", label:"Do laundry (wash, dry & put away)", icon:"👕" },
  ],
  WED:[
    { id:"h_wed1", category:"home", label:"Clear & wipe kitchen counters", icon:"🍳" },
  ],
  THU:[
    { id:"h_thu1", category:"night", label:"Lay out tomorrow's clothes", icon:"👕" },
  ],
  FRI:[
    { id:"h_fri1", category:"night", label:"Lay out tomorrow's clothes", icon:"👕" },
  ],
  SAT:[],
  SUN:[
    { id:"h_sun1", category:"home",  label:"Wipe down all surfaces (reset week)", icon:"🧼" },
    { id:"h_sun2", category:"night", label:"Lay out tomorrow's clothes",          icon:"👕" },
  ],
};
export const TUE_REFLECT = [
  { id:"r1", category:"reflect", label:"Weigh in — same time, before eating",          icon:"⚖️" },
  { id:"r2", category:"reflect", label:"Review last week — what did you hit or miss?", icon:"📋" },
  { id:"r3", category:"reflect", label:"Set your focus & intentions for this week",    icon:"🎯" },
];
export const NIGHTLY_ALWAYS = [
  { id:"n1", category:"night", label:"Shower",                     icon:"🚿" },
  { id:"n2", category:"night", label:"Brush your teeth",           icon:"🪥" },
  { id:"n3", category:"night", label:"Take your meds",             icon:"💊" },
  { id:"n4", category:"night", label:"Tidy your gaming area",      icon:"🎮" },
  { id:"n5", category:"night", label:"Double check your backpack", icon:"🎒" },
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

// ── Pre-loaded food database ──────────────────────────────
export const DEFAULT_FOODS = [
  // ── Staples ───────────────────────────────────────────────
  { id:"f1",  name:"Gold Standard Protein Shake", calories:150, protein:24, emoji:"🥤" },
  { id:"f2",  name:"Greek Yogurt with Granola",   calories:300, protein:18, emoji:"🫙" },
  { id:"f3",  name:"Hard Boiled Eggs (2)",        calories:140, protein:12, emoji:"🥚" },
  { id:"f4",  name:"Banana + Peanut Butter",      calories:250, protein:7,  emoji:"🍌" },
  { id:"f5",  name:"Overnight Oats",              calories:350, protein:15, emoji:"🥣" },
  { id:"f6",  name:"Granola with Almond Milk",    calories:280, protein:8,  emoji:"🥣" },
  { id:"f7",  name:"Chicken Breast (6oz)",        calories:185, protein:35, emoji:"🍗" },
  { id:"f8",  name:"88/12 Ground Beef (6oz)",     calories:320, protein:32, emoji:"🥩" },
  { id:"f9",  name:"White Rice (1 cup cooked)",   calories:205, protein:4,  emoji:"🍚" },
  { id:"f10", name:"Frozen Broccoli (1 cup)",     calories:55,  protein:4,  emoji:"🥦" },
  { id:"f11", name:"Frozen Green Beans (1 cup)",  calories:35,  protein:2,  emoji:"🫘" },
  { id:"f12", name:"Cauliflower Rice (1 cup)",    calories:25,  protein:2,  emoji:"🍚" },
  { id:"f13", name:"Sriracha (1 tbsp)",           calories:10,  protein:0,  emoji:"🌶️" },
  { id:"f14", name:"Edamame (1 cup)",             calories:190, protein:17, emoji:"🫘" },
  { id:"f15", name:"Protein Bar",                 calories:200, protein:20, emoji:"🍫" },
  // ── Winking Lizard — Mains ────────────────────────────────
  { id:"wl1", name:"Winking Lizard — Cajun Chicken Spinach Salad", calories:780, protein:87, emoji:"🥗" },
  { id:"wl2", name:"Winking Lizard — Cajun Chicken Sandwich",      calories:521, protein:58, emoji:"🥪" },
  { id:"wl3", name:"Winking Lizard — Cheddar Club",                calories:589, protein:59, emoji:"🥪" },
  { id:"wl4", name:"Winking Lizard — Cajun Chicken Wrap",          calories:743, protein:62, emoji:"🌯" },
  { id:"wl5", name:"Winking Lizard — Buffalo Chicken Wrap",        calories:694, protein:60, emoji:"🌯" },
  { id:"wl6", name:"Winking Lizard — Plain Traditional Wings (5)", calories:350, protein:38, emoji:"🍗" },
  { id:"wl7", name:"Winking Lizard — Chicken Caesar Salad",        calories:300, protein:45, emoji:"🥗" },
  // ── Winking Lizard — Sides ────────────────────────────────
  { id:"wl8",  name:"Winking Lizard — Steamed Broccoli",   calories:30,  protein:2,  emoji:"🥦" },
  { id:"wl9",  name:"Winking Lizard — Long Grain Rice",    calories:300, protein:8,  emoji:"🍚" },
  { id:"wl10", name:"Winking Lizard — Steak Fries",        calories:366, protein:7,  emoji:"🍟" },
  { id:"wl11", name:"Winking Lizard — Coleslaw (6oz)",     calories:278, protein:2,  emoji:"🥗" },
  { id:"wl12", name:"Winking Lizard — Mac & Cheese",       calories:439, protein:14, emoji:"🧀" },
  { id:"wl13", name:"Winking Lizard — Baked Beans",        calories:376, protein:10, emoji:"🫘" },
  { id:"wl14", name:"Winking Lizard — Apple Sauce (6oz)",  calories:135, protein:0,  emoji:"🍎" },
  // ── Winking Lizard — Dressings ───────────────────────────
  { id:"wl15", name:"Winking Lizard — Raspberry Vinaigrette (3oz)",    calories:102, protein:0, emoji:"🫙" },
  { id:"wl16", name:"Winking Lizard — Basil Balsamic Vinaigrette (3oz)", calories:150, protein:0, emoji:"🫙" },
  { id:"wl17", name:"Winking Lizard — Hot Bacon Dressing (3oz)",       calories:240, protein:0, emoji:"🫙" },
  { id:"wl18", name:"Winking Lizard — House Ranch (3oz)",              calories:390, protein:0, emoji:"🫙" },
  { id:"wl19", name:"Winking Lizard — Caesar Dressing (1.5oz)",        calories:217, protein:2, emoji:"🫙" },
  { id:"wl20", name:"Winking Lizard — 1000 Island (3oz)",              calories:330, protein:0, emoji:"🫙" },
  // ── Winking Lizard — Kids Menu ───────────────────────────
  { id:"wlk1",  name:"Winking Lizard — Cheeseburger Basket",           calories:949, protein:49, emoji:"🍔" },
  { id:"wlk2",  name:"Winking Lizard — Hamburger Basket",              calories:869, protein:45, emoji:"🍔" },
  { id:"wlk3",  name:"Winking Lizard — Grilled Cheese",                calories:406, protein:16, emoji:"🧀" },
  { id:"wlk4",  name:"Winking Lizard — Kids Salad",                    calories:140, protein:9,  emoji:"🥗" },
  { id:"wlk5",  name:"Winking Lizard — Lizard Lips",                   calories:360, protein:24, emoji:"🍗" },
  { id:"wlk6",  name:"Winking Lizard — Mac & Cheese Wedges",           calories:440, protein:12, emoji:"🧀" },
  { id:"wlk7",  name:"Winking Lizard — Mini Corn Dogs",                calories:440, protein:12, emoji:"🌭" },
  { id:"wlk8",  name:"Winking Lizard — Nachos with Cheese",            calories:810, protein:13, emoji:"🧀" },
  { id:"wlk9",  name:"Winking Lizard — Plain Boneless Wings (Kids)",   calories:400, protein:19, emoji:"🍗" },
  { id:"wlk10", name:"Winking Lizard — Plain Traditional Wings (Kids)",calories:350, protein:38, emoji:"🍗" },
  { id:"wlk11", name:"Winking Lizard — Small Cheese Pizza",            calories:800, protein:29, emoji:"🍕" },
];

// ── Meal prep recipes ─────────────────────────────────────
export const RECIPES = [
  {
    id:"r1", name:"Oven Baked Chicken Breast", emoji:"🍗",
    prepDay:["SUN","WED"], prepMins:35, servings:4,
    caloriesPerServing:185, proteinPerServing:35, tag:"high-protein",
    ingredients:["4 chicken breasts","Garlic powder","Paprika","Cayenne","Olive oil","Salt"],
    steps:[
      "Preheat oven to 425°F",
      "Coat chicken in olive oil, season with garlic, paprika, cayenne, salt",
      "Bake 22–25 min until internal temp hits 165°F",
      "Rest 5 min before slicing",
      "Store in containers — lasts 4 days in fridge",
    ],
  },
  {
    id:"r2", name:"Sriracha Honey Ground Beef Bowl", emoji:"🥩",
    prepDay:["SUN","WED"], prepMins:20, servings:4,
    caloriesPerServing:380, proteinPerServing:32, tag:"high-protein",
    ingredients:["1.5 lb 88/12 ground beef","2 tbsp sriracha","1 tbsp honey","Garlic","Soy sauce","Rice"],
    steps:[
      "Brown beef in pan over medium-high heat, drain excess fat",
      "Add minced garlic, cook 1 min",
      "Mix sriracha, honey, soy sauce — pour over beef",
      "Simmer 2–3 min until sauce coats meat",
      "Serve over rice with frozen veg on the side",
    ],
  },
  {
    id:"r3", name:"Buffalo Chicken Breast", emoji:"🌶️",
    prepDay:["SUN","WED"], prepMins:30, servings:4,
    caloriesPerServing:200, proteinPerServing:35, tag:"high-protein",
    ingredients:["4 chicken breasts","Frank's hot sauce","Butter (1 tbsp)","Garlic powder","Salt"],
    steps:[
      "Bake chicken at 425°F for 22 min",
      "Mix Frank's with melted butter",
      "Toss cooked chicken in buffalo sauce",
      "Slice and store — great cold or reheated",
    ],
  },
  {
    id:"r4", name:"Chili Garlic Chicken Breast", emoji:"🍗",
    prepDay:["SUN","WED"], prepMins:30, servings:4,
    caloriesPerServing:190, proteinPerServing:35, tag:"high-protein",
    ingredients:["4 chicken breasts","Chili garlic sauce (2 tbsp)","Soy sauce","Garlic","Ginger","Sesame oil"],
    steps:[
      "Marinate chicken in chili garlic sauce, soy, garlic, ginger for 15 min",
      "Bake at 425°F for 22–25 min",
      "Finish with a drizzle of sesame oil",
      "Slice and store",
    ],
  },
  {
    id:"r5", name:"Taco Style 88/12 Ground Beef", emoji:"🌮",
    prepDay:["SUN","WED"], prepMins:15, servings:4,
    caloriesPerServing:300, proteinPerServing:30, tag:"high-protein",
    ingredients:["1.5 lb 88/12 ground beef","Taco seasoning","Garlic","Onion powder","Cumin","Chili powder"],
    steps:[
      "Brown beef over medium-high heat",
      "Drain excess fat",
      "Add taco seasoning + a splash of water",
      "Simmer 2 min — done",
      "Use in bowls, wraps, or on rice",
    ],
  },
  {
    id:"r6", name:"Hard Boiled Eggs (Batch)", emoji:"🥚",
    prepDay:["SUN","WED"], prepMins:15, servings:6,
    caloriesPerServing:140, proteinPerServing:12, tag:"snack",
    ingredients:["12 eggs","Water","Ice"],
    steps:[
      "Place eggs in pot, cover with cold water",
      "Bring to boil, then cover and remove from heat",
      "Let sit 10–12 min",
      "Transfer to ice bath for 5 min",
      "Peel and store in fridge up to 1 week",
    ],
  },
  {
    id:"r7", name:"Ground Turkey Taco Meat", emoji:"🦃",
    prepDay:["SUN"], prepMins:15, servings:4,
    caloriesPerServing:220, proteinPerServing:28, tag:"high-protein",
    ingredients:["1.5 lb ground turkey","Cumin","Chili powder","Garlic","Chili flakes","Salt"],
    steps:[
      "Brown turkey over medium heat — leaner so it dries faster than beef",
      "Add garlic, cumin, chili powder, chili flakes",
      "Season well — turkey needs more seasoning than beef",
      "Cook until no pink remains",
      "Store in containers — lasts 4 days",
    ],
  },
  {
    id:"r8", name:"Spicy Chicken Stir Fry", emoji:"🥘",
    prepDay:["SUN","WED"], prepMins:20, servings:3,
    caloriesPerServing:280, proteinPerServing:32, tag:"high-protein",
    ingredients:["3 chicken breasts sliced","Frozen stir fry veg mix","Chili garlic sauce","Soy sauce","Sesame oil","Garlic"],
    steps:[
      "Slice chicken thin, cook in hot pan with oil",
      "Add garlic, cook 1 min",
      "Add frozen veg straight from bag — no thawing needed",
      "Stir fry 4–5 min",
      "Add chili garlic sauce + soy sauce, toss",
      "Finish with sesame oil",
    ],
  },
];
