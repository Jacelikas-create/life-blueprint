import { useState, useEffect } from "react";
import { WATER_GOAL } from "../constants";

const GLASS_H = 60;
const GLASS_W = 44;

function GlassIcon({ filled, total, celebrating }) {
  const fillPct = filled / total;
  const fillH   = Math.round(GLASS_H * fillPct);
  const fillY   = GLASS_H - fillH;

  // Color shifts from light blue to rich blue as it fills
  const r = Math.round(147 - fillPct * 60);
  const g = Math.round(210 - fillPct * 30);
  const b = 255;
  const fillColor = `rgb(${r},${g},${b})`;

  return (
    <svg width={GLASS_W} height={GLASS_H + 10} viewBox={`0 0 ${GLASS_W} ${GLASS_H + 10}`}
      style={{ filter: celebrating ? "drop-shadow(0 0 8px rgba(147,210,255,0.8))" : "none",
        transition:"filter 0.3s" }}>
      {/* Glass outline */}
      <path d={`M6,0 L${GLASS_W-6},0 L${GLASS_W-2},${GLASS_H} L2,${GLASS_H} Z`}
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}/>
      {/* Fill */}
      {filled > 0 && (
        <clipPath id="glass-clip">
          <path d={`M6,0 L${GLASS_W-6},0 L${GLASS_W-2},${GLASS_H} L2,${GLASS_H} Z`}/>
        </clipPath>
      )}
      {filled > 0 && (
        <rect x={0} y={fillY} width={GLASS_W} height={fillH}
          fill={fillColor} clipPath="url(#glass-clip)" opacity={0.85}
          style={{ transition:"y 0.4s cubic-bezier(0.34,1.56,0.64,1), height 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}/>
      )}
      {/* Segment lines */}
      {Array.from({ length: total - 1 }, (_, i) => {
        const y = GLASS_H - (GLASS_H / total) * (i + 1);
        return (
          <line key={i} x1={3} x2={GLASS_W - 3} y1={y} y2={y}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1}/>
        );
      })}
      {/* Base */}
      <rect x={0} y={GLASS_H} width={GLASS_W} height={2} rx={1}
        fill="rgba(255,255,255,0.15)"/>
    </svg>
  );
}

export default function WaterCounter({ glasses, onTap, onReset }) {
  const [celebrating, setCelebrating] = useState(false);
  const [justTapped,  setJustTapped]  = useState(false);
  const filled = Math.min(glasses, WATER_GOAL);
  const isComplete = filled >= WATER_GOAL;

  function handleTap() {
    if (filled >= WATER_GOAL) return;
    setJustTapped(true);
    setTimeout(() => setJustTapped(false), 300);
    if (filled + 1 >= WATER_GOAL) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 2000);
    }
    onTap();
  }

  return (
    <div style={{ background:"linear-gradient(135deg,rgba(56,189,248,0.06),rgba(147,210,255,0.04))",
      border:"1px solid rgba(56,189,248,0.12)", borderRadius:16,
      padding:"14px 16px", marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>

        {/* Glass */}
        <div onClick={handleTap} style={{ cursor: isComplete ? "default" : "pointer",
          transform: justTapped ? "scale(0.92)" : "scale(1)",
          transition:"transform 0.15s", flexShrink:0 }}>
          <GlassIcon filled={filled} total={WATER_GOAL} celebrating={celebrating}/>
        </div>

        {/* Info */}
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:4 }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600,
              color: isComplete ? "#93d2ff" : "#ece9e3" }}>{filled}</span>
            <span style={{ fontSize:13, color:"#555" }}>/ {WATER_GOAL} glasses</span>
            {isComplete && <span style={{ fontSize:13 }}>💧</span>}
          </div>
          {/* Segment dots */}
          <div style={{ display:"flex", gap:4, marginBottom:6 }}>
            {Array.from({ length: WATER_GOAL }, (_, i) => (
              <div key={i} style={{ width:18, height:6, borderRadius:3,
                background: i < filled ? "#93d2ff" : "rgba(255,255,255,0.08)",
                transition:"background 0.3s" }}/>
            ))}
          </div>
          <div style={{ fontSize:11, color: isComplete ? "#93d2ff" : "#555" }}>
            {isComplete ? "Hydration goal hit! 🎉" :
             filled === 0 ? "Tap the glass to log a glass of water" :
             `${WATER_GOAL - filled} more to go · resets at 4am`}
          </div>
        </div>

        {/* Undo button */}
        {filled > 0 && !isComplete && (
          <button onClick={onReset} style={{ background:"none", border:"none",
            color:"#444", cursor:"pointer", fontSize:18, padding:4, flexShrink:0 }}
            title="Undo last tap">↩</button>
        )}
      </div>
    </div>
  );
}
