import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';
import { W } from '../theme/layout';
import { Thumb } from '../components/poster/Thumb';
import { TEMPLATES as BUNDLED } from '../data/templates';
import { useNavHeight } from '../components/BottomNav';

export function DesignsScreen({ L, templates = BUNDLED, designs, onEdit, onReshare }) {
  const insets = useSafeAreaInsets();
  const navH = useNavHeight();
  const cardW = (W - 44 - 14) / 2;

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 22, paddingBottom: navH + 16 }}
      showsVerticalScrollIndicator={false}>
      <Text style={{ fontFamily: F.display, fontSize: 30, color: C.ink }}>{L.designs}</Text>
      <Text style={{ fontFamily: F.ui, fontSize: 12, color: C.muted, marginTop: 7 }}>
        {designs.length ? `${designs.length} saved` : 'Drafts and exports live here'}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 18 }}>
        {designs.map(d => (
          <View key={d.key} style={{ width: cardW }}>
            <Thumb tpl={templates.find(t => t.id === d.tplId) || templates[0]} width={cardW} />
            <Text style={{ fontFamily: F.uiMed, fontSize: 13, color: C.ink, marginTop: 9 }}>{d.name}</Text>
            <Text style={{ fontFamily: F.ui, fontSize: 11, color: C.muted, marginTop: 4 }}>{d.when}</Text>
            <View style={{ flexDirection: 'row', gap: 7, marginTop: 9 }}>
              <Pressable onPress={() => onEdit(d.tplId)} style={[s.smallDark, { flex: 1 }]}>
                <Text style={s.smallDarkTxt}>{L.edit}</Text>
              </Pressable>
              <Pressable onPress={() => onReshare(d.tplId)} style={[s.smallGhost, { flex: 1 }]}>
                <Text style={s.smallGhostTxt}>{L.reshare}</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
