const COUNT = 12;
export const LANYARD_LENGTH = 2.12;
export const LANYARD_ANCHOR = { x: 0, y: 3.25 };

export function createLanyard() {
  return Array.from({ length: COUNT }, (_, index) => ({
    x: Math.sin(index * 0.8) * 0.012, y: LANYARD_ANCHOR.y - index * LANYARD_LENGTH / (COUNT - 1),
    previousX: Math.sin(index * 0.8) * 0.012, previousY: LANYARD_ANCHOR.y - index * LANYARD_LENGTH / (COUNT - 1),
  }));
}

export function limitLanyardTarget(target, horizontalLimit = 1.65) {
  const x = Math.max(-horizontalLimit, Math.min(horizontalLimit, target.x));
  const y = Math.max(0.65, Math.min(2.65, target.y));
  const dx = x - LANYARD_ANCHOR.x;
  const dy = y - LANYARD_ANCHOR.y;
  const distance = Math.hypot(dx, dy);
  const ratio = Math.min(1, LANYARD_LENGTH * 1.22 / (distance || 1));
  return { x: LANYARD_ANCHOR.x + dx * ratio, y: LANYARD_ANCHOR.y + dy * ratio };
}

// A short Verlet chain: fixed anchor, weighted badge endpoint, and a movable grab target.
export function stepLanyard(points, delta, target = null) {
  const steps = Math.max(1, Math.ceil(Math.min(Math.max(delta, 0), 0.05) / (1 / 120)));
  const dt = Math.min(Math.max(delta, 0), 0.05) / steps;
  const last = points.length - 1;
  const stretch = target ? Math.max(1, Math.hypot(target.x, target.y - LANYARD_ANCHOR.y) / LANYARD_LENGTH) : 1;
  const segment = LANYARD_LENGTH * Math.min(stretch, 1.22) / last;
  for (let step = 0; step < steps; step++) {
    for (let i = 1; i <= last; i++) {
      const p = points[i];
      const vx = (p.x - p.previousX) * Math.exp(-2.2 * dt);
      const vy = (p.y - p.previousY) * Math.exp(-2.2 * dt);
      p.previousX = p.x; p.previousY = p.y;
      p.x += vx; p.y += vy - 12 * dt * dt;
    }
    for (let iteration = 0; iteration < 18; iteration++) {
      points[0].x = LANYARD_ANCHOR.x; points[0].y = LANYARD_ANCHOR.y;
      if (target) { points[last].x = target.x; points[last].y = target.y; }
      for (let i = 0; i < last; i++) {
        const a = points[i]; const b = points[i + 1];
        const dx = b.x - a.x; const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy) || 0.0001;
        const weightA = i === 0 ? 0 : 1;
        const weightB = i + 1 === last ? (target ? 0 : 0.22) : 1;
        const correction = (distance - segment) / distance / (weightA + weightB || 1);
        a.x += dx * correction * weightA; a.y += dy * correction * weightA;
        b.x -= dx * correction * weightB; b.y -= dy * correction * weightB;
      }
    }
    if (target) { points[last].x = target.x; points[last].y = target.y; }
  }
  return points;
}
