import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { C, INKS, GROUNDS } from '../../theme/colors';
import { F, FONT_OPTIONS } from '../../theme/fonts';
import { s } from '../../theme/styles';
import { Icon, P } from '../../components/Icon';
import { STICKERS } from '../../data/stickers';
import { useKeyboard } from '../../hooks/useKeyboard';

export function TextPanel({ ed }) {
  const { selEl, tpl, retype, add } = ed;
  return (
    <View style={{ padding: 18, paddingBottom: 6 }}>
      <Text style={s.kicker}>Text</Text>
      {selEl?.type === 'text' ? (
        <TextInput value={selEl.text} onChangeText={retype} multiline style={s.input} />
      ) : (
        <Text style={{ fontFamily: F.ui, fontSize: 12.5, lineHeight: 20, color: C.muted, marginTop: 9 }}>
          Tap any element on the canvas to edit it, or add a new line.
        </Text>
      )}
      <View style={{ flexDirection: 'row', gap: 9, marginTop: 12 }}>
        <Pressable style={[s.primary, { flex: 1 }]}
          onPress={() => add({ type: 'text', text: 'Your headline', size: 24, color: tpl.ink, font: tpl.font, track: 0.01, w: 80, y: 72 })}>
          <Text style={s.primaryTxt}>Add heading</Text>
        </Pressable>
        <Pressable style={[s.ghost, { flex: 1 }]}
          onPress={() => add({ type: 'text', text: 'Venue · time · dress code', size: 10, color: tpl.ink, font: F.ui, track: 0.08, w: 70, y: 84 })}>
          <Text style={s.ghostTxt}>Add body text</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function FontPanel({ ed }) {
  const { selEl, patchHist } = ed;
  return (
    <View style={{ padding: 18, paddingBottom: 6 }}>
      <Text style={s.kicker}>Typeface</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 11 }}>
        {FONT_OPTIONS.map(f => {
          const on = selEl?.font === f.family;
          return (
            <Pressable key={f.id} onPress={() => patchHist({ font: f.family })}
              style={{ width: '47%', paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: on ? C.ink : C.chip2 }}>
              <Text style={{ fontFamily: f.family, fontSize: 17, color: on ? C.cream : C.ink }}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function ColourPanel({ ed }) {
  const { selEl, patchHist, ground, setGround } = ed;
  return (
    <View style={{ padding: 18, paddingBottom: 6 }}>
      <Text style={s.kicker}>Colour</Text>
      <Text style={s.subLabel}>Element</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 9 }}>
        {INKS.map(c => (
          <Pressable key={c} onPress={() => patchHist({ color: c })} style={{ width: 38, height: 38, borderRadius: 19,
            backgroundColor: c, borderWidth: selEl?.color === c ? 2 : 1, borderColor: selEl?.color === c ? C.ink : 'rgba(43,39,51,0.14)' }} />
        ))}
      </View>
      <Text style={s.subLabel}>Background</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 9 }}>
        {GROUNDS.map(c => (
          <Pressable key={c} onPress={() => setGround(c)} style={{ width: 38, height: 38, borderRadius: 12,
            backgroundColor: c, borderWidth: ground === c ? 2 : 1, borderColor: ground === c ? C.ink : 'rgba(43,39,51,0.14)' }} />
        ))}
      </View>
    </View>
  );
}

export function StickerPanel({ ed }) {
  const { tpl, add } = ed;
  return (
    <View style={{ padding: 18, paddingBottom: 6 }}>
      <Text style={s.kicker}>Stickers</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 11 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {STICKERS.map(st => (
            <Pressable key={st.id} onPress={() => add({ type: 'sticker', d: st.d, size: 42, color: tpl.accent, y: 78 })}
              style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: C.chip2, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={24} height={24} viewBox="0 0 24 24"><Path d={st.d} fill="#6F6779" /></Svg>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export function PhotoPanel({ ed, onPickLayer, onPickBackground }) {
  const { tpl, photo, setPhoto } = ed;
  return (
    <View style={{ padding: 18, paddingBottom: 6 }}>
      <Text style={s.kicker}>Photo</Text>

      <Pressable onPress={onPickLayer} style={{ flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 11,
        borderWidth: 1.4, borderStyle: 'dashed', borderColor: 'rgba(43,39,51,0.2)', borderRadius: 16, padding: 15 }}>
        <Icon d={P.upload} size={22} color="#6F6779" />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: F.uiMed, fontSize: 13.5, color: C.ink }}>Add a photo layer</Text>
          <Text style={{ fontFamily: F.ui, fontSize: 11.5, color: C.muted, marginTop: 5 }}>Drops onto the canvas · drag to place</Text>
        </View>
      </Pressable>

      {tpl.photo ? (
        <View style={{ flexDirection: 'row', gap: 9, marginTop: 10 }}>
          <Pressable onPress={onPickBackground} style={[s.primary, { flex: 1 }]}>
            <Text style={s.primaryTxt}>{photo ? 'Change background' : 'Set background photo'}</Text>
          </Pressable>
          {photo ? (
            <Pressable onPress={() => setPhoto(null)} style={[s.ghost, { width: 96 }]}>
              <Text style={s.ghostTxt}>Remove</Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <Text style={{ fontFamily: F.ui, fontSize: 11.5, lineHeight: 19, color: C.muted, marginTop: 10 }}>
          This template uses a flat colour ground. Pick a photo template to place a picture behind the text.
        </Text>
      )}
    </View>
  );
}

/* The fields that also build the share message. Editing here edits the poster:
   each row is bound to the seeded layer carrying that role. */
const FIELDS = [
  { role: 'names', label: 'Name' },
  { role: 'names2', label: 'Partner / second name' },
  { role: 'date', label: 'Date' },
  { role: 'time', label: 'Time' },
  { role: 'venue', label: 'Venue' },
  { role: 'address', label: 'Address' },
];

export function DetailsPanel({ ed }) {
  const { els, retypeById, maps, setMaps } = ed;
  const kb = useKeyboard();
  const rows = FIELDS.map(f => ({ ...f, el: els.find(e => e.role === f.role && e.type === 'text') })).filter(r => r.el);

  return (
    // Shorter while the keyboard is up so the focused field stays on screen;
    // keyboardShouldPersistTaps keeps a tap moving between fields directly.
    <ScrollView style={{ maxHeight: kb.visible ? 190 : 250 }}
      contentContainerStyle={{ padding: 18, paddingBottom: 6 }} keyboardShouldPersistTaps="handled">
      <Text style={s.kicker}>Invitation details</Text>
      <Text style={{ fontFamily: F.ui, fontSize: 11.5, lineHeight: 19, color: C.muted, marginTop: 7 }}>
        These fill the poster and the message you share with it.
      </Text>

      {rows.map(r => (
        <View key={r.role}>
          <Text style={s.fieldLabel}>{r.label}</Text>
          <TextInput
            value={r.el.text}
            onChangeText={t => retypeById(r.el.id, t)}
            style={s.field}
            placeholderTextColor={C.faint}
          />
        </View>
      ))}

      <Text style={s.fieldLabel}>Location link</Text>
      <TextInput value={maps} onChangeText={setMaps} autoCapitalize="none" placeholder="https://maps.app.goo.gl/…"
        placeholderTextColor={C.faint} style={s.field} />
    </ScrollView>
  );
}
