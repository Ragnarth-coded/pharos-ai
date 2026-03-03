import { prisma } from '@/lib/db';
import { ok, err } from '@/lib/api-utils';

export async function GET() {
  const conflictId = process.env.NEXT_PUBLIC_CONFLICT_ID ?? 'iran-2026';
  const conflict = await prisma.conflict.findUnique({
    where: { id: conflictId },
    include: { daySnapshots: { orderBy: { day: 'asc' }, select: { day: true } } },
  });

  if (!conflict) return err('NOT_FOUND', `Conflict ${conflictId} not found`, 404);

  return ok({
    conflictId: conflict.id,
    conflictName: conflict.name,
    days: conflict.daySnapshots.map(s => s.day.toISOString().slice(0, 10)),
    status: conflict.status,
    threatLevel: conflict.threatLevel,
    escalation: conflict.escalation,
  });
}
