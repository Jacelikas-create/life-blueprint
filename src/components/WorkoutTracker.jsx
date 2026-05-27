import { useState, useEffect, useRef } from "react";
import { WORKOUTS, DAY_LABELS } from "../constants";
import { getWeekKey, formatDateLong } from "../utils";

const WORKOUT_DAYS = ["TUE","THU","SUN"];
const REST_SECONDS = 90;

// ── Rest Timer ────────────────────────────────────────────
function RestTimer() {
  const [timeLeft,  setTimeLeft]  = useState(REST_SECONDS);
  const [running,   setRunning]   = useState(false);
  const [done,      setDone]      = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            // Beep using Web Audio API
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              [0, 0.15, 0.3].forEach(delay => {
                const osc  = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 880;
                gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + 0.2);
              });
            } catch(e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function start() {
    setTimeLeft(REST_SECONDS);
    setDone(false);
    setRunning(true);
  }
  function reset() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setDone(false);
    setTimeLeft(REST_SECONDS);
  }

  const pct     = ((REST_SECONDS - timeLeft) / REST_SECONDS) * 100;
  const mins    = Math.floor(timeLeft / 60);
  const secs    = String(timeLeft % 60).padStart(2, "0");
  const r       = 28, circ = 2 * Math.PI * r;
  const color   = done ? "#4ade80" : running ? "#38bdf8" : "#555";

  return (
    <div style={{ padding:"14px", borderTop:"1px solid rgba(255,255,255,0.06)",
      display:"flex", alignItems:"center", gap:14 }}>
      {/* Ring */}
      <div style={{ position:"relative", flexShrink:0, width:68, height:68,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width={68} height={68} style={{ position:"absolute", transform:"rotate(-90deg)" }}>
          <circle cx={34} cy={34} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5}/>
          <circle cx={34} cy={34} r={r} fill="none" stroke={color} strokeWidth={5}
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
            strokeLinecap="round" style={{ transition:"stroke-dashoffset 0.9s linear, stroke 0.3s" }}/>
        </svg>
        <span style={{ fontSize:15, fontWeight:700, color, fontFamily:"monospace", zIndex:1 }}>
          {mins}:{secs}
        </span>
      </div>

      {/* Controls */}
      <div style={{ flex:1 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#555",
          textTransform:"uppercase", marginBottom:6 }}>
          {done ? "✓ Rest complete — get back to it!" : running ? "Resting…" : "90 sec rest timer"}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {!running && !done && (
            <button onClick={start} style={{ padding:"7px 18px", borderRadius:8, border:"none",
              background:"#38bdf8", color:"#0d0d10", fontFamily:"'DM Sans',sans-serif",
              fontSize:12, fontWeight:600, cursor:"pointer" }}>
              Start rest
            </button>
          )}
          {running && (
            <button onClick={reset} style={{ padding:"7px 18px", borderRadius:8,
              border:"1px solid rgba(255,255,255,0.1)", background:"transparent",
              color:"#888", fontFamily:"'DM Sans',sans-serif", fontSize:12, cursor:"pointer" }}>
              Cancel
            </button>
          )}
          {done && (
            <button onClick={start} style={{ padding:"7px 18px", borderRadius:8, border:"none",
              background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)",
              color:"#38bdf8", fontFamily:"'DM Sans',sans-serif",
              fontSize:12, fontWeight:600, cursor:"pointer" }}>
              Again
            </button>
          )}
          {(running || done) && (
            <button onClick={reset} style={{ padding:"7px 14px", borderRadius:8,
              border:"1px solid rgba(255,255,255,0.08)", background:"transparent",
              color:"#555", fontFamily:"'DM Sans',sans-serif", fontSize:12, cursor:"pointer" }}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StreakCard({ streak, totalWorkouts }) {
  return (
    <div style={{ display:"flex", gap:10, marginBottom:20 }}>
      <div style={{ flex:1, background:"linear-gradient(135deg,rgba(56,189,248,0.1),rgba(167,139,250,0.1))",
        border:"1px solid rgba(56,189,248,0.2)", borderRadius:14, padding:"16px", textAlign:"center" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#38bdf8",
          textTransform:"uppercase", marginBottom:6 }}>Weekly Streak</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:600,
          color:"#ece9e3", lineHeight:1, marginBottom:4 }}>{streak}</div>
        <div style={{ fontSize:11, color:"#555" }}>
          {streak===0?"Start your streak this week!":streak===1?"1 week strong 🔥":`${streak} weeks in a row 🔥`}
        </div>
      </div>
      <div style={{ flex:1, background:"rgba(255,255,255,0.04)",
        border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"16px", textAlign:"center" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#a78bfa",
          textTransform:"uppercase", marginBottom:6 }}>Total Workouts</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:600,
          color:"#ece9e3", lineHeight:1, marginBottom:4 }}>{totalWorkouts}</div>
        <div style={{ fontSize:11, color:"#555" }}>
          {totalWorkouts===0?"First one coming up!":totalWorkouts===1?"First one done ✓":"sessions completed"}
        </div>
      </div>
    </div>
  );
}

function ExerciseRow({ exercise, currentWeight, lastWeight, onChange, locked }) {
  const diff  = currentWeight && lastWeight ? currentWeight - lastWeight : null;
  const arrow = diff===null?null:diff>0?"🟢":diff<0?"🔴":"⚪";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
      borderBottom:"1px solid rgba(255,255,255,0.045)" }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:500, color:"#dbd7cf" }}>{exercise.name}</div>
        <div style={{ fontSize:10, color:"#555", marginTop:2 }}>{exercise.tip.split("·").pop().trim()}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        {lastWeight&&<div style={{ fontSize:10, color:"#555", minWidth:40, textAlign:"right" }}>{arrow} {lastWeight}</div>}
        <input type="number" value={currentWeight||""} onChange={e=>!locked&&onChange(parseFloat(e.target.value)||"")}
          placeholder="lbs" disabled={locked}
          style={{ width:60, background:locked?"rgba(255,255,255,0.03)":"#0d0d10",
            border:`1px solid ${locked?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.12)"}`,
            borderRadius:8, padding:"6px 8px", color:locked?"#444":"#ece9e3",
            fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", textAlign:"center",
            cursor:locked?"not-allowed":"text" }}/>
      </div>
    </div>
  );
}

function HistoryCard({ dayKey, log, workout }) {
  const [open, setOpen] = useState(false);
  if (!log?.lockedDate) return null;
  return (
    <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:12, marginBottom:10, overflow:"hidden" }}>
      <div onClick={()=>setOpen(o=>!o)} style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", padding:"12px 14px", cursor:"pointer" }}>
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:"#dbd7cf" }}>
            {DAY_LABELS[dayKey]} — {log.lockedDate}
          </div>
          <div style={{ fontSize:10, color:"#555", marginTop:2 }}>{workout.title}</div>
        </div>
        <span style={{ color:"#555", fontSize:14, transform:open?"rotate(180deg)":"none",
          transition:"transform 0.2s" }}>▾</span>
      </div>
      {open&&(
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"12px 14px" }}>
          {workout.exercises.map(ex=>(
            <div key={ex.id} style={{ display:"flex", justifyContent:"space-between",
              padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize:12, color:"#888" }}>{ex.name}</span>
              <span style={{ fontSize:12, fontWeight:600, color:"#ece9e3" }}>
                {log.weights?.[ex.id]?`${log.weights[ex.id]} lbs`:"—"}
              </span>
            </div>
          ))}
          {log.note&&(
            <div style={{ marginTop:10, padding:"10px 12px", background:"rgba(255,255,255,0.03)",
              borderRadius:8, fontSize:12, color:"#888", lineHeight:1.6, fontStyle:"italic" }}>
              "{log.note}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function WorkoutTracker({ workoutLogs, onSaveLog, onSaveDraft, streak, totalWorkouts }) {
  const wk        = getWeekKey();
  const todayDate = new Date().toISOString().slice(0, 10);
  const [activeDay,    setActiveDay]    = useState("TUE");
  const [showHistory,  setShowHistory]  = useState(false);

  const workout     = WORKOUTS[activeDay];
  const currentLog  = workoutLogs[`${wk}_${activeDay}`] || {};
  const lockedDate  = currentLog.lockedDate || null;
  const isLocked    = lockedDate && lockedDate !== todayDate;
  const isSavedToday= lockedDate === todayDate;

  // Draft weights — in-progress weights before submitting
  const draftKey    = `draft_${wk}_${activeDay}`;
  const savedDraft  = workoutLogs[draftKey] || {};

  const lastWkNum   = parseInt(wk.split("W")[1]) - 1;
  const lastWkKey   = `${wk.split("W")[0]}W${lastWkNum}`;
  const lastWeights = workoutLogs[`${lastWkKey}_${activeDay}`]?.weights || {};

  // Local weight state — initialized from locked log or draft
  const [weights, setWeights] = useState(currentLog.weights || savedDraft.weights || {});
  const [note,    setNote]    = useState(currentLog.note    || savedDraft.note    || "");

  // When switching days, load that day's draft or locked weights
  function handleDayChange(day) {
    setActiveDay(day);
    const log   = workoutLogs[`${wk}_${day}`] || {};
    const draft = workoutLogs[`draft_${wk}_${day}`] || {};
    setWeights(log.weights || draft.weights || {});
    setNote(log.note       || draft.note    || "");
  }

  // Save draft to Supabase whenever weights change
  function handleWeightChange(exId, val) {
    const newWeights = {...weights, [exId]:val};
    setWeights(newWeights);
    // Save draft immediately so it persists through refresh
    onSaveDraft(activeDay, { weights:newWeights, note });
  }

  function handleNoteChange(val) {
    setNote(val);
    onSaveDraft(activeDay, { weights, note:val });
  }

  function handleSave() {
    const allFilled = workout.exercises.every(ex=>weights[ex.id]);
    if (!allFilled) return;
    onSaveLog(activeDay, { weights, note, lockedDate:todayDate });
  }

  const allFilled = workout.exercises.every(ex=>weights[ex.id]);

  // History — all past locked sessions
  const historyItems = [];
  Object.entries(workoutLogs).forEach(([key, log])=>{
    if (key.startsWith("draft_")) return;
    const parts  = key.split("_");
    if (parts.length < 2) return;
    const dayKey = parts[parts.length-1];
    if (!WORKOUTS[dayKey]) return;
    if (!log?.lockedDate) return;
    // Only exclude the currently viewed day's current week entry to avoid duplication
    const weekKey = parts.slice(0,-1).join("_");
    if (weekKey===wk && dayKey===activeDay) return;
    historyItems.push({dayKey,log,key});
  });
  historyItems.sort((a,b)=>b.log.lockedDate.localeCompare(a.log.lockedDate));

  return (
    <div style={{ padding:"18px 20px 0" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, marginBottom:4 }}>
        Workout Tracker
      </div>
      <div style={{ fontSize:11, color:"#555", marginBottom:20 }}>
        Weights save as you type · submits to history when all filled
      </div>

      <StreakCard streak={streak} totalWorkouts={totalWorkouts}/>

      {/* Day tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {WORKOUT_DAYS.map(day=>{
          const log  = workoutLogs[`${wk}_${day}`];
          const done = log?.lockedDate;
          return (
            <button key={day} onClick={()=>handleDayChange(day)} style={{
              flex:1, padding:"10px 8px", borderRadius:12, border:"none", cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600,
              background:activeDay===day?"#ece9e3":"rgba(255,255,255,0.06)",
              color:activeDay===day?"#0d0d10":done?"#4ade80":"#666",
              position:"relative" }}>
              {DAY_LABELS[day].slice(0,3)}
              {done&&activeDay!==day&&(
                <span style={{ position:"absolute", top:4, right:4, width:6, height:6,
                  borderRadius:"50%", background:"#4ade80" }}/>
              )}
            </button>
          );
        })}
      </div>

      {/* Workout card */}
      <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:14, overflow:"hidden", marginBottom:16 }}>
        <div style={{ padding:"14px 14px 12px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#38bdf8",
            textTransform:"uppercase", marginBottom:3 }}>
            {DAY_LABELS[activeDay]} · Phase 1 · {workout.rest} rest
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600 }}>
            {workout.title}
          </div>
          {Object.keys(lastWeights).length>0&&(
            <div style={{ fontSize:10, color:"#555", marginTop:4 }}>⚪ last week · 🟢 up · 🔴 down</div>
          )}
        </div>

        {workout.exercises.map(ex=>(
          <ExerciseRow key={ex.id} exercise={ex}
            currentWeight={weights[ex.id]} lastWeight={lastWeights[ex.id]}
            onChange={val=>handleWeightChange(ex.id, val)}
            locked={isLocked}/>
        ))}

        {/* Rest timer */}
        {!isLocked && <RestTimer/>}

        {/* Notes */}
        <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <textarea value={note} onChange={e=>!isLocked&&handleNoteChange(e.target.value)}
            disabled={isLocked} placeholder="Session notes — how did it feel? Any PRs?"
            rows={2} style={{ width:"100%", background:"rgba(255,255,255,0.03)",
              border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"10px 12px",
              color:isLocked?"#444":"#dbd7cf", fontSize:12, fontFamily:"'DM Sans',sans-serif",
              outline:"none", resize:"none", lineHeight:1.6,
              cursor:isLocked?"not-allowed":"text" }}/>
        </div>

        {/* Save / status */}
        <div style={{ padding:"0 14px 14px" }}>
          {isLocked ? (
            <div style={{ fontSize:12, color:"#555", textAlign:"center" }}>
              🔒 Logged on {lockedDate} — no changes allowed
            </div>
          ) : isSavedToday ? (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ fontSize:12, color:"#4ade80", textAlign:"center" }}>
                ✓ Saved — you can still update until midnight
              </div>
              <button onClick={handleSave} style={{ width:"100%", padding:"10px", borderRadius:10,
                border:"1px solid rgba(74,222,128,0.3)", background:"rgba(74,222,128,0.08)",
                color:"#4ade80", fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:"pointer" }}>
                Update log
              </button>
            </div>
          ) : (
            <button onClick={handleSave} disabled={!allFilled} style={{ width:"100%", padding:"12px",
              borderRadius:10, border:"none",
              background:allFilled?"#38bdf8":"rgba(255,255,255,0.05)",
              color:allFilled?"#0d0d10":"#444",
              fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600,
              cursor:allFilled?"pointer":"not-allowed", transition:"all 0.2s" }}>
              {allFilled?"Save workout log":"Fill in all weights to save"}
            </button>
          )}
        </div>
      </div>

      {/* Session note */}
      <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:"12px 14px",
        fontSize:12, color:"#555", lineHeight:1.6, marginBottom:20 }}>
        {workout.note}
      </div>

      {/* History toggle */}
      <button onClick={()=>setShowHistory(o=>!o)} style={{ width:"100%", padding:"12px",
        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:12, color:"#777", fontFamily:"'DM Sans',sans-serif", fontSize:13,
        cursor:"pointer", marginBottom:16 }}>
        {showHistory?"Hide":"Show"} workout history ({historyItems.length} sessions)
      </button>

      {showHistory&&(
        <div style={{ marginBottom:20 }}>
          {historyItems.length===0 ? (
            <div style={{ textAlign:"center", color:"#555", fontSize:13, padding:"20px 0" }}>
              No history yet — keep logging and it'll show up here
            </div>
          ) : (
            historyItems.map(({dayKey,log,key})=>(
              <HistoryCard key={key} dayKey={dayKey} log={log} workout={WORKOUTS[dayKey]}/>
            ))
          )}
        </div>
      )}
    </div>
  );
}
