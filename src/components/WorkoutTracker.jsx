import { useState } from "react";
import { WORKOUTS, DAY_LABELS, CAT } from "../constants";
import { getWeekKey, getLastDateForDay } from "../utils";

const WORKOUT_DAYS = ["TUE", "THU", "SUN"];

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
          {streak === 0 ? "Start your streak this week!" :
           streak === 1 ? "1 week strong 🔥" :
           `${streak} weeks in a row 🔥`}
        </div>
      </div>
      <div style={{ flex:1, background:"rgba(255,255,255,0.04)",
        border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"16px", textAlign:"center" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#a78bfa",
          textTransform:"uppercase", marginBottom:6 }}>Total Workouts</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:600,
          color:"#ece9e3", lineHeight:1, marginBottom:4 }}>{totalWorkouts}</div>
        <div style={{ fontSize:11, color:"#555" }}>
          {totalWorkouts === 0 ? "First one coming up!" :
           totalWorkouts === 1 ? "First one done ✓" :
           `sessions completed`}
        </div>
      </div>
    </div>
  );
}

function ExerciseRow({ exercise, currentWeight, lastWeight, onChange, locked }) {
  const diff = currentWeight && lastWeight ? currentWeight - lastWeight : null;
  const arrow = diff === null ? null : diff > 0 ? "🟢" : diff < 0 ? "🔴" : "⚪";

  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
      borderBottom:"1px solid rgba(255,255,255,0.045)" }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:500, color:"#dbd7cf" }}>{exercise.name}</div>
        <div style={{ fontSize:10, color:"#555", marginTop:2 }}>{exercise.tip.split("·").pop().trim()}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        {lastWeight && (
          <div style={{ fontSize:10, color:"#555", minWidth:40, textAlign:"right" }}>
            {arrow} {lastWeight}
          </div>
        )}
        <div style={{ position:"relative" }}>
          <input
            type="number"
            value={currentWeight || ""}
            onChange={e => !locked && onChange(parseFloat(e.target.value) || "")}
            placeholder="lbs"
            disabled={locked}
            style={{
              width:60, background: locked ? "rgba(255,255,255,0.03)" : "#0d0d10",
              border:`1px solid ${locked ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.12)"}`,
              borderRadius:8, padding:"6px 8px", color: locked ? "#444" : "#ece9e3",
              fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", textAlign:"center",
              cursor: locked ? "not-allowed" : "text",
            }}
          />
          {!locked && <span style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)",
            fontSize:9, color:"#555", pointerEvents:"none" }}>lbs</span>}
        </div>
      </div>
    </div>
  );
}

export default function WorkoutTracker({ workoutLogs, onSaveLog, streak, totalWorkouts }) {
  const wk = getWeekKey();
  const [activeDay, setActiveDay] = useState("TUE");

  const workout = WORKOUTS[activeDay];
  const todayDate = new Date().toISOString().slice(0, 10);

  // Current week's log for this day
  const currentLog = workoutLogs[`${wk}_${activeDay}`] || {};
  const currentWeights = currentLog.weights || {};
  const lockedDate = currentLog.lockedDate || null;

  // Is this log locked? (saved on a previous date)
  const isLocked = lockedDate && lockedDate !== todayDate;

  // Last week's log
  const lastWkNum = parseInt(wk.split("W")[1]) - 1;
  const lastWkKey = `${wk.split("W")[0]}W${lastWkNum}`;
  const lastLog = workoutLogs[`${lastWkKey}_${activeDay}`] || {};
  const lastWeights = lastLog.weights || {};

  // Local weight state for editing
  const [weights, setWeights] = useState(currentWeights);

  function handleWeightChange(exId, val) {
    setWeights(prev => ({ ...prev, [exId]: val }));
  }

  function handleSave() {
    const allFilled = workout.exercises.every(ex => weights[ex.id]);
    if (!allFilled) return;
    onSaveLog(activeDay, { weights, lockedDate: todayDate });
  }

  const allFilled = workout.exercises.every(ex => weights[ex.id]);
  const isSavedToday = lockedDate === todayDate;

  // Determine workout day date label
  const workoutDate = getLastDateForDay(activeDay);

  return (
    <div style={{ padding:"18px 20px 0" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, marginBottom:4 }}>
        Workout Tracker
      </div>
      <div style={{ fontSize:11, color:"#555", marginBottom:20 }}>
        Log your working weight for each exercise · locks after the day ends
      </div>

      <StreakCard streak={streak} totalWorkouts={totalWorkouts}/>

      {/* Day tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {WORKOUT_DAYS.map(day => {
          const log = workoutLogs[`${wk}_${day}`];
          const done = log && log.lockedDate;
          return (
            <button key={day} onClick={() => {
              setActiveDay(day);
              setWeights(workoutLogs[`${wk}_${day}`]?.weights || {});
            }} style={{
              flex:1, padding:"10px 8px", borderRadius:12, border:"none", cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600,
              background: activeDay === day ? "#ece9e3" : "rgba(255,255,255,0.06)",
              color: activeDay === day ? "#0d0d10" : done ? "#4ade80" : "#666",
              position:"relative",
            }}>
              {DAY_LABELS[day].slice(0, 3)}
              {done && activeDay !== day && (
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

        {/* Card header */}
        <div style={{ padding:"14px 14px 12px",
          borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#38bdf8",
            textTransform:"uppercase", marginBottom:3 }}>
            {DAY_LABELS[activeDay]} · Phase 1 · {workout.rest} rest
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600 }}>
            {workout.title}
          </div>
          {lastWeights && Object.keys(lastWeights).length > 0 && (
            <div style={{ fontSize:10, color:"#555", marginTop:4 }}>
              ⚪ = last week's weight · 🟢 up · 🔴 down
            </div>
          )}
        </div>

        {/* Exercises */}
        {workout.exercises.map((ex, i) => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            currentWeight={weights[ex.id]}
            lastWeight={lastWeights[ex.id]}
            onChange={val => handleWeightChange(ex.id, val)}
            locked={isLocked}
          />
        ))}

        {/* Save / status */}
        <div style={{ padding:"14px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          {isLocked ? (
            <div style={{ fontSize:12, color:"#555", textAlign:"center" }}>
              🔒 Logged on {lockedDate} — no changes allowed
            </div>
          ) : isSavedToday ? (
            <div style={{ fontSize:12, color:"#4ade80", textAlign:"center" }}>
              ✓ Saved for today — you can still update until midnight
            </div>
          ) : (
            <button onClick={handleSave} disabled={!allFilled}
              style={{
                width:"100%", padding:"12px", borderRadius:10, border:"none",
                background: allFilled ? "#38bdf8" : "rgba(255,255,255,0.05)",
                color: allFilled ? "#0d0d10" : "#444",
                fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600,
                cursor: allFilled ? "pointer" : "not-allowed",
                transition:"all 0.2s",
              }}>
              {allFilled ? "Save workout log" : "Fill in all weights to save"}
            </button>
          )}
        </div>
      </div>

      {/* Note */}
      <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12,
        padding:"12px 14px", fontSize:12, color:"#555", lineHeight:1.6 }}>
        {workout.note}
      </div>
    </div>
  );
}
