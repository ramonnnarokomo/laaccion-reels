import ali from './alineacion.json';
import {armaTimeline} from '../comun';

export const IDS = ['01-gancho', '02-filtracion', '03-cortes', '04-objecion', '05-suarez', '06-sieyes', '07-alternativa', '08-cierre'] as const;
export type Id = (typeof IDS)[number];

const SUBS: Record<Id, string[]> = {
  '01-gancho': ['El primer *borrador* / de la Constitución / se escribió *en secreto.*', 'Y si lo leímos / antes de tiempo… / fue porque alguien / lo *filtró.*'],
  '02-filtracion': ['*Noviembre* / de 1977:|mil-novecientos-setenta-y-siete', 'lo publica / una *revista,*', '*Cuadernos* / para el Diálogo.'],
  '03-cortes': [
    '¿Y quién había elegido / a esas *Cortes?*',
    'Unas elecciones / *libres,* sí.',
    'Pero con una ley / de las *Cortes de Franco,* / refrendada en 1976,|mil-novecientos-setenta-y-seis / que no hablaba / de Cortes *constituyentes.*',
    'Y *41|cuarenta-y-un* senadores / no los votó *nadie:*',
    'los nombró *el Rey.*',
  ],
  '04-objecion': ['Quien lo *defiende* dice:', 'luego hubo *referéndum,* / casi un *88%|ochenta-y-ocho-por-ciento* / de síes.', '*Cierto.*', 'Pero era sí o no / a *TODO.*', '*Monarquía* incluida.'],
  '05-suarez': [
    '¿Por qué no se votó / *aparte?*',
    'Lo contó *Adolfo Suárez* / en una entrevista / de 1995|mil-novecientos-noventa-y-cinco / que no se emitió / hasta *2016.|dos-mil-dieciséis*',
    'Tapando / el *micrófono:*',
    '«hacía encuestas / y *perdíamos».*',
    'Así que metió / la palabra *«Rey»* / en la Ley para / la Reforma Política… / y dio la monarquía / por *votada.*',
  ],
  '06-sieyes': ['*Sieyès* lo dejó escrito / en 1789:|mil-setecientos-ochenta-y-nueve', 'una Constitución / la hace *la nación.*', 'No los poderes / que *ya existen,* / pactando *entre ellos.*'],
  '07-alternativa': ['Y había *alternativa.*', 'En 1976,|mil-novecientos-setenta-y-seis / la oposición unida pedía / un *periodo constituyente* / y una *consulta* / sobre la forma de Estado.', 'Por el camino, / lo *dejaron.*'],
  '08-cierre': ['Elecciones libres… *sí.*', 'Constituyentes / por mandato expreso…', '*no.*', '¿Y si hoy / quisieras *cambiarlo?*', '¿Quién tiene / las *llaves?*', 'Parte *tres.*'],
};

export const {SC, TOTAL, FRASE, LINEAS, F, E} = armaTimeline(ali, IDS, SUBS, 96);
export {FPS} from '../comun';
