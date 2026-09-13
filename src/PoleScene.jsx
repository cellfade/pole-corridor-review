import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Html,
  Line,
  OrbitControls,
  PerspectiveCamera,
  Sky,
} from "@react-three/drei";
import * as THREE from "three";

const POLE_POSITIONS = [
  [-1.2, -32],
  [-0.7, -20],
  [-0.25, -8],
  [0, 4],
  [0.45, 16],
  [1.1, 28],
];

const HOUSE_SITES = [
  { position: [8.8, 0, -31], rotation: 0.08, tone: "#d8d2c8", roof: "#5d6265" },
  { position: [9.8, 0, -18], rotation: -0.05, tone: "#c7d0cf", roof: "#596067" },
  { position: [8.2, 0, -4], rotation: 0.04, tone: "#dfd8ca", roof: "#655f59" },
  { position: [10.4, 0, 11], rotation: -0.08, tone: "#c9d3d8", roof: "#59636b" },
  { position: [8.7, 0, 25], rotation: 0.06, tone: "#d5cabd", roof: "#665e56" },
  { position: [-17.3, 0, -27], rotation: Math.PI + 0.08, tone: "#c9d1c5", roof: "#56605a" },
  { position: [-16.5, 0, -10], rotation: Math.PI - 0.04, tone: "#d8d1c4", roof: "#635e58" },
  { position: [-18.1, 0, 8], rotation: Math.PI + 0.06, tone: "#c6d0d6", roof: "#565f66" },
  { position: [-16.8, 0, 25], rotation: Math.PI - 0.08, tone: "#dad5ca", roof: "#625d58" },
];

const TREE_SITES = [
  [-1.1, 0, -38, 1.05], [4.4, 0, -34, 1.2], [13.5, 0, -27, 0.92],
  [-11.4, 0, -34, 1.15], [-13.7, 0, -21, 0.88], [4.2, 0, -22, 1.05],
  [13.1, 0, -15, 1.18], [-12.4, 0, -4, 1], [4.7, 0, -7, 0.88],
  [13.6, 0, 1, 1.08], [-12.2, 0, 10, 1.15], [4.4, 0, 9, 0.96],
  [14.2, 0, 18, 1.12], [-13.3, 0, 23, 0.94], [4.8, 0, 22, 1.08],
  [-11.8, 0, 36, 1.2], [4.1, 0, 36, 0.9], [14.4, 0, 34, 1.05],
];

const MOUNTAINS = [
  [-58, 4, -74, 34, 28, "#6f7f7a"],
  [-25, 2, -88, 42, 35, "#7a8982"],
  [12, 3, -92, 38, 31, "#687a76"],
  [49, 4, -78, 44, 36, "#72827b"],
  [72, 5, -48, 31, 26, "#819087"],
  [-68, 3, 67, 36, 27, "#77877f"],
  [-31, 2, 84, 43, 33, "#697b76"],
  [16, 3, 91, 40, 32, "#75867e"],
  [57, 4, 73, 35, 28, "#829087"],
];

function Wire({ start, end, height, color = "#2d3138", sag = 0.7, radius = 0.028 }) {
  const curve = useMemo(() => {
    const startVector = new THREE.Vector3(start[0], height, start[1]);
    const endVector = new THREE.Vector3(end[0], height, end[1]);
    const midpoint = startVector.clone().lerp(endVector, 0.5);
    midpoint.y -= sag;
    return new THREE.CatmullRomCurve3([startVector, midpoint, endVector]);
  }, [start, end, height, sag]);

  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 40, radius, 7, false]} />
      <meshStandardMaterial color={color} roughness={0.72} metalness={0.12} />
    </mesh>
  );
}

function Insulator({ position }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.085, 0.1, 0.34, 12]} />
        <meshStandardMaterial color="#5c6874" roughness={0.22} metalness={0.72} />
      </mesh>
      {[-0.07, 0, 0.07].map((y) => (
        <mesh key={y} castShadow position={[0, y + 0.15, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.035, 12]} />
          <meshStandardMaterial color="#53606c" roughness={0.3} metalness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function Transformer({ side = 1 }) {
  return (
    <group position={[0.42 * side, 8.3, 0]} rotation={[0, 0, -0.04 * side]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.46, 1.8, 24]} />
        <meshStandardMaterial color="#9ba3a7" metalness={0.72} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0, 0.97, 0]}>
        <cylinderGeometry args={[0.29, 0.38, 0.14, 20]} />
        <meshStandardMaterial color="#737b7f" metalness={0.78} roughness={0.28} />
      </mesh>
      <mesh castShadow position={[0, -0.98, 0]}>
        <cylinderGeometry args={[0.34, 0.4, 0.12, 20]} />
        <meshStandardMaterial color="#6b7376" metalness={0.75} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Pole({ position, selected, index }) {
  const [x, z] = position;
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow receiveShadow position={[0, 6, 0]}>
        <cylinderGeometry args={[0.22, 0.34, 12, 18]} />
        <meshStandardMaterial color={selected ? "#704c32" : "#65503f"} roughness={0.96} />
      </mesh>
      <mesh castShadow position={[0, 10.5, 0]}>
        <boxGeometry args={[4.1, 0.22, 0.28]} />
        <meshStandardMaterial color="#5a432f" roughness={0.92} />
      </mesh>
      <mesh castShadow position={[0, 9.6, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.75, 0.11, 0.14]} />
        <meshStandardMaterial color="#6b5138" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 9.6, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[1.75, 0.11, 0.14]} />
        <meshStandardMaterial color="#6b5138" roughness={0.9} />
      </mesh>
      <Insulator position={[-1.45, 10.78, 0]} />
      <Insulator position={[0, 10.78, 0]} />
      <Insulator position={[1.45, 10.78, 0]} />
      {(selected || index === 2 || index === 4) && <Transformer side={index % 2 ? 1 : -1} />}
      <mesh castShadow position={[0.39, 6.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 1.25, 18]} />
        <meshStandardMaterial color="#202833" roughness={0.55} metalness={0.25} />
      </mesh>
      <mesh castShadow position={[0.4, 6.55, 0]}>
        <torusGeometry args={[0.36, 0.035, 8, 28]} />
        <meshStandardMaterial color="#242a31" roughness={0.62} metalness={0.2} />
      </mesh>
      <Html position={[0.55, 11.55, 0]} center distanceFactor={13} occlude>
        <span className={`world-pole-label ${selected ? "selected" : ""}`}>{101 + index}</span>
      </Html>
    </group>
  );
}

function Tree({ position, scale = 1, hue = 0 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.13, 0.22, 2.5, 8]} />
        <meshStandardMaterial color="#6b4e35" roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 3.1, 0]}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial color={hue % 2 ? "#4f7450" : "#46684c"} roughness={0.95} flatShading />
      </mesh>
      <mesh castShadow position={[0.45, 2.7, 0.15]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color={hue % 3 ? "#5e8056" : "#567a52"} roughness={0.98} flatShading />
      </mesh>
    </group>
  );
}

function House({ position, rotation = 0, tone = "#d7d3ca", roof = "#666a6b" }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh receiveShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[6.6, 0.24, 6.8]} />
        <meshStandardMaterial color="#aeb4a7" roughness={1} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
        <boxGeometry args={[4.8, 2.8, 4.2]} />
        <meshStandardMaterial color={tone} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 3.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3.6, 1.8, 4]} />
        <meshStandardMaterial color={roof} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-1.25, 1.45, -2.12]}>
        <planeGeometry args={[0.9, 1.1]} />
        <meshStandardMaterial color="#a9c9d9" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[1.15, 1.1, -2.13]}>
        <planeGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#624b39" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[2.7, 1.05, 0.65]}>
        <boxGeometry args={[2.2, 2.1, 2.9]} />
        <meshStandardMaterial color={tone} roughness={0.92} />
      </mesh>
      <mesh position={[2.71, 1.05, -0.82]}>
        <planeGeometry args={[1.65, 1.45]} />
        <meshStandardMaterial color="#858d91" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Terrain() {
  const geometry = useMemo(() => {
    const terrain = new THREE.PlaneGeometry(220, 190, 28, 24);
    const positions = terrain.attributes.position;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const z = positions.getY(index);
      const distanceFromCorridor = Math.max(0, Math.abs(x + 3) - 20);
      const edgeLift = Math.pow(distanceFromCorridor / 78, 1.45) * 7.5;
      const rolling = distanceFromCorridor > 0
        ? (Math.sin(x * 0.11) + Math.cos(z * 0.085) + Math.sin((x + z) * 0.055)) * 0.7
        : 0;
      positions.setZ(index, Math.max(0, edgeLift + rolling));
    }

    terrain.computeVertexNormals();
    return terrain;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
      <meshStandardMaterial color="#77906d" roughness={1} flatShading />
    </mesh>
  );
}

function RoadCorridor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.45, 0.015, 0]} receiveShadow>
        <planeGeometry args={[7.8, 146]} />
        <meshStandardMaterial color="#50575a" roughness={0.96} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.86, 0.055, 0]} receiveShadow>
        <planeGeometry args={[1.25, 146]} />
        <meshStandardMaterial color="#b8b8ae" roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10.03, 0.055, 0]} receiveShadow>
        <planeGeometry args={[1.25, 146]} />
        <meshStandardMaterial color="#b8b8ae" roughness={0.98} />
      </mesh>
      <mesh position={[-1.55, 0.11, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.17, 0.22, 146]} />
        <meshStandardMaterial color="#d5d2c7" roughness={0.95} />
      </mesh>
      <mesh position={[-9.35, 0.11, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.17, 0.22, 146]} />
        <meshStandardMaterial color="#d5d2c7" roughness={0.95} />
      </mesh>
      {Array.from({ length: 18 }, (_, index) => (
        <mesh key={index} position={[-5.45, 0.045, -68 + index * 8]} receiveShadow>
          <boxGeometry args={[0.12, 0.025, 3.8]} />
          <meshStandardMaterial color="#e9c968" roughness={0.8} />
        </mesh>
      ))}
      {[-34, -18, -2, 14, 30].map((z, index) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[index % 2 ? -13 : 3.1, 0.035, z]} receiveShadow>
          <planeGeometry args={[6.9, 3.2]} />
          <meshStandardMaterial color="#8f9690" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function ParkedCar({ position, color = "#778792", rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[1.55, 0.55, 3.3]} />
        <meshStandardMaterial color={color} roughness={0.58} metalness={0.18} />
      </mesh>
      <mesh castShadow position={[0, 0.86, -0.18]}>
        <boxGeometry args={[1.28, 0.52, 1.7]} />
        <meshStandardMaterial color="#a9c0c9" roughness={0.28} metalness={0.12} />
      </mesh>
      {[[-0.82, 0.2, -1.05], [0.82, 0.2, -1.05], [-0.82, 0.2, 1.05], [0.82, 0.2, 1.05]].map((wheel) => (
        <mesh key={wheel.join("-")} position={wheel} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.2, 12]} />
          <meshStandardMaterial color="#24292c" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function MountainRange() {
  return MOUNTAINS.map(([x, y, z, radius, height, color], index) => (
    <mesh key={`${x}-${z}`} position={[x, y, z]} rotation={[0, index * 0.37, 0]} receiveShadow>
      <coneGeometry args={[radius, height, 7]} />
      <meshStandardMaterial color={color} roughness={1} flatShading />
    </mesh>
  ));
}

function LowPolyEnvironment() {
  return (
    <group>
      <Terrain />
      <RoadCorridor />
      {HOUSE_SITES.map((site) => <House key={site.position.join("-")} {...site} />)}
      {TREE_SITES.map(([x, y, z, scale], index) => (
        <Tree key={`${x}-${z}`} position={[x, y, z]} scale={scale} hue={index} />
      ))}
      <ParkedCar position={[-7.1, 0, -12]} color="#8a5550" />
      <ParkedCar position={[-3.85, 0, 17]} color="#718798" rotation={Math.PI} />
      <ParkedCar position={[-6.9, 0, 38]} color="#d0c8b8" />
      <MountainRange />
    </group>
  );
}

function CapturePoint({ position, active, onSelect }) {
  return (
    <group position={[-5.4, 0.055, position[1]]} rotation={[-Math.PI / 2, 0, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
      <mesh>
        <ringGeometry args={[0.38, 0.55, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={active ? 1 : 0.82} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.18, 0.31, 32]} />
        <meshBasicMaterial color={active ? "#ff9239" : "#7257d9"} transparent opacity={active ? 1 : 0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function RadialMenu({ position, actions, onAction, status, menuOpen, setMenuOpen }) {
  return (
    <Html position={position} center zIndexRange={[40, 10]}>
      <div className="radial-menu" aria-label="Attachment actions">
        {menuOpen && actions.map(({ id, label, Icon }, index) => {
          const angle = (-145 + index * 72) * (Math.PI / 180);
          const radius = 72;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const active = (id === "accept" && status === "reviewed") || (id === "flag" && status === "flagged");
          return (
            <button
              className={`radial-action ${id} ${active ? "active" : ""}`}
              key={id}
              onClick={(event) => { event.stopPropagation(); onAction(id); }}
              type="button"
              title={label}
              aria-label={label}
              style={{ "--menu-x": `${x}px`, "--menu-y": `${y}px`, "--delay": `${index * 32}ms` }}
            >
              <Icon size={19} strokeWidth={2} />
              <span>{label}</span>
            </button>
          );
        })}
        <button
          className="radial-center"
          type="button"
          aria-label={menuOpen ? "Close attachment actions" : "Open attachment actions"}
          aria-expanded={menuOpen}
          onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open); }}
        ><span /></button>
      </div>
    </Html>
  );
}

function SelectedAttachment({ activeIndex, menuOpen, setMenuOpen, actions, onAction, status }) {
  const [x, z] = POLE_POSITIONS[activeIndex];
  const position = [x + 0.4, 6.55, z];
  const accepted = status === "reviewed";
  const flagged = status === "flagged";

  return (
    <group>
      <Line points={[[x + 0.4, 0.4, z], [x + 0.4, 6.55, z]]} color="#7257d9" lineWidth={2} dashed dashSize={0.18} gapSize={0.12} />
      <Html position={[x + 1.15, 3.55, z]} center distanceFactor={9}>
        <span className="measurement-label">16' 8&quot;<small>AI · 92%</small></span>
      </Html>
      <mesh position={position} onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open); }}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color={accepted ? "#3fa66a" : flagged ? "#d24f55" : "#ff9239"} emissive={accepted ? "#1e6040" : flagged ? "#6e2028" : "#7a3210"} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.055, 12, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.026, 12, 32]} />
        <meshBasicMaterial color="#ff9239" />
      </mesh>
      <RadialMenu
        position={position}
        actions={actions}
        onAction={onAction}
        status={status}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </group>
  );
}

function CameraDirector({ activeIndex, resetToken, controlsRef }) {
  const { camera } = useThree();
  const transition = useRef(null);

  useEffect(() => {
    const [x, z] = POLE_POSITIONS[activeIndex];
    const target = new THREE.Vector3(x, 6.7, z);
    const offset = new THREE.Vector3(10.5, 2.6, 16.8);
    transition.current = {
      elapsed: 0,
      fromPosition: camera.position.clone(),
      toPosition: target.clone().add(offset),
      fromTarget: controlsRef.current?.target.clone() || target.clone(),
      toTarget: target,
      duration: 0.9,
    };
  }, [activeIndex, resetToken, camera, controlsRef]);

  useFrame((_, delta) => {
    const current = transition.current;
    if (!current || !controlsRef.current) return;
    current.elapsed = Math.min(current.elapsed + delta, current.duration);
    const raw = current.elapsed / current.duration;
    const eased = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
    camera.position.lerpVectors(current.fromPosition, current.toPosition, eased);
    controlsRef.current.target.lerpVectors(current.fromTarget, current.toTarget, eased);
    controlsRef.current.update();
    if (raw >= 1) transition.current = null;
  });

  return null;
}

function World({ activeIndex, setActiveIndex, menuOpen, setMenuOpen, onAction, actions, resetToken, status }) {
  const controlsRef = useRef();
  const selectedPosition = POLE_POSITIONS[activeIndex];

  return (
    <>
      <Sky distance={360} sunPosition={[48, 26, -72]} turbidity={4.2} rayleigh={1.35} mieCoefficient={0.004} mieDirectionalG={0.82} />
      <fog attach="fog" args={["#c7d8dc", 78, 205]} />
      <hemisphereLight intensity={1.35} color="#eaf7ff" groundColor="#5a654f" />
      <directionalLight castShadow position={[24, 32, 14]} intensity={2.25} color="#fff1d8" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-far={100} shadow-camera-left={-38} shadow-camera-right={38} shadow-camera-top={42} shadow-camera-bottom={-42} />

      <PerspectiveCamera makeDefault fov={46} near={0.1} far={250} position={[10.5, 9.3, 20.8]} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.075}
        minDistance={7}
        maxDistance={36}
        minPolarAngle={0.52}
        maxPolarAngle={1.48}
        screenSpacePanning={false}
        target={[selectedPosition[0], 6.7, selectedPosition[1]]}
      />
      <CameraDirector activeIndex={activeIndex} resetToken={resetToken} controlsRef={controlsRef} />

      <LowPolyEnvironment />

      {POLE_POSITIONS.map((position, index) => (
        <Pole key={index} position={position} index={index} selected={index === activeIndex} />
      ))}
      {POLE_POSITIONS.map((position, index) => (
        <CapturePoint key={`capture-${index}`} position={position} active={index === activeIndex} onSelect={() => setActiveIndex(index)} />
      ))}

      {POLE_POSITIONS.slice(0, -1).map((position, index) => {
        const end = POLE_POSITIONS[index + 1];
        return (
          <group key={index}>
            <Wire start={position} end={end} height={10.92} sag={0.68} />
            <Wire start={[position[0] - 1.45, position[1]]} end={[end[0] - 1.45, end[1]]} height={10.8} sag={0.78} radius={0.022} />
            <Wire start={[position[0] + 1.45, position[1]]} end={[end[0] + 1.45, end[1]]} height={10.8} sag={0.78} radius={0.022} />
            <Wire start={[position[0] + 0.42, position[1]]} end={[end[0] + 0.42, end[1]]} height={6.56} sag={0.48} color="#1f2730" radius={0.045} />
            <Wire start={[position[0] - 0.34, position[1]]} end={[end[0] - 0.34, end[1]]} height={7.25} sag={0.5} color="#29323b" radius={0.04} />
          </group>
        );
      })}

      <SelectedAttachment
        activeIndex={activeIndex}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        actions={actions}
        onAction={onAction}
        status={status}
      />

    </>
  );
}

export function PoleScene(props) {
  return (
    <Canvas
      className="pole-canvas"
      shadows
      dpr={[1, 1.7]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onPointerMissed={() => props.setMenuOpen(false)}
    >
      <World {...props} />
    </Canvas>
  );
}
