import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS, SERIF, miles} from '../../kit/brand';
import {clamp, Sfx, Tag} from '../../kit/ui';
import {Edificio} from '../../kit/figuras';
import {Camara, Ficha, Halo, OutroSol, PELO, PIEL, Persona, Pop, ROPA, Sala, Sello} from '../../kit/mundo';
import {Hemiciclo, Lienzo, ramp} from '../../kit/objetos';
import {FRASE, SC, type Id} from './timeline';

const TAG_TOP = 522;
const FUENTE_29N = 'RD 806/2026 (BOE, 6/10/2026) · INE, censo del 29N';
const fr = (id: Id) => (i: number) => SC[id].voz - SC[id].from + FRASE[id][i].from;
const frEnd = (id: Id) => (i: number) => SC[id].voz - SC[id].from + FRASE[id][i].to;

// ---------- piezas de este vídeo ----------
// Balanza: brazo que gira `ang` grados (positivo: baja el plato derecho)
const Balanza: React.FC<{cx: number; cy: number; ang: number; izq?: React.ReactNode; der?: React.ReactNode; L?: number}> = ({cx, cy, ang, izq, der, L = 300}) => {
  const a = (ang * Math.PI) / 180;
  const lx = cx - L * Math.cos(a);
  const ly = cy - L * Math.sin(a);
  const rx = cx + L * Math.cos(a);
  const ry = cy + L * Math.sin(a);
  const H = 190;
  const plato = (x: number, y: number, cont: React.ReactNode, k: string) => (
    <g key={k}>
      <path d={`M${x} ${y} L${x - 100} ${y + H} M${x} ${y} L${x + 100} ${y + H}`} stroke={C.tinta} strokeWidth={3} />
      <path d={`M${x - 130} ${y + H} Q${x} ${y + H + 60} ${x + 130} ${y + H} Z`} fill={C.dorado} stroke={C.tinta} strokeWidth={4} />
      <g transform={`translate(${x} ${y + H})`}>{cont}</g>
    </g>
  );
  return (
    <g>
      <rect x={cx - 14} y={cy} width={28} height={520} fill={C.tinta} />
      <path d={`M${cx - 150} ${cy + 540} L${cx + 150} ${cy + 540} L${cx + 110} ${cy + 500} L${cx - 110} ${cy + 500} Z`} fill={C.tinta} />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.tinta} strokeWidth={14} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={20} fill={C.dorado} stroke={C.tinta} strokeWidth={4} />
      {plato(lx, ly, izq, 'i')}
      {plato(rx, ry, der, 'd')}
    </g>
  );
};

const Papeleta: React.FC<{s?: number; texto?: string}> = ({s = 1, texto}) => (
  <g transform={`scale(${s})`}>
    <rect x={-46} y={-70} width={92} height={64} rx={4} fill="#FFFDF8" stroke={C.tinta} strokeWidth={4} />
    <path d="M-30 -50 H30 M-30 -36 H20 M-30 -22 H26" stroke={C.piedra} strokeWidth={4} />
    {texto && (
      <text x={0} y={-82} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={C.tinta} letterSpacing={2}>
        {texto}
      </text>
    )}
  </g>
);

const Cartel: React.FC<{x: number; y: number; texto: string; at: number; tachar?: number; color?: string}> = ({x, y, texto, at, tachar, color = '#3E6B4F'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const s = spring({frame: f - at, fps, config: {damping: 11, stiffness: 200}});
  const t = tachar !== undefined ? ramp(f, tachar, tachar + 8) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-6} y={0} width={12} height={170} fill="#7A5F43" />
      <rect x={-130} y={-70} width={260} height={84} rx={10} fill={color} stroke="#FFFFFF" strokeWidth={5} />
      <text x={0} y={-14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={44} fill="#FFFFFF" letterSpacing={3}>
        {texto}
      </text>
      {t > 0 && (
        <g stroke={C.burdeos} strokeWidth={14} strokeLinecap="round">
          <line x1={-120} y1={-66} x2={-120 + 240 * t} y2={-66 + 96 * t} />
          <line x1={120} y1={-66} x2={120 - 240 * Math.max(0, t * 2 - 1)} y2={-66 + 96 * Math.max(0, t * 2 - 1)} />
        </g>
      )}
    </g>
  );
};

// Ciudad: edificios altos con ventanas
const Ciudad: React.FC<{y: number}> = ({y}) => (
  <g>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const w = 130 + (i % 3) * 20;
      const h = 380 + ((i * 97) % 5) * 70;
      const x = -60 + i * 175;
      return (
        <g key={i}>
          <rect x={x} y={y - h} width={w} height={h} fill={i % 2 ? '#D9CEBB' : '#E3D9C7'} stroke={C.tinta} strokeWidth={3} opacity={0.95} />
          {Array.from({length: Math.floor(h / 70)}).map((_, r) =>
            [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={x + 16 + c * (w - 32) / 3} y={y - h + 24 + r * 70} width={(w - 32) / 3 - 12} height={34} fill={(r * 3 + c + i) % 4 ? '#F1D79A' : '#B9B2A6'} opacity={0.9} />),
          )}
        </g>
      );
    })}
  </g>
);

// Pueblo: colinas y unas pocas casas con iglesia
const Pueblo: React.FC<{y: number}> = ({y}) => (
  <g>
    <path d={`M-300 ${y} Q100 ${y - 260} 420 ${y - 120} Q760 ${y - 330} 1380 ${y - 80} L1380 ${y} Z`} fill="#D8CBAE" />
    <path d={`M-300 ${y} Q300 ${y - 150} 700 ${y - 60} Q1000 ${y - 170} 1380 ${y - 30} L1380 ${y} Z`} fill="#CDBD9C" />
    {[
      [260, 0.9],
      [380, 0.8],
      [520, 1.0],
      [660, 0.85],
    ].map(([x, s], i) => (
      <g key={i} transform={`translate(${x} ${y - 70}) scale(${s})`}>
        <rect x={-50} y={-90} width={100} height={90} fill="#E9DDC6" stroke={C.tinta} strokeWidth={3} />
        <path d="M-62 -90 L0 -140 L62 -90 Z" fill="#A86B4C" stroke={C.tinta} strokeWidth={3} />
        <rect x={-14} y={-44} width={28} height={44} fill="#8E7253" />
      </g>
    ))}
    <g transform={`translate(820 ${y - 100})`}>
      <rect x={-40} y={-220} width={80} height={220} fill="#E2D3B6" stroke={C.tinta} strokeWidth={3} />
      <path d="M-50 -220 L0 -290 L50 -220 Z" fill="#A86B4C" stroke={C.tinta} strokeWidth={3} />
      <rect x={-14} y={-180} width={28} height={40} rx={14} fill="#8E7253" />
    </g>
  </g>
);

// Multitud de cabezas con cuerpo (gente) en filas
const Gente: React.FC<{x0: number; y0: number; cols: number; rows: number; gap: number; h: number; at: number; every?: number}> = ({x0, y0, cols, rows, gap, h, at, every = 1}) => (
  <>
    {Array.from({length: cols * rows}).map((_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      return (
        <Persona
          key={i}
          x={x0 + c * gap + (r % 2) * (gap / 2)}
          y={y0 + r * h * 0.42}
          h={h}
          at={at + (c + r * 2) * every}
          piel={PIEL[(i * 7) % 5]}
          pelo={(['corto', 'largo', 'rizado', 'mono', 'calvo', 'flequillo'] as const)[(i * 5) % 6]}
          peloColor={PELO[(i * 3) % 6]}
          ropa={[ROPA.oliva, ROPA.burdeos, ROPA.pizarra, ROPA.arena, ROPA.dorado, ROPA.piedra, ROPA.crema][(i * 3) % 7]}
          gesto="neutral"
          respira={false}
          semilla={i}
        />
      );
    })}
  </>
);

const Cuenta: React.FC<{x: number; y: number; at: number; a: string; b: string; r: number; color?: string}> = ({x, y, at, a, b, r, color = C.tinta}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = interpolate(f - at, [0, 6], [0, 1], clamp);
  const v = Math.round(r * ramp(f, at + 14, at + 40, Easing.out(Easing.cubic)));
  return (
    <div style={{position: 'absolute', left: x - 420, top: y, width: 840, textAlign: 'center', fontFamily: SANS, opacity: o}}>
      <div style={{fontSize: 46, fontWeight: 700, color: C.piedra, fontVariantNumeric: 'tabular-nums'}}>
        {a} ÷ {b} =
      </div>
      <div style={{fontFamily: SERIF, fontSize: 150, fontWeight: 700, lineHeight: 1.05, color}}>{miles(v)}</div>
      <div style={{fontSize: 34, fontWeight: 700, color: C.piedra, letterSpacing: '0.12em'}}>ELECTORES POR DIPUTADO</div>
    </div>
  );
};

// ---------- 1 · Gancho ----------
export const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('01-gancho');
  const E = frEnd('01-gancho');
  const caidaI = interpolate(f, [4, 14], [-700, 0], {...clamp, easing: Easing.in(Easing.quad)});
  const caidaD = interpolate(f, [12, 22], [-700, 0], {...clamp, easing: Easing.in(Easing.quad)});
  // equilibrio y luego se hunde el plato derecho (provincia misteriosa)
  const baja = spring({frame: f - (F(1) + 34), fps: 30, config: {damping: 6, stiffness: 90}});
  const tiembla = f > 14 && f < 40 ? Math.sin(f * 1.6) * 2 * (1 - (f - 14) / 26) : 0;
  const ang = tiembla + 18 * baja;
  return (
    <>
      <Camara keys={[[0, 1.12, 540, 900], [F(1), 1.0, 540, 940], [F(1) + 40, 1.0, 540, 940], [F(2), 1.06, 640, 960], [E(3), 1.06, 640, 960]]}>
        <Sala suelo={1330} />
        <Halo x={540} y={820} r={380} op={0.25} />
        <Lienzo>
          <Balanza
            cx={540}
            cy={760}
            ang={ang}
            izq={<g transform={`translate(0 ${caidaI})`}><Papeleta s={1.1} texto="MADRID" /></g>}
            der={
              <g transform={`translate(0 ${caidaD})`}>
                <Papeleta s={1.1} texto={f >= F(1) + 34 ? '' : '¿…?'} />
                {f >= F(1) + 34 && [-36, 0, 36].map((dx, i) => <g key={i} transform={`translate(${dx} ${-16 - i * 6})`}><Papeleta s={0.9} /></g>)}
              </g>
            }
          />
          <Persona x={150} y={1340} h={300} piel={PIEL[0]} pelo="flequillo" peloColor={PELO[1]} ropa={ROPA.pizarra} pose={[[0, 'quieto'], [4, 'vota'], [18, 'quieto']]} gesto={[[0, 'neutral'], [F(1) + 36, 'sorpresa'], [F(3), 'duda']]} emote={[[0, null], [F(1) + 36, '!'], [F(2), null]]} semilla={1} mira={1} />
          <Persona x={935} y={1340} h={300} piel={PIEL[3]} pelo="rizado" peloColor={PELO[0]} ropa={ROPA.oliva} pose={[[0, 'quieto'], [12, 'vota'], [26, 'quieto']]} gesto={[[0, 'neutral'], [F(0) + 20, 'duda'], [F(1) + 36, 'contento']]} emote={[[0, null], [F(0) + 20, '?'], [F(1), null]]} semilla={2} mira={-1} />
          <Cartel x={690} y={1170} texto="SORIA" at={F(2)} tachar={F(3) + 6} />
        </Lienzo>
        {f >= F(1) + 36 && (
          <div style={{position: 'absolute', left: 640, top: 560, fontFamily: SANS, fontWeight: 900, fontSize: 120, color: C.burdeos, transform: `rotate(-6deg) scale(${spring({frame: f - F(1) - 36, fps: 30, config: {damping: 8}})})`}}>×4</div>
        )}
      </Camara>
      <Sfx at={13} src="drop" volume={0.6} />
      <Sfx at={21} src="drop" volume={0.6} />
      <Sfx at={F(1) + 34} src="clunk" volume={0.9} />
      <Sfx at={F(1) + 36} src="stamp" volume={0.6} />
      <Sfx at={F(2)} src="pop" volume={0.6} />
      <Sfx at={F(3) + 6} src="clack" volume={0.7} />
    </>
  );
};

// ---------- 2 · Madrid ----------
export const Madrid: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('02-madrid');
  return (
    <>
      <Camara keys={[[0, 1.0, 540, 1000], [F(1), 1.0, 540, 960], [F(2), 1.0, 540, 960], [F(2) + 30, 1.05, 540, 930]]}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <rect x={-900} y={-900} width={2880} height={2240} fill="#ECE4D6" opacity={0.85} />
          <rect x={-900} y={1340} width={2880} height={1600} fill="#E2D7C3" />
          <line x1={-900} y1={1340} x2={1980} y2={1340} stroke={C.tinta} strokeWidth={3} opacity={0.5} />
        </svg>
        <Lienzo>
          <g opacity={0.6}>
            <Ciudad y={1340} />
          </g>
          {/* 38 diputados en dos filas */}
          {Array.from({length: 38}).map((_, i) => (
            <Persona key={i} x={95 + (i % 19) * 49} y={i < 19 ? 930 : 1005} h={110} at={F(1) + 6 + i} piel={PIEL[1]} pelo="corto" peloColor={PELO[0]} ropa={ROPA.tinta} acc="corbata" gesto="serio" respira={false} semilla={i} />
          ))}
          <Gente x0={40} y0={1180} cols={12} rows={3} gap={88} h={150} at={F(1) + 30} every={0.6} />
        </Lienzo>
        <div style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 96, color: C.tinta, letterSpacing: '0.08em', opacity: interpolate(f, [2, 10], [0, 1], clamp)}}>MADRID</div>
        {f >= F(1) + 6 && <div style={{position: 'absolute', left: 0, right: 0, top: 712, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.burdeos}}>38 DIPUTADOS · 5,5 MILLONES DE ELECTORES</div>}
      </Camara>
      {f >= F(2) - 6 && (
        <div style={{position: 'absolute', inset: 0, background: 'rgba(250,247,241,0.96)', opacity: interpolate(f - F(2) + 6, [0, 6], [0, 1], clamp)}}>
          <Cuenta x={540} y={660} at={F(2) - 6} a="5.536.913" b="38" r={145708} />
        </div>
      )}
      <Ficha x={90} y={1372} w={680} at={F(1) + 20} etiqueta="Madrid · 29N" dato="38 diputados · 5.536.913 electores" fuente={FUENTE_29N} />
      <Tag text="Dato" delay={3} top={TAG_TOP} />
      <Sfx at={2} src="whoosh" volume={0.5} />
      <Sfx at={F(1) + 6} src="riser" volume={0.35} />
      {Array.from({length: 10}).map((_, i) => (
        <Sfx key={i} at={F(1) + 30 + i * 3} src="tick" volume={0.25} dur={8} />
      ))}
      <Sfx at={F(2) - 6} src="key" volume={0.5} />
      <Sfx at={F(2) + 34} src="ding" volume={0.55} />
    </>
  );
};

// ---------- 3 · Teruel ----------
export const Teruel: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('03-teruel');
  return (
    <>
      <Camara keys={[[0, 1.1, 300, 1000], [F(1), 1.0, 540, 980], [F(3), 1.0, 540, 980], [F(3) + 30, 1.03, 540, 960]]}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <rect x={-900} y={-900} width={2880} height={2240} fill="#EEE6D3" opacity={0.85} />
          <rect x={-900} y={1340} width={2880} height={1600} fill="#D9CBAA" />
        </svg>
        <Lienzo>
          <Pueblo y={1340} />
          <g transform="translate(0 0)">
            <Pop at={F(1)} x={540} y={760} svg>
              <rect x={290} y={640} width={500} height={120} rx={14} fill="#3E6B4F" stroke="#FFFFFF" strokeWidth={6} />
              <text x={540} y={725} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={72} fill="#FFFFFF" letterSpacing={6}>
                TERUEL
              </text>
            </Pop>
          </g>
          {[0, 1, 2].map((i) => (
            <Persona key={i} x={420 + i * 120} y={1000} h={150} at={F(2) + 4 + i * 4} piel={PIEL[1]} pelo="corto" peloColor={PELO[0]} ropa={ROPA.tinta} acc="corbata" gesto="contento" semilla={30 + i} />
          ))}
          <Gente x0={150} y0={1300} cols={8} rows={1} gap={110} h={170} at={F(2) + 16} every={1.2} />
          {f < F(1) && <text x={540} y={760} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={160} fill={C.burdeos} opacity={0.85}>?</text>}
        </Lienzo>
        {f >= F(2) && <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.burdeos}}>3 DIPUTADOS · 106.251 ELECTORES</div>}
      </Camara>
      {f >= F(3) - 6 && (
        <div style={{position: 'absolute', inset: 0, background: 'rgba(250,247,241,0.96)', opacity: interpolate(f - F(3) + 6, [0, 6], [0, 1], clamp)}}>
          <Cuenta x={540} y={600} at={F(3) - 6} a="106.251" b="3" r={35417} color={C.burdeos} />
          {f >= F(3) + 34 && (
            <div style={{position: 'absolute', left: 140, right: 140, top: 1010, fontFamily: SANS}}>
              {[
                ['Teruel', 4.11, C.burdeos],
                ['Madrid', 1, C.piedra],
              ].map(([n, v, c], i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16}}>
                  <div style={{width: 190, fontSize: 44, fontWeight: 700, color: C.tinta}}>{n as string}</div>
                  <div style={{height: 58, width: `${((v as number) / 4.11) * 62 * ramp(f, F(3) + 34, F(3) + 50)}%`, background: c as string, borderRadius: 8}} />
                  <div style={{fontSize: 46, fontWeight: 800, color: c as string}}>×{String(v).replace('.', ',')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <Ficha x={90} y={1372} w={680} at={F(2) + 10} etiqueta="Teruel · 29N" dato="3 diputados · 106.251 electores" fuente={FUENTE_29N} />
      <Sfx at={2} src="whoosh" volume={0.55} />
      <Sfx at={F(1)} src="stamp" volume={0.8} />
      <Sfx at={F(2) + 4} src="pop" volume={0.5} />
      <Sfx at={F(2) + 8} src="pop" volume={0.5} />
      <Sfx at={F(2) + 12} src="pop" volume={0.5} />
      <Sfx at={F(3) - 6} src="key" volume={0.5} />
      <Sfx at={F(3) + 34} src="riser" volume={0.4} />
    </>
  );
};

// ---------- 4 · La regla ----------
const RANKING: Array<[string, number]> = [
  ['1.º Teruel', 4.11],
  ['2.º Soria', 3.78],
  ['3.º Segovia', 3.6],
  ['…', 0],
  ['49.º Barcelona', 1.06],
  ['50.º A Coruña', 1.05],
  ['51.º Asturias', 1.04],
  ['52.º Madrid', 1.0],
];
export const Regla: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('04-regla');
  const verRanking = f >= F(5) - 4;
  return (
    <>
      <Camara keys={[[0, 1.0, 540, 960], [F(4), 1.0, 540, 960], [F(4) + 40, 1.04, 540, 930]]}>
        <Sala suelo={1330} pared="#EFE6D6" piso="#E2D5BF" zocalo={false} />
        <Lienzo>
          {/* libro de la ley */}
          {f < F(3) + 10 && (
            <g transform={`translate(540 860) scale(${spring({frame: f - F(0), fps: 30, config: {damping: 12}}) * (f >= F(0) ? 1 : 0)})`} opacity={f >= F(2) ? 1 : 0.35}>
              <path d="M-260 -150 Q-130 -190 0 -150 L0 170 Q-130 130 -260 170 Z" fill="#FFFDF8" stroke={C.tinta} strokeWidth={5} />
              <path d="M260 -150 Q130 -190 0 -150 L0 170 Q130 130 260 170 Z" fill="#FFFDF8" stroke={C.tinta} strokeWidth={5} />
              <text x={-130} y={-60} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={40} fill={C.burdeos}>Constitución</text>
              <text x={-130} y={0} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={34} fill={C.tinta}>art. 68.2</text>
              <text x={130} y={-60} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={40} fill={C.burdeos}>LOREG</text>
              <text x={130} y={0} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={34} fill={C.tinta}>art. 162</text>
              {[50, 80, 110].map((y) => (
                <g key={y}>
                  <line x1={-220} y1={y} x2={-40} y2={y} stroke={C.piedra} strokeWidth={5} />
                  <line x1={40} y1={y} x2={220} y2={y} stroke={C.piedra} strokeWidth={5} />
                </g>
              ))}
            </g>
          )}
          {/* 2 por provincia: 50 casillas que reciben sus dos asientos */}
          {f >= F(3) + 10 && f < F(4) && (
            <g>
              <text x={540} y={628} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={C.burdeos} letterSpacing={2}>
                50 PROVINCIAS × 2 + CEUTA Y MELILLA
              </text>
              {Array.from({length: 50}).map((_, i) => {
                const x = 140 + (i % 10) * 88;
                const y = 690 + Math.floor(i / 10) * 110;
                const on = f >= F(3) + 14 + i * 1.2;
                return (
                  <g key={i}>
                    <rect x={x - 38} y={y - 40} width={76} height={80} rx={8} fill="#FFFDF8" stroke={C.tinta} strokeWidth={3} />
                    {on && (
                      <>
                        <circle cx={x - 14} cy={y} r={13} fill={C.dorado} />
                        <circle cx={x + 14} cy={y} r={13} fill={C.dorado} />
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          )}
          {f >= F(4) && !verRanking && <Hemiciclo cx={540} cy={1080} si={102} t0={F(4) + 4} dur={36} />}
          {f >= F(4) && !verRanking && (
            <g>
              {/* gente esperando a que la cuenten */}
              {Array.from({length: 9}).map((_, i) => (
                <Persona key={i} x={110 + i * 108} y={1330} h={170} at={F(4) + i} piel={PIEL[(i * 2) % 5]} pelo={(['corto', 'largo', 'rizado'] as const)[i % 3]} peloColor={PELO[i % 6]} ropa={[ROPA.oliva, ROPA.burdeos, ROPA.pizarra, ROPA.arena][i % 4]} gesto="duda" emote={i === 4 ? '?' : null} semilla={50 + i} />
              ))}
            </g>
          )}
        </Lienzo>
        {f >= F(4) + 8 && !verRanking && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 130, color: C.dorado}}>
            {Math.round(102 * ramp(f, F(4) + 4, F(4) + 40, Easing.out(Easing.cubic)))}
            <span style={{fontFamily: SANS, fontSize: 44, color: C.tinta, marginLeft: 14}}>de 350</span>
          </div>
        )}
        {verRanking && (
          <div style={{position: 'absolute', left: 120, right: 120, top: 610, fontFamily: SANS}}>
            <div style={{fontSize: 30, fontWeight: 700, letterSpacing: '0.12em', color: C.piedra, marginBottom: 18}}>PESO DEL VOTO (MADRID = 1)</div>
            {RANKING.map(([n, v], i) => {
              const k = ramp(f, F(5) - 4 + i * 3, F(5) + 10 + i * 3);
              const mad = n.includes('Madrid');
              if (v === 0)
                return (
                  <div key={i} style={{fontSize: 40, color: C.piedra, margin: '4px 0 12px 8px', opacity: k}}>
                    ⋮
                  </div>
                );
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, opacity: k}}>
                  <div style={{width: 280, fontSize: 34, fontWeight: mad ? 800 : 600, color: mad ? C.burdeos : C.tinta}}>{n}</div>
                  <div style={{height: 40, width: `${(v / 4.11) * 52 * k}%`, background: mad ? C.burdeos : C.dorado, borderRadius: 6}} />
                  <div style={{fontSize: 32, fontWeight: 700, color: mad ? C.burdeos : C.piedra}}>{String(v).replace('.', ',')}</div>
                </div>
              );
            })}
          </div>
        )}
        {f >= F(6) + 10 && <Sello x={760} y={1170} at={F(6) + 10} texto="LA ÚLTIMA" size={62} />}
      </Camara>
      <Tag text="La regla" delay={F(2)} top={TAG_TOP} />
      {!verRanking ? (
        <Ficha x={90} y={1372} w={700} at={F(3) + 12} etiqueta="Constitución, art. 68.2 · LOREG, art. 162" dato="Mínimo de 2 diputados por provincia; Ceuta y Melilla, 1 cada una: 102 de 350" />
      ) : (
        <Ficha x={90} y={1372} w={700} at={F(5) + 4} etiqueta="Electores por diputado" dato="Teruel 35.417 · Madrid 145.708" fuente={`Cálculo de La Acción · ${FUENTE_29N}`} />
      )}
      <Sfx at={F(1)} src="thump" volume={0.5} />
      <Sfx at={F(2)} src="paper" volume={0.6} />
      {Array.from({length: 10}).map((_, i) => (
        <Sfx key={i} at={F(3) + 14 + i * 6} src="tick" volume={0.25} dur={8} />
      ))}
      <Sfx at={F(4) + 4} src="shimmer" volume={0.5} />
      <Sfx at={F(5) - 4} src="whoosh_soft" volume={0.5} />
      <Sfx at={F(6) + 10} src="stamp" volume={0.85} />
    </>
  );
};

// ---------- 5 · Quienes discrepan y nuestra respuesta ----------
export const Discrepan: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('05-discrepan');
  const senado = f >= F(2);
  return (
    <>
      <Camara keys={[[0, 1.05, 540, 1000], [F(1), 1.0, 540, 980], [F(2), 1.0, 540, 980], [F(2) + 20, 1.0, 540, 960]]}>
        {!senado ? (
          <>
            <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <rect x={-900} y={-900} width={2880} height={2240} fill="#EEE6D3" opacity={0.85} />
              <rect x={-900} y={1340} width={2880} height={1600} fill="#D9CBAA" />
            </svg>
            <Lienzo>
              <Pueblo y={1340} />
              <Persona x={540} y={1330} h={320} piel={PIEL[0]} pelo="calvo" peloColor={PELO[3]} ropa={ROPA.oliva} acc="gorro" accColor={C.burdeos} pose={[[0, 'habla'], [F(1), 'quieto']]} gesto={[[0, 'preocupado'], [F(1), 'contento']]} semilla={70} />
            </Lienzo>
            <div
              style={{
                position: 'absolute',
                left: 250,
                right: 250,
                top: 640,
                padding: '22px 26px',
                background: '#FFFDF8',
                border: `4px solid ${C.tinta}`,
                borderRadius: 22,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 38,
                lineHeight: 1.2,
                textAlign: 'center',
                color: C.tinta,
                transform: `scale(${spring({frame: f - 4, fps: 30, config: {damping: 12}})})`,
              }}
            >
              «Sin ese mínimo, aquí no pintaríamos nada»
            </div>
          </>
        ) : (
          <>
            <Sala suelo={1330} pared="#F1EADD" />
            <Lienzo>
              <Pop at={F(2)} x={540} y={1000} svg>
                <Edificio x={540} y={1060} w={560} label="SENADO" at={F(2)} />
              </Pop>
              {[0, 1, 2, 3].map((i) => (
                <Persona key={i} x={300 + i * 160} y={1330} h={230} at={F(3) + i * 5} piel={PIEL[(i * 2 + 1) % 5]} pelo={(['corto', 'largo', 'calvo', 'mono'] as const)[i]} peloColor={PELO[(i * 2) % 6]} ropa={[ROPA.tinta, ROPA.burdeos, ROPA.pizarra, ROPA.piedra][i]} falda={i % 2 === 1} acc="corbata" accColor={C.dorado} gesto="contento" semilla={80 + i} />
              ))}
            </Lienzo>
            {f >= F(3) + 10 && <div style={{position: 'absolute', left: 0, right: 0, top: 610, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 64, color: C.burdeos}}>4 POR PROVINCIA</div>}
          </>
        )}
        {f >= F(1) && f < F(2) && <Sello x={540} y={1000} at={F(1)} texto="✓ TIENE PARTE DE RAZÓN" size={50} rot={-4} color="#4E6B3F" />}
      </Camara>
      {!senado && <Tag text="Lo que dicen quienes discrepan" delay={3} top={TAG_TOP} sound={false} />}
      {senado && <Tag text="Nuestra respuesta" delay={F(2)} top={TAG_TOP} />}
      {senado && <Ficha x={90} y={1372} w={660} at={F(3) + 6} etiqueta="Constitución, art. 69.2" dato="En cada provincia se eligen 4 senadores" />}
      <Sfx at={3} src="stamp" volume={0.5} />
      <Sfx at={6} src="paper" volume={0.5} />
      <Sfx at={F(1)} src="ding" volume={0.5} />
      <Sfx at={F(2)} src="whoosh" volume={0.5} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} at={F(3) + i * 5} src="pop" volume={0.45} />
      ))}
    </>
  );
};

// ---------- 6 · Qué proponemos ----------
const HEX = (cx: number, cy: number, r: number) => Array.from({length: 6}).map((_, i) => `${cx + r * Math.cos((Math.PI / 3) * i + Math.PI / 6)},${cy + r * Math.sin((Math.PI / 3) * i + Math.PI / 6)}`).join(' ');
export const Propuesta: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('06-propuesta');
  const r = 108;
  const celdas: Array<[number, number]> = [];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) celdas.push([200 + col * r * Math.sqrt(3) + (row % 2) * (r * Math.sqrt(3)) / 2, 770 + row * r * 1.5]);
  const foco = 9;
  return (
    <>
      <Camara keys={[[0, 1.0, 540, 900], [F(1), 1.0, 540, 900], [F(1) + 40, 1.4, celdas[foco][0], celdas[foco][1] - 60]]}>
        <Lienzo>
          {celdas.map(([x, y], i) => {
            const on = f >= 6 + i * 2;
            return (
              <g key={i} opacity={on ? 1 : 0}>
                <polygon points={HEX(x, y, r - 6)} fill={i === foco && f >= F(1) ? '#F3E6C8' : '#FFFDF8'} stroke={C.tinta} strokeWidth={4} />
                <Persona x={x} y={y + 50} h={110} at={6 + i * 2} piel={PIEL[(i * 3) % 5]} pelo={(['corto', 'largo', 'calvo', 'mono', 'rizado'] as const)[i % 5]} peloColor={PELO[(i * 5) % 6]} ropa={ROPA.tinta} acc="corbata" gesto={i === foco && f >= F(1) + 40 ? 'contento' : 'neutral'} pose={i === foco && f >= F(1) + 40 ? 'habla' : 'quieto'} respira={false} semilla={i} />
                {[-62, 62].map((dx, j) => (
                  <Persona key={j} x={x + dx} y={y + 66} h={70} at={10 + i * 2} piel={PIEL[(i + j) % 5]} pelo={j ? 'largo' : 'corto'} peloColor={PELO[(i + j * 2) % 6]} ropa={[ROPA.oliva, ROPA.burdeos, ROPA.pizarra, ROPA.arena][(i + j) % 4]} gesto="neutral" respira={false} semilla={i * 2 + j} />
                ))}
              </g>
            );
          })}
        </Lienzo>
        {f >= F(1) + 50 && (
          <div style={{position: 'absolute', left: celdas[foco][0] - 120, top: celdas[foco][1] - 120, padding: '6px 12px', background: '#FFFDF8', border: `3px solid ${C.tinta}`, borderRadius: 12, fontFamily: SANS, fontWeight: 700, fontSize: 20, color: C.tinta}}>
            Tu diputado, con nombre
          </div>
        )}
      </Camara>
      {f < F(1) + 30 && <div style={{position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.burdeos, opacity: interpolate(f, [F(1) + 20, F(1) + 30], [1, 0], clamp)}}>MISMA POBLACIÓN EN CADA DISTRITO</div>}
      <Tag text="Qué proponemos" delay={3} top={TAG_TOP} />
      <Ficha x={90} y={1372} w={660} at={F(0) + 30} etiqueta="Nuestra posición" dato="Distritos de igual población, cada uno con su diputado" />
      {Array.from({length: 8}).map((_, i) => (
        <Sfx key={i} at={6 + i * 4} src="tick" volume={0.3} dur={8} />
      ))}
      <Sfx at={F(1)} src="whoosh_soft" volume={0.5} />
      <Sfx at={F(1) + 50} src="pop" volume={0.5} />
    </>
  );
};

// ---------- 7 · Cierre ----------
export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const F = fr('07-cierre');
  const {fps} = useVideoConfig();
  return (
    <>
      <OutroSol cx={540} cy={800} r={330} logoW={860} />
      {f >= F(1) && (
        <div style={{position: 'absolute', left: 150, right: 150, top: 1185, padding: '18px 24px', background: '#FFFDF8', border: `4px solid ${C.tinta}`, borderRadius: 18, fontFamily: SANS, fontWeight: 700, fontSize: 38, textAlign: 'center', color: C.tinta, transform: `scale(${spring({frame: f - F(1), fps, config: {damping: 12}})})`}}>
          Pregúntanos tu provincia en comentarios
        </div>
      )}
      {f >= F(2) && (
        <div style={{position: 'absolute', left: 150, right: 150, top: 1330, padding: '20px 24px', background: C.tinta, color: '#FAF7F1', borderRadius: 18, fontFamily: SANS, fontWeight: 700, fontSize: 40, textAlign: 'center', transform: `translateY(${interpolate(f - F(2), [0, 10], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px)`, opacity: interpolate(f - F(2), [0, 6], [0, 1], clamp)}}>
          Mándaselo a alguien de <span style={{color: C.dorado}}>Teruel</span>
        </div>
      )}
      <Sfx at={0} src="whoosh" volume={0.5} />
      <Sfx at={10} src="shimmer" volume={0.5} />
      <Sfx at={F(1)} src="pop" volume={0.5} />
      <Sfx at={F(2)} src="whoosh_soft" volume={0.5} />
    </>
  );
};
