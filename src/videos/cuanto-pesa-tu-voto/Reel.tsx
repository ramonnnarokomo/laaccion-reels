import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {loadBrandFonts} from '../../kit/brand';
import {SCENES, SUBTITLES, type SceneId} from './timeline';
import {Header, Paper, SceneIn, Sfx, Subtitles} from '../../kit/ui';
import {Balanza} from './escenas/Balanza';
import {Madrid, Soria} from './escenas/Cuenta';
import {Cierre, Discrepan, Propuesta, Regla, Respuesta} from './escenas/Resto';

loadBrandFonts();

const Escena: React.FC<{id: SceneId; children: React.ReactNode}> = ({id, children}) => (
  <Sequence from={SCENES[id][0]} durationInFrames={SCENES[id][1] - SCENES[id][0]}>
    <SceneIn>{children}</SceneIn>
  </Sequence>
);

export const Reel: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    <Sequence from={0} durationInFrames={SCENES.cierre[0]}>
      <Header />
    </Sequence>
    <Sequence from={0} durationInFrames={SCENES.revelacion[1]}>
      <Balanza />
    </Sequence>
    <Escena id="madrid"><Madrid /></Escena>
    <Escena id="soria"><Soria /></Escena>
    <Escena id="regla"><Regla /></Escena>
    <Escena id="discrepan"><Discrepan /></Escena>
    <Escena id="respuesta"><Respuesta /></Escena>
    <Escena id="propuesta"><Propuesta /></Escena>
    <Escena id="cierre"><Cierre /></Escena>
    <Subtitles items={SUBTITLES} />
    {(['madrid', 'soria', 'regla', 'respuesta', 'propuesta'] as SceneId[]).map((id) => (
      <Sfx key={id} at={SCENES[id][0] - 3} src="whoosh_soft" volume={0.45} />
    ))}
  </AbsoluteFill>
);
