export interface WatchlistMetric {
  id: string;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
  sparkline: number[];
}

export interface ProductAreaWatchlist {
  id: string;
  name: string;
  shortName: string;
  aiInsight: string;
  metrics: WatchlistMetric[];
}

export const productAreaWatchlists: ProductAreaWatchlist[] = [
  {
    id: 'company',
    name: 'Company / Top-line',
    shortName: 'Company',
    aiInsight: 'GOV up 9.1% WoW driven by SuperBowl promos. HQDR dipped in CANZ. 3 of 4 top-line metrics above plan.',
    metrics: [
      { id: 'company-gov', name: 'GOV', value: '$8.2B', change: '+9.1%', trend: 'up', sparkline: [7.1, 7.3, 7.6, 7.8, 7.5, 7.9, 8.2] },
      { id: 'company-revenue', name: 'Net Revenue', value: '$1.8B', change: '+8.5%', trend: 'up', sparkline: [1.5, 1.55, 1.6, 1.62, 1.68, 1.72, 1.8] },
      { id: 'company-mau', name: 'MAU (L28D)', value: '37.2M', change: '+4.8%', trend: 'up', sparkline: [33, 34, 34.5, 35, 35.8, 36.5, 37.2] },
    ],
  },
  {
    id: 'usmp',
    name: 'US Marketplace / Rx',
    shortName: 'US Mktplace',
    aiInsight: 'USMP GOV steady at +7.2%. DashPass subs accelerating — signups up 12% WoW. Tier 4-5 GOV softening.',
    metrics: [
      { id: 'usmp-gov', name: 'USMP GOV', value: '$5.8B', change: '+7.2%', trend: 'up', sparkline: [5.0, 5.1, 5.2, 5.3, 5.4, 5.6, 5.8] },
      { id: 'usmp-dp-subs', name: 'DP Paid Subs', value: '18.4M', change: '+3.1%', trend: 'up', sparkline: [16.8, 17.0, 17.3, 17.5, 17.8, 18.1, 18.4] },
      { id: 'usmp-freq', name: 'Order Freq (L28D)', value: '4.8x', change: '+2.1%', trend: 'up', sparkline: [4.4, 4.5, 4.5, 4.6, 4.7, 4.7, 4.8] },
    ],
  },
  {
    id: 'nv',
    name: 'US New Verticals',
    shortName: 'New Verticals',
    aiInsight: 'NV GOV up 15% — Grocery and Retail driving growth. HQFR needs attention at 88.3%. DashMart VP improving.',
    metrics: [
      { id: 'nv-gov', name: 'NV GOV', value: '$1.2B', change: '+15.2%', trend: 'up', sparkline: [0.85, 0.9, 0.95, 1.0, 1.05, 1.12, 1.2] },
      { id: 'nv-mau', name: 'NV MAU (L28D)', value: '8.6M', change: '+6.4%', trend: 'up', sparkline: [7.5, 7.7, 7.9, 8.0, 8.2, 8.4, 8.6] },
      { id: 'nv-hqfr', name: 'HQFR', value: '88.3%', change: '-1.2%', trend: 'down', sparkline: [90.1, 89.8, 89.5, 89.1, 88.8, 88.5, 88.3] },
    ],
  },
  {
    id: 'ads',
    name: 'Ads & Promos',
    shortName: 'Ads & Promos',
    aiInsight: 'Ad Revenue up 12% — ENT segment strong. CPG Ads accelerating. AR >90D trending up, needs monitoring.',
    metrics: [
      { id: 'ads-rev', name: 'Total A&P Revenue', value: '$420M', change: '+12.0%', trend: 'up', sparkline: [340, 350, 365, 380, 390, 405, 420] },
      { id: 'ads-igov', name: 'iGOV (Promo GOV)', value: '$680M', change: '+8.3%', trend: 'up', sparkline: [580, 600, 620, 640, 650, 665, 680] },
      { id: 'ads-ar90', name: 'AR >90D', value: '$18M', change: '+5.2%', trend: 'down', sparkline: [14, 14.5, 15, 15.8, 16.5, 17.2, 18] },
    ],
  },
  {
    id: 'dcp',
    name: 'DoorDash Commerce Platform',
    shortName: 'DCP',
    aiInsight: 'DCP Volume up 9%. Parcel OTD improving to 94.1%. Pathfinder churn down 0.4pp — retention strategy working.',
    metrics: [
      { id: 'dcp-vol', name: 'DCP Volume', value: '$310M', change: '+9.0%', trend: 'up', sparkline: [260, 270, 278, 285, 292, 300, 310] },
      { id: 'dcp-rev', name: 'DCP Net Revenue', value: '$42M', change: '+7.5%', trend: 'up', sparkline: [36, 37, 38, 39, 40, 41, 42] },
      { id: 'dcp-otd', name: 'Parcel OTD', value: '94.1%', change: '+1.3%', trend: 'up', sparkline: [91.5, 92.0, 92.5, 93.0, 93.4, 93.8, 94.1] },
    ],
  },
  {
    id: 'ddfb',
    name: 'DDfB',
    shortName: 'DDfB',
    aiInsight: 'Corporate GOV growing 11% WoW. 3 new Fortune 1000 logos signed. Catering GOV flat — seasonal pattern.',
    metrics: [
      { id: 'ddfb-gov', name: 'Corporate GOV', value: '$185M', change: '+11.0%', trend: 'up', sparkline: [150, 155, 160, 168, 172, 178, 185] },
      { id: 'ddfb-logos', name: 'F1000 Logos', value: '142', change: '+3', trend: 'up', sparkline: [128, 130, 133, 136, 138, 139, 142] },
      { id: 'ddfb-catering', name: 'Catering GOV', value: '$62M', change: '+0.5%', trend: 'flat', sparkline: [60, 61, 61, 62, 61.5, 62, 62] },
    ],
  },
  {
    id: 'canz',
    name: 'CANZ',
    shortName: 'CANZ',
    aiInsight: 'Canada GOV up 6.8%. AUS VP/order improving. NZ GOV soft — competitive pressure from local players.',
    metrics: [
      { id: 'canz-can-gov', name: 'Canada GOV', value: '$1.1B', change: '+6.8%', trend: 'up', sparkline: [0.92, 0.95, 0.98, 1.0, 1.03, 1.06, 1.1] },
      { id: 'canz-aus-gov', name: 'AUS GOV', value: '$480M', change: '+5.2%', trend: 'up', sparkline: [420, 430, 440, 450, 460, 470, 480] },
      { id: 'canz-can-vp', name: 'CAN VP/Order', value: '$2.15', change: '+4.1%', trend: 'up', sparkline: [1.85, 1.9, 1.95, 2.0, 2.05, 2.1, 2.15] },
    ],
  },
  {
    id: 'dasher',
    name: 'Dasher / Logistics',
    shortName: 'Dx / Lx',
    aiInsight: 'Dx Cost down 3 cents/order — batching improvements. ASAP at 28 min, best in 6 weeks. New Dx AR needs work.',
    metrics: [
      { id: 'dx-cost', name: 'Dx Cost ($/order)', value: '$4.82', change: '-0.6%', trend: 'up', sparkline: [5.1, 5.0, 4.95, 4.92, 4.88, 4.85, 4.82] },
      { id: 'dx-asap', name: 'ASAP (min)', value: '28', change: '-3.4%', trend: 'up', sparkline: [32, 31, 30, 29.5, 29, 28.5, 28] },
      { id: 'dx-eud', name: 'EUD (%)', value: '96.8%', change: '+0.2%', trend: 'up', sparkline: [96.0, 96.1, 96.3, 96.4, 96.5, 96.6, 96.8] },
    ],
  },
  {
    id: 'merchant',
    name: 'Merchant',
    shortName: 'Merchant',
    aiInsight: 'Cx pTAM coverage expanding steadily. 1D onboarding setup rate hit 78% — new high. Menu video coverage at 42%.',
    metrics: [
      { id: 'mx-ptam', name: 'Cx pTAM Added', value: '2.3%', change: '+0.4%', trend: 'up', sparkline: [1.5, 1.6, 1.8, 1.9, 2.0, 2.1, 2.3] },
      { id: 'mx-setup', name: '1D Setup Rate', value: '78%', change: '+2.1%', trend: 'up', sparkline: [70, 72, 73, 74, 75, 76, 78] },
      { id: 'mx-quality', name: 'Good New Mx (F28D)', value: '64%', change: '+1.8%', trend: 'up', sparkline: [58, 59, 60, 61, 62, 63, 64] },
    ],
  },
  {
    id: 'cxi',
    name: 'CXI',
    shortName: 'CXI',
    aiInsight: 'Total CXI cost down 4%. Fraud cost stable. Defect ratio improved — NV DR still elevated vs target.',
    metrics: [
      { id: 'cxi-cost', name: 'CXI Cost (cUE)', value: '$1.42', change: '-4.0%', trend: 'up', sparkline: [1.55, 1.52, 1.50, 1.48, 1.46, 1.44, 1.42] },
      { id: 'cxi-fraud', name: 'Fraud Cost (¢)', value: '8.2¢', change: '-0.5%', trend: 'up', sparkline: [8.8, 8.6, 8.5, 8.4, 8.3, 8.2, 8.2] },
      { id: 'cxi-dr', name: 'Defect Ratio', value: '3.1%', change: '-0.3%', trend: 'up', sparkline: [3.6, 3.5, 3.4, 3.3, 3.2, 3.2, 3.1] },
    ],
  },
  {
    id: 'money',
    name: 'Money',
    shortName: 'Money',
    aiInsight: 'Payment cost as % of GOV down 2bps. Gift card sales up 18% — seasonal tailwind. Mx Capital deployments steady.',
    metrics: [
      { id: 'money-pct', name: 'Pay Cost (% GOV)', value: '1.82%', change: '-0.02%', trend: 'up', sparkline: [1.90, 1.88, 1.87, 1.86, 1.85, 1.83, 1.82] },
      { id: 'money-gc', name: 'Gift Card Sales', value: '$28M', change: '+18.0%', trend: 'up', sparkline: [18, 20, 21, 23, 24, 26, 28] },
      { id: 'money-capital', name: 'Mx Capital Deployed', value: '$45M', change: '+3.2%', trend: 'up', sparkline: [40, 41, 42, 43, 43.5, 44, 45] },
    ],
  },
];

export const defaultExecAreas = ['company', 'usmp', 'ads', 'canz'];
export const defaultPodAreas: Record<string, string[]> = {
  'ads-promos-pod': ['ads', 'company'],
  'consumer-pod': ['usmp', 'company'],
  'nv-pod': ['nv', 'company'],
  'logistics-pod': ['dasher', 'company'],
};
