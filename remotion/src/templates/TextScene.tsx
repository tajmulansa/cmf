import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import type {SceneProps} from '../types';

// Fallback / general statement: the key phrase on a card. Used when nothing more specific fits.
export const TextScene: React.FC<{scene: SceneProps}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14}});
  const words = scene.text.replace(/[.!?]+$/, '').split(/\s+/);
  const headline = words.length > 6 ? words.slice(0, 6).join(' ') + '…' : words.join(' ');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: 900,
          padding: '70px 60px',
          marginTop: -260,
          borderRadius: 56,
          background: C.panel,
          border: `4px solid ${C.amber}`,
          textAlign: 'center',
          fontSize: 92,
          fontWeight: 700,
          lineHeight: 1.2,
          transform: `translateY(${(1 - s) * 60}px) scale(${0.92 + 0.08 * s})`,
          opacity: Math.min(1, s * 1.4),
        }}
      >
        {headline}
      </div>
    </AbsoluteFill>
  );
};
