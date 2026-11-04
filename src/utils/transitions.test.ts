import test from 'node:test';
import assert from 'node:assert/strict';
import {
  easeOutCubic,
  easeInOutQuad,
  computeSpringValue,
  interpolateRange,
  computeWavePath,
  computeShockwave,
  computeHexGlow,
} from './transitions';

test('easeOutCubic clamps and calculates valid values', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.equal(easeOutCubic(-0.5), 0);
  assert.equal(easeOutCubic(1.5), 1);
  assert.ok(easeOutCubic(0.5) > 0.5); // Should start fast
});

test('easeInOutQuad creates symmetric curve', () => {
  assert.equal(easeInOutQuad(0), 0);
  assert.equal(easeInOutQuad(1), 1);
  assert.equal(easeInOutQuad(0.5), 0.5);
});

test('computeSpringValue handles delay and approaches 1 at rest', () => {
  // Before delay should be 0
  assert.equal(computeSpringValue({ frame: 5, delay: 10 }), 0);

  // In motion
  const mid = computeSpringValue({ frame: 30, delay: 10, fps: 60 });
  assert.ok(mid > 0 && mid < 1.3);

  // Settled after sufficient frames
  const settled = computeSpringValue({ frame: 200, delay: 10, fps: 60 });
  assert.ok(Math.abs(settled - 1.0) < 0.05);
});

test('interpolateRange clamps correctly', () => {
  const resClampedMin = interpolateRange(-10, [0, 100], [0, 1]);
  assert.equal(resClampedMin, 0);

  const resClampedMax = interpolateRange(150, [0, 100], [0, 1]);
  assert.equal(resClampedMax, 1);

  const resMid = interpolateRange(50, [0, 100], [10, 20]);
  assert.equal(resMid, 15);
});

test('computeWavePath produces valid SVG path string', () => {
  const emptyPath = computeWavePath(0, 400, 100);
  assert.equal(emptyPath, '');

  const fullPath = computeWavePath(1, 400, 100);
  assert.equal(fullPath, 'M 0 0 L 400 0 L 400 100 L 0 100 Z');

  const wave = computeWavePath(0.5, 400, 100, 8, 1.2);
  assert.ok(wave.startsWith('M 0 100 L 0 '));
  assert.ok(wave.includes('L 400 100 Z'));
});

test('computeShockwave calculates expansion and finishes at duration', () => {
  const inactiveBefore = computeShockwave(50, 100, 60, 500);
  assert.equal(inactiveBefore.active, false);

  const activeMid = computeShockwave(130, 100, 60, 500);
  assert.equal(activeMid.active, true);
  assert.ok(activeMid.radius > 0 && activeMid.radius < 500);
  assert.ok(activeMid.opacity > 0 && activeMid.opacity <= 1);

  const inactiveAfter = computeShockwave(180, 100, 60, 500);
  assert.equal(inactiveAfter.active, false);
});

test('computeHexGlow ignites and settles', () => {
  const total = 10;
  // Step 0 at progress 0.1
  const glow0 = computeHexGlow(0, total, 0.1);
  assert.equal(glow0.isLit, true);
  assert.ok(glow0.intensity > 0.5);

  // Step 9 at progress 0.1 should not be lit yet
  const glow9 = computeHexGlow(9, total, 0.1);
  assert.equal(glow9.isLit, false);
});
