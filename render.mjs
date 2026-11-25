// node render.mjs stills 20,100,170   |   node render.mjs video out/reel.mp4
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';

const [mode = 'stills', arg = '20'] = process.argv.slice(2);
const id = process.env.COMP ?? 'cuanto-pesa-tu-voto';
const browser = fs.existsSync('/usr/bin/google-chrome') ? {browserExecutable: '/usr/bin/google-chrome', chromeMode: 'chrome-for-testing'} : {};
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, ...browser});
fs.mkdirSync('out/stills', {recursive: true});
if (mode === 'stills') {
  for (const fr of arg.split(',').map(Number)) {
    await renderStill({serveUrl, composition, frame: fr, output: `out/stills/f${String(fr).padStart(4, '0')}.png`, ...browser});
    console.log('still', fr);
  }
} else {
  const tmp = arg.replace(/\.mp4$/, '.part.mp4');
  let last = -1;
  await renderMedia({
    serveUrl, composition, codec: 'h264', crf: 14, x264Preset: 'veryfast', pixelFormat: 'yuv420p', colorSpace: 'bt709', outputLocation: tmp, concurrency: 2, ...browser,
    onProgress: ({progress}) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`${p * 10}%`); } },
  });
  fs.renameSync(tmp, arg);
  console.log('ok', arg);
}
