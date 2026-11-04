import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../public/audio');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Creates a valid 16-bit mono 44.1kHz RIFF/WAVE buffer from float samples [-1.0, 1.0].
 */
function createWavBuffer(samples, sampleRate = 44100) {
  const numSamples = samples.length;
  const bytesPerSample = 2; // 16-bit
  const dataSize = numSamples * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk Descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22); // NumChannels (1 mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28); // ByteRate
  buffer.writeUInt16LE(bytesPerSample, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  for (let i = 0; i < numSamples; i++) {
    // Soft clip
    let s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// 1. Whoosh (Deep sub-bass cinematic whoosh with frequency sweep & smooth envelope)
function generateWhoosh() {
  const sampleRate = 44100;
  const duration = 1.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const progress = t / duration;

    // Bell-shaped amplitude envelope
    const env = Math.sin(Math.PI * progress) ** 2;

    // Pitch sweeps up then drops (sub-bass 60Hz to 160Hz down to 45Hz)
    const freq = 60 + 100 * Math.sin(Math.PI * progress);
    const sub = Math.sin(2 * Math.PI * freq * t);

    // Warm filtered air noise
    const noise = (Math.random() * 2 - 1) * 0.25;

    // Mid whoosh tone
    const mid = Math.sin(2 * Math.PI * (freq * 2.2) * t) * 0.35;

    samples[i] = (sub * 0.7 + mid * 0.3 + noise * 0.15) * env * 0.9;
  }

  return createWavBuffer(samples, sampleRate);
}

// 2. Glass Tick (Crisp, crystalline glass contact click)
function generateGlassTick() {
  const sampleRate = 44100;
  const duration = 0.22;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Rapid exponential decay
    const env = Math.exp(-t * 38);

    // High crystalline glass modes: 2640Hz, 4180Hz, 5280Hz
    const mode1 = Math.sin(2 * Math.PI * 2640 * t);
    const mode2 = Math.sin(2 * Math.PI * 4180 * t) * 0.6;
    const mode3 = Math.sin(2 * Math.PI * 5280 * t) * 0.3;

    // Initial click transient in first 2ms
    const click = t < 0.003 ? (Math.random() * 2 - 1) * (1 - t / 0.003) : 0;

    samples[i] = (mode1 + mode2 + mode3 + click * 0.8) * env * 0.55;
  }

  return createWavBuffer(samples, sampleRate);
}

// 3. Charge (Rising cyber glitch charge building anticipation)
function generateCharge() {
  const sampleRate = 44100;
  const duration = 1.4;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  let phase = 0;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const progress = t / duration;

    // Ramp up envelope with slight ease-in
    const env = Math.min(1, progress * 1.5) * (0.2 + 0.8 * (progress ** 1.8));

    // Frequency accelerates from 90Hz to 680Hz
    const freq = 90 + 590 * (progress ** 2.2);
    phase += (2 * Math.PI * freq) / sampleRate;

    // Cyber vibrato / glitch modulation
    const mod = Math.sin(2 * Math.PI * (18 + 40 * progress) * t);
    const wave = Math.sin(phase + mod * 0.6);

    // Subtle square wave harmonic for cyberpunk tech grit
    const grit = Math.sign(Math.sin(phase * 2)) * 0.15;

    samples[i] = (wave * 0.7 + grit) * env * 0.75;
  }

  return createWavBuffer(samples, sampleRate);
}

// 4. Success Chime (Celestial warm liquid glass chords: E5, G#5, B5, E6)
function generateSuccessChime() {
  const sampleRate = 44100;
  const duration = 2.2;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  // Chime frequencies in Hertz
  const freqs = [659.25, 830.61, 987.77, 1318.51, 1975.53];
  const delays = [0, 0.04, 0.09, 0.15, 0.22]; // Staggered arpeggiated strike

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let sum = 0;

    for (let f = 0; f < freqs.length; f++) {
      const noteTime = t - delays[f];
      if (noteTime > 0) {
        const decay = Math.exp(-noteTime * 2.8);
        const osc = Math.sin(2 * Math.PI * freqs[f] * noteTime);
        const overtone = Math.sin(2 * Math.PI * freqs[f] * 2.76 * noteTime) * 0.25;
        sum += (osc + overtone) * decay * (1 / (f * 0.4 + 1));
      }
    }

    // Warm sub bloom underneath completion
    const subEnv = Math.exp(-t * 2.0);
    const sub = Math.sin(2 * Math.PI * 130.81 * t) * 0.4 * subEnv;

    samples[i] = (sum * 0.38 + sub) * 0.85;
  }

  return createWavBuffer(samples, sampleRate);
}

// Generate all sounds
console.log('Generating procedural SFX for Liquid Glass Promo...');

const sounds = [
  { name: 'whoosh.wav', fn: generateWhoosh },
  { name: 'glass_tick.wav', fn: generateGlassTick },
  { name: 'charge.wav', fn: generateCharge },
  { name: 'success_chime.wav', fn: generateSuccessChime },
];

for (const sound of sounds) {
  const filePath = path.join(outputDir, sound.name);
  const buffer = sound.fn();
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Generated ${sound.name} (${(buffer.length / 1024).toFixed(1)} KB) -> ${filePath}`);
}

console.log('All SFX assets successfully generated without external dependencies.');
