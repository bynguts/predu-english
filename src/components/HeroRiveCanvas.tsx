import { useMemo } from 'react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';

interface HeroRiveCanvasProps {
  src: string;
  stateMachine?: string;
}

const HeroRiveCanvas: React.FC<HeroRiveCanvasProps> = ({ src, stateMachine }) => {
  const layout = useMemo(() => new Layout({ fit: Fit.Contain, alignment: Alignment.Center }), []);
  const { RiveComponent } = useRive(
    {
      src,
      stateMachines: stateMachine,
      layout
    },
    {
      shouldResizeCanvasToContainer: true,
      useDevicePixelRatio: true
    }
  );

  return <RiveComponent className="hero-rive-canvas" />;
};

export default HeroRiveCanvas;
