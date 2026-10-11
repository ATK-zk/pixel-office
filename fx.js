'use strict';
// ===== v11 "masterpiece" layer: Bangkok-time sky, live trading wall, office cat, dust, screen glow, vignette =====
function bkkHour(){try{const s=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());const[h,m]=s.split(':').map(Number);return (h%24)+m/60}catch(e){const d=new Date();return d.getHours()+d.getMinutes()/60}}
hourNow=bkkHour;
const lerpC=(a,b,t)=>{const p=s=>[1,3,5].map(i=>parseInt(s.substr(i,2),16));const A=p(a),B=p(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'};
// sky keyframes by hour: [hour, top, bottom]
const SKY=[[0,'#070a22','#1a1d48'],[4.5,'#0b1030','#2a2456'],[5.8,'#3a3a7a','#ff9a6a'],[7,'#6ab0f0','#ffe0b0'],[10,'#3d9cf2','#bfe6ff'],[15,'#4aa4f4','#d4efff'],[17.3,'#5a78c8','#ffc08a'],[18.4,'#3a2f6e','#ff7a5a'],[19.4,'#141a46','#4a3070'],[24,'#070a22','#1a1d48']];
function skyAt(h){for(let i=0;i<SKY.length-1;i++){const a=SKY[i],b=SKY[i+1];if(h>=a[0]&&h<=b[0]){const t=(h-a[0])/(b[0]-a[0]);return[lerpC(a[1],b[1],t),lerpC(a[2],b[2],t)]}}return['#070a22','#1a1d48']}
const STARS=Array.from({length:60},()=>[Math.random(),Math.random()*.7,Math.random()*6.28]);
drawSky=function(g){const h=hourNow(),n=nightK,[top,bot]=skyAt(h);
  for(const[x,y,w,hh]of WINS){g.save();g.beginPath();g.rect(x,y,w,hh);g.clip();
    const gr=g.createLinearGradient(0,y,0,y+hh);gr.addColorStop(0,top);gr.addColorStop(1,bot);g.fillStyle=gr;g.fillRect(x,y,w,hh);
    if(n>.3)for(const[sx,sy,ph]of STARS){g.globalAlpha=n*(.35+.65*Math.abs(Math.sin(time*1.3+ph)));P(g,x+sx*w,y+sy*hh,sx>.9?'#ffe8c0':'#fff')}g.globalAlpha=1;
    // sun / moon arc
    const day=h>=5.5&&h<18.8,ang=day?(h-5.5)/13.3:((h<5.5?h+24:h)-18.8)/10.7;const cx=x+ang*w,cy=y+hh-6-Math.sin(ang*Math.PI)*(hh-12);
    const glow=g.createRadialGradient(cx,cy,0,cx,cy,18);glow.addColorStop(0,day?'rgba(255,240,180,.8)':'rgba(220,230,255,.5)');glow.addColorStop(1,'rgba(255,240,180,0)');g.fillStyle=glow;g.fillRect(cx-18,cy-18,36,36);
    if(day){ell(g,cx,cy,5,5,h>17||h<7?'#ffb060':'#fff2a8');ell(g,cx-1,cy-1,3,3,'#fffbe0')}else{ell(g,cx,cy,5,5,'#eef0ff');P(g,cx-2,cy,'#c8cce0');P(g,cx+1,cy+2,'#c8cce0')}
    // parallax clouds tinted by sky
    for(let i=0;i<4;i++){const sp=2+i*1.3,cx2=x+((time*sp+i*70)%(w+70))-35,cy2=y+5+i*6;g.globalAlpha=n>.6?.18:.85-i*.1;const cc=n>.6?'#8a90c0':h>17||h<7?'#ffd2b0':'#ffffff';ell(g,cx2,cy2,10,3,cc);ell(g,cx2+7,cy2-2,6,3,cc);ell(g,cx2-6,cy2+1,5,2,cc)}g.globalAlpha=1;
    // plane with blinking light
    const px=x+((time*9)%(w+40))-20,py=y+10;R(g,px,py,5,1,n>.5?'#556':'#eef');if(Math.floor(time*2)%2)P(g,px+5,py,'#ff4a4a');
    g.drawImage((Math.floor(time*.7)%2&&n>.3)?city2:city,x,y+hh-60);
    if(n<.5){g.fillStyle=`rgba(200,230,255,${.22*(1-n*2)})`;g.fillRect(x,y,w,hh)}
    for(let i=0;i<4;i++){const cx3=x+((time*(16+i*6)+i*60)%(w+20))-10;R(g,cx3,y+hh-3,4,2,n>.5?'#ffe08a':['#e84a4a','#3a7be0','#ffcf3a','#f0f0f0'][i]);if(n>.5)R(g,cx3+4,y+hh-3,3,1,'rgba(255,230,140,.5)')}
    // glass reflection sweep
    g.globalAlpha=.08;g.fillStyle='#fff';const rx=x+((time*14)%(w+80))-40;g.beginPath();g.moveTo(rx,y);g.lineTo(rx+10,y);g.lineTo(rx-10,y+hh);g.lineTo(rx-20,y+hh);g.fill();g.globalAlpha=1;
    g.restore()}
  g.drawImage(frames,0,0)};
// live trading wall (candles + volume + order flow) on the wall TV
const CANDLES=[];let cP=100,cT=0;for(let i=0;i<22;i++)pushCandle();
function pushCandle(){const o=cP,c=o+(Math.random()-.48)*3,hi=Math.max(o,c)+Math.random()*1.5,lo=Math.min(o,c)-Math.random()*1.5;cP=c;CANDLES.push({o,c,hi,lo,v:Math.random()});if(CANDLES.length>22)CANDLES.shift()}
const _ds=drawScreens;drawScreens=function(g){_ds(g);cT+=1/60;if(cT>1.6){cT=0;pushCandle()}
  const X=474,Y=14,Wd=88,Hd=30;R(g,X,Y,Wd,Hd,'#07101e');for(let gx=X;gx<X+Wd;gx+=11)R(g,gx,Y,1,Hd,'#0e1c30');for(let gy=Y+5;gy<Y+Hd;gy+=6)R(g,X,gy,Wd,1,'#0e1c30');
  const last=CANDLES[CANDLES.length-1];const live={...last,c:last.c+Math.sin(time*3)*.6};live.hi=Math.max(live.hi,live.c);live.lo=Math.min(live.lo,live.c);
  const arr=CANDLES.slice(0,-1).concat([live]);let mn=1e9,mx=-1e9;for(const k of arr){mn=Math.min(mn,k.lo);mx=Math.max(mx,k.hi)}const sy=v=>Y+2+(1-(v-mn)/(mx-mn||1))*(Hd-9);
  arr.forEach((k,i)=>{const cx=X+3+i*4,up=k.c>=k.o,col=up?'#3fe07a':'#ff5a6a';R(g,cx+1,sy(k.hi),1,sy(k.lo)-sy(k.hi)+1,col);const a=sy(Math.max(k.o,k.c)),b2=sy(Math.min(k.o,k.c));R(g,cx,a,3,Math.max(1,b2-a),col);R(g,cx,Y+Hd-1-k.v*5,3,k.v*5,up?'#1f6a40':'#6a2a34')});
  const ly=sy(live.c);for(let x=X;x<X+Wd;x+=3)P(g,x,ly,'#ffcf4a');R(g,X+Wd-8,ly-1,8,3,'#ffcf4a');
  // screen sheen
  g.fillStyle='rgba(120,180,255,.06)';g.fillRect(X,Y,Wd,8)};
// ===== office cat (depth-sorted via PROPS) =====
const CAT={x:300,y:330,tx:300,ty:330,t:0,f:0,dir:1,sleep:0};
function catFrame(f,dir,sleep){const[c,g]=mk(18,14);const B='#e8a050',D='#b86a2a',L='#ffd7a0';
  if(sleep){ell(g,9,9,7,4,B);ell(g,9,8,5,2,L);R(g,3,7,4,4,B);P(g,3,6,D);P(g,6,6,D);R(g,12,11,5,1,D)}
  else{R(g,4,5,9,5,B);R(g,4,5,9,1,L);for(let i=6;i<12;i+=3)R(g,i,5,1,4,D);R(g,12,2,5,5,B);P(g,12,1,D);P(g,16,1,D);P(g,14,4,'#203018');P(g,16,4,'#203018');P(g,15,6,'#ff8a9a');
    const a=f%2;R(g,5,10,1,3-a,D);R(g,7,10,1,2+a,B);R(g,10,10,1,3-a,D);R(g,12,10,1,2+a,B);R(g,1,3+Math.round(Math.sin(time*4)),3,1,B);R(g,3,4,1,2,B)}
  outline(c);if(dir<0){const[c2,g2]=mk(18,14);g2.translate(18,0);g2.scale(-1,1);g2.drawImage(c,0,0);return c2}return c}
const CATSPR={};function catSpr(f,d,s){const k=f+'_'+d+'_'+s;return CATSPR[k]||(CATSPR[k]=catFrame(f,d,s))}
const catProp={x:CAT.x,y:CAT.y,c:catSpr(0,1,0),ox:9,oy:13};PROPS.push(catProp);
const CAT_SPOTS=[[300,330],[470,330],[700,440],[250,520],[520,520],[620,320],[390,300],[90,300]];
function updCat(dt){CAT.t-=dt;if(CAT.sleep){if(CAT.t<0){CAT.sleep=0;CAT.t=0}}
  else{const dx=CAT.tx-CAT.x,dy=CAT.ty-CAT.y,d=Math.hypot(dx,dy);if(d>1){const sp=22*dt;CAT.x+=dx/d*Math.min(sp,d);CAT.y+=dy/d*Math.min(sp,d);CAT.dir=dx<0?-1:1;CAT.f=Math.floor(time*8)%2}
    else if(CAT.t<0){if(Math.random()<.35){CAT.sleep=1;CAT.t=8+Math.random()*10}else{const s=CAT_SPOTS[Math.floor(Math.random()*CAT_SPOTS.length)];CAT.tx=s[0];CAT.ty=s[1];CAT.t=3+Math.random()*4}}}
  catProp.x=Math.round(CAT.x);catProp.y=Math.round(CAT.y);catProp.c=catSpr(CAT.f,CAT.dir,CAT.sleep)}
// ===== dust kicks, screen-glow, vignette =====
const dust=[];const [vig,vg2]=mk(W,H);{const gr=vg2.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.7);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(10,4,20,.45)');vg2.fillStyle=gr;vg2.fillRect(0,0,W,H)}
const GLOWCOL={David:'140,200,255',Kim:'120,230,255',Jane:'140,255,180',Alex:'255,200,130',Jhon:'255,150,150',Su:'200,170,255'};
const _dw=drawWorld;drawWorld=function(){const dt=1/60;updCat(dt);
  for(const bt of bots)if(bt.state=='walk'&&!bt.hidden&&Math.random()<.18)dust.push({x:bt.x+(Math.random()-.5)*6,y:bt.y,t:0});
  _dw();const g=wx;
  for(let i=dust.length-1;i>=0;i--){const d=dust[i];d.t+=dt;d.y-=dt*4;if(d.t>.6){dust.splice(i,1);continue}g.globalAlpha=(1-d.t/.6)*.5;R(g,d.x,d.y,1+(d.t>.3),1,'#e8d8b8')}g.globalAlpha=1;
  g.globalCompositeOperation='lighter';
  for(const bt of bots){if(bt.hidden||bt.state!='work')continue;const fl=.18+.07*Math.sin(time*7+bt.x)+(Math.random()<.03?.1:0);const gr=g.createRadialGradient(bt.x,bt.y-26,0,bt.x,bt.y-26,22);gr.addColorStop(0,`rgba(${GLOWCOL[bt.n]},${fl*(.6+nightK)})`);gr.addColorStop(1,`rgba(${GLOWCOL[bt.n]},0)`);g.fillStyle=gr;g.fillRect(bt.x-22,bt.y-48,44,44)}
  // pulsing TV glow onto wall
  const tg=g.createRadialGradient(518,40,0,518,40,70);tg.addColorStop(0,`rgba(90,170,255,${.08+.04*Math.sin(time*2)+nightK*.12})`);tg.addColorStop(1,'rgba(90,170,255,0)');g.fillStyle=tg;g.fillRect(448,0,140,110);
  g.globalCompositeOperation='source-over';g.drawImage(vig,0,0)};
