import { useState, useMemo } from "react";
import { CALORIE_TARGET, PROTEIN_TARGET, DEFAULT_FOODS } from "../constants";
import { formatDateLong } from "../utils";

const MEAL_SECTIONS = [
  { id:"pre",   label:"Pre-Meal & Breakfast", icon:"🌅", color:"#fde68a" },
  { id:"main",  label:"Main Meal",            icon:"🍽️", color:"#4ade80" },
  { id:"snack", label:"Extra Snacks",         icon:"🍎", color:"#fb923c" },
];

function MacroBar({ label, current, target, color }) {
  const pct  = Math.min(Math.round((current / target) * 100), 100);
  const over = current > target;
  return (
    <div style={{ flex:1 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:10, color:"#666" }}>{label}</span>
        <span style={{ fontSize:10, fontWeight:600, color:over?"#fb923c":color }}>
          {Math.round(current)}<span style={{ color:"#444" }}>/{target}</span>
        </span>
      </div>
      <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:over?"#fb923c":color,
          borderRadius:99, transition:"width 0.3s ease" }}/>
      </div>
    </div>
  );
}

function FoodEntry({ entry, onRemove, locked }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
      borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontSize:14, flexShrink:0 }}>{entry.emoji||"🍴"}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, color:locked?"#666":"#dbd7cf" }}>{entry.name}</div>
        <div style={{ fontSize:10, color:"#555", marginTop:1 }}>
          {entry.calories} cal · {entry.protein||0}g protein
        </div>
      </div>
      {!locked && (
        <button onClick={onRemove} style={{ background:"none", border:"none", color:"#444",
          cursor:"pointer", fontSize:16, padding:"0 2px" }}>×</button>
      )}
    </div>
  );
}

function AddFoodModal({ section, onAdd, onClose, foodDatabase }) {
  const [query,    setQuery]    = useState("");
  const [calories, setCalories] = useState("");
  const [protein,  setProtein]  = useState("");
  const [name,     setName]     = useState("");
  const [emoji,    setEmoji]    = useState("");
  const [mode,     setMode]     = useState("search");

  const allFoods = useMemo(() => {
    const ids = new Set(DEFAULT_FOODS.map(f => f.id));
    return [...DEFAULT_FOODS, ...foodDatabase.filter(f => !ids.has(f.id))];
  }, [foodDatabase]);

  const filtered = query.length > 0
    ? allFoods.filter(f => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  function selectFood(food) { onAdd({...food, id:undefined}); onClose(); }

  function handleManualAdd() {
    if (!name || !calories) return;
    onAdd({ name, calories:parseFloat(calories), protein:parseFloat(protein)||0, emoji:emoji||"🍴" });
    onClose();
  }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
      zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#18181d",
        borderRadius:"20px 20px 0 0", border:"1px solid rgba(255,255,255,0.08)",
        width:"100%", maxWidth:540, maxHeight:"75vh", overflowY:"auto", padding:"24px 20px 40px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600 }}>
            Add to {MEAL_SECTIONS.find(s=>s.id===section)?.label}
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"none",
            color:"#888", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:16 }}>
          {[["search","Search / Quick-add"],["manual","Manual entry"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:"8px", borderRadius:8,
              border:"none", cursor:"pointer",
              background:mode===m?"#ece9e3":"rgba(255,255,255,0.06)",
              color:mode===m?"#0d0d10":"#777", fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>{l}</button>
          ))}
        </div>
        {mode==="search" ? (
          <>
            <input value={query} onChange={e=>setQuery(e.target.value)} autoFocus
              placeholder="Search foods…"
              style={{ width:"100%", background:"#0d0d10", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, padding:"10px 14px", color:"#ece9e3", fontSize:14,
                fontFamily:"'DM Sans',sans-serif", outline:"none", marginBottom:12 }}/>
            {filtered.length>0 ? (
              <div style={{ background:"#0d0d10", borderRadius:10, overflow:"hidden" }}>
                {filtered.map((food,i)=>(
                  <div key={food.id||i} onClick={()=>selectFood(food)}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
                      borderBottom:i<filtered.length-1?"1px solid rgba(255,255,255,0.05)":"none",
                      cursor:"pointer" }} className="row">
                    <span style={{ fontSize:18 }}>{food.emoji||"🍴"}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:"#dbd7cf" }}>{food.name}</div>
                      <div style={{ fontSize:10, color:"#555" }}>{food.calories} cal · {food.protein||0}g protein</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length>0 ? (
              <div style={{ textAlign:"center", color:"#555", fontSize:13, padding:"20px 0" }}>
                No results — try manual entry
              </div>
            ) : (
              <div>
                <div style={{ marginBottom:8, fontWeight:600, color:"#666", fontSize:12 }}>Quick adds:</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {DEFAULT_FOODS.slice(0,8).map(food=>(
                    <button key={food.id} onClick={()=>selectFood(food)}
                      style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
                        borderRadius:8, padding:"6px 10px", color:"#888", cursor:"pointer",
                        fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>
                      {food.emoji} {food.name.split(" ").slice(0,3).join(" ")}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[[name,setName,"Food name","text"],[calories,setCalories,"Calories","number"],
              [protein,setProtein,"Protein (g)","number"],[emoji,setEmoji,"Emoji (optional)","text"]]
              .map(([val,set,ph,type],i)=>(
              <input key={i} type={type} value={val} onChange={e=>set(e.target.value)}
                placeholder={ph} style={{ background:"#0d0d10", border:"1px solid rgba(255,255,255,0.08)",
                  borderRadius:10, padding:"10px 14px", color:"#ece9e3", fontSize:13,
                  fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
            ))}
            <button onClick={handleManualAdd} disabled={!name||!calories}
              style={{ padding:"12px", borderRadius:10, border:"none",
                background:name&&calories?"#4ade80":"rgba(255,255,255,0.05)",
                color:name&&calories?"#0d0d10":"#444",
                fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600,
                cursor:name&&calories?"pointer":"not-allowed" }}>
              Add food
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Day editor ────────────────────────────────────────────
function DayEditor({ date, dayData, isToday, onUpdate, onSubmit, onUnlock, foodDatabase, onAddToDatabase, saving, saveError }) {
  const [addingTo, setAddingTo] = useState(null);
  const isLocked  = !!dayData?.locked;
  const data      = dayData || { pre:[], main:[], snack:[], locked:false };

  const allEntries    = [...(data.pre||[]), ...(data.main||[]), ...(data.snack||[])];
  const totalCalories = allEntries.reduce((s,f)=>s+f.calories,0);
  const totalProtein  = allEntries.reduce((s,f)=>s+(f.protein||0),0);
  const remaining     = CALORIE_TARGET - totalCalories;
  const calorieColor  = totalCalories>CALORIE_TARGET?"#fb923c"
                      : totalCalories>CALORIE_TARGET*0.9?"#fde68a":"#4ade80";

  function addFood(section, food) {
    if (isLocked) return;
    const updated = { ...data, [section]:[...(data[section]||[]), {...food, id:undefined, logId:Date.now()}] };
    onUpdate(date, updated);
    const exists = [...DEFAULT_FOODS,...foodDatabase].some(f=>f.name.toLowerCase()===food.name.toLowerCase());
    if (!exists) onAddToDatabase({ id:`db_${Date.now()}`, name:food.name,
      calories:food.calories, protein:food.protein||0, emoji:food.emoji||"🍴" });
  }

  function removeFood(section, logId) {
    if (isLocked) return;
    const updated = { ...data, [section]:(data[section]||[]).filter(f=>f.logId!==logId) };
    onUpdate(date, updated);
  }

  const dateLabel = isToday
    ? new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})
    : formatDateLong(date);

  return (
    <div>
      {addingTo && (
        <AddFoodModal section={addingTo} foodDatabase={foodDatabase}
          onAdd={food=>addFood(addingTo,food)} onClose={()=>setAddingTo(null)}/>
      )}

      <div style={{ fontSize:11, color:"#555", marginBottom:16 }}>
        {dateLabel}
        {isLocked && <span style={{ marginLeft:8, color:"#fb923c" }}>🔒 Submitted</span>}
        {saving && <span style={{ marginLeft:8, color:"#888" }}>Saving…</span>}
        {saveError && <span style={{ marginLeft:8, color:"#fb923c" }}>⚠️ Save failed — check connection</span>}
      </div>

      {/* Summary bar */}
      <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:14, padding:"16px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:32, fontWeight:600, color:calorieColor, lineHeight:1 }}>
              {Math.round(totalCalories)}
            </div>
            <div style={{ fontSize:11, color:"#555", marginTop:2 }}>
              of {CALORIE_TARGET} cal · {remaining>=0?`${remaining} remaining`:`${Math.abs(remaining)} over`}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:18, fontWeight:600, color:"#a78bfa" }}>{Math.round(totalProtein)}g</div>
            <div style={{ fontSize:10, color:"#555" }}>of {PROTEIN_TARGET}g protein</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <MacroBar label="Calories" current={totalCalories} target={CALORIE_TARGET} color="#4ade80"/>
          <MacroBar label="Protein"  current={totalProtein}  target={PROTEIN_TARGET}  color="#a78bfa"/>
        </div>
      </div>

      {/* Meal sections */}
      {MEAL_SECTIONS.map(section=>{
        const entries     = data[section.id]||[];
        const sectionCals = entries.reduce((s,f)=>s+f.calories,0);
        return (
          <div key={section.id} style={{ marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5,
                color:section.color, textTransform:"uppercase" }}>
                {section.icon} {section.label}
              </div>
              {sectionCals>0&&<span style={{ fontSize:10, color:"#555" }}>{Math.round(sectionCals)} cal</span>}
            </div>
            <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:14, overflow:"hidden" }}>
              {entries.length===0 ? (
                <div style={{ padding:"14px", color:"#444", fontSize:13, textAlign:"center" }}>
                  Nothing logged yet
                </div>
              ) : (
                entries.map(entry=>(
                  <FoodEntry key={entry.logId} entry={entry} locked={isLocked}
                    onRemove={()=>removeFood(section.id,entry.logId)}/>
                ))
              )}
              {!isLocked && (
                <div onClick={()=>setAddingTo(section.id)}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 14px",
                    cursor:"pointer", color:"#555",
                    borderTop:entries.length>0?"1px solid rgba(255,255,255,0.04)":"none" }}
                  className="row">
                  <span style={{ fontSize:18 }}>＋</span>
                  <span style={{ fontSize:13 }}>Add food</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Action buttons */}
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
        {!isLocked && allEntries.length>0 && (
          <button onClick={()=>onSubmit(date, {...data, locked:true})}
            style={{ width:"100%", padding:"13px", borderRadius:12, border:"none",
              background:"#4ade80", color:"#0d0d10",
              fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer",
              opacity:saving?0.6:1 }}>
            {saving?"Saving…":"Submit today's food log"}
          </button>
        )}
        {isLocked && (
          <button onClick={()=>onUnlock(date, {...data, locked:false})}
            style={{ width:"100%", padding:"13px", borderRadius:12,
              border:"1px solid rgba(251,146,60,0.3)", background:"rgba(251,146,60,0.08)",
              color:"#fb923c", fontFamily:"'DM Sans',sans-serif",
              fontSize:14, fontWeight:600, cursor:"pointer" }}>
            Unlock to edit this day
          </button>
        )}
        {!isLocked && !isToday && allEntries.length>0 && (
          <div style={{ textAlign:"center", fontSize:11, color:"#555" }}>
            Make your changes above, then submit to save
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main FoodTab ──────────────────────────────────────────
export default function FoodTab({ foodLog, onUpdateLog, onSubmitDay, foodDatabase, onAddToDatabase, saving, saveError }) {
  const [showHistory, setShowHistory] = useState(false);
  const [editingDate, setEditingDate] = useState(null);

  const today     = new Date().toISOString().slice(0, 10);
  const todayData = foodLog[today] || null;

  // History — all locked days, newest first, permanent
  const history = Object.entries(foodLog)
    .filter(([, data]) => data?.locked)
    .sort(([a],[b]) => b.localeCompare(a))
    .map(([date, data]) => {
      const entries = [...(data.pre||[]), ...(data.main||[]), ...(data.snack||[])];
      return {
        date,
        calories: Math.round(entries.reduce((s,f)=>s+f.calories,0)),
        protein:  Math.round(entries.reduce((s,f)=>s+(f.protein||0),0)),
      };
    });

  function handleUnlock(date, updatedData) {
    onUpdateLog(date, updatedData);
    setEditingDate(date === today ? null : date);
  }

  const viewingDate = editingDate || today;
  const viewingData = foodLog[viewingDate] || null;
  const isViewingToday = viewingDate === today;

  return (
    <div style={{ padding:"18px 20px 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600 }}>
          Food Log
        </div>
        {editingDate && (
          <button onClick={()=>setEditingDate(null)} style={{ background:"rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.08)", color:"#888", borderRadius:8,
            padding:"6px 12px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:11 }}>
            ← Back to today
          </button>
        )}
      </div>

      <DayEditor
        key={viewingDate}
        date={viewingDate}
        dayData={viewingData}
        isToday={isViewingToday}
        onUpdate={onUpdateLog}
        onSubmit={(date, data) => {
          onSubmitDay(date, data);
          setEditingDate(null);
          setShowHistory(true);
        }}
        onUnlock={handleUnlock}
        foodDatabase={foodDatabase}
        onAddToDatabase={onAddToDatabase}
        saving={saving}
        saveError={saveError}
      />

      {/* History toggle */}
      {history.length>0 && (
        <>
          <button onClick={()=>setShowHistory(o=>!o)} style={{ width:"100%", padding:"12px",
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:12, color:"#777", fontFamily:"'DM Sans',sans-serif", fontSize:13,
            cursor:"pointer", marginBottom:showHistory?16:0 }}>
            {showHistory?"Hide":"Show"} food history ({history.length} days)
          </button>

          {showHistory && (
            <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:14, overflow:"hidden", marginBottom:20 }}>
              <div style={{ display:"flex", padding:"8px 14px",
                borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ flex:2, fontSize:9, color:"#444", textTransform:"uppercase", letterSpacing:1 }}>Date</span>
                <span style={{ flex:1, fontSize:9, color:"#444", textTransform:"uppercase", letterSpacing:1, textAlign:"right" }}>Cal</span>
                <span style={{ flex:1, fontSize:9, color:"#444", textTransform:"uppercase", letterSpacing:1, textAlign:"right" }}>Protein</span>
                <span style={{ width:40 }}/>
              </div>
              {history.map((row,i)=>{
                const calColor = row.calories>CALORIE_TARGET?"#fb923c"
                               : row.calories>CALORIE_TARGET*0.85?"#4ade80":"#888";
                const proColor = row.protein>=PROTEIN_TARGET?"#4ade80":"#888";
                return (
                  <div key={row.date} style={{ display:"flex", alignItems:"center",
                    padding:"11px 14px",
                    borderBottom:i<history.length-1?"1px solid rgba(255,255,255,0.045)":"none" }}>
                    <span style={{ flex:2, fontSize:13, color:"#888" }}>{formatDateLong(row.date)}</span>
                    <span style={{ flex:1, fontSize:13, fontWeight:600, color:calColor, textAlign:"right" }}>
                      {row.calories}
                    </span>
                    <span style={{ flex:1, fontSize:13, fontWeight:600, color:proColor, textAlign:"right" }}>
                      {row.protein}g
                    </span>
                    <button onClick={()=>{ setEditingDate(row.date); setShowHistory(false); }}
                      style={{ width:40, background:"none", border:"none", color:"#555",
                        cursor:"pointer", fontSize:12, textAlign:"right" }}>Edit</button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
