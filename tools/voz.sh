#!/usr/bin/env bash
# Cadena de voz "micro de radio" para los audios de Chatterbox (24 kHz, algo oscuros).
# Uso: tools/voz.sh entrada.wav salida.wav
# 1) limpia (paso alto)  2) ecualiza (quita barro, da presencia y aire)
# 3) comprime  4) controla las eses  5) brillo suave  6) limita y normaliza a -14 LUFS
# Sin reverb: en voz en off hablada suena a habitación y aleja la voz.
set -euo pipefail
in="$1"; out="$2"
chain="aresample=48000:resampler=soxr,\
highpass=f=85,highpass=f=85,\
equalizer=f=170:width_type=o:width=1.2:g=-3,\
equalizer=f=300:width_type=o:width=1.2:g=-4,\
equalizer=f=1800:width_type=o:width=1:g=1.5,\
equalizer=f=3200:width_type=o:width=1.4:g=4,\
highshelf=f=7000:g=4,\
acompressor=threshold=-22dB:ratio=3.5:attack=8:release=120:knee=4:makeup=3,\
deesser=i=0.35:m=0.5:f=0.5,\
aexciter=amount=0.6:drive=5:blend=0:freq=6000:ceil=16000,\
alimiter=limit=0.89:level=false,\
loudnorm=I=-14:TP=-1.5:LRA=7"
ffmpeg -loglevel error -y -i "$in" -af "$chain" -ar 48000 -ac 1 "$out"
