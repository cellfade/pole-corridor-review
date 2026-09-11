import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Html,
  Line,
  OrbitControls,
  PerspectiveCamera,
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

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.13, 0.2, 2.5, 10]} />
        <meshStandardMaterial color="#6b4e35" roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 3.1, 0]}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial color="#46684c" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0.45, 2.7, 0.15]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color="#537753" roughness={0.98} />
      </mesh>
    </group>
  );
}

function House({ position, tone = "#d7d3ca" }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
        <boxGeometry args={[4.8, 2.8, 4.2]} />
        <meshStandardMaterial color={tone} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 3.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3.6, 1.8, 4]} />
        <meshStandardMaterial color="#666a6b" roughness={0.9} />
      </mesh>
      <mesh position={[-1.25, 1.45, -2.12]}>
        <planeGeometry args={[0.9, 1.1]} />
        <meshStandardMaterial color="#9fc4dd" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[1.15, 1.1, -2.13]}>
        <planeGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#624b39" roughness={0.8} />
      </mesh>
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
      <hemisphereLight intensity={1.25} color="#e9f6ff" groundColor="#53624b" />
      <directionalLight castShadow position={[10, 18, 8]} intensity={2.1} color="#fff2da" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-far={70} shadow-camera-left={-26} shadow-camera-right={26} shadow-camera-top={30} shadow-camera-bottom={-30} />

      <PerspectiveCamera makeDefault fov={46} near={0.1} far={250} position={[10.5, 9.3, 20.8]} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.075}
        minDistance={7}
        maxDistance={28}
        minPolarAngle={0.52}
        maxPolarAngle={1.48}
        screenSpacePanning={false}
        target={[selectedPosition[0], 6.7, selectedPosition[1]]}
      />
      <CameraDirector activeIndex={activeIndex} resetToken={resetToken} controlsRef={controlsRef} />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[120, 150]} />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>

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
