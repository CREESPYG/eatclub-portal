import { useState } from 'react';
import { useUpdates } from '../../context/UpdatesContext';

const ACTION_ICONS = {
  'user.role.update': 'manage_accounts',
  'user.delete': 'person_remove',
  'notice.create': 'campaign',
  'notice.update': 'edit_notifications',
  'notice.delete': 'notifications_off',
  'content.create': 'note_add',
  'content.edit': 'edit_note',
  'content.delete': 'delete_sweep',
  'role.permissions.update': 'admin_panel_settings',
  'role.create': 'add_moderator',
  'role.delete': 'remove_moderator',
};

const ACTION_COLORS = {
  'user.role.update': '#2196F3',
  'user.delete': '#E91E63',
  'notice.create': '#4CAF50',
  'notice.update': '#FF9800',
  'notice.delete': '#E91E63',
  'content.create': '#4CAF50',
  'content.edit': '#2196F3',
  'content.delete': '#E91E63',
  'role.permissions.update': '#9C27B0',
  'role.create': '#4CAF50',
  'role.delete': '#E91E63',
};

function getIcon(action) {
  return ACTION_ICONS[action] || 'history';
}

function getColor(action) {
  return ACTION_COLORS[action] || '#9E9E9E';
}

export default function ActivityFeed({ user }) {
  const { entries, unreadCount, loading, markAllRead } = useUpdates();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'user', label: 'Users' },
    { value: 'notice', label: 'Notices' },
    { value: 'content', label: 'Content' },
    { value: 'role', label: 'Roles' },
  ];

  let filtered = entries;
  if (filter !== 'all') {
    filtered = filtered.filter((e) => e.action && e.action.startsWith(filter + '.'));
  }

  return (
    <>
      <button
        className="activity-feed-toggle"
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllRead(); }}
        aria-label={'Activity feed' + (unreadCount > 0 ? ', ' + unreadCount + ' unread' : '')}
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
        {unreadCount > 0 && (
          <span className="activity-feed-badge" aria-hidden="true">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="activity-feed-overlay" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="activity-feed-panel" role="dialog" aria-label="Activity feed" aria-modal="true">
            <div className="activity-feed-header">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--md-primary)' }}>history</span>
              <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--md-on-surface)' }}>Activity</span>
              {loading && <span style={{ fontSize: 10, color: 'var(--md-on-surface-var)' }}>Loading...</span>}
              <button
                className="activity-feed-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close activity feed"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            </div>

            <div className="activity-feed-filters">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={'activity-feed-filter' + (filter === cat.value ? ' active' : '')}
                  onClick={() => setFilter(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="activity-feed-list">
              {filtered.length === 0 ? (
                <div className="activity-feed-empty">
                  <span className="material-symbols-outlined" style={{ fontSize: 28, opacity: 0.3, marginBottom: 8 }}>history</span>
                  <span>No activity yet</span>
                </div>
              ) : (
                filtered.map((entry) => (
                  <div key={entry.id} className="activity-feed-entry">
                    <div
                      className="activity-feed-entry-icon"
                      style={{ background: getColor(entry.action) + '18', color: getColor(entry.action) }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{getIcon(entry.action)}</span>
                    </div>
                    <div className="activity-feed-entry-body">
                      <div className="activity-feed-entry-text">
                        {entry.description || entry.action}
                      </div>
                      <div className="activity-feed-entry-meta">
                        By {entry.performedByEmail || entry.performedBy || 'Unknown'}
                        {' \u00B7 '}
                        {entry.timestamp ? formatTime(entry.timestamp) : ''}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

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
