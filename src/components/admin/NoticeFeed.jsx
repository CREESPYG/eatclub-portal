import { useState } from 'react';
import NoticeBubble, { getDateSeparators } from '../NoticeBubble';
import UserAvatar from '../UserAvatar';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pinned', label: 'Pinned' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Archived' },
];

function NoticeReaders({ notice, users }) {
  const [open, setOpen] = useState(false);
  const readBy = notice.readBy || {};
  const readCount = Object.keys(readBy).length;
  const pct = users.length > 0 ? Math.round((readCount / users.length) * 100) : 0;

  return (
    <div className="notice-read-count">
      <div className="notice-read-bar-wrapper" onClick={() => setOpen(!open)}>
        <div className="notice-read-bar-track">
          <div className="notice-read-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="notice-read-label">
          {readCount}/{users.length} read
          <span className="material-symbols-outlined" style={{ fontSize: 11, marginLeft: 4, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>expand_more</span>
        </span>
      </div>
      {open && (
        <div className="notice-reader-list">
          {users.length === 0 ? (
            <div className="notice-reader-item">No users in system</div>
          ) : (
            users.map((u) => {
              const uid = u.id || u.uid;
              const hasRead = uid && readBy[uid];
              return (
                <div key={uid} className={`notice-reader-item ${hasRead ? 'has-read' : ''}`}>
                  <UserAvatar
                    size={16}
                    name={u.name || u.displayName || u.email || '?'}
                    photoURL={u.photoURL || u.photoUrl || ''}
                    style={{ width: 16, height: 16, fontSize: 6 }}
                  />
                  <span className="notice-reader-name">{u.name || u.displayName || u.email || 'Unknown'}</span>
                  <span className={`notice-reader-status ${hasRead ? 'read' : 'unread'}`}>
                    {hasRead ? 'Read' : 'Unread'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function NoticeFeed({
  notices,
  feedFilter,
  onFilterChange,
  users,
  uid,
  onEdit,
  onDelete,
  onPin,
  onArchive,
  getReadCount,
}) {
  const seps = getDateSeparators(notices);
  const sepSet = new Set(seps.map((s) => s.index));

  const counts = {};
  FILTERS.forEach((f) => {
    if (f.id === 'all') counts[f.id] = notices.length;
    else if (f.id === 'pinned') counts[f.id] = notices.filter((n) => n.pinnedBy && Object.keys(n.pinnedBy).length > 0 && n.active !== false).length;
    else if (f.id === 'active') counts[f.id] = notices.filter((n) => (!n.pinnedBy || Object.keys(n.pinnedBy).length === 0) && n.active !== false).length;
    else if (f.id === 'inactive') counts[f.id] = notices.filter((n) => n.active === false).length;
  });

  return (
    <div>
      <div className="admin-nb-filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={feedFilter === f.id ? 'active' : ''}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label} ({counts[f.id]})
          </button>
        ))}
      </div>

      {notices.length === 0 ? (
        <div className="admin-nb-empty">
          <div className="material-symbols-outlined">campaign</div>
          <p>No notices found</p>
          <span>Create a new notice to get started.</span>
        </div>
      ) : (
        <div className="admin-nb-feed">
          {notices.map((notice, idx) => (
            <div key={notice.id}>
              {sepSet.has(idx) && (
                <div className="nb-date-sep" aria-hidden="true">
                  <span>{seps.find((s) => s.index === idx)?.label}</span>
                </div>
              )}
              <NoticeBubble
                notice={notice}
                users={users}
                isAdmin={true}
                currentUserId={uid}
                onEdit={onEdit}
                onDelete={onDelete}
                onPin={onPin}
                onArchive={onArchive}
              />
              <NoticeReaders notice={notice} users={users} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
