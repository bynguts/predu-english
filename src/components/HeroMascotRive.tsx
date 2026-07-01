import { lazy, Suspense, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface HeroMascotRiveProps {
  className?: string;
}

const RIVE_SRC = '/mascot-rive/alfa.riv';
const RIVE_STATE_MACHINE = 'Hero Mascot';
const HeroRiveCanvas = lazy(() => import('./HeroRiveCanvas'));

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

const AlfaFallback: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const mascotMotion = reducedMotion
    ? { y: 0, rotate: 0, scale: 1 }
    : {
        y: [0, -7, 0, -3, 0],
        rotate: [0, -1.2, 1.2, -0.4, 0],
        scale: [1, 1.018, 1, 1.01, 1]
      };
  const waveMotion = reducedMotion
    ? { rotate: -18 }
    : { rotate: [-16, -45, -20, -42, -18] };
  const eyeMotion = reducedMotion
    ? { scaleY: 1 }
    : { scaleY: [1, 1, 0.12, 1, 1] };

  return (
    <motion.svg
      className="hero-alfa-svg"
      viewBox="0 0 320 320"
      role="img"
      aria-label="Alfa, maskot kucing Predu English"
      initial={false}
      animate={mascotMotion}
      transition={{ duration: 3.4, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="alfa-fur-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="58%" stopColor="#eef3fb" />
          <stop offset="100%" stopColor="#d7e0ec" />
        </linearGradient>
        <linearGradient id="alfa-fur-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6f9ff" />
          <stop offset="100%" stopColor="#c9d5e6" />
        </linearGradient>
        <linearGradient id="alfa-eye-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ce9ff" />
          <stop offset="52%" stopColor="#27b6ea" />
          <stop offset="100%" stopColor="#0f7fb1" />
        </linearGradient>
        <radialGradient id="alfa-cheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9d8f" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#ff9d8f" stopOpacity="0" />
        </radialGradient>
        <filter id="alfa-soft-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="18" stdDeviation="13" floodColor="#1d4ed8" floodOpacity="0.13" />
        </filter>
      </defs>

      <ellipse cx="160" cy="274" rx="92" ry="18" fill="#1d4ed8" opacity="0.12" />

      <motion.g
        filter="url(#alfa-soft-shadow)"
        style={{ transformOrigin: '160px 254px' }}
        transition={{ duration: 3.4, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M205 245 C246 242 268 214 262 174 C258 147 244 131 225 132 C214 133 208 140 210 149 C226 149 236 164 234 184 C232 209 219 228 195 240 Z"
          fill="url(#alfa-fur-shadow)"
          stroke="#b7c1cf"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <ellipse cx="122" cy="246" rx="27" ry="19" fill="url(#alfa-fur-shadow)" stroke="#c0c9d6" strokeWidth="3" />
        <ellipse cx="198" cy="246" rx="27" ry="19" fill="url(#alfa-fur-shadow)" stroke="#c0c9d6" strokeWidth="3" />
        <ellipse cx="160" cy="206" rx="75" ry="62" fill="url(#alfa-fur-shadow)" stroke="#b7c1cf" strokeWidth="3" />
        <ellipse cx="160" cy="222" rx="43" ry="38" fill="#ffffff" opacity="0.92" />

        <g transform="translate(0 6)">
          <path
            d="M89 118 C58 66 106 34 132 81 C119 84 103 96 89 118 Z"
            fill="url(#alfa-fur-body)"
            stroke="#b7c1cf"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M99 105 C80 72 111 52 124 84 C113 89 106 96 99 105 Z" fill="#ffd8c8" />
          <path
            d="M231 118 C262 66 214 34 188 81 C201 84 217 96 231 118 Z"
            fill="url(#alfa-fur-body)"
            stroke="#b7c1cf"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M221 105 C240 72 209 52 196 84 C207 89 214 96 221 105 Z" fill="#ffd8c8" />
        </g>

        <circle cx="160" cy="145" r="78" fill="url(#alfa-fur-body)" stroke="#b7c1cf" strokeWidth="3" />
        <path
          d="M140 92 C145 82 151 84 153 95 M167 95 C169 84 175 82 180 92 M154 84 L160 102 L166 84"
          stroke="#c4cbd6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <motion.g
          className="hero-alfa-wave-arm"
          style={{ transformOrigin: '102px 197px', transformBox: 'view-box' }}
          animate={waveMotion}
          transition={{
            duration: 2.15,
            repeat: reducedMotion ? 0 : Infinity,
            ease: easeOutQuint,
            repeatDelay: 0.75
          }}
        >
          <path
            d="M109 203 C76 179 66 148 78 128 C86 115 99 115 105 126 C96 137 98 158 116 180 C123 188 127 196 124 204 Z"
            fill="url(#alfa-fur-shadow)"
            stroke="#b7c1cf"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="82" cy="127" rx="22" ry="18" fill="#ffffff" stroke="#b7c1cf" strokeWidth="3" />
          <path
            d="M67 124 C72 115 78 118 80 126 M82 119 C89 109 95 116 93 127 M97 127 C106 123 110 131 103 137"
            stroke="#b7c1cf"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M61 103 C51 112 49 127 55 138" stroke="#1cb0f6" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M48 94 C35 111 33 132 42 149" stroke="#ffd24a" strokeWidth="4" strokeLinecap="round" fill="none" />
        </motion.g>

        <path
          d="M209 204 C237 190 243 163 234 145 C228 134 217 133 210 142 C216 154 210 175 190 190 Z"
          fill="url(#alfa-fur-shadow)"
          stroke="#b7c1cf"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <ellipse cx="102" cy="159" rx="19" ry="13" fill="url(#alfa-cheek)" />
        <ellipse cx="218" cy="159" rx="19" ry="13" fill="url(#alfa-cheek)" />
        <motion.g
          style={{ transformOrigin: '160px 142px', transformBox: 'view-box' }}
          animate={eyeMotion}
          transition={{ duration: 4.2, repeat: reducedMotion ? 0 : Infinity, times: [0, 0.88, 0.91, 0.94, 1] }}
        >
          <ellipse cx="128" cy="140" rx="22" ry="27" fill="url(#alfa-eye-blue)" stroke="#217a9b" strokeWidth="2" />
          <ellipse cx="192" cy="140" rx="22" ry="27" fill="url(#alfa-eye-blue)" stroke="#217a9b" strokeWidth="2" />
          <ellipse cx="134" cy="132" rx="8" ry="10" fill="#ffffff" opacity="0.96" />
          <ellipse cx="186" cy="132" rx="8" ry="10" fill="#ffffff" opacity="0.96" />
          <circle cx="121" cy="151" r="5" fill="#ffffff" opacity="0.82" />
          <circle cx="199" cy="151" r="5" fill="#ffffff" opacity="0.82" />
        </motion.g>
        <path d="M150 169 C157 164 163 164 170 169 C166 177 160 179 150 169 Z" fill="#ff9388" />
        <path d="M139 181 C151 194 169 194 181 181" stroke="#7d8592" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path
          d="M55 150 C80 145 97 149 111 156 M54 166 C80 164 97 164 111 165 M209 156 C223 149 240 145 265 150 M209 165 C223 164 240 164 266 166"
          stroke="#b7c1cf"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M114 205 C142 221 178 221 206 205 L202 216 C177 230 143 230 118 216 Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
        <circle cx="160" cy="222" r="12" fill="#ffd85a" stroke="#e8ac31" strokeWidth="3" />
        <path d="M153 222 H167 M160 216 V228" stroke="#b9851e" strokeWidth="2" strokeLinecap="round" />

        <g opacity="0.9">
          <path d="M91 111 L96 101 L101 111 L111 116 L101 121 L96 131 L91 121 L81 116 Z" fill="#ffd24a" />
          <path d="M219 111 L224 101 L229 111 L239 116 L229 121 L224 131 L219 121 L209 116 Z" fill="#1cb0f6" />
        </g>
      </motion.g>
    </motion.svg>
  );
};

export const HeroMascotRive: React.FC<HeroMascotRiveProps> = ({ className = '' }) => {
  const [riveReady, setRiveReady] = useState(false);
  const [riveChecked, setRiveChecked] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let alive = true;

    fetch(RIVE_SRC, { cache: 'no-store' })
      .then((response) => {
        if (!alive) return;
        const contentType = response.headers.get('content-type') ?? '';
        setRiveReady(response.ok && !contentType.includes('text/html'));
      })
      .catch(() => {
        if (!alive) return;
        setRiveReady(false);
      })
      .finally(() => {
        if (!alive) return;
        setRiveChecked(true);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className={`hero-rive-mascot ${className}`} aria-label="Alfa, maskot kucing Predu English">
      {riveReady ? (
        <Suspense fallback={<AlfaFallback />}>
          <HeroRiveCanvas
            src={RIVE_SRC}
            stateMachine={reducedMotion ? undefined : RIVE_STATE_MACHINE}
          />
        </Suspense>
      ) : (
        <AlfaFallback />
      )}
      {!riveChecked && <span className="sr-only">Loading Alfa mascot</span>}
    </div>
  );
};
