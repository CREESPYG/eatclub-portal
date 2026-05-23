import { useUpdates } from '../../context/UpdatesContext';

export default function ChangeIndicator({ timestamp, label, onView }) {
  if (!timestamp) return null;

  const isRecent = (Date.now() - timestamp) < 86400000; // within 24h

  if (!isRecent) return null;

  return (
    <span
      className="change-indicator"
      title={label || 'Recently updated'}
      onClick={onView}
      role="status"
      aria-label={label || 'Recently updated'}
    >
      <span className="change-indicator-dot" aria-hidden="true" />
      <span className="change-indicator-label">{label || 'Updated'}</span>
    </span>
  );
}

export function ChangeDot({ timestamp, size = 8 }) {
  if (!timestamp) return null;

  const isRecent = (Date.now() - timestamp) < 86400000;

  if (!isRecent) return null;

  return (
    <span
      className="change-dot"
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      aria-label="Recently updated"
      role="status"
    />
  );
}
