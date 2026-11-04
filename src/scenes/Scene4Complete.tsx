import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { GlassContainer } from '../components/GlassContainer';
import { GlowEffect } from '../components/GlowEffect';
import { computeShockwave, easeOutCubic } from '../utils/transitions';
import type { VideoConfigProps } from '../config/videoConfig';

export interface SceneProps {
  customFrame?: number;
  config: VideoConfigProps;
}

export const Scene4Complete: React.FC<SceneProps> = ({ customFrame, config }) => {
  const remotionFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rawFrame = customFrame !== undefined ? customFrame : remotionFrame;

  // Relative frame within this scene (0 to 360)
  const frame = rawFrame >= 840 && rawFrame <= 1200 ? rawFrame - 840 : rawFrame;

  // Burst starts at frame 40 (total frame 880)
  const burstFrame = 40;
  const isPostBurst = frame >= burstFrame;

  // Shockwave ring expansion calculation
  const shockwave = computeShockwave(frame, burstFrame, 65, 850);
  const secondaryShockwave = computeShockwave(frame, burstFrame + 10, 55, 650);

  // Entrance spring for the completed emblem
  const emblemSpring = spring({
    frame: Math.max(0, frame - burstFrame),
    fps,
    config: { damping: 12, mass: 0.9, stiffness: 110 },
  });

  // Outro transition (frames 270 to 360 = 1110 to 1200 total)
  const outroBlur = interpolate(frame, [270, 360], [0, 48], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const outroOpacity = interpolate(frame, [285, 360], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  const outroScale = interpolate(frame, [270, 360], [1, 0.92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Deterministic radial sparks
  const particles = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => {
      const angle = (i / 32) * 2 * Math.PI + (i % 2 === 0 ? 0.05 : -0.05);
      const speed = 400 + ((i * 37) % 300);
      const size = 3 + (i % 4);
      return { angle, speed, size };
    });
  }, []);

  // Flash brightness spike at burst moment
  const flashOpacity = interpolate(frame, [burstFrame, burstFrame + 6, burstFrame + 28], [0, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        opacity: outroOpacity,
        filter: `blur(${outroBlur}px)`,
        transform: `scale(${outroScale})`,
      }}
    >
      {/* Background Central Core Radiance */}
      <GlowEffect
        color={config.primaryColor}
        secondaryColor={config.highlightColor}
        x={50}
        y={50}
        size={isPostBurst ? 900 : 500}
        intensity={isPostBurst ? 0.75 : 0.4}
        pulsePhase={frame * 0.07}
      />

      {/* Screen flash at burst */}
      {flashOpacity > 0 && (
        <div
          className="pointer-events-none absolute inset-0 z-50 bg-gradient-to-r from-orange-500/80 via-white/90 to-amber-400/80 mix-blend-screen"
          style={{ opacity: flashOpacity }}
        />
      )}

      {/* Shockwave Rings */}
      {shockwave.active && (
        <div
          className="pointer-events-none absolute rounded-full border border-orange-400"
          style={{
            width: `${shockwave.radius * 2}px`,
            height: `${shockwave.radius * 2}px`,
            borderWidth: `${shockwave.strokeWidth}px`,
            opacity: shockwave.opacity,
            boxShadow: `0 0 35px 8px rgba(255, 120, 0, ${shockwave.opacity * 0.8})`,
          }}
        />
      )}

      {secondaryShockwave.active && (
        <div
          className="pointer-events-none absolute rounded-full border border-amber-300"
          style={{
            width: `${secondaryShockwave.radius * 2}px`,
            height: `${secondaryShockwave.radius * 2}px`,
            borderWidth: `${secondaryShockwave.strokeWidth * 0.6}px`,
            opacity: secondaryShockwave.opacity * 0.7,
            boxShadow: `0 0 25px 5px rgba(255, 200, 50, ${secondaryShockwave.opacity * 0.6})`,
          }}
        />
      )}

      {/* Radial Burst Particle Sparks */}
      {isPostBurst && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {particles.map((p, idx) => {
            const timeSinceBurst = (frame - burstFrame) / 60; // seconds
            const distance = Math.min(800, p.speed * timeSinceBurst * Math.pow(0.5, timeSinceBurst));
            const x = Math.cos(p.angle) * distance;
            const y = Math.sin(p.angle) * distance;
            const particleOpacity = Math.max(0, 1 - timeSinceBurst * 1.6);

            return particleOpacity > 0 ? (
              <div
                key={idx}
                className="absolute rounded-full bg-amber-200"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size * 2.5}px`,
                  transform: `translate(${x}px, ${y}px) rotate(${p.angle + Math.PI / 2}rad)`,
                  opacity: particleOpacity,
                  boxShadow: '0 0 10px #ff7700, 0 0 20px #ffaa00',
                }}
              />
            ) : null;
          })}
        </div>
      )}

      {/* Pre-burst countdown pulse (frames 0 to 40) */}
      {!isPostBurst && (
        <div className="flex flex-col items-center">
          <div className="font-mono text-sm tracking-widest text-orange-400 mb-2">SYNCHRONIZING SYSTEM CORES</div>
          <div className="font-mono text-7xl font-black text-white drop-shadow-[0_0_25px_#ff5500]">
            {(96 + (frame / burstFrame) * 4).toFixed(0)}%
          </div>
        </div>
      )}

      {/* Post-burst: Monolithic Liquid Glass Emblem «COMPLETED / SYSTEM READY» */}
      {isPostBurst && (
        <div
          className="relative flex flex-col items-center"
          style={{
            transform: `scale(${emblemSpring})`,
          }}
        >
          {/* Emblem Container */}
          <div className="relative w-[760px] h-[440px]">
            <GlassContainer
              className="h-full w-full !p-10 flex flex-col items-center justify-between"
              borderGlowColor="rgba(255, 120, 0, 0.6)"
              glowIntensity={1.5}
              blur={36}
              highlightOpacity={0.8}
              sheenOffset={(frame % 120) / 120}
            >
              {/* Top Security & Protocol Badges */}
              <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <span className="font-mono text-xs text-emerald-300 font-bold tracking-widest">
                    SYSTEM SECURE // INTEGRITY VERIFIED
                  </span>
                </div>
                <div className="font-mono text-xs text-orange-400/90 tracking-wider">
                  TIME: 00:20:00 // 60 FPS
                </div>
              </div>

              {/* Center Emblem Icon & Hero Title */}
              <div className="my-auto flex flex-col items-center text-center">
                {/* Glowing Liquid Glass Checkmark Hexagon Shield */}
                <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-300 opacity-30 blur-md animate-pulse" />
                  <div className="relative flex h-18 w-18 items-center justify-center rounded-2xl border-2 border-white/40 bg-white/10 shadow-[0_0_24px_rgba(255,100,0,0.6)] backdrop-blur-xl">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-300 drop-shadow-[0_0_10px_#ffaa00]">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                {/* Hero Title */}
                <h1 className="font-mono text-5xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,100,0,0.85)]">
                  {config.completionTitle}
                </h1>

                {/* Subtitle */}
                <p className="mt-2 font-mono text-sm tracking-widest text-orange-300/90 font-semibold drop-shadow-[0_0_10px_rgba(255,85,0,0.5)]">
                  {config.completionSubtitle}
                </p>
              </div>

              {/* Footer System Hash and Certification */}
              <div className="w-full flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs text-zinc-400">
                <span>HASH: 0x8F9C...E4B1</span>
                <span className="text-orange-400 font-semibold">{config.brandName}</span>
                <span>EXECUTION: 100% OK</span>
              </div>
            </GlassContainer>
          </div>
        </div>
      )}
    </div>
  );
};
