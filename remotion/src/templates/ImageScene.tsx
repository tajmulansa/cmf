import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import type {SceneProps} from '../types';

// Stock photo with a slow Ken Burns zoom, rounded frame, credit line.
export const ImageScene: React.FC<{scene: SceneProps}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.15]);
  const enter = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  const src: string | undefined = scene.params.src;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: 900,
          height: 720,
          marginTop: -260,
          borderRadius: 46,
          overflow: 'hidden',
          border: `3px solid ${C.ice}55`,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 40}px)`,
        }}
      >
        {src ? (
          <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
        ) : null}
      </div>
      {scene.params.credit ? (
        <div style={{position: 'absolute', top: 1190, width: 900, fontSize: 24, color: C.muted, textAlign: 'right', fontWeight: 500}}>
          {scene.params.credit}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
