# Ceremony Poster Creator

Expo (SDK 57) app for designing invitation posters — marriage, birthday,
anniversary and baby shower. The whole UI lives in `App.js`; see
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the token set, screen map and
component breakdown.

## Run

```bash
npm install          # already done
npm start            # Metro + QR code for Expo Go
npm run android      # or: npm run ios / npm run web
```

## Layout

| Path | What |
|---|---|
| `App.js` | Tokens (`C`, `F`), templates, strings, every screen |
| `DESIGN_SYSTEM.md` | Design system reference |
| `app.json` | App name, cream splash, photo-library permission |

## Not wired up yet

- **Export / Share** — currently fire a toast. Needs `react-native-view-shot`
  + `expo-sharing`, and `expo-print` for PDF, against a ref on `<Poster>`.
- **Persistence** — `designs` is in-memory state. Swap for AsyncStorage or a backend.
- **Navigation** — screens are conditional renders, no stack history or deep links.
  Add `@react-navigation/native` + bottom-tabs when that matters.
