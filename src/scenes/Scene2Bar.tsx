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

  // Relative frame within this 300-frame scene (0 to 300)
  const frame = rawFrame >= 240 && rawFrame <= 540 ? rawFrame - 240 : rawFrame;

  // Entrance spring
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 90 },
  });

  // Exit transition wipe / slide
  const exitSlide = interpolate(frame, [260, 300], [0, -80], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  const exitOpacity = interpolate(frame, [270, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Liquid Fill Progress from 0% to 100%
  const fillProgress = interpolate(frame, [25, 250], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const displayPercent = (fillProgress * 100).toFixed(1);

  // SVG wave calculation
  const capsuleWidth = 880;
  const capsuleHeight = 110;
  const wavePhase = frame * 0.14;
  const wavePath = computeWavePath(fillProgress, capsuleWidth, capsuleHeight, 9, wavePhase);

  // 10 discrete segment markers
  const totalSegments = 10;
  const activeSegments = Math.floor(fillProgress * totalSegments);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      style={{
        opacity: exitOpacity,
        transform: `translateY(${exitSlide}px) scale(${0.9 + 0.1 * entranceSpring})`,
      }}
    >
      {/* Ambient background glow following the liquid fill */}
      <GlowEffect
        color={config.primaryColor}
        secondaryColor={config.highlightColor}
        x={35 + 30 * fillProgress}
        y={50}
        size={700}
        intensity={0.4 + 0.3 * fillProgress}
        pulsePhase={frame * 0.08}
      />

      {/* Header telemetry and title */}
      <div className="mb-8 flex w-[880px] items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>STAGE 02 // LINEAR_GLASS_CAPSULE</span>
          </div>
          <h2 className="mt-1 font-mono text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,85,0,0.5)]">
            LIQUID FILL PRESSURE // TRANSDUCER
          </h2>
        </div>

        {/* Live numerical telemetry counter */}
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-5xl font-black tracking-tight text-white drop-shadow-[0_0_20px_#ff7700]">
            {displayPercent}%
          </span>
          <span className="font-mono text-xs tracking-wider text-orange-400/80">FLOW_RATE: 1.48 L/s</span>
        </div>
      </div>

      {/* Main Glass Capsule Horizontal Bar */}
      <div className="relative w-[880px] h-[110px]">
        {/* Outer Heavy Beveled Glass Container */}
        <GlassContainer
          className="h-full w-full !rounded-full"
          borderGlowColor={config.glowColor}
          glowIntensity={1.2}
          blur={30}
          highlightOpacity={0.7}
          sheenOffset={(frame % 90) / 90}
        >
          <div className="relative flex h-full w-full items-center overflow-hidden rounded-full p-2">
            {/* Background internal channel */}
            <div className="relative h-full w-full overflow-hidden rounded-full bg-black/50 border border-white/10 shadow-inner">
              {/* Viscous Glowing Orange Liquid Fill SVG */}
              <svg
                width={capsuleWidth}
                height={capsuleHeight}
                viewBox={`0 0 ${capsuleWidth} ${capsuleHeight}`}
                className="absolute inset-0 h-full w-full preserve-3d"
              >
                <defs>
                  <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#cc3300" />
                    <stop offset="60%" stopColor={config.primaryColor} />
                    <stop offset="100%" stopColor={config.highlightColor} />
                  </linearGradient>

                  <filter id="liquidGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Main liquid body */}
                {wavePath && (
                  <path
                    d={wavePath}
                    fill="url(#liquidGrad)"
                    filter="url(#liquidGlow)"
                    opacity="0.9"
                  />
                )}

                {/* Secondary crest refraction highlight wave */}
                {fillProgress > 0 && fillProgress < 1 && (
                  <path
                    d={computeWavePath(fillProgress, capsuleWidth, capsuleHeight, 6, wavePhase + 1.2)}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.65)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* Internal meniscus bubbles / light particles */}
              {Array.from({ length: 12 }).map((_, i) => {
                const bubbleX = (i * 70 + (frame * 1.5) % 800) % 840;
                const bubbleY = 25 + 30 * Math.sin(frame * 0.05 + i);
                const isUnderLiquid = bubbleX / 840 <= fillProgress;

                return isUnderLiquid ? (
                  <div
                    key={i}
                    className="pointer-events-none absolute h-2 w-2 rounded-full bg-amber-200/90 shadow-[0_0_8px_#ffaa00]"
                    style={{
                      left: `${bubbleX}px`,
                      top: `${bubbleY}px`,
                      transform: `scale(${0.6 + 0.4 * Math.sin(frame * 0.1 + i)})`,
                    }}
                  />
                ) : null;
              })}

              {/* Segment division lines overlaid onto the bar */}
              <div className="pointer-events-none absolute inset-0 flex justify-between px-6 items-center">
                {Array.from({ length: totalSegments - 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full w-px bg-white/15"
                    style={{
                      boxShadow: '0 0 4px rgba(0,0,0,0.8)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </GlassContainer>

        {/* Specular cylindrical glass highlight strip */}
        <div
          className="pointer-events-none absolute top-3 left-10 right-10 h-3 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{ filter: 'blur(1px)' }}
        />
      </div>

      {/* Segment Status Cards & Metrics Beneath the Capsule */}
      <div className="mt-8 flex w-[880px] justify-between items-center">
        <div className="flex gap-2">
          {Array.from({ length: totalSegments }).map((_, i) => {
            const isLit = i < activeSegments;
            return (
              <div
                key={i}
                className={`h-2.5 w-16 rounded-full transition-all duration-150 ${
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
            VISCOSITY: <span className="text-orange-400 font-bold">12.4 cP</span>
          </div>
          <div>
            STATUS: <span className="text-emerald-400 font-bold">LAMINAR // OPTIMAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
