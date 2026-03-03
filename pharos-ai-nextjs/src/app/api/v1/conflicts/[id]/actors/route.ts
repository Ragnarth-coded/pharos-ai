import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, err, mapActorTypeToApi } from '@/lib/api-utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const day = req.nextUrl.searchParams.get('day');

  const actors = await prisma.actor.findMany({
    where: { conflictId: id },
    include: {
      daySnapshots: { orderBy: { day: 'asc' } },
      actions: { orderBy: { date: 'desc' } },
    },
  });

  if (actors.length === 0) return err('NOT_FOUND', `No actors for conflict ${id}`, 404);

  const data = actors.map(a => {
    // Build daySnapshots Record<day, snapshot>
    const daySnapshotsRecord: Record<string, {
      activityLevel: string; activityScore: number; stance: string;
      saying: string; doing: string[]; assessment: string;
    }> = {};
    for (const ds of a.daySnapshots) {
      daySnapshotsRecord[ds.day.toISOString().slice(0, 10)] = {
        activityLevel: ds.activityLevel,
        activityScore: ds.activityScore,
        stance: ds.stance,
        saying: ds.saying,
        doing: ds.doing,
        assessment: ds.assessment,
      };
    }

    // If day param is provided, overlay snapshot values for that day
    const snapshot = day ? daySnapshotsRecord[day] : null;

    return {
      id: a.id,
      name: a.name,
      fullName: a.fullName,
      countryCode: a.countryCode,
      type: mapActorTypeToApi(a.type),
      activityLevel: snapshot?.activityLevel ?? a.activityLevel,
      activityScore: snapshot?.activityScore ?? a.activityScore,
      stance: snapshot?.stance ?? a.stance,
      saying: snapshot?.saying ?? a.saying,
      doing: snapshot?.doing ?? a.doing,
      assessment: snapshot?.assessment ?? a.assessment,
      recentActions: a.actions.map(act => ({
        date: act.date,
        type: act.type,
        description: act.description,
        verified: act.verified,
        significance: act.significance,
      })),
      keyFigures: a.keyFigures,
      linkedEventIds: a.linkedEventIds,
      daySnapshots: daySnapshotsRecord,
    };
  });

  return ok(data);
}
