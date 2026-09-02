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

const ProductPhone = ({ darkMode, emphasized }) => {
  const screenTexture = useProjectTexture('/images/project-restup.jpg', RESTUP_CROP);
  const phoneGeometry = useMemo(() => createPhoneGeometry(), []);

  useEffect(() => () => phoneGeometry.dispose(), [phoneGeometry]);

  return (
    <group rotation={[0.04, -0.28, 0.055]}>
      <mesh geometry={phoneGeometry}>
        <meshStandardMaterial
          color={emphasized ? '#bfdbfe' : darkMode ? '#172033' : '#dbe4f0'}
          emissive={emphasized ? '#2563eb' : '#000000'}
          emissiveIntensity={emphasized ? 0.16 : 0}
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

const ProjectPanel = ({ darkMode, emphasized, image, position, rotation, size }) => {
  const texture = useProjectTexture(image);
  const [width, height] = size;

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[width + 0.16, height + 0.16, 0.13]} />
        <meshStandardMaterial
          color={emphasized ? '#cffafe' : darkMode ? '#111827' : '#e2e8f0'}
          emissive={emphasized ? '#0891b2' : '#000000'}
          emissiveIntensity={emphasized ? 0.14 : 0}
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

const AIProcessor = ({ darkMode, emphasized }) => {
  const pinOffsets = [-0.66, -0.22, 0.22, 0.66];

  return (
    <group rotation={[0.16, -0.34, -0.08]}>
      <mesh>
        <boxGeometry args={[1.82, 1.34, 0.24]} />
        <meshStandardMaterial
          color={emphasized ? '#fed7aa' : darkMode ? '#172033' : '#dbe4f0'}
          emissive={emphasized ? '#f97316' : '#000000'}
          emissiveIntensity={emphasized ? 0.18 : 0}
          metalness={0.68}
          roughness={0.28}
        />
      </mesh>

      <mesh position={[0, 0, 0.17]}>
        <boxGeometry args={[0.86, 0.62, 0.12]} />
        <meshStandardMaterial
          color={darkMode ? '#fb923c' : '#f97316'}
          emissive="#f97316"
          emissiveIntensity={emphasized ? 0.42 : 0.2}
          metalness={0.35}
          roughness={0.38}
        />
      </mesh>

      {[-0.43, 0, 0.43].map((offset) => (
        <mesh key={`trace-${offset}`} position={[offset, 0, 0.245]}>
          <boxGeometry args={[0.025, 1.02, 0.018]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.78} />
        </mesh>
      ))}

      {pinOffsets.map((offset) => (
        <group key={`pins-${offset}`}>
          <mesh position={[offset, 0.82, 0]}>
            <boxGeometry args={[0.12, 0.3, 0.08]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.82} roughness={0.2} />
          </mesh>
          <mesh position={[offset, -0.82, 0]}>
            <boxGeometry args={[0.12, 0.3, 0.08]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.82} roughness={0.2} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0, 0.29]} rotation={[0.3, 0.42, 0.1]}>
        <icosahedronGeometry args={[0.24, 1]} />
        <meshBasicMaterial color="#fff7ed" wireframe transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

const SystemConnections = ({ active, curves, darkMode }) => {
  const packetRefs = useRef([]);
  const colors = ['#2563eb', '#06b6d4', '#f97316'];

  useFrame((state) => {
    if (!active) return;
    const elapsed = state.clock.getElapsedTime();

    packetRefs.current.forEach((packet, index) => {
      if (!packet) return;
      const progress = (elapsed * (0.065 + (index * 0.008)) + (index * 0.31)) % 1;
      packet.position.copy(curves[index].getPointAt(progress));
      packet.rotation.x = elapsed * 0.65;
      packet.rotation.y = elapsed * 0.8;
    });
  });

  return (
    <group>
      {curves.map((curve, index) => (
        <group key={colors[index]}>
          <mesh>
            <tubeGeometry args={[curve, 32, 0.008, 4, false]} />
            <meshBasicMaterial
              color={colors[index]}
              transparent
              opacity={darkMode ? 0.3 : 0.2}
            />
          </mesh>
          <mesh ref={(node) => { packetRefs.current[index] = node; }}>
            <boxGeometry args={[0.11, 0.11, 0.11]} />
            <meshBasicMaterial color={colors[index]} transparent opacity={0.82} />
          </mesh>
        </group>
      ))}
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

const ProductComposition = ({ active, activeLens, darkMode, onSelectLens }) => {
  const systemGroup = useRef(null);
  const phoneGroup = useRef(null);
  const browserGroup = useRef(null);
  const aiGroup = useRef(null);
  const [hoveredLens, setHoveredLens] = useState(null);
  const { pointer, size, viewport } = useThree();
  const isMobile = size.width < 640;
  const isTablet = size.width >= 640 && size.width < 1024;
  const phoneScale = isMobile ? 0.3 : isTablet ? 0.76 : 0.94;
  const phoneX = isMobile ? viewport.width * 0.34 : viewport.width * 0.405;
  const phoneY = isMobile ? -3.28 : -0.25;
  const panelX = -viewport.width * (isTablet ? 0.43 : 0.405);
  const browserX = panelX + (isTablet ? 0.12 : 0.18);
  const browserY = 1.35;
  const aiX = panelX + (isTablet ? 0.18 : 0.35);
  const aiY = -1.55;
  const focusedLens = hoveredLens || activeLens;
  const curves = useMemo(() => {
    const browserPoint = new THREE.Vector3(browserX, browserY, -0.62);
    const phonePoint = new THREE.Vector3(phoneX, phoneY, -0.05);
    const aiPoint = new THREE.Vector3(aiX, aiY, -0.3);

    return [
      new THREE.CatmullRomCurve3([
        browserPoint,
        new THREE.Vector3(-0.65, 1.1, -1.1),
        new THREE.Vector3(0.75, 0.55, -0.72),
        phonePoint,
      ]),
      new THREE.CatmullRomCurve3([
        phonePoint,
        new THREE.Vector3(0.75, -0.8, -0.8),
        new THREE.Vector3(-0.55, -1.35, -0.95),
        aiPoint,
      ]),
      new THREE.CatmullRomCurve3([
        aiPoint,
        new THREE.Vector3(panelX - 0.22, -0.35, -1),
        new THREE.Vector3(panelX - 0.18, 0.65, -0.85),
        browserPoint,
      ]),
    ];
  }, [aiX, aiY, browserX, browserY, panelX, phoneX, phoneY]);

  useEffect(() => {
    document.body.style.cursor = hoveredLens ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hoveredLens]);

  const getFocusMultiplier = (lens) => {
    if (!focusedLens || focusedLens === 'overview') return 1;
    return focusedLens === lens ? 1.08 : 0.94;
  };

  const handleObjectClick = (event, lens) => {
    if (event.nativeEvent?.target?.closest?.('a, button')) return;
    event.stopPropagation();
    onSelectLens?.(lens);
  };

  const handleObjectEnter = (event, lens) => {
    event.stopPropagation();
    setHoveredLens(lens);
  };

  const handleObjectLeave = (event, lens) => {
    event.stopPropagation();
    setHoveredLens((currentLens) => (currentLens === lens ? null : currentLens));
  };

  const interactionProps = (lens) => (isMobile ? {} : {
    onClick: (event) => handleObjectClick(event, lens),
    onPointerOver: (event) => handleObjectEnter(event, lens),
    onPointerOut: (event) => handleObjectLeave(event, lens),
  });

  useFrame((state) => {
    if (!active) return;
    const elapsed = state.clock.getElapsedTime();

    if (systemGroup.current) {
      systemGroup.current.rotation.y = Math.sin(elapsed * 0.2) * 0.025;
      systemGroup.current.rotation.z = Math.sin(elapsed * 0.16 + 0.7) * 0.012;
    }

    if (phoneGroup.current) {
      phoneGroup.current.position.y = phoneY + Math.sin(elapsed * 0.62) * 0.09;
      phoneGroup.current.position.z = THREE.MathUtils.lerp(
        phoneGroup.current.position.z,
        focusedLens === 'android' ? 0.38 : 0,
        0.06,
      );
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
      const nextPhoneScale = THREE.MathUtils.lerp(
        phoneGroup.current.scale.x,
        phoneScale * getFocusMultiplier('android'),
        0.065,
      );
      phoneGroup.current.scale.setScalar(nextPhoneScale);
    }

    if (browserGroup.current) {
      browserGroup.current.position.y = browserY + Math.sin(elapsed * 0.48 + 0.8) * 0.08;
      browserGroup.current.position.z = THREE.MathUtils.lerp(
        browserGroup.current.position.z,
        focusedLens === 'frontend' ? 0.28 : 0,
        0.06,
      );
      browserGroup.current.rotation.y = THREE.MathUtils.lerp(
        browserGroup.current.rotation.y,
        pointer.x * -0.035,
        0.045,
      );
      browserGroup.current.rotation.z = Math.sin(elapsed * 0.34) * 0.015;
      const nextBrowserScale = THREE.MathUtils.lerp(
        browserGroup.current.scale.x,
        getFocusMultiplier('frontend'),
        0.065,
      );
      browserGroup.current.scale.setScalar(nextBrowserScale);
    }

    if (aiGroup.current) {
      aiGroup.current.position.y = aiY + Math.sin(elapsed * 0.55 + 1.6) * 0.1;
      aiGroup.current.position.z = THREE.MathUtils.lerp(
        aiGroup.current.position.z,
        focusedLens === 'ai' ? 0.36 : 0,
        0.06,
      );
      aiGroup.current.rotation.x = Math.sin(elapsed * 0.38) * 0.035;
      aiGroup.current.rotation.y = THREE.MathUtils.lerp(
        aiGroup.current.rotation.y,
        pointer.x * 0.06 + Math.sin(elapsed * 0.3) * 0.045,
        0.045,
      );
      const nextAiScale = THREE.MathUtils.lerp(
        aiGroup.current.scale.x,
        getFocusMultiplier('ai'),
        0.065,
      );
      aiGroup.current.scale.setScalar(nextAiScale);
    }
  });

  return (
    <group ref={systemGroup}>
      {!isMobile && <SystemConnections active={active} curves={curves} darkMode={darkMode} />}

      <group
        ref={phoneGroup}
        position={[phoneX, phoneY, 0]}
        scale={phoneScale}
        userData={{ recruiterLens: 'android' }}
        {...interactionProps('android')}
      >
        <OrbitDetails darkMode={darkMode} compact={isMobile} />
        <ProductPhone darkMode={darkMode} emphasized={focusedLens === 'android'} />
      </group>

      {!isMobile && (
        <>
          <group
            ref={browserGroup}
            position={[browserX, browserY, 0]}
            userData={{ recruiterLens: 'frontend' }}
            {...interactionProps('frontend')}
          >
            <ProjectPanel
              darkMode={darkMode}
              emphasized={focusedLens === 'frontend'}
              image="/images/project-computercrafter.webp"
              position={[0, 0, -0.65]}
              rotation={[0.04, 0.28, -0.055]}
              size={isTablet
                ? [1.8, 1.8 / COMPUTER_CRAFTER_ASPECT]
                : [2.2, 2.2 / COMPUTER_CRAFTER_ASPECT]}
            />
          </group>

          <group
            ref={aiGroup}
            position={[aiX, aiY, 0]}
            scale={isTablet ? 0.9 : 1}
            userData={{ recruiterLens: 'ai' }}
            {...interactionProps('ai')}
          >
            <AIProcessor darkMode={darkMode} emphasized={focusedLens === 'ai'} />
          </group>
        </>
      )}
    </group>
  );
};

const HeroProductScene = ({ active = true, activeLens = 'overview', eventSource, onSelectLens }) => {
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
      <ProductComposition
        active={active}
        activeLens={activeLens}
        darkMode={darkMode}
        onSelectLens={onSelectLens}
      />
      <PerformanceDriver active={active} />
    </Canvas>
  );
};

export default HeroProductScene;
