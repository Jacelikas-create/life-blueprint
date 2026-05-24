import { useState } from "react";
import { RECIPES } from "../constants";
import { HouseholdShoppingList } from "./ParSystem";

function RecipeCard({ recipe, onAddToPrep, alreadyAdded }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:14, overflow:"hidden", marginBottom:12 }}>
      <div onClick={() => setOpen(o=>!o)}
        style={{ display:"flex", alignItems:"center", gap:12, padding:"14px",
          cursor:"pointer" }} className="row">
        <span style={{ fontSize:24, flexShrink:0 }}>{recipe.emoji}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:500, color:"#dbd7cf" }}>{recipe.name}</div>
          <div style={{ fontSize:10, color:"#555", marginTop:2 }}>
            {recipe.caloriesPerServing} cal · {recipe.proteinPerServing}g protein · {recipe.servings} servings · {recipe.prepMins} min
          </div>
        </div>
        <span style={{ color:"#555", fontSize:12, transform:open?"rotate(180deg)":"none",
          transition:"transform 0.2s", flexShrink:0 }}>▾</span>
      </div>

      {open && (
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"14px" }}>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, color:"#fb923c",
              textTransform:"uppercase", marginBottom:8 }}>Ingredients</div>
            {recipe.ingredients.map((ing, i) => (
              <div key={i} style={{ fontSize:12, color:"#888", padding:"3px 0",
                borderBottom:i<recipe.ingredients.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                • {ing}
              </div>
            ))}
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, color:"#4ade80",
              textTransform:"uppercase", marginBottom:8 }}>Steps</div>
            {recipe.steps.map((step, i) => (
              <div key={i} style={{ display:"flex", gap:8, fontSize:12, color:"#888",
                padding:"4px 0", lineHeight:1.5 }}>
                <span style={{ color:"#555", flexShrink:0 }}>{i+1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <button onClick={() => onAddToPrep(recipe)}
            style={{ width:"100%", padding:"10px", borderRadius:10, border:"none",
              background:alreadyAdded?"rgba(74,222,128,0.1)":"rgba(255,255,255,0.06)",
              color:alreadyAdded?"#4ade80":"#ece9e3",
              fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600,
              cursor:"pointer" }}>
            {alreadyAdded ? "✓ Added to this week's prep" : "Add to prep list"}
          </button>
        </div>
      )}
    </div>
  );
}

function PrepDaySection({ day, label, prepList, onToggle, onRemove }) {
  const dayRecipes = prepList.filter(item => item.prepDay === day);
  if (dayRecipes.length === 0) return null;
  const done = dayRecipes.filter(i=>i.done).length;
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#34d399",
          textTransform:"uppercase" }}>{label} Prep</div>
        <div style={{ fontSize:10, color:"#555" }}>{done}/{dayRecipes.length} done</div>
      </div>
      <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:14, overflow:"hidden" }}>
        {dayRecipes.map((item, idx) => (
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12,
            padding:"13px 14px",
            borderBottom:idx<dayRecipes.length-1?"1px solid rgba(255,255,255,0.045)":"none",
            background:item.done?"rgba(52,211,153,0.06)":"transparent" }}>
            <div onClick={() => onToggle(item.id)} className="chk"
              style={{ width:21, height:21, borderRadius:6, flexShrink:0,
                border:item.done?"none":"2px solid rgba(255,255,255,0.18)",
                background:item.done?"#34d399":"transparent",
                display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              {item.done&&<svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4.5L4 7.5L10 1" stroke="#0d0d10" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{ fontSize:20, flexShrink:0 }}>{item.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:item.done?"#555":"#dbd7cf",
                textDecoration:item.done?"line-through":"none" }}>{item.name}</div>
              <div style={{ fontSize:10, color:"#555", marginTop:1 }}>
                {item.caloriesPerServing} cal · {item.proteinPerServing}g protein · {item.servings} servings
              </div>
            </div>
            <button onClick={() => onRemove(item.id)}
              style={{ background:"none", border:"none", color:"#444",
                cursor:"pointer", fontSize:16, padding:"0 2px" }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MealPrepTab({ mealPrep, onUpdateMealPrep, parStock }) {
  const [tab, setTab] = useState("plan"); // "plan" | "recipes"
  const { prepList=[], week="" } = mealPrep;

  function addToPrep(recipe) {
    const alreadyAdded = prepList.some(i=>i.recipeId===recipe.id);
    if (alreadyAdded) return;
    const preferredDay = recipe.prepDay.includes("SUN") ? "SUN" : recipe.prepDay[0];
    const newItem = {
      id: `prep_${Date.now()}`,
      recipeId: recipe.id,
      name: recipe.name,
      emoji: recipe.emoji,
      prepDay: preferredDay,
      caloriesPerServing: recipe.caloriesPerServing,
      proteinPerServing: recipe.proteinPerServing,
      servings: recipe.servings,
      done: false,
    };
    onUpdateMealPrep({ prepList:[...prepList, newItem] });
  }

  function toggleItem(id) {
    onUpdateMealPrep({ prepList: prepList.map(i=>i.id===id?{...i,done:!i.done}:i) });
  }

  function removeItem(id) {
    onUpdateMealPrep({ prepList: prepList.filter(i=>i.id!==id) });
  }

  const sunItems = prepList.filter(i=>i.prepDay==="SUN");
  const wedItems = prepList.filter(i=>i.prepDay==="WED");

  return (
    <div style={{ padding:"18px 20px 0" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, marginBottom:4 }}>
        Meal Prep
      </div>
      <div style={{ fontSize:11, color:"#555", marginBottom:16 }}>
        Prep days: Sunday & Wednesday
      </div>

      {/* Tab toggle */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {[["plan","This Week's Plan"],["recipes","Recipe Library"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:"9px",
            borderRadius:10, border:"none", cursor:"pointer",
            background:tab===t?"#ece9e3":"rgba(255,255,255,0.06)",
            color:tab===t?"#0d0d10":"#777", fontFamily:"'DM Sans',sans-serif",
            fontSize:12, fontWeight:500 }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "plan" ? (
        <>
          {prepList.length === 0 ? (
            <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:14, padding:"30px 20px", textAlign:"center", marginBottom:16 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>🥦</div>
              <div style={{ fontSize:14, color:"#555", marginBottom:4 }}>No meals planned yet</div>
              <div style={{ fontSize:11, color:"#444" }}>
                Switch to Recipe Library and tap a recipe to add it
              </div>
            </div>
          ) : (
            <>
              <PrepDaySection day="SUN" label="Sunday" prepList={prepList} onToggle={toggleItem} onRemove={removeItem}/>
              <PrepDaySection day="WED" label="Wednesday" prepList={prepList} onToggle={toggleItem} onRemove={removeItem}/>
            </>
          )}

          {/* Household items below par */}
          <HouseholdShoppingList parStock={parStock||{}}/>

          {/* Recipe grocery summary */}
          {prepList.length > 0 && (
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:14, padding:"14px", marginBottom:20 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, color:"#fbbf24",
                textTransform:"uppercase", marginBottom:10 }}>Grocery list this week</div>
              {[...new Set(prepList.flatMap(i=>{
                const recipe=RECIPES.find(r=>r.id===i.recipeId);
                return recipe?recipe.ingredients:[];
              }))].map((ing,i)=>(
                <div key={i} style={{ fontSize:12, color:"#888", padding:"3px 0" }}>• {ing}</div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ fontSize:11, color:"#555", marginBottom:14 }}>
            Tap a recipe to see details and add it to your prep list
          </div>
          {RECIPES.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe}
              onAddToPrep={addToPrep}
              alreadyAdded={prepList.some(i=>i.recipeId===recipe.id)}/>
          ))}
        </>
      )}
    </div>
  );
}
