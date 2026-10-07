import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { bouquet, butterflies } from '../components/deco/Deco';

/* A template describes a poster: its ground, its palette, and optionally a
   `deco` list (decorative motifs) and an `els` list (the seeded layers).
   Templates without `els` get the three-line default from defaultEls(). */

const PLAIN = [
  { id: 't1', name: 'Eternal Vows',     cat: 'Marriage',    bg: C.blush, ink: '#7A4B45', accent: C.gold,    kicker: 'Together with their families', title: 'Aarav & Isha',       sub: '14 . 12 . 2026',    font: F.serif },
  { id: 't2', name: 'Golden Union',     cat: 'Marriage',    bg: C.ivory, ink: '#8A6B2E', accent: C.gold,    kicker: 'The wedding of',               title: 'Rhea & Kabir',       sub: 'Sunday, 8th March', font: F.playfair },
  { id: 't3', name: 'Sweet Seven',      cat: 'Birthday',    bg: C.lilac, ink: '#5D4B86', accent: '#8C79C4', kicker: 'You are invited to',           title: 'Mira turns 7',       sub: 'Saturday · 4 pm',   font: F.script },
  { id: 't4', name: 'Confetti Day',     cat: 'Birthday',    bg: C.mint,  ink: '#3F6B5B', accent: '#6FA98F', kicker: 'Party time',                   title: 'Happy Birthday',     sub: 'Arjun is 30',       font: F.uiMed },
  { id: 't5', name: 'Ten Golden Years', cat: 'Anniversary', bg: C.sage,  ink: '#3F6047', accent: '#7C9B7F', kicker: 'Celebrating',                  title: '10 Years',           sub: 'Nikhil & Sara',     font: F.serif },
  { id: 't6', name: 'Silver Bells',     cat: 'Anniversary', bg: C.sky,   ink: '#3C5878', accent: '#7A9CC0', kicker: 'Twenty five years of',         title: 'Love & Laughter',    sub: 'Dinner at seven',   font: F.playfair },
  { id: 't7', name: 'Little One',       cat: 'Baby Shower', bg: C.peach, ink: '#8A5B33', accent: '#D09A63', kicker: 'A baby is on the way',         title: 'Oh Baby',            sub: 'Shower · 22 June',  font: F.script },
  { id: 't8', name: 'Hello Baby',       cat: 'Baby Shower', bg: C.mauve, ink: '#77497A', accent: '#B183B4', kicker: 'Please join us for',           title: 'Hello, Little Star', sub: 'Brunch at eleven',  font: F.serif },
];

/* Floral reception poster: photo ground under a scrim, bouquets in opposing
   corners, butterfly columns down the sides and an infinity crest at centre.
   The bouquets hug the corners rather than reaching into the page — the kicker
   sits at y=12.5 and the address at y=87.5, and anything drawn further in
   lands on top of the words. */
const RECEPTION_DECO = [
  ...bouquet(6, 2, 32, 1, 'rose'),
  ...bouquet(95, 98, 32, -1, 'rose'),
  ...bouquet(97, 5, 18, -1, 'mint'),
  ...bouquet(3, 97, 16, 1, 'mint'),
  ...butterflies(9, [46, 53, 60], 10),
  ...butterflies(91, [41, 48, 55], 10),
  { m: 'flourish', x: 90, y: 14, s: 16, r: 12, p: { c: '#E4A0B8' } },
  { m: 'flourish', x: 10, y: 90, s: 15, r: 192, p: { c: '#E4A0B8' } },
  { m: 'crest', x: 50, y: 55, s: 42 },
];

const RECEPTION_ELS = [
  { role: 'kicker',  type: 'text', x: 50, y: 12.5, text: 'YOU ARE CORDIALLY INVITED TO',  size: 8.5, font: F.playfair, track: 0.12, upper: true,  w: 68, color: '#FFFBF6' },
  { role: 'kicker2', type: 'text', x: 50, y: 16,   text: 'THE WEDDING RECEPTION OF',      size: 8.5, font: F.playfair, track: 0.12, upper: true,  w: 68, color: '#FFFBF6' },
  { role: 'names',   type: 'text', x: 50, y: 24,   text: 'Your Name',                     size: 34,  font: F.script,   track: 0,    upper: false, w: 88, color: '#FFFBF6' },
  { role: 'amp',     type: 'text', x: 50, y: 32.5, text: '&',                             size: 22,  font: F.script,   track: 0,    upper: false, w: 20, color: '#FFFBF6' },
  { role: 'names2',  type: 'text', x: 50, y: 41,   text: 'Their Name',                    size: 34,  font: F.script,   track: 0,    upper: false, w: 88, color: '#FFFBF6' },
  { role: 'date',    type: 'text', x: 50, y: 68.5, text: 'SATURDAY, 1 JANUARY 2027',      size: 11,  font: F.playfair, track: 0.04, upper: true,  w: 76, color: '#FFFBF6', icon: 'cal' },
  { role: 'time',    type: 'text', x: 50, y: 72,   text: '6.00 PM ONWARDS',               size: 11,  font: F.playfair, track: 0.04, upper: true,  w: 66, color: '#FFFBF6', icon: 'clock' },
  { role: 'body',    type: 'text', x: 50, y: 77.5, text: 'Together with our families, joyfully invite you to celebrate our wedding reception.', size: 10.5, font: F.serif, track: 0.01, upper: false, w: 78, color: '#FFFBF6' },
  { role: 'venue',   type: 'text', x: 50, y: 84,   text: 'VENUE NAME',                    size: 12,  font: F.playfair, track: 0.05, upper: true,  w: 66, color: '#FFFBF6', icon: 'pin' },
  { role: 'address', type: 'text', x: 50, y: 87.5, text: 'Street · City',                 size: 10,  font: F.serif,    track: 0.01, upper: false, w: 68, color: '#FFFBF6' },
];

const RECEPTION = {
  id: 't9', name: 'Blush Reception', cat: 'Marriage',
  bg: '#3A3138', ink: '#FFFBF6', accent: '#F2B8C6',
  kicker: 'You are cordially invited to', title: 'Your Names Here', sub: '01 . 01 . 2027',
  font: F.script,
  photo: true,                 // invites a background photo; falls back to `bg`
  scrim: 'rgba(28,22,26,0.42)',
  maps: '',                    // the couple pastes their own link in Details
  deco: RECEPTION_DECO,
  els: RECEPTION_ELS,
};

export const TEMPLATES = [RECEPTION, ...PLAIN];

/* The three-line layout used by every template that doesn't define its own. */
export const defaultEls = t => ([
  { role: 'kicker', type: 'text', x: 50, y: 26, text: t.kicker, size: 9,  color: t.ink,    font: F.uiMed, track: 0.18, upper: true,  w: 74 },
  { role: 'names',  type: 'text', x: 50, y: 42, text: t.title,  size: 30, color: t.ink,    font: t.font,  track: 0.01, upper: false, w: 84 },
  { role: 'date',   type: 'text', x: 50, y: 60, text: t.sub,    size: 11, color: t.accent, font: F.uiMed, track: 0.12, upper: true,  w: 74 },
]);

export const findTemplate = id => TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
