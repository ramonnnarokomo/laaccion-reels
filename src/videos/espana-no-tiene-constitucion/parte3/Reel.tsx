import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {loadBrandFonts} from '../../../kit/brand';
import {Header, Paper} from '../../../kit/ui';
import {FranjaSuperior, Fundido, SubtitulosArriba} from '../../../kit/mundo';
import {SERIE} from '../comun';
import {E, IDS, LINEAS, SC, type Id} from './timeline';
import {Cierre, Deuda, Frase, Gancho, Llaves168, Objecion, Propuesta, Reformas} from './Escenas';

loadBrandFonts();

const ESCENA: Record<Id, React.FC> = {
  '01-gancho': Gancho,
  '02-reformas': Reformas,
  '03-deuda': Deuda,
  '04-llaves': Llaves168,
  '05-objecion': Objecion,
  '06-frase': Frase,
  '07-propuesta': Propuesta,
  '08-cierre': Cierre,
};

// En la frase redonda, el texto grande sustituye a los subtítulos.
const sinFrase = LINEAS.filter((l) => l.from < SC['06-frase'].from || l.from >= SC['06-frase'].to);
// Desde que entra el logo, sin cabecera ni franja.
const outro = SC['08-cierre'].from + E('08-cierre')(2) + 8;

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
      <Header serie={SERIE} der="3/3" />
    </Sequence>
    <SubtitulosArriba lineas={sinFrase} />
    {IDS.map((id) => (
      <Sequence key={'v' + id} from={SC[id].voz} layout="none">
        <Audio src={staticFile(`voz/constitucion-3/${id}.wav`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
