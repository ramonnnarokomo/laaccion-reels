import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS, SERIF} from './brand';
import {clamp} from './ui';

// «Mundo» de los reels (desde el 25/11/2026): personajes con cara sencilla y emociones,
// escenarios con suelo, pared y luz, fichas de fuente, sellos, cámara y subtítulos arriba.
// Siempre genéricos: ningún personaje se parece a una persona real; ningún color de partido.

export const PIEL = ['#F2CFAE', '#E0AE86', '#B97E57', '#8A5A3C', '#5E3C28'];
export const PELO = ['#20201E', '#4A3426', '#7A5A3E', '#A9A196', '#2B2621', '#C9B18A'];
export const ROPA = {
  burdeos: C.burdeos,
  dorado: C.dorado,
  piedra: C.piedra,
  tinta: '#2E2E2B',
  pizarra: '#56606A',
  arena: '#CDBFA5',
  oliva: '#7C7A5E',
  crema: '#E9E0CF',
};
export const SUELO = '#E8DFCF';
export const PARED = '#F1EADD';

const ease = Easing.bezier(0.45, 0, 0.25, 1);

export type Gesto = 'neutral' | 'contento' | 'preocupado' | 'sorpresa' | 'enfadado' | 'duda' | 'serio';
export type PoseP = 'quieto' | 'habla' | 'senala' | 'brazos-arriba' | 'mano' | 'vota' | 'jarras';
export type Pelo = 'corto' | 'largo' | 'calvo' | 'mono' | 'rizado' | 'flequillo';
export type Emote = '?' | '!' | 'sudor' | '…' | null;

// Gesto que cambia con el tiempo: [[fotograma, gesto], ...]
export type Guion<T> = T | Array<[number, T]>;
const enTiempo = <T,>(g: Guion<T>, f: number): T => {
  if (!Array.isArray(g)) return g;
  let v = g[0][1];
  for (const [t, x] of g) if (f >= t) v = x;
  return v;
};

export const Persona: React.FC<{
  x: number;
  y: number; // pies
  h?: number;
  piel?: string;
  pelo?: Pelo;
  peloColor?: string;
  ropa?: string;
  pantalon?: string;
  falda?: boolean;
  acc?: 'corbata' | 'banda' | 'gorro' | 'bufanda' | 'gafas' | null;
  accColor?: string;
  gesto?: Guion<Gesto>;
  pose?: Guion<PoseP>;
  emote?: Guion<Emote>;
  at?: number;
  respira?: boolean;
  semilla?: number;
  mira?: number; // -1 izquierda, 0 frente, 1 derecha (desplaza ojos)
}> = ({
  x,
  y,
  h = 300,
  piel = PIEL[1],
  pelo = 'corto',
  peloColor = PELO[0],
  ropa = ROPA.pizarra,
  pantalon = ROPA.tinta,
  falda,
  acc = null,
  accColor,
  gesto = 'neutral',
  pose = 'quieto',
  emote = null,
  at = 0,
  respira = true,
  semilla = 0,
  mira = 0,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const s = spring({frame: f - at, fps, config: {damping: 13, stiffness: 190}});
  const k = h / 200;
  const g = enTiempo(gesto, f);
  const p = enTiempo(pose, f);
  const e = enTiempo(emote, f);
  const br = respira ? Math.sin((f + semilla * 13) / 14) * 0.012 : 0;
  // parpadeo cada ~3,3 s, desfasado por semilla
  const ciclo = (f + semilla * 37) % 100;
  const parp = ciclo < 3 ? 0.12 : 1;
  const ox = mira * 3.5;
  const manga = ropa;
  const mano = piel;
  const brazo = (d: string, key: string) => (
    <g key={key}>
      <path d={d} stroke={manga} strokeWidth={17} strokeLinecap="round" fill="none" />
    </g>
  );
  // brazos: [hombro -> codo -> mano]
  const habla = Math.sin(f / 5) * 6;
  const R: Record<PoseP, [string, [number, number]]> = {
    quieto: ['M30 -118 Q40 -88 38 -62', [38, -58]],
    habla: [`M30 -118 Q58 -112 ${62 + habla / 2} ${-140 + habla}`, [64 + habla / 2, -146 + habla]],
    senala: ['M30 -118 Q70 -122 104 -128', [110, -129]],
    'brazos-arriba': ['M30 -118 Q46 -150 56 -186', [57, -192]],
    mano: ['M30 -118 Q58 -98 84 -96', [90, -96]],
    vota: ['M30 -118 Q60 -108 80 -82', [84, -78]],
    jarras: ['M30 -118 Q58 -98 34 -80', [32, -80]],
  };
  const L: Record<PoseP, [string, [number, number]]> = {
    quieto: ['M-30 -118 Q-40 -88 -38 -62', [-38, -58]],
    habla: ['M-30 -118 Q-40 -88 -38 -62', [-38, -58]],
    senala: ['M-30 -118 Q-40 -88 -38 -62', [-38, -58]],
    'brazos-arriba': ['M-30 -118 Q-46 -150 -56 -186', [-57, -192]],
    mano: ['M-30 -118 Q-40 -88 -38 -62', [-38, -58]],
    vota: ['M-30 -118 Q-40 -88 -38 -62', [-38, -58]],
    jarras: ['M-30 -118 Q-58 -98 -34 -80', [-32, -80]],
  };
  const [dr, hr] = R[p];
  const [dl, hl] = L[p];
  const cejas = (() => {
    switch (g) {
      case 'preocupado':
        return 'M-15 -173 L-5 -176 M15 -173 L5 -176';
      case 'enfadado':
        return 'M-15 -178 L-5 -174 M15 -178 L5 -174';
      case 'sorpresa':
        return 'M-15 -180 Q-10 -183 -5 -180 M15 -180 Q10 -183 5 -180';
      case 'duda':
        return 'M-15 -178 Q-10 -181 -5 -178 M15 -174 L5 -175';
      case 'serio':
        return 'M-15 -176 L-5 -176 M15 -176 L5 -176';
      default:
        return 'M-15 -177 Q-10 -179 -5 -177 M15 -177 Q10 -179 5 -177';
    }
  })();
  const boca = (() => {
    switch (g) {
      case 'contento':
        return <path d="M-9 -146 Q0 -137 9 -146" stroke={C.tinta} strokeWidth={3} fill="none" strokeLinecap="round" />;
      case 'preocupado':
        return <path d="M-7 -142 Q0 -147 7 -142" stroke={C.tinta} strokeWidth={3} fill="none" strokeLinecap="round" />;
      case 'sorpresa':
        return <ellipse cx={0} cy={-143} rx={4.5} ry={6} fill={C.tinta} />;
      case 'enfadado':
        return <path d="M-7 -143 L7 -143" stroke={C.tinta} strokeWidth={3} strokeLinecap="round" />;
      case 'duda':
        return <path d="M-6 -144 Q2 -146 8 -142" stroke={C.tinta} strokeWidth={3} fill="none" strokeLinecap="round" />;
      default:
        return <path d="M-6 -144 Q0 -141 6 -144" stroke={C.tinta} strokeWidth={3} fill="none" strokeLinecap="round" />;
    }
  })();
  const hablaBoca = p === 'habla' && Math.sin(f / 2.2) > 0.2;
  const peloEl = (() => {
    const c = peloColor;
    switch (pelo) {
      case 'largo':
        return (
          <>
            <path d="M-28 -160 Q-32 -120 -26 -112 L-14 -112 L-16 -160 Z M28 -160 Q32 -120 26 -112 L14 -112 L16 -160 Z" fill={c} />
            <path d="M-28 -158 Q-30 -190 0 -192 Q30 -190 28 -158 Q16 -176 0 -177 Q-18 -176 -28 -158 Z" fill={c} />
          </>
        );
      case 'calvo':
        return <path d="M-27 -160 Q-27 -168 -24 -170 L-22 -158 Z M27 -160 Q27 -168 24 -170 L22 -158 Z" fill={c} />;
      case 'mono':
        return (
          <>
            <circle cx={0} cy={-196} r={11} fill={c} />
            <path d="M-27 -160 Q-29 -190 0 -191 Q29 -190 27 -160 Q14 -178 0 -179 Q-14 -178 -27 -160 Z" fill={c} />
          </>
        );
      case 'rizado':
        return (
          <g fill={c}>
            {[-24, -12, 0, 12, 24].map((dx, i) => (
              <circle key={i} cx={dx} cy={-184 - (i % 2) * 4} r={11} />
            ))}
            <circle cx={-27} cy={-170} r={8} />
            <circle cx={27} cy={-170} r={8} />
          </g>
        );
      case 'flequillo':
        return <path d="M-27 -158 Q-28 -191 0 -192 Q28 -191 27 -158 Q22 -170 10 -168 Q-6 -176 -27 -158 Z" fill={c} />;
      default:
        return <path d="M-27 -160 Q-28 -190 0 -191 Q28 -190 27 -160 Q20 -176 0 -177 Q-20 -176 -27 -160 Z" fill={c} />;
    }
  })();
  const emoteEl = (() => {
    if (!e) return null;
    const pop = spring({frame: f - at - 2, fps, config: {damping: 10, stiffness: 260}});
    if (e === 'sudor')
      return <path d="M26 -184 Q31 -175 31 -170 A5 5 0 0 1 21 -170 Q21 -175 26 -184 Z" fill="#9FB7C9" transform={`translate(0 ${(f % 40) / 4})`} />;
    if (e === '…')
      return (
        <g transform={`translate(30 -228) scale(${pop})`}>
          <rect x={-4} y={-20} width={58} height={34} rx={14} fill="#FFFDF8" stroke={C.tinta} strokeWidth={3} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={11 + i * 14} cy={-3} r={4} fill={C.tinta} opacity={0.35 + 0.65 * ((Math.floor(f / 6) % 3) === i ? 1 : 0)} />
          ))}
        </g>
      );
    return (
      <text x={0} y={-214} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={46} fill={C.burdeos} transform={`scale(${pop})`} style={{transformOrigin: '0px -214px'}}>
        {e}
      </text>
    );
  })();
  return (
    <g transform={`translate(${x} ${y}) scale(${k * s} ${k * s * (1 + br)})`}>
      <ellipse cx={0} cy={2} rx={34} ry={7} fill={C.tinta} opacity={0.12} />
      {/* piernas */}
      {falda ? (
        <>
          <path d="M-12 -46 L-13 -6 M12 -46 L13 -6" stroke={piel} strokeWidth={11} strokeLinecap="round" />
          <path d="M-31 -66 L31 -66 L36 -34 L-36 -34 Z" fill={pantalon} />
        </>
      ) : (
        <path d="M-13 -66 L-14 -6 M13 -66 L14 -6" stroke={pantalon} strokeWidth={17} strokeLinecap="round" />
      )}
      <path d="M-24 -2 L-6 -2 M6 -2 L24 -2" stroke={C.tinta} strokeWidth={8} strokeLinecap="round" />
      {/* brazo izquierdo (detrás) */}
      {brazo(dl, 'l')}
      <circle cx={hl[0]} cy={hl[1]} r={7.5} fill={mano} />
      {/* torso */}
      <path d="M-33 -112 Q-36 -128 -20 -130 L20 -130 Q36 -128 33 -112 L30 -60 Q0 -54 -30 -60 Z" fill={ropa} />
      <path d="M-9 -130 L0 -112 L9 -130 Z" fill="#FBF8F2" />
      {acc === 'corbata' && <path d="M0 -122 L-5 -114 L0 -82 L5 -114 Z" fill={accColor ?? C.burdeos} />}
      {acc === 'banda' && <path d="M-30 -126 L-19 -130 L31 -66 L21 -58 Z" fill={accColor ?? C.dorado} />}
      {acc === 'bufanda' && <path d="M-16 -132 Q0 -122 16 -132 L16 -124 Q0 -114 -16 -124 Z M6 -124 L12 -98 L4 -98 Z" fill={accColor ?? C.burdeos} />}
      {/* brazo derecho */}
      {brazo(dr, 'r')}
      <circle cx={hr[0]} cy={hr[1]} r={7.5} fill={mano} />
      {p === 'vota' && <rect x={hr[0] - 8} y={hr[1] - 30} width={24} height={30} rx={2} fill="#FFFDF8" stroke={C.tinta} strokeWidth={2.5} transform={`rotate(-10 ${hr[0]} ${hr[1]})`} />}
      {/* cuello y cabeza */}
      <rect x={-6} y={-138} width={12} height={10} fill={piel} />
      <circle cx={-26} cy={-158} r={5} fill={piel} />
      <circle cx={26} cy={-158} r={5} fill={piel} />
      <circle cx={0} cy={-160} r={27} fill={piel} />
      {peloEl}
      {acc === 'gorro' && <path d="M-28 -170 Q0 -214 28 -170 Z M-30 -170 L30 -170 L30 -162 L-30 -162 Z" fill={accColor ?? C.burdeos} />}
      {/* cara */}
      <path d={cejas} stroke={C.tinta} strokeWidth={2.6} strokeLinecap="round" fill="none" opacity={0.85} />
      <g transform={`translate(${ox} 0)`}>
        <ellipse cx={-9} cy={-162} rx={3.4} ry={(g === 'sorpresa' ? 4.6 : 3.6) * parp} fill={C.tinta} />
        <ellipse cx={9} cy={-162} rx={3.4} ry={(g === 'sorpresa' ? 4.6 : 3.6) * parp} fill={C.tinta} />
      </g>
      {acc === 'gafas' && (
        <g stroke={C.tinta} strokeWidth={2.4} fill="none">
          <circle cx={-9} cy={-162} r={8} />
          <circle cx={9} cy={-162} r={8} />
          <path d="M-1 -162 L1 -162" />
        </g>
      )}
      <circle cx={-15} cy={-150} r={4} fill="#E58C7A" opacity={g === 'contento' ? 0.35 : 0.15} />
      <circle cx={15} cy={-150} r={4} fill="#E58C7A" opacity={g === 'contento' ? 0.35 : 0.15} />
      {hablaBoca ? <ellipse cx={0} cy={-144} rx={5} ry={3.8} fill={C.tinta} /> : boca}
      {emoteEl}
    </g>
  );
};

// Escenario: pared, suelo y luz. Todo semitransparente para que se vea el grano del papel.
export const Sala: React.FC<{
  suelo?: number; // y de la línea del suelo
  pared?: string;
  piso?: string;
  ventana?: number[]; // x de ventanas
  lampara?: number[]; // x de lámparas colgantes
  zocalo?: boolean;
}> = ({suelo = 1180, pared = PARED, piso = SUELO, ventana = [], lampara = [], zocalo = true}) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <rect x={-900} y={-900} width={2880} height={suelo + 900} fill={pared} opacity={0.85} />
      {zocalo && <rect x={-900} y={suelo - 60} width={2880} height={60} fill={C.tarjeta} opacity={0.9} />}
      {zocalo && <line x1={-900} y1={suelo - 60} x2={1980} y2={suelo - 60} stroke={C.tinta} strokeWidth={2} opacity={0.25} />}
      <rect x={-900} y={suelo} width={2880} height={1800} fill={piso} opacity={0.9} />
      <line x1={-900} y1={suelo} x2={1980} y2={suelo} stroke={C.tinta} strokeWidth={3} opacity={0.55} />
      {ventana.map((vx, i) => (
        <g key={i} transform={`translate(${vx} ${suelo - 520})`}>
          <rect x={-90} y={0} width={180} height={230} fill="#DCE3E3" stroke={C.tinta} strokeWidth={4} />
          <path d="M0 0 V230 M-90 115 H90" stroke={C.tinta} strokeWidth={3} />
          <rect x={-104} y={230} width={208} height={14} fill={C.tarjeta} stroke={C.tinta} strokeWidth={3} />
        </g>
      ))}
      {lampara.map((lx, i) => {
        const sw = Math.sin((f + i * 20) / 30) * 1.5;
        return (
          <g key={i} transform={`rotate(${sw} ${lx} 420)`}>
            <line x1={lx} y1={420} x2={lx} y2={540} stroke={C.tinta} strokeWidth={3} />
            <path d={`M${lx - 46} 590 L${lx - 22} 540 L${lx + 22} 540 L${lx + 46} 590 Z`} fill={C.tinta} />
            <ellipse cx={lx} cy={600} rx={120} ry={60} fill={C.dorado} opacity={0.12} />
          </g>
        );
      })}
    </svg>
  );
};

// Halo cálido detrás del protagonista
export const Halo: React.FC<{x: number; y: number; r?: number; at?: number; op?: number}> = ({x, y, r = 300, at = 0, op = 0.35}) => {
  const f = useCurrentFrame();
  const o = interpolate(f - at, [0, 12], [0, op], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${C.dorado} 0%, rgba(165,140,97,0.35) 35%, rgba(165,140,97,0) 70%)`,
        opacity: o,
      }}
    />
  );
};

// Ficha de dato con fuente: barrita burdeos, etiqueta, dato y fuente
export const Ficha: React.FC<{
  x: number;
  y: number;
  w?: number;
  at: number;
  etiqueta: string;
  dato: string;
  fuente?: string;
  align?: 'left' | 'center';
}> = ({x, y, w = 620, at, etiqueta, dato, fuente, align = 'left'}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = interpolate(f - at, [0, 6], [0, 1], clamp);
  const dy = interpolate(f - at, [0, 8], [24, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'center' ? x - w / 2 : x,
        top: y,
        width: w,
        opacity: o,
        transform: `translateY(${dy}px)`,
        background: '#FFFDF8',
        borderLeft: `8px solid ${C.burdeos}`,
        boxShadow: '0 6px 18px rgba(32,32,30,0.12)',
        padding: '16px 22px 16px 22px',
        fontFamily: SANS,
      }}
    >
      <div style={{fontSize: 24, fontWeight: 700, letterSpacing: '0.14em', color: C.burdeos, textTransform: 'uppercase'}}>{etiqueta}</div>
      <div style={{fontSize: 34, fontWeight: 600, color: C.tinta, lineHeight: 1.22, marginTop: 6}}>{dato}</div>
      {fuente && <div style={{fontSize: 26, fontWeight: 500, color: C.piedra, marginTop: 8}}>{fuente}</div>}
    </div>
  );
};

// Sello torcido que golpea
export const Sello: React.FC<{x: number; y: number; at: number; texto: string; rot?: number; size?: number; color?: string}> = ({
  x,
  y,
  at,
  texto,
  rot = -8,
  size = 78,
  color = C.burdeos,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f - at, [0, 5], [1.7, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const o = interpolate(f - at, [0, 3], [0, 0.95], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${k})`,
        opacity: o,
        border: `7px solid ${color}`,
        borderRadius: 10,
        padding: '6px 26px',
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '0.06em',
        color,
        whiteSpace: 'nowrap',
        background: 'rgba(250,247,241,0.6)',
      }}
    >
      {texto}
    </div>
  );
};

// Cámara: [fotograma, escala, x, y] (x, y: punto del lienzo que queda en el centro)
export const Camara: React.FC<{keys: Array<[number, number, number, number]>; children: React.ReactNode}> = ({keys, children}) => {
  const f = useCurrentFrame();
  const fr = keys.map((k) => k[0]);
  const v = (i: number) =>
    keys.length === 1 ? keys[0][i] : interpolate(f, fr, keys.map((k) => k[i]), {...clamp, easing: ease});
  const sc = v(1);
  const cx = v(2);
  const cy = v(3);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: '0 0',
        transform: `translate(${540 - cx * sc}px, ${960 - cy * sc}px) scale(${sc})`,
      }}
    >
      {children}
    </div>
  );
};

// Fundido corto de entrada de escena (~80–100 ms)
export const Fundido: React.FC<{children: React.ReactNode; n?: number}> = ({children, n = 3}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', inset: 0, opacity: interpolate(f, [0, n], [0, 1], clamp)}}>{children}</div>;
};

// Aparición con muelle de cualquier elemento SVG/HTML
export const Pop: React.FC<{at: number; x: number; y: number; children: React.ReactNode; svg?: boolean}> = ({at, x, y, children, svg}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 220}});
  if (svg) return <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>{children}</g>;
  return <div style={{position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: `scale(${s})`}}>{children}</div>;
};

// ---------- Subtítulos arriba ----------
// Líneas cortas que se sustituyen. Palabra a palabra; lo dicho en piedra; la clave en burdeos con caja de selección.
// Token «116|ciento-dieciséis»: se muestra 116 y pesa como «ciento dieciséis».
export type Linea = {from: number; to: number; words: Array<{w: string; t: number; em: boolean}>};

const silabas = (s: string) => {
  const t = s.toLowerCase().replace(/[^a-záéíóúüñ ]/g, ' ');
  let c = 0;
  for (const w of t.split(/\s+/).filter(Boolean)) {
    const w2 = w.replace(/[iu](?=[aeoáéó])|(?<=[aeoáéó])[iuy](?![aeiouáéíóú])/g, '');
    c += Math.max(1, (w2.match(/[aeiouáéíóúü]+/g) || []).length);
  }
  return c;
};

export const construyeLineas = (from: number, to: number, spec: string): Linea[] => {
  const lines = spec.split('/').map((l) => l.trim());
  type T = {w: string; em: boolean; peso: number; line: number};
  const toks: T[] = [];
  let em = false;
  lines.forEach((l, li) =>
    l.split(/\s+/).forEach((raw) => {
      let w = raw;
      let spoken = '';
      if (w.includes('|')) {
        const [a, b] = w.split('|');
        w = a;
        spoken = b.replace(/-/g, ' ');
      }
      const st = w.startsWith('*');
      if (st) {
        em = true;
        w = w.slice(1);
      }
      const en = /\*[.,:?!…]*$/.test(w);
      w = w.replace(/\*/g, '');
      toks.push({w, em, peso: silabas(spoken || w) + 0.4, line: li});
      if (en) em = false;
    }),
  );
  const total = toks.reduce((a, t) => a + t.peso, 0);
  let acc = 0;
  const timed = toks.map((t) => {
    const tt = from + ((to - from) * acc) / total;
    acc += t.peso;
    return {...t, t: tt};
  });
  return lines.map((_, li) => {
    const ws = timed.filter((t) => t.line === li);
    return {from: ws[0].t, to: 0, words: ws.map((w) => ({w: w.w, t: w.t, em: w.em}))};
  });
};

export const SubtitulosArriba: React.FC<{lineas: Linea[]; top?: number}> = ({lineas, top = 336}) => {
  const f = useCurrentFrame();
  const cur = [...lineas].reverse().find((l) => f >= l.from && f < l.to);
  if (!cur) return null;
  const out = interpolate(f, [cur.to - 3, cur.to], [1, 0], clamp);
  // agrupar palabras clave contiguas en una caja
  const grupos: Array<{em: boolean; ws: typeof cur.words}> = [];
  cur.words.forEach((w) => {
    const g = grupos[grupos.length - 1];
    if (g && g.em === w.em && w.em) g.ws.push(w);
    else grupos.push({em: w.em, ws: [w]});
  });
  const last = cur.words.filter((w) => f >= w.t).slice(-1)[0];
  const word = (w: (typeof cur.words)[number], i: number) => {
    const k = f - w.t;
    const o = interpolate(k, [0, 3], [0, 1], clamp);
    const bl = interpolate(k, [0, 3], [6, 0], clamp);
    const col = w.em ? C.burdeos : w === last ? C.tinta : C.piedra;
    return (
      <span key={i} style={{display: 'inline-block', marginRight: '0.24em', opacity: o, filter: `blur(${bl}px)`, color: col}}>
        {w.w}
      </span>
    );
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        top,
        textAlign: 'center',
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 60,
        lineHeight: 1.15,
        opacity: out,
      }}
    >
      {grupos.map((g, gi) => {
        if (!g.em) return <React.Fragment key={gi}>{g.ws.map(word)}</React.Fragment>;
        const shown = f >= g.ws[0].t;
        const bo = interpolate(f - g.ws[g.ws.length - 1].t, [2, 6], [0, 1], clamp);
        return (
          <span key={gi} style={{position: 'relative', display: 'inline-block', marginRight: '0.24em', padding: '0 0.12em'}}>
            {g.ws.map((w, i) => (
              <React.Fragment key={i}>{word(w, i)}</React.Fragment>
            ))}
            {shown && (
              <span style={{position: 'absolute', left: -4, right: 4, top: 2, bottom: 0, border: `3px solid ${C.burdeos}`, opacity: bo, pointerEvents: 'none'}}>
                {[
                  [0, 0],
                  [1, 0],
                  [0, 1],
                  [1, 1],
                ].map(([a, b], j) => (
                  <span key={j} style={{position: 'absolute', width: 11, height: 11, borderRadius: 6, background: C.burdeos, left: a ? 'auto' : -7, right: a ? -7 : 'auto', top: b ? 'auto' : -7, bottom: b ? -7 : 'auto'}} />
                ))}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Cierre con el sol del logo girando (gustó en el piloto; usar en bastantes vídeos, no en todos) ----------
export const OutroSol: React.FC<{cx?: number; cy?: number; r?: number; logoW?: number; at?: number}> = ({cx = 540, cy = 720, r = 270, logoW = 540, at = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f - at;
  if (t < 0) return null;
  const s = spring({frame: t, fps, config: {damping: 14, stiffness: 120}});
  const n = 72;
  const rot = t * 0.35;
  return (
    <>
      <div style={{position: 'absolute', left: cx - r * 1.5, top: cy - r * 1.5, width: r * 3, height: r * 3, borderRadius: '50%', background: `radial-gradient(circle, rgba(165,140,97,0.30) 0%, rgba(165,140,97,0) 62%)`, opacity: s}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${cx} ${cy}) scale(${interpolate(s, [0, 1], [0.7, 1])})`} opacity={s}>
          <g transform={`rotate(${rot})`}>
            {Array.from({length: n}).map((_, i) => {
              const a = (i / n) * Math.PI * 2;
              const largo = i % 2 === 0;
              const r0 = r * 0.8;
              const r1 = largo ? r : r * 0.92;
              return <line key={i} x1={r0 * Math.cos(a)} y1={r0 * Math.sin(a)} x2={r1 * Math.cos(a)} y2={r1 * Math.sin(a)} stroke={C.dorado} strokeWidth={largo ? 4.5 : 3} strokeLinecap="round" opacity={0.85} />;
            })}
          </g>
          <circle r={r * 1.1} fill="none" stroke={C.dorado} strokeWidth={3.5} strokeDasharray="6 14" transform={`rotate(${-rot * 0.6})`} opacity={0.75} />
          <circle r={r * 1.22} fill="none" stroke={C.dorado} strokeWidth={2.5} opacity={0.5} />
          <circle r={r * 0.74} fill="#FAF7F1" opacity={0.92} />
        </g>
      </svg>
      <Img src={staticFile('img/logo.png')} style={{position: 'absolute', left: cx - logoW / 2, top: cy - logoW / 6, width: logoW, opacity: interpolate(t, [4, 12], [0, 1], clamp), transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`}} />
    </>
  );
};
