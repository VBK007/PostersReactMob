import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { C } from '../../theme/colors';
import { F } from '../../theme/fonts';
import { s } from '../../theme/styles';

const LABELS = { text: 'Text', sticker: 'Sticker', photo: 'Photo' };

/* Size and delete for whichever layer is selected — text, sticker or photo
   alike — so every element type has the same controls. */
export function SelectionBar({ selEl, onResize, onDelete }) {
  if (!selEl) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 18, paddingTop: 16 }}>
      <Text style={{ fontFamily: F.ui, fontSize: 11, color: C.muted }}>
        {LABELS[selEl.type] || 'Layer'} · size
      </Text>
      <Pressable onPress={() => onResize(-1)} style={s.stepBtn}><Text style={s.stepTxt}>−</Text></Pressable>
      <Text style={{ fontFamily: F.uiMed, fontSize: 12, width: 28, textAlign: 'center' }}>{selEl.size}</Text>
      <Pressable onPress={() => onResize(1)} style={s.stepBtn}><Text style={s.stepTxt}>+</Text></Pressable>
      <Pressable onPress={onDelete} style={s.delBtn}>
        <Text style={{ fontFamily: F.uiMed, fontSize: 11.5, color: '#B4564C' }}>Delete</Text>
      </Pressable>
    </View>
  );
}
