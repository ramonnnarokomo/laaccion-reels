import ali from './alineacion.json';
import {armaTimeline} from '../../kit/timeline';

export const IDS = ['01-gancho', '02-dato', '03-pasiva', '04-activa', '05-conciencia', '06-objeciones', '07-calle', '08-boetie', '09-cierre'] as const;
export type Id = (typeof IDS)[number];

const SUBS: Record<Id, string[]> = {
  '01-gancho': ['Hay *dos formas* / de no votar.', 'Una le hace un *favor* / al poder.', 'La otra le quita / lo *único* que necesita.'],
  '02-dato': ['En 2023|dos-mil-veintitrés / no votaron / *12,5|doce millones*|millones-y-medio / de personas.', 'Uno de cada *tres.*', 'Y casi nadie supo / *por qué.*'],
  '03-pasiva': ['Esa es la abstención / *por vaguería:*', 'te quedas en casa, / no dices nada… / y el lunes lo llaman / *pasotismo.*'],
  '04-activa': ['La *activa* / parte de una idea:', 'votar una lista cerrada / *no es elegir.*', 'Es *FIRMAR* / a quien pone el partido.', 'Y nada obliga al diputado / a *cumplir* / lo que te prometió.'],
  '05-conciencia': ['Abstenerse a conciencia / es *no firmar.*', '*Decirlo* en voz alta.', '*Explicar* por qué.', 'Y *organizarse* / con los que piensan igual.'],
  '06-objeciones': [
    '«Si no votas, / no te *quejes.*»',
    'Al *revés:*',
    'el que vota firma / un *cheque en blanco* / de 4|cuatro años.',
    '«Si no votas, / ganan los *peores.*»',
    'En julio de 1932|mil-novecientos-treinta-y-dos / votó el *84%|ochenta-y-cuatro-por-ciento* / de los alemanes… / y los *nazis* / salieron primeros.',
    'La participación / mide *movilización,*',
    'no *libertad.*',
  ],
  '07-calle': ['Las *ocho horas* / no salieron de una urna:', 'las arrancó / una *huelga,*', 'en *1919.|mil-novecientos-diecinueve*'],
  '08-boetie': ['Hace casi 500|quinientos años, / *La Boétie* / lo dejó escrito:', '«decidíos / a *no servir* más…', 'y seréis *libres*».', 'Lo único / que el poder necesita…', 'es tu *consentimiento.*'],
  '09-cierre': ['Así que / *no seas vago.*', 'Quedarse en casa / no es abstenerse:', 'es *rendirse.*', 'Abstente / con *dignidad,*', '*dilo*…', 'y *únete* a La Acción.', '*laaccion.com*|la-acción-punto-com'],
};

export const {SC, TOTAL, FRASE, LINEAS, F, E} = armaTimeline(ali, IDS, SUBS, 110);
export {FPS} from '../../kit/timeline';
