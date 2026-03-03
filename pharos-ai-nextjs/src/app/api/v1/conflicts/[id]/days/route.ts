import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, err, reassembleCasualties } from '@/lib/api-utils';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snapshots = await prisma.conflictDaySnapshot.findMany({
    where: { conflictId: id },
    orderBy: { day: 'asc' },
    include: {
      casualties: true,
      economicChips: { orderBy: { ord: 'asc' } },
      scenarios: { orderBy: { ord: 'asc' } },
    },
  });

  if (snapshots.length === 0) return err('NOT_FOUND', `No day snapshots for conflict ${id}`, 404);

  const data = snapshots.map(s => ({
    day: s.day.toISOString().slice(0, 10),
    dayLabel: s.dayLabel,
    summary: s.summary,
    keyFacts: s.keyFacts,
    escalation: s.escalation,
    casualties: reassembleCasualties(s.casualties),
    economicImpact: {
      chips: s.economicChips.map(c => ({ label: c.label, val: c.val, sub: c.sub, color: c.color })),
      narrative: s.economicNarrative,
    },
    scenarios: s.scenarios.map(sc => ({ label: sc.label, subtitle: sc.subtitle, color: sc.color, prob: sc.prob, body: sc.body })),
  }));

  return ok(data);
}
