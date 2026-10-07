/* Palette. Pastel grounds, a single ink, two metallics. */

export const C = {
  cream: '#FFFBF6', shell: '#F4F0EA', ink: '#2B2733', muted: '#8A8394', faint: '#A8A2AE',
  line: 'rgba(43,39,51,0.07)', surface: '#FFFFFF', chip: '#F2EEE8', chip2: '#F5F1EB',
  blush: '#F6E3E0', lilac: '#E3DCF2', sage: '#D6E4D8', peach: '#FBE3D1',
  sky: '#DCE9F5', ivory: '#FBF3E4', mauve: '#F3E7F0', mint: '#D9EFE6',
  gold: '#C2A15B', rose: '#A8746B', dusk: '#231F2A',
};

export const INKS = ['#2B2733', '#7A4B45', '#C2A15B', '#5D4B86', '#3F6047', '#FFFBF6'];

export const GROUNDS = [C.blush, C.lilac, C.sage, C.peach, C.sky, C.ivory];

export const THEMES = [
  { id: 'blush', name: 'Blush', c: C.blush },
  { id: 'lilac', name: 'Lilac', c: C.lilac },
  { id: 'sage', name: 'Sage', c: C.sage },
  { id: 'ivory', name: 'Ivory', c: C.ivory },
];
