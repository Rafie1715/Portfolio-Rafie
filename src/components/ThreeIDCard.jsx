import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';
import { createLanyard, stepLanyard, limitLanyardTarget, LANYARD_ANCHOR, LANYARD_LENGTH } from '../utils/lanyardPhysics';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

const FRAME_INTERVAL = 1000 / 30;
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

const BadgeModel = ({ active, reducedMotion, resetSignal, onDragChange }) => {
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
    const canvas = gl.domElement;
    const finish = event => {
      if (!drag.current || (event?.pointerId != null && event.pointerId !== drag.current.pointerId)) return;
      const { pointerId } = drag.current;
      drag.current = null;
      if (canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
      setDragging(false); setHovered(false); onDragChange(false); invalidate();
    };
    const move = event => {
      if (!drag.current || event.pointerId !== drag.current.pointerId) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      scratch.pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      scratch.raycaster.setFromCamera(scratch.pointer, camera);
      if (scratch.raycaster.ray.intersectPlane(scratch.plane, scratch.hit)) {
        const { offset } = drag.current;
        drag.current.target = limitLanyardTarget({ x: scratch.hit.x - offset.x, y: scratch.hit.y - offset.y }, Math.max(0.35, viewport.width / 2 - 1.45));
        invalidate();
      }
    };
    canvas.addEventListener('pointermove', move, { passive: false });
    canvas.addEventListener('pointerup', finish);
    canvas.addEventListener('pointercancel', finish);
    canvas.addEventListener('lostpointercapture', finish);
    window.addEventListener('blur', finish);
    return () => {
      finish();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', finish);
      canvas.removeEventListener('pointercancel', finish);
      canvas.removeEventListener('lostpointercapture', finish);
      window.removeEventListener('blur', finish);
    };
  }, [camera, gl, invalidate, onDragChange, scratch, viewport.width]);

  useEffect(() => {
    if (!active && drag.current) {
      const { pointerId } = drag.current;
      if (gl.domElement.hasPointerCapture(pointerId)) gl.domElement.releasePointerCapture(pointerId);
    }
  }, [active, gl]);

  useEffect(() => {
    if (drag.current && gl.domElement.hasPointerCapture(drag.current.pointerId)) gl.domElement.releasePointerCapture(drag.current.pointerId);
    points.current = createLanyard();
    angularVelocity.current.set(0, 0, 0);
    previousEndpoint.current.set(0, LANYARD_ANCHOR.y - LANYARD_LENGTH);
    if (pivot.current) pivot.current.rotation.set(0, 0, 0);
    invalidate();
  }, [resetSignal, gl, invalidate]);

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
      stepRotationSpring(pivot.current.rotation, angularVelocity.current, 'z', THREE.MathUtils.clamp(lean * 0.32 - vx * 0.035, -0.42, 0.42), 24, 5.8, dt, 0.5);
      stepRotationSpring(pivot.current.rotation, angularVelocity.current, 'y', THREE.MathUtils.clamp(vx * 0.06 + end.x * 0.08, -0.3, 0.3), 20, 5.5, dt, 0.38);
      stepRotationSpring(pivot.current.rotation, angularVelocity.current, 'x', THREE.MathUtils.clamp(vy * -0.035, -0.2, 0.2), 22, 6, dt, 0.25);
    }
    // Reserve room for the entire tilted badge, including its lower corners.
    const tilt = pivot.current.rotation.z;
    const halfWidth = viewport.width / 2 - 0.18;
    const cardHalfWidth = 1.3 * Math.cos(tilt);
    const bottomOffset = 3.75 * Math.sin(tilt);
    const boundedX = THREE.MathUtils.clamp(end.x,
      -halfWidth + cardHalfWidth - Math.min(0, bottomOffset),
      halfWidth - cardHalfWidth - Math.max(0, bottomOffset));
    end.previousX += boundedX - end.x;
    end.x = boundedX;
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
    });
  });

  const startDrag = event => {
    if (!active || drag.current || event.button !== 0 || event.nativeEvent?.isPrimary === false) return;
    event.stopPropagation();
    if (!event.ray.intersectPlane(scratch.plane, scratch.hit)) return;
    const end = points.current.at(-1);
    drag.current = {
      pointerId: event.pointerId,
      offset: { x: scratch.hit.x - end.x, y: scratch.hit.y - end.y },
      target: { x: end.x, y: end.y },
    };
    gl.domElement.setPointerCapture(event.pointerId);
    setDragging(true); setHovered(true); onDragChange(true); invalidate();
  };

  return (
    <group>
      {straps.map((strap, index) => (
        <mesh key={index} geometry={strap} frustumCulled={false}>
          <meshBasicMaterial color={index ? '#facc15' : '#047857'} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[0, LANYARD_ANCHOR.y, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.25} />
      </mesh>
      <group ref={pivot} position={[0, LANYARD_ANCHOR.y - LANYARD_LENGTH, 0]}>
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.46, 0.28, 0.16]} />
          <meshStandardMaterial color="#64748b" metalness={0.72} roughness={0.28} />
        </mesh>
        <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.045, 12, 28]} />
          <meshStandardMaterial color="#475569" metalness={0.78} roughness={0.25} />
        </mesh>
        <group position={[0, -1.94, 0]} onPointerDown={startDrag}
          onPointerOver={() => setHovered(true)} onPointerOut={() => { if (!drag.current) setHovered(false); }}>
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
  const [resetSignal, setResetSignal] = useState(0);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
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
      className="w-full max-w-[520px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="h-[440px] w-full md:h-[500px]" role="img" aria-label={t('common.developer_id_preview')}>
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.65, 9.5], fov: 40, near: 0.1, far: 30 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          style={{ touchAction: 'none' }}
        >
          <ambientLight intensity={1.9} />
          <directionalLight position={[4, 6, 8]} intensity={2.4} color="#ffffff" />
          <directionalLight position={[-4, 1, 5]} intensity={1.1} color="#a7f3d0" />
          <BadgeModel active={active} reducedMotion={reducedMotion} resetSignal={resetSignal} onDragChange={setDragging} />
          <AnimationDriver active={active && (!reducedMotion || dragging)} />
        </Canvas>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-2 dark:border-slate-700">
        <p className="text-left text-xs leading-5 text-slate-500 dark:text-slate-400">{t('common.developer_id_drag')}</p>
        <button type="button" onClick={() => setResetSignal(value => value + 1)} aria-label={t('common.developer_id_reset')} title={t('common.developer_id_reset')} className="flex size-11 shrink-0 items-center justify-center rounded-lg text-primary hover:bg-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><RotateCcw size={17} aria-hidden="true" /></button>
      </div>
    </div>
  );
}
