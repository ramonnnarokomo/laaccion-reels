import ali from './alineacion.json';
import {armaTimeline} from '../comun';

export const IDS = ['01-gancho', '02-reformas', '03-deuda', '04-llaves', '05-objecion', '06-frase', '07-propuesta', '08-cierre'] as const;
export type Id = (typeof IDS)[number];

const SUBS: Record<Id, string[]> = {
  '01-gancho': ['Si naciste después / de *1960,|mil-novecientos-sesenta*', 'nunca has votado / la Constitución / que te *gobierna.*', 'Y cuando / la han *cambiado*…', 'tampoco te han / *preguntado.*'],
  '02-reformas': [
    '*Cuatro* reformas:',
    'en el *92,|noventa-y-dos* / en el *2011,|dos-mil-once*',
    'en el *2024…|dos-mil-veinticuatro*',
    'y *este año.*',
    'Ninguna / a *referéndum:*',
    'tenía que pedirlo / una *décima parte* / de los diputados / o de los senadores.',
    'Nunca se *llegó.*',
  ],
  '03-deuda': ['La de 2011|dos-mil-once / dio *prioridad absoluta* / al pago de la *deuda*…', 'y se aprobó / en menos de *dos semanas.*'],
  '04-llaves': ['¿Y cambiar *lo importante,* / como la *monarquía?*', '*Dos tercios* del Congreso / y del Senado, / *disolver* las Cortes, / *elecciones,*', 'otra vez / *dos tercios*…', 'y *referéndum.*', 'Las *llaves* las tienen… / los que ya están *dentro.*'],
  '05-objecion': [
    'Quien lo *defiende* dice:',
    'aquí puedes defender / *cualquier idea,*',
    'hasta cambiar / la Constitución *entera:*',
    'lo ha dicho / el *Constitucional.*',
    'Es *verdad.*',
    'Pero *Tocqueville* / ya lo vio:',
    'la mayoría traza / un *círculo* / alrededor del pensamiento.',
    '*Dentro,*',
    'eres *libre.*',
    'Si *sales*…',
    'te conviertes / en un *extraño.*',
  ],
  '06-frase': ['El consenso / no prohíbe / pensar *distinto.*', 'Hace que / pensar distinto…', 'no sirva para / cambiar *nada.*'],
  '07-propuesta': [
    '*Madison* lo escribió / en 1788:|mil-setecientos-ochenta-y-ocho',
    'que la *ambición* / contrarreste / a la *ambición.*',
    'Eso *proponemos:*',
    'el *presidente,*',
    'elegido *aparte;*',
    'tu diputado, / de *tu distrito* / y *revocable;*',
    'una *justicia* / que no nombren / los partidos.',
    'Y lo importante…',
    'a *referéndum.*',
  ],
  '08-cierre': ['No va de izquierdas / o derechas:', 'va de *quién controla* / al poder.', '*Mándaselo* a quien diga / que esta Constitución / nos la dimos / *entre todos.*'],
};

export const {SC, TOTAL, FRASE, LINEAS, F, E} = armaTimeline(ali, IDS, SUBS, 130);
export {FPS} from '../comun';
