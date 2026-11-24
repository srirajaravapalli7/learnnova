import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Stars } from "@react-three/drei";
import * as THREE from "three";
import StarDust from "./StarDust.jsx";

const steel = new THREE.MeshStandardMaterial({ color: "#213346", metalness: 0.68, roughness: 0.34 });
const glass = new THREE.MeshStandardMaterial({ color: "#1d4054", metalness: 0.58, roughness: 0.2, emissive: "#0a2b3a", emissiveIntensity: 0.56 });
const frame = new THREE.MeshStandardMaterial({ color: "#526779", metalness: 0.82, roughness: 0.28 });
const pavement = new THREE.MeshStandardMaterial({ color: "#202f3f", metalness: 0.32, roughness: 0.7 });
const windowLit = new THREE.MeshStandardMaterial({ color: "#6a9aaa", emissive: "#1d455a", emissiveIntensity: 0.65, metalness: 0.25, roughness: 0.22 });

function CameraDrift() {
  const { camera, pointer, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    camera.fov = size.width < 620
      ? THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(24)) / Math.max(aspect, 0.65)))
      : 34;
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);
  useFrame(() => {
    camera.position.x += (pointer.x * 0.72 - camera.position.x) * 0.018;
    camera.position.y += (10.2 + pointer.y * 0.24 - camera.position.y) * 0.018;
    camera.lookAt(0, 1.15, 0);
  });
  return null;
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.28, 0]} castShadow material={frame}>
        <cylinderGeometry args={[0.06, 0.09, 0.56, 8]} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshStandardMaterial color="#284d52" roughness={0.86} />
      </mesh>
      <mesh position={[0.15, 0.83, 0.08]} scale={0.55}>
        <icosahedronGeometry args={[0.25, 1]} />
        <meshStandardMaterial color="#315e5c" roughness={0.88} />
      </mesh>
    </group>
  );
}

function CampusGround() {
  const trees = [
    [-8.1, 0, -4.7], [-6.5, 0, 4.8], [-3.6, 0, 5.25], [0, 0, 5.2],
    [3.8, 0, 5.1], [7.6, 0, 4.3], [8, 0, -4.8], [1.1, 0, -5.3],
  ];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#080e18" roughness={0.96} />
      </mesh>
      <mesh position={[0, -0.22, 0]} receiveShadow castShadow material={steel}>
        <boxGeometry args={[19.6, 0.66, 13.2]} />
      </mesh>
      <mesh position={[0, 0.125, 0]} receiveShadow material={pavement}>
        <boxGeometry args={[19.25, 0.06, 12.85]} />
      </mesh>
      <mesh position={[0, 0.17, 0]} material={new THREE.MeshStandardMaterial({ color: "#223348", roughness: 0.83 })}>
        <boxGeometry args={[1.15, 0.025, 11.9]} />
      </mesh>
      <mesh position={[0, 0.172, 0]} material={new THREE.MeshStandardMaterial({ color: "#223348", roughness: 0.83 })}>
        <boxGeometry args={[18.5, 0.025, 0.85]} />
      </mesh>
      <mesh position={[0, 0.19, 0]} receiveShadow>
        <cylinderGeometry args={[1.42, 1.42, 0.08, 48]} />
        <meshStandardMaterial color="#26384a" metalness={0.42} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.24, 0]} receiveShadow>
        <cylinderGeometry args={[0.76, 0.76, 0.08, 48]} />
        <meshStandardMaterial color="#415969" metalness={0.5} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.37, 0]} castShadow>
        <cylinderGeometry args={[0.47, 0.55, 0.2, 32]} />
        <meshStandardMaterial color="#172b3b" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.23, 12]} />
        <meshStandardMaterial color="#86bac0" emissive="#245569" emissiveIntensity={0.55} metalness={0.8} roughness={0.22} />
      </mesh>
      {trees.map((position) => <Tree key={position.join(",")} position={position} scale={0.9 + (position[0] % 2) * 0.05} />)}
      {[
        [-2.5, 0.21, 4.95], [2.4, 0.21, 4.95], [-8.7, 0.21, 0.7], [8.6, 0.21, -0.5],
      ].map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[0.09, 0.08, 0.09]} />
          <meshStandardMaterial color="#6a9ba8" emissive="#294d5a" emissiveIntensity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function BuildingWindows({ width, depth, floors, columns, height }) {
  const windowWidth = Math.min(0.37, (width - 0.55) / columns * 0.54);
  const windowHeight = Math.min(0.43, height / floors * 0.42);
  return (
    <group>
      {Array.from({ length: floors }, (_, floorIndex) =>
        Array.from({ length: columns }, (_, columnIndex) => {
          const x = -width / 2 + 0.42 + columnIndex * ((width - 0.84) / Math.max(columns - 1, 1));
          const y = 0.56 + floorIndex * (height / floors);
          const material = (floorIndex + columnIndex) % 4 === 1 ? windowLit : glass;
          return (
            <group key={`${floorIndex}-${columnIndex}`}>
              <mesh position={[x, y, depth / 2 + 0.022]} material={material}>
                <boxGeometry args={[windowWidth, windowHeight, 0.045]} />
              </mesh>
              <mesh position={[width / 2 + 0.022, y, -x * 0.58]} material={glass}>
                <boxGeometry args={[0.045, windowHeight, Math.max(0.22, windowWidth * 0.72)]} />
              </mesh>
            </group>
          );
        }),
      )}
    </group>
  );
}

function DepartmentBuilding({ department, selected, onSelect }) {
  const group = useRef();
  const [hovered, setHovered] = useState(false);
  const { width, depth, height, floors, columns, kind, accent } = department;

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetScale = hovered || selected ? 1.045 : 1;
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), Math.min(delta * 5, 1));
  });

  const pick = (event) => {
    event.stopPropagation();
    onSelect(department.id);
  };
  const enter = (event) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const leave = (event) => {
    event.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group
      ref={group}
      position={department.position}
      onClick={pick}
      onPointerOver={enter}
      onPointerOut={leave}
    >
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow material={steel}>
        <boxGeometry args={[width + 0.45, 0.5, depth + 0.42]} />
      </mesh>
      <mesh position={[0, 0.53, 0]} material={frame}>
        <boxGeometry args={[width + 0.16, 0.08, depth + 0.16]} />
      </mesh>
      <mesh position={[0, 0.55 + height / 2, 0]} castShadow receiveShadow material={steel}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>
      <BuildingWindows width={width} depth={depth} floors={floors} columns={columns} height={height} />
      {Array.from({ length: floors + 1 }, (_, index) => (
        <mesh key={`band-${index}`} position={[0, 0.61 + index * (height / floors), depth / 2 + 0.09]} material={frame}>
          <boxGeometry args={[width + 0.12, 0.075, 0.13]} />
        </mesh>
      ))}
      {Array.from({ length: columns + 1 }, (_, index) => {
        const x = -width / 2 + index * (width / columns);
        return <mesh key={`mullion-${index}`} position={[x, 0.55 + height / 2, depth / 2 + 0.11]} material={frame}><boxGeometry args={[0.075, height + 0.04, 0.12]} /></mesh>;
      })}
      <mesh position={[0, 0.92, depth / 2 + 0.15]} material={new THREE.MeshStandardMaterial({ color: "#0d1824", metalness: 0.44, roughness: 0.34 })}>
        <boxGeometry args={[0.48, 0.72, 0.09]} />
      </mesh>
      <mesh position={[0, 0.62, depth / 2 + 0.27]} castShadow material={frame}>
        <boxGeometry args={[1.25, 0.14, 0.6]} />
      </mesh>
      <mesh position={[0, 0.6, depth / 2 + 0.52]} material={pavement}>
        <boxGeometry args={[1.52, 0.08, 0.72]} />
      </mesh>
      <mesh position={[0, 0.55 + height + 0.12, 0]} castShadow material={frame}>
        <boxGeometry args={[width + 0.38, 0.24, depth + 0.36]} />
      </mesh>
      {kind === "library" && (
        <group>
          <mesh position={[0, 0.55 + height + 0.42, -0.1]} castShadow material={steel}>
            <boxGeometry args={[width * 0.84, 0.42, depth * 0.78]} />
          </mesh>
          {[-1.2, -0.4, 0.4, 1.2].map((x) => <mesh key={x} position={[x, 0.72, depth / 2 + 0.24]} castShadow material={frame}><boxGeometry args={[0.11, 1.12, 0.14]} /></mesh>)}
        </group>
      )}
      {kind === "math" && (
        <group>
          <mesh position={[0, 0.55 + height + 0.58, 0]} castShadow material={steel}>
            <boxGeometry args={[width * 0.66, 0.72, depth * 0.68]} />
          </mesh>
          <mesh position={[0, 0.55 + height + 0.6, depth * 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.29, 0.29, 0.08, 32]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.13} metalness={0.65} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.55 + height + 1.13, 0]} castShadow material={frame}><boxGeometry args={[width * 0.72, 0.12, depth * 0.74]} /></mesh>
        </group>
      )}
      {kind === "studio" && (
        <group>
          <mesh position={[width * 0.44, 1.02, -0.35]} rotation={[0, -0.12, -0.025]} castShadow material={steel}>
            <boxGeometry args={[width * 0.42, 1.08, depth * 0.82]} />
          </mesh>
          <mesh position={[width * 0.44, 1.58, -0.35]} rotation={[0, -0.12, -0.025]} castShadow material={frame}>
            <boxGeometry args={[width * 0.48, 0.12, depth * 0.9]} />
          </mesh>
          <mesh position={[-width * 0.25, 1.82, depth / 2 + 0.2]} material={windowLit}>
            <boxGeometry args={[0.85, 0.06, 0.06]} />
          </mesh>
        </group>
      )}
      {kind === "ai" && (
        <group>
          <mesh position={[0.35, 0.55 + height + 0.4, 0]} castShadow material={steel}>
            <boxGeometry args={[width * 0.58, 0.62, depth * 0.68]} />
          </mesh>
          <mesh position={[0.35, 0.55 + height + 0.4, depth * 0.36]} material={windowLit}>
            <boxGeometry args={[width * 0.5, 0.36, 0.05]} />
          </mesh>
          <mesh position={[0.35, 0.55 + height + 0.8, 0]} castShadow material={frame}>
            <boxGeometry args={[width * 0.64, 0.12, depth * 0.75]} />
          </mesh>
          <mesh position={[0.35, 0.55 + height + 1.1, 0]} material={new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.16, metalness: 0.7, roughness: 0.24 })}>
            <cylinderGeometry args={[0.055, 0.055, 0.52, 12]} />
          </mesh>
        </group>
      )}
      {kind === "programming" && (
        <group>
          <mesh position={[-width * 0.34, 0.55 + height * 0.58, -depth * 0.14]} castShadow material={steel}>
            <boxGeometry args={[width * 0.3, height * 0.82, depth * 0.88]} />
          </mesh>
          <mesh position={[-width * 0.34, 0.55 + height * 0.58, depth * 0.34]} material={glass}>
            <boxGeometry args={[width * 0.22, height * 0.68, 0.05]} />
          </mesh>
        </group>
      )}
      <mesh position={[0, 0.59, depth / 2 + 0.22]} material={new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: selected ? 0.5 : 0.19, roughness: 0.35 })}>
        <boxGeometry args={[0.48, 0.035, 0.035]} />
      </mesh>
      <Html position={[0, 0.55 + height + (kind === "math" || kind === "ai" ? 1.55 : 0.7), 0]} center distanceFactor={17} style={{ pointerEvents: "auto" }}>
        <button
          type="button"
          className={`campus-label ${selected ? "campus-label-selected" : ""}`}
          onClick={(event) => { event.stopPropagation(); onSelect(department.id); }}
          onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
          onPointerLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        >
          <span className="campus-label-marker" />
          <span>{department.name}</span>
          <small>{department.shortLabel}</small>
        </button>
      </Html>
    </group>
  );
}

function CampusContents({ departments, selectedId, onSelect }) {
  return (
    <>
      <fog attach="fog" args={["#080d17", 42, 92]} />
      <ambientLight intensity={0.92} color="#9ab2c6" />
      <hemisphereLight intensity={0.62} color="#b4d7ed" groundColor="#10151d" />
      <directionalLight position={[-7, 13, 8]} intensity={2.8} color="#dcecff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} />
      <pointLight position={[1, 7, -7]} intensity={42} distance={30} color="#2a83aa" />
      <pointLight position={[-8, 3, 5]} intensity={9} distance={16} color="#bb8e58" />
      <Stars radius={72} depth={42} count={420} factor={1.05} saturation={0.12} fade speed={0.04} />
      <StarDust />
      <CampusGround />
      {departments.map((department) => (
        <DepartmentBuilding
          key={department.id}
          department={department}
          selected={department.id === selectedId}
          onSelect={onSelect}
        />
      ))}
      <CameraDrift />
    </>
  );
}

export default function CampusScene({ departments, selectedId, onSelect }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 10.2, 22], fov: 34, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.18;
      }}
    >
      <CampusContents departments={departments} selectedId={selectedId} onSelect={onSelect} />
    </Canvas>
  );
}
