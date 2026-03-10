import type { Metadata } from 'next';

import { BrowsePageHeader } from '@/features/browse/components/BrowsePageHeader';
import { StoryList } from '@/features/browse/components/StoryList';
import { StoryPagination } from '@/features/browse/components/StoryPagination';
import { getStories, STORY_PAGE_SIZE } from '@/features/browse/queries';

export const metadata: Metadata = {
  title: 'Map Stories — Iran Conflict Narratives',
  description:
    'Strategic narratives of the Iran conflict. Strike operations, retaliations, naval engagements, intelligence operations, and diplomatic developments mapped with key facts and event timelines.',
  alternates: { canonical: 'https://www.conflicts.app/browse/stories' },
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BrowseStoriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { stories, total } = await getStories(page);
  const totalPages = Math.max(1, Math.ceil(total / STORY_PAGE_SIZE));

  const from = (page - 1) * STORY_PAGE_SIZE + 1;
  const to = Math.min(page * STORY_PAGE_SIZE, total);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <BrowsePageHeader crumbs={[{ label: 'Stories' }]} hasAutoRefresh />

      <header className="mt-6 mb-8">
        <p className="label mb-2">Conflict narratives</p>
        <h1 className="text-lg font-bold text-[var(--t1)] mb-1">Stories</h1>
        <p className="text-xs text-[var(--t3)]">
          {total > STORY_PAGE_SIZE
            ? `Showing ${from}–${to} of ${total} narratives`
            : `${total} narratives mapping the Iran conflict`}
        </p>
      </header>

      <StoryList stories={stories} />

      {totalPages > 1 && (
        <div className="mt-10">
          <StoryPagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
