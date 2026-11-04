/**
 * Animation and interpolation mathematics for Liquid Glass Promo.
 * Provides pure mathematical easing, spring physics, liquid wave coordinates, and matrix sequencing.
 */

export interface SpringConfig {
  damping?: number;
  mass?: number;
  stiffness?: number;
}

export const defaultSpringConfig: Required<SpringConfig> = {
  damping: 14,
  mass: 1.0,
  stiffness: 120,
};

/**
 * Standard cubic ease out: starts fast and softly decelerates.
 */
export function easeOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Smooth quadratic ease in-out
 */
export function easeInOutQuad(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5 ? 2 * clamped * clamped : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
}

/**
 * Elastic overshoot for organic liquid splash / glass settling
 */
export function easeOutElastic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  if (clamped === 0 || clamped === 1) return clamped;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * clamped) * Math.sin((clamped * 10 - 0.75) * c4) + 1;
}

/**
 * Pure mathematical spring simulation.
 * Computes displacement [0, 1] for an underdamped harmonic oscillator.
 */
export function computeSpringValue(options: {
  frame: number;
  fps?: number;
  delay?: number;
  config?: SpringConfig;
}): number {
  const { frame, fps = 60, delay = 0, config = {} } = options;
  const t = Math.max(0, (frame - delay) / fps);

  if (frame < delay) return 0;
  if (t === 0) return 0;

  const m = config.mass ?? defaultSpringConfig.mass;
  const k = config.stiffness ?? defaultSpringConfig.stiffness;
  const c = config.damping ?? defaultSpringConfig.damping;

  const omega0 = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(m * k));

  if (zeta < 1) {
    // Underdamped harmonic oscillator
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const decay = Math.exp(-zeta * omega0 * t);
    const oscillation = Math.cos(omegaD * t) + ((zeta * omega0) / omegaD) * Math.sin(omegaD * t);
    const val = 1 - decay * oscillation;
    return val;
  } else {
    // Critically damped or overdamped
    const decay = Math.exp(-omega0 * t);
    return 1 - decay * (1 + omega0 * t);
  }
}

/**
 * Linearly maps a value from one range to another with clamping.
 */
export function interpolateRange(
  value: number,
  inputRange: [number, number],
  outputRange: [number, number],
  options: { extrapolate?: 'clamp' | 'extend' } = { extrapolate: 'clamp' }
): number {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;

  if (inMax === inMin) return outMin;

  const progress = (value - inMin) / (inMax - inMin);

  if (options.extrapolate === 'clamp') {
    if (progress <= 0) return outMin;
    if (progress >= 1) return outMax;
  }

  return outMin + progress * (outMax - outMin);
}

/**
 * Generates an SVG path data string for organic liquid surface waves.
 * @param progress 0.0 (empty) to 1.0 (full)
 * @param width Container width in px
 * @param height Container height in px
 * @param amplitude Wave crest height in px
 * @param phase Wave offset animation in radians
 */
export function computeWavePath(
  progress: number,
  width: number,
  height: number,
  amplitude: number = 10,
  phase: number = 0
): string {
  if (progress <= 0) return '';
  if (progress >= 1) return `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`;

  // Wave baseline Y (0 is top, height is bottom)
  const baseY = height * (1 - progress);
  const effectiveAmplitude = Math.min(amplitude, baseY, height - baseY);

  const steps = 24;
  const stepWidth = width / steps;

  let path = `M 0 ${height} L 0 ${baseY}`;

  for (let i = 0; i <= steps; i++) {
    const x = i * stepWidth;
    // Dual sine harmonic for viscous liquid look
    const angle1 = (x / width) * Math.PI * 4 + phase;
    const angle2 = (x / width) * Math.PI * 2 + phase * 1.5;
    const y = baseY + Math.sin(angle1) * effectiveAmplitude * 0.7 + Math.cos(angle2) * effectiveAmplitude * 0.3;
    path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  path += ` L ${width} ${height} Z`;
  return path;
}

/**
 * Calculates radial shockwave expansion, intensity, and opacity.
 */
export function computeShockwave(
  frame: number,
  startFrame: number,
  durationInFrames: number = 60,
  maxRadius: number = 600
): { active: boolean; radius: number; opacity: number; strokeWidth: number } {
  if (frame < startFrame || frame > startFrame + durationInFrames) {
    return { active: false, radius: 0, opacity: 0, strokeWidth: 0 };
  }

  const t = (frame - startFrame) / durationInFrames;
  const eased = easeOutCubic(t);
  const radius = eased * maxRadius;
  const opacity = Math.max(0, 1 - Math.pow(t, 1.4));
  const strokeWidth = Math.max(1, (1 - t) * 8);

  return { active: true, radius, opacity, strokeWidth };
}

/**
 * Computes the glow intensity and active state of an element in a sequential matrix.
 */
export function computeHexGlow(
  index: number,
  total: number,
  sequenceProgress: number, // 0.0 to 1.0
  staggerRatio: number = 0.7
): { intensity: number; isLit: boolean; scale: number } {
  const stepStart = (index / total) * (1 - (1 - staggerRatio) / total);
  const stepEnd = stepStart + (1 - staggerRatio) / total + 0.15;

  if (sequenceProgress < stepStart) {
    return { intensity: 0.1, isLit: false, scale: 0.95 };
  }

  const localT = Math.min(1, Math.max(0, (sequenceProgress - stepStart) / (stepEnd - stepStart)));
  // Flash upon ignition then settle into glowing steady state
  let intensity = 0.2;
  let scale = 1.0;

  if (localT < 0.3) {
    // Ignition peak
    const peak = localT / 0.3;
    intensity = 0.2 + peak * 0.9; // Spikes to 1.1
    scale = 0.95 + peak * 0.15;
  } else {
    // Settle
    const settle = (localT - 0.3) / 0.7;
    intensity = 1.1 - settle * 0.25; // Settles at 0.85
    scale = 1.1 - settle * 0.1;
  }

  return { intensity, isLit: true, scale };
}
