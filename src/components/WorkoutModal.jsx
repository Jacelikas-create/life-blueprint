import { WORKOUTS, DAY_LABELS } from "../constants";

export default function WorkoutModal({ day, onClose }) {
  const w = WORKOUTS[day];
  if (!w) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
      zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#18181d", borderRadius:"20px 20px 0 0",
        border:"1px solid rgba(255,255,255,0.08)", width:"100%", maxWidth:540,
        maxHeight:"82vh", overflowY:"auto", padding:"24px 20px 40px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#38bdf8",
              textTransform:"uppercase", marginBottom:4 }}>{DAY_LABELS[day]} · Strength · {w.rest} rest</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600 }}>{w.title}</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"none",
            color:"#888", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        <div style={{ fontSize:12, color:"#888", background:"rgba(255,255,255,0.04)",
          borderRadius:8, padding:"10px 12px", marginBottom:16, lineHeight:1.6 }}>{w.note}</div>
        {w.exercises.map((ex, i) => (
          <div key={ex.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"11px 0", borderBottom: i < w.exercises.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:"#ece9e3" }}>{ex.name}</div>
              <div style={{ fontSize:11, color:"#666", marginTop:2 }}>{ex.tip}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
