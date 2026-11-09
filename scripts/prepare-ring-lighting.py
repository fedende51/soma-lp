"""Losslessly pack original RGBE into an opaque WebP for native worker decoding."""
from pathlib import Path
from PIL import Image
import numpy as np, json, hashlib
root=Path(__file__).resolve().parents[1]
source=root/'design-assets/precision-ring-studio-original.hdr'
b=source.read_bytes();marker=b'-Y 1024 +X 2048\n';offset=b.index(marker)+len(marker)
rgba=np.zeros((1024,2048,4),dtype=np.uint8)
for y in range(1024):
 assert b[offset:offset+4]==bytes([2,2,8,0]);offset+=4
 for channel in range(4):
  x=0
  while x<2048:
   count=b[offset];offset+=1
   if count>128:rgba[y,x:x+count-128,channel]=b[offset];offset+=1;x+=count-128
   else:rgba[y,x:x+count,channel]=np.frombuffer(b[offset:offset+count],dtype=np.uint8);offset+=count;x+=count
packed=np.concatenate([rgba[:,:,:3],np.repeat(rgba[:,:,3:4],3,axis=2)],axis=1)
dest=root/'dist/assets/precision-ring-lighting.webp'
Image.fromarray(packed).save(dest,lossless=True,method=6)
assert np.array_equal(np.array(Image.open(dest)),packed)
report={'source':source.name,'sourceBytes':source.stat().st_size,'packedBytes':dest.stat().st_size,'originalDimensions':[2048,1024],'packedDimensions':[4096,1024],'originalRGBESha256':hashlib.sha256(rgba.tobytes()).hexdigest(),'lossless':True}
(root/'design-assets/ring-lighting-manifest.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
