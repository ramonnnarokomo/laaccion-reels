# Guía de los reels de LA ACCIÓN

Esta guía manda sobre cualquier otra idea de estilo. Si algo no está aquí, se decide con Ramón. **El discurso lo manda [`LINEA.md`](LINEA.md).**

## Qué es un reel nuestro

- Vertical 9:16, 1080×1920, 30 fps, de 30 a 65 s (90 como mucho).
- Una idea por vídeo. Gancho que se entiende en 2 s, con imagen **y** sonido.
- Un dibujo animado por frase. Algo se mueve o aparece cada 2–3 s.
- Voz: clon de la voz de Ramón (Chatterbox es-es). Subtítulos grabados, palabra clave en burdeos.
- Efectos de sonido en cada aparición. **Sin música.**
- Cada escena lleva su etiqueta: DATO · HAZ LA CUENTA · LA REGLA · LO QUE DICEN QUIENES DISCREPAN · NUESTRA RESPUESTA · QUÉ PROPONEMOS. Así se ve qué es hecho y qué es posición.
- Cierre: logo + pregunta + laaccion.com. En **bastantes vídeos (no en todos)**, con `OutroSol`: el sol del logo girando, en versión **simple**: un solo aro de rayos, grande, y el **logo muy grande** delante (por defecto, 860 px de ancho). Nada de halos, aros punteados ni círculos extra (Ramón, 25/11/2026). Le gustó a Ramón en el piloto, pero lo quería más visible.

## Retención (lo que pide Ramón: la retención es la clave)

- **No destripar al principio.** El gancho plantea el misterio o el reto y la respuesta llega pasada la mitad, nunca en los primeros segundos.
- **Bucle abierto:** en los primeros 5 s se promete algo concreto («una vez casi votamos en Navidad») que se paga más tarde.
- **Retos con resultado:** cada escena es una pregunta pequeña que se resuelve (¿llega a 176?, ¿se acaba el reloj?): contador, raya, sello.
- **Cambio de entorno a mitad** (otro fondo, otra estación, otro lugar) para romper el ritmo antes de que baje la atención.
- **Más mundo en pantalla:** figuras, monigotes que hacen cosas, entorno (hemiciclo, tribuna, urnas, calendario, calles), no solo cifras.
- **Cierre que pide comentar:** dos opciones claras y una pregunta.
- Ramón irá pasando vídeos virales (en texto y en vídeo) para analizar sus imágenes y dinámicas y traerlas a nuestra estética: lo que se aprenda va aquí.

### Lecciones de vídeos virales

**25/11/2026 · 5 vídeos de una cuenta de animación política (67–165 s).** Se adopta la forma, nunca el contenido, las frases ni la postura.

Guion:
- **Escalera de preguntas.** El gancho es una pregunta hipotética, una frase que el espectador ya ha oído o una persona con lo que le pasó. Enseguida viene una micro-respuesta que abre otra pregunta, y así sigue: una pregunta cada ~5 s, con respuestas de una o dos palabras.
- **Frases de 3–8 palabras.** Se habla de tú y una sola palabra por frase va en MAYÚSCULAS.
- **Concesión honesta** («¿Es mentira? No del todo») y **apoyo en una autoridad con ficha de fuente** en pantalla.
- **Una persona real y pública con nombre, cargo y lugar**, si la historia lo pide, con fuente. Las historias de personas retienen más que las ideas sueltas.
- **Re-gancho a mitad** que anuncia algo que «no se cuenta».
- **Cierre** con una frase redonda que reencuadra, una acción concreta y una invitación a mandárselo a alguien concreto. Esa invitación es el disparador de compartidos.

Imagen:
- **Cada escena es un lugar**: colegio electoral (mesa, urna, papeletas, reloj de pared, pizarra), hemiciclo con tribuna, oficina, salón con sofá, ayuntamiento, estantería de leyes, calle con casas. Siempre hay suelo, fondo y luz.
- **Personajes con cara sencilla y emociones**: ojos de punto, cejas y boca. Preocupado, gota de sudor, sorpresa, sonrisa, «?» o «!» sobre la cabeza, bocadillo «…». Variedad de tonos de piel y peinados. La ropa distingue papeles, nunca colores de partido.
- **Mucha gente**: multitudes con caras y bocadillos, filas de diputados idénticos (disciplina), tríos en un sofá, colas.
- **Objetos-símbolo que actúan**: balanza que se inclina, silla vacía con telaraña, lista con candado, leyes que se apilan, urna, contador tipo cuentakilómetros, sello torcido que golpea, palabra que se tacha en rojo, mano en primer plano que señala desde abajo, móvil con el vídeo como cierre.
- **Fichas de dato**: barrita de color a la izquierda, etiqueta pequeña en versalitas, una línea con el dato, y fecha y fuente. Rótulos de persona del tipo «ELLA ES … · cargo, lugar». Cifras enormes como «19 AÑOS».
- **Gráficos dentro de la escena**: hemiciclo con escaños de colores y marcador con raya del 50 %, barras con línea discontinua, calendario de taco.
- **Cámara**: planos largos con movimiento suave (acercamientos, de un personaje a dos). Escena nueva cada ~4 s y cambio dentro de la escena cada 1–2 s. Sin cortes secos: fundido de ~80 ms justo al empezar la frase.
- **Luz**: halo cálido detrás de lo importante y viñeta. En el papel, halo dorado muy suave o sombra.
- **Subtítulos arriba**, a ~19 % de la altura. Una línea corta de 2–5 palabras que aparece palabra a palabra con un leve desenfoque. Lo ya dicho va en gris y la palabra clave en caja de selección (borde con puntitos en las esquinas). El centro y la parte de abajo quedan para la escena y lejos de los botones de TikTok.
- **Marca pequeña** arriba a la izquierda. En vídeos largos, barra de capítulos arriba.

Sonido: voz mono a unos −18 LUFS, **sin música** (en las pausas hay silencio) y efectos en las apariciones. Las pausas ocupan ~22 % del tiempo: no se pega todo.

Lo que **no** se adopta: logos y colores de partidos, imágenes o voces de personas reales grabadas, su campaña ni sus frases.

**Trucos del kit (26/11/2026):** `Persona`, `Urna`, `Mesa`, `Flecha` y demás piezas SVG van **dentro de `<Lienzo>`** (o de un `<svg>`); fuera no se ven. `Header` admite `serie` y `der` («La Constitución, a prueba» · «1/3») para series que no son del 29N. Las series llevan sus piezas comunes en `src/videos/<serie>/comun.tsx` (con `armaTimeline`) y su `Portada.tsx`.

**26/11/2026 · vídeo 6 de la misma cuenta (66 s, «tablero oscuro»).** Se adopta la forma. Su tema (el reparto del CGPJ) se cruza con la parte 1 de nuestra serie: ni sus frases, ni su orden, ni sus imágenes (escaños azul/rojo, cuerda que se vuelve apretón de manos).

Ritmo:
- **Un cambio visual en casi cada frase** (0,5–1 s): entra un objeto, se colorea, se tacha, sube un contador. Nada quieto más de 2 s.
- **Sin cortes secos y con fondo fijo**: lo que sale se funde en 0,2–0,3 s con algo de desenfoque y lo nuevo entra con *pop* (escala 0,9→1). Parece un único plano continuo.
- Voz muy pegada (pausas de ~0,15 s, ~2,3 palabras/s), base grave y suave todo el rato y efectos: tic del contador, golpe del sello, *whoosh* de la foto.

Recursos:
- **Foto real como prueba.** Al nombrar una institución u objeto concreto (una sede, un hemiciclo, una urna) aparece su foto real en una tarjeta: esquinas redondeadas, borde claro, sombra y banda inferior con el pie en versalitas («SEDE DEL CGPJ · MADRID», «URNA REAL · IMAGEN DE ARCHIVO»). Entra con un destello de 2–3 fotogramas, hace un Ken Burns lento y sale fundida. A veces es un clip corto de vídeo.
- **Recorte con subrayado**: tarjeta de una noticia o documento (medio, fecha, cita en serif) y un rotulador amarillo que pasa por las palabras justo cuando la voz las dice.
- **El tiempo que pasa**: calendario que arranca hojas (vuelan girando) y un contador «X DÍAS SIN…» que corre; cada palabra («Un año. Dos. Tres.») es una hoja.
- **Destello de color** en las palabras negativas: viñeta roja de ~0,25 s. **Sello** que golpea con temblor y destello.
- **Píldoras**: textos cortos bajo el objeto que repiten la clave; la anterior se apaga cuando entra la siguiente.
- **Objetos que vuelven y cambian de estado** para contar el giro: el objeto del gancho reaparece al final; algo pasa de gris a color, o de pelearse a pactar.
- **Fuente mínima**: en los golpes rápidos, una línea pequeña bajo el gráfico («Constitución, art. 122.3»); la ficha grande, para los datos fuertes.
- **Cierre**: móvil con un chat «Tu amigo» y la píldora MÁNDASELO.

Cómo lo hacemos nosotros (sin perder el papel):
- **Fotos reales solo de edificios, lugares, objetos y documentos**: con licencia libre (Wikimedia Commons CC BY / BY-SA o dominio público) y crédito en la tarjeta y en el post, o documentos oficiales (BOE, Diarios de Sesiones; LPI art. 13). **Nunca fotos de personas** (tampoco de políticos), ni fotos de prensa, portadas o capturas de tele con derechos: las personas siguen siendo monigotes con rótulo.
- El espacio de trabajo no puede descargar de internet: las fotos y los PDF del BOE los pasa Ramón (o se bajan en su ordenador, con su permiso). Los PDF se rasterizan con `pdftoppm` y se recortan.
- Piezas en `src/kit/real.tsx`: `FotoReal`, `Recorte` (con `Subrayado`), `Destello`, `Pildora`, `FuenteMini`.
- **Cómo se consiguen (26/11/2026):** ni el espacio de trabajo ni el shell del ordenador de Ramón llegan a boe.es o a Wikimedia, y las descargas del navegador integrado no aparecen en Descargas. Lo que funciona es el **navegador integrado**: PDF del BOE abierto con `#toolbar=0&navpanes=0&zoom=180,28,<top>` (pasando antes por una página HTML para que aplique el zoom) y captura con la acción `zoom` a escala 1, que guarda un PNG nítido a 1:1 en `/tmp/claude-tool-results/…`. Fotos de Commons: la API (`prop=imageinfo&iiprop=url|extmetadata`) da licencia y autor; la miniatura de 960 px se muestra a 766 px de ancho y se captura igual. Créditos en `public/img/<serie>/CREDITOS.md`.
- Con subrayados (`marcas`) la foto va sin Ken Burns (`zoom={[1, 1]}`), o las marcas se descolocan. El sello ya existe (`Sello`), el calendario (`Taco`) y el contador (`Counter`) también.
- Dosis: 2–4 fotos o recortes por vídeo, en los momentos de «esto es real». El resto, nuestro mundo dibujado.
- Base musical: opcional y solo si Ramón la quiere; generada por nosotros (sin derechos) y muy por debajo de la voz.

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
- Vídeo final en **yuv420p, rango normal (tv) y BT.709**, etiquetado, con `+faststart`. El render ya sale así (`render.mjs`). Si un archivo sale en `yuvj420p`/rango completo, convertirlo antes de entregar: algunos móviles y plataformas leen mal el color.
- Comprobado el 25/11/2026: recomprimido a 1,2 Mbps (como en TikTok), el texto de 24–26 px de las fichas se sigue leyendo bien con nuestros colores planos.

## Zonas seguras (Instagram y TikTok)

- Cabecera en y≈138 (desde el 25/11/2026, después de «¿Quién elige al presidente?»; antes 190), lejos de los subtítulos (arriba, en y≈336). Etiquetas de escena en y≈446, fijas, fuera de la cámara. Contenido entre y=480 y y=1340. Fichas de fuente en y≈1372, fijas.
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
| `mundo.tsx`: `FranjaSuperior` (papel bajo cabecera y subtítulos; las etiquetas de escena van por debajo, en y≈522), `Persona`, `Sala`, `Halo`, `Ficha`, `Sello`, `Camara`, `Fundido`, `Pop`, `SubtitulosArriba`, `OutroSol` | Personajes con cara y emociones, escenarios, fichas de fuente, sellos, cámara con fotogramas clave, subtítulos arriba y el cierre con el sol del logo girando |

### Monigotes

- Son **papeles**, no personas: diputado (`corbata`), presidente (`banda`), ciudadana/o, cúpula del partido (`maletin`), votante (`papeleta`). Desde el 25/11/2026 llevan **cara sencilla** (ojos de punto, cejas, boca) para mostrar emociones, pero genérica: nunca parecida a nadie real.
- **Partidos (desde el 25/11/2026, lo pidió Ramón):** se pueden nombrar y reconocer. Ropa y elementos en el color de cada partido, y sus siglas en un recuadro de su color («PP», «PSOE», «VOX», «SUMAR»…). Los logotipos en sí (la gaviota, el puño y la rosa…) **no se ponen**, ni dibujados ni descargados. En su lugar, cuando se habla de un partido o de alguien suyo: las siglas grandes, en negrita y en su color (`Siglas` y `PARTIDOS` en `mundo.tsx`: PP azul, PSOE rojo, VOX verde, SUMAR, SALF…), y la ropa del monigote en ese color.
- **Personas públicas:** figura genérica del papel que ocupa (presidenta, ministro…), con el sexo y el color del partido que corresponden, y un rótulo con nombre y cargo («Isabel Díaz Ayuso · presidenta de la Comunidad de Madrid»). Sin parecido físico ni caricatura: ni rasgos, ni peinado característico, ni gafas o barba que la identifiquen. Solo se le atribuye lo que ha dicho o hecho de verdad.
- **Frases reales:** de políticos, personajes públicos o virales, **textuales y comprobadas**, con ficha de fecha y fuente (medio, Diario de Sesiones, vídeo oficial). Nunca inventadas ni resumidas como si fueran textuales.
- **Equilibrio:** si un vídeo retrata a un partido o a una persona, el criterio es el de siempre (no partidista): se critican reglas y hechos, con la misma vara para todos.
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

1. Muestra de referencia: `muestra_voz_ramon_A.wav` (25/11/2026, la que eligió Ramón), 11 s limpios desde el primer segundo de voz (Chatterbox solo usa los primeros ~10 s). Paso alto a 60 Hz, reducción de ruido suave, puerta suave, +2 dB de graves (estante en 150 Hz), −2 dB de barro en 320 Hz, +2,5 dB de presencia en 3 kHz, +1,5 dB de aire, de-esser y compresión suave, a −16 LUFS. Graves (100–200 Hz) unos 25 dB por encima de la presencia (1,6–3,2 kHz). La primera versión recortaba graves y sonaba fina: no volver a quitárselos. Fuera del repo: la guarda Ramón.
2. Para cada vídeo, Claude le da el texto en bloques de ≤ 280 caracteres, números escritos en letra.
3. Ramón lo genera en la demo de Chatterbox es-es (https://huggingface.co/spaces/ResembleAI/Chatterbox-Multilingual-TTS-es-es) con su muestra y adjunta los audios.
4. Claude: pasa cada bloque por `tools/voz.sh` (paso alto a 70 Hz, +2 dB de cuerpo en graves, algo menos de barro en 320 Hz, presencia en 2–3 kHz, aire, compresión, de-esser, limitador y −14 LUFS; **sin reverb**; mismo equilibrio de graves que la muestra). Si la voz viene de ElevenLabs u otro motor, medir antes: suele venir más brillante y puede sobrar presencia.
   - **ElevenLabs (Eleven v4, clon instantáneo con la muestra A completa, 41 s):** desde el 25/11/2026 Ramón lo prefiere («nada que ver con Chatterbox»). Texto con etiquetas en inglés (`[curious]`, `[serious]`, `[short pause]`…), puntos suspensivos para pausas, MAYÚSCULAS para énfasis, números en letra y «la acción punto com». Idioma: español. Se genera todo de una vez. Si el primer párrafo sale con acento latinoamericano, se regenera solo ese con `[Castilian Spanish accent, from Madrid] Vale, vamos allá.` delante, y Claude corta el calentamiento. **Audio sin tocar** (lo pidió Ramón el 25/11/2026: «que sea como te lo paso»): ni ecualización, ni compresión, ni normalización de la voz. Solo cortes, montaje de párrafos, micro-fundidos de 8 ms en los cortes contra clics e igualar el volumen entre tomas si una suena más alta. Alineación con `silencedetect` y núcleos silábicos. Silencios recortados a 0,30 s como mucho, salvo los de los puntos suspensivos, corta por silencios (`silencedetect`), ajusta `timeline.ts` a las duraciones reales y deja `SFX_GAIN` en ~0,55.
5. Al publicar: etiqueta de IA activada y «Voz generada con IA a partir de la voz de Ramón» en el texto.

## Reglas que no se negocian

- Cada cifra con su fuente abierta; separar hecho, interpretación y posición. Nada «a comprobar» sin verificar.
- **Rigor con todo lo que defiende La Acción: [`LINEA.md`](LINEA.md)** (tesis, método, propuesta, vocabulario y frases, sacados del cuaderno de ideas de Ramón). Cada guion se contrasta con esa hoja antes de escribirlo. Ejemplo de fallo: nunca decir que la gente «elige» a sus diputados. Se vota una **lista cerrada y bloqueada** que pone la dirección de cada partido (LOREG, art. 96.2: el voto es nulo si tachas, añades o cambias el orden de los nombres). Fallo corregido en «¿Quién elige al presidente?» el 25/11/2026. «Madrid elige 38 diputados» es la fórmula legal («diputados a elegir» en el decreto), pero mejor «Madrid reparte 38 escaños».
- No partidista: se critican reglas, no personas ni partidos por ser quienes son.
- Versión seria, nunca la conspiranoica.
- Ninguna voz ni cara de personas reales salvo la de Ramón (y la de Alberto solo con su permiso).
- Nada de música, clips o imágenes con derechos. Ni copiar frases, metáforas o estructura de otras cuentas.
- Semana electoral: sin sondeos los 5 días previos (LOREG 69.7) y nada de campaña el día de reflexión (art. 53).

## Modo transgresor (solo cuando Ramón lo pida)

Más polémica, sin miedo, defendiendo siempre la línea de La Acción y lo que es real.
- **Gancho que choca de frente** con algo que la gente da por hecho, o con lo que dice alguien con poder («Te dicen que… Es falso.»).
- **Nombres y apellidos** de partidos y cargos (siglas en su color, rótulo con el cargo), con **sus frases textuales y su ficha de fuente**: la polémica sale de ponerles delante sus propias palabras y los datos.
- **Posición sin rodeos** en «Qué proponemos» / «Nuestra respuesta», marcada como posición.
- **Lo que no cambia:** cada afirmación verificable y con fuente; nada inventado, ni insultos, ni acusar de delitos sin sentencia, ni llamar a la violencia; la misma vara para todos los partidos; y las reglas electorales (sondeos, jornada de reflexión). Es justo lo que hace que la polémica no se pueda tumbar ni la quite TikTok del «Para ti».

## Actualidad

Ramón quiere estar atento a la actualidad («al mercado») y sacar vídeos de lo que afecte o interese a la gente: buscar la noticia, comprobar los datos en la fuente original y proponer el ángulo de La Acción.

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
