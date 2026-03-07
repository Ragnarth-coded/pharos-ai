import { NextRequest } from 'next/server';
import { prisma } from '@/server/lib/db';
import { ok, err } from '@/server/lib/api-utils';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string; actorId: string }> }) {
  const { id, actorId } = await params;

  const actor = await prisma.actor.findFirst({
    where: { id: actorId, conflictId: id },
  });
  if (!actor) return err('NOT_FOUND', `Actor ${actorId} not found`, 404);

  const actions = await prisma.actorAction.findMany({
    where: { actorId },
    orderBy: { date: 'desc' },
  });

  return ok(actions.map(a => ({
    date: a.date,
    type: a.type,
    description: a.description,
    verified: a.verified,
    significance: a.significance,
  })));
}
