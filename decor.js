'use strict';
// v34 decor pack: extra office props (baked once to small canvases; only LEDs/candles animate)
safe(()=>{
const D=(x,y,w,h,draw,extra)=>prop2(x,y,w,h,Math.round(w/2),h-1,draw,extra);
const sh=(x,y,w)=>softShadow(b,x,y-1,w*.45,3.5,.28);
const pot=(g,x,y,w,c)=>{box(g,x,y,w,6,c||['#8a4a2a','#b8653a','#d98a54'])};
const leaf=(g,x,y,r,c)=>{ell(g,x,y,r,r*.8|0,c[0]);ell(g,x-1,y-1,r-1,(r-1)*.8|0,c[1]);P(g,x-2,y-2,c[2])};
const G1=['#2f6b3a','#4a9a4f','#8fd27a'],G2=['#2a5d4e','#3f8f6f','#9be0b8'],G3=['#4b6b2a','#7aa83f','#c8e87a'];
// --- plants of several kinds ---
const monstera=(x,y)=>{D(x,y,22,30,(g)=>{pot(g,6,23,10,['#3a3f4a','#5a6070','#8a90a0']);for(const[a,b2,r]of[[11,8,7],[5,13,5],[16,13,5],[11,17,5]])leaf(g,a,b2,r,G2);R(g,10,18,2,5,'#2a4a3a')});sh(x,y,20)};
const cactus=(x,y)=>{D(x,y,14,24,(g)=>{pot(g,3,17,8,['#a05a3a','#d9824f','#f0b07a']);R(g,5,4,4,13,G3[1]);R(g,5,4,1,13,G3[2]);R(g,2,8,3,2,G3[1]);R(g,2,6,2,3,G3[1]);R(g,9,10,3,2,G3[1]);R(g,10,7,2,4,G3[1]);P(g,7,3,'#ff7aa0')});sh(x,y,12)};
const tallPalm=(x,y)=>{D(x,y,24,40,(g)=>{pot(g,7,33,10,['#e8e2d4','#f6f2ea','#fff']);R(g,11,14,2,19,'#7a5a3a');for(let k=0;k<6;k++){const a=k/6*Math.PI*2;for(let t=0;t<9;t++)P(g,12+Math.cos(a)*t,12+Math.sin(a)*t*.6-t*.25,t<4?G1[1]:G1[2])}leaf(g,12,11,3,G1)});sh(x,y,20)};
const hanging=(x,y)=>{D(x,y,16,22,(g)=>{pot(g,4,2,8,['#c9a27a','#e8c49a','#fff0d0']);for(let i=0;i<5;i++){const xx=3+i*2.5;for(let t=0;t<12-i%3*3;t++)P(g,xx+Math.sin(t*.8+i)*1,9+t,t%3?G1[1]:G1[2])}})};
// --- furniture ---
const bookshelf=(x,y)=>{D(x,y,30,40,(g)=>{box(g,1,1,28,38,['#5a3a24','#8a5a36','#b07a4a']);const cols=['#d9534f','#3d7ec9','#e8b84a','#5cb85c','#9b59b6','#e67e22','#ecf0f1'];for(let s=0;s<3;s++){R(g,3,4+s*12,24,10,'#3a2416');let xx=4;for(let k=0;xx<26;k++){const w=2+(k*7+s*3)%2,h=6+(k*5+s)%3;R(g,xx,13+s*12-h,w,h,cols[(k*3+s*5)%cols.length]);xx+=w+((k+s)%4==0?1:0)}}});sh(x,y,28)};
const coffeeMachine=(x,y)=>{D(x,y,40,30,(g)=>{box(g,1,14,38,15,['#6b4a36','#9a6c4c','#c49a72']);box(g,4,2,14,14,['#2a2a30','#454550','#6a6a78']);R(g,7,5,8,3,'#1a1a1e');P(g,8,6,'#5dff9a');R(g,9,10,4,3,'#ddd');box(g,22,6,6,8,['#e8e8ee','#fff','#fff']);R(g,23,8,4,2,'#7a4a2a');box(g,30,9,6,5,['#d0c0a0','#f0e4cc','#fff'])},{dyn:'steam'});sh(x,y,38)};
const cooler=(x,y)=>{D(x,y,14,32,(g)=>{box(g,2,14,10,17,['#c8ccd4','#e8ecf2','#fff']);box(g,3,1,8,13,['#5aa0d0','#8fd0f4','#d0f0ff']);R(g,5,3,1,8,'#e8fbff');P(g,4,18,'#3d7ec9');P(g,9,18,'#d9534f')});sh(x,y,12)};
const printer=(x,y)=>{D(x,y,26,22,(g)=>{box(g,1,10,24,11,['#3a3d48','#5a5e6c','#868a98']);box(g,3,4,20,7,['#c8ccd4','#e8ecf2','#fff']);R(g,6,1,14,4,'#fff');R(g,6,14,14,2,'#20222a');P(g,21,12,'#5dff9a')},{dyn:'printled'});sh(x,y,24)};
const serverRack=(x,y)=>{D(x,y,24,46,(g)=>{box(g,1,1,22,44,['#15161c','#262833','#3a3d4c']);for(let r=0;r<7;r++){R(g,3,4+r*6,18,5,'#0e0f14');R(g,3,4+r*6,18,1,'#353846');for(let k=0;k<4;k++)P(g,5+k*2,6+r*6,'#2a2c36')}},{dyn:'leds'});sh(x,y,22)};
const sofa=(x,y)=>{D(x,y,58,26,(g)=>{const c=['#2c5d73','#3f86a3','#6bb4cf'];box(g,1,2,56,12,c);box(g,1,10,8,15,c);box(g,49,10,8,15,c);box(g,8,12,42,12,['#356f88','#4f9ab8','#7cc4dc']);R(g,28,12,1,12,'#2c5d73');box(g,11,5,9,7,['#d9824f','#f0a870','#ffd0a0']);box(g,38,5,9,7,['#e8b84a','#ffd76a','#fff0b0'])});sh(x,y,56)};
const coffeeTable=(x,y)=>{D(x,y,30,14,(g)=>{box(g,1,1,28,8,['#5a3a24','#8a5a36','#b07a4a']);R(g,3,9,2,4,'#3a2416');R(g,25,9,2,4,'#3a2416');box(g,5,3,4,3,['#ddd','#fff','#fff']);R(g,14,2,8,5,'#d9534f');R(g,15,3,6,1,'#fff')});sh(x,y,26)};
const whiteboard=(x,y)=>{D(x,y,44,34,(g)=>{box(g,1,1,42,24,['#9aa0ac','#f4f6fa','#fff']);let px=4,py=18;g.fillStyle='#d9534f';for(let i=0;i<9;i++){const ny=18-i*1.4-(i%3==1?3:0);for(let t=0;t<4;t++)P(g,px+t,py+(ny-py)*t/4,'#3d7ec9');px+=4;py=ny}
  for(let i=0;i<5;i++)R(g,24+i*3,20-(i*5%11),2,(i*5%11)+2,i%2?'#5cb85c':'#d9534f');R(g,4,4,14,1,'#2a2a30');R(g,4,7,9,1,'#888');R(g,8,25,2,8,'#6a6e78');R(g,34,25,2,8,'#6a6e78');R(g,4,25,36,2,'#c8ccd4')});sh(x,y,40)};
const poster=(x,y,k)=>D(x,y,20,18,(g)=>{box(g,1,1,18,16,['#3a2a20','#f4ecd8','#fff']);if(k==0){R(g,3,3,14,12,'#2a3a5a');ell(g,10,7,3,3,'#ffd76a');R(g,3,11,14,4,'#1a2a3a');R(g,5,10,3,2,'#3d7ec9')}else if(k==1){R(g,3,3,14,12,'#f2e6d0');for(let i=0;i<5;i++)R(g,4+i*3,14-i*2-(i%2),2,i*2+2+(i%2),i%2?'#5cb85c':'#d9534f')}else{R(g,3,3,14,12,'#e8f0ea');ell(g,10,9,5,4,'#5cb85c');P(g,10,9,'#fff');R(g,6,4,8,1,'#2a2a30')}});
const lampArc=(x,y)=>{D(x,y,18,40,(g)=>{ell(g,4,38,3,1,'#2a2a30');R(g,3,10,2,28,'#3a3d48');for(let t=0;t<10;t++)P(g,4+t,10-Math.sin(t/10*Math.PI)*6,'#3a3d48');ell(g,14,10,3,2,'#e8c25a');P(g,14,12,'#fff7c0')},{lamp:1});};
const trading=(x,y)=>{D(x,y,46,30,(g)=>{box(g,1,18,44,11,['#3a3d48','#5a5e6c','#868a98']);for(const xx of[2,24]){box(g,xx,2,20,14,['#15161c','#262833','#3a3d4c']);R(g,xx+1,3,18,12,'#0b1220')}R(g,10,16,4,3,'#262833');R(g,32,16,4,3,'#262833');box(g,14,21,16,4,['#20222a','#34363f','#4a4c56']);box(g,36,21,5,6,['#ddd','#fff','#fff'])},{dyn:'candles'});sh(x,y,44)};
const mug=(x,y,c)=>D(x,y,7,7,(g)=>{box(g,1,2,4,4,[c,c,'#fff']);P(g,5,3,c);P(g,5,4,c);R(g,2,2,2,1,'#5a3a24')});
const books=(x,y)=>D(x,y,10,7,(g)=>{R(g,1,4,8,2,'#3d7ec9');R(g,2,2,7,2,'#d9534f');R(g,1,1,6,1,'#e8b84a')});
const figurine=(x,y,c)=>D(x,y,6,9,(g)=>{R(g,1,6,4,2,'#2a2a30');R(g,2,3,2,3,c);R(g,2,1,2,2,'#ffd8b0')});
const rug2=(x,y,w,h,c)=>{R(b,x,y,w,h,c[0]);R(b,x+2,y+2,w-4,h-4,c[1]);dith(b,x+4,y+4,w-8,h-8,c[2]);for(let k=x+2;k<x+w-2;k+=3){P(b,k,y-1,c[2]);P(b,k,y+h,c[2])}};
// placements (world 768x576); clear of desks/characters/bubbles/TV
rug2(200,494,96,40,['#6b3f4a','#8f5664','#b67888']);rug2(642,150,72,92,['#2f3a55','#3e4d70','#56689a']);
sofa(236,520);coffeeTable(268,540);lampArc(206,525);tallPalm(292,522);
coffeeMachine(500,512);cooler(532,512);printer(372,512);trading(560,540);monstera(470,548);
serverRack(706,236);serverRack(682,236);bookshelf(662,150);cactus(714,150);
whiteboard(258,100);hanging(232,74);cactus(330,80);
poster(140,346,0);poster(162,346,1);poster(750,330,2);monstera(150,300);
const L=(f,lift)=>{const n=PROPS.length;f();for(let i=n;i<PROPS.length;i++)PROPS[i].oy+=lift};
L(()=>{mug(424,190,'#d9534f');books(350,190);figurine(232,262,'#3d7ec9');mug(286,262,'#5cb85c');books(574,262);figurine(232,412,'#e8b84a');mug(426,412,'#e8b84a');figurine(512,412,'#9b59b6');books(560,412)},26);
// sort by y happens each frame in drawWorld
const _dyn=drawPropDyn;const T0=performance.now();
drawPropDyn=function(g,p){_dyn(g,p);if(!p.dyn)return;const t=(performance.now()-T0)/1000,x0=p.x-p.ox,y0=p.y-p.oy;
 if(p.dyn=='leds'){for(let r=0;r<7;r++)for(let k=0;k<3;k++){const on=Math.sin(t*(2+k)+r*1.7+k*3+p.x)>0.2;R(g,x0+14+k*2,y0+6+r*6,1,1,on?(k==2?'#ffb347':'#5dff9a'):'#1d3a24')}}
 else if(p.dyn=='printled'){if(Math.sin(t*3)>0)R(g,x0+21,y0+12,1,1,'#5dff9a')}
 else if(p.dyn=='candles'){for(const sx of[3,25]){const off=Math.floor(t*1.5);let v=7;for(let i=0;i<8;i++){const s=Math.sin((i+off)*1.9+sx)*2.6,up=s>=0;const top=Math.max(4,Math.min(13,v-(up?s:0))),h=Math.max(1,Math.abs(s)|0);R(g,x0+sx+1+i*2,y0+top,1,h+1,up?'#5dff9a':'#ff5a5a');v=Math.max(5,Math.min(12,v-s*.6))}}}
 else if(p.dyn=='steam'){const k=Math.floor(t*4)%3;g.globalAlpha=.5;R(g,x0+10,y0-1-k,1,1,'#fff');R(g,x0+11,y0-3-((k+1)%3),1,1,'#fff');g.globalAlpha=1}};
},'decor');
