'use strict';
// Original cozy waltz (3/4) + SFX, all synthesized with Web Audio. No external files.
const AUD=(()=>{
  const LS=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}};
  const SV=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
  let on=LS('po_snd','0')=='1',mv=+LS('po_mv','0.5'),sv=+LS('po_sv','0.6');
  let ac=null,master,musicG,sfxG,rev,timer=null,nextT=0,step=0;
  const BPM=96,BEAT=60/BPM,mtof=m=>440*Math.pow(2,(m-69)/12);
  // chords: root midi + quality
  const CH=[['F',53,'M'],['C',48,'M',52],['D',50,'m'],['Bb',46,'M'],['F',53,'M'],['G',55,'m'],['C',48,'M'],['C',48,'7'],
            ['F',53,'M'],['A',45,'7'],['D',50,'m'],['Bb',46,'M'],['G',55,'m'],['C',48,'7'],['F',53,'M'],['F',53,'M'],
            ['Bb',46,'M'],['F',53,'M'],['G',55,'m'],['C',48,'M'],['A',45,'m'],['D',50,'m'],['G',55,'m'],['C',48,'7'],
            ['F',53,'M'],['C',48,'M',52],['D',50,'m'],['Bb',46,'M'],['G',55,'m'],['C',48,'7'],['F',53,'M'],['F',53,'M']];
  const MEL=[[[72,2],[69,1]],[[67,1],[69,1],[70,1]],[[74,2],[72,1]],[[70,3]],[[69,1],[70,1],[72,1]],[[74,2],[70,1]],[[72,1],[70,1],[67,1]],[[72,3]],
    [[77,2],[76,1]],[[73,1],[76,1],[79,1]],[[77,2],[74,1]],[[74,1],[72,1],[70,1]],[[70,2],[74,1]],[[72,1],[70,1],[67,1]],[[69,3]],[[65,2],[0,1]],
    [[74,2],[77,1]],[[77,1],[76,1],[72,1]],[[74,2],[70,1]],[[72,3]],[[76,2],[72,1]],[[77,1],[76,1],[74,1]],[[74,1],[72,1],[70,1]],[[67,2],[72,1]],
    [[72,2],[69,1]],[[67,1],[69,1],[70,1]],[[74,2],[77,1]],[[76,1],[74,1],[70,1]],[[70,1],[72,1],[74,1]],[[76,2],[79,1]],[[77,3]],[[0,3]]];
  const triad=(r,q)=>q=='m'?[r,r+3,r+7]:q=='7'?[r,r+4,r+7,r+10]:[r,r+4,r+7];
  function impulse(){const len=ac.sampleRate*2.2,b=ac.createBuffer(2,len,ac.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}return b}
  function init(){if(ac)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;ac=new C();
    master=ac.createGain();master.connect(ac.destination);musicG=ac.createGain();sfxG=ac.createGain();musicG.gain.value=mv*.35;sfxG.gain.value=sv*.6;
    rev=ac.createConvolver();rev.buffer=impulse();const rg=ac.createGain();rg.gain.value=.28;musicG.connect(master);musicG.connect(rev);rev.connect(rg);rg.connect(master);sfxG.connect(master)}
  function env(t,a,d,peak,dest){const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d);g.connect(dest);return g}
  function osc(type,f,t,dur,g,det=0){const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);o.detune.value=det;o.connect(g);o.start(t);o.stop(t+dur+.05);return o}
  function flute(m,t,dur){const len=dur*BEAT;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;lp.connect(musicG);
    const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.06);g.gain.setValueAtTime(.14,t+len*.7);g.gain.exponentialRampToValueAtTime(.0001,t+len+.25);g.connect(lp);
    const o=osc('sine',mtof(m),t,len+.3,g),o2=osc('triangle',mtof(m),t,len+.3,g,4);const v=ac.createOscillator(),vg=ac.createGain();v.frequency.value=5.2;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(5,t+.35);v.connect(vg);vg.connect(o.frequency);v.start(t);v.stop(t+len+.3)}
  function harp(m,t,v=.07){const g=env(t,.004,1.4,v,musicG);osc('triangle',mtof(m),t,1.5,g);const g2=env(t,.002,.4,v*.4,musicG);osc('sine',mtof(m)*2,t,.5,g2)}
  function accordion(ns,t,len){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1100;lp.connect(musicG);const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.04);g.gain.setValueAtTime(.03,t+len*.6);g.gain.exponentialRampToValueAtTime(.0001,t+len);g.connect(lp);
    for(const n of ns){osc('square',mtof(n),t,len,g,-6);osc('sawtooth',mtof(n),t,len,g,7)}}
  function bass(m,t){const g=env(t,.01,BEAT*1.2,.22,musicG);osc('sine',mtof(m),t,BEAT*1.3,g);const g2=env(t,.005,.15,.05,musicG);osc('triangle',mtof(m)*2,t,.2,g2)}
  function strings(ns,t,len){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;lp.connect(musicG);const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.025,t+len*.4);g.gain.linearRampToValueAtTime(0,t+len);g.connect(lp);for(const n of ns)osc('sawtooth',mtof(n+12),t,len,g,(Math.random()-.5)*14)}
  function scheduleBar(i,t){const loop=Math.floor(i/32)%2,b=i%32,[,root,q,bassN]=CH[b];const tr=triad(root,q);const up=tr.map(n=>n<55?n+12:n);
    bass((bassN||root)-12+(root<48?12:0),t);
    accordion(up,t+BEAT,BEAT*.8);accordion(up,t+BEAT*2,BEAT*.8);
    if(b>=16||loop)for(let k=0;k<6;k++)harp(up[k%up.length]+(k>2?12:0),t+k*BEAT/2,b>=16?.06:.035);
    if(b%4==0)strings(up,t,BEAT*12);
    let bt=t;for(const[m,d]of MEL[b]){if(m)flute(m+(loop&&b>=24&&b<30?0:0),bt,d*.95);bt+=d*BEAT}}
  function tick(){if(!ac||!on)return;while(nextT<ac.currentTime+.6){scheduleBar(step,nextT);nextT+=BEAT*3;step++}}
  function startMusic(){if(!ac||timer)return;nextT=ac.currentTime+.15;step=0;musicG.gain.cancelScheduledValues(ac.currentTime);musicG.gain.setValueAtTime(0,ac.currentTime);musicG.gain.linearRampToValueAtTime(mv*.35,ac.currentTime+2);timer=setInterval(tick,120);tick()}
  function stopMusic(){if(timer){clearInterval(timer);timer=null}if(ac){musicG.gain.cancelScheduledValues(ac.currentTime);musicG.gain.setTargetAtTime(0,ac.currentTime,.2)}}
  function unlock(){if(!on)return;try{init();if(!ac)return;if(ac.state!=='running')ac.resume();const b=ac.createBuffer(1,1,22050),s=ac.createBufferSource();s.buffer=b;s.connect(ac.destination);s.start(0);startMusic()}catch(e){console.warn(e)}}
  const ok=()=>on&&ac&&ac.state==='running';
  function beep(f,d,type,v,t0=0){const t=ac.currentTime+t0,g=env(t,.005,d,v,sfxG);osc(type,f,t,d,g)}
  function noise(d,v,fr){const t=ac.currentTime,len=Math.floor(ac.sampleRate*d),b=ac.createBuffer(1,len,ac.sampleRate),x=b.getChannelData(0);for(let i=0;i<len;i++)x[i]=(Math.random()*2-1)*(1-i/len);
    const s=ac.createBufferSource();s.buffer=b;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=fr;f.Q.value=1.2;const g=ac.createGain();g.gain.value=v;s.connect(f);f.connect(g);g.connect(sfxG);s.start(t)}
  const api={
    get on(){return on},
    setOn(v){on=v;SV('po_snd',v?'1':'0');if(v)unlock();else stopMusic()},
    setMusic(v){mv=v;SV('po_mv',v);if(ac){musicG.gain.cancelScheduledValues(ac.currentTime);musicG.gain.setTargetAtTime(on?v*.35:0,ac.currentTime,.1)}},
    setSfx(v){sv=v;SV('po_sv',v);if(ac)sfxG.gain.setTargetAtTime(v*.6,ac.currentTime,.05)},
    get mv(){return mv},get sv(){return sv},unlock,
    blip(f=660){if(ok()){beep(f,.06,'square',.05);beep(f*1.5,.05,'sine',.03,.03)}},
    chime(){if(ok()){[1047,1319,1568].forEach((f,i)=>beep(f,.5,'triangle',.07,i*.09))}},
    step(){if(ok()&&Math.random()<.5)noise(.05,.12,380+Math.random()*120)},
    type(){if(ok())noise(.018,.07,2400+Math.random()*1500)}};
  // resume after iOS interruptions
  document.addEventListener('visibilitychange',()=>{if(!ac)return;if(document.hidden)ac.suspend();else if(on)ac.resume()});
  return api})();
