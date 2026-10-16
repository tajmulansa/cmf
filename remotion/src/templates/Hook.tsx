import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C} from '../theme';
import type {SceneProps} from '../types';

// Opening line: big kinetic text, up to 3 stacked lines, last line in amber.
function splitLines(text: string, maxLines = 3): string[] {
  const words = text.replace(/[.!?]+$/, '').toUpperCase().split(/\s+/);
  const n = Math.min(maxLines, Math.max(1, Math.ceil(words.length / 2)));
  const per = Math.ceil(words.length / n);
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += per) lines.push(words.slice(i, i + per).join(' '));
  return lines;
}

export const Hook: React.FC<{scene: SceneProps}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = splitLines(scene.text);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      {[0, 1, 2].map((k) => {
        const p = interpolate(frame, [k * 3, k * 3 + 40], [0, 1], {extrapolateRight: 'clamp'});
        const r = 80 + 700 * (1 - Math.pow(1 - p, 3));
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              border: `4px solid ${C.amber}`,
              opacity: 0.5 * (1 - p),
            }}
          />
        );
      })}
      <div style={{textAlign: 'center', width: 960, marginTop: -120}}>
        {lines.map((l, i) => {
          const s = spring({frame: frame - i * 12, fps, config: {damping: 12}});
          const size = Math.min(190, Math.floor(960 / (l.length * 0.68)));
          return (
            <div
              key={i}
              style={{
                fontSize: size,
                fontWeight: 700,
                lineHeight: 1.15,
                color: i === lines.length - 1 && lines.length > 1 ? C.amber : C.white,
                transform: `scale(${0.7 + 0.3 * s})`,
                opacity: Math.min(1, s * 1.5),
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
