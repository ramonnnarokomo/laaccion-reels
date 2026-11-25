import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS, SERIF} from '../../kit/brand';
import {clamp, Sfx, Tag} from '../../kit/ui';
import {Edificio} from '../../kit/figuras';
import {Camara, Ficha, Halo, OutroSol, PARED, PELO, PIEL, Persona, Pop, ROPA, Sala, Sello, SUELO} from '../../kit/mundo';
import {FRASE, SC, type Id} from './timeline';

// Tiempo local de cada frase (fotogramas desde el inicio de la escena)
const fr = (id: Id) => {
  const lead = SC[id].voz - SC[id].from;
  return (i: number) => lead + FRASE[id][i].from;
};
const frEnd = (id: Id) => {
  const lead = SC[id].voz - SC[id].from;
  return (i: number) => lead + FRASE[id][i].to;
};
const TAG_TOP = 446;
const Lienzo: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);
const ramp = (f: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

// ---------- objetos ----------
const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// Calendario de taco: muestra (mes, día, año); las hojas arrancadas salen volando
const Taco: React.FC<{x: number; y: number; w?: number; mes: string; dia: number | string; anio?: string; hojas?: Array<{at: number; mes: string; dia: number | string}>}> = ({
  x,
  y,
  w = 300,
  mes,
  dia,
  anio,
  hojas = [],
}) => {
  const f = useCurrentFrame();
  const h = w * 1.08;
  const pagina = (m: string, d: number | string, key: string, extra?: React.CSSProperties) => (
    <div key={key} style={{position: 'absolute', left: 0, top: 0, width: w, height: h, background: '#FFFDF8', border: `4px solid ${C.tinta}`, borderRadius: 14, overflow: 'hidden', ...extra}}>
      <div style={{height: h * 0.27, background: C.burdeos, color: '#FAF7F1', fontFamily: SANS, fontWeight: 800, fontSize: w * 0.15, letterSpacing: '0.12em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{m}</div>
      <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: w * 0.42, color: C.tinta, textAlign: 'center', lineHeight: `${h * 0.56}px`}}>{d}</div>
      {anio && <div style={{position: 'absolute', bottom: h * 0.04, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: w * 0.09, color: C.piedra, letterSpacing: '0.12em'}}>{anio}</div>}
    </div>
  );
  // página visible = la última hoja ya «llegada»; las anteriores salen volando
  const llegadas = hojas.filter((p) => f >= p.at);
  const actual = llegadas.length ? llegadas[llegadas.length - 1] : {mes, dia};
  const volando = [{at: -999, mes, dia}, ...hojas].map((p, i, arr) => ({p, sale: arr[i + 1]?.at})).filter((o) => o.sale !== undefined && f >= o.sale && f < o.sale + 14);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h}}>
      <div style={{position: 'absolute', left: 8, top: 10, width: w, height: h, background: C.tinta, opacity: 0.12, borderRadius: 14}} />
      {pagina(actual.mes, actual.dia, 'actual')}
      {volando.map(({p, sale}, i) => {
        const k = (f - (sale as number)) / 14;
        return pagina(p.mes, p.dia, 'v' + i, {
          transform: `translate(${k * 520 * (i % 2 ? -1 : 1)}px, ${-k * 260 + k * k * 700}px) rotate(${k * 70 * (i % 2 ? -1 : 1)}deg)`,
          opacity: 1 - k,
        });
      })}
      {[0.25, 0.75].map((a, i) => (
        <div key={i} style={{position: 'absolute', left: w * a - 9, top: -16, width: 18, height: 36, borderRadius: 9, background: C.tinta}} />
      ))}
    </div>
  );
};

const Urna: React.FC<{x: number; y: number; w?: number; label?: string; papeletas?: number; regalo?: boolean}> = ({x, y, w = 220, label, papeletas = 4, regalo}) => {
  const h = w * 0.8;
  return (
    <g transform={`translate(${x - w / 2} ${y - h})`}>
      <rect x={0} y={0} width={w} height={h} rx={10} fill="#E7EEF0" fillOpacity={0.75} stroke={C.tinta} strokeWidth={5} />
      {Array.from({length: papeletas}).map((_, i) => (
        <rect key={i} x={20 + (i % 3) * (w / 3.6)} y={h - 34 - Math.floor(i / 3) * 14} width={w / 3.4} height={22} rx={2} fill="#FFFDF8" stroke={C.piedra} strokeWidth={2} transform={`rotate(${(i % 2 ? -6 : 5)} ${w / 2} ${h - 30})`} />
      ))}
      <rect x={-8} y={-16} width={w + 16} height={22} rx={6} fill={C.tinta} />
      <rect x={w * 0.3} y={-10} width={w * 0.4} height={8} rx={4} fill="#E7EEF0" />
      {regalo && (
        <>
          <rect x={w / 2 - 12} y={-16} width={24} height={h + 16} fill={C.burdeos} />
          <path d={`M${w / 2} -16 Q${w / 2 - 60} -70 ${w / 2 - 70} -30 Q${w / 2 - 40} -10 ${w / 2} -16 Q${w / 2 + 60} -70 ${w / 2 + 70} -30 Q${w / 2 + 40} -10 ${w / 2} -16 Z`} fill={C.burdeos} />
        </>
      )}
      {label && (
        <text x={w / 2} y={h + 46} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} letterSpacing={4} fill={C.tinta}>
          {label}
        </text>
      )}
    </g>
  );
};

const Mesa: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 420}) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={22} fill="#9C7E5C" />
    <rect x={x - w / 2 + 20} y={y + 22} width={w - 40} height={110} fill="#B3936D" />
    <line x1={x - w / 2 + 20} y1={y + 132} x2={x + w / 2 - 20} y2={y + 132} stroke={C.tinta} strokeWidth={2} opacity={0.3} />
  </g>
);

// Hemiciclo: 350 escaños; `si` y `no` (cuántos) y desde qué fotograma se encienden
const ESC: Array<{x: number; y: number; a: number}> = (() => {
  const rows = [190, 225, 260, 295, 330, 365];
  const tot = rows.reduce((a, r) => a + r, 0);
  const out: Array<{x: number; y: number; a: number}> = [];
  let left = 350;
  rows.forEach((r, i) => {
    const n = i === rows.length - 1 ? left : Math.round((350 * r) / tot);
    left -= n;
    for (let j = 0; j < n; j++) {
      const a = Math.PI - (Math.PI * (j + 0.5)) / n;
      out.push({x: Math.cos(a) * r, y: -Math.sin(a) * r * 0.62, a});
    }
  });
  return out.sort((p, q) => q.a - p.a);
})();
const Hemiciclo: React.FC<{cx: number; cy: number; si?: number; no?: number; t0?: number; dur?: number; noT0?: number}> = ({cx, cy, si = 0, no = 0, t0 = 0, dur = 40, noT0}) => {
  const f = useCurrentFrame();
  const nSi = Math.round(si * ramp(f, t0, t0 + dur, Easing.out(Easing.cubic)));
  const nNo = Math.round(no * ramp(f, noT0 ?? t0, (noT0 ?? t0) + dur, Easing.out(Easing.cubic)));
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <path d="M-400 0 A400 248 0 0 1 400 0" fill="#E2D7C3" opacity={0.7} />
      {ESC.map((p, i) => {
        const col = i < nSi ? C.dorado : i >= 350 - nNo ? C.tinta : '#C9BEAA';
        return <circle key={i} cx={p.x} cy={p.y} r={8.2} fill={col} />;
      })}
    </g>
  );
};

// Marcador de votación en la pared
const Marcador: React.FC<{x: number; y: number; titulo: string; si: number; no?: number; t0: number; dur?: number}> = ({x, y, titulo, si, no, t0, dur = 40}) => {
  const f = useCurrentFrame();
  const k = ramp(f, t0, t0 + dur, Easing.out(Easing.cubic));
  return (
    <div style={{position: 'absolute', left: x - 300, top: y, width: 600, background: C.tinta, borderRadius: 12, padding: '14px 22px', fontFamily: SANS, color: '#FAF7F1', boxShadow: '0 8px 20px rgba(0,0,0,0.18)'}}>
      <div style={{fontSize: 22, fontWeight: 700, letterSpacing: '0.16em', color: C.dorado, textAlign: 'center'}}>{titulo}</div>
      <div style={{display: 'flex', justifyContent: 'space-around', fontSize: 58, fontWeight: 800, fontVariantNumeric: 'tabular-nums'}}>
        <span>
          <span style={{fontSize: 28, color: C.dorado, marginRight: 10}}>SÍ</span>
          {Math.round(si * k)}
        </span>
        {no !== undefined && (
          <span>
            <span style={{fontSize: 28, color: '#BDB5A6', marginRight: 10}}>NO</span>
            {Math.round(no * k)}
          </span>
        )}
      </div>
    </div>
  );
};

// Barra hasta 350 con la raya de 176
const BarraMayoria: React.FC<{x: number; y: number; valor: number; t0: number; dur?: number; w?: number}> = ({x, y, valor, t0, dur = 40, w = 760}) => {
  const f = useCurrentFrame();
  const v = valor * ramp(f, t0, t0 + dur, Easing.out(Easing.cubic));
  const raya = (176 / 350) * w;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: 34}}>
      <div style={{position: 'absolute', inset: 0, background: '#E2D7C3', borderRadius: 17}} />
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: (v / 350) * w, background: C.dorado, borderRadius: 17}} />
      <div style={{position: 'absolute', left: raya - 3, top: -18, width: 6, height: 70, background: C.burdeos}} />
      <div style={{position: 'absolute', left: raya - 120, top: 56, width: 240, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.burdeos, letterSpacing: '0.08em'}}>MAYORÍA · 176</div>
    </div>
  );
};

const Atril: React.FC<{x: number; y: number; label?: string}> = ({x, y, label}) => (
  <g>
    <path d={`M${x - 110} ${y - 170} L${x + 110} ${y - 170} L${x + 90} ${y} L${x - 90} ${y} Z`} fill="#8E7253" />
    <rect x={x - 124} y={y - 186} width={248} height={22} rx={4} fill="#7A5F43" />
    <line x1={x + 40} y1={y - 186} x2={x + 70} y2={y - 236} stroke={C.tinta} strokeWidth={4} />
    <circle cx={x + 72} cy={y - 240} r={8} fill={C.tinta} />
    {label && (
      <text x={x} y={y - 80} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={19} letterSpacing={2} fill="#F4ECDD">
        {label}
      </text>
    )}
  </g>
);

const RelojArena: React.FC<{x: number; y: number; t0: number; t1: number; para?: number}> = ({x, y, t0, t1, para}) => {
  const f = useCurrentFrame();
  const fin = para ?? 1e9;
  const k = ramp(Math.min(f, fin), t0, t1, Easing.linear);
  const top = 1 - k;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-80} y={-170} width={160} height={16} rx={6} fill="#8E7253" />
      <rect x={-80} y={154} width={160} height={16} rx={6} fill="#8E7253" />
      <path d="M-62 -154 L62 -154 L8 -4 L8 4 L62 154 L-62 154 L-8 4 L-8 -4 Z" fill="#EEF2F2" fillOpacity={0.7} stroke={C.tinta} strokeWidth={4} />
      <clipPath id="arenaTop">
        <rect x={-70} y={-150 + (1 - top) * 146} width={140} height={150} />
      </clipPath>
      <path d="M-58 -150 L58 -150 L6 -4 L-6 -4 Z" fill={C.dorado} clipPath="url(#arenaTop)" />
      <path d={`M-58 150 L58 150 L${58 - 52 * (1 - k)} ${150 - 140 * k} L${-58 + 52 * (1 - k)} ${150 - 140 * k} Z`} fill={C.dorado} opacity={k > 0.02 ? 1 : 0} />
      {f < fin && k > 0 && k < 1 && <line x1={0} y1={0} x2={0} y2={150 - 140 * k} stroke={C.dorado} strokeWidth={3} />}
    </g>
  );
};

const Abeto: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-16} y={-40} width={32} height={40} fill="#7A5F43" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M0 ${-300 + i * 70} L${110 + i * 25} ${-120 + i * 70 - 40} L${-110 - i * 25} ${-120 + i * 70 - 40} Z`} fill={i % 2 ? '#5E6B4E' : '#6B7858'} />
    ))}
    <path d="M-80 -180 Q0 -150 70 -200 M-110 -110 Q0 -80 105 -130" stroke={C.burdeos} strokeWidth={5} fill="none" />
    <path d="M0 -318 L8 -300 L27 -300 L12 -289 L18 -270 L0 -281 L-18 -270 L-12 -289 L-27 -300 L-8 -300 Z" fill={C.dorado} />
  </g>
);

const Nieve: React.FC<{n?: number; at?: number}> = ({n = 70, at = 0}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = interpolate(f - at, [0, 15], [0, 1], clamp);
  return (
    <g opacity={o}>
      {Array.from({length: n}).map((_, i) => {
        const sx = (i * 137.5) % 1080;
        const sp = 2.2 + (i % 5) * 0.6;
        const yy = ((i * 211 + (f - at) * sp) % 1300) + 420;
        const xx = sx + Math.sin((f + i * 10) / 20) * 14;
        return <circle key={i} cx={xx} cy={yy} r={3 + (i % 3)} fill="#FFFFFF" stroke="#D9D2C4" strokeWidth={1} />;
      })}
    </g>
  );
};

const Casas: React.FC<{y: number}> = ({y}) => {
  const f = useCurrentFrame();
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 60 + i * 210;
        const h = 200 + (i % 2) * 60;
        const luz = Math.sin(f / 30 + i) > -0.6;
        return (
          <g key={i}>
            <rect x={x} y={y - h} width={180} height={h} fill={i % 2 ? '#DCCFB8' : '#E6DAC6'} stroke={C.tinta} strokeWidth={3} />
            <path d={`M${x - 14} ${y - h} L${x + 90} ${y - h - 70} L${x + 194} ${y - h} Z`} fill={C.piedra} />
            <path d={`M${x - 14} ${y - h} L${x + 90} ${y - h - 70} L${x + 194} ${y - h}`} stroke="#FFFFFF" strokeWidth={8} fill="none" />
            {[0, 1].map((j) => (
              <rect key={j} x={x + 28 + j * 82} y={y - h + 40} width={44} height={52} fill={luz ? '#F1D79A' : '#B9B2A6'} stroke={C.tinta} strokeWidth={3} />
            ))}
            <rect x={x + 70} y={y - 80} width={40} height={80} fill="#8E7253" />
          </g>
        );
      })}
    </g>
  );
};

// Mano en primer plano que señala desde abajo
const ManoPOV: React.FC<{at: number; tx: number; ty: number}> = ({at, tx, ty}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = ramp(f, at, at + 10, Easing.out(Easing.cubic));
  const bx = 980;
  const by = 2000;
  const ex = bx + (tx - bx) * k * 0.92;
  const ey = by + (ty - by) * k * 0.92;
  return (
    <g>
      <path d={`M${bx} ${by} L${ex} ${ey}`} stroke={ROPA.pizarra} strokeWidth={90} strokeLinecap="round" />
      <path d={`M${bx} ${by} L${ex} ${ey}`} stroke="#FFFDF8" strokeWidth={90} strokeLinecap="butt" strokeDasharray={`0 ${Math.hypot(ex - bx, ey - by) - 90} 40 9999`} />
      <circle cx={ex} cy={ey} r={60} fill={PIEL[1]} />
      <path d={`M${ex} ${ey} L${ex + (tx - bx) * 0.13} ${ey + (ty - by) * 0.13}`} stroke={PIEL[1]} strokeWidth={28} strokeLinecap="round" />
    </g>
  );
};

const Flecha: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; dur?: number; curva?: number}> = ({x1, y1, x2, y2, at, dur = 14, curva = 0}) => {
  const f = useCurrentFrame();
  const k = ramp(f, at, at + dur);
  if (k <= 0) return null;
  const mx = (x1 + x2) / 2 + curva;
  const my = (y1 + y2) / 2;
  const L = 2000;
  const ang = Math.atan2(y2 - my, x2 - mx);
  return (
    <g>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke={C.dorado} strokeWidth={6} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - k)} strokeLinecap="round" />
      {k > 0.95 && <path d={`M${x2} ${y2} L${x2 - 22 * Math.cos(ang - 0.5)} ${y2 - 22 * Math.sin(ang - 0.5)} M${x2} ${y2} L${x2 - 22 * Math.cos(ang + 0.5)} ${y2 - 22 * Math.sin(ang + 0.5)}`} stroke={C.dorado} strokeWidth={6} strokeLinecap="round" />}
    </g>
  );
};

const Silla: React.FC<{x: number; y: number; vacia?: boolean}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-70} y={-250} width={140} height={150} rx={30} fill={C.burdeos} />
    <rect x={-84} y={-110} width={168} height={46} rx={14} fill="#8E3A42" />
    <path d="M-60 -64 L-66 0 M60 -64 L66 0" stroke="#5A4634" strokeWidth={12} strokeLinecap="round" />
  </g>
);

// ---------- 1 · Gancho ----------
export const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('01-gancho');
  const E = frEnd('01-gancho');
  // hojas: del 23 JUL al 16 NOV durante la frase 1
  const pasos = 16;
  const hojas = Array.from({length: pasos}).map((_, i) => {
    const d = new Date(2023, 6, 23 + Math.round((116 * (i + 1)) / pasos));
    return {at: F(1) + 4 + Math.round((i * (E(1) - F(1) - 14)) / pasos), mes: MESES[d.getMonth()], dia: d.getDate()};
  });
  const dias = Math.round(116 * ramp(f, F(1) + 4, E(1) - 10, Easing.linear));
  const caida = interpolate(f, [0, 9], [-900, 0], {...clamp, easing: Easing.in(Easing.quad)});
  const rebote = f > 9 ? Math.sin((f - 9) / 2) * 14 * Math.exp(-(f - 9) / 6) : 0;
  return (
    <>
      <Camara
        keys={[
          [0, 1.08, 540, 900],
          [F(1), 1.0, 540, 960],
          [F(2) - 6, 1.12, 540, 880],
          [F(2) + 4, 1.4, 320, 900],
          [F(3) - 2, 1.4, 320, 900],
          [F(3) + 12, 1.0, 540, 960],
          [F(4), 1.0, 600, 960],
          [F(4) + 18, 1.2, 760, 1000],
        ]}
      >
        <Sala suelo={1300} />
        <Halo x={540} y={760} r={360} at={0} op={0.3} />
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${caida + rebote}px)`}}>
          <Taco x={540} y={760} w={330} mes="JUL" dia={23} anio="2023" hojas={hojas} />
        </div>
        {f >= F(1) + 4 && (
          <div style={{position: 'absolute', left: 540 - 220, top: 1010, width: 440, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.burdeos, letterSpacing: '0.04em'}}>
            DÍA <span style={{fontVariantNumeric: 'tabular-nums'}}>{Math.max(1, dias)}</span>
          </div>
        )}
        <Lienzo>
          <Mesa x={250} y={1150} w={300} />
          <Urna x={250} y={1150} w={190} papeletas={f > 50 ? 5 : 4} />
          <Persona x={150} y={1310} h={330} piel={PIEL[2]} pelo="rizado" peloColor={PELO[0]} ropa={ROPA.oliva} pose={[[0, 'quieto'], [18, 'vota'], [48, 'quieto']]} gesto={[[0, 'neutral'], [F(1) + 60, 'duda'], [E(1) - 30, 'preocupado'], [F(2), 'duda']]} emote={[[0, null], [F(2), '?'], [F(3), null]]} semilla={1} mira={1} />
          <Persona x={880} y={1320} h={320} piel={PIEL[0]} pelo="largo" peloColor={PELO[1]} ropa={ROPA.burdeos} falda pantalon={ROPA.tinta} gesto={[[0, 'neutral'], [E(1) - 30, 'preocupado'], [F(4), 'sorpresa']]} emote={[[0, null], [E(1) - 30, 'sudor'], [F(3), null]]} semilla={2} mira={-1} />
          {f >= F(3) + 6 && <Abeto x={690} y={1100} s={interpolate(f - F(3) - 6, [0, 10], [0, 0.8], {...clamp, easing: Easing.out(Easing.back(2))})} />}
          <Nieve at={F(4)} n={60} />
        </Lienzo>
        {f >= F(3) + 14 && (
          <div style={{position: 'absolute', left: 870, top: 640, transform: `rotate(6deg) scale(${spring({frame: f - F(3) - 14, fps: 30, config: {damping: 11}})})`}}>
            <Taco x={0} y={0} w={150} mes="DIC" dia={25} />
          </div>
        )}
      </Camara>
      <Sfx at={8} src="clunk" volume={0.9} />
      <Sfx at={20} src="drop" volume={0.5} />
      {hojas.map((h, i) => (
        <Sfx key={i} at={h.at} src="paper" volume={0.35} dur={12} />
      ))}
      <Sfx at={E(1) - 8} src="thump" volume={0.7} />
      <Sfx at={F(2)} src="pop" volume={0.6} />
      <Sfx at={F(3) + 6} src="pop" volume={0.5} />
      <Sfx at={F(4)} src="shimmer" volume={0.6} />
    </>
  );
};

// ---------- 2 · Primer intento ----------
const Congreso: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <>
    <Sala suelo={1330} pared="#EFE6D6" piso="#E2D5BF" zocalo={false} />
    {children}
  </>
);

export const Intento: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('02-intento');
  const camina = interpolate(f, [0, F(0) + 50], [-120, 540], {...clamp, easing: Easing.out(Easing.quad)});
  const segunda = f >= F(3);
  return (
    <>
      <Camara
        keys={[
          [0, 1.0, 540, 960],
          [F(1), 1.0, 540, 940],
          [F(2) + 30, 1.06, 540, 900],
          [F(3), 1.0, 540, 960],
          [F(5) - 4, 1.0, 540, 960],
          [F(5) + 12, 1.06, 540, 1000],
        ]}
      >
        <Congreso />
        <Lienzo>
          <Hemiciclo cx={540} cy={1050} si={segunda ? 172 : 172} no={segunda ? 177 : 0} t0={F(1) + 8} dur={F(2) + 24 - F(1) - 8} noT0={F(4)} />
          <Persona x={camina} y={1300} h={300} piel={PIEL[1]} pelo="corto" peloColor={PELO[3]} ropa={ROPA.tinta} acc="corbata" accColor={C.dorado} pose={[[0, 'quieto'], [F(0) + 50, 'habla'], [F(2) + 20, 'quieto']]} gesto={[[0, 'contento'], [F(2) + 10, 'preocupado'], [F(5), 'serio']]} emote={[[0, null], [F(2) + 20, 'sudor']]} semilla={3} />
          {f >= F(0) + 40 && <Atril x={540} y={1330} label="CANDIDATO 1" />}
        </Lienzo>
        {!segunda ? (
          <>
            <Marcador x={540} y={560} titulo="1.ª VOTACIÓN · 27/9/2023" si={172} t0={F(1) + 8} dur={F(2) + 24 - F(1) - 8} />
            {f >= F(1) && <BarraMayoria x={540} y={730} valor={172} t0={F(1) + 8} dur={F(2) + 24 - F(1) - 8} />}
            {f >= F(2) + 26 && (
              <div style={{position: 'absolute', left: 560, top: 680, fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.burdeos, transform: `scale(${spring({frame: f - F(2) - 26, fps: 30, config: {damping: 9}})})`}}>−4</div>
            )}
          </>
        ) : (
          <>
            <Marcador x={540} y={560} titulo="2.ª VOTACIÓN · 48 H DESPUÉS" si={172} no={177} t0={F(4)} dur={30} />
          </>
        )}
        {f >= F(5) && <Sello x={540} y={870} at={F(5)} texto="RECHAZADO" />}
      </Camara>
      <Tag text="Dato" delay={F(0) + 4} top={TAG_TOP} />
      <Ficha x={90} y={1372} w={640} at={F(1) + 20} etiqueta="Congreso · 27 y 29/9/2023" dato="172 sí · 178 no, y luego 172 · 177" fuente="Diario de Sesiones" />
      <Sfx at={4} src="whoosh_soft" volume={0.5} />
      {Array.from({length: 12}).map((_, i) => (
        <Sfx key={i} at={F(1) + 8 + i * 4} src="tick" volume={0.35} dur={8} />
      ))}
      <Sfx at={F(2) + 26} src="thump" volume={0.8} />
      <Sfx at={F(3)} src="whoosh_soft" volume={0.5} />
      <Sfx at={F(4)} src="riser" volume={0.4} />
      <Sfx at={F(5)} src="stamp" volume={0.9} />
    </>
  );
};

// ---------- 3 · El reloj ----------
export const Reloj: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('03-reloj');
  const linea = ramp(f, F(0), F(5) + 10, Easing.linear);
  const fin = 50 / 61; // 16 NOV dentro de 27 SEP–27 NOV
  const pos = Math.min(linea, fin);
  return (
    <>
      <Camara
        keys={[
          [0, 1.0, 540, 960],
          [F(3) - 4, 1.0, 540, 960],
          [F(4) + 10, 1.0, 540, 1000],
          [F(5) + 6, 1.08, 540, 900],
        ]}
      >
        <Congreso />
        <Lienzo>
          <RelojArena x={200} y={760} t0={F(0)} t1={F(5) + 40} para={F(5)} />
          {f >= F(2) && f < F(3) + 8 && (
            <g transform={`translate(${Math.sin(f * 1.3) * 5} 0) translate(880 ${830 - 76}) scale(${interpolate(f, [F(3), F(3) + 8], [1, 0], clamp)}) translate(-880 ${-(830 - 76)})`}>
              <Pop at={F(2)} x={880} y={760} svg>
                <Urna x={880} y={830} w={190} label="¿14 ENE?" />
              </Pop>
            </g>
          )}
          {f >= F(3) && <Hemiciclo cx={540} cy={1060} si={179} no={171} t0={F(4)} dur={46} noT0={F(4)} />}
          {f >= F(3) && (
            <Persona x={540} y={1300} h={300} at={F(3)} piel={PIEL[3]} pelo="calvo" peloColor={PELO[0]} ropa={ROPA.piedra} acc={[F(4) + 50].some((t) => f >= t) ? 'banda' : 'corbata'} accColor={f >= F(4) + 50 ? C.dorado : C.burdeos} pose={[[0, 'quieto'], [F(4), 'habla'], [F(4) + 50, 'brazos-arriba'], [F(5), 'quieto']]} gesto={[[0, 'serio'], [F(4) + 46, 'contento']]} semilla={4} />
          )}
          {f >= F(3) && <Atril x={540} y={1330} label="CANDIDATO 2" />}
        </Lienzo>
        {/* línea de tiempo 27 SEP → 27 NOV */}
        <div style={{position: 'absolute', left: 340, top: 580, width: 440, fontFamily: SANS}}>
          <div style={{position: 'relative', height: 14, background: '#E2D7C3', borderRadius: 7}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pos * 100}%`, background: C.dorado, borderRadius: 7}} />
            <div style={{position: 'absolute', left: `${fin * 100}%`, top: -12, width: 4, height: 38, background: f >= F(5) ? C.burdeos : 'transparent'}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 26, fontWeight: 700, color: C.piedra, letterSpacing: '0.08em'}}>
            <span>27 SEP</span>
            <span style={{color: C.burdeos}}>27 NOV</span>
          </div>
          {f >= F(1) && <div style={{position: 'absolute', top: -70, width: '100%', textAlign: 'center', fontSize: 44, fontWeight: 800, color: C.tinta}}>2 MESES</div>}
        </div>
        {f >= F(4) && (
          <div style={{position: 'absolute', left: 340, top: 690, width: 400, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 96, lineHeight: 1, color: C.dorado, fontVariantNumeric: 'tabular-nums'}}>
            <span style={{fontSize: 36, color: C.tinta, marginRight: 14}}>SÍ</span>
            {Math.round(179 * ramp(f, F(4), F(4) + 46, Easing.out(Easing.cubic)))}
          </div>
        )}
        {f >= F(5) && <Sello x={590} y={760} at={F(5)} texto="QUEDABAN 11 DÍAS" size={58} rot={-5} color={C.tinta} />}
      </Camara>
      <Tag text="Dato" delay={2} top={TAG_TOP} sound={false} />
      <Ficha x={90} y={1372} w={640} at={F(4) + 20} etiqueta="Congreso · 16/11/2023" dato="179 sí · 171 no · hacían falta 176" fuente="Diario de Sesiones" />
      {Array.from({length: Math.floor((F(5) - F(0)) / 15)}).map((_, i) => (
        <Sfx key={i} at={F(0) + i * 15} src="tick" volume={0.25} dur={8} />
      ))}
      <Sfx at={F(2)} src="pop" volume={0.6} />
      <Sfx at={F(3)} src="whoosh_soft" volume={0.5} />
      <Sfx at={F(4) + 30} src="ding" volume={0.7} />
      <Sfx at={F(4) + 50} src="pop" volume={0.6} />
      <Sfx at={F(5)} src="stamp" volume={0.8} />
    </>
  );
};

// ---------- 4 · Navidad 2016 ----------
export const Navidad: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('04-navidad');
  const hojas = [
    ...Array.from({length: 6}).map((_, i) => ({at: F(1) + 10 + i * 12, mes: 'OCT', dia: 25 + i + 1})),
    {at: F(3), mes: 'DIC', dia: 25},
    {at: F(4) + 2, mes: 'OCT', dia: 29},
  ];
  const tiembla = f >= F(3) && f < F(4) ? Math.sin(f * 1.4) * 4 : 0;
  return (
    <>
      <Camara
        keys={[
          [0, 1.15, 640, 1000],
          [F(1), 1.0, 540, 960],
          [F(3), 1.0, 540, 960],
          [F(3) + 14, 1.12, 640, 980],
          [F(4), 1.0, 540, 960],
          [F(6), 1.0, 540, 960],
          [F(6) + 14, 1.1, 420, 900],
        ]}
      >
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <rect x={0} y={420} width={1080} height={900} fill="#E9ECE8" opacity={0.85} />
          <rect x={0} y={1320} width={1080} height={600} fill="#F7F6F2" />
          <line x1={0} y1={1320} x2={1080} y2={1320} stroke={C.tinta} strokeWidth={3} opacity={0.4} />
        </svg>
        <Lienzo>
          <Casas y={1320} />
          <g transform={`translate(${tiembla} 0)`}>
            <Abeto x={760} y={1330} s={1.25} />
            <Urna x={760} y={1340} w={170} regalo />
          </g>
          <Persona x={430} y={1360} h={290} piel={PIEL[4]} pelo="corto" ropa={ROPA.burdeos} acc="bufanda" accColor={C.dorado} gesto={[[0, 'neutral'], [F(3), 'sorpresa'], [F(6), 'contento']]} emote={[[0, null], [F(3), '!'], [F(4), null]]} semilla={5} mira={1} />
          <Persona x={960} y={1380} h={250} piel={PIEL[0]} pelo="mono" peloColor={PELO[5]} ropa={ROPA.pizarra} acc="gorro" gesto={[[0, 'neutral'], [F(3), 'sorpresa'], [F(6), 'contento']]} semilla={6} mira={-1} />
          <Nieve n={80} />
        </Lienzo>
        <Halo x={260} y={830} r={260} op={0.25} />
        <Taco x={260} y={830} w={300} mes="OCT" dia={25} anio="2016" hojas={hojas} />
        {f >= F(3) && f < F(4) + 2 && (
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <ellipse cx={260} cy={860} rx={120} ry={95} fill="none" stroke={C.burdeos} strokeWidth={7} strokeDasharray={700} strokeDashoffset={700 * (1 - ramp(f, F(3), F(3) + 10))} />
          </svg>
        )}
        {f >= F(1) + 10 && (
          <div style={{position: 'absolute', left: 120, top: 560, width: 280, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: '0.1em', color: C.burdeos}}>
            {f < F(3) ? 'LÍMITE: 31 OCT' : f < F(4) ? 'SI NO: URNAS' : 'INVESTIDURA'}
          </div>
        )}
        {f >= F(6) && <Sello x={620} y={820} at={F(6)} texto="POR 2 DÍAS" size={74} />}
      </Camara>
      <Ficha x={90} y={1372} w={660} at={F(1) + 16} etiqueta="2016 · Constitución, art. 99.5" dato="Repetidas de verdad: junio de 2016 y noviembre de 2019" fuente="BOE, disoluciones del 3/5/2016 y 24/9/2019" />
      <Sfx at={2} src="whoosh" volume={0.5} />
      <Sfx at={3} src="shimmer" volume={0.5} />
      {hojas.map((h, i) => (
        <Sfx key={i} at={h.at} src="paper" volume={0.35} dur={12} />
      ))}
      <Sfx at={F(3)} src="clack" volume={0.6} />
      <Sfx at={F(4) + 2} src="thump" volume={0.7} />
      <Sfx at={F(6)} src="stamp" volume={0.9} />
    </>
  );
};

// ---------- 5 · La regla ----------
const Gente: React.FC<{y: number; at: number; n?: number}> = ({y, at, n = 9}) => (
  <>
    {Array.from({length: n}).map((_, i) => (
      <Persona
        key={i}
        x={90 + i * 112 + (i % 2) * 10}
        y={y + (i % 2) * 34}
        h={190}
        at={at + i * 2}
        piel={PIEL[(i * 3) % 5]}
        pelo={(['corto', 'largo', 'rizado', 'mono', 'calvo', 'flequillo'] as const)[i % 6]}
        peloColor={PELO[(i * 2) % 6]}
        ropa={[ROPA.oliva, ROPA.burdeos, ROPA.pizarra, ROPA.arena, ROPA.dorado, ROPA.piedra][i % 6]}
        falda={i % 3 === 1}
        pose={[[0, 'quieto'], [at + 10 + i * 3, 'vota'], [at + 34 + i * 3, 'quieto']]}
        gesto="contento"
        semilla={i + 10}
      />
    ))}
  </>
);

export const Regla: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('05-regla');
  const E = frEnd('05-regla');
  // posiciones en un lienzo alto: gente abajo, urna, diputados, presidente arriba
  return (
    <>
      <Camara
        keys={[
          [0, 1.0, 540, 1300],
          [F(1) + 20, 1.0, 540, 1300],
          [F(1) + 70, 0.92, 540, 1000],
          [E(1) - 10, 0.92, 540, 860],
          [F(2), 0.95, 540, 1060],
          [F(3), 1.0, 540, 980],
          [F(4), 1.0, 540, 860],
        ]}
      >
        <Sala suelo={1640} pared="#F3ECDF" piso={SUELO} zocalo={false} />
        <Lienzo>
          <Gente y={1720} at={2} />
          <Urna x={540} y={1450} w={220} papeletas={6} />
          <Flecha x1={540} y1={1260} x2={540} y2={1120} at={F(1) + 40} />
          {/* fila de diputados idénticos */}
          {Array.from({length: 13}).map((_, i) => (
            <Persona key={i} x={110 + i * 72} y={1080 - (i % 2) * 18} h={150} at={F(1) + 52 + i} piel={PIEL[1]} pelo="corto" peloColor={PELO[0]} ropa={ROPA.tinta} acc="corbata" gesto="serio" semilla={20 + i} respira={false} />
          ))}
          <Flecha x1={540} y1={880} x2={540} y2={760} at={E(1) - 30} />
          {f >= F(1) + 50 && <Silla x={540} y={690} />}
          <Persona x={540} y={700} h={220} at={E(1) - 20} piel={PIEL[2]} pelo="corto" peloColor={PELO[3]} ropa={ROPA.tinta} acc="banda" gesto={[[0, 'serio'], [F(4), 'contento']]} semilla={33} />
          {f >= F(2) && <ManoPOV at={F(2)} tx={600} ty={1090} />}
        </Lienzo>
        {f >= F(1) + 60 && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 1110, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.tinta, letterSpacing: '0.06em'}}>350 DIPUTADOS</div>
        )}
        {f >= F(3) && <Halo x={540} y={1030} r={420} at={F(3)} op={0.28} />}
        {f >= F(4) && <Halo x={540} y={600} r={300} at={F(4)} op={0.35} />}
      </Camara>
      <Tag text="La regla" delay={4} top={TAG_TOP} />
      <Ficha x={90} y={1372} w={660} at={F(2)} etiqueta="Constitución, art. 99" dato="El Congreso vota al presidente: 176 votos, o más síes que noes 48 h después" />
      <Sfx at={4} src="whoosh_soft" volume={0.5} />
      {Array.from({length: 9}).map((_, i) => (
        <Sfx key={i} at={12 + i * 3} src="drop" volume={0.25} dur={10} />
      ))}
      <Sfx at={F(1) + 52} src="riser" volume={0.35} />
      <Sfx at={E(1) - 20} src="thump" volume={0.7} />
      <Sfx at={F(2)} src="whoosh" volume={0.5} />
      <Sfx at={F(4)} src="ding" volume={0.6} />
    </>
  );
};

// ---------- 6 · Quienes discrepan ----------
export const Discrepan: React.FC = () => {
  const F = fr('06-discrepan');
  return (
    <>
      <Camara keys={[[0, 1.06, 540, 1020], [F(0) + 90, 1.0, 540, 980]]}>
        <Sala suelo={1260} ventana={[540]} />
        <Lienzo>
          <Persona x={330} y={1270} h={300} piel={PIEL[0]} pelo="corto" peloColor={PELO[2]} ropa={ROPA.pizarra} acc="corbata" pose={[[0, 'quieto'], [F(0) + 40, 'mano']]} gesto="contento" semilla={40} mira={1} />
          <g transform="translate(1080 0) scale(-1 1)">
            <Persona x={330} y={1270} h={300} piel={PIEL[3]} pelo="largo" peloColor={PELO[0]} ropa={ROPA.burdeos} falda pose={[[0, 'quieto'], [F(0) + 40, 'mano']]} gesto="contento" semilla={41} />
          </g>
          <Persona x={540} y={1290} h={260} piel={PIEL[1]} pelo="calvo" peloColor={PELO[3]} ropa={ROPA.arena} acc="gafas" gesto="neutral" emote={[[0, null], [F(0) + 20, '…']]} semilla={42} />
          <Mesa x={540} y={1230} w={640} />
        </Lienzo>
      </Camara>
      <Tag text="Lo que dicen quienes discrepan" delay={3} top={TAG_TOP} />
      <Ficha x={90} y={1372} w={660} at={F(0) + 50} etiqueta="Alemania · Ley Fundamental, art. 63" dato="El Bundestag elige al canciller" />
      <Sfx at={3} src="whoosh_soft" volume={0.5} />
      <Sfx at={F(0) + 40} src="paper" volume={0.5} />
      <Sfx at={F(0) + 44} src="pop" volume={0.5} />
    </>
  );
};

// ---------- 7 · Qué proponemos ----------
export const Propuesta: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('07-propuesta');
  const E = frEnd('07-propuesta');
  const mitad = F(0) + Math.round((E(0) - F(0)) * 0.55);
  return (
    <>
      <Camara keys={[[0, 1.0, 540, 1040], [mitad, 1.0, 540, 1040], [mitad + 16, 1.0, 540, 900]]}>
        <Sala suelo={1300} />
        <Lienzo>
          <Urna x={330} y={1300} w={200} label="PRESIDENTE" />
          <Urna x={750} y={1300} w={200} label="CONGRESO" />
          <Persona x={interpolate(f, [0, 40, 60, 90], [170, 230, 600, 640], clamp)} y={1330} h={280} piel={PIEL[2]} pelo="flequillo" peloColor={PELO[1]} ropa={ROPA.oliva} falda pose={[[0, 'quieto'], [26, 'vota'], [46, 'quieto'], [80, 'vota'], [100, 'quieto']]} gesto="contento" semilla={50} />
          {f >= mitad && (
            <>
              <Persona x={300} y={860} h={220} at={mitad} piel={PIEL[1]} pelo="corto" peloColor={PELO[0]} ropa={ROPA.tinta} acc="banda" gesto={[[0, 'neutral'], [mitad + 40, 'preocupado']]} semilla={51} />
              <Pop at={mitad + 4} x={760} y={860} svg>
                <Edificio x={760} y={860} w={300} label="CONGRESO" at={mitad + 4} />
              </Pop>
              <Flecha x1={620} y1={760} x2={410} y2={740} at={mitad + 26} curva={0} />
              {f >= mitad + 36 && (
                <g transform={`translate(${430 + Math.sin(f / 6) * 8} 700)`}>
                  <circle cx={0} cy={0} r={40} fill="#E7EEF0" fillOpacity={0.6} stroke={C.tinta} strokeWidth={7} />
                  <path d="M28 28 L64 64" stroke={C.tinta} strokeWidth={12} strokeLinecap="round" />
                </g>
              )}
            </>
          )}
        </Lienzo>
      </Camara>
      <Tag text="Qué proponemos" delay={3} top={TAG_TOP} />
      <Ficha x={90} y={1372} w={660} at={mitad + 10} etiqueta="Nuestra posición" dato="Dos votos: uno para el presidente y otro para el Congreso que lo controla" />
      <Sfx at={3} src="whoosh_soft" volume={0.5} />
      <Sfx at={30} src="drop" volume={0.5} />
      <Sfx at={84} src="drop" volume={0.5} />
      <Sfx at={mitad} src="whoosh" volume={0.45} />
      <Sfx at={mitad + 36} src="pop" volume={0.5} />
    </>
  );
};

// ---------- 8 · Cierre ----------
export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('08-cierre');
  const {fps} = useVideoConfig();
  const card = (t: number) => spring({frame: f - t, fps, config: {damping: 12}});
  const tarjeta = (x: number, at: number, titulo: string, icono: React.ReactNode) => (
    <div style={{position: 'absolute', left: x, top: 945, width: 380, height: 250, background: '#FFFDF8', border: `4px solid ${C.tinta}`, borderRadius: 18, transform: `scale(${card(at)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}}>
      <svg width={160} height={130}>{icono}</svg>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.tinta, textAlign: 'center', lineHeight: 1.15, padding: '0 20px'}}>{titulo}</div>
    </div>
  );
  return (
    <>
      <OutroSol cx={540} cy={680} r={200} logoW={380} />
      {tarjeta(110, F(0), 'Que lo vote el Congreso', <><circle cx={80} cy={70} r={46} fill="none" stroke={C.tinta} strokeWidth={5} /><path d="M50 70 L110 70 M80 40 L80 100" stroke={C.dorado} strokeWidth={6} /></>)}
      {tarjeta(590, F(0) + 4, 'Votarlo tú, aparte', <><rect x={40} y={30} width={80} height={90} rx={6} fill="#E7EEF0" stroke={C.tinta} strokeWidth={5} /><rect x={58} y={14} width={44} height={30} fill="#FFFDF8" stroke={C.tinta} strokeWidth={4} /></>)}
      {f >= F(1) && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1218, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: C.burdeos, opacity: interpolate(f - F(1), [0, 6], [0, 1], clamp)}}>laaccion.com</div>
      )}
      {f >= F(2) + 20 && (
        <div style={{position: 'absolute', left: 140, right: 140, top: 1308, padding: '22px 28px', background: C.tinta, color: '#FAF7F1', borderRadius: 18, fontFamily: SANS, fontWeight: 700, fontSize: 38, textAlign: 'center', lineHeight: 1.25, transform: `translateY(${interpolate(f - F(2) - 20, [0, 10], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px)`, opacity: interpolate(f - F(2) - 20, [0, 6], [0, 1], clamp)}}>
          Mándaselo a quien crea que <span style={{color: C.dorado}}>el domingo elige presidente</span>
        </div>
      )}
      <Sfx at={0} src="whoosh" volume={0.5} />
      <Sfx at={10} src="shimmer" volume={0.45} />
      <Sfx at={F(0)} src="pop" volume={0.5} />
      <Sfx at={F(0) + 4} src="pop" volume={0.5} />
      <Sfx at={F(1)} src="ding" volume={0.6} />
      <Sfx at={F(2) + 20} src="whoosh_soft" volume={0.5} />
    </>
  );
};
