import { Share } from 'react-native';

/* The poster and the message that travels with it are built from the same
   layers: every seeded element carries a `role`, so whatever the user edits on
   the canvas is what goes out in the caption. */

const byRole = (els, role) => {
  const el = els.find(e => e.role === role && e.type === 'text');
  const t = el && el.text ? el.text.trim() : '';
  return t;
};

/* Per-occasion copy. Each entry supplies the opening line, the invitation
   sentence, the heading above the details and the closing. */
const COPY = {
  Marriage: {
    open: '💞 Two Hearts, One Beautiful Journey – A Lifetime of Love Begins Here. 💞',
    invite: '👩‍❤️‍👨 Together with our families, We cordially invite you to grace our Wedding Reception 💍 and bless us with your love, presence & warm wishes. 🫶',
    heading: '💖 Reception Ceremony',
    close: '💜 We look forward to celebrating this beautiful beginning of our new journey with you. ❤️',
    signoff: '❤️‍🔥 With Love & Regards,',
  },
  Anniversary: {
    open: '💞 Years Together, Still Counting – A Love Worth Celebrating. 💞',
    invite: '🥂 Together with our families, We warmly invite you to join our Anniversary Celebration 💐 and share in our joy.',
    heading: '💖 Anniversary Celebration',
    close: '💜 It would mean the world to have you with us on this special day. ❤️',
    signoff: '❤️ With Love & Regards,',
  },
  Birthday: {
    open: '🎉 Another Year, Another Reason to Celebrate! 🎂',
    invite: '🥳 We would love for you to join us for an evening of cake, music and good company. 🎈',
    heading: '🎂 Birthday Celebration',
    close: '💫 Come make this day even more special with your presence. 🎁',
    signoff: '🎈 With Love,',
  },
  'Baby Shower': {
    open: '🍼 A Little One Is On The Way – Come Shower Them With Love! 🌸',
    invite: '👶 Together with our families, We joyfully invite you to our Baby Shower 🎀 and ask for your blessings.',
    heading: '🌸 Baby Shower',
    close: '💕 We can’t wait to celebrate this new chapter with you. 🤍',
    signoff: '🤍 With Love & Regards,',
  },
};

/* Names for the sign-off, reversed so the invitation reads as the couple would
   sign it rather than as the poster titles them, falling back to whichever
   single line exists. */
const signNames = (a, b) => (a && b ? `${b} & ${a}` : a || b || '');

export function buildCaption({ tpl, els, maps }) {
  const copy = COPY[tpl.cat] || COPY.Marriage;
  const names = byRole(els, 'names');
  const names2 = byRole(els, 'names2');
  const date = byRole(els, 'date');
  const time = byRole(els, 'time');
  const venue = byRole(els, 'venue');
  const address = byRole(els, 'address');
  const link = (maps || tpl.maps || '').trim();

  const lines = [copy.open, '', copy.invite, '', copy.heading];
  if (date) lines.push(`🗓️ ${date}`);
  if (time) lines.push(`⏰ ${time}`);
  if (venue) lines.push(`📍 ${venue}`);
  if (address) lines.push(address);
  if (link) lines.push('', `🌍 Location: ${link}`);
  lines.push('', copy.close, '', copy.signoff, `${signNames(names, names2)} 👩‍❤️‍👨`);

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/* Hands the caption to the OS share sheet — WhatsApp, Instagram, mail, etc.
   Resolves to the action the user took so the caller can report it honestly. */
export async function shareInvite({ tpl, els, maps, title }) {
  const message = buildCaption({ tpl, els, maps });
  try {
    const res = await Share.share({ message, title: title || tpl.name });
    return res.action === Share.dismissedAction ? 'dismissed' : 'shared';
  } catch (e) {
    return 'failed';
  }
}
