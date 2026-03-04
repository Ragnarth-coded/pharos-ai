/**
 * Shared types for map detail panels.
 * Desktop and mobile implementations live in desktop/ and mobile/ respectively.
 */

import type { StrikeArc, MissileTrack, Target, Asset, ThreatZone } from '@/data/map-data';

export type SelectedItem =
  | { type: 'strike';  data: StrikeArc   }
  | { type: 'missile'; data: MissileTrack }
  | { type: 'target';  data: Target      }
  | { type: 'asset';   data: Asset       }
  | { type: 'zone';    data: ThreatZone  };

// Re-export desktop panel as default for backward compat (dashboard embedded map, etc.)
export { DesktopDetailPanel as default } from '@/components/map/desktop/MapDetailPanel';
