'use strict';
// v35: real-life moments + team meeting choreography
safe(()=>{
const pickL=a=>a[Math.floor(Math.random()*a.length)];
const LINES={
 water:{David:['💧 ไปกดน้ำ','💧 คอแห้ง ประชุมเยอะ'],Kim:['💧 ไปกดน้ำ อ่านข่าวจนคอแห้ง'],Jane:['💧 เติมน้ำขวดชมพู','💧 ดื่มน้ำ 8 แก้ว!'],Alex:['💧 น้ำเย็น ๆ หน่อย'],Jhon:['💧 น้ำเปล่า ไม่ใส่น้ำแข็ง'],Su:['💧 ไปกดน้ำ','💧 ขวดที่ 4 แล้ว']},
 coffee:{David:['☕ กาแฟแก้วที่ 3','☕ เอสเปรสโซ่ช็อตคู่'],Kim:['☕ ลาเต้ก่อนข่าวเช้า'],Jane:['🧋 ชาไทยหวานน้อย','☕ คาปูชิโน่ฟองนุ่ม'],Alex:['☕ กาแฟดำ debug ต่อ','☕ แก้วที่ 4… ไม่นับ'],Jhon:['☕ อเมริกาโน่ ไม่หวาน'],Su:['🍵 ชาเขียวอุ่น ๆ','☕ มอคค่าหน่อย']},
 wc:{David:['🚽 ปวดฉี่จัง'],Kim:['🚽 แป๊บนะ เดี๋ยวมา'],Jane:['💄 ไปเติมลิป'],Alex:['🚽 ปวดฉี่จัง','🚽 ไปคิดโค้ดในห้องน้ำ'],Jhon:['🚽 ห้องน้ำ 2 นาที'],Su:['🚽 ปวดฉี่จัง']},
 snack:{David:['🍩 โดนัทในครัว'],Kim:['🍪 คุกกี้หน่อย'],Jane:['🍓 สตรอว์เบอร์รี่!'],Alex:['🍜 มาม่าคัพ','🍫 ช็อกโกแลตเติมพลัง'],Jhon:['🥜 ถั่วอัลมอนด์'],Su:['🍰 เค้กวันเกิดใครอะ']},
 window:{David:['🌆 ดูวิวเมือง คิดแผน'],Kim:['☁️ ฝนจะตกไหมนะ'],Jane:['🌇 ฟ้าสวยจัง'],Alex:['🏙️ พักสายตา'],Jhon:['🌆 ดูวิวเงียบ ๆ'],Su:['📸 ถ่ายรูปวิว']},
 plant:{David:['🪴 รดน้ำต้นไม้'],Kim:['🪴 ต้นไม้เหี่ยวแล้ว!'],Jane:['🌸 คุยกับต้นไม้'],Alex:['🪴 รดน้ำ (ลืมมา 3 วัน)'],Jhon:['🪴 รดน้ำ 200 ml พอดี'],Su:['🪴 รดน้ำต้นไม้']},
 printer:{David:['🖨️ ปริ้นแผนประชุม'],Kim:['🖨️ ปริ้นข่าวเช้า'],Jane:['🖨️ ปริ้นลิสต์เหรียญ'],Alex:['🖨️ กระดาษติดอีกแล้ว!'],Jhon:['🖨️ ปริ้นใบลิมิต'],Su:['🖨️ ปริ้นรายงาน']},
 stretch:{David:['🙆 บิดขี้เกียจ'],Kim:['🙆 ยืดเส้นหน่อย'],Jane:['🧘 โยคะ 1 นาที'],Alex:['🙆 หลังจะหักแล้ว'],Jhon:['🙆 ยืดคอ ซ้าย-ขวา'],Su:['🙆 บิดขี้เกียจ']},
 yawn:{David:['🥱 หาว~ ง่วงจัง'],Kim:['🥱 ตื่นตีห้าอ่านข่าว'],Jane:['🥱 หาวว~'],Alex:['🥱 นอนตีสามเพราะ backtest'],Jhon:['🥱 …ไม่ได้ง่วงนะ'],Su:['🥱 หาว~']},
 sneeze:{David:['🤧 ฮัดชิ้ว!'],Kim:['🤧 แอร์เย็นไป'],Jane:['🤧 ฮัดชิ้ว~ ขอโทษค่ะ'],Alex:['🤧 ฮัดเช้ย!'],Jhon:['🤧 ฮัดชิ้ว (สุภาพ)'],Su:['🤧 ฮัดชิ้ว!']},
 mom:{David:['📱 แม่โทรมา: กินข้าวยัง'],Kim:['📱 แม่ถามข่าวหุ้น'],Jane:['📱 แม่โทรมา ค่ะแม่ ๆ'],Alex:['📱 แม่: เมื่อไหร่จะกลับบ้าน'],Jhon:['📱 แม่: อย่าเสี่ยงนะลูก'],Su:['📱 แม่โทรมา คิดถึง']},
 chat:{David:['💬 คุยกับ'],Kim:['💬 เม้าท์ข่าวกับ'],Jane:['💬 ปรึกษา'],Alex:['💬 ถามโค้ด'],Jhon:['💬 เตือนลิมิต'],Su:['💬 ขอข้อมูลจาก']}};
const SP={water:[{x:120,y:152,ex:120,dir:1,pose:'sip'},{x:530,y:528,ex:530,dir:1,pose:'sip'}],coffee:[{x:44,y:104,ex:44,dir:1,pose:'sip',steam:1},{x:498,y:528,ex:498,dir:1,pose:'sip',steam:1}],
 wc:[{x:133,y:466,ex:172,dir:0,pose:'stand',wc:1}],snack:[{x:96,y:236,ex:96,dir:1,pose:'sip'}],window:[{x:300,y:96,ex:300,dir:1,pose:'stand'},{x:470,y:96,ex:470,dir:1,pose:'stand'}],
 plant:[{x:200,y:108,ex:200,dir:1,pose:'stand'},{x:476,y:484,ex:476,dir:1,pose:'stand'},{x:588,y:484,ex:588,dir:1,pose:'stand'}],printer:[{x:372,y:530,ex:372,dir:1,pose:'stand'}],mom:[{x:420,y:96,ex:420,dir:1,pose:'stand'},{x:240,y:96,ex:240,dir:1,pose:'stand'}]};
const INPLACE=['stretch','yawn','sneeze'];
const KINDS=['water','coffee','wc','snack','window','plant','printer','mom','chat','stretch','yawn','sneeze','water','coffee','chat'];
window.MEET={on:false};
const MSEAT={Kim:{x:78,y:388,dir:0},Jane:{x:110,y:388,dir:0},Alex:{x:142,y:388,dir:0},Jhon:{x:78,y:432,dir:1},David:{x:110,y:432,dir:1},Su:{x:142,y:432,dir:1}};
plan=function(bt){if(MEET.on){bt.t=5;return}bt.from={x:bt.x,y:bt.y,ex:SEAT[bt.n].ex};const k=pickL(KINDS);let tg;
 if(k=='chat'){const o=bots.filter(x=>x!==bt&&x.state=='work');if(o.length){const ob=pickL(o),s=SEAT[ob.n];tg={x:s.ex,y:s.y,ex:s.ex,dir:s.ex>s.x?2:3,pose:'wave',say:pickL(LINES.chat[bt.n])+' '+ob.n,visit:ob}}}
 else if(INPLACE.includes(k)){const s=SEAT[bt.n];tg={x:s.ex,y:s.y+6,ex:s.ex,dir:0,pose:k=='stretch'?'wave':'stand',say:pickL(LINES[k][bt.n])}}
 if(!tg){const kk=k=='chat'||INPLACE.includes(k)?'water':k;const b=pickL(SP[kk]);tg=Object.assign({},b,{say:pickL(LINES[kk][bt.n])})}
 if(bots.some(o=>o!==bt&&o.goal&&o.goal.x==tg.x&&o.goal.y==tg.y)){const s=SEAT[bt.n];tg={x:s.ex,y:s.y+6,ex:s.ex,dir:0,pose:'stand',say:pickL(LINES.stretch[bt.n])}}
 route(bt,bt.from,tg);bt.goal=tg;bt.state='walk';bt.say=tg.say};
for(const bt of bots)bt.t=Math.min(bt.t,4+Math.random()*14);
const MEETING=[[490,538],[1210,1258]];
function meetNow(){const{m}=bkk();return MEETING.some(([a,b])=>m>=a&&m<b)}
const _up=update;let camDone=false;
update=function(dt){_up(dt);const on=meetNow();
 if(on&&!MEET.on){MEET.on=true;camDone=false;for(const bt of bots)toMeeting(bt)}
 if(!on&&MEET.on){MEET.on=false;for(const bt of bots)fromMeeting(bt);if(vw<600)flyTo(homeCam())}
 if(MEET.on){for(const bt of bots){const s=MSEAT[bt.n];if(bt.meet&&bt.state!='walk'){bt.state='idle';bt.t=999;bt.dir=s.dir;bt.pose='sit';bt.x=s.x;bt.y=s.y}if(!bt.meet&&!bt.hidden)toMeeting(bt)}
  if(!camDone&&vw<600){camDone=true;flyTo({x:105,y:420,z:Math.max(vw/220,2)})}}
 if(!MEET.on)for(const bt of bots){if(bt.state=='work'&&bt.t>30)bt.t=12+Math.random()*18}};
function toMeeting(bt){if(bt.hidden){bt.hidden=false;bt.x=133;bt.y=466}bt.wcIn=0;bt.haltGo=0;const s=MSEAT[bt.n];
 const atDesk=Math.hypot(bt.x-SEAT[bt.n].x,bt.y-SEAT[bt.n].y)<30;const path=[];if(atDesk)path.push({x:SEAT[bt.n].ex,y:bt.y});
 path.push({x:path.length?SEAT[bt.n].ex:bt.x,y:AISLE+32},{x:170,y:AISLE+32},{x:170,y:s.y},{x:s.x,y:s.y});
 bt.path=path;bt.goal={x:s.x,y:s.y,ex:170,dir:s.dir,pose:'sit',say:'🏃 ไปห้องประชุม',meet:1};bt.state='walk';bt.say='🏃 ไปห้องประชุม';bt.meet=1}
function fromMeeting(bt){bt.meet=0;route(bt,{ex:170,y:bt.y},SEAT[bt.n]);bt.path.unshift({x:bt.x,y:bt.y});bt.goal=null;bt.state='walk';bt.say='🚶 กลับโต๊ะ'}
// bubble text: action line while doing a life moment, meeting roles, else activity/thought
const SPK=[['Kim',10],['Jane',20],['Alex',27],['Jhon',41],['David',43]];
const REACT=['🤔','👍','📝 จดโน้ต','👀','🙂','👏','☕','🤓 อืม…'];
const _ns=nowStatus;
nowStatus=function(n){const bt=bots.find(b=>b.n==n);_think[n]=false;
 if(MEET.on){if(bt&&bt.state=='walk')return '🏃 ไปห้องประชุม';const{m}=bkk(),mm=m%60;let sp=null;for(const[k,t]of SPK)if(mm>=t)sp=k;
  if(n==sp){const sl=(SCHED[n]||[]).find(x=>Math.abs(hm(x[0])%60-t0(n))<1);return '🎤 '+((SCHED[n]||[[0,'พูด']])[m<720?0:1]||SCHED[n][0])[1]}
  bt&&(bt._mini=true);return REACT[(Math.floor(Date.now()/5000)+n.length*3)%REACT.length]}
 if(bt)bt._mini=false;
 const ex=explicit(n);if(ex)return ex;
 if(bt&&bt.say&&(bt.state=='walk'||(bt.state=='idle'&&bt.goal)))return bt.say;
 return _ns(n)};
function t0(n){const x=SPK.find(a=>a[0]==n);return x?x[1]:0}
const _pdL=placeDom;placeDom=function(){_pdL();for(const bt of bots)bubs[bt.n].classList.toggle('mini',!!(MEET.on&&bt._mini))};
},'life');
