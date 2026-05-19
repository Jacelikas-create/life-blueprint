import { useState, useEffect, useRef } from "react";
import { GOAL_WEIGHT } from "../constants";
import { linearRegression, formatDate, formatDateLong, daysBetween, addDays } from "../utils";

function DreamBodCounter({ daysLeft }) {
  if (daysLeft === null) return null;
  const isNegative = daysLeft < 0;
  return (
    <div style={{ background:"linear-gradient(135deg,rgba(249,168,212,0.1),rgba(167,139,250,0.1))",
      border:"1px solid rgba(249,168,212,0.2)", borderRadius:16, padding:"20px",
      textAlign:"center", marginBottom:20 }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, color:"#f9a8d4",
        textTransform:"uppercase", marginBottom:8 }}>Days Until Dream Bod</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:52, fontWeight:600,
        color: isNegative ? "#4ade80" : "#ece9e3", lineHeight:1, marginBottom:6 }}>
        {isNegative ? "🎉" : Math.abs(daysLeft)}
      </div>
      {isNegative ? (
        <div style={{ fontSize:13, color:"#4ade80" }}>You've hit your goal weight!</div>
      ) : (
        <div style={{ fontSize:12, color:"#888" }}>
          at your current trend · goal: {GOAL_WEIGHT} lbs
        </div>
      )}
    </div>
  );
}

function WeightChart({ entries, goalWeight }) {
  const svgRef = useRef(null);
  if (entries.length === 0) return null;

  const W = 340, H = 200;
  const PAD = { top:16, right:16, bottom:32, left:40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const startDate = sorted[0].date;

  // Convert to {x: dayOffset, y: weight}
  const points = sorted.map(e => ({ x: daysBetween(startDate, e.date), y: e.weight, date: e.date }));

  // Projections
  const today = new Date().toISOString().slice(0, 10);
  const todayX = daysBetween(startDate, today);
  const proj1m  = todayX + 30;
  const proj3m  = todayX + 90;
  const proj6m  = todayX + 180;

  const reg = linearRegression(points);
  const allX = [...points.map(p => p.x), proj6m];
  const allY = [...points.map(p => p.y), goalWeight];
  if (reg) {
    allY.push(reg.intercept + reg.slope * proj6m);
  }

  const minX = 0;
  const maxX = Math.max(proj6m, todayX + 10);
  const minY = Math.min(...allY, goalWeight) - 5;
  const maxY = Math.max(...allY) + 5;

  const toSvgX = x => PAD.left + ((x - minX) / (maxX - minX)) * chartW;
  const toSvgY = y => PAD.top + ((maxY - y) / (maxY - minY)) * chartH;

  // Trend line points (full range)
  let trendPath = null, projPath = null;
  let proj1mY = null, proj3mY = null, proj6mY = null;
  if (reg) {
    const trendStartY = reg.intercept + reg.slope * minX;
    const trendEndY   = reg.intercept + reg.slope * todayX;
    proj1mY = reg.intercept + reg.slope * proj1m;
    proj3mY = reg.intercept + reg.slope * proj3m;
    proj6mY = reg.intercept + reg.slope * proj6m;

    trendPath = `M ${toSvgX(minX)} ${toSvgY(trendStartY)} L ${toSvgX(todayX)} ${toSvgY(trendEndY)}`;
    projPath  = `M ${toSvgX(todayX)} ${toSvgY(trendEndY)} L ${toSvgX(proj6m)} ${toSvgY(proj6mY)}`;
  }

  // Goal line y
  const goalSvgY = toSvgY(goalWeight);

  // Y axis labels
  const yTicks = [];
  const step = Math.ceil((maxY - minY) / 4 / 5) * 5;
  for (let y = Math.ceil(minY / step) * step; y <= maxY; y += step) {
    yTicks.push(y);
  }

  // X axis labels
  const xLabels = [
    { x: 0, label: "Start" },
    { x: todayX, label: "Today" },
    { x: proj1m, label: "+1mo" },
    { x: proj3m, label: "+3mo" },
    { x: proj6m, label: "+6mo" },
  ].filter(l => l.x >= 0);

  return (
    <div style={{ overflowX:"auto", marginBottom:20 }}>
      <svg ref={svgRef} width={W} height={H} style={{ display:"block", margin:"0 auto" }}>
        {/* Grid lines */}
        {yTicks.map(y => (
          <line key={y} x1={PAD.left} x2={W - PAD.right}
            y1={toSvgY(y)} y2={toSvgY(y)}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
        ))}

        {/* Goal line */}
        <line x1={PAD.left} x2={W - PAD.right}
          y1={goalSvgY} y2={goalSvgY}
          stroke="#4ade80" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6}/>
        <text x={W - PAD.right - 2} y={goalSvgY - 4}
          fontSize={9} fill="#4ade80" textAnchor="end" opacity={0.8}>
          {goalWeight} goal
        </text>

        {/* Today line */}
        {todayX > 0 && (
          <line x1={toSvgX(todayX)} x2={toSvgX(todayX)}
            y1={PAD.top} y2={H - PAD.bottom}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1}/>
        )}

        {/* Trend line */}
        {trendPath && (
          <path d={trendPath} stroke="#a78bfa" strokeWidth={2} fill="none" opacity={0.8}/>
        )}

        {/* Projection line */}
        {projPath && (
          <path d={projPath} stroke="#a78bfa" strokeWidth={1.5} fill="none"
            strokeDasharray="5 4" opacity={0.5}/>
        )}

        {/* Projection milestone dots */}
        {reg && [
          { x: proj1m, y: proj1mY, label: `${Math.round(proj1mY)}` },
          { x: proj3m, y: proj3mY, label: `${Math.round(proj3mY)}` },
          { x: proj6m, y: proj6mY, label: `${Math.round(proj6mY)}` },
        ].map((p, i) => (
          <g key={i}>
            <circle cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={3}
              fill="#a78bfa" opacity={0.5}/>
            <text x={toSvgX(p.x)} y={toSvgY(p.y) - 7}
              fontSize={8} fill="#a78bfa" textAnchor="middle" opacity={0.7}>
              {p.label}
            </text>
          </g>
        ))}

        {/* Data point dots */}
        {points.map((p, i) => (
          <circle key={i} cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={4}
            fill="#f9a8d4" stroke="#0d0d10" strokeWidth={1.5}/>
        ))}

        {/* Y axis labels */}
        {yTicks.map(y => (
          <text key={y} x={PAD.left - 5} y={toSvgY(y) + 4}
            fontSize={9} fill="#555" textAnchor="end">{y}</text>
        ))}

        {/* X axis labels */}
        {xLabels.map((l, i) => (
          <text key={i} x={toSvgX(l.x)} y={H - PAD.bottom + 14}
            fontSize={8} fill="#555" textAnchor="middle">{l.label}</text>
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:8, flexWrap:"wrap" }}>
        {[
          { color:"#f9a8d4", label:"Weigh-in", type:"dot" },
          { color:"#a78bfa", label:"Trend", type:"line" },
          { color:"#a78bfa", label:"Projection", type:"dash" },
          { color:"#4ade80", label:`${goalWeight} lb goal`, type:"dash" },
        ].map((l, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
            {l.type === "dot" ? (
              <div style={{ width:8, height:8, borderRadius:"50%", background:l.color }}/>
            ) : (
              <div style={{ width:16, height:2, background:l.color,
                opacity: l.type === "dash" ? 0.5 : 0.8,
                borderTop: l.type === "dash" ? `2px dashed ${l.color}` : "none",
                background: l.type === "dash" ? "none" : l.color }}/>
            )}
            <span style={{ fontSize:10, color:"#666" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectionCard({ label, date, weight, startWeight }) {
  if (!weight || !date) return null;
  const lost = startWeight ? (startWeight - weight).toFixed(1) : null;
  return (
    <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:12, padding:"12px 14px", flex:1, minWidth:80 }}>
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, color:"#a78bfa",
        textTransform:"uppercase", marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:18, fontWeight:600, color:"#ece9e3", marginBottom:2 }}>
        {Math.round(weight)} lbs
      </div>
      {lost && (
        <div style={{ fontSize:10, color:"#4ade80" }}>−{lost} lbs</div>
      )}
      <div style={{ fontSize:9, color:"#555", marginTop:3 }}>{formatDate(date)}</div>
    </div>
  );
}

export default function WeightTab({ weightEntries, onAddEntry }) {
  const [inputWeight, setInputWeight] = useState("");
  const [inputDate, setInputDate]     = useState(new Date().toISOString().slice(0, 10));
  const [error, setError]             = useState("");

  const sorted = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date));
  const startWeight   = sorted.length > 0 ? sorted[0].weight : null;
  const currentWeight = sorted.length > 0 ? sorted[sorted.length - 1].weight : null;
  const totalLost     = startWeight && currentWeight ? (startWeight - currentWeight).toFixed(1) : null;

  const today = new Date().toISOString().slice(0, 10);

  // Regression & projections
  const points = sorted.map(e => ({ x: daysBetween(sorted[0]?.date || today, e.date), y: e.weight }));
  const reg = points.length >= 1 ? linearRegression(points.length === 1 ? [points[0], { x: 0, y: points[0].y }] : points) : null;

  const todayX = daysBetween(sorted[0]?.date || today, today);
  const proj1mY  = reg ? reg.intercept + reg.slope * (todayX + 30)  : null;
  const proj3mY  = reg ? reg.intercept + reg.slope * (todayX + 90)  : null;
  const proj6mY  = reg ? reg.intercept + reg.slope * (todayX + 180) : null;
  const proj1mDate  = addDays(today, 30);
  const proj3mDate  = addDays(today, 90);
  const proj6mDate  = addDays(today, 180);

  // Days until goal
  let daysUntilGoal = null;
  if (reg && reg.slope < 0 && currentWeight > GOAL_WEIGHT) {
    const currentY = reg.intercept + reg.slope * todayX;
    const daysFromStart = (GOAL_WEIGHT - reg.intercept) / reg.slope;
    daysUntilGoal = Math.round(daysFromStart - todayX);
  } else if (currentWeight <= GOAL_WEIGHT) {
    daysUntilGoal = -1;
  }

  function handleAdd() {
    const w = parseFloat(inputWeight);
    if (isNaN(w) || w < 50 || w > 500) {
      setError("Please enter a valid weight between 50–500 lbs");
      return;
    }
    if (!inputDate) { setError("Please select a date"); return; }
    setError("");
    onAddEntry({ date: inputDate, weight: w });
    setInputWeight("");
  }

  return (
    <div style={{ padding:"18px 20px 0" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, marginBottom:4 }}>
        Weight Loss
      </div>
      <div style={{ fontSize:11, color:"#555", marginBottom:20 }}>
        Weigh in Mon · Wed · Sat — same time, before eating
      </div>

      <DreamBodCounter daysLeft={daysUntilGoal}/>

      {/* Stats row */}
      {startWeight && (
        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          {[
            { label:"Start", value:`${startWeight} lbs`, color:"#888" },
            { label:"Current", value:`${currentWeight} lbs`, color:"#ece9e3" },
            { label:"Lost", value: totalLost > 0 ? `−${totalLost} lbs` : `+${Math.abs(totalLost)} lbs`,
              color: totalLost > 0 ? "#4ade80" : "#fb923c" },
            { label:"Goal", value:`${GOAL_WEIGHT} lbs`, color:"#4ade80" },
          ].map((s, i) => (
            <div key={i} style={{ flex:1, background:"#17171d",
              border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"10px 10px" }}>
              <div style={{ fontSize:9, color:"#555", marginBottom:4, textTransform:"uppercase",
                letterSpacing:1 }}>{s.label}</div>
              <div style={{ fontSize:13, fontWeight:600, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {weightEntries.length > 0 ? (
        <WeightChart entries={weightEntries} goalWeight={GOAL_WEIGHT}/>
      ) : (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, padding:"30px 20px", textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>⚖️</div>
          <div style={{ fontSize:14, color:"#555" }}>Log your first weight to get started</div>
        </div>
      )}

      {/* Projections */}
      {reg && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#a78bfa",
            textTransform:"uppercase", marginBottom:10 }}>Projections at current trend</div>
          <div style={{ display:"flex", gap:8 }}>
            <ProjectionCard label="+1 month" date={proj1mDate} weight={proj1mY} startWeight={startWeight}/>
            <ProjectionCard label="+3 months" date={proj3mDate} weight={proj3mY} startWeight={startWeight}/>
            <ProjectionCard label="+6 months" date={proj6mDate} weight={proj6mY} startWeight={startWeight}/>
          </div>
        </div>
      )}

      {/* Log entry */}
      <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:14, padding:"16px" }}>
        <div style={{ fontSize:11, fontWeight:600, color:"#888", marginBottom:12,
          textTransform:"uppercase", letterSpacing:1.5 }}>Log a weigh-in</div>
        <div style={{ display:"flex", gap:8, marginBottom: error ? 8 : 0 }}>
          <input type="number" value={inputWeight} onChange={e => setInputWeight(e.target.value)}
            placeholder="Weight in lbs"
            style={{ flex:1, background:"#0d0d10", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:10, padding:"10px 14px", color:"#ece9e3", fontSize:14,
              fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
          <input type="date" value={inputDate} onChange={e => setInputDate(e.target.value)}
            style={{ flex:1, background:"#0d0d10", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:10, padding:"10px 14px", color:"#ece9e3", fontSize:13,
              fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
          <button onClick={handleAdd}
            style={{ background:"#f9a8d4", color:"#0d0d10", border:"none", borderRadius:10,
              padding:"10px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13,
              fontWeight:600, cursor:"pointer", flexShrink:0 }}>Log</button>
        </div>
        {error && <div style={{ fontSize:11, color:"#fb923c", marginTop:6 }}>{error}</div>}
      </div>

      {/* History */}
      {sorted.length > 0 && (
        <div style={{ marginTop:20 }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#888",
            textTransform:"uppercase", marginBottom:10 }}>History</div>
          <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:14, overflow:"hidden" }}>
            {[...sorted].reverse().map((e, i, arr) => (
              <div key={e.date} style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", padding:"11px 14px",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.045)" : "none" }}>
                <span style={{ fontSize:13, color:"#888" }}>{formatDateLong(e.date)}</span>
                <span style={{ fontSize:14, fontWeight:600, color:"#ece9e3" }}>{e.weight} lbs</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
