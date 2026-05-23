import NoticeBubble, { getDateSeparators } from '../NoticeBubble';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pinned', label: 'Pinned' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Archived' },
];

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
              <div className="notice-read-count">
                Read by {getReadCount(notice)}/{users.length} users
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
