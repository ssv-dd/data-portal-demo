import type { SavedQuery, QueryHistoryItem, CatalogItem } from '@/types';

export const mockSavedQueries: SavedQuery[] = [
  { id: '1', title: 'Revenue by region and product', description: 'Aggregated revenue metrics by region', lastEdited: '2 hours ago', owner: 'Tony', shared: false },
  { id: '2', title: 'Customer churn analysis', description: 'Monthly customer retention metrics', lastEdited: '1 day ago', owner: 'Tony', shared: true },
  { id: '3', title: 'Delivery performance KPIs', description: 'Dasher efficiency and on-time metrics', lastEdited: '3 days ago', owner: 'Tony', shared: false },
  { id: '4', title: 'DashPass conversion funnel', description: 'Free trial → paid subscription rates', lastEdited: '5 hours ago', owner: 'Tony', shared: true },
  { id: '5', title: 'Merchant GMV ranking', description: 'Top merchants by gross merchandise value', lastEdited: '1 day ago', owner: 'Tony', shared: false },
  { id: '6', title: 'Weekly order volume', description: 'Order counts by day of week', lastEdited: '4 days ago', owner: 'Tony', shared: true },
];

export const queryHistory: QueryHistoryItem[] = [
  { id: '1', title: 'Revenue by region and product', timestamp: '2m ago' },
  { id: '2', title: 'User analytics summary', timestamp: '1h ago' },
  { id: '3', title: 'Top products last 7 days', timestamp: 'Yesterday' },
  { id: '4', title: 'Courier efficiency by zone', timestamp: '2 days ago' },
];

export const catalogData: CatalogItem[] = [
  {
    id: 'catalog',
    name: 'CATALOG — P&P-ORDER',
    type: 'folder',
    children: [
      { id: 'warehouse', name: 'warehouse', type: 'folder' },
      { id: 'analytics', name: 'analytics', type: 'folder' },
      { id: 'fact_orders', name: 'fact_orders', type: 'table' },
      { id: 'dim_region', name: 'dim_region', type: 'table' },
      { id: 'dim_product', name: 'dim_product', type: 'table' },
      { id: 'dim_customer', name: 'dim_customer', type: 'table' },
      { id: 'fact_deliveries', name: 'fact_deliveries', type: 'table' },
    ],
  },
];

export const sampleResults = [
  { region_name: 'West', product_name: 'Premium', total_revenue: 125430.00, order_count: 342 },
  { region_name: 'East', product_name: 'Standard', total_revenue: 98210.50, order_count: 521 },
  { region_name: 'West', product_name: 'Standard', total_revenue: 87340.25, order_count: 463 },
  { region_name: 'Central', product_name: 'Premium', total_revenue: 76520.00, order_count: 198 },
  { region_name: 'East', product_name: 'Premium', total_revenue: 72890.75, order_count: 287 },
  { region_name: 'Central', product_name: 'Standard', total_revenue: 61230.50, order_count: 312 },
  { region_name: 'South', product_name: 'Premium', total_revenue: 54120.00, order_count: 156 },
  { region_name: 'South', product_name: 'Standard', total_revenue: 43890.25, order_count: 234 },
];

export const DEFAULT_SQL = `-- Revenue by region and product
SELECT
  r.region_name,
  p.product_name,
  SUM(f.revenue) AS total_revenue,
  COUNT(DISTINCT f.order_id) AS order_count
FROM fact_orders f
JOIN dim_region r ON f.region_id = r.region_id
JOIN dim_product p ON f.product_id = p.product_id
WHERE f.order_date > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY r.region_name, p.product_name
ORDER BY total_revenue DESC
LIMIT 100;`;
