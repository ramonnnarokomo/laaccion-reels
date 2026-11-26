import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {C, SANS, SERIF} from '../../../kit/brand';
import {clamp, Sfx, Tag} from '../../../kit/ui';
import {Bocadillo} from '../../../kit/figuras';
import {Camara, Halo, PARTIDOS, PELO, PIEL, Persona, ROPA, Sala, Sello, Siglas} from '../../../kit/mundo';
import {Flecha, Lienzo, ramp, Taco} from '../../../kit/objetos';
import {Destello, FotoReal, FuenteMini, Pildora, Recorte, Temblor} from '../../../kit/real';
import {Carpeta, Corona, Libro, Lupa, Magistrados, Pergamino, Prueba, Siguiente} from '../comun';
import {E, F} from './timeline';

const TAG_TOP = 522;
const DORADO_OSC = '#8A6A2E';

// Narrador: el mismo personaje en toda la serie.
const Narrador: React.FC<{x: number; y: number; h?: number; at?: number; gesto?: any; pose?: any; emote?: any; mira?: number}> = (p) => (
  <Lienzo>
  <Persona x={p.x} y={p.y} h={p.h ?? 330} at={p.at ?? 0} piel={PIEL[2]} pelo="corto" peloColor={PELO[0]} ropa={ROPA.burdeos} pantalon={ROPA.tinta} gesto={p.gesto ?? 'neutral'} pose={p.pose ?? 'quieto'} emote={p.emote ?? null} semilla={7} mira={p.mira} />
  </Lienzo>
);

// ---------- 1 · Gancho ----------
export const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('01-gancho');
  return (
    <>
      <Camara keys={[[0, 1.05, 540, 980], [Fi(1), 1.0, 540, 960], [Fi(3), 1.0, 540, 960], [Fi(3) + 40, 1.06, 600, 920]]}>
        <Sala suelo={1500} />
        <Halo x={620} y={900} r={420} op={0.3} />
        <Narrador
          x={210}
          y={1500}
          gesto={[[0, 'sorpresa'], [Fi(1), 'contento'], [Fi(2), 'serio'], [Fi(3), 'contento']]}
          pose={[[0, 'quieto'], [Fi(1), 'mano'], [Fi(2), 'quieto'], [Fi(3), 'senala']]}
          emote={[[0, '!'], [Fi(1), null]]}
          mira={1}
        />
        <Libro x={640} y={700} w={340} at={2} out={Fi(1) + 2} />
        <Pergamino x={640} y={640} w={390} at={Fi(2) + 2} />
        {f >= Fi(3) && <Lupa x={600} y={830} at={Fi(3)} r={105} />}
      </Camara>
      <FotoReal src="img/constitucion/boe1978_portada.png" pie="BOE · 29 de diciembre de 1978" x={640} y={600} w={600} h={556} at={Fi(1)} out={Fi(2) - 2} zoom={[1.0, 1.1]} foco={[50, 40]} />
      <Pildora text="La prueba de 1789" x={640} y={1210} at={Fi(2) + 12} apaga={Fi(3) + 4} />
      <Pildora text="Dos preguntas" x={640} y={1300} at={Fi(3) + 4} variante="blanco" />
      <Sfx at={2} src="thump" volume={0.6} />
      <Sfx at={Fi(1)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(2) + 2} src="paper" volume={0.6} />
      <Sfx at={Fi(2) + 12} src="pop" volume={0.45} />
      <Sfx at={Fi(3)} src="whoosh_soft" volume={0.5} />
      <Sfx at={Fi(3) + 4} src="pop" volume={0.45} />
    </>
  );
};

// ---------- 2 · Artículo 16 ----------
export const Art16: React.FC = () => {
  const Fi = F('02-art16');
  const Ei = E('02-art16');
  const mitad = Math.round((Ei(1) - Fi(1)) * 0.5);
  return (
    <>
      <Halo x={540} y={900} r={460} op={0.3} />
      <Recorte
        x={520}
        y={680}
        w={860}
        at={Fi(0) + 4}
        medio="Declaración de los Derechos del Hombre y del Ciudadano · 1789"
        fecha={'art.\u00a016'}
        texto="«Toda sociedad en la que no esté asegurada [[la garantía de los derechos]], ni determinada [[la separación de poderes]], no tiene Constitución.»"
        marcasEn={[
          [Fi(1), Fi(1) + mitad - 4],
          [Fi(1) + mitad + 4, Ei(1)],
        ]}
        size={44}
      />
      <Prueba x={540} y={1180} at={Fi(2) - 2} />
      <Tag text="La prueba" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(0) + 4} src="paper" volume={0.6} />
      <Sfx at={Fi(1)} src="key" volume={0.3} />
      <Sfx at={Fi(1) + mitad + 4} src="key" volume={0.3} />
      <Sfx at={Fi(2) - 2} src="pop" volume={0.5} />
    </>
  );
};

// Casa con gente asomada (el confinamiento).
const Casa: React.FC<{at: number; out?: number}> = ({at, out}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 8)) return null;
  const o = interpolate(f - at, [0, 6], [0, 1], clamp) * (out === undefined ? 1 : interpolate(f - out, [0, 8], [1, 0], clamp));
  const ven = [250, 540, 830];
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d="M110 760 L540 600 L970 760 Z" fill="#B8826A" stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
        <rect x={140} y={760} width={800} height={380} fill="#EAD9BF" stroke={C.tinta} strokeWidth={6} />
        {ven.map((x) => (
          <rect key={x} x={x - 95} y={820} width={190} height={200} fill="#CFE0E2" stroke={C.tinta} strokeWidth={5} />
        ))}
        <defs>
          {ven.map((x) => (
            <clipPath key={x} id={`v${x}`}>
              <rect x={x - 92} y={823} width={184} height={194} />
            </clipPath>
          ))}
        </defs>
        {ven.map((x, i) => (
          <g key={'p' + x} clipPath={`url(#v${x})`}>
            <Persona x={x} y={1080} h={230} at={at + i * 3} piel={PIEL[(i * 2) % 5]} pelo={(['largo', 'corto', 'rizado'] as const)[i]} peloColor={PELO[i + 1]} ropa={[ROPA.oliva, ROPA.arena, ROPA.pizarra][i]} gesto="preocupado" semilla={60 + i} />
          </g>
        ))}
      </svg>
    </div>
  );
};

// Hilos de marioneta desde arriba hasta las cabezas.
const Hilos: React.FC<{xs: number[]; y: number; at: number; top?: number; mano?: [number, number]}> = ({xs, y, at, top = 560, mano}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = ramp(f, at, at + 14);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {xs.map((x, i) => {
        const x0 = mano ? mano[0] : x;
        const y0 = mano ? mano[1] : top;
        return <line key={i} x1={x0} y1={y0} x2={x0 + (x - x0) * k} y2={y0 + (y - y0) * k} stroke={C.piedra} strokeWidth={3} strokeDasharray="10 8" />;
      })}
    </svg>
  );
};

// ---------- 3 · Primera pregunta: derechos ----------
export const Derechos: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('03-derechos');
  const Ei = E('03-derechos');
  const xsMag = Array.from({length: 11}).map((_, i) => 100 + i * 88);
  return (
    <>
      <Camara keys={[[0, 1, 540, 960], [Fi(3), 1.0, 540, 960], [Fi(4), 1.02, 540, 990], [Fi(6), 1.0, 540, 960]]}>
        <Halo x={540} y={900} r={460} op={0.25} />
        <Casa at={Fi(3)} out={Fi(5) - 2} />
        {f >= Fi(3) && f < Fi(5) && <Taco x={900} y={690} w={160} mes="JUL" dia={14} anio="2021" />}
        {f >= Fi(5) && f < Fi(6) && <Taco x={900} y={690} w={160} mes="NOV" dia={5} anio="2024" />}
        {f >= Fi(4) - 6 && f < Fi(5) + 6 && <Magistrados y={1360} at={Fi(4) - 6} votan={6} votanAt={Fi(4) + 6} />}
        {f >= Fi(5) + 6 && <Magistrados y={1360} at={Fi(5) + 6} tanda={2} />}
        {f >= Fi(4) + 10 && f < Fi(5) + 4 && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 1400, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 76, color: C.tinta, letterSpacing: '0.04em', opacity: interpolate(f - Fi(4) - 10, [0, 5], [0, 1], clamp)}}>
            6 <span style={{color: C.piedra, fontWeight: 600}}>contra</span> 5
          </div>
        )}
        <Hilos xs={xsMag} y={1190} at={Fi(8)} top={1050} />
      </Camara>
      {/* la prueba, con la casilla 1 en foco */}
      <Prueba x={540} y={640} at={-20} out={Fi(2) - 2} foco={[[0, 1]]} />
      <FotoReal src="img/constitucion/tc.jpg" pie="Tribunal Constitucional · Madrid" x={540} y={620} w={760} h={570} at={Fi(2)} out={Fi(3) - 4} credito="Foto: Zarateman · CC0" zoom={[1.0, 1.08]} foco={[50, 35]} />
      {f >= Ei(3) - 14 && f < Fi(5) && <Sello x={540} y={930} at={Ei(3) - 14} texto="INCONSTITUCIONAL" size={60} rot={-6} />}
      <Recorte x={455} y={640} w={730} at={Fi(5) + 4} out={Fi(6) - 2} medio="STC 136/2024" fecha="5/11/2024" texto="«…hemos de considerar [[superada la doctrina]] fijada en la STC 148/2021.»" marcasEn={[[Ei(5) - 26, Ei(5) - 4]]} size={42} />
      <Prueba x={540} y={640} at={Fi(6)} foco={[[0, 1]]} marca1={{at: Fi(8) + 4, texto: 'DEPENDE', color: DORADO_OSC}} />
      <FuenteMini text="STC 148/2021 · STC 136/2024" x={540} y={1500} at={Fi(4)} out={Fi(6)} />
      <Pildora text="¿Quién los elige?" x={540} y={965} at={Fi(8) + 8} variante="dorado" />
      <Tag text="Pregunta 1" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(2)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(3)} src="whoosh_soft" volume={0.45} />
      <Sfx at={Ei(3) - 14} src="stamp" volume={0.75} />
      {Array.from({length: 6}).map((_, i) => (
        <Sfx key={i} at={Fi(4) + 6 + i} src="tick" volume={0.25} dur={6} />
      ))}
      <Sfx at={Fi(5)} src="paper" volume={0.55} />
      <Sfx at={Fi(5) + 4} src="whoosh" volume={0.4} />
      <Sfx at={Ei(5) - 26} src="key" volume={0.3} />
      <Sfx at={Fi(6)} src="pop" volume={0.5} />
      <Sfx at={Fi(8)} src="riser" volume={0.3} />
      <Sfx at={Fi(8) + 4} src="stamp" volume={0.7} />
    </>
  );
};

// Tres columnas (los poderes).
const Columnas: React.FC<{at: number; out?: number; juntas?: number}> = ({at, out, juntas}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 8)) return null;
  const o = interpolate(f - at, [0, 6], [0, 1], clamp) * (out === undefined ? 1 : interpolate(f - out, [0, 8], [1, 0], clamp));
  const j = juntas === undefined ? 0 : ramp(f, juntas, juntas + 12);
  const xs = [230, 540, 850].map((x) => 540 + (x - 540) * (1 - 0.62 * j));
  const nombres = ['EJECUTIVO', 'LEGISLATIVO', 'JUDICIAL'];
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {xs.map((x, i) => {
          const s = spring({frame: f - at - i * 4, fps: 30, config: {damping: 12, stiffness: 200}});
          return (
            <g key={i} transform={`translate(${x} 1360) scale(${s}) translate(${-x} -1360)`}>
              <rect x={x - 90} y={1000} width={180} height={26} fill={C.tarjeta} stroke={C.tinta} strokeWidth={5} />
              {[-50, -17, 17, 50].map((d) => (
                <line key={d} x1={x + d} y1={1040} x2={x + d} y2={1320} stroke={C.tinta} strokeWidth={4} opacity={0.5} />
              ))}
              <rect x={x - 70} y={1026} width={140} height={308} fill="#F5EEDF" stroke={C.tinta} strokeWidth={5} />
              <rect x={x - 100} y={1334} width={200} height={28} fill={C.tarjeta} stroke={C.tinta} strokeWidth={5} />
            </g>
          );
        })}
      </svg>
      {xs.map((x, i) => (
        <div key={i} style={{position: 'absolute', left: x - 150, width: 300, top: 1380, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: '0.08em', color: C.tinta}}>
          {nombres[i]}
        </div>
      ))}
    </div>
  );
};

// Lista de partido que se va escribiendo.
const ListaPartido: React.FC<{x: number; y: number; at: number; escribe: number}> = ({x, y, at, escribe}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spring({frame: f - at, fps: 30, config: {damping: 12, stiffness: 190}});
  return (
    <div style={{position: 'absolute', left: x - 170, top: y, width: 340, transform: `scale(${s}) rotate(2deg)`, background: '#FFFDF8', border: `6px solid ${C.tinta}`, borderRadius: 10, padding: '22px 26px', boxShadow: '0 10px 24px rgba(32,32,30,0.16)'}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 44, letterSpacing: '0.12em', color: C.tinta, textAlign: 'center'}}>LISTA</div>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const k = ramp(f, escribe + i * 10, escribe + i * 10 + 9);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.burdeos, width: 26}}>{i + 1}</div>
            <div style={{height: 20, borderRadius: 6, background: '#BFB29C', width: 210 * k}} />
          </div>
        );
      })}
    </div>
  );
};

// ---------- 4 · Segunda pregunta: poderes ----------
export const Poderes: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('04-poderes');
  const Ei = E('04-poderes');
  const diputados = Array.from({length: 6}).map((_, i) => 560 + i * 78);
  const presidente = f >= Ei(6) - 4;
  return (
    <>
      {f >= Fi(3) - 2 && (
        <Camara keys={[[0, 1, 540, 960], [Fi(3), 1, 540, 960], [Fi(5), 1.02, 560, 980]]}>
          <Sala suelo={1480} />
          <Lienzo>
          {!presidente ? (
            <Persona x={280} y={1480} h={330} at={Fi(3)} piel={PIEL[0]} pelo="corto" peloColor={PELO[3]} ropa={ROPA.tinta} acc="corbata" accColor={C.dorado} gesto={[[0, 'serio'], [Fi(5), 'contento']]} pose={[[0, 'habla'], [Fi(5), 'senala']]} semilla={91} mira={1} />
          ) : (
            <Persona x={280} y={1480} h={330} at={-10} piel={PIEL[0]} pelo="corto" peloColor={PELO[3]} ropa={ROPA.tinta} acc="banda" gesto="contento" pose="brazos-arriba" semilla={91} />
          )}
          {f >= Fi(4) && diputados.map((x, i) => (
            <Persona key={i} x={x} y={1480 + (i % 2) * 14} h={200} at={Fi(4) + i * 2} piel={PIEL[(i * 3) % 5]} pelo={(['corto', 'largo', 'calvo', 'mono', 'rizado', 'flequillo'] as const)[i]} peloColor={PELO[(i + 2) % 6]} ropa={ROPA.tinta} acc="corbata" accColor={C.dorado} falda={i % 3 === 1} pose={[[0, 'quieto'], [Fi(6) + i, 'mano']]} gesto="serio" semilla={100 + i} respira={false} />
          ))}
            <Flecha x1={380} y1={1120} x2={640} y2={1200} at={Fi(5)} curva={-60} />
            <Flecha x1={700} y1={1250} x2={400} y2={1290} at={Fi(6) + 4} curva={40} />
          </Lienzo>
          <ListaPartido x={720} y={640} at={Fi(3) + 6} escribe={Fi(3) + 16} />
        </Camara>
      )}
      <Prueba x={540} y={640} at={-20} out={Fi(2) - 2} foco={[[0, 2]]} />
      <Columnas at={Fi(1)} out={Fi(2) - 2} />
      <FotoReal src="img/constitucion/congreso.png" pie="Congreso de los Diputados · Madrid" x={540} y={620} w={760} h={510} at={Fi(2)} out={Fi(3) - 4} credito="Foto: Roberto García · CC BY 2.0" zoom={[1.02, 1.1]} foco={[55, 45]} />
      <Pildora text="La dirección del partido" x={640} y={1110} at={Fi(3) + 40} apaga={Ei(3) - 30} out={Fi(5) - 4} />
      <Pildora text="…que suele presidir el candidato" x={640} y={1200} at={Ei(3) - 30} variante="blanco" out={Fi(5) - 4} />
      {presidente && <Pildora text="Presidente" x={280} y={1040} at={Ei(6) - 4} variante="burdeos" />}
      <FuenteMini text="Constitución, art. 99 · LOREG, art. 96.2" x={540} y={1540} at={Fi(2) + 6} />
      <Tag text="Pregunta 2" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(1)} src="clunk" volume={0.45} />
      <Sfx at={Fi(2)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(3) + 6} src="paper" volume={0.6} />
      {Array.from({length: 6}).map((_, i) => (
        <Sfx key={i} at={Fi(3) + 16 + i * 10} src="key" volume={0.18} dur={8} />
      ))}
      <Sfx at={Fi(4)} src="drop" volume={0.3} />
      <Sfx at={Fi(5)} src="whoosh_soft" volume={0.45} />
      <Sfx at={Fi(6) + 4} src="whoosh_soft" volume={0.45} />
      <Sfx at={Ei(6) - 4} src="ding" volume={0.45} />
    </>
  );
};

// Mazo de juez.
const Mazo: React.FC<{x: number; y: number; at: number; out?: number}> = ({x, y, at, out}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 8)) return null;
  const s = spring({frame: f - at, fps: 30, config: {damping: 10, stiffness: 200}});
  const golpe = Math.max(0, Math.sin(Math.min(1, (f - at) / 10) * Math.PI)) * -24;
  const o = out === undefined ? 1 : interpolate(f - out, [0, 8], [1, 0], clamp);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o}}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={120} rx={150} ry={26} fill="#8C6A4A" stroke={C.tinta} strokeWidth={6} />
        <g transform={`rotate(${golpe - 25})`}>
          <rect x={-14} y={-20} width={28} height={190} rx={10} fill="#A57B52" stroke={C.tinta} strokeWidth={6} transform="rotate(-60)" />
          <rect x={-90} y={-60} width={180} height={80} rx={16} fill="#B8875A" stroke={C.tinta} strokeWidth={6} />
        </g>
      </g>
      <text x={x + 150} y={y - 40} fontFamily={SANS} fontWeight={900} fontSize={120} fill={C.burdeos} opacity={f > at + 8 ? 1 : 0}>
        ?
      </text>
    </svg>
  );
};

// Veinte vocales en dos filas; desde `color` llevan corbata del color de quien los propuso.
const Vocales: React.FC<{at: number; color: number; out?: number}> = ({at, color, out}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 8)) return null;
  const o = out === undefined ? 1 : interpolate(f - out, [0, 8], [1, 0], clamp);
  const pintado = f >= color;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o, overflow: 'visible'}}>
      {Array.from({length: 20}).map((_, i) => {
        const fila = Math.floor(i / 10);
        const col = i % 10;
        const izq = col < 5;
        return (
          <Persona
            key={i + (pintado ? 100 : 0)}
            x={120 + col * 93 + (col >= 5 ? 26 : 0)}
            y={1150 + fila * 190}
            h={150}
            at={pintado ? -10 : at + i}
            piel={PIEL[(i * 3) % 5]}
            pelo={(['corto', 'largo', 'calvo', 'mono', 'rizado', 'flequillo'] as const)[(i * 5) % 6]}
            peloColor={PELO[(i * 2) % 6]}
            ropa={ROPA.pizarra}
            acc="corbata"
            accColor={pintado ? (izq ? PARTIDOS.PSOE : PARTIDOS.PP) : '#9A958C'}
            falda={i % 4 === 1}
            gesto="serio"
            semilla={200 + i}
            respira={false}
          />
        );
      })}
    </svg>
  );
};

const Cartel: React.FC<{x: number; y: number; at: number; titulo: string; lineas: string[]; w?: number}> = ({x, y, at, titulo, lineas, w = 420}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spring({frame: f - at, fps: 30, config: {damping: 12, stiffness: 200}});
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `scale(${s})`, background: '#FFFDF8', borderTop: `9px solid ${C.burdeos}`, boxShadow: '0 12px 28px rgba(32,32,30,0.16)', padding: '20px 24px'}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 32, letterSpacing: '0.1em', color: C.burdeos}}>{titulo}</div>
      {lineas.map((l, i) => (
        <div key={i} style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: C.tinta, marginTop: 10, lineHeight: 1.2}} dangerouslySetInnerHTML={{__html: l}} />
      ))}
    </div>
  );
};

// ---------- 5 · Los jueces ----------
export const Jueces: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('05-jueces');
  return (
    <>
      <Halo x={540} y={1000} r={480} op={0.25} />
      <Mazo x={540} y={820} at={2} out={Fi(1) + 2} />
      <Pildora text="CGPJ · 20 vocales" x={540} y={700} at={Fi(1) + 4} variante="tinta" out={Fi(4) - 2} />
      <Vocales at={Fi(1) + 6} color={Fi(3)} out={Fi(4) - 2} />
      {f >= Fi(3) && f < Fi(4) + 6 && (
        <>
          <div style={{position: 'absolute', left: 120, width: 420, top: 820, textAlign: 'center'}}>
            <Siglas p="PSOE" size={110} at={Fi(3)} />
          </div>
          <div style={{position: 'absolute', left: 560, width: 420, top: 820, textAlign: 'center'}}>
            <Siglas p="PP" size={110} at={Fi(3) + 6} />
          </div>
        </>
      )}
      {f >= Fi(2) && f < Fi(4) && <Taco x={900} y={650} w={130} mes="JUN" dia={25} anio="2024" />}
      <FuenteMini text={f < Fi(3) ? 'Constitución, art. 122.3 · LO 6/1985' : 'Acuerdo PSOE–PP del 25/6/2024'} x={540} y={1530} at={Fi(1) + 10} out={Fi(4) - 2} />
      <Cartel x={300} y={700} at={Fi(4)} titulo="CONSTITUCIONAL" lineas={['12 magistrados:', '4 Congreso · 4 Senado', '2 Gobierno · 2 CGPJ']} w={440} />
      <Cartel x={790} y={760} at={Fi(4) + 14} titulo="FISCAL GENERAL" lineas={['Lo propone', 'el Gobierno']} w={360} />
      <Pildora text="Cortes y Gobierno" x={540} y={1170} at={Fi(5) + 8} variante="dorado" />
      <FuenteMini text="Constitución, arts. 159 y 124.4" x={540} y={1530} at={Fi(4) + 6} />
      <Tag text="Pregunta 2" delay={4} top={TAG_TOP} sound={false} />
      <Sfx at={2} src="thump" volume={0.6} />
      {Array.from({length: 10}).map((_, i) => (
        <Sfx key={i} at={Fi(1) + 6 + i * 2} src="drop" volume={0.18} dur={8} />
      ))}
      <Sfx at={Fi(2)} src="paper" volume={0.45} />
      <Sfx at={Fi(3)} src="pop" volume={0.6} />
      <Sfx at={Fi(3) + 6} src="pop" volume={0.6} />
      <Sfx at={Fi(4)} src="whoosh" volume={0.45} />
      <Sfx at={Fi(4) + 14} src="pop" volume={0.45} />
      <Sfx at={Fi(5) + 8} src="ding" volume={0.4} />
    </>
  );
};

// Mano (dibujada) que baja desde arriba.
const Mano: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f - at, [0, 10], [-400, 0], {...clamp, easing: Easing.out(Easing.back(1.4))});
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, transform: `translateY(${k}px)`}}>
      <rect x={x - 70} y={y - 420} width={140} height={330} fill={C.tinta} />
      <rect x={x - 82} y={y - 110} width={164} height={40} rx={8} fill="#FFFDF8" stroke={C.tinta} strokeWidth={5} />
      <path d={`M${x - 80} ${y - 70} Q${x - 95} ${y + 40} ${x - 30} ${y + 70} H${x + 40} Q${x + 100} ${y + 40} ${x + 85} ${y - 70} Z`} fill={PIEL[1]} stroke={C.tinta} strokeWidth={6} />
      {[-48, -16, 16, 48].map((d) => (
        <path key={d} d={`M${x + d} ${y + 20} V${y + 62}`} stroke={C.tinta} strokeWidth={4} opacity={0.5} />
      ))}
    </svg>
  );
};

// ---------- 6 · Los hilos ----------
export const HilosEscena: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('06-hilos');
  const Ei = E('06-hilos');
  const nombres = ['Congreso', 'CGPJ', 'Constitucional', 'Fiscal'];
  const xs = [150, 360, 600, 880];
  return (
    <>
      <Temblor at={Ei(1) - 6}>
        <Halo x={540} y={900} r={460} op={0.25} />
        {nombres.map((n, i) => (
          <Pildora key={n} text={n} x={xs[i]} y={1260} at={i * 3} variante={i === 0 ? 'tinta' : 'blanco'} size={30} />
        ))}
        <Hilos xs={xs} y={1250} at={Fi(0)} mano={[540, 760]} />
        <Mano x={540} y={760} at={Fi(1) - 8} />
        {f >= Ei(1) - 6 && <Sello x={540} y={1060} at={Ei(1) - 6} texto="LAS MISMAS MANOS" size={58} rot={-5} />}
      </Temblor>
      <Destello at={Ei(1) - 6} />
      <Sfx at={Fi(0)} src="riser" volume={0.35} />
      <Sfx at={Fi(1) - 8} src="whoosh" volume={0.5} />
      <Sfx at={Ei(1) - 6} src="stamp" volume={0.85} />
    </>
  );
};

// ---------- 7 · Quien lo defiende ----------
export const Objecion: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('07-objecion');
  const Ei = E('07-objecion');
  const linea = (at: number, t: string) =>
    f >= at && (
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.tinta, marginTop: 14, transform: `scale(${spring({frame: f - at, fps: 30, config: {damping: 12, stiffness: 220}})})`, transformOrigin: 'left center'}}>
        <span style={{color: '#2E7D4F'}}>✓</span> {t}
      </div>
    );
  return (
    <>
      <Camara keys={[[0, 1, 540, 960], [Fi(3), 1, 540, 960], [Fi(3) + 20, 1.0, 540, 980]]}>
        <Sala suelo={1500} />
        <Lienzo>
        <Persona x={250} y={1500} h={330} at={2} piel={PIEL[3]} pelo="largo" peloColor={PELO[1]} ropa={ROPA.oliva} falda gesto={[[0, 'contento'], [Fi(3), 'duda']]} pose={[[0, 'habla'], [Fi(3), 'quieto']]} semilla={120} mira={1} />
        </Lienzo>
        <Narrador x={830} y={1500} at={Fi(2) - 6} gesto={[[0, 'neutral'], [Fi(2), 'contento'], [Fi(3), 'serio']]} pose={[[0, 'quieto'], [Fi(2), 'mano'], [Fi(4), 'senala']]} mira={-1} />
      </Camara>
      {f < Fi(3) && (
        <Bocadillo x={150} y={640} w={640} h={300} tx={300} ty={1080} at={Fi(0) + 4}>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: C.piedra}}>«En España hay…»</div>
          {linea(Fi(1) + 4, 'elecciones limpias')}
          {linea(Ei(1) - 20, 'libertades')}
        </Bocadillo>
      )}
      <Prueba x={540} y={640} at={Fi(3)} foco={[[0, 0], [Fi(4), 2]]} />
      <Tag text="Quien lo defiende" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(0) + 4} src="pop" volume={0.5} />
      <Sfx at={Fi(1) + 4} src="ding" volume={0.35} />
      <Sfx at={Ei(1) - 20} src="ding" volume={0.35} />
      <Sfx at={Fi(3)} src="whoosh" volume={0.45} />
      <Sfx at={Fi(4)} src="tick" volume={0.4} />
    </>
  );
};

// ---------- 8 · Veredicto y gancho a la parte 2 ----------
export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('08-cierre');
  const sube = interpolate(f, [Fi(1) - 4, Fi(1) + 10], [0, -1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <>
      <Halo x={540} y={950} r={480} op={0.28} />
      <Temblor at={Fi(0) + 2}>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${sube * 40}px) scale(${1 + sube * 0.12})`, transformOrigin: '540px 600px', opacity: 1 + sube}}>
          <Prueba x={540} y={640} at={-20} marca1={{at: -20, texto: 'DEPENDE', color: DORADO_OSC}} marca2={{at: Fi(0) + 2, texto: 'SUSPENSO'}} />
        </div>
      </Temblor>
      <Destello at={Fi(0) + 2} />
      <Carpeta x={330} y={760} at={Fi(1) + 2} w={360} />
      <Corona x={760} y={780} at={Fi(2) + 4} w={240} interroga />
      <Siguiente at={Fi(3)} parte={2} titulo="¿Quién la escribió?" />
      <Tag text="Veredicto" delay={4} top={TAG_TOP} sound={false} />
      <Sfx at={Fi(0) + 2} src="stamp" volume={0.9} />
      <Sfx at={Fi(1) + 2} src="paper" volume={0.6} />
      <Sfx at={Fi(2) + 4} src="shimmer" volume={0.5} />
      <Sfx at={Fi(3)} src="whoosh" volume={0.5} />
    </>
  );
};
