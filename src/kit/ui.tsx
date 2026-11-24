import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, SANS, SERIF, SFX_GAIN, miles} from './brand';
export type SubItem = {from: number; to: number; text: string; speakEnd?: number};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Paper: React.FC = () => (
  <AbsoluteFill style={{background: C.papel}}>
    <AbsoluteFill
      style={{
        background:
          'repeating-linear-gradient(90deg, transparent 0 359px, rgba(32,32,30,.035) 359px 360px)',
      }}
    />
    <Img src={staticFile('img/grano.png')} style={{position: 'absolute', inset: 0, width: 1080, height: 1920}} />
  </AbsoluteFill>
);

// Un efecto de sonido que suena en el fotograma `at` (relativo a la escena)
export const Sfx: React.FC<{at: number; src: string; volume?: number; dur?: number}> = ({
  at,
  src,
  volume = 1,
  dur = 60,
}) => (
  <Sequence from={Math.round(at)} durationInFrames={dur} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume * SFX_GAIN} />
  </Sequence>
);

export const Header: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 190,
      left: 100,
      right: 100,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 26,
      letterSpacing: '.22em',
      color: C.piedra,
      textTransform: 'uppercase',
    }}
  >
    <span>
      <b style={{color: C.tinta, fontWeight: 700}}>La Acción</b> · Haz la cuenta
    </span>
    <span>29N</span>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: -18, height: 2, background: C.dorado}} />
  </div>
);

// Etiqueta que dice qué es cada escena (dato, regla, objeción...). Entra como un sello.
export const Tag: React.FC<{text: string; delay?: number; sound?: boolean}> = ({text, delay = 0, sound = true}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 11, stiffness: 220}});
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 290,
          left: 100,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: '.2em',
          color: C.burdeos,
          border: `3px solid ${C.burdeos}`,
          padding: '10px 18px',
          textTransform: 'uppercase',
          transform: `scale(${interpolate(s, [0, 1], [1.7, 1])}) rotate(${interpolate(s, [0, 1], [-5, -1.2])}deg)`,
          transformOrigin: 'left center',
          opacity: interpolate(f - delay, [0, 2], [0, 1], clamp),
        }}
      >
        {text}
      </div>
      {sound && <Sfx at={delay} src="stamp" volume={0.55} />}
    </>
  );
};

// Entrada de cada escena
export const SceneIn: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6], [0, 1], clamp);
  const y = interpolate(f, [0, 8], [36, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{opacity: o, transform: `translateY(${y}px)`}}>{children}</AbsoluteFill>;
};

// Aparece y sube un poco
export const Rise: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number}> = ({
  at,
  children,
  style,
  dy = 24,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f - at, [0, 7], [0, 1], clamp);
  const y = interpolate(f - at, [0, 9], [dy, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return <div style={{position: 'absolute', opacity: o, transform: `translateY(${y}px)`, ...style}}>{children}</div>;
};

// Texto que se escribe letra a letra, con tecla
export const Typed: React.FC<{text: string; at: number; every?: number; style?: React.CSSProperties; sound?: boolean}> = ({
  text,
  at,
  every = 2,
  style,
  sound = true,
}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) / every) + 1));
  const chars = text.split('');
  return (
    <>
      <div style={{position: 'absolute', ...style}}>
        {chars.map((c, i) => (
          <span key={i} style={{opacity: i < n ? 1 : 0}}>
            {c}
          </span>
        ))}
      </div>
      {sound &&
        chars.map((c, i) => (c.trim() ? <Sfx key={i} at={at + i * every} src="key" volume={0.5} dur={6} /> : null))}
    </>
  );
};

// Contador que sube hasta `to` y suena como un rodillo
export const Counter: React.FC<{to: number; from: number; until: number; style?: React.CSSProperties}> = ({
  to,
  from,
  until,
  style,
}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [from, until], [0, to], {...clamp, easing: Easing.out(Easing.cubic)});
  const ticks = [];
  for (let k = from; k < until - 4; k += 3) ticks.push(<Sfx key={k} at={k} src="tick" volume={0.45} dur={4} />);
  return (
    <>
      <div style={{position: 'absolute', opacity: f >= from ? 1 : 0, fontVariantNumeric: 'tabular-nums lining-nums', ...style}}>
        {miles(v)}
      </div>
      {ticks}
      <Sfx at={until + 1} src="ding" volume={0.55} />
    </>
  );
};

// Puntos que aparecen uno a uno (escaños, personas...)
export const Dots: React.FC<{
  n: number;
  cols: number;
  x0: number;
  y0: number;
  step: number;
  r: number;
  color: string;
  at: number;
  every: number;
  sound?: string;
}> = ({n, cols, x0, y0, step, r, color, at, every, sound = 'tick'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: n}).map((_, i) => {
          const s = spring({frame: f - (at + i * every), fps, config: {damping: 10, stiffness: 260}});
          return (
            <circle
              key={i}
              cx={x0 + (i % cols) * step}
              cy={y0 + Math.floor(i / cols) * step}
              r={r * s}
              fill={color}
            />
          );
        })}
      </svg>
      {Array.from({length: n}).map((_, i) => (
        <Sfx key={i} at={at + i * every} src={sound} volume={sound === 'pop' ? 0.7 : 0.5} dur={8} />
      ))}
    </>
  );
};

// Peso hablado de una palabra (sílabas aprox.; las cifras se leen largas)
const peso = (w: string) => {
  const d = (w.match(/[0-9]/g) || []).length;
  if (d) return Math.max(2, d * 1.4);
  return Math.max(1, (w.toLowerCase().match(/[aeiouáéíóúü]+/g) || []).length);
};

// Subtítulos palabra a palabra: cada palabra entra cuando se dice (reparto por sílabas
// entre `from` y `speakEnd`); "/" separa líneas y *texto* va en burdeos.
export const Subtitles: React.FC<{items: SubItem[]}> = ({items}) => {
  const f = useCurrentFrame();
  const cur = items.find((it) => f >= it.from && f < it.to);
  if (!cur) return null;
  const end = cur.speakEnd ?? cur.to;
  type W = {w: string; em: boolean; line: number};
  const words: W[] = [];
  let em = false;
  cur.text.split('/').forEach((line, li) => {
    line.trim().split(/\s+/).forEach((raw) => {
      let w = raw;
      const starts = w.startsWith('*');
      if (starts) { em = true; w = w.slice(1); }
      const ends = w.endsWith('*') || /\*[.,:?!]$/.test(w);
      w = w.replace(/\*/g, '');
      words.push({w, em, line: li});
      if (ends) em = false;
    });
  });
  const total = words.reduce((a, x) => a + peso(x.w), 0);
  let acc = 0;
  const times = words.map((x) => {
    const t = cur.from + ((end - cur.from) * acc) / total;
    acc += peso(x.w);
    return t;
  });
  const lines = Array.from(new Set(words.map((x) => x.line)));
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 150,
        top: 1335,
        textAlign: 'center',
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 54,
        lineHeight: 1.2,
        letterSpacing: '-0.005em',
      }}
    >
      {lines.map((li) => (
        <div key={li}>
          {words.map((x, i) => {
            if (x.line !== li) return null;
            const k = f - times[i];
            const o = interpolate(k, [0, 2], [0, 1], clamp);
            const sc = interpolate(k, [0, 4], [0.7, 1], {...clamp, easing: Easing.out(Easing.back(2.2))});
            return (
              <span
                key={i}
                style={{display: 'inline-block', marginRight: '0.26em', opacity: o, transform: `scale(${sc})`, color: x.em ? C.burdeos : C.tinta}}
              >
                {x.w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Rays: React.FC<{cx: number; cy: number; r0: number; r1: number; n: number; rot?: number; op?: number}> = ({
  cx,
  cy,
  r0,
  r1,
  n,
  rot = 0,
  op = 0.55,
}) => (
  <g opacity={op} transform={`rotate(${rot} ${cx} ${cy})`}>
    {Array.from({length: n}).map((_, i) => {
      const a = (i / n) * Math.PI * 2;
      const long = i % 2 === 0;
      const rr = long ? r1 : r1 * 0.72;
      return (
        <line
          key={i}
          x1={cx + r0 * Math.cos(a)}
          y1={cy + r0 * Math.sin(a)}
          x2={cx + rr * Math.cos(a)}
          y2={cy + rr * Math.sin(a)}
          stroke={C.dorado}
          strokeWidth={long ? 1.6 : 1}
        />
      );
    })}
  </g>
);

export const Headline: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 90,
      right: 90,
      textAlign: 'center',
      fontFamily: SERIF,
      fontWeight: 700,
      color: C.tinta,
      ...style,
    }}
  >
    {children}
  </div>
);
