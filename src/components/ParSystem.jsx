import { useState } from "react";
import { PAR_CATEGORIES } from "../constants";

function ParItem({ item, stock, onIncrement, onDecrement }) {
  const isLow  = stock < item.par;
  const isGood = stock >= item.par;
  const statusColor = isLow ? "#fb923c" : "#4ade80";
  const statusLabel = isLow ? `Low — need ${item.par - stock} more` : "Stocked";

  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px",
      borderBottom:"1px solid rgba(255,255,255,0.045)",
      background: isLow ? "rgba(251,146,60,0.05)" : "transparent" }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:500, color:"#dbd7cf" }}>{item.name}</div>
        <div style={{ fontSize:10, marginTop:2, color:statusColor }}>{statusLabel}</div>
      </div>
      {/* Counter */}
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <div style={{ fontSize:10, color:"#555", textAlign:"right", minWidth:50 }}>
          par: {item.par} {item.unit}
        </div>
        <button onClick={onDecrement} style={{ width:28, height:28, borderRadius:7,
          background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
          color:"#ece9e3", cursor:"pointer", fontSize:16, display:"flex",
          alignItems:"center", justifyContent:"center", flexShrink:0 }}>−</button>
        <span style={{ fontSize:15, fontWeight:600, color:statusColor,
          minWidth:20, textAlign:"center" }}>{stock}</span>
        <button onClick={onIncrement} style={{ width:28, height:28, borderRadius:7,
          background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
          color:"#ece9e3", cursor:"pointer", fontSize:16, display:"flex",
          alignItems:"center", justifyContent:"center", flexShrink:0 }}>+</button>
      </div>
    </div>
  );
}

// ── Par Modal — full inventory check ─────────────────────
export function ParModal({ parStock, onUpdate, onClose }) {
  const [localStock, setLocalStock] = useState({ ...parStock });

  function increment(itemId, par) {
    setLocalStock(prev => ({ ...prev, [itemId]: (prev[itemId] ?? par) + 1 }));
  }
  function decrement(itemId, par) {
    setLocalStock(prev => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] ?? par) - 1) }));
  }
  function handleSave() {
    onUpdate(localStock);
    onClose();
  }

  // Count how many items are low
  const lowCount = PAR_CATEGORIES.flatMap(c => c.items)
    .filter(item => (localStock[item.id] ?? item.par) < item.par).length;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
      zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#18181d",
        borderRadius:"20px 20px 0 0", border:"1px solid rgba(255,255,255,0.08)",
        width:"100%", maxWidth:540, maxHeight:"88vh", overflowY:"auto",
        padding:"24px 20px 40px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#fb923c",
              textTransform:"uppercase", marginBottom:4 }}>Sunday · Household Check</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600 }}>
              Par Level Check
            </div>
            <div style={{ fontSize:11, color:"#555", marginTop:4 }}>
              Reserve stock only — not counting what's currently open
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"none",
            color:"#888", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>

        {/* Low items summary */}
        {lowCount > 0 && (
          <div style={{ background:"rgba(251,146,60,0.08)", border:"1px solid rgba(251,146,60,0.2)",
            borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ fontSize:12, color:"#fb923c", fontWeight:600 }}>
              ⚠️ {lowCount} item{lowCount>1?"s":""} below par — will be added to shopping list
            </div>
          </div>
        )}
        {lowCount === 0 && (
          <div style={{ background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)",
            borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ fontSize:12, color:"#4ade80", fontWeight:600 }}>
              ✓ All items stocked — you're good for the week!
            </div>
          </div>
        )}

        {/* Categories */}
        {PAR_CATEGORIES.map(cat => (
          <div key={cat.id} style={{ marginBottom:20 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#fb923c",
              textTransform:"uppercase", marginBottom:8 }}>
              {cat.icon} {cat.label}
            </div>
            <div style={{ background:"#0d0d10", border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:14, overflow:"hidden" }}>
              {cat.items.map((item, idx) => (
                <ParItem key={item.id} item={item}
                  stock={localStock[item.id] ?? item.par}
                  onIncrement={() => increment(item.id, item.par)}
                  onDecrement={() => decrement(item.id, item.par)}/>
              ))}
            </div>
          </div>
        ))}

        {/* Save */}
        <button onClick={handleSave} style={{ width:"100%", padding:"13px", borderRadius:12,
          border:"none", background:"#fb923c", color:"#0d0d10",
          fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>
          Save & update shopping list
        </button>
      </div>
    </div>
  );
}

// ── Household section for shopping list ──────────────────
export function HouseholdShoppingList({ parStock }) {
  const lowItems = PAR_CATEGORIES.flatMap(cat =>
    cat.items
      .filter(item => (parStock[item.id] ?? item.par) < item.par)
      .map(item => ({
        ...item,
        needed: item.par - (parStock[item.id] ?? item.par),
        catLabel: cat.label,
        catIcon: cat.icon,
      }))
  );

  if (lowItems.length === 0) return null;

  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:"#fb923c",
        textTransform:"uppercase", marginBottom:8 }}>🛒 Household — below par</div>
      <div style={{ background:"#17171d", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:14, overflow:"hidden" }}>
        {lowItems.map((item, idx) => (
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12,
            padding:"12px 14px",
            borderBottom:idx<lowItems.length-1?"1px solid rgba(255,255,255,0.045)":"none" }}>
            <span style={{ fontSize:13, flexShrink:0 }}>{item.catIcon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:"#dbd7cf" }}>{item.name}</div>
              <div style={{ fontSize:10, color:"#555", marginTop:1 }}>{item.catLabel}</div>
            </div>
            <div style={{ fontSize:12, color:"#fb923c", fontWeight:600, flexShrink:0 }}>
              +{item.needed} {item.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
