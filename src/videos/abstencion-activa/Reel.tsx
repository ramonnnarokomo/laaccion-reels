import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {loadBrandFonts} from '../../kit/brand';
import {Header, Paper} from '../../kit/ui';
import {FranjaSuperior, Fundido, SubtitulosArriba} from '../../kit/mundo';
import {E, IDS, LINEAS, SC, type Id} from './timeline';
import {Activa, Boetie, Calle, Cierre, Conciencia, Dato, Gancho, Objeciones, Pasiva} from './Escenas';

loadBrandFonts();

const ESCENA: Record<Id, React.FC> = {
  '01-gancho': Gancho,
  '02-dato': Dato,
  '03-pasiva': Pasiva,
  '04-activa': Activa,
  '05-conciencia': Conciencia,
  '06-objeciones': Objeciones,
  '07-calle': Calle,
  '08-boetie': Boetie,
  '09-cierre': Cierre,
};
const outro = SC['09-cierre'].from + E('09-cierre')(6) + 8;

export const Reel: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    {IDS.map((id) => {
      const Esc = ESCENA[id];
      return (
        <Sequence key={id} from={SC[id].from} durationInFrames={SC[id].to - SC[id].from}>
          <Fundido n={id === '01-gancho' ? 1 : 3}>
            <Esc />
          </Fundido>
        </Sequence>
      );
    })}
    <Sequence from={0} durationInFrames={outro}>
      <FranjaSuperior alto={505} />
    </Sequence>
    <Sequence from={0} durationInFrames={outro}>
      <Header />
    </Sequence>
    <SubtitulosArriba lineas={LINEAS} />
    {IDS.map((id) => (
      <Sequence key={'v' + id} from={SC[id].voz} layout="none">
        <Audio src={staticFile(`voz/abstencion-activa/${id}.wav`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
