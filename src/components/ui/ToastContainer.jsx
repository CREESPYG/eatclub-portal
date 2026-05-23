import { useToast } from '../../context/ToastContext';

const ICONS = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const COLORS = {
  success: '#4CAF50',
  error: '#E91E63',
  warning: '#FF9800',
  info: '#2196F3',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-global-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-global"
          style={{
            borderLeft: '4px solid ' + COLORS[t.type] || COLORS.info,
          }}
          role="alert"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: COLORS[t.type] || COLORS.info }}>
            {ICONS[t.type] || ICONS.info}
          </span>
          <span className="toast-global-message">{t.message}</span>
          {t.action && (
            <button
              className="toast-global-action"
              onClick={() => { t.action.onClick(); removeToast(t.id); }}
            >
              {t.action.label}
            </button>
          )}
          {t.dismissible && (
            <button
              className="toast-global-dismiss"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
