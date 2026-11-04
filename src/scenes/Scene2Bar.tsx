import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { GlassContainer } from '../components/GlassContainer';
import { GlowEffect } from '../components/GlowEffect';
import { computeWavePath, easeOutCubic } from '../utils/transitions';
import type { VideoConfigProps } from '../config/videoConfig';

export interface SceneProps {
  customFrame?: number;
  config: VideoConfigProps;
}

export const Scene2Bar: React.FC<SceneProps> = ({ customFrame, config }) => {
  const remotionFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rawFrame = customFrame !== undefined ? customFrame : remotionFrame;

  // Relative frame (0 to 300)
  const frame = rawFrame >= 300 && rawFrame <= 600 ? rawFrame - 300 : rawFrame;

  // Entrance spring & opacity
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 90 },
  });

  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit transition
  const exitSlide = interpolate(frame, [260, 300], [0, -60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  const exitOpacity = interpolate(frame, [270, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Liquid Fill Progress from 0% to 100%
  const fillProgress = interpolate(frame, [20, 255], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const displayPercent = (fillProgress * 100).toFixed(1);

  // SVG wave calculation
  const capsuleWidth = 920;
  const capsuleHeight = 120;
  const wavePhase = frame * 0.14;
  const wavePath = computeWavePath(fillProgress, capsuleWidth, capsuleHeight, 10, wavePhase);

  // 10 discrete segment markers
  const totalSegments = 10;
  const activeSegments = Math.floor(fillProgress * totalSegments);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      style={{
        opacity: entranceOpacity * exitOpacity,
        transform: `translateY(${exitSlide}px) scale(${0.88 + 0.12 * entranceSpring})`,
      }}
    >
      {/* Ambient background glow following liquid */}
      <GlowEffect
        color={config.primaryColor}
        secondaryColor={config.highlightColor}
        x={30 + 40 * fillProgress}
        y={50}
        size={750}
        intensity={0.45 + 0.3 * fillProgress}
        pulsePhase={frame * 0.08}
      />

      {/* Header bar */}
      <div className="mb-8 flex w-[920px] items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-white font-bold text-sm">STYLE 02 // DUAL-CHAMBER FLUID CAPSULE</span>
          </div>
          <h2 className="mt-1 font-mono text-xl font-bold tracking-tight text-zinc-300">
            HORIZONTAL VISCOUS WAVE PROGRESS BAR
          </h2>
        </div>

        {/* Live numerical counter */}
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-6xl font-black tracking-tight text-white drop-shadow-[0_0_24px_#ff7700]">
            {displayPercent}%
          </span>
          <span className="font-mono text-xs tracking-wider text-orange-400">LIQUID FILL</span>
        </div>
      </div>

      {/* Main Glass Capsule */}
      <div className="relative w-[920px] h-[120px]">
        <GlassContainer
          className="h-full w-full !rounded-full"
          borderGlowColor={config.glowColor}
          glowIntensity={1.3}
          blur={32}
          highlightOpacity={0.75}
          sheenOffset={(frame % 100) / 100}
        >
          <div className="relative flex h-full w-full items-center overflow-hidden rounded-full p-2.5">
            {/* Internal tube */}
            <div className="relative h-full w-full overflow-hidden rounded-full bg-black/60 border border-white/10 shadow-inner">
              {/* Viscous Liquid SVG */}
              <svg
                width={capsuleWidth}
                height={capsuleHeight}
                viewBox={`0 0 ${capsuleWidth} ${capsuleHeight}`}
                className="absolute inset-0 h-full w-full preserve-3d"
              >
                <defs>
                  <linearGradient id="liquidGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#cc2200" />
                    <stop offset="50%" stopColor={config.primaryColor} />
                    <stop offset="100%" stopColor={config.highlightColor} />
                  </linearGradient>

                  <filter id="liquidGlow2" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {wavePath && (
                  <path
                    d={wavePath}
                    fill="url(#liquidGrad2)"
                    filter="url(#liquidGlow2)"
                    opacity="0.92"
                  />
                )}

                {fillProgress > 0 && fillProgress < 1 && (
                  <path
                    d={computeWavePath(fillProgress, capsuleWidth, capsuleHeight, 7, wavePhase + 1.2)}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.7)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* Buoyant micro-bubbles */}
              {Array.from({ length: 14 }).map((_, i) => {
                const bubbleX = (i * 68 + (frame * 1.8) % 860) % 880;
                const bubbleY = 30 + 35 * Math.sin(frame * 0.05 + i);
                const isUnderLiquid = bubbleX / 880 <= fillProgress;

                return isUnderLiquid ? (
                  <div
                    key={i}
                    className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_8px_#ffaa00]"
                    style={{
                      left: `${bubbleX}px`,
                      top: `${bubbleY}px`,
                      transform: `scale(${0.6 + 0.4 * Math.sin(frame * 0.1 + i)})`,
                    }}
                  />
                ) : null;
              })}

              {/* Segment divider lines */}
              <div className="pointer-events-none absolute inset-0 flex justify-between px-6 items-center">
                {Array.from({ length: totalSegments - 1 }).map((_, i) => (
                  <div key={i} className="h-full w-px bg-white/20" />
                ))}
              </div>
            </div>
          </div>
        </GlassContainer>

        {/* Specular reflection highlights */}
        <div
          className="pointer-events-none absolute top-3 left-12 right-12 h-3.5 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{ filter: 'blur(1px)' }}
        />
      </div>

      {/* 10 Segment Status Cards Below Capsule */}
      <div className="mt-8 flex w-[920px] justify-between items-center">
        <div className="flex gap-2.5">
          {Array.from({ length: totalSegments }).map((_, i) => {
            const isLit = i < activeSegments;
            return (
              <div
                key={i}
                className={`h-3 w-18 rounded-full transition-all duration-150 ${
                  isLit
                    ? 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_12px_#ff7700]'
                    : 'bg-white/10 border border-white/5'
                }`}
              />
            );
          })}
        </div>

        <div className="flex gap-6 font-mono text-xs text-zinc-400">
          <div>
            SEGMENTS: <span className="text-orange-400 font-bold">{activeSegments} / 10</span>
          </div>
          <div>
            VISCOSITY: <span className="text-amber-300 font-bold">14.2 cP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
