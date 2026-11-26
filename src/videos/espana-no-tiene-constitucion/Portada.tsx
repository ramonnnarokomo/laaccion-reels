import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, loadBrandFonts, SANS, SERIF} from '../../kit/brand';
import {Paper} from '../../kit/ui';
import {Halo} from '../../kit/mundo';
import {Candado, Carpeta, Corona, Libro, Llaves, Prueba} from './comun';

loadBrandFonts();

const TITULOS = ['La prueba de 1789', '¿Quién la escribió?', '¿Quién tiene las llaves?'];

// Portada de cada parte (fotograma 40, con todo ya asentado).
export const Portada: React.FC<{parte: 1 | 2 | 3}> = ({parte}) => (
  <AbsoluteFill>
    <Paper />
    <Halo x={540} y={1100} r={520} op={0.3} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: '0.2em', color: C.burdeos}}>LA CONSTITUCIÓN, A PRUEBA · {parte}/3</div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 380, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 132, lineHeight: 1.02, color: C.tinta}}>
      España <span style={{color: C.burdeos}}>no tiene</span> Constitución
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center'}}>
      <span style={{display: 'inline-block', background: C.tinta, color: '#FAF7F1', fontFamily: SANS, fontWeight: 800, fontSize: 48, padding: '12px 30px', borderRadius: 14}}>{TITULOS[parte - 1]}</span>
    </div>
    {parte === 1 && <Prueba x={540} y={990} at={0} marca1={{at: 0, texto: 'DEPENDE', color: '#8A6A2E'}} marca2={{at: 0, texto: 'SUSPENSO'}} />}
    {parte === 2 && (
      <>
        <Carpeta x={360} y={1010} at={0} w={380} />
        <Corona x={770} y={1030} at={0} w={260} interroga />
      </>
    )}
    {parte === 3 && (
      <>
        <Libro x={430} y={980} w={300} at={0} />
        <Candado x={430} y={1400} at={0} w={170} />
        <Llaves x={790} y={1120} at={0} w={240} />
      </>
    )}
    <Img src={staticFile('img/logo.png')} style={{position: 'absolute', left: 540 - 210, top: 1560, width: 420}} />
  </AbsoluteFill>
);
