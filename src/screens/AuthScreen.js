import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';
import { Icon, P } from '../components/Icon';

/* Sign in, or create the account. Reached when someone opens the editor without
   one — the poster is theirs to keep, so it needs somewhere to keep it.
   `reason` says what they were trying to do, so the screen explains itself
   rather than appearing as an unexplained wall. */
export function AuthScreen({ session, reason, onCancel, onDone }) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('signup');      // 'signup' | 'signin'
  const [f, setF] = useState({ displayName: '', username: '', email: '', password: '' });
  const [touched, setTouched] = useState(false);

  const signup = mode === 'signup';
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  /* Mirrors the server's bean validation, so the common mistakes are caught
     without a round trip and the messages match what it would have said. */
  const problems = {
    displayName: signup && !f.displayName.trim() ? 'Tell us what to call you' : null,
    username: signup && f.username.trim().length < 3 ? 'At least 3 characters' : null,
    email: signup && !/^\S+@\S+\.\S+$/.test(f.email.trim()) ? 'A valid email, please' : null,
    password: f.password.length < 4 ? 'At least 4 characters' : null,
    usernameOrEmail: !signup && !f.username.trim() ? 'Username or email' : null,
  };
  const blocked = Object.values(problems).some(Boolean);

  async function submit() {
    setTouched(true);
    if (blocked || session.busy) return;
    Keyboard.dismiss();
    const res = signup
      ? await session.signUp({
          displayName: f.displayName.trim(),
          username: f.username.trim(),
          email: f.email.trim(),
          password: f.password,
        })
      : await session.signIn({ usernameOrEmail: f.username.trim(), password: f.password });
    if (res.ok) onDone(res.user);
  }

  const field = (key, label, extra = {}) => (
    <View key={key}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        value={f[key]}
        onChangeText={v => set(key, v)}
        placeholderTextColor={C.faint}
        style={[s.field, touched && problems[key] ? { borderColor: '#D99A93' } : null]}
        {...extra}
      />
      {touched && problems[key] ? (
        <Text style={{ fontFamily: F.ui, fontSize: 11, color: '#B4564C', marginTop: 5 }}>{problems[key]}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={[s.fill, { backgroundColor: C.cream }]}>
      <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={onCancel} style={s.roundBtn}><Icon d={P.back} size={17} /></Pressable>
        <Text style={{ fontFamily: F.uiMed, fontSize: 13, color: C.ink }}>
          {signup ? 'Create account' : 'Welcome back'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 26, paddingBottom: insets.bottom + 30 }}
        keyboardShouldPersistTaps="handled">

        <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 6 }}>
          <Svg width={54} height={54} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="9.4" stroke="#8C5A52" strokeWidth="0.7" fill="none" />
            <Circle cx="12" cy="12" r="6.6" stroke="#8C5A52" strokeWidth="0.7" fill="none" />
            <Path d="M12 2.6v18.8M2.6 12h18.8" stroke="#8C5A52" strokeWidth="0.7" />
          </Svg>
        </View>

        <Text style={{ fontFamily: F.display, fontSize: 28, lineHeight: 34, color: C.ink, textAlign: 'center', marginTop: 12 }}>
          {signup ? 'Your designs, kept safe' : 'Sign in to keep designing'}
        </Text>
        <Text style={{ fontFamily: F.ui, fontSize: 12.5, lineHeight: 20, color: C.muted, textAlign: 'center', marginTop: 9 }}>
          {reason || 'An account saves your posters and unlocks the full template catalogue.'}
        </Text>

        <View style={{ flexDirection: 'row', gap: 6, marginTop: 22, backgroundColor: C.chip, borderRadius: 16, padding: 5 }}>
          {[['signup', 'Create account'], ['signin', 'Sign in']].map(([id, label]) => {
            const on = mode === id;
            return (
              <Pressable key={id} onPress={() => { setMode(id); setTouched(false); session.clearError(); }}
                style={{ flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', backgroundColor: on ? '#fff' : 'transparent' }}>
                <Text style={{ fontFamily: F.uiMed, fontSize: 13, color: on ? C.ink : C.muted }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {signup ? (
          <>
            {field('displayName', 'Your name', { placeholder: 'Ananya Rao', autoCapitalize: 'words' })}
            {field('username', 'Username', { placeholder: 'ananya', autoCapitalize: 'none' })}
            {field('email', 'Email', { placeholder: 'you@example.com', autoCapitalize: 'none', keyboardType: 'email-address' })}
          </>
        ) : (
          field('username', 'Username or email', { placeholder: 'ananya', autoCapitalize: 'none' })
        )}
        {field('password', 'Password', { secureTextEntry: true, placeholder: '••••••' })}

        {session.error ? (
          <View style={{ marginTop: 14, backgroundColor: '#FBEDEB', borderRadius: 13, padding: 13 }}>
            <Text style={{ fontFamily: F.ui, fontSize: 12, lineHeight: 18, color: '#A24C43' }}>
              {session.error.isOffline
                ? 'Could not reach the server. Check the connection and try again.'
                : session.error.message}
            </Text>
          </View>
        ) : null}

        <Pressable onPress={submit} disabled={session.busy}
          style={[s.primary, { marginTop: 20, opacity: session.busy ? 0.6 : 1 }]}>
          {session.busy
            ? <ActivityIndicator color={C.cream} />
            : <Text style={s.primaryTxt}>{signup ? 'Create account' : 'Sign in'}</Text>}
        </Pressable>

        <Pressable onPress={onCancel} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ fontFamily: F.ui, fontSize: 12.5, color: C.muted }}>Keep browsing templates</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
