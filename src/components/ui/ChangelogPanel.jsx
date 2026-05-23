import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref as dbRef, onValue } from 'firebase/database';

export { CURRENT_VERSION, VERSION_DATE, VERSION_NOTES } from '../VersionInfo';

export default function ChangelogPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [changelogEntries, setChangelogEntries] = useState([]);
  const [updatedCount, setUpdatedCount] = useState(0);

  useEffect(() => {
    const ref = dbRef(db, 'changelog');
    const unsub = onValue(ref, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) => (b.releasedAt || 0) - (a.releasedAt || 0));
        setChangelogEntries(list);
      }
    });
    return () => unsub();
  }, []);

  const hasUpdates = changelogEntries.length > 0;

  return (
    <>
      <button
        className="changelog-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View changelog and updates"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>new_releases</span>
        {hasUpdates && <span className="changelog-dot" aria-hidden="true" />}
      </button>

      {isOpen && (
        <>
          <div className="changelog-overlay" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="changelog-panel" role="dialog" aria-label="Changelog" aria-modal="true">
            <div className="changelog-header">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--md-primary)' }}>new_releases</span>
              <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--md-on-surface)' }}>What's New</span>
              <button className="changelog-close" onClick={() => setIsOpen(false)} aria-label="Close changelog">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            </div>

            <div className="changelog-list">
              {changelogEntries.length === 0 ? (
                <div className="changelog-empty">
                  <span className="material-symbols-outlined" style={{ fontSize: 28, opacity: 0.3, marginBottom: 8 }}>new_releases</span>
                  <span>No updates yet</span>
                </div>
              ) : (
                changelogEntries.map((entry) => (
                  <div key={entry.id} className="changelog-entry">
                    <div className="changelog-entry-version">{entry.version || 'v1.0.0'}</div>
                    <div className="changelog-entry-date">
                      {entry.releasedAt ? new Date(entry.releasedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                    </div>
                    <ul className="changelog-entry-list">
                      {(entry.notes || entry.changes || []).map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                      {!entry.notes && !entry.changes && (
                        <li style={{ opacity: 0.5, fontStyle: 'italic' }}>No details provided</li>
                      )}
                    </ul>
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
