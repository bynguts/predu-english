import { lazy, Suspense, type ComponentType } from 'react';
import { useReducedMotion } from 'framer-motion';
import mascotRuntimeAnimation from '../assets/mascot-cat-runtime.json';

interface MascotLottieProps {
  className?: string;
}

interface LottiePlayerProps {
  animationData: unknown;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  rendererSettings?: {
    preserveAspectRatio?: string;
  };
}

const LottiePlayer = lazy(async () => {
  const mod = await import('lottie-react');
  const directDefault = mod.default as unknown;
  const nestedDefault = (directDefault as { default?: unknown }).default;
  const component = typeof directDefault === 'function' ? directDefault : nestedDefault;
  return { default: component as ComponentType<LottiePlayerProps> };
});

export const MascotLottie: React.FC<MascotLottieProps> = ({ className = '' }) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={`mascot-lottie ${className}`} aria-label="Alfa, maskot kucing Predu EngKids">
        <img
          className="mascot-lottie-static"
          src="/mascot-lottie/cat-00-idle.svg"
          alt="Alfa, maskot kucing Predu EngKids"
        />
      </div>
    );
  }

  return (
    <div className={`mascot-lottie ${className}`} aria-label="Alfa, maskot kucing Predu EngKids">
      <Suspense
        fallback={
            <img
              className="mascot-lottie-static"
              src="/mascot-lottie/cat-00-idle.svg"
              alt=""
              aria-hidden="true"
            />
        }
      >
        <LottiePlayer
          animationData={mascotRuntimeAnimation}
          autoplay
          loop
          className="mascot-lottie-player"
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
        />
      </Suspense>
    </div>
  );
};
