import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { F } from '../theme/fonts';
import { s } from '../theme/styles';
import { W } from '../theme/layout';
import { Icon, P } from '../components/Icon';
import { TemplateCard } from '../components/TemplateCard';

import { CATEGORIES } from '../data/strings';
import { useNavHeight } from '../components/BottomNav';

const labelFor = slug => (CATEGORIES.find(c => c.slug === slug) || {}).label || 'All';

export function GalleryScreen({
  L, templates, remote, notice, loading, loadingMore, hasMore, totalItems, onReload, onLoadMore,
  cat, setCat, onSearch, onPreview, onEdit,
}) {
  const insets = useSafeAreaInsets();
  const navH = useNavHeight();
  /* With the server's catalogue the ceremony is the query, so what came back is
     what to draw. The bundled set has no server to ask, so it still filters. */
  const visible = remote ? templates : (cat ? templates.filter(t => t.cat === labelFor(cat)) : templates);
  const cardW = (W - 44 - 14) / 2;

  /* The catalogue is a thousand rows and arrives forty at a time, so ask for
     the next page when the scroll gets within a screen of the end. */
  const onScroll = ({ nativeEvent: e }) => {
    if (!hasMore || loadingMore || !onLoadMore) return;
    const fromEnd = e.contentSize.height - e.contentOffset.y - e.layoutMeasurement.height;
    if (fromEnd < e.layoutMeasurement.height) onLoadMore();
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: navH + 16 }}
      showsVerticalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16}>
      <View style={{ paddingHorizontal: 22 }}>
        <Text style={{ fontFamily: F.display, fontSize: 30, color: C.ink }}>{L.gallery}</Text>
        <Text style={{ fontFamily: F.ui, fontSize: 12, color: C.muted, marginTop: 7 }}>
          {/* Say how many there are, not just how many have loaded. */}
          {totalItems > visible.length
            ? `${visible.length} of ${totalItems} · ${cat ? labelFor(cat) : 'every occasion'}`
            : `${visible.length} templates · ${cat ? labelFor(cat) : 'every occasion'}`}
        </Text>
        <Pressable onPress={onSearch} style={[s.searchBar, { marginTop: 14 }]}>
          <Icon d={P.search} size={16} color={C.muted} w={1.8} />
          <Text style={{ fontFamily: F.ui, fontSize: 13.5, color: C.faint }}>{L.search}</Text>
        </Pressable>

        {/* Say plainly when these are the built-in templates rather than the
            server's, and offer the retry, instead of failing silently. */}
        {notice ? (
          <Pressable onPress={onReload} disabled={loading}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12,
              backgroundColor: '#FBF1E6', borderRadius: 13, paddingHorizontal: 13, paddingVertical: 11 }}>
            <Text style={{ flex: 1, fontFamily: F.ui, fontSize: 11.5, lineHeight: 17, color: '#8A6B3E' }}>{notice}</Text>
            <Text style={{ fontFamily: F.uiMed, fontSize: 11.5, color: C.rose }}>{loading ? '…' : 'Retry'}</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, paddingVertical: 14, gap: 8 }}>
        {CATEGORIES.map(c => {
          const on = cat === c.slug;
          return (
            <Pressable key={c.label} onPress={() => setCat(c.slug)}
              style={{ paddingHorizontal: 15, paddingVertical: 9, borderRadius: 999, backgroundColor: on ? C.ink : C.chip }}>
              <Text style={{ fontFamily: F.uiMed, fontSize: 12.5, color: on ? C.cream : '#6F6779' }}>{c.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingHorizontal: 22 }}>
        {visible.map(t => (
          <TemplateCard key={t.id} tpl={t} width={cardW}
            onPreview={() => onPreview(t.id)} onEdit={() => onEdit(t.id)} />
        ))}
      </View>

      {loadingMore ? (
        <View style={{ paddingVertical: 24, alignItems: 'center' }}>
          <ActivityIndicator color={C.muted} />
        </View>
      ) : hasMore ? (
        // A tap target as well as the scroll trigger, for when the filtered
        // view is short enough that scrolling never reaches the end.
        <Pressable onPress={onLoadMore} style={{ alignItems: 'center', paddingVertical: 22 }}>
          <Text style={{ fontFamily: F.uiMed, fontSize: 12.5, color: C.rose }}>Load more templates</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}
