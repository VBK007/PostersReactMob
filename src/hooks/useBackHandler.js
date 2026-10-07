import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

/* Android's hardware/gesture back.
 *
 * The handler returns true when it consumed the press and false to let the
 * system have it — which, at the root of the app, means exit. Screens here are
 * conditional renders rather than a navigation stack, so the back mapping lives
 * in one place beside the state machine it unwinds. */
export function useBackHandler(onBack) {
  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => onBack());
    return () => sub.remove();
  }, [onBack]);
}
