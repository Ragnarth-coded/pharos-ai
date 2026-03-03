import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok } from '@/lib/api-utils';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string; actorId: string }> }) {
  const { id, actorId } = await params;

  const posts = await prisma.xPost.findMany({
    where: { conflictId: id, actorId },
    orderBy: { timestamp: 'desc' },
  });

  return ok(posts.map(p => ({
    id: p.id,
    handle: p.handle,
    displayName: p.displayName,
    avatar: p.avatar,
    avatarColor: p.avatarColor,
    verified: p.verified,
    accountType: p.accountType,
    significance: p.significance,
    timestamp: p.timestamp.toISOString(),
    content: p.content,
    images: p.images,
    videoThumb: p.videoThumb,
    likes: p.likes,
    retweets: p.retweets,
    replies: p.replies,
    views: p.views,
    eventId: p.eventId,
    actorId: p.actorId,
    pharosNote: p.pharosNote,
  })));
}
