import React from 'react';
import { View } from 'react-native';
import Svg from 'react-native-svg';
import { MOTIFS } from './motifs';

/* A decorative placement: { m: motif id, x, y (centre, % of canvas),
   s (size, % of canvas width), r (degrees), p (props for the motif) }. */
export function Deco({ spec, w, h }) {
  const M = MOTIFS[spec.m];
  if (!M) return null;
  const size = (spec.s / 100) * w;
  return (
    <View pointerEvents="none" style={{
      position: 'absolute',
      left: (spec.x / 100) * w - size / 2,
      top: (spec.y / 100) * h - size / 2,
      width: size, height: size,
      transform: [{ rotate: `${spec.r || 0}deg` }],
    }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <M {...(spec.p || {})} />
      </Svg>
    </View>
  );
}

export function DecoLayer({ deco, w, h }) {
  if (!deco || !deco.length) return null;
  return deco.map((spec, i) => <Deco key={i} spec={spec} w={w} h={h} />);
}

/* A corner bouquet: blooms, buds and foliage sharing one anchor.
   `flip` is 1 for a left-hand corner, -1 for a right-hand one. */
export const bouquet = (x, y, s, flip = 1, hue = 'rose') => [
  { m: 'sprig', x: x + flip * 15, y: y + 11, s: s * 0.95, r: flip > 0 ? 8 : 82, p: { c: '#A9C3AF' } },
  { m: 'sprig', x: x + flip * 3,  y: y + 18, s: s * 0.75, r: flip > 0 ? 46 : 44, p: { c: '#8FAE97', o: 0.7 } },
  { m: 'bloom', x, y, s: s * 0.5, p: { hue, petals: 11 } },
  { m: 'bloom', x: x + flip * 14, y: y + 4,  s: s * 0.34, p: { hue, petals: 9 } },
  { m: 'bloom', x: x + flip * 4,  y: y + 14, s: s * 0.28, p: { hue, petals: 8, o: 0.95 } },
  { m: 'bloom', x: x + flip * 19, y: y - 6,  s: s * 0.2,  p: { hue: 'cream', petals: 7 } },
  { m: 'bloom', x: x - flip * 7,  y: y + 9,  s: s * 0.18, p: { hue, petals: 7, o: 0.9 } },
];

/* A vertical column of butterflies, as on the reference invitation. */
export const butterflies = (x, ys, s) =>
  ys.map((y, i) => ({ m: 'butterfly', x, y, s: s * (i === 1 ? 1 : 0.88), r: i % 2 ? -8 : 6 }));
