import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';
import { W } from '../theme/layout';
import { Icon, P } from '../components/Icon';
import { Thumb } from '../components/poster/Thumb';

import { useNavHeight } from '../components/BottomNav';

export function HomeScreen({ L, templates, greeting, onSearch, onCategory, onSeeAll, onOpen }) {
  const insets = useSafeAreaInsets();
  const navH = useNavHeight();

  const cats = [
    { name: L.marriage,    bg: C.blush, ink: '#9A7B76', icon: P.rings,   n: 143, cat: 'marriage' },
    { name: L.birthday,    bg: C.lilac, ink: '#7E749A', icon: P.balloon, n: 143, cat: 'birthday' },
    { name: L.anniversary, bg: C.sage,  ink: '#72866F', icon: P.heart,   n: 143, cat: 'anniversary' },
    { name: L.baby,        bg: C.peach, ink: '#A2825F', icon: P.star,    n: 143, cat: 'baby-shower' },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: navH + 16 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 24 }}>
        <Text style={{ fontFamily: F.ui, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: C.muted }}>{greeting || L.greeting}</Text>
        <Text style={{ fontFamily: F.display, fontSize: 34, lineHeight: 39, color: C.ink, marginTop: 10, maxWidth: 270 }}>
          {L.heroA}{'\n'}<Text style={{ fontFamily: F.displayMed }}>{L.heroB}</Text>
        </Text>

        <Pressable onPress={onSearch} style={s.searchBar}>
          <Icon d={P.search} size={16} color={C.muted} w={1.8} />
          <Text style={{ fontFamily: F.ui, fontSize: 14, color: C.faint }}>{L.search}</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
          {cats.map(c => (
            <Pressable key={c.cat} onPress={() => onCategory(c.cat)}
              style={{ width: (W - 48 - 12) / 2, backgroundColor: c.bg, borderRadius: 22, padding: 16, paddingTop: 18 }}>
              <Icon d={c.icon} size={26} color={c.ink} w={1.5} />
              <Text style={{ fontFamily: F.uiMed, fontSize: 16, color: C.ink, marginTop: 26 }}>{c.name}</Text>
              <Text style={{ fontFamily: F.ui, fontSize: 12, color: c.ink, marginTop: 5 }}>{c.n} {L.templatesLc}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 30 }}>
          <Text style={{ fontFamily: F.serif, fontSize: 20, color: C.ink }}>{L.trending}</Text>
          <Pressable onPress={onSeeAll}><Text style={{ fontFamily: F.ui, fontSize: 12, color: C.rose }}>See all</Text></Pressable>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 14, gap: 12 }}>
        {templates.slice(0, 5).map(t => (
          <Pressable key={t.id} onPress={() => onOpen(t.id)} style={{ width: 132 }}>
            <Thumb tpl={t} width={132} />
            <Text style={{ fontFamily: F.ui, fontSize: 12, color: C.ink, marginTop: 8 }}>{t.name}</Text>
            <Text style={{ fontFamily: F.ui, fontSize: 11, color: C.muted }}>{t.cat}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </ScrollView>
  );
}
