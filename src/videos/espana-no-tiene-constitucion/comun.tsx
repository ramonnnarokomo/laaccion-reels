import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {C, SANS, SERIF} from '../../kit/brand';
import {clamp} from '../../kit/ui';
import {construyeLineas, type Linea, PELO, PIEL, Persona, ROPA} from '../../kit/mundo';

// Piezas comunes de la serie «España no tiene Constitución» (3 partes).

export const FPS = 30;
type Ali = Record<string, {dur: number; subs: Array<{from: number; to: number; text: string}>}>;

// Línea de tiempo a partir de la duración real de cada clip de voz.
export const armaTimeline = <I extends string>(ali: Ali, ids: readonly I[], subs: Record<I, string[]>, holdFin = 84) => {
  const LEAD = 4;
  const GAP = 7;
  const SC = {} as Record<I, {from: number; to: number; voz: number}>;
  let t = 0;
  ids.forEach((id, i) => {
    const dur = Math.ceil(ali[id].dur * FPS);
    const lead = i === 0 ? 2 : LEAD;
    const len = lead + dur + (i === ids.length - 1 ? holdFin : GAP);
    SC[id] = {from: t, to: t + len, voz: t + lead};
    t += len;
  });
  const TOTAL = t;
  const FRASE = {} as Record<I, Array<{from: number; to: number}>>;
  const LINEAS: Linea[] = [];
  ids.forEach((id) => {
    const s = ali[id].subs;
    if (s.length !== subs[id].length) throw new Error(`Subtítulos de ${id}: ${s.length} frases en la voz y ${subs[id].length} en el texto`);
    FRASE[id] = s.map((x) => ({from: Math.round(x.from * FPS), to: Math.round(x.to * FPS)}));
    s.forEach((x, i) => LINEAS.push(...construyeLineas(SC[id].voz + x.from * FPS, SC[id].voz + x.to * FPS, subs[id][i])));
  });
  LINEAS.forEach((l, i) => {
    const next = LINEAS[i + 1]?.from ?? TOTAL;
    const lastW = l.words[l.words.length - 1].t;
    l.to = next - lastW < 45 ? next : lastW + 30;
  });
  // tiempo local (desde el inicio de la escena) del principio y del final de cada frase
  const F = (id: I) => (i: number) => SC[id].voz - SC[id].from + FRASE[id][i].from;
  const E = (id: I) => (i: number) => SC[id].voz - SC[id].from + FRASE[id][i].to;
  return {SC, TOTAL, FRASE, LINEAS, F, E};
};

const pop = (f: number, at: number) => spring({frame: f - at, fps: FPS, config: {damping: 12, stiffness: 200}});
const fuera = (f: number, out?: number) => (out === undefined ? 1 : interpolate(f - out, [0, 8], [1, 0], clamp));

// La prueba de 1789: tarjeta con dos casillas que vuelve en toda la serie y cambia de estado.
export type Marca = {at: number; texto: string; color?: string};
export const Prueba: React.FC<{
  x: number; // centro
  y: number;
  at: number;
  out?: number;
  w?: number;
  foco?: Array<[number, 0 | 1 | 2]>; // fila resaltada en cada momento
  marca1?: Marca;
  marca2?: Marca;
  escala?: number;
}> = ({x, y, at, out, w = 900, foco = [], marca1, marca2, escala = 1}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 8)) return null;
  const s = pop(f, at) * escala;
  const fo = [...foco].reverse().find(([t]) => f >= t)?.[1] ?? 0;
  const fila = (n: 1 | 2, texto: string, m?: Marca) => {
    const on = fo === n;
    const k = m && f >= m.at ? spring({frame: f - m.at, fps: FPS, config: {damping: 10, stiffness: 240}}) : 0;
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '16px 22px', borderRadius: 12, background: on ? 'rgba(232,196,106,0.45)' : 'transparent', position: 'relative'}}>
        <div style={{width: 62, height: 62, border: `6px solid ${C.tinta}`, borderRadius: 8, background: '#FFFDF8', flexShrink: 0}} />
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: '0.03em', color: C.tinta, textTransform: 'uppercase'}}>{texto}</div>
        {m && f >= m.at && (
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: `translateY(-50%) rotate(-7deg) scale(${interpolate(k, [0, 1], [1.8, 1])})`,
              opacity: Math.min(1, k * 1.5),
              border: `6px solid ${m.color ?? C.burdeos}`,
              color: m.color ?? C.burdeos,
              borderRadius: 8,
              padding: '2px 16px',
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 36,
              letterSpacing: '0.06em',
              background: 'rgba(250,247,241,0.92)',
            }}
          >
            {m.texto}
          </div>
        )}
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `scale(${s})`, transformOrigin: 'center top', opacity: fuera(f, out)}}>
      <div style={{background: '#FFFDF8', borderTop: `10px solid ${C.burdeos}`, boxShadow: '0 16px 36px rgba(32,32,30,0.18)', padding: '22px 24px 26px'}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: '0.2em', color: C.burdeos, marginBottom: 10, paddingLeft: 22}}>LA PRUEBA DE 1789</div>
        {fila(1, 'Derechos garantizados', marca1)}
        {fila(2, 'Separación de poderes', marca2)}
      </div>
    </div>
  );
};

// Pergamino de 1789 (dibujado).
export const Pergamino: React.FC<{x: number; y: number; w?: number; at: number; out?: number; titulo?: string}> = ({x, y, w = 420, at, out, titulo = '1789'}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 8)) return null;
  const s = pop(f, at);
  const h = w * 1.25;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: h, transform: `scale(${s}) rotate(${interpolate(s, [0, 1], [-14, -3])}deg)`, opacity: fuera(f, out)}}>
      <svg width={w} height={h} viewBox="0 0 420 525">
        <path d="M30 40 Q20 20 45 18 H375 Q400 20 392 42 V485 Q400 505 375 507 H45 Q20 505 28 485 Z" fill="#F1E3C2" stroke={C.tinta} strokeWidth={6} />
        <path d="M45 18 Q60 40 45 62 H392" fill="none" stroke={C.dorado} strokeWidth={5} />
        <text x={210} y={150} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={92} fill={C.tinta}>
          {titulo}
        </text>
        {Array.from({length: 7}).map((_, i) => (
          <rect key={i} x={70} y={200 + i * 38} width={i % 3 === 2 ? 200 : 280} height={14} rx={7} fill="#C9B48D" />
        ))}
        <text x={300} y={470} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={34} fill={C.burdeos}>
          art. 16
        </text>
      </svg>
    </div>
  );
};

// Libro «CONSTITUCIÓN» (dibujado).
export const Libro: React.FC<{x: number; y: number; w?: number; at: number; out?: number}> = ({x, y, w = 360, at, out}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 8)) return null;
  const s = pop(f, at);
  const h = w * 1.3;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: h, transform: `scale(${s})`, opacity: fuera(f, out)}}>
      <div style={{position: 'absolute', left: 14, top: 14, width: w, height: h, background: C.tinta, opacity: 0.15, borderRadius: 10}} />
      <div style={{position: 'absolute', inset: 0, background: C.burdeos, borderRadius: 10, border: `5px solid ${C.tinta}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}}>
        <div style={{width: w * 0.7, height: 4, background: C.dorado}} />
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: w * 0.105, color: '#F3E6C8', letterSpacing: '0.02em'}}>CONSTITUCIÓN</div>
        <div style={{fontFamily: SERIF, fontSize: w * 0.09, color: C.dorado}}>1978</div>
        <div style={{width: w * 0.7, height: 4, background: C.dorado}} />
      </div>
    </div>
  );
};

// Lupa (dibujada) que entra deslizándose.
export const Lupa: React.FC<{x: number; y: number; at: number; r?: number}> = ({x, y, at, r = 110}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f - at, [0, 12], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const bob = Math.sin((f - at) / 12) * 6;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, transform: `translate(${k * 500}px, ${k * 300 + bob}px)`}}>
      <line x1={x + r * 0.7} y1={y + r * 0.7} x2={x + r * 1.9} y2={y + r * 1.9} stroke={C.tinta} strokeWidth={30} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r} fill="rgba(255,253,248,0.25)" stroke={C.tinta} strokeWidth={16} />
      <path d={`M${x - r * 0.55} ${y - r * 0.2} A${r * 0.6} ${r * 0.6} 0 0 1 ${x - r * 0.15} ${y - r * 0.58}`} stroke="#FFFFFF" strokeWidth={10} fill="none" strokeLinecap="round" />
    </svg>
  );
};

// Fila de magistrados (Persona con traje oscuro); `votan` = cuántos levantan la mano y cuándo.
export const Magistrados: React.FC<{y: number; n?: number; at: number; votan?: number; votanAt?: number; tanda?: number; h?: number; x0?: number; paso?: number}> = ({
  y,
  n = 11,
  at,
  votan = 0,
  votanAt = 0,
  tanda = 0,
  h = 170,
  x0 = 100,
  paso = 88,
}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {Array.from({length: n}).map((_, i) => (
      <Persona
        key={i}
        x={x0 + i * paso}
        y={y + (i % 2) * 16}
        h={h}
        at={at + i}
        piel={PIEL[(i * 2 + tanda * 3) % 5]}
        pelo={(['corto', 'largo', 'calvo', 'mono', 'rizado', 'flequillo'] as const)[(i + tanda * 2) % 6]}
        peloColor={PELO[(i + tanda) % 6]}
        ropa={ROPA.tinta}
        acc={i % 3 === 0 ? 'gafas' : null}
        falda={(i + tanda) % 4 === 1}
        pose={votan && i < votan ? [[0, 'quieto'], [votanAt + i, 'mano']] : 'quieto'}
        gesto="serio"
        semilla={40 + i + tanda * 20}
        respira={false}
      />
    ))}
  </svg>
);

// Carpeta «CONFIDENCIAL».
export const Carpeta: React.FC<{x: number; y: number; at: number; w?: number}> = ({x, y, at, w = 380}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = pop(f, at);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: w * 0.78, transform: `scale(${s}) rotate(-4deg)`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w * 0.4, height: 40, background: '#C9A86A', borderRadius: '10px 10px 0 0', border: `5px solid ${C.tinta}`, borderBottom: 'none'}} />
      <div style={{position: 'absolute', left: 0, top: 34, right: 0, bottom: 0, background: '#D8B97C', borderRadius: 10, border: `5px solid ${C.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{border: `5px solid ${C.burdeos}`, color: C.burdeos, fontFamily: SANS, fontWeight: 900, fontSize: w * 0.1, padding: '4px 14px', transform: 'rotate(-8deg)', letterSpacing: '0.05em'}}>CONFIDENCIAL</div>
      </div>
    </div>
  );
};

// Corona (dibujada).
export const Corona: React.FC<{x: number; y: number; at: number; w?: number; interroga?: boolean}> = ({x, y, at, w = 260, interroga}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = pop(f, at);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: w * 0.9, transform: `scale(${s})`}}>
      <svg width={w} height={w * 0.9} viewBox="0 0 260 234">
        <path d="M30 190 L20 70 L80 130 L130 40 L180 130 L240 70 L230 190 Z" fill={C.dorado} stroke={C.tinta} strokeWidth={8} strokeLinejoin="round" />
        <rect x={30} y={190} width={200} height={32} rx={6} fill={C.dorado} stroke={C.tinta} strokeWidth={8} />
        {[20, 130, 240].map((cx, i) => (
          <circle key={i} cx={cx} cy={i === 1 ? 36 : 66} r={14} fill={C.burdeos} stroke={C.tinta} strokeWidth={6} />
        ))}
      </svg>
      {interroga && f >= at + 8 && (
        <div style={{position: 'absolute', left: w * 0.78, top: -w * 0.42, fontFamily: SANS, fontWeight: 900, fontSize: w * 0.5, color: C.burdeos, transform: `scale(${pop(f, at + 8)})`}}>?</div>
      )}
    </div>
  );
};

// Tarjeta final «PARTE N».
export const Siguiente: React.FC<{at: number; parte: number; titulo: string}> = ({at, parte, titulo}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = pop(f, at);
  const flecha = Math.sin((f - at) / 6) * 10;
  return (
    <div style={{position: 'absolute', left: 140, right: 140, top: 1180, transform: `scale(${s})`, background: C.tinta, color: '#FAF7F1', padding: '30px 36px', borderRadius: 18, boxShadow: '0 14px 30px rgba(32,32,30,0.25)'}}>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: '0.18em', color: C.dorado}}>ESPAÑA NO TIENE CONSTITUCIÓN</div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 64}}>Parte {parte}: {titulo}</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 70, transform: `translateX(${flecha}px)`}}>→</div>
      </div>
    </div>
  );
};

export const SERIE = 'La Constitución, a prueba';

// ---------- Piezas añadidas para las partes 2 y 3 ----------
const lz = (children: React.ReactNode, o = 1) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: o}}>
    {children}
  </svg>
);

export const Narrador: React.FC<{x: number; y: number; h?: number; at?: number; gesto?: any; pose?: any; emote?: any; mira?: number}> = (p) =>
  lz(<Persona x={p.x} y={p.y} h={p.h ?? 330} at={p.at ?? 0} piel={PIEL[2]} pelo="corto" peloColor={PELO[0]} ropa={ROPA.burdeos} pantalon={ROPA.tinta} gesto={p.gesto ?? 'neutral'} pose={p.pose ?? 'quieto'} emote={p.emote ?? null} semilla={7} mira={p.mira} />);

export const Defensora: React.FC<{x: number; y: number; at?: number; gesto?: any; pose?: any; mira?: number}> = (p) =>
  lz(<Persona x={p.x} y={p.y} h={330} at={p.at ?? 0} piel={PIEL[3]} pelo="largo" peloColor={PELO[1]} ropa={ROPA.oliva} falda gesto={p.gesto ?? 'contento'} pose={p.pose ?? 'habla'} semilla={120} mira={p.mira} />);

// Fila de gente corriente.
export const Gente: React.FC<{y: number; at: number; n?: number; h?: number; x0?: number; paso?: number; pose?: any; gesto?: any}> = ({y, at, n = 9, h = 190, x0 = 100, paso = 110, pose = 'quieto', gesto = 'contento'}) =>
  lz(
    Array.from({length: n}).map((_, i) => (
      <Persona
        key={i}
        x={x0 + i * paso + (i % 2) * 8}
        y={y + (i % 2) * 26}
        h={h}
        at={at + i * 2}
        piel={PIEL[(i * 3) % 5]}
        pelo={(['corto', 'largo', 'rizado', 'mono', 'calvo', 'flequillo'] as const)[i % 6]}
        peloColor={PELO[(i * 2) % 6]}
        ropa={[ROPA.oliva, ROPA.burdeos, ROPA.pizarra, ROPA.arena, ROPA.dorado, ROPA.piedra][i % 6]}
        falda={i % 3 === 1}
        pose={pose}
        gesto={gesto}
        semilla={i + 10}
      />
    )),
  );

// Candado (cerrado u abierto) y llavero.
export const Candado: React.FC<{x: number; y: number; at: number; w?: number; abre?: number}> = ({x, y, at, w = 220, abre}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = pop(f, at);
  const a = abre === undefined ? 0 : interpolate(f - abre, [0, 10], [0, 1], clamp);
  return lz(
    <g transform={`translate(${x} ${y}) scale(${(s * w) / 220})`}>
      <path d={`M-60 -10 V-70 A60 60 0 0 1 60 -70 V${-10 - 40 * a}`} fill="none" stroke={C.tinta} strokeWidth={22} transform={`translate(0 ${-30 * a})`} />
      <rect x={-95} y={-20} width={190} height={160} rx={22} fill={C.dorado} stroke={C.tinta} strokeWidth={8} />
      <circle cx={0} cy={45} r={18} fill={C.tinta} />
      <rect x={-7} y={50} width={14} height={45} fill={C.tinta} />
    </g>,
  );
};
export const Llaves: React.FC<{x: number; y: number; at: number; w?: number}> = ({x, y, at, w = 200}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = pop(f, at);
  const sw = Math.sin((f - at) / 8) * 8;
  return lz(
    <g transform={`translate(${x} ${y}) scale(${(s * w) / 200}) rotate(${sw})`}>
      <circle cx={0} cy={0} r={34} fill="none" stroke={C.tinta} strokeWidth={10} />
      {[-30, 10].map((r, i) => (
        <g key={i} transform={`rotate(${r}) translate(0 34)`}>
          <circle cx={0} cy={26} r={22} fill={C.dorado} stroke={C.tinta} strokeWidth={7} />
          <rect x={-8} y={46} width={16} height={90} fill={C.dorado} stroke={C.tinta} strokeWidth={6} />
          <rect x={6} y={100} width={22} height={12} fill={C.dorado} stroke={C.tinta} strokeWidth={5} />
          <rect x={6} y={120} width={16} height={10} fill={C.dorado} stroke={C.tinta} strokeWidth={5} />
        </g>
      ))}
    </g>,
  );
};

// Revista (genérica, con rótulo; no reproduce ninguna portada real).
export const Revista: React.FC<{x: number; y: number; at: number; w?: number; nombre: string; numero: string}> = ({x, y, at, w = 420, nombre, numero}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = pop(f, at);
  const h = w * 1.3;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: h, transform: `scale(${s}) rotate(${interpolate(s, [0, 1], [12, 3])}deg)`, background: '#FFFDF8', border: `5px solid ${C.tinta}`, boxShadow: '0 16px 30px rgba(32,32,30,0.2)', padding: 24}}>
      <div style={{background: C.tinta, color: '#FAF7F1', fontFamily: SERIF, fontWeight: 700, fontSize: w * 0.085, textAlign: 'center', padding: '10px 6px', lineHeight: 1.1}}>{nombre}</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: w * 0.06, color: C.burdeos, marginTop: 10, letterSpacing: '0.1em'}}>{numero}</div>
      {Array.from({length: 8}).map((_, i) => (
        <div key={i} style={{height: 14, borderRadius: 7, background: '#CFC5B4', width: `${i % 3 === 2 ? 55 : 90}%`, marginTop: 14}} />
      ))}
    </div>
  );
};

// Papeleta del referéndum: un solo SÍ o NO para todo el texto.
export const Papeleta: React.FC<{x: number; y: number; at: number; w?: number; contenido?: React.ReactNode}> = ({x, y, at, w = 520, contenido}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = pop(f, at);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `scale(${s}) rotate(-2deg)`, background: '#FFFDF8', border: `5px solid ${C.tinta}`, boxShadow: '0 14px 28px rgba(32,32,30,0.18)', padding: '22px 26px'}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', color: C.burdeos, textAlign: 'center'}}>REFERÉNDUM · 6-XII-1978</div>
      <div style={{border: `3px dashed ${C.piedra}`, borderRadius: 10, minHeight: 170, margin: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', padding: 10}}>{contenido}</div>
      <div style={{display: 'flex', justifyContent: 'space-around', fontFamily: SANS, fontWeight: 900, fontSize: 52, color: C.tinta}}>
        <span>SÍ ☐</span>
        <span>NO ☐</span>
      </div>
    </div>
  );
};

// Micrófono de solapa con mano que lo tapa.
export const Microfono: React.FC<{x: number; y: number; at: number; tapa?: number}> = ({x, y, at, tapa}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = pop(f, at);
  const t = tapa === undefined ? 0 : interpolate(f - tapa, [0, 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return lz(
    <g transform={`translate(${x} ${y}) scale(${s * 0.6})`}>
      <rect x={-26} y={-60} width={52} height={90} rx={26} fill="#3A3A36" stroke={C.tinta} strokeWidth={6} />
      {[-30, -15, 0, 15].map((d) => (
        <line key={d} x1={-18} y1={d} x2={18} y2={d} stroke="#77776F" strokeWidth={3} />
      ))}
      <path d="M0 30 Q0 90 -40 110" stroke={C.tinta} strokeWidth={6} fill="none" />
      <g transform={`translate(${160 * (1 - t)} ${60 * (1 - t)})`} opacity={t}>
        <path d="M-70 -40 Q-80 40 -20 60 H40 Q90 40 75 -40 Q60 -70 0 -66 Q-60 -70 -70 -40 Z" fill={PIEL[1]} stroke={C.tinta} strokeWidth={6} />
        {[-36, -10, 16, 42].map((d) => (
          <path key={d} d={`M${d} -40 V10`} stroke={C.tinta} strokeWidth={3} opacity={0.4} />
        ))}
      </g>
    </g>,
  );
};

// Rótulo de persona pública: nombre y cargo.
export const Rotulo: React.FC<{x: number; y: number; at: number; nombre: string; cargo: string; w?: number}> = ({x, y, at, nombre, cargo, w = 520}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f - at, [0, 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translateX(${(1 - k) * -40}px)`, opacity: k}}>
      <div style={{background: C.tinta, color: '#FAF7F1', fontFamily: SANS, fontWeight: 800, fontSize: 36, padding: '10px 18px', letterSpacing: '0.04em', display: 'inline-block'}}>{nombre}</div>
      <div style={{background: C.dorado, color: C.tinta, fontFamily: SANS, fontWeight: 600, fontSize: 28, padding: '6px 18px', display: 'inline-block'}}>{cargo}</div>
    </div>
  );
};
