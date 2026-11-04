/**
 * Liquid Glass Showcase Configuration
 * 35-second multi-style progress showreel (2100 frames @ 60 FPS)
 */

export interface VideoConfigProps {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;

  // Theme & Colors
  primaryColor: string; // Neon Orange (#FF5500)
  secondaryColor: string; // Warm Amber / Tangerine (#FF7700)
  highlightColor: string; // Incandescent Core (#FFAA00)
  glowColor: string; // Ambient Glow
  bgColor: string; // Graphite Black (#050505)

  // Showcase Titles
  showcaseTitle: string;
  completionTitle: string;
  completionSubtitle: string;

  // Visual filters
  blurStrength: number;
}

export const defaultVideoConfig: VideoConfigProps = {
  fps: 60,
  durationInFrames: 2100, // 35.0 seconds @ 60fps
  width: 1920,
  height: 1080,

  primaryColor: '#FF5500',
  secondaryColor: '#FF7700',
  highlightColor: '#FFAA00',
  glowColor: 'rgba(255, 85, 0, 0.45)',
  bgColor: '#050505',

  showcaseTitle: 'LIQUID GLASS // PROGRESS SHOWCASE',
  completionTitle: 'ALL SYSTEMS COMPLETE',
  completionSubtitle: '7 DIVERSE LIQUID GLASS PROGRESS ARCHETYPES // 100% SYNC',

  blurStrength: 28,
};
