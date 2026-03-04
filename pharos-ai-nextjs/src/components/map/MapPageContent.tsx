'use client';

import dynamic from 'next/dynamic';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useMapPage } from '@/components/map/use-map-page';

const MobileMapLayout  = dynamic(() => import('@/components/map/mobile/MapLayout'),  { ssr: false });
const DesktopMapLayout = dynamic(() => import('@/components/map/desktop/MapLayout'), { ssr: false });

export default function FullMapPage({ embedded = false }: { embedded?: boolean }) {
  const isMobile = useIsMobile(1024);
  const ctx = useMapPage({ isMobile });

  if (isMobile) return <MobileMapLayout ctx={ctx} embedded={embedded} />;
  return <DesktopMapLayout ctx={ctx} embedded={embedded} />;
}
