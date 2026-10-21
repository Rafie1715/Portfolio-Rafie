import * as THREE from 'three';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { getTechnologyIconPath } from '../utils/orbitIcons';

const ORBIT_RADIUS = 2.35;
const TILT_X = 0.38;
const TILT_Z = -0.12;

function createBadgeTexture(tech, iconPath, isDark) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, 512, 512);

  // Outer glow ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(256, 256, 240, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? '#0b1120' : '#ffffff';
  ctx.shadowColor = tech.color;
  ctx.shadowBlur = 24;
  ctx.fill();
  ctx.restore();

  // Radial tint gradient inside disc
  ctx.save();
  ctx.beginPath();
  ctx.arc(256, 256, 236, 0, Math.PI * 2);
  ctx.clip();

  const bgGrad = ctx.createRadialGradient(256, 200, 30, 256, 256, 240);
  bgGrad.addColorStop(0, `${tech.color}2b`);
  bgGrad.addColorStop(0.65, `${tech.color}12`);
  bgGrad.addColorStop(1, isDark ? '#0b1120' : '#f8fafc');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Border ring in brand color
  ctx.lineWidth = 14;
  ctx.strokeStyle = tech.color;
  ctx.stroke();

  // Draw Icon in upper portion
  if (iconPath) {
    try {
      ctx.save();
      const path = new Path2D(iconPath);
      ctx.translate(256, 190);
      const scale = 7.6;
      ctx.scale(scale, scale);
      ctx.translate(-12, -12); // Center 24x24 viewBox
      ctx.fillStyle = tech.color;
      ctx.fill(path);
      ctx.restore();
    } catch {
      // Fallback mark if Path2D is not available
      ctx.fillStyle = tech.color;
      ctx.fillRect(206, 140, 100, 100);
    }
  }

  // Draw Tech Name
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
  ctx.font = '700 46px "Poppins", "Outfit", -apple-system, sans-serif';
  ctx.fillText(tech.name, 256, 360);

  // Draw Category Pill
  const categoryText = (tech.category || 'Tech').toUpperCase();
  ctx.font = '700 20px monospace';
  const tagWidth = ctx.measureText(categoryText).width + 30;
  const tagX = 256 - tagWidth / 2;
  const tagY = 388;
  const tagH = 34;

  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(tagX, tagY, tagWidth, tagH, 17) : ctx.rect(tagX, tagY, tagWidth, tagH);
  ctx.fillStyle = `${tech.color}22`;
  ctx.fill();
  ctx.strokeStyle = `${tech.color}66`;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = tech.color;
  ctx.fillText(categoryText, 256, tagY + 24);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

function createAuraTexture(color) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, color);
  grad.addColorStop(0.3, color);
  grad.addColorStop(0.7, 'rgba(0,0,0,0.15)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createCoreTexture(isDark) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? '#0284c7' : '#0284c7';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '900 80px "Poppins", "Outfit", sans-serif';
  ctx.fillText('R.', 128, 155);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function OrbitNode({
  tech,
  index,
  total,
  orbitAngle,
  activeId,
  isHovered,
  onHover,
  onSelect,
  isDark,
}) {
  const meshRef = useRef(null);
  const auraRef = useRef(null);
  const currentScale = useRef(1);
  const iconPath = useMemo(() => getTechnologyIconPath(tech.id), [tech.id]);

  const texture = useMemo(() => createBadgeTexture(tech, iconPath, isDark), [tech, iconPath, isDark]);
  const auraTexture = useMemo(() => createAuraTexture(tech.color), [tech.color]);

  useEffect(() => {
    return () => {
      texture?.dispose();
      auraTexture?.dispose();
    };
  }, [texture, auraTexture]);

  const isActive = activeId === tech.id;
  const isTargeted = isHovered || isActive;

  useFrame(({ camera, clock }, delta) => {
    if (!meshRef.current) return;

    // Calculate position along tilted orbit
    const baseAngle = (index / total) * Math.PI * 2 + orbitAngle.current;
    const x = Math.cos(baseAngle) * ORBIT_RADIUS;
    const z = Math.sin(baseAngle) * ORBIT_RADIUS;
    const yFloat = Math.sin(clock.getElapsedTime() * 2.2 + index * 1.1) * 0.08;

    meshRef.current.position.set(x, yFloat, z);

    // Billboard: Always orient directly to face camera so text is crystal clear
    meshRef.current.quaternion.copy(camera.quaternion);

    // Smoothly scale up when hovered or active
    const targetScale = isHovered ? 1.34 : (isActive ? 1.15 : 1.0);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 9);
    meshRef.current.scale.setScalar(currentScale.current);

    // Animate aura opacity
    if (auraRef.current) {
      const targetOpacity = isHovered ? 0.95 : (isActive ? 0.7 : 0.28);
      auraRef.current.material.opacity = THREE.MathUtils.lerp(
        auraRef.current.material.opacity,
        targetOpacity,
        delta * 8
      );
    }
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(tech);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(tech);
      }}
      cursor="pointer"
    >
      {/* Glowing Aura Sprite */}
      <mesh ref={auraRef} position={[0, 0, -0.05]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial
          map={auraTexture}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Front Disc */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.46, 48]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Back Plate / Metallic Rim */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.47, 48]} />
        <meshStandardMaterial
          color={isDark ? '#0f172a' : '#e2e8f0'}
          metalness={0.7}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function ConnectingBeam({ tech, index, total, orbitAngle, isHovered, isActive }) {
  const lineRef = useRef(null);

  const points = useMemo(() => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)], []);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;

    const baseAngle = (index / total) * Math.PI * 2 + orbitAngle.current;
    const x = Math.cos(baseAngle) * ORBIT_RADIUS;
    const z = Math.sin(baseAngle) * ORBIT_RADIUS;
    const yFloat = Math.sin(clock.getElapsedTime() * 2.2 + index * 1.1) * 0.08;

    const positions = lineRef.current.geometry.attributes.position.array;
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = 0;
    positions[3] = x;
    positions[4] = yFloat;
    positions[5] = z;
    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const isLit = isHovered || isActive;

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={isLit ? tech.color : '#38bdf8'}
        transparent
        opacity={isLit ? 0.75 : 0.14}
        linewidth={isLit ? 2 : 1}
      />
    </line>
  );
}

function CentralCore({ isDark }) {
  const innerRef = useRef(null);
  const outerCageRef = useRef(null);
  const coreTexture = useMemo(() => createCoreTexture(isDark), [isDark]);

  useEffect(() => {
    return () => coreTexture?.dispose();
  }, [coreTexture]);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();

    // Pulse core
    if (innerRef.current) {
      const pulse = 1 + Math.sin(elapsed * 2.5) * 0.06;
      innerRef.current.scale.setScalar(pulse);
    }

    // Rotate wireframe cage in opposite direction
    if (outerCageRef.current) {
      outerCageRef.current.rotation.y -= delta * 0.35;
      outerCageRef.current.rotation.x += delta * 0.18;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Emblem Sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          map={coreTexture}
          emissive="#0284c7"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Wireframe Rotating Geometric Cage */}
      <mesh ref={outerCageRef}>
        <icosahedronGeometry args={[0.58, 0]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.38}
        />
      </mesh>

      {/* Subtle core glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.01, 16, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function OrbitTracks() {
  const points = useMemo(() => {
    const pts = [];
    const count = 48;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const r = ORBIT_RADIUS + (Math.random() - 0.5) * 0.18;
      pts.push(new THREE.Vector3(Math.cos(angle) * r, (Math.random() - 0.5) * 0.08, Math.sin(angle) * r));
    }
    return pts;
  }, []);

  const particlesGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useEffect(() => {
    return () => particlesGeometry.dispose();
  }, [particlesGeometry]);

  return (
    <group>
      {/* Primary Track Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ORBIT_RADIUS, 0.012, 16, 128]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.32} />
      </mesh>

      {/* Secondary Inner Harmonic Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.45, 0.008, 16, 96]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} />
      </mesh>

      {/* Tertiary Outer Subtle Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.05, 0.006, 16, 96]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.1} />
      </mesh>

      {/* Orbital Dust Particles */}
      <points geometry={particlesGeometry}>
        <pointsMaterial color="#7dd3fc" size={0.035} transparent opacity={0.5} />
      </points>
    </group>
  );
}

function OrbitScene({
  technologies,
  activeId,
  hoveredId,
  setHoveredId,
  onSelect,
  isPaused,
  reducedMotion,
  isDark,
  resetSignal,
}) {
  const orbitAngle = useRef(0);
  const angularVelocity = useRef(0.24);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const tiltGroupRef = useRef(null);
  const currentTilt = useRef({ x: TILT_X, y: 0 });
  const { invalidate } = useThree();

  useEffect(() => {
    // Reset view when signal triggers
    orbitAngle.current = 0;
    angularVelocity.current = 0.24;
    currentTilt.current = { x: TILT_X, y: 0 };
    if (tiltGroupRef.current) {
      tiltGroupRef.current.rotation.x = TILT_X;
      tiltGroupRef.current.rotation.y = 0;
    }
    invalidate();
  }, [resetSignal, invalidate]);

  useFrame((_, delta) => {
    // Dynamic speed control:
    // If hovering a node: slow down to gentle crawl (0.03) so user can comfortably inspect
    // If paused or prefers reduced motion: speed is 0
    // Otherwise: normal smooth ambient orbit speed (0.22)
    const targetSpeed = hoveredId ? 0.03 : (isPaused || reducedMotion ? 0 : 0.22);

    if (!isDragging.current) {
      // Smoothly accelerate / decelerate towards target speed
      angularVelocity.current = THREE.MathUtils.lerp(angularVelocity.current, targetSpeed, delta * 3.8);
      orbitAngle.current += angularVelocity.current * delta;
    }

    // Smooth tilt reaction
    if (tiltGroupRef.current) {
      tiltGroupRef.current.rotation.x = THREE.MathUtils.lerp(tiltGroupRef.current.rotation.x, currentTilt.current.x, delta * 4);
      tiltGroupRef.current.rotation.y = THREE.MathUtils.lerp(tiltGroupRef.current.rotation.y, currentTilt.current.y, delta * 4);
    }
  });

  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = (e.clientX - lastPointer.current.x) * 0.006;
    const deltaY = (e.clientY - lastPointer.current.y) * 0.003;

    orbitAngle.current += deltaX;
    angularVelocity.current = deltaX * 12;

    currentTilt.current.x = THREE.MathUtils.clamp(currentTilt.current.x + deltaY, 0.1, 0.65);
    currentTilt.current.y = THREE.MathUtils.clamp(currentTilt.current.y + deltaX * 0.4, -0.4, 0.4);

    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <group>
      <ambientLight intensity={isDark ? 1.6 : 2.0} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} />
      <directionalLight position={[-5, -2, -5]} intensity={0.9} color="#7dd3fc" />

      {/* Invisible backdrop plane to reliably capture click & drag anywhere on the canvas */}
      <mesh
        position={[0, 0, -1]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Central Core (Fixed at origin) */}
      <CentralCore isDark={isDark} />

      {/* Orbit Plane Group with dynamic tilt */}
      <group ref={tiltGroupRef} rotation={[TILT_X, 0, TILT_Z]}>
        <OrbitTracks />

        {technologies.map((tech, index) => (
          <ConnectingBeam
            key={`beam-${tech.id}`}
            tech={tech}
            index={index}
            total={technologies.length}
            orbitAngle={orbitAngle}
            isHovered={hoveredId === tech.id}
            isActive={activeId === tech.id}
          />
        ))}

        {technologies.map((tech, index) => (
          <OrbitNode
            key={tech.id}
            tech={tech}
            index={index}
            total={technologies.length}
            orbitAngle={orbitAngle}
            activeId={activeId}
            isHovered={hoveredId === tech.id}
            onHover={(item) => setHoveredId(item?.id || null)}
            onSelect={onSelect}
            isDark={isDark}
          />
        ))}
      </group>
    </group>
  );
}

export default function TechOrbit3D({
  technologies = [],
  activeTechnology,
  onSelectTechnology,
  labels = {},
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const [isDark, setIsDark] = useState(true);

  // Check prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const updateMotion = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', updateMotion);
    return () => mq.removeEventListener('change', updateMotion);
  }, []);

  // Sync theme
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Viewport intersection observer to avoid unnecessary GPU rendering
  useEffect(() => {
    if (!containerRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // When a technology is hovered in 3D, notify parent after short debounce or immediately
  const handleNodeHover = useCallback((id) => {
    setHoveredId(id);
    if (id) {
      const match = technologies.find((t) => t.id === id);
      if (match && onSelectTechnology) {
        onSelectTechnology(match, false); // false = hover preview
      }
    }
  }, [technologies, onSelectTechnology]);

  const handleNodeSelect = useCallback((tech) => {
    if (onSelectTechnology) {
      onSelectTechnology(tech, true); // true = explicit click select
    }
  }, [onSelectTechnology]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[350px] w-full select-none flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-slate-900/90 shadow-inner dark:border-slate-800 sm:h-[400px]"
      role="region"
      aria-label={labels.orbit_view || '3D Tech Orbit'}
    >
      {/* 3D Canvas */}
      {isVisible && (
        <Canvas
          camera={{ position: [0, 1.4, 5.0], fov: 44, near: 0.1, far: 25 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          className="cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          <OrbitScene
            technologies={technologies}
            activeId={activeTechnology?.id}
            hoveredId={hoveredId}
            setHoveredId={handleNodeHover}
            onSelect={handleNodeSelect}
            isPaused={isPaused}
            reducedMotion={reducedMotion}
            isDark={isDark}
            resetSignal={resetSignal}
          />
        </Canvas>
      )}

      {/* Floating Bottom HUD / Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-3 sm:p-4">
        {/* Helper Hint */}
        <p className="text-[11px] font-medium text-slate-300 dark:text-slate-400 drop-shadow">
          <span className="hidden sm:inline">{labels.orbit_hint || 'Drag to rotate orbit • Hover node to inspect'}</span>
          <span className="sm:hidden">{labels.orbit_touch_hint || 'Swipe to rotate • Tap node to inspect'}</span>
        </p>

        {/* Orbit Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-lg bg-slate-950/70 p-1 backdrop-blur-md border border-slate-700/60 shadow-lg">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? (labels.orbit_play || 'Resume') : (labels.orbit_pause || 'Pause')}
            title={isPaused ? (labels.orbit_play || 'Resume') : (labels.orbit_pause || 'Pause')}
            className="flex size-7 items-center justify-center rounded text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {isPaused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => setResetSignal((prev) => prev + 1)}
            aria-label={labels.orbit_reset || 'Reset view'}
            title={labels.orbit_reset || 'Reset view'}
            className="flex size-7 items-center justify-center rounded text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <RotateCcw size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

