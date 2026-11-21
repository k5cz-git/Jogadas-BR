const DEF={set:'classic',lt:'#eeeed2',dk:'#769656',sel:'#f6f669',mv:'#8b5cf6',hl:'#bba6ff',bd:'#3b3b4a',bw:6,rad:6,acc:'#8b5cf6',theme:'dark',bg:'black',bgc:'#0b0b0e',img:'',fx:5,anim:1,snd:1,cmp:0,co:1,bs:520};
const S={...DEF};try{Object.assign(S,JSON.parse(localStorage.getItem('jbr')||'{}'))}catch(e){}
const BG={black:['#0a0a0c','#f4f4f8'],gray:['#1c1c21','#dcdce3'],purple:['#1a1030','#e7dcfb']};
function applyS(){const d=document.documentElement,r=d.style,L=S.theme=='light',b=document.getElementById('bg');
 ['lt','dk','sel','mv','hl','bd'].forEach(k=>r.setProperty('--'+k,S[k]));
 r.setProperty('--p',S.acc);r.setProperty('--bw',S.bw+'px');r.setProperty('--rad',S.rad+'px');r.setProperty('--bs',S.bs+'px');r.setProperty('--fx',S.fx/10);
 d.dataset.theme=S.theme;d.dataset.dens=S.cmp?'cmp':'';d.classList.toggle('noanim',!S.anim);
 b.style.cssText='';b.className='';
 if(S.bg=='img'&&S.img){b.style.backgroundImage=`url("${S.img}")`;b.className='img'}
 else if(S.bg=='xadrez')b.style.background=`conic-gradient(${L?'#ececf2 25%,#e2e2ea 0 50%,#ececf2 0 75%,#e2e2ea 0':'#15151b 25%,#0c0c10 0 50%,#15151b 0 75%,#0c0c10 0'}) 0 0/72px 72px`;
 else if(S.bg=='aurora')b.style.background=`radial-gradient(60% 50% at 15% 0,#3b1d7a88,transparent),radial-gradient(50% 40% at 90% 100%,#5b21b655,transparent),${L?'#f1edfa':'#09090d'}`;
 else b.style.background=S.bg=='custom'?S.bgc:(BG[S.bg]||BG.black)[L?1:0]}
function set(o){Object.assign(S,o);try{localStorage.setItem('jbr',JSON.stringify(S))}catch(e){}applyS();boards.forEach(b=>b.render())}
function upImg(f){const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,1600/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);set({bg:'img',img:c.toDataURL('image/jpeg',.8)})};i.src=r.result};r.readAsDataURL(f)}
let ac;function snd(cap){if(!S.snd)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.type='triangle';o.frequency.value=cap?220:380;g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(g);g.connect(ac.destination);o.start();o.stop(t+.13)}catch(e){}}
function jingle(k){if(!S.snd||k=='draw')return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();(k=='win'?[523,659,784,1047]:[392,330,262]).forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+i*.16;o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.32)})}catch(e){}}
applyS();
