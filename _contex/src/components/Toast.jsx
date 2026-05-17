
export default function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type === 'success' ? 'success' : ''}`}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            {t.type === 'success' ? 'check_circle' : 'info'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
