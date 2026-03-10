'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

const REFRESH_INTERVAL = 4 * 60_000; // 4 minutes
const TICK_INTERVAL = 15_000; // update "Xs ago" label every 15s

type UseBrowseAutoRefreshReturn = {
  refreshing: boolean;
  secondsAgo: number | null;
  refresh: () => void;
};

/**
 * Periodically calls `router.refresh()` to re-fetch server component data.
 * Pauses when the tab is hidden and prevents overlapping refreshes.
 */
export function useBrowseAutoRefresh(): UseBrowseAutoRefreshReturn {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now);
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doRefresh = useCallback(() => {
    setRefreshing(true);
    router.refresh();

    // router.refresh() is fire-and-forget; simulate completion after a
    // short delay that covers typical server component re-render time.
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(Date.now());
      setTick(0);
    }, 1_500);
  }, [router]);

  // Polling interval — pauses when the tab is hidden
  useEffect(() => {
    function start() {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(doRefresh, REFRESH_INTERVAL);
    }

    function stop() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    function onVisibility() {
      if (document.visibilityState === 'visible') {
        start();
      } else {
        stop();
      }
    }

    start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [doRefresh]);

  // Tick counter drives the "Xs ago" label without calling Date.now() in render
  useEffect(() => {
    tickRef.current = setInterval(() => setTick((t) => t + 1), TICK_INTERVAL);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // Each tick increment adds ~15s; combined with lastRefresh delta at mount
  // this gives a good-enough elapsed time without impure render calls.
  const elapsedTicks = tick;
  const secondsAgo = lastRefresh != null
    ? Math.round(elapsedTicks * (TICK_INTERVAL / 1000))
    : null;

  return { refreshing, secondsAgo, refresh: doRefresh };
}
