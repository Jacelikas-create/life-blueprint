import { useState } from "react";
import { PAR_CATEGORIES } from "../constants";

function ParCategorySection({ category, parStock, onUpdate }) {
  const [open, setOpen] = useState(true);

  const belowCount = category.items.filter(item => {
    const stock = parseInt(parStock[item.id] ?? item.par, 10);
    return stock < item.par;
  }).length;

  return (
    <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:14, overflow:"hidden", marginBottom:12 }}>

      {/* Category header */}
      <div onClick={() => setOpen(o => !o)}
        style={{ display:"flex", alignItems:"center", gap:10, padding:"14px",
          cursor:"pointer" }} className="row">
        <span style={{ fontSize:20, flexShrink:0 }}>{category.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:600, color:"#dbd7cf" }}>{category.label}</div>
          {belowCount > 0 && (
            <div style={{ fontSize:10, color:"#fb923c", marginTop:1 }}>
              {belowCount} item{belowCount !== 1 ? "s" : ""} below par
            </div>
          )}
          {belowCount === 0 && (
            <div style={{ fontSize:10, color:"#4ade80", marginTop:1 }}>All at par ✓</div>
          )}
        </div>
        <span style={{ color:"#555", fontSize:12, flexShrink:0,
          transform:open?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▾</span>
      </div>

      {open && (
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          {category.items.map((item, i) => {
            const stock    = parseInt(parStock[item.id] ?? item.par, 10);
            const atPar    = stock >= item.par;
            const pct      = Math.min((stock / item.par) * 100, 100);
            const barColor = atPar ? "#4ade80" : stock === 0 ? "#ef4444" : "#fb923c";

            return (
              <div key={item.id} style={{ padding:"12px 14px",
                borderBottom:i < category.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background:atPar?"transparent":"rgba(251,146,60,0.03)" }}>

                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:13, color:atPar?"#888":"#dbd7cf" }}>{item.name}</div>
                    <div style={{ fontSize:10, color:"#444", marginTop:1 }}>
                      Par: {item.par} {item.unit}
                    </div>
                  </div>

                  {/* Stepper */}
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <button
                      onClick={() => onUpdate(item.id, Math.max(0, stock - 1))}
                      style={{ width:28, height:28, borderRadius:8, border:"1px solid rgba(255,255,255,0.1)",
                        background:"rgba(255,255,255,0.05)", color:"#888", cursor:"pointer",
                        fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      −
                    </button>
                    <span style={{ fontSize:15, fontWeight:700, color:barColor, minWidth:24, textAlign:"center" }}>
                      {stock}
                    </span>
                    <button
                      onClick={() => onUpdate(item.id, Math.min(item.par * 2, stock + 1))}
                      style={{ width:28, height:28, borderRadius:8, border:"1px solid rgba(255,255,255,0.1)",
                        background:"rgba(255,255,255,0.05)", color:"#888", cursor:"pointer",
                        fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      ＋
                    </button>
                    {/* Quick fill to par */}
                    {!atPar && (
                      <button onClick={() => onUpdate(item.id, item.par)}
                        style={{ padding:"4px 8px", borderRadius:6, border:"none",
                          background:"rgba(74,222,128,0.12)", color:"#4ade80",
                          cursor:"pointer", fontSize:11, fontWeight:600,
                          fontFamily:"'DM Sans',sans-serif" }}>
                        Fill
                      </button>
                    )}
                  </div>
                </div>

                {/* Stock bar */}
                <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:barColor,
                    borderRadius:99, transition:"width 0.25s" }}/>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ParTab({ parStock, onUpdateParStock }) {
  // Overall stats
  const allItems   = PAR_CATEGORIES.flatMap(c => c.items);
  const belowPar   = allItems.filter(item => parseInt(parStock[item.id] ?? item.par, 10) < item.par);
  const atPar      = allItems.length - belowPar.length;
  const allGood    = belowPar.length === 0;

  function handleUpdate(itemId, newValue) {
    onUpdateParStock({ ...parStock, [itemId]: newValue });
  }

  function fillAll() {
    const patch = {};
    allItems.forEach(item => { patch[item.id] = item.par; });
    onUpdateParStock({ ...parStock, ...patch });
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:4 }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600 }}>Household Par</div>
          <div style={{ fontSize:11, color:"#555", marginTop:3 }}>
            {atPar}/{allItems.length} items at par
          </div>
        </div>
        {!allGood && (
          <button onClick={fillAll} style={{ padding:"7px 14px", borderRadius:8, border:"none",
            background:"rgba(74,222,128,0.12)", color:"#4ade80", cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, marginTop:4 }}>
            Fill all
          </button>
        )}
      </div>

      {/* Overall status bar */}
      <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:12, padding:"12px 14px", marginBottom:20, marginTop:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:11, color:"#555" }}>Overall stock level</span>
          <span style={{ fontSize:11, fontWeight:700, color:allGood?"#4ade80":"#fb923c" }}>
            {allGood ? "✓ Fully stocked" : `${belowPar.length} item${belowPar.length!==1?"s":""} low`}
          </span>
        </div>
        <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:99, transition:"width 0.3s",
            background:allGood?"#4ade80":"#fb923c",
            width:`${(atPar / allItems.length) * 100}%` }}/>
        </div>

        {/* Below par summary */}
        {belowPar.length > 0 && (
          <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:5 }}>
            {belowPar.map(item => (
              <span key={item.id} style={{ fontSize:11, color:"#fb923c",
                background:"rgba(251,146,60,0.1)", padding:"2px 8px", borderRadius:6 }}>
                {item.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      {PAR_CATEGORIES.map(cat => (
        <ParCategorySection
          key={cat.id}
          category={cat}
          parStock={parStock}
          onUpdate={handleUpdate}
        />
      ))}

      <div style={{ fontSize:11, color:"#333", textAlign:"center", padding:"8px 0 20px" }}>
        Tap Fill to restore an item to par · Check Wednesday shop list for what to buy
      </div>
    </div>
  );
}
