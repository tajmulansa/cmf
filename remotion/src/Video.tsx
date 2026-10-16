import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {C, fontFamily} from './theme';
import type {SceneProps, VideoProps} from './types';
import {Captions} from './Captions';
import {Hook} from './templates/Hook';
import {MapScene} from './templates/MapScene';
import {NumberScene} from './templates/NumberScene';
import {ImageScene} from './templates/ImageScene';
import {TextScene} from './templates/TextScene';

const TEMPLATES: Record<SceneProps['template'], React.FC<{scene: SceneProps}>> = {
  hook: Hook,
  map: MapScene,
  number: NumberScene,
  image: ImageScene,
  text: TextScene,
};

const Background: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.bg}, ${C.bg2})`}}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${C.panel} 2px, transparent 2px)`,
          backgroundSize: '90px 90px',
          backgroundPosition: `0px ${-f * 0.47}px`,
          opacity: 0.8,
        }}
      />
    </AbsoluteFill>
  );
};

export const Video: React.FC<VideoProps> = ({scenes}) => {
  let from = 0;
  return (
    <AbsoluteFill style={{fontFamily, color: C.white}}>
      <Background />
      {scenes.map((scene, i) => {
        const start = from;
        from += scene.durationInFrames;
        const Template = TEMPLATES[scene.template] ?? TextScene;
        return (
          <Sequence key={i} from={start} durationInFrames={scene.durationInFrames}>
            <Template scene={scene} />
            <Captions words={scene.words} />
            {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}
            <SceneFade frames={scene.durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// short fade between scenes (placeholder for proper transitions)
const SceneFade: React.FC<{frames: number}> = ({frames}) => {
  const f = useCurrentFrame();
  const o = Math.max(
    interpolate(f, [0, 5], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(f, [frames - 5, frames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
  return <AbsoluteFill style={{background: C.bg, opacity: o * 0.9}} />;
};
