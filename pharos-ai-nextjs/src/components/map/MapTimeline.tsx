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

function fmtDay(ms: number) {
  const d = new Date(ms);
  const mon = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  return `${mon} ${d.getUTCDate()}`;
}

function fmtHour(ms: number) {
  const d = new Date(ms);
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function MapTimeline({ timeExtent, timeRange, onTimeRange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'left' | 'right' | 'range' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; range: [number, number] } | null>(null);

  const [tMin, tMax] = timeExtent;
  const span = tMax - tMin;
  const rng = timeRange ?? timeExtent;

  // Histogram: count events per bucket
  const BUCKETS = 80;
  const histogram = useMemo(() => {
    const buckets = new Array(BUCKETS).fill(0);
    const step = span / BUCKETS;
    for (const r of ALL_RECORDS) {
      const t = new Date(r.timestamp).getTime();
      const i = Math.min(BUCKETS - 1, Math.max(0, Math.floor((t - tMin) / step)));
      buckets[i]++;
    }
    const maxVal = Math.max(1, ...buckets);
    return buckets.map(v => v / maxVal);
  }, [tMin, span]);

  // Day boundaries
  const dayTicks = useMemo(() => {
    const ticks: { label: string; pct: number }[] = [];
    const startDay = new Date(tMin);
    startDay.setUTCHours(0, 0, 0, 0);
    let d = startDay.getTime();
    while (d <= tMax + 86400000) {
      const pct = ((d - tMin) / span) * 100;
      if (pct >= 0 && pct <= 100) ticks.push({ label: fmtDay(d), pct });
      d += 86400000;
    }
    return ticks;
  }, [tMin, tMax, span]);

  const toPct = (ms: number) => ((ms - tMin) / span) * 100;
  const toMs = (pct: number) => tMin + (pct / 100) * span;

  const getMousePct = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: 'left' | 'right' | 'range') => {
    e.preventDefault();
    setDragging(handle);
    setDragStart({ x: e.clientX, range: [rng[0], rng[1]] });
  }, [rng]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      const pct = getMousePct(e);
      const ms = toMs(pct);
      if (dragging === 'left') {
        onTimeRange([Math.min(ms, rng[1] - span * 0.01), rng[1]]);
      } else if (dragging === 'right') {
        onTimeRange([rng[0], Math.max(ms, rng[0] + span * 0.01)]);
      } else if (dragging === 'range' && dragStart) {
        const dx = e.clientX - dragStart.x;
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect) return;
        const dMs = (dx / rect.width) * span;
        let newL = dragStart.range[0] + dMs;
        let newR = dragStart.range[1] + dMs;
        if (newL < tMin) { newR += tMin - newL; newL = tMin; }
        if (newR > tMax) { newL -= newR - tMax; newR = tMax; }
        onTimeRange([newL, newR]);
      }
    };
    const handleUp = () => { setDragging(null); setDragStart(null); };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [dragging, dragStart, rng, tMin, tMax, span, getMousePct, onTimeRange, toMs]);

  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (dragging) return;
    const pct = getMousePct(e);
    const ms = toMs(pct);
    const windowSize = span * 0.15;
    onTimeRange([Math.max(tMin, ms - windowSize / 2), Math.min(tMax, ms + windowSize / 2)]);
  }, [dragging, getMousePct, toMs, span, tMin, tMax, onTimeRange]);

  const leftPct = toPct(rng[0]);
  const rightPct = toPct(rng[1]);
  const isActive = timeRange !== null;

  return (
    <div
      className="flex-shrink-0"
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        background: 'rgba(28,33,39,0.95)', borderTop: '1px solid var(--bd)',
        padding: '6px 16px 10px', userSelect: 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="label" style={{ color: 'var(--t4)' }}>TIME</span>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="mono text-[9px] text-[var(--t2)]">
              {fmtDay(rng[0])} {fmtHour(rng[0])} — {fmtDay(rng[1])} {fmtHour(rng[1])}
            </span>
          )}
          {isActive && (
            <button
              onClick={() => onTimeRange(null)}
              className="mono text-[8px] text-[var(--danger)] cursor-pointer"
              style={{ background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: 2, padding: '1px 5px' }}
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative cursor-crosshair"
        style={{ height: 36 }}
        onClick={handleTrackClick}
      >
        {/* Histogram bars */}
        {histogram.map((h, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${(i / BUCKETS) * 100}%`,
              width: `${100 / BUCKETS}%`,
              height: `${Math.max(1, h * 28)}px`,
              background: isActive
                ? ((i / BUCKETS) * 100 >= leftPct && (i / BUCKETS) * 100 <= rightPct
                  ? 'var(--blue-dim)' : 'rgba(95,107,124,0.15)')
                : 'rgba(95,107,124,0.2)',
              transition: 'background 0.1s',
            }}
          />
        ))}

        {/* Day boundary lines */}
        {dayTicks.map(tick => (
          <div key={tick.label} className="absolute top-0 bottom-0" style={{ left: `${tick.pct}%` }}>
            <div style={{ width: 1, height: '100%', background: 'var(--bd)' }} />
            <span className="mono absolute text-[7px] text-[var(--t4)]" style={{ top: -1, left: 2 }}>
              {tick.label}
            </span>
          </div>
        ))}

        {/* Selection range overlay */}
        {isActive && (
          <>
            {/* Dimmed outside regions */}
            <div className="absolute top-0 bottom-0" style={{ left: 0, width: `${leftPct}%`, background: 'rgba(0,0,0,0.4)' }} />
            <div className="absolute top-0 bottom-0" style={{ left: `${rightPct}%`, right: 0, background: 'rgba(0,0,0,0.4)' }} />

            {/* Selected region border */}
            <div
              className="absolute top-0 bottom-0 cursor-grab"
              style={{
                left: `${leftPct}%`, width: `${rightPct - leftPct}%`,
                borderTop: '2px solid var(--blue)', borderBottom: '2px solid var(--blue)',
              }}
              onMouseDown={e => handleMouseDown(e, 'range')}
            />

            {/* Left handle */}
            <div
              className="absolute top-0 bottom-0 cursor-ew-resize"
              style={{ left: `${leftPct}%`, width: 4, marginLeft: -2, background: 'var(--blue)', borderRadius: 1 }}
              onMouseDown={e => handleMouseDown(e, 'left')}
            />

            {/* Right handle */}
            <div
              className="absolute top-0 bottom-0 cursor-ew-resize"
              style={{ left: `${rightPct}%`, width: 4, marginLeft: -2, background: 'var(--blue)', borderRadius: 1 }}
              onMouseDown={e => handleMouseDown(e, 'right')}
            />
          </>
        )}
      </div>
    </div>
  );
}
