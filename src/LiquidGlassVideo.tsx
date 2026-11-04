import React from 'react';
import { Sequence, Audio, staticFile, useCurrentFrame } from 'remotion';
import { CyberBackground } from './components/GlowEffect';
import { Scene1Orb } from './scenes/Scene1Orb';
import { Scene2Bar } from './scenes/Scene2Bar';
import { Scene3Matrix } from './scenes/Scene3Matrix';
import { Scene4Dial } from './scenes/Scene4Dial';
import { Scene5PowerCell } from './scenes/Scene5PowerCell';
import { Scene6Helix } from './scenes/Scene6Helix';
import { Scene7Harmonization } from './scenes/Scene7Harmonization';
import { defaultVideoConfig, type VideoConfigProps } from './config/videoConfig';

export interface MainProps {
  config?: Partial<VideoConfigProps>;
}

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
      {/* Dynamic Cyberpunk Ambient Atmosphere */}
      <CyberBackground
        primaryColor={config.primaryColor}
        secondaryColor={config.secondaryColor}
        frame={frame}
      />

      {/* ==================== 7 DISTINCT PROGRESS SCENES ==================== */}

      {/* 1. Liquid Glass Biosphere & Concentric Loader (0 to 300 frames, 0 - 5.0s) */}
      <Sequence from={0} durationInFrames={300} name="Style 1: Liquid Biosphere">
        <Scene1Orb config={config} />
      </Sequence>

      {/* 2. Dual-Chamber Glass Capsule & Viscous Wave (300 to 600 frames, 5.0 - 10.0s) */}
      <Sequence from={300} durationInFrames={300} name="Style 2: Viscous Wave Capsule">
        <Scene2Bar config={config} />
      </Sequence>

      {/* 3. Honeycomb Cyber Hex Matrix (600 to 900 frames, 10.0 - 15.0s) */}
      <Sequence from={600} durationInFrames={300} name="Style 3: Hex Matrix">
        <Scene3Matrix config={config} />
      </Sequence>

      {/* 4. Radial Audio-Wave Dial (900 to 1200 frames, 15.0 - 20.0s) */}
      <Sequence from={900} durationInFrames={300} name="Style 4: Radial Dial">
        <Scene4Dial config={config} />
      </Sequence>

      {/* 5. Segmented Glass Fuel Cell (1200 to 1500 frames, 20.0 - 25.0s) */}
      <Sequence from={1200} durationInFrames={300} name="Style 5: Power Fuel Cell">
        <Scene5PowerCell config={config} />
      </Sequence>

      {/* 6. Quantum Double Helix (1500 to 1800 frames, 25.0 - 30.0s) */}
      <Sequence from={1500} durationInFrames={300} name="Style 6: Quantum Helix">
        <Scene6Helix config={config} />
      </Sequence>

      {/* 7. Grand Harmonization 100% Complete & Outro (1800 to 2100 frames, 30.0 - 35.0s) */}
      <Sequence from={1800} durationInFrames={300} name="Style 7: Grand Harmonization">
        <Scene7Harmonization config={config} />
      </Sequence>

      {/* ==================== PRECISE SFX AUDIO TRACKS ==================== */}

      {/* Transitions Whoosh sounds */}
      <Sequence from={0} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.8} />
      </Sequence>
      <Sequence from={295} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.75} />
      </Sequence>
      <Sequence from={595} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.8} />
      </Sequence>
      <Sequence from={895} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.8} />
      </Sequence>
      <Sequence from={1195} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.8} />
      </Sequence>
      <Sequence from={1495} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.8} />
      </Sequence>
      <Sequence from={1795} durationInFrames={60}>
        <Audio src={whooshAudio} volume={0.85} />
      </Sequence>

      {/* Tactile clicks during scene progressions */}
      <Sequence from={80} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={160} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={380} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={460} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={680} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={760} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={980} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={1060} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={1280} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={1360} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={1580} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>
      <Sequence from={1660} durationInFrames={20}>
        <Audio src={glassTickAudio} volume={0.45} />
      </Sequence>

      {/* Climax charge before 100% harmonization (frame 1780 to 1840) */}
      <Sequence from={1775} durationInFrames={70}>
        <Audio src={chargeAudio} volume={0.9} />
      </Sequence>

      {/* Grand success chime upon shockwave burst at frame 1840 */}
      <Sequence from={1840} durationInFrames={160}>
        <Audio src={successChimeAudio} volume={1.0} />
      </Sequence>
    </div>
  );
};

export { LiquidGlassVideo as Main };
