import { useState, useCallback } from 'react';
import { useAvatar, resolveAvatar, getUserColor } from '../hooks/useAvatar';

const SIZES = {
  xs: 24,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
  '2xl': 72,
};

export default function UserAvatar({
  size = 'md',
  name: explicitName,
  photoURL: explicitPhotoURL,
  email,
  showStatus,
  status,
  statusColor,
  onClick,
  className = '',
  style,
  alt,
  lazy = true,
}) {
  const { avatar: storedAvatar, photoURL: storedPhotoURL, name: storedName } = useAvatar();

  const avatar = resolveAvatar(
    storedAvatar,
    explicitPhotoURL || storedPhotoURL,
    explicitName || storedName,
    !!explicitPhotoURL
  );

  const px = typeof size === 'number' ? size : (SIZES[size] || 36);
  const fontSize = Math.max(Math.round(px * 0.4), 10);
  const bg = avatar.mode === 'letter' ? (avatar.bg || `linear-gradient(135deg, ${getUserColor(avatar.value)}, ${getUserColor(avatar.value)}88)`) : undefined;

  const [imgError, setImgError] = useState(false);
  const handleImgError = useCallback(() => setImgError(true), []);

  const containerStyle = {
    width: px,
    height: px,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
    background: bg || 'linear-gradient(135deg, var(--md-primary), #FF8F00)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: onClick ? 'pointer' : undefined,
    ...style,
  };

  const renderContent = () => {
    if (avatar.mode === 'emoji') {
      return (
        <span
          style={{
            fontSize: Math.round(px * 0.5),
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden="true"
        >
          {avatar.value}
        </span>
      );
    }

    if (avatar.mode === 'image' && !imgError) {
      return (
        <img
          src={avatar.value}
          alt={alt || (explicitName || storedName || 'User')}
          loading={lazy ? 'lazy' : undefined}
          onError={handleImgError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      );
    }

    return (
      <span
        style={{
          color: '#fff',
          fontWeight: 900,
          fontSize,
          lineHeight: 1,
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        {avatar.value}
      </span>
    );
  };

  return (
    <div
      className={className}
      style={containerStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
      title={alt || (explicitName || storedName || 'User')}
      aria-label={alt || (explicitName || storedName || 'User')}
    >
      {renderContent()}
      {showStatus && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: Math.max(Math.round(px * 0.28), 8),
            height: Math.max(Math.round(px * 0.28), 8),
            borderRadius: '50%',
            background: statusColor || (status === 'online' ? '#4CAF50' : status === 'idle' ? '#FF9800' : 'var(--md-on-surface-dim)'),
            border: '2px solid var(--md-surface-variant)',
            boxSizing: 'content-box',
          }}
        />
      )}
    </div>
  );
}
