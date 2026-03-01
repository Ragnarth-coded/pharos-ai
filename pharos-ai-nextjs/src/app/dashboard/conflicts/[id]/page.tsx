'use client';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ArrowRight, CheckCircle } from 'lucide-react';
import { CONFLICTS, STATUS_STYLE }   from '@/data/mockConflicts';
import { EVENTS, SEV_STYLE }         from '@/data/mockEvents';
import { ACTORS, ACTIVITY_STYLE }    from '@/data/mockActors';
import { getPostsForConflict }       from '@/data/mockXPosts';
import XPostCard                     from '@/components/dashboard/XPostCard';

const TEXT  = '#0f172a';
const TEXT2 = '#475569';
const TEXT3 = '#94a3b8';
const SEP   = '#e2e8f0';
const RED   = '#dd4545';

function timeAgo(ts: string) {
  const ms = Date.now() - new Date(ts).getTime();
  if (ms < 3600000)  return `${Math.round(ms / 60000)}m ago`;
  if (ms < 86400000) return `${Math.round(ms / 3600000)}h ago`;
  return `${Math.round(ms / 86400000)}d ago`;
}

export default function ConflictPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const conflict = CONFLICTS.find(c => c.id === id);

  if (!conflict) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <p style={{ color: TEXT3, fontFamily: 'Arial, sans-serif' }}>Conflict not found.</p>
        <Link href="/dashboard">← Back</Link>
      </div>
    );
  }

  const ss          = STATUS_STYLE[conflict.status];
  const events      = EVENTS.filter(e => e.conflictId === id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const actors      = ACTORS.filter(a => a.conflictIds.includes(id));
  const xPosts      = getPostsForConflict(id);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f1f5f9' }}>

      {/* ── Color bar header ──────────────────────────── */}
      <div style={{ borderLeft: `8px solid ${conflict.accentColor}`, background: 'white', borderBottom: `2px solid ${SEP}`, padding: '20px 36px' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14, color: TEXT3 }}>
          <ArrowLeft size={13} strokeWidth={2} />
          <span className="news-meta" style={{ fontSize: 10, color: TEXT3 }}>SITUATION ROOM</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <h1 className="news-headline" style={{ fontSize: 28, color: TEXT }}>{conflict.name}</h1>
              {conflict.trend === 'UP' && <TrendingUp size={18} style={{ color: '#dc2626' }} strokeWidth={2} />}
              {conflict.trend === 'DOWN' && <TrendingDown size={18} style={{ color: '#16a34a' }} strokeWidth={2} />}
              {conflict.trend === 'STABLE' && <Minus size={18} style={{ color: '#94a3b8' }} strokeWidth={2} />}
            </div>
            <p style={{ fontSize: 13, color: TEXT2, fontFamily: 'Arial, sans-serif' }}>{conflict.region}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span className="news-meta" style={{ fontSize: 10, padding: '3px 10px', borderRadius: 2, background: ss.bg, color: ss.color, border: `1px solid ${ss.color}33` }}>
                {ss.label}
              </span>
              {conflict.actors.map(a => (
                <span key={a} className="news-meta" style={{ fontSize: 10, padding: '3px 10px', borderRadius: 2, background: '#f8fafc', color: TEXT3, border: `1px solid ${SEP}` }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'ESCALATION', val: `${conflict.escalationScore}%`, color: conflict.accentColor },
              { label: 'CRITICAL TODAY', val: String(conflict.criticalToday), color: '#dc2626' },
              { label: 'HIGH TODAY', val: String(conflict.highToday), color: '#ea580c' },
              { label: 'EVENTS TOTAL', val: String(events.length), color: '#64748b' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'right' }}>
                <div className="news-headline" style={{ fontSize: 26, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div className="news-meta" style={{ fontSize: 9, color: TEXT3, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Escalation bar */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="news-meta" style={{ fontSize: 9, color: TEXT3, minWidth: 80 }}>ESCALATION INDEX</div>
          <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${conflict.escalationScore}%`, height: '100%', background: conflict.accentColor }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href={`/dashboard/feed?conflict=${id}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: conflict.accentColor, cursor: 'pointer' }}>
                <span className="news-meta" style={{ fontSize: 10, color: 'white' }}>INTEL FEED</span>
                <ArrowRight size={12} strokeWidth={2} style={{ color: 'white' }} />
              </div>
            </Link>
            <Link href={`/dashboard/actors?conflict=${id}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#0f172a', cursor: 'pointer' }}>
                <span className="news-meta" style={{ fontSize: 10, color: 'white' }}>ACTORS</span>
                <ArrowRight size={12} strokeWidth={2} style={{ color: 'white' }} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Three-column body ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: 0, minHeight: 'calc(100vh - 240px)' }}>

        {/* Col 1: Event timeline */}
        <div style={{ borderRight: `1px solid ${SEP}`, padding: '24px 24px' }}>
          <div className="news-headline" style={{ fontSize: 14, color: TEXT, marginBottom: 16, paddingBottom: 10, borderBottom: `2px solid ${RED}` }}>
            EVENT TIMELINE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.map(evt => {
              const sevColor = SEV_STYLE[evt.severity].color;
              return (
                <Link key={evt.id} href={`/dashboard/feed?event=${evt.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '10px 14px', background: 'white', border: `1px solid ${SEP}`,
                    borderLeft: `4px solid ${sevColor}`, cursor: 'pointer', transition: 'background 0.08s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f8fafc'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'white'}
                  >
                    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      <span className="news-meta" style={{ fontSize: 9, padding: '2px 5px', background: sevColor, color: 'white', borderRadius: 2 }}>
                        {evt.severity}
                      </span>
                      <span className="news-meta" style={{ fontSize: 9, color: TEXT3 }}>{evt.type}</span>
                      {evt.verified && <CheckCircle size={10} style={{ color: '#16a34a' }} strokeWidth={2} />}
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT3, fontFamily: 'Arial, sans-serif' }}>{timeAgo(evt.timestamp)}</span>
                    </div>
                    <p className="news-headline" style={{ fontSize: 12.5, color: TEXT, lineHeight: 1.35 }}>{evt.title}</p>
                    <p className="news-body" style={{ fontSize: 12, color: TEXT2, lineHeight: 1.4, marginTop: 4,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {evt.summary}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Col 2: Actors */}
        <div style={{ borderRight: `1px solid ${SEP}`, padding: '24px 24px' }}>
          <div className="news-headline" style={{ fontSize: 14, color: TEXT, marginBottom: 16, paddingBottom: 10, borderBottom: `2px solid ${RED}` }}>
            KEY ACTORS ({actors.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {actors.map(actor => {
              const as = ACTIVITY_STYLE[actor.activityLevel];
              return (
                <Link key={actor.id} href={`/dashboard/actors?actor=${actor.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '12px 14px', background: 'white', border: `1px solid ${SEP}`,
                    borderLeft: `4px solid ${as.color}`, cursor: 'pointer', transition: 'background 0.08s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f8fafc'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'white'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      {actor.flag && <span style={{ fontSize: 18 }}>{actor.flag}</span>}
                      <span className="news-headline" style={{ fontSize: 13, color: TEXT, flex: 1 }}>{actor.name}</span>
                      <span className="news-meta" style={{ fontSize: 9, padding: '2px 6px', borderRadius: 2, background: as.color + '18', color: as.color, border: `1px solid ${as.color}33` }}>
                        {actor.activityLevel}
                      </span>
                    </div>
                    <p className="news-body" style={{ fontSize: 12, color: TEXT2, lineHeight: 1.4, fontStyle: 'italic',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{actor.saying.slice(0, 120)}…"
                    </p>
                    <div style={{ marginTop: 8 }}>
                      <div className="news-meta" style={{ fontSize: 9, color: TEXT3, marginBottom: 4 }}>DOING</div>
                      <p className="news-body" style={{ fontSize: 11.5, color: TEXT2 }}>{actor.doing[0]}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <div style={{ flex: 1, height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${actor.activityScore}%`, height: '100%', background: as.color }} />
                      </div>
                      <span style={{ fontSize: 10, color: TEXT3, fontFamily: 'Arial, sans-serif' }}>{actor.activityScore}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Col 3: X posts */}
        <div style={{ background: 'white' }}>
          <div style={{ padding: '14px 16px', borderBottom: `2px solid #000000`, background: '#0f172a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>𝕏</span>
              <div className="news-headline" style={{ fontSize: 14, color: 'white' }}>FIELD SIGNALS</div>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'Arial, sans-serif', marginTop: 2 }}>
              {conflict.shortName} · {xPosts.length} posts
            </div>
          </div>
          <div style={{ padding: '12px' }}>
            {xPosts.length === 0 ? (
              <p style={{ fontSize: 12, color: TEXT3, fontFamily: 'Arial, sans-serif', padding: 16 }}>No X posts for this conflict.</p>
            ) : (
              xPosts.map(post => <XPostCard key={post.id} post={post} compact />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
