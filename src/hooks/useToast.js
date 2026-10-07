import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export function useToast(duration = 1900) {
  const [text, setText] = useState('');
  const y = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!text) return;
    y.setValue(20);
    Animated.timing(y, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    const t = setTimeout(() => setText(''), duration);
    return () => clearTimeout(t);
  }, [text]);

  return { text, y, show: setText };
}
