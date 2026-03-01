'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams }               from 'next/navigation';
import { Users, CheckCircle, ArrowRight } from 'lucide-react';
import { ACTORS, ACT_C, STA_C, type Actor } from '@/data/iranActors';
import { getPostsForActor }              from '@/data/iranXPosts';
import XPostCard                         from '@/components/dashboard/XPostCard';
import Flag from '@/components/dashboard/Flag';

const TYPE_C: Record<string, string> = {
  MILITARY:    'var(--danger)',
  DIPLOMATIC:  'var(--info)',
  POLITICAL:   '#a78bfa',
  ECONOMIC:    'var(--warning)',
  INTELLIGENCE:'var(--t2)',
};

function ActorsInner() {
  const searchParams = useSearchParams();
  const initActor    = searchParams.get('actor');

  const [selId, setSelId] = useState<string | null>(initActor);
  const [tab,   setTab]   = useState<'intel' | 'signals'>('intel');

  useEffect(() => { if (initActor) setSelId(initActor); }, [initActor]);

  const selected = ACTORS.find(a => a.id === selId) ?? null;

  return (
    <div style={{ display: 'flex', flex: 1, minWidth: 0, overflow: 'hidden' }}>

      {/* ── ACTOR LIST ── 240px ── */}
      <div style={{ width: 240, minWidth: 240, flexShrink: 0, borderRight: '1px solid var(--bd)', display: 'flex', flexDirection: 'column' }}>
        <div className="panel-header" style={{ justifyContent: 'space-between' }}>
          <span className="section-title">Actors</span>
          <span className="label">{ACTORS.length}</span>
        </div>

        {/* Col headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 30px', padding: '4px 12px', borderBottom: '1px solid var(--bd)', background: 'var(--bg-2)' }}>
          {['ACTOR', 'ACTIVITY', ''].map(h => <span key={h} className="label" style={{ fontSize: 8 }}>{h}</span>)}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {ACTORS.map(actor => {
            const isOn   = selId === actor.id;
            const actC   = ACT_C[actor.activityLevel] ?? 'var(--t2)';
            const staC   = STA_C[actor.stance] ?? 'var(--t2)';
            const xCount = getPostsForActor(actor.id).length;
            return (
              <button key={actor.id}
                onClick={() => { setSelId(isOn ? null : actor.id); setTab('intel'); }}
                className="row-btn"
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 60px 30px',
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--bd-s)',
                  borderLeft: `3px solid ${isOn ? actC : 'transparent'}`,
                  background: isOn ? 'var(--bg-sel)' : 'transparent',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    {actor.countryCode && <Flag code={actor.countryCode} size={18} />}
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)', textAlign: 'left' }}>{actor.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 8, color: staC, fontWeight: 700, letterSpacing: '.04em', textAlign: 'left' }}>{actor.stance}</span>
                    {xCount > 0 && <span className="mono" style={{ fontSize: 8, color: 'var(--t3)' }}>𝕏{xCount}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
                  <div style={{ height: 3, background: 'var(--bd)', width: '100%' }}>
                    <div style={{ width: `${actor.activityScore}%`, height: '100%', background: actC }} />
                  </div>
                  <span className="mono" style={{ fontSize: 8, color: actC }}>{actor.activityScore}</span>
                </div>
                <ArrowRight size={9} style={{ color: 'var(--t3)', alignSelf: 'center' }} strokeWidth={1.5} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ACTOR DOSSIER ── fills ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selected ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Users size={32} style={{ color: 'var(--t3)' }} strokeWidth={1} />
            <span className="label" style={{ color: 'var(--t3)' }}>Select an actor</span>
          </div>
        ) : (
          <ActorDossier actor={selected} tab={tab} setTab={setTab} />
        )}
      </div>
    </div>
  );
}

function ActorDossier({ actor, tab, setTab }: { actor: Actor; tab: 'intel' | 'signals'; setTab: (t: 'intel' | 'signals') => void }) {
  const actC   = ACT_C[actor.activityLevel] ?? 'var(--t2)';
  const staC   = STA_C[actor.stance] ?? 'var(--t2)';
  const xPosts = getPostsForActor(actor.id);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Dossier header */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--bd)', background: 'var(--bg-2)', flexShrink: 0 }}>
        <div className="label" style={{ fontSize: 8, color: 'var(--t3)', marginBottom: 8 }}>
          ACTOR INTELLIGENCE DOSSIER // PHAROS THREAT ANALYSIS // OPERATION EPIC FURY
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 10 }}>
          {actor.countryCode && <Flag code={actor.countryCode} size={36} />}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.1 }}>
                {actor.name.toUpperCase()}
              </h1>
              <span style={{ fontSize: 8, padding: '2px 8px', border: `1px solid ${actC}`, color: actC, fontWeight: 700, letterSpacing: '.06em' }}>
                {actor.activityLevel}
              </span>
              <span style={{ fontSize: 8, padding: '2px 8px', border: `1px solid ${staC}`, color: staC, fontWeight: 700, letterSpacing: '.06em' }}>
                {actor.stance}
              </span>
            </div>
            <span className="mono" style={{ fontSize: 10, color: 'var(--t2)' }}>{actor.fullName}</span>
            <span className="label" style={{ marginLeft: 10, fontSize: 8, color: 'var(--t3)' }}>{actor.type}</span>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ height: 6, width: 80, background: 'var(--bd)' }}>
              <div style={{ width: `${actor.activityScore}%`, height: '100%', background: actC }} />
            </div>
            <span className="mono" style={{ fontSize: 11, color: actC }}>{actor.activityScore}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--bd)', flexShrink: 0, background: 'var(--bg-2)' }}>
        {(['intel', 'signals'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="row-btn" style={{
            padding: '8px 18px', width: 'auto',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: tab === t ? 'var(--t1)' : 'var(--t2)',
            borderBottom: tab === t ? '2px solid var(--blue)' : '2px solid transparent',
            background: tab === t ? 'var(--bg-1)' : 'transparent',
          }}>
            {t === 'signals' ? `𝕏 SIGNALS${xPosts.length > 0 ? ` (${xPosts.length})` : ''}` : 'ACTOR INTELLIGENCE'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'intel' ? (
          <div style={{ padding: '18px 22px' }}>

            {/* SAYING */}
            <DocSection label="SAYING — OFFICIAL POSITION">
              <div style={{ borderLeft: `3px solid ${staC}`, paddingLeft: 12 }}>
                <p style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  {actor.saying}
                </p>
              </div>
            </DocSection>

            {/* DOING */}
            <DocSection label="DOING — VERIFIED ACTIONS">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {actor.doing.map((action, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 10px', border: '1px solid var(--bd)' }}>
                    <span style={{ color: actC, fontSize: 12, flexShrink: 0, marginTop: 1 }}>▸</span>
                    <span style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.4 }}>{action}</span>
                  </div>
                ))}
              </div>
            </DocSection>

            {/* Assessment */}
            <DocSection label="PHAROS ASSESSMENT">
              <div style={{ borderLeft: '3px solid var(--blue)', paddingLeft: 12 }}>
                <p style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.7 }}>
                  {actor.assessment}
                </p>
              </div>
            </DocSection>

            {/* Recent actions */}
            <DocSection label={`RECENT ACTIONS (${actor.recentActions.length})`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {actor.recentActions.map((action, i) => {
                  const ac = TYPE_C[action.type] ?? 'var(--t2)';
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '86px 64px 1fr', gap: 0, padding: '6px 0', borderBottom: '1px solid var(--bd-s)' }}>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--t3)', alignSelf: 'flex-start', paddingTop: 1 }}>{action.date}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', background: ac + '18', color: ac, letterSpacing: '.04em' }}>{action.type}</span>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          {action.verified && <CheckCircle size={8} style={{ color: 'var(--success)' }} strokeWidth={2} />}
                          {!action.verified && <span className="mono" style={{ fontSize: 8, color: 'var(--t4)' }}>UNCFMD</span>}
                        </div>
                      </div>
                      <p style={{ fontSize: 11.5, color: 'var(--t1)', lineHeight: 1.4, paddingLeft: 4 }}>
                        {action.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </DocSection>

            {/* Key figures */}
            <DocSection label="KEY FIGURES">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {actor.keyFigures.map((fig, i) => (
                  <div key={i} style={{ padding: '3px 10px', border: '1px solid var(--bd)', background: 'var(--bg-2)' }}>
                    <span style={{ fontSize: 10, color: 'var(--t2)' }}>{fig}</span>
                  </div>
                ))}
              </div>
            </DocSection>
          </div>
        ) : (
          <div style={{ padding: '12px 16px' }}>
            {xPosts.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <span style={{ fontSize: 20, color: 'var(--t3)' }}>𝕏</span>
                <p className="label" style={{ color: 'var(--t3)', marginTop: 8 }}>No signals indexed for this actor</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 10 }}>
                  <span className="label" style={{ fontSize: 8 }}>{xPosts.length} POSTS · PHAROS-CURATED · {actor.name.toUpperCase()}</span>
                </div>
                {xPosts.map(p => <XPostCard key={p.id} post={p as import('@/data/iranXPosts').XPost} />)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DocSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span className="label" style={{ fontSize: 8 }}>{label}</span>
        <div style={{ flex: 1, height: 1, background: 'var(--bd-s)' }} />
      </div>
      {children}
    </div>
  );
}

export default function ActorsPage() {
  return (
    <Suspense fallback={
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="label">Loading…</span>
      </div>
    }>
      <ActorsInner />
    </Suspense>
  );
}
