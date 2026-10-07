import { C } from '../theme/colors';

export const STR = {
  en: {
    tagline: 'Design Your Moments', home: 'Home', templates: 'Templates', designs: 'My Designs', profile: 'Profile',
    greeting: 'Good evening, Ananya', heroA: 'What are we', heroB: 'celebrating today?',
    search: 'Search templates, occasions…', marriage: 'Marriage', birthday: 'Birthday',
    anniversary: 'Anniversary', baby: 'Baby Shower', templatesLc: 'templates',
    trending: 'Trending this week', gallery: 'Template Gallery', exportPng: 'Export PNG',
    exportPdf: 'Export PDF', shareTo: 'Share to', edit: 'Edit', reshare: 'Re-share',
    language: 'Language', theme: 'Theme preference', darkPreview: 'Dark preview stage',
    darkHint: 'Show finished posters on a dark backdrop', account: 'Account', plan: 'Plan',
    exportQuality: 'Export quality', connected: 'Connected apps', help: 'Help & feedback',
    message: 'Invitation message', copyHint: 'Sent alongside the poster',
  },
  ta: {
    tagline: 'உங்கள் தருணங்களை வடிவமையுங்கள்', home: 'முகப்பு', templates: 'வடிவங்கள்',
    designs: 'என் வடிவமைப்புகள்', profile: 'சுயவிவரம்', greeting: 'வணக்கம், அனன்யா',
    heroA: 'இன்று நாம் எதைக்', heroB: 'கொண்டாடுகிறோம்?', search: 'வடிவங்கள், விழாக்கள் தேடுங்கள்…',
    marriage: 'திருமணம்', birthday: 'பிறந்தநாள்', anniversary: 'ஆண்டுவிழா', baby: 'வளைகாப்பு',
    templatesLc: 'வடிவங்கள்', trending: 'இந்த வாரம் பிரபலம்', gallery: 'வடிவத் தொகுப்பு',
    exportPng: 'PNG ஏற்றுமதி', exportPdf: 'PDF ஏற்றுமதி', shareTo: 'பகிர', edit: 'திருத்து',
    reshare: 'மீண்டும் பகிர்', language: 'மொழி', theme: 'தோற்றத் தேர்வு',
    darkPreview: 'இருண்ட முன்னோட்டம்', darkHint: 'முடிந்த போஸ்டரை இருண்ட பின்னணியில் காட்டு',
    account: 'கணக்கு', plan: 'திட்டம்', exportQuality: 'ஏற்றுமதித் தரம்',
    connected: 'இணைந்த செயலிகள்', help: 'உதவி & கருத்து',
    message: 'அழைப்புச் செய்தி', copyHint: 'போஸ்டருடன் அனுப்பப்படும்',
  },
};

export const ONBOARD = [
  { bg: C.blush, ink: '#8C5A52', icon: 'M4 11l8-6.5 8 6.5v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8z',
    title: 'Every occasion, one tap away',
    body: 'Marriage, birthday, anniversary or baby shower — start from a template made for the moment.' },
  { bg: C.lilac, ink: '#6A57A0', icon: 'M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.4l6-.8z',
    title: 'Make it yours in minutes',
    body: 'Drag text anywhere, swap typefaces, drop in stickers and your own photos.' },
  { bg: C.sage, ink: '#4A7055', icon: 'M12 16V5M8 9l4-4 4 4M4.5 15v3.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V15',
    title: 'Share the invite everywhere',
    body: 'Export print-ready PDF or send straight to WhatsApp and Instagram.' },
];

/* The seven ceremonies the server knows, plus All. `slug` is what goes in a
   URL; `label` is what the mapper turns the enum name into, so a chip and a
   fetched template agree on the same string. */
export const CATEGORIES = [
  { slug: null, label: 'All' },
  { slug: 'marriage', label: 'Marriage' },
  { slug: 'engagement', label: 'Engagement' },
  { slug: 'birthday', label: 'Birthday' },
  { slug: 'baby-shower', label: 'Baby Shower' },
  { slug: 'naming-ceremony', label: 'Naming Ceremony' },
  { slug: 'house-warming', label: 'House Warming' },
  { slug: 'anniversary', label: 'Anniversary' },
];
