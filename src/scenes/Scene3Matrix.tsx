import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { GlassContainer } from '../components/GlassContainer';
import { GlowEffect } from '../components/GlowEffect';
import { computeHexGlow, easeOutCubic } from '../utils/transitions';
import type { VideoConfigProps } from '../config/videoConfig';

export interface SceneProps {
  customFrame?: number;
  config: VideoConfigProps;
}

export const Scene3Matrix: React.FC<SceneProps> = ({ customFrame, config }) => {
  const remotionFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rawFrame = customFrame !== undefined ? customFrame : remotionFrame;

  // Relative frame (0 to 300)
  const frame = rawFrame >= 540 && rawFrame <= 840 ? rawFrame - 540 : rawFrame;

  // Entrance spring & opacity
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.8, stiffness: 100 },
  });

  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit transition
  const exitScale = interpolate(frame, [270, 300], [1, 1.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  const exitOpacity = interpolate(frame, [275, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Matrix progression from 0 to 1 over frames 15 to 260
  const matrixProgress = interpolate(frame, [15, 255], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 24 cyber grid nodes (4 rows x 6 cols)
  const rows = 4;
  const cols = 6;
  const totalNodes = rows * cols;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        opacity: entranceOpacity * exitOpacity,
        transform: `scale(${(0.88 + 0.12 * entranceSpring) * exitScale})`,
      }}
    >
      {/* Background Ambient Glow */}
      <GlowEffect
        color={config.primaryColor}
        secondaryColor={config.secondaryColor}
        x={50}
        y={50}
        size={780}
        intensity={0.45 + 0.25 * matrixProgress}
        pulsePhase={frame * 0.06}
      />

      {/* Main Glass Panel Structure */}
      <div className="relative w-[1080px] h-[620px]">
        <GlassContainer
          className="h-full w-full !p-8 flex flex-col justify-between"
          borderGlowColor={config.glowColor}
          glowIntensity={1.25}
          blur={32}
          sheenOffset={(frame % 100) / 100}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-sm bg-orange-500 shadow-[0_0_10px_#ff5500] animate-pulse" />
              <div>
                <span className="font-mono text-xs text-orange-400 tracking-widest block">
                  STAGE 03 // HEX_MATRIX_ARRAY
                </span>
                <h3 className="font-mono text-lg font-bold text-white tracking-wide">
                  QUANTUM GLASS MESH // 24-NODE GRID
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="text-zinc-400">
                ACTIVE NODES: <strong className="text-orange-400">{Math.floor(matrixProgress * totalNodes)} / {totalNodes}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-300 font-bold">
                MESH_SYNC: {(matrixProgress * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Center 4x6 Hexagonal Cyber Matrix */}
          <div className="my-auto grid grid-cols-6 gap-5 px-6">
            {Array.from({ length: totalNodes }).map((_, index) => {
              const { intensity, isLit, scale } = computeHexGlow(index, totalNodes, matrixProgress, 0.75);

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all"
                  style={{
                    background: isLit
                      ? `linear-gradient(135deg, rgba(255, 85, 0, ${0.15 * intensity}) 0%, rgba(20, 10, 5, 0.6) 100%)`
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isLit
                      ? `1px solid rgba(255, 120, 0, ${0.7 * intensity})`
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isLit
                      ? `0 0 ${24 * intensity}px rgba(255, 85, 0, ${0.5 * intensity}), inset 0 0 14px rgba(255, 120, 0, ${0.3 * intensity})`
                      : 'none',
                    transform: `scale(${scale})`,
                  }}
                >
                  {/* Hexagon shape SVG */}
                  <svg width="40" height="44" viewBox="0 0 40 44" className="overflow-visible">
                    <polygon
                      points="20,2 38,12 38,32 20,42 2,32 2,12"
                      fill={isLit ? config.primaryColor : 'none'}
                      fillOpacity={isLit ? 0.3 * intensity : 0}
                      stroke={isLit ? config.highlightColor : 'rgba(255, 255, 255, 0.2)'}
                      strokeWidth={isLit ? 2 : 1}
                      style={{
                        filter: isLit ? 'drop-shadow(0 0 8px #ff7700)' : 'none',
                      }}
                    />
                    {isLit && (
                      <circle
                        cx="20"
                        cy="22"
                        r="3.5"
                        fill="#fff"
                        style={{ filter: 'drop-shadow(0 0 4px #ffaa00)' }}
                      />
                    )}
                  </svg>

                  <span
                    className={`mt-2 font-mono text-[10px] tracking-widest ${
                      isLit ? 'text-amber-200 font-bold' : 'text-zinc-600'
                    }`}
                  >
                    N_{(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Floating Glass Status Cards Footer */}
          <div className="flex items-center justify-between gap-6 pt-3 border-t border-white/10">
            {/* Left Card: Buffering indicator */}
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
              <div className="flex items-end gap-1 h-5 w-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-orange-400"
                    style={{
                      height: `${40 + 50 * Math.abs(Math.sin(frame * 0.15 + i * 0.8))}%`,
                    }}
                  />
                ))}
              </div>
              <div className="font-mono text-[11px]">
                <span className="text-zinc-400 block">BUFFER_STREAM</span>
                <span className="text-white font-bold">16.4 GB CACHED</span>
              </div>
            </div>

            {/* Center Status Notification */}
            <div className="font-mono text-xs text-orange-300/90 tracking-widest flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <span>INTERCONNECT: ZERO_PACKET_LOSS</span>
            </div>

            {/* Right Card: Throughput Bandwidth */}
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
              <div className="font-mono text-right text-[11px]">
                <span className="text-zinc-400 block">THROUGHPUT</span>
                <span className="text-amber-300 font-bold">
                  {(420 + 60 * matrixProgress).toFixed(0)} Gbps
                </span>
              </div>
              <div className="h-6 w-6 rounded-full border-2 border-orange-500/40 border-t-orange-400 animate-spin" />
            </div>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};
