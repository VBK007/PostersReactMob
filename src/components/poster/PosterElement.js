import React, { useRef, useMemo } from 'react';
import { View, Text, Image, PanResponder } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { C } from '../../theme/colors';
import { F } from '../../theme/fonts';
import { clamp } from '../../theme/layout';
import { LINE_ICONS } from '../Icon';

/* Element geometry is resolution independent: x/y are percentages of the canvas
   and `size` is in 300ths of the canvas width, so one element list renders on a
   thumbnail, the editor and an export. `w`/`h` are the canvas in pixels. */
export function PosterElement({ el, w, h, scale, selected, onSelect, onMove, onDragStart, onSlotPress, interactive }) {
  const start = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => interactive,
    onMoveShouldSetPanResponder: () => interactive,
    onPanResponderGrant: () => { start.current = { x: el.x, y: el.y }; moved.current = false; onSelect(el.id); },
    onPanResponderMove: (_, g) => {
      // Snapshot for undo only once the gesture is a real drag, not a tap with jitter.
      if (!moved.current) {
        if (Math.abs(g.dx) + Math.abs(g.dy) < 3) return;
        moved.current = true;
        onDragStart && onDragStart();
      }
      onMove(
        el.id,
        clamp(start.current.x + (g.dx / w) * 100, 4, 96),
        clamp(start.current.y + (g.dy / h) * 100, 4, 96),
      );
    },
  }), [el.id, el.x, el.y, interactive, w, h]);

  const size = (el.size / 300) * w;
  const box = el.type === 'text' ? (el.w / 100) * w : size;
  const align = el.align || 'center';

  const label = el.type === 'text' && (
    <Text style={{
      fontFamily: el.font, fontSize: size, lineHeight: size * 1.22, color: el.color,
      textAlign: align, letterSpacing: size * (el.track || 0),
      textTransform: el.upper ? 'uppercase' : 'none',
    }}>{el.text}</Text>
  );

  const slotH = size * (el.ratio || 1);

  return (
    <View
      {...(interactive ? responder.panHandlers : {})}
      style={{
        position: 'absolute',
        left: (el.x / 100) * w - box / 2,
        top: (el.y / 100) * h - size / 2,
        width: box,
        ...(el.rotation ? { transform: [{ rotate: `${el.rotation}deg` }] } : {}),
        ...(selected && interactive ? { borderWidth: 1, borderColor: C.ink, borderRadius: 3 } : {}),
      }}
    >
      {el.type === 'text' && (el.icon && LINE_ICONS[el.icon] ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: size * 0.45 }}>
          <Svg width={size * 1.15} height={size * 1.15} viewBox="0 0 24 24">
            <Path d={LINE_ICONS[el.icon]} stroke={el.color} strokeWidth={1.7} fill="none"
              strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <View style={{ flexShrink: 1 }}>{label}</View>
        </View>
      ) : label)}

      {/* Bundled sticker: an SVG path tinted to the template's accent. */}
      {el.type === 'sticker' && (
        <Svg width={size} height={size} viewBox="0 0 24 24"><Path d={el.d} fill={el.color} /></Svg>
      )}

      {/* Catalogue sticker: artwork fetched from the component's url. */}
      {el.type === 'image' && (
        <Image source={{ uri: el.src }} style={{ width: size, height: slotH }} resizeMode="contain" />
      )}

      {/* A photo the user added as their own layer. */}
      {el.type === 'photo' && (
        <Image source={{ uri: el.src }} style={{ width: size, height: size * 0.75, borderRadius: 6 }} />
      )}

      {/* A slot the template defines. Empty, it draws its own outline and label
          so the design still reads; filled, it clips the photo to its shape. */}
      {el.type === 'slot' && (
        <View
          onStartShouldSetResponder={() => !!(interactive && onSlotPress)}
          onResponderRelease={() => onSlotPress && onSlotPress(el)}
          style={{
            width: size, height: slotH, overflow: 'hidden',
            borderRadius: el.shape === 'circle' ? Math.max(size, slotH)
              : el.shape === 'arch' ? size / 2 : size * 0.04,
            ...(el.shape === 'arch' ? { borderBottomLeftRadius: size * 0.04, borderBottomRightRadius: size * 0.04 } : {}),
            ...(el.frame ? {
              borderWidth: Math.max(1, (el.frame.borderWidth || 4) * (size / 300)),
              borderColor: el.frame.borderColor || C.gold,
            } : { borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', borderStyle: el.src ? 'solid' : 'dashed' }),
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: el.src ? 'transparent' : 'rgba(255,255,255,0.14)',
          }}>
          {el.src ? (
            <Image source={{ uri: el.src }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <Text numberOfLines={2} style={{ fontFamily: F.ui, fontSize: Math.max(7, size * 0.09),
              color: 'rgba(255,255,255,0.9)', textAlign: 'center', paddingHorizontal: 4 }}>
              {el.label || 'Add photo'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
