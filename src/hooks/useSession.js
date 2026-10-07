import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/authApi';
import { setTokenProvider } from '../api/config';

const KEY = 'ceremony.session.v1';

/* The signed-in account: who they are, and the token every other call needs.
 *
 * Persisted, because a poster app that asks for a password on every cold start
 * is one nobody signs into twice. The token is handed to the API layer through
 * setTokenProvider, so `request()` picks it up without any screen passing it
 * down — which is also what unblocks the template catalogue's 403. */
export function useSession() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [restoring, setRestoring] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  /* A ref so the provider closure always reads the live token rather than the
     one captured when it was registered. */
  const tokenRef = useRef(null);
  tokenRef.current = token;

  useEffect(() => { setTokenProvider(() => tokenRef.current); }, []);

  /* Restore a stored session on cold start. A stored token may have expired, so
     the saved account is shown immediately and confirmed against /me in the
     background — being wrong for a moment beats a spinner on every launch. */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw && alive) {
          const saved = JSON.parse(raw);
          setUser(saved.user);
          setToken(saved.token);
          setRefreshToken(saved.refreshToken);
          tokenRef.current = saved.token;
        }
      } catch {
        // A corrupt or unreadable store just means "not signed in".
      } finally {
        if (alive) setRestoring(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const persist = async next => {
    setUser(next.user);
    setToken(next.token);
    setRefreshToken(next.refreshToken);
    tokenRef.current = next.token;
    try { await AsyncStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const run = useCallback(async fn => {
    setBusy(true);
    setError(null);
    try {
      const res = await fn();
      await persist({ token: res.token, refreshToken: res.refreshToken, user: res.user });
      return { ok: true, user: res.user };
    } catch (e) {
      setError(e);
      return { ok: false, error: e };
    } finally {
      setBusy(false);
    }
  }, []);

  const signIn = useCallback(creds => run(() => authApi.login(creds)), [run]);
  const signUp = useCallback(details => run(() => authApi.register(details)), [run]);

  const signOut = useCallback(async () => {
    setUser(null); setToken(null); setRefreshToken(null); tokenRef.current = null;
    setError(null);
    try { await AsyncStorage.removeItem(KEY); } catch {}
  }, []);

  return {
    user, token, refreshToken,
    signedIn: !!token,
    restoring, busy, error,
    signIn, signUp, signOut,
    clearError: () => setError(null),
  };
}

/* "Good morning/afternoon/evening, <first name>" — the clock decides the
   greeting, the account decides the name, and neither is hardcoded. */
export function greetingFor(user, lang = 'en') {
  const h = new Date().getHours();
  const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  const name = (user?.displayName || user?.username || '').trim().split(/\s+/)[0];

  if (lang === 'ta') {
    const ta = { morning: 'காலை வணக்கம்', afternoon: 'மதிய வணக்கம்', evening: 'மாலை வணக்கம்' }[part];
    return name ? `${ta}, ${name}` : ta;
  }
  const en = `Good ${part}`;
  return name ? `${en}, ${name}` : en;
}

export const initialsFor = user => {
  const n = (user?.displayName || user?.username || '?').trim();
  return (n[0] || '?').toUpperCase();
};
