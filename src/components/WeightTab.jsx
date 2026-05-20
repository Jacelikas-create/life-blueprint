import { useState, useRef } from "react";
import { GOAL_WEIGHT } from "../constants";
import { linearRegression, formatDate, formatDateLong, daysBetween, addDays } from "../utils";

function DreamBodCounter({ daysLeft }) {
  if (daysLeft === null) return null;
  const isHit = daysLeft < 0;
  return (
    <div style={{ background:"linear-gradient(135deg,rgba(249,168,212,0.1),rgba(167,139,250,0.1))",
      border:"1px solid rgba(249,168,212,0.2)", borderRadius:16, padding:"20px",
      textAlign:"center", marginBottom:20 }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, color:"#f9a8d4",
        textTransform:"uppercase", marginBottom:8 }}>Days Until Dream Bod</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:52, fontWeight:600,
        color:isHit ? "#4ade80" : "#ece9e3", lineHeight:1, marginBottom:6 }}>
        {isHit ? "🎉" : Math.abs(daysLeft)}
      </div>
      {isHit ? (
        <div style={{ fontSize:13, color:"#4ade80" }}>You've hit your goal weight!</div>
      ) : (
        <div style={{ fontSize:12, color:"#888" }}>at your current trend · goal: {GOAL_WEIGHT} lbs</div>
      )}
    </div>
  );
}

function WeightChart({ entries, goalWeight }) {
  if (entries.length === 0) return null;
  const W=340, H=200, PAD={top:16,right:16,bottom:32,left:40};
  const chartW=W-PAD.left-PAD.right, chartH=H-PAD.top-PAD.bottom;
  const sorted=[...entries].sort((a,b)=>a.date.localeCompare(b.date));
  const startDate=sorted[0].date;
  const today=new Date().toISOString().slice(0,10);
  const points=sorted.map(e=>({x:daysBetween(startDate,e.date),y:e.weight,date:e.date}));
  const todayX=daysBetween(startDate,today);
  const proj6m=todayX+180;
  const reg=linearRegression(points);
  const allY=[...points.map(p=>p.y),goalWeight];
  if(reg){allY.push(reg.intercept+reg.slope*proj6m);}
  const minX=0,maxX=Math.max(proj6m,todayX+10);
  const minY=Math.min(...allY)-5,maxY=Math.max(...allY)+5;
  const toX=x=>PAD.left+((x-minX)/(maxX-minX))*chartW;
  const toY=y=>PAD.top+((maxY-y)/(maxY-minY))*chartH;
  let trendPath=null,projPath=null,proj1mY=null,proj3mY=null,proj6mY=null;
  if(reg){
    trendPath=`M ${toX(0)} ${toY(reg.intercept)} L ${toX(todayX)} ${toY(reg.intercept+reg.slope*todayX)}`;
    proj1mY=reg.intercept+reg.slope*(todayX+30);
    proj3mY=reg.intercept+reg.slope*(todayX+90);
    proj6mY=reg.intercept+reg.slope*proj6m;
    projPath=`M ${toX(todayX)} ${toY(reg.intercept+reg.slope*todayX)} L ${toX(proj6m)} ${toY(proj6mY)}`;
  }
  const goalY=toY(goalWeight);
  const yStep=Math.ceil((maxY-minY)/4/5)*5;
  const yTicks=[];
  for(let y=Math.ceil(minY/yStep)*yStep;y<=maxY;y+=yStep)yTicks.push(y);
  return (
    <div style={{overflowX:"auto",marginBottom:20}}>
      <svg width={W} height={H} style={{display:"block",margin:"0 auto"}}>
        {yTicks.map(y=><line key={y} x1={PAD.left} x2={W-PAD.right} y1={toY(y)} y2={toY(y)} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>)}
        <line x1={PAD.left} x2={W-PAD.right} y1={goalY} y2={goalY} stroke="#4ade80" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6}/>
        <text x={W-PAD.right-2} y={goalY-4} fontSize={9} fill="#4ade80" textAnchor="end" opacity={0.8}>{goalWeight} goal</text>
        {trendPath&&<path d={trendPath} stroke="#a78bfa" strokeWidth={2} fill="none" opacity={0.8}/>}
        {projPath&&<path d={projPath} stroke="#a78bfa" strokeWidth={1.5} fill="none" strokeDasharray="5 4" opacity={0.5}/>}
        {reg&&[{x:todayX+30,y:proj1mY,l:"+1mo"},{x:todayX+90,y:proj3mY,l:"+3mo"},{x:proj6m,y:proj6mY,l:"+6mo"}].map((p,i)=>(
          <g key={i}>
            <circle cx={toX(p.x)} cy={toY(p.y)} r={3} fill="#a78bfa" opacity={0.5}/>
            <text x={toX(p.x)} y={toY(p.y)-7} fontSize={8} fill="#a78bfa" textAnchor="middle" opacity={0.7}>{Math.round(p.y)}</text>
          </g>
        ))}
        {points.map((p,i)=><circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={4} fill="#f9a8d4" stroke="#0d0d10" strokeWidth={1.5}/>)}
        {yTicks.map(y=><text key={y} x={PAD.left-5} y={toY(y)+4} fontSize={9} fill="#555" textAnchor="end">{y}</text>)}
        {[{x:0,l:"Start"},{x:todayX,l:"Today"},{x:todayX+30,l:"+1mo"},{x:todayX+90,l:"+3mo"},{x:proj6m,l:"+6mo"}].map((l,i)=>(
          <text key={i} x={toX(l.x)} y={H-PAD.bottom+14} fontSize={8} fill="#555" textAnchor="middle">{l.l}</text>
        ))}
      </svg>
    </div>
  );
}

export default function WeightTab({ weightEntries, onAddEntry }) {
  const [inputWeight, setInputWeight] = useState("");
  const [inputDate,   setInputDate]   = useState(new Date().toISOString().slice(0,10));
  const [error,       setError]       = useState("");
  const sorted=[...weightEntries].sort((a,b)=>a.date.localeCompare(b.date));
  const startWeight=sorted.length>0?sorted[0].weight:null;
  const currentWeight=sorted.length>0?sorted[sorted.length-1].weight:null;
  const totalLost=startWeight&&currentWeight?(startWeight-currentWeight).toFixed(1):null;
  const today=new Date().toISOString().slice(0,10);
  const points=sorted.map(e=>({x:daysBetween(sorted[0]?.date||today,e.date),y:e.weight}));
  const reg=points.length>=2?linearRegression(points):null;
  const todayX=daysBetween(sorted[0]?.date||today,today);
  const proj1mY=reg?reg.intercept+reg.slope*(todayX+30):null;
  const proj3mY=reg?reg.intercept+reg.slope*(todayX+90):null;
  const proj6mY=reg?reg.intercept+reg.slope*(todayX+180):null;
  let daysUntilGoal=null;
  if(reg&&reg.slope<0&&currentWeight>GOAL_WEIGHT){
    daysUntilGoal=Math.round((GOAL_WEIGHT-reg.intercept)/reg.slope-todayX);
  } else if(currentWeight<=GOAL_WEIGHT){daysUntilGoal=-1;}

  function handleAdd(){
    const w=parseFloat(inputWeight);
    if(isNaN(w)||w<50||w>500){setError("Please enter a valid weight between 50–500 lbs");return;}
    setError("");
    onAddEntry({date:inputDate,weight:w});
    setInputWeight("");
  }

  return (
    <div style={{padding:"18px 20px 0"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,marginBottom:4}}>Weight Loss</div>
      <div style={{fontSize:11,color:"#555",marginBottom:20}}>Weigh in Mon · Wed · Sat — same time, before eating</div>
      <DreamBodCounter daysLeft={daysUntilGoal}/>
      {startWeight&&(
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          {[{l:"Start",v:`${startWeight} lbs`,c:"#888"},{l:"Current",v:`${currentWeight} lbs`,c:"#ece9e3"},
            {l:"Lost",v:totalLost>0?`−${totalLost} lbs`:`+${Math.abs(totalLost)} lbs`,c:totalLost>0?"#4ade80":"#fb923c"},
            {l:"Goal",v:`${GOAL_WEIGHT} lbs`,c:"#4ade80"}].map((s,i)=>(
            <div key={i} style={{flex:1,background:"#17171d",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"10px"}}>
              <div style={{fontSize:9,color:"#555",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{s.l}</div>
              <div style={{fontSize:13,fontWeight:600,color:s.c}}>{s.v}</div>
            </div>
          ))}
        </div>
      )}
      {weightEntries.length>0?(
        <WeightChart entries={weightEntries} goalWeight={GOAL_WEIGHT}/>
      ):(
        <div style={{background:"#17171d",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,
          padding:"30px 20px",textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:28,marginBottom:8}}>⚖️</div>
          <div style={{fontSize:14,color:"#555"}}>Log your first weight to get started</div>
        </div>
      )}
      {reg&&(
        <div style={{marginBottom:20}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:2.5,color:"#a78bfa",textTransform:"uppercase",marginBottom:10}}>
            Projections at current trend
          </div>
          <div style={{display:"flex",gap:8}}>
            {[{l:"+1 month",y:proj1mY,d:addDays(today,30)},{l:"+3 months",y:proj3mY,d:addDays(today,90)},{l:"+6 months",y:proj6mY,d:addDays(today,180)}].map((p,i)=>(
              <div key={i} style={{flex:1,background:"#17171d",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"#a78bfa",textTransform:"uppercase",marginBottom:6}}>{p.l}</div>
                <div style={{fontSize:18,fontWeight:600,color:"#ece9e3",marginBottom:2}}>{Math.round(p.y)} lbs</div>
                {startWeight&&<div style={{fontSize:10,color:"#4ade80"}}>−{(startWeight-p.y).toFixed(1)} lbs</div>}
                <div style={{fontSize:9,color:"#555",marginTop:3}}>{formatDate(p.d)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{background:"#17171d",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"16px",marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:600,color:"#888",marginBottom:12,textTransform:"uppercase",letterSpacing:1.5}}>Log a weigh-in</div>
        <div style={{display:"flex",gap:8,marginBottom:error?8:0}}>
          <input type="number" value={inputWeight} onChange={e=>setInputWeight(e.target.value)}
            placeholder="lbs" style={{flex:1,background:"#0d0d10",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:10,padding:"10px 14px",color:"#ece9e3",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
          <input type="date" value={inputDate} onChange={e=>setInputDate(e.target.value)}
            style={{flex:1,background:"#0d0d10",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:10,padding:"10px 14px",color:"#ece9e3",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
          <button onClick={handleAdd} style={{background:"#f9a8d4",color:"#0d0d10",border:"none",borderRadius:10,
            padding:"10px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0}}>Log</button>
        </div>
        {error&&<div style={{fontSize:11,color:"#fb923c",marginTop:6}}>{error}</div>}
      </div>
      {sorted.length>0&&(
        <div style={{marginBottom:20}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:2.5,color:"#888",textTransform:"uppercase",marginBottom:10}}>History</div>
          <div style={{background:"#17171d",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,overflow:"hidden"}}>
            {[...sorted].reverse().map((e,i,arr)=>(
              <div key={e.date} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"11px 14px",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.045)":"none"}}>
                <span style={{fontSize:13,color:"#888"}}>{formatDateLong(e.date)}</span>
                <span style={{fontSize:14,fontWeight:600,color:"#ece9e3"}}>{e.weight} lbs</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
