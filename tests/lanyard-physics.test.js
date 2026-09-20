import test from 'node:test';
import assert from 'node:assert/strict';
import { createLanyard, stepLanyard, limitLanyardTarget, LANYARD_ANCHOR, LANYARD_LENGTH } from '../src/utils/lanyardPhysics.js';

test('grab target translates the badge while the top anchor stays fixed', () => {
  const points = createLanyard();
  const target = limitLanyardTarget({ x: 1.2, y: 2.2 });
  for (let i = 0; i < 60; i++) stepLanyard(points, 1 / 60, target);
  assert.equal(points.at(-1).x, target.x);
  assert.equal(points.at(-1).y, target.y);
  assert.equal(points[0].x, LANYARD_ANCHOR.x);
  assert.equal(points[0].y, LANYARD_ANCHOR.y);
  const a = points[0]; const b = points.at(-1);
  const bending = points.slice(1, -1).some(p => Math.abs((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)) > 0.03);
  assert.ok(bending, 'Slack strap bends instead of remaining a rigid bar');
});

test('released badge keeps moving and settles under the anchor', () => {
  const points = createLanyard();
  const target = limitLanyardTarget({ x: 1.4, y: 2.3 });
  for (let i = 0; i < 60; i++) stepLanyard(points, 1 / 60, target);
  stepLanyard(points, 1 / 60);
  assert.ok(Math.abs(points.at(-1).x) > 0.5, 'Release does not teleport the badge home');
  for (let i = 0; i < 900; i++) stepLanyard(points, 1 / 60);
  assert.ok(Math.abs(points.at(-1).x) < 0.02);
  assert.ok(Math.abs(points.at(-1).y - (LANYARD_ANCHOR.y - LANYARD_LENGTH)) < 0.02);
});

test('extreme grabs and dropped frames stay bounded and finite', () => {
  const points = createLanyard();
  for (let i = 0; i < 400; i++) {
    const target = limitLanyardTarget({ x: Math.sin(i) * 100, y: Math.cos(i) * 100 }, 1.1);
    assert.ok(Math.abs(target.x) <= 1.1);
    assert.ok(Math.hypot(target.x, target.y - LANYARD_ANCHOR.y) <= LANYARD_LENGTH * 1.22 + 1e-9);
    stepLanyard(points, i % 7 ? 1 / 60 : 4, target);
    for (const p of points) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y) && Math.abs(p.x) < 10 && Math.abs(p.y) < 10);
  }
});
