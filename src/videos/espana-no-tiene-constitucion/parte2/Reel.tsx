import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {loadBrandFonts} from '../../../kit/brand';
import {Header, Paper} from '../../../kit/ui';
import {FranjaSuperior, Fundido, SubtitulosArriba} from '../../../kit/mundo';
import {SERIE} from '../comun';
import {IDS, LINEAS, SC, type Id} from './timeline';
import {Alternativa, Cierre, Cortes, Filtracion, Gancho, Objecion, Sieyes, Suarez} from './Escenas';

loadBrandFonts();

const ESCENA: Record<Id, React.FC> = {
  '01-gancho': Gancho,
  '02-filtracion': Filtracion,
  '03-cortes': Cortes,
  '04-objecion': Objecion,
  '05-suarez': Suarez,
  '06-sieyes': Sieyes,
  '07-alternativa': Alternativa,
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
    <FranjaSuperior alto={505} />
    <Header serie={SERIE} der="2/3" />
    <SubtitulosArriba lineas={LINEAS} />
    {IDS.map((id) => (
      <Sequence key={'v' + id} from={SC[id].voz} layout="none">
        <Audio src={staticFile(`voz/constitucion-2/${id}.wav`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
