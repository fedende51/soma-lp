import fs from 'node:fs';
import path from 'node:path';
const binDir=path.resolve('.sites-runtime/python/imageio_ffmpeg/binaries');
export const ffmpeg=process.env.SOMA_FFMPEG||(fs.existsSync(binDir)?path.join(binDir,fs.readdirSync(binDir).find(n=>n.startsWith('ffmpeg-')&&n.endsWith('.exe'))||'missing'):'');
if(!ffmpeg||!fs.existsSync(ffmpeg))throw new Error('Install the full video renderer: python -m pip install --target .sites-runtime/python imageio-ffmpeg, or set SOMA_FFMPEG.');
