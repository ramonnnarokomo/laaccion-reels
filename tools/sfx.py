"""Efectos de sonido de LA ACCIÓN, sintetizados (propios, sin licencias de terceros).

Uso: python3 -I tools/sfx.py public/sfx
"""
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
rng = np.random.default_rng(29)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.005, r=0.2, curve=4.0):
    """Ataque lineal y caída exponencial."""
    x = np.arange(n) / SR
    att = np.clip(x / max(a, 1e-4), 0, 1)
    dec = np.exp(-curve * np.clip(x - a, 0, None) / max(r, 1e-4))
    return att * dec


def bp(x, lo, hi, order=2):
    sos = butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return sosfilt(sos, x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def sweep_filter(noise, f0, f1, q=1.2, steps=48):
    """Ruido filtrado con una banda que se desplaza de f0 a f1 (para los whoosh)."""
    out = np.zeros_like(noise)
    seg = len(noise) // steps
    for i in range(steps):
        f = f0 * (f1 / f0) ** (i / (steps - 1))
        lo, hi = f / (1 + 1 / q), f * (1 + 1 / q)
        a, b = i * seg, (i + 1) * seg if i < steps - 1 else len(noise)
        pad = 2048
        s0 = max(0, a - pad)
        y = bp(noise[s0:b], max(30, lo), min(SR / 2 - 100, hi))
        out[a:b] = y[a - s0:]
    return out


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def fade(x, ms=4):
    n = int(SR * ms / 1000)
    x = x.copy()
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x


def save(folder, name, x, peak=0.9):
    y = fade(norm(x, peak))
    wavfile.write(folder / f"{name}.wav", SR, (y * 32767).astype(np.int16))


def whoosh(d=0.5, f0=300, f1=3200, peak=0.7):
    n = rng.standard_normal(int(SR * d))
    y = sweep_filter(n, f0, f1)
    x = np.linspace(0, 1, len(y))
    shape = np.sin(np.pi * x) ** 1.6
    return y * shape, peak


def thump():
    tt = t(0.22)
    f = 95 * np.exp(-tt * 9) + 45
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, 0.12, 3.5)
    click = hp(rng.standard_normal(len(tt)), 1500) * env(len(tt), 0.0005, 0.012, 5)
    return body + 0.25 * click


def clunk():
    """Golpe de la balanza: grave con cuerpo, transitorio y un poco de metal."""
    tt = t(1.1)
    f = 70 * np.exp(-tt * 6) + 42
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, 0.45, 3.2)
    trans = lp(rng.standard_normal(len(tt)), 2500) * env(len(tt), 0.0005, 0.04, 5)
    metal = sum(np.sin(2 * np.pi * fr * tt + ph) * a for fr, a, ph in
                [(523, .30, 0), (1187, .18, 1), (1873, .12, 2), (2741, .07, 3)])
    metal *= env(len(tt), 0.001, 0.6, 5)
    return body + 0.5 * trans + 0.22 * metal


def clack():
    """Sobre que cae en el platillo."""
    tt = t(0.35)
    hit = bp(rng.standard_normal(len(tt)), 1200, 6000) * env(len(tt), 0.0005, 0.03, 5)
    ring = sum(np.sin(2 * np.pi * fr * tt) * a for fr, a in [(880, .3), (1960, .2), (3120, .1)])
    ring *= env(len(tt), 0.001, 0.25, 6)
    paper = bp(rng.standard_normal(len(tt)), 400, 2500) * env(len(tt), 0.002, 0.08, 4)
    return hit + 0.35 * ring + 0.4 * paper


def pop():
    tt = t(0.12)
    f = 900 * np.exp(-tt * 30) + 280
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.001, 0.05, 4)


def tick():
    tt = t(0.04)
    x = bp(rng.standard_normal(len(tt)), 2500, 7000) * env(len(tt), 0.0003, 0.006, 5)
    x += 0.5 * np.sin(2 * np.pi * 1800 * tt) * env(len(tt), 0.0003, 0.01, 5)
    return x


def key():
    """Tecla de máquina de escribir."""
    tt = t(0.09)
    clack_ = bp(rng.standard_normal(len(tt)), 1500, 5000) * env(len(tt), 0.0003, 0.012, 5)
    thock = np.sin(2 * np.pi * 180 * tt) * env(len(tt), 0.001, 0.03, 4)
    return clack_ + 0.6 * thock


def ding():
    tt = t(1.6)
    base = 1318.5
    x = sum(np.sin(2 * np.pi * base * r * tt) * a * np.exp(-tt * d) for r, a, d in
            [(1, 1, 2.2), (2.0, .35, 3.5), (2.76, .25, 4.5), (5.4, .12, 7), (8.93, .05, 9)])
    return x * env(len(tt), 0.002, 10, 0.1)


def stamp():
    tt = t(0.4)
    f = 120 * np.exp(-tt * 20) + 55
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.001, 0.1, 4)
    slap = bp(rng.standard_normal(len(tt)), 300, 4000) * env(len(tt), 0.0005, 0.03, 5)
    return body + 0.7 * slap


def shimmer():
    """Brillo ascendente para los 102 escaños fijos."""
    d = 1.4
    out = np.zeros(int(SR * d))
    notes = [1046.5, 1318.5, 1568, 2093, 2637, 3136]
    for i, fr in enumerate(notes * 2):
        start = int(SR * i * 0.08)
        tt = t(0.6)
        s = np.sin(2 * np.pi * fr * tt) * env(len(tt), 0.003, 0.25, 4) * (0.6 if i >= 6 else 1)
        end = min(len(out), start + len(s))
        out[start:end] += s[: end - start]
    return out


def paper():
    n = rng.standard_normal(int(SR * 0.45))
    y = sweep_filter(n, 2500, 900, q=0.9)
    x = np.linspace(0, 1, len(y))
    return y * np.sin(np.pi * x) ** 0.8 * (1 + 0.5 * np.sin(2 * np.pi * 23 * x))


def riser():
    d = 0.8
    n = rng.standard_normal(int(SR * d))
    y = sweep_filter(n, 300, 5000, q=2)
    tt = t(d)
    tone = np.sin(2 * np.pi * np.cumsum(200 + 600 * (tt / d) ** 2) / SR) * 0.25
    x = np.linspace(0, 1, len(y))
    return (y + tone) * x ** 1.5


def main(folder):
    folder = Path(folder)
    folder.mkdir(parents=True, exist_ok=True)
    w, p = whoosh()
    save(folder, "whoosh", w, p)
    w, p = whoosh(0.35, 600, 2600, 0.45)
    save(folder, "whoosh_soft", w, 0.45)
    w, p = whoosh(0.6, 2500, 250, 0.7)
    save(folder, "drop", w, 0.6)
    save(folder, "thump", thump(), 0.8)
    save(folder, "clunk", clunk(), 0.95)
    save(folder, "clack", clack(), 0.6)
    save(folder, "pop", pop(), 0.5)
    save(folder, "tick", tick(), 0.35)
    save(folder, "key", key(), 0.45)
    save(folder, "ding", ding(), 0.5)
    save(folder, "stamp", stamp(), 0.75)
    save(folder, "shimmer", shimmer(), 0.4)
    save(folder, "paper", paper(), 0.5)
    save(folder, "riser", riser(), 0.5)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "public/sfx")
