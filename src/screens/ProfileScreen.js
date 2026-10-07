import React from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, THEMES } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';
import { useNavHeight } from '../components/BottomNav';

export function ProfileScreen({
  L, designs, user, initials, onSignIn, onSignOut,
  lang, setLang, theme, setTheme, darkPreview, setDarkPreview,
}) {
  const insets = useSafeAreaInsets();
  const navH = useNavHeight();

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 22, paddingBottom: navH + 16 }}
      showsVerticalScrollIndicator={false}>
      {/* Signed out, the header is the invitation to sign in rather than a
          placeholder name pretending to be an account. */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.blush, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: F.serif, fontSize: 24, color: '#8C5A52' }}>{user ? initials : '·'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: F.serif, fontSize: 24, color: C.ink }}>
            {user ? (user.displayName || user.username) : 'Not signed in'}
          </Text>
          <Text style={{ fontFamily: F.ui, fontSize: 12, color: C.muted, marginTop: 5 }}>
            {user ? user.email : 'Sign in to save and sync your designs'}
          </Text>
        </View>
      </View>

      {!user ? (
        <Pressable onPress={onSignIn} style={[s.primary, { marginTop: 18 }]}>
          <Text style={s.primaryTxt}>Sign in or create account</Text>
        </Pressable>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
        {[[designs.length, 'Designs'], [12, 'Exports'], [5, 'Shared']].map(([n, label]) => (
          <View key={label} style={[s.card, { flex: 1, padding: 14 }]}>
            <Text style={{ fontFamily: F.serif, fontSize: 22, color: C.ink }}>{n}</Text>
            <Text style={{ fontFamily: F.ui, fontSize: 11, color: C.muted, marginTop: 6 }}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={[s.kicker, { marginTop: 26 }]}>{L.language}</Text>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 10, backgroundColor: C.chip, borderRadius: 16, padding: 5 }}>
        {[['en', 'English'], ['ta', 'தமிழ்']].map(([id, label]) => {
          const on = lang === id;
          return (
            <Pressable key={id} onPress={() => setLang(id)}
              style={{ flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', backgroundColor: on ? '#fff' : 'transparent' }}>
              <Text style={{ fontFamily: F.uiMed, fontSize: 13, color: on ? C.ink : C.muted }}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[s.kicker, { marginTop: 24 }]}>{L.theme}</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 11 }}>
        {THEMES.map(th => (
          <Pressable key={th.id} onPress={() => setTheme(th.id)}
            style={[s.card, { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 8,
              borderWidth: theme === th.id ? 1.6 : 1, borderColor: theme === th.id ? C.ink : C.line }]}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: th.c }} />
            <Text style={{ fontFamily: F.uiMed, fontSize: 11, color: C.ink }}>{th.name}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[s.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, marginTop: 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: F.ui, fontSize: 14, color: C.ink }}>{L.darkPreview}</Text>
          <Text style={{ fontFamily: F.ui, fontSize: 11, color: C.muted, marginTop: 5 }}>{L.darkHint}</Text>
        </View>
        <Switch value={darkPreview} onValueChange={setDarkPreview} trackColor={{ true: C.ink, false: '#E3DFD8' }} thumbColor="#fff" />
      </View>

      <Text style={[s.kicker, { marginTop: 24 }]}>{L.account}</Text>
      <View style={[s.card, { marginTop: 10, overflow: 'hidden' }]}>
        {[[L.plan, 'Free'], [L.exportQuality, '300 dpi'], [L.connected, '2'], [L.help, '']].map(([label, val], i, arr) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            padding: 16, borderBottomWidth: i === arr.length - 1 ? 0 : 1, borderBottomColor: C.line }}>
            <Text style={{ fontFamily: F.ui, fontSize: 14, color: C.ink }}>{label}</Text>
            <Text style={{ fontFamily: F.ui, fontSize: 13, color: C.muted }}>{val} ›</Text>
          </View>
        ))}
      </View>

      {user ? (
        <Pressable onPress={onSignOut} style={[s.ghost, { marginTop: 14, backgroundColor: '#FBEDEB' }]}>
          <Text style={[s.ghostTxt, { color: '#B4564C' }]}>Sign out</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}
