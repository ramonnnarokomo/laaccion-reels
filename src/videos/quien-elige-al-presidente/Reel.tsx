import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {loadBrandFonts} from '../../kit/brand';
import {Header, Paper} from '../../kit/ui';
import {Fundido, SubtitulosArriba} from '../../kit/mundo';
import {IDS, LINEAS, SC, type Id} from './timeline';
import {Cierre, Discrepan, Gancho, Intento, Navidad, Propuesta, Regla, Reloj} from './Escenas';

loadBrandFonts();

const ESCENA: Record<Id, React.FC> = {
  '01-gancho': Gancho,
  '02-intento': Intento,
  '03-reloj': Reloj,
  '04-navidad': Navidad,
  '05-regla': Regla,
  '06-discrepan': Discrepan,
  '07-propuesta': Propuesta,
  '08-cierre': Cierre,
};

export const Reel: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    {IDS.map((id) => {
      const E = ESCENA[id];
      return (
        <Sequence key={id} from={SC[id].from} durationInFrames={SC[id].to - SC[id].from}>
          <Fundido n={id === '01-gancho' ? 1 : 3}>
            <E />
          </Fundido>
        </Sequence>
      );
    })}
    <Sequence from={0} durationInFrames={SC['08-cierre'].from}>
      <Header top={190} />
    </Sequence>
    <SubtitulosArriba lineas={LINEAS} top={318} />
    {IDS.map((id) => (
      <Sequence key={'v' + id} from={SC[id].voz} layout="none">
        <Audio src={staticFile(`voz/quien-elige-al-presidente/${id}.wav`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
