#!/usr/bin/env bash
# Deja el render final listo para subir: audio a -14,3 LUFS con limitador, vídeo sin recodificar.
# Uso: bash tools/final.sh out/<slug>_bruto.mp4 out/<slug>.mp4
set -euo pipefail
in="$1"; out="$2"
M=$(ffmpeg -hide_banner -i "$in" -af ebur128 -f null - 2>&1 | grep -A1 "Integrated loudness" | grep "I:" | awk '{print $2}')
G=$(python3 -c "print(round(-14.3-($M),2))")
echo "medido $M LUFS, ganancia $G dB"
ffmpeg -y -hide_banner -loglevel error -i "$in" -c:v copy \
  -af "volume=${G}dB,alimiter=limit=0.84:attack=5:release=50:level=false" \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$out"
ffmpeg -hide_banner -i "$out" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:"
