import { useState } from 'react';
import { db } from '../firebase';
import { ref as dbRef, update } from 'firebase/database';

export default function ProfileSetup({ user, onComplete, onSkip }) {
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const uid = user?.uid;
    if (!uid) return;
    setSaving(true);
    try {
      await update(dbRef(db, `users/${uid}`), { bio, role, setupComplete: true });
      localStorage.setItem('eatclub_bio', bio);
      localStorage.setItem('eatclub_role', role);
      localStorage.setItem('eatclub_profile_complete', 'true');
      onComplete({ bio, role });
    } catch (err) {
      console.error('Profile setup error:', err);
    }
    setSaving(false);
  };

  const handleSkip = () => {
    const uid = user?.uid;
    if (uid) {
      update(dbRef(db, `users/${uid}`), { setupComplete: true }).catch(() => null);
    }
    localStorage.setItem('eatclub_profile_complete', 'true');
    onSkip();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'var(--md-background)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        maxWidth: 460, width: '100%',
        background: 'var(--md-surface)',
        borderRadius: 24, padding: 36,
        border: '1px solid var(--md-outline)',
        boxShadow: '0 24px 80px rgba(0,0,0,.3)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--md-primary),#FF8F00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 28,
          }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 32 }}>person</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--md-on-surface)', margin: 0, letterSpacing: -.3 }}>
            Welcome, {user?.displayName || 'User'}!
          </h1>
          <p style={{ fontSize: 13, color: 'var(--md-on-surface-var)', marginTop: 6, lineHeight: 1.5 }}>
            Set up your profile so your team can know you better.<br />
            You can always update this later.
          </p>
        </div>

        {/* Email (read-only) */}
        <div style={{
          padding: '12px 14px', borderRadius: 12,
          background: 'var(--md-surface-variant)',
          border: '1px solid var(--md-outline)',
          marginBottom: 20, fontSize: 12,
          color: 'var(--md-on-surface-var)', fontWeight: 600,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 6 }}>mail</span>
          {user?.email || 'No email'}
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--md-on-surface-var)', marginBottom: 6, display: 'block', letterSpacing: .5 }}>
            Bio / About You
          </label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell your team a bit about yourself..."
            rows={3}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12,
              background: 'var(--md-surface-variant)',
              border: '1px solid var(--md-outline)',
              color: 'var(--md-on-surface)', fontSize: 13,
              resize: 'vertical', fontFamily: 'var(--font-body)',
              lineHeight: 1.6,
            }}
            onFocus={e => e.target.style.borderColor = 'var(--md-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--md-outline)'}
          />
        </div>

        {/* Role */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--md-on-surface-var)', marginBottom: 6, display: 'block', letterSpacing: .5 }}>
            Role / Position
          </label>
          <input
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Chat Executive, Senior Agent, Team Lead..."
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12,
              background: 'var(--md-surface-variant)',
              border: '1px solid var(--md-outline)',
              color: 'var(--md-on-surface)', fontSize: 13,
            }}
            onFocus={e => e.target.style.borderColor = 'var(--md-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--md-outline)'}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1, padding: '14px 20px', borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(135deg,var(--md-primary),#FF8F00)',
              color: '#fff', fontSize: 13, fontWeight: 800,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? .7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {saving ? (
              <span className="material-symbols-outlined" style={{ fontSize: 18, animation: 'spin 1s linear infinite' }}>sync</span>
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
            )}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          <button
            onClick={handleSkip}
            style={{
              padding: '14px 24px', borderRadius: 14,
              border: '1px solid var(--md-outline)',
              background: 'var(--md-surface-variant)',
              color: 'var(--md-on-surface-var)', fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
