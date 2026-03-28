import type { ChartBuilderField, ChartType } from '@/types';

export interface SourceItem {
  id: string;
  name: string;
  description: string;
  type: 'sql' | 'semantic' | 'metrics';
}

export interface SourceFields {
  measures: ChartBuilderField[];
  dimensions: ChartBuilderField[];
  dateFields: ChartBuilderField[];
}

export const CHART_BUILDER_SOURCES: Record<'sql' | 'semantic' | 'metrics', SourceItem[]> = {
  sql: [
    { id: 'sql-1', name: 'fact_deliveries', description: 'Core delivery events table', type: 'sql' },
    { id: 'sql-2', name: 'fact_orders', description: 'Order transactions', type: 'sql' },
    { id: 'sql-3', name: 'dim_merchants', description: 'Merchant dimension table', type: 'sql' },
    { id: 'sql-4', name: 'dim_consumers', description: 'Consumer profiles and attributes', type: 'sql' },
    { id: 'sql-5', name: 'fact_dasher_pay', description: 'Dasher payment events', type: 'sql' },
  ],
  semantic: [
    { id: 'sem-1', name: 'order_metrics', description: 'dbt semantic model — orders', type: 'semantic' },
    { id: 'sem-2', name: 'delivery_performance', description: 'dbt semantic — delivery SLA', type: 'semantic' },
    { id: 'sem-3', name: 'revenue_model', description: 'dbt semantic — revenue attribution', type: 'semantic' },
    { id: 'sem-4', name: 'cx_satisfaction', description: 'dbt semantic — customer satisfaction', type: 'semantic' },
  ],
  metrics: [
    { id: 'met-1', name: 'GOV (Gross Order Value)', description: 'Total order value including tips', type: 'metrics' },
    { id: 'met-2', name: 'Net Revenue', description: 'Revenue after refunds and credits', type: 'metrics' },
    { id: 'met-3', name: 'Active Dashers', description: 'Dashers with >= 1 delivery in period', type: 'metrics' },
    { id: 'met-4', name: 'P50 Delivery Time', description: 'Median delivery duration', type: 'metrics' },
    { id: 'met-5', name: 'DashPass Subscribers', description: 'Total paid DashPass subscribers', type: 'metrics' },
    { id: 'met-6', name: 'Consumer MAUs', description: 'Monthly active users (L28)', type: 'metrics' },
  ],
};

export const SOURCE_FIELDS: Record<string, SourceFields> = {
  'sql-1': {
    measures: [
      { id: 'f-sql1-m1', name: 'total_deliveries', role: 'measure', dataType: 'number', description: 'Total number of deliveries', aggregation: 'COUNT' },
      { id: 'f-sql1-m2', name: 'avg_delivery_time', role: 'measure', dataType: 'number', description: 'Average delivery time in minutes', aggregation: 'AVG' },
      { id: 'f-sql1-m3', name: 'delivery_fee', role: 'measure', dataType: 'number', description: 'Delivery fee charged to consumer', aggregation: 'SUM' },
      { id: 'f-sql1-m4', name: 'tips', role: 'measure', dataType: 'number', description: 'Tip amount from consumer', aggregation: 'SUM' },
    ],
    dimensions: [
      { id: 'f-sql1-d1', name: 'market_name', role: 'dimension', dataType: 'string', description: 'Geographic market name' },
      { id: 'f-sql1-d2', name: 'store_type', role: 'dimension', dataType: 'string', description: 'Type of merchant store' },
      { id: 'f-sql1-d3', name: 'delivery_status', role: 'dimension', dataType: 'string', description: 'Final delivery status' },
    ],
    dateFields: [
      { id: 'f-sql1-dt1', name: 'delivery_date', role: 'date', dataType: 'date', description: 'Date of delivery completion' },
      { id: 'f-sql1-dt2', name: 'created_at', role: 'date', dataType: 'date', description: 'Order creation timestamp' },
    ],
  },

  'sql-2': {
    measures: [
      { id: 'f-sql2-m1', name: 'order_count', role: 'measure', dataType: 'number', description: 'Total number of orders', aggregation: 'COUNT' },
      { id: 'f-sql2-m2', name: 'order_subtotal', role: 'measure', dataType: 'number', description: 'Order subtotal before fees', aggregation: 'SUM' },
      { id: 'f-sql2-m3', name: 'order_total', role: 'measure', dataType: 'number', description: 'Total order value including all fees', aggregation: 'SUM' },
      { id: 'f-sql2-m4', name: 'item_count', role: 'measure', dataType: 'number', description: 'Number of items per order', aggregation: 'AVG' },
      { id: 'f-sql2-m5', name: 'cancellation_rate', role: 'measure', dataType: 'number', description: 'Rate of cancelled orders', aggregation: 'AVG' },
    ],
    dimensions: [
      { id: 'f-sql2-d1', name: 'order_status', role: 'dimension', dataType: 'string', description: 'Current order status' },
      { id: 'f-sql2-d2', name: 'platform', role: 'dimension', dataType: 'string', description: 'Ordering platform (iOS, Android, Web)' },
      { id: 'f-sql2-d3', name: 'is_dashpass', role: 'dimension', dataType: 'string', description: 'Whether order used DashPass' },
      { id: 'f-sql2-d4', name: 'market_name', role: 'dimension', dataType: 'string', description: 'Geographic market' },
    ],
    dateFields: [
      { id: 'f-sql2-dt1', name: 'order_date', role: 'date', dataType: 'date', description: 'Date order was placed' },
      { id: 'f-sql2-dt2', name: 'completed_at', role: 'date', dataType: 'date', description: 'Order completion timestamp' },
    ],
  },

  'sql-3': {
    measures: [
      { id: 'f-sql3-m1', name: 'merchant_count', role: 'measure', dataType: 'number', description: 'Total active merchants', aggregation: 'COUNT' },
      { id: 'f-sql3-m2', name: 'avg_rating', role: 'measure', dataType: 'number', description: 'Average merchant rating', aggregation: 'AVG' },
      { id: 'f-sql3-m3', name: 'total_orders', role: 'measure', dataType: 'number', description: 'Orders placed at this merchant', aggregation: 'SUM' },
      { id: 'f-sql3-m4', name: 'avg_prep_time', role: 'measure', dataType: 'number', description: 'Average food prep time in minutes', aggregation: 'AVG' },
    ],
    dimensions: [
      { id: 'f-sql3-d1', name: 'cuisine_type', role: 'dimension', dataType: 'string', description: 'Primary cuisine category' },
      { id: 'f-sql3-d2', name: 'merchant_tier', role: 'dimension', dataType: 'string', description: 'Merchant partnership tier' },
      { id: 'f-sql3-d3', name: 'city', role: 'dimension', dataType: 'string', description: 'City where merchant is located' },
      { id: 'f-sql3-d4', name: 'is_national_chain', role: 'dimension', dataType: 'string', description: 'Whether part of a national chain' },
    ],
    dateFields: [
      { id: 'f-sql3-dt1', name: 'onboarded_at', role: 'date', dataType: 'date', description: 'Date merchant joined DoorDash' },
    ],
  },

  'sql-4': {
    measures: [
      { id: 'f-sql4-m1', name: 'consumer_count', role: 'measure', dataType: 'number', description: 'Total consumers', aggregation: 'COUNT' },
      { id: 'f-sql4-m2', name: 'lifetime_orders', role: 'measure', dataType: 'number', description: 'Total orders in consumer lifetime', aggregation: 'SUM' },
      { id: 'f-sql4-m3', name: 'lifetime_spend', role: 'measure', dataType: 'number', description: 'Total consumer spend in lifetime', aggregation: 'SUM' },
      { id: 'f-sql4-m4', name: 'avg_order_frequency', role: 'measure', dataType: 'number', description: 'Average orders per month', aggregation: 'AVG' },
      { id: 'f-sql4-m5', name: 'churn_probability', role: 'measure', dataType: 'number', description: 'ML-predicted churn score', aggregation: 'AVG' },
    ],
    dimensions: [
      { id: 'f-sql4-d1', name: 'cohort_month', role: 'dimension', dataType: 'string', description: 'Month consumer first ordered' },
      { id: 'f-sql4-d2', name: 'dashpass_status', role: 'dimension', dataType: 'string', description: 'Current DashPass subscription status' },
      { id: 'f-sql4-d3', name: 'consumer_segment', role: 'dimension', dataType: 'string', description: 'Behavioral segmentation label' },
    ],
    dateFields: [
      { id: 'f-sql4-dt1', name: 'first_order_date', role: 'date', dataType: 'date', description: 'Date of first order' },
      { id: 'f-sql4-dt2', name: 'last_order_date', role: 'date', dataType: 'date', description: 'Date of most recent order' },
    ],
  },

  'sql-5': {
    measures: [
      { id: 'f-sql5-m1', name: 'total_pay', role: 'measure', dataType: 'number', description: 'Total dasher pay including tips', aggregation: 'SUM' },
      { id: 'f-sql5-m2', name: 'base_pay', role: 'measure', dataType: 'number', description: 'Base pay before tips', aggregation: 'SUM' },
      { id: 'f-sql5-m3', name: 'tip_amount', role: 'measure', dataType: 'number', description: 'Tip received by dasher', aggregation: 'SUM' },
      { id: 'f-sql5-m4', name: 'active_dashers', role: 'measure', dataType: 'number', description: 'Dashers with at least one delivery', aggregation: 'COUNT' },
      { id: 'f-sql5-m5', name: 'avg_hourly_rate', role: 'measure', dataType: 'number', description: 'Effective hourly earnings rate', aggregation: 'AVG' },
      { id: 'f-sql5-m6', name: 'deliveries_per_hour', role: 'measure', dataType: 'number', description: 'Deliveries completed per active hour', aggregation: 'AVG' },
    ],
    dimensions: [
      { id: 'f-sql5-d1', name: 'market_name', role: 'dimension', dataType: 'string', description: 'Dasher operating market' },
      { id: 'f-sql5-d2', name: 'vehicle_type', role: 'dimension', dataType: 'string', description: 'Delivery vehicle type' },
      { id: 'f-sql5-d3', name: 'dasher_tier', role: 'dimension', dataType: 'string', description: 'Dasher performance tier' },
    ],
    dateFields: [
      { id: 'f-sql5-dt1', name: 'pay_date', role: 'date', dataType: 'date', description: 'Date of payment' },
      { id: 'f-sql5-dt2', name: 'shift_date', role: 'date', dataType: 'date', description: 'Date of shift worked' },
    ],
  },

  'sem-1': {
    measures: [
      { id: 'f-sem1-m1', name: 'total_orders', role: 'measure', dataType: 'number', description: 'Total order count', aggregation: 'SUM' },
      { id: 'f-sem1-m2', name: 'gross_order_value', role: 'measure', dataType: 'number', description: 'Gross value of all orders', aggregation: 'SUM' },
      { id: 'f-sem1-m3', name: 'avg_basket_size', role: 'measure', dataType: 'number', description: 'Average order value', aggregation: 'AVG' },
      { id: 'f-sem1-m4', name: 'order_cancellation_rate', role: 'measure', dataType: 'number', description: 'Percentage of orders cancelled', aggregation: 'AVG' },
      { id: 'f-sem1-m5', name: 'reorder_rate', role: 'measure', dataType: 'number', description: 'Rate of repeat orders from same consumer', aggregation: 'AVG' },
    ],
    dimensions: [
      { id: 'f-sem1-d1', name: 'market', role: 'dimension', dataType: 'string', description: 'Market name' },
      { id: 'f-sem1-d2', name: 'channel', role: 'dimension', dataType: 'string', description: 'Ordering channel' },
      { id: 'f-sem1-d3', name: 'is_dashpass', role: 'dimension', dataType: 'string', description: 'DashPass order indicator' },
      { id: 'f-sem1-d4', name: 'merchant_category', role: 'dimension', dataType: 'string', description: 'Merchant cuisine category' },
    ],
    dateFields: [
      { id: 'f-sem1-dt1', name: 'order_date', role: 'date', dataType: 'date', description: 'Date of order' },
      { id: 'f-sem1-dt2', name: 'week', role: 'date', dataType: 'date', description: 'ISO week of order' },
    ],
  },

  'sem-2': {
    measures: [
      { id: 'f-sem2-m1', name: 'p50_delivery_time', role: 'measure', dataType: 'number', description: 'Median delivery time in minutes', aggregation: 'AVG' },
      { id: 'f-sem2-m2', name: 'p90_delivery_time', role: 'measure', dataType: 'number', description: '90th percentile delivery time', aggregation: 'AVG' },
      { id: 'f-sem2-m3', name: 'on_time_rate', role: 'measure', dataType: 'number', description: 'Percentage delivered within promised window', aggregation: 'AVG' },
      { id: 'f-sem2-m4', name: 'dasher_wait_time', role: 'measure', dataType: 'number', description: 'Time dasher waited at merchant', aggregation: 'AVG' },
      { id: 'f-sem2-m5', name: 'sla_breach_count', role: 'measure', dataType: 'number', description: 'Deliveries that breached SLA threshold', aggregation: 'COUNT' },
      { id: 'f-sem2-m6', name: 'perfect_delivery_rate', role: 'measure', dataType: 'number', description: 'Orders with no issues reported', aggregation: 'AVG' },
    ],
    dimensions: [
      { id: 'f-sem2-d1', name: 'market', role: 'dimension', dataType: 'string', description: 'Delivery market' },
      { id: 'f-sem2-d2', name: 'time_of_day', role: 'dimension', dataType: 'string', description: 'Meal period (breakfast, lunch, dinner, late night)' },
      { id: 'f-sem2-d3', name: 'store_type', role: 'dimension', dataType: 'string', description: 'Merchant store type' },
    ],
    dateFields: [
      { id: 'f-sem2-dt1', name: 'delivery_date', role: 'date', dataType: 'date', description: 'Date of delivery' },
    ],
  },

  'sem-3': {
    measures: [
      { id: 'f-sem3-m1', name: 'net_revenue', role: 'measure', dataType: 'number', description: 'Revenue after refunds and credits', aggregation: 'SUM' },
      { id: 'f-sem3-m2', name: 'commission_revenue', role: 'measure', dataType: 'number', description: 'Revenue from merchant commission', aggregation: 'SUM' },
      { id: 'f-sem3-m3', name: 'delivery_fee_revenue', role: 'measure', dataType: 'number', description: 'Revenue from delivery fees', aggregation: 'SUM' },
      { id: 'f-sem3-m4', name: 'contribution_margin', role: 'measure', dataType: 'number', description: 'Revenue minus variable costs', aggregation: 'SUM' },
      { id: 'f-sem3-m5', name: 'revenue_per_order', role: 'measure', dataType: 'number', description: 'Average revenue per order', aggregation: 'AVG' },
    ],
    dimensions: [
      { id: 'f-sem3-d1', name: 'revenue_stream', role: 'dimension', dataType: 'string', description: 'Source of revenue' },
      { id: 'f-sem3-d2', name: 'merchant_tier', role: 'dimension', dataType: 'string', description: 'Merchant partnership tier' },
      { id: 'f-sem3-d3', name: 'market', role: 'dimension', dataType: 'string', description: 'Geographic market' },
      { id: 'f-sem3-d4', name: 'is_dashpass', role: 'dimension', dataType: 'string', description: 'DashPass order indicator' },
    ],
    dateFields: [
      { id: 'f-sem3-dt1', name: 'revenue_date', role: 'date', dataType: 'date', description: 'Date revenue was recognized' },
      { id: 'f-sem3-dt2', name: 'fiscal_week', role: 'date', dataType: 'date', description: 'Fiscal week of revenue' },
    ],
  },

  'sem-4': {
    measures: [
      { id: 'f-sem4-m1', name: 'csat_score', role: 'measure', dataType: 'number', description: 'Customer satisfaction score (1-5)', aggregation: 'AVG' },
      { id: 'f-sem4-m2', name: 'nps_score', role: 'measure', dataType: 'number', description: 'Net Promoter Score (-100 to 100)', aggregation: 'AVG' },
      { id: 'f-sem4-m3', name: 'contact_rate', role: 'measure', dataType: 'number', description: 'Rate of contacts per order', aggregation: 'AVG' },
      { id: 'f-sem4-m4', name: 'refund_rate', role: 'measure', dataType: 'number', description: 'Percentage of orders receiving refund', aggregation: 'AVG' },
    ],
    dimensions: [
      { id: 'f-sem4-d1', name: 'issue_category', role: 'dimension', dataType: 'string', description: 'Category of customer issue' },
      { id: 'f-sem4-d2', name: 'resolution_type', role: 'dimension', dataType: 'string', description: 'How the issue was resolved' },
      { id: 'f-sem4-d3', name: 'market', role: 'dimension', dataType: 'string', description: 'Customer market' },
    ],
    dateFields: [
      { id: 'f-sem4-dt1', name: 'survey_date', role: 'date', dataType: 'date', description: 'Date survey was submitted' },
    ],
  },

  'met-1': {
    measures: [
      { id: 'f-met1-m1', name: 'gov', role: 'measure', dataType: 'number', description: 'Gross Order Value', aggregation: 'SUM' },
    ],
    dimensions: [],
    dateFields: [],
  },

  'met-2': {
    measures: [
      { id: 'f-met2-m1', name: 'net_revenue', role: 'measure', dataType: 'number', description: 'Net Revenue after refunds and credits', aggregation: 'SUM' },
    ],
    dimensions: [],
    dateFields: [],
  },

  'met-3': {
    measures: [
      { id: 'f-met3-m1', name: 'active_dashers', role: 'measure', dataType: 'number', description: 'Active Dashers with >= 1 delivery', aggregation: 'SUM' },
    ],
    dimensions: [],
    dateFields: [],
  },

  'met-4': {
    measures: [
      { id: 'f-met4-m1', name: 'p50_delivery_time', role: 'measure', dataType: 'number', description: 'P50 Delivery Time in minutes', aggregation: 'AVG' },
    ],
    dimensions: [],
    dateFields: [],
  },

  'met-5': {
    measures: [
      { id: 'f-met5-m1', name: 'dashpass_subscribers', role: 'measure', dataType: 'number', description: 'Total paid DashPass subscribers', aggregation: 'SUM' },
    ],
    dimensions: [],
    dateFields: [],
  },

  'met-6': {
    measures: [
      { id: 'f-met6-m1', name: 'consumer_maus', role: 'measure', dataType: 'number', description: 'Consumer Monthly Active Users (L28)', aggregation: 'SUM' },
    ],
    dimensions: [],
    dateFields: [],
  },
};

// Lookup for mock data generation: dimension name → possible values
export const DIMENSION_LABELS: Record<string, string[]> = {
  market_name: ['Los Angeles', 'New York', 'San Francisco', 'Chicago', 'Austin', 'Seattle', 'Miami'],
  market: ['Los Angeles', 'New York', 'San Francisco', 'Chicago', 'Austin', 'Seattle', 'Miami'],
  store_type: ['Restaurant', 'Grocery', 'Convenience', 'Alcohol', 'Pharmacy'],
  delivery_status: ['Delivered', 'Cancelled', 'Undelivered', 'Returned'],
  order_status: ['Completed', 'Cancelled', 'Refunded', 'In Progress'],
  platform: ['iOS', 'Android', 'Web', 'Tablet'],
  is_dashpass: ['Yes', 'No'],
  cuisine_type: ['American', 'Mexican', 'Chinese', 'Italian', 'Thai', 'Indian', 'Japanese', 'Pizza'],
  merchant_tier: ['Gold', 'Silver', 'Bronze', 'Enterprise'],
  city: ['Los Angeles', 'New York', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
  is_national_chain: ['Yes', 'No'],
  dashpass_status: ['Active', 'Cancelled', 'Trial', 'Paused'],
  consumer_segment: ['Power User', 'Casual', 'At Risk', 'Lapsed', 'New'],
  vehicle_type: ['Car', 'Bicycle', 'Scooter', 'Walking'],
  dasher_tier: ['Top Dasher', 'Standard', 'New'],
  channel: ['iOS', 'Android', 'Web', 'Drive', 'Storefront'],
  merchant_category: ['Restaurant', 'Grocery', 'Convenience', 'Retail'],
  time_of_day: ['Breakfast', 'Lunch', 'Dinner', 'Late Night'],
  revenue_stream: ['Commission', 'Delivery Fees', 'DashPass Fees', 'Ads', 'Drive'],
  issue_category: ['Missing Item', 'Late Delivery', 'Wrong Item', 'Quality', 'Dasher Issue'],
  resolution_type: ['Refund', 'Credit', 'Reorder', 'No Action', 'Escalated'],
  cohort_month: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'],
};

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates mock chart data rows for a given set of measures and dimensions.
 * If dimensions are provided, generates one row per dimension value combination.
 * Otherwise generates a time-series of 8 data points.
 */
export function generateMockChartData(
  measures: ChartBuilderField[],
  dimensions: ChartBuilderField[],
  dateField?: ChartBuilderField
): Record<string, unknown>[] {
  const primaryDimension = dimensions[0];
  const measureNames = measures.map((m) => m.name);

  if (primaryDimension && DIMENSION_LABELS[primaryDimension.name]) {
    const labels = DIMENSION_LABELS[primaryDimension.name].slice(0, 6);
    return labels.map((label) => {
      const row: Record<string, unknown> = { [primaryDimension.name]: label };
      for (const name of measureNames) {
        row[name] = randomBetween(1000, 50000);
      }
      return row;
    });
  }

  // Time-series fallback
  const now = new Date();
  return Array.from({ length: 8 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (7 - i));
    const row: Record<string, unknown> = {
      [dateField?.name ?? 'date']: date.toISOString().slice(0, 10),
    };
    for (const name of measureNames) {
      row[name] = randomBetween(5000, 100000);
    }
    return row;
  });
}

/**
 * Generates a single KPI value object for a measure field.
 */
export function generateMockKpiData(_measure: ChartBuilderField): {
  value: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
} {
  const rawValue = randomBetween(10000, 9999999);
  const changePercent = (Math.random() * 20 - 10).toFixed(1);
  const changeNum = parseFloat(changePercent);

  let value: string;
  if (rawValue >= 1_000_000) {
    value = `${(rawValue / 1_000_000).toFixed(1)}M`;
  } else if (rawValue >= 1_000) {
    value = `${(rawValue / 1_000).toFixed(1)}K`;
  } else {
    value = rawValue.toString();
  }

  return {
    value,
    change: `${changeNum >= 0 ? '+' : ''}${changePercent}%`,
    trend: changeNum > 0.5 ? 'up' : changeNum < -0.5 ? 'down' : 'flat',
  };
}

// Re-export ChartType for consumers of this module
export type { ChartType };
