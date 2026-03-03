import { prisma } from '@/lib/db';
import { ok } from '@/lib/api-utils';

export async function GET() {
  const feeds = await prisma.rssFeed.findMany({
    orderBy: { tier: 'asc' },
  });

  return ok(feeds.map(f => ({
    id: f.id,
    name: f.name,
    url: f.url,
    perspective: f.perspective,
    country: f.country,
    tags: f.tags,
    stateFunded: f.stateFunded,
    tier: f.tier,
  })));
}
