import React from 'react';
import {Composition} from 'remotion';
import {Reel as CuantoPesaTuVoto} from './videos/cuanto-pesa-tu-voto/Reel';
import {FPS, TOTAL as T1} from './videos/cuanto-pesa-tu-voto/timeline';
import {Reel as QuienEligeAlPresidente} from './videos/quien-elige-al-presidente/Reel';
import {TOTAL as T2} from './videos/quien-elige-al-presidente/timeline';
import {Reel as CuantoPesaTuVoto2} from './videos/cuanto-pesa-tu-voto-2/Reel';
import {TOTAL as T3} from './videos/cuanto-pesa-tu-voto-2/timeline';
import {Reel as DemoReal, DEMO_TOTAL} from './videos/_demo-real/Reel';
import {Reel as Constitucion1} from './videos/espana-no-tiene-constitucion/parte1/Reel';
import {TOTAL as C1} from './videos/espana-no-tiene-constitucion/parte1/timeline';
import {Reel as Constitucion2} from './videos/espana-no-tiene-constitucion/parte2/Reel';
import {TOTAL as C2} from './videos/espana-no-tiene-constitucion/parte2/timeline';
import {Reel as Constitucion3} from './videos/espana-no-tiene-constitucion/parte3/Reel';
import {TOTAL as C3} from './videos/espana-no-tiene-constitucion/parte3/timeline';
import {Portada as PortadaConstitucion} from './videos/espana-no-tiene-constitucion/Portada';
import {Reel as Abstencion} from './videos/abstencion-activa/Reel';
import {TOTAL as AB} from './videos/abstencion-activa/timeline';
import {Portada as PortadaAbstencion} from './videos/abstencion-activa/Portada';

// Cada vídeo nuevo: una carpeta en src/videos/<slug>/ y una línea aquí.
export const Root: React.FC = () => (
  <>
    <Composition id="cuanto-pesa-tu-voto" component={CuantoPesaTuVoto} durationInFrames={T1} fps={FPS} width={1080} height={1920} />
    <Composition id="quien-elige-al-presidente" component={QuienEligeAlPresidente} durationInFrames={T2} fps={FPS} width={1080} height={1920} />
    <Composition id="cuanto-pesa-tu-voto-2" component={CuantoPesaTuVoto2} durationInFrames={T3} fps={FPS} width={1080} height={1920} />
    <Composition id="constitucion-1" component={Constitucion1} durationInFrames={C1} fps={FPS} width={1080} height={1920} />
    <Composition id="constitucion-2" component={Constitucion2} durationInFrames={C2} fps={FPS} width={1080} height={1920} />
    <Composition id="constitucion-3" component={Constitucion3} durationInFrames={C3} fps={FPS} width={1080} height={1920} />
    {[1, 2, 3].map((p) => (
      <Composition key={p} id={`portada-constitucion-${p}`} component={PortadaConstitucion} defaultProps={{parte: p as 1 | 2 | 3}} durationInFrames={60} fps={FPS} width={1080} height={1920} />
    ))}
    <Composition id="abstencion-activa" component={Abstencion} durationInFrames={AB} fps={FPS} width={1080} height={1920} />
    <Composition id="portada-abstencion" component={PortadaAbstencion} durationInFrames={60} fps={FPS} width={1080} height={1920} />
    <Composition id="demo-real" component={DemoReal} durationInFrames={DEMO_TOTAL} fps={FPS} width={1080} height={1920} />
  </>
);
