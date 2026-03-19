import type { AIOverviewResponse } from '@/types/ai';
import { Database, BarChart3, FileText } from 'lucide-react';

export function getAIResponse(query: string): AIOverviewResponse {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('merchant') && (lowerQuery.includes('cancel') || lowerQuery.includes('churn'))) {
    return {
      summary: "Merchant cancellation rate has increased by 2.3% over the last month, primarily driven by three factors: (1) seasonal slowdown in the food delivery market affecting smaller merchants, (2) increased competition from new delivery platforms in tier-2 cities, and (3) pricing changes that impacted merchant profitability. The increase is concentrated in specific segments, with restaurants under $50K monthly revenue showing the highest churn rates.",
      keyInsights: [
        { label: 'Overall Increase', value: '+2.3%', trend: 'up' as const },
        { label: 'Highest Impact Segment', value: 'Small Restaurants', trend: 'neutral' as const },
        { label: 'Geographic Concentration', value: 'Tier-2 Cities', trend: 'neutral' as const }
      ],
      chartData: [
        { month: 'Jan', rate: 3.2 },
        { month: 'Feb', rate: 3.4 },
        { month: 'Mar', rate: 3.1 },
        { month: 'Apr', rate: 3.8 },
        { month: 'May', rate: 4.2 },
        { month: 'Jun', rate: 4.5 }
      ],
      segmentData: [
        { segment: 'Small (<$50K)', value: 6.8 },
        { segment: 'Medium ($50-200K)', value: 3.2 },
        { segment: 'Large (>$200K)', value: 1.4 }
      ],
      sources: [
        { name: 'merchant_events_table', type: 'table' as const, icon: Database, confidence: 95 },
        { name: 'Merchant Health Dashboard', type: 'dashboard' as const, icon: BarChart3, confidence: 92 },
        { name: 'Merchant Churn Analysis Report', type: 'report' as const, icon: FileText, confidence: 88 }
      ],
      reasoning: [
        'Analyzed 30-day trend from merchant_events_table showing 2.3% increase',
        'Cross-referenced geographic data revealing tier-2 city concentration',
        'Segmented by revenue size using merchant_profiles dimension table',
        'Correlated with pricing change timeline from product_changes_log'
      ]
    };
  } else if (lowerQuery.includes('revenue') && (lowerQuery.includes('grow') || lowerQuery.includes('increas') || lowerQuery.includes('trend'))) {
    return {
      summary: "Revenue is growing at a healthy 18.5% year-over-year, driven primarily by increased order frequency from DashPass members and geographic expansion into new markets. The growth is sustainable, with improving unit economics and strong retention metrics. Key markets like California and Texas are outperforming, while international markets show promising early traction.",
      keyInsights: [
        { label: 'YoY Growth', value: '+18.5%', trend: 'up' as const },
        { label: 'DashPass Contribution', value: '+42%', trend: 'up' as const },
        { label: 'New Market Revenue', value: '$12.3M', trend: 'up' as const }
      ],
      chartData: [
        { month: 'Jan', revenue: 4800 },
        { month: 'Feb', revenue: 5200 },
        { month: 'Mar', revenue: 6100 },
        { month: 'Apr', revenue: 5500 },
        { month: 'May', revenue: 6800 },
        { month: 'Jun', revenue: 7200 }
      ],
      segmentData: [
        { segment: 'DashPass', value: 4200 },
        { segment: 'Regular Orders', value: 2100 },
        { segment: 'New Markets', value: 900 }
      ],
      sources: [
        { name: 'revenue_daily_fact', type: 'table' as const, icon: Database, confidence: 98 },
        { name: 'Revenue Analytics Dashboard', type: 'dashboard' as const, icon: BarChart3, confidence: 94 },
        { name: 'dashpass_metrics_table', type: 'table' as const, icon: Database, confidence: 91 }
      ],
      reasoning: [
        'Calculated YoY growth from revenue_daily_fact aggregated by month',
        'Isolated DashPass contribution using subscription_revenue segment',
        'Identified new market performance from geo_expansion_metrics',
        'Validated unit economics improvement from cost_per_order trend'
      ]
    };
  } else if (lowerQuery.includes('customer') && lowerQuery.includes('retention')) {
    return {
      summary: "Customer retention has improved significantly, reaching 78.2% (up 8.2% from last quarter). The improvement is attributed to the new DashPass premium tier launch, enhanced personalization in the app, and improved delivery experience. First-time user retention increased by 12%, indicating strong product-market fit improvements.",
      keyInsights: [
        { label: 'Overall Retention', value: '78.2%', trend: 'up' as const },
        { label: 'Quarter over Quarter', value: '+8.2%', trend: 'up' as const },
        { label: 'First-time Users', value: '+12%', trend: 'up' as const }
      ],
      chartData: [
        { month: 'Jan', rate: 70 },
        { month: 'Feb', rate: 72 },
        { month: 'Mar', rate: 74 },
        { month: 'Apr', rate: 75 },
        { month: 'May', rate: 76 },
        { month: 'Jun', rate: 78 }
      ],
      segmentData: [
        { segment: 'DashPass', value: 92 },
        { segment: 'Premium', value: 88 },
        { segment: 'Standard', value: 65 }
      ],
      sources: [
        { name: 'customer_cohort_analysis', type: 'table' as const, icon: Database, confidence: 96 },
        { name: 'Customer Insights Dashboard', type: 'dashboard' as const, icon: BarChart3, confidence: 93 },
        { name: 'user_retention_metrics', type: 'table' as const, icon: Database, confidence: 90 }
      ],
      reasoning: [
        'Computed retention rate from customer_cohort_analysis using 90-day window',
        'Segmented by subscription tier to identify DashPass premium impact',
        'Analyzed first-time user cohorts from user_acquisition_events',
        'Correlated retention improvement with app_feature_releases timeline'
      ]
    };
  } else {
    // Default response for order-related queries
    return {
      summary: "Order volume has grown by 15% month-over-month, with particularly strong performance during dinner hours and weekends. The BOGO campaign in Canada drove significant incremental orders, while the new ghost kitchen partnerships expanded selection in key markets. Mobile app orders continue to dominate, representing 87% of total volume.",
      keyInsights: [
        { label: 'MoM Growth', value: '+15%', trend: 'up' as const },
        { label: 'Peak Hour Performance', value: '+23%', trend: 'up' as const },
        { label: 'Mobile Share', value: '87%', trend: 'up' as const }
      ],
      chartData: [
        { month: 'Jan', orders: 24000 },
        { month: 'Feb', orders: 28000 },
        { month: 'Mar', orders: 32000 },
        { month: 'Apr', orders: 29000 },
        { month: 'May', orders: 35000 },
        { month: 'Jun', orders: 38000 }
      ],
      segmentData: [
        { segment: 'Dinner', value: 18500 },
        { segment: 'Lunch', value: 12300 },
        { segment: 'Late Night', value: 7200 }
      ],
      sources: [
        { name: 'orders_fact_table', type: 'table' as const, icon: Database, confidence: 97 },
        { name: 'Order Analytics Dashboard', type: 'dashboard' as const, icon: BarChart3, confidence: 94 },
        { name: 'campaign_performance_metrics', type: 'table' as const, icon: Database, confidence: 89 }
      ],
      reasoning: [
        'Aggregated order counts from orders_fact_table by month',
        'Segmented by hour_of_day dimension to identify peak performance',
        'Isolated campaign impact using promo_code attribution',
        'Calculated mobile share from platform_type breakdown'
      ]
    };
  }
}
