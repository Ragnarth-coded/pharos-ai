/**
 * mapTokens.ts
 * Single source of truth for the map hierarchy system.
 *
 * Rule: hex literals only appear here (in RGB tuples for deck.gl).
 * Component files always reference `cssVar` via var(--token).
 */

// ─── Level 1: Actor ───────────────────────────────────────────────────────────

export type Actor = 'US' | 'ISRAEL' | 'NATO' | 'IRAN' | 'IRGC' | 'HOUTHI';
export type Affiliation = 'FRIENDLY' | 'HOSTILE';

type ActorMeta = {
  label: string;
  cssVar: string;                    // CSS variable — used in React components
  rgb: [number, number, number];     // Raw RGB — used in deck.gl layer accessors
  affiliation: Affiliation;
  group: 'Coalition' | 'Adversary';
};

export const ACTOR_META: Record<Actor, ActorMeta> = {
  US:     { label: 'United States', cssVar: 'var(--blue)',    rgb: [45,  114, 210], affiliation: 'FRIENDLY', group: 'Coalition' },
  ISRAEL: { label: 'Israel (IDF)',  cssVar: 'var(--teal)',    rgb: [50,  200, 200], affiliation: 'FRIENDLY', group: 'Coalition' },
  NATO:   { label: 'NATO',          cssVar: 'var(--cyber)',   rgb: [160, 100, 220], affiliation: 'FRIENDLY', group: 'Coalition' },
  IRAN:   { label: 'Iran',          cssVar: 'var(--danger)',  rgb: [231, 106, 110], affiliation: 'HOSTILE',  group: 'Adversary' },
  IRGC:   { label: 'IRGC',         cssVar: 'var(--danger)',  rgb: [200,  50,  50], affiliation: 'HOSTILE',  group: 'Adversary' },
  HOUTHI: { label: 'Houthi',        cssVar: 'var(--warning)', rgb: [236, 154,  60], affiliation: 'HOSTILE',  group: 'Adversary' },
};

export const FRIENDLY_ACTORS: Actor[] = ['US', 'ISRAEL', 'NATO'];
export const HOSTILE_ACTORS:  Actor[] = ['IRAN', 'IRGC', 'HOUTHI'];
export const ALL_ACTORS:      Actor[] = [...FRIENDLY_ACTORS, ...HOSTILE_ACTORS];

// ─── Level 2: Category ────────────────────────────────────────────────────────

export type MarkerCategory = 'KINETIC' | 'INSTALLATION' | 'ZONE';

export const CATEGORY_LABEL: Record<MarkerCategory, string> = {
  KINETIC:      'Kinetic',
  INSTALLATION: 'Installation',
  ZONE:         'Zone',
};

export const ALL_CATEGORIES: MarkerCategory[] = ['KINETIC', 'INSTALLATION', 'ZONE'];

// ─── Level 3: Type (within category) ─────────────────────────────────────────

export type KineticType      = 'AIRSTRIKE' | 'NAVAL_STRIKE' | 'BALLISTIC' | 'CRUISE' | 'DRONE';
export type InstallationType = 'CARRIER' | 'AIR_BASE' | 'NAVAL_BASE' | 'ARMY_BASE' | 'NUCLEAR_SITE' | 'COMMAND' | 'INFRASTRUCTURE';
export type ZoneType         = 'CLOSURE' | 'PATROL' | 'NFZ' | 'THREAT_CORRIDOR';

// Naval strikes use teal regardless of actor (visual convention: teal = maritime)
export const NAVAL_RGB: [number, number, number] = [50, 200, 200];

// ─── Level 4: Status ──────────────────────────────────────────────────────────

export type KineticStatus      = 'COMPLETE' | 'INTERCEPTED' | 'IMPACTED';
export type InstallationStatus = 'ACTIVE' | 'DEGRADED' | 'STRUCK' | 'DAMAGED' | 'DESTROYED';
export type MarkerStatus       = KineticStatus | InstallationStatus;

type StatusMeta = { label: string; cssVar: string };

export const STATUS_META: Record<MarkerStatus, StatusMeta> = {
  ACTIVE:      { label: 'Active',      cssVar: 'var(--success)' },
  DEGRADED:    { label: 'Degraded',    cssVar: 'var(--warning)' },
  STRUCK:      { label: 'Struck',      cssVar: 'var(--warning)' },
  DAMAGED:     { label: 'Damaged',     cssVar: 'var(--warning)' },
  DESTROYED:   { label: 'Destroyed',   cssVar: 'var(--danger)'  },
  INTERCEPTED: { label: 'Intercepted', cssVar: 'var(--info)'    },
  IMPACTED:    { label: 'Impacted',    cssVar: 'var(--danger)'  },
  COMPLETE:    { label: 'Complete',    cssVar: 'var(--t3)'      },
};

export const KINETIC_STATUSES:      KineticStatus[]      = ['COMPLETE', 'INTERCEPTED', 'IMPACTED'];
export const INSTALLATION_STATUSES: InstallationStatus[] = ['ACTIVE', 'DEGRADED', 'STRUCK', 'DAMAGED', 'DESTROYED'];
export const ALL_STATUSES:          MarkerStatus[]       = [...KINETIC_STATUSES, ...INSTALLATION_STATUSES];

// ─── Level 0: Priority ────────────────────────────────────────────────────────
// Assigned per-record based on strategic importance, not just severity.

export type Priority = 'P1' | 'P2' | 'P3';

type PriorityMeta = { label: string; description: string; cssVar: string; rgb: [number, number, number] };

export const PRIORITY_META: Record<Priority, PriorityMeta> = {
  P1: { label: 'P1',  description: 'Critical — changes the war',         cssVar: 'var(--danger)',  rgb: [231, 106, 110] },
  P2: { label: 'P2',  description: 'Major — significant battlefield impact', cssVar: 'var(--warning)', rgb: [236, 154,  60] },
  P3: { label: 'P3',  description: 'Standard — background / peripheral', cssVar: 'var(--t3)',      rgb: [143, 153, 168] },
};

export const ALL_PRIORITIES: Priority[] = ['P1', 'P2', 'P3'];
