import { useState, useMemo } from "react";
import {
  MEAL_LIBRARY, GROCERY_DISPLAY, CALORIE_TARGET, PROTEIN_TARGET,
  WED_SHOP_DAYS, SUN_SHOP_DAYS, PAR_CATEGORIES,
} from "../constants";

const DAYS_ORDER = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
const DAY_LABELS = { MON:"Monday",TUE:"Tuesday",WED:"Wednesday",THU:"Thursday",FRI:"Friday",SAT:"Saturday",SUN:"Sunday" };
const DAY_SHORT  = { MON:"Mon",TUE:"Tue",WED:"Wed",THU:"Thu",FRI:"Fri",SAT:"Sat",SUN:"Sun" };

const CAT_META = {
  breakfast: { label:"Breakfast", color:"#fde68a" },
  mains:     { label:"Mains",     color:"#4ade80" },
  snacks:    { label:"Snacks",    color:"#fb923c" },
};

function gToLbs(g) { return (g / 453.592).toFixed(2); }

function getDayTotals(assigned) {
  return DAYS_ORDER.reduce((acc, day) => {
    const entries = assigned[day] || [];
    const cals = entries.reduce((s, e) => {
      const m = MEAL_LIBRARY.find(x => x.id === e.mealId);
      return s + (m ? m.calories : 0);
    }, 0);
    const pro = entries.reduce((s, e) => {
      const m = MEAL_LIBRARY.find(x => x.id === e.mealId);
      return s + (m ? m.protein : 0);
    }, 0);
    acc[day] = { cals, pro };
    return acc;
  }, {});
}

function buildGroceryList(assigned, daySet) {
  const totals = {};
  DAYS_ORDER.filter(d => daySet.has(d)).forEach(day => {
    (assigned[day] || []).forEach(entry => {
      const meal = MEAL_LIBRARY.find(m => m.id === entry.mealId);
      if (!meal) return;
      meal.ingredients.forEach(ing => {
        if (!ing.groceryKey) return;
        if (!totals[ing.groceryKey]) totals[ing.groceryKey] = { total:0, isCount: ing.unit === "count" };
        if (ing.unit === "count") totals[ing.groceryKey].total += (ing.count || 1);
        else totals[ing.groceryKey].total += (ing.grams || 0);
      });
    });
  });
  return totals;
}

// ── MacroBar ──────────────────────────────────────────────
function MacroBar({ current, target, color }) {
  const pct = Math.min((current / target) * 100, 100);
  const over = current > target;
  return (
    <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden", marginTop:4 }}>
      <div style={{ height:"100%", width:`${pct}%`, background:over?"#fb923c":color, borderRadius:99, transition:"width 0.3s" }}/>
    </div>
  );
}

// ── Recipe card (expandable) ──────────────────────────────
function RecipeCard({ meal }) {
  const [open, setOpen] = useState(false);
  const cat = CAT_META[meal.category];
  return (
    <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:14, overflow:"hidden", marginBottom:10 }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", cursor:"pointer" }}
        className="row">
        <span style={{ fontSize:22, flexShrink:0 }}>{meal.emoji}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, color:"#dbd7cf", marginBottom:3 }}>{meal.name}</div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:10, color:cat.color, background:`${cat.color}18`,
              padding:"1px 6px", borderRadius:4, fontWeight:600 }}>{cat.label}</span>
            <span style={{ fontSize:10, color:"#555" }}>{meal.calories} cal · {meal.protein}g pro</span>
          </div>
        </div>
        <span style={{ color:"#444", fontSize:12, transform:open?"rotate(180deg)":"none",
          transition:"transform 0.2s", flexShrink:0 }}>▾</span>
      </div>

      {open && (
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"14px 16px" }}>
          {meal.note && (
            <div style={{ fontSize:12, color:"#888", background:"rgba(255,255,255,0.04)",
              borderRadius:8, padding:"8px 10px", marginBottom:12, lineHeight:1.6 }}>
              {meal.note}
            </div>
          )}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, color:"#fb923c",
              textTransform:"uppercase", marginBottom:8 }}>Ingredients</div>
            {meal.ingredients.map((ing, i) => {
              let amount = "";
              if (ing.unit === "count") amount = ing.measure || `${ing.count}`;
              else if (ing.grams) amount = `${ing.grams}g${ing.isRaw ? " raw" : ""}`;
              else if (ing.measure) amount = ing.measure;
              return (
                <div key={i} style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", padding:"5px 0",
                  borderBottom:i<meal.ingredients.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <span style={{ fontSize:12, color:"#888" }}>{ing.name}</span>
                  <span style={{ fontSize:12, color:"#555", fontWeight:600 }}>{amount}</span>
                </div>
              );
            })}
          </div>
          {meal.steps && meal.steps.length > 0 && (
            <div>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, color:"#4ade80",
                textTransform:"uppercase", marginBottom:8 }}>Steps</div>
              {meal.steps.map((step, i) => (
                <div key={i} style={{ display:"flex", gap:10, padding:"5px 0",
                  borderBottom:i<meal.steps.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <span style={{ fontSize:11, color:"#444", flexShrink:0, marginTop:1 }}>{i+1}.</span>
                  <span style={{ fontSize:12, color:"#888", lineHeight:1.6 }}>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── PICK TAB ──────────────────────────────────────────────
function PickTab({ picks, onUpdatePicks }) {
  const [filter, setFilter] = useState("all");

  const totalPicked = Object.values(picks).reduce((s, c) => s + c, 0);
  const totalCals   = Object.entries(picks).reduce((s, [id, qty]) => {
    const m = MEAL_LIBRARY.find(x => x.id === id);
    return s + (m ? m.calories * qty : 0);
  }, 0);
  const totalPro = Object.entries(picks).reduce((s, [id, qty]) => {
    const m = MEAL_LIBRARY.find(x => x.id === id);
    return s + (m ? m.protein * qty : 0);
  }, 0);

  const cats = ["all","breakfast","mains","snacks"];
  const filtered = MEAL_LIBRARY.filter(m => filter === "all" || m.category === filter);

  function setQty(id, delta) {
    const current = picks[id] || 0;
    const next = Math.max(0, current + delta);
    const updated = { ...picks };
    if (next === 0) delete updated[id];
    else updated[id] = next;
    onUpdatePicks(updated);
  }

  return (
    <div>
      {/* Summary bar */}
      <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
          <span style={{ fontSize:12, color:"#888" }}>
            {totalPicked} meal{totalPicked!==1?"s":""} picked this week
          </span>
          {totalPicked > 0 && (
            <span style={{ fontSize:11, color:"#555" }}>
              ~{Math.round(totalCals/7)} cal/day · {Math.round(totalPro/7)}g pro/day avg
            </span>
          )}
        </div>
        {totalPicked === 0 && (
          <div style={{ fontSize:11, color:"#444" }}>Tap + to add meals to your week</div>
        )}
      </div>

      {/* Category filter */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            flex:1, padding:"7px 4px", borderRadius:8, border:"none", cursor:"pointer",
            background:filter===c?(c==="all"?"#ece9e3":CAT_META[c]?.color||"#ece9e3"):"rgba(255,255,255,0.06)",
            color:filter===c?"#0d0d10":"#666",
            fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500 }}>
            {c === "all" ? "All" : CAT_META[c].label}
          </button>
        ))}
      </div>

      {/* Meal list */}
      {filtered.map(meal => {
        const qty = picks[meal.id] || 0;
        const cat = CAT_META[meal.category];
        return (
          <div key={meal.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
            background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:12, marginBottom:8 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{meal.emoji}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, color:"#dbd7cf", marginBottom:2,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{meal.name}</div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <span style={{ fontSize:10, color:cat.color, background:`${cat.color}18`,
                  padding:"1px 5px", borderRadius:4, fontWeight:600 }}>{cat.label}</span>
                <span style={{ fontSize:10, color:"#555" }}>{meal.calories} cal · {meal.protein}g pro</span>
              </div>
            </div>
            {/* Stepper */}
            <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
              <button onClick={() => setQty(meal.id, -1)} disabled={qty===0}
                style={{ width:28, height:28, borderRadius:8,
                  border:"1px solid rgba(255,255,255,0.1)",
                  background:qty>0?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.03)",
                  color:qty>0?"#888":"#333", cursor:qty>0?"pointer":"not-allowed",
                  fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
                −
              </button>
              <span style={{ fontSize:16, fontWeight:700,
                color:qty>0?cat.color:"#333", minWidth:20, textAlign:"center" }}>
                {qty}
              </span>
              <button onClick={() => setQty(meal.id, 1)}
                style={{ width:28, height:28, borderRadius:8,
                  border:"1px solid rgba(255,255,255,0.1)",
                  background:"rgba(255,255,255,0.07)",
                  color:"#888", cursor:"pointer",
                  fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
                ＋
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── ASSIGN TAB ────────────────────────────────────────────
function AssignTab({ picks, assigned, onUpdateAssigned }) {
  const [activeDay, setActiveDay]   = useState("MON");
  const [selected,  setSelected]    = useState(null); // mealId selected from pool

  const dayTotals = getDayTotals(assigned);

  // Build pool: picks minus already-assigned
  const pool = useMemo(() => {
    const used = {};
    DAYS_ORDER.forEach(day => {
      (assigned[day] || []).forEach(e => {
        used[e.mealId] = (used[e.mealId] || 0) + 1;
      });
    });
    return Object.entries(picks)
      .map(([mealId, qty]) => ({ mealId, remaining: qty - (used[mealId] || 0) }))
      .filter(x => x.remaining > 0);
  }, [picks, assigned]);

  function assignToDay(day, mealId) {
    const current = assigned[day] || [];
    const updated = {
      ...assigned,
      [day]: [...current, { mealId, id:`${day}_${Date.now()}` }],
    };
    onUpdateAssigned(updated);
    setSelected(null);
  }

  function removeFromDay(day, id) {
    const updated = {
      ...assigned,
      [day]: (assigned[day] || []).filter(e => e.id !== id),
    };
    onUpdateAssigned(updated);
  }

  const activeDayEntries = assigned[activeDay] || [];
  const { cals, pro } = dayTotals[activeDay] || { cals:0, pro:0 };
  const calColor = cals > CALORIE_TARGET ? "#fb923c" : cals > CALORIE_TARGET * 0.85 ? "#fde68a" : cals > 0 ? "#4ade80" : "#444";

  return (
    <div>
      {/* Pool */}
      {pool.length > 0 ? (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#888",
            textTransform:"uppercase", marginBottom:8 }}>
            Your pool — tap to select, then tap a day
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {pool.map(({ mealId, remaining }) => {
              const meal = MEAL_LIBRARY.find(m => m.id === mealId);
              if (!meal) return null;
              const cat = CAT_META[meal.category];
              const isSelected = selected === mealId;
              return (
                <button key={mealId} onClick={() => setSelected(isSelected ? null : mealId)}
                  style={{ display:"flex", alignItems:"center", gap:6,
                    padding:"6px 10px", borderRadius:10,
                    border:isSelected?`2px solid ${cat.color}`:"1px solid rgba(255,255,255,0.1)",
                    background:isSelected?`${cat.color}20`:"rgba(255,255,255,0.05)",
                    cursor:"pointer", transition:"all 0.15s" }}>
                  <span style={{ fontSize:14 }}>{meal.emoji}</span>
                  <span style={{ fontSize:11, color:isSelected?cat.color:"#999",
                    fontFamily:"'DM Sans',sans-serif", maxWidth:120,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {meal.name}
                  </span>
                  <span style={{ fontSize:11, color:cat.color, fontWeight:700,
                    background:`${cat.color}25`, borderRadius:4, padding:"0 5px" }}>
                    ×{remaining}
                  </span>
                </button>
              );
            })}
          </div>
          {selected && (
            <div style={{ marginTop:8, fontSize:12, color:"#4ade80",
              background:"rgba(74,222,128,0.08)", borderRadius:8, padding:"8px 12px" }}>
              ✓ {MEAL_LIBRARY.find(m=>m.id===selected)?.name} selected — now tap a day below
            </div>
          )}
        </div>
      ) : Object.keys(picks).length === 0 ? (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:12, padding:"20px", textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:24, marginBottom:6 }}>🥡</div>
          <div style={{ fontSize:13, color:"#555" }}>No meals picked yet</div>
          <div style={{ fontSize:11, color:"#444", marginTop:4 }}>Head to Pick to build your pool</div>
        </div>
      ) : (
        <div style={{ background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.15)",
          borderRadius:12, padding:"10px 14px", marginBottom:16 }}>
          <div style={{ fontSize:12, color:"#4ade80" }}>✓ All picked meals assigned</div>
        </div>
      )}

      {/* Day strip */}
      <div style={{ display:"flex", gap:5, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
        {DAYS_ORDER.map(day => {
          const { cals:dCals } = dayTotals[day] || { cals:0 };
          const count = (assigned[day]||[]).length;
          const isActive = day === activeDay;
          const dColor = dCals > CALORIE_TARGET ? "#fb923c" : dCals > CALORIE_TARGET*0.85 ? "#fde68a" : dCals > 0 ? "#4ade80" : "#444";
          const canDrop = selected && pool.some(p => p.mealId === selected);
          return (
            <button key={day}
              onClick={() => {
                if (selected && canDrop) assignToDay(day, selected);
                else setActiveDay(day);
              }}
              style={{
                flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center",
                padding:"8px 8px", borderRadius:12, minWidth:44,
                background: selected && canDrop ? "rgba(74,222,128,0.12)"
                  : isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                border: selected && canDrop ? "1px solid rgba(74,222,128,0.4)"
                  : isActive ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                cursor:"pointer", transition:"all 0.15s" }}>
              <span style={{ fontSize:11, color:isActive?"#ece9e3":"#555",
                fontFamily:"'DM Sans',sans-serif", fontWeight:isActive?600:400 }}>
                {DAY_SHORT[day]}
              </span>
              <span style={{ fontSize:10, color:dColor, marginTop:3, fontWeight:700 }}>
                {count > 0 ? `${count}🍽️` : "—"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active day detail */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600 }}>
          {DAY_LABELS[activeDay]}
        </div>
        {activeDayEntries.length > 0 && (
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:16, fontWeight:700, color:calColor }}>{Math.round(cals)} cal</div>
            <div style={{ fontSize:10, color:"#555" }}>{Math.round(pro)}g protein</div>
          </div>
        )}
      </div>

      {activeDayEntries.length > 0 && (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:12, padding:"10px 14px", marginBottom:12 }}>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, color:"#555" }}>Calories</span>
                <span style={{ fontSize:10, color:cals>CALORIE_TARGET?"#fb923c":"#4ade80", fontWeight:600 }}>
                  {Math.round(cals)}/{CALORIE_TARGET}
                </span>
              </div>
              <MacroBar current={cals} target={CALORIE_TARGET} color="#4ade80"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, color:"#555" }}>Protein</span>
                <span style={{ fontSize:10, color:pro>=PROTEIN_TARGET?"#4ade80":"#a78bfa", fontWeight:600 }}>
                  {Math.round(pro)}g/{PROTEIN_TARGET}g
                </span>
              </div>
              <MacroBar current={pro} target={PROTEIN_TARGET} color="#a78bfa"/>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:14, overflow:"hidden" }}>
        {activeDayEntries.length === 0 ? (
          <div style={{ padding:"20px", textAlign:"center", color:"#444", fontSize:13 }}>
            {selected ? "Tap here or any day button to assign" : "No meals assigned — select from pool above"}
          </div>
        ) : (
          activeDayEntries.map((entry, i) => {
            const meal = MEAL_LIBRARY.find(m => m.id === entry.mealId);
            if (!meal) return null;
            const cat = CAT_META[meal.category];
            return (
              <div key={entry.id} style={{ display:"flex", alignItems:"center", gap:10,
                padding:"11px 14px",
                borderBottom:i<activeDayEntries.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{meal.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:"#dbd7cf" }}>{meal.name}</div>
                  <div style={{ display:"flex", gap:6, marginTop:2 }}>
                    <span style={{ fontSize:10, color:cat.color, background:`${cat.color}18`,
                      padding:"1px 5px", borderRadius:4, fontWeight:600 }}>{cat.label}</span>
                    <span style={{ fontSize:10, color:"#555" }}>{meal.calories} cal · {meal.protein}g pro</span>
                  </div>
                </div>
                <button onClick={() => removeFromDay(activeDay, entry.id)}
                  style={{ background:"none", border:"none", color:"#444",
                    cursor:"pointer", fontSize:18, padding:"0 2px", flexShrink:0 }}>×</button>
              </div>
            );
          })
        )}
        {selected && (
          <div onClick={() => assignToDay(activeDay, selected)}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 14px",
              cursor:"pointer", color:"#4ade80",
              borderTop:activeDayEntries.length>0?"1px solid rgba(255,255,255,0.04)":"none",
              background:"rgba(74,222,128,0.05)" }} className="row">
            <span style={{ fontSize:18 }}>＋</span>
            <span style={{ fontSize:13 }}>
              Add {MEAL_LIBRARY.find(m=>m.id===selected)?.name} here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── OVERVIEW TAB ──────────────────────────────────────────
function OverviewTab({ assigned }) {
  const [recipeFilter, setRecipeFilter] = useState("all");
  const dayTotals = getDayTotals(assigned);
  const totalMeals = DAYS_ORDER.reduce((s, d) => s + (assigned[d]||[]).length, 0);

  const recipeFiltered = MEAL_LIBRARY.filter(m =>
    recipeFilter === "all" || m.category === recipeFilter
  );

  return (
    <div>
      {/* Week summary */}
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#888",
        textTransform:"uppercase", marginBottom:12 }}>Week at a glance</div>

      {totalMeals === 0 ? (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, padding:"24px 20px", textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>📅</div>
          <div style={{ fontSize:13, color:"#555" }}>Nothing assigned yet</div>
          <div style={{ fontSize:11, color:"#444", marginTop:4 }}>Use Pick + Assign to build your week</div>
        </div>
      ) : (
        <div style={{ marginBottom:24 }}>
          {DAYS_ORDER.map(day => {
            const entries = assigned[day] || [];
            const { cals, pro } = dayTotals[day] || { cals:0, pro:0 };
            const calColor = cals > CALORIE_TARGET ? "#fb923c" : cals > CALORIE_TARGET*0.85 ? "#fde68a" : cals > 0 ? "#4ade80" : "#444";
            return (
              <div key={day} style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:12, padding:"11px 14px", marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  marginBottom:entries.length>0?8:0 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#dbd7cf" }}>{DAY_LABELS[day]}</span>
                  {entries.length > 0 ? (
                    <span style={{ fontSize:11, color:calColor, fontWeight:700 }}>
                      {Math.round(cals)} cal · {Math.round(pro)}g pro
                    </span>
                  ) : (
                    <span style={{ fontSize:11, color:"#333" }}>Nothing planned</span>
                  )}
                </div>
                {entries.length > 0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {entries.map(entry => {
                      const meal = MEAL_LIBRARY.find(m => m.id === entry.mealId);
                      if (!meal) return null;
                      const cat = CAT_META[meal.category];
                      return (
                        <span key={entry.id} style={{ fontSize:11, color:cat.color,
                          background:`${cat.color}14`, padding:"3px 8px", borderRadius:6 }}>
                          {meal.emoji} {meal.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Recipe library */}
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#888",
        textTransform:"uppercase", marginBottom:12 }}>Recipe Library</div>

      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {["all","breakfast","mains","snacks"].map(c => (
          <button key={c} onClick={() => setRecipeFilter(c)} style={{
            flex:1, padding:"7px 4px", borderRadius:8, border:"none", cursor:"pointer",
            background:recipeFilter===c?(c==="all"?"#ece9e3":CAT_META[c]?.color||"#ece9e3"):"rgba(255,255,255,0.06)",
            color:recipeFilter===c?"#0d0d10":"#666",
            fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500 }}>
            {c === "all" ? "All" : CAT_META[c].label}
          </button>
        ))}
      </div>

      {recipeFiltered.map(meal => <RecipeCard key={meal.id} meal={meal}/>)}
    </div>
  );
}

// ── SHOP TAB ──────────────────────────────────────────────
function ShopTab({ assigned, parStock }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [shopDay, setShopDay] = useState("WED");

  const daySet = shopDay === "WED" ? WED_SHOP_DAYS : SUN_SHOP_DAYS;
  const groceries = useMemo(() => buildGroceryList(assigned, daySet), [assigned, shopDay]);
  const groceryEntries = Object.entries(groceries);
  const remaining = groceryEntries.filter(([k]) => !checkedItems[k]).length;

  const shopLabel = shopDay === "WED"
    ? "Wednesday — covers Wed / Thu / Fri / Sat"
    : "Sunday — covers Sun / Mon / Tue";

  function toggleCheck(key) {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  }

  // Household — Wednesday only
  const belowPar = shopDay === "WED" ? PAR_CATEGORIES.flatMap(cat =>
    cat.items
      .filter(item => parseInt(parStock?.[item.id] ?? item.par, 10) < item.par)
      .map(item => ({ ...item, catLabel:cat.label, stock:parseInt(parStock?.[item.id] ?? item.par, 10) }))
  ) : [];

  return (
    <div>
      {/* Shop day toggle */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["WED","Wednesday"],["SUN","Sunday"]].map(([d,l]) => (
          <button key={d} onClick={() => { setShopDay(d); setCheckedItems({}); }} style={{
            flex:1, padding:"10px", borderRadius:10, border:"none", cursor:"pointer",
            background:shopDay===d?"#ece9e3":"rgba(255,255,255,0.06)",
            color:shopDay===d?"#0d0d10":"#777",
            fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500 }}>
            🛒 {l}
          </button>
        ))}
      </div>

      <div style={{ fontSize:11, color:"#555", marginBottom:14 }}>{shopLabel}</div>

      {/* Progress bar */}
      {groceryEntries.length > 0 && (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:12, padding:"11px 14px", marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:12, color:"#888" }}>Shopping progress</span>
            <span style={{ fontSize:12, fontWeight:700,
              color:remaining===0?"#4ade80":"#dbd7cf" }}>
              {groceryEntries.length-remaining}/{groceryEntries.length} grabbed
            </span>
          </div>
          <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:99, background:"#4ade80", transition:"width 0.3s",
              width:`${((groceryEntries.length-remaining)/groceryEntries.length)*100}%` }}/>
          </div>
        </div>
      )}

      {/* Grocery list */}
      {groceryEntries.length === 0 ? (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, padding:"28px 20px", textAlign:"center", marginBottom:14 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>🛒</div>
          <div style={{ fontSize:14, color:"#555" }}>No groceries needed</div>
          <div style={{ fontSize:11, color:"#444", marginTop:4 }}>
            Assign meals to {shopDay==="WED"?"Wed–Sat":"Sun–Tue"} in the Assign tab
          </div>
        </div>
      ) : (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, overflow:"hidden", marginBottom:16 }}>
          <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#4ade80",
              textTransform:"uppercase" }}>🥩 Groceries</div>
          </div>
          {groceryEntries.map(([key, data], i) => {
            const display = GROCERY_DISPLAY[key];
            if (!display) return null;
            const isChecked = !!checkedItems[key];
            let amountStr = data.isCount
              ? `${data.total} ${data.total===1?"pc":"pcs"}`
              : `${Math.round(data.total)}g${display.showLbs ? ` (${gToLbs(data.total)} lbs)` : ""}`;
            return (
              <div key={key} onClick={() => toggleCheck(key)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
                  borderBottom:i<groceryEntries.length-1?"1px solid rgba(255,255,255,0.04)":"none",
                  cursor:"pointer",
                  background:isChecked?"rgba(74,222,128,0.04)":"transparent" }} className="row">
                <div style={{ width:20, height:20, borderRadius:6, flexShrink:0,
                  border:isChecked?"none":"2px solid rgba(255,255,255,0.15)",
                  background:isChecked?"#4ade80":"transparent",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {isChecked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#0d0d10" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:isChecked?"#555":"#dbd7cf",
                    textDecoration:isChecked?"line-through":"none" }}>{display.name}</div>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:isChecked?"#444":"#888", flexShrink:0 }}>
                  {amountStr}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Household — Wednesday only */}
      {shopDay === "WED" && (
        belowPar.length === 0 ? (
          <div style={{ background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.15)",
            borderRadius:14, padding:"14px", marginBottom:20 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#4ade80",
              textTransform:"uppercase", marginBottom:5 }}>🏠 Household</div>
            <div style={{ fontSize:13, color:"#4ade80" }}>✓ All household items at par</div>
          </div>
        ) : (
          <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:14, overflow:"hidden", marginBottom:20 }}>
            <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#fb923c",
                textTransform:"uppercase" }}>🏠 Household — below par</div>
            </div>
            {belowPar.map((item, i) => (
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12,
                padding:"11px 14px",
                borderBottom:i<belowPar.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:"#dbd7cf" }}>{item.name}</div>
                  <div style={{ fontSize:10, color:"#555", marginTop:1 }}>{item.catLabel}</div>
                </div>
                <div style={{ fontSize:12, color:"#fb923c", fontWeight:700 }}>
                  {item.stock}/{item.par} {item.unit}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// ── Main FoodTab ──────────────────────────────────────────
export default function FoodTab({ mealPlan, onUpdateMealPlan, parStock, saving, saveError }) {
  const [tab, setTab] = useState("pick");

  // mealPlan shape: { picks: {mealId: qty}, assigned: {day: [{mealId, id}]} }
  const picks   = mealPlan?.picks   || {};
  const assigned = mealPlan?.assigned || {};

  function updatePicks(newPicks) {
    onUpdateMealPlan({ picks: newPicks, assigned });
  }
  function updateAssigned(newAssigned) {
    onUpdateMealPlan({ picks, assigned: newAssigned });
  }

  const totalPicked   = Object.values(picks).reduce((s,c) => s+c, 0);
  const totalAssigned = DAYS_ORDER.reduce((s,d) => s+(assigned[d]||[]).length, 0);

  const TABS = [
    { id:"pick",     label:"Pick"     },
    { id:"assign",   label:"Assign"   },
    { id:"overview", label:"Overview" },
    { id:"shop",     label:"Shop"     },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:4 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600 }}>Meal Plan</div>
        <div style={{ textAlign:"right" }}>
          {saving     && <div style={{ fontSize:11, color:"#555" }}>Saving…</div>}
          {saveError  && <div style={{ fontSize:11, color:"#fb923c" }}>⚠️ Save failed</div>}
          {!saving && !saveError && totalPicked > 0 && (
            <div style={{ fontSize:11, color:"#555" }}>
              {totalPicked} picked · {totalAssigned} assigned
            </div>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:"flex", gap:5, marginBottom:20, marginTop:12 }}>
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex:1, padding:"9px 4px", borderRadius:10, border:"none", cursor:"pointer",
            background:tab===id?"#ece9e3":"rgba(255,255,255,0.06)",
            color:tab===id?"#0d0d10":"#777",
            fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500 }}>
            {label}
          </button>
        ))}
      </div>

      {tab==="pick"     && <PickTab     picks={picks}    onUpdatePicks={updatePicks}/>}
      {tab==="assign"   && <AssignTab   picks={picks}    assigned={assigned} onUpdateAssigned={updateAssigned}/>}
      {tab==="overview" && <OverviewTab assigned={assigned}/>}
      {tab==="shop"     && <ShopTab     assigned={assigned} parStock={parStock}/>}
    </div>
  );
}
