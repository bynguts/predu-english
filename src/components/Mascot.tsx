import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { MascotState } from '../store';

interface MascotProps {
  state: MascotState;
  speechText?: string | null;
  className?: string;
  showSunglasses?: boolean;
}

const easeOutQuint = [0.22, 1, 0.36, 1] as const;
const cinematicEase = [0.33, 1, 0.68, 1] as const;

const MimoDefs = () => (
  <defs>
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
    <linearGradient id="mimo-navy" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#2C5282" />
      <stop offset="100%" stopColor="#1E3A8A" />
    </linearGradient>
    <linearGradient id="mimo-gold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFE066" />
      <stop offset="50%" stopColor="#FFD700" />
      <stop offset="100%" stopColor="#F6AD55" />
    </linearGradient>
    <linearGradient id="mimo-collar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FF8C42" />
      <stop offset="100%" stopColor="#FF6B35" />
    </linearGradient>
    <linearGradient id="mimo-bell" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFE899" />
      <stop offset="100%" stopColor="#FFD166" />
    </linearGradient>
    <radialGradient id="mimo-cheek" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFA500" stopOpacity="0.62" />
      <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="mimo-eye" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#9FE8F5" />
      <stop offset="60%" stopColor="#5FC9E0" />
      <stop offset="100%" stopColor="#3DA8C2" />
    </radialGradient>
  </defs>
);

const FaceIdle = () => (
  <>
    <ellipse cx="58" cy="111" rx="14" ry="10" fill="url(#mimo-cheek)" />
    <ellipse cx="142" cy="111" rx="14" ry="10" fill="url(#mimo-cheek)" />
    <g className="mascot-eye">
      <ellipse cx="75" cy="95" rx="17" ry="20" fill="url(#mimo-eye)" />
      <ellipse cx="125" cy="95" rx="17" ry="20" fill="url(#mimo-eye)" />
      <ellipse cx="77" cy="99" rx="10" ry="12" fill="#1E5266" opacity="0.85" />
      <ellipse cx="123" cy="99" rx="10" ry="12" fill="#1E5266" opacity="0.85" />
      <ellipse cx="81" cy="86" rx="6" ry="7" fill="#FFFFFF" opacity="0.95" />
      <ellipse cx="119" cy="86" rx="6" ry="7" fill="#FFFFFF" opacity="0.95" />
      <circle cx="70" cy="102" r="3" fill="#FFFFFF" opacity="0.85" />
      <circle cx="130" cy="102" r="3" fill="#FFFFFF" opacity="0.85" />
    </g>
    <path d="M93 117 Q100 113 107 117 Q103 123 100 124 Q97 123 93 117 Z" fill="#FF9E92" />
    <path d="M89 122 Q95 130 100 130 Q106 131 113 121" stroke="#7A7F8C" strokeWidth="2.3" strokeLinecap="round" fill="none" />
  </>
);

const FaceHappy = ({ showSunglasses = true }: { showSunglasses?: boolean }) => (
  <>
    <ellipse cx="58" cy="106" rx="15" ry="11" fill="url(#mimo-cheek)" />
    <ellipse cx="142" cy="106" rx="15" ry="11" fill="url(#mimo-cheek)" />
    {showSunglasses ? (
      <>
        <ellipse cx="75" cy="95" rx="20" ry="15" fill="#1A202C" stroke="#2D3748" strokeWidth="2" />
        <ellipse cx="125" cy="95" rx="20" ry="15" fill="#1A202C" stroke="#2D3748" strokeWidth="2" />
        <path d="M95 95 L105 95" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />
        <path d="M65 88 L70 88 M115 88 L120 88" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </>
    ) : (
      <g className="mascot-eye">
        <ellipse cx="75" cy="94" rx="17" ry="19" fill="url(#mimo-eye)" />
        <ellipse cx="125" cy="94" rx="17" ry="19" fill="url(#mimo-eye)" />
        <ellipse cx="78" cy="98" rx="9" ry="11" fill="#1E5266" opacity="0.86" />
        <ellipse cx="122" cy="98" rx="9" ry="11" fill="#1E5266" opacity="0.86" />
        <ellipse cx="82" cy="86" rx="6" ry="7" fill="#FFFFFF" opacity="0.96" />
        <ellipse cx="118" cy="86" rx="6" ry="7" fill="#FFFFFF" opacity="0.96" />
        <circle cx="72" cy="102" r="2.8" fill="#FFFFFF" opacity="0.82" />
        <circle cx="128" cy="102" r="2.8" fill="#FFFFFF" opacity="0.82" />
        <path d="M60 82 Q75 73 90 82" stroke="#7A7F8C" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M110 82 Q125 73 140 82" stroke="#7A7F8C" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.45" />
      </g>
    )}
    <path d="M93 110 Q100 106 107 110 Q103 116 100 117 Q97 116 93 110 Z" fill="#FF9E92" />
    <path d="M80 116 Q100 140 120 116 Q110 130 100 130 Q90 130 80 116 Z" fill="#C76B5D" />
    <path d="M80 116 Q100 140 120 116" fill="none" stroke="#7A7F8C" strokeWidth="2" strokeLinecap="round" />
    <path d="M91 123 Q100 129 109 123" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.78" />
    <g opacity="0.82">
      <path d="M40 60 L45 55 L43 65 L48 62" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M160 60 L155 55 L157 65 L152 62" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </g>
  </>
);

const FaceSad = () => (
  <>
    <ellipse cx="76" cy="98" rx="15" ry="15" fill="url(#mimo-eye)" opacity="0.82" />
    <ellipse cx="124" cy="98" rx="15" ry="15" fill="url(#mimo-eye)" opacity="0.82" />
    <path d="M63 92 Q76 86 89 92 L89 98 Q76 91 63 98 Z" fill="url(#mimo-furHead)" />
    <path d="M111 92 Q124 86 137 92 L137 98 Q124 91 111 98 Z" fill="url(#mimo-furHead)" />
    <ellipse cx="76" cy="100" rx="8" ry="9" fill="#1E5266" opacity="0.8" />
    <ellipse cx="124" cy="100" rx="8" ry="9" fill="#1E5266" opacity="0.8" />
    <circle cx="80" cy="98" r="4" fill="#FFFFFF" />
    <circle cx="128" cy="98" r="4" fill="#FFFFFF" />
    <path d="M64 105 Q60 115 64 120 Q68 115 64 105 Z" fill="#9FE8F5" opacity="0.8" />
    <path d="M93 116 Q100 112 107 116 Q103 122 100 123 Q97 122 93 116 Z" fill="#FF9E92" />
    <path d="M88 128 Q100 119 112 128" stroke="#7A7F8C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </>
);

const FaceTalking = () => (
  <>
    <ellipse cx="58" cy="110" rx="14" ry="10" fill="url(#mimo-cheek)" opacity="0.72" />
    <ellipse cx="142" cy="110" rx="14" ry="10" fill="url(#mimo-cheek)" opacity="0.72" />
    <ellipse cx="76" cy="94" rx="16" ry="18" fill="url(#mimo-eye)" />
    <ellipse cx="124" cy="94" rx="16" ry="18" fill="url(#mimo-eye)" />
    <ellipse cx="80" cy="92" rx="9" ry="11" fill="#1E5266" opacity="0.85" />
    <ellipse cx="128" cy="92" rx="9" ry="11" fill="#1E5266" opacity="0.85" />
    <circle cx="83" cy="85" r="5" fill="#FFFFFF" />
    <circle cx="131" cy="85" r="5" fill="#FFFFFF" />
    <path d="M93 116 Q100 112 107 116 Q103 122 100 123 Q97 122 93 116 Z" fill="#FF9E92" />
    <ellipse cx="100" cy="126" rx="7" ry="5" fill="#7A7F8C" />
    <g opacity="0.75">
      <circle cx="148" cy="28" r="3.5" fill="#C9CDD4" />
      <circle cx="158" cy="18" r="2.5" fill="#C9CDD4" />
      <circle cx="166" cy="9" r="1.7" fill="#C9CDD4" />
    </g>
  </>
);

const getFace = (state: MascotState, showSunglasses = true) => {
  if (state === 'happy') return <FaceHappy showSunglasses={showSunglasses} />;
  if (state === 'sad') return <FaceSad />;
  if (state === 'talking') return <FaceTalking />;
  return <FaceIdle />;
};

const getMascotLoopMotion = (state: MascotState, reducedMotion: boolean) => {
  if (reducedMotion) {
    return {
      animate: { y: 0, rotate: 0, rotateY: 0, scale: 1 },
      transition: { duration: 0 }
    };
  }

  if (state === 'happy') {
    return {
      animate: {
        y: [0, 2, -8, -5, -7, -2, 0, 0],
        rotate: [0, 0.6, -1.8, 1.2, -0.8, 0.35, 0, 0],
        rotateY: [-2, -4, 4, -2, 2, 0, -2, -2],
        scale: [1, 0.992, 1.038, 1.018, 1.028, 1.006, 1, 1]
      },
      transition: {
        duration: 3.65,
        repeat: Infinity,
        times: [0, 0.08, 0.2, 0.33, 0.46, 0.62, 0.78, 1],
        ease: cinematicEase
      }
    };
  }

  if (state === 'sad') {
    return {
      animate: {
        y: [0, 2, 0],
        rotate: [0, -1.4, 1.4, -0.8, 0],
        rotateY: 0,
        scale: 0.99
      },
      transition: { duration: 0.44, ease: easeOutQuint }
    };
  }

  if (state === 'talking') {
    return {
      animate: {
        y: [0, -3, 0],
        rotate: [0, -0.6, 0.6, 0],
        rotateY: [-2, 2, -2],
        scale: [1, 1.008, 1]
      },
      transition: { duration: 1.65, repeat: Infinity, ease: 'easeInOut' as const }
    };
  }

  return {
    animate: {
      y: [0, -4, 0],
      rotate: [0, -0.5, 0.5, 0],
      rotateY: [-2, 2, -2],
      scale: [1, 1.006, 1]
    },
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const }
  };
};

const getWaveMotion = (state: MascotState, reducedMotion: boolean) => {
  if (reducedMotion || state === 'sad') {
    return {
      animate: { rotate: 0, y: 0, scale: 1 },
      transition: { duration: 0 }
    };
  }

  if (state === 'happy') {
    return {
      animate: {
        rotate: [0, 5, -30, 22, -25, 18, -10, 4, 0, 0],
        y: [0, 2, -9, -11, -9, -7, -4, -1, 0, 0],
        scale: [1, 0.98, 1.055, 1.025, 1.045, 1.02, 1.01, 1, 1, 1]
      },
      transition: {
        duration: 3.65,
        repeat: Infinity,
        times: [0, 0.08, 0.2, 0.3, 0.4, 0.5, 0.62, 0.72, 0.82, 1],
        ease: cinematicEase
      }
    };
  }

  if (state === 'talking') {
    return {
      animate: {
        rotate: [0, -8, 7, 0],
        y: [0, -2, -1, 0]
      },
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const }
    };
  }

  return {
    animate: {
      rotate: [0, -5, 0],
      y: [0, -1, 0]
    },
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const }
  };
};

const getPawMotion = (state: MascotState, reducedMotion: boolean) => {
  if (reducedMotion || state === 'sad') {
    return {
      animate: { rotate: 0, scale: 1 },
      transition: { duration: 0 }
    };
  }

  if (state === 'happy') {
    return {
      animate: {
        rotate: [0, -8, 21, -17, 19, -11, 8, 0, 0],
        scale: [1, 0.98, 1.1, 1.02, 1.08, 1.03, 1.01, 1, 1]
      },
      transition: {
        duration: 3.65,
        repeat: Infinity,
        times: [0, 0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 1],
        ease: cinematicEase
      }
    };
  }

  return {
    animate: { rotate: [0, 4, 0], scale: [1, 1.02, 1] },
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const }
  };
};

const getEarMotion = (side: 'left' | 'right', state: MascotState, reducedMotion: boolean) => {
  if (reducedMotion || state !== 'happy') {
    return {
      animate: { rotate: 0 },
      transition: { duration: 0 }
    };
  }

  const direction = side === 'left' ? -1 : 1;
  return {
    animate: { rotate: [0, direction * 1.5, direction * -5, direction * 3, 0, 0] },
    transition: {
      duration: 3.65,
      repeat: Infinity,
      times: [0, 0.12, 0.28, 0.48, 0.72, 1],
      ease: cinematicEase
    }
  };
};

const getCheerMotion = (state: MascotState, reducedMotion: boolean) => {
  if (reducedMotion || state !== 'happy') {
    return {
      animate: { opacity: 0.82, scale: 1 },
      transition: { duration: 0 }
    };
  }

  return {
    animate: {
      opacity: [0.45, 1, 0.9, 1, 0.5, 0.35],
      scale: [0.92, 1.08, 1.02, 1.12, 0.96, 0.92]
    },
    transition: {
      duration: 3.65,
      repeat: Infinity,
      times: [0, 0.2, 0.34, 0.5, 0.72, 1],
      ease: cinematicEase
    }
  };
};

export const Mascot: React.FC<MascotProps> = ({ state, speechText, className = '', showSunglasses = true }) => {
  const reducedMotion = useReducedMotion();
  const mascotLoopMotion = getMascotLoopMotion(state, Boolean(reducedMotion));
  const waveMotion = getWaveMotion(state, Boolean(reducedMotion));
  const pawMotion = getPawMotion(state, Boolean(reducedMotion));
  const leftEarMotion = getEarMotion('left', state, Boolean(reducedMotion));
  const rightEarMotion = getEarMotion('right', state, Boolean(reducedMotion));
  const cheerMotion = getCheerMotion(state, Boolean(reducedMotion));

  return (
    <div className={`mimo-stage flex flex-col items-center justify-center relative ${className}`} style={{ minHeight: '260px' }}>
      {speechText && (
        <motion.div
          className="mb-6 z-10"
          initial={reducedMotion ? false : { opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.24, ease: easeOutQuint }}
        >
          <div className="speech-bubble speech-bubble-mimo relative">
            <p className="text-base text-gray-800 font-bold">{speechText}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        className="mimo-halo"
        aria-hidden="true"
        initial={false}
        animate={reducedMotion ? { opacity: 0.72 } : { opacity: [0.5, 0.82, 0.5], scale: [0.94, 1.05, 0.94] }}
        transition={{ duration: 2.6, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="mimo-motion-frame"
        key={state}
        initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: easeOutQuint }}
      >
        <motion.svg
          width="190"
          height="209"
          viewBox="0 0 200 220"
          className="mimo-mascot"
          style={{ transformOrigin: 'bottom center' }}
          role="img"
          aria-label="Mimo, maskot Predu EngKids"
          {...mascotLoopMotion}
        >
      <MimoDefs />
      <ellipse cx="100" cy="193" rx="48" ry="7" fill="#000000" opacity="0.1" />
      <path d="M132 190 Q168 190 178 164 Q188 138 178 114 Q172 98 156 96 Q148 95 144 101 Q158 102 166 118 Q172 134 164 152 Q156 170 138 184 Q135 187 132 190 Z" fill="url(#mimo-furBody)" stroke="#B8BEC8" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="70" cy="178" rx="19" ry="14" fill="url(#mimo-furBody)" stroke="#C3C9D1" strokeWidth="2" />
      <ellipse cx="130" cy="178" rx="19" ry="14" fill="url(#mimo-furBody)" stroke="#C3C9D1" strokeWidth="2" />
      <ellipse cx="100" cy="145" rx="55" ry="48" fill="url(#mimo-furBody)" stroke="#B8BEC8" strokeWidth="2.5" />
      <ellipse cx="100" cy="158" rx="33" ry="31" fill="url(#mimo-bellyFur)" />
      <ellipse cx="78" cy="181" rx="18" ry="15" fill="url(#mimo-bellyFur)" stroke="#C3C9D1" strokeWidth="2" />
      <ellipse cx="122" cy="181" rx="18" ry="15" fill="url(#mimo-bellyFur)" stroke="#C3C9D1" strokeWidth="2" />
      <motion.g
        className="mimo-left-ear"
        style={{ transformOrigin: '70px 52px', transformBox: 'view-box' }}
        {...leftEarMotion}
      >
        <path d="M46 58 Q22 18 60 4 Q92 8 86 50 Q66 46 46 58 Z" fill="url(#mimo-furHead)" stroke="#B8BEC8" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M54 48 Q40 22 62 10 Q80 16 76 44 Q64 40 54 48 Z" fill="url(#mimo-earInner)" />
      </motion.g>
      <motion.g
        className="mimo-right-ear"
        style={{ transformOrigin: '130px 52px', transformBox: 'view-box' }}
        {...rightEarMotion}
      >
        <path d="M154 58 Q178 18 140 4 Q108 8 114 50 Q134 46 154 58 Z" fill="url(#mimo-furHead)" stroke="#B8BEC8" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M146 48 Q160 22 138 10 Q120 16 124 44 Q136 40 146 48 Z" fill="url(#mimo-earInner)" />
      </motion.g>
      <circle cx="100" cy="96" r="62" fill="url(#mimo-furHead)" stroke="#B8BEC8" strokeWidth="2.5" />
      <path d="M84 48 Q89 39 94 48 M106 48 Q111 39 116 48 M97 39 L100 54 L103 39" stroke="#C9CDD4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
      <motion.g
        className="mimo-wave-arm"
        style={{ transformOrigin: '65px 148px', transformBox: 'view-box' }}
        {...waveMotion}
      >
        <path d="M66 150 Q33 124 28 92 Q23 64 39 52 Q51 48 56 59 Q46 72 49 94 Q54 122 79 149 Z" fill="url(#mimo-furBody)" stroke="#B8BEC8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <motion.g
          className="mimo-wave-lines"
          style={{ transformOrigin: '24px 56px', transformBox: 'view-box' }}
          initial={false}
          animate={
            reducedMotion || state === 'sad'
              ? { opacity: 0, scale: 1 }
              : {
                  opacity: [0, 0.95, 0.7, 1, 0.45, 0, 0],
                  scale: [0.9, 1.12, 1.02, 1.18, 1.05, 0.95, 0.9]
                }
          }
          transition={{
            duration: 3.65,
            repeat: reducedMotion || state === 'sad' ? 0 : Infinity,
            times: [0, 0.2, 0.34, 0.5, 0.68, 0.82, 1],
            ease: cinematicEase
          }}
        >
          <path d="M31 48 Q24 55 27 65" stroke="#1CB0F6" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M23 42 Q14 55 18 70" stroke="#FFD700" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </motion.g>
        <motion.g
          className="mimo-wave-paw"
          style={{ transformOrigin: '36px 55px', transformBox: 'view-box' }}
          {...pawMotion}
        >
          <ellipse cx="36" cy="55" rx="17" ry="14" fill="url(#mimo-bellyFur)" stroke="#B8BEC8" strokeWidth="2.2" />
          <path d="M24 53 Q29 45 34 53 M36 49 Q40 42 45 51 M47 56 Q54 51 56 60" stroke="#B8BEC8" strokeWidth="2.1" strokeLinecap="round" fill="none" />
        </motion.g>
      </motion.g>
      {getFace(state, showSunglasses)}
      <motion.g
        aria-hidden="true"
        className="mimo-cheer-spark"
        style={{ transformOrigin: '100px 76px', transformBox: 'view-box' }}
        {...cheerMotion}
      >
        <path d="M53 75 L56 69 L59 75 L65 78 L59 81 L56 87 L53 81 L47 78 Z" fill="#FFD700" opacity="0.86" />
        <path d="M143 75 L146 69 L149 75 L155 78 L149 81 L146 87 L143 81 L137 78 Z" fill="#1CB0F6" opacity="0.8" />
      </motion.g>
      <path d="M30 98 Q47 96 58 101 M30 109 Q47 109 58 109" stroke="#B8BEC8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M170 98 Q153 96 142 101 M170 109 Q153 109 142 109" stroke="#B8BEC8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M70 138 Q100 148 130 138 L128 145 Q100 154 72 145 Z" fill="url(#mimo-collar)" stroke="#E8763D" strokeWidth="1.5" opacity="0.95" />
      <path d="M75 141 Q100 150 125 141" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <circle cx="100" cy="149" r="10" fill="url(#mimo-bell)" stroke="#E8AE3D" strokeWidth="2" />
      <path d="M94 149 L106 149 M100 145 L100 153" stroke="#E8AE3D" strokeWidth="1.8" strokeLinecap="round" />
      <g transform="translate(100, 38)">
        <ellipse cx="0" cy="8" rx="40" ry="15" fill="url(#mimo-navy)" stroke="#1A365D" strokeWidth="2" />
        <path d="M-44 -2 L44 -2 L40 14 L-40 14 Z" fill="url(#mimo-navy)" stroke="#1A365D" strokeWidth="2" strokeLinejoin="round" />
        <path d="M-40 3 L40 3" stroke="url(#mimo-gold)" strokeWidth="4" strokeLinecap="round" />
        <path d="M0 -2 L2 4 L8 4 L3 7 L5 13 L0 9 L-5 13 L-3 7 L-8 4 L-2 4 Z" fill="url(#mimo-gold)" stroke="#D69E2E" strokeWidth="1" />
        <circle cx="0" cy="2" r="5" fill="url(#mimo-gold)" stroke="#D69E2E" strokeWidth="1.5" />
        <path d="M0 2 Q18 25 15 40" stroke="url(#mimo-gold)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M15 40 L10 52 M15 40 L12 52 M15 40 L15 52 M15 40 L18 52 M15 40 L20 52" stroke="url(#mimo-gold)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="15" cy="40" r="4" fill="url(#mimo-gold)" stroke="#D69E2E" strokeWidth="1" />
      </g>
        </motion.svg>
      </motion.div>
    </div>
  );
};
