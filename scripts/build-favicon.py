"""Crop the supplied SOMA artwork into a compact, name-free tab icon."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops
import base64,json,hashlib
root=Path(__file__).resolve().parents[1]
source=root/'dist/assets/logo_soma_light.png'
art=Image.open(source).convert('RGBA')
dark=Image.open(root/'dist/assets/logo_soma_dark.png').convert('RGBA')
box=(320,213,1080,973) # Square centered on the existing ring pivot (700, 593).
assert art.crop(box).tobytes()==dark.crop(box).tobytes(), 'Ring artwork must match in both supplied variants'
mask=Image.new('L',art.size,0);ImageDraw.Draw(mask).ellipse((380,273,1020,913),fill=255)
layers={}
for name,clip in [('outer',ImageChops.invert(mask)),('inner',mask)]:
 layer=art.copy();layer.putalpha(ImageChops.multiply(art.getchannel('A'),clip))
 layer=layer.crop(box).resize((128,128),Image.Resampling.LANCZOS)
 file=root/f'dist/assets/favicon-ring-{name}.png';layer.save(file,optimize=True)
 layers[name]='data:image/png;base64,'+base64.b64encode(file.read_bytes()).decode()
for name,size in [('favicon.png',64),('apple-touch-icon.png',180)]:
 art.crop(box).resize((size,size),Image.Resampling.LANCZOS).save(root/'dist/assets'/name,optimize=True)
template=(root/'visuals/favicon.template.js').read_text(encoding='utf-8')
script=template.replace('__SOMA_RING_LAYERS__',json.dumps(layers,separators=(',',':')))
(root/'dist/favicon.js').write_text(script,encoding='utf-8')
manifest={'originals':['logo_soma_light.png','logo_soma_dark.png'],'originalRingPixelsIdentical':True,'crop':box,'pivot':[700,593],'outerSeconds':24,'innerSeconds':30,'updatesPerSecond':8,'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'scriptBytes':len(script.encode())}
(root/'design-assets/favicon-manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(manifest))
