import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../firebase';
import { ref as dbRef, onValue, push, set, remove, update } from 'firebase/database';
import { logNoticeAction } from '../services/noticeAudit';

const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#4CAF50' },
  { value: 'normal', label: 'Normal', color: '#2196F3' },
  { value: 'high', label: 'High', color: '#FF9800' },
  { value: 'urgent', label: 'Urgent', color: '#E91E63' },
];

const COLOR_PALETTE = [
  { key: 'blue', hex: '#2196F3', label: 'Blue' },
  { key: 'emerald', hex: '#4CAF50', label: 'Emerald' },
  { key: 'sunset', hex: '#FF9800', label: 'Sunset' },
  { key: 'rose', hex: '#E91E63', label: 'Rose' },
  { key: 'violet', hex: '#9C27B0', label: 'Violet' },
  { key: 'teal', hex: '#009688', label: 'Teal' },
  { key: 'slate', hex: '#607D8B', label: 'Slate' },
  { key: 'warm', hex: '#795548', label: 'Warm' },
  { key: 'indigo', hex: '#3F51B5', label: 'Indigo' },
  { key: 'cyan', hex: '#00BCD4', label: 'Cyan' },
];

export { PRIORITIES, COLOR_PALETTE };

export function useNotices(userEmail, uid, userName, userPhotoURL) {
  const [notices, setNotices] = useState([]);
  const [users, setUsers] = useState([]);

  const noticesRef = useRef([]);
  const usersRef = useRef([]);

  useEffect(() => {
    const unsubN = onValue(dbRef(db, 'notices'), (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) => (b.pinnedBy && Object.keys(b.pinnedBy).length ? 1 : 0) - (a.pinnedBy && Object.keys(a.pinnedBy).length ? 1 : 0) || (b.createdAt || 0) - (a.createdAt || 0));
        noticesRef.current = list;
        setNotices(list);
      } else { noticesRef.current = []; setNotices([]); }
    });
    const unsubU = onValue(dbRef(db, 'users'), (snap) => {
      const data = snap.val();
      if (data) { const u = Object.entries(data).map(([id, val]) => ({ id, ...val })); usersRef.current = u; setUsers(u); }
    });
    return () => { unsubN(); unsubU(); };
  }, []);

  const saveNotice = useCallback(async (form, editingId) => {
    if (!form.title.trim()) throw new Error('Title is required.');
    const colorCard = /^#[0-9A-Fa-f]{6}$/.test(form.colorCard) ? form.colorCard : '';
    const now = Date.now();

    if (editingId) {
      await update(dbRef(db, `notices/${editingId}`), {
        title: form.title.trim(),
        body: form.body.trim(),
        priority: form.priority,
        target: form.target,
        colorCard,
        updatedAt: now,
        edited: true,
      });
      logNoticeAction({ action: 'edit', noticeId: editingId, by: userEmail, uid });
    } else {
      const id = push(dbRef(db, 'notices')).key;
      const notice = {
        title: form.title.trim(),
        body: form.body.trim(),
        priority: form.priority,
        target: form.target,
        colorCard,
        active: true,
        pinnedBy: {},
        createdBy: userEmail,
        createdByUid: uid,
        createdByName: userName,
        createdByPhotoURL: userPhotoURL,
        createdAt: now,
        updatedAt: now,
        edited: false,
        readBy: {},
      };
      await set(dbRef(db, `notices/${id}`), notice);
      logNoticeAction({ action: 'create', noticeId: id, by: userEmail, uid });
    }
  }, [userEmail, uid, userName, userPhotoURL]);

  const togglePin = useCallback((notice) => {
    const pinnedBy = { ...(notice.pinnedBy || {}) };
    if (pinnedBy[uid]) {
      delete pinnedBy[uid];
    } else {
      pinnedBy[uid] = Date.now();
    }
    update(dbRef(db, `notices/${notice.id}`), { pinnedBy, updatedAt: Date.now() })
      .then(() => logNoticeAction({ action: pinnedBy[uid] ? 'pin' : 'unpin', noticeId: notice.id, by: userEmail, uid }));
  }, [userEmail, uid]);

  const toggleArchive = useCallback((notice) => {
    const nextActive = !(notice.active === false);
    update(dbRef(db, `notices/${notice.id}`), { active: nextActive, updatedAt: Date.now() })
      .then(() => logNoticeAction({ action: nextActive ? 'restore' : 'archive', noticeId: notice.id, by: userEmail, uid }));
  }, [userEmail, uid]);

  const deleteNotice = useCallback((notice) => {
    if (!confirm('Delete this notice permanently?')) return;
    remove(dbRef(db, `notices/${notice.id}`))
      .then(() => logNoticeAction({ action: 'delete', noticeId: notice.id, by: userEmail, uid }));
  }, [userEmail, uid]);

  const getReadCount = useCallback((notice) => {
    if (!notice.readBy) return 0;
    return Object.keys(notice.readBy).length;
  }, []);

  const filtered = ({ feedFilter }) => {
    const pinned = notices.filter((n) => n.pinnedBy && Object.keys(n.pinnedBy).length > 0 && n.active !== false);
    const active = notices.filter((n) => (!n.pinnedBy || Object.keys(n.pinnedBy).length === 0) && n.active !== false);
    const inactive = notices.filter((n) => n.active === false);
    if (feedFilter === 'pinned') return pinned;
    if (feedFilter === 'active') return active;
    if (feedFilter === 'inactive') return inactive;
    return notices;
  };

  return {
    notices, users, PRIORITIES, COLOR_PALETTE,
    saveNotice, togglePin, toggleArchive, deleteNotice, getReadCount, filtered,
  };
}
