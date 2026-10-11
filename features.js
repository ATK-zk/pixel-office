'use strict';
// ===== v19 team dashboard features =====
let ST={};const num=v=>(v==null||v===''||!isFinite(+v))?null:+v;const pick2=(...a)=>{for(const v of a){const n=num(v);if(n!=null)return n}return null};
const fmt$=v=>'$'+Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
document.body.insertAdjacentHTML('beforeend',`
<div id="pbar"><div class="pb1"><span class="pl">💰 พอร์ต</span><b id="pbv">—</b><span id="pbc">—</span></div>
<div class="pb2"><span class="lbl">ขาดทุนวันนี้</span><div class="meter"><i id="lossf"></i></div><span id="losst">—</span>
<span class="lbl">Vol</span><div class="meter v"><i id="volf"></i></div><span id="volt">—</span><span id="dots"></span></div></div>

<div id="halt" class="hidden">⛔ STOP TRADING — หยุดเทรดตามกฎความเสี่ยง</div>
<div id="flash"></div>
<div id="info" class="panel hidden"><button id="infox">✕</button><div id="infob"></div></div>`);
$('board').style.display='none';
$('infox').onclick=()=>$('info').classList.add('hidden');
// ---- sparkline history ----
try{localStorage.removeItem('po_hist')}catch(e){}
function addHist(v){const t=Date.now(),l=HIST[HIST.length-1];if(!l||l[1]!==v||t-l[0]>6e5){HIST.push([t,v]);if(HIST.length>200)HIST.shift();try{localStorage.setItem('po_hist',JSON.stringify(HIST))}catch(e){}}}
function drawSpark(){const c=$('spark'),g=c.getContext('2d');g.clearRect(0,0,90,22);if(HIST.length<2){g.fillStyle='#ffffff';g.font='bold 13px system-ui,sans-serif';g.textAlign='right';g.fillText('รอข้อมูล…',88,16);g.textAlign='left';return}
  let mn=1e9,mx=-1e9;for(const[,v]of HIST){mn=Math.min(mn,v);mx=Math.max(mx,v)}if(mx-mn<.01){mx+=.5;mn-=.5}const up=HIST[HIST.length-1][1]>=HIST[0][1];
  g.strokeStyle=up?'#5dff9a':'#ff6a6a';g.lineWidth=1.5;g.beginPath();HIST.forEach(([,v],i)=>{const x=1+i/(HIST.length-1)*88,y=20-(v-mn)/(mx-mn)*18;i?g.lineTo(x,y):g.moveTo(x,y)});g.stroke()}
// ---- derived state ----
function riskOf(s){const r=s.risk||{},st=s.stats||{};return{lev:pick2(r.leverage_used,r.leverage),levMax:pick2(r.max_leverage,r.max)||10,open:pick2(r.open_positions,r.open_trades)||0,openMax:pick2(r.max_positions)||3,
  loss:pick2(r.daily_loss_usd,r.daily_loss)??Math.max(0,-(num(st.pnl)||0)),limit:pick2((r.mm_effective_limits||{}).comb_daily,(s.stats||{}).daily_loss_limit,(r.mm_effective_limits||{}).daily,st.daily_loss_limit,r.daily_loss_limit_usd,r.limit)||25.8,halted:!!r.trading_halted,consec:pick2(r.consec_stops,st.consec_stops)||0}}
function lightState(s){const R=riskOf(s);if(R.halted)return'red';const st=(Array.isArray(s.plan)?s.plan:[]).map(p=>String(p.status||'').toLowerCase());if(st.some(x=>x=='open'||x=='filled'||x=='active')||R.open>0)return'green';if(st.some(x=>x=='pending'||x=='placed'))return'yellow';return'off'}
// ---- render dashboard ----
let prevStats=null;
function render(){const s=ST,st=s.stats||{},R=riskOf(s);const v=num(s.portfolio),st0=num(s.portfolio_start)||v;
  if(v!=null){$('pbv').textContent=fmt$(v);const d=v-st0,p=st0?d/st0*100:0,sg=d>=0?'+':'−';$('pbc').textContent=`${d>=0?'▲':'▼'} ${sg}${fmt$(d)} (${sg}${Math.abs(p).toFixed(2)}%)`;$('pbc').className=d>=0?'up':'dn';}
  const lf=Math.min(1,R.loss/R.limit);$('lossf').style.width=(lf*100)+'%';$('lossf').style.background=lf>.7?'#ff4a4a':lf>.4?'#ffb347':'#5dd38a';$('losst').textContent=`$${R.loss.toFixed(2)}/$${R.limit.toFixed(2)}`;
  const vol=num(st.volume)||0,goal=Math.max(10000,Math.ceil(vol/10000)*10000);$('volf').style.width=Math.min(100,vol/goal*100)+'%';$('volt').textContent='$'+(vol>=1000?(vol/1000).toFixed(1)+'k':vol.toFixed(0));
  const w=num(st.wins)||0,l=num(st.losses)||0,list=Array.isArray(st.results)?st.results:null;let dh='';const seq=list?list.map(x=>/w|win|1|true/i.test(String(x))?'w':'l'):[...Array(w).fill('w'),...Array(l).fill('l')];
  for(const k of seq.slice(-16))dh+=`<i class="${k}"></i>`;$('dots').innerHTML=dh;
  $('halt').classList.toggle('hidden',!R.halted);document.body.classList.toggle('halted',R.halted);
  // win/stop detection
  if(prevStats){if((num(st.wins)||0)>(num(prevStats.wins)||0))celebrate();if((num(st.losses)||0)>(num(prevStats.losses)||0)||(num(st.consec_stops)||0)>(num(prevStats.consec_stops)||0))stopFlash()}prevStats=st;
  for(const n in bubs)bubs[n].dataset.t='🕒 '+(s.updated||'—')}

function liveNorm(s){try{const L=s.live||{},lim=L.limits||{};
 const av=pick2(L.account_value);if(av!=null){s.portfolio=av;if(L.heartbeat)s.portfolio_updated=String(L.heartbeat).replace('T',' ').slice(0,16)}
 const b0=pick2(L.base);if(b0!=null)s.portfolio_start=b0;
 const dp=pick2(L.day_pnl_usd)??0,lim$=(pick2(lim.daily_loss_pct)??0.06)*(b0||av||0);
 s.risk={daily_loss_usd:Math.max(0,-dp),mm_effective_limits:{comb_daily:lim$},trading_halted:!!(L.halted||L.stopped)};
 s.stats={volume:pick2(L.volume_today_usd,L.day_volume_usd)??0,pnl:dp,daily_loss_limit:lim$,updated:L.heartbeat};
 }catch(e){}return s}
async function poll2(){try{const r=await fetch('status.json?f='+Date.now(),{cache:'no-store'});if(!r.ok)return;ST=liveNorm(await r.json());render();tick()}catch(e){}}
poll2();setInterval(poll2,8000);
// ---- ticker ----
function evTime(e){if(!e)return null;const t=e.time||e.at||e.when||e.datetime||(typeof e=='string'?(e.match(/\d{4}-\d\d-\d\d[T ]\d\d:\d\d(:\d\d)?([+-]\d\d:?\d\d|Z)?/)||[])[0]:null);if(!t)return null;const u=String(t).trim().replace(' ','T');let d=new Date(/(Z|[+-]\d\d:?\d\d)$/.test(u)?u:u+'+07:00');return isNaN(d)?null:d}
function tick(){if(!$('tkin'))return;const s=ST;let parts=[];if(s.headline)parts.push('📰 '+(typeof s.headline=='string'?s.headline:(s.headline.text||s.headline.title||'')));
  let warn=false;const evs=(Array.isArray(s.next_event)?s.next_event:s.next_event?[s.next_event]:[]).map(e=>({e,d:evTime(e),name:typeof e=='string'?e:(e.name||e.title||e.event||'เหตุการณ์')})).filter(x=>!x.d||x.d>Date.now()-36e5).sort((a,b)=>(a.d||1e15)-(b.d||1e15));
  const cdT=d=>{if(!d)return'';const ms=d-Date.now();if(ms<=0)return' · กำลังเกิดขึ้น';const m=Math.floor(ms/6e4),h=Math.floor(m/60),D=Math.floor(h/24);return ' · อีก '+(D?D+' วัน ':'')+(h%24?h%24+' ชม. ':'')+(m%60)+' นาที'};
  if(evs.length){const n=evs[0];warn=n.d&&n.d-Date.now()<9e5&&n.d>Date.now();parts.push('⏰ '+n.name+cdT(n.d));const th=d=>d?d.toLocaleString('th-TH',{timeZone:'Asia/Bangkok',weekday:'short',hour:'2-digit',minute:'2-digit'}):'';for(const o of evs.slice(1))parts.push('🗓️ '+o.name+' '+th(o.d)+cdT(o.d))}
  if(!parts.length)parts.push('📰 ยังไม่มีข่าวใหม่ · ทีมโฟกัส Polymarket Perps');const t=parts.join('   •   ');if($('tkin').textContent!==t){$('tkin').textContent=t}$('ticker').classList.toggle('warn',!!warn)}
setInterval(tick,28000);
// ---- bubbles tap to expand ----
$('bubbles').style.pointerEvents='none';for(const n in bubs){bubs[n].style.pointerEvents='auto';bubs[n].addEventListener('click',e=>{e.stopPropagation();$('info').classList.add('hidden');showCard(n);const o=bubs[n].classList.toggle('open');bubs[n]._w=0;for(const m in bubs)if(m!=n)bubs[m].classList.remove('open');blip(o?820:520);setTimeout(()=>{bubs[n]._w=bubs[n].offsetWidth;bubs[n]._hh=bubs[n].offsetHeight},0)})}
const _pd=placeDom;placeDom=function(){for(const n in bubs){const B=bubs[n];if(B.classList.contains('open')&&B._ow!==B.offsetWidth){B._w=B._ow=B.offsetWidth;B._hh=B.offsetHeight}}_pd();for(const n in bubs)if(bubs[n].classList.contains('open'))bubs[n].style.zIndex=9999};
// ---- status lights, confetti, BTC chart ----
const confetti=[];function celebrate(){for(let i=0;i<70;i++)confetti.push({x:300+Math.random()*200,y:120+Math.random()*60,vx:(Math.random()-.5)*120,vy:-60-Math.random()*90,t:0,c:['#ffd04a','#5dff9a','#4ac8ff','#ff7ab8','#fff'][i%5]});for(const bt of bots)emote(bt,'♪');toastMsg('🎉 ปิดไม้กำไร!');AUD.chime&&AUD.chime()}
function stopFlash(){const f=$('flash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');for(const bt of bots)emote(bt,'!');toastMsg('🛑 โดน stop-loss')}
// decorative fake candle chart (no network)
const FK=[];let fkP=100;function fkPush(){const o=fkP,c=o+(Math.random()-.48)*3,h=Math.max(o,c)+Math.random()*1.4,l=Math.min(o,c)-Math.random()*1.4;fkP=c;FK.push({o,c,h,l});if(FK.length>26)FK.shift()}for(let i=0;i<26;i++)fkPush();setInterval(fkPush,1800);
const _ds19=drawScreens;drawScreens=function(g){_ds19(g);const[X,Y,Wd,Hd]=TVR,x0=X+3,y0=Y+3,w=Wd-6,h=Hd-6;R(g,x0,y0,w,h,'#07101e');for(let gx=x0;gx<x0+w;gx+=12)R(g,gx,y0,1,h,'#0e1c30');for(let gy=y0+6;gy<y0+h;gy+=8)R(g,x0,gy,w,1,'#0e1c30');
  const last=FK[FK.length-1],live={...last,c:last.c+Math.sin(time*3)*.5};live.h=Math.max(live.h,live.c);live.l=Math.min(live.l,live.c);const arr=FK.slice(0,-1).concat([live]);
  let mn=1e9,mx=-1e9;for(const k of arr){mn=Math.min(mn,k.l);mx=Math.max(mx,k.h)}const sy=v=>y0+2+(1-(v-mn)/(mx-mn||1))*(h-4);const cw=w/arr.length;
  arr.forEach((k,i)=>{const cx=x0+i*cw,up=k.c>=k.o,col=up?'#3fe07a':'#ff5a6a';R(g,cx+cw/2,sy(k.h),1,sy(k.l)-sy(k.h)+1,col);const a=sy(Math.max(k.o,k.c));R(g,cx+1,a,Math.max(1,cw-2),Math.max(1,sy(Math.min(k.o,k.c))-a),col)});
  g.fillStyle='rgba(120,180,255,.06)';g.fillRect(x0,y0,w,6)};
const _dw19=drawWorld;drawWorld=function(){_dw19();const g=wx,ls=lightState(ST),col={red:'#ff3a3a',green:'#3fe07a',yellow:'#ffd23a',off:'#7a8090'}[ls];
  if(false)for(const bt of bots){if(bt.hidden)continue;const x=Math.round(bt.x+14),y=Math.round(bt.y-34);const gr=g.createRadialGradient(x,y,0,x,y,16);gr.addColorStop(0,col);gr.addColorStop(1,col+'00');g.globalAlpha=.55+.3*Math.sin(time*4);g.fillStyle=gr;g.fillRect(x-16,y-16,32,32);g.globalAlpha=1;ell(g,x,y,6,6,OL);ell(g,x,y,5,5,col);R(g,x-2,y-3,2,2,"#fff")}
  for(let i=confetti.length-1;i>=0;i--){const c=confetti[i];c.t+=1/60;c.vy+=140/60;c.x+=c.vx/60;c.y+=c.vy/60;if(c.t>2.5){confetti.splice(i,1);continue}R(g,c.x,c.y,2,2,c.c)}};
// ---- halted: everyone to the coffee area ----
const COFFEE=[{x:44,y:110,ex:44},{x:120,y:158,ex:120},{x:96,y:240,ex:96},{x:60,y:250,ex:60},{x:140,y:250,ex:140},{x:150,y:200,ex:150}];
setInterval(()=>{const H=riskOf(ST).halted;bots.forEach((bt,i)=>{if(bt.hidden||bt.wcIn)return;
  if(H&&!bt.haltGo&&(bt.state=='work'||bt.state=='idle')){const sp=COFFEE[i%COFFEE.length];const from=bt.goal?{ex:bt.goal.ex,y:bt.goal.y}:{x:bt.x,y:bt.y,ex:SEAT[bt.n].ex};route(bt,from,sp);bt.path.unshift({x:bt.x,y:bt.y});bt.goal=Object.assign({dir:0,pose:'sip',say:'☕ พักเทรด (STOP)'},sp);bt.state='walk';bt.say=bt.goal.say;bt.haltGo=1}
  if(H&&bt.haltGo&&bt.state=='idle')bt.t=30;
  if(!H&&bt.haltGo){bt.haltGo=0;if(bt.state=='idle')bt.t=0}})},1500);
// ---- desk taps: Alex plan / Su stats / Jhon risk ----
const DESK={Jane:[512,216,582,264],Alex:[222,366,292,414],Su:[502,366,572,414],Jhon:[362,366,432,414]};
function info(html){hideCard();$('infob').innerHTML=html;$('info').classList.remove('hidden');blip(760)}
const esc2=s=>esc(s==null?'—':s);
const TH={pending:'รอจับคู่',open:'ถือไม้อยู่',wait_market_open:'รอตลาดเปิด',idea:'ไอเดีย',closed:'ปิดแล้ว',approved_wait_start:'อนุมัติแล้ว รอเปิดบอท',running:'บอทกำลังรัน',paused:'บอทหยุดชั่วคราว'};
const _showCard=showCard;showCard=function(n){$('card').removeAttribute('aria-hidden');$('card').style.display='';_showCard(n)};
hideCard=function(){cardFor=null;const c=$('card');c.classList.add('hidden');c.setAttribute('aria-hidden','true');c.style.display='none';for(const id of['cname','crole','cstat','cact','ctime'])$(id).textContent=''};$('cardx').onclick=e=>{e.stopPropagation();hideCard()};
DESK.David=[340,140,432,194];DESK.Kim=[218,206,296,266];for(const n of['Jane','Alex','Su','Jhon'])DESK[n][1]-=12;
hit=function(sx,sy){const w=toWorld(sx,sy);let best=null,bd=1e9;for(const bt of bots){if(bt.hidden)continue;const dx=w.x-bt.x,dy=w.y-bt.y;if(Math.abs(dx)<20&&dy>-46&&dy<8){const d=dx*dx+(dy+18)*(dy+18);if(d<bd){bd=d;best=bt}}}
  $('info').classList.add('hidden');if(best){showCard(best.n);emote(best,'♪');blip(880);return}
  for(const[n,[a,b2,c,d]]of Object.entries(DESK))if(w.x>=a-6&&w.x<=c+6&&w.y>=b2-6&&w.y<=d+6){hideCard();if(n=='Alex')return planCard();if(n=='Su')return statsCard();if(n=='Jhon')return riskCard();if(n=='Jane')return picksCard();showCard(n);blip(880);return}
  hideCard()};
// ---- phone framing: desks fill the screen ----
homeCam=function(){if(vw<600){const z=vw/430;return{z,x:400,y:250}}const x0=196,x1=604;const z=Math.min(vw/(x1-x0),(vh-170)/576);return{z,x:400,y:H/2}};
limits=function(){return{min:Math.min(vw/W,vh/H)*.7,max:7}};
const _cc19=clampC;clampC=function(c){_cc19(c);const hh=vh/2/c.z;if(hh*2>=H)c.y=H/2+Math.min(150/c.z,hh*2-H)/2;return c};
resize.done=0;resize();Object.assign(tcam,cam);

// ---- v32: no info cards; bubbles = what each agent is doing NOW (schedule + live data) ----
showCard=function(){};hideCard=function(){};planCard=statsCard=riskCard=picksCard=function(){};info=function(){};
try{$('card').style.display='none';$('info').classList.add('hidden')}catch(e){}
const SCHED={Kim:[['08:10','📰 สรุปข่าวรอบเช้า'],['20:10','📰 สรุปข่าวรอบค่ำ']],Jane:[['08:20','🎯 คัดสินทรัพย์รอบเช้า'],['20:20','🎯 คัดสินทรัพย์รอบค่ำ']],
 Alex:[['08:27','🧪 วางกลยุทธ์ + backtest'],['20:27','🧪 วางกลยุทธ์ + backtest']],Jhon:[['08:41','🛡️ ตรวจความเสี่ยงแผน'],['20:41','🛡️ ตรวจความเสี่ยงแผน']],
 David:[['08:43','📋 ปิดประชุม ส่งแผนให้บอท'],['20:43','📋 ปิดประชุม ส่งแผนให้บอท']],Su:[['23:00','📒 ทำรายงาน PnL']]};
function bkk(){const d=new Date(Date.now()+7*3600e3);return{m:d.getUTCHours()*60+d.getUTCMinutes(),day:d.toISOString().slice(0,10)}}
const hm=t=>{const[a,b]=t.split(':');return +a*60+ +b};
function nextOf(n,m){const l=SCHED[n].map(x=>x[0]);return l.find(t=>hm(t)>m)||l[0]}
function nowStatus(n){const s=ST||{},L=s.live||{},{m}=bkk();
 // explicit fresh status (<30 min) wins
 const ts=(s.status_times||{})[n]||s.updated;if(s[n]&&ts){const t=Date.parse(String(ts).includes('T')?ts:String(ts).replace(' ','T')+'+07:00');if(isFinite(t)&&Date.now()-t<30*60e3)return s[n]}
 for(const[t,txt]of SCHED[n]){const d=m-hm(t);if(d>=0&&d<15)return txt}
 const nx=nextOf(n,m);
 if(n=='David'){const pb=(L.playbook_active||[]).map(x=>String(x).replace('-USD','')),op=Object.keys(L.open||{}).map(x=>x.replace('-USD',''));
  if(L.halted||L.stopped)return '⛔ บอทหยุด: '+(L.halted||L.stopped);
  if(op.length)return '💹 บอทถือ '+op.join(', ')+' · PnL วันนี้ $'+(+L.day_pnl_usd||0).toFixed(2);
  if(pb.length){const g={};pb.forEach(x=>{const[a,b]=x.split(':');(g[b||'?']=g[b||'?']||[]).push(a)});return '🤖 บอทเทรดจริง: '+Object.entries(g).map(([k,v])=>k+' '+v.join('/')).join(' · ')}
  return '🤖 บอทรอแผนรอบ '+nx}
 if(n=='Jhon'){const dl=Math.max(0,-(+L.day_pnl_usd||0));return '🛡️ เฝ้าลิมิต ขาดทุนวันนี้ $'+dl.toFixed(2)}
 if(n=='Su')return '📒 รอรายงาน 23:00';
 if(n=='Kim')return '📰 ข่าวถัดไป '+nx;
 if(n=='Jane')return '🎯 คัดสินทรัพย์รอบ '+nx;
 if(n=='Alex')return '🧪 วางกลยุทธ์รอบ '+nx;
 return s[n]||'…'}
