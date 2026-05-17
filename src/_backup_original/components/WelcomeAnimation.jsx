/* eslint-disable react-hooks/purity */
import { useState, useEffect, useMemo, useCallback } from 'react';

const EMOJIS = ['🍕', '🍱', '🍛', '🍜', '🥗', '🍔', '🌮', '🍣', '🥘', '🍲'];

export default function WelcomeAnimation({ onComplete }) {
  const [phase, setPhase] = useState('mount');
  const [isExiting, setIsExiting] = useState(false);
  const [particles, setParticles] = useState([]);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase('ready');
      return;
    }

    const timer1 = setTimeout(() => setPhase('intro'), 100);
    const timer2 = setTimeout(() => setPhase('reveal'), 800);
    const timer3 = setTimeout(() => setPhase('ready'), 2000);

    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
      hue: Math.random() * 60 + 10,
    }));
    setParticles(newParticles);

    const newEmojis = EMOJIS.map((emoji, i) => ({
      emoji,
      x: 10 + Math.random() * 80,
      startY: 100,
      endY: -20,
      delay: 0.5 + Math.random() * 2,
      duration: 4 + Math.random() * 3,
      rotation: -30 + Math.random() * 60,
      scale: 0.8 + Math.random() * 0.5,
    }));
    setFloatingEmojis(newEmojis);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (freq, start, duration, volume = 0.08) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playNote(523.25, 0, 0.5);
      playNote(659.25, 0.12, 0.5);
      playNote(783.99, 0.24, 0.5);
      playNote(1046.50, 0.40, 0.8);
      playNote(1318.51, 0.60, 1.0);
    } catch { /* audio unavailable */ }
  }, []);

  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 600);
  }, [isExiting, onComplete]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEnter();
    }
  }, [handleEnter]);

  if (prefersReducedMotion) {
    return (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        onClick={handleEnter}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Click to enter EatClub Training Portal"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🍕</div>
          <h1 className="text-3xl font-bold text-white mb-2">EatClub CC Training</h1>
          <p className="text-gray-400">Click or press Enter to continue…</p>
        </div>
      </div>
    );
  }

  const getPhaseStyles = () => {
    switch (phase) {
      case 'mount': return 'opacity-0 scale-95';
      case 'intro': return 'opacity-1 scale-100';
      case 'reveal': return 'opacity-1 scale-100';
      case 'ready': return 'opacity-1 scale-100';
      default: return 'opacity-0';
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-all duration-700 ${isExiting ? 'opacity-0 scale-110' : ''}`}
      style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
      }}
      onClick={handleEnter}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Click to enter EatClub Training Portal"
    >
      {/* Floating food emojis */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {floatingEmojis.map((item, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float-emoji"
            style={{
              left: `${item.x}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
              transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Particle ring effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        {phase !== 'mount' && (
          <>
            <div className="absolute w-96 h-96 rounded-full border border-orange-500/20 animate-ping-slow" style={{ animationDuration: '4s' }} />
            <div className="absolute w-64 h-64 rounded-full border border-orange-400/30 animate-ping-slow" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            <div className="absolute w-32 h-32 rounded-full border border-orange-300/40 animate-ping-slow" style={{ animationDuration: '2s', animationDelay: '1s' }} />
          </>
        )}
      </div>

      {/* Particle dots */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: `hsl(${p.hue}, 100%, 60%)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              boxShadow: `0 0 10px hsl(${p.hue}, 100%, 60%)`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div 
        className={`relative z-10 text-center transition-all duration-1000 ${getPhaseStyles()}`}
      >
        {/* Logo/Icon */}
        <div className={`mb-8 transition-all duration-700 ${phase === 'ready' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-500 via-pink-500 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-glow">
              <span className="text-6xl filter drop-shadow-lg">🍕</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-xl">✨</span>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className={`mb-4 transition-all duration-500 delay-200 ${phase === 'reveal' || phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-white/90 tracking-widest uppercase">
              Training Portal
            </span>
          </span>
        </div>

        {/* Main title with letter animation */}
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight">
          <span className={`block transition-all duration-500 delay-300 ${phase === 'reveal' || phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              EAT
            </span>
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              CLUB
            </span>
          </span>
        </h1>

        {/* Tagline */}
        <div className={`text-xl md:text-2xl text-white/70 mb-8 transition-all duration-500 delay-500 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-light">Your Complete </span>
          <span className="font-semibold text-orange-400">Customer Care</span>
          <span className="font-light"> Training Hub</span>
        </div>

        {/* Decorative line */}
        <div className={`flex items-center justify-center gap-4 mb-8 transition-all duration-500 delay-700 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-orange-500" />
          <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-orange-500" />
        </div>

        {/* Stats display */}
        <div className={`flex flex-wrap justify-center gap-6 mb-8 transition-all duration-500 delay-900 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { value: '450+', label: 'Outlets' },
            { value: '8+', label: 'Brands' },
            { value: '7', label: 'Cities' },
            { value: '20', label: 'Modules' },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <span className="text-2xl font-bold text-orange-400">{stat.value}</span>
              <span className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Enter button / Skip hint */}
        <div className={`transition-all duration-500 delay-1000 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}>
          <button
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
            onClick={(e) => { e.stopPropagation(); handleEnter(); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleEnter(); } }}
          >
            <span className="flex items-center gap-2">
              <span>Enter Workspace</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
          <p className="mt-4 text-sm text-white/40">
            or click anywhere to continue…
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float-emoji {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) scale(0); opacity: 0; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 87, 34, 0.5), 0 0 60px rgba(255, 87, 34, 0.3); }
          50% { box-shadow: 0 0 50px rgba(255, 87, 34, 0.7), 0 0 100px rgba(255, 87, 34, 0.5); }
        }
        .animate-float-emoji { animation: float-emoji 8s linear infinite; }
        .animate-particle { animation: particle 4s ease-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}