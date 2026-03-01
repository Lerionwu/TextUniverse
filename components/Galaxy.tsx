import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleData, GalaxyProps } from '../types';

const Galaxy: React.FC<GalaxyProps> = ({ text, config }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Reset refs when count changes
  useEffect(() => {
    meshRefs.current = meshRefs.current.slice(0, config.particleCount);
  }, [config.particleCount]);

  // Generate particles based on COUNT, sampling from TEXT
  const particles = useMemo<ParticleData[]>(() => {
    const pool: ParticleData[] = [];
    
    // Pre-process text into different granularities
    const rawWords = text.split(/\s+/).filter(w => w.length > 0);
    // Safety fallback
    const words = rawWords.length > 0 ? rawWords : ["VOID", "DATA", "NULL"];
    const chars = text.replace(/\s+/g, '').split('');
    const safeChars = chars.length > 0 ? chars : ['0', '1'];

    for (let i = 0; i < config.particleCount; i++) {
      let content = "";
      const typeChance = Math.random();

      // Distribution: 
      // 50% Phrases (2-4 words)
      // 30% Single Words
      // 20% Single Characters (Star dust)
      
      if (typeChance > 0.5) {
        // Create a short phrase
        const startIdx = Math.floor(Math.random() * words.length);
        const phraseLen = Math.floor(Math.random() * 3) + 2; // 2 to 4 words
        // Wrap around logic using modulo
        const phraseParts = [];
        for(let k=0; k<phraseLen; k++) {
          phraseParts.push(words[(startIdx + k) % words.length]);
        }
        content = phraseParts.join(' ');
      } else if (typeChance > 0.2) {
        // Single word
        content = words[Math.floor(Math.random() * words.length)];
      } else {
        // Single character
        content = safeChars[Math.floor(Math.random() * safeChars.length)];
      }

      // 2. Initial random position (Sphere distribution)
      const r = 40 * Math.cbrt(Math.random()); // Spread out more
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Randomize curvature
      // Large radius = slight curve. Small radius = tight ring.
      // We want organic, slight bends. 
      // Negative radius curves upwards, positive downwards.
      const isCurved = Math.random() > 0.3; // Some straight, most curved
      const baseCurve = 10 + Math.random() * 20; // 10 to 30 radius
      const dir = Math.random() > 0.5 ? 1 : -1;
      const curveRadius = isCurved ? baseCurve * dir : 0;

      pool.push({
        id: `p-${i}-${Math.random()}`,
        char: content,
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(0, 0, 0),
        life: Math.random() * 100,
        maxLife: 100,
        scale: 0.5 + Math.random() * 1.5,
        curveRadius: curveRadius
      });
    }
    return pool;
  }, [text, config.particleCount]);

  // Physics & Animation Loop (The Nebula Flow Logic)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const dt = 0.01 * config.flowSpeed;
    const freq = 0.08 * config.chaos; 

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh || !particles[i]) return;
      
      const p = particles[i];
      const pos = p.position;

      // Flow Field (Curl Noise approximation)
      const vx = Math.sin(pos.y * freq + time * 0.15) + Math.cos(pos.z * freq * 0.5);
      const vy = Math.sin(pos.z * freq + time * 0.15) - Math.cos(pos.x * freq * 0.5);
      const vz = Math.sin(pos.x * freq + time * 0.15) + Math.cos(pos.y * freq * 0.5);

      pos.x += vx * dt;
      pos.y += vy * dt;
      pos.z += vz * dt;

      // Boundary / Respawn
      const distSq = pos.lengthSq();
      const maxDistSq = 3600; // Radius 60

      if (distSq > maxDistSq) {
        // Respawn on the opposite side or random center
        pos.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
      }

      mesh.position.copy(pos);
      
      // Orientation
      // For sentences, we want them to generally face the camera so they are readable,
      // but also follow the flow a bit to look dynamic.
      // We look at the camera, then tilt slightly based on velocity.
      mesh.lookAt(state.camera.position);
      
      // Tilt based on movement
      mesh.rotation.z += vx * 0.1;
      mesh.rotation.x += vy * 0.1;

      // Scale pulse
      // Longer text (phrases) should perhaps be slightly smaller to fit, 
      // single chars can be bigger. 
      const isSingleChar = p.char.length === 1;
      const lengthScale = isSingleChar ? 1.2 : 0.8;
      
      const pulse = 0.8 + 0.3 * Math.sin(time * 1.5 + Number(p.id.split('-')[1])); 
      const finalScale = config.fontSize * p.scale * lengthScale * pulse;
      
      mesh.scale.setScalar(finalScale);
    });

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <Text
          key={particle.id}
          ref={(el) => {
             // @ts-ignore
             if (el) meshRefs.current[i] = el;
          }}
          position={[particle.position.x, particle.position.y, particle.position.z]}
          fontSize={1} 
          color="white"
          anchorX="center"
          anchorY="middle"
          
          // --- Key changes for curved sentences ---
          // curveRadius bends the text line.
          // @ts-ignore
          curveRadius={particle.curveRadius}
          
          material-side={THREE.DoubleSide}
          material-toneMapped={false}
          // Optimization: low quality SDF is usually fine for moving particles, 
          // but 'medium' keeps it readable.
          characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,?! "
        >
          {particle.char}
          <meshBasicMaterial 
            attach="material" 
            color="#ffffff" 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
            depthWrite={false} 
            blending={THREE.AdditiveBlending}
          />
        </Text>
      ))}
    </group>
  );
};

export default Galaxy;