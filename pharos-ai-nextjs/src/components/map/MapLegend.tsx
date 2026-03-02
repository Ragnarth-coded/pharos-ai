'use client';

type LegendItem = { shape: 'rect' | 'circle' | 'zone'; color: string; label: string };

const ITEMS: LegendItem[] = [
  { shape: 'rect',   color: 'var(--blue)',    label: 'US STRIKE TRACK'    },
  { shape: 'rect',   color: 'var(--teal)',    label: 'IDF STRIKE TRACK'   },
  { shape: 'rect',   color: 'var(--teal)',    label: 'NAVAL STRIKE'       },
  { shape: 'rect',   color: 'var(--danger)',  label: 'HOSTILE MISSILE'    },
  { shape: 'rect',   color: 'var(--warning)', label: 'INTERCEPTED'        },
  { shape: 'circle', color: 'var(--danger)',  label: 'DESTROYED TARGET'   },
  { shape: 'circle', color: 'var(--warning)', label: 'DAMAGED TARGET'     },
  { shape: 'circle', color: 'var(--success)', label: 'ACTIVE / TARGETED'  },
  { shape: 'circle', color: 'var(--blue)',    label: 'US ASSET'           },
  { shape: 'circle', color: 'var(--teal)',    label: 'IDF ASSET'          },
  { shape: 'circle', color: 'var(--cyber)',   label: 'NATO ASSET'         },
  { shape: 'zone',   color: 'var(--danger)',  label: 'CLOSURE ZONE'       },
  { shape: 'zone',   color: 'var(--warning)', label: 'PATROL / NFZ'       },
];

type Props = { hasPanel: boolean };

export default function MapLegend({ hasPanel }: Props) {
  return (
    <div style={{
      position:      'absolute',
      bottom:        56,
      left:          12,
      background:    'rgba(28,33,39,0.92)',
      border:        '1px solid var(--bd)',
      borderRadius:  2,
      padding:       '10px 12px',
      pointerEvents: 'none',
      transition:    'opacity 0.2s',
      opacity:       hasPanel ? 0.4 : 1,
    }}>
      <p className="label" style={{ color: 'var(--t4)', marginBottom: 6 }}>LEGEND</p>
      {ITEMS.map(({ shape, color, label }) => (
        <div key={label} className="flex items-center gap-1.5" style={{ marginBottom: 3, fontSize: 9, color: 'var(--t3)' }}>
          {shape === 'rect'   && <div style={{ width: 12, height: 3,  background: color, flexShrink: 0 }} />}
          {shape === 'circle' && <div style={{ width: 8,  height: 8,  borderRadius: '50%', background: color, flexShrink: 0 }} />}
          {shape === 'zone'   && <div style={{ width: 10, height: 8,  background: `color-mix(in srgb, ${color} 30%, transparent)`, border: `1px solid ${color}`, flexShrink: 0 }} />}
          {label}
        </div>
      ))}
    </div>
  );
}
