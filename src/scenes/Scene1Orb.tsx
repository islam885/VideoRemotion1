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

export const Scene1Orb: React.FC<SceneProps> = ({ customFrame, config }) => {
  const remotionFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = customFrame !== undefined ? customFrame : remotionFrame;

  // Scene duration: 300 frames (0 to 5s)
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 100 },
  });

  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit transition: zoom and soft blur warp into Scene 2 (frames 250 to 300)
  const exitZoom = interpolate(frame, [250, 300], [1.0, 1.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  const exitBlur = interpolate(frame, [260, 300], [0, 24], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitOpacity = interpolate(frame, [275, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const overallScale = (0.75 + 0.25 * entranceSpring) * exitZoom;

  // Inner core and orbital ring rotation
  const coreRotation = frame * 1.6;
  const ringRotation = frame * 0.9;
  const counterRotation = -frame * 1.3;

  // Circular progress: from 0% to 100% over frames 25 to 260
  const circularProgress = interpolate(frame, [25, 260], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Wobble physics
  const wobbleX = Math.sin(frame * 0.08) * 8;
  const wobbleY = Math.cos(frame * 0.07) * 8;

  const circleRadius = 190;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (circularProgress / 100) * circumference;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        opacity: entranceOpacity * exitOpacity,
        filter: `blur(${exitBlur}px)`,
        transform: `scale(${overallScale})`,
      }}
    >
      {/* Background ambient light */}
      <GlowEffect
        color={config.primaryColor}
        secondaryColor={config.highlightColor}
        x={50}
        y={50}
        size={650}
        intensity={0.55}
        pulsePhase={frame * 0.05}
      />

      {/* Outer Speedometer / Circular Tachometer Track */}
      <div className="absolute flex items-center justify-center pointer-events-none">
        <svg width="640" height="640" viewBox="0 0 640 640" className="overflow-visible">
          <defs>
            <linearGradient id="orbGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.highlightColor} />
              <stop offset="50%" stopColor={config.primaryColor} />
              <stop offset="100%" stopColor="#881100" />
            </linearGradient>

            <filter id="glowFilter1" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background circle track */}
          <circle
            cx="320"
            cy="320"
            r={circleRadius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="12"
            strokeDasharray="4 8"
          />

          {/* Active Glowing Circular Progress Track */}
          <circle
            cx="320"
            cy="320"
            r={circleRadius}
            fill="none"
            stroke="url(#orbGradient1)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 320 320)"
            filter="url(#glowFilter1)"
          />

          {/* Degree marks */}
          {Array.from({ length: 40 }).map((_, i) => {
            const angle = (i * 9 * Math.PI) / 180;
            const r1 = 224;
            const r2 = i % 4 === 0 ? 242 : 232;
            const x1 = 320 + r1 * Math.cos(angle);
            const y1 = 320 + r1 * Math.sin(angle);
            const x2 = 320 + r2 * Math.cos(angle);
            const y2 = 320 + r2 * Math.sin(angle);
            const isLit = (i / 40) * 100 <= circularProgress;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isLit ? config.highlightColor : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={i % 4 === 0 ? 2.5 : 1.2}
                opacity={isLit ? 0.95 : 0.35}
              />
            );
          })}
        </svg>
      </div>

      {/* Orbiting Satellite Data Nodes */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '560px',
          height: '560px',
          transform: `rotate(${ringRotation}deg)`,
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-full bg-orange-400 shadow-[0_0_12px_#ff7700]" />
          <span className="font-mono text-[10px] tracking-widest text-orange-300 bg-black/60 px-2.5 py-0.5 rounded border border-orange-500/30">
            01 // BIOSPHERE
          </span>
        </div>
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          width: '470px',
          height: '470px',
          transform: `rotate(${counterRotation}deg)`,
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_#ffaa00]" />
          <span className="font-mono text-[9px] tracking-widest text-amber-300/80 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
            LAMINAR SYNC
          </span>
        </div>
      </div>

      {/* Central Liquid Glass Orb Container */}
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: '300px',
          height: '300px',
          transform: `translate(${wobbleX}px, ${wobbleY}px)`,
        }}
      >
        <GlassContainer
          className="h-full w-full !rounded-full"
          borderGlowColor={config.glowColor}
          glowIntensity={1.4}
          blur={34}
          highlightOpacity={0.75}
          sheenOffset={(frame % 120) / 120}
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full">
            {/* Liquid interior */}
            <div
              className="absolute inset-4 rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 30%, rgba(255, 170, 0, 0.45) 0%, rgba(255, 85, 0, 0.25) 50%, rgba(10, 5, 2, 0.85) 100%)`,
                boxShadow: 'inset 0 0 45px rgba(255, 85, 0, 0.5), inset 0 0 18px rgba(255, 255, 255, 0.65)',
              }}
            />

            {/* Rotating incandescent core */}
            <div
              className="absolute h-40 w-40 rounded-full opacity-90 mix-blend-screen"
              style={{
                background: `conic-gradient(from ${coreRotation}deg, ${config.highlightColor}, ${config.primaryColor}, #ff2200, ${config.highlightColor})`,
                filter: 'blur(16px)',
                transform: `rotate(${coreRotation}deg) scale(${1 + 0.08 * Math.sin(frame * 0.1)})`,
              }}
            />

            {/* Glass bubble gloss reflections */}
            <div
              className="pointer-events-none absolute top-4 left-7 h-14 w-32 -rotate-30 rounded-[100%] bg-gradient-to-b from-white/70 via-white/20 to-transparent"
              style={{ filter: 'blur(1px)' }}
            />
            <div
              className="pointer-events-none absolute bottom-6 right-9 h-7 w-18 rotate-15 rounded-[100%] bg-white/25"
              style={{ filter: 'blur(2px)' }}
            />

            {/* Center percentage readout */}
            <div className="relative z-30 flex flex-col items-center justify-center">
              <span className="font-mono text-[11px] tracking-widest text-orange-300 uppercase opacity-80">
                ORB LOADER
              </span>
              <span className="font-mono text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,100,0,0.85)]">
                {Math.round(circularProgress)}%
              </span>
              <span className="mt-1 font-mono text-[9px] tracking-wider text-orange-400">
                FLOW RATE: 2.4 L/s
              </span>
            </div>
          </div>
        </GlassContainer>
      </div>

      {/* Corner showcase title badge */}
      <div className="absolute top-12 left-16 font-mono text-xs text-orange-400 tracking-widest flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="font-bold text-white text-sm">STYLE 01 // LIQUID BIOSPHERE</span>
        </div>
        <span className="text-[11px] text-zinc-400">CONCENTRIC GYROSCOPIC GLASS LOADER</span>
      </div>

      <div className="absolute bottom-12 right-16 font-mono text-right text-xs text-orange-400 tracking-widest">
        <span className="text-white font-semibold">1920x1080 @ 60 FPS</span>
        <div className="text-[10px] text-zinc-500">LIQUID GLASS REFRACTION // REMOTION</div>
      </div>
    </div>
  );
};
