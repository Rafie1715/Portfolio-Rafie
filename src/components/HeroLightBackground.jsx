import { lazy, Suspense, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';

const HeroWaveMesh3D = lazy(() => import('./HeroWaveMesh3D'));

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
};

const motionQuery = '(prefers-reduced-motion: reduce)';
const subscribeMotionPreference = (onChange) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const getMotionPreference = () => window.matchMedia(motionQuery).matches;

// Fixed geometry: animate two groups, not dozens of individual path shapes.
const contours = [
  Array.from({ length: 12 }, (_, i) => `M -120 ${360 + i * 18} C 70 ${260 + i * 17} ${510 + i * 6} ${360 + i * 15} ${355 + i * 4} ${605 + i * 12} S 20 ${800 + i * 15} -130 ${725 + i * 18}`),
  Array.from({ length: 12 }, (_, i) => `M ${860 + i * 17} -100 C ${760 + i * 16} 100 ${970 + i * 18} ${315 + i * 6} ${1280 + i * 10} ${190 + i * 14} S 1640 ${230 + i * 18} 1550 ${510 + i * 16}`),
];

export default function HeroLightBackground({ active = true, mode = 'wave' }) {
  const reduceMotion = useSyncExternalStore(subscribeMotionPreference, getMotionPreference, () => true);
  const rootRef = useRef(null);
  const id = useId().replace(/:/g, '');
  const running = active && !reduceMotion;
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && supportsWebGL()) {
      setCanRender3D(true);
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.parentElement;
    if (!hero || !running || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let frame;
    const move = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        root.style.setProperty('--light-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 32}px`);
        root.style.setProperty('--light-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 18}px`);
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

  const show3DWave = mode === 'wave' && canRender3D;

  return (
    <div ref={rootRef} data-hero-lights data-running={running} aria-hidden="true" className="hero-lights pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-light-haze absolute inset-0" />

      {/* 3D Ambient Geometric Wave Mesh */}
      {show3DWave ? (
        <Suspense fallback={null}>
          <HeroWaveMesh3D active={running} />
        </Suspense>
      ) : (
        /* Fallback / Classic SVG Contours */
        <div className="hero-light-parallax absolute -inset-6">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false" className="hero-contour-canvas h-full w-full">
            <defs>
              <linearGradient id={`${id}-left`} x1="-100" y1="700" x2="470" y2="360" gradientUnits="userSpaceOnUse">
                <stop stopColor="#244bff" />
                <stop offset=".55" stopColor="#2563eb" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id={`${id}-right`} x1="880" y1="0" x2="1450" y2="460" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" />
                <stop offset=".55" stopColor="#0891b2" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            {contours.map((paths, side) => (
              <g key={side} className={`hero-contour-group hero-contour-${side ? 'right' : 'left'}`} fill="none" stroke={`url(#${id}-${side ? 'right' : 'left'})`} strokeLinecap="round">
                {paths.map((path, index) => (
                  <path key={path} d={path} className={`hero-contour-line ${index % 2 ? 'hero-contour-detail' : ''}`}
                    strokeWidth={index === 4 || index === 8 ? 2.2 : 1.1}
                    opacity={index === 4 || index === 8 ? 0.95 : 0.5}
                    vectorEffect="non-scaling-stroke" />
                ))}
                {!reduceMotion && <path className="hero-contour-signal" d={paths[4]} pathLength="1000" strokeWidth="3" strokeDasharray="75 925" vectorEffect="non-scaling-stroke" />}
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}
