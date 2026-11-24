import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS, SERIF} from '../../../kit/brand';
import {Headline, Rays, Sfx, Tag, clamp} from '../../../kit/ui';

// Gancho + revelación (0–176): mismo sobre en cada platillo y Soria se hunde.
// Luego Madrid necesita 3,78 sobres para equilibrar.

const CX = 540;
const CY = 770;
const L = 330;
const HANG = 250;
const K = 13 / 2.78; // grados por sobre de diferencia (1 sobre en Madrid = 13°)

const LAND0 = 16; // caen los dos primeros sobres
const MADRID_EXTRA = [
  {at: 115, w: 1},
  {at: 127, w: 1},
  {at: 139, w: 0.78},
];
const BALANCED = MADRID_EXTRA[2].at + 4;
const STAMP = 151;

const Sobre: React.FC<{x: number; y: number; part?: number; op?: number}> = ({x, y, part = 1, op = 1}) => {
  const w = 120;
  const h = 84;
  return (
    <g transform={`translate(${x - w / 2} ${y - h})`} opacity={op}>
      {part < 1 && (
        <rect x={2} y={2} width={w - 4} height={h - 4} fill="none" stroke={C.burdeos} strokeWidth={3} strokeDasharray="8 7" />
      )}
      <rect x={2} y={2} width={(w - 4) * part} height={h - 4} fill="#fff" stroke={C.tinta} strokeWidth={3} />
      {part === 1 && <path d={`M2 2 L${w / 2} ${h * 0.55} L${w - 2} 2`} fill="none" stroke={C.tinta} strokeWidth={3} />}
    </g>
  );
};

const fallY = (f: number, land: number, dur = 12) =>
  interpolate(f, [land - dur, land], [-1250, 0], {...clamp, easing: Easing.in(Easing.quad)});

export const Balanza: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (at: number) => spring({frame: f - at, fps, config: {damping: 6.5, stiffness: 120, mass: 1}});

  // Ángulo: positivo = baja la derecha (Soria)
  let ang = 13 * sp(LAND0);
  for (const e of MADRID_EXTRA) ang -= K * e.w * sp(e.at);
  if (f < LAND0) ang += 1.2 * Math.sin(f / 3);
  const a = (ang * Math.PI) / 180;
  const lx = CX - L * Math.cos(a);
  const ly = CY - L * Math.sin(a);
  const rx = CX + L * Math.cos(a);
  const ry = CY + L * Math.sin(a);

  const pan = (x: number, y: number) => {
    const py = y + HANG;
    return (
      <g>
        <line x1={x} y1={y} x2={x - 120} y2={py} stroke={C.tinta} strokeWidth={2.5} />
        <line x1={x} y1={y} x2={x + 120} y2={py} stroke={C.tinta} strokeWidth={2.5} />
        <path d={`M${x - 160} ${py} Q${x} ${py + 90} ${x + 160} ${py} Z`} fill={C.papel} stroke={C.tinta} strokeWidth={5} />
      </g>
    );
  };

  const lpy = ly + HANG; // fondo del platillo izquierdo (Madrid)
  const rpy = ry + HANG; // derecho (Soria)

  // Sobres de Madrid: el primero cae en LAND0, el resto en MADRID_EXTRA
  const madridSlots = [
    {dx: -32, dy: 0, at: LAND0, part: 1},
    {dx: 34, dy: 0, at: MADRID_EXTRA[0].at, part: 1},
    {dx: 0, dy: -50, at: MADRID_EXTRA[1].at, part: 1},
    {dx: 0, dy: -100, at: MADRID_EXTRA[2].at, part: 0.78},
  ];

  // Titular: palabra a palabra
  const words = ['¿Dónde', 'pesa', 'más', 'tu', 'voto?'];
  const headOut = interpolate(f, [STAMP - 12, STAMP - 4], [1, 0], clamp);
  const stamp = spring({frame: f - STAMP, fps, config: {damping: 10, stiffness: 240}});

  return (
    <>
      {/* Titular del gancho */}
      <Headline style={{top: 300, fontSize: 104, lineHeight: 1.02, opacity: headOut}}>
        {words.map((w, i) => {
          const s = spring({frame: f - (1 + i * 3), fps, config: {damping: 12, stiffness: 300}});
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: i < words.length - 1 ? 26 : 0,
                opacity: s > 0.02 ? 1 : 0,
                transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`,
                color: w === 'pesa' ? C.burdeos : C.tinta,
              }}
            >
              {w}
            </span>
          );
        })}
      </Headline>

      {/* ×3,8 */}
      {f >= STAMP && (
        <>
          <Headline
            style={{
              top: 270,
              fontSize: 250,
              lineHeight: 1,
              color: C.burdeos,
              fontVariantNumeric: 'lining-nums',
              transform: `scale(${interpolate(stamp, [0, 1], [2.2, 1])}) rotate(${interpolate(stamp, [0, 1], [-6, 0])}deg)`,
              opacity: interpolate(f - STAMP, [0, 2], [0, 1], clamp),
            }}
          >
            ×3,8
          </Headline>
          <Tag text="Dato" delay={STAMP + 6} sound={false} />
        </>
      )}

      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <Rays cx={CX} cy={CY - 40} r0={44} r1={270} n={80} rot={f * 0.12} op={0.5} />
        {/* pie */}
        <path d={`M${CX - 140} 1262 L${CX + 140} 1262 L${CX + 64} 1218 L${CX - 64} 1218 Z`} fill={C.tinta} />
        <rect x={CX - 10} y={CY} width={20} height={1220 - CY} fill={C.tinta} />
        <circle cx={CX} cy={CY - 42} r={22} fill={C.papel} stroke={C.tinta} strokeWidth={4} />
        {/* cruz */}
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.tinta} strokeWidth={13} strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={17} fill={C.dorado} />
        {pan(lx, ly)}
        {pan(rx, ry)}
        {/* sobres */}
        {madridSlots.map((s, i) =>
          f >= s.at - 12 ? (
            <Sobre key={i} x={lx + s.dx} y={lpy + 22 + s.dy + fallY(f, s.at)} part={s.part} />
          ) : null
        )}
        {f >= LAND0 - 12 && <Sobre x={rx} y={rpy + 22 + fallY(f, LAND0)} />}
        {/* nombres */}
        <text x={lx} y={lpy + 140} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={38} letterSpacing={6} fill={C.tinta}>
          MADRID
        </text>
        <text x={rx} y={rpy + 140} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={38} letterSpacing={6} fill={C.burdeos}>
          SORIA
        </text>
      </svg>

      {/* pie explicativo tras equilibrar */}
      <div
        style={{
          position: 'absolute',
          left: 100,
          right: 150,
          top: 1282,
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 34,
          color: C.piedra,
          opacity: interpolate(f, [BALANCED + 6, BALANCED + 14], [0, 1], clamp),
        }}
      >
        1 voto de Soria equilibra 3,8 de Madrid
      </div>

      {/* sonido */}
      <Sfx at={1} src="thump" volume={0.7} />
      <Sfx at={LAND0 - 12} src="drop" volume={0.55} />
      <Sfx at={LAND0} src="clunk" volume={1} />
      <Sfx at={LAND0} src="clack" volume={0.5} />
      {MADRID_EXTRA.map((e) => (
        <React.Fragment key={e.at}>
          <Sfx at={e.at - 10} src="whoosh_soft" volume={0.35} />
          <Sfx at={e.at} src="clack" volume={0.7} />
          <Sfx at={e.at} src="pop" volume={0.4} />
        </React.Fragment>
      ))}
      <Sfx at={BALANCED} src="ding" volume={0.6} />
      <Sfx at={STAMP} src="stamp" volume={0.9} />
      <Sfx at={STAMP} src="thump" volume={0.5} />
    </>
  );
};
