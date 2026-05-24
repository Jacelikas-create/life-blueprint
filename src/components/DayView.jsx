import { useState } from "react";
import {
  DAYS, DAY_LABELS, DAY_SHORT, WORK_DAYS, OFF_DAYS, WEIGH_DAYS, CAT,
  MORNING_ALWAYS, HEALTH_ALWAYS, CARDIO_ITEM, WORK_ITEM,
  KIKI_ALWAYS, HOME_ALWAYS, EXTRA_HOME, TUE_REFLECT, NIGHTLY_ALWAYS,
  WORKOUTS, CLEANING_SESSIONS,
} from "../constants";
import ProgressRing from "./ProgressRing";
import WorkoutModal from "./WorkoutModal";
import WaterCounter from "./WaterCounter";
import  ParModal  from "./ParSystem";

const WORKOUT_DAYS = { TUE:WORKOUTS.TUE, THU:WORKOUTS.THU, SUN:WORKOUTS.SUN };
const CLEAN_DAYS   = new Set(["TUE","WED","THU"]);

// ── Cleaning Modal ────────────────────────────────────────
function CleaningModal({ day, onClose }) {
  const session = CLEANING_SESSIONS[day];
  if (!session) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
      zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#18181d",
        borderRadius:"20px 20px 0 0", border:"1px solid rgba(255,255,255,0.08)",
        width:"100%", maxWidth:540, maxHeight:"75vh", overflowY:"auto", padding:"24px 20px 40px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#fb923c",
              textTransform:"uppercase", marginBottom:4 }}>
              {DAY_LABELS[day]} · Deep Clean · {session.duration}
            </div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600 }}>
              {session.icon} {session.title}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"none",
            color:"#888", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        <div style={{ fontSize:12, color:"#888", background:"rgba(255,255,255,0.04)",
          borderRadius:8, padding:"10px 12px", marginBottom:16, lineHeight:1.6 }}>
          {session.note}
        </div>
        {session.tasks.map((task, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0",
            borderBottom:i<session.tasks.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <div style={{ width:22, height:22, borderRadius:6, flexShrink:0,
              border:"2px solid rgba(255,255,255,0.15)", background:"transparent" }}/>
            <span style={{ fontSize:14, color:"#dbd7cf" }}>{task}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Build items for a given day ───────────────────────────
export function getItemsForDay(day) {
  const prefix = items => items.map(item => ({...item, id:`${day}_${item.id}`}));
  const items = [...prefix(MORNING_ALWAYS)];
  // Weigh-in first thing on weigh days — before anything else after morning routine
  if (WEIGH_DAYS.has(day)) items.push({
    id:`${day}_weigh`, category:"weigh",
    label:"Log morning weigh-in", icon:"⚖️",
  });
  items.push(...prefix(HEALTH_ALWAYS));
  if (OFF_DAYS.has(day))  items.push({...CARDIO_ITEM, id:`${day}_${CARDIO_ITEM.id}`});
  if (WORK_DAYS.has(day)) items.push({...WORK_ITEM, id:`${day}_${WORK_ITEM.id}`});
  if (day==="TUE")        items.push(...prefix(TUE_REFLECT));
  // Kiki — every day
  items.push(...prefix(KIKI_ALWAYS));
  // Home always + extras
  items.push(...prefix(HOME_ALWAYS), ...prefix(EXTRA_HOME[day]||[]));
  // Workout session
  if (WORKOUT_DAYS[day]) items.push({
    id:`workout_${day}`, category:"workout",
    label:`Strength session (${WORKOUT_DAYS[day].duration})`,
    icon:"💪", isWorkout:true, day,
  });
  // Cleaning session (Tue/Wed/Thu)
  if (CLEAN_DAYS.has(day) && CLEANING_SESSIONS[day]) {
    const s = CLEANING_SESSIONS[day];
    items.push({
      id:`clean_${day}`, category:"home",
      label:`${s.icon} ${s.title} — deep clean`,
      icon:"🧽", isCleaning:true, day,
    });
  }
  // Nightly
  items.push(...prefix(NIGHTLY_ALWAYS));
  return items;
}

// ── DayView ───────────────────────────────────────────────
export default function DayView({ checked, toggle, todayCode, waterGlasses, onWaterTap, onWaterUndo, parStock, onUpdatePar }) {
  const [activeDay,     setActiveDay]     = useState(todayCode);
  const [workoutModal,  setWorkoutModal]  = useState(null);
  const [cleaningModal, setCleaningModal] = useState(null);
  const [showParModal,  setShowParModal]  = useState(false);

  const items = getItemsForDay(activeDay);
  const done  = items.filter(i=>checked[i.id]).length;
  const pct   = Math.round((done/items.length)*100);

  const byCat = Object.keys(CAT).map(cat=>{
    const ci=items.filter(i=>i.category===cat);
    if(!ci.length) return null;
    const d=ci.filter(i=>checked[i.id]).length;
    return {cat,items:ci,done:d,pct:Math.round((d/ci.length)*100)};
  }).filter(Boolean);

  function dayProgress(day) {
    const its=getItemsForDay(day), d=its.filter(i=>checked[i.id]).length;
    return {done:d,total:its.length,pct:Math.round((d/its.length)*100)};
  }

  const daySubtitle = day => {
    if (WORK_DAYS.has(day)) return "Work day — track those tips!";
    if (day==="TUE") return "First day off — reflect, reset, push";
    if (WORKOUT_DAYS[day]) return "Strength + housekeeping";
    return "Recovery + housekeeping";
  };

  return (
    <>
      {workoutModal  && <WorkoutModal  day={workoutModal}  onClose={()=>setWorkoutModal(null)}/>}
      {cleaningModal && <CleaningModal day={cleaningModal} onClose={()=>setCleaningModal(null)}/>}
      {showParModal  && (
        <ParModal parStock={parStock} onUpdate={onUpdatePar} onClose={()=>setShowParModal(false)}/>
      )}

      {/* Water counter */}
      <WaterCounter glasses={waterGlasses} onTap={onWaterTap} onReset={onWaterUndo}/>

      {/* Day strip */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:16}}>
        {DAYS.map(day=>{
          const {pct:dp,done:dd,total:dt}=dayProgress(day);
          const isToday=day===todayCode, isActive=day===activeDay;
          return (
            <button key={day} onClick={()=>setActiveDay(day)} style={{
              flexShrink:0,padding:"10px 10px 8px",borderRadius:12,minWidth:48,border:"none",
              background:isActive?"#ece9e3":"rgba(255,255,255,0.06)",
              color:isActive?"#0d0d10":isToday?"#ece9e3":"#666",
              outline:isToday&&!isActive?"1px solid rgba(255,255,255,0.2)":"none",
              fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.18s"}}>
              <div style={{fontSize:11,fontWeight:600,marginBottom:4}}>{DAY_SHORT[day]}</div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:3}}>
                <svg width={20} height={20} style={{transform:"rotate(-90deg)"}}>
                  <circle cx={10} cy={10} r={7} fill="none"
                    stroke={isActive?"rgba(0,0,0,0.15)":"rgba(255,255,255,0.08)"} strokeWidth={3}/>
                  <circle cx={10} cy={10} r={7} fill="none"
                    stroke={isActive?"#0d0d10":"#4ade80"} strokeWidth={3}
                    strokeDasharray={2*Math.PI*7}
                    strokeDashoffset={2*Math.PI*7*(1-dp/100)}
                    strokeLinecap="round" style={{transition:"stroke-dashoffset 0.4s"}}/>
                </svg>
              </div>
              <div style={{fontSize:9,opacity:0.6}}>{dd}/{dt}</div>
              {WORKOUT_DAYS[day]&&<div style={{fontSize:9,marginTop:2,color:"#38bdf8"}}>💪</div>}
              {day==="TUE"&&<div style={{fontSize:8,marginTop:1,color:"#34d399",opacity:0.8}}>reset</div>}
              {OFF_DAYS.has(day)&&day!=="TUE"&&<div style={{fontSize:8,marginTop:1,color:"#f9a8d4",opacity:0.7}}>off</div>}
            </button>
          );
        })}
      </div>

      {/* Day header */}
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600}}>
              {DAY_LABELS[activeDay]}
            </div>
            <div style={{fontSize:11,color:"#555",marginTop:2}}>{daySubtitle(activeDay)}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:20,fontWeight:600}}>{pct}%</div>
            <div style={{fontSize:11,color:"#555"}}>{done}/{items.length} done</div>
          </div>
        </div>
        <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,
            background:"linear-gradient(90deg,#fde68a,#4ade80,#c084fc)",
            borderRadius:99,transition:"width 0.4s ease"}}/>
        </div>
      </div>

      {/* Category pills */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {byCat.map(({cat,done:d,items:ci,pct:cp})=>(
          <div key={cat} style={{display:"flex",alignItems:"center",gap:8,
            background:CAT[cat].bg,border:`1px solid ${CAT[cat].color}1a`,
            borderRadius:10,padding:"6px 12px"}}>
            <ProgressRing pct={cp} color={CAT[cat].color} size={36}/>
            <div>
              <div style={{fontSize:9,color:"#666",marginBottom:1}}>{CAT[cat].label}</div>
              <div style={{fontSize:12,fontWeight:600,color:CAT[cat].color}}>{d}/{ci.length}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Checklist */}
      {byCat.map(({cat,items:ci})=>(
        <div key={cat} style={{marginBottom:22}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:2.5,
            color:CAT[cat].color,textTransform:"uppercase",marginBottom:8}}>
            {CAT[cat].label}
          </div>
          <div style={{background:"#17171d",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:14,overflow:"hidden"}}>
            {ci.map((item,idx)=>{
                const isDone     = !!checked[item.id];
                const isWO       = item.isWorkout;
                const isCleaning = item.isCleaning;
                const isPar      = item.isPar;
                const isExpandable = isWO || isCleaning || isPar;
                return (
                  <div key={item.id} className="row"
                    onClick={()=>{
                      if (isWO) setWorkoutModal(item.day);
                      else if (isCleaning) setCleaningModal(item.day);
                      else if (isPar) setShowParModal(true);
                      else toggle(item.id);
                    }}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",
                      borderBottom:idx<ci.length-1?"1px solid rgba(255,255,255,0.045)":"none",
                      background:isDone?CAT[cat].bg:"transparent"}}>
                    <div className="chk"
                      onClick={isExpandable?e=>{e.stopPropagation();toggle(item.id);}:undefined}
                      style={{width:21,height:21,borderRadius:6,
                        border:isDone?"none":"2px solid rgba(255,255,255,0.18)",
                        background:isDone?CAT[cat].color:"transparent",
                        display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                      {isDone&&<svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4.5L4 7.5L10 1" stroke="#0d0d10" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span style={{fontSize:15,flexShrink:0}}>{item.icon}</span>
                    <span style={{fontSize:14,flex:1,color:isDone?"#555":"#dbd7cf",
                      textDecoration:isDone?"line-through":"none"}}>{item.label}</span>
                    {isExpandable&&(
                      <span style={{fontSize:11,
                        color:isWO?"#38bdf8":isPar?"#fb923c":"#fb923c",flexShrink:0}}>
                        View →
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* Completion banner */}
      {pct===100&&(
        <div style={{margin:"4px 0",padding:"18px 20px",
          background:"linear-gradient(135deg,rgba(253,230,138,0.08),rgba(192,132,252,0.1))",
          border:"1px solid rgba(253,230,138,0.2)",borderRadius:14,textAlign:"center"}}>
          <div style={{fontSize:26,marginBottom:6}}>🎉</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,marginBottom:4}}>
            {DAY_LABELS[activeDay]} — complete!
          </div>
          <div style={{fontSize:13,color:"#666"}}>Every item checked. Keep the streak going.</div>
        </div>
      )}
    </>
  );
}
