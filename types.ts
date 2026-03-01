import { Vector3 } from 'three';

export interface ParticleData {
  id: string;
  char: string;
  // Current position for physics calculation
  position: Vector3;
  // Base velocity vector
  velocity: Vector3;
  // Individual lifespan/offset for organic recycling
  life: number;
  maxLife: number;
  scale: number;
  // Determines how much the text line bends
  curveRadius: number;
}

export interface GalaxyConfig {
  particleCount: number;
  fontSize: number;
  flowSpeed: number;
  chaos: number; // Randomness/Noise frequency
}

export interface GalaxyProps {
  text: string;
  config: GalaxyConfig;
}