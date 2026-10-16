import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import type {VideoProps} from './types';

const defaultProps: VideoProps = {fps: 30, scenes: []};

export const Root: React.FC = () => (
  <Composition
    id="Short"
    component={Video}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={90}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => ({
      durationInFrames: Math.max(30, (props as VideoProps).scenes.reduce((a, s) => a + s.durationInFrames, 0)),
    })}
  />
);
