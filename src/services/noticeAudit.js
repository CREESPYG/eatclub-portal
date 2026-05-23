import { ref as dbRef, push, set, serverTimestamp } from 'firebase/database';
import { db } from '../firebase';

export function logNoticeAction({ action, noticeId, by, uid, changes }) {
  const auditRef = push(dbRef(db, `noticeAudit/${noticeId}`));
  const entry = {
    action,
    by: by || 'unknown',
    uid: uid || 'unknown',
    timestamp: serverTimestamp(),
    changes: changes || null,
  };
  set(auditRef, entry).catch(() => {});
  return entry;
}

export async function getNoticeAuditLog(noticeId) {
  const { get, ref } = await import('firebase/database');
  const snap = await get(ref(db, `noticeAudit/${noticeId}`));
  if (!snap.exists()) return [];
  const data = snap.val();
  return Object.entries(data)
    .map(([id, entry]) => ({ id, ...entry }))
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
}
