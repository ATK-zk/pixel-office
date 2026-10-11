'use strict';
// ---- v18 modern restyle of the flat v11 office ----
Object.assign(PAL,{oak:['#9aa4b4','#e4e8ee','#f2f5fa','#ffffff'],wood:['#3a3f4a','#5a606c','#7a828e','#9aa2ae'],woodD:['#2a2e36','#3a3f4a','#5a606c','#8a92a0'],teal:['#2a2e38','#3a4252','#56607a','#7a86a0']});
planks=function(x0,y0,x1,y1){for(let y=y0;y<y1;y+=24)for(let x=x0;x<x1;x+=24){const v=((x*7+y*3)/24)%3;const xa=Math.max(x,x0),ya=Math.max(y,y0),w=Math.min(24,x1-xa),h=Math.min(24,y1-ya);R(b,xa,ya,w,h,['#cfd3d8','#d6dade','#c9cdd3'][v|0]);R(b,xa,ya,w,1,'#e8ebee');R(b,xa,ya,1,h,'#e2e5e9');R(b,xa+w-1,ya,1,h,'#b4b9c0');R(b,xa,ya+h-1,w,1,'#b4b9c0');dith(b,xa+3,ya+3,6,3,'#eef0f2')}};
carpet=function(x0,y0,x1,y1){R(b,x0,y0,x1-x0,y1-y0,'#5a6478');for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const v=(x*7+y*13)%23;if(v==0)P(b,x,y,'#6a7690');else if(v==11)P(b,x,y,'#4a5468')}};
rug=function(x,y,w,h){R(b,x,y,w,h,'#3a4a5e');R(b,x+3,y+3,w-6,h-6,'#4a5d74');R(b,x+3,y+3,w-6,1,'#6a7f98');dith(b,x+6,y+6,w-12,h-12,'#55697f')};
halfWall=function(x,y0,y1){R(b,x+2,y0,10,y1-y0+4,'#0002');R(b,x,y0,8,y1-y0,'#a8d8ec');R(b,x+1,y0,6,y1-y0,'#c8ecf8');for(let y=y0+4;y<y1;y+=14)R(b,x+2,y,1,6,'#fff');R(b,x,y0,8,2,'#5a606c');R(b,x,y1-2,8,2,'#5a606c');R(b,x,y0,1,y1-y0,'#7a8494');R(b,x+7,y0,1,y1-y0,'#7a8494')};
chairProp=function(){return prop(22,30,(g)=>{const r=PAL.dark;box(g,3,2,16,16,r);R(g,5,4,12,2,r[3]);dith(g,5,8,12,8,r[0],1);R(g,4,18,14,4,r[0]);R(g,10,22,2,4,PAL.metal[1]);R(g,5,26,12,2,PAL.metal[0]);P(g,5,27,PAL.metal[2]);P(g,16,27,PAL.metal[2])},11,28)};
_s=11;b.clearRect(0,0,W,H);fg.clearRect(0,0,W,H);buildBG();
(function(){const wg=b.createLinearGradient(0,0,0,56);wg.addColorStop(0,'#f2f4f6');wg.addColorStop(1,'#dfe3e8');b.fillStyle=wg;b.fillRect(180,0,W-180,56);R(b,0,56,W,16,'#3a3f4a');R(b,0,56,W,2,'#8a92a0');R(b,0,70,W,2,'#22262e');
 for(const[x,y,w,h]of WINS)box(b,x-8,y+h+3,w+16,5,PAL.white);
 fg.clearRect(0,0,W,H);for(const[x,y,w,h]of WINS){fg.fillStyle='#2a2e38';fg.fillRect(x-3,y-3,w+6,3);fg.fillRect(x-3,y+h,w+6,3);fg.fillRect(x-3,y,3,h);fg.fillRect(x+w,y,3,h);for(let k=x+w/(w>150?4:2);k<x+w-2;k+=w/(w>150?4:2))fg.fillRect(k-1,y,2,h);fg.fillStyle='#ffffff26';for(let k=0;k<h;k++)fg.fillRect(x+8+k*.6,y+k,3,1)}
 box(b,748,12,14,18,PAL.dark);R(b,750,14,10,14,'#7fc8ff');R(b,752,22,2,4,'#2f8a4e')})();
PROPS.length=0;_s=11;buildProps();
for(const p of PROPS){if(p.c.width>4)softShadow(b,p.x-p.ox+p.c.width/2,p.y-2,p.c.width*.45,4,.3)}
for(const l of [[90,150,80],[90,250,80],[60,330,70],[100,420,80],[90,530,70],[690,160,80],[700,260,80],[690,360,80],[700,460,80],[720,540,70],[300,520,70],[480,520,70]])LIGHTS.push([l[0],l[1],l[2],'255,236,200']);nightK=-1;tickClock();
vg2.clearRect(0,0,W,H);{const gr=vg2.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,W*.75);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(10,4,20,.15)');vg2.fillStyle=gr;vg2.fillRect(0,0,W,H)}

// v16: wall-mounted portfolio display (replaces TV chart + floor sign), phone fit-whole-room view
const TVR=[442,8,134,44];
const _dsW=drawScreens;drawScreens=function(g){_dsW(g);R(g,432,2,148,56,'#e9ecef');box(g,TVR[0],TVR[1],TVR[2],TVR[3],PAL.dark);R(g,TVR[0]+2,TVR[1]+2,TVR[2]-4,TVR[3]-4,'#09111d');R(g,TVR[0]+TVR[2]/2-4,TVR[1]+TVR[3],8,3,PAL.metal[0])};
$('board').classList.add('wall');
placeBoard=function(){const B=$('board');const p=toScreen(TVR[0]+TVR[2]/2,TVR[1]+TVR[3]/2);const w=B._w||(B._w=B.offsetWidth),h=B._h||(B._h=B.offsetHeight);
  const s=TVR[2]*cam.z/w,sy=TVR[3]*cam.z/h;B.style.transformOrigin='50% 50%';B.style.transform=`translate(${(p.x-w/2)|0}px,${(p.y-h/2)|0}px) scale(${s.toFixed(3)},${sy.toFixed(3)})`};
homeCam=function(){const x0=196,x1=604,y0=0,y1=440;const z=Math.min(vw/(x1-x0),(vh-(vw<600?150:60))/(y1-y0));return{z,x:(x0+x1)/2,y:(y0+y1)/2+(vw<600?20:0)}};
limits=function(){const fit=Math.min(vw/W,vh/H);return{min:fit*.98,max:7}};
// bubbles: allow at phone fit-zoom with compact size
placeDom=(function(orig){return function(){orig();if(cam.z<0.9){for(const bt of bots){const B=bubs[bt.n];const q=toScreen(bt.x,bt.y-40);B.style.opacity=bt.hidden?0:1;B.classList.add('mini')}document.querySelectorAll('.tag').forEach(t=>t.style.opacity=1)}else for(const n in bubs)bubs[n].classList.remove('mini')}})(placeDom);
resize.done=0;resize();Object.assign(tcam,cam);
