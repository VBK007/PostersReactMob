import React from 'react';
import { View, Text, Image } from 'react-native';
import { F } from '../../theme/fonts';
import { DEFAULT_ASPECT } from '../../theme/layout';
import { DecoLayer } from '../deco/Deco';

/* A template preview small enough for a gallery card. A catalogue template
   ships a rendered thumbnail; a bundled one is drawn from its own decoration
   and copy. */
export function Thumb({ tpl, width }) {
  const h = width * (tpl.aspect || DEFAULT_ASPECT);
  const light = tpl.photo;

  return (
    <View style={{ width, height: h, borderRadius: width * 0.13, backgroundColor: tpl.bg, overflow: 'hidden' }}>
      {tpl.thumbnail ? (
        <Image source={{ uri: tpl.thumbnail }} style={{ position: 'absolute', width, height: h }} resizeMode="cover" />
      ) : null}

      {tpl.photo && !tpl.thumbnail ? (
        <View style={{ position: 'absolute', width, height: h, backgroundColor: tpl.scrim || 'rgba(28,22,26,0.42)' }} />
      ) : null}

      {!tpl.thumbnail ? <DecoLayer deco={tpl.deco} w={width} h={h} /> : null}

      {!tpl.thumbnail ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: width * 0.09 }}>
          <Text numberOfLines={1} style={{ fontFamily: F.uiMed, fontSize: width * 0.055, letterSpacing: width * 0.008,
            color: tpl.ink, opacity: light ? 0.9 : 0.75, textTransform: 'uppercase', marginBottom: 6 }}>
            {tpl.kicker}
          </Text>
          <Text numberOfLines={2} style={{ fontFamily: tpl.font, fontSize: width * 0.13, lineHeight: width * 0.16,
            color: tpl.ink, textAlign: 'center' }}>
            {tpl.title}
          </Text>
          <View style={{ width: width * 0.26, height: 1, backgroundColor: tpl.accent, marginTop: 8 }} />
        </View>
      ) : null}
    </View>
  );
}
