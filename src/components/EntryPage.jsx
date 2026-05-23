import { useState, useEffect, useMemo } from 'react';

const BRAND = 'EATCLUB';

export default function EntryPage({ onGoogleLogin }) {
  const [visible, setVisible] = useState(false);

  const particles = useMemo(() => {
    const emojis = ['🍔', '🍕', '🍟', '🌮', '🍜', '🥗', '🍰', '☕', '🍳', '🥐', '🌯', '🥟', '🍩', '🧋'];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: `${Math.random() * 100}%`,
      fontSize: `${16 + Math.random() * 20}px`,
      delay: `${Math.random() * 8}s`,
      duration: `${10 + Math.random() * 12}s`,
    }));
  }, []);

  useEffect(() => {
    setVisible(true);
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const tone = (freq, offset, dur, vol = 0.07) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime + offset);
        g.gain.setValueAtTime(0, ctx.currentTime + offset);
        g.gain.linearRampToValueAtTime(vol, ctx.currentTime + offset + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + dur);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + offset);
        o.stop(ctx.currentTime + offset + dur);
      };
      tone(440, 0.0, 0.35);
      tone(554, 0.12, 0.35);
      tone(659, 0.24, 0.35);
      tone(784, 0.36, 0.45, 0.09);
      tone(1047, 0.60, 0.7, 0.11);
    } catch { /* audio not available */ }
  }, []);

  return (
    <div className="entry-container">
      {particles.map((p) => (
        <span
          key={p.id}
          className="entry-particle"
          style={{
            left: p.left,
            bottom: '-5%',
            fontSize: p.fontSize,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          {p.emoji}
        </span>
      ))}

      <div className="entry-ring" />
      <div className="entry-ring" />
      <div className="entry-ring" />

      <div className="entry-brand">
        <div>
          {BRAND.split('').map((ch, i) => (
            <span key={i} className="entry-brand-letter" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              {ch}
            </span>
          ))}
        </div>
        <div className="entry-subtitle">Training Portal</div>
      </div>

      <div className="passcode-card" style={{ position: 'relative', zIndex: 2 }}>
        <div className="passcode-avatar-wrap">
          <div className="passcode-avatar">
            <img src="/app-icon.png" alt="EatClub" style={{ width: 56, height: 56, borderRadius: 16, objectFit: 'cover' }} />
          </div>
          <div className="passcode-online-dot"></div>
        </div>
        <div className="passcode-header">
          <h1>EatClub CC Portal</h1>
          <p>Sign in with Google to access the workspace</p>
        </div>

        <button onClick={onGoogleLogin} className="google-signin-btn" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="admin-contact">
          <div className="admin-contact-title">Contact Admin/Developer</div>
          <a href="https://www.linkedin.com/in/arif-ansari-a9586810a/" target="_blank" rel="noopener noreferrer" className="contact-mini-badge">
            <div className="mini-avatar">👨‍💻</div>
            <div className="mini-details">
              <div className="mini-name">MD ARIF ANSARI</div>
              <div className="mini-handle">Admin & Lead Developer</div>
            </div>
            <span className="material-symbols-outlined" style={{marginLeft: 'auto', fontSize: 18}}>open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
}
