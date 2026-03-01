'use client';
import { CONFLICT } from '@/data/iranConflict';
import { ACTORS }   from '@/data/iranActors';
import Flag from '@/components/dashboard/Flag';
import { EVENTS }   from '@/data/iranEvents';

const SOURCES = [
  { name: 'Reuters', tier: 1, note: 'Primary wire coverage — Tel Aviv, Tehran, Washington' },
  { name: 'New York Times', tier: 1, note: 'Investigative sourcing + senior Pentagon readouts' },
  { name: 'Associated Press', tier: 1, note: 'Casualty figures, diplomatic wires' },
  { name: 'CENTCOM official statements', tier: 1, note: 'US KIA, operational updates' },
  { name: 'IDF Spokesperson', tier: 1, note: 'Strike confirmations, target lists' },
  { name: 'ISW / CTP (Institute for the Study of War)', tier: 1, note: 'Operational analysis, OSINT corroboration' },
  { name: 'IAEA Director General statements', tier: 1, note: 'Nuclear facility sensor contact / safeguards' },
  { name: 'Axios (Israeli official sourcing)', tier: 1, note: 'Leadership decapitation confirmations' },
  { name: 'IRNA (Iranian state media)', tier: 2, note: 'Used for Iranian-side claims only — treat as propaganda unless corroborated' },
  { name: 'CNBC / Trump CNBC interview', tier: 1, note: 'Presidential statements, Mar-a-Lago readout' },
  { name: 'CSIS (Center for Strategic and International Studies)', tier: 1, note: 'Target analysis, nuclear facility BDA' },
  { name: 'Kpler / MarineTraffic', tier: 2, note: 'Strait of Hormuz vessel tracking, AIS data' },
  { name: 'Maersk customer advisory', tier: 1, note: 'Commercial shipping disruption, route closures' },
];

const TIER_C: Record<number, string> = { 1: 'var(--success)', 2: 'var(--warning)' };

export default function BriefPage() {
  const recentEvents = [...EVENTS]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  const majorActors = ACTORS.filter(a => ['us', 'idf', 'iran', 'irgc', 'houthis'].includes(a.id));

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-1)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* ── CLASSIFICATION HEADER ── */}
        <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 20, borderBottom: '2px solid var(--bd)' }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
              color: 'var(--t4)', fontFamily: 'SFMono-Regular, monospace',
              textTransform: 'uppercase',
            }}>
              UNCLASSIFIED // PHAROS ANALYTICAL
            </span>
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 700, color: 'var(--t1)',
            letterSpacing: '0.04em', marginBottom: 6,
            fontFamily: 'SFMono-Regular, monospace',
          }}>
            DAILY INTELLIGENCE BRIEF
          </h1>
          <h2 style={{
            fontSize: 15, fontWeight: 700, color: 'var(--danger)',
            letterSpacing: '0.08em', marginBottom: 10,
            fontFamily: 'SFMono-Regular, monospace',
          }}>
            OPERATION EPIC FURY / ROARING LION
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--t3)' }}>DATE: 2026-03-01</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--t3)' }}>AS OF: 14:00 UTC</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--t3)' }}>DAY 2 OF OPERATIONS</span>
          </div>
        </div>

        {/* ─────────────────────────────────── */}
        {/* 1. EXECUTIVE SUMMARY               */}
        {/* ─────────────────────────────────── */}
        <BriefSection number="1" title="EXECUTIVE SUMMARY">
          <p style={{ lineHeight: 1.8, color: 'var(--t1)', marginBottom: 12 }}>
            {CONFLICT.summary}
          </p>
          <p style={{ lineHeight: 1.8, color: 'var(--t2)', marginBottom: 12 }}>
            As of 14:00 UTC on March 1, 2026 — Day 2 of operations — the United States and Israel continue to conduct active strikes against Iranian nuclear, missile, and military infrastructure. Iran's transitional government (formed under constitutional succession following the simultaneous assassination of Khamenei and four senior security officials) has vowed continued retaliation but appears to be operating on pre-delegated retaliatory protocols rather than coherent centralized command.
          </p>
          <p style={{ lineHeight: 1.8, color: 'var(--t2)' }}>
            The economic dimension of the conflict has escalated sharply. IRGC closure of the Strait of Hormuz combined with Houthi resumption of Red Sea attacks has effectively closed both major maritime chokepoints simultaneously — the most severe supply disruption since 1973. Brent crude is trading at $143/barrel (+35%). The conflict's trajectory over the next 48–72 hours will be determined primarily by: (1) IRGC coherence under decapitated command; (2) whether Hezbollah opens a northern front; and (3) US and Israeli appetite for continued strikes past nuclear destruction.
          </p>
        </BriefSection>

        {/* ─────────────────────────────────── */}
        {/* 2. KEY DEVELOPMENTS                */}
        {/* ─────────────────────────────────── */}
        <BriefSection number="2" title="KEY DEVELOPMENTS — LAST 24 HOURS">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CONFLICT.keyFacts.map((fact, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 12px', background: 'var(--bg-2)', border: '1px solid var(--bd)', borderLeft: '3px solid var(--danger)' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--danger)', flexShrink: 0, fontFamily: 'monospace', paddingTop: 1 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.5 }}>{fact}</p>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* ─────────────────────────────────── */}
        {/* 3. SITUATION BY ACTOR              */}
        {/* ─────────────────────────────────── */}
        <BriefSection number="3" title="SITUATION BY ACTOR">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {majorActors.map(actor => (
              <div key={actor.id} style={{ padding: '12px 16px', background: 'var(--bg-2)', border: '1px solid var(--bd)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {actor.countryCode && <Flag code={actor.countryCode} size={18} />}
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{actor.fullName}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', background: 'var(--danger-dim)', color: 'var(--danger)', marginLeft: 'auto' }}>
                    {actor.activityLevel}
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', background: 'var(--bg-3)', color: 'var(--t2)' }}>
                    {actor.stance}
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.7 }}>
                  {actor.assessment}
                </p>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* ─────────────────────────────────── */}
        {/* 4. ECONOMIC IMPACT                 */}
        {/* ─────────────────────────────────── */}
        <BriefSection number="4" title="ECONOMIC IMPACT">
          <p style={{ lineHeight: 1.8, color: 'var(--t2)', marginBottom: 12 }}>
            The simultaneous closure of the Strait of Hormuz (IRGC) and Bab el-Mandeb Strait (Houthis) represents an unprecedented dual-chokepoint disruption. The Strait of Hormuz carries approximately 20% of global seaborne oil and 30% of global LNG by volume — roughly 14 million barrels per day. Bab el-Mandeb carries approximately 10% of global trade by value. Both are effectively closed.
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <EconChip label="Brent Crude" val="$143/bbl" sub="+35% ↑" color="var(--danger)" />
            <EconChip label="WTI"         val="$138/bbl" sub="+33% ↑" color="var(--danger)" />
            <EconChip label="LNG Asia"    val="+29%"     sub="spot"    color="var(--warning)" />
            <EconChip label="Hormuz Transit" val="ZERO" sub="vessels" color="var(--danger)" />
          </div>
          <p style={{ lineHeight: 1.8, color: 'var(--t2)', marginBottom: 12 }}>
            Maersk has suspended all Trans-Suez and Hormuz sailings, rerouting available vessels via Cape of Good Hope at significant cost (+$2M+ per voyage, +14 days transit). Lloyd's of London has declared a war risk zone covering the Persian Gulf, Red Sea, and Arabian Sea, triggering insurance surcharges that functionally eliminate commercial transit.
          </p>
          <p style={{ lineHeight: 1.8, color: 'var(--t2)' }}>
            <strong style={{ color: 'var(--warning)' }}>Economic risk threshold:</strong> If Hormuz closure exceeds 2 weeks, Bloomberg Economics estimates a global GDP shock of 0.8–1.4% and European recession probability rises to 60%. The US Strategic Petroleum Reserve, never fully replenished post-2022, has limited emergency buffer. Oil at $180–200/bbl is analytically plausible under 3-week+ closure.
          </p>
        </BriefSection>

        {/* ─────────────────────────────────── */}
        {/* 5. OUTLOOK                         */}
        {/* ─────────────────────────────────── */}
        <BriefSection number="5" title="OUTLOOK — THREE SCENARIOS">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ScenarioCard
              label="BEST CASE"
              subtitle="Ceasefire within 72 hours"
              color="var(--success)"
              prob="15%"
              body="Iran's transitional government, facing catastrophic leadership losses and limited domestic legitimacy (given significant popular celebration of Khamenei's death), signals willingness for back-channel ceasefire negotiations via Oman. US and Israel agree to pause strikes contingent on IRGC stand-down and nominal Hormuz reopening. Hezbollah does not open a northern front. Oil prices partially retrace to $110–120/bbl. Political risk: Trump would need to frame any pause as 'mission accomplished' on nuclear objectives."
            />
            <ScenarioCard
              label="BASE CASE"
              subtitle="5–7 day operation; limited ceasefire"
              color="var(--warning)"
              prob="55%"
              body="US and Israel complete nuclear and missile infrastructure destruction over 5–7 days. Iran's retaliatory capability is significantly degraded but Hormuz closure persists 10–14 days pending negotiations. IRGC proxy networks (PMF, Kata'ib Hezbollah) continue attacks on US assets in Iraq at low-moderate intensity. Hezbollah fires limited barrages but does not open a full northern front. Oil spikes to $155–165/bbl before beginning to retrace once Hormuz reopening is signaled. 3 US KIA remains the final casualty figure."
            />
            <ScenarioCard
              label="WORST CASE"
              subtitle="Wider regional war — Hezbollah front opens"
              color="var(--danger)"
              prob="30%"
              body="Hezbollah, operating under pre-delegated authority or under pressure from IRGC remnants, opens a sustained northern front against Israel — firing 5,000+ rockets and anti-tank missiles. Israel is forced to conduct a ground incursion into southern Lebanon, massively escalating the conflict. Hormuz closure extends beyond 3 weeks. Oil surpasses $180/bbl. IRGC units in Syria conduct attacks on US forces. Congressional Democrats force a War Powers Resolution challenge, triggering constitutional crisis. Iran's nuclear program is destroyed but at the cost of a 6-month regional war."
            />
          </div>
        </BriefSection>

        {/* ─────────────────────────────────── */}
        {/* 6. SOURCES                         */}
        {/* ─────────────────────────────────── */}
        <BriefSection number="6" title="SOURCES">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SOURCES.map((src, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', border: '1px solid var(--bd)' }}>
                <span style={{
                  fontSize: 8, fontWeight: 700, padding: '1px 5px',
                  background: TIER_C[src.tier] + '22',
                  color: TIER_C[src.tier],
                  flexShrink: 0,
                }}>
                  T{src.tier}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)', minWidth: 180 }}>{src.name}</span>
                <span style={{ fontSize: 10, color: 'var(--t3)', flex: 1 }}>{src.note}</span>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* ── Footer ── */}
        <div style={{ marginTop: 40, paddingTop: 16, borderTop: '1px solid var(--bd)', textAlign: 'center' }}>
          <span className="label" style={{ fontSize: 8, color: 'var(--t4)' }}>
            UNCLASSIFIED // PHAROS ANALYTICAL // OPERATION EPIC FURY // 2026-03-01
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function BriefSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue)', fontFamily: 'monospace' }}>{number}.</span>
        <h2 style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: 1, background: 'var(--bd)' }} />
      </div>
      {children}
    </div>
  );
}

function EconChip({ label, val, sub, color }: { label: string; val: string; sub: string; color: string }) {
  return (
    <div style={{
      padding: '10px 14px',
      background: color + '12',
      border: `1px solid ${color}40`,
      minWidth: 110,
    }}>
      <div className="label" style={{ fontSize: 8, color: 'var(--t4)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'SFMono-Regular, monospace', lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 9, color, marginTop: 3, fontFamily: 'monospace' }}>{sub}</div>
    </div>
  );
}

function ScenarioCard({ label, subtitle, color, prob, body }: {
  label: string; subtitle: string; color: string; prob: string; body: string;
}) {
  return (
    <div style={{
      padding: '14px 16px',
      background: color + '08',
      border: `1px solid ${color}35`,
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--t2)', fontStyle: 'italic' }}>{subtitle}</span>
        <div style={{
          marginLeft: 'auto',
          padding: '2px 8px',
          background: color + '20',
          border: `1px solid ${color}50`,
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color, fontFamily: 'monospace' }}>P={prob}</span>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.7 }}>{body}</p>
    </div>
  );
}
