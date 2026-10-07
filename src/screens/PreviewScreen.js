import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';
import { Icon, P } from '../components/Icon';
import { Poster } from '../components/poster/Poster';
import { buildCaption, shareInvite } from '../utils/caption';

export function PreviewScreen({ ed, L, dark, onBack, onSave, onToast }) {
  const { tpl, els, ground, photo, maps } = ed;
  const insets = useSafeAreaInsets();
  const [openMsg, setOpenMsg] = useState(false);
  const fg = dark ? C.cream : C.ink;
  const caption = buildCaption({ tpl, els, maps });

  async function share(channel) {
    const res = await shareInvite({ tpl, els, maps });
    if (res === 'shared') onToast(`Invitation sent to ${channel}`);
    else if (res === 'dismissed') onToast('Sharing cancelled');
    else onToast('Could not open the share sheet');
  }

  return (
    <View style={[s.fill, { backgroundColor: dark ? C.dusk : C.shell }]}>
      <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={onBack} style={[s.roundBtn, dark && s.roundBtnDark]}>
          <Icon d={P.back} size={17} color={fg} />
        </Pressable>
        <Text style={{ fontFamily: F.uiMed, fontSize: 13, color: fg }}>{tpl.name}</Text>
        <Pressable onPress={onSave} style={[s.roundBtn, dark && s.roundBtnDark]}>
          <Icon d={P.save} size={17} color={fg} />
        </Pressable>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Poster tpl={tpl} els={els} ground={ground} photo={photo} scale={0.95} style={s.canvasShadow} />
      </View>

      <View style={[s.sheet, dark && { backgroundColor: 'transparent' },
        { padding: 20, paddingBottom: Math.max(insets.bottom, 14) + 20 }]}>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable onPress={() => onToast('Exporting PNG · 2480 × 3508 px')} style={[s.primary, { flex: 1 }, dark && { backgroundColor: C.cream }]}>
            <Text style={[s.primaryTxt, dark && { color: C.ink }]}>{L.exportPng}</Text>
          </Pressable>
          <Pressable onPress={() => onToast('Exporting print-ready PDF · A4')} style={[s.ghost, { flex: 1 }, dark && { backgroundColor: 'rgba(255,251,246,0.12)' }]}>
            <Text style={[s.ghostTxt, dark && { color: C.cream }]}>{L.exportPdf}</Text>
          </Pressable>
        </View>

        {/* The message that travels with the poster, built from the same layers. */}
        <Pressable onPress={() => setOpenMsg(v => !v)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
          <View>
            <Text style={[s.kicker, { color: dark ? 'rgba(255,251,246,0.6)' : C.muted }]}>{L.message}</Text>
            <Text style={{ fontFamily: F.ui, fontSize: 11, color: dark ? 'rgba(255,251,246,0.5)' : C.faint, marginTop: 4 }}>
              {L.copyHint}
            </Text>
          </View>
          <Text style={{ fontFamily: F.uiMed, fontSize: 11.5, color: dark ? C.cream : C.rose }}>
            {openMsg ? 'Hide' : 'Preview'}
          </Text>
        </Pressable>

        {openMsg ? (
          <ScrollView style={{ maxHeight: 170, marginTop: 10, borderRadius: 14,
            backgroundColor: dark ? 'rgba(255,251,246,0.08)' : '#FDFBF8', borderWidth: 1, borderColor: dark ? 'rgba(255,251,246,0.14)' : C.line }}>
            <Text selectable style={{ fontFamily: F.ui, fontSize: 12, lineHeight: 19, padding: 14, color: dark ? C.cream : C.ink }}>
              {caption}
            </Text>
          </ScrollView>
        ) : null}

        <Text style={[s.kicker, { marginTop: 18, color: dark ? 'rgba(255,251,246,0.6)' : C.muted }]}>{L.shareTo}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 11 }}>
          {[['WhatsApp', '#E6F2E9', '#4C8A5E'], ['Instagram', '#F6E7F0', '#A4568C'], ['More', C.chip, '#6F6779']].map(([label, bg, ink]) => (
            <Pressable key={label} onPress={() => share(label)}
              style={{ flex: 1, alignItems: 'center', gap: 7, paddingVertical: 13, borderRadius: 16,
                backgroundColor: dark ? 'rgba(255,251,246,0.1)' : bg }}>
              <Icon d={P.share} size={20} color={dark ? C.cream : ink} />
              <Text style={{ fontFamily: F.uiMed, fontSize: 11, color: dark ? C.cream : C.ink }}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
