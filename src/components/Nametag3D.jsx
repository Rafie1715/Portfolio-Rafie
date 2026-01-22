import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useTexture, RoundedBox, Environment, Center } from '@react-three/drei';
import { Physics, RigidBody, useSphericalJoint } from '@react-three/rapier';
import * as THREE from 'three';

const Card = ({ texture }) => {
  return (
    <group>
      <group position={[0, 2.3, 0]}>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[0.45, 5, 0.02]} />
          <meshBasicMaterial color="#ff6600" />
        </mesh>
        
        <Text 
          position={[0, 1.5, 0.02]} 
          rotation={[0, 0, -Math.PI / 2]} 
          fontSize={0.25} 
          color="white" 
          font="/fonts/Poppins-Bold.ttf" 
          letterSpacing={0.1}
        >
          UPNVJ
        </Text>

        <RoundedBox position={[0, -0.6, 0.02]} args={[1.2, 0.4, 0.1]} radius={0.1}>
          <meshStandardMaterial color="#111" roughness={0.3} />
        </RoundedBox>
      </group>

      <RoundedBox args={[3.2, 5.2, 0.1]} radius={0.2} smoothness={4}>
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.3} 
          metalness={0.1} 
        />
      </RoundedBox>

      <group position={[0, 0, 0.06]}>
        
        <group position={[0, 1.3, 0]}>
           <RoundedBox args={[1.8, 0.5, 0.02]} radius={0.25}>
             <meshBasicMaterial color="#ffcc00" toneMapped={false} />
           </RoundedBox>
           <Text position={[0, 0, 0.02]} fontSize={0.22} color="#1a1a1a" font="/fonts/Poppins-Bold.ttf" letterSpacing={0.05}>
              STUDENT
           </Text>
        </group>

        <group position={[0, -0.2, 0]}>
            <RoundedBox args={[2.3, 2.3, 0.01]} radius={0.1} position={[0, 0, -0.01]}>
                <meshStandardMaterial color="#ff0080" emissive="#ff0080" emissiveIntensity={0.8} />
            </RoundedBox>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[2.1, 2.1]} />
              <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
        </group>

        <group position={[0, -1.65, 0]}>
            <Text 
                position={[0, 0, 0]} 
                fontSize={0.22} 
                color="#111" 
                font="/fonts/Poppins-Bold.ttf" 
                anchorX="center" 
                maxWidth={2.8} 
                textAlign="center"
            >
              RAFIE ROJAGAT BACHRI
            </Text>
            <Text position={[0, -0.45, 0]} fontSize={0.15} color="#ff0080" font="/fonts/Poppins-Bold.ttf" anchorX="center" letterSpacing={0.15}>
              INFORMATICS
            </Text>
        </group>

        <group position={[0, -2.25, 0]}>
            <mesh position={[0, 0.25, 0]}>
                <planeGeometry args={[2.7, 0.01]} />
                <meshBasicMaterial color="#ddd" />
            </mesh>
            
            <group position={[-0.8, 0, 0]}>
                <Text fontSize={0.1} color="#999" font="/fonts/Poppins-Bold.ttf" anchorX="left">ID NUMBER</Text>
                <Text position={[0, -0.15, 0]} fontSize={0.14} color="#333" font="/fonts/Poppins-Bold.ttf" anchorX="left">2210511043</Text>
            </group>
            
            <group position={[0.8, 0, 0]}>
                <Text fontSize={0.1} color="#999" font="/fonts/Poppins-Bold.ttf" anchorX="right">YEAR</Text>
                <Text position={[0, -0.15, 0]} fontSize={0.14} color="#333" font="/fonts/Poppins-Bold.ttf" anchorX="right">2022</Text>
            </group>
        </group>

      </group>
    </group>
  );
};

const Rig = () => {
  const [texture] = useTexture(["/images/profile.webp"]);
  const fixedPoint = useRef(null);
  const cardBody = useRef(null);
  const lineRef = useRef();
  const vec = new THREE.Vector3();

  useSphericalJoint(fixedPoint, cardBody, [
    [0, 0, 0],      
    [0, 4.8, 0]     
  ]);

  useFrame((state, delta) => {
    if (!fixedPoint.current || !cardBody.current || !lineRef.current) return;
    
    const anchorPos = fixedPoint.current.translation();
    const cardPos = cardBody.current.translation();
    const cardRot = cardBody.current.rotation();
    const quaternion = new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
    
    const localOffset = new THREE.Vector3(0, 3.8, 0); 
    localOffset.applyQuaternion(quaternion);
    
    const strapTopPos = new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z).add(localOffset);

    lineRef.current.geometry.setFromPoints([
      new THREE.Vector3(anchorPos.x, anchorPos.y, anchorPos.z),
      strapTopPos
    ]);
  });

  const handlePointerMove = (e) => {
    if (!cardBody.current) return;
    vec.set((e.point.x) * 2, (e.point.y) * 2, -0.2).sub(cardBody.current.translation()).multiplyScalar(0.1);
    cardBody.current.applyImpulse(vec, true);
  };

  return (
    <group>
      <RigidBody ref={fixedPoint} position={[0, 4, 0]} type="fixed" colliders={false} />

      <RigidBody 
        ref={cardBody} 
        position={[0, 0, 0]} 
        friction={1} 
        damping={1.5}         
        angularDamping={1.5}  
        colliders="hull"      
        onPointerMove={handlePointerMove}
        onPointerDown={() => document.body.style.cursor = 'grabbing'}
        onPointerUp={() => document.body.style.cursor = 'grab'}
      >
        <Card texture={texture} />
      </RigidBody>

      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#888" linewidth={1} transparent opacity={0.6} />
      </line>
    </group>
  );
};

const Nametag3D = () => {
  return (
    <div className="w-full h-[600px]" style={{ touchAction: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <Environment preset="studio" />
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
        
        <Physics> 
          <Rig />
        </Physics>
      </Canvas>
    </div>
  );
};

export default Nametag3D;