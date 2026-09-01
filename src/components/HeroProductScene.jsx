import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const FRAME_INTERVAL = 1000 / 30;
const COMPUTER_CRAFTER_ASPECT = 799 / 771;
const RESTUP_CROP = { repeatX: 1 / 3, repeatY: 1 / 2, offsetX: 1 / 3, offsetY: 1 / 2 };
const FULL_TEXTURE = { repeatX: 1, repeatY: 1, offsetX: 0, offsetY: 0 };

const useProjectTexture = (url, crop = FULL_TEXTURE) => {
  const sourceTexture = useLoader(THREE.TextureLoader, url);
  const texture = useMemo(() => {
    const nextTexture = sourceTexture.clone();
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.wrapS = THREE.ClampToEdgeWrapping;
    nextTexture.wrapT = THREE.ClampToEdgeWrapping;
    nextTexture.repeat.set(crop.repeatX, crop.repeatY);
    nextTexture.offset.set(crop.offsetX, crop.offsetY);
    nextTexture.generateMipmaps = false;
    nextTexture.minFilter = THREE.LinearFilter;
    nextTexture.magFilter = THREE.LinearFilter;
    nextTexture.anisotropy = 4;
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [crop.offsetX, crop.offsetY, crop.repeatX, crop.repeatY, sourceTexture]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
};

const createPhoneGeometry = () => {
  const width = 1.82;
  const height = 3.72;
  const radius = 0.24;
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
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.055,
    bevelThickness: 0.055,
    curveSegments: 12,
    steps: 1,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
};

const ProductPhone = ({ darkMode }) => {
  const screenTexture = useProjectTexture('/images/project-restup.jpg', RESTUP_CROP);
  const phoneGeometry = useMemo(() => createPhoneGeometry(), []);

  useEffect(() => () => phoneGeometry.dispose(), [phoneGeometry]);

  return (
    <group rotation={[0.04, -0.28, 0.055]}>
      <mesh geometry={phoneGeometry}>
        <meshStandardMaterial
          color={darkMode ? '#172033' : '#dbe4f0'}
          metalness={0.72}
          roughness={0.24}
        />
      </mesh>

      <mesh position={[0, 0, 0.145]}>
        <planeGeometry args={[1.62, 3.45]} />
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </mesh>

      <mesh position={[0, 1.73, 0.205]}>
        <capsuleGeometry args={[0.055, 0.18, 4, 10]} />
        <meshStandardMaterial color="#05070b" metalness={0.35} roughness={0.35} />
      </mesh>

      <mesh position={[0.98, 0.5, 0]}>
        <boxGeometry args={[0.055, 0.56, 0.11]} />
        <meshStandardMaterial color={darkMode ? '#334155' : '#94a3b8'} metalness={0.75} roughness={0.25} />
      </mesh>
    </group>
  );
};

const ProjectPanel = ({ darkMode, image, position, rotation, size }) => {
  const texture = useProjectTexture(image);
  const [width, height] = size;

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[width + 0.16, height + 0.16, 0.13]} />
        <meshStandardMaterial
          color={darkMode ? '#111827' : '#e2e8f0'}
          metalness={0.55}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0, 0.071]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
};

const OrbitDetails = ({ darkMode, compact = false }) => (
  <group>
    <mesh rotation={[1.08, 0.12, 0.34]}>
      <torusGeometry args={[compact ? 1.35 : 2.45, 0.012, 8, 96]} />
      <meshBasicMaterial
        color={darkMode ? '#38bdf8' : '#2563eb'}
        transparent
        opacity={darkMode ? 0.58 : 0.42}
      />
    </mesh>
    {!compact && (
      <mesh rotation={[0.35, 0.9, -0.24]}>
        <torusGeometry args={[2.05, 0.008, 8, 96]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.32} />
      </mesh>
    )}
    <mesh position={[compact ? 1.05 : 2.06, compact ? 0.62 : 1.23, 0.22]}>
      <sphereGeometry args={[compact ? 0.045 : 0.065, 14, 14]} />
      <meshBasicMaterial color="#22d3ee" />
    </mesh>
    <mesh position={[compact ? -1.08 : -2.02, compact ? -0.58 : -1.16, -0.12]}>
      <sphereGeometry args={[compact ? 0.04 : 0.06, 14, 14]} />
      <meshBasicMaterial color="#2563eb" />
    </mesh>
  </group>
);

const PerformanceDriver = ({ active }) => {
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

const ProductComposition = ({ active, darkMode }) => {
  const phoneGroup = useRef(null);
  const panelGroup = useRef(null);
  const { pointer, size, viewport } = useThree();
  const isMobile = size.width < 640;
  const isTablet = size.width >= 640 && size.width < 1024;
  const phoneScale = isMobile ? 0.46 : isTablet ? 0.76 : 0.94;
  const phoneX = isMobile ? viewport.width * 0.5 : viewport.width * 0.405;
  const phoneY = isMobile ? -3.55 : -0.25;
  const panelX = -viewport.width * (isTablet ? 0.43 : 0.405);

  useFrame((state) => {
    if (!active) return;
    const elapsed = state.clock.getElapsedTime();

    if (phoneGroup.current) {
      phoneGroup.current.position.y = phoneY + Math.sin(elapsed * 0.62) * 0.09;
      phoneGroup.current.rotation.x = THREE.MathUtils.lerp(
        phoneGroup.current.rotation.x,
        pointer.y * -0.08,
        0.055,
      );
      phoneGroup.current.rotation.y = THREE.MathUtils.lerp(
        phoneGroup.current.rotation.y,
        pointer.x * 0.12,
        0.055,
      );
    }

    if (panelGroup.current) {
      panelGroup.current.position.y = Math.sin(elapsed * 0.48 + 0.8) * 0.08;
      panelGroup.current.rotation.y = THREE.MathUtils.lerp(
        panelGroup.current.rotation.y,
        pointer.x * -0.035,
        0.045,
      );
    }
  });

  return (
    <>
      <group ref={phoneGroup} position={[phoneX, phoneY, 0]} scale={phoneScale}>
        <OrbitDetails darkMode={darkMode} compact={isMobile} />
        <ProductPhone darkMode={darkMode} />
      </group>

      {!isMobile && (
        <group ref={panelGroup}>
          <ProjectPanel
            darkMode={darkMode}
            image="/images/project-computercrafter.webp"
            position={[panelX + (isTablet ? 0.12 : 0.18), 1.35, -0.65]}
            rotation={[0.04, 0.28, -0.055]}
            size={isTablet
              ? [1.8, 1.8 / COMPUTER_CRAFTER_ASPECT]
              : [2.2, 2.2 / COMPUTER_CRAFTER_ASPECT]}
          />
          <ProjectPanel
            darkMode={darkMode}
            image="/images/project-planetku.webp"
            position={[panelX + (isTablet ? 0.18 : 0.35), -1.55, -0.25]}
            rotation={[-0.04, 0.22, 0.045]}
            size={isTablet ? [1.95, 1.6] : [2.35, 1.92]}
          />
          <mesh position={[panelX + (isTablet ? 1.25 : 1.65), -0.38, -0.2]} rotation={[0.2, 0.4, 0.1]}>
            <icosahedronGeometry args={[isTablet ? 0.22 : 0.3, 1]} />
            <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.58} />
          </mesh>
        </group>
      )}
    </>
  );
};

const HeroProductScene = ({ active = true, eventSource }) => {
  const [darkMode, setDarkMode] = useState(() => (
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  ));

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setDarkMode(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.35]}
      camera={{ position: [0, 0, 10], fov: 40, near: 0.1, far: 40 }}
      eventSource={eventSource}
      eventPrefix="client"
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.dataset.heroProductCanvas = 'ready';
      }}
    >
      <ambientLight intensity={darkMode ? 1.3 : 1.65} />
      <directionalLight position={[4, 5, 8]} intensity={darkMode ? 2.2 : 2.7} color="#dbeafe" />
      <directionalLight position={[-5, -2, 5]} intensity={1.15} color="#67e8f9" />
      <ProductComposition active={active} darkMode={darkMode} />
      <PerformanceDriver active={active} />
    </Canvas>
  );
};

export default HeroProductScene;
