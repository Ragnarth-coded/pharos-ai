import { NextRequest } from 'next/server';

import { emptyCasualties, err, ok, resolveCasualties } from '@/server/lib/api-utils';
import { prisma } from '@/server/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string; day: string }> }) {
  const { id, day } = await params;
  const snapshot = await prisma.conflictDaySnapshot.findUnique({
    where: { conflictId_day: { conflictId: id, day: new Date(day + 'T00:00:00Z') } },
    include: {
      casualties: true,
      economicChips: { orderBy: { ord: 'asc' } },
      scenarios: { orderBy: { ord: 'asc' } },
    },
  });

  if (!snapshot) return err('NOT_FOUND', `No snapshot for ${day}`, 404);

  const previousSnapshot = snapshot.casualties.length === 0
    ? await prisma.conflictDaySnapshot.findFirst({
      where: {
        conflictId: id,
        day: { lt: snapshot.day },
        casualties: { some: {} },
      },
      orderBy: { day: 'desc' },
      include: { casualties: true },
    })
    : null;

  const casualties = resolveCasualties(
    snapshot.casualties,
    previousSnapshot ? resolveCasualties(previousSnapshot.casualties, emptyCasualties()) : emptyCasualties(),
  );

  return ok(
    {
      day: snapshot.day.toISOString().slice(0, 10),
      dayLabel: snapshot.dayLabel,
      summary: snapshot.summary,
      keyFacts: snapshot.keyFacts,
      escalation: snapshot.escalation,
      casualties,
      economicImpact: {
        chips: snapshot.economicChips.map(c => ({ label: c.label, val: c.val, sub: c.sub, color: c.color })),
        narrative: snapshot.economicNarrative,
      },
      scenarios: snapshot.scenarios.map(s => ({ label: s.label, subtitle: s.subtitle, color: s.color, prob: s.prob, body: s.body })),
    },
    {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    },
  );
}
