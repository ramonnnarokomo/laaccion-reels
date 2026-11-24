import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Colores de la web de LA ACCIÓN
export const C = {
  tinta: '#20201E',
  papel: '#FAF7F1',
  burdeos: '#792F36',
  dorado: '#A58C61',
  piedra: '#6B6B61',
  tarjeta: '#F2ECE1',
};

export const SERIF = 'Gelasio, Georgia, serif';
export const SANS = 'Inter, system-ui, sans-serif';

// Volumen general de los efectos (bajarlo cuando entre la voz)
export const SFX_GAIN = 1;

export const loadBrandFonts = () =>
  Promise.all([
    loadFont({family: 'Gelasio', url: staticFile('fonts/Gelasio-VF.ttf'), weight: '400 700'}),
    loadFont({family: 'Gelasio', url: staticFile('fonts/Gelasio-Italic-VF.ttf'), weight: '400 700', style: 'italic'}),
    loadFont({family: 'Inter', url: staticFile('fonts/Inter-Regular.otf'), weight: '400'}),
    loadFont({family: 'Inter', url: staticFile('fonts/Inter-Medium.otf'), weight: '500'}),
    loadFont({family: 'Inter', url: staticFile('fonts/Inter-SemiBold.otf'), weight: '600'}),
    loadFont({family: 'Inter', url: staticFile('fonts/Inter-Bold.otf'), weight: '700'}),
  ]);

export const miles = (n: number) => Math.round(n).toLocaleString('es-ES', {useGrouping: true});
