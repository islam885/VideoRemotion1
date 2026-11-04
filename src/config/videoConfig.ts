/**
 * Liquid Glass Promo Video Configuration
 * Allows dynamic customization via environment variables or runtime props.
 */

// Safe helper for environment variable retrieval in both Node (SSR/render) and Vite (browser)
const getEnv = (key: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  // Vite client env support
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const viteKey = `VITE_${key}`;
    if ((import.meta as any).env[viteKey]) {
      return (import.meta as any).env[viteKey];
    }
    if ((import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  }
  return fallback;
};

export interface VideoConfigProps {
  // Video core specs
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;

  // Theme & Color Palette
  primaryColor: string; // Neon Orange Accent (e.g., #FF5500)
  secondaryColor: string; // Warm Amber / Tangerine (e.g., #FF7700)
  highlightColor: string; // Bright Core Light (e.g., #FFAA00)
  glowColor: string; // Deep Warm Amber Glow (e.g., rgba(255, 85, 0, 0.45))
  bgColor: string; // Deep Black/Graphite background (#050505)
  cardBg: string; // Glassmorphism backdrop color

  // Titles & Branding
  brandName: string;
  systemTag: string;
  completionTitle: string;
  completionSubtitle: string;

  // Visual features
  enableChromaticAberration: boolean;
  enableNoiseTexture: boolean;
  blurStrength: number;
}

export const defaultVideoConfig: VideoConfigProps = {
  fps: 60,
  durationInFrames: 1200, // 20.0 seconds
  width: 1920,
  height: 1080,

  primaryColor: getEnv('REMOTION_ACCENT_COLOR', '#FF5500'),
  secondaryColor: getEnv('REMOTION_SECONDARY_COLOR', '#FF7700'),
  highlightColor: getEnv('REMOTION_HIGHLIGHT_COLOR', '#FFAA00'),
  glowColor: getEnv('REMOTION_GLOW_COLOR', 'rgba(255, 85, 0, 0.45)'),
  bgColor: getEnv('REMOTION_BG_COLOR', '#050505'),
  cardBg: 'rgba(255, 255, 255, 0.03)',

  brandName: getEnv('REMOTION_BRAND_NAME', 'NEURAL_GLASS // OS'),
  systemTag: getEnv('REMOTION_SYSTEM_TAG', 'PROTOCOL 4.2.0-STABLE'),
  completionTitle: getEnv('REMOTION_COMPLETION_TITLE', 'SYSTEM READY'),
  completionSubtitle: getEnv('REMOTION_COMPLETION_SUBTITLE', 'LIQUID CORE SYNCHRONIZATION 100%'),

  enableChromaticAberration: true,
  enableNoiseTexture: true,
  blurStrength: 28,
};
