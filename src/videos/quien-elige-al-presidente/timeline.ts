import ali from './alineacion.json';
import {construyeLineas, type Linea} from '../../kit/mundo';

export const FPS = 30;
export const IDS = ['01-gancho', '02-intento', '03-reloj', '04-navidad', '05-regla', '06-discrepan', '07-propuesta', '08-cierre'] as const;
export type Id = (typeof IDS)[number];

const LEAD = 4; // fotogramas antes de que entre la voz
const GAP = 7; // respiro después de cada párrafo
const HOLD_FIN = 84; // cierre: logo y rótulo de compartir

// Inicio y fin (fotogramas) de cada escena, a partir de la duración real de cada clip de voz
export const SC = {} as Record<Id, {from: number; to: number; voz: number}>;
let t = 0;
IDS.forEach((id, i) => {
  const dur = Math.ceil((ali as Record<string, {dur: number}>)[id].dur * FPS);
  const lead = i === 0 ? 2 : LEAD;
  const len = lead + dur + (i === IDS.length - 1 ? HOLD_FIN : GAP);
  SC[id] = {from: t, to: t + len, voz: t + lead};
  t += len;
});
export const TOTAL = t;

// Texto de los subtítulos por frase (mismo orden que alineacion.json). «/» = línea siguiente.
const SUBS: Record<Id, string[]> = {
  '01-gancho': [
    'Votamos el / 23|veintitrés de *julio*…',
    'Y hasta 116|ciento-dieciséis *días* / después, / no hubo presidente *elegido.*',
    '¿Qué *pasó?*',
    'Y ojo, que una vez / casi *votamos*…',
    'en *Navidad.*',
  ],
  '02-intento': [
    'Primero, el candidato / del partido *más votado.*',
    'Necesitaba *176|ciento-setenta-y-seis*…',
    'sacó *172.|ciento-setenta-y-dos*',
    '*Repesca:*',
    'le bastaba con / más *síes* que noes.',
    '*TAMPOCO.*',
  ],
  '03-reloj': [
    'Arranca un *reloj:*',
    '*dos meses,*',
    'o elecciones *otra vez.*',
    'El 16|dieciséis de *noviembre,*',
    'otro candidato / suma *179.|ciento-setenta-y-nueve*',
    'Quedaban *11|once días.*',
  ],
  '04-navidad': [
    '¿Lo de *Navidad?*',
    'En 2016,|dos-mil-dieciséis / el reloj acababa / el *31|treinta-y-uno de octubre.*',
    'Si no,',
    'urnas el *25|veinticinco de diciembre.*',
    '*Investidura*…',
    'el *29.|veintinueve*',
    'Por *DOS* días.',
  ],
  '05-regla': [
    '¿Y por qué *pasa esto?*',
    'Porque al presidente / no lo eligen *las urnas:* / lo votan *350|trescientos-cincuenta* / diputados.',
    '*Tú* eliges quién se sienta.',
    '*Ellos,*',
    'quién *gobierna.*',
  ],
  '06-discrepan': ['Quien defiende el sistema / dice que obliga a *pactar,* / como en *Alemania.*'],
  '07-propuesta': ['Nosotros proponemos / votar al presidente *aparte*… / y que el Congreso / lo *controle.*'],
  '08-cierre': ['¿Tú qué *prefieres?*', 'Vota en *laaccion.com,|la-acción-punto-com*', 'y dínoslo en *comentarios.*'],
};

// Frases con tiempos absolutos (para escenas) y líneas de subtítulo
export const FRASE = {} as Record<Id, Array<{from: number; to: number}>>;
export const LINEAS: Linea[] = [];
IDS.forEach((id) => {
  const subs = (ali as Record<string, {subs: Array<{from: number; to: number; text: string}>}>)[id].subs;
  FRASE[id] = subs.map((s) => ({from: Math.round(s.from * FPS), to: Math.round(s.to * FPS)}));
  subs.forEach((s, i) => {
    const a = SC[id].voz + s.from * FPS;
    const b = SC[id].voz + s.to * FPS;
    LINEAS.push(...construyeLineas(a, b, SUBS[id][i]));
  });
});
// cada línea dura hasta que empieza la siguiente (o 12 fotogramas tras su última palabra si hay hueco largo)
LINEAS.forEach((l, i) => {
  const next = LINEAS[i + 1]?.from ?? TOTAL;
  const lastW = l.words[l.words.length - 1].t;
  l.to = next - lastW < 45 ? next : lastW + 30;
});
