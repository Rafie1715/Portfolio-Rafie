import * as THREE from 'three';
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
  context.fillRect(0, 0, TEXTURE_WIDTH, 215);

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
  context.font = '700 34px Arial';
  context.fillText('UPN VETERAN JAKARTA', 175, 88);
  context.fillStyle = '#d1fae5';
  context.font = '700 19px Arial';
  context.fillText('FACULTY OF COMPUTER SCIENCE', 175, 126);
  context.font = '700 18px Arial';
  context.fillText('PROFILE ID', 690, 174);

  const photoX = 225;
  const photoY = 270;
  const photoWidth = 450;
  const photoHeight = 390;
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
  context.fillStyle = '#64748b';
  context.font = '700 18px Arial';
  context.fillText('DEVELOPER PROFILE', TEXTURE_WIDTH / 2, 725);
  context.fillStyle = '#0f172a';
  context.font = '700 42px Arial';
  context.fillText('RAFIE ROJAGAT BACHRI', TEXTURE_WIDTH / 2, 780);
  context.fillStyle = '#047857';
  context.font = '700 25px Arial';
  context.fillText('INFORMATICS GRADUATE', TEXTURE_WIDTH / 2, 825);

  context.strokeStyle = '#e2e8f0';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(90, 885);
  context.lineTo(810, 885);
  context.stroke();

  context.fillStyle = '#64748b';
  context.font = '700 17px Arial';
  context.fillText('FOCUS', 260, 945);
  context.fillText('GRADUATION', 640, 945);
  context.fillStyle = '#0f172a';
  context.font = '700 27px Arial';
  context.fillText('MOBILE & WEB', 260, 990);
  context.fillText('2026', 640, 990);

  context.fillStyle = '#dcfce7';
  drawRoundedRect(context, 275, 1040, 350, 72, 16);
  context.fill();
  context.fillStyle = '#166534';
  context.font = '700 23px Arial';
  context.fillText('OPEN TO WORK', TEXTURE_WIDTH / 2, 1087);

  context.fillStyle = '#0f172a';
  context.fillRect(0, 1195, TEXTURE_WIDTH, 125);
  context.fillStyle = '#cbd5e1';
  context.font = '700 19px Arial';
  context.fillText('ANDROID  /  FRONT-END  /  AI', TEXTURE_WIDTH / 2, 1268);

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

const BadgeModel = ({ active, reducedMotion }) => {
  const pivot = useRef(null);
  const angularVelocity = useRef(new THREE.Vector3());
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const geometry = useMemo(() => createCardGeometry(), []);
  const texture = useMemo(() => createBadgeTexture(profileImage), [profileImage]);

  useEffect(() => {
    const image = new Image();
    let cancelled = false;
    image.onload = () => {
      if (!cancelled) setProfileImage(image);
    };
    image.src = '/images/profile.webp';
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => texture?.dispose(), [texture]);

  useEffect(() => {
    document.body.style.cursor = dragging ? 'grabbing' : hovered ? 'grab' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [dragging, hovered]);

  const finishDrag = (event) => {
    event?.stopPropagation();
    event?.target.releasePointerCapture?.(event.pointerId);
    angularVelocity.current.multiplyScalar(1.18);
    setDragging(false);
  };

  useFrame((state, delta) => {
    if (!pivot.current || !active || reducedMotion) return;

    const elapsed = state.clock.getElapsedTime();
    const frameDelta = Math.min(delta, 1 / 30);
    const targetX = dragging
      ? state.pointer.y * -0.22
      : hovered
        ? state.pointer.y * -0.055
        : Math.sin(elapsed * 0.55) * 0.015;
    const targetY = dragging
      ? state.pointer.x * 0.52
      : hovered
        ? state.pointer.x * 0.12
        : Math.sin(elapsed * 0.42) * 0.055;
    const targetZ = dragging
      ? state.pointer.x * -0.16
      : Math.sin(elapsed * 0.7) * 0.018;
    const stiffness = dragging ? 52 : 18;
    const damping = dragging ? 10 : 5.2;

    stepRotationSpring(
      pivot.current.rotation,
      angularVelocity.current,
      'x',
      targetX,
      stiffness,
      damping,
      frameDelta,
      0.28,
    );
    stepRotationSpring(
      pivot.current.rotation,
      angularVelocity.current,
      'y',
      targetY,
      stiffness,
      damping,
      frameDelta,
      0.62,
    );
    stepRotationSpring(
      pivot.current.rotation,
      angularVelocity.current,
      'z',
      targetZ,
      stiffness,
      damping,
      frameDelta,
      0.22,
    );
  });

  return (
    <group>
      <mesh position={[0, 2.58, 0]}>
        <boxGeometry args={[0.18, 2.25, 0.06]} />
        <meshStandardMaterial color="#047857" roughness={0.68} />
      </mesh>
      <mesh position={[0.045, 2.58, 0.036]}>
        <boxGeometry args={[0.025, 2.25, 0.012]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
      <mesh position={[0, 3.73, 0]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.25} />
      </mesh>

      <group ref={pivot} position={[0, 1.43, 0]}>
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
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => {
            if (!dragging) setHovered(false);
          }}
          onPointerDown={(event) => {
            if (reducedMotion) return;
            event.stopPropagation();
            event.target.setPointerCapture?.(event.pointerId);
            setHovered(true);
            setDragging(true);
          }}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onLostPointerCapture={() => setDragging(false)}
        >
          <mesh geometry={geometry}>
            <meshPhysicalMaterial
              color="#f8fafc"
              clearcoat={0.7}
              clearcoatRoughness={0.22}
              metalness={0.08}
              roughness={0.48}
            />
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

  const active = isVisible && !reducedMotion;

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[520px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="h-[440px] w-full md:h-[500px]" aria-label="Interactive 3D preview of Rafie's profile ID card">
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.65, 9.5], fov: 36, near: 0.1, far: 30 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          style={{ touchAction: 'pan-y' }}
        >
          <ambientLight intensity={1.9} />
          <directionalLight position={[4, 6, 8]} intensity={2.4} color="#ffffff" />
          <directionalLight position={[-4, 1, 5]} intensity={1.1} color="#a7f3d0" />
          <BadgeModel active={active} reducedMotion={reducedMotion} />
          <AnimationDriver active={active} />
        </Canvas>
      </div>
    </div>
  );
}
