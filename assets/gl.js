/* Downtown Studio · mosaïque de pixels
   Charte Base Design : l'image se construit par blocs, la trame s'affine,
   des aplats noirs, blancs et de couleur s'assemblent puis se déplacent.
   La page déclare toujours : <canvas id="gl" data-src="img/…jpg" data-mode="home|inner"> */
(function(){
"use strict";
var cv=document.getElementById('gl');if(!cv)return;
var host=document.querySelector('.hero')||document.querySelector('.page-hero');
if(!host){cv.remove();return}
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var HOME=cv.dataset.mode==='home';
var wrap=document.createElement('div');wrap.className='mosaic';wrap.setAttribute('aria-hidden','true');
cv.classList.add('px');wrap.appendChild(cv);
if(HOME){host.insertBefore(wrap,host.firstChild)}else{(host.querySelector('.max')||host).appendChild(wrap)}
var PAL=['#000000','#FFFFFF','#E6483A','#BFC9D6','#005F7B','#905F38'];
var ctx=cv.getContext('2d'),img=new Image(),W,H,C,cols,rows,cells=[],lv=[],src=[],t0=0,mouse={x:-1e4,y:-1e4};
function rnd(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function pick(i,t){
  // État d'une case : 0 image, 1 noir, 2 blanc, 3+ couleur.
  // Les aplats viennent par blocs rectangulaires (3 × 2 cases), qui changent chacun à son rythme.
  var x=i%cols,y=(i/cols)|0,bx=(x/3)|0,by=(y/2)|0,b=bx*31+by*17;
  var ph=Math.floor(t/(2.5+rnd(b)*3)+rnd(b+5)*9),m=rnd(b*7+ph*131),r=rnd(i*13+ph*977);
  if(m<.10)return r<.82?1:0;
  if(m>.93)return r<.85?2:0;
  if(r<.035)return 1;
  if(r<.055)return 2;
  if(r<.063)return 3+((r*10000)|0)%4;
  return 0;
}
function prep(){
  var r=wrap.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);
  W=Math.max(1,Math.round(r.width));H=Math.max(1,Math.round(r.height));
  cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);ctx.imageSmoothingEnabled=false;
  C=W<700?20:(HOME?32:24);cols=Math.ceil(W/C);rows=Math.ceil(H/C);
  // Trois trames de la même photo (fine, moyenne, grossière), cadrées en « cover »
  var ar=img.naturalWidth/img.naturalHeight,sw,sh,sx,sy;
  if(W/H>ar){sw=img.naturalWidth;sh=sw*H/W;sx=0;sy=(img.naturalHeight-sh)/2}else{sh=img.naturalHeight;sw=sh*W/H;sy=0;sx=(img.naturalWidth-sw)/2}
  src=[4,1,.25].map(function(k){var c=document.createElement('canvas');c.width=Math.max(1,Math.round(cols*k));c.height=Math.max(1,Math.round(rows*k));
    var g=c.getContext('2d');g.imageSmoothingEnabled=true;g.drawImage(img,sx,sy,sw,sh,0,0,c.width,c.height);return c});
  cells=new Array(cols*rows);lv=new Array(cols*rows);
  for(var i=0;i<cells.length;i++){cells[i]=pick(i,0);lv[i]=2}
}
function draw(){
  ctx.fillStyle=getComputedStyle(wrap).backgroundColor||'#fff';ctx.fillRect(0,0,W,H);
  for(var i=0;i<cells.length;i++){
    var x=(i%cols)*C,y=((i/cols)|0)*C,s=cells[i];
    if(s===0){var k=[4,1,.25][lv[i]],c=src[lv[i]],cx=(i%cols)*k,cy=((i/cols)|0)*k;
      if(k>=1)ctx.drawImage(c,cx,cy,k,k,x,y,C,C);
      else{var bx=Math.floor((i%cols)/4)*4,by=Math.floor(((i/cols)|0)/4)*4;ctx.drawImage(c,Math.floor(bx*k),Math.floor(by*k),1,1,bx*C,by*C,C*4,C*4)}
    }
  }
  for(i=0;i<cells.length;i++){s=cells[i];if(s){x=(i%cols)*C;y=((i/cols)|0)*C;ctx.fillStyle=PAL[s-1];ctx.fillRect(x,y,C,C)}}
}
function tick(now){
  if(!t0)t0=now;var t=(now-t0)/1000;
  // La trame s'affine au chargement (grossière -> moyenne -> fine), puis respire case par case
  for(var i=0;i<cells.length;i++){
    var target=t<.6?2:t<1.3?1:0;
    var dx=(i%cols)*C+C/2-mouse.x,dy=((i/cols)|0)*C+C/2-mouse.y,near=dx*dx+dy*dy<(C*4.5)*(C*4.5);
    if(near)target=2;else if(t>1.3&&rnd(i+((t*.7)|0)*131)<.03)target=1;
    lv[i]=target;
  }
  if(t>1.3){for(var j=0;j<cells.length;j++)cells[j]=pick(j,t)}
  draw();
}
var last=0,raf=0,vis=true;
function loop(now){raf=requestAnimationFrame(loop);if(!vis||now-last<110)return;last=now;tick(now)}
img.onload=function(){prep();if(reduce){for(var i=0;i<lv.length;i++)lv[i]=0;draw();return}raf=requestAnimationFrame(loop)};
img.onerror=function(){wrap.remove()};
img.src=cv.dataset.src;
wrap.addEventListener('pointermove',function(e){var r=wrap.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});
wrap.addEventListener('pointerleave',function(){mouse.x=mouse.y=-1e4});
if('IntersectionObserver'in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(wrap);
var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(img.complete&&img.naturalWidth){prep();draw()}},150)});
})();
