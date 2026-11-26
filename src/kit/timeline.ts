import {construyeLineas, type Linea} from './mundo';

// Línea de tiempo de un reel a partir de la duración real de cada clip de voz.
// La primera frase (el gancho) sale entera, más grande, y se queda en pantalla toda la frase.
export const FPS = 30;
type Ali = Record<string, {dur: number; subs: Array<{from: number; to: number; text: string}>}>;

export const armaTimeline = <I extends string>(ali: Ali, ids: readonly I[], subs: Record<I, string[]>, holdFin = 84) => {
  const LEAD = 4;
  const GAP = 7;
  const SC = {} as Record<I, {from: number; to: number; voz: number}>;
  let t = 0;
  ids.forEach((id, i) => {
    const dur = Math.ceil(ali[id].dur * FPS);
    const lead = i === 0 ? 2 : LEAD;
    const len = lead + dur + (i === ids.length - 1 ? holdFin : GAP);
    SC[id] = {from: t, to: t + len, voz: t + lead};
    t += len;
  });
  const TOTAL = t;
  const FRASE = {} as Record<I, Array<{from: number; to: number}>>;
  const LINEAS: Linea[] = [];
  ids.forEach((id, ii) => {
    const s = ali[id].subs;
    if (s.length !== subs[id].length) throw new Error(`Subtítulos de ${id}: ${s.length} frases en la voz y ${subs[id].length} en el texto`);
    FRASE[id] = s.map((x) => ({from: Math.round(x.from * FPS), to: Math.round(x.to * FPS)}));
    s.forEach((x, i) => LINEAS.push(...construyeLineas(SC[id].voz + x.from * FPS, SC[id].voz + x.to * FPS, subs[id][i], ii === 0 && i === 0)));
  });
  LINEAS.forEach((l, i) => {
    const next = LINEAS[i + 1]?.from ?? TOTAL;
    const lastW = l.words[l.words.length - 1].t;
    // el gancho aguanta hasta la frase siguiente aunque haya pausa larga (máximo 2 s tras su última palabra)
    const hold = l.grande ? 60 : 45;
    l.to = next - lastW < hold ? next : lastW + (l.grande ? 45 : 30);
  });
  const F = (id: I) => (i: number) => SC[id].voz - SC[id].from + FRASE[id][i].from;
  const E = (id: I) => (i: number) => SC[id].voz - SC[id].from + FRASE[id][i].to;
  return {SC, TOTAL, FRASE, LINEAS, F, E};
};
