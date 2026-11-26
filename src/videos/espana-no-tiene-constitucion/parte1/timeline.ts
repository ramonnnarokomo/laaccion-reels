import ali from './alineacion.json';
import {armaTimeline} from '../comun';

export const IDS = ['01-gancho', '02-art16', '03-derechos', '04-poderes', '05-jueces', '06-hilos', '07-objecion', '08-cierre'] as const;
export type Id = (typeof IDS)[number];

// Un texto por frase (mismo orden que alineacion.json). «/» = línea siguiente; *clave*; cifra|como-se-dice.
const SUBS: Record<Id, string[]> = {
  '01-gancho': [
    'España no tiene / *Constitución.*',
    'Sí, ya sé: hay un *libro* / que se llama así.',
    'Pero existe una *prueba* / de 1789|mil-setecientos-ochenta-y-nueve / para saber si un país / la tiene *DE VERDAD.*',
    'Vamos a *hacérsela.*',
  ],
  '02-art16': ['Artículo 16|dieciséis / de la *Declaración* de Derechos:', 'sin *garantía* de derechos… / ni *separación* de poderes…', 'no hay *Constitución.*'],
  '03-derechos': [
    'Primera *pregunta:*',
    '¿derechos *garantizados?*',
    'Los garantiza, / en última instancia, / el *Constitucional.*',
    'En 2021|dos-mil-veintiuno dijo / que el confinamiento / fue *inconstitucional,*',
    '*seis* votos contra *cinco.*',
    'En 2024,|dos-mil-veinticuatro / con *otros* magistrados, / dio esa doctrina / por *superada.*',
    'O sea:',
    'lo que valen / tus derechos *depende*…',
    'de *quién elige* / a esos magistrados.',
  ],
  '04-poderes': [
    'Segunda *pregunta:*',
    '¿poderes *separados?*',
    'Al presidente / lo vota el *Congreso.*',
    'A los diputados / los pone en las listas / la *dirección* de su partido, / que suele presidir / el propio *candidato.*',
    'O sea:',
    'el candidato / elige a *los suyos*…',
    'y los suyos / le *eligen a él.*',
  ],
  '05-jueces': [
    '¿Y los *jueces?*',
    'A los 20|veinte vocales / que los gobiernan / los eligen *las Cortes:*',
    'en 2024,|dos-mil-veinticuatro',
    '*10|diez* el PSOE / y *10|diez* el PP.',
    'El *Constitucional* / y el *Fiscal General*…',
    'también salen / de *Cortes y Gobierno.*',
  ],
  '06-hilos': ['Todos los *hilos* acaban…', 'en las *mismas manos.*'],
  '07-objecion': ['Quien lo *defiende* dice:', 'hay elecciones *limpias* / y *libertades.*', 'Nadie lo *discute.*', 'Pero la prueba / no pregunta *si votas.*', 'Pregunta si los poderes / están *separados.*'],
  '08-cierre': ['*SUSPENSO.*', '¿Y quién *escribió* / esa Constitución…', 'y por qué la *monarquía* / nunca se votó *aparte?*', 'Parte *dos.*'],
};

export const {SC, TOTAL, FRASE, LINEAS, F, E} = armaTimeline(ali, IDS, SUBS, 96);
export {FPS} from '../comun';
