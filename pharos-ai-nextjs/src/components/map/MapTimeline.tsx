'use client';

import { useRef, useState, useCallback, useMemo, useEffect } from 'react';

import { STRIKE_ARCS, MISSILE_TRACKS, TARGETS, ALLIED_ASSETS, THREAT_ZONES } from '@/data/mapData';

// ─── Types ──────────────────────────────────────────────────────────────────────

type Props = {
  timeExtent:  [number, number];
  timeRange:   [number, number] | null;
  onTimeRange: (range: [number, number] | null) => void;
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

const ALL_RECORDS = [...STRIKE_ARCS, ...MISSILE_TRACKS, ...TARGETS, ...ALLIED_ASSETS, ...THREAT_ZONES];
const BUCKETS = 60;

function fmtLabel(ms: number) {
  const d = new Date(ms);
  const mon = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  return `${mon} ${d.getUTCDate()} ${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function MapTimeline({ timeExtent, timeRange, onTimeRange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'left' | 'right' | 'range' | null>(null);
  const dragRef = useRef<{ startX: number; startRange: [number, number] } | null>(null);
  const didDragRef = useRef(false);

  const [tMin, tMax] = timeExtent;
  const span = tMax - tMin;
  const rng = timeRange ?? timeExtent;

  // Histogram
  const histogram = useMemo(() => {
    const b = new Array(BUCKETS).fill(0);
    const step = span / BUCKETS;
    for (const r of ALL_RECORDS) {
      const t = new Date(r.timestamp).getTime();
      const i = Math.min(BUCKETS - 1, Math.max(0, Math.floor((t - tMin) / step)));
      b[i]++;
    }
    const mx = Math.max(1, ...b);
    return b.map(v => v / mx);
  }, [tMin, span]);

  // Day ticks
  const dayTicks = useMemo(() => {
    const ticks: { label: string; pct: number }[] = [];
    const start = new Date(tMin);
    start.setUTCHours(0, 0, 0, 0);
    let d = start.getTime();
    while (d <= tMax + 86400000) {
      const pct = ((d - tMin) / span) * 100;
      if (pct >= -5 && pct <= 105) ticks.push({ label: fmtLabel(d).split(' ').slice(0, 2).join(' '), pct: Math.max(0, Math.min(100, pct)) });
      d += 86400000;
    }
    return ticks;
  }, [tMin, tMax, span]);

  const toPct = (ms: number) => ((ms - tMin) / span) * 100;
  const toMs = useCallback((clientX: number) => {
    if (!trackRef.current) return tMin;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    return tMin + (pct / 100) * span;
  }, [tMin, span]);

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: 'left' | 'right' | 'range') => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(handle);
    dragRef.current = { startX: e.clientX, startRange: [rng[0], rng[1]] };
    didDragRef.current = false;
  }, [rng]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      didDragRef.current = true;
      const ms = toMs(e.clientX);
      if (dragging === 'left') {
        onTimeRange([Math.min(ms, rng[1] - span * 0.01), rng[1]]);
      } else if (dragging === 'right') {
        onTimeRange([rng[0], Math.max(ms, rng[0] + span * 0.01)]);
      } else if (dragging === 'range' && dragRef.current) {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect) return;
        const dMs = ((e.clientX - dragRef.current.startX) / rect.width) * span;
        let nL = dragRef.current.startRange[0] + dMs;
        let nR = dragRef.current.startRange[1] + dMs;
        if (nL < tMin) { nR += tMin - nL; nL = tMin; }
        if (nR > tMax) { nL -= nR - tMax; nR = tMax; }
        onTimeRange([nL, nR]);
      }
    };
    const handleUp = () => setDragging(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [dragging, rng, tMin, tMax, span, toMs, onTimeRange]);

  // Only handle click if we didn't just finish dragging
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (didDragRef.current) { didDragRef.current = false; return; }
    const ms = toMs(e.clientX);
    const w = span * 0.15;
    onTimeRange([Math.max(tMin, ms - w / 2), Math.min(tMax, ms + w / 2)]);
  }, [toMs, span, tMin, tMax, onTimeRange]);

  const leftPct = toPct(rng[0]);
  const rightPct = toPct(rng[1]);
  const isActive = timeRange !== null;

  return (
    <div
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        background: 'rgba(28,33,39,0.92)', borderTop: '1px solid var(--bd)',
        padding: '4px 16px 6px', userSelect: 'none',
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between" style={{ marginBottom: 2 }}>
        <span className="label" style={{ color: 'var(--t4)', fontSize: 8 }}>TIME</span>
        {isActive && (
          <div className="flex items-center gap-2">
            <span className="mono text-[9px] text-[var(--t2)]">
              {fmtLabel(rng[0])} — {fmtLabel(rng[1])}
            </span>
            <button
              onClick={() => onTimeRange(null)}
              className="mono text-[8px] cursor-pointer"
              style={{ color: 'var(--danger)', background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: 2, padding: '0px 4px' }}
            >×</button>
          </div>
        )}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative cursor-crosshair"
        style={{ height: 28 }}
        onClick={handleTrackClick}
      >
        {/* Histogram */}
        {histogram.map((h, i) => {
          const barPctL = (i / BUCKETS) * 100;
          const barPctR = ((i + 1) / BUCKETS) * 100;
          const inRange = !isActive || (barPctL >= leftPct - 1 && barPctR <= rightPct + 1);
          return (
            <div
              key={i}
              className="absolute bottom-0"
              style={{
                left: `${barPctL}%`,
                width: `${100 / BUCKETS}%`,
                height: `${Math.max(1, h * 22)}px`,
                background: inRange ? 'var(--blue)' : 'rgba(95,107,124,0.2)',
                opacity: inRange ? 0.5 : 0.3,
              }}
            />
          );
        })}

        {/* Day lines */}
        {dayTicks.map(t => (
          <div key={t.label} className="absolute top-0 bottom-0" style={{ left: `${t.pct}%` }}>
            <div style={{ width: 1, height: '100%', background: 'var(--bd)' }} />
            <span className="mono absolute text-[7px] text-[var(--t4)]" style={{ top: 0, left: 3 }}>{t.label}</span>
          </div>
        ))}

        {/* Selection overlay */}
        {isActive && (
          <>
            <div className="absolute top-0 bottom-0" style={{ left: 0, width: `${leftPct}%`, background: 'rgba(0,0,0,0.35)', pointerEvents: 'none' }} />
            <div className="absolute top-0 bottom-0" style={{ left: `${rightPct}%`, right: 0, background: 'rgba(0,0,0,0.35)', pointerEvents: 'none' }} />

            <div
              className="absolute top-0 bottom-0 cursor-grab"
              style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%`, borderTop: '2px solid var(--blue)', borderBottom: '2px solid var(--blue)' }}
              onMouseDown={e => handleMouseDown(e, 'range')}
            />
            <div
              className="absolute top-0 bottom-0 cursor-ew-resize"
              style={{ left: `${leftPct}%`, width: 6, marginLeft: -3, background: 'var(--blue)', borderRadius: 1, opacity: 0.8 }}
              onMouseDown={e => handleMouseDown(e, 'left')}
            />
            <div
              className="absolute top-0 bottom-0 cursor-ew-resize"
              style={{ left: `${rightPct}%`, width: 6, marginLeft: -3, background: 'var(--blue)', borderRadius: 1, opacity: 0.8 }}
              onMouseDown={e => handleMouseDown(e, 'right')}
            />
          </>
        )}
      </div>
    </div>
  );
}
