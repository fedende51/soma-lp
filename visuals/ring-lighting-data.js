import {toHalfFloat} from 'three/src/extras/DataUtils.js';

// The two opaque image panels hold the original HDR's RGB mantissas and
// exponents. Lossless WebP keeps all RGBE bytes, including values above white.
// Opaque packing avoids browser alpha premultiplication changing HDR values.
export async function decodeLighting(blob){
 const image=await createImageBitmap(blob,{colorSpaceConversion:'none',premultiplyAlpha:'none'});
 const canvas=typeof OffscreenCanvas==='function'?new OffscreenCanvas(image.width,image.height):Object.assign(document.createElement('canvas'),{width:image.width,height:image.height});
 const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
 const pixels=context.getImageData(0,0,image.width,image.height).data,width=image.width/2,height=image.height;
 const data=new Uint16Array(width*height*4);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const i=(y*width+x)*4,rgb=(y*width*2+x)*4,exponent=(y*width*2+x+width)*4;
  // Match Three's HDRLoader exactly, including its /255 scale and clamp.
  const scale=Math.pow(2,pixels[exponent]-128)/255;
  data[i]=toHalfFloat(Math.min(pixels[rgb]*scale,65504));
  data[i+1]=toHalfFloat(Math.min(pixels[rgb+1]*scale,65504));
  data[i+2]=toHalfFloat(Math.min(pixels[rgb+2]*scale,65504));data[i+3]=15360;
 }
 image.close();return {data,width,height};
}
