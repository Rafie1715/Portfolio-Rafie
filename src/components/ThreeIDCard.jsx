import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

const TAG_MODEL_URL =
  'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb';

useGLTF.preload(TAG_MODEL_URL);

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(null);
  const fixed = useRef(null);
  const j1 = useRef(null);
  const j2 = useRef(null);
  const j3 = useRef(null);
  const card = useRef(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2
  };

  const { nodes, materials } = useGLTF(TAG_MODEL_URL);
  
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setProfileImage(img);
    img.src = '/images/profile.webp';
  }, []);
  
  const idCardTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    // Flip vertically to match UV orientation
    context.scale(1, -1);
    context.translate(0, -canvas.height);

    // White background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Header with gradient
    const headerGradient = context.createLinearGradient(0, 0, canvas.width, 0);
    headerGradient.addColorStop(0, '#004d40');
    headerGradient.addColorStop(1, '#00695c');
    context.fillStyle = headerGradient;
    context.fillRect(0, 0, canvas.width, 100);

    // Heritage circle logo
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(60, 50, 28, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#facc15';
    context.beginPath();
    context.arc(60, 50, 16, 0, Math.PI * 2);
    context.fill();

    // Header text - smaller
    context.fillStyle = '#ffffff';
    context.font = 'bold 24px Arial';
    context.fillText('UPN VETERAN', 110, 45);
    context.font = '600 11px Arial';
    context.fillText('Fac. Computer Science', 110, 60);
    context.font = 'bold 13px Arial';
    context.fillText('STUDENT', 880, 52);

    // Photo frame with actual photo
    if (profileImage) {
      // Save current context
      context.save();
      
      // Create clipping path for rounded rect
      const photoX = 50;
      const photoY = 140;
      const photoW = 220;
      const photoH = 280;
      const radius = 8;
      
      context.beginPath();
      context.moveTo(photoX + radius, photoY);
      context.lineTo(photoX + photoW - radius, photoY);
      context.quadraticCurveTo(photoX + photoW, photoY, photoX + photoW, photoY + radius);
      context.lineTo(photoX + photoW, photoY + photoH - radius);
      context.quadraticCurveTo(photoX + photoW, photoY + photoH, photoX + photoW - radius, photoY + photoH);
      context.lineTo(photoX + radius, photoY + photoH);
      context.quadraticCurveTo(photoX, photoY + photoH, photoX, photoY + photoH - radius);
      context.lineTo(photoX, photoY + radius);
      context.quadraticCurveTo(photoX, photoY, photoX + radius, photoY);
      context.closePath();
      context.clip();
      
      // Draw image to cover the photo area
      context.drawImage(profileImage, photoX, photoY, photoW, photoH);
      
      // Restore context
      context.restore();
      
      // Draw border
      context.strokeStyle = '#bdbdbd';
      context.lineWidth = 3;
      context.strokeRect(photoX, photoY, photoW, photoH);
    } else {
      // Fallback: just border if image not loaded yet
      context.strokeStyle = '#bdbdbd';
      context.lineWidth = 3;
      context.strokeRect(50, 140, 220, 280);
      context.fillStyle = '#f0f0f0';
      context.fillRect(53, 143, 214, 274);
    }

    // DATA section - RIGHT side, more compact
    const dataX = 300;
    let dataY = 150;

    // NAME - smaller font
    context.fillStyle = '#6b7280';
    context.font = 'bold 14px Arial';
    context.fillText('NAME', dataX, dataY);
    context.fillStyle = '#111827';
    context.font = 'bold 20px Arial';
    dataY += 28;
    context.fillText('RAFIE ROJAGAT', dataX, dataY);
    dataY += 24;
    context.fillText('BACHRI', dataX, dataY);

    // ID NUMBER
    dataY += 45;
    context.fillStyle = '#6b7280';
    context.font = 'bold 14px Arial';
    context.fillText('ID NUMBER', dataX, dataY);
    context.fillStyle = '#111827';
    context.font = 'bold 19px Arial';
    dataY += 28;
    context.fillText('2210511043', dataX, dataY);

    // MAJOR
    dataY += 45;
    context.fillStyle = '#6b7280';
    context.font = 'bold 14px Arial';
    context.fillText('MAJOR', dataX, dataY);
    context.fillStyle = '#111827';
    context.font = 'bold 19px Arial';
    dataY += 28;
    context.fillText('Informatics', dataX, dataY);

    // CLASS OF
    dataY += 45;
    context.fillStyle = '#6b7280';
    context.font = 'bold 14px Arial';
    context.fillText('CLASS OF', dataX, dataY);
    context.fillStyle = '#111827';
    context.font = 'bold 19px Arial';
    dataY += 28;
    context.fillText('2022', dataX, dataY);

    // STATUS
    dataY += 45;
    context.fillStyle = '#6b7280';
    context.font = 'bold 14px Arial';
    context.fillText('STATUS', dataX, dataY);
    dataY += 8;
    context.fillStyle = '#dcfce7';
    context.fillRect(dataX, dataY, 110, 32);
    context.fillStyle = '#166534';
    context.font = 'bold 18px Arial';
    dataY += 23;
    context.fillText('ACTIVE', dataX + 12, dataY);

    // Chip gold at bottom
    const chipGradient = context.createLinearGradient(0, 0, 90, 0);
    chipGradient.addColorStop(0, '#fde68a');
    chipGradient.addColorStop(1, '#f59e0b');
    context.fillStyle = chipGradient;
    context.fillRect(70, 460, 85, 60);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [profileImage]);

  const lanyardTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;

    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    context.fillStyle = '#0f766e';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < canvas.width; i += 24) {
      context.fillRect(i, 0, 8, canvas.height);
    }

    for (let x = 20; x < canvas.width; x += 220) {
      context.beginPath();
      context.fillStyle = '#facc15';
      context.arc(x + 20, 64, 16, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = '#166534';
      context.arc(x + 20, 64, 9, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = '#ffffff';
      context.font = 'bold 36px Arial';
      context.textBaseline = 'middle';
      context.fillText('UPNVJ', x + 48, 64);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(-5.5, 1);
    texture.needsUpdate = true;
    return texture;
  }, []);

  const backCardTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    // Flip vertically to match UV orientation
    context.scale(1, -1);
    context.translate(0, -canvas.height);

    // White background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Header with gradient (matching front)
    const headerGradient = context.createLinearGradient(0, 0, canvas.width, 0);
    headerGradient.addColorStop(0, '#004d40');
    headerGradient.addColorStop(1, '#00695c');
    context.fillStyle = headerGradient;
    context.fillRect(0, 0, canvas.width, 100);

    // Header text
    context.fillStyle = '#ffffff';
    context.font = 'bold 28px Arial';
    context.textAlign = 'center';
    context.fillText('PROFESSIONAL PORTFOLIO', canvas.width / 2, 55);

    // Main content area
    let yPos = 160;

    // GitHub Section
    context.fillStyle = '#111827';
    context.font = 'bold 24px Arial';
    context.textAlign = 'left';
    context.fillText('GitHub', 80, yPos);
    
    context.fillStyle = '#6b7280';
    context.font = '20px Arial';
    yPos += 35;
    context.fillText('@rafirojagat', 80, yPos);
    
    yPos += 30;
    context.fillStyle = '#111827';
    context.font = '18px Arial';
    context.fillText('github.com/rafirojagat', 80, yPos);

    // Divider line
    yPos += 50;
    context.strokeStyle = '#e5e7eb';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(80, yPos);
    context.lineTo(canvas.width - 80, yPos);
    context.stroke();

    // LinkedIn QR placeholder (decorative pattern)
    yPos += 60;
    context.fillStyle = '#111827';
    context.font = 'bold 24px Arial';
    context.fillText('LinkedIn', 80, yPos);
    
    // QR code placeholder - simple grid pattern
    const qrX = canvas.width - 220;
    const qrY = yPos - 30;
    const qrSize = 140;
    context.fillStyle = '#111827';
    context.fillRect(qrX, qrY, qrSize, qrSize);
    
    context.fillStyle = '#ffffff';
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if ((i + j) % 2 === 0) {
          context.fillRect(qrX + i * 20 + 10, qrY + j * 20 + 10, 18, 18);
        }
      }
    }

    yPos += 35;
    context.fillStyle = '#6b7280';
    context.font = '18px Arial';
    context.fillText('linkedin.com/in/rafie-rojagat', 80, yPos);

    // Divider line
    yPos += 50;
    context.strokeStyle = '#e5e7eb';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(80, yPos);
    context.lineTo(canvas.width - 80, yPos);
    context.stroke();

    // Contact Section
    yPos += 60;
    context.fillStyle = '#111827';
    context.font = 'bold 24px Arial';
    context.fillText('Contact', 80, yPos);
    
    yPos += 40;
    context.fillStyle = '#6b7280';
    context.font = '20px Arial';
    context.fillText('✉ rafierojagat@gmail.com', 80, yPos);
    
    yPos += 35;
    context.fillText('🌐 rafiersyavanarojagat.site', 80, yPos);

    // Divider line
    yPos += 50;
    context.strokeStyle = '#e5e7eb';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(80, yPos);
    context.lineTo(canvas.width - 80, yPos);
    context.stroke();

    // Tagline Section
    yPos += 60;
    context.fillStyle = '#004d40';
    context.font = 'bold 26px Arial';
    context.textAlign = 'center';
    context.fillText('Software Engineering Student', canvas.width / 2, yPos);
    
    yPos += 35;
    context.fillStyle = '#6b7280';
    context.font = '20px Arial';
    context.fillText('Informatics • UPN Veteran Jakarta', canvas.width / 2, yPos);

    // Footer section with social media
    yPos = canvas.height - 160;
    context.fillStyle = '#111827';
    context.font = 'bold 20px Arial';
    context.textAlign = 'left';
    context.fillText('Social Media', 80, yPos);
    
    yPos += 35;
    context.fillStyle = '#6b7280';
    context.font = '18px Arial';
    context.fillText('Instagram: @rafie.rojagat', 80, yPos);
    
    yPos += 30;
    context.fillText('Twitter: @rafirojagat', 80, yPos);

    // Bottom stripe with gold accent
    const bottomGradient = context.createLinearGradient(0, canvas.height - 80, canvas.width, canvas.height - 80);
    bottomGradient.addColorStop(0, '#004d40');
    bottomGradient.addColorStop(1, '#facc15');
    context.fillStyle = bottomGradient;
    context.fillRect(0, canvas.height - 80, canvas.width, 80);

    context.fillStyle = '#ffffff';
    context.font = 'bold 18px Arial';
    context.textAlign = 'center';
    context.fillText('ID: 2210511043 • Class of 2022', canvas.width / 2, canvas.height - 42);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  
  const { width, height } = useThree((state) => state.size);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ])
  );

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
    return undefined;
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    if (fixed.current && band.current && card.current && j1.current && j2.current && j3.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }

        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );

        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        <RigidBody ref={j1} position={[0.5, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody ref={j2} position={[1, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody ref={j3} position={[1.5, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={card}
          position={[2, 0, 0]}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(event) => {
              event.target.releasePointerCapture(event.pointerId);
              drag(false);
            }}
            onPointerDown={(event) => {
              event.target.setPointerCapture(event.pointerId);
              drag(new THREE.Vector3().copy(event.point).sub(vec.copy(card.current.translation())));
            }}
          >
            {/* Front side of card */}
            <mesh geometry={nodes.card.geometry} position={[0, 0, 0.001]}>
              <meshPhysicalMaterial
                map={idCardTexture ?? materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
                side={THREE.FrontSide}
              />
            </mesh>
            
            {/* Back side of card */}
            <mesh geometry={nodes.card.geometry} position={[0, 0, -0.001]} rotation={[0, Math.PI, 0]}>
              <meshPhysicalMaterial
                map={backCardTexture ?? materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
                side={THREE.FrontSide}
              />
            </mesh>

            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#0f766e"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={lanyardTexture}
          repeat={[-5.5, 1]}
          lineWidth={1.15}
        />
      </mesh>
    </>
  );
}

export default function ThreeIDCard() {
  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        <ambientLight intensity={Math.PI} />

        <Physics debug={false} interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>

        <Environment background blur={0.75}>
          <color attach="background" args={['black']} />
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
