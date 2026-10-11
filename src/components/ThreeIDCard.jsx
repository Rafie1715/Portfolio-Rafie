import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';
import { createLanyard, stepLanyard, limitLanyardTarget, LANYARD_ANCHOR, LANYARD_LENGTH } from '../utils/lanyardPhysics';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

const FRAME_INTERVAL = 1000 / 60;
const TEXTURE_WIDTH = 900;
const TEXTURE_HEIGHT = 1320;

const drawRoundedRect = (context, x, y, width, height, radius) => {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
};

const drawImageCover = (context, image, x, y, width, height) => {
  const scale = Math.max(width / image.width, height / image.height);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.width - sourceWidth) / 2;
  const sourceY = Math.max(0, (image.height - sourceHeight) * 0.28);

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
};

const createBadgeTexture = (profileImage) => {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const context = canvas.getContext('2d');

  if (!context) return null;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#f8fafc';
  context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

  context.fillStyle = '#047857';
  context.fillRect(0, 0, TEXTURE_WIDTH, 180);

  context.fillStyle = '#ffffff';
  context.beginPath();
  context.arc(95, 92, 52, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#facc15';
  context.beginPath();
  context.arc(95, 92, 29, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#166534';
  context.beginPath();
  context.arc(95, 92, 16, 0, Math.PI * 2);
  context.fill();

  context.textAlign = 'left';
  context.fillStyle = '#ffffff';
  context.font = '700 48px Arial';
  context.fillText('UPN VETERAN', 175, 80);
  context.fillText('JAKARTA', 175, 140);

  const photoX = 140;
  const photoY = 235;
  const photoWidth = 620;
  const photoHeight = 510;
  drawRoundedRect(context, photoX, photoY, photoWidth, photoHeight, 24);
  context.save();
  context.clip();
  if (profileImage) {
    drawImageCover(context, profileImage, photoX, photoY, photoWidth, photoHeight);
  } else {
    context.fillStyle = '#e2e8f0';
    context.fillRect(photoX, photoY, photoWidth, photoHeight);
  }
  context.restore();
  context.strokeStyle = '#cbd5e1';
  context.lineWidth = 5;
  drawRoundedRect(context, photoX, photoY, photoWidth, photoHeight, 24);
  context.stroke();

  context.textAlign = 'center';
  context.fillStyle = '#0f172a';
  context.font = '700 108px Arial';
  context.fillText('Rafie', TEXTURE_WIDTH / 2, 885);
  context.font = '700 90px Arial';
  context.fillText('Rojagat Bachri', TEXTURE_WIDTH / 2, 990);
  context.fillStyle = '#047857';
  context.font = '700 54px Arial';
  context.fillText('Android · Web · AI', TEXTURE_WIDTH / 2, 1090);

  context.fillStyle = '#dcfce7';
  drawRoundedRect(context, 145, 1150, 610, 110, 30);
  context.fill();
  context.fillStyle = '#166534';
  context.font = '700 58px Arial';
  context.fillText('OPEN TO WORK', TEXTURE_WIDTH / 2, 1226);

  context.fillStyle = '#047857';
  context.fillRect(0, 1300, TEXTURE_WIDTH, 20);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
};

const createCardGeometry = () => {
  const width = 2.35;
  const height = 3.45;
  const radius = 0.14;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const shape = new THREE.Shape();

  shape.moveTo(-halfWidth + radius, -halfHeight);
  shape.lineTo(halfWidth - radius, -halfHeight);
  shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + radius);
  shape.lineTo(halfWidth, halfHeight - radius);
  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - radius, halfHeight);
  shape.lineTo(-halfWidth + radius, halfHeight);
  shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - radius);
  shape.lineTo(-halfWidth, -halfHeight + radius);
  shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + radius, -halfHeight);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 10,
    steps: 1,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
};

const stepRotationSpring = (rotation, velocity, axis, target, stiffness, damping, delta, limit) => {
  velocity[axis] += (target - rotation[axis]) * stiffness * delta;
  velocity[axis] *= Math.exp(-damping * delta);
  rotation[axis] = THREE.MathUtils.clamp(
    rotation[axis] + velocity[axis] * delta,
    -limit,
    limit,
  );
};

const AnimationDriver = ({ active }) => {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
    if (!active) return undefined;

    let animationFrame;
    let previousFrame = 0;
    const requestFrame = (timestamp) => {
      if (timestamp - previousFrame >= FRAME_INTERVAL) {
        previousFrame = timestamp;
        invalidate();
      }
      animationFrame = window.requestAnimationFrame(requestFrame);
    };

    animationFrame = window.requestAnimationFrame(requestFrame);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [active, invalidate]);

  return null;
};

const STRAP_SEGMENTS = 48;
const makeStrapGeometry = () => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array((STRAP_SEGMENTS + 1) * 6), 3).setUsage(THREE.DynamicDrawUsage));
  const indices = [];
  for (let i = 0; i < STRAP_SEGMENTS; i++) indices.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
  geometry.setIndex(indices);
  return geometry;
};

const BadgeModel = ({ active, reducedMotion, resetSignal, onDragChange, touchInteraction }) => {
  const pivot = useRef(null);
  const points = useRef(createLanyard());
  const drag = useRef(null);
  const angularVelocity = useRef(new THREE.Vector3());
  const previousEndpoint = useRef(new THREE.Vector2(0, LANYARD_ANCHOR.y - LANYARD_LENGTH));
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { gl, camera, viewport, invalidate } = useThree();
  const geometry = useMemo(() => createCardGeometry(), []);
  const texture = useMemo(() => createBadgeTexture(profileImage), [profileImage]);
  const straps = useMemo(() => [makeStrapGeometry(), makeStrapGeometry()], []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(createLanyard().map(p => new THREE.Vector3(p.x, p.y, 0))), []);
  const scratch = useMemo(() => ({
    raycaster: new THREE.Raycaster(), pointer: new THREE.Vector2(), hit: new THREE.Vector3(),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    point: new THREE.Vector3(), tangent: new THREE.Vector3(),
  }), []);

  useEffect(() => {
    const image = new Image();
    let cancelled = false;
    image.onload = () => { if (!cancelled) setProfileImage(image); };
    image.src = '/images/profile.webp';
    return () => { cancelled = true; };
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => texture?.dispose(), [texture]);
  useEffect(() => () => straps.forEach(strap => strap.dispose()), [straps]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.setProperty('cursor', dragging ? 'grabbing' : hovered ? 'grab' : '');
    return () => { canvas.style.removeProperty('cursor'); };
  }, [dragging, hovered, gl]);

  useEffect(() => {
    gl.domElement.style.setProperty('touch-action', touchInteraction ? 'none' : 'pan-y');
  }, [gl, touchInteraction]);


  const finishDrag = useCallback((event) => {
    const canvas = gl.domElement;
    if (!drag.current) return;
    const pId = event?.pointerId ?? event?.nativeEvent?.pointerId;
    if (pId != null && drag.current.pointerId != null && pId !== drag.current.pointerId) return;
    const { pointerId, velocity, lastTime } = drag.current;
    drag.current = null;
    try {
      if (pointerId != null && canvas.hasPointerCapture && canvas.hasPointerCapture(pointerId)) {
        canvas.releasePointerCapture(pointerId);
      }
    } catch {
      // safe fallback
    }

    // Impart release fling momentum
    if (event?.type === 'pointerup' && velocity && !reducedMotion && performance.now() - lastTime < 120) {
      const end = points.current.at(-1);
      const impulseX = THREE.MathUtils.clamp(velocity.x * 0.015, -0.4, 0.4);
      const impulseY = THREE.MathUtils.clamp(velocity.y * 0.015, -0.4, 0.4);
      end.previousX = end.x - impulseX;
      end.previousY = end.y - impulseY;
    }

    setDragging(false);
    setHovered(false);
    onDragChange(false);
    invalidate();
  }, [gl, invalidate, onDragChange, reducedMotion]);

  useEffect(() => {
    const canvas = gl.domElement;
    const move = (event) => {
      if (!drag.current) return;
      const pId = event.pointerId ?? event.nativeEvent?.pointerId;
      if (pId != null && drag.current.pointerId != null && pId !== drag.current.pointerId) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      scratch.pointer.set(x, y);
      scratch.raycaster.setFromCamera(scratch.pointer, camera);
      if (scratch.raycaster.ray.intersectPlane(scratch.plane, scratch.hit)) {
        const { offset, lastPointer, lastTime } = drag.current;
        const now = performance.now();
        const dt = Math.max((now - (lastTime || now)) / 1000, 0.001);

        if (lastPointer) {
          drag.current.velocity = {
            x: (scratch.hit.x - lastPointer.x) / dt,
            y: (scratch.hit.y - lastPointer.y) / dt,
          };
        }
        drag.current.lastPointer = { x: scratch.hit.x, y: scratch.hit.y };
        drag.current.lastTime = now;

        const maxH = Math.max(1.85, viewport.width / 2 - 0.4);
        drag.current.target = limitLanyardTarget(
          { x: scratch.hit.x - offset.x, y: scratch.hit.y - offset.y },
          maxH,
        );
        invalidate();
      }
    };

    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    canvas.addEventListener('lostpointercapture', finishDrag);
    window.addEventListener('blur', finishDrag);
    return () => {
      finishDrag();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
      canvas.removeEventListener('lostpointercapture', finishDrag);
      window.removeEventListener('blur', finishDrag);
    };
  }, [camera, gl, invalidate, finishDrag, scratch, viewport.width]);

  useEffect(() => {
    if (active && (touchInteraction || drag.current?.pointerType !== 'touch')) return undefined;
    const frame = window.requestAnimationFrame(() => finishDrag());
    return () => window.cancelAnimationFrame(frame);
  }, [active, touchInteraction, finishDrag]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      finishDrag();
      points.current = createLanyard();
      angularVelocity.current.set(0, 0, 0);
      previousEndpoint.current.set(0, LANYARD_ANCHOR.y - LANYARD_LENGTH);
      if (pivot.current) pivot.current.rotation.set(0, 0, 0);
      invalidate();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [resetSignal, finishDrag, invalidate]);

  useEffect(() => {
    if (reducedMotion && !dragging) {
      points.current = createLanyard();
      angularVelocity.current.set(0, 0, 0);
      if (pivot.current) pivot.current.rotation.set(0, 0, 0);
      invalidate();
    }
  }, [reducedMotion, dragging, invalidate]);

  useFrame((state, delta) => {
    if (!pivot.current) return;
    const dt = Math.min(delta, 0.05);
    if (active && (!reducedMotion || dragging)) stepLanyard(points.current, dt, drag.current?.target || null);
    const end = points.current.at(-1);
    const before = points.current.at(-2);
    if (active && !reducedMotion) {
      const vx = (end.x - previousEndpoint.current.x) / Math.max(dt, 1 / 120);
      const vy = (end.y - previousEndpoint.current.y) / Math.max(dt, 1 / 120);
      const lean = Math.atan2(end.x - before.x, before.y - end.y);
      // Fluid pendulum sway: natural lean with lanyard, organic twist & tilt
      stepRotationSpring(pivot.current.rotation, angularVelocity.current, 'z', THREE.MathUtils.clamp(lean * 0.78 - vx * 0.03, -0.75, 0.75), 18, 3.8, dt, 0.8);
      stepRotationSpring(pivot.current.rotation, angularVelocity.current, 'y', THREE.MathUtils.clamp(vx * 0.12 + end.x * 0.14, -0.45, 0.45), 16, 3.6, dt, 0.55);
      stepRotationSpring(pivot.current.rotation, angularVelocity.current, 'x', THREE.MathUtils.clamp(vy * -0.045, -0.3, 0.3), 18, 4.0, dt, 0.35);
    }

    // Soft elastic bounce boundary instead of rigid halt
    const maxSwingX = Math.max(1.85, viewport.width / 2 - 0.4);
    if (end.x > maxSwingX) {
      end.x = maxSwingX;
      end.previousX = end.x + (end.x - end.previousX) * 0.35;
    } else if (end.x < -maxSwingX) {
      end.x = -maxSwingX;
      end.previousX = end.x + (end.x - end.previousX) * 0.35;
    }

    pivot.current.position.set(end.x, end.y, 0);
    previousEndpoint.current.set(end.x, end.y);

    points.current.forEach((p, i) => curve.points[i].set(p.x, p.y, 0));
    straps.forEach((strap, stripe) => {
      const attribute = strap.getAttribute('position');
      const halfWidth = stripe ? 0.011 : 0.085;
      const offset = stripe ? 0.04 : 0;
      for (let i = 0; i <= STRAP_SEGMENTS; i++) {
        curve.getPoint(i / STRAP_SEGMENTS, scratch.point);
        curve.getTangent(i / STRAP_SEGMENTS, scratch.tangent);
        const nx = -scratch.tangent.y; const ny = scratch.tangent.x;
        attribute.setXYZ(i * 2, scratch.point.x + nx * (offset - halfWidth), scratch.point.y + ny * (offset - halfWidth), stripe ? 0.009 : 0);
        attribute.setXYZ(i * 2 + 1, scratch.point.x + nx * (offset + halfWidth), scratch.point.y + ny * (offset + halfWidth), stripe ? 0.009 : 0);
      }
      attribute.needsUpdate = true;
      // Raycasting must use the strap's current shape after a drag.
      strap.computeBoundingSphere();
    });
  });

  const startDrag = event => {
    if (!active || drag.current) return;
    if (event.nativeEvent && event.nativeEvent.button !== undefined && event.nativeEvent.button !== 0) return;
    if (event.pointerType === 'touch' && !touchInteraction) return;
    event.stopPropagation();

    // R3F puts pointerId on event.nativeEvent
    const pointerId = event.nativeEvent?.pointerId ?? event.pointerId ?? 1;

    // Raycast hit on z=0 plane
    const rayHit = (event.ray && event.ray.intersectPlane(scratch.plane, scratch.hit)) ||
      (scratch.raycaster.ray && scratch.raycaster.ray.intersectPlane(scratch.plane, scratch.hit));
    const end = points.current.at(-1);
    const hitPoint = rayHit ? scratch.hit : new THREE.Vector3(end.x, end.y - 1.94, 0);

    drag.current = {
      pointerId,
      pointerType: event.pointerType,
      offset: { x: hitPoint.x - end.x, y: hitPoint.y - end.y },
      target: { x: end.x, y: end.y },
      lastPointer: { x: hitPoint.x, y: hitPoint.y },
      velocity: { x: 0, y: 0 },
      lastTime: performance.now(),
    };

    try {
      if (gl.domElement.setPointerCapture) {
        gl.domElement.setPointerCapture(pointerId);
      }
    } catch {
      // safe fallback
    }

    setDragging(true);
    setHovered(true);
    onDragChange(true);
    invalidate();
  };

  return (
    <group>
      {straps.map((strap, index) => (
        <mesh key={index} geometry={strap} frustumCulled={false} onPointerDown={startDrag}>
          <meshBasicMaterial color={index ? '#facc15' : '#047857'} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[0, LANYARD_ANCHOR.y, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.25} />
      </mesh>
      <group
        ref={pivot}
        position={[0, LANYARD_ANCHOR.y - LANYARD_LENGTH, 0]}
        onPointerDown={startDrag}
      >
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.46, 0.28, 0.16]} />
          <meshStandardMaterial color="#64748b" metalness={0.72} roughness={0.28} />
        </mesh>
        <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.045, 12, 28]} />
          <meshStandardMaterial color="#475569" metalness={0.78} roughness={0.25} />
        </mesh>
        <group
          position={[0, -1.94, 0]}
          onPointerDown={startDrag}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => { if (!drag.current) setHovered(false); }}
        >
          {/* Expanded invisible hitbox so clicking anywhere on or near the card starts drag */}
          <mesh position={[0, 0, 0]} visible={false}>
            <boxGeometry args={[3.2, 4.4, 0.8]} />
          </mesh>
          <mesh geometry={geometry}>
            <meshPhysicalMaterial color="#f8fafc" clearcoat={0.7} clearcoatRoughness={0.22} metalness={0.08} roughness={0.48} />
          </mesh>
          <mesh position={[0, 0, 0.091]}>
            <planeGeometry args={[2.25, 3.35]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => setReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
};

export default function ThreeIDCard() {
  const { t } = useTranslation();
  const [dragging, setDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [touchInteraction, setTouchInteraction] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const update = () => {
      setDocumentVisible(!document.hidden);
      if (document.hidden) setTouchInteraction(false);
    };
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  // Keep the native pointer listeners alive when drag state re-renders this parent.
  const handleDragChange = useCallback((isDragging) => {
    setDragging(isDragging);
    if (isDragging) setHasInteracted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) setTouchInteraction(false);
      },
      { threshold: 0.05 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const active = isVisible && documentVisible;

  return (
    <div
      ref={containerRef}
      data-card-dragging={dragging}
      className={`relative w-full max-w-[520px] select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-900/10 transition-shadow duration-300 dark:border-slate-700 dark:bg-slate-900 ${
        dragging ? 'ring-2 ring-primary/40 shadow-2xl' : ''
      }`}
    >
      {!hasInteracted && !reducedMotion && (
        <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-primary/30 bg-white/95 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur dark:bg-slate-800/95 animate-pulse">
          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
          <span>3D Physics • Click & Drag to Swing</span>
        </div>
      )}
      <div className="h-[440px] w-full md:h-[500px]" role="img" aria-label={t('common.developer_id_preview')}>
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.65, 9.5], fov: 40, near: 0.1, far: 30 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          style={{ touchAction: touchInteraction ? 'none' : 'pan-y' }}
        >
          <ambientLight intensity={1.9} />
          <directionalLight position={[4, 6, 8]} intensity={2.4} color="#ffffff" />
          <directionalLight position={[-4, 1, 5]} intensity={1.1} color="#a7f3d0" />
          <BadgeModel active={active} reducedMotion={reducedMotion} resetSignal={resetSignal} onDragChange={handleDragChange} touchInteraction={touchInteraction} />
          <AnimationDriver active={active && (!reducedMotion || dragging)} />
        </Canvas>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-2 dark:border-slate-700">
        <p className="flex-1 text-left text-xs leading-5 text-slate-600 dark:text-slate-300 [@media(any-pointer:coarse)]:hidden">{t('common.developer_id_drag')}</p>
        <p className="hidden w-full text-left text-xs leading-5 text-slate-600 dark:text-slate-300 [@media(any-pointer:coarse)]:block">{t(touchInteraction ? 'common.developer_id_touch_active' : 'common.developer_id_scroll')}</p>
        <button type="button" data-card-touch-toggle aria-pressed={touchInteraction} onClick={() => { setTouchInteraction(value => !value); setResetSignal(value => value + 1); }} className="hidden min-h-11 items-center rounded-lg border border-blue-300 px-3 text-sm font-semibold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:border-blue-700 [@media(any-pointer:coarse)]:inline-flex">{t(touchInteraction ? 'common.developer_id_done' : 'common.developer_id_play')}</button>
        <button type="button" onClick={() => setResetSignal(value => value + 1)} aria-label={t('common.developer_id_reset')} title={t('common.developer_id_reset')} className="flex size-11 shrink-0 items-center justify-center rounded-lg text-primary hover:bg-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><RotateCcw size={17} aria-hidden="true" /></button>
      </div>
    </div>
  );
}
