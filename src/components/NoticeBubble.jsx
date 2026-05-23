import NoticeContent from './NoticeContent';
import UserAvatar from './UserAvatar';
import { getUserColor } from '../hooks/useAvatar';

const PRIORITY_CFG = {
  low: { color: '#4CAF50', label: 'Low' },
  normal: { color: '#2196F3', label: 'Normal' },
  high: { color: '#FF9800', label: 'High' },
  urgent: { color: '#E91E63', label: 'Urgent' },
};

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 172800000) return `Yesterday ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDateSeparator(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today - 86400000);
  const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (dDate.getTime() === today.getTime()) return 'Today';
  if (dDate.getTime() === yesterday.getTime()) return 'Yesterday';
  if (now - d < 604800000) return d.toLocaleDateString([], { weekday: 'long' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
}

function shouldShowDateSeparator(currentTs, prevTs) {
  if (!prevTs) return true;
  const curr = new Date(currentTs);
  const prev = new Date(prevTs);
  return (
    curr.getFullYear() !== prev.getFullYear() ||
    curr.getMonth() !== prev.getMonth() ||
    curr.getDate() !== prev.getDate()
  );
}

export function getDateSeparators(notices) {
  const seps = [];
  let prevTs = null;
  for (let i = 0; i < notices.length; i++) {
    const ts = notices[i].createdAt || notices[i].updatedAt || Date.now();
    if (shouldShowDateSeparator(ts, prevTs)) {
      seps.push({ index: i, label: formatDateSeparator(ts) });
    }
    prevTs = ts;
  }
  return seps;
}

export default function NoticeBubble({
  notice,
  users = [],
  isAdmin,
  currentUserId,
  onEdit,
  onDelete,
  onPin,
  onAcknowledge,
  ackAnim,
}) {
  const {
    title,
    body,
    priority = 'normal',
    target = 'all',
    colorCard,
    pinnedBy,
    createdAt,
    updatedAt,
    edited,
    createdBy,
    createdByUid,
    createdByName,
    createdByPhotoURL,
    readBy,
  } = notice;

  const pcfg = PRIORITY_CFG[priority] || PRIORITY_CFG.normal;
  const isEdited = edited || (updatedAt && updatedAt > createdAt);
  const isRead = readBy && currentUserId && readBy[currentUserId];

  const senderUser = users.find((u) => u.id === createdByUid) || users.find((u) => u.email === createdBy);
  const senderName = createdByName || senderUser?.name || senderUser?.displayName || (createdBy || '').split('@')[0] || 'Admin';
  const senderPhoto = createdByPhotoURL || senderUser?.photoURL || '';

  const bubbleBg = colorCard || pcfg.color;
  const tailColor = colorCard || pcfg.color;

  return (
    <div className="notice-bubble-wrapper">
      <div
        className={`notice-bubble ${pinnedBy?.[currentUserId] ? 'notice-pinned' : ''}`}
        style={{
          borderLeft: `3px solid ${bubbleBg}`,
        }}
      >
        <div className="notice-bubble-header">
          <div className="notice-bubble-sender">
            <UserAvatar
              size="xs"
              name={senderName}
              photoURL={senderPhoto}
              style={{ width: 18, height: 18, fontSize: 7 }}
            />
            <span className="notice-sender-name">{senderName}</span>
            {pinnedBy?.[currentUserId] && (
              <span className="notice-pin-badge" title="Pinned notice">
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>keep</span>
              </span>
            )}
          </div>
          <div className="notice-bubble-meta">
            <span
              className="notice-priority-dot"
              style={{ background: pcfg.color }}
              title={pcfg.label}
            />
            {target !== 'all' && (
              <span className="notice-target-badge">{target}</span>
            )}
          </div>
        </div>

        <div className="notice-bubble-title">{title}</div>

        <div className="notice-bubble-body">
          <NoticeContent body={body} />
        </div>

        <div className="notice-bubble-footer">
          <span className="notice-timestamp">{formatTime(createdAt)}</span>
          {isEdited && <span className="notice-edited-label">· Edited</span>}
          {onPin && (
            <button
              type="button"
              className="notice-action-btn notice-pin-btn"
              onClick={(e) => { e.stopPropagation(); onPin(notice); }}
              title={pinnedBy?.[currentUserId] ? 'Unpin' : 'Pin notice'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                {pinnedBy?.[currentUserId] ? 'keep_off' : 'keep'}
              </span>
            </button>
          )}
          {!isAdmin && onAcknowledge && !isRead && (
            <button
              type="button"
              className={`notice-action-btn notice-ack-btn${ackAnim === notice.id ? ' anim-ack' : ''}`}
              onClick={(e) => { e.stopPropagation(); onAcknowledge(notice); }}
              title="Acknowledge this notice"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>check_circle</span>
              <span style={{ fontSize: 9, fontWeight: 800 }}>ACK</span>
            </button>
          )}
          {!isAdmin && isRead && (
            <span className={`notice-read-status read`} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#4CAF50' }}>check_circle</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#4CAF50' }}>Read</span>
            </span>
          )}
        </div>

        {isAdmin && (
          <div className="notice-admin-actions">
            {onEdit && (
              <button
                type="button"
                className="notice-action-btn"
                onClick={(e) => { e.stopPropagation(); onEdit(notice); }}
                title="Edit notice"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="notice-action-btn notice-action-delete"
                onClick={(e) => { e.stopPropagation(); onDelete(notice); }}
                title="Delete notice"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
