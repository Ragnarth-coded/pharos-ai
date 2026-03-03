import { prisma } from '@/lib/db';
import { ok } from '@/lib/api-utils';

export async function GET() {
  const groups = await prisma.predictionGroup.findMany({
    orderBy: { ord: 'asc' },
  });

  return ok(groups.map(g => ({
    id: g.id,
    label: g.label,
    description: g.description,
    color: g.color,
    bg: g.bg,
    border: g.border,
    titleMatches: g.titleMatches,
  })));
}
