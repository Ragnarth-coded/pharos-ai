'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { getFeedById, type RssFeed } from '@/data/rssFeeds';

// ─── Types ────────────────────────────────────────────────────

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  creator?: string;
  isoDate?: string;
  imageUrl?: string;
}

interface TimelineArticle {
  id: string;
  title: string;
  link: string;
  snippet: string;
  time: Date;
  feed: RssFeed;
  imageUrl?: string;
}

interface NewsTimelineProps {
  feedData: Map<string, FeedItem[]>;
}

// ─── Colors ───────────────────────────────────────────────────

const PERSPECTIVE_COLORS: Record<string, string> = {
  WESTERN: '#3b82f6',
  US_GOV: '#60a5fa',
  ISRAELI: '#a78bfa',
  IRANIAN: '#ef4444',
  ARAB: '#f59e0b',
  RUSSIAN: '#f97316',
  CHINESE: '#dc2626',
  INDEPENDENT: '#10b981',
};

// ─── Tier → vertical distance from spine (px) ────────────────

const TIER_Y_OFFSET: Record<number, number> = {
  1: 10,   // wire — right on the spine
  2: 70,   // major global
  3: 150,  // regional
  4: 230,  // state / niche
};

const TIER_LABELS: Record<number, string> = {
  1: 'WIRE / PRIMARY',
  2: 'MAJOR GLOBAL',
  3: 'REGIONAL',
  4: 'STATE / NICHE',
};

// Layout constants
const CARD_W = 240;
const CARD_GAP = 14;
const TIME_SLOT_W = CARD_W + CARD_GAP;
const IMG_H = 110; // bigger images
const PADDING_X = 80; // left/right padding

// ─── Helpers ──────────────────────────────────────────────────

function formatHour(d: Date): string {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatTimeAgo(d: Date): string {
  const ms = Date.now() - d.getTime();
  if (ms < 60000) return 'now';
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

// ─── Component ────────────────────────────────────────────────

export function NewsTimeline({ feedData }: NewsTimelineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedTiers, setSelectedTiers] = useState<Set<number>>(new Set([1, 2, 3, 4]));
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [spineY, setSpineY] = useState(350);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });

  // Mouse-grab scrolling
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onDown = (e: MouseEvent) => {
      // Ignore if clicking a link
      if ((e.target as HTMLElement).closest('a')) return;
      dragState.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft };
      setIsDragging(true);
      el.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const onMove = (e: MouseEvent) => {
      if (!dragState.current.active) return;
      const dx = e.clientX - dragState.current.startX;
      el.scrollLeft = dragState.current.scrollLeft - dx;
    };

    const onClick = (e: MouseEvent) => {
      // If we dragged more than 5px, suppress the click (don't open links)
      if (Math.abs(e.clientX - dragState.current.startX) > 5) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onUp = () => {
      if (!dragState.current.active) return;
      dragState.current.active = false;
      setIsDragging(false);
      el.style.cursor = 'grab';
    };

    el.style.cursor = 'grab';
    el.addEventListener('mousedown', onDown);
    el.addEventListener('click', onClick, true);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('click', onClick, true);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Center spine vertically in available space
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        setSpineY(Math.max(300, Math.floor(h / 2)));
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Merge all feed items, sorted oldest → newest (left to right)
  const articles = useMemo(() => {
    const items: TimelineArticle[] = [];
    feedData.forEach((feedItems, feedId) => {
      const feed = getFeedById(feedId);
      if (!feed) return;
      for (const item of feedItems) {
        const dateStr = item.isoDate ?? item.pubDate;
        if (!dateStr) continue;
        const time = new Date(dateStr);
        if (isNaN(time.getTime())) continue;
        items.push({
          id: `${feedId}-${time.getTime()}-${item.link}`,
          title: item.title,
          link: item.link,
          snippet: item.contentSnippet ?? '',
          time,
          feed,
          imageUrl: item.imageUrl,
        });
      }
    });
    // Oldest first (left) → newest last (right)
    items.sort((a, b) => a.time.getTime() - b.time.getTime());
    return items;
  }, [feedData]);

  const filtered = useMemo(
    () => articles.filter(a => selectedTiers.has(a.feed.tier)),
    [articles, selectedTiers],
  );

  // Layout: position each card along the horizontal axis
  const layout = useMemo(() => {
    const laneNextX: Record<string, number> = {};
    const positioned: {
      article: TimelineArticle;
      x: number;
      above: boolean;
      yOffset: number;
    }[] = [];

    const hourMarkers: { hour: Date; x: number }[] = [];
    let lastHourStr = '';
    let globalIdx = 0;

    for (const article of filtered) {
      const tier = article.feed.tier;
      const yOffset = TIER_Y_OFFSET[tier] ?? 150;
      const above = globalIdx % 2 === 0;
      const laneKey = `${above ? 'a' : 'b'}-${tier}`;

      const globalX = PADDING_X + globalIdx * TIME_SLOT_W;
      const laneX = laneNextX[laneKey] ?? 0;
      const x = Math.max(globalX, laneX);

      laneNextX[laneKey] = x + CARD_W + CARD_GAP;

      // Hour marker
      const hourStr = formatHour(article.time).slice(0, 2);
      if (hourStr !== lastHourStr) {
        hourMarkers.push({ hour: new Date(article.time), x: x + CARD_W / 2 });
        lastHourStr = hourStr;
      }

      positioned.push({ article, x, above, yOffset });
      globalIdx++;
    }

    const totalWidth = Math.max(
      PADDING_X * 2 + (globalIdx + 1) * TIME_SLOT_W,
      800,
    );

    return { positioned, hourMarkers, totalWidth };
  }, [filtered]);

  const toggleTier = useCallback((tier: number) => {
    setSelectedTiers(prev => {
      const next = new Set(prev);
      if (next.has(tier)) {
        if (next.size > 1) next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  }, []);

  // Scroll to RIGHT (newest) on mount and when data changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Small delay to let layout render
    requestAnimationFrame(() => {
      el.scrollLeft = el.scrollWidth;
    });
  }, [layout]);

  const totalHeight = spineY * 2 + 40;

  return (
    <div ref={containerRef} className="flex flex-col w-full h-full min-h-0">
      {/* Header bar */}
      <div className="px-5 py-2 bg-[var(--bg-2)] border-b border-[var(--bd)] flex items-center gap-4 shrink-0">
        <span className="mono text-[10px] font-bold text-[var(--t2)] tracking-wider">TIMELINE</span>
        <div className="w-px h-4 bg-[var(--bd)]" />

        <div className="flex gap-1">
          {[1, 2, 3, 4].map(tier => (
            <button
              key={tier}
              onClick={() => toggleTier(tier)}
              className={`
                px-2 py-1 rounded text-[8px] mono font-bold tracking-wider transition-colors
                ${selectedTiers.has(tier)
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-[var(--t4)] border border-transparent hover:text-[var(--t2)]'
                }
              `}
            >
              T{tier} {TIER_LABELS[tier]}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="mono text-[8px] text-[var(--t4)]">{filtered.length} articles</span>
          <span className="mono text-[7px] text-[var(--t4)]">oldest → newest →</span>
        </div>
      </div>

      {/* Scroll hint bar */}
      <div className="h-1 shrink-0 bg-[var(--bg-1)] relative overflow-hidden">
        <div
          className="absolute inset-y-0 bg-white/20 rounded-full transition-all"
          style={{
            width: scrollRef.current
              ? `${Math.max(10, (scrollRef.current.clientWidth / (layout.totalWidth || 1)) * 100)}%`
              : '30%',
            right: '0',
          }}
        />
      </div>

      {/* Scrollable timeline area — custom visible scrollbar */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-x-auto overflow-y-auto min-h-0 timeline-scroll ${isDragging ? 'select-none' : ''}`}
      >
        <div
          className="relative"
          style={{
            width: `${layout.totalWidth}px`,
            height: `${totalHeight}px`,
            minHeight: '100%',
          }}
        >
          {/* ─── Horizontal spine ─── */}
          <div
            className="absolute left-0 right-0"
            style={{ top: `${spineY}px` }}
          >
            {/* Main line */}
            <div className="absolute inset-x-0 h-[2px] bg-white/10" />
            {/* Glow */}
            <div
              className="absolute inset-x-0 h-px"
              style={{
                top: '0',
                boxShadow: '0 0 8px rgba(255,255,255,0.05), 0 0 2px rgba(255,255,255,0.1)',
              }}
            />
          </div>

          {/* ─── Axis labels (sticky) ─── */}
          <div
            className="sticky left-3 z-20 mono text-[8px] text-[var(--t4)] tracking-widest absolute"
            style={{ top: `${spineY - 24}px`, opacity: 0.4 }}
          >
            ▲ IMPORTANT
          </div>
          <div
            className="sticky left-3 z-20 mono text-[8px] text-[var(--t4)] tracking-widest absolute"
            style={{ top: `${spineY + 12}px`, opacity: 0.4 }}
          >
            ▼ NICHE
          </div>

          {/* Arrow at right end (newest) */}
          <div
            className="absolute mono text-[9px] text-[var(--t4)] flex items-center gap-1"
            style={{ top: `${spineY - 6}px`, right: '20px', opacity: 0.4 }}
          >
            NOW →
          </div>

          {/* ─── Hour markers ─── */}
          {layout.hourMarkers.map(({ hour, x }) => (
            <div key={hour.toISOString()}>
              {/* Vertical tick */}
              <div
                className="absolute w-px bg-white/10"
                style={{ left: `${x}px`, top: `${spineY - 16}px`, height: '34px' }}
              />
              {/* Label below */}
              <div
                className="absolute mono text-[11px] font-bold text-[var(--t3)] whitespace-nowrap"
                style={{ left: `${x - 16}px`, top: `${spineY + 22}px` }}
              >
                {formatHour(hour)}
              </div>
              {/* Dot */}
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-[var(--bg-app)] border-2 border-[var(--t4)]"
                style={{ left: `${x - 5}px`, top: `${spineY - 5}px` }}
              />
            </div>
          ))}

          {/* ─── Article cards ─── */}
          {layout.positioned.map(({ article, x, above, yOffset }) => {
            const color = PERSPECTIVE_COLORS[article.feed.perspective] ?? '#6b7280';
            const isHovered = hoveredId === article.id;
            const hasImg = !!article.imageUrl;
            const cardH = hasImg ? IMG_H + 80 : 90;

            const cardTop = above
              ? spineY - yOffset - cardH
              : spineY + yOffset + 18;

            const connectorTop = above ? cardTop + cardH : spineY + 2;
            const connectorH = above
              ? spineY - (cardTop + cardH)
              : cardTop - spineY - 2;

            const cardCenter = x + CARD_W / 2;

            return (
              <div key={article.id}>
                {/* Connector line */}
                <div
                  className="absolute transition-opacity duration-200"
                  style={{
                    left: `${cardCenter}px`,
                    top: `${connectorTop}px`,
                    width: '1px',
                    height: `${Math.max(connectorH, 0)}px`,
                    backgroundColor: color,
                    opacity: isHovered ? 0.6 : 0.12,
                  }}
                />
                {/* Dot on spine */}
                <div
                  className="absolute rounded-full transition-all duration-200"
                  style={{
                    left: `${cardCenter - 4}px`,
                    top: `${spineY - 4}px`,
                    width: isHovered ? '10px' : '6px',
                    height: isHovered ? '10px' : '6px',
                    marginLeft: isHovered ? '-2px' : '0',
                    marginTop: isHovered ? '-2px' : '0',
                    backgroundColor: color,
                    opacity: isHovered ? 0.9 : 0.35,
                    boxShadow: isHovered ? `0 0 8px ${color}60` : 'none',
                  }}
                />

                {/* Card */}
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute block no-underline group"
                  style={{
                    left: `${x}px`,
                    top: `${cardTop}px`,
                    width: `${CARD_W}px`,
                  }}
                  onMouseEnter={() => setHoveredId(article.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    className={`
                      rounded-lg border transition-all duration-200 overflow-hidden
                      ${isHovered
                        ? 'bg-[var(--bg-2)] border-white/20 shadow-2xl shadow-black/40 scale-[1.03]'
                        : 'bg-[var(--bg-1)] border-[var(--bd)] hover:border-white/10'
                      }
                    `}
                  >
                    {/* Image — larger */}
                    {hasImg && (
                      <div className="w-full overflow-hidden bg-[var(--bg-2)]" style={{ height: `${IMG_H}px` }}>
                        <img
                          src={article.imageUrl}
                          alt=""
                          className={`w-full h-full object-cover transition-all duration-200 ${
                            isHovered ? 'opacity-100 scale-[1.02]' : 'opacity-50'
                          }`}
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    <div className="px-3 py-2">
                      {/* Source + time */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <div
                          className="px-1.5 py-0.5 rounded text-[7px] mono font-bold leading-none"
                          style={{
                            backgroundColor: `${color}20`,
                            color,
                            border: `1px solid ${color}30`,
                          }}
                        >
                          {article.feed.name.length > 14
                            ? article.feed.id.toUpperCase()
                            : article.feed.name.toUpperCase()
                          }
                        </div>
                        {article.feed.stateFunded && (
                          <span className="text-[6px] mono font-bold text-amber-400/70 tracking-wider">STATE</span>
                        )}
                        <span className="text-[7px] mono text-[var(--t4)] ml-auto shrink-0">
                          {formatHour(article.time)} · {formatTimeAgo(article.time)}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-[11px] text-[var(--t1)] font-medium leading-tight group-hover:text-white line-clamp-2">
                        {article.title}
                      </h4>

                      {/* Snippet on hover */}
                      {isHovered && article.snippet && (
                        <p className="text-[9px] text-[var(--t4)] mt-1 leading-relaxed line-clamp-2">
                          {article.snippet}
                        </p>
                      )}

                      {/* Tier dots + country */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 - article.feed.tier }).map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: color, opacity: 0.6 }} />
                          ))}
                          {Array.from({ length: article.feed.tier - 1 }).map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-white/10" />
                          ))}
                        </div>
                        <span className="text-[7px] mono text-[var(--t4)]">{article.feed.country}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div
              className="absolute flex items-center justify-center"
              style={{ top: `${spineY - 20}px`, left: '100px' }}
            >
              <span className="mono text-[11px] text-[var(--t4)]">No articles for selected tiers</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
