import { useState } from "react";
import { WORKOUTS, DAY_LABELS } from "../constants";
import { getWeekKey, formatDateLong } from "../utils";

const WORKOUT_DAYS = ["TUE","THU","SUN"];

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
  const diff = currentWeight && lastWeight ? currentWeight - lastWeight : null;
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

function HistoryCard({ weekKey, dayKey, log, workout }) {
  const [open, setOpen] = useState(false);
  if (!log?.lockedDate) return null;
  const label = `${DAY_LABELS[dayKey]} — ${log.lockedDate}`;
  return (
    <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:12, marginBottom:10, overflow:"hidden" }}>
      <div onClick={() => setOpen(o=>!o)} style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", padding:"12px 14px", cursor:"pointer" }}>
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:"#dbd7cf" }}>{label}</div>
          <div style={{ fontSize:10, color:"#555", marginTop:2 }}>{workout.title}</div>
        </div>
        <span style={{ color:"#555", fontSize:14, transform:open?"rotate(180deg)":"none",
          transition:"transform 0.2s" }}>▾</span>
      </div>
      {open && (
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"12px 14px" }}>
          {workout.exercises.map(ex => (
            <div key={ex.id} style={{ display:"flex", justifyContent:"space-between",
              padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize:12, color:"#888" }}>{ex.name}</span>
              <span style={{ fontSize:12, fontWeight:600, color:"#ece9e3" }}>
                {log.weights?.[ex.id] ? `${log.weights[ex.id]} lbs` : "—"}
              </span>
            </div>
          ))}
          {log.note && (
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

export default function WorkoutTracker({ workoutLogs, onSaveLog, streak, totalWorkouts }) {
  const wk = getWeekKey();
  const [activeDay, setActiveDay] = useState("TUE");
  const [showHistory, setShowHistory] = useState(false);
  const todayDate = new Date().toISOString().slice(0, 10);
  const workout = WORKOUTS[activeDay];
  const currentLog = workoutLogs[`${wk}_${activeDay}`] || {};
  const currentWeights = currentLog.weights || {};
  const lockedDate = currentLog.lockedDate || null;
  const isLocked = lockedDate && lockedDate !== todayDate;
  const isSavedToday = lockedDate === todayDate;

  const lastWkNum = parseInt(wk.split("W")[1]) - 1;
  const lastWkKey = `${wk.split("W")[0]}W${lastWkNum}`;
  const lastWeights = workoutLogs[`${lastWkKey}_${activeDay}`]?.weights || {};

  const [weights, setWeights] = useState(currentWeights);
  const [note,    setNote]    = useState(currentLog.note || "");

  function handleDayChange(day) {
    setActiveDay(day);
    const log = workoutLogs[`${wk}_${day}`] || {};
    setWeights(log.weights || {});
    setNote(log.note || "");
  }

  function handleSave() {
    const allFilled = workout.exercises.every(ex => weights[ex.id]);
    if (!allFilled) return;
    onSaveLog(activeDay, { weights, note, lockedDate: todayDate });
  }

  const allFilled = workout.exercises.every(ex => weights[ex.id]);

  // Build history list — all past logged sessions
  const historyItems = [];
  Object.entries(workoutLogs).forEach(([key, log]) => {
    const parts = key.split("_");
    if (parts.length < 2) return;
    const dayKey = parts[parts.length - 1];
    const weekKey = parts.slice(0, -1).join("_");
    if (weekKey === wk) return; // skip current week
    if (!WORKOUTS[dayKey]) return;
    if (!log?.lockedDate) return;
    historyItems.push({ weekKey, dayKey, log, key });
  });
  historyItems.sort((a, b) => b.log.lockedDate.localeCompare(a.log.lockedDate));

  return (
    <div style={{ padding:"18px 20px 0" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, marginBottom:4 }}>
        Workout Tracker
      </div>
      <div style={{ fontSize:11, color:"#555", marginBottom:20 }}>
        Log your working weight · locks after the day ends
      </div>

      <StreakCard streak={streak} totalWorkouts={totalWorkouts}/>

      {/* Day tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {WORKOUT_DAYS.map(day => {
          const log = workoutLogs[`${wk}_${day}`];
          const done = log?.lockedDate;
          return (
            <button key={day} onClick={() => handleDayChange(day)} style={{
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

        {workout.exercises.map(ex => (
          <ExerciseRow key={ex.id} exercise={ex}
            currentWeight={weights[ex.id]} lastWeight={lastWeights[ex.id]}
            onChange={val => setWeights(prev => ({...prev,[ex.id]:val}))}
            locked={isLocked}/>
        ))}

        {/* Notes */}
        <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <textarea value={note} onChange={e=>!isLocked&&setNote(e.target.value)}
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

      {/* Note */}
      <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:"12px 14px",
        fontSize:12, color:"#555", lineHeight:1.6, marginBottom:20 }}>
        {workout.note}
      </div>

      {/* History toggle */}
      <button onClick={() => setShowHistory(o=>!o)} style={{ width:"100%", padding:"12px",
        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:12, color:"#777", fontFamily:"'DM Sans',sans-serif", fontSize:13,
        cursor:"pointer", marginBottom:16 }}>
        {showHistory?"Hide":"Show"} workout history ({historyItems.length} sessions)
      </button>

      {showHistory && (
        <div style={{ marginBottom:20 }}>
          {historyItems.length === 0 ? (
            <div style={{ textAlign:"center", color:"#555", fontSize:13, padding:"20px 0" }}>
              No history yet — keep logging and it'll show up here
            </div>
          ) : (
            historyItems.map(({ weekKey, dayKey, log, key }) => (
              <HistoryCard key={key} weekKey={weekKey} dayKey={dayKey}
                log={log} workout={WORKOUTS[dayKey]}/>
            ))
          )}
        </div>
      )}
    </div>
  );
}
