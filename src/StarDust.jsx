import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 150;
const MIN_X = -18;
const MAX_X = 18;
const MIN_Y = -1;
const MAX_Y = 13;
const COLORS = ["#ffffff", "#d9efff", "#9be9f5"];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

const vertexShader = `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aTwinkle;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vOpacity;
  uniform float uTime;

  void main() {
    vColor = color;
    vOpacity = aOpacity * (0.76 + 0.24 * sin(uTime * aTwinkle + aPhase));
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / max(-viewPosition.z, 1.0));
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
    float core = 1.0 - smoothstep(0.16, 0.5, distanceFromCenter);
    float halo = exp(-distanceFromCenter * distanceFromCenter * 20.0) * 0.2;
    gl_FragColor = vec4(vColor, (core + halo) * vOpacity);
  }
`;

const noRaycast = () => {};

export default function StarDust() {
  const pointsRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const particles = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const opacities = new Float32Array(PARTICLE_COUNT);
    const twinkles = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const drifts = new Float32Array(PARTICLE_COUNT);

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      positions[index * 3] = randomBetween(MIN_X, MAX_X);
      positions[index * 3 + 1] = randomBetween(MIN_Y, MAX_Y);
      positions[index * 3 + 2] = -8.5;
      new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)]).toArray(colors, index * 3);
      sizes[index] = randomBetween(0.12, 0.26);
      opacities[index] = randomBetween(0.48, 0.92);
      twinkles[index] = randomBetween(0.45, 1.1);
      phases[index] = randomBetween(0, Math.PI * 2);
      speeds[index] = randomBetween(0.12, 0.34);
      drifts[index] = randomBetween(-0.1, 0.1);
    }

    return { positions, colors, sizes, opacities, twinkles, phases, speeds, drifts };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (event) => setReducedMotion(event.matches);
    setReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useFrame(({ clock }, delta) => {
    const points = pointsRef.current;
    if (!points || reducedMotion || document.hidden) return;

    const positions = points.geometry.attributes.position.array;
    const time = clock.elapsedTime;
    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const offset = index * 3;
      positions[offset + 1] -= particles.speeds[index] * delta;
      positions[offset] += (particles.drifts[index] + Math.sin(time * 0.3 + particles.phases[index]) * 0.035) * delta;

      if (positions[offset + 1] < MIN_Y) {
        positions[offset] = randomBetween(MIN_X, MAX_X);
        positions[offset + 1] = MAX_Y;
      } else if (positions[offset] < MIN_X) {
        positions[offset] = MAX_X;
      } else if (positions[offset] > MAX_X) {
        positions[offset] = MIN_X;
      }
    }
    points.geometry.attributes.position.needsUpdate = true;
    points.material.uniforms.uTime.value = time;
  });

  return (
    <points ref={pointsRef} frustumCulled={false} raycast={noRaycast}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[particles.sizes, 1]} />
        <bufferAttribute attach="attributes-aOpacity" args={[particles.opacities, 1]} />
        <bufferAttribute attach="attributes-aTwinkle" args={[particles.twinkles, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[particles.phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        vertexColors
        transparent
        depthTest
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
      />
    </points>
  );
}
