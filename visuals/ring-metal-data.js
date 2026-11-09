// Identical procedural pixels, generated off the UI thread when available.
export function createMetalData(size=1024){
 const bump=new Uint8Array(size*size*4),direction=new Uint8Array(size*size*4),roughness=new Uint8Array(size*size*4),stripes=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const dx=x-size/2,dy=y-size/2,r=Math.hypot(dx,dy),a=Math.atan2(dy,dx),i=(y*size+x)*4;
  const noise=((x*1973+y*9277+89173)%65521)/65521;
  const value=Math.round(128+7*Math.sin(r*5.2)+3*Math.sin(r*1.37)+(noise-.5)*4);
  bump[i]=bump[i+1]=bump[i+2]=value;bump[i+3]=255;
  // Tangential tool marks around the machining axis; B stores anisotropy strength.
  direction[i]=Math.round(127.5+127.5*Math.cos(a+Math.PI/2));
  direction[i+1]=Math.round(127.5+127.5*Math.sin(a+Math.PI/2));direction[i+2]=255;direction[i+3]=255;
  const rv=Math.round(238+9*Math.sin(r*.7)+3*(noise-.5));
  roughness[i]=roughness[i+1]=roughness[i+2]=rv;roughness[i+3]=255;
  const sv=Math.round(128+6*Math.sin(y*2.73)+3*Math.sin(y*.81)+(noise-.5)*3);
  stripes[i]=stripes[i+1]=stripes[i+2]=sv;stripes[i+3]=255;
 }
 return {bump,direction,roughness,stripes};
}
