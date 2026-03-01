'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CONFLICT }  from '@/data/iranConflict';
import { EVENTS }    from '@/data/iranEvents';
import { ACTORS, ACT_C, STA_C } from '@/data/iranActors';
import { X_POSTS }   from '@/data/iranXPosts';
import XPostCard     from '@/components/dashboard/XPostCard';
import Flag from '@/components/dashboard/Flag';

const SEV_C: Record<string, string> = {
  CRITICAL: 'var(--danger)',
  HIGH:     'var(--warning)',
  STANDARD: 'var(--info)',
};
const SEV_CLS: Record<string, string> = {
  CRITICAL: 'sev sev-crit',
  HIGH:     'sev sev-high',
  STANDARD: 'sev sev-std',
};

function fmtTime(ts: string) {
  return new Date(ts).toISOString().slice(11, 16) + 'Z';
}
function fmtDate(ts: string) {
  return new Date(ts).toISOString().slice(0, 10);
}

// Fact chips shown in the summary bar
const CHIPS = [
  { label: 'KHAMENEI KILLED',  danger: true  },
  { label: 'HORMUZ CLOSED',    danger: true  },
  { label: '3 US KIA',         danger: true  },
  { label: 'OIL +35%',         danger: true  },
  { label: '201 IR DEAD',      danger: true  },
  { label: 'DAY 2',            danger: false },
] as const;

export default function OverviewPage() {
  const sortedEvents = [...EVENTS]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  const breakingPosts = X_POSTS.filter(p => p.significance === 'BREAKING').slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', background: 'var(--bg-1)' }}>

      {/* ── SUMMARY BAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '0 16px', height: 36, flexShrink: 0,
        background: 'var(--bg-app)', borderBottom: '1px solid var(--bd)',
        overflowX: 'auto',
      }}>
        <span className="label" style={{ fontSize: 8, color: 'var(--t4)', flexShrink: 0 }}>KEY FACTS</span>
        <div style={{ width: 1, height: 14, background: 'var(--bd)', flexShrink: 0 }} />
        {CHIPS.map(chip => (
          <div key={chip.label} style={{
            display: 'flex', alignItems: 'center',
            padding: '2px 8px', flexShrink: 0,
            background: chip.danger ? 'var(--danger-dim)' : 'var(--bg-2)',
            border: `1px solid ${chip.danger ? 'rgba(231,106,110,.3)' : 'var(--bd)'}`,
          }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
              color: chip.danger ? 'var(--danger)' : 'var(--t2)',
              fontFamily: 'SFMono-Regular, monospace',
            }}>
              {chip.label}
            </span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--t4)' }}>
            Feb 28 – Mar 1, 2026 · OPERATIONS ONGOING
          </span>
        </div>
      </div>

      {/* ── TWO-COLUMN MAIN ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* ── LEFT ~60% — Summary + Events ── */}
        <div style={{ flex: 3, minWidth: 0, borderRight: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Situation Summary */}
          <div style={{ flexShrink: 0, borderBottom: '1px solid var(--bd)' }}>
            <div className="panel-header">
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--danger)' }} />
              <span className="section-title">Situation Summary</span>
              <span className="label" style={{ marginLeft: 'auto', fontSize: 8, color: 'var(--t4)' }}>
                {CONFLICT.codename.us} / {CONFLICT.codename.il}
              </span>
            </div>
            <div style={{ padding: '14px 18px' }}>
              {/* Classification strip */}
              <div style={{ marginBottom: 10 }}>
                <span className="label" style={{ fontSize: 8, color: 'var(--t4)' }}>
                  UNCLASSIFIED // PHAROS ANALYTICAL // {fmtDate(CONFLICT.startDate)} →
                </span>
              </div>
              {/* Summary paragraphs */}
              <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.7, marginBottom: 10 }}>
                {CONFLICT.summary}
              </p>
              {/* Key objectives */}
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <div style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-2)', border: '1px solid var(--bd)', borderLeft: '3px solid var(--blue)' }}>
                  <div className="label" style={{ fontSize: 8, marginBottom: 4, color: 'var(--blue)' }}>US OBJECTIVE</div>
                  <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>{CONFLICT.objectives.us}</p>
                </div>
                <div style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-2)', border: '1px solid var(--bd)', borderLeft: '3px solid var(--info)' }}>
                  <div className="label" style={{ fontSize: 8, marginBottom: 4, color: 'var(--info)' }}>ISRAELI OBJECTIVE</div>
                  <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>{CONFLICT.objectives.il}</p>
                </div>
              </div>
              {/* Casualties row */}
              <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
                <CasChip label="US KIA"        val={String(CONFLICT.casualties.us.kia)}           color="var(--danger)" />
                <CasChip label="IL Civilians"   val={String(CONFLICT.casualties.israel.civilians)} color="var(--warning)" />
                <CasChip label="IR Killed"      val={String(CONFLICT.casualties.iran.killed)}      color="var(--t2)" />
                <CasChip label="Regional KIA"   val="4"                                             color="var(--t3)" />
              </div>
            </div>
          </div>

          {/* Latest Events */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="panel-header">
              <span className="section-title">Latest Events</span>
              <Link href="/dashboard/feed" style={{ textDecoration: 'none', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, color: 'var(--blue-l)', fontWeight: 600 }}>View All</span>
                <ArrowRight size={10} strokeWidth={2} style={{ color: 'var(--blue-l)' }} />
              </Link>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {sortedEvents.map((evt, i) => {
                const sc = SEV_C[evt.severity] ?? 'var(--info)';
                return (
                  <Link key={evt.id} href={`/dashboard/feed?event=${evt.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '9px 18px',
                      borderBottom: i < sortedEvents.length - 1 ? '1px solid var(--bd-s)' : 'none',
                      cursor: 'pointer',
                      transition: 'background .1s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-3)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      {/* Severity + time */}
                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, width: 80 }}>
                        <span className={SEV_CLS[evt.severity]}>{evt.severity.slice(0, 4)}</span>
                        <span className="mono" style={{ fontSize: 9, color: 'var(--t4)' }}>{fmtTime(evt.timestamp)}</span>
                      </div>
                      {/* Title + location */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.4, marginBottom: 3 }}>{evt.title}</p>
                        <span className="mono" style={{ fontSize: 9, color: 'var(--t4)' }}>{evt.location}</span>
                      </div>
                      {/* Arrow */}
                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 4, height: '100%', background: sc, opacity: 0.4, minHeight: 32, marginRight: 8 }} />
                        <ArrowRight size={10} strokeWidth={1.5} style={{ color: 'var(--t4)' }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT ~40% — Actors + Signals ── */}
        <div style={{ flex: 2, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Actor Positions */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderBottom: '1px solid var(--bd)' }}>
            <div className="panel-header">
              <span className="section-title">Actor Positions</span>
              <Link href="/dashboard/actors" style={{ textDecoration: 'none', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, color: 'var(--blue-l)', fontWeight: 600 }}>Dossiers</span>
                <ArrowRight size={10} strokeWidth={2} style={{ color: 'var(--blue-l)' }} />
              </Link>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {ACTORS.map((actor, i) => {
                const actC = ACT_C[actor.activityLevel] ?? 'var(--t2)';
                const staC = STA_C[actor.stance] ?? 'var(--t2)';
                return (
                  <Link key={actor.id} href={`/dashboard/actors?actor=${actor.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '8px 14px',
                      borderBottom: i < ACTORS.length - 1 ? '1px solid var(--bd-s)' : 'none',
                      borderLeft: `3px solid ${actC}`,
                      cursor: 'pointer', transition: 'background .1s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-3)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      {/* Flag + name */}
                      <div style={{ flexShrink: 0, width: 110 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                          {actor.countryCode && <Flag code={actor.countryCode} size={18} />}
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }}>{actor.name}</span>
                        </div>
                        {/* Stance badge */}
                        <span style={{
                          fontSize: 7, fontWeight: 700, padding: '1px 5px',
                          background: staC + '18', color: staC,
                          letterSpacing: '0.05em', fontFamily: 'system-ui',
                        }}>
                          {actor.stance}
                        </span>
                      </div>
                      {/* First doing bullet */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 10.5, color: 'var(--t2)', lineHeight: 1.45,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          ▸ {actor.doing[0]}
                        </p>
                      </div>
                      {/* Activity score */}
                      <div style={{ flexShrink: 0, width: 40, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: actC, fontFamily: 'monospace' }}>{actor.activityScore}</span>
                        <div style={{ width: 36, height: 3, background: 'var(--bd)' }}>
                          <div style={{ width: `${actor.activityScore}%`, height: '100%', background: actC }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Field Signals */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
            <div className="panel-header">
              <span style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1 }}>𝕏</span>
              <span className="section-title">Field Signals</span>
              <Link href="/dashboard/signals" style={{ textDecoration: 'none', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, color: 'var(--blue-l)', fontWeight: 600 }}>All Signals</span>
                <ArrowRight size={10} strokeWidth={2} style={{ color: 'var(--blue-l)' }} />
              </Link>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
              {breakingPosts.map(p => (
                <XPostCard key={p.id} post={p as import('@/data/iranXPosts').XPost} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CasChip({ label, val, color }: { label: string; val: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color, fontFamily: 'SFMono-Regular, monospace', lineHeight: 1 }}>{val}</span>
      <span className="label" style={{ fontSize: 8, color: 'var(--t4)' }}>{label}</span>
    </div>
  );
}
