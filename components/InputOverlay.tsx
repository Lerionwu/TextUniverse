import React, { useState } from 'react';

interface InputOverlayProps {
  onSubmit: (text: string) => void;
  isInitial: boolean;
}

const InputOverlay: React.FC<InputOverlayProps> = ({ onSubmit, isInitial }) => {
  const [value, setValue] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = () => {
    if (value.trim().length > 0) {
      onSubmit(value);
      setValue("");
      setIsActive(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check for IME composition to support Chinese/Japanese input correctly
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSubmit();
    }
  };

  // Dynamic Styles based on state
  // If isInitial: Center screen, large.
  // If !isInitial: Bottom screen, smaller, semi-transparent.
  const containerPositionClasses = isInitial 
    ? "inset-0 items-center justify-center flex-col bg-black/40 backdrop-blur-sm" 
    : "bottom-8 left-0 right-0 items-end justify-center pb-4 pointer-events-none";

  const inputSizeClasses = isInitial
    ? "text-lg w-64 md:w-96 py-2"
    : "text-sm w-48 md:w-64 py-1 bg-black/50 backdrop-blur-md border-white/10 focus:border-white/50";

  return (
    <div className={`absolute z-10 flex transition-all duration-1000 ease-in-out ${containerPositionClasses}`}>
      
      {/* Title / Header - Only show in initial state */}
      <div className={`transition-all duration-1000 absolute top-1/4 left-0 right-0 text-center ${isInitial ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <h1 className="text-white text-xs tracking-[0.5em] uppercase font-light drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          System Core // Lexicon Galaxy
        </h1>
      </div>

      {/* Input Wrapper */}
      <div className={`
        pointer-events-auto relative group flex items-center transition-all duration-700
        ${!isInitial ? 'mb-0 opacity-60 hover:opacity-100' : 'mb-0'}
      `}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          placeholder={isInitial ? "Initialize Sequence..." : "Append Data..."}
          className={`
            bg-transparent 
            text-white text-center font-mono 
            border-b border-white/20 
            outline-none 
            transition-all duration-500
            placeholder:text-gray-500 placeholder:text-xs
            ${inputSizeClasses}
            ${isActive && isInitial ? 'border-white/80 w-80 md:w-[28rem] shadow-[0_10px_40px_-10px_rgba(255,255,255,0.2)]' : ''}
            ${isActive && !isInitial ? 'w-64 md:w-80 border-white/60 bg-black/80' : ''}
          `}
        />
        
        {/* Submit Button (Arrow) */}
        <button 
          onClick={handleSubmit}
          className={`
            absolute top-1/2 -translate-y-1/2
            text-white/50 hover:text-white transition-colors duration-300
            ${isInitial ? '-right-8' : '-right-6'}
            ${value.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          aria-label="Submit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${isInitial ? 'w-5 h-5' : 'w-4 h-4'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
        
        {/* Decorative brackets - Only show in initial state for grandeur */}
        {isInitial && (
          <>
            <div className={`
              absolute top-0 bottom-0 -left-4 w-[1px] bg-white/30 transition-all duration-300
              ${isActive ? 'h-full opacity-100' : 'h-0 opacity-0'}
            `}></div>
            <div className={`
              absolute top-0 bottom-0 -right-4 w-[1px] bg-white/30 transition-all duration-300
              ${isActive ? 'h-full opacity-100' : 'h-0 opacity-0'}
            `}></div>
          </>
        )}
      </div>

      {/* Instructions - Fade out after initial */}
      <div className={`mt-4 text-[10px] text-gray-500 font-mono tracking-widest transition-opacity duration-500 ${isInitial ? 'opacity-50' : 'opacity-0 hidden'}`}>
        PRESS [ENTER] TO MATERIALIZE
      </div>
      
    </div>
  );
};

export default InputOverlay;