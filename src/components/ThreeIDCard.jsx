import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Html } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { GraduationCap } from 'lucide-react';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function IDCard() {
  return (
    <div className="w-full flex justify-center items-center relative py-8 cursor-grab active:cursor-grabbing">
      <div className="w-auto h-auto">
        <Canvas 
          camera={{ position: [0, 0, 6.5], fov: 25 }} 
          style={{ width: '500px', height: '420px', background: 'transparent' }} 
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        >
        <ambientLight intensity={Math.PI} />
        
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>
        
        <Environment background={false} blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        </Environment>
      </Canvas>
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center text-sm text-gray-400 dark:text-gray-500 font-medium animate-pulse pointer-events-none whitespace-nowrap">
        <i className="fas fa-hand-pointer mr-2"></i> Drag the card to interact
      </div>
      </div>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };
  
  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.4]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.4]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.4]);
  
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 0.65, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(64));
      
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  const cardWidth = 1.8;
  const cardHeight = 1.135; 
  const cardDepth = 0.02;

  return (
    <>
      <group position={[0, 4.5, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -1, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[0, -2, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[0, -3, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        
        <RigidBody position={[0, -4, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[cardWidth / 2, cardHeight / 2, 0.01]} />
          
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}
          >
            {/* Box Mesh Dasar */}
            <mesh>
              <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.2} />
            </mesh>

            {/* Klip Besi */}
            <mesh position={[0, cardHeight / 2 + 0.05, 0]}>
              <boxGeometry args={[0.25, 0.1, 0.03]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, cardHeight / 2 + 0.1, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#e5e7eb" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* UI DEPAN KARTU */}
            <Html 
              transform 
              distanceFactor={1.58} // Menggunakan distanceFactor agar tidak error
              position={[0, 0.2, 0.015]} // Posisi z dinaikkan sedikit agar tidak tertelan kotak
              className="pointer-events-none select-none" 
            >
              <div className="w-[620px] aspect-[1.586/1] rounded-xl overflow-hidden bg-white relative shadow-sm border border-gray-200">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-100/50 pointer-events-none"></div>

                <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-[#004d40] to-[#00695c] flex items-center px-4 justify-between z-10 border-b border-[#003d33]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm">
                      <img src="/images/upnvj_logo.webp" alt="UPN" loading="lazy" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                      <GraduationCap className="w-5 h-5 text-indigo-600 hidden" strokeWidth={1.5} />
                    </div>
                    <div className="leading-tight text-white text-left">
                      <h1 className="font-bold text-sm tracking-wide">UPN VETERAN JAKARTA</h1>
                      <p className="text-[8px] opacity-90 uppercase tracking-widest">Faculty of Computer Science</p>
                    </div>
                  </div>
                  <div className="text-white font-mono font-bold text-sm tracking-widest opacity-90">STUDENT</div>
                </div>

                <div className="absolute top-[64px] bottom-0 left-0 right-0 p-5 flex gap-5">
                  <div className="flex flex-col gap-2 w-[110px] shrink-0">
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-200 shadow-inner bg-gray-100">
                      <img src="/images/profile.webp" alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold text-4xl hidden">RR</div>
                    </div>
                    <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-200 to-yellow-500 border border-yellow-600 shadow-sm mx-auto flex items-center justify-center">
                      <div className="w-6 h-5 border border-yellow-700/30 rounded-[2px] grid grid-cols-2 gap-[1px]">
                        <div className="border border-yellow-700/30"></div><div className="border border-yellow-700/30"></div>
                        <div className="border border-yellow-700/30"></div><div className="border border-yellow-700/30"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center relative z-20">
                    <div className="mb-1">
                      <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">Name</span>
                      <h2 className="text-xl font-bold text-gray-900 leading-tight uppercase font-sans">Rafie Rojagat Bachri</h2>
                    </div>
                    <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                      <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">ID Number</span>
                        <span className="font-mono text-sm font-semibold text-gray-800">2210511043</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Major</span>
                        <span className="text-sm font-semibold text-gray-800">Informatics</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Class Of</span>
                        <span className="text-sm font-semibold text-gray-800">2022</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">Status</span>
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.04] pointer-events-none rotate-[-15deg]">
                  <i className="fas fa-university text-9xl text-black"></i>
                </div>
              </div>
            </Html>
            
            {/* UI BELAKANG KARTU */}
            <Html 
              transform 
              distanceFactor={1.58}
              position={[0, 0.2, -0.015]} 
              rotation-y={Math.PI} 
              className="pointer-events-none select-none"
            >
              <div className="w-[620px] aspect-[1.586/1] rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute top-4 w-full h-12 bg-gray-800"></div> 
                    <div className="text-gray-400 font-medium text-xs text-center px-10 mt-10">
                        If found, please return to UPN "Veteran" Jakarta <br/> Faculty of Computer Science
                    </div>
                </div>
            </Html>
          </group>
        </RigidBody>
      </group>
      
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial 
          color="#004d40" 
          resolution={[width, height]} 
          lineWidth={0.4}
          transparent={true}
          opacity={0.9}
          sizeAttenuation={1}
        />
      </mesh>
    </>
  );
}
