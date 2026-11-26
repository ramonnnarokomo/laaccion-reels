import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadBrandFonts} from '../../kit/brand';
import {Header, Paper} from '../../kit/ui';
import {Sello} from '../../kit/mundo';
import {Destello, FotoReal, FuenteMini, Pildora, Recorte, Temblor} from '../../kit/real';

loadBrandFonts();

// Muestrario de src/kit/real.tsx (no es un vídeo para publicar).
export const DEMO_TOTAL = 240;
export const Reel: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    <Header />
    <FotoReal src="img/prueba/edificio.jpg" pie="Tribunal Constitucional · Madrid" x={540} y={560} at={10} out={100} credito="Foto: autor · CC BY-SA 4.0" />
    <Pildora text="12 magistrados" x={540} y={1150} at={30} apaga={60} out={100} />
    <Pildora text="los proponen Cortes y Gobierno" x={540} y={1240} at={60} variante="blanco" out={100} />
    <FuenteMini text="Constitución, art. 159" x={540} y={1330} at={40} out={100} />
    <Recorte
      x={540}
      y={600}
      at={115}
      medio="Constitución · art. 124.4"
      fecha="BOE 29/12/1978"
      texto="«El Fiscal General del Estado será nombrado por el Rey, [[a propuesta del Gobierno]], oído el Consejo General del Poder Judicial.»"
      marcasEn={[[135, 160]]}
    />
    <Temblor at={185}>
      <Sello x={540} y={1180} at={185} texto="EN LAS MISMAS MANOS" size={58} />
    </Temblor>
    <Destello at={185} />
  </AbsoluteFill>
);
