import React from 'react';

export interface GlassContainerProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  borderGlowColor?: string;
  glowIntensity?: number;
  blur?: number;
  highlightOpacity?: number;
  sheenOffset?: number; // 0 to 1 for specular sweep
  noiseRefraction?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className = '',
  style = {},
  borderGlowColor = 'rgba(255, 85, 0, 0.35)',
  glowIntensity = 1,
  blur = 24,
  highlightOpacity = 0.5,
  sheenOffset,
  noiseRefraction = false,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl transition-all ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(20, 20, 24, 0.45) 50%, rgba(5, 5, 8, 0.75) 100%)',
        backdropFilter: `blur(${blur}px) saturate(180%) contrast(110%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(180%) contrast(110%)`,
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: `
          0 24px 64px -12px rgba(0, 0, 0, 0.85),
          0 10px 24px -6px rgba(0, 0, 0, 0.6),
          0 0 ${40 * glowIntensity}px ${borderGlowColor},
          inset 0 1px 2px 0 rgba(255, 255, 255, ${highlightOpacity}),
          inset 0 -1px 2px 0 rgba(0, 0, 0, 0.5),
          inset 1px 0 2px 0 rgba(255, 255, 255, ${highlightOpacity * 0.4})
        `,
        ...style,
      }}
    >
      {/* Specular gloss reflection streak */}
      {typeof sheenOffset === 'number' && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `linear-gradient(115deg, transparent ${sheenOffset * 100 - 25}%, rgba(255, 255, 255, 0.35) ${sheenOffset * 100}%, transparent ${sheenOffset * 100 + 25}%)`,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Cyberpunk corner brackets */}
      <div className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-orange-500/50" />
      <div className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-orange-500/50" />
      <div className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-orange-500/50" />
      <div className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-orange-500/50" />

      {/* Glass content */}
      <div className="relative z-20 h-full w-full">{children}</div>

      {/* Subtle micro grid pattern for cyberpunk feel */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 120, 0, 0.25) 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />
    </div>
  );
};
