import { API_BASE_URL, ADMIN_KEY, API_TIMEOUT_MS, getToken } from './config';

/* The server's error envelope: {timestamp, status, error, message}. */
export class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
  /* 403 is what an unauthenticated read gets, so callers can tell "you are not
     signed in" apart from "the server is down". */
  get isAuth() { return this.status === 401 || this.status === 403; }
  get isOffline() { return this.status === 0; }
}

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

/* One fetch with a timeout, the auth headers, and the error envelope unwrapped. */
export async function request(path, { method = 'GET', body, admin = false, signal } = {}) {
  const token = await getToken();
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (admin && ADMIN_KEY) headers['X-Admin-Key'] = ADMIN_KEY;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => controller.abort());

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method, headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    // A dead host, a wrong IP and a timeout all land here.
    throw new ApiError(0, e.name === 'AbortError' ? 'Request timed out' : 'Could not reach the server', null);
  } finally {
    clearTimeout(timer);
  }

  const payload = await parseBody(res);
  if (!res.ok) {
    const msg = (payload && payload.message) || (payload && payload.error) || `HTTP ${res.status}`;
    throw new ApiError(res.status, msg, payload);
  }
  return payload;
}
