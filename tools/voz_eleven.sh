#!/usr/bin/env bash
# Cadena LIGERA para voces de ElevenLabs (ya vienen limpias, sin ruido ni sala y con presencia).
# Solo da algo de cuerpo, quita una pizca de "caja", comprime suave y deja -14 LUFS (dos pasadas, lineal).
# Uso: tools/voz_eleven.sh entrada.(mp3|wav) salida.wav
set -euo pipefail
in="$1"; out="$2"; tmp="$(mktemp --suffix=.wav)"
ffmpeg -loglevel error -y -i "$in" -af "aresample=48000:resampler=soxr,highpass=f=60,lowshelf=f=160:g=4.5,equalizer=f=320:width_type=o:width=1:g=-1.5,acompressor=threshold=-20dB:ratio=2:attack=10:release=150:knee=4:makeup=1,deesser=i=0.25:m=0.5:f=0.5" -ac 1 -c:a pcm_f32le "$tmp"
read MI MTP MLRA MTH OFF < <(ffmpeg -i "$tmp" -af loudnorm=I=-13.6:TP=-1.5:LRA=7:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
ffmpeg -loglevel error -y -i "$tmp" -af "loudnorm=I=-13.6:TP=-1.5:LRA=7:measured_I=$MI:measured_TP=$MTP:measured_LRA=$MLRA:measured_thresh=$MTH:offset=$OFF:linear=true,alimiter=limit=0.84:level=false" -ar 48000 -ac 1 -c:a pcm_s24le "$out"
rm -f "$tmp"
