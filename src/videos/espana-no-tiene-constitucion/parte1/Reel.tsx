import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {loadBrandFonts} from '../../../kit/brand';
import {Header, Paper} from '../../../kit/ui';
import {FranjaSuperior, Fundido, SubtitulosArriba} from '../../../kit/mundo';
import {SERIE} from '../comun';
import {IDS, LINEAS, SC, type Id} from './timeline';
import {Art16, Cierre, Derechos, Gancho, HilosEscena, Jueces, Objecion, Poderes} from './Escenas';

loadBrandFonts();

const ESCENA: Record<Id, React.FC> = {
  '01-gancho': Gancho,
  '02-art16': Art16,
  '03-derechos': Derechos,
  '04-poderes': Poderes,
  '05-jueces': Jueces,
  '06-hilos': HilosEscena,
  '07-objecion': Objecion,
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
    <Header serie={SERIE} der="1/3" />
    <SubtitulosArriba lineas={LINEAS} />
    {IDS.map((id) => (
      <Sequence key={'v' + id} from={SC[id].voz} layout="none">
        <Audio src={staticFile(`voz/constitucion-1/${id}.wav`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
