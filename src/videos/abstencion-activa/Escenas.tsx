import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {C, SANS, SERIF, miles} from '../../kit/brand';
import {clamp, Sfx, Tag} from '../../kit/ui';
import {Bocadillo} from '../../kit/figuras';
import {Camara, Halo, OutroSol, PELO, PIEL, Persona, ROPA, Sala, Sello} from '../../kit/mundo';
import {Lienzo, Taco} from '../../kit/objetos';
import {Destello, FuenteMini, Pildora, Recorte, Temblor} from '../../kit/real';
import {Candado, Defensora, Gente, Narrador, Pergamino} from '../espana-no-tiene-constitucion/comun';
import {E, F} from './timeline';

const TAG_TOP = 522;
const VERDE = '#2E7D4F';
const sp = (f: number, at: number) => spring({frame: f - at, fps: 30, config: {damping: 12, stiffness: 210}});

// Los dos personajes del vídeo: el que se queda en casa y la que se abstiene a conciencia.
const PERSONA_PASIVA = {piel: PIEL[1], pelo: 'rizado' as const, peloColor: PELO[2], ropa: ROPA.arena};
export const PERSONA_ACTIVA = {piel: PIEL[3], pelo: 'mono' as const, peloColor: PELO[0], ropa: ROPA.burdeos};

// Cartel «NO FIRMO» en alto (se dibuja sobre la persona).
export const Cartel: React.FC<{x: number; y: number; at: number; texto?: string; w?: number}> = ({x, y, at, texto = 'NO FIRMO', w = 260}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = sp(f, at);
  const bob = Math.sin((f - at) / 9) * 4;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y + bob, width: w, transform: `scale(${s}) rotate(-3deg)`, transformOrigin: 'center bottom'}}>
      <div style={{background: '#FFFDF8', border: `6px solid ${C.tinta}`, borderRadius: 8, padding: '12px 10px', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: w * 0.15, color: C.burdeos, letterSpacing: '0.04em'}}>{texto}</div>
      <div style={{width: 10, height: 120, background: '#8C6A4A', margin: '0 auto'}} />
    </div>
  );
};

// Sofá con tele; la persona va detrás (solo asoma de cintura para arriba).
export const Sofa: React.FC<{x: number; y: number; at: number; tv?: string; tvAt?: number; bandera?: number; vacio?: number; tvArriba?: boolean}> = ({x, y, at, tv, tvAt = 0, bandera, vacio, tvArriba}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = sp(f, at);
  const sentado = vacio === undefined || f < vacio;
  const ondea = Math.sin(f / 4) * 8;
  const bk = bandera === undefined ? 0 : interpolate(f - bandera, [0, 10], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: `scale(${s})`}}>
      <Lienzo>
        {/* respaldo */}
        <rect x={x - 200} y={y - 210} width={400} height={130} rx={36} fill="#8E6F5A" stroke={C.tinta} strokeWidth={6} />
        {sentado && (
          <Persona x={x} y={y + 20} h={300} at={-10} {...PERSONA_PASIVA} gesto={tv ? 'contento' : 'neutral'} emote={tv ? null : '…'} semilla={880} respira />
        )}
        {/* asiento y brazos */}
        <rect x={x - 220} y={y - 90} width={440} height={110} rx={30} fill="#A07F67" stroke={C.tinta} strokeWidth={6} />
        <rect x={x - 250} y={y - 150} width={70} height={170} rx={28} fill="#8E6F5A" stroke={C.tinta} strokeWidth={6} />
        <rect x={x + 180} y={y - 150} width={70} height={170} rx={28} fill="#8E6F5A" stroke={C.tinta} strokeWidth={6} />
        {bandera !== undefined && f >= bandera && (
          <g transform={`translate(${x + 60} ${y - 120 - 140 * bk})`}>
            <line x1={0} y1={0} x2={0} y2={170} stroke="#7A5A3E" strokeWidth={8} />
            <path d={`M0 0 Q40 ${-10 + ondea} 90 ${ondea * 0.6} L90 60 Q40 ${70 - ondea} 0 60 Z`} fill="#FFFFFF" stroke={C.tinta} strokeWidth={4} />
          </g>
        )}
      </Lienzo>
      {tv && f >= tvAt && (
        <div style={{position: 'absolute', left: tvArriba ? x - 115 : x + 260, top: tvArriba ? y - 520 : y - 330, width: 230, height: 160, background: C.tinta, borderRadius: 14, padding: 10, transform: `scale(${sp(f, tvAt)})`}}>
          <div style={{width: '100%', height: '100%', background: '#4E6170', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 30, color: '#FAF7F1', letterSpacing: '0.04em'}}>{tv}</div>
        </div>
      )}
    </div>
  );
};

// El poder: edificio sobre un único pilar. El pilar es lo que «necesita».
const Poder: React.FC<{x: number; y: number; at: number; w?: number; revela?: number; tiembla?: number}> = ({x, y, at, w = 420, revela, tiembla}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = sp(f, at);
  const t = tiembla === undefined ? 0 : interpolate(f - tiembla, [0, 30], [1, 0.35], clamp) * (f >= tiembla ? 1 : 0);
  const rot = tiembla !== undefined && f >= tiembla ? Math.sin((f - tiembla) / 2.2) * 4 * t + 2.5 : 0;
  const h = w * 0.55;
  const etiqueta = revela !== undefined && f >= revela ? 'TU CONSENTIMIENTO' : '?';
  return (
    <div style={{position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: `scale(${s})`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <g transform={`rotate(${rot} ${x} ${y})`}>
          <path d={`M${x - w / 2} ${y - h * 0.62} L${x} ${y - h} L${x + w / 2} ${y - h * 0.62} Z`} fill={C.tarjeta} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
          <rect x={x - w / 2} y={y - h * 0.62} width={w} height={h * 0.62} fill="#F5EEDF" stroke={C.tinta} strokeWidth={6} />
          {Array.from({length: 5}).map((_, i) => (
            <rect key={i} x={x - w / 2 + w * 0.1 + i * w * 0.19 - 12} y={y - h * 0.55} width={24} height={h * 0.5} fill="#E6DCCB" stroke={C.tinta} strokeWidth={4} />
          ))}
          <text x={x} y={y - h * 0.68} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} letterSpacing={6} fill={C.tinta}>
            EL PODER
          </text>
        </g>
        {/* el pilar */}
        <rect x={x - 46} y={y} width={92} height={230} fill={C.dorado} stroke={C.tinta} strokeWidth={6} />
      </svg>
      <div style={{position: 'absolute', left: x - 200, width: 400, top: y + 245, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: etiqueta === '?' ? 70 : 36, color: C.burdeos, letterSpacing: '0.04em', transform: `scale(${revela !== undefined && f >= revela ? sp(f, revela) : 1})`}}>
        {etiqueta}
      </div>
    </div>
  );
};

// ---------- 1 · Gancho ----------
export const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('01-gancho');
  const linea = interpolate(f, [6, 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const sentada = f >= Fi(1);
  return (
    <>
      <Camara keys={[[0, 1.04, 540, 1000], [Fi(1), 1.0, 540, 980], [Fi(2), 1.0, 540, 980], [Fi(2) + 40, 1.03, 600, 960]]}>
        <Sala suelo={1500} />
        <Halo x={540} y={760} r={340} op={0.28} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <line x1={540} y1={1000} x2={540} y2={1000 + 500 * linea} stroke={C.piedra} strokeWidth={4} strokeDasharray="14 10" />
        </svg>
        {!sentada && (
          <Lienzo>
            <Persona x={270} y={1490} h={300} at={10} {...PERSONA_PASIVA} gesto="neutral" semilla={880} />
          </Lienzo>
        )}
        {sentada && <Sofa x={270} y={1440} at={Fi(1) - 2} tv="FÚTBOL" tvAt={Fi(1) + 10} tvArriba />}
        <Lienzo>
          <Persona x={810} y={1490} h={300} at={14} {...PERSONA_ACTIVA} gesto={[[0, 'neutral'], [Fi(2), 'serio']]} pose={[[0, 'quieto'], [Fi(2) + 4, 'brazos-arriba']]} semilla={890} />
        </Lienzo>
        <Cartel x={810} y={1010} at={Fi(2) + 6} />
      </Camara>
      <Poder x={540} y={720} at={2} w={380} tiembla={Fi(2) + 14} />
      <Pildora text="No vota" x={270} y={1080} at={22} variante="blanco" out={Fi(1) - 2} size={30} />
      <Pildora text="No vota" x={810} y={1080} at={28} variante="blanco" out={Fi(2) - 2} size={30} />
      <Pildora text="Un favor al poder" x={270} y={1530} at={Fi(1) + 14} variante="tinta" size={30} />
      <Pildora text="Le quita lo que necesita" x={810} y={1530} at={Fi(2) + 20} variante="burdeos" size={30} />
      <Sfx at={2} src="thump" volume={0.55} />
      <Sfx at={6} src="whoosh_soft" volume={0.4} />
      <Sfx at={10} src="pop" volume={0.35} />
      <Sfx at={14} src="pop" volume={0.35} />
      <Sfx at={22} src="tick" volume={0.35} />
      <Sfx at={28} src="tick" volume={0.35} />
      <Sfx at={Fi(1) - 2} src="drop" volume={0.5} />
      <Sfx at={Fi(1) + 14} src="pop" volume={0.4} />
      <Sfx at={Fi(2) + 6} src="paper" volume={0.5} />
      <Sfx at={Fi(2) + 14} src="clunk" volume={0.6} />
      <Sfx at={Fi(2) + 20} src="pop" volume={0.4} />
    </>
  );
};

// ---------- 2 · El dato ----------
export const Dato: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('02-dato');
  const Ei = E('02-dato');
  const n = Math.round(12517011 * interpolate(f, [Fi(0) + 30, Ei(0) - 6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <>
      <Halo x={540} y={900} r={480} op={0.25} />
      <Taco x={540} y={660} w={190} mes="JUL 2023" dia={23} />
      {f >= Fi(0) + 30 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 780, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 118, color: C.burdeos, opacity: interpolate(f - Fi(0) - 30, [0, 6], [0, 1], clamp)}}>
          {miles(n)}
        </div>
      )}
      {f >= Fi(0) + 40 && <div style={{position: 'absolute', left: 0, right: 0, top: 925, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.piedra}}>personas no votaron</div>}
      {f >= Fi(1) && (
        <Lienzo>
          {Array.from({length: 27}).map((_, i) => {
            const fila = Math.floor(i / 9);
            const col = i % 9;
            const gris = col % 3 === 1;
            return (
              <Persona
                key={i}
                x={150 + col * 98}
                y={1250 + fila * 115}
                h={105}
                at={Fi(1) + i}
                piel={gris ? '#C9C2B6' : PIEL[(i * 3) % 5]}
                pelo={(['corto', 'largo', 'rizado', 'mono', 'calvo', 'flequillo'] as const)[i % 6]}
                peloColor={gris ? '#9A958C' : PELO[(i * 2) % 6]}
                ropa={gris ? '#B5AFA4' : [ROPA.oliva, ROPA.burdeos, ROPA.pizarra, ROPA.arena, ROPA.dorado][i % 5]}
                pantalon={gris ? '#8F8A80' : ROPA.tinta}
                gesto={gris ? 'neutral' : 'contento'}
                emote={gris && f >= Fi(2) + (i % 4) * 3 ? '?' : null}
                semilla={900 + i}
                respira={false}
              />
            );
          })}
        </Lienzo>
      )}
      <Pildora text="1 de cada 3" x={540} y={1000} at={Fi(1) + 10} variante="dorado" />
      <FuenteMini text="Ministerio del Interior · generales del 23/7/2023: abstención del 33,4 %" x={540} y={1560} at={Fi(1)} />
      <Sfx at={2} src="paper" volume={0.45} />
      {Array.from({length: 8}).map((_, i) => (
        <Sfx key={i} at={Fi(0) + 30 + i * 6} src="tick" volume={0.2} dur={5} />
      ))}
      <Sfx at={Fi(1) + 10} src="ding" volume={0.4} />
      <Sfx at={Fi(2)} src="pop" volume={0.35} />
    </>
  );
};

// ---------- 3 · La pasiva ----------
export const Pasiva: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('03-pasiva');
  const Ei = E('03-pasiva');
  return (
    <>
      <Camara keys={[[0, 1.0, 540, 980], [Fi(1), 1.04, 520, 1000]]}>
        <Sala suelo={1480} ventana={[860]} />
        <Sofa x={380} y={1430} at={-10} tv={f >= Ei(1) - 24 ? 'PASOTISMO' : 'FÚTBOL'} tvAt={-10} />
      </Camara>
      <Pildora text="Abstención por vaguería" x={540} y={650} at={4} variante="tinta" />
      {f >= Fi(1) + 50 && <Taco x={860} y={900} w={170} mes="LUNES" dia="30" />}
      {f >= Ei(1) - 24 && <Sello x={540} y={860} at={Ei(1) - 24} texto="PASOTISMO" size={64} rot={-6} />}
      <Tag text="La pasiva" delay={4} top={TAG_TOP} sound={false} />
      <Sfx at={4} src="pop" volume={0.45} />
      <Sfx at={Fi(1) + 50} src="paper" volume={0.45} />
      <Sfx at={Ei(1) - 24} src="stamp" volume={0.75} />
    </>
  );
};

// Lista cerrada (dibujada) con candado.
const ListaCerrada: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x - 160, top: y, width: 320, transform: `scale(${sp(f, at)}) rotate(-2deg)`, background: '#FFFDF8', border: `6px solid ${C.tinta}`, borderRadius: 10, padding: '20px 24px'}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 40, letterSpacing: '0.12em', color: C.tinta, textAlign: 'center'}}>LISTA</div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{display: 'flex', gap: 12, alignItems: 'center', marginTop: 14}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 28, color: C.burdeos, width: 24}}>{i + 1}</div>
          <div style={{height: 18, width: 200, borderRadius: 6, background: '#BFB29C'}} />
        </div>
      ))}
    </div>
  );
};

// Línea de firma que se va escribiendo.
const Firma: React.FC<{x: number; y: number; at: number; titulo: string}> = ({x, y, at, titulo}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f - at, [8, 34], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const L = 1400;
  return (
    <div style={{position: 'absolute', left: x - 380, top: y, width: 760, transform: `scale(${sp(f, at)})`, background: '#FFFDF8', boxShadow: '0 14px 30px rgba(32,32,30,0.18)', padding: '24px 30px', borderTop: `9px solid ${C.burdeos}`}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', color: C.burdeos}}>{titulo}</div>
      <svg width={700} height={150}>
        <path d="M20 100 C60 20 90 130 130 70 S200 30 230 95 S300 120 340 60 S420 40 450 100 S540 110 580 70" fill="none" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} />
        <line x1={10} y1={125} x2={690} y2={125} stroke={C.piedra} strokeWidth={3} />
      </svg>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: C.piedra}}>Firma del votante</div>
    </div>
  );
};

// ---------- 4 · La activa: la idea ----------
export const Activa: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('04-activa');
  const Ei = E('04-activa');
  return (
    <>
      <Halo x={540} y={900} r={480} op={0.25} />
      <Pildora text="Abstención activa" x={540} y={650} at={4} variante="burdeos" out={Fi(1) - 2} />
      {f < Fi(2) && (
        <>
          <ListaCerrada x={420} y={700} at={Fi(1)} />
          <Candado x={640} y={1060} at={Fi(1) + 10} w={150} />
          <Pildora text="No es elegir" x={540} y={1240} at={Fi(1) + 30} variante="tinta" />
        </>
      )}
      {f < Fi(3) && <Firma x={540} y={700} at={Fi(2)} titulo="VOTAR UNA LISTA CERRADA =" />}
      {f >= Fi(2) && f < Fi(3) && <Pildora text="Firmar a quien pone el partido" x={540} y={1070} at={Fi(2) + 30} variante="dorado" />}
      <Recorte
        x={540}
        y={680}
        w={840}
        at={Fi(3)}
        medio="Constitución · art. 67.2"
        texto="«Los miembros de las Cortes Generales [[no estarán ligados por mandato imperativo]].»"
        marcasEn={[[Fi(3) + 20, Ei(3) - 10]]}
        size={46}
      />
      {f >= Fi(3) + 30 && <Pildora text="Lo que te prometió no le obliga" x={540} y={1020} at={Fi(3) + 30} variante="blanco" />}
      <Tag text="La activa" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(1)} src="paper" volume={0.5} />
      <Sfx at={Fi(1) + 10} src="clack" volume={0.6} />
      <Sfx at={Fi(1) + 30} src="pop" volume={0.4} />
      <Sfx at={Fi(2)} src="whoosh" volume={0.45} />
      <Sfx at={Fi(2) + 8} src="paper" volume={0.4} />
      <Sfx at={Fi(3)} src="paper" volume={0.5} />
      <Sfx at={Fi(3) + 20} src="key" volume={0.3} />
    </>
  );
};

// ---------- 5 · Qué es abstenerse a conciencia ----------
export const Conciencia: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('05-conciencia');
  const pasos: Array<[number, string]> = [
    [Fi(0) + 20, '1. No firmar'],
    [Fi(1), '2. Decirlo'],
    [Fi(2), '3. Explicar por qué'],
    [Fi(3), '4. Organizarse'],
  ];
  return (
    <>
      <Camara keys={[[0, 1, 540, 960]]}>
        <Sala suelo={1500} />
        <Lienzo>
          <Persona x={540} y={1490} h={320} at={-10} {...PERSONA_ACTIVA} gesto={[[0, 'serio'], [Fi(1), 'contento']]} pose={[[0, 'brazos-arriba'], [Fi(1), 'habla'], [Fi(3), 'brazos-arriba']]} semilla={890} />
        </Lienzo>
        {f < Fi(1) && <Cartel x={540} y={980} at={Fi(0) + 10} />}
        {f >= Fi(3) && <Gente y={1500} at={Fi(3) + 4} n={8} h={200} x0={110} paso={120} pose={[[0, 'quieto'], [Fi(3) + 20, 'brazos-arriba']]} gesto="contento" />}
        {f >= Fi(3) + 10 && (
          <>
            <Cartel x={230} y={1050} at={Fi(3) + 14} w={200} />
            <Cartel x={850} y={1050} at={Fi(3) + 20} w={200} />
          </>
        )}
      </Camara>
      {f >= Fi(1) && f < Fi(3) && (
        <Bocadillo x={250} y={880} w={580} h={190} tx={520} ty={1150} at={Fi(1)}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.tinta, textAlign: 'center'}}>{f < Fi(2) ? '¡No firmo!' : 'Porque no elijo nada…'}</div>
        </Bocadillo>
      )}
      {pasos.map(([at, t], i) => (
        <Pildora key={i} text={t} x={540} y={620 + i * 70} at={at} variante={i === 3 ? 'dorado' : 'blanco'} size={32} apaga={pasos[i + 1]?.[0]} />
      ))}
      <Tag text="A conciencia" delay={4} top={TAG_TOP} sound={false} />
      {pasos.map(([at], i) => (
        <Sfx key={i} at={at} src="pop" volume={0.4} />
      ))}
      <Sfx at={Fi(0) + 10} src="paper" volume={0.45} />
      {Array.from({length: 6}).map((_, i) => (
        <Sfx key={'g' + i} at={Fi(3) + 4 + i * 3} src="drop" volume={0.18} dur={8} />
      ))}
    </>
  );
};

// Cheque en blanco.
const Cheque: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x - 400, top: y, width: 800, transform: `scale(${sp(f, at)}) rotate(-3deg)`, background: '#EEF3EA', border: `5px solid ${C.tinta}`, borderRadius: 14, padding: '22px 30px', boxShadow: '0 16px 30px rgba(32,32,30,0.2)'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.tinta, letterSpacing: '0.08em'}}>
        <span>CHEQUE EN BLANCO</span>
        <span style={{color: C.burdeos}}>VÁLIDO 4 AÑOS</span>
      </div>
      <div style={{marginTop: 22, fontFamily: SERIF, fontSize: 34, color: C.piedra}}>Páguese a: ______________________</div>
      <div style={{marginTop: 14, fontFamily: SERIF, fontSize: 34, color: C.piedra}}>Importe: ________________________</div>
      <div style={{marginTop: 18, display: 'flex', justifyContent: 'flex-end', fontFamily: SERIF, fontStyle: 'italic', fontSize: 38, color: C.tinta}}>Firmado: tu voto</div>
    </div>
  );
};

// ---------- 6 · Las objeciones ----------
export const Objeciones: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('06-objeciones');
  const Ei = E('06-objeciones');
  const barra = interpolate(f, [Fi(4) + 20, Fi(4) + 70], [0, 84.1], {...clamp, easing: Easing.out(Easing.cubic)});
  const parteA = f < Fi(3) - 2;
  const parteB = f >= Fi(3) - 2 && f < Fi(5) - 2;
  return (
    <>
      <Camara keys={[[0, 1, 540, 960]]}>
        <Sala suelo={1500} />
        <Defensora x={210} y={1500} at={2} pose={[[0, 'habla'], [Fi(1), 'quieto'], [Fi(3), 'habla'], [Fi(4), 'quieto']]} mira={1} />
        {f >= Fi(1) - 4 && <Narrador x={870} y={1500} at={Fi(1) - 4} gesto={[[0, 'serio'], [Fi(5), 'contento']]} pose={[[0, 'senala'], [Fi(2) + 30, 'quieto'], [Fi(5), 'mano']]} mira={-1} />}
      </Camara>
      {f < Fi(1) + 6 && (
        <Bocadillo x={140} y={640} w={640} h={200} tx={260} ty={1140} at={4}>
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 48, color: C.tinta, textAlign: 'center'}}>«Si no votas, no te quejes»</div>
        </Bocadillo>
      )}
      {parteA && <Cheque x={540} y={700} at={Fi(2)} />}
      {f >= Fi(3) - 2 && f < Fi(4) + 6 && (
        <Bocadillo x={140} y={640} w={640} h={200} tx={260} ty={1140} at={Fi(3) - 2}>
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 48, color: C.tinta, textAlign: 'center'}}>«Si no votas, ganan los peores»</div>
        </Bocadillo>
      )}
      {parteB && f >= Fi(4) + 10 && (
        <div style={{position: 'absolute', left: 140, right: 140, top: 660, background: '#FFFDF8', boxShadow: '0 12px 28px rgba(32,32,30,0.16)', padding: '22px 28px', borderTop: `9px solid ${C.burdeos}`, transform: `scale(${sp(f, Fi(4) + 10)})`}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', color: C.burdeos}}>ALEMANIA · 31 DE JULIO DE 1932</div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.piedra, marginTop: 8}}>Participación</div>
          <div style={{position: 'relative', height: 64, background: C.tarjeta, borderRadius: 10, marginTop: 8, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${barra}%`, background: C.tinta}} />
            <div style={{position: 'absolute', right: 16, top: 6, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: barra > 70 ? '#FAF7F1' : C.tinta, left: 0, textAlign: 'right', paddingRight: `${Math.max(2, 100 - barra) + 2}%`}}>{barra.toFixed(0)} %</div>
          </div>
          {f >= Ei(4) - 40 && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.tinta, marginTop: 18, transform: `scale(${sp(f, Ei(4) - 40)})`, transformOrigin: 'left center'}}>Primer partido: los nazis (37 %)</div>}
        </div>
      )}
      {parteB && <FuenteMini text="Elecciones al Reichstag del 31/7/1932: participación del 84,1 %" x={540} y={1560} at={Fi(4) + 20} />}
      {parteA && <FuenteMini text="Constitución, arts. 67.2 y 68.4 (legislatura de 4 años)" x={540} y={1560} at={Fi(2) + 10} />}
      {f >= Fi(5) - 2 && (
        <>
          <Pildora text="Movilización" x={540} y={760} at={Fi(5)} variante="tinta" size={48} />
          {f >= Fi(6) && (
            <Temblor at={Fi(6)}>
              <Sello x={540} y={920} at={Fi(6)} texto="≠ LIBERTAD" size={80} rot={-5} />
            </Temblor>
          )}
        </>
      )}
      <Tag text="Lo que te dicen" delay={4} top={TAG_TOP} />
      <Sfx at={4} src="pop" volume={0.45} />
      <Sfx at={Fi(1) - 4} src="whoosh_soft" volume={0.4} />
      <Sfx at={Fi(2)} src="paper" volume={0.6} />
      <Sfx at={Fi(3) - 2} src="pop" volume={0.45} />
      <Sfx at={Fi(4) + 10} src="whoosh" volume={0.45} />
      {Array.from({length: 8}).map((_, i) => (
        <Sfx key={i} at={Fi(4) + 20 + i * 6} src="tick" volume={0.2} dur={5} />
      ))}
      <Sfx at={Ei(4) - 40} src="thump" volume={0.5} />
      <Sfx at={Fi(5)} src="pop" volume={0.45} />
      <Sfx at={Fi(6)} src="stamp" volume={0.85} />
    </>
  );
};

// Ciudad de noche cuyas ventanas se apagan (la huelga de la eléctrica).
const Ciudad: React.FC<{apaga: number; hasta: number}> = ({apaga, hasta}) => {
  const f = useCurrentFrame();
  const edif = [
    [90, 260],
    [230, 360],
    [380, 300],
    [520, 420],
    [670, 330],
    [810, 390],
    [950, 280],
  ];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <rect x={0} y={560} width={1080} height={900} fill="#2F3B45" opacity={interpolate(f, [apaga, hasta], [0.15, 0.85], clamp)} />
      {edif.map(([x, h], i) => (
        <g key={i}>
          <rect x={x - 60} y={1460 - h} width={120} height={h} fill="#55626E" stroke={C.tinta} strokeWidth={4} />
          {Array.from({length: Math.floor(h / 60)}).map((_, r) =>
            [0, 1].map((c) => {
              const idx = i * 10 + r * 2 + c;
              const off = apaga + ((idx * 37) % (hasta - apaga));
              return <rect key={`${r}-${c}`} x={x - 40 + c * 50} y={1460 - h + 20 + r * 60} width={30} height={30} fill={f >= off ? '#3A4550' : '#F3D27A'} />;
            }),
          )}
        </g>
      ))}
    </svg>
  );
};

// ---------- 7 · La calle ----------
export const Calle: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('07-calle');
  return (
    <>
      <Ciudad apaga={Fi(0) + 10} hasta={Fi(1) + 20} />
      <Taco x={160} y={720} w={170} mes="BCN" dia="1919" />
      <Gente y={1500} at={Fi(1)} n={9} h={200} pose={[[0, 'quieto'], [Fi(1) + 12, 'brazos-arriba']]} gesto="serio" />
      <Pildora text="La Canadenca · 44 días de huelga" x={610} y={700} at={Fi(1) + 6} variante="blanco" />
      {f >= Fi(2) + 4 && (
        <Temblor at={Fi(2) + 4}>
          <Sello x={540} y={900} at={Fi(2) + 4} texto="8 HORAS" size={110} rot={-6} color={VERDE} />
        </Temblor>
      )}
      <FuenteMini text="Huelga de La Canadenca (feb.–mar. 1919) · decreto del 3/4/1919" x={540} y={1560} at={Fi(1)} />
      <Tag text="La calle" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(0) + 10} src="riser" volume={0.3} />
      <Sfx at={Fi(1)} src="drop" volume={0.3} />
      <Sfx at={Fi(1) + 6} src="pop" volume={0.4} />
      <Sfx at={Fi(2) + 4} src="stamp" volume={0.85} />
    </>
  );
};

// ---------- 8 · La Boétie ----------
export const Boetie: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('08-boetie');
  const linea = (at: number, texto: string, st: React.CSSProperties, y: number) => {
    if (f < at) return null;
    const k = interpolate(f - at, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
    return <div style={{position: 'absolute', left: 80, right: 80, top: y, textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * 26}px)`, filter: `blur(${(1 - k) * 5}px)`, ...st}}>{texto}</div>;
  };
  const cita = f >= Fi(1) - 4 && f < Fi(3) - 2;
  return (
    <>
      <Halo x={540} y={950} r={500} op={0.28} />
      {f < Fi(1) && (
        <>
          <Pergamino x={540} y={640} w={300} at={2} titulo="s. XVI" />
          <Pildora text="La Boétie · Discurso de la servidumbre voluntaria" x={540} y={1060} at={10} variante="blanco" size={30} />
        </>
      )}
      {cita && (
        <>
          <div style={{position: 'absolute', left: 90, top: 620, fontFamily: SERIF, fontWeight: 700, fontSize: 200, color: C.dorado, opacity: 0.35, lineHeight: 1}}>«</div>
          {linea(Fi(1), 'Decidíos a no servir más…', {fontFamily: SERIF, fontSize: 70, color: C.tinta}, 760)}
          {linea(Fi(2), 'y seréis libres.', {fontFamily: SERIF, fontWeight: 700, fontSize: 86, color: C.burdeos}, 880)}
          <FuenteMini text="La Boétie, Discurso de la servidumbre voluntaria (h. 1548)" x={540} y={1060} at={Fi(2) + 10} />
        </>
      )}
      {f >= Fi(3) - 2 && <Poder x={540} y={860} at={Fi(3) - 2} w={420} revela={Fi(4) + 4} tiembla={Fi(4) + 4} />}
      <Tag text="El fondo" delay={4} top={TAG_TOP} />
      <Sfx at={2} src="paper" volume={0.5} />
      <Sfx at={Fi(1)} src="shimmer" volume={0.35} />
      <Sfx at={Fi(2)} src="ding" volume={0.35} />
      <Sfx at={Fi(3) - 2} src="thump" volume={0.5} />
      <Sfx at={Fi(4) + 4} src="clunk" volume={0.6} />
    </>
  );
};

// ---------- 9 · Cierre ----------
export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('09-cierre');
  const Ei = E('09-cierre');
  const outro = Ei(6) + 8;
  const levantada = f >= Fi(3);
  return (
    <>
      {f < outro && (
        <Camara keys={[[0, 1, 540, 980], [Fi(3), 1, 540, 980], [Fi(5), 1.0, 540, 1000]]}>
          <Sala suelo={1500} />
          <Sofa x={540} y={1440} at={-10} bandera={Fi(1) + 4} vacio={Fi(3)} />
          {levantada && (
            <Lienzo>
              <Persona x={540} y={1490} h={320} at={Fi(3)} {...PERSONA_PASIVA} gesto="serio" pose={[[0, 'quieto'], [Fi(4), 'brazos-arriba']]} semilla={880} />
            </Lienzo>
          )}
          {f >= Fi(4) && <Cartel x={540} y={980} at={Fi(4)} />}
          {f >= Fi(5) && <Gente y={1500} at={Fi(5)} n={8} h={200} x0={110} paso={120} pose={[[0, 'quieto'], [Fi(5) + 14, 'brazos-arriba']]} gesto="contento" />}
        </Camara>
      )}
      <Pildora text="No seas vago" x={540} y={650} at={4} variante="burdeos" out={Fi(3) - 2} size={44} />
      {f >= Fi(2) && f < Fi(3) && (
        <Temblor at={Fi(2)}>
          <Sello x={540} y={800} at={Fi(2)} texto="= RENDIRSE" size={72} rot={-6} />
        </Temblor>
      )}
      <Destello at={Fi(2)} />
      <Pildora text="Con dignidad" x={540} y={650} at={Fi(3) + 4} variante="dorado" out={outro} size={44} />
      <Pildora text="Únete a La Acción" x={540} y={740} at={Fi(5) + 2} variante="tinta" out={outro} size={44} />
      <OutroSol cx={540} cy={800} r={330} logoW={860} at={outro} />
      {f >= outro + 14 && (
        <div style={{position: 'absolute', left: 150, right: 150, top: 1185, padding: '18px 24px', background: '#FFFDF8', border: `4px solid ${C.tinta}`, borderRadius: 18, fontFamily: SANS, fontWeight: 700, fontSize: 38, textAlign: 'center', color: C.tinta, transform: `scale(${sp(f, outro + 14)})`}}>
          ¿Activa o en el sofá? Te leemos en comentarios
        </div>
      )}
      {f >= outro + 30 && (
        <div style={{position: 'absolute', left: 150, right: 150, top: 1350, padding: '20px 24px', background: C.tinta, color: '#FAF7F1', borderRadius: 18, fontFamily: SANS, fontWeight: 700, fontSize: 38, textAlign: 'center', transform: `translateY(${interpolate(f - outro - 30, [0, 10], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px)`, opacity: interpolate(f - outro - 30, [0, 6], [0, 1], clamp)}}>
          Mándaselo a alguien que <span style={{color: C.dorado}}>no va a votar</span>
        </div>
      )}
      <Sfx at={4} src="pop" volume={0.45} />
      <Sfx at={Fi(1) + 4} src="whoosh_soft" volume={0.4} />
      <Sfx at={Fi(2)} src="stamp" volume={0.8} />
      <Sfx at={Fi(3)} src="whoosh" volume={0.45} />
      <Sfx at={Fi(4)} src="paper" volume={0.45} />
      {Array.from({length: 6}).map((_, i) => (
        <Sfx key={i} at={Fi(5) + i * 3} src="drop" volume={0.18} dur={8} />
      ))}
      <Sfx at={outro} src="whoosh" volume={0.5} />
      <Sfx at={outro + 10} src="shimmer" volume={0.5} />
      <Sfx at={outro + 14} src="pop" volume={0.45} />
      <Sfx at={outro + 30} src="whoosh_soft" volume={0.45} />
    </>
  );
};
