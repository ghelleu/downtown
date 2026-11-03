/* Downtown Studio · fond three.js
   Même scène que le site Progress (photo → nuage de points → relief),
   avec la photo de l'auditorium Atmos et la teinte d'accent Downtown.
   La page déclare : <canvas id="gl" data-src="img/atmos-1.jpg" data-mode="home|inner"> */
(function(){
"use strict";
var canvas=document.getElementById('gl');if(!canvas)return;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var SRC=canvas.dataset.src,INNER=canvas.dataset.mode==='inner';
var hdr=document.querySelector('header.top');
function setHud(id,v){var e=document.getElementById(id);if(e)e.textContent=v}
function fallback(){var d=document.createElement('div');d.id='glFallback';d.style.backgroundImage='url('+SRC+')';document.body.insertBefore(d,canvas);canvas.remove()}
function solidHeader(){if(hdr)hdr.classList.toggle('solid',window.scrollY>40||INNER)}
var hasGL=false;try{hasGL=!!(window.THREE&&(canvas.getContext('webgl2')||canvas.getContext('webgl')))}catch(e){}
if(!hasGL){fallback();window.addEventListener('scroll',solidHeader,{passive:true});solidHeader();return}

var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
var DPR=Math.min(window.devicePixelRatio||1,2);
renderer.setPixelRatio(DPR);renderer.setClearColor(0x000000,1);
var cam=new THREE.PerspectiveCamera(45,1,0.01,100);
var sc=new THREE.Scene(),root=new THREE.Group();sc.add(root);
var lines,lineMat,ptMat,aspImg=1.5,camDist=3,gridRows=200,ready=false,t0=0,mix=0,vec=0;
var img=new Image();img.onload=function(){try{build(img)}catch(e){fallback()}};img.onerror=fallback;img.src=SRC;

function build(im){
  var small=window.innerWidth<700,cols=small?190:300;
  aspImg=im.naturalWidth/im.naturalHeight;
  var rows=Math.round(cols/aspImg);gridRows=rows;
  setHud('hudGrid',cols+' × '+rows);setHud('hudPts',(cols*rows).toLocaleString('fr-CH'));
  var cv=document.createElement('canvas');cv.width=cols;cv.height=rows;
  var cx=cv.getContext('2d');cx.drawImage(im,0,0,cols,rows);
  var data=cx.getImageData(0,0,cols,rows).data;
  var N=cols*rows,H=2,W=H*aspImg;
  var pos=new Float32Array(N*3),cloud=new Float32Array(N*3),col=new Float32Array(N*3),rnd=new Float32Array(N),luma=new Float32Array(N);
  for(var y=0;y<rows;y++)for(var x=0;x<cols;x++){
    var i=y*cols+x,k=i*4,r=data[k]/255,g=data[k+1]/255,b=data[k+2]/255;
    var L=0.2126*r+0.7152*g+0.0722*b;luma[i]=L;
    var px=(x/(cols-1)-.5)*W,py=-(y/(rows-1)-.5)*H;
    pos[i*3]=px;pos[i*3+1]=py;pos[i*3+2]=0;
    var rr=Math.random();rnd[i]=rr;
    cloud[i*3]=px*(1+(rr-.5)*0.04);cloud[i*3+1]=py;cloud[i*3+2]=(L-.35)*1.5+(rr-.5)*0.18;
    col[i*3]=r;col[i*3+1]=g;col[i*3+2]=b;
  }
  var geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('aCloud',new THREE.BufferAttribute(cloud,3));
  geo.setAttribute('aCol',new THREE.BufferAttribute(col,3));
  geo.setAttribute('aRnd',new THREE.BufferAttribute(rnd,1));
  ptMat=new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uMix:{value:0},uVec:{value:0},uTime:{value:0},uBase:{value:2},uDist:{value:3}},
    vertexShader:[
      'attribute vec3 aCloud;attribute vec3 aCol;attribute float aRnd;',
      'uniform float uMix,uVec,uTime,uBase,uDist;varying vec3 vCol;varying float vA;',
      'void main(){',
      ' float m=smoothstep(0.0,1.0,clamp(uMix*1.3-aRnd*0.3,0.0,1.0));',
      ' vec3 p=mix(position,aCloud,m);',
      ' p+=m*vec3(sin(uTime*0.6+aRnd*40.0),cos(uTime*0.5+aRnd*31.0),sin(uTime*0.4+aRnd*17.0))*0.012*(1.0+uVec*2.0);',
      ' p.z+=uVec*(aRnd-0.5)*0.6;',
      ' vec4 mv=modelViewMatrix*vec4(p,1.0);',
      ' gl_PointSize=uBase*mix(1.0,0.55,m)*(uDist/-mv.z);',
      ' gl_Position=projectionMatrix*mv;',
      ' float l=dot(aCol,vec3(0.2126,0.7152,0.0722));',
      /* Teinte Downtown : du brun profond au rouge tally, puis au blanc chaud */
      ' vec3 deep=vec3(0.30,0.03,0.01),acc=vec3(1.0,0.23,0.12),hi=vec3(1.0,0.92,0.86);',
      ' vec3 g=mix(mix(deep,acc,smoothstep(0.0,0.5,l)),hi,smoothstep(0.5,1.0,l));',
      ' vCol=g*mix(0.3+0.85*l,0.35+1.05*pow(l,0.8),m);',
      ' vA=mix(1.0,0.9,m)*(1.0-uVec*0.78);',
      '}'].join('\n'),
    fragmentShader:[
      'varying vec3 vCol;varying float vA;uniform float uMix;',
      'void main(){vec2 c=gl_PointCoord-0.5;float d=length(c);',
      ' float a=mix(1.0-step(0.5,max(abs(c.x),abs(c.y))),1.0-smoothstep(0.3,0.5,d),clamp(uMix*2.0,0.0,1.0));',
      ' gl_FragColor=vec4(vCol*mix(0.6,1.0,uMix),a*vA);}'].join('\n')
  });
  root.add(new THREE.Points(geo,ptMat));
  var gx=small?70:110,gy=Math.round(gx/aspImg),seg=[],segCol=[];
  function hAt(u,v){var xi=Math.min(cols-1,Math.round(u*(cols-1))),yi=Math.min(rows-1,Math.round(v*(rows-1)));return (luma[yi*cols+xi]-.35)*1.5}
  function P(u,v){return [(u-.5)*W,-(v-.5)*H,hAt(u,v)]}
  var cA=new THREE.Color('#8E1A08'),cB=new THREE.Color('#ffffff');
  function push(a,b,t){seg.push(a[0],a[1],a[2],b[0],b[1],b[2]);var c=cA.clone().lerp(cB,t);segCol.push(c.r,c.g,c.b,c.r,c.g,c.b)}
  for(var j=0;j<=gy;j++)for(var ii=0;ii<gx;ii++){var a=P(ii/gx,j/gy),bb=P((ii+1)/gx,j/gy);push(a,bb,Math.min(1,Math.max(0,a[2]+.5)))}
  for(var i2=0;i2<=gx;i2+=2)for(var j2=0;j2<gy;j2++){var a2=P(i2/gx,j2/gy),b2=P(i2/gx,(j2+1)/gy);push(a2,b2,Math.min(1,Math.max(0,a2[2]+.5)))}
  var lg=new THREE.BufferGeometry();
  lg.setAttribute('position',new THREE.Float32BufferAttribute(seg,3));
  lg.setAttribute('color',new THREE.Float32BufferAttribute(segCol,3));
  lineMat=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
  lines=new THREE.LineSegments(lg,lineMat);root.add(lines);
  ready=true;resize();t0=performance.now();
}
function resize(){
  var w=window.innerWidth,h=window.innerHeight;
  renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
  var visH=Math.min(2,2*aspImg/(w/h));
  camDist=visH/(2*Math.tan(THREE.MathUtils.degToRad(22.5)));
  if(ptMat){ptMat.uniforms.uBase.value=Math.max(1.5,(2/(gridRows-1))*(h/visH)*1.2)*DPR;ptMat.uniforms.uDist.value=camDist}
}
window.addEventListener('resize',resize);

var rotX=0,rotY=0,tX=0,tY=0,drag=null,mxp=0,myp=0;
function interactive(t){return t.closest&&t.closest('a,button,input,select,textarea,label,summary,form,.panel,.nodes,.doors,.reel,.rooms,.res,.house')}
window.addEventListener('pointerdown',function(e){if(interactive(e.target))return;drag={x:e.clientX,y:e.clientY,rx:tY,ry:tX}});
window.addEventListener('pointermove',function(e){
  mxp=e.clientX/window.innerWidth-.5;myp=e.clientY/window.innerHeight-.5;
  if(!drag)return;var dx=(e.clientX-drag.x)/window.innerWidth,dy=(e.clientY-drag.y)/window.innerHeight;
  tY=drag.rx+dx*3.2;tX=Math.max(-1.1,Math.min(1.1,drag.ry+dy*2.0));
});
window.addEventListener('pointerup',function(){drag=null});
window.addEventListener('pointercancel',function(){drag=null});

var veil=document.getElementById('veil'),lastState='',start=performance.now();
function frame(now){
  requestAnimationFrame(frame);
  if(!ready)return;
  var t=(now-start)/1000,since=(now-t0)/1000,vh=window.innerHeight,sy=window.scrollY;
  var autoMix=reduce?1:Math.min(1,Math.max(0,(since-1.4)/2.6));
  var mixT=INNER?1:Math.max(autoMix,Math.min(1,sy/(vh*0.5)));
  var vecT=INNER?1:Math.min(1,Math.max(0,(sy-vh*0.55)/(vh*0.9)));
  mix+=(mixT-mix)*0.06;vec+=(vecT-vec)*0.06;
  ptMat.uniforms.uMix.value=mix;ptMat.uniforms.uVec.value=vec;ptMat.uniforms.uTime.value=t;
  lineMat.opacity=vec*(INNER?0.5:0.8);
  var st=vec>.5?'relief':(mix>.5?'nuage de points':'image');if(st!==lastState){setHud('hudState',st);lastState=st}
  if(!drag&&!reduce){tY+=(0-tY)*0.004+Math.sin(t*0.15)*0.0006*mix}
  rotX+=(tX+myp*0.12*mix-rotX)*0.07;rotY+=(tY+mxp*0.2*mix+vec*0.55-rotY)*0.07;
  root.rotation.x=rotX+vec*-0.55;root.rotation.y=rotY;
  cam.position.set(0,-vec*0.25,camDist*(1+mix*0.08-vec*0.12));cam.lookAt(0,0,0);
  var deep=INNER?0.82:Math.min(0.74,Math.max(0,(sy-vh*0.8)/(vh*0.7))*0.74);
  if(veil)veil.style.opacity=deep.toFixed(3);
  solidHeader();
  renderer.render(sc,cam);
}
requestAnimationFrame(frame);
})();
