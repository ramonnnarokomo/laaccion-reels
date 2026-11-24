// Tiempos del piloto «¿Cuánto pesa tu voto?» a 30 fps.
// Cuando llegue la voz, se ajustan estos tramos a la duración de cada frase.

export const FPS = 30;

export const SCENES = {
  gancho: [0, 105],
  revelacion: [105, 195],
  madrid: [195, 450],
  soria: [450, 620],
  regla: [620, 810],
  discrepan: [810, 945],
  respuesta: [945, 1150],
  propuesta: [1150, 1285],
  cierre: [1285, 1395],
} as const;

export type SceneId = keyof typeof SCENES;
export const TOTAL = SCENES.cierre[1];

// Subtítulos: "/" separa líneas; *texto* va en burdeos.
const SUBS: [SceneId, string[]][] = [
  ['gancho', ['¿Dónde pesa más tu voto: / *en Madrid o en Soria?*']],
  ['revelacion', ['En Soria: / *casi cuatro veces más.*']],
  ['madrid', ['Haz la cuenta. / Madrid: 38 diputados', 'para 5,5 millones / de electores.', '*Uno por cada 146.000.*']],
  ['soria', ['Soria: 2 para 77.000.', '*Uno por cada 38.500.*']],
  ['regla', ['No es un fallo. / Es la ley:', 'cada provincia tiene / *dos diputados fijos,*', 'viva quien viva allí.']],
  ['discrepan', ['Dicen quienes discrepan:', 'sin ese mínimo, la España / vaciada *no pintaría nada.*']],
  ['respuesta', ['Para eso está el Senado:', 'cuatro senadores / elegidos por provincia.', 'En el Congreso, cada persona / *debería pesar igual.*']],
  ['propuesta', ['Proponemos distritos / de igual población,', 'con un diputado / *que responda ante ti.*']],
  ['cierre', ['Busca tu provincia / en *laaccion.com*']],
];

import type {SubItem} from '../../kit/ui';
export type {SubItem};

const words = (s: string) => s.replace(/[/*]/g, ' ').split(/\s+/).filter(Boolean).length;

export const SUBTITLES: SubItem[] = SUBS.flatMap(([id, chunks]) => {
  const [a, b] = SCENES[id];
  const start = a + 2;
  const end = b - 1;
  const total = chunks.reduce((s, c) => s + words(c), 0);
  let t = start;
  return chunks.map((text) => {
    const d = Math.round(((end - start) * words(text)) / total);
    const item = {from: t, to: t + d, text};
    t += d;
    return item;
  });
});
