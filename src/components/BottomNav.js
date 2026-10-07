import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';
import { Icon, P } from './Icon';

export const NAV_BASE_HEIGHT = 96;

/* Height the scrolling content must clear so nothing hides behind the bar. */
export const useNavHeight = () => NAV_BASE_HEIGHT + useSafeAreaInsets().bottom;

export function BottomNav({ tab, setTab, L }) {
  const insets = useSafeAreaInsets();
  const items = [
    { id: 'home', label: L.home, d: P.home },
    { id: 'templates', label: L.templates, d: P.grid },
    { id: 'designs', label: L.designs, d: P.doc },
    { id: 'profile', label: L.profile, d: P.person },
  ];
  return (
    // The gesture bar / nav buttons own the bottom inset, so pad past it.
    <View style={[s.navWrap, { paddingBottom: Math.max(insets.bottom, 12) + 10 }]}>
      <View style={s.nav}>
        {items.map(n => {
          const on = tab === n.id;
          return (
            <Pressable key={n.id} onPress={() => setTab(n.id)}
              style={{ flex: 1, alignItems: 'center', gap: 5, paddingVertical: 8, borderRadius: 16,
                backgroundColor: on ? C.chip2 : 'transparent' }}>
              <Icon d={n.d} size={20} color={on ? C.ink : C.faint} />
              <Text numberOfLines={1} style={{ fontFamily: F.uiMed, fontSize: 9.5, color: on ? C.ink : C.faint }}>
                {n.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
