import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {C, SANS, SERIF} from '../../../kit/brand';
import {clamp, Sfx, Tag} from '../../../kit/ui';
import {Bocadillo} from '../../../kit/figuras';
import {Camara, Halo, OutroSol, PELO, PIEL, Persona, ROPA, Sala, Sello} from '../../../kit/mundo';
import {Lienzo, Taco} from '../../../kit/objetos';
import {Destello, FotoReal, FuenteMini, Pildora, Recorte, Temblor} from '../../../kit/real';
import {Corona, Defensora, Gente, Llaves, Narrador, Pergamino} from '../comun';
import {E, F} from './timeline';

const TAG_TOP = 522;
const sp = (f: number, at: number) => spring({frame: f - at, fps: 30, config: {damping: 12, stiffness: 210}});
const sale = (f: number, out: number) => interpolate(f - out, [0, 8], [1, 0], clamp);

// ---------- 1 · Gancho ----------
export const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('01-gancho');
  return (
    <>
      <Camara keys={[[0, 1.04, 540, 990], [Fi(1), 1.0, 540, 960], [Fi(3), 1.0, 540, 960], [Fi(3) + 30, 1.05, 540, 1040]]}>
        <Sala suelo={1500} />
        <Gente y={1500} at={Fi(0) + 4} n={8} x0={150} paso={112} gesto={[[0, 'contento'], [Fi(3), 'duda']]} />
      </Camara>
      {f < Fi(1) + 2 && <Taco x={540} y={800} w={260} mes="NACISTE" dia="1961" anio="O DESPUÉS" />}
      <FotoReal
        src="img/constitucion/boe1978_portada.png"
        pie="Referéndum · 6 de diciembre de 1978"
        x={540}
        y={600}
        w={520}
        h={482}
        at={Fi(1)}
        out={Fi(2) - 2}
        zoom={[1, 1]}
        marcas={[
          {x: 84, y: 370, w: 334, h: 20, from: Fi(1) + 10, to: Fi(1) + 30},
          {x: 168, y: 387, w: 165, h: 20, from: Fi(1) + 30, to: Fi(1) + 42},
        ]}
      />
      <Pildora text="Nunca la votaste" x={540} y={1130} at={Fi(1) + 30} variante="burdeos" out={Fi(2) - 2} />
      {f >= Fi(3) && <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 170, color: C.burdeos, transform: `scale(${sp(f, Fi(3))})`}}>?</div>}
      <FuenteMini text="Para votar el 6/12/1978 había que tener 18 años" x={540} y={1540} at={Fi(1) + 10} out={Fi(2)} />
      <Sfx at={2} src="paper" volume={0.5} />
      <Sfx at={Fi(0) + 4} src="drop" volume={0.25} />
      <Sfx at={Fi(1)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(1) + 30} src="stamp" volume={0.6} />
      <Sfx at={Fi(3)} src="pop" volume={0.5} />
    </>
  );
};

// ---------- 2 · Las cuatro reformas ----------
export const Reformas: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('02-reformas');
  const Ei = E('02-reformas');
  const t2011 = Fi(1) + Math.round((Ei(1) - Fi(1)) * 0.55);
  const fuera = Fi(5) - 2;
  const sellos = [
    [290, 700],
    [790, 700],
    [290, 1010],
    [790, 1030],
  ];
  const quien = 4;
  return (
    <>
      <Halo x={540} y={900} r={480} op={0.25} />
      <Recorte x={290} y={610} w={440} at={Fi(1) + 4} out={fuera} medio="BOE · 28/8/1992" texto="Reforma del artículo 13.2" size={36} rot={-2} />
      <FotoReal src="img/constitucion/raw_boe2011_cab.png" pie="BOE · 27/9/2011 · art. 135" x={790} y={590} w={440} h={270} at={t2011} out={fuera} zoom={[1, 1]} rot={2} />
      <Recorte x={290} y={920} w={440} at={Fi(2) + 4} out={fuera} medio="BOE · 17/2/2024" texto="Reforma del artículo 49" size={36} rot={1.5} />
      <FotoReal src="img/constitucion/raw_boe2026_cab.png" pie="BOE · 20/5/2026 · art. 69.3" x={790} y={920} w={440} h={270} at={Fi(3)} out={fuera} zoom={[1, 1]} rot={-1.5} />
      {f >= Fi(4) && f < fuera + 8 && (
        <div style={{position: 'absolute', inset: 0, opacity: sale(f, fuera)}}>
          {sellos.map(([x, y], i) => (
            <Sello key={i} x={x} y={y} at={Fi(4) + 4 + i * 5} texto="SIN REFERÉNDUM" size={38} rot={-8 + i * 3} />
          ))}
        </div>
      )}
      {f >= fuera && (
        <>
          <Lienzo>
            {Array.from({length: 10}).map((_, i) => (
              <Persona key={i} x={110 + i * 95} y={1340} h={190} at={fuera + i} piel={PIEL[(i * 3) % 5]} pelo={(['corto', 'largo', 'calvo', 'mono', 'rizado', 'flequillo'] as const)[i % 6]} peloColor={PELO[(i * 2) % 6]} ropa={i === quien ? ROPA.dorado : ROPA.tinta} acc="corbata" accColor="#5B6B7A" falda={i % 4 === 1} gesto={i === quien ? 'contento' : 'serio'} pose={i === quien ? [[0, 'quieto'], [Fi(5) + 30, 'mano']] : 'quieto'} semilla={600 + i} respira={false} />
            ))}
          </Lienzo>
          <Pildora text="1 de cada 10 diputados o senadores" x={540} y={900} at={Fi(5) + 20} variante="dorado" />
          {f >= Fi(6) && <Sello x={110 + quien * 95} y={1240} at={Fi(6)} texto="✗" size={110} rot={-6} />}
        </>
      )}
      <FuenteMini text="Constitución, art. 167.3" x={540} y={1540} at={Fi(4)} />
      <Tag text="Las reformas" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(1) + 4} src="paper" volume={0.5} />
      <Sfx at={t2011} src="paper" volume={0.5} />
      <Sfx at={Fi(2) + 4} src="paper" volume={0.5} />
      <Sfx at={Fi(3)} src="paper" volume={0.5} />
      {sellos.map((_, i) => (
        <Sfx key={i} at={Fi(4) + 4 + i * 5} src="stamp" volume={0.5} dur={12} />
      ))}
      <Sfx at={fuera} src="whoosh" volume={0.45} />
      <Sfx at={Fi(5) + 20} src="pop" volume={0.45} />
      <Sfx at={Fi(6)} src="stamp" volume={0.8} />
    </>
  );
};

// ---------- 3 · La de 2011 ----------
export const Deuda: React.FC = () => {
  const Fi = F('03-deuda');
  return (
    <>
      <Halo x={540} y={850} r={480} op={0.25} />
      <FotoReal src="img/constitucion/raw_boe2011_art135.png" pie="BOE · 27/9/2011 · art. 135" x={540} y={600} w={760} h={450} at={2} zoom={[1, 1]} marcas={[{x: 368, y: 382, w: 142, h: 18, from: Fi(0) + 30, to: Fi(0) + 52}]} />
      <Pildora text="Prioridad absoluta: la deuda" x={540} y={1150} at={Fi(0) + 54} variante="burdeos" />
      <Taco x={330} y={1360} w={170} mes="AGO" dia={26} anio="2011" hojas={[{at: Fi(1) + 6, mes: 'SEP', dia: 7}]} />
      <Pildora text="12 días" x={720} y={1330} at={Fi(1) + 16} variante="dorado" size={48} />
      <FuenteMini text="Registrada el 26/8/2011 · Senado, 7/9/2011" x={540} y={1540} at={Fi(1) + 10} />
      <Sfx at={2} src="paper" volume={0.55} />
      <Sfx at={Fi(0) + 30} src="key" volume={0.35} />
      <Sfx at={Fi(0) + 54} src="pop" volume={0.45} />
      <Sfx at={Fi(1) + 6} src="paper" volume={0.5} />
      <Sfx at={Fi(1) + 16} src="ding" volume={0.45} />
    </>
  );
};

// ---------- 4 · Las llaves (art. 168) ----------
export const Llaves168: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('04-llaves');
  const Ei = E('04-llaves');
  const fuera = Fi(4) - 2;
  const pasos: Array<[number, string]> = [
    [Fi(1) + 4, '2/3 del Congreso y del Senado'],
    [Fi(1) + Math.round((Ei(1) - Fi(1)) * 0.5), 'Disolver las Cortes'],
    [Fi(1) + Math.round((Ei(1) - Fi(1)) * 0.82), 'Elecciones'],
    [Fi(2) + 4, '2/3 otra vez'],
    [Fi(3) + 2, 'Referéndum'],
  ];
  return (
    <>
      <Halo x={540} y={900} r={480} op={0.25} />
      {f < Fi(1) + 2 && <Corona x={540} y={700} at={2} w={240} interroga />}
      {f < fuera + 8 &&
        pasos.map(([at, t], i) => (
          <React.Fragment key={i}>
            <Pildora text={`${i + 1}. ${t}`} x={540} y={640 + i * 130} at={at} out={fuera} variante={i === 4 ? 'dorado' : i % 2 ? 'blanco' : 'tinta'} size={38} />
            {i > 0 && f >= at && <div style={{position: 'absolute', left: 525, top: 640 + i * 130 - 52, fontFamily: SANS, fontWeight: 900, fontSize: 40, color: C.dorado, opacity: sale(f, fuera)}}>↓</div>}
          </React.Fragment>
        ))}
      <FuenteMini text="Constitución, art. 168" x={540} y={1330} at={Fi(1) + 4} out={fuera} />
      <FotoReal src="img/constitucion/congreso.png" pie="Congreso de los Diputados · Madrid" x={540} y={600} w={760} h={510} at={Fi(4)} credito="Foto: Roberto García · CC BY 2.0" zoom={[1.0, 1.06]} />
      <Llaves x={800} y={770} at={Fi(4) + 16} w={250} />
      <Pildora text="Los que ya están dentro" x={540} y={1230} at={Fi(4) + 30} variante="burdeos" />
      <Tag text="Las llaves" delay={4} top={TAG_TOP} />
      <Sfx at={2} src="shimmer" volume={0.4} />
      {pasos.map(([at], i) => (
        <Sfx key={i} at={at} src="clunk" volume={0.35} dur={12} />
      ))}
      <Sfx at={Fi(4)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(4) + 16} src="key" volume={0.6} />
      <Sfx at={Fi(4) + 30} src="pop" volume={0.45} />
    </>
  );
};

// ---------- 5 · Quien lo defiende · Tocqueville ----------
export const Objecion: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('05-objecion');
  const partB = f >= Fi(5) - 2;
  const linea = (at: number, t: string) =>
    f >= at && (
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.tinta, marginTop: 10, transform: `scale(${sp(f, at)})`, transformOrigin: 'left center'}}>
        {t}
      </div>
    );
  const circulo = interpolate(f, [Fi(6), Fi(6) + 40], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const salida = interpolate(f, [Fi(9), Fi(9) + 24], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const extrano = f >= Fi(10);
  const R = 300;
  const CX = 540;
  const CY = 1200;
  return (
    <>
      {!partB ? (
        <>
          <Camara keys={[[0, 1, 540, 960]]}>
            <Sala suelo={1500} />
            <Defensora x={220} y={1500} at={2} pose={[[0, 'habla'], [Fi(4), 'quieto']]} mira={1} />
            {f >= Fi(4) - 4 && <Narrador x={870} y={1500} at={Fi(4) - 4} gesto="contento" pose="mano" mira={-1} />}
          </Camara>
          <Bocadillo x={150} y={620} w={760} h={300} tx={280} ty={1140} at={Fi(0) + 4}>
            {linea(Fi(1), 'Puedes defender cualquier idea…')}
            {linea(Fi(2), '…hasta cambiar la Constitución entera.')}
          </Bocadillo>
          <FuenteMini text="STC 48/2003" x={540} y={960} at={Fi(3)} />
        </>
      ) : (
        <>
          <Halo x={CX} y={CY} r={420} op={0.25} />
          <Pildora text="Tocqueville · La democracia en América" x={540} y={650} at={Fi(5) + 2} variante="blanco" />
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.piedra} strokeWidth={8} strokeDasharray={`${2 * Math.PI * R * circulo} ${2 * Math.PI * R}`} strokeLinecap="round" transform={`rotate(-90 ${CX} ${CY})`} />
          </svg>
          <Lienzo>
            {Array.from({length: 6}).map((_, i) => {
              const x = [380, 470, 610, 700, 430, 650][i];
              const y = [1300, 1250, 1250, 1300, 1400, 1400][i];
              return (
                <Persona key={i} x={x + (extrano ? -30 : 0)} y={y} h={170} at={Fi(6) + 4 + i * 2} piel={PIEL[(i * 2) % 5]} pelo={(['corto', 'largo', 'mono', 'rizado', 'calvo', 'flequillo'] as const)[i]} peloColor={PELO[(i * 3) % 6]} ropa={[ROPA.oliva, ROPA.pizarra, ROPA.arena, ROPA.burdeos, ROPA.piedra, ROPA.oliva][i]} falda={i % 2 === 1} gesto={extrano ? 'serio' : 'contento'} mira={extrano ? -1 : 0} semilla={700 + i} />
              );
            })}
            {f >= Fi(7) && (
              <Persona x={540 + salida * 400} y={1370} h={180} at={Fi(7)} piel={PIEL[1]} pelo="corto" peloColor={PELO[4]} ropa={ROPA.dorado} gesto={extrano ? 'preocupado' : 'contento'} emote={extrano ? '…' : null} pose={f >= Fi(8) && f < Fi(9) ? 'brazos-arriba' : 'quieto'} semilla={790} />
            )}
          </Lienzo>
          <Pildora text={extrano ? 'Un extraño' : 'Libre ✓'} x={540} y={790} at={f >= Fi(10) ? Fi(10) : Fi(8)} variante={extrano ? 'burdeos' : 'dorado'} />
          <FuenteMini text="Tocqueville, La democracia en América, I (1835), paráfrasis" x={540} y={1540} at={Fi(6)} />
        </>
      )}
      <Tag text="Quien lo defiende" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(0) + 4} src="pop" volume={0.45} />
      <Sfx at={Fi(1)} src="pop" volume={0.3} />
      <Sfx at={Fi(2)} src="pop" volume={0.3} />
      <Sfx at={Fi(4) - 4} src="ding" volume={0.35} />
      <Sfx at={Fi(5)} src="whoosh" volume={0.45} />
      <Sfx at={Fi(6)} src="riser" volume={0.3} />
      <Sfx at={Fi(8)} src="ding" volume={0.4} />
      <Sfx at={Fi(9)} src="whoosh_soft" volume={0.45} />
      <Sfx at={Fi(10)} src="thump" volume={0.55} />
    </>
  );
};

// ---------- 6 · La frase ----------
export const Frase: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('06-frase');
  const linea = (at: number, texto: string, st: React.CSSProperties, y: number) => {
    if (f < at) return null;
    const k = interpolate(f - at, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
    return <div style={{position: 'absolute', left: 90, right: 90, top: y, textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * 30}px)`, filter: `blur(${(1 - k) * 6}px)`, ...st}}>{texto}</div>;
  };
  const sub = interpolate(f, [Fi(2) + 14, Fi(2) + 34], [0, 1], clamp);
  return (
    <>
      <Halo x={540} y={950} r={520} op={0.3} />
      <div style={{position: 'absolute', left: 90, top: 560, fontFamily: SERIF, fontWeight: 700, fontSize: 220, color: C.dorado, opacity: 0.35, lineHeight: 1}}>«</div>
      {linea(Fi(0), 'El consenso no prohíbe pensar distinto.', {fontFamily: SERIF, fontSize: 66, color: C.tinta, lineHeight: 1.2}, 700)}
      {linea(Fi(1), 'Hace que pensar distinto…', {fontFamily: SERIF, fontSize: 66, color: C.tinta, lineHeight: 1.2}, 940)}
      {linea(Fi(2), 'no sirva para cambiar nada.', {fontFamily: SERIF, fontWeight: 700, fontSize: 62, color: C.burdeos, lineHeight: 1.15, whiteSpace: 'nowrap', left: 40, right: 40}, 1040)}
      {f >= Fi(2) && <div style={{position: 'absolute', left: 540 - 380 * sub, width: 760 * sub, top: 1135, height: 8, background: C.dorado, borderRadius: 4}} />}
      <Sfx at={Fi(0)} src="shimmer" volume={0.35} />
      <Sfx at={Fi(2)} src="thump" volume={0.55} />
    </>
  );
};

// Tarjeta numerada de la propuesta.
const Punto: React.FC<{n: number; at: number; y: number; titulo: string; detalle: string}> = ({n, at, y, titulo, detalle}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f - at, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
  return (
    <div style={{position: 'absolute', left: 110, right: 110, top: y, transform: `translateX(${(1 - k) * -80}px)`, opacity: Math.min(1, k * 1.5), display: 'flex', alignItems: 'center', gap: 26, background: '#FFFDF8', boxShadow: '0 10px 24px rgba(32,32,30,0.14)', padding: '20px 26px', borderLeft: `10px solid ${C.dorado}`}}>
      <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: C.burdeos, width: 50, textAlign: 'center'}}>{n}</div>
      <div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.tinta}}>{titulo}</div>
        <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, color: C.piedra, marginTop: 4}}>{detalle}</div>
      </div>
    </div>
  );
};

// ---------- 7 · Madison y la propuesta ----------
export const Propuesta: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('07-propuesta');
  const fuera = Fi(2) - 2;
  const empuje = Math.sin(f / 5) * 6;
  return (
    <>
      <Halo x={540} y={950} r={480} op={0.25} />
      {f < fuera + 8 && (
        <div style={{position: 'absolute', inset: 0, opacity: f >= fuera ? sale(f, fuera) : 1}}>
          <Pergamino x={540} y={600} w={300} at={2} titulo="1788" out={Fi(1) - 2} />
          <Pildora text="Madison · El Federalista, n.º 51" x={540} y={1040} at={8} variante="blanco" />
          {f >= Fi(1) && (
            <>
              <Lienzo>
                <Persona x={380 + empuje} y={1480} h={320} at={Fi(1)} piel={PIEL[0]} pelo="corto" peloColor={PELO[2]} ropa={ROPA.tinta} acc="banda" gesto="enfadado" pose="mano" semilla={800} mira={1} />
                <Persona x={700 - empuje} y={1480} h={320} at={Fi(1) + 4} piel={PIEL[3]} pelo="largo" peloColor={PELO[0]} ropa={ROPA.pizarra} falda gesto="enfadado" pose="mano" semilla={810} mira={-1} />
              </Lienzo>
              <Pildora text="Gobierno" x={330} y={1110} at={Fi(1) + 6} variante="tinta" size={32} />
              <Pildora text="Parlamento" x={750} y={1110} at={Fi(1) + 10} variante="tinta" size={32} />
              <Pildora text="Se vigilan" x={540} y={700} at={Fi(1) + 20} variante="dorado" />
            </>
          )}
        </div>
      )}
      <Punto n={1} at={Fi(3)} y={620} titulo="Presidente, elegido aparte" detalle="votado directamente, no por el Congreso" />
      <Punto n={2} at={Fi(5)} y={830} titulo="Tu diputado, de tu distrito" detalle="uno por distrito, y revocable" />
      <Punto n={3} at={Fi(6)} y={1040} titulo="Justicia sin cuotas" detalle="que no la nombren los partidos" />
      <Punto n={4} at={Fi(7)} y={1250} titulo="Lo importante, a referéndum" detalle="las reglas las decide quien vive bajo ellas" />
      <FuenteMini text="Qué proponemos: opinión editorial de La Acción" x={540} y={1490} at={Fi(2)} />
      <Tag text={f < Fi(2) ? 'La solución de 1788' : 'Qué proponemos'} delay={f < Fi(2) ? 4 : Fi(2)} top={TAG_TOP} />
      <Sfx at={2} src="paper" volume={0.55} />
      <Sfx at={Fi(1)} src="whoosh_soft" volume={0.45} />
      <Sfx at={Fi(1) + 20} src="pop" volume={0.45} />
      {[3, 5, 6, 7].map((i) => (
        <Sfx key={i} at={Fi(i)} src="whoosh" volume={0.35} dur={14} />
      ))}
      <Sfx at={Fi(8)} src="ding" volume={0.4} />
    </>
  );
};

// Móvil con un chat.
const Movil: React.FC<{at: number; out: number; Fi: (i: number) => number}> = ({at, out, Fi}) => {
  const f = useCurrentFrame();
  if (f < at || f > out + 8) return null;
  const k = sp(f, at);
  const msg = (t0: number, texto: string, mio: boolean) =>
    f >= t0 && (
      <div style={{alignSelf: mio ? 'flex-end' : 'flex-start', maxWidth: '82%', background: mio ? '#E8C46A' : '#FFFDF8', color: C.tinta, borderRadius: 18, padding: '14px 18px', fontFamily: SANS, fontWeight: 600, fontSize: 30, marginTop: 14, transform: `scale(${sp(f, t0)})`, transformOrigin: mio ? 'right center' : 'left center'}}>
        {texto}
      </div>
    );
  return (
    <div style={{position: 'absolute', left: 290, top: 600, width: 500, height: 760, transform: `scale(${k}) rotate(-3deg)`, opacity: sale(f, out), background: C.tinta, borderRadius: 50, padding: 18, boxShadow: '0 20px 40px rgba(32,32,30,0.3)'}}>
      <div style={{background: '#2F3B45', borderRadius: 36, height: '100%', padding: '26px 22px', display: 'flex', flexDirection: 'column'}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: '#FAF7F1', textAlign: 'center', paddingBottom: 14, borderBottom: '2px solid rgba(250,247,241,0.2)'}}>Tu amigo</div>
        {msg(at + 6, '«Esta Constitución nos la dimos entre todos»', false)}
        {msg(at + 40, 'Mira esto antes', true)}
      </div>
    </div>
  );
};

// ---------- 8 · Cierre ----------
export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('08-cierre');
  const Ei = E('08-cierre');
  const outro = Ei(2) + 8;
  return (
    <>
      {f < outro && <Halo x={540} y={950} r={480} op={0.25} />}
      <Pildora text="Izquierda" x={300} y={760} at={2} variante="blanco" out={Fi(1) + 6} apaga={Fi(1)} size={44} />
      <Pildora text="Derecha" x={780} y={760} at={8} variante="blanco" out={Fi(1) + 6} apaga={Fi(1)} size={44} />
      <Pildora text="¿Quién controla al poder?" x={540} y={900} at={Fi(1) + 2} variante="dorado" out={Fi(2) - 2} size={50} />
      <Movil at={Fi(2)} out={outro} Fi={Fi} />
      <Pildora text="Mándaselo" x={540} y={1400} at={Fi(2) + 20} variante="tinta" out={outro} size={44} />
      <OutroSol cx={540} cy={800} r={330} logoW={860} at={outro} />
      {f >= outro + 14 && (
        <div style={{position: 'absolute', left: 150, right: 150, top: 1185, padding: '18px 24px', background: '#FFFDF8', border: `4px solid ${C.tinta}`, borderRadius: 18, fontFamily: SANS, fontWeight: 700, fontSize: 38, textAlign: 'center', color: C.tinta, transform: `scale(${sp(f, outro + 14)})`}}>
          ¿Qué cambiarías primero? Te leemos en comentarios
        </div>
      )}
      {f >= outro + 30 && (
        <div style={{position: 'absolute', left: 150, right: 150, top: 1350, padding: '20px 24px', background: C.tinta, color: '#FAF7F1', borderRadius: 18, fontFamily: SANS, fontWeight: 700, fontSize: 38, textAlign: 'center', transform: `translateY(${interpolate(f - outro - 30, [0, 10], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px)`, opacity: interpolate(f - outro - 30, [0, 6], [0, 1], clamp)}}>
          La serie completa, en <span style={{color: C.dorado}}>el perfil</span>
        </div>
      )}
      <Sfx at={2} src="pop" volume={0.4} />
      <Sfx at={8} src="pop" volume={0.4} />
      <Sfx at={Fi(1) + 2} src="ding" volume={0.45} />
      <Sfx at={Fi(2)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(2) + 6} src="pop" volume={0.4} />
      <Sfx at={Fi(2) + 40} src="pop" volume={0.4} />
      <Sfx at={outro} src="whoosh" volume={0.5} />
      <Sfx at={outro + 10} src="shimmer" volume={0.5} />
      <Sfx at={outro + 14} src="pop" volume={0.45} />
      <Sfx at={outro + 30} src="whoosh_soft" volume={0.45} />
    </>
  );
};
