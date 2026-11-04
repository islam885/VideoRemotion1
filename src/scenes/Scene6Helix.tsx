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

export const Scene6Helix: React.FC<SceneProps> = ({ customFrame, config }) => {
  const remotionFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rawFrame = customFrame !== undefined ? customFrame : remotionFrame;

  // Relative frame (0 to 300)
  const frame = rawFrame >= 1500 && rawFrame <= 1800 ? rawFrame - 1500 : rawFrame;

  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.85, stiffness: 95 },
  });

  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitScale = interpolate(frame, [270, 300], [1, 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  const exitOpacity = interpolate(frame, [275, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Helix progress from 0% to 100%
  const helixProgress = interpolate(frame, [20, 255], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const numNodes = 20;
  const cylinderWidth = 920;
  const cylinderHeight = 160;

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      style={{
        opacity: entranceOpacity * exitOpacity,
        transform: `scale(${(0.88 + 0.12 * entranceSpring) * exitScale})`,
      }}
    >
      <GlowEffect
        color={config.primaryColor}
        secondaryColor={config.highlightColor}
        x={50}
        y={50}
        size={820}
        intensity={0.52}
        pulsePhase={frame * 0.07}
      />

      {/* Header */}
      <div className="mb-8 flex w-[920px] items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-bold text-white text-sm">STYLE 06 // QUANTUM HELIX WAVE</span>
          </div>
          <h2 className="mt-1 font-mono text-xl font-bold tracking-tight text-zinc-300">
            INTERTWINED DOUBLE-STRAND LIQUID LIGHT
          </h2>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="font-mono text-6xl font-black tracking-tight text-white drop-shadow-[0_0_24px_#ff7700]">
            {(helixProgress * 100).toFixed(0)}%
          </span>
          <span className="font-mono text-xs tracking-wider text-orange-400">SYNTHESIS</span>
        </div>
      </div>

      {/* Cylindrical Glass Chamber with Double Helix */}
      <div className="relative w-[920px] h-[160px]">
        <GlassContainer
          className="h-full w-full !rounded-3xl"
          borderGlowColor={config.glowColor}
          glowIntensity={1.35}
          blur={30}
          highlightOpacity={0.8}
          sheenOffset={(frame % 90) / 90}
        >
          <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
            <svg
              width={cylinderWidth}
              height={cylinderHeight}
              viewBox={`0 0 ${cylinderWidth} ${cylinderHeight}`}
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="helixGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff3300" />
                  <stop offset="60%" stopColor={config.primaryColor} />
                  <stop offset="100%" stopColor={config.highlightColor} />
                </linearGradient>
              </defs>

              {/* Rungs connecting the two strands */}
              {Array.from({ length: numNodes }).map((_, i) => {
                const nodeX = (i / (numNodes - 1)) * (cylinderWidth - 100) + 50;
                const phase = frame * 0.08 + i * 0.45;
                const sinVal = Math.sin(phase);
                const y1 = 80 + sinVal * 45;
                const y2 = 80 - sinVal * 45;
                const isLit = i / (numNodes - 1) <= helixProgress;

                return (
                  <g key={i}>
                    {/* Connecting strand rung */}
                    <line
                      x1={nodeX}
                      y1={y1}
                      x2={nodeX}
                      y2={y2}
                      stroke={isLit ? 'rgba(255, 170, 0, 0.7)' : 'rgba(255, 255, 255, 0.1)'}
                      strokeWidth={isLit ? 2.5 : 1}
                      strokeDasharray={isLit ? 'none' : '2 4'}
                    />

                    {/* Strand 1 Node */}
                    <circle
                      cx={nodeX}
                      cy={y1}
                      r={isLit ? 6 + Math.abs(sinVal) * 2 : 4}
                      fill={isLit ? config.highlightColor : 'rgba(255, 255, 255, 0.2)'}
                      style={{
                        filter: isLit ? 'drop-shadow(0 0 8px #ff7700)' : 'none',
                      }}
                    />

                    {/* Strand 2 Node */}
                    <circle
                      cx={nodeX}
                      cy={y2}
                      r={isLit ? 6 + Math.abs(sinVal) * 2 : 4}
                      fill={isLit ? config.primaryColor : 'rgba(255, 255, 255, 0.2)'}
                      style={{
                        filter: isLit ? 'drop-shadow(0 0 8px #ff5500)' : 'none',
                      }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </GlassContainer>
      </div>

      {/* Footer Metrics */}
      <div className="mt-8 flex w-[920px] justify-between items-center font-mono text-xs text-zinc-400">
        <div>
          MOLECULAR STRANDS: <span className="text-orange-400 font-bold">ALPHA & BETA // ALIGNED</span>
        </div>
        <div>
          HELIX FREQUENCY: <span className="text-amber-300 font-bold">60 Hz WAVE</span>
        </div>
        <div>
          COHERENCE: <span className="text-emerald-400 font-bold">99.98%</span>
        </div>
      </div>
    </div>
  );
};
