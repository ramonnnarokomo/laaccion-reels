# Guía de los reels de LA ACCIÓN

Esta guía manda sobre cualquier otra idea de estilo. Si algo no está aquí, se decide con Ramón.

## Qué es un reel nuestro

- Vertical 9:16, 1080×1920, 30 fps, de 30 a 50 s (90 como mucho).
- Una idea por vídeo. Gancho que se entiende en 2 s, con imagen **y** sonido.
- Un dibujo animado por frase. Algo se mueve o aparece cada 2–3 s.
- Voz: clon de la voz de Ramón (Chatterbox es-es). Subtítulos grabados, palabra clave en burdeos.
- Efectos de sonido en cada aparición. **Sin música.**
- Cada escena lleva su etiqueta: DATO · HAZ LA CUENTA · LA REGLA · LO QUE DICEN QUIENES DISCREPAN · NUESTRA RESPUESTA · QUÉ PROPONEMOS. Así se ve qué es hecho y qué es posición.
- Cierre: logo + pregunta + laaccion.com.

## Identidad

| | |
| --- | --- |
| Tinta | `#20201E` |
| Papel (fondo) | `#FAF7F1` + grano (`public/img/grano.png`) |
| Burdeos (acento) | `#792F36` |
| Dorado (detalles) | `#A58C61` |
| Piedra (secundario) | `#6B6B61` |
| Titulares y cifras | Gelasio (misma métrica que Georgia, la de la web), 700 |
| Etiquetas y subtítulos | Inter 600–700, etiquetas en mayúsculas con espaciado |
| Logo | `public/img/logo.png` (sacado de la web, 1680×560, fondo transparente) |

Estética de periódico de papel: línea fina, planos de color, rayos dorados finos, círculos finos. Como las ilustraciones de la web (`frontend/public/ilustraciones`). Nada de neones, degradados chillones ni emojis.

## Para que aguante la compresión de TikTok

- Grano de papel muy suave (el ruido fino se convierte en manchas al comprimir).
- Ninguna línea de menos de 2 px; nada de rayados finos.
- Texto pequeño (fuentes, notas) a 28 px como mínimo.
- Exportar con CRF 14: TikTok recomprime, así que el original tiene que ir limpio.

## Zonas seguras (Instagram y TikTok)

- Cabecera en y≈190. Contenido entre y=280 y y=1280.
- Subtítulos entre y=1335 y y≈1480.
- Debajo de y=1500 y a la derecha de x=930 en la mitad inferior tapan los botones y el texto: nada importante ahí.

## Kit (`src/kit`)

| Pieza | Para qué |
| --- | --- |
| `Paper`, `Header`, `Tag`, `SceneIn`, `Rise` | Fondo, cabecera de serie, etiqueta-sello, entradas |
| `Typed`, `Counter`, `Dots` | Operaciones que se escriben, contadores con rodillo, puntos que cuentan |
| `Subtitles` | Subtítulos por tramos; `/` separa líneas, `*texto*` en burdeos |
| `Rays`, `Headline` | Rayos del sol del logo, titulares |
| `Monigote`, `Multitud`, `Bocadillo`, `Edificio`, `Comillas` | Personajes y objetos |
| `Sfx` | Un efecto en un fotograma |

### Monigotes

- Son **papeles**, no personas: diputado (`corbata`), presidente (`banda`), ciudadana/o, cúpula del partido (`maletin`), votante (`papeleta`). Sin cara.
- Nunca una persona real reconocible (ni rasgos, ni peinados, ni caricaturas). Nada de logos ni colores reales de partidos: «Partido A / Partido B» o el nombre en texto si el dato lo exige.
- Colores: tinta por defecto, burdeos para el protagonista de la frase, piedra para «la gente» o el fondo.

### Efectos (`public/sfx`, sintetizados por `tools/sfx.py`, son nuestros)

| Efecto | Cuándo |
| --- | --- |
| `clunk` | Golpe fuerte (gancho, algo que cae y pesa) |
| `drop`, `whoosh`, `whoosh_soft` | Caídas, cambios de escena, entradas |
| `thump`, `stamp` | Titular que golpea, etiqueta-sello, cifra final |
| `pop`, `tick` | Puntos y monigotes que aparecen (pop si son pocos, tick si son muchos) |
| `key` | Texto que se escribe |
| `ding` | Resultado, equilibrio, final |
| `shimmer` | Algo que se ilumina (los 102 escaños) |
| `paper`, `riser` | Bocadillo o tarjeta que entra, barras que crecen |

Si un efecto suena pobre se puede cambiar por uno CC0 (Kenney, Freesound filtrado por CC0) que Ramón descargue.

## Series

| Serie | Duración | Estructura |
| --- | --- | --- |
| **Haz la cuenta** | 40–50 s | Pregunta que choca → cifra → operación en pantalla → la regla que lo causa → quienes discrepan → qué proponemos → dónde verlo |
| **Frase hecha** | 25–40 s | La frase de siempre → lo que tiene de razón → el dato que falla → respuesta en una línea → pregunta |
| **La deuda perpetua** | 60–90 s | Pregunta → historia en tres momentos → caja HECHO / INTERPRETACIÓN → qué cambia hoy → artículo |

## La voz

1. Ramón grabó una vez una muestra limpia de 15–30 s (`voz/muestra-ramon.wav`, fuera del repo si prefiere).
2. Para cada vídeo, Claude le da el texto en bloques de ≤ 280 caracteres, números escritos en letra.
3. Ramón lo genera en la demo de Chatterbox es-es (https://huggingface.co/spaces/ResembleAI/Chatterbox-Multilingual-TTS-es-es) con su muestra y adjunta los audios.
4. Claude: normaliza (ffmpeg `loudnorm=I=-14:TP=-1.5`), corta por silencios (`silencedetect`), ajusta `timeline.ts` a las duraciones reales y baja `SFX_GAIN` a ~0,6.
5. Al publicar: etiqueta de IA activada y «Voz generada con IA a partir de la voz de Ramón» en el texto.

## Reglas que no se negocian

- Cada cifra con su fuente abierta; separar hecho, interpretación y posición. Nada «a comprobar» sin verificar.
- No partidista: se critican reglas, no personas ni partidos por ser quienes son.
- Versión seria, nunca la conspiranoica.
- Ninguna voz ni cara de personas reales salvo la de Ramón (y la de Alberto solo con su permiso).
- Nada de música, clips o imágenes con derechos. Ni copiar frases, metáforas o estructura de otras cuentas.
- Semana electoral: sin sondeos los 5 días previos (LOREG 69.7) y nada de campaña el día de reflexión (art. 53).

## Revisión (tres pasadas antes de entregar)

1. **Fotogramas**: `node render.mjs stills 20,100,...` en los momentos con más cosas: solapes, zonas seguras, legibilidad.
2. **Datos**: cada cifra en pantalla contra su fuente; cálculos rehechos en código.
3. **Vídeo**: duración, sincronía voz–subtítulos, sonido (picos < −1 dBFS; voz ~−14 LUFS).

## Entrega

- `<slug>.mp4`, `<slug>_portada.jpg` (fotograma del gancho o de la revelación), `<slug>_texto-del-post.txt` (con fuentes, aviso de voz IA y recordatorio de etiqueta).

## Comandos

```bash
npm ci
node render.mjs stills 20,170,440          # fotogramas de control → out/stills
COMP=<slug> node render.mjs video out/<slug>.mp4
python3 -I tools/sfx.py public/sfx         # regenerar efectos
npx remotion studio --port 3000            # vista previa (nunca el 4200)
```
