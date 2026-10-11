'use strict';
// v16: wall-mounted portfolio display (replaces TV chart + floor sign), phone fit-whole-room view
const TVR=[436,6,150,48];
const _dsW=drawScreens;drawScreens=function(g){_dsW(g);R(g,432,2,158,56,'#e6d2a8');box(g,TVR[0],TVR[1],TVR[2],TVR[3],PAL.dark);R(g,TVR[0]+2,TVR[1]+2,TVR[2]-4,TVR[3]-4,'#09111d');R(g,TVR[0]+TVR[2]/2-4,TVR[1]+TVR[3],8,3,PAL.metal[0])};
$('board').classList.add('wall');
placeBoard=function(){const B=$('board');const p=toScreen(TVR[0]+TVR[2]/2,TVR[1]+TVR[3]/2);const w=B._w||(B._w=B.offsetWidth),h=B._h||(B._h=B.offsetHeight);
  const s=Math.max(TVR[2]*cam.z/w,.82);B.style.transformOrigin='50% 50%';B.style.transform=`translate(${(p.x-w/2)|0}px,${(p.y-h/2)|0}px) scale(${s.toFixed(3)})`};
homeCam=function(){if(vw<600){const z=Math.min(vw/W,vh/H);return{z,x:W/2,y:H/2}}return{z:Math.max(Math.min(vw/W,vh/H)*1.02,1),x:W/2,y:H/2-6}};
limits=function(){const fit=Math.min(vw/W,vh/H);return{min:fit*.98,max:7}};
// bubbles: allow at phone fit-zoom with compact size
placeDom=(function(orig){return function(){orig();if(cam.z<0.9){for(const bt of bots){const B=bubs[bt.n];const q=toScreen(bt.x,bt.y-40);B.style.opacity=bt.hidden?0:1;B.classList.add('mini')}document.querySelectorAll('.tag').forEach(t=>t.style.opacity=1)}else for(const n in bubs)bubs[n].classList.remove('mini')}})(placeDom);
resize.done=0;resize();Object.assign(tcam,cam);
