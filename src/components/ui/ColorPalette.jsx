const COLORS = [
  { key: 'blue', hex: '#2196F3', label: 'Blue' },
  { key: 'emerald', hex: '#4CAF50', label: 'Emerald' },
  { key: 'sunset', hex: '#FF9800', label: 'Sunset' },
  { key: 'rose', hex: '#E91E63', label: 'Rose' },
  { key: 'violet', hex: '#9C27B0', label: 'Violet' },
  { key: 'teal', hex: '#009688', label: 'Teal' },
  { key: 'slate', hex: '#607D8B', label: 'Slate' },
  { key: 'warm', hex: '#795548', label: 'Warm' },
  { key: 'indigo', hex: '#3F51B5', label: 'Indigo' },
  { key: 'cyan', hex: '#00BCD4', label: 'Cyan' },
];

export default function ColorPalette({ selected, onChange }) {
  return (
    <div className="nb-editor-color-grid">
      <button
        className="clear-btn"
        onClick={() => onChange('')}
        aria-label="No color (default)"
        title="Default"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--md-on-surface-var)' }}>close</span>
      </button>
      {COLORS.map((c) => {
        const sel = selected === c.hex;
        return (
          <button
            key={c.key}
            onClick={() => onChange(c.hex)}
            aria-label={c.label}
            aria-pressed={sel}
            title={c.label}
            style={{
              background: c.hex,
              border: sel ? '3px solid var(--md-on-surface)' : '3px solid transparent',
              boxShadow: sel ? '0 0 0 2px var(--md-surface)' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
