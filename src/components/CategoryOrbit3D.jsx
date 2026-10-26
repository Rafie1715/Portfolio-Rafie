import * as THREE from 'three';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { getSkillIconInfo, getCategoryIconInfo } from '../utils/orbitIcons';

const TILT_X = 0.38;
const TILT_Z = -0.12;

// Fallback monogram if Path2D is somehow not supported
function drawFallbackMonogram(ctx, name, color) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(256, 185, 52, 0, Math.PI * 2);
  ctx.fillStyle = `${color}18`;
  ctx.fill();
  ctx.strokeStyle = `${color}88`;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 40px "Poppins", sans-serif';

  const words = name.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/);
  const initials = (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 3)).toUpperCase();
  ctx.fillText(initials, 256, 186);
  ctx.restore();
}

// Generates high-res circular badge texture for an orbiting technology
function createBadgeTexture(tech, isDark) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, 512, 512);

  const accent = tech.accent || '#3b82f6';
  const iconInfo = getSkillIconInfo(tech.name);

  // Outer glow shadow
  ctx.save();
  ctx.beginPath();
  ctx.arc(256, 256, 238, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? '#0b1120' : '#ffffff';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 24;
  ctx.fill();
  ctx.restore();

  // Disc interior with subtle gradient
  ctx.save();
  ctx.beginPath();
  ctx.arc(256, 256, 234, 0, Math.PI * 2);
  ctx.clip();

  const bgGrad = ctx.createRadialGradient(256, 200, 30, 256, 256, 238);
  bgGrad.addColorStop(0, `${accent}2b`);
  bgGrad.addColorStop(0.65, `${accent}12`);
  bgGrad.addColorStop(1, isDark ? '#0b1120' : '#f8fafc');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Rim border
  ctx.lineWidth = 14;
  ctx.strokeStyle = accent;
  ctx.stroke();

  // Official Vector Logo
  if (iconInfo) {
    try {
      ctx.save();
      const targetSize = 138;
      const scale = targetSize / Math.max(iconInfo.w, iconInfo.h);
      ctx.translate(256, 182);
      ctx.scale(scale, scale);
      ctx.translate(-(iconInfo.minX + iconInfo.w / 2), -(iconInfo.minY + iconInfo.h / 2));
      ctx.fillStyle = accent;
      ctx.fill(new Path2D(iconInfo.d));
      ctx.restore();
    } catch {
      drawFallbackMonogram(ctx, tech.name, accent);
    }
  } else {
    drawFallbackMonogram(ctx, tech.name, accent);
  }

  // Technology Name
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
  ctx.font = '700 42px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  let name = tech.name;
  if (ctx.measureText(name).width > 420) {
    ctx.font = '700 34px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  }
  if (ctx.measureText(name).width > 430) {
    ctx.font = '700 28px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  }
  ctx.fillText(name, 256, 360);

  // Category or Learning Chip
  const tagText = tech.learning ? 'LEARNING' : (tech.categoryLabel || 'CORE').toUpperCase();
  ctx.font = '700 20px monospace';
  const tagWidth = ctx.measureText(tagText).width + 32;
  const tagX = 256 - tagWidth / 2;
  const tagY = 390;
  const tagH = 34;

  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(tagX, tagY, tagWidth, tagH, 17);
  } else {
    ctx.rect(tagX, tagY, tagWidth, tagH);
  }
  ctx.fillStyle = `${accent}22`;
  ctx.fill();
  ctx.strokeStyle = `${accent}66`;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.fillText(tagText, 256, tagY + 24);
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
  grad.addColorStop(0.32, color);
  grad.addColorStop(0.7, 'rgba(0,0,0,0.15)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Central Core with Category Emblem
function createCategoryCoreTexture(category) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const accent = category.accent || '#3b82f6';

  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();

  const catIconInfo = getCategoryIconInfo(category.key);
  if (catIconInfo) {
    try {
      ctx.save();
      const targetSize = 124;
      const scale = targetSize / Math.max(catIconInfo.w, catIconInfo.h);
      ctx.translate(128, 128);
      ctx.scale(scale, scale);
      ctx.translate(-(catIconInfo.minX + catIconInfo.w / 2), -(catIconInfo.minY + catIconInfo.h / 2));
      ctx.fillStyle = '#ffffff';
      ctx.fill(new Path2D(catIconInfo.d));
      ctx.restore();
    } catch {
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 64px "Poppins", sans-serif';
      ctx.fillText(category.key.slice(0, 3).toUpperCase(), 128, 128);
    }
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 64px "Poppins", sans-serif';
    ctx.fillText(category.key.slice(0, 3).toUpperCase(), 128, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function CentralCategoryCore({ category, isDark }) {
  const innerRef = useRef(null);
  const outerCageRef = useRef(null);
  const coreTexture = useMemo(() => createCategoryCoreTexture(category, isDark), [category, isDark]);

  useEffect(() => {
    return () => coreTexture?.dispose();
  }, [coreTexture]);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();

    if (innerRef.current) {
      const pulse = 1 + Math.sin(elapsed * 2.4) * 0.05;
      innerRef.current.scale.setScalar(pulse);
    }

    if (outerCageRef.current) {
      outerCageRef.current.rotation.y -= delta * 0.32;
      outerCageRef.current.rotation.x += delta * 0.16;
    }
  });

  const accent = category.accent || '#3b82f6';

  return (
    <group position={[0, 0, 0]}>
      {/* Central Emblem Sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          map={coreTexture}
          emissive={accent}
          emissiveIntensity={0.5}
          roughness={0.25}
          metalness={0.35}
        />
      </mesh>

      {/* Wireframe Rotating Geometric Cage */}
      <mesh ref={outerCageRef}>
        <icosahedronGeometry args={[0.58, 0]} />
        <meshBasicMaterial
          color={accent}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Subtle core glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.012, 16, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

// Connecting laser beam from Central Core to Hovered or Active Node
function ConnectingBeam({ position, isTargeted, accent }) {
  const lineRef = useRef(null);
  const color = useMemo(() => new THREE.Color(accent || '#3b82f6'), [accent]);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const pulse = 0.5 + Math.sin(clock.getElapsedTime() * 6) * 0.3;
    lineRef.current.material.opacity = isTargeted ? 0.85 : pulse * 0.35;
  });

  const points = useMemo(() => {
    return [new THREE.Vector3(0, 0, 0), position];
  }, [position]);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useEffect(() => {
    return () => lineGeometry.dispose();
  }, [lineGeometry]);

  return (
    <line ref={lineRef} geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={isTargeted ? 0.8 : 0.25}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </line>
  );
}

// Satellite Node in Orbit
function CategoryOrbitNode({
  tech,
  index,
  total,
  orbitRadius,
  yOffset,
  orbitAngle,
  isSelected,
  isHovered,
  onHover,
  onSelect,
  isDark,
  onPositionUpdate,
}) {
  const meshRef = useRef(null);
  const auraRef = useRef(null);
  const currentScale = useRef(1);

  const texture = useMemo(() => createBadgeTexture(tech, isDark), [tech, isDark]);
  const auraTexture = useMemo(() => createAuraTexture(tech.accent || '#3b82f6'), [tech.accent]);

  useEffect(() => {
    return () => {
      texture?.dispose();
      auraTexture?.dispose();
    };
  }, [texture, auraTexture]);

  useFrame(({ camera, clock }, delta) => {
    if (!meshRef.current) return;

    // Distribute evenly around orbit circle
    const baseAngle = (index / total) * Math.PI * 2 + orbitAngle.current;
    const x = Math.cos(baseAngle) * orbitRadius;
    const z = Math.sin(baseAngle) * orbitRadius;
    const yFloat = Math.sin(clock.getElapsedTime() * 2.2 + index * 0.9) * 0.07 + yOffset;

    meshRef.current.position.set(x, yFloat, z);
    onPositionUpdate(index, new THREE.Vector3(x, yFloat, z));

    // Billboard: Always orient towards camera so labels are 100% readable
    meshRef.current.quaternion.copy(camera.quaternion);

    // Smooth scaling on hover / active
    const targetScale = isHovered ? 1.32 : (isSelected ? 1.16 : 1.0);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 9);
    meshRef.current.scale.setScalar(currentScale.current);

    // Animate aura opacity
    if (auraRef.current) {
      const targetOpacity = isHovered ? 0.92 : (isSelected ? 0.72 : 0.28);
      auraRef.current.material.opacity = THREE.MathUtils.lerp(
        auraRef.current.material.opacity,
        targetOpacity,
        delta * 8
      );
    }
  });

  const accent = tech.accent || '#3b82f6';

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
      {/* Glowing Aura */}
      <mesh ref={auraRef} position={[0, 0, -0.04]}>
        <planeGeometry args={[1.4, 1.4]} />
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
        <circleGeometry args={[0.44, 48]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Back Plate / Metallic Rim */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.45, 48]} />
        <meshStandardMaterial
          color={isDark ? '#0f172a' : '#e2e8f0'}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Rim Accent Ring */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.435, 0.45, 48]} />
        <meshBasicMaterial color={accent} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Orbital Track Rings & Stardust
function CategoryOrbitTracks({ category, orbitRadius }) {
  const accent = category.accent || '#3b82f6';

  const points = useMemo(() => {
    const pts = [];
    const count = 40;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const rOffset = Math.sin(i * 12.9898) * 0.08;
      const yOffset = Math.cos(i * 78.233) * 0.04;
      const r = orbitRadius + rOffset;
      pts.push(new THREE.Vector3(Math.cos(angle) * r, yOffset, Math.sin(angle) * r));
    }
    return pts;
  }, [orbitRadius]);

  const particlesGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useEffect(() => {
    return () => particlesGeometry.dispose();
  }, [particlesGeometry]);

  return (
    <group>
      {/* Main Track Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbitRadius, 0.012, 16, 128]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} />
      </mesh>

      {/* Inner Harmonic Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbitRadius * 0.65, 0.008, 16, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.16} />
      </mesh>

      {/* Outer Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbitRadius * 1.25, 0.006, 16, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.1} />
      </mesh>

      {/* Orbital Dust */}
      <points geometry={particlesGeometry}>
        <pointsMaterial color={accent} size={0.035} transparent opacity={0.5} />
      </points>
    </group>
  );
}

function CategoryOrbitScene({
  category,
  skills,
  selectedSkill,
  hoveredSkill,
  onHoverSkill,
  onSelectSkill,
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

  const [nodePositions, setNodePositions] = useState({});

  const handlePositionUpdate = useCallback((index, pos) => {
    setNodePositions((prev) => {
      const current = prev[index];
      if (current && current.distanceToSquared(pos) < 0.0001) return prev;
      return { ...prev, [index]: pos };
    });
  }, []);

  const orbitRadius = useMemo(() => {
    return skills.length > 7 ? 2.55 : 2.3;
  }, [skills.length]);

  useEffect(() => {
    orbitAngle.current = 0;
    angularVelocity.current = 0.24;
    currentTilt.current = { x: TILT_X, y: 0 };
    if (tiltGroupRef.current) {
      tiltGroupRef.current.rotation.x = TILT_X;
      tiltGroupRef.current.rotation.y = 0;
    }
    invalidate();
  }, [resetSignal, invalidate, category.key]);

  useFrame((_, delta) => {
    const targetSpeed = hoveredSkill ? 0.03 : (isPaused || reducedMotion ? 0 : 0.22);

    if (!isDragging.current) {
      angularVelocity.current = THREE.MathUtils.lerp(angularVelocity.current, targetSpeed, delta * 3.8);
      orbitAngle.current += angularVelocity.current * delta;
    }

    if (tiltGroupRef.current) {
      tiltGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        tiltGroupRef.current.rotation.x,
        currentTilt.current.x,
        delta * 4
      );
      tiltGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        tiltGroupRef.current.rotation.y,
        currentTilt.current.y,
        delta * 4
      );
    }
  });

  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    orbitAngle.current += dx * 0.008;
    currentTilt.current.x = Math.max(0.1, Math.min(0.85, currentTilt.current.x + dy * 0.005));
    currentTilt.current.y = Math.max(-0.5, Math.min(0.5, currentTilt.current.y + dx * 0.003));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const accent = category.accent || '#3b82f6';

  return (
    <group
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <ambientLight intensity={isDark ? 0.8 : 1.1} />
      <pointLight position={[6, 8, 6]} intensity={1.3} />
      <pointLight position={[-6, -6, -6]} intensity={0.6} color={accent} />

      <group ref={tiltGroupRef} rotation={[TILT_X, 0, TILT_Z]}>
        {/* Orbital Track Rings */}
        <CategoryOrbitTracks category={category} orbitRadius={orbitRadius} />

        {/* Central Core */}
        <CentralCategoryCore category={category} isDark={isDark} />

        {/* Connecting Beams to Active / Hovered Nodes */}
        {skills.map((skill, index) => {
          const isSelected = selectedSkill === skill.name;
          const isHovered = hoveredSkill === skill.name;
          const pos = nodePositions[index];
          if (!pos || (!isSelected && !isHovered)) return null;

          return (
            <ConnectingBeam
              key={`beam-${skill.name}`}
              position={pos}
              isTargeted={isHovered || isSelected}
              accent={accent}
            />
          );
        })}

        {/* Orbiting Satellites */}
        {skills.map((skill, index) => {
          const isSelected = selectedSkill === skill.name;
          const isHovered = hoveredSkill === skill.name;
          const yOffset = skills.length > 7 ? ((index % 2 === 0 ? 1 : -1) * 0.12) : 0;

          return (
            <CategoryOrbitNode
              key={skill.name}
              tech={skill}
              index={index}
              total={skills.length}
              orbitRadius={orbitRadius}
              yOffset={yOffset}
              orbitAngle={orbitAngle}
              isSelected={isSelected}
              isHovered={isHovered}
              onHover={(s) => onHoverSkill(s?.name || null)}
              onSelect={(s) => onSelectSkill(s?.name || null)}
              isDark={isDark}
              onPositionUpdate={handlePositionUpdate}
            />
          );
        })}
      </group>
    </group>
  );
}

export default function CategoryOrbit3D({
  category,
  skills = [],
  selectedSkill,
  onSelectSkill,
  labels = {},
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  // Reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', updateMotion);
    return () => mq.removeEventListener('change', updateMotion);
  }, []);

  // Sync theme
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // IntersectionObserver to avoid rendering when scrolled out of view
  useEffect(() => {
    if (!containerRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[380px] w-full select-none flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/90 shadow-inner dark:border-slate-800 sm:h-[440px] lg:h-[480px]"
      role="region"
      aria-label={labels.view_orbit || '3D Category Orbit'}
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
          <CategoryOrbitScene
            category={category}
            skills={skills}
            selectedSkill={selectedSkill}
            hoveredSkill={hoveredSkill}
            onHoverSkill={setHoveredSkill}
            onSelectSkill={onSelectSkill}
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
          <span className="hidden sm:inline">
            {labels.orbit_hint || 'Drag to rotate orbit • Click node to inspect evidence'}
          </span>
          <span className="sm:hidden">
            {labels.orbit_touch_hint || 'Swipe to rotate • Tap node to inspect'}
          </span>
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
