import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { Thumb } from './poster/Thumb';

export function TemplateCard({ tpl, width, onPreview, onEdit }) {
  return (
    <View style={{ width }}>
      <View>
        <Thumb tpl={tpl} width={width} />
        <Pressable onPress={onPreview} style={{ position: 'absolute', left: 10, right: 10, bottom: 10,
          backgroundColor: 'rgba(255,251,246,0.93)', borderRadius: 11, paddingVertical: 8, alignItems: 'center' }}>
          <Text style={{ fontFamily: F.uiMed, fontSize: 11.5, color: C.ink }}>Preview</Text>
        </Pressable>
      </View>
      <Text style={{ fontFamily: F.uiMed, fontSize: 13, color: C.ink, marginTop: 9 }}>{tpl.name}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Text style={{ fontFamily: F.ui, fontSize: 11, color: C.muted }}>{tpl.cat}</Text>
        <Pressable onPress={onEdit}><Text style={{ fontFamily: F.uiMed, fontSize: 11, color: C.rose }}>Edit →</Text></Pressable>
      </View>
    </View>
  );
}
