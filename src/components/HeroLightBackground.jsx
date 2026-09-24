import { useEffect, useId, useRef, useSyncExternalStore } from 'react';

const motionQuery = '(prefers-reduced-motion: reduce)';
const subscribeMotionPreference = (onChange) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const getMotionPreference = () => window.matchMedia(motionQuery).matches;

// Continuous curves frame the hero; the center mask keeps the copy quiet.
const ribbons = [
  { path: 'M-160 650 C80 880 390 690 270 440 S310 110 620 240 S1150 470 1550 70', duration: 32 },
  { path: 'M-140 790 C170 900 430 620 305 415 S405 145 705 280 S1230 360 1560 150', duration: 38 },
  { path: 'M-120 540 C100 360 200 830 560 670 S1040 40 1530 225', duration: 44 },
];

export default function HeroLightBackground({ active = true }) {
  const reduceMotion = useSyncExternalStore(subscribeMotionPreference, getMotionPreference, () => true);
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const id = useId().replace(/:/g, '');
  const running = active && !reduceMotion;

  useEffect(() => {
    if (running) svgRef.current?.unpauseAnimations?.();
    else svgRef.current?.pauseAnimations?.();
  }, [running]);

  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.parentElement;
    if (!hero || !running || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let frame;
    const move = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        root.style.setProperty('--light-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 20}px`);
        root.style.setProperty('--light-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 12}px`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      root.style.setProperty('--light-x', '0px');
      root.style.setProperty('--light-y', '0px');
    };
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', reset);
    return () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [running]);

  return (
    <div ref={rootRef} data-hero-lights data-running={running} aria-hidden="true" className="hero-lights pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-light-haze absolute inset-0" />
      <div className="hero-light-parallax absolute -inset-6">
        <svg ref={svgRef} viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false" className="hero-light-canvas h-full w-full">
          <defs>
            <linearGradient id={`${id}-ribbon`} x1="0" y1="780" x2="1440" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563eb" />
              <stop offset=".28" stopColor="#38bdf8" />
              <stop offset=".55" stopColor="#3b82f6" />
              <stop offset=".85" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#0ea5e9" />
            </linearGradient>
            <filter id={`${id}-glow`} x="-30%" y="-50%" width="160%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          {ribbons.map(({ path, duration }, index) => (
            <g key={path} className={`hero-light-ribbon hero-light-ribbon-${index}`} style={{ '--ribbon-duration': `${duration}s`, '--ribbon-delay': `${-index * 9 - 5}s` }}>
              <g fill="none" stroke={`url(#${id}-ribbon)`} strokeLinecap="round">
                <path d={path} strokeWidth="18" opacity=".22" filter={`url(#${id}-glow)`} />
                <path d={path} strokeWidth="7" opacity=".1" />
                <path d={path} strokeWidth="1.2" opacity=".65" vectorEffect="non-scaling-stroke" />
                <path className="hero-light-trail" d={path} pathLength="1000" strokeWidth="2" strokeDasharray="65 935" opacity=".9" vectorEffect="non-scaling-stroke" />
              </g>
              {!reduceMotion && [0, 1].map(particle => (
                <g key={particle} className={particle ? 'hero-light-particle-secondary' : undefined}>
                  <circle r="11" fill="#38bdf8" opacity=".09" />
                  <circle r="5" fill="#38bdf8" opacity=".25" />
                  <circle r="1.8" className="hero-light-spark" />
                  <animateMotion path={path} dur={`${duration}s`} begin={`${-duration * (particle ? 0.72 : 0.24) - index * 4}s`} repeatCount="indefinite" />
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
