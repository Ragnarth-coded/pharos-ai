'use client';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { CONFLICTS, STATUS_STYLE } from '@/data/mockConflicts';
import { EVENTS }                  from '@/data/mockEvents';
import { X_POSTS }                 from '@/data/mockXPosts';
import XPostCard                   from '@/components/dashboard/XPostCard';

const TEXT  = '#0f172a';
const TEXT2 = '#475569';
const TEXT3 = '#94a3b8';
const SEP   = '#e2e8f0';
const RED   = '#dd4545';

function TrendIcon({ trend }: { trend: 'UP' | 'DOWN' | 'STABLE' }) {
  if (trend === 'UP')   return <TrendingUp  size={13} style={{ color: '#dc2626' }} strokeWidth={2} />;
  if (trend === 'DOWN') return <TrendingDown size={13} style={{ color: '#16a34a' }} strokeWidth={2} />;
  return <Minus size={13} style={{ color: '#94a3b8' }} strokeWidth={2} />;
}

function timeAgo(ts: string) {
  const ms = Date.now() - new Date(ts).getTime();
  if (ms < 3600000)  return `${Math.round(ms / 60000)}m ago`;
  if (ms < 86400000) return `${Math.round(ms / 3600000)}h ago`;
  return `${Math.round(ms / 86400000)}d ago`;
}

export default function SituationRoom() {
  const criticalEvents = EVENTS
    .filter(e => e.severity === 'CRITICAL')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const recentHigh = EVENTS
    .filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const breakingPosts = X_POSTS.filter(p => p.significance === 'BREAKING').slice(0, 3);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f1f5f9' }}>

      {/* ── BREAKING BANNER ─────────────────────────────── */}
      {criticalEvents.length > 0 && (
        <div style={{ background: '#dc2626', padding: '0 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflow: 'hidden' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px 8px 0', flexShrink: 0,
              borderRight: '2px solid rgba(255,255,255,0.3)',
              marginRight: 16,
            }}>
              <Zap size={13} style={{ color: 'white' }} strokeWidth={2.5} fill="white" />
              <span style={{ fontSize: 10, color: 'white', fontWeight: 700, fontFamily: 'Arial, sans-serif', letterSpacing: '0.1em' }}>
                BREAKING
              </span>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 32, padding: '8px 0', whiteSpace: 'nowrap' }}>
                {criticalEvents.map(e => (
                  <Link key={e.id} href={`/dashboard/feed?event=${e.id}`} style={{ textDecoration: 'none' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.95)', fontFamily: 'Arial, sans-serif', cursor: 'pointer' }}>
                      {e.title}
                      <span style={{ color: 'rgba(255,255,255,0.5)', margin: '0 14px' }}>·</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: 'calc(100vh - 89px)' }}>

        {/* ── LEFT: Conflict cards + latest events ─────── */}
        <div style={{ padding: '28px 32px', overflowY: 'auto' }}>

          {/* Page header */}
          <div style={{ marginBottom: 24 }}>
            <div className="news-meta" style={{ fontSize: 10, color: TEXT3, marginBottom: 4 }}>
              Sunday, March 1, 2026 · Global Overview
            </div>
            <h1 className="news-headline" style={{ fontSize: 28, color: TEXT }}>SITUATION ROOM</h1>
          </div>

          {/* Conflict cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {CONFLICTS.map(conflict => {
              const ss = STATUS_STYLE[conflict.status];
              // Find the most recent high-severity event for this conflict
              const leadEvent = EVENTS
                .filter(e => e.conflictId === conflict.id && (e.severity === 'CRITICAL' || e.severity === 'HIGH'))
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

              return (
                <div key={conflict.id} style={{
                  background: 'white',
                  border: `1px solid ${SEP}`,
                  borderLeft: `6px solid ${conflict.accentColor}`,
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, padding: '18px 22px 16px' }}>

                    {/* Left: headline + bullets */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <Link href={`/dashboard/conflicts/${conflict.id}`} style={{ textDecoration: 'none' }}>
                          <span className="news-headline" style={{ fontSize: 18, color: TEXT, cursor: 'pointer' }}>
                            {conflict.shortName}
                          </span>
                        </Link>
                        <TrendIcon trend={conflict.trend} />
                        <span className="news-meta" style={{
                          fontSize: 9, padding: '3px 8px', borderRadius: 2,
                          background: ss.bg, color: ss.color, border: `1px solid ${ss.color}33`,
                        }}>
                          {ss.label}
                        </span>
                        <span style={{ fontSize: 11, color: TEXT3, fontFamily: 'Arial, sans-serif' }}>
                          {conflict.region}
                        </span>
                      </div>

                      {/* Lead story headline */}
                      {leadEvent && (
                        <Link href={`/dashboard/feed?event=${leadEvent.id}`} style={{ textDecoration: 'none' }}>
                          <p className="news-headline" style={{
                            fontSize: 14.5, color: TEXT2, lineHeight: 1.4, marginBottom: 10,
                            cursor: 'pointer', borderBottom: `1px solid ${SEP}`, paddingBottom: 10,
                          }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = conflict.accentColor}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = TEXT2}
                          >
                            {leadEvent.title}
                          </p>
                        </Link>
                      )}

                      {/* Bullets */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {conflict.keyDevelopments.slice(0, 2).map((d, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <div style={{ width: 6, height: 6, borderRadius: 1, background: conflict.accentColor, flexShrink: 0, marginTop: 5 }} />
                            <span className="news-body" style={{ fontSize: 12.5, color: TEXT2, lineHeight: 1.45 }}>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: escalation + counts + CTA */}
                    <div style={{ width: 160, flexShrink: 0 }}>
                      {/* Escalation */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span className="news-meta" style={{ fontSize: 9, color: TEXT3 }}>ESCALATION</span>
                          <span className="news-headline" style={{ fontSize: 13, color: conflict.accentColor }}>{conflict.escalationScore}%</span>
                        </div>
                        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${conflict.escalationScore}%`, height: '100%', background: conflict.accentColor }} />
                        </div>
                      </div>

                      {/* Quick counts */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div className="news-headline" style={{ fontSize: 20, color: '#dc2626', lineHeight: 1 }}>{conflict.criticalToday}</div>
                          <div className="news-meta" style={{ fontSize: 8, color: TEXT3, marginTop: 2 }}>CRITICAL</div>
                        </div>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div className="news-headline" style={{ fontSize: 20, color: '#ea580c', lineHeight: 1 }}>{conflict.highToday}</div>
                          <div className="news-meta" style={{ fontSize: 8, color: TEXT3, marginTop: 2 }}>HIGH</div>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Link href={`/dashboard/feed?conflict=${conflict.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '6px 10px', background: conflict.accentColor,
                            cursor: 'pointer',
                          }}>
                            <span className="news-meta" style={{ fontSize: 9, color: 'white' }}>Intel Feed</span>
                            <ArrowRight size={11} strokeWidth={2} style={{ color: 'white' }} />
                          </div>
                        </Link>
                        <Link href={`/dashboard/conflicts/${conflict.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '6px 10px', background: '#f8fafc', border: `1px solid ${SEP}`,
                            cursor: 'pointer',
                          }}>
                            <span className="news-meta" style={{ fontSize: 9, color: TEXT3 }}>Full Brief</span>
                            <ArrowRight size={11} strokeWidth={2} style={{ color: TEXT3 }} />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── LATEST HIGH-SEVERITY EVENTS ──────────── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="news-headline" style={{ fontSize: 16, color: TEXT }}>LATEST DEVELOPMENTS</div>
              <Link href="/dashboard/feed" style={{ textDecoration: 'none' }}>
                <span className="news-meta" style={{ fontSize: 10, color: RED, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ALL EVENTS <ArrowRight size={11} strokeWidth={2} />
                </span>
              </Link>
            </div>

            <div style={{ background: 'white', border: `1px solid ${SEP}`, borderTop: `3px solid ${RED}` }}>
              {recentHigh.map((evt, i) => {
                const sev   = evt.severity === 'CRITICAL' ? '#dc2626' : '#ea580c';
                const conflict = CONFLICTS.find(c => c.id === evt.conflictId);
                return (
                  <Link key={evt.id} href={`/dashboard/feed?event=${evt.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '11px 16px',
                      borderBottom: i < recentHigh.length - 1 ? `1px solid ${SEP}` : 'none',
                      cursor: 'pointer', background: 'white', transition: 'background 0.08s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f8fafc'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'white'}
                    >
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: sev, flexShrink: 0 }} />
                      <span className="news-body" style={{ fontSize: 13, color: TEXT, flex: 1 }}>{evt.title}</span>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                        {conflict && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: TEXT3, fontFamily: 'Arial, sans-serif' }}>
                            <div style={{ width: 6, height: 6, borderRadius: 1, background: conflict.accentColor }} />
                            {conflict.shortName}
                          </span>
                        )}
                        {evt.verified && <CheckCircle size={11} style={{ color: '#16a34a' }} strokeWidth={2} />}
                        <span style={{ fontSize: 11, color: TEXT3, fontFamily: 'Arial, sans-serif', minWidth: 48, textAlign: 'right' }}>
                          {timeAgo(evt.timestamp)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: X Posts / Field Signals ──────────── */}
        <div style={{ borderLeft: `1px solid ${SEP}`, background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `2px solid #000000`, background: '#0f172a', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 16 }}>𝕏</span>
              <div className="news-headline" style={{ fontSize: 14, color: 'white' }}>FIELD SIGNALS</div>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'Arial, sans-serif' }}>Curated · verified sources first</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {breakingPosts.map(post => (
              <XPostCard key={post.id} post={post} compact />
            ))}

            <div style={{ height: 1, background: SEP, margin: '8px 0' }} />

            {X_POSTS.filter(p => p.significance !== 'BREAKING').slice(0, 6).map(post => (
              <XPostCard key={post.id} post={post} compact />
            ))}
          </div>

          <div style={{ padding: '10px 12px', borderTop: `1px solid ${SEP}` }}>
            <Link href="/dashboard/feed" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '8px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                cursor: 'pointer',
              }}>
                <span className="news-meta" style={{ fontSize: 10, color: 'white' }}>VIEW ALL SIGNALS</span>
                <ArrowRight size={11} strokeWidth={2} style={{ color: 'white' }} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
