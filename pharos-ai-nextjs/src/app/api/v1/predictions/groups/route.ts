import { prisma } from '@/server/lib/db';
import { ok } from '@/server/lib/api-utils';

export async function GET() {
  const groups = await prisma.predictionGroup.findMany({
    orderBy: { ord: 'asc' },
  });

  return ok(
    groups.map(g => ({
      id: g.id,
      label: g.label,
      description: g.description,
      color: g.color,
      bg: g.bg,
      border: g.border,
      titleMatches: g.titleMatches,
    })),
    {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    },
  );
}
