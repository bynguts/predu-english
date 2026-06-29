import React from 'react';
import type { MascotState } from '../store';

interface MascotProps {
  state: MascotState;
  speechText?: string | null;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({ state, speechText, className = "" }) => {
  // Determine animation classes based on state
  let animationClass = "anim-breathe";
  if (state === 'happy') {
    animationClass = "anim-jump";
  } else if (state === 'sad') {
    animationClass = "anim-shake";
  } else if (state === 'talking') {
    animationClass = "anim-breathe"; // we can do a slight wiggle or just talk
  }

  return (
    <div className={`flex flex-col items-center justify-center relative ${className}`} style={{ minHeight: '260px' }}>
      {/* Speech Bubble */}
      {speechText && (
        <div className="mb-6 animate-[fadeIn_0.3s_ease-out] z-10">
          <div className="speech-bubble relative">
            <p className="text-base text-gray-800 font-bold">{speechText}</p>
          </div>
        </div>
      )}

      {/* SVG Owl Mascot */}
      <svg
        width="180"
        height="180"
        viewBox="0 0 200 200"
        className={`${animationClass}`}
        style={{ transformOrigin: 'bottom center' }}
      >
        {/* Shadow under mascot */}
        <ellipse cx="100" cy="185" rx="60" ry="10" fill="#e5e5e5" />

        {/* Feet */}
        <ellipse cx="70" cy="180" rx="14" ry="8" fill="#ff9600" />
        <ellipse cx="130" cy="180" rx="14" ry="8" fill="#ff9600" />

        {/* Orange claws details */}
        <circle cx="62" cy="182" r="3" fill="#e07b00" />
        <circle cx="70" cy="184" r="3" fill="#e07b00" />
        <circle cx="78" cy="182" r="3" fill="#e07b00" />
        <circle cx="122" cy="182" r="3" fill="#e07b00" />
        <circle cx="130" cy="184" r="3" fill="#e07b00" />
        <circle cx="138" cy="182" r="3" fill="#e07b00" />

        {/* Main Body */}
        <ellipse cx="100" cy="115" rx="65" ry="70" fill="#58cc02" />

        {/* Outer Ears / Tufts */}
        <path d="M42,60 L20,35 Q40,40 55,50 Z" fill="#58cc02" />
        <path d="M158,60 L180,35 Q160,40 145,50 Z" fill="#58cc02" />

        {/* Inner Ears / Tufts */}
        <path d="M42,60 L28,42 Q40,45 50,52 Z" fill="#3f8f01" />
        <path d="M158,60 L172,42 Q160,45 150,52 Z" fill="#3f8f01" />

        {/* Tummy Patch */}
        <ellipse cx="100" cy="130" rx="45" ry="48" fill="#d7ffb8" />

        {/* Chest Feathers (Duolingo-style V shapes) */}
        <path d="M85,110 L90,118 L95,110" stroke="#a2e048" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M105,110 L110,118 L115,110" stroke="#a2e048" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M95,130 L100,138 L105,130" stroke="#a2e048" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M75,125 L80,133 L85,125" stroke="#a2e048" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M115,125 L120,133 L125,125" stroke="#a2e048" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Wings */}
        {state === 'happy' ? (
          <>
            {/* Happy raised wings */}
            <path d="M35,110 Q5,75 20,60 Q38,70 38,100" fill="#46a302" />
            <path d="M165,110 Q195,75 180,60 Q162,70 162,100" fill="#46a302" />
          </>
        ) : state === 'sad' ? (
          <>
            {/* Sad droopy wings */}
            <path d="M35,110 Q5,130 15,150 Q40,140 38,110" fill="#46a302" />
            <path d="M165,110 Q195,130 185,150 Q160,140 162,110" fill="#46a302" />
          </>
        ) : (
          <>
            {/* Normal wings */}
            <path d="M35,110 Q10,120 20,140 Q40,130 38,110" fill="#46a302" />
            <path d="M165,110 Q190,120 180,140 Q160,130 162,110" fill="#46a302" />
          </>
        )}

        {/* Eye Circles */}
        <circle cx="68" cy="88" r="24" fill="#ffffff" />
        <circle cx="132" cy="88" r="24" fill="#ffffff" />

        {/* Eyes / Pupils based on State */}
        {state === 'happy' ? (
          <>
            {/* Smiling closed eyes */}
            <path d="M54,88 Q68,74 82,88" stroke="#3c3c3c" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M118,88 Q132,74 146,88" stroke="#3c3c3c" strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        ) : state === 'sad' ? (
          <>
            {/* Downward sad eyes */}
            <path d="M54,82 Q68,96 82,82" stroke="#3c3c3c" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M118,82 Q132,96 146,82" stroke="#3c3c3c" strokeWidth="5" strokeLinecap="round" fill="none" />
            
            {/* Sad Sweat Drop */}
            <path d="M32,70 C32,70 24,80 24,86 C24,90 27.5,93 32,93 C36.5,93 40,90 40,86 C40,80 32,70 32,70 Z" fill="#1cb0f6" />
          </>
        ) : (
          <>
            {/* Regular looking forward blinking eyes */}
            <g className="mascot-eye">
              <circle cx="68" cy="88" r="12" fill="#4b4b4b" />
              <circle cx="132" cy="88" r="12" fill="#4b4b4b" />
              {/* Eye Shines */}
              <circle cx="64" cy="84" r="4" fill="#ffffff" />
              <circle cx="128" cy="84" r="4" fill="#ffffff" />
            </g>
          </>
        )}

        {/* Orange Beak */}
        {state === 'talking' ? (
          /* Animated/open beak */
          <path d="M88,98 Q100,85 112,98 Q100,118 88,98 Z M90,100 L110,100 L100,112 Z" fill="#ff9600" />
        ) : state === 'sad' ? (
          /* Triangle pointing down, sad */
          <polygon points="88,98 112,98 100,114" fill="#ff9600" />
        ) : (
          /* Normal beak */
          <polygon points="88,98 112,98 100,109" fill="#ff9600" />
        )}

        {/* Orange Cheeks */}
        {state === 'happy' && (
          <>
            <ellipse cx="48" cy="106" rx="8" ry="4" fill="#ff8ba7" opacity="0.6" />
            <ellipse cx="152" cy="106" rx="8" ry="4" fill="#ff8ba7" opacity="0.6" />
          </>
        )}
      </svg>
    </div>
  );
};
