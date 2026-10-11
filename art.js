'use strict';
// ===== Pixel art toolkit + all hand-built sprites (procedural, original) =====
const T=16,W=768,H=480,AISLE=300;
const OL='#22152a';
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g]}
function R(g,x,y,w,h,c){if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(x|0,y|0,w|0,h|0)}
function P(g,x,y,c){g.fillStyle=c;g.fillRect(x|0,y|0,1,1)}
// shaded box: ramp=[dark,base,light,hi]
function box(g,x,y,w,h,r,ol=OL){R(g,x-1,y-1,w+2,h+2,ol);R(g,x,y,w,h,r[1]);R(g,x,y,w,1,r[2]);R(g,x,y,1,h,r[2]);R(g,x,y+h-1,w,1,r[0]);R(g,x+w-1,y,1,h,r[0]);if(r[3])P(g,x,y,r[3])}
function dith(g,x,y,w,h,c,ph=0){g.fillStyle=c;for(let j=0;j<h;j++)for(let i=(j+ph)%2;i<w;i+=2)g.fillRect(x+i,y+j,1,1)}
function ell(g,cx,cy,rx,ry,c){g.fillStyle=c;for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry))));g.fillRect(cx-w,cy+y,w*2,1)}}
function softShadow(g,cx,cy,rx,ry,a=.35){g.save();g.translate(cx,cy);g.scale(1,ry/rx);const gr=g.createRadialGradient(0,0,0,0,0,rx);gr.addColorStop(0,`rgba(20,10,20,${a})`);gr.addColorStop(.7,`rgba(20,10,20,${a*.6})`);gr.addColorStop(1,'rgba(20,10,20,0)');g.fillStyle=gr;g.fillRect(-rx,-rx,rx*2,rx*2);g.restore()}
function outline(c,col=OL){const g=c.getContext('2d'),w=c.width,h=c.height,d=g.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a);
  const [cr,cg,cb]=[1,3,5].map(i=>parseInt(col.substr(i,2),16));
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(a[i+3]>10)continue;if((x>0&&a[i-4+3]>10)||(x<w-1&&a[i+4+3]>10)||(y>0&&a[i-w*4+3]>10)||(y<h-1&&a[i+w*4+3]>10)){o[i]=cr;o[i+1]=cg;o[i+2]=cb;o[i+3]=255}}
  g.putImageData(new ImageData(o,w,h),0,0);return c}
let _s=11;const rnd=()=>((_s=(_s*16807)%2147483647)/2147483647);
const pick=a=>a[Math.floor(rnd()*a.length)];

// ===== palettes =====
const PAL={
 wood:['#7a4a2a','#a8693c','#c4864e','#dba06a'],woodD:['#4a2a18','#6b3f24','#8a5530','#a8703f'],
 oak:['#8a5a34','#b07a48','#c99660','#e2b47a'],white:['#9aa4b4','#d8dee8','#f2f5fa','#ffffff'],
 metal:['#3a3a48','#5a5a6c','#8a8aa0','#c0c0d4'],dark:['#14121c','#22202e','#34324a','#4a4866'],
 green:['#1e5a34','#2f8a4e','#4cb068','#86dc8c'],teal:['#1a4a4e','#2a6e72','#3f9a98','#7fd0c4'],
 red:['#6a1a24','#a8303a','#d84a4a','#ff8a7a'],blue:['#1c2e5a','#2e4f96','#4a78c8','#8ab4f0'],
 pink:['#8a2a5a','#c2457a','#e86a9a','#ffaccc'],cream:['#b8a080','#e0cca4','#f4e6c4','#fff8e4'],
 yellow:['#a86a14','#e0a028','#ffcf4a','#fff0a0'],purple:['#3a2458','#5a3a8a','#7e5ab8','#b494e8']};

// ===== characters =====
const CH={
 David:{role:'ผู้จัดการทีม · ดูภาพรวมและคุณภาพงาน',col:'#6aa0ff',
  skin:['#c87858','#f0b088','#ffd4b0','#ffe8d4'],hair:['#2e1c10','#4e321e','#74502e','#98703e'],top:['#18223e','#283c6c','#3c5a9a','#5a7ac0'],
  pants:['#10152a','#1c2440','#2c3658'],shoe:['#1a0f0a','#3a2414','#5a3a20'],accent:['#7a1420','#d03040','#ff6a6a'],style:'short',glasses:1},
 Kim:{role:'นักล่าข่าว · ไล่อ่านข่าว/อัลฟ่าบน X',col:'#4cd88a',
  skin:['#b8704a','#e8a878','#f8ca9e','#ffe0c4'],hair:['#08060c','#16121e','#2c2638','#463e58'],top:['#1a5030','#2c8a4c','#46b468','#7ade90'],
  pants:['#1a2c4e','#2c4878','#40669e'],shoe:['#e8e8f0','#ffffff','#ffffff'],accent:['#c0b090','#f0e2c0','#fff'],style:'spiky',phones:1},
 Jane:{role:'นักวิเคราะห์ · ดูกราฟ ประเมินกำไร/ความเสี่ยง',col:'#ff86b8',
  skin:['#d08868','#f8c0a0','#ffdcc4','#fff0e2'],hair:['#4a1a0c','#7e3418','#ac5228','#d8783e'],top:['#9a2a5a','#d8508a','#f478a8','#ffb0cc'],
  pants:['#241830','#382a4c','#4e3c68'],shoe:['#5a1830','#9a2a48','#c84a68'],accent:['#c09020','#ffd04a','#fff2a0'],style:'long'},
 Alex:{role:'นักวิเคราะห์ตลาด · อ่านกราฟราคาและ Order Book ของ Polymarket',col:'#ffa64a',look:'Kim',
  skin:['#c87858','#f0b088','#ffd4b0','#ffe8d4'],hair:['#8a6a1a','#c8a03a','#e8c85a','#fff0a0'],top:['#8a3a10','#d0661e','#f08a3a','#ffb878'],
  pants:['#22283a','#343e58','#4a5678'],shoe:['#1a0f0a','#3a2414','#5a3a20'],accent:['#c0b090','#f0e2c0','#fff'],style:'spiky'},
 Jhon:{role:'ผู้จัดการความเสี่ยง · คุมขนาดไม้และจุดตัดขาดทุน',col:'#b0b8c8',look:'David',
  skin:['#a8664a','#d89a70','#ecb890','#ffd8b8'],hair:['#08060c','#1a1620','#2e2a38','#4a4458'],top:['#2a2c34','#454852','#626672','#8a8e9a'],
  pants:['#14161c','#22252e','#333744'],shoe:['#0e0a08','#2a1a10','#4a3020'],accent:['#2a3a7a','#3a5ab8','#7a9aff'],style:'short',glasses:1},
 Su:{role:'นักวิจัย On-chain · แบ็กเทสต์และจดบันทึกเทรด',col:'#b48aff',look:'Jane',
  skin:['#d08868','#f8c0a0','#ffdcc4','#fff0e2'],hair:['#06040a','#14101c','#2a2236','#463a58'],top:['#3a2458','#6a44a0','#8e66c8','#c4a4f0'],
  pants:['#1e2a3a','#2e3e56','#425878'],shoe:['#2a1a40','#4a2e6a','#6a4a90'],accent:['#2a8a8a','#4ad0c8','#a0fff0'],style:'long'}};
const SPR={};
// dir:0 down,1 up,2 left,3 right ; pose: stand,walk,sit,sip,wave,couch,play
function charSprite(n,dir,f,pose,blink){const key=n+dir+f+pose+(blink?1:0);if(SPR[key])return SPR[key];
  const p=CH[n],L=p.look||n,flip=dir==2;if(flip)dir=3;const[c,g]=mk(26,40);
  const r=(x,y,w,h,col)=>R(g,x,y,w,h,col);const S=p.skin,HR=p.hair,TP=p.top,PN=p.pants,SH=p.shoe;
  const side=dir==3,back=dir==1;
  const bob=pose=='walk'?(f%2?-1:0):pose=='stand'||pose=='sip'?(f%2?1:0):0;const ox=1;
  // long hair behind
  if(p.style=='long'&&!side){r(4+ox,7+bob,16,17,HR[1]);r(4+ox,7+bob,2,17,HR[0]);r(18+ox,7+bob,2,17,HR[0]);r(6+ox,22+bob,12,2,HR[0])}
  if(p.style=='long'&&side){r(4+ox,7+bob,9,17,HR[1]);r(4+ox,7+bob,2,17,HR[0]);r(6+ox,22+bob,6,2,HR[0])}
  // legs
  const sitting=pose=='sit'||pose=='couch';
  if(pose=='couch'){r(6+ox,26,12,4,PN[1]);r(6+ox,26,12,1,PN[2]);r(7+ox,30,4,4,L=='Jane'?S[1]:PN[1]);r(13+ox,30,4,4,L=='Jane'?S[1]:PN[1]);r(6+ox,34,5,2,SH[1]);r(13+ox,34,5,2,SH[1])}
  else if(!sitting){
    if(side){const a=pose=='walk'?[0,3,0,-3][f]:0;
      const leg=(x,lift,shade)=>{r(x,26,4,7-lift,shade?PN[0]:PN[1]);if(L=='Jane')r(x,28,4,5-lift,shade?S[0]:S[1]);r(x,33-lift,6,2,shade?SH[0]:SH[1]);r(x+1,33-lift,4,1,SH[2])};
      leg(10+ox-a,a<0?1:0,1);leg(10+ox+a,a>0?1:0,0)}
    else{const l1=pose=='walk'?[0,2,0,0][f]:0,l2=pose=='walk'?[0,0,0,2][f]:0;
      for(const[x,l]of[[7+ox,l1],[13+ox,l2]]){r(x,26,4,7-l,PN[1]);r(x+3,26,1,7-l,PN[0]);if(L=='Jane'){r(x,29,4,4-l,S[1]);r(x+3,29,1,4-l,S[0])}r(x-1+(x>10?1:0),33-l,5,2,SH[1]);r(x+(x>10?1:0),33-l,3,1,SH[2])}}}
  // torso
  const by=16+bob;
  if(side){r(8+ox,by,9,10,TP[1]);r(8+ox,by,9,1,TP[2]);r(15+ox,by,2,10,TP[0]);r(8+ox,by+9,9,1,TP[0])}
  else{r(6+ox,by,12,10,TP[1]);r(6+ox,by,12,1,TP[2]);r(6+ox,by+1,1,8,TP[2]);r(16+ox,by,2,10,TP[0]);r(6+ox,by+9,12,1,TP[0]);
    if(L=='Jane'){r(5+ox,by+7,14,4,PN[1]);r(5+ox,by+10,14,1,PN[0]);r(5+ox,by+7,14,1,PN[2])}}
  if(!back&&!side){const A=p.accent;
    if(L=='David'){r(10+ox,by,4,5,'#f4f6fa');r(11+ox,by+1,2,7,A[1]);P(g,11+ox,by+1,A[2]);r(9+ox,by,1,4,TP[0]);r(14+ox,by,1,4,TP[0]);P(g,8+ox,by+3,'#ffd04a')}
    if(L=='Kim'){r(9+ox,by,6,2,TP[0]);r(9+ox,by+1,1,5,A[1]);r(14+ox,by+1,1,5,A[1]);r(8+ox,by+6,8,3,TP[2]);r(8+ox,by+8,8,1,TP[0]);r(11+ox,by+3,2,2,'#fff')}
    if(L=='Jane'){r(9+ox,by,6,2,'#fff');r(10+ox,by+2,4,1,'#fff');r(11+ox,by+3,2,2,A[2]);P(g,11+ox,by+3,A[1])}}
  if(back&&L=='Kim'){r(7+ox,by-1,10,4,TP[2]);r(7+ox,by+2,10,1,TP[0])}
  // arms
  const sw=pose=='walk'?[0,2,0,-2][f]:0;const arm=(x,y,len,dark)=>{r(x,y,3,len,dark?TP[0]:TP[1]);P(g,x,y,TP[2]);r(x,y+len,3,2,S[1]);P(g,x+2,y+len+1,S[0])};
  if(side){if(pose=='play'||pose=='sit'){r(12+ox,by+2,6,3,TP[1]);r(18+ox,by+2,2,3,S[1])}else arm(11+ox,by+1+Math.max(0,sw),6,0)}
  else if(pose=='sit'||pose=='play'){const a=f%2;r(3+ox,by+1,3,5,TP[0]);r(18+ox,by+1,3,5,TP[0]);r(4+ox,by+5-a,4,2,S[1]);r(16+ox,by+5-(1-a),4,2,S[1])}
  else if(pose=='sip'){arm(3+ox,by+1,7,1);r(18+ox,by,3,4,TP[1]);r(16+ox,by-3,4,3,S[1]);r(17+ox,by-6,5,5,'#fff');r(17+ox,by-6,5,1,'#6b3a1a');r(21+ox,by-5,2,3,'#ddd');r(17+ox,by-2,5,1,'#c8c8d0')}
  else if(pose=='wave'){arm(3+ox,by+1,7,1);const w=f%2;r(18+ox,by-3-w,3,5,TP[1]);r(18+ox,by-7-w,4,4,S[1]);P(g,21+ox,by-7-w,S[2])}
  else if(pose=='couch'){r(3+ox,by+2,3,6,TP[0]);r(18+ox,by+2,3,6,TP[0]);r(4+ox,by+8,3,2,S[1]);r(17+ox,by+8,3,2,S[1])}
  else{arm(3+ox,by+1+sw,7,1);arm(18+ox,by+1-sw,7,0)}
  // head
  const hy=2+bob,hx=4+ox;
  r(hx+1,hy,14,14,S[1]);r(hx,hy+1,16,12,S[1]);r(hx+1,hy+1,1,10,S[2]);r(hx+14,hy+2,1,11,S[0]);r(hx+2,hy+13,12,1,S[0]);
  if(back){r(hx,hy-1,16,13,HR[1]);r(hx+1,hy-2,14,2,HR[1]);r(hx+2,hy-1,6,2,HR[2]);dith(g,hx+3,hy+2,10,7,HR[2]);r(hx,hy+9,16,3,HR[0]);
    if(p.style=='spiky'){r(hx+2,hy-4,2,3,HR[1]);r(hx+7,hy-4,3,3,HR[1]);r(hx+12,hy-3,2,2,HR[1])}}
  else if(side){
    r(hx,hy-1,12,6,HR[1]);r(hx+1,hy-2,10,2,HR[1]);r(hx,hy+4,7,8,HR[1]);r(hx,hy+4,2,8,HR[0]);r(hx+3,hy-1,6,1,HR[2]);dith(g,hx+2,hy+1,6,3,HR[2]);
    if(p.style=='spiky'){r(hx+2,hy-4,2,3,HR[1]);r(hx+7,hy-4,3,3,HR[1]);r(hx+12,hy-2,3,3,HR[1])}
    if(p.style=='long'){r(hx,hy+4,5,14,HR[1]);r(hx,hy+4,2,14,HR[0]);r(hx+9,hy-2,3,3,'#ff6aa0')}
    r(hx+8,hy+5,2,4,HR[0]);
    if(blink)r(hx+11,hy+8,3,1,'#2a1a2a');else{r(hx+11,hy+6,2,4,'#2a1a2a');P(g,hx+11,hy+6,'#fff')}
    r(hx+13,hy+10,2,1,'#ff9aa0');P(g,hx+12,hy+12,'#b0504a');
    if(p.glasses){r(hx+9,hy+6,6,1,'#1a1220');r(hx+10,hy+6,1,4,'#1a1220');r(hx+14,hy+6,1,4,'#1a1220')}}
  else{
    if(p.style=='short'){r(hx,hy-1,16,5,HR[1]);r(hx+1,hy-2,14,2,HR[1]);r(hx,hy+3,2,6,HR[1]);r(hx+14,hy+3,2,5,HR[0]);r(hx+6,hy+3,7,2,HR[1]);r(hx+9,hy+4,4,1,HR[1]);r(hx+3,hy-1,5,1,HR[3]);dith(g,hx+2,hy,10,2,HR[2])}
    if(p.style=='spiky'){r(hx,hy-1,16,5,HR[1]);r(hx+1,hy-4,3,3,HR[1]);r(hx+6,hy-5,3,4,HR[1]);r(hx+11,hy-4,3,3,HR[1]);r(hx,hy+3,2,5,HR[1]);r(hx+14,hy+3,2,5,HR[0]);
      r(hx+3,hy+3,3,2,HR[1]);r(hx+8,hy+3,3,3,HR[1]);r(hx+12,hy+3,2,2,HR[1]);r(hx+4,hy-1,6,1,HR[3]);dith(g,hx+2,hy,11,2,HR[2])}
    if(p.style=='long'){r(hx,hy-1,16,5,HR[1]);r(hx+1,hy-2,14,2,HR[1]);r(hx-1,hy+3,3,14,HR[1]);r(hx+14,hy+3,3,14,HR[1]);r(hx-1,hy+3,1,14,HR[0]);r(hx+16,hy+3,1,14,HR[0]);
      r(hx+2,hy+3,5,3,HR[1]);r(hx+10,hy+3,4,2,HR[1]);r(hx+3,hy-1,6,1,HR[3]);dith(g,hx+2,hy,11,2,HR[2]);r(hx+12,hy-3,4,3,'#ff6aa0');P(g,hx+13,hy-3,'#ffc0d8')}
    if(blink){r(hx+3,hy+8,3,1,'#2a1a2a');r(hx+10,hy+8,3,1,'#2a1a2a')}
    else{r(hx+3,hy+6,3,4,'#2a1a2a');r(hx+10,hy+6,3,4,'#2a1a2a');P(g,hx+3,hy+6,'#fff');P(g,hx+10,hy+6,'#fff');P(g,hx+5,hy+9,'#5a4a8a');P(g,hx+12,hy+9,'#5a4a8a')}
    if(L=='Jane'){P(g,hx+2,hy+6,'#2a1a2a');P(g,hx+13,hy+6,'#2a1a2a')}
    r(hx+1,hy+10,3,1,'#ff9aa0');r(hx+12,hy+10,3,1,'#ff9aa0');r(hx+7,hy+11,2,1,'#b0504a');
    if(p.glasses){r(hx+2,hy+5,5,1,'#1a1220');r(hx+9,hy+5,5,1,'#1a1220');r(hx+2,hy+5,1,5,'#1a1220');r(hx+6,hy+5,1,5,'#1a1220');r(hx+9,hy+5,1,5,'#1a1220');r(hx+13,hy+5,1,5,'#1a1220');r(hx+7,hy+6,2,1,'#1a1220');P(g,hx+4,hy+6,'#cfe8ff')}}
  if(p.phones){const PH=['#145a30','#22c46a','#7af0a8'];if(side){r(hx+6,hy+4,4,5,PH[1]);P(g,hx+7,hy+5,PH[2]);r(hx+6,hy-2,4,1,'#2b2233')}
    else{r(hx-2,hy+4,3,6,PH[1]);r(hx+15,hy+4,3,6,PH[0]);P(g,hx-2,hy+5,PH[2]);r(hx+1,hy-3,14,1,'#2b2233')}}
  outline(c);
  if(flip){const[c2,g2]=mk(26,40);g2.translate(26,0);g2.scale(-1,1);g2.drawImage(c,0,0);return SPR[key]=c2}
  return SPR[key]=c}
function faceIcon(n){const[c,g]=mk(24,26);g.drawImage(charSprite(n,0,0,'stand'),-1,2);return c}

// ===== props (y-sorted) =====
function prop(w,h,draw,ox,oy){const[c,g]=mk(w,h);draw(g,w,h);return{c,ox,oy}}
function deskProp(w,kind){return prop(w+4,40,(g)=>{const x=2,y=8;
  // monitors / items behind (on desk top)
  box(g,x,y+4,w,12,PAL.oak);for(let i=4;i<w;i+=11)R(g,x+i,y+6,6,1,PAL.oak[2]);dith(g,x+1,y+12,w-2,3,PAL.oak[0]);
  box(g,x,y+16,w,12,PAL.wood);R(g,x+1,y+17,w-2,1,PAL.wood[3]);
  for(let i=0;i<(w>70?3:2);i++){const dx=x+6+i*((w-12)/(w>70?3:2));R(g,dx,y+19,(w-20)/(w>70?3:2),7,PAL.wood[0]);R(g,dx+1,y+20,(w-22)/(w>70?3:2),5,PAL.wood[1]);R(g,dx+((w-24)/(w>70?6:4)),y+22,4,1,PAL.yellow[2])}
  R(g,x+1,y+28,3,4,PAL.woodD[1]);R(g,x+w-4,y+28,3,4,PAL.woodD[1]);
},2,8)}
function chairProp(col){return prop(22,30,(g)=>{const r=PAL[col];box(g,3,2,16,16,r);R(g,5,4,12,2,r[3]);dith(g,5,8,12,8,r[0],1);R(g,4,18,14,4,r[0]);R(g,10,22,2,4,PAL.metal[1]);R(g,5,26,12,2,PAL.metal[0]);P(g,5,27,PAL.metal[2]);P(g,16,27,PAL.metal[2])},11,28)}
function monitorBack(g,x,y,w,h,glow){box(g,x,y,w,h,PAL.dark);R(g,x+2,y+2,w-4,h-4,PAL.dark[2]);dith(g,x+2,y+2,w-4,h-4,PAL.dark[3]);R(g,x+w/2-2,y+h,4,4,PAL.metal[1]);R(g,x+w/2-5,y+h+3,10,2,PAL.metal[0]);R(g,x-1,y-1,w+2,1,glow);P(g,x+w-3,y+h-3,'#3fe07a')}
function plantProp(k){return prop(30,44,(g)=>{const leaf=k==2?['#1a4a2a','#2a7040','#3f9a52','#7ac87a']:PAL.green;
  const pot=k==1?PAL.cream:k==2?PAL.white:['#6a2a14','#a8482a','#d8683a','#f0946a'];
  if(k==1){for(let i=0;i<9;i++){const a=-1.4+i*.35;let x=15,y=30;for(let s=0;s<14;s++){x+=Math.cos(a)*1.1;y-=Math.abs(Math.sin(a))*1.3+.3;R(g,x,y,3,2,leaf[s%3==0?2:1])}R(g,x,y,3,2,leaf[3])}}
  else{for(let i=0;i<40;i++){const a=rnd()*6.28,rr=Math.sqrt(rnd())*11;const x=15+Math.cos(a)*rr,y=19+Math.sin(a)*rr*.8;const sh=Math.sin(a)>.3?0:Math.cos(a)<-.3?2:1;R(g,x-2,y-2,5,4,leaf[sh])}
    for(let i=0;i<9;i++)R(g,8+rnd()*12,10+rnd()*8,2,1,leaf[3]);if(k==2)for(let i=0;i<6;i++){const x=7+rnd()*16,y=10+rnd()*14;R(g,x,y,3,3,'#ff8fb8');P(g,x+1,y+1,'#fff3c0')}}
  box(g,8,30,14,11,pot);R(g,7,29,16,3,pot[2]);R(g,7,29,16,1,pot[3]);R(g,9,32,12,1,pot[0]);dith(g,10,35,10,5,pot[0]);
  outline(g.canvas)},15,42)}
function lampProp(){return prop(20,56,(g)=>{R(g,9,14,2,38,PAL.metal[1]);P(g,9,14,PAL.metal[3]);ell(g,10,52,6,2,PAL.metal[0]);R(g,4,52,12,1,PAL.metal[2]);
  R(g,3,4,14,11,'#c8a060');R(g,4,4,12,10,'#ffe3a0');R(g,4,4,12,2,'#fff8d8');R(g,3,14,14,1,'#a87a3a');dith(g,4,8,12,6,'#f8d080');outline(g.canvas)},10,54)}
const PROPS=[];
function addProp(p,x,y,extra){PROPS.push(Object.assign({x,y,c:p.c,ox:p.ox,oy:p.oy},extra||{}));}
