'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams }               from 'next/navigation';
import Link                              from 'next/link';
import { CheckCircle, Users, ArrowRight } from 'lucide-react';
import { CONFLICTS }                     from '@/data/mockConflicts';
import { ACTORS, ACTIVITY_STYLE, STANCE_STYLE, type Actor } from '@/data/mockActors';
import { getPostsForActor }              from '@/data/mockXPosts';
import XPostCard                         from '@/components/dashboard/XPostCard';

const TEXT  = '#0f172a';
const TEXT2 = '#475569';
const TEXT3 = '#94a3b8';
const SEP   = '#e2e8f0';
const RED   = '#dd4545';

const ACTION_COLOR: Record<string, string> = {
  MILITARY:     '#dc2626',
  DIPLOMATIC:   '#2563eb',
  POLITICAL:    '#7c3aed',
  ECONOMIC:     '#d97706',
  CYBER:        '#16a34a',
  INTELLIGENCE: '#64748b',
};

function ActorsInner() {
  const searchParams     = useSearchParams();
  const initialConflict  = searchParams.get('conflict') ?? 'all';
  const initialActor     = searchParams.get('actor');

  const [conflictFilter, setConflictFilter] = useState<string>(initialConflict);
  const [selectedId,     setSelectedId]     = useState<string | null>(initialActor);
  const [activeTab,      setActiveTab]      = useState<'intel' | 'signals'>('intel');

  useEffect(() => { if (initialActor) setSelectedId(initialActor); }, [initialActor]);

  const filtered = ACTORS.filter(a =>
    conflictFilter === 'all' || a.conflictIds.includes(conflictFilter)
  );
  const selected = ACTORS.find(a => a.id === selectedId) ?? null;

  return (
    <div style={{ display: 'flex', flex: 1, minWidth: 0, overflow: 'hidden' }}>

      {/* ── Conflict filter sidebar ─────────────────── */}
      <div style={{ width: 180, minWidth: 180, flexShrink: 0, background: '#f1f5f9', borderRight: `1px solid ${SEP}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 10px', borderBottom: `2px solid ${RED}`, background: '#f8fafc' }}>
          <div className="news-meta" style={{ fontSize: 10, color: TEXT3, marginBottom: 2 }}>Filter by</div>
          <div className="news-headline" style={{ fontSize: 14, color: TEXT }}>CONFLICT</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {['all', ...CONFLICTS.map(c => c.id)].map(id => {
            const conflict = CONFLICTS.find(c => c.id === id);
            const isActive = conflictFilter === id;
            return (
              <button key={id} onClick={() => { setConflictFilter(id); setSelectedId(null); }}
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: isActive ? '#0f172a' : 'transparent' }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {conflict && <div style={{ width: 7, height: 7, borderRadius: 1, background: isActive ? 'white' : conflict.accentColor, flexShrink: 0 }} />}
                <span className="news-meta" style={{ fontSize: 10, color: isActive ? 'white' : TEXT }}>
                  {conflict ? conflict.shortName : 'ALL ACTORS'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Actor list ──────────────────────────────── */}
      <div style={{ width: 260, minWidth: 260, flexShrink: 0, borderRight: `1px solid ${SEP}`, background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: `2px solid ${RED}`, background: '#f8fafc', flexShrink: 0 }}>
          <div className="news-headline" style={{ fontSize: 16, color: TEXT }}>ACTORS</div>
          <div style={{ fontSize: 11, color: TEXT3, fontFamily: 'Arial, sans-serif', marginTop: 2 }}>{filtered.length} tracked</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(actor => {
            const isOn = selectedId === actor.id;
            const as = ACTIVITY_STYLE[actor.activityLevel];
            const xPosts = getPostsForActor(actor.id);
            return (
              <button key={actor.id} onClick={() => { setSelectedId(isOn ? null : actor.id); setActiveTab('intel'); }}
                style={{
                  width: '100%', textAlign: 'left', display: 'block', padding: '12px 16px',
                  borderLeft: `4px solid ${isOn ? as.color : 'transparent'}`,
                  borderTop: 'none', borderRight: 'none', borderBottom: `1px solid ${SEP}`,
                  background: isOn ? as.bg : 'white', cursor: 'pointer', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { if (!isOn) (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (!isOn) (e.currentTarget as HTMLElement).style.background = 'white'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    {actor.flag && <span style={{ fontSize: 16 }}>{actor.flag}</span>}
                    <span className="news-headline" style={{ fontSize: 13, color: TEXT }}>{actor.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {xPosts.length > 0 && <span style={{ fontSize: 10, color: TEXT3 }}>𝕏</span>}
                    <span className="news-meta" style={{ fontSize: 9, padding: '2px 6px', borderRadius: 2, background: as.bg, color: as.color, border: `1px solid ${as.color}33` }}>
                      {actor.activityLevel}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: TEXT3, fontFamily: 'Arial, sans-serif', marginBottom: 5 }}>{actor.fullName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${actor.activityScore}%`, height: '100%', background: as.color }} />
                  </div>
                  <span style={{ fontSize: 10, color: TEXT3, fontFamily: 'Arial, sans-serif', minWidth: 28 }}>{actor.activityScore}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Actor detail ────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selected ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Users size={44} style={{ color: '#e2e8f0' }} strokeWidth={1} />
            <p className="news-meta" style={{ fontSize: 11, color: TEXT3 }}>Select an actor to view intelligence</p>
          </div>
        ) : (
          <ActorDetail actor={selected} activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}

function ActorDetail({ actor, activeTab, setActiveTab }: {
  actor: Actor;
  activeTab: 'intel' | 'signals';
  setActiveTab: (t: 'intel' | 'signals') => void;
}) {
  const as     = ACTIVITY_STYLE[actor.activityLevel];
  const ss     = STANCE_STYLE[actor.stance];
  const xPosts = getPostsForActor(actor.id);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ borderLeft: `6px solid ${as.color}`, borderBottom: `1px solid ${SEP}`, padding: '18px 24px', background: as.bg, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {actor.flag && <span style={{ fontSize: 28 }}>{actor.flag}</span>}
            <div>
              <h1 className="news-headline" style={{ fontSize: 22, color: TEXT, lineHeight: 1.1, marginBottom: 3 }}>{actor.name}</h1>
              <div style={{ fontSize: 12, color: TEXT2, fontFamily: 'Arial, sans-serif' }}>{actor.fullName}</div>
              <span className="news-meta" style={{ fontSize: 9, color: TEXT3 }}>{actor.type}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Badge label={actor.activityLevel} color={as.color} bg={as.bg} />
            <Badge label={actor.stance} color={ss.color} bg={ss.bg} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="news-meta" style={{ fontSize: 9, color: TEXT3, minWidth: 80 }}>ACTIVITY</div>
          <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${actor.activityScore}%`, height: '100%', background: as.color }} />
          </div>
          <span className="news-headline" style={{ fontSize: 13, color: as.color, minWidth: 36 }}>{actor.activityScore}%</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${SEP}`, flexShrink: 0, background: '#f8fafc' }}>
        {(['intel', 'signals'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 20px', border: 'none', cursor: 'pointer',
            fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase',
            background: activeTab === tab ? 'white' : 'transparent',
            color: activeTab === tab ? TEXT : TEXT3,
            borderBottom: activeTab === tab ? `2px solid ${RED}` : '2px solid transparent',
          }}>
            {tab === 'signals' ? `𝕏 FIELD SIGNALS${xPosts.length > 0 ? ` (${xPosts.length})` : ''}` : 'ACTOR INTELLIGENCE'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'intel' ? (
          <div style={{ padding: '22px 24px' }}>
            {/* SAYING */}
            <Section label="SAYING — Official Position">
              <div style={{ borderLeft: `4px solid ${ss.color}`, paddingLeft: 14 }}>
                <p className="news-body" style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.7, fontStyle: 'italic' }}>{actor.saying}</p>
              </div>
            </Section>

            {/* DOING */}
            <Section label="DOING — Observed Actions">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {actor.doing.map((action, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: '#f8fafc', border: `1px solid ${SEP}` }}>
                    <div style={{ width: 7, height: 7, borderRadius: 1, background: as.color, flexShrink: 0, marginTop: 5 }} />
                    <span className="news-body" style={{ fontSize: 13, color: TEXT, lineHeight: 1.5 }}>{action}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Assessment */}
            <Section label="PHAROS ASSESSMENT">
              <div style={{ borderLeft: `4px solid ${RED}`, paddingLeft: 14 }}>
                <p className="news-body" style={{ fontSize: 13.5, color: '#1e293b', lineHeight: 1.7 }}>{actor.assessment}</p>
              </div>
            </Section>

            {/* Recent actions */}
            <Section label={`RECENT ACTIONS (${actor.recentActions.length})`}>
              {actor.recentActions.map((action, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '10px 12px', background: '#f8fafc', border: `1px solid ${SEP}`,
                  borderLeft: `3px solid ${ACTION_COLOR[action.type] || '#64748b'}`, marginBottom: 6,
                }}>
                  <div style={{ flexShrink: 0, minWidth: 66 }}>
                    <span style={{ fontSize: 11, color: TEXT3, fontFamily: 'Arial, sans-serif' }}>{action.date}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span className="news-meta" style={{ fontSize: 9, padding: '2px 5px', borderRadius: 2, background: ACTION_COLOR[action.type] || '#64748b', color: 'white' }}>{action.type}</span>
                      <span className="news-meta" style={{ fontSize: 9, color: action.significance === 'HIGH' ? '#dc2626' : action.significance === 'MEDIUM' ? '#d97706' : TEXT3 }}>
                        {action.significance} SIG.
                      </span>
                      {action.verified && <CheckCircle size={10} style={{ color: '#16a34a' }} strokeWidth={2} />}
                    </div>
                    <p style={{ fontSize: 13, color: TEXT, fontFamily: 'Georgia, serif', lineHeight: 1.4 }}>{action.description}</p>
                    <div style={{ fontSize: 11, color: TEXT3, fontFamily: 'Arial, sans-serif', marginTop: 2 }}>
                      {action.sourceCount} source{action.sourceCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </Section>

            {/* Conflicts */}
            <Section label="ACTIVE IN">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {actor.conflictIds.map(cid => {
                  const c = CONFLICTS.find(x => x.id === cid);
                  if (!c) return null;
                  return (
                    <Link key={cid} href={`/dashboard/conflicts/${cid}`} style={{ textDecoration: 'none' }}>
                      <span className="news-meta" style={{ fontSize: 10, padding: '4px 10px', borderRadius: 2, background: c.accentColor, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {c.shortName} <ArrowRight size={10} strokeWidth={2} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </Section>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            {xPosts.length === 0 ? (
              <div style={{ padding: '48px 16px', textAlign: 'center' }}>
                <span style={{ fontSize: 24 }}>𝕏</span>
                <p className="news-meta" style={{ fontSize: 11, color: TEXT3, marginTop: 8 }}>No X posts indexed for this actor</p>
              </div>
            ) : (
              <>
                <div className="news-meta" style={{ fontSize: 9, color: TEXT3, marginBottom: 12 }}>
                  {xPosts.length} POSTS · Pharos-curated · {actor.name}
                </div>
                {xPosts.map(post => <XPostCard key={post.id} post={post} />)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div className="news-meta" style={{ fontSize: 10, color: TEXT3, marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className="news-meta" style={{ fontSize: 10, padding: '3px 8px', borderRadius: 2, border: `1px solid ${color}44`, color, background: bg }}>
      {label}
    </span>
  );
}

export default function ActorsPage() {
  return (
    <Suspense fallback={<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>}>
      <ActorsInner />
    </Suspense>
  );
}
