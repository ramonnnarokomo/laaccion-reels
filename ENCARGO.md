# Encargar un vídeo (Alberto, Ramón o cualquier asistente)

El entrenamiento está en este repo: `CADENA.md` (pasos), `GUIA.md` (estilo y lecciones) y `LINEA.md` (lo que defiende La Acción). Da igual qué asistente lo use (Claude, ChatGPT/Codex…): lee esto, sigue `CADENA.md` y deja lo aprendido en `GUIA.md`. Así el repo mejora con los vídeos de todos.

## Puesta en marcha (una vez)

1. **GitHub:** cuenta propia. Dos formas:
   - Ramón te añade como colaborador del repo (Settings → Collaborators) y aceptas la invitación del correo.
   - O haces un *fork* del repo y tu asistente trabaja ahí. Para que lo aprendido llegue a `main`, abres un *pull request*.
   Si con la invitación aceptada tu asistente sigue sin poder escribir, la app de GitHub de tu asistente tiene que tener acceso a este repo: te lo pide GitHub al conectarla.
2. **Asistente con terminal y acceso al repo.** El chat normal no basta: hace falta un entorno que clone el repo, instale Node y ejecute comandos. Con el conector de GitHub del chat normal de ChatGPT solo se puede leer: ni renderiza ni hace push.
   - **ChatGPT → Codex (nube):** crear un entorno con este repo.
     - Script de configuración: `bash tools/setup.sh`.
     - Acceso a internet del agente limitado a: `huggingface.co`, `*.hf.space`, `pypi.org`, `files.pythonhosted.org`, `registry.npmjs.org` y las fuentes que haga falta consultar (`boe.es`, `ine.es`, `infoelectoral.interior.gob.es`…).
   - **Claude:** la skill `skill/video-la-accion/SKILL.md` (Ajustes → Capacidades → subir skill) y GitHub conectado.
3. **Voz:** ver abajo. Cuenta gratis de Hugging Face y un token de lectura guardado como secreto del entorno con el nombre `HF_TOKEN`. Lo pones tú; el asistente no lo escribe en ningún archivo.

## Voz

- **Nunca** clonar la voz de alguien sin su permiso (famosos incluidos): es ilegal, TikTok lo tumba y hunde la credibilidad de un medio que va de rigor.
- Voces permitidas:
  - **Ramón**, que da permiso.
  - **Alberto**, si él quiere.
  - Una **voz sintética** que no imite a nadie.
- **La muestra de voz de Ramón no se sube al repo** (es público: cualquiera podría clonarle). Te la pasa Ramón por privado y la adjuntas en la tarea.
- Opciones, de mejor a peor:
  1. **ElevenLabs de Ramón** (la voz de la marca). El asistente entrega `<slug>_voz_elevenlabs.txt`, Ramón lo genera (o se lo pide a su Claude con «solo la voz») y te pasa el mp3.
  2. **Chatterbox en Hugging Face (gratis)** con la muestra de Ramón. Pasos en `CADENA.md` §3b.
  3. **Chatterbox sin muestra** (voz por defecto del modelo). Suena a otra persona: solo si no hay más remedio.

## Entrega fuera del PC de Ramón

Si el asistente no puede mandar archivos al chat:
- Los sube a una rama `entrega/<slug>`, en `entregas/<slug>/` (`<slug>.mp4`, `<slug>_portada.jpg`, `<slug>_texto-del-post.txt`). Se descargan desde GitHub.
- No se fusiona a `main`, para no llenar el repo de vídeos.
- El código del vídeo (`src/videos/<slug>/`, clips de voz, `GUIA.md`) sí va a `main`.

## Plantilla del encargo

```
Hazme un vídeo de La Acción siguiendo ENCARGO.md y CADENA.md del repo
ramonnnarokomo/laaccion-reels, al pie de la letra.

Tema: …
Idea: …
Fundamentos y fuentes que tengo: …
Publicar antes de: …
Voz: [ElevenLabs de Ramón: dame el texto y espero el mp3]
     o [Chatterbox con la muestra de Ramón, adjunta]

Antes de animar, enséñame el guion. Al acabar, apunta lo aprendido en GUIA.md
y haz commit a mi nombre, sin coautores de IA.
```
