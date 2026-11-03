/* Downtown Studio · ouverture en image nette
   Accueil : les photos du lieu en fondu enchaîné, avec un lent travelling, sous la phrase.
   Pages intérieures : une bande d'image nette sous le titre.
   La page déclare toujours : <canvas id="gl" data-src="img/…jpg" data-mode="home|inner" [data-set="img/a.jpg,img/b.jpg"]> */
(function(){
"use strict";
var cv=document.getElementById('gl');if(!cv)return;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var HOME=cv.dataset.mode==='home',src=cv.dataset.src,set=(cv.dataset.set||'').split(',').filter(Boolean);
cv.remove();
function img(u,alt){var i=new Image();i.src=u;i.alt=alt||'';i.decoding='async';return i}
if(HOME){
  var host=document.querySelector('.hero');if(!host)return;
  var box=document.createElement('div');box.className='hero-media';box.setAttribute('aria-hidden','true');
  var list=[src].concat(set.filter(function(u){return u!==src})),ims=list.map(function(u){return img(u)});
  ims.forEach(function(i){box.appendChild(i)});host.insertBefore(box,host.firstChild);
  var k=0;ims[0].classList.add('on');
  if(!reduce&&ims.length>1)setInterval(function(){
    var a=ims[k];k=(k+1)%ims.length;var b=ims[k];
    b.classList.remove('on');void b.offsetWidth;b.classList.add('on');
    setTimeout(function(){a.classList.remove('on')},1800);
  },7000);
}else{
  var ph=document.querySelector('.page-hero .max');if(!ph||!src)return;
  var band=document.createElement('div');band.className='page-media';band.setAttribute('aria-hidden','true');
  band.appendChild(img(src));ph.appendChild(band);
}
})();
