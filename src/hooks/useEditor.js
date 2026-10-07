import { useState, useRef, useEffect } from 'react';
import { clamp, uid, SIZE_LIMITS } from '../theme/layout';
import { TEMPLATES as BUNDLED, defaultEls } from '../data/templates';

const HISTORY_DEPTH = 20;

/* Owns everything that lives on the canvas: the layers, the selection, the
   background, and the undo stack. Editor and Preview share one instance.
   `templates` is the live catalogue — the server's when it answered, the
   bundled set otherwise — so an id always resolves against what is on screen. */
export function useEditor(templates = BUNDLED, initialId = 't1') {
  /* The template being edited is held as an object, not looked up by id each
     render. Signing in swaps the whole catalogue — bundled ids for the
     server's — and a lookup would then miss and fall back to some other
     template, leaving the canvas showing one poster's layers under another
     poster's name, decoration and aspect. */
  const [tpl, setTpl] = useState(null);
  const [els, setEls] = useState([]);
  const [history, setHistory] = useState([]);
  const [ground, setGround] = useState(null);
  const [photo, setPhoto] = useState(null);   // background photo for photo templates
  const [maps, setMaps] = useState('');
  const [sel, setSel] = useState(null);
  const [tool, setTool] = useState('text');

  const list = templates && templates.length ? templates : BUNDLED;
  const resolve = id => list.find(t => t.id === id) || list[0];

  // Until something is loaded, stand on the first template available.
  const current = tpl || resolve(initialId);
  const tplId = current?.id;
  const selEl = els.find(e => e.id === sel);

  /* A ref, not the closure: gesture handlers are memoised and can be holding an
     older render, which would otherwise snapshot stale layers. */
  const elsRef = useRef(els);
  elsRef.current = els;

  const pushHist = () => setHistory(h => [...h, JSON.stringify(elsRef.current)].slice(-HISTORY_DEPTH));

  /* Continuous edits (typing, stepping a size) snapshot once per run rather
     than per keystroke, so one undo reverts the whole edit. */
  const run = useRef(null);
  useEffect(() => { run.current = null; }, [sel]);
  const pushRun = kind => {
    const k = `${kind}:${sel}`;
    if (run.current !== k) { pushHist(); run.current = k; }
  };

  /* Takes an id, or a template object straight from the catalogue — the full
     version fetched by id has not reached `templates` state yet when the editor
     opens, so passing the object avoids a render's worth of stale summary. */
  function load(idOrTpl) {
    const t = typeof idOrTpl === 'string' ? resolve(idOrTpl) : (idOrTpl || resolve(initialId));
    if (!t) return;
    setTpl(t);
    setSel(null);
    setGround(t.bg);
    setPhoto(null);
    setMaps(t.maps || '');
    setHistory([]);
    run.current = null;
    setEls((t.els || defaultEls(t)).map(e => ({ ...e, id: uid() })));
  }

  /* Fills one of the template's photo slots rather than adding a layer. */
  const fillSlot = (slotId, src) => { pushHist(); patchById(slotId, { src }); };

  function undo() {
    if (!history.length) return;
    setEls(JSON.parse(history[history.length - 1]));
    setHistory(h => h.slice(0, -1));
    setSel(null);
    run.current = null;
  }

  const move = (id, x, y) => setEls(p => p.map(e => (e.id === id ? { ...e, x, y } : e)));
  const patchById = (id, props) => setEls(p => p.map(e => (e.id === id ? { ...e, ...props } : e)));
  const patch = props => patchById(sel, props);

  /* Retype a specific layer (the Details panel), independent of the canvas
     selection, still coalescing a burst of typing into one undo step. */
  const retypeById = (id, text) => {
    const k = `text:${id}`;
    if (run.current !== k) { pushHist(); run.current = k; }
    patchById(id, { text });
  };

  /* Discrete edit: snapshot first, and do nothing when nothing is selected. */
  const patchHist = props => { if (!sel) return; pushHist(); patch(props); };

  const add = el => { pushHist(); const id = uid(); setEls(p => [...p, { id, x: 50, y: 75, ...el }]); setSel(id); };
  const remove = () => { pushHist(); setEls(p => p.filter(e => e.id !== sel)); setSel(null); };

  const sizeBounds = SIZE_LIMITS[selEl?.type] || SIZE_LIMITS.text;
  const resize = dir => {
    if (!selEl) return;
    const [lo, hi, step] = sizeBounds;
    pushRun('size');
    patch({ size: clamp(selEl.size + dir * step, lo, hi) });
  };
  const retype = text => { pushRun('text'); patch({ text }); };

  const onDragStart = () => { pushHist(); run.current = null; };

  return {
    tpl: current, tplId, els, sel, selEl, tool, ground, photo, maps,
    canUndo: history.length > 0,
    setSel, setTool, setGround, setPhoto, setMaps,
    load, undo, move, add, remove, resize, retype, retypeById, fillSlot,
    patch, patchById, patchHist, onDragStart,
  };
}
