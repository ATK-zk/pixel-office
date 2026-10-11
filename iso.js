'use strict';
// ===== v14: true 2.5D isometric renderer for the v11 office (plan coords -> 2:1 diamond grid) =====
const IW=1304,IH=764,WALLH=90,O={x:520,y:112};
function I(x,y,z){return{x:x-(y-72)+O.x,y:(x+(y-72))/2+O.y-(z||0)}}
const [ISOC,ig]=mk(IW,IH);window.ISOC=ISOC;
const [NW,nwg]=mk(W,72),[WW,wwg]=mk(H-72,72);
function poly(g,pts,fill,stroke){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(Math.round(p.x),Math.round(p.y)):g.moveTo(Math.round(p.x),Math.round(p.y)));g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.stroke()}}
function line(g,a,b,c){g.beginPath();g.moveTo(Math.round(a.x)+.5,Math.round(a.y)+.5);g.lineTo(Math.round(b.x)+.5,Math.round(b.y)+.5);g.strokeStyle=c;g.lineWidth=1;g.stroke()}
const rp=r=>({t:r[2],l:r[1],r:r[0],e:r[3]||r[2]});
function ibox(g,x,y,w,d,h,pal,z=0,ol=OL){if(Array.isArray(pal))pal=rp(pal);
  poly(g,[I(x+w,y,z),I(x+w,y+d,z),I(x+w,y+d,z+h),I(x+w,y,z+h)],pal.r);
  poly(g,[I(x,y+d,z),I(x+w,y+d,z),I(x+w,y+d,z+h),I(x,y+d,z+h)],pal.l);
  poly(g,[I(x,y,z+h),I(x+w,y,z+h),I(x+w,y+d,z+h),I(x,y+d,z+h)],pal.t);
  line(g,I(x,y+d,z+h),I(x+w,y+d,z+h),pal.e);line(g,I(x+w,y,z+h),I(x+w,y+d,z+h),pal.e);
  if(ol)poly(g,[I(x,y,z+h),I(x+w,y,z+h),I(x+w,y,z),I(x+w,y+d,z),I(x,y+d,z),I(x,y+d,z+h)],null,ol)}
function faceY(g,x0,x1,yf,z0,z1,c){poly(g,[I(x0,yf,z0),I(x1,yf,z0),I(x1,yf,z1),I(x0,yf,z1)],c)}
function faceX(g,xf,y0,y1,z0,z1,c){poly(g,[I(xf,y0,z0),I(xf,y1,z0),I(xf,y1,z1),I(xf,y0,z1)],c)}
function topR(g,x0,y0,x1,y1,z,c){poly(g,[I(x0,y0,z),I(x1,y0,z),I(x1,y1,z),I(x0,y1,z)],c)}
// ---- object list: baked sprites + dynamic overlays, depth = plan x+y ----
const OBJ=[];
function bake(x,y,w,d,H,draw,key,dyn){const a=I(x,y+d),b=I(x+w,y),t=I(x,y,H),f=I(x+w,y+d);
  const bx=Math.floor(a.x)-3,by=Math.floor(t.y)-3,cw=Math.ceil(b.x)-bx+4,ch=Math.ceil(f.y)-by+4;const[c,g]=mk(cw,ch);g.translate(-bx,-by);draw(g);
  const o={key:key!=null?key:x+w/2+y+d/2,img:c,ix:bx,iy:by,dyn,fp:[x,y,w,d]};OBJ.push(o);return o}
function B(x,y,w,d,h,pal,o={}){const ch=o.chunk;if(ch&&(w>ch||d>ch)){if(w>=d)for(let i=0;i<w;i+=ch)B(x+i,y,Math.min(ch,w-i),d,h,pal,{...o,chunk:0});else for(let i=0;i<d;i+=ch)B(x,y+i,w,Math.min(ch,d-i),h,pal,{...o,chunk:0});return}
  return bake(x,y,w,d,(o.z||0)+h+(o.extra||0),g=>{ibox(g,x,y,w,d,h,pal,o.z||0);o.deco&&o.deco(g)},o.key,o.dyn)}
function S(x,y,c,ox,oy,extra){const p=I(x,y);OBJ.push(Object.assign({key:x+y,img:c,ix:Math.round(p.x-ox),iy:Math.round(p.y-oy),px:x,py:y,ox,oy},extra||{}))}
function spr(w,h,draw){const[c,g]=mk(w,h);draw(g,w,h);return outline(c)}
// ---- rebuild the plan floor (no top-down half walls; restroom floor only) ----
halfWall=function(){};
buildWC=function(){for(let y=476;y<H;y+=10)for(let x=0;x<180;x+=10){const k=((x+y)/10)%2;R(b,x,y,10,10,k?'#cfe8f0':'#e8f6fa');R(b,x,y+9,10,1,'#a8c8d4');R(b,x+9,y,1,10,'#a8c8d4');P(b,x+2,y+2,'#fff')}
  ell(b,60,540,26,9,'#7fb8c8');ell(b,60,540,23,7,'#a8dcea')};
planks=function(x0,y0,x1,y1){for(let y=y0;y<y1;y+=24)for(let x=x0;x<x1;x+=24){const v=((x*7+y*3)/24)%3;R(b,x,y,24,24,['#cfd3d8','#d6dade','#c9cdd3'][v|0]);R(b,x,y,24,1,'#e8ebee');R(b,x,y,1,24,'#e2e5e9');R(b,x+23,y,1,24,'#b4b9c0');R(b,x,y+23,24,1,'#b4b9c0');dith(b,x+3,y+3,6,3,'#eef0f2')}};
const _rug=rug;rug=function(x,y,w,h){R(b,x,y,w,h,'#3a4a5e');R(b,x+3,y+3,w-6,h-6,'#4a5d74');R(b,x+3,y+3,w-6,1,'#6a7f98');dith(b,x+6,y+6,w-12,h-12,'#55697f')};
_s=11;b.clearRect(0,0,W,H);buildBG();
(function(){const wg=b.createLinearGradient(0,0,0,56);wg.addColorStop(0,'#f2f4f6');wg.addColorStop(1,'#dfe3e8');b.fillStyle=wg;b.fillRect(180,0,W-180,56);R(b,0,56,W,16,'#3a3f4a');R(b,0,56,W,2,'#8a92a0');R(b,0,70,W,2,'#22262e');
 box(b,470,10,96,42,PAL.dark);box(b,436,14,22,28,PAL.metal);R(b,439,17,16,22,'#7fc8ff');ell(b,447,26,5,5,'#ffe08a');R(b,439,32,16,7,'#3f9a52');
 fg.clearRect(0,0,W,H);for(const[x,y,w,h]of WINS){fg.fillStyle='#2a2e38';fg.fillRect(x-3,y-3,w+6,3);fg.fillRect(x-3,y+h,w+6,3);fg.fillRect(x-3,y,3,h);fg.fillRect(x+w,y,3,h);for(let k=x+w/(w>150?4:2);k<x+w-2;k+=w/(w>150?4:2))fg.fillRect(k-1,y,2,h);fg.fillStyle='#ffffff26';for(let k=0;k<h;k++)fg.fillRect(x+8+k*.6,y+k,3,1)}})();
// ---- west wall texture ----
(function(){const g=wwg,L=H-72;const wg=g.createLinearGradient(0,0,0,72);wg.addColorStop(0,'#f2f4f6');wg.addColorStop(1,'#dfe3e8');g.fillStyle=wg;g.fillRect(0,0,L,58);
  
  R(g,0,56,L,16,'#3a3f4a');R(g,0,56,L,2,'#8a92a0');R(g,0,70,L,2,'#22262e');
  for(let y=4;y<56;y+=8)for(let x=0;x<108;x+=8){R(g,x,y,8,8,(x+y)%16?'#f2f0ea':'#e4ece8');R(g,x,y+7,8,1,'#c8ccc8');R(g,x+7,y,1,8,'#c8ccc8')}// pantry backsplash
  for(let y=0;y<72;y+=12)for(let x=404;x<L;x+=6){R(g,x,y,6,12,'#b8dce8');R(g,x,y,1,12,'#9cc4d2');R(g,x,y+11,6,1,'#9cc4d2')}// restroom tiles
  box(g,150,12,40,30,PAL.dark);R(g,153,15,34,24,'#fbfcff');for(let i=0;i<6;i++)R(g,156+i*5,34-i*3-(i%2)*2,3,4+i*3,['#3fe07a','#ff5a6a'][i%2]);// chart poster
  box(g,230,10,56,36,PAL.oak);R(g,233,13,50,30,'#d8b878');for(const[x,y,c]of[[237,16,'#ffe08a'],[251,20,'#a8e0ff'],[265,15,'#ffc0d0'],[241,30,'#c0ffc8'],[257,31,'#fff']])R(g,x,y,10,8,c);// cork board
  box(g,330,14,22,28,PAL.oak);R(g,333,17,16,22,'#ffcf4a');R(g,338,22,6,6,'#e84a4a');// poster
  box(g,24,10,40,30,['#6a8a9a','#bfe6f4','#e8fbff','#fff'])})();
// ---- furniture (isometric, original palette) ----
const GLOW={David:'#9ad0ff',Kim:'#7fe0ff',Jane:'#8affb0',Alex:'#ffd08a',Jhon:'#ff9a9a',Su:'#c8a8ff'};
const MON={Kim:w=>[[4,20],[w-24,20]],Jane:w=>[[2,16],[w/2-9,18],[w-18,16]],Alex:()=>[[1,15],[18,16],[36,16],[54,15]],Jhon:w=>[[w-26,22]],Su:()=>[[4,20],[28,18]],David:()=>[[10,24]]};
const deskObj={};
function desk(l,bot,w,who){const y=bot-18,d=18,h=16;
  deskObj[who]=B(l,y,w,d,h,{t:'#f4f6f8',l:'#5a606c',r:'#3a3f4a',e:'#ffffff'},{extra:18,deco:g=>{
    
    const n=w>76?3:2,dw=(w-12)/n;for(let i=0;i<n;i++){const dx=l+6+i*dw;faceY(g,dx,dx+dw-4,y+d,3,12,'#4a505c');faceY(g,dx+dw/2-4,dx+dw/2,y+d,8,9,'#c0c6d0')}
    for(const[mx,mw]of MON[who](w)){const x=l+mx;ibox(g,x+mw/2-2,y+3,4,3,3,PAL.metal,h);ibox(g,x,y+2,mw,2,Math.round(mw*.55),PAL.dark,h+3);line(g,I(x,y+2,h+3+Math.round(mw*.55)),I(x+mw,y+2,h+3+Math.round(mw*.55)),GLOW[who])}
    if(who=='David'){ibox(g,l+48,y+9,12,6,1,PAL.white,h);ibox(g,l+66,y+8,5,5,7,PAL.white,h);ibox(g,l+w-10,y+6,5,5,9,PAL.yellow,h)}
    if(who=='Kim'){ibox(g,l+44,y+9,12,6,1,PAL.white,h);ibox(g,l+30,y+10,8,5,1,PAL.dark,h)}
    if(who=='Jane'){ibox(g,l+30,y+10,6,5,6,PAL.white,h)}
    if(who=='Jhon'){ibox(g,l+6,y+6,10,8,3,PAL.dark,h);ibox(g,l+22,y+4,9,4,12,PAL.blue,h)}
    if(who=='Su'){ibox(g,l+50,y+7,16,8,2,PAL.cream,h);ibox(g,l+6,y+10,8,5,4,PAL.purple,h)}}})}
desk(344,190,84,'David');desk(222,262,70,'Kim');desk(512,262,70,'Jane');desk(222,412,70,'Alex');desk(362,412,70,'Jhon');desk(502,412,70,'Su');
for(const[x,y,c]of[[386,160,'dark'],[257,232,'dark'],[547,232,'dark'],[257,382,'dark'],[397,382,'dark'],[537,382,'dark'],[78,382,'metal'],[110,382,'metal'],[142,382,'metal']]){const p=chairProp(c);S(x,y,outline(p.c),p.ox,p.oy)}
// partitions (chunked for correct depth)
const PW={t:'#8a92a0',l:'rgba(150,205,230,.45)',r:'rgba(110,170,205,.5)',e:'#e8f8ff'};
B(180,72,4,212,34,PW,{chunk:24});B(600,72,4,212,34,PW,{chunk:24});B(180,340,4,236,34,PW,{chunk:24});
// pantry
B(0,74,178,22,24,{t:'#2e323a',l:'#f2f5fa',r:'#c8ced8',e:'#5a606c'},{chunk:30,deco:null});
for(let x=4;x<170;x+=29)OBJ[OBJ.length-1]&&0;
(function(){for(let x=6;x<170;x+=29)B(x,95.5,25,.5,1,PAL.wood,{z:3,key:x+12+96,deco:g=>{faceY(g,x,x+25,96,3,20,'#d8dee8');faceY(g,x+1,x+24,96,4,19,'#f2f5fa');faceY(g,x+18,x+21,96,16,17,'#8a92a0')}})})();
B(30,77,20,14,20,PAL.dark,{z:24,deco:g=>{faceY(g,33,47,91,32,40,PAL.metal[1]);faceY(g,35,42,91,34,38,'#3fe07a');faceY(g,36,44,91,24,30,'#111')}});
B(92,78,26,13,13,PAL.white,{z:24,deco:g=>faceY(g,95,110,91,26,35,'#3a4a5a')});
B(128,82,8,8,10,PAL.red,{z:24});B(6,80,10,10,8,PAL.green,{z:24,extra:6,deco:g=>ibox(g,8,82,6,6,5,PAL.green,32)});
B(64,82,14,8,3,PAL.white,{z:24,extra:4,deco:g=>{ibox(g,66,83,4,4,3,PAL.red,27);ibox(g,71,84,4,4,3,PAL.yellow,27)}});
B(150,98,28,18,58,PAL.white,{deco:g=>{faceY(g,150,178,116,34,35,PAL.white[0]);faceY(g,170,172,116,40,52,PAL.metal[2]);faceY(g,170,172,116,8,30,PAL.metal[2]);faceY(g,154,160,116,44,50,PAL.pink[1])}});
B(112,124,16,14,26,PAL.white,{extra:18,deco:g=>{ibox(g,114,126,12,10,18,['#4a8ad0','#7fc8ff','#b8e4ff','#fff'],26);faceY(g,114,117,138,16,18,'#3a7be0');faceY(g,121,124,138,16,18,'#e04848')}});
S(96,214,spr(52,30,g=>{ell(g,26,10,24,9,PAL.cream[0]);ell(g,26,9,23,8,PAL.cream[2]);ell(g,22,7,12,3,PAL.cream[3]);R(g,24,16,4,10,PAL.woodD[1]);R(g,18,25,16,2,PAL.woodD[0]);box(g,10,5,5,4,PAL.white);box(g,32,6,8,4,PAL.red)}),26,26);
for(const sx of[60,132])S(sx,220,spr(16,16,g=>{ell(g,8,5,7,4,PAL.red[1]);ell(g,8,4,6,3,PAL.red[2]);R(g,7,8,2,6,PAL.metal[1])}),8,14);
// meeting corner
B(62,390,96,22,16,{t:'#e8f4fa',l:'#5a606c',r:'#3a3f4a',e:'#fff'},{extra:8,deco:g=>{ibox(g,80,396,12,8,1,PAL.white,16);ibox(g,120,395,10,8,1,PAL.white,16);ibox(g,104,398,6,5,6,PAL.yellow,16)}});
S(46,356,spr(64,46,g=>{box(g,2,2,60,34,PAL.white);R(g,4,4,56,30,'#fbfcff');R(g,8,26,8,6,'#e84a4a');R(g,20,20,8,12,'#3a7be0');R(g,32,14,8,18,'#2f8a4e');R(g,44,8,8,24,'#e0a028');for(let i=0;i<5;i++)R(g,8+i*10,10-i,8,1,'#5a3a8a');R(g,6,36,2,10,PAL.metal[1]);R(g,56,36,2,10,PAL.metal[1]);R(g,10,37,44,2,PAL.metal[2])}),32,46);
// lounge
_s=77;for(const bx of[622,664])B(bx,88,40,16,72,PAL.white,{deco:g=>{faceY(g,bx+2,bx+38,104,2,70,'#c8ced8');for(let s=0;s<4;s++){const z0=4+s*17;faceY(g,bx+2,bx+38,104,z0,z0+2,'#f2f5fa');let x=bx+3;while(x<bx+36){const w=3+Math.floor(rnd()*2),hh=9+Math.floor(rnd()*4),c=pick([PAL.red,PAL.blue,PAL.green,PAL.yellow,PAL.purple,PAL.pink]);faceY(g,x,x+w,104,z0+2,z0+2+hh,c[1]);faceY(g,x,x+1,104,z0+2,z0+2+hh,c[2]);x+=w}}}});
B(727,112,30,16,60,PAL.purple,{deco:g=>{faceY(g,730,754,128,30,47,PAL.dark[1]);faceY(g,729,755,128,50,57,PAL.yellow[2]);faceY(g,732,752,128,52,54,PAL.red[2]);faceY(g,729,755,128,22,28,PAL.purple[0])}},);
OBJ[OBJ.length-1].dyn=g=>{for(let i=0;i<20;i++){if(((i*7+Math.floor(time*8))%5)<1){const x=731+i,z=32+((i*5+Math.floor(time*6))%13);const p=I(x,128,z);R(g,p.x,p.y,1,1,['#ff4a8a','#4af0ff','#ffe04a'][i%3])}}const p=I(741+Math.sin(time*3)*7,128,39);R(g,p.x,p.y,2,2,'#ffe04a')};
const TEAL={t:'#5a6478',l:'#454e60',r:'#323a4a',e:'#7a86a0'};
B(634,368,112,7,28,TEAL,{chunk:38});B(646,375,88,17,12,TEAL,{chunk:30,deco:null});B(634,368,12,24,18,TEAL);B(734,368,12,24,18,TEAL);
B(652,377,16,6,10,PAL.yellow,{z:12});B(712,377,16,6,10,PAL.pink,{z:12});
B(672,432,36,12,8,PAL.oak,{extra:6,deco:g=>{ibox(g,678,435,5,5,5,PAL.white,8);ibox(g,694,436,8,5,1,PAL.green,8)}});
B(657,464,66,12,14,PAL.woodD,{extra:20,deco:g=>{faceY(g,661,687,476,3,11,PAL.woodD[0]);faceY(g,692,719,476,3,11,PAL.woodD[0]);ibox(g,667,466,46,3,19,PAL.dark,14);line(g,I(667,466,33),I(713,466,33),'#7fc8ff')}});
B(714,286,32,12,10,PAL.dark,{extra:24});const fishO=B(714,286,32,12,22,{t:'#8ad8f0',l:'#4aa0d0',r:'#2a6a9a',e:'#e0f8ff'},{z:10,key:730+292+1});
fishO.dyn=g=>{faceY(g,716,744,298,12,17,'#2a7aa8');for(let i=0;i<2;i++){const fx=718+((time*(6+i*4)+i*10)%24),fz=20+i*5+Math.sin(time*2+i)*1.5,p=I(fx,298,fz);R(g,p.x,p.y,3,2,i?'#ffa03a':'#ff5a8a')}faceY(g,720,723,298,11,16,'#3f9a52');faceY(g,733,735,298,11,18,'#3f9a52')};
B(316,530,28,14,52,PAL.red,{deco:g=>{faceY(g,319,333,544,16,46,'#1a3a5a');for(let i=0;i<3;i++)for(let j=0;j<4;j++)faceY(g,320+i*4,323+i*4,544,19+j*7,24+j*7,[PAL.yellow[2],PAL.green[2],PAL.pink[2]][(i+j)%3]);faceY(g,335,339,544,30,40,PAL.metal[2]);faceY(g,320,338,544,4,10,'#111')}});
B(392,548,56,10,8,PAL.oak);
// restroom walls, stall, sink, toilet
const TILE={t:PAL.woodD[2],l:'#b8dce8',r:'#7aa4b4',e:PAL.oak[3]};
B(0,470,122,6,34,TILE,{chunk:24});B(144,470,36,6,34,TILE,{chunk:18});
B(4,478,22,12,20,PAL.white,{deco:g=>{topR(g,8,481,22,487,20,'#a8c8d8')}});
B(146,478,3,30,30,PAL.teal,{chunk:15});B(146,538,34,3,30,PAL.teal,{chunk:17});
S(166,522,spr(14,18,g=>{box(g,1,1,12,6,PAL.white);ell(g,7,12,6,5,'#f2f5fa');ell(g,7,12,4,3,'#cfe8f4')}),7,17);
const wcDoor={key:133+473,img:null,ix:0,iy:0,dyn:g=>{const near=bots.some(bt=>Math.abs(bt.x-133)<14&&Math.abs(bt.y-480)<26&&!bt.hidden);const occ=bots.some(bt=>bt.hidden);
  if(!near){ibox(g,122,472,22,2,32,PAL.oak);faceY(g,140,142,474,14,17,PAL.yellow[2])}
  const p=I(133,476,44);ibox(g,124,474,18,1,9,['#1c3a7a','#2e5ab8','#4a7ae0','#8ab4ff'],36,null);ell(g,Math.round(p.x)+14,Math.round(p.y)+4,2,2,occ?'#ff4a4a':'#3fe07a');
  if(occ){ibox(g,149,508,2,30,28,PAL.teal)}else ibox(g,149,508,30,2,28,PAL.teal)}};OBJ.push(wcDoor);
// plants & lamps (upright pixel sprites)
_s=11;for(const[x,y,k]of[[200,96,1],[586,96,0],[166,288,0],[620,290,2],[200,470,2],[588,470,1],[316,470,0],[476,470,2],[16,300,1],[12,462,0],[756,470,2],[240,566,1],[560,566,0],[700,566,2],[606,110,0]]){const p=plantProp(k);S(x,y,p.c,p.ox,p.oy)}
for(const[x,y]of[[312,150],[470,226],[214,170],[640,240],[28,360],[470,330]]){const p=lampProp();S(x,y,outline(p.c),p.ox,p.oy)}
// baked contact shadows on the plan floor
for(const o of OBJ)if(o.fp){const[x,y,w,d]=o.fp;softShadow(b,x+w/2+3,y+d/2+3,Math.max(w,d)/2+3,Math.min(w,d)/2+3,.28)}else if(o.px!=null&&o.img)softShadow(b,o.px,o.py,o.img.width*.4,4,.3);
// ---- particles / ambience in iso ----
puff=function(x,y){parts.push({x,y:y+30,h:30,vx:(Math.random()-.5)*3,vy:-8-Math.random()*4,t:0,life:1.8})};
const dust=[];const GLOWCOL={David:'140,200,255',Kim:'120,230,255',Jane:'140,255,180',Alex:'255,200,130',Jhon:'255,150,150',Su:'200,170,255'};
const [vig,vgx]=mk(IW,IH);{const gr=vgx.createRadialGradient(IW/2,IH/2,IH*.4,IW/2,IH/2,IW*.62);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(10,4,20,.5)');vgx.fillStyle=gr;vgx.fillRect(0,0,IW,IH)}
const FLOOR=[1,.5,-1,.5,O.x+72,O.y-36];
// floor slab (static)
const [base,bsg]=mk(IW,IH);(function(){const g=bsg,T=12;const a=I(768,72),c=I(768,H),d=I(0,H);
  poly(g,[c,a,{x:a.x,y:a.y+T},{x:c.x,y:c.y+T}],'#3a2414',OL);poly(g,[d,c,{x:c.x,y:c.y+T},{x:d.x,y:d.y+T}],'#5a3a20',OL)})();
drawWorld=function(){const g=ig,dt=1/60;
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,IW,IH);g.drawImage(base,0,0);
  // floor
  g.setTransform(...FLOOR);g.drawImage(bg,0,72,W,H-72,0,72,W,H-72);g.setTransform(1,0,0,1,0,0);
  // walls: textures (north wall gets live sky, TV, clock)
  nwg.drawImage(bg,0,0,W,72,0,0,W,72);drawSky(nwg);drawScreens(nwg);
  const nk=.06+nightK*.45;nwg.save();nwg.beginPath();nwg.rect(0,0,W,72);for(const[x,y,w,h]of WINS)nwg.rect(x,y,w,h);nwg.rect(474,14,88,34);nwg.fillStyle=`rgba(18,16,52,${nk})`;nwg.fill('evenodd');nwg.restore();
  g.setTransform(-1,.5,0,WALLH/72,O.x,O.y-WALLH);g.drawImage(WW,0,0);g.fillStyle=`rgba(20,12,30,${.16+nk})`;g.fillRect(0,0,H-72,72);
  g.setTransform(1,.5,0,WALLH/72,O.x,O.y-WALLH);g.drawImage(NW,0,0);g.setTransform(1,0,0,1,0,0);
  const tA=I(0,72,WALLH),tB=I(768,72,WALLH),tC=I(0,H,WALLH);
  poly(g,[tC,tA,tB,{x:tB.x,y:tB.y-5},{x:tA.x,y:tA.y-5},{x:tC.x,y:tC.y-5}],'#5a3a20',OL);line(g,{x:tA.x,y:tA.y-5},{x:tB.x,y:tB.y-5},'#8a5530');line(g,{x:tC.x,y:tC.y-5},{x:tA.x,y:tA.y-5},'#8a5530');
  poly(g,[tB,{x:tB.x,y:tB.y-5},{x:tB.x+3,y:tB.y-6},{x:tB.x+3,y:tB.y+WALLH-1},{x:tB.x,y:tB.y+WALLH}],'#3a2414',OL);
  // depth-sorted scene
  const list=OBJ.slice();for(const bt of bots)if(!bt.hidden)list.push({key:bt.x+bt.y+.5,bt});list.sort((a,c)=>a.key-c.key);
  for(const o of list){if(o.bt){const bt=o.bt,q=I(bt.x,bt.y);g.drawImage(shC,Math.round(q.x)-12,Math.round(q.y)-4);
      const s=charSprite(bt.n,bt.dir,(bt.pose!='couch')?bt.f:0,bt.pose,bt.blink&&bt.dir!=1);g.drawImage(s,Math.round(q.x)-13,Math.round(q.y)-37+(bt.pose=='couch'?-6:0))}
    else{if(o.img)g.drawImage(o.img,o.ix,o.iy);if(o.dyn)o.dyn(g)}}
  for(const bt of bots)if(bt.emote&&!bt.hidden){const q=I(bt.x,bt.y);drawEmote(g,{emote:bt.emote,x:q.x,y:q.y,pose:bt.pose})}
  for(const p of parts){const q=I(p.x,p.y,p.h);const a=1-p.t/p.life;g.globalAlpha=a*.7;const s=p.t>1?2:1;R(g,q.x+p.vx*p.t+Math.sin(p.t*4)*1.5,q.y+p.vy*p.t*0,s,s,'#fff')}g.globalAlpha=1;
  for(const bt of bots)if(bt.state=='walk'&&!bt.hidden&&Math.random()<.18)dust.push({x:bt.x+(Math.random()-.5)*6,y:bt.y,t:0});
  for(let i=dust.length-1;i>=0;i--){const d=dust[i];d.t+=dt;if(d.t>.6){dust.splice(i,1);continue}const q=I(d.x,d.y,d.t*5);g.globalAlpha=(1-d.t/.6)*.5;R(g,q.x,q.y,1+(d.t>.3),1,'#e8d8b8')}g.globalAlpha=1;
  // lighting projected onto the floor + glows
  g.setTransform(...FLOOR);g.drawImage(lightC,0,72,W,H-72,0,72,W,H-72);g.globalCompositeOperation='lighter';g.drawImage(glowC,0,72,W,H-72,0,72,W,H-72);g.setTransform(1,0,0,1,0,0);
  for(const bt of bots){if(bt.hidden||bt.state!='work')continue;const q=I(bt.x,bt.y,26),fl=.18+.07*Math.sin(time*7+bt.x)+(Math.random()<.03?.1:0);const gr=g.createRadialGradient(q.x,q.y,0,q.x,q.y,22);gr.addColorStop(0,`rgba(${GLOWCOL[bt.n]},${fl*(.6+nightK)})`);gr.addColorStop(1,`rgba(${GLOWCOL[bt.n]},0)`);g.fillStyle=gr;g.fillRect(q.x-22,q.y-22,44,44)}
  const tv=I(510,72,58),tg=g.createRadialGradient(tv.x,tv.y,0,tv.x,tv.y,70);tg.addColorStop(0,`rgba(90,170,255,${.08+.04*Math.sin(time*2)+nightK*.12})`);tg.addColorStop(1,'rgba(90,170,255,0)');g.fillStyle=tg;g.fillRect(tv.x-70,tv.y-70,140,140);
  for(const m of motes){m.y-=m.v*.016;m.x+=Math.sin(time+m.s)*.1;if(m.y<90){m.y=470;m.x=Math.random()*W}const q=I(m.x,m.y,30+20*Math.sin(m.s));g.globalAlpha=(.25+.25*Math.sin(time*2+m.s))*(nightK>.6?.5:1);P(g,q.x,q.y,'#fff4c0')}
  g.globalAlpha=1;g.globalCompositeOperation='source-over';g.drawImage(vig,0,0)};
// ---- camera, picking, DOM overlays in iso space ----
limits=function(){const fit=Math.min(vw/IW,vh/IH);return{min:fit*.95,max:6}};
homeCam=function(){const P=[I(205,110),I(600,110),I(205,430),I(600,430)];let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of P){x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y)}y0-=70;const z=Math.min(vw/(x1-x0+20),(vh-150)/(y1-y0));return{z,x:(x0+x1)/2,y:(y0+y1)/2+(vw<600?-10:0)}};
clampC=function(c){const L=limits();c.z=Math.max(L.min,Math.min(L.max,c.z));const hw=vw/2/c.z,hh=vh/2/c.z;c.x=hw*2>=IW?IW/2:Math.max(hw,Math.min(IW-hw,c.x));c.y=hh*2>=IH?IH/2:Math.max(hh,Math.min(IH-hh,c.y));return c};
$('bfit').onclick=()=>{flyTo({z:0,x:IW/2,y:IH/2});blip(520)};
focusBot=function(n){const bt=bots.find(x=>x.n==n),q=I(bt.x,bt.y);flyTo({z:Math.max(cam.z,2.6),x:q.x,y:q.y-20});showCard(n);blip(780)};
document.querySelectorAll('[data-f]').forEach(el=>el.onclick=()=>focusBot(el.dataset.f));
hit=function(sx,sy){const w=toWorld(sx,sy);let best=null,bd=1e9;for(const bt of bots){if(bt.hidden)continue;const q=I(bt.x,bt.y),dx=w.x-q.x,dy=w.y-(q.y-18);if(Math.abs(dx)<14&&Math.abs(dy)<22){const d=dx*dx+dy*dy;if(d<bd){bd=d;best=bt}}}
  if(best){showCard(best.n);emote(best,'♪');blip(880);return}hideCard()};
$('board').classList.add('wall');
const TVR=[448,10,124,42];
const _ds0=drawScreens;drawScreens=function(g){_ds0(g);R(g,436,4,148,54,'#e6eaee');box(g,TVR[0],TVR[1],TVR[2],TVR[3],PAL.dark);R(g,TVR[0]+2,TVR[1]+2,TVR[2]-4,TVR[3]-4,'#09111d')};
placeBoard=function(){const B=$('board');const a=I(TVR[0],72,(72-TVR[1])*WALLH/72),p=toScreen(a.x,a.y);const w=B._w||(B._w=B.offsetWidth),h=B._h||(B._h=B.offsetHeight);
  const s=(TVR[2]*cam.z)/w,sy=(TVR[3]*WALLH/72*cam.z)/h;B.style.transform=`translate(${p.x|0}px,${p.y|0}px) matrix(${s.toFixed(4)},${(s*.5).toFixed(4)},0,${sy.toFixed(4)},0,0)`};
placeDom=function(){placeBoard();for(const bt of bots){const B=bubs[bt.n],tg=tags[bt.n];const txt=bt.say||status[bt.n]||'…';const html=`<b>${bt.n}</b>${esc(txt)}`;
  if(B._h!==html){B.innerHTML=html;B._h=html;B._w=B.offsetWidth;B._hh=B.offsetHeight}
  const q=I(bt.x,bt.y),p=toScreen(q.x,q.y-(bt.pose=='sit'?42:40)-(bt.emote?14:0));const w=B._w||100,h=B._hh||30;let x=p.x-w/2,y=p.y-h-8;
  const cx=Math.max(6,Math.min(vw-w-6,x)),cy=Math.max(6,Math.min(vh-h-6,y));B.style.setProperty('--tx',Math.max(-w/2+10,Math.min(w/2-10,x-cx))+'px');
  B.style.transform=`translate(${cx|0}px,${cy|0}px)`;const vis=!bt.hidden&&cam.z>=0.45&&p.x>4&&p.x<vw-4&&p.y>10&&p.y<vh+40;B.style.opacity=vis?1:0;B.style.zIndex=Math.round(bt.x+bt.y);
  const r=toScreen(q.x,q.y+3);tg.style.transform=`translate(${(r.x-(tg._w||(tg._w=tg.offsetWidth))/2)|0}px,${r.y|0}px)`;tg.style.opacity=(cam.z>=0.6&&!bt.hidden)?1:0}};
resize.done=0;resize();Object.assign(tcam,cam);
