import React from 'react';
import { View, Image } from 'react-native';
import { CANVAS_W, DEFAULT_ASPECT } from '../../theme/layout';
import { DecoLayer } from '../deco/Deco';
import { PosterElement } from './PosterElement';

/* Layer order: ground → photo → scrim → decoration → elements.
   The aspect comes from the template (the server sends canvasWidth/Height), so
   a 1080x1350 design is not squeezed into the bundled 5:7 box. */
export function Poster({
  tpl, els, ground, photo, scale = 1, interactive,
  selected, onSelect, onMove, onDragStart, onSlotPress, style,
}) {
  const w = CANVAS_W * scale;
  const h = w * (tpl.aspect || DEFAULT_ASPECT);
  const bgUri = photo || tpl.bgUrl;
  const showScrim = tpl.photo && (bgUri || tpl.scrim);

  return (
    <View style={[{
      width: w, height: h, borderRadius: 12 * scale,
      backgroundColor: ground || tpl.bg, overflow: 'hidden',
    }, style]}>
      {bgUri ? (
        <Image source={{ uri: bgUri }} style={{ position: 'absolute', width: w, height: h }} resizeMode="cover" />
      ) : null}

      {showScrim ? (
        <View pointerEvents="none" style={{
          position: 'absolute', width: w, height: h,
          backgroundColor: tpl.scrim || 'rgba(28,22,26,0.42)',
        }} />
      ) : null}

      <DecoLayer deco={tpl.deco} w={w} h={h} />

      {els.map(el => (
        <PosterElement key={el.id} el={el} w={w} h={h} scale={scale} interactive={interactive}
          selected={selected === el.id} onSelect={onSelect} onMove={onMove}
          onDragStart={onDragStart} onSlotPress={onSlotPress} />
      ))}
    </View>
  );
}
