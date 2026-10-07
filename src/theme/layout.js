import { Dimensions } from 'react-native';

export const W = Dimensions.get('window').width;

/* Element positions are percentages of the canvas, so the same element list
   renders on a thumbnail, the editor and the preview. The bundled templates are
   5:7; a template from the server carries its own aspect (canvasHeight /
   canvasWidth, 1080x1350 by default). */
export const DEFAULT_ASPECT = 1.4;
export const CANVAS_W = Math.min(W - 80, 300);
export const CANVAS_H = CANVAS_W * DEFAULT_ASPECT;

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const uid = () => Math.random().toString(36).slice(2, 8);

/* Per-type size bounds and step for the selection bar: [min, max, step]. */
export const SIZE_LIMITS = { text: [8, 48, 2], sticker: [16, 160, 6], photo: [40, 260, 10] };
