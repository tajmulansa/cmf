import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {geoCentroid, geoGraticule10, geoOrthographic, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import {C} from '../theme';
import type {SceneProps} from '../types';

// Real country data (Natural Earth via world-atlas). A globe rotates to the target place and highlights it.
const ALIASES: Record<string, string> = {
  usa: 'United States of America',
  us: 'United States of America',
  america: 'United States of America',
  uk: 'United Kingdom',
  britain: 'United Kingdom',
  uae: 'United Arab Emirates',
  russia: 'Russia',
};

const countries: any[] = (feature(world as any, (world as any).objects.countries) as any).features;

function findPlace(name: string): any | null {
  const key = ALIASES[name.toLowerCase()] ?? name;
  return countries.find((c) => (c.properties?.name ?? '').toLowerCase() === key.toLowerCase()) ?? null;
}

export const MapScene: React.FC<{scene: SceneProps}> = ({scene}) => {
  const frame = useCurrentFrame();
  const place: string = scene.params.place ?? '';
  const target = useMemo(() => findPlace(place), [place]);
  const [lon, lat] = target ? geoCentroid(target) : [0, 20];

  const p = interpolate(frame, [0, 45], [0, 1], {extrapolateRight: 'clamp'});
  const ease = 1 - Math.pow(1 - p, 3);
  const proj = geoOrthographic()
    .rotate([-lon + (1 - ease) * 80, -lat + (1 - ease) * 20])
    .scale(430 + 40 * ease)
    .translate([540, 760])
    .clipAngle(90);
  const path = geoPath(proj);
  const sphere = path({type: 'Sphere'} as any) ?? '';
  const grat = path(geoGraticule10()) ?? '';

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={sphere} fill="#0e1736" stroke={C.muted} strokeWidth={2} />
        <path d={grat} fill="none" stroke="#1e2a5a" strokeWidth={1} />
        {countries.map((c, i) => (
          <path
            key={i}
            d={path(c) ?? ''}
            fill={c === target ? C.ice : '#1b2a52'}
            fillOpacity={c === target ? 0.5 + 0.5 * ease : 1}
            stroke={c === target ? C.ice : '#2a3a70'}
            strokeWidth={c === target ? 3 : 1}
          />
        ))}
      </svg>
      {place ? (
        <div
          style={{
            position: 'absolute',
            top: 1180,
            width: '100%',
            textAlign: 'center',
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: 2,
            opacity: ease,
          }}
        >
          {place.toUpperCase()}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
