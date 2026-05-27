import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { getWeekKey, getTodayCode, getWaterDayKey } from "./utils";
import { DEFAULT_ERRANDS } from "./constants";
import DayView from "./components/DayView";
import ErrandsPanel from "./components/ErrandsPanel";
import WeightTab from "./components/WeightTab";
import WorkoutTracker from "./components/WorkoutTracker";
import FoodTab from "./components/FoodTab";
import MealPrepTab from "./components/MealPrepTab";

export default function App() {
  const todayCode = getTodayCode();
  const wk        = getWeekKey();

  const [view,             setView]             = useState("days");
  const [checked,          setChecked]          = useState({});
  const [errandsDone,      setErrandsDone]      = useState({});
  const [customErrands,    setCustomErrands]    = useState([]);
  const [weightEntries,    setWeightEntries]    = useState([]);
  const [workoutLogs,      setWorkoutLogs]      = useState({});
  const [streak,           setStreak]           = useState(0);
  const [totalWorkouts,    setTotalWorkouts]    = useState(0);
  const [waterLog,         setWaterLog]         = useState({});
  const [foodLog,          setFoodLog]          = useState(null); // null = not yet loaded
  const [foodDatabase,     setFoodDatabase]     = useState([]);
  const [mealPrep,         setMealPrep]         = useState({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [parStock,         setParStock]         = useState({});
  const [saving,           setSaving]           = useState(false);
  const [saveError,        setSaveError]        = useState(false);
  const [loading,          setLoading]          = useState(true);

  // ── Load from Supabase — single source of truth ───────────
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("checklist_progress").select("*").eq("id","singleton").single();
      if (data && !error) {
        const savedWeek = data.checked?.week;
        setChecked(savedWeek === wk ? (data.checked?.data || {}) : {});
        setErrandsDone(savedWeek === wk ? (data.errands_done?.data || {}) : {});
        setCustomErrands(data.errands_custom  || []);
        setWeightEntries(data.weight_entries  || []);
        setWorkoutLogs(data.workout_logs      || {});
        setStreak(data.streak                 || 0);
        setTotalWorkouts(data.total_workouts  || 0);
        setWaterLog(data.water_log            || {});
        setFoodLog(data.food_log              || {}); // always set from DB, never default mid-render
        setFoodDatabase(data.food_database    || []);
        setMealPrep(data.meal_prep            || {});
        setParStock(data.par_stock            || {});
      } else {
        // DB error — set safe defaults so app still renders
        setFoodLog({});
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save(patch, retries = 3) {
    setSaving(true);
    setSaveError(false);
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const { error } = await supabase
          .from("checklist_progress")
          .update({ ...patch, updated_at:new Date().toISOString() })
          .eq("id","singleton");
        if (error) throw error;
        setSaving(false);
        return true;
      } catch(e) {
        console.error(`Save attempt ${attempt + 1} failed:`, e);
        if (attempt < retries - 1) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); // exponential backoff
        }
      }
    }
    setSaving(false);
    setSaveError(true);
    setTimeout(() => setSaveError(false), 5000);
    return false;
  }

  // ── Checklist ──────────────────────────────────────────────
  function toggle(id) {
    setChecked(prev => {
      const next = {...prev,[id]:!prev[id]};
      save({ checked:{ week:wk, data:next } });
      return next;
    });
  }
  async function resetAll() {
    setChecked({});
    setErrandsDone({});
    setShowResetConfirm(false);
    await save({ checked:{ week:wk, data:{} }, errands_done:{ week:wk, data:{} } });
  }

  // ── Errands ────────────────────────────────────────────────
  function toggleErrand(id) {
    setErrandsDone(prev => {
      const next = {...prev,[id]:!prev[id]};
      save({ errands_done:{ week:wk, data:next } });
      return next;
    });
  }
  function addErrand(label) {
    const newE = { id:`custom_${Date.now()}`, label, icon:"📌", custom:true };
    setCustomErrands(prev => {
      const next = [...prev, newE];
      save({ errands_custom:next });
      return next;
    });
  }
  function deleteErrand(id) {
    setCustomErrands(prev => {
      const next = prev.filter(e => e.id !== id);
      save({ errands_custom:next });
      return next;
    });
    setErrandsDone(prev => { const next = {...prev}; delete next[id]; return next; });
  }

  // ── Water ──────────────────────────────────────────────────
  const waterDayKey  = getWaterDayKey();
  const waterGlasses = waterLog[waterDayKey] || 0;

  function onWaterTap() {
    const next = Math.min(waterGlasses + 1, 8);
    setWaterLog(prev => {
      const newLog = {...prev, [waterDayKey]:next};
      save({ water_log:newLog });
      return newLog;
    });
  }
  function onWaterUndo() {
    const next = Math.max(waterGlasses - 1, 0);
    setWaterLog(prev => {
      const newLog = {...prev, [waterDayKey]:next};
      save({ water_log:newLog });
      return newLog;
    });
  }

  // ── Weight ─────────────────────────────────────────────────
  function addWeightEntry(entry) {
    setWeightEntries(prev => {
      const filtered = prev.filter(e => e.date !== entry.date);
      const next = [...filtered, entry].sort((a,b) => a.date.localeCompare(b.date));
      save({ weight_entries:next });
      return next;
    });
  }

  // ── Workout logs ───────────────────────────────────────────
  function saveWorkoutLog(day, log) {
    const key = `${wk}_${day}`;
    setWorkoutLogs(prev => {
      const next = {...prev,[key]:log};
      const WORKOUT_DAYS = ["TUE","THU","SUN"];
      const allDone    = WORKOUT_DAYS.every(d => next[`${wk}_${d}`]?.lockedDate);
      const wasAllDone = WORKOUT_DAYS.every(d => prev[`${wk}_${d}`]?.lockedDate);
      let newStreak = streak, newTotal = totalWorkouts + 1;
      if (allDone && !wasAllDone) newStreak = streak + 1;
      setStreak(newStreak);
      setTotalWorkouts(newTotal);
      save({ workout_logs:next, streak:newStreak, total_workouts:newTotal });
      return next;
    });
  }
  // Draft — saves in-progress weights without locking or counting toward streak
  function saveDraftLog(day, draft) {
    const key = `draft_${wk}_${day}`;
    setWorkoutLogs(prev => {
      const next = {...prev, [key]:draft};
      save({ workout_logs:next });
      return next;
    });
  }

  // ── Food log ───────────────────────────────────────────────
  // updateLog: called on every food add/remove (not locked yet)
  function updateFoodLog(date, dayLog) {
    setFoodLog(prev => {
      const next = {...prev, [date]:dayLog};
      save({ food_log:next });
      return next;
    });
  }
  // submitDay: locks the day and saves final totals
  function submitDay(date, dayLog) {
    setFoodLog(prev => {
      const next = {...prev, [date]:{ ...dayLog, locked:true }};
      save({ food_log:next });
      return next;
    });
  }
  function addToFoodDatabase(food) {
    setFoodDatabase(prev => {
      const next = [...prev, food];
      save({ food_database:next });
      return next;
    });
  }

  // ── Meal prep ──────────────────────────────────────────────
  function updateMealPrep(patch) {
    setMealPrep(prev => {
      const next = {...prev,...patch};
      save({ meal_prep:next });
      return next;
    });
  }
  function updateParStock(newStock) {
    setParStock(newStock);
    save({ par_stock:newStock });
  }

  const allErrands       = [...DEFAULT_ERRANDS,...customErrands];
  const errandsDoneCount = allErrands.filter(e => errandsDone[e.id]).length;
  const errandsPct       = allErrands.length ? Math.round((errandsDoneCount/allErrands.length)*100) : 0;

  // Block render until Supabase has loaded — prevents race condition overwrite
  if (loading || foodLog === null) return (
    <div style={{ minHeight:"100vh", background:"#0d0d10", display:"flex",
      alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
      <div style={{ fontSize:28 }}>📋</div>
      <div style={{ color:"#555", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
        Loading your blueprint…
      </div>
    </div>
  );

  const TABS = [
    { id:"days",    label:"Daily"   },
    { id:"errands", label:"To-Dos"  },
    { id:"weight",  label:"Weight"  },
    { id:"workout", label:"Lift"    },
    { id:"food",    label:"Food"    },
    { id:"prep",    label:"Prep"    },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d10", color:"#ece9e3",
      fontFamily:"'DM Sans',sans-serif", paddingBottom:60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .row{transition:background 0.15s;cursor:pointer;}
        .row:hover{background:rgba(255,255,255,0.035)!important;}
        .chk{transition:transform 0.15s;flex-shrink:0;}
        .chk:hover{transform:scale(1.1);}
        input::placeholder{color:#444;}
        textarea::placeholder{color:#444;}
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:99px;}
      `}</style>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(160deg,#18181f 0%,#111116 100%)",
        borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"28px 20px 18px" }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic",
          fontSize:12, color:"#555", letterSpacing:1, marginBottom:3 }}>
          {new Date().toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric" })}
        </p>

        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:600, lineHeight:1.25 }}>
            Your Life Blueprint
          </h1>
          {!showResetConfirm ? (
            <button onClick={() => setShowResetConfirm(true)} style={{
              background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)",
              color:"#555", borderRadius:8, padding:"6px 12px", cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", fontSize:11, flexShrink:0, marginTop:4 }}>
              Reset week
            </button>
          ) : (
            <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0, marginTop:4 }}>
              <span style={{ fontSize:11, color:"#888" }}>Sure?</span>
              <button onClick={resetAll} style={{ background:"rgba(251,146,60,0.15)",
                border:"1px solid rgba(251,146,60,0.3)", color:"#fb923c", borderRadius:8,
                padding:"6px 12px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                fontSize:11, fontWeight:600 }}>Yes, reset</button>
              <button onClick={() => setShowResetConfirm(false)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)",
                color:"#555", borderRadius:8, padding:"6px 10px", cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", fontSize:11 }}>Cancel</button>
            </div>
          )}
        </div>

        <div style={{ display:"flex", gap:5, overflowX:"auto", paddingBottom:2 }}>
          {TABS.map(({ id, label }) => {
            const dot = id==="errands"&&errandsPct>0&&errandsPct<100?"#f9a8d4"
                      : id==="errands"&&errandsPct===100?"#4ade80":null;
            return (
              <button key={id} onClick={() => setView(id)} style={{
                flexShrink:0, padding:"8px 14px", borderRadius:99, border:"none",
                cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500,
                background:view===id?"#ece9e3":"rgba(255,255,255,0.07)",
                color:view===id?"#0d0d10":"#777", position:"relative", transition:"all 0.18s" }}>
                {label}
                {dot && <span style={{ position:"absolute", top:2, right:2, width:6, height:6,
                  borderRadius:"50%", background:dot }}/>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Views ── */}
      <div style={{ padding:"18px 20px 0" }}>
        {view==="days" && (
          <DayView checked={checked} toggle={toggle} todayCode={todayCode}
            waterGlasses={waterGlasses} onWaterTap={onWaterTap} onWaterUndo={onWaterUndo}
            parStock={parStock} onUpdatePar={updateParStock}/>
        )}
        {view==="errands" && (
          <ErrandsPanel errands={allErrands} errandsDone={errandsDone}
            toggleErrand={toggleErrand} onAddErrand={addErrand} onDeleteErrand={deleteErrand}/>
        )}
        {view==="weight" && (
          <WeightTab weightEntries={weightEntries} onAddEntry={addWeightEntry}/>
        )}
        {view==="workout" && (
          <WorkoutTracker workoutLogs={workoutLogs} onSaveLog={saveWorkoutLog}
            onSaveDraft={saveDraftLog} streak={streak} totalWorkouts={totalWorkouts}/>
        )}
        {view==="food" && (
          <FoodTab
            foodLog={foodLog}
            onUpdateLog={updateFoodLog}
            onSubmitDay={submitDay}
            foodDatabase={foodDatabase}
            onAddToDatabase={addToFoodDatabase}
            saving={saving}
            saveError={saveError}
          />
        )}
        {view==="prep" && (
          <MealPrepTab mealPrep={mealPrep} onUpdateMealPrep={updateMealPrep} parStock={parStock}/>
        )}
      </div>
    </div>
  );
}
