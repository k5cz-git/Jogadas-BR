if(typeof Chess=='undefined'){document.getElementById('app').innerHTML='<div class="card"><h2>Biblioteca de xadrez não carregada</h2><p>O Jogadas BR usa a biblioteca chess.js (CDN). Conecte-se à internet e recarregue a página.</p></div>';throw new Error('chess.js ausente')}
const $=(s,e=document)=>e.querySelector(s),LV=['Iniciante','Intermediário','Avançado'];
let lvSel=0,filt=-1,catSel=0,prac=null,aiT=0;
const pt=s=>s.replace(/^[NRQK]/,c=>({N:'C',R:'T',Q:'D',K:'R'}[c]));
const fens={},fenOf=o=>fens[o.id]||(fens[o.id]=(g=>{o.m.split(' ').forEach(x=>g.move(x));return g.fen()})(new Chess()));
const card=o=>`<a class="card hov" href="#ab-${o.id}">${diagram(fenOf(o))}<h3 style="margin-top:.7rem">${o.n}</h3><p class="mu">${LV[o.lv]} · estilo ${o.st}</p></a>`;
const STY=[['Atacante','Iniciativa e tática desde os primeiros lances.','gambito-do-rei'],['Sólido','Estruturas firmes e poucos riscos.','caro-kann'],['Posicional','Planos de longo prazo e controle de espaço.','inglesa'],['Clássico','Centro e desenvolvimento natural das peças.','italiana']];
const LVD=['Regras, peças e primeiros mates.','Centro, desenvolvimento e segurança do rei.','Táticas e planos estratégicos.'];
const tabs=(a,g,get,on)=>{const bs=[...a.querySelectorAll(g+' .btn')];const m=()=>bs.forEach(b=>b.classList.toggle('on',+b.dataset.i==get()));bs.forEach(b=>b.onclick=()=>{on(+b.dataset.i);m()});m()};
function fxEnd(b,over,fn){b.el.querySelectorAll('.endfx').forEach(e=>e.remove());if(!over)return;
 const g=b.g,k=g.in_checkmate()?(g.turn()!=b.side?'win':'lose'):'draw',T={win:['Vitória!','Xeque-mate. Você venceu a partida.'],lose:['Derrota','Xeque-mate. A IA venceu desta vez.'],draw:['Empate',b.status()]}[k];
 const x=fn?fn(k):'',o=document.createElement('div');o.className='endfx '+k;o.innerHTML=`<h2>${T[0]}</h2><p>${T[1]}</p>${x?`<p>${x}</p>`:''}`;
 if(k=='win'){const h=b.el.offsetHeight,n=S.fx*6,C=['#8b5cf6','#c4b5fd','#ffffff','#a78bfa'];
  for(let i=0;i<n;i++){const c=document.createElement('i');c.style.cssText=`left:${Math.random()*100}%;background:${C[i%4]};--h:${h}px;animation-delay:${Math.random()*1.2}s;animation-duration:${2+Math.random()*1.5}s`;o.appendChild(c)}}
 if(k=='lose'){const w=b.el.firstChild;w.classList.remove('shake');void w.offsetWidth;w.classList.add('shake')}
 b.el.appendChild(o);setTimeout(()=>o.remove(),5400);jingle(k)}
const RKEY='jbr_rank',PTS={1:{win:10,lose:-30,draw:-5},2:{win:20,lose:-20,draw:5},3:{win:35,lose:-12,draw:15}},TIER=[[0,'Iniciante'],[150,'Aprendiz'],[300,'Intermediário'],[500,'Avançado'],[800,'Mestre']];
const num=(v,a,b,d)=>Number.isFinite(+v)?Math.min(b,Math.max(a,Math.round(+v))):d;
function rankLoad(){let r={};try{r=JSON.parse(localStorage.getItem(RKEY)||'{}')||{};if(r.v!==2)r={}}catch(x){r={}}
 return{elo:num(r.elo,0,3000,100),w:num(r.w,0,1e6,0),l:num(r.l,0,1e6,0),d:num(r.d,0,1e6,0),best:num(r.best,0,3000,100),
  h:(Array.isArray(r.h)?r.h:[]).slice(0,20).map(x=>{x=x||{};return{r:['V','D','E'].includes(x.r)?x.r:'E',lv:num(x.lv,1,3,2),elo:num(x.elo,0,3000,100),p:x.p==null?null:num(x.p,-100,100,0),t:num(x.t,0,9e15,0)}})}}
function rankAdd(k,lv){const r=rankLoad(),d=(PTS[lv]||PTS[2])[k];
 r.elo=Math.max(0,r.elo+d);r.best=Math.max(r.best,r.elo);r[k=='win'?'w':k=='lose'?'l':'d']++;
 r.h.unshift({r:k=='win'?'V':k=='lose'?'D':'E',lv:+lv,elo:r.elo,p:d,t:Date.now()});r.h=r.h.slice(0,20);
 r.v=2;try{localStorage.setItem(RKEY,JSON.stringify(r))}catch(x){}
 return`Ranking: ${d>=0?'+':''}${d} pontos (${r.elo})`}
const R={
inicio(a){a.innerHTML=`<section class="hero"><div><h1>Domine o xadrez com o Jogadas BR</h1><p class="lead">Aprenda do zero, estude aberturas lance a lance e pratique contra uma IA que acompanha o seu nível.</p><div class="row"><a class="btn pri" href="#aprender">Começar a aprender</a><a class="btn" href="#treinar">Jogar agora</a></div></div>${diagram('r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R',[],1)}</section>
 <h2>Aberturas populares</h2><div class="grid">${[0,2,3,5].map(i=>card(OPS[i])).join('')}</div>
 <h2>Estilos de jogo</h2><div class="grid">${STY.map(([t,x,id])=>`<a class="card hov" href="#ab-${id}"><h3>${t}</h3><p class="mu">${x}</p><p class="mu">Exemplo: ${OPS.find(o=>o.id==id).n}</p></a>`).join('')}</div>
 <h2>Níveis de aprendizado</h2><div class="grid">${LV.map((l,i)=>`<a class="card hov" href="#aprender" data-lv="${i}"><h3>${l}</h3><p class="mu">${LVD[i]}</p></a>`).join('')}</div>`},
aprender(a){a.innerHTML=`<h1>Aprender xadrez</h1><p class="lead">Escolha seu nível e avance no seu ritmo.</p><div class="row tabs">${LV.map((l,i)=>`<button class="btn" data-i="${i}">${l}</button>`).join('')}</div><div id="ls"></div>`;
 const show=()=>{$('#ls').innerHTML='<div class="grid lg">'+LESSONS.filter(x=>x.lv==lvSel).map(x=>`<article class="card"><h3>${x.t}</h3>${x.d?diagram(x.d.fen,x.d.dots||reach(...x.d.r),1):''}<p style="margin-top:.6rem">${x.x}</p></article>`).join('')+'</div>'};
 tabs(a,'.tabs',()=>lvSel,i=>{lvSel=i;show()});show()},
aberturas(a,id){const o=OPS.find(x=>x.id==id);
 if(!o){const CAT=['Todas','Aberturas','Defesas','Ataques','Gambitos'],cat=x=>/^Defesa/.test(x.n)?2:/^Ataque/.test(x.n)?3:/^Gambito/.test(x.n)?4:1;
  a.innerHTML=`<h1>Biblioteca de aberturas</h1><p class="lead">${OPS.length} aberturas, defesas, ataques e gambitos. Entre em uma para ver os lances, entender as ideias e praticar.</p><div class="row tabs">${['Todos os níveis',...LV].map((l,i)=>`<button class="btn" data-i="${i-1}">${l}</button>`).join('')}</div><div class="row tc">${CAT.map((l,i)=>`<button class="btn" data-i="${i}">${l}</button>`).join('')}</div><div id="ol"></div>`;
  const show=()=>{const L=OPS.filter(x=>(filt<0||x.lv==filt)&&(!catSel||cat(x)==catSel));$('#ol').innerHTML=L.length?'<div class="grid">'+L.map(card).join('')+'</div>':'<p class="mu">Nenhuma abertura neste filtro.</p>'};
  tabs(a,'.tabs',()=>filt,i=>{filt=i;show()});tabs(a,'.tc',()=>catSel,i=>{catSel=i;show()});show();return}
 const mv=o.m.split(' '),li=t=>t.map(x=>`<li>${x}</li>`).join('');let n=0;
 a.innerHTML=`<a class="mu" href="#aberturas">← Todas as aberturas</a><h1>${o.n}</h1><p class="mu">${LV[o.lv]} · estilo ${o.st} · você joga de ${o.side=='w'?'brancas':'pretas'}</p>
 <div class="game"><div><div id="bd"></div><div class="row ctl"><button class="btn" data-s="-9" aria-label="Início">⏮</button><button class="btn" data-s="-1" aria-label="Voltar">◀</button><button class="btn" data-s="1" aria-label="Avançar">▶</button><button class="btn" data-s="9" aria-label="Fim">⏭</button></div></div>
 <div class="card"><h3>Lances</h3><div class="moves" id="mv"></div><p class="ex" id="ex"></p><button class="btn pri" id="pr">Praticar contra a IA</button></div></div>
 <div class="grid"><div class="card"><h3>Objetivo</h3><p>${o.o}</p></div><div class="card"><h3>Ideias principais</h3><ul>${li(o.i)}</ul></div><div class="card"><h3>Erros comuns</h3><ul>${li(o.er)}</ul></div><div class="card"><h3>Vantagens</h3><p>${o.p}</p></div><div class="card"><h3>Desvantagens</h3><p>${o.c}</p></div></div>`;
 const bd=new Board($('#bd'),{side:o.side});
 const show=(k,an)=>{k=Math.max(0,Math.min(mv.length,k));bd.setMoves(mv.slice(0,k));bd.render(an&&k>n);n=k;
  $('#mv').innerHTML=mv.map((s,i)=>`<button class="mvb${i==n-1?' on':''}" data-i="${i}">${i%2?'':(i/2+1)+'. '}${pt(s)}</button>`).join('');
  $('#ex').textContent=n?o.e[n-1]:'Posição inicial. Use ▶ para avançar lance a lance.'};
 a.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const s=+b.dataset.s;show(s==-9?0:s==9?mv.length:n+s,s==1)});
 $('#mv').onclick=e=>{const b=e.target.closest('[data-i]');if(b)show(+b.dataset.i+1,0)};
 $('#pr').onclick=()=>{prac={m:mv,side:o.side};location.hash='#treinar'};show(0)},
treinar(a){const pr=prac;prac=null;let bd,endKey='',undone=0,rec=0;
 a.innerHTML=`<h1>Treinar contra a IA</h1><div class="game"><div id="bd"></div><div class="card"><p class="stat" id="st"></p>
 <label>Jogar com<select id="cl"><option value="w">Brancas</option><option value="b">Pretas</option><option value="r">Aleatório</option></select></label>
 <label>Dificuldade<select id="df"><option value="1">Fácil</option><option value="2" selected>Médio</option><option value="3">Difícil</option></select></label>
 <div class="row"><button class="btn pri" id="ng">Nova partida</button><button class="btn" id="un">Voltar jogada</button></div>
 <p class="mu">Você capturou: <span class="cap" id="c1"></span></p><p class="mu">IA capturou: <span class="cap" id="c2"></span></p><div class="moves" id="hs"></div></div></div>`;
 const ui=b=>{$('#st').textContent=b.lock?'IA pensando…':b.status();const c=b.caps();$('#c1').innerHTML=c[b.side];$('#c2').innerHTML=c[b.side=='w'?'b':'w'];
  $('#hs').textContent=b.g.history().map((s,i)=>(i%2?'':(i/2+1)+'. ')+pt(s)).join(' ');
  const over=b.g.game_over(),key=over?b.g.history().length+b.status():'';if(key!==endKey){endKey=key;fxEnd(b,over,k=>undone?'Partida sem ranking (jogada desfeita).':rec?'':(rec=1,rankAdd(k,+$('#df').value)))}};
 const think=()=>{if(bd.g.game_over()||bd.g.turn()==bd.side)return;bd.lock=true;ui(bd);
  aiT=setTimeout(()=>{const m=aiMove(bd.g,+$('#df').value);bd.lock=false;if(m)bd.play(m)},350)};
 const start=pre=>{undone=rec=0;clearTimeout(aiT);let s=$('#cl').value;if(s=='r')s=Math.random()<.5?'w':'b';boards.length=0;
  bd=new Board($('#bd'),{side:s,inter:1,ui,on:()=>{ui(bd);think()}});if(pre)bd.setMoves(pre);bd.render();think()};
 $('#ng').onclick=()=>start();
 $('#un').onclick=()=>{if(bd.lock)return;if(bd.g.history().length)undone=1;bd.undo(Math.min(bd.g.history().length,bd.g.turn()==bd.side?2:1));think()};
 if(pr){$('#cl').value=pr.side;start(pr.m)}else start()},
ranking(a){const r=rankLoad(),tier=[...TIER].reverse().find(t=>r.elo>=t[0]),nx=TIER.find(t=>t[0]>r.elo),tot=r.w+r.l+r.d;
 a.innerHTML=`<h1>Ranking</h1><p class="lead">Sua pontuação sobe ou desce conforme o resultado das partidas contra a IA. Ela fica salva só neste navegador.</p><p class="mu">Pontos por partida (vitória / derrota / empate): Fácil +10 / −30 / −5 · Médio +20 / −20 / +5 · Difícil +35 / −12 / +15.</p>
 <div class="grid"><div class="card"><p class="mu">Pontuação</p><h1 style="margin:0">${r.elo}</h1><p>${tier[1]}${nx?` · faltam ${nx[0]-r.elo} para ${nx[1]}`:' · nível máximo'}</p></div>
 <div class="card"><h3>Seu histórico</h3><p>Vitórias: ${r.w} · Derrotas: ${r.l} · Empates: ${r.d}</p><p class="mu">Partidas: ${tot} · Melhor pontuação: ${r.best}</p></div>
 <div class="card"><h3>Níveis</h3><ul>${TIER.map(t=>`<li>${t[1]} — a partir de ${t[0]}</li>`).join('')}</ul></div></div>
 <h2>Últimas partidas</h2><div class="card">${r.h.length?`<ul>${r.h.map(x=>`<li>${{V:'Vitória',D:'Derrota',E:'Empate'}[x.r]} contra a IA ${['','Fácil','Média','Difícil'][x.lv]} — ${x.p==null?'':(x.p>0?'+':'')+x.p+' → '}${x.elo} pontos · ${new Date(x.t).toLocaleDateString('pt-BR')}</li>`).join('')}</ul>`:'<p class="mu">Nenhuma partida ainda. Jogue em Treinar para entrar no ranking.</p>'}</div>
 <div class="row"><a class="btn pri" href="#treinar">Jogar para subir</a><button class="btn" id="zr">Zerar ranking</button></div>
 <p class="mu">Um ranking entre jogadores exige contas e servidor, e ainda não está disponível.</p>`;
 $('#zr').onclick=()=>{if(confirm('Zerar o ranking deste navegador?')){try{localStorage.removeItem(RKEY)}catch(x){}go()}}},
personalizar(a){
 const CF=[['lt','Casas claras'],['dk','Casas escuras'],['sel','Casa selecionada'],['mv','Movimentos possíveis'],['hl','Destaque da última jogada'],['bd','Cor da borda']];
 const PRE=[['Verde','#eeeed2','#769656'],['Madeira','#f0d9b5','#b58863'],['Roxo','#e4dcf7','#7c5cbf'],['Cinza','#d9d9de','#6b6b78'],['Meia-noite','#c9c9d8','#3a3a55']];
 const SETS=[['classic','Clássico'],['minimal','Minimalista'],['modern','Moderno'],['flat','2D simples'],['d3','3D (profundidade)']];
 const BGS=[['black','Preto'],['gray','Cinza'],['purple','Roxo'],['custom','Personalizado'],['xadrez','Tabuleiro'],['aurora','Aurora']];
 const rg=(k,t,mi,ma,st=1)=>`<label>${t}<input type="range" data-k="${k}" data-n="1" min="${mi}" max="${ma}" step="${st}"></label>`;
 const ck=(k,t)=>`<label>${t}<input type="checkbox" data-k="${k}"></label>`;
 a.innerHTML=`<h1>Personalização</h1><p class="lead">As mudanças valem na hora e ficam salvas neste navegador.</p>
 <div class="game"><div class="sticky"><div id="pv"></div></div><div>
 <div class="card"><h3>Peças</h3><div class="row">${SETS.map(([k,t])=>`<button class="btn" data-set="${k}">${t}</button>`).join('')}</div></div>
 <div class="card"><h3>Tabuleiro</h3><div class="row">${PRE.map(([t,l,d],i)=>`<button class="btn sw" data-pre="${i}"><i style="background:${l}"></i><i style="background:${d}"></i>${t}</button>`).join('')}</div>
 ${CF.map(([k,t])=>`<label>${t}<input type="color" data-k="${k}"></label>`).join('')}
 <label>Estilo<select data-k="rad" data-n="1"><option value="0">Reto</option><option value="6">Suave</option><option value="18">Arredondado</option></select></label>${ck('co','Mostrar coordenadas (a–h e 1–8)')}${rg('bw','Largura da borda',0,16)}${rg('bs','Tamanho do tabuleiro',280,640,10)}</div>
 <div class="card"><h3>Fundo</h3><div class="row">${BGS.map(([k,t])=>`<button class="btn" data-bg="${k}">${t}</button>`).join('')}<label class="btn">Enviar imagem<input type="file" accept="image/*" id="up" hidden></label></div><label>Cor do fundo personalizado<input type="color" data-k="bgc"></label></div>
 <div class="card"><h3>Geral</h3><label>Tema<select data-k="theme"><option value="dark">Escuro</option><option value="light">Claro</option></select></label><label>Cor de destaque do site<input type="color" data-k="acc"></label>${rg('fx','Intensidade dos efeitos',0,10)}${ck('anim','Animações')}${ck('snd','Sons de movimento')}${ck('cmp','Interface compacta')}<button class="btn" id="rs">Restaurar padrão</button></div></div></div>`;
 const mark=()=>{a.querySelectorAll('[data-k]').forEach(i=>{const v=S[i.dataset.k];if(i.type=='checkbox')i.checked=!!v;else i.value=v});
  a.querySelectorAll('[data-set]').forEach(b=>b.classList.toggle('on',b.dataset.set==S.set));a.querySelectorAll('[data-bg]').forEach(b=>b.classList.toggle('on',b.dataset.bg==S.bg))};
 a.onclick=e=>{const b=e.target.closest('[data-pre],[data-set],[data-bg],#rs');if(!b)return;const d=b.dataset;
  if(b.id=='rs')set({...DEF});else if(d.pre!=null){const p=PRE[d.pre];set({lt:p[1],dk:p[2]})}else if(d.set)set({set:d.set});else set({bg:d.bg});mark()};
 a.oninput=e=>{const t=e.target,k=t.dataset.k;if(k)set({[k]:t.type=='checkbox'?+t.checked:t.dataset.n?+t.value:t.value})};
 $('#up').onchange=e=>e.target.files[0]&&upImg(e.target.files[0]);
 const pv=new Board($('#pv'),{side:'w'});pv.setMoves(OPS[0].m.split(' '));pv.render();mark()}};
function go(){let p=location.hash.slice(1)||'inicio',id;const a=$('#app');if(p.startsWith('ab-')){id=p.slice(3);p='aberturas'}
 boards.length=0;clearTimeout(aiT);document.querySelectorAll('.promo').forEach(e=>e.remove());
 a.className='';void a.offsetWidth;a.className='wrap page';a.innerHTML='';(R[p]||R.inicio)(a,id);
 document.querySelectorAll('#menu a').forEach(l=>l.classList.toggle('on',l.getAttribute('href')=='#'+p));scrollTo(0,0)}
document.addEventListener('click',e=>{const l=e.target.closest('[data-lv]');if(l)lvSel=+l.dataset.lv});
$('#burger').onclick=()=>$('#menu').classList.toggle('open');$('#menu').onclick=()=>$('#menu').classList.remove('open');
addEventListener('hashchange',go);go();
