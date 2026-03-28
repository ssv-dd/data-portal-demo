import type { WidgetConfig } from '@/types';

export const COLORS = ['#FF3A00', '#FF6B3D', '#FF9C7A', '#FFCDB7', '#FFE8DF'];

export const ordersData = [
  { name: 'Mon', value: 12400 }, { name: 'Tue', value: 13100 },
  { name: 'Wed', value: 14200 }, { name: 'Thu', value: 13800 },
  { name: 'Fri', value: 15600 }, { name: 'Sat', value: 18200 },
  { name: 'Sun', value: 17100 },
];

export const revenueData = [
  { name: 'Jan', value: 42 }, { name: 'Feb', value: 45 },
  { name: 'Mar', value: 48 }, { name: 'Apr', value: 51 },
  { name: 'May', value: 49 }, { name: 'Jun', value: 55 },
];

export const latencyData = [
  { name: 'SF', value: 28 }, { name: 'NYC', value: 32 },
  { name: 'LA', value: 35 }, { name: 'CHI', value: 30 },
  { name: 'BOS', value: 27 },
];

export const marketShareData = [
  { name: 'DoorDash', value: 67 }, { name: 'Uber Eats', value: 23 },
  { name: 'Grubhub', value: 7 }, { name: 'Other', value: 3 },
];

export const widgets: WidgetConfig[] = [
  { id: 'w1', title: 'Total Orders', subtitle: 'This week', type: 'kpi', kpiValue: '104,400', kpiChange: '+8.2%', kpiTrend: 'up' },
  { id: 'w2', title: 'Revenue (GMV)', subtitle: 'Last 6 months ($M)', type: 'kpi', kpiValue: '$290M', kpiChange: '+12.4%', kpiTrend: 'up' },
  { id: 'w3', title: 'Avg Delivery Time', subtitle: 'P50, minutes', type: 'kpi', kpiValue: '30.4 min', kpiChange: '-2.1%', kpiTrend: 'down' },
  { id: 'w4', title: 'Active Dashers', subtitle: 'Currently online', type: 'kpi', kpiValue: '48,291', kpiChange: '+0.3%', kpiTrend: 'flat' },
  { id: 'w5', title: 'Orders by Day', subtitle: 'This week', type: 'bar', data: ordersData },
  { id: 'w6', title: 'Revenue Trend', subtitle: 'Monthly GMV ($M)', type: 'area', data: revenueData },
  { id: 'w7', title: 'Delivery Latency by City', subtitle: 'P50 minutes, last 14 days', type: 'bar', data: latencyData },
  { id: 'w8', title: 'Market Share', subtitle: 'US delivery platforms', type: 'pie', data: marketShareData },
];
