const GL='♚♛♜♝♞♟',OL='♔♕♖♗♘♙',TY='kqrbnp',boards=[];
const glyph=(c,t)=>(S.set=='minimal'&&c=='w'?OL:GL)[TY.indexOf(t)]+'\uFE0E';
const sqn=(r,c)=>'abcdefgh'[c]+(8-r);
class Board{
 constructor(el,o={}){Object.assign(this,{el,g:new Chess(),side:'w',inter:0,on:null,ui:null,sel:null,tg:[],last:null,lock:false},o);
  el.innerHTML='<div class="bw"><div class="board"></div></div>';this.bd=el.firstChild.firstChild;
  this.bd.onclick=e=>{const q=e.target.closest('.sq');q&&this.click(q.dataset.s)};boards.push(this);this.render()}
 render(an){const g=this.g,b=g.board(),f=this.side=='b',L=this.last,ck=g.in_check()?g.turn():0;let h='';
  for(let i=0;i<8;i++)for(let j=0;j<8;j++){const r=f?7-i:i,c=f?7-j:j,s=sqn(r,c),p=b[r][c],t=this.tg.find(m=>m.to==s);
   h+=`<div class="sq ${(r+c)%2?'d':'l'}${L&&(s==L.from||s==L.to)?' hl':''}${this.sel==s?' sel':''}${p&&p.type=='k'&&p.color==ck?' chk':''}${t?(t.captured||t.flags.includes('e')?' t c':' t'):''}" data-s="${s}">${j==0?`<span class="co r">${8-r}</span>`:''}${i==7?`<span class="co f">${'abcdefgh'[c]}</span>`:''}${p?`<span class="pc ${p.color} t${p.type}">${glyph(p.color,p.type)}</span>`:''}</div>`}
  this.bd.className='board set-'+S.set+(S.co?'':' nc');this.bd.innerHTML=h;
  if(an&&S.anim&&L){const e=this.bd.querySelector(`[data-s="${L.to}"] .pc`);
   if(e){const X=s=>{const c='abcdefgh'.indexOf(s[0]),r=8-s[1];return[f?7-c:c,f?7-r:r]},[a,b2]=X(L.from),[c2,d2]=X(L.to);
    e.animate([{transform:`translate(${(a-c2)*100}%,${(b2-d2)*100}%)`},{transform:'none'}],{duration:200,easing:'ease-out'})}}
  this.ui&&this.ui(this)}
 click(s){if(!this.inter||this.lock||this.g.game_over())return;const g=this.g,p=g.get(s),m=this.tg.filter(x=>x.to==s);
  if(this.sel&&m.length)return m[0].promotion?this.promo(m):this.finish(m[0]);
  if(p&&p.color==g.turn()&&p.color==this.side&&this.sel!=s){this.sel=s;this.tg=g.moves({square:s,verbose:true})}else{this.sel=null;this.tg=[]}
  this.render()}
 finish(m){this.play(m);this.on&&this.on(m)}
 play(m){this.g.move({from:m.from,to:m.to,promotion:m.promotion});this.last={from:m.from,to:m.to};this.sel=null;this.tg=[];snd(m.captured);this.render(1)}
 promo(ms){const d=document.createElement('div');d.className='promo';
  d.innerHTML=`<div class="card"><p>Promover o peão para:</p><div class="row">${ms.map(m=>`<button class="btn" data-p="${m.promotion}"><span class="pc ${this.side}">${glyph(this.side,m.promotion)}</span></button>`).join('')}</div></div>`;
  d.onclick=e=>{const b=e.target.closest('[data-p]');if(!b)return;d.remove();this.finish(ms.find(m=>m.promotion==b.dataset.p))};document.body.appendChild(d)}
 setMoves(a){this.g=new Chess();a.forEach(x=>this.g.move(x));const h=this.g.history({verbose:true}),l=h[h.length-1];this.last=l?{from:l.from,to:l.to}:null;this.sel=null;this.tg=[]}
 undo(n){while(n--)this.g.undo();const h=this.g.history({verbose:true}),l=h[h.length-1];this.last=l?{from:l.from,to:l.to}:null;this.sel=null;this.tg=[];this.render()}
 status(){const g=this.g;
  if(g.in_checkmate())return`Xeque-mate! ${g.turn()=='w'?'Pretas':'Brancas'} vencem.`;
  if(g.in_stalemate())return'Empate por afogamento.';
  if(g.insufficient_material())return'Empate por material insuficiente.';
  if(g.in_threefold_repetition())return'Empate por repetição de posição.';
  if(g.in_draw())return'Empate pela regra dos 50 lances.';
  return`Vez das ${g.turn()=='w'?'Brancas':'Pretas'}`+(g.in_check()?' — xeque!':'')}
 caps(){const r={w:'',b:''};this.g.history({verbose:true}).forEach(m=>{if(m.captured){const c=m.color=='w'?'b':'w';r[m.color]+=`<span class="pc ${c}">${glyph(c,m.captured)}</span>`}});return r}
}
function diagram(fen,dots=[],co){co=co&&S.co;let h='',r=0;
 for(const row of fen.split(' ')[0].split('/')){let c=0;
  for(const ch of row){const n=+ch||0;
   for(let k=0;k<(n||1);k++){const s=sqn(r,c),w=ch<'a',p=n?'':`<span class="pc ${w?'w':'b'} t${ch.toLowerCase()}">${glyph(w?'w':'b',ch.toLowerCase())}</span>`;
    h+=`<div class="sq ${(r+c)%2?'d':'l'}${dots.includes(s)?(n?' t':' t c'):''}">${p}</div>`;c++}}r++}
 return`<div class="bw"><div class="board set-${S.set}">${h}</div></div>`}
