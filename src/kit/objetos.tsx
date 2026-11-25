import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, SANS, SERIF} from './brand';
import {clamp} from './ui';
import {PIEL, ROPA} from './mundo';

// Objetos reutilizables de los reels (calendario de taco, urna, hemiciclo, marcador, atril, reloj de arena, abeto, nieve, casas, mano en primer plano, flecha, silla)
export const Lienzo: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);
export const ramp = (f: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

// ---------- objetos ----------
export const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// Calendario de taco: muestra (mes, día, año); las hojas arrancadas salen volando
export const Taco: React.FC<{x: number; y: number; w?: number; mes: string; dia: number | string; anio?: string; hojas?: Array<{at: number; mes: string; dia: number | string}>}> = ({
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

export const Urna: React.FC<{x: number; y: number; w?: number; label?: string; papeletas?: number; regalo?: boolean}> = ({x, y, w = 220, label, papeletas = 4, regalo}) => {
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

export const Mesa: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 420}) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={22} fill="#9C7E5C" />
    <rect x={x - w / 2 + 20} y={y + 22} width={w - 40} height={110} fill="#B3936D" />
    <line x1={x - w / 2 + 20} y1={y + 132} x2={x + w / 2 - 20} y2={y + 132} stroke={C.tinta} strokeWidth={2} opacity={0.3} />
  </g>
);

// Hemiciclo: 350 escaños; `si` y `no` (cuántos) y desde qué fotograma se encienden
export const ESC: Array<{x: number; y: number; a: number}> = (() => {
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
export const Hemiciclo: React.FC<{cx: number; cy: number; si?: number; no?: number; t0?: number; dur?: number; noT0?: number}> = ({cx, cy, si = 0, no = 0, t0 = 0, dur = 40, noT0}) => {
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
export const Marcador: React.FC<{x: number; y: number; titulo: string; si: number; no?: number; t0: number; dur?: number}> = ({x, y, titulo, si, no, t0, dur = 40}) => {
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
export const BarraMayoria: React.FC<{x: number; y: number; valor: number; t0: number; dur?: number; w?: number}> = ({x, y, valor, t0, dur = 40, w = 760}) => {
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

export const Atril: React.FC<{x: number; y: number; label?: string}> = ({x, y, label}) => (
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

export const RelojArena: React.FC<{x: number; y: number; t0: number; t1: number; para?: number}> = ({x, y, t0, t1, para}) => {
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

export const Abeto: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-16} y={-40} width={32} height={40} fill="#7A5F43" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M0 ${-300 + i * 70} L${110 + i * 25} ${-120 + i * 70 - 40} L${-110 - i * 25} ${-120 + i * 70 - 40} Z`} fill={i % 2 ? '#5E6B4E' : '#6B7858'} />
    ))}
    <path d="M-80 -180 Q0 -150 70 -200 M-110 -110 Q0 -80 105 -130" stroke={C.burdeos} strokeWidth={5} fill="none" />
    <path d="M0 -318 L8 -300 L27 -300 L12 -289 L18 -270 L0 -281 L-18 -270 L-12 -289 L-27 -300 L-8 -300 Z" fill={C.dorado} />
  </g>
);

export const Nieve: React.FC<{n?: number; at?: number}> = ({n = 70, at = 0}) => {
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

export const Casas: React.FC<{y: number}> = ({y}) => {
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
export const ManoPOV: React.FC<{at: number; tx: number; ty: number}> = ({at, tx, ty}) => {
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

export const Flecha: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; dur?: number; curva?: number}> = ({x1, y1, x2, y2, at, dur = 14, curva = 0}) => {
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

export const Silla: React.FC<{x: number; y: number; vacia?: boolean}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-70} y={-250} width={140} height={150} rx={30} fill={C.burdeos} />
    <rect x={-84} y={-110} width={168} height={46} rx={14} fill="#8E3A42" />
    <path d="M-60 -64 L-66 0 M60 -64 L66 0" stroke="#5A4634" strokeWidth={12} strokeLinecap="round" />
  </g>
);

