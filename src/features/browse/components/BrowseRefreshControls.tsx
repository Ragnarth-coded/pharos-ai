'use client';

import { Button } from '@/components/ui/button';

import { useBrowseAutoRefresh } from '@/features/browse/hooks/use-browse-auto-refresh';

function formatAgo(seconds: number | null): string {
  if (seconds == null) return 'loading\u2026';
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  return `${mins}m ago`;
}

export function BrowseRefreshControls() {
  const { refreshing, secondsAgo, refresh } = useBrowseAutoRefresh();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={refresh}
        disabled={refreshing}
        className="text-[var(--t4)] hover:text-[var(--t2)] disabled:opacity-40"
        aria-label="Refresh data"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={refreshing ? 'animate-spin' : ''}
        >
          <path d="M1 6a5 5 0 0 1 9-3M11 6a5 5 0 0 1-9 3" />
          <path d="M1 1v4h4M11 11v-4h-4" />
        </svg>
      </Button>

      <div className="flex items-center gap-1.5">
        <div className={`dot ${refreshing ? 'dot-warn' : 'dot-live'}`} />
        <span className="mono text-[9px] text-[var(--t4)]">
          {refreshing ? 'refreshing\u2026' : formatAgo(secondsAgo)}
        </span>
      </div>
    </div>
  );
}
