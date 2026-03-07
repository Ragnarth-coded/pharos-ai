import { NextRequest } from 'next/server';
import { prisma } from '@/server/lib/db';
import { ok, err } from '@/server/lib/api-utils';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conflict = await prisma.conflict.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      codename: true,
      startDate: true,
      status: true,
      threatLevel: true,
      region: true,
      escalation: true,
      summary: true,
      keyFacts: true,
      objectives: true,
      commanders: true,
    },
  });

  if (!conflict) return err('NOT_FOUND', `Conflict ${id} not found`, 404);

  return ok(
    {
      ...conflict,
      startDate: conflict.startDate.toISOString().slice(0, 10),
      threatLevel: conflict.threatLevel ?? 'MONITORING',
    },
    {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    },
  );
}
