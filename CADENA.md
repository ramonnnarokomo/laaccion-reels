# Cadena completa: del encargo al vídeo listo para subir

> **¿No eres Claude en la cuenta de Ramón?** No tienes ni su PC ni su ElevenLabs, y no los necesitas. Para la voz, usa el §3b (Chatterbox) o entrega el texto para ElevenLabs y espera el mp3. Lo demás (guion, animación, render) lo haces tú en tu entorno. Lee antes `ENCARGO.md`.

Esto es lo que hace el asistente (Claude en la cuenta de Ramón, o el de Alberto) cuando le piden «hoy quiero hacer el vídeo X». Si no eres Claude en la cuenta de Ramón, lee antes `ENCARGO.md`: el §3 (ElevenLabs en el PC de Ramón) no te sirve; usa el §3b. Primero lee `GUIA.md` (estilo, retención, kit, lecciones) y `LINEA.md` (lo que defiende La Acción). Esta hoja dice el orden.

## 0. Preparar la sesión (cada chat empieza con un contenedor limpio)

Límites de Ramón que no se tocan: no cambiar las versiones de Java, Node ni Angular de su PC (si hace falta otra, en un entorno aislado y explicándolo); no usar el puerto 4200; no tocar nada que no sea de La Acción; no pagar ningún plan; de Descargas solo los archivos de La Acción.


1. Repo: `ramonnnarokomo/laaccion-reels` (añadirlo a la sesión con acceso de escritura, clonar y trabajar en el clon).
2. `bash tools/setup.sh`: instala dependencias del repo (sin tocar versiones globales) y hace un fotograma de prueba.
3. (Solo Claude en la cuenta de Ramón) Comprobar su PC: `get_device_info` y la pestaña de ElevenLabs en el navegador integrado (`tabs_context`; si no está, abrir `https://elevenlabs.io/app/speech-synthesis/text-to-speech`). Si el PC no responde, la app de Claude está cerrada o el PC apagado: decirlo y seguir con todo lo que no es la voz.

## 1. Encargo

Del mensaje salen: tema, idea, fundamentos, fecha límite de publicación y si es parte de una serie. Si falta algo que cambie el vídeo (la tesis, una fecha que mande), una sola pregunta. Si nadie contesta, la lectura más razonable y se dice arriba del todo.

## 2. Guion

1. Investigar en fuentes primarias (BOE, INE, Interior, sentencias, hemeroteca). Cada cifra con fuente abierta; nada «a comprobar».
2. Contrastar con `LINEA.md` (vocabulario y tesis) y con las reglas de `GUIA.md`.
3. Estructura de la serie que toque; gancho en la primera frase; en los primeros 5 s pasan muchas cosas.
4. Escribir dos textos:
   - `<slug>_voz_elevenlabs.txt`: texto para la voz (ver §3).
   - `SUBS` de `timeline.ts`: una entrada por frase de la voz, con `/` para cortes de línea, `*clave*` y `cifra|lectura` cuando se dice en letra.
5. Guardar guion y fuentes en `src/videos/<slug>/GUION.md`.

## 3. Voz en ElevenLabs (navegador integrado del PC de Ramón)

Voz «Ramón» (clon), modelo Eleven v4, idioma español. Reglas del texto: etiquetas en inglés (`[curious]`, `[serious]`, `[short pause]`, `[storytelling]`…), puntos suspensivos para pausas, MAYÚSCULAS para énfasis, números en letra, «la acción punto com». Empieza siempre por `[Castilian Spanish accent, from Madrid] Vale, vamos allá.` (calentamiento: se corta después).

0. Permiso: el encargo tiene que decir «con voz» / «voz incluida»; si no, preguntar una vez antes de generar.
1. Créditos: leer los «créditos restantes» de la página. Si el texto (en caracteres) no cabe, parar y avisar. **Nunca** comprar, mejorar plan ni tocar ofertas (Ramón no paga más planes).
2. Pegar el texto en el editor (sustituyendo el anterior) y pulsar «Generar discurso». Esperar a que el reproductor tenga duración (`document.querySelector('audio').duration`).
3. Antes de descargar, apuntar la hora del archivo más nuevo de la carpeta Descargas conectada. Pulsar «Descargar audio»; si sale la encuesta «¿Para qué vas a usar este audio?», «Omitir».
4. La descarga llega a Descargas como `<uuid>.tmp` (o `.mp3`): el archivo más nuevo que esa hora y de tamaño estable. **Solo mirar ese archivo**, nada más de Descargas. Traerlo con `device_stage_files` y comprobar con `ffprobe` que es mp3 y que dura lo mismo que el reproductor.
5. Claude no oye el audio. Comprueba lo objetivo (duración, alineación con coste bajo, ninguna frase vacía). El acento y la entonación los juzga una persona: si está presente, se le manda el mp3 y se sigue animando mientras escucha; si alguna frase suena latinoamericana o rara, se regenera solo ese párrafo con la etiqueta de acento delante.
6. Audio **sin procesar** (ni ecualizar, ni comprimir, ni normalizar la voz).

Sin PC o sin sesión en ElevenLabs: se entrega `<slug>_voz_elevenlabs.txt` y se espera el mp3 adjunto en el chat (vale también desde el móvil) o en Drive.

## 3b. Voz gratis: Chatterbox en Hugging Face (para quien no tiene el PC de Ramón)

Solo con la muestra de Ramón (la adjunta quien encarga; **nunca** al repo), la de Alberto si él quiere, o sin muestra. Jamás una voz de alguien que no haya dado permiso.
1. `pip install gradio_client`. Space: `ResembleAI/Chatterbox-Multilingual-TTS-es-es` (si no responde, `ResembleAI/Chatterbox-Multilingual-TTS`). Token en la variable `HF_TOKEN` si existe (más cuota gratis).
2. `Client(space, hf_token=os.environ.get("HF_TOKEN")).view_api()` para ver el nombre del endpoint y sus parámetros (texto, audio de referencia, idioma `es`, exageración, cfg). No dar por hecho los nombres: leerlos.
3. Texto sin etiquetas `[...]`, números en letra, en bloques de ≤ 280 caracteres cortados en final de frase. Un archivo por bloque; si un bloque falla por cuota, esperar y reintentar ese bloque, no todos.
4. Unir los bloques con 0,25 s de silencio y pasar el resultado por `tools/voz.sh` (con Chatterbox sí se procesa; ver `GUIA.md`, «La voz»).
5. Seguir en §4 con ese wav y el texto sin etiquetas.

## 4. Alineación y cortes

```bash
ffmpeg -i voz.mp3 -ac 1 -ar 48000 voz.wav
python3 tools/alinea.py voz.wav <slug>_voz_elevenlabs.txt > alin.txt     # revisar síl/núc
python3 tools/corta.py voz.wav alin.txt '[["01-gancho","Hay dos"],...]' public/voz/<slug>
mv public/voz/<slug>/alineacion.json src/videos/<slug>/
```
`timeline.ts` usa `armaTimeline(ali, IDS, SUBS, holdFin)`: si el número de subtítulos no cuadra con las frases de la voz, falla. Arreglar SUBS, no la voz.

## 5. Animación

- `src/videos/<slug>/`: `timeline.ts`, `Escenas.tsx`, `Reel.tsx`, `Portada.tsx`; registrar `<slug>` y `portada-<slug>` en `src/Root.tsx`.
- Kit: `src/kit/` (mundo, figuras, objetos, real, ui). Piezas SVG siempre dentro de `<Lienzo>` o de un `<svg>`.
- Fotos reales: solo edificios, documentos u objetos con licencia libre (capturas del BOE con el método de `GUIA.md`). Personas públicas solo si Ramón aporta la foto, con fecha, acto y crédito.

## 6. Revisión antes del render completo

1. `COMP=<slug> node render.mjs stills a,b,c` en los momentos con más cosas y en los primeros 5 s; hoja de contacto; mirar solapes, zonas seguras y legibilidad.
2. Cada cifra en pantalla contra su fuente.
3. Un solo render completo si se puede.

## 7. Render y final

```bash
COMP=<slug> node render.mjs video out/<slug>_bruto.mp4    # en segundo plano; esperar en primer plano: si el turno acaba, se corta
bash tools/final.sh out/<slug>_bruto.mp4 out/<slug>.mp4   # -14,3 LUFS
COMP=portada-<slug> node render.mjs stills 0              # → jpg de portada
```
Muestreo de fotogramas del mp4 final (hoja de contacto de ~24) y comprobación de duración.

## 8. Entrega

- `<slug>.mp4`, `<slug>_portada.jpg`, `<slug>_texto-del-post.txt` (texto, fuentes, «Voz generada con IA a partir de la voz de Ramón», hashtags y, aparte, notas para quien sube: fecha límite, etiqueta de IA, subir desde la app).
- Mandarlos al chat. Si hay carpeta de La Acción conectada en el PC, copiarlos también allí. Si el asistente no puede mandar archivos al chat, rama `entrega/<slug>` (ver `ENCARGO.md`).
- Publicar es cosa de Ramón o Alberto. Claude no publica ni entra en las cuentas de La Acción.

## 9. Mejorar siempre

Al acabar cada vídeo:
1. Lo aprendido (fallos de maquetación, lo que pidieron cambiar, lo que funcionó en visitas) se añade a `GUIA.md` (en «Lecciones de vídeos virales» o en la sección que toque), en una línea con fecha.
2. Commit y push a nombre de quien hizo el encargo, **sin líneas de coautoría de la IA** (ni Co-Authored-By ni Claude-Session ni equivalentes). Para Ramón:
   `git -c user.name="Ramón Ángel Nnar Okomo" -c user.email="ramonnnarokomo@users.noreply.github.com" commit -m "…"`
   Si dos personas tocan el repo a la vez: `git pull --rebase` antes de empujar.
3. Si cambia el procedimiento, se cambia esta hoja; la skill solo apunta aquí.
