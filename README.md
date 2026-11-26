# laaccion-reels

Plantilla y kit para los reels y TikToks de LA ACCIÓN (laaccion.com), hechos con código (Remotion) y renderizados a MP4.

Lee `CADENA.md` (del encargo al vídeo, paso a paso), `GUIA.md` (estilo, kit, efectos, voz, reglas y revisión) y `LINEA.md` (lo que defiende La Acción).

- `tools/` — `setup.sh` (sesión nueva), `alinea.py` y `corta.py` (voz → clips por escena), `final.sh` (audio a −14,3 LUFS), `sfx.py`, `voz.sh`.

- `src/kit/` — piezas comunes (papel, cabecera, etiquetas, subtítulos, monigotes, efectos).
- `src/videos/<slug>/` — un vídeo por carpeta, registrado en `src/Root.tsx`.
- `public/` — tipografías (OFL), logo, grano de papel y efectos de sonido propios.
- `datos/` — datos y cálculos que respaldan cada vídeo.

Licencias: Gelasio e Inter con licencia SIL Open Font License; Remotion con su licencia gratuita (equipos de hasta 3 personas o entidades sin ánimo de lucro).
