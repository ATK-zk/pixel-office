'use strict';
const T=16,W=36*T,H=24*T,AISLE=292;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const world=document.createElement('canvas');world.width=W;world.height=H;const wx=world.getContext('2d');
const bg=document.createElement('canvas');bg.width=W;bg.height=H;const b=bg.getContext('2d');
let status={David:'ดูภาพรวมทีม',Kim:'…',Jane:'…',updated:''};
// deterministic rng
let seed=7;const rnd=()=>((seed=(seed*16807)%2147483647)/2147483647);
function R(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x|0,y|0,w|0,h|0)}
// ---------- background ----------
function drawBG(){
  // wood floor
  for(let y=48;y<H;y+=8)for(let x=0;x<W+32;x+=32){const o=((y/8)%2)*16;const c=['#b9824e','#b07a47','#c08a55','#a97343'][Math.floor(rnd()*4)];
    R(b,x-o,y,32,8,c);R(b,x-o,y,32,1,'#c99662');R(b,x-o,y+7,32,1,'#8e5c34');R(b,x-o+31,y,1,8,'#7d5030');
    if(rnd()<.3)R(b,x-o+8+rnd()*16,y+3,3,1,'#9a6a3e');}
  // pantry tiles (cobble/checker)
  for(let y=48;y<H;y+=8)for(let x=0;x<152;x+=8){const ch=((x+y)/8)%2;R(b,x,y,8,8,ch?'#d9d2c3':'#c4bba9');R(b,x,y,8,1,ch?'#ece6d8':'#d3cab8');R(b,x,y+7,8,1,'#a49a86');R(b,x+7,y,1,8,'#b0a691');}
  R(b,152,48,3,H-48,'#6b4528');
  // wall
  R(b,0,0,W,40,'#e9dcc0');for(let x=0;x<W;x+=12)R(b,x,0,1,40,'#dccdab');
  R(b,0,0,W,4,'#7a4e2c');R(b,0,32,W,10,'#8c5a33');R(b,0,32,W,2,'#a8703f');R(b,0,41,W,3,'#5a3820');R(b,0,44,W,4,'#0002');
  // windows
  for(const x of [176,248,392]){R(b,x-2,4,52,28,'#5a3820');const g=b.createLinearGradient(0,6,0,30);g.addColorStop(0,'#8fd3ff');g.addColorStop(1,'#d8f1ff');b.fillStyle=g;b.fillRect(x,6,48,24);
    R(b,x+6,12,12,4,'#fff');R(b,x+30,20,10,3,'#fffc');R(b,x+23,6,2,24,'#5a3820');R(b,x,17,48,2,'#5a3820');R(b,x-4,30,56,3,'#c9a074');R(b,x+2,6,3,24,'#fff6');}
  // posters
  R(b,476,8,22,18,'#2b2233');R(b,478,10,18,14,'#ffcf5a');R(b,481,19,3,4,'#2f8a4e');R(b,485,15,3,8,'#2f8a4e');R(b,489,12,3,11,'#2f8a4e');
  R(b,330,8,18,20,'#2b2233');R(b,332,10,14,16,'#7fc8ff');R(b,335,13,8,8,'#fff');R(b,337,15,4,4,'#e85a5a');
  // pantry counter
  R(b,4,40,144,26,'#6d4a33');R(b,4,40,144,6,'#f0ede6');R(b,4,46,144,2,'#c9c3b5');for(let x=10;x<144;x+=24){R(b,x,50,20,14,'#7d5a40');R(b,x+15,56,2,3,'#d9c08a');}
  R(b,4,66,144,3,'#0003');
  // fridge
  R(b,124,16,22,50,'#1a1a22');R(b,125,17,20,48,'#dfe6ec');R(b,125,38,20,1,'#9aa6b0');R(b,141,22,2,10,'#9aa6b0');R(b,141,42,2,12,'#9aa6b0');R(b,126,18,3,46,'#fff');
  // microwave & fruit
  R(b,84,30,24,14,'#2b2233');R(b,86,32,14,10,'#3a4a5a');R(b,101,33,5,8,'#888');R(b,60,38,14,4,'#e8e0d0');R(b,61,35,4,4,'#e85a5a');R(b,66,34,4,4,'#ffcf3a');R(b,70,36,3,3,'#7cc24a');
  // water cooler
  R(b,18,128,18,30,'#2b2233');R(b,19,129,16,28,'#e8eef4');R(b,22,108,12,22,'#2b2233');R(b,23,109,10,20,'#7fc8ff');R(b,24,111,3,15,'#c5e8ff');R(b,22,136,4,3,'#3a7be0');R(b,28,136,4,3,'#e04848');R(b,18,158,18,3,'#0003');
  // round table + stools
  ell(b,72,214,22,10,'#0003');R(b,70,200,4,14,'#4a3020');ell(b,72,196,24,10,'#2b2233');ell(b,72,195,22,8,'#f3e2c2');R(b,64,192,5,4,'#fff');
  for(const[sx,sy]of[[40,212],[104,212]]){ell(b,sx,sy,8,4,'#2b2233');ell(b,sx,sy-1,7,3,'#e85a5a');}
  // rug
  R(b,236,300,184,68,'#7a2f3a');R(b,240,304,176,60,'#b8434f');R(b,246,310,164,48,'#7a2f3a');R(b,250,314,156,40,'#d9a35a');
  for(let x=256;x<400;x+=16){R(b,x,330,8,8,'#b8434f');R(b,x+4,326,1,16,'#7a2f3a');}
  // sofa
  R(b,286,360,96,22,'#2b2233');R(b,288,354,92,14,'#3f6fb8');R(b,288,354,92,3,'#6a96d8');R(b,288,368,92,12,'#345fa0');R(b,284,358,10,22,'#2b4f8a');R(b,374,358,10,22,'#2b4f8a');R(b,300,370,30,8,'#4a7cc8');R(b,338,370,30,8,'#4a7cc8');
  // coffee table
  R(b,300,330,0,0,'#000');
  // bookshelf
  for(const sx of [520,548]){R(b,sx,10,26,60,'#4a2c18');R(b,sx+2,12,22,56,'#6b4228');for(let sy=14;sy<64;sy+=13){R(b,sx+2,sy+11,22,2,'#4a2c18');for(let i=0;i<5;i++){const c=['#e85a5a','#3a7be0','#ffcf3a','#2f8a4e','#9a5ad8','#f08a3a'][Math.floor(rnd()*6)];R(b,sx+3+i*4,sy+2+Math.floor(rnd()*3),3,9,c);}}R(b,sx,70,26,3,'#0003');}
  // desks
  desk(296,92,72,'#8a5530');desk(176,196,64,'#9a6238');desk(416,196,64,'#9a6238');
  chair(332,140,'#2b2233');chair(208,244,'#2f6a4a');chair(448,244,'#a83a6a');
  // David desk items
  R(b,306,96,20,12,'#2b2233');R(b,308,98,16,8,'#9ad0ff');R(b,304,108,24,3,'#ccc');R(b,340,98,10,8,'#fff');R(b,341,99,8,1,'#888');R(b,341,101,8,1,'#888');R(b,355,96,6,8,'#4a7');R(b,356,93,4,4,'#e85a5a');
  R(b,330,94,6,8,'#2b2233');R(b,331,95,4,6,'#ffcf3a');// trophy
  // plants
  for(const[px,py,k]of[[164,64,1],[506,72,0],[12,360,1],[556,360,0],[270,368,2],[396,368,2],[160,350,0]])plant(px,py,k);
  // floor lamps base
  for(const[lx,ly]of[[244,150],[500,240],[140,300]]){R(b,lx-1,ly-34,3,34,'#3a3040');ell(b,lx,ly,6,3,'#2b2233');R(b,lx-7,ly-44,15,10,'#2b2233');R(b,lx-6,ly-43,13,8,'#ffe3a0');R(b,lx-6,ly-43,13,2,'#fff4cf');}
  // door
  R(b,40,0,0,0,'#000');
}
function ell(g,cx,cy,rx,ry,c){g.fillStyle=c;for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(1-(y*y)/(ry*ry)));g.fillRect(cx-w,cy+y,w*2,1)}}
function desk(x,y,w,c){R(b,x,y+28,w,4,'#0003');R(b,x-1,y-1,w+2,26,'#2b1a10');R(b,x,y,w,14,c);R(b,x,y,w,2,'#c48a55');R(b,x,y+14,w,10,'#6b4024');R(b,x+4,y+16,w-8,1,'#875230');R(b,x+2,y+24,4,6,'#4a2c18');R(b,x+w-6,y+24,4,6,'#4a2c18');}
function chair(x,y,c){ell(b,x,y+8,9,3,'#0003');R(b,x-8,y-8,16,14,'#1a1220');R(b,x-7,y-7,14,12,c);R(b,x-7,y-7,14,2,'#fff3');R(b,x-1,y+5,2,4,'#333');R(b,x-6,y+8,12,2,'#333');}
function plant(x,y,k){ell(b,x,y+2,9,3,'#0003');R(b,x-6,y-10,12,12,'#2b1a10');R(b,x-5,y-9,10,10,k==2?'#d9a35a':'#c0623a');R(b,x-5,y-9,10,2,'#e0845a');
  const cs=['#2f8a4e','#3fa85e','#5cc46e','#246b3c'];for(let i=0;i<22;i++){const a=rnd()*6.28,r=rnd()*(k==1?10:7);R(b,x+Math.cos(a)*r-2,y-16-Math.abs(Math.sin(a)*r)*(k==1?1.4:1)-rnd()*4,4,4,cs[i%4]);}
  if(k==2)for(let i=0;i<4;i++)R(b,x-5+rnd()*10,y-22+rnd()*8,2,2,'#ff8fb8');}
// ---------- characters ----------
const CH={
 David:{role:'ผู้จัดการทีม · ดูภาพรวมและคุณภาพงาน',skin:'#ffd9b8',hair:'#5a3a22',top:'#2b3d6b',top2:'#3a5290',pants:'#22283a',accent:'#d83a3a',style:'short',glasses:1,seat:{x:332,y:138},col:'#4f8be8'},
 Kim:{role:'นักล่าข่าว · ไล่อ่านข่าว/อัลฟ่าบน X',skin:'#f5cfa8',hair:'#1e1a26',top:'#3e9a5a',top2:'#56b872',pants:'#3a5a8a',accent:'#f2e6c8',style:'spiky',phones:1,seat:{x:208,y:242},col:'#3fc06e'},
 Jane:{role:'นักวิเคราะห์ · ดูกราฟ ประเมินกำไร/ความเสี่ยง',skin:'#ffe0c4',hair:'#9a4a2a',top:'#e86a9a',top2:'#f590b6',pants:'#3a2a4a',accent:'#fff',style:'long',seat:{x:448,y:242},col:'#ff7fb0'}};
const spr={};
function sprite(n,dir,f,pose){const k=n+dir+f+pose;if(spr[k])return spr[k];
  const c=document.createElement('canvas');c.width=22;c.height=34;const g=c.getContext('2d'),p=CH[n];
  const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  const side=dir==2||dir==3,back=dir==1;const bob=(pose=='walk'&&f%2)?1:0;
  if(p.style=='long'&&!side){r(4,8+bob,14,16,p.hair)}
  if(p.style=='long'&&side){r(5,8+bob,10,15,p.hair)}
  // legs
  if(pose!='sit'){const l1=pose=='walk'?[0,-2,0,1][f]:0,l2=pose=='walk'?[0,1,0,-2][f]:0;
    if(side){r(8,25+Math.min(0,l1),3,6,p.pants);r(11,25+Math.min(0,l2),3,6,p.pants);r(side&&dir==3?8:7,30+Math.min(0,l1),5,2,'#2b1a10');r(11,30+Math.min(0,l2),4,2,'#2b1a10')}
    else{r(7,25,3,6+l1*0,p.pants);r(12,25,3,6,p.pants);r(6,30+(l1<0?-1:0),5,2,'#2b1a10');r(11,30+(l2<0?-1:0),5,2,'#2b1a10');}
    if(n=='Jane')r(6,24,10,4,p.pants);}
  else{r(6,25,10,4,p.pants);}
  // body
  const by=15+bob;
  if(side){r(7,by,8,10,p.top);r(7,by,8,2,p.top2)}else{r(5,by,12,10,p.top);r(5,by,12,2,p.top2);}
  if(!back&&!side){if(n=='David'){r(9,by,4,5,'#fff');r(10,by+1,2,6,p.accent)}if(n=='Kim'){r(8,by+1,1,4,p.accent);r(13,by+1,1,4,p.accent);r(7,by+6,8,3,p.top2)}if(n=='Jane'){r(8,by,6,2,'#fff');r(10,by+4,2,2,'#ffd34a')}}
  // arms
  const sw=pose=='walk'?[0,1,0,-1][f]:0;
  if(pose=='type'){const a=f%2;r(3,by+1,2,6,p.top);r(17,by+1,2,6,p.top);r(4,by+6-a,3,2,p.skin);r(15,by+5+a,3,2,p.skin)}
  else if(pose=='sip'){r(3,by+1,2,7,p.top);r(3,by+8,2,2,p.skin);r(16,by+1,3,3,p.top);r(15,by-1,3,3,p.skin);r(15,by-4,4,4,'#fff');r(16,by-4,2,1,'#6b3a1a');r(19,by-3,1,2,'#fff')}
  else if(side){r(10,by+2+sw,3,7,p.top2);r(10,by+8+sw,3,2,p.skin)}
  else{r(3,by+1+sw,2,7,p.top);r(17,by+1-sw,2,7,p.top);r(3,by+8+sw,2,2,p.skin);r(17,by+8-sw,2,2,p.skin)}
  // head
  const hy=3+bob;r(5,hy,12,12,p.skin);
  if(back){r(5,hy-1,12,12,p.hair);r(4,hy+1,14,8,p.hair)}
  else{
    if(p.style=='short'){r(4,hy-1,14,5,p.hair);r(4,hy+3,2,4,p.hair);r(16,hy+3,2,3,p.hair);r(9,hy+3,6,1,p.hair)}
    if(p.style=='spiky'){r(4,hy-1,14,5,p.hair);r(5,hy-3,2,2,p.hair);r(9,hy-3,3,2,p.hair);r(14,hy-3,2,2,p.hair);r(4,hy+3,2,3,p.hair);r(16,hy+3,2,3,p.hair);r(6,hy+4,3,1,p.hair)}
    if(p.style=='long'){r(4,hy-1,14,5,p.hair);r(4,hy+3,3,10,p.hair);r(15,hy+3,3,10,p.hair);r(7,hy+3,4,2,p.hair);r(15,hy-1,2,2,'#ff7fb0')}
    if(side){r(5,hy+4,5,8,p.hair);if(p.style!='long')r(5,hy+4,3,6,p.hair);r(14,hy+7,2,3,'#1a1220');r(14,hy+7,1,1,'#fff');r(15,hy+10,2,1,'#f08a8a')}
    else{r(7,hy+6,2,3,'#1a1220');r(13,hy+6,2,3,'#1a1220');r(7,hy+6,1,1,'#fff');r(13,hy+6,1,1,'#fff');r(6,hy+9,2,1,'#f5a0a0');r(14,hy+9,2,1,'#f5a0a0');r(10,hy+10,2,1,'#b0604a');
      if(p.glasses){r(6,hy+5,4,1,'#1a1220');r(12,hy+5,4,1,'#1a1220');r(10,hy+6,2,1,'#1a1220')}}}
  if(p.phones){r(3,hy+4,3,5,'#3fc06e');r(16,hy+4,3,5,'#3fc06e');r(4,hy-2,14,1,'#2b2233')}
  if(dir==2){const t=document.createElement('canvas');t.width=22;t.height=34;const tg=t.getContext('2d');tg.translate(22,0);tg.scale(-1,1);tg.drawImage(c,0,0);g.clearRect(0,0,22,34);g.drawImage(t,0,0)}
  // outline
  const d=g.getImageData(0,0,22,34),a=d.data,o=new Uint8ClampedArray(a);
  for(let y=0;y<34;y++)for(let x=0;x<22;x++){const i=(y*22+x)*4;if(a[i+3])continue;
    if((x>0&&a[i-1])||(x<21&&a[i+7])||(y>0&&a[i-88+3])||(y<33&&a[i+88+3])){o[i]=26;o[i+1]=18;o[i+2]=32;o[i+3]=255}}
  g.putImageData(new ImageData(o,22,34),0,0);return spr[k]=c;}
const SPOTS={coffee:{x:60,y:88,say:'☕ ชงกาแฟ'},water:{x:46,y:150,say:'💧 กดน้ำ'},table:{x:72,y:228,say:'🍪 พักกินขนม'},sofa:{x:334,y:346,say:'🛋️ พักสายตา'},window:{x:272,y:68,say:'🌤️ ดูวิว'}};
const bots=Object.keys(CH).map((n,i)=>({n,x:CH[n].seat.x,y:CH[n].seat.y,dir:1,state:'work',t:4+i*5+Math.random()*6,path:[],f:0,ft:0,say:null}));
function plan(bt){const opts=['coffee','water','table','sofa','window','visit','visit'];let o=opts[Math.floor(Math.random()*opts.length)],tg;
  if(o=='visit'){const other=bots.filter(x=>x!==bt)[Math.floor(Math.random()*2)];const s=CH[other.n].seat;tg={x:s.x+(s.x>300?-22:22),y:s.y+4,say:'💬 คุยกับ '+other.n}}else tg=SPOTS[o];
  bt.path=[{x:bt.x,y:AISLE},{x:tg.x,y:AISLE},{x:tg.x,y:tg.y}];bt.goal=tg;bt.state='walk';bt.say=tg.say}
function home(bt){const s=CH[bt.n].seat;bt.path=[{x:bt.x,y:AISLE},{x:s.x,y:AISLE},{x:s.x,y:s.y}];bt.state='walk';bt.goal=null;bt.say='🚶 กลับโต๊ะ'}
function update(dt){for(const bt of bots){bt.ft+=dt;
  if(bt.state=='walk'){const p=bt.path[0];if(!p){if(bt.goal){bt.state='idle';bt.t=4+Math.random()*4;bt.dir=0}else{bt.state='work';bt.t=14+Math.random()*20;bt.dir=1;bt.say=null}continue}
    const dx=p.x-bt.x,dy=p.y-bt.y,d=Math.hypot(dx,dy),sp=34*dt;if(d<=sp){bt.x=p.x;bt.y=p.y;bt.path.shift()}else{bt.x+=dx/d*sp;bt.y+=dy/d*sp;bt.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?2:3):(dy<0?1:0)}
    if(bt.ft>.14){bt.ft=0;bt.f=(bt.f+1)%4}}
  else{bt.t-=dt;if(bt.ft>(bt.state=='work'?.18:.6)){bt.ft=0;bt.f=(bt.f+1)%4}if(bt.t<=0){bt.state=='work'?plan(bt):home(bt)}}}}
// ---------- dynamic world ----------
let time=0;
function drawWorld(){const g=wx;g.drawImage(bg,0,0);
  // screens
  // Kim: news monitors
  for(let m=0;m<2;m++){const x=184+m*26,y=186;R(g,x,y,22,16,'#1a1220');R(g,x+1,y+1,20,13,'#0e2433');for(let i=0;i<5;i++){const w=6+((i*7+Math.floor(time*3)+m*3)%12);R(g,x+3,y+3+i*2.4,w,1,i==0?'#7fc8ff':'#cfe8ff')}R(g,x+9,y+16,4,4,'#333');}
  R(g,190,206,28,4,'#ddd');
  // Jane: chart monitors
  for(let m=0;m<3;m++){const x=418+m*20,y=184;R(g,x,y,19,16,'#1a1220');R(g,x+1,y+1,17,13,'#0d1d16');let py=y+8;for(let i=0;i<15;i++){const ny=y+7+Math.sin(time*1.5+i*.7+m*2)*3+Math.sin(i*1.3+m)*2;R(g,x+2+i,Math.min(py,ny),1,Math.abs(ny-py)+1,ny<py?'#3fe07a':'#ff5a6a');py=ny}R(g,x+8,y+16,3,4,'#333');}
  // David laptop glow
  R(g,308,98,16,8,Math.sin(time*2)>0?'#9ad0ff':'#b5ddff');R(g,310,100,8,1,'#fff');R(g,310,102,10,1,'#3a7be0');
  // coffee machine + steam
  R(g,24,24,22,20,'#2b2233');R(g,26,26,18,10,'#5a5a66');R(g,30,28,10,4,'#3fe07a');R(g,30,38,8,6,'#fff');
  for(let i=0;i<3;i++){const s=(time*12+i*6)%18;g.globalAlpha=1-s/18;R(g,33+Math.sin(time*3+i)*2,36-s-4,2,2,'#fff');}g.globalAlpha=1;
  // clock
  ell(g,140,-0,0,0,'#000');const cx=444,cy=18;ell(g,cx,cy,9,9,'#5a3820');ell(g,cx,cy,7,7,'#fffaf0');const d=new Date(),hr=(d.getHours()%12+d.getMinutes()/60)/12*6.283,mn=d.getMinutes()/60*6.283;
  for(let i=0;i<5;i++){R(g,cx+Math.sin(hr)*i*.8,cy-Math.cos(hr)*i*.8,1,1,'#1a1220')}for(let i=0;i<7;i++){R(g,cx+Math.sin(mn)*i*.9,cy-Math.cos(mn)*i*.9,1,1,'#d83a3a')}
  // characters sorted by y
  for(const bt of [...bots].sort((a,c)=>a.y-c.y)){let pose='stand',dir=bt.dir;
    if(bt.state=='walk')pose='walk';else if(bt.state=='work'){pose='type';dir=1}else if(bt.goal&&/กาแฟ|กดน้ำ|ขนม/.test(bt.goal.say))pose='sip';
    if(bt.state=='work'&&bt.n=='Jane'&&Math.floor(time/6)%3==2)pose='sip',dir=1;
    const s=sprite(bt.n,dir,pose=='walk'||pose=='type'?bt.f:0,pose=='type'&&dir==1?'type':pose);
    ell(g,Math.round(bt.x),Math.round(bt.y)+1,7,2,'#0004');g.drawImage(s,Math.round(bt.x)-11,Math.round(bt.y)-33+(bt.state=='work'?-2:0));}
  // lighting
  const h=new Date().getHours()+new Date().getMinutes()/60;const night=h<6||h>=19?.5:h<7||h>=18?.25:0;
  g.save();g.globalCompositeOperation='lighter';
  for(const x of [176,248,392]){g.globalAlpha=night?.03:.10;g.fillStyle='#fff3c4';g.beginPath();g.moveTo(x,44);g.lineTo(x+48,44);g.lineTo(x+78,140);g.lineTo(x+20,140);g.fill();}
  g.globalAlpha=1;g.restore();
  if(night){g.fillStyle=`rgba(20,20,60,${night})`;g.fillRect(0,0,W,H);}
  g.save();g.globalCompositeOperation='lighter';
  for(const[lx,ly,r]of[[244,108,60],[500,198,60],[140,258,56],[35,30,30],[198,194,26],[447,192,30],[316,100,24]]){const gr=g.createRadialGradient(lx,ly,2,lx,ly,r);gr.addColorStop(0,`rgba(255,200,110,${.12+night*.35})`);gr.addColorStop(1,'rgba(255,200,110,0)');g.fillStyle=gr;g.fillRect(lx-r,ly-r,r*2,r*2);}
  g.restore();
  // dust motes
  for(let i=0;i<14;i++){const x=(i*53+time*4)%W,y=60+((i*97+time*6)%300);g.globalAlpha=.25+.2*Math.sin(time+i);R(g,x,y,1,1,'#fff7d0')}g.globalAlpha=1;
}
// ---------- camera ----------
let dpr=1,vw=0,vh=0,cam={x:W/2,y:H/2,z:2};
function limits(){const fit=Math.min(vw/W,vh/H);return{min:fit*.9,max:8}}
function coverZ(){return Math.min(Math.max(vw/W,vh/H),vw<600?2.6:3)}
function resetCam(){if(vw<600){cam.z=1.45;cam.x=328;cam.y=190}else{cam.z=Math.max(Math.min(vw/W,vh/H)*1.05,1);cam.x=W/2;cam.y=H/2-10}clampCam()}
function clampCam(){const L=limits();cam.z=Math.max(L.min,Math.min(L.max,cam.z));const hw=vw/2/cam.z,hh=vh/2/cam.z;
  cam.x=hw*2>=W?W/2:Math.max(hw,Math.min(W-hw,cam.x));cam.y=hh*2>=H?H/2:Math.max(hh,Math.min(H-hh,cam.y))}
function resize(){dpr=window.devicePixelRatio||1;vw=innerWidth;vh=innerHeight;cv.width=Math.round(vw*dpr);cv.height=Math.round(vh*dpr);if(!resize.done){resetCam();resize.done=1}clampCam()}
const toWorld=(sx,sy)=>({x:cam.x+(sx-vw/2)/cam.z,y:cam.y+(sy-vh/2)/cam.z});
const toScreen=(x,y)=>({x:(x-cam.x)*cam.z+vw/2,y:(y-cam.y)*cam.z+vh/2});
function zoomAt(sx,sy,nz){const before=toWorld(sx,sy);const L=limits();cam.z=Math.max(L.min,Math.min(L.max,nz));const after=toWorld(sx,sy);cam.x+=before.x-after.x;cam.y+=before.y-after.y;clampCam()}
// ---------- input ----------
const ptrs=new Map();let pinch=null,tap=null,lastTap=0;
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size==1)tap={x:e.clientX,y:e.clientY,t:performance.now(),moved:false};else{tap=null;const[a,c]=[...ptrs.values()];pinch={d:Math.hypot(a.x-c.x,a.y-c.y),z:cam.z}}hideHint()});
cv.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(ptrs.size==1){cam.x-=dx/cam.z;cam.y-=dy/cam.z;clampCam();if(tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>8)tap.moved=true}
  else if(pinch&&ptrs.size==2){const[a,c]=[...ptrs.values()];const d=Math.hypot(a.x-c.x,a.y-c.y);zoomAt((a.x+c.x)/2,(a.y+c.y)/2,pinch.z*d/pinch.d);if(e.pointerId==[...ptrs.keys()][0]){}}});
function up(e){ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;
  if(tap&&!tap.moved&&ptrs.size==0&&performance.now()-tap.t<350){const now=performance.now();
    if(now-lastTap<320){resetCam();lastTap=0;hideCard()}else{lastTap=now;hit(e.clientX,e.clientY)}}tap=null}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);pinch=null;tap=null});
cv.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,cam.z*Math.exp(-e.deltaY*.0015));hideHint()},{passive:false});
document.getElementById('zin').onclick=()=>zoomAt(vw/2,vh/2,cam.z*1.3);
document.getElementById('zout').onclick=()=>zoomAt(vw/2,vh/2,cam.z/1.3);
document.getElementById('zreset').onclick=()=>{resetCam();hideCard()};
document.getElementById('bfit').onclick=()=>{cam.z=limits().min/.9;cam.x=W/2;cam.y=H/2;clampCam()};
document.querySelectorAll('[data-f]').forEach(el=>el.onclick=()=>focusBot(el.dataset.f));
function focusBot(n){const bt=bots.find(x=>x.n==n);cam.z=Math.max(cam.z,3.2);cam.x=bt.x;cam.y=bt.y-14;clampCam();showCard(n)}
function hit(sx,sy){const w=toWorld(sx,sy);let best=null,bd=1e9;for(const bt of bots){const dx=w.x-bt.x,dy=w.y-(bt.y-15);if(Math.abs(dx)<12&&Math.abs(dy)<19){const d=dx*dx+dy*dy;if(d<bd){bd=d;best=bt}}}best?showCard(best.n):hideCard()}
let hintT=setTimeout(hideHint,7000);function hideHint(){document.getElementById('hint').style.opacity=0}
// ---------- UI ----------
const $=id=>document.getElementById(id);let cardFor=null;
function drawAvatar(cvs,n){const g=cvs.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,20,24);g.drawImage(sprite(n,0,0,'stand'),-1,0,22,34)}
function showCard(n){cardFor=n;drawAvatar($('avatar'),n);$('cname').textContent=n;$('cname').style.color=CH[n].col;$('crole').textContent=CH[n].role;fillCard();$('card').classList.remove('hidden')}
function fillCard(){if(!cardFor)return;const bt=bots.find(x=>x.n==cardFor);$('cstat').textContent='📌 '+(status[cardFor]||'—')+(bt.say?'  ('+bt.say+')':'');$('ctime').textContent='อัปเดตล่าสุด: '+(status.updated||'—')+' (เวลาไทย)'}
function hideCard(){cardFor=null;$('card').classList.add('hidden')}$('cardx').onclick=hideCard;
const bubLayer=$('bubbles'),bubs={},tags={};
for(const n in CH){const d=document.createElement('div');d.className='bub '+n;bubLayer.appendChild(d);bubs[n]=d;const t=document.createElement('div');t.className='tag';t.textContent=n;t.style.color=CH[n].col;bubLayer.appendChild(t);tags[n]=t}
function renderTasks(){$('tasklist').innerHTML=Object.keys(CH).map(n=>`<div class="task" data-n="${n}"><b style="color:${CH[n].col}">● ${n}</b> <span class="d">${CH[n].role.split(' · ')[0]}</span><div>${esc(status[n]||'—')}</div></div>`).join('');
  document.querySelectorAll('.task').forEach(el=>el.onclick=()=>focusBot(el.dataset.n));$('upd').textContent='🕒 อัปเดต '+(status.updated||'—');}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function poll(){try{const r=await fetch('status.json?t='+Date.now(),{cache:'no-store'});if(r.ok){status=await r.json();renderTasks();fillCard()}}catch(e){$('upd').textContent='⚠️ โหลดสถานะไม่ได้'}}
document.querySelector('.th').onclick=()=>document.querySelector('.tasks').classList.toggle('closed');if(innerWidth<600)document.querySelector('.tasks').classList.add('closed');
poll();setInterval(poll,8000);drawAvatar($('meav'),'David');
// minimap
const mini=$('mini');mini.width=W/4;mini.height=H/4;const mg=mini.getContext('2d');
function drawMini(){mg.imageSmoothingEnabled=true;mg.drawImage(bg,0,0,W/4,H/4);for(const bt of bots){mg.fillStyle='#1a1220';mg.fillRect(bt.x/4-3,bt.y/4-6,6,6);mg.fillStyle=CH[bt.n].col;mg.fillRect(bt.x/4-2,bt.y/4-5,4,4)}
  const a=toWorld(0,0),c=toWorld(vw,vh);mg.strokeStyle='#ffe69a';mg.lineWidth=1;mg.strokeRect(Math.max(0,a.x/4)+.5,Math.max(0,a.y/4)+.5,Math.min(W,c.x)/4-Math.max(0,a.x/4)-1,Math.min(H,c.y)/4-Math.max(0,a.y/4)-1)}
mini.addEventListener('click',e=>{const r=mini.getBoundingClientRect();cam.x=(e.clientX-r.left)/r.width*W;cam.y=(e.clientY-r.top)/r.height*H;clampCam()});
// ---------- loop ----------
let last=performance.now(),mt=0;
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;time+=dt;update(dt);drawWorld();
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0b1d1f';ctx.fillRect(0,0,cv.width,cv.height);ctx.imageSmoothingEnabled=false;
  const s=cam.z*dpr;ctx.setTransform(s,0,0,s,Math.round((vw/2-cam.x*cam.z)*dpr),Math.round((vh/2-cam.y*cam.z)*dpr));ctx.drawImage(world,0,0);
  for(const bt of bots){const p=toScreen(bt.x,bt.y-36),q=toScreen(bt.x,bt.y+2);const txt=bt.say||status[bt.n]||'';const B=bubs[bt.n];
    const html=`<b>${bt.n}</b>${esc(txt)}`;if(B._h!==html){B.innerHTML=html;B._h=html}B.style.left=p.x+'px';B.style.top=(p.y-4)+'px';B.style.opacity=cam.z<1.6?0:1;B.style.fontSize=Math.max(10,Math.min(13,cam.z*4))+'px';
    tags[bt.n].style.left=q.x+'px';tags[bt.n].style.top=(q.y+2)+'px';tags[bt.n].style.opacity=cam.z<1.6?0:1}
  if((mt+=dt)>.25){mt=0;drawMini();const d=new Date();$('clock').textContent=d.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});$('tbar').style.width=((d.getHours()*60+d.getMinutes())/1440*100)+'%';const h=d.getHours();$('dn').textContent=h>=6&&h<18?'กลางวัน ☀️':'กลางคืน 🌙'}
  requestAnimationFrame(frame)}
addEventListener('resize',resize);resize();drawBG();renderTasks();drawMini();requestAnimationFrame(frame);
