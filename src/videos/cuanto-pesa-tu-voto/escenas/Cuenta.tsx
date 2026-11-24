import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, SANS, SERIF} from '../../../kit/brand';
import {Counter, Dots, Rise, Sfx, Tag, Typed, clamp} from '../../../kit/ui';

const Etiqueta: React.FC<{nombre: string; sub: string; color: string}> = ({nombre, sub, color}) => (
  <Rise at={0} style={{left: 100, top: 392}}>
    <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 60, letterSpacing: '.06em', color}}>{nombre}</div>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: '.14em', color: C.piedra, marginTop: 4}}>{sub}</div>
  </Rise>
);

const num: React.CSSProperties = {left: 80, right: 80, textAlign: 'center', fontFamily: SERIF, color: C.tinta};

// Madrid: 38 diputados para 5.536.913 electores
export const Madrid: React.FC = () => {
  const f = useCurrentFrame();
  const NOTE = 188;
  const under = interpolate(f, [NOTE + 6, NOTE + 22], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <>
      <Tag text="Haz la cuenta" delay={0} />
      <Etiqueta nombre="MADRID" sub="38 DIPUTADOS" color={C.tinta} />
      <Dots n={38} cols={10} x0={297} y0={590} step={54} r={19} color={C.tinta} at={10} every={1.6} />
      <Typed text="5.536.913 ÷ 38" at={78} every={2} style={{...num, top: 800, fontSize: 80, fontWeight: 400}} />
      <Counter to={145708} from={110} until={160} style={{...num, top: 895, fontSize: 168, fontWeight: 700, lineHeight: 1}} />
      <Rise at={162} style={{...num, top: 1078, fontFamily: SANS, fontSize: 32}}>
        electores por diputado
      </Rise>
      <Rise at={NOTE} style={{...num, top: 1140, fontFamily: SANS, fontSize: 32, fontWeight: 700, color: C.burdeos}}>
        <span style={{position: 'relative'}}>
          El que menos pesa de las 52 circunscripciones
          <span style={{position: 'absolute', left: 0, bottom: -8, height: 4, width: `${under * 100}%`, background: C.burdeos}} />
        </span>
      </Rise>
      <Sfx at={NOTE} src="whoosh_soft" volume={0.5} />
    </>
  );
};

// Soria: 2 diputados para 77.069 electores, y barras comparadas
export const Soria: React.FC = () => {
  const f = useCurrentFrame();
  const B = 96;
  const wM = interpolate(f, [B, B + 18], [0, 780], {...clamp, easing: Easing.out(Easing.cubic)});
  const wS = interpolate(f, [B + 8, B + 26], [0, (780 * 38535) / 145708], {...clamp, easing: Easing.out(Easing.cubic)});
  const lab = interpolate(f, [B + 10, B + 18], [0, 1], clamp);
  return (
    <>
      <Tag text="Haz la cuenta" delay={0} sound={false} />
      <Etiqueta nombre="SORIA" sub="2 DIPUTADOS" color={C.burdeos} />
      <Dots n={2} cols={2} x0={513} y0={590} step={54} r={19} color={C.burdeos} at={10} every={7} sound="pop" />
      <Typed text="77.069 ÷ 2" at={26} every={2} style={{...num, top: 670, fontSize: 80, fontWeight: 400}} />
      <Counter to={38535} from={50} until={84} style={{...num, top: 765, fontSize: 168, fontWeight: 700, lineHeight: 1, color: C.burdeos}} />
      <Rise at={86} style={{...num, top: 948, fontFamily: SANS, fontSize: 32}}>
        electores por diputado
      </Rise>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <rect x={150} y={1048} width={wM} height={36} fill={C.tinta} />
        <rect x={150} y={1150} width={wS} height={36} fill={C.burdeos} />
      </svg>
      <div style={{position: 'absolute', left: 150, top: 1010, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.tinta, opacity: lab}}>
        Madrid · 145.708
      </div>
      <div style={{position: 'absolute', left: 150, top: 1112, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.burdeos, opacity: lab}}>
        Soria · 38.535
      </div>
      <Rise at={B + 30} style={{...num, top: 1232, fontFamily: SANS, fontSize: 22, color: C.piedra}}>
        Fuentes: RD 806/2026 (BOE, 6/10/2026) · INE, censo del 29N
      </Rise>
      <Sfx at={B - 4} src="riser" volume={0.45} />
    </>
  );
};
