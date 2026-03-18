export interface Artifact {
  id: string;
  type: 'sql' | 'notebook' | 'dashboard';
  title: string;
  description: string;
  owner: string;
  created: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
  source?: string;
  confidence?: 'high' | 'medium' | 'low';
  sql?: string;
  tags?: string[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  resultCards?: Artifact[];
}

export interface TelemetryEvent {
  id: string;
  time: string;
  artifact: string;
  owner: string;
  status: 'success' | 'pending' | 'failed';
  log: string;
}

export const artifacts: Artifact[] = [
  {
    id: 'orders_by_city',
    type: 'sql',
    title: 'Orders by City',
    description: 'Completed orders by city over the last 30 days',
    owner: 'A. Patel',
    created: '2026-03-01',
    verified: true,
    verifiedBy: 'A. Patel',
    verifiedDate: '2026-03-02',
    source: 'orders',
    confidence: 'high',
    tags: ['core:orders', 'geography'],
    sql: `SELECT city, COUNT(*) AS completed_orders
FROM orders
WHERE status = 'completed' AND order_placed_at >= DATEADD(day, -30, CURRENT_DATE)
GROUP BY city
ORDER BY completed_orders DESC;`
  },
  {
    id: 'delivery_latency_by_zone',
    type: 'sql',
    title: 'Delivery Latency by Zone',
    description: 'Average delivery time by zone over the last 14 days',
    owner: 'M. Chen',
    created: '2026-02-27',
    verified: false,
    source: 'deliveries',
    confidence: 'medium',
    tags: ['logistics', 'performance'],
    sql: `SELECT zone_id, AVG(delivery_time_minutes) AS avg_latency
FROM deliveries
WHERE delivered_at >= DATEADD(day, -14, CURRENT_DATE)
GROUP BY zone_id
ORDER BY avg_latency DESC;`
  },
  {
    id: 'courier_availability',
    type: 'notebook',
    title: 'Courier Availability Analysis',
    description: 'Feature exploration & distribution for courier supply model. Contains feature compute SQL, histograms, and model eval charts.',
    owner: 'S. Lee',
    created: '2026-02-20',
    verified: true,
    verifiedBy: 'S. Lee',
    verifiedDate: '2026-02-21',
    tags: ['couriers', 'ml-features']
  },
  {
    id: 'ops_dashboard',
    type: 'dashboard',
    title: 'Operations Dashboard',
    description: 'Ops dashboard: delivery latency, completed orders, courier active count.',
    owner: 'Ops Team',
    created: '2026-03-03',
    verified: false,
    tags: ['operations', 'monitoring']
  },
  {
    id: 'revenue_by_region',
    type: 'sql',
    title: 'Revenue by Region',
    description: 'Total revenue aggregated by region',
    owner: 'J. Smith',
    created: '2026-03-05',
    verified: true,
    verifiedBy: 'J. Smith',
    verifiedDate: '2026-03-05',
    source: 'orders',
    confidence: 'high',
    tags: ['revenue', 'geography'],
    sql: `SELECT region, SUM(order_value) AS total_revenue
FROM orders
WHERE status = 'completed'
GROUP BY region
ORDER BY total_revenue DESC;`
  },
  {
    id: 'courier_efficiency',
    type: 'sql',
    title: 'Courier Efficiency Metrics',
    description: 'Deliveries per hour by courier',
    owner: 'M. Chen',
    created: '2026-03-04',
    verified: false,
    source: 'couriers',
    confidence: 'low',
    tags: ['couriers', 'efficiency']
  }
];

export const conversations: ConversationMessage[] = [
  {
    id: 'conv_1',
    role: 'assistant',
    content: "Hi — ask me anything about orders, delivery, couriers or revenue. Try: 'Why did completed orders drop in SF on Mar 5?'",
    timestamp: '2026-03-10T09:00:00Z'
  }
];

export const telemetryEvents: TelemetryEvent[] = [
  {
    id: 'evt_1',
    time: '2026-03-10T09:54:00Z',
    artifact: 'orders_by_city.sql',
    owner: 'A. Patel',
    status: 'success',
    log: 'Asset verified and added to AI training corpus. Schema validation: PASS, PII scan: PASS'
  },
  {
    id: 'evt_2',
    time: '2026-03-10T09:48:00Z',
    artifact: 'delivery_latency_by_zone.sql',
    owner: 'M. Chen',
    status: 'pending',
    log: 'Awaiting verification approval. Automated tests: PASS, Manual review: PENDING'
  },
  {
    id: 'evt_3',
    time: '2026-03-10T09:40:00Z',
    artifact: 'courier_efficiency.sql',
    owner: 'M. Chen',
    status: 'failed',
    log: 'Performance threshold exceeded. Query timeout after 30s. Optimization required.'
  },
  {
    id: 'evt_4',
    time: '2026-03-10T09:30:00Z',
    artifact: 'revenue_by_region.sql',
    owner: 'J. Smith',
    status: 'success',
    log: 'Successfully ingested and indexed. Available for AI queries.'
  }
];

export const telemetryKPIs = {
  lastIngest: '6 min ago',
  retrainQueueLength: 2,
  verifiedAssetsCount: 127,
  hallucinations: 3,
  lastVerifiedAsset: 'orders_by_city.sql',
  lastVerifiedBy: 'A. Patel'
};

// --- Ported from Vision V1 (Quick Access / Golden Dashboards) ---

export type UserRole = 'business-executive' | 'business-executive-pa' | 'so-analyst' | 'data-scientist' | 'data-engineer';

export interface SearchResult {
  id: string;
  name: string;
  type: 'dashboard' | 'table' | 'metric';
  description: string;
  lastUpdated?: string;
  owner?: string;
  tags?: string[];
  verified?: boolean;
  isPedregal?: boolean;
}

export interface GoldenDashboard {
  id: string;
  title: string;
  description: string;
  chartType: 'line' | 'area' | 'bar';
  data: { month?: string; name?: string; value: number }[];
  dataKey: string;
  color: string;
  icon?: string;
  thumbnail?: string;
}

function generateGoldenChartData(points: number = 12): { month: string; value: number }[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return Array.from({ length: points }, (_, i) => ({
    month: months[i % 12],
    value: Math.floor(Math.random() * 5000) + 2000
  }));
}

export const goldenDashboards: Record<UserRole, GoldenDashboard[]> = {
  'business-executive': [
    {
      id: 'gd-be-4',
      title: 'Company Performance Dashboard',
      description: 'Comprehensive company-wide metrics',
      chartType: 'area',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#f59e0b',
      icon: '📊'
    },
    {
      id: 'gd-be-1',
      title: 'Executive Revenue Overview',
      description: 'Global revenue performance and trends',
      chartType: 'area',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#8b5cf6',
      icon: '💰'
    },
    {
      id: 'gd-be-2',
      title: 'Market Share Analysis',
      description: 'Market penetration across regions',
      chartType: 'bar',
      data: generateGoldenChartData(8),
      dataKey: 'value',
      color: '#3b82f6',
      icon: '🎯'
    },
    {
      id: 'gd-be-3',
      title: 'Customer Growth Metrics',
      description: 'User acquisition and retention trends',
      chartType: 'line',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#10b981',
      icon: '📈'
    }
  ],
  'business-executive-pa': [
    {
      id: 'gd-be-4',
      title: 'Company Performance Dashboard',
      description: 'Comprehensive company-wide metrics',
      chartType: 'area',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#f59e0b',
      icon: '📊'
    },
    {
      id: 'gd-be-1',
      title: 'Executive Revenue Overview',
      description: 'Global revenue performance and trends',
      chartType: 'area',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#8b5cf6',
      icon: '💰'
    },
    {
      id: 'gd-be-2',
      title: 'Market Share Analysis',
      description: 'Market penetration across regions',
      chartType: 'bar',
      data: generateGoldenChartData(8),
      dataKey: 'value',
      color: '#3b82f6',
      icon: '🎯'
    },
    {
      id: 'gd-be-3',
      title: 'Customer Growth Metrics',
      description: 'User acquisition and retention trends',
      chartType: 'line',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#10b981',
      icon: '📈'
    }
  ],
  'so-analyst': [
    {
      id: 'gd-soa-1',
      title: 'Operational Efficiency Dashboard',
      description: 'Key operational metrics and KPIs',
      chartType: 'line',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#8b5cf6'
    },
    {
      id: 'gd-soa-2',
      title: 'Market Analysis',
      description: 'Competitive landscape and trends',
      chartType: 'area',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#f59e0b'
    },
    {
      id: 'gd-soa-3',
      title: 'Performance Metrics',
      description: 'Strategic initiative performance',
      chartType: 'bar',
      data: generateGoldenChartData(10),
      dataKey: 'value',
      color: '#3b82f6'
    }
  ],
  'data-scientist': [
    {
      id: 'gd-ds-1',
      title: 'Core Consumer Funnel',
      description: 'End-to-end conversion metrics',
      chartType: 'area',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#8b5cf6'
    },
    {
      id: 'gd-ds-2',
      title: 'Homepage Performance',
      description: 'Homepage engagement and conversion',
      chartType: 'line',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#10b981'
    },
    {
      id: 'gd-ds-3',
      title: 'User Behavior Analysis',
      description: 'User interaction patterns',
      chartType: 'bar',
      data: generateGoldenChartData(10),
      dataKey: 'value',
      color: '#3b82f6'
    },
    {
      id: 'gd-ds-4',
      title: 'Search Performance',
      description: 'Search quality and relevance metrics',
      chartType: 'area',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#ef4444'
    }
  ],
  'data-engineer': [
    {
      id: 'gd-de-1',
      title: 'Pipeline Health Dashboard',
      description: 'ETL pipeline monitoring and performance',
      chartType: 'line',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#10b981'
    },
    {
      id: 'gd-de-2',
      title: 'Data Quality Metrics',
      description: 'Data validation and quality scores',
      chartType: 'bar',
      data: generateGoldenChartData(8),
      dataKey: 'value',
      color: '#8b5cf6'
    },
    {
      id: 'gd-de-3',
      title: 'Storage & Cost Analytics',
      description: 'Infrastructure cost optimization',
      chartType: 'area',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#ef4444'
    },
    {
      id: 'gd-de-4',
      title: 'Real-time Streaming',
      description: 'Stream processing and throughput',
      chartType: 'line',
      data: generateGoldenChartData(),
      dataKey: 'value',
      color: '#3b82f6'
    }
  ]
};
