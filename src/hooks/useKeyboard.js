import { useState, useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';

/* Whether the soft keyboard is up, and how tall it is.
 *
 * Android only fires the `did` events unless the app is in adjustResize, and iOS
 * fires `will` early enough to animate with the keyboard, so subscribe to the
 * pair that actually arrives on each platform. */
export function useKeyboard() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvt, e => setHeight(e.endCoordinates?.height || 0));
    const hide = Keyboard.addListener(hideEvt, () => setHeight(0));

    return () => { show.remove(); hide.remove(); };
  }, []);

  return { visible: height > 0, height };
}
