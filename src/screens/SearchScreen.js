import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';
import { W } from '../theme/layout';
import { Icon, P } from '../components/Icon';
import { TemplateCard } from '../components/TemplateCard';


const RECENT = ['Marriage', 'Reception invite', 'Baby shower', 'Gold border'];
const OCCASIONS = ['Marriage', 'Birthday', 'Anniversary', 'Baby Shower'];
const DOTS = ['#E8B4B8', '#B7A7E0', '#9CBCA2', '#E5B489'];

export function SearchScreen({ L, templates, query, setQuery, onClose, onPreview, onEdit }) {
  const insets = useSafeAreaInsets();
  const q = query.trim().toLowerCase();
  const found = q ? templates.filter(t => `${t.name} ${t.cat} ${t.title} ${t.kicker}`.toLowerCase().includes(q)) : [];
  const cardW = (W - 40 - 14) / 2;

  return (
    <View style={[s.fill, { backgroundColor: C.cream, paddingTop: insets.top + 12 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingBottom: 12 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.chip2,
          borderRadius: 15, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 12 : 4 }}>
          <Icon d={P.search} size={16} color={C.muted} w={1.8} />
          <TextInput autoFocus value={query} onChangeText={setQuery} placeholder={L.search} placeholderTextColor={C.faint}
            style={{ flex: 1, fontFamily: F.ui, fontSize: 14, color: C.ink }} />
        </View>
        <Pressable onPress={onClose}>
          <Text style={{ fontFamily: F.uiMed, fontSize: 12.5, color: C.muted }}>Cancel</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 28 }} keyboardShouldPersistTaps="handled">
        {!q ? (
          <>
            <Text style={s.kicker}>Recent</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 11 }}>
              {RECENT.map(r => (
                <Pressable key={r} onPress={() => setQuery(r)} style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: C.chip2 }}>
                  <Text style={{ fontFamily: F.ui, fontSize: 12.5, color: '#4A4553' }}>{r}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[s.kicker, { marginTop: 26 }]}>Popular occasions</Text>
            {OCCASIONS.map((c, i) => (
              <Pressable key={c} onPress={() => setQuery(c)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.line }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: DOTS[i] }} />
                <Text style={{ flex: 1, fontFamily: F.ui, fontSize: 14, color: C.ink }}>{c}</Text>
                <Text style={{ fontFamily: F.ui, fontSize: 11.5, color: C.muted }}>
                  {templates.filter(t => t.cat === c).length} templates
                </Text>
              </Pressable>
            ))}
          </>
        ) : found.length ? (
          <>
            <Text style={{ fontFamily: F.ui, fontSize: 12, color: C.muted, marginBottom: 14 }}>
              {found.length} templates for “{query.trim()}”
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
              {found.map(t => (
                <TemplateCard key={t.id} tpl={t} width={cardW}
                  onPreview={() => onPreview(t.id)} onEdit={() => onEdit(t.id)} />
              ))}
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 54 }}>
            <Text style={{ fontFamily: F.serif, fontSize: 21, color: C.ink }}>No match for “{query.trim()}”</Text>
            <Text style={{ fontFamily: F.ui, fontSize: 12.5, lineHeight: 20, color: C.muted, textAlign: 'center', marginTop: 8, maxWidth: 230 }}>
              Try an occasion — marriage, birthday, anniversary or baby shower.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
