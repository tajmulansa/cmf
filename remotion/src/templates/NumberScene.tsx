import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import type {SceneProps} from '../types';

// Big counter that counts up to the value, with its unit underneath.
export const NumberScene: React.FC<{scene: SceneProps}> = ({scene}) => {
  const frame = useCurrentFrame();
  const value: number = Number(scene.params.value ?? 0);
  const unit: string = scene.params.unit ?? '';
  const p = interpolate(frame, [0, 60], [0, 1], {extrapolateRight: 'clamp'});
  const ease = 1 - Math.pow(1 - p, 3);
  const decimals = Number.isInteger(value) ? 0 : 1;
  const shown = (value * ease).toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  const size = Math.min(330, Math.floor(980 / (shown.length * 0.62)));
  const line = interpolate(frame, [30, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{marginTop: -200, textAlign: 'center'}}>
        <div style={{fontSize: size, fontWeight: 700, color: C.amber, lineHeight: 1.05}}>{shown}</div>
        <div style={{fontSize: 70, fontWeight: 500, marginTop: 10}}>{unit}</div>
        <div
          style={{
            height: 10,
            borderRadius: 5,
            background: C.amber,
            width: 600 * line,
            margin: '40px auto 0',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
