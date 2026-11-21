const PV={p:100,n:320,b:330,r:500,q:900,k:0};
function ev(g){let s=0;const b=g.board();
 for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(!p)continue;const w=p.color=='w',t=p.type,cen=7-Math.abs(c-3.5)-Math.abs(r-3.5);let v=PV[t];
  if(t=='n'||t=='b')v+=cen*5;else if(t=='p')v+=(w?6-r:r-1)*7+cen*2;else if(t=='k'&&(w?r==7:r==0)&&(c>=6||c<=2))v+=25;
  s+=w?v:-v}return s}
const mk=m=>({from:m.from,to:m.to,promotion:m.promotion});
const order=ms=>ms.sort((x,y)=>(y.captured?PV[y.captured]:0)-(x.captured?PV[x.captured]:0));
function search(g,d,a,b,mx){if(!d)return ev(g);const ms=order(g.moves({verbose:true}));
 if(!ms.length)return g.in_check()?(mx?-1e5-d:1e5+d):0;
 let best=mx?-Infinity:Infinity;
 for(const m of ms){g.move(mk(m));const s=search(g,d-1,a,b,!mx);g.undo();
  if(mx){if(s>best)best=s;if(s>a)a=s}else{if(s<best)best=s;if(s<b)b=s}if(b<=a)break}
 return best}
function aiMove(g,lv){const ms=g.moves({verbose:true});if(!ms.length)return null;
 if(lv==1&&Math.random()<.2)return ms[Math.random()*ms.length|0];
 const [d,noise]={1:[1,150],2:[2,25],3:[3,0]}[lv],w=g.turn()=='w';let best=null,bs=w?-Infinity:Infinity;
 ms.sort(()=>Math.random()-.5);order(ms);
 for(const m of ms){g.move(mk(m));
  let s=g.in_checkmate()?(w?1e6:-1e6):search(g,d-1,(w&&!noise)?bs:-Infinity,(!w&&!noise)?bs:Infinity,!w);g.undo();
  s+=(Math.random()-.5)*2*noise;
  if(w?s>bs:s<bs){bs=s;best=m}}
 return best||ms[0]}
