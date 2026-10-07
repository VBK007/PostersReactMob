/**
 * Ceremony Poster Creator — composition root.
 *
 * Fonts are registered here; everything else lives under src/:
 *   theme/       palette, type, shared stylesheet, canvas geometry
 *   data/        templates, stickers, copy
 *   components/  poster renderer, decorative motifs, chrome
 *   hooks/       editor state (layers, selection, undo) and toasts
 *   screens/     one file per screen
 *   utils/       the share caption built from the poster's own layers
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from 'expo-font';
import { CormorantGaramond_300Light, CormorantGaramond_400Regular, CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond';
import { Outfit_400Regular, Outfit_500Medium } from '@expo-google-fonts/outfit';
import { PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import { Caveat_600SemiBold } from '@expo-google-fonts/caveat';

import { C, THEMES } from './src/theme/colors';
import { s } from './src/theme/styles';
import { uid } from './src/theme/layout';
import { STR } from './src/data/strings';
import { useEditor } from './src/hooks/useEditor';
import { useCatalogue } from './src/hooks/useCatalogue';
import { useToast } from './src/hooks/useToast';
import { useBackHandler } from './src/hooks/useBackHandler';
import { useSession, greetingFor, initialsFor } from './src/hooks/useSession';
import { Toast } from './src/components/Toast';
import { BottomNav } from './src/components/BottomNav';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { GalleryScreen } from './src/screens/GalleryScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { PreviewScreen } from './src/screens/PreviewScreen';
import { DesignsScreen } from './src/screens/DesignsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AuthScreen } from './src/screens/AuthScreen';

function Ceremony() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_300Light, CormorantGaramond_400Regular, CormorantGaramond_500Medium,
    Outfit_400Regular, Outfit_500Medium, PlayfairDisplay_400Regular, Caveat_600SemiBold,
  });

  /* Screen state machine: splash → onboarding → tabs, with editor, preview and
     search layered over the tabs as overlays. */
  const [splash, setSplash] = useState(true);
  const [onboard, setOnboard] = useState(0);
  const [tab, setTab] = useState('home');
  const [overlay, setOverlay] = useState(null);      // 'editor' | 'preview' | null
  // Preview is reachable from the editor and straight from a tab; back has to
  // return to whichever one opened it, not always to the editor.
  const [previewFrom, setPreviewFrom] = useState('tab');
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState(null);   // category slug, null = All

  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('blush');
  const [darkPreview, setDarkPreview] = useState(false);
  const [designs, setDesigns] = useState([
    { key: 'd1', tplId: 't2', name: 'Rhea & Kabir', when: 'Edited 2 days ago' },
    { key: 'd2', tplId: 't7', name: 'Oh Baby · Priya', when: 'Exported last week' },
  ]);

  const session = useSession();
  // The catalogue needs the token, which is restored asynchronously — it waits
  // for the session and refetches whenever the token changes.
  const catalogue = useCatalogue({ ready: !session.restoring, token: session.token });
  const ed = useEditor(catalogue.templates, 't1');
  const toast = useToast();

  /* What the account was needed for, and what to do once it exists. Browsing
     and previewing stay open to everyone; editing is where a poster becomes
     something worth keeping, so that is the gate. */
  const [authGate, setAuthGate] = useState(null);   // { reason, next } | null
  const L = STR[lang];
  const tint = (THEMES.find(t => t.id === theme) || THEMES[0]).c;

  useEffect(() => { const t = setTimeout(() => setSplash(false), 2400); return () => clearTimeout(t); }, []);

  /* Seed the canvas from whichever catalogue is live. This runs once on mount
     with the bundled set and again if the server's arrives, whose ids are
     different — but never while an editor is open, which would swap the poster
     out from under whoever is drawing on it. */
  useEffect(() => {
    if (overlay) return;
    const first = catalogue.templates[0];
    // Only a full template can seed a canvas; a summary has no layers. With the
    // server's catalogue there is nothing to seed, and nothing needs it — the
    // editor is only ever entered through withTemplate, which fetches first.
    if (first && first.full !== false) ed.load(first);
  }, [catalogue.source, catalogue.templates.length]);

  /* The grid holds summaries — no layout — so opening one fetches the whole
     template by id first. `opening` keeps a second tap from starting a second
     fetch while the first is in flight. */
  const [opening, setOpening] = useState(false);

  async function withTemplate(id, then) {
    if (opening) return;
    setOpening(true);
    try {
      then(await catalogue.open(id));
    } catch (e) {
      toast.show(e.isOffline ? 'Could not reach the server' : 'Could not open that template');
    } finally {
      setOpening(false);
    }
  }

  const enterEditor = id => withTemplate(id, tpl => {
    ed.load(tpl); ed.setTool('text'); setOverlay('editor'); setSearch(false);
  });

  /* Editing needs an account. The request is remembered, so signing in drops
     the user straight into the poster they tapped rather than back at square
     one. */
  const openEditor = id => {
    if (session.signedIn) return enterEditor(id);
    setAuthGate({
      reason: 'Create an account to start editing — it keeps your posters and your changes.',
      next: () => enterEditor(id),
    });
  };
  const openPreview = id => withTemplate(id, tpl => {
    ed.load(tpl); setPreviewFrom('tab'); setOverlay('preview'); setSearch(false);
  });
  const closeEditor = () => { setOverlay(null); setTab('templates'); };
  const closePreview = () => { if (previewFrom === 'editor') setOverlay('editor'); else setOverlay(null); };
  const closeSearch = () => { setSearch(false); setQuery(''); };

  /* Android back, mapped onto the screen state machine. Each press unwinds one
     level; only at the root does it fall through to the system and exit, and
     there it asks once first — a poster in progress lives in memory, so a
     mis-swipe at the bottom of the screen would otherwise throw it away. */
  const exitArmed = useRef(false);
  useBackHandler(useCallback(() => {
    if (splash) { setSplash(false); return true; }
    if (onboard < 3) {
      if (onboard === 0) return false;         // first slide: let the system exit
      setOnboard(onboard - 1);
      return true;
    }
    if (authGate) { setAuthGate(null); return true; }
    if (overlay === 'preview') { closePreview(); return true; }
    if (overlay === 'editor') { closeEditor(); return true; }
    if (search) { closeSearch(); return true; }
    if (tab !== 'home') { setTab('home'); return true; }

    if (exitArmed.current) return false;       // second press within the window
    exitArmed.current = true;
    toast.show('Press back again to exit');
    setTimeout(() => { exitArmed.current = false; }, 2000);
    return true;
  }, [splash, onboard, authGate, overlay, previewFrom, search, tab]));

  /* One picker, three destinations: the poster's background, a slot the
     template defines, or a free-floating photo layer. */
  async function pickImage(target, slot) {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (res.canceled) return;
    const uri = res.assets[0].uri;
    if (target === 'background') { ed.setPhoto(uri); toast.show('Background photo set'); }
    else if (target === 'slot') { ed.fillSlot(slot.id, uri); toast.show(`${slot.label || 'Photo'} added`); }
    else { ed.add({ type: 'photo', src: uri, size: 110, y: 70 }); toast.show('Photo added — drag to position it'); }
  }

  function keepDesign() {
    setDesigns(p => [{ key: uid(), tplId: ed.tplId, name: ed.tpl.name, when: 'Saved just now' }, ...p]);
    toast.show('Saved to My Designs');
  }

  /* Preview is reachable without an account, so saving from it is gated too —
     otherwise a design would be "saved" somewhere that belongs to nobody. */
  function saveDesign() {
    if (session.signedIn) return keepDesign();
    setAuthGate({ reason: 'Sign in to save this design to your collection.', next: keepDesign });
  }

  // Hold the splash until a stored session has been read, so a returning user
  // never sees a signed-out home screen flash before their name appears.
  if (!fontsLoaded || session.restoring) return <View style={{ flex: 1, backgroundColor: C.cream }} />;

  if (splash) return <SplashScreen L={L} onDone={() => setSplash(false)} />;

  if (onboard < 3) {
    return (
      <OnboardingScreen step={onboard} onNext={() => setOnboard(onboard + 1)} onSkip={() => setOnboard(3)} />
    );
  }

  if (authGate) {
    return (
      <AuthScreen
        session={session}
        reason={authGate.reason}
        onCancel={() => setAuthGate(null)}
        onDone={user => {
          const next = authGate.next;
          setAuthGate(null);
          toast.show(`Welcome, ${(user.displayName || user.username).split(' ')[0]}`);
          // the new token refetches the catalogue on its own (token dep)
          if (next) next();
        }}
      />
    );
  }

  if (overlay === 'editor') {
    return (
      <>
        <EditorScreen
          ed={ed}
          onClose={closeEditor}
          onPreview={() => { ed.setSel(null); setPreviewFrom('editor'); setOverlay('preview'); }}
          onPickLayer={() => pickImage('layer')}
          onPickBackground={() => pickImage('background')}
          onSlotPress={slot => pickImage('slot', slot)}
        />
        <Toast text={toast.text} y={toast.y} bottom={140} />
      </>
    );
  }

  if (overlay === 'preview') {
    return (
      <>
        <PreviewScreen ed={ed} L={L} dark={darkPreview}
          onBack={closePreview} onSave={saveDesign} onToast={toast.show} />
        <Toast text={toast.text} y={toast.y} bottom={140} />
      </>
    );
  }

  if (search) {
    return (
      <SearchScreen L={L} templates={catalogue.templates} query={query} setQuery={setQuery}
        onClose={closeSearch}
        onPreview={openPreview} onEdit={openEditor} />
    );
  }

  return (
    <View style={[s.fill, { backgroundColor: C.cream }]}>
      <StatusBar barStyle="dark-content" />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 260, backgroundColor: tint, opacity: 0.55 }} />

      {tab === 'home' && (
        <HomeScreen L={L} templates={catalogue.templates} greeting={greetingFor(session.user, lang)}
          onSearch={() => setSearch(true)}
          onCategory={c => { setCat(c); catalogue.selectCategory(c); setTab('templates'); }}
          onSeeAll={() => setTab('templates')}
          onOpen={openEditor} />
      )}

      {tab === 'templates' && (
        <GalleryScreen L={L} templates={catalogue.templates} remote={catalogue.source === 'api'}
          notice={catalogue.notice} loading={catalogue.loading} onReload={catalogue.reload}
          loadingMore={catalogue.loadingMore} hasMore={catalogue.hasMore}
          totalItems={catalogue.totalItems} onLoadMore={catalogue.loadMore}
          cat={cat} setCat={c => { setCat(c); catalogue.selectCategory(c); }}
          onSearch={() => setSearch(true)} onPreview={openPreview} onEdit={openEditor} />
      )}

      {tab === 'designs' && (
        <DesignsScreen L={L} templates={catalogue.templates} designs={designs} onEdit={openEditor} onReshare={openPreview} />
      )}

      {tab === 'profile' && (
        <ProfileScreen L={L} designs={designs}
          user={session.user} initials={initialsFor(session.user)}
          onSignIn={() => setAuthGate({ reason: 'Sign in to sync your designs across devices.' })}
          onSignOut={() => { session.signOut(); toast.show('Signed out'); }}
          lang={lang} setLang={setLang}
          theme={theme} setTheme={setTheme}
          darkPreview={darkPreview} setDarkPreview={setDarkPreview} />
      )}

      <BottomNav tab={tab} setTab={setTab} L={L} />
      <Toast text={toast.text} y={toast.y} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Ceremony />
    </SafeAreaProvider>
  );
}
