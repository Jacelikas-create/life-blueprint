// ── Day config ────────────────────────────────────────────
export const DAYS       = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
export const DAY_LABELS = { MON:"Monday",TUE:"Tuesday",WED:"Wednesday",THU:"Thursday",FRI:"Friday",SAT:"Saturday",SUN:"Sunday" };
export const DAY_SHORT  = { MON:"Mon",TUE:"Tue",WED:"Wed",THU:"Thu",FRI:"Fri",SAT:"Sat",SUN:"Sun" };
export const WORK_DAYS  = new Set(["MON","FRI","SAT"]);
export const OFF_DAYS   = new Set(["TUE","WED","THU","SUN"]);
export const WEIGH_DAYS = new Set(["MON","WED","SAT"]);
export const WORKOUT_DAY_KEYS = ["TUE","THU","SUN"];

export const SHOP_DAYS     = ["WED","SUN"];
export const WED_SHOP_DAYS = new Set(["WED","THU","FRI","SAT"]);
export const SUN_SHOP_DAYS = new Set(["SUN","MON","TUE"]);

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

// ── Household par items ───────────────────────────────────
export const PAR_CATEGORIES = [
  {
    id:"bathroom", label:"Bathroom", icon:"🛁",
    items:[
      { id:"p1", name:"Hand soap",      par:6, unit:"bottles" },
      { id:"p2", name:"Shampoo",        par:1, unit:"bottles" },
      { id:"p3", name:"Conditioner",    par:1, unit:"bottles" },
      { id:"p4", name:"Toilet paper",   par:6, unit:"rolls"   },
      { id:"p5", name:"Toothpaste",     par:2, unit:"tubes"   },
    ],
  },
  {
    id:"kitchen", label:"Kitchen", icon:"🍳",
    items:[
      { id:"p6",  name:"Dish soap",             par:1, unit:"bottles" },
      { id:"p7",  name:"Paper towels",          par:4, unit:"rolls"   },
      { id:"p8",  name:"Trash bags",            par:1, unit:"boxes"   },
      { id:"p9",  name:"Sponges (Scrub Daddy)", par:2, unit:"sponges" },
    ],
  },
  {
    id:"laundry", label:"Laundry", icon:"👕",
    items:[
      { id:"p10", name:"Detergent",    par:1, unit:"bottles" },
      { id:"p11", name:"Dryer sheets", par:1, unit:"boxes"   },
    ],
  },
  {
    id:"pet", label:"Kiki 🐱", icon:"🐱",
    items:[
      { id:"p12", name:"Dry cat food", par:1, unit:"bags" },
      { id:"p13", name:"Cat litter",   par:1, unit:"bags" },
    ],
  },
];

// ── Workout data ──────────────────────────────────────────
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
      { id:"thu_e1", name:"Dumbbell bent-over row",       tip:"Both arms · flat back, brace core · 3 sets × 12–15" },
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
      { id:"sun_e1", name:"Goblet squat",          tip:"Hold one heavy DB at chest · full depth · 3 sets × 15" },
      { id:"sun_e2", name:"Dumbbell good morning", tip:"DB at chest · push hips back · feel stretch in hamstrings · 3 sets × 12–15" },
      { id:"sun_e3", name:"Dumbbell step-up",      tip:"Use bench · drive through heel · 3 sets × 12 each" },
      { id:"sun_e4", name:"Sumo squat",            tip:"Wide stance · one DB between legs · 3 sets × 15" },
      { id:"sun_e5", name:"Plank",                 tip:"Elbows on floor · neutral spine · 3 sets × 30 sec" },
    ],
  },
};

// ── Cleaning sessions ─────────────────────────────────────
export const CLEANING_SESSIONS = {
  TUE: {
    id:"clean_tue", title:"Kitchen & Dining Room", icon:"🍳", duration:"~20 min",
    note:"Wipe everything down top to bottom — counters first, floors last.",
    tasks:["Wipe down all counters & stovetop","Clean the sink","Wipe down microwave inside & out","Wipe down dining table & chairs","Sweep & mop kitchen floor"],
  },
  WED: {
    id:"clean_wed", title:"Upstairs Bathroom", icon:"🚿", duration:"~20 min",
    note:"Scrub everything — toilet, sink, shower, mirror, then floor last.",
    tasks:["Scrub the toilet inside & out","Wipe down sink & clean mirror","Clean shower or tub","Wipe down all surfaces & shelves","Sweep & mop the floor"],
  },
  THU: {
    id:"clean_thu", title:"Bedroom", icon:"🛏️", duration:"~15 min",
    note:"Reset your space — a tidy bedroom makes for better sleep.",
    tasks:["Change bed sheets","Dust surfaces & nightstand","Tidy & organize — put everything in its place","Vacuum floor"],
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
export const KIKI_ALWAYS = [
  { id:"k1", category:"kiki", label:"Morning feeding — dry food", icon:"🐱" },
  { id:"k2", category:"kiki", label:"Evening feeding — dry food", icon:"🐱" },
  { id:"k3", category:"kiki", label:"Fill up Kiki's water",       icon:"💧" },
  { id:"k4", category:"kiki", label:"Scoop litter box",           icon:"🪣" },
];
export const HOME_ALWAYS = [
  { id:"h1", category:"home", label:"Make your bed",                         icon:"🛏️" },
  { id:"h2", category:"home", label:"Wash any dishes used today",            icon:"🍽️" },
  { id:"h3", category:"home", label:"Quick 10-min tidy of main living area", icon:"🧹" },
];
export const EXTRA_HOME = {
  MON:[ { id:"h_mon1", category:"home",  label:"Take out trash & recycling",        icon:"🗑️" } ],
  TUE:[ { id:"h_tue1", category:"home",  label:"Do laundry (wash, dry & put away)", icon:"👕" } ],
  WED:[ { id:"h_wed1", category:"home",  label:"Clear & wipe kitchen counters",     icon:"🍳" } ],
  THU:[ { id:"h_thu1", category:"night", label:"Lay out tomorrow's clothes",        icon:"👕" } ],
  FRI:[ { id:"h_fri1", category:"night", label:"Lay out tomorrow's clothes",        icon:"👕" } ],
  SAT:[],
  SUN:[
    { id:"h_sun1", category:"home",  label:"Wipe down all surfaces (reset week)", icon:"🧼" },
    { id:"h_sun2", category:"night", label:"Lay out tomorrow's clothes",          icon:"👕" },
    { id:"h_sun3", category:"home",  label:"Check household par levels",          icon:"📦", isPar:true },
  ],
};
export const TUE_REFLECT = [
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

// ─────────────────────────────────────────────────────────────────────────────
// ── MEAL LIBRARY — 35 meals with ingredients + recipes ───────────────────────
// ingredients[].groceryKey = null means pantry staple — excluded from shop list
// isRaw = true means protein is listed at raw weight
// ─────────────────────────────────────────────────────────────────────────────

export const MEAL_LIBRARY = [

  // ─── BREAKFASTS (5) ──────────────────────────────────────────────────────

  {
    id:"b1", category:"breakfast", emoji:"🫙",
    name:"Greek Yogurt + Protein Shake Bowl",
    calories:340, protein:52,
    note:"Mix protein powder directly into yogurt for a thick, pudding-like texture.",
    ingredients:[
      { name:"Non-fat Greek yogurt", grams:227, unit:"g", groceryKey:"greek_yogurt" },
      { name:"Whey protein powder",  grams:32,  unit:"g", groceryKey:"whey_protein" },
    ],
    steps:[
      "Scoop 227g Greek yogurt into a bowl.",
      "Add 32g (1 scoop) whey protein powder.",
      "Stir vigorously until smooth and thick — no lumps.",
      "Eat immediately or refrigerate up to 24 hours.",
    ],
  },
  {
    id:"b2", category:"breakfast", emoji:"🥚",
    name:"Scrambled Eggs & Turkey Scramble",
    calories:310, protein:38,
    note:"Cook turkey first, push to side, scramble eggs in same pan. Hot sauce on top.",
    ingredients:[
      { name:"Whole eggs",    grams:null, unit:"count", groceryKey:"eggs",         count:3, measure:"3 eggs" },
      { name:"Ground turkey", grams:113,  unit:"g",     groceryKey:"ground_turkey", isRaw:true },
      { name:"Hot sauce",     grams:null, unit:"tbsp",  groceryKey:null,            measure:"2 tbsp" },
    ],
    steps:[
      "Heat a non-stick pan over medium-high. Add a splash of oil.",
      "Add 113g raw ground turkey. Break apart and cook 4–5 min until no pink remains.",
      "Push turkey to the side. Crack 3 eggs into the pan.",
      "Scramble eggs and fold into turkey as they cook.",
      "Season with salt, pepper, hit with hot sauce. Serve immediately.",
    ],
  },
  {
    id:"b3", category:"breakfast", emoji:"🌮",
    name:"Breakfast Taco",
    calories:380, protein:36,
    note:"Eggs + turkey in a carb balance tortilla with salsa. Fast and filling.",
    ingredients:[
      { name:"Whole eggs",             grams:null, unit:"count", groceryKey:"eggs",                   count:3, measure:"3 eggs" },
      { name:"Ground turkey",          grams:85,   unit:"g",     groceryKey:"ground_turkey",           isRaw:true },
      { name:"Carb balance tortillas", grams:null, unit:"count", groceryKey:"carb_balance_tortillas",  count:1, measure:"1 tortilla" },
      { name:"Salsa",                  grams:null, unit:"tbsp",  groceryKey:null,                      measure:"2 tbsp" },
    ],
    steps:[
      "Cook 85g ground turkey in a pan over medium-high, 3–4 min.",
      "Add 3 cracked eggs, scramble together with turkey.",
      "Warm carb balance tortilla 20 sec in microwave or dry pan.",
      "Fill tortilla with egg-turkey mixture. Top with salsa.",
      "Fold and eat. Done in under 10 minutes.",
    ],
  },
  {
    id:"b4", category:"breakfast", emoji:"🥔",
    name:"Egg & Potato Hash",
    calories:420, protein:28,
    note:"Air fry cubed potatoes at 400°F for 18 min until crispy. Scramble eggs in pan, combine. Hot sauce on top.",
    ingredients:[
      { name:"Whole eggs",    grams:null, unit:"count", groceryKey:"eggs",          count:3, measure:"3 eggs" },
      { name:"Russet potato", grams:200,  unit:"g",     groceryKey:"russet_potatoes" },
      { name:"Bell pepper",   grams:80,   unit:"g",     groceryKey:"bell_peppers" },
      { name:"Hot sauce",     grams:null, unit:"tbsp",  groceryKey:null,            measure:"2 tbsp" },
    ],
    steps:[
      "Cube 200g russet potato and 80g bell pepper into bite-sized pieces.",
      "Toss with a little oil, salt, garlic powder. Air fry at 400°F for 18 min, shaking halfway.",
      "Scramble 3 eggs in a pan over medium heat.",
      "Combine crispy potatoes and peppers with eggs in the pan. Toss together 1 min.",
      "Plate and hit with hot sauce.",
    ],
  },
  {
    id:"b5", category:"breakfast", emoji:"🍠",
    name:"Sweet Potato & Egg Hash",
    calories:390, protein:24,
    note:"Air fry sweet potato cubes at 400°F for 20 min. Scramble eggs in pan, combine. Hot sauce finishes it.",
    ingredients:[
      { name:"Whole eggs",   grams:null, unit:"count", groceryKey:"eggs",          count:3, measure:"3 eggs" },
      { name:"Sweet potato", grams:200,  unit:"g",     groceryKey:"sweet_potatoes" },
      { name:"Hot sauce",    grams:null, unit:"tbsp",  groceryKey:null,            measure:"2 tbsp" },
    ],
    steps:[
      "Cube 200g sweet potato. Toss with oil, salt, cinnamon if you like.",
      "Air fry at 400°F for 20 min, shaking at 10 min mark.",
      "Scramble 3 eggs in a pan over medium heat until just set.",
      "Combine sweet potato cubes with eggs. Toss briefly.",
      "Hit with hot sauce. Serve immediately.",
    ],
  },

  // ─── MAINS (22) ──────────────────────────────────────────────────────────

  {
    id:"m1", category:"mains", emoji:"🍗",
    name:"Sriracha Chicken Rice Bowl",
    calories:490, protein:48,
    note:"Bulk-cook chicken on shop day. Reheat over rice, drizzle sriracha + a little soy sauce.",
    ingredients:[
      { name:"Chicken breast (raw)", grams:200, unit:"g", groceryKey:"chicken_breast", isRaw:true },
      { name:"White rice (dry)",     grams:80,  unit:"g", groceryKey:"white_rice" },
      { name:"Frozen broccoli",      grams:150, unit:"g", groceryKey:"frozen_broccoli" },
      { name:"Sriracha",             grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
      { name:"Soy sauce",            grams:null, unit:"tbsp", groceryKey:null, measure:"1 tbsp" },
    ],
    steps:[
      "Bulk cook: season 200g raw chicken breast with garlic powder, salt, paprika. Bake at 425°F for 22–25 min.",
      "Cook 80g dry white rice per package directions (yields ~200g cooked).",
      "Microwave 150g frozen broccoli 3–4 min.",
      "Slice or shred chicken. Layer over rice and broccoli.",
      "Drizzle 2 tbsp sriracha + 1 tbsp soy sauce over the top.",
    ],
  },
  {
    id:"m2", category:"mains", emoji:"🍗",
    name:"Spicy Chicken Rice Bowl (Work Day)",
    calories:580, protein:50,
    note:"Bigger carb portion for high-step work days. Same bulk chicken, more rice.",
    ingredients:[
      { name:"Chicken breast (raw)", grams:200, unit:"g", groceryKey:"chicken_breast", isRaw:true },
      { name:"White rice (dry)",     grams:120, unit:"g", groceryKey:"white_rice" },
      { name:"Frozen broccoli",      grams:150, unit:"g", groceryKey:"frozen_broccoli" },
      { name:"Sriracha",             grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Bulk cook: bake 200g raw chicken breast at 425°F for 22–25 min. Season as desired.",
      "Cook 120g dry white rice (bigger portion — work day fuel).",
      "Microwave 150g frozen broccoli 3–4 min.",
      "Slice chicken, layer over rice and broccoli.",
      "Hit with 2 tbsp sriracha. Done.",
    ],
  },
  {
    id:"m3", category:"mains", emoji:"🥗",
    name:"Shredded Chicken Taco Salad",
    calories:420, protein:50,
    note:"Shred bulk-cooked chicken. Toss over romaine with salsa, hot sauce, a little shredded cheese.",
    ingredients:[
      { name:"Chicken breast (raw)", grams:200, unit:"g", groceryKey:"chicken_breast", isRaw:true },
      { name:"Romaine lettuce",      grams:150, unit:"g", groceryKey:"romaine_lettuce" },
      { name:"Shredded cheese",      grams:28,  unit:"g", groceryKey:"shredded_cheese" },
      { name:"Salsa",                grams:null, unit:"tbsp", groceryKey:null, measure:"3 tbsp" },
      { name:"Hot sauce",            grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Bulk cook chicken, shred with two forks while warm.",
      "Chop 150g romaine into a bowl.",
      "Top with shredded chicken and 28g shredded cheese.",
      "Spoon 3 tbsp salsa and 2 tbsp hot sauce over the top.",
      "Toss and eat. No dressing needed.",
    ],
  },
  {
    id:"m4", category:"mains", emoji:"🥦",
    name:"Chicken & Broccoli Power Bowl",
    calories:430, protein:52,
    note:"Simple and clean. Chicken over rice and broccoli, sriracha + soy sauce drizzle.",
    ingredients:[
      { name:"Chicken breast (raw)", grams:200, unit:"g", groceryKey:"chicken_breast", isRaw:true },
      { name:"White rice (dry)",     grams:70,  unit:"g", groceryKey:"white_rice" },
      { name:"Frozen broccoli",      grams:200, unit:"g", groceryKey:"frozen_broccoli" },
      { name:"Sriracha",             grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
      { name:"Soy sauce",            grams:null, unit:"tbsp", groceryKey:null, measure:"1 tbsp" },
    ],
    steps:[
      "Bake 200g raw chicken at 425°F for 22–25 min. Slice.",
      "Cook 70g dry rice.",
      "Steam 200g frozen broccoli 3–4 min in microwave.",
      "Build bowl: rice base, broccoli, chicken on top.",
      "Drizzle sriracha and soy sauce. Simple and done.",
    ],
  },
  {
    id:"m5", category:"mains", emoji:"🧀",
    name:"Spicy Chicken Quesadilla",
    calories:500, protein:52,
    note:"Shredded bulk chicken + shredded cheese + sriracha in a carb balance tortilla. Pan sear both sides.",
    ingredients:[
      { name:"Chicken breast (raw)",   grams:170, unit:"g", groceryKey:"chicken_breast",        isRaw:true },
      { name:"Carb balance tortillas", grams:null, unit:"count", groceryKey:"carb_balance_tortillas", count:2, measure:"2 tortillas" },
      { name:"Shredded cheese",        grams:56,  unit:"g", groceryKey:"shredded_cheese" },
      { name:"Sriracha",               grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Shred bulk-cooked chicken (170g raw). Mix with 2 tbsp sriracha.",
      "Lay one carb balance tortilla flat in a dry pan over medium heat.",
      "Add half the cheese, all the chicken, rest of cheese, second tortilla on top.",
      "Cook 2–3 min per side until golden and cheese is melted.",
      "Slice into quarters. Eat immediately.",
    ],
  },
  {
    id:"m6", category:"mains", emoji:"🌮",
    name:"Ground Turkey Taco Bowl",
    calories:460, protein:46,
    note:"Cook turkey day-of with taco seasoning. Over rice with salsa and hot sauce.",
    ingredients:[
      { name:"Ground turkey",    grams:170, unit:"g", groceryKey:"ground_turkey", isRaw:true },
      { name:"White rice (dry)", grams:70,  unit:"g", groceryKey:"white_rice" },
      { name:"Salsa",            grams:null, unit:"tbsp", groceryKey:null, measure:"3 tbsp" },
      { name:"Hot sauce",        grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Brown 170g ground turkey in a pan over medium-high, 4–5 min.",
      "Add taco seasoning + splash of water. Simmer 1–2 min.",
      "Cook 70g dry rice per package directions.",
      "Serve turkey over rice. Top with salsa and hot sauce.",
    ],
  },
  {
    id:"m7", category:"mains", emoji:"🥬",
    name:"Ground Turkey Lettuce Cups",
    calories:330, protein:42,
    note:"Taco-seasoned turkey in romaine cups. Light carb option — good for rest days.",
    ingredients:[
      { name:"Ground turkey",   grams:170, unit:"g", groceryKey:"ground_turkey", isRaw:true },
      { name:"Romaine lettuce", grams:150, unit:"g", groceryKey:"romaine_lettuce" },
      { name:"Salsa",           grams:null, unit:"tbsp", groceryKey:null, measure:"3 tbsp" },
      { name:"Hot sauce",       grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Brown 170g ground turkey with taco seasoning, 4–5 min.",
      "Separate romaine leaves into cup shapes.",
      "Spoon seasoned turkey into romaine cups.",
      "Top each cup with salsa and hot sauce.",
    ],
  },
  {
    id:"m8", category:"mains", emoji:"🍚",
    name:"Ground Turkey & Rice Skillet",
    calories:470, protein:44,
    note:"Cook turkey in pan, add cooked rice and frozen veg, hit with chili garlic sauce.",
    ingredients:[
      { name:"Ground turkey",     grams:170, unit:"g", groceryKey:"ground_turkey",      isRaw:true },
      { name:"White rice (dry)",  grams:80,  unit:"g", groceryKey:"white_rice" },
      { name:"Frozen green beans",grams:150, unit:"g", groceryKey:"frozen_green_beans" },
      { name:"Chili garlic sauce",grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Cook 80g dry rice ahead of time.",
      "Brown 170g ground turkey in a large pan or wok, 4–5 min.",
      "Add frozen green beans straight from bag — stir fry 3–4 min.",
      "Add cooked rice to pan. Toss everything together.",
      "Add 2 tbsp chili garlic sauce. Stir and serve.",
    ],
  },
  {
    id:"m9", category:"mains", emoji:"🥩",
    name:"Lean Ground Beef Stir Fry",
    calories:490, protein:44,
    note:"Brown beef, drain fat, add frozen stir fry veg, hit with soy sauce + sriracha.",
    ingredients:[
      { name:"88/12 ground beef",   grams:170, unit:"g", groceryKey:"ground_beef_88",      isRaw:true },
      { name:"Frozen stir fry mix", grams:200, unit:"g", groceryKey:"frozen_stir_fry_mix" },
      { name:"White rice (dry)",    grams:70,  unit:"g", groceryKey:"white_rice" },
      { name:"Sriracha",            grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
      { name:"Soy sauce",           grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Brown 170g ground beef in a hot pan. Drain excess fat.",
      "Add 200g frozen stir fry veg straight from bag. Stir fry 4–5 min on high heat.",
      "Cook 70g dry rice separately.",
      "Mix sriracha and soy sauce into the beef and veg. Toss.",
      "Serve over rice.",
    ],
  },
  {
    id:"m10", category:"mains", emoji:"🥩",
    name:"Ground Beef & Zucchini Skillet",
    calories:420, protein:42,
    note:"Brown beef, add diced zucchini to pan, season with garlic and chili flakes. Low carb option.",
    ingredients:[
      { name:"88/12 ground beef", grams:170, unit:"g", groceryKey:"ground_beef_88", isRaw:true },
      { name:"Zucchini",          grams:200, unit:"g", groceryKey:"zucchini" },
      { name:"Hot sauce",         grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Dice 200g zucchini into half-moons.",
      "Brown 170g ground beef in pan over medium-high. Drain fat.",
      "Add zucchini to the pan. Cook 4–5 min until tender.",
      "Season with garlic powder, chili flakes, salt.",
      "Finish with hot sauce. Low carb and done in 15 min.",
    ],
  },
  {
    id:"m11", category:"mains", emoji:"🥬",
    name:"Spicy Beef & Cabbage Bowl",
    calories:430, protein:40,
    note:"Brown beef, add shredded cabbage to pan, sriracha + soy sauce. Cooks down fast.",
    ingredients:[
      { name:"88/12 ground beef", grams:170, unit:"g", groceryKey:"ground_beef_88", isRaw:true },
      { name:"Green cabbage",     grams:200, unit:"g", groceryKey:"green_cabbage" },
      { name:"Sriracha",          grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
      { name:"Soy sauce",         grams:null, unit:"tbsp", groceryKey:null, measure:"1 tbsp" },
    ],
    steps:[
      "Shred or roughly chop 200g green cabbage.",
      "Brown 170g beef in a large pan on high heat. Drain fat.",
      "Add cabbage to pan. It will look like a lot — it cooks way down.",
      "Stir fry 4–5 min until cabbage is tender but has some bite.",
      "Add sriracha and soy sauce. Toss and serve.",
    ],
  },
  {
    id:"m12", category:"mains", emoji:"🫑",
    name:"Beef Stuffed Peppers",
    calories:460, protein:42,
    note:"Brown beef with taco seasoning. Stuff into halved bell peppers, top with cheese, bake 20 min at 375°F.",
    ingredients:[
      { name:"88/12 ground beef", grams:170, unit:"g", groceryKey:"ground_beef_88", isRaw:true },
      { name:"Bell peppers",      grams:200, unit:"g", groceryKey:"bell_peppers" },
      { name:"Shredded cheese",   grams:28,  unit:"g", groceryKey:"shredded_cheese" },
      { name:"Salsa",             grams:null, unit:"tbsp", groceryKey:null, measure:"3 tbsp" },
    ],
    steps:[
      "Preheat oven to 375°F.",
      "Halve 2 bell peppers lengthwise, remove seeds. Place cut-side up on a baking sheet.",
      "Brown 170g beef with taco seasoning. Drain fat.",
      "Stir in 3 tbsp salsa. Spoon beef mixture into pepper halves.",
      "Top with 28g shredded cheese. Bake 20 min until peppers are tender and cheese is bubbling.",
    ],
  },
  {
    id:"m13", category:"mains", emoji:"🥩",
    name:"Steak & Green Beans",
    calories:450, protein:50,
    note:"Pan sear steak to your preferred temp. Steam green beans. Simple — let the protein do the work.",
    ingredients:[
      { name:"Sirloin steak",      grams:200, unit:"g", groceryKey:"sirloin_steak",      isRaw:true },
      { name:"Frozen green beans", grams:200, unit:"g", groceryKey:"frozen_green_beans" },
      { name:"Hot sauce",          grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Take 200g sirloin out of fridge 15 min before cooking. Pat dry, season with salt and pepper.",
      "Heat a cast iron or heavy pan until smoking hot. Add a little oil.",
      "Sear steak 2–3 min per side for medium (adjust to preference).",
      "Rest steak 5 min before slicing.",
      "Microwave 200g frozen green beans 3–4 min. Serve alongside steak with hot sauce.",
    ],
  },
  {
    id:"m14", category:"mains", emoji:"🥩",
    name:"Steak & Asparagus",
    calories:440, protein:50,
    note:"Pan sear steak. Roast asparagus at 425°F for 12 min. Season with salt and garlic.",
    ingredients:[
      { name:"Sirloin steak", grams:200, unit:"g", groceryKey:"sirloin_steak", isRaw:true },
      { name:"Asparagus",     grams:200, unit:"g", groceryKey:"asparagus" },
      { name:"Hot sauce",     grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Preheat oven to 425°F. Trim asparagus ends.",
      "Toss asparagus with oil, salt, garlic powder. Roast 12 min.",
      "Pat 200g sirloin dry, season with salt and pepper.",
      "Sear in a hot pan 2–3 min per side. Rest 5 min.",
      "Slice steak, serve with roasted asparagus and hot sauce.",
    ],
  },
  {
    id:"m15", category:"mains", emoji:"🍲",
    name:"High Protein Chicken Soup",
    calories:380, protein:48,
    note:"Shred bulk chicken into chicken broth with frozen veg. Simmer 10 min. Add hot sauce.",
    ingredients:[
      { name:"Chicken breast (raw)", grams:200, unit:"g", groceryKey:"chicken_breast",      isRaw:true },
      { name:"Chicken broth",        grams:480, unit:"g", groceryKey:"chicken_broth" },
      { name:"Frozen stir fry mix",  grams:150, unit:"g", groceryKey:"frozen_stir_fry_mix" },
      { name:"Hot sauce",            grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Bulk cook 200g chicken breast (bake or poach). Shred with forks.",
      "Pour 480g (about 2 cups) chicken broth into a pot. Bring to simmer.",
      "Add 150g frozen stir fry veg. Simmer 5 min.",
      "Add shredded chicken. Simmer another 3–4 min.",
      "Ladle into bowl, hit with hot sauce.",
    ],
  },
  {
    id:"m16", category:"mains", emoji:"🌯",
    name:"Spicy Chicken Wrap",
    calories:470, protein:50,
    note:"Shred bulk chicken, add sriracha, stuff into carb balance tortilla with romaine and cheese.",
    ingredients:[
      { name:"Chicken breast (raw)",   grams:170, unit:"g", groceryKey:"chicken_breast",          isRaw:true },
      { name:"Carb balance tortillas", grams:null, unit:"count", groceryKey:"carb_balance_tortillas", count:1, measure:"1 tortilla" },
      { name:"Romaine lettuce",        grams:80,  unit:"g", groceryKey:"romaine_lettuce" },
      { name:"Shredded cheese",        grams:28,  unit:"g", groceryKey:"shredded_cheese" },
      { name:"Sriracha",               grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Shred bulk-cooked chicken (170g raw). Toss with 2 tbsp sriracha.",
      "Warm carb balance tortilla 20 sec in microwave.",
      "Lay romaine leaves down the center of the tortilla.",
      "Add sriracha chicken, top with shredded cheese.",
      "Fold sides in, roll tight. Eat immediately.",
    ],
  },
  {
    id:"m17", category:"mains", emoji:"🍗",
    name:"One Pan Chicken & Rice Bake",
    calories:520, protein:50,
    note:"Raw chicken over dry rice + broth in a baking dish. Cover with foil, bake 375°F for 45 min. Set it and forget it.",
    ingredients:[
      { name:"Chicken breast (raw)", grams:200, unit:"g", groceryKey:"chicken_breast", isRaw:true },
      { name:"White rice (dry)",     grams:90,  unit:"g", groceryKey:"white_rice" },
      { name:"Chicken broth",        grams:360, unit:"g", groceryKey:"chicken_broth" },
      { name:"Hot sauce",            grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Preheat oven to 375°F.",
      "Pour 90g dry rice into a baking dish. Pour 360g chicken broth over rice.",
      "Season 200g raw chicken breast and place on top of the rice.",
      "Cover tightly with foil. Bake 45 min — do not lift the foil.",
      "Remove foil, let rest 5 min. Rice absorbs the broth perfectly. Hit with hot sauce.",
    ],
  },
  {
    id:"m18", category:"mains", emoji:"🥔",
    name:"Crispy Potato & Ground Beef Hash",
    calories:490, protein:40,
    note:"Air fry cubed russet potatoes at 400°F for 18 min until crispy. Brown beef in pan, combine. Hot sauce on top.",
    ingredients:[
      { name:"88/12 ground beef", grams:170, unit:"g", groceryKey:"ground_beef_88",  isRaw:true },
      { name:"Russet potatoes",   grams:250, unit:"g", groceryKey:"russet_potatoes" },
      { name:"Hot sauce",         grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Cube 250g russet potato. Toss with oil, salt, garlic powder.",
      "Air fry at 400°F for 18 min, shaking at 9 min mark. Should be golden and crispy.",
      "Brown 170g ground beef in a pan. Drain fat.",
      "Combine crispy potatoes with beef in the pan. Toss 1 min.",
      "Plate and hit with hot sauce.",
    ],
  },
  {
    id:"m19", category:"mains", emoji:"🍠",
    name:"Spicy Chicken & Sweet Potato Bowl",
    calories:480, protein:46,
    note:"Air fry sweet potato cubes at 400°F for 20 min. Top with bulk-cooked sriracha chicken and green onion.",
    ingredients:[
      { name:"Chicken breast (raw)", grams:200, unit:"g", groceryKey:"chicken_breast", isRaw:true },
      { name:"Sweet potatoes",       grams:250, unit:"g", groceryKey:"sweet_potatoes" },
      { name:"Green onion",          grams:30,  unit:"g", groceryKey:"green_onion" },
      { name:"Sriracha",             grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Cube 250g sweet potato. Toss with oil and salt.",
      "Air fry at 400°F for 20 min, shaking halfway.",
      "Slice or shred bulk-cooked chicken (200g raw). Toss with sriracha.",
      "Build bowl: sweet potato base, chicken on top.",
      "Slice green onion, scatter over bowl.",
    ],
  },
  {
    id:"m20", category:"mains", emoji:"🍠",
    name:"Ground Turkey Sweet Potato Skillet",
    calories:460, protein:42,
    note:"Air fry sweet potato cubes. Cook turkey with taco seasoning in pan. Combine, top with salsa and hot sauce.",
    ingredients:[
      { name:"Ground turkey",  grams:170, unit:"g", groceryKey:"ground_turkey",  isRaw:true },
      { name:"Sweet potatoes", grams:250, unit:"g", groceryKey:"sweet_potatoes" },
      { name:"Salsa",          grams:null, unit:"tbsp", groceryKey:null, measure:"3 tbsp" },
      { name:"Hot sauce",      grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Cube 250g sweet potato, air fry at 400°F for 20 min.",
      "Brown 170g ground turkey with taco seasoning, 4–5 min.",
      "Combine turkey and sweet potato in the pan. Toss 1 min.",
      "Plate and spoon salsa and hot sauce over top.",
    ],
  },
  {
    id:"m21", category:"mains", emoji:"🥩",
    name:"Steak & Crispy Potato Bowl",
    calories:520, protein:48,
    note:"Air fry cubed russet potatoes at 400°F for 18 min. Pan sear steak. Combine in bowl with hot sauce.",
    ingredients:[
      { name:"Sirloin steak",   grams:200, unit:"g", groceryKey:"sirloin_steak",   isRaw:true },
      { name:"Russet potatoes", grams:250, unit:"g", groceryKey:"russet_potatoes" },
      { name:"Hot sauce",       grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Cube 250g russet potato, season, air fry at 400°F for 18 min.",
      "Pat 200g sirloin dry, season well with salt and pepper.",
      "Sear steak in a hot pan 2–3 min per side. Rest 5 min.",
      "Slice steak, combine with crispy potatoes in a bowl.",
      "Hit with hot sauce.",
    ],
  },
  {
    id:"m22", category:"mains", emoji:"🍳",
    name:"Buffalo Chicken & Sweet Potato Bowl",
    calories:470, protein:46,
    note:"Air fry sweet potato cubes. Toss bulk-cooked chicken in hot sauce + a little butter. Combine in bowl.",
    ingredients:[
      { name:"Chicken breast (raw)", grams:200, unit:"g", groceryKey:"chicken_breast", isRaw:true },
      { name:"Sweet potatoes",       grams:250, unit:"g", groceryKey:"sweet_potatoes" },
      { name:"Hot sauce",            grams:null, unit:"tbsp", groceryKey:null, measure:"3 tbsp" },
    ],
    steps:[
      "Cube 250g sweet potato, air fry at 400°F for 20 min.",
      "Shred or dice bulk-cooked chicken (200g raw).",
      "In a bowl, toss chicken with 3 tbsp hot sauce (and a tiny knob of butter if you have it).",
      "Build bowl: sweet potato base, buffalo chicken on top.",
      "Extra hot sauce on top if you want heat.",
    ],
  },

  // ─── SNACKS (8) ──────────────────────────────────────────────────────────

  {
    id:"s1", category:"snacks", emoji:"🥚",
    name:"Full Egg Scramble",
    calories:215, protein:19,
    note:"3 whole eggs, scrambled. Hot sauce and salt. Cheapest protein on earth.",
    ingredients:[
      { name:"Whole eggs", grams:null, unit:"count", groceryKey:"eggs", count:3, measure:"3 eggs" },
      { name:"Hot sauce",  grams:null, unit:"tbsp",  groceryKey:null,   measure:"2 tbsp" },
    ],
    steps:[
      "Crack 3 eggs into a bowl, whisk with a pinch of salt.",
      "Heat a non-stick pan over medium-low. Add a tiny bit of butter or oil.",
      "Pour in eggs. Stir slowly and constantly with a spatula.",
      "Pull off heat just before fully set — residual heat finishes them.",
      "Hit with hot sauce.",
    ],
  },
  {
    id:"s2", category:"snacks", emoji:"🦃",
    name:"Deli Turkey & Pickles",
    calories:100, protein:18,
    note:"3oz deli turkey, dill pickles, mustard. Zero cook time.",
    ingredients:[
      { name:"Deli turkey breast", grams:85,  unit:"g",    groceryKey:"deli_turkey" },
      { name:"Dill pickles",       grams:null, unit:"tbsp", groceryKey:null, measure:"as many as you want" },
    ],
    steps:[
      "Pull 85g deli turkey from the package.",
      "Grab dill pickles from the jar.",
      "Eat together. Add mustard if you want. Zero cooking required.",
    ],
  },
  {
    id:"s3", category:"snacks", emoji:"🌯",
    name:"Deli Wrap",
    calories:170, protein:23,
    note:"Carb balance tortilla, 3oz turkey, hot sauce, pickles, mustard. 2 min assembly.",
    ingredients:[
      { name:"Deli turkey breast",     grams:85,  unit:"g",     groceryKey:"deli_turkey" },
      { name:"Carb balance tortillas", grams:null, unit:"count", groceryKey:"carb_balance_tortillas", count:1, measure:"1 tortilla" },
      { name:"Hot sauce",              grams:null, unit:"tbsp",  groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Lay a carb balance tortilla flat.",
      "Layer 85g deli turkey down the center.",
      "Add hot sauce, pickles, and mustard to taste.",
      "Roll tight and eat. Done in 2 minutes.",
    ],
  },
  {
    id:"s4", category:"snacks", emoji:"🫙",
    name:"Cottage Cheese Bowl",
    calories:180, protein:25,
    note:"1 cup non-fat cottage cheese, hot sauce, everything bagel seasoning, diced dill pickle mixed in.",
    ingredients:[
      { name:"Non-fat cottage cheese", grams:226, unit:"g",    groceryKey:"cottage_cheese" },
      { name:"Hot sauce",              grams:null, unit:"tbsp", groceryKey:null, measure:"2 tbsp" },
    ],
    steps:[
      "Scoop 226g cottage cheese into a bowl.",
      "Mix in 2 tbsp hot sauce.",
      "Add everything bagel seasoning and diced dill pickle if you have them.",
      "Stir together and eat cold.",
    ],
  },
  {
    id:"s5", category:"snacks", emoji:"🍳",
    name:"Egg & Turkey Mini Scramble",
    calories:230, protein:28,
    note:"2 whole eggs + 2oz deli turkey chopped in. Sriracha on top. Heartier than a plain scramble.",
    ingredients:[
      { name:"Whole eggs",         grams:null, unit:"count", groceryKey:"eggs",       count:2, measure:"2 eggs" },
      { name:"Deli turkey breast", grams:56,   unit:"g",     groceryKey:"deli_turkey" },
      { name:"Sriracha",           grams:null, unit:"tbsp",  groceryKey:null,          measure:"1 tbsp" },
    ],
    steps:[
      "Chop 56g deli turkey into small pieces.",
      "Whisk 2 eggs with a pinch of salt.",
      "Cook in a non-stick pan over medium-low, stirring constantly.",
      "Fold in chopped turkey as eggs begin to set.",
      "Plate, hit with sriracha.",
    ],
  },
  {
    id:"s6", category:"snacks", emoji:"🫙",
    name:"Greek Yogurt Protein Bowl",
    calories:200, protein:30,
    note:"Plain non-fat Greek yogurt + half scoop protein stirred in. Thick and filling.",
    ingredients:[
      { name:"Non-fat Greek yogurt", grams:170, unit:"g", groceryKey:"greek_yogurt" },
      { name:"Whey protein powder",  grams:16,  unit:"g", groceryKey:"whey_protein" },
    ],
    steps:[
      "Scoop 170g Greek yogurt into a bowl.",
      "Add 16g (half scoop) whey protein.",
      "Stir until fully mixed and smooth.",
      "Eat immediately — thickens fast.",
    ],
  },
  {
    id:"s7", category:"snacks", emoji:"🍚",
    name:"Rice Cake Stack",
    calories:200, protein:20,
    note:"3 rice cakes, 3oz deli turkey, mustard, hot sauce. Adds crunch variety.",
    ingredients:[
      { name:"Deli turkey breast", grams:85,  unit:"g",     groceryKey:"deli_turkey" },
      { name:"Rice cakes",         grams:null, unit:"count", groceryKey:"rice_cakes",  count:3, measure:"3 rice cakes" },
      { name:"Hot sauce",          grams:null, unit:"tbsp",  groceryKey:null,          measure:"2 tbsp" },
    ],
    steps:[
      "Lay out 3 rice cakes.",
      "Top each with folded deli turkey slices (85g total).",
      "Add mustard and hot sauce to each.",
      "Eat stacked or open-faced.",
    ],
  },
  {
    id:"s8", category:"snacks", emoji:"🥤",
    name:"Protein Shake",
    calories:130, protein:25,
    note:"1 scoop whey + water. Shake and go.",
    ingredients:[
      { name:"Whey protein powder", grams:32, unit:"g", groceryKey:"whey_protein" },
    ],
    steps:[
      "Add 32g (1 scoop) whey protein to shaker.",
      "Fill with 8–12 oz cold water.",
      "Shake 10 seconds. Drink immediately.",
    ],
  },
];

// ── Grocery display names & units ─────────────────────────
export const GROCERY_DISPLAY = {
  chicken_breast:          { name:"Chicken breast (raw)",           unit:"g",     showLbs:true  },
  ground_turkey:           { name:"Ground turkey (raw)",            unit:"g",     showLbs:true  },
  ground_beef_88:          { name:"88/12 ground beef (raw)",        unit:"g",     showLbs:true  },
  sirloin_steak:           { name:"Sirloin steak (raw)",            unit:"g",     showLbs:true  },
  deli_turkey:             { name:"Deli turkey breast",             unit:"g",     showLbs:false },
  eggs:                    { name:"Eggs",                           unit:"count", showLbs:false },
  white_rice:              { name:"White rice (dry)",               unit:"g",     showLbs:false },
  frozen_broccoli:         { name:"Frozen broccoli",                unit:"g",     showLbs:false },
  frozen_green_beans:      { name:"Frozen green beans",             unit:"g",     showLbs:false },
  frozen_stir_fry_mix:     { name:"Frozen stir fry mix",            unit:"g",     showLbs:false },
  romaine_lettuce:         { name:"Romaine lettuce",                unit:"g",     showLbs:false },
  shredded_cheese:         { name:"Shredded cheese",                unit:"g",     showLbs:false },
  green_cabbage:           { name:"Green cabbage",                  unit:"g",     showLbs:false },
  zucchini:                { name:"Zucchini",                       unit:"g",     showLbs:false },
  bell_peppers:            { name:"Bell peppers",                   unit:"g",     showLbs:false },
  asparagus:               { name:"Asparagus",                      unit:"g",     showLbs:false },
  russet_potatoes:         { name:"Russet potatoes",                unit:"g",     showLbs:false },
  sweet_potatoes:          { name:"Sweet potatoes",                 unit:"g",     showLbs:false },
  green_onion:             { name:"Green onion",                    unit:"g",     showLbs:false },
  chicken_broth:           { name:"Chicken broth",                  unit:"g",     showLbs:false },
  greek_yogurt:            { name:"Non-fat Greek yogurt",           unit:"g",     showLbs:false },
  cottage_cheese:          { name:"Non-fat cottage cheese",         unit:"g",     showLbs:false },
  whey_protein:            { name:"Whey protein powder",            unit:"g",     showLbs:false },
  carb_balance_tortillas:  { name:"Mission Carb Balance tortillas", unit:"count", showLbs:false },
  rice_cakes:              { name:"Rice cakes",                     unit:"count", showLbs:false },
};
