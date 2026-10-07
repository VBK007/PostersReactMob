import React from 'react';
import { Text, Animated } from 'react-native';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';

export function Toast({ text, y, bottom = 110 }) {
  if (!text) return null;
  return (
    <Animated.View style={{ position: 'absolute', left: 24, right: 24, bottom, transform: [{ translateY: y }],
      backgroundColor: C.ink, borderRadius: 15, paddingVertical: 13, paddingHorizontal: 16 }}>
      <Text style={{ fontFamily: F.ui, fontSize: 12.5, color: C.cream, textAlign: 'center' }}>{text}</Text>
    </Animated.View>
  );
}
