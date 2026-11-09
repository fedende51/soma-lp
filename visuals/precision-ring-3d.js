import * as THREE from 'three';
import {createMetalData} from './ring-metal-data.js';
import {decodeLighting} from './ring-lighting-data.js';

const TAU=Math.PI*2;
const clamp=THREE.MathUtils.clamp;
const presets={
 satin:{roughness:.34,anisotropy:.62,metalness:.92,color:0xe1e3e5,edge:0x7c8a92,edgeRoughness:.28,exposure:1.22,envRotation:1.1,cyan:.55},
};

function notch(angle){
 const period=TAU/6,delta=Math.abs(((angle+period/2)%period+period)%period-period/2);
 const t=clamp((.074-delta)/.025,0,1);
 return .15*t*t*(3-2*t);
}

// Broad arcs need few vertices at the displayed size. Concentrate the extra
// samples at the six notch transitions, where the silhouette changes quickly.
function outerAngles(){
 const angles=Array.from({length:192},(_,i)=>i/192*TAU);
 for(let n=0;n<6;n++)for(const side of [-1,1])for(let j=0;j<=6;j++){
  const a=n*TAU/6+side*(.049+.025*j/6);angles.push((a+TAU)%TAU);
 }
 angles.sort((a,b)=>a-b);
 const unique=angles.filter((a,i)=>!i||a-angles[i-1]>1e-8);unique.push(TAU);return unique;
}

async function preparedResources(workerUrl,environmentUrl,environmentBlob){
 const blob=environmentBlob||await fetch(environmentUrl).then(response=>{if(!response.ok)throw new Error('Lighting unavailable');return response.blob();});
 let data;
 try{
  data=await new Promise((resolve,reject)=>{
   const worker=new Worker(workerUrl),timer=setTimeout(()=>{worker.terminate();reject(new Error('Texture worker timed out'));},30000);
   const done=()=>{clearTimeout(timer);worker.terminate();};
   worker.onmessage=event=>{done();event.data.error?reject(new Error('Worker decoding unavailable')):resolve(event.data);};worker.onerror=()=>{done();reject(new Error('Texture worker unavailable'));};worker.postMessage(blob);
  });
 }catch{
  const loading=decodeLighting(blob),maps=createMetalData();data={maps,environment:await loading};
 }
 const texture=pixels=>{
  const t=new THREE.DataTexture(pixels,1024,1024);t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.anisotropy=8;return t;
 };
 const hdr=new THREE.DataTexture(data.environment.data,data.environment.width,data.environment.height,THREE.RGBAFormat,THREE.HalfFloatType);
 hdr.colorSpace=THREE.LinearSRGBColorSpace;hdr.flipY=true;hdr.minFilter=hdr.magFilter=THREE.LinearFilter;hdr.generateMipmaps=false;hdr.needsUpdate=true;
 return {hdr,maps:Object.fromEntries(Object.entries(data.maps).map(([name,pixels])=>[name,texture(pixels)]))};
}

function model(p,maps){
 const group=new THREE.Group(),angles=outerAngles();
 const face=new THREE.MeshPhysicalMaterial({color:p.color,metalness:p.metalness,roughness:p.roughness,anisotropy:p.anisotropy,anisotropyMap:maps.direction,bumpMap:maps.bump,bumpScale:.0012,roughnessMap:maps.roughness,envMapIntensity:1});
 const edge=new THREE.MeshPhysicalMaterial({color:p.edge,metalness:1,roughness:p.edgeRoughness,envMapIntensity:.8,bumpMap:maps.stripes,bumpScale:.001});
 const bore=edge.clone();bore.color.set(0x8c999f);bore.roughness=.24;
 const bevel=edge.clone();bevel.roughness=.14;
 const circle=(cx,cy,radius,segments)=>{
  const path=new THREE.Path();
  for(let i=0;i<segments;i++){
   const a=-i/segments*TAU,x=cx+Math.cos(a)*radius,y=cy+Math.sin(a)*radius;
   if(i===0)path.moveTo(x,y);else path.lineTo(x,y);
  }
  path.closePath();return path;
 };
 const shape=(radius,inner,holeRadius)=>{
  const s=new THREE.Shape();
  for(let j=0;j<angles.length;j++){
   const a=angles[j],r=radius-notch(a),x=Math.sin(a)*r,z=Math.cos(a)*r;
   if(j===0)s.moveTo(x,z);else s.lineTo(x,z);
  }
  s.holes.push(circle(0,0,inner,192));
  for(let j=0;j<12;j++){
   const a=(j+.5)/12*TAU;s.holes.push(circle(Math.sin(a)*2.13,Math.cos(a)*2.13,holeRadius,32));
  }
  const g=new THREE.ShapeGeometry(s),uv=g.getAttribute('uv'),pos=g.getAttribute('position');
  for(let j=0;j<uv.count;j++)uv.setXY(j,pos.getX(j)/5.04+.5,pos.getY(j)/5.04+.5);
  return g;
 };
 const top=new THREE.Mesh(shape(2.5,1.77,.177),face);top.rotation.x=-Math.PI/2;group.add(top);
 const bottom=new THREE.Mesh(shape(2.49,1.73,.087),edge);bottom.rotation.x=Math.PI/2;bottom.position.y=-.64;group.add(bottom);
 const lathe=(profile,material,segments=192)=>new THREE.Mesh(new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),segments),material);
 const outerProfile=[[2.49,-.64],[2.51,-.62],[2.52,-.60],[2.52,-.52],[2.515,-.51],[2.52,-.50],[2.52,-.16],[2.516,-.15],[2.52,-.14],[2.52,-.025],[2.5,0]];
 const outer=lathe(outerProfile,edge,angles.length-1);
 const pos=outer.geometry.getAttribute('position');
 for(let i=0;i<pos.count;i++){
  const r=Math.hypot(pos.getX(i),pos.getZ(i)),a=angles[Math.floor(i/outerProfile.length)],d=notch(a);pos.setXYZ(i,Math.sin(a)*(r-d),pos.getY(i),Math.cos(a)*(r-d));
 }
 outer.geometry.computeVertexNormals();group.add(outer);
 group.add(lathe([[1.77,0],[1.75,-.025],[1.75,-.08],[1.70,-.11],[1.69,-.14],[1.69,-.20],[1.72,-.22],[1.72,-.26],[1.68,-.29],[1.68,-.53],[1.71,-.55],[1.71,-.62],[1.73,-.64]],edge));
 // Tiny continuous bevels catch the studio strips without moving the camera.
 group.add(lathe([[1.77,0],[1.764,-.006],[1.75,-.025]],bevel));
 const profile=[[.177,0],[.164,-.012],[.158,-.028],[.158,-.17],[.148,-.185],[.097,-.185],[.087,-.195],[.080,-.21],[.080,-.625],[.087,-.64]];
 const bg=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),32);
 const holes=new THREE.InstancedMesh(bg,bore,12),matrix=new THREE.Matrix4();
 for(let j=0;j<12;j++){
  const a=(j+.5)/12*TAU;matrix.makeTranslation(Math.sin(a)*2.13,0,Math.cos(a)*2.13);holes.setMatrixAt(j,matrix);
 }
 holes.instanceMatrix.needsUpdate=true;group.add(holes);
 return {group,maps};
}

// The same original illustration was used at all breakpoints. Match its hole
// ellipse (0.675 ratio / 30.91 degrees), scale and center before layout cropping.
// CSS preserves the selected +10 degree wide and -12 degree phone compositions.
const PHOTO_FRAMING={position:[4,8.3,6.5],target:[0,-.24,0],roll:.54,zoom:1.07,offset:[-.0235,.054]};
const WIDE_FRAMING={...PHOTO_FRAMING};
const PHONE_FRAMING={...PHOTO_FRAMING};
export async function create(container,variant='satin',{environmentUrl='assets/precision-ring-lighting.webp',environmentBlob=null,textureWorkerUrl='assets/ring-metal-worker.js?v=fast-start',framing=null,responsiveFraming=false}={}){
 const p=presets[variant];
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:false});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setClearColor(0,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=p.exposure;
 const scene=new THREE.Scene();
 const {hdr,maps}=await preparedResources(textureWorkerUrl,environmentUrl,environmentBlob);
 const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromEquirectangular(hdr);
 hdr.dispose();pmrem.dispose();scene.environment=environment.texture;scene.environmentRotation.y=p.envRotation;
 const camera=new THREE.PerspectiveCamera(27,1,.1,60);
 const phone=matchMedia('(max-width:640px)');
 const {group:ring}=model(p,maps);scene.add(ring);
 const meshInfo={meshes:0,triangles:0,vertices:0,uniqueGeometries:0,geometryBytes:0,instanceBytes:0};
 const geometries=new Set();
 ring.traverse(object=>{
  if(!object.isMesh)return;
  const g=object.geometry,instances=object.isInstancedMesh?object.count:1;meshInfo.meshes++;meshInfo.triangles+=(g.index?.count??g.attributes.position.count)/3*instances;meshInfo.vertices+=g.attributes.position.count*instances;
  meshInfo.instanceBytes+=object.instanceMatrix?.array.byteLength??0;
  if(geometries.has(g))return;geometries.add(g);meshInfo.uniqueGeometries++;
  meshInfo.geometryBytes+=(g.index?.array.byteLength??0)+Object.values(g.attributes).reduce((bytes,a)=>bytes+a.array.byteLength,0);
 });
 const key=new THREE.DirectionalLight(0xffffff,1.3);key.position.set(-3,7,5);scene.add(key);
 const cyan=new THREE.DirectionalLight(0x19cbd3,p.cyan);cyan.position.set(-6,1,0);scene.add(cyan);
 renderer.domElement.setAttribute('aria-hidden','true');container.appendChild(renderer.domElement);
 let seconds=0,pose=WIDE_FRAMING;
 const draw=()=>renderer.render(scene,camera);
 const resize=()=>{
  const w=container.clientWidth||600,h=container.clientHeight||600;
  pose=framing||(responsiveFraming&&phone.matches?PHONE_FRAMING:WIDE_FRAMING);
  camera.position.set(...(pose.position||WIDE_FRAMING.position));camera.lookAt(...(pose.target||WIDE_FRAMING.target));camera.rotateZ(pose.roll??WIDE_FRAMING.roll);camera.zoom=pose.zoom??WIDE_FRAMING.zoom;
  camera.aspect=w/h;
  if(pose.offset)camera.setViewOffset(w,h,pose.offset[0]*w,pose.offset[1]*h,w,h);else camera.clearViewOffset();
  camera.updateProjectionMatrix();renderer.setSize(w,h,false);draw();
 };
 resize();const observer=new ResizeObserver(resize);observer.observe(container);phone.addEventListener('change',resize);
 return {
  seek(t){seconds=t;ring.rotation.y=t*TAU/24;draw();},
  state(){return {seconds,angle:ring.rotation.y,axis:[0,1,0],camera:camera.matrixWorld.elements.slice(),framing:pose===PHONE_FRAMING?'phone':pose===WIDE_FRAMING?'wide':'custom',triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,meshInfo:{...meshInfo}};},
  dispose(){observer.disconnect();phone.removeEventListener('change',resize);environment.dispose();Object.values(maps).forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();scene.traverse(o=>{if(o.isInstancedMesh)o.dispose();o.geometry?.dispose();o.material?.dispose();});}
 };
}
