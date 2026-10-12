(function () {
  const vertexShader = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
  const fragmentShader = `
  precision highp float;varying vec2 v;uniform vec2 r,m;uniform float t,pulse;
  float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1)),f.x),f.y);}
  float star(vec2 u,float z){vec2 g=fract(u*z)-.5;float q=h(floor(u*z));float c=smoothstep(.045,0.,length(g))*step(.966,q);c+=(smoothstep(.011,0.,abs(g.x))*smoothstep(.16,0.,abs(g.y))+smoothstep(.011,0.,abs(g.y))*smoothstep(.16,0.,abs(g.x)))*step(.993,q)*.18;return c*(.6+.4*sin(t*(.3+q)+q*40.));}
  void main(){
    vec2 u=v-.5;u.x*=r.x/r.y;vec2 c=vec2(-.115,.015)+m*vec2(.11,.07),x=u-c;float d=length(x),a=atan(x.y,x.x);
    float bend=.058/max(.027,d-.068);vec2 L=x*(1.+bend*smoothstep(.72,.075,d));L+=vec2(sin(a*3.+t*.07),cos(a*2.-t*.05))*.007;
    float sf=star(L+7.3,34.)+star(L*1.7-3.1,61.)*.55;vec3 col=vec3(.68,.72,.78)*sf*.5;
    float cloud=pow(max(0.,n(L*4.+vec2(t*.006,0.))-.43),2.)*exp(-pow((L.y+.06*sin(L.x*5.))*3.7,2.));
    col+=mix(vec3(.03,.038,.05),vec3(.085,.06,.03),n(L*2.3))*cloud*1.8;
    float ca=cos(-.10),sa=sin(-.10);vec2 q=mat2(ca,-sa,sa,ca)*x;vec2 e=vec2(q.x,q.y/.245);float R=length(e),A=atan(e.y,e.x);
    float inside=smoothstep(.105,.15,R),outside=1.-smoothstep(.82,1.03,R),heat=exp(-max(0.,R-.13)*3.7);
    float flow=A-t*.23-1.65*log(max(R,.105));float ink=pow(.5+.5*sin(flow*9.+R*112.),18.)*.75+pow(.5+.5*sin(flow*25.-R*245.),34.)*.48;
    ink+=smoothstep(.32,.82,n(vec2(flow*1.7,R*39.)))*.2;float disk=ink*inside*outside;
    float front=smoothstep(-.02,.10,e.y),hor=.115,occ=smoothstep(hor*.98,hor*1.08,d);disk*=mix(.38,1.,front)*mix(occ,1.,1.-front);
    vec3 gold=mix(vec3(.68,.31,.08),vec3(1.,.95,.76),pow(heat,2.05));col+=gold*disk*(1.9+heat*4.25);
    float smoothRing=exp(-abs(R-.15)*28.)*inside*outside;col+=vec3(1.,.76,.35)*smoothRing*(.36+heat*.94);
    float lens=exp(-abs(d-.15)*88.)*smoothstep(.018,.23,abs(x.y));col+=vec3(1.,.88,.65)*lens*(.42+.82*pow(.5+.5*sin(a*22.-t*.27),9.));
    float photon=exp(-abs(d-hor)*190.);col+=vec3(1.,.91,.72)*photon*(1.85+pulse*1.9);
    float core=1.-smoothstep(hor*.91,hor*1.03,d);col*=1.-core;col+=vec3(.011,.008,.005)*core*smoothstep(0.,hor,d);
    col+=vec3(.52,.22,.12)*(exp(-d*7.5)*.105+exp(-abs(R-.31)*9.)*.04);col*=1.+pulse*exp(-d*4.)*.65;col=col/(1.+col);col=pow(col,vec3(.78));
    gl_FragColor=vec4(col,clamp(smoothstep(.9,.16,d)+sf*.45+cloud,0.,1.));
  }`;

  const formulas=["E = mc²","Rμν − ½Rgμν = 8πGTμν","F = Gm₁m₂ / r²","Δt = γΔt₀","ψ(r,t)","ds²","∫ Tμν dV","c²Δτ²","∇²Φ = 4πGρ","p = γmv"];
  const shader=(gl,type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const program=(gl)=>{const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,vertexShader));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,fragmentShader));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;};

  function initGravityHero(){
    const shell=document.getElementById("spatialShell"),scene=document.getElementById("spatialScene"),canvas=document.getElementById("spatialCanvas");if(!shell||!scene||!canvas)return;
    scene.classList.add("gravity-hero-scene");
    const originalFrame=scene.querySelector(".gravity-journey-frame");
    if(originalFrame){
      scene.classList.add("gravity-source-scene");
      const relayScroll=()=>{
        try{
          const child=originalFrame.contentWindow,doc=child.document,section=scene.closest(".spatial-cover");
          if(!child||!doc||!section)return;
          const gate=document.getElementById("resumeGate");
          let frameInView=false;
          const syncSceneVisibility=()=>{
            child.__yyhResumeSceneActive=frameInView&&!document.hidden&&(!gate||gate.hidden);
            doc.dispatchEvent(new child.Event("visibilitychange"));
          };
          const sceneObserver=new IntersectionObserver(([entry])=>{
            frameInView=entry.isIntersecting&&entry.intersectionRatio>=.12;
            syncSceneVisibility();
          },{threshold:[0,.12]});
          sceneObserver.observe(section);
          document.addEventListener("visibilitychange",syncSceneVisibility);
          if(gate)new MutationObserver(syncSceneVisibility).observe(gate,{attributes:true,attributeFilter:["hidden"]});
          syncSceneVisibility();
          const disableDrag=()=>{
            const dragHandle=doc.querySelector("[data-gravity-drag-handle]");
            if(!dragHandle)return false;
            dragHandle.style.pointerEvents="none";dragHandle.style.cursor="default";dragHandle.tabIndex=-1;dragHandle.setAttribute("aria-label","黑洞不可拖动");
            return true;
          };
          if(!disableDrag()){
            const observer=new MutationObserver(()=>{if(disableDrag())observer.disconnect();});
            observer.observe(doc.documentElement,{childList:true,subtree:true});
          }
          doc.addEventListener("pointerdown",event=>{
            if(event.target.closest?.("[data-gravity-drag-handle]")){event.preventDefault();event.stopImmediatePropagation();}
          },true);
          doc.addEventListener("keydown",event=>{
            if(event.target.closest?.("[data-gravity-drag-handle]")&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();}
          },true);
          let wheelDelta=0,wheelFrame=0;
          doc.addEventListener("wheel",event=>{
            event.preventDefault();
            wheelDelta+=event.deltaY;
            if(wheelFrame)return;
            wheelFrame=requestAnimationFrame(()=>{
              window.scrollBy({top:wheelDelta,behavior:"auto"});
              wheelDelta=0;
              wheelFrame=0;
            });
          },{passive:false});
        }catch(error){console.warn("Gravity Journey scroll relay unavailable",error);}
      };
      originalFrame.addEventListener("load",relayScroll,{once:true});
      if(originalFrame.contentDocument?.readyState==="complete")relayScroll();
      return;
    }
    scene.classList.add("gravity-webgl-scene");const gl=canvas.getContext("webgl",{alpha:true,antialias:false,powerPreference:"high-performance"});if(!gl)return;
    const inkCanvas=document.createElement("canvas");inkCanvas.className="gravity-formula-layer";inkCanvas.setAttribute("aria-hidden","true");scene.appendChild(inkCanvas);const ink=inkCanvas.getContext("2d");
    const prg=program(gl),buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);gl.useProgram(prg);
    const loc=gl.getAttribLocation(prg,"p");gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const U={r:gl.getUniformLocation(prg,"r"),m:gl.getUniformLocation(prg,"m"),t:gl.getUniformLocation(prg,"t"),pulse:gl.getUniformLocation(prg,"pulse")};
    const ribbons=Array.from({length:17},(_,i)=>({phase:i/17*Math.PI*2,dir:i%2?1:-1,bold:i<5?1:.72}));const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w=1,h=1,dpr=1,raf=0,px=0,py=0,tx=0,ty=0,drag=false,pulse=0,pulseTo=0;
    function resize(){const b=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,1.5,Math.sqrt(950000/Math.max(1,b.width*b.height)));w=Math.max(1,b.width);h=Math.max(1,b.height);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);inkCanvas.width=canvas.width;inkCanvas.height=canvas.height;inkCanvas.style.width=w+"px";inkCanvas.style.height=h+"px";gl.viewport(0,0,canvas.width,canvas.height);}
    function equations(time,cx,cy,scale){ink.setTransform(dpr,0,0,dpr,0,0);ink.clearRect(0,0,w,h);ink.globalCompositeOperation="lighter";ribbons.forEach((rb,k)=>{const pts=[];for(let i=0;i<=110;i++){const s=i/110,outer=1-s,side=k%2?1:-1,base=rb.phase+s*(2.75+k*.045)*rb.dir+time*.035,spread=outer*scale*(.28+(.72*Math.abs(Math.sin(rb.phase*.55+k*.09)))),A=base+side*outer*.95,R=scale*(.12+outer*(.42+k*.028));let px=cx+Math.cos(A)*R+side*spread*.92,py=cy+Math.sin(A)*R*(.31+k*.007)-outer*scale*.31;py+=Math.sin(base*1.7+time*.12)*outer*scale*.06;pts.push({x:px,y:py,a:A,s});}
      ink.beginPath();pts.forEach((o,i)=>i?ink.lineTo(o.x,o.y):ink.moveTo(o.x,o.y));ink.strokeStyle=`rgba(236,195,112,${.042+rb.bold*.058})`;ink.lineWidth=.8+rb.bold*.7;ink.stroke();
      const step=k<5?3:5;for(let i=3;i<pts.length-3;i+=step){const o=pts[i],n=pts[i+1],dist=Math.hypot(o.x-cx,o.y-cy),fade=Math.min(1,dist/(scale*.18))*(1-o.s*.26);ink.save();ink.translate(o.x,o.y);ink.rotate(Math.atan2(n.y-o.y,n.x-o.x));ink.font=`600 ${Math.max(8,scale*(.014+rb.bold*.005))}px ui-monospace,Consolas,monospace`;ink.fillStyle=`rgba(${k<4?"255,228,173":"215,170,92"},${(.21+rb.bold*.31)*fade})`;ink.fillText(formulas[(i+k*3)%formulas.length],0,0);ink.restore();}});ink.globalCompositeOperation="source-over";}
    function render(now){raf=0;const time=now*.001;px+=(tx-px)*(drag?.16:.045);py+=(ty-py)*(drag?.16:.045);pulse+=(pulseTo-pulse)*.08;pulseTo*=.94;gl.useProgram(prg);gl.uniform2f(U.r,canvas.width,canvas.height);gl.uniform2f(U.m,px,py);gl.uniform1f(U.t,time);gl.uniform1f(U.pulse,pulse);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.TRIANGLES,0,6);equations(time,w*(.5+px*.055),h*(.5-py*.035),Math.min(w,h)*.92);if(!reduced&&!document.hidden)raf=requestAnimationFrame(render);}
    function point(e){const b=shell.getBoundingClientRect();tx=Math.max(-.7,Math.min(.7,((e.clientX-b.left)/b.width-.5)*1.25));ty=Math.max(-.7,Math.min(.7,(.5-(e.clientY-b.top)/b.height)*1.25));scene.style.setProperty("--ry",tx*3.2+"deg");scene.style.setProperty("--rx",ty*-2.2+"deg");}
    canvas.addEventListener("pointerdown",e=>{drag=true;pulseTo=1;canvas.setPointerCapture(e.pointerId);point(e);});canvas.addEventListener("pointermove",point,{passive:true});canvas.addEventListener("pointerup",e=>{drag=false;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);});canvas.addEventListener("pointerleave",()=>{if(!drag){tx=0;ty=0;}});canvas.addEventListener("dblclick",()=>pulseTo=1.6);
    resize();new ResizeObserver(resize).observe(canvas);render(0);document.addEventListener("visibilitychange",()=>{if(!document.hidden&&!reduced&&!raf)raf=requestAnimationFrame(render);});
  }
  window.initGravityHero=initGravityHero;
})();
