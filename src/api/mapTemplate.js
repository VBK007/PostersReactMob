import { F } from '../theme/fonts';
import { uid, DEFAULT_ASPECT } from '../theme/layout';

/* Server model → app model.
 *
 * The two differ in three ways, and each conversion happens once, here:
 *
 *   position   server: x/y are the box's TOP-LEFT, as fractions 0–1
 *              app:    x/y are the element's CENTRE, as percentages 0–100
 *   type size  server: fontSize is a fraction of canvas HEIGHT
 *              app:    size is in 300ths of canvas WIDTH (see PosterElement)
 *   aspect     server: canvasWidth x canvasHeight (default 1080x1350 = 1.25)
 *              app:    carried per template so the canvas matches the design
 */

const CATEGORY_LABELS = {
  MARRIAGE: 'Marriage',
  ENGAGEMENT: 'Engagement',
  BIRTHDAY: 'Birthday',
  BABY_SHOWER: 'Baby Shower',
  NAMING_CEREMONY: 'Naming Ceremony',
  HOUSE_WARMING: 'House Warming',
  ANNIVERSARY: 'Anniversary',
};

export const categoryLabel = c => CATEGORY_LABELS[c] || c;

/* The text-box keys the share caption understands. Anything else keeps its own
   key as a role, which is harmless — the caption just ignores it. */
const ROLE_ALIASES = {
  couple: 'names', names: 'names', name: 'names', bride: 'names', child: 'names',
  partner: 'names2', groom: 'names2', 'couple-2': 'names2', parents: 'names2',
  date: 'date', 'event-date': 'date', when: 'date',
  time: 'time', 'event-time': 'time',
  venue: 'venue', place: 'venue', hall: 'venue',
  address: 'address', location: 'address',
  heading: 'kicker', kicker: 'kicker', title: 'kicker',
  message: 'body', body: 'body', note: 'body', blessing: 'body',
};

const roleFor = key => ROLE_ALIASES[String(key || '').toLowerCase()] || key;

/* Indexes the component catalogue so a layout's ids resolve in one pass. */
export function indexComponents(components = []) {
  const byId = {};
  for (const c of components) byId[c.id] = c;
  return byId;
}

/* A FONT component names a family the editor has loaded; until remote fonts are
   registered we fall back to the bundled serif, which is never wrong-looking. */
const fontFamily = (id, byId, fallback) => {
  const c = id && byId[id];
  if (!c || c.type !== 'FONT') return fallback;
  return c.loadedFamily || fallback;
};

const ALIGN = { left: 'left', center: 'center', right: 'right' };

/* A summary carries no layout, so it can be shown but not opened. The grid
   draws `thumbnail`, the name and the swatch row; `full: false` is what tells
   the app to fetch the whole thing by id before it renders a canvas. */
export function mapSummary(dto) {
  const theme = (dto.colorThemes && dto.colorThemes[0]) || {};
  return {
    id: dto.id,
    remote: true,
    full: false,
    name: dto.name,
    cat: categoryLabel(dto.category),
    categorySlug: dto.categorySlug,
    thumbnail: dto.thumbnail,
    aspect: DEFAULT_ASPECT,          // the real one arrives with the layout
    bg: theme.secondary || '#FFFBF6',
    ink: theme.primary || '#2B2733',
    accent: theme.secondary || '#C2A15B',
    font: F.serif,
    colorThemes: dto.colorThemes || [],
    sortOrder: dto.sortOrder || 0,
    published: dto.published !== false,
    kicker: categoryLabel(dto.category),
    title: dto.name,
    sub: '',
    els: [],
  };
}

export function mapTemplate(dto, byId = {}) {
  if (!dto.layout) return mapSummary(dto);
  const layout = dto.layout;
  const cw = layout.canvasWidth || 1080;
  const ch = layout.canvasHeight || 1350;
  const aspect = ch / cw;

  const baseFont = fontFamily(layout.fontComponentId, byId, F.serif);
  const theme = (dto.colorThemes && dto.colorThemes[0]) || {};

  const texts = (layout.textBoxes || []).map(t => ({
    id: uid(),
    role: roleFor(t.key),
    key: t.key,
    label: t.label,
    type: 'text',
    text: t.text || '',
    // top-left + half the box = centre, then to percent
    x: (t.x + (t.width || 0) / 2) * 100,
    y: (t.y + (t.height || 0) / 2) * 100,
    w: (t.width || 1) * 100,
    // fraction of canvas height → the app's 300ths-of-width unit
    size: Math.max(6, Math.round(t.fontSize * aspect * 300)),
    color: t.color || theme.primary || '#2B2733',
    font: fontFamily(t.fontComponentId, byId, baseFont),
    align: ALIGN[t.align] || 'center',
    track: 0,
    upper: false,
  }));

  /* A sticker is artwork at a URL, not an SVG path like the bundled ones. */
  const stickers = (layout.stickers || []).map(sp => {
    const c = byId[sp.componentId];
    return {
      id: uid(),
      role: sp.key,
      type: 'image',
      src: c && c.url,
      x: (sp.x + (sp.width || 0) / 2) * 100,
      y: (sp.y + (sp.height || 0) / 2) * 100,
      size: Math.max(8, Math.round((sp.width || 0.1) * 300)),
      ratio: (sp.height && sp.width) ? sp.height / sp.width * aspect : 1,
      rotation: sp.rotation || 0,
    };
  }).filter(e => e.src);

  /* An image slot is a hole the user drops a photo into. It renders as a
     placeholder until filled, so the template reads correctly when empty. */
  const slots = (layout.imageSlots || []).map(sl => {
    const frame = sl.frameComponentId && byId[sl.frameComponentId];
    return {
      id: uid(),
      role: sl.key,
      key: sl.key,
      label: sl.label,
      type: 'slot',
      shape: sl.shape || 'rect',
      src: null,
      x: (sl.x + (sl.width || 0) / 2) * 100,
      y: (sl.y + (sl.height || 0) / 2) * 100,
      size: Math.max(20, Math.round((sl.width || 0.3) * 300)),
      ratio: (sl.height && sl.width) ? (sl.height / sl.width) * aspect : 1,
      frame: frame ? (frame.properties || {}) : null,
    };
  });

  return {
    id: dto.id,
    remote: true,
    full: true,
    name: dto.name,
    cat: categoryLabel(dto.category),
    categorySlug: dto.categorySlug,
    thumbnail: dto.thumbnail,
    aspect,
    bg: layout.backgroundColor || '#FFFBF6',
    photo: !!layout.backgroundImageUrl,
    bgUrl: layout.backgroundImageUrl || null,
    scrim: layout.backgroundImageUrl ? 'rgba(28,22,26,0.35)' : null,
    ink: theme.primary || '#2B2733',
    accent: theme.secondary || '#C2A15B',
    font: baseFont,
    colorThemes: dto.colorThemes || [],
    sortOrder: dto.sortOrder || 0,
    published: dto.published !== false,
    // Card/thumbnail copy, taken from the layout's own text.
    kicker: (texts.find(t => t.role === 'kicker') || {}).text || dto.name,
    title: (texts.find(t => t.role === 'names') || texts[0] || {}).text || dto.name,
    sub: (texts.find(t => t.role === 'date') || {}).text || '',
    els: [...slots, ...stickers, ...texts],
  };
}

export const mapTemplates = (dtos = [], components = []) => {
  const byId = indexComponents(components);
  return dtos.map(d => mapTemplate(d, byId));
};
