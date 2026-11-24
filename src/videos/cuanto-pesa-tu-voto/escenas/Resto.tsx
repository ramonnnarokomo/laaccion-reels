import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS, SERIF} from '../../../kit/brand';
import {Bocadillo, Edificio, Monigote} from '../../../kit/figuras';
import {Headline, Rays, Rise, Sfx, Tag, clamp} from '../../../kit/ui';

// ---------- La regla: 102 de 350 escaños fijos ----------
const hemiciclo = (cx: number, cy: number, R0: number, R1: number, rows: number, total: number) => {
  const radii = Array.from({length: rows}, (_, i) => R0 + ((R1 - R0) * i) / (rows - 1));
  const sum = radii.reduce((a, b) => a + b, 0);
  const per = radii.map((r) => Math.round((total * r) / sum));
  per[rows - 1] += total - per.reduce((a, b) => a + b, 0);
  const pts: {x: number; y: number; t: number}[] = [];
  radii.forEach((r, i) => {
    for (let k = 0; k < per[i]; k++) {
      const t = Math.PI * (1 - k / (per[i] - 1));
      pts.push({x: cx + r * Math.cos(t), y: cy - r * Math.sin(t), t});
    }
  });
  return pts.sort((a, b) => b.t - a.t);
};
const PTS = hemiciclo(540, 1040, 170, 420, 9, 350);

export const Regla: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const G0 = 66;
  const fijos = Math.round(interpolate(f, [G0, G0 + 36], [0, 102], clamp));
  return (
    <>
      <Tag text="La regla" delay={0} />
      <Rise at={6} style={{left: 80, right: 80, top: 400, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 70, lineHeight: 1.1}}>
        <span style={{color: C.dorado, fontVariantNumeric: 'tabular-nums'}}>{fijos}</span> de 350 escaños,
        <br />
        sin mirar la población
      </Rise>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {PTS.map((p, i) => {
          const s = spring({frame: f - (10 + (i / 350) * 44), fps, config: {damping: 12, stiffness: 300}});
          const gold = i < 102 && f >= G0 + (i / 102) * 36;
          return <circle key={i} cx={p.x} cy={p.y} r={11 * s * (gold ? 1.15 : 1)} fill={gold ? C.dorado : C.tinta} opacity={gold ? 1 : 0.85} />;
        })}
      </svg>
      <Rise at={110} style={{left: 80, right: 80, top: 1080, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 32, color: C.tinta}}>
        2 fijos por provincia, más Ceuta y Melilla
      </Rise>
      <Rise at={118} style={{left: 80, right: 80, top: 1132, textAlign: 'center', fontFamily: SANS, fontSize: 24, color: C.piedra}}>
        Constitución, art. 68.2 · LOREG, art. 162
      </Rise>
      <Sfx at={10} src="whoosh_soft" volume={0.5} />
      <Sfx at={G0} src="shimmer" volume={0.7} />
    </>
  );
};

// ---------- Lo que dicen quienes discrepan ----------
export const Discrepan: React.FC = () => {
  const f = useCurrentFrame();
  const words = 'Sin ese mínimo, la España vaciada no pintaría nada.'.split(' ');
  const W0 = 20;
  return (
    <>
      <Tag text="Lo que dicen quienes discrepan" delay={2} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <Monigote x={250} y={1250} h={300} color={C.piedra} pose="habla" at={4} />
        <Monigote x={140} y={1255} h={200} color={C.piedra} at={8} />
        <Monigote x={360} y={1258} h={190} color={C.piedra} at={10} />
      </svg>
      <Bocadillo x={150} y={430} w={830} h={430} tx={330} ty={950} at={12}>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 76, lineHeight: 1.14, color: C.tinta}}>
          {words.map((w, i) => (
            <span key={i} style={{opacity: f >= W0 + i * 3 ? 1 : 0}}>
              {w}{' '}
            </span>
          ))}
        </div>
      </Bocadillo>
      <Sfx at={4} src="pop" volume={0.5} />
      <Sfx at={12} src="paper" volume={0.6} />
      {words.map((_, i) => (
        <Sfx key={i} at={W0 + i * 3} src="key" volume={0.45} dur={6} />
      ))}
    </>
  );
};

// ---------- Nuestra respuesta: el Senado ----------
export const Respuesta: React.FC = () => {
  const f = useCurrentFrame();
  const R2 = 118;
  return (
    <>
      <Tag text="Nuestra respuesta" delay={0} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <Edificio x={540} y={640} w={420} label="SENADO" at={6} />
        {[0, 1, 2, 3].map((i) => (
          <Monigote key={`s${i}`} x={170 + i * 58} y={900} h={120} color={C.burdeos} at={24 + i * 6} bob={false} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <Monigote key={`m${i}`} x={736 + i * 58} y={900} h={120} color={C.tinta} at={27 + i * 6} bob={false} />
        ))}
        <text x={257} y={960} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} letterSpacing={5} fill={C.burdeos} opacity={f > 24 ? 1 : 0}>
          SORIA · 4
        </text>
        <text x={823} y={960} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} letterSpacing={5} fill={C.tinta} opacity={f > 27 ? 1 : 0}>
          MADRID · 4
        </text>
        <text x={540} y={888} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={90} fill={C.dorado} opacity={interpolate(f, [52, 58], [0, 1], clamp)}>
          =
        </text>
      </svg>
      <Rise at={60} style={{left: 80, right: 80, top: 1000, textAlign: 'center', fontFamily: SANS, fontSize: 26, color: C.piedra}}>
        La cámara territorial ya existe (Constitución, art. 69)
      </Rise>
      <Rise at={R2} style={{left: 80, right: 80, top: 1080, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 60, lineHeight: 1.1}}>
        En el Congreso, <span style={{color: C.burdeos, fontStyle: 'italic'}}>cada persona igual.</span>
      </Rise>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Sfx key={i} at={(i % 2 ? 27 : 24) + Math.floor(i / 2) * 6} src="pop" volume={0.45} dur={8} />
      ))}
      <Sfx at={6} src="whoosh_soft" volume={0.4} />
      <Sfx at={54} src="ding" volume={0.5} />
      <Sfx at={R2} src="whoosh" volume={0.5} />
    </>
  );
};

// ---------- Qué proponemos: distritos iguales ----------
export const Propuesta: React.FC = () => {
  const f = useCurrentFrame();
  const cells: {x: number; y: number; i: number}[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) cells.push({x: 175 + c * 136 + (r % 2) * 68, y: 470 + r * 118, i: r * 6 + c});
  const hex = (x: number, y: number, R: number) =>
    [0, 1, 2, 3, 4, 5].map((k) => {
      const a = (Math.PI / 3) * k + Math.PI / 6;
      return `${(x + R * Math.cos(a)).toFixed(1)},${(y + R * Math.sin(a)).toFixed(1)}`;
    }).join(' ');
  const HI = 15;
  const hl = interpolate(f, [62, 70], [0, 1], clamp);
  return (
    <>
      <Tag text="Qué proponemos" delay={0} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {cells.map((c) => {
          const at = 6 + c.i * 1.1;
          const o = interpolate(f, [at, at + 5], [0, 1], clamp);
          const isHi = c.i === HI;
          return (
            <g key={c.i} opacity={o}>
              <polygon points={hex(c.x, c.y, 68)} fill={isHi ? `rgba(121,47,54,${0.12 * hl})` : 'none'} stroke={isHi && hl > 0 ? C.burdeos : C.dorado} strokeWidth={isHi ? 2 + 3 * hl : 2} />
              <Monigote x={c.x} y={c.y + 34} h={78} color={isHi && hl > 0 ? C.burdeos : C.tinta} at={at + 2} bob={false} />
            </g>
          );
        })}
      </svg>
      <Rise at={40} style={{left: 80, right: 80, top: 960, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 58, lineHeight: 1.18}}>
        Distritos de igual población.
      </Rise>
      <Rise at={52} style={{left: 80, right: 80, top: 1030, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 58, lineHeight: 1.18}}>
        Un diputado cada uno.
      </Rise>
      <Rise at={64} style={{left: 80, right: 80, top: 1100, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontStyle: 'italic', fontSize: 58, lineHeight: 1.18, color: C.burdeos}}>
        Que responda ante ti.
      </Rise>
      {cells.filter((c) => c.i % 3 === 0).map((c) => (
        <Sfx key={c.i} at={8 + c.i * 1.1} src="tick" volume={0.4} dur={5} />
      ))}
      <Sfx at={40} src="whoosh_soft" volume={0.4} />
      <Sfx at={64} src="ding" volume={0.45} />
    </>
  );
};

// ---------- Cierre ----------
export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 14, stiffness: 120}});
  const url = spring({frame: f - 32, fps, config: {damping: 10, stiffness: 220}});
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={540} cy={700} r={420} fill="none" stroke={C.dorado} strokeWidth={1.5} opacity={0.35 * s} />
        <circle cx={540} cy={700} r={370} fill="none" stroke={C.dorado} strokeWidth={1} strokeDasharray="3 9" opacity={0.35 * s} />
        <Rays cx={540} cy={700} r0={300} r1={330} n={120} rot={f * 0.2} op={0.25 * s} />
      </svg>
      <Img
        src={staticFile('img/logo.png')}
        style={{position: 'absolute', left: 80, top: 545, width: 920, opacity: interpolate(f, [0, 10], [0, 1], clamp), transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`}}
      />
      <Headline style={{top: 960, fontSize: 70, opacity: interpolate(f, [16, 24], [0, 1], clamp)}}>¿Cuánto pesa tu voto?</Headline>
      <Headline style={{top: 1050, fontSize: 42, fontWeight: 400, color: C.piedra, opacity: interpolate(f, [22, 30], [0, 1], clamp)}}>
        Las 52 provincias, con fuentes
      </Headline>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1140,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 70,
          letterSpacing: '.01em',
          color: C.burdeos,
          opacity: f >= 32 ? 1 : 0,
          transform: `scale(${interpolate(url, [0, 1], [1.4, 1])})`,
        }}
      >
        laaccion.com
      </div>
      <Sfx at={0} src="whoosh" volume={0.5} />
      <Sfx at={32} src="stamp" volume={0.6} />
      <Sfx at={36} src="ding" volume={0.55} />
    </>
  );
};
