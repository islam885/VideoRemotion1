import React from 'react';
import { Composition } from 'remotion';
import { LiquidGlassVideo } from './LiquidGlassVideo';
import { defaultVideoConfig } from './config/videoConfig';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="LiquidGlassPromo"
        component={LiquidGlassVideo}
        durationInFrames={1200} // 20 seconds at 60fps
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          config: defaultVideoConfig,
        }}
      />
    </>
  );
};
