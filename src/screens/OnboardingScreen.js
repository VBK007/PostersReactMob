import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';
import { Icon } from '../components/Icon';
import { ONBOARD } from '../data/strings';

export function OnboardingScreen({ step, onNext, onSkip }) {
  const insets = useSafeAreaInsets();
  const ob = ONBOARD[step];
  return (
    <View style={[s.fill, { backgroundColor: C.cream, paddingTop: insets.top + 8 }]}>
      <Pressable onPress={onSkip} style={{ alignSelf: 'flex-end', padding: 22 }}>
        <Text style={{ fontFamily: F.uiMed, fontSize: 12, color: C.muted }}>Skip</Text>
      </Pressable>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 }}>
        <View style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: ob.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={ob.icon} size={76} color={ob.ink} w={0.9} />
        </View>
        <Text style={{ fontFamily: F.display, fontSize: 30, lineHeight: 36, color: C.ink, textAlign: 'center', marginTop: 34, maxWidth: 260 }}>
          {ob.title}
        </Text>
        <Text style={{ fontFamily: F.ui, fontSize: 13.5, lineHeight: 23, color: '#7C7686', textAlign: 'center', marginTop: 14, maxWidth: 250 }}>
          {ob.body}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 26, paddingBottom: Math.max(insets.bottom, 16) + 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
          {[0, 1, 2].map(i => (
            <View key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3,
              backgroundColor: i === step ? C.ink : 'rgba(43,39,51,0.18)' }} />
          ))}
        </View>
        <Pressable onPress={onNext} style={[s.primary, { marginTop: 22 }]}>
          <Text style={s.primaryTxt}>{step === 2 ? 'Start designing' : 'Next'}</Text>
        </Pressable>
      </View>
    </View>
  );
}
