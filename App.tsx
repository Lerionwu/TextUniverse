import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';

import Galaxy from './components/Galaxy';
import StarField from './components/StarField';
import InputOverlay from './components/InputOverlay';
import Controls from './components/Controls';
import { CAMERA_SETTINGS, COLORS } from './constants';
import { GalaxyConfig } from './types';

const App: React.FC = () => {
  const [text, setText] = useState<string>("WELCOME TO THE VOID");
  const [isInitial, setIsInitial] = useState(true);

  // Default Configuration
  const [config, setConfig] = useState<GalaxyConfig>({
    particleCount: 600,
    fontSize: 1.2,
    flowSpeed: 1.0,
    chaos: 0.5,
  });

  const handleTextSubmit = (newText: string) => {
    setText(newText);
    setIsInitial(false);
  };

  const handleConfigChange = (key: keyof GalaxyConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full h-full bg-black relative">
      
      <InputOverlay onSubmit={handleTextSubmit} isInitial={isInitial} />
      
      {/* Controls appear after initialization */}
      <Controls 
        config={config} 
        onChange={handleConfigChange} 
        visible={!isInitial} 
      />

      <Canvas
        camera={{ 
          position: CAMERA_SETTINGS.position, 
          fov: CAMERA_SETTINGS.fov,
          near: CAMERA_SETTINGS.near,
          far: CAMERA_SETTINGS.far
        }}
        gl={{ 
          antialias: false,
          toneMapping: THREE.ReinhardToneMapping,
          toneMappingExposure: 1.5,
          alpha: false
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={[COLORS.background]} />
        
        {/* Adjusted lights for volume */}
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={1} color={COLORS.accent} distance={50} />

        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
             <Galaxy text={text} config={config} />
          </group>
          
          <StarField />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          maxDistance={80}
          minDistance={1}
          autoRotate={true}
          autoRotateSpeed={0.3}
          enableDamping={true}
          dampingFactor={0.05}
        />

        <EffectComposer enableNormalPass={false}>
          {/* Stronger bloom for the additive blending nebula effect */}
          <Bloom 
            luminanceThreshold={0.1} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.5}
          />
          <Noise opacity={0.15} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

      </Canvas>
    </div>
  );
};

export default App;
