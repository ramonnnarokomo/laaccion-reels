import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS, SERIF} from './brand';

// Monigotes y objetos de LA ACCIÓN: línea fina, planos de color, sin caras.
// Nunca representan a una persona real reconocible: son papeles (diputado, presidente, ciudadana...).

export type Accesorio = 'ninguno' | 'corbata' | 'banda' | 'maletin' | 'papeleta';
export type Pose = 'quieto' | 'habla' | 'brazos-arriba' | 'senala';

export const Monigote: React.FC<{
  x: number;
  y: number; // pies
  h?: number; // altura total en px
  color?: string;
  acc?: Accesorio;
  pose?: Pose;
  at?: number; // fotograma de entrada (pop)
  bob?: boolean;
  label?: string;
  labelColor?: string;
  flip?: boolean;
}> = ({x, y, h = 220, color = C.tinta, acc = 'ninguno', pose = 'quieto', at = 0, bob = true, label, labelColor, flip}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 11, stiffness: 220}});
  if (f < at) return null;
  const k = h / 200;
  const dy = bob ? Math.sin((f - at) / 9) * 2.2 : 0;
  const armR =
    pose === 'habla'
      ? 'M30 -108 L62 -150'
      : pose === 'brazos-arriba'
      ? 'M30 -108 L58 -168'
      : pose === 'senala'
      ? 'M30 -108 L96 -118'
      : 'M30 -108 L40 -50';
  const armL = pose === 'brazos-arriba' ? 'M-30 -108 L-58 -168' : 'M-30 -108 L-40 -50';
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${k * s * (flip ? -1 : 1)} ${k * s})`}>
      {/* piernas */}
      <path d="M-14 -34 L-18 0 M14 -34 L18 0" stroke={color} strokeWidth={15} strokeLinecap="round" fill="none" />
      {/* brazos */}
      <path d={`${armL} ${armR}`} stroke={color} strokeWidth={13} strokeLinecap="round" fill="none" />
      {/* cuerpo */}
      <path d="M-34 -112 Q-38 -126 -22 -128 L22 -128 Q38 -126 34 -112 L28 -30 Q0 -22 -28 -30 Z" fill={color} />
      {/* cabeza */}
      <circle cx={0} cy={-156} r={25} fill={color} />
      {acc === 'corbata' && <path d="M0 -126 L-7 -112 L0 -74 L7 -112 Z" fill={C.burdeos} />}
      {acc === 'banda' && <path d="M-30 -122 L-18 -126 L30 -52 L20 -44 Z" fill={C.dorado} />}
      {acc === 'maletin' && <rect x={30} y={-56} width={34} height={26} rx={3} fill={C.burdeos} />}
      {acc === 'papeleta' && <rect x={52} y={-178} width={30} height={40} fill="#fff" stroke={C.tinta} strokeWidth={3} />}
      {label && (
        <text
          x={0}
          y={34}
          transform={flip ? 'scale(-1 1)' : undefined}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={700}
          fontSize={26}
          letterSpacing={3}
          fill={labelColor ?? color}
        >
          {label}
        </text>
      )}
    </g>
  );
};

// Multitud que aparece en ola (la población, los electores...)
export const Multitud: React.FC<{
  x0: number;
  y0: number;
  cols: number;
  rows: number;
  gap: number;
  h: number;
  at: number;
  every?: number;
  color?: (i: number) => string;
}> = ({x0, y0, cols, rows, gap, h, at, every = 0.8, color}) => (
  <>
    {Array.from({length: cols * rows}).map((_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      return (
        <Monigote
          key={i}
          x={x0 + c * gap + (r % 2) * (gap / 2)}
          y={y0 + r * gap * 0.9}
          h={h}
          color={color ? color(i) : C.piedra}
          at={at + (c + r) * every}
          bob={false}
        />
      );
    })}
  </>
);

// Bocadillo de diálogo con cola hacia (tx, ty)
export const Bocadillo: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  tx: number;
  ty: number;
  at: number;
  children: React.ReactNode;
}> = ({x, y, w, h, tx, ty, at, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 200}});
  if (f < at) return null;
  const bx = Math.min(Math.max(tx, x + 60), x + w - 60);
  return (
    <div style={{position: 'absolute', inset: 0, transformOrigin: `${tx}px ${ty}px`, transform: `scale(${s})`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path
          d={`M${x + 24} ${y} H${x + w - 24} Q${x + w} ${y} ${x + w} ${y + 24} V${y + h - 24} Q${x + w} ${y + h} ${x + w - 24} ${y + h} H${bx + 34} L${tx} ${ty} L${bx - 10} ${y + h} H${x + 24} Q${x} ${y + h} ${x} ${y + h - 24} V${y + 24} Q${x} ${y} ${x + 24} ${y} Z`}
          fill="#FFFDF8"
          stroke={C.tinta}
          strokeWidth={4}
        />
      </svg>
      <div style={{position: 'absolute', left: x + 40, top: y + 30, width: w - 80, height: h - 60}}>{children}</div>
    </div>
  );
};

// Edificio institucional genérico (frontón y columnas), en línea
export const Edificio: React.FC<{x: number; y: number; w: number; label?: string; at?: number}> = ({
  x,
  y,
  w,
  label,
  at = 0,
}) => {
  const f = useCurrentFrame();
  const draw = interpolate(f - at, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const h = w * 0.55;
  const cols = 6;
  const colW = w * 0.06;
  const top = y - h;
  const ped = w * 0.16;
  return (
    <g opacity={draw > 0 ? 1 : 0} strokeDasharray={4000} strokeDashoffset={4000 * (1 - draw)}>
      <path d={`M${x - w / 2} ${top + ped} L${x} ${top} L${x + w / 2} ${top + ped} Z`} fill="none" stroke={C.tinta} strokeWidth={4} />
      <line x1={x - w / 2} y1={top + ped + 10} x2={x + w / 2} y2={top + ped + 10} stroke={C.tinta} strokeWidth={4} />
      {Array.from({length: cols}).map((_, i) => {
        const cx = x - w / 2 + w * 0.1 + (i * (w * 0.8)) / (cols - 1);
        return <rect key={i} x={cx - colW / 2} y={top + ped + 18} width={colW} height={h - ped - 40} fill="none" stroke={C.tinta} strokeWidth={3} />;
      })}
      <line x1={x - w / 2 - 10} y1={y - 14} x2={x + w / 2 + 10} y2={y - 14} stroke={C.tinta} strokeWidth={4} />
      <line x1={x - w / 2 - 24} y1={y} x2={x + w / 2 + 24} y2={y} stroke={C.tinta} strokeWidth={4} />
      <circle cx={x} cy={top + ped * 0.62} r={ped * 0.18} fill="none" stroke={C.dorado} strokeWidth={3} />
      {label && (
        <text x={x} y={y + 50} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} letterSpacing={8} fill={C.tinta}>
          {label}
        </text>
      )}
    </g>
  );
};

export const Comillas: React.FC<{x: number; y: number; size?: number}> = ({x, y, size = 240}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: SERIF, fontSize: size, lineHeight: 1, color: C.dorado, opacity: 0.55}}>
    «
  </div>
);
