import { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import { ref as dbRef, onValue, push, set } from 'firebase/database';

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getActionIcon(action) {
  if (action.startsWith('user.')) return 'person';
  if (action.startsWith('notice.')) return 'campaign';
  if (action.startsWith('content.')) return 'edit_note';
  if (action.startsWith('role.')) return 'admin_panel_settings';
  return 'history';
}

function getActionColor(action) {
  if (action.includes('.create')) return '#4CAF50';
  if (action.includes('.update') || action.includes('.edit')) return '#2196F3';
  if (action.includes('.delete') || action.includes('.remove')) return '#E91E63';
  return '#9E9E9E';
}

export const ACTION_CATEGORIES = [
  { value: 'all', label: 'All Actions' },
  { value: 'user', label: 'User Actions' },
  { value: 'notice', label: 'Notice Actions' },
  { value: 'content', label: 'Content Actions' },
  { value: 'role', label: 'Role Actions' },
];

export function useAdminLog(user, adminUid) {
  const logAction = useCallback((entry) => {
    if (!adminUid) return;
    try {
      const id = push(dbRef(db, 'adminLog')).key;
      const logEntry = {
        ...entry,
        performedBy: adminUid,
        performedByEmail: user?.email || localStorage.getItem('eatclub_agent_email') || '',
        timestamp: Date.now(),
      };
      set(dbRef(db, 'adminLog/' + id), logEntry).catch(() => {});
    } catch (e) {
      // silent fail for audit log
    }
  }, [adminUid, user]);

  return logAction;
}

export default function ActivityLog({ user }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    const ref = dbRef(db, 'adminLog');
    const unsub = onValue(ref, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setLogs(list);
      } else {
        setLogs([]);
      }
    });
    return () => unsub();
  }, []);

  let filtered = logs;
  if (filter !== 'all') {
    filtered = filtered.filter((l) => l.action && l.action.startsWith(filter + '.'));
  }

  const displayed = filtered.slice(0, limit);

  return (
    <div>
      <div className="admin-flex-row" style={{ marginBottom: 16, justifyContent: 'space-between' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--md-on-surface)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)', fontSize: 18 }}>history</span>
          Activity Log
          <span className="admin-badge" style={{ background: 'rgba(var(--md-primary-rgb), 0.08)', color: 'var(--md-primary)', fontSize: 10 }}>
            {logs.length} entries
          </span>
        </div>
      </div>

      <div className="admin-section" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {ACTION_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={'admin-tab' + (filter === cat.value ? ' active' : '')}
              style={{ padding: '6px 14px', fontSize: 11 }}
              onClick={() => setFilter(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-section" style={{ padding: 0, overflow: 'hidden' }}>
        {displayed.length === 0 ? (
          <div className="admin-empty-state">
            {logs.length === 0 ? 'No activity recorded yet. Admin actions will appear here.' : 'No entries match this filter.'}
          </div>
        ) : (
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            {displayed.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '10px 16px',
                  borderBottom: '1px solid var(--md-outline)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: getActionColor(log.action) + '18',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: getActionColor(log.action) }}>
                    {getActionIcon(log.action)}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--md-on-surface)' }}>
                      {log.description || log.action}
                    </span>
                    <span className="admin-badge" style={{ background: getActionColor(log.action) + '18', color: getActionColor(log.action), fontSize: 9, padding: '1px 6px' }}>
                      {log.action}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--md-on-surface-var)', marginTop: 2 }}>
                    By {log.performedByEmail || 'Unknown'} &middot; {formatTime(log.timestamp)}
                    {log.details && Object.keys(log.details).length > 0 && (
                      <span> &middot; <code style={{ fontSize: 9, background: 'var(--md-surface-variant)', padding: '1px 4px', borderRadius: 3 }}>{JSON.stringify(log.details).slice(0, 60)}</code></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {displayed.length < filtered.length && (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button className="admin-btn admin-btn-outline" onClick={() => setLimit(limit + 50)}>
            Show {Math.min(50, filtered.length - displayed.length)} more
          </button>
        </div>
      )}
    </div>
  );
}
