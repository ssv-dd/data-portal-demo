import { BarChart3, TrendingUp, Users, DollarSign, ShoppingCart, Package, Clock, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MetricLibraryItem {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  description: string;
  format?: 'number' | 'currency' | 'percent';
}

export const metricLibrary: MetricLibraryItem[] = [
  {
    id: 'm1',
    name: 'Total Revenue',
    category: 'Financial',
    icon: DollarSign,
    description: 'Total revenue across all channels',
    format: 'currency',
  },
  {
    id: 'm2',
    name: 'Active Users',
    category: 'Engagement',
    icon: Users,
    description: 'Monthly active users',
    format: 'number',
  },
  {
    id: 'm3',
    name: 'Conversion Rate',
    category: 'Sales',
    icon: TrendingUp,
    description: 'Overall conversion rate',
    format: 'percent',
  },
  {
    id: 'm4',
    name: 'Order Volume',
    category: 'Operations',
    icon: ShoppingCart,
    description: 'Total number of orders',
    format: 'number',
  },
  {
    id: 'm5',
    name: 'Customer Satisfaction',
    category: 'Quality',
    icon: Star,
    description: 'Average CSAT score',
    format: 'number',
  },
  {
    id: 'm6',
    name: 'Delivery Time',
    category: 'Operations',
    icon: Clock,
    description: 'Average delivery time in minutes',
    format: 'number',
  },
  {
    id: 'm7',
    name: 'Items per Order',
    category: 'Sales',
    icon: Package,
    description: 'Average items per order',
    format: 'number',
  },
  {
    id: 'm8',
    name: 'Revenue Growth',
    category: 'Financial',
    icon: TrendingUp,
    description: 'Month-over-month revenue growth',
    format: 'percent',
  },
  {
    id: 'm9',
    name: 'Active Dashers',
    category: 'Operations',
    icon: Users,
    description: 'Number of active delivery drivers',
    format: 'number',
  },
  {
    id: 'm10',
    name: 'Customer Metrics',
    category: 'Engagement',
    icon: BarChart3,
    description: 'Overview of customer engagement metrics',
    format: 'number',
  },
];
