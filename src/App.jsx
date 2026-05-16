import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dwjudarvcndjbtsqpwjm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3anVkYXJ2Y25kamJ0c3Fwd2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTAwNDAsImV4cCI6MjA5NDQ2NjA0MH0.QaXbflHUwF-DM1zFHnU9SVhRL1eTZQhIOBmpbMr-wwI";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CAT = {
  morning: { label: "Morning Routine",    color: "#fde68a", bg: "rgba(253,230,138,0.07)" },
  health:  { label: "Health & Fitness",   color: "#4ade80", bg: "rgba(74,222,128,0.07)"  },
  work:    { label: "Work",               color: "#fbbf24", bg: "rgba(251,191,36,0.07)"  },
  home:    { label: "Home & Cleanliness", color: "#fb923c", bg: "rgba(251,146,60,0.07)"  },
  workout: { label: "Workout",            color: "#38bdf8", bg: "rgba(56,189,248,0.07)"  },
  reflect: { label: "Weekly Reset",       color: "#34d399", bg: "rgba(52,211,153,0.07)"  },
  night:   { label: "Nightly Routine",    color: "#c084fc", bg: "rgba(192,132,252,0.07)" },
};

const WORKOUTS = {
  TUE: {
    title: "Push — chest, shoulders, triceps", duration: "~45 min",
    note: "Rest 60–90 sec between sets. Use a weight where the last 2 reps are genuinely hard.",
    exercises: [
      { name: "Dumbbell bench press",      tip: "Flat bench · 2 sec descent",           sets: 4, reps: "8–10"       },
      { name: "Incline dumbbell press",    tip: "Bench ~45° · upper chest focus",        sets: 3, reps: "10–12"      },
      { name: "Seated shoulder press",     tip: "Don't arch your lower back",            sets: 3, reps: "10–12"      },
      { name: "Lateral raises",            tip: "Light weight · lead with elbows",       sets: 3, reps: "12–15"      },
      { name: "Overhead tricep extension", tip: "One DB held with both hands",           sets: 3, reps: "12–15"      },
      { name: "Tricep kickback",           tip: "Hinge forward · elbow pinned",          sets: 2, reps: "15"         },
    ],
  },
  THU: {
    title: "Pull — back, biceps, rear delts", duration: "~45 min",
    note: "Balances Tuesday's push. Rest 60–90 sec between sets.",
    exercises: [
      { name: "Dumbbell bent-over row",    tip: "Both arms · flat back, brace core",    sets: 4, reps: "8–10"       },
      { name: "Single-arm dumbbell row",   tip: "Brace on bench · pull elbow to hip",   sets: 3, reps: "10–12 each" },
      { name: "Dumbbell reverse fly",      tip: "Hinged forward · light, rear delts",   sets: 3, reps: "12–15"      },
      { name: "Dumbbell shrug",            tip: "Straight arms · hold 1 sec at top",    sets: 3, reps: "12–15"      },
      { name: "Alternating dumbbell curl", tip: "Full range · no swinging",             sets: 3, reps: "12–15"      },
      { name: "Hammer curl",               tip: "Neutral grip · works brachialis too",  sets: 2, reps: "12"         },
    ],
  },
  SUN: {
    title: "Legs + core — quads, hamstrings, glutes", duration: "~45 min",
    note: "Two full rest days after Thursday. Legs burn the most calories and keep metabolism elevated for days.",
    exercises: [
      { name: "Goblet squat",      tip: "Hold one heavy DB at chest · full depth",  sets: 4, reps: "12–15"    },
      { name: "Romanian deadlift", tip: "Both DBs · hinge at hips, soft knees",     sets: 4, reps: "10–12"    },
      { name: "Reverse lunge",     tip: "DBs at sides · knee ~1\" from floor",      sets: 3, reps: "10 each"  },
      { name: "Dumbbell step-up",  tip: "Use bench · drive through heel",           sets: 3, reps: "10 each"  },
      { name: "Sumo squat",        tip: "Wide stance · one DB between legs",        sets: 3, reps: "15"       },
      { name: "Plank",             tip: "Elbows on floor · neutral spine",          sets: 3, reps: "30–45 sec"},
    ],
  },
};

const MORNING_ALWAYS = [
  { id:"m1", category:"morning", label:"Brush your teeth",           icon:"🪥" },
  { id:"m2", category:"morning", label:"Wash your face",             icon:"🧴" },
  { id:"m3", category:"morning", label:"Eat a nutritious breakfast", icon:"🥗" },
];
const HEALTH_ALWAYS = [
  { id:"d1", category:"health", label:"Drink 8 glasses of water",     icon:"💧" },
  { id:"d2", category:"health", label:"Avoid late-night snacking",     icon:"🌙" },
  { id:"d3", category:"health", label:"Treadmill walk (7,500+ steps)", icon:"🚶" },
  { id:"d4", category:"health", label:"In bed by a consistent time",   icon:"🛌" },
];
const WORK_ITEM = { id:"w1", category:"work", label:"Log & track tips for today", icon:"💰" };
const HOME_ALWAYS = [
  { id:"h1", category:"home", label:"Make your bed",                         icon:"🛏️" },
  { id:"h2", category:"home", label:"Wash any dishes used today",            icon:"🍽️" },
  { id:"h3", category:"home", label:"Quick 10-min tidy of main living area", icon:"🧹" },
];
const EXTRA_HOME = {
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
const TUE_REFLECT = [
  { id:"r1", category:"reflect", label:"Weigh in — same time, before eating",          icon:"⚖️" },
  { id:"r2", category:"reflect", label:"Review last week — what did you hit or miss?", icon:"📋" },
  { id:"r3", category:"reflect", label:"Set your focus & intentions for this week",    icon:"🎯" },
];
const NIGHTLY_ALWAYS = [
  { id:"n1", category:"night", label:"Shower",                        icon:"🚿" },
  { id:"n2", category:"night", label:"Brush your teeth",              icon:"🪥" },
  { id:"n3", category:"night", label:"Take your meds",                icon:"💊" },
  { id:"n4", category:"night", label:"Tidy your gaming area",         icon:"🎮" },
  { id:"n5", category:"night", label:"Lay out tomorrow's clothes",    icon:"👕" },
  { id:"n6", category:"night", label:"Double check your backpack",    icon:"🎒" },
];

const DEFAULT_ERRANDS = [
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

const DAYS       = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
const DAY_LABELS = { MON:"Monday",TUE:"Tuesday",WED:"Wednesday",THU:"Thursday",FRI:"Friday",SAT:"Saturday",SUN:"Sunday" };
const DAY_SHORT  = { MON:"Mon",TUE:"Tue",WED:"Wed",THU:"Thu",FRI:"Fri",SAT:"Sat",SUN:"Sun" };
const WORK_DAYS  = new Set(["MON","FRI","SAT"]);
const OFF_DAYS   = new Set(["TUE","WED","THU","SUN"]);
const WORKOUT_DAYS = { TUE: WORKOUTS.TUE, THU: WORKOUTS.THU, SUN: WORKOUTS.SUN };

function getWeekKey() {
  const d=new Date(), jan1=new Date(d.getFullYear(),0,1);
  return `${d.getFullYear()}-W${Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7)}`;
}
function getTodayCode() {
  return ["SUN","MON","TUE","WED","THU","FRI","SAT"][new Date().getDay()];
}
function getItemsForDay(day) {
  const prefix = (items) => items.map(item => ({ ...item, id: `${day}_${item.id}` }));
  const items = [...prefix(MORNING_ALWAYS), ...prefix(HEALTH_ALWAYS)];
  if (WORK_DAYS.has(day)) items.push({ ...WORK_ITEM, id: `${day}_${WORK_ITEM.id}` });
  if (day === "TUE") items.push(...prefix(TUE_REFLECT));
  items.push(...prefix(HOME_ALWAYS), ...prefix(EXTRA_HOME[day]||[]));
  if (WORKOUT_DAYS[day]) items.push({
    id:`workout_${day}`, category:"workout",
    label:`Strength session (${WORKOUT_DAYS[day].duration})`,
    icon:"💪", isWorkout:true, day,
  });
  items.push(...prefix(NIGHTLY_ALWAYS));
  return items;
}

// ── ProgressRing ──────────────────────────────────────────
function ProgressRing({ pct, color, size=44 }) {
  const r=(size-8)/2, circ=2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
        strokeLinecap="round" style={{transition:"stroke-dashoffset 0.5s ease"}}/>
    </svg>
  );
}

// ── Workout Modal ─────────────────────────────────────────
function WorkoutModal({ day, onClose }) {
  const w = WORKOUTS[day];
  if (!w) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",
      zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#18181d",borderRadius:"20px 20px 0 0",
        border:"1px solid rgba(255,255,255,0.08)",width:"100%",maxWidth:540,
        maxHeight:"82vh",overflowY:"auto",padding:"24px 20px 40px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#38bdf8",
              textTransform:"uppercase",marginBottom:4}}>{DAY_LABELS[day]} · Strength</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600}}>{w.title}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.07)",border:"none",
            color:"#888",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{fontSize:12,color:"#888",background:"rgba(255,255,255,0.04)",
          borderRadius:8,padding:"10px 12px",marginBottom:16,lineHeight:1.6}}>{w.note}</div>
        {w.exercises.map((ex,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"11px 0",borderBottom:i<w.exercises.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
            <div>
              <div style={{fontSize:14,fontWeight:500,color:"#ece9e3"}}>{ex.name}</div>
              <div style={{fontSize:11,color:"#666",marginTop:2}}>{ex.tip}</div>
            </div>
            <span style={{fontSize:12,background:"rgba(56,189,248,0.12)",color:"#38bdf8",
              borderRadius:5,padding:"2px 8px",fontFamily:"monospace",flexShrink:0,marginLeft:12}}>
              {ex.sets} × {ex.reps}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Errands Panel ─────────────────────────────────────────
function ErrandsPanel({ errands, errandsDone, toggleErrand, onAddErrand, onDeleteErrand }) {
  const [newTask, setNewTask] = useState("");
  const done=errands.filter(e=>errandsDone[e.id]).length, total=errands.length;
  const pct=total?Math.round((done/total)*100):0;
  function handleAdd() {
    const t=newTask.trim(); if(!t) return;
    onAddErrand(t); setNewTask("");
  }
  return (
    <div style={{padding:"18px 20px 0"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,marginBottom:2}}>Weekly To-Dos</div>
          <div style={{fontSize:11,color:"#555"}}>Hit these any day you're off — Tue, Wed, Thu, or Sun</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:20,fontWeight:600,color:"#f9a8d4"}}>{pct}%</div>
          <div style={{fontSize:11,color:"#555"}}>{done}/{total}</div>
        </div>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden",marginBottom:18}}>
        <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#f9a8d4,#a78bfa)",
          borderRadius:99,transition:"width 0.4s ease"}}/>
      </div>
      <div style={{background:"#17171d",border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:14,overflow:"hidden",marginBottom:16}}>
        {errands.map((item,idx)=>{
          const isDone=!!errandsDone[item.id];
          return (
            <div key={item.id} className="row" style={{display:"flex",alignItems:"center",
              gap:12,padding:"13px 14px",
              borderBottom:idx<errands.length-1?"1px solid rgba(255,255,255,0.045)":"none",
              background:isDone?"rgba(249,168,212,0.07)":"transparent"}}>
              <div className="chk" onClick={()=>toggleErrand(item.id)}
                style={{width:21,height:21,borderRadius:6,flexShrink:0,
                  border:isDone?"none":"2px solid rgba(255,255,255,0.18)",
                  background:isDone?"#f9a8d4":"transparent",
                  display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                {isDone&&<svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4.5L4 7.5L10 1" stroke="#0d0d10" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{fontSize:15,flexShrink:0}}>{item.icon||"📌"}</span>
              <span onClick={()=>toggleErrand(item.id)} style={{fontSize:14,flex:1,cursor:"pointer",
                color:isDone?"#555":"#dbd7cf",textDecoration:isDone?"line-through":"none"}}>
                {item.label}
              </span>
              {item.custom&&(
                <button onClick={()=>onDeleteErrand(item.id)}
                  style={{background:"none",border:"none",color:"#444",cursor:"pointer",
                    fontSize:16,padding:"0 2px",lineHeight:1}}>×</button>
              )}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={newTask} onChange={e=>setNewTask(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleAdd()}
          placeholder="Add a one-off errand…"
          style={{flex:1,background:"#17171d",border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:10,padding:"10px 14px",color:"#ece9e3",fontSize:13,
            fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
        <button onClick={handleAdd}
          style={{background:"#f9a8d4",color:"#0d0d10",border:"none",borderRadius:10,
            padding:"10px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:13,
            fontWeight:600,cursor:"pointer",flexShrink:0}}>Add</button>
      </div>
      {pct===100&&total>0&&(
        <div style={{marginTop:16,padding:"16px 18px",
          background:"linear-gradient(135deg,rgba(249,168,212,0.1),rgba(167,139,250,0.1))",
          border:"1px solid rgba(249,168,212,0.2)",borderRadius:14,textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:4}}>✅</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:3}}>All errands done!</div>
          <div style={{fontSize:12,color:"#666"}}>Even the dad call. Impressive.</div>
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────
export default function App() {
  const todayCode = getTodayCode();
  const [view, setView]               = useState("days");
  const [activeDay, setActiveDay]     = useState(todayCode);
  const [checked, setChecked]         = useState({});
  const [errandsDone, setErrandsDone] = useState({});
  const [customErrands, setCustomErrands] = useState([]);
  const [workoutModal, setWorkoutModal]   = useState(null);
  const [loading, setLoading]             = useState(true);

  const wk = getWeekKey();

  // ── Load from Supabase ──
  useEffect(()=>{
    async function load() {
      const { data, error } = await supabase
        .from("checklist_progress")
        .select("*")
        .eq("id","singleton")
        .single();
      if (data && !error) {
        const savedWeek = data.checked?.week;
        if (savedWeek === wk) {
          setChecked(data.checked?.data || {});
          setErrandsDone(data.errands_done?.data || {});
        } else {
          // New week — reset checked and errands_done but keep custom errands
          setChecked({});
          setErrandsDone({});
        }
        setCustomErrands(data.errands_custom || []);
      }
      setLoading(false);
    }
    load();
  },[]);

  // ── Save to Supabase ──
  async function saveToSupabase(newChecked, newErrandsDone, newCustomErrands) {
    await supabase
      .from("checklist_progress")
      .update({
        checked:        { week: wk, data: newChecked },
        errands_done:   { week: wk, data: newErrandsDone },
        errands_custom: newCustomErrands,
        updated_at:     new Date().toISOString(),
      })
      .eq("id","singleton");
  }

  function toggle(id) {
    setChecked(prev=>{
      const next={...prev,[id]:!prev[id]};
      saveToSupabase(next, errandsDone, customErrands);
      return next;
    });
  }
  function toggleErrand(id) {
    setErrandsDone(prev=>{
      const next={...prev,[id]:!prev[id]};
      saveToSupabase(checked, next, customErrands);
      return next;
    });
  }
  function addErrand(label) {
    const newE={id:`custom_${Date.now()}`,label,icon:"📌",custom:true};
    setCustomErrands(prev=>{
      const next=[...prev,newE];
      saveToSupabase(checked, errandsDone, next);
      return next;
    });
  }
  function deleteErrand(id) {
    setCustomErrands(prev=>{
      const next=prev.filter(e=>e.id!==id);
      saveToSupabase(checked, errandsDone, next);
      return next;
    });
    setErrandsDone(prev=>{
      const next={...prev}; delete next[id];
      return next;
    });
  }

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  async function resetAll() {
    setChecked({});
    setErrandsDone({});
    setShowResetConfirm(false);
    await saveToSupabase({}, {}, customErrands);
  }

  const allErrands = [...DEFAULT_ERRANDS,...customErrands];
  const errandsDoneCount = allErrands.filter(e=>errandsDone[e.id]).length;
  const errandsPct = allErrands.length?Math.round((errandsDoneCount/allErrands.length)*100):0;

  const items = getItemsForDay(activeDay);
  const done  = items.filter(i=>checked[i.id]).length;
  const pct   = Math.round((done/items.length)*100);

  const byCat = Object.keys(CAT).map(cat=>{
    const ci=items.filter(i=>i.category===cat);
    if(!ci.length) return null;
    const d=ci.filter(i=>checked[i.id]).length;
    return {cat,items:ci,done:d,pct:Math.round((d/ci.length)*100)};
  }).filter(Boolean);

  function dayProgress(day) {
    const its=getItemsForDay(day), d=its.filter(i=>checked[i.id]).length;
    return {done:d,total:its.length,pct:Math.round((d/its.length)*100)};
  }

  const daySubtitle = (day) => {
    if (WORK_DAYS.has(day)) return "Work day — track those tips!";
    if (day==="TUE") return "First day off — reflect, reset, push";
    if (WORKOUT_DAYS[day]) return "Strength + housekeeping";
    return "Recovery + housekeeping";
  };

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#0d0d10",display:"flex",
      alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
      <div style={{fontSize:28}}>📋</div>
      <div style={{color:"#555",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Loading your blueprint…</div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0d0d10",color:"#ece9e3",
      fontFamily:"'DM Sans',sans-serif",paddingBottom:60}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .row{transition:background 0.15s;cursor:pointer;}
        .row:hover{background:rgba(255,255,255,0.035)!important;}
        .chk{transition:transform 0.15s;flex-shrink:0;}
        .chk:hover{transform:scale(1.1);}
        .daypill{transition:all 0.18s;cursor:pointer;border:none;}
        .daypill:hover{opacity:0.85;}
        input::placeholder{color:#444;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:99px;}
      `}</style>

      {workoutModal&&<WorkoutModal day={workoutModal} onClose={()=>setWorkoutModal(null)}/>}

      {/* ── Header ── */}
      <div style={{background:"linear-gradient(160deg,#18181f 0%,#111116 100%)",
        borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"28px 20px 18px"}}>
        <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",
          fontSize:12,color:"#555",letterSpacing:1,marginBottom:3}}>
          {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
        </p>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18}}>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,
            fontWeight:600,lineHeight:1.25}}>Your Life Blueprint</h1>
          {!showResetConfirm ? (
            <button onClick={()=>setShowResetConfirm(true)} style={{
              background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",
              color:"#555",borderRadius:8,padding:"6px 12px",cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",fontSize:11,flexShrink:0,marginTop:4}}>
              Reset week
            </button>
          ) : (
            <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0,marginTop:4}}>
              <span style={{fontSize:11,color:"#888"}}>Sure?</span>
              <button onClick={resetAll} style={{
                background:"rgba(251,146,60,0.15)",border:"1px solid rgba(251,146,60,0.3)",
                color:"#fb923c",borderRadius:8,padding:"6px 12px",cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600}}>Yes, reset</button>
              <button onClick={()=>setShowResetConfirm(false)} style={{
                background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",
                color:"#555",borderRadius:8,padding:"6px 10px",cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",fontSize:11}}>Cancel</button>
            </div>
          )}
        </div>

        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {[["days","Daily View"],["errands","Weekly To-Dos"]].map(([v,label])=>(
            <button key={v} className="daypill" onClick={()=>setView(v)} style={{
              padding:"8px 18px",borderRadius:99,
              fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,
              background:view===v?"#ece9e3":"rgba(255,255,255,0.07)",
              color:view===v?"#0d0d10":"#777",position:"relative"}}>
              {label}
              {v==="errands"&&errandsPct>0&&errandsPct<100&&(
                <span style={{position:"absolute",top:2,right:2,width:7,height:7,
                  borderRadius:"50%",background:"#f9a8d4"}}/>
              )}
              {v==="errands"&&errandsPct===100&&(
                <span style={{position:"absolute",top:2,right:2,width:7,height:7,
                  borderRadius:"50%",background:"#4ade80"}}/>
              )}
            </button>
          ))}
        </div>

        {view==="days"&&(
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
            {DAYS.map(day=>{
              const {pct:dp,done:dd,total:dt}=dayProgress(day);
              const isToday=day===todayCode, isActive=day===activeDay;
              return (
                <button key={day} className="daypill" onClick={()=>setActiveDay(day)} style={{
                  flexShrink:0,padding:"10px 10px 8px",borderRadius:12,minWidth:48,
                  background:isActive?"#ece9e3":"rgba(255,255,255,0.06)",
                  color:isActive?"#0d0d10":isToday?"#ece9e3":"#666",
                  outline:isToday&&!isActive?"1px solid rgba(255,255,255,0.2)":"none",
                  fontFamily:"'DM Sans',sans-serif"}}>
                  <div style={{fontSize:11,fontWeight:600,marginBottom:4}}>{DAY_SHORT[day]}</div>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:3}}>
                    <svg width={20} height={20} style={{transform:"rotate(-90deg)"}}>
                      <circle cx={10} cy={10} r={7} fill="none"
                        stroke={isActive?"rgba(0,0,0,0.15)":"rgba(255,255,255,0.08)"} strokeWidth={3}/>
                      <circle cx={10} cy={10} r={7} fill="none"
                        stroke={isActive?"#0d0d10":"#4ade80"} strokeWidth={3}
                        strokeDasharray={2*Math.PI*7}
                        strokeDashoffset={2*Math.PI*7*(1-dp/100)}
                        strokeLinecap="round" style={{transition:"stroke-dashoffset 0.4s"}}/>
                    </svg>
                  </div>
                  <div style={{fontSize:9,opacity:0.6}}>{dd}/{dt}</div>
                  {WORKOUT_DAYS[day]&&<div style={{fontSize:9,marginTop:2,color:isActive?"#38bdf8":"#38bdf8"}}>💪</div>}
                  {day==="TUE"&&<div style={{fontSize:8,marginTop:1,color:"#34d399",opacity:0.8}}>reset</div>}
                  {OFF_DAYS.has(day)&&day!=="TUE"&&<div style={{fontSize:8,marginTop:1,color:"#f9a8d4",opacity:0.7}}>off</div>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {view==="errands"&&(
        <ErrandsPanel errands={allErrands} errandsDone={errandsDone}
          toggleErrand={toggleErrand} onAddErrand={addErrand} onDeleteErrand={deleteErrand}/>
      )}

      {view==="days"&&(<>
        <div style={{padding:"16px 20px 0"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600}}>
                {DAY_LABELS[activeDay]}
              </div>
              <div style={{fontSize:11,color:"#555",marginTop:2}}>{daySubtitle(activeDay)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:20,fontWeight:600}}>{pct}%</div>
              <div style={{fontSize:11,color:"#555"}}>{done}/{items.length} done</div>
            </div>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,
              background:"linear-gradient(90deg,#fde68a,#4ade80,#c084fc)",
              borderRadius:99,transition:"width 0.4s ease"}}/>
          </div>
        </div>

        <div style={{display:"flex",gap:8,padding:"14px 20px 0",flexWrap:"wrap"}}>
          {byCat.map(({cat,done:d,items:ci,pct:cp})=>(
            <div key={cat} style={{display:"flex",alignItems:"center",gap:8,
              background:CAT[cat].bg,border:`1px solid ${CAT[cat].color}1a`,
              borderRadius:10,padding:"6px 12px"}}>
              <ProgressRing pct={cp} color={CAT[cat].color} size={36}/>
              <div>
                <div style={{fontSize:9,color:"#666",marginBottom:1}}>{CAT[cat].label}</div>
                <div style={{fontSize:12,fontWeight:600,color:CAT[cat].color}}>{d}/{ci.length}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{padding:"18px 20px 0"}}>
          {byCat.map(({cat,items:ci})=>(
            <div key={cat} style={{marginBottom:22}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2.5,
                color:CAT[cat].color,textTransform:"uppercase",marginBottom:8}}>
                {CAT[cat].label}
              </div>
              <div style={{background:"#17171d",border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:14,overflow:"hidden"}}>
                {ci.map((item,idx)=>{
                  const isDone=!!checked[item.id], isWO=item.isWorkout;
                  return (
                    <div key={item.id} className="row"
                      onClick={()=>isWO?setWorkoutModal(item.day):toggle(item.id)}
                      style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",
                        borderBottom:idx<ci.length-1?"1px solid rgba(255,255,255,0.045)":"none",
                        background:isDone?CAT[cat].bg:"transparent"}}>
                      <div className="chk"
                        onClick={isWO?e=>{e.stopPropagation();toggle(item.id);}:undefined}
                        style={{width:21,height:21,borderRadius:6,
                          border:isDone?"none":"2px solid rgba(255,255,255,0.18)",
                          background:isDone?CAT[cat].color:"transparent",
                          display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                        {isDone&&<svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M1 4.5L4 7.5L10 1" stroke="#0d0d10" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span style={{fontSize:15,flexShrink:0}}>{item.icon}</span>
                      <span style={{fontSize:14,flex:1,color:isDone?"#555":"#dbd7cf",
                        textDecoration:isDone?"line-through":"none"}}>{item.label}</span>
                      {isWO&&<span style={{fontSize:11,color:"#38bdf8",flexShrink:0}}>View →</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {pct===100&&(
          <div style={{margin:"4px 20px 0",padding:"18px 20px",
            background:"linear-gradient(135deg,rgba(253,230,138,0.08),rgba(192,132,252,0.1))",
            border:"1px solid rgba(253,230,138,0.2)",borderRadius:14,textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:6}}>🎉</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,marginBottom:4}}>
              {DAY_LABELS[activeDay]} — complete!
            </div>
            <div style={{fontSize:13,color:"#666"}}>Every item checked. Keep the streak going.</div>
          </div>
        )}
      </>)}
    </div>
  );
}
