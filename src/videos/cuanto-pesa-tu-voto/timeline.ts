// Tiempos del piloto «¿Cuánto pesa tu voto?» a 30 fps, ajustados a la voz.
// Cada escena empieza cuando arranca su frase; la voz de cada escena es un clip en public/voz/.

import type {SubItem} from '../../kit/ui';
export type {SubItem};

export const FPS = 30;

export const SCENES = {
  gancho: [0, 98],
  revelacion: [98, 176],
  madrid: [176, 421],
  soria: [421, 596],
  regla: [596, 771],
  discrepan: [771, 899],
  respuesta: [899, 1079],
  propuesta: [1079, 1201],
  cierre: [1201, 1327],
} as const;

export type SceneId = keyof typeof SCENES;
export const TOTAL = SCENES.cierre[1];

// Clip de voz de cada escena y con cuántos fotogramas de retraso entra
export const VOZ: [SceneId, string, number][] = [
  ['gancho', '01-gancho', 0],
  ['revelacion', '02-revelacion', 2],
  ['madrid', '03-madrid', 0],
  ['soria', '04-soria', 0],
  ['regla', '05-regla', 0],
  ['discrepan', '06-discrepan', 0],
  ['respuesta', '07-respuesta', 0],
  ['propuesta', '08-propuesta', 0],
  ['cierre', '09-cierre', 0],
];

// Subtítulos: [desde, fin de la frase hablada, hasta] en fotogramas absolutos.
// "/" separa líneas; *texto* va en burdeos. Las palabras entran al ritmo de la voz.
export const SUBTITLES: SubItem[] = [
  {from: 2, speakEnd: 88, to: 98, text: '¿Dónde pesa más tu voto: / *en Madrid o en Soria?*'},
  {from: 101, speakEnd: 144, to: 176, text: 'En Soria: / *casi cuatro veces más.*'},
  {from: 178, speakEnd: 255, to: 265, text: 'Haz la cuenta. / Madrid: 38 diputados'},
  {from: 267, speakEnd: 316, to: 330, text: 'para 5,5 millones / de electores.'},
  {from: 332, speakEnd: 379, to: 412, text: '*Uno por cada 146.000.*'},
  {from: 422, speakEnd: 483, to: 495, text: 'Soria: 2 para 77.000.'},
  {from: 497, speakEnd: 552, to: 590, text: '*Uno por cada 38.500.*'},
  {from: 597, speakEnd: 649, to: 657, text: 'No es un fallo. / Es la ley:'},
  {from: 659, speakEnd: 724, to: 732, text: 'cada provincia tiene / *dos diputados fijos,*'},
  {from: 734, speakEnd: 763, to: 768, text: 'viva quien viva allí.'},
  {from: 772, speakEnd: 801, to: 808, text: 'Dicen quienes discrepan:'},
  {from: 810, speakEnd: 887, to: 896, text: 'sin ese mínimo, la España / vaciada *no pintaría nada.*'},
  {from: 900, speakEnd: 933, to: 938, text: 'Para eso está el Senado:'},
  {from: 939, speakEnd: 986, to: 1001, text: 'cuatro senadores / elegidos por provincia.'},
  {from: 1003, speakEnd: 1069, to: 1076, text: 'En el Congreso, cada persona / *debería pesar igual.*'},
  {from: 1080, speakEnd: 1139, to: 1144, text: 'Proponemos distritos / de igual población,'},
  {from: 1145, speakEnd: 1191, to: 1199, text: 'con un diputado / *que responda ante ti.*'},
  {from: 1202, speakEnd: 1295, to: 1320, text: 'Busca tu provincia / en *laaccion.com*'},
];
