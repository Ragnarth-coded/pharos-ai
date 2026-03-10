import { publicConflictId } from '@/shared/lib/env';
import { prisma } from '@/server/lib/db';

const CONFLICT_ID = publicConflictId;

export const STORY_PAGE_SIZE = 10;

export async function getStories(page = 1) {
  const where = { conflictId: CONFLICT_ID };

  const [rows, total] = await Promise.all([
    prisma.mapStory.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * STORY_PAGE_SIZE,
      take: STORY_PAGE_SIZE,
      select: {
        id: true,
        title: true,
        tagline: true,
        category: true,
        narrative: true,
        keyFacts: true,
        timestamp: true,
        _count: { select: { events: true } },
      },
    }),
    prisma.mapStory.count({ where }),
  ]);

  return {
    stories: rows.map((r) => ({
      id: r.id,
      title: r.title,
      tagline: r.tagline,
      category: r.category,
      narrative: r.narrative,
      keyFacts: r.keyFacts as string[],
      timestamp: r.timestamp.toISOString(),
      eventCount: r._count.events,
    })),
    total,
  };
}

export async function getStory(storyId: string) {
  const row = await prisma.mapStory.findFirst({
    where: { id: storyId, conflictId: CONFLICT_ID },
    include: {
      events: { orderBy: { ord: 'asc' } },
    },
  });

  if (!row) return null;

  return {
    ...row,
    timestamp: row.timestamp.toISOString(),
  };
}
