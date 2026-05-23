import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { db } from '../../firebase';
import { ref as dbRef, onValue } from 'firebase/database';

const UpdatesContext = createContext(null);

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function UpdatesProvider({ children, maxEntries = 100 }) {
  const [entries, setEntries] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const lastReadRef = useRef(Date.now());
  const isFirstLoad = useRef(true);

  // Listen to Firebase adminLog
  useEffect(() => {
    const ref = dbRef(db, 'adminLog');
    const unsub = onValue(ref, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]) => ({ id, ...val }))
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
          .slice(0, maxEntries);
        setEntries(list);

        if (isFirstLoad.current) {
          lastReadRef.current = Date.now();
          isFirstLoad.current = false;
          setUnreadCount(0);
        } else {
          const newUnread = list.filter((e) => (e.timestamp || 0) > lastReadRef.current).length;
          setUnreadCount((prev) => prev + newUnread);
        }
      } else {
        setEntries([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [maxEntries]);

  const addLocalEntry = useCallback((entry) => {
    const localEntry = {
      id: 'local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      action: entry.action || 'generic',
      description: entry.description || '',
      performedBy: entry.performedBy || 'You',
      timestamp: Date.now(),
      _local: true,
    };
    setEntries((prev) => [localEntry, ...prev].slice(0, maxEntries));
    setUnreadCount((prev) => prev + 1);
  }, [maxEntries]);

  const markAllRead = useCallback(() => {
    lastReadRef.current = Date.now();
    setUnreadCount(0);
  }, []);

  const markEntryRead = useCallback((entryId) => {
    const entry = entries.find((e) => e.id === entryId);
    if (entry && (entry.timestamp || 0) > lastReadRef.current) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, [entries]);

  return (
    <UpdatesContext.Provider value={{ entries, unreadCount, loading, addLocalEntry, markAllRead, markEntryRead, formatTime }}>
      {children}
    </UpdatesContext.Provider>
  );
}

export function useUpdates() {
  const ctx = useContext(UpdatesContext);
  if (!ctx) throw new Error('useUpdates must be used within an UpdatesProvider');
  return ctx;
}
