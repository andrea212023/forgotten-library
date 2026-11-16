'use strict';
(() => {
  const LS_KEY='forgotten-library-v4', OLD_KEY='library-labyrinth-v3', V=4;
  const I=window.__I18N;
  const LANGS=[['en','English'],['uk','Українська'],['ru','Русский'],['fr','Français'],['de','Deutsch'],['es','Español'],['it','Italiano'],['pt','Português'],['pl','Polski'],['nl','Nederlands'],['tr','Türkçe'],['ja','日本語'],['zh','中文'],['ko','한국어'],['ar','العربية'],['hi','हिन्दी']].filter(l=>I[l[0]]);
  const RTL=new Set(['ar']);
  let lang='en';
  const t=(k,v)=>{let s=(I[lang]&&I[lang][k]!=null)?I[lang][k]:(I.en[k]!=null?I.en[k]:k);if(typeof s==='string'){s=s.replace(/\s*[→←↩↪↻]\s*$/,'');if(v)s=s.replace(/\{(\w+)\}/g,(m,n)=>v[n]!=null?v[n]:m)}return s};
  const tw=(group,id)=>((I[lang]&&I[lang][group]&&I[lang][group][id])||I.en[group][id]);

  const RHYTHMS={
    classic:{focus:[25],brk:5,long:15,every:4,name:'rClassic'},
    deep:{focus:[50],brk:10,long:20,every:3,name:'rDeep'},
    labyrinth:{focus:[15,30,45,60],brk:null,long:15,every:4,name:'rLab'},
    gentle:{focus:[15,20],brk:5,long:10,every:4,name:'rGentle'}
  };
  const doorSkins=[
    {id:'moon',symbol:'☾',wood:'#383a55',light:'#e0ebff',accent:'#bfd0ff',trim:'#7184ac'},
    {id:'heart',symbol:'♡',wood:'#644050',light:'#ffe0dc',accent:'#ffb7ba',trim:'#ab7183'},
    {id:'star',symbol:'✶',wood:'#3c4862',light:'#d7eaff',accent:'#a9d9ff',trim:'#7c9fba'},
    {id:'sun',symbol:'☼',wood:'#71502a',light:'#ffe6af',accent:'#ffcb77',trim:'#b38a4e'},
    {id:'ivy',symbol:'❦',wood:'#344d3c',light:'#d9eed0',accent:'#a8d797',trim:'#6c9b70'},
    {id:'crystal',symbol:'◇',wood:'#354d58',light:'#defbff',accent:'#a2e2ea',trim:'#7ba9b6'},
    {id:'crown',symbol:'♛',wood:'#554158',light:'#f8ddff',accent:'#dfb7e7',trim:'#94719b'},
    {id:'rose',symbol:'✿',wood:'#62404c',light:'#ffe3e8',accent:'#edb5c0',trim:'#aa7783'},
    {id:'comet',symbol:'☄',wood:'#3a4864',light:'#d9e5ff',accent:'#b6ceff',trim:'#738cb9'},
    {id:'raven',symbol:'♠',wood:'#343442',light:'#e3d9f7',accent:'#b5a8d6',trim:'#6d6589'},
    {id:'seal',symbol:'❖',wood:'#5a4835',light:'#fce3b4',accent:'#e9ca8d',trim:'#a08656'},
    {id:'dawn',symbol:'✹',wood:'#705144',light:'#fff1c8',accent:'#ffd29a',trim:'#bc9270'},
    {id:'emerald',symbol:'♧',wood:'#2e5147',light:'#c8f5e8',accent:'#8dd7bb',trim:'#5b9b82'},
    {id:'mirror',symbol:'◈',wood:'#3c4c60',light:'#e1f0fd',accent:'#b6d6ef',trim:'#739ab6'},
    {id:'magic',symbol:'☿',wood:'#4f3f65',light:'#efdfff',accent:'#c7b3f4',trim:'#987db4'},
    {id:'feather',symbol:'✒',wood:'#5d4533',light:'#fff0d3',accent:'#efce97',trim:'#a98c65'},
    {id:'ember',symbol:'✺',wood:'#69392c',light:'#ffe5c3',accent:'#ffa96a',trim:'#b77344'},
    {id:'frost',symbol:'❄',wood:'#315264',light:'#e4faff',accent:'#b5e8ff',trim:'#72aabf'},
    {id:'eclipse',symbol:'◐',wood:'#494052',light:'#f0e5fa',accent:'#c1afd1',trim:'#8b769a'},
    {id:'maze',symbol:'⌘',wood:'#5c4935',light:'#f1ddb8',accent:'#d7bb87',trim:'#94764d'},
    {id:'mist',symbol:'☷',wood:'#44545a',light:'#e1f2ef',accent:'#b4d8d5',trim:'#7a9e9e'},
    {id:'wisdom',symbol:'✥',wood:'#4c4360',light:'#ebdafa',accent:'#c8b6ef',trim:'#907aab'},
    {id:'time',symbol:'◷',wood:'#554633',light:'#fbe1b4',accent:'#edd0a0',trim:'#a38759'},
    {id:'thorns',symbol:'❈',wood:'#3e4934',light:'#d8e9bc',accent:'#bbd591',trim:'#7c9a58'}
  ];
  const relics=[{id:'key',emoji:'🗝',boost:.08},{id:'map',emoji:'🗺',boost:.08},{id:'compass',emoji:'✦',boost:.08},{id:'seal',emoji:'📜',boost:.07}];
  const WINGS=[
    {id:'lanterns',icon:'🕯',hours:0,cost:[40,120,300]},
    {id:'tea',icon:'☕',hours:1,cost:[60,150,320]},
    {id:'music',icon:'🎻',hours:1,cost:[50,140,280]},
    {id:'maps',icon:'🗺',hours:3,cost:[90,220,450]},
    {id:'scriptorium',icon:'✒',hours:3,cost:[80,200,420]},
    {id:'garden',icon:'🌿',hours:6,cost:[120,280,560]},
    {id:'clock',icon:'⏳',hours:10,cost:[150,350,700]},
    {id:'stars',icon:'✶',hours:15,cost:[200,450,900]}
  ];
  const RANK_H=[0,1,3,6,10,15,25,50,100];
  const PAGES=12;

  let profile=null, state=null, audioCtx=null, activeToast=null, lastUpdated=0;
  let scheduled=[], scheduledFor=0, amb=null;
  const $=(id)=>document.getElementById(id);
  const esc=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rand=()=>Math.random();
  const pick=(a)=>a[Math.floor(rand()*a.length)];
  const uid=()=>Math.floor(rand()*1e9).toString(36);
  const pad=(n)=>String(n).padStart(2,'0');
  const fmtHM=(s)=>`${pad(Math.floor(s/3600))}:${pad(Math.floor(s%3600/60))}`;
  const fmtClock=(s)=>s>=3600?`${pad(Math.floor(s/3600))}:${pad(Math.floor(s%3600/60))}:${pad(s%60)}`:`${pad(Math.floor(s/60))}:${pad(s%60)}`;
  const dayKey=(d)=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const L=(id)=>(profile&&profile.wings[id])||0;
  const rh=()=>RHYTHMS[(state&&state.rhythm)||profile.rhythm]||RHYTHMS.classic;
  const minFocus=()=>Math.min(...rh().focus);
  const maxSec=()=>state.maxMinutes*60;
  const leftSec=()=>Math.max(0,maxSec()-state.studiedSec);
  const knownSigils=()=>Math.min(4,Math.floor(profile.pagesN/3));
  const availableSkins=()=>doorSkins.slice(0,12+4*L('stars'));
  const skinFor=(d)=>doorSkins.find(s=>s.id===d.skin)||doorSkins[0];
  const skinName=(id)=>{const i=doorSkins.findIndex(s=>s.id===id);return (t('doors')[i])||I.en.doors[i]};
  const roomName=(r)=>r.nameIdx!=null?(t('rooms')[r.nameIdx]||I.en.rooms[r.nameIdx]):(r.name||'');
  const rankIdx=()=>{let r=0;for(let i=0;i<RANK_H.length;i++)if(profile.lifeSec>=RANK_H[i]*3600)r=i;return r};
  const rankName=(i)=>t('ranks')[i]||I.en.ranks[i];
  const fmtHours=(h)=>{try{return new Intl.NumberFormat(lang,{style:'unit',unit:'hour',unitDisplay:'long'}).format(h)}catch(e){return `${h} h`}};

  /* ---------- profile & persistence ---------- */
  function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function newProfile(){return {v:V,lang:null,ink:0,inkTotal:0,lifeSec:0,blocks:0,breaks:0,sessions:0,wings:{},pagesN:0,sigils:shuffle(doorSkins.slice(0,12).map(s=>s.id)).slice(0,4),sigilStep:0,hidden:false,days:{},rhythm:'classic',ambient:'off',lastRank:0,created:Date.now()}}
  function fixProfile(p){const base=newProfile();p=Object.assign(base,p||{});if(!p.wings||typeof p.wings!=='object')p.wings={};if(!p.days||typeof p.days!=='object')p.days={};if(!Array.isArray(p.sigils)||p.sigils.length!==4)p.sigils=base.sigils;p.pagesN=Math.max(0,Math.min(PAGES,p.pagesN|0));return p}
  function validRun(s){return s&&Number.isFinite(s.maxMinutes)&&s.maxMinutes>=15&&s.maxMinutes<=720&&Number.isFinite(s.studiedSec)&&Array.isArray(s.history)&&['choose','reveal','study','post','break','win'].includes(s.phase)&&s.room&&Array.isArray(s.room.doors)}
  function fixRun(s){
    if(!s)return null;
    s.v=V;if(!RHYTHMS[s.rhythm])s.rhythm='labyrinth';
    s.blocks=s.blocks|0;s.inkRun=s.inkRun|0;s.freeStreak=s.freeStreak|0;if(!Array.isArray(s.relics))s.relics=[];
    if(s.timer&&!s.timer.kind)s.timer.kind='focus';
    s.history=s.history.filter(h=>h&&h.k);
    if((s.phase==='study'||s.phase==='break')&&(!s.timer||!Number.isFinite(s.timer.durationMs)))s.phase='choose';
    if(s.phase==='reveal'&&!s.selected)s.phase='choose';
    return s;
  }
  function pruneDays(){const keys=Object.keys(profile.days).sort();while(keys.length>400)delete profile.days[keys.shift()]}
  function snapshot(){return {app:'forgotten-library',v:V,updated:lastUpdated,profile,run:state}}
  function save(){lastUpdated=Date.now();try{localStorage.setItem(LS_KEY,JSON.stringify(snapshot()))}catch(e){}queueCloud();return true}
  function loadLocal(){
    try{const raw=localStorage.getItem(LS_KEY);if(raw){const d=JSON.parse(raw);if(d&&d.v===V){lastUpdated=d.updated||0;return d}}}catch(e){}
    try{const raw=localStorage.getItem(OLD_KEY);if(raw){const s=JSON.parse(raw);if(s&&s.v===3)return {profile:null,run:s,updated:0}}}catch(e){}
    return null;
  }
  function adopt(d){
    profile=fixProfile(d.profile);
    let run=d.run;
    if(run&&run.v===3){run=Object.assign({},run,{rhythm:'labyrinth',history:[]});}
    state=validRun(run)?fixRun(run):null;
  }
  /* cloud sync through the page's per-account store, when the host provides one */
  const cloud={ref:null,busy:false,dirty:false,timer:null,on:false};
  function queueCloud(){if(!cloud.ref)return;cloud.dirty=true;clearTimeout(cloud.timer);cloud.timer=setTimeout(flushCloud,2500)}
  async function flushCloud(){
    if(!cloud.ref||cloud.busy||!cloud.dirty)return;
    cloud.busy=true;cloud.dirty=false;
    try{await cloud.ref.set(JSON.parse(JSON.stringify(snapshot())))}
    catch(e){const c=e&&e.code;if(c==='unavailable'){cloud.dirty=true}else{cloud.ref=null;cloud.on=false}}
    cloud.busy=false;if(cloud.dirty&&cloud.ref)queueCloud();
  }
  async function initCloud(){
    if(!window.claude||typeof window.claude.use!=='function')return;
    try{
      const [db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);
      if(!db||!user)return;const id=await user.id();if(!id)return;
      const ref=db.doc('data/users/'+id+'/save');
      const snap=await Promise.race([ref.get(),new Promise((_,rej)=>setTimeout(()=>rej({code:'timeout'}),10000))]);
      cloud.ref=ref;cloud.on=true;
      const d=snap&&snap.exists?snap.data():null;
      const busyNow=state&&(state.phase==='study'||state.phase==='break');
      if(d&&d.v===V&&d.profile&&(d.updated||0)>lastUpdated&&!busyNow){
        adopt(JSON.parse(JSON.stringify(d)));lastUpdated=d.updated;
        try{localStorage.setItem(LS_KEY,JSON.stringify(snapshot()))}catch(e){}
        applyLang();render();openToast(t('tCloud'));
      }else if(!d||(d.updated||0)<lastUpdated){cloud.dirty=true;flushCloud()}
    }catch(e){}
  }

  /* ---------- language ---------- */
  function detectLang(){const prefs=(navigator.languages||[navigator.language||'en']).map(x=>String(x).toLowerCase().slice(0,2));for(const p of prefs)if(I[p])return p;return 'en'}
  function updateTitle(){
    if(state&&(state.phase==='study'||state.phase==='break')&&state.timer){document.title=`${fmtClock(Math.ceil(timerLeftMs()/1000))} · ${t(state.phase==='study'?'tabFocus':'tabBreak')}`}
    else document.title=t('title');
  }

  /* ---------- toasts, journal ---------- */
  function openToast(text){const el=$('toast');el.textContent=text;el.className='toast';clearTimeout(activeToast);activeToast=setTimeout(()=>el.className='hidden',4300)}
  function log(k,v){if(!state)return;state.history.unshift({ts:Date.now(),k,v:v||null});state.history=state.history.slice(0,80)}
  function logText(h){
    const v=Object.assign({},h.v||{});
    if(v.room!=null)v.room=t('rooms')[v.room]||I.en.rooms[v.room]||'';
    if(v.relic!=null)v.relic=t('relicN')[v.relic]||I.en.relicN[v.relic]||'';
    return t(h.k,v);
  }

  /* ---------- sound ---------- */
  function warmAudio(){try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{})}catch(e){openToast(t('tSoundBlocked'))}}
  function tone(freq,when,dur,vol,type='sine'){
    if(!audioCtx)return null;
    try{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;o.connect(g);g.connect(audioCtx.destination);
      const s=audioCtx.currentTime+when;g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(Math.max(.001,vol),s+.045);g.gain.exponentialRampToValueAtTime(.0001,s+dur);o.start(s);o.stop(s+dur+.05);return o}catch(e){return null}
  }
  function signal(offset,kind){
    const out=[];
    if(kind==='break'){for(let j=0;j<2;j++){const a=offset+j*1.6;out.push(tone(523,a,.6,.16,'sine'),tone(659,a+.35,.6,.16,'sine'),tone(784,a+.7,.9,.18,'sine'))}}
    else{for(let j=0;j<3;j++){const a=offset+j*2.1;out.push(tone(784,a,.40,.16,'triangle'),tone(988,a+.46,.42,.18,'triangle'),tone(1175,a+.95,.70,.22,'sine'))}}
    return out.filter(Boolean);
  }
  function cancelScheduled(){for(const o of scheduled){try{o.stop(0)}catch(e){}}scheduled=[];scheduledFor=0}
  // Background tabs throttle timers, so the end signal is pre-scheduled on the audio clock.
  function scheduleSignal(ms,kind){cancelScheduled();warmAudio();if(!audioCtx||audioCtx.state!=='running')return;scheduled=signal(ms/1000,kind);scheduledFor=Date.now()+ms}
  function endSignal(kind){const pre=scheduledFor&&Math.abs(Date.now()-scheduledFor)<5000&&audioCtx&&audioCtx.state==='running';if(!pre){cancelScheduled();warmAudio();signal(0,kind)}scheduled=[];scheduledFor=0}
  function testSound(){warmAudio();signal(0,'focus');openToast(t('tSoundTest'))}
  function noiseBuffer(kind){
    const sr=audioCtx.sampleRate,len=sr*4,buf=audioCtx.createBuffer(1,len,sr),d=buf.getChannelData(0);
    let last=0,b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for(let i=0;i<len;i++){const w=Math.random()*2-1;
      if(kind==='hearth'){last=(last+.02*w)/1.02;d[i]=last*3.5+(Math.random()<.0004?(Math.random()*.6):0)}
      else if(kind==='wind'){b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11;b6=w*.115926}
      else d[i]=w;}
    return buf;
  }
  function stopAmbient(){if(amb){try{amb.g.gain.setTargetAtTime(0,audioCtx.currentTime,.3);const a=amb;setTimeout(()=>{try{a.src.stop()}catch(e){}},1200)}catch(e){}amb=null}}
  function ambientUnlocked(k){return k==='off'||(k==='rain'&&L('music')>=1)||(k==='hearth'&&L('music')>=2)||(k==='wind'&&L('music')>=3)}
  function startAmbient(){
    stopAmbient();const k=profile.ambient;if(k==='off'||!ambientUnlocked(k))return;warmAudio();if(!audioCtx)return;
    try{const src=audioCtx.createBufferSource();src.buffer=noiseBuffer(k);src.loop=true;const f=audioCtx.createBiquadFilter(),g=audioCtx.createGain();
      if(k==='rain'){f.type='bandpass';f.frequency.value=1800;f.Q.value=.5}else if(k==='hearth'){f.type='lowpass';f.frequency.value=700}else{f.type='bandpass';f.frequency.value=500;f.Q.value=.8;const lfo=audioCtx.createOscillator(),lg=audioCtx.createGain();lfo.frequency.value=.07;lg.gain.value=280;lfo.connect(lg);lg.connect(f.frequency);lfo.start()}
      src.connect(f);f.connect(g);g.connect(audioCtx.destination);g.gain.value=0;g.gain.setTargetAtTime(k==='rain'?.06:k==='hearth'?.22:.16,audioCtx.currentTime,.8);src.start();amb={src,g}}catch(e){}
  }

  /* ---------- run ---------- */
  function setupNew(minutes,rhythm){
    state={v:V,maxMinutes:minutes,rhythm,studiedSec:0,roomsVisited:0,doorsChosen:0,deadEnds:0,luckyCount:0,freeStreak:0,blocks:0,inkRun:0,relics:[],history:[],phase:'choose',room:null,selected:null,timer:null,intention:'',created:Date.now(),finished:null};
    profile.rhythm=rhythm;
    log('logStart',{t:fmtHM(maxSec())});
    createRoom();save();render();
  }
  function getExitChance(){
    const p=state.studiedSec/maxSec();
    const minStudy=Math.min(60,Math.max(15,Math.floor(state.maxMinutes*.2/15)*15));
    if(state.studiedSec<minStudy*60||state.roomsVisited<2)return 0;
    const power=Math.pow(Math.min(1,Math.max(0,(p-.2)/.8)),1.30);
    const relicBoost=state.relics.reduce((x,id)=>x+(relics.find(r=>r.id===id)?.boost||0),0);
    return Math.min(.62,.055+.35*power+relicBoost+Math.max(0,state.roomsVisited-4)*.006);
  }
  function eventPick(rem,allowDead){
    const exit={kind:'exit'};
    if(rem<minFocus()*60||rand()<getExitChance())return exit;
    const choices=rh().focus.filter(m=>m*60<=rem);if(!choices.length)return exit;
    const study={kind:'study',min:pick(choices)};
    if(state.freeStreak>=2)return study;
    const w=[['study',.55],['lucky',.12+.02*L('garden')],['relic',.09],['page',profile.pagesN<PAGES?.07+.03*L('maps'):0],['passage',.07],['deadend',allowDead?.10:0]];
    let r=rand()*w.reduce((a,x)=>a+x[1],0);
    for(const [k,x] of w){if((r-=x)<0)return k==='study'?study:{kind:k}}
    return study;
  }
  function assignDoorSkins(){
    if(!state||!state.room||!Array.isArray(state.room.doors))return;
    if(!Array.isArray(state.recentDoorSkins))state.recentDoorSkins=[];
    const pool0=availableSkins(),used=new Set(state.room.doors.map(d=>d.skin).filter(Boolean));let changed=false;
    for(const d of state.room.doors){
      if(d.skin&&doorSkins.some(s=>s.id===d.skin))continue;
      const pool=pool0.filter(s=>!used.has(s.id)&&!state.recentDoorSkins.includes(s.id)&&!profile.sigils.includes(s.id));
      const fb=pool0.filter(s=>!used.has(s.id));
      const c=pick(pool.length?pool:fb);d.skin=c.id;used.add(c.id);changed=true;
    }
    if(changed){state.recentDoorSkins=Array.from(new Set([...state.recentDoorSkins,...state.room.doors.map(d=>d.skin)])).slice(-9)}
  }
  function createRoom(){
    state.roomsVisited++;
    const rem=leftSec(),nameIdx=Math.floor(rand()*I.en.rooms.length);
    let doors;
    if(rem<minFocus()*60||state.roomsVisited>=26)doors=Array.from({length:3},()=>({id:uid(),kind:'exit'}));
    else{
      doors=[eventPick(rem,true),eventPick(rem,true),eventPick(rem,false)].map(e=>({id:uid(),...e}));
      if(!doors.some(d=>d.kind==='study'||d.kind==='exit')){const c=rh().focus.filter(x=>x*60<=rem);doors[Math.floor(rand()*3)]={id:uid(),kind:'study',min:pick(c)}}
    }
    // A known, not yet awakened sign sometimes appears on one door. It never changes what is behind it.
    if(!profile.hidden&&profile.sigilStep<knownSigils()&&rand()<.4)doors[Math.floor(rand()*3)].skin=profile.sigils[profile.sigilStep];
    state.room={id:uid(),nameIdx,doors,blocked:[]};
    assignDoorSkins();
    state.phase='choose';state.selected=null;
    log('logRoom',{n:state.roomsVisited,room:nameIdx});
  }
  function chooseDoor(i){
    if(state.phase!=='choose'||state.room.blocked.includes(i))return;
    warmAudio();state.doorsChosen++;
    const door=state.room.doors[i];
    if(!profile.hidden&&profile.sigilStep<knownSigils()&&door.skin===profile.sigils[profile.sigilStep]){
      profile.sigilStep++;log('logSigil',{n:profile.sigilStep});openToast(t('tSigil',{n:profile.sigilStep}));
      if(profile.sigilStep>=4){profile.hidden=true;profile.ink+=200;profile.inkTotal+=200;queueCelebrate('sign',t('hiddenT'),t('hiddenD'))}
    }
    if(leftSec()<minFocus()*60){win();return}
    const ev={...door};state.selected={index:i,event:ev};
    switch(ev.kind){
      case 'deadend':state.deadEnds++;state.room.blocked.push(i);state.freeStreak++;log('logDead');break;
      case 'lucky':state.luckyCount++;state.freeStreak++;gainInk(5,false);log('logLucky');break;
      case 'relic':{state.freeStreak++;const unk=relics.map((r,k)=>k).filter(k=>!state.relics.includes(relics[k].id));
        if(unk.length){const k=pick(unk);state.relics.push(relics[k].id);state.selected.relic=k;log('logRelic',{relic:k})}else{state.selected.relic=-1;log('logHint')}break}
      case 'page':state.freeStreak++;if(profile.pagesN<PAGES){profile.pagesN++;state.selected.page=profile.pagesN;log('logPage',{n:profile.pagesN})}else{ev.kind='lucky';state.selected.event=ev;state.luckyCount++}break;
      case 'passage':state.freeStreak++;log('logPassage');break;
      case 'study':state.freeStreak=0;log('logStudy',{n:ev.min});break;
      case 'exit':win();return;
    }
    state.phase='reveal';save();render();
  }
  function inkMult(){return 1+.10*L('lanterns')+.05*Math.max(0,L('scriptorium')-1)+(profile.hidden?.15:0)}
  function gainInk(n,mult=true){const g=Math.round(mult?n*inkMult():n);profile.ink+=g;profile.inkTotal+=g;if(state)state.inkRun+=g;return g}
  function advanceReveal(){
    const e=state.selected.event;
    if(e.kind==='study'){const inp=$('intentInput');if(inp){state.intention=inp.value.trim().slice(0,140);if(state.intention)log('logIntent',{s:state.intention})}else state.intention='';state.lastFocusMin=e.min;startTimer('focus',e.min);return}
    if(e.kind==='deadend'){if(state.room.blocked.length>=3)createRoom();else{state.phase='choose';state.selected=null}}else createRoom();
    save();render();
  }
  function startTimer(kind,minutes){
    warmAudio();const ms=minutes*60000;
    state.timer={kind,min:minutes,durationMs:ms,remainingMs:ms,endsAt:Date.now()+ms,running:true};
    state.phase=kind==='focus'?'study':'break';save();render();
    if(kind==='focus'){startAmbient();if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>updateFullscreenClass())}
    scheduleSignal(ms,kind);tick();
  }
  function timerLeftMs(){if(!state||!state.timer)return 0;return state.timer.running?Math.max(0,state.timer.endsAt-Date.now()):Math.max(0,state.timer.remainingMs)}
  function updateTimerUI(){
    if(!state||!state.timer||!(state.phase==='study'||state.phase==='break'))return;
    const left=timerLeftMs(),total=state.timer.durationMs,el=$('timerText');if(!el)return;
    el.textContent=fmtClock(Math.ceil(left/1000));
    const r=146,circ=2*Math.PI*r,ratio=Math.max(0,Math.min(1,left/total)),arc=$('countArc'),dot=$('countDot');
    if(arc){arc.style.strokeDasharray=String(circ);arc.style.strokeDashoffset=String(circ*(1-ratio))}
    let wm=(left/1000)%60;if(left>=total-50)wm=60;const ang=(-90+((60-wm)/60)*360)*Math.PI/180;
    if(dot){dot.setAttribute('cx',String(180+146*Math.cos(ang)));dot.setAttribute('cy',String(180+146*Math.sin(ang)))}
    const b=$('pauseBtn');if(b)b.textContent=state.timer.running?t('pause'):t('resume');
    const n=$('timerStatus');if(n&&state.phase==='study')n.textContent=state.timer.running?t('stRun'):t('stPause');
    updateTitle();
  }
  function tick(){
    if(!state||!state.timer||!(state.phase==='study'||state.phase==='break'))return;
    if(timerLeftMs()<=0){state.phase==='study'?finishStudy():finishBreak(true);return}
    updateTimerUI();
  }
  function pauseToggle(){
    if(!state||!state.timer)return;const tm=state.timer;
    if(tm.running){tm.remainingMs=timerLeftMs();tm.endsAt=null;tm.running=false;cancelScheduled();if(state.phase==='study'){stopAmbient();log('logPause')}}
    else{warmAudio();tm.endsAt=Date.now()+tm.remainingMs;tm.running=true;scheduleSignal(tm.remainingMs,tm.kind);if(state.phase==='study'){startAmbient();log('logResume')}}
    save();updateTimerUI();
  }
  function recordFocus(sec){const k=dayKey(new Date());profile.days[k]=(profile.days[k]||0)+sec;profile.lifeSec+=sec;profile.blocks++;pruneDays()}
  function finishStudy(){
    if(!state||state.phase!=='study')return;
    const sec=Math.round(state.timer.durationMs/1000),m=Math.round(sec/60);
    state.studiedSec+=sec;state.blocks++;recordFocus(sec);
    const g=gainInk(m);state.lastGain=g;
    log('logDone',{n:m,t:fmtHM(state.studiedSec)});
    state.timer=null;stopAmbient();endSignal('focus');
    if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
    checkRank();
    state.phase='post';save();render();
  }
  function checkRank(){
    const r=rankIdx();
    if(r>profile.lastRank){profile.lastRank=r;let gift=false;if(profile.pagesN<PAGES){profile.pagesN++;gift=true}
      queueCelebrate('laurel',t('rankUpT'),gift?t('rankUpD',{r:rankName(r)}):t('rankUpD2',{r:rankName(r)}))}
  }
  function breakLength(){const r=rh(),last=state.lastFocusMin||r.focus[0];if(state.blocks%r.every===0)return r.long;return r.brk!=null?r.brk:Math.max(3,Math.round(last/5))}
  function startBreak(){const n=breakLength();log('logBreak',{n});state.tip=Math.floor(rand()*t('tips').length);startTimer('break',n)}
  function finishBreak(complete){
    if(!state||state.phase!=='break')return;
    state.timer=null;
    if(complete){endSignal('break');profile.breaks++;const n=3*L('tea');if(n){gainInk(n,false);openToast(t('teaBonus',{n}))}}else cancelScheduled();
    createRoom();save();render();
  }
  function win(){
    if(!state)return;cancelScheduled();stopAmbient();warmAudio();signal(0,'focus');
    const bonus=Math.round(state.inkRun*.1);if(bonus)gainInk(bonus,false);state.winBonus=bonus;
    profile.sessions++;state.phase='win';state.finished=Date.now();state.selected=null;state.timer=null;
    log('logWin');save();render();
  }
  function safeFinishAfterSleep(){if(state&&state.timer&&state.timer.running&&state.timer.endsAt<=Date.now()){state.phase==='study'?finishStudy():finishBreak(true)}}

  /* ---------- rendering ---------- */
  function fitVisibleCard(){
    const panel=document.querySelector('#dialogRoot:not(.hidden) .scrollPanel')||document.querySelector('#view .welcome');if(!panel)return;
    panel.style.transform='';const rect=panel.getBoundingClientRect(),inD=!!panel.closest('#dialogRoot');
    const aH=window.innerHeight-(inD?32:Math.max(140,window.innerHeight*.23)),aW=window.innerWidth-32;
    const sc=Math.min(1,aH/Math.max(rect.height,1),aW/Math.max(rect.width,1));if(sc<.995)panel.style.transform=`scale(${sc.toFixed(3)})`;
  }
  function scheduleCardFit(){requestAnimationFrame(()=>{fitVisibleCard();requestAnimationFrame(fitVisibleCard)})}
  function updateFullscreenClass(){const o=$('timerOverlay');if(o)o.classList.toggle('fullscreen',!!document.fullscreenElement)}

  /* ---------- panels: library, codex, journal, saves ---------- */
  function closePanel(){render()}
  function streak(){let sh=L('clock'),n=0;const d=new Date();for(let i=0;i<800;i++){const ok=(profile.days[dayKey(d)]||0)>=900;if(ok)n++;else if(i>0){if(sh>0)sh--;else break}d.setDate(d.getDate()-1)}return n}
  function restoreWing(id){
    const w=WINGS.find(x=>x.id===id),lv=L(id);if(!w||lv>=w.cost.length)return;const c=w.cost[lv];
    if(profile.ink<c){openToast(t('tNotEnough'));return}
    profile.ink-=c;profile.wings[id]=lv+1;save();applyRestoration();warmAudio();tone(660,0,.3,.12);tone(990,.15,.5,.12);
    openToast(t('tRestoredWing',{w:tw('wings',id)}));showLibrary();
    if(state&&state.phase==='choose')hud();
  }
  async function exportSave(){
    const data=JSON.stringify(snapshot(),null,2),filename='forgotten-library-save.json';
    try{if(window.claude&&window.claude.use){const dl=await Promise.race([window.claude.use('downloads'),new Promise(r=>setTimeout(()=>r(null),3000))]);if(dl){await dl.save({filename,data});openToast(t('tSaved'));return}}}catch(e){}
    try{const url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);openToast(t('tSaved'))}catch(e){openToast(t('copyFail'))}
  }
  function importText(txt){
    try{const d=JSON.parse(txt);
      if(d&&d.v===3&&validRun(Object.assign({},d,{history:[]}))){cancelScheduled();stopAmbient();state=fixRun(Object.assign({},d,{rhythm:'labyrinth',history:[]}));}
      else if(d&&d.v===V&&d.profile){cancelScheduled();stopAmbient();const keep=profile.lang;adopt(d);if(!profile.lang)profile.lang=keep}
      else throw 0;
      save();applyLang();render();openToast(t('tLoaded'));
    }catch(e){openToast(t('tLoadFail'))}
  }
  function confirmRestart(){
    if(!state){render();return}
    confirmBox(t('confirmNew'),()=>{cancelScheduled();stopAmbient();if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});state=null;save();render()});
  }
  const celebrations=[];
  function queueCelebrate(icon,title,desc){celebrations.push({icon,title,desc})}
  /* ===== v5 etching UI ===== */
  const ICONS={
    hourglass:'<path d="M12 5h16M12 35h16M14 5c0 9 12 10 12 15s-12 6-12 15M26 5c0 9-12 10-12 15s12 6 12 15"/><path class="thin" d="M16 31h8M17.5 28.5h5M19.5 13h1"/>',
    clover:'<circle cx="15" cy="15" r="5"/><circle cx="25" cy="15" r="5"/><circle cx="15" cy="25" r="5"/><circle cx="25" cy="25" r="5"/><path d="M20 25c1 5 4 8 8 10"/>',
    key:'<circle cx="12" cy="20" r="6"/><circle class="thin" cx="12" cy="20" r="2"/><path d="M18 20h17M29 20v5M33 20v4"/>',
    page:'<path d="M10 5h15l6 6v24H10z"/><path d="M25 5v6h6"/><path class="thin" d="M14 16h13M14 20h13M14 24h13M14 28h9"/>',
    stairs:'<path d="M5 34h7v-6h7v-6h7v-6h7v-6h4"/><path class="thin" d="M5 34L37 10M9 34l-1-3M16 28l-1-3M23 22l-1-3M30 16l-1-3"/>',
    wall:'<path d="M5 9h30v24H5z"/><path class="thin" d="M5 15h30M5 21h30M5 27h30M14 9v6M26 9v6M10 15v6M20 15v6M30 15v6M14 21v6M26 21v6M10 27v6M20 27v6M30 27v6"/>',
    tick:'<circle cx="20" cy="20" r="14"/><path d="M13 20l5 5 9-11"/>',
    cup:'<path d="M9 16h18v6a9 9 0 0 1-18 0z"/><path d="M27 18h3a3 3 0 0 1 0 6h-3"/><path d="M6 33h26"/><path class="thin" d="M14 12c-2-2 2-4 0-7M19 12c-2-2 2-4 0-7"/>',
    sign:'<path d="M20 4l14 16-14 16L6 20z"/><path d="M20 11l8 9-8 9-8-9z"/><circle cx="20" cy="20" r="1.5"/>',
    map:'<path d="M5 9l9-3 12 4 9-3v25l-9 3-12-4-9 3z"/><path class="thin" d="M14 6v25M26 10v25M8 20c4-3 8 3 12 0s8 2 12-1"/>',
    compass:'<circle cx="20" cy="20" r="14"/><path d="M20 8l4 12-4 12-4-12z"/><path class="thin" d="M16 20h8"/>',
    seal:'<circle cx="20" cy="16" r="10"/><circle class="thin" cx="20" cy="16" r="6"/><path d="M14 24l-3 11 5-3 3 4 1-10M26 24l3 11-5-3-3 4"/>',
    lantern:'<path d="M20 2v6M15 8h10l3 6v14l-3 4H15l-3-4V14z"/><path class="thin" d="M12 14h16M12 28h16M20 14v14M16 14v14M24 14v14"/><path d="M17 36h6"/>',
    lyre:'<path d="M12 34h16M14 34C6 24 8 10 14 6M26 34c8-10 6-24 0-28M13 10h14"/><path class="thin" d="M17 10v24M20 10v24M23 10v24"/>',
    quill:'<path d="M8 36C14 24 22 12 34 4c-2 10-8 20-20 26"/><path class="thin" d="M14 30l-2-6M20 24l-1-5M25 18l-1-4M29 12v-3"/>',
    leaf:'<path d="M8 32C8 16 18 8 34 6c-2 16-10 26-26 26z"/><path class="thin" d="M8 32L28 12M15 25h-5M19 21h-4M23 17v-4M19 21v-4"/>',
    clock:'<circle cx="20" cy="20" r="14"/><path d="M20 10v10l7 4"/><path class="thin" d="M20 7v2M20 31v2M7 20h2M31 20h2"/>',
    star:'<path d="M20 4v32M6 12l28 16M6 28l28-16"/><circle class="thin" cx="20" cy="20" r="4"/>',
    laurel:'<path d="M20 36C10 30 8 18 12 8M20 36c10-6 12-18 8-28"/><path class="thin" d="M12 14c-3 0-4-2-4-4 3 0 4 2 4 4zM11 22c-3 1-5-1-5-3 3-1 5 1 5 3zM14 29c-3 1-5 0-6-2 3-1 5 0 6 2zM28 14c3 0 4-2 4-4-3 0-4 2-4 4zM29 22c3 1 5-1 5-3-3-1-5 1-5 3zM26 29c3 1 5 0 6-2-3-1-5 0-6 2z"/>'
  };
  const ico=(n,cls='')=>`<svg class="ico ${cls}" viewBox="0 0 40 40" aria-hidden="true">${ICONS[n]||ICONS.sign}</svg>`;
  const WING_ICON={lanterns:'lantern',tea:'cup',music:'lyre',maps:'map',scriptorium:'quill',garden:'leaf',clock:'clock',stars:'star',hidden:'sign'};
  const RELIC_ICON=['key','map','compass','seal'];
  const HATCH=['hA','hB','hH','hV','hX','hD'];
  const hatchOf=(id)=>HATCH[Math.max(0,doorSkins.findIndex(s=>s.id===id))%HATCH.length];
  const roman=(n)=>{const m=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let s='';for(const [v,r] of m)while(n>=v){s+=r;n-=v}return s};
  // Sentence case for strings the translations wrote in capitals (ROOM, CLOSED, MIN).
  const sc=(s)=>{s=String(s);if(s!==s.toLocaleUpperCase(lang)||s===s.toLocaleLowerCase(lang))return s;const l=s.toLocaleLowerCase(lang);return l.charAt(0).toLocaleUpperCase(lang)+l.slice(1)};
  const roomLabel=(n)=>sc(t('room',{n:'\u0001'})).replace('\u0001',roman(n));
  function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let x=Math.imul(a^a>>>15,1|a);x=x+Math.imul(x^x>>>7,61|x)^x;return((x^x>>>14)>>>0)/4294967296}}

  /* An engraved interior after Piranesi's Carceri: receding arches, stairs, ropes; lanterns and ivy follow restoration. */
  function roomArt(seed){
    const R=mulberry(seed*9301+49297),VPX=720,VPY=400,o=[];
    const p=(d,w,op,extra='')=>o.push(`<path class="art-line" d="${d}" stroke-width="${w}" opacity="${op}" ${extra}/>`);
    // darkness everywhere first: the vault outside the front arch stays in deep cross-hatching
    o.push('<rect width="1440" height="900" fill="url(#hX)" opacity=".72"/><rect width="1440" height="900" fill="url(#hD)" opacity=".34"/>');
    // receding arches, nearest first; each opening lighter than the last, so the eye travels toward the light
    const n=4+Math.floor(R()*2),tones=[['hX',.62],['hA',.5],['hB',.36],['hA',.22],['hV',.1]];
    for(let i=0;i<n;i++){
      const s=.98*Math.pow(.6,i),w=1320*s,h=470*s,gy=VPY+200*s,t=64*s,x0=VPX-w/2,x1=VPX+w/2,r=w/2,ri=r-t;
      const outer=`M${x0} ${gy}V${gy-h}A${r} ${r} 0 0 1 ${x1} ${gy-h}V${gy}`;
      const innerD=`M${x0+t} ${gy}V${gy-h}A${ri} ${ri} 0 0 1 ${x1-t} ${gy-h}V${gy}`;
      const band=`${outer}H${x1-t}V${gy-h}A${ri} ${ri} 0 0 0 ${x0+t} ${gy-h}V${gy}Z`;
      const op=(1-.13*i).toFixed(2);
      o.push(`<path d="${band}" fill="var(--paper)"/><path d="${band}" fill="url(#${i===0?'hX':(i%2?'hB':'hA')})" opacity="${(i===0?.75:.6-.08*i).toFixed(2)}"/>`);
      // shadowed inner face of each pier
      o.push(`<rect x="${x0+t}" y="${gy-h}" width="${t*.45}" height="${h}" fill="url(#hD)" opacity="${(.5-.08*i).toFixed(2)}"/>`);
      p(outer,2.6*s+.6,op);p(innerD,1.5*s+.4,op);
      if(i<2){for(let a=12;a<180;a+=12){const rad=a*Math.PI/180,cx=VPX,cy=gy-h;p(`M${(cx-ri*Math.cos(rad)).toFixed(1)} ${(cy-ri*Math.sin(rad)).toFixed(1)}L${(cx-r*Math.cos(rad)).toFixed(1)} ${(cy-r*Math.sin(rad)).toFixed(1)}`,1*s+.3,op)}}
      const inner=`${innerD}Z`;
      o.push(`<path d="${inner}" fill="var(--paper)"/>`);
      if(i<n-1){const [pat,to]=tones[i];o.push(`<path d="${inner}" fill="url(#${pat})" opacity="${to}"/>`)}
    }
    // the floor in front catches the light; tone it lightly, then rule it in perspective
    o.push('<rect x="0" y="600" width="1440" height="300" fill="var(--paper)"/>');
    for(let x=-760;x<=2200;x+=150)p(`M${VPX+(x-VPX)*.16} 600L${x} 900`,.8,.4);
    for(let k=1;k<=9;k++){const y=600+300*Math.pow(k/9,1.9);p(`M0 ${y.toFixed(1)}H1440`,.7,.3)}
    o.push('<rect x="0" y="600" width="1440" height="34" fill="url(#hD)" opacity=".5"/>');
    // a flight of stairs climbing out of frame
    const side=R()<.5?-1:1,sx=VPX+side*260;let sy=600;const sw=side*24;
    let d=`M${sx} ${sy}`;for(let k=0;k<13;k++){d+=`v-22h${sw}`;sy-=22}
    p(d,1.4,.75);p(`M${sx} 600L${sx+13*sw} ${600-13*22}`,1,.6);
    o.push(`<path d="M${sx} 600L${sx+13*sw} ${600-13*22}V600Z" fill="url(#hV)" opacity=".35"/>`);
    // a bridge across the second arch, sometimes
    if(R()<.55){const s=.6,y=VPY+200*s-470*s*.55,x0=VPX-660*s,x1=VPX+660*s;p(`M${x0} ${y}H${x1}M${x0} ${y+14}H${x1}`,1.2,.7);
      for(let x=x0+12;x<x1;x+=18)p(`M${x} ${y}v-16`,.8,.6);p(`M${x0} ${y-16}H${x1}`,1,.6);
      o.push(`<rect x="${x0}" y="${y}" width="${x1-x0}" height="14" fill="url(#hH)" opacity=".5"/>`)}
    // ropes from the vault; restored lanterns hang from them
    const lamps=L('lanterns'),ropes=[VPX-430,VPX+390,VPX-150,VPX+560];
    ropes.forEach((x,k)=>{const len=150+R()*120;p(`M${x} 0Q${x+8} ${len/2} ${x} ${len}`,1,.7);
      if(k<lamps){const y=len;o.push(`<g transform="translate(${x-14} ${y}) scale(.7)" opacity=".9"><path class="art-line" stroke-width="1.6" d="M20 0v8M15 8h10l3 6v14l-3 4H15l-3-4V14z"/><path class="art-line" stroke-width="1" d="M12 14h16M12 28h16M16 14v14M20 14v14M24 14v14"/></g>`)}
      else p(`M${x-5} ${len}q5 8 10 0`,1,.6)});
    // ivy climbing the nearest arch
    const g=L('garden');
    for(let k=0;k<g*2;k++){const left=k%2===0,x=left?VPX-640+30:VPX+640-30;let y=600-40*k,dd=`M${x} ${y}`;
      for(let j=0;j<7;j++){const dx=(R()-.5)*40,dy=-(30+R()*25);dd+=`q${(dx*1.6).toFixed(1)} ${(dy/2).toFixed(1)} ${dx.toFixed(1)} ${dy.toFixed(1)}`;y+=dy;
        o.push(`<ellipse cx="${(x+dx+(R()-.5)*10).toFixed(1)}" cy="${y.toFixed(1)}" rx="6" ry="3.5" transform="rotate(${Math.round(R()*180)} ${(x+dx).toFixed(1)} ${y.toFixed(1)})" class="art-line" stroke-width=".9" fill="url(#hA)" opacity=".8"/>`)}
      p(dd,1,.75)}
    return `<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${o.join('')}</svg>`;
  }
  let artKey='';
  function drawArt(seed){const k=`${seed}|${L('lanterns')}|${L('garden')}`;if(k===artKey)return;artKey=k;$('art').innerHTML=roomArt(seed)}

  function doorSVG(d,blocked){
    const cx=100,cy=120,ri=70,ro=88;let v='';
    for(let a=10;a<180;a+=10){const r=a*Math.PI/180;v+=`M${(cx-ri*Math.cos(r)).toFixed(1)} ${(cy-ri*Math.sin(r)).toFixed(1)}L${(cx-ro*Math.cos(r)).toFixed(1)} ${(cy-ro*Math.sin(r)).toFixed(1)}`}
    const inner='M30 320V120A70 70 0 0 1 170 120V320Z';
    const fill=blocked?'url(#hBrick)':`url(#${hatchOf(d.skin)})`;
    const s=skinFor(d);
    return `<svg class="door-art" viewBox="0 0 200 320" aria-hidden="true">
      <path d="M12 320V120A88 88 0 0 1 188 120V320Z" fill="var(--paper)"/><path d="M12 320V120A88 88 0 0 1 188 120V320Z" fill="url(#hV)" opacity=".45"/>
      <path d="${inner}" fill="var(--paper)"/><path d="${inner}" fill="${fill}"/>${blocked?'':`<path d="${inner}" fill="url(#hD)" opacity=".3"/>`}
      ${blocked?'':`<path class="deep" d="${inner}" fill="url(#hD)" mask="url(#deepMask)"/>`}
      <path class="thin" d="${v}"/>
      <path class="frame" d="M12 320V120A88 88 0 0 1 188 120V320M30 320V120A70 70 0 0 1 170 120V320"/>
      <path class="stone" d="M88 33L112 33L108 52L92 52Z"/>
      ${blocked?'':'<circle class="stone" cx="100" cy="150" r="19"/>'}<text class="glyph" x="100" y="151">${blocked?'':s.symbol+'︎'}</text>
      <path class="thin" d="M0 320H200M4 326H196"/></svg>`;
  }

  /* ---------- rendering (v5) ---------- */
  function applyLang(){
    lang=(profile.lang&&I[profile.lang])?profile.lang:detectLang();
    document.documentElement.lang=lang;document.documentElement.dir=RTL.has(lang)?'rtl':'ltr';
    const sel=$('langSel');sel.innerHTML=LANGS.map(([c,n])=>`<option value="${c}" ${c===lang?'selected':''}>${n}</option>`).join('');sel.setAttribute('aria-label',t('langLabel'));
    $('brandLabel').innerHTML=esc(t('title'))+(profile.hidden?'<span class="sig" aria-hidden="true">◈︎</span>':'');
    [['libBtn','bLibrary'],['codexBtn','bCodex'],['historyBtn','bJournal'],['savesBtn','bSaves'],['soundTest','bSound'],['fullscreenBtn','bScreen'],['newGameBtn','bNew']].forEach(([id,k])=>{$(id).textContent=t(k)});
    updateTitle();
  }
  function applyRestoration(){$('brandLabel').innerHTML=esc(t('title'))+(profile.hidden?'<span class="sig" aria-hidden="true">◈︎</span>':'')}
  function setAmbience(){}
  function layoutTop(){const b=$('topbar').getBoundingClientRect().bottom;$('hud').style.top=(b+8)+'px';$('view').style.paddingTop=(b+(state&&state.phase!=='win'?40:16))+'px'}
  function hud(){
    $('hud').className='hud';
    $('hud').innerHTML=`<span>${esc(t('hFocus'))} <b>${fmtHM(state.studiedSec)}</b> / ${fmtHM(maxSec())}</span><span>${esc(t('hInk'))} <b>${profile.ink}</b></span><span>${esc(t('hDoors'))} <b>${state.doorsChosen}</b></span>`;
  }
  function render(){
    if(state&&(state.phase==='study'||state.phase==='break'))safeFinishAfterSleep();
    $('dialogRoot').className='hidden';$('dialogRoot').innerHTML='';$('timerOverlay').className='hidden';$('timerOverlay').innerHTML='';
    applyRestoration();updateTitle();requestAnimationFrame(layoutTop);
    if(!state){drawArt(7);showWelcome();flushCelebrate();return}
    hud();
    if(state.phase==='win'){drawArt(11);showWin();flushCelebrate();return}
    drawArt((state.room.nameIdx||0)*31+state.roomsVisited);
    const sigilOn=!profile.hidden&&profile.sigilStep<knownSigils()?profile.sigils[profile.sigilStep]:null;
    $('view').innerHTML=`<div class="doors">${state.room.doors.map((d,i)=>{const bl=state.room.blocked.includes(i);return `<button class="door ${bl?'blocked':''} ${sigilOn&&d.skin===sigilOn?'sigil':''}" data-idx="${i}" ${bl||state.phase!=='choose'?'disabled':''} aria-label="${esc(skinName(d.skin))}, ${esc(t('dirs')[i])}">${doorSVG(d,bl)}<span class="door-caption">${bl?esc(sc(t('closed'))):esc(skinName(d.skin))}</span></button>`}).join('')}</div>
      <div class="room-caption"><div class="no">${esc(roomLabel(state.roomsVisited))}</div><h2>${esc(roomName(state.room))}</h2></div>`;
    $('view').querySelectorAll('.door').forEach(b=>b.onclick=()=>chooseDoor(Number(b.dataset.idx)));
    if(state.phase==='reveal')showDialog(revealData(),advanceReveal);
    if(state.phase==='post')showPost();
    if(state.phase==='study'||state.phase==='break')showTimer();
    flushCelebrate();
  }
  function rhythmCard(id){return `<button class="rhythm ${profile.rhythm===id?'on':''}" data-r="${id}" aria-pressed="${profile.rhythm===id}">${esc(t(RHYTHMS[id].name))}</button>`}
  function rhythmDesc(id){const r=RHYTHMS[id];return (id==='labyrinth'?t('rLabFmt'):t('rFmt',{f:r.focus.join('/'),b:r.brk}))+'; '+t('rLong',{n:r.every})}
  function showWelcome(){
    $('hud').className='hud hidden';
    const minFor=(id)=>Math.max(15,Math.min(...RHYTHMS[id].focus));
    const has=profile.lifeSec>0||profile.ink>0,lim=profile.lastLimit||300;
    $('view').innerHTML=`<div class="welcome"><h1>${esc(t('welTitle'))}</h1><p class="sub">${esc(t('welEyebrow'))}</p>
      <p class="lead">${esc(t('welLead'))} ${esc(t('welStrong'))}</p>
      <div class="form"><span class="k">${esc(t('rhythm'))}</span><div class="rhythms">${Object.keys(RHYTHMS).map(rhythmCard).join('')}</div>
        <span class="rhythm-desc" id="rDesc">${esc(rhythmDesc(profile.rhythm))}</span>
        <span class="k">${esc(t('welSet'))}</span><div class="time-controls"><label class="time-control"><input id="hoursInput" type="number" min="0" max="12" value="${Math.floor(lim/60)}" aria-label="${esc(t('hours'))}"><span>${esc(t('hours'))}</span></label><label class="time-control"><input id="minsInput" type="number" min="0" max="59" value="${lim%60}" aria-label="${esc(t('minutes'))}"><span>${esc(t('minutes'))}</span></label></div></div>
      <p class="note" id="limitNote">${esc(t('welNote',{min:minFor(profile.rhythm)}))}</p>
      <button class="primary" id="beginBtn">${esc(t('begin'))}</button>
      ${has?`<p class="profile-line">${esc(t('profileLine',{rank:rankName(rankIdx()),ink:profile.ink,candles:streak()}))}. <button class="ghost" id="welLib">${esc(t('visitLib'))}</button></p>`:''}
      <p class="save-tip">${esc(t('welTip'))}</p></div>`;
    $('view').querySelectorAll('.rhythm').forEach(b=>b.onclick=()=>{profile.rhythm=b.dataset.r;$('view').querySelectorAll('.rhythm').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});$('rDesc').textContent=rhythmDesc(profile.rhythm);$('limitNote').textContent=t('welNote',{min:minFor(profile.rhythm)})});
    if($('welLib'))$('welLib').onclick=showLibrary;
    $('beginBtn').onclick=()=>{
      const h=parseInt($('hoursInput').value,10)||0,m=parseInt($('minsInput').value,10)||0,tot=h*60+m,mn=minFor(profile.rhythm);
      if(h<0||h>12||m<0||m>59||tot<mn||tot>720){openToast(t('errLimit',{min:mn}));return}
      warmAudio();profile.lastLimit=tot;setupNew(tot,profile.rhythm);
    };
  }
  function showWin(){
    const st=(k,v)=>`<div><span>${esc(t(k))}</span><b>${v}</b></div>`;
    $('view').innerHTML=`<div class="welcome"><h1>${esc(t('winT'))}</h1><p class="sub">${esc(t('winLead'))}</p>
      <div class="bigtime">${fmtHM(state.studiedSec)}</div><p class="note">${esc(t('winOf',{t:fmtHM(maxSec())}))}</p>
      <div class="colophon">${st('sBlocks',state.blocks)}${st('sDoors',state.doorsChosen)}${st('sDead',state.deadEnds)}${st('sLucky',state.luckyCount)}${st('sFinds',state.relics.length)}${st('sInk','+'+state.inkRun)}</div>
      ${state.winBonus?`<p class="note">${esc(t('winBonus',{n:state.winBonus}))}</p>`:''}
      <div class="button-row" style="margin-top:16px"><button class="primary" id="replayBtn">${esc(t('winReplay'))}</button><button class="ghost" id="winLib">${esc(t('visitLib'))}</button></div>
      <p class="save-tip">${esc(t('winAgain'))}</p></div>`;
    $('replayBtn').onclick=()=>{state=null;save();render()};$('winLib').onclick=showLibrary;
  }
  function revealData(){
    const s=state.selected,e=s.event;
    if(e.kind==='study')return {kind:'study',icon:'hourglass',title:t('revStudyT'),minutes:e.min,desc:esc(t('revStudyD')),action:t('revStudyA'),intent:L('scriptorium')>=1};
    if(e.kind==='lucky')return {kind:'lucky',icon:'clover',title:t('revLuckyT'),desc:`${esc(t('zeroMin'))}. <span class="gain">${esc(t('plusInk',{n:5}))}</span>`,action:t('revLuckyA')};
    if(e.kind==='relic'){const nm=s.relic>=0?t('relicN')[s.relic]:t('hintName'),d=s.relic>=0?t('relicD')[s.relic]:t('hintDesc');return {kind:'relic',icon:s.relic>=0?RELIC_ICON[s.relic]:'page',title:t('revRelicT'),desc:`${esc(t('revRelicD',{name:nm}))}<br>${esc(d)}`,action:t('cont')}}
    if(e.kind==='page'){const n=s.page;return {kind:'relic',icon:'page',title:t('revPageT'),desc:esc(t('revPageD',{n})),lore:t('lore')[n-1],sig:(n%3===0)?skinFor({skin:profile.sigils[n/3-1]}).symbol:'',action:t('cont')}}
    if(e.kind==='passage')return {kind:'passage',icon:'stairs',title:t('revPassT'),desc:esc(t('zeroMin')),action:t('enter')};
    return {kind:'deadend',icon:'wall',title:t('revDeadT'),desc:esc(t('revDeadD')),action:t('back')};
  }
  function showDialog(data,cb,secondary=null){
    const d=$('dialogRoot');
    const dur=data.minutes!=null?`<div class="event-duration">${data.minutes}<span> ${esc(t('minShort').toLocaleLowerCase(lang))}</span></div>`:'';
    d.className='overlay-bg';
    d.innerHTML=`<div class="scrollPanel event-${data.kind||'neutral'}" role="dialog" aria-modal="true" aria-label="${esc(data.title)}">
      <div class="event-icon" aria-hidden="true">${ico(data.icon)}</div><h2>${esc(data.title)}</h2>${dur}<p class="event-desc">${data.desc}</p>
      ${data.lore?`<p class="lore">${esc(data.lore)}${data.sig?` <span style="color:var(--sanguine)">${data.sig}︎</span>`:''}</p>`:''}
      ${data.intent?`<label class="intentLabel" for="intentInput">${esc(t('intentQ'))}</label><input class="intent" id="intentInput" maxlength="140" placeholder="${esc(t('intentPh'))}">`:''}
      <div class="button-row"><button class="primary" id="dialogNext">${esc(data.action)}</button>${secondary?`<button class="ghost" id="dialogSecondary">${esc(secondary.label)}</button>`:''}</div></div>`;
    $('dialogNext').onclick=cb;if(secondary)$('dialogSecondary').onclick=secondary.onClick;
    const inp=$('intentInput');if(inp)inp.onkeydown=e=>{if(e.key==='Enter')cb()};
  }
  function showPost(){
    const end=leftSec()<minFocus()*60,toDoors=()=>{createRoom();save();render()};
    const desc=`${esc(end?t('postEnd'):t('postD',{t:fmtHM(state.studiedSec)}))}<br><span class="gain">${esc(t('plusInk',{n:state.lastGain||0}))}</span>`;
    if(end){showDialog({kind:'post',icon:'tick',title:t('postT'),desc,action:t('toDoors')},toDoors);return}
    const n=breakLength(),long=state.blocks%rh().every===0;
    showDialog({kind:'post',icon:'tick',title:t('postT'),desc,action:t(long?'brLong':'brShort',{n})},startBreak,{label:t('skipBr'),onClick:toDoors});
  }
  function showTimer(){
    const o=$('timerOverlay'),isB=state.phase==='break';o.className='timer-focus'+(isB?' isbreak':'');
    let ticks='';for(let i=0;i<60;i++){const a=i*6*Math.PI/180,maj=i%5===0,r1=maj?152:158,r2=166;ticks+=`<line class="dial-tick ${maj?'major':''}" x1="${(180+r1*Math.sin(a)).toFixed(2)}" y1="${(180-r1*Math.cos(a)).toFixed(2)}" x2="${(180+r2*Math.sin(a)).toFixed(2)}" y2="${(180-r2*Math.cos(a)).toFixed(2)}"/>`}
    const ambKeys=['off','rain','hearth','wind'],ambLbl={off:'ambOff',rain:'ambRain',hearth:'ambHearth',wind:'ambWind'};
    const ambRow=isB?'':(L('music')>=1?`<div class="ambrow">${esc(t('amb'))}: ${ambKeys.map(k=>`<button class="minibtn ${profile.ambient===k?'on':''}" data-amb="${k}" ${ambientUnlocked(k)?'':'disabled'}>${esc(t(ambLbl[k]))}</button>`).join('')}</div>`:`<div class="ambrow">${esc(t('ambLocked'))}</div>`);
    o.innerHTML=`${isB?`<div class="break-label">${ico('cup')} ${esc(t('breakT'))}</div>`:(state.intention?`<div class="timer-intent">${esc(state.intention)}</div>`:'')}
      <div class="timer-ring"><svg viewBox="0 0 360 360" aria-hidden="true">${ticks}<circle cx="180" cy="180" r="171" class="timer-track"/><circle cx="180" cy="180" r="146" class="timer-track"/><circle id="countArc" cx="180" cy="180" r="146" class="timer-arc"/><circle id="countDot" cx="180" cy="34" r="5" class="timer-dot"/></svg><div class="timer-number" id="timerText">00:00</div></div>
      ${isB?`<p class="break-tip">${esc(t('tips')[state.tip||0]||'')}</p>`:''}
      <div class="timer-actions"><button class="ghost" id="pauseBtn">${esc(t('pause'))}</button>${isB?`<button class="ghost" id="endBreakBtn">${esc(t('endBreak'))}</button>`:`<button class="ghost" id="focusBtn">${esc(t('fullscreen'))}</button><button class="ghost" id="testAlarmBtn">${esc(t('testSignal'))}</button>`}</div>
      ${ambRow}${isB?'':`<p class="timer-small" id="timerStatus">${esc(t('stRun'))}</p>`}`;
    $('pauseBtn').onclick=pauseToggle;
    if(isB)$('endBreakBtn').onclick=()=>finishBreak(false);
    else{$('focusBtn').onclick=()=>document.documentElement.requestFullscreen?.().catch(()=>openToast(t('tFsFail')));$('testAlarmBtn').onclick=testSound;
      o.querySelectorAll('[data-amb]').forEach(b=>b.onclick=()=>{profile.ambient=b.dataset.amb;save();if(state.timer&&state.timer.running)startAmbient();else stopAmbient();o.querySelectorAll('[data-amb]').forEach(x=>x.classList.toggle('on',x===b))})}
    updateFullscreenClass();updateTimerUI();
  }
  function openPanel(html,name){const d=$('dialogRoot');d.className='overlay-bg';d.innerHTML=html;d.dataset.panel=name||'';const c=d.querySelector('.closeX');if(c)c.onclick=closePanel}
  let selWing=null;
  function showLibrary(){
    if(state&&(state.phase==='study'||state.phase==='break'))return;
    const ri=rankIdx(),next=RANK_H[ri+1],today=profile.days[dayKey(new Date())]||0;
    const prog=next?Math.min(1,(profile.lifeSec-RANK_H[ri]*3600)/((next-RANK_H[ri])*3600)):1;
    const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push({lbl:d.toLocaleDateString(lang,{weekday:'narrow'}),m:Math.round((profile.days[dayKey(d)]||0)/60)})}
    const mx=Math.max(25,...days.map(x=>x.m));
    if(!selWing){const aff=WINGS.find(w=>profile.lifeSec>=w.hours*3600&&L(w.id)<w.cost.length&&profile.ink>=w.cost[L(w.id)]);selWing=(aff||WINGS[0]).id}
    const order=['lanterns','tea','music','maps','hidden','scriptorium','garden','clock','stars'];
    const cell=(id)=>{
      if(id==='hidden')return `<button class="cell hid ${profile.hidden?'found l3':'l0'} ${selWing==='hidden'?'sel':''}" data-cell="hidden">${ico('sign')}<span>${esc(profile.hidden?tw('wings','hidden'):t('hiddenQ'))}</span></button>`;
      const w=WINGS.find(x=>x.id===id),lv=L(id),locked=profile.lifeSec<w.hours*3600;
      return `<button class="cell l${lv} ${locked?'locked':''} ${selWing===id?'sel':''}" data-cell="${id}">${ico(WING_ICON[id])}<span>${esc(tw('wings',id))}</span></button>`};
    let card;
    if(selWing==='hidden')card=`<h3>${esc(profile.hidden?tw('wings','hidden'):t('hiddenQ'))}</h3><p class="lv">${ico('sign')}</p><p>${esc(profile.hidden?tw('wingD','hidden'):t('hiddenHint'))}</p>`;
    else{const w=WINGS.find(x=>x.id===selWing),lv=L(w.id),max=w.cost.length,cost=w.cost[lv],locked=profile.lifeSec<w.hours*3600;
      let btn;if(locked)btn=`<p class="note" style="margin:0">${esc(t('opensAt',{t:fmtHours(w.hours)}))}</p>`;else if(lv>=max)btn=`<p class="note" style="margin:0">${esc(t('maxed'))}</p>`;else btn=`<button class="${profile.ink>=cost?'primary':'ghost'}" data-w="${w.id}">${esc(t(lv?'upgrade':'restore',{n:cost}))}</button>`;
      card=`<h3>${esc(tw('wings',w.id))}</h3><p class="lv">${esc(t('level',{n:lv,m:max}))}</p><p>${esc(tw('wingD',w.id))}</p>${btn}`}
    openPanel(`<div class="bigPanel" role="dialog" aria-modal="true"><button class="ghost closeX">${esc(t('close'))}</button><h2>${esc(t('libT'))}</h2><p class="sub">${esc(t('libSub'))}</p>
      <div class="ledger"><div><span>${esc(t('rank'))}</span> <b>${esc(rankName(ri))}</b></div><div><span>${esc(t('hInk'))}</span> <b>${profile.ink}</b></div><div><span>${esc(t('lifetime'))}</span> <b>${fmtHM(profile.lifeSec)}</b></div><div><span>${esc(t('today'))}</span> <b>${fmtHM(today)}</b></div><div title="${esc(t('candlesHint'))}"><span>${esc(t('candles'))}</span> <b>${streak()}</b></div></div>
      <div class="rankbar"><i style="width:${(prog*100).toFixed(1)}%"></i></div><div class="rankcap">${next?esc(t('nextRank',{r:rankName(ri+1),t:fmtHours(next)})):esc(t('maxRank'))}</div>
      <div class="libgrid"><div class="plan">${order.map(cell).join('')}</div><div class="wingcard">${card}
        <div class="week">${days.map(x=>`<div><span class="bar ${x.m?'':'zero'}" style="height:${x.m?Math.max(3,Math.round(60*x.m/mx)):1}px" title="${x.m} min"></span>${esc(x.lbl)}</div>`).join('')}</div><div class="weekcap">${esc(t('week'))}</div></div></div></div>`,'library');
    $('dialogRoot').querySelectorAll('[data-cell]').forEach(b=>b.onclick=()=>{selWing=b.dataset.cell;showLibrary()});
    $('dialogRoot').querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>restoreWing(b.dataset.w));
  }
  function showCodex(){
    if(state&&(state.phase==='study'||state.phase==='break'))return;
    const lore=t('lore'),k=knownSigils();
    const items=Array.from({length:PAGES},(_,i)=>{const n=i+1,have=n<=profile.pagesN,sig=(n%3===0&&have)?`<span class="sig">${skinFor({skin:profile.sigils[n/3-1]}).symbol}︎</span>`:'';
      return `<li class="${have?'':'miss'}"><span class="num">${roman(n)}</span><span class="txt">${have?esc(lore[i]):esc(t('missing'))}${sig}</span></li>`}).join('');
    const row=profile.sigils.map((s,i)=>i<k?`<span class="${i<profile.sigilStep?'lit':''}">${skinFor({skin:s}).symbol}︎</span>`:'<span class="unk">?</span>').join('');
    openPanel(`<div class="bigPanel" role="dialog" aria-modal="true"><button class="ghost closeX">${esc(t('close'))}</button><h2>${esc(t('codexT'))}</h2><p class="sub">${esc(t('codexSub',{n:profile.pagesN}))}</p>
      <ol class="codex">${items}</ol>
      <div class="signs"><p>${esc(t('signsT'))}</p><div class="row">${row}</div><p>${esc(profile.hidden?t('hiddenOpen'):t('signsRiddle'))} ${esc(t('signsProg',{n:profile.sigilStep}))}</p></div></div>`,'codex');
  }
  function showHistory(){
    if(!state){openToast(t('tStartFirst'));return}
    const items=state.history.slice(0,14).map(h=>`<div class="log-item"><span class="tm">${esc(new Date(h.ts).toLocaleTimeString(lang,{hour:'2-digit',minute:'2-digit'}))}</span>${esc(logText(h))}</div>`).join('');
    openPanel(`<div class="scrollPanel" style="width:min(620px,94vw)"><h2>${esc(t('journalT'))}</h2><div class="log">${items}</div><div class="button-row"><button class="primary" id="closeHistory">${esc(t('close'))}</button></div></div>`,'journal');
    $('closeHistory').onclick=closePanel;
  }
  function showSaves(){
    const code=JSON.stringify(snapshot());
    openPanel(`<div class="bigPanel savebox" style="width:min(700px,96vw)"><button class="ghost closeX">${esc(t('close'))}</button><h2>${esc(t('savesT'))}</h2><p class="sub">${esc(t('savesSub'))} ${cloud.on?esc(t('cloudOn')):''}</p>
      <div class="button-row"><button class="primary" id="dlBtn">${esc(t('dlFile'))}</button><button class="ghost" id="copyBtn">${esc(t('copyCode'))}</button><button class="ghost" id="fileBtn">${esc(t('loadFile'))}</button></div>
      <textarea id="codeOut" readonly>${esc(code)}</textarea>
      <p class="sub" style="margin-top:14px">${esc(t('pasteCode'))}</p><textarea id="codeIn"></textarea>
      <div class="button-row"><button class="ghost" id="loadCodeBtn">${esc(t('loadCode'))}</button><button class="ghost" id="eraseBtn" style="color:var(--sanguine)">${esc(t('eraseAll'))}</button></div></div>`,'saves');
    $('dlBtn').onclick=exportSave;$('fileBtn').onclick=()=>$('saveInput').click();
    $('copyBtn').onclick=async()=>{try{await navigator.clipboard.writeText(code);openToast(t('copied'))}catch(e){const ta=$('codeOut');ta.focus();ta.select();openToast(t('copyFail'))}};
    $('loadCodeBtn').onclick=()=>importText($('codeIn').value);
    $('eraseBtn').onclick=()=>confirmBox(t('confirmErase'),()=>{cancelScheduled();stopAmbient();const keep=profile.lang;profile=newProfile();profile.lang=keep;state=null;save();artKey='';applyLang();render()});
  }
  function confirmBox(text,onYes){
    const m=$('modal2');m.className='modal2';
    m.innerHTML=`<div class="scrollPanel"><p class="event-desc" style="color:var(--ink)">${esc(text)}</p><div class="button-row"><button class="primary" id="cYes">${esc(t('yes'))}</button><button class="ghost" id="cNo">${esc(t('no'))}</button></div></div>`;
    $('cYes').onclick=()=>{m.className='hidden';m.innerHTML='';onYes()};$('cNo').onclick=()=>{m.className='hidden';m.innerHTML=''};
  }
  function flushCelebrate(){
    const m=$('modal2');if(!celebrations.length||m.className==='modal2')return;
    const c=celebrations.shift();warmAudio();tone(784,0,.4,.1);tone(1175,.2,.8,.12);
    m.className='modal2';m.innerHTML=`<div class="scrollPanel"><div class="event-icon">${ico(c.icon)}</div><h2>${esc(c.title)}</h2><p class="event-desc">${esc(c.desc)}</p><div class="button-row"><button class="primary" id="celOk">${esc(t('cont'))}</button></div></div>`;
    $('celOk').onclick=()=>{m.className='hidden';m.innerHTML='';flushCelebrate()};
  }

  /* ---------- wiring ---------- */
  window.addEventListener('focus',tick);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
  document.addEventListener('fullscreenchange',updateFullscreenClass);
  document.addEventListener('keydown',(e)=>{
    if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
    if(e.shiftKey&&e.key.toLowerCase()==='n'){e.preventDefault();confirmRestart();return}
    if(e.code==='Space'&&state&&(state.phase==='study'||state.phase==='break')){e.preventDefault();pauseToggle()}
    if(e.key==='Escape'&&$('modal2').className==='modal2'&&$('cNo')){$('cNo').click();return}
    if(e.key==='Escape'&&$('dialogRoot').querySelector('.closeX,#closeHistory'))closePanel();
  });
  $('soundTest').onclick=testSound;$('savesBtn').onclick=showSaves;$('historyBtn').onclick=showHistory;$('libBtn').onclick=showLibrary;$('codexBtn').onclick=showCodex;$('newGameBtn').onclick=confirmRestart;
  $('saveInput').onchange=e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=()=>importText(String(r.result));r.readAsText(f)}e.target.value=''};
  $('fullscreenBtn').onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>openToast(t('tFsFail')));else document.exitFullscreen?.()};
  $('langSel').onchange=e=>{profile.lang=e.target.value;save();const open=$('dialogRoot').className==='overlay-bg'?$('dialogRoot').dataset.panel:'';applyLang();render();if(open==='library')showLibrary();else if(open==='codex')showCodex()};
  const ob=new MutationObserver(scheduleCardFit);ob.observe($('view'),{childList:true});ob.observe($('dialogRoot'),{childList:true});
  window.addEventListener('resize',()=>{scheduleCardFit();layoutTop()});

  const stored=loadLocal();
  if(stored)adopt(stored);else profile=newProfile();
  if(!profile)profile=newProfile();
  applyLang();setAmbience();render();
  if(stored&&state)openToast(t('tRestored'));
  setInterval(tick,250);scheduleCardFit();
  initCloud();
  if(window.__FL_TEST__)window.__fl={get state(){return state},get profile(){return profile}};
})();
