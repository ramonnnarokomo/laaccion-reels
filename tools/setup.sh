#!/usr/bin/env bash
# Prepara una sesión nueva (contenedor limpio) para montar vídeos de La Acción.
# Uso: bash tools/setup.sh   (desde la raíz del repo)
# No toca versiones globales de Node/Java/Angular: todo queda en node_modules y en el usuario de pip.
set -euo pipefail
command -v ffmpeg >/dev/null || { echo "Falta ffmpeg"; exit 1; }
node -v
[ -d node_modules/remotion ] || npm ci --no-audit --no-fund
python3 -c "import numpy, scipy, PIL" 2>/dev/null || pip install -q --break-system-packages numpy scipy pillow
# Primer render de prueba: Remotion descarga su Chrome headless la primera vez.
COMP=demo-real node render.mjs stills 0 >/dev/null && echo "setup ok (still de prueba en out/stills/f0000.png)"
