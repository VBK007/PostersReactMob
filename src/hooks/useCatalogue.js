import { useState, useEffect, useCallback, useRef } from 'react';
import {
  listTemplates, listTemplatesByCategory, listComponents, getTemplate,
  CATEGORY_SLUGS, PAGE_SIZE,
} from '../api/posterApi';
import { mapTemplate, mapTemplates, indexComponents } from '../api/mapTemplate';
import { TEMPLATES as BUNDLED } from '../data/templates';

/* The template catalogue, from the server when it answers and from the bundled
 * set when it doesn't.
 *
 * Three things shape this hook, all of them consequences of the catalogue being
 * a thousand templates rather than eight:
 *
 *  - It fetches *summaries*. A page of 40 is 21 KB without layouts against
 *    73 KB with them, and the grid draws a thumbnail, a name and a swatch row.
 *    The layout arrives from /by-id/ through `open()` when somebody opens one.
 *
 *  - The category drives the query, not a filter. Filtering the 40 rows that
 *    happen to be loaded would hide the other 103 in that ceremony.
 *
 *  - "All" fans out instead of paging. The listing is ordered by category, so
 *    its page 0 is forty templates of one ceremony — a picker that opens on
 *    forty anniversary cards looks broken in exactly the way a thousand
 *    templates was meant to fix. One small page from each of the seven gives a
 *    first screen that covers them all.
 *
 * The bundled fallback is deliberate rather than a safety net: the gallery is
 * the first screen after onboarding, and an empty grid because a laptop server
 * is not running reads as a broken app. `source` says which set is on screen so
 * the UI can be honest about it. */

const ALL_FANOUT = 8;        // per ceremony on the All tab: 7 x 8 = 56 cards

export function useCatalogue({ auto = true, size = PAGE_SIZE, ready = true, token = null } = {}) {
  const [templates, setTemplates] = useState(BUNDLED);
  const [components, setComponents] = useState([]);
  const [source, setSource] = useState('bundled');     // 'api' | 'bundled'
  const [category, setCategory] = useState(null);      // slug, or null for All
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(BUNDLED.length);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const componentsRef = useRef([]);
  // Full templates already fetched, so reopening one costs nothing.
  const fullCache = useRef(new Map());

  /* One page of whichever selection is current. */
  const fetchPage = (slug, p, signal) => (slug
    ? listTemplatesByCategory(slug, { page: p, size, summary: true, signal })
    : listTemplates({ page: p, size, summary: true, signal }));

  /* The All tab: a small page from every ceremony, interleaved so the grid
     alternates rather than running in blocks of eight. */
  async function fetchMixed(p, signal) {
    const pages = await Promise.all(
      CATEGORY_SLUGS.map(slug =>
        listTemplatesByCategory(slug, { page: p, size: ALL_FANOUT, summary: true, signal })
          .catch(() => ({ items: [], totalItems: 0, totalPages: 0 }))),
    );
    const columns = pages.map(x => x.items || []);
    const items = [];
    for (let i = 0; i < ALL_FANOUT; i++) {
      for (const col of columns) if (col[i]) items.push(col[i]);
    }
    return {
      items,
      page: p,
      totalItems: pages.reduce((n, x) => n + (x.totalItems || 0), 0),
      totalPages: Math.max(...pages.map(x => x.totalPages || 0), 0),
    };
  }

  const load = useCallback(async (slug = category) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      // Components resolve the ids inside a layout, so they are needed before
      // any full template can be mapped — fetched once and cached.
      const needComponents = componentsRef.current.length === 0;
      const [pageDto, comps] = await Promise.all([
        slug ? fetchPage(slug, 0, controller.signal) : fetchMixed(0, controller.signal),
        needComponents ? listComponents({ signal: controller.signal }) : componentsRef.current,
      ]);
      if (controller.signal.aborted) return;

      const items = mapTemplates(pageDto.items || [], comps || []);
      componentsRef.current = comps || [];
      setComponents(comps || []);

      if (items.length) {
        setTemplates(items);
        setSource('api');
        setCategory(slug);
        setPage(pageDto.page ?? 0);
        setTotalItems(pageDto.totalItems ?? items.length);
        setTotalPages(pageDto.totalPages ?? 1);
      } else if (slug) {
        // A real, empty ceremony — say so rather than showing another's cards.
        setTemplates([]);
        setSource('api');
        setCategory(slug);
        setTotalItems(0);
        setTotalPages(0);
      } else {
        setTemplates(BUNDLED);
        setSource('bundled');
        setCategory(null);
        setTotalItems(BUNDLED.length);
        setTotalPages(1);
      }
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(e);
      setTemplates(BUNDLED);
      setSource('bundled');
      setCategory(null);
      setTotalItems(BUNDLED.length);
      setTotalPages(1);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [category, size]);

  /* The next page of the current selection, appended. */
  const loadMore = useCallback(async () => {
    if (source !== 'api' || loadingMore || page + 1 >= totalPages) return;
    setLoadingMore(true);
    try {
      const next = category
        ? await fetchPage(category, page + 1)
        : await fetchMixed(page + 1);
      const items = mapTemplates(next.items || [], componentsRef.current);
      setTemplates(prev => {
        // Guard against a double-fire appending the same page twice.
        const seen = new Set(prev.map(t => t.id));
        return [...prev, ...items.filter(t => !seen.has(t.id))];
      });
      setPage(next.page ?? page + 1);
    } catch (e) {
      setError(e);
    } finally {
      setLoadingMore(false);
    }
  }, [source, loadingMore, page, totalPages, category, size]);

  /* Switch ceremony: a new query, not a filter over what is loaded. */
  const selectCategory = useCallback(slug => {
    if (slug === category) return;
    if (source !== 'api') { setCategory(slug); return; }   // bundled set filters locally
    load(slug);
  }, [category, source, load]);

  /* The whole template behind a summary. Bundled templates already carry their
     layers, so they are returned as they are. */
  const open = useCallback(async id => {
    const known = templates.find(t => t.id === id);
    if (known && known.full !== false) return known;
    if (fullCache.current.has(id)) return fullCache.current.get(id);

    const dto = await getTemplate(id);
    const full = mapTemplate(dto, indexComponents(componentsRef.current));
    fullCache.current.set(id, full);
    // Swap the summary for the full version so the grid and the editor agree.
    setTemplates(prev => prev.map(t => (t.id === id ? full : t)));
    return full;
  }, [templates]);

  /* Wait for the session before asking.
   *
   * A stored token is read from AsyncStorage asynchronously, so fetching on
   * mount raced it: the request went out unauthenticated, came back 403, and
   * the gallery told a signed-in user to sign in. `ready` holds the first fetch
   * until the session is known, and `token` in the deps refetches when somebody
   * signs in or out — the catalogue is a different thing to each. */
  useEffect(() => {
    if (!auto || !ready) return undefined;
    load(null);
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, ready, token]);

  /* A short line the gallery can show when the server is not the source. */
  const notice = !error ? null
    : error.isAuth ? 'Showing built-in templates — sign in to load the catalogue'
    : error.isOffline ? 'Showing built-in templates — server unreachable'
    : `Showing built-in templates — ${error.message}`;

  return {
    templates, components, source, notice, error,
    loading, loadingMore,
    category, page, totalItems, totalPages,
    hasMore: source === 'api' && page + 1 < totalPages,
    reload: () => load(category), loadMore, selectCategory, open,
  };
}
