import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const INTERACTIVE = true;

const LINE1 = 'WELCOME TO';
const LINE2 = 'EATCLUB';
const LINE3 = 'TRAINING PORTAL';

const foodEmojis = ['🍔', '🍕', '🍟', '🌮', '🍜', '🥗', '🍰', '☕', '🍳', '🥐', '🌯', '🥟', '🍩', '🧋', '🍝', '🥨'];

function playArpeggio(ctx, notes) {
  notes.forEach(({ freq, offset, dur, vol }) => {
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
  });
}

export default function WelcomeAnimation({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showDivider, setShowDivider] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ctxRef = useRef(null);
  const groupRef = useRef(null);

  const particles = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
      left: `${Math.random() * 100}%`,
      fontSize: `${18 + Math.random() * 22}px`,
      delay: `${Math.random() * 4}s`,
      duration: `${8 + Math.random() * 6}s`,
    })), []);

  const sparkles = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 3}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${2 + Math.random() * 3}s`,
    })), []);

  const handleMouseMove = useCallback((e) => {
    if (!groupRef.current) return;
    const rect = groupRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    setTilt({ x: dy * -12, y: dx * 12 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleSkip = useCallback(() => {
    if (ctxRef.current) { try { ctxRef.current.close(); } catch {} }
    setFadeOut(true);
    setTimeout(() => onComplete?.(), 300);
  }, [onComplete]);

  useEffect(() => {
    let ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
    } catch { /* silent */ }

    let t1, t2, t3, t4, t5;
    if (ctx) {
      t1 = setTimeout(() => playArpeggio(ctx, [
        { freq: 523.25, offset: 0.0, dur: 0.25, vol: 0.06 },
        { freq: 659.25, offset: 0.08, dur: 0.25, vol: 0.06 },
        { freq: 783.99, offset: 0.16, dur: 0.3, vol: 0.08 },
      ]), 300);
      t2 = setTimeout(() => playArpeggio(ctx, [
        { freq: 784, offset: 0.0, dur: 0.2, vol: 0.09 },
        { freq: 659, offset: 0.06, dur: 0.2, vol: 0.09 },
        { freq: 523, offset: 0.12, dur: 0.25, vol: 0.09 },
        { freq: 1047, offset: 0.25, dur: 0.5, vol: 0.14 },
        { freq: 1319, offset: 0.35, dur: 0.4, vol: 0.10 },
      ]), 1400);
      t3 = setTimeout(() => playArpeggio(ctx, [
        { freq: 392, offset: 0.0, dur: 0.2, vol: 0.05 },
        { freq: 440, offset: 0.08, dur: 0.2, vol: 0.05 },
        { freq: 494, offset: 0.16, dur: 0.3, vol: 0.06 },
      ]), 2800);
      t4 = setTimeout(() => playArpeggio(ctx, [
        { freq: 1760, offset: 0.0, dur: 0.12, vol: 0.03 },
        { freq: 2093, offset: 0.04, dur: 0.12, vol: 0.03 },
        { freq: 2637, offset: 0.08, dur: 0.15, vol: 0.04 },
      ]), 3800);
      t5 = setTimeout(() => playArpeggio(ctx, [
        { freq: 659, offset: 0.0, dur: 0.25, vol: 0.06 },
        { freq: 784, offset: 0.12, dur: 0.3, vol: 0.07 },
      ]), 4400);
    }

    setShowLine1(true);
    const timeouts = [
      setTimeout(() => setShowLine2(true), 1200),
      setTimeout(() => setShowLine3(true), 2600),
      setTimeout(() => setShowDivider(true), 3600),
      setTimeout(() => setShowTagline(true), 4200),
      setTimeout(() => { setShowHint(true); setPhase(1); }, 5200),
    ];

    return () => {
      timeouts.forEach(clearTimeout);
      [t1, t2, t3, t4, t5].filter(Boolean).forEach(clearTimeout);
      if (ctx) { try { ctx.close(); } catch {} }
    };
  }, []);

  if (fadeOut) return null;

  return (
    <div className="welcome-overlay" onClick={handleSkip}>
      <div className="welcome-bg-overlay" />

      <div className="welcome-sparkles">
        {sparkles.map(s => (
          <div key={s.id} className="welcome-sparkle" style={{
            left: s.left, top: s.top, width: s.size, height: s.size,
            animationDelay: s.delay, animationDuration: s.duration,
          }} />
        ))}
      </div>

      <div className="food-particles">
        {particles.map(p => (
          <span key={p.id} className="food-particle" style={{
            left: p.left, fontSize: p.fontSize,
            animationDelay: p.delay, animationDuration: p.duration,
          }}>{p.emoji}</span>
        ))}
      </div>

      <div className="welcome-ring welcome-ring-1" />
      <div className="welcome-ring welcome-ring-2" />
      <div className="welcome-ring welcome-ring-3" />

      <div
        ref={groupRef}
        className="welcome-text-group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {showLine1 && (
          <div className="welcome-line welcome-line-sub">
            {LINE1.split('').map((ch, i) => (
              <span key={i} className="welcome-char" style={{ animationDelay: `${i * 0.04}s` }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </div>
        )}

        {showLine2 && (
          <div className="welcome-line welcome-line-main" data-brand>
            {LINE2.split('').map((ch, i) => (
              <span key={i} className="welcome-char welcome-char-glow" style={{ animationDelay: `${i * 0.06}s` }}>
                {ch}
              </span>
            ))}
          </div>
        )}

        {showLine3 && (
          <div className="welcome-line welcome-line-sub">
            {LINE3.split('').map((ch, i) => (
              <span key={i} className="welcome-char" style={{ animationDelay: `${i * 0.035}s` }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </div>
        )}

        {showDivider && <div className="welcome-divider" />}

        {showTagline && (
          <div className="welcome-tagline">
            Empowering Our Food Delivery Team 🍕
          </div>
        )}

        {showHint && (
          <div className="welcome-skip-hint">
            Click anywhere to continue →
          </div>
        )}
      </div>
    </div>
  );
}
