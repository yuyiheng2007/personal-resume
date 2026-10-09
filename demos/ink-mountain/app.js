(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const ui = {loading:$('#loading'),status:$('#status'),hint:$('#hint'),toast:$('#toast'),camBox:$('#camBox'),video:$('#video'),handCanvas:$('#handCanvas')};
  const mobile = matchMedia('(max-width: 680px)').matches;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tiers = mobile ? [55000,95000,140000] : [95000,180000,300000];
  let tier = 1, mode = 'mouse', handCamera = null, handReady = false, gyroReady = false;
  let target = {yaw:0,pitch:-.05,zoom:50,lift:.65}, current = {...target};

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070806);
  scene.fog = new THREE.FogExp2(0x070806,.0115);
  const camera = new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,400);
  camera.position.set(0,19,50); camera.lookAt(0,1,-18);
  const renderer = new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
  renderer.domElement.className='webgl';
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.6));
  renderer.setSize(innerWidth,innerHeight);
  document.body.prepend(renderer.domElement);

  const vert = `
    uniform float uTime,uLift,uPixel;
    attribute float aKind,aFade,aSeed;
    varying float vKind,vFade,vHeight;
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;} vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);} float noise(vec2 v){const vec4 C=vec4(.2113248654,.3660254038,-.5773502692,.0243902439);vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=x0.x>x0.y?vec2(1.,0.):vec2(0.,1.);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;m*=1.792842914-.853734721*(a0*a0+h*h);vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}
    void main(){vec3 p=position;float size=1.;vKind=aKind;vFade=aFade;
      if(aKind<.5){float river=sin(p.z*.038)*22.+sin(p.z*.105+1.2)*7.+sin(p.z*.21)*2.5;float d=abs(p.x-river);p.x=river+(p.x-river)*.46;p.y=noise(vec2(p.z*.15-uTime*.18,aSeed))*1.05;size=2.25+2.2*(1.-min(d/9.,1.));}
      else if(aKind<1.5){float n1=abs(noise(vec2(p.x*.035,p.z*.045)));float n2=noise(vec2(p.x*.095+7.,p.z*.085));float river=sin(p.z*.038)*22.+sin(p.z*.105+1.2)*7.+sin(p.z*.21)*2.5;float valley=abs(p.x-river);float shoulder=smoothstep(9.,32.,valley);p.y=(6.+n1*28.+n2*7.)*shoulder*(.62+uLift*.78);p.y+=sin(p.x*.11+p.z*.04)*2.5*shoulder;size=1.55+p.y*.052;}
      else {p.x+=sin(uTime*.08+aSeed*20.)*2.;p.y+=sin(uTime*.11+aSeed*13.)*1.2;size=1.4;}
      vHeight=p.y;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=size*uPixel*(42./max(8.,-mv.z));
    }`;
  const frag = `
    uniform vec3 uInk,uMist,uWater,uPaper; varying float vKind,vFade,vHeight;
    void main(){vec2 q=gl_PointCoord-.5;float d=length(q);if(d>.5)discard;float a=(1.-smoothstep(.12,.5,d))*vFade;vec3 c;
      if(vKind<.5)c=mix(uWater,uPaper,.08+sin(vHeight*2.)*.06);else if(vKind<1.5)c=mix(uInk,uMist,.2+clamp(vHeight/32.,0.,1.)*.8);else c=uPaper;
      gl_FragColor=vec4(c,a*(vKind>1.5?.32:(vKind<.5?.92:.88)));
    }`;
  let points;
  const uniforms={uTime:{value:0},uLift:{value:.65},uPixel:{value:renderer.getPixelRatio()},uInk:{value:new THREE.Color('#59645d')},uMist:{value:new THREE.Color('#ddd8c9')},uWater:{value:new THREE.Color('#63c7f2')},uPaper:{value:new THREE.Color('#e8e1cf')}};
  const material=new THREE.ShaderMaterial({vertexShader:vert,fragmentShader:frag,uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});

  function makeLandscape(count){
    if(points){scene.remove(points);points.geometry.dispose();}
    const pos=new Float32Array((count+5000)*3),kind=new Float32Array(count+5000),fade=new Float32Array(count+5000),seed=new Float32Array(count+5000);
    for(let i=0;i<count;i++){const k=i%6===0?0:1;const z=(Math.random()-.5)*155;let x=(Math.random()-.5)*138;if(k===0){const river=Math.sin(z*.038)*22+Math.sin(z*.105+1.2)*7+Math.sin(z*.21)*2.5;x=river+(Math.random()-.5)*18;}pos[i*3]=x;pos[i*3+1]=0;pos[i*3+2]=z;kind[i]=k;fade[i]=k===0?.5+Math.random()*.5:.38+Math.random()*.62;seed[i]=Math.random();}
    for(let i=count;i<count+5000;i++){pos[i*3]=(Math.random()-.5)*130;pos[i*3+1]=8+Math.random()*36;pos[i*3+2]=(Math.random()-.5)*150;kind[i]=2;fade[i]=Math.random();seed[i]=Math.random();}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aKind',new THREE.BufferAttribute(kind,1));g.setAttribute('aFade',new THREE.BufferAttribute(fade,1));g.setAttribute('aSeed',new THREE.BufferAttribute(seed,1));
    points=new THREE.Points(g,material);scene.add(points);
  }
  makeLandscape(tiers[tier]);

  let dragging=false,lastX=0,lastY=0;
  const clock=new THREE.Clock();
  function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime(),ease=prefersReduced?.025:.055;
    current.yaw+=(target.yaw-current.yaw)*ease;current.pitch+=(target.pitch-current.pitch)*ease;current.zoom+=(target.zoom-current.zoom)*ease;current.lift+=(target.lift-current.lift)*ease;
    if(mode==='mouse'&&!dragging){target.yaw+=Math.sin(t*.11)*.00022;target.lift=.62+Math.sin(t*.24)*.08;}
    uniforms.uTime.value=t;uniforms.uLift.value=current.lift;points.rotation.y=current.yaw;points.rotation.x=current.pitch;camera.position.z=current.zoom;camera.position.y=18+(50-current.zoom)*.08;camera.lookAt(0,2,-18);renderer.render(scene,camera);
  } animate();

  renderer.domElement.addEventListener('pointerdown',e=>{if(mode!=='mouse')return;dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
  renderer.domElement.addEventListener('pointermove',e=>{if(mode!=='mouse')return;if(dragging){target.yaw+=(e.clientX-lastX)*.004;target.pitch=Math.max(-.25,Math.min(.16,target.pitch+(e.clientY-lastY)*.002));lastX=e.clientX;lastY=e.clientY}else{target.yaw=(e.clientX/innerWidth-.5)*.5;target.lift=.35+(1-e.clientY/innerHeight)*.75}});
  renderer.domElement.addEventListener('pointerup',()=>dragging=false);
  addEventListener('wheel',e=>{if(mode==='mouse')target.zoom=Math.max(24,Math.min(72,target.zoom+e.deltaY*.025))},{passive:true});

  const hints={mouse:'移动指针游览山河，滚轮推近远景，按住拖动可改变视角。',hand:'张合手掌改变山势，左右移动旋转画卷，靠近镜头推入山河。',gyro:'转动手机改变视角，前后倾斜穿行山水；触摸画面可辅助缩放。'};
  function toast(msg){ui.toast.textContent=msg;ui.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>ui.toast.classList.remove('show'),2600)}
  async function setMode(next){
    if(next==='hand'&&!(await enableHands()))return;
    if(next==='gyro'&&!(await enableGyro()))return;
    mode=next;document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));ui.hint.textContent=hints[mode];ui.status.textContent={mouse:'鼠标模式',hand:'手势识别中',gyro:'陀螺仪模式'}[mode];ui.camBox.classList.toggle('show',mode==='hand');
    if(mode!=='hand'&&ui.video.srcObject)ui.video.srcObject.getTracks().forEach(t=>t.enabled=false);else if(mode==='hand'&&ui.video.srcObject)ui.video.srcObject.getTracks().forEach(t=>t.enabled=true);
  }
  document.querySelectorAll('.mode').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));

  async function enableHands(){
    if(handReady){ui.video.srcObject?.getTracks().forEach(t=>t.enabled=true);return true}
    if(!navigator.mediaDevices?.getUserMedia){toast('当前浏览器不支持摄像头识别');return false}
    try{
      ui.status.textContent='等待摄像头授权';
      const hands=new Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`});hands.setOptions({maxNumHands:1,modelComplexity:0,minDetectionConfidence:.55,minTrackingConfidence:.5});
      const ctx=ui.handCanvas.getContext('2d');
      hands.onResults(r=>{ctx.clearRect(0,0,ui.handCanvas.width,ui.handCanvas.height);const lm=r.multiHandLandmarks?.[0];if(!lm){ui.status.textContent='请将手掌置于画面';return}ui.status.textContent='手势控制中';drawConnectors(ctx,lm,HAND_CONNECTIONS,{color:'rgba(224,219,200,.55)',lineWidth:1});drawLandmarks(ctx,lm,{color:'#a13a2a',radius:1.5});const wrist=lm[0],mid=lm[9],tip=lm[12];const open=Math.hypot(wrist.x-tip.x,wrist.y-tip.y),palm=Math.hypot(wrist.x-mid.x,wrist.y-mid.y);target.lift=Math.max(.2,Math.min(1.25,(open-.12)*3.7));target.yaw=(.5-mid.x)*1.7;target.zoom=Math.max(25,Math.min(68,68-(palm-.04)*230));});
      const stream=await navigator.mediaDevices.getUserMedia({video:{width:320,height:240,facingMode:'user'},audio:false});ui.video.srcObject=stream;await ui.video.play();ui.handCanvas.width=320;ui.handCanvas.height=240;
      handCamera=new Camera(ui.video,{onFrame:async()=>{if(mode==='hand')await hands.send({image:ui.video})},width:320,height:240});await handCamera.start();handReady=true;return true;
    }catch(err){console.warn(err);toast('未取得摄像头权限，仍可使用鼠标模式');ui.status.textContent='鼠标模式';return false}
  }
  async function enableGyro(){
    if(!('DeviceOrientationEvent'in window)){toast('当前设备不支持陀螺仪');return false}
    try{if(typeof DeviceOrientationEvent.requestPermission==='function'){const p=await DeviceOrientationEvent.requestPermission();if(p!=='granted')throw new Error('denied')}
      if(!gyroReady){addEventListener('deviceorientation',e=>{if(mode!=='gyro'||e.gamma==null)return;target.yaw=Math.max(-.9,Math.min(.9,e.gamma/45));target.pitch=Math.max(-.2,Math.min(.15,(e.beta-45)/160));target.zoom=Math.max(31,Math.min(62,47+(e.beta-45)*.22));});gyroReady=true}return true;
    }catch(err){toast('未取得动作与方向传感器权限');return false}
  }

  $('#quality').addEventListener('click',e=>{tier=(tier+1)%3;makeLandscape(tiers[tier]);e.currentTarget.textContent=`画质：${['流畅','均衡','精细'][tier]}`;toast(`已切换为${['流畅','均衡','精细'][tier]}画质`)});
  $('#reset').addEventListener('click',()=>{target={yaw:0,pitch:-.05,zoom:50,lift:.65};toast('山河已归于初境')});
  $('#fullscreen').addEventListener('click',async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(e){toast('当前浏览器不支持全屏')}});
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.6));renderer.setSize(innerWidth,innerHeight);uniforms.uPixel.value=renderer.getPixelRatio()});
  setTimeout(()=>ui.loading.classList.add('done'),900);
})();
