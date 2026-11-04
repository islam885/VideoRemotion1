import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { GlassContainer } from '../components/GlassContainer';
import { GlowEffect } from '../components/GlowEffect';
import { easeOutCubic } from '../utils/transitions';
import type { VideoConfigProps } from '../config/videoConfig';

export interface SceneProps {
  customFrame?: number;
  config: VideoConfigProps;
}

export const Scene4Dial: React.FC<SceneProps> = ({ customFrame, config }) => {
  const remotionFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rawFrame = customFrame !== undefined ? customFrame : remotionFrame;

  // Relative frame (0 to 300)
  const frame = rawFrame >= 900 && rawFrame <= 1200 ? rawFrame - 900 : rawFrame;

  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.8, stiffness: 95 },
  });

  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitScale = interpolate(frame, [270, 300], [1, 1.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  const exitOpacity = interpolate(frame, [275, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dial progress 0% to 100%
  const dialProgress = interpolate(frame, [20, 260], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const numBars = 48;
  const radius = 220;
  const sweepAngle = (dialProgress / 100) * 360;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        opacity: entranceOpacity * exitOpacity,
        transform: `scale(${(0.85 + 0.15 * entranceSpring) * exitScale})`,
      }}
    >
      <GlowEffect
        color={config.primaryColor}
        secondaryColor={config.highlightColor}
        x={50}
        y={50}
        size={750}
        intensity={0.55}
        pulsePhase={frame * 0.08}
      />

      {/* Showcase title badge */}
      <div className="absolute top-12 left-16 font-mono text-xs text-orange-400 tracking-widest flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="font-bold text-white text-sm">STYLE 04 // RADIAL AUDIO-WAVE DIAL</span>
        </div>
        <span className="text-[11px] text-zinc-400">48-BAND RADIAL REACTIVE GLASS EQUALIZER</span>
      </div>

      <div className="relative flex items-center justify-center" style={{ width: '640px', height: '640px' }}>
        {/* Radial Equalizer Wave Bars SVG */}
        <svg width="640" height="640" viewBox="0 0 640 640" className="overflow-visible">
          <defs>
            <linearGradient id="dialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.highlightColor} />
              <stop offset="60%" stopColor={config.primaryColor} />
              <stop offset="100%" stopColor="#991100" />
            </linearGradient>
          </defs>

          {/* Equalizer radiating bars */}
          {Array.from({ length: numBars }).map((_, i) => {
            const barAngle = (i / numBars) * 360 - 90;
            const rad = (barAngle * Math.PI) / 180;
            const isLit = (i / numBars) * 100 <= dialProgress;

            // Reactive frequency bounce
            const bounce = Math.abs(Math.sin(frame * 0.2 + i * 0.6)) * 25;
            const barLength = isLit ? 35 + bounce : 12;

            const x1 = 320 + (radius - 10) * Math.cos(rad);
            const y1 = 320 + (radius - 10) * Math.sin(rad);
            const x2 = 320 + (radius + barLength) * Math.cos(rad);
            const y2 = 320 + (radius + barLength) * Math.sin(rad);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isLit ? 'url(#dialGrad)' : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={isLit ? 4 : 2}
                strokeLinecap="round"
                style={{
                  filter: isLit ? 'drop-shadow(0 0 6px #ff7700)' : 'none',
                }}
              />
            );
          })}

          {/* Glowing cursor needle tip */}
          {dialProgress > 0 && (
            <circle
              cx={320 + radius * Math.cos(((sweepAngle - 90) * Math.PI) / 180)}
              cy={320 + radius * Math.sin(((sweepAngle - 90) * Math.PI) / 180)}
              r="8"
              fill="#fff"
              style={{ filter: 'drop-shadow(0 0 10px #ffaa00)' }}
            />
          )}
        </svg>

        {/* Central Circular Glass Hub */}
        <div className="absolute w-[280px] h-[280px]">
          <GlassContainer
            className="h-full w-full !rounded-full flex flex-col items-center justify-center p-6 text-center"
            borderGlowColor={config.glowColor}
            glowIntensity={1.3}
            blur={30}
            highlightOpacity={0.8}
            sheenOffset={(frame % 100) / 100}
          >
            <span className="font-mono text-xs text-orange-400 tracking-widest uppercase">
              REACTIVE SWEEP
            </span>
            <span className="font-mono text-5xl font-black text-white drop-shadow-[0_0_20px_#ff7700] my-1">
              {Math.round(dialProgress)}%
            </span>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-300 mt-2 shadow-[0_0_8px_#ffaa00]" />
            <span className="font-mono text-[10px] text-zinc-400 mt-2">
              FREQ: 432 Hz // HARMONIC
            </span>
          </GlassContainer>
        </div>
      </div>
    </div>
  );
};
