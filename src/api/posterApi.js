import { request } from './client';

/* GET /api/poster/** — the read side of the ceremony poster module.
 *
 * The catalogue is a thousand templates, so both listings are paged in the
 * server's envelope: { items, page, size, totalItems, totalPages }. `size`
 * defaults to 40 and is capped at 100 server-side — asking for more is not
 * refused, it is quietly clamped, so a client that wants everything must page. */

export const CATEGORY_SLUGS = [
  'marriage', 'engagement', 'birthday', 'baby-shower',
  'naming-ceremony', 'house-warming', 'anniversary',
];

export const PAGE_SIZE = 40;
export const MAX_PAGE_SIZE = 100;

const qs = params => {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== false && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  return q ? `?${q}` : '';
};

/* `summary: true` drops `layout` from every item — a page of 40 is 21 KB
   instead of 73 KB. The grid draws a thumbnail, a name and a swatch row and
   never looks at a layout, so that is what it should ask for. */
export const listTemplates = ({ page = 0, size = PAGE_SIZE, summary = false, includeDrafts = false, signal } = {}) =>
  request(`/api/poster/templates${qs({ page, size, view: summary ? 'summary' : undefined, includeDrafts })}`,
    { admin: includeDrafts, signal });

export const listTemplatesByCategory = (categorySlug, { page = 0, size = PAGE_SIZE, summary = false, signal } = {}) =>
  request(`/api/poster/templates/${encodeURIComponent(categorySlug)}${qs({ page, size, view: summary ? 'summary' : undefined })}`,
    { signal });

/* The whole template, layout included. This is the call behind opening one —
   a summary has no layout to render. Its own path because /{category} routes
   on a category, not an id. */
export const getTemplate = (id, { signal } = {}) =>
  request(`/api/poster/templates/by-id/${encodeURIComponent(id)}`, { signal });

/* The font / sticker / frame catalogue: 20 rows behind a thousand templates,
   which is the whole reason layouts carry ids. Fetch once, cache, resolve. */
export const listComponents = ({ type, signal } = {}) =>
  request(`/api/poster/components${qs({ type })}`, { signal });

/* Walks the pages of a listing and returns every item. Bounded by `maxPages`
   because "give me all thousand" is a mistake worth making impossible rather
   than merely slow. */
export async function listAllTemplates({ size = PAGE_SIZE, summary = true, maxPages = 5, signal } = {}) {
  const first = await listTemplates({ page: 0, size, summary, signal });
  const items = [...(first.items || [])];
  const pages = Math.min(first.totalPages || 1, maxPages);
  for (let p = 1; p < pages; p++) {
    const next = await listTemplates({ page: p, size, summary, signal });
    items.push(...(next.items || []));
  }
  return { items, totalItems: first.totalItems ?? items.length, totalPages: first.totalPages ?? 1, loaded: pages };
}

/* Writes — owner only, and they need X-Admin-Key alongside a PARENT token. */
export const createTemplate = (template, opts = {}) =>
  request('/api/poster/templates', { method: 'POST', body: template, admin: true, ...opts });

export const replaceTemplate = (id, template, opts = {}) =>
  request(`/api/poster/templates/${encodeURIComponent(id)}`, { method: 'PUT', body: template, admin: true, ...opts });

export const deleteTemplate = (id, opts = {}) =>
  request(`/api/poster/templates/${encodeURIComponent(id)}`, { method: 'DELETE', admin: true, ...opts });
