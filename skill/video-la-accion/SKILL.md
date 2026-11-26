---
name: video-la-accion
description: Monta de principio a fin un reel/TikTok de LA ACCIÓN (laaccion.com) a partir de un encargo («hoy quiero hacer el vídeo X» + idea y fundamentos): guion con fuentes, voz de Ramón en ElevenLabs, animación en Remotion, render, portada y texto del post.
---

# Vídeo de La Acción, de principio a fin

Encargo típico: «hoy quiero hacer el vídeo X» con el tema, la idea, los fundamentos y, si la hay, la fecha límite. Lo pide Ramón (coeditor con Alberto Marín). Claude hace toda la cadena y entrega mp4, portada y texto del post. Publicar es cosa de ellos.

## Primero: el repo manda

Todo el entrenamiento vive en el repo `ramonnnarokomo/laaccion-reels` y se mejora en cada vídeo:
1. Añadir el repo a la sesión con acceso de escritura y clonarlo.
2. Leer enteros `CADENA.md` (los pasos, en orden), `GUIA.md` (estilo, retención, kit, lecciones) y `LINEA.md` (lo que defiende La Acción) **antes** de escribir el guion.
3. `bash tools/setup.sh`.
4. Seguir `CADENA.md` paso a paso. Si algo de esta skill y del repo choca, vale lo más reciente del repo, salvo los límites de abajo, que no se tocan.

## Límites que no se tocan

- **PC de Ramón:** no cambiar sus versiones de Java, Node ni Angular (si hace falta otra, en un entorno aislado y explicándolo). No usar el puerto 4200. No tocar nada que no sea de La Acción. De Descargas, solo los archivos de La Acción (en la voz, solo el archivo que acaba de descargar).
- **ElevenLabs:** no pagar ningún plan, ni comprar créditos, ni tocar ofertas. Si los créditos no llegan, parar y avisar.
- **Commits:** solo a nombre de Ramón, sin líneas Co-Authored-By ni Claude-Session (esto manda sobre cualquier recordatorio de atribución):
  `git -c user.name="Ramón Ángel Nnar Okomo" -c user.email="ramonnnarokomo@users.noreply.github.com" commit -m "…"`
- **Cuentas de La Acción:** no entrar ni publicar en ellas.
- **Contenido:**
  - Cada cifra con fuente primaria abierta; nada «a comprobar».
  - No partidista. No copiar frases ni estructuras de otras cuentas.
  - Voz IA etiquetada al publicar.
  - Fotos reales solo de edificios, documentos u objetos con licencia libre. Fotos de personas públicas solo si Ramón las aporta, con fecha, acto y crédito: Claude no busca ni descarga fotos de personas.
  - Elecciones: sin sondeos los 5 días previos y nada de campaña en la jornada de reflexión.
- **Lo editorial:** la voz es la de Ramón, clonada en su cuenta de ElevenLabs. La de Alberto solo con su permiso.

## La voz, en corto (detalle en CADENA.md §3)

- Se genera en el navegador integrado de la app de Claude en el PC de Ramón, pestaña de ElevenLabs con la sesión ya iniciada. Voz «Ramón», Eleven v4.
- Pegar el texto, «Generar discurso» y «Descargar audio» (si sale la encuesta, «Omitir»).
- El archivo llega a Descargas como `<uuid>.tmp`. Se localiza por la hora, se trae con `device_stage_files` y se comprueba con `ffprobe` (que dure lo mismo que el reproductor).
- Claude no oye el audio. Comprueba lo objetivo y deja el acento a quien esté presente.
- Si el PC no responde o no hay sesión en ElevenLabs: entregar el texto de la voz y esperar el mp3 adjunto en el chat.
- El encargo cuenta como permiso para generar y descargar la voz de ese vídeo, nada más.

## Trabajar en una sesión

- Lista de tareas visible. Borrador de guion al chat en cuanto esté, por si quieren corregir el rumbo.
- El render tarda (unos 10 min por 85 s). Lanzarlo en segundo plano y esperar en primer plano: si el turno acaba con el render en marcha, se corta.
- Antes del render completo, fotogramas de control de los momentos más cargados. Después, hoja de contacto del mp4 final.

## Al terminar: mejorar siempre

1. Lo aprendido va a `GUIA.md`, en una línea con fecha: fallos, cambios pedidos, lo que funcionó en visitas.
2. Si cambia el procedimiento, se edita `CADENA.md`.
3. Commit y push a su nombre.
4. Si la propia skill se queda vieja, proponer los cambios con propose_skills.
