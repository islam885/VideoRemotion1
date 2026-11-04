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

export const Scene5PowerCell: React.FC<SceneProps> = ({ customFrame, config }) => {
  const remotionFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rawFrame = customFrame !== undefined ? customFrame : remotionFrame;

  // Relative frame (0 to 300)
  const frame = rawFrame >= 1200 && rawFrame <= 1500 ? rawFrame - 1200 : rawFrame;

  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 90 },
  });

  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitSlide = interpolate(frame, [260, 300], [0, 60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  const exitOpacity = interpolate(frame, [270, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Power progress 0 to 1
  const powerProgress = interpolate(frame, [20, 255], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const totalCells = 8;
  const activeCells = Math.floor(powerProgress * totalCells);
  const currentCellFill = (powerProgress * totalCells) % 1;

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      style={{
        opacity: entranceOpacity * exitOpacity,
        transform: `translateY(${exitSlide}px) scale(${0.88 + 0.12 * entranceSpring})`,
      }}
    >
      <GlowEffect
        color={config.primaryColor}
        secondaryColor={config.highlightColor}
        x={50}
        y={50}
        size={800}
        intensity={0.5}
        pulsePhase={frame * 0.08}
      />

      {/* Showcase title badge */}
      <div className="mb-8 flex w-[980px] items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-bold text-white text-sm">STYLE 05 // SEGMENTED GLASS FUEL CELL</span>
          </div>
          <h2 className="mt-1 font-mono text-xl font-bold tracking-tight text-zinc-300">
            ANGLED HEAVY-BEVEL MODULAR POWER ARRAY
          </h2>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="font-mono text-6xl font-black tracking-tight text-white drop-shadow-[0_0_24px_#ff7700]">
            {(powerProgress * 100).toFixed(0)}%
          </span>
          <span className="font-mono text-xs tracking-wider text-orange-400">CHARGED</span>
        </div>
      </div>

      {/* 8 Chunky Glass Battery Cells */}
      <div className="flex gap-4 items-center justify-center w-[980px]">
        {Array.from({ length: totalCells }).map((_, i) => {
          const isFullyLit = i < activeCells;
          const isCurrent = i === activeCells;
          const cellLevel = isFullyLit ? 1 : isCurrent ? currentCellFill : 0;

          return (
            <div key={i} className="relative flex-1 h-[240px]">
              <GlassContainer
                className="h-full w-full !p-3 flex flex-col justify-between"
                borderGlowColor={config.glowColor}
                glowIntensity={cellLevel > 0 ? 1.4 : 0.4}
                blur={26}
                highlightOpacity={0.8}
                sheenOffset={(frame % 80) / 80}
              >
                {/* Cell Header with cell number */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 font-mono text-[10px]">
                  <span className={cellLevel > 0 ? 'text-orange-400 font-bold' : 'text-zinc-600'}>
                    C_0{i + 1}
                  </span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      cellLevel > 0 ? 'bg-orange-500 shadow-[0_0_6px_#ff7700]' : 'bg-white/10'
                    }`}
                  />
                </div>

                {/* Vertical Liquid Fill inside each glass cell */}
                <div className="relative flex-1 my-2 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex flex-col justify-end">
                  {cellLevel > 0 && (
                    <div
                      className="w-full transition-all rounded-b-xl relative overflow-hidden"
                      style={{
                        height: `${cellLevel * 100}%`,
                        background: 'linear-gradient(to top, #bb2200 0%, #ff5500 60%, #ffaa00 100%)',
                        boxShadow: '0 0 20px #ff7700, inset 0 0 10px rgba(255,255,255,0.6)',
                      }}
                    >
                      {/* Internal energy bubbles */}
                      <div
                        className="absolute inset-x-0 top-0 h-2 bg-white/70"
                        style={{ filter: 'blur(1px)' }}
                      />
                    </div>
                  )}
                </div>

                {/* Voltage rating indicator */}
                <div className="text-center font-mono text-[10px] text-zinc-400">
                  {cellLevel > 0 ? `${(cellLevel * 12.5).toFixed(1)} kV` : '0.0 kV'}
                </div>
              </GlassContainer>
            </div>
          );
        })}
      </div>

      {/* Footer Power Metrics */}
      <div className="mt-8 flex w-[980px] justify-between items-center font-mono text-xs text-zinc-400">
        <div>
          ACTIVE CELLS: <span className="text-orange-400 font-bold">{activeCells} / 8</span>
        </div>
        <div>
          TOTAL CAPACITY: <span className="text-white font-bold">100.0 kWh</span>
        </div>
        <div>
          CORE TEMPERATURE: <span className="text-emerald-400 font-bold">38.4°C // NOMINAL</span>
        </div>
      </div>
    </div>
  );
};
