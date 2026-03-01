// Real actors from Operation Epic Fury
// Sources: Reuters, ISW/CTP, Wikipedia

export type ActivityLevel = 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE';
export type Stance = 'AGGRESSOR' | 'DEFENDER' | 'RETALIATING' | 'PROXY' | 'NEUTRAL' | 'CONDEMNING';

export interface RecentAction {
  date: string; // ISO date
  type: 'MILITARY' | 'DIPLOMATIC' | 'POLITICAL' | 'ECONOMIC' | 'INTELLIGENCE';
  description: string;
  verified: boolean;
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Actor {
  id: string;
  name: string;
  fullName: string;
  countryCode?: string;
  type: 'STATE' | 'NON-STATE' | 'ORGANIZATION' | 'INDIVIDUAL';
  activityLevel: ActivityLevel;
  activityScore: number; // 0-100
  stance: Stance;
  saying: string;        // official public position
  doing: string[];       // verified observed actions
  assessment: string;    // Pharos analytical assessment
  recentActions: RecentAction[];
  keyFigures: string[];
  linkedEventIds: string[];
}

export const ACTORS: Actor[] = [
  {
    id: 'us',
    name: 'United States',
    fullName: 'United States — DoD / CENTCOM',
    countryCode: 'us',
    type: 'STATE',
    activityLevel: 'CRITICAL',
    activityScore: 97,
    stance: 'AGGRESSOR',
    saying: '"The United States has launched strikes on Iran alongside our great ally Israel. Their nuclear program is being destroyed. We are doing this not for now, we are doing this for the future. It is a noble mission. Everything is ahead of schedule." — President Trump, Mar-a-Lago, March 1, 2026',
    doing: [
      'B-2 Spirit bombers delivering GBU-57 MOPs against Fordow and Natanz — 14 dropped, largest B-2 operational strike in US history',
      'USS Gerald R. Ford CSG launching Tomahawk cruise missiles against Iranian air defense networks',
      'USAF F-22 and F-15 providing strike escort and SEAD across western Iran',
      'CIA conducting intelligence-sharing and targeting support for Israeli decapitation operations',
      'US 5th Fleet maintaining posture in Persian Gulf despite Iranian strikes on regional bases',
      'Trump directing operations from Mar-a-Lago; no formal war declaration to Congress',
    ],
    assessment: 'The US is the lead strategic actor in Operation Epic Fury, with the Israeli operation (Roaring Lion) nested within the US campaign framework. The use of 14 GBU-57 MOPs against Fordow and Natanz represents the definitive use of the full US conventional arsenal against hardened targets. Legal basis under the War Powers Resolution is contested — Sen. Warner (D-VA) publicly stated there was "no intelligence" supporting the preemptive self-defense justification. Trump\'s domestic political position is strong with Republicans but the operation has created significant bipartisan friction. Three US service members KIA as of March 1.',
    recentActions: [
      { date: '2026-02-28', type: 'MILITARY',   description: 'B-2 bombers launched GBU-57 MOPs on Fordow and Natanz — 14 total dropped',                              verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'MILITARY',   description: 'Tomahawk cruise missiles from USS Ford CSG suppressed Iranian air defenses in opening strike wave',       verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'POLITICAL',  description: 'Trump posted video to Truth Social announcing strikes, calling on Iranian people to rise up',             verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'MILITARY',   description: 'F-15 and F-22 escort operations over western Iran providing SEAD and CAP',                               verified: true,  significance: 'MEDIUM' },
      { date: '2026-03-01', type: 'POLITICAL',  description: 'Trump told CNBC operation is "ahead of schedule" and "moving in a very positive direction"',              verified: true,  significance: 'MEDIUM' },
      { date: '2026-03-01', type: 'DIPLOMATIC', description: 'US vetoed UN Security Council ceasefire resolution introduced by Russia and China',                       verified: true,  significance: 'HIGH' },
    ],
    keyFigures: ['President Donald Trump', 'SecDef Pete Hegseth', 'CENTCOM Commander Gen. Dan Caine', 'VADM Brad Cooper (5th Fleet)'],
    linkedEventIds: ['evt-001', 'evt-002', 'evt-005', 'evt-008', 'evt-011'],
  },
  {
    id: 'idf',
    name: 'Israel',
    fullName: 'Israel — IDF / Mossad',
    countryCode: 'il',
    type: 'STATE',
    activityLevel: 'CRITICAL',
    activityScore: 96,
    stance: 'AGGRESSOR',
    saying: '"The IDF is conducting Operation Roaring Lion to remove existential threats to Israel — the Iranian nuclear and missile programs and the Axis of Resistance. Strikes against nuclear sites will continue in the coming days." — PM Netanyahu, February 28, 2026',
    doing: [
      'IDF F-35I Adir jets striking Iranian leadership compounds in Tehran — Khamenei compound struck',
      'Decapitation strikes: IRGC Commander Pakpour, Defense Minister Nasirzadeh, NSC Secretary Shamkhani, Army Chief Mousavi — all confirmed killed',
      'F-15I Ra\'am aircraft striking Natanz above-ground infrastructure and Isfahan nuclear complex',
      'IDF targeting "hundreds of military targets" including missile launchers in western Iran',
      'IRGC Navy frigate IRIS Jamaran struck at Bandar Abbas berth (unconfirmed destruction)',
      'Home Front Command operating at full mobilization — nationwide shelter-in-place orders',
      'Arrow-3 and Arrow-2 and Iron Dome intercepting Iranian missile and drone barrages against Israel',
    ],
    assessment: 'Israel achieved its maximum strategic objective on Day 1 — eliminating Khamenei and the entire Iranian security leadership simultaneously. The decapitation of five key commanders and ministers in a single operation has no modern precedent. The IDF is now executing a sustained campaign against nuclear and missile infrastructure, with Netanyahu publicly committing to continued strikes. Arrow-3 and Iron Dome partially held against Iranian retaliation (11 Israeli civilians killed). Ben Gurion Airport closure creates a civilian vulnerability. The most significant risk is Hezbollah opening a northern front.',
    recentActions: [
      { date: '2026-02-28', type: 'MILITARY',     description: 'F-35I aircraft struck Khamenei residential compound in Saadatabad, Tehran — Khamenei confirmed killed',  verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'INTELLIGENCE', description: 'Mossad/Unit 8200 provided targeting coordinates for leadership decapitation strikes across Tehran',      verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'MILITARY',     description: 'F-15I struck Natanz above-ground pilot fuel enrichment plant simultaneously with US MOP strikes',        verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'MILITARY',     description: 'Struck hundreds of missile launcher sites in western Iran to degrade retaliatory capability',             verified: true,  significance: 'HIGH' },
      { date: '2026-03-01', type: 'MILITARY',     description: 'Continued strikes on Isfahan nuclear complex, Parchin explosive research facility, IRGC Navy assets',   verified: true,  significance: 'HIGH' },
      { date: '2026-03-01', type: 'POLITICAL',    description: 'Netanyahu publicly committed to continued strikes: "The job is not finished"',                           verified: true,  significance: 'MEDIUM' },
    ],
    keyFigures: ['PM Benjamin Netanyahu', 'DefMin Israel Katz', 'IDF Chief Eyal Zamir', 'IAF Commander Tomer Bar'],
    linkedEventIds: ['evt-001', 'evt-003', 'evt-004', 'evt-010'],
  },
  {
    id: 'iran',
    name: 'Iran',
    fullName: 'Islamic Republic of Iran — Transitional Government',
    countryCode: 'ir',
    type: 'STATE',
    activityLevel: 'CRITICAL',
    activityScore: 88,
    stance: 'RETALIATING',
    saying: '"The Islamic Republic confirms the martyrdom of the Supreme Leader. The revolution will not die with him. All Islamic forces have been called to maximum retaliation. The Zionist enemy and its American sponsors will pay the full price." — Iranian Transitional Government statement, Feb 28 2026',
    doing: [
      'Launched 35+ Shahab-3, Emad, and Kheibar Shekan ballistic missiles at Israel — 11 Israeli civilians killed, 450+ injured',
      'Simultaneously struck US military bases in Bahrain, Qatar, Kuwait, UAE, Jordan, and Saudi Arabia — 3 US KIA confirmed',
      'IRGC formally declared Strait of Hormuz closed — 200+ vessels anchored, 14M bbl/day disrupted',
      'IRGC fast-attack craft positioned to enforce Hormuz closure against vessel transit',
      'Iranian proxy networks (Popular Mobilization Forces, Kata\'ib Hezbollah) activated in Iraq against US assets',
      'Transitional government forming under Pezeshkian / Mohseni Ejei / Arafi — constitutional succession',
      'Iranian state media maintaining narrative of "maximum retaliation" despite severe leadership losses',
    ],
    assessment: 'Iran has suffered a catastrophic decapitation of its entire security and political leadership in a single day — an event without modern precedent. The simultaneous killing of the Supreme Leader, IRGC Commander, Defense Minister, Army Chief, and NSC Secretary represents the destruction of Iran\'s command structure. The transitional government lacks the authority and cohesion of the former leadership. Retaliation has been substantial but Iran\'s missile inventory was significantly degraded in the 2025 12-day war. Significant domestic celebration of Khamenei\'s death suggests the regime may not be able to mobilize the public support needed for sustained conflict. The key strategic question is whether the IRGC can maintain operational cohesion without its command structure.',
    recentActions: [
      { date: '2026-02-28', type: 'MILITARY',  description: 'Launched 35+ ballistic missiles at Israel (Shahab-3, Emad, Kheibar Shekan) — 11 Israeli civilians killed', verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'MILITARY',  description: 'Struck US bases in Bahrain, Qatar, Kuwait, UAE, Jordan, Saudi Arabia — 3 US KIA',                        verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'MILITARY',  description: 'IRGC declared Strait of Hormuz closed; 200+ vessels anchored in surrounding waters',                     verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'POLITICAL', description: 'IRNA confirmed Khamenei\'s death at 14:30 UTC after initial denial',                                      verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'MILITARY',  description: 'Iranian proxies (PMF, Kata\'ib Hezbollah) activated against US targets in Iraq',                         verified: false, significance: 'HIGH' },
      { date: '2026-03-01', type: 'POLITICAL', description: 'Pezeshkian, Mohseni Ejei, Arafi form transitional leadership collective under constitutional succession', verified: true,  significance: 'HIGH' },
    ],
    keyFigures: ['President Masoud Pezeshkian (transitional)', 'Judiciary Chief Mohseni Ejei', 'Assembly of Experts head Alireza Arafi', 'IRGC (leaderless — acting command unknown)'],
    linkedEventIds: ['evt-003', 'evt-004', 'evt-005', 'evt-006', 'evt-007'],
  },
  {
    id: 'irgc',
    name: 'IRGC',
    fullName: 'Islamic Revolutionary Guard Corps',
    countryCode: 'ir',
    type: 'NON-STATE',
    activityLevel: 'CRITICAL',
    activityScore: 82,
    stance: 'RETALIATING',
    saying: '"The IRGC confirms the launch of Operation True Promise 3 in response to the criminal aggression of the Zionist entity and its American sponsors. All IRGC forces are at maximum alert. The Strait of Hormuz is closed." — IRGC Spokesperson, February 28, 2026',
    doing: [
      'Executing Operation True Promise 3 — retaliatory missile and drone attacks on Israel and US bases',
      'Enforcing Strait of Hormuz closure via IRGC Navy fast-attack craft and shore-based missiles',
      'Three tankers damaged in Gulf — unclear if deliberate IRGC action',
      'Activating proxy network: Houthis, PMF, Kata\'ib Hezbollah across the region',
      'Acting under severely degraded command — Commander Pakpour killed, replacement unknown',
    ],
    assessment: 'The IRGC is the most operationally dangerous actor in the near term despite catastrophic leadership losses. General Pakpour\'s death — his second replacement since Salami was killed in June 2025 — leaves the IRGC\'s nuclear and strategic missile programs under unclear command. However, IRGC units are executing pre-planned retaliatory protocols. The Hormuz closure is the IRGC\'s most powerful remaining economic weapon. The fast-attack craft and shore-based Noor anti-ship missiles represent a credible threat to any vessel in the Strait.',
    recentActions: [
      { date: '2026-02-28', type: 'MILITARY', description: 'Launched Operation True Promise 3 — 35+ missiles at Israel and simultaneous Gulf base strikes', verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'MILITARY', description: 'Declared Strait of Hormuz closed; fast-attack craft deployed to enforce closure',               verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'MILITARY', description: 'IRGC Navy struck civilian aviation infrastructure (Kuwait, UAE airports)',                       verified: true,  significance: 'HIGH' },
      { date: '2026-03-01', type: 'MILITARY', description: 'Three tankers damaged in Gulf — cause unclear (deliberate vs accident)',                         verified: false, significance: 'MEDIUM' },
    ],
    keyFigures: ['Acting Commander (identity unknown)', 'IRGC Navy Commander (active)', 'IRGC Aerospace Force (Shahed/missile ops)'],
    linkedEventIds: ['evt-004', 'evt-005', 'evt-006'],
  },
  {
    id: 'houthis',
    name: 'Houthis',
    fullName: 'Houthi Movement / Ansar Allah — Yemen',
    countryCode: 'ye',
    type: 'NON-STATE',
    activityLevel: 'HIGH',
    activityScore: 71,
    stance: 'PROXY',
    saying: '"In support of our brothers in Iran and in response to the criminal aggression of the US and Zionist entity, the Yemeni Armed Forces declare the resumption of military operations against all ships of our enemies in the Red Sea, Bab el-Mandeb, and Arabian Sea." — Houthi Military Spokesperson, February 28, 2026',
    doing: [
      'Announced resumption of Red Sea shipping attacks after period of relative calm',
      'Bab el-Mandeb Strait now declared a Houthi exclusion zone',
      'Maersk and other carriers confirming Red Sea route is untenable',
      'Preparing launch capability against Israeli targets (reactivating long-range Houthi missile/drone systems)',
    ],
    assessment: 'The Houthi resumption of Red Sea attacks effectively closes both key maritime chokepoints simultaneously — the Strait of Hormuz (IRGC) and Bab el-Mandeb (Houthis). This is the most severe maritime disruption to global trade since the Suez Crisis. Combined with the Hormuz closure, virtually all Gulf oil/gas exports are disrupted. The Houthis are a force multiplier for Iran\'s economic warfare strategy even as Iran\'s conventional military command is degraded. Their resumption of attacks before any US response to the Hormuz closure suggests pre-coordination with Iran.',
    recentActions: [
      { date: '2026-02-28', type: 'MILITARY', description: 'Announced resumption of all Red Sea shipping attacks in solidarity with Iran',         verified: true,  significance: 'HIGH' },
      { date: '2026-02-28', type: 'MILITARY', description: 'Bab el-Mandeb declared exclusion zone; Maersk and MSC confirming route suspension',    verified: true,  significance: 'HIGH' },
    ],
    keyFigures: ['Abdul-Malik al-Houthi (leader)', 'Yahya Saree (military spokesperson)'],
    linkedEventIds: ['evt-009'],
  },
  {
    id: 'russia',
    name: 'Russia',
    fullName: 'Russian Federation',
    countryCode: 'ru',
    type: 'STATE',
    activityLevel: 'ELEVATED',
    activityScore: 52,
    stance: 'CONDEMNING',
    saying: '"Russia condemns the illegal military strikes on civilian nuclear infrastructure under IAEA safeguards. This is a gross violation of international law and Iranian sovereignty. Russia has called for an immediate IAEA emergency session and a UN Security Council ceasefire." — Russian MFA, February 28, 2026',
    doing: [
      'Called emergency IAEA Board of Governors session',
      'Co-sponsored UN Security Council ceasefire resolution with China (vetoed by US)',
      'Convened emergency Security Council session',
      'Providing Iran with satellite intelligence to assess strike damage (unverified)',
    ],
    assessment: 'Russia is exploiting the Iran crisis diplomatically while likely providing some intelligence support to Iran. The IAEA and UNSC moves are aimed at delegitimizing the US operation internationally. Russia\'s real concern is the precedent set by the destruction of safeguarded nuclear facilities — a precedent that could theoretically apply to Russian nuclear infrastructure.',
    recentActions: [
      { date: '2026-02-28', type: 'DIPLOMATIC',   description: 'Called for emergency IAEA Board of Governors session',                                 verified: true,  significance: 'MEDIUM' },
      { date: '2026-02-28', type: 'DIPLOMATIC',   description: 'Co-sponsored UNSC ceasefire resolution with China — vetoed by US',                     verified: true,  significance: 'MEDIUM' },
      { date: '2026-03-01', type: 'INTELLIGENCE', description: 'Unverified reports of Russian satellite intel sharing with Iranian IRGC remnants',      verified: false, significance: 'HIGH' },
    ],
    keyFigures: ['FM Sergei Lavrov', 'Russian UN Ambassador Vasily Nebenzya', 'Russian IAEA Representative'],
    linkedEventIds: ['evt-008'],
  },
];

export const ACT_C: Record<ActivityLevel, string> = {
  CRITICAL: 'var(--danger)',
  HIGH:     'var(--warning)',
  ELEVATED: 'var(--info)',
  MODERATE: 'var(--t2)',
};

export const STA_C: Record<Stance, string> = {
  AGGRESSOR:   'var(--danger)',
  DEFENDER:    'var(--info)',
  RETALIATING: 'var(--warning)',
  PROXY:       'var(--warning)',
  NEUTRAL:     'var(--t3)',
  CONDEMNING:  'var(--t2)',
};
