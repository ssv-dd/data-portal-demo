// Mock detailed data for metric drill-down
// Extracted from MetricDetailModal.tsx

export const getDetailedAnalysis = (_metricId: string) => {
  // This would come from LLM in production
  return {
    what: {
      title: 'What Happened',
      description: 'Order frequency jumped to 4.1 orders per user over last 28 days, up from 3.88 last week (+5.5%). This is the highest frequency we\'ve seen in Q1 2026 and significantly above our target of 4.0.',
      assessment: 'This is a VERY POSITIVE signal - indicates strong user engagement.'
    },
    why: {
      title: 'Why It Moved (Root Cause Analysis)',
      primaryDrivers: [
        {
          name: 'Retention campaigns launched Jan 28',
          contribution: 42,
          details: [
            'Email "We miss you" campaign: 22% CTR (vs 12% baseline)',
            'Push notification re-engagement: 18% CTR (vs 9% baseline)',
            'Targeted $5 off coupons: 35% redemption rate',
            'These campaigns brought back 285K dormant users who placed an average of 2.1 orders since reactivation'
          ]
        },
        {
          name: 'DashPass subscriber behavior',
          contribution: 30,
          details: [
            'DashPass subs now at 4.8 orders/user (vs 4.3 last week)',
            'Non-subscribers: 3.2 orders/user (vs 3.1 last week)',
            'DashPass penetration grew 2 percentage points to 36%',
            'Higher-frequency users converting to DashPass at increased rate'
          ]
        }
      ],
      secondaryFactors: [
        {
          name: 'SuperBowl Sunday spike (Feb 11)',
          contribution: 20,
          details: [
            '15% order surge on that single day',
            'Many users placed multiple orders (party supplies + late snacks)',
            'This inflated the L28D rolling average'
          ]
        },
        {
          name: 'Weather effects (mixed)',
          contribution: 8,
          details: [
            'Good weather in West/South: Slight uptick in casual orders',
            'Bad weather in Northeast: Actually increased frequency among existing users (stay-home behavior)'
          ]
        }
      ]
    },
    who: {
      title: 'Who Drove It (User Segment Breakdown)',
      byUserType: [
        { segment: 'Existing high-frequency users (3+ orders/week)', change: 8.2, impact: 'Ordering even MORE frequently' },
        { segment: 'Medium-frequency users (1-2/week)', change: 6.8, impact: 'Moving up the frequency ladder' },
        { segment: 'Low-frequency users (<1/week)', change: 2.1, impact: 'Retention campaigns pulling some back' },
        { segment: 'Reactivated dormant users', change: null, impact: '+285K users reactivated' }
      ],
      byGeography: [
        { region: 'West Coast metros', change: 7.8, note: 'LA launch + good weather' },
        { region: 'South', change: 6.9, note: 'Strong SuperBowl engagement' },
        { region: 'Midwest', change: 5.2, note: 'Baseline growth' },
        { region: 'Northeast', change: 4.1, note: 'Weather suppressed but frequency held up' }
      ],
      byProduct: [
        { product: 'Restaurant orders', share: 82, note: 'Primary driver' },
        { product: 'Grocery add-on orders', share: 18, note: 'Users adding grocery to restaurant orders in same week' }
      ]
    },
    forecast: {
      title: 'Forecast & Trend',
      expected: 'Likely to settle at 4.0-4.05 next week as SuperBowl spike normalizes from the L28D rolling window',
      retentionImpact: 'Should persist for 2-3 more weeks',
      riskFactors: 'If reactivated users don\'t place 2nd order within 14 days, frequency could dip slightly in late Feb',
      confidence: 68,
      confidenceNote: 'SuperBowl anomaly makes forecasting fuzzy'
    },
    implications: {
      title: 'What This Means for the Business',
      positive: [
        'User engagement is increasing (core health metric)',
        'Retention tactics are working (validate continued investment)',
        'DashPass is delivering on promise (higher subscriber frequency)'
      ],
      however: [
        'SuperBowl created a temporary spike (don\'t over-index on this week)',
        'Need to convert reactivated users to sustained habit (2nd order within 14 days is critical)'
      ]
    },
    actions: [
      {
        priority: 'IMMEDIATE',
        title: 'Follow-up retention campaign',
        description: 'Target the 285K reactivated users with "Complete your 2nd order" incentive within 7 days. Boost 2nd order rate from 45% to 60%.',
        owner: 'Growth/Marketing',
        timeline: 'Launch by Feb 11'
      },
      {
        priority: 'THIS WEEK',
        title: 'Scale retention campaign playbook',
        description: 'High email CTR (22%) and push CTR (18%) suggest winning formula. Expand to broader dormant user base (1.2M users inactive 30+ days)',
        owner: 'CRM Team',
        timeline: 'Plan by Feb 15'
      },
      {
        priority: 'STRATEGIC',
        title: 'DashPass conversion focus',
        description: 'Gap between DashPass (4.8 freq) and non-DP (3.2 freq) is widening. Target users with 3+ orders in last 28 days who aren\'t DashPass yet (est. 2.1M)',
        owner: 'Product/Growth',
        timeline: 'Pilot test in 3 markets by Feb 20'
      },
      {
        priority: 'EXPERIMENT',
        title: 'Leverage SuperBowl learnings',
        description: 'Multi-order behavior on Feb 11 suggests "party mode" opportunity. Test for NBA All-Star (Feb 18), March Madness',
        owner: 'Product/Marketing',
        timeline: 'Ready for Feb 18'
      }
    ],
    relatedMetrics: [
      '2nd order rate for reactivated users (track daily)',
      'DashPass conversion rate (should uptick if action #3 executes)',
      'Retention rate (L28D, should improve if frequency sustains)',
      'CAC efficiency (if retention working, CAC impact should improve)'
    ]
  };
};

// Mock time series data
export const timeSeriesData = [
  { date: 'Dec 15', value: 3.55, label: '3.55' },
  { date: 'Dec 22', value: 3.58, label: '3.58' },
  { date: 'Dec 29', value: 3.62, label: '3.62' },
  { date: 'Jan 5', value: 3.65, label: '3.65' },
  { date: 'Jan 12', value: 3.68, label: '3.68' },
  { date: 'Jan 19', value: 3.60, label: '3.60' },
  { date: 'Jan 26', value: 3.70, label: '3.70' },
  { date: 'Feb 2', value: 3.88, label: '3.88' },
  { date: 'Feb 9', value: 4.10, label: '4.10' }
];

export const segmentData = [
  { segment: 'High-freq users', value: 8.2, color: '#3b82f6' },
  { segment: 'Med-freq users', value: 6.8, color: '#8b5cf6' },
  { segment: 'Low-freq users', value: 2.1, color: '#ec4899' }
];

export const geographyData = [
  { region: 'West Coast', value: 7.8, color: '#10b981' },
  { region: 'South', value: 6.9, color: '#3b82f6' },
  { region: 'Midwest', value: 5.2, color: '#f59e0b' },
  { region: 'Northeast', value: 4.1, color: '#ef4444' }
];
