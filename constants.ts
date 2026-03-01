export const COLORS = {
  background: '#000000',
  text: '#ffffff',
  accent: '#a0a0ff', // Subtle blueish tint for depth
};

export const CAMERA_SETTINGS = {
  fov: 45,
  // Move camera back a bit to see the larger nebula structure
  position: [0, 20, 50] as [number, number, number],
  near: 0.1,
  far: 1000,
};

export const GALAXY_CONFIG = {
  spiralTightness: 0.15, 
  spiralRadiusFactor: 0.8, 
  verticalSpread: 3.5, 
  particleScale: 1.2, // Slightly larger text for better legibility in the cloud
  animSpeed: 0.05, 
};