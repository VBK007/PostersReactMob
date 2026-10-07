import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { C } from '../theme/colors';

export const P = {
  home: 'M4 11l8-6.5 8 6.5v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-8z',
  search: 'M18 18l-4-4M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z',
  back: 'M15 5l-7 7 7 7',
  chevron: 'M9 5l7 7-7 7',
  text: 'M6 6h12M12 6v13',
  font: 'M5 19l5.5-14h3L19 19M8 14h8',
  star: 'M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.4l6-.8z',
  upload: 'M12 16V5M8 9l4-4 4 4M4.5 15v3.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V15',
  save: 'M6 19V6.5A1.5 1.5 0 0 1 7.5 5h7L19 9.3V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zM9 20v-6h6v6',
  share: 'M9.2 10.9l5.6-3.4M9.2 13.1l5.6 3.4',
  /* Two interlocking bands with a stone over the left one. Drawn as full
     circles (two arcs each) so the shape fills the 24-box like heart and star
     do — the old path was a 4x2.6 triangle floating at the top. */
  rings: 'M4 13.2a5.2 5.2 0 1 0 10.4 0 5.2 5.2 0 1 0-10.4 0'
       + 'M9.6 13.2a5.2 5.2 0 1 0 10.4 0 5.2 5.2 0 1 0-10.4 0'
       + 'M9.2 4.6l1.7 2.1-1.7 2-1.7-2z',
  /* Body, knot and string — the old path stopped at the body, which read as a
     blob rather than a balloon. */
  balloon: 'M12 3.2c2.9 0 5.2 2.4 5.2 5.4 0 3.6-3.1 6.8-5.2 7.9-2.1-1.1-5.2-4.3-5.2-7.9 0-3 2.3-5.4 5.2-5.4z'
         + 'M12 16.5l-1 1.6h2z'
         + 'M12 18.1c0 1.6 1.5 1.9 1.5 3.4',
  heart: 'M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z',
  grid: 'M4 4h7v9H4zM13 4h7v5h-7zM4 15h7v5H4zM13 11h7v9h-7z',
  doc: 'M5 3.5h14v17H5zM9 8h6M9 12h6M9 16h3',
  person: 'M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4',
  details: 'M4 6h16M4 12h16M4 18h10',
};

/* Small glyphs a poster element can carry inline before its text. */
export const LINE_ICONS = {
  cal: 'M4.5 6.5h15v13h-15zM4.5 10h15M8.5 4v3M15.5 4v3',
  clock: 'M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM12 8v4.3l3 1.8',
  pin: 'M12 21s6.5-6.1 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 14.9 12 21 12 21zM12 8.4a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z',
};

export const Icon = ({ d, size = 20, color = C.ink, w = 1.6, fill = 'none' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d={d} stroke={fill === 'none' ? color : 'none'} fill={fill === 'none' ? 'none' : color}
      strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
