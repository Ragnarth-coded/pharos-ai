export interface XPost {
  id: string;
  handle: string;
  displayName: string;
  avatar: string;           // initials fallback
  avatarColor: string;
  verified: boolean;
  accountType: 'official' | 'journalist' | 'analyst' | 'military' | 'government';
  timestamp: string;
  content: string;
  images?: string[];        // placeholder URLs
  videoThumb?: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  conflictId?: string;
  eventId?: string;
  actorId?: string;
  significance: 'BREAKING' | 'HIGH' | 'STANDARD';
  pharosNote?: string;      // Pharos analyst annotation
}

function fmt(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}
export { fmt };

export const X_POSTS: XPost[] = [

  // ──────────────────────────────────────────────
  // MIDDLE EAST — Event: IDF precision strikes
  // ──────────────────────────────────────────────
  {
    id: 'x-001',
    handle: '@IDF',
    displayName: 'Israel Defense Forces',
    avatar: 'IDF',
    avatarColor: '#1a56db',
    verified: true,
    accountType: 'military',
    timestamp: '2026-03-01T13:42:00Z',
    content: 'CONFIRMED: IDF aircraft struck Hamas military infrastructure in northern Gaza. Targets included weapon storage facilities & command centers used to plan terror attacks against Israeli civilians.\n\nOperations ongoing. Updates to follow.',
    images: ['strike-aerial-1'],
    likes: 48200,
    retweets: 22100,
    replies: 9800,
    views: 4200000,
    conflictId: 'middle-east',
    eventId: 'evt-001',
    actorId: 'idf',
    significance: 'BREAKING',
    pharosNote: 'Official confirmation of airstrikes. Note: no civilian casualty count provided in this post — cross-reference with OCHA reports.',
  },
  {
    id: 'x-002',
    handle: '@OSINTdefender',
    displayName: 'OSINTdefender',
    avatar: 'OS',
    avatarColor: '#7c3aed',
    verified: true,
    accountType: 'analyst',
    timestamp: '2026-03-01T13:51:00Z',
    content: 'OSINT: Multiple explosions confirmed near Jabaliya refugee camp perimeter. Satellite thermal imagery shows strike signatures at coordinates consistent with known Hamas tunnel network exits.\n\nNot the first time strikes hit this grid ref. Thread ↓',
    images: ['osint-thermal-1', 'osint-map-1'],
    likes: 31400,
    retweets: 18900,
    replies: 4200,
    views: 2800000,
    conflictId: 'middle-east',
    eventId: 'evt-001',
    significance: 'HIGH',
    pharosNote: 'Credible open-source analyst. Thermal imagery is authentic but timestamp correlation should be verified independently.',
  },
  {
    id: 'x-003',
    handle: '@HamasMediaOffice',
    displayName: 'Hamas Media Office',
    avatar: 'HM',
    avatarColor: '#059669',
    verified: false,
    accountType: 'official',
    timestamp: '2026-03-01T14:04:00Z',
    content: 'The occupation\'s criminal bombardment of Jabaliya has martyred at least 14 civilians, including 6 children. The resistance will respond. The blood of our people will not be wasted.\n\n#Gaza #Resistance',
    likes: 22800,
    retweets: 14200,
    replies: 8100,
    views: 1900000,
    conflictId: 'middle-east',
    eventId: 'evt-001',
    actorId: 'hamas',
    significance: 'HIGH',
    pharosNote: '⚠️ Unverified casualty figure. Hamas-affiliated account — treat as propaganda with potential factual basis. Cross-reference with MSF and OCHA.',
  },
  {
    id: 'x-004',
    handle: '@Reuters',
    displayName: 'Reuters',
    avatar: 'R',
    avatarColor: '#ff6600',
    verified: true,
    accountType: 'journalist',
    timestamp: '2026-03-01T14:12:00Z',
    content: 'BREAKING: Israeli airstrikes hit northern Gaza. Palestinian health ministry reports at least 9 killed, 47 wounded. IDF says strikes targeted Hamas weapons cache. Al-Shifa hospital overwhelmed, doctors say.',
    likes: 67300,
    retweets: 41200,
    replies: 12300,
    views: 8900000,
    conflictId: 'middle-east',
    eventId: 'evt-001',
    significance: 'BREAKING',
    pharosNote: 'Tier 1 wire service. Health ministry figure (9 killed) is the most reliable count available at this stage.',
  },

  // ──────────────────────────────────────────────
  // MIDDLE EAST — Iran missile test
  // ──────────────────────────────────────────────
  {
    id: 'x-005',
    handle: '@PressTV',
    displayName: 'Press TV (Iran State)',
    avatar: 'PTV',
    avatarColor: '#065f46',
    verified: true,
    accountType: 'government',
    timestamp: '2026-02-28T09:15:00Z',
    content: '🚨 IRGC Aerospace Force has successfully tested the Shahab-3 medium-range ballistic missile in the Zagros mountain range. The missile hit its target with "pinpoint accuracy." Commander: "We are ready for any scenario."',
    images: ['iran-missile-1'],
    likes: 18400,
    retweets: 9200,
    replies: 6300,
    views: 3100000,
    conflictId: 'middle-east',
    eventId: 'evt-003',
    actorId: 'iran',
    significance: 'BREAKING',
    pharosNote: '⚠️ Iranian state media. Test independently confirmed by US NRO satellite pass. Range and accuracy claims should be treated skeptically.',
  },
  {
    id: 'x-006',
    handle: '@JakeSullivan46',
    displayName: 'Jake Sullivan · NSA',
    avatar: 'JS',
    avatarColor: '#1d4ed8',
    verified: true,
    accountType: 'government',
    timestamp: '2026-02-28T10:22:00Z',
    content: 'I spoke with Israeli NSC Director Ben-Shabat regarding Iran\'s provocative ballistic missile test. The United States will not allow Iran to threaten Israel or our regional partners. We are monitoring the situation closely and coordinating with allies.',
    likes: 42100,
    retweets: 19800,
    replies: 7200,
    views: 5400000,
    conflictId: 'middle-east',
    eventId: 'evt-003',
    actorId: 'us',
    significance: 'HIGH',
    pharosNote: 'Direct US government signal. "Coordinating with allies" language is code for NATO consultation — suggests Article 4-adjacent discussions.',
  },

  // ──────────────────────────────────────────────
  // UKRAINE — Kharkiv buildup
  // ──────────────────────────────────────────────
  {
    id: 'x-007',
    handle: '@GeoConfirmed',
    displayName: 'GeoConfirmed',
    avatar: 'GC',
    avatarColor: '#0891b2',
    verified: true,
    accountType: 'analyst',
    timestamp: '2026-03-01T07:44:00Z',
    content: 'GEOLOCATED: Russian 20th Combined Arms Army equipment column spotted moving toward Valuyki staging area, ~45km from Ukrainian border. Column includes T-72B3 MBTs, BMP-3 IFVs, and Grad MLRS systems.\n\nThis matches the pattern from early Feb 2022. Not a drill.',
    images: ['ukraine-column-geo-1', 'ukraine-column-geo-2'],
    likes: 89400,
    retweets: 52300,
    replies: 14100,
    views: 11200000,
    conflictId: 'ukraine',
    eventId: 'evt-004',
    significance: 'BREAKING',
    pharosNote: 'Geolocations independently verified by Pharos team. Column composition consistent with offensive rather than defensive posture. High confidence.',
  },
  {
    id: 'x-008',
    handle: '@DefenceHQ',
    displayName: 'UK Ministry of Defence',
    avatar: 'UK',
    avatarColor: '#1d4ed8',
    verified: true,
    accountType: 'government',
    timestamp: '2026-03-01T08:30:00Z',
    content: '🇬🇧 Latest Defence Intelligence update on Russia\'s invasion of Ukraine.\n\nRussia has repositioned significant armoured forces near Kharkiv Oblast. This almost certainly represents preparation for renewed offensive operations. The timing — amid Middle East tensions — is significant.\n\nFull assessment ↓',
    likes: 31200,
    retweets: 24100,
    replies: 4800,
    views: 6700000,
    conflictId: 'ukraine',
    eventId: 'evt-004',
    significance: 'HIGH',
    pharosNote: 'UK MOD daily intelligence updates are Tier 1 — consistently accurate. "Almost certainly" is UK intelligence community\'s highest confidence language.',
  },
  {
    id: 'x-009',
    handle: '@warmonitor_',
    displayName: 'War Monitor',
    avatar: 'WM',
    avatarColor: '#dc2626',
    verified: true,
    accountType: 'journalist',
    timestamp: '2026-03-01T09:12:00Z',
    content: 'JUST IN: Ukrainian General Staff confirms Russian force concentration near Kharkiv. 15,000+ troops. Air defense units activated across northeastern Ukraine. President Zelensky convening emergency security council.',
    videoThumb: 'ukraine-briefing-thumb',
    likes: 44800,
    retweets: 31200,
    replies: 8900,
    views: 7800000,
    conflictId: 'ukraine',
    eventId: 'evt-004',
    significance: 'BREAKING',
  },

  // ──────────────────────────────────────────────
  // UKRAINE — Cyberattack on EU energy
  // ──────────────────────────────────────────────
  {
    id: 'x-010',
    handle: '@CISA_Cyber',
    displayName: 'CISA Cybersecurity',
    avatar: 'CIA',
    avatarColor: '#4f46e5',
    verified: true,
    accountType: 'government',
    timestamp: '2026-02-28T11:30:00Z',
    content: 'ALERT: CISA and European partners have identified an active Russian state-sponsored cyber campaign targeting European energy infrastructure. APT attribution: SANDWORM. Affected sectors: electricity grid management, pipeline control systems.\n\nMitigations: cisa.gov/russia-cyber',
    likes: 28900,
    retweets: 22400,
    replies: 3200,
    views: 4100000,
    conflictId: 'cyber',
    eventId: 'evt-005',
    actorId: 'russia',
    significance: 'BREAKING',
    pharosNote: 'CISA official attribution. SANDWORM is GRU Unit 74455 — same group behind 2015-16 Ukraine power grid attacks. This is a major escalation.',
  },
  {
    id: 'x-011',
    handle: '@Mandiant',
    displayName: 'Mandiant Intelligence',
    avatar: 'MI',
    avatarColor: '#dc2626',
    verified: true,
    accountType: 'analyst',
    timestamp: '2026-02-28T12:15:00Z',
    content: 'We can confirm the @CISA_Cyber advisory. Mandiant has tracked this SANDWORM campaign since late February. Initial vector: spear-phishing of OT engineers. The tooling matches APT44 infrastructure used in previous attacks on Ukrainian energy.\n\nFull IOC report: mandiant.com/apt44-2026',
    likes: 19800,
    retweets: 14200,
    replies: 2100,
    views: 2800000,
    conflictId: 'cyber',
    eventId: 'evt-005',
    significance: 'HIGH',
    pharosNote: 'Tier 1 private intelligence. IOC list is actionable — relevant security teams should be notified.',
  },

  // ──────────────────────────────────────────────
  // NATO — Article 4 consultation
  // ──────────────────────────────────────────────
  {
    id: 'x-012',
    handle: '@NATO',
    displayName: 'NATO',
    avatar: 'NATO',
    avatarColor: '#003189',
    verified: true,
    accountType: 'official',
    timestamp: '2026-03-01T10:15:00Z',
    content: 'Allies have activated Article 4 consultations at Poland\'s request, in light of the significant Russian military buildup near Ukraine\'s borders and ongoing hybrid attacks against Allied infrastructure.\n\nNATO\'s Very High Readiness Joint Task Force has been placed on elevated alert.',
    likes: 38900,
    retweets: 29400,
    replies: 6700,
    views: 9200000,
    conflictId: 'nato-europe',
    eventId: 'evt-007',
    actorId: 'nato',
    significance: 'BREAKING',
    pharosNote: 'This is significant. Article 4 is formal consultation — one step below Article 5. First invocation since 2022.',
  },
  {
    id: 'x-013',
    handle: '@andersfogh',
    displayName: 'Jens Stoltenberg · Fmr NATO SecGen',
    avatar: 'AS',
    avatarColor: '#1d4ed8',
    verified: true,
    accountType: 'analyst',
    timestamp: '2026-03-01T11:00:00Z',
    content: 'Russia is testing NATO\'s resolve. The simultaneous escalation across Ukraine, the Middle East, and in cyberspace is not coincidental — it is coordinated. NATO must respond with unity and strength. This is exactly the moment the alliance was built for.',
    likes: 52300,
    retweets: 31800,
    replies: 8900,
    views: 12400000,
    conflictId: 'nato-europe',
    eventId: 'evt-007',
    significance: 'HIGH',
    pharosNote: 'Former SecGen with deep institutional knowledge. Assessment aligns with Pharos multi-theatre coordination analysis.',
  },

  // ──────────────────────────────────────────────
  // CHINA-TAIWAN — Median line crossings
  // ──────────────────────────────────────────────
  {
    id: 'x-014',
    handle: '@MoNDefense',
    displayName: 'Taiwan Ministry of National Defense',
    avatar: 'TW',
    avatarColor: '#dc143c',
    verified: true,
    accountType: 'military',
    timestamp: '2026-03-01T05:22:00Z',
    content: '【ALERT】 6x J-16 fighters and 2x Y-9 reconnaissance aircraft detected crossing the Taiwan Strait median line at 0438 local time. Air force scrambled. Missile defense systems activated. Situation normal — but watch closely.',
    images: ['taiwan-radar-track-1'],
    likes: 41200,
    retweets: 28900,
    replies: 7300,
    views: 8700000,
    conflictId: 'china-taiwan',
    eventId: 'evt-009',
    actorId: 'china',
    significance: 'HIGH',
    pharosNote: 'MOD Taiwan is reliable. 8-aircraft crossing is above daily average (usually 2-4). Y-9 ELINT variant suggests intelligence-gathering component.',
  },
  {
    id: 'x-015',
    handle: '@IndoPac_Info',
    displayName: 'Indo-Pacific News',
    avatar: 'IP',
    avatarColor: '#0891b2',
    verified: true,
    accountType: 'journalist',
    timestamp: '2026-03-01T06:01:00Z',
    content: 'NEW: USS Ronald Reagan and USS Carl Vinson carrier strike groups are now operating within mutual supporting distance in the Philippine Sea. Timing of this dual-CSG posture with PLA median line crossings is not coincidental. Naval show of force in progress.',
    images: ['uss-reagan-philippine-sea'],
    likes: 67800,
    retweets: 42100,
    replies: 11200,
    views: 14300000,
    conflictId: 'china-taiwan',
    eventId: 'evt-009',
    significance: 'HIGH',
    pharosNote: 'Dual-carrier posture is a significant US deterrence signal. Last time this happened was during 3rd Taiwan Strait Crisis.',
  },

  // ──────────────────────────────────────────────
  // GENERAL FIELD POSTS — raw conflict footage
  // ──────────────────────────────────────────────
  {
    id: 'x-016',
    handle: '@ragipsoylu',
    displayName: 'Ragip Soylu · MEE',
    avatar: 'RS',
    avatarColor: '#7c3aed',
    verified: true,
    accountType: 'journalist',
    timestamp: '2026-03-01T15:30:00Z',
    content: 'EXCLUSIVE: Turkish intelligence has shared concerns with US counterparts that IRGC is pre-positioning cruise missiles in Syria that could reach Israel, Cyprus, and US bases. Ankara is quietly coordinating with NATO on contingency planning.\n\n(via senior Turkish official, background)',
    likes: 28900,
    retweets: 19400,
    replies: 5600,
    views: 6800000,
    conflictId: 'middle-east',
    significance: 'HIGH',
    pharosNote: 'Ragip Soylu is a credible reporter with strong Turkish government sourcing. Cannot independently verify but aligns with satellite imagery of Syrian positioning.',
  },
  {
    id: 'x-017',
    handle: '@mod_russia',
    displayName: 'Russian MoD',
    avatar: 'RU',
    avatarColor: '#dc2626',
    verified: true,
    accountType: 'government',
    timestamp: '2026-03-01T08:00:00Z',
    content: 'The Russian Armed Forces are conducting scheduled training exercises in the Southern Military District. These exercises are purely defensive in nature and do not threaten any state. NATO\'s alarmism serves only the interests of the military-industrial complex.',
    likes: 8400,
    retweets: 4200,
    replies: 12300,
    views: 2100000,
    conflictId: 'ukraine',
    actorId: 'russia',
    significance: 'STANDARD',
    pharosNote: '⚠️ Russian MoD statement contradicts OSINT, UK MOD intelligence, and Ukrainian General Staff reporting. Treat as disinformation. "Scheduled exercises" framing used identically in Feb 2022.',
  },
];

// Helper: get posts for a specific event
export function getPostsForEvent(eventId: string): XPost[] {
  return X_POSTS.filter(p => p.eventId === eventId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Helper: get posts for a specific actor
export function getPostsForActor(actorId: string): XPost[] {
  return X_POSTS.filter(p => p.actorId === actorId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Helper: get posts for a conflict (latest)
export function getPostsForConflict(conflictId: string): XPost[] {
  return X_POSTS.filter(p => p.conflictId === conflictId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);
}

export const ACCOUNT_TYPE_STYLE: Record<XPost['accountType'], { label: string; color: string }> = {
  official:   { label: 'OFFICIAL',   color: '#1d4ed8' },
  journalist: { label: 'JOURNALIST', color: '#7c3aed' },
  analyst:    { label: 'ANALYST',    color: '#0891b2' },
  military:   { label: 'MILITARY',   color: '#dc2626' },
  government: { label: 'GOVT',       color: '#059669' },
};
