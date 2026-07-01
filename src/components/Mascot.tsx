import React from 'react';
import { motion, useMotionValue, useSpring, type MotionValue, type TargetAndTransition } from 'framer-motion';
import type { MascotState } from '../store';

// ============================================================================
// Mimo — the PreE-du mascot. Cool & Energetic Edition for Boys!
// President University colors with sporty vibes and fun animations.
// Less kawaii, more adventurous!
// ============================================================================

interface MascotProps {
  state?: MascotState;
  speechText?: string | null;
  className?: string;
}

type SourceMood = 'idle' | 'happy' | 'sad' | 'thinking';
type EyeMotion = { x: MotionValue<number>; y: MotionValue<number> };
type FaceProps = { eyeMotion: EyeMotion };

const SIZE_MAP: Record<'small' | 'medium' | 'large', number> = {
  small: 90,
  medium: 140,
  large: 200,
};

const MimoDefs = () => (
  <defs>
    {/* Fur Gradients - Preserved from Reference */}
    <linearGradient id="mimo-furBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#F4F5F7" />
      <stop offset="55%" stopColor="#E2E5EA" />
      <stop offset="100%" stopColor="#CDD2DA" />
    </linearGradient>
    <linearGradient id="mimo-furHead" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FAFBFC" />
      <stop offset="60%" stopColor="#ECEEF1" />
      <stop offset="100%" stopColor="#D9DCE2" />
    </linearGradient>
    <linearGradient id="mimo-earInner" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFE3D6" />
      <stop offset="100%" stopColor="#FFCBB3" />
    </linearGradient>
    <linearGradient id="mimo-bellyFur" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="100%" stopColor="#F7F4EF" />
    </linearGradient>
    
    {/* Sporty Cheek Blush - Orange instead of Pink! */}
    <radialGradient id="mimo-cheekBlush" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFA500" stopOpacity="0.7" />
      <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
    </radialGradient>
    
    {/* President University Colors */}
    <linearGradient id="president-navy" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#2C5282" />
      <stop offset="100%" stopColor="#1E3A8A" />
    </linearGradient>
    <linearGradient id="president-gold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFE066" />
      <stop offset="50%" stopColor="#FFD700" />
      <stop offset="100%" stopColor="#F6AD55" />
    </linearGradient>
    
    {/* Sporty Collar with Racing Stripes */}
    <linearGradient id="mimo-collarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FF8C42" />
      <stop offset="100%" stopColor="#FF6B35" />
    </linearGradient>
    <linearGradient id="mimo-bellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFE899" />
      <stop offset="100%" stopColor="#FFD166" />
    </linearGradient>
    <radialGradient id="mimo-eyeShine" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#9FE8F5" />
      <stop offset="60%" stopColor="#5FC9E0" />
      <stop offset="100%" stopColor="#3DA8C2" />
    </radialGradient>
  </defs>
);

const MimoBody = ({ children }: { children: React.ReactNode }) => (
  <>
    {/* Soft contact shadow */}
    <ellipse cx="100" cy="193" rx="48" ry="7" fill="#000000" opacity="0.10" />

    {/* Tail, curled around right side */}
    <path
      d="M132 190 Q168 190 178 164 Q188 138 178 114 Q172 98 156 96 Q148 95 144 101 Q158 102 166 118 Q172 134 164 152 Q156 170 138 184 Q135 187 132 190 Z"
      fill="url(#mimo-furBody)" stroke="#B8BEC8" strokeWidth="2.5" strokeLinejoin="round"
    />
    <path d="M152 100 Q168 108 174 128" stroke="#C9CDD4" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />

    {/* Back paws peeking */}
    <ellipse cx="70" cy="178" rx="19" ry="14" fill="url(#mimo-furBody)" stroke="#C3C9D1" strokeWidth="2" />
    <ellipse cx="130" cy="178" rx="19" ry="14" fill="url(#mimo-furBody)" stroke="#C3C9D1" strokeWidth="2" />

    {/* Body — Full, round, and healthy! */}
    <ellipse cx="100" cy="145" rx="55" ry="48" fill="url(#mimo-furBody)" stroke="#B8BEC8" strokeWidth="2.5" />

    {/* Belly patch */}
    <ellipse cx="100" cy="158" rx="33" ry="31" fill="url(#mimo-bellyFur)" />

    {/* Front paws with NEUTRAL TOE BEANS (Grey instead of Pink!) 🐾 */}
    <g>
      <ellipse cx="78" cy="181" rx="18" ry="15" fill="url(#mimo-bellyFur)" stroke="#C3C9D1" strokeWidth="2" />
      <path d="M71 185 Q78 189 85 185" stroke="#C9CDD4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <ellipse cx="78" cy="184" rx="5" ry="3.5" fill="#A0AEC0" opacity="0.7" />
      <circle cx="72" cy="179" r="2" fill="#A0AEC0" opacity="0.7" />
      <circle cx="78" cy="177" r="2" fill="#A0AEC0" opacity="0.7" />
      <circle cx="84" cy="179" r="2" fill="#A0AEC0" opacity="0.7" />
    </g>
    <g>
      <ellipse cx="122" cy="181" rx="18" ry="15" fill="url(#mimo-bellyFur)" stroke="#C3C9D1" strokeWidth="2" />
      <path d="M115 185 Q122 189 129 185" stroke="#C9CDD4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <ellipse cx="122" cy="184" rx="5" ry="3.5" fill="#A0AEC0" opacity="0.7" />
      <circle cx="116" cy="179" r="2" fill="#A0AEC0" opacity="0.7" />
      <circle cx="122" cy="177" r="2" fill="#A0AEC0" opacity="0.7" />
      <circle cx="128" cy="179" r="2" fill="#A0AEC0" opacity="0.7" />
    </g>

    {/* Left ear */}
    <path d="M46 58 Q22 18 60 4 Q92 8 86 50 Q66 46 46 58 Z" fill="url(#mimo-furHead)" stroke="#B8BEC8" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M54 48 Q40 22 62 10 Q80 16 76 44 Q64 40 54 48 Z" fill="url(#mimo-earInner)" />

    {/* Right ear */}
    <path d="M154 58 Q178 18 140 4 Q108 8 114 50 Q134 46 154 58 Z" fill="url(#mimo-furHead)" stroke="#B8BEC8" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M146 48 Q160 22 138 10 Q120 16 124 44 Q136 40 146 48 Z" fill="url(#mimo-earInner)" />

    {/* Head */}
    <circle cx="100" cy="96" r="62" fill="url(#mimo-furHead)" stroke="#B8BEC8" strokeWidth="2.5" />

    {/* Tabby brow-stripe marking */}
    <path d="M84 48 Q89 39 94 48" stroke="#C9CDD4" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M106 48 Q111 39 116 48" stroke="#C9CDD4" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M97 39 L100 54 L103 39" stroke="#C9CDD4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />

    {/* Per-mood face content */}
    {children}

    {/* Whiskers - Thicker and more confident */}
    <path d="M30 98 Q47 96 58 101 M30 109 Q47 109 58 109" stroke="#B8BEC8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M170 98 Q153 96 142 101 M170 109 Q153 109 142 109" stroke="#B8BEC8" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Sporty Collar with Racing Stripes */}
    <path d="M72 146 Q100 156 128 146 L126 153 Q100 162 74 153 Z" fill="url(#mimo-collarGrad)" stroke="#E8763D" strokeWidth="1.5" opacity="0.95" />
    <path d="M78 149 Q100 157 122 149" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.82" />
    
    {/* Swinging Bell */}
    <g transform="translate(100, 150)">
      <animateTransform 
        attributeName="transform" type="rotate" values="-12; 12; -12" 
        keyTimes="0; 0.5; 1" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1" 
        dur="2s" repeatCount="indefinite" additive="sum" 
      />
      <g transform="translate(-100, -150)">
        <circle cx="100" cy="157" r="9.5" fill="url(#mimo-bellGrad)" stroke="#E8AE3D" strokeWidth="2" />
        <path d="M94.5 157 L105.5 157 M100 153 L100 161" stroke="#E8AE3D" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="100" cy="162" r="2" fill="#B8842A" />
        <circle cx="96" cy="153" r="2.4" fill="#FFFFFF" opacity="0.7" />
      </g>
    </g>

    {/* 🎓 GRADUATION CAP (Mortarboard) - President University Colors - COOL EDITION */}
    <g transform="translate(100, 38)">
      {/* Cap base (skull cap) */}
      <ellipse cx="0" cy="8" rx="40" ry="15" fill="url(#president-navy)" stroke="#1A365D" strokeWidth="2" />
      
      {/* Mortarboard (square top) */}
      <path 
        d="M -44 -2 L 44 -2 L 40 14 L -40 14 Z" 
        fill="url(#president-navy)" 
        stroke="#1A365D" 
        strokeWidth="2"
        strokeLinejoin="round"
      />
      
      {/* BOLD Gold stripe on top board */}
      <path 
        d="M -40 3 L 40 3" 
        stroke="url(#president-gold)" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* ⭐ STAR EMBLEM in center */}
      <path 
        d="M 0 -2 L 2 4 L 8 4 L 3 7 L 5 13 L 0 9 L -5 13 L -3 7 L -8 4 L -2 4 Z" 
        fill="url(#president-gold)" 
        stroke="#D69E2E" 
        strokeWidth="1"
      />
      
      {/* Button on top (holds tassel) */}
      <circle cx="0" cy="2" r="5" fill="url(#president-gold)" stroke="#D69E2E" strokeWidth="1.5" />
      <circle cx="-1" cy="1" r="2" fill="#FFFFFF" opacity="0.5" />
      
      {/* 🎓 Animated Tassel (Rumbai) - Longer and more dramatic */}
      <g transform="translate(0, 2)">
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="-10; 10; -10" 
          keyTimes="0; 0.5; 1"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          dur="2.5s" 
          repeatCount="indefinite"
        />
        <g transform="translate(0, -2)">
          {/* Tassel cord */}
          <path d="M 0 2 Q 18 25 15 40" stroke="url(#president-gold)" strokeWidth="3" fill="none" strokeLinecap="round" />
          
          {/* Tassel fringe (berumbai) */}
          <path d="M 15 40 L 10 52 M 15 40 L 12 52 M 15 40 L 15 52 M 15 40 L 18 52 M 15 40 L 20 52" 
                stroke="url(#president-gold)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                fill="none" 
          />
          
          {/* Tassel knot */}
          <circle cx="15" cy="40" r="4" fill="url(#president-gold)" stroke="#D69E2E" strokeWidth="1" />
        </g>
      </g>
    </g>
  </>
);

// ---- Per-mood face content ----
const FaceIdle = ({ eyeMotion }: FaceProps) => (
  <>
    <ellipse cx="58" cy="111" rx="14" ry="10" fill="url(#mimo-cheekBlush)">
      <animate attributeName="opacity" values="0.72; 1; 0.72" dur="2.8s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="142" cy="111" rx="14" ry="10" fill="url(#mimo-cheekBlush)">
      <animate attributeName="opacity" values="0.72; 1; 0.72" dur="2.8s" repeatCount="indefinite" />
    </ellipse>

    {/* Left Eye with BLINK & 3 HIGHLIGHTS */}
    <g transform="translate(75, 95)">
      <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.1; 1 1; 1 1" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" additive="sum" />
      <g transform="translate(-75, -95)">
        <ellipse cx="75" cy="95" rx="17" ry="20" fill="url(#mimo-eyeShine)" />
        <ellipse cx="75" cy="95" rx="17" ry="20" fill="none" stroke="#2B7A91" strokeWidth="1.5" />
        <motion.g style={{ x: eyeMotion.x, y: eyeMotion.y }}>
          <ellipse cx="77" cy="99" rx="10" ry="12" fill="#1E5266" opacity="0.85" />
          <ellipse cx="81" cy="86" rx="6" ry="7" fill="#FFFFFF" opacity="0.95" />
          <circle cx="70" cy="102" r="3" fill="#FFFFFF" opacity="0.85" />
          <circle cx="82" cy="105" r="1.5" fill="#FFFFFF" opacity="0.9" />
        </motion.g>
      </g>
    </g>

    {/* Right Eye with BLINK & 3 HIGHLIGHTS */}
    <g transform="translate(125, 95)">
      <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.1; 1 1; 1 1" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" additive="sum" />
      <g transform="translate(-125, -95)">
        <ellipse cx="125" cy="95" rx="17" ry="20" fill="url(#mimo-eyeShine)" />
        <ellipse cx="125" cy="95" rx="17" ry="20" fill="none" stroke="#2B7A91" strokeWidth="1.5" />
        <motion.g style={{ x: eyeMotion.x, y: eyeMotion.y }}>
          <ellipse cx="123" cy="99" rx="10" ry="12" fill="#1E5266" opacity="0.85" />
          <ellipse cx="119" cy="86" rx="6" ry="7" fill="#FFFFFF" opacity="0.95" />
          <circle cx="130" cy="102" r="3" fill="#FFFFFF" opacity="0.85" />
          <circle cx="118" cy="105" r="1.5" fill="#FFFFFF" opacity="0.9" />
        </motion.g>
      </g>
    </g>

    <path d="M93 117 Q100 113 107 117 Q103 123 100 124 Q97 123 93 117 Z" fill="#FF9E92" />
    <path d="M87 122 Q100 134 113 122" stroke="#6F7480" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </>
);

const FaceHappy = (_props: FaceProps) => (
  <>
    <ellipse cx="58" cy="106" rx="15" ry="11" fill="url(#mimo-cheekBlush)" />
    <ellipse cx="142" cy="106" rx="15" ry="11" fill="url(#mimo-cheekBlush)" />

    {/* Big confident smile */}
    <path d="M62 94 Q76 78 90 94" fill="none" stroke="#3A3F4B" strokeWidth="5" strokeLinecap="round" />
    <path d="M110 94 Q124 78 138 94" fill="none" stroke="#3A3F4B" strokeWidth="5" strokeLinecap="round" />

    <path d="M93 110 Q100 106 107 110 Q103 116 100 117 Q97 116 93 110 Z" fill="#FF9E92" />

    {/* Wide open mouth - more energetic */}
    <path d="M80 116 Q100 140 120 116 Q110 130 100 130 Q90 130 80 116 Z" fill="#C76B5D" />
    <path d="M80 116 Q100 140 120 116" fill="none" stroke="#7A7F8C" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="100" cy="122" rx="7" ry="4" fill="#FF8A7D" />

    {/* 😎 SUNGLASSES (appears in happy mood!) */}
    <g>
      <ellipse cx="75" cy="95" rx="20" ry="15" fill="#1A202C" stroke="#2D3748" strokeWidth="2" />
      <ellipse cx="125" cy="95" rx="20" ry="15" fill="#1A202C" stroke="#2D3748" strokeWidth="2" />
      <path d="M 95 95 L 105 95" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />
      {/* Shine on sunglasses */}
      <path d="M 65 88 L 70 88" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M 115 88 L 120 88" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </g>
  </>
);

const FaceSad = (_props: FaceProps) => (
  <>
    <path d="M62 92 Q76 86 90 94" fill="none" stroke="#3A3F4B" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    <ellipse cx="76" cy="98" rx="15" ry="15" fill="url(#mimo-eyeShine)" opacity="0.8" />
    <path d="M63 92 Q76 86 89 92 L89 98 Q76 91 63 98 Z" fill="url(#mimo-furHead)" />
    <ellipse cx="76" cy="100" rx="8" ry="9" fill="#1E5266" opacity="0.8" />
    <circle cx="80" cy="98" r="4" fill="#FFFFFF" />

    <path d="M110 94 Q124 86 138 92" fill="none" stroke="#3A3F4B" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    <ellipse cx="124" cy="98" rx="15" ry="15" fill="url(#mimo-eyeShine)" opacity="0.8" />
    <path d="M111 92 Q124 86 137 92 L137 98 Q124 91 111 98 Z" fill="url(#mimo-furHead)" />
    <ellipse cx="124" cy="100" rx="8" ry="9" fill="#1E5266" opacity="0.8" />
    <circle cx="128" cy="98" r="4" fill="#FFFFFF" />

    <path d="M64 80 Q76 84 86 80" fill="none" stroke="#C9CDD4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M114 80 Q124 84 136 80" fill="none" stroke="#C9CDD4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

    {/* Animated Tear */}
    <path d="M64 105 Q60 115 64 120 Q68 115 64 105 Z" fill="#9FE8F5" opacity="0.8">
      <animate attributeName="opacity" values="0; 0.8; 0" dur="2.5s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values="0 0; 0 10; 0 15" dur="2.5s" repeatCount="indefinite" />
    </path>

    <path d="M93 116 Q100 112 107 116 Q103 122 100 123 Q97 122 93 116 Z" fill="#FF9E92" />
    <path d="M88 128 Q100 119 112 128" stroke="#7A7F8C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </>
);

const FaceThinking = ({ eyeMotion }: FaceProps) => (
  <>
    <ellipse cx="58" cy="110" rx="14" ry="10" fill="url(#mimo-cheekBlush)" opacity="0.7" />
    <ellipse cx="142" cy="110" rx="14" ry="10" fill="url(#mimo-cheekBlush)" opacity="0.7" />

    <g transform="translate(76, 94)">
      <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.1; 1 1; 1 1" keyTimes="0; 0.03; 0.06; 1" dur="5s" repeatCount="indefinite" additive="sum" />
      <g transform="translate(-76, -94)">
        <ellipse cx="76" cy="94" rx="16" ry="18" fill="url(#mimo-eyeShine)" />
        <ellipse cx="76" cy="94" rx="16" ry="18" fill="none" stroke="#2B7A91" strokeWidth="1.5" />
        <motion.g style={{ x: eyeMotion.x, y: eyeMotion.y }}>
          <ellipse cx="80" cy="92" rx="9" ry="11" fill="#1E5266" opacity="0.85" />
          <circle cx="83" cy="85" r="5" fill="#FFFFFF" />
          <circle cx="74" cy="100" r="2" fill="#FFFFFF" />
        </motion.g>
      </g>
    </g>

    <g transform="translate(124, 94)">
      <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.1; 1 1; 1 1" keyTimes="0; 0.03; 0.06; 1" dur="5s" repeatCount="indefinite" additive="sum" />
      <g transform="translate(-124, -94)">
        <ellipse cx="124" cy="94" rx="16" ry="18" fill="url(#mimo-eyeShine)" />
        <ellipse cx="124" cy="94" rx="16" ry="18" fill="none" stroke="#2B7A91" strokeWidth="1.5" />
        <motion.g style={{ x: eyeMotion.x, y: eyeMotion.y }}>
          <ellipse cx="128" cy="92" rx="9" ry="11" fill="#1E5266" opacity="0.85" />
          <circle cx="131" cy="85" r="5" fill="#FFFFFF" />
          <circle cx="122" cy="100" r="2" fill="#FFFFFF" />
        </motion.g>
      </g>
    </g>

    <path d="M108 76 Q124 68 138 75" fill="none" stroke="#C9CDD4" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

    <path d="M93 116 Q100 112 107 116 Q103 122 100 123 Q97 122 93 116 Z" fill="#FF9E92" />
    <ellipse cx="100" cy="125" rx="4.5" ry="3.5" fill="none" stroke="#7A7F8C" strokeWidth="2" strokeLinecap="round" />

  </>
);

const FACES: Record<SourceMood, React.FC<FaceProps>> = {
  idle: FaceIdle,
  happy: FaceHappy,
  sad: FaceSad,
  thinking: FaceThinking,
};

const mapStateToMood = (state?: MascotState): SourceMood => {
  if (state === 'happy' || state === 'achievement') return 'happy';
  if (state === 'sad') return 'sad';
  if (state === 'talking') return 'thinking';
  return 'idle';
};

const getVariant = (mood: SourceMood, state?: MascotState, calm = false): TargetAndTransition => {
  if (calm) {
    return {
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.18, ease: 'easeOut' as const }
    };
  }

  if (state === 'achievement') {
    return {
      scale: [1, 1.22, 1.04, 1.12, 1.04],
      scaleX: [1, 0.96, 1.08, 1.02, 1],
      scaleY: [1, 1.08, 0.94, 1.04, 1],
      y: [0, -24, 3, -9, 0],
      rotate: [0, -4, 4, -2, 0],
      transition: { duration: 1.05, repeat: Infinity, repeatDelay: 1.1, ease: 'easeInOut' as const }
    };
  }

  const variants: Record<SourceMood, TargetAndTransition> = {
    idle: {
      y: [0, -8, 0],
      scaleY: [1, 0.98, 1],
      scaleX: [1, 1.02, 1],
      rotate: [0, 1.5, 0, -1.5, 0],
      transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const }
    },
    happy: {
      scale: [1, 1.15, 1],
      y: [0, -25, 0],
      rotate: [0, -8, 8, 0],
      transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const }
    },
    sad: {
      y: [0, 4, 0],
      rotate: [-4, 4, -4],
      transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const }
    },
    thinking: {
      rotate: [0, -8, 8, 0],
      y: [0, -4, 0],
      transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const }
    }
  };

  return variants[mood];
};

export const Mascot: React.FC<MascotProps> = ({ state = 'idle', speechText = null, className = '' }) => {
  const mood = mapStateToMood(state);
  const Face = FACES[mood] || FACES.idle;
  const pixelSize = SIZE_MAP.large;
  const message = speechText ?? '';
  const coachMascot = className.includes('lesson-coach-mascot');
  const calmBodyMotion = coachMascot || className.includes('duo-hero-mimo');
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const smoothEyeX = useSpring(eyeX, { stiffness: 260, damping: 24, mass: 0.35 });
  const smoothEyeY = useSpring(eyeY, { stiffness: 260, damping: 24, mass: 0.35 });

  React.useEffect(() => {
    const shouldTrack = !coachMascot && (mood === 'idle' || mood === 'thinking');
    if (!shouldTrack) {
      eyeX.set(0);
      eyeY.set(0);
      return;
    }

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const handlePointerMove = (event: PointerEvent) => {
      const originX = window.innerWidth * 0.38;
      const originY = window.innerHeight * 0.42;
      const normalizedX = (event.clientX - originX) / Math.max(originX, window.innerWidth - originX);
      const normalizedY = (event.clientY - originY) / Math.max(originY, window.innerHeight - originY);

      eyeX.set(clamp(normalizedX * 5.5, -4.8, 4.8));
      eyeY.set(clamp(normalizedY * 3.8, -3.2, 3.2));
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [coachMascot, eyeX, eyeY, mood]);

  return (
    <div className={`mimo-stage flex flex-col items-center justify-center p-4 relative ${className}`} style={{ minHeight: '260px' }}>
      <motion.div
        animate={getVariant(mood, state, calmBodyMotion)}
        whileHover={calmBodyMotion ? undefined : { scale: 1.08, rotate: 6 }}
        whileTap={calmBodyMotion ? undefined : { scale: 0.92 }}
        className="cursor-pointer"
        style={{ filter: 'drop-shadow(0px 12px 16px rgba(0,0,0,0.2))', transformOrigin: 'bottom center' }}
      >
        <svg
          width={pixelSize}
          height={pixelSize * (220 / 200)}
          viewBox="0 0 200 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mimo-mascot"
          role="img"
          aria-label="Mimo si maskot lulusan"
        >
          <MimoDefs />
          <MimoBody>
            <Face eyeMotion={{ x: smoothEyeX, y: smoothEyeY }} />
          </MimoBody>
        </svg>

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="speech-bubble speech-bubble-mimo absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-xl border-3 border-orange-500 whitespace-nowrap z-20"
          >
            <p className="text-sm font-bold text-gray-700">{message}</p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-3 border-r-3 border-orange-500 rotate-45"></div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
