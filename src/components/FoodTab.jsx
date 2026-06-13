import { useState, useMemo } from "react";
import { MEAL_LIBRARY, GROCERY_DISPLAY, CALORIE_TARGET, PROTEIN_TARGET, WED_SHOP_DAYS, SUN_SHOP_DAYS, PAR_CATEGORIES } from "../constants";

const DAYS_ORDER = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
const DAY_LABELS = { MON:"Monday",TUE:"Tuesday",WED:"Wednesday",THU:"Thursday",FRI:"Friday",SAT:"Saturday",SUN:"Sunday" };
const DAY_SHORT  = { MON:"Mon",TUE:"Tue",WED:"Wed",THU:"Thu",FRI:"Fri",SAT:"Sat",SUN:"Sun" };

const CAT_META = {
  breakfast: { label:"Breakfast", color:"#fde68a", emoji:"🌅" },
  mains:     { label:"Mains",     color:"#4ade80", emoji:"🍽️" },
  snacks:    { label:"Snacks",    color:"#fb923c", emoji:"🍎" },
};

// ── helpers ───────────────────────────────────────────────
function gToLbs(g) { return (g / 453.592).toFixed(2); }

function buildGroceryList(mealPlan, daySet) {
  const totals = {}; // groceryKey → { grams|count, isCount }
  DAYS_ORDER.filter(d => daySet.has(d)).forEach(day => {
    const entries = mealPlan[day] || [];
    entries.forEach(entry => {
      const meal = MEAL_LIBRARY.find(m => m.id === entry.mealId);
      if (!meal) return;
      meal.ingredients.forEach(ing => {
        if (!ing.groceryKey) return; // pantry staple — skip
        if (!totals[ing.groceryKey]) totals[ing.groceryKey] = { total: 0, isCount: ing.unit === "count" };
        if (ing.unit === "count") {
          totals[ing.groceryKey].total += (ing.count || 1) * (entry.servings || 1);
        } else {
          totals[ing.groceryKey].total += (ing.grams || 0) * (entry.servings || 1);
        }
      });
    });
  });
  return totals;
}

// ── sub-components ────────────────────────────────────────

function MacroBar({ current, target, color }) {
  const pct  = Math.min((current / target) * 100, 100);
  const over = current > target;
  return (
    <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden", marginTop:4 }}>
      <div style={{ height:"100%", width:`${pct}%`, background:over?"#fb923c":color, borderRadius:99, transition:"width 0.3s" }}/>
    </div>
  );
}

function DayMacroChip({ mealPlan, day }) {
  const entries = mealPlan[day] || [];
  const cals = entries.reduce((s, e) => {
    const m = MEAL_LIBRARY.find(x => x.id === e.mealId);
    return s + (m ? m.calories * (e.servings || 1) : 0);
  }, 0);
  const pro = entries.reduce((s, e) => {
    const m = MEAL_LIBRARY.find(x => x.id === e.mealId);
    return s + (m ? m.protein * (e.servings || 1) : 0);
  }, 0);
  const calColor = cals > CALORIE_TARGET ? "#fb923c" : cals > CALORIE_TARGET * 0.85 ? "#fde68a" : cals > 0 ? "#4ade80" : "#444";
  return { cals, pro, calColor };
}

// ── AddMealSheet ──────────────────────────────────────────
function AddMealSheet({ onAdd, onClose }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const cats = ["all","breakfast","mains","snacks"];
  const filtered = MEAL_LIBRARY.filter(m => {
    const matchCat  = filter === "all" || m.category === filter;
    const matchSearch = search.length === 0 || m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#18181d",
        borderRadius:"20px 20px 0 0", border:"1px solid rgba(255,255,255,0.08)",
        width:"100%", maxWidth:540, maxHeight:"82vh", display:"flex", flexDirection:"column" }}>

        {/* Header */}
        <div style={{ padding:"20px 20px 12px", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600 }}>Add a meal</div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"none",
              color:"#888", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
          </div>

          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search meals…"
            style={{ width:"100%", background:"#0d0d10", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:10, padding:"9px 12px", color:"#ece9e3", fontSize:13,
              fontFamily:"'DM Sans',sans-serif", outline:"none", marginBottom:10, boxSizing:"border-box" }}/>

          {/* Filter pills */}
          <div style={{ display:"flex", gap:6 }}>
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding:"6px 12px", borderRadius:99, border:"none", cursor:"pointer",
                background:filter===c ? (c==="all"?"#ece9e3":CAT_META[c]?.color||"#ece9e3") : "rgba(255,255,255,0.07)",
                color:filter===c?"#0d0d10":"#666",
                fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500 }}>
                {c === "all" ? "All" : CAT_META[c].label}
              </button>
            ))}
          </div>
        </div>

        {/* Meal list */}
        <div style={{ overflowY:"auto", flex:1 }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"30px 20px", textAlign:"center", color:"#444", fontSize:13 }}>No meals found</div>
          ) : (
            filtered.map((meal, i) => (
              <div key={meal.id} onClick={() => { onAdd(meal.id); onClose(); }}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 20px",
                  borderBottom:i < filtered.length-1 ? "1px solid rgba(255,255,255,0.045)" : "none",
                  cursor:"pointer" }} className="row">
                <span style={{ fontSize:22, flexShrink:0 }}>{meal.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:"#dbd7cf", marginBottom:2 }}>{meal.name}</div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:10, color:CAT_META[meal.category]?.color||"#888",
                      background:`${CAT_META[meal.category]?.color||"#888"}18`,
                      padding:"1px 6px", borderRadius:4, fontWeight:600 }}>
                      {CAT_META[meal.category]?.label}
                    </span>
                    <span style={{ fontSize:10, color:"#555" }}>{meal.calories} cal · {meal.protein}g protein</span>
                  </div>
                </div>
                <span style={{ color:"#333", fontSize:18 }}>+</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── MealEntry (in day view) ───────────────────────────────
function MealEntry({ entry, onRemove }) {
  const meal = MEAL_LIBRARY.find(m => m.id === entry.mealId);
  if (!meal) return null;
  const cat = CAT_META[meal.category];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
      borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontSize:16, flexShrink:0 }}>{meal.emoji}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, color:"#dbd7cf" }}>{meal.name}</div>
        <div style={{ display:"flex", gap:8, marginTop:2 }}>
          <span style={{ fontSize:10, color:cat.color, background:`${cat.color}18`,
            padding:"1px 6px", borderRadius:4, fontWeight:600 }}>{cat.label}</span>
          <span style={{ fontSize:10, color:"#555" }}>{meal.calories} cal · {meal.protein}g pro</span>
        </div>
      </div>
      <button onClick={onRemove} style={{ background:"none", border:"none", color:"#444",
        cursor:"pointer", fontSize:18, padding:"0 2px", flexShrink:0 }}>×</button>
    </div>
  );
}

// ── ASSIGN TAB ────────────────────────────────────────────
function AssignTab({ mealPlan, onUpdate }) {
  const [activeDay,  setActiveDay]  = useState("MON");
  const [addingTo,   setAddingTo]   = useState(null);

  const entries = mealPlan[activeDay] || [];
  const { cals, pro, calColor } = DayMacroChip({ mealPlan, day:activeDay });

  function addMeal(day, mealId) {
    const current = mealPlan[day] || [];
    onUpdate({ ...mealPlan, [day]: [...current, { mealId, id:`${day}_${Date.now()}`, servings:1 }] });
  }

  function removeMeal(day, id) {
    const current = mealPlan[day] || [];
    onUpdate({ ...mealPlan, [day]: current.filter(e => e.id !== id) });
  }

  return (
    <div>
      {addingTo && (
        <AddMealSheet onAdd={mealId => addMeal(addingTo, mealId)} onClose={() => setAddingTo(null)}/>
      )}

      {/* Day selector strip */}
      <div style={{ display:"flex", gap:5, marginBottom:20, overflowX:"auto", paddingBottom:4 }}>
        {DAYS_ORDER.map(day => {
          const { cals: dCals, calColor: dColor } = DayMacroChip({ mealPlan, day });
          const isActive = day === activeDay;
          const count = (mealPlan[day] || []).length;
          return (
            <button key={day} onClick={() => setActiveDay(day)} style={{
              flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center",
              padding:"8px 10px", borderRadius:12,
              background:isActive?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.04)",
              border:isActive?"1px solid rgba(255,255,255,0.15)":"1px solid transparent",
              cursor:"pointer", minWidth:48 }}>
              <span style={{ fontSize:11, color:isActive?"#ece9e3":"#555", fontFamily:"'DM Sans',sans-serif", fontWeight:isActive?600:400 }}>
                {DAY_SHORT[day]}
              </span>
              {count > 0 && (
                <span style={{ fontSize:10, color:dColor, marginTop:2, fontWeight:700 }}>{dCals}</span>
              )}
              {count === 0 && <span style={{ fontSize:10, color:"#333", marginTop:2 }}>—</span>}
            </button>
          );
        })}
      </div>

      {/* Active day header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600 }}>{DAY_LABELS[activeDay]}</div>
          {entries.length > 0 && (
            <div style={{ fontSize:11, color:"#555", marginTop:2 }}>{entries.length} meal{entries.length!==1?"s":""} planned</div>
          )}
        </div>
        {entries.length > 0 && (
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:20, fontWeight:700, color:calColor }}>{Math.round(cals)}</div>
            <div style={{ fontSize:10, color:"#555" }}>cal · {Math.round(pro)}g pro</div>
          </div>
        )}
      </div>

      {/* Macro bars */}
      {entries.length > 0 && (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
          <div style={{ display:"flex", gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, color:"#555" }}>Calories</span>
                <span style={{ fontSize:10, color:cals>CALORIE_TARGET?"#fb923c":"#4ade80", fontWeight:600 }}>
                  {Math.round(cals)}<span style={{ color:"#444" }}>/{CALORIE_TARGET}</span>
                </span>
              </div>
              <MacroBar current={cals} target={CALORIE_TARGET} color="#4ade80"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, color:"#555" }}>Protein</span>
                <span style={{ fontSize:10, color:pro>=PROTEIN_TARGET?"#4ade80":"#a78bfa", fontWeight:600 }}>
                  {Math.round(pro)}g<span style={{ color:"#444" }}>/{PROTEIN_TARGET}g</span>
                </span>
              </div>
              <MacroBar current={pro} target={PROTEIN_TARGET} color="#a78bfa"/>
            </div>
          </div>
        </div>
      )}

      {/* Meal list */}
      <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:14, overflow:"hidden", marginBottom:12 }}>
        {entries.length === 0 ? (
          <div style={{ padding:"24px", textAlign:"center", color:"#444", fontSize:13 }}>
            No meals planned — tap below to add
          </div>
        ) : (
          entries.map(entry => (
            <MealEntry key={entry.id} entry={entry} onRemove={() => removeMeal(activeDay, entry.id)}/>
          ))
        )}
        <div onClick={() => setAddingTo(activeDay)}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 14px",
            cursor:"pointer", color:"#555",
            borderTop:entries.length>0?"1px solid rgba(255,255,255,0.04)":"none" }} className="row">
          <span style={{ fontSize:20, color:"#4ade80" }}>＋</span>
          <span style={{ fontSize:13 }}>Add meal to {DAY_SHORT[activeDay]}</span>
        </div>
      </div>
    </div>
  );
}

// ── OVERVIEW TAB ──────────────────────────────────────────
function OverviewTab({ mealPlan }) {
  // Count usage of each meal across the week
  const usageCounts = useMemo(() => {
    const counts = {};
    DAYS_ORDER.forEach(day => {
      (mealPlan[day] || []).forEach(entry => {
        counts[entry.mealId] = (counts[entry.mealId] || 0) + 1;
      });
    });
    return counts;
  }, [mealPlan]);

  const totalMeals = Object.values(usageCounts).reduce((s, c) => s + c, 0);

  return (
    <div>
      {/* Week at a glance */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#888",
          textTransform:"uppercase", marginBottom:12 }}>Week at a glance</div>
        {DAYS_ORDER.map(day => {
          const entries = mealPlan[day] || [];
          const { cals, pro, calColor } = DayMacroChip({ mealPlan, day });
          return (
            <div key={day} style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:entries.length>0?8:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#dbd7cf" }}>{DAY_LABELS[day]}</div>
                {entries.length > 0 ? (
                  <div style={{ fontSize:12, color:calColor, fontWeight:700 }}>
                    {Math.round(cals)} cal · {Math.round(pro)}g pro
                  </div>
                ) : (
                  <div style={{ fontSize:11, color:"#333" }}>Nothing planned</div>
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

      {/* Meal frequency */}
      {totalMeals > 0 && (
        <div>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#888",
            textTransform:"uppercase", marginBottom:12 }}>Meal frequency this week</div>
          <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:14, overflow:"hidden" }}>
            {Object.entries(usageCounts)
              .sort(([,a],[,b]) => b - a)
              .map(([mealId, count], i, arr) => {
                const meal = MEAL_LIBRARY.find(m => m.id === mealId);
                if (!meal) return null;
                const cat = CAT_META[meal.category];
                return (
                  <div key={mealId} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
                    borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.045)":"none" }}>
                    <span style={{ fontSize:18, flexShrink:0 }}>{meal.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:"#dbd7cf" }}>{meal.name}</div>
                      <span style={{ fontSize:10, color:cat.color, background:`${cat.color}18`,
                        padding:"1px 6px", borderRadius:4, fontWeight:600 }}>{cat.label}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      {Array.from({ length: count }).map((_, i) => (
                        <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:cat.color }}/>
                      ))}
                      <span style={{ fontSize:12, color:"#555", marginLeft:4 }}>×{count}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {totalMeals === 0 && (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, padding:"30px 20px", textAlign:"center" }}>
          <div style={{ fontSize:28, marginBottom:8 }}>📅</div>
          <div style={{ fontSize:14, color:"#555" }}>No meals planned yet</div>
          <div style={{ fontSize:11, color:"#444", marginTop:4 }}>Head to Assign to start building your week</div>
        </div>
      )}
    </div>
  );
}

// ── SHOP TAB ──────────────────────────────────────────────
function ShopTab({ mealPlan, parStock }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [shopDay, setShopDay] = useState("WED");

  const daySet = shopDay === "WED" ? WED_SHOP_DAYS : SUN_SHOP_DAYS;
  const groceries = useMemo(() => buildGroceryList(mealPlan, daySet), [mealPlan, daySet]);
  const groceryEntries = Object.entries(groceries);

  const shopLabel = shopDay === "WED"
    ? "Wednesday — Wed/Thu/Fri/Sat meals"
    : "Sunday — Sun/Mon/Tue meals";

  function toggleCheck(key) {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const remaining = groceryEntries.filter(([k]) => !checkedItems[k]).length;

  return (
    <div>
      {/* Shop day toggle */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {[["WED","Wednesday"],["SUN","Sunday"]].map(([d, l]) => (
          <button key={d} onClick={() => { setShopDay(d); setCheckedItems({}); }} style={{
            flex:1, padding:"10px", borderRadius:10, border:"none", cursor:"pointer",
            background:shopDay===d?"#ece9e3":"rgba(255,255,255,0.06)",
            color:shopDay===d?"#0d0d10":"#777",
            fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500 }}>
            🛒 {l}
          </button>
        ))}
      </div>

      <div style={{ fontSize:11, color:"#555", marginBottom:16 }}>{shopLabel}</div>

      {/* Progress */}
      {groceryEntries.length > 0 && (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:12, color:"#888" }}>Shopping progress</span>
            <span style={{ fontSize:12, fontWeight:700,
              color:remaining===0?"#4ade80":"#dbd7cf" }}>
              {groceryEntries.length - remaining}/{groceryEntries.length} grabbed
            </span>
          </div>
          <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:99, background:"#4ade80", transition:"width 0.3s",
              width:`${((groceryEntries.length - remaining) / groceryEntries.length) * 100}%` }}/>
          </div>
        </div>
      )}

      {/* Grocery list */}
      {groceryEntries.length === 0 ? (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, padding:"30px 20px", textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>🛒</div>
          <div style={{ fontSize:14, color:"#555" }}>No groceries needed</div>
          <div style={{ fontSize:11, color:"#444", marginTop:4 }}>
            Plan some meals for {shopDay === "WED" ? "Wed–Sat" : "Sun–Tue"} in the Assign tab
          </div>
        </div>
      ) : (
        <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, overflow:"hidden", marginBottom:20 }}>
          <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#4ade80",
              textTransform:"uppercase" }}>🥩 Groceries</div>
          </div>
          {groceryEntries.map(([key, data], i) => {
            const display = GROCERY_DISPLAY[key];
            if (!display) return null;
            const checked = !!checkedItems[key];
            let amountStr = "";
            if (data.isCount) {
              amountStr = `${data.total} ${data.total === 1 ? "pc" : "pcs"}`;
            } else {
              amountStr = `${Math.round(data.total)}g`;
              if (display.showLbs) amountStr += ` (${gToLbs(data.total)} lbs)`;
            }
            return (
              <div key={key} onClick={() => toggleCheck(key)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
                  borderBottom:i<groceryEntries.length-1?"1px solid rgba(255,255,255,0.04)":"none",
                  cursor:"pointer", background:checked?"rgba(74,222,128,0.04)":"transparent",
                  transition:"background 0.15s" }} className="row">
                <div style={{ width:20, height:20, borderRadius:6, flexShrink:0,
                  border:checked?"none":"2px solid rgba(255,255,255,0.15)",
                  background:checked?"#4ade80":"transparent",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#0d0d10" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:checked?"#555":"#dbd7cf",
                    textDecoration:checked?"line-through":"none" }}>{display.name}</div>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:checked?"#444":"#888", flexShrink:0 }}>
                  {amountStr}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Household par — Wednesday only */}
      {shopDay === "WED" && <HouseholdSection parStock={parStock}/>}
    </div>
  );
}

// ── Household section (Wednesday shop only) ───────────────
function HouseholdSection({ parStock }) {
  const belowPar = PAR_CATEGORIES.flatMap(cat =>
    cat.items
      .filter(item => parseInt(parStock?.[item.id] ?? item.par, 10) < item.par)
      .map(item => ({ ...item, catLabel:cat.label, stock:parseInt(parStock?.[item.id] ?? item.par, 10) }))
  );

  if (belowPar.length === 0) {
    return (
      <div style={{ background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.15)",
        borderRadius:14, padding:"16px 14px", marginBottom:20 }}>
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#4ade80",
          textTransform:"uppercase", marginBottom:6 }}>🏠 Household</div>
        <div style={{ fontSize:13, color:"#4ade80" }}>✓ All household items at par</div>
      </div>
    );
  }

  return (
    <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:14, overflow:"hidden", marginBottom:20 }}>
      <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#fb923c",
          textTransform:"uppercase" }}>🏠 Household — below par</div>
      </div>
      {belowPar.map((item, i) => (
        <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
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
  );
}

// ── Main FoodTab ──────────────────────────────────────────
export default function FoodTab({ mealPlan, onUpdateMealPlan, parStock, saving, saveError }) {
  const [tab, setTab] = useState("assign");

  const TABS = [
    { id:"assign",   label:"Assign"   },
    { id:"overview", label:"Overview" },
    { id:"shop",     label:"Shop"     },
  ];

  const totalMeals = DAYS_ORDER.reduce((s, d) => s + (mealPlan[d]||[]).length, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:4 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600 }}>Meal Plan</div>
        <div style={{ textAlign:"right" }}>
          {saving    && <div style={{ fontSize:11, color:"#555" }}>Saving…</div>}
          {saveError && <div style={{ fontSize:11, color:"#fb923c" }}>⚠️ Save failed</div>}
          {totalMeals > 0 && !saving && !saveError && (
            <div style={{ fontSize:11, color:"#555" }}>{totalMeals} meals this week</div>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:"flex", gap:5, marginBottom:20, marginTop:12 }}>
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex:1, padding:"9px", borderRadius:10, border:"none", cursor:"pointer",
            background:tab===id?"#ece9e3":"rgba(255,255,255,0.06)",
            color:tab===id?"#0d0d10":"#777",
            fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500 }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "assign"   && <AssignTab   mealPlan={mealPlan} onUpdate={onUpdateMealPlan}/>}
      {tab === "overview" && <OverviewTab mealPlan={mealPlan}/>}
      {tab === "shop"     && <ShopTab     mealPlan={mealPlan} parStock={parStock}/>}
    </div>
  );
}
