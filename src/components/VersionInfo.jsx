/*
  📦 Version Info Component
  ───────────────────────────
  Shows current version and changelog access
*/

export const CURRENT_VERSION = 'v1.0.0';
export const VERSION_DATE = '2025-05-17';
export const VERSION_NOTES = [
  '🎬 Enhanced entry animation with food themes',
  '🎨 10 color themes + custom picker',
  '🔤 8 font options with live preview',
  '⚡ 4 animation speed options',
  '📦 Version backup system added',
];

export default function VersionInfo({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="version-overlay" onClick={onClose}>
      <div className="version-card" onClick={e => e.stopPropagation()}>
        <div className="version-header">
          <h2>📦 Version Info</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="version-content">
          <div className="version-badge">
            <span className="version-number">{CURRENT_VERSION}</span>
            <span className="version-date">{VERSION_DATE}</span>
          </div>

          <div className="version-notes">
            <h3>What's New:</h3>
            <ul>
              {VERSION_NOTES.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="version-known-issues">
            <h3>⚠️ Known Issues:</h3>
            <ul>
              <li>Some old pages may have compatibility issues</li>
              <li>Animation speed may not work on all animations</li>
              <li>Font sync may take time on some pages</li>
            </ul>
          </div>

          <div className="version-backup-section">
            <h3>💾 Backup History</h3>
            <p>Check <code>src/_versions/</code> folder for backups</p>
          </div>
        </div>
      </div>
    </div>
  );
}