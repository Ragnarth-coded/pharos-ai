import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const conflictId = req.nextUrl.searchParams.get('conflictId');

  const collections = await prisma.conflictCollection.findMany({
    where: conflictId ? { conflictId } : {},
    include: {
      channels: {
        orderBy: { ord: 'asc' },
        include: {
          feeds: {
            orderBy: { ord: 'asc' },
            select: { feedId: true },
          },
        },
      },
    },
  });

  const data = collections.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description,
    channels: c.channels.map(ch => ({
      label: ch.label,
      description: ch.description,
      perspective: ch.perspective,
      color: ch.color,
      feedIds: ch.feeds.map(f => f.feedId),
    })),
  }));

  return ok(data);
}
