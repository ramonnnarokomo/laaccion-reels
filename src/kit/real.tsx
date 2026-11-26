import React from 'react';
import {Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, SANS, SERIF} from './brand';
import {clamp} from './ui';

// «Real» (26/11/2026): piezas para anclar el vídeo a la realidad y darle fluidez.
// Fotos solo de edificios, lugares, objetos y documentos, con licencia libre o de dominio
// público y con crédito. Nunca fotos de personas, de prensa ni capturas con derechos.

const popIn = (f: number, at: number) => ({
  k: interpolate(f - at, [0, 7], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(1.6))}),
  o: interpolate(f - at, [0, 4], [0, 1], clamp),
});
const salida = (f: number, out?: number) =>
  out === undefined
    ? {o: 1, blur: 0}
    : {o: interpolate(f - out, [0, 8], [1, 0], clamp), blur: interpolate(f - out, [0, 8], [0, 8], clamp)};

// Rotulador: rectángulo amarillo que se dibuja de izquierda a derecha entre `from` y `to`.
export type Marca = {x: number; y: number; w: number; h: number; from: number; to: number};
export const Subrayado: React.FC<{m: Marca; color?: string}> = ({m, color = '#F3D27A'}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [m.from, m.to], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: m.x,
        top: m.y,
        width: m.w * p,
        height: m.h,
        background: color,
        opacity: 0.55,
        mixBlendMode: 'multiply',
        borderRadius: 4,
      }}
    />
  );
};

// Foto (o clip) real en tarjeta, con pie en versalitas, destello de entrada y Ken Burns lento.
export const FotoReal: React.FC<{
  src: string; // ruta dentro de public/
  pie: string; // «TRIBUNAL CONSTITUCIONAL · MADRID»
  x: number; // centro
  y: number; // borde superior
  w?: number;
  h?: number;
  at: number;
  out?: number;
  dur?: number; // fotogramas del Ken Burns (por defecto 150)
  credito?: string; // «Foto: Autor · CC BY-SA 4.0 · Wikimedia Commons»
  video?: boolean;
  zoom?: [number, number]; // escala inicial y final de la imagen
  foco?: [number, number]; // punto de anclaje del zoom, en % (50,50 = centro)
  rot?: number;
  marcas?: Marca[]; // subrayados en coordenadas de la tarjeta
  fit?: 'cover' | 'contain';
}> = ({src, pie, x, y, w = 760, h = 500, at, out, dur = 150, credito, video, zoom = [1, 1.08], foco = [50, 50], rot = 0, marcas = [], fit = 'cover'}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  if (out !== undefined && f > out + 8) return null;
  const {k, o} = popIn(f, at);
  const s = salida(f, out);
  const kb = interpolate(f - at, [0, dur], zoom, {...clamp, easing: Easing.inOut(Easing.sin)});
  const flash = interpolate(f - at, [0, 2, 7], [0.75, 0.75, 0], clamp);
  const media: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: fit,
    transform: `scale(${kb})`,
    transformOrigin: `${foco[0]}% ${foco[1]}%`,
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y,
        width: w,
        opacity: o * s.o,
        filter: s.blur ? `blur(${s.blur}px)` : undefined,
        transform: `scale(${k}) rotate(${rot}deg)`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: w,
          height: h,
          borderRadius: 22,
          overflow: 'hidden',
          border: '7px solid #FFFDF8',
          boxShadow: '0 18px 40px rgba(32,32,30,0.28), 0 3px 8px rgba(32,32,30,0.18)',
          background: '#DDD5C7',
        }}
      >
        {video ? <OffthreadVideo src={staticFile(src)} muted style={media} /> : <Img src={staticFile(src)} style={media} />}
        {marcas.map((m, i) => (
          <Subrayado key={i} m={m} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '44px 24px 18px',
            background: 'linear-gradient(rgba(20,20,18,0), rgba(20,20,18,0.78))',
            color: '#FFFDF8',
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: '0.12em',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          {pie}
        </div>
        <div style={{position: 'absolute', inset: 0, background: '#FFFFFF', opacity: flash}} />
      </div>
      {credito && (
        <div style={{marginTop: 10, textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.piedra}}>{credito}</div>
      )}
    </div>
  );
};

// Recorte de documento o noticia: medio, fecha y cita en serif con subrayado sincronizado.
// `texto` se escribe con [[corchetes dobles]] en lo que se subraya; `marcasEn` da el
// [from, to] de cada tramo subrayado, en orden.
export const Recorte: React.FC<{
  x: number;
  y: number;
  w?: number;
  at: number;
  out?: number;
  medio: string; // «BOE n.º 311» · «Constitución, art. 159»
  fecha?: string;
  texto: string;
  marcasEn?: Array<[number, number]>;
  rot?: number;
  size?: number;
}> = ({x, y, w = 780, at, out, medio, fecha, texto, marcasEn = [], rot = -1.2, size = 36}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  if (out !== undefined && f > out + 8) return null;
  const {k, o} = popIn(f, at);
  const s = salida(f, out);
  const trozos = texto.split(/(\[\[.*?\]\])/g).filter(Boolean);
  let n = 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y,
        width: w,
        opacity: o * s.o,
        filter: s.blur ? `blur(${s.blur}px)` : undefined,
        transform: `scale(${k}) rotate(${rot}deg)`,
        background: '#FFFDF8',
        borderTop: `9px solid ${C.burdeos}`,
        boxShadow: '0 16px 34px rgba(32,32,30,0.2)',
        padding: '22px 30px 28px',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: SANS}}>
        <span style={{fontWeight: 800, fontSize: 28, letterSpacing: '0.12em', color: C.burdeos, textTransform: 'uppercase'}}>{medio}</span>
        {fecha && <span style={{fontWeight: 500, fontSize: 28, color: C.piedra}}>{fecha}</span>}
      </div>
      <div style={{fontFamily: SERIF, fontSize: size, lineHeight: 1.38, color: C.tinta, marginTop: 14}}>
        {trozos.map((t, i) => {
          if (!t.startsWith('[[')) return <span key={i}>{t}</span>;
          const [a, b] = marcasEn[n++] ?? [at, at];
          const p = interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
          return (
            <span
              key={i}
              style={{
                backgroundImage: 'linear-gradient(#F3D27A, #F3D27A)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${p * 100}% 72%`,
                backgroundPosition: '0 85%',
                WebkitBoxDecorationBreak: 'clone',
                boxDecorationBreak: 'clone',
              }}
            >
              {t.slice(2, -2)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Viñeta de color a pantalla completa para subrayar una palabra negativa (~0,25 s).
export const Destello: React.FC<{at: number; color?: string; dur?: number; op?: number}> = ({at, color = '#9E1F2A', dur = 8, op = 0.42}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  const a = interpolate(f - at, [0, 2, dur], [0, op, 0], clamp);
  return <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, ${color} 100%)`, opacity: a, pointerEvents: 'none'}} />;
};

// Temblor que decae (para sellos y golpes).
export const Temblor: React.FC<{at: number; amp?: number; dur?: number; children: React.ReactNode}> = ({at, amp = 9, dur = 9, children}) => {
  const f = useCurrentFrame();
  const t = f - at;
  const d = t >= 0 && t < dur ? amp * (1 - t / dur) : 0;
  const dx = d * Math.sin(t * 2.7);
  const dy = d * Math.cos(t * 3.4) * 0.6;
  return <div style={{position: 'absolute', inset: 0, transform: `translate(${dx}px, ${dy}px)`}}>{children}</div>;
};

// Píldora de texto que repite la clave; se apaga cuando entra la siguiente.
const PILDORA = {
  dorado: {bg: '#E8C46A', fg: C.tinta},
  blanco: {bg: '#FFFDF8', fg: C.tinta},
  burdeos: {bg: C.burdeos, fg: '#FFFDF8'},
  tinta: {bg: C.tinta, fg: '#FFFDF8'},
};
export const Pildora: React.FC<{
  text: string;
  x: number; // centro
  y: number;
  at: number;
  out?: number;
  apaga?: number;
  variante?: keyof typeof PILDORA;
  size?: number;
}> = ({text, x, y, at, out, apaga, variante = 'dorado', size = 34}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  if (out !== undefined && f > out + 8) return null;
  const {k, o} = popIn(f, at);
  const s = salida(f, out);
  const dim = apaga === undefined ? 1 : interpolate(f - apaga, [0, 6], [1, 0.4], clamp);
  const c = PILDORA[variante];
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateX(-50%) scale(${k})`,
        opacity: o * s.o * dim,
        background: c.bg,
        color: c.fg,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        padding: '8px 22px',
        borderRadius: 12,
        whiteSpace: 'nowrap',
        boxShadow: '0 6px 14px rgba(32,32,30,0.16)',
      }}
    >
      {text}
    </div>
  );
};

// Fuente mínima bajo un gráfico, para golpes rápidos (la ficha grande, para datos fuertes).
export const FuenteMini: React.FC<{text: string; x: number; y: number; at: number; out?: number}> = ({text, x, y, at, out}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = interpolate(f - at, [0, 6], [0, 1], clamp) * salida(f, out).o;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translateX(-50%)', opacity: o, fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.piedra, whiteSpace: 'nowrap'}}>
      {text}
    </div>
  );
};
