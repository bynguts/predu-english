import React, { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from 'framer-motion';
import type { MascotState } from '../store';

interface MascotProps {
  state: MascotState;
  speechText?: string | null;
  className?: string;
  showSunglasses?: boolean;
}

type Mood = MascotState;

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

const confettiBlocks = [
  { x: -56, y: -82, r: -22, c: '#1CB0F6', d: 0 },
  { x: -34, y: -112, r: 18, c: '#FFD700', d: 0.05 },
  { x: 0, y: -128, r: 45, c: '#FF8C42', d: 0.1 },
  { x: 34, y: -110, r: -34, c: '#A570FF', d: 0.14 },
  { x: 58, y: -78, r: 28, c: '#58CC02', d: 0.18 },
  { x: -76, y: -34, r: 12, c: '#FF4B4B', d: 0.22 },
  { x: 78, y: -30, r: -18, c: '#1CB0F6', d: 0.26 },
  { x: -18, y: -58, r: -42, c: '#FFC700', d: 0.3 }
];

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
    <radialGradient id="mimo-cheekBlush" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFA500" stopOpacity="0.7" />
      <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="president-navy" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#2C5282" />
      <stop offset="100%" stopColor="#1E3A8A" />
    </linearGradient>
    <linearGradient id="president-gold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFE066" />
      <stop offset="50%" stopColor="#FFD700" />
      <stop offset="100%" stopColor="#F6AD55" />
    </linearGradient>
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

const useCursorEye = (active: boolean, reducedMotion: boolean) => {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 210, damping: 24, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 210, damping: 24, mass: 0.35 });

  useEffect(() => {
    if (!active || reducedMotion) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      const dx = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const dy = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      rawX.set(Math.max(-5, Math.min(5, dx * 5)));
      rawY.set(Math.max(-4, Math.min(4, dy * 4)));
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [active, rawX, rawY, reducedMotion]);

  return { x, y };
};

const getRootMotion = (state: Mood, reducedMotion: boolean) => {
  if (reducedMotion) return { animate: { y: 0, rotate: 0, scale: 1 }, transition: { duration: 0 } };
  if (state === 'achievement') {
    return {
      animate: {
        y: [0, -32, -6, -18, 0],
        rotate: [0, 16, 360, 374, 360],
        scale: [1, 1.3, 1.16, 1.24, 1.15]
      },
      transition: { duration: 1.35, ease: easeOutQuint }
    };
  }
  if (state === 'happy') {
    return {
      animate: {
        y: [0, -34, 4, -10, 0],
        rotate: [0, -8, 6, -3, 0],
        scale: [1, 1.12, 0.96, 1.04, 1]
      },
      transition: { duration: 0.76, repeat: Infinity, repeatDelay: 0.55, ease: easeOutQuint }
    };
  }
  if (state === 'sad') {
    return {
      animate: { y: [0, 6, 4], rotate: [0, -4, 4, -3, 2, 0], scale: 0.98 },
      transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1.1, ease: 'easeInOut' as const }
    };
  }
  if (state === 'talking') {
    return {
      animate: { y: [0, -3, 0], rotate: [0, -0.8, 0.8, 0], scale: [1, 1.01, 1] },
      transition: { duration: 1.55, repeat: Infinity, ease: 'easeInOut' as const }
    };
  }
  return {
    animate: { y: [0, -5, 0], rotate: [0, -0.8, 0.6, 0], scale: [1, 1.008, 1] },
    transition: { duration: 2.7, repeat: Infinity, ease: 'easeInOut' as const }
  };
};

const getBodyMotion = (state: Mood, reducedMotion: boolean) => {
  if (reducedMotion) return { animate: { scaleX: 1, scaleY: 1 }, transition: { duration: 0 } };
  if (state === 'achievement') {
    return {
      animate: { scaleX: [1, 0.88, 1.16, 0.98, 1.06, 1], scaleY: [1, 1.18, 0.84, 1.06, 0.96, 1] },
      transition: { duration: 1.15, ease: easeOutQuint }
    };
  }
  if (state === 'happy') {
    return {
      animate: { scaleX: [1, 0.94, 1.12, 0.98, 1], scaleY: [1, 1.08, 0.86, 1.04, 1] },
      transition: { duration: 0.76, repeat: Infinity, repeatDelay: 0.55, ease: easeOutQuint }
    };
  }
  if (state === 'sad') {
    return { animate: { scaleX: 1.03, scaleY: 0.94 }, transition: { type: 'spring' as const, stiffness: 180, damping: 18 } };
  }
  return {
    animate: { scaleX: [1, 1.015, 1], scaleY: [1, 0.986, 1] },
    transition: { duration: state === 'talking' ? 1.3 : 2.8, repeat: Infinity, ease: 'easeInOut' as const }
  };
};

const getEarMotion = (side: 'left' | 'right', state: Mood, reducedMotion: boolean) => {
  if (reducedMotion) return { animate: { rotate: 0, y: 0 }, transition: { duration: 0 } };
  const direction = side === 'left' ? -1 : 1;
  if (state === 'sad') {
    return { animate: { rotate: direction * 14, y: 7 }, transition: { type: 'spring' as const, stiffness: 120, damping: 15 } };
  }
  if (state === 'happy' || state === 'achievement') {
    return {
      animate: { rotate: [0, direction * -8, direction * 6, 0], y: [0, -3, 1, 0] },
      transition: { duration: 0.8, repeat: Infinity, repeatDelay: 0.6, ease: easeOutQuint }
    };
  }
  return {
    animate: { rotate: [0, direction * 2, direction * -4, 0], y: [0, -1, 0, 0] },
    transition: { duration: state === 'talking' ? 1.8 : 3.3, repeat: Infinity, ease: 'easeInOut' as const }
  };
};

const getTailMotion = (state: Mood, reducedMotion: boolean) => {
  if (reducedMotion) return { animate: { rotate: 0 }, transition: { duration: 0 } };
  if (state === 'happy' || state === 'achievement') {
    return {
      animate: { rotate: [0, 14, -12, 10, 0] },
      transition: { duration: 0.72, repeat: Infinity, ease: easeOutQuint }
    };
  }
  if (state === 'sad') {
    return { animate: { rotate: -10, y: 3 }, transition: { type: 'spring' as const, stiffness: 120, damping: 18 } };
  }
  return {
    animate: { rotate: [0, 3, -2, 0] },
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const }
  };
};

const EyePair = ({
  state,
  lookX,
  lookY
}: {
  state: Mood;
  lookX: ReturnType<typeof useSpring>;
  lookY: ReturnType<typeof useSpring>;
}) => {
  const thinkingX = state === 'talking' ? -3 : 0;
  const thinkingY = state === 'talking' ? -4 : 0;
  const eyeX = state === 'idle' ? lookX : thinkingX;
  const eyeY = state === 'idle' ? lookY : thinkingY;
  const blinkScale = state === 'sad' ? 0.88 : 1;

  return (
    <g>
      <motion.g
        style={{ transformOrigin: '75px 95px', transformBox: 'view-box' }}
        animate={{ scaleY: [1, 1, 0.12, 1] }}
        transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.9, 0.925, 0.955], ease: 'easeInOut' }}
      >
        <ellipse cx="75" cy="95" rx="17" ry="20" fill="url(#mimo-eyeShine)" />
        <ellipse cx="75" cy="95" rx="17" ry="20" fill="none" stroke="#2B7A91" strokeWidth="1.5" />
        <motion.g style={{ x: eyeX, y: eyeY }}>
          <ellipse cx="77" cy="99" rx="10" ry="12" fill="#1E5266" opacity="0.85" transform={`scale(1 ${blinkScale})`} />
          <ellipse cx="81" cy="86" rx="6" ry="7" fill="#FFFFFF" opacity="0.95" />
          <circle cx="70" cy="102" r="3" fill="#FFFFFF" opacity="0.85" />
          <circle cx="82" cy="105" r="1.5" fill="#FFFFFF" opacity="0.9" />
        </motion.g>
      </motion.g>
      <motion.g
        style={{ transformOrigin: '125px 95px', transformBox: 'view-box' }}
        animate={{ scaleY: [1, 1, 0.12, 1] }}
        transition={{ duration: 4.2, repeat: Infinity, delay: 0.02, times: [0, 0.9, 0.925, 0.955], ease: 'easeInOut' }}
      >
        <ellipse cx="125" cy="95" rx="17" ry="20" fill="url(#mimo-eyeShine)" />
        <ellipse cx="125" cy="95" rx="17" ry="20" fill="none" stroke="#2B7A91" strokeWidth="1.5" />
        <motion.g style={{ x: eyeX, y: eyeY }}>
          <ellipse cx="123" cy="99" rx="10" ry="12" fill="#1E5266" opacity="0.85" transform={`scale(1 ${blinkScale})`} />
          <ellipse cx="119" cy="86" rx="6" ry="7" fill="#FFFFFF" opacity="0.95" />
          <circle cx="130" cy="102" r="3" fill="#FFFFFF" opacity="0.85" />
          <circle cx="118" cy="105" r="1.5" fill="#FFFFFF" opacity="0.9" />
        </motion.g>
      </motion.g>
    </g>
  );
};

const Face = ({
  state,
  showSunglasses,
  lookX,
  lookY
}: {
  state: Mood;
  showSunglasses: boolean;
  lookX: ReturnType<typeof useSpring>;
  lookY: ReturnType<typeof useSpring>;
}) => {
  if (state === 'happy' || state === 'achievement') {
    return (
      <>
        <ellipse cx="58" cy="106" rx="15" ry="11" fill="url(#mimo-cheekBlush)" />
        <ellipse cx="142" cy="106" rx="15" ry="11" fill="url(#mimo-cheekBlush)" />
        <path d="M62 94 Q76 78 90 94" fill="none" stroke="#3A3F4B" strokeWidth="5" strokeLinecap="round" />
        <path d="M110 94 Q124 78 138 94" fill="none" stroke="#3A3F4B" strokeWidth="5" strokeLinecap="round" />
        <path d="M93 110 Q100 106 107 110 Q103 116 100 117 Q97 116 93 110 Z" fill="#FF9E92" />
        <motion.path
          d="M80 116 Q100 140 120 116 Q110 130 100 130 Q90 130 80 116 Z"
          fill="#C76B5D"
          animate={{ scaleY: [1, 1.2, 0.92, 1] }}
          transition={{ duration: 0.62, repeat: Infinity, repeatDelay: 0.3, ease: easeOutQuint }}
          style={{ transformOrigin: '100px 123px', transformBox: 'view-box' }}
        />
        <path d="M80 116 Q100 140 120 116" fill="none" stroke="#7A7F8C" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="100" cy="122" rx="7" ry="4" fill="#FF8A7D" />
        <motion.g
          opacity="0.86"
          animate={{ scale: [0.7, 1.2, 0.92], opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.35, ease: easeOutQuint }}
          style={{ transformOrigin: '100px 76px', transformBox: 'view-box' }}
        >
          <path d="M40 60 L45 55 L43 65 L48 62" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M160 60 L155 55 L157 65 L152 62" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M52 76 L56 68 L60 76 L68 80 L60 84 L56 92 L52 84 L44 80 Z" fill="#FFD700" />
          <path d="M140 76 L144 68 L148 76 L156 80 L148 84 L144 92 L140 84 L132 80 Z" fill="#1CB0F6" />
        </motion.g>
        {showSunglasses && (
          <motion.g initial={{ opacity: 0, y: 7, scale: 0.88 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.22, ease: easeOutQuint }}>
            <ellipse cx="75" cy="95" rx="20" ry="15" fill="#1A202C" stroke="#2D3748" strokeWidth="2" />
            <ellipse cx="125" cy="95" rx="20" ry="15" fill="#1A202C" stroke="#2D3748" strokeWidth="2" />
            <path d="M95 95 L105 95" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />
            <path d="M65 88 L70 88 M115 88 L120 88" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          </motion.g>
        )}
      </>
    );
  }

  if (state === 'sad') {
    return (
      <>
        <EyePair state={state} lookX={lookX} lookY={lookY} />
        <path d="M64 80 Q76 84 86 80" fill="none" stroke="#C9CDD4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M114 80 Q124 84 136 80" fill="none" stroke="#C9CDD4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <motion.path
          d="M64 105 Q60 115 64 120 Q68 115 64 105 Z"
          fill="#9FE8F5"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.82, 0], y: [0, 14, 26] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.55, ease: 'easeInOut' }}
        />
        <path d="M93 116 Q100 112 107 116 Q103 122 100 123 Q97 122 93 116 Z" fill="#FF9E92" />
        <path d="M88 128 Q100 119 112 128" stroke="#7A7F8C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </>
    );
  }

  if (state === 'talking') {
    return (
      <>
        <ellipse cx="58" cy="110" rx="14" ry="10" fill="url(#mimo-cheekBlush)" opacity="0.72" />
        <ellipse cx="142" cy="110" rx="14" ry="10" fill="url(#mimo-cheekBlush)" opacity="0.72" />
        <EyePair state={state} lookX={lookX} lookY={lookY} />
        <path d="M108 76 Q124 68 138 75" fill="none" stroke="#C9CDD4" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M93 116 Q100 112 107 116 Q103 122 100 123 Q97 122 93 116 Z" fill="#FF9E92" />
        <motion.g
          style={{ transformOrigin: '100px 126px', transformBox: 'view-box' }}
          animate={{ scaleY: [0.82, 1.28, 0.82] }}
          transition={{ duration: 0.72, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx="100" cy="126" rx="7" ry="5" fill="#7A7F8C" />
        </motion.g>
        <motion.g
          opacity="0.78"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.7, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '158px 18px', transformBox: 'view-box' }}
        >
          <circle cx="148" cy="28" r="3.5" fill="#C9CDD4" />
          <circle cx="158" cy="18" r="2.5" fill="#C9CDD4" />
          <circle cx="166" cy="9" r="1.7" fill="#C9CDD4" />
        </motion.g>
        <motion.g
          transform="translate(170, 5)"
          animate={{ scale: [0.82, 1.16, 0.82], opacity: [0.58, 1, 0.58] }}
          transition={{ duration: 1.45, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="0" cy="0" r="4" fill="#FFD700" />
          <path d="M0 -4 L0 -6 M-3 -3 L-4 -4 M3 -3 L4 -4" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" />
        </motion.g>
      </>
    );
  }

  return (
    <>
      <ellipse cx="58" cy="111" rx="14" ry="10" fill="url(#mimo-cheekBlush)" />
      <ellipse cx="142" cy="111" rx="14" ry="10" fill="url(#mimo-cheekBlush)" />
      <EyePair state={state} lookX={lookX} lookY={lookY} />
      <path d="M93 117 Q100 113 107 117 Q103 123 100 124 Q97 123 93 117 Z" fill="#FF9E92" />
      <motion.path
        d="M89 122 Q95 130 100 130 Q106 131 113 121"
        stroke="#7A7F8C"
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="none"
        animate={{ pathLength: [0.72, 1, 0.72] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
};

export const Mascot: React.FC<MascotProps> = ({ state, speechText, className = '', showSunglasses = true }) => {
  const reducedMotion = Boolean(useReducedMotion());
  const eye = useCursorEye(state === 'idle', reducedMotion);
  const rootMotion = getRootMotion(state, reducedMotion);
  const bodyMotion = getBodyMotion(state, reducedMotion);
  const tailMotion = getTailMotion(state, reducedMotion);
  const leftEarMotion = getEarMotion('left', state, reducedMotion);
  const rightEarMotion = getEarMotion('right', state, reducedMotion);
  const bellRotate = useTransform(eye.x, [-5, 5], [-4, 4]);

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
        animate={reducedMotion ? { opacity: 0.72 } : { opacity: [0.5, 0.84, 0.5], scale: [0.94, 1.08, 0.94] }}
        transition={{ duration: state === 'achievement' ? 1.1 : 2.6, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
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
          aria-label={`Mimo, maskot Predu EngKids sedang ${state}`}
          {...rootMotion}
        >
          <MimoDefs />
          {state === 'achievement' && !reducedMotion && (
            <g aria-hidden="true">
              {confettiBlocks.map((piece, index) => (
                <motion.rect
                  key={`${piece.c}-${index}`}
                  x="96"
                  y="82"
                  width="7"
                  height="10"
                  rx="2"
                  fill={piece.c}
                  initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.4 }}
                  animate={{ opacity: [0, 1, 0], x: [0, piece.x], y: [0, piece.y], rotate: [0, piece.r], scale: [0.4, 1, 0.8] }}
                  transition={{ duration: 1.2, delay: piece.d, repeat: Infinity, repeatDelay: 0.7, ease: easeOutQuint }}
                />
              ))}
            </g>
          )}
          <motion.ellipse
            cx="100"
            cy="193"
            rx="48"
            ry="7"
            fill="#000000"
            opacity="0.1"
            animate={reducedMotion ? undefined : { scaleX: state === 'happy' || state === 'achievement' ? [1, 0.72, 1.12, 1] : [1, 0.96, 1] }}
            transition={{ duration: state === 'happy' || state === 'achievement' ? 0.76 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 193px', transformBox: 'view-box' }}
          />
          <motion.g style={{ transformOrigin: '100px 193px', transformBox: 'view-box' }} {...bodyMotion}>
            <motion.g style={{ transformOrigin: '145px 154px', transformBox: 'view-box' }} {...tailMotion}>
              <path d="M132 190 Q168 190 178 164 Q188 138 178 114 Q172 98 156 96 Q148 95 144 101 Q158 102 166 118 Q172 134 164 152 Q156 170 138 184 Q135 187 132 190 Z" fill="url(#mimo-furBody)" stroke="#B8BEC8" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M152 100 Q168 108 174 128" stroke="#C9CDD4" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
            </motion.g>
            <ellipse cx="70" cy="178" rx="19" ry="14" fill="url(#mimo-furBody)" stroke="#C3C9D1" strokeWidth="2" />
            <ellipse cx="130" cy="178" rx="19" ry="14" fill="url(#mimo-furBody)" stroke="#C3C9D1" strokeWidth="2" />
            <ellipse cx="100" cy="145" rx="55" ry="48" fill="url(#mimo-furBody)" stroke="#B8BEC8" strokeWidth="2.5" />
            <ellipse cx="100" cy="158" rx="33" ry="31" fill="url(#mimo-bellyFur)" />
            <ellipse cx="78" cy="181" rx="18" ry="15" fill="url(#mimo-bellyFur)" stroke="#C3C9D1" strokeWidth="2" />
            <ellipse cx="122" cy="181" rx="18" ry="15" fill="url(#mimo-bellyFur)" stroke="#C3C9D1" strokeWidth="2" />
            <motion.g style={{ transformOrigin: '70px 52px', transformBox: 'view-box' }} {...leftEarMotion}>
              <path d="M46 58 Q22 18 60 4 Q92 8 86 50 Q66 46 46 58 Z" fill="url(#mimo-furHead)" stroke="#B8BEC8" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M54 48 Q40 22 62 10 Q80 16 76 44 Q64 40 54 48 Z" fill="url(#mimo-earInner)" />
            </motion.g>
            <motion.g style={{ transformOrigin: '130px 52px', transformBox: 'view-box' }} {...rightEarMotion}>
              <path d="M154 58 Q178 18 140 4 Q108 8 114 50 Q134 46 154 58 Z" fill="url(#mimo-furHead)" stroke="#B8BEC8" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M146 48 Q160 22 138 10 Q120 16 124 44 Q136 40 146 48 Z" fill="url(#mimo-earInner)" />
            </motion.g>
            <motion.g
              animate={reducedMotion ? undefined : state === 'sad' ? { y: 4, rotate: [0, -2, 2, -1, 0] } : { y: [0, -1.5, 0] }}
              transition={{ duration: state === 'sad' ? 0.6 : 2.8, repeat: Infinity, repeatDelay: state === 'sad' ? 1.1 : 0, ease: 'easeInOut' }}
              style={{ transformOrigin: '100px 130px', transformBox: 'view-box' }}
            >
              <circle cx="100" cy="96" r="62" fill="url(#mimo-furHead)" stroke="#B8BEC8" strokeWidth="2.5" />
              <path d="M84 48 Q89 39 94 48" stroke="#C9CDD4" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M106 48 Q111 39 116 48" stroke="#C9CDD4" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M97 39 L100 54 L103 39" stroke="#C9CDD4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
              <Face state={state} showSunglasses={showSunglasses} lookX={eye.x} lookY={eye.y} />
              <path d="M30 98 Q47 96 58 101 M30 109 Q47 109 58 109" stroke="#B8BEC8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M170 98 Q153 96 142 101 M170 109 Q153 109 142 109" stroke="#B8BEC8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M70 138 Q100 148 130 138 L128 145 Q100 154 72 145 Z" fill="url(#mimo-collarGrad)" stroke="#E8763D" strokeWidth="1.5" opacity="0.95" />
              <path d="M75 141 Q100 150 125 141" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <motion.g style={{ rotate: bellRotate, transformOrigin: '100px 142px', transformBox: 'view-box' }}>
                <circle cx="100" cy="149" r="10" fill="url(#mimo-bellGrad)" stroke="#E8AE3D" strokeWidth="2" />
                <path d="M94 149 L106 149 M100 145 L100 153" stroke="#E8AE3D" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="100" cy="154" r="2" fill="#B8842A" />
                <circle cx="96" cy="145" r="2.5" fill="#FFFFFF" opacity="0.7" />
              </motion.g>
              <motion.g
                transform="translate(100, 38)"
                animate={reducedMotion ? undefined : { rotate: state === 'achievement' ? [0, -7, 8, 0] : [0, -1.2, 1.2, 0] }}
                transition={{ duration: state === 'achievement' ? 0.8 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 38px', transformBox: 'view-box' }}
              >
                <ellipse cx="0" cy="8" rx="40" ry="15" fill="url(#president-navy)" stroke="#1A365D" strokeWidth="2" />
                <path d="M-44 -2 L44 -2 L40 14 L-40 14 Z" fill="url(#president-navy)" stroke="#1A365D" strokeWidth="2" strokeLinejoin="round" />
                <path d="M-40 3 L40 3" stroke="url(#president-gold)" strokeWidth="4" strokeLinecap="round" />
                <path d="M0 -2 L2 4 L8 4 L3 7 L5 13 L0 9 L-5 13 L-3 7 L-8 4 L-2 4 Z" fill="url(#president-gold)" stroke="#D69E2E" strokeWidth="1" />
                <circle cx="0" cy="2" r="5" fill="url(#president-gold)" stroke="#D69E2E" strokeWidth="1.5" />
                <circle cx="-1" cy="1" r="2" fill="#FFFFFF" opacity="0.5" />
                <motion.g
                  style={{ transformOrigin: '0px 2px', transformBox: 'view-box' }}
                  animate={reducedMotion ? undefined : { rotate: [-10, 10, -10] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path d="M0 2 Q18 25 15 40" stroke="url(#president-gold)" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M15 40 L10 52 M15 40 L12 52 M15 40 L15 52 M15 40 L18 52 M15 40 L20 52" stroke="url(#president-gold)" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <circle cx="15" cy="40" r="4" fill="url(#president-gold)" stroke="#D69E2E" strokeWidth="1" />
                </motion.g>
              </motion.g>
            </motion.g>
          </motion.g>
        </motion.svg>
      </motion.div>
    </div>
  );
};
