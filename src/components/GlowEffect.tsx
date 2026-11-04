import React from 'react';

export interface GlowEffectProps {
  color?: string; // e.g. '#FF5500'
  secondaryColor?: string; // e.g. '#FFAA00'
  x?: number; // percentage or px
  y?: number;
  size?: number;
  intensity?: number;
  pulsePhase?: number;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  color = '#FF5500',
  secondaryColor = '#FFAA00',
  x = 50,
  y = 50,
  size = 500,
  intensity = 0.6,
  pulsePhase = 0,
}) => {
  const dynamicScale = 1 + 0.08 * Math.sin(pulsePhase);
  const dynamicOpacity = intensity * (0.85 + 0.15 * Math.cos(pulsePhase * 1.3));

  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size * dynamicScale}px`,
        height: `${size * dynamicScale}px`,
        background: `radial-gradient(circle, ${color} 0%, ${secondaryColor} 30%, rgba(255, 85, 0, 0.08) 65%, transparent 80%)`,
        opacity: dynamicOpacity,
        filter: 'blur(60px)',
        mixBlendMode: 'screen',
        willChange: 'transform, opacity',
      }}
    />
  );
};

export const CyberBackground: React.FC<{
  primaryColor?: string;
  secondaryColor?: string;
  frame?: number;
}> = ({ primaryColor = '#FF5500', secondaryColor = '#FF7700', frame = 0 }) => {
  const p1 = frame * 0.03;
  const p2 = frame * 0.02 + 1.5;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050505]">
      {/* Subtle deep ambient noise & gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #110d0a 0%, #080808 60%, #030303 100%)',
        }}
      />

      {/* Primary Warm Core Glow */}
      <GlowEffect
        color={primaryColor}
        secondaryColor={secondaryColor}
        x={50 + 4 * Math.sin(p1 * 0.5)}
        y={50 + 3 * Math.cos(p1 * 0.7)}
        size={750}
        intensity={0.4}
        pulsePhase={p1}
      />

      {/* Secondary accent satellite orbs */}
      <GlowEffect
        color="#FFAA00"
        secondaryColor="#FF3300"
        x={28 + 6 * Math.cos(p2 * 0.4)}
        y={32 + 5 * Math.sin(p2 * 0.6)}
        size={400}
        intensity={0.25}
        pulsePhase={p2}
      />

      <GlowEffect
        color="#FF5500"
        secondaryColor="#882200"
        x={72 + 5 * Math.sin(p2 * 0.5)}
        y={68 + 4 * Math.cos(p2 * 0.4)}
        size={450}
        intensity={0.22}
        pulsePhase={p2 + 1}
      />

      {/* Cyberpunk isometric perspective grid floor */}
      <div
        className="absolute inset-0 opacity-12"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 85, 0, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 85, 0, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)',
        }}
      />

      {/* Vignette border */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 120px 40px rgba(0, 0, 0, 0.95)',
        }}
      />
    </div>
  );
};
