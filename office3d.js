import * as THREE from 'three';
import {OrbitControls} from './vendor/jsm/controls/OrbitControls.js';
import {GLTFLoader} from './vendor/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from './vendor/jsm/utils/SkeletonUtils.js';
import {RoomEnvironment} from './vendor/jsm/environments/RoomEnvironment.js';
import {EffectComposer} from './vendor/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from './vendor/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from './vendor/jsm/postprocessing/UnrealBloomPass.js';
import {GTAOPass} from './vendor/jsm/postprocessing/GTAOPass.js';
import {OutputPass} from './vendor/jsm/postprocessing/OutputPass.js';

const $=id=>document.getElementById(id);
const LS=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}};
const SV=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const isPhone=matchMedia('(pointer:coarse)').matches||Math.min(screen.width,screen.height)<700;
const V='?v=12';

// ---------- renderer (with WebGL fallback) ----------
let renderer;
try{
  renderer=new THREE.WebGLRenderer({canvas:$('c'),antialias:true,powerPreference:'high-performance'});
  if(!renderer.getContext())throw new Error('no ctx');
}catch(e){$('loading').classList.add('hidden');$('fail').classList.remove('hidden');throw e}
$('c').addEventListener('webglcontextlost',e=>{e.preventDefault();$('fail').classList.remove('hidden')});
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;

const scene=new THREE.Scene();
const pmrem=new THREE.PMREMGenerator(renderer);
scene.environment=pmrem.fromScene(new RoomEnvironment(),0.04).texture;
scene.environmentIntensity=0.35;
scene.background=new THREE.Color('#1c1611');
scene.fog=new THREE.Fog('#1c1611',60,110);

const camera=new THREE.PerspectiveCamera(30,1,0.5,200);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=0.08;
controls.minPolarAngle=0.35;controls.maxPolarAngle=1.25;
controls.minDistance=8;controls.maxDistance=95;controls.screenSpacePanning=false;
controls.minAzimuthAngle=-0.35;controls.maxAzimuthAngle=1.45;
controls.touches={ONE:THREE.TOUCH.ROTATE,TWO:THREE.TOUCH.DOLLY_PAN};
const HOME_T=new THREE.Vector3(0.5,0.6,0.3);
function homeDist(){const a=innerWidth/innerHeight;return a<0.6?90:a<1.2?48:36}
function resetCam(instant){const d=homeDist(),az=innerWidth/innerHeight<0.8?0.45:0.62,po=innerWidth/innerHeight<0.8?0.78:0.92;
  const a0=innerWidth/innerHeight;HOME_T.set(a0<0.8?-1.0:0.5,0.6,a0<0.8?0.6:0.3);const p=new THREE.Vector3(Math.sin(po)*Math.sin(az),Math.cos(po),Math.sin(po)*Math.cos(az)).multiplyScalar(d).add(HOME_T);
  flyTo(p,HOME_T.clone(),instant)}
let fly=null;
function flyTo(pos,tgt,instant){if(instant){camera.position.copy(pos);controls.target.copy(tgt);controls.update();return}
  fly={p0:camera.position.clone(),t0:controls.target.clone(),p1:pos,t1:tgt,k:0}}

// ---------- materials & helpers ----------
const texL=new THREE.TextureLoader();
function tex(u,rep,srgb){const t=texL.load(u+V);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}
const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.7,metalness:0},o));
function box(w,h,d,mat,x,y,z,parent=scene,cast=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;parent.add(m);return m}
function cyl(rt,rb,h,mat,x,y,z,parent=scene,seg=16){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
// rounded box
function rbox(w,h,d,r,mat,x,y,z,parent=scene){const s=new THREE.Shape(),hw=w/2-r,hh=d/2-r;
  s.absarc(hw,hh,r,0,Math.PI/2);s.absarc(-hw,hh,r,Math.PI/2,Math.PI);s.absarc(-hw,-hh,r,Math.PI,1.5*Math.PI);s.absarc(hw,-hh,r,1.5*Math.PI,2*Math.PI);
  const g=new THREE.ExtrudeGeometry(s,{depth:h-r*0.6,bevelEnabled:true,bevelThickness:r*0.3,bevelSize:r*0.3,bevelSegments:3,curveSegments:6});
  g.rotateX(-Math.PI/2);g.translate(0,-h/2+r*0.3,0);const m=new THREE.Mesh(g,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m}

// ---------- room ----------
const RW=22,RD=16,WH=5.2; // x -11..11, z -8..8
const floorMat=new THREE.MeshStandardMaterial({map:tex('tex/wood_floor_diff_1k.jpg',[5,4],true),roughnessMap:tex('tex/wood_floor_rough_1k.jpg',[5,4]),normalMap:tex('tex/wood_floor_nor_gl_1k.jpg',[5,4]),color:'#e8c9a4'});
const floor=new THREE.Mesh(new THREE.BoxGeometry(RW,0.3,RD),floorMat);floor.position.y=-0.15;floor.receiveShadow=true;scene.add(floor);
const wallMat=new THREE.MeshStandardMaterial({map:tex('tex/beige_wall_001_diff_1k.jpg',[4,1.2],true),normalMap:tex('tex/beige_wall_001_nor_gl_1k.jpg',[4,1.2]),color:'#f3e3cf',roughness:.95});
const wallMat2=wallMat.clone();wallMat2.color=new THREE.Color('#dcd0e8');
const trim=M('#6b4630',{roughness:.5});
// plinth (base under the cutaway diorama)
box(RW+0.6,0.8,RD+0.6,M('#3a2a20',{roughness:.9}),0,-0.7,0,scene,false);
// back wall with window hole: window x -7..1, y 1.2..4.2
const BZ=-RD/2;
box(RW,1.2,0.3,wallMat,0,0.6,BZ);box(RW,WH-4.2,0.3,wallMat,0,4.2+(WH-4.2)/2,BZ);
box(4,3,0.3,wallMat,-9,2.7,BZ);box(10,3,0.3,wallMat,6,2.7,BZ);
box(0.3,WH,RD,wallMat2,-RW/2,WH/2,0);
// baseboards
box(RW,0.18,0.06,trim,0,0.09,BZ+0.18,scene,false);box(0.06,0.18,RD,trim,-RW/2+0.18,0.09,0,scene,false);
// window frame + mullions
const frameM=M('#f5efe6',{roughness:.4});
box(8.3,0.18,0.45,frameM,-3,1.15,BZ+0.05);box(8.3,0.18,0.4,frameM,-3,4.25,BZ);box(0.16,3.2,0.4,frameM,-7.05,2.7,BZ);box(0.16,3.2,0.4,frameM,0.95,2.7,BZ);
box(0.1,3,0.3,frameM,-3,2.7,BZ);box(8,0.08,0.3,frameM,-3,3.2,BZ);
const glass=new THREE.Mesh(new THREE.PlaneGeometry(8,3),new THREE.MeshPhysicalMaterial({color:'#bfe0ff',transparent:true,opacity:.12,roughness:.05,metalness:0}));glass.position.set(-3,2.7,BZ);scene.add(glass);
// sky + city outside
const skyC=document.createElement('canvas');skyC.width=256;skyC.height=256;const skyX=skyC.getContext('2d');const skyT=new THREE.CanvasTexture(skyC);skyT.colorSpace=THREE.SRGBColorSpace;
const sky=new THREE.Mesh(new THREE.PlaneGeometry(8.4,3.4),new THREE.MeshBasicMaterial({map:skyT,fog:false}));sky.position.set(-3,2.7,BZ-0.5);scene.add(sky);
const sunDisc=new THREE.Mesh(new THREE.CircleGeometry(0.28,24),new THREE.MeshBasicMaterial({color:'#fff2c0',fog:false}));scene.add(sunDisc);
const cityC=document.createElement('canvas');cityC.width=512;cityC.height=256;const cityT=new THREE.CanvasTexture(cityC);cityT.colorSpace=THREE.SRGBColorSpace;
const cityMat=new THREE.MeshBasicMaterial({map:cityT,transparent:true,fog:false});
const city=new THREE.Mesh(new THREE.PlaneGeometry(8.4,2.2),cityMat);city.position.set(-3,2.1,BZ-0.4);scene.add(city);
const cityBlds=[];{let x=0;while(x<512){const w=24+Math.random()*46,h=50+Math.random()*170;cityBlds.push({x,w,h,seed:Math.random()*1e4});x+=w+2+Math.random()*6}}
function drawCity(night){const g=cityC.getContext('2d');g.clearRect(0,0,512,256);
  for(const b of cityBlds){g.fillStyle=night?'#141a2e':'#7f8fa8';g.fillRect(b.x,256-b.h,b.w,b.h);g.fillStyle=night?'#1d2540':'#93a3bb';g.fillRect(b.x,256-b.h,3,b.h);
    for(let y=256-b.h+8;y<250;y+=10)for(let x=b.x+5;x<b.x+b.w-5;x+=8){const r=Math.sin(b.seed+x*12.9+y*78.2)*43758.5%1;
      if(night){if(Math.abs(r)<.45){g.fillStyle=Math.abs(r)<.1?'#ffd9a0':'#ffc46a';g.fillRect(x,y,4,5)}}else{g.fillStyle='#b8cde0';g.fillRect(x,y,4,5)}}}
  cityT.needsUpdate=true}
// curtains
const curM=M('#c9604a',{roughness:.9,side:THREE.DoubleSide});
for(const cx of[-7.6,1.5]){const g=new THREE.CylinderGeometry(0.45,0.55,3.6,12,1,true,0,Math.PI);const m=new THREE.Mesh(g,curM);m.position.set(cx,2.6,BZ+0.35);m.rotation.y=Math.PI;m.castShadow=true;scene.add(m)}
box(9.6,0.08,0.08,M('#3a2a20',{metalness:.6,roughness:.3}),-3,4.45,BZ+0.35,scene,false);

// ---------- light ----------
const hemi=new THREE.HemisphereLight('#fff1dc','#4a3020',0.5);scene.add(hemi);
const sun=new THREE.DirectionalLight('#ffe2b8',2.2);sun.castShadow=true;
sun.shadow.mapSize.set(isPhone?1024:2048,isPhone?1024:2048);sun.shadow.camera.left=-14;sun.shadow.camera.right=14;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.camera.near=1;sun.shadow.camera.far=60;sun.shadow.bias=-0.0005;sun.shadow.normalBias=0.03;sun.shadow.radius=4;
scene.add(sun);scene.add(sun.target);
const fill=new THREE.DirectionalLight('#9fb8ff',0.35);fill.position.set(14,10,16);scene.add(fill);
// ceiling lamp lights (warm)
const warm=[];
function lampLight(x,z,i=3.5,d=11){const l=new THREE.PointLight('#ffb866',i,d,1.6);l.position.set(x,3.6,z);scene.add(l);warm.push(l);return l}
lampLight(-6,-2);lampLight(-1,2.5);lampLight(6,3);

// ---------- desks ----------
const DESKS=[ // seat position (x,z), desk faces -x (person looks toward -x)
 {n:'David',x:-3.0,z:-4.6},{n:'Kim',x:-7.2,z:-4.6},{n:'Jane',x:-7.2,z:-0.8},{n:'Alex',x:-3.0,z:-0.8},{n:'Jhon',x:-7.2,z:3.0},{n:'Su',x:-3.0,z:3.0}];
const COL={David:'#4a7fd6',Kim:'#2fa866',Jane:'#e0609a',Alex:'#f0a040',Jhon:'#e05050',Su:'#9a70e0'};
const ROLE={David:'หัวหน้าทีม · ตรวจแผนรอบสุดท้าย วางออร์เดอร์จริง',Kim:'นักข่าว · ข่าวที่กระทบสินทรัพย์บน Perps',Jane:'นักคัดสินทรัพย์ · เลือกตัวเทรด',Alex:'นักเทคนิค · จุดเข้า stop เป้า',Jhon:'คุมความเสี่ยง · อนุมัติขนาดไม้',Su:'บันทึกเทรด · ค่าธรรมเนียม อัตราชนะ'};
const deskTop=M('#d9b48a',{roughness:.45});const deskLeg=M('#2a2420',{metalness:.7,roughness:.35});
const chairM=M('#2d3440',{roughness:.6});
const monitors=[];
function chart(n){const c=document.createElement('canvas');c.width=256;c.height=160;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
  const o={c,g:c.getContext('2d'),t,data:[],p:100,col:COL[n],n,kind:['candle','line','bars'][monitors.length%3]};for(let i=0;i<40;i++)pushData(o);return o}
function pushData(o){const op=o.p;o.p+= (Math.random()-.48)*3;o.data.push({o:op,c:o.p,h:Math.max(op,o.p)+Math.random()*1.5,l:Math.min(op,o.p)-Math.random()*1.5});if(o.data.length>40)o.data.shift()}
function drawChart(o){const g=o.g;g.fillStyle='#0b1220';g.fillRect(0,0,256,160);g.strokeStyle='#ffffff10';g.lineWidth=1;for(let y=20;y<160;y+=24){g.beginPath();g.moveTo(0,y);g.lineTo(256,y);g.stroke()}
  let mn=1e9,mx=-1e9;for(const d of o.data){mn=Math.min(mn,d.l);mx=Math.max(mx,d.h)}const Y=v=>140-(v-mn)/(mx-mn+1e-6)*110;
  if(o.kind=='line'){g.strokeStyle=o.col;g.lineWidth=3;g.beginPath();o.data.forEach((d,i)=>{const x=8+i*6;i?g.lineTo(x,Y(d.c)):g.moveTo(x,Y(d.c))});g.stroke();
    g.lineTo(8+39*6,150);g.lineTo(8,150);g.fillStyle=o.col+'33';g.fill()}
  else if(o.kind=='bars'){o.data.forEach((d,i)=>{const up=d.c>=d.o;g.fillStyle=up?'#36d399':'#f87272';const h=Math.abs(d.c-d.o)*14+4;g.fillRect(8+i*6,150-h,4,h)})}
  else o.data.forEach((d,i)=>{const up=d.c>=d.o,x=8+i*6;g.strokeStyle=g.fillStyle=up?'#36d399':'#f87272';g.beginPath();g.moveTo(x+2,Y(d.h));g.lineTo(x+2,Y(d.l));g.stroke();const a=Y(Math.max(d.o,d.c)),b=Y(Math.min(d.o,d.c));g.fillRect(x,a,5,Math.max(2,b-a))});
  g.fillStyle='#fff';g.font='bold 15px sans-serif';g.fillText(o.n+' · '+['BTC','ETH','GOLD','SOL','NVDA','SP500'][monitors.indexOf(o)%6],8,17);
  const last=o.data[o.data.length-1];g.fillStyle=last.c>=last.o?'#36d399':'#f87272';g.fillText((last.c).toFixed(2),190,17);o.t.needsUpdate=true}
function makeDesk(d){const g=new THREE.Group();g.position.set(d.x,0,d.z);scene.add(g);
  // desk: in front of seat toward -x
  rbox(1.3,0.08,2.4,0.04,deskTop,-1.05,0.78,0,g);
  for(const sz of[-1.05,1.05]){box(0.06,0.76,0.06,deskLeg,-1.6,0.38,sz,g);box(0.06,0.76,0.06,deskLeg,-0.5,0.38,sz,g)}
  box(0.04,0.5,2.2,M('#c9a47a'),-1.65,0.5,0,g);
  // monitor
  const ch=chart(d.n);monitors.push(ch);
  const mg=new THREE.Group();mg.position.set(-1.45,0.82,0);g.add(mg);
  box(0.25,0.03,0.4,deskLeg,0,0.015,0,mg);box(0.05,0.4,0.05,deskLeg,0,0.22,0,mg);
  box(0.06,0.86,1.45,M('#15171c',{roughness:.3,metalness:.4}),0.03,0.78,0,mg);
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(1.32,0.78),new THREE.MeshBasicMaterial({map:ch.t,toneMapped:false}));scr.position.set(0.08,0.78,0);scr.rotation.y=Math.PI/2;mg.add(scr);
  const glow=new THREE.PointLight(COL[d.n],0.6,2.5,2);glow.position.set(0.5,0.8,0);mg.add(glow);
  // keyboard, mug, papers, desk lamp
  box(0.22,0.025,0.65,M('#e8e8ea',{roughness:.5}),-0.72,0.83,0,g);box(0.12,0.02,0.08,M('#ddd'),-0.72,0.83,0.5,g);
  const mug=cyl(0.06,0.055,0.13,M(COL[d.n],{roughness:.35}),-0.85,0.885,-0.8,g);
  box(0.3,0.01,0.22,M('#fafafa'),-1.0,0.825,0.75,g).rotation.y=0.3;
  const lamp=new THREE.Group();lamp.position.set(-1.45,0.82,0.95);g.add(lamp);cyl(0.1,0.12,0.03,deskLeg,0,0.015,0,lamp);
  const arm=cyl(0.015,0.015,0.5,deskLeg,0.08,0.26,0,lamp);arm.rotation.z=-0.3;
  const shade=cyl(0.04,0.13,0.14,M('#f2c94c',{roughness:.4}),0.22,0.5,0,lamp);shade.rotation.z=0.6;
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(0.05,8,8),new THREE.MeshBasicMaterial({color:'#fff0c0'}));bulb.position.set(0.26,0.44,0);lamp.add(bulb);
  // chair at seat (0,0)
  const cg=new THREE.Group();g.add(cg);cyl(0.05,0.05,0.4,deskLeg,0,0.22,0,cg);
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const leg=box(0.3,0.04,0.05,deskLeg,Math.cos(a)*0.15,0.04,Math.sin(a)*0.15,cg);leg.rotation.y=-a}
  rbox(0.55,0.1,0.55,0.05,chairM,0,0.46,0,cg);rbox(0.08,0.65,0.55,0.04,chairM,0.3,0.85,0,cg).rotation.z=-0.1;
  d.chair=cg;d.group=g;
  // name plate
  const pc=document.createElement('canvas');pc.width=128;pc.height=32;const px=pc.getContext('2d');px.fillStyle=COL[d.n];px.fillRect(0,0,128,32);px.fillStyle='#fff';px.font='bold 20px sans-serif';px.textAlign='center';px.fillText(d.n,64,23);
  const pt=new THREE.CanvasTexture(pc);pt.colorSpace=THREE.SRGBColorSpace;const plate=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.15),new THREE.MeshBasicMaterial({map:pt}));plate.position.set(-1.69,0.6,0);plate.rotation.y=-Math.PI/2;g.add(plate)}
DESKS.forEach(makeDesk);

// ---------- wall TV with live candles (left wall) ----------
const tvC=chart('Market');tvC.c.width=512;tvC.c.height=256;tvC.kind='candle';
const tv=new THREE.Group();tv.position.set(-RW/2+0.2,2.9,0.6);scene.add(tv);
box(0.1,1.9,3.3,M('#0f1014',{metalness:.5,roughness:.3}),0,0,0,tv);
const tvScr=new THREE.Mesh(new THREE.PlaneGeometry(3.1,1.7),new THREE.MeshBasicMaterial({map:tvC.t,toneMapped:false}));tvScr.position.x=0.06;tvScr.rotation.y=Math.PI/2;tv.add(tvScr);
function drawTV(){const o=tvC,g=o.g,W=512,H=256;g.fillStyle='#070b16';g.fillRect(0,0,W,H);let mn=1e9,mx=-1e9;for(const d of o.data){mn=Math.min(mn,d.l);mx=Math.max(mx,d.h)}
  const Y=v=>H-24-(v-mn)/(mx-mn+1e-6)*(H-70);g.strokeStyle='#ffffff12';for(let y=40;y<H;y+=36){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
  o.data.forEach((d,i)=>{const up=d.c>=d.o,x=12+i*12.3;g.strokeStyle=g.fillStyle=up?'#36d399':'#f87272';g.lineWidth=2;g.beginPath();g.moveTo(x+4,Y(d.h));g.lineTo(x+4,Y(d.l));g.stroke();const a=Y(Math.max(d.o,d.c)),b=Y(Math.min(d.o,d.c));g.fillRect(x,a,9,Math.max(3,b-a))});
  g.fillStyle='#ffd36b';g.font='bold 24px sans-serif';g.fillText('POLYMARKET PERPS · LIVE DESK',14,30);g.fillStyle='#ffffff80';g.font='14px sans-serif';g.fillText('ภาพประกอบ ไม่ใช่ราคาจริง',W-170,30);o.t.needsUpdate=true}

// ---------- portfolio sign (center, free-standing) ----------
const SIGN={x:2.6,z:-1.2};
const signC=document.createElement('canvas');signC.width=512;signC.height=300;const signT=new THREE.CanvasTexture(signC);signT.colorSpace=THREE.SRGBColorSpace;
const sg=new THREE.Group();sg.position.set(SIGN.x,0,SIGN.z);sg.rotation.y=0.45;scene.add(sg);
cyl(0.55,0.65,0.25,M('#2a2420',{metalness:.6,roughness:.3}),0,0.125,0,sg,32);cyl(0.06,0.06,1.6,M('#b8862e',{metalness:.9,roughness:.25}),0,1.0,0,sg);
rbox(2.6,0.12,1.56,0.05,M('#b8862e',{metalness:.85,roughness:.25}),0,2.45,0,sg).rotation.x=Math.PI/2;
const signFace=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.4),new THREE.MeshBasicMaterial({map:signT,toneMapped:false}));signFace.position.set(0,2.45,0.08);sg.add(signFace);
const signBack=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.4),new THREE.MeshBasicMaterial({map:signT,toneMapped:false}));signBack.position.set(0,2.45,-0.08);signBack.rotation.y=Math.PI;sg.add(signBack);
let status={};
function drawSign(){const g=signC.getContext('2d'),W=512,H=300;const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#2a1c12');gr.addColorStop(1,'#120c08');g.fillStyle=gr;g.fillRect(0,0,W,H);
  g.strokeStyle='#f0c060';g.lineWidth=6;g.strokeRect(10,10,W-20,H-20);g.textAlign='center';
  g.fillStyle='#ffe08a';g.font='bold 34px Mali, sans-serif';g.fillText('💰 พอร์ต Polymarket Perps',W/2,62);
  const v=+status.portfolio,s=+status.portfolio_start;g.font='bold 86px Mali, sans-serif';g.fillStyle='#fff';g.fillText(isFinite(v)?'$'+v.toFixed(2):'—',W/2,160);
  if(isFinite(v)&&isFinite(s)&&s){const p=(v-s)/s*100,dv=v-s;g.font='bold 34px Mali, sans-serif';g.fillStyle=dv>=0?'#36d399':'#f87272';g.fillText((dv>=0?'▲ +':'▼ ')+dv.toFixed(2)+' ('+(p>=0?'+':'')+p.toFixed(2)+'%)',W/2,212)}
  g.font='24px Mali, sans-serif';g.fillStyle='#c9b48a';g.fillText('อัปเดต '+(status.portfolio_updated||'—'),W/2,262);signT.needsUpdate=true}

// ---------- bathroom (back-right) ----------
const BX0=6.4,BZ1=-3.0; // bathroom x 6.4..11, z -8..-3
const tileC=document.createElement('canvas');tileC.width=tileC.height=64;{const g=tileC.getContext('2d');g.fillStyle='#dfeef0';g.fillRect(0,0,64,64);g.fillStyle='#b9d3d8';g.fillRect(0,0,64,2);g.fillRect(0,0,2,64);g.fillRect(0,31,64,2);g.fillRect(31,0,2,64)}
const tileT=new THREE.CanvasTexture(tileC);tileT.wrapS=tileT.wrapT=THREE.RepeatWrapping;tileT.repeat.set(3,3);tileT.colorSpace=THREE.SRGBColorSpace;
const bf=new THREE.Mesh(new THREE.PlaneGeometry(RW/2-BX0,BZ1-BZ),M('#fff',{map:tileT,roughness:.25}));bf.rotation.x=-Math.PI/2;bf.position.set((BX0+RW/2)/2,0.012,(BZ+BZ1)/2);bf.receiveShadow=true;scene.add(bf);
const partM=M('#9cc7cf',{roughness:.6});
box(0.15,2.6,BZ1-BZ,partM,BX0,1.3,(BZ+BZ1)/2);
box(1.4,2.6,0.15,partM,BX0+0.7,1.3,BZ1);box(2.2,2.6,0.15,partM,RW/2-1.1,1.3,BZ1); // door gap x 7.8..8.8
const door=box(1.0,2.2,0.06,M('#7a5236'),8.3,1.1,BZ1+0.45);door.rotation.y=-1.2;door.position.x=7.85;
const toiletM=M('#ffffff',{roughness:.2});
cyl(0.28,0.22,0.45,toiletM,9.6,0.225,-6.8);rbox(0.6,0.7,0.25,0.06,toiletM,9.6,0.75,-7.6);box(0.55,0.04,0.55,M('#eee'),9.6,0.47,-6.75);
box(0.9,0.12,0.5,toiletM,7.4,0.95,-7.5);cyl(0.08,0.12,0.9,toiletM,7.4,0.45,-7.5);cyl(0.015,0.015,0.2,M('#ccc',{metalness:1,roughness:.2}),7.4,1.1,-7.65);
const mirror=new THREE.Mesh(new THREE.PlaneGeometry(0.8,1.0),new THREE.MeshStandardMaterial({color:'#cfe8ff',metalness:1,roughness:.05}));mirror.position.set(7.4,1.8,BZ+0.17);scene.add(mirror);
const wcC=document.createElement('canvas');wcC.width=128;wcC.height=64;{const g=wcC.getContext('2d');g.fillStyle='#2a5d66';g.fillRect(0,0,128,64);g.fillStyle='#fff';g.font='bold 30px sans-serif';g.textAlign='center';g.fillText('🚻 WC',64,44)}
const wcT=new THREE.CanvasTexture(wcC);wcT.colorSpace=THREE.SRGBColorSpace;const wc=new THREE.Mesh(new THREE.PlaneGeometry(0.8,0.4),new THREE.MeshBasicMaterial({map:wcT}));wc.position.set(8.3,2.85,BZ1+0.09);scene.add(wc);
lampLight(8.7,-5.5,1.6,6);

// ---------- lounge / coffee (front right) ----------
const sofaM=M('#3f6f68',{roughness:.85});
rbox(3.2,0.45,1.0,0.12,sofaM,8.6,0.35,5.6);rbox(3.2,0.8,0.3,0.12,sofaM,8.6,0.75,6.25);rbox(0.3,0.6,1.0,0.12,sofaM,7.1,0.55,5.6);rbox(0.3,0.6,1.0,0.12,sofaM,10.1,0.55,5.6);
for(const x of[7.9,9.3])rbox(0.6,0.5,0.18,0.08,M(x<8.5?'#e8b04a':'#d96a5a',{roughness:.9}),x,0.85,6.0).rotation.x=-0.2;
rbox(1.6,0.08,0.8,0.04,M('#6b4630',{roughness:.4}),8.6,0.45,3.9);for(const[x,z]of[[7.95,3.6],[9.25,3.6],[7.95,4.2],[9.25,4.2]])cyl(0.03,0.03,0.42,deskLeg,x,0.21,z);
const rug=new THREE.Mesh(new THREE.CircleGeometry(2.2,48),M('#c8a070',{roughness:1}));rug.rotation.x=-Math.PI/2;rug.position.set(8.6,0.011,4.6);rug.receiveShadow=true;scene.add(rug);
const rug2=new THREE.Mesh(new THREE.RingGeometry(1.9,2.05,48),M('#8a4a3a',{roughness:1}));rug2.rotation.x=-Math.PI/2;rug2.position.set(8.6,0.013,4.6);scene.add(rug2);
// coffee station against back-right of lounge (x 3.5..5.5, z -7.6)
rbox(2.6,0.95,0.7,0.04,M('#4b3a30',{roughness:.6}),3.6,0.475,-7.45);rbox(2.7,0.06,0.78,0.02,M('#e6e2da',{roughness:.3}),3.6,0.98,-7.45);
rbox(0.5,0.6,0.45,0.05,M('#202226',{metalness:.6,roughness:.3}),3.0,1.31,-7.5);const cml=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,8),new THREE.MeshBasicMaterial({color:'#ff4040'}));cml.position.set(3.0,1.45,-7.26);scene.add(cml);
cyl(0.18,0.18,0.9,M('#9bd0ff',{transparent:true,opacity:.6,roughness:.05}),4.6,1.5,-7.5);cyl(0.2,0.2,0.04,M('#ddd'),4.6,1.03,-7.5);
for(let i=0;i<3;i++)cyl(0.05,0.045,0.11,M(['#fff','#f2c94c','#e05050'][i]),3.7+i*0.18,1.065,-7.25);
const steam=[];for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(0.05,8,8),new THREE.MeshBasicMaterial({color:'#fff',transparent:true,opacity:.3,depthWrite:false}));scene.add(s);steam.push(s)}
// bookshelf on left wall front
const shelf=new THREE.Group();shelf.position.set(-RW/2+0.4,0,6.2);scene.add(shelf);
box(0.6,2.8,2.2,M('#6b4630'),0,1.4,0,shelf);for(let y=0.3;y<2.8;y+=0.62){box(0.55,0.05,2.1,M('#8a5d3c'),0.04,y,0,shelf);let z=-0.95;while(z<0.9){const w=0.06+Math.random()*0.08,h=0.3+Math.random()*0.22;
  box(0.4,h,w,M(new THREE.Color().setHSL(Math.random(),.45,.45)),0.05,y+0.03+h/2,z+w/2,shelf).rotation.x=Math.random()<.1?0.2:0;z+=w+0.01}}
// clock on left wall
const clkC=document.createElement('canvas');clkC.width=clkC.height=128;const clkT=new THREE.CanvasTexture(clkC);clkT.colorSpace=THREE.SRGBColorSpace;
const clk=new THREE.Mesh(new THREE.CircleGeometry(0.5,32),new THREE.MeshBasicMaterial({map:clkT}));clk.position.set(-RW/2+0.17,3.4,-4.5);clk.rotation.y=Math.PI/2;scene.add(clk);
cyl(0.55,0.55,0.06,M('#3a2a20'),-RW/2+0.16,3.4,-4.5).rotation.z=Math.PI/2;
function drawClock(h,m){const g=clkC.getContext('2d');g.fillStyle='#fffaf0';g.beginPath();g.arc(64,64,62,0,7);g.fill();g.fillStyle='#333';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.fillRect(64+Math.sin(a)*52-2,64-Math.cos(a)*52-2,4,4)}
  const hand=(a,l,w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(64,64);g.lineTo(64+Math.sin(a)*l,64-Math.cos(a)*l);g.stroke()};
  hand((h%12+m/60)/12*Math.PI*2,30,6,'#222');hand(m/60*Math.PI*2,46,4,'#222');clkT.needsUpdate=true}
// plants
const potM=M('#c9764a',{roughness:.8}),leafM=M('#3f8f4a',{roughness:.7,flatShading:true}),leafM2=M('#5aae5a',{roughness:.7,flatShading:true});
const plants=[];
function plant(x,z,s=1,kind=0){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);cyl(0.32,0.24,0.55,potM,0,0.275,0,g,12);cyl(0.3,0.3,0.03,M('#3a2a1a'),0,0.54,0,g);
  if(kind==0){for(let i=0;i<14;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,6),i%2?leafM:leafM2);l.scale.set(0.8,0.18,2.2);const a=i/14*Math.PI*2*1.6;l.position.set(Math.cos(a)*0.32,0.95+Math.random()*0.5,Math.sin(a)*0.32);l.rotation.set(0.6*Math.sin(a),-a,0.5);l.castShadow=true;g.add(l);
    const st=cyl(0.015,0.015,0.6,M('#3a6a2a'),Math.cos(a)*0.15,0.8,Math.sin(a)*0.15,g,5)}}
  else{for(let i=0;i<5;i++){const l=new THREE.Mesh(new THREE.IcosahedronGeometry(0.4-i*0.05,0),i%2?leafM:leafM2);l.position.set((Math.random()-.5)*0.2,0.9+i*0.35,(Math.random()-.5)*0.2);l.castShadow=true;g.add(l)}}
  plants.push(g);return g}
plant(-9.8,-7.1,1.2,0);plant(1.8,-7.3,1,1);plant(10.3,2.4,1.1,0);plant(5.6,7.2,0.9,1);plant(-0.4,6.9,1,0);plant(-5.1,6.9,0.8,1);
// hanging pendant lamps
if(0)for(const[x,z]of[]){cyl(0.01,0.01,1.2,deskLeg,x,4.6,z);const sh=cyl(0.15,0.45,0.35,M('#1f2d2a',{roughness:.4,metalness:.3,side:THREE.DoubleSide}),x,3.85,z,scene,20);sh.castShadow=false;
  const b=new THREE.Mesh(new THREE.SphereGeometry(0.11,12,12),new THREE.MeshBasicMaterial({color:'#ffd9a0'}));b.position.set(x,3.7,z);scene.add(b);b.userData.bulb=1;warm.push({bulb:b})}

// meeting table
{const mt=new THREE.Group();mt.position.set(1.6,0,4.2);scene.add(mt);cyl(1.15,1.15,0.07,M('#b98a5e',{roughness:.35}),0,0.76,0,mt,40);cyl(0.08,0.12,0.74,deskLeg,0,0.37,0,mt);cyl(0.5,0.55,0.04,deskLeg,0,0.02,0,mt,24);
 for(let i=0;i<4;i++){const a=i/4*Math.PI*2+0.4;const st=new THREE.Group();st.position.set(Math.cos(a)*1.55,0,Math.sin(a)*1.55);mt.add(st);cyl(0.24,0.22,0.08,M(['#e8b04a','#3f6f68','#d96a5a','#7a8fd0'][i],{roughness:.8}),0,0.48,0,st,16);cyl(0.03,0.03,0.46,deskLeg,0,0.23,0,st)}
 box(0.5,0.02,0.35,M('#fff'),0.3,0.805,-0.2,mt).rotation.y=0.4;const lap=box(0.45,0.02,0.32,M('#c0c4cc',{metalness:.7,roughness:.3}),-0.4,0.805,0.2,mt);
 cyl(0.05,0.045,0.11,M('#fff'),0.1,0.85,0.5,mt);const vase=cyl(0.08,0.06,0.25,M('#4a8fd0',{roughness:.2}),0,0.92,0,mt);
 for(let k=0;k<5;k++){const fl=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),M(['#ff7aa2','#ffd166','#fff'][k%3]));fl.position.set(Math.cos(k)*0.08,1.12+k%2*0.06,Math.sin(k)*0.08);mt.add(fl)}}
// ---------- walk grid (A*) ----------
const CELL=0.4,GX0=-RW/2,GZ0=-RD/2,GW=Math.round(RW/CELL),GD=Math.round(RD/CELL);const grid=new Uint8Array(GW*GD);
function block(x0,z0,x1,z1){for(let i=Math.floor((x0-GX0)/CELL);i<=Math.floor((x1-GX0)/CELL);i++)for(let j=Math.floor((z0-GZ0)/CELL);j<=Math.floor((z1-GZ0)/CELL);j++)if(i>=0&&j>=0&&i<GW&&j<GD)grid[j*GW+i]=1}
block(GX0,GZ0,GX0+0.5,GZ0+RD);block(GX0,GZ0,GX0+RW,GZ0+0.5);block(RW/2-0.4,GZ0,RW/2,RD/2);block(GX0,RD/2-0.4,RW/2,RD/2);
for(const d of DESKS)block(d.x-1.8,d.z-1.3,d.x-0.35,d.z+1.3);
block(0.2,2.8,3.0,5.6);block(SIGN.x-0.8,SIGN.z-0.8,SIGN.x+0.8,SIGN.z+0.8);
block(BX0-0.2,GZ0,BX0+0.2,BZ1);block(BX0,BZ1-0.2,7.7,BZ1+0.2);block(8.9,BZ1-0.2,RW/2,BZ1+0.2);block(9.2,-8,10,-6.3);block(6.9,-8,7.9,-7.1);
block(6.9,5.0,10.4,6.6);block(7.7,3.4,9.5,4.4);block(2.2,-8,5,-7);block(-RW/2,5,-RW/2+0.9,7.4);
for(const p of plants)block(p.position.x-0.45,p.position.z-0.45,p.position.x+0.45,p.position.z+0.45);
const cellOf=(x,z)=>[Math.min(GW-1,Math.max(0,Math.floor((x-GX0)/CELL))),Math.min(GD-1,Math.max(0,Math.floor((z-GZ0)/CELL)))];
function findPath(ax,az,bx,bz){const[si,sj]=cellOf(ax,az),[ti,tj]=cellOf(bx,bz);const N=GW*GD,g=new Float32Array(N).fill(1e9),came=new Int32Array(N).fill(-1),open=[];const s=sj*GW+si,t=tj*GW+ti;
  g[s]=0;open.push([0,s]);const closed=new Uint8Array(N);
  while(open.length){let bi=0;for(let k=1;k<open.length;k++)if(open[k][0]<open[bi][0])bi=k;const[,c]=open.splice(bi,1)[0];if(c==t)break;if(closed[c])continue;closed[c]=1;const ci=c%GW,cj=(c/GW)|0;
    for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const ni=ci+di,nj=cj+dj;if(ni<0||nj<0||ni>=GW||nj>=GD)continue;const n=nj*GW+ni;if(grid[n]&&n!=t)continue;
      if(di&&dj&&(grid[cj*GW+ni]||grid[nj*GW+ci]))continue;const ng=g[c]+(di&&dj?1.414:1);if(ng<g[n]){g[n]=ng;came[n]=c;open.push([ng+Math.hypot(ni-ti,nj-tj),n])}}}
  if(came[t]<0&&s!=t)return[{x:bx,z:bz}];const pts=[];for(let c=t;c!=-1&&c!=s;c=came[c])pts.push({x:GX0+(c%GW+.5)*CELL,z:GZ0+((c/GW)|0+.5)*CELL});pts.reverse();
  // string-pull simplification
  const out=[];let i=0;while(i<pts.length){let j=pts.length-1;while(j>i+1&&!los(pts[i],pts[j]))j--;out.push(pts[j]);i=j+1}if(out.length)out[out.length-1]={x:bx,z:bz};return out}
function los(a,b){const n=Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/(CELL*0.5));for(let k=1;k<n;k++){const[i,j]=cellOf(a.x+(b.x-a.x)*k/n,a.z+(b.z-a.z)*k/n);if(grid[j*GW+i])return false}return true}

// ---------- spots characters visit ----------
const SPOTS={coffee:{x:3.6,z:-6.4,face:Math.PI,act:'☕ ชงกาแฟ',dur:[6,10]},wc:{x:8.3,z:-5.2,face:Math.PI,act:'🚻 เข้าห้องน้ำ',dur:[6,9],hide:true},
 window:{x:-3.4,z:-6.9,face:Math.PI,act:'🌇 ยืนมองวิว',dur:[5,9]},sofa:{x:8.0,z:4.9,face:Math.PI,act:'🛋️ พักบนโซฟา',dur:[8,14],sit:true},
 tv:{x:-8.4,z:0.6,face:-Math.PI/2,act:'📺 ดูกราฟบนจอใหญ่',dur:[5,8]},sign:{x:SIGN.x+0.6,z:SIGN.z+1.6,face:Math.PI*0.9,act:'💰 เช็กพอร์ต',dur:[4,6]},
 shelf:{x:-9.6,z:4.6,face:-Math.PI/2,act:'📚 หาหนังสือ',dur:[4,7]},plant:{x:9.6,z:1.6,face:0.8,act:'🪴 รดน้ำต้นไม้',dur:[4,6]},meet:{x:1.6,z:6.0,face:Math.PI,act:'🗣️ ประชุมย่อยที่โต๊ะกลาง',dur:[6,10]},meet2:{x:-0.2,z:4.2,face:Math.PI/2,act:'🗣️ ประชุมย่อยที่โต๊ะกลาง',dur:[6,10]}};

// ---------- cat ----------
const cat=new THREE.Group();scene.add(cat);{const fur=M('#e8964a',{roughness:.9}),fur2=M('#fff4e6',{roughness:.9}),blk=new THREE.MeshBasicMaterial({color:'#111'});
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(0.16,0.35,6,12),fur);body.rotation.x=Math.PI/2;body.position.y=0.28;body.castShadow=true;cat.add(body);
  const head=new THREE.Group();head.position.set(0,0.42,0.32);cat.add(head);const hm=new THREE.Mesh(new THREE.SphereGeometry(0.15,16,12),fur);hm.castShadow=true;head.add(hm);
  const mz=new THREE.Mesh(new THREE.SphereGeometry(0.07,10,8),fur2);mz.position.set(0,-0.04,0.11);head.add(mz);
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.12,4),fur);e.position.set(s*0.08,0.14,0);e.rotation.z=-s*0.3;head.add(e);const ey=new THREE.Mesh(new THREE.SphereGeometry(0.022,8,6),blk);ey.position.set(s*0.06,0.02,0.13);head.add(ey);ey.userData.eye=1}
  const legs=[];for(const[x,z]of[[-.09,.2],[.09,.2],[-.09,-.18],[.09,-.18]]){const l=new THREE.Mesh(new THREE.CapsuleGeometry(0.04,0.14,4,6),z>0?fur2:fur);l.position.set(x,0.1,z);cat.add(l);legs.push(l)}
  const tail=new THREE.Group();tail.position.set(0,0.32,-0.3);cat.add(tail);const tm=new THREE.Mesh(new THREE.CapsuleGeometry(0.035,0.4,4,6),fur);tm.position.y=0.2;tail.add(tm);
  cat.userData={head,legs,tail,body};cat.position.set(6,0,1);}
const catS={state:'nap',t:4,path:[],speed:1.1};

// ---------- characters ----------
const bots=[];const DPOS={};DESKS.forEach(d=>DPOS[d.n]=d);
let robotGLTF=null;
const loader=new GLTFLoader();
function loadRobot(){return new Promise((res,rej)=>loader.load('vendor/RobotExpressive.glb'+V,res,undefined,rej))}
function makeBot(n,i){const root=SkeletonUtils.clone(robotGLTF.scene);
  root.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(root);const s=1.55/(bb.max.y-bb.min.y);root.scale.setScalar(s);
  const g=new THREE.Group();g.add(root);scene.add(g);
  const tint=new THREE.Color(COL[n]);
  root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false;o.receiveShadow=true;const m=o.material.clone();
    if(m.name=='Main'){m.color=tint.clone();m.roughness=.45;m.metalness=.1}else if(m.name=='Grey'){m.color=new THREE.Color('#f2efe9');m.roughness=.4}
    o.material=m;if(o.morphTargetDictionary)g.userData.face=o}});
  const mixer=new THREE.AnimationMixer(root);const A={};for(const c of robotGLTF.animations)A[c.name]=mixer.clipAction(c);
  A.Sitting.setLoop(THREE.LoopOnce);A.Sitting.clampWhenFinished=true;for(const k of['Wave','Yes','No','ThumbsUp','Jump','Standing'])if(A[k]){A[k].setLoop(THREE.LoopOnce);A[k].clampWhenFinished=true}
  const bones={};root.traverse(o=>{if(o.isBone)bones[o.name]=o});
  const d=DPOS[n];const b={n,g,root,mixer,A,cur:null,bones,state:'sit',t:3+Math.random()*20,path:[],speed:1.5+Math.random()*0.3,pos:new THREE.Vector3(d.x,0,d.z),yaw:-Math.PI/2,act:'💻 ทำงานที่โต๊ะ',typing:true,phase:Math.random()*10,chatWith:null};
  g.position.copy(b.pos);g.rotation.y=b.yaw;play(b,'Sitting',0);b.A.Sitting.time=b.A.Sitting.getClip().duration;
  // label + bubble DOM
  b.tag=document.createElement('div');b.tag.className='tag';b.tag.style.setProperty('--c',COL[n]);b.tag.textContent=n;$('labels').appendChild(b.tag);
  b.bub=document.createElement('div');b.bub.className='bub';b.bub.style.setProperty('--c',COL[n]);$('bubbles').appendChild(b.bub);
  b.tag.style.pointerEvents='auto';b.tag.onclick=()=>showCard(n);
  bots.push(b);return b}
function play(b,name,fade=0.35){const a=b.A[name];if(!a||b.cur===a)return;a.reset();a.enabled=true;a.setEffectiveWeight(1);a.play();if(b.cur)b.cur.crossFadeTo(a,fade,false);b.cur=a;b.curName=name}
function goTo(b,spotKey){const sp=spotKey=='desk'?{x:DPOS[b.n].x,z:DPOS[b.n].z}:SPOTS[spotKey];b.target=spotKey;
  // stand up first
  if(b.state=='sit'||b.state=='sofa'){b.state='standup';b.t=0.9;play(b,'Idle',0.5);DPOS[b.n].chair.position.x=0;return}
  b.path=findPath(b.pos.x,b.pos.z,sp.x,sp.z);b.state='walk';play(b,'Walking',0.3)}
function arrive(b){const k=b.target;
  if(k=='desk'){b.state='sit';b.yaw=-Math.PI/2;b.pos.set(DPOS[b.n].x,0,DPOS[b.n].z);play(b,'Sitting',0.4);b.t=25+Math.random()*50;b.act='💻 ทำงานที่โต๊ะ';AUD.blip(420);return}
  const sp=SPOTS[k];b.yaw=sp.face;b.act=sp.act;b.t=sp.dur[0]+Math.random()*(sp.dur[1]-sp.dur[0]);
  if(sp.sit){b.state='sofa';play(b,'Sitting',0.4)}else{b.state='idle';play(b,'Idle',0.4);if(k=='sign'&&Math.random()<.6)setTimeout(()=>{if(b.state=='idle')play(b,Math.random()<.5?'ThumbsUp':'Yes',0.2)},600)}
  if(sp.hide)b.hidden=true}
const busy={};
function pickSpot(b){const keys=Object.keys(SPOTS).filter(k=>!busy[k]||busy[k]==b.n);const k=keys[Math.floor(Math.random()*keys.length)];
  for(const kk in busy)if(busy[kk]==b.n)delete busy[kk];busy[k]=b.n;return k}
function nearestChat(b){for(const o of bots)if(o!==b&&(o.state=='idle')&&o.pos.distanceTo(b.pos)<2.2&&!o.chatWith)return o;return null}
function updBot(b,dt,time){b.mixer.update(dt);
  b.t-=dt;
  if(b.state=='sit'||b.state=='sofa'){ if(b.t<=0)goTo(b,b.state=='sofa'?'desk':pickSpot(b))}
  else if(b.state=='standup'){if(b.t<=0){const k=b.target;b.state='walk';const sp=k=='desk'?DPOS[b.n]:SPOTS[k];b.pos.x+=0.35;b.path=findPath(b.pos.x,b.pos.z,sp.x,sp.z);play(b,'Walking',0.3)}}
  else if(b.state=='walk'){const p=b.path[0];if(!p){arrive(b)}else{const dx=p.x-b.pos.x,dz=p.z-b.pos.z,dist=Math.hypot(dx,dz);
      const want=Math.atan2(dx,dz);let dy=want-b.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));b.yaw+=dy*Math.min(1,dt*8);
      const st=Math.min(dist,b.speed*dt*(Math.abs(dy)>1.2?0.3:1));b.pos.x+=dx/dist*st||0;b.pos.z+=dz/dist*st||0;if(dist<0.08)b.path.shift();
      b.hidden=false;b.act='🚶 เดินไป'+(b.target=='desk'?'โต๊ะ':SPOTS[b.target].act.split(' ').slice(1).join(' '));
      b.stepT=(b.stepT||0)+dt;if(b.stepT>0.45){b.stepT=0;if(Math.random()<.3)AUD.step()}}}
  else if(b.state=='idle'){if(!b.chatWith&&Math.random()<dt*0.15){const o=nearestChat(b);if(o){b.chatWith=o;o.chatWith=b;const face=(x,y)=>Math.atan2(y.pos.x-x.pos.x,y.pos.z-x.pos.z);b.yaw=face(b,o);o.yaw=face(o,b);play(b,'Wave',0.2);setTimeout(()=>play(o,'Yes',0.2),500);b.act=o.act='💬 คุยกับ '+(o.n);o.act='💬 คุยกับ '+b.n;b.t=o.t=Math.max(b.t,o.t,5)}}
    if(b.t<=0){if(b.chatWith){b.chatWith.chatWith=null;b.chatWith=null}b.hidden=false;goTo(b,Math.random()<.65?'desk':pickSpot(b))}}
  // position + subtle sit offsets
  const sitting=(b.state=='sit'||b.state=='sofa');
  b.g.position.set(b.pos.x+(b.state=='sit'?-0.22:0),sitting?0.02:0,b.pos.z);
  let y=b.yaw-b.g.rotation.y;y=Math.atan2(Math.sin(y),Math.cos(y));b.g.rotation.y+=y*Math.min(1,dt*10);
  b.g.visible=!b.hidden;
  // typing: procedural arm/hand jiggle while seated at desk
  if(b.state=='sit'&&b.A.Sitting.time>=b.A.Sitting.getClip().duration-0.01){const k=time*14+b.phase;
    for(const nm in b.bones){if(/^(UpperArm|ShoulderL|ShoulderR|Shoulder\.)/i.test(nm)){}}
    const L=b.bones.UpperArmL||b.bones['UpperArm.L'],R=b.bones.UpperArmR||b.bones['UpperArm.R'],LA=b.bones.LowerArmL||b.bones['LowerArm.L'],RA=b.bones.LowerArmR||b.bones['LowerArm.R'];
    if(L&&R){L.rotation.x+= -0.9;R.rotation.x+=-0.9;}
    if(LA&&RA){LA.rotation.x+=Math.sin(k)*0.12-0.4;RA.rotation.x+=Math.sin(k+1.7)*0.12-0.4}
    const H=b.bones.Head;if(H)H.rotation.y+=Math.sin(time*0.4+b.phase)*0.15}
}

// ---------- overlays ----------
const v3=new THREE.Vector3();
function project(x,y,z){v3.set(x,y,z).project(camera);return{x:(v3.x*.5+.5)*innerWidth,y:(-v3.y*.5+.5)*innerHeight,vis:v3.z<1&&v3.z>-1}}
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function updOverlays(){const dist=camera.position.distanceTo(controls.target);const sc=Math.max(0.75,Math.min(1.25,36/dist));
  const rects=[];{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const wp=new THREE.Vector3();for(const[cx,cy]of[[-1.3,-0.75],[1.3,-0.75],[-1.3,0.75],[1.3,0.75]]){wp.set(cx,2.45+cy,0);sg.localToWorld(wp);const p=project(wp.x,wp.y,wp.z);x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y)}rects.push({x:x0,y:y0,w:x1-x0,h:y1-y0})}
  const order=[...bots].sort((a,b)=>b.pos.z-a.pos.z);
  for(const b of order){const h=b.state=='sit'||b.state=='sofa'?1.45:1.75;const p=project(b.pos.x,h,b.pos.z);
    const show=p.vis&&!b.hidden;b.tag.style.display=show?'':'none';
    if(show)b.tag.style.transform=`translate(${p.x}px,${p.y}px) translate(-50%,-100%) scale(${sc})`;
    const txt=status[b.n];const showB=show&&!document.body.classList.contains('nobub')&&txt;b.bub.style.display=showB?'':'none';
    if(showB){const html=`<b>${b.n}</b>${esc(txt)}`;if(b.bub._h!==html){b.bub.innerHTML=html;b.bub._h=html;b.bub.classList.remove('flash');void b.bub.offsetWidth;b.bub.classList.add('flash')}
      const w=b.bub.offsetWidth,hh=b.bub.offsetHeight;let x=p.x-w/2,yy=p.y-22*sc-hh;
      x=Math.max(4,Math.min(innerWidth-w-4,x));
      for(let it=0;it<6;it++){let hit=false;for(const r of rects)if(x<r.x+r.w&&x+w>r.x&&yy<r.y+r.h&&yy+hh>r.y){yy=r.y-hh-4;hit=true}if(!hit)break}
      rects.push({x,y:yy,w,h:hh});b.bub.style.transform=`translate(${x}px,${yy}px)`;b.bub.style.setProperty('--tx',(p.x-(x+w/2))+'px');b.bub.style.zIndex=Math.round(p.y)}}}

// ---------- time of day (Bangkok) ----------
function bkk(){if(window.__hour!=null)return{h:window.__hour|0,m:Math.round(window.__hour%1*60),s:0};const d=new Date(Date.now()+7*3600e3);return{h:d.getUTCHours(),m:d.getUTCMinutes(),s:d.getUTCSeconds()}}
const SKY=[[0,'#0b1028','#1a2350'],[5,'#1a1f45','#5a3f6a'],[6,'#f0a070','#7fa8d8'],[8,'#9cc8ef','#d8ecff'],[16,'#8ab8e8','#ffe2b0'],[18,'#3a3a7a','#ff8a5a'],[19.5,'#141a3c','#3a2f5a'],[24,'#0b1028','#1a2350']];
const lerpC=(a,b,t)=>new THREE.Color(a).lerp(new THREE.Color(b),t);
let lastSky=-1,nightK=0;
function updSky(){const{h,m,s}=bkk();const hf=h+m/60+s/3600;if(Math.abs(hf-lastSky)<0.02)return;lastSky=hf;
  let i=0;while(SKY[i+1][0]<=hf)i++;const[a,b]=[SKY[i],SKY[i+1]];const t=(hf-a[0])/(b[0]-a[0]);const top=lerpC(a[1],b[1],t),bot=lerpC(a[2],b[2],t);
  const day=Math.max(0,Math.sin((hf-6)/12*Math.PI));nightK=1-Math.min(1,day*3);
  const g=skyX.createLinearGradient(0,0,0,256);g.addColorStop(0,'#'+top.getHexString());g.addColorStop(1,'#'+bot.getHexString());skyX.fillStyle=g;skyX.fillRect(0,0,256,256);
  if(nightK>0.5){skyX.fillStyle='#fff';for(let k=0;k<70;k++){const x=(k*97)%256,y=(k*53)%150;skyX.globalAlpha=(nightK-.5)*2*(.3+((k*31)%7)/10);skyX.fillRect(x,y,1.5,1.5)}skyX.globalAlpha=1}
  skyT.needsUpdate=true;drawCity(nightK>0.5);
  // sun/moon position across window
  const dayT=(hf-6)/12,isDay=dayT>0&&dayT<1;const tt=isDay?dayT:((hf+6)%24)/12;sunDisc.position.set(-6.4+tt*6.8,2.4+Math.sin(tt*Math.PI)*1.6,BZ-0.45);
  sunDisc.material.color.set(isDay?(day<.3?'#ffb070':'#fff2c0'):'#e8eeff');
  sun.position.set(-3-(dayT-.5)*14,12,BZ-12+0);sun.target.position.set(0,0,0);
  sun.intensity=isDay?0.6+day*2.6:0.25;sun.color.set(isDay?(day<.35?'#ffb37a':'#ffe8c8'):'#8aa0ff');
  hemi.intensity=0.25+day*0.45;hemi.color.set(isDay?'#fff1dc':'#8090c0');
  for(const w of warm){if(w.isLight)w.intensity=(w.distance<7?2:4.5)*(0.4+nightK*1.4);}
  scene.environmentIntensity=0.2+day*0.25;renderer.toneMappingExposure=0.95+nightK*0.15;
  const bg=lerpC('#2a1f17','#0d0a14',nightK);scene.background.copy(bg);scene.fog.color.copy(bg);
  $('clock2').textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');$('dn').textContent=isDay?(day<.35?'🌅':'☀️'):'🌙';drawClock(h,m);}

// ---------- post-processing / quality ----------
let quality=LS('po3_q',isPhone?'med':'high');let composer=null,bloom=null,gtao=null;
function buildPost(){composer=null;if(quality=='low')return;const w=innerWidth,h=innerHeight;composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
  if(quality=='high'){gtao=new GTAOPass(scene,camera,w,h);gtao.output=GTAOPass.OUTPUT.Default;gtao.updateGtaoMaterial({radius:0.6,distanceExponent:1.5,thickness:1,scale:1.2});gtao.blendIntensity=0.85;composer.addPass(gtao)}
  bloom=new UnrealBloomPass(new THREE.Vector2(w/2,h/2),0.45,0.5,0.82);composer.addPass(bloom);composer.addPass(new OutputPass())}
function applyQuality(){const pr=Math.min(devicePixelRatio||1,quality=='low'?1.25:2);renderer.setPixelRatio(pr);renderer.shadowMap.enabled=true;
  sun.shadow.mapSize.set(quality=='high'?2048:1024,quality=='high'?2048:1024);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}
  buildPost();resize();$('qbtn').textContent={low:'🔋',med:'✨',high:'💎'}[quality]}
function resize(){const w=innerWidth,h=innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);$('c').style.width=w+'px';$('c').style.height=h+'px';if(composer){composer.setSize(w,h);composer.setPixelRatio(renderer.getPixelRatio())}}
addEventListener('resize',resize);
// add quality button
{const q=document.createElement('button');q.id='qbtn';q.className='rb';q.title='คุณภาพกราฟิก';$('zoombar').insertBefore(q,$('zin'));
 q.onclick=()=>{quality={low:'med',med:'high',high:'low'}[quality];SV('po3_q',quality);applyQuality();toast({low:'🔋 โหมดประหยัด: ปิดเอฟเฟกต์',med:'✨ คุณภาพกลาง: แสงเรือง (bloom)',high:'💎 คุณภาพสูง: bloom + เงาแวดล้อม (AO)'}[quality]);AUD.blip(650)}}
// auto-downgrade if slow
let fpsAcc=0,fpsN=0,fpsChecked=0;

// ---------- UI ----------
function toast(t){const d=document.createElement('div');d.className='toast';d.style.setProperty('--c','#f0c060');d.textContent=t;$('toasts').appendChild(d);setTimeout(()=>d.remove(),4300)}
function sndUI(){$('snd').textContent=AUD.on?'🔊':'🔇';$('snd').classList.toggle('on',AUD.on)}sndUI();
$('snd').onclick=()=>{AUD.setOn(!AUD.on);sndUI();AUD.blip(700);if(AUD.on)toast('🎵 เปิดเพลงแล้ว')};
$('vbtn').onclick=()=>{$('vol').classList.toggle('hidden');AUD.blip(600)};
$('mvol').value=AUD.mv;$('svol').value=AUD.sv;$('mvol').oninput=e=>AUD.setMusic(+e.target.value);$('svol').oninput=e=>AUD.setSfx(+e.target.value);$('svol').onchange=()=>AUD.blip(800);
document.addEventListener('pointerup',()=>AUD.unlock(),{passive:true});document.addEventListener('touchend',()=>AUD.unlock(),{passive:true});
if(LS('po_hud','1')=='0'){document.body.classList.add('hudoff');$('hudbtn').textContent='☰'}
$('hudbtn').onclick=()=>{const off=!document.body.classList.contains('hudoff');document.body.classList.toggle('hudoff',off);SV('po_hud',off?'0':'1');$('hudbtn').textContent=off?'☰':'👁';$('vol').classList.add('hidden');AUD.blip(500)};
if(LS('po_tl',isPhone?'0':'1')=='0')$('tl').classList.add('collapsed');
document.querySelector('.tlhead').onclick=()=>{const c=$('tl').classList.toggle('collapsed');SV('po_tl',c?'0':'1');AUD.blip(560)};
const zoom=f=>{const off=camera.position.clone().sub(controls.target);const d=Math.max(controls.minDistance,Math.min(controls.maxDistance,off.length()*f));flyTo(controls.target.clone().add(off.setLength(d)),controls.target.clone())};
$('zin').onclick=()=>{zoom(0.75);AUD.blip(700)};$('zout').onclick=()=>{zoom(1.33);AUD.blip(600)};$('zreset').onclick=()=>{follow=null;resetCam();AUD.blip(500)};$('bfit').onclick=()=>{follow=null;resetCam();AUD.blip(500)};
let follow=null;
function focusOn(x,z,who){const t=new THREE.Vector3(x,0.9,z);const dir=camera.position.clone().sub(controls.target).setLength(13);flyTo(t.clone().add(dir),t);follow=who}
document.querySelectorAll('.ib[data-f]').forEach(btn=>btn.onclick=()=>{const b=bots.find(o=>o.n==btn.dataset.f);if(b){focusOn(b.pos.x,b.pos.z,b);showCard(b.n)}AUD.blip(620)});
$('bcat').onclick=()=>{focusOn(cat.position.x,cat.position.z,'cat');toast(catS.state=='nap'?'😺 น้องแมวกำลังงีบ… zzz':'😺 น้องแมวเดินเล่นอยู่');AUD.blip(900)};
let cardFor=null;
function showCard(n){cardFor=n;$('cname').textContent=n;$('cname').style.color=COL[n];$('cav').style.background=COL[n];$('crole').textContent=ROLE[n];fillCard();$('card').classList.remove('hidden')}
function fillCard(){if(!cardFor)return;const b=bots.find(o=>o.n==cardFor);$('cstat').textContent='📝 '+(status[cardFor]||'—');$('ctime').textContent=(b?b.act+' · ':'')+'อัปเดต '+(status.updated||'—')}
$('cardx').onclick=()=>{$('card').classList.add('hidden');cardFor=null;follow=null};
// tap to select character
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();let downAt=null;
renderer.domElement.addEventListener('pointerdown',e=>{downAt=[e.clientX,e.clientY,performance.now()];if(follow&&e.isPrimary)follow=null;fly=null});
renderer.domElement.addEventListener('pointerup',e=>{if(!downAt)return;const moved=Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1]);if(moved>8||performance.now()-downAt[2]>400)return;
  ndc.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(ndc,camera);
  const hits=ray.intersectObjects([...bots.map(b=>b.g),cat],true);if(!hits.length)return;let o=hits[0].object;while(o.parent&&o.parent!==scene)o=o.parent;
  if(o===cat){toast('😺 เมี้ยว~');AUD.chime();return}const b=bots.find(x=>x.g===o);if(b){showCard(b.n);if(b.state=='idle')play(b,'Wave',0.2);AUD.blip(740)}});

// ---------- status polling ----------
async function poll(){try{const r=await fetch('status.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)throw 0;const s=await r.json();
    const changed=Object.keys(COL).filter(n=>status[n]!==undefined&&s[n]!==status[n]);const pchg=status.portfolio!==undefined&&s.portfolio!==status.portfolio;
    status=s;drawSign();fillCard();$('upd').textContent='🕒 อัปเดต '+(s.updated||'—');
    for(const n of changed){toast(n+': '+s[n]);const b=bots.find(o=>o.n==n);if(b&&b.state=='idle')play(b,'Jump',0.2)}if(changed.length||pchg)AUD.chime()}
  catch(e){$('upd').textContent='⚠️ โหลดสถานะไม่ได้'}}

// ---------- main loop ----------
const clock=new THREE.Clock();let chartT=0,tvT=0;
function tick(){const dt=Math.min(0.05,clock.getDelta()),time=clock.elapsedTime;
  if(fly){fly.k=Math.min(1,fly.k+dt*1.8);const e=1-Math.pow(1-fly.k,3);camera.position.lerpVectors(fly.p0,fly.p1,e);controls.target.lerpVectors(fly.t0,fly.t1,e);if(fly.k>=1)fly=null}
  else if(follow){const f=follow=='cat'?cat.position:follow.pos;const d=new THREE.Vector3(f.x,0.9,f.z).sub(controls.target).multiplyScalar(Math.min(1,dt*3));controls.target.add(d);camera.position.add(d)}
  controls.update();
  // clamp pan
  const t=controls.target;const cx=Math.max(-10,Math.min(10,t.x)),cz=Math.max(-7.5,Math.min(7.5,t.z)),cy=Math.max(0,Math.min(3,t.y));if(cx!=t.x||cz!=t.z||cy!=t.y){const d=new THREE.Vector3(cx-t.x,cy-t.y,cz-t.z);t.add(d);camera.position.add(d)}
  for(const b of bots)updBot(b,dt,time);
  updCat(dt,time);
  chartT+=dt;if(chartT>0.6){chartT=0;for(const m of monitors){if(Math.random()<.5)pushData(m);else{const l=m.data[m.data.length-1];l.c+= (Math.random()-.5)*1.2;l.h=Math.max(l.h,l.c);l.l=Math.min(l.l,l.c);m.p=l.c}drawChart(m)}}
  tvT+=dt;if(tvT>0.4){tvT=0;if(Math.random()<.25)pushData(tvC);else{const l=tvC.data[tvC.data.length-1];l.c+=(Math.random()-.5)*1.5;l.h=Math.max(l.h,l.c);l.l=Math.min(l.l,l.c);tvC.p=l.c}drawTV()}
  steam.forEach((s,i)=>{const k=(time*0.5+i/5)%1;s.position.set(3.75+Math.sin(time*2+i)*0.04,1.15+k*0.6,-7.25);s.material.opacity=0.35*(1-k);s.scale.setScalar(0.6+k*1.5)});
  cml.material.color.setHSL(0,1,0.4+0.2*Math.sin(time*3));
  if(Math.floor(time)%2==0)updSky();
  // typing sfx
  if(Math.random()<dt*3){const n=bots.filter(b=>b.state=='sit').length;if(n)AUD.type()}
  updOverlays();
  if(composer)composer.render();else renderer.render(scene,camera);
  // fps watchdog: after 6s, drop quality once if < 32fps
  fpsAcc+=dt;fpsN++;if(!fpsChecked&&fpsAcc>6){fpsChecked=1;const fps=fpsN/fpsAcc;window.__fps=fps;if(fps<32&&quality!='low'&&!LS('po3_q',0)){quality=quality=='high'?'med':'low';applyQuality();toast('🔋 ปรับคุณภาพลงอัตโนมัติให้ลื่นขึ้น')}}
  requestAnimationFrame(tick)}
function updCat(dt,time){const u=cat.userData;catS.t-=dt;
  if(catS.state=='nap'){u.body.scale.set(1,1+Math.sin(time*2)*0.04,1);u.head.position.y=0.3;u.head.rotation.z=0.4;u.tail.rotation.set(0,0,1.3);u.legs.forEach(l=>l.visible=false);cat.position.y=-0.08;
    if(catS.t<=0){catS.state='walk';u.legs.forEach(l=>l.visible=true);cat.position.y=0;u.head.position.y=0.42;u.head.rotation.z=0;const tgts=[[8.6,4.6],[2,2.5],[-5,1.2],[4,-6],[-1,-6.5],[0.5,5.5],[9.5,0.5]];const[x,z]=tgts[Math.floor(Math.random()*tgts.length)];catS.path=findPath(cat.position.x,cat.position.z,x,z)}}
  else{const p=catS.path[0];if(!p){catS.state='nap';catS.t=10+Math.random()*20;return}const dx=p.x-cat.position.x,dz=p.z-cat.position.z,d=Math.hypot(dx,dz);
    const want=Math.atan2(dx,dz);let dy=want-cat.rotation.y;dy=Math.atan2(Math.sin(dy),Math.cos(dy));cat.rotation.y+=dy*Math.min(1,dt*6);
    const st=Math.min(d,catS.speed*dt);cat.position.x+=dx/d*st||0;cat.position.z+=dz/d*st||0;if(d<0.06)catS.path.shift();
    u.legs.forEach((l,i)=>l.rotation.x=Math.sin(time*12+(i%2?Math.PI:0)+(i>1?Math.PI/2:0))*0.6);u.tail.rotation.set(-0.5+Math.sin(time*3)*0.2,0,Math.sin(time*4)*0.3);u.body.scale.set(1,1,1)}}

// ---------- boot ----------
(async()=>{try{
  applyQuality();resetCam(true);updSky();for(const m of monitors)drawChart(m);drawTV();drawSign();
  robotGLTF=await loadRobot();
  ['David','Kim','Jane','Alex','Jhon','Su'].forEach(makeBot);
  // stagger: two start out wandering for immediate life
  bots[1].t=1.5;bots[3].t=4;bots[5].t=8;
  await poll();setInterval(poll,30000);
  window.__ok=1;$('loading').classList.add('hidden');setTimeout(()=>$('hint').style.opacity=0,6000);
  requestAnimationFrame(tick);
  window.__dbg={scene,camera,controls,bots,cat,THREE,setQ:q=>{quality=q;applyQuality()},focusOn,resetCam,sim:(sec)=>{for(let t=0;t<sec;t+=0.05){for(const b of bots)updBot(b,0.05,t);updCat(0.05,t)}return bots.map(b=>b.n+':'+b.state+':'+b.act).join(' | ')}};
}catch(e){console.error(e);$('loading').classList.add('hidden');const f=$('fail');f.classList.remove('hidden');f.querySelector('.panel').innerHTML='😿 โหลดออฟฟิศ 3D ไม่สำเร็จ<br><small>'+esc(e.message||e)+'</small><br><small>ลองรีเฟรชอีกครั้ง</small>'}})();
