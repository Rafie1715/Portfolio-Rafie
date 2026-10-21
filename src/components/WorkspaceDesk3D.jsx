import * as THREE from 'three';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Laptop, Lightbulb, Monitor, RotateCcw, Smartphone, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';

// Canvas texture generators for the three interactive displays
function createTerminalTexture(isDark) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Window background
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(0, 0, 512, 340);

  // Title bar
  ctx.fillStyle = '#161e2e';
  ctx.fillRect(0, 0, 512, 38);

  // Window control dots
  ctx.beginPath();
  ctx.arc(22, 19, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(42, 19, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(62, 19, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#10b981';
  ctx.fill();

  // Title text
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('rafie@workstation: ~/projects/restup', 256, 24);

  // Terminal commands and output
  ctx.textAlign = 'left';
  ctx.font = '500 15px "Courier New", monospace';

  let y = 68;
  const lineGap = 24;

  ctx.fillStyle = '#38bdf8';
  ctx.fillText('rafie@dev:~$ git status', 24, y);
  y += lineGap;

  ctx.fillStyle = '#10b981';
  ctx.fillText('✔ On branch main (up to date with origin)', 24, y);
  y += lineGap;

  ctx.fillStyle = '#38bdf8';
  ctx.fillText('rafie@dev:~$ node --test tests/*.test.js', 24, y);
  y += lineGap;

  ctx.fillStyle = '#a78bfa';
  ctx.fillText('✔ 78 automated test suites passing [0 fail]', 24, y);
  y += lineGap;

  ctx.fillStyle = '#38bdf8';
  ctx.fillText('rafie@dev:~$ vite --port 5173', 24, y);
  y += lineGap;

  ctx.fillStyle = '#fde047';
  ctx.fillText('➜  Local:   http://localhost:5173/', 24, y);
  y += lineGap;

  ctx.fillStyle = '#94a3b8';
  ctx.fillText('➜  Active:  RestUP ML & 3D Constellation', 24, y);
  y += lineGap;

  ctx.fillStyle = '#38bdf8';
  ctx.fillText('➜  Ready in 184ms. █', 24, y);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

function createEditorTexture() {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 340;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 340, 512);

  // Tab bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 340, 36);

  ctx.fillStyle = '#7f52ff';
  ctx.fillRect(0, 33, 140, 3);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 13px monospace';
  ctx.fillText('SleepModel.kt', 18, 22);

  // Code lines with syntax highlighting
  const lines = [
    { num: '01', text: 'package me.rafie.restup', color: '#f43f5e' },
    { num: '02', text: '', color: '#fff' },
    { num: '03', text: 'class SleepEvaluator(', color: '#38bdf8' },
    { num: '04', text: '  val dataset: SurveyDataset', color: '#94a3b8' },
    { num: '05', text: ') {', color: '#38bdf8' },
    { num: '06', text: '  fun evaluateModel() {', color: '#a78bfa' },
    { num: '07', text: '    val rf = RandomForest()', color: '#fde047' },
    { num: '08', text: '    // Recall over raw accuracy', color: '#64748b' },
    { num: '09', text: '    val recall = rf.train(', color: '#38bdf8' },
    { num: '10', text: '      class = SleepState.POOR,', color: '#10b981' },
    { num: '11', text: '      samples = 1200', color: '#fb923c' },
    { num: '12', text: '    )', color: '#38bdf8' },
    { num: '13', text: '    return recall.toUiState()', color: '#a78bfa' },
    { num: '14', text: '  }', color: '#a78bfa' },
    { num: '15', text: '}', color: '#38bdf8' },
  ];

  ctx.font = '12px "Courier New", monospace';
  let y = 62;
  lines.forEach((item) => {
    ctx.fillStyle = '#475569';
    ctx.fillText(item.num, 12, y);
    ctx.fillStyle = item.color;
    ctx.fillText(item.text, 44, y);
    y += 24;
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

function createPhoneTexture() {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark screen background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 256, 480);

  // Status bar
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px sans-serif';
  ctx.fillText('10:24', 16, 26);
  ctx.fillText('5G ● 98%', 180, 26);

  // RestUP App Bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 42, 256, 52);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 17px sans-serif';
  ctx.fillText('RestUP • Sleep AI', 18, 74);

  // Score circular card
  ctx.beginPath();
  ctx.arc(128, 195, 68, 0, Math.PI * 2);
  ctx.fillStyle = '#111827';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#10b981';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '700 36px sans-serif';
  ctx.fillText('88.7', 128, 195);
  ctx.fillStyle = '#10b981';
  ctx.font = '600 13px sans-serif';
  ctx.fillText('Kualitas: Baik', 128, 222);

  // Metrics card
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1e293b';
  ctx.roundRect ? ctx.roundRect(18, 290, 220, 68, 12) : ctx.fillRect(18, 290, 220, 68);
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px sans-serif';
  ctx.fillText('Model Klasifikasi', 32, 316);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 14px sans-serif';
  ctx.fillText('Random Forest (1,200 data)', 32, 340);

  // Action Button
  ctx.fillStyle = '#2563eb';
  ctx.roundRect ? ctx.roundRect(18, 385, 220, 48, 12) : ctx.fillRect(18, 385, 220, 48);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '700 14px sans-serif';
  ctx.fillText('Cek Rekomendasi Tidur', 128, 415);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

// 3D Scene Objects
function DeskPlatform({ isDark }) {
  return (
    <group position={[0, -0.16, 0]}>
      {/* Floating diorama base slab */}
      <mesh receiveShadow>
        <boxGeometry args={[5.2, 0.32, 4.2]} />
        <meshStandardMaterial
          color={isDark ? '#0f172a' : '#f1f5f9'}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {/* Bottom accent glow trim */}
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[5.26, 0.04, 4.26]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function DeskTable({ isDark }) {
  return (
    <group position={[0, 0.72, 0]}>
      {/* Main desktop surface with rounded chamfer look */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.09, 2.15]} />
        <meshStandardMaterial
          color={isDark ? '#1e222d' : '#e2e8f0'}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      {/* Desk mat / mousepad */}
      <mesh position={[0, 0.048, 0.16]} receiveShadow>
        <boxGeometry args={[2.5, 0.008, 1.15]} />
        <meshStandardMaterial
          color={isDark ? '#090d16' : '#334155'}
          roughness={0.7}
        />
      </mesh>

      {/* 4 Sleek Table Legs */}
      {[
        [-1.55, -0.36, -0.92],
        [1.55, -0.36, -0.92],
        [-1.55, -0.36, 0.92],
        [1.55, -0.36, 0.92],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.72, 16]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function LaptopDevice({ isDark, terminalTexture, onClick, isFocused }) {
  return (
    <group
      position={[-0.25, 0.78, 0.28]}
      rotation={[0, 0.08, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      cursor="pointer"
    >
      {/* Laptop Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.96, 0.024, 0.65]} />
        <meshStandardMaterial
          color={isDark ? '#334155' : '#94a3b8'}
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Keyboard Recess */}
      <mesh position={[0, 0.014, -0.06]}>
        <boxGeometry args={[0.84, 0.004, 0.36]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.014, 0.2]}>
        <boxGeometry args={[0.34, 0.002, 0.2]} />
        <meshStandardMaterial color={isDark ? '#1e293b' : '#cbd5e1'} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Screen Lid (angled open at ~106 degrees) */}
      <group position={[0, 0.012, -0.32]} rotation={[-0.26, 0, 0]}>
        {/* Back Lid */}
        <mesh position={[0, 0.31, -0.01]} castShadow>
          <boxGeometry args={[0.96, 0.62, 0.018]} />
          <meshStandardMaterial
            color={isDark ? '#334155' : '#94a3b8'}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Display Screen */}
        <mesh position={[0, 0.31, 0.001]}>
          <planeGeometry args={[0.91, 0.57]} />
          <meshBasicMaterial map={terminalTexture} />
        </mesh>

        {/* Screen ambient light emission */}
        <pointLight position={[0, 0.3, 0.25]} intensity={isFocused ? 1.6 : 0.8} color="#38bdf8" distance={1.8} />
      </group>
    </group>
  );
}

function VerticalMonitor({ isDark, editorTexture, onClick, isFocused }) {
  return (
    <group
      position={[1.1, 0.77, -0.1]}
      rotation={[0, -0.38, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      cursor="pointer"
    >
      {/* Stand Base */}
      <mesh position={[0, 0.01, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.02, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Stand Vertical Arm */}
      <mesh position={[0, 0.42, -0.08]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.84, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Vertical Screen Bezel */}
      <mesh position={[0, 0.64, 0]} castShadow>
        <boxGeometry args={[0.72, 1.18, 0.03]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Vertical Screen Display */}
      <mesh position={[0, 0.64, 0.017]}>
        <planeGeometry args={[0.67, 1.13]} />
        <meshBasicMaterial map={editorTexture} />
      </mesh>

      {/* Screen ambient glow */}
      <pointLight position={[0, 0.64, 0.25]} intensity={isFocused ? 1.4 : 0.7} color="#a78bfa" distance={1.6} />
    </group>
  );
}

function SmartphoneDock({ phoneTexture, onClick, isFocused }) {
  return (
    <group
      position={[-1.02, 0.77, 0.36]}
      rotation={[0, 0.32, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      cursor="pointer"
    >
      {/* Aluminum Stand */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.22, 0.08, 0.22]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Smartphone Body (angled back ~16 deg) */}
      <group position={[0, 0.16, 0.02]} rotation={[-0.28, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.64, 0.022]} />
          <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Screen Display */}
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.32, 0.61]} />
          <meshBasicMaterial map={phoneTexture} />
        </mesh>

        <pointLight position={[0, 0, 0.15]} intensity={isFocused ? 1.2 : 0.5} color="#10b981" distance={1.2} />
      </group>
    </group>
  );
}

function DeskLamp({ isLampOn, onToggleLamp }) {
  return (
    <group
      position={[-1.25, 0.77, -0.62]}
      onClick={(e) => {
        e.stopPropagation();
        onToggleLamp();
      }}
      cursor="pointer"
    >
      {/* Lamp Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.03, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Arm Rod 1 */}
      <mesh position={[0, 0.32, 0]} rotation={[0, 0, -0.18]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.64, 16]} />
        <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Arm Rod 2 (angled towards desk center) */}
      <mesh position={[0.18, 0.74, 0.12]} rotation={[0.24, 0, -0.42]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.54, 16]} />
        <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Lamp Shade (Conical, pointing down) */}
      <mesh position={[0.42, 0.88, 0.28]} rotation={[0.4, 0, -0.4]} castShadow>
        <coneGeometry args={[0.16, 0.24, 24, 1, true]} />
        <meshStandardMaterial
          color="#0f172a"
          side={THREE.DoubleSide}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Bulb */}
      <mesh position={[0.42, 0.84, 0.28]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={isLampOn ? '#fef08a' : '#475569'}
          emissive={isLampOn ? '#fde047' : '#000000'}
          emissiveIntensity={isLampOn ? 2.5 : 0}
        />
      </mesh>

      {/* Warm SpotLight shining down on the desk */}
      {isLampOn && (
        <spotLight
          position={[0.42, 0.84, 0.28]}
          target-position={[-0.2, 0.72, 0.1]}
          intensity={3.4}
          angle={0.65}
          penumbra={0.6}
          color="#fef08a"
          castShadow
        />
      )}
    </group>
  );
}

function CoffeeMug() {
  const steamRef = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    steamRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      const progress = ((t * 0.8 + index * 0.35) % 1);
      mesh.position.y = 0.14 + progress * 0.28;
      mesh.position.x = Math.sin(t * 2 + index) * 0.02;
      mesh.material.opacity = Math.sin(progress * Math.PI) * 0.45;
      mesh.scale.setScalar(0.7 + progress * 0.6);
    });
  });

  return (
    <group position={[0.74, 0.81, 0.52]}>
      {/* Ceramic Mug Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.065, 0.14, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>

      {/* Coffee surface */}
      <mesh position={[0, 0.058, 0]}>
        <circleGeometry args={[0.064, 24]} />
        <meshStandardMaterial color="#3d1d0c" roughness={0.2} />
      </mesh>

      {/* Mug Handle */}
      <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.045, 0.014, 12, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>

      {/* Animated Steam Puffs */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => (steamRef.current[i] = el)}
          position={[0, 0.15, 0]}
        >
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function MiniPlant() {
  return (
    <group position={[1.35, 0.81, -0.62]}>
      {/* Clay Pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.11, 0.08, 0.16, 20]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.07, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#29180d" roughness={0.9} />
      </mesh>
      {/* Low-poly Succulent Petals */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.04, 0.1, Math.sin(angle) * 0.04]}
            rotation={[0.3, angle, 0]}
          >
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#10b981" roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

function Peripherals({ isDark }) {
  return (
    <group position={[0, 0.77, 0.6]}>
      {/* Keyboard Base */}
      <mesh position={[-0.12, 0.008, 0]} castShadow>
        <boxGeometry args={[0.62, 0.016, 0.22]} />
        <meshStandardMaterial color={isDark ? '#1e293b' : '#cbd5e1'} roughness={0.4} />
      </mesh>
      {/* Keycaps Accent */}
      <mesh position={[-0.12, 0.018, 0]}>
        <boxGeometry args={[0.58, 0.008, 0.18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* Mouse */}
      <mesh position={[0.48, 0.012, 0]} castShadow>
        <boxGeometry args={[0.12, 0.024, 0.19]} />
        <meshStandardMaterial color={isDark ? '#0f172a' : '#475569'} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

// Camera Director with smooth transition
function CameraDirector({ focusMode, isInteracting, orbitRotation, orbitTilt }) {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0.85, 0));
  const currentPos = useRef(new THREE.Vector3(4.5, 3.8, 4.5));

  const targets = useMemo(() => ({
    overview: {
      position: new THREE.Vector3(4.6, 3.8, 4.6),
      target: new THREE.Vector3(0, 0.85, 0),
    },
    laptop: {
      position: new THREE.Vector3(-0.15, 1.25, 1.15),
      target: new THREE.Vector3(-0.25, 1.08, 0.05),
    },
    monitor: {
      position: new THREE.Vector3(0.85, 1.55, 0.95),
      target: new THREE.Vector3(1.1, 1.45, -0.1),
    },
    phone: {
      position: new THREE.Vector3(-0.9, 1.15, 0.95),
      target: new THREE.Vector3(-1.02, 0.92, 0.36),
    },
  }), []);

  useFrame((_, delta) => {
    const config = targets[focusMode] || targets.overview;

    if (focusMode === 'overview' && isInteracting.current) {
      // Allow dynamic orbit drag in overview mode
      const rad = 6.2;
      const x = Math.sin(orbitRotation.current) * Math.cos(orbitTilt.current) * rad;
      const z = Math.cos(orbitRotation.current) * Math.cos(orbitTilt.current) * rad;
      const y = Math.max(1.8, Math.sin(orbitTilt.current) * rad + 2.2);

      currentPos.current.lerp(new THREE.Vector3(x, y, z), delta * 5);
      currentTarget.current.lerp(config.target, delta * 4);
    } else {
      // Smoothly glide camera to destination
      currentPos.current.lerp(config.position, delta * 3.4);
      currentTarget.current.lerp(config.target, delta * 3.4);
    }

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

function DeskScene({
  focusMode,
  setFocusMode,
  isLampOn,
  setIsLampOn,
  isDark,
  resetSignal,
}) {
  const terminalTexture = useMemo(() => createTerminalTexture(isDark), [isDark]);
  const editorTexture = useMemo(() => createEditorTexture(), []);
  const phoneTexture = useMemo(() => createPhoneTexture(), []);

  const orbitRotation = useRef(0.78); // 45 deg isometric default
  const orbitTilt = useRef(0.48);
  const isInteracting = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      terminalTexture?.dispose();
      editorTexture?.dispose();
      phoneTexture?.dispose();
    };
  }, [terminalTexture, editorTexture, phoneTexture]);

  useEffect(() => {
    orbitRotation.current = 0.78;
    orbitTilt.current = 0.48;
    setFocusMode('overview');
  }, [resetSignal, setFocusMode]);

  const handlePointerDown = (e) => {
    isInteracting.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isInteracting.current || focusMode !== 'overview') return;
    const deltaX = (e.clientX - lastPointer.current.x) * 0.007;
    const deltaY = (e.clientY - lastPointer.current.y) * 0.005;

    orbitRotation.current += deltaX;
    orbitTilt.current = THREE.MathUtils.clamp(orbitTilt.current + deltaY, 0.15, 0.85);

    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isInteracting.current = false;
  };

  return (
    <group
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <CameraDirector
        focusMode={focusMode}
        isInteracting={isInteracting}
        orbitRotation={orbitRotation}
        orbitTilt={orbitTilt}
      />

      {/* Global Lighting */}
      <ambientLight intensity={isDark ? (isLampOn ? 0.9 : 0.6) : (isLampOn ? 1.4 : 1.1)} />
      <directionalLight
        position={[6, 9, 5]}
        intensity={isDark ? 1.2 : 1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-6, 3, -4]}
        intensity={0.4}
        color="#7dd3fc"
      />

      {/* Invisible plane to capture drag on empty background */}
      <mesh position={[0, 0, -1]} visible={false}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Scene Model Diorama */}
      <DeskPlatform isDark={isDark} />
      <DeskTable isDark={isDark} />
      <LaptopDevice
        isDark={isDark}
        terminalTexture={terminalTexture}
        onClick={() => setFocusMode((prev) => (prev === 'laptop' ? 'overview' : 'laptop'))}
        isFocused={focusMode === 'laptop'}
      />
      <VerticalMonitor
        isDark={isDark}
        editorTexture={editorTexture}
        onClick={() => setFocusMode((prev) => (prev === 'monitor' ? 'overview' : 'monitor'))}
        isFocused={focusMode === 'monitor'}
      />
      <SmartphoneDock
        phoneTexture={phoneTexture}
        onClick={() => setFocusMode((prev) => (prev === 'phone' ? 'overview' : 'phone'))}
        isFocused={focusMode === 'phone'}
      />
      <DeskLamp
        isLampOn={isLampOn}
        onToggleLamp={() => setIsLampOn((prev) => !prev)}
      />
      <CoffeeMug />
      <MiniPlant />
      <Peripherals isDark={isDark} />
    </group>
  );
}

export default function WorkspaceDesk3D({ labels = {} }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [focusMode, setFocusMode] = useState('overview');
  const [isLampOn, setIsLampOn] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [isDark, setIsDark] = useState(true);

  // Sync theme
  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // IntersectionObserver
  useEffect(() => {
    if (!containerRef.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[440px] w-full select-none flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-slate-950/95 shadow-xl transition-all duration-300 dark:border-slate-800 sm:h-[520px]"
      role="region"
      aria-label={labels.title || 'Interactive 3D Workstation'}
    >
      {/* 3D WebGL Canvas */}
      {isVisible && (
        <Canvas
          shadows
          camera={{ fov: 36, near: 0.1, far: 30 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          className="cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          <DeskScene
            focusMode={focusMode}
            setFocusMode={setFocusMode}
            isLampOn={isLampOn}
            setIsLampOn={setIsLampOn}
            isDark={isDark}
            resetSignal={resetSignal}
          />
        </Canvas>
      )}

      {/* Top Header HUD Bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 px-3.5 py-1.5 backdrop-blur-md shadow-md">
          <p className="flex items-center gap-2 text-xs font-bold text-white">
            <Sparkles size={14} className="text-amber-400" aria-hidden="true" />
            <span>{labels.title || 'Virtual Workstation Diorama'}</span>
          </p>
        </div>

        {/* Lamp Switch Toggle Button */}
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsLampOn((prev) => !prev)}
            aria-pressed={isLampOn}
            aria-label={isLampOn ? (labels.lamp_on || 'Lamp: On') : (labels.lamp_off || 'Lamp: Off')}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-md backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary ${
              isLampOn
                ? 'border-amber-400/50 bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40'
                : 'border-slate-700 bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb size={14} className={isLampOn ? 'text-amber-400 fill-amber-400' : ''} aria-hidden="true" />
            <span>{isLampOn ? (labels.lamp_on || 'Lamp: On') : (labels.lamp_off || 'Lamp: Off')}</span>
          </button>
        </div>
      </div>

      {/* Bottom Controls & Focus Modes HUD */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        {/* Helper Hint */}
        <p className="text-[11px] font-medium text-slate-300 drop-shadow">
          <span className="hidden sm:inline">{labels.hint || 'Drag to rotate • Click laptop, lamp, or devices to inspect'}</span>
          <span className="sm:hidden">{labels.touch_hint || 'Swipe to rotate • Tap lamp or screens to inspect'}</span>
        </p>

        {/* Interactive Focus Mode Selector Pill */}
        <div className="pointer-events-auto flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-950/85 p-1 shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => setFocusMode('overview')}
            aria-pressed={focusMode === 'overview'}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              focusMode === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>{labels.view_overview || 'Overview'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFocusMode('laptop')}
            aria-pressed={focusMode === 'laptop'}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              focusMode === 'laptop'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Laptop size={12} aria-hidden="true" />
            <span>{labels.view_laptop || 'Laptop'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFocusMode('monitor')}
            aria-pressed={focusMode === 'monitor'}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              focusMode === 'monitor'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Monitor size={12} aria-hidden="true" />
            <span>{labels.view_monitor || 'Monitor'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFocusMode('phone')}
            aria-pressed={focusMode === 'phone'}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              focusMode === 'phone'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Smartphone size={12} aria-hidden="true" />
            <span>{labels.view_phone || 'Phone'}</span>
          </button>

          <button
            type="button"
            onClick={() => setResetSignal((prev) => prev + 1)}
            aria-label={labels.reset_view || 'Reset Camera'}
            title={labels.reset_view || 'Reset Camera'}
            className="flex size-7 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <RotateCcw size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

