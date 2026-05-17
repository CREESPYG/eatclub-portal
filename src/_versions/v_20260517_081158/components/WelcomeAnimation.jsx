/* eslint-disable react-hooks/purity */
import { useState, useEffect, useRef, useMemo } from 'react';

/*
  🍔 EATCLUB Training Portal - Welcome Animation
  ──────────────────────────────────────────────
  • Cinematic food-themed entry animation
  • Smooth animations with Anime.js
  • Sound effect on entry
  • Click to proceed to login
*/

export default function WelcomeAnimation({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  // Food-themed particles
  const particles = useMemo(() => {
    const foodEmojis = ['🍔', '🍕', '🍟', '🌮', '🍜', '🥗', '🍰', '☕', '🍳', '🥐'];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      size: 20 + Math.random() * 25,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
  }, []);

  useEffect(() => {
    if (phase !== 0 || isAnimating) return;
    setIsAnimating(true);

    // Play delightful food-themed chime
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, startTime, dur, vol = 0.08) => {
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
      // Cheerful ascending melody
      playTone(392, 0.0, 0.4, 0.08);    // G4
      playTone(523.25, 0.15, 0.4, 0.08); // C5
      playTone(659.25, 0.30, 0.4, 0.08); // E5
      playTone(783.99, 0.45, 0.5, 0.10); // G5
      playTone(1046.50, 0.70, 0.8, 0.12); // C6 - main chord
      audioRef.current = ctx;
    } catch (e) {
      console.warn('Sound not available:', e);
    }

    // Anime.js animations
    import('animejs').then((anime) => {
      const defaultAnime = anime.default;

      const tl = defaultAnime.timeline({ easing: 'easeOutExpo' });

      // 1. Background gradient reveal
      tl.add({
        targets: '.welcome-bg-overlay',
        opacity: [0, 1],
        duration: 1000,
      })

      // 2. Food particles floating up with rotation
      .add({
        targets: '.food-particle',
        translateY: [-80, 80],
        translateX: () => defaultAnime.random(-30, 30),
        rotate: () => defaultAnime.random(-180, 180),
        opacity: [0, 0.9, 0],
        scale: [0.3, 1.2],
        duration: 3500,
        delay: defaultAnime.stagger(100, {start: 500}),
        easing: 'easeOutQuad',
      }, '-=800')

      // 3. Pulsing rings
      .add({
        targets: '.welcome-ring',
        scale: [0.3, 1.8],
        opacity: [0.5, 0],
        duration: 3000,
        delay: defaultAnime.stagger(300),
        easing: 'easeOutQuad',
      }, '-=3000')

      // 4. "WELCOME TO" - slide up
      .add({
        targets: '.welcome-line-1 .welcome-char',
        translateY: [40, 0],
        opacity: [0, 1],
        rotateX: [90, 0],
        duration: 700,
        delay: defaultAnime.stagger(40, {start: 800}),
        easing: 'easeOutQuad',
      })

      // 5. "EATCLUB" - main text with bounce
      .add({
        targets: '.welcome-line-2 .welcome-char',
        translateY: [50, 0],
        opacity: [0, 1],
        scale: [0.5, 1],
        duration: 900,
        delay: defaultAnime.stagger(70, {start: 300}),
        easing: 'easeOutElastic(1, 0.6)',
      }, '-=300')

      // 6. Glowing effect on main text
      .add({
        targets: '.welcome-char-glow',
        textShadow: [
          '0 0 10px rgba(255, 152, 0, 0.5)',
          '0 0 40px rgba(255, 87, 34, 0.8)',
          '0 0 60px rgba(255, 152, 0, 0.6)',
        ],
        duration: 1500,
        easing: 'easeInOutQuad',
      }, '-=600')

      // 7. "TRAINING PORTAL" - slide up
      .add({
        targets: '.welcome-line-3 .welcome-char',
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 600,
        delay: defaultAnime.stagger(35),
        easing: 'easeOutQuad',
      }, '-=200')

      // 8. Decorative divider
      .add({
        targets: '.welcome-divider',
        width: [0, 150],
        opacity: [0, 1],
        duration: 700,
        easing: 'easeOutQuad',
      }, '-=200')

      // 9. Tagline
      .add({
        targets: '.welcome-tagline',
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 500,
        easing: 'easeOutQuad',
      }, '-=100')

      // 10. Food icon
      .add({
        targets: '.welcome-food-icon',
        scale: [0, 1.2, 1],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutElastic(1, 0.5)',
      }, '-=800')

      // 11. Skip hint
      .add({
        targets: '.welcome-skip-hint',
        opacity: [0, 1],
        duration: 400,
      }, '+=300');

      tl.finished.then(() => {
        setPhase(1);
        setIsAnimating(false);
      });

      animationRef.current = tl;
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [phase, isAnimating]);

  const handleSkip = () => {
    // Always allow skip - even during animation
    setPhase(2);

    // Immediately call onComplete to proceed
    if (onComplete) {
      onComplete();
    }

    // Optional: Still run fade out animation
    import('animejs').then((anime) => {
      anime.default({
        targets: '.welcome-overlay',
        opacity: 0,
        scale: 1.1,
        duration: 400,
        easing: 'easeInOutQuad',
      });
    });
  };

  if (phase === 3) return null;

  // Food company themed text
  const line1 = "WELCOME TO";
  const line2 = "EATCLUB";
  const line3 = "TRAINING PORTAL";

  return (
    <div
      ref={containerRef}
      className="welcome-overlay"
      onClick={handleSkip}
      style={{ cursor: 'pointer' }}
    >
      {/* Animated background */}
      <div className="welcome-bg-overlay" />

      {/* Food particles */}
      <div className="food-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="food-particle"
            style={{
              left: p.left,
              top: p.top,
              fontSize: p.size,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Pulsing rings */}
      <div className="welcome-ring welcome-ring-1" />
      <div className="welcome-ring welcome-ring-2" />
      <div className="welcome-ring welcome-ring-3" />
      <div className="welcome-ring welcome-ring-4" />

      {/* Main content */}
      <div className="welcome-text-group">
        {/* Food icon */}
        <div className="welcome-food-icon">🍔</div>

        {/* Line 1 */}
        <div className="welcome-line welcome-line-1">
          {line1.split('').map((ch, i) => (
            <span key={i} className="welcome-char">{ch === ' ' ? ' ' : ch}</span>
          ))}
        </div>

        {/* Line 2 - Main Brand */}
        <div className="welcome-line welcome-line-2">
          {line2.split('').map((ch, i) => (
            <span key={i} className="welcome-char welcome-char-glow">{ch}</span>
          ))}
        </div>

        {/* Line 3 */}
        <div className="welcome-line welcome-line-3">
          {line3.split('').map((ch, i) => (
            <span key={i} className="welcome-char">{ch === ' ' ? ' ' : ch}</span>
          ))}
        </div>

        {/* Divider */}
        <div className="welcome-divider" />

        {/* Tagline */}
        <div className="welcome-tagline">
          Empowering Our Food Delivery Team 🍕
        </div>
      </div>

      {/* Skip hint */}
      <div className="welcome-skip-hint">
        Click anywhere to continue →
      </div>
    </div>
  );
}