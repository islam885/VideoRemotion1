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
        durationInFrames={2100} // 35.0 seconds at 60fps
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
