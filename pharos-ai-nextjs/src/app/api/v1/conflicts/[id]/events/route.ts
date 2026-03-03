import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, err, parseDayRange } from '@/lib/api-utils';
import type { Prisma } from '@/generated/prisma/client';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sp = req.nextUrl.searchParams;
  const day = sp.get('day');
  const severity = sp.get('severity');
  const type = sp.get('type');
  const verified = sp.get('verified');

  const where: Prisma.IntelEventWhereInput = { conflictId: id };

  if (day) {
    const range = parseDayRange(day);
    where.timestamp = { gte: range.gte, lt: range.lt };
  }
  if (severity) where.severity = severity as Prisma.EnumSeverityFilter['equals'];
  if (type) where.type = type as Prisma.EnumEventTypeFilter['equals'];
  if (verified !== null && verified !== undefined) where.verified = verified === 'true';

  const events = await prisma.intelEvent.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    include: {
      sources: true,
      actorResponses: true,
    },
  });

  if (events.length === 0 && !(await prisma.conflict.findUnique({ where: { id } }))) {
    return err('NOT_FOUND', `Conflict ${id} not found`, 404);
  }

  const data = events.map(e => ({
    id: e.id,
    timestamp: e.timestamp.toISOString(),
    severity: e.severity,
    type: e.type,
    title: e.title,
    location: e.location,
    summary: e.summary,
    fullContent: e.fullContent,
    verified: e.verified,
    sources: e.sources.map(s => ({
      name: s.name,
      tier: s.tier,
      reliability: s.reliability,
      url: s.url,
    })),
    actorResponses: e.actorResponses.map(r => ({
      actorId: r.actorId,
      actorName: r.actorName,
      stance: r.stance,
      type: r.type,
      statement: r.statement,
    })),
    tags: e.tags,
  }));

  return ok(data);
}
