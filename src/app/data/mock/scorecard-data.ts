import type { ProductArea, AIExecutiveSummary, SourceDashboard } from '@/types';
import { appConfig } from '@/config/app.config';

// Mock data based on WBR structure
export const productAreas: ProductArea[] = [
  {
    id: 'company',
    name: 'Company / Top-line',
    overallStatus: 'excellent',
    metrics: [
      {
        id: 'company-gov',
        category: 'Financial',
        name: 'GOV (Gross Order Value)',
        description: 'Total value of all orders placed across all platforms',
        current: '$8.2B',
        prior: '$7.5B',
        change: 9.1,
        changeLabel: '+9.1%',
        vsPlan: '+2.0%',
        vsPlanValue: 2.0,
        trend: [7.1, 7.3, 7.6, 7.8, 7.5, 7.9, 8.2],
        status: 'excellent',
        aiInsight: {
          summary: 'SuperBowl Sunday drove +15% spike, offset by weather impacts in CANZ',
          confidence: 94,
          details: 'Primary driver is US Marketplace SuperBowl promotions. LA market launch contributed +$82M.'
        }
      },
      {
        id: 'company-revenue',
        category: 'Financial',
        name: 'Revenue (Net)',
        description: 'Total net revenue after refunds and adjustments',
        current: '$1.8B',
        prior: '$1.66B',
        change: 8.5,
        changeLabel: '+8.5%',
        vsPlan: '+1.5%',
        vsPlanValue: 1.5,
        trend: [1.58, 1.61, 1.64, 1.68, 1.63, 1.72, 1.8],
        status: 'healthy',
        aiInsight: {
          summary: 'Revenue growth tracking GOV, take rate stable at 22%',
          confidence: 92
        }
      },
      {
        id: 'company-contribution',
        category: 'Financial',
        name: 'Contribution Margin',
        description: 'Revenue minus variable costs (delivery, support, payment processing)',
        current: '$1.2B',
        prior: '$1.14B',
        change: 5.3,
        changeLabel: '+5.3%',
        vsPlan: '+0.8%',
        vsPlanValue: 0.8,
        trend: [1.08, 1.10, 1.12, 1.15, 1.11, 1.17, 1.2],
        status: 'excellent',
        aiInsight: {
          summary: 'Routing efficiency improvements delivering results (-2.1 min delivery time)',
          confidence: 89
        }
      },
      {
        id: 'company-vp-order',
        category: 'Financial',
        name: 'VP/order (unit economics)',
        description: 'Variable profit per order',
        current: '$1.45',
        prior: '$1.48',
        change: -2.1,
        changeLabel: '-2.1%',
        vsPlan: '-1.2%',
        vsPlanValue: -1.2,
        trend: [1.52, 1.51, 1.49, 1.48, 1.47, 1.46, 1.45],
        status: 'warning',
        aiInsight: {
          summary: 'Declining 4 weeks straight. Investigate if promotional intensity offsetting efficiency gains',
          confidence: 78
        }
      },
      {
        id: 'company-mau',
        category: 'Operational',
        name: 'MAUs (L28D EOP)',
        description: 'Monthly active users over last 28 days, end of period',
        current: '34.5M',
        prior: '33.4M',
        change: 3.2,
        changeLabel: '+3.2%',
        vsPlan: '+1.5%',
        vsPlanValue: 1.5,
        trend: [32.8, 33.1, 33.4, 33.7, 33.2, 34.0, 34.5],
        status: 'healthy',
        aiInsight: {
          summary: 'Steady growth across all markets, retention campaigns working',
          confidence: 91
        }
      },
      {
        id: 'company-frequency',
        category: 'Operational',
        name: 'Order Frequency (L28D)',
        description: 'Average orders per active user over last 28 days',
        current: '3.8',
        prior: '3.61',
        change: 5.1,
        changeLabel: '+5.1%',
        vsPlan: '+2.8%',
        vsPlanValue: 2.8,
        trend: [3.55, 3.58, 3.62, 3.65, 3.60, 3.70, 3.8],
        status: 'excellent',
        aiInsight: {
          summary: 'Highest frequency in 3 months. SuperBowl spike + retention campaigns',
          confidence: 95
        }
      },
      {
        id: 'company-dashpass',
        category: 'Adoption',
        name: 'DashPass: paid subs',
        description: 'Total paying DashPass subscribers',
        current: '12.2M',
        prior: '11.7M',
        change: 4.2,
        changeLabel: '+4.2%',
        vsPlan: '+1.8%',
        vsPlanValue: 1.8,
        trend: [11.5, 11.6, 11.7, 11.8, 11.9, 12.0, 12.2],
        status: 'healthy',
        aiInsight: {
          summary: 'Steady subscriber growth, churn rate stable at 4.8%',
          confidence: 88
        }
      }
    ]
  },
  {
    id: 'us-marketplace',
    name: 'US Marketplace / Rx',
    overallStatus: 'healthy',
    quickView: {
      metric1: 'GOV $6.4B (+98.8% vs Plan)',
      metric2: 'MAU 36.56M (+99.8% vs Plan)'
    },
    metrics: [
      {
        id: 'usmp-gov',
        category: 'Financial',
        name: 'USMP GOV',
        description: 'US Marketplace Gross Order Value (food + restaurant)',
        current: '$6.4B',
        prior: '$6.2B',
        change: 3.2,
        changeLabel: '+3.2%',
        vsPlan: '+98.8%',
        vsPlanValue: 98.8,
        trend: [6.0, 6.1, 6.2, 6.25, 6.3, 6.35, 6.4],
        status: 'healthy',
        aiInsight: {
          summary: 'On track vs plan. Weekend storm impacted volume (-$6M) but offset by strong HQDR and DDE fees',
          confidence: 91,
          details: 'Winter Storm Fern caused volume miss in 5 of 8 top metros (DFW, DMV, Tri-State, NYC, ATL). Non-weather markets met or beat plan. Tier 4-5 GOV saw $6M QTD gap to stretch.'
        }
      },
      {
        id: 'usmp-revenue',
        category: 'Financial',
        name: 'USMP Revenue',
        description: 'Revenue from US Marketplace operations',
        current: '$803M',
        prior: '$784M',
        change: 2.4,
        changeLabel: '+2.4%',
        vsPlan: '+102.4%',
        vsPlanValue: 102.4,
        trend: [765, 775, 784, 790, 795, 800, 803],
        status: 'healthy',
        aiInsight: {
          summary: 'Revenue ahead of plan driven by Ads (+5¢ from Rx S/L + Banners) and strong take rate',
          confidence: 93
        }
      },
      {
        id: 'usmp-contribution',
        category: 'Financial',
        name: 'USMP Contribution Profit',
        description: 'Contribution profit from US Marketplace',
        current: '$348.5M',
        prior: '$324M',
        change: 7.6,
        changeLabel: '+7.6%',
        vsPlan: '+107.6%',
        vsPlanValue: 107.6,
        trend: [310, 320, 324, 330, 338, 342, 348.5],
        status: 'excellent',
        aiInsight: {
          summary: 'QTD +8bc vPlan driven by: 1) Ads (+5¢ from Rx S/L), 2) Dasher (+6¢ base pay underspend), 3) C&R (+2¢ from HQDR), 4) DDE fees (+2¢)',
          confidence: 95,
          details: 'Even with storm impact, contribution margin per order is +8bc vs plan. Strong operational efficiency offsetting weather-related volume miss.'
        }
      },
      {
        id: 'rx-gov',
        category: 'Financial',
        name: 'US Rx GOV',
        description: 'Pharmacy/prescription delivery gross order value',
        current: '$612M',
        prior: '$605M',
        change: 1.2,
        changeLabel: '+1.2%',
        vsPlan: '+98.8%',
        vsPlanValue: 98.8,
        trend: [595, 600, 605, 607, 609, 610, 612],
        status: 'warning',
        aiInsight: {
          summary: 'Slightly below plan. Storm mix-shift to grocery impacted Rx. Expect recovery in March.',
          confidence: 82,
          details: 'Winter storm drove customers to grocery/dashmart instead of Rx. Volume -5.0% w/w and 20% below y/y expectations. Classic & Resurrected Cx particularly impacted.'
        }
      },
      {
        id: 'rx-revenue',
        category: 'Financial',
        name: 'US Rx Revenue',
        description: 'Revenue from pharmacy delivery',
        current: '$724.2M',
        prior: '$705.8M',
        change: 2.6,
        changeLabel: '+2.6%',
        vsPlan: '+102.6%',
        vsPlanValue: 102.6,
        trend: [685, 695, 705.8, 710, 715, 720, 724.2],
        status: 'healthy',
        aiInsight: {
          summary: 'Revenue outpacing GOV due to improved take rate and selection expansion',
          confidence: 88
        }
      },
      {
        id: 'rx-contribution',
        category: 'Financial',
        name: 'US Rx Contribution Profit',
        description: 'Contribution profit from pharmacy',
        current: '$358.0M',
        prior: '$337.4M',
        change: 6.1,
        changeLabel: '+6.1%',
        vsPlan: '+106.1%',
        vsPlanValue: 106.1,
        trend: [320, 330, 337.4, 345, 350, 355, 358],
        status: 'excellent',
        aiInsight: {
          summary: 'Strong profitability despite volume headwinds. Efficiency gains driving margin expansion',
          confidence: 90
        }
      },
      {
        id: 'usmp-mau',
        category: 'Operational',
        name: 'MAUs (L28D EOP)',
        description: 'Monthly active users in US Marketplace',
        current: '36.56M',
        prior: '36.97M',
        change: -1.1,
        changeLabel: '-1.1%',
        vsPlan: '+98.9%',
        vsPlanValue: 98.9,
        trend: [36.2, 36.5, 36.97, 37.1, 36.8, 36.7, 36.56],
        status: 'warning',
        aiInsight: {
          summary: 'Weekend Storm Fern impacted MAUs: w/w dropping from 16.6% → 8.8%, -150K users resulting in MAU Net Adds loss of +300K w/w',
          confidence: 94,
          details: 'One-time weather event. MAUs down -150K over weekend (+4.73M → +4.44M). Classic & Resurrected Cx specifically impacted. Expect recovery by March.'
        }
      },
      {
        id: 'usmp-frequency',
        category: 'Operational',
        name: 'Cx Order Frequency (L28D)',
        description: 'Consumer order frequency',
        current: '5.01',
        prior: '5.02',
        change: -0.2,
        changeLabel: '-0.2%',
        vsPlan: '+99.8%',
        vsPlanValue: 99.8,
        trend: [4.95, 4.98, 5.02, 5.04, 5.03, 5.02, 5.01],
        status: 'healthy',
        aiInsight: {
          summary: 'Frequency holding strong despite weather. On-plan performance indicates healthy engagement',
          confidence: 92
        }
      },
      {
        id: 'rx-subtotal',
        category: 'Operational',
        name: 'US Rx Subtotal (AOV)',
        description: 'Average order value for Rx orders',
        current: '$27.28',
        prior: '$27.30',
        change: -0.1,
        changeLabel: '-0.1%',
        vsPlan: '+99.9%',
        vsPlanValue: 99.9,
        trend: [26.9, 27.0, 27.3, 27.35, 27.25, 27.28, 27.28],
        status: 'healthy',
        aiInsight: {
          summary: 'Subtotal stable, on-plan. Mix holding steady despite weather impacts',
          confidence: 89
        }
      },
      {
        id: 'usmp-dashpass-subs',
        category: 'Adoption',
        name: 'DashPass US Paid Subs',
        description: 'Total paying DashPass subscribers in US',
        current: '20.19M',
        prior: '20.24M',
        change: -0.2,
        changeLabel: '-0.2%',
        vsPlan: '+99.8%',
        vsPlanValue: 99.8,
        trend: [19.8, 19.95, 20.24, 20.3, 20.25, 20.22, 20.19],
        status: 'healthy',
        aiInsight: {
          summary: 'Slight dip due to weather but overall on plan. Churn rate holding at target 2.25%',
          confidence: 90
        }
      },
      {
        id: 'usmp-dashpass-signups',
        category: 'Adoption',
        name: 'DashPass Signups',
        description: 'New DashPass subscriber signups',
        current: '2.13M',
        prior: '2.06M',
        change: 3.4,
        changeLabel: '+3.4%',
        vsPlan: '+103.2%',
        vsPlanValue: 103.2,
        trend: [1.95, 2.0, 2.06, 2.08, 2.10, 2.12, 2.13],
        status: 'excellent',
        aiInsight: {
          summary: 'Signups exceeding plan. Strong conversion from promotional campaigns',
          confidence: 91
        }
      },
      {
        id: 'usmp-dashpass-churn',
        category: 'Adoption',
        name: 'DashPass Churn Reduction',
        description: 'Monthly churn rate for DashPass',
        current: '2.25%',
        prior: '2.25%',
        change: 0.0,
        changeLabel: '0.0%',
        vsPlan: '+100.0%',
        vsPlanValue: 100.0,
        trend: [2.3, 2.28, 2.25, 2.25, 2.25, 2.25, 2.25],
        status: 'excellent',
        aiInsight: {
          summary: 'Churn at target 2.25%. Retention initiatives working as expected',
          confidence: 95
        }
      },
      {
        id: 'usmp-dashpass-gov',
        category: 'Adoption',
        name: 'DashPass GOV',
        description: 'Gross order value from DashPass subscribers',
        current: '$4.4B',
        prior: '$4.4B',
        change: 0.0,
        changeLabel: '0.0%',
        vsPlan: '+99.6%',
        vsPlanValue: 99.6,
        trend: [4.2, 4.3, 4.4, 4.4, 4.4, 4.4, 4.4],
        status: 'healthy',
        aiInsight: {
          summary: 'DashPass GOV stable and on-plan despite overall weather headwinds',
          confidence: 88
        }
      },
      {
        id: 'rx-ptam',
        category: 'Selection',
        name: 'US Rx Cx pTAM',
        description: 'Percentage of total addressable market for Rx customers',
        current: '75.02%',
        prior: '74.96%',
        change: 0.1,
        changeLabel: '+0.1%',
        vsPlan: '+100.1%',
        vsPlanValue: 100.1,
        trend: [74.2, 74.5, 74.96, 75.0, 75.0, 75.01, 75.02],
        status: 'healthy',
        aiInsight: {
          summary: 'pTAM expansion on track. Selection improvements driving coverage growth',
          confidence: 87
        }
      },
      {
        id: 'top-mx-signs',
        category: 'Selection',
        name: 'Top Mx Signs',
        description: 'Top merchant sign-ups',
        current: '829',
        prior: '821',
        change: 1.0,
        changeLabel: '+1.0%',
        vsPlan: '+101.0%',
        vsPlanValue: 101.0,
        trend: [795, 805, 821, 825, 827, 828, 829],
        status: 'healthy',
        aiInsight: {
          summary: 'Merchant growth on track. Top-tier restaurant partners expanding',
          confidence: 86
        }
      },
      {
        id: 'top-metro-gov',
        category: 'Local Markets',
        name: 'Top Metro GOV',
        description: 'GOV from top 8 metropolitan areas',
        current: '$1.5B',
        prior: '$1.5B',
        change: 0.0,
        changeLabel: '0.0%',
        vsPlan: '+98.3%',
        vsPlanValue: 98.3,
        trend: [1.48, 1.49, 1.5, 1.5, 1.5, 1.5, 1.5],
        status: 'warning',
        aiInsight: {
          summary: '5 of 8 top metros (DFW, DMV, Tri-State, NYC, ATL) facing significant weekend storm volume headwinds',
          confidence: 93,
          details: 'Non-weather metros met or beat plan. Tier 4-5 GOV also saw additional pressure resulting in $6M QTD gap to stretch. Expect recovery as weather clears by mid-March.'
        }
      },
      {
        id: 'tier45-gov',
        category: 'Local Markets',
        name: 'Tier 4-5 GOV',
        description: 'GOV from tier 4-5 markets (smaller cities)',
        current: '$1.4B',
        prior: '$1.5B',
        change: -6.7,
        changeLabel: '-6.7%',
        vsPlan: '+95.8%',
        vsPlanValue: 95.8,
        trend: [1.48, 1.49, 1.5, 1.48, 1.45, 1.42, 1.4],
        status: 'warning',
        aiInsight: {
          summary: 'Below plan due to weather plus marketing selection headwind. $6M QTD gap to stretch. Tier 4-5 also saw pressure.',
          confidence: 85,
          details: 'Combination of storm impact and marketing optimization in smaller markets. Recovery plan includes targeted promotions.'
        }
      },
      {
        id: 'vp-order-reg',
        category: 'Profitability',
        name: 'VP/order in Reg Markets',
        description: 'Variable profit per order in regular markets',
        current: '$1.84',
        prior: '$1.94',
        change: -5.2,
        changeLabel: '-5.2%',
        vsPlan: '+94.8%',
        vsPlanValue: 94.8,
        trend: [1.98, 1.96, 1.94, 1.92, 1.88, 1.86, 1.84],
        status: 'warning',
        aiInsight: {
          summary: 'QTD Miss driven by: 1) Week of 1/12 with one-time $3.8M CA back payment from Dx cancels issue (Nov 25), 2) NYC Tips Headwind',
          confidence: 89,
          details: 'NYC tipping regulation (1/26) caused $54M headwind from AR degradation (moving tips to pre-checkout). Included in AOP with plan to fully offset. Pacing to offset headwind from min wage increase (lower than expected) and AE goodness.'
        }
      },
      {
        id: 'vp-pod-goal',
        category: 'Profitability',
        name: 'VP Pod Goal',
        description: 'Variable profit pod goal tracking',
        current: '$0.0K',
        prior: '$0.0K',
        change: 0.0,
        changeLabel: '0.0%',
        vsPlan: 'N/A',
        vsPlanValue: 0,
        trend: [0, 0, 0, 0, 0, 0, 0],
        status: 'healthy',
        aiInsight: {
          summary: 'Pod goal tracking on schedule. No current variance.',
          confidence: 75
        }
      }
    ]
  },
  {
    id: 'us-nv',
    name: 'US New Verticals',
    overallStatus: 'warning',
    quickView: {
      metric1: 'GOV $1.84B (98% vs Plan)',
      metric2: 'Gift Cards $13.0M (124% vs Plan)'
    },
    metrics: [
      {
        id: 'usnv-gov',
        category: 'Financial',
        name: 'US NV GOV',
        description: 'Total New Verticals gross order value',
        current: '$1,835.5M',
        prior: '$1,782.0M',
        change: 3.0,
        changeLabel: '+3.0%',
        vsPlan: '98%',
        vsPlanValue: -2.0,
        trend: [1720, 1750, 1782, 1800, 1815, 1820, 1835.5],
        status: 'warning',
        aiInsight: {
          summary: 'QTD at 98% vs plan. Forecasting $83.9M Q1 miss driven by Grocery ($50M Kroger SNAP miss)',
          confidence: 89
        }
      },
      {
        id: 'usnv-3p-grocery',
        category: 'Financial',
        name: '3P Grocery GOV',
        description: '3rd party grocery gross order value',
        current: '$856.0M',
        prior: '$830.0M',
        change: 3.1,
        changeLabel: '+3.1%',
        vsPlan: '97%',
        vsPlanValue: -3.0,
        trend: [800, 815, 830, 840, 845, 850, 856],
        status: 'warning',
        aiInsight: {
          summary: '$50M Kroger SNAP miss due to broken data pipelines in DnD post-checkout ranker',
          confidence: 91
        }
      },
      {
        id: 'usnv-dashmart',
        category: 'Financial',
        name: 'DashMart GOV',
        description: 'DashMart convenience store gross order value',
        current: '$89.8M',
        prior: '$87.5M',
        change: 2.6,
        changeLabel: '+2.6%',
        vsPlan: '102%',
        vsPlanValue: 2.0,
        trend: [82, 84, 87.5, 88, 88.5, 89, 89.8],
        status: 'excellent',
        aiInsight: {
          summary: 'Continuing strong trajectory at 102% to plan. Solid execution.',
          confidence: 92
        }
      },
      {
        id: 'usnv-gift-cards',
        category: 'Financial',
        name: '3P Digital Gift Cards GOV',
        description: 'Digital 3rd party gift cards gross order value',
        current: '$13.0M',
        prior: '$11.1M',
        change: 17.0,
        changeLabel: '+17.0%',
        vsPlan: '124%',
        vsPlanValue: 24.0,
        trend: [9.2, 9.8, 11.1, 11.5, 12.0, 12.5, 13.0],
        status: 'excellent',
        aiInsight: {
          summary: 'Massively outperforming driven by Super Bowl partnership. Forecasting 118% exit Q1.',
          confidence: 94
        }
      },
      {
        id: 'usnv-3p-retail',
        category: 'Financial',
        name: '3P Retail GOV',
        description: '3rd party retail gross order value',
        current: '$260.1M',
        prior: '$253.0M',
        change: 2.8,
        changeLabel: '+2.8%',
        vsPlan: '101%',
        vsPlanValue: 1.0,
        trend: [245, 248, 253, 255, 257, 258, 260.1],
        status: 'healthy',
        aiInsight: {
          summary: 'At 101% driven by convenience and quick commerce demand',
          confidence: 88
        }
      },
      {
        id: 'usnv-nv-drive-volume',
        category: 'Operational',
        name: 'NV Drive Volume',
        description: 'New Verticals drive volume in millions',
        current: '3.9M',
        prior: '3.6M',
        change: 8.3,
        changeLabel: '+8.3%',
        vsPlan: '132%',
        vsPlanValue: 32.0,
        trend: [3.0, 3.2, 3.6, 3.7, 3.75, 3.8, 3.9],
        status: 'excellent',
        aiInsight: {
          summary: 'Volume dramatically outperforming at 145% vPlan due to Mx-funded Super Bowl campaigns',
          confidence: 93
        }
      },
      {
        id: 'usnv-nv-mau',
        category: 'Operational',
        name: 'L28D NV MAU',
        description: 'New Verticals monthly active users',
        current: '10.9M',
        prior: '10.6M',
        change: 2.8,
        changeLabel: '+2.8%',
        vsPlan: '98%',
        vsPlanValue: -2.0,
        trend: [10.1, 10.3, 10.6, 10.65, 10.7, 10.8, 10.9],
        status: 'warning',
        aiInsight: {
          summary: 'At 98% vs plan. Tracking closely with overall MAU trends.',
          confidence: 87
        }
      },
      {
        id: 'usnv-retail-skus',
        category: 'Operational',
        name: 'Retail Shoppable SKUs',
        description: 'Number of shoppable retail SKUs in millions',
        current: '0.41M',
        prior: '0.39M',
        change: 5.1,
        changeLabel: '+5.1%',
        vsPlan: '87%',
        vsPlanValue: -13.0,
        trend: [0.36, 0.37, 0.39, 0.395, 0.40, 0.405, 0.41],
        status: 'critical',
        aiInsight: {
          summary: 'Selection gap at 87% vs plan impacting conversion and customer satisfaction',
          confidence: 85
        }
      }
    ]
  },
  {
    id: 'ads-promos',
    name: 'Ads & Promos',
    overallStatus: 'excellent',
    quickView: {
      metric1: 'Total A&P Revenue $175M (104% vs Plan)',
      metric2: 'Total iGOV $707M (145% vs Plan)'
    },
    metrics: [
      {
        id: 'ap-total-revenue',
        category: 'Financial',
        name: 'Total A&P Revenue',
        description: 'Total Ads & Promos revenue',
        current: '$175M',
        prior: '$168M',
        change: 4.2,
        changeLabel: '+4.2%',
        vsPlan: '104%',
        vsPlanValue: 4.0,
        trend: [160, 163, 168, 170, 172, 173, 175],
        status: 'excellent',
        aiInsight: {
          summary: 'QTD at 104% vs plan. Strong performance across US Rx and CPG.',
          confidence: 93
        }
      },
      {
        id: 'ap-us-rx-ads',
        category: 'Financial',
        name: 'US Rx Ads Revenue',
        description: 'US Restaurant advertising revenue',
        current: '$146M',
        prior: '$143M',
        change: 2.1,
        changeLabel: '+2.1%',
        vsPlan: '102%',
        vsPlanValue: 2.0,
        trend: [138, 140, 143, 144, 145, 145.5, 146],
        status: 'healthy',
        aiInsight: {
          summary: 'QTD at 102% vs plan. ENT at 108%, SMB at 99%.',
          confidence: 91
        }
      },
      {
        id: 'ap-us-rx-ent',
        category: 'Financial',
        name: 'US Rx ENT Ads',
        description: 'US Restaurant Enterprise advertising revenue',
        current: '$61M',
        prior: '$58M',
        change: 5.2,
        changeLabel: '+5.2%',
        vsPlan: '108%',
        vsPlanValue: 8.0,
        trend: [54, 56, 58, 59, 60, 60.5, 61],
        status: 'excellent',
        aiInsight: {
          summary: 'QTD at 108% driven by PLK, KFC, Pizza Hut campaign activations.',
          confidence: 94
        }
      },
      {
        id: 'ap-us-rx-smb',
        category: 'Financial',
        name: 'US Rx SMB Ads',
        description: 'US Restaurant SMB advertising revenue',
        current: '$85M',
        prior: '$85M',
        change: 0,
        changeLabel: '0%',
        vsPlan: '99%',
        vsPlanValue: -1.0,
        trend: [83, 84, 85, 85, 85, 85, 85],
        status: 'warning',
        aiInsight: {
          summary: 'QTD at 99% vs plan. Soft last week (84%) due to Robinhood delay and SL ad load incident.',
          confidence: 88
        }
      },
      {
        id: 'ap-us-cpg-ads',
        category: 'Financial',
        name: 'US CPG Ads Revenue',
        description: 'US Consumer Packaged Goods advertising revenue',
        current: '$20M',
        prior: '$18M',
        change: 11.1,
        changeLabel: '+11.1%',
        vsPlan: '109%',
        vsPlanValue: 9.0,
        trend: [16, 17, 18, 18.5, 19, 19.5, 20],
        status: 'excellent',
        aiInsight: {
          summary: 'QTD at 109% vs plan. Super Bowl week was biggest of quarter at $3.7M.',
          confidence: 92
        }
      },
      {
        id: 'ap-symbiosys',
        category: 'Financial',
        name: 'Symbiosys Revenue',
        description: 'Symbiosys partnership advertising revenue',
        current: '$0.5M',
        prior: '$0.6M',
        change: -16.7,
        changeLabel: '-16.7%',
        vsPlan: '85%',
        vsPlanValue: -15.0,
        trend: [0.55, 0.58, 0.6, 0.58, 0.56, 0.53, 0.5],
        status: 'critical',
        aiInsight: {
          summary: 'At 85% vs plan. Soft due to delayed Sephora launch waiting on UI updates.',
          confidence: 87
        }
      },
      {
        id: 'ap-offsite-ads',
        category: 'Financial',
        name: 'Offsite Ads Revenue',
        description: 'Offsite advertising revenue',
        current: '$0.53M',
        prior: '$0.18M',
        change: 194.4,
        changeLabel: '+194.4%',
        vsPlan: '292%',
        vsPlanValue: 192.0,
        trend: [0.15, 0.16, 0.18, 0.25, 0.35, 0.45, 0.53],
        status: 'excellent',
        aiInsight: {
          summary: 'At 292% vs plan but absolute numbers still small. Scaling new markets.',
          confidence: 86
        }
      },
      {
        id: 'ap-total-igov',
        category: 'Financial',
        name: 'Total iGOV',
        description: 'Total incremental GOV from Mx-funded promos',
        current: '$707M',
        prior: '$544M',
        change: 30.0,
        changeLabel: '+30.0%',
        vsPlan: '145%',
        vsPlanValue: 45.0,
        trend: [480, 510, 544, 590, 630, 670, 707],
        status: 'excellent',
        aiInsight: {
          summary: 'Massively outperforming at 145% vs plan. 30% YoY incremental lift proven.',
          confidence: 95
        }
      },
      {
        id: 'ap-us-rx-igov',
        category: 'Financial',
        name: 'US Rx iGOV',
        description: 'US Restaurant incremental GOV',
        current: '$661M',
        prior: '$509M',
        change: 29.9,
        changeLabel: '+29.9%',
        vsPlan: '143%',
        vsPlanValue: 43.0,
        trend: [450, 475, 509, 550, 590, 625, 661],
        status: 'excellent',
        aiInsight: {
          summary: 'At 143% vs plan driven by smart campaigns and BOGO 2x YoY growth.',
          confidence: 93
        }
      },
      {
        id: 'ap-total-cx-savings',
        category: 'Financial',
        name: 'Total Cx Savings',
        description: 'Total customer savings from promotions',
        current: '$331M',
        prior: '$312M',
        change: 6.1,
        changeLabel: '+6.1%',
        vsPlan: '106%',
        vsPlanValue: 6.0,
        trend: [295, 302, 312, 318, 322, 327, 331],
        status: 'excellent',
        aiInsight: {
          summary: 'At 106% vs plan. Customers saving more driving higher engagement.',
          confidence: 92
        }
      },
      {
        id: 'ap-us-rx-cx-savings',
        category: 'Financial',
        name: 'US Rx Cx Savings',
        description: 'US Restaurant customer savings',
        current: '$305M',
        prior: '$290M',
        change: 5.2,
        changeLabel: '+5.2%',
        vsPlan: '105%',
        vsPlanValue: 5.0,
        trend: [275, 282, 290, 295, 299, 302, 305],
        status: 'excellent',
        aiInsight: {
          summary: 'At 105% vs plan. ENT at 113%, SMB at 97%.',
          confidence: 91
        }
      }
    ]
  },
  {
    id: 'dasher',
    name: 'Dasher / Logistics',
    overallStatus: 'excellent',
    quickView: {
      metric1: 'Active Dashers 2.8M (+5.1%)',
      metric2: 'Utilization 82% (+3%)'
    },
    metrics: [
      {
        id: 'dasher-active',
        category: 'Supply',
        name: 'Active Dashers',
        description: 'Dashers who completed at least 1 delivery this week',
        current: '2.8M',
        prior: '2.66M',
        change: 5.1,
        changeLabel: '+5.1%',
        vsPlan: '+2.1%',
        vsPlanValue: 2.1,
        trend: [2.55, 2.58, 2.66, 2.70, 2.68, 2.75, 2.8],
        status: 'healthy',
        aiInsight: {
          summary: 'Supply growing, onboarding velocity up 12%',
          confidence: 90
        }
      },
      {
        id: 'dasher-retention',
        category: 'Supply',
        name: 'D30 Retention',
        description: '30-day dasher retention rate',
        current: '68%',
        prior: '64.5%',
        change: 5.4,
        changeLabel: '+5.4%',
        vsPlan: '+3.2%',
        vsPlanValue: 3.2,
        trend: [63, 63.5, 64.5, 65.2, 66.5, 67.2, 68],
        status: 'excellent',
        aiInsight: {
          summary: 'NEW INCENTIVE STRUCTURE WORKING! Test markets showing +15% improvement',
          confidence: 92,
          details: '8 test cities showing significant gains. If scaled nationally, could reduce dasher CAC by $8M/month. Recommend accelerating rollout.'
        }
      },
      {
        id: 'dasher-utilization',
        category: 'Efficiency',
        name: 'Utilization Rate',
        description: 'Percentage of time dashers are on active deliveries',
        current: '82%',
        prior: '79.6%',
        change: 3.0,
        changeLabel: '+3.0%',
        vsPlan: '+1.5%',
        vsPlanValue: 1.5,
        trend: [78, 78.5, 79.6, 80.2, 80.8, 81.5, 82],
        status: 'excellent',
        aiInsight: {
          summary: 'AI dispatch algorithm showing impact, wait times down',
          confidence: 88
        }
      }
    ]
  },
  {
    id: 'canz',
    name: 'CANZ',
    overallStatus: 'warning',
    quickView: {
      metric1: 'GOV $890M (+4.1%)',
      metric2: 'Orders 0.9M (+3.8%)'
    },
    metrics: [
      {
        id: 'canz-gov',
        category: 'Financial',
        name: 'CANZ GOV',
        description: 'Canada, Australia, New Zealand gross order value',
        current: '$890M',
        prior: '$855M',
        change: 4.1,
        changeLabel: '+4.1%',
        vsPlan: '-2.1%',
        vsPlanValue: -2.1,
        trend: [825, 835, 855, 865, 848, 875, 890],
        status: 'warning',
        aiInsight: {
          summary: 'Below forecast due to weather. Toronto/Montreal -8%, Melbourne -6%',
          confidence: 89,
          details: 'Snowstorms in Eastern Canada and flooding in Melbourne. Vancouver/Sydney performing well (+7%). Expected recovery by Feb 15.'
        }
      },
      {
        id: 'canz-orders',
        category: 'Operational',
        name: 'CANZ Orders',
        description: 'Total orders across CANZ region',
        current: '0.9M',
        prior: '0.87M',
        change: 3.8,
        changeLabel: '+3.8%',
        vsPlan: '-1.8%',
        vsPlanValue: -1.8,
        trend: [0.84, 0.85, 0.87, 0.88, 0.86, 0.89, 0.9],
        status: 'warning',
        aiInsight: {
          summary: 'Weather-suppressed, expected to normalize next week',
          confidence: 85
        }
      },
      {
        id: 'canz-mau',
        category: 'Operational',
        name: 'CANZ MAU',
        description: 'Monthly active users in CANZ',
        current: '4.1M',
        prior: '3.99M',
        change: 2.8,
        changeLabel: '+2.8%',
        vsPlan: '+0.5%',
        vsPlanValue: 0.5,
        trend: [3.88, 3.92, 3.99, 4.02, 3.98, 4.05, 4.1],
        status: 'healthy',
        aiInsight: {
          summary: 'User base growing despite weather headwinds',
          confidence: 87
        }
      }
    ]
  },
  {
    id: 'dd-commerce',
    name: 'DoorDash Commerce',
    overallStatus: 'healthy',
    quickView: {
      metric1: 'DCP Volume $32.8M (106% vs Plan)',
      metric2: 'Pro New Store Signs 347 (81% vs Plan)'
    },
    metrics: [
      {
        id: 'ddc-dcp-volume',
        category: 'Financial',
        name: 'DCP Volume',
        description: 'DoorDash Commerce Platform volume',
        current: '$32.8M',
        prior: '$31.0M',
        change: 5.8,
        changeLabel: '+5.8%',
        vsPlan: '106%',
        vsPlanValue: 6.0,
        trend: [28, 29, 31, 31.5, 32, 32.5, 32.8],
        status: 'excellent',
        aiInsight: {
          summary: 'QTD at 106% vs plan driven by Rx ENT reflecting strong New Year performance.',
          confidence: 92
        }
      },
      {
        id: 'ddc-drive-revenue',
        category: 'Financial',
        name: 'Drive Revenue',
        description: 'DoorDash Drive white-label delivery revenue',
        current: '$48.2M',
        prior: '$45.0M',
        change: 7.1,
        changeLabel: '+7.1%',
        vsPlan: '126%',
        vsPlanValue: 26.0,
        trend: [40, 42, 45, 46, 47, 47.5, 48.2],
        status: 'excellent',
        aiInsight: {
          summary: 'At 126% vs plan. Drive volume dramatically outperforming expectations.',
          confidence: 93
        }
      },
      {
        id: 'ddc-dcp-cm',
        category: 'P&L',
        name: 'DCP CM',
        description: 'DCP Contribution Margin',
        current: '$15.5M',
        prior: '$14.0M',
        change: 10.7,
        changeLabel: '+10.7%',
        vsPlan: '227%',
        vsPlanValue: 127.0,
        trend: [10, 11.5, 14, 14.5, 15, 15.2, 15.5],
        status: 'excellent',
        aiInsight: {
          summary: 'Beating plan by +$7.7M driven by Rx volume outperformance and lower Dx Base costs.',
          confidence: 94
        }
      },
      {
        id: 'ddc-parcel-cm',
        category: 'P&L',
        name: 'Parcel CM',
        description: 'Parcel Contribution Margin',
        current: '-$11.0M',
        prior: '-$10.5M',
        change: -4.8,
        changeLabel: '-4.8%',
        vsPlan: '106%',
        vsPlanValue: 6.0,
        trend: [-9, -9.5, -10.5, -10.7, -10.8, -10.9, -11.0],
        status: 'critical',
        aiInsight: {
          summary: 'CM negative worsening. Loss rate at 0.29% driven by theft and hub delays.',
          confidence: 89
        }
      },
      {
        id: 'ddc-parcel-otd',
        category: 'Operational',
        name: 'Parcel Retail OTD',
        description: 'Parcel on-time delivery percentage',
        current: '97.0%',
        prior: '96.5%',
        change: 0.5,
        changeLabel: '+0.5%',
        vsPlan: '98%',
        vsPlanValue: -2.0,
        trend: [95, 95.5, 96.5, 96.7, 96.8, 96.9, 97.0],
        status: 'healthy',
        aiInsight: {
          summary: 'At 97% OTD with high confidence for reaching 97% EOQ target.',
          confidence: 91
        }
      },
      {
        id: 'ddc-parcel-loss-rate',
        category: 'Operational',
        name: 'Parcel Loss Rate',
        description: 'Percentage of parcels lost or missing',
        current: '0.29%',
        prior: '0.25%',
        change: 16.0,
        changeLabel: '+16.0%',
        vsPlan: '67%',
        vsPlanValue: -33.0,
        trend: [0.20, 0.22, 0.25, 0.26, 0.27, 0.28, 0.29],
        status: 'critical',
        aiInsight: {
          summary: 'Spiked to 0.29% due to return to hub delays, LAX Hub theft, and Final Mile app issues.',
          confidence: 90
        }
      },
      {
        id: 'ddc-pro-new-stores',
        category: 'Operational',
        name: 'Pro New Stores Signs',
        description: 'New Pro tier store sign-ups',
        current: '347',
        prior: '340',
        change: 2.1,
        changeLabel: '+2.1%',
        vsPlan: '81%',
        vsPlanValue: -19.0,
        trend: [320, 325, 340, 342, 344, 345, 347],
        status: 'critical',
        aiInsight: {
          summary: 'At 81% QTD vs plan. Paced ahead Month 1, now behind as goals ramped up.',
          confidence: 89
        }
      },
      {
        id: 'ddc-pro-asp',
        category: 'Operational',
        name: 'Pro New Store Monthly ASP',
        description: 'Pro tier average selling price',
        current: '$183',
        prior: '$185',
        change: -1.1,
        changeLabel: '-1.1%',
        vsPlan: '97%',
        vsPlanValue: -3.0,
        trend: [180, 182, 185, 184, 184, 183, 183],
        status: 'warning',
        aiInsight: {
          summary: 'At 97% vs plan. Impacted by discounting on larger deals including Q4 holdovers.',
          confidence: 86
        }
      },
      {
        id: 'ddc-mql-boost',
        category: 'Operational',
        name: 'MQL/PQL - Boost',
        description: 'Marketing qualified leads for Boost tier',
        current: '80',
        prior: '75',
        change: 6.7,
        changeLabel: '+6.7%',
        vsPlan: '113%',
        vsPlanValue: 13.0,
        trend: [68, 70, 75, 76, 77, 78, 80],
        status: 'excellent',
        aiInsight: {
          summary: 'At 113% vs plan. Improved routing to webinar CTAs driving performance.',
          confidence: 91
        }
      },
      {
        id: 'ddc-mql-pro',
        category: 'Operational',
        name: 'MQL/PQL - Pro',
        description: 'Marketing qualified leads for Pro tier',
        current: '71',
        prior: '73',
        change: -2.7,
        changeLabel: '-2.7%',
        vsPlan: '96%',
        vsPlanValue: -4.0,
        trend: [70, 71, 73, 72, 72, 71, 71],
        status: 'warning',
        aiInsight: {
          summary: 'At 96% vs plan. Miss driven by Chilical booking page bug (now fixed).',
          confidence: 87
        }
      }
    ]
  },
  {
    id: 'in-store',
    name: 'In Store',
    overallStatus: 'excellent',
    quickView: {
      metric1: 'Locations 8.5K (+22.8%)',
      metric2: 'Orders 520K (+18.2%)'
    },
    metrics: [
      {
        id: 'is-locations',
        category: 'Coverage',
        name: 'Active Locations',
        description: 'Store locations with in-store pickup enabled',
        current: '8.5K',
        prior: '6.9K',
        change: 22.8,
        changeLabel: '+22.8%',
        vsPlan: '+5.2%',
        vsPlanValue: 5.2,
        trend: [6.2, 6.5, 6.9, 7.4, 7.8, 8.2, 8.5],
        status: 'excellent',
        aiInsight: {
          summary: 'Rapid expansion in top metros, strong merchant demand for pickup',
          confidence: 91
        }
      },
      {
        id: 'is-orders',
        category: 'Operational',
        name: 'Pickup Orders',
        description: 'Total in-store pickup orders',
        current: '520K',
        prior: '440K',
        change: 18.2,
        changeLabel: '+18.2%',
        vsPlan: '+4.1%',
        vsPlanValue: 4.1,
        trend: [395, 410, 440, 465, 480, 500, 520],
        status: 'excellent',
        aiInsight: {
          summary: 'Pickup adoption accelerating, consumer preference for zero delivery fees',
          confidence: 89
        }
      }
    ]
  },
  {
    id: 'ddfb',
    name: 'DDfB',
    overallStatus: 'healthy',
    quickView: {
      metric1: 'Revenue $85M (+9.2%)',
      metric2: 'Enterprise Clients 245 (+6.5%)'
    },
    metrics: [
      {
        id: 'ddfb-revenue',
        category: 'Financial',
        name: 'DoorDash for Business Revenue',
        description: 'Revenue from corporate catering and meal programs',
        current: '$85M',
        prior: '$77.8M',
        change: 9.2,
        changeLabel: '+9.2%',
        vsPlan: '+1.8%',
        vsPlanValue: 1.8,
        trend: [72, 74, 77.8, 79.5, 81.2, 83.5, 85],
        status: 'healthy',
        aiInsight: {
          summary: 'Enterprise segment growth steady, SMB expansion showing promise',
          confidence: 86
        }
      },
      {
        id: 'ddfb-clients',
        category: 'Operational',
        name: 'Enterprise Clients',
        description: 'Active enterprise customers on DoorDash for Business',
        current: '245',
        prior: '230',
        change: 6.5,
        changeLabel: '+6.5%',
        vsPlan: '+2.2%',
        vsPlanValue: 2.2,
        trend: [215, 220, 230, 235, 238, 242, 245],
        status: 'healthy',
        aiInsight: {
          summary: 'Client retention at 94%, new Fortune 500 wins in pipeline',
          confidence: 88
        }
      }
    ]
  },
  {
    id: 'merchant',
    name: 'Merchant',
    overallStatus: 'healthy',
    quickView: {
      metric1: 'Total Merchants 820K (+4.2%)',
      metric2: 'NPS 72 (+3pts)'
    },
    metrics: [
      {
        id: 'merchant-total',
        category: 'Supply',
        name: 'Total Active Merchants',
        description: 'All merchants with at least one order this week',
        current: '820K',
        prior: '787K',
        change: 4.2,
        changeLabel: '+4.2%',
        vsPlan: '+1.5%',
        vsPlanValue: 1.5,
        trend: [765, 772, 787, 795, 802, 810, 820],
        status: 'healthy',
        aiInsight: {
          summary: 'Merchant growth tracking plan, churned merchants at historic low',
          confidence: 87
        }
      },
      {
        id: 'merchant-nps',
        category: 'Quality',
        name: 'Merchant NPS',
        description: 'Net Promoter Score from merchant surveys',
        current: '72',
        prior: '69',
        change: 4.3,
        changeLabel: '+3pts',
        vsPlan: '+1pt',
        vsPlanValue: 1,
        trend: [66, 67, 69, 70, 71, 71, 72],
        status: 'excellent',
        aiInsight: {
          summary: 'Highest NPS in 6 months, tablet improvements & support response time driving gains',
          confidence: 90
        }
      }
    ]
  },
  {
    id: 'cxi',
    name: 'CXI',
    overallStatus: 'healthy',
    quickView: {
      metric1: 'CSAT 4.62/5 (+0.08)',
      metric2: 'Resolution Time 3.2min (-12%)'
    },
    metrics: [
      {
        id: 'cxi-csat',
        category: 'Quality',
        name: 'Customer Satisfaction',
        description: 'Average customer satisfaction rating',
        current: '4.62',
        prior: '4.54',
        change: 1.8,
        changeLabel: '+0.08',
        vsPlan: '+0.02',
        vsPlanValue: 0.4,
        trend: [4.48, 4.50, 4.54, 4.56, 4.58, 4.60, 4.62],
        status: 'healthy',
        aiInsight: {
          summary: 'CSAT improvement driven by faster refund processing and proactive support',
          confidence: 88
        }
      },
      {
        id: 'cxi-resolution',
        category: 'Efficiency',
        name: 'Avg Resolution Time',
        description: 'Average time to resolve customer issues',
        current: '3.2min',
        prior: '3.65min',
        change: -12.3,
        changeLabel: '-12.3%',
        vsPlan: '-2.5%',
        vsPlanValue: -2.5,
        trend: [3.85, 3.78, 3.65, 3.55, 3.45, 3.32, 3.2],
        status: 'excellent',
        aiInsight: {
          summary: 'AI-powered chat deflection reducing ticket volume, agent efficiency improving',
          confidence: 91
        }
      }
    ]
  },
  {
    id: 'money',
    name: 'Money',
    overallStatus: 'excellent',
    quickView: {
      metric1: 'TPV $2.8B (+28.5%)',
      metric2: 'Active Users 1.2M (+32.1%)'
    },
    metrics: [
      {
        id: 'money-tpv',
        category: 'Financial',
        name: 'Total Payment Volume',
        description: 'Total transaction volume through DoorDash Money products',
        current: '$2.8B',
        prior: '$2.18B',
        change: 28.5,
        changeLabel: '+28.5%',
        vsPlan: '+8.2%',
        vsPlanValue: 8.2,
        trend: [1.95, 2.05, 2.18, 2.35, 2.52, 2.68, 2.8],
        status: 'excellent',
        aiInsight: {
          summary: 'DasherDirect card adoption accelerating, merchant financing uptake strong',
          confidence: 92
        }
      },
      {
        id: 'money-users',
        category: 'Adoption',
        name: 'Active Money Users',
        description: 'Users actively using DoorDash Money products',
        current: '1.2M',
        prior: '0.91M',
        change: 32.1,
        changeLabel: '+32.1%',
        vsPlan: '+12.5%',
        vsPlanValue: 12.5,
        trend: [0.78, 0.82, 0.91, 0.98, 1.05, 1.12, 1.2],
        status: 'excellent',
        aiInsight: {
          summary: 'Fastest growing product line, dasher adoption at 78%, consumer wallet launching Q2',
          confidence: 89
        }
      }
    ]
  }
];

// Source artifacts referenced in AI insights - diverse types
export const sourceDashboards: SourceDashboard[] = [
  { id: 1, name: 'Company WBR Dashboard', type: 'Dashboard', url: appConfig.externalUrls.companyWBR, lastRefreshed: '2 hours ago' },
  { id: 2, name: 'Weekly Business Review - Feb 5', type: 'WBR', url: '#', lastRefreshed: '3 days ago' },
  { id: 3, name: 'Dasher Incentive Experiment Results', type: 'Experiment Email', url: '#', lastRefreshed: '5 days ago' },
  { id: 4, name: 'DashPass Product Strategy Doc', type: 'Product Doc', url: '#', lastRefreshed: '1 week ago' },
  { id: 5, name: 'Customer Segmentation Analysis', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '2 hours ago' },
  { id: 6, name: 'Market Performance Tracker', type: 'Dashboard', url: '#', lastRefreshed: '45 mins ago' },
  { id: 7, name: 'Regional Operations Report', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 hour ago' },
  { id: 8, name: 'TechCrunch: DoorDash Market Share Gains', type: 'External Media', url: '#', lastRefreshed: '2 days ago' },
  { id: 9, name: 'Customer Support Escalation Trends', type: 'Customer Support', url: '#', lastRefreshed: '6 hours ago' },
  { id: 10, name: 'Super Bowl Campaign Results', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 day ago' },
  { id: 11, name: 'Social Media Performance Report', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '12 hours ago' },
  { id: 12, name: 'DashPass Subscription Dashboard', type: 'Dashboard', url: '#', lastRefreshed: '1 hour ago' },
  { id: 13, name: 'Dasher Incentive Pilot Results', type: 'Experiment Email', url: '#', lastRefreshed: '3 days ago' },
  { id: 14, name: 'Supply Coverage Analysis', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '2 hours ago' },
  { id: 15, name: 'Gift Cards Performance Report', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 day ago' },
  { id: 16, name: 'New Verticals Weekly Business Review', type: 'WBR', url: '#', lastRefreshed: '2 days ago' },
  { id: 17, name: 'NV Drive Campaign Analysis', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 day ago' },
  { id: 18, name: 'Ads & Promos Weekly Business Review', type: 'WBR', url: '#', lastRefreshed: '2 days ago' },
  { id: 19, name: 'Restaurant ENT Advertising Report', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 day ago' },
  { id: 20, name: 'DoorDash Commerce Weekly Review', type: 'WBR', url: '#', lastRefreshed: '2 days ago' },
  { id: 21, name: 'Commerce Lead Generation Dashboard', type: 'Dashboard', url: '#', lastRefreshed: '1 hour ago' }
];

// Area-specific AI summaries
export const aiSummariesByArea: Record<string, AIExecutiveSummary> = {
  company: {
    timestamp: 'Feb 9, 2026 8:05 AM PST',
    confidence: 92,
    overallHealth: 'strong',
    trend: 'up',
    summary: '5 of 6 product areas performing at or above plan despite Winter Storm Fern. USMP contribution margin +8bc vs plan offsetting weather impacts.',
    highlights: [
    {
      title: '💰 USMP Contribution Profit Outperforming',
      metric: '$348.5M (+107.6% vs Plan, +7.6% WoW)',
      insight: 'QTD +8bc vs Plan driven by multiple efficiency wins: 1) Ads revenue (+5¢ from Rx S/L + Banners outperformance), 2) Dasher base pay underspend (+6¢), 3) Strong HQDR driving C&R improvement (+2¢), 4) DDE fees from winter storm mix-shift into Grocery and Dashmart (+2¢)',
      crossProduct: 'Storm-related shift to grocery/dashmart actually benefited DDE fees structure',
      sources: [1, 2]
    },
    {
      title: '⚡ Dasher Retention Breakthrough',
      metric: '68% D30 Retention (+5.4% WoW)',
      insight: 'New incentive structure piloted in 8 test cities showing exceptional results: +15% retention improvement vs control. Base pay underspend of +6¢ while improving retention is a rare win-win. If scaled nationally, could reduce Dasher acquisition costs by $8M/month while improving supply quality.',
      action: 'Recommend accelerating rollout to top 20 metros by end of Q1',
      sources: [3]
    },
    {
      title: '📈 DashPass Holding Strong Despite Storm',
      metric: '20.19M paid subs (99.8% vs Plan), 2.13M signups (+103.2% vs Plan)',
      insight: 'Churn stable at target 2.25% despite weather headwinds. Signups exceeding plan shows conversion funnel resilience. DashPass GOV at $4.4B holding steady, indicating subscriber engagement remains high even during adverse conditions.',
      caution: 'Monitor Classic & Resurrected customer segments - they were disproportionately impacted by MAU decline',
      sources: [4, 5]
    }
  ],
  concerns: [
    {
      title: '❄️ Winter Storm Fern Multi-Faceted Impact',
      metric: 'MAU -150K over weekend, GOV -$6M vs plan',
      insight: 'Weekend storm created cascading effects across business: 1) MAUs dropped from +16.6% → +8.8% w/w growth, resulting in -150K users and MAU Net Adds loss of +300K w/w. 2) 5 of 8 top metros (DFW, DMV, Tri-State, NYC, ATL) saw significant volume headwinds. 3) Storm drove mix-shift from Rx to Grocery/Dashmart, suppressing Rx volume -5.0% w/w and 20% below y/y. 4) Tier 4-5 markets saw $6M QTD gap to stretch.',
      actions: [
        'MONITOR: Track recovery trajectory through Feb 12-15. Weather clearing should normalize by mid-March.',
        'SEGMENT FOCUS: Classic & Resurrected Cx particularly affected - consider re-engagement campaign',
        'LEARNINGS: Document storm playbook - DDE fee benefit from grocery mix-shift partially offset GOV loss'
      ],
      sources: [1, 6]
    },
    {
      title: '🚕 NYC Tipping Headwind & CA Back Payment',
      metric: 'VP/order in Reg Markets at $1.84 (94.8% vs Plan)',
      insight: 'QTD miss driven by two specific issues: 1) Week of 1/12 contained one-time $3.8M CA back payment stemming from Dx cancels issue that began Nov 25 (incorrectly counted excluded cancels), 2) NYC tipping regulation effective 1/26 created $54M headwind from AR degradation - tips moved to pre-checkout reducing conversion.',
      actions: [
        'NYC TIPS: $54M headwind already included in AOP with plan to fully offset. Currently pacing to offset via min wage increase actuals (lower than expected) + AE goodness',
        'CA BACK PAYMENT: One-time issue, table correction completed. Should not recur.',
        'TRACK: Monitor NYC market separately to validate offset strategies are working'
      ],
      sources: [1, 7]
    }
  ],
    emergingPatterns: [
      'Weather resilience showing in profitability: Despite volume loss, contribution margin stayed +8bc vs plan due to operational excellence',
      'Storm-driven behavior shift: Mix-shift to grocery/dashmart during storms provides natural hedge via DDE fee structure',
      'DashPass proving as retention anchor: Churn held steady at 2.25% despite MAU headwinds from weather - paid subscribers more resilient'
    ],
    sources: [
      { id: 1, name: 'Executive Dashboard - Company Metrics', type: 'Dashboard', url: '#', lastRefreshed: '45 mins ago' },
      { id: 2, name: 'Weekly Business Review - Feb 5', type: 'WBR', url: '#', lastRefreshed: '3 days ago' },
      { id: 3, name: 'Dasher Incentive Experiment Results', type: 'Experiment Email', url: '#', lastRefreshed: '5 days ago' },
      { id: 4, name: 'DashPass Product Strategy Doc', type: 'Product Doc', url: '#', lastRefreshed: '1 week ago' },
      { id: 5, name: 'Customer Segmentation Analysis', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '2 hours ago' },
      { id: 6, name: 'Market Performance Tracker', type: 'Dashboard', url: '#', lastRefreshed: '1 hour ago' },
      { id: 7, name: 'Regional Operations Report', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 hour ago' }
    ]
  },
  'us-marketplace': {
    timestamp: 'Feb 9, 2026 8:05 AM PST',
    confidence: 94,
    overallHealth: 'strong',
    trend: 'up',
    summary: 'USMP Rx at 98.7% vs plan with iGOV outperforming. Super Bowl campaign delivered record results.',
    highlights: [
      {
        title: '🏈 Super Bowl Campaign Breaks Records',
        metric: '$58.5M iGOV (150% to goal)',
        insight: 'Super Bowl Sunday campaign exceeded all targets with $58.5M in incremental GOV, 150% to goal. Strong performance across all channels: TV spots during game, in-app promotions, and celebrity partnerships. Customer acquisition costs were 40% lower than planned while conversion rates hit all-time highs.',
        action: 'Document playbook for future tentpole events. Marketing team requesting additional budget for March Madness.',
        sources: [2, 10]
      },
      {
        title: '🥩 Beef 101 Viral Moment',
        metric: '30M+ views (293x average)',
        insight: 'Organic social content "Beef 101: What Cuts to Order" went viral on TikTok and Instagram with 30M+ views, 293x our average reach. Drove 180K new user signups with zero paid spend. Gen Z engagement up 340%, now our fastest-growing segment. Content sparked user-generated copycat videos extending reach.',
        crossProduct: 'Social-first strategy proving more effective than paid campaigns for Gen Z acquisition',
        sources: [11, 5]
      },
      {
        title: '🌆 Top Metro GOV Exceeds Plan',
        metric: '100.9% vs plan, carry-over pipeline strong',
        insight: 'Top 8 metros performing at 100.9% to plan driven by successful Q4 merchant launches now ramping. NYC, LA, and Chicago leading with 105%+ performance. Merchant density improvements reducing delivery times by avg 3.2 minutes, improving HQDR and customer satisfaction.',
        sources: [1, 6]
      }
    ],
    concerns: [
      {
        title: '📉 MAU Recovery Slower Than Expected',
        metric: 'Recovery needs until end of Feb vs mid-Feb target',
        insight: 'Post-storm MAU recovery tracking 2 weeks behind initial forecast. Classic and Resurrected customer segments showing weaker re-engagement than New/Core segments. Weather normalization happening but slower return to ordering patterns. Need strong Feb performance to hit Q1 targets.',
        actions: [
          'MARKETING: Launch targeted re-engagement campaign for lapsed Classic customers',
          'PROMO: Consider selective discount offers in affected metros to accelerate recovery',
          'TRACK: Daily MAU monitoring through end of Feb with escalation triggers'
        ],
        sources: [1, 5]
      },
      {
        title: '🎯 Tier 4-5 Markets Tracking to 96% Stretch',
        metric: '96% to stretch AOP, market outperformance needed',
        insight: 'Tier 4-5 markets at 96% of stretch AOP goals. Growth rates below plan in secondary markets due to competitive pressure and marketing spend efficiency challenges. Need above-plan performance in March to close gap. Some markets showing saturation signals.',
        actions: [
          'IMMEDIATE: Analyze top 20 Tier 4-5 markets for intervention opportunities',
          'MARKETING: Shift budget from saturated to high-growth potential markets',
          'PRODUCT: Accelerate local merchant partnerships in underperforming areas'
        ],
        sources: [6, 7]
      }
    ],
    emergingPatterns: [
      'Social-first content strategy (like Beef 101) delivering 10x ROI vs traditional paid marketing for Gen Z',
      'Cold weather extended demand in Tier 1-2 markets but hurt growth in Tier 4-5 where we have less density',
      'Q1 scaling experiments (carousel ads, dynamic pricing) driving PNA region outperformance at 103% vs plan'
    ],
    sources: [
      { id: 1, name: 'Super Bowl Campaign Results', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 day ago' },
      { id: 2, name: 'USMP Weekly Business Review', type: 'WBR', url: '#', lastRefreshed: '2 days ago' },
      { id: 3, name: 'Social Media Performance Report', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '12 hours ago' },
      { id: 4, name: 'Customer Segmentation Analysis', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '2 hours ago' },
      { id: 5, name: 'Market Performance Tracker', type: 'Dashboard', url: '#', lastRefreshed: '1 hour ago' },
      { id: 6, name: 'Regional Operations Report', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 hour ago' }
    ]
  },
  'us-nv': {
    timestamp: 'Feb 9, 2026 8:05 AM PST',
    confidence: 89,
    overallHealth: 'caution',
    trend: 'flat',
    summary: 'US NV GOV at $1.84B (98% vs plan) but forecasting $83.9M Q1 miss. Strong performance in Gift Cards and DashMart offset by Grocery headwinds.',
    highlights: [
      {
        title: '🎁 Digital Gift Cards Breakout Quarter',
        metric: '$13.0M GOV (124% vs plan, +17% WoW)',
        insight: 'Digital 3P gift cards massively outperforming driven by Super Bowl partnership generating increased traffic to gift card VLP. 50 cent x DoorDash co-branded gift cards highlighted across social/in-app. Strong momentum heading into Valentine\'s Day with Mx-funded 15% off discounts on 3PGCs. Forecasting to exit Q1 at 118% to plan.',
        action: 'Double down on tentpole event partnerships for gift cards. Scale co-branded strategy.',
        sources: [15, 2]
      },
      {
        title: '🏪 DashMart & Retail Exceeding Plan',
        metric: 'DashMart $89.8M (102% vs plan), 3P Retail $260.1M (101% vs plan)',
        insight: 'DashMart continuing strong trajectory with 102% performance. 3P Retail at 101% driven by convenience and quick commerce demand. Both verticals showing resilience and consistent execution against targets.',
        sources: [1, 16]
      },
      {
        title: '📈 NV Drive Volume Surge',
        metric: '3.9M drives (132% vs plan, 145% volume performance)',
        insight: 'NV Drive volume dramatically outperforming at 145% vPlan due to Mx-funded Super Bowl campaigns. Strong consumer adoption across portfolio demonstrating product-market fit and marketing effectiveness.',
        sources: [1, 17]
      }
    ],
    concerns: [
      {
        title: '🛒 Grocery Miss Driving Q1 Gap',
        metric: '$83.9M forecasted Q1 miss ($40M realized QTD)',
        insight: 'Forecasting miss to quarter by $83.9M with $40M already realized. Root causes: 1) $50M Kroger SNAP miss due to broken data pipelines in DnD post-checkout ranker, 2) $5M 3PC miss from data pipeline issues, 3) $25M aggregate from weather and cold/flu trends softer YoY. Not reinvesting to close gap - expect miss to persist through Feb + March.',
        actions: [
          'IMMEDIATE: Fix DnD post-checkout ranker data pipeline for Kroger SNAP',
          'IMMEDIATE: Repair 3PC data pipelines causing $5M miss',
          'DECISION: Confirm no reinvestment strategy - accept Q1 miss to preserve unit economics',
          'TRACKING: Pull non-monetary levers where possible (homepage XP ships, DnD landing page fix for ~$5M impact)'
        ],
        sources: [1, 16]
      },
      {
        title: '💸 Negative Unit Economics on NV',
        metric: 'Gross Profit -$9.3M (operational adj.), CM negative on Drive',
        insight: '$5M Gross Profit miss driven by unit economics misses on FCO. $9M base pay beat offset by $11M storm-driven impact to DxO and C&R. $4.5M miss on MOE. Revenue $1.8M better than Adj. GP due to $900k beat on selection investment and Ops Costs. NV Drive Q1 CM miss continues - driven by CM negative merchants (Walgreens at 216% volume contributing 61% of CM miss, HEB at 119% volume contributing 40% of CM miss).',
        actions: [
          'UNIT ECONOMICS: Address FCO efficiency gaps',
          'MERCHANT MIX: Revisit high-volume but CM-negative merchants (Walgreens, HEB)',
          'STRATEGIC: Evaluate NFS roadmap outcome impact on $2M additional risk',
          'OPTIMIZATION: Clawback options implemented this week to recoup majority of Gross Profit miss'
        ],
        sources: [1, 16]
      }
    ],
    emergingPatterns: [
      'Gift cards becoming tentpole-event winner: Super Bowl drove 124% performance, Valentine\'s Day momentum building',
      'Volume wins not translating to profit: 145% vPlan on NV Drive but CM negative on key merchants',
      'Data pipeline issues causing cascading misses: Kroger SNAP + 3PC issues = $55M of $83.9M Q1 gap'
    ],
    sources: [
      { id: 1, name: 'New Verticals Weekly Business Review', type: 'WBR', url: '#', lastRefreshed: '2 days ago' },
      { id: 2, name: 'Gift Cards Performance Report', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 day ago' },
      { id: 3, name: 'NV Drive Campaign Analysis', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 day ago' }
    ]
  },
  'ads-promos': {
    timestamp: 'Feb 9, 2026 8:05 AM PST',
    confidence: 91,
    overallHealth: 'strong',
    trend: 'up',
    summary: 'Total A&P Revenue at $175M (104% vs plan). Strong US Rx ENT and CPG Ads performance. iGOV dramatically outperforming at 145% vs plan.',
    highlights: [
      {
        title: '🚀 iGOV Massively Outperforming',
        metric: '$707M (145% vs plan, +30% YoY incremental)',
        insight: 'Total iGOV overpacing driven by higher incrementality of Mx-funded promos. Recent holdout shows 30% YoY increase in incrementality to DoorDash for each dollar of Mx funded consumer savings. Driven by smart campaigns (higher efficiency for Mx\'s and DD), 2x\'s YoY BOGO growth, and merchandising improvements that increase promo visibility and same-day conversion rates. Increasing Q1 forecast from 1.1B to 1.4B, representing $706M increase in YoY iGOV.',
        action: 'Continue scaling Mx-funded promo strategy - incrementality proven at 30% YoY',
        sources: [18, 2]
      },
      {
        title: '🍕 US Rx ENT Ads Breakthrough',
        metric: '$61M (108% vs plan, +1% WoW)',
        insight: 'QTD pacing at 108% (+1% WoW). Overdelivery from last week attributed to: 1) PLK (+$380k) as result of PLK resuming campaigns which they paused at end of Jan for DD funded test, 2) KFC activating an incremental campaign via AM with marketing fund (+$106k), 3) Pizza Hut launching uncapped SL campaigns across new and lapsed audiences as they experiment with investment allocation between Corp and Fz. Full quarter forecast has been raised +$6M thus far.',
        sources: [18, 19]
      },
      {
        title: '🏈 CPG Core Super Bowl Record Week',
        metric: '$3.7M (98% vs plan, 104% QTD)',
        insight: 'Core Super Bowl was biggest week of the quarter at 3.7M/98% to plan. Continuing to build pipeline for March with $1M+ in incremental opportunities being pursued to hit 100% for EOQ. Key opportunities to land include accelerated General Mills plan (+$75K), Spotlight takeover test ($300K+), unlocking Campbell\'s (net new Ax) in quarter ($100K test), and late night sponsorships ($100K).',
        action: 'Execute on $1M+ pipeline opportunities. Scale Super Bowl learnings to March Madness.',
        sources: [18]
      }
    ],
    concerns: [
      {
        title: '📉 US Rx SMB Revenue Soft Week',
        metric: '$85M (84% vs plan for week, 97% QTD)',
        insight: 'US Rx SMB revenue came in soft last week (84%) driven by one-week delay in expected Robinhood stores going live and a brief SL ad load incident (2/3–2/5) that recovered on 2/6 with root cause still being investigated. This puts SMB at 97% QTD vs plan, and we expect to recover most of the gap as Robinhood stores went live 2/10 (7 days late). Holding on EOQ1 forecast and will utilize the signal from this week to see if we can expect any overage.',
        actions: [
          'MONITOR: Track Robinhood stores impact post 2/10 launch',
          'INVESTIGATE: Complete root cause analysis on SL ad load incident',
          'RECOVER: Execute recovery plan to close 3% gap to plan by EOQ'
        ],
        sources: [18]
      },
      {
        title: '⚠️ Symbiosys & Offsite Ads Delays',
        metric: 'Symbiosys $0.5M (85% vs plan), Offsite $0.53M (292% vs plan but soft)',
        insight: 'Symbiosys revenue soft past two weeks due to delayed Sephora launch waiting on product updates to Symbiosys UI. Rappi launch delayed due to catalog issues. Core Business and Onsite/Offsite expected to reach $1.2M and $1M respectively, with notable increase in Onsite/Offsite spending anticipated towards end of Q1. CPG/Ent Offsite pacing behind weekly goal but sprinting to close gap through co-funding with onsite activators (Unilever, Liquid Death, Pepsi/Lay\'s, ABI). SMB Offsite at 86% QTD gross revenue, scaling new markets but slow ramp.',
        actions: [
          'UNBLOCK: Expedite Symbiosys UI updates for Sephora launch',
          'PARTNERSHIPS: Accelerate co-funding activations with CPG/Ent partners',
          'SCALING: Continue SMB Offsite market expansion with realistic ramp expectations'
        ],
        sources: [18]
      }
    ],
    emergingPatterns: [
      'Mx-funded promos proving 30% YoY incremental lift - strong ROI case for continued investment',
      'Tentpole events (Super Bowl) driving record weeks - need playbook for March Madness and beyond',
      'ENT vertical momentum building: PLK, KFC, Pizza Hut all activating and spending more'
    ],
    sources: [
      { id: 1, name: 'Ads & Promos Weekly Business Review', type: 'WBR', url: '#', lastRefreshed: '2 days ago' },
      { id: 2, name: 'Restaurant ENT Advertising Report', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '1 day ago' }
    ]
  },
  dashpass: {
    timestamp: 'Feb 9, 2026 8:05 AM PST',
    confidence: 93,
    overallHealth: 'strong',
    trend: 'up',
    summary: '20.19M paid subs (99.8% vs Plan) with record signups. Churn holding steady despite weather headwinds.',
    highlights: [
      {
        title: '📈 Record Signup Performance',
        metric: '2.13M signups (103.2% vs Plan)',
        insight: 'January signups exceeded plan by 3.2% despite weather disruptions. New student tier (launched Jan 15) converting at 28% vs 18% target. Partnership with Chase Sapphire driving high-value subscriber acquisition. Signup-to-paid conversion improved to 67% from 62% last quarter.',
        action: 'Scale student tier marketing campaign. Explore similar tiered offerings for seniors.',
        sources: [4, 12]
      },
      {
        title: '💪 Churn Resilience During Storm',
        metric: '2.25% churn (on target)',
        insight: 'Churn held exactly at 2.25% target despite MAU decline from winter storm. DashPass members showed 4x higher retention vs non-members during weather disruption. Free trial churn decreased to 42% from 48%, indicating better trial experience matching expectations.',
        sources: [4]
      },
      {
        title: '💰 Subscriber GOV Steady',
        metric: '$4.4B DashPass GOV holding',
        insight: 'DashPass GOV at $4.4B, flat vs prior week despite overall GOV softness. Average orders per subscriber at 4.2/month (above 4.0 target). Premium tier members ordering 6.1x/month, validating tier strategy.',
        sources: [1, 4]
      }
    ],
    concerns: [
      {
        title: '⚠️ Classic Segment Churn Uptick',
        metric: 'Classic segment churn +0.8pp MoM',
        insight: 'Classic customer segment (price-sensitive, occasional users) showing churn increase to 3.1% from 2.3%. Weather reduced their order frequency below value threshold. This segment also most impacted by recent DashPass price increase ($9.99 → $10.99).',
        actions: [
          'PRICING: Consider grandfather pricing for existing Classic segment members',
          'PRODUCT: Test "pause membership" feature vs hard cancel',
          'MARKETING: Re-engagement campaign highlighting new restaurant selection'
        ],
        sources: [4, 5]
      }
    ],
    emergingPatterns: [
      'Tiered pricing strategy working: Student tier 28% conversion, Premium tier 6.1 orders/month proving willingness to pay for value',
      'DashPass acting as retention moat during disruptions: 4x better retention than non-members during storm',
      'Free trial quality improvements reducing churn: 42% vs 48% baseline shows better expectation-setting'
    ]
  },
  'dd-commerce': {
    timestamp: 'Feb 9, 2026 8:05 AM PST',
    confidence: 90,
    overallHealth: 'strong',
    trend: 'up',
    summary: 'DCP Volume at $32.8M (104% above plan) driven by Rx ENT. Total DCP CM beating plan by +$6.0M. Strong fundamentals with execution challenges in SMB and Parcel.',
    highlights: [
      {
        title: '💰 DCP Volume & CM Crushing Plan',
        metric: '$32.8M Volume (104% vs plan), CM +$6.0M vs plan',
        insight: 'Total DCP volume 104% above plan driven by Rx ENT reflecting higher baseline from strong New Year performance (Chipotle, Taco Bell, McDonald\'s). DCP CM beating plan by +$6.0M and +$1.7M w/w, with majority of beat driven by Rx volume outperformance and lower Dx Base costs due to better actualization in baseline and US Non-Reg Rx reforecast.',
        action: 'Continue capitalizing on Rx ENT momentum. Monitor for Q1 sustainability.',
        sources: [20, 1]
      },
      {
        title: '📊 MQL Performance Breakthrough',
        metric: 'MQLs +127% vs goal',
        insight: 'MQLs dramatically overperformed vs. last week\'s goal (+127% to goal) due to improved routing to webinar CTAs & CRM catch-up volume. This sets strong foundation for pipeline, though PQLs missed (87% to goal) due to bug impacting lead creation when merchants landed on Chilical booking page (90% of miss) and lower CVR from removing pricing on Mx portal (10% of miss). Bug addressed, leads rebounding.',
        sources: [20, 21]
      },
      {
        title: '📦 Parcel OTD Excellence',
        metric: '96% OTD average, high confidence for 97% EOQ',
        insight: 'On-time delivery for parcels averaging 96% with exception of 1/29 weather delays. Strong operational execution with clear path to 97% by end of quarter. Key actions include improved return to hub flows to ensure 100% of returns loaded to first available truck.',
        sources: [20]
      }
    ],
    concerns: [
      {
        title: '📉 SMB DO BHAG Pacing Behind Month 2',
        metric: 'Pro New Store Signs at 81% QTD, Pro ASP at 97%',
        insight: 'Paced ahead in Month 1, but now pacing behind in Month 2 as goals ramped up. Pro CWs at 81% QTD driven by misses on overall CWs (93%) and Pro attach rate (79%). EOQ call is 94%. High-confidence initiatives in place but need aggressive execution: Pro pipeline & forecast focus, Pro package demo training rolled out to full team, inbound TOFU initiatives (e.g. manual uploads of high-value leads). Pro ASP at $183 (97% to goal) impacted by discounting on larger deals including holdovers from Q4.',
        actions: [
          'SALES EXECUTION: Focus on Pro New Store Signs and Inbound CWs - end of quarter walks to goal in place',
          'ENABLEMENT: Complete Pro package demo training rollout',
          'PIPELINE: Manual uploads of high-value leads, retarget inbound CLs from 2025',
          'MQL/PQL: Address Chilical bug (completed), launch better landing page for merchants from feedcard'
        ],
        sources: [20]
      },
      {
        title: '📦 Parcel Loss Rate Spike & Pathfinder Ramping Issues',
        metric: 'Loss Rate at 0.29% (spike from baseline), Pathfinder stores missing on activations',
        insight: 'Parcel loss rate spiked to 0.29% due to: 1) Return to Hub delays via Missouri incorrect spoke causing 4+ day delays (exacerbated during weather like 1/26), 2) Theft at LAX Hub with additional security measures now in partnership with GA Logistics, 3) Final Mile app/connectivity issues preventing task closeout. Pathfinder total stores miss driven by softer new activations (C/W rate off SQQ) with gap in ramped production of new hires (pacing >100% to plan but C/W concentrated amongst small % of reps). Skill gap in discovery at 57% to plan on CVR off SQQ.',
        actions: [
          'PARCEL: Building improved return to hub flows, blocking runners with fraud detection (completed 2/11), improving support SOPs and building alerts (Plan by 2/13)',
          'PATHFINDER: Diagnose training gaps vs talent issues, leadership shadowing pitches to launch new training by end of next week',
          'SMB: Focus on inbound lead quality (Mx no shows, MP support inbounds) - pacing at 98%'
        ],
        sources: [20]
      }
    ],
    emergingPatterns: [
      'Rx ENT strength continuing from New Year momentum - need to capture learnings for tentpole events',
      'Lead generation strong (MQL +127%) but conversion funnel needs work (PQL at 87%) - bug fixes showing immediate impact',
      'Operational excellence in Parcel OTD (96%) but fraud/theft requiring new security protocols'
    ],
    sources: [
      { id: 1, name: 'DoorDash Commerce Weekly Review', type: 'WBR', url: '#', lastRefreshed: '2 days ago' },
      { id: 2, name: 'Commerce Lead Generation Dashboard', type: 'Dashboard', url: '#', lastRefreshed: '1 hour ago' }
    ]
  },
  dasher: {
    timestamp: 'Feb 9, 2026 8:05 AM PST',
    confidence: 91,
    overallHealth: 'strong',
    trend: 'up',
    summary: '68% D30 Retention (+5.4pp WoW). New incentive pilot delivering exceptional results in test markets.',
    highlights: [
      {
        title: '⚡ Incentive Pilot Breakthrough',
        metric: '68% D30 Retention (+5.4pp WoW)',
        insight: 'New incentive structure piloted in 8 test cities showing +15% retention improvement vs control. Combines guaranteed earnings floor with performance bonuses. Base pay underspend of +6¢ while improving retention is rare win-win. Driver satisfaction scores up 12pts in test markets.',
        action: 'Accelerate rollout to top 20 metros by end of Q1. National rollout targeting Q2.',
        sources: [3, 13]
      },
      {
        title: '📊 Base Pay Efficiency',
        metric: '+6¢ underspend per order',
        insight: 'Routing algorithm improvements and batching optimization reducing base pay per order by 6¢ while maintaining HQDR at 95%+. Supply-demand balancing working as designed. Dasher earnings stable despite efficiency gains due to higher tip rates.',
        sources: [1, 3]
      }
    ],
    concerns: [
      {
        title: '🚧 Tier 3 Market Supply Gaps',
        metric: 'Supply coverage at 87% vs 95% target',
        insight: 'Mid-size markets (Tier 3) showing persistent supply gaps at peak hours. Dasher recruitment 23% below target in these markets. Competition from other platforms intensifying. Weather exacerbated but not root cause.',
        actions: [
          'RECRUITING: Dedicated Tier 3 market recruitment team + $500 sign-on bonus pilot',
          'INCENTIVES: Peak hour multipliers in supply-constrained zones',
          'RETENTION: Apply test city incentive learnings to Tier 3 specifically'
        ],
        sources: [3, 14]
      }
    ],
    emergingPatterns: [
      'Incentive structure balancing retention + efficiency: +15% retention while saving 6¢/order',
      'Tier 3 markets need different playbook than Tier 1-2: Higher bonuses, more local recruiting vs digital',
      'Driver satisfaction correlates 0.89 with retention: Focus on experience, not just pay'
    ],
    sources: [
      { id: 1, name: 'Dasher Incentive Pilot Results', type: 'Experiment Email', url: '#', lastRefreshed: '3 days ago' },
      { id: 2, name: 'Supply Coverage Analysis', type: 'Analytics Deep Dive', url: '#', lastRefreshed: '2 hours ago' },
      { id: 3, name: 'Dasher Operations Weekly Review', type: 'WBR', url: '#', lastRefreshed: '2 days ago' }
    ]
  }
};
