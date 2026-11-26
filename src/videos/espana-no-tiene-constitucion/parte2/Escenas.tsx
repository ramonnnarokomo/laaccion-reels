import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {C, SANS, SERIF} from '../../../kit/brand';
import {clamp, Sfx, Tag} from '../../../kit/ui';
import {Bocadillo} from '../../../kit/figuras';
import {Camara, Halo, PELO, PIEL, Persona, ROPA, Sala, Sello} from '../../../kit/mundo';
import {Flecha, Lienzo, Mesa, Taco, Urna} from '../../../kit/objetos';
import {Destello, FotoReal, FuenteMini, Pildora, Temblor} from '../../../kit/real';
import {Candado, Carpeta, Corona, Defensora, Gente, Libro, Llaves, Microfono, Narrador, Papeleta, Pergamino, Revista, Rotulo, Siguiente} from '../comun';
import {E, F} from './timeline';

const TAG_TOP = 522;
const VERDE = '#2E7D4F';
const sp = (f: number, at: number) => spring({frame: f - at, fps: 30, config: {damping: 12, stiffness: 210}});

// Marcas sobre la página del BOE de 1977 (tarjeta de 560 px de ancho).
const ART3 = {x: 93, y: 490, w: 395, h: 22};
const ART23 = [
  {x: 340, y: 202, w: 222, h: 20},
  {x: 18, y: 227, w: 542, h: 20},
  {x: 18, y: 251, w: 340, h: 20},
];
const REY2 = {x: 142, y: 402, w: 150, h: 20};

// ---------- 1 · Gancho ----------
export const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('01-gancho');
  const hoja = f >= Fi(1) + 20 ? interpolate(f - Fi(1) - 20, [0, 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 0;
  return (
    <>
      <Camara keys={[[0, 1.06, 540, 1000], [Fi(1), 1.0, 540, 980], [Fi(1) + 40, 1.04, 700, 1000]]}>
        <Sala suelo={1480} pared="#E2D7C4" lampara={[480]} />
        <Lienzo>
          {Array.from({length: 7}).map((_, i) => (
            <Persona key={i} x={150 + i * 95} y={1440} h={210} at={2 + i * 2} piel={PIEL[(i * 2) % 5]} pelo={(['corto', 'calvo', 'corto', 'flequillo', 'calvo', 'corto', 'mono'] as const)[i]} peloColor={PELO[(i * 3) % 6]} ropa={ROPA.tinta} acc="corbata" accColor="#5B6B7A" gesto="serio" semilla={300 + i} respira={false} mira={i < 3 ? 1 : -1} />
          ))}
          <Mesa x={440} y={1330} w={760} />
          {/* puerta cerrada */}
          <rect x={890} y={880} width={190} height={600} fill="#9C7E5C" stroke={C.tinta} strokeWidth={6} />
          <circle cx={915} cy={1190} r={10} fill={C.dorado} stroke={C.tinta} strokeWidth={3} />
        </Lienzo>
        <Carpeta x={430} y={1160} at={Fi(0) + 16} w={240} />
        {hoja > 0 && (
          <div style={{position: 'absolute', left: 820 + hoja * 260, top: 1430 - hoja * 40, width: 110, height: 140, background: '#FFFDF8', border: `4px solid ${C.tinta}`, transform: `rotate(${hoja * 40}deg) skewX(-10deg)`}} />
        )}
      </Camara>
      <Pildora text="Se filtró" x={540} y={760} at={Fi(1) + 44} variante="burdeos" />
      <Sfx at={2} src="drop" volume={0.25} />
      <Sfx at={Fi(0) + 16} src="paper" volume={0.6} />
      <Sfx at={Fi(1) + 20} src="whoosh_soft" volume={0.5} />
      <Sfx at={Fi(1) + 44} src="pop" volume={0.5} />
    </>
  );
};

// ---------- 2 · La filtración ----------
export const Filtracion: React.FC = () => {
  const Fi = F('02-filtracion');
  return (
    <>
      <Halo x={540} y={950} r={460} op={0.28} />
      <Taco x={260} y={820} w={230} mes="NOV" dia="1977" />
      <Revista x={700} y={640} at={Fi(1)} w={400} nombre="Cuadernos para el Diálogo" numero="N.º 239 · NOV. 1977" />
      <Pildora text="El borrador secreto" x={540} y={1260} at={Fi(2) + 8} variante="dorado" />
      <FuenteMini text="Cuadernos para el Diálogo, n.º 239 (26/11–2/12/1977)" x={540} y={1360} at={Fi(2)} />
      <Tag text="1977" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(1)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(1) + 6} src="paper" volume={0.6} />
      <Sfx at={Fi(2) + 8} src="pop" volume={0.5} />
    </>
  );
};

// ---------- 3 · Las Cortes de 1977 ----------
export const Cortes: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('03-cortes');
  const Ei = E('03-cortes');
  return (
    <>
      {f < Fi(2) + 4 && (
        <Camara keys={[[0, 1.0, 540, 980], [Fi(1), 1.03, 540, 1000]]}>
          <Sala suelo={1500} />
          <Lienzo>
            <Urna x={540} y={1180} w={240} papeletas={f >= Fi(1) ? 7 : 3} />
          </Lienzo>
          <Gente y={1500} at={Fi(1)} pose={[[0, 'quieto'], [Fi(1) + 10, 'vota']]} />
          {f < Fi(1) && <div style={{position: 'absolute', left: 640, top: 700, fontFamily: SANS, fontWeight: 900, fontSize: 140, color: C.burdeos}}>?</div>}
        </Camara>
      )}
      <Pildora text="15-J-1977 · Libres ✓" x={540} y={700} at={Fi(1) + 4} variante="blanco" out={Fi(2) - 2} />
      <FotoReal src="img/constitucion/boe1977_art2.png" pie="BOE · Ley 1/1977, para la Reforma Política" x={540} y={600} w={560} h={622} at={Fi(2)} out={Fi(3) + 38} zoom={[1, 1]} marcas={[{...ART3, from: Ei(2) - 55, to: Ei(2) - 25}, ...ART23.map((m, i) => ({...m, from: Fi(3) + 2 + i * 9, to: Fi(3) + 11 + i * 9}))]} />
      <Pildora text="Aprobada por las Cortes de Franco" x={540} y={1265} at={Fi(2) + 14} apaga={Fi(2) + 80} out={Fi(3) + 38} />
      <Pildora text="Refrendada en 1976" x={540} y={1350} at={Fi(2) + 80} variante="blanco" out={Fi(3) + 38} />
      <FotoReal src="img/constitucion/senado.png" pie="Palacio del Senado · Madrid" x={500} y={600} w={700} h={425} at={Fi(3) + 40} credito="Foto: Luis García (Zaqarbal) · CC BY-SA 3.0" rot={-2} />
      <Pildora text="41 senadores" x={540} y={1100} at={Fi(3) + 46} variante="dorado" out={Fi(4) - 2} />
      <FotoReal src="img/constitucion/juan-carlos-1975.jpg" pie="Juan Carlos I · proclamación, 22-XI-1975" x={600} y={780} w={600} h={380} at={Fi(4)} credito="Foto: La Vanguardia" foco={[64, 35]} zoom={[1.0, 1.06]} rot={2.5} />
      <Pildora text="Designados por el Rey" x={560} y={1240} at={Fi(4) + 6} variante="burdeos" />
      <FuenteMini text={f < Fi(3) + 40 ? 'Ley 1/1977, para la Reforma Política (BOE 5/1/1977)' : 'Ley 1/1977, art. 2.3 · El País, 17/6/1977'} x={540} y={1530} at={Fi(2) + 6} />
      <Tag text="Las Cortes de 1977" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(1)} src="clunk" volume={0.5} />
      {Array.from({length: 5}).map((_, i) => (
        <Sfx key={i} at={Fi(1) + 10 + i * 4} src="drop" volume={0.2} dur={8} />
      ))}
      <Sfx at={Fi(2)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(2) + 14} src="pop" volume={0.4} />
      <Sfx at={Ei(2) - 55} src="key" volume={0.3} />
      <Sfx at={Fi(3) + 2} src="key" volume={0.3} />
      <Sfx at={Fi(3) + 40} src="whoosh" volume={0.5} />
      <Sfx at={Fi(3) + 46} src="pop" volume={0.4} />
      <Sfx at={Fi(4)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(4) + 6} src="stamp" volume={0.65} />
    </>
  );
};

// Chip que entra con un pequeño rebote (dentro de la papeleta).
const Chip: React.FC<{at: number; children: React.ReactNode; fuerte?: boolean}> = ({at, children, fuerte}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <span style={{display: 'inline-block', transform: `scale(${sp(f, at)})`, background: fuerte ? C.dorado : C.tarjeta, color: C.tinta, fontFamily: SANS, fontWeight: 800, fontSize: 30, padding: '8px 16px', borderRadius: 10, border: `3px solid ${C.tinta}`}}>
      {children}
    </span>
  );
};

// ---------- 4 · Quien lo defiende ----------
export const Objecion: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('04-objecion');
  return (
    <>
      <Camara keys={[[0, 1, 540, 960]]}>
        <Sala suelo={1500} />
        {f < Fi(3) && <Defensora x={210} y={1500} at={2} gesto={[[0, 'contento']]} pose={[[0, 'habla'], [Fi(2), 'quieto']]} mira={1} />}
        {f >= Fi(2) - 4 && <Narrador x={870} y={1500} at={Fi(2) - 4} gesto={[[0, 'contento'], [Fi(3), 'serio']]} pose={[[0, 'mano'], [Fi(3), 'senala']]} mira={-1} />}
      </Camara>
      <Pildora text="«Luego hubo referéndum»" x={540} y={640} at={Fi(0) + 4} variante="blanco" out={Fi(1) - 2} />
      <FotoReal
        src="img/constitucion/boe1978_portada.png"
        pie="BOE · 29 de diciembre de 1978"
        x={560}
        y={600}
        w={560}
        h={519}
        at={Fi(1)}
        out={Fi(3) - 4}
        zoom={[1, 1]}
        marcas={[
          {x: 90, y: 390, w: 360, h: 22, from: Fi(1) + 12, to: Fi(1) + 36},
          {x: 181, y: 408, w: 178, h: 22, from: Fi(1) + 36, to: Fi(1) + 50},
        ]}
      />
      <Pildora text="87,8 % sí" x={560} y={1180} at={Fi(1) + 56} variante="dorado" out={Fi(3) - 4} />
      <FuenteMini text="Referéndum del 6/12/1978: 87,8 % sí · participación, 67,1 %" x={540} y={1540} at={Fi(1) + 56} out={Fi(3) - 4} />
      <Papeleta
        x={540}
        y={640}
        at={Fi(3)}
        contenido={
          <>
            <Chip at={Fi(3) + 8}>Derechos</Chip>
            <Chip at={Fi(3) + 12}>Cortes</Chip>
            <Chip at={Fi(3) + 16}>Autonomías</Chip>
            <Chip at={Fi(3) + 20}>Justicia</Chip>
            <Chip at={Fi(4)} fuerte>
              Monarquía
            </Chip>
          </>
        }
      />
      <Pildora text="Todo junto" x={540} y={1150} at={Fi(3) + 26} variante="tinta" />
      <Tag text="Quien lo defiende" delay={4} top={TAG_TOP} />
      <Sfx at={Fi(0) + 4} src="pop" volume={0.45} />
      <Sfx at={Fi(1)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(1) + 12} src="key" volume={0.3} />
      <Sfx at={Fi(1) + 56} src="ding" volume={0.4} />
      <Sfx at={Fi(3)} src="paper" volume={0.6} />
      {[8, 12, 16, 20].map((d) => (
        <Sfx key={d} at={Fi(3) + d} src="pop" volume={0.25} dur={8} />
      ))}
      <Sfx at={Fi(4)} src="shimmer" volume={0.5} />
    </>
  );
};

// ---------- 5 · Suárez ----------
export const Suarez: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('05-suarez');
  const Ei = E('05-suarez');
  const plato = f >= Fi(1) - 2 && f < Fi(4) - 2;
  return (
    <>
      {f < Fi(1) + 4 && <Corona x={540} y={700} at={2} w={260} interroga />}
      {plato && (
        <Camara keys={[[0, 1, 540, 960], [Fi(2), 1.0, 540, 960], [Fi(2) + 14, 1.12, 640, 1180], [Fi(3) + 10, 1.0, 540, 980]]}>
          <Sala suelo={1500} pared="#E6DCCB" />
          <Lienzo>
            <Persona x={300} y={1500} h={320} at={Fi(1) - 2} piel={PIEL[0]} pelo="largo" peloColor={PELO[5]} ropa={ROPA.arena} falda gesto="neutral" pose={[[0, 'habla'], [Fi(2), 'quieto']]} semilla={410} mira={1} />
            <Persona x={700} y={1500} h={340} at={Fi(1) + 2} piel={PIEL[1]} pelo="corto" peloColor={PELO[0]} ropa={ROPA.tinta} acc="corbata" accColor="#5B6B7A" gesto={[[0, 'neutral'], [Fi(3), 'serio']]} pose={[[0, 'habla'], [Fi(2), 'quieto'], [Fi(3), 'habla']]} semilla={420} mira={-1} />
          </Lienzo>
          <Microfono x={712} y={1335} at={Fi(2)} tapa={Fi(2) + 8} />
        </Camara>
      )}
      {plato && f < Fi(2) && <Taco x={250} y={760} w={200} mes="GRABADA" dia="1995" />}
      {plato && f >= Fi(1) + 60 && f < Fi(2) && <Taco x={830} y={760} w={200} mes="EMITIDA" dia="2016" />}
      {plato && <Rotulo x={300} y={1535} at={Fi(1) + 14} nombre="ADOLFO SUÁREZ" cargo="Presidente del Gobierno (1976–1981)" w={600} />}
      {plato && f >= Fi(3) - 2 && (
        <Bocadillo x={150} y={620} w={780} h={250} tx={650} ty={1120} at={Fi(3) - 2}>
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 60, color: C.tinta, lineHeight: 1.15, textAlign: 'center'}}>«Hacía encuestas y perdíamos»</div>
        </Bocadillo>
      )}
      {plato && <FuenteMini text="Antena 3, 1995 · laSexta, 18/11/2016" x={360} y={885} at={Fi(3) + 6} />}
      <FotoReal src="img/constitucion/boe1977_art2.png" pie="BOE · Ley para la Reforma Política (1977)" x={540} y={600} w={560} h={622} at={Fi(4)} zoom={[1, 1]} marcas={[{...ART23[0], from: Fi(4) + 26, to: Fi(4) + 40}, {...REY2, from: Fi(4) + 48, to: Fi(4) + 60}]} />
      <Pildora text="«Rey», dentro de la ley de 1976" x={540} y={1265} at={Fi(4) + 26} variante="blanco" />
      {f >= Ei(4) - 16 && (
        <Temblor at={Ei(4) - 16}>
          <Sello x={540} y={1110} at={Ei(4) - 16} texto="¿VOTADA?" size={78} rot={-6} />
        </Temblor>
      )}
      <Tag text="La monarquía" delay={4} top={TAG_TOP} />
      <Sfx at={2} src="shimmer" volume={0.4} />
      <Sfx at={Fi(1)} src="whoosh" volume={0.45} />
      <Sfx at={Fi(1) + 14} src="pop" volume={0.4} />
      <Sfx at={Fi(1) + 60} src="paper" volume={0.45} />
      <Sfx at={Fi(2) + 8} src="thump" volume={0.5} />
      <Sfx at={Fi(3) - 2} src="pop" volume={0.5} />
      <Sfx at={Fi(4)} src="whoosh" volume={0.5} />
      <Sfx at={Fi(4) + 26} src="key" volume={0.3} />
      <Sfx at={Fi(4) + 48} src="key" volume={0.3} />
      <Sfx at={Ei(4) - 16} src="stamp" volume={0.85} />
    </>
  );
};

// ---------- 6 · Sieyès: el poder constituyente ----------
export const Sieyes: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('06-sieyes');
  const Ei = E('06-sieyes');
  return (
    <>
      <Halo x={540} y={900} r={460} op={0.26} />
      <Pergamino x={540} y={620} w={340} at={2} out={Fi(1) - 2} />
      <Pildora text="Sieyès · ¿Qué es el Tercer Estado?" x={540} y={1110} at={8} variante="blanco" out={Fi(1) - 2} />
      <Libro x={540} y={600} w={300} at={Fi(1)} />
      {f >= Fi(1) && f < Fi(2) + 4 && (
        <>
          <Gente y={1500} at={Fi(1)} pose={[[0, 'quieto'], [Fi(1) + 12, 'brazos-arriba']]} />
          <Lienzo>
            <Flecha x1={540} y1={1250} x2={540} y2={1010} at={Fi(1) + 10} />
          </Lienzo>
          <Pildora text="La nación ✓" x={540} y={1080} at={Fi(1) + 20} variante="dorado" />
        </>
      )}
      {f >= Fi(2) && (
        <Lienzo>
          <Persona x={380} y={1500} h={320} at={Fi(2)} piel={PIEL[0]} pelo="calvo" peloColor={PELO[3]} ropa={ROPA.tinta} acc="corbata" accColor={C.dorado} gesto="contento" pose="mano" semilla={500} mira={1} />
          <Persona x={700} y={1500} h={320} at={Fi(2) + 4} piel={PIEL[2]} pelo="corto" peloColor={PELO[2]} ropa={ROPA.pizarra} acc="corbata" accColor={C.burdeos} gesto="contento" pose="mano" semilla={510} mira={-1} />
        </Lienzo>
      )}
      <Pildora text="Los poderes que ya existen" x={540} y={1080} at={Fi(2) + 8} variante="tinta" />
      {f >= Ei(2) - 12 && <Sello x={540} y={830} at={Ei(2) - 12} texto="✗" size={150} rot={-6} />}
      <FuenteMini text="Sieyès, ¿Qué es el Tercer Estado? (1789)" x={540} y={1540} at={10} />
      <Tag text="Poder constituyente" delay={4} top={TAG_TOP} />
      <Sfx at={2} src="paper" volume={0.6} />
      <Sfx at={Fi(1)} src="whoosh" volume={0.45} />
      <Sfx at={Fi(1) + 12} src="riser" volume={0.3} />
      <Sfx at={Fi(1) + 20} src="ding" volume={0.4} />
      <Sfx at={Fi(2)} src="pop" volume={0.4} />
      <Sfx at={Ei(2) - 12} src="stamp" volume={0.85} />
    </>
  );
};

// ---------- 7 · La alternativa ----------
export const Alternativa: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('07-alternativa');
  const Ei = E('07-alternativa');
  const cae = f >= Fi(2) ? interpolate(f - Fi(2), [0, 26], [0, 1], {...clamp, easing: Easing.in(Easing.quad)}) : 0;
  const linea = (at: number, t: string) =>
    f >= at && (
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: C.tinta, marginTop: 14, transform: `scale(${sp(f, at)})`, transformOrigin: 'left center'}}>
        <span style={{color: VERDE}}>✓</span> {t}
      </div>
    );
  const s = f >= Fi(1) ? sp(f, Fi(1)) : 0;
  return (
    <>
      <Camara keys={[[0, 1, 540, 960]]}>
        <Sala suelo={1420} />
        {/* el camino */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <path d="M380 1420 L700 1420 L1000 1920 L80 1920 Z" fill="#D9CDB8" />
          <path d="M540 1440 V1500 M540 1560 V1640 M540 1700 V1800" stroke="#FFFDF8" strokeWidth={10} />
        </svg>
        {f >= Fi(1) + 4 && <Gente y={1410} at={Fi(1) + 4} n={7} h={170} x0={230} paso={100} gesto={[[0, 'contento'], [Fi(2), 'duda']]} />}
      </Camara>
      <Pildora text="Había alternativa" x={540} y={680} at={2} variante="dorado" out={Fi(1) - 2} />
      {f >= Fi(1) && (
        <div
          style={{
            position: 'absolute',
            left: 130,
            width: 820,
            top: 640 + cae * 820,
            transform: `scale(${s * (1 - cae * 0.55)}) rotate(${-1.5 + cae * 28}deg)`,
            opacity: 1 - Math.max(0, cae - 0.75) * 4,
            background: '#FFFDF8',
            borderTop: `9px solid ${C.burdeos}`,
            boxShadow: '0 14px 30px rgba(32,32,30,0.2)',
            padding: '22px 28px 26px',
          }}
        >
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', color: C.burdeos}}>COORDINACIÓN DEMOCRÁTICA · 1976</div>
          <div style={{fontFamily: SERIF, fontSize: 34, color: C.piedra, marginTop: 6}}>La oposición unida pedía:</div>
          {linea(Fi(1) + Math.round((Ei(1) - Fi(1)) * 0.45), 'Periodo constituyente')}
          {linea(Fi(1) + Math.round((Ei(1) - Fi(1)) * 0.7), 'Consulta sobre la forma de Estado')}
        </div>
      )}
      <FuenteMini text="Programa de Coordinación Democrática (26/3/1976)" x={540} y={990} at={Fi(1) + 10} out={Fi(2)} />
      <Tag text="La alternativa" delay={4} top={TAG_TOP} />
      <Sfx at={2} src="pop" volume={0.45} />
      <Sfx at={Fi(1)} src="paper" volume={0.6} />
      <Sfx at={Fi(1) + Math.round((Ei(1) - Fi(1)) * 0.45)} src="ding" volume={0.35} />
      <Sfx at={Fi(1) + Math.round((Ei(1) - Fi(1)) * 0.7)} src="ding" volume={0.35} />
      <Sfx at={Fi(2) + 8} src="whoosh" volume={0.5} />
      <Sfx at={Fi(2) + 24} src="drop" volume={0.5} />
    </>
  );
};

// ---------- 8 · Veredicto y gancho a la parte 3 ----------
export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const Fi = F('08-cierre');
  const fila = (at: number, texto: string, ok: boolean, y: number) =>
    f >= at && (
      <div style={{position: 'absolute', left: 140, right: 140, top: y, transform: `scale(${sp(f, at)})`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFDF8', boxShadow: '0 10px 24px rgba(32,32,30,0.14)', padding: '22px 30px', borderLeft: `10px solid ${ok ? VERDE : C.burdeos}`}}>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.tinta, textTransform: 'uppercase', letterSpacing: '0.03em'}}>{texto}</span>
        <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 64, color: ok ? VERDE : C.burdeos}}>{ok ? '✓' : f >= Fi(2) ? '✗' : '…'}</span>
      </div>
    );
  const arriba = f >= Fi(3);
  return (
    <>
      <Halo x={540} y={950} r={480} op={0.28} />
      {!arriba && (
        <Temblor at={Fi(2)}>
          {fila(2, 'Elecciones libres', true, 680)}
          {fila(Fi(1), 'Constituyentes por mandato', false, 840)}
        </Temblor>
      )}
      <Destello at={Fi(2)} />
      {arriba && (
        <>
          <Libro x={430} y={640} w={300} at={Fi(3)} />
          <Candado x={430} y={1060} at={Fi(3) + 10} w={170} />
          <Llaves x={790} y={760} at={Fi(4)} w={220} />
          {f >= Fi(4) + 8 && <div style={{position: 'absolute', left: 840, top: 640, fontFamily: SANS, fontWeight: 900, fontSize: 120, color: C.burdeos, transform: `scale(${sp(f, Fi(4) + 8)})`}}>?</div>}
        </>
      )}
      <Siguiente at={Fi(5)} parte={3} titulo="¿Quién tiene las llaves?" />
      <Tag text="Veredicto" delay={4} top={TAG_TOP} sound={false} />
      <Sfx at={2} src="ding" volume={0.4} />
      <Sfx at={Fi(1)} src="pop" volume={0.4} />
      <Sfx at={Fi(2)} src="stamp" volume={0.9} />
      <Sfx at={Fi(3)} src="whoosh" volume={0.45} />
      <Sfx at={Fi(3) + 10} src="clack" volume={0.7} />
      <Sfx at={Fi(4)} src="key" volume={0.5} />
      <Sfx at={Fi(5)} src="whoosh" volume={0.5} />
    </>
  );
};
