import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {loadBrandFonts} from '../../kit/brand';
import {Header, Paper} from '../../kit/ui';
import {FranjaSuperior, Fundido, SubtitulosArriba} from '../../kit/mundo';
import {IDS, LINEAS, SC, type Id} from './timeline';
import {Cierre, Discrepan, Gancho, Madrid, Propuesta, Regla, Teruel} from './Escenas';

loadBrandFonts();

const ESCENA: Record<Id, React.FC> = {
  '01-gancho': Gancho,
  '02-madrid': Madrid,
  '03-teruel': Teruel,
  '04-regla': Regla,
  '05-discrepan': Discrepan,
  '06-propuesta': Propuesta,
  '07-cierre': Cierre,
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
    <Sequence from={0} durationInFrames={SC['07-cierre'].from}>
      <FranjaSuperior alto={505} />
    </Sequence>
    <Sequence from={0} durationInFrames={SC['07-cierre'].from}>
      <Header />
    </Sequence>
    <SubtitulosArriba lineas={LINEAS} />
    {IDS.map((id) => (
      <Sequence key={'v' + id} from={SC[id].voz} layout="none">
        <Audio src={staticFile(`voz/cuanto-pesa-tu-voto-2/${id}.wav`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
