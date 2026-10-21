import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying float vElevation;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Multi-frequency undulating wave
  float wave1 = sin(pos.x * 0.45 + uTime * 0.95) * cos(pos.y * 0.38 + uTime * 0.75) * 0.42;
  float wave2 = sin((pos.x + pos.y) * 0.28 + uTime * 0.6) * 0.24;
  float wave3 = sin(pos.x * 0.9 - uTime * 1.1) * 0.12;
  
  float elevation = wave1 + wave2 + wave3;

  // Mouse disturbance wave / ripple
  float dist = distance(pos.xy, uMouse);
  float mouseEffect = smoothstep(3.8, 0.0, dist) * uMouseStrength * 0.58;
  elevation += mouseEffect;

  pos.z += elevation;
  vElevation = elevation;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = (15.0 / -viewPosition.z) * (1.0 + mouseEffect * 0.6);
}
`;

const particleFragmentShader = `
uniform vec3 uColor1; // Deep Indigo
uniform vec3 uColor2; // Cyan
uniform vec3 uColor3; // Emerald
uniform float uOpacity;
varying float vElevation;

void main() {
  // Circular soft particle disc
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, 0.15, dist) * uOpacity;

  // Elevation gradient
  float t = clamp((vElevation + 0.5) / 1.1, 0.0, 1.0);
  vec3 color = mix(uColor1, uColor2, t);
  color = mix(color, uColor3, smoothstep(0.6, 1.0, t));

  gl_FragColor = vec4(color, alpha);
}
`;

const wireframeFragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uOpacity;
varying float vElevation;

void main() {
  float t = clamp((vElevation + 0.5) / 1.1, 0.0, 1.0);
  vec3 color = mix(uColor1, uColor2, t);
  color = mix(color, uColor3, smoothstep(0.6, 1.0, t));

  gl_FragColor = vec4(color, uOpacity);
}
`;

function WaveMesh({ isDark, mousePos, mouseActive, reducedMotion }) {
  const pointsRef = useRef(null);
  const wireframeRef = useRef(null);
  const timeRef = useRef(0);
  const { camera } = useThree();

  // Create uniforms objects ONCE with empty dependency array so they are stable across re-renders
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-100, -100) },
      uMouseStrength: { value: 0 },
      uColor1: { value: new THREE.Color(isDark ? '#2563eb' : '#3b82f6') },
      uColor2: { value: new THREE.Color(isDark ? '#06b6d4' : '#0891b2') },
      uColor3: { value: new THREE.Color(isDark ? '#10b981' : '#059669') },
      uOpacity: { value: isDark ? 0.75 : 0.55 },
    }),
    []
  );

  const wireframeUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-100, -100) },
      uMouseStrength: { value: 0 },
      uColor1: { value: new THREE.Color(isDark ? '#2563eb' : '#3b82f6') },
      uColor2: { value: new THREE.Color(isDark ? '#06b6d4' : '#0891b2') },
      uColor3: { value: new THREE.Color(isDark ? '#10b981' : '#059669') },
      uOpacity: { value: isDark ? 0.16 : 0.11 },
    }),
    []
  );

  // When theme changes, mutate colors and opacities in-place without replacing the uniforms object
  useEffect(() => {
    const c1 = isDark ? '#2563eb' : '#3b82f6';
    const c2 = isDark ? '#06b6d4' : '#0891b2';
    const c3 = isDark ? '#10b981' : '#059669';
    const pOp = isDark ? 0.75 : 0.55;
    const wOp = isDark ? 0.16 : 0.11;

    uniforms.uColor1.value.set(c1);
    uniforms.uColor2.value.set(c2);
    uniforms.uColor3.value.set(c3);
    uniforms.uOpacity.value = pOp;

    wireframeUniforms.uColor1.value.set(c1);
    wireframeUniforms.uColor2.value.set(c2);
    wireframeUniforms.uColor3.value.set(c3);
    wireframeUniforms.uOpacity.value = wOp;

    // Also update directly on materials if bound
    if (pointsRef.current?.material?.uniforms) {
      pointsRef.current.material.uniforms.uColor1.value.set(c1);
      pointsRef.current.material.uniforms.uColor2.value.set(c2);
      pointsRef.current.material.uniforms.uColor3.value.set(c3);
      pointsRef.current.material.uniforms.uOpacity.value = pOp;
    }
    if (wireframeRef.current?.material?.uniforms) {
      wireframeRef.current.material.uniforms.uColor1.value.set(c1);
      wireframeRef.current.material.uniforms.uColor2.value.set(c2);
      wireframeRef.current.material.uniforms.uColor3.value.set(c3);
      wireframeRef.current.material.uniforms.uOpacity.value = wOp;
    }
  }, [isDark, uniforms, wireframeUniforms]);

  const planeGeo = useMemo(() => new THREE.PlaneGeometry(22, 14, 52, 36), []);

  useEffect(() => {
    return () => planeGeo.dispose();
  }, [planeGeo]);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      // Accumulate time monotonically so it never stops or resets on re-render
      timeRef.current += delta;
    }

    const currentT = reducedMotion ? 1.0 : timeRef.current;

    // Update uTime on both uniforms and active mesh materials directly
    uniforms.uTime.value = currentT;
    wireframeUniforms.uTime.value = currentT;

    if (pointsRef.current?.material?.uniforms?.uTime) {
      pointsRef.current.material.uniforms.uTime.value = currentT;
    }
    if (wireframeRef.current?.material?.uniforms?.uTime) {
      wireframeRef.current.material.uniforms.uTime.value = currentT;
    }

    // Smoothly interpolate mouse position to plane coordinates
    if (mouseActive.current) {
      const targetX = (mousePos.current.x - 0.5) * 16;
      const targetY = -(mousePos.current.y - 0.5) * 10;
      const mouseVec = new THREE.Vector2(targetX, targetY);

      uniforms.uMouse.value.lerp(mouseVec, delta * 8);
      wireframeUniforms.uMouse.value.copy(uniforms.uMouse.value);

      if (pointsRef.current?.material?.uniforms?.uMouse) {
        pointsRef.current.material.uniforms.uMouse.value.copy(uniforms.uMouse.value);
      }
      if (wireframeRef.current?.material?.uniforms?.uMouse) {
        wireframeRef.current.material.uniforms.uMouse.value.copy(uniforms.uMouse.value);
      }

      uniforms.uMouseStrength.value = THREE.MathUtils.lerp(uniforms.uMouseStrength.value, 1.0, delta * 6);
      wireframeUniforms.uMouseStrength.value = uniforms.uMouseStrength.value;

      if (pointsRef.current?.material?.uniforms?.uMouseStrength) {
        pointsRef.current.material.uniforms.uMouseStrength.value = uniforms.uMouseStrength.value;
      }
      if (wireframeRef.current?.material?.uniforms?.uMouseStrength) {
        wireframeRef.current.material.uniforms.uMouseStrength.value = uniforms.uMouseStrength.value;
      }

      // Subtle parallax camera tilt
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, (mousePos.current.x - 0.5) * 0.6, delta * 3);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.4 - (mousePos.current.y - 0.5) * 0.4, delta * 3);
    } else {
      uniforms.uMouseStrength.value = THREE.MathUtils.lerp(uniforms.uMouseStrength.value, 0, delta * 3);
      wireframeUniforms.uMouseStrength.value = uniforms.uMouseStrength.value;

      if (pointsRef.current?.material?.uniforms?.uMouseStrength) {
        pointsRef.current.material.uniforms.uMouseStrength.value = uniforms.uMouseStrength.value;
      }
      if (wireframeRef.current?.material?.uniforms?.uMouseStrength) {
        wireframeRef.current.material.uniforms.uMouseStrength.value = uniforms.uMouseStrength.value;
      }
    }
  });

  return (
    <group position={[0, -0.6, -1.0]} rotation={[-Math.PI * 0.36, 0, 0]}>
      {/* 3D Wireframe Grid Lines */}
      <mesh ref={wireframeRef} geometry={planeGeo}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={wireframeFragmentShader}
          uniforms={wireframeUniforms}
          wireframe
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* 3D Glowing Particles */}
      <points ref={pointsRef} geometry={planeGeo}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={particleFragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function HeroWaveMesh3D({ active = true }) {
  const containerRef = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const mouseActive = useRef(false);
  const [isDark, setIsDark] = useState(() => (
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  ));
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const updateMotion = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', updateMotion);
    return () => mq.removeEventListener('change', updateMotion);
  }, []);

  // Sync theme changes reliably
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Track pointer on hero parent element
  useEffect(() => {
    const hero = containerRef.current?.parentElement;
    if (!hero) return undefined;

    const handlePointerMove = (e) => {
      const rect = hero.getBoundingClientRect();
      mousePos.current.x = (e.clientX - rect.left) / rect.width;
      mousePos.current.y = (e.clientY - rect.top) / rect.height;
      mouseActive.current = true;
    };

    const handlePointerLeave = () => {
      mouseActive.current = false;
    };

    hero.addEventListener('pointermove', handlePointerMove, { passive: true });
    hero.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      hero.removeEventListener('pointermove', handlePointerMove);
      hero.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      style={{
        maskImage: 'radial-gradient(ellipse 68% 60% at 50% 46%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.3) 60%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 68% 60% at 50% 46%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.3) 60%, transparent 100%)',
      }}
    >
      {active && (
        <Canvas
          camera={{ position: [0, 3.4, 6.2], fov: 45, near: 0.1, far: 30 }}
          dpr={[1, 1.25]}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          className="h-full w-full"
        >
          <WaveMesh
            isDark={isDark}
            mousePos={mousePos}
            mouseActive={mouseActive}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      )}
    </div>
  );
}
