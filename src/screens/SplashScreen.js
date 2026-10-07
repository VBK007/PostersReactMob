import React from 'react';
import { View, Text, Pressable, StatusBar } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';

export function SplashScreen({ L, onDone }) {
  return (
    <Pressable onPress={onDone} style={[s.fill, { backgroundColor: C.blush, alignItems: 'center', justifyContent: 'center' }]}>
      <StatusBar barStyle="dark-content" />
      <Svg width={78} height={78} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="9.4" stroke="#8C5A52" strokeWidth="0.7" fill="none" />
        <Circle cx="12" cy="12" r="6.6" stroke="#8C5A52" strokeWidth="0.7" fill="none" />
        <Path d="M12 2.6v18.8M2.6 12h18.8M5.4 5.4l13.2 13.2M18.6 5.4L5.4 18.6" stroke="#8C5A52" strokeWidth="0.7" />
      </Svg>
      <Text style={{ fontFamily: F.display, fontSize: 34, color: '#4A3B3A', marginTop: 26 }}>Ceremony</Text>
      <Text style={{ fontFamily: F.uiMed, fontSize: 10, letterSpacing: 4, color: '#8C5A52', marginTop: 10 }}>POSTER CREATOR</Text>
      <View style={{ width: 34, height: 1, backgroundColor: C.gold, marginVertical: 26 }} />
      <Text style={{ fontFamily: F.serif, fontSize: 15, fontStyle: 'italic', color: '#6B564F', textAlign: 'center', maxWidth: 240 }}>
        {L.tagline}
      </Text>
    </Pressable>
  );
}
