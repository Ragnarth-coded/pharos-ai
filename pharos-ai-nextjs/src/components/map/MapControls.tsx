'use client';

import type { MapViewState } from '@deck.gl/core';

type Props = {
  viewState:     MapViewState;
  mapStyle:      'dark' | 'satellite';
  hasPanel:      boolean;
  onStyleChange: (s: 'dark' | 'satellite') => void;
};

export default function MapControls({ viewState, mapStyle, hasPanel, onStyleChange }: Props) {
  const right = hasPanel ? 332 : 12;

  return (
    <>
      {/* Map style switcher */}
      <div style={{
        position:   'absolute',
        bottom:     86,
        right,
        display:    'flex',
        overflow:   'hidden',
        border:     '1px solid var(--bd)',
        borderRadius: 2,
        zIndex:     10,
        transition: 'right 0.22s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {(['dark', 'satellite'] as const).map((mode, i) => (
          <button
            key={mode}
            onClick={() => onStyleChange(mode)}
            className="mono"
            style={{
              padding:     '4px 10px',
              background:  mapStyle === mode ? 'var(--blue)' : 'rgba(28,33,39,0.92)',
              border:      'none',
              borderRight: i === 0 ? '1px solid var(--bd)' : 'none',
              color:       mapStyle === mode ? 'var(--t1)' : 'var(--t3)',
              fontSize:    8,
              fontWeight:  700,
              cursor:      'pointer',
            }}
          >
            {mode === 'dark' ? 'DARK' : 'SAT'}
          </button>
        ))}
      </div>

      {/* Coordinates */}
      <div
        className="mono"
        style={{
          position:   'absolute',
          bottom:     56,
          right,
          background: 'rgba(28,33,39,0.85)',
          border:     '1px solid var(--bd)',
          padding:    '4px 8px',
          fontSize:   9,
          color:      'var(--t4)',
          pointerEvents: 'none',
          transition: 'right 0.22s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {viewState.latitude.toFixed(2)}°N {viewState.longitude.toFixed(2)}°E
      </div>
    </>
  );
}
