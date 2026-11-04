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

  // Scene duration: 240 frames (0 to 4s)
  // 1. Drop assembly entrance (frames 0 to 60)
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 100 },
  });

  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scale from 0.7 to 1.0, then smooth transition zoom at the end (frames 200 to 240)
  const exitZoom = interpolate(frame, [190, 240], [1.0, 1.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  const exitBlur = interpolate(frame, [200, 240], [0, 20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitOpacity = interpolate(frame, [215, 240], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const overallScale = (0.7 + 0.3 * entranceSpring) * exitZoom;

  // Rotation of the inner liquid core
  const coreRotation = frame * 1.5;
  const ringRotation = frame * 0.8;
  const counterRotation = -frame * 1.2;

  // Circular progress loader value (0 to 100%)
  const circularProgress = interpolate(frame, [30, 210], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Liquid wobble offset
  const wobbleX = Math.sin(frame * 0.08) * 8;
  const wobbleY = Math.cos(frame * 0.07) * 8;

  // Circumference of 360px circle = 2 * PI * 180 ≈ 1130.97
  const circleRadius = 180;
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
      {/* Background ambient light burst */}
      <GlowEffect
        color={config.primaryColor}
        secondaryColor={config.highlightColor}
        x={50}
        y={50}
        size={600}
        intensity={0.5 + 0.3 * entranceSpring}
        pulsePhase={frame * 0.05}
      />

      {/* Outer Tachometer / Circular Speedometer Track */}
      <div className="absolute flex items-center justify-center pointer-events-none">
        <svg width="600" height="600" viewBox="0 0 600 600" className="overflow-visible">
          <defs>
            <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.highlightColor} />
              <stop offset="50%" stopColor={config.primaryColor} />
              <stop offset="100%" stopColor="#881100" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background circle track */}
          <circle
            cx="300"
            cy="300"
            r={circleRadius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth="10"
            strokeDasharray="4 8"
          />

          {/* Active Glowing Circular Progress Track */}
          <circle
            cx="300"
            cy="300"
            r={circleRadius}
            fill="none"
            stroke="url(#orbGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 300 300)"
            filter="url(#glowFilter)"
          />

          {/* Ticks and degree marks around speedometer */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const r1 = 210;
            const r2 = i % 3 === 0 ? 226 : 218;
            const x1 = 300 + r1 * Math.cos(angle);
            const y1 = 300 + r1 * Math.sin(angle);
            const x2 = 300 + r2 * Math.cos(angle);
            const y2 = 300 + r2 * Math.sin(angle);
            const isLit = (i / 36) * 100 <= circularProgress;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isLit ? config.highlightColor : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={i % 3 === 0 ? 2.5 : 1.2}
                opacity={isLit ? 0.9 : 0.4}
              />
            );
          })}
        </svg>
      </div>

      {/* Orbiting Satellite Data Nodes */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '520px',
          height: '520px',
          transform: `rotate(${ringRotation}deg)`,
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-400 shadow-[0_0_12px_#ff7700]" />
          <span className="font-mono text-[10px] tracking-widest text-orange-300/80 bg-black/60 px-2 py-0.5 rounded border border-orange-500/30">
            RAD_01
          </span>
        </div>
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          width: '440px',
          height: '440px',
          transform: `rotate(${counterRotation}deg)`,
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_#ffaa00]" />
          <span className="font-mono text-[9px] tracking-widest text-amber-300/70 bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30">
            SYNC_NODE
          </span>
        </div>
      </div>

      {/* Central Liquid Glass Orb Container */}
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: '280px',
          height: '280px',
          transform: `translate(${wobbleX}px, ${wobbleY}px)`,
        }}
      >
        {/* Outer Specular Glass Sphere Shell */}
        <GlassContainer
          className="h-full w-full !rounded-full"
          borderGlowColor={config.glowColor}
          glowIntensity={1.3}
          blur={32}
          highlightOpacity={0.7}
          sheenOffset={(frame % 120) / 120}
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full">
            {/* Liquid Interior with refraction distortion */}
            <div
              className="absolute inset-4 rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 30%, rgba(255, 170, 0, 0.45) 0%, rgba(255, 85, 0, 0.25) 50%, rgba(10, 5, 2, 0.8) 100%)`,
                boxShadow: 'inset 0 0 40px rgba(255, 85, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.6)',
              }}
            />

            {/* Rotating Cyber Liquid Plasma Core */}
            <div
              className="absolute h-36 w-36 rounded-full opacity-90 mix-blend-screen"
              style={{
                background: `conic-gradient(from ${coreRotation}deg, ${config.highlightColor}, ${config.primaryColor}, #ff2200, ${config.highlightColor})`,
                filter: 'blur(16px)',
                transform: `rotate(${coreRotation}deg) scale(${1 + 0.08 * Math.sin(frame * 0.1)})`,
              }}
            />

            {/* Glossy Curved Glass Bubble Reflection Highlights */}
            <div
              className="pointer-events-none absolute top-4 left-6 h-12 w-28 -rotate-30 rounded-[100%] bg-gradient-to-b from-white/70 via-white/20 to-transparent"
              style={{ filter: 'blur(1px)' }}
            />
            <div
              className="pointer-events-none absolute bottom-5 right-8 h-6 w-16 rotate-15 rounded-[100%] bg-white/20"
              style={{ filter: 'blur(2px)' }}
            />

            {/* Digital Telemetry Readout in Orb Center */}
            <div className="relative z-30 flex flex-col items-center justify-center">
              <span className="font-mono text-[10px] tracking-widest text-orange-300 uppercase opacity-75">
                INITIALIZING
              </span>
              <span className="font-mono text-4xl font-extrabold tracking-tighter text-white drop-shadow-[0_0_16px_rgba(255,100,0,0.8)]">
                {Math.round(circularProgress)}%
              </span>
              <span className="mt-1 font-mono text-[9px] tracking-wider text-orange-400/90">
                CORE_ID: ORB-9X
              </span>
            </div>
          </div>
        </GlassContainer>
      </div>

      {/* Cyberpunk HUD Corner Metadata */}
      <div className="absolute top-12 left-16 font-mono text-xs text-orange-400/80 tracking-widest flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span>PHASE 01 // ORB_ASSEMBLY</span>
        </div>
        <span className="text-[10px] text-zinc-500">TIMESTAMP: {(frame / fps).toFixed(2)}s</span>
      </div>

      <div className="absolute bottom-12 right-16 font-mono text-right text-xs text-orange-400/80 tracking-widest">
        <span>{config.brandName}</span>
        <div className="text-[10px] text-zinc-500">{config.systemTag}</div>
      </div>
    </div>
  );
};
