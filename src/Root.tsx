import React from 'react';
import {Composition} from 'remotion';
import {Reel as CuantoPesaTuVoto} from './videos/cuanto-pesa-tu-voto/Reel';
import {FPS, TOTAL as T1} from './videos/cuanto-pesa-tu-voto/timeline';
import {Reel as QuienEligeAlPresidente} from './videos/quien-elige-al-presidente/Reel';
import {TOTAL as T2} from './videos/quien-elige-al-presidente/timeline';
import {Reel as CuantoPesaTuVoto2} from './videos/cuanto-pesa-tu-voto-2/Reel';
import {TOTAL as T3} from './videos/cuanto-pesa-tu-voto-2/timeline';

// Cada vídeo nuevo: una carpeta en src/videos/<slug>/ y una línea aquí.
export const Root: React.FC = () => (
  <>
    <Composition id="cuanto-pesa-tu-voto" component={CuantoPesaTuVoto} durationInFrames={T1} fps={FPS} width={1080} height={1920} />
    <Composition id="quien-elige-al-presidente" component={QuienEligeAlPresidente} durationInFrames={T2} fps={FPS} width={1080} height={1920} />
    <Composition id="cuanto-pesa-tu-voto-2" component={CuantoPesaTuVoto2} durationInFrames={T3} fps={FPS} width={1080} height={1920} />
  </>
);
