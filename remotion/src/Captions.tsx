import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SAFE_BOTTOM} from './theme';
import type {Word} from './types';

// Words appear as they are spoken; the word being spoken is highlighted.
export const Captions: React.FC<{words: Word[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let active = -1;
  words.forEach((w, i) => {
    if (t >= w.start) active = i;
  });
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: SAFE_BOTTOM}}>
      <div
        style={{
          width: 900,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 18px',
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.45,
          textAlign: 'center',
        }}
      >
        {words.map((w, i) => {
          const shown = t >= w.start;
          const pop = interpolate(t - w.start, [0, 0.18], [1.12, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <span
              key={i}
              style={{
                opacity: shown ? 1 : 0,
                transform: `scale(${shown ? pop : 1})`,
                color: i === active ? C.amber : C.white,
                display: 'inline-block',
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
