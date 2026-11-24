import React from 'react';
import {Composition} from 'remotion';
import {Reel as CuantoPesaTuVoto} from './videos/cuanto-pesa-tu-voto/Reel';
import {FPS, TOTAL as T1} from './videos/cuanto-pesa-tu-voto/timeline';

// Cada vídeo nuevo: una carpeta en src/videos/<slug>/ y una línea aquí.
export const Root: React.FC = () => (
  <>
    <Composition id="cuanto-pesa-tu-voto" component={CuantoPesaTuVoto} durationInFrames={T1} fps={FPS} width={1080} height={1920} />
  </>
);
