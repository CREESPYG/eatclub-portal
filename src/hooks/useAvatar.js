import { useState, useEffect, useCallback } from 'react';

const AVATAR_CHANGE_EVENT = 'eatclub-avatar-change';

function readAvatar() {
  try {
    const raw = localStorage.getItem('eatclub_avatar');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readPhotoURL() {
  try {
    const user = localStorage.getItem('eatclub_google_user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.photoURL) return parsed.photoURL;
    }
  } catch {}
  return null;
}

function readName() {
  return localStorage.getItem('eatclub_agent_name') || '';
}

export function useAvatar() {
  const [avatar, setAvatar] = useState(readAvatar);
  const [photoURL, setPhotoURL] = useState(readPhotoURL);
  const [name, setName] = useState(readName);

  const refresh = useCallback(() => {
    setAvatar(readAvatar());
    setPhotoURL(readPhotoURL());
    setName(readName());
  }, []);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener(AVATAR_CHANGE_EVENT, handler);
    window.addEventListener('storage', (e) => {
      if (
        e.key === 'eatclub_avatar' ||
        e.key === 'eatclub_google_user' ||
        e.key === 'eatclub_agent_name'
      ) {
        refresh();
      }
    });
    return () => window.removeEventListener(AVATAR_CHANGE_EVENT, handler);
  }, [refresh]);

  return { avatar, photoURL, name, refresh };
}

export function notifyAvatarChange() {
  window.dispatchEvent(new CustomEvent(AVATAR_CHANGE_EVENT));
}

export const AVATAR_EMOJIS = ['🎮','👨‍💻','👩‍💻','😎','🚀','🌟','💪','🎯','🔥','💎','🧠','🌈'];

export const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,var(--md-primary),#FF8F00)',
  'linear-gradient(135deg,#E91E63,#9C27B0)',
  'linear-gradient(135deg,#2196F3,#00BCD4)',
  'linear-gradient(135deg,#4CAF50,#8BC34A)',
  'linear-gradient(135deg,#FF5722,#FF9800)',
  'linear-gradient(135deg,#673AB7,#3F51B5)',
  'linear-gradient(135deg,#607D8B,#37474F)',
  'linear-gradient(135deg,#795548,#A1887F)',
];

export function getUserColor(name) {
  if (!name) return 'var(--md-primary)';
  const colors = ['#FF5722','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFC107','#FF9800','#795548'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function resolveAvatar(avatar, photoURL, name) {
  if (avatar?.type === 'emoji') {
    return { mode: 'emoji', value: avatar.value, bg: avatar.bg || AVATAR_GRADIENTS[0] };
  }
  if (avatar?.type === 'google' && photoURL) {
    return { mode: 'image', value: photoURL, bg: undefined };
  }
  if (photoURL && (!avatar || avatar.type === 'letter')) {
    return { mode: 'image', value: photoURL, bg: undefined };
  }
  return { mode: 'letter', value: (name || '?').charAt(0).toUpperCase(), bg: avatar?.bg || AVATAR_GRADIENTS[0] };
}
