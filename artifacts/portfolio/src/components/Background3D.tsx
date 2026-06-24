import { useRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SafeCanvas } from "./SafeCanvas";
import { HeroScene3D } from "../pages/Hero";
import { AboutScene } from "../pages/About";
import { SkillsScene } from "../pages/Skills";
import { ProjectsScene } from "../pages/Projects";
import { ExperienceScene } from "../pages/Experience";
import { EducationScene } from "../pages/Education";
import { ContactScene } from "../pages/Contact";

interface Background3DProps {
  location: string;
  isIntroPlaying: boolean;
  onIntroComplete: () => void;
}

interface CameraControllerProps {
  location: string;
  isIntroPlaying: boolean;
  onIntroComplete: () => void;
}

interface BackgroundSceneProps {
  location: string;
  isIntroPlaying: boolean;
  onIntroComplete: () => void;
}

// Camera controller — smoothly flies the camera to the right position for each page
function CameraController({ location, isIntroPlaying, onIntroComplete }: CameraControllerProps) {
  const { camera } = useThree();
  const introTime = useRef(0);

  const targets = useMemo(() => {
    const map: Record<string, { pos: [number, number, number]; look: [number, number, number]; fov: number }> = {
      "/":           { pos: [0,    0,    22],  look: [0,   0, 0],  fov: 42 },
      "/about":      { pos: [4,    1.5,  20],  look: [1.5, 0, 0],  fov: 46 },
      "/skills":     { pos: [-3,  -2,   24],   look: [0,   0, 0],  fov: 42 },
      "/projects":   { pos: [0,    4,   22],   look: [0,   0, -2], fov: 46 },
      "/experience": { pos: [4.5, -1.5, 20],  look: [1,   0, 0],  fov: 42 },
      "/education":  { pos: [-4,   4,   20],   look: [0,   0, 0],  fov: 46 },
      "/contact":    { pos: [0,    0,   19],   look: [0,   0, 0],  fov: 46 },
    };
    return map;
  }, []);

  const active = targets[location] || targets["/"];

  useFrame((state, delta) => {
    if (isIntroPlaying) {
      introTime.current += delta;
      const duration = 1.0;
      const progress = Math.min(1, introTime.current / duration);

      // cubic easeOutCubic curve for camera acceleration/deceleration
      const t = 1 - Math.pow(1 - progress, 3);

      // Camera flies forward from [0, 5, 80] to the page target
      state.camera.position.x = THREE.MathUtils.lerp(0, active.pos[0], t);
      state.camera.position.y = THREE.MathUtils.lerp(5, active.pos[1], t);
      state.camera.position.z = THREE.MathUtils.lerp(80, active.pos[2], t);

      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = THREE.MathUtils.lerp(60, active.fov, t);
        state.camera.updateProjectionMatrix();
      }

      const currentLook = state.camera.userData.lookTarget || new THREE.Vector3(0, 0, 0);
      currentLook.x = THREE.MathUtils.lerp(0, active.look[0], t);
      currentLook.y = THREE.MathUtils.lerp(0, active.look[1], t);
      currentLook.z = THREE.MathUtils.lerp(0, active.look[2], t);
      state.camera.lookAt(currentLook);
      state.camera.userData.lookTarget = currentLook;

      if (progress >= 1) {
        onIntroComplete();
      }
      return;
    }

    const step = 0.042;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, active.pos[0], step);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, active.pos[1], step);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, active.pos[2], step);

    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, active.fov, step);
      state.camera.updateProjectionMatrix();
    }

    const currentLook = state.camera.userData.lookTarget || new THREE.Vector3(0, 0, 0);
    currentLook.x = THREE.MathUtils.lerp(currentLook.x, active.look[0], step);
    currentLook.y = THREE.MathUtils.lerp(currentLook.y, active.look[1], step);
    currentLook.z = THREE.MathUtils.lerp(currentLook.z, active.look[2], step);
    state.camera.lookAt(currentLook);
    state.camera.userData.lookTarget = currentLook;
  });

  return null;
}

// Wrapper group that fades its opacity via a ref — no React re-render needed
interface SceneSlotProps {
  active: boolean;
  children: React.ReactNode;
}

function SceneSlot({ active, children }: SceneSlotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(active ? 1 : 0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = active ? 1 : 0;

    // Return early if the opacity is already stable and matches the target
    if (opacityRef.current === target) {
      const isVisible = target > 0.005;
      if (groupRef.current.visible !== isVisible) {
        groupRef.current.visible = isVisible;
      }
      return;
    }

    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, delta * 4.5);

    // Snap to target if very close to avoid continuous small updates
    if (Math.abs(opacityRef.current - target) < 0.001) {
      opacityRef.current = target;
    }

    // Toggle visibility completely when fully invisible — stops GPU work
    const isVisible = opacityRef.current > 0.005;
    if (groupRef.current.visible !== isVisible) {
      groupRef.current.visible = isVisible;
    }

    // Apply opacity to all materials in the group
    groupRef.current.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        const mat = obj.material as THREE.Material;
        if (mat) {
          mat.transparent = true;
          mat.opacity = opacityRef.current;
        }
      }
    });
  });

  return <group ref={groupRef}>{children}</group>;
}

// Cinematic Intro Core — Rotating pulsing crystal core with explosion at 2.8s
function IntroCore({ elapsed }: { elapsed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const explosionRef = useRef<THREE.Points>(null);

  const explodeStart = 0.75;
  const isExploding = elapsed > explodeStart;
  const explodeProgress = isExploding ? Math.min(1, (elapsed - explodeStart) / 0.7) : 0;

  // Create 150 explosion particles
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(150 * 3);
    const vels = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 7 + Math.random() * 11; // speed of expansion
      
      vels[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vels[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vels[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return [pos, vels];
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.45;
      meshRef.current.rotation.y += delta * 0.65;
      
      if (isExploding) {
        // Grow exponentially and fade out emissive color
        const factor = 1.0 + Math.pow(explodeProgress, 2) * 20;
        meshRef.current.scale.setScalar(factor);
        (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 1 - explodeProgress;
        (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5 + explodeProgress * 15;
      } else {
        const scale = 1.0 + Math.sin(elapsed * 6.5) * 0.08;
        meshRef.current.scale.setScalar(scale);
      }
    }

    if (explosionRef.current && isExploding) {
      const posArray = explosionRef.current.geometry.attributes.position.array as Float32Array;
      const timeSinceExplode = elapsed - explodeStart;
      for (let i = 0; i < 150; i++) {
        posArray[i * 3] = velocities[i * 3] * timeSinceExplode;
        posArray[i * 3 + 1] = velocities[i * 3 + 1] * timeSinceExplode;
        posArray[i * 3 + 2] = velocities[i * 3 + 2] * timeSinceExplode;
      }
      explosionRef.current.geometry.attributes.position.needsUpdate = true;
      (explosionRef.current.material as THREE.PointsMaterial).opacity = 1 - explodeProgress;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#0071E3"
          emissive="#0071E3"
          emissiveIntensity={1.5}
          wireframe
          transparent
          opacity={1}
        />
      </mesh>
      
      {isExploding && (
        <points ref={explosionRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.18}
            color="#4499ff"
            transparent
            opacity={1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
}

// Cinematic Intro Scene — Particle tunnel wormhole flight
function IntroScene3D({ isIntroPlaying }: { isIntroPlaying: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 500;
  const elapsedRef = useRef(0);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 2.5 + Math.random() * 9.5;
      const z = (Math.random() - 0.5) * 110;

      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.sin(theta) * r;
      pos[i * 3 + 2] = z;

      const color = new THREE.Color(
        i % 3 === 0 ? "#0071E3" : i % 3 === 1 ? "#4499ff" : "#ffffff"
      );
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, []);

  useFrame((state, delta) => {
    if (isIntroPlaying) {
      elapsedRef.current += delta;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.15;
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        // Move particles forward past the camera
        posArray[i * 3 + 2] += delta * 25.0;
        if (posArray[i * 3 + 2] > 55.0) {
          posArray[i * 3 + 2] = -55.0;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={4.5} color="#0071E3" />
      <IntroCore elapsed={elapsedRef.current} />
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function BackgroundScene({ location, isIntroPlaying, onIntroComplete }: BackgroundSceneProps) {
  return (
    <>
      <CameraController
        location={location}
        isIntroPlaying={isIntroPlaying}
        onIntroComplete={onIntroComplete}
      />

      {/* Cinematic intro slot */}
      <SceneSlot active={isIntroPlaying}>
        <IntroScene3D isIntroPlaying={isIntroPlaying} />
      </SceneSlot>

      {/* Page slots: only animate in once the intro is complete */}
      <SceneSlot active={!isIntroPlaying && location === "/"}>
        <HeroScene3D />
      </SceneSlot>
      <SceneSlot active={!isIntroPlaying && location === "/about"}>
        <AboutScene />
      </SceneSlot>
      <SceneSlot active={!isIntroPlaying && location === "/skills"}>
        <SkillsScene />
      </SceneSlot>
      <SceneSlot active={!isIntroPlaying && location === "/projects"}>
        <ProjectsScene />
      </SceneSlot>
      <SceneSlot active={!isIntroPlaying && location === "/experience"}>
        <ExperienceScene />
      </SceneSlot>
      <SceneSlot active={!isIntroPlaying && location === "/education"}>
        <EducationScene />
      </SceneSlot>
      <SceneSlot active={!isIntroPlaying && location === "/contact"}>
        <ContactScene />
      </SceneSlot>
    </>
  );
}

export function Background3D({ location, isIntroPlaying, onIntroComplete }: Background3DProps) {
  return (
    // will-change + translateZ promotes this to its own GPU compositing layer
    // so the browser never re-rasterizes it during scroll
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    >
      <SafeCanvas camera={{ position: [0, 0, 80], fov: 60 }}>
        <BackgroundScene
          location={location}
          isIntroPlaying={isIntroPlaying}
          onIntroComplete={onIntroComplete}
        />
      </SafeCanvas>
    </div>
  );
}
