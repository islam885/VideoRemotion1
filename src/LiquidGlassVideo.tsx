import React from 'react';
import { Sequence, Audio, staticFile, useCurrentFrame } from 'remotion';
import { CyberBackground } from './components/GlowEffect';
import { Scene1Orb } from './scenes/Scene1Orb';
import { Scene2Bar } from './scenes/Scene2Bar';
import { Scene3Matrix } from './scenes/Scene3Matrix';
import { Scene4Complete } from './scenes/Scene4Complete';
import { defaultVideoConfig, type VideoConfigProps } from './config/videoConfig';

export interface MainProps {
  config?: Partial<VideoConfigProps>;
}

// Helper to resolve static audio files both in Remotion CLI and Vite preview
const getAudioPath = (filename: string): string => {
  try {
    return staticFile(`audio/${filename}`);
  } catch {
    return `/audio/${filename}`;
  }
};

export const LiquidGlassVideo: React.FC<MainProps> = ({ config: customConfig }) => {
  const frame = useCurrentFrame();
  const config: VideoConfigProps = {
    ...defaultVideoConfig,
    ...customConfig,
  };

  const whooshAudio = getAudioPath('whoosh.wav');
  const glassTickAudio = getAudioPath('glass_tick.wav');
  const chargeAudio = getAudioPath('charge.wav');
  const successChimeAudio = getAudioPath('success_chime.wav');

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#050505] font-sans select-none"
      style={{
        width: '1920px',
        height: '1080px',
      }}
    >
      {/* Dynamic Cyberpunk Ambient Atmosphere with pulsing lights */}
      <CyberBackground
        primaryColor={config.primaryColor}
        secondaryColor={config.secondaryColor}
        frame={frame}
      />

      {/* SVG Chromatic Aberration & Lens Filter */}
      <svg className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id="liquidChromatic" x="-5%" y="-5%" width="110%" height="110%">
            <feOffset in="SourceGraphic" dx="1.5" dy="0" result="redOffset" />
            <feOffset in="SourceGraphic" dx="-1.5" dy="0" result="blueOffset" />
            <feBlend mode="screen" in="redOffset" in2="blueOffset" />
          </filter>
        </defs>
      </svg>

      {/* ==================== SCENE SEQUENCES ==================== */}

      {/* Scene 1: Liquid Glass Orb & Circular Loader (0 to 240 frames, 0 - 4s) */}
      <Sequence from={0} durationInFrames={240} name="Scene 1: Liquid Orb">
        <Scene1Orb config={config} />
      </Sequence>

      {/* Scene 2: Linear Glass Capsule / Multi-segment Bar (240 to 540 frames, 4 - 9s) */}
      <Sequence from={240} durationInFrames={300} name="Scene 2: Linear Bar">
        <Scene2Bar config={config} />
      </Sequence>

      {/* Scene 3: Hexagonal / Cyber Matrix Progress (540 to 840 frames, 9 - 14s) */}
      <Sequence from={540} durationInFrames={300} name="Scene 3: Cyber Matrix">
        <Scene3Matrix config={config} />
      </Sequence>

      {/* Scene 4: Radial Burst & Morphing Complete + Outro (840 to 1200 frames, 14 - 20s) */}
      <Sequence from={840} durationInFrames={360} name="Scene 4: Burst & Ready">
        <Scene4Complete config={config} />
      </Sequence>

      {/* ==================== PRECISE SFX AUDIO TRACKS ==================== */}

      {/* Scene Entrance Whooshes */}
      <Sequence from={0} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.8} />
      </Sequence>

      <Sequence from={235} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.75} />
      </Sequence>

      <Sequence from={535} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.8} />
      </Sequence>

      <Sequence from={835} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.85} />
      </Sequence>

      {/* Tactile Glass Clicks along progress milestones */}
      <Sequence from={60} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.5} />
      </Sequence>
      <Sequence from={120} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.5} />
      </Sequence>
      <Sequence from={180} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.5} />
      </Sequence>

      {/* Scene 2 Segment Fills */}
      <Sequence from={300} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.4} />
      </Sequence>
      <Sequence from={360} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={420} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.5} />
      </Sequence>
      <Sequence from={480} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.55} />
      </Sequence>

      {/* Scene 3 Matrix Node Sparks */}
      <Sequence from={600} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.4} />
      </Sequence>
      <Sequence from={660} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={720} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.5} />
      </Sequence>

      {/* Climax Rising Power Charge (frame 820 to 880) */}
      <Sequence from={810} durationInFrames={80}>
        <Audio src={chargeAudio} volume={0.9} />
      </Sequence>

      {/* Completion Chime upon Shockwave Burst at frame 880 */}
      <Sequence from={880} durationInFrames={140}>
        <Audio src={successChimeAudio} volume={1.0} />
      </Sequence>
    </div>
  );
};

export { LiquidGlassVideo as Main };

