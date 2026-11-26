import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, loadBrandFonts, SANS, SERIF} from '../../kit/brand';
import {Paper} from '../../kit/ui';
import {Halo, Persona, Sala} from '../../kit/mundo';
import {Lienzo} from '../../kit/objetos';
import {Cartel, PERSONA_ACTIVA, Sofa} from './Escenas';

loadBrandFonts();

export const Portada: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    <Sala suelo={1420} />
    <Halo x={540} y={1100} r={520} op={0.3} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 280, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: '0.2em', color: C.burdeos}}>ABSTENCIÓN ACTIVA</div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 350, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 124, lineHeight: 1.02, color: C.tinta}}>
      Hay <span style={{color: C.burdeos}}>dos formas</span> de no votar
    </div>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <line x1={540} y1={900} x2={540} y2={1420} stroke={C.piedra} strokeWidth={4} strokeDasharray="14 10" />
    </svg>
    <Sofa x={270} y={1370} at={-30} tv="FÚTBOL" tvAt={-30} tvArriba />
    <Lienzo>
      <Persona x={810} y={1410} h={300} at={-30} {...PERSONA_ACTIVA} gesto="serio" pose="brazos-arriba" semilla={890} />
    </Lienzo>
    <Cartel x={810} y={930} at={-30} />
    <Img src={staticFile('img/logo.png')} style={{position: 'absolute', left: 540 - 210, top: 1560, width: 420}} />
  </AbsoluteFill>
);
