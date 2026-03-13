import { NextRequest } from 'next/server';

import { emptyCasualties, err, ok, resolveCasualties } from '@/server/lib/api-utils';
import { prisma } from '@/server/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lite = req.nextUrl.searchParams.get('lite') === 'true';
  if (lite) {
    const snapshots = await prisma.conflictDaySnapshot.findMany({
      where: { conflictId: id },
      orderBy: { day: 'asc' },
      select: {
        day: true,
        dayLabel: true,
        summary: true,
        escalation: true,
      },
    });

    if (snapshots.length === 0) return err('NOT_FOUND', `No day snapshots for conflict ${id}`, 404);

    const data = snapshots.map(s => ({
      day: s.day.toISOString().slice(0, 10),
      dayLabel: s.dayLabel,
      summary: s.summary,
      escalation: s.escalation,
    }));

    return ok(data, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' },
    });
  }

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

  let lastKnownCasualties = emptyCasualties();
  const data = snapshots.map((snapshot) => {
    lastKnownCasualties = resolveCasualties(snapshot.casualties, lastKnownCasualties);

    return {
      day: snapshot.day.toISOString().slice(0, 10),
      dayLabel: snapshot.dayLabel,
      summary: snapshot.summary,
      keyFacts: snapshot.keyFacts,
      escalation: snapshot.escalation,
      casualties: lastKnownCasualties,
      economicImpact: {
        chips: snapshot.economicChips.map((chip) => ({ label: chip.label, val: chip.val, sub: chip.sub, color: chip.color })),
        narrative: snapshot.economicNarrative,
      },
      scenarios: snapshot.scenarios.map((scenario) => ({ label: scenario.label, subtitle: scenario.subtitle, color: scenario.color, prob: scenario.prob, body: scenario.body })),
    };
  });

  return ok(data, {
    headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' },
  });
}
