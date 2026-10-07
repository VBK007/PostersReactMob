# Ceremony Poster Creator — React Native

Expo (SDK 57) app for designing invitation posters. `App.js` is a composition
root; everything else lives under `src/`.

## Layout

```
App.js                      screen state machine, back handling, auth gate
src/
  theme/      colors  fonts  layout  styles       tokens and canvas geometry
  data/       templates  stickers  strings        the bundled fallback set
  api/        config  client  posterApi  authApi  mapTemplate
  hooks/      useEditor  useCatalogue  useSession  useToast
              useKeyboard  useBackHandler
  components/ Icon  Toast  TemplateCard  BottomNav
              poster/ Poster  PosterElement  Thumb
              deco/   motifs  Deco
  screens/    Splash Onboarding Home Gallery Search Editor Preview
              Designs Profile Auth
              editor/ SelectionBar  ToolPanels
  utils/      caption
```

## Core pieces

| Piece | What it is |
|---|---|
| `C` / `F` | Colour + font tokens (pastel palette, Cormorant / Playfair / Outfit / Caveat) |
| `useEditor` | The canvas: layers, selection, background, and a 20-deep undo stack. Discrete actions (add, delete, font, colour, drag) snapshot once; continuous ones (typing, size stepper) snapshot once per *run* via `pushRun`, so one Undo reverts the whole edit |
| `Poster` / `PosterElement` | Renderer. Positions are percentages and `size` is in 300ths of the canvas width, so one element list draws a thumbnail, the editor and an export. `PanResponder` gives drag-and-drop, with a 3px threshold so a tap to select costs no undo entry |
| `deco/motifs` | Blooms, sprigs, butterflies, flourishes and the infinity crest. Each draws in a 100×100 box and is placed by percentage, so a decorated template reads the same at any size |
| `useCatalogue` | The template list — the server's when it answers, the bundled set when it doesn't. Fetches summaries, pages on scroll, fans out across ceremonies on the All tab, and fetches a full template by id on open |
| `useSession` | The signed-in account, persisted to AsyncStorage, feeding the API layer's token provider |
| `utils/caption` | The share message, built from the poster's own layers by `role` |

## Backend

The catalogue comes from the kido poster module (`/api/poster/**`), which is a
thousand templates behind twenty shared components. Three consequences shape
the client:

- **Listings are paged** — `{items, page, size, totalItems, totalPages}`, 40 by
  default and capped at 100 server-side.
- **`?view=summary` drops the layout.** A page of 40 is 21 KB as summaries
  against 73 KB full, and the grid draws only a thumbnail, a name and a swatch
  row. The layout arrives from `/by-id/{id}` when somebody opens one.
- **The ceremony is the query, not a filter.** Filtering the loaded page would
  hide the other 103 templates in that category. The All tab fetches a small
  page from each of the seven ceremonies and interleaves them, because the
  listing is ordered by category and its page 0 is otherwise one ceremony.

`mapTemplate.js` converts the server's model to the app's, and the three
differences each happen there exactly once:

| | Server | App |
|---|---|---|
| Position | `x`/`y` are the box's **top-left**, fractions 0–1 | element **centre**, percent 0–100 |
| Type size | `fontSize` is a fraction of canvas **height** | `size` in 300ths of canvas **width** |
| Aspect | `canvasWidth` × `canvasHeight` | carried per template |

Reads need a bearer token, so without one the catalogue falls back to the
bundled templates and the gallery says why.

## Screens

Splash · Onboarding (3 slides) · Home · Template Gallery · Search · Auth ·
Editor (text, details, font, colour, stickers, photo — plus Undo and a
selection bar that resizes or deletes any element type) · Preview (export,
invitation message, share) · My Designs · Profile.

Editing and saving require an account; browsing and previewing do not.

## Left as stubs

- **Export PNG / PDF** fire a toast. Wire up `react-native-view-shot` +
  `expo-sharing` (and `expo-print` for PDF) against a ref on `<Poster>`.
- **Sharing** hands the caption to the OS share sheet; the poster image itself
  is not attached yet.
- **Saved designs** are in-memory. They survive neither a reload nor a device,
  and the server has no endpoint for them yet.
- **Remote fonts** — a `FONT` component's `url` is not loaded; text falls back
  to the bundled serif.
- **Navigation** — screens are conditional renders with a hand-rolled back
  handler. `@react-navigation/native` would bring real stack history and deep
  links.
