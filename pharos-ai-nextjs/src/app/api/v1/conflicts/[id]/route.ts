import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, err } from '@/lib/api-utils';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conflict = await prisma.conflict.findUnique({
    where: { id },
    include: {
      daySnapshots: {
        orderBy: { day: 'asc' },
        include: {
          casualties: true,
          economicChips: { orderBy: { ord: 'asc' } },
          scenarios: { orderBy: { ord: 'asc' } },
        },
      },
    },
  });

  if (!conflict) return err('NOT_FOUND', `Conflict ${id} not found`, 404);

  return ok(conflict);
}
