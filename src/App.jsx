import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { getWeekKey, getTodayCode } from "./utils";
import { DEFAULT_ERRANDS } from "./constants";
import DayView from "./components/DayView";
import ErrandsPanel from "./components/ErrandsPanel";
import WeightTab from "./components/WeightTab";
import WorkoutTracker from "./components/WorkoutTracker";

export default function App() {
  const todayCode = getTodayCode();
  const wk        = getWeekKey();

  const [view,           setView]           = useState("days");
  const [checked,        setChecked]        = useState({});
  const [errandsDone,    setErrandsDone]    = useState({});
  const [customErrands,  setCustomErrands]  = useState([]);
  const [weightEntries,  setWeightEntries]  = useState([]);
  const [workoutLogs,    setWorkoutLogs]    = useState({});
  const [streak,         setStreak]         = useState(0);
  const [totalWorkouts,  setTotalWorkouts]  = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [loading,        setLoading]        = useState(true);

  // ── Load from Supabase ──────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("checklist_progress")
        .select("*")
        .eq("id", "singleton")
        .single();

      if (data && !error) {
        const savedWeek = data.checked?.week;
        if (savedWeek === wk) {
          setChecked(data.checked?.data || {});
          setErrandsDone(data.errands_done?.data || {});
        } else {
          setChecked({});
          setErrandsDone({});
        }
        setCustomErrands(data.errands_custom   || []);
        setWeightEntries(data.weight_entries   || []);
        setWorkoutLogs(data.workout_logs       || {});
        setStreak(data.streak                  || 0);
        setTotalWorkouts(data.total_workouts   || 0);
      }
      setLoading(false);
    }
    load();
  }, []);

  // ── Save helper ─────────────────────────────────────────
  async function save(patch) {
    await supabase
      .from("checklist_progress")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", "singleton");
  }

  // ── Checklist ───────────────────────────────────────────
  function toggle(id) {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      save({ checked: { week: wk, data: next } });
      return next;
    });
  }

  async function resetAll() {
    setChecked({});
    setErrandsDone({});
    setShowResetConfirm(false);
    await save({ checked: { week: wk, data: {} }, errands_done: { week: wk, data: {} } });
  }

  // ── Errands ─────────────────────────────────────────────
  function toggleErrand(id) {
    setErrandsDone(prev => {
      const next = { ...prev, [id]: !prev[id] };
      save({ errands_done: { week: wk, data: next } });
      return next;
    });
  }
  function addErrand(label) {
    const newE = { id:`custom_${Date.now()}`, label, icon:"📌", custom:true };
    setCustomErrands(prev => {
      const next = [...prev, newE];
      save({ errands_custom: next });
      return next;
    });
  }
  function deleteErrand(id) {
    setCustomErrands(prev => {
      const next = prev.filter(e => e.id !== id);
      save({ errands_custom: next });
      return next;
    });
    setErrandsDone(prev => {
      const next = { ...prev }; delete next[id];
      return next;
    });
  }

  // ── Weight ──────────────────────────────────────────────
  function addWeightEntry(entry) {
    setWeightEntries(prev => {
      const filtered = prev.filter(e => e.date !== entry.date);
      const next = [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
      save({ weight_entries: next });
      return next;
    });
  }

  // ── Workout logs ────────────────────────────────────────
  function saveWorkoutLog(day, log) {
    const key = `${wk}_${day}`;
    setWorkoutLogs(prev => {
      const next = { ...prev, [key]: log };
      // Check if all 3 workouts done this week
      const WORKOUT_DAYS = ["TUE","THU","SUN"];
      const allDone = WORKOUT_DAYS.every(d => next[`${wk}_${d}`]?.lockedDate);
      let newStreak = streak, newTotal = totalWorkouts + 1;
      // Only increment streak once per week when all 3 done
      const wasAllDone = WORKOUT_DAYS.every(d => prev[`${wk}_${d}`]?.lockedDate);
      if (allDone && !wasAllDone) newStreak = streak + 1;
      setStreak(newStreak);
      setTotalWorkouts(newTotal);
      save({ workout_logs: next, streak: newStreak, total_workouts: newTotal });
      return next;
    });
  }

  const allErrands       = [...DEFAULT_ERRANDS, ...customErrands];
  const errandsDoneCount = allErrands.filter(e => errandsDone[e.id]).length;
  const errandsPct       = allErrands.length ? Math.round((errandsDoneCount / allErrands.length) * 100) : 0;

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0d0d10", display:"flex",
      alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
      <div style={{ fontSize:28 }}>📋</div>
      <div style={{ color:"#555", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
        Loading your blueprint…
      </div>
    </div>
  );

  const TABS = [
    { id:"days",    label:"Daily"    },
    { id:"errands", label:"To-Dos"   },
    { id:"weight",  label:"Weight"   },
    { id:"workout", label:"Workouts" },
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

        {/* Title + reset */}
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
              <button onClick={resetAll} style={{
                background:"rgba(251,146,60,0.15)", border:"1px solid rgba(251,146,60,0.3)",
                color:"#fb923c", borderRadius:8, padding:"6px 12px", cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600 }}>Yes, reset</button>
              <button onClick={() => setShowResetConfirm(false)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)",
                color:"#555", borderRadius:8, padding:"6px 10px", cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", fontSize:11 }}>Cancel</button>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex", gap:6 }}>
          {TABS.map(({ id, label }) => {
            const dot = id === "errands" && errandsPct > 0 && errandsPct < 100 ? "#f9a8d4"
                      : id === "errands" && errandsPct === 100 ? "#4ade80" : null;
            return (
              <button key={id} onClick={() => setView(id)} style={{
                flex:1, padding:"8px 4px", borderRadius:99, border:"none", cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500,
                background: view === id ? "#ece9e3" : "rgba(255,255,255,0.07)",
                color: view === id ? "#0d0d10" : "#777", position:"relative",
                transition:"all 0.18s" }}>
                {label}
                {dot && <span style={{ position:"absolute", top:2, right:2, width:6, height:6,
                  borderRadius:"50%", background:dot }}/>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Views ── */}
      {view === "days" && (
        <div style={{ padding:"18px 20px 0" }}>
          <DayView
            checked={checked}
            toggle={toggle}
            todayCode={todayCode}
            showResetConfirm={showResetConfirm}
            setShowResetConfirm={setShowResetConfirm}
            resetAll={resetAll}
          />
        </div>
      )}

      {view === "errands" && (
        <ErrandsPanel
          errands={allErrands}
          errandsDone={errandsDone}
          toggleErrand={toggleErrand}
          onAddErrand={addErrand}
          onDeleteErrand={deleteErrand}
        />
      )}

      {view === "weight" && (
        <WeightTab
          weightEntries={weightEntries}
          onAddEntry={addWeightEntry}
        />
      )}

      {view === "workout" && (
        <WorkoutTracker
          workoutLogs={workoutLogs}
          onSaveLog={saveWorkoutLog}
          streak={streak}
          totalWorkouts={totalWorkouts}
        />
      )}
    </div>
  );
}
