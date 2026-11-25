import ali from './alineacion.json';
import {construyeLineas, type Linea} from '../../kit/mundo';

export const FPS = 30;
export const IDS = ['01-gancho', '02-madrid', '03-teruel', '04-regla', '05-discrepan', '06-propuesta', '07-cierre'] as const;
export type Id = (typeof IDS)[number];

const LEAD = 4; // fotogramas antes de que entre la voz
const GAP = 7; // respiro después de cada párrafo
const HOLD_FIN = 96; // cierre: logo y rótulo de compartir

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
  '01-gancho': ['¿Tu voto vale *lo mismo* / que el de cualquier otro?', 'Pues hay una provincia / donde pesa *más de CUATRO veces* / que en Madrid.', 'Y no…', 'no es *Soria.*'],
  '02-madrid': ['Haz la *cuenta.*', 'Madrid elige *38|treinta-y-ocho diputados* / con *5,5|cinco-y-medio millones* / de electores.', 'Uno por cada *146.000.|ciento-cuarenta-y-seis-mil*'],
  '03-teruel': ['¿Y la provincia *misteriosa?*', '*Teruel.*', '3|tres diputados para / *106.000|ciento-seis-mil* electores.', 'Uno por cada *35.000.|treinta-y-cinco-mil*'],
  '04-regla': [
    '¿Por *qué?*',
    'No es un *fallo.*',
    'Es la *ley:*',
    'cada provincia tiene / *DOS* diputados garantizados, / viva quien viva allí.',
    '*102|ciento-dos* escaños se reparten / antes de contar / a una sola *persona.*',
    'Y Madrid…',
    'es la *última* / de las 52.|cincuenta-y-dos',
  ],
  '05-discrepan': ['Quien lo defiende dice que, / sin ese mínimo, / la España vaciada / *no pintaría nada.*', 'Y tiene *parte de razón.*', 'Pero para eso / ya está el *Senado:*', '*4|cuatro senadores* / por provincia.'],
  '06-propuesta': ['Por eso proponemos / que en el Congreso / cada persona *pese igual:*', 'distritos con / la *misma población*… / y un diputado / que *responda ante ti.*'],
  '07-cierre': ['¿Cuánto pesa el voto / en *tu provincia?*', 'Pregúntanoslo en *comentarios.*', 'Y mándaselo a / alguien de *Teruel.*'],
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
