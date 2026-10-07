import Constants from 'expo-constants';

/* Where the kido poster module lives. Override per environment in app.json:
     "extra": { "apiBaseUrl": "http://10.0.2.2:8080", "adminKey": "…" }
   A device on USB can also reach a laptop server through
   `adb reverse tcp:8080 tcp:8080`, which makes 127.0.0.1:8080 work. */
const extra = Constants.expoConfig?.extra || {};

export const API_BASE_URL = (extra.apiBaseUrl || 'http://127.0.0.1:8080').replace(/\/+$/, '');

/* Only needed for writes and ?includeDrafts=true. Reading the catalogue does
   not use it, so a normal build ships without one. */
export const ADMIN_KEY = extra.adminKey || null;

export const API_TIMEOUT_MS = extra.apiTimeoutMs || 8000;

/* The app has no sign-in yet. Once Keycloak is wired, set this to a function
   returning the current access token; until then every call goes out
   unauthenticated and the server answers 403, which useCatalogue treats as
   "fall back to the bundled templates". */
let tokenProvider = () => null;

export const setTokenProvider = fn => { tokenProvider = fn || (() => null); };
export const getToken = async () => tokenProvider();
