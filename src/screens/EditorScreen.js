import React from 'react';
import { View, Text, Pressable, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '../hooks/useKeyboard';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';
import { Icon, P } from '../components/Icon';
import { Poster } from '../components/poster/Poster';
import { SelectionBar } from './editor/SelectionBar';
import { TextPanel, FontPanel, ColourPanel, StickerPanel, PhotoPanel, DetailsPanel } from './editor/ToolPanels';

const TOOLS = [
  { id: 'text', label: 'Text', d: P.text },
  { id: 'details', label: 'Details', d: P.details },
  { id: 'font', label: 'Font', d: P.font },
  { id: 'color', label: 'Colour', d: P.heart },
  { id: 'sticker', label: 'Stickers', d: P.star },
  { id: 'photo', label: 'Photo', d: P.upload },
];

export function EditorScreen({ ed, onClose, onPreview, onPickLayer, onPickBackground, onSlotPress }) {
  const insets = useSafeAreaInsets();
  const kb = useKeyboard();
  const { tpl, els, sel, selEl, tool, ground, photo, canUndo } = ed;

  /* The poster has a fixed height, so a flex:1 parent cannot shrink it to make
     room when the keyboard opens — the panel gets pushed under the keyboard
     instead. While typing, show the poster small: the edit stays visible on the
     canvas, and the field it is being typed into stays on screen. */
  const typing = kb.visible;
  const canvasScale = typing ? 0.42 : 1;

  return (
    <View style={[s.fill, { backgroundColor: C.shell }]}>
      <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable onPress={onClose} style={s.roundBtn}><Icon d={P.back} size={17} /></Pressable>
          <Pressable onPress={ed.undo} disabled={!canUndo} style={[s.pillBtn, { opacity: canUndo ? 1 : 0.4 }]}>
            <Text style={{ fontFamily: F.uiMed, fontSize: 12, color: '#6F6779' }}>Undo</Text>
          </Pressable>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: F.uiMed, fontSize: 13, color: C.ink }}>{tpl.name}</Text>
          <Text style={{ fontFamily: F.ui, fontSize: 10.5, color: C.muted, marginTop: 4 }}>{els.length} layers</Text>
        </View>

        <Pressable onPress={onPreview} style={s.darkPill}>
          <Text style={{ fontFamily: F.uiMed, fontSize: 12, color: C.cream }}>Preview</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => { if (typing) Keyboard.dismiss(); else ed.setSel(null); }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: typing ? 8 : 0 }}>
        <Poster tpl={tpl} els={els} ground={ground} photo={photo} scale={canvasScale}
          interactive={!typing} selected={sel}
          onSelect={ed.setSel} onMove={ed.move} onDragStart={ed.onDragStart}
          onSlotPress={onSlotPress} style={s.canvasShadow} />
      </Pressable>

      <View style={s.sheet}>
        <SelectionBar selEl={selEl} onResize={ed.resize} onDelete={ed.remove} />

        {tool === 'text' && <TextPanel ed={ed} />}
        {tool === 'details' && <DetailsPanel ed={ed} />}
        {tool === 'font' && <FontPanel ed={ed} />}
        {tool === 'color' && <ColourPanel ed={ed} />}
        {tool === 'sticker' && <StickerPanel ed={ed} />}
        {tool === 'photo' && <PhotoPanel ed={ed} onPickLayer={onPickLayer} onPickBackground={onPickBackground} />}

        {/* The tool tabs are navigation, not part of typing — while the keyboard
            is up their row is ~90px the text field needs more. The safe-area
            inset is the keyboard's too, so it is not padded twice. */}
        <View style={[s.toolbar, {
          paddingBottom: typing ? 10 : Math.max(insets.bottom, 10) + 16,
          display: typing ? 'none' : 'flex',
        }]}>
          {TOOLS.map(t => {
            const on = tool === t.id;
            return (
              <Pressable key={t.id} onPress={() => ed.setTool(t.id)}
                style={{ alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 8, borderRadius: 13,
                  backgroundColor: on ? C.ink : 'transparent' }}>
                <Icon d={t.d} size={19} color={on ? C.cream : '#6F6779'} w={1.7} />
                <Text style={{ fontFamily: F.uiMed, fontSize: 9.5, color: on ? C.cream : '#6F6779' }}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
