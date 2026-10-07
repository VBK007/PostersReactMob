import React from 'react';
import { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';

/* Every motif draws inside a 100x100 box. Placement, scale and rotation are the
   caller's job (see Deco), so one spec renders identically on a thumbnail and a
   full canvas. */

export const PETAL_SETS = {
  rose:  ['#F6B8C8', '#FAD3DD', '#EE9CB4', '#8A5F3C'],
  cream: ['#FBE7D2', '#FDF3E6', '#F5D5B0', '#9A7B4F'],
  lilac: ['#D9CDF0', '#EAE2F8', '#C3B2E6', '#6F5E9A'],
  mint:  ['#CBE7D8', '#E4F3EC', '#AED6C2', '#5E8A73'],
};

export function Bloom({ petals = 9, hue = 'rose', o = 1 }) {
  const [c1, c2, c3, core] = PETAL_SETS[hue] || PETAL_SETS.rose;
  return (
    <G opacity={o}>
      {Array.from({ length: petals }).map((_, i) => (
        <Ellipse key={i} cx={50} cy={24} rx={13} ry={25}
          fill={[c1, c2, c3][i % 3]} origin="50,50" rotation={(i / petals) * 360} />
      ))}
      <Circle cx={50} cy={50} r={10} fill={core} opacity={0.9} />
    </G>
  );
}

export function Sprig({ c = '#9DBBA4', o = 0.85 }) {
  return (
    <G opacity={o}>
      <Path d="M8 92C30 74 48 48 58 14" stroke={c} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map(i => {
        const t = 0.12 + i * 0.18;
        const cx = 8 + t * 50;
        const cy = 92 - t * 78;
        return <Ellipse key={i} cx={cx} cy={cy} rx={13} ry={6.5} fill={c} opacity={0.75}
          rotation={-38 - i * 4} origin={`${cx},${cy}`} />;
      })}
    </G>
  );
}

/* Four wing lobes mirrored about x=50, plus antennae. */
const WING_UP = 'M50 52C44 26 24 12 14 20 4 28 10 50 24 57c9 4 20 2 26-5z';
const WING_LO = 'M50 54c-5 20-20 32-28 27-8-5-5-20 6-26 7-4 16-4 22-1z';

export function Butterfly({ c1 = '#F4AEC2', c2 = '#FBD9E3', o = 0.95 }) {
  return (
    <G opacity={o}>
      <Path d={WING_UP} fill={c1} />
      <Path d={WING_UP} fill={c1} transform="translate(100,0) scale(-1,1)" />
      <Path d={WING_LO} fill={c2} />
      <Path d={WING_LO} fill={c2} transform="translate(100,0) scale(-1,1)" />
      <Path d="M50 50c-6 6-12 5-16 2M50 50c6 6 12 5 16 2" stroke="#fff" strokeWidth={1.8} fill="none" opacity={0.8} />
      <Path d="M50 46c-3-8-8-12-13-13M50 46c3-8 8-12 13-13" stroke={c1} strokeWidth={2} fill="none" strokeLinecap="round" />
    </G>
  );
}

export function Flourish({ c = '#E4A0B8', o = 0.9 }) {
  return (
    <G opacity={o}>
      <Path d="M2 62C22 26 58 20 78 40c8 8 8 20 0 24-7 4-15-2-13-10 2-7 11-9 17-4"
        stroke={c} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <Path d="M2 70C26 42 56 38 74 54" stroke={c} strokeWidth={1.5} fill="none" opacity={0.7} strokeLinecap="round" />
      <Circle cx={92} cy={50} r={3.4} fill={c} />
    </G>
  );
}

/* The linked-infinity crest that anchors the centre of a photo template. */
export function Crest({ o = 1 }) {
  return (
    <G opacity={o}>
      <Defs>
        <LinearGradient id="crestG" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#E8C9A0" />
          <Stop offset="0.5" stopColor="#D79C86" />
          <Stop offset="1" stopColor="#C98C74" />
        </LinearGradient>
      </Defs>
      <Path d="M18 50c0-10 8-16 15-11 7 5 10 11 17 11s10-6 17-11c7-5 15 1 15 11s-8 16-15 11c-7-5-10-11-17-11s-10 6-17 11c-7 5-15-1-15-11z"
        stroke="url(#crestG)" strokeWidth={8} fill="none" strokeLinecap="round" />
      <G transform="translate(36,30) scale(0.28)"><Bloom petals={7} hue="cream" o={0.95} /></G>
      <G transform="translate(48,44) scale(0.22)"><Bloom petals={7} hue="cream" o={0.9} /></G>
      <G transform="translate(28,46) scale(0.18)"><Bloom petals={6} hue="mint" o={0.85} /></G>
      <G transform="translate(58,26) scale(0.16)"><Bloom petals={6} hue="cream" o={0.85} /></G>
    </G>
  );
}

export const MOTIFS = { bloom: Bloom, sprig: Sprig, butterfly: Butterfly, flourish: Flourish, crest: Crest };
