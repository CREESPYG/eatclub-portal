import { db } from '../firebase';
import { ref as dbRef, push, set, onValue, off, update, remove, serverTimestamp, orderByChild, limitToLast, query } from 'firebase/database';

// ─────────── HELPERS ───────────

export function getConversationId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

function now() {
  return Date.now();
}

function safeGet(lsKey, fallback) {
  try { return JSON.parse(localStorage.getItem(lsKey)); } catch { return fallback; }
}
// ─────────── TEAM CHAT ───────────

export function sendTeamMessage({ text, userName, userId }) {
  if (!text?.trim()) return Promise.reject(new Error('Empty message'));
  const msg = {
    id: now() + '_' + Math.random().toString(36).substr(2, 6),
    user: userName || 'Unknown',
    userId: userId || '',
    text: text.trim(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: now(),
    status: 'sent',
  };
  return push(dbRef(db, 'chats'), msg).then(() => msg).catch(err => {
    console.error('sendTeamMessage error:', err);
    throw err;
  });
}

export function pinTeamMessage(fbId, isPinned) {
  if (!fbId) return Promise.reject(new Error('No message ID provided'));
  return update(dbRef(db, `chats/${fbId}`), { pinned: isPinned }).catch(() => null);
}

export function listenTeamChat(onMessages, onError) {
  const ref = dbRef(db, 'chats');
  const cb = onValue(ref, snapshot => {
    const data = snapshot.val();
    if (!data) { onMessages([]); return; }
    const nowMs = Date.now();
    const list = Object.entries(data)
      .map(([id, val]) => ({ fbId: id, ...val }))
      .filter(m => m.pinned || (nowMs - (m.timestamp || 0) < 24 * 60 * 60 * 1000))
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
      .slice(-100);
    onMessages(list);
  }, err => {
    console.error('listenTeamChat error:', err);
    onError?.(err);
  });
  return () => off(ref, 'value', cb);
}

// ─────────── DIRECT MESSAGES ───────────

export function ensureConversation(convId, myData, otherData) {
  const metaRef = dbRef(db, `conversations/${convId}/metadata`);
  return new Promise(resolve => {
    onValue(metaRef, snap => {
      off(metaRef, 'value');
      if (snap.exists()) return resolve(snap.val());
      const meta = {
        participants: {
          [myData.id]: { name: myData.name, role: myData.role || '', photoURL: myData.photoURL || '' },
          [otherData.id]: { name: otherData.name, role: otherData.role || '', photoURL: otherData.photoURL || '' },
        },
        lastMessage: '',
        lastSender: '',
        lastActivity: now(),
        createdAt: now(),
        unreadCounts: { [myData.id]: 0, [otherData.id]: 0 },
      };
      set(metaRef, meta).then(() => resolve(meta)).catch(() => resolve(null));
    }, { onlyOnce: true });
  });
}

export function sendDirectMessage({ convId, text, senderId, senderName }) {
  if (!text?.trim()) return Promise.reject(new Error('Empty message'));
  const timestamp = now();
  const msg = {
    text: text.trim(),
    from: senderId,
    name: senderName || 'Unknown',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp,
    status: 'sent',
    readBy: {},
  };
  const msgRef = dbRef(db, `conversations/${convId}/messages`);
  const metaRef = dbRef(db, `conversations/${convId}/metadata`);

  return push(msgRef, msg).then(() => {
    update(metaRef, {
      lastMessage: text.trim(),
      lastSender: senderId,
      lastActivity: timestamp,
      [`unreadCounts/${senderId}`]: 0,
    }).catch(() => null);
    return msg;
  }).catch(err => {
    console.error('sendDirectMessage error:', err);
    throw err;
  });
}

export function listenDirectMessages(convId, onMessages, onError) {
  const ref = dbRef(db, `conversations/${convId}/messages`);
  const cb = onValue(ref, snapshot => {
    const data = snapshot.val();
    if (!data) { onMessages([]); return; }
    const list = Object.entries(data).map(([id, val]) => ({ fbId: id, ...val }))
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    onMessages(list);
  }, err => {
    console.error('listenDirectMessages error:', err);
    onError?.(err);
  });
  return () => off(ref, 'value', cb);
}

export function listenConversationMeta(convId, onMeta, onError) {
  const ref = dbRef(db, `conversations/${convId}/metadata`);
  const cb = onValue(ref, snapshot => {
    const data = snapshot.val();
    onMeta(data);
  }, err => {
    console.error('listenConversationMeta error:', err);
    onError?.(err);
  });
  return () => off(ref, 'value', cb);
}

export function markConversationRead(convId, userId) {
  if (!convId || !userId) return;
  const metaRef = dbRef(db, `conversations/${convId}/metadata`);
  update(metaRef, { [`unreadCounts/${userId}`]: 0 }).catch(() => null);

  const msgRef = dbRef(db, `conversations/${convId}/messages`);
  onValue(msgRef, snap => {
    off(msgRef, 'value');
    const data = snap.val();
    if (!data) return;
    const updates = {};
    Object.entries(data).forEach(([fbId, msg]) => {
      if (msg.from !== userId && (!msg.readBy || !msg.readBy[userId])) {
        updates[`${fbId}/status`] = 'read';
        updates[`${fbId}/readBy/${userId}`] = now();
      }
    });
    if (Object.keys(updates).length > 0) {
      update(ref, updates).catch(() => null);
    }
  }, { onlyOnce: true });
}

// ─────────── TYPING INDICATORS ───────────

const TYPING_TIMEOUT = 3000;
const typingTimeouts = {};

export function setTypingIndicator(convId, userId, isTyping) {
  if (!convId || !userId) return;
  const ref = dbRef(db, `typing/${convId}/${userId}`);
  if (isTyping) {
    set(ref, now()).catch(() => null);
    if (typingTimeouts[`${convId}_${userId}`]) clearTimeout(typingTimeouts[`${convId}_${userId}`]);
    typingTimeouts[`${convId}_${userId}`] = setTimeout(() => {
      remove(ref).catch(() => null);
    }, TYPING_TIMEOUT);
  } else {
    remove(ref).catch(() => null);
    if (typingTimeouts[`${convId}_${userId}`]) {
      clearTimeout(typingTimeouts[`${convId}_${userId}`]);
      delete typingTimeouts[`${convId}_${userId}`];
    }
  }
}

export function listenTypingIndicator(convId, otherUserId, onTyping) {
  if (!convId || !otherUserId) return () => {};
  const ref = dbRef(db, `typing/${convId}/${otherUserId}`);
  const cb = onValue(ref, snapshot => {
    onTyping(snapshot.exists());
  }, () => onTyping(false));
  return () => off(ref, 'value', cb);
}

export function listenTyping(convId, otherUserId, callback) {
  if (!convId || !otherUserId) return () => {};
  const ref = dbRef(db, `typing/${convId}/${otherUserId}`);
  const cb = onValue(ref, snapshot => {
    callback(snapshot.exists());
  }, () => callback(false));
  return () => off(ref, 'value', cb);
}

export function clearAllTyping(convId, userId) {
  if (!convId || !userId) return;
  remove(dbRef(db, `typing/${convId}/${userId}`)).catch(() => null);
}

// ─────────── CONVERSATION LIST ───────────

export function listenUserConversations(userId, onConversations, onError) {
  const convs = {};

  const ref = dbRef(db, 'conversations');
  const cb = onValue(ref, snapshot => {
    const data = snapshot.val();
    if (!data) { onConversations([]); return; }

    const list = [];
    Object.entries(data).forEach(([convId, conv]) => {
      if (!conv.metadata?.participants) return;
      if (!conv.metadata.participants[userId]) return;

      const otherId = Object.keys(conv.metadata.participants).find(id => id !== userId);
      const other = otherId ? conv.metadata.participants[otherId] : {};
      const meta = conv.metadata;
      const unread = meta.unreadCounts?.[userId] || 0;

      list.push({
        convId,
        otherUserId: otherId || '',
        otherUserName: other?.name || 'Unknown',
        otherRole: other?.role || '',
        otherPhotoURL: other?.photoURL || '',
        lastMessage: meta.lastMessage || '',
        lastSender: meta.lastSender || '',
        lastActivity: meta.lastActivity || 0,
        unreadCount: unread,
        createdAt: meta.createdAt || 0,
      });
    });

    list.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
    onConversations(list);
  }, err => {
    console.error('listenUserConversations error:', err);
    onError?.(err);
  });

  return () => off(ref, 'value', cb);
}

// ─────────── PRESENCE ───────────

export function updatePresence(memberId, data) {
  if (!memberId) return;
  set(dbRef(db, `presence/${memberId}`), data).catch(() => null);
}

export function removePresence(memberId) {
  if (!memberId) return;
  remove(dbRef(db, `presence/${memberId}`)).catch(() => null);
}

export function listenPresence(onUsers) {
  const ref = dbRef(db, 'presence');
  const cb = onValue(ref, snapshot => {
    const data = snapshot.val();
    if (!data) { onUsers([]); return; }
    const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
    onUsers(list);
  }, err => console.error('listenPresence error:', err));
  return () => off(ref, 'value', cb);
}
