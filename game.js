'use strict';
// ================= MAP =================
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const [world,wx]=mk(W,H),[bg,b]=mk(W,H),[frames,fg]=mk(W,H),[city,cg]=mk(W,60),[city2,cg2]=mk(W,60);
const WINS=[[196,8,224,46],[620,8,116,46]];
function planks(x0,y0,x1,y1,ramp){for(let y=y0;y<y1;y+=8){const off=((y-y0)/8%3)*11;for(let x=x0-off;x<x1;x+=34){const r=rnd(),c=r<.33?ramp[1]:r<.66?ramp[2]:ramp[1];
  const xa=Math.max(x,x0),xb=Math.min(x+34,x1);R(b,xa,y,xb-xa,8,c);R(b,xa,y,xb-xa,1,ramp[3]);R(b,xa,y+7,xb-xa,1,ramp[0]);if(x>=x0)R(b,x,y,1,8,ramp[0]);
  if(rnd()<.4){const k=xa+4+rnd()*20;R(b,k,y+3,4,1,ramp[0]);P(b,k+1,y+4,ramp[0])}if(rnd()<.5)dith(b,xa+2,y+2,Math.min(8,xb-xa-2),3,ramp[3],1)}}}
function tiles(x0,y0,x1,y1,a,c){for(let y=y0;y<y1;y+=12)for(let x=x0;x<x1;x+=12){const k=((x-x0)/12+(y-y0)/12)%2;const r=k?a:c;R(b,x,y,12,12,r[1]);R(b,x,y,12,1,r[2]);R(b,x,y,1,12,r[2]);R(b,x+11,y,1,12,r[0]);R(b,x,y+11,12,1,r[0]);P(b,x+2,y+2,r[3]);if(rnd()<.2)dith(b,x+3,y+4,5,4,r[0])}}
function carpet(x0,y0,x1,y1,r){R(b,x0,y0,x1-x0,y1-y0,r[1]);for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const v=(x*7+y*13)%23;if(v==0)P(b,x,y,r[2]);else if(v==11)P(b,x,y,r[0])}}
function rug(x,y,w,h,o,i,acc){box(b,x,y,w,h,o);R(b,x+3,y+3,w-6,h-6,i[1]);R(b,x+3,y+3,w-6,1,i[2]);R(b,x+6,y+6,w-12,h-12,o[1]);R(b,x+8,y+8,w-16,h-16,i[1]);dith(b,x+8,y+8,w-16,h-16,i[2]);
  for(let k=x+14;k<x+w-14;k+=14){R(b,k,y+h/2-4,8,8,acc[1]);R(b,k+3,y+h/2-6,2,12,acc[2]);P(b,k+3,y+h/2-1,acc[3])}for(let k=x+2;k<x+w-2;k+=3){P(b,k,y-2,o[2]);P(b,k,y+h+1,o[2])}}
function halfWall(x,y0,y1){R(b,x+2,y0,10,y1-y0+4,'#0003');box(b,x,y0,8,y1-y0,PAL.woodD);R(b,x+1,y0,6,2,PAL.oak[3]);for(let y=y0+6;y<y1;y+=10)R(b,x+1,y,6,1,PAL.woodD[0])}
function buildBG(){
  R(b,0,0,W,H,'#2a1a10');
  planks(184,72,604,300,PAL.oak);planks(184,316,604,H,PAL.oak);
  tiles(0,72,184,300,['#9a9080','#d8ceb8','#ece4d0','#fff8e8'],['#2a6e72','#3a8a8a','#5aaaa4','#8ad0c4']);
  carpet(0,316,184,H,['#22305a','#2e4278','#40589a']);carpet(604,72,W,H,['#7a4a32','#9a6040','#b47a54']);
  planks(0,300,W,316,PAL.woodD);R(b,0,300,W,1,'#0006');R(b,0,315,W,1,'#0004');
  // rugs
  rug(250,440,290,36,PAL.red,['#c88a3a','#e0a84a','#f4c870'],PAL.red);rug(630,330,124,90,PAL.teal,PAL.cream,PAL.teal);rug(20,370,150,80,PAL.cream,PAL.blue,PAL.yellow);
  // wall
  const wg=b.createLinearGradient(0,0,0,72);wg.addColorStop(0,'#e6d2a8');wg.addColorStop(1,'#d4bc8c');b.fillStyle=wg;b.fillRect(0,0,W,58);
  for(let x=0;x<W;x+=16){R(b,x,0,1,58,'#cdb482');for(let y=6;y<56;y+=14)P(b,x+8,y+((x/16)%2)*7,'#c2a676')}
  R(b,0,0,W,3,'#5a3a20');R(b,0,56,W,16,PAL.woodD[2]);R(b,0,56,W,2,PAL.oak[3]);for(let x=0;x<W;x+=24){R(b,x+2,60,20,9,PAL.woodD[1]);R(b,x+2,60,20,1,PAL.woodD[3])}
  R(b,0,70,W,2,PAL.woodD[0]);for(let i=0;i<6;i++)R(b,0,72+i,W,1,`rgba(20,10,10,${.3-i*.05})`);
  // pantry wall tiles backsplash
  for(let y=4;y<56;y+=8)for(let x=0;x<180;x+=8){R(b,x,y,8,8,(x+y)%16?'#f2f0ea':'#e4ece8');R(b,x,y+7,8,1,'#c8ccc8');R(b,x+7,y,1,8,'#c8ccc8')}
  // window frames layer + sills
  for(const[x,y,w,h]of WINS){fg.fillStyle=PAL.woodD[1];fg.fillRect(x-4,y-4,w+8,4);fg.fillRect(x-4,y+h,w+8,4);fg.fillRect(x-4,y,4,h);fg.fillRect(x+w,y,4,h);
    for(let k=x+w/ (w>150?4:2);k<x+w-2;k+=w/(w>150?4:2))fg.fillRect(k-1,y,3,h);fg.fillRect(x,y+h/2-1,w,2);fg.fillStyle=PAL.oak[3];fg.fillRect(x-4,y-4,w+8,1);
    fg.fillStyle='#ffffff22';for(let k=0;k<h;k++)fg.fillRect(x+8+k*.6,y+k,3,1);
    box(b,x-8,y+h+3,w+16,5,PAL.oak);
    // curtains
    for(const cx of [x-14,x+w+4]){R(fg,0,0,0,0,'#000');fg.fillStyle='#b8434f';fg.fillRect(cx,y-6,10,h+12);fg.fillStyle='#8a2a38';for(let k=cx+2;k<cx+10;k+=3)fg.fillRect(k,y-6,1,h+12);fg.fillStyle='#e06a74';fg.fillRect(cx,y-6,2,h+12)}
    fg.fillStyle=PAL.metal[1];fg.fillRect(x-18,y-8,w+36,2)}
  // wall decor: posters, TV frame, clock base
  box(b,470,10,96,42,PAL.dark);R(b,474,14,88,34,'#0a0e18');R(b,514,52,8,4,PAL.metal[0]);
  box(b,140,10,0,0,PAL.dark);
  box(b,600,0,0,0,PAL.dark);
  box(b,748,12,14,18,PAL.dark);R(b,750,14,10,14,'#ffcf4a');R(b,752,22,2,4,'#2f8a4e');R(b,755,18,2,8,'#2f8a4e');
  box(b,436,14,22,28,PAL.oak);R(b,439,17,16,22,'#7fc8ff');ell(b,447,26,5,5,'#ffe08a');R(b,439,32,16,7,'#3f9a52');
  // floor soft vignette near walls
  const vg=b.createLinearGradient(0,72,0,110);vg.addColorStop(0,'rgba(30,15,10,.25)');vg.addColorStop(1,'rgba(30,15,10,0)');b.fillStyle=vg;b.fillRect(0,72,W,40);
  halfWall(180,72,284);halfWall(600,72,284);halfWall(180,330,H);
}
// city skyline (2 variants for blinking windows)
function buildCity(){for(const[g,seedOff]of[[cg,0],[cg2,1]]){_s=99;
  for(let L=0;L<2;L++){let x=0;while(x<W){const w=14+Math.floor(rnd()*22),h=(L?18:10)+Math.floor(rnd()*(L?30:22));const col=L?'#3a4a6a':'#5a6a8a';
    g.fillStyle=col;g.fillRect(x,60-h,w,h);g.fillStyle=L?'#2c3a58':'#4a5a7a';g.fillRect(x+w-3,60-h,3,h);
    if(L)for(let yy=60-h+3;yy<58;yy+=4)for(let xx=x+2;xx<x+w-4;xx+=4){const on=rnd()<.45;const on2=seedOff&&rnd()<.15?!on:on;g.fillStyle=on2?'#ffd88a':'#26324a';g.fillRect(xx,yy,2,2)}
    if(rnd()<.2&&L){g.fillStyle='#ff4a4a';g.fillRect(x+w/2,60-h-4,1,4)}x+=w+(L?1:2)}}}}
// ================= PROPS =================
const deskDyn=[];
function makeDesk(left,bottom,w,who){const[c,g]=mk(w+4,58);const x=2,y=24;
  box(g,x,y+4,w,12,PAL.oak);for(let i=4;i<w-4;i+=13)R(g,x+i,y+7,7,1,PAL.oak[2]);
  box(g,x,y+16,w,12,PAL.wood);R(g,x+1,y+17,w-2,1,PAL.wood[3]);const n=w>76?3:2,dw=(w-12)/n;
  for(let i=0;i<n;i++){const dx=x+6+i*dw;R(g,dx,y+19,dw-4,7,PAL.wood[0]);R(g,dx+1,y+20,dw-6,5,PAL.wood[1]);R(g,dx+dw/2-4,y+22,4,1,PAL.yellow[2])}
  R(g,x+1,y+28,3,5,PAL.woodD[1]);R(g,x+w-4,y+28,3,5,PAL.woodD[1]);
  const glow={David:'#9ad0ff',Kim:'#7fe0ff',Jane:'#8affb0',Alex:'#ffd08a',Jhon:'#ff9a9a',Su:'#c8a8ff'}[who];
  if(who=='Kim'){monitorBack(g,x+4,y-10,20,14,glow);monitorBack(g,x+w-24,y-10,20,14,glow);box(g,x+30,y+9,9,5,PAL.dark);R(g,x+31,y+10,7,3,'#7fe0ff');box(g,x+44,y+8,12,6,PAL.white)}
  if(who=='Jane'){monitorBack(g,x+2,y-8,16,12,glow);monitorBack(g,x+w/2-9,y-12,18,15,glow);monitorBack(g,x+w-18,y-8,16,12,glow);box(g,x+4,y+10,6,4,PAL.white);R(g,x+5,y+10,4,1,'#6b3a1a')}
  if(who=='Alex'){monitorBack(g,x+1,y-9,15,12,glow);monitorBack(g,x+18,y-14,16,13,glow);monitorBack(g,x+36,y-14,16,13,glow);monitorBack(g,x+54,y-9,15,12,glow)}
  if(who=='Jhon'){monitorBack(g,x+w-26,y-10,22,14,glow);box(g,x+6,y+6,10,12,PAL.dark);R(g,x+7,y+7,8,3,'#9ae0a0');for(let i=0;i<3;i++)for(let j=0;j<3;j++)R(g,x+7+i*3,y+11+j*2,2,1,PAL.metal[3]);
    box(g,x+22,y-6,10,12,PAL.blue);R(g,x+26,y-4,2,8,PAL.yellow[2]);R(g,x+24,y-1,6,2,PAL.yellow[2]);R(g,x+23,y+5,8,1,PAL.blue[0])}
  if(who=='Su'){monitorBack(g,x+4,y-10,20,14,glow);monitorBack(g,x+28,y-10,18,14,glow);box(g,x+50,y+7,16,8,PAL.cream);R(g,x+57,y+7,1,8,PAL.cream[0]);box(g,x+6,y+9,8,5,PAL.purple)}
  if(who=='David'){monitorBack(g,x+10,y-10,24,15,glow);box(g,x+46,y+8,14,6,PAL.white);R(g,x+47,y+9,12,1,'#aab');box(g,x+64,y+5,6,8,PAL.white);R(g,x+65,y+5,4,1,'#6b3a1a');box(g,x+w-10,y+2,5,9,PAL.yellow);R(g,x+w-11,y+1,7,2,PAL.yellow[2]);R(g,x+36,y+10,8,3,PAL.yellow[1])}
  outline(c);PROPS.push({x:left,y:bottom,c,ox:2,oy:58,who});}
function prop2(x,y,w,h,ox,oy,draw,extra){const[c,g]=mk(w,h);draw(g,w,h);outline(c);PROPS.push(Object.assign({x,y,c,ox,oy},extra||{}))}
function buildProps(){
  makeDesk(344,190,84,'David');makeDesk(222,262,70,'Kim');makeDesk(512,262,70,'Jane');makeDesk(222,412,70,'Alex');makeDesk(362,412,70,'Jhon');makeDesk(502,412,70,'Su');
  const ch=(x,y,col)=>{const p=chairProp(col);PROPS.push({x,y,c:outline(p.c),ox:p.ox,oy:p.oy})};ch(386,160,'blue');ch(257,232,'green');ch(547,232,'pink');ch(257,382,'yellow');ch(397,382,'metal');ch(537,382,'purple');
  // pantry counter (against wall)
  prop2(0,94,184,50,0,50,(g)=>{box(g,1,22,176,26,PAL.wood);box(g,1,16,176,7,PAL.white);for(let x=6;x<170;x+=29){R(g,x,27,25,18,PAL.wood[0]);R(g,x+1,28,23,16,PAL.wood[1]);R(g,x+18,34,3,3,PAL.yellow[2])}
    // coffee machine
    box(g,30,0,22,20,PAL.dark);R(g,33,3,16,6,PAL.metal[1]);R(g,35,4,8,4,'#3fe07a');R(g,36,12,10,6,'#111');box(g,37,13,7,5,PAL.white);P(g,47,4,'#ff4a4a');
    // microwave + fruit + kettle
    box(g,92,4,26,13,PAL.white);R(g,95,6,15,9,'#3a4a5a');dith(g,95,6,15,9,'#5a6a7a');R(g,112,7,3,7,PAL.metal[1]);
    ell(g,74,13,7,3,PAL.white[1]);R(g,69,8,4,4,'#e84a4a');R(g,74,7,4,4,'#ffcf3a');R(g,77,10,3,3,'#7cc24a');
    box(g,128,6,8,10,PAL.red);R(g,136,8,2,3,PAL.red[0]);box(g,6,6,10,10,PAL.green);R(g,8,2,6,4,'#3fa85e')})
  // fridge
  prop2(150,116,28,62,0,62,(g)=>{box(g,1,1,26,58,PAL.white);R(g,2,24,24,1,PAL.white[0]);R(g,21,8,2,12,PAL.metal[2]);R(g,21,28,2,18,PAL.metal[2]);R(g,3,2,2,56,'#fff');box(g,6,30,8,6,PAL.yellow);box(g,8,10,6,6,PAL.pink)});
  // water cooler
  prop2(120,140,20,46,10,46,(g)=>{box(g,3,18,14,26,PAL.white);box(g,5,0,10,18,['#4a8ad0','#7fc8ff','#b8e4ff','#fff']);dith(g,6,3,8,12,'#a8dcff');R(g,5,26,3,2,'#3a7be0');R(g,12,26,3,2,'#e04848');R(g,4,36,12,1,PAL.white[0])},{steam:0});
  // pantry round table + stools
  prop2(96,214,52,30,26,24,(g)=>{ell(g,26,10,24,9,PAL.cream[0]);ell(g,26,9,23,8,PAL.cream[2]);ell(g,22,7,12,3,PAL.cream[3]);R(g,24,16,4,10,PAL.woodD[1]);R(g,18,25,16,2,PAL.woodD[0]);box(g,10,5,5,4,PAL.white);box(g,32,6,8,4,PAL.red)});
  for(const sx of [60,132]){prop2(sx,220,16,16,8,14,(g)=>{ell(g,8,5,7,4,PAL.red[1]);ell(g,8,4,6,3,PAL.red[2]);R(g,7,8,2,6,PAL.metal[1])})}
  // meeting corner: table, chairs, whiteboard
  prop2(110,410,96,38,48,34,(g)=>{box(g,2,4,92,22,PAL.woodD);R(g,4,6,88,2,PAL.woodD[3]);dith(g,4,10,88,14,PAL.woodD[2]);R(g,6,26,4,8,PAL.woodD[0]);R(g,86,26,4,8,PAL.woodD[0]);box(g,20,10,12,8,PAL.white);box(g,60,9,10,8,PAL.white);R(g,61,11,8,1,'#6b8');box(g,44,8,6,7,PAL.yellow)});
  for(const[x,y]of[[78,384],[110,384],[142,384]]){const p=chairProp('blue');PROPS.push({x,y,c:outline(p.c),ox:p.ox,oy:p.oy})}
  prop2(46,356,64,46,32,46,(g)=>{box(g,2,2,60,34,PAL.white);R(g,4,4,56,30,'#fbfcff');R(g,8,26,8,6,'#e84a4a');R(g,20,20,8,12,'#3a7be0');R(g,32,14,8,18,'#2f8a4e');R(g,44,8,8,24,'#e0a028');
    for(let i=0;i<5;i++)R(g,8+i*10,10-i,8,1,'#5a3a8a');R(g,6,36,2,10,PAL.metal[1]);R(g,56,36,2,10,PAL.metal[1]);R(g,10,37,44,2,PAL.metal[2])});
  // lounge: bookshelves, arcade, sofa, tv, aquarium
  for(const bx of [622,664])prop2(bx,104,40,74,0,74,(g)=>{box(g,1,1,38,70,PAL.woodD);R(g,3,3,34,66,PAL.woodD[0]);for(let s=0;s<4;s++){const sy=4+s*17;R(g,3,sy+14,34,3,PAL.woodD[2]);let x=4;while(x<34){const w=3+Math.floor(rnd()*2),h=9+Math.floor(rnd()*4),c=pick([PAL.red,PAL.blue,PAL.green,PAL.yellow,PAL.purple,PAL.pink]);if(rnd()<.12){R(g,x,sy+14-6,6,6,c[1]);x+=7;continue}R(g,x,sy+14-h,w,h,c[1]);R(g,x,sy+14-h,1,h,c[2]);R(g,x,sy+16-h,w,1,c[3]);x+=w}}});
  prop2(742,128,30,60,15,60,(g)=>{box(g,2,2,26,56,PAL.purple);R(g,4,4,22,6,PAL.yellow[2]);R(g,6,6,18,2,PAL.red[2]);box(g,5,13,20,16,PAL.dark);box(g,3,32,24,8,PAL.purple);R(g,8,34,2,4,'#222');ell(g,9,33,2,2,'#e84a4a');ell(g,18,35,2,2,'#3fe07a');ell(g,22,35,2,2,'#3a7be0');R(g,5,44,20,10,PAL.purple[0]);R(g,10,48,10,2,PAL.yellow[2])},{arcade:1});
  prop2(690,392,112,40,56,40,(g)=>{box(g,2,2,108,18,PAL.teal);R(g,4,4,104,3,PAL.teal[3]);dith(g,6,9,100,8,PAL.teal[0]);box(g,0,12,12,26,PAL.teal);box(g,100,12,12,26,PAL.teal);box(g,12,20,88,16,PAL.teal);
    R(g,13,21,42,3,PAL.teal[3]);R(g,57,21,42,3,PAL.teal[3]);R(g,55,20,2,16,PAL.teal[0]);box(g,18,8,16,12,PAL.yellow);box(g,80,8,16,12,PAL.pink)});
  prop2(690,476,70,34,35,34,(g)=>{box(g,2,18,66,14,PAL.woodD);R(g,6,22,26,8,PAL.woodD[0]);R(g,38,22,26,8,PAL.woodD[0]);box(g,12,2,46,16,PAL.dark);R(g,14,4,42,1,'#7fc8ff')},{tv:1});
  prop2(690,440,40,16,20,14,(g)=>{box(g,2,2,36,8,PAL.oak);R(g,4,10,2,4,PAL.woodD[1]);R(g,34,10,2,4,PAL.woodD[1]);box(g,8,0,8,4,PAL.white);ell(g,28,4,4,2,PAL.green[2])});
  prop2(730,300,36,34,18,34,(g)=>{box(g,2,2,32,22,['#2a6a9a','#4aa0d0','#8ad8f0','#e0f8ff']);dith(g,4,14,28,8,'#2a7aa8');R(g,8,18,6,4,'#3f9a52');R(g,20,16,3,6,'#3f9a52');box(g,2,24,32,8,PAL.dark)},{fish:1});
  // chill zone: beanbags, printer, cabinets
  const bean=(x,c)=>prop2(x,416,30,24,15,22,(g)=>{ell(g,15,13,14,9,c[1]);ell(g,13,10,10,6,c[2]);ell(g,11,8,5,3,c[3]);ell(g,16,18,13,4,c[0])});
  // plants & lamps
  for(const[x,y,k]of[[200,96,1],[586,96,0],[166,282,0],[620,284,2],[200,470,2],[588,470,1],[316,470,0],[476,470,2],[16,300,1],[12,470,0],[756,470,2],[608,104,0]]){const p=plantProp(k);PROPS.push({x,y,c:p.c,ox:p.ox,oy:p.oy})}
  for(const[x,y]of[[312,150],[470,226],[214,170],[640,240],[28,360],[470,330]]){const p=lampProp();PROPS.push({x,y,c:outline(p.c),ox:p.ox,oy:p.oy,lamp:1})}
}
// ================= SPOTS / BOTS =================
const SEAT={David:{x:386,y:164,ex:446},Kim:{x:257,y:236,ex:307},Jane:{x:547,y:236,ex:497},Alex:{x:257,y:386,ex:314},Jhon:{x:397,y:386,ex:447},Su:{x:537,y:386,ex:587}};
const SPOTS=[
 {x:44,y:104,ex:44,dir:1,pose:'sip',say:'☕ ชงกาแฟ',steam:1},{x:120,y:152,ex:120,dir:1,pose:'sip',say:'💧 กดน้ำดื่ม'},
 {x:96,y:236,ex:96,dir:1,pose:'sip',say:'🍪 พักกินขนม'},{x:300,y:96,ex:300,dir:1,pose:'stand',say:'🌆 ดูวิวเมือง'},
 {x:644,y:116,ex:644,dir:1,pose:'stand',say:'📚 หาหนังสืออ่าน'},{x:742,y:142,ex:742,dir:1,pose:'play',say:'🕹️ เล่นเกมตู้'},
 {x:676,y:400,ex:760,dir:0,pose:'couch',say:'🛋️ พักบนโซฟา'},
 {x:110,y:434,ex:170,dir:1,pose:'stand',say:'🗂️ เตรียมห้องประชุม'},{x:748,y:318,ex:748,dir:1,pose:'stand',say:'🐟 ให้อาหารปลา'}];
const bots=Object.keys(CH).map((n,i)=>({n,x:SEAT[n].x,y:SEAT[n].y,dir:0,state:'work',t:6+i*7+Math.random()*8,path:[],f:0,ft:0,say:null,pose:'sit',blink:0,bt:2+Math.random()*3,emote:null}));
function route(bt,from,to){bt.path=[{x:from.ex,y:from.y},{x:from.ex,y:AISLE+6},{x:to.ex,y:AISLE+6},{x:to.ex,y:to.y},{x:to.x,y:to.y}]}
function plan(bt){bt.from={x:bt.x,y:bt.y,ex:SEAT[bt.n].ex};let tg;
  if(Math.random()<.3){const o=bots.filter(x=>x!==bt&&x.state=='work');if(o.length){const ob=o[Math.floor(Math.random()*o.length)],s=SEAT[ob.n];tg={x:s.ex,y:s.y,ex:s.ex,dir:s.ex>s.x?2:3,pose:'wave',say:'💬 คุยกับ '+ob.n,visit:ob}}}
  if(!tg)tg=SPOTS[Math.floor(Math.random()*SPOTS.length)];
  if(bots.some(o=>o!==bt&&o.goal===tg))tg=SPOTS[(SPOTS.indexOf(tg)+1)%SPOTS.length]||SPOTS[0];
  route(bt,bt.from,tg);bt.goal=tg;bt.state='walk';bt.say=tg.say}
function goHome(bt){const g=bt.goal;route(bt,{ex:g.ex,y:g.y},SEAT[bt.n]);bt.path.unshift({x:g.ex,y:g.y});bt.goal=null;bt.state='walk';bt.say='🚶 กลับโต๊ะ'}
function emote(bt,k){bt.emote={k,t:0}}
function update(dt){for(const bt of bots){bt.ft+=dt;bt.bt-=dt;if(bt.bt<0){bt.blink=bt.blink?0:1;bt.bt=bt.blink?.12:2+Math.random()*4}
  if(bt.emote){bt.emote.t+=dt;if(bt.emote.t>3)bt.emote=null}
  if(bt.state=='walk'){bt.pose='walk';const p=bt.path[0];
    if(!p){if(bt.goal){bt.state='idle';bt.t=5+Math.random()*5;bt.dir=bt.goal.dir;bt.pose=bt.goal.pose;if(bt.goal.visit){emote(bt.goal.visit,'♪');emote(bt,'💬')}if(bt.goal.steam)puff(bt.x+6,bt.y-30)}
      else{bt.state='work';bt.t=18+Math.random()*25;bt.dir=0;bt.pose='sit';bt.say=null}continue}
    const dx=p.x-bt.x,dy=p.y-bt.y,d=Math.hypot(dx,dy),sp=38*dt;if(d<=sp){bt.x=p.x;bt.y=p.y;bt.path.shift()}else{bt.x+=dx/d*sp;bt.y+=dy/d*sp;bt.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?2:3):(dy<0?1:0)}
    if(bt.ft>.13){bt.ft=0;bt.f=(bt.f+1)%4;if(bt.f%2==0)stepSound()}}
  else{bt.t-=dt;const sp=bt.pose=='sit'||bt.pose=='play'?.16:bt.pose=='wave'?.3:.7;if(bt.ft>sp){bt.ft=0;bt.f=(bt.f+1)%4}
    if(bt.state=='work'&&bt.n=='Jane'){const ph=(time/7)%4|0;bt.pose=ph==3?'sip':'sit'}
    if(bt.state=='work'&&bt.n=='David'&&((time/9)%5|0)==4)bt.pose='stand';else if(bt.state=='work'&&bt.n=='David')bt.pose='sit';
    if(bt.t<=0)bt.state=='work'?plan(bt):goHome(bt)}}
  for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.t+=dt}for(let i=parts.length-1;i>=0;i--)if(parts[i].t>parts[i].life)parts.splice(i,1);
  steamT+=dt;if(steamT>.35){steamT=0;puff(43,64);if(Math.random()<.5)for(const bt of bots)if(bt.pose=='sip')puff(bt.x+(bt.dir==2?-6:7),bt.y-40)}}
// ================= PARTICLES =================
const parts=[];let steamT=0;
function puff(x,y){parts.push({x,y,vx:(Math.random()-.5)*3,vy:-8-Math.random()*4,t:0,life:1.8,k:'s'})}
const motes=Array.from({length:26},(_,i)=>({x:Math.random()*W,y:80+Math.random()*380,s:Math.random()*6.28,v:2+Math.random()*3}));
// ================= LIGHTING =================
let time=0,nightK=0,lightC=null,glowC=null,skyKey='';
const LIGHTS=[[312,104,70,'255,196,110'],[470,180,66,'255,196,110'],[214,124,60,'255,196,110'],[640,194,62,'255,196,110'],[28,314,58,'255,196,110'],[470,300,60,'255,196,110'],[257,372,32,'255,210,140'],[397,372,32,'255,150,150'],[537,372,32,'200,170,255'],
 [386,150,34,'140,210,255'],[257,222,32,'120,230,255'],[547,222,34,'140,255,180'],[742,90,36,'200,120,255'],[690,452,40,'120,190,255'],[518,32,46,'120,190,255'],[748,286,30,'90,200,255'],[44,72,22,'255,160,90']];
function hourNow(){const d=new Date();return d.getHours()+d.getMinutes()/60}
function nightness(h){if(h>=7&&h<17)return 0;if(h>=19||h<5)return 1;if(h>=17)return(h-17)/2;return 1-(h-5)/2}
function buildLights(){const n=nightK;[lightC]=mk(W,H);const g=lightC.getContext('2d');
  g.fillStyle=`rgba(18,16,52,${.08+n*.5})`;g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';
  for(const[x,y,r]of LIGHTS){const gr=g.createRadialGradient(x,y,0,x,y,r*(1+n*.6));gr.addColorStop(0,'rgba(0,0,0,.9)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r*2,y-r*2,r*4,r*4)}
  if(n<.9)for(const[x,y,w]of WINS){g.fillStyle=`rgba(0,0,0,${.8*(1-n)})`;g.beginPath();g.moveTo(x,y+46);g.lineTo(x+w,y+46);g.lineTo(x+w+50,y+190);g.lineTo(x+40,y+190);g.fill()}
  [glowC]=mk(W,H);const q=glowC.getContext('2d');
  for(const[x,y,r,c]of LIGHTS){const gr=q.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${c},${.16+n*.3})`);gr.addColorStop(1,`rgba(${c},0)`);q.fillStyle=gr;q.fillRect(x-r,y-r,r*2,r*2)}
  if(n<.9)for(const[x,y,w]of WINS){const gr=q.createLinearGradient(0,y+46,0,y+200);gr.addColorStop(0,`rgba(255,240,190,${.22*(1-n)})`);gr.addColorStop(1,'rgba(255,240,190,0)');q.fillStyle=gr;q.beginPath();q.moveTo(x,y+50);q.lineTo(x+w,y+50);q.lineTo(x+w+50,y+200);q.lineTo(x+40,y+200);q.fill()}}
function drawSky(g){const h=hourNow(),n=nightK;
  for(const[x,y,w,hh]of WINS){g.save();g.beginPath();g.rect(x,y,w,hh);g.clip();
    const gr=g.createLinearGradient(0,y,0,y+hh);const dusk=n>0&&n<1;
    gr.addColorStop(0,n>=1?'#0c1236':dusk?'#3a3a7a':'#5ab4ff');gr.addColorStop(1,n>=1?'#2a2a5e':dusk?'#ff9a6a':'#c8ecff');g.fillStyle=gr;g.fillRect(x,y,w,hh);
    if(n>.5)for(let i=0;i<20;i++){const sx=x+(i*37)%w,sy=y+(i*13)%20;g.globalAlpha=.5+.5*Math.sin(time*2+i);P(g,sx,sy,'#fff')}g.globalAlpha=1;
    // sun/moon
    const ang=n<1?((h-6)/12):((h+6)%24)/12;const sx=x+ang*w,sy=y+30-Math.sin(ang*Math.PI)*24;
    if(n<.6){ell(g,sx,sy,6,6,'#fff3b0');ell(g,sx,sy,4,4,'#fffbe0')}else{ell(g,sx,sy,5,5,'#f0f0ff');ell(g,sx+2,sy-1,4,4,'#0c1236')}
    // clouds
    for(let i=0;i<3;i++){const cx=x+((time*(3+i)+i*90)%(w+60))-30,cy=y+6+i*7;g.globalAlpha=n>.5?.25:.9;ell(g,cx,cy,9,3,'#fff');ell(g,cx+6,cy-2,6,3,'#fff');g.globalAlpha=1}
    g.drawImage((Math.floor(time*.7)%2&&n>.3)?city2:city,x,y+hh-60);if(n<.4){g.fillStyle='rgba(180,220,255,.25)';g.fillRect(x,y,w,hh)}
    // little cars
    for(let i=0;i<3;i++){const cx=x+((time*(18+i*7)+i*80)%(w+20))-10;R(g,cx,y+hh-3,4,2,n>.5?'#ffe08a':['#e84a4a','#3a7be0','#ffcf3a'][i])}
    g.restore()}
  g.drawImage(frames,0,0)}
// ================= DYNAMIC DRAW =================
function drawScreens(g){// wall TV news + chart ticker
  R(g,474,14,88,34,'#0a1426');for(let i=0;i<4;i++){const w=10+((i*13+Math.floor(time*2))%30);R(g,478,18+i*5,w,2,i?'#9ab8e0':'#ffcf4a')}
  let py=40;for(let i=0;i<40;i++){const ny=34+Math.sin(time+i*.4)*4+Math.sin(i*1.7)*2;R(g,518+i,Math.min(py,ny),1,Math.abs(ny-py)+1,ny<py?'#3fe07a':'#ff5a6a');py=ny}
  R(g,474,44,88,4,'#c02a3a');const tx=(time*20)%88;for(let k=0;k<88;k+=11)R(g,474+((k+88-tx)%88),45,7,2,'#fff');
  // clock
  const cx=594,cy=30;ell(g,cx,cy,11,11,OL);ell(g,cx,cy,10,10,PAL.oak[1]);ell(g,cx,cy,8,8,'#fffaf0');for(let i=0;i<12;i++)P(g,cx+Math.sin(i/12*6.283)*7,cy-Math.cos(i/12*6.283)*7,'#8a7a6a');
  const d=new Date(),hr=(d.getHours()%12+d.getMinutes()/60)/12*6.283,mn=d.getMinutes()/60*6.283,sc=d.getSeconds()/60*6.283;
  for(let i=0;i<5;i++)P(g,cx+Math.sin(hr)*i,cy-Math.cos(hr)*i,'#1a1220');for(let i=0;i<7;i++)P(g,cx+Math.sin(mn)*i,cy-Math.cos(mn)*i,'#1a1220');for(let i=0;i<7;i++)P(g,cx+Math.sin(sc)*i,cy-Math.cos(sc)*i,'#e84a4a')}
function drawPropDyn(g,p){
  if(p.who=='Jane'){const x=p.x+48,y=p.y-24;box(g,x,y,18,10,PAL.dark);R(g,x+1,y+1,16,8,'#0d1d16');let py=y+5;for(let i=0;i<15;i++){const ny=y+5+Math.round(Math.sin(time*1.6+i*.7)*2.5);R(g,x+2+i,Math.min(py,ny),1,Math.abs(ny-py)+1,ny<py?'#3fe07a':'#ff5a6a');py=ny}}
  if(p.who=='Kim'){const x=p.x+33,y=p.y-24;for(let i=0;i<2;i++)R(g,x,y+((time*6+i*2)%3|0),5,1,'#fff')}
  if(p.who=='Alex'){const x=p.x+20,y=p.y-24;box(g,x,y,26,10,PAL.dark);R(g,x+1,y+1,24,8,'#101420');let py=y+5;for(let i=0;i<12;i++){const ny=y+5-Math.round(Math.sin(time*.5+i*.5)*2+Math.sin(i*1.1)*1);R(g,x+2+i,Math.min(py,ny),1,Math.abs(ny-py)+1,'#4a9aff');py=ny}
    for(let k=0;k<4;k++){const wb=2+Math.round(4*Math.abs(Math.sin(time*.9+k))),wa=2+Math.round(4*Math.abs(Math.cos(time*.7+k*1.3)));R(g,x+15,y+1+k*2,wb,1,'#3fe07a');R(g,x+24-wa,y+1+k*2,wa,1,'#ff5a6a')}}
  if(p.who=='Su'){const x=p.x+52,y=p.y-24;for(let i=0;i<3;i++)R(g,x+9,y+2+i*2,(i==2?(time*3%5|0):5),1,'#5a4a8a');R(g,x+10+((time*3)%5),y+5,1,2,'#e84a4a')}
  if(p.arcade){const x=p.x-15+6,y=p.y-60+14;for(let i=0;i<18;i++)for(let j=0;j<14;j+=2){if(((i+j*3+Math.floor(time*8))%11)<1)P(g,x+i,y+j,['#ff4a8a','#4af0ff','#ffe04a'][(i+j)%3])}R(g,x+8+Math.sin(time*3)*6,y+10,3,3,'#ffe04a')}
  if(p.fish){const x=p.x-18+4,y=p.y-34+4;for(let i=0;i<2;i++){const fx=x+4+((time*(6+i*4)+i*10)%24),fy=y+5+i*5+Math.sin(time*2+i)*1.5;R(g,fx,fy,3,2,i?'#ffa03a':'#ff5a8a');P(g,fx-1,fy,'#ffd04a')}if(Math.sin(time*3)>.9)P(g,x+20,y+2+((time*10)%10),'#fff')}}
function drawEmote(g,bt){const e=bt.emote,sc=Math.min(1,e.t*6),bob=Math.sin(e.t*8)*1,x=Math.round(bt.x),y=Math.round(bt.y-46-(bt.pose=='sit'?2:0)+bob-(1-sc)*4);
  if(e.t>2.6&&Math.floor(e.t*10)%2)return;box(g,x-6,y-6,13,11,PAL.white);P(g,x,y+5,OL);P(g,x-1,y+5,'#fff');P(g,x+1,y+5,'#fff');R(g,x-1,y+5,3,1,'#fff');R(g,x,y+6,1,1,OL);
  if(e.k=='!'){R(g,x,y-4,1,5,'#e84a4a');R(g,x,y+2,1,1,'#e84a4a');R(g,x+1,y-4,1,5,'#b02a3a')}
  else if(e.k=='♪'){R(g,x+1,y-4,1,6,'#5a3a8a');R(g,x+1,y-4,3,1,'#5a3a8a');R(g,x-1,y+1,3,2,'#5a3a8a')}
  else{R(g,x-3,y-3,7,5,'#4a78c8');R(g,x-2,y-2,1,1,'#fff');R(g,x,y-2,1,1,'#fff');R(g,x+2,y-2,1,1,'#fff')}}
function drawWorld(){const g=wx;g.drawImage(bg,0,0);drawSky(g);drawScreens(g);
  const list=PROPS.map(p=>({y:p.y,p}));for(const bt of bots)list.push({y:bt.y+.5,bt});list.sort((a,c)=>a.y-c.y);
  for(const it of list){if(it.p){const p=it.p;g.drawImage(p.c,p.x-p.ox,p.y-p.oy);drawPropDyn(g,p)}
    else{const bt=it.bt;softShadowFast(g,bt.x,bt.y);const s=charSprite(bt.n,bt.dir,(bt.pose=='walk'||bt.pose=='sit'||bt.pose=='play'||bt.pose=='wave'||bt.pose=='stand'||bt.pose=='sip')?bt.f:0,bt.pose,bt.blink&&bt.dir!=1);
      g.drawImage(s,Math.round(bt.x)-13,Math.round(bt.y)-37+(bt.pose=='couch'?-2:0))}}
  for(const bt of bots)if(bt.emote)drawEmote(g,bt);
  // steam
  for(const p of parts){const a=1-p.t/p.life;g.globalAlpha=a*.7;const s=p.t>1?2:1;R(g,p.x+Math.sin(p.t*4)*1.5,p.y,s,s,'#fff')}g.globalAlpha=1;
  // lighting
  g.drawImage(lightC,0,0);g.globalCompositeOperation='lighter';g.drawImage(glowC,0,0);
  for(const m of motes){m.y-=m.v*.016;m.x+=Math.sin(time+m.s)*.1;if(m.y<76){m.y=470;m.x=Math.random()*W}g.globalAlpha=(.25+.25*Math.sin(time*2+m.s))*(nightK>.6?.5:1);P(g,m.x,m.y,'#fff4c0')}
  g.globalAlpha=1;g.globalCompositeOperation='source-over'}
const [shC,shG]=mk(24,8);softShadow(shG,12,4,11,4,.45);
function softShadowFast(g,x,y){g.drawImage(shC,Math.round(x)-12,Math.round(y)-4)}
// ================= CAMERA / INPUT =================
let dpr=1,vw=0,vh=0;const cam={x:W/2,y:H/2,z:2},tcam={x:W/2,y:H/2,z:2};let ease=false;
function limits(){const fit=Math.min(vw/W,vh/H);return{min:fit*.95,max:7}}
function homeCam(){return vw<600?{z:1.15,x:402,y:220}:{z:Math.max(Math.min(vw/W,vh/H)*1.02,1),x:W/2,y:H/2-6}}
function clampC(c){const L=limits();c.z=Math.max(L.min,Math.min(L.max,c.z));const hw=vw/2/c.z,hh=vh/2/c.z;c.x=hw*2>=W?W/2:Math.max(hw,Math.min(W-hw,c.x));c.y=hh*2>=H?H/2:Math.max(hh,Math.min(H-hh,c.y));return c}
function flyTo(o){Object.assign(tcam,clampC(Object.assign({},cam,o)));ease=true}
function resetCam(){flyTo(homeCam())}
function resize(){dpr=Math.min(window.devicePixelRatio||1,2);vw=innerWidth;vh=innerHeight;cv.width=Math.round(vw*dpr);cv.height=Math.round(vh*dpr);if(!resize.done){Object.assign(cam,homeCam());resize.done=1}clampC(cam)}
const toWorld=(sx,sy)=>({x:cam.x+(sx-vw/2)/cam.z,y:cam.y+(sy-vh/2)/cam.z});
const toScreen=(x,y)=>({x:(x-cam.x)*cam.z+vw/2,y:(y-cam.y)*cam.z+vh/2});
function zoomAt(sx,sy,nz){ease=false;const a=toWorld(sx,sy);const L=limits();cam.z=Math.max(L.min,Math.min(L.max,nz));const c=toWorld(sx,sy);cam.x+=a.x-c.x;cam.y+=a.y-c.y;clampC(cam)}
const ptrs=new Map();let pinch=null,tap=null,lastTap=0,vel={x:0,y:0};
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});ease=false;vel={x:0,y:0};hideHint();audioInit();
  if(ptrs.size==1)tap={x:e.clientX,y:e.clientY,t:performance.now(),moved:false};else{tap=null;const[a,c]=[...ptrs.values()];pinch={d:Math.hypot(a.x-c.x,a.y-c.y),z:cam.z}}});
cv.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(ptrs.size==1){cam.x-=dx/cam.z;cam.y-=dy/cam.z;vel={x:dx/cam.z,y:dy/cam.z};clampC(cam);if(tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>8)tap.moved=true}
  else if(pinch&&ptrs.size==2){const[a,c]=[...ptrs.values()];zoomAt((a.x+c.x)/2,(a.y+c.y)/2,pinch.z*Math.hypot(a.x-c.x,a.y-c.y)/pinch.d)}});
function up(e){ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;if(ptrs.size==1){const[q]=[...ptrs.values()];tap=null}
  if(tap&&!tap.moved&&ptrs.size==0&&performance.now()-tap.t<350){vel={x:0,y:0};const now=performance.now();if(now-lastTap<320){resetCam();lastTap=0;hideCard()}else{lastTap=now;hit(e.clientX,e.clientY)}}tap=null}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);pinch=null;tap=null});
cv.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,cam.z*Math.exp(-e.deltaY*.0015));hideHint()},{passive:false});
cv.addEventListener('dblclick',e=>e.preventDefault());
const $=id=>document.getElementById(id);
$('zin').onclick=()=>{flyTo({z:cam.z*1.35});blip(660)};$('zout').onclick=()=>{flyTo({z:cam.z/1.35});blip(440)};$('zreset').onclick=()=>{resetCam();hideCard();blip(520)};
$('bfit').onclick=()=>{flyTo({z:0,x:W/2,y:H/2});blip(520)};
document.querySelectorAll('[data-f]').forEach(el=>el.onclick=()=>focusBot(el.dataset.f));
function focusBot(n){const bt=bots.find(x=>x.n==n);flyTo({z:Math.max(cam.z,3.2),x:bt.x,y:bt.y-20});showCard(n);blip(780)}
function hit(sx,sy){const w=toWorld(sx,sy);let best=null,bd=1e9;for(const bt of bots){const dx=w.x-bt.x,dy=w.y-(bt.y-18);if(Math.abs(dx)<14&&Math.abs(dy)<22){const d=dx*dx+dy*dy;if(d<bd){bd=d;best=bt}}}if(best){showCard(best.n);emote(best,'♪');blip(880)}else hideCard()}
setTimeout(hideHint,8000);function hideHint(){$('hint').style.opacity=0}
// ================= SOUND (off by default) =================
let snd=localStorage.getItem('po_snd')=='1',AC=null;
function audioInit(){if(snd&&!AC)try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function tone(f,d=.08,type='square',v=.04){if(!snd||!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g).connect(AC.destination);o.start();o.stop(AC.currentTime+d)}
function blip(f){tone(f,.07)}function chime(){tone(880,.12,'triangle',.06);setTimeout(()=>tone(1320,.18,'triangle',.05),110)}
let stepC=0;function stepSound(){if(snd&&AC&&(++stepC%6==0))tone(120+Math.random()*30,.03,'triangle',.015)}
function sndUI(){$('snd').textContent=snd?'🔊':'🔇'}sndUI();
$('snd').onclick=()=>{snd=!snd;localStorage.setItem('po_snd',snd?'1':'0');audioInit();sndUI();blip(700)};
// ================= UI =================
let status={updated:''},cardFor=null,first=true;
function drawAv(cvs,n){const g=cvs.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,cvs.width,cvs.height);const s=charSprite(n,0,0,'stand');
  if(cvs.width==12)g.drawImage(s,6,1,14,12,0,0,12,12);else g.drawImage(s,1,0,24,26,0,0,24,26)}
function showCard(n){cardFor=n;drawAv($('avatar'),n);$('cname').textContent=n;$('cname').style.color=CH[n].col;$('crole').textContent=CH[n].role;fillCard();$('card').classList.remove('hidden')}
function fillCard(){if(!cardFor)return;const bt=bots.find(x=>x.n==cardFor);$('cstat').textContent='📌 '+(status[cardFor]||'—');$('cact').textContent='ตอนนี้: '+(bt.say||(bt.pose=='sip'?'☕ จิบกาแฟที่โต๊ะ':'💻 ทำงานที่โต๊ะ'));$('ctime').textContent='🕒 อัปเดตล่าสุด '+(status.updated||'—')}
function hideCard(){cardFor=null;$('card').classList.add('hidden')}$('cardx').onclick=hideCard;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderTasks(changed){$('tasklist').innerHTML=Object.keys(CH).map(n=>`<div class="task${changed.includes(n)?' new':''}" data-n="${n}" style="--c:${CH[n].col}"><b>● ${n}</b> <span class="d">${CH[n].role.split(' · ')[0]}</span><div>${esc(status[n]||'—')}</div></div>`).join('');
  document.querySelectorAll('.task').forEach(el=>el.onclick=()=>focusBot(el.dataset.n));$('upd').textContent='🕒 อัปเดต '+(status.updated||'—')}
function toast(n,txt){const d=document.createElement('div');d.className='toast';d.style.setProperty('--c',CH[n].col);d.innerHTML=`<b>${n}</b> อัปเดตสถานะ · ${esc(txt)}`;$('toasts').appendChild(d);setTimeout(()=>d.remove(),4300);chime()}
async function poll(){try{const r=await fetch('status.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)throw 0;const s=await r.json();const changed=Object.keys(CH).filter(n=>s[n]!==status[n]);
  if(!first)for(const n of changed){toast(n,s[n]);const bt=bots.find(x=>x.n==n);emote(bt,'!');bubs[n].classList.remove('flash');void bubs[n].offsetWidth;bubs[n].classList.add('flash')}
  status=s;renderTasks(first?[]:changed);fillCard();first=false}catch(e){$('upd').textContent='⚠️ โหลดสถานะไม่ได้'}}
$('tasks')||0;document.querySelector('.th').onclick=()=>{document.querySelector('.tasks').classList.toggle('closed');$('tt').textContent=document.querySelector('.tasks').classList.contains('closed')?'▸':'▾'};
if(innerWidth<600){document.querySelector('.tasks').classList.add('closed');$('tt').textContent='▸'}
const bubLayer=$('bubbles'),bubs={},tags={};
for(const n in CH){const d=document.createElement('div');d.className='bub '+n;bubLayer.appendChild(d);bubs[n]=d;const t=document.createElement('div');t.className='tag';t.textContent=n;t.style.color=CH[n].col;bubLayer.appendChild(t);tags[n]=t}
function pad(x){return String(x).padStart(2,'0')}
function tickClock(){const d=new Date();$('clock').textContent=pad(d.getHours())+':'+pad(d.getMinutes());$('tbar').style.width=((d.getHours()*60+d.getMinutes())/1440*100)+'%';
  const nk=nightness(hourNow());$('dn').textContent=nk>=1?'กลางคืน 🌙':nk>0?'โพล้เพล้ 🌇':'กลางวัน ☀️';if(Math.abs(nk-nightK)>.02||!lightC){nightK=nk;buildLights()}}
// minimap
const mini=$('mini');mini.width=W/4;mini.height=H/4;const mg=mini.getContext('2d');const [mbg,mbgG]=mk(W/4,H/4);
function drawMini(){mg.drawImage(mbg,0,0);for(const bt of bots){mg.fillStyle=OL;mg.fillRect(bt.x/4-3,bt.y/4-7,6,6);mg.fillStyle=CH[bt.n].col;mg.fillRect(bt.x/4-2,bt.y/4-6,4,4)}
  const a=toWorld(0,0),c=toWorld(vw,vh);mg.strokeStyle='#ffe69a';mg.lineWidth=1;const x0=Math.max(0,a.x/4),y0=Math.max(0,a.y/4);mg.strokeRect(x0+.5,y0+.5,Math.min(W,c.x)/4-x0-1,Math.min(H,c.y)/4-y0-1)}
mini.addEventListener('click',e=>{const r=mini.getBoundingClientRect();flyTo({x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H});blip(600)});
// ================= LOOP =================
let last=performance.now(),mt=0;
function placeDom(){for(const bt of bots){const B=bubs[bt.n],tg=tags[bt.n];const txt=bt.say||status[bt.n]||'…';const html=`<b>${bt.n}</b>${esc(txt)}`;
  if(B._h!==html){B.innerHTML=html;B._h=html;B._w=B.offsetWidth;B._hh=B.offsetHeight}
  const p=toScreen(bt.x,bt.y-(bt.pose=='sit'?42:40)-(bt.emote?14:0));const w=B._w||100,h=B._hh||30;let x=p.x-w/2,y=p.y-h-8;
  const cx=Math.max(6,Math.min(vw-w-6,x)),cy=Math.max(6,Math.min(vh-h-6,y));B.style.setProperty('--tx',Math.max(-w/2+10,Math.min(w/2-10,x-cx))+'px');
  B.style.transform=`translate(${cx|0}px,${cy|0}px)`;const vis=cam.z>=1.05&&p.x>4&&p.x<vw-4&&p.y>10&&p.y<vh+40;B.style.opacity=vis?1:0;B.style.zIndex=Math.round(bt.y);
  const q=toScreen(bt.x,bt.y+3);tg.style.transform=`translate(${(q.x-(tg._w||(tg._w=tg.offsetWidth))/2)|0}px,${q.y|0}px)`;tg.style.opacity=cam.z>=1.05?1:0}}
var frame=function(now){const dt=Math.min(.1,(now-last)/1000);last=now;time+=dt;update(dt);
  if(ease){for(const k of['x','y','z'])cam[k]+=(tcam[k]-cam[k])*Math.min(1,dt*8);clampC(cam);if(Math.abs(tcam.z-cam.z)<.002&&Math.hypot(tcam.x-cam.x,tcam.y-cam.y)<.2)ease=false}
  else if(!ptrs.size&&(Math.abs(vel.x)+Math.abs(vel.y))>.05){cam.x-=vel.x;cam.y-=vel.y;vel.x*=.9;vel.y*=.9;clampC(cam)}
  drawWorld();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#120c08';ctx.fillRect(0,0,cv.width,cv.height);ctx.imageSmoothingEnabled=false;
  const s=cam.z*dpr;ctx.setTransform(s,0,0,s,Math.round((vw/2-cam.x*cam.z)*dpr),Math.round((vh/2-cam.y*cam.z)*dpr));ctx.drawImage(world,0,0);
  placeDom();if((mt+=dt)>.2){mt=0;drawMini()}requestAnimationFrame(frame)}
// ================= INIT =================
function safe(f,l){try{f()}catch(e){console.error('init '+l,e);window.__err=(window.__err||'')+l+': '+e.message+'\n'}}
safe(tickClock,'clock');safe(()=>{renderTasks([]);poll();setInterval(poll,8000)},'status');setInterval(()=>safe(tickClock,'clock'),1000);
safe(buildBG,'bg');safe(buildCity,'city');safe(buildProps,'props');
safe(()=>{for(const p of PROPS){if(p.c.width>4)softShadow(b,p.x-p.ox+p.c.width/2,p.y-2,p.c.width*.45,4,.3)}},'shadows');
safe(()=>{mbgG.imageSmoothingEnabled=true;wx.drawImage(bg,0,0);drawSky(wx);for(const p of PROPS)wx.drawImage(p.c,p.x-p.ox,p.y-p.oy);mbgG.drawImage(world,0,0,W/4,H/4)},'minibg');
safe(()=>{document.querySelectorAll('.mav').forEach(c=>drawAv(c,c.dataset.n));drawAv($('meav'),'David')},'avatars');
addEventListener('resize',resize);safe(resize,'resize');safe(drawMini,'mini');
const _frame=frame;let ferr=0;frame=function(now){try{_frame(now)}catch(e){if(ferr++<3)console.error('frame',e);requestAnimationFrame(frame)}};
requestAnimationFrame(frame);
