/* Downtown Studio · comportements communs
   En-tête, pied de page, révélations, lumière au pointeur, barre de timecode,
   cycle de nœuds, journal, timeline de clips. Repris du site Progress. */
(function(){
"use strict";
document.body.classList.remove('no-js');
/* Variante d'accent choisie sur la page Système (gardée dans ce navigateur) */
window.dtApplyAcc=function(o){var r=document.documentElement.style;r.setProperty('--acc',o.a);r.setProperty('--acc-hi',o.h);r.setProperty('--acc-rgb',o.r);r.setProperty('--acc-glow','rgba('+o.r+',.55)')};

var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var R=document.body.dataset.root||'';           /* chemin relatif vers la racine de la maquette */
var PAGE=document.body.dataset.page||'';

/* Pages déjà maquettées. Les autres liens affichent le lot prévu. */
var BUILT=window.DT_BUILT||['index.html','systeme.html'];
var LOTS={'reserver/':1,'films/':1,'creer-avec-nous/':1,'a-propos/':1,
  'rejoindre/':2,'residents/':2,'apprendre/':2,'agenda/':2,
  'impact/':3,'a-propos/emplois/':3,'apprendre/':2,'contact/':3,'lettre/':3,'mentions-legales/':3,'confidentialite/':3};

function T(t,who){return '<span class="tbd" data-who="'+who+'">[À VALIDER : '+t+']</span>'}

/* ---------- En-tête ---------- */
var MAIN=[['creer-avec-nous/index.html','Créer avec nous','creer'],['reserver/index.html','Réserver','reserver'],['rejoindre/index.html','Rejoindre','rejoindre'],['apprendre/index.html','Apprendre','apprendre'],['agenda/index.html','Agenda','agenda']];
var SEC=[['films/index.html','Films','films'],['residents/index.html','Résidents','residents'],['a-propos/index.html','À propos','apropos']];
function cur(k){return k===PAGE?' aria-current="page"':''}
var hdr=document.createElement('header');hdr.className='top';
hdr.innerHTML='<div class="gut max"><div class="bar">'+
  '<a class="logo dt" href="'+R+'index.html" aria-label="Downtown Studio, accueil"><img src="'+R+'img/logo-downtown.svg" alt="Downtown Studio"></a>'+
  '<nav class="links" aria-label="Navigation principale">'+MAIN.map(function(m){return '<a href="'+R+m[0]+'" data-menu="'+m[2]+'"'+cur(m[2])+'>'+m[1]+'</a>'}).join('')+'</nav>'+
  '<nav class="subnav" aria-label="Navigation secondaire">'+SEC.map(function(m){return '<a class="hide-m" href="'+R+m[0]+'" data-menu="'+m[2]+'"'+cur(m[2])+'>'+m[1]+'</a>'}).join('')+
  '<a class="lang" href="#" data-later="Version anglaise · plus tard" title="Version anglaise prévue plus tard"><b>FR</b> / EN</a>'+
  '<a class="member" href="https://access.downtownstudio.ch" target="_blank" rel="noopener">Espace membres ↗</a></nav>'+
  '<button class="menu-btn" id="menuOpen" type="button" aria-expanded="false" aria-controls="overlay">Menu <i></i></button>'+
  '</div><div class="mega" id="mega" hidden></div><div class="tcbar" id="tcbar" aria-label="Chapitres"><div class="tc-now" id="tcNow"></div><div class="tc-track" id="tcTrack"><div class="tc-head" id="tcHead"></div></div><div class="tc-code" id="tcCode">00:00:00:00</div></div></div>';
document.body.insertBefore(hdr,document.body.querySelector('main'));
var ov=document.createElement('div');ov.className='overlay gut';ov.id='overlay';ov.hidden=true;
var MENU=window.DT_MENU||{};
function href(h){return /^https?:/.test(h)?h:R+h}
function ext(h){return /^https?:/.test(h)?' target="_blank" rel="noopener"':''}
ov.innerHTML='<button class="menu-btn close" id="menuClose" type="button" style="display:inline-flex">Fermer</button>'+
  MAIN.map(function(m){var d=MENU[m[2]];if(!d)return '<a href="'+R+m[0]+'">'+m[1]+'</a>';
    return '<details class="ov-sec"><summary>'+m[1]+'</summary><div class="ov-body"><a class="ov-top" href="'+R+m[0]+'">Voir la page '+m[1]+' →</a>'+
      d.groups.map(function(g){return '<div class="ov-g"><span class="lab dim">'+g[0]+'</span>'+g[1].map(function(l){return '<a href="'+href(l[1])+'"'+ext(l[1])+'>'+l[0]+'</a>'}).join('')+'</div>'}).join('')+'</div></details>'}).join('')+
  '<div class="sec-o">'+SEC.map(function(m){return '<a href="'+R+m[0]+'">'+m[1]+'</a>'}).join('')+'<a href="https://access.downtownstudio.ch">Espace membres ↗</a></div>';
document.body.insertBefore(ov,hdr.nextSibling);
document.getElementById('menuOpen').addEventListener('click',function(){ov.hidden=false;this.setAttribute('aria-expanded','true')});
document.getElementById('menuClose').addEventListener('click',function(){ov.hidden=true;document.getElementById('menuOpen').setAttribute('aria-expanded','false')});

/* ---------- Pied de page (quatre colonnes de l'architecture) ---------- */
var ft=document.createElement('footer');ft.className='site';
ft.innerHTML='<div class="in gut max">'+
  '<div class="col"><a class="logo dt" href="'+R+'index.html"><img src="'+R+'img/logo-downtown.svg" alt="Downtown Studio"></a>'+
    '<span class="k">La maison</span><p>Rue des Vieux-Grenadiers 10<br>1205 Genève</p><a href="tel:+41225925049">+41 22 592 50 49</a>'+
    '<a href="'+R+'a-propos/index.html#acces">Plan d\'accès</a><p>Accueil : '+T('horaires d\'accueil du lieu','Pascal')+'</p></div>'+
  '<div class="col"><span class="k">Projets et devis</span><p>'+T('adresse projets@downtownstudio.ch','Pascal')+'</p>'+
    '<span class="k">Réservations et membership</span><a class="mail" href="mailto:contact@downtownstudio.ch" style="justify-self:start">contact@downtownstudio.ch</a>'+
    '<span class="k">Presse</span><p>'+T('adresse et contact presse','Pascal')+'</p></div>'+
  '<div class="col"><span class="k">L\'écosystème</span>'+
    '<a href="https://cinetic-creatives.com" target="_blank" rel="noopener">Cinetic Creatives ↗</a>'+
    '<a href="https://guillaumehelleu.com/progress/" target="_blank" rel="noopener">Progress ↗</a>'+
    '<a href="https://magnetic.ch" target="_blank" rel="noopener">Magnetic ↗</a></div>'+
  '<div class="col"><span class="k">Suivre</span><p>Instagram : '+T('compte Instagram unique retenu (@downtowngva ou @downtownstudio.ch)','Pascal')+'</p>'+
    '<a href="https://www.linkedin.com" target="_blank" rel="noopener">LinkedIn, page entreprise ↗</a>'+
    '<a href="'+R+'lettre/index.html">La lettre mensuelle</a></div>'+
  '</div><div class="gut max foot-b"><nav><a href="'+R+'a-propos/index.html">À propos</a><a href="'+R+'a-propos/manifeste/index.html">Manifeste</a><a href="'+R+'impact/index.html">Impact</a><a href="'+R+'contact/index.html">Contact</a><a href="'+R+'a-propos/emplois/index.html">Emplois</a><a href="'+R+'mentions-legales/index.html">Mentions légales</a><a href="'+R+'confidentialite/index.html">Confidentialité</a></nav><span><a href="'+R+'systeme.html">Système graphique (maquette)</a> · Downtown Studio SA · Genève</span></div>';
document.body.appendChild(ft);

/* ---------- Liens vers les pages des lots suivants ---------- */
var toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast);
var tt=null;function say(h){toast.innerHTML=h;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},2600)}
document.addEventListener('click',function(e){
  var a=e.target.closest('a');if(!a)return;
  if(a.dataset.later){e.preventDefault();say(a.dataset.later);return}
  var h=a.getAttribute('href')||'';if(!h||h.charAt(0)==='#'||/^(https?:|mailto:|tel:)/.test(h))return;
  var rel=h.indexOf(R)===0?h.slice(R.length):h;rel=rel.split('#')[0];
  if(BUILT.indexOf(rel)>=0)return;
  var key=Object.keys(LOTS).filter(function(k){return rel.indexOf(k)===0}).sort(function(a,b){return b.length-a.length})[0];
  e.preventDefault();ov.hidden=true;
  say('Page prévue au <b>lot '+(key?LOTS[key]:'suivant')+'</b> · /'+rel.replace(/index\.html$/,''));
});

/* ---------- Révélation au défilement ---------- */
var io=new IntersectionObserver(function(ents){ents.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;t.classList.add('in');io.unobserve(t);
  if(t.matches('.nodes'))startCycle(t);
  var lg=t.querySelector&&t.querySelector('.log[data-play]');if(lg)playLog(lg);
  var tl=t.querySelector&&t.querySelector('.tl');if(tl)playTl(tl);
})},{threshold:.18});
document.querySelectorAll('[data-rv]').forEach(function(n){io.observe(n)});

/* ---------- Lumière au pointeur ---------- */
document.addEventListener('pointermove',function(e){var l=e.target.closest&&e.target.closest('.lit');if(!l)return;var r=l.getBoundingClientRect();l.style.setProperty('--mx',(e.clientX-r.left)+'px');l.style.setProperty('--my',(e.clientY-r.top)+'px')});

/* ---------- Cycle de nœuds ---------- */
function startCycle(box){
  if(reduce)return;
  var nodes=[].slice.call(box.querySelectorAll('.node')),loop=box.querySelector('.loop'),n=nodes.length,c=-1;
  function step(){
    nodes.forEach(function(x){x.classList.remove('act')});if(loop)loop.classList.remove('run');
    c=(c+1)%(n+1);
    if(c<n){nodes[c].classList.add('act');var w=nodes[c].querySelector('.wire');if(w){w.classList.remove('run');void w.offsetWidth;setTimeout(function(){w.classList.add('run')},1300)}}
    else{if(loop)loop.classList.add('run');c=0;nodes[1].classList.add('act')}
  }
  step();setInterval(step,2000);
}

/* ---------- Journal ---------- */
function playLog(box){
  var rows=[].slice.call(box.querySelectorAll('div')),st=document.getElementById(box.dataset.play);
  if(reduce){rows.forEach(function(r){r.classList.add('on')});return}
  rows.forEach(function(r,i){setTimeout(function(){r.classList.add('on');if(st)st.textContent=(i+1)+' / '+rows.length},400+i*550)});
}

/* ---------- Timeline de clips : la tête de lecture parcourt la séquence ---------- */
function playTl(tl){
  var head=tl.querySelector('.tl-head'),track=tl.querySelector('.tl-track'),clips=[].slice.call(tl.querySelectorAll('.clip')),code=tl.querySelector('[data-tc]');
  var total=+tl.dataset.total||1;
  function at(p){
    var x=0,tw=track.getBoundingClientRect().width;head.style.left=(p*100)+'%';
    var px=p*tw,acc=0;clips.forEach(function(c){var w=c.getBoundingClientRect().width+2;c.classList.toggle('on',px>=acc&&px<acc+w);acc+=w});
    if(code){var s=Math.round(p*total),h=Math.floor(s/3600),m=Math.floor(s/60)%60,ss=s%60;code.textContent=(h?h+':':'')+String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0')}
  }
  if(reduce||!head){clips.forEach(function(c){c.classList.add('on')});return}
  head.style.opacity=1;var D=9000,s0=null;
  function fr(ts){if(!s0)s0=ts;var p=((ts-s0)%D)/D;at(p);requestAnimationFrame(fr)}
  requestAnimationFrame(fr);
}

/* ---------- Barre de timecode (chapitres de la page) ---------- */
var chaps=[].slice.call(document.querySelectorAll('main [data-ch]')),tcbar=document.getElementById('tcbar'),track=document.getElementById('tcTrack'),head=document.getElementById('tcHead');
function pad(n){return String(n).padStart(2,'0')}
chaps.forEach(function(c,i){var m=document.createElement('span');m.className='tc-mk';m.dataset.n=pad(i+1);m.title=c.dataset.ch;m.addEventListener('click',function(){c.scrollIntoView({behavior:reduce?'auto':'smooth'})});track.appendChild(m);c._mk=m});
function tcUpdate(){
  if(!chaps.length){tcbar.classList.remove('on');return}
  var y=window.scrollY,vh=window.innerHeight,docH=document.documentElement.scrollHeight-vh;
  tcbar.classList.toggle('on',y>chaps[0].offsetTop-vh*.5);
  var n=chaps.length,T0=chaps.map(function(c){return c.offsetTop-vh*.45}),f;
  chaps.forEach(function(c,i){c._mk.style.left=(100*(i+.5)/n)+'%'});
  if(y<T0[0])f=-.5+.5*Math.max(0,y)/Math.max(1,T0[0]);
  else{f=n-1;for(var i=0;i<n;i++){var nx=i<n-1?T0[i+1]:docH;if(y<nx){f=i+(y-T0[i])/Math.max(1,nx-T0[i]);break}}}
  var hp=100*Math.min(1,(f+.5)/n);head.style.left=hp+'%';track.style.setProperty('--p',hp+'%');
  var cu=null;chaps.forEach(function(c,i){var on=c.offsetTop-vh*.45<=y;c._mk.classList.toggle('seen',on);if(on)cu=i});
  chaps.forEach(function(c,i){c._mk.classList.toggle('cur',i===cu)});
  document.getElementById('tcNow').innerHTML=cu===null?'':'<b>'+pad(cu+1)+'</b>'+chaps[cu].dataset.ch;
  var fr=Math.round(Math.max(0,Math.min(1,y/docH))*14*60*25);
  document.getElementById('tcCode').textContent='00:'+pad(Math.floor(fr/1500)%60)+':'+pad(Math.floor(fr/25)%60)+':'+pad(fr%25);
}
window.addEventListener('scroll',tcUpdate,{passive:true});window.addEventListener('resize',tcUpdate);tcUpdate();

/* ---------- Lettre : retour immédiat ---------- */
document.querySelectorAll('form[data-letter]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
  var m=f.querySelector('input[type=email]'),o=f.querySelector('.ok');
  if(!/^\S+@\S+\.\S+$/.test(m.value.trim())){o.textContent='Indiquez une adresse e-mail valide.';return}
  o.textContent='Merci. La prochaine lettre arrivera à '+m.value.trim()+'.';f.reset()})});

/* ---------- Filtres des listes (Réserver, Films) ---------- */
document.querySelectorAll('.filters[data-target]').forEach(function(fb){
  var box=document.querySelector(fb.dataset.target),cnt=document.querySelector('[data-count="'+fb.dataset.target+'"]');
  function apply(f){
    var n=0,items=box.querySelectorAll('[data-item]');
    items.forEach(function(it){var ok=f==='*'||(it.dataset.tags||'').toLowerCase().indexOf(f.toLowerCase())>=0;it.hidden=!ok;if(ok)n++});
    if(cnt)cnt.textContent=n+(n>1?' résultats':' résultat')+(f==='*'?'':' · '+f);
    fb.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.f===f))});
  }
  fb.addEventListener('click',function(e){var b=e.target.closest('button[data-f]');if(b)apply(b.dataset.f)});
  apply('*');
});

/* ---------- Formulaires : retour immédiat, sans rechargement ---------- */
document.querySelectorAll('form[data-form]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
  var m=f.querySelector('input[type=email]'),o=f.querySelector('.ok');
  if(m&&!/^\S+@\S+\.\S+$/.test(m.value.trim())){o.textContent='Indiquez une adresse e-mail valide.';return}
  o.textContent=f.dataset.form;f.reset()})});

/* ---------- Agenda : une date passée bascule seule dans les archives ---------- */
(function(){var up=document.querySelector('[data-upcoming]'),ar=document.querySelector('[data-archive]');if(!up||!ar)return;
  var t=new Date();t.setHours(0,0,0,0);
  [].slice.call(up.querySelectorAll('[data-date]')).forEach(function(e){if(new Date(e.dataset.date+'T23:59:59')<t)ar.insertBefore(e,ar.firstChild)})})();

/* ---------- Flux d'échange (mentor ↔ participant), repris de Progress ---------- */
(function(){var svg=document.getElementById('flowSvg');if(!svg)return;var NS='http://www.w3.org/2000/svg',W0=0;
  function el(t,a,p){var n=document.createElementNS(NS,t);for(var k in a)n.setAttribute(k,a[k]);if(p)p.appendChild(n);return n}
  function build(){var r=svg.getBoundingClientRect(),w=Math.round(r.width),h=Math.round(r.height);if(!w||!h||w===W0)return;W0=w;
    svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.innerHTML='';var m=10,a,b,vert=w<520;
    if(vert){a='M'+(w*.3)+' '+m+' C '+(w*.3)+' '+(h*.4)+', '+(w*.3)+' '+(h*.6)+', '+(w*.3)+' '+(h-m);b='M'+(w*.7)+' '+(h-m)+' C '+(w*.7)+' '+(h*.6)+', '+(w*.7)+' '+(h*.4)+', '+(w*.7)+' '+m}
    else{a='M'+m+' '+(h*.4)+' C '+(w*.3)+' '+(h*.04)+', '+(w*.7)+' '+(h*.04)+', '+(w-m)+' '+(h*.4);b='M'+(w-m)+' '+(h*.6)+' C '+(w*.7)+' '+(h*.96)+', '+(w*.3)+' '+(h*.96)+', '+m+' '+(h*.6)}
    var cs=getComputedStyle(svg),acc=cs.getPropertyValue('--red').trim()||'#E6483A',ink=cs.getPropertyValue('--ink').trim()||'#000';
    el('path',{d:a,fill:'none',stroke:acc,'stroke-width':'1.2'},svg);
    el('path',{d:b,fill:'none',stroke:ink,'stroke-opacity':'.55','stroke-width':'1','stroke-dasharray':'3 5'},svg);
    if(reduce)return;
    [[a,acc,2.6,.65],[b,ink,3.4,.85]].forEach(function(q){for(var j=0;j<4;j++){var c=el('circle',{r:3,fill:q[1],style:''},svg);el('animateMotion',{dur:q[2]+'s',repeatCount:'indefinite',begin:(j*q[3])+'s',path:q[0]},c)}});}
  build();window.addEventListener('resize',function(){clearTimeout(build.t);build.t=setTimeout(build,150)});
  new IntersectionObserver(function(e){if(e[0].isIntersecting)build()}).observe(svg);})();

/* ---------- Bandeau cookies : refus par défaut des cookies non essentiels ---------- */
(function(){var k='dt-cookies',v=null;try{v=localStorage.getItem(k)}catch(e){}if(v)return;
  var b=document.createElement('div');b.className='cookie';b.setAttribute('role','dialog');b.setAttribute('aria-label','Cookies');
  b.innerHTML='<p>Le site utilise des cookies techniques. Les cookies de mesure ne sont déposés qu\'avec votre accord. <a class="more" href="'+R+'confidentialite/index.html">Confidentialité →</a></p><div class="actions"><button class="btn line" type="button" data-c="refus">Refuser</button><button class="btn line" type="button" data-c="ok">Accepter</button></div>';
  document.body.appendChild(b);
  b.addEventListener('click',function(e){var t=e.target.closest('[data-c]');if(!t)return;try{localStorage.setItem(k,t.dataset.c)}catch(err){}b.remove()});})();

/* ---------- Méga-menu : toute l'arborescence d'une rubrique, comme sur le site de la HEAD ---------- */
(function(){var MENU=window.DT_MENU||{},mega=document.getElementById('mega');if(!mega||!Object.keys(MENU).length)return;
  var hdr=document.querySelector('header.top'),openK=null,tOpen=null,tClose=null;
  function href(h){return /^https?:/.test(h)?h:R+h}
  function ext(h){return /^https?:/.test(h)?' target="_blank" rel="noopener"':''}
  function render(k){var d=MENU[k];
    mega.innerHTML='<div class="mega-in"><div class="mega-head"><span class="lab dim">Rubrique</span><a class="xw" href="'+R+d.href+'">'+d.title+'</a><p>'+d.lede+'</p><a class="more" href="'+R+d.href+'">Voir la page →</a></div>'+
      '<div class="mega-cols">'+d.groups.map(function(g){return '<div class="mega-g"><span class="lab dim">'+g[0]+'</span>'+g[1].map(function(l){return '<a href="'+href(l[1])+'"'+ext(l[1])+'>'+l[0]+'</a>'}).join('')+'</div>'}).join('')+'</div></div>';}
  function open(k){clearTimeout(tClose);if(openK===k&&!mega.hidden)return;render(k);openK=k;mega.hidden=false;hdr.classList.add('mega-on');
    document.querySelectorAll('[data-menu]').forEach(function(a){a.classList.toggle('on',a.dataset.menu===k)})}
  function close(){openK=null;mega.hidden=true;hdr.classList.remove('mega-on');document.querySelectorAll('[data-menu].on').forEach(function(a){a.classList.remove('on')})}
  document.querySelectorAll('header [data-menu]').forEach(function(a){var k=a.dataset.menu;if(!MENU[k])return;
    a.setAttribute('aria-haspopup','true');
    a.addEventListener('mouseenter',function(){clearTimeout(tOpen);tOpen=setTimeout(function(){open(k)},90)});
    a.addEventListener('mouseleave',function(){clearTimeout(tOpen)});
    a.addEventListener('focus',function(){open(k)});});
  hdr.addEventListener('mouseleave',function(){clearTimeout(tOpen);tClose=setTimeout(close,220)});
  hdr.addEventListener('mouseenter',function(){clearTimeout(tClose)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  document.addEventListener('focusin',function(e){if(!hdr.contains(e.target))close()});
})();

/* ---------- Organigramme : fils du tronc et liens entre résidents et projets ---------- */
(function(){document.querySelectorAll('[data-eco]').forEach(function(box){
  var NS='http://www.w3.org/2000/svg',svg=box.querySelector('.eco-wires'),inn=box.querySelector('.eco-in');
  var links=[];try{links=JSON.parse(box.querySelector('[data-eco-links]').textContent)}catch(e){}
  function nd(id){return box.querySelector('[data-id="'+id+'"]')}
  function el(t,a,p){var n=document.createElementNS(NS,t);for(var k in a)n.setAttribute(k,a[k]);if(p)p.appendChild(n);return n}
  function rc(n){var a=n.getBoundingClientRect(),b=inn.getBoundingClientRect();return {l:a.left-b.left,t:a.top-b.top,r:a.right-b.left,b:a.bottom-b.top,cx:(a.left+a.right)/2-b.left,cy:(a.top+a.bottom)/2-b.top}}
  function draw(){
    var w=inn.clientWidth,h=inn.clientHeight;svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.innerHTML='';
    var root=rc(nd('root')),heads=[].slice.call(box.querySelectorAll('.eco-h')).map(rc);
    var oneCol=heads.length>1&&Math.abs(heads[0].cx-heads[1].cx)<4;
    if(!oneCol){var y=root.b+(Math.min.apply(null,heads.map(function(x){return x.t}))-root.b)/2;
      var d='M'+root.cx+' '+root.b+' V'+y+' M'+Math.min.apply(null,heads.map(function(x){return x.cx}))+' '+y+' H'+Math.max.apply(null,heads.map(function(x){return x.cx}));
      heads.forEach(function(x){d+=' M'+x.cx+' '+y+' V'+x.t});
      el('path',{d:d,class:'bus'},svg);
      heads.forEach(function(x){el('circle',{cx:x.cx,cy:x.t,r:3.5,class:'dot'},svg)});el('circle',{cx:root.cx,cy:root.b,r:3.5,class:'dot'},svg);
      if(!reduce){var p=el('path',{d:d,fill:'none',stroke:'none'},svg),c=el('circle',{r:3,fill:getComputedStyle(svg).getPropertyValue('--red').trim()||'#E6483A'},svg);
        el('animateMotion',{dur:'5s',repeatCount:'indefinite',path:'M'+root.cx+' '+root.b+' V'+y+' H'+heads[0].cx+' V'+heads[0].t},c)}}
    if(window.innerWidth<641)return;
    links.forEach(function(L,i){var a=nd(L[0]),b=nd(L[1]);if(!a||!b)return;var A=rc(a),B=rc(b);
      var right=B.cx>A.cx,x1=right?A.r:A.l,x2=right?B.l:B.r,dx=Math.max(40,Math.abs(x2-x1)*.45)*(right?1:-1);
      if(Math.abs(A.cx-B.cx)<60){x1=A.r;x2=B.r;dx=60}
      var d='M'+x1+' '+A.cy+' C '+(x1+dx)+' '+A.cy+', '+(x2-dx)+' '+B.cy+', '+x2+' '+B.cy;
      el('path',{d:d,class:'lnk','data-a':L[0],'data-b':L[1]},svg);
      var t=el('text',{x:(x1+x2)/2,y:(A.cy+B.cy)/2-6,'text-anchor':'middle','data-a':L[0],'data-b':L[1]},svg);t.textContent=L[2];});
  }
  function hl(id,on){svg.querySelectorAll('[data-a="'+id+'"],[data-b="'+id+'"]').forEach(function(p){p.classList.toggle('on',on);
    var o=nd(p.dataset.a===id?p.dataset.b:p.dataset.a);if(o)o.classList.toggle('hl',on)})}
  box.addEventListener('mouseover',function(e){var n=e.target.closest('[data-id]');if(n)hl(n.dataset.id,true)});
  box.addEventListener('mouseout',function(e){var n=e.target.closest('[data-id]');if(n)hl(n.dataset.id,false)});
  draw();var t=null;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(draw,120)});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(draw);
  new IntersectionObserver(function(e){if(e[0].isIntersecting)setTimeout(draw,950)}).observe(box);
});})();
})();
