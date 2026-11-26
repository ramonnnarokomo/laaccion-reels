#!/usr/bin/env bash
# Prepara una sesión nueva (contenedor limpio) para montar vídeos de La Acción.
# Uso: bash tools/setup.sh   (desde la raíz del repo)
# No toca versiones globales de Node/Java/Angular: todo queda en node_modules y en el usuario de pip.
set -euo pipefail
if ! command -v ffmpeg >/dev/null; then
  (apt-get update -qq && apt-get install -y -qq ffmpeg) 2>/dev/null || (sudo apt-get update -qq && sudo apt-get install -y -qq ffmpeg) 2>/dev/null || {
    pip install -q --break-system-packages imageio-ffmpeg && mkdir -p ~/.local/bin && ln -sf "$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')" ~/.local/bin/ffmpeg && export PATH=~/.local/bin:$PATH
  }
fi
command -v ffmpeg >/dev/null || { echo "Falta ffmpeg y no he podido instalarlo"; exit 1; }
node -v
[ -d node_modules/remotion ] || npm ci --no-audit --no-fund
python3 -c "import numpy, scipy, PIL" 2>/dev/null || pip install -q --break-system-packages numpy scipy pillow
# Primer render de prueba: Remotion descarga su Chrome headless la primera vez.
COMP=demo-real node render.mjs stills 0 >/dev/null && echo "setup ok (still de prueba en out/stills/f0000.png)"
