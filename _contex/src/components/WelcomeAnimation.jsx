/* eslint-disable react-hooks/purity */
import { useState, useEffect, useRef, useMemo } from 'react';

/*
  ✨ Welcome Animation Component
  ──────────────────────────────
  • Manual gate: stays until clicked
  • "WELCOME TO EATCLUB TRAINING SITE" with staggered glow
  • Sound effect on entry (chime)
  • Dismisses with a fade-out on click
*/

export default function WelcomeAnimation({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=mounting, 1=text-reveal, 2=fade-out, 3=done
  const audioRef = useRef(null);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
      width: `${2 + Math.random() * 4}px`,
      height: `${2 + Math.random() * 4}px`,
    }));
  }, []);

  useEffect(() => {
    // Phase 0→1: Start text reveal after brief delay
    const t1 = setTimeout(() => setPhase(1), 200);

    return () => { clearTimeout(t1); };
  }, [onComplete]);

  // Play sound on mount
  useEffect(() => {
    try {
      // Generate a pleasant chime using Web Audio API
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      const playTone = (freq, startTime, dur, vol = 0.12) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
        gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + dur);
      };

      // Elegant ascending chime sequence
      playTone(523.25, 0.0, 0.6, 0.10);    // C5
      playTone(659.25, 0.15, 0.5, 0.10);   // E5
      playTone(783.99, 0.30, 0.5, 0.10);   // G5
      playTone(1046.50, 0.50, 0.8, 0.12);  // C6
      playTone(1318.51, 0.70, 1.0, 0.08);  // E6 (soft shimmer)

      audioRef.current = ctx;
    } catch (e) {
      console.warn('Welcome sound not available:', e);
    }

    return () => {
      if (audioRef.current && audioRef.current.state !== 'closed') {
        audioRef.current.close();
      }
    };
  }, []);

  const handleSkip = () => {
    if (phase >= 2) return;
    setPhase(2);
    setTimeout(() => {
      setPhase(3);
      onComplete?.();
    }, 800); // match CSS transition duration
  };

  if (phase === 3) return null;

  const line1 = "WELCOME TO";
  const line2 = "EATCLUB";
  const line3 = "TRAINING SITE";

  return (
    <div
      className={`welcome-overlay ${phase >= 2 ? 'welcome-fade-out' : ''}`}
      onClick={handleSkip}
      style={{ cursor: 'pointer' }}
    >
      {/* Animated background particles */}
      <div className="welcome-particles">
        {particles.map((p, i) => (
          <div
            key={i}
            className="welcome-particle"
            style={p}
          />
        ))}
      </div>

      {/* Glowing rings */}
      <div className="welcome-ring welcome-ring-1" />
      <div className="welcome-ring welcome-ring-2" />
      <div className="welcome-ring welcome-ring-3" />

      {/* Main text */}
      <div className={`welcome-text-group ${phase >= 1 ? 'welcome-text-visible' : ''}`}>
        <div className="welcome-line welcome-line-sub">
          {line1.split('').map((ch, i) => (
            <span
              key={i}
              className="welcome-char"
              style={{ animationDelay: `${0.3 + i * 0.04}s` }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </div>

        <div className="welcome-line welcome-line-main">
          {line2.split('').map((ch, i) => (
            <span
              key={i}
              className="welcome-char welcome-char-glow"
              style={{ animationDelay: `${0.8 + i * 0.08}s` }}
            >
              {ch}
            </span>
          ))}
        </div>

        <div className="welcome-line welcome-line-sub">
          {line3.split('').map((ch, i) => (
            <span
              key={i}
              className="welcome-char"
              style={{ animationDelay: `${1.5 + i * 0.04}s` }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </div>

        {/* Decorative line */}
        <div className="welcome-divider" />

        {/* Tagline */}
        <div className="welcome-tagline">
          Your Complete CC Training Hub
        </div>
      </div>

      {/* Skip hint */}
      <div className="welcome-skip-hint">Click anywhere to enter workspace</div>
    </div>
  );
}
