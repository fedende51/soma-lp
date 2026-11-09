import {build} from 'esbuild';
await build({entryPoints:['visuals/precision-ring-3d.js'],bundle:true,minify:true,format:'iife',globalName:'SomaPrecisionRing',outfile:'dist/assets/precision-ring-3d.js',legalComments:'eof'});
await build({entryPoints:['visuals/ring-metal-worker.js'],bundle:true,minify:true,format:'iife',outfile:'dist/assets/ring-metal-worker.js'});
