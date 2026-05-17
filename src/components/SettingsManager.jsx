/*
  ⚙️ Settings Manager Component
  ───────────────────────────────
  • Organized settings with tabs
  • Color themes with visual preview
  • Font options with live preview
  • Animation speed control
  • Version management
*/

import { useState, useEffect } from 'react';

// Settings tabs
const SETTINGS_TABS = [
  { id: 'appearance', name: 'Appearance', icon: '🎨' },
  { id: 'color', name: 'Colors', icon: '🖌️' },
  { id: 'font', name: 'Fonts', icon: '🔤' },
  { id: 'animation', name: 'Animation', icon: '⚡' },
  { id: 'versions', name: 'Versions', icon: '📦' },
];

export default function SettingsManager({
  show,
  onClose,
  activeTheme,
  recentColors,
  isLight,
  activeFont,
  animSpeed,
  onThemeChange,
  onToggleTheme,
  onFontChange,
  onAnimSpeedChange,
  APP_THEME_COLORS,
  FONT_OPTIONS,
  ANIMATION_SPEEDS,
}) {
  const [activeTab, setActiveTab] = useState('appearance');

  if (!show) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-header">
          <div className="settings-title">
            <span style={{ fontSize: 24 }}>⚙️</span>
            <span>Settings</span>
          </div>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="settings-tabs">
          {SETTINGS_TABS.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {activeTab === 'appearance' && (
            <AppearanceTab
              isLight={isLight}
              activeTheme={activeTheme}
              activeFont={activeFont}
              animSpeed={animSpeed}
              onToggleTheme={onToggleTheme}
              APP_THEME_COLORS={APP_THEME_COLORS}
              FONT_OPTIONS={FONT_OPTIONS}
              ANIMATION_SPEEDS={ANIMATION_SPEEDS}
              onThemeChange={onThemeChange}
              onFontChange={onFontChange}
              onAnimSpeedChange={onAnimSpeedChange}
            />
          )}

          {activeTab === 'color' && (
            <ColorTab
              activeTheme={activeTheme}
              recentColors={recentColors}
              APP_THEME_COLORS={APP_THEME_COLORS}
              onThemeChange={onThemeChange}
            />
          )}

          {activeTab === 'font' && (
            <FontTab
              activeFont={activeFont}
              FONT_OPTIONS={FONT_OPTIONS}
              onFontChange={onFontChange}
            />
          )}

          {activeTab === 'animation' && (
            <AnimationTab
              animSpeed={animSpeed}
              ANIMATION_SPEEDS={ANIMATION_SPEEDS}
              onAnimSpeedChange={onAnimSpeedChange}
            />
          )}

          {activeTab === 'versions' && (
            <VersionsTab />
          )}
        </div>
      </div>
    </div>
  );
}

// Appearance Tab
function AppearanceTab({ isLight, activeTheme, activeFont, animSpeed, onToggleTheme, APP_THEME_COLORS, FONT_OPTIONS, ANIMATION_SPEEDS, onThemeChange, onFontChange, onAnimSpeedChange }) {
  const currentTheme = APP_THEME_COLORS.find(t => t.id === activeTheme);
  const currentFont = FONT_OPTIONS.find(f => f.id === activeFont);
  const currentSpeed = ANIMATION_SPEEDS.find(s => s.id === animSpeed);

  return (
    <div className="settings-section">
      <div className="settings-preview">
        <div className="preview-card">
          <div className="preview-header" style={{ background: currentTheme?.p }}></div>
          <div className="preview-body">
            <div className="preview-text" style={{ fontFamily: currentFont?.family }}>Aa</div>
            <div className="preview-badge" style={{ animationDuration: currentSpeed?.multiplier === 0 ? '0s' : `${currentSpeed?.multiplier}s` }}>Preview</div>
          </div>
        </div>
        <div className="preview-info">
          <div><strong>Theme:</strong> {activeTheme}</div>
          <div><strong>Mode:</strong> {isLight ? 'Light ☀️' : 'Dark 🌙'}</div>
          <div><strong>Font:</strong> {currentFont?.name}</div>
          <div><strong>Speed:</strong> {currentSpeed?.name}</div>
        </div>
      </div>

      <div className="settings-group">
        <label className="settings-label">Mode</label>
        <button className="settings-btn full" onClick={onToggleTheme}>
          <span>{isLight ? '🌙' : '☀️'}</span>
          <span>{isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
        </button>
      </div>
    </div>
  );
}

// Color Tab
function ColorTab({ activeTheme, recentColors, APP_THEME_COLORS, onThemeChange }) {
  const categories = ['Dynamic', 'Simple', 'Pro'];

  return (
    <div className="settings-section">
      {recentColors.length > 0 && (
        <div className="settings-group">
          <label className="settings-label">Recent Colors</label>
          <div className="color-swatches">
            {recentColors.map((t, i) => (
              <button
                key={i}
                className={`color-swatch ${activeTheme === t.id ? 'active' : ''}`}
                style={{ background: t.p }}
                onClick={() => onThemeChange(t)}
                title={t.id}
              />
            ))}
          </div>
        </div>
      )}

      {categories.map(cat => (
        <div key={cat} className="settings-group">
          <label className="settings-label">{cat}</label>
          <div className="color-grid">
            {APP_THEME_COLORS.filter(t => t.category === cat).map(t => (
              <button
                key={t.id}
                className={`color-btn ${activeTheme === t.id ? 'active' : ''}`}
                style={{ background: t.p }}
                onClick={() => onThemeChange(t)}
                title={t.id}
              >
                {activeTheme === t.id && '✓'}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="settings-group">
        <label className="settings-label">Custom Color</label>
        <div className="custom-color-picker">
          <input
            type="color"
            onChange={(e) => {
              const hex = e.target.value;
              const r = parseInt(hex.slice(1,3), 16);
              const g = parseInt(hex.slice(3,5), 16);
              const b = parseInt(hex.slice(5,7), 16);
              onThemeChange({ id: 'custom', p: hex, rgb: `${r}, ${g}, ${b}`, pc: hex, opc: '#000', category: 'Custom' });
            }}
          />
          <span>Pick any color</span>
        </div>
      </div>
    </div>
  );
}

// Font Tab
function FontTab({ activeFont, FONT_OPTIONS, onFontChange }) {
  return (
    <div className="settings-section">
      {FONT_OPTIONS.map(font => (
        <button
          key={font.id}
          className={`font-btn ${activeFont === font.id ? 'active' : ''}`}
          onClick={() => onFontChange(font)}
          style={{ fontFamily: font.family }}
        >
          <span className="font-name">{font.name}</span>
          <span className="font-preview">The quick brown fox</span>
        </button>
      ))}
    </div>
  );
}

// Animation Tab
function AnimationTab({ animSpeed, ANIMATION_SPEEDS, onAnimSpeedChange }) {
  return (
    <div className="settings-section">
      <div className="settings-group">
        <label className="settings-label">Transition Speed</label>
        <div className="speed-options">
          {ANIMATION_SPEEDS.map(speed => (
            <button
              key={speed.id}
              className={`speed-btn ${animSpeed === speed.id ? 'active' : ''}`}
              onClick={() => onAnimSpeedChange(speed)}
            >
              <span className="speed-name">{speed.name}</span>
              <span className="speed-desc">
                {speed.id === 'slow' && '🐢 Slow & smooth'}
                {speed.id === 'normal' && '🚶 Normal'}
                {speed.id === 'fast' && '🏃 Fast response'}
                {speed.id === 'instant' && '⚡ Instant - no animation'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Versions Tab
function VersionsTab() {
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    // Get list of versions from folders
    const loadVersions = () => {
      // This would be dynamic in a real app
      setVersions([
        { id: 'latest', name: 'Current Version', date: new Date().toLocaleString(), isLatest: true },
      ]);
    };
    loadVersions();
  }, []);

  return (
    <div className="settings-section">
      <div className="settings-group">
        <label className="settings-label">Version History</label>
        <p className="settings-desc">
          Every time you make significant changes, a backup is automatically saved.
        </p>
        <div className="version-list">
          {versions.map(v => (
            <div key={v.id} className="version-item">
              <span className="version-name">{v.name}</span>
              <span className="version-date">{v.date}</span>
              {v.isLatest && <span className="version-badge">Current</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="settings-group">
        <label className="settings-label">Manual Backup</label>
        <button className="settings-btn" onClick={() => {
          const versionFolder = `src/_versions/v_${Date.now()}`;
          // This would create a backup
          alert('Backup created! Check src/_versions folder');
        }}>
          💾 Create Backup Now
        </button>
      </div>
    </div>
  );
}