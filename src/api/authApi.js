import { request } from './client';

/* kido's /api/auth/**.
 *
 * register and login both answer with the same AuthResponse:
 *   { token, refreshToken, user: { id, username, email, displayName, role, progress } }
 * The account rides along with the token by design, so the client renders a
 * name without decoding the JWT. */

export const register = ({ username, email, password, displayName, role = 'PARENT' }) =>
  request('/api/auth/register', {
    method: 'POST',
    body: { username, email, password, displayName, role },
  });

export const login = ({ usernameOrEmail, password }) =>
  request('/api/auth/login', { method: 'POST', body: { usernameOrEmail, password } });

/* The current account for a token that is already stored. */
export const me = opts => request('/api/auth/me', opts);

/* Trades a refresh token for a new pair. The token just sent is spent — the
   caller must overwrite what it stored with both values that come back. */
export const refresh = refreshToken =>
  request('/api/auth/refresh', { method: 'POST', body: { refreshToken } });
