'use strict';
// ===== v13 ROMC-style 2.5D layer (original art, drawn in code) =====
const OLR='#3a2438';
function shd(h,f){const n=[1,3,5].map(i=>parseInt(h.substr(i,2),16));return'#'+n.map(v=>Math.max(0,Math.min(255,Math.round(f>1?v+(255-v)*(f-1):v*f))).toString(16).padStart(2,'0')).join('')}
function poly(g,pts,c){g.fillStyle=c;g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.closePath();g.fill()}
// oblique box: front face at (x,y,w,h), depth k receding up-right; base colour auto-shaded
function iso(g,x,y,w,h,k,col,top){const ky=Math.round(k*.6),T=top||shd(col,1.25),S=shd(col,.72);
  poly(g,[x,y,x+k,y-ky,x+w+k,y-ky,x+w,y],T);R(g,x,y,w,h,col);poly(g,[x+w,y,x+w+k,y-ky,x+w+k,y-ky+h,x+w,y+h],S);
  R(g,x,y,w,1,shd(T,1.2));R(g,x,y+h-1,w,1,shd(col,.8));g.globalAlpha=.25;poly(g,[x+1,y-1,x+k,y-ky+1,x+k+4,y-ky+1,x+5,y-1],'#fff');g.globalAlpha=1}
function P2(x,y,w,h,ox,oy,draw,extra){const[c,g]=mk(w,h);draw(g,w,h);outline(c,OLR);PROPS.push(Object.assign({x,y,c,ox,oy},extra||{}))}
function star(g,x,y,s,c){R(g,x-s,y,s*2+1,1,c);R(g,x,y-s,1,s*2+1,c);P(g,x,y,'#fff')}

// ---------- floor & walls ----------
function diaFloor(x0,y0,x1,y1,c1,c2,ln){b.save();b.beginPath();b.rect(x0,y0,x1-x0,y1-y0);b.clip();R(b,x0,y0,x1-x0,y1-y0,c1);
  let j=0;for(let y=y0-8;y<y1+8;y+=8,j++)for(let x=x0-32+(j%2?16:0);x<x1+32;x+=32){const v=rnd();const c=v<.5?c1:v<.85?c2:shd(c2,.95);
    poly(b,[x,y-8,x+16,y,x,y+8,x-16,y],c);b.fillStyle=ln;R(b,x-15,y,1,1,ln);for(let i=0;i<16;i++){P(b,x-16+i,y-Math.floor(i/2),ln)}P(b,x,y-8,shd(c,1.15));for(let i=1;i<8;i++)P(b,x+i*2-1,y-8+i,shd(c,1.08))}
  // soft angle light
  const gr=b.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,'rgba(255,250,230,.18)');gr.addColorStop(1,'rgba(80,40,90,.12)');b.fillStyle=gr;b.fillRect(x0,y0,x1-x0,y1-y0);b.restore()}
function wallR(){// back wall: plaster + timber, with thickness
  const wg=b.createLinearGradient(0,0,0,58);wg.addColorStop(0,'#fbefd8');wg.addColorStop(1,'#efdcb8');b.fillStyle=wg;b.fillRect(0,0,W,58);
  for(let i=0;i<260;i++){P(b,rnd()*W,rnd()*56,'#e6d0a8')}
  R(b,0,0,W,6,'#8a5a36');R(b,0,0,W,1,'#b07a4c');R(b,0,6,W,2,'#5e3a22');
  for(let x=0;x<=W;x+=96){R(b,x-4,6,8,50,'#8a5a36');R(b,x-4,6,2,50,'#b07a4c');R(b,x+3,6,1,50,'#5e3a22')}
  for(let x=48;x<W;x+=96){for(let i=0;i<14;i++){P(b,x-14+i,22+i,'#9a6a44');P(b,x+14-i,22+i,'#9a6a44')}}
  // wainscot
  R(b,0,38,W,18,'#c08a5a');for(let x=0;x<W;x+=24){R(b,x+2,41,20,13,'#a8744a');R(b,x+2,41,20,1,'#d8a878')}R(b,0,38,W,2,'#e0b080');
  // baseboard with top lip (depth)
  R(b,0,56,W,4,'#f0c890');R(b,0,60,W,10,'#7a4a2c');R(b,0,60,W,1,'#a8703f');R(b,0,70,W,2,'#4a2a18');
  for(let i=0;i<10;i++)R(b,0,72+i,W,1,`rgba(60,30,50,${.28-i*.028})`);
  // pantry shelf with jars on wall
  for(const sx of[8,96]){R(b,sx,22,70,3,'#8a5a36');R(b,sx,25,70,2,'#5e3a22');for(let i=0;i<6;i++){const c=['#ff7a9a','#7ab8ff','#ffd24a','#8ae0a0','#c49aff','#ff9a5a'][i];ell(b,sx+7+i*11,17,4,4,c);R(b,sx+5+i*11,10,4,3,shd(c,.7));P(b,sx+5+i*11,15,'#fff')}}
  // banners
  for(const[x,c]of[[440,'#4a78d0'],[752,'#d04a6a'],[186,'#4a78d0']]){if(x==186)continue;R(b,x-10,4,20,2,'#c8962e');R(b,x-8,6,16,26,c);poly(b,[x-8,32,x+8,32,x,40],c);R(b,x-8,6,2,26,shd(c,1.3));R(b,x-3,13,6,6,'#ffd24a');P(b,x,15,'#fff');R(b,x-8,28,16,1,'#ffd24a')}
  // TV frame (wooden, gold trim)
  box(b,470,10,96,42,['#4a2a18','#6b3f24','#c8962e','#ffe08a']);R(b,474,14,88,34,'#0a0e18');
}
function wallSeg(x,y0,y1){// low iso partition wall with top + side faces
  R(b,x+10,y0+4,6,y1-y0,'rgba(60,30,50,.25)');R(b,x,y0-6,10,y1-y0+6,'#b07a4c');R(b,x+1,y0-6,8,y1-y0,'#e8c08a');R(b,x+8,y0-6,2,y1-y0+6,'#7a4a2c');
  for(let y=y0;y<y1;y+=24)R(b,x+1,y,8,2,'#c8962e');R(b,x,y1-6,10,8,'#8a5a36');R(b,x,y1-6,10,1,'#c08a5a')}
buildBG=function(){_s=11;R(b,0,0,W,H,'#2a1a20');
  diaFloor(184,72,604,300,'#f0d4a0','#e6c38a','#c99e64');diaFloor(184,316,604,H,'#f0d4a0','#e6c38a','#c99e64');
  diaFloor(0,72,184,300,'#e4e0f0','#d4cee6','#a9a2c4');diaFloor(0,316,184,H,'#cfe2f6','#bdd4ee','#8eaed4');
  diaFloor(604,72,W,H,'#d6efe0','#c4e4d0','#94c4a8');diaFloor(0,300,W,316,'#d8b080','#c89c6a','#9a7048');
  // rugs (diamond pattern woven)
  const rugD=(x,y,w,h,o,i)=>{R(b,x-2,y-2,w+4,h+4,OLR);R(b,x,y,w,h,o);R(b,x+3,y+3,w-6,h-6,i);b.save();b.beginPath();b.rect(x+3,y+3,w-6,h-6);b.clip();for(let yy=y;yy<y+h;yy+=10)for(let xx=x+((yy-y)/10%2)*10;xx<x+w;xx+=20)poly(b,[xx,yy-4,xx+5,yy,xx,yy+4,xx-5,yy],shd(i,1.15));b.restore();for(let k=x;k<x+w;k+=3){P(b,k,y-3,o);P(b,k,y+h+2,o)}};
  rugD(250,440,290,36,'#c84a5a','#f4b8a0');rugD(630,330,124,90,'#4a8ac8','#cfe8ff');rugD(20,370,150,80,'#c8962e','#fff0c8');
  wallR();
  for(const[x,y,w,h]of WINS){fg.fillStyle='#6b3f24';fg.fillRect(x-4,y-4,w+8,4);fg.fillRect(x-4,y+h,w+8,4);fg.fillRect(x-4,y,4,h);fg.fillRect(x+w,y,4,h);
    fg.fillStyle='#6b3f24';for(let k=x+w/(w>150?4:2);k<x+w-2;k+=w/(w>150?4:2))fg.fillRect(k-1,y,3,h);fg.fillRect(x,y+h/2-1,w,2);fg.fillStyle='#ffd24a';fg.fillRect(x-4,y-4,w+8,1);
    fg.fillStyle='#ffffff22';for(let k=0;k<h;k++)fg.fillRect(x+8+k*.6,y+k,3,1);box(b,x-8,y+h+3,w+16,5,['#5e3a22','#8a5a36','#c08a5a','#ffe08a']);
    for(const cx of[x-14,x+w+4]){fg.fillStyle='#8ab0f0';fg.fillRect(cx,y-6,10,h+12);fg.fillStyle='#6a8ad0';for(let k=cx+2;k<cx+10;k+=3)fg.fillRect(k,y-6,1,h+12);fg.fillStyle='#d4e4ff';fg.fillRect(cx,y-6,2,h+12);fg.fillStyle='#ffd24a';fg.fillRect(cx,y+h/2,10,2)}
    fg.fillStyle='#c8962e';fg.fillRect(x-18,y-8,w+36,2)}
  wallSeg(180,72,284);wallSeg(600,72,284);wallSeg(180,330,H);
  buildWC()};

// ---------- props ----------
function deskR(left,bottom,w,who){const k=18,CHh=62,y=47,x=2,col=CH[who].col;const[c,g]=mk(w+k+6,CHh);
  iso(g,x,y,w,12,k,'#b9844f','#ecc892');for(let i=8;i<w;i+=16)R(g,x+i+6,y-6,8,1,'#d8ac72');
  const n=w>76?3:2,dw=(w-10)/n;for(let i=0;i<n;i++){const dx=x+5+i*dw;R(g,dx,y+3,dw-4,7,'#94643a');R(g,dx+(dw-4)/2-2,y+6,4,1,'#ffd24a')}
  R(g,x+w/2-7,y,14,9,col);poly(g,[x+w/2-7,y+9,x+w/2+7,y+9,x+w/2,y+13],col);R(g,x+w/2-2,y+3,4,3,'#ffe08a');
  const mon=(mx,my)=>{iso(g,mx,my-12,15,11,4,'#5a5470');R(g,mx+2,my-10,11,7,'#46405a');R(g,mx-1,my-13,17,1,{David:'#9ad0ff',Kim:'#7fe0ff',Jane:'#8affb0',Alex:'#ffd08a',Jhon:'#ff9a9a',Su:'#c8a8ff'}[who]);R(g,mx+6,my-1,3,3,'#8a849a')};
  mon(x+5,y-3);mon(x+w-21,y-3);
  const cx=x+w/2;
  if(who=='David'){R(g,cx-8,y-6,12,4,'#fff8e8');R(g,cx-2,y-6,1,4,'#c8b090');R(g,cx+6,y-10,2,7,'#fff');P(g,cx+7,y-11,'#4a78d0');R(g,cx-14,y-8,4,4,'#ffd24a')}
  if(who=='Kim'){ell(g,cx,y-8,5,5,'#a8e0ff');ell(g,cx-1,y-9,2,2,'#fff');R(g,cx-4,y-4,9,2,'#c8962e')}
  if(who=='Jane'){R(g,cx-9,y-7,16,5,'#fff4dc');for(let i=0;i<6;i++)R(g,cx-7+i*2,y-4-((i*7)%4),1,1+((i*7)%4),i%2?'#3fbf6a':'#e84a5a')}
  if(who=='Alex'){R(g,cx-9,y-7,18,5,'#f0d8a0');R(g,cx-6,y-6,6,1,'#c84a3a');R(g,cx+1,y-5,5,1,'#4a78d0')}
  if(who=='Jhon'){R(g,cx-5,y-12,10,9,'#8a94b0');R(g,cx-4,y-11,8,7,'#c0c8dc');R(g,cx-1,y-10,2,5,'#d04a5a')}
  if(who=='Su'){for(let i=0;i<3;i++)R(g,cx-8,y-5-i*3,12,3,['#c49aff','#7ab8ff','#ff9aaa'][i]);R(g,cx+6,y-10,2,6,'#fff8e0');P(g,cx+6,y-12,'#ffb040');P(g,cx+7,y-11,'#ffe080')}
  outline(c,OLR);PROPS.push({x:left,y:bottom,c,ox:2,oy:CHh})}
function chairR(x,y,col){P2(x,y,24,30,11,28,(g)=>{iso(g,4,19,13,4,6,'#8a5a36');R(g,5,24,2,4,'#5e3a22');R(g,14,24,2,4,'#5e3a22');iso(g,7,3,10,13,4,col);R(g,9,5,6,1,shd(col,1.4))})}
function plantR(x,y,k){P2(x,y,30,44,15,42,(g)=>{const leaf=[['#3f9a62','#5cc07a','#9ae8a8'],['#4a9a8a','#6ac4b0','#b0f0dc'],['#5aa05a','#7ac87a','#c4f0a0']][k];
  for(let i=0;i<34;i++){const a=rnd()*6.28,r=Math.sqrt(rnd())*10;ell(g,15+Math.cos(a)*r,18+Math.sin(a)*r*.8,3,2,leaf[Math.sin(a)>.2?0:Math.cos(a)<-.3?2:1])}
  if(k==2)for(let i=0;i<5;i++){const fx=7+rnd()*16,fy=10+rnd()*12;R(g,fx,fy,3,3,'#ff9ac8');P(g,fx+1,fy+1,'#fff4b0')}
  const pc=['#e0905a','#7ab8e0','#e8b0d0'][k];iso(g,8,30,12,10,5,pc);R(g,8,33,12,1,shd(pc,1.3))})}
function lanternR(x,y){P2(x,y,20,56,10,54,(g)=>{R(g,9,16,2,36,'#5e3a22');P(g,9,16,'#a8703f');ell(g,10,52,6,2,'#4a2a18');R(g,5,6,10,11,'#8a5a36');R(g,6,7,8,9,'#ffd890');R(g,7,8,6,7,'#fff4c8');R(g,4,4,12,2,'#c8962e');R(g,8,2,4,2,'#c8962e');R(g,4,17,12,1,'#c8962e')},{lamp:1})}
buildProps=function(){_s=7;
  deskR(344,190,84,'David');deskR(222,262,70,'Kim');deskR(512,262,70,'Jane');deskR(222,412,70,'Alex');deskR(362,412,70,'Jhon');deskR(502,412,70,'Su');
  for(const[x,y,n]of[[386,160,'David'],[257,232,'Kim'],[547,232,'Jane'],[257,382,'Alex'],[397,382,'Jhon'],[537,382,'Su']])chairR(x,y,CH[n].col);
  // tavern counter
  P2(0,94,190,54,0,54,(g)=>{iso(g,1,30,172,20,10,'#a8693c','#e8c08a');for(let x=6;x<168;x+=28){R(g,x,34,24,13,'#8a5530');R(g,x+10,40,4,2,'#ffd24a')}
    iso(g,30,10,20,18,5,'#7a8aa8');R(g,33,13,14,6,'#c8962e');R(g,36,20,8,6,'#2a1a20');ell(g,40,24,3,2,'#fff');P(g,46,12,'#ff6a8a');
    for(let i=0;i<5;i++){const cc=['#ff5a7a','#5aa0ff','#ffd24a','#7ae0a0','#c49aff'][i];ell(g,68+i*12,22,4,4,cc);R(g,66+i*12,14,4,4,shd(cc,.7));R(g,67+i*12,12,2,2,'#c8a070');P(g,66+i*12,20,'#fff')}
    ell(g,140,22,10,4,'#c8964e');for(let i=0;i<4;i++)ell(g,134+i*4,19,3,2,'#f0c070')});
  // potion cabinet
  P2(146,118,34,66,0,66,(g)=>{iso(g,1,10,24,54,7,'#8a5a36','#c08a5a');for(let s=0;s<4;s++){const sy=14+s*12;R(g,3,sy,20,10,'#4a2a18');for(let i=0;i<4;i++){const cc=['#ff5a7a','#5aa0ff','#ffd24a','#7ae0a0','#c49aff'][(i+s)%5];ell(g,6+i*5,sy+7,2,2,cc);R(g,5+i*5,sy+3,2,2,shd(cc,.8));P(g,5+i*5,sy+6,'#fff')}}},{spark:1});
  // barrel water
  P2(120,142,24,40,10,40,(g)=>{ell(g,11,8,9,4,'#c08a5a');R(g,2,8,18,28,'#a8693c');ell(g,11,36,9,3,'#8a5530');R(g,2,14,18,2,'#5e3a22');R(g,2,28,18,2,'#5e3a22');R(g,4,8,2,28,'#c8864e');ell(g,11,8,7,2,'#6ac0f0');R(g,9,20,4,3,'#c8962e')});
  // round table + stools
  P2(96,214,54,32,26,24,(g)=>{ell(g,26,13,24,9,'#8a5530');ell(g,26,10,24,9,'#e8c08a');ell(g,22,8,12,3,'#f8dcaa');R(g,24,19,4,9,'#5e3a22');R(g,18,27,16,2,'#4a2a18');ell(g,14,8,3,2,'#fff');R(g,30,5,6,5,'#ff7a9a');P(g,32,4,'#fff')});
  for(const sx of[60,132])P2(sx,220,18,18,9,16,(g)=>{ell(g,9,7,7,4,'#8a5530');ell(g,9,5,7,4,'#ff9ab0');R(g,8,9,2,7,'#5e3a22')});
  // meeting table + quest board
  P2(110,410,104,44,48,38,(g)=>{iso(g,2,20,90,10,14,'#8a5a36','#d8a878');R(g,6,30,4,8,'#4a2a18');R(g,82,30,4,8,'#4a2a18');R(g,22,12,12,6,'#fff4dc');R(g,58,11,14,6,'#f0d8a0');R(g,60,13,8,1,'#c84a3a');ell(g,46,12,4,3,'#a8e0ff')});
  for(const[x,y]of[[78,384],[110,384],[142,384]])chairR(x,y,'#7ab8ff');
  P2(46,356,66,48,32,48,(g)=>{iso(g,2,2,58,32,4,'#8a5a36');R(g,5,5,52,26,'#d8a870');dith(g,5,5,52,26,'#c8965e');
    for(let i=0;i<6;i++){const nx=8+(i%3)*16,ny=7+((i/3)|0)*12;R(g,nx,ny,12,9,['#fff8e0','#ffe0ea','#e0f0ff'][i%3]);R(g,nx+2,ny+3,8,1,'#a89878');R(g,nx+2,ny+5,6,1,'#a89878');P(g,nx+5,ny,'#e84a4a')}R(g,6,34,2,12,'#5e3a22');R(g,54,34,2,12,'#5e3a22')});
  // bookshelves
  for(const bx of[622,664])P2(bx,104,46,76,0,76,(g)=>{iso(g,1,8,36,66,7,'#6b3f24','#a8703f');for(let s=0;s<4;s++){const sy=11+s*16;R(g,3,sy,32,14,'#3a2214');let x=4;while(x<33){const w=3+((rnd()*2)|0),h=9+((rnd()*4)|0),cc=pick(['#d04a5a','#4a78d0','#3fa06a','#e0a828','#9a6ad0','#f08aa8']);R(g,x,sy+14-h,w,h,cc);R(g,x,sy+14-h,1,h,shd(cc,1.3));x+=w+1}}});
  // magic crystal on pedestal
  P2(742,140,30,64,15,64,(g)=>{iso(g,5,46,16,14,5,'#9aa0c0');R(g,6,48,14,2,'#c8962e');poly(g,[13,8,21,26,13,44,5,26],'#8ad0ff');poly(g,[13,8,21,26,13,26],'#c8ecff');poly(g,[13,26,21,26,13,44],'#5aa0e0');R(g,10,16,2,6,'#fff')},{spark:1,crystal:1});
  // sofa, coffee table, chest, aquarium
  P2(690,392,116,44,56,40,(g)=>{const c='#7ab8e0';iso(g,4,10,100,12,8,shd(c,.9));iso(g,0,22,14,16,6,c);iso(g,100,22,14,16,6,c);iso(g,14,26,86,12,6,c);R(g,15,22,40,3,shd(c,1.3));R(g,58,22,40,3,shd(c,1.3));iso(g,20,12,14,10,3,'#ffd24a');iso(g,80,12,14,10,3,'#ff9ab8')});
  P2(690,440,44,18,20,14,(g)=>{iso(g,3,8,32,4,6,'#8a5a36','#e0b480');R(g,5,12,2,4,'#4a2a18');R(g,31,12,2,4,'#4a2a18');R(g,10,3,6,4,'#fff');ell(g,26,5,3,2,'#7ae0a0')});
  P2(690,478,70,38,35,34,(g)=>{iso(g,10,16,44,16,8,'#a8693c');poly(g,[10,16,18,11,62,11,54,16],'#c8864e');R(g,10,22,44,2,'#c8962e');R(g,30,20,5,6,'#ffd24a');R(g,10,16,2,16,'#c8962e');R(g,52,16,2,16,'#c8962e')},{spark:1});
  P2(730,300,42,38,18,34,(g)=>{iso(g,2,8,32,18,6,'#8ad8f0','#cff4ff');dith(g,3,16,30,9,'#5ab0d8');R(g,8,14,4,2,'#ff8a5a');R(g,20,19,4,2,'#ffd24a');R(g,14,20,2,5,'#3f9a62');iso(g,2,26,32,6,6,'#8a5a36')});
  // drink stand + bench
  P2(330,540,34,56,15,52,(g)=>{iso(g,2,8,24,42,6,'#d04a6a');R(g,5,12,14,26,'#fff4e8');for(let i=0;i<3;i++)for(let j=0;j<3;j++){const cc=['#ff5a7a','#5aa0ff','#ffd24a'][(i+j)%3];R(g,6+i*4,14+j*8,3,6,cc);P(g,6+i*4,14+j*8,'#fff')}R(g,20,16,3,8,'#ffd24a');R(g,5,42,16,5,'#4a2a18')});
  P2(420,560,64,22,30,18,(g)=>{iso(g,2,8,56,4,6,'#a8693c','#e0b480');R(g,6,12,3,6,'#5e3a22');R(g,51,12,3,6,'#5e3a22')});
  // crates & barrels décor
  P2(588,560,30,30,15,28,(g)=>{iso(g,2,10,18,16,6,'#c08a5a');R(g,2,17,18,1,'#8a5530');R(g,10,10,1,16,'#8a5530')});
  P2(760,566,22,30,11,28,(g)=>{ell(g,10,6,8,3,'#c08a5a');R(g,2,6,16,20,'#a8693c');R(g,2,11,16,2,'#5e3a22');R(g,2,20,16,2,'#5e3a22');R(g,4,6,2,20,'#c8864e')});
  for(const[x,y,k]of[[200,96,1],[586,96,0],[166,282,0],[620,284,2],[200,470,2],[588,470,1],[316,470,0],[476,470,2],[16,300,1],[12,470,0],[756,470,2],[240,566,1],[560,566,0],[700,566,2],[608,104,0]])plantR(x,y,k%3);
  for(const[x,y]of[[312,150],[470,226],[214,170],[640,240],[28,360],[470,330]])lanternR(x,y)};

// ---------- chibi characters ----------
const JOB={David:'Guild Master',Kim:'Scout · News',Jane:'Sage · Picker',Alex:'Hunter · Chart',Jhon:'Knight · Risk',Su:'Scholar · Log'};
charSprite=function(n,dir,f,pose,blink){const key='r'+n+dir+f+pose+(blink?1:0);if(SPR[key])return SPR[key];
  const p=CH[n],flip=dir==2;if(flip)dir=3;const[c,g]=mk(26,40);const r=(x,y,w,h,col)=>R(g,x,y,w,h,col);
  const S=p.skin,HR=p.hair,TP=p.top,PN=p.pants,SH=p.shoe,A=p.accent,side=dir==3,back=dir==1,eyeC=p.col;
  const sitting=pose=='sit'||pose=='couch';const bob=pose=='walk'?(f%2?-1:0):(!sitting&&f==2?1:0);
  // cape / long hair behind body
  if(n=='David')r(side?6:7,22+bob,side?10:13,11,A[1]);
  if(p.style=='long')side?ell(g,9,19+bob,6,8,HR[1]):ell(g,13,19+bob,10,8,HR[1]);
  // legs
  if(sitting){r(9,32,8,2,PN[1]);r(9,34,3,2,SH[1]);r(14,34,3,2,SH[1])}
  else{const a=pose=='walk'?[0,1,0,-1][f]:0;if(side){r(10+a,32,3,4,PN[1]);r(13-a,32,3,4,PN[0]);r(10+a,35,5,2,SH[1]);r(13-a,35,5,2,SH[0])}
    else{r(9,32,3,4-(a>0?1:0),PN[1]);r(14,32,3,4-(a<0?1:0),PN[1]);r(8,36-(a>0?1:0),4,2,SH[1]);r(14,36-(a<0?1:0),4,2,SH[1])}}
  // body tunic
  const by=21+bob;r(9,by,9,11,TP[1]);r(8,by+5,11,6,TP[1]);r(8,by+10,11,1,TP[0]);r(9,by,9,1,TP[2]);r(16,by+1,2,10,TP[0]);r(8,by+7,11,1,A[1]);
  if(!back&&!side){r(11,by,5,2,'#fff8f0');P(g,13,by+2,A[2]);if(n=='Jhon'){r(10,by+2,7,5,'#c0c8dc');r(13,by+3,1,3,'#d04a5a')}}
  // arms
  const sw=pose=='walk'?[0,1,0,-1][f]:0;const hand=(x,y)=>{r(x,y,3,2,S[1])};
  if(pose=='sit'||pose=='play'){r(7,by+2,2,4,TP[0]);r(18,by+2,2,4,TP[0]);hand(9+(f%2),by+6);hand(15-(f%2),by+6)}
  else if(side){r(12,by+1+sw,3,6,TP[0]);hand(12,by+7+sw)}
  else if(pose=='wave'){r(6,by+1,3,6,TP[0]);hand(6,by+7);r(18,by-4-(f%2),3,6,TP[1]);hand(18,by-6-(f%2))}
  else if(pose=='sip'){r(6,by+1,3,6,TP[0]);hand(6,by+7);r(17,by+1,3,4,TP[1]);r(16,by-2,4,4,'#fff');r(16,by-2,4,1,'#8a4a2a')}
  else{r(6,by+1+sw,3,6,TP[0]);hand(6,by+7+sw);r(18,by+1-sw,3,6,TP[0]);hand(18,by+7-sw)}
  // head
  const hy=bob;ell(g,13,12+hy,10,9,S[1]);r(5,18+hy,16,1,S[0]);ell(g,10,10+hy,4,3,S[2]);
  if(back){ell(g,13,11+hy,11,10,HR[1]);ell(g,11,7+hy,6,3,HR[2]);r(7,5+hy,4,1,HR[3])}
  else if(side){ell(g,11,8+hy,11,7,HR[1]);r(2,8+hy,9,11,HR[1]);r(2,8+hy,2,11,HR[0]);for(let x=12;x<23;x+=3)r(x,9+hy,3,2+((x/3)%2)*2,HR[1]);r(7,3+hy,6,1,HR[3]);
    if(p.style=='long')r(2,14+hy,6,10,HR[1]);
    if(blink)r(17,15+hy,3,1,'#2a1a2a');else{r(17,12+hy,3,5,'#2a1a3a');r(17,14+hy,3,2,eyeC);r(17,12+hy,2,2,'#fff')}
    r(18,18+hy,2,1,'#ff9aa8');P(g,21,18+hy,'#a04a4a');if(p.glasses){r(16,11+hy,6,1,'#2a2a3a');r(16,11+hy,1,6,'#2a2a3a')}}
  else{ell(g,13,8+hy,11,7,HR[1]);for(let x=3;x<23;x+=3)r(x,9+hy,3,2+((x/3)%2)*2,HR[1]);r(2,9+hy,3,9,HR[1]);r(21,9+hy,3,9,HR[1]);r(2,9+hy,1,9,HR[0]);r(8,3+hy,6,1,HR[3]);r(6,4+hy,2,1,HR[2]);
    if(p.style=='long'){r(1,12+hy,4,12,HR[1]);r(21,12+hy,4,12,HR[1])}
    for(const ex of[7,15]){if(blink)r(ex,15+hy,4,1,'#2a1a2a');else{r(ex,12+hy,4,5,'#2a1a3a');r(ex,14+hy,4,2,eyeC);r(ex,16+hy,4,1,shd(eyeC,.6));r(ex,12+hy,2,2,'#fff');P(g,ex+3,15+hy,'#fff')}}
    r(4,18+hy,3,1,'#ff9aa8');r(19,18+hy,3,1,'#ff9aa8');r(12,19+hy,2,1,'#a04a4a');
    if(p.glasses){g.fillStyle='#2a2a3a';for(const ex of[6,14]){r(ex,11+hy,6,1,'#2a2a3a');r(ex,17+hy,6,1,'#2a2a3a');r(ex,11+hy,1,7,'#2a2a3a');r(ex+5,11+hy,1,7,'#2a2a3a')}r(12,13+hy,2,1,'#2a2a3a')}}
  // job accessories
  if(n=='David'){r(8,3+hy,10,2,'#ffd24a');P(g,13,2+hy,'#ff4a6a');P(g,9,2+hy,'#ffd24a');P(g,17,2+hy,'#ffd24a')}
  if(n=='Kim'&&!back){r(1,10+hy,3,6,'#3a3850');r(22,10+hy,3,6,'#3a3850');r(3,2+hy,20,1,'#3a3850');P(g,2,11+hy,'#7ae0a0')}
  if(n=='Jane'){r(16,1+hy,7,4,'#ff6aa0');r(18,2+hy,3,2,'#ffc0d8')}
  if(n=='Alex')r(3,6+hy,20,2,'#e8503a');
  if(n=='Su'){r(2,4+hy,22,2,'#5a3a8a');r(7,1+hy,12,3,'#6a44a0');r(10,0,7,2,'#6a44a0');r(16,0,4,1,'#6a44a0');r(8,3+hy,10,1,'#ffd24a')}
  outline(c,OLR);
  if(flip){const[c2,g2]=mk(26,40);g2.translate(26,0);g2.scale(-1,1);g2.drawImage(c,0,0);return SPR[key]=c2}return SPR[key]=c};

// ---------- golden retriever (replaces cat) ----------
catFrame=function(f,dir,sleep){const[c,g]=mk(24,18);const B='#e8a850',D='#b8742e',L='#ffd890',N='#2a1a1a';
  const wag=Math.round(Math.sin(time*14)*2);
  if(sleep){ell(g,12,13,9,4,B);ell(g,11,11,6,2,L);ell(g,19,12,4,3,B);R(g,17,11,3,4,D);R(g,20,12,2,1,N);P(g,22,13,N);R(g,3,13,4,2,L)}
  else{const a=f%2;// tail
    R(g,1,6+wag,2,2,L);R(g,2,7+Math.round(wag/2),3,2,B);
    ell(g,10,10,7,4,B);ell(g,10,9,5,2,L);R(g,4,13,2,4-a,D);R(g,7,13,2,3+a,B);R(g,12,13,2,4-a,D);R(g,15,13,2,3+a,B);
    ell(g,18,7,5,5,B);ell(g,17,5,3,2,L);R(g,14,5,3,6,D);ell(g,22,9,2,2,L);P(g,23,8,N);R(g,18,6,2,2,N);P(g,18,6,'#fff');R(g,20,11,2,1,'#ff7a8a')}
  outline(c,OLR);if(dir<0){const[c2,g2]=mk(24,18);g2.translate(24,0);g2.scale(-1,1);g2.drawImage(c,0,0);return c2}return c};
catSpr=function(f,d,s){return catFrame(f,d,s)};// tail wags every frame
{const _u=updCat;let fol=null,ft=0;updCat=function(dt){ft-=dt;if(ft<0){ft=8+Math.random()*8;fol=Math.random()<.4?bots[(Math.random()*bots.length)|0]:null;if(fol){CAT.sleep=0}}
  if(fol&&!fol.hidden){CAT.tx=fol.x-14;CAT.ty=fol.y+6;CAT.t=1}_u(dt);catProp.ox=12;catProp.oy=16}}
// ---------- emotes ----------
drawEmote=function(g,bt){const e=bt.emote,sc=Math.min(1,e.t*6),bob=Math.round(Math.sin(e.t*8)),x=Math.round(bt.x),y=Math.round(bt.y-50+bob-(1-sc)*4);
  if(e.t>2.6&&Math.floor(e.t*10)%2)return;R(g,x-8,y-7,17,13,OLR);R(g,x-7,y-8,15,15,OLR);R(g,x-7,y-6,15,11,'#fff');R(g,x-6,y-7,13,13,'#fff');R(g,x-6,y+3,13,2,'#e0e8f8');R(g,x-1,y+7,3,2,'#fff');P(g,x,y+9,OLR);
  const k=e.k;
  if(k=='!'){R(g,x,y-5,2,6,'#e84a4a');R(g,x,y+2,2,2,'#e84a4a')}
  else if(k=='?'){R(g,x-2,y-5,5,1,'#4a78d0');R(g,x+2,y-4,1,3,'#4a78d0');R(g,x,y-1,2,2,'#4a78d0');R(g,x,y+2,2,1,'#4a78d0')}
  else if(k=='♥'){R(g,x-4,y-4,3,2,'#ff4a7a');R(g,x+2,y-4,3,2,'#ff4a7a');R(g,x-5,y-3,11,3,'#ff4a7a');R(g,x-3,y,7,2,'#ff4a7a');R(g,x-1,y+2,3,1,'#ff4a7a');P(g,x-3,y-3,'#fff')}
  else if(k=='♪'){R(g,x+1,y-5,1,7,'#8a5ad0');R(g,x+1,y-5,4,1,'#8a5ad0');R(g,x-2,y+1,4,3,'#8a5ad0')}
  else if(k=='✦'){star(g,x,y-1,4,'#ffc83a')}
  else{for(let i=0;i<3;i++)R(g,x-5+i*4,y,2,2,i<=((e.t*3)|0)%3?'#4a78d0':'#c0cce8')}};
setInterval(()=>{const vis=bots.filter(b=>!b.hidden&&!b.emote);if(!vis.length)return;const bt=vis[(Math.random()*vis.length)|0];bt.emote={k:['♥','...','!','♪','✦','?','...'][(Math.random()*7)|0],t:0}},3500);

// ---------- sparkles ----------
const _dw13=drawWorld;drawWorld=function(){_dw13();const g=wx;
  for(const p of PROPS){if(!p.spark)continue;for(let i=0;i<3;i++){const ph=time*1.6+i*2.1+p.x;const a=Math.max(0,Math.sin(ph));if(a<.2)continue;const sx=p.x-p.ox+((i*13+p.x)%p.c.width),sy=p.y-p.oy+((i*17)%Math.max(8,p.c.height-10));g.globalAlpha=a;star(g,sx,sy,a>.8?2:1,i%2?'#fff4b0':'#c8f0ff')}}
  // dog sparkle
  if(Math.sin(time*2.3)>.6){g.globalAlpha=.8;star(g,CAT.x+8,CAT.y-18,1,'#fff')}g.globalAlpha=1};

// ---------- rebuild scene with ROMC art ----------
(function(){PROPS.length=0;safe(buildBG,'bg13');safe(buildProps,'props13');PROPS.push(catProp);for(const k in CATSPR)delete CATSPR[k];
  for(const p of PROPS){if(p.c.width>4&&p!==catProp)softShadow(b,p.x-p.ox+p.c.width/2,p.y-2,p.c.width*.45,4,.28)}
  for(const k in SPR)delete SPR[k];
  safe(()=>{document.querySelectorAll('.mav').forEach(c=>drawAv(c,c.dataset.n));drawAv($('meav'),'David');drawAv($('meav2'),'David')},'av13');
  for(const n in tags){tags[n].innerHTML=`<b>${n}</b><i>${JOB[n]}</i>`;tags[n].style.color='';tags[n]._w=0}
  for(const bt of bots)bt.emote={k:'✦',t:Math.random()}})();
placeBoard=function(){const B=$('board');const p=toScreen(384,254);const sc=Math.max(.4,Math.min(2.2,cam.z/1.7));const w=B._w||(B._w=B.offsetWidth),h=B._h||(B._h=B.offsetHeight);B.style.transform=`translate(${(p.x-w/2)|0}px,${(p.y-h)|0}px) scale(${sc.toFixed(3)})`};
