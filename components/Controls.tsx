import React from 'react';
import { GalaxyConfig } from '../types';

interface ControlsProps {
  config: GalaxyConfig;
  onChange: (key: keyof GalaxyConfig, value: number) => void;
  visible: boolean;
}

const Controls: React.FC<ControlsProps> = ({ config, onChange, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-4 bg-black/80 backdrop-blur-md p-6 border border-white/10 w-64 transition-opacity duration-500">
      <h3 className="text-white text-xs font-mono tracking-widest uppercase mb-2 border-b border-white/20 pb-2">
        Sim Parameters
      </h3>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>DENSITY</span>
          <span>{config.particleCount}</span>
        </div>
        <input
          type="range"
          min="100"
          max="1500"
          step="50"
          value={config.particleCount}
          onChange={(e) => onChange('particleCount', parseInt(e.target.value))}
          className="accent-white h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>SCALE</span>
          <span>{config.fontSize.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="4.0"
          step="0.1"
          value={config.fontSize}
          onChange={(e) => onChange('fontSize', parseFloat(e.target.value))}
          className="accent-white h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>FLOW RATE</span>
          <span>{config.flowSpeed.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={config.flowSpeed}
          onChange={(e) => onChange('flowSpeed', parseFloat(e.target.value))}
          className="accent-white h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>ENTROPY</span>
          <span>{config.chaos.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.5"
          step="0.05"
          value={config.chaos}
          onChange={(e) => onChange('chaos', parseFloat(e.target.value))}
          className="accent-white h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Controls;
