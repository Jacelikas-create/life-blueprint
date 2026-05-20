import { useState } from "react";

export default function ErrandsPanel({ errands, errandsDone, toggleErrand, onAddErrand, onDeleteErrand }) {
  const [newTask, setNewTask] = useState("");
  const done  = errands.filter(e => errandsDone[e.id]).length;
  const total = errands.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  function handleAdd() {
    const t = newTask.trim();
    if (!t) return;
    onAddErrand(t);
    setNewTask("");
  }

  return (
    <div style={{ padding:"18px 20px 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, marginBottom:2 }}>
            Weekly To-Dos
          </div>
          <div style={{ fontSize:11, color:"#555" }}>Hit these any day you're off — Tue, Wed, Thu, or Sun</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:20, fontWeight:600, color:"#f9a8d4" }}>{pct}%</div>
          <div style={{ fontSize:11, color:"#555" }}>{done}/{total}</div>
        </div>
      </div>
      <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden", marginBottom:18 }}>
        <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#f9a8d4,#a78bfa)",
          borderRadius:99, transition:"width 0.4s ease" }}/>
      </div>
      <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:14, overflow:"hidden", marginBottom:16 }}>
        {errands.map((item, idx) => {
          const isDone = !!errandsDone[item.id];
          return (
            <div key={item.id} className="row" style={{ display:"flex", alignItems:"center",
              gap:12, padding:"13px 14px",
              borderBottom:idx < errands.length-1 ? "1px solid rgba(255,255,255,0.045)" : "none",
              background:isDone ? "rgba(249,168,212,0.07)" : "transparent" }}>
              <div className="chk" onClick={() => toggleErrand(item.id)}
                style={{ width:21, height:21, borderRadius:6, flexShrink:0,
                  border:isDone ? "none" : "2px solid rgba(255,255,255,0.18)",
                  background:isDone ? "#f9a8d4" : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                {isDone && <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4.5L4 7.5L10 1" stroke="#0d0d10" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{ fontSize:15, flexShrink:0 }}>{item.icon || "📌"}</span>
              <span onClick={() => toggleErrand(item.id)} style={{ fontSize:14, flex:1, cursor:"pointer",
                color:isDone ? "#555" : "#dbd7cf", textDecoration:isDone ? "line-through" : "none" }}>
                {item.label}
              </span>
              {item.custom && (
                <button onClick={() => onDeleteErrand(item.id)}
                  style={{ background:"none", border:"none", color:"#444", cursor:"pointer",
                    fontSize:16, padding:"0 2px", lineHeight:1 }}>×</button>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <input value={newTask} onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          placeholder="Add a one-off errand…"
          style={{ flex:1, background:"#17171d", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:10, padding:"10px 14px", color:"#ece9e3", fontSize:13,
            fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
        <button onClick={handleAdd}
          style={{ background:"#f9a8d4", color:"#0d0d10", border:"none", borderRadius:10,
            padding:"10px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13,
            fontWeight:600, cursor:"pointer", flexShrink:0 }}>Add</button>
      </div>
      {pct === 100 && total > 0 && (
        <div style={{ marginTop:16, padding:"16px 18px",
          background:"linear-gradient(135deg,rgba(249,168,212,0.1),rgba(167,139,250,0.1))",
          border:"1px solid rgba(249,168,212,0.2)", borderRadius:14, textAlign:"center" }}>
          <div style={{ fontSize:24, marginBottom:4 }}>✅</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, marginBottom:3 }}>
            All errands done!
          </div>
          <div style={{ fontSize:12, color:"#666" }}>Even the dad call. Impressive.</div>
        </div>
      )}
    </div>
  );
}
